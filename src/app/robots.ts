import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Phase 2.8 — internal ProductMaster preview, never a real storefront route. Also
      // guarded per-page with `robots: { index: false }` and a production notFound() gate.
      disallow: "/preview/",
    },
    sitemap: "https://nova-vapor.example.com/sitemap.xml",
  };
}
