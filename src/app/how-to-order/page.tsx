import type { Metadata } from "next";
import { canonicalFor } from "@/lib/seo";
import { HowToOrderContent } from "@/components/content/service-pages/HowToOrderContent";
import { ORDERING_ENABLED } from "@/lib/commerce/ordering-mode";

// Copy: writer draft 2026-09-06 (docs/PAGE_COPY_2026-09-06.md) + the owner's 2026-09-06 answers
// (BSOT §8–§10). Since the same evening the body is rendered in th/en/zh by HowToOrderContent
// from src/i18n/service-pages/how-to-order.tsx; page metadata stays Thai (primary market).
export const metadata: Metadata = {
  // Round "SEO all keys" batch 6 (16/10): the head carries the words people type — "สั่ง/ซื้อพอตออนไลน์" (SEO_LANDSCAPE §9.4).
  title: "วิธีสั่งซื้อพอตออนไลน์",
  // Owner 30/10 (meta ending: both ways, the customer's choice): with the cart on the line says web or LINE, with the
  // steps this page shows (cart → bank transfer or QR → checked, shipped with a tracking number). Cart off = the old line.
  description: ORDERING_ENABLED
    ? "ซื้อพอตออนไลน์กับ OKami24 ได้ทั้งบนเว็บและทาง LINE @okm24 ใส่ตะกร้าแล้วโอนหรือสแกน QR หรือทักแอดมินให้สรุปยอดในแชท ตรวจยอดแล้วจึงส่งพร้อมเลขพัสดุ"
    : "ซื้อพอตออนไลน์กับ OKami24 ได้ทางไลน์ @okm24 บอกรุ่น สี หรือกลิ่นที่ต้องการ แอดมินจะสรุปยอดและวิธีโอนให้ในแชท ตรวจยอดแล้วจึงจัดส่งพร้อมเลขพัสดุ ส่งทั่วประเทศไทย",
  ...canonicalFor("/how-to-order"),
};

export default function HowToOrderPage() {
  return <HowToOrderContent orderingEnabled={ORDERING_ENABLED} />;
}
