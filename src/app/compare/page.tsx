import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CompareTool } from "@/components/tools/CompareTool";
import { ComparePageHeader } from "@/components/tools/ComparePageHeader";
import { getCatalogItem } from "@/lib/catalog-index";
import { NOINDEX_FOLLOW, canonicalFor, pageBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "เปรียบเทียบสินค้า",
  description: "เทียบพอตซิสเต็ม พอตเปลี่ยนหัว หรือพอตใช้แล้วทิ้งได้สูงสุด 4 รุ่น เห็นเฉพาะสเปกที่ยืนยันแล้วและมีครบทุกรุ่น ไม่จัดอันดับว่ารุ่นไหนดีที่สุด",
  // noindex — an interactive selection tool, not unique static content; the real content
  // (individual products) already has its own indexable pages. Canonical to the query-less base
  // path kept as defense in depth against the unbounded `?slugs=...` combination space.
  ...canonicalFor("/compare"),
  ...NOINDEX_FOLLOW,
};

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ slugs?: string }> }) {
  const { slugs } = await searchParams;
  const initialSlugs = (slugs ?? "")
    .split(",")
    .map((s) => s.trim())
    // Validated against the UNIFIED visible catalog (legacy + published ProductMaster) — a
    // published ProductMaster slug in `?slugs=` used to be silently dropped here.
    .filter((s) => Boolean(getCatalogItem(s)))
    .slice(0, 4);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageBreadcrumbJsonLd(metadata.title as string, "/compare")) }} />
      <ComparePageHeader />
      <Container className="py-12 lg:py-16">
        <CompareTool initialSlugs={initialSlugs} />
      </Container>
    </>
  );
}
