import "server-only";
import { getDb } from "@/lib/db/client";
import { getOrderDetailInternal, type OrderDetail } from "@/lib/commerce/orders";
import type { OrderStatus } from "@/lib/commerce/order-status";
import { toCarrierId } from "@/lib/commerce/carriers";
import type { SlipVerdict } from "@/lib/commerce/slip-decision";
import { SHIPNITY_SKU_MAP } from "@/data/stock/sku-map";
import { cleanTracking, stepsFor, warehouseText, type StaffAction } from "./order-actions";
import { getStockIssue, orderLines, type StockIssue, type StockIssueLine } from "@/lib/commerce/stock-issues";
import { cleanOrderMessage } from "@/lib/commerce/order-message-rules";
import { insertCustomerMessage } from "@/lib/commerce/order-messages";

/**
 * The staff order list and its buttons (cart round 22/10, round batch 2). Reached only through /staff pages and
 * actions that check the staff session first. Every status change goes through `stepsFor` (legal BSOT §9 transitions)
 * and is written to the order's history with who-did-it = "staff" and the staff note, so the customer's order page
 * follows along.
 */

export interface StaffOrderRow {
  orderNumber: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  recipientName: string;
  province: string;
  itemCount: number;
  slipVerdict: SlipVerdict | null;
}

/** "todo" = everything a person still has to act on (paid and not shipped, or cancelled-pending nothing);
 *  "unpaid" = placed, no slip yet; "all" = the newest 200. */
export type StaffOrderFilter = "todo" | "unpaid" | "all";

const FILTER_SQL: Record<StaffOrderFilter, string> = {
  todo: "o.status IN ('payment_submitted','awaiting_verification','approved','processing')",
  unpaid: "o.status = 'pending_payment'",
  all: "1 = 1",
};

export function listStaffOrders(filter: StaffOrderFilter): StaffOrderRow[] {
  const rows = getDb()
    .prepare(
      `SELECT o.order_number, o.status, o.total, o.created_at, a.recipient_name, a.province,
              (SELECT COALESCE(SUM(quantity), 0) FROM order_items i WHERE i.order_id = o.id) AS item_count,
              (SELECT slip_verdict FROM order_payment_submissions s WHERE s.order_id = o.id ORDER BY s.id DESC LIMIT 1) AS slip_verdict
         FROM orders o JOIN order_shipping_addresses a ON a.order_id = o.id
        WHERE ${FILTER_SQL[filter]}
        ORDER BY o.id DESC LIMIT 200`
    )
    .all() as {
    order_number: string;
    status: OrderStatus;
    total: number;
    created_at: string;
    recipient_name: string;
    province: string;
    item_count: number;
    slip_verdict: SlipVerdict | null;
  }[];
  return rows.map((r) => ({
    orderNumber: r.order_number,
    status: r.status,
    total: r.total,
    createdAt: r.created_at,
    recipientName: r.recipient_name,
    province: r.province,
    itemCount: r.item_count,
    slipVerdict: r.slip_verdict,
  }));
}

export function countTodo(): number {
  return (getDb().prepare(`SELECT COUNT(*) AS n FROM orders o WHERE ${FILTER_SQL.todo}`).get() as { n: number }).n;
}

export interface StaffOrderDetail extends OrderDetail {
  customerPhone: string;
  trackingNumber: string | null;
  /** The customer's optional note to the shop from the review step (cart UX batch C) — staff page only. */
  customerNote: string | null;
  slip: { verdict: SlipVerdict | null; reasons: string[]; transRef: string | null; amount: number | null; submittedAt: string } | null;
  lines: { sku: string | null; name: string; quantity: number }[];
  warehouseText: string;
  /** Out of stock after payment (cart UX batch E) — null when nobody marked a line out. */
  stockIssue: StockIssue | null;
  /** The order lines with their ids (the "which lines are out" checkboxes), same order as `items`. */
  itemLines: StockIssueLine[];
}

function skuFor(productSlug: string, variantId: string | null): string | null {
  const entry = SHIPNITY_SKU_MAP[productSlug];
  if (!entry) return null;
  const value = entry.options ? (variantId ? entry.options[variantId] : undefined) : entry.product;
  return typeof value === "string" && value !== "check" ? value : null;
}

