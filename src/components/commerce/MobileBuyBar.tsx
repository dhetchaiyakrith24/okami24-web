"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ShoppingCart } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useCartCount, useCartLanded } from "@/components/commerce/cart-count";

/**
 * The cart button inside the buy bar (cart-ready round 24/10, owner: "แถบนี้ตามไปทุกหน้า" — the floating bubble sat over
 * the page above the bar). Same glass look and ember badge as the bubble, sized to the bar's 44px row; shown only while
 * the cart has items. The bubble is hidden by globals.css whenever this bar is on the page, so there is one cart button.
 */
function CartBarButton({ orderingEnabled }: { orderingEnabled: boolean }) {
  const { dict } = useLocale();
  const count = useCartCount(orderingEnabled);
  const bump = useCartLanded();
  if (count <= 0) return null;
  return (
    <Link
      data-cart-target
      href="/cart"
      aria-label={`${dict.nav.cart} (${count})`}
      className="relative flex size-11 shrink-0 items-center justify-center rounded-full border border-surface-border bg-surface-1/95 text-foreground transition-colors hover:border-ember/50 focus-visible:outline-2 focus-visible:outline-ember"
    >
      <ShoppingCart size={19} aria-hidden />
      <span
        key={bump}
        aria-hidden
        className="okami-cart-badge absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ember px-1.5 text-[11px] font-bold leading-5 tabular-nums text-[#181008] ring-2 ring-surface-0"
      >
        {count > 9 ? "9+" : count}
      </span>
    </Link>
  );
}

/**
 * Sticky buy bar pinned to the bottom of the phone screen — MOBILE_SPEC M2.4 + owner adjustment
 * P2, chat A (2026-09-08). Shows the price and the name of the option currently selected, and
 * whatever `ProductBuyAction` decides is the buy button right now: while online ordering is
 * off that is "สั่งซื้อทางไลน์ @okm24"; when the owner switches the cart back on it becomes
 * "เพิ่มลงตะกร้า" with no change to this file. The `children` slot IS that shared action, so the
 * bar never re-implements the decision.
 *
 * Making room for it: `globals.css` gives `body` bottom padding whenever a `.mobile-buy-bar`
 * exists on the page (phone/tablet widths only) so the last line of the footer can still be
 * read, and lifts the floating LINE button above the bar (owner decision B-ก). Desktop never
 * renders this (`lg:hidden`), so its layout is untouched.
 *
 * Height: 56px content row + the device's home-indicator inset (owner, 2026-09-08). While the
 * bar is on screen the floating LINE button is hidden on phones (globals.css) — two ways to LINE
 * on one screen was the owner's other note from the real-phone test. No new
 * wording — the price is the number the page already shows; the option name is the selected
 * chip's own label.
 */
export function MobileBuyBar({
  priceText,
  optionLabel,
  orderingEnabled,
  children,
}: {
  priceText: string | null;
  optionLabel: string | null;
  orderingEnabled: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className="mobile-buy-bar fixed inset-x-0 bottom-0 z-30 border-t border-surface-border-soft bg-surface-0/90 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {/* 56px row (owner after the real-phone test 2026-09-08: 64 was "a touch big"); the button
          inside keeps its 44px minimum. */}
      <div className="mx-auto flex min-h-14 w-full max-w-[1400px] items-center gap-3 px-5 py-1.5 sm:px-8">
        <div className="min-w-0 flex-1">
          {optionLabel && <p className="truncate text-xs text-foreground-muted">{optionLabel}</p>}
          {priceText && <p className="font-display text-lg font-bold leading-tight text-foreground">{priceText}</p>}
        </div>
        <CartBarButton orderingEnabled={orderingEnabled} />
        <div className="shrink-0">{children}</div>
      </div>
    </div>
  );
}
