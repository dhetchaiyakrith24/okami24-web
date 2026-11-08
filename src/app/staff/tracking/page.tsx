import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { CARRIERS } from "@/lib/commerce/carriers";
import { formatRunNumber } from "@/lib/commerce/run-number";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { parcelsNow } from "@/lib/staff/customer-cards";
import { KEEP_DONE_DAYS, LATE_DAYS, type ParcelRow } from "@/lib/staff/tracking-check-rules";
import { STAFF_STATUS_LABEL, statusTone, TONE_CLASS } from "@/lib/staff/jobs";
import { StaffBar } from "@/app/staff/_components/StaffBar";
import { CopyNumber } from "./CopyNumber";

/**
 * /staff/tracking — "เช็คพัสดุ" (owner list ก11: a page to check EMS / DHL parcels). Every shipped parcel with its number,
 * the ones waiting long on top in red (rules = tracking-check-rules.ts), each with a copy button and the carrier's own
 * tracking page. Reads the numbers already stored; it does not ask the carriers. Staff only, noindex.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "เช็คพัสดุ",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

function Parcel({ p }: { p: ParcelRow }) {
  const run = formatRunNumber(p.runNumber);
  const carrier = p.carrier ? CARRIERS[p.carrier] : null;
  return (
    <li className={`flex flex-col gap-2 rounded-xl border bg-surface-1 p-4 ${p.late ? "border-danger/50" : "border-surface-border-soft"}`}>
      <div className="flex items-baseline justify-between gap-3">
        <Link href={`/staff/orders/${encodeURIComponent(p.orderNumber)}`} className="min-w-0 truncate font-semibold tabular-nums text-foreground hover:underline">
          {run ?? p.orderNumber}
          <span className="ml-2 text-sm font-normal text-foreground-muted">
            {p.recipientName} · {p.province}
          </span>
        </Link>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs ${p.late ? TONE_CLASS.no.pill : TONE_CLASS[statusTone(p.status)].pill}`}>
          {p.late ? `ส่งมา ${p.days} วัน ยังไม่ถึง` : STAFF_STATUS_LABEL[p.status]}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <CopyNumber number={p.trackingNumber} />
        {carrier ? (
          <a
            href={carrier.trackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center text-sm font-semibold text-ember underline underline-offset-4"
          >
            เปิดหน้า {carrier.name.th} ↗
          </a>
        ) : (
          <span className="text-sm text-foreground-dim">ไม่ได้ระบุขนส่ง</span>
        )}
      </div>
      <p className="text-xs text-foreground-dim">{p.days === null ? "ไม่ทราบวันส่ง" : p.days === 0 ? "ส่งวันนี้" : `ส่งเมื่อ ${p.days} วันก่อน`}</p>
    </li>
  );
}

export default async function StaffTrackingPage() {
  if (!staffAreaEnabled()) notFound();
  if (!(await isStaff())) redirect("/staff");
  const rows = parcelsNow();
  const late = rows.filter((r) => r.late).length;
  const onTheWay = rows.filter((r) => r.status === "shipped").length;

  return (
    <Container className="flex max-w-2xl flex-col gap-4 pb-8 pt-4 lg:gap-6 lg:pt-8">
      <StaffBar back={{ href: "/staff", label: "งาน" }} />
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">เช็คพัสดุ</h1>
        <p className="text-sm text-foreground-muted">
          กำลังส่ง {onTheWay}
          {late > 0 && <span className="font-semibold text-danger"> · ส่งเกิน {LATE_DAYS} วัน {late}</span>}
        </p>
      </header>

      {rows.length === 0 ? (
        <p className="text-sm text-foreground-dim">ยังไม่มีพัสดุที่ใส่เลขแล้ว</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((p) => (
            <Parcel key={p.orderNumber} p={p} />
          ))}
        </ul>
      )}

      {/* Three short lines, not one paragraph: Chrome splits "ออเดอร์" and "สีแดง" at 390 (no dictionary entry). */}
      <ul className="flex flex-col gap-1 text-sm leading-relaxed text-foreground-muted">
        <li>กดคัดลอกเลข แล้วเปิดหน้าขนส่ง วางเลขแล้วค้นหา</li>
        <li>
          ขึ้น<span className="whitespace-nowrap">สีแดง</span>เมื่อส่งมา {LATE_DAYS} วันขึ้นไป และยังไม่ได้กดว่าลูกค้าได้รับ
        </li>
        <li>
          <span className="whitespace-nowrap">ออเดอร์</span>ที่ลูกค้าได้รับแล้วอยู่ในหน้านี้ {KEEP_DONE_DAYS} วัน
        </li>
      </ul>
    </Container>
  );
}
