import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { listCustomers } from "@/lib/staff/customer-cards";
import { StaffBar } from "@/app/staff/_components/StaffBar";
import { CustomerSearch } from "./CustomerSearch";

/**
 * /staff/customers — every customer who ordered, newest order first, with a search box (owner list ก11: "การ์ดลูกค้าใน
 * หลังบ้าน", asked twice). One customer = one checkout phone (customer-card-rules.ts). The total is money staff confirmed;
 * no cost, no profit — admins open this page too. Staff only, noindex, like every /staff page.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ลูกค้า",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default async function StaffCustomersPage() {
  if (!staffAreaEnabled()) notFound();
  if (!(await isStaff())) redirect("/staff");
  const rows = listCustomers();

  return (
    <Container className="flex max-w-2xl flex-col gap-4 pb-8 pt-4 lg:gap-6 lg:pt-8">
      <StaffBar back={{ href: "/staff", label: "งาน" }} />
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          ลูกค้า <span className="text-foreground-dim">· {rows.length}</span>
        </h1>
        <p className="text-sm leading-relaxed text-foreground-muted">ยอดซื้อ = ออเดอร์ที่ยืนยันยอดเงินแล้ว · ตอนนี้มีเฉพาะออเดอร์เว็บ</p>
      </header>
      <CustomerSearch rows={rows} />
    </Container>
  );
}
