/**
 * OKami24 Product Master — Phase 2 (adapter reality test).
 *
 * Pure, read-only mapping from the live `Product` shape (src/types/catalog.ts, 28 hand-authored
 * records in src/data/products/*.ts) to the Phase-1-approved `ProductMaster` shape
 * (src/types/product-master.ts). Nothing here is imported by any page/component — it exists
 * purely to test whether the new schema can represent real data cleanly, per the approved
 * Phase 2 objective. It does not read/write/mutate the legacy product files in any way.
 *
 * Deliberately NOT auto-validating/throwing at module load (unlike `src/data/products/index.ts`
 * and `src/data/schema.ts`'s existing convention) — a reality test needs to see every failure
 * across all 28 products, not stop at the first one. Validation is run explicitly by whatever
 * calls `runAdapterRealityTest()` below.
 *
 * === Mapping legend used throughout (see field-level comments for specifics) ===
 * CLEAN     — direct, unambiguous 1:1 mapping from an existing legacy field.
 * DEFAULT   — the new schema requires a value legacy data has no concept of; a neutral,
 *             non-fabricated transitional value is used (null / "unknown" / empty array).
 * DERIVED   — mechanically restructured from existing legacy content without inventing new
 *             facts (e.g. splitting an embedded array into a referenced pool).
 * FRICTION  — the mapping required a judgment call because the two schemas don't line up
 *             cleanly; flagged here and in the Phase 2 report.
 */

import type { Product, Compatibility, FAQItem } from "@/types/catalog";
import { allProducts } from "@/data/products";
import type { FAQEntry, CompatibilityLink, RelatedProductLink } from "@/types/product-master";
import {
  productMasterSchema,
  productMasterListSchema,
  faqEntryListSchema,
  validateProductMasterRegistry,
  type ProductMasterInput,
} from "@/data/product-master-schema";
import { brands } from "@/data/brands";
import { categories } from "@/data/categories";
import { families } from "@/data/families";

// ===================================================================================
// Per-product FAQ: legacy embeds full FAQItem[] on the product; ProductMaster expects
// `faqRefs: string[]` pointing into a global FAQEntry pool. DERIVED, not fabricated — the
// question/answer text is carried over unchanged; only the storage shape changes (embedded
// -> pool + reference). The id is prefixed with the product slug to guarantee global
// uniqueness, since legacy FAQItem ids (e.g. "g5-pods") were only ever unique per-product.
// ===================================================================================

function faqItemToEntry(productSlug: string, item: FAQItem): FAQEntry {
  return {
    id: `${productSlug}::${item.id}`,
    question: item.question,
    answer: item.answer,
    scope: "product",
    source: "editorial",
  };
}

// ===================================================================================
// Compatibility: legacy `Compatibility` has no `targetInternalId` or verification concept at
// all. CLEAN for type/label/note. `targetInternalId` is left undefined (FRICTION — see
// report: legacy compatibility labels like "UWELL GPP cartridge platform" name a *platform*,
// not one of the 28 catalog products, so there is no unambiguous target to link — inventing
// one would violate the "don't fabricate relationships from free text" constraint).
// `verificationStatus` maps to "unknown" (Phase 2.1 calibration) — the legacy shape has no
// per-entry provenance to derive true/false from (the closest concept,
// `specifications[].sourceStatus`, is a sibling field, not part of the compatibility entry
// itself), so "unknown" is the honest state — never fabricate "unverified" (which would
// falsely claim we checked and it failed) or "verified" (which would falsely claim we
// checked and it passed).
// ===================================================================================

function compatibilityToLink(c: Compatibility): CompatibilityLink {
  return {
    type: c.type, // CLEAN — legacy union is a strict subset of the new one
    label: c.label, // CLEAN
    note: c.note, // CLEAN
    targetInternalId: undefined, // DEFAULT — no unambiguous target in the 28-product catalog
    verificationStatus: "unknown", // DEFAULT (Phase 2.1) — no per-entry provenance in legacy data
  };
}

// ===================================================================================
// Related products: legacy `relatedProductSlugs: string[]` maps CLEANly to `targetInternalId`
// (internalId === slug for every legacy product today). `reason`/`source` are left absent
// entirely (Phase 2.1 calibration) — the array never recorded *why* two products are related,
// and `reason`/`source` are now optional specifically so migrated data doesn't have to
// fabricate a classification (cross-sell-pod / similar-product / etc.) that was never made.
// ===================================================================================

function relatedSlugToLink(slug: string): RelatedProductLink {
  return {
    targetInternalId: slug, // CLEAN — id === slug for all 28 legacy products
    // reason/source intentionally omitted — see comment above
  };
}

// ===================================================================================
// whoIsThisFor: legacy `string[]` of bullet points has NO field in ProductMaster v1 — a real
// Phase-1 gap (see SCHEMA PRESSURE in the Phase 2 report), fixed in Phase 2.1 by making
// `merchantContent.bestFor` an array. Now a direct, non-lossy 1:1 mapping.
// ===================================================================================

function whoIsThisForToBestFor(items: string[]): string[] | undefined {
  return items.length > 0 ? [...items] : undefined;
}

// ===================================================================================
// Main adapter
// ===================================================================================

