"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { CONTACT } from "@/data/contact";
import type { StockIssueView } from "@/lib/commerce/stock-issue-rules";
import { chooseRefundAction, chooseSwapAction, type StockActionState } from "@/app/orders/stock-actions";

/**
 * Out of stock after payment on the order page (cart UX batch E, owner 24/10 — "ลูกค้าเลือกเปลี่ยนสินค้า หรือกดรับเงินคืน
 * เข้าพร้อมเพย์"; BSOT §9 owner exception 22/10). Staff marked lines out → the customer picks one of two answers here:
 * a same-price swap (one picker per out line) or a refund to PromptPay (one tap to the order's own number, or another
 * mobile number). After a choice the box only reports where it stands; staff carry it out.
 * Look: the amber of the "waiting for payment" pill — something to do, not an alarm.
 */

const INITIAL: StockActionState = { errorKey: null, done: false };
const formatTHB = (value: number) => `฿${value.toLocaleString("th-TH")}`;
const fill = (s: string, vars: Record<string, string>) => s.replace(/\{(\w+)\}/g, (m, k: string) => vars[k] ?? m);

const primary =
  "inline-flex w-full items-center justify-center rounded-full bg-ember px-6 py-3 text-sm font-semibold tracking-tight text-[#181008] transition-colors hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-ember disabled:opacity-60";
const secondary =
  "inline-flex w-full items-center justify-center rounded-full border border-surface-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-foreground-dim disabled:opacity-60";
const field = "w-full rounded-lg border border-surface-border bg-surface-2 px-3 py-3 text-base text-foreground";

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

export function StockIssueBox({ issue, orderNumber, token }: { issue: StockIssueView; orderNumber: string; token: string | null }) {
  const { dict } = useLocale();
  const t = dict.orderStatus;
  const router = useRouter();
  const [swapState, swapAction, swapPending] = useActionState(chooseSwapAction, INITIAL);
  const [refundState, refundAction, refundPending] = useActionState(chooseRefundAction, INITIAL);
  const [otherOpen, setOtherOpen] = useState(false);
  const done = swapState.done || refundState.done;
  useEffect(() => {
    if (done) router.refresh();
  }, [done, router]);

  const amount = formatTHB(issue.refundAmount);
  const lineName = (l: StockIssueView["outLines"][number]) => `${l.name}${l.variantLabel ? ` · ${l.variantLabel}` : ""}`;
  const hidden = (
    <>
      <input type="hidden" name="orderNumber" value={orderNumber} />
      <input type="hidden" name="token" value={token ?? ""} />
    </>
  );
  const anySwap = issue.outLines.every((l) => (issue.swapGroups[l.itemId] ?? []).length > 0);
  const pending = swapPending || refundPending;

  // Resolved or chosen: one calm status line, no buttons.
  if (issue.stage !== "waiting-choice" || done) {
    const phone = issue.refundPhoneMasked ?? issue.ownPhoneMasked ?? "";
    const text =
      issue.resolution === "swapped"
        ? t.stockSwapped
        : issue.resolution === "refunded"
          ? `${fill(t.stockRefunded, { amount, phone })}${issue.wholeOrder ? "" : ` ${t.stockRefundedPartial}`}`
          : issue.choice === "swap" || swapState.done
            ? t.stockChosenSwap
            : fill(t.stockChosenRefund, { amount, phone });
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-amber-300/25 bg-amber-300/[0.06] p-4 text-sm">
        <span className="label-mono text-xs text-amber-200">{t.stockTitle}</span>
        <p className="text-foreground">{text}</p>
        <p className="text-foreground-muted">{withLineLink(t.stockContactNote)}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-amber-300/30 bg-amber-300/[0.06] p-4 text-sm shadow-[0_0_18px_-6px_rgba(252,211,77,0.25)]">
      <div className="flex flex-col gap-2">
        <p className="text-base font-semibold text-foreground">{t.stockTitle}</p>
        <p className="text-foreground-muted">{t.stockLead}</p>
        <ul className="flex flex-col gap-1">
          {issue.outLines.map((l) => (
            <li key={l.itemId} className="font-medium text-foreground">
              {lineName(l)} × {l.quantity}
            </li>
          ))}
        </ul>
      </div>

      {/* 1 — swap for a same-price item */}
      <form action={swapAction} className="flex flex-col gap-3 border-t border-surface-border-soft pt-4">
        {hidden}
        <p className="font-semibold text-foreground">{t.stockSwapTitle}</p>
        {anySwap ? (
          <>
            {issue.outLines.map((l) => (
              <label key={l.itemId} className="flex flex-col gap-1 text-foreground-muted">
                {fill(t.stockSwapPickLabel, { name: lineName(l) })}
                <select name={`swap-${l.itemId}`} required defaultValue="" className={field}>
                  <option value="" disabled>
                    {t.stockSwapPlaceholder}
                  </option>
                  {(issue.swapGroups[l.itemId] ?? []).map((g) => (
                    <optgroup key={g.productSlug} label={g.productName}>
                      {g.options.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </label>
            ))}
            {swapState.errorKey && (
              <p role="alert" className="text-ember">
                {t[swapState.errorKey]}
              </p>
            )}
            <button type="submit" disabled={pending} className={primary}>
              {swapPending ? t.stockPending : t.stockSwapCta}
            </button>
          </>
        ) : (
          <p className="text-foreground-muted">{withLineLink(t.stockSwapNone)}</p>
        )}
      </form>

      {/* 2 — refund to PromptPay */}
      <form action={refundAction} className="flex flex-col gap-3 border-t border-surface-border-soft pt-4">
        {hidden}
        <p className="font-semibold text-foreground">{t.stockRefundTitle}</p>
        <p className="text-foreground">{fill(t.stockRefundAmount, { amount })}</p>
        {!issue.wholeOrder && <p className="text-foreground-muted">{t.stockRefundPartialNote}</p>}
        {otherOpen ? (
          <>
            <input type="hidden" name="mode" value="other" />
            <label className="flex flex-col gap-1 text-foreground-muted">
              {t.stockRefundOtherLabel}
              <input name="promptPay" type="tel" inputMode="numeric" autoComplete="tel" maxLength={14} required className={field} />
            </label>
            {refundState.errorKey && (
              <p role="alert" className="text-ember">
                {t[refundState.errorKey]}
              </p>
            )}
            <button type="submit" disabled={pending} className={secondary}>
              {refundPending ? t.stockPending : t.stockRefundOtherCta}
            </button>
          </>
        ) : (
          <>
            <input type="hidden" name="mode" value="own" />
            {refundState.errorKey && (
              <p role="alert" className="text-ember">
                {t[refundState.errorKey]}
              </p>
            )}
            {issue.ownPhoneMasked && (
              <button type="submit" disabled={pending} className={secondary}>
                {refundPending ? t.stockPending : fill(t.stockRefundOwnCta, { phone: issue.ownPhoneMasked })}
              </button>
            )}
            <button
              type="button"
              onClick={() => setOtherOpen(true)}
              className="self-start text-foreground-muted underline underline-offset-4 hover:text-foreground"
            >
              {t.stockRefundOtherLabel}
            </button>
          </>
        )}
      </form>

      <p className="text-foreground-muted">{withLineLink(t.stockContactNote)}</p>
    </div>
  );
}
