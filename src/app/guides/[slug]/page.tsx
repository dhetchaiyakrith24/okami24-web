import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuide, guides } from "@/data/guides";
import { getProduct } from "@/data/products";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { ArticleBody } from "@/components/content/ArticleBody";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import type { Product } from "@/types/catalog";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return { title: guide.title, description: guide.dek };
}

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const related = (guide.relatedProductSlugs ?? []).map((s) => getProduct(s)).filter((p): p is Product => Boolean(p));

  return (
    <>
      <PageHeader
        eyebrow={`Guide · ${guide.readingTimeMin} min read`}
        title={guide.title}
        description={guide.dek}
      />
      <Container className="max-w-3xl py-12 lg:py-16">
        <ArticleBody sections={guide.body} />
      </Container>
      <RelatedProducts products={related} />
    </>
  );
}
