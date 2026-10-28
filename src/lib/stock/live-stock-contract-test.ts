/**
 * OKami24 — live warehouse stock (Shipnity link step 4, owner 28/10).
 *
 *   1. live-rules: the owner's sold-out list wins; no code / "check" = no live answer; a reported number > 0 sells, 0 or
 *      less is sold out; no report = no live answer (the build stays);
 *   2. the money boundary (resolveProductRef) with a live lookup: a live "out" blocks an option the build sells, a live
 *      "in" sells an option the build marked out, no answer keeps the build — on both catalog halves; without a lookup it
 *      behaves exactly as before.
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import { codeFor, liveState, lookupFrom, type LiveReport } from "./live-rules";
import { resolveProductRef } from "@/lib/commerce/catalog-resolver";
import { SHIPNITY_SKU_MAP } from "@/data/stock/sku-map";
import { parseSoldOutList } from "@/data/stock/apply-sold-out";
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

// 1. rules — find a real coded option on a legacy product that sells, and one owner-listed option
const sellableLegacy = (() => {
  for (const p of allProducts) {
    if (getCatalogItem(p.slug)?.sellingPrice == null) continue;
    for (const v of [...(p.colorVariants ?? []), ...(p.flavorVariants ?? [])]) {
      const code = codeFor(p.slug, v.id);
      if (code && v.availability !== "out-of-stock") return { slug: p.slug, id: v.id, name: v.name, code };
    }
  }
  return null;
})();
check("a sellable coded legacy option exists to test with", sellableLegacy !== null);

const listedEntry = parseSoldOutList().entries.find((e) => {
  const entry = SHIPNITY_SKU_MAP[e.slug];
  return entry?.options && Object.values(entry.options).some((c) => typeof c === "string" && c !== "check");
});

if (sellableLegacy) {
  const { slug, id, name, code } = sellableLegacy;
  check("reported 5 = in", liveState(new Map([[code, rep(5)]]), slug, id, name) === "in");
  check("reported 0 = out", liveState(new Map([[code, rep(0)]]), slug, id, name) === "out");
  check("reported -2 = out", liveState(new Map([[code, rep(-2)]]), slug, id, name) === "out");
  check("status only: outofstock = out", liveState(new Map([[code, rep(null, "outofstock")]]), slug, id, name) === "out");
  check("no report = no live answer", liveState(new Map(), slug, id, name) === null);

  // 2. money boundary
  const ref = { origin: getCatalogItem(slug)!.origin, slug, variantId: id };
  check("no lookup = as before (sells)", resolveProductRef(ref).ok);
  check("live out blocks it", !resolveProductRef(ref, lookupFrom(new Map([[code, rep(0)]]))).ok);
  check("live in still sells", resolveProductRef(ref, lookupFrom(new Map([[code, rep(3)]]))).ok);
  check("no report keeps the build", resolveProductRef(ref, lookupFrom(new Map())).ok);
}

if (listedEntry) {
  const entry = SHIPNITY_SKU_MAP[listedEntry.slug];
  const p = allProducts.find((x) => x.slug === listedEntry.slug);
  const opt = p ? [...(p.colorVariants ?? []), ...(p.flavorVariants ?? [])].find((v) => v.name.toLowerCase() === listedEntry.option || v.id === listedEntry.option) : undefined;
  const code = opt ? entry?.options?.[opt.id] : undefined;
  if (opt && typeof code === "string" && code !== "check") {
    check("owner's sold-out list wins over a live 10", liveState(new Map([[code, rep(10)]]), listedEntry.slug, opt.id, opt.name) === "out");
  }
}

const noSku = Object.entries(SHIPNITY_SKU_MAP).find(([, e]) => e.options && Object.values(e.options).some((c) => c === null));
if (noSku) {
  const [slug, e] = noSku;
  const id = Object.entries(e.options!).find(([, c]) => c === null)![0];
  check("an option with no warehouse code gets no live answer", liveState(new Map(), slug, id) === null && codeFor(slug, id) === null);
}

// a build-time sold-out (warehouse read) ProductMaster or legacy option that Shipnity now reports in stock sells again
const reopen = (() => {
  for (const p of allProducts) {
    if (getCatalogItem(p.slug)?.sellingPrice == null) continue;
    for (const v of [...(p.colorVariants ?? []), ...(p.flavorVariants ?? [])]) {
      const code = codeFor(p.slug, v.id);
      const listed = parseSoldOutList().entries.some((x) => x.slug === p.slug && (x.option === v.name.toLowerCase() || x.option === v.id));
      if (code && v.availability === "out-of-stock" && !listed) return { slug: p.slug, id: v.id, code, origin: getCatalogItem(p.slug)!.origin };
    }
  }
  for (const p of buildPublishedCatalog()) {
    if (p.sellingPrice === null) continue;
    for (const v of p.variants) {
      const code = codeFor(p.slug, v.id);
      const listed = parseSoldOutList().entries.some((x) => x.slug === p.slug && (x.option === v.label.toLowerCase() || x.option === v.id));
      if (code && v.availabilityStatus === "out-of-stock" && !listed) return { slug: p.slug, id: v.id, code, origin: "product-master" as const };
    }
  }
  return null;
})();
if (reopen) {
  const ref = { origin: reopen.origin, slug: reopen.slug, variantId: reopen.id };
  check(`build-out option ${reopen.code}: blocked without live`, !resolveProductRef(ref).ok);
  check(`build-out option ${reopen.code}: sells when Shipnity reports 4`, resolveProductRef(ref, lookupFrom(new Map([[reopen.code, rep(4)]]))).ok);
}

// ProductMaster half: a sellable published variant blocked by a live 0
const pm = (() => {
  for (const p of buildPublishedCatalog()) {
    if (p.sellingPrice === null) continue;
    for (const v of p.variants) {
      const code = codeFor(p.slug, v.id);
      if (code && v.availabilityStatus === "in-stock") return { slug: p.slug, id: v.id, code };
    }
  }
  return null;
})();
if (pm) {
  const ref = { origin: "product-master" as const, slug: pm.slug, variantId: pm.id };
  check("ProductMaster: sells as built", resolveProductRef(ref).ok);
  check("ProductMaster: live 0 blocks", !resolveProductRef(ref, lookupFrom(new Map([[pm.code, rep(0)]]))).ok);
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
