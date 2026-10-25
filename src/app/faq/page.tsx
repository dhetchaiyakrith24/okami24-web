import type { Metadata } from "next";
import { siteFaqs, faqsByCategory, ORDERING_OFF_ANSWERS } from "@/data/faqs";
import type { SiteFAQ } from "@/types/catalog";
import { Container } from "@/components/ui/Container";
import { FAQAccordion } from "@/components/content/FAQAccordion";
import { FAQPageHeader } from "@/components/content/FAQPageHeader";
import { FAQCategoryHeading } from "@/components/content/FAQCategoryHeading";
import { canonicalFor, faqPageJsonLd, pageBreadcrumbJsonLd } from "@/lib/seo";
import { ORDERING_ENABLED } from "@/lib/commerce/ordering-mode";
import { FAQ_COPY_TH } from "@/i18n/faq-copy";

export const metadata: Metadata = {
  // Round "SEO all keys" batch 6 (16/10): "ซื้อพอตที่ไหน" + the buying questions the page now answers (SEO_LANDSCAPE §9.4).
  title: "คำถามที่พบบ่อยเรื่องการซื้อพอต",
  description: "ซื้อพอตที่ไหน สั่งยังไง ส่งกี่วันถึง ซื้อยกลังได้ไหม และพอตซิสเต็มกับพอตใช้แล้วทิ้งต่างกันตรงไหน ถ้ายังไม่เจอสิ่งที่อยากรู้ ทักไลน์ @okm24 ได้ทุกวัน",
  ...canonicalFor("/faq"),
};

const CATEGORY_ORDER: SiteFAQ["category"][] = ["ordering", "devices", "e-liquid", "safety", "account"];

export default function FAQPage() {
  // Batch 4: FAQPage schema from the exact Thai Q/A the accordion renders for the default locale
  // — FAQ_COPY_TH overlay when it exists, English fallback otherwise, and the LINE answer swapped
  // in for the ordering question while ordering is off (same selection FAQAccordion.tsx makes).
  // JSON-LD stays plain text: no thaiTypography() pass, which is render-time only.
  const faqSchemaItems = CATEGORY_ORDER.flatMap((category) =>
    faqsByCategory(category).map((item) => ({
      question: FAQ_COPY_TH[item.id]?.question ?? item.question,
      answer: (!ORDERING_ENABLED && ORDERING_OFF_ANSWERS[item.id]?.th) || (FAQ_COPY_TH[item.id]?.answer ?? item.answer),
    }))
  );
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(faqSchemaItems)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageBreadcrumbJsonLd(metadata.title as string, "/faq")) }} />
      <FAQPageHeader count={siteFaqs.length} />
      <Container className="max-w-3xl py-12 lg:py-16">
        <div className="flex flex-col gap-12">
          {CATEGORY_ORDER.map((category) => {
            // While online ordering is off (owner 2026-09-07) the canonical English answer is
            // swapped HERE, on the server, so the "add to cart" wording never reaches the browser
            // at all — not even inside the serialized props. FAQAccordion does the same swap for
            // th/zh, where the translation overlay lives.
            const items = faqsByCategory(category).map((item) =>
              !ORDERING_ENABLED && ORDERING_OFF_ANSWERS[item.id] ? { ...item, answer: ORDERING_OFF_ANSWERS[item.id].en } : item
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
