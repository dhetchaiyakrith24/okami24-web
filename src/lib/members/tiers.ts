import type { OrderStatus } from "@/lib/commerce/order-status";

/**
 * Member tiers — the three moon cards on /account (owner 10/11 "บัตรสมาชิกตามนั้นได้เลยครับ" on draft v8,
 * https://claude.ai/artifact/C54WAyDjcbFvTmcuWVpDGA). Pure rules; the server reads the orders (standing.ts), the contract test
 * holds the rules (tiers-contract-test.ts).
 *
 *   - The card comes by itself from the account's own order count — nobody switches it.
 *   - Only orders placed while signed in count (orders.member_id, as the member page lists them — never phone matching; BSOT
 *     "Member sign-in"), and only orders the shop has accepted: approved and every step after it. A pending, slip-submitted,
 *     still-to-verify or cancelled order does not count (Friday's call 10/11: a count that falls back after a rejected slip
 *     would take a card away again).
 *   - 2 / 5 / 10 live here only (the draft: "ตัวเลข 2 · 5 · 10 อยู่ที่เดียวในระบบ").
 *   - A tier is a card and, at 10+, a picture room. It carries no price, discount or shipping rule — BSOT: no member perks yet.
 */

export type MemberTier = "crescent" | "half" | "full";

/** Lowest counted-order number for each tier, lowest tier first. */
export const TIER_THRESHOLDS: ReadonlyArray<{ tier: MemberTier; from: number }> = [
  { tier: "crescent", from: 2 },
  { tier: "half", from: 5 },
  { tier: "full", from: 10 },
];

/** The statuses that count toward a tier: the shop accepted the order. */
export const COUNTED_STATUSES: ReadonlySet<OrderStatus> = new Set<OrderStatus>(["approved", "processing", "shipped", "completed"]);

export function countedOrders(statuses: readonly OrderStatus[]): number {
  return statuses.filter((s) => COUNTED_STATUSES.has(s)).length;
}

/** The tier for a counted-order number, or null below the first card. */
export function tierFor(count: number): MemberTier | null {
  let found: MemberTier | null = null;
  for (const t of TIER_THRESHOLDS) if (count >= t.from) found = t.tier;
  return found;
}

const RANK: Record<MemberTier, number> = { crescent: 1, half: 2, full: 3 };

/** Whether a member at `tier` may see something gated at `needs` (the picture route). */
export function tierAllows(tier: MemberTier | null, needs: MemberTier): boolean {
  return tier !== null && RANK[tier] >= RANK[needs];
}

/** Orders still to go to the first card (told to a member below it), never below 0. */
export function ordersToFirstCard(count: number): number {
  return Math.max(0, TIER_THRESHOLDS[0].from - count);
}

/**
 * The pictures behind the tier-checked route (src/app/api/account/art/[name]/route.ts): file name → the lowest tier that may
 * open it. The files live in `src/assets/member-art/` (never public/), so none can be opened, crawled or shared without the check.
 * card = the picture on that tier's card · room = the full-moon room gallery (10+ only).
 */
export const MEMBER_ART: Readonly<Record<string, { needs: MemberTier; use: "card" | "room" }>> = {
  "card-half.webp": { needs: "half", use: "card" },
  "card-full.webp": { needs: "full", use: "card" },
  "room-34.webp": { needs: "full", use: "room" },
  "room-28.webp": { needs: "full", use: "room" },
  "room-31k.webp": { needs: "full", use: "room" },
  "room-30k.webp": { needs: "full", use: "room" },
  "room-32a.webp": { needs: "full", use: "room" },
  "room-32b.webp": { needs: "full", use: "room" },
  "room-32c.webp": { needs: "full", use: "room" },
  "room-33f.webp": { needs: "full", use: "room" },
};

/** The room gallery in the draft's order. */
export const ROOM_ORDER: readonly string[] = [
  "room-34.webp",
  "room-28.webp",
  "room-31k.webp",
  "room-30k.webp",
  "room-32a.webp",
  "room-32b.webp",
  "room-32c.webp",
  "room-33f.webp",
];
