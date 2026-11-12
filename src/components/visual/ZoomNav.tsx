"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { previewWord } from "@/lib/preview";

/**
 * The "Zoom" (owner list ก10, ruling 13/11): a tapped product card zooms into its photo and that zoom is the page change —
 * the engine is src/lib/zoom-nav.ts. PREVIEW ONLY (owner 12/11 preview links, src/lib/preview.ts): on a device that opened
 * okami24.store/?preview=zoom (the Zoom alone) or ?preview=cards-zoom (the "cards" look + the Zoom). Everyone else gets
 * today's site: this renders nothing, attaches nothing, and the engine file is fetched only on a previewing device.
 * When the owner approves: drop the preview gate here and the html[data-preview] prefixes in globals.css "okami-zoom".
 */
/** Preview words that switch the Zoom on — keep in step with the html[data-preview] selectors in globals.css. */
export const ZOOM_PREVIEW_WORDS: ReadonlySet<string> = new Set(["zoom", "cards-zoom"]);

// <html data-preview> is set once by the inline head script before the first paint and only changes on a reload.
const subscribe = () => () => {};
const zoomOnClient = () => ZOOM_PREVIEW_WORDS.has(previewWord() ?? "");
const zoomOnServer = () => false;

/** True only on a device previewing the Zoom, and only after hydration (false on the server and the first render). */
export function useZoomPreview(): boolean {
  return useSyncExternalStore(subscribe, zoomOnClient, zoomOnServer);
}

/** Mounted once in the root layout. Renders nothing. */
export function ZoomNav() {
  const on = useZoomPreview();
  const router = useRouter();
  useEffect(() => {
    if (!on) return;
    let detach: (() => void) | undefined;
    let gone = false;
    void import("@/lib/zoom-nav").then(({ attachZoom }) => {
      if (!gone) detach = attachZoom(router);
    });
    return () => {
      gone = true;
      detach?.();
    };
  }, [on, router]);
  return null;
}
