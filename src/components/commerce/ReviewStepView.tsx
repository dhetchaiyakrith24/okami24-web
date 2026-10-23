"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { placeOrderAction } from "@/app/checkout/actions";
import { CUSTOMER_NOTE_MAX } from "@/lib/commerce/customer-note";
import { LineThumb } from "@/components/commerce/LineThumb";
import type { CartView as CartViewData } from "@/lib/commerce/cart";
import type { AddressRecord } from "@/lib/commerce/addresses";

function formatTHB(value: number): string {
  return `฿${value.toLocaleString("th-TH")}`;
}

export function ReviewStepView({
  cart,
  address,
  addressId,
  idempotencyKey,
  error,
}: {
  cart: CartViewData;
  address: AddressRecord;
  addressId: number;
  idempotencyKey: string;
  error?: string;
}) {
  const { dict } = useLocale();

  return (
    <>
      <PageHeader eyebrow={dict.checkout.reviewEyebrow} title={dict.checkout.reviewTitle} />
      <Container className="flex max-w-xl flex-col gap-8 py-12 lg:py-16">
        {error && <p className="text-sm text-ember">{error}</p>}

        <div className="flex flex-col gap-3">
          <span className="label-mono text-xs text-foreground-dim">{dict.checkout.itemsTitle}</span>
          <div className="flex flex-col divide-y divide-surface-border-soft rounded-xl border border-surface-border-soft bg-surface-1">
            {cart.lines.map((line) => (
              <div key={`${line.productSlug}:${line.variantId ?? ""}`} className="flex items-center justify-between gap-4 p-4 text-sm">
                <div className="flex items-center gap-4">
                  <LineThumb image={line.image} />
                  <div>
                    <p className="font-medium text-foreground">{line.displayName}</p>
                    {line.variantLabel && <p className="text-foreground-muted">{line.variantLabel}</p>}
                    <p className="text-foreground-muted">
                      {formatTHB(line.unitPrice)} × {line.quantity}
                    </p>
                  </div>
                </div>
                <p className="shrink-0 font-medium text-foreground">{formatTHB(line.lineTotal)}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1 rounded-xl border border-surface-border-soft bg-surface-1 p-4 text-sm">
            <div className="flex justify-between text-foreground-muted">
              <span>{dict.cart.subtotalLabel}</span>
              <span>{formatTHB(cart.totals.subtotal)}</span>
            </div>
            <div className="flex justify-between text-foreground-muted">
              <span>{dict.cart.shippingLabel}</span>
              <span>{cart.totals.shippingFee === 0 ? dict.cart.freeShippingLabel : formatTHB(cart.totals.shippingFee)}</span>
            </div>
            <div className="flex justify-between border-t border-surface-border-soft pt-1 font-semibold text-foreground">
              <span>{dict.cart.totalLabel}</span>
              <span>{formatTHB(cart.totals.total)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="label-mono text-xs text-foreground-dim">{dict.checkout.shipToTitle}</span>
          <div className="rounded-xl border border-surface-border-soft bg-surface-1 p-4 text-sm text-foreground">
            <p className="font-medium">
              {address.recipientName} · {address.phone}
            </p>
            <p className="text-foreground-muted">
              {address.line1}, {address.subdistrict}, {address.district}, {address.province} {address.postalCode}
            </p>
          </div>
          {/* ?choose=1: the address step otherwise jumps straight back here with the last-used address (batch C). */}
          <Button href="/checkout/address?choose=1" variant="ghost" className="self-start px-0 text-xs">
            {dict.checkout.changeAddressCta}
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <span className="label-mono text-xs text-foreground-dim">{dict.checkout.paymentTitle}</span>
          <p className="text-sm text-foreground-muted">{dict.checkout.paymentPendingNote}</p>
        </div>

        <form action={placeOrderAction} className="flex flex-col gap-4">
          <input type="hidden" name="addressId" value={addressId} />
          <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
          {/* Cart UX batch C (owner 24/10): an OPTIONAL note to the shop, closed by default so it never slows the order down.
              Staff see it on the order's staff page only (not the LINE alert). */}
          <details className="group rounded-xl border border-surface-border-soft bg-surface-1">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm text-foreground [&::-webkit-details-marker]:hidden">
              <span>{dict.checkout.noteToggle}</span>
              <span aria-hidden className="text-foreground-dim transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="flex flex-col gap-2 px-4 pb-4">
              <textarea
                name="customerNote"
                maxLength={CUSTOMER_NOTE_MAX}
                rows={3}
                aria-label={dict.checkout.noteToggle}
                placeholder={dict.checkout.notePlaceholder}
                className="w-full resize-none rounded-md border border-surface-border bg-surface-2 px-3 py-2 text-base text-foreground"
              />
              <p className="text-xs text-foreground-dim">{dict.checkout.noteHint}</p>
            </div>
          </details>
          <Button type="submit" className="w-full justify-center">
            {dict.checkout.placeOrderCta}
          </Button>
        </form>
      </Container>
    </>
  );
}
