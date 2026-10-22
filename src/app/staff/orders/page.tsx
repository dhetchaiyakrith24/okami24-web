import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { orderStatusLabel } from "@/lib/commerce/order-status";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { listStaffOrders, type StaffOrderFilter } from "@/lib/staff/orders";
import { formatBaht, formatDateTime, VerdictBadge } from "@/app/staff/_components/order-bits";

/**
 * /staff/orders — the web orders, newest first (cart round 22/10, round batch 2). Same lock as /staff: 404 until the
 * staff password is set, the login page without a staff session. Not linked from the shop, not indexed.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ออเดอร์ (ทีมงาน)",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const TABS: { key: StaffOrderFilter; label: string }[] = [
  { key: "todo", label: "ต้องทำ" },
  { key: "unpaid", label: "ยังไม่จ่าย" },
  { key: "all", label: "ทั้งหมด" },
];

export default async function StaffOrdersPage({ searchParams }: { searchParams: Promise<{ f?: string }> }) {
  if (!staffAreaEnabled()) notFound();
  if (!(await isStaff())) redirect("/staff");
  const { f } = await searchParams;
  const filter: StaffOrderFilter = f === "unpaid" || f === "all" ? f : "todo";
  const orders = listStaffOrders(filter);

  return (
    <Container className="flex max-w-2xl flex-col gap-6 pb-28 pt-8 lg:pt-12">
      <header className="flex flex-col gap-2">
        <span className="label-mono text-xs text-ember">OKami24 · ทีมงาน</span>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">ออเดอร์เว็บ</h1>
        <Link href="/staff" className="text-sm text-foreground-muted underline-offset-4 hover:text-foreground hover:underline">
          ← หน้าตรวจสลิป
        </Link>
      </header>

      <nav className="flex gap-2" aria-label="กรองออเดอร์">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={t.key === "todo" ? "/staff/orders" : `/staff/orders?f=${t.key}`}
            aria-current={filter === t.key ? "page" : undefined}
            className={
              filter === t.key
                ? "rounded-full bg-ember px-4 py-2 text-sm font-semibold text-[#181008]"
                : "rounded-full border border-surface-border px-4 py-2 text-sm text-foreground-muted hover:text-foreground"
            }
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {orders.length === 0 ? (
        <p className="rounded-xl border border-surface-border-soft bg-surface-1 p-5 text-sm text-foreground-muted">ไม่มีออเดอร์ในหมวดนี้</p>
      ) : (
        <ul className="flex flex-col divide-y divide-surface-border-soft rounded-xl border border-surface-border-soft bg-surface-1">
          {orders.map((o) => (
            <li key={o.orderNumber}>
              <Link href={`/staff/orders/${encodeURIComponent(o.orderNumber)}`} className="flex flex-col gap-1 p-4 hover:bg-surface-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-medium text-foreground">{o.orderNumber}</span>
                  <span className="text-sm font-semibold text-foreground">{formatBaht(o.total)}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-foreground-muted">
                  <span>
                    {o.recipientName} · {o.province} · {o.itemCount} ชิ้น
                  </span>
                  <span className="text-xs">{formatDateTime(o.createdAt)}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full border border-surface-border px-2 py-0.5 text-foreground">{orderStatusLabel(o.status, "th")}</span>
                  {o.slipVerdict && <VerdictBadge verdict={o.slipVerdict} />}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
