import { brands } from "@/data/brands";
import { getProductsByBrand } from "@/data/products";
import { getPublishedProductsByBrand } from "@/data/shipnity-seed/storefront-bridge";

/**
 * Full-catalog-mission discovery fix: several brands (added on real, cited evidence for a
 * ProductMaster candidate that later turned out media-blocked — see
 * shipnity-seed/README.md's evidence-tier section) currently have zero real products in either
 * pool. Their `/brands/[slug]` page still renders correctly (a real tagline/description + an
 * honest empty state — see BrandPage), but linking to a guaranteed-empty page from primary
 * navigation (footer, /about) is a dead end for a customer and a thin/low-value page for a
 * crawler. This filters brand-discovery LISTS to real, populated brands only — the page itself
 * stays reachable by direct URL (never 404s), it just isn't advertised until it has something to
 * show. Re-derives per render rather than caching: catalog membership changes as products publish.
 */
export function brandsWithProducts() {
  return brands.filter((b) => getProductsByBrand(b.id).length > 0 || getPublishedProductsByBrand(b.id).length > 0);
}
