/**
 * LINE refunds (owner 10/11 "ทาง 1") — pure, so refund-contract-test.ts runs it under plain tsx.
 *
 * The admin already posts every refund in the refund group the same way: a text "แจ้งยอดโอนคืน…" with the amount (and the
 * customer's bank details, which are never kept), then a picture of the customer's original slip. The bot reads the amount
 * from the text, checks the next picture of the same poster like any slip, and ties the refund to that slip:
 *   - by the bank reference read from the picture (the normal way), or
 *   - when the picture cannot be read: only if the post names the order time ("MP 05/11/26 : 13.05") and exactly ONE shop
 *     slip of exactly that amount was transferred within an hour of it.
 * Anything else is left for staff on /staff/slip — never guessed. A refund of the same amount on the same slip is the same
 * refund posted twice and counts once; two different partial refunds of one slip add up, never past the slip's amount.
 * Sales and the LINE round profit then count that slip as its amount minus what was refunded.
 */

export type RefundStatus = "waiting" | "matched" | "unmatched" | "duplicate" | "undone";
export type RefundReason = "no-amount" | "no-picture" | "slip-unreadable" | "not-shop-slip" | "over-slip" | "ambiguous" | "no-slip";
export type MatchedBy = "ref" | "amount-time" | "staff";

/** How long after its post the poster's picture still belongs to it. */
export const PICTURE_WINDOW_MS = 15 * 60_000;
/** Amount + time fallback: the slip must be this close to the time the post names. */
export const HINT_WINDOW_MS = 60 * 60_000;

const REFUND_HEAD = /แจ้ง\s*ยอด\s*(?:โอน\s*)?คืน/;
/** Money anywhere in the post: a number with ".-" / ฿ / บาท after it ("340.-" · "1,300.-" · "750 ฿"), or "ยอด" before it
 *  ("ยอด 800"). Bank accounts, phone numbers and the order time carry neither, so they never count. */
