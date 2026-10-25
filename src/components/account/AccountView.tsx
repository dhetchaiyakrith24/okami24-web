"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LineThumb } from "@/components/commerce/LineThumb";
import type { LineImage } from "@/lib/commerce/line-image";
import { orderStatusLabel, type OrderStatus } from "@/lib/commerce/order-status";
import type { MemberProvider } from "@/lib/members/providers";
import { signOutAction } from "@/app/account/actions";
import { CONTACT } from "@/data/contact";
import { cn } from "@/lib/utils";
import { GOLD, MEMBER_GLOW } from "./account-ui";

export interface AccountOrder {
  orderNumber: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  itemCount: number;
  image: LineImage | null;
}

function formatTHB(value: number): string {
  return `฿${value.toLocaleString("th-TH")}`;
}

/** Same reading as /orders: ISO (UTC) or old SQLite "YYYY-MM-DD HH:MM:SS" (UTC), shown as the Thai calendar day. */
function formatDate(createdAt: string, locale: "th" | "en" | "zh"): string {
  const iso = createdAt.includes("T") ? createdAt : `${createdAt.replace(" ", "T")}Z`;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const tag = locale === "th" ? "th-TH" : locale === "zh" ? "zh-CN" : "en-GB";
  return d.toLocaleDateString(tag, { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Bangkok" });
}

/** How many of the four steps (paid · confirmed · shipped · received) an order has passed. Pending / cancelled = 0. */
function stepsDone(status: OrderStatus): number {
  switch (status) {
    case "payment_submitted":
    case "awaiting_verification":
      return 1;
    case "approved":
    case "processing":
      return 2;
    case "shipped":
      return 3;
    case "completed":
      return 4;
    default:
      return 0;
  }
}

function LatestOrderCard({ order }: { order: AccountOrder }) {
  const { dict, locale } = useLocale();
  const t = dict.account;
  const done = stepsDone(order.status);
  const steps = [t.stepPaid, t.stepConfirmed, t.stepShipped, t.stepReceived];
  return (
    <div className="rounded-[20px] border border-white/[0.07] bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.01))] p-[22px]">
      <div className="flex items-baseline justify-between">
        <span className="font-display text-[11px] font-semibold tracking-[0.32em]" style={{ color: GOLD }} lang="en">
          {t.latestOrder}
        </span>
        <span className="text-xs text-foreground-dim">{formatDate(order.createdAt, locale)}</span>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <LineThumb image={order.image} />
        <div className="min-w-0 flex-1">
          <div className="font-display text-xl font-semibold tracking-[0.02em] text-foreground">{order.orderNumber}</div>
          <div className="mt-0.5 text-[13px] text-foreground-muted">
            {t.orderMeta.replace("{count}", String(order.itemCount)).replace("{total}", formatTHB(order.total))}
          </div>
        </div>
      </div>
      {order.status === "pending_payment" || order.status === "cancelled" ? (
        <p className={cn("mt-5 text-sm font-medium", order.status === "pending_payment" ? "text-amber-200" : "text-foreground-muted")}>
          {orderStatusLabel(order.status, locale)}
        </p>
      ) : (
        <ol className="mt-[22px] flex gap-2" aria-label={orderStatusLabel(order.status, locale)}>
          {steps.map((label, i) => (
            <li key={label} className="flex-1">
              <i
                className={cn(
                  "block h-0.5 rounded-sm",
                  i < done ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.55)]" : "bg-surface-3",
                )}
              />
              <span className={cn("mt-2 block text-[11px]", i < done ? "text-emerald-200" : "text-foreground-dim")}>{label}</span>
            </li>
          ))}
        </ol>
      )}
      <Link
        href={`/orders/${encodeURIComponent(order.orderNumber)}`}
        className="mt-[22px] flex h-12 items-center justify-center rounded-[14px] border border-[rgba(200,178,138,0.45)] text-[15px] text-[#e8dcc4] transition-colors hover:bg-white/[0.03]"
      >
        {t.viewOrder}
      </Link>
    </div>
  );
}

function RowLink({ href, title, sub, external }: { href: string; title: string; sub?: string; external?: boolean }) {
  const body: ReactNode = (
    <>
      <span>
        {title}
        {sub && <small className="mt-[3px] block text-xs text-foreground-dim">{sub}</small>}
      </span>
      <span aria-hidden style={{ color: GOLD }}>
        →
      </span>
    </>
  );
  const cls = "flex items-center justify-between border-b border-white/[0.06] py-[18px] text-[15px] text-foreground transition-colors hover:text-white";
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {body}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {body}
    </Link>
  );
}

