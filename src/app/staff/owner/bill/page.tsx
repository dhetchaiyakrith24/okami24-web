import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { requireOwner } from "@/lib/owner/auth";
import { lastRound } from "@/lib/owner/bill-rules";
import { listRounds, type StoredRound } from "@/lib/owner/bills";
import { formatSatang } from "@/app/staff/_components/format";
import { LIST_CLASS } from "@/app/staff/_components/OrderRow";
import { BillUpload } from "@/app/staff/owner/bill/BillUpload";

/**
 * /staff/owner/bill — the warehouse bill against our orders (back-office round 07/11, batch 5): the two files in, the places that
 * differ and the week's profit out, web + LINE. Rules = src/lib/owner/bill-rules.ts.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "เทียบบิลคลัง",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const baht = (n: number) => formatSatang(Math.round(n * 100));
const roundName = (r: StoredRound) => `${r.from.slice(8, 10)}/${r.from.slice(5, 7)} ถึง ${r.to.slice(8, 10)}/${r.to.slice(5, 7)}`;

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <li className="flex items-baseline justify-between gap-3 px-4 py-2.5 text-sm">
      <span className="text-foreground-muted">{label}</span>
      <span className={`tabular-nums ${strong ? "font-semibold text-foreground" : "text-foreground"}`}>{value}</span>
    </li>
  );
}

function Round({ round }: { round: StoredRound }) {
  const { totals: t, week, diffs } = round;
  const kinds = [...new Set(diffs.map((d) => d.kind))];
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-foreground">รอบ {roundName(round)}</h2>
      <div className="flex flex-col gap-1">
        <span className="text-sm text-foreground-muted">กำไรรวม</span>
        <span className="font-display text-4xl font-bold tabular-nums leading-tight text-foreground">{baht(week.totalProfit)}</span>
        <span className="text-sm tabular-nums text-foreground-muted">
          เว็บ {baht(week.webProfit)} · LINE {baht(week.lineProfit)}
        </span>
      </div>
      <ul className={LIST_CLASS}>
        <Row label={`เว็บ ลูกค้าจ่าย · ${t.webBilled} จาก ${t.webOrders} ออเดอร์อยู่ในบิล`} value={baht(t.webPaidBilled)} />
        <Row label="เว็บ คลังเก็บ" value={baht(t.webBill)} />
        <Row label="LINE ยอดสลิปในรอบ" value={baht(week.lineSales)} />
        <Row label={`LINE คลังเก็บ · ${t.lineOrders} ใบ`} value={baht(t.lineBill)} />
        {t.webShipOver !== 0 && <Row label="ค่าส่งเว็บเกิน 35" value={baht(t.webShipOver)} />}
        <Row label="ทั้งบิล" value={baht(t.billTotal)} strong />
      </ul>
      <p className="text-sm leading-relaxed text-foreground-muted">
        กำไร LINE คิดจากสลิปในรอบหักบิลในรอบ ถ้าลูกค้าโอนก่อนรอบปิดแต่คลังคีย์หลังรอบปิด ตัวเลขจะขยับข้ามสัปดาห์ และคืนเงินทาง LINE ระบบไม่เห็น
      </p>
      {round.orders.length > 0 && (
        <details className="group">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm text-foreground-muted hover:text-foreground [&::-webkit-details-marker]:hidden">
            <span>ออเดอร์เว็บในรอบ {round.orders.length} รายการ</span>
            <span aria-hidden className="transition-transform group-open:rotate-90">
              ›
            </span>
          </summary>
          <ul className={LIST_CLASS}>
            {round.orders.map((o) => (
              <li key={o.run} className="flex items-baseline justify-between gap-3 px-4 py-2 text-sm tabular-nums">
                <span className="min-w-0 truncate text-foreground">
                  {o.run} <span className="text-foreground-dim">{o.no ?? "ไม่อยู่ในบิล"}</span>
                </span>
                <span className="shrink-0 text-foreground-muted">
                  จ่าย {baht(o.paid)}
                  {o.billed !== null && ` · บิล ${baht(o.billed)}`}
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}
      {diffs.length === 0 ? (
        <p className="text-sm text-verified">ไม่มีจุดไม่ตรง</p>
      ) : (
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-unverified">จุดไม่ตรง {diffs.length} จุด</h3>
          <ul className={LIST_CLASS}>
            {kinds.map((kind) => {
              const rows = diffs.filter((d) => d.kind === kind);
              return (
                <li key={kind}>
                  <details className="group">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-2 text-sm text-foreground hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
                      <span>{kind}</span>
                      <span className="tabular-nums text-foreground-muted">{rows.length}</span>
                    </summary>
                    <ul className="flex flex-col gap-1 border-t border-surface-border-soft px-4 py-3 text-sm text-foreground-muted">
                      {rows.map((d, i) => (
                        <li key={i}>
                          <span className="tabular-nums text-foreground">{d.where}</span> {d.detail}
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}

export default async function OwnerBillPage({ searchParams }: { searchParams: Promise<{ round?: string }> }) {
  await requireOwner();
  const { round } = await searchParams;
  const rounds = listRounds();
  const shown = rounds.find((r) => String(r.id) === round) ?? rounds[0];
  const next = lastRound();

  return (
    <Container className="flex max-w-2xl flex-col gap-5 pb-8 pt-4 lg:gap-6 lg:pt-8">
      <Link href="/staff/owner" className="-ml-2 inline-flex min-h-11 w-fit items-center gap-1.5 rounded-full px-2 text-sm font-semibold text-foreground hover:bg-surface-2">
        <span aria-hidden>←</span> ส่วนเจ้าของ
      </Link>
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">เทียบบิลคลัง</h1>
        <p className="text-sm text-foreground-muted">รอบเสาร์ 13:00 ถึงเสาร์ 13:00 · เทียบรอบเดิมซ้ำจะแทนผลเก่า</p>
      </div>
      {shown && <Round round={shown} />}
      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-foreground">เทียบรอบใหม่</h2>
        <BillUpload from={next.from} to={next.to} />
      </section>
      {rounds.length > 1 && (
        <nav aria-label="รอบก่อน" className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground-muted">
          {rounds.map((r) => (
            <Link key={r.id} href={`/staff/owner/bill?round=${r.id}`} className="inline-flex min-h-11 items-center hover:text-foreground">
              {roundName(r)}
            </Link>
          ))}
        </nav>
      )}
    </Container>
  );
}
