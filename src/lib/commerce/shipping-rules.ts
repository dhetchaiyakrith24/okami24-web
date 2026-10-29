/**
 * Shipping-fee tiers — owner, chat 2026-10-29 (docs/BUSINESS_SOURCE_OF_TRUTH.md §10), his words: "สมัครแล้วส่งฟรีครั้งแรก ·
 * ครบ ฿500 ส่งฟรีเดือนละครั้ง · ครบ ฿800 ส่งฟรีทุกครั้ง และครั้งที่ 500 แต่ไม่ได้ส่งฟรีในเดือนนั้น ๆ ให้คิดค่าส่งแค่ 35 บาท".
 * Checked in this order, first match wins:
 *   1. `first_member_order` — signed in (LINE / Google), the member has no order that is not cancelled, and no earlier
 *      `first_member_order` order shares this phone or address → 0, any amount. It is the member's first order, so it is
 *      used up even when the order is 800+ (free either way).
 *   2. `over_800`           — subtotal ≥ 800 → 0, every time, uses up nothing.
 *   3. `monthly_free`       — subtotal ≥ 500 and no `monthly_free` order (not cancelled) in the window shares this
 *      member, phone or address → 0.
 *   4. `monthly_used`       — subtotal ≥ 500, the window's one is used (or MONTHLY_FREE_FOR excludes this visitor) → 35.
 *   5. `standard`           — below 500 → 50.
 * Anti-reuse (owner 29/10 "ตามแนะนำ", BSOT §10): a benefit already used is not given again when the PHONE (checkout or
 * recipient) or the ADDRESS (house no. + sub-district + postcode) matches an order that used it — the recipient's name
 * alone never blocks. A cancelled order never uses a benefit up (customer cancel, staff cancel, or the 24-hour unpaid sweep).
 * Orders placed before migration 0022 (rule NULL) count for nothing.
 *
 * Pure (no `server-only`, no I/O beyond the `db` handed in) so shipping-rules-contract-test.ts can run it on an in-memory
 * SQLite built from the real migrations.
 */

export const STANDARD_SHIPPING_FEE_THB = 50;
export const REDUCED_SHIPPING_FEE_THB = 35;
export const MONTHLY_FREE_THRESHOLD_THB = 500;
export const ALWAYS_FREE_THRESHOLD_THB = 800;

/** Q1 — who the once-a-month rule counts for. Owner 29/10 ("ตามแนะนำ"): "everyone" = guests too, counted per phone /
 *  address (and per member when signed in). "members" = only signed-in members; guests at 500+ pay the 35 rate. */
export type MonthlyFreeFor = "everyone" | "members";
export const MONTHLY_FREE_FOR = "everyone" as MonthlyFreeFor;
/** Q2 — what "a month" is. Owner 29/10 ("ตามแนะนำ"): calendar month in Bangkok time. "rolling-30-days" = 30 days back. */
export type MonthlyWindow = "calendar-month-bangkok" | "rolling-30-days";
export const MONTHLY_WINDOW = "calendar-month-bangkok" as MonthlyWindow;

export const SHIPPING_RULES = ["first_member_order", "over_800", "monthly_free", "monthly_used", "standard"] as const;
export type ShippingRule = (typeof SHIPPING_RULES)[number];

export function isShippingRule(value: unknown): value is ShippingRule {
  return typeof value === "string" && (SHIPPING_RULES as readonly string[]).includes(value);
}

export interface ShippingSettings {
  monthlyFreeFor: MonthlyFreeFor;
  monthlyWindow: MonthlyWindow;
}

export const SHIPPING_SETTINGS: ShippingSettings = { monthlyFreeFor: MONTHLY_FREE_FOR, monthlyWindow: MONTHLY_WINDOW };

/** What the rules need to know about the visitor. A visitor nobody can identify yet (no phone, not signed in) = all false. */
export interface ShippingHistory {
  isMember: boolean;
  /** The first-order benefit is gone: the member already has an order that is not cancelled, or an earlier
   *  `first_member_order` order shares this phone or address. Worked out for guests too (by phone / address only): the
   *  cart then invites a member back in without promising 0 shipping. */
  firstOrderUsed: boolean;
  /** A `monthly_free` order (not cancelled) inside the window shares this member, phone or address. */
  monthlyFreeUsed: boolean;
}

export const UNKNOWN_VISITOR: ShippingHistory = { isMember: false, firstOrderUsed: false, monthlyFreeUsed: false };

export interface ShippingDecision {
  rule: ShippingRule;
  fee: number;
}

export function decideShipping(subtotal: number, history: ShippingHistory, settings: ShippingSettings = SHIPPING_SETTINGS): ShippingDecision {
  if (history.isMember && !history.firstOrderUsed) return { rule: "first_member_order", fee: 0 };
  if (subtotal >= ALWAYS_FREE_THRESHOLD_THB) return { rule: "over_800", fee: 0 };
  if (subtotal >= MONTHLY_FREE_THRESHOLD_THB) {
    const counts = settings.monthlyFreeFor === "everyone" || history.isMember;
    if (counts && !history.monthlyFreeUsed) return { rule: "monthly_free", fee: 0 };
    return { rule: "monthly_used", fee: REDUCED_SHIPPING_FEE_THB };
  }
  return { rule: "standard", fee: STANDARD_SHIPPING_FEE_THB };
}

