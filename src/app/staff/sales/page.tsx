import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { formatRunNumber } from "@/lib/commerce/run-number";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { ownerAreaEnabled } from "@/lib/owner/auth";
import { SALES_DAYS, salesDays } from "@/lib/staff/daily-sales";
import type { DaySales, SalesSlip } from "@/lib/staff/daily-sales-rules";
import { countByJob } from "@/lib/staff/orders";
import { StaffBar } from "@/app/staff/_components/StaffBar";
import { formatSatang } from "@/app/staff/_components/format";
import { LIST_CLASS } from "@/app/staff/_components/OrderRow";

/**
 * /staff/sales — "ยอดขาย" (owner 04/11 "อยากดูได้จากระบบหลังบ้านเว็บและก็ตรวจได้ทุกวัน ทุก Week"; back-office round 07/11, batch 2):
 * web + LINE per day, on a phone. Open a day to check it against the orders and the slips behind the number.
 * The whole team sees this page, so it shows no cost and no profit (owner 04/11: those are the owner's alone). What counts =
 * src/lib/staff/daily-sales-rules.ts. It changes nothing. Same lock as every staff page.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ยอดขาย (ทีมงาน)",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const DAY_LABEL = new Intl.DateTimeFormat("th-TH", { timeZone: "Asia/Bangkok", weekday: "short", day: "numeric", month: "short" });
const TIME = new Intl.DateTimeFormat("th-TH", { timeZone: "Asia/Bangkok", hour: "2-digit", minute: "2-digit" });

const dayLabel = (date: string) => DAY_LABEL.format(new Date(`${date}T12:00:00+07:00`));
const timeOf = (iso: string) => TIME.format(new Date(iso));
const sum = (days: DaySales[], pick: (d: DaySales) => number) => days.reduce((n, d) => n + pick(d), 0);
/** LINE refunds already off the day's LINE figure (refund-rules.ts applyRefunds). */
const refundedOf = (day: DaySales) => day.slips.reduce((n, s) => n + (s.refundedSatang ?? 0), 0);

/** Designer 07/11: today is the one number on the page that wins; no box, so it does not read as one more link box. */
function Today({ day }: { day: DaySales }) {
  return (
    <section aria-label="ยอดวันนี้" className="flex flex-col gap-1">
      <span className="text-sm text-foreground-muted">วันนี้</span>
      <span className="font-display text-4xl font-bold tabular-nums leading-tight text-foreground">{formatSatang(day.totalSatang)}</span>
      <span className="text-sm tabular-nums text-foreground-muted">
        เว็บ {formatSatang(day.webSatang)} · LINE {formatSatang(day.lineSatang)}
      </span>
    </section>
  );
}

function Week({ days }: { days: DaySales[] }) {
  return (
    <section aria-label="ยอด 7 วันล่าสุด" className="flex items-center justify-between gap-3 border-t border-surface-border-soft pt-3">
      <span className="text-sm text-foreground-muted">7 วันล่าสุด</span>
      <span className="flex flex-col items-end">
        <span className="font-semibold tabular-nums text-foreground">{formatSatang(sum(days, (d) => d.totalSatang))}</span>
        <span className="text-xs tabular-nums text-foreground-muted">
          เว็บ {formatSatang(sum(days, (d) => d.webSatang))} · LINE {formatSatang(sum(days, (d) => d.lineSatang))}
        </span>
      </span>
    </section>
  );
}

function Rows({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-xs text-foreground-dim">{title}</h3>
      <ul className="flex flex-col text-sm text-foreground-muted">{children}</ul>
    </div>
  );
}

function SlipRow({ slip }: { slip: SalesSlip }) {
  return (
    <li className="flex items-baseline justify-between gap-3 py-1">
      <span className="min-w-0 truncate tabular-nums">
        {timeOf(slip.transferredAt)} น. <span className="text-xs text-foreground-dim">อ้างอิง …{slip.transRef.slice(-6)}</span>
      </span>
      <span className="flex shrink-0 flex-col items-end tabular-nums text-foreground">
        {formatSatang(slip.amountSatang + (slip.refundedSatang ?? 0))}
        {slip.refundedSatang ? <span className="text-xs text-unverified">คืนแล้ว {formatSatang(slip.refundedSatang)}</span> : null}
      </span>
    </li>
  );
}

