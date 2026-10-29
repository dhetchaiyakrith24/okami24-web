import "server-only";
import { getDb } from "@/lib/db/client";
import { getOrderDetailInternal, type OrderDetail } from "@/lib/commerce/orders";
import type { OrderStatus } from "@/lib/commerce/order-status";
import { toStaffCarrierId } from "@/lib/commerce/carriers";
import type { SlipVerdict } from "@/lib/commerce/slip-decision";
import { warehouseCode } from "./orders-export";
import { cleanTracking, stepsFor, warehouseText, type StaffAction } from "./order-actions";
import { getStockIssue, orderLines, type StockIssue, type StockIssueLine } from "@/lib/commerce/stock-issues";
import { cleanOrderMessage } from "@/lib/commerce/order-message-rules";
import { insertCustomerMessage } from "@/lib/commerce/order-messages";
import { AUTO_CANCELLED_SQL } from "@/lib/commerce/unpaid-rules";
import { ASSIGN_RUN_NUMBER_SQL } from "@/lib/commerce/run-number";
import { jobOf, STAFF_JOB_ORDER, STAFF_JOBS, TODO_JOBS, type StaffJob } from "./jobs";
import { trimLine1 } from "@/lib/commerce/address-line1";

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
  /** The shop's running number (migration 0017) — null until the payment is confirmed. */
  runNumber: number | null;
}

/** A job box of the staff home (src/lib/staff/jobs.ts — owner 26/10, queue B3), "todo" = the three to-do jobs together,
 *  "all" = the newest 200. Orders the unpaid sweep cancelled are left out of every list and count (owner 26/10 "ซ่อน" —
 *  kept in the database, still open by their link). */
export type StaffOrderFilter = StaffJob | "todo" | "all";

const inStatuses = (statuses: readonly string[]) => `o.status IN (${statuses.map((s) => `'${s}'`).join(",")})`;

function filterSql(filter: StaffOrderFilter): string {
  if (filter === "all") return "1 = 1";
  if (filter === "todo") return inStatuses(TODO_JOBS.flatMap((j) => STAFF_JOBS[j].statuses));
  return inStatuses(STAFF_JOBS[filter].statuses);
}

/** Every list is newest first (owner 30/10 "อยากให้รายการออเดอร์ล่าสุดอยู่บนสุด"; it was oldest first for work waiting on the team). */
function orderSql(): string {
  return "o.id DESC";
}

export function listStaffOrders(filter: StaffOrderFilter): StaffOrderRow[] {
  const rows = getDb()
    .prepare(
      `SELECT o.order_number, o.status, o.total, o.created_at, o.run_number, a.recipient_name, a.province,
              (SELECT COALESCE(SUM(quantity), 0) FROM order_items i WHERE i.order_id = o.id) AS item_count,
              (SELECT slip_verdict FROM order_payment_submissions s WHERE s.order_id = o.id ORDER BY s.id DESC LIMIT 1) AS slip_verdict
         FROM orders o JOIN order_shipping_addresses a ON a.order_id = o.id
        WHERE ${filterSql(filter)} AND NOT ${AUTO_CANCELLED_SQL}
        ORDER BY ${orderSql()} LIMIT 200`
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
    run_number: number | null;
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
    runNumber: r.run_number,
  }));
}

/** How many orders each job box holds — the staff home. Same hidden rule as the lists. */
export function countByJob(): Record<StaffJob, number> {
  const rows = getDb()
    .prepare(`SELECT o.status, COUNT(*) AS n FROM orders o WHERE NOT ${AUTO_CANCELLED_SQL} GROUP BY o.status`)
    .all() as { status: OrderStatus; n: number }[];
  const counts = Object.fromEntries(STAFF_JOB_ORDER.map((j) => [j, 0])) as Record<StaffJob, number>;
  for (const r of rows) counts[jobOf(r.status)] += r.n;
  return counts;
}

export interface StaffOrderDetail extends OrderDetail {
  customerPhone: string;
  trackingNumber: string | null;
  /** The customer's optional note to the shop from the review step (cart UX batch C) — staff page only. */
  customerNote: string | null;
  slip: {
    verdict: SlipVerdict | null;
    reasons: string[];
    transRef: string | null;
    amount: number | null;
    submittedAt: string;
    /** The picture is on the disk (kept 90 days — src/lib/commerce/slip-images.ts). */
    hasImage: boolean;
    /** When the 90-day sweep deleted it; null while kept, or for slips from before images were kept. */
    imageDeletedAt: string | null;
  } | null;
  lines: { sku: string | null; name: string; quantity: number }[];
  warehouseText: string;
  /** Out of stock after payment (cart UX batch E) — null when nobody marked a line out. */
  stockIssue: StockIssue | null;
  /** The order lines with their ids (the "which lines are out" checkboxes), same order as `items`. */
  itemLines: StockIssueLine[];
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
      "SELECT slip_verdict, slip_reasons, slip_trans_ref, slip_amount_satang, submitted_at, proof_image_path, slip_image_deleted_at FROM order_payment_submissions WHERE order_id = ? ORDER BY id DESC LIMIT 1"
    )
    .get(order.id) as
    | {
        slip_verdict: SlipVerdict | null;
        slip_reasons: string | null;
        slip_trans_ref: string | null;
        slip_amount_satang: number | null;
        submitted_at: string;
        proof_image_path: string | null;
        slip_image_deleted_at: string | null;
      }
    | undefined;

  const lines = order.items.map((i) => ({
    sku: warehouseCode(i.productSlug, i.variantId),
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
          hasImage: slipRow.proof_image_path !== null,
          imageDeletedAt: slipRow.slip_image_deleted_at,
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
      address: `${trimLine1(a.line1, a)} ต.${a.subdistrict} อ.${a.district} จ.${a.province} ${a.postalCode}`,
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
  // Staff confirm the carrier with the number — never guessed from it (owner 23/10: the order page names it); EMS or DHL
  // only since 29/10 (the form starts on the postcode pick, owner 30/10).
  const carrier = action === "ship" ? toStaffCarrierId(input.carrier) : null;
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
    // The payment is confirmed → the order takes the next running number (owner 26/10, queue B2 (a)).
    if (steps.includes("approved")) db.prepare(ASSIGN_RUN_NUMBER_SQL).run(row.id);
    if (message) insertCustomerMessage(row.id, message);
    return { ok: true };
  })();
}

/** Staff change the carrier the site picked from the postcode (owner 30/10) — only while the order is paid and not yet
 *  sent to the warehouse, since Shipnity takes the carrier with the order. Not a status step: no history row (the
 *  customer's timeline stays the same); the customer sees the carrier only once shipped. */
export function setPlannedCarrier(orderNumber: string, raw: unknown): { ok: true } | { ok: false; error: "carrier" | "not-allowed" } {
  const carrier = toStaffCarrierId(raw);
  if (!carrier) return { ok: false, error: "carrier" };
  const changed = getDb()
    .prepare(
      `UPDATE orders SET carrier = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
       WHERE order_number = ? AND status = 'approved'
         AND NOT EXISTS (SELECT 1 FROM woo_order_sends s WHERE s.order_id = orders.id AND s.status <> 'failed')`
    )
    .run(carrier, orderNumber).changes;
  return changed === 1 ? { ok: true } : { ok: false, error: "not-allowed" };
}
