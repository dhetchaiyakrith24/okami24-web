import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTechnologyEntry, technologyEntries } from "@/data/technology";
import { getProduct } from "@/data/products";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { ArticleBody } from "@/components/content/ArticleBody";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import type { Product } from "@/types/catalog";
import { canonicalFor } from "@/lib/seo";

export function generateStaticParams() {
  return technologyEntries.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getTechnologyEntry(slug);
  if (!entry) return {};
  return { title: entry.name, description: entry.summary, ...canonicalFor(`/technology/${slug}`) };
}

export default async function TechnologyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getTechnologyEntry(slug);
  if (!entry) notFound();

  const related = entry.relatedProductSlugs
    .map((s) => getProduct(s))
    .filter((p): p is Product => Boolean(p));

  return (
    <>
      <PageHeader eyebrow="Technology" title={entry.name} description={entry.summary} />
      <Container className="max-w-3xl py-12 lg:py-16">
        <ArticleBody sections={entry.body} />
      </Container>
      <RelatedProducts products={related} />
    </>
  );
}
