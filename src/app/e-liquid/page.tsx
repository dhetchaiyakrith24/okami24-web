import type { Metadata } from "next";
import { flavorFamilies } from "@/data/flavors";
import { Container } from "@/components/ui/Container";
import { ELiquidPageHeader, ELiquidDisclaimer } from "@/components/content/ELiquidPageHeader";
import { FlavorFamilyGrid } from "@/components/content/FlavorFamilyGrid";
import { canonicalFor, pageBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "น้ำยา: รู้จักกลุ่มรสชาติก่อนเลือก",
  description: "น้ำยาแบ่งเป็น 5 กลุ่มรสชาติ ผลไม้ เมนทอลและความเย็น ของหวาน เครื่องดื่ม และยาสูบ แต่ละกลุ่มให้รสแบบไหน เหมาะกับใคร ส่วนน้ำยาที่มีขายจริงดูในหมวด E-Liquid",
  ...canonicalFor("/e-liquid"),
};

export default function ELiquidPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageBreadcrumbJsonLd(metadata.title as string, "/e-liquid")) }} />
      <ELiquidPageHeader />
      <Container className="py-12 lg:py-16">
        <FlavorFamilyGrid families={flavorFamilies} />
        <ELiquidDisclaimer />
      </Container>
    </>
  );
}
