import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { listStaffOrders, type StaffOrderFilter } from "@/lib/staff/orders";
import { isStaffJob, STAFF_JOBS } from "@/lib/staff/jobs";
import { StaffBar } from "@/app/staff/_components/StaffBar";
import { LIST_CLASS, OrderRow } from "@/app/staff/_components/OrderRow";

/**
 * /staff/orders?f=<job> — the web orders of one job (jobs = src/lib/staff/jobs.ts); `f=all` = the newest 200. Every list is
 * newest first (owner 30/10). Staff declutter 27/10: the work list itself lives on /staff ("งาน"), so no `f` goes there, and
 * the row of eight filter chips is gone — "งาน" links each job by its heading and the other jobs from one line at its foot.
 * Same lock as /staff: 404 until the staff password is set, the login page without a staff session. Not linked from the
 * shop, not indexed. An order opened from here comes back to the same list (its link carries `from`).
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ออเดอร์ (ทีมงาน)",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default async function StaffOrdersPage({ searchParams }: { searchParams: Promise<{ f?: string }> }) {
  if (!staffAreaEnabled()) notFound();
  if (!(await isStaff())) redirect("/staff");
  const { f } = await searchParams;
  if (f !== "all" && !isStaffJob(f)) redirect("/staff");
  const filter: StaffOrderFilter = f;
  const orders = listStaffOrders(filter);
  const title = filter === "all" ? "ออเดอร์ทั้งหมด" : STAFF_JOBS[filter].label;

  return (
    <Container className="flex max-w-2xl flex-col gap-4 pb-8 pt-4 lg:gap-6 lg:pt-8">
      <StaffBar back={{ href: "/staff", label: "งาน" }} />
      <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
        {title} <span className="text-foreground-dim">· {orders.length}</span>
      </h1>
      {orders.length === 0 ? (
        <p className="rounded-xl border border-surface-border-soft bg-surface-1 p-5 text-sm text-foreground-muted">ไม่มีออเดอร์ในหมวดนี้</p>
      ) : (
        <ul className={LIST_CLASS}>
          {orders.map((o) => (
            // One job on screen = every row has the same status, so the pill would only add noise (designer 26/10).
            <OrderRow key={o.orderNumber} o={o} from={filter} showStatus={filter === "all"} />
          ))}
        </ul>
      )}
    </Container>
  );
}
