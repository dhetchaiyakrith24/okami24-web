import "server-only";
import { getDb } from "@/lib/db/client";
import { CONFIRMED_ORDER_STATUSES } from "@/lib/staff/daily-sales-rules";
import { CONFIRM_NOTE_PREFIX, DIFFERENCE_BY_HAND_NOTE, handConfirmKind, type HandConfirmKind } from "@/lib/staff/hand-confirm-rules";

/**
 * T2-01: which orders had their money confirmed without a slip that passed the check, and who pressed it (rules:
 * src/lib/staff/hand-confirm-rules.ts). Read-only, from the order history, the payment submissions and staff_audit.
 */

export interface HandConfirm {
  kind: HandConfirmKind;
  /** The person from "ใครทำอะไร" (staff_audit); null for orders confirmed before accounts (10/11). */
  by: string | null;
}

function factsFor(orderId: number): HandConfirm | null {
  const db = getDb();
  const staffConfirmed = db
    .prepare("SELECT 1 FROM order_status_history WHERE order_id = ? AND status = 'approved' AND note LIKE ? LIMIT 1")
    .get(orderId, `${CONFIRM_NOTE_PREFIX}%`) !== undefined;
  const differenceByHand = db
    .prepare("SELECT 1 FROM order_status_history WHERE order_id = ? AND note LIKE ? LIMIT 1")
    .get(orderId, `%${DIFFERENCE_BY_HAND_NOTE}%`) !== undefined;
  if (!staffConfirmed && !differenceByHand) return null;
  const submissions = (
    db
      .prepare("SELECT slip_verdict, slip_trans_ref, proof_image_path FROM order_payment_submissions WHERE order_id = ? ORDER BY id ASC")
      .all(orderId) as { slip_verdict: string | null; slip_trans_ref: string | null; proof_image_path: string | null }[]
  ).map((s) => ({ verdict: s.slip_verdict, hasSlip: s.slip_trans_ref !== null || s.proof_image_path !== null }));
  const kind = handConfirmKind({ staffConfirmed, submissions, differenceByHand });
  if (!kind) return null;
  const action = kind === "difference-by-hand" ? "order-items" : "order-confirm";
  const who = db
    .prepare(
      `SELECT a.actor_name FROM staff_audit a JOIN orders o ON o.order_number = a.order_number
        WHERE o.id = ? AND a.action = ? ORDER BY a.id DESC LIMIT 1`
    )
    .get(orderId, action) as { actor_name: string } | undefined;
  return { kind, by: who?.actor_name ?? null };
}

export function handConfirmForOrder(orderNumber: string): HandConfirm | null {
  const row = getDb().prepare("SELECT id FROM orders WHERE order_number = ?").get(orderNumber) as { id: number } | undefined;
  return row ? factsFor(row.id) : null;
}

export interface HandConfirmedOrder extends HandConfirm {
  orderNumber: string;
  runNumber: number | null;
  total: number;
  channel: "web" | "line";
  createdAt: string;
}

/** Paid orders since `sinceIso` (newest first) that carry the mark — the owner's list. */
export function handConfirmedSince(sinceIso: string, limit = 50): HandConfirmedOrder[] {
  const statuses = CONFIRMED_ORDER_STATUSES.map((s) => `'${s}'`).join(",");
  const rows = getDb()
    .prepare(
      `SELECT o.id, o.order_number, o.run_number, o.total, o.channel, o.created_at FROM orders o
        WHERE o.status IN (${statuses}) AND o.created_at >= ?
          AND EXISTS (SELECT 1 FROM order_status_history h WHERE h.order_id = o.id AND (
                (h.status = 'approved' AND h.note LIKE ?) OR h.note LIKE ?))
        ORDER BY o.id DESC`
    )
    .all(sinceIso, `${CONFIRM_NOTE_PREFIX}%`, `%${DIFFERENCE_BY_HAND_NOTE}%`) as {
    id: number;
    order_number: string;
    run_number: number | null;
    total: number;
    channel: string | null;
    created_at: string;
  }[];
  const out: HandConfirmedOrder[] = [];
  for (const r of rows) {
    const mark = factsFor(r.id);
    if (!mark) continue;
    out.push({ ...mark, orderNumber: r.order_number, runNumber: r.run_number, total: r.total, channel: r.channel === "line" ? "line" : "web", createdAt: r.created_at });
    if (out.length >= limit) break;
  }
  return out;
}
