/**
 * OKami24 — Phase 3.1: storefront-bridge (search/discovery) contract tests.
 *
 * Covers `searchPilotProducts` plus the category/brand/related bridge helpers already exercised
 * manually in Phase 3.0 — proving them with an assertion suite instead of only a browser check.
 *
 * Storefront quality-correction pass (2026-09-02) — REWRITTEN to derive its expectations from
 * real source data instead of hand-maintained exact slug lists/counts. The previous version
 * hardcoded literals like "pods-cartridges category has exactly 7 pilot products" and updated
 * them by hand every time a product's publication status changed — which is exactly what broke
 * silently: this file had no self-executing runner (see the fix below), so a full wave of
 * publications (Coil-38/53/55/56/74/89/92, then Coil-70/83/87/Pod-169 this same session) drifted
 * the hardcoded numbers without anyone noticing, and 26 of 44 checks were failing the moment the
 * runner was finally added. Rather than hand-fix another batch of literals that will just go
 * stale again at the next publication, this version computes "what SHOULD be true" from the same
 * real inputs the storefront itself reads — `PREVIEW_SHIPNITY_IDS` (the pilot whitelist) and
 * `OWNER_APPROVED_PUBLICATION` (the published whitelist) — so a future publication changes the
 * expectation automatically instead of silently invalidating it.
 */

import { getProduct } from "@/data/products";
import { getBrand } from "@/data/brands";
import {
  getPilotProduct,
  getPilotProducts,
  getPilotProductsByCategory,
  getPilotProductsByBrand,
  getPilotRelatedProducts,
  searchPilotProducts,
  getPublishedProduct,
  getPublishedProducts,
  getPublishedProductsByCategory,
  getPublishedProductsByBrand,
  getPublishedRelatedProducts,
  searchPublishedProducts,
} from "./storefront-bridge";
import { PREVIEW_SHIPNITY_IDS } from "./storefront-preview-read-model";
import { OWNER_APPROVED_PUBLICATION } from "./publication-approvals";
import { projectActiveCatalog } from "./active-catalog-to-product-master";

export interface BridgeContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

function sameSlugSet(actual: { slug: string }[], expected: string[]): boolean {
  const a = new Set(actual.map((p) => p.slug));
  const e = new Set(expected);
  return a.size === e.size && [...e].every((s) => a.has(s));
}