/**
 * /account — drafts v2 (owner 26/10): greeting, the latest order with its four-step bar, then quiet links. Phone = one
 * column; desktop = order card left, links right. Only orders placed while signed in are listed (src/lib/commerce/orders.ts
 * `listOrdersForMember`) — never orders matched by phone alone.
 */
export function AccountView({ displayName, provider, orders }: { displayName: string | null; provider: MemberProvider; orders: AccountOrder[] }) {
  const { dict, locale } = useLocale();
  const t = dict.account;
  const latest = orders[0] ?? null;
  const providerName = provider === "line" ? "LINE" : "Google";

  return (
    <div className="px-6 pb-10 pt-11 lg:px-0 lg:pb-20 lg:pt-[72px]" style={{ backgroundImage: MEMBER_GLOW }}>
      <div className="mx-auto w-full max-w-[1040px]">
        <span className="font-display text-xs font-semibold tracking-[0.32em]" style={{ color: GOLD }} lang="en">
          {t.eyebrow}
        </span>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-[0.02em] text-foreground">
          {displayName ? t.greeting.replace("{name}", displayName) : t.greetingNoName}
        </h1>
        <p className="mt-2 text-[13px] text-foreground-muted">{t.signedInWith.replace("{provider}", providerName)}</p>

        <div className="mt-[30px] grid gap-[18px] lg:mt-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          <div>
            {latest ? (
              <LatestOrderCard order={latest} />
            ) : (
              <div className="rounded-[20px] border border-white/[0.07] p-[22px]">
                <p className="text-[15px] text-foreground">{t.noOrdersTitle}</p>
                <p className="mt-1.5 text-[13px] text-foreground-muted">{t.noOrdersBody}</p>
              </div>
            )}
          </div>
          <div>
            {orders.length > 1 && <RowLink href="#all-orders" title={t.linkOrders} sub={t.linkOrdersSub} />}
            {/* Owner 26/10: customers who ordered before signing in have only their phone — the phone lookup stays one tap away. */}
            <RowLink href="/orders" title={t.linkPhoneOrders} sub={t.linkPhoneOrdersSub} />
            <RowLink href={CONTACT.youtubeUrl} title={t.linkYoutube} sub={t.linkYoutubeSub} external />
            <RowLink href="/guides" title={t.linkGuides} sub={t.linkGuidesSub} />
            <RowLink href="/products?stock=in" title={t.linkProducts} sub={t.linkProductsSub} />
            <RowLink href={CONTACT.lineUrl} title={t.linkContact} sub={`LINE ${CONTACT.lineId}`} external />
            <form action={signOutAction}>
              <button
                type="submit"
                className="flex w-full items-center justify-between border-b border-white/[0.06] py-[18px] text-left text-[15px] text-foreground-muted transition-colors hover:text-foreground"
              >
                {t.signOut}
                <span aria-hidden style={{ color: GOLD }}>
                  →
                </span>
              </button>
            </form>
          </div>
        </div>

        {orders.length > 1 && (
          <section id="all-orders" className="mt-12 scroll-mt-24">
            {/* Thai heading — no letter-spacing (tracking pulls Thai vowel marks off their consonants); the gold carries the look. */}
            <h2 className="text-sm font-medium" style={{ color: GOLD }}>
              {t.allOrdersTitle}
            </h2>
            <ul className="mt-4 flex flex-col divide-y divide-white/[0.06] rounded-[20px] border border-white/[0.07]">
              {orders.map((o) => (
                <li key={o.orderNumber}>
                  <Link
                    href={`/orders/${encodeURIComponent(o.orderNumber)}`}
                    className="flex items-center justify-between gap-4 p-4 text-sm transition-colors hover:bg-white/[0.03]"
                  >
                    <span className="flex flex-col gap-1">
                      <span className="font-medium text-foreground">{o.orderNumber}</span>
                      <span className="text-foreground-muted">{formatDate(o.createdAt, locale)}</span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1">
                      <span className={cn("font-medium", o.status === "pending_payment" ? "text-amber-200" : o.status === "shipped" ? "text-emerald-300" : "text-foreground")}>
                        {orderStatusLabel(o.status, locale)}
                      </span>
                      <span className="text-foreground-muted">{formatTHB(o.total)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
