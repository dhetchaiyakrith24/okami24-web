import type { Product } from "@/types/catalog";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import { legacyCardStock, publishedCardStock } from "@/lib/stock/card-stock";

/**
 * "สินค้าพร้อมส่ง" (owner 24/10 night: a button that shows which products the shop has in stock right now). A product
 * counts when a customer could buy at least one of its options today — the same rule each product page uses for its buy
 * button, so the filter and the page never disagree:
 *   - legacy catalog: an approved price, and at least one option not marked out-of-stock (no options: the product itself);
 *   - ProductMaster: a selling price, and at least one option with a confirmed "in-stock" signal (only that sells).
 * The rule lives in src/lib/stock/card-stock.ts. This is the build's answer; CatalogBrowser lays the warehouse's live
 * answer over it after load (owner 31/10, /api/stock), so the filter follows Shipnity without a rebuild.
 * Returns the catalog entry keys CatalogBrowser uses ("legacy:<slug>" / "published:<slug>").
 */
export function inStockEntryKeys(products: Product[], publishedProducts: StorefrontProductView[]): string[] {
  return [
    ...products.filter((p) => legacyCardStock(p).inStock).map((p) => `legacy:${p.slug}`),
    ...publishedProducts.filter((p) => publishedCardStock(p).inStock).map((p) => `published:${p.slug}`),
  ];
}
