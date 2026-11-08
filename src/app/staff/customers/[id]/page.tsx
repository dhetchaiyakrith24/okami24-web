import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { formatRunNumber } from "@/lib/commerce/run-number";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { getCustomerCard } from "@/lib/staff/customer-cards";
import { isPaid } from "@/lib/staff/customer-card-rules";
import { STAFF_STATUS_LABEL, statusTone, TONE_CLASS } from "@/lib/staff/jobs";
import { StaffBar } from "@/app/staff/_components/StaffBar";
import { formatBaht, formatDay, formatShortDateTime } from "@/app/staff/_components/format";
import { LIST_CLASS } from "@/app/staff/_components/OrderRow";

/**
 * /staff/customers/<id> — one customer's card (owner list ก11): what they bought in all, how often, when last, where the
 * parcel goes and how to reach them, then every order. Rules = customer-card-rules.ts. The id is the customer row, never the
 * phone, so no phone number sits in an address. No cost, no profit.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "การ์ดลูกค้า",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const PROVIDER: Record<string, string> = { line: "LINE", google: "Google" };
const card = "flex flex-col gap-3 rounded-xl border border-surface-border-soft bg-surface-1 p-4";

function Figure({ label, value, dim = false }: { label: string; value: string; dim?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-foreground-dim">{label}</span>
      <span className={`font-display text-xl font-bold tabular-nums leading-tight ${dim ? "text-foreground-dim" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

export default async function StaffCustomerCardPage({ params }: { params: Promise<{ id: string }> }) {
  if (!staffAreaEnabled()) notFound();
  if (!(await isStaff())) redirect("/staff");
  const { id } = await params;
  const customerId = /^\d{1,9}$/.test(id) ? Number(id) : null;
  const c = customerId === null ? null : getCustomerCard(customerId);
  if (!c) notFound();

  const name = c.contact?.name ?? c.phone;
  const last = c.lastOrder;

  return (
    <Container className="flex max-w-2xl flex-col gap-4 pb-8 pt-4 lg:gap-6 lg:pt-8">
      <StaffBar back={{ href: "/staff/customers", label: "ลูกค้า" }} />

      <header className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">{name}</h1>
        <p className="text-sm text-foreground-muted">
          เบอร์ที่ใช้สั่ง{" "}
          <a href={`tel:${c.phone}`} className="font-semibold tabular-nums text-ember underline underline-offset-4">
            {c.phone}
          </a>
          {c.members.length > 0 && <> · เข้าสู่ระบบด้วย {c.members.map((m) => `${PROVIDER[m.provider] ?? m.provider}${m.name ? ` (${m.name})` : ""}`).join(", ")}</>}
        </p>
      </header>

      <section aria-label="ยอดซื้อ" className={`${card} grid grid-cols-2 gap-4 sm:grid-cols-4`}>
        <Figure label="ยอดซื้อรวม" value={formatBaht(c.paidTotal)} />
        <Figure label="ออเดอร์ที่จ่ายแล้ว" value={`${c.paidCount}`} />
        <Figure label="สั่งครั้งแรก" value={c.firstOrderAt ? formatDay(c.firstOrderAt) : "-"} />
        <Figure label="สั่งล่าสุด" value={last ? formatDay(last.createdAt) : "-"} />
        {(c.waitingCount > 0 || c.cancelledCount > 0) && (
          <p className="col-span-2 text-sm text-foreground-muted sm:col-span-4">
            {c.waitingCount > 0 && <span className="text-unverified">รอจ่ายหรือรอตรวจสลิป {c.waitingCount} ออเดอร์</span>}
            {c.waitingCount > 0 && c.cancelledCount > 0 && " · "}
            {c.cancelledCount > 0 && <span>ยกเลิก {c.cancelledCount} ออเดอร์</span>}
            <span className="text-foreground-dim"> · ไม่นับในยอดซื้อ</span>
          </p>
        )}
      </section>

      {c.contact && (
        <section className={card}>
          <h2 className="text-base font-semibold text-foreground">ส่งของถึง (ล่าสุด)</h2>
          <div className="flex flex-col gap-1 text-sm">
            <p className="text-foreground">
              {c.contact.name} ·{" "}
              <a href={`tel:${c.contact.phone}`} className="font-semibold tabular-nums text-ember underline underline-offset-4">
                {c.contact.phone}
              </a>
            </p>
            <p className="text-foreground-muted">{c.contact.address}</p>
          </div>
        </section>
      )}

      <section aria-label="ออเดอร์ทั้งหมด" className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-foreground">
          ออเดอร์ <span className="text-foreground-dim">· {c.orders.length}</span>
        </h2>
        <ul className={LIST_CLASS}>
          {c.orders.map((o) => {
            const run = formatRunNumber(o.runNumber);
            return (
              <li key={o.orderNumber}>
                <Link
                  href={`/staff/orders/${encodeURIComponent(o.orderNumber)}`}
                  className="flex min-h-16 flex-col justify-center gap-1 px-4 py-3 hover:bg-surface-2"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="min-w-0 truncate">
                      <span className="font-semibold tabular-nums text-foreground">{run ?? o.orderNumber}</span>
                      <span className="ml-2 text-xs text-foreground-dim">เว็บ</span>
                    </span>
                    <span className={`shrink-0 text-sm font-semibold tabular-nums ${isPaid(o.status) ? "text-foreground" : "text-foreground-dim"}`}>
                      {formatBaht(o.total)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm text-foreground-muted">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs ${TONE_CLASS[statusTone(o.status)].pill}`}>{STAFF_STATUS_LABEL[o.status]}</span>
                      <span className="truncate">
                        {o.itemCount} ชิ้น · {o.province}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs">{formatShortDateTime(o.createdAt)}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="text-sm text-foreground-dim">ออเดอร์ LINE จะขึ้นที่นี่เมื่อหลังบ้านคีย์ออเดอร์ LINE ได้</p>
      </section>
    </Container>
  );
}
