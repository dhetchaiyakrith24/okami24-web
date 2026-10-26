"use client";

import Link from "next/link";
import { useActionState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { orderLookupAction, type OrderLookupState } from "@/app/orders/actions";
import { orderStatusLabel, type OrderStatus } from "@/lib/commerce/order-status";
import { cn } from "@/lib/utils";

// Kept here, not in actions.ts: a "use server" file may only export async functions (see checkout/actions.ts).
const initialState: OrderLookupState = { errorKey: null, phone: "" };

export interface OrderListItem {
  orderNumber: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
}

function formatTHB(value: number): string {
  return `฿${value.toLocaleString("th-TH")}`;
}

/** orders.created_at is an ISO string (UTC, with "Z"); an older SQLite `datetime('now')` form ("YYYY-MM-DD HH:MM:SS", UTC
 *  without a zone) is read as UTC too. Shown as the Thai calendar day. */
function formatDate(createdAt: string, locale: "th" | "en" | "zh"): string {
  const iso = createdAt.includes("T") ? createdAt : `${createdAt.replace(" ", "T")}Z`;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const tag = locale === "th" ? "th-TH" : locale === "zh" ? "zh-CN" : "en-GB";
  return d.toLocaleDateString(tag, { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Bangkok" });
}

/** 0812345678 → 081-xxx-5678: enough for the customer to recognise their own number on screen, not the whole number. */
function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 ? `${digits.slice(0, 3)}-xxx-${digits.slice(-4)}` : phone;
}

function LookupForm({ again }: { again: boolean }) {
  const { dict } = useLocale();
  const t = dict.orderLookup;
  const [state, formAction, pending] = useActionState(orderLookupAction, initialState);
  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-xl border border-surface-border-soft bg-surface-1 p-4">
      <label className="flex flex-col gap-1.5 text-sm text-foreground-muted" htmlFor="lookup-phone">
        {again ? t.otherPhoneLabel : t.phoneLabel}
        <input
          id="lookup-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder={dict.checkout.phonePlaceholder}
          defaultValue={state.phone}
          required
          className="rounded-md border border-surface-border bg-surface-2 px-3 py-2 text-base text-foreground"
        />
      </label>
      {state.errorKey && <p className="text-sm text-danger">{t[state.errorKey]}</p>}
      <Button type="submit" variant={again ? "secondary" : "primary"} className="mt-2 w-full justify-center">
        {pending ? "…" : t.submitCta}
      </Button>
    </form>
  );
}

/**
 * /orders — "ติดตามคำสั่งซื้อ" (owner 24/10). Signed in (after checkout on this device, or after the phone form here):
 * the customer's orders, newest first, each linking to its order page. Not signed in: the phone form.
 */
export function OrderLookupView({ phone, orders }: { phone: string | null; orders: OrderListItem[] }) {
  const { dict, locale } = useLocale();
  const t = dict.orderLookup;
  const signedIn = phone !== null;

  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} description={signedIn ? undefined : t.description} />
      <Container className="flex max-w-xl flex-col gap-8 py-12 lg:py-16">
        {signedIn && (
          <div className="flex flex-col gap-3">
            <span className="label-mono text-xs text-foreground-dim">{t.listTitle.replace("{phone}", maskPhone(phone))}</span>
            {orders.length === 0 ? (
              <p className="text-sm text-foreground-muted">{t.emptyNote}</p>
            ) : (
              <ul className="flex flex-col divide-y divide-surface-border-soft rounded-xl border border-surface-border-soft bg-surface-1">
                {orders.map((o) => (
                  <li key={o.orderNumber}>
                    <Link
                      href={`/orders/${encodeURIComponent(o.orderNumber)}`}
                      className="flex items-center justify-between gap-4 p-4 text-sm transition-colors hover:bg-surface-2"
                    >
                      <span className="flex flex-col gap-1">
                        <span className="font-medium text-foreground">{o.orderNumber}</span>
                        <span className="text-foreground-muted">{formatDate(o.createdAt, locale)}</span>
                      </span>
                      <span className="flex shrink-0 flex-col items-end gap-1">
                        <span
                          className={cn(
                            "font-medium",
                            o.status === "pending_payment" ? "text-amber-200" : o.status === "shipped" ? "text-emerald-300" : "text-foreground",
                          )}
                        >
                          {orderStatusLabel(o.status, locale)}
                        </span>
                        <span className="text-foreground-muted">{formatTHB(o.total)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <LookupForm again={signedIn} />
      </Container>
    </>
  );
}
