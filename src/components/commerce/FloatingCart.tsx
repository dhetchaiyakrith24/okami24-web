"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { CART_ADDED_EVENT, type CartAddedDetail } from "@/components/commerce/AddToCartForm";
import { cn } from "@/lib/utils";

/** Pages that are the cart flow themselves (or staff) — the button would only point at where the visitor already is. */
const HIDDEN_ON = ["/cart", "/checkout", "/orders", "/staff"];

/** The visitor's cart count from /api/cart/count; null = could not ask (offline, server busy) — keep the last known count. */
async function fetchCount(): Promise<number | null> {
  try {
    const res = await fetch("/api/cart/count", { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { count?: number };
    return typeof data.count === "number" ? data.count : 0;
  } catch {
    return null;
  }
}

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
 */
export function FloatingCart({ orderingEnabled }: { orderingEnabled: boolean }) {
  const { dict } = useLocale();
  const pathname = usePathname();
  const [count, setCount] = useState(0);
  const [bump, setBump] = useState(0);
  const [calm, setCalm] = useState(false);
  const fabRef = useRef<HTMLAnchorElement>(null);
  const hidden = HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  const refresh = useCallback(() => {
    void fetchCount().then((n) => {
      if (n !== null) setCount(n);
    });
  }, []);

  useEffect(() => {
    if (!orderingEnabled) return;
    let live = true;
    void fetchCount().then((n) => {
      if (live && n !== null) setCount(n);
    });
    return () => {
      live = false;
    };
  }, [orderingEnabled, pathname]);

  useEffect(() => {
    if (!orderingEnabled) return;
    const onShow = () => refresh();
    window.addEventListener("pageshow", onShow);
    window.addEventListener("focus", onShow);
    return () => {
      window.removeEventListener("pageshow", onShow);
      window.removeEventListener("focus", onShow);
    };
  }, [orderingEnabled, refresh]);

  useEffect(() => {
    if (!orderingEnabled) return;
    const onAdded = (e: Event) => {
      const { count: next, from } = (e as CustomEvent<CartAddedDetail>).detail;
      if (next <= 0) {
        refresh(); // the answer could not read the new cart cookie yet — ask once more
        return;
      }
      if (reducedMotion()) {
        setCount(next);
        setCalm(true);
        window.setTimeout(() => setCalm(false), 1200);
        return;
      }
      setCount(next);
      // Wait one frame so a first-time bubble is in the layout before measuring where the dot lands.
      requestAnimationFrame(() => {
        const fab = fabRef.current;
        if (!fab) return;
        const to = fab.getBoundingClientRect();
        const dx = to.left + to.width / 2 - from.x;
        const dy = to.top + to.height / 2 - from.y;
        const duration = Math.min(620, Math.max(380, Math.hypot(dx, dy) * 0.6));
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
          setBump((b) => b + 1);
          fab.animate([{ transform: "scale(1)" }, { transform: "scale(1.14)" }, { transform: "scale(0.96)" }, { transform: "scale(1)" }], {
            duration: 360,
            easing: "ease-out",
          });
          fab.animate(
            [{ boxShadow: "0 0 0 0 rgba(255,106,44,.5)" }, { boxShadow: "0 0 0 12px rgba(255,106,44,0)" }],
            { duration: 700, easing: "ease-out" },
          );
        };
      });
    };
    window.addEventListener(CART_ADDED_EVENT, onAdded);
    return () => window.removeEventListener(CART_ADDED_EVENT, onAdded);
  }, [orderingEnabled, refresh]);

  if (!orderingEnabled || hidden || count <= 0) return null;

  const label = dict.nav.cart;
  return (
    <Link
      ref={fabRef}
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
