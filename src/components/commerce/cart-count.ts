"use client";

import { useEffect, useSyncExternalStore } from "react";

/**
 * The visitor's cart count, shared by every cart button on the page (cart-ready round 24/10): the floating bubble and the
 * cart button inside the product page's buy bar read the same number, and one request to /api/cart/count serves both.
 * Pages are prerendered and cannot read the cart cookie, so the count is asked for after load; an add on a product page
 * sets it straight from the server's answer (AddToCartForm → CART_ADDED_EVENT).
 */
let count = 0;
let inflight: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit(): void {
  for (const l of listeners) l();
}

export function setCartCount(next: number): void {
  if (next === count) return;
  count = next;
  emit();
}

/** Ask the server again; concurrent callers share one request. A failed request keeps the last known count. */
export function refreshCartCount(): Promise<void> {
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const res = await fetch("/api/cart/count", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { count?: number };
      setCartCount(typeof data.count === "number" ? data.count : 0);
    } catch {
      // offline or server busy — keep the last known count
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The shared count; `refreshOn` changes (e.g. the pathname) trigger a fresh read. Always 0 while ordering is off. */
export function useCartCount(orderingEnabled: boolean, refreshOn?: unknown): number {
  const value = useSyncExternalStore(subscribe, () => count, () => 0);
  useEffect(() => {
    if (orderingEnabled) void refreshCartCount();
  }, [orderingEnabled, refreshOn]);
  return orderingEnabled ? value : 0;
}

/** How many add moments have landed — a cart button keys its badge on this so the number pops when the dot arrives. */
let landed = 0;
const landedListeners = new Set<() => void>();

export function markLanded(): void {
  landed += 1;
  for (const l of landedListeners) l();
}

export function useCartLanded(): number {
  return useSyncExternalStore(
    (l) => {
      landedListeners.add(l);
      return () => landedListeners.delete(l);
    },
    () => landed,
    () => 0,
  );
}

/** The cart button that is on screen right now (the bubble, or the buy bar's button on a phone product page) — where the
 *  add moment's ember dot lands. Hidden ones (display: none) have no client rects. */
export function visibleCartTarget(): HTMLElement | null {
  const all = Array.from(document.querySelectorAll<HTMLElement>("[data-cart-target]"));
  return all.find((el) => el.getClientRects().length > 0) ?? null;
}