export function runStorefrontBridgeContractTests(): BridgeContractResult[] {
  const results: BridgeContractResult[] = [];
  const check = (name: string, condition: boolean, detail: string) => results.push({ name, passed: condition, detail });

  // --- ground truth, derived from the same real inputs the storefront itself reads ---
  const publishedSlugs = new Set(Object.keys(OWNER_APPROVED_PUBLICATION).map((id) => id.toLowerCase()));
  const previewSlugs = new Set(PREVIEW_SHIPNITY_IDS.map((id) => id.toLowerCase()));
  const projected = projectActiveCatalog();
  const candidateBySlug = new Map(
    projected.filter((r) => r.status === "candidate").map((r) => [r.product.slug, r.product] as const)
  );

  // The real pilot pool is the preview whitelist MINUS anything that has since graduated to
  // published, MINUS anything whose taxonomy has since become incomplete — `toView()` in
  // storefront-preview-read-model.ts silently drops a candidate missing brandId/categoryId/
  // tagline rather than rendering a placeholder, so a whitelisted id can legitimately stop
  // rendering without ever publishing (e.g. Disposable-34/Pod-149 after this session's brand-
  // claim withdrawals — see active-catalog-to-product-master.ts's own comments on those). Both
  // exclusions are re-derived independently here rather than trusting getPilotProducts() to
  // grade its own homework.
  const expectedPilotSlugs = new Set(
    [...previewSlugs].filter((s) => {
      if (publishedSlugs.has(s)) return false;
      const c = candidateBySlug.get(s);
      return Boolean(c?.brandId && c?.categoryId && c?.tagline);
    })
  );

  // --- pilot query by model/name: none of the published slugs' identifying text should surface
  //     through the PILOT search path anymore, since they're excluded from that pool ---
  const stillPilotPublishedOverlap = [...publishedSlugs].filter((s) => expectedPilotSlugs.has(s));
  check(
    "no slug is simultaneously published and still expected in the pilot pool (mutually exclusive by construction)",
    stillPilotPublishedOverlap.length === 0,
    JSON.stringify(stillPilotPublishedOverlap)
  );

  // --- pilot query by brand: for every brand with at least one real pilot candidate, the pilot
  //     search/category/brand helpers must return exactly that derived set ---
  const pilotBrandIds = new Set([...expectedPilotSlugs].map((s) => candidateBySlug.get(s)?.brandId).filter((b): b is string => Boolean(b)));
  for (const brandId of pilotBrandIds) {
    const expected = [...expectedPilotSlugs].filter((s) => candidateBySlug.get(s)?.brandId === brandId);
    const actual = getPilotProductsByBrand(brandId);
    check(`getPilotProductsByBrand('${brandId}') returns exactly the ${expected.length} derived pilot product(s)`, sameSlugSet(actual, expected), JSON.stringify(actual.map((p) => p.slug)));
  }

  // --- pilot query by category: same derivation, for every category with at least one pilot
  //     candidate ---
  const pilotCategoryIds = new Set([...expectedPilotSlugs].map((s) => candidateBySlug.get(s)?.categoryId).filter((c): c is string => Boolean(c)));
  for (const categoryId of pilotCategoryIds) {
    const expected = [...expectedPilotSlugs].filter((s) => candidateBySlug.get(s)?.categoryId === categoryId);
    const actual = getPilotProductsByCategory(categoryId);
    check(`getPilotProductsByCategory('${categoryId}') returns exactly the ${expected.length} derived pilot product(s)`, sameSlugSet(actual, expected), JSON.stringify(actual.map((p) => p.slug)));
  }

  // --- getPilotProducts() overall count matches the derived set exactly ---
  check(
    "getPilotProducts() returns exactly the derived pilot set (preview whitelist minus published)",
    sameSlugSet(getPilotProducts(), [...expectedPilotSlugs]),
    JSON.stringify(getPilotProducts().map((p) => p.slug))
  );

  // --- text search actually matches, for a real brand present in each pool (exercises
  //     searchPilotProducts/searchPublishedProducts' own text-matching logic, distinct from the
  //     category/brand accessor functions checked above) ---
  const pilotBrandForSearch = [...pilotBrandIds][0];
  if (pilotBrandForSearch) {
    const brandName = getBrand(pilotBrandForSearch)?.name ?? pilotBrandForSearch;
    const expected = [...expectedPilotSlugs].filter((s) => candidateBySlug.get(s)?.brandId === pilotBrandForSearch);
    const found = searchPilotProducts(brandName.toLowerCase());
    check(
      `searchPilotProducts('${brandName.toLowerCase()}') returns exactly the ${expected.length} derived pilot product(s) for that brand`,
      sameSlugSet(found, expected),
      JSON.stringify(found.map((p) => p.slug))
    );
  }
  const publishedBrandIdsForSearch = new Set([...publishedSlugs].map((s) => candidateBySlug.get(s)?.brandId).filter((b): b is string => Boolean(b)));
  const publishedBrandForSearch = [...publishedBrandIdsForSearch][0];
  if (publishedBrandForSearch) {
    const brandName = getBrand(publishedBrandForSearch)?.name ?? publishedBrandForSearch;
    const expected = [...publishedSlugs].filter((s) => candidateBySlug.get(s)?.brandId === publishedBrandForSearch);
    const found = searchPublishedProducts(brandName.toLowerCase());
    check(
      `searchPublishedProducts('${brandName.toLowerCase()}') returns exactly the ${expected.length} derived published product(s) for that brand`,
      sameSlugSet(found, expected),
      JSON.stringify(found.map((p) => p.slug))
    );
  }

  // --- no false result for unrelated query ---
  const nonsense = searchPilotProducts("xyznonexistentquery123");
  check("a nonsense query returns zero pilot results", nonsense.length === 0, JSON.stringify(nonsense));

  // --- empty query returns nothing (matches legacy searchProducts("") behavior) ---
  check("an empty query returns zero pilot results, same as legacy searchProducts", searchPilotProducts("").length === 0, "n/a");

  // --- production gate returns zero pilot results ---
  const originalEnv = process.env.NODE_ENV;
  // @ts-expect-error -- test-only override of a normally-readonly env var
  process.env.NODE_ENV = "production";
  const prodSearch = searchPilotProducts("voopoo");
  const prodList = getPilotProducts();
  const anyPilotSlug = [...expectedPilotSlugs][0];
  const prodOne = anyPilotSlug ? getPilotProduct(anyPilotSlug) : undefined;
  // @ts-expect-error -- restore
  process.env.NODE_ENV = originalEnv;
  check(
    "search + list + single-lookup all return nothing under NODE_ENV=production",
    prodSearch.length === 0 && prodList.length === 0 && prodOne === undefined,
    `search=${prodSearch.length} list=${prodList.length} one=${prodOne}`
  );

  // --- a genuinely published slug is never reachable through getPilotProduct ---
  const anyPublishedSlug = [...publishedSlugs][0];
  if (anyPublishedSlug) {
    check(
      `${anyPublishedSlug} is no longer reachable through getPilotProduct — it graduated to published`,
      getPilotProduct(anyPublishedSlug) === undefined,
      "n/a"
    );
  }

  // --- getPilotRelatedProducts: pick any real pilot candidate with at least one same-category
  //     pilot sibling and prove the relation is exactly the derived same-category set, excluding
  //     itself and never including a published product ---
  const pilotWithSibling = [...expectedPilotSlugs].find((s) => {
    const cat = candidateBySlug.get(s)?.categoryId;
    return cat && [...expectedPilotSlugs].filter((other) => other !== s && candidateBySlug.get(other)?.categoryId === cat).length > 0;
  });
  if (pilotWithSibling) {
    const subject = getPilotProduct(pilotWithSibling);
    if (subject) {
      const cat = candidateBySlug.get(pilotWithSibling)?.categoryId;
      const expectedRelated = [...expectedPilotSlugs].filter((s) => s !== pilotWithSibling && candidateBySlug.get(s)?.categoryId === cat);
      const related = getPilotRelatedProducts(subject);
      check(
        `getPilotRelatedProducts(${pilotWithSibling}) returns exactly its ${expectedRelated.length} derived same-category pilot sibling(s), excluding itself and any published product`,
        sameSlugSet(related, expectedRelated),
        JSON.stringify(related.map((p) => p.slug))
      );
    }
  }

  // --- none of the pilot slugs collide with a real legacy product slug ---
  check(
    "no pilot slug collides with an existing legacy product slug",
    [...previewSlugs].every((s) => getProduct(s) === undefined),
    JSON.stringify([...previewSlugs])
  );

  // ===================================================================================
  // Published bridge — every published-* function must return EXACTLY the derived published set
  // and nothing else against REAL data. Unlike the pilot functions, these are NEVER
  // environment-gated, so this must hold regardless of NODE_ENV.
  // ===================================================================================

  const allPublished = getPublishedProducts();
  check(
    `getPublishedProducts() returns exactly the ${publishedSlugs.size} genuinely approved product(s) in publication-approvals.ts`,
    sameSlugSet(allPublished, [...publishedSlugs]),
    JSON.stringify(allPublished.map((p) => p.slug))
  );

  // Every individually-approved product resolves through getPublishedProduct with its real,
  // approved price and a variant count matching the real projected candidate.
  for (const slug of publishedSlugs) {
    const p = getPublishedProduct(slug);
    const candidate = candidateBySlug.get(slug);
    const approval = OWNER_APPROVED_PUBLICATION[Object.keys(OWNER_APPROVED_PUBLICATION).find((id) => id.toLowerCase() === slug)!];
    check(
      `getPublishedProduct('${slug}') returns the real published product with its approved ฿${approval?.sellingPrice} price and matching variant count`,
      p?.slug === slug && p?.sellingPrice === approval?.sellingPrice && p?.variants.length === (candidate?.variants.length ?? -1),
      JSON.stringify(p)
    );
  }

  // Category/brand bridges over the published pool, same derivation technique as the pilot pool.
  const publishedByCategory = new Map<string, string[]>();
  const publishedByBrand = new Map<string, string[]>();
  for (const slug of publishedSlugs) {
    const c = candidateBySlug.get(slug);
    if (!c?.categoryId || !c.brandId) continue;
    publishedByCategory.set(c.categoryId, [...(publishedByCategory.get(c.categoryId) ?? []), slug]);
    publishedByBrand.set(c.brandId, [...(publishedByBrand.get(c.brandId) ?? []), slug]);
  }
  for (const [categoryId, expected] of publishedByCategory) {
    const actual = getPublishedProductsByCategory(categoryId);
    check(`getPublishedProductsByCategory('${categoryId}') returns exactly the ${expected.length} derived published product(s)`, sameSlugSet(actual, expected), JSON.stringify(actual.map((p) => p.slug)));
  }
  for (const [brandId, expected] of publishedByBrand) {
    const actual = getPublishedProductsByBrand(brandId);
    check(`getPublishedProductsByBrand('${brandId}') returns exactly the ${expected.length} derived published product(s)`, sameSlugSet(actual, expected), JSON.stringify(actual.map((p) => p.slug)));
  }

  check("searchPublishedProducts('xyznonexistentquery123') returns nothing", searchPublishedProducts("xyznonexistentquery123").length === 0, "n/a");

  // getPublishedRelatedProducts: pick any published product with at least one same-category
  // published sibling and prove the relation is exactly that derived set.
  const publishedWithSibling = [...publishedSlugs].find((s) => {
    const cat = candidateBySlug.get(s)?.categoryId;
    return cat && (publishedByCategory.get(cat)?.length ?? 0) > 1;
  });
  if (publishedWithSibling) {
    const subject = getPublishedProduct(publishedWithSibling);
    const cat = candidateBySlug.get(publishedWithSibling)?.categoryId;
    if (subject && cat) {
      const expectedRelated = (publishedByCategory.get(cat) ?? []).filter((s) => s !== publishedWithSibling);
      const related = getPublishedRelatedProducts(subject);
      check(
        `getPublishedRelatedProducts(${publishedWithSibling}) returns exactly its ${expectedRelated.length} derived same-category published sibling(s), excluding itself`,
        sameSlugSet(related, expectedRelated),
        JSON.stringify(related.map((p) => p.slug))
      );
    }
  }

  // A still-pilot product from a category with NO published representation at all must see zero
  // published relations — real proof of no cross-category leakage into the published pool.
  const pilotOnlyCategory = [...pilotCategoryIds].find((c) => !publishedByCategory.has(c));
  if (pilotOnlyCategory) {
    const probeSlug = [...expectedPilotSlugs].find((s) => candidateBySlug.get(s)?.categoryId === pilotOnlyCategory);
    const probe = probeSlug ? getPilotProduct(probeSlug) : undefined;
    if (probe) {
      check(
        `getPublishedRelatedProducts(${probeSlug}, ${pilotOnlyCategory}) returns nothing — no published product is in that category`,
        getPublishedRelatedProducts(probe).length === 0,
        "n/a"
      );
    }
  }

  return results;
}

// Storefront quality-correction pass (2026-09-02) — see product-master-contract-test.ts's own
// comment on this same fix: this file had no self-executing runner, so it never actually ran its
// checks when invoked directly (exactly how scripts/verify-catalog.ts invokes it).
if (require.main === module) {
  const results = runStorefrontBridgeContractTests();
  const failed = results.filter((r) => !r.passed);
  for (const r of results) {
    console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `\n      ${r.detail}` : ""}`);
  }
  if (failed.length > 0) {
    console.error(`\n${failed.length} of ${results.length} checks failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} checks passed.`);
}
