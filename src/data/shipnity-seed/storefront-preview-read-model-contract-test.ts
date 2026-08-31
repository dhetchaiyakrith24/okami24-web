/**
 * OKami24 — Phase 2.8: storefront preview read model, contract tests.
 */

import { buildStorefrontPreview } from "./storefront-preview-read-model";

export interface ReadModelContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

// Phase 3.4 added Coil-1/21/72/83/94 to the Phase 2.7 batch — see PREVIEW_SHIPNITY_IDS.
const EXPECTED_IDS = ["Coil-53", "Coil-56", "Coil-74", "Coil-87", "Coil-92", "Coil-1", "Coil-21", "Coil-72", "Coil-83", "Coil-94"];

export function runStorefrontReadModelContractTests(): ReadModelContractResult[] {
  const results: ReadModelContractResult[] = [];
  const check = (name: string, condition: boolean, detail: string) => results.push({ name, passed: condition, detail });

  const views = buildStorefrontPreview();

  check("exactly the 10 Phase 2.7 + Phase 3.4 products are present, nothing more", views.length === 10, JSON.stringify(views.map((v) => v.shipnityProductId)));

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

  check(
    "every view's publicationStatus is unpublished — the read model never observes a published record",
    views.every((v) => v.publicationStatus === "unpublished"),
    JSON.stringify(views.map((v) => ({ id: v.shipnityProductId, status: v.publicationStatus })))
  );

  check(
    "every variant has a non-empty label resolved from optionDefinitions, not a raw code",
    views.every((v) => v.variants.every((variant) => variant.label.length > 0)),
    JSON.stringify(views.map((v) => v.variants))
  );

  // Every one of the original 5 Phase 2.7 products happens to have exactly 1 active variant —
  // real active-catalog data, not something to force. Phase 3.4's Coil-21/Coil-83 are genuinely
  // single-SKU (their only Shipnity child is packaging/unresolved text, not a real option — see
  // buildVariantStructure), so a blanket ">=1 for everyone" is no longer a valid invariant. What
  // IS still checkable: the zero-variant set must be exactly this known real pair — anything else
  // at 0 would mean buildVariantStructure silently dropped a real variant for a product that
  // should have one.
  const zeroVariantIds = views.filter((v) => v.variants.length === 0).map((v) => v.shipnityProductId);
  check(
    "the only zero-variant products are the known real single-SKU pair (Coil-21, Coil-83)",
    zeroVariantIds.length === 2 && ["Coil-21", "Coil-83"].every((id) => zeroVariantIds.includes(id)),
    JSON.stringify(views.map((v) => ({ id: v.shipnityProductId, variantCount: v.variants.length })))
  );

  check(
    "priceReferenceValue is a positive number sourced from Shipnity for every product",
    views.every((v) => v.priceReferenceValue !== null && v.priceReferenceValue > 0 && v.priceReferenceSource === "shipnity"),
    JSON.stringify(views.map((v) => ({ id: v.shipnityProductId, price: v.priceReferenceValue, source: v.priceReferenceSource })))
  );

  return results;
}
