import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CompareTool } from "@/components/tools/CompareTool";
import { ComparePageHeader } from "@/components/tools/ComparePageHeader";
import { getProduct } from "@/data/products";

export const metadata: Metadata = {
  title: "Compare",
  description: "Compare up to four pod systems, pod kits, or disposables side by side — verified, shared attributes only.",
};

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ slugs?: string }> }) {
  const { slugs } = await searchParams;
  const initialSlugs = (slugs ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => Boolean(getProduct(s)))
    .slice(0, 4);

  return (
    <>
      <ComparePageHeader />
      <Container className="py-12 lg:py-16">
        <CompareTool initialSlugs={initialSlugs} />
      </Container>
    </>
  );
}
