import { PRODUCT_COPY_TH } from "@/i18n/product-copy-th";

/**
 * The Thai tagline a legacy product CARD shows (speed, LESSONS 37 · 08/11). ProductCard used to import the whole
 * PRODUCT_COPY_TH table, and since client components render it (catalog, related row, similar models) every product and
 * category page shipped every product's Thai copy to the browser. The server now hands each card its own line instead.
 * Server code only — a client component that imports this pulls the table back in.
 */
export function taglineThFor(slug: string): string | undefined {
  return PRODUCT_COPY_TH[slug]?.tagline;
}

/** The lines for a list of products, keyed by slug (a prop for a client component that renders many cards). */
export function cardTaglinesTh(products: readonly { slug: string }[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const p of products) {
    const t = taglineThFor(p.slug);
    if (t) out[p.slug] = t;
  }
  return out;
}
