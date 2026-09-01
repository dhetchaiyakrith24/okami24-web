/**
 * OKami24 — main-storefront ProductMaster bridge.
 *
 * The legacy catalog (`src/data/products/*`) has no publication/visibility concept at all —
 * `getProduct`/`getProductsByCategory`/etc. treat `allProducts` as unconditionally customer-
 * facing. This file is the boundary between ProductMaster data and the main storefront for BOTH
 * of ProductMaster's two, deliberately independent visibility pools (see the publication-pipeline
 * audit report for the full reasoning):
 *
 * - PILOT PREVIEW (`getPilotProduct(s)`, `searchPilotProducts`, etc.) — DEV-only, gated by
 *   `pilotBridgeEnabled()` (`NODE_ENV !== "production"`), scoped to the hardcoded
 *   `PREVIEW_SHIPNITY_IDS` review whitelist. Unchanged in spirit from earlier phases: an internal
 *   review aid, never customer-facing. `next build` always runs with `NODE_ENV=production`, so
 *   these are never in `generateStaticParams`, never statically generated, and any direct request
 *   to one of these slugs in production falls through to `notFound()` — same as an unknown slug.
 *   Now also excludes anything that has since become genuinely PUBLISHED (see below), so a
 *   product never appears twice — once as "real," once still wearing the preview badge.
 *
 * - PUBLISHED (`getPublishedProduct(s)`, `searchPublishedProducts`, etc.) — the real thing.
 *   NOT gated by NODE_ENV — visible in dev and production alike, exactly like the legacy catalog.
 *   Safety instead comes from `buildPublishedCatalog()`'s own two-layer guarantee: only an
 *   explicit `publication-approvals.ts` entry can make a candidate `publicationStatus:
 *   "published"` in the first place, and every published candidate is re-validated through the
 *   full readiness gate (throws, doesn't silently drop, if something is wrong) before it can
 *   reach here. No per-product exception ever needs to be hardcoded into this file or any of its
 *   callers — publishing a product is purely a data change in `publication-approvals.ts`.
 */

import {
  buildStorefrontPreview,
  getStorefrontPreviewBySlug,
  buildPublishedCatalog,
  getPublishedProductBySlug,
  type StorefrontProductView,
} from "./storefront-preview-read-model";

function pilotBridgeEnabled(): boolean {
  return process.env.NODE_ENV !== "production";
}

// ===================================================================================
// Pilot preview — DEV-only, unchanged in spirit. Excludes anything already published so a
// product never shows up twice under two different visual treatments.
// ===================================================================================

export function getPilotProducts(): StorefrontProductView[] {
  if (!pilotBridgeEnabled()) return [];
  return buildStorefrontPreview().filter((p) => p.publicationStatus !== "published");
}

export function getPilotProduct(slug: string): StorefrontProductView | undefined {
  if (!pilotBridgeEnabled()) return undefined;
  const preview = getStorefrontPreviewBySlug(slug);
  return preview?.publicationStatus === "published" ? undefined : preview;
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
 * category. Returns an empty list rather than padding with a weaker match.
 */
export function getPilotRelatedProducts(product: StorefrontProductView): StorefrontProductView[] {
  return getPilotProducts().filter((p) => p.slug !== product.slug && p.categoryId === product.categoryId);
}

/**
 * Same haystack-join-includes matching as the legacy `searchProducts` (see
 * src/data/products/index.ts), restricted to fields that genuinely exist on a Shipnity-sourced
 * draft: displayName, brand name, category name, tagline, and active variant labels. No
 * `attributes`/`specifications`/`features` text to match against (none exist), and nothing
 * fabricated to widen recall. Inherits the same NODE_ENV gate as every other `getPilotProducts()`
 * consumer — a production build always sees zero results here without any extra gating code.
 */
export function searchPilotProducts(query: string): StorefrontProductView[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return getPilotProducts().filter((p) => {
    const haystack = [p.displayName, p.brandName, p.categoryName, p.tagline, ...p.variants.map((v) => v.label)].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}

// ===================================================================================
// Published — the real thing. Deliberately NOT gated by NODE_ENV; see this file's header
// comment for why that's the correct, safer design (a curated data table, not an environment
// trick).
// ===================================================================================

export function getPublishedProducts(): StorefrontProductView[] {
  return buildPublishedCatalog();
}

export function getPublishedProduct(slug: string): StorefrontProductView | undefined {
  return getPublishedProductBySlug(slug);
}

export function getPublishedProductsByCategory(categoryId: string): StorefrontProductView[] {
  return getPublishedProducts().filter((p) => p.categoryId === categoryId);
}

export function getPublishedProductsByBrand(brandId: string): StorefrontProductView[] {
  return getPublishedProducts().filter((p) => p.brandId === brandId);
}

/** Same truthful, category-only relation rule as `getPilotRelatedProducts` — never crosses into
 *  the legacy catalog (no verified relationship data), never padded with a weaker match. */
export function getPublishedRelatedProducts(product: StorefrontProductView): StorefrontProductView[] {
  return getPublishedProducts().filter((p) => p.slug !== product.slug && p.categoryId === product.categoryId);
}

/** Same matching rule as `searchPilotProducts` — always on, no environment gate. */
export function searchPublishedProducts(query: string): StorefrontProductView[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return getPublishedProducts().filter((p) => {
    const haystack = [p.displayName, p.brandName, p.categoryName, p.tagline, ...p.variants.map((v) => v.label)].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}
