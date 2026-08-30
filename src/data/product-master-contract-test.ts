/**
 * OKami24 Product Master — Phase 2.1 lightweight contract tests.
 *
 * Purely synthetic fixtures — none of the 28 legacy products are read, mutated, or exercised
 * here. This exists because the legacy catalog cannot exercise several invariants at all (no
 * product has variants, so option-selection FK checks and the availability-derivation
 * invariant are otherwise completely untested). Real brand/family/category ids are reused
 * read-only as valid foreign keys so each fixture only tests the one thing it's meant to.
 *
 * Deliberately not a test framework — no jest/vitest dependency added, per the instruction to
 * keep this lightweight. `runContractTests()` returns a plain result array; run it via a
 * throwaway script (`npx tsx`) the same way the Phase 2 adapter reality test was run.
 */

import { brands } from "@/data/brands";
import { families } from "@/data/families";
import { categories } from "@/data/categories";
import {
  productMasterSchema,
  validateProductMasterRegistry,
  type ProductMasterInput,
} from "@/data/product-master-schema";

// A real, unmodified brand/family/category triple, reused only as valid FK targets.
const REAL_BRAND_ID = brands[0].id;
const REAL_FAMILY_ID = families.find((f) => f.brandId === REAL_BRAND_ID)!.id;
const REAL_CATEGORY_ID = categories[0].id;

function baseSyntheticProduct(overrides: Partial<ProductMasterInput> = {}): ProductMasterInput {
  return {
    internalId: "synthetic-base",
    slug: "synthetic-base",
    lifecycleStatus: "active",
    publicationStatus: "published",
    brandId: REAL_BRAND_ID,
    familyId: REAL_FAMILY_ID,
    categoryId: REAL_CATEGORY_ID,
    systemType: "open-pod",
    name: "Synthetic Contract Test Product",
    displayName: "Synthetic Contract Test Product",
    tagline: "contract test fixture",
    shortDescription: "contract test fixture",
    attributes: {
      screenType: "none",
      drawStyle: "MTL",
      portability: "compact",
      beginnerFriendly: true,
      chargingType: "USB-C",
    },
    specifications: [],
    features: [],
    assets: [],
    sourceUrls: ["https://example.com"],
    commerce: { internalSku: null },
    pricing: { sellingPrice: null, lastPriceReview: null, priceApprovedByOwner: false },
    optionDefinitions: [],
    variants: [],
    availability: { status: "unknown", source: "unknown", observedAt: null },
    editorialContent: {},
    merchantContent: {},
    merchantTags: [],
    compatibility: [],
    relatedProducts: [],
    faqRefs: [],
    seo: {},
    isFlagship: false,
    ...overrides,
  };
}

interface ContractCase {
  name: string;
  /** true = this fixture is intentionally broken; the case "passes" iff validation rejects it. */
  expectRejection: boolean;
  product: ProductMasterInput;
  faqEntryIds?: string[];
}

