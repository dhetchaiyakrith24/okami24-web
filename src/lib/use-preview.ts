"use client";

import { useSyncExternalStore } from "react";
import { previewOn } from "@/lib/preview";

const noSubscribe = () => () => {};

/**
 * True when this device runs the preview `word` (src/lib/preview.ts). Always false on the server and during hydration,
 * then the real answer — so a draft that needs MARKUP (not just CSS) renders on the owner's device only, after load, and
 * the HTML customers and search engines get stays exactly today's. The word is fixed for the page's life (the boot script
 * sets it before the first paint), so there is nothing to subscribe to.
 */
export function usePreview(word: string): boolean {
  return useSyncExternalStore(noSubscribe, () => previewOn(word), () => false);
}
