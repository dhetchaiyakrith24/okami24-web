"use client";

import type { FAQItem } from "@/types/catalog";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQAccordion } from "@/components/content/FAQAccordion";
import { useLocale } from "@/components/i18n/LocaleProvider";

export function ProductFAQ({ faqs }: { faqs: FAQItem[] }) {
  const { dict } = useLocale();
  if (faqs.length === 0) return null;

  return (
    <section className="border-b border-surface-border-soft bg-surface-1 py-14 lg:py-20">
      <Container className="flex flex-col gap-8">
        <SectionHeading eyebrow={dict.product.faqEyebrow} title={dict.product.faqTitle} />
        <FAQAccordion items={faqs} />
      </Container>
    </section>
  );
}
