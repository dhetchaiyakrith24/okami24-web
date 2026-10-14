import type { Metadata } from "next";
import { guides } from "@/data/guides";
import { Container } from "@/components/ui/Container";
import { GuidesPageHeader } from "@/components/content/GuidesPageHeader";
import { GuideCard } from "@/components/content/GuideCard";
import { guideHeadCopy } from "@/lib/guide-head-copy";
import { canonicalFor, pageBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "คู่มือเลือกและดูแลพอต",
  description: "เลือกพอตเครื่องแรก พอตซิสเต็มกับพอตใช้แล้วทิ้งต่างกันตรงไหน MTL กับ DTL คืออะไร อ่านสเปกยังไง ดูแลคอยล์และแบตยังไง ข้อมูลจริง ไม่ใช่โฆษณา",
  ...canonicalFor("/guides"),
};

export default function GuidesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageBreadcrumbJsonLd(metadata.title as string, "/guides")) }} />
      <GuidesPageHeader />
      <Container className="py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide, i) => (
            <GuideCard key={guide.id} guide={guide} index={i} copy={guideHeadCopy(guide.id)} />
          ))}
        </div>
      </Container>
    </>
  );
}
