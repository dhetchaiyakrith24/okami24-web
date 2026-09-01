import type { Metadata } from "next";
import { siteFaqs, faqsByCategory } from "@/data/faqs";
import type { SiteFAQ } from "@/types/catalog";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { FAQAccordion } from "@/components/content/FAQAccordion";
import { canonicalFor } from "@/lib/seo";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about ordering from OKami24, how the catalog, comparison tool, and finder work.",
  ...canonicalFor("/faq"),
};

const CATEGORY_LABELS: Record<SiteFAQ["category"], string> = {
  ordering: "Ordering",
  devices: "Devices & Catalog",
  "e-liquid": "E-Liquid",
  safety: "Safety & Compliance",
  account: "Favorites & Local Data",
};

const CATEGORY_ORDER: SiteFAQ["category"][] = ["ordering", "devices", "e-liquid", "safety", "account"];

export default function FAQPage() {
  return (
    <>
      <PageHeader eyebrow="Support" title="FAQ" description={`${siteFaqs.length} answers about ordering, the catalog, and how the tools work.`} />
      <Container className="max-w-3xl py-12 lg:py-16">
        <div className="flex flex-col gap-12">
          {CATEGORY_ORDER.map((category) => {
            const items = faqsByCategory(category);
            if (items.length === 0) return null;
            return (
              <div key={category}>
                <h2 className="label-mono mb-2 text-xs text-ember">{CATEGORY_LABELS[category]}</h2>
                <FAQAccordion items={items} />
              </div>
            );
          })}
        </div>
      </Container>
    </>
  );
}
