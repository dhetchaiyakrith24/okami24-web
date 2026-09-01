/**
 * OKami24 — storefront preview + published-catalog read model, contract tests.
 */

import { baseSyntheticProduct } from "@/data/product-master-contract-test";
import { buildStorefrontPreview, buildPublishedCatalog, buildPublishedCatalogFrom } from "./storefront-preview-read-model";

export interface ReadModelContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

// Phase 3.4 added Coil-1/21/72/83/94; Phase 3.5 added Coil-38/63/68/70/89, Pod-159/149/150,
// Disposable-34, the pilot's first e-liquid products (ELIQUID-1/Eliquid-109/eliquid-133), and a
// final wave (coil-54/coil-62/Pod-169, resolving "Feelin"->NEVOKS and "infy"->INFY). This
// session's catalog-expansion slice resolved Coil-55 (deferred since Phase 3.4). It also resolved
// the Marbo↔Salthub rebrand relationship, but all three device-Marbo Shipnity records turned out
// to be exact duplicates of already-existing legacy products (`m-bar-9k`/`zero-pro`/
// `zero-cartridge`) — correctly none of them added here — see PREVIEW_SHIPNITY_IDS.
const EXPECTED_IDS = [
  "Coil-53", "Coil-55", "Coil-56", "Coil-74", "Coil-87", "Coil-92",
  "Coil-1", "Coil-21", "Coil-72", "Coil-83", "Coil-94",
  "Coil-38", "Coil-63", "Coil-68", "Coil-70", "Coil-89",
  "Pod-159", "Pod-149", "Pod-150", "Disposable-34",
  "ELIQUID-1", "Eliquid-109", "eliquid-133",
  "coil-54", "coil-62", "Pod-169",
];

export function runStorefrontReadModelContractTests(): ReadModelContractResult[] {
  const results: ReadModelContractResult[] = [];
  const check = (name: string, condition: boolean, detail: string) => results.push({ name, passed: condition, detail });

  const views = buildStorefrontPreview();

  check("exactly the 26 Phase 2.7 + 3.4 + 3.5 + this-session products are present, nothing more", views.length === 26, JSON.stringify(views.map((v) => v.shipnityProductId)));

  check(
    "every expected Shipnity id is present",
    EXPECTED_IDS.every((id) => views.some((v) => v.shipnityProductId === id)),
    JSON.stringify(views.map((v) => v.shipnityProductId))
  );

  check(
    "every view has a real, non-empty brand/category/tagline (no fabricated fallback text)",
    views.every((v) => v.brandName.length > 0 && v.categoryName.length > 0 && v.tagline.length > 0),
    JSON.stringify(views)
  );

  // Coil-56/Coil-74/Coil-89 are now genuinely published (real approved prices, see
  // publication-approvals.ts) — buildStorefrontPreview() is the raw per-record mapping and
  // correctly reflects that; the pilot/preview EXCLUSION of published records happens one layer
  // up, in storefront-bridge.ts's getPilotProduct(s) (proven by storefront-bridge-contract-test.ts),
  // not here.
  const PUBLISHED_IDS = new Set(["Coil-38", "Coil-56", "Coil-74", "Coil-89", "Coil-92"]);
  check(
    "every view's publicationStatus is unpublished except the genuinely published products (Coil-38, Coil-56, Coil-74, Coil-89, Coil-92)",
    views.every((v) => v.publicationStatus === (PUBLISHED_IDS.has(v.shipnityProductId) ? "published" : "unpublished")),
    JSON.stringify(views.map((v) => ({ id: v.shipnityProductId, status: v.publicationStatus })))
  );

  check(
    "every variant has a non-empty label resolved from optionDefinitions, not a raw code",
    views.every((v) => v.variants.every((variant) => variant.label.length > 0)),
    JSON.stringify(views.map((v) => v.variants))
  );

  // Every one of the original 5 Phase 2.7 products happens to have exactly 1 active variant —
  // real active-catalog data, not something to force. Phase 3.4's Coil-21/Coil-83 and Phase 3.5's
  // Pod-149/coil-54 are genuinely single-SKU (their only Shipnity child is packaging text or,
  // for Pod-149, a label classify.ts's flavor-keyword heuristic doesn't recognize — a real
  // classifier gap for that one label, deliberately not force-fixed here since a zero-variant
  // single-SKU product already renders correctly). This session's Coil-55 joins them for the same
  // reason — its only child ("1 กล่อง / มี 2ตัว") is packaging text, correctly excluded as
  // sell-unit. So a blanket ">=1 for everyone" is no longer a valid invariant. What IS still
  // checkable: the zero-variant set must be exactly this known real quintet — anything else at 0
  // would mean buildVariantStructure silently dropped a real variant for a product that should
  // have one.
  const zeroVariantIds = views.filter((v) => v.variants.length === 0).map((v) => v.shipnityProductId);
  check(
    "the only zero-variant products are the known real single-SKU quintet (Coil-21, Coil-55, Coil-83, Pod-149, coil-54)",
    zeroVariantIds.length === 5 && ["Coil-21", "Coil-55", "Coil-83", "Pod-149", "coil-54"].every((id) => zeroVariantIds.includes(id)),
    JSON.stringify(views.map((v) => ({ id: v.shipnityProductId, variantCount: v.variants.length })))
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

  const publishedNow = buildPublishedCatalog();
  const findPublished = (id: string) => publishedNow.find((p) => p.shipnityProductId === id);
  check(
    "buildPublishedCatalog() against REAL current data returns exactly the five genuinely approved products (Coil-38 ฿450, Coil-56 ฿300, Coil-74 ฿250, Coil-89 ฿350, Coil-92 ฿130)",
    publishedNow.length === 5 &&
      findPublished("Coil-38")?.sellingPrice === 450 &&
      findPublished("Coil-38")?.variants.length === 2 &&
      findPublished("Coil-56")?.sellingPrice === 300 &&
      findPublished("Coil-56")?.variants.length === 1 &&
      findPublished("Coil-56")?.variants[0]?.id === "Coil-56-3" &&
      findPublished("Coil-74")?.sellingPrice === 250 &&
      findPublished("Coil-74")?.variants.length === 1 &&
      findPublished("Coil-89")?.sellingPrice === 350 &&
      findPublished("Coil-89")?.variants.length === 2 &&
      findPublished("Coil-92")?.sellingPrice === 130 &&
      findPublished("Coil-92")?.variants.length === 1,
    JSON.stringify(publishedNow)
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