const NUMBER = "([0-9]{1,3}(?:,[0-9]{3})+|[0-9]+)(?:\\.([0-9]{1,2}))?";
const MONEY_AFTER = new RegExp(`${NUMBER}\\s*(?:\\.-|฿|บาท)`, "g");
const MONEY_BEFORE = new RegExp(`ยอด\\s*${NUMBER}`, "g");
const HINT = /([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{2})\s*:\s*([0-9]{1,2})[.:]([0-9]{2})/;

export interface RefundPost {
  amountSatang: number | null;
  /** ISO with +07:00, or null. */
  hintAt: string | null;
}

/** null = not a refund post at all (the group's other chatter). */
export function parseRefundPost(text: string): RefundPost | null {
  if (!REFUND_HEAD.test(text)) return null;
  const amounts = new Set<number>();
  for (const m of [...text.matchAll(MONEY_AFTER), ...text.matchAll(MONEY_BEFORE)]) {
    // A number glued to a longer run of digits ("8632435205 ฿") is an account, not an amount.
    const before = text[(m.index ?? 0) - 1] ?? "";
    if (/[0-9]/.test(before)) continue;
    const satang = Number(m[1].replace(/,/g, "")) * 100 + (m[2] ? Number(m[2].padEnd(2, "0")) : 0);
    if (satang > 0) amounts.add(satang);
  }
  const h = HINT.exec(text);
  let hintAt: string | null = null;
  if (h) {
    const [d, mo, y, hh, mm] = h.slice(1).map(Number);
    if (d >= 1 && d <= 31 && mo >= 1 && mo <= 12 && hh <= 23 && mm <= 59) {
      const p = (n: number) => String(n).padStart(2, "0");
      hintAt = `20${p(y)}-${p(mo)}-${p(d)}T${p(hh)}:${p(mm)}:00+07:00`;
    }
  }
  return { amountSatang: amounts.size === 1 ? [...amounts][0] : null, hintAt };
}

export interface SlipFact {
  transRef: string;
  amountSatang: number;
  transferredAt: string;
  receiverStatus: string;
}

export type Decision =
  | { status: "matched"; transRef: string; matchedBy: MatchedBy }
  | { status: "duplicate"; transRef: string }
  | { status: "unmatched"; reason: RefundReason; transRef?: string };

/**
 * Where one refund goes.
 * `slip` = the slip read from the post's picture (null: no picture could be read). `matchedOnRef(ref)` = amounts of the refunds
 * already matched to that slip. `candidates` = shop slips to try when the picture could not be read.
 */
export function decideRefund(input: {
  amountSatang: number | null;
  hintAt: string | null;
  slip: SlipFact | null;
  matchedOnRef: (transRef: string) => number[];
  candidates: SlipFact[];
  by?: MatchedBy;
}): Decision {
  const { amountSatang, hintAt, slip, matchedOnRef, candidates } = input;
  if (amountSatang === null || amountSatang <= 0) return { status: "unmatched", reason: "no-amount", transRef: slip?.transRef };
  const fits = (s: SlipFact): Decision => {
    if (s.receiverStatus !== "match") return { status: "unmatched", reason: "not-shop-slip", transRef: s.transRef };
    const before = matchedOnRef(s.transRef);
    if (before.includes(amountSatang)) return { status: "duplicate", transRef: s.transRef };
    if (before.reduce((n, a) => n + a, 0) + amountSatang > s.amountSatang) return { status: "unmatched", reason: "over-slip", transRef: s.transRef };
    return { status: "matched", transRef: s.transRef, matchedBy: input.by ?? "ref" };
  };
  if (slip) return fits(slip);
  if (!hintAt) return { status: "unmatched", reason: "slip-unreadable" };
  const at = Date.parse(hintAt);
  const near = candidates.filter(
    (c) =>
      c.receiverStatus === "match" &&
      c.amountSatang === amountSatang &&
      Math.abs(Date.parse(c.transferredAt) - at) <= HINT_WINDOW_MS &&
      !matchedOnRef(c.transRef).length
  );
  if (near.length === 1) {
    const d = fits(near[0]);
    return d.status === "matched" ? { ...d, matchedBy: "amount-time" } : d;
  }
  return { status: "unmatched", reason: near.length === 0 ? "slip-unreadable" : "ambiguous" };
}

export interface WaitingPost {
  id: number;
  posterHash: string | null;
  postedAt: string;
}

/** The post a picture belongs to: the poster's latest post still waiting, within the window. No poster on either side =
 *  only when the group has exactly one post waiting (a desktop LINE may send no user id). */
export function postForPicture(waiting: WaitingPost[], posterHash: string | null, pictureAt: string): WaitingPost | null {
  const t = Date.parse(pictureAt);
  const live = waiting.filter((w) => t - Date.parse(w.postedAt) >= 0 && t - Date.parse(w.postedAt) <= PICTURE_WINDOW_MS);
  const mine = posterHash ? live.filter((w) => w.posterHash === posterHash) : [];
  if (mine.length > 0) return mine.sort((a, b) => Date.parse(b.postedAt) - Date.parse(a.postedAt))[0];
  if (live.length === 1 && (!posterHash || !live[0].posterHash)) return live[0];
  return null;
}

/** What a slip still counts as after its refunds. */
export const netSatang = (amountSatang: number, refundedSatang: number | undefined) => Math.max(0, amountSatang - Math.min(amountSatang, refundedSatang ?? 0));

export const REASON_TH: Record<RefundReason, string> = {
  "no-amount": "อ่านยอดคืนจากข้อความไม่ได้ (ไม่มีหรือมีหลายยอด)",
  "no-picture": "ไม่มีรูปสลิปตามมาภายใน 15 นาที",
  "slip-unreadable": "อ่านสลิปจากรูปไม่ได้",
  "not-shop-slip": "สลิปในรูปไม่ได้โอนเข้าบัญชีร้าน (อาจเป็นสลิปโอนคืน)",
  "over-slip": "ยอดคืนรวมเกินยอดในสลิป",
  ambiguous: "มีสลิปยอดเท่ากันหลายใบในช่วงเวลานั้น",
  "no-slip": "ไม่พบสลิปนี้ในระบบ",
};
