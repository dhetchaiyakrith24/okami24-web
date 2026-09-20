import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuide, guides } from "@/data/guides";
import { getProduct } from "@/data/products";
import { Container } from "@/components/ui/Container";
import { ArticleBody } from "@/components/content/ArticleBody";
import { GuideDetailPageHeader } from "@/components/content/GuideDetailPageHeader";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import type { Product } from "@/types/catalog";
import { articleJsonLd, canonicalFor, pageBreadcrumbJsonLd } from "@/lib/seo";
import { GUIDES_COPY_TH, GUIDES_COPY_ZH } from "@/i18n/guides-copy";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  // Round 30.3ข (owner, 2026-09-11): <title>/meta are one server-side string — what a crawler
  // reads is the Thai HTML (DEFAULT_LOCALE), so search-facing text is Thai. The Thai title/dek the
  // page already shows as its H1 (GuideDetailPageHeader) is reused here; English stays the
  // fallback for a guide with no Thai copy.
  const th = GUIDES_COPY_TH[guide.id];
  return { title: th?.title ?? guide.title, description: th?.dek ?? guide.dek, ...canonicalFor(`/guides/${slug}`) };
}

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const related = (guide.relatedProductSlugs ?? []).map((s) => getProduct(s)).filter((p): p is Product => Boolean(p));
  // Batch 4: Article + Home → Guide trail from the same Thai title/dek generateMetadata returns.
  const th = GUIDES_COPY_TH[guide.id];
  const guidePath = `/guides/${slug}`;
  const guideTitle = th?.title ?? guide.title;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd({ headline: guideTitle, description: th?.dek ?? guide.dek, path: guidePath })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageBreadcrumbJsonLd(guideTitle, guidePath)) }} />
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
