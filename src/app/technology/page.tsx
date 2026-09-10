import type { Metadata } from "next";
import { technologyEntries } from "@/data/technology";
import { Container } from "@/components/ui/Container";
import { TechnologyPageHeader } from "@/components/content/TechnologyPageHeader";
import { TechnologyEntryGrid } from "@/components/content/TechnologyEntryGrid";
import { canonicalFor } from "@/lib/seo";

export const metadata: Metadata = {
  title: "เทคโนโลยีพอต: คอยล์ mesh ชิป และจอทัชสกรีน",
  description: "คอยล์ mesh ต่างจากคอยล์ลวดตรงไหน หัวพอตทรงเดียวรองรับหลายโอห์มได้ยังไง ชิปในเครื่องวัตต์สูงทำอะไร จอทัชสกรีนและการควบคุมด้วยท่าทาง อธิบายแบบเข้าใจง่าย",
  ...canonicalFor("/technology"),
};

export default function TechnologyPage() {
  return (
    <>
      <TechnologyPageHeader />
      <Container className="py-12 lg:py-16">
        <TechnologyEntryGrid entries={technologyEntries} />
      </Container>
    </>
  );
}
