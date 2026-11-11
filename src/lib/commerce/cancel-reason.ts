/**
 * Why an order was cancelled, as the customer's order page tells it (T2-11 / T2-19, outside tester's Test 2, 11/11) — pure,
 * no I/O, so cancel-reason-contract-test.ts can pin it.
 *
 * Three ways an order is cancelled, each with its own words:
 *   - the 24-hour unpaid sweep (unpaid-expiry.ts — its own note, isAutoCancelNote);
 *   - the warehouse cancelled it in Shipnity → the site cancels the web order itself (owner 11/11, src/lib/woo/warehouse-cancel.ts);
 *   - staff pressed "ยกเลิกออเดอร์" with a reason for the customer (src/lib/staff/orders.ts applyStaffAction): that reason is
 *     the headline of the page (T2-19: the page used to put a fixed "the shop could not confirm your transfer" line on top,
 *     whatever reason staff typed).
 */

/** The history note the warehouse cancel writes, and how the pages recognise it. */
export const WAREHOUSE_CANCEL_NOTE_PREFIX = "Shipnity: cancel — warehouse ";

export function warehouseCancelNote(shipnityStatus: string): string {
  return `${WAREHOUSE_CANCEL_NOTE_PREFIX}${shipnityStatus}`;
}

export function isWarehouseCancelNote(note: string | null): boolean {
  return note !== null && note.startsWith(WAREHOUSE_CANCEL_NOTE_PREFIX);
}

/** The Shipnity statuses that make the web order cancel itself (owner 11/11, "ยกเลิกบนเว็บอัตโนมัติ"): the warehouse said
 *  in words that it cancelled (or cancelled and refunded). A delete / trash / failed only alerts the team (order-alert.ts) —
 *  a cancel cannot be undone (order-status.ts), and a deleted order may be a duplicate the warehouse cleared, so staff decide. */
export function warehouseCancels(shipnityStatus: string | null): boolean {
  return shipnityStatus === "cancelled" || shipnityStatus === "refunded";
}

/**
 * The customer message staff wrote WITH the cancel: applyStaffAction stores it in the same transaction, right after the
 * "cancelled" history row — so it is the oldest message written at or after the moment of the cancel. Messages written
 * before the cancel are older; any written after it are newer. `messages` newest first (customerMessagesFor), times ISO.
 * Returns its index in `messages`, or -1 (an order cancelled before messages existed, or by the system).
 */
export function cancelMessageIndex(cancelledAt: string, messages: readonly { createdAt: string }[]): number {
  let found = -1;
  messages.forEach((m, i) => {
    if (m.createdAt >= cancelledAt) found = i; // newest first → the last hit is the oldest one at or after the cancel
  });
  return found;
}