export function mapLegacyProductToMaster(p: Product): ProductMasterInput {
  return {
    // ---- Identity (CLEAN) ----
    internalId: p.id,
    slug: p.slug,

    // ---- Lifecycle / publication (DEFAULT) ----
    // All 28 legacy products are currently live/browsable on the approved site — "active" /
    // "published" accurately describes their current observable state. This is not invented
    // business data, but it IS a judgment call the schema has no legacy field to confirm from
    // (flagged in the report's DEFAULTS USED section).
    lifecycleStatus: "active",
    publicationStatus: "published",

    // ---- Taxonomy (CLEAN) ----
    brandId: p.brandId,
    familyId: p.familyId,
    categoryId: p.categoryId,
    systemType: p.systemType,

    // ---- Manufacturer / product facts (CLEAN — identical shape) ----
    name: p.name,
    displayName: p.displayName,
    tagline: p.tagline,
    shortDescription: p.shortDescription,
    attributes: { ...p.attributes },
    specifications: p.specifications.map((s) => ({ ...s })),
    features: p.features.map((f) => ({ ...f })),
    assets: p.assets.map((a) => ({ ...a })),
    sourceUrls: [...p.sourceUrls],

    // ---- Commerce identity (DEFAULT — none of this exists in legacy data at all) ----
    commerce: {
      internalSku: null, // never invent a SKU
      supplierSku: undefined,
      barcode: undefined,
      integrationRef: undefined, // no Shipnity integration exists
    },

    // ---- Pricing (DEFAULT — this catalog has never carried real prices) ----
    pricing: {
      sellingPrice: null,
      compareAtPrice: undefined,
      priceReference: undefined,
      lastPriceReview: null,
      priceApprovedByOwner: false, // honestly true: no price has ever been approved
    },

    // ---- Variants (DEFAULT — legacy has zero variant concept) ----
    optionDefinitions: [],
    variants: [],

    // ---- Availability (DEFAULT — no real stock data exists for this demo catalog) ----
    availability: { status: "unknown", source: "unknown", observedAt: null },

    // ---- Content, 3-tier (mostly DEFAULT; bestFor is DERIVED from whoIsThisFor) ----
    editorialContent: {
      longDescription: undefined,
      keyHighlights: undefined,
      whatInTheBox: undefined,
      howToUse: undefined,
      careTips: undefined,
    },
    merchantContent: {
      bestFor: whoIsThisForToBestFor(p.whoIsThisFor),
      whyWeRecommend: undefined,
      storeNotes: undefined,
      warningNotes: undefined,
      comparisonHint: undefined,
    },
    merchantTags: [], // DEFAULT — none of the 28 demo products are in the real merchant-tag list

    // ---- Relationships ----
    compatibility: p.compatibility.map(compatibilityToLink), // CLEAN + FRICTION, see above
    relatedProducts: p.relatedProductSlugs.map(relatedSlugToLink), // CLEAN + FRICTION, see above
    faqRefs: p.faqs.map((item) => `${p.slug}::${item.id}`), // DERIVED, see faqItemToEntry

    // ---- SEO (DEFAULT — legacy has no dedicated SEO override fields) ----
    seo: { titleOverride: undefined, metaDescription: undefined, imageAlt: undefined },

    // ---- Editorial flags (CLEAN) ----
    isFlagship: p.isFlagship,
    editorialTag: p.editorialTag,
  };
}

/** Builds the global FAQEntry pool purely from the 28 legacy products' embedded `faqs[]`.
 *  Does not include `src/data/faqs.ts` (the separate site-wide FAQ) — reconciling those two
 *  pools is explicitly deferred (see Phase 1 plan's "FAQ pool migration" risk). */
export function buildLegacyFaqPool(products: Product[]): FAQEntry[] {
  return products.flatMap((p) => p.faqs.map((item) => faqItemToEntry(p.slug, item)));
}

export const legacyProductMasters: ProductMasterInput[] = allProducts.map(mapLegacyProductToMaster);
export const legacyFaqPool: FAQEntry[] = buildLegacyFaqPool(allProducts);

// ===================================================================================
// Reality-test runner — explicit, not run at import time. Returns a structured report
// instead of throwing, so a single bad record doesn't hide the results for the other 27.
// ===================================================================================

export interface AdapterRealityTestResult {
  total: number;
  passed: number;
  failed: { slug: string; issues: string[] }[];
  registryError: string | null;
}

export function runAdapterRealityTest(): AdapterRealityTestResult {
  const failed: { slug: string; issues: string[] }[] = [];
  let passed = 0;

  for (const product of legacyProductMasters) {
    const result = productMasterSchema.safeParse(product);
    if (result.success) {
      passed += 1;
    } else {
      failed.push({
        slug: product.slug,
        issues: result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
      });
    }
  }

  // Also confirm the whole list validates together (catches cross-record issues Zod's
  // per-item safeParse above wouldn't, though none are expected at this stage).
  const listResult = productMasterListSchema.safeParse(legacyProductMasters);
  if (!listResult.success) {
    for (const issue of listResult.error.issues) {
      failed.push({ slug: `(list-level) ${issue.path.join(".")}`, issues: [issue.message] });
    }
  }

  const faqPoolResult = faqEntryListSchema.safeParse(legacyFaqPool);
  if (!faqPoolResult.success) {
    for (const issue of faqPoolResult.error.issues) {
      failed.push({ slug: `(faq-pool) ${issue.path.join(".")}`, issues: [issue.message] });
    }
  }

  let registryError: string | null = null;
  try {
    validateProductMasterRegistry({
      products: legacyProductMasters,
      brandIds: brands.map((b) => b.id),
      familyIds: families.map((f) => f.id),
      categoryIds: categories.map((c) => c.id),
      faqEntryIds: legacyFaqPool.map((f) => f.id),
    });
  } catch (e) {
    registryError = e instanceof Error ? e.message : String(e);
  }

  return { total: legacyProductMasters.length, passed, failed, registryError };
}
