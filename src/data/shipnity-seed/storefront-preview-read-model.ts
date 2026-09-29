/**
 * OKami24 — ProductMaster → storefront read model.
 *
 * The ONLY file in `shipnity-seed/` meant to be imported by app/frontend code — every other
 * file here is explicitly data/pipeline-only (see README.md). This is a thin, one-way VIEW
 * MODEL: it reads `ProductMasterInput` and exposes only the fields the storefront can present
 * without fabrication. It does not reuse the legacy `Product` type (see Phase 2.8 report
 * §FRONTEND CONSUMER FRICTION — `ProductCard`/`DeviceGlyph` unconditionally read
 * `product.attributes.*`, which is `null` for every Shipnity-sourced draft; forcing them to
 * accept these records would mean inventing screenType/puffCount/batteryMah out of nothing).
 *
 * Two independent entry points share the one `toView()` mapper below — this is the
 * "consolidate duplicated publication filtering" move from the publication-pipeline audit,
 * replacing what would otherwise be two near-identical mapping functions:
 *
 * - `buildStorefrontPreview()` — the DEV-only preview pool. Scoped to `PREVIEW_SHIPNITY_IDS`, a
 *   deliberately hardcoded review whitelist (not "every ready candidate") — see that constant's
 *   own comment for the batch history. Gated to non-production entirely by `storefront-bridge.ts`.
 * - `buildPublishedCatalog()` — the REAL, environment-independent publication pool. Scoped to
 *   `product.publicationStatus === "published"` — which only `publication-approvals.ts` can ever
 *   set (see that file). Re-validates every published candidate through the full
 *   `validateProductMasterRegistry` readiness gate before returning anything — an approval-table
 *   entry alone is necessary but not sufficient; a genuinely incomplete "published" record fails
 *   loudly here rather than leaking. NOT gated by NODE_ENV: safety here comes from the approval
 *   table being genuinely curated (today, empty), not from an environment check — a single,
 *   auditable, version-controlled source of truth instead of "did every consumer remember to gate
 *   itself."
 *
 * A product is only included in either pool if every field its own view needs is genuinely
 * non-null; anything else is left out rather than rendered with an invented placeholder.
 */

import { brands, getBrand } from "@/data/brands";
import { isListedSoldOut } from "@/data/stock/apply-sold-out";
import { categories, getCategory } from "@/data/categories";
import { families } from "@/data/families";
import { validateProductMasterRegistry, type ProductMasterInput } from "@/data/product-master-schema";
import type { AvailabilityStatus } from "@/types/product-master";
import { projectActiveCatalog, getNeutralVariantFallback } from "./active-catalog-to-product-master";

/** The Phase 2.7 + 3.4 + 3.5 minimum-enriched batch. Deliberately hardcoded, not "every ready
 *  candidate" — this preview is scoped to exactly what was reviewed and approved, not whatever
 *  the pipeline happens to produce next. Phase 3.4 added 5 IDs after Coil-92 (existing voopoo/
 *  uwell brands only). Phase 3.5 added 16 more across five waves, including 8 new Brand records
 *  (rincoe, dotmod, esko-bar, ske, kardinal-stick, instabar, nevoks, infy) added on real,
 *  WebFetch/WebSearch-verified official-source evidence — see that phase's TAXONOMY_MATCHES
 *  comments for the citation trail. Wave 4 is the pilot's first E-LIQUID products (ELIQUID-1,
 *  Eliquid-109, eliquid-133) — resolves to the existing `salthub` brand, no new Brand record;
 *  `categoryId: "e-liquid"` is the pilot's first non-device category (see categories.ts's own
 *  comment for why `systemType` stays null for these, by design, not a gap). Wave 5
 *  (coil-54/coil-62/Pod-169) resolves "Feelin" to NEVOKS and "infy" to INFY, both official
 *  first-party sources. Pod-147 resolved as an exact-legacy-match to `m-switch-pod`, not a new
 *  preview candidate. Several other candidates (Muro/Nexbar/Vazer/MOOOD/BAAM/Dooze/Pepo/Dundu/
 *  Reswa/Foli Bar/Pop Up-branded parents) were investigated and deliberately deferred — no
 *  verifiable official first-party source for a real Brand record — see the Phase 3.5 report (and
 *  this session's report for a fresh, still-negative re-check of Muro/Vape Maker, Foli Bar,
 *  Reswa, and Nexbar specifically — Nexbar in particular has a real naming-collision risk with
 *  Wotofo's own, unrelated "nexBar" product, so leave it deferred rather than guess). Also
 *  investigated and correctly NOT added: Pod-168/Pod-177/Pod-179 (Caliburn G4 Pro / Vmate i3 /
 *  Argus G4) — real, well-known flagship devices, but each already exists in the legacy catalog
 *  (`caliburn-g4-pro`/`vmate-i3`/`argus-g4`); `projectActiveCatalog()`'s own dedup check already
 *  catches these (`status: "blocked", reason: "identity-matches-existing-legacy-product"`), so
 *  adding them here would only create duplicate identity/content. Wave 6 resolves Coil-55
 *  ("หัวแทงค์ Caliburn G2") — deferred since Phase 3.4 as a possible Coil-53 duplicate — as a
 *  genuinely distinct real product (the empty pod, not the coil); see
 *  `TAXONOMY_MATCHES["Coil-55"]`'s comment. This session ALSO resolved the previously "genuinely
 *  ambiguous" Marbo↔Salthub relationship with real official evidence: Marbo IS Salthub's
 *  pre-rebrand name (salthub.com's own backend still carries "Marbo-LOGO" files, and its current
 *  lineup is exactly "M Bar series 9K/10K/15K" and "ZERO PRO") — but all three device-Marbo
 *  Shipnity records (Disposable-25 "Marbo Bar 9K", Pod-178 "Marbo Zero Pro", Pod-85 "หัวพอต Marbo
 *  Zero") turned out to be exact duplicates of already-existing legacy products (`m-bar-9k`,
 *  `zero-pro`, `zero-cartridge` respectively) — correctly NOT added, same dedup mechanism as
 *  Pod-168/177/179 above (Disposable-25 was initially miscategorized as new before a direct
 *  grep of every legacy `id: "m-bar-*"` caught the match — see
 *  `TAXONOMY_MATCHES["Disposable-25"/"Pod-178"/"Pod-85"]`'s comments. */
