/**
 * T2-01 (owner 10/11: "ผ่านได้เพราะบางทีพี่เองก็สั่งของ ทีมงานพี่ก็สั่งของ"): "ยืนยันยอดเงินแล้ว" stays open for every order, but an order
 * whose money was confirmed WITHOUT a slip that passed the check is marked, with who pressed it, so the owner can tell those
 * apart. Read from what is stored already — no new column: the history row "Staff: confirm" (src/lib/staff/orders.ts),
 * the slip verdict of each payment submission (src/lib/commerce/payment-slip.ts · line-orders.ts · line-order-edit.ts) and
 * the person in staff_audit (from 10/11). Pure, so the contract test runs it under plain tsx. Changes no total and nothing
 * the customer sees.
 */

export type HandConfirmKind = "slip-check" | "slip-unchecked" | "no-slip" | "difference-by-hand";

/** Why, in the owner's words (the owner's list sits under the heading "ยืนยันเงินเอง"). */
export const HAND_CONFIRM_REASON: Record<HandConfirmKind, string> = {
  "slip-check": "สลิปไม่ผ่านการตรวจ",
  "slip-unchecked": "ตรวจสลิปไม่ได้",
  "no-slip": "ไม่มีสลิป",
  "difference-by-hand": "ส่วนต่างที่เพิ่มยืนยันเอง ไม่มีสลิป",
};

/** The mark on the order page. */
export const handConfirmLabel = (kind: HandConfirmKind): string => `ยืนยันเงินเอง · ${HAND_CONFIRM_REASON[kind]}`;

export interface SubmissionFact {
  verdict: string | null;
  /** A slip is on it: a bank reference or a picture. */
  hasSlip: boolean;
}

export interface HandConfirmFacts {
  /** The money step was pressed by staff ("Staff: confirm" on the approved row). */
  staffConfirmed: boolean;
  /** Oldest first. */
  submissions: SubmissionFact[];
  /** A LINE item change whose difference staff confirmed by hand (no slip). */
  differenceByHand: boolean;
}

/** null = nothing to mark (a slip passed, or staff never confirmed the money themselves). */
export function handConfirmKind(f: HandConfirmFacts): HandConfirmKind | null {
  if (f.staffConfirmed && !f.submissions.some((s) => s.verdict === "pass")) {
    const last = f.submissions.at(-1);
    if (last?.verdict === "check") return "slip-check";
    if (last && last.hasSlip) return "slip-unchecked";
    return "no-slip";
  }
  return f.differenceByHand ? "difference-by-hand" : null;
}

/** The history notes the facts come from (kept beside the rule so a reworded note breaks the test, not the mark). */
export const CONFIRM_NOTE_PREFIX = "Staff: confirm";
export const DIFFERENCE_BY_HAND_NOTE = "difference confirmed by hand";

/** Who pressed it, in the owner's words: the person from "ใครทำอะไร", or unknown for orders from before 10/11. */
export const pressedBy = (name: string | null): string => (name ? `กดโดย ${name}` : "ไม่รู้ว่าใครกด (ก่อนมีบัญชีแอดมิน)");
