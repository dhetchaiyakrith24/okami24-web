import "server-only";
import { getDb } from "@/lib/db/client";
import { getOrderDetailForViewer, type OrderDetail } from "./orders";
import { canTransition } from "./order-status";
import { checkSlip } from "@/lib/staff/slip-verify";
import { decideSlip, type SlipReason, type SlipVerdict } from "./slip-decision";

/**
 * "Pay at once" (owner 22/10, cart round): the customer transfers, then attaches the slip on the order page. The slip is
 * checked with EasySlip right away (src/lib/staff/slip-verify.ts) and the order moves to `payment_submitted` with the
 * verdict kept beside it (migration 0008). The verdict only helps staff — BSOT §9 "payment is not automatically
 * considered confirmed": a person still moves every order past `payment_submitted` on /staff.
 *
 * What the customer is told to fix vs. what goes through to staff:
 *  - the picture is not a readable slip (EasySlip SLIP_NOT_FOUND, wrong format, too large, Bangkok Bank's 5-minute
 *    wait, too many tries) → nothing is saved, the customer tries again;
 *  - the same transfer is already attached to ANOTHER order → refused ("slip-used");
 *  - EasySlip cannot be asked at all (not set up, out of quota, down) → saved as "unchecked", staff check the bank app;
 *  - anything else → saved; "pass" only when the money went to the shop's account, the amount equals the order total
 *    and the transfer was never seen before; otherwise "check" with the reasons.
 */

export type SubmitSlipResult =
  | { ok: true; order: OrderDetail; verdict: SlipVerdict; reasons: SlipReason[]; submissionId: number }
  | { ok: false; error: "not-found" | "not-payable" | string };

export async function submitPaymentSlip(input: {
  orderNumber: string;
  viewToken: string | null;
  bytes: Buffer;
  type: string;
  fileName: string;
}): Promise<SubmitSlipResult> {
  const order = await getOrderDetailForViewer(input.orderNumber, input.viewToken);
  if (!order) return { ok: false, error: "not-found" };
  if (!canTransition(order.status, "payment_submitted")) return { ok: false, error: "not-payable" };

  const result = await checkSlip({ bytes: input.bytes, type: input.type, fileName: input.fileName, expected: order.total, withQuota: false });
  const db = getDb();
  const attached =
    result.ok
      ? (db.prepare("SELECT order_id FROM order_payment_submissions WHERE slip_trans_ref = ? LIMIT 1").get(result.slip.transRef) as
          | { order_id: number }
          | undefined)
      : undefined;
  const decision = decideSlip(result, order.id, attached?.order_id ?? null);
  if (decision.kind === "retry") return { ok: false, error: decision.code };

  const note =
    decision.verdict === "pass"
      ? "Slip attached — EasySlip: pass"
      : decision.verdict === "check"
        ? `Slip attached — EasySlip: check (${decision.reasons.join(", ")})`
        : "Slip attached — not checked (EasySlip unavailable)";
  let submissionId = 0;
  const moved = db.transaction(() => {
    // Re-read inside the transaction: two uploads at once must not both move the order.
    const current = db.prepare("SELECT status FROM orders WHERE id = ?").get(order.id) as { status: string } | undefined;
    if (current?.status !== "pending_payment") return false;
    // Same transfer attached to another order a moment ago (two uploads racing) — checked again under the lock.
    if (decision.transRef) {
      const other = db
        .prepare("SELECT order_id FROM order_payment_submissions WHERE slip_trans_ref = ? AND order_id <> ? LIMIT 1")
        .get(decision.transRef, order.id);
      if (other) return "used" as const;
    }
    submissionId = Number(
      db.prepare(
        `INSERT INTO order_payment_submissions (order_id, method, slip_trans_ref, slip_amount_satang, slip_verdict, slip_reasons)
         VALUES (?, 'bank_transfer', ?, ?, ?, ?)`
      ).run(order.id, decision.transRef, decision.amountSatang, decision.verdict, decision.reasons.join(",") || null).lastInsertRowid
    );
    db.prepare("UPDATE orders SET status = 'payment_submitted', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?").run(order.id);
    db.prepare("INSERT INTO order_status_history (order_id, status, note) VALUES (?, 'payment_submitted', ?)").run(order.id, note);
    return true;
  })();
  if (moved === "used") return { ok: false, error: "SLIP_USED" };
  if (!moved) return { ok: false, error: "not-payable" };

  return { ok: true, order: { ...order, status: "payment_submitted" }, verdict: decision.verdict, reasons: decision.reasons, submissionId };
}
