/**
 * OKami24 — sales badges (owner 30/10, src/data/sales-badges.ts):
 *   1. every "ขายดี" slug is a live, priced product page (a typo would silently show nothing);
 *   2. the lookalike the owner keeps out of every pick (HANDOFF §18) never carries "ขายดี";
 *   3. "มาใหม่" lasts NEW_FOR_DAYS from the first-listed day, then the product falls back to "ขายดี" or nothing;
 *   4. a product sold out in every option carries no badge.
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import { BEST_SELLER_SOURCE, NEW_FOR_DAYS, OWNER_BEST_SELLERS, bangkokToday, newUntil, salesBadge } from "./sales-badges";
import { FIRST_LISTED } from "./first-listed";
import { getCatalogItem } from "@/lib/catalog-index";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

// 1
const missing = [...OWNER_BEST_SELLERS].filter((slug) => getCatalogItem(slug)?.sellingPrice == null);
check("best sellers: every slug is a priced product page", missing.length === 0, missing.join(", "));
check("best sellers: the source is the owner's list (orders not built yet)", BEST_SELLER_SOURCE === "owner-list");

// 2
check("best sellers: the Marbo lookalike is not one", !OWNER_BEST_SELLERS.has("marbo-10k-clone"));

// 3
const [slug, day] = Object.entries(FIRST_LISTED)[0];
const plus = (n: number) => {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
check("new: until = first-listed + NEW_FOR_DAYS", newUntil(slug) === plus(NEW_FOR_DAYS), `${newUntil(slug)}`);
check("new: on the first-listed day", salesBadge(slug, day) === "new");
check("new: on the last day", salesBadge(slug, plus(NEW_FOR_DAYS - 1)) === "new");
check("new: gone after NEW_FOR_DAYS", salesBadge(slug, plus(NEW_FOR_DAYS)) === (OWNER_BEST_SELLERS.has(slug) ? "best" : null));
const best = [...OWNER_BEST_SELLERS][0];
check("best: an old best seller reads best", salesBadge(best, "2099-01-01") === "best");
check("none: a product never listed and not a best seller", salesBadge("no-such-product", "2099-01-01") === null);
check("today: Bangkok day (UTC+7)", bangkokToday(Date.parse("2026-10-30T17:30:00Z")) === "2026-10-31" && bangkokToday(Date.parse("2026-10-30T16:59:00Z")) === "2026-10-30");

// 4
check("sold out: no badge", salesBadge(slug, day, true) === null && salesBadge(best, "2099-01-01", true) === null);

for (const res of results) {
  console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
}
const failed = results.filter((x) => !x.passed);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
