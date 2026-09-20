import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { FinderTool } from "@/components/tools/FinderTool";
import { FinderPageHeader } from "@/components/tools/FinderPageHeader";
import { NOINDEX_FOLLOW, canonicalFor, pageBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "ตัวช่วยเลือกสินค้า",
  description: "ตอบ 6 คำถามสั้น ๆ ระบบจะเลือกรุ่นที่ตรงกับคุณจากสินค้าจริงในร้าน พร้อมบอกเหตุผลว่าทำไมถึงเหมาะ",
  // noindex — a personalized quiz tool whose output depends on the visitor's answers; the tool
  // shell itself has no unique static content to rank on.
  ...canonicalFor("/finder"),
  ...NOINDEX_FOLLOW,
};

export default function FinderPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageBreadcrumbJsonLd(metadata.title as string, "/finder")) }} />
      <FinderPageHeader />
      <Container className="py-12 lg:py-20">
        <FinderTool />
      </Container>
    </>
  );
}
