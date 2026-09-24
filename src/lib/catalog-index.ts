/**
 * OKami24 — the unified, customer-visible catalog index.
 *
 * The storefront has two data halves — the legacy `Product[]` catalog and published
 * `ProductMaster` records (`StorefrontProductView[]`) — and, by design, they do NOT share a type:
 * `ProductCard`/`DeviceGlyph`/`CompareTool` all read `product.attributes.*`, which is genuinely
 * `null` on a Shipnity-sourced record, and forcing one type onto both would mean inventing
 * screenType/batteryMah/puffCount out of nothing (see storefront-preview-read-model.ts's header).
 *
 * That split is correct for RENDERING. It is wrong for DISCOVERY: several customer tools only
 * needed "every product a customer can actually reach, with the few fields every product really
 * has," and each one had quietly hardcoded the legacy half instead — Compare's picker searched
 * `allProducts`, Finder scored `allProducts`, and the relationship table needed the same
 * resolution logic a third time. This module is that shared, honest middle layer.
 *
 * WHAT IT GUARANTEES
 * - Only CURRENTLY customer-visible products: every legacy product, plus ProductMaster records that are
 *   genuinely `publicationStatus: "published"` (via `getPublishedProducts()`, which re-validates
 *   every one through the full readiness gate). Unpublished/DEV-preview data can never appear.
 * - Every field on `CatalogItem` is one that BOTH halves genuinely have. Anything only one half
 *   has (`attributes`, `whoIsThisFor`, `sellingPrice`, `variants`) is exposed as an explicitly
 *   nullable extra, never defaulted — a consumer must handle its absence honestly rather than
 *   receive a fabricated value.
 * - `origin` is internal provenance for validation/reporting only. The storefront must not expose
 *   the Legacy/ProductMaster seam to customers (mission §5).
 */

import type { Product, Specification } from "@/types/catalog";
import { allProducts } from "@/data/products";
import { getBrand } from "@/data/brands";
import { getPublishedProducts } from "@/data/shipnity-seed/storefront-bridge";
import { getLegacyApprovedPrice } from "@/data/shipnity-seed/legacy-price-approvals";
import { verifiedAttributes } from "@/lib/verified-specs";

/** A resolved, render-ready reference to a real, customer-visible catalog product. */
export interface CatalogRef {
  slug: string;
  href: string;
  name: string;
  brandName: string;
  categoryId: string;
  image: { src: string; alt: string } | null;
  /** Internal provenance only — never rendered as a customer-facing label. */
  origin: "legacy" | "product-master";
}

/**
 * A fuller view for tools that compare or filter. Extends `CatalogRef` with the fields each half
 * genuinely has, each nullable so absence stays visible instead of being papered over.
 */
export interface CatalogItem extends CatalogRef {
  brandId: string;
  /** Legacy always has one; a ProductMaster record often has none (no family record exists). */
  familyId: string | null;
  /** `null` on every ProductMaster record whose taxonomy could not determine one (e-liquid,
   *  heated tobacco) — deliberately not coerced to a device type. */
  systemType: string | null;
  /** Manufacturer-verified spec lines. Present on both halves; frequently empty on ProductMaster
   *  records that have not been spec-researched yet — empty means "not researched", not "none". */
  specifications: Specification[];
  /** LEGACY ONLY. The normalized device attribute block that powers Finder scoring and Compare's
   *  classification rows. `null` for every ProductMaster record — see this file's header. */
  attributes: Product["attributes"] | null;
  /** LEGACY ONLY editorial copy. */
  whoIsThisFor: string[];
  /** The owner-approved final selling price. ProductMaster: from publication-approvals.ts.
   *  Legacy: from legacy-price-approvals.ts (since 2026-09-05) — the legacy `Product` type itself
   *  still has no price field (see docs/BUSINESS_SOURCE_OF_TRUTH.md), so `null` here means
   *  "no approved price yet" and the product stays browse-only — an
   *  absence of data, never a claim the product is free. */
  sellingPrice: number | null;
  /** PRODUCTMASTER ONLY. Active variant labels (colors/flavors/resistances). */
  variantLabels: string[];
}

function legacyToItem(p: Product): CatalogItem {
  const card = p.assets.find((a) => a.role === "card");
  return {
    slug: p.slug,
    href: `/products/${p.slug}`,
    name: p.displayName,
    brandName: getBrand(p.brandId)?.name ?? p.brandId,
    brandId: p.brandId,
    familyId: p.familyId,
    categoryId: p.categoryId,
    systemType: p.systemType,
    image: card ? { src: card.src, alt: card.alt } : null,
    origin: "legacy",
    specifications: p.specifications,
    // Data round (2026-09-24): only the numbers a verified spec row backs — /compare's classification rows read these.
    attributes: verifiedAttributes(p),
    whoIsThisFor: p.whoIsThisFor,
    sellingPrice: getLegacyApprovedPrice(p.slug),
    variantLabels: [],
  };
}

function publishedToItem(p: ReturnType<typeof getPublishedProducts>[number]): CatalogItem {
  return {
    slug: p.slug,
    href: `/products/${p.slug}`,
    name: p.displayName,
    brandName: p.brandName,
    brandId: p.brandId,
    familyId: null, // StorefrontProductView deliberately does not expose familyId — see its header
    categoryId: p.categoryId,
    systemType: p.systemType,
    image: p.image ? { src: p.image.src, alt: p.image.alt } : null,
    origin: "product-master",
    specifications: p.specifications,
    attributes: null,
    whoIsThisFor: [],
    sellingPrice: p.sellingPrice,
    variantLabels: p.variants.map((v) => v.label),
  };
}

/**
 * Every product a customer can currently reach, legacy first then published ProductMaster —
 * the same ordering the unified Search grid already uses, so tools stay visually consistent.
 * Recomputed per call rather than cached at module load: `getPublishedProducts()` is itself the
 * gate, and caching here would make a publication change require a restart to take effect.
 */
export function allCatalogItems(): CatalogItem[] {
  return [...allProducts.map(legacyToItem), ...getPublishedProducts().map(publishedToItem)];
}

/** Resolves a slug to a currently-visible catalog product, or `undefined` if it is unknown,
 *  unpublished, or DEV-preview-only. The single visibility gate every tool should use. */
export function getCatalogItem(slug: string): CatalogItem | undefined {
  return allCatalogItems().find((i) => i.slug === slug);
}

/** Narrows a full item to the small reference shape, for consumers that only render a link. */
export function toCatalogRef(item: CatalogItem): CatalogRef {
  const { slug, href, name, brandName, categoryId, image, origin } = item;
  return { slug, href, name, brandName, categoryId, image, origin };
}
