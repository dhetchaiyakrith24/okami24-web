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
 * Granularity is the source FILE: editing one guide in guides-copy.ts moves the date of all
 * seven guides. That is still the truth ("the file behind this page changed on X"), just coarser
 * than one date per article; per-record dates would need a git blame per entry — not worth it
 * until the articles live in one file each.
 */
import contentDates from "@/data/content-dates.json";

const DATES: Record<string, string> = contentDates.paths;

/** The legacy catalog is one data file per brand (src/data/products/index.ts is code, not content —
 *  a search change there must not re-date every category page). */
const LEGACY_PRODUCT_FILES: Record<string, string> = {
  uwell: "uwell.ts",
  voopoo: "voopoo.ts",
  salthub: "salthub.ts",
  relx: "relx.ts",
  joiway: "joiway.ts",
  tfit: "tfit.ts",
  infy: "infy.ts",
};
const LEGACY_PRODUCT_DATA = [...Object.values(LEGACY_PRODUCT_FILES), "unbranded.ts"].map((f) => `src/data/products/${f}`);

/** Source paths per page family, relative to the repo root. A directory means "any file in it".
 *  Files that shape EVERY page (layout, header, footer, dictionaries) are deliberately not listed:
 *  a design tweak is not a content change a crawler needs to revisit every page for.
 *
 *  Round "leftovers" (2026-09-22): `compare`, `finder`, `search` and `favorites` are no longer
 *  read by sitemap.ts — those four pages are noindex and left the sitemap. Their rows stay because
 *  the pages still exist and the mapping stays true; if one is ever made indexable it goes back
 *  into STATIC_ROUTES with its date already correct. */
export const CONTENT_SOURCES = {
  home: ["src/app/page.tsx", "src/components/home", "src/i18n/search-head-copy.ts"],
  productsIndex: ["src/app/products/page.tsx", ...LEGACY_PRODUCT_DATA, "src/data/shipnity-seed/active-catalog-source.ts", "src/i18n/search-head-copy.ts"],
  category: ["src/data/categories.ts", ...LEGACY_PRODUCT_DATA, "src/data/shipnity-seed/active-catalog-source.ts", "src/i18n/search-head-copy.ts"],
  brand: ["src/data/brands.ts", ...LEGACY_PRODUCT_DATA, "src/data/shipnity-seed/active-catalog-source.ts", "src/i18n/search-head-copy.ts"],
  publishedProduct: [
    "src/data/shipnity-seed/active-catalog-source.ts",
    "src/data/shipnity-seed/active-catalog-to-product-master.ts",
    "src/data/shipnity-seed/publication-approvals.ts",
    "src/i18n/product-copy-en.ts",
    "src/i18n/search-head-copy.ts",
  ],
  legacyProductShared: ["src/i18n/product-copy-th.ts", "src/i18n/search-head-copy.ts", "src/data/shipnity-seed/legacy-price-approvals.ts"],
  guides: ["src/data/guides.ts", "src/i18n/guides-copy.ts", "src/i18n/search-head-copy.ts"],
  technology: ["src/data/technology.ts", "src/i18n/technology-copy.ts", "src/i18n/search-head-copy.ts"],
  eLiquid: ["src/data/flavors.ts", "src/i18n/flavor-copy.ts", "src/app/e-liquid", "src/i18n/search-head-copy.ts"],
  compare: ["src/app/compare", "src/components/tools/CompareTool.tsx"],
  finder: ["src/app/finder", "src/components/tools/FinderTool.tsx", "src/i18n/finder-copy.ts", "src/lib/finder.ts"],
  faq: ["src/app/faq", "src/data/faqs.ts", "src/i18n/faq-copy.ts"],
  about: ["src/app/about", "src/i18n/search-head-copy.ts"],
  howToOrder: ["src/app/how-to-order", "src/i18n/service-pages/how-to-order.tsx", "src/i18n/service-pages/shared.tsx"],
  shipping: ["src/app/shipping", "src/i18n/service-pages/shipping.tsx", "src/i18n/service-pages/shared.tsx"],
  warranty: ["src/app/warranty", "src/i18n/service-pages/claims-policy.tsx", "src/i18n/service-pages/shared.tsx"],
  contact: ["src/app/contact", "src/i18n/service-pages/contact.tsx", "src/data/contact.ts", "src/i18n/search-head-copy.ts"],
  privacy: ["src/app/privacy", "src/i18n/service-pages/privacy.tsx"],
  search: ["src/app/search", "src/components/tools/SearchTool.tsx", "src/lib/catalog-search.ts", "src/data/search-aliases.ts"],
  favorites: ["src/app/favorites", "src/components/tools/FavoritesList.tsx"],
} as const satisfies Record<string, readonly string[]>;

export type ContentFamily = keyof typeof CONTENT_SOURCES;

/** A legacy product's own date is its brand file's; brand ids not listed (the "Unbranded" pool)
 *  live in unbranded.ts. */
export function legacyProductSource(brandId: string): string[] {
  return [`src/data/products/${LEGACY_PRODUCT_FILES[brandId] ?? "unbranded.ts"}`, ...CONTENT_SOURCES.legacyProductShared];
}

/** Every path any page can cite — what scripts/content-dates.ts asks git about. */
export function allContentPaths(): string[] {
  const set = new Set<string>();
  for (const paths of Object.values(CONTENT_SOURCES)) for (const p of paths) set.add(p);
  for (const p of LEGACY_PRODUCT_DATA) set.add(p);
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

/** Calendar date (YYYY-MM-DD, Bangkok time — the shop's day, like the hand-typed value it
 *  replaces) for JSON-LD `dateModified`. */
export function familyModifiedDate(family: ContentFamily): string {
  return familyLastModified(family).toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
}
