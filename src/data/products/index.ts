import type { Product } from "@/types/catalog";
import { productListSchema } from "@/data/schema";
import { uwellProducts } from "./uwell";
import { voopooProducts } from "./voopoo";
import { salthubProducts } from "./salthub";
import { relxProducts } from "./relx";
import { joiwayProducts } from "./joiway";
import { tfitProducts } from "./tfit";
import { infyProducts } from "./infy";
import { wotofoProducts } from "./wotofo";
import { unbrandedProducts } from "./unbranded";
import { applySoldOut } from "@/data/stock/apply-sold-out";
import { getBrand } from "@/data/brands";
import { getCategory } from "@/data/categories";
import { getFamily } from "@/data/families";
import { PRODUCT_COPY_TH } from "@/i18n/product-copy-th";
import { rankByQuery, searchText, type SearchText } from "@/lib/catalog-search";
import { verifiedRows } from "@/lib/verified-specs";

/**
 * EVERY legacy product record, including ones hidden from the storefront. Validation, duplicate
 * checks and related-slug integrity run against this full list so hidden products stay real,
 * consistent data. Only reach for this when you genuinely need hidden records (audits, adapters,
 * identity/dedup checks) — storefront code must use `allProducts`.
 */
// `applySoldOut`: the owner's sold-out list (src/data/stock/sold-out.ts) is the ONE place stock is
// hand-maintained — it marks listed colours/flavours out-of-stock here, at load, so every consumer
// (storefront, cart gate, contract tests) sees the same answer. Product files keep "unknown".
export const catalogIncludingHidden: Product[] = applySoldOut([
  ...uwellProducts,
  ...voopooProducts,
  ...salthubProducts,
  ...relxProducts,
  ...joiwayProducts,
  ...tfitProducts,
  ...infyProducts,
  ...wotofoProducts,
  ...unbrandedProducts,
]);

// Validated once at module load — a malformed product record fails the build
// rather than shipping silently broken data.
const parsed = productListSchema.safeParse(catalogIncludingHidden);
if (!parsed.success) {
  throw new Error(`Invalid product data: ${parsed.error.message}`);
}

const seenSlugs = new Set<string>();
for (const product of catalogIncludingHidden) {
  if (seenSlugs.has(product.slug)) {
    throw new Error(`Duplicate product slug: ${product.slug}`);
  }
  seenSlugs.add(product.slug);
}

for (const product of catalogIncludingHidden) {
  for (const relatedSlug of product.relatedProductSlugs) {
    if (!seenSlugs.has(relatedSlug)) {
      throw new Error(`${product.slug} references unknown related product: ${relatedSlug}`);
    }
  }
}

/**
 * Products currently hidden from the storefront (owner rule, docs/IMAGE_SPEC.md §4, 2026-09-06:
 * no card photo → hidden until one exists). Data intact; `hiddenFromStorefront.reason` says why.
 */
export const hiddenProducts: Product[] = catalogIncludingHidden.filter((p) => p.hiddenFromStorefront);

/**
 * What the STOREFRONT sees: every helper below (catalog grid, search, finder, sitemap, product
 * page, related products) reads this list, so a hidden product 404s and never appears in a rail
 * or a link — while its data stays validated above. Un-hiding a product = delete its
 * `hiddenFromStorefront` field, nothing else.
 */
export const allProducts: Product[] = catalogIncludingHidden.filter((p) => !p.hiddenFromStorefront);

export function getProduct(slug: string): Product | undefined {
  return allProducts.find((p) => p.slug === slug);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return allProducts.filter((p) => p.categoryId === categoryId);
}

export function getProductsByFamily(familyId: string): Product[] {
  return allProducts.filter((p) => p.familyId === familyId);
}

export function getProductsByBrand(brandId: string): Product[] {
  return allProducts.filter((p) => p.brandId === brandId);
}

export function getFlagshipProducts(): Product[] {
  return allProducts.filter((p) => p.isFlagship);
}

export function getRelatedProducts(product: Product): Product[] {
  return product.relatedProductSlugs
    .map((slug) => getProduct(slug))
    .filter((p): p is Product => Boolean(p));
}

/** Round "search-price" (2026-09-22): the text a legacy product is searched by — what it IS, in
 *  English and in the Thai a visitor reads on the site (category label, Thai tagline and spec
 *  values from product-copy-th.ts). Built once per product at module load; the matching rules
 *  (tokens, compact form, aliases, invisible characters) live in src/lib/catalog-search.ts.
 *  `shortDescription` was in the old haystack and is left out on purpose — see that file. */
const SEARCH_TEXT = new Map<string, SearchText>(
  allProducts.map((p) => {
    const copyTh = PRODUCT_COPY_TH[p.slug];
    const brand = getBrand(p.brandId);
    const family = getFamily(p.familyId);
    const category = getCategory(p.categoryId);
    return [
      p.slug,
      searchText({
        slug: p.slug,
        primary: [
          p.name,
          p.displayName,
          p.brandId,
          brand?.name,
          brand?.fullName,
          p.familyId,
          family?.name,
          p.categoryId,
          category?.name,
          category?.shortName,
          category?.labelTh,
          ...(p.colorVariants ?? []).map((v) => v.name),
          ...(p.flavorVariants ?? []).map((v) => v.name),
        ],
        secondary: [
          p.tagline,
          copyTh?.tagline,
          ...p.features.map((f) => f.title),
          // Data round (2026-09-24): only verified rows are searchable — a held-back value ("14mL" on the M Bar 9K) must
          // not bring a product up as if it were a fact.
          ...verifiedRows(p.specifications).flatMap((s) => [`${s.label} ${s.value}`, copyTh?.specifications?.[s.key] ?? ""]),
        ],
      }),
    ];
  })
);

/** The search text of a storefront product — shared with the catalog grids (CatalogBrowser.tsx)
 *  so /search and a category page's own search box give the same answer for the same word. */
export function legacySearchText(product: Product): SearchText {
  const text = SEARCH_TEXT.get(product.slug);
  if (!text) throw new Error(`legacySearchText: "${product.slug}" is not a storefront product`);
  return text;
}

export function searchProducts(query: string): Product[] {
  return rankByQuery(query, allProducts, legacySearchText);
}
