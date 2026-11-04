/** OKami24 — fills PageSources (scripts/lib/page-substance.ts) from the live catalog: the same lists sitemap.ts offers. */
import { allProducts, getProductsByCategory } from "@/data/products";
import { getCompatibleConsumables, getCompatibleDevices } from "@/data/catalog-relationships";
import { compatEvidenceTh } from "@/i18n/compat-copy-th";
import { categorySpecRows } from "@/lib/category-spec-table";
import { categoriesWithProducts } from "@/lib/category-visibility";
import { brandsWithProducts } from "@/lib/brand-visibility";
import { getPublishedProducts } from "@/data/shipnity-seed/storefront-bridge";
import { guides } from "@/data/guides";
import { GUIDES_COPY_TH, GUIDES_COPY_ZH } from "@/i18n/guides-copy";
import { technologyEntries } from "@/data/technology";
import { TECHNOLOGY_COPY_TH, TECHNOLOGY_COPY_ZH } from "@/i18n/technology-copy";
import { flavorFamilies } from "@/data/flavors";
import { FLAVOR_COPY_TH, FLAVOR_COPY_ZH } from "@/i18n/flavor-copy";
import { PRODUCT_COPY_TH } from "@/i18n/product-copy-th";
import { PRODUCT_COPY_EN } from "@/i18n/product-copy-en";
import { PRODUCT_EDITORIAL } from "@/data/product-editorial";
import { productDetailsCopy } from "@/lib/product-details-copy";
import { CATEGORY_GUIDE_COPY } from "@/i18n/category-guide-copy";
import { COLLECTION_VIDEOS } from "@/data/collection-videos";
import * as head from "@/i18n/search-head-copy";
import type { PageSources } from "./page-substance";

export function loadPageSources(): PageSources {
  return {
    legacyProducts: allProducts,
    publishedProducts: getPublishedProducts(),
    productCopy: (slug) => ({
      th: PRODUCT_COPY_TH[slug],
      en: PRODUCT_COPY_EN[slug],
      editorial: PRODUCT_EDITORIAL[slug],
      details: productDetailsCopy(slug),
      title: head.PRODUCT_TITLE_HEAD_TH[slug],
      description: head.PRODUCT_DESCRIPTION_HEAD_TH[slug],
      compatible: [...getCompatibleConsumables(slug), ...getCompatibleDevices(slug)].map((c) => [c.ref.slug, c.role, c.evidence, compatEvidenceTh(c.evidence)]),
    }),
    cardTagline: (slug) => PRODUCT_COPY_TH[slug]?.tagline,
    categories: categoriesWithProducts(),
    categoryCopy: (id) => ({ guide: CATEGORY_GUIDE_COPY[id], title: head.categoryTitleTh("", id) }),
    categorySpecs: (id) => categorySpecRows(getProductsByCategory(id)),
    brands: brandsWithProducts(),
    // No price in the substance: the head row asks for a price by slug and gets none.
    brandCopy: (id) => ({ head: head.BRAND_HEAD_TH[id]?.(() => null), h1: head.BRAND_H1[id] }),
    collectionVideos: COLLECTION_VIDEOS,
    guides,
    guideCopy: (id) => [GUIDES_COPY_TH[id], GUIDES_COPY_ZH[id]].map((c) => ({ title: c?.title, dek: c?.dek })),
    technology: technologyEntries,
    technologyCopy: (id) => [TECHNOLOGY_COPY_TH[id], TECHNOLOGY_COPY_ZH[id], head.TECHNOLOGY_DESCRIPTION_HEAD_TH[id]],
    flavors: flavorFamilies,
    flavorCopy: (id) => [FLAVOR_COPY_TH[id], FLAVOR_COPY_ZH[id], head.FLAVOR_TITLE_HEAD_TH[id]],
    head: { home: head.HOME_HEAD_TH, about: head.ABOUT_HEAD_TH, contact: head.CONTACT_HEAD_TH, products: head.productsHeadTh(0) },
  };
}
