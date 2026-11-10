import { allProducts } from "@/data/products";
import { getPublishedProduct } from "@/data/shipnity-seed/storefront-bridge";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import { allCatalogItems } from "@/lib/catalog-index";
import type { FinderCatalog } from "@/lib/finder";
import { cardOnly } from "@/lib/related-order";

/**
 * SERVER side of the Finder's catalog (T2-50, 10/11) — never import this from a "use client" file: it reads the catalog
 * modules, and a client import bundles the raw product files. The finder page builds it and passes it to FinderTool; the
 * contract test and scripts/finder-dump.ts build it the same way.
 * `forPage` = the card-only records (related-order.ts cardOnly) — what a card and the ranking read, without the product
 * page's own text — so the page payload stays small; tests and dumps rank the full records.
 */
export function finderCatalog({ forPage = false }: { forPage?: boolean } = {}): FinderCatalog {
  const published = allCatalogItems()
    .filter((item) => item.origin === "product-master")
    .map((item) => getPublishedProduct(item.slug))
    .filter((p): p is StorefrontProductView => p !== undefined);
  return { products: forPage ? allProducts.map(cardOnly) : allProducts, published };
}
