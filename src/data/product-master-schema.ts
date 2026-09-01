/**
 * OKami24 Product Master — Phase 1 (Zod schema + referential-integrity layer), calibrated in
 * Phase 2.1 against the adapter reality test's findings (see `product-master-adapter.ts`).
 *
 * Mirrors `src/types/product-master.ts` field-for-field. This file is intentionally
 * self-contained (its own small `specificationSchema`/`featureSchema`/`assetSchema`, not
 * imported from `src/data/schema.ts`) per the approved plan: this must not touch the
 * existing `catalog.ts`/`schema.ts`/product data at all, so nothing here risks changing the
 * live site's validation behavior.
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

const integrationRefSchema = z.object({
  provider: z.literal("shipnity"),
  externalId: z.string().min(1),
  lastSyncedAt: z.string().nullable(),
  syncStatus: z.enum(["ok", "stale", "error", "never-synced"]),
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
  // Reuses the same IntegrationRef shape as commerce.integrationRef — see type-level doc
  // comment on ProductVariant.integrationRef for why this must not be merged with `sku`.
  integrationRef: integrationRefSchema.optional(),
  image: assetSchema.optional(),
  pricingOverride: z
    .object({
      sellingPrice: z.number().positive().optional(),
      compareAtPrice: z.number().positive().optional(),
    })
    .optional(),
  availability: availabilitySnapshotSchema,
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
  // Tri-state (Phase 2.1) — see type-level doc comment for why this isn't a boolean.
  verificationStatus: z.enum(["verified", "unverified", "unknown"]),
});

const relatedProductLinkSchema = z.object({
  targetInternalId: z.string().min(1),
  // Optional (Phase 2.1) — legacy migration must not fabricate a classification. See
  // type-level doc comment.
  reason: z
    .enum([
      "cross-sell-pod",
      "cross-sell-coil",
      "cross-sell-accessory",
      "similar-product",
      "alternative-if-out-of-stock",
      "editorial",
    ])
    .optional(),
  source: z.enum(["manufacturer", "merchant-knowledge", "editorial"]).optional(),
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

  // Phase 2.6 — nullable so a draft ProductMaster record can be admitted before it has real
  // taxonomy evidence. Publication readiness (brandId/categoryId non-null; familyId excused —
  // see type-level doc comment) is enforced in validateProductMasterRegistry, not here.
  brandId: z.string().min(1).nullable(),
  familyId: z.string().min(1).nullable(),
  categoryId: z.string().min(1).nullable(),
  // Nullable (Phase 2.6, discovered empirically) — see type-level doc comment.
  systemType: z.enum(["open-pod", "pod-kit", "disposable", "pod-cartridge", "coil", "accessory"]).nullable(),

  name: z.string().min(1),
  displayName: z.string().min(1),
  // Nullable (Phase 2.6, discovered empirically) — grouped with attributes, same evidence rule.
  tagline: z.string().min(1).nullable(),
  shortDescription: z.string().min(1).nullable(),
  // Phase 2.6 — nullable; never fabricated to satisfy admission. Required at publication.
  attributes: z
    .object({
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
    })
    .nullable(),
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
        // "shipnity" added Phase 2.5 — a genuine current consumer: the Shipnity active-catalog
        // projection needs to represent Shipnity's own first-party operational selling price as
        // a distinct source from "vapenow" (third-party reference) and "manual" (hand-entered).
        source: z.enum(["vapenow", "manual", "shipnity"]),
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
    // Array, not a single string (Phase 2.1) — preserves legacy whoIsThisFor[] granularity.
    bestFor: z.array(z.string().min(1)).optional(),
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

/**
 * Derives the product-level availability status from its variants, per the invariant
 * documented on `AvailabilitySnapshot` in `product-master.ts`. "in-stock" if any variant is
 * in-stock; "out-of-stock" only if every variant is out-of-stock; "unknown" otherwise (e.g.
 * a mix of "unknown" and "out-of-stock" — deliberately not optimistic-defaulted to
 * "out-of-stock" just because nothing is confirmed in-stock).
 */
