"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { updateQuantityAction, removeItemAction } from "@/app/cart/actions";
import type { CartView as CartViewData } from "@/lib/commerce/cart";

function formatTHB(value: number): string {
  return `฿${value.toLocaleString("th-TH")}`;
}

export function CartView({ cart }: { cart: CartViewData }) {
  const { dict } = useLocale();
  const isEmpty = cart.lines.length === 0;

  return (
    <>
      <PageHeader eyebrow={dict.cart.eyebrow} title={dict.cart.pageTitle} />
      <Container className="flex flex-col gap-8 py-12 lg:py-16">
        {isEmpty ? (
          <div className="flex flex-col items-start gap-4">
            <p className="text-foreground-muted">{dict.cart.emptyMessage}</p>
            <Button href="/products">{dict.cart.continueShoppingCta}</Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col divide-y divide-surface-border-soft rounded-xl border border-surface-border-soft bg-surface-1">
              {cart.lines.map((line) => (
                <div key={`${line.productSlug}:${line.variantId ?? ""}`} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-1">
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
                  <div className="flex items-center gap-3">
                    {!line.problem && (
                      <form action={updateQuantityAction} className="flex items-center gap-2">
                        <input type="hidden" name="slug" value={line.productSlug} />
                        {line.variantId && <input type="hidden" name="variantId" value={line.variantId} />}
                        <label className="text-xs text-foreground-dim" htmlFor={`qty-${line.productSlug}-${line.variantId ?? ""}`}>
                          {dict.cart.quantityLabel}
                        </label>
                        <input
                          id={`qty-${line.productSlug}-${line.variantId ?? ""}`}
                          type="number"
                          name="quantity"
                          min={1}
                          max={20}
                          defaultValue={line.quantity}
                          className="w-16 rounded-md border border-surface-border bg-surface-2 px-2 py-1 text-sm text-foreground"
                        />
                        <Button type="submit" variant="secondary" className="px-3 py-1.5 text-xs">
                          {dict.cart.updateCta}
                        </Button>
                      </form>
                    )}
                    <form action={removeItemAction}>
                      <input type="hidden" name="slug" value={line.productSlug} />
                      {line.variantId && <input type="hidden" name="variantId" value={line.variantId} />}
                      <Button type="submit" variant="ghost" className="px-3 py-1.5 text-xs">
                        {dict.cart.removeCta}
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 self-end rounded-xl border border-surface-border-soft bg-surface-1 p-6 sm:w-80">
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
            </div>
          </>
        )}
      </Container>
    </>
  );
}
