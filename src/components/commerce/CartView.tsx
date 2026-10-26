"use client";

import { Minus, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { updateQuantityAction, removeItemAction } from "@/app/cart/actions";
import { LineThumb } from "@/components/commerce/LineThumb";
import { CartSuggestions } from "@/components/commerce/CartSuggestions";
import { MAX_LINE_QUANTITY } from "@/lib/commerce/cart-limits";
import type { CartView as CartViewData } from "@/lib/commerce/cart";
import type { CartSuggestion } from "@/lib/commerce/cart-suggestions";

function formatTHB(value: number): string {
  return `฿${value.toLocaleString("th-TH")}`;
}

/** Hidden fields that name one cart line for the quantity / remove actions. */
function LineFields({ slug, variantId }: { slug: string; variantId: string | null }) {
  return (
    <>
      <input type="hidden" name="slug" value={slug} />
      {variantId && <input type="hidden" name="variantId" value={variantId} />}
    </>
  );
}

const stepClass =
  "flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-ember disabled:cursor-not-allowed disabled:text-foreground-dim disabled:hover:bg-transparent";

/**
 * Cart page. Cart-ready round (owner 24/10: the totals card did not match the item card above it): phones = one column,
 * every card full width; ≥1024 = items left, the summary beside them and kept in view while the list scrolls. The
 * quantity is a − / + stepper (was a number box + "อัปเดต" button); "−" stops at 1 — taking a line out is "ลบ".
 * Q8 (26/10): the suggestion row sits under the items in the left column at ≥1024 (the summary spans both rows and stays
 * in view), under the summary on phones — never above the checkout button; hidden while a line needs removing. An empty
 * cart shows it under "เลือกซื้อสินค้าต่อ" (the shop's picks only) so the page is not a dead end.
 */
export function CartView({ cart, suggestions }: { cart: CartViewData; suggestions: CartSuggestion[] }) {
  const { dict } = useLocale();
  const isEmpty = cart.lines.length === 0;

  return (
    <>
      <PageHeader eyebrow={dict.cart.eyebrow} title={dict.cart.pageTitle} />
      <Container className="py-12 lg:py-16">
        {isEmpty ? (
          <div className="flex flex-col items-start gap-4">
            <p className="text-foreground-muted">{dict.cart.emptyMessage}</p>
            <Button href="/products">{dict.cart.continueShoppingCta}</Button>
            <CartSuggestions items={suggestions} className="mt-6 w-full" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-8">
            <div className="flex flex-col divide-y divide-surface-border-soft rounded-xl border border-surface-border-soft bg-surface-1">
              {cart.lines.map((line) => (
                <div key={`${line.productSlug}:${line.variantId ?? ""}`} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <LineThumb image={line.image} />
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="font-medium text-foreground">{line.displayName}</span>
                      {line.variantLabel && <span className="text-sm text-foreground-muted">{line.variantLabel}</span>}
                      {line.problem ? (
                        <span className="text-sm text-ember">{dict.cart.unavailableMessage}</span>
                      ) : (
                        <span className="text-sm text-foreground-muted">
                          {formatTHB(line.unitPrice)} × {line.quantity} = {formatTHB(line.lineTotal)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    {!line.problem && (
                      <div className="flex items-center rounded-full border border-surface-border" role="group" aria-label={dict.cart.quantityLabel}>
                        <form action={updateQuantityAction}>
                          <LineFields slug={line.productSlug} variantId={line.variantId} />
                          <input type="hidden" name="quantity" value={line.quantity - 1} />
                          <button type="submit" className={stepClass} disabled={line.quantity <= 1} aria-label={dict.cart.decreaseLabel}>
                            <Minus size={16} aria-hidden />
                          </button>
                        </form>
                        <span className="min-w-8 text-center text-sm font-semibold tabular-nums text-foreground" aria-live="polite">
                          {line.quantity}
                        </span>
                        <form action={updateQuantityAction}>
                          <LineFields slug={line.productSlug} variantId={line.variantId} />
                          <input type="hidden" name="quantity" value={line.quantity + 1} />
                          <button type="submit" className={stepClass} disabled={line.quantity >= MAX_LINE_QUANTITY} aria-label={dict.cart.increaseLabel}>
                            <Plus size={16} aria-hidden />
                          </button>
                        </form>
                      </div>
                    )}
                    <form action={removeItemAction}>
                      <LineFields slug={line.productSlug} variantId={line.variantId} />
                      <Button type="submit" variant="ghost" className="px-3 py-1.5 text-sm">
                        {dict.cart.removeCta}
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 rounded-xl border border-surface-border-soft bg-surface-1 p-6 lg:sticky lg:top-24 lg:row-span-2">
              <div className="flex items-center justify-between text-sm text-foreground-muted">
                <span>{dict.cart.subtotalLabel}</span>
                <span>{formatTHB(cart.totals.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-foreground-muted">
                <span>{dict.cart.shippingLabel}</span>
                <span>{cart.totals.shippingFee === 0 ? dict.cart.freeShippingLabel : formatTHB(cart.totals.shippingFee)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-surface-border-soft pt-2 text-base font-semibold text-foreground">
                <span>{dict.cart.totalLabel}</span>
                <span>{formatTHB(cart.totals.total)}</span>
              </div>

              {cart.hasProblems ? (
                <p className="pt-2 text-xs text-ember">{dict.cart.fixIssuesNote}</p>
              ) : (
                <Button href="/checkout" className="mt-3 w-full justify-center">
                  {dict.cart.checkoutCta}
                </Button>
              )}
              <Button href="/products" variant="ghost" className="w-full justify-center py-2">
                {dict.cart.continueShoppingCta}
              </Button>
            </div>

            {!cart.hasProblems && <CartSuggestions items={suggestions} className="mt-4 lg:col-start-1 lg:mt-6" />}
          </div>
        )}
      </Container>
    </>
  );
}
