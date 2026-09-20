import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { brands, getBrand } from "@/data/brands";
import { familiesForBrand } from "@/data/families";
import { getProductsByBrand } from "@/data/products";
import { Container } from "@/components/ui/Container";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { getPilotProductsByBrand, getPublishedProductsByBrand } from "@/data/shipnity-seed/storefront-bridge";
import { PilotProductSection } from "@/components/catalog-bridge/PilotProductSection";
import { BrandPageMeta } from "@/components/catalog/BrandPageMeta";
import { BrandPageHeader } from "@/components/catalog/BrandPageHeader";
import { canonicalFor, collectionPageJsonLd, NOINDEX_FOLLOW, pageBreadcrumbJsonLd } from "@/lib/seo";
import { brandTitleTh } from "@/i18n/search-titles";

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
  const brandPageName = isEmpty ? brand.name : brandTitleTh(brand.name);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd({ name: brandPageName, description: brand.descriptionTh ?? brand.description, path: brandPath })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageBreadcrumbJsonLd(brandPageName, brandPath)) }} />
      <BrandPageHeader brand={brand} meta={<BrandPageMeta families={families} referenceUrl={brand.referenceUrl} />} />
      <Container className="flex flex-col gap-12 py-12 lg:py-16">
        <CatalogBrowser products={products} publishedProducts={publishedProducts} isEmptyCategory={products.length === 0 && publishedProducts.length === 0} />
        <PilotProductSection products={pilotProducts} />
      </Container>
    </>
  );
}
