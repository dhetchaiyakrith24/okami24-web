/**
 * OKami24 Product Master — Phase 1 (type definitions), calibrated in Phase 2.1 against the
 * results of running all 28 real legacy products through this schema (see
 * `product-master-adapter.ts`'s reality test). Fields that 100% of real data couldn't
 * populate meaningfully were revised here rather than left forcing fabricated defaults.
 *
 * This is a NEW, additive data model. It does not replace `src/types/catalog.ts` or the
 * 28 existing products — those keep powering the live site unchanged. This file exists so
 * the shape can be reviewed before any adapter/migration work begins (see the approved
 * architecture plan for the full audit, rationale, and phased migration strategy).
 *
 * Design principles baked into this shape (see plan for full reasoning):
 * - Extend, don't replace: `Specification`, `Feature`, `ProductAsset`, and the
 *   `SystemType`/`DrawStyle`/`ScreenType`/`Portability` unions are reused as-is from
 *   `catalog.ts` — they're proven patterns, not being redesigned.
 * - Source-tracking uses 3 tiers, separated by *object grouping* rather than a per-field
 *   wrapper (to avoid turning every new product entry into a research chore):
 *     1. Manufacturer/product facts — `attributes`, `specifications` (per-entry
 *        `sourceStatus`, unchanged), `features`, `assets`.
 *     2. General editorial content OKami24 writes but isn't subjective opinion —
 *        `editorialContent`.
 *     3. OKami24's own subjective merchant knowledge — `merchantContent`, `merchantTags`
 *        (always tagged `source: "merchant-knowledge"`). Never presented as manufacturer fact.
 * - `pricing` and `publicationStatus` are fully independent — a product can be published
 *   with `sellingPrice: null`, and `priceApprovedByOwner` gates treating a price as final /
 *   commerce-ready, not whether the page is visible.
 * - Product-level `availability` is the sole source of truth when there are no variants; the
 *   moment `variants` is non-empty, product-level `availability` must be *derived* from
 *   variant availability (Phase 2 concern) rather than maintained as a second, possibly
 *   conflicting truth.
 * - `IntegrationRef` (how we're connected to an external system, e.g. Shipnity) is a
 *   separate concept from `AvailabilitySnapshot` (what stock value was last observed,
 *   regardless of how) — the two must never be conflated into one shape.
 */

import type {
  DrawStyle,
  Feature,
  Portability,
  ProductAsset,
  ScreenType,
  Specification,
  SystemType,
} from "./catalog";

// ===================================================================================
// Option system — replaces a raw `Record<string, string>` variant model so that option
// naming can't drift ("color" vs "Color" vs "colour") and so admin tooling / filters have
// something concrete to validate against and render a picker from.
// ===================================================================================

export interface ProductOptionValue {
  /** Stable key, e.g. "mystic-forest", "0-4-ohm". Referenced by variants, never shown raw. */
  code: string;
  /** Display label, e.g. "Mystic Forest", "0.4Ω". */
  label: string;
}

export interface ProductOptionDefinition {
  /** Namespace for this option dimension, e.g. "color", "resistance", "flavor". */
  code: string;
  /** Display label for the option itself, e.g. "สี". */
  label: string;
  allowedValues: ProductOptionValue[];
}

export interface ProductVariant {
  id: string;
  parentInternalId: string;
  /**
   * Every entry's `optionCode` must exist in the parent product's `optionDefinitions`, and
   * every `valueCode` must exist in that option's `allowedValues` — enforced by the
   * load-time validation layer (see plan), not just Zod shape-checking.
   */
  optionSelections: { optionCode: string; valueCode: string }[];
  /** Nullable while legacy/migrated products don't have a canonical SKU assigned yet. */
  sku: string | null;
  /**
   * Shipnity's own identifier for this specific variant (e.g. child code `Pod-179-1`),
   * kept separate from `sku` for the same reason `commerce.integrationRef` is separate from
   * `commerce.internalSku` at the product level — an external system's opaque reference must
   * never be conflated with OKami24's own commerce SKU. Optional: no legacy/migrated product
   * has variants yet, so there is nothing to reference until real variant-bearing data exists.
   */
  integrationRef?: IntegrationRef;
  image?: ProductAsset;
  /**
   * Optional per-variant price override. Absent = inherit `ProductMaster.pricing`. Only set
   * this on variants whose price genuinely differs — never require every variant to carry
   * its own price. No pricing engine is implemented by this schema; this is storage only.
   */
  pricingOverride?: {
    sellingPrice?: number;
    compareAtPrice?: number;
  };
  availability: AvailabilitySnapshot;
}

// ===================================================================================
// Lifecycle vs. availability — deliberately two different concepts. Lifecycle answers
// "where is this product in its life at OKami24" (a merchandising/catalog decision);
// availability answers "do we currently have stock" (an operational fact). Conflating them
// (e.g. treating "discontinued" as a stock status) makes it impossible to represent a
// discontinued-but-still-informationally-useful product page.
// ===================================================================================

