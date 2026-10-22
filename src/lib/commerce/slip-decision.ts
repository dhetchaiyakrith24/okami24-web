/**
 * What happens to a slip a customer attaches to an order (cart round 22/10) — pure, no I/O, so
 * slip-decision-contract-test.ts runs it under plain tsx. The order update itself = payment-slip.ts.
 */
import type { SlipCheckResponse } from "@/lib/staff/slip-check-types";

export type SlipVerdict = "pass" | "check" | "unchecked";
export type SlipReason = "receiver-mismatch" | "receiver-unclear" | "amount-mismatch" | "seen-before";

/** Codes after which the customer is asked for another picture (nothing saved). */
const RETRY_CODES = new Set([
  "SLIP_NOT_FOUND",
  "SLIP_PENDING",
  "INVALID_IMAGE_FORMAT",
  "INVALID_IMAGE_TYPE",
  "IMAGE_SIZE_TOO_LARGE",
  "NO_IMAGE",
  "PREPARE_FAILED",
  "RATE_LIMIT_EXCEEDED",
]);

export type SlipDecision =
  | { kind: "retry"; code: string }
  | { kind: "save"; verdict: SlipVerdict; reasons: SlipReason[]; transRef: string | null; amountSatang: number | null };

/** Pure — the contract test runs it on the documented response shapes. `transRefOrderId` = the order a transfer is
 *  already attached to (null = none). */
export function decideSlip(result: SlipCheckResponse, orderId: number, transRefOrderId: number | null): SlipDecision {
  if (!result.ok) {
    if (RETRY_CODES.has(result.error)) return { kind: "retry", code: result.error };
    return { kind: "save", verdict: "unchecked", reasons: [], transRef: null, amountSatang: null };
  }
  if (transRefOrderId !== null && transRefOrderId !== orderId) return { kind: "retry", code: "SLIP_USED" };

  const reasons: SlipReason[] = [];
  if (result.slip.receiverStatus === "mismatch") reasons.push("receiver-mismatch");
  if (result.slip.receiverStatus === "unclear") reasons.push("receiver-unclear");
  if (!result.amountCheck || !result.amountCheck.matches) reasons.push("amount-mismatch");
  // Seen before and not by this same order (a customer re-sending their own slip is fine).
  if (result.duplicate && transRefOrderId !== orderId) reasons.push("seen-before");
  return {
    kind: "save",
    verdict: reasons.length === 0 ? "pass" : "check",
    reasons,
    transRef: result.slip.transRef,
    amountSatang: Math.round(result.slip.amount * 100),
  };
}
