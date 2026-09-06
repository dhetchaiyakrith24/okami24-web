"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { submitPaymentAction } from "@/app/checkout/actions";
import { orderStatusLabel } from "@/lib/commerce/order-status";
import { CONTACT } from "@/data/contact";
import type { OrderDetail } from "@/lib/commerce/orders";
import type { PaymentAccountView } from "@/data/payment";

function formatTHB(value: number): string {
  return `฿${value.toLocaleString("th-TH")}`;
}

/** Turns the "@okm24" inside a dictionary sentence into the LINE link (normal weight, not a warning colour). */
function withLineLink(sentence: string) {
  const parts = sentence.split(CONTACT.lineId);
  if (parts.length < 2) return sentence;
  return parts.flatMap((part, i) =>
    i === 0
      ? [part]
      : [
          <a key={i} href={CONTACT.lineUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground underline-offset-2 hover:underline">
            {CONTACT.lineId}
          </a>,
          part,
        ],
  );
}

/** Copy-to-clipboard for the account number — a 10-digit number is hard to long-press-select on a phone
 *  (designer 2026-09-06). Copies digits only, so it pastes cleanly into a banking app. */
function CopyButton({ value, label, doneLabel }: { value: string; label: string; doneLabel: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        } catch {
          /* clipboard blocked (http, old browser) — the number is still readable on screen */
        }
      }}
      className="rounded-full border border-surface-border px-3 py-1 text-xs font-semibold text-foreground-muted transition-colors hover:border-foreground-dim hover:text-foreground"
    >
      {done ? doneLabel : label}
    </button>
  );
}

/**
 * `payment` is resolved by the server page from src/data/payment.ts (server-only) and is only
 * non-null for orders still awaiting payment — owner rule 2026-09-06: bank details and the QR
 * appear at the last step of a real order, never on a public page. The QR itself is fetched from
 * a route handler that re-checks the viewer's access to this order.
 */
export function OrderStatusView({ order, token, payment = null }: { order: OrderDetail; token: string | null; payment?: PaymentAccountView | null }) {
  const { dict, locale } = useLocale();
  const qrHref = payment?.hasQr ? `/orders/${encodeURIComponent(order.orderNumber)}/payment-qr${token ? `?token=${encodeURIComponent(token)}` : ""}` : null;

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
            {payment && (
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-foreground">{dict.orderStatus.paymentTransferTitle}</p>
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 rounded-lg border border-surface-border-soft bg-surface-2 p-3 text-sm">
                  <dt className="text-foreground-muted">{dict.orderStatus.paymentBankLabel}</dt>
                  <dd className="text-foreground">{payment.bankName[locale]}</dd>
                  <dt className="text-foreground-muted">{dict.orderStatus.paymentAccountNameLabel}</dt>
                  <dd className="font-medium text-foreground">{payment.accountName}</dd>
                  <dt className="text-foreground-muted">{dict.orderStatus.paymentAccountNumberLabel}</dt>
                  <dd className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-display text-2xl font-semibold tracking-wide text-foreground">{payment.accountNumber}</span>
                    <CopyButton value={payment.accountNumber.replace(/-/g, "")} label={dict.orderStatus.paymentCopyCta} doneLabel={dict.orderStatus.paymentCopiedLabel} />
                  </dd>
                </dl>
                {qrHref && (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-foreground-muted">{dict.orderStatus.paymentQrNote}</p>
                    {/* plain <img>: the route handler is per-order and sends no-store, so next/image's
                        optimizer cache must not sit in front of it.
                        320, not 280: the owner's QR is a full PromptPay slip, so its header/footer eat
                        over half the frame and the scannable square was only ~130px at 280.
                        320×434 = the file's real 885×1200 aspect — a square guess made the page jump as
                        the image finished loading. (both: designer 2026-09-06) */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrHref} alt={dict.orderStatus.paymentQrAlt} width={320} height={434} className="w-full max-w-[320px] self-center rounded-lg bg-white p-2" />
                  </div>
                )}
                <p className="text-sm text-foreground">{dict.orderStatus.paymentVerifyNameWarning}</p>
                <p className="text-sm text-foreground-muted">
                  {/* the LINE handle inside the sentence is the link (designer 2026-09-06: no floating red link under the warnings) */}
                  {withLineLink(dict.orderStatus.paymentAfterTransferNote)}
                </p>
                <p className="text-sm font-medium text-ember">{dict.orderStatus.paymentNoRefundWarning}</p>
              </div>
            )}
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
