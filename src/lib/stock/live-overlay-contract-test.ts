/**
 * OKami24 — live stock on the server render + the "no live number" safety net (owner 11/11 "ทุกตัวต้องเช็คได้หมด … เปิดระบบ
 * รันสต็อกสด"; ESKO BAR SWITCH 20K Extra Menthol rendered "หมด" while Shipnity held 140).
 *
 *   1. live-rules "ask": a coded option Shipnity never reported (or reported with no number and no status) while the table
 *      holds reports = "ask"; an empty table (next build) = no answer, as before;
 *   2. the overlay (live-overlay.ts): in→out and out→in on both catalog halves, "ask" = unknown + stockAsk, nothing changed =
 *      the same object; a card counts an "ask" option neither as selling nor as sold out;
 *   3. the money boundary refuses "ask" on both halves;
 *   4. stale pages (stale-pages.ts): a page built with other stock than the live answer is stale (its card pages too when the
 *      card changes); once marked, the same answer does not mark it again;
 *   5. wiring: the product page renders through the overlay on both branches, the after-load hook uses the same overlay, the
 *      stock routes mark stale pages, the buy slot asks on LINE, the staff page names the codes and drops the wrong label.
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { codeFor, liveState, lookupFrom, type LiveReport } from "./live-rules";
import { liveLegacyProduct, livePilotProduct } from "./live-overlay";
import { legacyCardStock, publishedCardStock } from "./card-stock";
import { stalePages, type RenderedStock } from "./stale-pages";
import { resolveProductRef } from "@/lib/commerce/catalog-resolver";
import { allProducts } from "@/data/products";
import { buildPublishedCatalog } from "@/data/shipnity-seed/storefront-preview-read-model";
import { getCatalogItem } from "@/lib/catalog-index";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });
const rep = (q: number | null, s: string | null = null): LiveReport => ({ quantity: q, stockStatus: s });
const none = () => false;

// A legacy product with a price and 2+ coded options the build sells; a published one with 2+ coded variants in stock.
const legacy = allProducts.find((p) => {
  if (getCatalogItem(p.slug)?.sellingPrice == null) return false;
  const opts = [...(p.colorVariants ?? []), ...(p.flavorVariants ?? [])].filter((v) => codeFor(p.slug, v.id) && v.availability !== "out-of-stock");
  return opts.length >= 2;
});
const published = buildPublishedCatalog().find(
  (p) => p.sellingPrice !== null && p.variants.filter((v) => codeFor(p.slug, v.id) && v.availabilityStatus === "in-stock").length >= 2
);
check("a priced legacy product with 2+ coded selling options exists", !!legacy);
check("a priced published product with 2+ coded in-stock variants exists", !!published);

// 1. "ask"
if (legacy) {
  const [a, b] = [...(legacy.colorVariants ?? []), ...(legacy.flavorVariants ?? [])].filter((v) => codeFor(legacy.slug, v.id) && v.availability !== "out-of-stock");
  const ca = codeFor(legacy.slug, a.id)!;
  const cb = codeFor(legacy.slug, b.id)!;
  const other = new Map([[cb, rep(4)]]);
  check("no report while the table holds others = ask", liveState(other, legacy.slug, a.id, a.name, none) === "ask");
  check("no reports at all (build) = no answer", liveState(new Map(), legacy.slug, a.id, a.name, none) === null);
  check("a report with no number and no status = ask", liveState(new Map([[ca, rep(null, null)], [cb, rep(4)]]), legacy.slug, a.id, a.name, none) === "ask");
  check("a number still decides", liveState(new Map([[ca, rep(140)]]), legacy.slug, a.id, a.name, none) === "in" && liveState(new Map([[ca, rep(0)]]), legacy.slug, a.id, a.name, none) === "out");

  // 2. overlay — legacy
  const out = liveLegacyProduct(legacy, lookupFrom(new Map([[ca, rep(0)], [cb, rep(3)]]), none));
  const outA = [...(out.colorVariants ?? []), ...(out.flavorVariants ?? [])].find((v) => v.id === a.id);
  check("legacy in→out: the option renders sold out", outA?.availability === "out-of-stock" && !outA.stockAsk);
  const ask = liveLegacyProduct(legacy, lookupFrom(other, none));
  const askA = [...(ask.colorVariants ?? []), ...(ask.flavorVariants ?? [])].find((v) => v.id === a.id);
  check("legacy ask: unknown + stockAsk", askA?.availability === "unknown" && askA.stockAsk === true);
  check("no live answer = the same object", liveLegacyProduct(legacy, lookupFrom(new Map(), none)) === legacy && liveLegacyProduct(legacy, undefined) === legacy);
  const onlyAsk = new Map<string, LiveReport>([["__another_code__", rep(1)]]);
  const allAsk = lookupFrom(onlyAsk, none);
  const card = legacyCardStock(legacy, allAsk);
  const everyCoded = [...(legacy.colorVariants ?? []), ...(legacy.flavorVariants ?? [])].every((v) => codeFor(legacy.slug, v.id));
  check("a card: ask options are not sold out", !card.soldOut);
  if (everyCoded) check("a card: every option ask = not พร้อมส่ง", !card.inStock);

  // 3. money boundary — legacy
  check("cart refuses a legacy ask option", resolveProductRef({ origin: "legacy", slug: legacy.slug, variantId: a.id }, lookupFrom(other, none)).ok === false);
  check("cart still sells the reported one", resolveProductRef({ origin: "legacy", slug: legacy.slug, variantId: b.id }, lookupFrom(other, none)).ok === true);

  // 4. stale pages — in→out
  const live = lookupFrom(new Map([[ca, rep(0)], [cb, rep(3)]]), none);
  const s1 = stalePages([legacy], [], live, new Map());
  check("legacy in→out: the product page is stale", s1.pages.includes(`/products/${legacy.slug}`), s1.pages.join(" "));
  const remembered = new Map<string, RenderedStock>(s1.now);
  check("marked once: the same answer marks nothing again", stalePages([legacy], [], live, remembered).pages.length === 0);
  check("no difference from the build = nothing stale", stalePages([legacy], [], lookupFrom(new Map(), none), new Map()).pages.length === 0);
}

// out→in on a legacy option the build marked sold out (a coded one — the warehouse snapshot, like Pod-159-16)
const builtOut = (() => {
  for (const p of allProducts) {
    if (getCatalogItem(p.slug)?.sellingPrice == null) continue;
    const v = [...(p.colorVariants ?? []), ...(p.flavorVariants ?? [])].find((o) => o.availability === "out-of-stock" && codeFor(p.slug, o.id));
    if (v) return { p, v, code: codeFor(p.slug, v.id)! };
  }
  return null;
})();
if (builtOut) {
  const live = lookupFrom(new Map([[builtOut.code, rep(140)]]), none);
  const back = liveLegacyProduct(builtOut.p, live);
  const v = [...(back.colorVariants ?? []), ...(back.flavorVariants ?? [])].find((o) => o.id === builtOut.v.id);
  check("legacy out→in: the option renders in stock", v?.availability === "in-stock", builtOut.p.slug);
  check("legacy out→in: the product page is stale", stalePages([builtOut.p], [], live, new Map()).pages.includes(`/products/${builtOut.p.slug}`));
  check("legacy out→in: the cart sells it", resolveProductRef({ origin: "legacy", slug: builtOut.p.slug, variantId: builtOut.v.id }, live).ok === true);
}

if (published) {
  const [a, b] = published.variants.filter((v) => codeFor(published.slug, v.id) && v.availabilityStatus === "in-stock");
  const ca = codeFor(published.slug, a.id)!;
  const cb = codeFor(published.slug, b.id)!;
  const live = lookupFrom(new Map([[ca, rep(0)], [cb, rep(2)]]), none);
  const now = livePilotProduct(published, live);
  check("published in→out: the variant renders sold out", now.variants.find((v) => v.id === a.id)?.availabilityStatus === "out-of-stock");
  check("published in→out: the page is stale", stalePages([], [published], live, new Map()).pages.includes(`/products/${published.slug}`));
  const ask = livePilotProduct(published, lookupFrom(new Map([[cb, rep(2)]]), none));
  const askA = ask.variants.find((v) => v.id === a.id);
  check("published ask: unknown + stockAsk", askA?.availabilityStatus === "unknown" && askA.stockAsk === true);
  check("published: the cart refuses ask", resolveProductRef({ origin: "product-master", slug: published.slug, variantId: a.id }, lookupFrom(new Map([[cb, rep(2)]]), none)).ok === false);
  check("published: a card does not count ask as พร้อมส่ง", publishedCardStock(published, lookupFrom(new Map([["__x__", rep(1)]]), none)).inStock === published.variants.some((v) => v.availabilityStatus === "in-stock" && !codeFor(published.slug, v.id)));
  check("published: no live answer = the same object", livePilotProduct(published, lookupFrom(new Map(), none)) === published);
}

// 5. wiring
const src = (f: string) => readFileSync(path.join(process.cwd(), "src", f), "utf8");
const page = src("app/products/[slug]/page.tsx");
check("product page: legacy renders through the overlay", page.includes("const liveProduct = liveLegacyProduct(product, live);") && page.includes("<ProductHero product={liveProduct}"));
check("product page: published + pilot render through the overlay", page.includes("livePilotProduct(builtPublished, live)") && page.includes("livePilotProduct(builtPilot, live)"));
check("stock routes mark stale pages", src("app/api/stock/route.ts").includes("refreshStalePages()") && src("app/api/stock/[slug]/route.ts").includes("refreshStalePages({ slug })") && src("app/wp-json/[[...path]]/route.ts").includes("refreshStalePages({ force: true })"));
check("the buy slot asks on LINE for ask", src("components/commerce/ProductBuyAction.tsx").includes("askStock ? dict.productActions.askStockCta") && src("components/product/ProductHero.tsx").includes("askStock={stockAsk}") && src("components/catalog-bridge/PilotProductDetail.tsx").includes("askStock={askStock}"));
check("phone tiles: ask is its own pill, not counted as ready to ship", src("components/product/PhoneOptionTiles.tsx").includes("options.filter((o) => !o.out && !o.ask)") && ["components/product/FlavorVariantGrid.tsx", "components/product/ColorVariantRail.tsx", "components/catalog-bridge/ProductMasterVariantPicker.tsx"].every((f) => src(f).includes("ask: !!v.stockAsk")));
const staff = src("app/staff/shipnity/page.tsx");
check("staff page: names the codes with no number, drops the owner-closed guess", staff.includes("<StockRows rows={cmp.missing} />") && !staff.includes("อาจเป็นรายการที่พี่ปิดขายไว้"));

for (const res of results) console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
const failed = results.filter((x) => !x.passed);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
