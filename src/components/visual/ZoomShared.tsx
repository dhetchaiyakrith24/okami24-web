/// <reference types="react/canary" />
import { ViewTransition, type ReactNode } from "react";

/**
 * "Zoom" prototype (owner list ก10, reference reel 30/10: a wall of products → tap one → the camera zooms into it,
 * standing on a lit shelf). The product card's photo and the product page's hero share one view-transition name, so
 * the browser morphs the card photo into the hero on the way in and back on the way out — React's <ViewTransition>
 * on top of the browser's View Transitions API (node_modules/next/dist/docs/01-app/02-guides/view-transitions.md):
 * no package, no config. A browser without the API simply navigates as before.
 *
 * PROTOTYPE: only the slugs below get it (one product page, for the owner to judge). Motion off in the OS = no morph
 * and no plinth animation (globals.css "okami-zoom").
 */
export const ZOOM_PROTO_SLUGS: ReadonlySet<string> = new Set(["caliburn-g5"]);

export function ZoomShared({ slug, children }: { slug: string; children: ReactNode }) {
  if (!ZOOM_PROTO_SLUGS.has(slug)) return <>{children}</>;
  // default="none": the pair animates only as a pair (a card that merely scrolls away does not crossfade on every
  // navigation); `share` keeps the morph alive with default="none" (the guide's warning).
  return (
    <ViewTransition name={`okami-zoom-${slug}`} share="okami-zoom" default="none">
      {children}
    </ViewTransition>
  );
}
