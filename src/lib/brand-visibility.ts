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

/** The footer's brand row — computed in the root layout and passed as a prop, same reason as `NavCategory` in
 *  category-visibility.ts (round SEO ฉ batch 4, 13/10). */
export type NavBrand = { id: string; slug: string; name: string };

export function navBrands(): NavBrand[] {
  return brandsWithProducts().map(({ id, slug, name }) => ({ id, slug, name }));
}
