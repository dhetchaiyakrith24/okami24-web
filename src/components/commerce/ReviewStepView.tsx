"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { placeOrderAction } from "@/app/checkout/actions";
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
              <div key={`${line.productSlug}:${line.variantId ?? ""}`} className="flex items-center justify-between p-4 text-sm">
                <div>
                  <p className="font-medium text-foreground">{line.displayName}</p>
                  {line.variantLabel && <p className="text-foreground-muted">{line.variantLabel}</p>}
                  <p className="text-foreground-muted">
                    {formatTHB(line.unitPrice)} × {line.quantity}
                  </p>
                </div>
                <p className="font-medium text-foreground">{formatTHB(line.lineTotal)}</p>
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
          <Button href="/checkout/address" variant="ghost" className="self-start px-0 text-xs">
            {dict.checkout.changeAddressCta}
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <span className="label-mono text-xs text-foreground-dim">{dict.checkout.paymentTitle}</span>
          <p className="text-sm text-foreground-muted">{dict.checkout.paymentPendingNote}</p>
        </div>

        <form action={placeOrderAction}>
          <input type="hidden" name="addressId" value={addressId} />
          <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
          <Button type="submit" className="w-full justify-center">
            {dict.checkout.placeOrderCta}
          </Button>
        </form>
      </Container>
    </>
  );
}
