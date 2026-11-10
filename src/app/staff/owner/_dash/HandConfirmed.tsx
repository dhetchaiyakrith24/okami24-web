import Link from "next/link";
import { formatRunNumber } from "@/lib/commerce/run-number";
import type { HandConfirmedOrder } from "@/lib/staff/hand-confirm";
import { HAND_CONFIRM_REASON, pressedBy } from "@/lib/staff/hand-confirm-rules";
import { formatSatang, formatShortDateTime } from "@/app/staff/_components/format";

/**
 * T2-01 (owner 10/11): orders whose money the team confirmed without a slip that passed the check — the owner's own or the
 * team's orders, or a mistake. Only a list to read: totals and the order stay as they are. Rules =
 * src/lib/staff/hand-confirm-rules.ts.
 */
export function HandConfirmed({ orders, days, canOpen }: { orders: HandConfirmedOrder[]; days: number; canOpen: boolean }) {
  if (orders.length === 0) return null;
  return (
    <section aria-label="ยืนยันเงินเอง" className="dash-card dash-rise">
      <h2 className="font-semibold text-foreground">
        ยืนยันเงินเอง <span className="tabular-nums text-foreground-muted">· {orders.length}</span>
      </h2>
      <p className="text-sm leading-relaxed text-foreground-muted">ทีมกดยืนยันยอดเงินโดยไม่มีสลิปที่ผ่านการตรวจ · {days} วันล่าสุด</p>
      <ul className="dash-rows flex flex-col">
        {orders.map((o) => {
          const body = (
            <>
              <span className="flex min-w-0 flex-col">
                <span className="text-foreground">
                  {formatRunNumber(o.runNumber) ?? o.orderNumber}
                  {o.channel === "line" ? " · LINE" : ""} · {formatShortDateTime(o.createdAt)}
                </span>
                <span className="text-sm text-unverified">
                  {HAND_CONFIRM_REASON[o.kind]} · {pressedBy(o.by)}
                </span>
              </span>
              <span className="shrink-0 tabular-nums text-foreground">{formatSatang(o.total * 100)}</span>
            </>
          );
          return (
            <li key={o.orderNumber}>
              {canOpen ? (
                <Link href={`/staff/orders/${encodeURIComponent(o.orderNumber)}`} className="flex min-h-14 items-center justify-between gap-3 py-1 hover:text-ember-strong">
                  {body}
                </Link>
              ) : (
                <div className="flex min-h-14 items-center justify-between gap-3 py-1">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
