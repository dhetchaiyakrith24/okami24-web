"use client";

import { useSyncExternalStore } from "react";
import type { CardStockChanges } from "@/lib/stock/card-stock";

/**
 * Live warehouse stock for product cards (owner 31/10). The cards render with the stock they were built with; the first
 * card on a page asks /api/stock once and every card shares that answer (one request per page, not per card). The answer
 * lists only the products whose live state differs from the build; everything else keeps the build. A failed request
 * changes nothing. An answer older than a minute is asked again when the next page mounts cards. Display only — the cart
 * and checkout re-check on the server.
 */

const STALE_MS = 60_000;
let changes: CardStockChanges | null = null;
let askedAt = 0;
let inFlight = false;
const listeners = new Set<() => void>();

function ask() {
  if (inFlight || (askedAt && Date.now() - askedAt < STALE_MS)) return;
  inFlight = true;
  askedAt = Date.now();
  fetch("/api/stock", { credentials: "omit" })
    .then((r) => (r.ok ? (r.json() as Promise<{ c?: CardStockChanges }>) : null))
    .then((a) => {
      if (a && a.c && typeof a.c === "object") {
        changes = a.c;
        listeners.forEach((l) => l());
      }
    })
    .catch(() => {
      /* no live answer — the built stock stays */
    })
    .finally(() => {
      inFlight = false;
    });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  ask();
  return () => {
    listeners.delete(listener);
  };
}

/** The live differences from the build (null until the answer arrives, and always null on the server). */
export function useLiveCardStock(): CardStockChanges | null {
  return useSyncExternalStore(
    subscribe,
    () => changes,
    () => null
  );
}

/** Whether a suggestion can be bought now: live when the warehouse answered for it, else as built (the rule = card-stock.ts). */
export function canBuyNow(changes: CardStockChanges | null, item: { slug: string; inStock: boolean }): boolean {
  return changes?.[item.slug]?.s ?? item.inStock;
}

/** One card's "every option sold out", live when the warehouse answered for it, else as built. */
export function useLiveSoldOut(slug: string, builtSoldOut: boolean): boolean {
  return useLiveCardStock()?.[slug]?.o ?? builtSoldOut;
}
