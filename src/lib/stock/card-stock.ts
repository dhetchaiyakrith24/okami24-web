import type { Product, VariantAvailability } from "@/types/catalog";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import { getLegacyApprovedPrice } from "@/data/shipnity-seed/legacy-price-approvals";
import type { LiveLookup } from "@/lib/stock/live-rules";

/**
 * The stock state a product CARD shows, from the build or with the warehouse's live answer laid over it (owner 31/10:
 * cards read live stock like the product page). Pure — the stock API (src/app/api/stock/route.ts) passes the live lookup,
 * the build passes none. Two answers per product:
 *   - `soldOut` = every option sold out (no options: the product itself) — hides "มาใหม่" on the card, as on the product head;
 *   - `inStock` = "สินค้าพร้อมส่ง" (owner 24/10 night): a selling price, and an option a customer can buy today — the same
 *     rule each product page uses for its buy button, so the filter and the page never disagree.
 * The live overlay is the product page's (src/components/product/useLiveStock.ts): an option with a live answer takes it,
 * the rest keep the build; a ProductMaster product's own status follows pilotStatusAfterLive below, which that hook uses too.
 */

export interface CardStock {
  soldOut: boolean;
  inStock: boolean;
}

const avail = (s: "in" | "out"): VariantAvailability => (s === "in" ? "in-stock" : "out-of-stock");

export function legacyCardStock(p: Product, live?: LiveLookup): CardStock {
  const options = [...(p.colorVariants ?? []), ...(p.flavorVariants ?? [])].map((v) => {
    const s = live?.(p.slug, v.id, v.name);
    return s ? avail(s) : v.availability;
  });
  const own = options.length === 0 ? (live?.(p.slug) ?? null) : null;
  const productAvail = own ? avail(own) : p.availability;
  const soldOut = options.length > 0 ? options.every((a) => a === "out-of-stock") : productAvail === "out-of-stock";
  const sellable = options.length > 0 ? options.some((a) => a !== "out-of-stock") : productAvail !== "out-of-stock";
  return { soldOut, inStock: getLegacyApprovedPrice(p.slug) !== null && sellable };
}

/** A ProductMaster product's status once its variants carry the live answer (`own` = the live answer of a product without
 *  variants): one variant that sells = in stock · every variant sold out = sold out · otherwise what the build said. */
export function pilotStatusAfterLive(
  variants: readonly { availabilityStatus: VariantAvailability }[],
  built: VariantAvailability,
  own: "in" | "out" | null
): VariantAvailability {
  if (variants.length === 0) return own ? avail(own) : built;
  if (variants.some((v) => v.availabilityStatus === "in-stock")) return "in-stock";
  if (variants.every((v) => v.availabilityStatus === "out-of-stock")) return "out-of-stock";
  return built;
}

export function publishedCardStock(p: StorefrontProductView, live?: LiveLookup): CardStock {
  const variants = p.variants.map((v) => {
    const s = live?.(p.slug, v.id, v.label);
    return { availabilityStatus: s ? avail(s) : v.availabilityStatus };
  });
  const own = variants.length === 0 ? (live?.(p.slug) ?? null) : null;
  const status = live ? pilotStatusAfterLive(variants, p.availabilityStatus, own) : p.availabilityStatus;
  const sellable = variants.length > 0 ? variants.some((v) => v.availabilityStatus === "in-stock") : status === "in-stock";
  return { soldOut: status === "out-of-stock", inStock: p.sellingPrice !== null && sellable };
}

/** What the stock API sends the cards: only the products whose live state differs from the build (`o` = soldOut,
 *  `s` = inStock), keyed by slug. Empty = every card is right as built. */
export type CardStockChanges = Record<string, { o: boolean; s: boolean }>;

export function liveCardChanges(products: readonly Product[], published: readonly StorefrontProductView[], live: LiveLookup): CardStockChanges {
  const out: CardStockChanges = {};
  const add = (slug: string, built: CardStock, now: CardStock) => {
    if (built.soldOut !== now.soldOut || built.inStock !== now.inStock) out[slug] = { o: now.soldOut, s: now.inStock };
  };
  for (const p of products) add(p.slug, legacyCardStock(p), legacyCardStock(p, live));
  for (const p of published) add(p.slug, publishedCardStock(p), publishedCardStock(p, live));
  return out;
}
