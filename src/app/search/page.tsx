import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SearchTool } from "@/components/tools/SearchTool";
import { SearchPageHeader } from "@/components/tools/SearchPageHeader";
import { canonicalFor, NOINDEX_FOLLOW } from "@/lib/seo";

export const metadata: Metadata = {
  title: "ค้นหาสินค้า",
  description: "ค้นหาสินค้าทั้งหมดของร้านด้วยชื่อรุ่น แบรนด์ หรือคุณสมบัติ เช่น Caliburn, VOOPOO หรือหน้าจอสัมผัส",
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
      <SearchPageHeader />
      <Container className="py-12 lg:py-16">
        <SearchTool initialQuery={q ?? ""} />
      </Container>
    </>
  );
}
