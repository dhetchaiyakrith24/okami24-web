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

// Exported so other contract-test files (e.g. storefront-preview-read-model-contract-test.ts's
// buildPublishedCatalogFrom coverage) can reuse the same "fully-ready synthetic product" fixture
// instead of duplicating this shape.
export function baseSyntheticProduct(overrides: Partial<ProductMasterInput> = {}): ProductMasterInput {
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
    // A real card/official-photo asset by default — same "each fixture tests one thing" reasoning
    // as the pricing default below. Fixtures that specifically exercise the media readiness rule
    // override this explicitly.
    assets: [{ kind: "official-photo", role: "card", src: "https://example.com/card.webp", alt: "contract test fixture" }],
    sourceUrls: ["https://example.com"],
    commerce: { internalSku: null },
    // A fully-ready price by default — matches the file's own stated design ("each fixture only
    // tests the one thing it's meant to"). Fixtures that specifically exercise the pricing
    // readiness rule override this explicitly; see the sellingPrice/priceApprovedByOwner cases
    // below.
    pricing: { sellingPrice: 999, lastPriceReview: "2026-01-01", priceApprovedByOwner: true },
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
      // accepted, distinct from "vapenow"/"manual". Unpublished (with sellingPrice: null) so
      // this isolates the schema-shape check from the pricing-readiness check below — this
      // fixture's only real concern is the priceReference.source enum, not readiness.
      name: "priceReference.source = shipnity is accepted",
      expectRejection: false,
      product: baseSyntheticProduct({
        internalId: "synthetic-shipnity-price-reference",
        slug: "synthetic-shipnity-price-reference",
        publicationStatus: "unpublished",
        pricing: {
          sellingPrice: null,
          priceReference: { source: "shipnity", value: 1090, capturedAt: "2026-08-31T00:00:00.000Z" },
          lastPriceReview: null,
          priceApprovedByOwner: false,
        },
      }),
    },
    {
      // Phase 2.6 — CORE PRINCIPLE: identity/admission is a lower bar than publication.
      name: "draft record: null brandId/familyId/categoryId/attributes, unpublished — schema + registry valid",
      expectRejection: false,
      product: baseSyntheticProduct({
        internalId: "synthetic-draft-incomplete",
        slug: "synthetic-draft-incomplete",
        publicationStatus: "unpublished",
        brandId: null,
        familyId: null,
        categoryId: null,
        attributes: null,
      }),
    },
    {
      name: "published record: null brandId — rejected by publication readiness (registry)",
      expectRejection: true,
      product: baseSyntheticProduct({
        internalId: "synthetic-published-missing-brand",
        slug: "synthetic-published-missing-brand",
        publicationStatus: "published",
        brandId: null,
      }),
    },
    {
      name: "published record: null categoryId — rejected by publication readiness (registry)",
      expectRejection: true,
      product: baseSyntheticProduct({
        internalId: "synthetic-published-missing-category",
        slug: "synthetic-published-missing-category",
        publicationStatus: "published",
        categoryId: null,
      }),
    },
    {
      // Phase 2.6 revision — attributes is device-shaped (screenType/chargingType/...) and
      // NOT universally applicable (an e-liquid has no charging port), so it is deliberately
      // NOT enforced at publication readiness — forcing it would fabricate irrelevant data for
      // non-device product types. Deferred to a future type-conditional readiness model.
      name: "published record: null attributes — accepted (not a universal readiness requirement)",
      expectRejection: false,
      product: baseSyntheticProduct({
        internalId: "synthetic-published-missing-attributes",
        slug: "synthetic-published-missing-attributes",
        publicationStatus: "published",
        attributes: null,
      }),
    },
    {
      // Phase 2.6 revision — SystemType is a closed enum with no e-liquid/IQOS value; there is
      // no CORRECT value to require here for those product types, so it is deliberately NOT
      // enforced at publication readiness (unlike categoryId, whose gap is missing DATA, not a
      // structural mismatch).
      name: "published record: null systemType — accepted (not a universal readiness requirement)",
      expectRejection: false,
      product: baseSyntheticProduct({
        internalId: "synthetic-published-missing-systemtype",
        slug: "synthetic-published-missing-systemtype",
        publicationStatus: "published",
        systemType: null,
      }),
    },
    {
      // Production-readiness audit — sellingPrice/priceApprovedByOwner are now universal
      // readiness requirements (see the registry validator's own comment). Note priceReference
      // is deliberately still populated here, proving that a reference price alone is NOT
      // sufficient — it must never stand in for an owner-approved sellingPrice.
      name: "published record: null sellingPrice — rejected by publication readiness (registry)",
      expectRejection: true,
      product: baseSyntheticProduct({
        internalId: "synthetic-published-missing-price",
        slug: "synthetic-published-missing-price",
        publicationStatus: "published",
        pricing: {
          sellingPrice: null,
          priceReference: { source: "shipnity", value: 500, capturedAt: "2026-01-01" },
          lastPriceReview: null,
          priceApprovedByOwner: false,
        },
      }),
    },
    {
      name: "published record: sellingPrice set but priceApprovedByOwner false — rejected by publication readiness (registry)",
      expectRejection: true,
      product: baseSyntheticProduct({
        internalId: "synthetic-published-price-not-approved",
        slug: "synthetic-published-price-not-approved",
        publicationStatus: "published",
        pricing: { sellingPrice: 500, lastPriceReview: null, priceApprovedByOwner: false },
      }),
    },
    {
      name: "published record: sellingPrice set and priceApprovedByOwner true — accepted",
      expectRejection: false,
      product: baseSyntheticProduct({
        internalId: "synthetic-published-price-approved",
        slug: "synthetic-published-price-approved",
        publicationStatus: "published",
        pricing: { sellingPrice: 500, lastPriceReview: "2026-01-01", priceApprovedByOwner: true },
      }),
    },
    {
      // Publication-pipeline audit — the DEV-preview glyph fallback must never satisfy this: an
      // empty `assets` array is exactly what every real ProductMaster candidate has today (see
      // VERIFIED_MEDIA in active-catalog-to-product-master.ts), so this proves the rule actually
      // blocks the real current gap, not just a contrived one.
      name: "published record: empty assets — rejected by publication readiness (registry)",
      expectRejection: true,
      product: baseSyntheticProduct({
        internalId: "synthetic-published-missing-media",
        slug: "synthetic-published-missing-media",
        publicationStatus: "published",
        assets: [],
      }),
    },
    {
      // An "illustration" asset (the glyph's own `kind`) must not satisfy the rule either — only
      // `kind: "official-photo"` counts, proving this isn't just an "assets.length > 0" check.
      name: "published record: illustration-only asset — rejected by publication readiness (registry)",
      expectRejection: true,
      product: baseSyntheticProduct({
        internalId: "synthetic-published-illustration-only",
        slug: "synthetic-published-illustration-only",
        publicationStatus: "published",
        assets: [{ kind: "illustration", role: "card", src: "https://example.com/glyph.svg", alt: "fallback illustration" }],
      }),
    },
    {
      // A "detail" (gallery) photo alone must not satisfy the rule — the card asset specifically
      // is what every consumer (ProductCard, PilotProductCard, category/search grids) actually
      // renders; a product with only a detail shot would still show no image in every grid.
      name: "published record: official-photo present but role is detail, not card — rejected by publication readiness (registry)",
      expectRejection: true,
      product: baseSyntheticProduct({
        internalId: "synthetic-published-detail-only",
        slug: "synthetic-published-detail-only",
        publicationStatus: "published",
        assets: [{ kind: "official-photo", role: "detail", src: "https://example.com/detail.webp", alt: "detail shot" }],
      }),
    },
    {
      name: "published record: null tagline/shortDescription — rejected by publication readiness (registry)",
      expectRejection: true,
      product: baseSyntheticProduct({
        internalId: "synthetic-published-missing-copy",
        slug: "synthetic-published-missing-copy",
        publicationStatus: "published",
        tagline: null,
        shortDescription: null,
      }),
    },
    {
      // familyId is deliberately NOT a publication requirement (convenience taxonomy only).
      name: "published record: null familyId but everything else present — accepted",
      expectRejection: false,
      product: baseSyntheticProduct({
        internalId: "synthetic-published-no-family",
        slug: "synthetic-published-no-family",
        publicationStatus: "published",
        familyId: null,
      }),
    },
    {
      name: "published record: brandId/categoryId/attributes/familyId all present — accepted (complete)",
      expectRejection: false,
      product: baseSyntheticProduct({
        internalId: "synthetic-published-complete",
        slug: "synthetic-published-complete",
        publicationStatus: "published",
      }),
    },
    {
      // A non-null taxonomy reference must still resolve — draft admission relaxes ABSENCE, not
      // correctness. Unpublished so this isolates the FK check from the readiness check.
      name: "draft record: non-null but dangling categoryId is still rejected",
      expectRejection: true,
      product: baseSyntheticProduct({
        internalId: "synthetic-draft-dangling-category",
        slug: "synthetic-draft-dangling-category",
        publicationStatus: "unpublished",
        categoryId: "does-not-exist-anywhere",
      }),
    },
    {
      // lifecycleStatus:"draft" means the merchandising decision itself isn't finalized —
      // publishing it is an internally inconsistent state, independent of taxonomy/content
      // completeness (this fixture is otherwise fully complete).
      name: "draft lifecycle + published — rejected as internally inconsistent",
      expectRejection: true,
      product: baseSyntheticProduct({
        internalId: "synthetic-draft-lifecycle-published",
        slug: "synthetic-draft-lifecycle-published",
        lifecycleStatus: "draft",
        publicationStatus: "published",
      }),
    },
    {
      name: "draft lifecycle + unpublished — accepted (consistent)",
      expectRejection: false,
      product: baseSyntheticProduct({
        internalId: "synthetic-draft-lifecycle-unpublished",
        slug: "synthetic-draft-lifecycle-unpublished",
        lifecycleStatus: "draft",
        publicationStatus: "unpublished",
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
