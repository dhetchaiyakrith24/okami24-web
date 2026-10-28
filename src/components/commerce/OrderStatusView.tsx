"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { playSlashOnce } from "@/components/brand/slash";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SlipUploadForm } from "@/components/commerce/SlipUploadForm";
import { orderStatusLabel } from "@/lib/commerce/order-status";
import { formatRunNumber } from "@/lib/commerce/run-number";
import { CONTACT } from "@/data/contact";
import { CARRIERS } from "@/lib/commerce/carriers";
import type { OrderDetail } from "@/lib/commerce/orders";
import type { PaymentAccountView } from "@/data/payment";
import type { LineImage } from "@/lib/commerce/line-image";
import { LineThumb } from "@/components/commerce/LineThumb";
import { StockIssueBox } from "@/components/commerce/StockIssueBox";
import type { StockIssueView } from "@/lib/commerce/stock-issue-rules";

function formatTHB(value: number): string {
  return `฿${value.toLocaleString("th-TH")}`;
}

/** Turns the "@okm24" inside a dictionary sentence into the LINE link (normal weight, not a warning colour). */
function withLineLink(sentence: string) {
  const parts = sentence.split(CONTACT.lineId);
  if (parts.length < 2) return sentence;
  // The word right before the handle stays on its line with it ("ได้ที่ @okm24" split in the 24/10 night wordbreak scan) —
  // the same rule StockIssueBox's helper already follows.
  const cut = parts[0].trimEnd().lastIndexOf(" ") + 1;
  const lead = parts[0].slice(cut);
  return parts.flatMap((part, i) =>
    i === 0
      ? [part.slice(0, cut)]
      : i === 1
        ? [
            <span key="lead" className="whitespace-nowrap">
              {lead}
              <a href={CONTACT.lineUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#06C755] underline decoration-[#06C755]/50 underline-offset-2 hover:decoration-[#06C755]">
                {CONTACT.lineId}
              </a>
            </span>,
            part,
          ]
      : [
          // Owner 24/10 night: the handle must look tappable — LINE green, underlined.
          <a key={i} href={CONTACT.lineUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#06C755] underline decoration-[#06C755]/50 underline-offset-2 hover:decoration-[#06C755]">
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
export function OrderStatusView({
  order,
  token,
  payment = null,
  itemImages = [],
  stockIssue = null,
  messages = [],
  paid = false,
  autoCancelled = false,
  deadlineIso = null,
}: {
  order: OrderDetail;
  token: string | null;
  payment?: PaymentAccountView | null;
  /** One per `order.items` entry, same order (resolved by the server page — order_items stores no image). */
  itemImages?: (LineImage | null)[];
  /** Out of stock after payment (cart UX batch E) — resolved by the server page; null = nothing to show. */
  stockIssue?: StockIssueView | null;
  /** The shop's messages to the customer, newest first, dates already formatted by the server page (owner 24/10). */
  messages?: { body: string; dateLabel: string }[];
  /** True when a slip was ever sent — a cancelled paid order says the shop will contact them about the refund. */
  paid?: boolean;
  /** Cancelled by the 24-hour unpaid sweep (owner 24/10 proposal ②) — the next-step line says why. */
  autoCancelled?: boolean;
  /** While waiting for payment: when the order cancels itself (ISO). Shown in Bangkok time in the page language — a
   *  Thai-formatted date leaked into the en/zh pages (locale scan, 24/10 night). */
  deadlineIso?: string | null;
}) {
  const { dict, locale } = useLocale();
  const t = dict.orderStatus;
  // The order's story (owner 24/10: "ลูกค้าแค่ต้องรู้สถานะ: จัดส่งแล้วไปขั้นตอนไหน ยกเลิกเพราะอะไร และไปขั้นตอนไหนต่อ").
  // While an out-of-stock choice is open, the pill and the next step speak about that instead of e.g. "approved".
  const stockStage = order.status !== "cancelled" && stockIssue && stockIssue.stage !== "resolved" ? stockIssue.stage : null;
  const STEP_OF: Partial<Record<OrderDetail["status"], number>> = {
    pending_payment: 0,
    payment_submitted: 1,
    awaiting_verification: 1,
    approved: 2,
    processing: 2,
    shipped: 3,
    completed: 4,
  };
  const step = STEP_OF[order.status];
  const NEXT: Record<OrderDetail["status"], string> = {
    pending_payment: t.nextPendingPayment,
    payment_submitted: t.nextChecking,
    awaiting_verification: t.nextChecking,
    approved: t.nextApproved,
    processing: t.nextProcessing,
    // No carrier picked = no "check the parcel" button below (checker #807 note b) — the line points at the number instead.
    shipped: order.carrier ? t.nextShipped : t.nextShippedNoCarrier,
    completed: t.nextCompleted,
    cancelled: stockIssue?.resolution === "refunded" ? t.nextCancelledRefunded : paid ? t.nextCancelledPaid : autoCancelled ? t.nextCancelledUnpaid : t.nextCancelled,
  };
  const next = stockStage === "waiting-choice" ? t.nextStockWaiting : stockStage === "chosen" ? t.nextStockChosen : NEXT[order.status];
  const terminal = order.status === "completed" || order.status === "cancelled";
  const statusText =
    stockStage === "waiting-choice" ? t.statusStockWaiting : stockStage === "chosen" ? t.statusStockChosen : orderStatusLabel(order.status, locale);
  const qrHref = payment?.hasQr ? `/orders/${encodeURIComponent(order.orderNumber)}/payment-qr${token ? `?token=${encodeURIComponent(token)}` : ""}` : null;
  const paidOrLater = order.status !== "pending_payment" && order.status !== "cancelled";
  const runNumber = formatRunNumber(order.runNumber);
  const thanksRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  // Logo round batch 2 (owner 28/10): one red slash when the order is first seen placed, one when first seen paid.
  // The paid slash waits for the card's own entrance (okami-thanks-in, 80 + 420 ms).
  useEffect(() => {
    const play = () => {
      if (paidOrLater) {
        const width = thanksRef.current?.offsetWidth ?? 400;
        playSlashOnce(`okami-slash:${order.orderNumber}:paid`, thanksRef.current, { length: Math.round(width * 0.85), thickness: 4, draw: 260, hold: 120, fade: 320, shadow: true });
      } else if (order.status === "pending_payment") {
        playSlashOnce(`okami-slash:${order.orderNumber}:placed`, numberRef.current, { length: window.innerWidth >= 1024 ? 220 : 160, thickness: 3, draw: 200, fade: 280, at: "top" });
      }
    };
    const t = window.setTimeout(play, paidOrLater ? 520 : 120);
    return () => window.clearTimeout(t);
  }, [paidOrLater, order.status, order.orderNumber]);

  return (
    <>
      <PageHeader eyebrow={dict.orderStatus.eyebrow} title={dict.orderStatus.pageTitle} />
      <Container className="flex max-w-xl flex-col gap-8 py-12 lg:py-16">
        {/* A thank-you once the slip is in — from "payment submitted" to "completed". Owner 24/10: his wording, big and bold
            ("ตัวหน้าใหญ่ Impact ทรงพลัง"). Designer: two fixed lines (line 2 never wraps, so "ใช้บริการ" cannot split), the
            brand in the condensed display face and the brand red, a short red rule above; Thai keeps leading 1.3 (the
            PageHeader's tight 0.95 would clip Thai vowels). */}
        {/* Logo round batch 2 (owner 28/10 "ได้ ตามร่าง"; designer spec 28/10): the card carries the samurai — head, kabuto and
            red moon only, cut above the shoulder blades — a band on top at every width: line 2 of the thank-you never wraps,
            and this column is max-w-xl, so a picture beside the text put the red "OKami24" on the red moon at 1440 (Friday's
            Owner-eye check 28/10). Faded into the card. */}
        {paidOrLater && (
          <div ref={thanksRef} className="okami-thanks relative overflow-hidden rounded-2xl border border-surface-border-soft bg-surface-1">
            <div className="relative h-[200px] w-full lg:h-[240px]">
              <Image
                src="/brand/samurai-thanks-wide.webp"
                alt=""
                fill
                sizes="(min-width: 640px) 576px, 100vw"
                className="object-cover object-top [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
              />
            </div>
            <div className="relative flex flex-col justify-center px-5 pb-6 lg:px-7 lg:pb-8">
              <span aria-hidden className="mb-4 block h-0.5 w-8 rounded bg-red-strong" />
              <p className="text-[1.75rem] font-bold leading-[1.3] text-foreground lg:text-[2.25rem]">
                <span className="block">{dict.orderStatus.thankYouLead}</span>
                <span className="block whitespace-nowrap">
                  {dict.orderStatus.thankYouTail}{" "}
                  <span className="font-display font-extrabold text-red-strong [text-shadow:0_0_24px_rgba(242,48,48,0.25)]">OKami24</span>
                </span>
              </p>
            </div>
          </div>
        )}
        <div ref={numberRef} className="flex flex-col gap-1 rounded-xl border border-surface-border-soft bg-surface-1 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-foreground-muted">{dict.orderStatus.orderNumberLabel}</span>
            <span className="font-medium text-foreground">{order.orderNumber}</span>
          </div>
          {runNumber && (
            <div className="flex justify-between">
              <span className="text-foreground-muted">{dict.orderStatus.runNumberLabel}</span>
              <span className="font-medium text-foreground">{runNumber}</span>
            </div>
          )}
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
                {statusText}
              </span>
            ) : order.status === "pending_payment" || stockStage === "waiting-choice" ? (
              // Cart UX batch A (owner 24/10): "waiting for payment" gets a quiet warm glow — the shipped pill's twin in
              // amber, slower and fainter, so the one step the customer still has to do reads first without alarming.
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-0.5 font-medium text-amber-200 shadow-[0_0_14px_-4px_rgba(252,211,77,0.3)]">
                <span aria-hidden className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-300/50 [animation-duration:3.2s] motion-reduce:hidden" />
                  <span className="relative inline-flex size-2 rounded-full bg-amber-300 shadow-[0_0_6px_1px_rgba(252,211,77,0.6)]" />
                </span>
                {statusText}
              </span>
            ) : order.status === "cancelled" ? (
              // Owner 24/10 night: "ยกเลิกแล้ว" gets a red glow — the third twin of the shipped/pending pills, but still: a
              // cancelled order is finished, so the dot does not pulse.
              <span className="inline-flex items-center gap-2 rounded-full border border-red-400/35 bg-red-500/10 px-3 py-0.5 font-medium text-red-300 shadow-[0_0_14px_-3px_rgba(248,113,113,0.4)]">
                <span aria-hidden className="relative inline-flex size-2 rounded-full bg-red-400 shadow-[0_0_6px_1px_rgba(248,113,113,0.7)]" />
                {statusText}
              </span>
            ) : (
              <span className="font-medium text-foreground">{statusText}</span>
            )}
          </div>
          {/* Four steps, then one sentence on what happens next. A cancelled order has no steps — only why and what next. */}
          {step !== undefined && (
            <ol className="mt-3 grid grid-cols-4 gap-1.5">
              {[t.stepPay, t.stepCheck, t.stepPack, t.stepShip].map((label, i) => {
                const state = i < step ? "done" : i === step ? "now" : "todo";
                return (
                  <li key={i} aria-current={state === "now" ? "step" : undefined} className="flex flex-col gap-1.5">
                    <span
                      aria-hidden
                      className={`h-1 rounded-full ${state === "done" ? "bg-emerald-400/70" : state === "now" ? "bg-ember" : "bg-surface-border"}`}
                    />
                    <span className={`text-xs ${state === "todo" ? "text-foreground-dim" : "text-foreground"} ${state === "now" ? "font-semibold" : ""}`}>{label}</span>
                  </li>
                );
              })}
            </ol>
          )}
          <p className="mt-3 border-t border-surface-border-soft pt-3 text-foreground">
            {!terminal && <span className="text-foreground-muted">{t.nextLabel} · </span>}
            {withLineLink(next)}
          </p>
          {deadlineIso && (
            <p className="mt-1.5 text-sm text-foreground-muted">
              {t.paymentDeadlineNote.replace(
                "{deadline}",
                new Intl.DateTimeFormat(locale === "th" ? "th-TH" : locale === "zh" ? "zh-CN" : "en-GB", { timeZone: "Asia/Bangkok", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(deadlineIso)),
              )}
            </p>
          )}
        </div>

        {/* The shop's messages (owner 24/10: "กล่องข้อความแจ้งรายละเอียดจากแอดมิน") — why it was cancelled, why an item ran out. */}
        {messages.length > 0 && (
          <div className="flex flex-col gap-3 rounded-xl border border-ember/40 bg-surface-1 p-4 text-sm">
            <span className="label-mono text-xs text-foreground-dim">{t.messagesTitle}</span>
            {messages.map((m, i) => (
              <div key={i} className={i > 0 ? "border-t border-surface-border-soft pt-3" : undefined}>
                <p className="whitespace-pre-wrap break-words text-foreground">{m.body}</p>
                <p className="mt-1 text-xs text-foreground-dim">{m.dateLabel}</p>
              </div>
            ))}
          </div>
        )}

        {stockIssue && <StockIssueBox issue={stockIssue} orderNumber={order.orderNumber} token={token} />}

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
              <div key={i} className="flex items-center justify-between gap-4 p-4 text-sm">
                <div className="flex items-center gap-4">
                  <LineThumb image={itemImages[i] ?? null} />
                  <div>
                    <p className="font-medium text-foreground">{item.productName}</p>
                    {item.variantLabel && <p className="text-foreground-muted">{item.variantLabel}</p>}
                    <p className="text-foreground-muted">
                      {formatTHB(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="shrink-0 font-medium text-foreground">{formatTHB(item.lineTotal)}</p>
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
                    <p className="text-sm text-foreground-muted">{payment.qrHasAmount ? dict.orderStatus.paymentQrAmountNote : dict.orderStatus.paymentQrNote}</p>
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
                {/* Owner 24/10 night: the "check the account name before transferring" line is dropped. */}
                <p className="text-sm text-foreground-muted">
                  {/* the LINE handle inside the sentence is the link (designer 2026-09-06: no floating red link under the warnings) */}
                  {withLineLink(dict.orderStatus.paymentAfterTransferNote)}
                </p>
                <p className="text-sm font-medium text-danger">{dict.orderStatus.paymentNoRefundWarning}</p>
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
