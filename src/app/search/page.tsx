import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SearchTool } from "@/components/tools/SearchTool";
import { SearchPageHeader } from "@/components/tools/SearchPageHeader";
import { NOINDEX_FOLLOW, canonicalFor, pageBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "ค้นหาสินค้า",
  description: "ค้นหาสินค้าทั้งหมดของร้านด้วยชื่อรุ่น แบรนด์ หรือตระกูล เช่น Caliburn, VOOPOO หรือ M Bar",
  // noindex — an internal search results page is an unbounded space of thin, query-driven
  // permutations with no unique landing-page value; canonical to the query-less base path is
  // kept as defense in depth, not the primary signal.
  ...canonicalFor("/search"),
  ...NOINDEX_FOLLOW,
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageBreadcrumbJsonLd(metadata.title as string, "/search")) }} />
      <SearchPageHeader />
      <Container className="py-12 lg:py-16">
        <SearchTool initialQuery={q ?? ""} />
      </Container>
    </>
  );
}
