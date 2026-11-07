import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { formatRunNumber } from "@/lib/commerce/run-number";
import { isOwner, ownerAreaEnabled } from "@/lib/owner/auth";
import { lastRound } from "@/lib/owner/bill-rules";
import { listRounds, type StoredRound } from "@/lib/owner/bills";
import { profitDays } from "@/lib/owner/costs";
import type { DayProfit } from "@/lib/owner/cost-rules";
import { salesToday } from "@/lib/staff/daily-sales";
import { PendingButton } from "@/app/staff/_components/PendingButton";
import { StaffBar } from "@/app/staff/_components/StaffBar";
import { formatSatang } from "@/app/staff/_components/format";
import { LIST_CLASS } from "@/app/staff/_components/OrderRow";
import { ownerLogoutAction } from "@/app/staff/owner/actions";

/**
 * /staff/owner — the owner's section (back-office round 07/11). Google sign-in only; the staff password opens nothing here.
 * 404 until OKAMI24_OWNER_GOOGLE_EMAIL is set on the host (src/lib/owner/auth.ts). Not linked from the shop, not in the sitemap.
 * Today's sales, web profit per day and per order, the last checked week. LINE profit is weekly by the owner's ruling 04/11:
 * a slip says nothing about what was bought, so only the warehouse bill can price it.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ส่วนเจ้าของ",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const PROFIT_DAYS = 14;
const DAY_LABEL = new Intl.DateTimeFormat("th-TH", { timeZone: "Asia/Bangkok", weekday: "short", day: "numeric", month: "short" });
const dayLabel = (date: string) => DAY_LABEL.format(new Date(`${date}T12:00:00+07:00`));

/** Designer 07/11: the second question of the page, so it always answers, also when there is nothing or only an old week to show. */
function WeekProfitRow({ round }: { round: StoredRound | undefined }) {
  if (!round) {
    return (
      <Link href="/staff/owner/bill#new" className="flex min-h-16 items-center justify-between gap-3 border-y border-surface-border-soft py-3 hover:bg-surface-2">
        <span className="text-sm text-foreground-muted">กำไรรายสัปดาห์</span>
        <span className="text-sm text-unverified">ยังไม่มีรอบที่เทียบ · วางไฟล์บิล →</span>
      </Link>
    );
  }
  const profit = round.week.totalProfit;
  const stale = round.to < lastRound().to;
  const noSlips = round.week.lineSales === 0 && round.totals.lineBill > 0;
  return (
    <Link href={`/staff/owner/bill?round=${round.id}`} className="flex min-h-16 items-center justify-between gap-3 border-y border-surface-border-soft py-3 hover:bg-surface-2">
      <span className="flex min-w-0 flex-col text-sm text-foreground-muted">
        <span>
          กำไรรอบ {round.from.slice(8, 10)}/{round.from.slice(5, 7)} ถึง {round.to.slice(8, 10)}/{round.to.slice(5, 7)}
        </span>
        {stale && <span className="text-unverified">รอบล่าสุดยังไม่ได้เทียบ</span>}
        {noSlips && <span className="text-unverified">ไม่มียอดสลิปในรอบนี้ กำไร LINE ยังเชื่อไม่ได้</span>}
      </span>
      <span className="flex shrink-0 items-center gap-2">
        <span className="flex flex-col items-end">
          <span className={`font-display text-2xl font-bold tabular-nums leading-tight ${profit < 0 ? "text-danger" : "text-foreground"}`}>{formatSatang(Math.round(profit * 100))}</span>
          {round.diffs.length > 0 && <span className="text-xs text-unverified">ไม่ตรง {round.diffs.length} จุด</span>}
        </span>
        <span aria-hidden className="text-foreground-dim">
          ›
        </span>
      </span>
    </Link>
  );
}

