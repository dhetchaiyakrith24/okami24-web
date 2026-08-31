import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SearchTool } from "@/components/tools/SearchTool";
import { SearchPageHeader } from "@/components/tools/SearchPageHeader";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the OKami24 catalog by product name, brand, family, category, or feature.",
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