export const PREVIEW_SHIPNITY_IDS = [
  "Coil-53", "Coil-55", "Coil-56", "Coil-74", "Coil-87", "Coil-92",
  "Coil-1", "Coil-21", "Coil-72", "Coil-83", "Coil-94",
  "Coil-38", "Coil-63", "Coil-68", "Coil-70", "Coil-89",
  "Pod-159", "Pod-149", "Pod-150", "Disposable-34",
  "ELIQUID-1", "Eliquid-109", "eliquid-133",
  "coil-54", "coil-62", "Pod-169",
  // Pod-180 = nexBar CLEAR 18K, brandless (owner ruling 2026-09-29) — see TAXONOMY_MATCHES["Pod-180"].
  "Pod-180",
  // Heated-tobacco wave — full identity/taxonomy/media/spec/price treatment (owner has settled
  // the business/legal-scope question for this category). IQOSHEET-17 included for DEV-review
  // visibility despite staying unpublished — see publication-approvals.ts for why.
  "IQOSHEET-14", "IQOSHEET-15", "IQOSHEET-16", "IQOSHEET-17", "IQOSHEET-18",
];

export interface StorefrontVariantView {
  id: string;
  label: string;
  /** Set only when a real, verified per-variant photo exists (see VERIFIED_VARIANT_MEDIA in the
   *  projection adapter) — undefined for every variant still relying on the product-level card
   *  image, never a placeholder standing in for a real one. */
  image?: StorefrontProductImageView;
  /** Commerce foundation (2026-09-02) — straight from `ProductVariant.availability.status`,
   *  which `validateProductMasterRegistry` already guarantees is consistent with the product-
   *  level `availability` below (see AVAILABILITY_INVARIANT_NOTE in product-master.ts). Added so
   *  the cart/checkout stock-validation step can reject a specific out-of-stock variant even when
   *  the product as a whole still has other in-stock variants. */
  availabilityStatus: AvailabilityStatus;
}

/** Which dev-preview fallback illustration applies — derived from `systemType`, itself
 *  corrected in Phase 2.8 from real official-manufacturer evidence (see
 *  TAXONOMY_MATCHES in the projection adapter). "generic" covers any systemType this small
 *  preview batch doesn't have a dedicated shape for yet — never guessed. */
export type PreviewGlyphKind = "coil" | "pod-cartridge" | "generic";

function glyphKindFor(systemType: string | null): PreviewGlyphKind {
  if (systemType === "coil") return "coil";
  if (systemType === "pod-cartridge") return "pod-cartridge";
  return "generic";
}

export interface StorefrontProductImageView {
  src: string;
  alt: string;
}

/** A single manufacturer-fact line — key/label/value only, matching `Specification` in
 *  `src/types/catalog.ts`. `sourceStatus` is always `"verified"` for what this preview exposes
 *  (see VERIFIED_SPECIFICATIONS in the projection adapter — an unverified fact is never added in
 *  the first place, so there is nothing to filter here yet; kept as a real field, not hardcoded,
 *  so a future unverified entry renders honestly rather than silently). */
