/**
 * Run: npx tsx src/lib/stock/sku-drift-contract-test.ts
 * Shipnity Max list vs sku-map (sku-drift-rules.ts): only a word-for-word name under the same Max parent becomes a fill;
 * everything else is listed for a person. Made-up rows in the shape the Max product page gives.
 */
import { skuDrift, type MapProduct, type MaxRow } from "./sku-drift-rules";

let failed = 0;
function check(name: string, ok: boolean, got?: unknown): void {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || got === undefined ? "" : ` — got ${JSON.stringify(got)}`}`);
  if (!ok) failed++;
}

const row = (code: string, name: string, parent: string | null, stock = 1): MaxRow => ({ code, name, parent, stock });
const rows: MaxRow[] = [
  row("Pod-170", "Infy 20000 Puffs", null),
  row("Pod-170-5", "Mixberry", "Pod-170"),
  row("Pod-170-19", "Mix Berry", "Pod-170", 0),
  row("Pod-170-24", "Menthol Freeze", "Pod-170"),
  row("Pod-170-25", "Brand New Flavour", "Pod-170"),
  row("IQOSHEET-17", "Iqos iluma one", null),
  row("IQOSHEET-17-1", "Pebble Grey", "IQOSHEET-17", 0),
  row("Product 744", "Insta 15000 คำ", null),
  row("Variation 746", "Grape", "Product 744", 0),
  row("Close", "ยิงปิด", null),
  row("Close-1", "ยิงปิด", "Close"),
];
const products: MapProduct[] = [
  { slug: "infy-20k", parent: "Pod-170", options: { mixberry: "Pod-170-5", "menthol-freeze": null, "strawberry-ice-cream": null } },
  { slug: "iqosheet-17", parent: "IQOSHEET-17", options: { "iqosheet-17-verified-midnight-black": null } },
  { slug: "nexswitch", parent: "Product 1176446", options: { a: "Pod-161-1", b: null } },
  { slug: "single", parent: null, options: { "": null } },
];
const d = skuDrift(rows, products);

check("fill: null option + same parent + exact name", d.fill.length === 1 && d.fill[0].slug === "infy-20k" && d.fill[0].option === "menthol-freeze" && d.fill[0].code === "Pod-170-24", d.fill);
check("a near name ('Mix Berry' vs mapped 'mixberry') is not a fill", !d.fill.some((f) => f.code === "Pod-170-19"));
check("unknown: the near-duplicate is listed", d.unknown.some((u) => u.code === "Pod-170-19" && u.slug === "infy-20k"), d.unknown);
check("unknown: a new flavour of a listed product names its site product", d.unknown.some((u) => u.code === "Pod-170-25" && u.slug === "infy-20k"));
check("unknown: a new colour never fills a differently named null option", d.unknown.some((u) => u.code === "IQOSHEET-17-1" && u.slug === "iqosheet-17"));
check("unknown: a product the site does not list has no slug", d.unknown.some((u) => u.code === "Variation 746" && u.slug === null && u.parentName === "Insta 15000 คำ"));
check("Max system rows (Close / test) are ignored", !d.unknown.some((u) => u.code.startsWith("Close")));
check("gone: a mapped parent Max no longer lists", d.gone.some((g) => g.slug === "nexswitch" && g.option === "(parent)" && g.code === "Product 1176446"));
check("gone: a mapped option code Max no longer lists", d.gone.some((g) => g.slug === "nexswitch" && g.option === "a" && g.code === "Pod-161-1"));
check("null options never count as gone", !d.gone.some((g) => g.option === "b" || g.slug === "single"));
const twice = skuDrift([...rows, row("Pod-170-26", "Menthol Freeze", "Pod-170")], products);
check("two Max rows with the same name fill one option once, the other is listed", twice.fill.length === 1 && twice.unknown.some((u) => u.code === "Pod-170-26"), twice.fill);
check("the function carries no outside name (it is pasted into the browser)", !/\b(require|import)\b/.test(skuDrift.toString()));

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
