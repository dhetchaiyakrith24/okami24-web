"use client";

import { useEffect } from "react";

/**
 * In-page links on a product page (#option-…, #specifications, #story-…) used to add a browser history entry each, so a
 * visitor who came from the cart, tapped a colour tile or a section link, then pressed Back stayed on the product page
 * (owner 26/10: "กดย้อนกลับแต่มันไม่กลับมาตรงหน้าระบบตะกร้า"). Here a same-page hash click REPLACES the current entry
 * instead: Back now leaves the page. The hash still changes and `hashchange` still fires (ProductHero picks the option
 * from it); other targets are scrolled to as the browser would (scroll-margin respected, smooth unless reduced motion).
 * A click another handler already handled (preventDefault), a modified click or a non-hash link is left alone.
 */
export function HashLinksKeepHistory() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.('a[href^="#"]');
      const id = link ? decodeURIComponent(link.getAttribute("href")!.slice(1)) : "";
      if (!id) return;
      const target = document.getElementById(id);
      if (!target && !id.startsWith("option-")) return;
      e.preventDefault();
      const old = window.location.href;
      history.replaceState(history.state, "", `#${encodeURIComponent(id)}`);
      window.dispatchEvent(new HashChangeEvent("hashchange", { oldURL: old, newURL: window.location.href }));
      if (target && !id.startsWith("option-")) {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