function ProfitRow({ day }: { day: DayProfit }) {
  if (day.orders.length === 0) {
    return (
      <li className="flex min-h-12 items-center justify-between gap-3 px-4 text-sm text-foreground-dim">
        <span>{dayLabel(day.date)}</span>
        <span>ไม่มีออเดอร์</span>
      </li>
    );
  }
  return (
    <li>
      <details className="group">
        <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
          <span className="flex min-w-0 flex-col">
            <span className="text-sm font-semibold text-foreground">{dayLabel(day.date)}</span>
            {day.unpriced > 0 && <span className="text-xs text-unverified">ไม่มีทุน {day.unpriced} ออเดอร์</span>}
          </span>
          <span className="flex shrink-0 items-center gap-2">
            <span className="flex flex-col items-end">
              <span className="font-semibold tabular-nums text-foreground">{formatSatang(day.profitSatang)}</span>
              <span className="text-xs tabular-nums text-foreground-muted">ขาย {formatSatang(day.salesSatang)}</span>
            </span>
            <span aria-hidden className="text-foreground-dim transition-transform group-open:rotate-90">
              ›
            </span>
          </span>
        </summary>
        <ul className="flex flex-col gap-1 border-t border-surface-border-soft px-4 py-3 text-sm text-foreground-muted">
          {day.orders.map((o) => (
            <li key={o.orderNumber} className="flex items-baseline justify-between gap-3 py-1">
              <span className="min-w-0 truncate tabular-nums">
                {formatRunNumber(o.runNumber) ?? o.orderNumber} · ขาย {formatSatang(o.total * 100)}
              </span>
              {o.profitSatang === null ? (
                <span className="shrink-0 text-unverified">ไม่มีทุน {o.missing.filter(Boolean).join(" ")}</span>
              ) : (
                <span className="shrink-0 tabular-nums text-foreground">{formatSatang(o.profitSatang)}</span>
              )}
            </li>
          ))}
        </ul>
      </details>
    </li>
  );
}

export default async function OwnerPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  if (!ownerAreaEnabled()) notFound();
  const { denied } = await searchParams;

  if (!(await isOwner())) {
    return (
      <Container className="flex max-w-xl flex-col gap-6 pb-28 pt-8 lg:pt-12">
        <StaffBar />
        <header className="flex flex-col gap-2">
          <span className="label-mono text-xs text-ember">OKami24 · เจ้าของ</span>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">ส่วนเจ้าของ</h1>
          <p className="text-sm leading-relaxed text-foreground-muted">หน้านี้เปิดได้เฉพาะบัญชี Google ของเจ้าของร้าน</p>
        </header>
        {denied !== undefined && <p className="text-sm text-danger">บัญชีนี้เข้าส่วนเจ้าของไม่ได้</p>}
        {/* A full page load on purpose: the route answers with a redirect to Google. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/api/auth/owner"
          className="inline-flex min-h-12 w-fit items-center rounded-full bg-ember px-6 text-sm font-semibold text-background hover:opacity-90"
        >
          เข้าสู่ระบบด้วย Google
        </a>
      </Container>
    );
  }

  const today = salesToday();
  const days = profitDays(PROFIT_DAYS);
  const unpriced = days.reduce((n, d) => n + d.unpriced, 0);
  const round = listRounds(1)[0];

  return (
    <Container className="flex max-w-2xl flex-col gap-5 pb-8 pt-4 lg:gap-6 lg:pt-8">
      <StaffBar />
      <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">ส่วนเจ้าของ</h1>

      <section aria-label="ยอดขายวันนี้" className="flex flex-col gap-1">
        <span className="text-sm text-foreground-muted">ยอดขายวันนี้</span>
        <span className="font-display text-4xl font-bold tabular-nums leading-tight text-foreground">{formatSatang(today.totalSatang)}</span>
        <span className="text-sm tabular-nums text-foreground-muted">
          เว็บ {formatSatang(today.webSatang)} · LINE {formatSatang(today.lineSatang)}
        </span>
      </section>

      <WeekProfitRow round={round} />

      <nav aria-label="เมนูเจ้าของ" className="grid grid-cols-2 gap-2 lg:gap-3">
        {[
          { href: "/staff/owner/bill#new", label: "เทียบบิลคลัง", line: "วางไฟล์ทุกเสาร์" },
          { href: "/staff/owner/costs", label: "ตารางทุน", line: "อัปเดตทุน" },
        ].map((t) => (
          <Link key={t.href} href={t.href} className="flex min-h-20 flex-col justify-between gap-2 rounded-xl border border-surface-border-soft bg-surface-1 p-3 hover:bg-surface-2 lg:p-4">
            <span className="text-sm font-semibold text-foreground">{t.label}</span>
            <span className="text-xs text-foreground-dim">{t.line}</span>
          </Link>
        ))}
      </nav>

      <section aria-label={`กำไรเว็บ ${PROFIT_DAYS} วัน`} className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-foreground">กำไรเว็บรายวัน</h2>
        {unpriced > 0 && <p className="text-sm text-unverified">ออเดอร์ไม่มีทุน {unpriced} รายการ ไม่นับในกำไร</p>}
        <ul className={LIST_CLASS}>
          {days.map((day) => (
            <ProfitRow key={day.date} day={day} />
          ))}
        </ul>
        <p className="text-sm leading-relaxed text-foreground-muted">กำไร = ลูกค้าจ่าย หักทุน หักค่าส่งคลัง 35 บาท · กำไร LINE ดูรายสัปดาห์ในหน้าเทียบบิล</p>
      </section>

      <form action={ownerLogoutAction}>
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
