import type { Metadata } from "next";
import { canonicalFor } from "@/lib/seo";
import { ContactContent } from "@/components/content/service-pages/ContactContent";

// Channels: BSOT §3 / src/data/contact.ts. Hours (24/7), email and "LINE = backup order channel"
// are the owner's 2026-09-06 answers 7, 8, 18. No contact form on purpose (designer note).
// Still open (BSOT §11): e-commerce registration and legally required seller details.
// Body rendered in th/en/zh by ContactContent from src/i18n/service-pages/contact.tsx.
export const metadata: Metadata = {
  title: "ติดต่อเรา",
  description: "ติดต่อ OKami24 — LINE @okm24 ทักได้ทุกวัน 24 ชั่วโมง แอดมินตอบเอง ไม่ใช่บอท · อีเมล okamisalt@gmail.com สำหรับเรื่องเอกสารและข้อมูลส่วนบุคคล",
  ...canonicalFor("/contact"),
};

export default function ContactPage() {
  return <ContactContent />;
}
