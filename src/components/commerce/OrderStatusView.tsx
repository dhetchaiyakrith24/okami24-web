"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { submitPaymentAction } from "@/app/checkout/actions";
import { orderStatusLabel } from "@/lib/commerce/order-status";
import { CONTACT } from "@/data/contact";
import type { OrderDetail } from "@/lib/commerce/orders";

function formatTHB(value: number): string {
  return `฿${value.toLocaleString("th-TH")}`;
}

export function OrderStatusView({ order, token }: { order: OrderDetail; token: string | null }) {
  const { dict, locale } = useLocale();

  return (
    <>
      <PageHeader eyebrow={dict.orderStatus.eyebrow} title={dict.orderStatus.pageTitle} />
      <Container className="flex max-w-xl flex-col gap-8 py-12 lg:py-16">
        <div className="flex flex-col gap-1 rounded-xl border border-surface-border-soft bg-surface-1 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-foreground-muted">{dict.orderStatus.orderNumberLabel}</span>
            <span className="font-medium text-foreground">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-muted">{dict.orderStatus.statusLabel}</span>
            <span className="font-medium text-foreground">{orderStatusLabel(order.status, locale)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="label-mono text-xs text-foreground-dim">{dict.orderStatus.itemsTitle}</span>
          <div className="flex flex-col divide-y divide-surface-border-soft rounded-xl border border-surface-border-soft bg-surface-1">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 text-sm">
                <div>
                  <p className="font-medium text-foreground">{item.productName}</p>
                  {item.variantLabel && <p className="text-foreground-muted">{item.variantLabel}</p>}
                  <p className="text-foreground-muted">
                    {formatTHB(item.unitPrice)} × {item.quantity}
                  </p>
                </div>
                <p className="font-medium text-foreground">{formatTHB(item.lineTotal)}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between rounded-xl border border-surface-border-soft bg-surface-1 p-4 text-sm font-semibold text-foreground">
            <span>{dict.orderStatus.totalsTitle}</span>
            <span>{formatTHB(order.total)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="label-mono text-xs text-foreground-dim">{dict.orderStatus.shipToTitle}</span>
          <div className="rounded-xl border border-surface-border-soft bg-surface-1 p-4 text-sm text-foreground">
            <p className="font-medium">
              {order.shippingAddress.recipientName} · {order.shippingAddress.phone}
            </p>
            <p className="text-foreground-muted">
              {order.shippingAddress.line1}, {order.shippingAddress.subdistrict}, {order.shippingAddress.district},{" "}
              {order.shippingAddress.province} {order.shippingAddress.postalCode}
            </p>
          </div>
        </div>

        {order.status === "pending_payment" && (
          <div className="flex flex-col gap-3 rounded-xl border border-surface-border-soft bg-surface-1 p-4">
            <span className="label-mono text-xs text-foreground-dim">{dict.orderStatus.paymentInstructionsTitle}</span>
            <p className="text-sm text-foreground-muted">{dict.orderStatus.bankDetailsTbdNote}</p>
            <a href={CONTACT.lineUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-red underline">
              {CONTACT.lineId}
            </a>
            <form action={submitPaymentAction} className="flex flex-col gap-2">
              <input type="hidden" name="orderNumber" value={order.orderNumber} />
              {token && <input type="hidden" name="token" value={token} />}
              <label className="flex flex-col gap-1.5 text-sm text-foreground-muted" htmlFor="note">
                {dict.orderStatus.referenceNoteLabel}
                <textarea
                  id="note"
                  name="note"
                  rows={2}
                  className="rounded-md border border-surface-border bg-surface-2 px-3 py-2 text-base text-foreground"
                />
              </label>
              <Button type="submit" className="w-full justify-center">
                {dict.orderStatus.submitPaymentCta}
              </Button>
            </form>
          </div>
        )}

        {order.status === "payment_submitted" && <p className="text-sm text-foreground-muted">{dict.orderStatus.paymentSubmittedNote}</p>}
      </Container>
    </>
  );
}
