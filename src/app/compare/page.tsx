import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CompareTool } from "@/components/tools/CompareTool";
import { ComparePageHeader } from "@/components/tools/ComparePageHeader";
import { getProduct } from "@/data/products";
import { canonicalFor, NOINDEX_FOLLOW } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Compare",
  description: "Compare up to four pod systems, pod kits, or disposables side by side — verified, shared attributes only.",
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
