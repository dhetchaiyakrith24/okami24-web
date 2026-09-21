import type { Metadata } from "next";
import { canonicalFor, pageBreadcrumbJsonLd } from "@/lib/seo";
import { CONTACT_HEAD_TH } from "@/i18n/search-head-copy";
import { ContactContent } from "@/components/content/service-pages/ContactContent";

// Channels: BSOT §3 / src/data/contact.ts. Hours (24/7), email and "LINE = backup order channel"
// are the owner's 2026-09-06 answers 7, 8, 18. No contact form on purpose (designer note).
// Still open (BSOT §11): e-commerce registration and legally required seller details.
// Body rendered in th/en/zh by ContactContent from src/i18n/service-pages/contact.tsx.
export const metadata: Metadata = {
  // SEO round ก rows A5/A6 (owner เคาะ 2026-09-21) — search-head-copy.ts holds the strings.
  title: { absolute: CONTACT_HEAD_TH.title },
  description: CONTACT_HEAD_TH.description,
  ...canonicalFor("/contact"),
};

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageBreadcrumbJsonLd(CONTACT_HEAD_TH.title, "/contact")) }} />
      <ContactContent />
    </>
  );
}
