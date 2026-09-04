import type { Metadata } from "next";
import { siteFaqs, faqsByCategory } from "@/data/faqs";
import type { SiteFAQ } from "@/types/catalog";
import { Container } from "@/components/ui/Container";
import { FAQAccordion } from "@/components/content/FAQAccordion";
import { FAQPageHeader } from "@/components/content/FAQPageHeader";
import { FAQCategoryHeading } from "@/components/content/FAQCategoryHeading";
import { canonicalFor } from "@/lib/seo";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about ordering from OKami24, how the catalog, comparison tool, and finder work.",
  ...canonicalFor("/faq"),
};

const CATEGORY_ORDER: SiteFAQ["category"][] = ["ordering", "devices", "e-liquid", "safety", "account"];

export default function FAQPage() {
  return (
    <>
      <FAQPageHeader count={siteFaqs.length} />
      <Container className="max-w-3xl py-12 lg:py-16">
        <div className="flex flex-col gap-12">
          {CATEGORY_ORDER.map((category) => {
            const items = faqsByCategory(category);
            if (items.length === 0) return null;
            return (
              <div key={category}>
                <FAQCategoryHeading category={category} />
                <FAQAccordion items={items} />
              </div>
            );
          })}
        </div>
      </Container>
    </>
  );
}
