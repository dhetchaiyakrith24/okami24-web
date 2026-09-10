import type { Metadata } from "next";
import { siteFaqs, faqsByCategory, ORDERING_FAQ_ID, ORDERING_ON_LINE_FAQ_ANSWER } from "@/data/faqs";
import type { SiteFAQ } from "@/types/catalog";
import { Container } from "@/components/ui/Container";
import { FAQAccordion } from "@/components/content/FAQAccordion";
import { FAQPageHeader } from "@/components/content/FAQPageHeader";
import { FAQCategoryHeading } from "@/components/content/FAQCategoryHeading";
import { canonicalFor } from "@/lib/seo";
import { ORDERING_ENABLED } from "@/lib/commerce/ordering-mode";

export const metadata: Metadata = {
  title: "คำถามที่พบบ่อย",
  description: "สั่งซื้อยังไง สเปกสินค้ามาจากไหน พอตซิสเต็มกับพอตใช้แล้วทิ้งต่างกันตรงไหน นิโคติน 30mg หมายถึงอะไร ถ้ายังไม่เจอคำตอบ ทัก LINE @okm24",
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
            // While online ordering is off (owner 2026-09-07) the canonical English answer is
            // swapped HERE, on the server, so the "add to cart" wording never reaches the browser
            // at all — not even inside the serialized props. FAQAccordion does the same swap for
            // th/zh, where the translation overlay lives.
            const items = faqsByCategory(category).map((item) =>
              !ORDERING_ENABLED && item.id === ORDERING_FAQ_ID ? { ...item, answer: ORDERING_ON_LINE_FAQ_ANSWER.en } : item
            );
            if (items.length === 0) return null;
            return (
              <div key={category}>
                <FAQCategoryHeading category={category} />
                <FAQAccordion items={items} orderingEnabled={ORDERING_ENABLED} />
              </div>
            );
          })}
        </div>
      </Container>
    </>
  );
}
