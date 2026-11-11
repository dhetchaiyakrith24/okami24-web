import "server-only";
import { getDb } from "@/lib/db/client";
import { canTransition, type OrderStatus } from "@/lib/commerce/order-status";
import { openStockIssue } from "@/lib/commerce/stock-issues";
import { keptChoiceNote, WAREHOUSE_ISSUE_NOTE, warehouseCancelNote, warehouseCancels } from "@/lib/commerce/cancel-reason";

/**
 * Shipnity cancelled an order it was sent → the web order cancels itself (T2-10 / T2-11, owner 11/11 ~20:45, main chat, his
 * pick "ยกเลิกบนเว็บอัตโนมัติ" — replaces the 28/10 "LINE alert only, the admin handles it" design). Called by
 * order-events.ts for every warehouse change; the LINE alert to the team is sent there as before.
 *
 * - Cancelled the same way as a staff cancel: a "cancelled" history row ("Shipnity: cancel — warehouse <status>") and the
 *   order's status. Being "cancelled" takes it out of the sales totals (daily-sales-rules.ts CONFIRMED_ORDER_STATUSES), the
 *   order count, the owner dashboard and the "รอใส่เลขพัสดุ" list (jobs.ts) with no other change.
 * - Money (BSOT §9 owner exception 10/11, "ใช้เหมือนของหมด"): when the shop had confirmed the payment, the whole order is
 *   opened as an out-of-stock issue BEFORE the cancel, so the customer picks where the refund goes on the order page and
 *   staff record the transfer (canRefundStockIssue). A slip never confirmed promises no refund (owner 29/10).
 * - Shipped, completed or already cancelled orders are left alone (order-status.ts: no way to "cancelled") — the alert
 *   still reaches the team.
 * One transaction: the refund issue and the cancel land together or not at all (order-events.ts catches and logs).
 */
export type WarehouseCancelResult = { cancelled: true; refundOpen: boolean } | { cancelled: false; reason: "not-cancel" | "not-found" | "not-allowed" };

const CONFIRMED: readonly OrderStatus[] = ["approved", "processing"];

export function cancelByWarehouse(orderId: number, shipnityStatus: string | null): WarehouseCancelResult {
  if (!warehouseCancels(shipnityStatus)) return { cancelled: false, reason: "not-cancel" };
  const db = getDb();
  return db.transaction((): WarehouseCancelResult => {
    const row = db.prepare("SELECT order_number, status FROM orders WHERE id = ?").get(orderId) as { order_number: string; status: OrderStatus } | undefined;
    if (!row) return { cancelled: false, reason: "not-found" };
    if (!canTransition(row.status, "cancelled")) return { cancelled: false, reason: "not-allowed" };
    let refundOpen = false;
    if (CONFIRMED.includes(row.status)) {
      const issue = db.prepare("SELECT resolution, choice, staff_note FROM order_stock_issues WHERE order_id = ?").get(orderId) as
        | { resolution: string | null; choice: string | null; staff_note: string | null }
        | undefined;
      const lines = (db.prepare("SELECT id FROM order_items WHERE order_id = ?").all(orderId) as { id: number }[]).map((i) => i.id);
      const note = `${WAREHOUSE_ISSUE_NOTE}(${shipnityStatus})`;
      if (issue && issue.resolution === null && issue.choice !== null) {
        // The customer already answered an open out-of-stock issue (Friday 11/11, checker of #1415): their choice and refund
        // target stay — openStockIssue would wipe them. The issue widens to the whole order (the whole paid total goes
        // back) and the team gets a history note.
        db.prepare("UPDATE order_stock_issues SET out_item_ids = ?, staff_note = ? WHERE order_id = ?").run(
          lines.join(","),
          (issue.staff_note ? `${note} · เดิม: ${issue.staff_note}` : note).slice(0, 300),
          orderId
        );
        db.prepare("INSERT INTO order_status_history (order_id, status, note) VALUES (?, ?, ?)").run(orderId, row.status, keptChoiceNote(issue.choice));
        refundOpen = true;
      } else if (issue?.resolution !== "refunded") {
        // A refund already made for some lines stays as it is (openStockIssue refuses it) — staff settle the rest by hand.
        refundOpen = openStockIssue(row.order_number, lines, note).ok;
      }
    }
    db.prepare("INSERT INTO order_status_history (order_id, status, note) VALUES (?, 'cancelled', ?)").run(orderId, warehouseCancelNote(shipnityStatus!));
    db.prepare("UPDATE orders SET status = 'cancelled', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?").run(orderId);
    return { cancelled: true, refundOpen };
  })();
}
