import { FIRST_LISTED } from "@/data/first-listed";

/**
 * The sales badge on cards and the product head (owner 30/10: "ทำงานป้าย · สินค้ามาใหม่ · สินค้าขายดี …"). His answers 30/10:
 *   - "ขายดี" and "ยอดนิยม" are ONE badge ("คืออันเดียวกันเลือกอันเดียว") — shown as "ขายดี";
 *   - what counts as a best seller: NOW his own merchant lists in BSOT §15 ("Real best sellers" + "Customer favorites" —
 *     "ตอนนี้อ้างอิงคำตัดสินเก่า"); LATER counted from real web orders ("อนาคตใช้การนับออเดอร์") — switch BEST_SELLER_SOURCE
 *     and add the order count there (not built: the cart opened 22/10, too few orders yet; the threshold is his to set);
 *   - "มาใหม่" = "7-14 วัน" after the product went live (src/data/first-listed.ts) — see newWindowDays.
 * One badge per product (designer 30/10): "มาใหม่" first — it runs out on its own — then "ขายดี". Small and import-light on
 * purpose: product cards also render inside client components (catalog browser, search, favourites).
 */

/** "มาใหม่" lasts NEW_MAX_DAYS after the first-listed day, never fewer than NEW_MIN_DAYS (owner 30/10 "7-14 วัน"). */
export const NEW_MAX_DAYS = 14;
export const NEW_MIN_DAYS = 7;
/** Friday's reading of "7-14" (reversible): a big listing batch would badge too much of the shop, so the window shrinks
 *  from 14 toward 7 days until at most this share of the listed products reads "มาใหม่" (7 days is the floor either way). */
export const NEW_SHARE_CAP = 0.25;

/** Where "ขายดี" comes from. "owner-list" = OWNER_BEST_SELLERS below. "web-orders" = not built yet (see the head note). */
export const BEST_SELLER_SOURCE: "owner-list" | "web-orders" = "owner-list";

/**
 * BSOT §15, mapped to site pages (each model's kit and its pods are one model to the shop):
 *   Real best sellers — Esko Bar Switch 20K (kit pod-159 + pods esko-bar-switch-pod) · M Switch 15K (SALTHUB M Switch kit + pod) ·
 *     "Relx Connector 20K" = Muro Connector 20K (owner 30/10: "คือ Muro Connector 20K บนเว็บใช่ไหม Muro ขายดีแทบทุกตัว") —
 *     and with it every Muro product on the site except Muro Space 15K (BSOT §15 "Not recommended" — "แทบทุกตัว");
 *   Customer favorites — Nexbar Clear 18K (pod-180) · Marbo 10K = not on the site (marbo-10k-clone is the lookalike the owner
 *     keeps out of every pick — HANDOFF §18 — so it gets no badge).
 */
export const OWNER_BEST_SELLERS: ReadonlySet<string> = new Set([
  "pod-159",
  "esko-bar-switch-pod",
  "m-switch-kit",
  "m-switch-pod",
  "pod-180",
  "muro-connector-20k",
  "muro-3ml",
  "muro-sc-8000",
  "muro-freebase",
  "muro-salt-nic",
]);

export type SalesBadgeKind = "new" | "best";

function addDays(day: string, n: number): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Days "มาใหม่" lasts on `today`: the longest window from NEW_MAX_DAYS down to NEW_MIN_DAYS that badges at most
 *  NEW_SHARE_CAP of the listed products; NEW_MIN_DAYS when even that is over the cap. */
export function newWindowDays(today: string, listed: Readonly<Record<string, string>> = FIRST_LISTED): number {
  const days = Object.values(listed);
  const cap = days.length * NEW_SHARE_CAP;
  for (let n = NEW_MAX_DAYS; n > NEW_MIN_DAYS; n--) {
    if (days.filter((d) => d <= today && today < addDays(d, n)).length <= cap) return n;
  }
  return NEW_MIN_DAYS;
}

export function isBestSeller(slug: string): boolean {
  return BEST_SELLER_SOURCE === "owner-list" && OWNER_BEST_SELLERS.has(slug);
}

/** Today in Bangkok as yyyy-mm-dd (the shop's day — FIRST_LISTED dates are Bangkok deploy days). */
export function bangkokToday(now: number): string {
  return new Date(now + 7 * 3600_000).toISOString().slice(0, 10);
}

/** The one badge a product shows on `today` (yyyy-mm-dd), or null. A product sold out in every option shows none. */
export function salesBadge(slug: string, today: string, soldOut = false, listed: Readonly<Record<string, string>> = FIRST_LISTED): SalesBadgeKind | null {
  if (soldOut) return null;
  const day = listed[slug];
  if (day && day <= today && today < addDays(day, newWindowDays(today, listed))) return "new";
  return isBestSeller(slug) ? "best" : null;
}
