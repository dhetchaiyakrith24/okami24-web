import "server-only";
import { getDb } from "@/lib/db/client";
import { isOrderStatus } from "@/lib/commerce/order-status";
import { countedOrders, tierFor, type MemberTier } from "./tiers";

/** A member's place on the moon cards — read from this member's own orders only (orders.member_id), never phone matching. */
export interface MemberStanding {
  /** Orders the shop accepted (tiers.ts COUNTED_STATUSES). */
  count: number;
  tier: MemberTier | null;
  /** members.created_at (ISO, UTC) — "สมาชิกตั้งแต่" on the card. */
  memberSince: string | null;
}

export function getMemberStanding(memberId: number): MemberStanding {
  const db = getDb();
  const statuses = (db.prepare("SELECT status FROM orders WHERE member_id = ?").all(memberId) as { status: string }[])
    .map((r) => r.status)
    .filter(isOrderStatus);
  const since = db.prepare("SELECT created_at FROM members WHERE id = ?").get(memberId) as { created_at: string } | undefined;
  const count = countedOrders(statuses);
  return { count, tier: tierFor(count), memberSince: since?.created_at ?? null };
}
