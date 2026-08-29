import type { FAQItem } from "@/types/catalog";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQAccordion } from "@/components/content/FAQAccordion";

export function ProductFAQ({ faqs }: { faqs: FAQItem[] }) {
  if (faqs.length === 0) return null;

  return (
    <section className="border-b border-surface-border-soft bg-surface-1 py-14 lg:py-20">
      <Container className="flex flex-col gap-8">
        <SectionHeading eyebrow="FAQ" title="Common questions about this device." />
        <FAQAccordion items={faqs} />
      </Container>
    </section>
  );
}
