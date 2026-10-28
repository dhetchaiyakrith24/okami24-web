"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/types/catalog";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";

/**
 * Live warehouse stock on a prerendered product page (Shipnity link step 4, owner 28/10). The page renders with the
 * stock it was built with, then asks /api/stock/<slug> once and re-labels its options: "in" sells, "out" shows
 * "สินค้าหมด". Options the answer leaves out keep the built state. A failed request changes nothing. The cart and
 * checkout re-check on the server, so this is display only.
 */

interface LiveAnswer {
  o: Record<string, "in" | "out">;
  p: "in" | "out" | null;
}

function useLiveAnswer(slug: string): LiveAnswer | null {
  const [answer, setAnswer] = useState<LiveAnswer | null>(null);
  useEffect(() => {
    let alive = true;
    fetch(`/api/stock/${encodeURIComponent(slug)}`, { credentials: "omit" })
      .then((r) => (r.ok ? (r.json() as Promise<LiveAnswer>) : null))
      .then((a) => {
        if (alive && a && typeof a === "object" && a.o) setAnswer(a);
      })
      .catch(() => {
        /* no live answer — the built stock stays */
      });
    return () => {
      alive = false;
    };
  }, [slug]);
  return answer;
}

const toAvail = (s: "in" | "out") => (s === "in" ? ("in-stock" as const) : ("out-of-stock" as const));

/** A legacy product with its options' availability replaced by the live answer (same object until it arrives). */
export function useLiveLegacyProduct(product: Product): Product {
  const live = useLiveAnswer(product.slug);
  return useMemo(() => {
    if (!live) return product;
    const relabel = <T extends { id: string; availability?: Product["availability"] }>(v: T): T =>
      live.o[v.id] ? { ...v, availability: toAvail(live.o[v.id]) } : v;
    return {
      ...product,
      ...(live.p ? { availability: toAvail(live.p) } : {}),
      colorVariants: product.colorVariants?.map(relabel),
      flavorVariants: product.flavorVariants?.map(relabel),
    };
  }, [product, live]);
}

/** A ProductMaster product with its variants' availability replaced by the live answer. */
export function useLivePilotProduct(product: StorefrontProductView): StorefrontProductView {
  const live = useLiveAnswer(product.slug);
  return useMemo(() => {
    if (!live) return product;
    const variants = product.variants.map((v) => (live.o[v.id] ? { ...v, availabilityStatus: toAvail(live.o[v.id]) } : v));
    const productStatus =
      variants.length === 0
        ? live.p
          ? toAvail(live.p)
          : product.availabilityStatus
        : variants.some((v) => v.availabilityStatus === "in-stock")
          ? ("in-stock" as const)
          : variants.every((v) => v.availabilityStatus === "out-of-stock")
            ? ("out-of-stock" as const)
            : product.availabilityStatus;
    return { ...product, variants, availabilityStatus: productStatus };
  }, [product, live]);
}
