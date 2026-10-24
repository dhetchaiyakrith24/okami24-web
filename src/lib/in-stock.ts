import type { Product } from "@/types/catalog";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import { getLegacyApprovedPrice } from "@/data/shipnity-seed/legacy-price-approvals";

/**
 * "สินค้าพร้อมส่ง" (owner 24/10 night: a button that shows which products the shop has in stock right now). A product
 * counts when a customer could buy at least one of its options today — the same rule each product page uses for its buy
 * button, so the filter and the page never disagree:
 *   - legacy catalog: an approved price, and at least one option not marked out-of-stock (no options: the product itself);
 *   - ProductMaster: a selling price, and at least one option with a confirmed "in-stock" signal (only that sells).
 * Stock comes from the build (the hourly order-entry read), like every other stock state on the site.
 * Returns the catalog entry keys CatalogBrowser uses ("legacy:<slug>" / "published:<slug>").
 */
export function inStockEntryKeys(products: Product[], publishedProducts: StorefrontProductView[]): string[] {
  const keys: string[] = [];
  for (const p of products) {
    if (getLegacyApprovedPrice(p.slug) === null) continue;
    const options = [...(p.colorVariants ?? []), ...(p.flavorVariants ?? [])];
    const sellable = options.length > 0 ? options.some((v) => v.availability !== "out-of-stock") : p.availability !== "out-of-stock";
    if (sellable) keys.push(`legacy:${p.slug}`);
  }
  for (const p of publishedProducts) {
    if (p.sellingPrice === null) continue;
    const sellable = p.variants.length > 0 ? p.variants.some((v) => v.availabilityStatus === "in-stock") : p.availabilityStatus === "in-stock";
    if (sellable) keys.push(`published:${p.slug}`);
  }
  return keys;
}
