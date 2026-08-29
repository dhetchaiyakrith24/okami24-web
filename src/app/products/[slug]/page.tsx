import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/data/categories";
import { allProducts, getProduct, getProductsByCategory, getRelatedProducts } from "@/data/products";
import { PageHeader } from "@/components/ui/PageHeader";
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

export function generateStaticParams() {
  return [...categories.map((c) => ({ slug: c.slug })), ...allProducts.map((p) => ({ slug: p.slug }))];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (category) return { title: category.name, description: category.description };
  const product = getProduct(slug);
  if (product) return { title: product.displayName, description: product.shortDescription };
  return {};
}

export default async function ProductOrCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const category = getCategory(slug);
  if (category) {
    const products = getProductsByCategory(category.id);
    return (
      <>
        <PageHeader eyebrow="Catalog" title={category.name} description={category.description} />
        <Container className="py-12 lg:py-16">
          <CatalogBrowser
            products={products}
            emptyStateNote={products.length === 0 ? "No products are catalogued in this category yet — check back as the catalog grows." : undefined}
          />
        </Container>
      </>
    );
  }

  const product = getProduct(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);

  return (
    <>
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
