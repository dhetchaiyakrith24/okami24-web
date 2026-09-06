import type { Metadata } from "next";
import { canonicalFor } from "@/lib/seo";
import { HowToOrderContent } from "@/components/content/service-pages/HowToOrderContent";

// Copy: writer draft 2026-09-06 (docs/PAGE_COPY_2026-09-06.md) + the owner's 2026-09-06 answers
// (BSOT §8–§10). Since the same evening the body is rendered in th/en/zh by HowToOrderContent
// from src/i18n/service-pages/how-to-order.tsx; page metadata stays Thai (primary market).
export const metadata: Metadata = {
  title: "วิธีสั่งซื้อ",
  description:
    "วิธีสั่งซื้อสินค้ากับ OKami24 ทีละขั้น — ใส่ตะกร้า ยืนยันเบอร์ด้วย OTP กรอกที่อยู่ โอนเงิน แจ้งชำระเงิน แล้วรอแอดมินตรวจยอดและจัดส่งพร้อมเลขพัสดุ",
  ...canonicalFor("/how-to-order"),
};

export default function HowToOrderPage() {
  return <HowToOrderContent />;
}
