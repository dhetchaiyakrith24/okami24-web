import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { staffLogoutAction } from "@/app/staff/actions";
import { StaffLogin } from "@/app/staff/_components/StaffLogin";
import { StaffBar } from "@/app/staff/_components/StaffBar";
import { PendingButton } from "@/app/staff/_components/PendingButton";
import { countByJob, listStaffOrders } from "@/lib/staff/orders";
import { LIST_CLASS, OrderRow } from "@/app/staff/_components/OrderRow";
import { jobOf, STAFF_JOBS, TODO_JOBS, type StaffJob } from "@/lib/staff/jobs";
import { orderCountDays } from "@/lib/staff/order-count";
import { formatDay } from "@/app/staff/_components/format";

/**
 * /staff — "งาน", the staff home (owner 26/10, queue B3: "หาออเดอร์ที่ต้องทำไม่เจอ … ใช้บนมือถือ"; staff declutter 27/10):
 * every order waiting on the team, under รอตรวจสลิป · รอส่งคลัง · รอใส่เลขพัสดุ in working order, then one line to the other
 * jobs and log out; the section boxes on top (owner 28/10) lead to the slip check and Okami dev. Jobs and colours =
 * src/lib/staff/jobs.ts (yellow waiting, green done, red cancelled — HANDOFF §18).
 *
 * Not for customers and not for search: no link to it anywhere on the site, not in the sitemap, noindex here. It is also
 * deliberately NOT listed in robots.txt — that file is public, and listing the path there would only advertise it. 404
 * until the owner sets OKAMI24_STAFF_PASSWORD on the host.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ทีมงาน",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default async function StaffPage() {
  if (!staffAreaEnabled()) notFound();
  const loggedIn = await isStaff();

  if (!loggedIn) {
    return (
      <Container className="flex max-w-xl flex-col gap-6 pb-28 pt-8 lg:pt-12">
        <header className="flex flex-col gap-2">
          <span className="label-mono text-xs text-ember">OKami24 · ทีมงาน</span>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">หน้าทีมงาน</h1>
          <p className="text-sm leading-relaxed text-foreground-muted">หน้านี้สำหรับทีมงานร้านเท่านั้น ใส่รหัสทีมงานเพื่อเข้าใช้</p>
        </header>
        <StaffLogin />
      </Container>
    );
  }

  const counts = countByJob();
  const todo = TODO_JOBS.reduce((n, j) => n + counts[j], 0);
  const waiting = listStaffOrders("todo");
  const others: StaffJob[] = ["unpaid", "done", "cancelled"];
  const dayCounts = orderCountDays(2);
  const waitingToday = dayCounts[0].line.waiting + dayCounts[0].web.waiting;

  return (
    <Container className="flex max-w-2xl flex-col gap-5 pb-8 pt-4 lg:gap-6 lg:pt-8">
      <StaffBar tab="orders" />
      <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
        งาน <span className={todo > 0 ? "text-unverified" : "text-foreground-dim"}>· {todo}</span>
      </h1>

      {/* LINE_ORDERS_GAPS.md #13 (owner 10/11): the web IS the daily order count — the admins no longer post "#N" in the
          OKAMI ORDER group. Today and yesterday; the money of the day is /staff/sales. Rules = order-count-rules.ts. */}
      <section aria-label="นับออเดอร์" className="flex flex-col gap-1.5 rounded-xl border border-surface-border-soft bg-surface-1 px-4 py-3 text-sm">
        {dayCounts.map((d, i) => (
          <p key={d.date} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <span className="text-foreground-muted">
              {i === 0 ? "วันนี้" : "เมื่อวาน"} {formatDay(`${d.date}T12:00:00+07:00`)}
            </span>
            <span className="tabular-nums text-foreground">
              LINE <span className="font-semibold">{d.line.orders}</span> · เว็บ <span className="font-semibold">{d.web.orders}</span> · รวม{" "}
              <span className="font-semibold">{d.line.orders + d.web.orders}</span>
            </span>
          </p>
        ))}
        <p className="flex flex-wrap items-center justify-between gap-x-3">
          <span className={waitingToday > 0 ? "text-xs text-unverified" : "text-xs text-foreground-dim"}>
            {waitingToday > 0 ? `วันนี้รอยืนยันยอด ${waitingToday}` : "นับออเดอร์ที่ไม่ยกเลิก · เว็บนับเมื่อลูกค้าโอนแล้ว"}
          </span>
          <Link href="/staff/sales" className="inline-flex min-h-11 items-center text-sm text-ember hover:text-ember-strong">
            ยอดเงินรายวัน →
          </Link>
        </p>
      </section>

      {/* Staff declutter 27/10 (designer: "one way per job"): the to-do orders right here, under one heading per step in
          working order — the step cards, the filter chips and the step groups of the old list were three ways to the same
          rows. A heading opens that step on its own page; an empty step is one quiet line. */}
      {TODO_JOBS.map((job) => {
        const rows = waiting.filter((o) => jobOf(o.status) === job);
        return (
          <section key={job} className="flex flex-col gap-2">
            <h2 className="flex items-baseline justify-between gap-3">
              <Link href={`/staff/orders?f=${job}`} className={`text-lg font-semibold hover:underline ${rows.length > 0 ? "text-foreground" : "text-foreground-dim"}`}>
                {STAFF_JOBS[job].label}
              </Link>
              <span className={`font-display text-2xl font-bold tabular-nums leading-none ${rows.length > 0 ? "text-unverified" : "text-foreground-dim"}`}>
                {rows.length > 0 ? rows.length : "ไม่มี"}
              </span>
            </h2>
            {rows.length > 0 && (
              <ul className={LIST_CLASS}>
                {rows.map((o) => (
                  <OrderRow key={o.orderNumber} o={o} from="" showStatus={false} />
                ))}
              </ul>
            )}
          </section>
        );
      })}

      {/* Not work, but still one tap away and always visible (designer risk (ค)): the other jobs on one quiet line. */}
      <nav aria-label="ออเดอร์อื่น" className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-foreground-muted">
        <span className="text-foreground-dim">ดูออเดอร์อื่น</span>
        {others.map((job) => (
          <Link key={job} href={`/staff/orders?f=${job}`} className="hover:text-foreground">
            {STAFF_JOBS[job].label}{" "}
            <span className={`tabular-nums ${job === "unpaid" && counts[job] > 0 ? "font-semibold text-unverified" : ""}`}>{counts[job]}</span>
          </Link>
        ))}
        <Link href="/staff/orders?f=all" className="hover:text-foreground">
          ทั้งหมด
        </Link>
      </nav>

      {/* Owner list ก11: the customer card and the parcel check, on the same quiet kind of line. */}
      <nav aria-label="ลูกค้าและพัสดุ" className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-foreground-muted">
        <Link href="/staff/line-order" className="inline-flex min-h-11 items-center font-semibold text-ember hover:text-ember-strong">
          + คีย์ออเดอร์ LINE
        </Link>
        <Link href="/staff/customers" className="inline-flex min-h-11 items-center hover:text-foreground">
          ลูกค้า →
        </Link>
        <Link href="/staff/tracking" className="inline-flex min-h-11 items-center hover:text-foreground">
          เช็คพัสดุ →
        </Link>
      </nav>

      {/* The tools that sat in the folded "อื่น ๆ" row moved under the boxes at the top (owner 28/10): slip check → ตรวจสลิป,
          Shipnity · Excel · LINE groups → Okami dev. Log out stays here as one quiet line. */}
      <form action={staffLogoutAction}>
        <PendingButton
          className="-ml-2 inline-flex min-h-11 items-center rounded-full px-2 text-sm text-foreground-dim hover:bg-surface-2 hover:text-foreground"
          pendingText="กำลังออก…"
        >
          ออกจากระบบ
        </PendingButton>
      </form>
    </Container>
  );
}
