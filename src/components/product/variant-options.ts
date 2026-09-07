import type { Product } from "@/types/catalog";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";

/**
 * One shape for "the colours/flavours a customer can pick" on a product page — mobile round,
 * chat A (MOBILE_SPEC M2 + owner adjustment P1, 2026-09-08).
 *
 * The two product pages keep their own selection state and their own stock rules (legacy:
 * `ProductHero`; ProductMaster: `PilotProductDetail`) — nothing about that moved. What they now
 * share is this projection of their option lists, so the swipe gallery, the position dots, the
 * sticky buy bar, and later the M5 cart sheet all read the same thing and never need to know
 * which catalogue a product came from.
 *
 * `image` is the option's own verified photo or `null`. The gallery's rule for a missing photo
 * (M2.3) is "show the product's fallback image, change only the name" — so the moment a real
 * per-option photo is added to the data, that option gets its own slide with no code change.
 *
 * `outOfStock` follows each catalogue's existing meaning, unchanged: legacy = explicitly
 * `"out-of-stock"` (unknown sells, owner default 2026-09-06); ProductMaster = anything but a
 * confirmed `"in-stock"` signal (owner mandate 2026-09-03).
 */
export interface VariantOption {
  id: string;
  name: string;
  image: { src: string; alt: string } | null;
  outOfStock: boolean;
}

/** Legacy products carry colours OR flavours, never both (see ProductHero's cart gate). */
export function legacyVariantOptions(product: Product): VariantOption[] {
  const colors = product.colorVariants ?? [];
  const flavors = product.flavorVariants ?? [];
  const source = colors.length > 0 ? colors : flavors;
  return source.map((v) => ({
    id: v.id,
    name: v.name,
    image: v.image ?? null,
    outOfStock: v.availability === "out-of-stock",
  }));
}

export function pilotVariantOptions(product: StorefrontProductView): VariantOption[] {
  return product.variants.map((v) => ({
    id: v.id,
    name: v.label,
    image: v.image ? { src: v.image.src, alt: v.image.alt } : null,
    outOfStock: v.availabilityStatus !== "in-stock",
  }));
}
