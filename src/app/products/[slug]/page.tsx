import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/data/categories";
import { allProducts, getProduct, getProductsByCategory, getRelatedProducts } from "@/data/products";
import { Container } from "@/components/ui/Container";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { ProductHero } from "@/components/product/ProductHero";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductReviewSection } from "@/components/product/ProductReviewSection";
import { ProductAnatomy } from "@/components/product/ProductAnatomy";
import { FeatureGrid } from "@/components/product/FeatureGrid";
import { SpecSheet } from "@/components/product/SpecSheet";
import { CompatibilitySection } from "@/components/product/CompatibilitySection";
import { CompatibleProducts } from "@/components/product/CompatibleProducts";
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
import { ORDERING_ENABLED } from "@/lib/commerce/ordering-mode";

/** JSON-LD `Offer.availability` while online ordering is off (owner 2026-09-07, approved
 *  InStoreOnly): the price stays in structured data so Google keeps showing it, but the offer
 *  no longer claims the product can be bought online — schema.org's InStoreOnly is "available
 *  through a channel other than online", which is what "order on LINE" is. With ordering on,
 *  nothing is added and the offers are exactly what they were. */
const OFFER_AVAILABILITY = ORDERING_ENABLED ? {} : { availability: "https://schema.org/InStoreOnly" };
import { CategoryPageHeader } from "@/components/catalog/CategoryPageHeader";
import { absoluteUrl, breadcrumbJsonLd, canonicalFor, openGraphWithImage } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { categoryName as categoryNameOf } from "@/lib/utils";
import { getCompatibleConsumables, getCompatibleDevices } from "@/data/catalog-relationships";
import { getLegacyApprovedPrice } from "@/data/shipnity-seed/legacy-price-approvals";
import { buildImageDisplayMap } from "@/lib/media-quality";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import type { Product } from "@/types/catalog";
import { PRODUCT_COPY_TH } from "@/i18n/product-copy-th";
import { productTitleTh } from "@/i18n/search-titles";

/** Every image src `PilotProductDetail` could possibly display for this product — the
 *  product-level card, the neutral variant fallback, and each variant's own photo. The variant
 *  picker swaps between these client-side, so the server precomputes display info for all of
 *  them up front rather than just the one shown on first render. See media-quality.ts. */
function storefrontProductImageSrcs(product: StorefrontProductView): (string | undefined)[] {
  return [product.image?.src, product.variantFallbackImage?.src, ...product.variants.map((v) => v.image?.src)];
}

/** Same idea as `storefrontProductImageSrcs`, for the Legacy catalog: every image src
 *  `ProductHero` could possibly display for this product — the card, the lineup ("All Colors")
 *  shot, and each color/flavor variant's own photo. Fixes a real bug (owner-reported, 2026-09-04):
 *  `heroImageDisplayInfo` used to be computed ONLY for the card image, then reused unchanged no
 *  matter which color/flavor the customer selected — so a variant photo smaller than the card
 *  silently inherited the CARD's fill-vs-intrinsic decision and could get force-stretched past its
 *  own real resolution. Precomputing a map for every possible image (mirrors the ProductMaster
 *  side, which never had this bug) and having `ProductHero` look up whichever image is currently
 *  shown fixes it for every legacy product at once, not per-SKU. */
