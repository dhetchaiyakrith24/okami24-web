/**
 * OKami24 — "ขายดี" on single flavours / colours (owner 02/11, src/data/bestseller-options.ts):
 *   1. every slug is a product page that has flavours, colours or variants;
 *   2. every option id is one of that product's own options (a typo would silently show nothing);
 *   3. no product badges more than half of its options — a badge on everything says nothing.
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import { BEST_SELLER_OPTIONS, bestSellerOptions } from "./bestseller-options";
import { allProducts } from "@/data/products";
import { getPublishedProducts } from "@/data/shipnity-seed/storefront-bridge";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

const optionIds = new Map<string, string[]>();
for (const p of allProducts) {
  optionIds.set(p.slug, [...(p.flavorVariants ?? []), ...(p.colorVariants ?? [])].map((v) => v.id));
}
for (const p of getPublishedProducts()) {
  if (!optionIds.has(p.slug)) optionIds.set(p.slug, p.variants.map((v) => v.id));
}

const entries = Object.entries(BEST_SELLER_OPTIONS);
const noPage = entries.filter(([slug]) => (optionIds.get(slug) ?? []).length === 0).map(([slug]) => slug);
check("every slug is a product page with options", noPage.length === 0, noPage.join(", "));

const wrongIds = entries.flatMap(([slug, ids]) => ids.filter((id) => !(optionIds.get(slug) ?? []).includes(id)).map((id) => `${slug}:${id}`));
check("every option id belongs to its product", wrongIds.length === 0, wrongIds.join(", "));

const tooMany = entries.filter(([slug, ids]) => ids.length * 2 > (optionIds.get(slug) ?? []).length).map(([slug]) => slug);
check("no product badges more than half of its options", tooMany.length === 0, tooMany.join(", "));

const dupes = entries.filter(([, ids]) => new Set(ids).size !== ids.length).map(([slug]) => slug);
check("no option listed twice", dupes.length === 0, dupes.join(", "));

check("a product with no list reads an empty set", bestSellerOptions("no-such-product").size === 0);

for (const res of results) {
  console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
}
console.log(`  (${entries.length} products, ${entries.reduce((n, [, ids]) => n + ids.length, 0)} options carry "ขายดี")`);
const failed = results.filter((x) => !x.passed);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
