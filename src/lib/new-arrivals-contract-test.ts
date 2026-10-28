/**
 * Contract test for the homepage "สินค้าเข้าใหม่" row (owner 29/10) — run by `npx tsx scripts/verify-catalog.ts`.
 * The row reads src/data/first-listed.ts, so the gate is that file: every product the site sells has a real listing date,
 * and no date points at a product that is not in the catalog any more. A listing PR that forgets its line fails here
 * with the exact line to add.
 */
import { allCatalogItems } from "@/lib/catalog-index";
import { FIRST_LISTED } from "@/data/first-listed";
import { newArrivalSlugs } from "@/lib/new-arrivals";

const results: { name: string; passed: boolean; detail?: string }[] = [];
const check = (name: string, passed: boolean, detail?: string) => results.push({ name, passed, detail });

const priced = allCatalogItems().filter((i) => i.sellingPrice !== null);
const today = new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10); // Bangkok
const missing = priced.filter((i) => !FIRST_LISTED[i.slug]);
check(
  "1. every priced product has a listing date",
  missing.length === 0,
  `add to src/data/first-listed.ts: ${missing.map((i) => `"${i.slug}": "${today}"`).join(", ")}`
);
const bad = Object.entries(FIRST_LISTED).filter(([, d]) => !/^\d{4}-\d{2}-\d{2}$/.test(d) || Number.isNaN(Date.parse(d)) || d > today);
check("2. every date is a real yyyy-mm-dd, not in the future", bad.length === 0, bad.map(([s, d]) => `${s}=${d}`).join(", "));
const known = new Set(allCatalogItems().map((i) => i.slug));
const stale = Object.keys(FIRST_LISTED).filter((s) => !known.has(s));
check("3. no date for a product the catalog no longer has", stale.length === 0, `remove: ${stale.join(", ")}`);
const row = newArrivalSlugs(8);
const dates = row.map((s) => FIRST_LISTED[s]);
check("4. the row is newest first", dates.every((d, i) => i === 0 || dates[i - 1] >= d), row.join(", "));

for (const res of results) {
  console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
}
const failed = results.filter((x) => !x.passed);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