function DayRow({ day, today }: { day: DaySales; today: boolean }) {
  const empty = day.orders.length + day.slips.length + day.unclear.length + day.heldAsWeb.length === 0;
  const name = `${dayLabel(day.date)}${today ? " · วันนี้" : ""}`;
  if (empty) {
    return (
      <li className="flex min-h-12 items-center justify-between gap-3 px-4 text-sm text-foreground-dim">
        <span>{name}</span>
        <span>ไม่มียอด</span>
      </li>
    );
  }
  return (
    <li>
      <details className="group">
        <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
          <span className="flex min-w-0 flex-col">
            <span className="text-sm font-semibold text-foreground">{name}</span>
            {day.unclear.length > 0 && <span className="text-xs text-unverified">ไม่แน่ใจ {day.unclear.length} ใบ</span>}
            {refundedOf(day) > 0 && <span className="text-xs text-foreground-muted">หักคืนเงิน LINE {formatSatang(refundedOf(day))}</span>}
          </span>
          <span className="flex shrink-0 items-center gap-2">
            <span className="flex flex-col items-end">
              <span className="font-semibold tabular-nums text-foreground">{formatSatang(day.totalSatang)}</span>
              <span className="text-xs tabular-nums text-foreground-muted">
                เว็บ {formatSatang(day.webSatang)} · LINE {formatSatang(day.lineSatang)}
              </span>
            </span>
            <span aria-hidden className="text-foreground-dim transition-transform group-open:rotate-90">
              ›
            </span>
          </span>
        </summary>
        <div className="flex flex-col gap-3 border-t border-surface-border-soft px-4 py-3">
          {day.orders.length > 0 && (
            <Rows title={`ออเดอร์เว็บ ${day.orders.length} รายการ`}>
              {day.orders.map((o) => (
                <li key={o.orderNumber}>
                  <Link href={`/staff/orders/${encodeURIComponent(o.orderNumber)}`} className="flex min-h-9 items-baseline justify-between gap-3 py-1 hover:text-foreground">
                    <span className="min-w-0 truncate tabular-nums">
                      {timeOf(o.createdAt)} น. {formatRunNumber(o.runNumber) ?? o.orderNumber}
                    </span>
                    <span className="shrink-0 tabular-nums text-foreground">{formatSatang(o.total * 100)}</span>
                  </Link>
                </li>
              ))}
            </Rows>
          )}
          {day.slips.length > 0 && (
            <Rows title={`สลิป LINE ${day.slips.length} ใบ`}>
              {day.slips.map((s) => (
                <SlipRow key={s.transRef} slip={s} />
              ))}
            </Rows>
          )}
          {day.unclear.length > 0 && (
            <Rows title={`ยังไม่นับ · ไม่แน่ใจว่าเข้าบัญชีร้าน ${day.unclear.length} ใบ`}>
              {day.unclear.map((s) => (
                <SlipRow key={s.transRef} slip={s} />
              ))}
            </Rows>
          )}
          {day.heldAsWeb.length > 0 && (
            <Rows title={`ไม่นับเป็น LINE · ยอดตรงกับออเดอร์เว็บที่ไม่มีสลิปในระบบ ${day.heldAsWeb.length} ใบ`}>
              {day.heldAsWeb.map((s) => (
                <SlipRow key={s.transRef} slip={s} />
              ))}
            </Rows>
          )}
        </div>
      </details>
    </li>
  );
}

export default async function StaffSalesPage() {
  if (!staffAreaEnabled()) notFound();
  if (!(await isStaff())) redirect("/staff");
  const days = salesDays();
  const waitingSlips = countByJob().slip;
  const unclear = days.flatMap((d) => d.unclear);
  const unclearSatang = unclear.reduce((n, s) => n + s.amountSatang, 0);

  return (
    <Container className="flex max-w-2xl flex-col gap-5 pb-8 pt-4 lg:gap-6 lg:pt-8">
      <StaffBar tab="sales" />
      <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">ยอดขาย</h1>

      <Today day={days[0]} />
      <Week days={days.slice(0, 7)} />

      {(waitingSlips > 0 || unclear.length > 0) && (
        <div className="flex flex-col gap-1 text-sm">
          {waitingSlips > 0 && (
            <Link href="/staff/orders?f=slip" className="inline-flex min-h-11 w-fit items-center text-unverified hover:underline">
              ออเดอร์เว็บรอตรวจสลิป {waitingSlips} รายการ ยังไม่นับในยอด →
            </Link>
          )}
          {unclear.length > 0 && (
            <p className="text-unverified">
              ใน {SALES_DAYS} วัน มีสลิปที่ไม่แน่ใจว่าเข้าบัญชีร้าน {unclear.length} ใบ {formatSatang(unclearSatang)} ยังไม่นับในยอด
            </p>
          )}
        </div>
      )}

      <section aria-label={`ยอดรายวัน ${SALES_DAYS} วัน`} className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-foreground">รายวัน</h2>
        <ul className={LIST_CLASS}>
          {days.map((day, i) => (
            <DayRow key={day.date} day={day} today={i === 0} />
          ))}
        </ul>
      </section>

      <p className="text-sm leading-relaxed text-foreground-muted">
        ยอดเว็บ = ออเดอร์ที่ยืนยันยอดเงินแล้ว นับตามวันที่สั่ง ไม่รวมออเดอร์ที่ยกเลิก · ยอด LINE = สลิปที่เข้าบัญชีร้าน นับตามวันที่โอน
        ไม่รวมสลิปของออเดอร์เว็บ
      </p>
      {ownerAreaEnabled() && (
        <Link href="/staff/owner" className="inline-flex min-h-11 w-fit items-center text-sm text-foreground-dim hover:text-foreground">
          ส่วนเจ้าของ →
        </Link>
      )}
    </Container>
  );
}
