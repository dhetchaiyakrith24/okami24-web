/**
 * OKami24 — Phase 2.5: Active Catalog → ProductMaster projection, contract tests.
 *
 * Synthetic fixtures, same lightweight convention as `product-master-contract-test.ts` (no test
 * framework; `runProjectionContractTests()` returns a plain result array, run via throwaway
 * `npx tsx`). Necessary because the REAL active-catalog seed currently blocks on
 * `no-attributes-evidence`/`no-taxonomy-match` for every one of its 56 parents (see
 * `active-catalog-to-product-master.ts` file header) — these synthetic cases are what actually
 * exercise `buildVariantStructure`'s childRole-aware rules (variant/accessory-component/
 * sell-unit/unresolved handling, mixed-axis detection, SKU never fabricated). The last three
 * cases exercise the real pipeline against real Shipnity ids to confirm the three observed
 * block reasons fire correctly on real data.
 */

import { productMasterSchema, validateProductMasterRegistry } from "@/data/product-master-schema";
import { brands } from "@/data/brands";
import { families } from "@/data/families";
import { categories } from "@/data/categories";
import { buildVariantStructure, projectActiveCatalog } from "./active-catalog-to-product-master";
import type { ActiveChildRecord } from "./build-active-catalog";

function child(overrides: Partial<ActiveChildRecord>): ActiveChildRecord {
  return {
    shipnityVariantId: "Test-1-1",
    rawLabel: "placeholder",
    optionType: "unresolved",
    optionTypeProvenance: "unresolved",
    cleanedValue: null,
    packagingNote: null,
    childRole: "unresolved",
    ...overrides,
  };
}

export interface ProjectionContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

