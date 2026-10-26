/**
 * The shop's running order number (owner 26/10, queue B2 (a)): #0001, #0002 … given when staff confirm the payment
 * (src/lib/staff/orders.ts applyStaffAction), stored in orders.run_number (migration 0017). Pure, no I/O.
 * Four digits as the owner wrote it ("#0001…"); past 9999 it simply grows (#10000) — never wraps.
 */
export function formatRunNumber(n: number | null | undefined): string | null {
  if (typeof n !== "number" || !Number.isInteger(n) || n < 1) return null;
  return `#${String(n).padStart(4, "0")}`;
}

/** Gives order `?` the next number when it has none (src/lib/staff/orders.ts runs it inside the confirm transaction, so
 *  two staff confirming at once cannot take the same number — the UNIQUE index of migration 0017 backs that up). An order
 *  keeps its number for good, even when it is cancelled later (a refund after confirmation). */
export const ASSIGN_RUN_NUMBER_SQL =
  "UPDATE orders SET run_number = (SELECT COALESCE(MAX(run_number), 0) + 1 FROM orders) WHERE id = ? AND run_number IS NULL";
