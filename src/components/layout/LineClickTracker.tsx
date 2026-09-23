"use client";

import { useEffect } from "react";
import { CONTACT } from "@/data/contact";
import { LINE_CLICK_ENDPOINT } from "@/lib/metrics/line-click-input";

/**
 * Counts clicks on the site's LINE links (round 8, owner ruling 2026-09-23 "option ก": in-site,
 * no cookies, nothing sent to a third party).
 *
 * One document-level listener instead of an `onClick` on each of the ~15 anchors that read
 * `CONTACT.lineUrl`: every LINE link on the site, present or future, is counted by the same
 * mechanism, and no component has to know the counter exists. The listener runs in the capture
 * phase so a component's own handler (the order button copies product text to the clipboard)
 * cannot stop it, and it never calls `preventDefault` — LINE opens exactly as before.
 *
 * What is sent: the page path (query string and hash are stripped again on the server) and one
 * word for the spot — `data-line-spot` on the anchor or an ancestor, else "footer" when the link
 * sits inside `<footer>`, else "other". `sendBeacon` is used so the request survives the tab
 * navigating away; the `fetch` fallback is for the few browsers without it.
 *
 * Renders nothing. Mounted once in the root layout.
 */
export function LineClickTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0) return;
      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement) || !anchor.href.startsWith(CONTACT.lineUrl)) return;

      const spot = anchor.closest("[data-line-spot]")?.getAttribute("data-line-spot") ?? (anchor.closest("footer") ? "footer" : "other");
      const payload = JSON.stringify({ page: window.location.pathname, spot });

      try {
        if (typeof navigator.sendBeacon === "function" && navigator.sendBeacon(LINE_CLICK_ENDPOINT, payload)) return;
      } catch {
        // fall through to fetch
      }
      try {
        void fetch(LINE_CLICK_ENDPOINT, { method: "POST", body: payload, keepalive: true, credentials: "omit" }).catch(() => {});
      } catch {
        // a counter must never be the reason a click fails
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
