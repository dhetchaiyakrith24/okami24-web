import "server-only";
import { getDb } from "@/lib/db/client";

/**
 * Unpaid orders cancel themselves (owner 24/10 proposal ②, approved — "ตามที่แนะนำมาทั้งหมดเลย"; N = 24 hours is
 * Friday's pick, reversible: change UNPAID_HOURS). Only an order that is still `pending_payment` — no slip ever went
 * through — and was placed more than UNPAID_HOURS ago. Anything the customer or staff moved on is never touched.
 *
 * The order page shows the deadline while the order waits (paymentDeadline) and, once cancelled this way, says why
 * (isAutoCancelNote on the history note). No LINE push: the shop's group would get one message per forgotten cart and
 * the monthly LINE quota is small — staff see it in /staff as a cancelled order.
 */
export const UNPAID_HOURS = 24;

/** Marks the history row so the order page can tell an automatic cancellation from a staff one. Staff-only text. */
const AUTO_CANCEL_NOTE = `System: unpaid ${UNPAID_HOURS} h — auto-cancel`;

export function isAutoCancelNote(note: string | null): boolean {
  return note !== null && note.startsWith("System: unpaid ") && note.endsWith("auto-cancel");
}

/** orders.created_at is ISO UTC ("…Z"); older rows used SQLite's "YYYY-MM-DD HH:MM:SS" (UTC, no zone). */
function parseCreatedAt(createdAt: string): number {
  return Date.parse(createdAt.includes("T") ? createdAt : `${createdAt.replace(" ", "T")}Z`);
}

/** When an order placed at `createdAt` stops waiting for payment. */
export function paymentDeadline(createdAt: string): Date {
  return new Date(parseCreatedAt(createdAt) + UNPAID_HOURS * 3_600_000);
}

/** Cancels every expired unpaid order; returns their numbers. Safe to run any time, as often as wanted. */
export function cancelExpiredUnpaidOrders(now: Date = new Date()): string[] {
  const db = getDb();
  const cutoff = new Date(now.getTime() - UNPAID_HOURS * 3_600_000);
  const candidates = db.prepare("SELECT id, order_number, created_at FROM orders WHERE status = 'pending_payment'").all() as {
    id: number;
    order_number: string;
    created_at: string;
  }[];
  const expired = candidates.filter((o) => parseCreatedAt(o.created_at) < cutoff.getTime());
  if (expired.length === 0) return [];

  const cancel = db.transaction((rows: typeof expired) => {
    const done: string[] = [];
    for (const o of rows) {
      // Re-checked inside the transaction: a slip that landed a moment ago wins.
      const moved = db
        .prepare("UPDATE orders SET status = 'cancelled', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ? AND status = 'pending_payment'")
        .run(o.id);
      if (moved.changes === 0) continue;
      db.prepare("INSERT INTO order_status_history (order_id, status, note) VALUES (?, 'cancelled', ?)").run(o.id, AUTO_CANCEL_NOTE);
      done.push(o.order_number);
    }
    return done;
  });
  return cancel(expired);
}

/** For a page about to show one order: when it is still unpaid past its deadline, run the sweep first and say so (the
 *  caller then reads the order again). */
export function sweepIfPastDeadline(order: { status: string; createdAt: string }): boolean {
  if (order.status !== "pending_payment" || paymentDeadline(order.createdAt).getTime() > Date.now()) return false;
  cancelExpiredUnpaidOrders();
  return true;
}

declare global {
  var __okami24UnpaidTimer: NodeJS.Timeout | undefined;
}

const SWEEP_MS = 15 * 60_000;

function sweep(reason: string): void {
  try {
    const done = cancelExpiredUnpaidOrders();
    if (done.length > 0) console.log(`[unpaid] ${reason}: cancelled ${done.length} unpaid order(s) older than ${UNPAID_HOURS} h — ${done.join(", ")}`);
  } catch (err) {
    console.error(`[unpaid] ${reason}: FAILED — ${err instanceof Error ? err.message : String(err)}`);
  }
}

/** Started once per server process from src/instrumentation.ts, like the backup schedule: a sweep shortly after boot,
 *  then every 15 minutes. The order page also runs it when it opens an order past its deadline, so no page ever shows
 *  "waiting for payment" after the deadline. A failure is logged and never touches the server. */
export function startUnpaidExpiryScheduler(): void {
  if (globalThis.__okami24UnpaidTimer) return;
  const first = setTimeout(() => sweep("startup"), 20_000);
  first.unref();
  const timer = setInterval(() => sweep("interval"), SWEEP_MS);
  timer.unref();
  globalThis.__okami24UnpaidTimer = timer;
  console.log(`[unpaid] scheduled: orders unpaid after ${UNPAID_HOURS} h cancel automatically (sweep every ${SWEEP_MS / 60_000} min)`);
}