export interface StorefrontSpecificationView {
  key: string;
  label: string;
  value: string;
  sourceStatus: "verified" | "unverified";
}

export interface StorefrontProductView {
  slug: string;
  shipnityProductId: string;
  displayName: string;
  tagline: string;
  /** Real ProductMaster brandId/categoryId (e.g. "voopoo", "pods-cartridges") — kept alongside
   *  the display names so Phase 3.0's storefront bridge can filter by category/brand the same
   *  way the legacy catalog does, without re-deriving them from the display strings. */
  /** null = a brandless product (owner ruling, `ProductMasterInput.brandless`) — nothing is shown where a brand would be. */
  brandId: string | null;
  brandName: string | null;
  categoryId: string;
  categoryName: string;
  systemType: string | null;
  glyphKind: PreviewGlyphKind;
  /** Phase 2.9 — set only when a verified official-manufacturer photo exists (see
   *  VERIFIED_MEDIA in the projection adapter). `null` for every product still relying on the
   *  DEV fallback glyph — never a placeholder image standing in for a real one. */
  image: StorefrontProductImageView | null;
  /** Shown on Product Detail ONLY when the customer has selected a specific variant that has no
   *  dedicated photo of its own (see NEUTRAL_VARIANT_FALLBACK in the projection adapter) —
   *  deliberately separate from `image` above, which stays the catalog/OG/grid representative
   *  shot. Prevents an unrelated named variant's photo from reading as "this is what you picked."
   *  `undefined` for every product that doesn't need one (either no variant media at all, or
   *  every variant already has its own real photo). */
  variantFallbackImage?: StorefrontProductImageView;
  isFlagship: boolean;
  publicationStatus: "published" | "unpublished";
  /** The real, owner-approved final selling price — only ever non-null when this record is
   *  genuinely `publicationStatus: "published"` (see publication-approvals.ts). This is what a
   *  customer actually pays; never confuse it with `priceReferenceValue` below. */
  sellingPrice: number | null;
  /** Shipnity's own operational selling price — a reference value, never the confirmed final
   *  website price. See README §Price. */
  priceReferenceValue: number | null;
  priceReferenceSource: string | null;
  /** Pre-baked Thai label (from AXIS_LABEL_TH in the projection adapter) — kept only as a
   *  fallback for an unrecognized axis code. Real consumers should translate `optionAxisCode`
   *  through the active locale's dictionary instead (see Phase 3.2.1 report §LANGUAGE FIX
   *  RESULT — this label used to render unconditionally regardless of locale, a real bug). */
  optionAxisLabel: string | null;
  /** Raw axis type ("color"/"flavor"/"resistance"/"size"/"strength") — the machine-readable key
   *  behind `optionAxisLabel`, straight from `optionDefinitions[0].code`. */
  optionAxisCode: string | null;
  variants: StorefrontVariantView[];
  /** Commerce foundation (2026-09-02) — the product-level `AvailabilityStatus`, which is either
   *  the sole stock signal (zero-variant products) or a value already validated to agree with
   *  `variants[].availabilityStatus` (see AVAILABILITY_INVARIANT_NOTE). This is the only stock
   *  signal this codebase has today — a boolean/tri-state snapshot from the seed data, not a
   *  live quantity — see docs/BUSINESS_SOURCE_OF_TRUTH.md §19 ("Shipnity integration mechanism"
   *  is TBD). Checkout must treat this as authoritative pending a real Shipnity API. */
  availabilityStatus: AvailabilityStatus;
  /** Manufacturer facts only (see VERIFIED_SPECIFICATIONS) — never OKami24 editorial or merchant
   *  knowledge, which stay separate fields for exactly this reason. Empty for every product this
   *  hasn't been researched for yet — absence, not a placeholder. */
  specifications: StorefrontSpecificationView[];
  /** Official sources this product's copy/specifications were verified against — shown so a
   *  customer (or future reviewer) can check provenance themselves. */
  sourceUrls: string[];
  /** A real OKami24-channel review video — see `Product.reviewVideo` in `catalog.ts` for the full
   *  rationale. Absent unless one was specifically confirmed for this exact product. */
  reviewVideo?: { videoId: string; title: string; channelName: string; publishedAt: string };
}

