/**
 * OKami24 Product Master — Phase 1 (Zod schema + referential-integrity layer).
 *
 * Mirrors `src/types/product-master.ts` field-for-field. This file is intentionally
 * self-contained (its own small `specificationSchema`/`featureSchema`/`assetSchema`, not
 * imported from `src/data/schema.ts`) per the approved plan: Phase 1 must not touch the
 * existing `catalog.ts`/`schema.ts`/product data at all, so nothing here risks changing the
 * live site's validation behavior.
 *
 * Not wired up to real data yet — there is no `ProductMaster[]` array to validate until
 * Phase 2 (the legacy→ProductMaster adapter) exists. `validateProductMasterRegistry` is
 * exported ready to use once that array exists.
 */

import { z } from "zod";

// ===================================================================================
// Reused leaf shapes (duplicated intentionally from src/data/schema.ts — see file header)
// ===================================================================================

const sourceStatusSchema = z.enum(["verified", "unverified"]);

const specificationSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  value: z.string().min(1),
  sourceStatus: sourceStatusSchema,
});

const featureSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

const assetSchema = z.object({
  kind: z.enum(["official-photo", "illustration"]),
  role: z.enum(["card", "detail"]),
  src: z.string().min(1),
  alt: z.string().min(1),
  angle: z.string().optional(),
  transparentBackground: z.boolean().optional(),
  sourceName: z.string().optional(),
  sourceUrl: z.string().optional(),
});

// ===================================================================================
// New leaf shapes
// ===================================================================================

const optionValueSchema = z.object({
  code: z.string().min(1),
  label: z.string().min(1),
});

const optionDefinitionSchema = z.object({
  code: z.string().min(1),
  label: z.string().min(1),
  allowedValues: z.array(optionValueSchema).min(1),
});

const availabilityStatusSchema = z.enum(["in-stock", "out-of-stock", "unknown"]);

const availabilitySnapshotSchema = z.object({
  status: availabilityStatusSchema,
  source: z.enum(["shipnity", "manual", "unknown"]),
  observedAt: z.string().nullable(),
});

const variantSchema = z.object({
  id: z.string().min(1),
  parentInternalId: z.string().min(1),
  optionSelections: z.array(
    z.object({
      optionCode: z.string().min(1),
      valueCode: z.string().min(1),
    })
  ),
  sku: z.string().min(1).nullable(),
  image: assetSchema.optional(),
  pricingOverride: z
    .object({
      sellingPrice: z.number().positive().optional(),
      compareAtPrice: z.number().positive().optional(),
    })
    .optional(),
  availability: availabilitySnapshotSchema,
});

const integrationRefSchema = z.object({
  provider: z.literal("shipnity"),
  externalId: z.string().min(1),
  lastSyncedAt: z.string().nullable(),
  syncStatus: z.enum(["ok", "stale", "error", "never-synced"]),
});

export const faqEntrySchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
  scope: z.enum(["global", "category", "product"]),
  categoryId: z.string().optional(),
  source: z.literal("editorial"),
});

/** FAQEntry is a standalone pool, validated on its own (Phase 2 will build this array from
 *  the legacy `src/data/faqs.ts` + per-product `faqs[]` — see plan's FAQ pool migration risk). */
export const faqEntryListSchema = z.array(faqEntrySchema);

const compatibilityLinkSchema = z.object({
  type: z.enum(["pod", "coil", "cartridge", "accessory", "eliquid-category", "charging"]),
  targetInternalId: z.string().optional(),
  label: z.string().min(1),
  note: z.string().optional(),
  verified: z.boolean(),
});

const relatedProductLinkSchema = z.object({
  targetInternalId: z.string().min(1),
  reason: z.enum([
    "cross-sell-pod",
    "cross-sell-coil",
    "cross-sell-accessory",
    "similar-product",
    "alternative-if-out-of-stock",
    "editorial",
  ]),
  source: z.enum(["manufacturer", "merchant-knowledge", "editorial"]),
});

const merchantTagRefSchema = z.object({
  tag: z.enum([
    "best-seller",
    "customer-favorite",
    "beginner-friendly",
    "higher-problem-rate",
    "not-recommended",
    "repeat-consumable-opportunity",
    "underwhelming-in-practice",
    "high-margin",
  ]),
  reason: z.string().optional(),
  source: z.literal("merchant-knowledge"),
  recordedAt: z.string(),
});

// ===================================================================================
// Core entity
// ===================================================================================

