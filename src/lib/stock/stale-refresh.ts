import "server-only";
import { revalidatePath } from "next/cache";
import { allProducts } from "@/data/products";
import { getPublishedProducts } from "@/data/shipnity-seed/storefront-bridge";
import { liveLookup, liveStockReady } from "@/lib/stock/live";
import { pagesToRefresh } from "@/lib/stock/refresh-pages";
import { stalePages, type RenderedStock } from "@/lib/stock/stale-pages";

/**
 * Marks stale every prerendered page whose stock the live warehouse answer no longer matches (owner 11/11, stale-pages.ts),
 * so it re-renders on its next visit with the live stock (the product page renders through the live overlay). Called by
 * the stock routes: the cards' /api/stock (whole catalog, at most once per WINDOW_MS), a product page's /api/stock/<slug>
 * (that product) and Shipnity's push (src/app/wp-json, whole catalog). After a deploy the first visitor's stock request
 * marks the pages the build got wrong; the next visit gets live HTML. Never throws — a failure leaves the 3-hour window.
 * Nothing happens before the warehouse has reported (liveStockReady): an empty table must not mark the whole shop stale.
 */

const WINDOW_MS = 10_000;
type State = { rendered: Map<string, RenderedStock>; lastFull: number };
const shared = globalThis as typeof globalThis & { __okami24StalePages?: State };
const state = (shared.__okami24StalePages ??= { rendered: new Map(), lastFull: 0 });

/** `slug` = only that product; none = the whole catalog (throttled unless `force`). Returns the paths it marked. */
export function refreshStalePages(opts: { slug?: string; force?: boolean } = {}): string[] {
  try {
    if (!liveStockReady()) return [];
    if (!opts.slug && !opts.force && Date.now() - state.lastFull < WINDOW_MS) return [];
    if (!opts.slug) state.lastFull = Date.now();
    const products = opts.slug ? allProducts.filter((p) => p.slug === opts.slug) : allProducts;
    const published = opts.slug ? getPublishedProducts().filter((p) => p.slug === opts.slug) : getPublishedProducts();
    const answer = stalePages(products, published, liveLookup(), state.rendered);
    if (answer.pages.length === 0) return [];
    const paths = [...new Set([...answer.pages, ...pagesToRefresh(answer.cards)])].sort();
    for (const p of paths) revalidatePath(p);
    for (const [slug, now] of answer.now) state.rendered.set(slug, now);
    return paths;
  } catch (err) {
    console.error(`[stock] stale-page refresh failed — pages keep their 3-hour window: ${err instanceof Error ? err.message : String(err)}`);
    return [];
  }
}
