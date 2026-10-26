import Link from "next/link";
import { formatRunNumber } from "@/lib/commerce/run-number";
import type { StaffOrderRow } from "@/lib/staff/orders";
import { jobOf, STAFF_STATUS_LABEL, statusTone, TONE_CLASS } from "@/lib/staff/jobs";
import { formatBaht, formatShortDateTime, VerdictBadge } from "@/app/staff/_components/order-bits";

/** One order as a row of a staff list (the "งาน" page and /staff/orders). `from` = the list it was opened from (Back goes
 *  there); `showStatus` only where rows of different jobs share one list. */
export function OrderRow({ o, from, showStatus }: { o: StaffOrderRow; from: string; showStatus: boolean }) {
  const run = formatRunNumber(o.runNumber);
  return (
    <li>
      <Link
        href={`/staff/orders/${encodeURIComponent(o.orderNumber)}${from ? `?from=${from}` : ""}`}
        className="flex min-h-16 flex-col justify-center gap-1 px-4 py-3 hover:bg-surface-2"
      >
        <div className="flex items-baseline justify-between gap-3">
          <span className="min-w-0 truncate">
            <span className="font-semibold tabular-nums text-foreground">{run ?? o.orderNumber}</span>
            {run && <span className="ml-2 text-xs text-foreground-dim">{o.orderNumber}</span>}
          </span>
          <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">{formatBaht(o.total)}</span>
        </div>
        <div className="flex items-baseline justify-between gap-3 text-sm text-foreground-muted">
          <span className="min-w-0 truncate">
            {o.recipientName} · {o.itemCount} ชิ้น · {o.province}
          </span>
          <span className="shrink-0 text-xs">{formatShortDateTime(o.createdAt)}</span>
        </div>
        {(showStatus || (jobOf(o.status) === "slip" && o.slipVerdict)) && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {showStatus && (
              <span className={`rounded-full border px-2 py-0.5 ${TONE_CLASS[statusTone(o.status)].pill}`}>{STAFF_STATUS_LABEL[o.status]}</span>
            )}
            {jobOf(o.status) === "slip" && o.slipVerdict && <VerdictBadge verdict={o.slipVerdict} />}
          </div>
        )}
      </Link>
    </li>
  );
}

export const LIST_CLASS = "flex flex-col divide-y divide-surface-border-soft rounded-xl border border-surface-border-soft bg-surface-1";
