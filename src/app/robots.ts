import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Phase 2.8 — internal ProductMaster preview, never a real storefront route. Also
      // guarded per-page with `robots: { index: false }` and a production notFound() gate.
      // Round 8 (2026-09-23): `/api/` holds the LINE-click counter endpoint — a beacon target and a
      // token-gated read-out, never a page; it also answers with X-Robots-Tag: noindex itself.
      disallow: ["/preview/", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
