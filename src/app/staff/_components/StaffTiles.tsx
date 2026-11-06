import Link from "next/link";
import { countByJob } from "@/lib/staff/orders";
import { TODO_JOBS } from "@/lib/staff/jobs";
import { feedHealth } from "@/lib/woo/watch";
import { FEED_LIGHT } from "@/app/staff/_components/feed-light";
import { salesToday } from "@/lib/staff/daily-sales";
import { formatSatang } from "@/app/staff/_components/format";

export type StaffTab = "orders" | "slip" | "stock" | "dev" | "sales";

/**
 * The boxes at the top of the staff pages (owner 28/10: "อยากให้มีปุ่มหรือกล่องด้านบน … ออเดอร์ - ตรวจใบสลิป - Okami
 * dev"; designer spec 28/10 · "เช็คสต็อก" added 29/10, two by two on a phone). Each box is one section of the staff side, the open one marked; every staff tool lives under
 * exactly one box: ออเดอร์ = the job list and the order pages · ตรวจสลิป = the slip check from LINE · Okami dev = the warehouse
 * link, stock read, ordering switch (read only), Excel and LINE groups · เช็คสต็อก = what each model has left · ยอดขาย = web + LINE per day
 * (owner 04/11, back-office round 07/11 — the fifth box takes the whole last row on a phone). Shown on the section pages only — the order
 * pages keep their one way back.
 */
export function StaffTiles({ active }: { active: StaffTab }) {
  const counts = countByJob();
  const todo = TODO_JOBS.reduce((n, j) => n + counts[j], 0);
  const feed = FEED_LIGHT[feedHealth().state];
  const sales = salesToday();
  const tiles: { tab: StaffTab; href: string; label: string; line: React.ReactNode; wide?: boolean }[] = [
    {
      tab: "orders",
      href: "/staff",
      label: "ออเดอร์",
      line: todo > 0 ? <span className="font-display text-2xl font-bold tabular-nums leading-none text-unverified">{todo}</span> : <span className="text-foreground-dim">ไม่มีงาน</span>,
    },
    { tab: "slip", href: "/staff/slip", label: "ตรวจสลิป", line: <span className="text-foreground-dim">สลิปจาก LINE</span> },
    // Owner 29/10: "หัวข้อตรวจสต๊อกให้ทีมงาน" — what is left of a model, for a customer asking on LINE.
    { tab: "stock", href: "/staff/stock", label: "เช็คสต็อก", line: <span className="text-foreground-dim">เหลืออะไรบ้าง</span> },
    {
      tab: "dev",
      href: "/staff/dev",
      label: "Okami dev",
      // Owner 28/10: the Shipnity stock light, on every section page — red the moment the push stops (watch-rules.ts).
      line: (
        <span className={`inline-flex items-center gap-1.5 ${feed.text}`}>
          <span aria-hidden className={`size-2 rounded-full ${feed.dot}`} />
          สต็อก {feed.short}
        </span>
      ),
    },
    {
      tab: "sales",
      href: "/staff/sales",
      label: "ยอดขาย",
      line: <span className="tabular-nums text-foreground-dim">วันนี้ {formatSatang(sales.totalSatang)}</span>,
      wide: true,
    },
  ];

  return (
    <nav aria-label="หมวดงาน" className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:gap-3">
      {tiles.map((t) => {
        const on = t.tab === active;
        return (
          <Link
            key={t.tab}
            href={t.href}
            aria-current={on ? "page" : undefined}
            className={`flex min-h-20 flex-col justify-between gap-2 rounded-xl border p-3 lg:min-h-24 lg:p-4 ${t.wide ? "col-span-2 sm:col-span-1" : ""} ${
              on ? "border-ember bg-surface-2" : "border-surface-border-soft bg-surface-1 hover:bg-surface-2"
            }`}
          >
            <span className="whitespace-nowrap text-sm font-semibold text-foreground">{t.label}</span>
            <span className="text-xs">{t.line}</span>
          </Link>
        );
      })}
    </nav>
  );
}
