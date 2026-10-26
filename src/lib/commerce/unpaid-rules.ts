/**
 * Pure side of the unpaid sweep (src/lib/commerce/unpaid-expiry.ts) — no I/O, so run-number-contract-test.ts can run it
 * against a real SQLite file built from the migrations.
 *
 * SQL condition (orders aliased `o`): the order was cancelled by the unpaid sweep — never paid. Owner 26/10 (queue
 * B2 (b) "ซ่อน"): these are HIDDEN from the staff lists and counts, not deleted — the row stays, and
 * /staff/orders/<number> still opens it. Matches the sweep's history note ("System: unpaid <N> h — auto-cancel",
 * isAutoCancelNote) for any N, so a later UNPAID_HOURS still matches older rows.
 */
export const AUTO_CANCELLED_SQL = `(o.status = 'cancelled' AND EXISTS (SELECT 1 FROM order_status_history h
  WHERE h.order_id = o.id AND h.status = 'cancelled' AND h.note LIKE 'System: unpaid %' AND h.note LIKE '%auto-cancel'))`;
