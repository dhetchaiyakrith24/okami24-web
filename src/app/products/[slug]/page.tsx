import type { Metadata } from "next";
import { inStockEntryKeys } from "@/lib/in-stock";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/data/categories";
import { allProducts, getProduct, getProductsByCategory, getRelatedProducts } from "@/data/products";
import { Container } from "@/components/ui/Container";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { catalogSearchTexts } from "@/lib/catalog-search-entries";
import { ProductHero } from "@/components/product/ProductHero";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductReviewSection } from "@/components/product/ProductReviewSection";
import { ProductAnatomy } from "@/components/product/ProductAnatomy";
import { FeatureGrid } from "@/components/product/FeatureGrid";
import { ProductMoreDetails } from "@/components/product/ProductMoreDetails";
import { productDetailsCopy } from "@/lib/product-details-copy";
import { SpecSheet } from "@/components/product/SpecSheet";
import { CompatibilitySection } from "@/components/product/CompatibilitySection";
import { CompatibleProducts } from "@/components/product/CompatibleProducts";
import { ProductFAQ } from "@/components/product/ProductFAQ";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { RelatedArticles } from "@/components/product/RelatedArticles";
import { SourceNote } from "@/components/product/SourceNote";
import { EditorialClip, ProductEditorialFaq, ProductEditorialMain } from "@/components/product/ProductEditorial";
import { PRODUCT_EDITORIAL } from "@/data/product-editorial";
import { articleFaqJsonLd } from "@/lib/article-jsonld";
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
/** Every Offer names the shop as `seller` by `@id` (SEO round ก, 2026-09-21) so Google ties the
 *  53 product offers to the one Organization node on the homepage instead of treating them as
 *  offers from nobody — GSC's "merchant listing" report was flagging exactly that gap. */
const OFFER_SELLER = { seller: organizationRef() };
/** shippingDetails + hasMerchantReturnPolicy on every Offer (batch 4) — BSOT §10/§12 facts only,
 *  built once in seo.ts so the two Product branches below cannot drift apart. */
const OFFER_MERCHANT = offerMerchantFields();

/** The Thai description line of a legacy product — head-only override (SEO round ก) → Thai copy
 *  overlay (round 30.3ข) → English source as the last fallback. One chain for the meta
 *  description AND the Product JSON-LD so the two never disagree (round 7 "SEO ค" B2). */
function legacyBaseDescriptionTh(product: Product): string {
  return PRODUCT_DESCRIPTION_HEAD_TH[product.slug] ?? PRODUCT_COPY_TH[product.slug]?.shortDescription ?? product.shortDescription;
}
import { CategoryPageHeader } from "@/components/catalog/CategoryPageHeader";
import { COLLECTION_VIDEOS } from "@/data/collection-videos";
import { CollectionReviewVideo } from "@/components/catalog/CollectionReviewVideo";
import { CategoryGuide } from "@/components/catalog/CategoryGuide";
import { CATEGORY_GUIDE_COPY } from "@/i18n/category-guide-copy";
import { categorySpecRows } from "@/lib/category-spec-table";
import { videoObjectJsonLd } from "@/lib/video-jsonld";
import { getDictionary } from "@/i18n/dictionaries";
import { absoluteUrl, breadcrumbJsonLd, canonicalFor, collectionPageJsonLd, NOINDEX_FOLLOW, offerMerchantFields, openGraphWithImage, organizationRef, pageBreadcrumbJsonLd } from "@/lib/seo";
import { categoriesWithProducts, categoryIsEmpty } from "@/lib/category-visibility";
import { relatedArticlesForCollection, relatedArticlesForLegacy, relatedArticlesForPublished } from "@/lib/article-relevance";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PilotNameText } from "@/components/catalog-bridge/PilotNameText";
import { categoryName as categoryNameOf } from "@/lib/utils";
import { getCompatibleConsumables, getCompatibleDevices } from "@/data/catalog-relationships";
import { getLegacyApprovedPrice } from "@/data/shipnity-seed/legacy-price-approvals";
import { buildImageDisplayMap } from "@/lib/media-quality";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import type { Product } from "@/types/catalog";
import { PRODUCT_COPY_TH } from "@/i18n/product-copy-th";
import { productTitleTh } from "@/i18n/search-titles";
import { lineOrderCodes } from "@/lib/line-order-codes";
import { HashLinksKeepHistory } from "@/components/product/HashLinksKeepHistory";
import { NO_GENUINE_CLAIM_PATHS } from "@/lib/genuine-claim";
import { categoryTitleTh, PRODUCT_DESCRIPTION_HEAD_TH, PRODUCT_TITLE_HEAD_TH, productTitleWithPriceTh, shareTitleWithPriceTh, withPriceSuffixTh } from "@/i18n/search-head-copy";

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
    product.lineupImage2?.src,
    ...(product.colorVariants ?? []).map((v) => v.image?.src),
    ...(product.flavorVariants ?? []).map((v) => v.image?.src),
  ];
}

