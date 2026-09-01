import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { brands, getBrand } from "@/data/brands";
import { familiesForBrand } from "@/data/families";
import { getProductsByBrand } from "@/data/products";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { getPilotProductsByBrand, getPublishedProductsByBrand } from "@/data/shipnity-seed/storefront-bridge";
import { PilotProductSection } from "@/components/catalog-bridge/PilotProductSection";
import { BrandPageMeta } from "@/components/catalog/BrandPageMeta";
import { canonicalFor } from "@/lib/seo";

export function generateStaticParams() {
  return brands.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }): Promise<Metadata> {
  const { brand: brandSlug } = await params;
  const brand = getBrand(brandSlug);
  if (!brand) return {};
  return { title: brand.name, description: brand.description, ...canonicalFor(`/brands/${brandSlug}`) };
}

export default async function BrandPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: brandSlug } = await params;
  const brand = getBrand(brandSlug);
  if (!brand) notFound();

  const families = familiesForBrand(brand.id);
  const products = getProductsByBrand(brand.id);
  const publishedProducts = getPublishedProductsByBrand(brand.id);
  const pilotProducts = getPilotProductsByBrand(brand.id);

  return (
    <>
      <PageHeader
        eyebrow={brand.tagline}
        title={brand.name}
        description={brand.description}
        meta={<BrandPageMeta families={families} referenceUrl={brand.referenceUrl} />}
      />
      <Container className="flex flex-col gap-12 py-12 lg:py-16">
        <CatalogBrowser products={products} />
        <PilotProductSection products={publishedProducts} variant="published" />
        <PilotProductSection products={pilotProducts} />
      </Container>
    </>
  );
}