const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000; // Thailand has no daylight saving

/** Start of the once-a-month window, as the same ISO-8601 UTC text `orders.created_at` holds (so it compares as text). */
export function monthlyWindowStart(now: Date, window: MonthlyWindow = MONTHLY_WINDOW): string {
  if (window === "rolling-30-days") return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
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

const MEMBER_HAS_ORDER_SQL = "SELECT 1 FROM orders WHERE member_id = ? AND status != 'cancelled' LIMIT 1";

/** Orders with `rule` (not cancelled, inside the window when given) that share the member, a phone, or the address's
 *  sub-district + postcode — the house number is compared in JS (houseNumber), SQLite cannot parse it. The checkout phone
 *  has no code (otp-mode.ts), so the recipient phone and the address stop "type another number" from renewing a benefit. */
function benefitCandidatesSql(phoneCount: number, withMember: boolean, withAddress: boolean, withWindow: boolean): string {
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
          WHERE o.shipping_rule = ? AND o.status != 'cancelled'${withWindow ? " AND o.created_at >= ?" : ""}
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

function benefitUsed(db: Db, rule: ShippingRule, since: string | null, phones: string[], memberId: number | null, address: ShippingAddressKey | null): boolean {
  if (phones.length === 0 && memberId === null && address === null) return false;
  const params: unknown[] = [rule, ...(since ? [since] : []), ...phones, ...phones, ...(memberId !== null ? [memberId] : []), ...(address ? [address.postalCode.trim()] : [])];
  const rows = db.prepare(benefitCandidatesSql(phones.length, memberId !== null, address !== null, since !== null)).all(...params) as CandidateRow[];
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

export function loadShippingHistory(db: Db, who: ShippingIdentity, now: Date = new Date(), settings: ShippingSettings = SHIPPING_SETTINGS): ShippingHistory {
  // Addresses keep the phone as typed (dashes, spaces); customers.phone is already digits only (phone.ts).
  const phones = [...new Set(who.phones.map((p) => p.replace(/[^0-9]/g, "")).filter((p) => p.length > 0))];
  const address = who.address ?? null;
  const isMember = who.memberId !== null;
  const firstOrderUsed =
    (isMember && db.prepare(MEMBER_HAS_ORDER_SQL).get(who.memberId) !== undefined) || benefitUsed(db, "first_member_order", null, phones, null, address);
  const monthlyFreeUsed = benefitUsed(db, "monthly_free", monthlyWindowStart(now, settings.monthlyWindow), phones, who.memberId, address);
  return { isMember, firstOrderUsed, monthlyFreeUsed };
}

/** The next amount that lowers the fee, for the cart's "add ฿n more" line — null when shipping is already 0. Display only. */
export function nextShippingStep(
  subtotal: number,
  history: ShippingHistory,
  settings: ShippingSettings = SHIPPING_SETTINGS
): { addMore: number; fee: number } | null {
  const now = decideShipping(subtotal, history, settings);
  if (now.fee === 0) return null;
  const threshold = now.rule === "standard" ? MONTHLY_FREE_THRESHOLD_THB : ALWAYS_FREE_THRESHOLD_THB;
  return { addMore: threshold - subtotal, fee: decideShipping(threshold, history, settings).fee };
}

/** Why this fee, in the customer's words — the dictionary key under `cart.shippingNote` (`monthlyMembersOnly` = Q1 set to
 *  members and a guest reached 500; the two month lines follow MONTHLY_WINDOW). */
export type ShippingNoteKey =
  | "firstMemberOrder"
  | "over800"
  | "monthlyFree"
  | "monthlyFreeRolling"
  | "monthlyUsed"
  | "monthlyUsedRolling"
  | "monthlyMembersOnly"
  | "standard";

export function shippingNoteKey(rule: ShippingRule, history: ShippingHistory, settings: ShippingSettings = SHIPPING_SETTINGS): ShippingNoteKey {
  const rolling = settings.monthlyWindow === "rolling-30-days";
  switch (rule) {
    case "first_member_order":
      return "firstMemberOrder";
    case "over_800":
      return "over800";
    case "monthly_free":
      return rolling ? "monthlyFreeRolling" : "monthlyFree";
    case "monthly_used":
      if (settings.monthlyFreeFor === "members" && !history.isMember) return "monthlyMembersOnly";
      return rolling ? "monthlyUsedRolling" : "monthlyUsed";
    case "standard":
      return "standard";
  }
}

/** /staff order page — which rule set the fee (staff read Thai). */
export const SHIPPING_RULE_STAFF_LABEL: Record<ShippingRule, string> = {
  first_member_order: "ออเดอร์แรกของสมาชิก (ค่าส่ง 0)",
  over_800: "ยอดครบ 800 (ค่าส่ง 0)",
  monthly_free: "ยอดครบ 500 · สิทธิ์ค่าส่ง 0 ของเดือน",
  monthly_used: "ยอดครบ 500 · ใช้สิทธิ์เดือนนี้แล้ว (ค่าส่ง 35)",
  standard: "ยอดต่ำกว่า 500 (ค่าส่ง 50)",
};
