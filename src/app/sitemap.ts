import type { MetadataRoute } from "next";
import { allProducts } from "@/data/products";
import { categories } from "@/data/categories";
import { brands } from "@/data/brands";
import { guides } from "@/data/guides";
import { technologyEntries } from "@/data/technology";
import { flavorFamilies } from "@/data/flavors";

const BASE_URL = "https://nova-vapor.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/products", "/e-liquid", "/compare", "/finder", "/guides", "/technology", "/faq", "/about", "/search", "/favorites"];

  const routes: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  for (const c of categories) routes.push({ url: `${BASE_URL}/products/${c.slug}`, lastModified: new Date() });
  for (const p of allProducts) routes.push({ url: `${BASE_URL}/products/${p.slug}`, lastModified: new Date() });
  for (const b of brands) routes.push({ url: `${BASE_URL}/brands/${b.slug}`, lastModified: new Date() });
  for (const g of guides) routes.push({ url: `${BASE_URL}/guides/${g.slug}`, lastModified: new Date() });
  for (const t of technologyEntries) routes.push({ url: `${BASE_URL}/technology/${t.slug}`, lastModified: new Date() });
  for (const f of flavorFamilies) routes.push({ url: `${BASE_URL}/e-liquid/${f.slug}`, lastModified: new Date() });

  return routes;
}
