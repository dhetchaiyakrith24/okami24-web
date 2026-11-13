/**
 * OKami24 — search text for a catalog grid, built on the server (round "search-price", 2026-09-22).
 *
 * `CatalogBrowser` is a client component. It receives the products of a category/brand page as
 * props (they are already in the page payload); the search text for each is built here, on the
 * server, and passed alongside — importing `@/data/products` from the client component instead
 * would ship the whole legacy catalog module a second time, as JavaScript, on every grid page.
 *
 * Speed round (owner 13/11): the page carries only the primary half; the secondary half is one static answer for the whole
 * storefront (/api/catalog-search), fetched the first time a visitor uses a search box (src/lib/catalog-search-secondary.ts).
 */
import "server-only";
import type { Product } from "@/types/catalog";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import { legacySearchText } from "@/data/products";
import { publishedSearchText } from "@/data/shipnity-seed/storefront-bridge";
import type { SearchText } from "@/lib/catalog-search";

/** Keyed the way CatalogBrowser keys its entries: `legacy:<slug>` / `published:<slug>`. */
function catalogSearchTexts(products: Product[], publishedProducts: StorefrontProductView[]): Record<string, SearchText> {
  const out: Record<string, SearchText> = {};
  for (const p of products) out[`legacy:${p.slug}`] = legacySearchText(p);
  for (const p of publishedProducts) out[`published:${p.slug}`] = publishedSearchText(p);
  return out;
}

const half = (texts: Record<string, SearchText>, part: keyof SearchText): Record<string, string> =>
  Object.fromEntries(Object.entries(texts).map(([key, t]) => [key, t[part]]));

/** The grid page's own products — what CatalogBrowser searches before (or without) the secondary half. */
export const catalogSearchPrimary = (products: Product[], publishedProducts: StorefrontProductView[]) =>
  half(catalogSearchTexts(products, publishedProducts), "primary");

/** The whole storefront's secondary half (the /api/catalog-search answer). */
export const catalogSearchSecondary = (products: Product[], publishedProducts: StorefrontProductView[]) =>
  half(catalogSearchTexts(products, publishedProducts), "secondary");
