import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { StaffBar } from "@/app/staff/_components/StaffBar";
import { LineGroups } from "@/app/staff/_components/LineGroups";
import { formatCount, formatShortDateTime } from "@/app/staff/_components/format";
import { lineConfigured } from "@/lib/line/client";
import { listKeys } from "@/lib/woo/keys";
import { recentCalls } from "@/lib/woo/store";
import { feedHealth } from "@/lib/woo/watch";
import { bangkokShort } from "@/lib/woo/watch-rules";
import { FEED_LIGHT } from "@/app/staff/_components/feed-light";
import { ORDERING_ENABLED } from "@/lib/commerce/ordering-mode";

/**
 * /staff/dev — "Okami dev" (owner 28/10: the third box at the top of the staff pages; designer spec 28/10): the shop's
 * back-office tools on one card — the warehouse link, the warehouse stock read, whether the site takes orders (read
 * only: the switch is the host's setting, never changed here), the Excel copy of every order, and the LINE groups. They
 * sat folded under "อื่น ๆ" on the job list until then. Same lock as every staff page.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Okami dev (ทีมงาน)",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const ROW = "flex min-h-12 items-center justify-between gap-3 px-4 py-2 text-sm text-foreground";

export default async function StaffDevPage() {
  if (!staffAreaEnabled()) notFound();
  if (!(await isStaff())) redirect("/staff");
  const activeKeys = listKeys().filter((k) => !k.revoked_at).length;
  const lastCall = recentCalls(1)[0];
  const feed = feedHealth();
  const light = FEED_LIGHT[feed.state];

  return (
    <Container className="flex max-w-2xl flex-col gap-5 pb-8 pt-4 lg:gap-6 lg:pt-8">
      <StaffBar tab="dev" />
      <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Okami dev</h1>

      <div className="flex flex-col divide-y divide-surface-border-soft rounded-xl border border-surface-border-soft bg-surface-1">
        <Link href="/staff/shipnity" className={`${ROW} hover:bg-surface-2`}>
          <span className="flex flex-col">
            เชื่อมคลัง Shipnity
            <span className="text-xs text-foreground-dim">
              คีย์ที่ใช้อยู่ {formatCount(activeKeys)} · Shipnity เรียกล่าสุด{" "}
              {lastCall ? (
                <span className={lastCall.status >= 400 ? "text-danger" : ""}>
                  {formatShortDateTime(lastCall.at)} ({lastCall.status})
                </span>
              ) : (
                "ยังไม่เคย"
              )}
            </span>
          </span>
          <span aria-hidden>→</span>
        </Link>
        {/* Owner 28/10: the stock light is always on — green while Shipnity sends, red when it stopped (watch-rules.ts);
            the same light sits on the Okami dev box, and LINE hears when it turns red. */}
        <div className={ROW}>
          <span className="flex min-w-0 flex-col">
            สต็อกจาก Shipnity (อัปเดตสด)
            <span className="text-xs text-foreground-dim">
              ส่งล่าสุด {feed.lastPushAt ? bangkokShort(feed.lastPushAt) : "ยังไม่เคย"} · ส่งมาแล้ว {formatCount(feed.reportedCodes)} รหัส
            </span>
            {feed.reason && <span className={`text-xs ${light.text}`}>{feed.reason}</span>}
          </span>
          <span className={`inline-flex shrink-0 items-center gap-1.5 font-semibold ${light.text}`}>
            <span aria-hidden className={`size-2.5 rounded-full ${light.dot}`} />
            {light.long}
          </span>
        </div>
        <div className={ROW}>
          <span>รับออเดอร์บนเว็บ</span>
          <span className={ORDERING_ENABLED ? "font-semibold text-verified" : "font-semibold text-danger"}>{ORDERING_ENABLED ? "เปิด" : "ปิด"}</span>
        </div>
        {/* Owner 23/10: a copy of every order on the shop's own computer — opens in Excel. */}
        <a href="/staff/api/export" download className={`${ROW} hover:bg-surface-2`}>
          ดาวน์โหลดออเดอร์ทั้งหมด (Excel) <span aria-hidden>↓</span>
        </a>
        {lineConfigured() && (
          <details className="px-4 py-3">
            <summary className="cursor-pointer text-sm text-foreground">ตั้งค่ากลุ่ม LINE ของบอท</summary>
            <div className="pt-3">
              <LineGroups />
            </div>
          </details>
        )}
      </div>
    </Container>
  );
}
