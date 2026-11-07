import { SITE_URL } from "@/lib/seo";

/**
 * Round SEO full batch 4 (07/11): the picture files of a product page, for its sitemap entry. A page's pictures reach the
 * browser through `/_next/image?url=…&w=…`, so the sitemap is the one place that names each original file once. Read from the
 * record itself (card, gallery, every colour or flavour, line-up, posters), so a new picture needs no edit here.
 * A record with more than MAX_IMAGES keeps the first ones: card and gallery come first in every record.
 */
const MAX_IMAGES = 60;
const PRODUCT_PICTURE = /^\/assets\/products\/[^?#]+\.(?:webp|png|jpe?g|avif)$/i;

function collect(value: unknown, into: Set<string>, seen: WeakSet<object>): void {
  if (Array.isArray(value)) {
    for (const item of value) collect(item, into, seen);
    return;
  }
  if (!value || typeof value !== "object" || seen.has(value)) return;
  seen.add(value);
  for (const [key, item] of Object.entries(value)) {
    if (key === "src" && typeof item === "string" && PRODUCT_PICTURE.test(item)) into.add(item);
    else collect(item, into, seen);
  }
}

/** Absolute picture URLs of one product record, each file once, at most MAX_IMAGES. */
export function productSitemapImages(record: unknown): string[] {
  const found = new Set<string>();
  collect(record, found, new WeakSet());
  return [...found].slice(0, MAX_IMAGES).map((src) => `${SITE_URL}${src}`);
}
