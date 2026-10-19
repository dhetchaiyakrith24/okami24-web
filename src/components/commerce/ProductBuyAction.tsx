"use client";

import { CONTACT } from "@/data/contact";
import { addToCartAction } from "@/app/cart/actions";
import { Button } from "@/components/ui/Button";
import { OrderViaLineButton } from "@/components/commerce/OrderViaLineButton";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

/**
 * The one buy action of a product page — mobile round, chat A (owner decision C-ก, 2026-09-08).
 *
 * Until now the three-way branch (sold out → LINE enquiry · ordering off → LINE order button ·
 * ordering on → add-to-cart form) was written out twice, once in `ProductHero` (legacy products)
 * and once in `PilotProductDetail` (ProductMaster products). The sticky bottom bar on mobile is a
 * third place that needs exactly the same decision, and the cart sheet of M5 will be a fourth, so
 * the branch now lives here and every caller renders this instead.
 *
 * Nothing about the decision changed:
 *   - `available` is whatever gate the caller already computed (legacy: `canAddToCart`; pilot:
 *     the selected variant's Shipnity signal is a confirmed "in-stock"). The server re-checks on
 *     submit either way — nothing here is trusted for money.
 *   - `orderingEnabled` comes from the server page (src/lib/commerce/ordering-mode.ts). When the
 *     owner turns the cart back on, every place that renders this component — including the
 *     mobile bar — switches to "Add to cart" with no further edit (owner requirement P2).
 *
 * The two callers used slightly different classes on the cart form and its LINE note (a wrapping
 * row with a full-width note on legacy, a stacked column on pilot). Those are passed in as-is so
 * the desktop render is pixel-identical to before this refactor; the defaults are the pilot ones.
 *
 * `compact` is the mobile bar's flavour: no helper line under the LINE button, and the sold-out
 * state as one row (label + enquiry link) instead of a stacked block. No new wording anywhere —
 * every string is the same dictionary key the page already used.
 */
export function ProductBuyAction({
  available,
  orderingEnabled,
  slug,
  variantId,
  productName,
  variantLabel,
  formClassName = "flex flex-col items-start gap-2",
  noteClassName = "text-xs text-foreground-muted hover:text-foreground",
  compact = false,
  choiceMissingLabel = null,
  productCode,
}: {
  available: boolean;
  orderingEnabled: boolean;
  slug: string;
  variantId: string | null;
  productName: string;
  variantLabel: string | null;
  formClassName?: string;
  noteClassName?: string;
  compact?: boolean;
  /** Image-fix round 2026-09-28: set when the product has options and none is picked yet (a product whose options
   *  have no photos opens with nothing pre-selected). Not a stock state — "out of stock" must never show for it.
   *  Cart mode shows a disabled button with this label; LINE mode orders as usual (the chat asks the option). */
  choiceMissingLabel?: string | null;
  /** 19/10 LINE ready-message: the code the admin looks up (published: the picked Shipnity variant code). Default = slug. */
  productCode?: string;
}) {
  const { dict } = useLocale();

  if (!available) {
    return (
      <div className={compact ? "flex items-center gap-3" : "flex flex-col items-start gap-2"}>
        <span className="label-mono text-xs text-ember">{dict.productActions.outOfStockLabel}</span>
        <a
          href={CONTACT.lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-line-spot="buy"
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-full border border-surface-border text-sm font-semibold tracking-tight text-foreground transition-colors duration-200 hover:border-foreground-dim hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-ember",
            compact ? "min-h-11 px-5 py-2.5" : "px-6 py-3"
          )}
        >
          {dict.productActions.outOfStockCta}
        </a>
      </div>
    );
  }

  if (choiceMissingLabel && orderingEnabled) {
    return (
      <div className={compact ? "flex" : formClassName}>
        <span aria-disabled="true" className={cn("inline-flex items-center justify-center rounded-full border border-surface-border text-sm font-semibold tracking-tight text-foreground-muted", compact ? "min-h-11 px-5 py-2.5" : "px-6 py-3")}>{choiceMissingLabel}</span>
      </div>
    );
  }

  if (!orderingEnabled) {
    /* Online ordering off (owner 2026-09-07): same slot, same weight, LINE instead of the cart. */
    return <OrderViaLineButton productName={productName} variantLabel={variantLabel} hideHint={compact} productCode={productCode ?? slug} />;
  }

  return (
    <form action={addToCartAction} className={compact ? "flex" : formClassName}>
      <input type="hidden" name="slug" value={slug} />
      {variantId && <input type="hidden" name="variantId" value={variantId} />}
      <input type="hidden" name="quantity" value={1} />
      <Button type="submit">{dict.productActions.addToCartCta}</Button>
      {/* LINE = backup order channel (owner 2026-09-06, BSOT §8): one small line, cart button stays primary */}
      {!compact && (
        <a href={CONTACT.lineUrl} target="_blank" rel="noopener noreferrer" data-line-spot="buy-note" className={noteClassName}>
          {dict.productActions.orderOnLineNote}
        </a>
      )}
    </form>
  );
}
