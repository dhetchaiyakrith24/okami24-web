"use client";

import { useCallback, useEffect, useState } from "react";
import { CONTACT } from "@/data/contact";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LineOrderDialog } from "@/components/commerce/LineOrderDialog";
import { LINE_ORDER_COPY } from "@/i18n/line-order-copy";
import { lineOaMessageUrl, lineOrderMessage } from "@/lib/line-order";
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
 *
 * 19/10 (owner): the link is LINE's ready-message link (src/lib/line-order.ts) — the shop's chat opens with the product,
 * the picked option, a code and the page already typed. A touch device follows it (LINE opens); a mouse device gets
 * LineOrderDialog on the same page instead (QR to scan with the phone + the message to copy). The clipboard copy stays.
 */
const buttonClasses =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-semibold tracking-tight text-[#181008] transition-colors duration-200 hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-ember";

export function OrderViaLineButton({
  productName,
  variantLabel = null,
  className,
  hideHint = false,
  productCode,
  pageUrl: canonicalUrl,
  mode = "order",
  label,
  linkClassName,
}: {
  /** "ask" = the sold-out enquiry (same dialog, "ask" wording, outline button styled by the caller). */
  mode?: "order" | "ask";
  /** Canonical page address for the message; without it the current page address is used. */
  pageUrl?: string;
  /** Button text when not the order CTA (sold-out: "สอบถามทาง LINE"). */
  label?: string;
  /** Replaces the ember button classes (sold-out outline button). */
  linkClassName?: string;
  productName: string;
  /** What the admin looks up: the picked Shipnity variant code when there is one, else the product slug. */
  productCode: string;
  /** The colour/flavour the customer has selected right now, if the product has options. */
  variantLabel?: string | null;
  className?: string;
  /** Mobile sticky bar (mobile round 2026-09-08): the bar has no room for the helper line, so it
   *  renders the button alone. The copy-to-clipboard behaviour is unchanged; only the visible
   *  hint/confirmation line is omitted. Default false = exactly the original render. */
  hideHint?: boolean;
}) {
  const { dict, locale } = useLocale();
  const lineCopy = LINE_ORDER_COPY[locale];
  const [copied, setCopied] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pageUrl, setPageUrl] = useState("");
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    setPageUrl(window.location.origin + window.location.pathname);
    setTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);
  const message = lineOrderMessage({
    lead: mode === "ask" ? lineCopy.leadAsk : lineCopy.leadOrder,
    productName,
    optionLabel: lineCopy.optionLabel,
    option: variantLabel,
    codeLabel: lineCopy.codeLabel,
    code: productCode,
    url: canonicalUrl ?? pageUrl,
  });
  const href = lineOaMessageUrl(message);
  const closeDialog = useCallback(() => setDialogOpen(false), []);
  const clipboardText = `${dict.productActions.orderOnLineClipboardPrefix} ${[productName, variantLabel].filter(Boolean).join(" ")} — ${CONTACT.lineId}`;

  const onClick = (e: React.MouseEvent) => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      copyProductDetails();
    } else {
      e.preventDefault();
      setDialogOpen(true);
    }
  };

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

  const dialog = dialogOpen ? <LineOrderDialog message={message} mode={mode} onClose={closeDialog} /> : null;

  if (hideHint) {
    return (
      <>
        <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} data-line-spot="buy" className={linkClassName ?? cn(buttonClasses, className)}>
          {label ?? dict.productActions.orderOnLineCta}
        </a>
        {dialog}
      </>
    );
  }

  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} data-line-spot="buy" className={buttonClasses}>
        {dict.productActions.orderOnLineCta}
      </a>
      <span className="text-xs text-foreground-muted" aria-live="polite">
        {touch ? lineCopy.touchHint : copied ? dict.productActions.orderOnLineCopied : dict.productActions.orderOnLineHint}
      </span>
      {dialog}
    </div>
  );
}
