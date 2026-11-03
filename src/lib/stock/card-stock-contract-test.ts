/**
 * OKami24 — live stock on product cards (owner 31/10: cards read live stock like the product page).
 *
 *   1. the build's answer: inStockEntryKeys() gives exactly what the "สินค้าพร้อมส่ง" rule gave before (approved price +
 *      an option that sells), and a lookup with no answer changes no card;
 *   2. the live overlay: a live "out" on every option sells a card out and drops it from the filter, a live "in" brings a
 *      built-sold-out card back, on both catalog halves; only differences leave the server;
 *   3. pilotStatusAfterLive = the product page's rule (the page's hook calls it, so a card and its page cannot drift);
 *   4. wiring: one request per page (useLiveCardStock), the card's sales badge and the filter read it, the stock API sends
 *      no counts, and the price line + JSON-LD stay on the build (the sale label is decided from the build on the card
 *      and on the product page alike — SaleLabel.tsx).
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import { readFileSync } from "fs";
import path from "path";
import { legacyCardStock, liveCardChanges, pilotStatusAfterLive, publishedCardStock } from "./card-stock";
import type { LiveLookup } from "./live-rules";
import { inStockEntryKeys } from "@/lib/in-stock";
import { allProducts } from "@/data/products";
import { buildPublishedCatalog } from "@/data/shipnity-seed/storefront-preview-read-model";
import { getLegacyApprovedPrice } from "@/data/shipnity-seed/legacy-price-approvals";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

const published = buildPublishedCatalog();

// 1 — the build's answer is unchanged
const before: string[] = [];
for (const p of allProducts) {
  if (getLegacyApprovedPrice(p.slug) === null) continue;
  const options = [...(p.colorVariants ?? []), ...(p.flavorVariants ?? [])];
  if (options.length > 0 ? options.some((v) => v.availability !== "out-of-stock") : p.availability !== "out-of-stock") before.push(`legacy:${p.slug}`);
}
for (const p of published) {
  if (p.sellingPrice === null) continue;
  if (p.variants.length > 0 ? p.variants.some((v) => v.availabilityStatus === "in-stock") : p.availabilityStatus === "in-stock") before.push(`published:${p.slug}`);
}
const now = inStockEntryKeys(allProducts, published);
check("the in-stock filter's build list is what it was", now.join(",") === before.join(","), `${now.length} now · ${before.length} before`);
const none: LiveLookup = () => null;
check("no live answer changes no card", Object.keys(liveCardChanges(allProducts, published, none)).length === 0);

// 2 — the live overlay
const only = (slug: string, s: "in" | "out"): LiveLookup => (q) => (q === slug ? s : null);
const legacyIn = allProducts.find((p) => legacyCardStock(p).inStock && (p.colorVariants?.length ?? 0) + (p.flavorVariants?.length ?? 0) > 0);
const legacyOut = allProducts.find((p) => legacyCardStock(p).soldOut && getLegacyApprovedPrice(p.slug) !== null);
const pubIn = published.find((p) => publishedCardStock(p).inStock && p.variants.length > 0);
const pubOut = published.find((p) => publishedCardStock(p).soldOut && p.sellingPrice !== null && p.variants.length > 0);
check("the catalog has a card of each kind to test with", Boolean(legacyIn && legacyOut && pubIn && pubOut));
const cases: [string, string | undefined, "in" | "out", { o: boolean; s: boolean }][] = [
  ["legacy, sells as built, live out", legacyIn?.slug, "out", { o: true, s: false }],
  ["legacy, sold out as built, live in", legacyOut?.slug, "in", { o: false, s: true }],
  ["ProductMaster, sells as built, live out", pubIn?.slug, "out", { o: true, s: false }],
  ["ProductMaster, sold out as built, live in", pubOut?.slug, "in", { o: false, s: true }],
];
for (const [name, slug, s, want] of cases) {
  if (!slug) continue;
  const c = liveCardChanges(allProducts, published, only(slug, s));
  check(`${name} (${slug})`, JSON.stringify(Object.keys(c)) === JSON.stringify([slug]) && c[slug].o === want.o && c[slug].s === want.s, JSON.stringify(c));
}
if (legacyIn) {
  const opts = [...(legacyIn.colorVariants ?? []), ...(legacyIn.flavorVariants ?? [])];
  const firstOut: LiveLookup = (slug, id) => (slug === legacyIn.slug && id === opts[0].id ? "out" : null);
  const partial = opts.length > 1 && opts.slice(1).some((v) => v.availability !== "out-of-stock");
  check("one option out while another still sells = the card stays as it is", !partial || Object.keys(liveCardChanges(allProducts, published, firstOut)).length === 0);
}

// 3 — the product page's rule
check("no variants: the live answer wins, none = as built", pilotStatusAfterLive([], "unknown", "in") === "in-stock" && pilotStatusAfterLive([], "in-stock", null) === "in-stock");
check("one variant sells = in stock", pilotStatusAfterLive([{ availabilityStatus: "out-of-stock" }, { availabilityStatus: "in-stock" }], "out-of-stock", null) === "in-stock");
check("every variant out = sold out", pilotStatusAfterLive([{ availabilityStatus: "out-of-stock" }], "in-stock", null) === "out-of-stock");
check("unknown left = as built", pilotStatusAfterLive([{ availabilityStatus: "unknown" }, { availabilityStatus: "out-of-stock" }], "unknown", null) === "unknown");

// 4 — wiring
const src = (f: string) => readFileSync(path.join(process.cwd(), "src", f), "utf8");
const hook = src("components/catalog/useLiveCardStock.ts");
check("one request per page: the cards' hook is the only caller of /api/stock", (hook.match(/fetch\(/g) ?? []).length === 1 && hook.includes('fetch("/api/stock"'));
check("the card's sales badge reads the live answer", /CardSalesBadge[\s\S]*?useLiveSoldOut\(slug, soldOut\)/.test(src("components/catalog/SalesBadge.tsx")));
check("the in-stock filter reads the live answer", src("components/catalog/CatalogBrowser.tsx").includes("useLiveCardStock()"));
check("the product page uses the same ProductMaster rule", src("components/product/useLiveStock.ts").includes("pilotStatusAfterLive(variants, product.availabilityStatus, live.p)"));
const route = src("app/api/stock/route.ts");
check("the stock API answers from the live read, without counts", route.includes("liveCardChanges(allProducts, getPublishedProducts(), liveLookup())") && !/Quantity|publicCount/.test(route));
check("the price line stays on the build (card and product page alike)", !/useLiveCardStock|useLiveSoldOut/.test(src("components/catalog/SaleLabel.tsx")));
check("JSON-LD stays build-time", !/useLiveCardStock|card-stock|api\/stock/.test(src("app/products/[slug]/page.tsx").replace(/inStockEntryKeys/g, "")));

for (const res of results) {
  console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
}
const failed = results.filter((x) => !x.passed);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
