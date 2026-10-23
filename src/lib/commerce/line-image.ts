// Same trust level as catalog-resolver.ts: reads only the in-memory catalog, no I/O.
import { getPublishedProductBySlug } from "@/data/shipnity-seed/storefront-preview-read-model";
import { getCatalogItem } from "@/lib/catalog-index";
import { getProduct } from "@/data/products";

export interface LineImage {
  src: string;
  alt: string;
}

/**
 * The picture shown beside a cart / review / order line (cart UX round batch A, owner 24/10): the photo of the colour or
 * flavour the customer chose when the catalog has one, otherwise the product's card photo. Looked up at render time —
 * order_items stores no image, so an order placed today shows today's catalog photo for its product_slug + variant_id.
 * `null` = the product has no photo (or left the catalog): the line simply renders without one.
 */
export function lineImage(slug: string, variantId: string | null): LineImage | null {
  const legacy = getProduct(slug);
  if (legacy && variantId) {
    const option = [...(legacy.colorVariants ?? []), ...(legacy.flavorVariants ?? [])].find((v) => v.id === variantId);
    if (option?.image) return { src: option.image.src, alt: option.image.alt };
  }
  if (!legacy && variantId) {
    const variant = getPublishedProductBySlug(slug)?.variants.find((v) => v.id === variantId);
    if (variant?.image) return { src: variant.image.src, alt: variant.image.alt };
  }
  return getCatalogItem(slug)?.image ?? null;
}
