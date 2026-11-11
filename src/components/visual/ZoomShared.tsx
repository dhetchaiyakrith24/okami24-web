"use client";
/// <reference types="react/canary" />
import { ViewTransition, useSyncExternalStore, type ReactNode } from "react";
import { previewWord } from "@/lib/preview";

/**
 * "Zoom" prototype (owner list ก10, reference reel 30/10: a wall of products → tap one → the camera zooms into it,
 * standing on a lit shelf). The product card's photo and the product page's hero share one view-transition name, so
 * the browser morphs the card photo into the hero on the way in and back on the way out — React's <ViewTransition>
 * on top of the browser's View Transitions API (node_modules/next/dist/docs/01-app/02-guides/view-transitions.md):
 * no package, no config. A browser without the API simply navigates as before.
 *
 * PREVIEW ONLY (owner 12/11 preview links, src/lib/preview.ts): it runs on a device that opened okami24.store/?preview=zoom
 * (the Zoom alone) or ?preview=cards-zoom (the "cards" look + the Zoom). Everyone else gets exactly today's tree — the
 * server and the first client render always answer "off" (the server never reads the preview cookie), so no
 * <ViewTransition>, no shelf, no hydration mismatch; a previewing device switches on right after hydration.
 * Only the slugs below get it (one product page, for the owner to judge). Motion off in the OS = no morph and no shelf
 * animation (globals.css "okami-zoom", scoped to the same words). When the owner approves: drop the gate here and the
 * html[data-preview] prefixes in globals.css.
 */
export const ZOOM_PROTO_SLUGS: ReadonlySet<string> = new Set(["caliburn-g5"]);
/** Preview words that switch the Zoom on — keep in step with the html[data-preview] selectors in globals.css. */
export const ZOOM_PREVIEW_WORDS: ReadonlySet<string> = new Set(["zoom", "cards-zoom"]);

// <html data-preview> is set once by the inline head script before the first paint and only changes on a reload, so
// there is nothing to subscribe to.
const subscribe = () => () => {};
const zoomOnClient = () => ZOOM_PREVIEW_WORDS.has(previewWord() ?? "");
const zoomOnServer = () => false;

/** True only on a device previewing the Zoom, and only after hydration (false on the server and the first render). */
export function useZoomPreview(): boolean {
  return useSyncExternalStore(subscribe, zoomOnClient, zoomOnServer);
}

export function ZoomShared({ slug, children }: { slug: string; children: ReactNode }) {
  const on = useZoomPreview();
  if (!on || !ZOOM_PROTO_SLUGS.has(slug)) return <>{children}</>;
  // default="none": the pair animates only as a pair (a card that merely scrolls away does not crossfade on every
  // navigation); `share` keeps the morph alive with default="none" (the guide's warning).
  return (
    <ViewTransition name={`okami-zoom-${slug}`} share="okami-zoom" default="none">
      {children}
    </ViewTransition>
  );
}
