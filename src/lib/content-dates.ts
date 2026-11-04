/**
 * OKami24 — when did the content behind a page last change? (round "search-price" batch 3, 2026-09-22)
 *
 * Before this round `sitemap.ts` stamped every URL with `new Date()` — the build time, identical on
 * all 105 URLs, so Google was told the privacy page changed every time an article was edited — and
 * the Article JSON-LD `dateModified` was a string typed by hand on each record ("bump with every
 * copy change", which nobody is reminded to do).
 *
 * Now every page family names the source files its content comes from (`CONTENT_SOURCES` /
 * `legacyProductSource`), and the date is the last git commit that touched any of them, read
 * once by `scripts/content-dates.ts` into `src/data/content-dates.json` — the build never runs git
 * (Render's build box may not have the history). The JSON is committed; the contract test
 * `content-dates-contract-test.ts` fails `npm run verify:catalog` when the JSON is older than git
 * for any path, so a round cannot close with stale dates.
 *
 * Granularity is the source FILE, which is only true for a page that has a file of its own (service pages). Pages built
 * from shared data are dated by what a reader gets on them: guides by their own text (scripts/lib/guide-dates.ts), and
 * products, categories, brands and the article indexes by "pages" in the JSON (scripts/lib/page-substance.ts, owner 05/11:
 * one watermark rename had re-dated 148 of 182 URLs). A picture, price or stock change moves neither.
 */
import contentDates from "@/data/content-dates.json";

const DATES: Record<string, string> = contentDates.paths;

/** Source paths per page family, relative to the repo root. A directory means "any file in it".
 *  Files that shape EVERY page (layout, header, footer, dictionaries) are deliberately not listed:
 *  a design tweak is not a content change a crawler needs to revisit every page for.
 *
 *  Round "leftovers" (2026-09-22): `compare`, `finder`, `search` and `favorites` are no longer
 *  read by sitemap.ts — those four pages are noindex and left the sitemap. Their rows stay because
 *  the pages still exist and the mapping stays true; if one is ever made indexable it goes back
 *  into STATIC_ROUTES with its date already correct. */
export const CONTENT_SOURCES = {
  home: ["src/app/page.tsx", "src/components/home"],
  guides: ["src/data/guides.ts", "src/i18n/guides-copy.ts", "src/i18n/search-head-copy.ts"],
  technology: ["src/data/technology.ts", "src/i18n/technology-copy.ts", "src/i18n/search-head-copy.ts"],
  compare: ["src/app/compare", "src/components/tools/CompareTool.tsx"],
  finder: ["src/app/finder", "src/components/tools/FinderTool.tsx", "src/i18n/finder-copy.ts", "src/lib/finder.ts"],
  faq: ["src/app/faq", "src/data/faqs.ts", "src/i18n/faq-copy.ts"],
  about: ["src/app/about"],
  howToOrder: ["src/app/how-to-order", "src/i18n/service-pages/how-to-order.tsx", "src/i18n/service-pages/shared.tsx"],
  shipping: ["src/app/shipping", "src/i18n/service-pages/shipping.tsx", "src/i18n/service-pages/shared.tsx"],
  warranty: ["src/app/warranty", "src/i18n/service-pages/claims-policy.tsx", "src/i18n/service-pages/shared.tsx"],
  contact: ["src/app/contact", "src/i18n/service-pages/contact.tsx", "src/data/contact.ts"],
  privacy: ["src/app/privacy", "src/i18n/service-pages/privacy.tsx"],
  search: ["src/app/search", "src/components/tools/SearchTool.tsx", "src/lib/catalog-search.ts", "src/data/search-aliases.ts"],
  favorites: ["src/app/favorites", "src/components/tools/FavoritesList.tsx"],
} as const satisfies Record<string, readonly string[]>;

export type ContentFamily = keyof typeof CONTENT_SOURCES;

/** Every path any page can cite — what scripts/content-dates.ts asks git about. */
export function allContentPaths(): string[] {
  const set = new Set<string>();
  for (const paths of Object.values(CONTENT_SOURCES)) for (const p of paths) set.add(p);
  return [...set].sort();
}

/** The newest git commit date among `paths`. A path missing from the JSON is a bug the contract
 *  test reports; at runtime it is skipped rather than turned into "now". */
export function contentLastModified(paths: readonly string[]): Date {
  let newest = 0;
  for (const p of paths) {
    const iso = DATES[p];
    if (!iso) continue;
    const t = Date.parse(iso);
    if (t > newest) newest = t;
  }
  if (newest === 0) throw new Error(`content-dates.json has no date for any of: ${paths.join(", ")} — run npx tsx scripts/content-dates.ts`);
  return new Date(newest);
}

export function familyLastModified(family: ContentFamily): Date {
  return contentLastModified(CONTENT_SOURCES[family]);
}

const PAGE_DATES: Record<string, { date: string }> = (contentDates as { pages?: Record<string, { date: string }> }).pages ?? {};

/** A sitemap page's date: the last time its substance changed (scripts/lib/page-substance.ts), or its own files' last
 *  commit if that is newer. A page with neither gets no date at all: an honest gap, never "now". The contract test
 *  fails while any sitemap page is in that state, so this only ever happens on a build nobody verified. */
export function pageLastModified(path: string, family?: ContentFamily): Date | undefined {
  const own = PAGE_DATES[path] ? Date.parse(PAGE_DATES[path].date) : 0;
  const files = family ? familyLastModified(family).getTime() : 0;
  const newest = Math.max(own, files);
  return newest > 0 ? new Date(newest) : undefined;
}

/** Calendar date (YYYY-MM-DD, Bangkok time — the shop's day, like the hand-typed value it
 *  replaces) for JSON-LD `dateModified`. */
export function familyModifiedDate(family: ContentFamily): string {
  return familyLastModified(family).toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
}

/** Round SEO ฉ batch 4 (2026-10-12): files beyond guides.ts / guides-copy.ts / search-head-copy.ts that hold one
 *  guide's own text — the DNS help page (DNS_GUIDE_ID in src/data/guides.ts) keeps its body in its own copy file. */
export const GUIDE_EXTRA_SOURCES: Record<string, readonly string[]> = {
  "cant-open-the-website": ["src/i18n/dns-guide-copy.tsx"],
};

const GUIDE_DATES: Record<string, string> = (contentDates as { guides?: Record<string, string> }).guides ?? {};

/** The newest commit that changed THIS guide's own text (scripts/lib/guide-dates.ts) — not the newest commit to any
 *  guide file, which re-dated every article whenever one was edited. */
export function guideLastModified(id: string): Date {
  const iso = GUIDE_DATES[id];
  if (!iso) throw new Error(`content-dates.json has no guide date for "${id}" — run npx tsx scripts/content-dates.ts`);
  return new Date(iso);
}

/** YYYY-MM-DD (Bangkok) for Article `dateModified` and the visible "updated" line — never earlier than the
 *  guide's datePublished (a held article can be published after its last text change). */
export function guideModifiedDate(id: string, publishedAt?: string): string {
  const day = guideLastModified(id).toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
  return publishedAt && publishedAt > day ? publishedAt : day;
}
