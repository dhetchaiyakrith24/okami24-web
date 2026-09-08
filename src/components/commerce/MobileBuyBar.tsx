"use client";

import type { ReactNode } from "react";

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
export function MobileBuyBar({ priceText, optionLabel, children }: { priceText: string | null; optionLabel: string | null; children: ReactNode }) {
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
        <div className="shrink-0">{children}</div>
      </div>
    </div>
  );
}
