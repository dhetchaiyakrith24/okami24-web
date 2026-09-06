import type { Metadata } from "next";
import { canonicalFor } from "@/lib/seo";
import { ShippingContent } from "@/components/content/service-pages/ShippingContent";

// Facts: docs/BUSINESS_SOURCE_OF_TRUTH.md §10 (fee/threshold + the owner's 2026-09-06 answers:
// 15:00 cut-off after payment is reported, 1–3 days, Mon–Sat, EMS + Flash, Thailand only).
// Body rendered in th/en/zh by ShippingContent from src/i18n/service-pages/shipping.tsx.
export const metadata: Metadata = {
  title: "การจัดส่ง",
  description: "ค่าส่ง OKami24 60 บาททั่วประเทศ ยอด 500 บาทขึ้นไปส่งฟรี · โอนก่อน 15:00 ส่งวันเดียวกัน ถึงใน 1–3 วัน · ไปรษณีย์ไทย EMS และ Flash Express มีเลขพัสดุทุกคำสั่งซื้อ",
  ...canonicalFor("/shipping"),
};

export default function ShippingPage() {
  return <ShippingContent />;
}
