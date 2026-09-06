import type { Metadata } from "next";
import { canonicalFor } from "@/lib/seo";
import { ClaimsPolicyContent } from "@/components/content/service-pages/ClaimsPolicyContent";

/**
 * CLAIMS POLICY — published 2026-09-06. Was a draft under /preview/claims-policy until the owner
 * ticked the symptom list (PAGE_COPY item 12: 1ก 2ก 3ก 4ข 5ข 6ค 7ข); every fact on the page now
 * comes from BSOT §12. Linked from the footer help column and listed in the sitemap.
 * Body rendered in th/en/zh by ClaimsPolicyContent from src/i18n/service-pages/claims-policy.tsx.
 */
export const metadata: Metadata = {
  title: "นโยบายเคลม",
  description: "นโยบายเคลมสินค้า OKami24 — เคลมได้ภายใน 7 วันหลังได้รับของ ต้องมีคลิปตอนแกะกล่อง เคลมผ่านเปลี่ยนของใหม่ตัวเดิม ไม่คืนเป็นเงินสด แอดมินตอบใน 3 วันทำการ",
  ...canonicalFor("/warranty"),
};

export default function WarrantyPage() {
  return <ClaimsPolicyContent />;
}
