/**
 * Shipping-fee tiers — owner, chat 2026-10-29 ~23:20 (docs/BUSINESS_SOURCE_OF_TRUTH.md §10), correcting the first version
 * of the same evening, his words: "สมัครใหม่ส่งฟรีใช่แต่ต้องสั่ง 300 บาทขึ้นไป และสิทธินี้รีทุกเดือน หลังจากครบ 300 อีก 2-3 วันมาสั่งต่อ
 * ยอดถึง 500 ก็เหลือ 35 ยอดไม่ถึง 500 ไม่มีสิทธิครั้งแรกก็ 50 บาท · ครั้งที่ 3 800 ค่าส่งเป็นฟรี" — the monthly benefit is for members
 * only (signed in with LINE / Google). Checked in this order, first match wins:
 *   1. `over_800`       — subtotal ≥ 800 → 0, everyone, every order; uses up nothing (it is checked before the member
 *      benefit, so a member's 800+ order keeps this month's benefit for a smaller order).
 *   2. `member_monthly` — signed in, subtotal ≥ 300, and no order inside this calendar month (Bangkok) that used the member
 *      benefit shares this member, phone or address → 0. Once per month; it comes back on the 1st.
 *   3. `over_500`       — subtotal ≥ 500 → 35 (guests, and members whose benefit is used this month).
 *   4. `standard`       — below 500 → 50.
 * Anti-reuse (owner 29/10 "ตามแนะนำ", BSOT §10): the benefit is not given again when the PHONE (checkout or recipient) or
 * the ADDRESS (house no. + sub-district + postcode) matches an order that used it this month — the recipient's name alone
 * never blocks. A cancelled order never uses it up (customer cancel, staff cancel, or the 24-hour unpaid sweep).
 * Orders placed before migration 0022 (rule NULL) count for nothing. Orders of the first version (LEGACY_SHIPPING_RULES,
 * live 29/10 evening) count as this month's benefit only when a member got 0 shipping below 800 — `first_member_order`, or
 * `monthly_free` placed signed in (Friday's reading 29/10: "only if it actually got shipping ฿0 under a member benefit").
 *
 * Pure (no `server-only`, no I/O beyond the `db` handed in) so shipping-rules-contract-test.ts can run it on an in-memory
 * SQLite built from the real migrations.
 */

export const STANDARD_SHIPPING_FEE_THB = 50;
export const REDUCED_SHIPPING_FEE_THB = 35;
export const MEMBER_FREE_THRESHOLD_THB = 300;
export const REDUCED_THRESHOLD_THB = 500;
export const ALWAYS_FREE_THRESHOLD_THB = 800;

export const SHIPPING_RULES = ["over_800", "member_monthly", "over_500", "standard"] as const;
/** Rules of the first version (29/10 evening) — never decided any more, still stored on its orders. */
export const LEGACY_SHIPPING_RULES = ["first_member_order", "monthly_free", "monthly_used"] as const;
export type ShippingRule = (typeof SHIPPING_RULES)[number];
export type StoredShippingRule = ShippingRule | (typeof LEGACY_SHIPPING_RULES)[number];

export function isShippingRule(value: unknown): value is StoredShippingRule {
  return typeof value === "string" && ([...SHIPPING_RULES, ...LEGACY_SHIPPING_RULES] as readonly string[]).includes(value);
}

/** What the rules need to know about the visitor. A visitor nobody can identify yet (no phone, not signed in) = all false. */
export interface ShippingHistory {
  isMember: boolean;
  /** This month's member benefit is gone: an order (not cancelled) that used it shares this member, phone or address. Worked
   *  out for guests too (by phone / address only): the cart then invites a member back in without promising 0 shipping. */
  benefitUsed: boolean;
}

export const UNKNOWN_VISITOR: ShippingHistory = { isMember: false, benefitUsed: false };

export interface ShippingDecision {
  rule: ShippingRule;
  fee: number;
}

