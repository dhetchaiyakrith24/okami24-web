import { allCatalogItems } from "@/lib/catalog-index";
import { getProduct } from "@/data/products";
import { getPublishedProductBySlug } from "@/data/shipnity-seed/storefront-preview-read-model";
import { resolveProductRef } from "@/lib/commerce/catalog-resolver";
import { FIRST_LISTED } from "@/data/first-listed";
import { legacyCardStock, publishedCardStock } from "@/lib/stock/card-stock";
import type { LiveLookup } from "@/lib/stock/live-rules";

/**
 * The homepage "สินค้าใหม่" row (owner 29/10 — new products on the homepage, no manual updates): the products listed most
 * recently (src/data/first-listed.ts), newest first, ties in catalog order — only ones with at least one option the cart
 * would sell at build time (a "new" card that opens on "สินค้าหมด" is a dead end). The homepage is prerendered, so the
 * row changes with every deploy — every listing PR deploys, which is exactly when a new product appears.
 */
export function newArrivalSlugs(count: number, live?: LiveLookup): string[] {
  const items = allCatalogItems().filter((i) => i.sellingPrice !== null && FIRST_LISTED[i.slug]);
  const order = new Map(items.map((i, n) => [i.slug, n]));
  const sells = (slug: string, origin: "legacy" | "product-master") => {
    const ids =
      origin === "legacy"
        ? (() => {
            const p = getProduct(slug);
            return [...(p?.colorVariants ?? []), ...(p?.flavorVariants ?? [])].map((v) => v.id);
          })()
        : (getPublishedProductBySlug(slug)?.variants ?? []).map((v) => v.id);
    const refs = ids.length > 0 ? ids : [null];
    return refs.some((variantId) => resolveProductRef({ origin, slug, variantId }).ok);
  };
  return items
    .sort((a, b) => FIRST_LISTED[b.slug].localeCompare(FIRST_LISTED[a.slug]) || order.get(a.slug)! - order.get(b.slug)!)
    // `live` given (the page has a warehouse answer — ISR, owner 10/11): "sells" = in stock now; otherwise the build rule
    .filter((i) => {
      if (!live) return sells(i.slug, i.origin);
      if (i.origin === "legacy") {
        const p = getProduct(i.slug);
        return p ? legacyCardStock(p, live).inStock : false;
      }
      const p = getPublishedProductBySlug(i.slug);
      return p ? publishedCardStock(p, live).inStock : false;
    })
    .slice(0, count)
    .map((i) => i.slug);
}
