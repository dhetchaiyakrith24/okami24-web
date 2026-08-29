import type { Metadata } from "next";
import { siteFaqs, faqsByCategory } from "@/data/faqs";
import type { SiteFAQ } from "@/types/catalog";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { FAQAccordion } from "@/components/content/FAQAccordion";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about how this catalog, comparison tool, and finder work — and what this project is (and isn't).",
};

const CATEGORY_LABELS: Record<SiteFAQ["category"], string> = {
  ordering: "About This Site",
  devices: "Devices & Catalog",
  "e-liquid": "E-Liquid",
  safety: "Safety & Compliance",
  account: "Favorites & Local Data",
};

const CATEGORY_ORDER: SiteFAQ["category"][] = ["ordering", "devices", "e-liquid", "safety", "account"];

export default function FAQPage() {
  return (
    <>
      <PageHeader eyebrow="Support" title="FAQ" description={`${siteFaqs.length} answers about this project, the catalog, and how the tools work.`} />
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
