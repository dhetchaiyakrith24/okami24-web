import { existsSync } from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { SITE_URL } from "@/lib/seo";
import { productSitemapImages } from "@/lib/sitemap-images";

/**
 * Round SEO full batch 4 (07/11): every picture the sitemap names is a real file under public/, belongs to a product page,
 * and no page lists a file twice. A renamed picture without its reference moved would fail here, before Google sees a 404.
 */
let failed = 0;
const check = (ok: boolean, label: string) => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}`);
  if (!ok) failed++;
};

const entries = sitemap();
const withImages = entries.filter((e) => (e.images?.length ?? 0) > 0);
const files = withImages.flatMap((e) => e.images ?? []);

check(withImages.length > 0, `product pages list pictures (${withImages.length} pages, ${files.length} pictures)`);
check(withImages.every((e) => e.url.startsWith(`${SITE_URL}/products/`)), "only product pages carry pictures");
const missing = files.filter((u) => !existsSync(path.join(process.cwd(), "public", u.slice(SITE_URL.length))));
check(missing.length === 0, missing.length ? `missing files: ${missing.slice(0, 5).join(" ")}` : "every picture is a real file under public/");
check(withImages.every((e) => new Set(e.images).size === e.images?.length), "no page lists a file twice");

const record = { assets: [{ src: "/assets/products/x/a.webp" }, { src: "/assets/products/x/a.webp" }], flavors: [{ image: { src: "/assets/products/x/b.webp" } }], poster: { src: "/assets/other/c.webp" } };
check(productSitemapImages(record).length === 2, "reads nested pictures, once each, product pictures only");

if (failed) process.exit(1);
