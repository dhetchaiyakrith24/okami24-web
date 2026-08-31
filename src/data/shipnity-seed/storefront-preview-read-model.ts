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
 * Scoped to the 5 Phase 2.7 minimum-enriched candidates only — not all 53 drafts. A product is
 * only included if every field this view needs is genuinely non-null; anything else is left out
 * rather than rendered with an invented placeholder.
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

/** The Phase 2.7 minimum-enriched batch. Deliberately hardcoded, not "every ready candidate" —
 *  this preview is scoped to exactly what was reviewed and approved, not whatever the pipeline
 *  happens to produce next. */
const PREVIEW_SHIPNITY_IDS = ["Coil-53", "Coil-56", "Coil-74", "Coil-87", "Coil-92"];

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
  optionAxisLabel: string | null;
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