export function decideShipping(subtotal: number, history: ShippingHistory): ShippingDecision {
  if (subtotal >= ALWAYS_FREE_THRESHOLD_THB) return { rule: "over_800", fee: 0 };
  if (history.isMember && !history.benefitUsed && subtotal >= MEMBER_FREE_THRESHOLD_THB) return { rule: "member_monthly", fee: 0 };
  if (subtotal >= REDUCED_THRESHOLD_THB) return { rule: "over_500", fee: REDUCED_SHIPPING_FEE_THB };
  return { rule: "standard", fee: STANDARD_SHIPPING_FEE_THB };
}

const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000; // Thailand has no daylight saving

/** Start of this calendar month in Bangkok, as the same ISO-8601 UTC text `orders.created_at` holds (so it compares as text). */
export function monthlyWindowStart(now: Date): string {
  const bangkok = new Date(now.getTime() + BANGKOK_OFFSET_MS);
  return new Date(Date.UTC(bangkok.getUTCFullYear(), bangkok.getUTCMonth(), 1) - BANGKOK_OFFSET_MS).toISOString();
}

/** The address fields the anti-reuse rule compares (house no. from `line1`, sub-district, postcode). */
export interface ShippingAddressKey {
  line1: string;
  subdistrict: string;
  postalCode: string;
}

/** Who is ordering: the member, the checkout + recipient phones (either may be empty before checkout), and the address once
 *  one is picked (the cart has none yet — the review step and placeOrder do). */
export interface ShippingIdentity {
  memberId: number | null;
  phones: string[];
  address?: ShippingAddressKey | null;
}

const THAI_DIGITS = /[๐-๙]/g;
const squash = (s: string) => s.replace(THAI_DIGITS, (d) => String(d.charCodeAt(0) - 0x0e50)).replace(/\s+/g, " ").trim().toLowerCase();

/** "99/1 ถนนทดสอบ" → "99/1". No house number at the start → the whole line, squashed (a rare free-text address). */
export function houseNumber(line1: string): string {
  const s = squash(line1).replace(/^(บ้านเลขที่|เลขที่|no\.?)\s*/, "");
  return s.match(/^[0-9][0-9/\-]*/)?.[0] ?? s;
}

/** "ต.คลองเตยเหนือ" / "แขวง คลองเตยเหนือ" / "คลองเตยเหนือ" → the same key. */
export function subdistrictKey(subdistrict: string): string {
  return squash(subdistrict).replace(/^(ตำบล|แขวง|ต\.)\s*/, "").replace(/\s/g, "");
}

/** Minimal slice of better-sqlite3 this module uses — keeps it importable without the native driver's types. */
interface Db {
  prepare(sql: string): { get(...params: unknown[]): unknown; all(...params: unknown[]): unknown[] };
}

/** An order that used the member benefit (see the head comment for the first version's two rules). */
const USED_BENEFIT_SQL =
  "(o.shipping_rule IN ('member_monthly', 'first_member_order') OR (o.shipping_rule = 'monthly_free' AND o.member_id IS NOT NULL))";

/** Orders that used the benefit this month (not cancelled) and share the member, a phone, or the address's sub-district +
 *  postcode — the house number is compared in JS (houseNumber), SQLite cannot parse it. The checkout phone has no code
 *  (otp-mode.ts), so the recipient phone and the address stop "type another number" from renewing the benefit. */
function benefitCandidatesSql(phoneCount: number, withMember: boolean, withAddress: boolean): string {
  const list = Array.from({ length: phoneCount }, () => "?").join(", ");
  const who = [
    ...(phoneCount > 0 ? [`c.phone IN (${list})`, `REPLACE(REPLACE(a.phone, '-', ''), ' ', '') IN (${list})`] : []),
    ...(withMember ? ["o.member_id = ?"] : []),
    ...(withAddress ? ["TRIM(a.postal_code) = ?"] : []),
  ];
  return `SELECT c.phone AS cphone, a.phone AS aphone, o.member_id, a.line1, a.subdistrict, TRIM(a.postal_code) AS postal
          FROM orders o
          JOIN customers c ON c.id = o.customer_id
          LEFT JOIN order_shipping_addresses a ON a.order_id = o.id
          WHERE ${USED_BENEFIT_SQL} AND o.status != 'cancelled' AND o.created_at >= ?
            AND (${who.join(" OR ")})`;
}

