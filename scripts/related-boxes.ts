/**
 * Print every product page's "อ่านต่อ" box (src/lib/article-relevance.ts) as JSON — one line per product,
 * so a before/after diff shows exactly which links a new article adds or displaces (round 10B, 2026-09-24).
 *
 *   npx tsx scripts/related-boxes.ts > _incoming/<round>/boxes-<tag>.json
 */
import { allProducts } from "@/data/products";
import { getPublishedProducts } from "@/data/shipnity-seed/storefront-bridge";
import { relatedArticlesForLegacy, relatedArticlesForPublished } from "@/lib/article-relevance";

const rows = [
  ...allProducts.map((p) => ({ slug: p.slug, links: relatedArticlesForLegacy(p).map((a) => a.href) })),
  ...getPublishedProducts().map((p) => ({ slug: p.slug, links: relatedArticlesForPublished(p).map((a) => a.href) })),
].sort((a, b) => a.slug.localeCompare(b.slug));

console.log(JSON.stringify(rows, null, 1));