const CASES: ContractCase[] = (() => {
  const withVariantsValid = baseSyntheticProduct({
    internalId: "synthetic-with-variants",
    slug: "synthetic-with-variants",
    optionDefinitions: [
      {
        code: "color",
        label: "Color",
        allowedValues: [
          { code: "red", label: "Red" },
          { code: "black", label: "Black" },
        ],
      },
    ],
    variants: [
      {
        id: "v1",
        parentInternalId: "synthetic-with-variants",
        optionSelections: [{ optionCode: "color", valueCode: "red" }],
        sku: null,
        availability: { status: "in-stock", source: "manual", observedAt: "2026-01-01" },
      },
      {
        id: "v2",
        parentInternalId: "synthetic-with-variants",
        optionSelections: [{ optionCode: "color", valueCode: "black" }],
        sku: null,
        availability: { status: "out-of-stock", source: "manual", observedAt: "2026-01-01" },
      },
    ],
    // at least one variant is in-stock, so the correctly-derived product-level status is "in-stock"
    availability: { status: "in-stock", source: "manual", observedAt: "2026-01-01" },
  });

  return [
    {
      name: "valid product with variants (correctly-derived availability)",
      expectRejection: false,
      product: withVariantsValid,
    },
    {
      name: "invalid optionCode reference in variant",
      expectRejection: true,
      product: {
        ...withVariantsValid,
        internalId: "synthetic-bad-option-code",
        slug: "synthetic-bad-option-code",
        variants: withVariantsValid.variants.map((v) =>
          v.id === "v1" ? { ...v, optionSelections: [{ optionCode: "size", valueCode: "red" }] } : v
        ),
      },
    },
    {
      name: "invalid valueCode reference in variant",
      expectRejection: true,
      product: {
        ...withVariantsValid,
        internalId: "synthetic-bad-value-code",
        slug: "synthetic-bad-value-code",
        variants: withVariantsValid.variants.map((v) =>
          v.id === "v1" ? { ...v, optionSelections: [{ optionCode: "color", valueCode: "green" }] } : v
        ),
      },
    },
    {
      name: "product availability inconsistent with variant-derived availability",
      expectRejection: true,
      product: {
        ...withVariantsValid,
        internalId: "synthetic-inconsistent-availability",
        slug: "synthetic-inconsistent-availability",
        // variants derive to "in-stock" (v1 is in-stock), but product-level claims "out-of-stock"
        availability: { status: "out-of-stock", source: "manual", observedAt: "2026-01-01" },
      },
    },
    {
      // Proves three things at once (Phase 2.3): (1) commerce.integrationRef identifies a
      // Shipnity parent product, (2) each variant's own integrationRef identifies its
      // Shipnity child record independently, (3) sku stays null/independent throughout —
      // integrationRef (external, opaque) and sku (OKami24-owned) never get conflated.
      name: "product + variant integrationRef identify Shipnity parent/child, sku stays independent",
      expectRejection: false,
      product: {
        ...withVariantsValid,
        internalId: "synthetic-with-shipnity-integration",
        slug: "synthetic-with-shipnity-integration",
        commerce: {
          internalSku: null,
          integrationRef: {
            provider: "shipnity",
            externalId: "Pod-179",
            lastSyncedAt: "2026-08-31T00:00:00.000Z",
            syncStatus: "ok",
          },
        },
        variants: withVariantsValid.variants.map((v, i) => ({
          ...v,
          sku: null,
          integrationRef: {
            provider: "shipnity",
            externalId: `Pod-179-${i + 1}`,
            lastSyncedAt: "2026-08-31T00:00:00.000Z",
            syncStatus: "ok",
          },
        })),
      },
    },
    {
      // integrationRef is opaque by design (see type-level doc comment) — there is no FK/
      // registry check for it, only Zod shape validation. This proves the shape check itself
      // still rejects malformed data (empty externalId violates `.min(1)`).
      name: "variant integrationRef with empty externalId is rejected",
      expectRejection: true,
      product: {
        ...withVariantsValid,
        internalId: "synthetic-bad-integration-ref",
        slug: "synthetic-bad-integration-ref",
        variants: withVariantsValid.variants.map((v) =>
          v.id === "v1"
            ? {
                ...v,
                integrationRef: {
                  provider: "shipnity" as const,
                  externalId: "",
                  lastSyncedAt: null,
                  syncStatus: "never-synced" as const,
                },
              }
            : v
        ),
      },
    },
    {
      // Phase 2.5 — proves the "shipnity" priceReference.source value (added this phase) is
      // accepted, distinct from "vapenow"/"manual".
      name: "priceReference.source = shipnity is accepted",
      expectRejection: false,
      product: baseSyntheticProduct({
        internalId: "synthetic-shipnity-price-reference",
        slug: "synthetic-shipnity-price-reference",
        pricing: {
          sellingPrice: null,
          priceReference: { source: "shipnity", value: 1090, capturedAt: "2026-08-31T00:00:00.000Z" },
          lastPriceReview: null,
          priceApprovedByOwner: false,
        },
      }),
    },
    {
      name: "dangling relatedProducts.targetInternalId",
      expectRejection: true,
      product: baseSyntheticProduct({
        internalId: "synthetic-dangling-related",
        slug: "synthetic-dangling-related",
        relatedProducts: [{ targetInternalId: "does-not-exist-anywhere" }],
      }),
    },
    {
      name: "dangling faqRefs entry",
      expectRejection: true,
      product: baseSyntheticProduct({
        internalId: "synthetic-dangling-faq",
        slug: "synthetic-dangling-faq",
        faqRefs: ["synthetic-dangling-faq::nonexistent"],
      }),
      faqEntryIds: [], // empty pool — the reference above can't possibly resolve
    },
  ];
})();

export interface ContractTestResult {
  name: string;
  passed: boolean;
  detail: string;
}

export function runContractTests(): ContractTestResult[] {
  return CASES.map(({ name, expectRejection, product, faqEntryIds }) => {
    const shapeResult = productMasterSchema.safeParse(product);
    let rejected = !shapeResult.success;
    let detail = shapeResult.success ? "" : `Zod: ${shapeResult.error.issues[0]?.message}`;

    if (shapeResult.success) {
      try {
        validateProductMasterRegistry({
          products: [shapeResult.data],
          brandIds: brands.map((b) => b.id),
          familyIds: families.map((f) => f.id),
          categoryIds: categories.map((c) => c.id),
          faqEntryIds: faqEntryIds ?? [],
        });
      } catch (e) {
        rejected = true;
        detail = `registry: ${e instanceof Error ? e.message : String(e)}`;
      }
    }

    const passed = rejected === expectRejection;
    return {
      name,
      passed,
      detail: passed
        ? expectRejection
          ? `correctly rejected — ${detail}`
          : "correctly accepted"
        : expectRejection
          ? "expected rejection but validation accepted it"
          : `expected acceptance but validation rejected it — ${detail}`,
    };
  });
}