interface CandidateRow {
  cphone: string;
  aphone: string | null;
  member_id: number | null;
  line1: string | null;
  subdistrict: string | null;
  postal: string | null;
}

function benefitUsed(db: Db, since: string, phones: string[], memberId: number | null, address: ShippingAddressKey | null): boolean {
  if (phones.length === 0 && memberId === null && address === null) return false;
  const params: unknown[] = [since, ...phones, ...phones, ...(memberId !== null ? [memberId] : []), ...(address ? [address.postalCode.trim()] : [])];
  const rows = db.prepare(benefitCandidatesSql(phones.length, memberId !== null, address !== null)).all(...params) as CandidateRow[];
  const digits = (p: string | null) => (p ?? "").replace(/[^0-9]/g, "");
  return rows.some(
    (r) =>
      phones.includes(r.cphone) ||
      phones.includes(digits(r.aphone)) ||
      (memberId !== null && r.member_id === memberId) ||
      (address !== null &&
        r.postal === address.postalCode.trim() &&
        subdistrictKey(r.subdistrict ?? "") === subdistrictKey(address.subdistrict) &&
        houseNumber(r.line1 ?? "") === houseNumber(address.line1))
  );
}

export function loadShippingHistory(db: Db, who: ShippingIdentity, now: Date = new Date()): ShippingHistory {
  // Addresses keep the phone as typed (dashes, spaces); customers.phone is already digits only (phone.ts).
  const phones = [...new Set(who.phones.map((p) => p.replace(/[^0-9]/g, "")).filter((p) => p.length > 0))];
  return {
    isMember: who.memberId !== null,
    benefitUsed: benefitUsed(db, monthlyWindowStart(now), phones, who.memberId, who.address ?? null),
  };
}

/** The next amount that lowers the fee, for the cart's "add ฿n more" line — null when shipping is already 0. Display only. */
export function nextShippingStep(subtotal: number, history: ShippingHistory): { addMore: number; fee: number } | null {
  if (decideShipping(subtotal, history).fee === 0) return null;
  const memberStep = history.isMember && !history.benefitUsed;
  const threshold = memberStep ? MEMBER_FREE_THRESHOLD_THB : subtotal < REDUCED_THRESHOLD_THB ? REDUCED_THRESHOLD_THB : ALWAYS_FREE_THRESHOLD_THB;
  return { addMore: threshold - subtotal, fee: decideShipping(threshold, history).fee };
}

/** Why this fee, in the customer's words — the dictionary key under `cart.shippingNote` (`…Used` = a member whose benefit
 *  this month is gone; `memberUnder300` = a member with the benefit still open, below 300). */
export type ShippingNoteKey = "over800" | "memberMonthly" | "memberUnder300" | "over500" | "over500Used" | "standard" | "standardUsed";

export function shippingNoteKey(rule: ShippingRule, history: ShippingHistory): ShippingNoteKey {
  const used = history.isMember && history.benefitUsed;
  switch (rule) {
    case "over_800":
      return "over800";
    case "member_monthly":
      return "memberMonthly";
    case "over_500":
      return used ? "over500Used" : "over500";
    case "standard":
      if (used) return "standardUsed";
      return history.isMember ? "memberUnder300" : "standard";
  }
}

/** /staff order page — which rule set the fee (staff read Thai). */
export const SHIPPING_RULE_STAFF_LABEL: Record<StoredShippingRule, string> = {
  over_800: "ยอดครบ 800 (ค่าส่ง 0)",
  member_monthly: "สิทธิ์สมาชิกของเดือน · ยอดครบ 300 (ค่าส่ง 0)",
  over_500: "ยอดครบ 500 (ค่าส่ง 35)",
  standard: "ยอดต่ำกว่า 500 (ค่าส่ง 50)",
  first_member_order: "ออเดอร์แรกของสมาชิก (กฎชุดแรก 29/10 · ค่าส่ง 0)",
  monthly_free: "ยอดครบ 500 · สิทธิ์ของเดือน (กฎชุดแรก 29/10 · ค่าส่ง 0)",
  monthly_used: "ยอดครบ 500 · ใช้สิทธิ์แล้ว (กฎชุดแรก 29/10 · ค่าส่ง 35)",
};
