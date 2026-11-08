import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { stockBook } from "@/lib/staff/stock-book";
import { slipsToPick } from "@/lib/staff/line-orders";
import { StaffBar } from "@/app/staff/_components/StaffBar";
import { LineOrderForm, type PickProduct } from "./LineOrderForm";

/**
 * /staff/line-order — "คีย์ออเดอร์ LINE" (owner list ก11, way 2, 09/11): staff key an order a customer made in the LINE chat,
 * so every sale and customer sits in one system and the owner's numbers are real. Saving = src/lib/staff/line-orders.ts.
 * Only options that sell now are offered (the same check as the cart). Staff only, noindex.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "คีย์ออเดอร์ LINE",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default async function StaffLineOrderPage() {
  if (!staffAreaEnabled()) notFound();
  if (!(await isStaff())) redirect("/staff");
  const products: PickProduct[] = stockBook()
    .map((p) => ({ slug: p.slug, name: p.name, price: p.price, options: p.options.filter((o) => o.sells).map((o) => ({ id: o.id, name: o.name })) }))
    .filter((p) => p.options.length > 0);
  const slips = slipsToPick();

  return (
    <Container className="flex max-w-2xl flex-col gap-4 pb-8 pt-4 lg:gap-6 lg:pt-8">
      <StaffBar back={{ href: "/staff", label: "งาน" }} />
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">คีย์ออเดอร์ LINE</h1>
        <p className="text-sm leading-relaxed text-foreground-muted">ราคาและค่าส่งเท่าบนเว็บ ระบบคิดให้เอง · บันทึกแล้วไปที่หน้าออเดอร์</p>
      </header>
      <LineOrderForm products={products} slips={slips} />
    </Container>
  );
}
