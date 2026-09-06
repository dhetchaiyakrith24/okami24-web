import type { Metadata } from "next";
import { canonicalFor } from "@/lib/seo";
import { PrivacyContent } from "@/components/content/service-pages/PrivacyContent";

// Written from what the code actually stores (src/lib/db/migrations/0001_init.sql) and what runs
// in the browser; retention (1 year), controller (the shop OKami24), official channel (email) and
// "no DPO" are the owner's 2026-09-06 answers 9–11 (BSOT §11).
// Body rendered in th/en/zh by PrivacyContent from src/i18n/service-pages/privacy.tsx.
export const metadata: Metadata = {
  title: "นโยบายความเป็นส่วนตัว",
  description: "นโยบายความเป็นส่วนตัว OKami24 — เก็บอะไร ใช้ทำอะไร แชร์ให้ใคร และวิธีขอดู แก้ หรือลบข้อมูลของคุณตาม PDPA",
  ...canonicalFor("/privacy"),
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
