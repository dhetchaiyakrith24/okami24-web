import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { brands, getBrand } from "@/data/brands";
import { familiesForBrand } from "@/data/families";
import { getProductsByBrand } from "@/data/products";
import { Container } from "@/components/ui/Container";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { catalogSearchTexts } from "@/lib/catalog-search-entries";
import { getPilotProductsByBrand, getPublishedProductsByBrand } from "@/data/shipnity-seed/storefront-bridge";
import { PilotProductSection } from "@/components/catalog-bridge/PilotProductSection";
import { BrandPageMeta } from "@/components/catalog/BrandPageMeta";
import { BrandPageHeader } from "@/components/catalog/BrandPageHeader";
import { canonicalFor, collectionPageJsonLd, NOINDEX_FOLLOW, pageBreadcrumbJsonLd } from "@/lib/seo";
import { brandTitleTh } from "@/i18n/search-titles";
import { BRAND_H1, BRAND_HEAD_TH, formatPriceTh } from "@/i18n/search-head-copy";
import { getCatalogItem } from "@/lib/catalog-index";
import { COLLECTION_VIDEOS } from "@/data/collection-videos";
import { CollectionReviewVideo } from "@/components/catalog/CollectionReviewVideo";
import { videoObjectJsonLd } from "@/lib/video-jsonld";
import { getDictionary } from "@/i18n/dictionaries";
import { RelatedArticles } from "@/components/product/RelatedArticles";
import { relatedArticlesForCollection } from "@/lib/article-relevance";

export function generateStaticParams() {
  return brands.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }): Promise<Metadata> {
  const { brand: brandSlug } = await params;
  const brand = getBrand(brandSlug);
  if (!brand) return {};
  // A brand with zero real products right now (legacy or published) is a genuinely empty, thin
  // page — reachable by direct URL (never 404s) but not worth a crawler's time. Not linked from
  // primary navigation either — see brand-visibility.ts. Re-evaluates automatically as soon as the
  // brand gets a real product; never a permanent exclusion.
  const isEmpty = getProductsByBrand(brand.id).length === 0 && getPublishedProductsByBrand(brand.id).length === 0;
  // SEO round ก rows A9–A16 (owner เคาะ 2026-09-21): four brand pages name the models people
  // search for and their prices. The price is read from the catalog index here, at build, through
  // the same source the product page shows — never typed into the copy (owner: 6 of the 8 prices
  // are estimates the stock API will overwrite). No approved price → that fragment is dropped.
  const headOverride = BRAND_HEAD_TH[brandSlug]?.(brandHeadPriceOf);
  if (headOverride && !isEmpty) {
    return {
      title: { absolute: headOverride.title },
      description: headOverride.description,
      ...canonicalFor(`/brands/${brandSlug}`),
    };
  }
  // Round 30.3ข: search-facing text is Thai (see i18n/search-titles.ts). A brand with nothing on
  // the storefront keeps its plain English title/description — the page is noindex anyway and
  // "ของแท้ทุกรุ่นที่ร้านมี" would be an empty promise there.
  return {
    title: isEmpty ? brand.name : brandTitleTh(brand.name),
    description: brand.descriptionTh ?? brand.description,
    ...canonicalFor(`/brands/${brandSlug}`),
    ...(isEmpty ? NOINDEX_FOLLOW : {}),
  };
}

/** Catalog price for the brand-page head copy — the owner-approved selling price the product page
 *  itself shows, formatted with the THAI_STYLE thousands comma; null when there is none. */
function brandHeadPriceOf(slug: string): string | null {
  const price = getCatalogItem(slug)?.sellingPrice ?? null;
  return price === null ? null : formatPriceTh(price);
}

export default async function BrandPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: brandSlug } = await params;
  const brand = getBrand(brandSlug);
  if (!brand) notFound();

  const families = familiesForBrand(brand.id);
  const products = getProductsByBrand(brand.id);
  const publishedProducts = getPublishedProductsByBrand(brand.id);
  const pilotProducts = getPilotProductsByBrand(brand.id);
  // Batch 4: CollectionPage + Home → Brand trail, from the same title/description strings
  // generateMetadata above returns (same isEmpty rule, so an empty brand's schema says what its
  // <title> says). Nothing visible changes.
  const isEmpty = products.length === 0 && publishedProducts.length === 0;
  const brandPath = `/brands/${brandSlug}`;
  const headOverride = isEmpty ? undefined : BRAND_HEAD_TH[brandSlug]?.(brandHeadPriceOf);
  const brandPageName = headOverride?.title ?? (isEmpty ? brand.name : brandTitleTh(brand.name));
  const brandPageDescription = headOverride?.description ?? brand.descriptionTh ?? brand.description;
  // Round "clip": the page's shop clip (if any) + its VideoObject, described from the Thai dictionary like the product page's.
  const clip = isEmpty ? undefined : COLLECTION_VIDEOS[brandPath];
  const collectionSlugs = [...products, ...publishedProducts, ...pilotProducts].map((p) => p.slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd({ name: brandPageName, description: brandPageDescription, path: brandPath })) }} />
      {/* Round 7 "SEO ค" B2: the trail names the brand the way a visible breadcrumb would ("Home →
          SALTHUB"), not the whole <title> with its "— OKami24 (OKM)" suffix — 4 brand pages carried
          the full title here (_incoming/seo-c/keymap.md §3). CollectionPage above keeps the title. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageBreadcrumbJsonLd(brand.name, brandPath)) }} />
      {clip && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoObjectJsonLd(clip, `${clip.channelName} — ${getDictionary("th").product.reviewVideoEyebrow}: ${brand.name}`)) }} />}
      <BrandPageHeader brand={brand} title={BRAND_H1[brandSlug]} meta={<BrandPageMeta families={families} referenceUrl={brand.referenceUrl} />} />
      <Container className="flex flex-col gap-12 py-12 lg:py-16">
        <CatalogBrowser products={products} publishedProducts={publishedProducts} searchTexts={catalogSearchTexts(products, publishedProducts)} isEmptyCategory={products.length === 0 && publishedProducts.length === 0} />
        <PilotProductSection products={pilotProducts} />
        <CollectionReviewVideo video={clip} contextName={brand.name} />
      </Container>
      {/* Round "SEO ง" batch 6: the articles that link this brand or cover its products (article-relevance.ts). */}
      {!isEmpty && (
        <RelatedArticles
          articles={relatedArticlesForCollection(brandPath, collectionSlugs)}
          otherLocaleArticles={relatedArticlesForCollection(brandPath, collectionSlugs, { skipThaiOnly: true })}
        />
      )}
    </>
  );
}