export const productMasterSchema = z.object({
  internalId: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),

  lifecycleStatus: z.enum(["draft", "active", "coming-soon", "discontinued", "archived"]),
  publicationStatus: z.enum(["published", "unpublished"]),

  brandId: z.string().min(1),
  familyId: z.string().min(1),
  categoryId: z.string().min(1),
  systemType: z.enum(["open-pod", "pod-kit", "disposable", "pod-cartridge", "coil", "accessory"]),

  name: z.string().min(1),
  displayName: z.string().min(1),
  tagline: z.string().min(1),
  shortDescription: z.string().min(1),
  attributes: z.object({
    batteryMah: z.number().positive().optional(),
    wattageMin: z.number().positive().optional(),
    wattageMax: z.number().positive().optional(),
    puffCount: z.number().positive().optional(),
    capacityMl: z.number().positive().optional(),
    screenType: z.enum(["none", "led-indicator", "color-display", "touchscreen"]),
    screenSize: z.string().optional(),
    drawStyle: z.enum(["MTL", "RDL", "DTL", "MTL/RDL"]),
    portability: z.enum(["ultra-compact", "compact", "standard"]),
    beginnerFriendly: z.boolean(),
    chargingType: z.string().min(1),
    weightG: z.number().positive().optional(),
    dimensions: z.string().optional(),
  }),
  specifications: z.array(specificationSchema),
  features: z.array(featureSchema),
  assets: z.array(assetSchema),
  sourceUrls: z.array(z.string()),

  commerce: z.object({
    internalSku: z.string().min(1).nullable(),
    supplierSku: z.string().optional(),
    barcode: z.string().optional(),
    integrationRef: integrationRefSchema.optional(),
  }),

  pricing: z.object({
    sellingPrice: z.number().positive().nullable(),
    compareAtPrice: z.number().positive().optional(),
    priceReference: z
      .object({
        source: z.enum(["vapenow", "manual"]),
        value: z.number().positive(),
        capturedAt: z.string(),
      })
      .optional(),
    lastPriceReview: z.string().nullable(),
    priceApprovedByOwner: z.boolean(),
  }),

  optionDefinitions: z.array(optionDefinitionSchema),
  variants: z.array(variantSchema),

  availability: availabilitySnapshotSchema,

  editorialContent: z.object({
    longDescription: z.string().optional(),
    keyHighlights: z.array(z.string()).optional(),
    whatInTheBox: z.array(z.string()).optional(),
    howToUse: z.string().optional(),
    careTips: z.string().optional(),
  }),
  merchantContent: z.object({
    bestFor: z.string().optional(),
    whyWeRecommend: z.string().optional(),
    storeNotes: z.string().optional(),
    warningNotes: z.string().optional(),
    comparisonHint: z.string().optional(),
  }),
  merchantTags: z.array(merchantTagRefSchema),

  compatibility: z.array(compatibilityLinkSchema),
  relatedProducts: z.array(relatedProductLinkSchema),
  faqRefs: z.array(z.string()),

  seo: z.object({
    titleOverride: z.string().optional(),
    metaDescription: z.string().optional(),
    imageAlt: z.string().optional(),
  }),

  isFlagship: z.boolean(),
  editorialTag: z.string().optional(),
});

export const productMasterListSchema = z.array(productMasterSchema);

export type ProductMasterInput = z.infer<typeof productMasterSchema>;

// ===================================================================================
// Referential-integrity / load-time validation layer.
//
// Zod above only checks per-field *shape* — it has no idea whether `brandId: "uwell"`
// actually points at a real Brand record. This function is the FK layer, mirroring the
// duplicate-slug / related-slug checks `src/data/products/index.ts` already runs for the
// legacy `Product[]`, but extended to cover every relationship ProductMaster introduces —
// including the *existing* brandId/familyId/categoryId FKs that were never validated
// before. It throws a specific, actionable error per broken reference rather than failing
// silently, matching the existing "fail the build, not the page" convention.
// ===================================================================================

interface RegistryInputs {
  products: ProductMasterInput[];
  brandIds: string[];
  familyIds: string[];
  categoryIds: string[];
  faqEntryIds: string[];
}

export function validateProductMasterRegistry({
  products,
  brandIds,
  familyIds,
  categoryIds,
  faqEntryIds,
}: RegistryInputs): void {
  const brandSet = new Set(brandIds);
  const familySet = new Set(familyIds);
  const categorySet = new Set(categoryIds);
  const faqSet = new Set(faqEntryIds);

  const internalIdSet = new Set<string>();
  for (const p of products) {
    if (internalIdSet.has(p.internalId)) {
      throw new Error(`Duplicate ProductMaster internalId: ${p.internalId}`);
    }
    internalIdSet.add(p.internalId);
  }

  for (const p of products) {
    if (!brandSet.has(p.brandId)) {
      throw new Error(`${p.internalId} references unknown brandId: ${p.brandId}`);
    }
    if (!familySet.has(p.familyId)) {
      throw new Error(`${p.internalId} references unknown familyId: ${p.familyId}`);
    }
    if (!categorySet.has(p.categoryId)) {
      throw new Error(`${p.internalId} references unknown categoryId: ${p.categoryId}`);
    }

    const optionCodeSet = new Set(p.optionDefinitions.map((o) => o.code));
    const optionValueSets = new Map(p.optionDefinitions.map((o) => [o.code, new Set(o.allowedValues.map((v) => v.code))]));

    for (const variant of p.variants) {
      for (const sel of variant.optionSelections) {
        if (!optionCodeSet.has(sel.optionCode)) {
          throw new Error(
            `${p.internalId} variant ${variant.id} references unknown optionCode: ${sel.optionCode}`
          );
        }
        const values = optionValueSets.get(sel.optionCode);
        if (!values?.has(sel.valueCode)) {
          throw new Error(
            `${p.internalId} variant ${variant.id} references unknown valueCode "${sel.valueCode}" for option "${sel.optionCode}"`
          );
        }
      }
    }

    for (const link of p.compatibility) {
      if (link.targetInternalId && !internalIdSet.has(link.targetInternalId)) {
        throw new Error(
          `${p.internalId} compatibility entry references unknown targetInternalId: ${link.targetInternalId}`
        );
      }
    }

    for (const link of p.relatedProducts) {
      if (!internalIdSet.has(link.targetInternalId)) {
        throw new Error(
          `${p.internalId} relatedProducts entry references unknown targetInternalId: ${link.targetInternalId}`
        );
      }
    }

    for (const faqId of p.faqRefs) {
      if (!faqSet.has(faqId)) {
        throw new Error(`${p.internalId} references unknown FAQEntry id: ${faqId}`);
      }
    }
  }
}
