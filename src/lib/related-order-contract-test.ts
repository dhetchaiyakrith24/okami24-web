/**
 * OKami24 — what the shop suggests (owner 07/11: only what is in stock, automatically, in four tiers: near or used together ·
 * the same category · other choices · other models then the shop's picks; a later tier only after the earlier ones).
 *
 *   1. the order: Argus G4 gets the coil that fits and e-liquid first, then its brand, more e-liquid, other pod systems, picks;
 *   2. tier 1 sold out: the row carries on from tier 2 and no part that does not fit steps in;
 *   3. a cart of two categories: both lines show, and no part with no verified fit for the device in the cart;
 *   4. stock: a product the warehouse reports sold out leaves the suggestions with no list kept by hand, on the live rule the
 *      cards and the buy button use; nothing in stock = nothing to show;
 *   5. the product page's candidates, over the whole catalog: never itself, never "not recommended", none twice;
 *   6. wiring: the cart reads live stock, the prerendered block lays the live answer over the build.
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import { readFileSync } from "fs";
import path from "path";
import { allProducts, getProduct } from "@/data/products";
import { kindCategoryId } from "@/data/categories";
import { getCompatibleConsumables, getCompatibleDevices } from "@/data/catalog-relationships";
import { getCatalogItem, type CatalogItem } from "@/lib/catalog-index";
import { getPublishedProducts } from "@/data/shipnity-seed/storefront-bridge";
import { NEVER, relatedFor, suggestionOrder } from "./related-order";
import { legacyCardStock } from "./stock/card-stock";
import type { LiveLookup } from "./stock/live-rules";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });
const slugs = (list: { slug: string }[]) => list.map((i) => i.slug).join(",");
const lastIndex = (list: CatalogItem[], test: (i: CatalogItem) => boolean) => list.reduce((at, i, n) => (test(i) ? n : at), -1);
const firstIndex = (list: CatalogItem[], test: (i: CatalogItem) => boolean) => list.findIndex(test);
const buyable = (i: CatalogItem) => i.sellingPrice !== null && !NEVER.has(i.slug);
const isPartKind = (i: CatalogItem) => ["pods-cartridges", "coils-accessories", "heated-tobacco-consumables"].includes(kindCategoryId(i));

// 1 — the order
const coil = getCompatibleConsumables("argus-g4")[0]?.ref.slug;
const argus = suggestionOrder(["argus-g4"], (i) => i.slug !== "argus-g4" && buyable(i));
const argusBrand = (i: CatalogItem) => i.categoryId === "pod-systems" && i.brandId === getCatalogItem("argus-g4")?.brandId;
const firstPodOther = firstIndex(argus, (i) => i.categoryId === "pod-systems" && !argusBrand(i));
check("Argus G4 has a verified coil to test with", coil !== undefined);
check("tier 1: the coil that fits takes the first seat", argus[0]?.slug === coil, slugs(argus.slice(0, 4)));
check("tier 1: e-liquid sits beside it", argus[1]?.categoryId === "e-liquid" && argus[2]?.categoryId === "e-liquid", slugs(argus.slice(0, 4)));
check("tier 2 before tier 3: its own brand before more e-liquid", lastIndex(argus, argusBrand) < argus.findIndex((i, n) => n > 2 && i.categoryId === "e-liquid"), slugs(argus));
check("tier 3 before tier 4: more e-liquid before other pod systems", lastIndex(argus, (i) => i.categoryId === "e-liquid") < firstPodOther, slugs(argus));
check("tier 4: disposables after the other pod systems", lastIndex(argus, (i) => i.categoryId === "pod-systems") < firstIndex(argus, (i) => i.categoryId === "disposables"), slugs(argus));
check("no card twice", new Set(argus.map((i) => i.slug)).size === argus.length);
check("a row is never all e-liquid: four at most", argus.filter((i) => i.categoryId === "e-liquid").length === 4, slugs(argus));
const noPods = suggestionOrder(["argus-g4"], (i) => i.slug !== "argus-g4" && buyable(i) && i.categoryId !== "pod-systems");
check("no other pod system in stock: the disposables step up", noPods.some((i) => i.categoryId === "disposables"), slugs(noPods));
const disposable = suggestionOrder(["m-bar-9k"], (i) => i.slug !== "m-bar-9k" && buyable(i));
check("a disposable stays with its own kind first, no e-liquid", kindCategoryId(disposable[0]) === "disposables" && !disposable.some((i) => i.categoryId === "e-liquid"), slugs(disposable));

// 2 — tier 1 sold out
const noTierOne = suggestionOrder(["argus-g4"], (i) => i.slug !== "argus-g4" && buyable(i) && i.slug !== coil && i.categoryId !== "e-liquid");
check("tier 1 sold out: the row carries on with what is left", noTierOne.length > 0 && argusBrand(noTierOne[0]), slugs(noTierOne));
check("tier 1 sold out: no other part steps in", !noTierOne.some(isPartKind), slugs(noTierOne));

// 3 — a cart of two categories
const twoKinds = suggestionOrder(["argus-g4", "m-bar-9k"], (i) => !["argus-g4", "m-bar-9k"].includes(i.slug) && buyable(i));
check("two categories: both lines show in the first seats", twoKinds.slice(0, 8).some((i) => i.slug === coil) && twoKinds.slice(0, 8).some((i) => kindCategoryId(i) === "disposables"), slugs(twoKinds.slice(0, 8)));
const withPart = suggestionOrder(["argus-g4", coil as string], (i) => !["argus-g4", coil].includes(i.slug) && buyable(i));
const unfit = withPart.filter((i) => isPartKind(i) && !getCompatibleDevices(i.slug).some((d) => d.ref.slug === "argus-g4"));
check("a device and its part in the cart: no part that does not fit the device", unfit.length === 0, slugs(unfit));
for (const device of allProducts.filter((p) => !["pods-cartridges", "coils-accessories"].includes(p.categoryId)).slice(0, 12)) {
  const row = suggestionOrder([device.slug], (i) => i.slug !== device.slug && buyable(i));
  const wrong = row.filter((i) => isPartKind(i) && !getCompatibleDevices(i.slug).some((d) => d.ref.slug === device.slug));
  if (wrong.length > 0) check(`${device.slug}: every part offered fits it`, false, slugs(wrong));
}

// 4 — stock, automatically
const mBar = getProduct("m-bar-10k");
const onlyMBarOut: LiveLookup = (slug) => (slug === "m-bar-10k" ? "out" : null);
const everythingOut: LiveLookup = () => "out";
const offered = (live: LiveLookup) =>
  suggestionOrder([], (i) => {
    const p = getProduct(i.slug);
    return p ? legacyCardStock(p, live).inStock : false;
  });
check("the test product can be sold at build", mBar !== undefined && legacyCardStock(mBar).inStock);
check("M Bar 10K sold out in the warehouse leaves the picks", !offered(onlyMBarOut).some((i) => i.slug === "m-bar-10k"), slugs(offered(onlyMBarOut)));
check("the other picks stay", offered(onlyMBarOut).length > 0);
check("everything sold out = nothing offered", offered(everythingOut).length === 0, slugs(offered(everythingOut)));

// 5 — the product page's candidates, every product
const bad: string[] = [];
for (const slug of [...allProducts.map((p) => p.slug), ...getPublishedProducts().map((p) => p.slug)]) {
  const items = relatedFor(slug);
  const verified = new Set([...getCompatibleConsumables(slug).map((c) => c.ref.slug), ...getCompatibleDevices(slug).map((d) => d.ref.slug)]);
  if (new Set(items.map((i) => i.slug)).size !== items.length) bad.push(`${slug}: a card twice`);
  for (const i of items) {
    if (i.slug === slug) bad.push(`${slug}: offers itself`);
    if (NEVER.has(i.slug)) bad.push(`${slug}: offers ${i.slug}`);
    if (!i.legacy && !i.published) bad.push(`${slug}: ${i.slug} has no card data`);
    if (!i.inStock && !verified.has(i.slug)) bad.push(`${slug}: sold-out ${i.slug} is not a verified fit`);
  }
}
check("every product page: never itself, never not-recommended, no sold-out card past a verified fit", bad.length === 0, bad.slice(0, 5).join(" · "));
const argusBlock = relatedFor("argus-g4");
check("the Argus G4 page offers the coil and e-liquid first", argusBlock[0]?.slug === coil && argusBlock[1]?.published?.categoryId === "e-liquid", slugs(argusBlock));

// 6 — wiring
const src = (rel: string) => readFileSync(path.join(process.cwd(), "src", rel), "utf8");
const cart = src("lib/commerce/cart-suggestions.ts");
check("the cart reads the live lookup on every call, not the build", cart.includes("const live = liveLookup();") && cart.includes("legacyCardStock(legacy, live)") && cart.includes("publishedCardStock(published, live)") && !cart.includes("inStockEntryKeys"));
const block = src("components/product/RelatedProducts.tsx");
check("the prerendered block lays the live answer over the build", block.includes("useLiveCardStock()") && block.includes("canBuyNow(live, i)"));
const row = src("components/commerce/CartSuggestions.tsx");
check("the picker follows the fresh cards and never keeps a sold-out pick", row.includes("items.find((i) => i.slug === pickingSlug)") && row.includes("o.id === selectedId && o.sellable"));

for (const res of results) {
  console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
}
const failed = results.filter((x) => !x.passed);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
