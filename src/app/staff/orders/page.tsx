import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { formatRunNumber } from "@/lib/commerce/run-number";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { countByJob, listStaffOrders, type StaffOrderFilter, type StaffOrderRow } from "@/lib/staff/orders";
import { isStaffJob, jobOf, STAFF_JOB_ORDER, STAFF_JOBS, STAFF_STATUS_LABEL, statusTone, TODO_JOBS, TONE_CLASS } from "@/lib/staff/jobs";
import { formatBaht, formatDateTime, VerdictBadge } from "@/app/staff/_components/order-bits";
import { StaffBar } from "@/app/staff/_components/StaffBar";

/**
 * /staff/orders?f=<job> — the web orders of one job box (owner 26/10, queue B3; jobs = src/lib/staff/jobs.ts; designer
 * direction 26/10). No `f` = every order waiting on the team, grouped by step; `f=all` = the newest 200. Waiting work is
 * listed oldest first. Same lock as /staff: 404 until the staff password is set, the login page without a staff session.
 * Not linked from the shop, not indexed. An order opened from here comes back to the same list (its link carries `from`).
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ออเดอร์ (ทีมงาน)",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const chip = "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-sm";

function OrderRow({ o, from, showStatus }: { o: StaffOrderRow; from: string; showStatus: boolean }) {
  const run = formatRunNumber(o.runNumber);
  return (
    <li>
      <Link
        href={`/staff/orders/${encodeURIComponent(o.orderNumber)}${from ? `?from=${from}` : ""}`}
        className="flex min-h-16 flex-col justify-center gap-1 px-4 py-3 hover:bg-surface-2"
      >
        <div className="flex items-baseline justify-between gap-3">
          <span className="min-w-0 truncate text-foreground">
            <span className="font-semibold tabular-nums">{run ?? o.orderNumber}</span>
            <span className="text-foreground-muted"> · {o.recipientName}</span>
          </span>
          <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">{formatBaht(o.total)}</span>
        </div>
        <div className="flex items-center justify-between gap-3 text-xs text-foreground-muted">
          <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            {showStatus && (
              <span className={`rounded-full border px-2 py-0.5 ${TONE_CLASS[statusTone(o.status)].pill}`}>{STAFF_STATUS_LABEL[o.status]}</span>
            )}
            {jobOf(o.status) === "slip" && o.slipVerdict && <VerdictBadge verdict={o.slipVerdict} />}
            <span>
              {o.itemCount} ชิ้น · {o.province}
            </span>
            {run && <span className="text-foreground-dim">{o.orderNumber}</span>}
          </span>
          <span className="shrink-0">{formatDateTime(o.createdAt)}</span>
        </div>
      </Link>
    </li>
  );
}

export default async function StaffOrdersPage({ searchParams }: { searchParams: Promise<{ f?: string }> }) {
  if (!staffAreaEnabled()) notFound();
  if (!(await isStaff())) redirect("/staff");
  const { f } = await searchParams;
  const filter: StaffOrderFilter = f === "all" ? "all" : isStaffJob(f) ? f : "todo";
  const orders = listStaffOrders(filter);
  const counts = countByJob();
  const todoCount = TODO_JOBS.reduce((n, j) => n + counts[j], 0);
  const title = filter === "all" ? "ออเดอร์ทั้งหมด" : filter === "todo" ? "ต้องทำทั้งหมด" : STAFF_JOBS[filter].label;
  const chips: { key: StaffOrderFilter; label: string; n: number | null }[] = [
    { key: "todo", label: "ต้องทำ", n: todoCount },
    ...STAFF_JOB_ORDER.map((j) => ({ key: j as StaffOrderFilter, label: STAFF_JOBS[j].label, n: counts[j] })),
    { key: "all", label: "ทั้งหมด", n: null },
  ];
  const from = filter === "todo" ? "" : filter;
  // One job on screen = every row has the same status, so the pill would only add noise (designer 26/10).
  const showStatus = filter === "all";
  const list = "flex flex-col divide-y divide-surface-border-soft rounded-xl border border-surface-border-soft bg-surface-1";

  return (
    <Container className="flex max-w-2xl flex-col gap-4 pb-8 pt-4 lg:gap-6 lg:pt-8">
      <StaffBar current="orders" back={{ href: "/staff", label: "หน้าแรก" }} todo={todoCount} />
      <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
        {title} <span className="text-foreground-dim">· {orders.length}</span>
      </h1>

      {/* Every job visible at once — two short rows on a phone, never a sideways scroll that hides half of them. */}
      <nav aria-label="กรองออเดอร์">
        <ul className="flex flex-wrap gap-2">
          {chips.map((c) => {
            const active = filter === c.key;
            const waiting = c.key === "todo" || (TODO_JOBS as readonly string[]).includes(c.key) || c.key === "unpaid";
            return (
              <li key={c.key}>
                <Link
                  href={c.key === "todo" ? "/staff/orders" : `/staff/orders?f=${c.key}`}
                  aria-current={active ? "page" : undefined}
                  className={
                    active
                      ? `${chip} border-ember bg-ember font-semibold text-[#181008]`
                      : `${chip} border-surface-border text-foreground-muted hover:text-foreground`
                  }
                >
                  {c.label}
                  {c.n !== null && (
                    <span className={`tabular-nums ${active ? "font-bold" : waiting && c.n > 0 ? "font-bold text-unverified" : "text-foreground-dim"}`}>
                      {c.n}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {orders.length === 0 ? (
        <p className="rounded-xl border border-surface-border-soft bg-surface-1 p-5 text-sm text-foreground-muted">ไม่มีออเดอร์ในหมวดนี้</p>
      ) : filter === "todo" ? (
        // Everything waiting on the team, one group per step in working order.
        TODO_JOBS.map((job, i) => {
          const rows = orders.filter((o) => jobOf(o.status) === job);
          if (rows.length === 0) return null;
          return (
            <section key={job} className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold text-foreground-muted">
                ขั้น {i + 1} · {STAFF_JOBS[job].label} <span className="text-unverified">{rows.length}</span>
              </h2>
              <ul className={list}>
                {rows.map((o) => (
                  <OrderRow key={o.orderNumber} o={o} from={job} showStatus={false} />
                ))}
              </ul>
            </section>
          );
        })
      ) : (
        <ul className={list}>
          {orders.map((o) => (
            <OrderRow key={o.orderNumber} o={o} from={from} showStatus={showStatus} />
          ))}
        </ul>
      )}
    </Container>
  );
}
