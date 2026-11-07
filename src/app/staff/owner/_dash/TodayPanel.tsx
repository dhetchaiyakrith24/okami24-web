import Link from "next/link";
import { formatRunNumber } from "@/lib/commerce/run-number";
import type { DayProfit } from "@/lib/owner/cost-rules";
import { ageText, type SameHour, type StockSummary } from "@/lib/owner/dashboard-rules";
import type { DaySales, SalesSlip } from "@/lib/staff/daily-sales-rules";
import { STAFF_JOBS, TODO_JOBS, type StaffJob } from "@/lib/staff/jobs";
import { ScrubHero } from "@/components/dashboard/ScrubHero";
import { formatSatang, formatShortDateTime } from "@/app/staff/_components/format";
import { FEED_LIGHT } from "@/app/staff/_components/feed-light";
import type { FeedHealth } from "@/lib/woo/watch-rules";

/** The daily view: is today all right, and what is waiting. Sales and web profit stay apart, per the head of dashboard-rules.ts. */

const DAY_LABEL = new Intl.DateTimeFormat("th-TH", { timeZone: "Asia/Bangkok", weekday: "short", day: "numeric", month: "short" });
const TIME = new Intl.DateTimeFormat("th-TH", { timeZone: "Asia/Bangkok", hour: "2-digit", minute: "2-digit" });
export const dayLabel = (date: string) => DAY_LABEL.format(new Date(`${date}T12:00:00+07:00`));
const timeOf = (iso: string) => TIME.format(new Date(iso));

const split = (d: DaySales) => `เว็บ ${formatSatang(d.webSatang)} · LINE ${formatSatang(d.lineSatang)}`;

function compareNote(hour: SameHour | null) {
  if (!hour || hour.percent === null || hour.percent === 0) return undefined;
  const word = hour.percent > 0 ? "มากกว่า" : "น้อยกว่า";
  return { text: `${word}อาทิตย์ก่อน เวลาเดียวกัน ${Math.abs(hour.percent)}% (อาทิตย์ก่อน ${formatSatang(hour.thenSatang)})`, good: hour.percent > 0 };
}

/** For the day list: "—" when no order of the day has a cost yet. */
function profitText(day: DayProfit | undefined): string {
  if (!day || day.orders.length === 0) return "ไม่มีออเดอร์";
  return day.unpriced === day.orders.length ? "—" : formatSatang(day.profitSatang);
}

/** Today's web profit. No order = says so; orders without a cost = what to do about it, never a made-up zero. */
function ProfitTile({ profit }: { profit: DayProfit | undefined }) {
  const orders = profit?.orders.length ?? 0;
  const unpriced = profit?.unpriced ?? 0;
  const value =
    orders === 0 ? (
      <span className="py-1 text-xl text-foreground-muted">ไม่มีออเดอร์</span>
    ) : unpriced === orders ? (
      <span className="py-1 text-xl text-foreground-muted">รอทุน</span>
    ) : (
      <span className="font-display text-3xl font-bold tabular-nums leading-tight text-foreground">{formatSatang(profit?.profitSatang ?? 0)}</span>
    );
  return (
    <div className="dash-card gap-1!">
      <span className="text-sm text-foreground-muted">กำไรเว็บวันนี้</span>
      {value}
      {unpriced > 0 ? (
        <Link href="/staff/owner/costs" className="inline-flex min-h-11 items-center text-sm text-unverified hover:underline">
          ใส่ทุน {unpriced} ออเดอร์ ›
        </Link>
      ) : (
        <span className="text-sm text-foreground-muted">LINE สรุปรายสัปดาห์</span>
      )}
    </div>
  );
}

function Tiles({ today, profit, avgSatang }: { today: DaySales; profit: DayProfit | undefined; avgSatang: number | null }) {
  return (
    <div className="dash-rise grid grid-cols-2 gap-3">
      <ProfitTile profit={profit} />
      <div className="dash-card gap-1!">
        <span className="text-sm text-foreground-muted">ออเดอร์เว็บวันนี้</span>
        <span className="font-display text-3xl font-bold tabular-nums leading-tight text-foreground">{today.orders.length}</span>
        <span className="text-sm text-foreground-muted">{avgSatang === null ? "ยังไม่มีข้อมูล" : `เฉลี่ย 7 วัน ${formatSatang(avgSatang)}`}</span>
      </div>
    </div>
  );
}

