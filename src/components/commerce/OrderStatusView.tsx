"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SlipUploadForm } from "@/components/commerce/SlipUploadForm";
import { orderStatusLabel } from "@/lib/commerce/order-status";
import { CONTACT } from "@/data/contact";
import { CARRIERS } from "@/lib/commerce/carriers";
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
          <div className="flex items-center justify-between">
            <span className="text-foreground-muted">{dict.orderStatus.statusLabel}</span>
            {/* Owner 23/10: "shipped" gets a quiet green glow — a soft breathing dot inside a thin pill, still within the
                site's calm look; motion stops for visitors who ask for reduced motion. Other statuses stay plain text. */}
            {order.status === "shipped" ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-0.5 font-medium text-emerald-300 shadow-[0_0_14px_-2px_rgba(52,211,153,0.35)]">
                <span aria-hidden className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/60 [animation-duration:2.4s] motion-reduce:hidden" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-400 shadow-[0_0_6px_1px_rgba(52,211,153,0.8)]" />
                </span>
                {orderStatusLabel(order.status, locale)}
              </span>
            ) : (
              <span className="font-medium text-foreground">{orderStatusLabel(order.status, locale)}</span>
            )}
          </div>
        </div>

        {/* Entered by staff when the parcel leaves (cart round 22/10). Owner 23/10 (BSOT §10): once shipped, name the
            carrier and link to its own tracking page, with the 3 steps — the page opens without the number filled in.
            An order shipped before staff picked carriers has no carrier: the number alone, no button. */}
        {order.trackingNumber && (order.status === "shipped" || order.status === "completed") && (
          <div className="flex flex-col gap-3 rounded-xl border border-surface-border-soft bg-surface-1 p-4 text-sm">
            <span className="label-mono text-xs text-foreground-dim">{dict.orderStatus.trackTitle}</span>
            {order.carrier && (
              <div className="flex justify-between gap-4">
                <span className="text-foreground-muted">{dict.orderStatus.carrierLabel}</span>
                <span className="font-medium text-foreground">{CARRIERS[order.carrier].name[locale]}</span>
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
              <span className="text-foreground-muted">{dict.orderStatus.trackingLabel}</span>
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="select-all font-medium tracking-wide text-foreground">{order.trackingNumber}</span>
                <CopyButton value={order.trackingNumber} label={dict.orderStatus.trackCopyCta} doneLabel={dict.orderStatus.paymentCopiedLabel} />
              </span>
            </div>
            {order.carrier && (
              <>
                <a
                  href={CARRIERS[order.carrier].trackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full bg-ember px-6 py-3 text-sm font-semibold tracking-tight text-[#181008] transition-colors hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-ember"
                >
                  {dict.orderStatus.trackCta}
                </a>
                <ol className="flex list-decimal flex-col gap-1 pl-5 text-foreground-muted">
                  {[dict.orderStatus.trackStep1, dict.orderStatus.trackStep2, dict.orderStatus.trackStep3].map((step, i) => (
                    <li key={i}>{step.replace("{carrier}", CARRIERS[order.carrier!].name[locale])}</li>
                  ))}
                </ol>
              </>
            )}
          </div>
        )}

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
                        320×320: the served file is now the QR square only (500×500). The owner's
                        original was a full PromptPay slip whose blue header, logo and four text lines
                        ate over half the frame — and its masked account number (xxx-x-x9240-x)
                        contradicted the full number in the table above, which made customers hesitate.
                        Cropped on the owner's instruction 2026-09-06; the untouched slip is kept beside
                        it as .data/private/promptpay-qr-fullslip.png. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrHref} alt={dict.orderStatus.paymentQrAlt} width={320} height={320} className="w-full max-w-[320px] self-center rounded-lg bg-white p-2" />
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
            <SlipUploadForm orderNumber={order.orderNumber} token={token} />
          </div>
        )}

        {order.status === "payment_submitted" && <p className="text-sm text-foreground-muted">{dict.orderStatus.paymentSubmittedNote}</p>}
      </Container>
    </>
  );
}
