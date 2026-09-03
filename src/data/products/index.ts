import type { Product } from "@/types/catalog";
import { productListSchema } from "@/data/schema";
import { uwellProducts } from "./uwell";
import { voopooProducts } from "./voopoo";
import { salthubProducts } from "./salthub";
import { relxProducts } from "./relx";
import { joiwayProducts } from "./joiway";
import { tfitProducts } from "./tfit";
import { infyProducts } from "./infy";

export const allProducts: Product[] = [
  ...uwellProducts,
  ...voopooProducts,
  ...salthubProducts,
  ...relxProducts,
  ...joiwayProducts,
  ...tfitProducts,
  ...infyProducts,
];

// Validated once at module load — a malformed product record fails the build
// rather than shipping silently broken data.
const parsed = productListSchema.safeParse(allProducts);
if (!parsed.success) {
  throw new Error(`Invalid product data: ${parsed.error.message}`);
}

const seenSlugs = new Set<string>();
for (const product of allProducts) {
  if (seenSlugs.has(product.slug)) {
    throw new Error(`Duplicate product slug: ${product.slug}`);
  }
  seenSlugs.add(product.slug);
}

for (const product of allProducts) {
  for (const relatedSlug of product.relatedProductSlugs) {
    if (!seenSlugs.has(relatedSlug)) {
      throw new Error(`${product.slug} references unknown related product: ${relatedSlug}`);
    }
  }
}

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
