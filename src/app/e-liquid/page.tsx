import type { Metadata } from "next";
import { flavorFamilies } from "@/data/flavors";
import { Container } from "@/components/ui/Container";
import { ELiquidPageHeader, ELiquidDisclaimer } from "@/components/content/ELiquidPageHeader";
import { FlavorFamilyGrid } from "@/components/content/FlavorFamilyGrid";
import { canonicalFor, pageBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "น้ำยา: รู้จักกลุ่มรสชาติก่อนเลือก",
  // Round 7 "SEO ค" B2: the old tail pointed at the E-Liquid category, which the share-deadend round
  // hid because it is empty — a search snippet must not send people to a listing that does not
  // exist. Wording = thai-copy row E (2026-09-23).
  description: "น้ำยาแบ่งเป็น 5 กลุ่มรสชาติ ผลไม้ เมนทอลและความเย็น ของหวาน เครื่องดื่ม และยาสูบ แต่ละกลุ่มให้รสแบบไหน เหมาะกับใคร ยังไม่มีขายหน้าร้าน ถามทาง LINE @okm24 ได้",
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
