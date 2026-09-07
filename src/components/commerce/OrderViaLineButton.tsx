"use client";

import { useState } from "react";
import { CONTACT } from "@/data/contact";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

/**
 * The buy button while online ordering is switched off (src/lib/commerce/ordering-mode.ts —
 * owner decision 2026-09-07). Replaces "Add to cart" on the product page; the customer still buys,
 * through LINE @okm24 instead of the cart, so the site stays a shop and not a brochure.
 *
 * Two things happen on one tap, in this order, and both inside the click so the browser treats
 * them as user-initiated:
 *   1. the clipboard gets "สนใจ <product> <selected colour/flavour> — @okm24" (owner's wording,
 *      2026-09-07) — the customer opens LINE and pastes instead of typing, and if the LINE link
 *      does not open on their device, the ID is already in their hands;
 *   2. the anchor navigates to the shop's LINE link (lin.ee) in a new tab — a plain <a>, not
 *      window.open() after an await, because popup blockers kill the latter.
 * The small line under the button says what the tap does BEFORE it (what the owner approved —
 * it promises nothing the link cannot do) and confirms the copy AFTER it. Clipboard failures
 * (insecure context, permission) are swallowed: the LINE link still opens, which is the part that
 * matters.
 *
 * Same visual weight as the primary Button (bg-ember) — this is THE buy action while it is on.
 */
const buttonClasses =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-semibold tracking-tight text-[#181008] transition-colors duration-200 hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-ember";

export function OrderViaLineButton({
  productName,
  variantLabel = null,
  className,
  hideHint = false,
}: {
  productName: string;
  /** The colour/flavour the customer has selected right now, if the product has options. */
  variantLabel?: string | null;
  className?: string;
  /** Mobile sticky bar (mobile round 2026-09-08): the bar has no room for the helper line, so it
   *  renders the button alone. The copy-to-clipboard behaviour is unchanged; only the visible
   *  hint/confirmation line is omitted. Default false = exactly the original render. */
  hideHint?: boolean;
}) {
  const { dict } = useLocale();
  const [copied, setCopied] = useState(false);
  const clipboardText = `${dict.productActions.orderOnLineClipboardPrefix} ${[productName, variantLabel].filter(Boolean).join(" ")} — ${CONTACT.lineId}`;

  const copyProductDetails = () => {
    try {
      const clipboard = typeof navigator !== "undefined" ? navigator.clipboard : undefined;
      if (!clipboard?.writeText) return;
      clipboard
        .writeText(clipboardText)
        .then(() => setCopied(true))
        .catch(() => {
          /* the LINE link still opens — nothing to tell the customer */
        });
    } catch {
      /* same */
    }
  };

  if (hideHint) {
    return (
      <a href={CONTACT.lineUrl} target="_blank" rel="noopener noreferrer" onClick={copyProductDetails} className={cn(buttonClasses, className)}>
        {dict.productActions.orderOnLineCta}
      </a>
    );
  }

  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      <a href={CONTACT.lineUrl} target="_blank" rel="noopener noreferrer" onClick={copyProductDetails} className={buttonClasses}>
        {dict.productActions.orderOnLineCta}
      </a>
      <span className="text-xs text-foreground-muted" aria-live="polite">
        {copied ? dict.productActions.orderOnLineCopied : dict.productActions.orderOnLineHint}
      </span>
    </div>
  );
}
