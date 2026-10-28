"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { playSlash } from "@/components/brand/slash";

/** Pages where the cut never plays (designer "เงาจันทร์" 29/10: no theme on cart, checkout or staff; order pages likewise). */
const QUIET = /^\/(cart|checkout|staff|orders)(\/|$)/;
/** How long the page waits before it navigates, so the cut is seen on the card (designer: ≤ 150 ms). */
const NAV_DELAY = 120;

/**
 * The product-card cut (samurai theme, owner 29/10: "เล็ก สั้น คม หรู" — small, short, sharp, red): a plain click on a
 * product card (`a[data-card-cut]`, ProductCard + PilotProductCard) draws the brand slash across the card's photo, then
 * opens the product. One capture listener for the whole site — it runs before the card's Next Link and cancels the
 * click, which makes Link skip its own navigation (`e.defaultPrevented`, next/dist/client/app-dir/link.js), so the
 * page moves once, NAV_DELAY later. Modified clicks (new tab), the heart button inside the card, reduced motion and
 * the quiet pages keep the card's normal behaviour. Renders nothing.
 */
export function CardCut() {
  const router = useRouter();
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = e.target as Element | null;
      const card = target?.closest<HTMLAnchorElement>("a[data-card-cut]");
      if (!card || target?.closest("button")) return;
      if (QUIET.test(window.location.pathname)) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const href = card.getAttribute("href");
      if (!href) return;
      e.preventDefault();
      const photo = card.querySelector("img") ?? card;
      const w = card.getBoundingClientRect().width;
      playSlash(photo, { length: Math.min(w * 0.72, 230), thickness: 4, draw: 90, hold: 40, fade: 180, angle: -20, shadow: true });
      window.setTimeout(() => router.push(href), NAV_DELAY);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);
  return null;
}
