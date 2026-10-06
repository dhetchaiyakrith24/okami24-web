"use client";

import { useEffect } from "react";

/**
 * Makes "save image" harder on every picture of the site (owner 2026-10-06: photos were being
 * saved as clean transparent cut-outs, ready to reuse elsewhere).
 *
 * One document-level listener, the same shape as LineClickTracker: it covers every <img> present
 * or future without any component knowing it exists, and adds no element over the pictures — so
 * nothing can block a tap on a card, a swipe in a gallery or a colour swatch. Pixels, sizes and
 * the HTML that search engines read are unchanged.
 *
 * - `contextmenu` on an image is cancelled: desktop right-click, and the long-press menu of
 *   Android Chrome (which fires `contextmenu`). iOS Safari's long-press menu is switched off by
 *   `-webkit-touch-callout: none` in globals.css instead, since it fires no cancellable event.
 * - `dragstart` on an image is cancelled, so a picture cannot be dragged to the desktop.
 * Anything else — text, links without a picture, form fields — keeps the normal menu.
 *
 * Not a lock: a screenshot still works (it loses the transparency and is capped at screen size).
 * Renders nothing. Mounted once in the root layout.
 */
export function ImageSaveGuard() {
  useEffect(() => {
    const onImageEvent = (event: Event) => {
      if (event.target instanceof HTMLImageElement) event.preventDefault();
    };
    document.addEventListener("contextmenu", onImageEvent, { capture: true });
    document.addEventListener("dragstart", onImageEvent, { capture: true });
    return () => {
      document.removeEventListener("contextmenu", onImageEvent, { capture: true });
      document.removeEventListener("dragstart", onImageEvent, { capture: true });
    };
  }, []);
  return null;
}
