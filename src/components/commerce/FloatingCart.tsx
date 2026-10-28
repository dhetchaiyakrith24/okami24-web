"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { CART_ADDED_EVENT, type CartAddedDetail } from "@/components/commerce/AddToCartForm";
import { markLanded, refreshCartCount, setCartCount, useCartCount, useCartLanded, visibleCartTarget } from "@/components/commerce/cart-count";
import { cn } from "@/lib/utils";

/** Pages that are the cart flow themselves (or staff) — the button would only point at where the visitor already is. */
const HIDDEN_ON = ["/cart", "/checkout", "/orders", "/staff"];

function reducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Floating cart button, bottom-right above the LINE button (cart UX batch B, owner 24/10 — designer option A "ฟองกระจกคู่"):
 * the same glass bubble as the LINE button, the only colour is the ember count badge. Shown only while the cart has items
 * and online ordering is on. The pages are prerendered and cannot read the cart cookie, so the count comes from
 * /api/cart/count after load (and again on every in-site navigation and when the tab comes back), and straight from the
 * add-to-cart answer when the visitor adds on a product page — that is when the add moment plays: an ember dot flies from
 * the pressed button into the bubble, the bubble gives one small bounce with a single ember ring, the number rolls up.
 * Reduced motion: no flight, no bounce — the number changes and the border glows ember for a moment.
 *
 * Phone and tablet product pages (cart-ready round 24/10, owner: the bubble sat over the page above the buy bar): the
 * bubble is hidden by globals.css while `.mobile-buy-bar` is on the page and the bar's own cart button (CartBarButton)
 * shows the same count — the dot then lands there. This component stays mounted either way: it runs the add moment.
 */
export function FloatingCart({ orderingEnabled }: { orderingEnabled: boolean }) {
  const { dict } = useLocale();
  const pathname = usePathname();
  const count = useCartCount(orderingEnabled, pathname);
  const bump = useCartLanded();
  const [calm, setCalm] = useState(false);
  const hidden = HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  useEffect(() => {
    if (!orderingEnabled) return;
    const onShow = () => void refreshCartCount();
    window.addEventListener("pageshow", onShow);
    window.addEventListener("focus", onShow);
    return () => {
      window.removeEventListener("pageshow", onShow);
      window.removeEventListener("focus", onShow);
    };
  }, [orderingEnabled]);

  useEffect(() => {
    if (!orderingEnabled) return;
    const onAdded = (e: Event) => {
      const { count: next, from } = (e as CustomEvent<CartAddedDetail>).detail;
      if (next <= 0) {
        void refreshCartCount(); // the answer could not read the new cart cookie yet — ask once more
        return;
      }
      if (reducedMotion()) {
        setCartCount(next);
        setCalm(true);
        window.setTimeout(() => setCalm(false), 1200);
        return;
      }
      setCartCount(next);
      // A first-time cart button mounts only after React commits the new count — wait up to ~10 frames for it before
      // measuring where the dot lands (found in the first-add test: one frame was not always enough).
      let frames = 0;
      const fly = () => {
        const fab = visibleCartTarget();
        if (!fab) {
          if (++frames < 10) requestAnimationFrame(fly);
          return;
        }
        const to = fab.getBoundingClientRect();
        const dx = to.left + to.width / 2 - from.x;
        const dy = to.top + to.height / 2 - from.y;
        // Owner 29/10 "รู้สึกหน่วง": a quick throw (was 380–620 ms) — the slash on the pressed button already answered the tap.
        const duration = Math.min(420, Math.max(260, Math.hypot(dx, dy) * 0.4));
        const dot = document.createElement("span");
        dot.setAttribute("aria-hidden", "true");
        dot.className = "okami-cart-dot";
        dot.style.left = `${from.x - 5}px`;
        dot.style.top = `${from.y - 5}px`;
        document.body.appendChild(dot);
        const flight = dot.animate(
          [
            { transform: "translate(0, 0) scale(1)", opacity: 1 },
            { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 60}px) scale(1.1)`, opacity: 1, offset: 0.45 },
            { transform: `translate(${dx}px, ${dy}px) scale(0.5)`, opacity: 0.9 },
          ],
          { duration, easing: "cubic-bezier(.5,0,.3,1)", fill: "forwards" },
        );
        flight.onfinish = () => {
          dot.remove();
          markLanded();
          fab.animate([{ transform: "scale(1)" }, { transform: "scale(1.14)" }, { transform: "scale(0.96)" }, { transform: "scale(1)" }], {
            duration: 360,
            easing: "ease-out",
          });
          fab.animate(
            [{ boxShadow: "0 0 0 0 rgba(255,106,44,.5)" }, { boxShadow: "0 0 0 12px rgba(255,106,44,0)" }],
            { duration: 700, easing: "ease-out" },
          );
        };
      };
      requestAnimationFrame(fly);
    };
    window.addEventListener(CART_ADDED_EVENT, onAdded);
    return () => window.removeEventListener(CART_ADDED_EVENT, onAdded);
  }, [orderingEnabled]);

  if (!orderingEnabled || hidden || count <= 0) return null;

  const label = dict.nav.cart;
  return (
    <Link
      data-cart-target
      href="/cart"
      aria-label={`${label} (${count})`}
      className={cn(
        // No overflow-hidden here: the count badge sits on the bubble's corner and must not be clipped by the circle
        // (checker #792); the label clips itself inside its own span.
        "okami-cart-fab group fixed z-30 flex items-center rounded-full border bg-surface-1/95 p-3.5 text-foreground shadow-2xl backdrop-blur-md transition-[border-color,padding] duration-300 hover:border-ember/50 focus-visible:border-ember/50 focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-2 sm:hover:px-5 sm:focus-visible:px-5",
        calm ? "border-ember" : "border-surface-border",
      )}
    >
      <span className="relative flex shrink-0">
        <ShoppingCart size={20} aria-hidden />
        <span
          key={bump}
          aria-hidden
          className="okami-cart-badge absolute -right-3.5 -top-3.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ember px-1.5 text-[11px] font-bold leading-5 tabular-nums text-[#181008] ring-2 ring-surface-0"
        >
          {count > 9 ? "9+" : count}
        </span>
      </span>
      {/* ≥640: the label opens on hover / keyboard focus, the same 0fr → 1fr reveal as the LINE pill below it. */}
      <span
        aria-hidden
        className="hidden grid-cols-[0fr] opacity-0 transition-all duration-300 group-hover:grid-cols-[1fr] group-hover:opacity-100 group-focus-visible:grid-cols-[1fr] group-focus-visible:opacity-100 sm:grid"
      >
        <span className="overflow-hidden whitespace-nowrap pl-2 text-sm font-semibold">{label}</span>
      </span>
    </Link>
  );
}
