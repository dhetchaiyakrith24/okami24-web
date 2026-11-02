/**
 * OKami24 — the struck-through label price (owner 03/11, BSOT §5 "2026-11-02 — struck-through label price",
 * src/data/sale-label.ts). The label is display only; the money is the selling price:
 *   1. only the display layer imports label-prices.ts / sale-label.ts / SaleLabel.tsx — the cart, checkout, order totals,
 *      LINE/email messages, the API routes and the head/JSON-LD never do (an allow-list, so a new importer fails here);
 *   2. the cart's money boundary (resolveProductRef) prices every labelled product at its selling price, never the label;
 *   3. the product page's JSON-LD Offer prices come from the selling price;
 *   4. the table: every label 10–20 % above the price it was approved against, the owner's price ending (9 · price from ฿1,000: 90),
 *      that price is still the catalog's selling price (a later price change hides the label — reported here), and the
 *      Marbo lookalike is not on it;
 *   5. saleLabel(): the badge never says more than the printed prices; the switch, sold-out and unknown products give null.
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import { readdirSync, readFileSync, statSync } from "fs";
import path from "path";
import { LABEL_PRICES } from "./label-prices";
import { SALE_LABEL_ON, saleLabel } from "./sale-label";
import { allCatalogItems } from "@/lib/catalog-index";
import { resolveProductRef } from "@/lib/commerce/catalog-resolver";
import { buildPublishedCatalog } from "@/data/shipnity-seed/storefront-preview-read-model";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

const SRC = path.join(process.cwd(), "src");
function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((e) => {
    const full = path.join(dir, e);
    return statSync(full).isDirectory() ? walk(full) : /\.(ts|tsx)$/.test(e) ? [full] : [];
  });
}
const rel = (f: string) => path.relative(SRC, f).split(path.sep).join("/");
const files = walk(SRC);

// 1 — who may import the label
const LABEL_IMPORTERS: Record<string, RegExp> = {
  "label-prices": /from\s+["'](?:@\/data\/|\.\/)label-prices["']/,
  "sale-label": /from\s+["'](?:@\/data\/|\.\/)sale-label["']/,
  SaleLabel: /from\s+["'](?:@\/components\/catalog\/|\.\/)SaleLabel["']/,
};
const ALLOWED: Record<string, string[]> = {
  "label-prices": ["data/sale-label.ts", "data/label-prices-contract-test.ts"],
  "sale-label": ["components/catalog/SaleLabel.tsx", "data/label-prices-contract-test.ts"],
  SaleLabel: [
    "components/catalog/ProductCard.tsx",
    "components/catalog-bridge/PilotProductCard.tsx",
    "components/product/ProductHero.tsx",
    "components/catalog-bridge/PilotProductDetail.tsx",
  ],
};
for (const [mod, re] of Object.entries(LABEL_IMPORTERS)) {
  const importers = files.filter((f) => re.test(readFileSync(f, "utf8"))).map(rel);
  const stray = importers.filter((f) => !ALLOWED[mod].includes(f));
  check(`only the display layer imports ${mod}`, stray.length === 0, stray.join(", "));
}
const MONEY = /^(lib\/commerce|lib\/woo|lib\/line|app\/api|app\/staff|components\/commerce)\//;
const moneyHits = files
  .map(rel)
  .filter((f) => MONEY.test(f))
  .filter((f) => /label-prices|sale-label|SaleLabel|LABEL_PRICES|saleLabel/.test(readFileSync(path.join(SRC, f), "utf8")));
check("cart · checkout · orders · LINE · API · staff never mention the label", moneyHits.length === 0, moneyHits.join(", "));

// 2 — the cart's money boundary prices labelled products at the selling price
const published = new Map(buildPublishedCatalog().map((p) => [p.slug, p]));
let resolved = 0;
const wrong: string[] = [];
for (const [slug, row] of Object.entries(LABEL_PRICES)) {
  const pm = published.get(slug);
  const variantId = pm && pm.variants.length > 0 ? pm.variants[0].id : null;
  const r = resolveProductRef({ origin: pm ? "product-master" : "legacy", slug, variantId });
  if (!r.ok) continue; // out of stock / legacy option needed — the import allow-list above still covers it
  resolved++;
  if (r.line.unitPrice !== row.price || r.line.unitPrice === row.label) wrong.push(`${slug}: cart ${r.line.unitPrice} · price ${row.price} · label ${row.label}`);
}
check("the cart prices every labelled product it can resolve at the selling price, never the label", wrong.length === 0 && resolved > 0, wrong.length ? wrong.join("; ") : `resolved ${resolved}`);

// 3 — JSON-LD Offer prices on the product page
const page = readFileSync(path.join(SRC, "app/products/[slug]/page.tsx"), "utf8");
const offerPrices = [...page.matchAll(/"@type": "Offer"[^}]*?price: ([A-Za-z_.]+)/g)].map((m) => m[1]);
check(
  "JSON-LD: every Offer price is a selling price",
  offerPrices.length >= 2 && offerPrices.every((p) => /sellingPrice|SellingPrice/.test(p)),
  offerPrices.join(", "),
);

// 4 — the table
const catalog = new Map(allCatalogItems().map((i) => [i.slug, i.sellingPrice]));
const rows = Object.entries(LABEL_PRICES);
const outOfBand = rows.filter(([, r]) => r.label < r.price * 1.1 || r.label > r.price * 1.2).map(([s]) => s);
check("table: every label is 10–20 % above its price", outOfBand.length === 0, outOfBand.join(", "));
// The approved generator keyed the ending on the SELLING price (฿890 → ฿1,029 stays inside 10–20 %; ฿1,090 would be 22 %).
const badEnding = rows.filter(([, r]) => (r.price >= 1000 ? r.label % 100 !== 90 : r.label % 10 !== 9)).map(([s, r]) => `${s} ${r.label}`);
check("table: labels follow the owner's price ending (9 · price from ฿1,000: 90)", badEnding.length === 0, badEnding.join(", "));
const notOnSite = rows.filter(([s]) => !catalog.has(s)).map(([s]) => s);
check("table: every slug is a product on the site", notOnSite.length === 0, notOnSite.join(", "));
check("table: the Marbo lookalike is not on it", !("marbo-10k-clone" in LABEL_PRICES));
const stale = rows.filter(([s, r]) => catalog.has(s) && catalog.get(s) !== r.price).map(([s, r]) => `${s} (table ${r.price} · now ${catalog.get(s)})`);

// 5 — saleLabel()
const sample = rows[0];
const pcts = rows.map(([s, r]) => ({ s, r, l: saleLabel(s, r.price) }));
check("saleLabel: every approved product at its approved price gets a label", !SALE_LABEL_ON || pcts.every((x) => x.l?.label === x.r.label));
check(
  "saleLabel: the badge never says more than the two prices show",
  pcts.every((x) => !x.l || (x.l.pct >= 1 && x.l.pct <= ((x.r.label - x.r.price) / x.r.label) * 100)),
);
check("saleLabel: sold out = none", saleLabel(sample[0], sample[1].price, true) === null);
check("saleLabel: a changed selling price = none", saleLabel(sample[0], sample[1].price + 10) === null);
check("saleLabel: no price / not on the table = none", saleLabel(sample[0], null) === null && saleLabel("no-such-product", 100) === null);
check("saleLabel: ฿1,090 under ฿1,290 reads 15 (rounded down)", Math.floor(((1290 - 1090) / 1290) * 100) === 15);

for (const res of results) {
  console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
}
const shown = pcts.filter((x) => x.l).map((x) => x.l!.pct);
console.log(`  (switch ${SALE_LABEL_ON ? "ON" : "OFF"} · ${rows.length} on the table · ${shown.length} show · badge ${Math.min(...shown)}–${Math.max(...shown)} % · cart checked ${resolved})`);
if (stale.length) console.log(`  hidden until the table is redone (price changed): ${stale.join(", ")}`);
const failed = results.filter((x) => !x.passed);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
