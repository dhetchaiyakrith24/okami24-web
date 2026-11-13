"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { previewOn } from "@/lib/preview";
import type { ZoomEngine } from "@/lib/zoom-nav";

/**
 * The "Zoom" (owner list ก10, rulings 13/11; preview only, see zoomOnClient): a tapped product card is a camera move into
 * its photo, and that move is the page change — the engine is src/lib/zoom-nav.ts. This renders nothing. The engine is
 * fetched right after hydration (preview only); a tap on a card that comes before it is held a moment, then zoomed.
 * The only server-HTML trace of the Zoom for everyone: `data-zoom-hero` on the product photo boxes and `data-zoom-pilot`
 * on the pilot cards (PilotProductCard) — attributes nothing else reads. Every case the engine refuses (reduced motion,
 * Save-Data, a modified click, no View Transitions …) is the plain link.
 */

/** Longest a tap on a card waits for the engine (the first tap on a fresh page) before it is the plain page change. */
const HOLD_MS = 150;

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

/** Mounted once in the root layout. Renders nothing. */
export function ZoomNav() {
  const on = useZoomOn();
  const router = useRouter();
  useEffect(() => {
    if (!on) return;
    let engine: ZoomEngine | null = null;
    let gone = false;
    // Fetched right after hydration, not when the browser is idle: on the owner's iPhone (13/11 23:33) the first tap came
    // before an idle-time engine and was the plain link — "กดครั้งแรก … ต้องกดซ้ำอีกรอบถึงจะเกิดการซูม". Preview only.
    const ready = import("@/lib/zoom-nav")
      .then(({ attachZoom }) => {
        if (!gone) engine = attachZoom(router);
        return engine;
      })
      .catch(() => null);
    // A tap on a card before the engine is there is held (≤ HOLD_MS) while it finishes, then zoomed — or, if it is still
    // not there (or the Zoom does not apply to that card), the plain page change, the same as the link would do.
    const early = (e: MouseEvent) => {
      if (engine || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = e.target as Element | null;
      const card = target?.closest<HTMLAnchorElement>("a[data-card-cut]");
      const href = card?.getAttribute("href");
      if (!card || !href?.startsWith("/products/") || target?.closest("button")) return;
      e.preventDefault();
      void Promise.race([ready, new Promise<null>((r) => setTimeout(() => r(null), HOLD_MS))]).then((eng) => {
        if (gone) return;
        if (!eng || !eng.zoom(card)) router.push(href);
      });
    };
    document.addEventListener("click", early, true);
    return () => {
      gone = true;
      document.removeEventListener("click", early, true);
      engine?.detach();
    };
  }, [on, router]);
  return null;
}
