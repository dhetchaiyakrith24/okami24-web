import { FIRST_LISTED } from "@/data/first-listed";

/**
 * The sales badge on cards and the product head (owner 30/10: "ทำงานป้าย · สินค้ามาใหม่ · สินค้าขายดี …"). His answers 30/10:
 *   - "ขายดี" and "ยอดนิยม" are ONE badge ("คืออันเดียวกันเลือกอันเดียว") — shown as "ขายดี";
 *   - what counts as a best seller: NOW his own merchant lists in BSOT §15 ("Real best sellers" + "Customer favorites" —
 *     "ตอนนี้อ้างอิงคำตัดสินเก่า"); LATER counted from real web orders ("อนาคตใช้การนับออเดอร์") — switch BEST_SELLER_SOURCE
 *     and add the order count there (not built: the cart opened 22/10, too few orders yet; the threshold is his to set);
 *   - "มาใหม่" = the first NEW_FOR_DAYS days after the product went live (src/data/first-listed.ts).
 * One badge per product (designer 30/10): "มาใหม่" first — it runs out on its own — then "ขายดี". Small and import-light on
 * purpose: product cards also render inside client components (catalog browser, search, favourites).
 */

/** Days a product reads "มาใหม่" after its first-listed day (owner 30/10 "3 A-B" — 7 now; one place to change). */
export const NEW_FOR_DAYS = 7;

/** Where "ขายดี" comes from. "owner-list" = OWNER_BEST_SELLERS below. "web-orders" = not built yet (see the head note). */
export const BEST_SELLER_SOURCE: "owner-list" | "web-orders" = "owner-list";

/**
 * BSOT §15, mapped to site pages (each model's kit and its pods are one model to the shop):
 *   Real best sellers — Esko Bar Switch 20K (kit pod-159 + pods esko-bar-switch-pod) · M Switch 15K (SALTHUB M Switch kit + pod) ·
 *     "Relx Connector 20K" = NOT LISTED until the owner confirms it is the site's Muro Connector 20K (asked 30/10);
 *   Customer favorites — Nexbar Clear 18K (pod-180) · Marbo 10K = not on the site (marbo-10k-clone is the lookalike the owner
 *     keeps out of every pick — HANDOFF §18 — so it gets no badge).
 */
export const OWNER_BEST_SELLERS: ReadonlySet<string> = new Set(["pod-159", "esko-bar-switch-pod", "m-switch-kit", "m-switch-pod", "pod-180"]);

export type SalesBadgeKind = "new" | "best";

/** The last day (exclusive, Bangkok ISO date) a product reads "มาใหม่"; null = never listed in FIRST_LISTED. */
export function newUntil(slug: string): string | null {
  const day = FIRST_LISTED[slug];
  if (!day) return null;
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + NEW_FOR_DAYS);
  return d.toISOString().slice(0, 10);
}

export function isBestSeller(slug: string): boolean {
  return BEST_SELLER_SOURCE === "owner-list" && OWNER_BEST_SELLERS.has(slug);
}

/** Today in Bangkok as yyyy-mm-dd (the shop's day — FIRST_LISTED dates are Bangkok deploy days). */
export function bangkokToday(now: number): string {
  return new Date(now + 7 * 3600_000).toISOString().slice(0, 10);
}

/** The one badge a product shows on `today` (yyyy-mm-dd), or null. A product sold out in every option shows none. */
export function salesBadge(slug: string, today: string, soldOut = false): SalesBadgeKind | null {
  if (soldOut) return null;
  const until = newUntil(slug);
  if (until !== null && today < until) return "new";
  return isBestSeller(slug) ? "best" : null;
}
