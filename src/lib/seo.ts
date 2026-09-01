import type { Metadata } from "next";

/**
 * Single source of truth for the site origin — was duplicated as a literal string in
 * `sitemap.ts` and `robots.ts` (and the root layout's `metadataBase`). `docs/BUSINESS_SOURCE_OF_TRUTH.md`
 * §19 notes the real production domain is still TBD; when it's decided, this is the one place
 * to change it.
 */
export const SITE_URL = "https://nova-vapor.example.com";

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

/** Always safe to add to any page — purely additive, no merge collision with inherited
 *  metadata (unlike `openGraph`, which replaces the parent's object wholesale when set). */
export function canonicalFor(path: string): Pick<Metadata, "alternates"> {
  return { alternates: { canonical: path } };
}

/**
 * Per-page `openGraph` override for a product/category/brand page. Only call this when a REAL
 * image exists for the page — Next.js metadata merging replaces the parent's whole `openGraph`
 * object (including the root layout's file-convention `opengraph-image`) when a page sets its
 * own, so setting this without a real image would silently lose the site's default share image
 * rather than improve on it. Pages with no real photo should omit `openGraph` entirely and let
 * the root's default apply.
 */
export function openGraphWithImage(input: { title: string; description?: string; path: string; image: { src: string; alt: string } }): Pick<Metadata, "openGraph"> {
  return {
    openGraph: {
      title: input.title,
      description: input.description,
      url: input.path,
      images: [{ url: absoluteUrl(input.image.src), alt: input.image.alt }],
    },
  };
}