/** The option photos that carry their own studio floor — only these need the body measurement (OptionScaledCard). */
function legacyOwnFloorSrcs(product: Product): (string | undefined)[] {
  return [...(product.colorVariants ?? []), ...(product.flavorVariants ?? [])].map((v) => (v.image?.ownFloor ? v.image.src : undefined));
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
  // Round "share-deadend" batch 2 (2026-09-22): a category with nothing in it is the same thin,
  // empty page an empty brand page is, and gets the same treatment — noindex, and out of the
  // navigation and the sitemap (src/lib/category-visibility.ts). The page itself keeps working.
  // Round 7 "SEO ค" B2: the <title> gains " ของแท้ บอกราคาทุกรุ่น" after the locked label (categoryTitleTh);
  // the lede/description and the H1 are unchanged.
  if (category) return { title: categoryTitleTh(category.labelTh, category.id), description: category.descriptionTh, ...canonicalFor(path), ...(categoryIsEmpty(category.id) ? NOINDEX_FOLLOW : {}) };

  const product = getProduct(slug);
  if (product) {
    const cardImage = product.assets.find((a) => a.role === "card");
    // Round 30.3ข (owner, 2026-09-11): search-facing text is Thai. The <title> is the model name
    // (English, THAI_STYLE layer 1) plus the locked category word — i18n/search-titles.ts — and
    // the meta description is the Thai shortDescription the page already shows under the English
    // one (ProductHero); English stays the fallback for a product with no Thai copy.
    // Round 7 "SEO ค" B2: a per-slug title override where thai-copy's table gave one, then the
    // catalog price on the title line for the pages not on the 2026-10-05 hold list
    // (productTitleWithPriceTh); og:title keeps its own price rule below.
    const legacyPrice = getLegacyApprovedPrice(product.slug);
    const baseTitle = PRODUCT_TITLE_HEAD_TH[product.slug] ?? productTitleTh(product.displayName, product.categoryId);
    const title = productTitleWithPriceTh(product.slug, baseTitle, legacyPrice);
    // SEO round ก (owner เคาะ 2026-09-21): a head-only override where the table gave one
    // (search-head-copy.ts), then the B2 price line — price from the same approval the page
    // shows, appended only when one exists, kept inside 160 characters (withPriceSuffixTh).
    const baseDescription = legacyBaseDescriptionTh(product);
    const description = withPriceSuffixTh(baseDescription, getLegacyApprovedPrice(product.slug));
    return {
      title,
      description,
      ...canonicalFor(path),
      // Round "backlink" batch 2 (owner 2026-09-22): the card an admin sends on LINE carries the
      // price on its title line, the way the brand cards do — same catalog number, <title> untouched.
      ...(cardImage ? openGraphWithImage({ title: shareTitleWithPriceTh(baseTitle, legacyPrice), description, path, image: cardImage }) : {}),
    };
  }

  // Published/pilot images only ever come from a real card asset (see storefront-preview-read-
  // model.ts's toView()) — never fabricated, same rule as the legacy branch above.
  const publishedProduct = getPublishedProduct(slug);
  if (publishedProduct) {
    // Same title template as the legacy branch; the tagline (the Thai source line) is the meta.
    const baseTitle = PRODUCT_TITLE_HEAD_TH[publishedProduct.slug] ?? productTitleTh(publishedProduct.displayName, publishedProduct.categoryId);
    const title = productTitleWithPriceTh(publishedProduct.slug, baseTitle, publishedProduct.sellingPrice);
    // Same head-only override + B2 price line as the legacy branch above.
    const baseDescription = PRODUCT_DESCRIPTION_HEAD_TH[publishedProduct.slug] ?? publishedProduct.tagline ?? undefined;
    const description = baseDescription === undefined ? undefined : withPriceSuffixTh(baseDescription, publishedProduct.sellingPrice, !NO_GENUINE_CLAIM_PATHS.has(path));
    return {
      title,
      description,
      ...canonicalFor(path),
      ...(publishedProduct.image ? openGraphWithImage({ title: shareTitleWithPriceTh(baseTitle, publishedProduct.sellingPrice), description, path, image: publishedProduct.image }) : {}),
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
    const categoryPath = `/products/${category.slug}`;
    // Round "clip": the page's shop clip (if any) + its VideoObject (src/data/collection-videos.ts).
    const clip = isEmptyCategory ? undefined : COLLECTION_VIDEOS[categoryPath];
    const collectionSlugs = [...products, ...publishedProducts, ...pilotProducts].map((p) => p.slug);
    // Round SEO pod (30/10): a category with an entry in CATEGORY_GUIDE_COPY gets the text block under its grid, its FAQPage
    // (the Thai Q/A it shows) and the listed models as the CollectionPage's ItemList. Other categories are unchanged.
    const guideCopy = isEmptyCategory ? undefined : CATEGORY_GUIDE_COPY[category.id];
    const guideFaqJsonLd = guideCopy?.th ? articleFaqJsonLd(guideCopy.th.faq) : null;
    const listItems = guideCopy ? [...products, ...publishedProducts].map((p) => ({ name: p.displayName, path: `/products/${p.slug}` })) : undefined;
    return (
      <>
        {/* Batch 4: the same Thai title/lede generateMetadata returns for this page, as schema —
            CollectionPage + the Home → Category trail. No visible change. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd({ name: category.labelTh, description: category.descriptionTh, path: categoryPath, items: listItems })) }} />
        {guideFaqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideFaqJsonLd) }} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageBreadcrumbJsonLd(category.labelTh, categoryPath)) }} />
        {clip && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoObjectJsonLd(clip, `${clip.channelName} — ${getDictionary("th").product.reviewVideoEyebrow}: ${category.labelTh}`)) }} />}
        <CategoryPageHeader category={category} />
        <Container className="flex flex-col gap-12 py-12 lg:py-16">
          {/* A genuinely published ProductMaster product is a real catalog product — it belongs in
              the SAME grid/filter/sort experience as a legacy one, not a separate "Now Available"
              block underneath (see CatalogBrowser's own doc comment). Still-unpublished DEV-preview
              data stays in its own, clearly-labeled section below — never mixed in. */}
          <CatalogBrowser
            products={products}
            publishedProducts={publishedProducts}
            searchTexts={catalogSearchTexts(products, publishedProducts)}
            isEmptyCategory={isEmptyCategory}
            // Round "share-deadend" batch 2 (2026-09-22): an empty category offers the ones that
            // do have something instead of ending the visit. Read from the catalog, so it needs
            // no upkeep and makes no promise about this category.
            alternativeCategories={isEmptyCategory ? categoriesWithProducts() : []}
            inStockKeys={inStockEntryKeys(products, publishedProducts)}
          />
          <PilotProductSection products={pilotProducts} />
          <CollectionReviewVideo video={clip} contextName={category.name} />
        </Container>
        {guideCopy && <CategoryGuide copy={guideCopy} rows={categorySpecRows(products)} />}
        {/* Round "SEO ง" batch 6: the articles that link this category or cover its products (article-relevance.ts). */}
        {!isEmptyCategory && (
          <RelatedArticles
            articles={relatedArticlesForCollection(categoryPath, collectionSlugs)}
            otherLocaleArticles={relatedArticlesForCollection(categoryPath, collectionSlugs, { skipThaiOnly: true })}
          />
        )}
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
        // A brandless product (owner ruling, Pod-180) names no Brand — never an invented one.
        brand: publishedProduct.brandName ? { "@type": "Brand", name: publishedProduct.brandName } : undefined,
        category: categoryNameOf(publishedProduct.categoryId),
        image: publishedProduct.image ? [absoluteUrl(publishedProduct.image.src)] : undefined,
        // Only a genuinely published product has an owner-approved price — never fabricated from
        // priceReference (see buildPublishedCatalog()'s own readiness gate). Out of stock as a whole (no SKU, or every
        // option sold out — the read model's own answer) → OutOfStock, same rule as the legacy branch (stock round 2b).
        offers: publishedProduct.sellingPrice !== null ? { "@type": "Offer", priceCurrency: "THB", price: publishedProduct.sellingPrice, ...OFFER_AVAILABILITY, ...(publishedProduct.availabilityStatus === "out-of-stock" ? { availability: "https://schema.org/OutOfStock" } : {}), ...OFFER_SELLER, ...OFFER_MERCHANT } : undefined,
      };
      const publishedBrand = publishedProduct.brandId ? getBrand(publishedProduct.brandId) : undefined;
      const publishedBrandHref = publishedBrand ? `/brands/${publishedBrand.slug}` : undefined;
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
          {/* en/zh read the English name overlay (product-names-en.ts); JSON-LD above keeps the stored name. */}
          <HashLinksKeepHistory />
          <Breadcrumbs trail={publishedTrail.map((t, i) => (i === publishedTrail.length - 1 ? { ...t, name: <PilotNameText slug={publishedProduct.slug} name={t.name} /> } : t))} />
          <PilotProductDetail product={publishedProduct} related={getPublishedRelatedProducts(publishedProduct)} relatedArticles={relatedArticlesForPublished(publishedProduct)} relatedArticlesOtherLocales={relatedArticlesForPublished(publishedProduct, { skipThaiOnly: true })} imageDisplayMap={publishedImageDisplayMap} orderingEnabled={ORDERING_ENABLED} lineCodes={lineOrderCodes(publishedProduct.slug)} worksWith={getCompatibleConsumables(publishedProduct.slug)} fitsDevices={getCompatibleDevices(publishedProduct.slug)} brandHref={publishedBrandHref} />
        </>
      );
    }
    const pilotProduct = getPilotProduct(slug);
    if (pilotProduct) {
      const pilotImageDisplayMap = await buildImageDisplayMap(storefrontProductImageSrcs(pilotProduct));
      return <PilotProductDetail product={pilotProduct} related={getPilotRelatedProducts(pilotProduct)} relatedArticles={relatedArticlesForPublished(pilotProduct)} relatedArticlesOtherLocales={relatedArticlesForPublished(pilotProduct, { skipThaiOnly: true })} imageDisplayMap={pilotImageDisplayMap} orderingEnabled={ORDERING_ENABLED} lineCodes={lineOrderCodes(pilotProduct.slug)} worksWith={getCompatibleConsumables(pilotProduct.slug)} fitsDevices={getCompatibleDevices(pilotProduct.slug)} />;
    }
    notFound();
  }

  const related = getRelatedProducts(product);
  const brand = getBrand(product.brandId);
  // The product's own Thai copy, handed to the Client Components below as a prop (SEO ฉ batch 4, 14/10 — importing
  // PRODUCT_COPY_TH in them shipped every product's Thai text to the browser of every product page).
  const copyTh = PRODUCT_COPY_TH[product.slug];

  const legacyCardImage = product.assets.find((a) => a.role === "card");
  // Server-side only — reads the real files under public/ to decide, PER IMAGE, whether
  // ProductHero can fill its large box without visibly upscaling. Computed for every image the
  // hero could ever show (card, lineup, each color/flavor) so switching variants client-side never
  // silently reuses another image's fill decision. See src/lib/media-quality.ts and
  // `legacyProductImageSrcs`'s own doc comment for the bug this fixes.
  const heroImageDisplayMap = await buildImageDisplayMap(legacyProductImageSrcs(product), legacyOwnFloorSrcs(product));
  const heroImageDisplayInfo = legacyCardImage ? heroImageDisplayMap[legacyCardImage.src] ?? null : null;
  // Owner-approved price (legacy-price-approvals.ts) — null keeps the product browse-only.
  const legacySellingPrice = getLegacyApprovedPrice(product.slug);
  // Every option on the owner's sold-out list (e.g. WOTOFO nexBAR 18K, 2026-09-30) → the Offer says OutOfStock, not
  // InStoreOnly. A product with any option in stock keeps OFFER_AVAILABILITY unchanged. A product without options reads
  // its own `availability` (no SKU, stock round batch 2b).
  const legacyOptions = [...(product.flavorVariants ?? []), ...(product.colorVariants ?? [])];
  const legacyAllSoldOut = legacyOptions.length > 0 ? legacyOptions.every((o) => o.availability === "out-of-stock") : product.availability === "out-of-stock";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.displayName,
    // Round 7 "SEO ค" B2: the same Thai line the meta description already carries (round 30.3ข),
    // not the English source field — 35 of 53 Product nodes were English while the page's own
    // meta was Thai (_incoming/seo-c/keymap.md §3). No price suffix here: the price is in `offers`.
    description: legacyBaseDescriptionTh(product),
    brand: brand ? { "@type": "Brand", name: brand.name } : undefined,
    category: categoryNameOf(product.categoryId),
    image: legacyCardImage ? [absoluteUrl(legacyCardImage.src)] : undefined,
    // `offers` only when an owner-approved price exists (legacy-price-approvals.ts) — the legacy
    // Product type itself still has no price field; never fabricated.
    offers: legacySellingPrice !== null ? { "@type": "Offer", priceCurrency: "THB", price: legacySellingPrice, ...OFFER_AVAILABILITY, ...(legacyAllSoldOut ? { availability: "https://schema.org/OutOfStock" } : {}), ...OFFER_SELLER, ...OFFER_MERCHANT } : undefined,
  };
  // Round "M Bar 9K redesign" (owner 23/10): a slug in product-editorial.ts gets the editorial body instead of the
  // review / more-details / spec / compatibility / FAQ sections; its FAQPage block is built from the same Thai copy.
  const editorial = PRODUCT_EDITORIAL[product.slug];
  const editorialSibling = editorial?.siblingSlug ? getProduct(editorial.siblingSlug) : undefined;
  const editorialFaqJsonLd = editorial ? articleFaqJsonLd(editorial.copy.th.faq.items) : null;
  const legacyTrail = [
    { name: "Home", path: "/" },
    { name: categoryNameOf(product.categoryId), path: `/products/${product.categoryId}` },
    { name: product.displayName, path: `/products/${product.slug}` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(legacyTrail)) }} />
      {editorialFaqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(editorialFaqJsonLd) }} />}
      <HashLinksKeepHistory />
      <Breadcrumbs trail={legacyTrail} />
      <ProductHero product={product} sellingPrice={legacySellingPrice} imageDisplayInfo={heroImageDisplayInfo} imageDisplayMap={heroImageDisplayMap} orderingEnabled={ORDERING_ENABLED} lineCodes={lineOrderCodes(product.slug)} copyTh={copyTh} brandSlug={brand?.slug ?? product.brandId} hasBrandPage={Boolean(brand)} />
      {editorial ? (
        <>
          <ProductEditorialMain product={product} sibling={editorialSibling} copy={editorial.copy} copyTh={copyTh} siblingCopyTh={editorialSibling ? PRODUCT_COPY_TH[editorialSibling.slug] : undefined} />
          <EditorialClip product={product} copy={editorial.copy} />
          <ProductEditorialFaq copy={editorial.copy} />
        </>
      ) : (
        <>
          <ProductReviewSection product={product} />
          {/* `storyDetails` (image-fix round 2026-09-30): one "more details" story in place of the three sections below. */}
          {product.storyDetails ? (
            <ProductMoreDetails product={product} copy={productDetailsCopy(product.slug)} />
          ) : (
            <>
              <ProductGallery product={product} />
              {product.isFlagship && <ProductAnatomy product={product} />}
              <FeatureGrid product={product} copyTh={copyTh} />
            </>
          )}
          <SpecSheet product={product} copyTh={copyTh} />
          <CompatibilitySection product={product} copyTh={copyTh} />
          {/* Structured, clickable compatibility — real catalog products verified to fit, on top of
              (not instead of) the free-text platform facts above. Renders nothing when there are no
              verified links, so an unlinked product's page is unchanged. */}
          <CompatibleProducts direction="works-with" items={getCompatibleConsumables(product.slug)} />
          <CompatibleProducts direction="fits-devices" items={getCompatibleDevices(product.slug)} />
          <ProductFAQ faqs={product.faqs} faqsTh={copyTh?.faqs} />
        </>
      )}
      <RelatedProducts products={related} />
      {/* Round "backlink" (2026-09-22): the reading exit — articles this product's own data ties
          it to (src/lib/article-relevance.ts), no new copy, nothing to buy. */}
      <RelatedArticles articles={relatedArticlesForLegacy(product)} otherLocaleArticles={relatedArticlesForLegacy(product, { skipThaiOnly: true })} />
      <SourceNote product={product} />
    </>
  );
}
