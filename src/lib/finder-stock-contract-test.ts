/**
 * OKami24 — Finder results hold only what a visitor can buy (owner 07/11, the rule of the cart's suggestions):
 *   1. by the build's stock, no sold-out or unpriced product in the matches, the alternatives or the unranked list;
 *   2. the live answer overrides the build, both ways;
 *   3. nothing to buy = empty lists, never a sold-out card to fill the page.
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import { allProducts } from "@/data/products";
import { getPublishedProduct } from "@/data/shipnity-seed/storefront-bridge";
import { matchProducts, unscoredCatalogMatches, type FinderAnswers } from "@/lib/finder";
import { legacyCardStock, publishedCardStock, type CardStockChanges } from "@/lib/stock/card-stock";

const results: { name: string; passed: boolean; detail: string }[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

const formats: FinderAnswers["format"][] = ["open-pod", "pod-kit", "disposable", "no-preference"];
const answerSet = (format: FinderAnswers["format"]): FinderAnswers => ({ format, portability: "no-preference", screen: "no-preference", battery: "somewhat", output: "flexible", experience: "beginner" });
const allSlugs = (a: FinderAnswers, c?: CardStockChanges | null) => {
  const r = matchProducts(a, c);
  return [...r.matches, ...r.alternatives].map((m) => m.product.slug);
};

const sellable = allProducts.filter((p) => legacyCardStock(p).inStock);
const soldOut = allProducts.filter((p) => !legacyCardStock(p).inStock);
check("the catalog holds products of each state to test with", sellable.length > 0 && soldOut.length > 0, `${sellable.length} buyable, ${soldOut.length} not`);

const bad = formats.flatMap((f) => allSlugs(answerSet(f)).filter((slug) => !sellable.some((p) => p.slug === slug)));
check("by the build's stock, nothing that cannot be bought", bad.length === 0, bad.join(", "));

const badUnranked = formats.flatMap((f) =>
  unscoredCatalogMatches(answerSet(f)).filter((i) => {
    const p = getPublishedProduct(i.slug);
    return !p || !publishedCardStock(p).inStock;
  }),
);
check("the unranked list holds nothing that cannot be bought", badUnranked.length === 0, badUnranked.map((i) => i.slug).join(", "));

const a = answerSet("no-preference");
const top = matchProducts(a).matches[0]?.product.slug;
check("there is a top match to test with", top !== undefined);
if (top) check("live: a model that sold out after the build leaves the results", !allSlugs(a, { [top]: { o: true, s: false } }).includes(top));
const back = soldOut[0];
if (back) {
  const everythingElseOut = Object.fromEntries(allProducts.filter((p) => p.slug !== back.slug).map((p) => [p.slug, { o: true, s: false }]));
  check("live: a model back in stock joins the results", allSlugs(a, { ...everythingElseOut, [back.slug]: { o: false, s: true } }).includes(back.slug));
}

const allOut = Object.fromEntries(allProducts.map((p) => [p.slug, { o: true, s: false }]));
check("nothing to buy: empty lists", allSlugs(a, allOut).length === 0);

for (const res of results) {
  console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
}
const failed = results.filter((x) => !x.passed);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
