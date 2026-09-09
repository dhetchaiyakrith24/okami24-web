import type { Metadata } from "next";
import { canonicalFor } from "@/lib/seo";
import { HowToOrderContent } from "@/components/content/service-pages/HowToOrderContent";
import { ORDERING_ENABLED } from "@/lib/commerce/ordering-mode";

// Copy: writer draft 2026-09-06 (docs/PAGE_COPY_2026-09-06.md) + the owner's 2026-09-06 answers
// (BSOT §8–§10). Since the same evening the body is rendered in th/en/zh by HowToOrderContent
// from src/i18n/service-pages/how-to-order.tsx; page metadata stays Thai (primary market).
export const metadata: Metadata = {
  title: "วิธีสั่งซื้อ",
  description:
    "วิธีสั่งซื้อกับ OKami24 ทีละขั้น — ช่วงนี้สั่งทางไลน์ @okm24 บอกรุ่นที่อยากได้ แอดมินสรุปยอดรวมค่าส่งและวิธีโอน ตรวจยอดแล้วจัดส่งพร้อมเลขพัสดุ",
  ...canonicalFor("/how-to-order"),
};

export default function HowToOrderPage() {
  return <HowToOrderContent orderingEnabled={ORDERING_ENABLED} />;
}
