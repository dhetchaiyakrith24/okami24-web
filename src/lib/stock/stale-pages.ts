import type { Product } from "@/types/catalog";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import type { LiveLookup } from "@/lib/stock/live-rules";
import { liveLegacyProduct, livePilotProduct } from "@/lib/stock/live-overlay";
import { legacyCardStock, publishedCardStock } from "@/lib/stock/card-stock";

/**
 * Which prerendered pages show stock that the live warehouse answer no longer matches (owner 11/11). A push only marked
 * pages stale when a code FLIPPED between two Shipnity reports (refresh-pages.ts), so a page built from a week-old snapshot
 * kept it for as long as Shipnity's own number did not change — ESKO BAR SWITCH 20K Extra Menthol stayed "หมด" on the page
 * while Shipnity held 140 for days. This compares what a page was last rendered with (the build's stock, until this server
 * process marks it stale) with the live overlay (live-overlay.ts — the same overlay the page renders with now):
 *   - any option's state differs → the product page is stale;
 *   - its card state (sold out / "พร้อมส่ง", card-stock.ts) differs too → its category, brand, home and /products are stale.
 * Pure: the server keeps `rendered` per process (stale-refresh.ts); a test passes its own.
 */

export interface RenderedStock {
  /** Every option's state as the page shows it ("in-stock" | "out-of-stock" | "unknown", "?" = ask). */
  options: string;
  /** The card's two answers, "soldOut/inStock". */
  card: string;
}

const optionsOfLegacy = (p: Product) =>
  [...(p.colorVariants ?? []), ...(p.flavorVariants ?? [])].map((v) => `${v.id}=${v.availability ?? "unknown"}${v.stockAsk ? "?" : ""}`).join("|") ||
  `=${p.availability ?? "unknown"}${p.stockAsk ? "?" : ""}`;
const optionsOfPilot = (p: StorefrontProductView) =>
  p.variants.map((v) => `${v.id}=${v.availabilityStatus}${v.stockAsk ? "?" : ""}`).join("|") || `=${p.availabilityStatus}${p.stockAsk ? "?" : ""}`;
const cardOf = (c: { soldOut: boolean; inStock: boolean }) => `${c.soldOut ? 1 : 0}/${c.inStock ? 1 : 0}`;

export function legacyRenderedStock(p: Product, live?: LiveLookup): RenderedStock {
  return { options: optionsOfLegacy(liveLegacyProduct(p, live)), card: cardOf(legacyCardStock(p, live)) };
}

export function publishedRenderedStock(p: StorefrontProductView, live?: LiveLookup): RenderedStock {
  return { options: optionsOfPilot(livePilotProduct(p, live)), card: cardOf(publishedCardStock(p, live)) };
}

export interface StaleAnswer {
  /** Product pages to mark stale. */
  pages: string[];
  /** Slugs whose card state changed too (their shared pages — refresh-pages.ts pagesToRefresh). */
  cards: string[];
  /** What each stale product's pages will render with after the refresh — the caller stores it as `rendered`. */
  now: Map<string, RenderedStock>;
}

/** `rendered` = what this process last marked each page stale for; a slug it never touched = the build. */
export function stalePages(
  products: readonly Product[],
  published: readonly StorefrontProductView[],
  live: LiveLookup,
  rendered: ReadonlyMap<string, RenderedStock>
): StaleAnswer {
  const pages: string[] = [];
  const cards: string[] = [];
  const now = new Map<string, RenderedStock>();
  const add = (slug: string, built: () => RenderedStock, current: RenderedStock) => {
    const before = rendered.get(slug) ?? built();
    if (before.options === current.options && before.card === current.card) return;
    pages.push(`/products/${slug}`);
    if (before.card !== current.card) cards.push(slug);
    now.set(slug, current);
  };
  for (const p of products) add(p.slug, () => legacyRenderedStock(p), legacyRenderedStock(p, live));
  for (const p of published) add(p.slug, () => publishedRenderedStock(p), publishedRenderedStock(p, live));
  return { pages: pages.sort(), cards: cards.sort(), now };
}
