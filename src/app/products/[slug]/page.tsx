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
import {
  getPilotProduct,
  getPilotProducts,
  getPilotProductsByCategory,
  getPilotRelatedProducts,
  getPublishedProduct,
  getPublishedProducts,
  getPublishedProductsByCategory,
  getPublishedRelatedProducts,
} from "@/data/shipnity-seed/storefront-bridge";
import { PilotProductSection } from "@/components/catalog-bridge/PilotProductSection";
import { PilotProductDetail } from "@/components/catalog-bridge/PilotProductDetail";
import { CategoryPageHeader } from "@/components/catalog/CategoryPageHeader";
import { absoluteUrl, canonicalFor, openGraphWithImage } from "@/lib/seo";
import { categoryName as categoryNameOf } from "@/lib/utils";

export function generateStaticParams() {
  // `getPilotProducts()` returns [] whenever NODE_ENV === "production" (see storefront-bridge.ts)
  // — so a production `next build` never statically generates DEV-preview-only slugs, matching
  // the legacy catalog's own build-time-only generation. `getPublishedProducts()` is NOT
  // environment-gated — a genuinely published product is statically generated in every build,
  // dev and production alike, exactly like a legacy product.
  return [
    ...categories.map((c) => ({ slug: c.slug })),
    ...allProducts.map((p) => ({ slug: p.slug })),
    ...getPublishedProducts().map((p) => ({ slug: p.slug })),
    ...getPilotProducts().map((p) => ({ slug: p.slug })),
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const path = `/products/${slug}`;
  const category = getCategory(slug);
  if (category) return { title: category.name, description: category.description, ...canonicalFor(path) };

  const product = getProduct(slug);
  if (product) {
    const cardImage = product.assets.find((a) => a.role === "card");
    return {
      title: product.displayName,
      description: product.shortDescription,
      ...canonicalFor(path),
      ...(cardImage ? openGraphWithImage({ title: product.displayName, description: product.shortDescription, path, image: cardImage }) : {}),
    };
  }

  // Published/pilot images only ever come from a real card asset (see storefront-preview-read-
  // model.ts's toView()) — never fabricated, same rule as the legacy branch above.
  const publishedProduct = getPublishedProduct(slug);
  if (publishedProduct) {
    return {
      title: publishedProduct.displayName,
      description: publishedProduct.tagline,
      ...canonicalFor(path),
      ...(publishedProduct.image ? openGraphWithImage({ title: publishedProduct.displayName, description: publishedProduct.tagline ?? undefined, path, image: publishedProduct.image }) : {}),
    };
  }
  const pilotProduct = getPilotProduct(slug);
  if (pilotProduct) {
    return {
      title: pilotProduct.displayName,
      description: pilotProduct.tagline,
      robots: { index: false, follow: false }, // DEV-only preview data — never real customer-facing content, even though the production notFound() gate already keeps it out of any real build.
      ...(pilotProduct.image ? openGraphWithImage({ title: pilotProduct.displayName, description: pilotProduct.tagline ?? undefined, path, image: pilotProduct.image }) : {}),
    };
  }
  return {};
}

export default async function ProductOrCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const category = getCategory(slug);
  if (category) {
    const products = getProductsByCategory(category.id);
    const publishedProducts = getPublishedProductsByCategory(category.id);
    const pilotProducts = getPilotProductsByCategory(category.id);
    const isEmptyCategory = products.length === 0 && publishedProducts.length === 0 && pilotProducts.length === 0;
    return (
      <>
        <CategoryPageHeader category={category} />
        <Container className="flex flex-col gap-12 py-12 lg:py-16">
          {(products.length > 0 || isEmptyCategory) && <CatalogBrowser products={products} isEmptyCategory={products.length === 0} />}
          <PilotProductSection products={publishedProducts} variant="published" />
          <PilotProductSection products={pilotProducts} />
        </Container>
      </>
    );
  }

  const product = getProduct(slug);
  if (!product) {
    const publishedProduct = getPublishedProduct(slug);
    if (publishedProduct) {
      // Same schema.org shape as the legacy branch below — a published ProductMaster product is
      // a real product page and deserves the same structured-data completeness.
      const publishedJsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: publishedProduct.displayName,
        description: publishedProduct.tagline,
        brand: { "@type": "Brand", name: publishedProduct.brandName },
        category: categoryNameOf(publishedProduct.categoryId),
        image: publishedProduct.image ? [absoluteUrl(publishedProduct.image.src)] : undefined,
        // Only a genuinely published product has an owner-approved price — never fabricated from
        // priceReference (see buildPublishedCatalog()'s own readiness gate).
        offers: publishedProduct.sellingPrice !== null ? { "@type": "Offer", priceCurrency: "THB", price: publishedProduct.sellingPrice } : undefined,
      };
      return (
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(publishedJsonLd) }} />
          <PilotProductDetail product={publishedProduct} related={getPublishedRelatedProducts(publishedProduct)} />
        </>
      );
    }
    const pilotProduct = getPilotProduct(slug);
    if (pilotProduct) {
      return <PilotProductDetail product={pilotProduct} related={getPilotRelatedProducts(pilotProduct)} />;
    }
    notFound();
  }

  const related = getRelatedProducts(product);
  const brand = getBrand(product.brandId);

  const legacyCardImage = product.assets.find((a) => a.role === "card");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.displayName,
    description: product.shortDescription,
    brand: brand ? { "@type": "Brand", name: brand.name } : undefined,
    category: categoryNameOf(product.categoryId),
    image: legacyCardImage ? [absoluteUrl(legacyCardImage.src)] : undefined,
    // No `offers` here — the legacy catalog has no price field at all (see docs/BUSINESS_SOURCE_OF_TRUTH.md);
    // never fabricated.
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
