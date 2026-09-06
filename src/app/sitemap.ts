import type { MetadataRoute } from "next";
import { allProducts } from "@/data/products";
import { categories } from "@/data/categories";
import { guides } from "@/data/guides";
import { technologyEntries } from "@/data/technology";
import { flavorFamilies } from "@/data/flavors";
import { getPublishedProducts } from "@/data/shipnity-seed/storefront-bridge";
import { SITE_URL as BASE_URL } from "@/lib/seo";
import { brandsWithProducts } from "@/lib/brand-visibility";

export default function sitemap(): MetadataRoute.Sitemap {
  // Customer-service pages (2026-09-06): how-to-order, shipping, contact, privacy and — since the
  // owner approved the claim conditions the same day (BSOT §12) — /warranty are all public.
  const staticRoutes = ["", "/products", "/e-liquid", "/compare", "/finder", "/guides", "/technology", "/faq", "/about", "/how-to-order", "/shipping", "/warranty", "/contact", "/privacy", "/search", "/favorites"];

  const routes: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  for (const c of categories) routes.push({ url: `${BASE_URL}/products/${c.slug}`, lastModified: new Date() });
  for (const p of allProducts) routes.push({ url: `${BASE_URL}/products/${p.slug}`, lastModified: new Date() });
  // Real, published ProductMaster products only — never the DEV-preview pool (see
  // storefront-bridge.ts). Grows automatically as more products get genuine owner publication
  // approval (see publication-approvals.ts) — no per-product edit needed here.
  for (const p of getPublishedProducts()) routes.push({ url: `${BASE_URL}/products/${p.slug}`, lastModified: new Date() });
  // Only brands with a real product right now — a brand page with zero products is noindexed
  // (see brands/[brand]/page.tsx's generateMetadata), so it has no business being offered to a
  // crawler via the sitemap either. Same list `brandsWithProducts()` already builds for footer/
  // about-page navigation — one source of truth for "is this brand real yet."
  for (const b of brandsWithProducts()) routes.push({ url: `${BASE_URL}/brands/${b.slug}`, lastModified: new Date() });
  for (const g of guides) routes.push({ url: `${BASE_URL}/guides/${g.slug}`, lastModified: new Date() });
  for (const t of technologyEntries) routes.push({ url: `${BASE_URL}/technology/${t.slug}`, lastModified: new Date() });
  for (const f of flavorFamilies) routes.push({ url: `${BASE_URL}/e-liquid/${f.slug}`, lastModified: new Date() });

  return routes;
}