function legacyProductImageSrcs(product: Product): (string | undefined)[] {
  return [
    product.assets.find((a) => a.role === "card")?.src,
    product.lineupImage?.src,
    ...(product.colorVariants ?? []).map((v) => v.image?.src),
    ...(product.flavorVariants ?? []).map((v) => v.image?.src),
  ];
}

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
  // Round 30.3ข: the "English / ไทย" label and Thai lede the Thai page shows (CategoryPageHeader).
  if (category) return { title: category.labelTh, description: category.descriptionTh, ...canonicalFor(path) };

  const product = getProduct(slug);
  if (product) {
    const cardImage = product.assets.find((a) => a.role === "card");
    // Round 30.3ข (owner, 2026-09-11): search-facing text is Thai. The <title> is the model name
    // (English, THAI_STYLE layer 1) plus the locked category word — i18n/search-titles.ts — and
    // the meta description is the Thai shortDescription the page already shows under the English
    // one (ProductHero); English stays the fallback for a product with no Thai copy.
    const title = productTitleTh(product.displayName, product.categoryId);
    const description = PRODUCT_COPY_TH[product.slug]?.shortDescription ?? product.shortDescription;
    return {
      title,
      description,
      ...canonicalFor(path),
      ...(cardImage ? openGraphWithImage({ title, description, path, image: cardImage }) : {}),
    };
  }

  // Published/pilot images only ever come from a real card asset (see storefront-preview-read-
  // model.ts's toView()) — never fabricated, same rule as the legacy branch above.
  const publishedProduct = getPublishedProduct(slug);
  if (publishedProduct) {
    // Same title template as the legacy branch; the tagline (the Thai source line) is the meta.
    const title = productTitleTh(publishedProduct.displayName, publishedProduct.categoryId);
    return {
      title,
      description: publishedProduct.tagline,
      ...canonicalFor(path),
      ...(publishedProduct.image ? openGraphWithImage({ title, description: publishedProduct.tagline ?? undefined, path, image: publishedProduct.image }) : {}),
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
    const isEmptyCategory = products.length === 0 && publishedProducts.length === 0;
    return (
      <>
        <CategoryPageHeader category={category} />
        <Container className="flex flex-col gap-12 py-12 lg:py-16">
          {/* A genuinely published ProductMaster product is a real catalog product — it belongs in
              the SAME grid/filter/sort experience as a legacy one, not a separate "Now Available"
              block underneath (see CatalogBrowser's own doc comment). Still-unpublished DEV-preview
              data stays in its own, clearly-labeled section below — never mixed in. */}
          <CatalogBrowser products={products} publishedProducts={publishedProducts} isEmptyCategory={isEmptyCategory} />
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
        offers: publishedProduct.sellingPrice !== null ? { "@type": "Offer", priceCurrency: "THB", price: publishedProduct.sellingPrice, ...OFFER_AVAILABILITY } : undefined,
      };
      const publishedImageDisplayMap = await buildImageDisplayMap(storefrontProductImageSrcs(publishedProduct));
      const publishedTrail = [
        { name: "Home", path: "/" },
        { name: publishedProduct.categoryName, path: `/products/${publishedProduct.categoryId}` },
        { name: publishedProduct.displayName, path: `/products/${publishedProduct.slug}` },
      ];
      return (
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(publishedJsonLd) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(publishedTrail)) }} />
          <Breadcrumbs trail={publishedTrail} />
          <PilotProductDetail product={publishedProduct} related={getPublishedRelatedProducts(publishedProduct)} imageDisplayMap={publishedImageDisplayMap} orderingEnabled={ORDERING_ENABLED} />
        </>
      );
    }
    const pilotProduct = getPilotProduct(slug);
    if (pilotProduct) {
      const pilotImageDisplayMap = await buildImageDisplayMap(storefrontProductImageSrcs(pilotProduct));
      return <PilotProductDetail product={pilotProduct} related={getPilotRelatedProducts(pilotProduct)} imageDisplayMap={pilotImageDisplayMap} orderingEnabled={ORDERING_ENABLED} />;
    }
    notFound();
  }

  const related = getRelatedProducts(product);
  const brand = getBrand(product.brandId);

  const legacyCardImage = product.assets.find((a) => a.role === "card");
  // Server-side only — reads the real files under public/ to decide, PER IMAGE, whether
  // ProductHero can fill its large box without visibly upscaling. Computed for every image the
  // hero could ever show (card, lineup, each color/flavor) so switching variants client-side never
  // silently reuses another image's fill decision. See src/lib/media-quality.ts and
  // `legacyProductImageSrcs`'s own doc comment for the bug this fixes.
  const heroImageDisplayMap = await buildImageDisplayMap(legacyProductImageSrcs(product));
  const heroImageDisplayInfo = legacyCardImage ? heroImageDisplayMap[legacyCardImage.src] ?? null : null;
  // Owner-approved price (legacy-price-approvals.ts) — null keeps the product browse-only.
  const legacySellingPrice = getLegacyApprovedPrice(product.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.displayName,
    description: product.shortDescription,
    brand: brand ? { "@type": "Brand", name: brand.name } : undefined,
    category: categoryNameOf(product.categoryId),
    image: legacyCardImage ? [absoluteUrl(legacyCardImage.src)] : undefined,
    // `offers` only when an owner-approved price exists (legacy-price-approvals.ts) — the legacy
    // Product type itself still has no price field; never fabricated.
    offers: legacySellingPrice !== null ? { "@type": "Offer", priceCurrency: "THB", price: legacySellingPrice, ...OFFER_AVAILABILITY } : undefined,
  };
  const legacyTrail = [
    { name: "Home", path: "/" },
    { name: categoryNameOf(product.categoryId), path: `/products/${product.categoryId}` },
    { name: product.displayName, path: `/products/${product.slug}` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(legacyTrail)) }} />
      <Breadcrumbs trail={legacyTrail} />
      <ProductHero product={product} sellingPrice={legacySellingPrice} imageDisplayInfo={heroImageDisplayInfo} imageDisplayMap={heroImageDisplayMap} orderingEnabled={ORDERING_ENABLED} />
      <ProductReviewSection product={product} />
      <ProductGallery product={product} />
      {product.isFlagship && <ProductAnatomy product={product} />}
      <FeatureGrid product={product} />
      <SpecSheet product={product} />
      <CompatibilitySection product={product} />
      {/* Structured, clickable compatibility — real catalog products verified to fit, on top of
          (not instead of) the free-text platform facts above. Renders nothing when there are no
          verified links, so an unlinked product's page is unchanged. */}
      <CompatibleProducts direction="works-with" items={getCompatibleConsumables(product.slug)} />
      <CompatibleProducts direction="fits-devices" items={getCompatibleDevices(product.slug)} />
      <ProductFAQ faqs={product.faqs} />
      <RelatedProducts products={related} />
      <SourceNote product={product} />
    </>
  );
}
