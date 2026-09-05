import type { Product } from "@/types/catalog";
import { productListSchema } from "@/data/schema";
import { uwellProducts } from "./uwell";
import { voopooProducts } from "./voopoo";
import { salthubProducts } from "./salthub";
import { relxProducts } from "./relx";
import { joiwayProducts } from "./joiway";
import { tfitProducts } from "./tfit";
import { infyProducts } from "./infy";
import { unbrandedProducts } from "./unbranded";
import { applySoldOut } from "@/data/stock/apply-sold-out";

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

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return allProducts.filter((p) => {
    const haystack = [
      p.name,
      p.displayName,
      p.brandId,
      p.familyId,
      p.categoryId,
      p.tagline,
      p.shortDescription,
      ...p.features.map((f) => f.title),
      ...p.specifications.map((s) => `${s.label} ${s.value}`),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
