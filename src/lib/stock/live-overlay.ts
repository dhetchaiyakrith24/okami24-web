import type { Product, VariantAvailability } from "@/types/catalog";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import type { LiveLookup, LiveState } from "@/lib/stock/live-rules";

/**
 * A product with the warehouse's live answer laid over the stock it was built with — ONE rule for the server render of a
 * product page (src/app/products/[slug]/page.tsx), the page's own after-load refresh (src/components/product/useLiveStock.ts),
 * the cards (card-stock.ts) and the stale-page check (stale-pages.ts). Pure: the server passes liveLookup(), the browser a
 * lookup built from /api/stock/<slug>.
 *
 * Owner 11/11 ("ทุกตัวต้องเช็คได้หมด … รันสต็อกสด"): the page HTML used to be the build's stock, and only the browser fixed it
 * after load — ESKO BAR SWITCH 20K Extra Menthol rendered "หมด" while Shipnity held 140. Per option:
 *   - "in" → in stock · "out" → sold out (the owner's sold-out list is inside the live answer);
 *   - "ask" → `availability: "unknown"` + `stockAsk` — not sold, not shown as sold out; the buy slot asks on LINE;
 *   - no live answer (no code, or no reports at all, as in `next build`) → what the build said.
 * A ProductMaster product's own status follows pilotStatusAfterLive (a variant that sells = in stock · all sold out = sold
 * out · otherwise the build), so a card and its page never disagree. Same object back when nothing changes.
 */

export const availOf = (s: "in" | "out"): VariantAvailability => (s === "in" ? "in-stock" : "out-of-stock");

/** One option (or a product without options) after the live answer. */
export function overlayAvailability<T extends { availability?: VariantAvailability; stockAsk?: true }>(v: T, s: LiveState | null | undefined): T {
  if (!s) return v;
  if (s === "ask") return v.stockAsk && v.availability === "unknown" ? v : { ...v, availability: "unknown", stockAsk: true };
  const availability = availOf(s);
  if (v.availability === availability && !v.stockAsk) return v;
  const { stockAsk: _drop, ...rest } = v;
  void _drop;
  return { ...rest, availability } as T;
}

/** A ProductMaster product's status once its variants carry the live answer (`own` = the live answer of a product without
 *  variants): one variant that sells = in stock · every variant sold out = sold out · otherwise what the build said. */
export function pilotStatusAfterLive(
  variants: readonly { availabilityStatus: VariantAvailability }[],
  built: VariantAvailability,
  own: LiveState | null
): VariantAvailability {
  if (variants.length === 0) return own === "ask" ? "unknown" : own ? availOf(own) : built;
  if (variants.some((v) => v.availabilityStatus === "in-stock")) return "in-stock";
  if (variants.every((v) => v.availabilityStatus === "out-of-stock")) return "out-of-stock";
  return built;
}

export function liveLegacyProduct(product: Product, live: LiveLookup | undefined): Product {
  if (!live) return product;
  const relabel = <T extends { id: string; name: string; availability?: VariantAvailability; stockAsk?: true }>(list: T[] | undefined): T[] | undefined => {
    if (!list) return list;
    const next = list.map((v) => overlayAvailability(v, live(product.slug, v.id, v.name)));
    return next.some((v, i) => v !== list[i]) ? next : list;
  };
  const colorVariants = relabel(product.colorVariants);
  const flavorVariants = relabel(product.flavorVariants);
  const hasOptions = (product.colorVariants?.length ?? 0) + (product.flavorVariants?.length ?? 0) > 0;
  const own = hasOptions ? product : overlayAvailability(product, live(product.slug));
  if (own === product && colorVariants === product.colorVariants && flavorVariants === product.flavorVariants) return product;
  return { ...own, colorVariants, flavorVariants };
}

export function livePilotProduct(product: StorefrontProductView, live: LiveLookup | undefined): StorefrontProductView {
  if (!live) return product;
  let changed = false;
  const variants = product.variants.map((v) => {
    const s = live(product.slug, v.id, v.label);
    if (!s) return v;
    const status: VariantAvailability = s === "ask" ? "unknown" : availOf(s);
    if (v.availabilityStatus === status && !!v.stockAsk === (s === "ask")) return v;
    changed = true;
    const { stockAsk: _drop, ...rest } = v;
    void _drop;
    return s === "ask" ? { ...rest, availabilityStatus: status, stockAsk: true as const } : { ...rest, availabilityStatus: status };
  });
  const own = product.variants.length === 0 ? live(product.slug) : null;
  const status = pilotStatusAfterLive(variants, product.availabilityStatus, own);
  const ask = own === "ask";
  if (!changed && status === product.availabilityStatus && !!product.stockAsk === ask) return product;
  const { stockAsk: _drop, ...rest } = product;
  void _drop;
  return { ...rest, variants, availabilityStatus: status, ...(ask ? { stockAsk: true as const } : {}) };
}

/** A lookup built from the /api/stock/<slug> answer (the browser side): `o` per option id, `p` for a product without options. */
export function lookupFromAnswer(slug: string, answer: { o: Record<string, LiveState>; p: LiveState | null }): LiveLookup {
  return (s, optionId) => (s !== slug ? null : optionId === undefined ? answer.p : (answer.o[optionId] ?? null));
}
