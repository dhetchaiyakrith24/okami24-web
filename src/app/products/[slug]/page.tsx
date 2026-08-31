import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/data/categories";
import { allProducts, getProduct, getProductsByCategory, getRelatedProducts } from "@/data/products";
import { Container } from "@/components/ui/Container";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { ProductHero } from "@/components/product/ProductHero";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductAnatomy } from "@/components/product/ProductAnatomy";
import { FeatureGrid } from "@/components/product/FeatureGrid";
import { SpecSheet } from "@/components/product/SpecSheet";
import { CompatibilitySection } from "@/components/product/CompatibilitySection";
import { ProductFAQ } from "@/components/product/ProductFAQ";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { SourceNote } from "@/components/product/SourceNote";
import { getBrand } from "@/data/brands";
import { getPilotProduct, getPilotProducts, getPilotProductsByCategory, getPilotRelatedProducts } from "@/data/shipnity-seed/storefront-bridge";
import { PilotProductSection } from "@/components/catalog-bridge/PilotProductSection";
import { PilotProductDetail } from "@/components/catalog-bridge/PilotProductDetail";
import { CategoryPageHeader } from "@/components/catalog/CategoryPageHeader";

export function generateStaticParams() {
  // `getPilotProducts()` returns [] whenever NODE_ENV === "production" (see storefront-bridge.ts)
  // — so a production `next build` never statically generates these 5 slugs, matching the legacy
  // catalog's own build-time-only generation.
  return [
    ...categories.map((c) => ({ slug: c.slug })),
    ...allProducts.map((p) => ({ slug: p.slug })),
    ...getPilotProducts().map((p) => ({ slug: p.slug })),
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (category) return { title: category.name, description: category.description };
  const product = getProduct(slug);
  if (product) return { title: product.displayName, description: product.shortDescription };
  const pilotProduct = getPilotProduct(slug);
  if (pilotProduct) return { title: pilotProduct.displayName, description: pilotProduct.tagline };
  return {};
}

export default async function ProductOrCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const category = getCategory(slug);
  if (category) {
    const products = getProductsByCategory(category.id);
    const pilotProducts = getPilotProductsByCategory(category.id);
    return (
      <>
        <CategoryPageHeader category={category} />
        <Container className="flex flex-col gap-12 py-12 lg:py-16">
          {(products.length > 0 || pilotProducts.length === 0) && (
            <CatalogBrowser products={products} isEmptyCategory={products.length === 0} />
          )}
          <PilotProductSection products={pilotProducts} />
        </Container>
      </>
    );
  }

  const product = getProduct(slug);
  if (!product) {
    const pilotProduct = getPilotProduct(slug);
    if (pilotProduct) {
      return <PilotProductDetail product={pilotProduct} related={getPilotRelatedProducts(pilotProduct)} />;
    }
    notFound();
  }

  const related = getRelatedProducts(product);
  const brand = getBrand(product.brandId);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.displayName,
    description: product.shortDescription,
    brand: brand ? { "@type": "Brand", name: brand.name } : undefined,
    category: product.categoryId,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductHero product={product} />
      <ProductGallery product={product} />
      {product.isFlagship && <ProductAnatomy product={product} />}
      <FeatureGrid product={product} />
      <SpecSheet product={product} />
      <CompatibilitySection product={product} />
      <ProductFAQ faqs={product.faqs} />
      <RelatedProducts products={related} />
      <SourceNote product={product} />
    </>
  );
}