/**
 * KNOWN LIMITATION (Phase 2.1): all 28 legacy products map to "active" — none of them can
 * exercise "draft" / "coming-soon" / "discontinued" / "archived". This union is a deliberate
 * design decision (see plan), not something the current data has pressure-tested. Do not
 * redesign it just because legacy data can't exercise it; a synthetic contract test isn't
 * warranted here either since there's no invariant to violate (it's a plain enum with no
 * cross-field relationship to check) — the real test is future non-active real inventory.
 */
export type ProductLifecycleStatus = "draft" | "active" | "coming-soon" | "discontinued" | "archived";

export type AvailabilityStatus = "in-stock" | "out-of-stock" | "unknown";

export interface AvailabilitySnapshot {
  status: AvailabilityStatus;
  /** Where this specific snapshot value came from — not necessarily tied to `IntegrationRef`. */
  source: "shipnity" | "manual" | "unknown";
  /** When this value was last observed to be true. Null if never recorded. */
  observedAt: string | null;
}

/**
 * INVARIANT — now enforced, not just documented (Phase 2.1):
 * - If `ProductMaster.variants` is empty, `ProductMaster.availability` is the sole,
 *   authoritative value.
 * - If `ProductMaster.variants` is non-empty, `ProductMaster.availability` MUST be derived
 *   from `variants[].availability` (e.g. "in-stock" if at least one variant is in-stock,
 *   "out-of-stock" if every variant is out-of-stock) — it must never be hand-maintained as
 *   an independent second source of truth that could disagree with the variants.
 * See `deriveAvailabilityStatus()` and the check inside `validateProductMasterRegistry()` in
 * `src/data/product-master-schema.ts` for the executable version of this rule, and
 * `src/data/product-master-contract-test.ts` for synthetic fixtures that exercise both the
 * pass and fail case (KNOWN LIMITATION: none of the 28 real legacy products have variants at
 * all, so this invariant is untested by real data — only by synthetic fixtures — until a
 * real variant-bearing product exists).
 */
export const AVAILABILITY_INVARIANT_NOTE =
  "product.availability must equal derive(variants[].availability) whenever variants is non-empty";

// ===================================================================================
// Integration reference — "what external system are we wired to, and how healthy is that
// connection" — kept separate from AvailabilitySnapshot ("what value did we last see").
// Deliberately opaque: the Shipnity integration mechanism is still TBD, so this must not
// assume any particular API shape.
// ===================================================================================

export interface IntegrationRef {
  /** Union left open for future providers; only "shipnity" exists today. */
  provider: "shipnity";
  /** Shipnity's own product/SKU identifier — treated as an opaque string. */
  externalId: string;
  lastSyncedAt: string | null;
  syncStatus: "ok" | "stale" | "error" | "never-synced";
}

// ===================================================================================
// FAQ pool — a single global entity so global/category/product-scoped questions all live
// in one place and a product only ever stores a reference, never a duplicated answer.
// ===================================================================================

export interface FAQEntry {
  id: string;
  question: string;
  answer: string;
  scope: "global" | "category" | "product";
  /** Set when scope === "category". */
  categoryId?: string;
  source: "editorial";
}

// ===================================================================================
// Structured relationships — compatibility and cross-sell both gain an optional real
// product reference (`targetInternalId`) instead of being free text only. The `label`/
// `note` fallback stays so a relationship can still be recorded before a structured target
// exists — never invent a `targetInternalId` just to fill the field.
// ===================================================================================

export interface CompatibilityLink {
  type: "pod" | "coil" | "cartridge" | "accessory" | "eliquid-category" | "charging";
  /** FK to another ProductMaster.internalId, when a real linkable product exists. */
  targetInternalId?: string;
  /** Fallback display text, used whenever there's no structured target yet. */
  label: string;
  note?: string;
  /**
   * Tri-state, not a boolean (Phase 2.1 revision — a required boolean was semantically wrong:
   * the adapter reality test showed 100% of legacy compatibility entries have no per-entry
   * provenance to derive true/false from, so every one of them would have had to default to
   * the same fabricated value). "unknown" is the honest state for data with no provenance —
   * it must never be silently coerced to "unverified" or "verified".
   */
  verificationStatus: "verified" | "unverified" | "unknown";
}

export interface RelatedProductLink {
  targetInternalId: string;
  /**
   * Optional (Phase 2.1 revision) — legacy `relatedProductSlugs` never recorded *why* two
   * products are related, and 100% of the 28 legacy products' related-product entries would
   * have needed a fabricated classification here. Leave absent when migrating data with no
   * real classification; require it (via stronger validation, not this base type) for
   * newly-authored structured relationships going forward.
   */
  reason?:
    | "cross-sell-pod"
    | "cross-sell-coil"
    | "cross-sell-accessory"
    | "similar-product"
    | "alternative-if-out-of-stock"
    | "editorial";
  source?: "manufacturer" | "merchant-knowledge" | "editorial";
}

