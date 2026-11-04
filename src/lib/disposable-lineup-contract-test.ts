/**
 * OKami24 — round "disposable pod" (05/11): the chooser and brand table on /products/disposables never carry a typed number.
 *   1. every price on a row is the catalog's selling price;
 *   2. every puffs, mL and mAh figure is stated by a VERIFIED row of that product; a model with no verified row stays empty;
 *   3. the lookalike is in no pick: no chooser group, no brand row (HANDOFF §18);
 *   4. every priced model sits in exactly one budget band, every model with verified puffs in exactly one puff group;
 *   5. the copy holds no digit: figures reach the page only through the {placeholders}, in all three languages.
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import { getProductsByCategory } from "@/data/products";
import { getLegacyApprovedPrice } from "@/data/shipnity-seed/legacy-price-approvals";
import { getPublishedProductsByCategory } from "@/data/shipnity-seed/storefront-bridge";
import { CATEGORY_GUIDE_COPY } from "@/i18n/category-guide-copy";
import { disposableBrands, disposableChooser, disposableLineup } from "@/lib/disposable-lineup";
import { verifiedRows } from "@/lib/verified-specs";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

const legacy = getProductsByCategory("disposables");
const published = getPublishedProductsByCategory("disposables");
const lineup = disposableLineup(legacy, published);
const chooser = disposableChooser(lineup);
const brands = disposableBrands(lineup);

check("every model on the page has a row", lineup.length === legacy.length + published.length, `${lineup.length} rows`);

const catalogPrice = new Map<string, number | null>([...legacy.map((p) => [p.slug, getLegacyApprovedPrice(p.slug) ?? null] as const), ...published.map((p) => [p.slug, p.sellingPrice] as const)]);
const wrongPrice = lineup.filter((r) => r.price !== catalogPrice.get(r.slug)).map((r) => r.slug);
check("every price is the catalog's selling price", wrongPrice.length === 0, wrongPrice.join(", "));

const verifiedText = new Map<string, string>([...legacy, ...published].map((p) => [p.slug, verifiedRows(p.specifications).map((s) => s.value).join(" | ")]));
const statedBy = (slug: string, n: number) => new RegExp(`(?<![\d,.])${n.toLocaleString("en-US").replace(/,/g, ",?")}(?![\d])`).test(verifiedText.get(slug) ?? "");
const unbacked = lineup.flatMap((r) => [r.puffs, r.capacityMl, r.batteryMah].filter((n): n is number => n !== null && !statedBy(r.slug, n)).map((n) => `${r.slug}: ${n}`));
check("every figure is stated by a verified row of that product", unbacked.length === 0, unbacked.join(", "));

const picked = [...chooser.puffGroups, ...chooser.budgetGroups].flatMap((g) => g.rows);
check("the lookalike is in no chooser group", !picked.some((r) => r.listOnly));
check("the lookalike's brand-less row adds nothing to the brand table", !brands.some((b) => b.slug === "marbo"));

const inBudget = chooser.budgetGroups.flatMap((g) => g.rows.map((r) => r.slug));
const shouldBudget = lineup.filter((r) => !r.listOnly && r.price !== null).map((r) => r.slug);
check("every priced model sits in exactly one budget band", inBudget.length === shouldBudget.length && new Set(inBudget).size === inBudget.length && shouldBudget.every((s) => inBudget.includes(s)));
const inPuffs = chooser.puffGroups.flatMap((g) => g.rows.map((r) => r.slug));
const shouldPuffs = lineup.filter((r) => !r.listOnly && r.price !== null && r.puffs !== null).map((r) => r.slug);
check("every model with verified puffs sits in exactly one puff group", inPuffs.length === shouldPuffs.length && new Set(inPuffs).size === inPuffs.length && shouldPuffs.every((s) => inPuffs.includes(s)));

const copy = CATEGORY_GUIDE_COPY.disposables;
for (const locale of ["th", "en", "zh"] as const) {
  const c = copy[locale];
  check(`${locale}: chooser and brand table copy exist`, Boolean(c?.chooser && c.brandTable));
  const digits = [...Object.values(c?.chooser ?? {}), ...Object.values(c?.brandTable ?? {})].filter((s) => /\d/.test(s.replace(/\/guides\/[a-z0-9-]+/g, "")));
  check(`${locale}: no digit typed in the copy`, digits.length === 0, digits.join(" | "));
}

for (const res of results) {
  console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
}
const failed = results.filter((x) => !x.passed);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