function Jobs({ counts, oldest, now, canOpen }: { counts: Record<StaffJob, number>; oldest: Partial<Record<StaffJob, string | null>>; now: number; canOpen: boolean }) {
  const waiting = TODO_JOBS.reduce((n, j) => n + counts[j], 0);
  return (
    <section aria-label="งานค้าง" className="dash-card dash-rise">
      <h2 className="font-semibold text-foreground">งานค้างตอนนี้</h2>
      {waiting === 0 ? (
        <p className="text-sm text-verified">ไม่มีงานค้าง</p>
      ) : (
        <ul className="dash-rows flex flex-col">
          {TODO_JOBS.map((job) => {
            const at = oldest[job];
            const body = (
              <>
                <span className="flex flex-col">
                  <span className="text-foreground">{STAFF_JOBS[job].label}</span>
                  {at && <span className="text-sm text-foreground-muted">เก่าสุดสั่งเมื่อ {ageText(at, now)}ก่อน</span>}
                </span>
                <span className={`font-display text-3xl font-bold tabular-nums ${counts[job] > 0 ? "text-foreground" : "text-foreground-muted"}`}>{counts[job]}</span>
              </>
            );
            return (
              <li key={job}>
                {canOpen ? (
                  <Link href={`/staff/orders?f=${job}`} className="flex min-h-14 items-center justify-between gap-3 py-1 hover:text-ember-strong">
                    {body}
                  </Link>
                ) : (
                  <div className="flex min-h-14 items-center justify-between gap-3 py-1">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function Stock({ stock, feed }: { stock: StockSummary; feed: FeedHealth }) {
  const light = FEED_LIGHT[feed.state];
  return (
    <section aria-label="สต็อก" className="dash-card dash-rise">
      <h2 className="font-semibold text-foreground">สต็อก</h2>
      <p className={`inline-flex items-center gap-1.5 text-sm ${light.text}`}>
        <span aria-hidden className={`size-2 shrink-0 rounded-full ${light.dot}`} />
        คลังส่งตัวเลขล่าสุด {feed.lastPushAt ? formatShortDateTime(feed.lastPushAt) : "ยังไม่เคย"} · {light.long}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col">
          <span className="text-sm text-foreground-muted">ใกล้หมด เหลือไม่เกิน 3</span>
          <span className="font-display text-3xl font-bold tabular-nums text-unverified">{stock.low}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-foreground-muted">หมด ที่ขายใน 30 วัน</span>
          <span className="font-display text-3xl font-bold tabular-nums text-foreground">{stock.out}</span>
        </div>
      </div>
      {stock.urgent.length > 0 && (
        <details className="group">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm text-foreground-muted hover:text-foreground [&::-webkit-details-marker]:hidden">
            <span>ตัวที่ควรดูก่อน ขายดีขึ้นก่อน</span>
            <span aria-hidden className="transition-transform group-open:rotate-90">
              ›
            </span>
          </summary>
          <ul className="dash-rows flex flex-col">
            {stock.urgent.map((row) => (
              <li key={row.name} className="flex items-baseline justify-between gap-3 py-2 text-sm">
                <span className="min-w-0 text-foreground">{row.name}</span>
                <span className={`shrink-0 tabular-nums ${row.out ? (row.best ? "text-danger" : "text-foreground-muted") : "text-unverified"}`}>{row.out ? (row.best ? "ขายดี หมด" : "หมด") : `เหลือ ${row.qty}`}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}

function SlipRows({ title, slips }: { title: string; slips: SalesSlip[] }) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-sm text-foreground-muted">{title}</h3>
      <ul className="flex flex-col text-sm text-foreground-muted">
        {slips.map((s) => (
          <li key={s.transRef} className="flex items-baseline justify-between gap-3 py-1">
            <span className="min-w-0 truncate tabular-nums">{timeOf(s.transferredAt)} น.</span>
            <span className="shrink-0 tabular-nums text-foreground">{formatSatang(s.amountSatang)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DayRow({ day, profit }: { day: DaySales; profit: DayProfit | undefined }) {
  const empty = day.orders.length + day.slips.length + day.unclear.length + day.heldAsWeb.length === 0;
  if (empty) {
    return (
      <li className="flex min-h-12 items-center justify-between gap-3 text-sm text-foreground-muted">
        <span>{dayLabel(day.date)}</span>
        <span>ไม่มียอด</span>
      </li>
    );
  }
  const unpriced = profit?.unpriced ?? 0;
  return (
    <li>
      <details className="group">
        <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-3 py-2 hover:bg-white/5 [&::-webkit-details-marker]:hidden">
          <span className="flex min-w-0 flex-col">
            <span className="text-sm font-semibold text-foreground">{dayLabel(day.date)}</span>
            <span className="text-sm tabular-nums text-foreground-muted">{split(day)}</span>
            {unpriced > 0 && <span className="text-sm text-unverified">ไม่มีทุน {unpriced} ออเดอร์</span>}
            {day.unclear.length > 0 && <span className="text-sm text-unverified">สลิปไม่แน่ใจ {day.unclear.length} ใบ</span>}
          </span>
          <span className="flex shrink-0 items-center gap-2">
            <span className="flex flex-col items-end">
              <span className="font-display text-2xl font-bold tabular-nums leading-tight text-foreground">{formatSatang(day.totalSatang)}</span>
              <span className="text-sm tabular-nums text-foreground-muted">กำไรเว็บ {profitText(profit)}</span>
            </span>
            <span aria-hidden className="text-foreground-muted transition-transform group-open:rotate-90">
              ›
            </span>
          </span>
        </summary>
        <div className="flex flex-col gap-3 pb-3 pt-1">
          {profit && profit.orders.length > 0 && (
            <div className="flex flex-col gap-1">
              <h3 className="text-sm text-foreground-muted">ออเดอร์เว็บ {profit.orders.length} รายการ · ยอดขาย แล้วกำไร</h3>
              <ul className="flex flex-col text-sm text-foreground-muted">
                {profit.orders.map((o) => (
                  <li key={o.orderNumber} className="flex items-baseline justify-between gap-3 py-1">
                    <span className="min-w-0 truncate tabular-nums">
                      {formatRunNumber(o.runNumber) ?? o.orderNumber} · {formatSatang(o.total * 100)}
                    </span>
                    {o.profitSatang === null ? (
                      <span className="shrink-0 text-unverified">ไม่มีทุน {o.missing.filter(Boolean).join(" ")}</span>
                    ) : (
                      <span className="shrink-0 tabular-nums text-foreground">{formatSatang(o.profitSatang)}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {day.slips.length > 0 && <SlipRows title={`สลิป LINE ${day.slips.length} ใบ`} slips={day.slips} />}
          {day.unclear.length > 0 && <SlipRows title={`ยังไม่นับ · ไม่แน่ใจว่าเข้าบัญชีร้าน ${day.unclear.length} ใบ`} slips={day.unclear} />}
          {day.heldAsWeb.length > 0 && <SlipRows title={`ไม่นับเป็น LINE · ยอดตรงกับออเดอร์เว็บที่ไม่มีสลิปในระบบ ${day.heldAsWeb.length} ใบ`} slips={day.heldAsWeb} />}
        </div>
      </details>
    </li>
  );
}

export function TodayPanel(props: {
  days: DaySales[];
  profit: DayProfit[];
  hour: SameHour | null;
  avgSatang: number | null;
  counts: Record<StaffJob, number>;
  oldest: Partial<Record<StaffJob, string | null>>;
  canOpenOrders: boolean;
  stock: StockSummary;
  feed: FeedHealth;
  now: number;
}) {
  const { days, profit, hour, avgSatang, counts, oldest, canOpenOrders, stock, feed, now } = props;
  const today = days[0];
  const byDate = new Map(profit.map((p) => [p.date, p]));
  const points = [...days.slice(0, 14)].reverse().map((d, i, all) => ({
    value: d.totalSatang,
    label: i === all.length - 1 ? "ยอดขายวันนี้" : `ยอดขาย ${dayLabel(d.date)}`,
    headline: formatSatang(d.totalSatang),
    sub: split(d),
  }));
  return (
    <>
      <div className="dash-rise">
        <ScrubHero points={points} note={compareNote(hour)} axis={{ start: dayLabel(days[Math.min(13, days.length - 1)].date), end: "วันนี้", hint: "ลากดูวันอื่น" }} />
      </div>
      <Tiles today={today} profit={byDate.get(today.date)} avgSatang={avgSatang} />
      <Jobs counts={counts} oldest={oldest} now={now} canOpen={canOpenOrders} />
      <Stock stock={stock} feed={feed} />
      <section aria-label="ยอดรายวัน" className="dash-card dash-rise">
        <h2 className="font-semibold text-foreground">รายวัน</h2>
        <ul className="dash-rows flex flex-col">
          {days.slice(0, 14).map((d) => (
            <DayRow key={d.date} day={d} profit={byDate.get(d.date)} />
          ))}
        </ul>
      </section>
    </>
  );
}
