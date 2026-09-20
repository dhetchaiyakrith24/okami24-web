import type { Metadata } from "next";

/**
 * Single source of truth for the site origin — read from the `SITE_URL` environment variable so
 * a real domain never has to be guessed or hardcoded here. `docs/BUSINESS_SOURCE_OF_TRUTH.md` §19
 * notes the real production domain is still TBD; when it's decided, it's set via `SITE_URL` in
 * the deploy environment, never edited in source.
 *
 * - Any environment (dev, preview, production) can set `SITE_URL` explicitly and it wins.
 * - In production (`NODE_ENV === "production"`) with no `SITE_URL` set, OR with a `SITE_URL` that
 *   is itself an obvious non-production placeholder (see `checkObviouslyInvalidProductionHost`),
 *   this throws at module load — i.e. `next build`/`next start` fail loudly — rather than
 *   silently baking a wrong domain into canonical/sitemap/robots/OpenGraph/JSON-LD. A wrong-but-
 *   present domain in those surfaces is a quiet, hard-to-notice SEO bug; a build that refuses to
 *   run is impossible to miss. This is configuration sanity, not domain verification — it never
 *   makes a network/DNS call, and it happily accepts any real-looking hostname it doesn't
 *   recognize as reserved.
 * - In dev, falls back to `http://localhost:3000` (this project's default `next dev` port) purely
 *   so canonical/OG tags resolve to *something* sensible locally with zero setup required. The
 *   placeholder check above only runs in production — dev is free to point `SITE_URL` at
 *   localhost, a tunnel, or anything else useful for local testing.
 */

/** RFC 2606 reserved/documentation domains (and their subdomains) plus `localhost` — every one of
 *  these is a real placeholder that has appeared or could plausibly appear in this codebase or a
 *  copy-pasted `.env`, never a real storefront domain. */
const RESERVED_HOST_SUFFIXES = ["example.com", "example.net", "example.org", "example", "invalid", "test", "localhost"];

function checkObviouslyInvalidProductionHost(hostname: string): string | null {
  const host = hostname.toLowerCase();
  const reservedMatch = RESERVED_HOST_SUFFIXES.find((suffix) => host === suffix || host.endsWith(`.${suffix}`));
  if (reservedMatch) return `"${hostname}" is a reserved/placeholder domain (RFC 2606: *.${reservedMatch})`;
  if (host === "127.0.0.1" || host === "::1" || /^127\.\d+\.\d+\.\d+$/.test(host)) return `"${hostname}" is a loopback address`;
  return null;
}

function resolveSiteUrl(): string {
  const configured = process.env.SITE_URL;
  if (configured) {
    const trimmed = configured.replace(/\/+$/, "");
    if (process.env.NODE_ENV === "production") {
      let parsed: URL;
      try {
        parsed = new URL(trimmed);
      } catch {
        throw new Error(`SITE_URL ("${trimmed}") is not a valid absolute URL. Set it to the real OKami24 production domain, e.g. "https://okami24.store".`);
      }
      const problem = checkObviouslyInvalidProductionHost(parsed.hostname);
      if (problem) {
        throw new Error(
          `SITE_URL ("${trimmed}") looks like a non-production placeholder, not a real domain: ${problem}. Refusing to bake this into canonical/sitemap/robots/OpenGraph/JSON-LD — set SITE_URL to the real OKami24 production domain before deploying.`
        );
      }
    }
    return trimmed;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SITE_URL environment variable is required in production. Refusing to fall back to a placeholder or localhost domain for canonical/sitemap/robots/OpenGraph/JSON-LD — set SITE_URL to the real OKami24 production domain before deploying."
    );
  }
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

/**
 * Stable `@id` of the shop as a schema.org Organization — the one node every other JSON-LD block
 * on the site points at (`WebSite.publisher`, every `Offer.seller`) so Google can tie the products
 * to the store entity instead of seeing 53 unrelated offers. Anchored on the site origin because
 * that is the only identifier that cannot drift between pages or deploys.
 */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/** The reference form of the organization for use INSIDE other nodes (`seller`, `publisher`) —
 *  a bare `@id` link, never a second copy of the full Organization. */
export function organizationRef() {
  return { "@type": "Organization", "@id": ORGANIZATION_ID };
}

/**
 * `Organization` JSON-LD for the homepage (SEO round ก, 2026-09-21). `alternateName` carries the
 * short brand words people actually search for — Search Console showed "okm" returning no result
 * for this site at all while "okami24" / "okm pod" already rank — so this is the entity-level
 * hint that the two spellings are the same shop. `sameAs` lists only the channels recorded in
 * `src/data/contact.ts`; nothing here is invented, and the LINE handle is deliberately not a URL
 * field of its own because schema.org has no property for it.
 */
export function organizationJsonLd(contact: { lineUrl: string; youtubeUrl: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "OKami24",
    alternateName: ["OKM", "okm pod", "Okami vape", "okami24"],
    url: SITE_URL,
    logo: absoluteUrl("/brand/okami-logo-red.png"),
    sameAs: [contact.lineUrl, contact.youtubeUrl],
    areaServed: "TH",
  };
}

/**
 * `WebSite` JSON-LD for the homepage, published by the Organization above. The `SearchAction` is
 * included because `/search` genuinely takes a `q` query parameter (see `src/app/search/page.tsx`)
 * — it is a description of a real, working URL pattern, not a decoration.
 */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "OKami24",
    alternateName: "OKM",
    url: SITE_URL,
    inLanguage: "th",
    publisher: organizationRef(),
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * `BreadcrumbList` JSON-LD for a page's real navigational path (owner mandate, 2026-09-03 —
 * "structured data... breadcrumbs" as part of the disposable-discovery SEO push). Real hierarchy
 * only — every trail passed in must reflect an actual, navigable ancestor path (Home → Category →
 * Product), never an invented one for SEO padding. Positions are 1-indexed per the schema.org spec.
 */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Always safe to add to any page — purely additive, no merge collision with inherited
 *  metadata (unlike `openGraph`, which replaces the parent's object wholesale when set). */
export function canonicalFor(path: string): Pick<Metadata, "alternates"> {
  return { alternates: { canonical: path } };
}

/**
 * For interactive/personalized UTILITY pages (search, favorites, compare, finder) — real,
 * working features, but ones whose crawlable HTML is either always empty/generic for an
 * anonymous visitor (favorites — localStorage-only) or an infinite space of thin, non-unique
 * permutations (search results, compare selections). None of that has search-engine landing-page
 * value, so these are excluded from the index rather than left to rely on canonical alone —
 * `follow: true` because internal links reachable from them (e.g. products a search matched)
 * should still be crawlable via their own real pages regardless.
 */
export const NOINDEX_FOLLOW: Pick<Metadata, "robots"> = { robots: { index: false, follow: true } };

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