// ===================================================================================
// Merchant knowledge — OKami24's own operational experience (best sellers, beginner
// picks, cautions, etc. per docs/BUSINESS_SOURCE_OF_TRUTH.md §15). Always tagged with a
// fixed `source` so it can never be mistaken for a manufacturer claim downstream.
// ===================================================================================

export interface MerchantTagRef {
  tag:
    | "best-seller"
    | "customer-favorite"
    | "beginner-friendly"
    | "higher-problem-rate"
    | "not-recommended"
    | "repeat-consumable-opportunity"
    | "underwhelming-in-practice"
    | "high-margin";
  reason?: string;
  source: "merchant-knowledge";
  recordedAt: string;
}

// ===================================================================================
// Core entity
// ===================================================================================

export interface ProductMaster {
  /** Immutable, stable identity — separate from `slug` from day one (slug may change later;
   *  no legacy id/URL migration happens in this phase, the 28 live products keep id===slug). */
  internalId: string;
  slug: string;

  lifecycleStatus: ProductLifecycleStatus;
  /** Fully independent of `pricing` — see file header. */
  publicationStatus: "published" | "unpublished";

  brandId: string;
  familyId: string;
  categoryId: string;
  systemType: SystemType;

  // ---- Manufacturer / product facts (unchanged shape from catalog.ts) ----
  name: string;
  displayName: string;
  tagline: string;
  shortDescription: string;
  attributes: {
    batteryMah?: number;
    wattageMin?: number;
    wattageMax?: number;
    puffCount?: number;
    capacityMl?: number;
    screenType: ScreenType;
    screenSize?: string;
    drawStyle: DrawStyle;
    portability: Portability;
    beginnerFriendly: boolean;
    chargingType: string;
    weightG?: number;
    dimensions?: string;
  };
  specifications: Specification[];
  features: Feature[];
  assets: ProductAsset[];
  sourceUrls: string[];

  // ---- Commerce identity ----
  commerce: {
    /** Nullable during migration — never invent a SKU just to satisfy this schema. A
     *  separate "commerce-ready" business check (not this shape) can require it later. */
    internalSku: string | null;
    supplierSku?: string;
    barcode?: string;
    integrationRef?: IntegrationRef;
  };

  // ---- Pricing (owner-gated, independent of publicationStatus — see file header) ----
  pricing: {
    sellingPrice: number | null;
    compareAtPrice?: number;
    priceReference?: { source: "vapenow" | "manual" | "shipnity"; value: number; capturedAt: string };
    lastPriceReview: string | null;
    /**
     * NOT a publish gate. Gates whether `sellingPrice` is treated as the final, ready-to-use
     * selling price / whether any commerce behavior that depends on it may activate. A
     * published product with `priceApprovedByOwner: false` still renders normally — the
     * presentation layer decides whether to show the price or a "สอบถามราคาทาง LINE" CTA
     * instead (a Phase 3 decision, not a schema constraint).
     */
    priceApprovedByOwner: boolean;
  };
  // Supplier cost is intentionally NOT a field here — if ever needed, it belongs in a
  // separate internal-only record, never in this public-facing shape.

  // ---- Variants ----
  /** Empty = this product has no variant dimensions at all. Never force color/flavor/etc. */
  optionDefinitions: ProductOptionDefinition[];
  /** Empty = no variants; product-level `availability`/`pricing` apply directly. */
  variants: ProductVariant[];

  // ---- Availability (product-level; see invariant note above) ----
  availability: AvailabilitySnapshot;

  // ---- Content, 3-tier by provenance (see file header) ----
  editorialContent: {
    longDescription?: string;
    keyHighlights?: string[];
    whatInTheBox?: string[];
    howToUse?: string;
    careTips?: string;
  };
  merchantContent: {
    /**
     * Multiple entries (Phase 2.1 revision — was a single `string`). Legacy `whoIsThisFor`
     * is a bullet list, and collapsing it into one newline-joined string was lossy (couldn't
     * be rendered back out as separate bullets without re-parsing). Maps 1:1 from legacy now.
     */
    bestFor?: string[];
    whyWeRecommend?: string;
    storeNotes?: string;
    warningNotes?: string;
    comparisonHint?: string;
  };
  merchantTags: MerchantTagRef[];

  // ---- Relationships ----
  compatibility: CompatibilityLink[];
  relatedProducts: RelatedProductLink[];
  /** References into the global `FAQEntry` pool — never an embedded/duplicated answer. */
  faqRefs: string[];

  // ---- SEO ----
  seo: {
    titleOverride?: string;
    metaDescription?: string;
    imageAlt?: string;
  };

  // ---- Editorial flags (unchanged from catalog.ts) ----
  isFlagship: boolean;
  editorialTag?: string;
}
