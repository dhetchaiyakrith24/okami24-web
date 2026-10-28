import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { StaffBar } from "@/app/staff/_components/StaffBar";
import { StockFinder } from "@/app/staff/_components/StockFinder";
import { stockBook } from "@/lib/staff/stock-book";
import { feedHealth } from "@/lib/woo/watch";
import { FEED_LIGHT } from "@/app/staff/_components/feed-light";
import { formatShortDateTime } from "@/app/staff/_components/format";

/**
 * /staff/stock — "เช็คสต็อก" (owner 29/10: "อยากเพิ่มหัวข้อตรวจสต๊อกให้ทีมงาน เวลาลูกค้าถามว่าสินค้าตัวนี้ๆเหลืออะไรบ้าง"):
 * the fourth box at the top of the staff pages. Answers are the cart's own (stock-book.ts), read fresh on every visit.
 * Same lock as every staff page.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "เช็คสต็อก (ทีมงาน)",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default async function StaffStockPage() {
  if (!staffAreaEnabled()) notFound();
  if (!(await isStaff())) redirect("/staff");
  // Checker #978: staff answer "พร้อมส่ง" from this page, so it says how fresh the warehouse numbers are (the stock light).
  const feed = feedHealth();
  const light = FEED_LIGHT[feed.state];
  return (
    <Container className="flex max-w-2xl flex-col gap-5 pb-8 pt-4 lg:gap-6 lg:pt-8">
      <StaffBar tab="stock" />
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">เช็คสต็อก</h1>
        <p className="text-sm text-foreground-muted">ตรงกับที่ลูกค้าสั่งได้บนเว็บตอนนี้ · ตัวเลขข้างชื่อคือจำนวนในคลัง ไม่มีตัวเลข = คลังยังไม่ส่งจำนวนมา แต่เว็บขายได้</p>
        <p className={`inline-flex items-center gap-1.5 text-sm ${light.text}`}>
          <span aria-hidden className={`size-2 rounded-full ${light.dot}`} />
          คลังส่งตัวเลขล่าสุด {feed.lastPushAt ? formatShortDateTime(feed.lastPushAt) : "ยังไม่เคย"} · {light.long}
        </p>
      </div>
      <StockFinder products={stockBook()} />
    </Container>
  );
}