export function getStaffOrder(orderNumber: string): StaffOrderDetail | null {
  const order = getOrderDetailInternal(orderNumber);
  if (!order) return null;
  const db = getDb();
  const extra = db
    .prepare("SELECT o.tracking_number, o.customer_note, c.phone FROM orders o JOIN customers c ON c.id = o.customer_id WHERE o.id = ?")
    .get(order.id) as { tracking_number: string | null; customer_note: string | null; phone: string };
  const slipRow = db
    .prepare(
      "SELECT slip_verdict, slip_reasons, slip_trans_ref, slip_amount_satang, submitted_at FROM order_payment_submissions WHERE order_id = ? ORDER BY id DESC LIMIT 1"
    )
    .get(order.id) as
    | { slip_verdict: SlipVerdict | null; slip_reasons: string | null; slip_trans_ref: string | null; slip_amount_satang: number | null; submitted_at: string }
    | undefined;

  const lines = order.items.map((i) => ({
    sku: skuFor(i.productSlug, i.variantId),
    name: `${i.productName}${i.variantLabel ? ` ${i.variantLabel}` : ""}`,
    quantity: i.quantity,
  }));
  const stockIssue = getStockIssue(order.id);
  const itemLines = orderLines(order.id);
  // A partial refund (batch E): the refunded lines are not sent — they leave the warehouse text (they stay on the order
  // page and in the totals, which are what the customer paid).
  const refundedIds = new Set(stockIssue?.resolution === "refunded" ? stockIssue.outLines.map((l) => l.itemId) : []);
  const shipLines = lines.filter((_, idx) => !refundedIds.has(itemLines[idx]?.itemId ?? -1));
  const a = order.shippingAddress;
  return {
    ...order,
    customerPhone: extra.phone,
    trackingNumber: extra.tracking_number,
    customerNote: extra.customer_note,
    slip: slipRow
      ? {
          verdict: slipRow.slip_verdict,
          reasons: slipRow.slip_reasons ? slipRow.slip_reasons.split(",") : [],
          transRef: slipRow.slip_trans_ref,
          amount: slipRow.slip_amount_satang === null ? null : slipRow.slip_amount_satang / 100,
          submittedAt: slipRow.submitted_at,
        }
      : null,
    lines,
    stockIssue,
    itemLines,
    warehouseText: warehouseText({
      orderNumber: order.orderNumber,
      lines: shipLines,
      recipientName: a.recipientName,
      phone: a.phone,
      address: `${a.line1} ต.${a.subdistrict} อ.${a.district} จ.${a.province} ${a.postalCode}`,
    }),
  };
}

export type StaffActionResult = { ok: true } | { ok: false; error: "not-found" | "not-allowed" | "tracking" | "carrier" | "note" | "message" };

export function applyStaffAction(
  orderNumber: string,
  action: StaffAction,
  input: { tracking?: string; carrier?: string; note?: string; message?: string }
): StaffActionResult {
  const db = getDb();
  const note = (input.note ?? "").trim().slice(0, 300);
  const tracking = action === "ship" ? cleanTracking(input.tracking ?? "") : null;
  if (action === "ship" && !tracking) return { ok: false, error: "tracking" };
  // Staff pick the carrier with the number — never guessed from it (owner 23/10: the order page names it).
  const carrier = action === "ship" ? toCarrierId(input.carrier) : null;
  if (action === "ship" && !carrier) return { ok: false, error: "carrier" };
  // A cancellation always tells the CUSTOMER why (owner 24/10: "ยกเลิกเพราะอะไร และไปขั้นตอนไหนต่อ") — the message shows on
  // their order page; the staff note beside it stays staff-only and may be left empty (then the message is the history note).
  const message = action === "cancel" ? cleanOrderMessage(input.message) : null;
  if (action === "cancel" && !message) return { ok: false, error: "message" };
  const historyNote = note || (message ? message.replace(/\s+/g, " ").slice(0, 300) : "");

  return db.transaction((): StaffActionResult => {
    const row = db.prepare("SELECT id, status FROM orders WHERE order_number = ?").get(orderNumber) as
      | { id: number; status: OrderStatus }
      | undefined;
    if (!row) return { ok: false, error: "not-found" };
    const steps = stepsFor(action, row.status);
    if (!steps) return { ok: false, error: "not-allowed" };
    const history = db.prepare("INSERT INTO order_status_history (order_id, status, note) VALUES (?, ?, ?)");
    for (const status of steps) {
      const isLast = status === steps[steps.length - 1];
      const text = isLast
        ? [`Staff: ${action}`, tracking ? `tracking ${tracking}` : null, carrier ? `carrier ${carrier}` : null, historyNote || null].filter(Boolean).join(" — ")
        : `Staff: ${action}`;
      history.run(row.id, status, text);
    }
    db.prepare(
      `UPDATE orders SET status = ?, tracking_number = COALESCE(?, tracking_number), carrier = COALESCE(?, carrier), updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?`
    ).run(steps[steps.length - 1], tracking, carrier, row.id);
    if (message) insertCustomerMessage(row.id, message);
    return { ok: true };
  })();
}
