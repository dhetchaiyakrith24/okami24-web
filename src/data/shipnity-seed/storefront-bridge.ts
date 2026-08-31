/**
 * OKami24 — Phase 3.0: main-storefront ProductMaster bridge.
 *
 * The legacy catalog (`src/data/products/*`) has no publication/visibility concept at all —
 * `getProduct`/`getProductsByCategory`/etc. treat `allProducts` as unconditionally customer-
 * facing (see the Phase 3.0 report §VISIBILITY / PUBLICATION STRATEGY). ProductMaster records
 * DO carry `publicationStatus`, and every Shipnity-sourced draft is genuinely "unpublished" —
 * but flipping that flag to make this pilot "work" would be exactly the accidental-publication
 * mistake the owner explicitly ruled out. So the gate lives here instead, at the bridge boundary:
 * these functions return nothing at all outside local development, regardless of what
 * `publicationStatus` says. `next build` always runs with `NODE_ENV=production`, so this also
 * means the 5 pilot products are never included in `generateStaticParams`, never statically
 * generated, and any direct request to their slug in a production deployment falls through to
 * the same `notFound()` the legacy catalog already uses for an unknown slug.
 */

import { buildStorefrontPreview, getStorefrontPreviewBySlug, type StorefrontProductView } from "./storefront-preview-read-model";

function pilotBridgeEnabled(): boolean {
  return process.env.NODE_ENV !== "production";
}

export function getPilotProducts(): StorefrontProductView[] {
  return pilotBridgeEnabled() ? buildStorefrontPreview() : [];
}

export function getPilotProduct(slug: string): StorefrontProductView | undefined {
  if (!pilotBridgeEnabled()) return undefined;
  return getStorefrontPreviewBySlug(slug);
}

export function getPilotProductsByCategory(categoryId: string): StorefrontProductView[] {
  return getPilotProducts().filter((p) => p.categoryId === categoryId);
}

export function getPilotProductsByBrand(brandId: string): StorefrontProductView[] {
  return getPilotProducts().filter((p) => p.brandId === brandId);
}

/**
 * Truthful, deterministic "you might also consider" — same `categoryId` among the pilot batch
 * only. Never crosses into the legacy 28 products (no verified relationship data exists between
 * a Shipnity draft and a legacy demo product) and never claims compatibility, only shared
 * category. Returns an empty list rather than padding with a weaker match — see the Phase 3.0
 * report §RELATED-PRODUCT BEHAVIOR for which of the 5 pilot products end up with zero.
 */
export function getPilotRelatedProducts(product: StorefrontProductView): StorefrontProductView[] {
  return getPilotProducts().filter((p) => p.slug !== product.slug && p.categoryId === product.categoryId);
}

/**
 * Phase 3.1 — same haystack-join-includes matching as the legacy `searchProducts` (see
 * src/data/products/index.ts), restricted to fields that genuinely exist on a Shipnity-sourced
 * draft: displayName, brand name, category name, tagline, and active variant labels. No
 * `attributes`/`specifications`/`features` text to match against (none exist), and nothing
 * fabricated to widen recall — a query that only matches on a legacy-only concept (puff count,
 * battery, etc.) correctly returns no pilot results. Inherits the same NODE_ENV production gate
 * as every other `getPilotProducts()` consumer — a production build always sees zero results
 * here without any extra gating code.
 */
export function searchPilotProducts(query: string): StorefrontProductView[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return getPilotProducts().filter((p) => {
    const haystack = [p.displayName, p.brandName, p.categoryName, p.tagline, ...p.variants.map((v) => v.label)].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}
