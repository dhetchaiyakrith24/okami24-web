import Link from "next/link";
import { shortBaht, shortDate, type GoogleWeek, type SalesSum } from "@/lib/owner/dashboard-rules";
import type { StoredRound } from "@/lib/owner/bills";
import type { TopProduct } from "@/lib/owner/dashboard";
import { Bars, type BarSlot } from "@/components/dashboard/Bars";
import { Ring } from "@/components/dashboard/Ring";
import { formatCount, formatSatang } from "@/app/staff/_components/format";

/** The weekly view: the checked round, what the warehouse is owed, and how the week went. Rounds run Saturday 13:00 to Saturday 13:00. */

const baht = (n: number) => formatSatang(Math.round(n * 100));
const ddmm = (at: string) => `${at.slice(8, 10)}/${at.slice(5, 7)}`;
const span = (from: string, to: string) => `${ddmm(from)} ถึง ${ddmm(to)}`;

function RoundHero({ rounds, due }: { rounds: StoredRound[]; due: { from: string; to: string } }) {
  const round = rounds[0];
  if (!round || round.to < due.to) {
    return (
      <section aria-label="รอบล่าสุด" className="dash-card dash-card-open dash-rise">
        <span className="text-sm text-foreground-muted">รอบ {span(due.from, due.to)}</span>
        <span className="text-xl font-semibold text-foreground">รอบนี้ยังไม่ได้เทียบบิล</span>
        <span className="text-sm text-foreground-muted">กำไรขึ้นหลังวางไฟล์บิล</span>
        <Link href="/staff/owner/bill#new" className="inline-flex min-h-11 w-fit items-center rounded-full bg-ember px-5 text-sm font-semibold text-surface-1 hover:opacity-90">
          วางไฟล์บิล
        </Link>
        {round && (
          <Link href={`/staff/owner/bill?round=${round.id}`} className="text-sm text-foreground-muted hover:text-foreground">
            รอบก่อน {span(round.from, round.to)} กำไร {baht(round.week.totalProfit)} ›
          </Link>
        )}
      </section>
    );
  }
  const { week } = round;
  const before = rounds[1];
  const change = before ? week.totalProfit - before.week.totalProfit : null;
  const loss = week.totalProfit < 0;
  const noSlips = week.lineSales === 0 && round.totals.lineBill > 0;
  return (
    <section aria-label="กำไรรอบล่าสุด" className="dash-rise relative isolate flex flex-col gap-1 px-1 pt-1">
      <span aria-hidden className="dash-glow" />
      <span className="text-sm text-foreground-muted">กำไรรอบ {span(round.from, round.to)}</span>
      <span className={`font-display text-6xl font-bold tabular-nums leading-none ${loss ? "text-danger" : "text-foreground"}`}>{baht(week.totalProfit)}</span>
      {loss && <span className="font-semibold text-danger">ขาดทุน</span>}
      <span className="text-sm tabular-nums text-foreground-muted">
        เว็บ {baht(week.webProfit)} · LINE {baht(week.lineProfit)}
      </span>
      {change !== null && before && (
        <span className={`text-sm tabular-nums ${change > 0 ? "text-verified" : "text-foreground-muted"}`}>
          {change > 0 ? "+" : change < 0 ? "-" : ""}
          {baht(Math.abs(change))} จากรอบก่อน ({baht(before.week.totalProfit)})
        </span>
      )}
      {noSlips && <span className="text-sm text-unverified">ไม่มียอดสลิปในรอบนี้ กำไร LINE ยังเชื่อไม่ได้</span>}
    </section>
  );
}

/** The rounds that exist, oldest first, and the round now due as an outline. Six columns at most, so each is a thumb wide. */
function RoundBars({ rounds, due }: { rounds: StoredRound[]; due: boolean }) {
  const kept = [...rounds].reverse().slice(due ? -5 : -6);
  if (kept.length === 0) return null;
  const bars: BarSlot[] = kept.map((r, i) => ({
    value: r.week.totalProfit,
    label: ddmm(r.to),
    showLabel: i === 0 || i === kept.length - 1 || r.week.totalProfit < 0,
    mark: r.week.totalProfit < 0 ? shortBaht(r.week.totalProfit) : undefined,
    title: `รอบ ${span(r.from, r.to)} กำไร ${baht(r.week.totalProfit)}`,
    href: `/staff/owner/bill?round=${r.id}`,
  }));
  if (due) bars.push({ pending: "รอบิล" });
  return (
    <section aria-label="กำไรแต่ละรอบ" className="dash-card dash-rise">
      <h2 className="font-semibold text-foreground">กำไรแต่ละรอบ</h2>
      <Bars bars={bars} />
    </section>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <li className="flex min-h-10 items-center justify-between gap-3 text-sm">
      <span className="text-foreground-muted">{label}</span>
      <span className={`tabular-nums ${tone ?? "text-foreground"}`}>{value}</span>
    </li>
  );
}

