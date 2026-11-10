import type { Metadata } from "next";
import { cardTaglinesTh } from "@/lib/card-taglines";
import { allProducts, legacySearchText } from "@/data/products";
import { getPilotProducts, getPublishedProducts, publishedSearchText } from "@/data/shipnity-seed/storefront-bridge";
import { cardOnly } from "@/lib/related-order";
import { Container } from "@/components/ui/Container";
import { SearchTool, type SearchEntry } from "@/components/tools/SearchTool";
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

/** What /search searches, built here on the server so the browser never bundles the catalog modules (T2-50): the search
 *  text from the full record, the card from the card-only one (related-order.ts cardOnly). Same order as before — legacy, then
 *  published; ties keep it. */
function searchEntries(): SearchEntry[] {
  return [
    ...allProducts.map((p) => ({ hit: { kind: "legacy" as const, product: cardOnly(p) }, text: legacySearchText(p) })),
    ...getPublishedProducts().map((p) => ({ hit: { kind: "published" as const, product: p }, text: publishedSearchText(p) })),
  ];
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageBreadcrumbJsonLd(metadata.title as string, "/search")) }} />
      <SearchPageHeader />
      <Container className="py-12 lg:py-16">
        <SearchTool entries={searchEntries()} pilot={getPilotProducts()} initialQuery={q ?? ""} taglinesTh={cardTaglinesTh(allProducts)} />
      </Container>
    </>
  );
}
