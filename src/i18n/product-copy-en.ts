/**
 * OKami24 — round 30.3: English taglines for ProductMaster (Shipnity-sourced) products.
 *
 * The mirror image of `product-copy-th.ts`. Legacy products are written in English with a Thai
 * overlay; ProductMaster products are written in Thai (`MINIMUM_COPY` in
 * `active-catalog-to-product-master.ts`, built from the product's own Shipnity name) and until this
 * round had no English at all, so the English and Chinese storefront showed the Thai line. This is
 * the presentation-layer overlay for that: keyed by `StorefrontProductView.slug`, read by
 * `PilotProductCard` and `PilotProductDetail` whenever the locale is not Thai, English serving
 * Chinese too (there is no Chinese product copy anywhere on the site). A slug with no entry keeps
 * showing the Thai line — exactly what every visitor saw before this file existed.
 *
 * Deliberately empty at wiring time (owner decision 2026-09-10): the 18 English lines are writing
 * work and go to round 30.3 part ข with the rest of the title/meta copy, one owner-approval batch
 * at a time. Same rule as the Thai file when they land — translation of the existing line only,
 * no new claims, specs or numbers.
 */

export interface ProductCopyEn {
  tagline: string;
}

export const PRODUCT_COPY_EN: Record<string, ProductCopyEn> = {};

/** The tagline a non-Thai visitor should read for a ProductMaster product: the English overlay
 *  when one exists, otherwise the Thai source line (never blank, never a machine translation). */
export function pilotTagline(slug: string, thaiTagline: string, locale: string): string {
  if (locale === "th") return thaiTagline;
  return PRODUCT_COPY_EN[slug]?.tagline ?? thaiTagline;
}
