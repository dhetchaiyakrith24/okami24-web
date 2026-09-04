import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuide, guides } from "@/data/guides";
import { getProduct } from "@/data/products";
import { Container } from "@/components/ui/Container";
import { ArticleBody } from "@/components/content/ArticleBody";
import { GuideDetailPageHeader } from "@/components/content/GuideDetailPageHeader";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import type { Product } from "@/types/catalog";
import { canonicalFor } from "@/lib/seo";
import { GUIDES_COPY_TH, GUIDES_COPY_ZH } from "@/i18n/guides-copy";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return { title: guide.title, description: guide.dek, ...canonicalFor(`/guides/${slug}`) };
}

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const related = (guide.relatedProductSlugs ?? []).map((s) => getProduct(s)).filter((p): p is Product => Boolean(p));

  return (
    <>
      <GuideDetailPageHeader id={guide.id} title={guide.title} dek={guide.dek} readingTimeMin={guide.readingTimeMin} />
      <Container className="max-w-3xl py-12 lg:py-16">
        <ArticleBody
          sections={guide.body}
          translated={{ th: GUIDES_COPY_TH[guide.id]?.body, zh: GUIDES_COPY_ZH[guide.id]?.body }}
        />
      </Container>
      <RelatedProducts products={related} />
    </>
  );
}