export function deriveAvailabilityStatus(
  variants: { availability: { status: "in-stock" | "out-of-stock" | "unknown" } }[]
): "in-stock" | "out-of-stock" | "unknown" {
  if (variants.some((v) => v.availability.status === "in-stock")) return "in-stock";
  if (variants.every((v) => v.availability.status === "out-of-stock")) return "out-of-stock";
  return "unknown";
}

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
    // Phase 2.6 — null means "not yet known" (an admitted draft), not "invalid". A non-null
    // value must still resolve to a real record — never a dangling reference, draft or not.
    if (p.brandId !== null && !brandSet.has(p.brandId)) {
      throw new Error(`${p.internalId} references unknown brandId: ${p.brandId}`);
    }
    if (p.familyId !== null && !familySet.has(p.familyId)) {
      throw new Error(`${p.internalId} references unknown familyId: ${p.familyId}`);
    }
    if (p.categoryId !== null && !categorySet.has(p.categoryId)) {
      throw new Error(`${p.internalId} references unknown categoryId: ${p.categoryId}`);
    }

    // Publication readiness — a "published" record is customer-visible and must be
    // commerce/content-complete, not merely admitted. Enforced HERE, inside the same registry
    // validator every ProductMaster list must already run through, so a caller cannot
    // accidentally publish an incomplete draft by forgetting to call a separate readiness
    // helper.
    //
    // Phase 2.6 revision: only fields that are UNIVERSALLY applicable regardless of product
    // type are enforced here.
    //   - brandId, categoryId: every real product has a maker and belongs to some category —
    //     universal in principle. The current taxonomy DATA is incomplete for non-vape-device
    //     brands/categories (e.g. no "Marbo" brand, no "e-liquid" category exist yet), which is
    //     a data-population gap, not a conceptual mismatch — an e-liquid product genuinely CAN
    //     get a correct brandId/categoryId once those records are added (out of scope this
    //     phase: no taxonomy expansion). Until then it correctly stays unpublishable, which is
    //     the honest outcome, not a false block.
    //   - tagline, shortDescription: generic marketing copy, applicable to any product type.
    //   - familyId: deliberately NOT required — see its type-level doc comment (display/filter
    //     convenience only, confirmed by real frontend usage, never load-bearing).
    //   - sellingPrice, priceApprovedByOwner (added — production-readiness audit): every real
    //     product needs a real, owner-approved selling price to be sold — universal, not
    //     device-specific, unlike systemType/attributes below. This was a genuine gap: nothing
    //     previously stopped a record from reaching `publicationStatus: "published"` with
    //     `sellingPrice: null`, which would silently violate
    //     docs/BUSINESS_SOURCE_OF_TRUTH.md §5 ("Owner approval is the final gate for
    //     selling-price changes... Do NOT automatically assume Shipnity price is the website
    //     selling price"). `priceReference` (the Shipnity/vapenow reference value) is
    //     deliberately NOT sufficient on its own — it must never be treated as an implicit
    //     stand-in for an approved price, which is exactly what allowing it to satisfy
    //     readiness would do.
    // systemType and attributes are DEFERRED, not enforced here: SystemType is a closed enum
    // designed for vape devices (open-pod/pod-kit/disposable/pod-cartridge/coil/accessory) with
    // no value that correctly describes an e-liquid or IQOS product — there is no correct
    // answer to assign, not merely a missing data record, so forcing it would fabricate a
    // classification. `attributes` is entirely device-shaped (screenType/drawStyle/portability/
    // chargingType) and is meaningless for an e-liquid bottle. Expressing "required, but only
    // for device-type products" needs some notion of per-category attribute schemas that
    // ProductMaster does not have yet (deliberately not built this phase — see Phase 2.6
    // report: "do not redesign ProductMaster into a giant polymorphic schema"). Until that
    // exists, requiring systemType/attributes universally would either fabricate data for
    // non-device products or block them from ever publishing — both wrong. Real category-
    // specific readiness for these two fields is a deferred future phase, not implemented here.
    if (p.publicationStatus === "published") {
      const missingForReadiness: string[] = [];
      if (p.brandId === null) missingForReadiness.push("brandId");
      if (p.categoryId === null) missingForReadiness.push("categoryId");
      if (p.tagline === null) missingForReadiness.push("tagline");
      if (p.shortDescription === null) missingForReadiness.push("shortDescription");
      if (p.pricing.sellingPrice === null) missingForReadiness.push("pricing.sellingPrice");
      if (!p.pricing.priceApprovedByOwner) missingForReadiness.push("pricing.priceApprovedByOwner");
      if (missingForReadiness.length > 0) {
        throw new Error(
          `${p.internalId} is publicationStatus:"published" but missing required readiness field(s): ${missingForReadiness.join(", ")} — these may be null while lifecycleStatus/publicationStatus reflect a draft, but never on a published record`
        );
      }
    }

    // An "draft" lifecycle product is, by definition, not a finalized merchandising decision —
    // publishing it would be an internally inconsistent state (unlike e.g. "discontinued" +
    // "published", which is a real, intentional combination per the stock-page-preservation
    // rule in docs/BUSINESS_SOURCE_OF_TRUTH.md §6). No prior committed code enforced this; it
    // is a genuine gap, not a duplicate of an existing rule.
    if (p.lifecycleStatus === "draft" && p.publicationStatus === "published") {
      throw new Error(
        `${p.internalId} has lifecycleStatus:"draft" but publicationStatus:"published" — a draft merchandising decision cannot be customer-visible`
      );
    }

    if (p.variants.length > 0) {
      const derived = deriveAvailabilityStatus(p.variants);
      if (p.availability.status !== derived) {
        throw new Error(
          `${p.internalId} has variants but product.availability.status ("${p.availability.status}") does not match the derived value ("${derived}") from variants[].availability — product-level availability must be derived, not independently maintained, once variants exist`
        );
      }
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
