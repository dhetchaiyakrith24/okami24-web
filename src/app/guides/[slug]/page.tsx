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
import { articleFaqJsonLd, articleVideoJsonLd } from "@/lib/article-jsonld";
import { GUIDES_COPY_TH, GUIDES_COPY_ZH } from "@/i18n/guides-copy";
import { GUIDE_DESCRIPTION_HEAD_TH } from "@/i18n/search-head-copy";

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
  // SEO round ก rows C17/C18 (owner เคาะ 2026-09-21): a head-only description where the table
  // gave one; the dek the page shows is unchanged.
  return { title: th?.title ?? guide.title, description: GUIDE_DESCRIPTION_HEAD_TH[guide.id] ?? th?.dek ?? guide.dek, ...canonicalFor(`/guides/${slug}`) };
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
  // Round SEO ข: FAQPage from the Thai Q/A (falls back to English only when no Thai copy exists —
  // same rule as the body) and VideoObject for the article's one confirmed clip. Both null when the
  // record has no such field, so an article without them emits exactly the two blocks above.
  const faqJsonLd = articleFaqJsonLd(th?.faq ?? guide.faq);
  const videoJsonLd = articleVideoJsonLd(guide.reviewVideo, guideTitle);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd({ headline: guideTitle, description: GUIDE_DESCRIPTION_HEAD_TH[guide.id] ?? th?.dek ?? guide.dek, path: guidePath })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageBreadcrumbJsonLd(guideTitle, guidePath)) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      {videoJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }} />}
      <GuideDetailPageHeader id={guide.id} title={guide.title} dek={guide.dek} readingTimeMin={guide.readingTimeMin} />
      <Container className="max-w-3xl py-12 lg:py-16">
        <ArticleBody
          sections={guide.body}
          translated={{ th: GUIDES_COPY_TH[guide.id]?.body, zh: GUIDES_COPY_ZH[guide.id]?.body }}
          faq={guide.faq}
          translatedFaq={{ th: GUIDES_COPY_TH[guide.id]?.faq, zh: GUIDES_COPY_ZH[guide.id]?.faq }}
          video={guide.reviewVideo}
        />
      </Container>
      <RelatedProducts products={related} />
    </>
  );
}
