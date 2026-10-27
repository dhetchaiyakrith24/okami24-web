import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { staffLogoutAction } from "@/app/staff/actions";
import { StaffLogin } from "@/app/staff/_components/StaffLogin";
import { LineGroups } from "@/app/staff/_components/LineGroups";
import { StaffBar } from "@/app/staff/_components/StaffBar";
import { lineConfigured } from "@/lib/line/client";
import { countByJob, listStaffOrders } from "@/lib/staff/orders";
import { LIST_CLASS, OrderRow } from "@/app/staff/_components/OrderRow";
import { jobOf, STAFF_JOBS, TODO_JOBS, type StaffJob } from "@/lib/staff/jobs";

/**
 * /staff — "งาน", the staff home (owner 26/10, queue B3: "หาออเดอร์ที่ต้องทำไม่เจอ … ใช้บนมือถือ"; staff declutter 27/10):
 * every order waiting on the team, under รอตรวจสลิป · รอส่งคลัง · รอใส่เลขพัสดุ in working order, then one line to the other
 * jobs and one folded row of tools (slip check from LINE · Excel · LINE groups · log out). Jobs and colours =
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
  const more = "flex min-h-12 items-center justify-between px-4 text-sm text-foreground hover:bg-surface-2";

  return (
    <Container className="flex max-w-2xl flex-col gap-5 pb-8 pt-4 lg:gap-6 lg:pt-8">
      <StaffBar />
      <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
        งาน <span className={todo > 0 ? "text-unverified" : "text-foreground-dim"}>· {todo}</span>
      </h1>

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

      {/* The rarely used tools, folded into one row at the foot. */}
      <details className="group rounded-xl border border-surface-border-soft bg-surface-1">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 text-sm text-foreground-muted hover:text-foreground [&::-webkit-details-marker]:hidden">
          อื่น ๆ
          <span aria-hidden className="text-foreground-dim transition-transform group-open:rotate-90">›</span>
        </summary>
        <div className="flex flex-col divide-y divide-surface-border-soft border-t border-surface-border-soft">
          <Link href="/staff/slip" className={more}>
            ตรวจสลิปจาก LINE <span aria-hidden>→</span>
          </Link>
          {/* Owner 27/10: the warehouse's Shipnity connects here (key pair + call log). */}
          <Link href="/staff/shipnity" className={more}>
            เชื่อมคลัง Shipnity <span aria-hidden>→</span>
          </Link>
          {/* Owner 23/10: a copy of every order on the shop's own computer — opens in Excel. */}
          <a href="/staff/api/export" download className={more}>
            ดาวน์โหลดออเดอร์ทั้งหมด (Excel) <span aria-hidden>↓</span>
          </a>
          {lineConfigured() && (
            <details className="px-4 py-3">
              <summary className="cursor-pointer text-sm text-foreground hover:text-foreground">ตั้งค่ากลุ่ม LINE ของบอท</summary>
              <div className="pt-3">
                <LineGroups />
              </div>
            </details>
          )}
          <form action={staffLogoutAction}>
            <button type="submit" className={`${more} w-full text-foreground-muted`}>
              ออกจากระบบ
            </button>
          </form>
        </div>
      </details>
    </Container>
  );
}
