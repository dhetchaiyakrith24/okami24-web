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
import { countByJob } from "@/lib/staff/orders";
import { STAFF_JOBS, TODO_JOBS, type StaffJob } from "@/lib/staff/jobs";

/**
 * /staff — the staff home (owner 26/10, queue B3: "หาออเดอร์ที่ต้องทำไม่เจอ … ใช้บนมือถือ"): one box per job with its
 * count — รอตรวจสลิป · รอส่งคลัง · รอใส่เลขพัสดุ first, then ส่งแล้ว · ยกเลิก · ยังไม่จ่าย — each opening that job's list.
 * Jobs and colours = src/lib/staff/jobs.ts (yellow waiting, green done, red cancelled — HANDOFF §18). The slip-check tool
 * moved to /staff/slip.
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
  const quiet: StaffJob[] = ["unpaid", "done", "cancelled"];

  return (
    <Container className="flex max-w-xl flex-col gap-4 pb-8 pt-4 lg:gap-6 lg:pt-8">
      <StaffBar current="home" todo={todo} />
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">งานของทีม</h1>
        <p className="text-sm text-foreground-muted">{todo > 0 ? `รอทีมงาน ${todo} ออเดอร์ · เรียงตามขั้น` : "ไม่มีออเดอร์รอทีมงานตอนนี้"}</p>
      </header>

      {/* Designer 26/10 (layout A): the three to-do jobs as full-width rows in working order — the eye stops on the first
          one with work. Done / cancelled / unpaid sit below, small and quiet: "done" only grows, it is not work. */}
      <ol className="flex flex-col gap-3 lg:grid lg:grid-cols-3">
        {TODO_JOBS.map((job, i) => {
          const n = counts[job];
          return (
            <li key={job}>
              <Link
                href={`/staff/orders?f=${job}`}
                className={`flex min-h-[72px] items-center justify-between gap-4 rounded-2xl border px-5 py-3 transition-colors hover:bg-surface-2 ${
                  n > 0 ? "border-unverified/50 bg-unverified/10" : "border-surface-border-soft bg-surface-1"
                }`}
              >
                <span className="flex flex-col gap-0.5">
                  <span className="label-mono text-xs text-foreground-dim">ขั้น {i + 1}</span>
                  <span className="text-base font-semibold text-foreground">{STAFF_JOBS[job].label}</span>
                  <span className="text-xs text-foreground-muted">{STAFF_JOBS[job].hint}</span>
                </span>
                <span className={`font-display text-4xl font-bold tabular-nums leading-none ${n > 0 ? "text-unverified" : "text-foreground-dim"}`}>{n}</span>
              </Link>
            </li>
          );
        })}
      </ol>
      <ul className="grid grid-cols-3 gap-2">
        {quiet.map((job) => {
          const n = counts[job];
          const info = STAFF_JOBS[job];
          return (
            <li key={job}>
              <Link
                href={`/staff/orders?f=${job}`}
                className="flex h-14 flex-col items-center justify-center rounded-xl border border-surface-border-soft bg-surface-1 text-sm hover:bg-surface-2"
              >
                <span className={info.tone === "no" ? "text-danger" : "text-foreground-muted"}>{info.label}</span>
                <span className={`font-semibold tabular-nums ${job === "unpaid" && n > 0 ? "text-unverified" : "text-foreground-muted"}`}>{n}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <section className="flex flex-col divide-y divide-surface-border-soft rounded-xl border border-surface-border-soft bg-surface-1">
        <Link href="/staff/orders?f=all" className="flex min-h-12 items-center justify-between px-4 text-sm text-foreground hover:bg-surface-2">
          ออเดอร์ทั้งหมด <span aria-hidden>→</span>
        </Link>
        {/* Owner 23/10: a copy of every order on the shop's own computer — opens in Excel. */}
        <a href="/staff/api/export" download className="flex min-h-12 items-center justify-between px-4 text-sm text-foreground hover:bg-surface-2">
          ดาวน์โหลดออเดอร์ทั้งหมด (Excel) <span aria-hidden>↓</span>
        </a>
      </section>

      {lineConfigured() && (
        <details className="rounded-xl border border-surface-border-soft bg-surface-1 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-foreground-muted hover:text-foreground">ตั้งค่ากลุ่ม LINE ของบอท</summary>
          <div className="pt-3">
            <LineGroups />
          </div>
        </details>
      )}

      <form action={staffLogoutAction} className="flex justify-center">
        <button type="submit" className="rounded-full px-5 py-3 text-sm text-foreground-dim underline-offset-4 hover:text-foreground hover:underline">
          ออกจากระบบ
        </button>
      </form>
    </Container>
  );
}
