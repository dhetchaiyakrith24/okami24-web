import type { Product } from "@/types/catalog";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import { getLegacyApprovedPrice } from "@/data/shipnity-seed/legacy-price-approvals";
import type { LiveLookup } from "@/lib/stock/live-rules";
import { liveLegacyProduct, livePilotProduct } from "@/lib/stock/live-overlay";

/**
 * The stock state a product CARD shows, from the build or with the warehouse's live answer laid over it (owner 31/10:
 * cards read live stock like the product page). Pure — the stock API (src/app/api/stock/route.ts) passes the live lookup,
 * the build passes none. Two answers per product:
 *   - `soldOut` = every option sold out (no options: the product itself) — hides "มาใหม่" on the card, as on the product head;
 *   - `inStock` = "สินค้าพร้อมส่ง" (owner 24/10 night): a selling price, and an option a customer can buy today — the same
 *     rule each product page uses for its buy button, so the filter and the page never disagree.
 * The live overlay is the product page's own (src/lib/stock/live-overlay.ts — its server render and its after-load hook use
 * it too): an option with a live answer takes it, the rest keep the build.
 */

export interface CardStock {
  soldOut: boolean;
  inStock: boolean;
}

/** The ProductMaster status rule lives with the overlay (live-overlay.ts); re-exported for the callers that import it here. */
export { pilotStatusAfterLive } from "@/lib/stock/live-overlay";

export function legacyCardStock(p: Product, live?: LiveLookup): CardStock {
  const q = liveLegacyProduct(p, live);
  const options = [...(q.colorVariants ?? []), ...(q.flavorVariants ?? [])];
  // "ask" (a warehouse code with no live number) neither sells nor counts as sold out (live-rules.ts).
  const soldOut = options.length > 0 ? options.every((v) => v.availability === "out-of-stock") : q.availability === "out-of-stock";
  const sellable = options.length > 0 ? options.some((v) => v.availability !== "out-of-stock" && !v.stockAsk) : q.availability !== "out-of-stock" && !q.stockAsk;
  return { soldOut, inStock: getLegacyApprovedPrice(p.slug) !== null && sellable };
}

export function publishedCardStock(p: StorefrontProductView, live?: LiveLookup): CardStock {
  const q = livePilotProduct(p, live);
  const sellable = q.variants.length > 0 ? q.variants.some((v) => v.availabilityStatus === "in-stock") : q.availabilityStatus === "in-stock";
  return { soldOut: q.availabilityStatus === "out-of-stock", inStock: p.sellingPrice !== null && sellable };
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