export function runProjectionContractTests(): ProjectionContractResult[] {
  const results: ProjectionContractResult[] = [];
  const check = (name: string, condition: boolean, detail: string) =>
    results.push({ name, passed: condition, detail });

  // ---- 1. All-variant, single axis (color) ----
  {
    const children = [
      child({ shipnityVariantId: "Test-1-1", rawLabel: "Black", optionType: "color", optionTypeProvenance: "inferred", cleanedValue: "Black", childRole: "variant" }),
      child({ shipnityVariantId: "Test-1-2", rawLabel: "Blue", optionType: "color", optionTypeProvenance: "inferred", cleanedValue: "Blue", childRole: "variant" }),
    ];
    const r = buildVariantStructure("test-1", children);
    check(
      "all-variant single axis builds optionDefinitions + variants, no exclusions",
      r.mixedAxisError === null && r.optionDefinitions.length === 1 && r.optionDefinitions[0].code === "color" && r.variants.length === 2 && r.excludedChildren.length === 0,
      JSON.stringify(r)
    );
  }

  // ---- 2. Sell-unit only → option-less product, no fake ProductVariant ----
  {
    const children = [child({ shipnityVariantId: "Test-2-1", rawLabel: "1 กล่อง / มี 2ตัว", childRole: "sell-unit" })];
    const r = buildVariantStructure("test-2", children);
    check(
      "sell-unit-only parent produces zero variants (option-less), child excluded not dropped",
      r.variants.length === 0 && r.optionDefinitions.length === 0 && r.excludedChildren.length === 1 && r.excludedChildren[0].role === "sell-unit",
      JSON.stringify(r)
    );
  }

  // ---- 3. accessory-component excluded, sibling variant still builds ----
  {
    const children = [
      child({ shipnityVariantId: "Test-3-1", rawLabel: "Grape", optionType: "flavor", optionTypeProvenance: "inferred", cleanedValue: "Grape", childRole: "variant" }),
      child({ shipnityVariantId: "Test-3-2", rawLabel: "ฐานแบตเตอรี่", childRole: "accessory-component" }),
    ];
    const r = buildVariantStructure("test-3", children);
    check(
      "accessory-component excluded and reported, does not block or merge into sibling variant",
      r.variants.length === 1 && r.excludedChildren.length === 1 && r.excludedChildren[0].role === "accessory-component" && r.mixedAxisError === null,
      JSON.stringify(r)
    );
  }

  // ---- 4. unresolved excluded, sibling variant still builds ----
  {
    const children = [
      child({ shipnityVariantId: "Test-4-1", rawLabel: "Grape", optionType: "flavor", optionTypeProvenance: "inferred", cleanedValue: "Grape", childRole: "variant" }),
      child({ shipnityVariantId: "Test-4-2", rawLabel: "Mineral Water", childRole: "unresolved" }),
    ];
    const r = buildVariantStructure("test-4", children);
    check(
      "unresolved child excluded and reported (not guessed), does not block sibling variant",
      r.variants.length === 1 && r.excludedChildren.length === 1 && r.excludedChildren[0].role === "unresolved",
      JSON.stringify(r)
    );
  }

  // ---- 5. Mixed axis among variant-role children → reported, not forced ----
  {
    const children = [
      child({ shipnityVariantId: "Test-5-1", rawLabel: "Black", optionType: "color", optionTypeProvenance: "inferred", cleanedValue: "Black", childRole: "variant" }),
      child({ shipnityVariantId: "Test-5-2", rawLabel: "Grape", optionType: "flavor", optionTypeProvenance: "inferred", cleanedValue: "Grape", childRole: "variant" }),
    ];
    const r = buildVariantStructure("test-5", children);
    check(
      "mixed variant axis (color+flavor) is reported as an error, never silently forced into one axis",
      r.mixedAxisError !== null && r.variants.length === 0,
      JSON.stringify(r)
    );
  }

  // ---- 6. SKU never fabricated ----
  {
    const children = [child({ shipnityVariantId: "Test-6-1", rawLabel: "Black", optionType: "color", optionTypeProvenance: "inferred", cleanedValue: "Black", childRole: "variant" })];
    const r = buildVariantStructure("test-6", children);
    check("variant.sku is always null, never copied from Shipnity id", r.variants.every((v) => v.sku === null), JSON.stringify(r.variants));
    check(
      "variant.integrationRef.externalId carries the Shipnity child id instead",
      r.variants[0]?.integrationRef?.externalId === "Test-6-1",
      JSON.stringify(r.variants[0])
    );
  }

  // ---- 7. A fully-evidenced synthetic candidate validates end-to-end (schema + registry) ----
  {
    const children = [
      child({ shipnityVariantId: "Test-7-1", rawLabel: "Black", optionType: "color", optionTypeProvenance: "confirmed-owner", cleanedValue: "Black", childRole: "variant" }),
      child({ shipnityVariantId: "Test-7-2", rawLabel: "Blue", optionType: "color", optionTypeProvenance: "confirmed-owner", cleanedValue: "Blue", childRole: "variant" }),
    ];
    const vs = buildVariantStructure("test-7", children);
    const product = {
      internalId: "test-7",
      slug: "test-7",
      lifecycleStatus: "active" as const,
      publicationStatus: "unpublished" as const,
      brandId: brands[0].id,
      familyId: families.find((f) => f.brandId === brands[0].id)!.id,
      categoryId: categories[0].id,
      systemType: "open-pod" as const,
      name: "Test Product",
      displayName: "Test Product",
      tagline: "t",
      shortDescription: "t",
      attributes: { screenType: "none" as const, drawStyle: "MTL" as const, portability: "compact" as const, beginnerFriendly: true, chargingType: "USB-C" },
      specifications: [],
      features: [],
      assets: [],
      sourceUrls: [],
      commerce: { internalSku: null, integrationRef: { provider: "shipnity" as const, externalId: "Test-7", lastSyncedAt: "2026-08-31T00:00:00.000Z", syncStatus: "ok" as const } },
      pricing: { sellingPrice: null, priceReference: { source: "shipnity" as const, value: 500, capturedAt: "2026-08-31T00:00:00.000Z" }, lastPriceReview: null, priceApprovedByOwner: false },
      optionDefinitions: vs.optionDefinitions,
      variants: vs.variants,
      availability: { status: "in-stock" as const, source: "shipnity" as const, observedAt: "2026-08-31T00:00:00.000Z" },
      editorialContent: {},
      merchantContent: {},
      merchantTags: [],
      compatibility: [],
      relatedProducts: [],
      faqRefs: [],
      seo: {},
      isFlagship: false,
    };
    const shapeResult = productMasterSchema.safeParse(product);
    let registryOk = false;
    let detail = shapeResult.success ? "" : JSON.stringify(shapeResult.error.issues);
    if (shapeResult.success) {
      try {
        validateProductMasterRegistry({
          products: [shapeResult.data],
          brandIds: brands.map((b) => b.id),
          familyIds: families.map((f) => f.id),
          categoryIds: categories.map((c) => c.id),
          faqEntryIds: [],
        });
        registryOk = true;
      } catch (e) {
        detail = e instanceof Error ? e.message : String(e);
      }
    }
    check("a fully-evidenced synthetic candidate validates against schema + registry", shapeResult.success && registryOk, detail);
  }

  // ---- 8/9/10. Real pipeline against real Shipnity ids — confirm observed block reasons ----
  const realResults = projectActiveCatalog();
  const byId = new Map(realResults.map((r) => [r.shipnityProductId, r]));

  const pod179 = byId.get("Pod-179");
  check(
    'real pipeline: Pod-179 (exact legacy match "argus-g4") blocks as identity-matches-existing-legacy-product',
    pod179?.status === "blocked" && pod179.reason === "identity-matches-existing-legacy-product",
    JSON.stringify(pod179)
  );

  // Phase 2.6 — these no longer block: both become real draft candidates (unpublished,
  // schema-valid) instead of being rejected outright for missing taxonomy/attributes evidence.
  const coil1 = byId.get("Coil-1");
  check(
    "real pipeline: Coil-1 (family known, no attributes evidence) is a draft candidate — brandId/familyId/categoryId/systemType present, attributes/tagline/shortDescription null",
    coil1?.status === "candidate" &&
      coil1.isDraft &&
      coil1.product.brandId === "voopoo" &&
      coil1.product.attributes === null &&
      coil1.product.publicationStatus === "unpublished",
    JSON.stringify(coil1)
  );

  const eliquid62 = byId.get("eliquid-62");
  check(
    "real pipeline: eliquid-62 (no taxonomy overlap at all) is a draft candidate with all taxonomy fields null",
    eliquid62?.status === "candidate" &&
      eliquid62.isDraft &&
      eliquid62.product.brandId === null &&
      eliquid62.product.familyId === null &&
      eliquid62.product.categoryId === null &&
      eliquid62.product.systemType === null,
    JSON.stringify(eliquid62)
  );

  return results;
}
