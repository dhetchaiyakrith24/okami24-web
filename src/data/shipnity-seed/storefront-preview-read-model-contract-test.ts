/**
 * OKami24 — storefront preview + published-catalog read model, contract tests.
 */

import { baseSyntheticProduct } from "@/data/product-master-contract-test";
import { buildStorefrontPreview, buildPublishedCatalog, buildPublishedCatalogFrom, PREVIEW_SHIPNITY_IDS } from "./storefront-preview-read-model";
import { OWNER_APPROVED_PUBLICATION } from "./publication-approvals";
import { projectActiveCatalog } from "./active-catalog-to-product-master";
import { activeCatalogSeed } from "./build-active-catalog";

export interface ReadModelContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

// Storefront quality-correction pass (2026-09-02) — this used to be a hand-maintained literal
// copy of PREVIEW_SHIPNITY_IDS, updated wave by wave in a header comment. It silently drifted out
// of sync with the real list (this file had no self-executing runner — see the fix below — so
// nothing caught it) and was reduced to importing the real constant directly: by construction it
// can never disagree with what buildStorefrontPreview() actually iterates.
const EXPECTED_IDS = PREVIEW_SHIPNITY_IDS;
// Two of the whitelisted ids (Disposable-34, Pod-149) no longer render at all — their brand
// claims were withdrawn this session (see active-catalog-to-product-master.ts's own comments),
// so `toView()` correctly drops them for missing brandId/categoryId rather than fabricating a
// placeholder. Re-derived here, not hardcoded, from the same real candidate data the read model
// itself reads.
const projectedForExpectations = projectActiveCatalog();
const candidateById = new Map(
  projectedForExpectations.filter((r) => r.status === "candidate").map((r) => [r.shipnityProductId, r.product] as const)
);
const EXPECTED_RENDERABLE_IDS = EXPECTED_IDS.filter((id) => {
  const c = candidateById.get(id);
  return Boolean(c?.brandId && c?.categoryId && c?.tagline);
});