function WarehouseBill({ round, older }: { round: StoredRound | undefined; older: boolean }) {
  return (
    <section aria-label="ยอดชำระคลัง" className="dash-card dash-rise">
      <h2 className="font-semibold text-foreground">ยอดชำระคลัง{round && older ? " · รอบก่อน" : ""}</h2>
      {!round ? (
        <p className="text-sm text-foreground-muted">ยังไม่มีข้อมูล รู้ยอดหลังวางไฟล์บิล</p>
      ) : (
        <>
          <div className="flex flex-col">
            <span className="text-sm text-foreground-muted">รอบ {span(round.from, round.to)}</span>
            <span className="font-display text-4xl font-bold tabular-nums leading-tight text-foreground">{baht(round.totals.billTotal)}</span>
          </div>
          <ul className="dash-rows flex flex-col">
            <Row label="เว็บ" value={baht(round.totals.webBill)} />
            <Row label="LINE" value={baht(round.totals.lineBill)} />
            {round.totals.webShipOver !== 0 && <Row label="ค่าส่งเว็บเกิน 35" value={baht(round.totals.webShipOver)} tone="text-unverified" />}
            <Row label="จุดที่ไม่ตรง" value={round.diffs.length === 0 ? "ไม่มี" : `${round.diffs.length} จุด`} tone={round.diffs.length === 0 ? "text-verified" : "text-unverified"} />
            <Row label="จ่ายแล้วหรือยัง" value="ยังไม่มีข้อมูล" tone="text-foreground-muted" />
          </ul>
          <Link href={`/staff/owner/bill?round=${round.id}`} className="inline-flex min-h-11 w-fit items-center text-sm text-ember-strong hover:underline">
            ดูรอบนี้ทั้งหมด ›
          </Link>
        </>
      )}
    </section>
  );
}

function Week({ week }: { week: SalesSum }) {
  return (
    <section aria-label="ยอดขาย 7 วันล่าสุด" className="dash-card dash-rise">
      <h2 className="font-semibold text-foreground">ยอดขาย 7 วันล่าสุด</h2>
      <div className="flex items-center gap-4">
        {week.webPercent !== null && <Ring percent={week.webPercent} label={`เว็บ ${week.webPercent}% ของยอดขาย`} />}
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="font-display text-3xl font-bold tabular-nums leading-tight text-foreground">{formatSatang(week.totalSatang)}</span>
          <span className="text-sm tabular-nums text-foreground-muted">
            <span className="text-ember-strong">เว็บ</span> {formatSatang(week.webSatang)}
          </span>
          <span className="text-sm tabular-nums text-foreground-muted">LINE {formatSatang(week.lineSatang)}</span>
        </div>
      </div>
    </section>
  );
}

function Channels({ clicks, carts, top }: { clicks: number | null; carts: number; top: TopProduct[] }) {
  return (
    <section aria-label="LINE และตะกร้า" className="dash-card dash-rise">
      <h2 className="font-semibold text-foreground">LINE และตะกร้า 7 วัน</h2>
      <ul className="dash-rows flex flex-col">
        <Row label="คนกดปุ่ม LINE" value={clicks === null ? "ยังไม่มีข้อมูล" : formatCount(clicks)} />
        <Row label="ใส่ตะกร้าแล้วยังไม่สั่ง" value={formatCount(carts)} />
      </ul>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm text-foreground-muted">ขายดีบนเว็บ</h3>
        {top.length === 0 ? (
          <p className="text-sm text-foreground-muted">ยังไม่มีข้อมูล</p>
        ) : (
          <ul className="dash-rows flex flex-col">
            {top.map((p) => (
              <li key={p.name} className="flex min-h-10 items-center justify-between gap-3 text-sm">
                <span className="min-w-0 text-foreground">{p.name}</span>
                <span className="shrink-0 tabular-nums text-foreground-muted">{p.pieces} ชิ้น</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function Google({ weeks, through }: { weeks: GoogleWeek[]; through: string | null }) {
  const now = weeks.at(-1);
  const before = weeks.at(-2);
  return (
    <section aria-label="Google รายสัปดาห์" className="dash-card dash-rise">
      <h2 className="font-semibold text-foreground">Google รายสัปดาห์</h2>
      {!now || !through ? (
        <p className="text-sm text-foreground-muted">ยังไม่มีข้อมูล</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col">
              <span className="text-sm text-foreground-muted">คนกดเข้าเว็บ</span>
              <span className="font-display text-3xl font-bold tabular-nums leading-tight text-foreground">{now.clicks}</span>
              {before && <span className="text-sm tabular-nums text-foreground-muted">สัปดาห์ก่อน {before.clicks}</span>}
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-foreground-muted">เว็บขึ้นให้คนเห็น</span>
              <span className="font-display text-3xl font-bold tabular-nums leading-tight text-foreground">{formatCount(now.impressions)}</span>
              {before && <span className="text-sm tabular-nums text-foreground-muted">สัปดาห์ก่อน {formatCount(before.impressions)}</span>}
            </div>
          </div>
          <Bars
            height="h-16"
            bars={weeks.slice(-8).map((w, i, all) => ({ value: w.clicks, label: shortDate(w.to), showLabel: i === 0 || i === all.length - 1, title: `สัปดาห์ถึง ${shortDate(w.to)} คนกดเข้าเว็บ ${w.clicks}` }))}
          />
          <p className="text-sm text-foreground-muted">คนกดเข้าเว็บต่อสัปดาห์ · อันดับเฉลี่ย {now.position} · ข้อมูลถึง {shortDate(through)}</p>
        </>
      )}
    </section>
  );
}

export function WeekPanel(props: {
  rounds: StoredRound[];
  due: { from: string; to: string };
  week: SalesSum;
  clicks: number | null;
  carts: number;
  top: TopProduct[];
  google: { through: string | null; weeks: GoogleWeek[] };
}) {
  const { rounds, due, week, clicks, carts, top, google } = props;
  const billDue = !rounds[0] || rounds[0].to < due.to;
  return (
    <>
      <RoundHero rounds={rounds} due={due} />
      <RoundBars rounds={rounds} due={billDue} />
      <WarehouseBill round={rounds[0]} older={billDue} />
      <Week week={week} />
      <Channels clicks={clicks} carts={carts} top={top} />
      <Google weeks={google.weeks} through={google.through} />
    </>
  );
}
