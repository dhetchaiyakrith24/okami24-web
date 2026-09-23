/**
 * LINE-click counter — the pure part (round 8, owner ruling 2026-09-23 "option ก": count in-site,
 * no cookies, nothing sent outside).
 *
 * This module has NO `server-only` import and touches no database on purpose: the client tracker
 * (`src/components/layout/LineClickTracker.tsx`), the route handler, the read-out script under
 * `scripts/` and the contract test all share these definitions, and `scripts/*` run under plain
 * `tsx` where `server-only` throws (see src/lib/commerce/catalog-resolver.ts's comment).
 *
 * What a click record may contain is decided HERE, and it is deliberately small: a page path with
 * its query string and hash removed, and one word for the spot the link sits in. Anything else the
 * browser could tell us (referrer, user agent, screen size, an id) is not accepted by `parseLineClick`
 * — a payload that carries more than these two fields is still only read for these two.
 */

/** The endpoint the tracker posts to and the read-out reads from (`src/app/api/metrics/line-click/route.ts`). */
export const LINE_CLICK_ENDPOINT = "/api/metrics/line-click";

/** Where on the page the LINE link sat. `data-line-spot` on the anchor (or an ancestor) names it;
 *  a LINE link inside `<footer>` with no attribute counts as "footer"; everything else is "other". */
export const LINE_CLICK_SPOTS = ["pill", "buy", "buy-note", "footer", "other"] as const;
export type LineClickSpot = (typeof LINE_CLICK_SPOTS)[number];

export interface LineClick {
  page: string;
  spot: LineClickSpot;
}

/** The largest request body the route accepts. A real payload is ~60 bytes. */
export const MAX_BODY_BYTES = 512;
/** Longest page path kept — the site's longest real path is well under this. */
export const MAX_PAGE_LENGTH = 120;

/** Path characters the site actually uses (slugs are ASCII; a percent-encoded byte is allowed so an
 *  encoded path still normalises instead of being dropped). */
const SAFE_PATH = /^[A-Za-z0-9\-._~/%]+$/;

/** Paths whose tail is a per-customer identifier (an order number, a preview id). The tail is
 *  replaced by `*` so the table can never be joined back to one person's order. */
const COLLAPSE_PREFIXES = ["/orders/", "/preview/"];

/**
 * Turn whatever the browser sent as `page` into the path that gets stored, or `null` if it is
 * not a plausible path of this site. Query string and hash are always removed.
 */
export function normalizePage(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  let page = raw.split("?")[0].split("#")[0].trim();
  if (page === "" || !page.startsWith("/") || page.startsWith("//") || page.includes("..")) return null;
  if (page.length > MAX_PAGE_LENGTH || !SAFE_PATH.test(page)) return null;
  if (page.length > 1 && page.endsWith("/")) page = page.slice(0, -1);
  for (const prefix of COLLAPSE_PREFIXES) {
    if (page.startsWith(prefix)) return `${prefix}*`;
  }
  return page;
}

/** A spot the tracker did not name, or named with a word this module does not know, is "other". */
export function normalizeSpot(raw: unknown): LineClickSpot {
  return typeof raw === "string" && (LINE_CLICK_SPOTS as readonly string[]).includes(raw) ? (raw as LineClickSpot) : "other";
}

/** Parse a request body (JSON text) into a click record, or `null` when it is not one. */
export function parseLineClick(body: string): LineClick | null {
  if (typeof body !== "string" || body.length === 0 || body.length > MAX_BODY_BYTES) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const page = normalizePage((parsed as { page?: unknown }).page);
  if (!page) return null;
  return { page, spot: normalizeSpot((parsed as { spot?: unknown }).spot) };
}

/** Calendar day in Thailand (UTC+7) as `YYYY-MM-DD`, for the `day_th` column. */
export function bangkokDay(now: Date = new Date()): string {
  return new Date(now.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** Bangkok day `days - 1` days before `now` — the first day a `days`-wide window includes. */
export function bangkokDayWindowStart(days: number, now: Date = new Date()): string {
  const span = Math.max(1, Math.min(365, Math.floor(days)));
  return bangkokDay(new Date(now.getTime() - (span - 1) * 24 * 60 * 60 * 1000));
}
