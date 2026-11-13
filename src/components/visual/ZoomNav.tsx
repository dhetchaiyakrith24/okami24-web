"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { previewOn } from "@/lib/preview";
import type { ZoomEngine } from "@/lib/zoom-nav";

/**
 * The "Zoom" (owner list ก10, rulings 13/11; preview only, see zoomOnClient): a tapped product card is a camera move into
 * its photo, and that move is the page change — the engine is src/lib/zoom-nav.ts. This renders nothing. Under the preview
 * the engine is attached as soon as its file has loaded (below), and a tap on a card that comes before it is held by
 * src/lib/zoom-boot.ts (inline in <head>), then zoomed.
 * The only server-HTML trace of the Zoom for everyone: `data-zoom-hero` on the product photo boxes and `data-zoom-pilot`
 * on the pilot cards (PilotProductCard) — attributes nothing else reads. Every case the engine refuses (reduced motion,
 * Save-Data, a modified click, no View Transitions …) is the plain link.
 */

// Nothing here changes while the page is open.
const subscribe = () => () => {};
/** Browsers the engine can run in: same-document View Transitions (the camera runs on the browser's snapshot of the page)
 *  and Web Animations with their promises. */
function zoomSupported(): boolean {
  try {
    return (
      typeof (document as Document & { startViewTransition?: unknown }).startViewTransition === "function" &&
      typeof Element.prototype.animate === "function" &&
      typeof Animation !== "undefined" &&
      "finished" in Animation.prototype
    );
  } catch {
    return false;
  }
}
const zoomOnServer = () => false;
/** Preview only (owner 13/11 after testing on his phone and computer: a hitch before the zoom, the page moving after it,
 *  stutter on Caliburn G5, and on wide desktops the zoom lands to one side). Everyone else gets the plain link, as before
 *  #1443, and the engine is never fetched. The owner tries the rework through `?preview=zoom` (TEAM_RULES 13.3: a look on
 *  every card opens to everyone only after he taps it on his phone). */
const zoomOnClient = () => previewOn("zoom") && zoomSupported();

/** True only under the "zoom" preview, in a browser the Zoom runs in, after hydration (false on the server and the first
 *  render). */
export function useZoomOn(): boolean {
  return useSyncExternalStore(subscribe, zoomOnClient, zoomOnServer);
}

/** What src/lib/zoom-boot.ts left on the page: the tap it holds, and the plain page change it falls back to. */
type HeldTap = { a: HTMLAnchorElement; h: string; t: number; k: number };
type Boot = { q: HeldTap | null; on: boolean; push: ((href: string) => void) | null };
const boot = (): Boot | undefined => (window as Window & { __okZoom?: Boot }).__okZoom;

/**
 * Under the preview the engine is attached the moment its file has loaded — not after hydration: on a slow phone (4× CPU)
 * hydrating a long list takes seconds, and a first tap came before it (checker 14/11: the engine arrived 6.6–8 s after
 * load). This module is evaluated first thing in <body> (layout.tsx), so the engine starts downloading at the start of
 * hydration. Its page changes go through `router` below: the real router once ZoomNav has hydrated (useRouter), held until
 * then — a zoom started before that keeps the camera on the card until the page can change. Nothing for anyone else.
 */
type Router = { push: (href: string, opts?: { scroll?: boolean }) => void; prefetch: (href: string) => void };
/** Longest a zoom started before hydration waits for the router before the browser changes page itself. */
const ROUTER_WAIT_MS = 1500;
let real: Router | null = null;
const pending: (() => void)[] = [];
const router: Router = {
  // Held until hydration hands over the real router — and if that never comes (a hydration error), the browser's own page
  // change after ROUTER_WAIT_MS, so a tap can never end on the list.
  push: (href, opts) => {
    if (real) return real.push(href, opts);
    const fallback = window.setTimeout(() => {
      if (!real) location.assign(href);
    }, ROUTER_WAIT_MS);
    pending.push(() => {
      window.clearTimeout(fallback);
      real?.push(href, opts);
    });
  },
  prefetch: (href) => real?.prefetch(href),
};
let engine: ZoomEngine | null = null;
if (typeof window !== "undefined" && zoomOnClient()) {
  void import("@/lib/zoom-nav")
    .then(({ attachZoom }) => {
      engine = attachZoom(router);
      // The tap zoom-boot.ts is holding (if any) is this engine's now.
      const z = boot();
      if (!z) return;
      z.on = true;
      const held = z.q;
      if (!held) return;
      z.q = null;
      window.clearTimeout(held.k);
      held.a.style.transform = "";
      if (!engine.zoom(held.a)) (z.push ?? ((h: string) => location.assign(h)))(held.h);
    })
    .catch(() => {});
}

/** Mounted once, first in <body> (root layout). Renders nothing: hands the engine the real router once hydrated. */
export function ZoomNav() {
  const on = useZoomOn();
  const next = useRouter();
  useEffect(() => {
    if (!on) return;
    real = next;
    const z = boot();
    // A tap still held when the page has hydrated falls back to the router's page change, not a full page load.
    if (z) z.push = (href) => next.push(href);
    for (const run of pending.splice(0)) run();
    // The router registers its popstate handler in its own effect, which runs after this one (it is the parent): one
    // task later the engine's zoom-out listener goes behind it (if the engine was attached before hydration).
    const behind = window.setTimeout(() => engine?.afterRouter(), 0);
    return () => {
      window.clearTimeout(behind);
      if (real === next) real = null;
      if (z) z.push = null;
    };
  }, [on, next]);
  // The engine lives as long as the page (the root layout never unmounts); nothing to detach here.
  void engine;
  return null;
}
