import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTechnologyEntry, technologyEntries } from "@/data/technology";
import { getProduct } from "@/data/products";
import { Container } from "@/components/ui/Container";
import { ArticleBody } from "@/components/content/ArticleBody";
import { TechnologyEntryPageHeader } from "@/components/content/TechnologyEntryPageHeader";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import type { Product } from "@/types/catalog";
import { canonicalFor } from "@/lib/seo";
import { TECHNOLOGY_COPY_TH, TECHNOLOGY_COPY_ZH } from "@/i18n/technology-copy";

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
  return { title: th?.name ?? entry.name, description: th?.summary ?? entry.summary, ...canonicalFor(`/technology/${slug}`) };
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
      <TechnologyEntryPageHeader id={entry.id} title={entry.name} description={entry.summary} />
      <Container className="max-w-3xl py-12 lg:py-16">
        <ArticleBody
          sections={entry.body}
          translated={{ th: TECHNOLOGY_COPY_TH[entry.id]?.body, zh: TECHNOLOGY_COPY_ZH[entry.id]?.body }}
        />
      </Container>
      <RelatedProducts products={related} />
    </>
  );
}
