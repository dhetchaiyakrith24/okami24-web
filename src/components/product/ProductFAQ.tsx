"use client";

import type { FAQItem } from "@/types/catalog";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQAccordion } from "@/components/content/FAQAccordion";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { ProductCopyTh } from "@/i18n/product-copy-th";
import { thaiTypography } from "@/lib/thai-typography";

/** `faqsTh` = the product's PRODUCT_COPY_TH entry's `faqs`, from the server page (SEO ฉ batch 4 — this component no
 *  longer pulls the whole table in; ProductCard still does). */
export function ProductFAQ({ faqs, faqsTh }: { faqs: FAQItem[]; faqsTh?: ProductCopyTh["faqs"] }) {
  const { dict, locale } = useLocale();
  if (faqs.length === 0) return null;
  // Round 30.4ค batch 5 (owner 2026-09-15): a Thai visitor reads the product's own FAQ from the
  // `faqs` overlay in product-copy-th.ts (keyed by FAQ id); an item without an entry keeps its
  // English text. FAQAccordion's site-FAQ overlay (faq-copy.ts) uses disjoint ids, so it leaves
  // these alone. Markup unchanged.
  const overlay = locale === "th" ? faqsTh : undefined;
  const items = overlay ? faqs.map((f) => ({ ...f, question: overlay[f.id]?.question ? thaiTypography(overlay[f.id].question) : f.question, answer: overlay[f.id]?.answer ? thaiTypography(overlay[f.id].answer) : f.answer })) : faqs;

  return (
    <section className="border-b border-surface-border-soft bg-surface-1 py-14 lg:py-20">
      <Container className="flex flex-col gap-8">
        <SectionHeading eyebrow={dict.product.faqEyebrow} title={dict.product.faqTitle} />
        <FAQAccordion items={items} />
      </Container>
    </section>
  );
}
