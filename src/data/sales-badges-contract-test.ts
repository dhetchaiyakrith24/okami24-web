/**
 * OKami24 — sales badges (owner 30/10, src/data/sales-badges.ts):
 *   1. every "ขายดี" slug is a live, priced product page (a typo would silently show nothing);
 *   2. the products the owner keeps out (Marbo lookalike · Muro Space 15K) never carry "ขายดี";
 *   3. "มาใหม่" lasts 14 days, shrinking toward 7 while a big batch would badge more than NEW_SHARE_CAP of the shop;
 *   4. one badge: new first, then best seller; a product sold out in every option carries none.
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import { BEST_SELLER_SOURCE, NEW_MAX_DAYS, NEW_MIN_DAYS, NEW_SHARE_CAP, OWNER_BEST_SELLERS, bangkokToday, newWindowDays, salesBadge } from "./sales-badges";
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
check("best sellers: not the Marbo lookalike, not Muro Space 15K", !OWNER_BEST_SELLERS.has("marbo-10k-clone") && !OWNER_BEST_SELLERS.has("muro-space-15k"));

// 3 — a made-up shop of 20 products: 2 listed on day 0, the rest long ago
const old = Object.fromEntries(Array.from({ length: 18 }, (_, i) => [`old-${i}`, "2026-01-01"]));
const small = { ...old, "a": "2026-10-01", "b": "2026-10-01" };
check("new: a small batch keeps the full 14 days", newWindowDays("2026-10-10", small) === NEW_MAX_DAYS);
check("new: day 0 and day 13 are new, day 14 is not", salesBadge("a", "2026-10-01", false, small) === "new" && salesBadge("a", "2026-10-14", false, small) === "new" && salesBadge("a", "2026-10-15", false, small) === null);
// 8 of 20 listed 5 days ago + 2 more 10 days ago: 14 days would badge 10 (50 %) → shrink until ≤ 5 (25 %)
const big = { ...Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`old-${i}`, "2026-01-01"])), ...Object.fromEntries(Array.from({ length: 8 }, (_, i) => [`new-${i}`, "2026-10-05"])), "x": "2026-10-01", "y": "2026-10-01" };
check("new: a big batch shrinks the window toward 7", newWindowDays("2026-10-10", big) < NEW_MAX_DAYS && newWindowDays("2026-10-10", big) >= NEW_MIN_DAYS, String(newWindowDays("2026-10-10", big)));
check("new: never under 7 days", salesBadge("new-0", "2026-10-11", false, big) === "new");
check("new: share cap is a quarter", NEW_SHARE_CAP === 0.25);
const today = "2026-10-30";
const live = Object.keys(FIRST_LISTED).filter((s) => salesBadge(s, today) === "new").length;
const w = newWindowDays(today);
check("new: on the real catalog the count respects the cap (or the 7-day floor)", w === NEW_MIN_DAYS || live <= Object.keys(FIRST_LISTED).length * NEW_SHARE_CAP, `${live} new, window ${w}`);
check("today: Bangkok day (UTC+7)", bangkokToday(Date.parse("2026-10-30T17:30:00Z")) === "2026-10-31" && bangkokToday(Date.parse("2026-10-30T16:59:00Z")) === "2026-10-30");

// 4
const best = [...OWNER_BEST_SELLERS].find((s) => salesBadge(s, "2099-01-01") === "best");
check("best: an old best seller reads best", best !== undefined);
check("one badge: new wins over best", salesBadge("pod-180", "2026-01-01", false, { ...small, "pod-180": "2026-01-01" }) === "new");
check("none: a product never listed and not a best seller", salesBadge("no-such-product", "2099-01-01") === null);
check("sold out: no badge", salesBadge("a", "2026-10-01", true, small) === null && (best === undefined || salesBadge(best, "2099-01-01", true) === null));

for (const res of results) {
  console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
}
console.log(`  (real catalog ${today}: ${live} of ${Object.keys(FIRST_LISTED).length} read "มาใหม่", window ${w} days)`);
const failed = results.filter((x) => !x.passed);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
