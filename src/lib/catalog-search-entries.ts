/**
 * OKami24 — search text for a catalog grid, built on the server (round "search-price", 2026-09-22).
 *
 * `CatalogBrowser` is a client component. It receives the products of a category/brand page as
 * props (they are already in the page payload); the search text for each is built here, on the
 * server, and passed alongside — importing `@/data/products` from the client component instead
 * would ship the whole legacy catalog module a second time, as JavaScript, on every grid page.
 */
import "server-only";
import type { Product } from "@/types/catalog";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import { legacySearchText } from "@/data/products";
import { publishedSearchText } from "@/data/shipnity-seed/storefront-bridge";
import type { SearchText } from "@/lib/catalog-search";

/** Keyed the way CatalogBrowser keys its entries: `legacy:<slug>` / `published:<slug>`. */
export function catalogSearchTexts(products: Product[], publishedProducts: StorefrontProductView[]): Record<string, SearchText> {
  const out: Record<string, SearchText> = {};
  for (const p of products) out[`legacy:${p.slug}`] = legacySearchText(p);
  for (const p of publishedProducts) out[`published:${p.slug}`] = publishedSearchText(p);
  return out;
}
