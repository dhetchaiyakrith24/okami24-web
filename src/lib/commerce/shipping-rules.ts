/**
 * Shipping-fee tiers — owner, chat 2026-10-29 (docs/BUSINESS_SOURCE_OF_TRUTH.md §10), his words: "สมัครแล้วส่งฟรีครั้งแรก ·
 * ครบ ฿500 ส่งฟรีเดือนละครั้ง · ครบ ฿800 ส่งฟรีทุกครั้ง และครั้งที่ 500 แต่ไม่ได้ส่งฟรีในเดือนนั้น ๆ ให้คิดค่าส่งแค่ 35 บาท".
 * Checked in this order, first match wins:
 *   1. `first_member_order` — signed in (LINE / Google) and this member has no earlier order that is not cancelled → 0,
 *      any amount. It is the member's first order, so it is used up even when the order is 800+ (free either way).
 *   2. `over_800`           — subtotal ≥ 800 → 0, every time, uses up nothing.
 *   3. `monthly_free`       — subtotal ≥ 500 and no `monthly_free` order (not cancelled) yet in the window → 0.
 *   4. `monthly_used`       — subtotal ≥ 500, the window's one is used (or MONTHLY_FREE_FOR excludes this visitor) → 35.
 *   5. `standard`           — below 500 → 50.
 * A cancelled order never uses up 1 or 3 (customer cancel, staff cancel, or the 24-hour unpaid sweep). Only orders stored
 * with rule `monthly_free` count for 3 — orders placed before migration 0022 (rule NULL) count for nothing.
 *
 * Pure (no `server-only`, no I/O beyond the `db` handed in) so shipping-rules-contract-test.ts can run it on an in-memory
 * SQLite built from the real migrations.
 */

export const STANDARD_SHIPPING_FEE_THB = 50;
export const REDUCED_SHIPPING_FEE_THB = 35;
export const MONTHLY_FREE_THRESHOLD_THB = 500;
export const ALWAYS_FREE_THRESHOLD_THB = 800;

/** Q1 (open with the owner 29/10) — who the once-a-month rule counts for. "everyone" = guests too, counted per phone
 *  number (and per member when signed in); "members" = only signed-in members, guests at 500+ pay the 35 rate. */
export type MonthlyFreeFor = "everyone" | "members";
export const MONTHLY_FREE_FOR = "everyone" as MonthlyFreeFor;
/** Q2 (open with the owner 29/10) — what "a month" is. Calendar month in Bangkok time, or 30 days back from now. */
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
  /** The member already has an order that is not cancelled. */
  memberHasOrder: boolean;
  /** A `monthly_free` order (not cancelled) for this phone / member exists inside the window. */
  monthlyFreeUsed: boolean;
}

export const UNKNOWN_VISITOR: ShippingHistory = { isMember: false, memberHasOrder: false, monthlyFreeUsed: false };

export interface ShippingDecision {
  rule: ShippingRule;
  fee: number;
}

export function decideShipping(subtotal: number, history: ShippingHistory, settings: ShippingSettings = SHIPPING_SETTINGS): ShippingDecision {
  if (history.isMember && !history.memberHasOrder) return { rule: "first_member_order", fee: 0 };
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

/** Who is ordering: the member, and the checkout + recipient phones (either may be empty before checkout). */
export interface ShippingIdentity {
  memberId: number | null;
  phones: string[];
}

/** Minimal slice of better-sqlite3 this module uses — keeps it importable without the native driver's types. */
interface Db {
  prepare(sql: string): { get(...params: unknown[]): unknown };
}

const MEMBER_HAS_ORDER_SQL = "SELECT 1 FROM orders WHERE member_id = ? AND status != 'cancelled' LIMIT 1";

/** A `monthly_free` order inside the window that shares the member, the checkout phone or the recipient phone. The checkout
 *  phone has no code (otp-mode.ts), so matching the recipient's phone too stops "type another number" from renewing it. */
function monthlyFreeUsedSql(phoneCount: number, withMember: boolean): string {
  const list = Array.from({ length: phoneCount }, () => "?").join(", ");
  const who = [
    ...(phoneCount > 0 ? [`c.phone IN (${list})`, `REPLACE(REPLACE(a.phone, '-', ''), ' ', '') IN (${list})`] : []),
    ...(withMember ? ["o.member_id = ?"] : []),
  ];
  return `SELECT 1 FROM orders o
          JOIN customers c ON c.id = o.customer_id
          LEFT JOIN order_shipping_addresses a ON a.order_id = o.id
          WHERE o.shipping_rule = 'monthly_free' AND o.status != 'cancelled' AND o.created_at >= ?
            AND (${who.join(" OR ")})
          LIMIT 1`;
}

export function loadShippingHistory(db: Db, who: ShippingIdentity, now: Date = new Date(), settings: ShippingSettings = SHIPPING_SETTINGS): ShippingHistory {
  // Addresses keep the phone as typed (dashes, spaces); customers.phone is already digits only (phone.ts).
  const phones = [...new Set(who.phones.map((p) => p.replace(/[^0-9]/g, "")).filter((p) => p.length > 0))];
  const isMember = who.memberId !== null;
  const memberHasOrder = isMember && db.prepare(MEMBER_HAS_ORDER_SQL).get(who.memberId) !== undefined;
  let monthlyFreeUsed = false;
  if (phones.length > 0 || isMember) {
    const params: unknown[] = [monthlyWindowStart(now, settings.monthlyWindow), ...phones, ...phones, ...(isMember ? [who.memberId] : [])];
    monthlyFreeUsed = db.prepare(monthlyFreeUsedSql(phones.length, isMember)).get(...params) !== undefined;
  }
  return { isMember, memberHasOrder, monthlyFreeUsed };
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
