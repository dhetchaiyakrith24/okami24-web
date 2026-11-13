"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { previewOn } from "@/lib/preview";

/**
 * The "Zoom" (owner list ก10, ruling 13/11; shipped to everyone 13/11): a tapped product card zooms into its photo and
 * that zoom is the page change — the engine is src/lib/zoom-nav.ts. The server HTML is the same for everyone: this renders
 * nothing, and the engine is fetched only after the page has loaded (when the browser is idle), so it never competes with
 * the page's first paint. A tap before it is there, and every case the engine refuses (reduced motion, Save-Data, a
 * modified click …), is the plain link.
 */

// Nothing here changes while the page is open.
const subscribe = () => () => {};
/** Browsers the engine can run in: Web Animations with their promises, and color-mix() (the dim behind the photo). */
function zoomSupported(): boolean {
  try {
    return (
      typeof Element.prototype.animate === "function" &&
      typeof Animation !== "undefined" &&
      "finished" in Animation.prototype &&
      CSS.supports("color", "color-mix(in srgb, red 50%, transparent)")
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
    let detach: (() => void) | undefined;
    let gone = false;
    const load = () => {
      void import("@/lib/zoom-nav").then(({ attachZoom }) => {
        if (!gone) detach = attachZoom(router);
      });
    };
    // Not needed before the first tap on a card: wait until the page's own loading is done.
    const idle = "requestIdleCallback" in window;
    const handle = idle ? window.requestIdleCallback(load, { timeout: 2500 }) : window.setTimeout(load, 1200);
    return () => {
      gone = true;
      if (idle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      detach?.();
    };
  }, [on, router]);
  return null;
}
