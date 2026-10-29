import type { Metadata } from "next";
import { canonicalFor } from "@/lib/seo";
import { ShippingContent } from "@/components/content/service-pages/ShippingContent";

// Facts: docs/BUSINESS_SOURCE_OF_TRUTH.md §10 (fee/threshold + the owner's 2026-09-06 answers:
// 12:30 cut-off after payment is reported, 1–3 days, Mon–Sat, Thailand only). The carrier is
// chosen per destination and is never named on the site — owner, 2026-09-09 (round 30.1).
// Body rendered in th/en/zh by ShippingContent from src/i18n/service-pages/shipping.tsx.
export const metadata: Metadata = {
  // Round "SEO all keys" batch 6 (16/10): "พอตส่งด่วน" answered with what the shop really does (BSOT §10: same-day dispatch
  // when paid and reported before 12:30, 1–3 days) — no rider/express claim, no carrier name, no "ส่งฟรี" in new copy (THAI_STYLE).
  title: "ส่งพอตไวทั่วไทย โอนก่อน 12:30 ส่งวันเดียวกัน",
  description: "อยากได้พอตด่วน โอนและส่งสลิปก่อน 12:30 เราจัดส่งให้วันเดียวกัน ถึงมือใน 1–3 วัน ส่งทั่วประเทศไทย ค่าส่ง 50 บาท และมีเลขพัสดุให้เช็คทุกคำสั่งซื้อ",
  ...canonicalFor("/shipping"),
};

export default function ShippingPage() {
  return <ShippingContent />;
}
