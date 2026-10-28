import Link from "next/link";
import { countByJob } from "@/lib/staff/orders";
import { TODO_JOBS } from "@/lib/staff/jobs";
import { recentCalls } from "@/lib/woo/store";
import { WAREHOUSE_STOCK_READ_ON } from "@/data/stock/warehouse-stock";

export type StaffTab = "orders" | "slip" | "dev";

/**
 * The three boxes at the top of the staff pages (owner 28/10: "อยากให้มีปุ่มหรือกล่องด้านบน … ออเดอร์ - ตรวจใบสลิป - Okami
 * dev"; designer spec 28/10). Each box is one section of the staff side, the open one marked; every staff tool lives under
 * exactly one box: ออเดอร์ = the job list and the order pages · ตรวจสลิป = the slip check from LINE · Okami dev = the warehouse
 * link, stock read, ordering switch (read only), Excel and LINE groups. Shown on the three section pages only — the order
 * pages keep their one way back.
 */
export function StaffTiles({ active }: { active: StaffTab }) {
  const counts = countByJob();
  const todo = TODO_JOBS.reduce((n, j) => n + counts[j], 0);
  const lastCall = recentCalls(1)[0];
  const tiles: { tab: StaffTab; href: string; label: string; line: React.ReactNode }[] = [
    {
      tab: "orders",
      href: "/staff",
      label: "ออเดอร์",
      line: todo > 0 ? <span className="font-display text-2xl font-bold tabular-nums leading-none text-unverified">{todo}</span> : <span className="text-foreground-dim">ไม่มีงาน</span>,
    },
    { tab: "slip", href: "/staff/slip", label: "ตรวจสลิป", line: <span className="text-foreground-dim">สลิปจาก LINE</span> },
    {
      tab: "dev",
      href: "/staff/dev",
      label: "Okami dev",
      line: (
        <span className={lastCall && lastCall.status >= 400 ? "text-danger" : "text-foreground-dim"}>
          สต็อก {WAREHOUSE_STOCK_READ_ON.slice(8, 10)}/{WAREHOUSE_STOCK_READ_ON.slice(5, 7)}
        </span>
      ),
    },
  ];

  return (
    <nav aria-label="หมวดงาน" className="grid grid-cols-3 gap-2 lg:gap-3">
      {tiles.map((t) => {
        const on = t.tab === active;
        return (
          <Link
            key={t.tab}
            href={t.href}
            aria-current={on ? "page" : undefined}
            className={`flex min-h-20 flex-col justify-between gap-2 rounded-xl border p-3 lg:min-h-24 lg:p-4 ${
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