export function runStorefrontReadModelContractTests(): ReadModelContractResult[] {
  const results: ReadModelContractResult[] = [];
  const check = (name: string, condition: boolean, detail: string) => results.push({ name, passed: condition, detail });

  const views = buildStorefrontPreview();

  check(
    `exactly the ${EXPECTED_RENDERABLE_IDS.length} whitelist ids with complete-enough taxonomy to render are present, nothing more`,
    views.length === EXPECTED_RENDERABLE_IDS.length,
    JSON.stringify(views.map((v) => v.shipnityProductId))
  );

  check(
    "every renderable expected Shipnity id is present",
    EXPECTED_RENDERABLE_IDS.every((id) => views.some((v) => v.shipnityProductId === id)),
    JSON.stringify(views.map((v) => v.shipnityProductId))
  );

  check(
    "the non-renderable whitelist ids (incomplete taxonomy) are correctly absent, not silently fabricated",
    EXPECTED_IDS.filter((id) => !EXPECTED_RENDERABLE_IDS.includes(id)).every((id) => !views.some((v) => v.shipnityProductId === id)),
    JSON.stringify(EXPECTED_IDS.filter((id) => !EXPECTED_RENDERABLE_IDS.includes(id)))
  );

  check(
    "every view has a real, non-empty brand/category/tagline (no fabricated fallback text)",
    views.every((v) => v.brandName.length > 0 && v.categoryName.length > 0 && v.tagline.length > 0),
    JSON.stringify(views)
  );

  // Several whitelist products are now genuinely published (real approved prices, see
  // publication-approvals.ts) — buildStorefrontPreview() is the raw per-record mapping and
  // correctly reflects that; the pilot/preview EXCLUSION of published records happens one layer
  // up, in storefront-bridge.ts's getPilotProduct(s) (proven by storefront-bridge-contract-test.ts),
  // not here. Derived from the real approval table rather than hardcoded, so a future publication
  // updates this expectation automatically.
  const PUBLISHED_IDS = new Set(Object.keys(OWNER_APPROVED_PUBLICATION));
  check(
    `every view's publicationStatus is unpublished except the ${PUBLISHED_IDS.size} genuinely approved products`,
    views.every((v) => v.publicationStatus === (PUBLISHED_IDS.has(v.shipnityProductId) ? "published" : "unpublished")),
    JSON.stringify(views.map((v) => ({ id: v.shipnityProductId, status: v.publicationStatus })))
  );

  check(
    "every variant has a non-empty label resolved from optionDefinitions, not a raw code",
    views.every((v) => v.variants.every((variant) => variant.label.length > 0)),
    JSON.stringify(views.map((v) => v.variants))
  );

  // Several products are genuinely single-SKU (their only Shipnity child is packaging text, or a
  // label classify.ts's keyword heuristic doesn't recognize) — a zero-variant product renders
  // correctly on its own, so a blanket ">=1 for everyone" is not a valid invariant. What IS
  // checkable without hardcoding a list that will drift every time a candidate's real child data
  // changes: every zero-variant VIEW must trace back to a raw active-catalog parent whose children
  // genuinely contain zero `variant`-role entries — checked against the RAW seed, independent of
  // buildVariantStructure's own output, so this can't just be circularly re-confirming whatever
  // the pipeline already produced. A view with 0 variants whose raw parent actually HAS
  // variant-role children would mean buildVariantStructure silently dropped a real one.
  const zeroVariantViews = views.filter((v) => v.variants.length === 0);
  check(
    "every zero-variant view's raw Shipnity parent genuinely has zero variant-role children (not a dropped one)",
    zeroVariantViews.every((v) => {
      const parent = activeCatalogSeed.find((p) => p.shipnityProductId === v.shipnityProductId);
      return parent !== undefined && parent.children.every((c) => c.childRole !== "variant");
    }),
    JSON.stringify(zeroVariantViews.map((v) => v.shipnityProductId))
  );

  check(
    "priceReferenceValue is a positive number sourced from Shipnity for every product",
    views.every((v) => v.priceReferenceValue !== null && v.priceReferenceValue > 0 && v.priceReferenceSource === "shipnity"),
    JSON.stringify(views.map((v) => ({ id: v.shipnityProductId, price: v.priceReferenceValue, source: v.priceReferenceSource })))
  );

  // ===================================================================================
  // buildPublishedCatalog(From) — publication-pipeline audit. Proves the real, environment-
  // independent publication pool works correctly using synthetic fixtures (same convention as
  // product-master-contract-test.ts), never mutating or depending on real approved data.
  // ===================================================================================

  // Derived from the real approval table rather than a hardcoded list/count — see this file's
  // header comment on why that drifted silently before. Cross-checks against `candidateById`
  // (the same real projection the read model itself is built from) rather than duplicating price/
  // variant numbers a second time.
  const publishedNow = buildPublishedCatalog();
  const findPublished = (id: string) => publishedNow.find((p) => p.shipnityProductId === id);
  const expectedPublishedIds = Object.keys(OWNER_APPROVED_PUBLICATION);
  check(
    `buildPublishedCatalog() against REAL current data returns exactly the ${expectedPublishedIds.length} genuinely approved products, each with its real approved price and variant count`,
    publishedNow.length === expectedPublishedIds.length &&
      expectedPublishedIds.every((id) => {
        const approval = OWNER_APPROVED_PUBLICATION[id];
        const candidate = candidateById.get(id);
        const view = findPublished(id);
        return view?.sellingPrice === approval.sellingPrice && view?.variants.length === candidate?.variants.length;
      }),
    JSON.stringify(publishedNow.map((p) => ({ id: p.shipnityProductId, price: p.sellingPrice, variants: p.variants.length })))
  );

  check("buildPublishedCatalogFrom([]) returns an empty array without throwing", buildPublishedCatalogFrom([]).length === 0, "n/a");

  const unpublishedOnly = baseSyntheticProduct({ internalId: "synthetic-unpublished", slug: "synthetic-unpublished", publicationStatus: "unpublished" });
  check(
    "buildPublishedCatalogFrom excludes unpublished candidates, no throw",
    buildPublishedCatalogFrom([unpublishedOnly]).length === 0,
    "n/a"
  );

  const fullyReadyPublished = baseSyntheticProduct({ internalId: "synthetic-fully-ready", slug: "synthetic-fully-ready", publicationStatus: "published" });
  const readyResult = (() => {
    try {
      return { views: buildPublishedCatalogFrom([fullyReadyPublished]), error: null };
    } catch (e) {
      return { views: null, error: e instanceof Error ? e.message : String(e) };
    }
  })();
  check(
    "buildPublishedCatalogFrom maps a fully-ready published candidate into a real StorefrontProductView (correct slug, publicationStatus, price)",
    readyResult.views !== null &&
      readyResult.views.length === 1 &&
      readyResult.views[0].slug === "synthetic-fully-ready" &&
      readyResult.views[0].publicationStatus === "published" &&
      readyResult.views[0].priceReferenceValue === null, // this fixture has no priceReference override — proves toView() doesn't fabricate one
    JSON.stringify(readyResult)
  );

  const missingMediaPublished = baseSyntheticProduct({
    internalId: "synthetic-missing-media-published",
    slug: "synthetic-missing-media-published",
    publicationStatus: "published",
    assets: [],
  });
  const missingMediaResult = (() => {
    try {
      buildPublishedCatalogFrom([missingMediaPublished]);
      return { threw: false, message: "" };
    } catch (e) {
      return { threw: true, message: e instanceof Error ? e.message : String(e) };
    }
  })();
  check(
    "buildPublishedCatalogFrom THROWS (not silently filters) for a published candidate missing verified media — an approval-table entry alone is not sufficient",
    missingMediaResult.threw && missingMediaResult.message.includes("assets"),
    JSON.stringify(missingMediaResult)
  );

  const missingPricePublished = baseSyntheticProduct({
    internalId: "synthetic-missing-price-published",
    slug: "synthetic-missing-price-published",
    publicationStatus: "published",
    pricing: { sellingPrice: null, lastPriceReview: null, priceApprovedByOwner: false },
  });
  const missingPriceResult = (() => {
    try {
      buildPublishedCatalogFrom([missingPricePublished]);
      return { threw: false, message: "" };
    } catch (e) {
      return { threw: true, message: e instanceof Error ? e.message : String(e) };
    }
  })();
  check(
    "buildPublishedCatalogFrom THROWS for a published candidate missing an owner-approved price",
    missingPriceResult.threw && missingPriceResult.message.includes("pricing.sellingPrice"),
    JSON.stringify(missingPriceResult)
  );

  return results;
}

// Storefront quality-correction pass (2026-09-02) — see product-master-contract-test.ts's own
// comment on this same fix: this file had no self-executing runner, so it never actually ran its
// checks when invoked directly (exactly how scripts/verify-catalog.ts invokes it).
if (require.main === module) {
  const results = runStorefrontReadModelContractTests();
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
