import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTechnologyEntry, technologyEntries } from "@/data/technology";
import { getProduct } from "@/data/products";
import { Container } from "@/components/ui/Container";
import { ArticleBody } from "@/components/content/ArticleBody";
import { TechnologyEntryPageHeader } from "@/components/content/TechnologyEntryPageHeader";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import type { Product } from "@/types/catalog";
import { articleJsonLd, canonicalFor, pageBreadcrumbJsonLd } from "@/lib/seo";
import { articleFaqJsonLd, articleVideoJsonLd } from "@/lib/article-jsonld";
import { TECHNOLOGY_COPY_TH, TECHNOLOGY_COPY_ZH } from "@/i18n/technology-copy";
import { TECHNOLOGY_DESCRIPTION_HEAD_TH } from "@/i18n/search-head-copy";

export function generateStaticParams() {
  return technologyEntries.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getTechnologyEntry(slug);
  if (!entry) return {};
  // Round 30.3ข: search-facing text is Thai (see guides/[slug]/page.tsx) — the same Thai name/
  // summary the page shows as its H1 and lede, English as the fallback.
  const th = TECHNOLOGY_COPY_TH[entry.id];
  // SEO round ก row C19 (owner เคาะ 2026-09-21): head-only description override; the summary on
  // the page is unchanged.
  return { title: th?.name ?? entry.name, description: TECHNOLOGY_DESCRIPTION_HEAD_TH[entry.id] ?? th?.summary ?? entry.summary, ...canonicalFor(`/technology/${slug}`) };
}

export default async function TechnologyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getTechnologyEntry(slug);
  if (!entry) notFound();

  const related = entry.relatedProductSlugs
    .map((s) => getProduct(s))
    .filter((p): p is Product => Boolean(p));

  // Batch 4: Article + Home → Technology trail from the same Thai name/summary generateMetadata returns.
  const th = TECHNOLOGY_COPY_TH[entry.id];
  const entryPath = `/technology/${slug}`;
  const entryTitle = th?.name ?? entry.name;
  // Round SEO ข: same optional FAQPage / VideoObject blocks as the guide page (see article-jsonld.ts).
  const faqJsonLd = articleFaqJsonLd(th?.faq ?? entry.faq);
  const videoJsonLd = articleVideoJsonLd(entry.reviewVideo, entryTitle);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd({ headline: entryTitle, description: TECHNOLOGY_DESCRIPTION_HEAD_TH[entry.id] ?? th?.summary ?? entry.summary, path: entryPath })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageBreadcrumbJsonLd(entryTitle, entryPath)) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      {videoJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }} />}
      <TechnologyEntryPageHeader id={entry.id} title={entry.name} description={entry.summary} />
      <Container className="max-w-3xl py-12 lg:py-16">
        <ArticleBody
          sections={entry.body}
          translated={{ th: TECHNOLOGY_COPY_TH[entry.id]?.body, zh: TECHNOLOGY_COPY_ZH[entry.id]?.body }}
          faq={entry.faq}
          translatedFaq={{ th: TECHNOLOGY_COPY_TH[entry.id]?.faq, zh: TECHNOLOGY_COPY_ZH[entry.id]?.faq }}
          video={entry.reviewVideo}
        />
      </Container>
      <RelatedProducts products={related} />
    </>
  );
}
