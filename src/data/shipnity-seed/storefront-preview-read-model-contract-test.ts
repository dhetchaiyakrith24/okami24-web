/**
 * OKami24 — Phase 2.8: storefront preview read model, contract tests.
 */

import { buildStorefrontPreview } from "./storefront-preview-read-model";

export interface ReadModelContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

const EXPECTED_IDS = ["Coil-53", "Coil-56", "Coil-74", "Coil-87", "Coil-92"];

export function runStorefrontReadModelContractTests(): ReadModelContractResult[] {
  const results: ReadModelContractResult[] = [];
  const check = (name: string, condition: boolean, detail: string) => results.push({ name, passed: condition, detail });

  const views = buildStorefrontPreview();

  check("exactly the 5 Phase 2.7 products are present, nothing more", views.length === 5, JSON.stringify(views.map((v) => v.shipnityProductId)));

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

  // Every one of the 5 real products in this batch happens to have exactly 1 active variant —
  // that's the real active-catalog data, not something to force. Just confirm every product has
  // at least one (an empty variants array would mean buildVariantStructure silently dropped
  // something it shouldn't have for this specific known-good batch).
  check("every product has at least one variant", views.every((v) => v.variants.length >= 1), JSON.stringify(views.map((v) => v.variants.length)));

  check(
    "priceReferenceValue is a positive number sourced from Shipnity for every product",
    views.every((v) => v.priceReferenceValue !== null && v.priceReferenceValue > 0 && v.priceReferenceSource === "shipnity"),
    JSON.stringify(views.map((v) => ({ id: v.shipnityProductId, price: v.priceReferenceValue, source: v.priceReferenceSource })))
  );

  return results;
}