function toView(product: ProductMasterInput): StorefrontProductView | null {
  // Only render what readiness actually guaranteed non-null — never substitute a placeholder
  // string for a field that's genuinely absent on this record.
  if (!(product.brandId || product.brandless) || !product.categoryId || !product.tagline) return null;
  const brand = product.brandId ? getBrand(product.brandId) : null;
  const category = getCategory(product.categoryId);
  if ((product.brandId && !brand) || !category) return null; // a dangling FK here would mean a real upstream bug

  const axis = product.optionDefinitions[0];
  const valueLabelByCode = new Map(axis?.allowedValues.map((v) => [v.code, v.label] as const) ?? []);
  const cardAsset = product.assets.find((a) => a.role === "card" && a.kind === "official-photo");
  const neutralFallback = getNeutralVariantFallback(product.commerce.integrationRef?.externalId ?? product.internalId);

  return {
    slug: product.slug,
    shipnityProductId: product.commerce.integrationRef?.externalId ?? product.internalId,
    displayName: product.displayName,
    tagline: product.tagline,
    brandId: product.brandId,
    brandName: brand?.name ?? null,
    categoryId: product.categoryId,
    categoryName: category.name,
    systemType: product.systemType,
    glyphKind: glyphKindFor(product.systemType),
    image: cardAsset ? { src: cardAsset.src, alt: cardAsset.alt } : null,
    variantFallbackImage: neutralFallback ? { src: neutralFallback.src, alt: neutralFallback.alt } : undefined,
    isFlagship: product.isFlagship,
    publicationStatus: product.publicationStatus,
    sellingPrice: product.pricing.sellingPrice,
    priceReferenceValue: product.pricing.priceReference?.value ?? null,
    priceReferenceSource: product.pricing.priceReference?.source ?? null,
    optionAxisLabel: axis?.label ?? null,
    optionAxisCode: axis?.code ?? null,
    availabilityStatus: product.availability.status,
    variants: product.variants.map((v) => {
      const selection = v.optionSelections[0];
      const label = selection ? (valueLabelByCode.get(selection.valueCode) ?? selection.valueCode) : v.id;
      return {
        id: v.id,
        label,
        image: v.image ? { src: v.image.src, alt: v.image.alt } : undefined,
        // Owner's sold-out list (src/data/stock/sold-out.ts) can only ever force a variant OUT of
        // stock; a Shipnity "unknown"/"out-of-stock" is never promoted by it.
        availabilityStatus: isListedSoldOut(product.slug, label, v.id) ? "out-of-stock" : v.availability.status,
      };
    }),
    specifications: product.specifications,
    sourceUrls: product.sourceUrls,
    reviewVideo: product.reviewVideo,
  };
}

export function buildStorefrontPreview(): StorefrontProductView[] {
  const results = projectActiveCatalog();
  const views: StorefrontProductView[] = [];
  for (const r of results) {
    if (r.status !== "candidate") continue;
    if (!PREVIEW_SHIPNITY_IDS.includes(r.shipnityProductId)) continue;
    const view = toView(r.product);
    if (view) views.push(view);
  }
  return views;
}

export function getStorefrontPreviewBySlug(slug: string): StorefrontProductView | undefined {
  return buildStorefrontPreview().find((v) => v.slug === slug);
}

/**
 * The real, environment-independent publication pool — see this file's header comment. Takes
 * candidates directly (rather than calling `projectActiveCatalog()` itself) so contract tests can
 * exercise the real readiness-enforcement/mapping logic with synthetic fixtures, the same
 * convention `product-master-contract-test.ts` already uses, without needing a genuine owner
 * approval to exist. `buildPublishedCatalog()` below is the real entry point the app actually
 * calls.
 *
 * Throws (does not silently filter) if any `publicationStatus: "published"` candidate fails the
 * full registry validation — "fail the build, not the page," the same philosophy
 * `validateProductMasterRegistry` already uses for every other invariant it checks. An
 * `OWNER_APPROVED_PUBLICATION` entry is necessary but never sufficient on its own.
 */
export function buildPublishedCatalogFrom(candidates: ProductMasterInput[]): StorefrontProductView[] {
  const published = candidates.filter((p) => p.publicationStatus === "published");
  if (published.length === 0) return [];

  validateProductMasterRegistry({
    products: published,
    brandIds: brands.map((b) => b.id),
    familyIds: families.map((f) => f.id),
    categoryIds: categories.map((c) => c.id),
    faqEntryIds: [],
  });

  const views: StorefrontProductView[] = [];
  for (const product of published) {
    const view = toView(product);
    if (view) views.push(view);
  }
  return views;
}

export function buildPublishedCatalog(): StorefrontProductView[] {
  const results = projectActiveCatalog();
  const candidates = results.filter((r) => r.status === "candidate").map((r) => r.product);
  return buildPublishedCatalogFrom(candidates);
}

export function getPublishedProductBySlug(slug: string): StorefrontProductView | undefined {
  return buildPublishedCatalog().find((v) => v.slug === slug);
}
