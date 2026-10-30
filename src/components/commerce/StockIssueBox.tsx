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
// Designer 24/10: BSOT §9 offers the swap OR the refund as equals — when both are open they share one weight (heavier than
// an outline); ember is kept for the only open way.
const equal =
  "inline-flex w-full items-center justify-center rounded-full border border-surface-border bg-surface-2 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-foreground-dim disabled:opacity-60";
const field = "w-full rounded-lg border border-surface-border bg-surface-2 px-3 py-3 text-base text-foreground";

/** Suggestions for the bank field (it stays free text — any bank is accepted): the banks most Thai customers use. */
const TH_BANKS = ["กสิกรไทย", "ไทยพาณิชย์", "กรุงเทพ", "กรุงไทย", "กรุงศรีอยุธยา", "ทหารไทยธนชาต (ttb)", "ออมสิน", "ธ.ก.ส.", "ยูโอบี", "ซีไอเอ็มบี ไทย", "เกียรตินาคินภัทร", "แลนด์ แอนด์ เฮ้าส์", "อาคารสงเคราะห์", "ทิสโก้"];

/** The "@okm24" in a sentence becomes the LINE link, kept on one line with the word before it ("ทักไลน์ @okm24" never
 *  splits as "ทัก|ไลน์" at a line end — seen at 1440, 24/10). Assumes one handle per sentence. */
