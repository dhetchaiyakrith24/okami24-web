import "server-only";
import { getProduct } from "@/data/products";
import { getPublishedProductBySlug } from "@/data/shipnity-seed/storefront-preview-read-model";
import type { CatalogItem } from "@/lib/catalog-index";
import { NEVER, suggestionOrder } from "@/lib/related-order";
import { RELATED_SLOTS } from "@/lib/related-row";
import { legacyCardStock, publishedCardStock } from "@/lib/stock/card-stock";
import type { LiveLookup } from "@/lib/stock/live-rules";
import { resolveProductRef } from "./catalog-resolver";
import { liveLookup } from "@/lib/stock/live";

/**
 * The cart page's "สินค้าที่คุณอาจสนใจ" row. Picked here on the server so the client cart gets only the few small cards
 * (never the catalog).
 *
 * The order = src/lib/related-order.ts (owner 07/11: four tiers); an empty cart gets the shop's picks alone.
 *
 * Every card can be bought right now: the live stock the buy buttons use (owner 07/11: "ต้องเป็นสินค้าที่มีในสต๊อกเท่านั้น …
 * Auto ตลอด"), read on every render of this page, so no list is kept by hand and no rebuild is needed. Also an approved
 * price, not already in the cart, not on BSOT §15 "Not recommended". Nothing qualifies = no cards, and the row hides.
 * Deterministic (no shuffle) — the same cart and the same stock always show the same row.
 */
/** phones swipe one row, ≥640 shows rows of 4. */
const ROW = 4;

/** One colour / flavour / variant of a suggestion, for the card's quick add (owner 26/10: "กดตะกร้าปุ๊บก็มีสีให้เลือกเลย"). */
export interface SuggestionOption {
  id: string;
  name: string;
  image?: { src: string; alt: string };
  swatchHex?: string;
  /** false = the add would be refused (resolveProductRef — the same rule addToCart applies). */
  sellable: boolean;
}

export interface CartSuggestion {
  slug: string;
  href: string;
  name: string;
  image: { src: string; alt: string } | null;
  price: number;
  /** Which word heads the picker: a legacy colour or flavour list, or a ProductMaster variant list (no axis word). */
  axis: "color" | "flavor" | null;
  /** [] = no options: one tap adds the product itself. */
  options: SuggestionOption[];
}

/** The rule behind the buy button and the cards' stock (src/lib/stock/card-stock.ts), with the warehouse's live answer. */
function sellable(slug: string, live: LiveLookup): boolean {
  const legacy = getProduct(slug);
  if (legacy) return legacyCardStock(legacy, live).inStock;
  const published = getPublishedProductBySlug(slug);
  return published ? publishedCardStock(published, live).inStock : false;
}

function optionsOf(item: CatalogItem, live: LiveLookup): Pick<CartSuggestion, "axis" | "options"> {
  const can = (variantId: string) => resolveProductRef({ origin: item.origin, slug: item.slug, variantId }, live).ok;
  const legacy = getProduct(item.slug);
  if (legacy) {
    const colors = legacy.colorVariants ?? [];
    const list = [...colors, ...(legacy.flavorVariants ?? [])];
    return {
      axis: list.length === 0 ? null : colors.length > 0 ? "color" : "flavor",
      options: list.map((v) => ({ id: v.id, name: v.name, image: v.image, swatchHex: v.swatchHex, sellable: can(v.id) })),
    };
  }
  const published = getPublishedProductBySlug(item.slug);
  return {
    axis: null,
    options: (published?.variants ?? []).map((v) => ({ id: v.id, name: v.label, image: v.image ? { src: v.image.src, alt: v.image.alt } : undefined, sellable: can(v.id) })),
  };
}

function toCard(item: CatalogItem, live: LiveLookup): CartSuggestion {
  return { slug: item.slug, href: item.href, name: item.name, image: item.image, price: item.sellingPrice as number, ...optionsOf(item, live) };
}

export function cartSuggestions(cartSlugs: string[]): CartSuggestion[] {
  const live = liveLookup();
  const taken = new Set(cartSlugs);
  const chosen = suggestionOrder(cartSlugs, (item) => !taken.has(item.slug) && !NEVER.has(item.slug) && item.sellingPrice !== null && sellable(item.slug, live));
  // Phones swipe a single row, so any count fits there; from 640 px the cards sit in rows of 4, so 5–7 round down to 4
  // (no half-empty second row). Fewer than 4 all show — a single fitting part still shows (cart fit 27/10).
  const shown = chosen.length >= RELATED_SLOTS ? RELATED_SLOTS : chosen.length >= ROW ? ROW : chosen.length;
  return chosen.slice(0, shown).map((item) => toCard(item, live));
}
