"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/types/catalog";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import { liveLegacyProduct, livePilotProduct, lookupFromAnswer } from "@/lib/stock/live-overlay";
import type { LiveState } from "@/lib/stock/live-rules";

/**
 * Live warehouse stock on a prerendered product page (Shipnity link step 4, owner 28/10). The page renders with the
 * stock the server rendered (live since 11/11 — src/lib/stock/live-overlay.ts; the build's own stock until its first
 * regeneration), then asks /api/stock/<slug> once and re-labels its options with the SAME overlay: "in" sells, "out" shows
 * "สินค้าหมด", "ask" asks about stock on LINE. Options the answer leaves out keep the rendered state. A failed request changes nothing. The cart and
 * checkout re-check on the server, so this is display only.
 */

interface LiveAnswer {
  o: Record<string, LiveState>;
  p: LiveState | null;
  q?: Record<string, number>;
  pq?: number | null;
}

/** The warehouse count per option (`o`) or for a product without options (`p`), as /api/stock sends it (capped there:
 *  COUNT_CEILING + 1 = "more than"). Empty until the answer arrives — nothing is shown from the build. `settled` = the
 *  request finished (answer or not): a count line keeps its height only until then (checker #1063 round 1). */
export interface LiveCounts {
  o: Record<string, number>;
  p: number | null;
  settled: boolean;
}

const countsOf = (a: LiveAnswer | null, settled: boolean): LiveCounts => ({ o: a?.q ?? {}, p: a?.pq ?? null, settled });

function useLiveAnswer(slug: string): [LiveAnswer | null, boolean] {
  const [answer, setAnswer] = useState<LiveAnswer | null>(null);
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    let alive = true;
    fetch(`/api/stock/${encodeURIComponent(slug)}`, { credentials: "omit" })
      .then((r) => (r.ok ? (r.json() as Promise<LiveAnswer>) : null))
      .then((a) => {
        if (alive && a && typeof a === "object" && a.o) setAnswer(a);
      })
      .catch(() => {
        /* no live answer — the built stock stays */
      })
      .finally(() => {
        if (alive) setSettled(true);
      });
    return () => {
      alive = false;
    };
  }, [slug]);
  return [answer, settled];
}

/** A legacy product with its options' availability replaced by the live answer (same object until it arrives). */
export function useLiveLegacyProduct(product: Product): { product: Product; counts: LiveCounts } {
  const [live, settled] = useLiveAnswer(product.slug);
  const relabelled = useMemo(() => (live ? liveLegacyProduct(product, lookupFromAnswer(product.slug, live)) : product), [product, live]);
  return { product: relabelled, counts: useMemo(() => countsOf(live, settled), [live, settled]) };
}

/** A ProductMaster product with its variants' availability replaced by the live answer. */
export function useLivePilotProduct(product: StorefrontProductView): { product: StorefrontProductView; counts: LiveCounts } {
  const [live, settled] = useLiveAnswer(product.slug);
  // The same rule the product cards use (src/lib/stock/card-stock.ts), so a card and its page never disagree.
  const relabelled = useMemo(() => (live ? livePilotProduct(product, lookupFromAnswer(product.slug, live)) : product), [product, live]);
  return { product: relabelled, counts: useMemo(() => countsOf(live, settled), [live, settled]) };
}