function withLineLink(sentence: string) {
  const at = sentence.indexOf(CONTACT.lineId);
  if (at < 0) return sentence;
  const before = sentence.slice(0, at);
  const cut = before.trimEnd().lastIndexOf(" ") + 1;
  return (
    <>
      {before.slice(0, cut)}
      <span className="whitespace-nowrap">
        {before.slice(cut)}
        <a href={CONTACT.lineUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#06C755] underline decoration-[#06C755]/50 underline-offset-2 hover:decoration-[#06C755]">
          {CONTACT.lineId}
        </a>
      </span>
      {sentence.slice(at + CONTACT.lineId.length)}
    </>
  );
}

export function StockIssueBox({ issue, orderNumber, token }: { issue: StockIssueView; orderNumber: string; token: string | null }) {
  const { dict } = useLocale();
  const t = dict.orderStatus;
  const router = useRouter();
  const [swapState, swapAction, swapPending] = useActionState(chooseSwapAction, INITIAL);
  const [refundState, refundAction, refundPending] = useActionState(chooseRefundAction, INITIAL);
  const [mode, setMode] = useState<"own" | "other" | "bank">("own");
  // Controlled fields: React resets a form's uncontrolled inputs after every action, so a refused bank number would wipe
  // the bank and branch the customer already typed (seen on the test build 24/10).
  const [typed, setTyped] = useState({ account: "", bank: "", branch: "", promptPay: "" });
  const bind = (name: keyof typeof typed) => ({
    name,
    value: typed[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTyped((v) => ({ ...v, [name]: e.target.value })),
  });
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
    const bank = issue.refundBank;
    // The branch is optional (owner 24/10 evening) — its words come in only when the customer gave one.
    const bankVars = bank ? { amount, bank: bank.bank, branch: bank.branch ? fill(t.stockBranchPart, { branch: bank.branch }) : "", account: bank.accountMasked } : null;
    const text =
      issue.resolution === "swapped"
        ? t.stockSwapped
        : issue.resolution === "refunded"
          ? `${bankVars ? fill(t.stockRefundedBank, bankVars) : fill(t.stockRefunded, { amount, phone })}${issue.wholeOrder ? "" : ` ${t.stockRefundedPartial}`}`
          : issue.choice === "swap" || swapState.done
            ? t.stockChosenSwap
            : bankVars
              ? fill(t.stockChosenRefundBank, bankVars)
              : fill(t.stockChosenRefund, { amount, phone });
    // Owner 26/10 evening (queue B4): a settled refund reads "คืนเงินแล้ว" with the shop's transfer slip, so the customer
    // can check it — in the quiet green of the "shipped" pill (owner 23/10: the style for key moments), no ping.
    if (issue.resolution === "refunded") {
      const slipSrc = `/orders/${encodeURIComponent(orderNumber)}/refund-slip${token ? `?token=${encodeURIComponent(token)}` : ""}`;
      return (
        <div className="flex flex-col gap-3 rounded-xl border border-emerald-400/25 bg-emerald-400/[0.05] p-4 text-sm">
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-0.5 font-medium text-emerald-300 shadow-[0_0_14px_-2px_rgba(52,211,153,0.35)]">
            <span aria-hidden className="inline-flex size-2 rounded-full bg-emerald-400 shadow-[0_0_6px_1px_rgba(52,211,153,0.8)]" />
            {t.stockRefundedTitle}
          </span>
          <p className="text-foreground">{text}</p>
          {issue.refundSlip && (
            <a href={slipSrc} target="_blank" rel="noopener" className="flex flex-col gap-1.5 self-start">
              {/* eslint-disable-next-line @next/next/no-img-element -- private picture behind the order's access check */}
              <img src={slipSrc} alt={t.stockRefundSlipAlt} className="max-h-80 w-auto rounded-md border border-surface-border-soft object-contain" />
              <span className="text-xs text-foreground-muted">{t.stockRefundSlipOpen}</span>
            </a>
          )}
          <p className="text-foreground-muted">{withLineLink(t.stockContactNote)}</p>
        </div>
      );
    }
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
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          {/* The amber dot = the "waiting for payment" pill's dot without the ping (designer 24/10). */}
          <p className="flex items-start gap-2 text-lg font-semibold leading-snug text-foreground lg:text-xl">
            <span aria-hidden className="mt-2 inline-flex size-2 shrink-0 rounded-full bg-amber-300 shadow-[0_0_6px_1px_rgba(252,211,77,0.6)]" />
            {t.stockTitle}
          </p>
          <p className="text-foreground-muted">{t.stockLead}</p>
        </div>
        <ul className="flex flex-col gap-1.5 rounded-lg border border-surface-border-soft bg-surface-2 p-3">
          {issue.outLines.map((l) => (
            <li key={l.itemId} className="flex justify-between gap-4">
              <span className="text-foreground">{lineName(l)}</span>
              <span className="shrink-0 text-foreground-muted">× {l.quantity}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop: the swap and the refund sit side by side so the box is not a long column (owner 30/10: too long for a thank-you page). `contents` = no box on phones. */}
      <div className="contents lg:grid lg:grid-cols-2 lg:gap-x-8">
      {/* 1 — swap for a same-price item */}
      <form action={swapAction} className="flex flex-col gap-3 border-t border-surface-border-soft pt-4">
        {hidden}
        <p className={anySwap ? "font-semibold text-foreground" : "font-semibold text-foreground-muted"}>{t.stockSwapTitle}</p>
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
              <p role="alert" className="text-danger">
                {t[swapState.errorKey]}
              </p>
            )}
            <button type="submit" disabled={pending} className={equal}>
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
        <div className="flex flex-col gap-1">
          <p className="flex items-baseline justify-between gap-4">
            <span className="text-foreground-muted">{t.stockRefundAmount}</span>
            <span className="font-display text-xl font-semibold text-foreground">{amount}</span>
          </p>
          {!issue.wholeOrder && <p className="text-foreground-muted">{t.stockRefundPartialNote}</p>}
        </div>
        {mode === "bank" ? (
          <>
            <input type="hidden" name="mode" value="bank" />
            <label className="flex flex-col gap-1 text-foreground-muted">
              {t.stockRefundBankNumber}
              <input {...bind("account")} type="text" inputMode="numeric" autoComplete="off" maxLength={20} required className={field} />
            </label>
            <label className="flex flex-col gap-1 text-foreground-muted">
              {t.stockRefundBankName}
              <input {...bind("bank")} type="text" list="okami-th-banks" autoComplete="off" maxLength={60} required className={field} />
            </label>
            <datalist id="okami-th-banks">
              {TH_BANKS.map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>
            <label className="flex flex-col gap-1 text-foreground-muted">
              {t.stockRefundBankBranch}
              <input {...bind("branch")} type="text" autoComplete="off" maxLength={60} className={field} />
            </label>
            {refundState.errorKey && (
              <p role="alert" className="text-danger">
                {t[refundState.errorKey]}
              </p>
            )}
            <button type="submit" disabled={pending} className={secondary}>
              {refundPending ? t.stockPending : t.stockRefundBankCta}
            </button>
            <button
              type="button"
              onClick={() => setMode("own")}
              className="inline-flex min-h-11 items-center self-start text-foreground-muted underline underline-offset-4 hover:text-foreground"
            >
              {t.stockRefundBankBack}
            </button>
          </>
        ) : mode === "other" ? (
          <>
            <input type="hidden" name="mode" value="other" />
            <label className="flex flex-col gap-1 text-foreground-muted">
              {t.stockRefundOtherLabel}
              <input {...bind("promptPay")} type="tel" inputMode="numeric" autoComplete="tel" maxLength={14} required className={field} />
            </label>
            {refundState.errorKey && (
              <p role="alert" className="text-danger">
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
              <p role="alert" className="text-danger">
                {t[refundState.errorKey]}
              </p>
            )}
            {issue.ownPhoneMasked && (
              <button type="submit" disabled={pending} className={anySwap ? equal : primary}>
                {refundPending ? t.stockPending : fill(t.stockRefundOwnCta, { phone: issue.ownPhoneMasked })}
              </button>
            )}
            <button
              type="button"
              onClick={() => setMode("other")}
              className="inline-flex min-h-11 items-center self-start text-foreground-muted underline underline-offset-4 hover:text-foreground"
            >
              {t.stockRefundOtherLabel}
            </button>
            <button
              type="button"
              onClick={() => setMode("bank")}
              className="inline-flex min-h-11 items-center self-start text-foreground-muted underline underline-offset-4 hover:text-foreground"
            >
              {t.stockRefundBankLabel}
            </button>
          </>
        )}
      </form>
      </div>

      {/* The no-swap sentence already names LINE — say it once (designer 24/10). */}
      {anySwap && <p className="text-foreground-muted">{withLineLink(t.stockContactNote)}</p>}
    </div>
  );
}
