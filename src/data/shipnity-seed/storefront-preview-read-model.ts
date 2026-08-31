/**
 * OKami24 — Phase 2.8: ProductMaster → storefront read model.
 *
 * The ONLY file in `shipnity-seed/` meant to be imported by app/frontend code — every other
 * file here is explicitly data/pipeline-only (see README.md). This is a thin, one-way VIEW
 * MODEL: it reads `ProductMasterInput` and exposes only the fields the isolated preview route
 * can present without fabrication. It does not reuse the legacy `Product` type (see Phase 2.8
 * report §FRONTEND CONSUMER FRICTION — `ProductCard`/`DeviceGlyph` unconditionally read
 * `product.attributes.*`, which is `null` for every Shipnity-sourced draft; forcing them to
 * accept these records would mean inventing screenType/puffCount/batteryMah out of nothing).
 *
 * Scoped to the Phase 2.7 + 3.4 + 3.5 minimum-enriched candidates only (15 total, as of Phase
 * 3.5) — not all 53 drafts. A product is only included if every field this view needs is
 * genuinely non-null; anything else is left out rather than rendered with an invented
 * placeholder.
 *
 * Phase 3.0 adds a second consumer: `storefront-bridge.ts` wraps `buildStorefrontPreview()` with
 * a dev-only environment gate and pipes the same views into the main storefront's category/brand/
 * detail pages. This file itself stays environment-agnostic — the gate lives at the bridge
 * boundary, not here, so this remains a pure, reusable data→view mapping.
 */

import { getBrand } from "@/data/brands";
import { getCategory } from "@/data/categories";
import type { ProductMasterInput } from "@/data/product-master-schema";
import { projectActiveCatalog } from "./active-catalog-to-product-master";

/** The Phase 2.7 + 3.4 + 3.5 minimum-enriched batch. Deliberately hardcoded, not "every ready
 *  candidate" — this preview is scoped to exactly what was reviewed and approved, not whatever
 *  the pipeline happens to produce next. Phase 3.4 added 5 IDs after Coil-92 (existing voopoo/
 *  uwell brands only). Phase 3.5 added 10 more across three waves, including 6 new Brand records
 *  (rincoe, dotmod, esko-bar, ske, kardinal-stick, instabar) added on real, WebFetch/WebSearch-
 *  verified official-source evidence — see that phase's TAXONOMY_MATCHES comments for the
 *  citation trail. Coil-55 stays deferred (see MINIMUM_COPY's comment); Pod-147 resolved as an
 *  exact-legacy-match to `m-switch-pod`, not a new preview candidate. Several other candidates
 *  (Muro/Marbo/Nexbar/Vazer/MOOOD-branded parents) were investigated and deliberately deferred —
 *  no verifiable official first-party source for a real Brand record (or, for Marbo, a genuinely
 *  ambiguous relationship to the existing salthub brand) — see the Phase 3.5 report. */
const PREVIEW_SHIPNITY_IDS = [
  "Coil-53", "Coil-56", "Coil-74", "Coil-87", "Coil-92",
  "Coil-1", "Coil-21", "Coil-72", "Coil-83", "Coil-94",
  "Coil-38", "Coil-63", "Coil-68", "Coil-70", "Coil-89",
  "Pod-159", "Pod-149", "Pod-150", "Disposable-34",
];

export interface StorefrontVariantView {
  id: string;
  label: string;
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

export interface StorefrontProductView {
  slug: string;
  shipnityProductId: string;
  displayName: string;
  tagline: string;
  /** Real ProductMaster brandId/categoryId (e.g. "voopoo", "pods-cartridges") — kept alongside
   *  the display names so Phase 3.0's storefront bridge can filter by category/brand the same
   *  way the legacy catalog does, without re-deriving them from the display strings. */
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryName: string;
  systemType: string | null;
  glyphKind: PreviewGlyphKind;
  /** Phase 2.9 — set only when a verified official-manufacturer photo exists (see
   *  VERIFIED_MEDIA in the projection adapter). `null` for every product still relying on the
   *  DEV fallback glyph — never a placeholder image standing in for a real one. */
  image: StorefrontProductImageView | null;
  isFlagship: boolean;
  publicationStatus: "published" | "unpublished";
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
}

function toView(product: ProductMasterInput): StorefrontProductView | null {
  // Only render what readiness actually guaranteed non-null — never substitute a placeholder
  // string for a field that's genuinely absent on this record.
  if (!product.brandId || !product.categoryId || !product.tagline) return null;
  const brand = getBrand(product.brandId);
  const category = getCategory(product.categoryId);
  if (!brand || !category) return null; // a dangling FK here would mean a real upstream bug

  const axis = product.optionDefinitions[0];
  const valueLabelByCode = new Map(axis?.allowedValues.map((v) => [v.code, v.label] as const) ?? []);
  const cardAsset = product.assets.find((a) => a.role === "card" && a.kind === "official-photo");

  return {
    slug: product.slug,
    shipnityProductId: product.commerce.integrationRef?.externalId ?? product.internalId,
    displayName: product.displayName,
    tagline: product.tagline,
    brandId: product.brandId,
    brandName: brand.name,
    categoryId: product.categoryId,
    categoryName: category.name,
    systemType: product.systemType,
    glyphKind: glyphKindFor(product.systemType),
    image: cardAsset ? { src: cardAsset.src, alt: cardAsset.alt } : null,
    isFlagship: product.isFlagship,
    publicationStatus: product.publicationStatus,
    priceReferenceValue: product.pricing.priceReference?.value ?? null,
    priceReferenceSource: product.pricing.priceReference?.source ?? null,
    optionAxisLabel: axis?.label ?? null,
    optionAxisCode: axis?.code ?? null,
    variants: product.variants.map((v) => {
      const selection = v.optionSelections[0];
      const label = selection ? (valueLabelByCode.get(selection.valueCode) ?? selection.valueCode) : v.id;
      return { id: v.id, label };
    }),
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
