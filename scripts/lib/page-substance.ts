/**
 * OKami24 — what a reader gets on a page, as data (owner 05/11 "ผ่านตามแนะนำ": sitemap dates must be true per page).
 *
 * Before this, a product's lastmod was the newest commit to its whole brand file, so one watermark rename re-dated every
 * product in that file (148 of 182 URLs read 2026-11-04). Here each page is reduced to its SUBSTANCE: the text, specs,
 * options and facts a reader gets, read from the same objects the pages render (not from file text, so helpers and spreads
 * are seen) with pictures, prices, stock and provenance removed. `fingerprint()` hashes that; `nextPages()` moves a page's
 * date only when its fingerprint moved. Written into src/data/content-dates.json "pages" by scripts/content-dates.ts,
 * guarded by src/lib/content-dates-contract-test.ts. The site only reads the JSON: this file never reaches the build.
 *
 * Pure on purpose: no catalog import here, so scripts/page-dates-baseline.ts can run it against old trees.
 * Changing what counts as substance changes every fingerprint: bump SUBSTANCE_VERSION and run
 * `npx tsx scripts/content-dates.ts --rekey` (keeps the dates) in the same commit.
 */
import { createHash } from "node:crypto";

export const SUBSTANCE_VERSION = 1;

/** Keys that carry no reader substance, at any depth. Owner table 05/11: picture/price = nothing. */
const NOT_SUBSTANCE = new Set([
  // pictures and how they sit
  "assets", "image", "images", "variantFallbackImage", "src", "alt", "width", "height", "x", "y", "transparent",
  "transparentBackground", "openOnCardPhoto", "ownFloor", "swatchHex", "glyphKind", "storyLayout", "storyStartRight",
  "storyColoursAfter", "storyDetails",
  // where a picture or a value came from (not shown as text)
  "angle", "sourceName", "sourceUrl", "referenceUrl",
  // price and stock: their own systems, not a re-read of the page
  "availability", "availabilityStatus", "sellingPrice", "priceReferenceValue", "priceReferenceSource", "publicationStatus",
]);

const LOCAL_MEDIA_PATH = /\/assets\/[^\s"'`)]*/g;

/** A deep copy with everything that is not substance removed; object keys sorted, so a reorder is not a change. */
export function substance(value: unknown): unknown {
  if (typeof value === "string") {
    const text = value.replace(LOCAL_MEDIA_PATH, "").replace(/\s+/g, " ").trim();
    return text === "" ? undefined : text;
  }
  if (Array.isArray(value)) {
    const items = value.map(substance).filter((v) => v !== undefined);
    return items.length ? items : undefined;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(value).sort()) {
      if (NOT_SUBSTANCE.has(key)) continue;
      const v = substance((value as Record<string, unknown>)[key]);
      if (v !== undefined) out[key] = v;
    }
    return Object.keys(out).length ? out : undefined;
  }
  return typeof value === "function" || value === null ? undefined : value;
}

export function fingerprint(value: unknown): string {
  return createHash("sha1").update(JSON.stringify(substance(value)) ?? "").digest("hex").slice(0, 12);
}

interface Member { slug: string; displayName: string }
interface Keyed { id: string; slug: string }

/** Everything a page's substance is read from: scripts/lib/page-sources.ts fills it from the catalog. */
export interface PageSources {
  legacyProducts: (Member & { brandId: string; categoryId: string })[];
  publishedProducts: (Member & { brandId: string | null; categoryId: string })[];
  /** Per-slug text that lives outside the product record: copy overlays, article, story, editorial, head rows. */
  productCopy: (slug: string) => unknown;
  categories: Keyed[];
  categoryCopy: (id: string) => unknown;
  brands: Keyed[];
  brandCopy: (id: string) => unknown;
  /** The clip shown on a brand or category page, keyed by page path. */
  collectionVideos: Record<string, unknown>;
  guides: { slug: string; id: string; title: string; dek: string }[];
  guideCopy: (id: string) => unknown;
  technology: Keyed[];
  technologyCopy: (id: string) => unknown[];
  flavors: Keyed[];
  flavorCopy: (id: string) => unknown;
  head: { home: unknown; about: unknown; contact: unknown; products: unknown };
}

const listed = (list: Member[]) => list.map((m) => [m.slug, m.displayName]).sort((a, b) => (a[0] < b[0] ? -1 : 1));

/** What the /technology index shows of an entry: its name and summary, not the article body. */
function listing(entry: unknown): unknown {
  const { name, summary } = (entry ?? {}) as { name?: unknown; summary?: unknown };
  return { name, summary };
}

/** Page path → its substance, for every page dated by substance. Guides keep their own dates (scripts/lib/guide-dates.ts);
 *  service pages and the like have no data behind them and stay dated by their files (CONTENT_SOURCES). A listing page's
 *  substance is its own text + WHICH products it lists, so one product's new sentence does not re-date its category. */
export function pageSubstances(s: PageSources): Record<string, unknown> {
  const pages: Record<string, unknown> = {};
  const all = [...s.legacyProducts, ...s.publishedProducts];
  for (const p of all) pages[`/products/${p.slug}`] = { record: p, copy: s.productCopy(p.slug) };
  for (const c of s.categories) {
    const path = `/products/${c.slug}`;
    pages[path] = { record: c, copy: s.categoryCopy(c.id), clip: s.collectionVideos[path], listed: listed(all.filter((p) => p.categoryId === c.id)) };
  }
  for (const b of s.brands) {
    const path = `/brands/${b.slug}`;
    pages[path] = { record: b, copy: s.brandCopy(b.id), clip: s.collectionVideos[path], listed: listed(all.filter((p) => p.brandId === b.id)) };
  }
  for (const t of s.technology) pages[`/technology/${t.slug}`] = { record: t, copy: s.technologyCopy(t.id) };
  for (const f of s.flavors) pages[`/e-liquid/${f.slug}`] = { record: f, copy: s.flavorCopy(f.id) };
  pages["/"] = { head: s.head.home };
  pages["/about"] = { head: s.head.about };
  pages["/contact"] = { head: s.head.contact };
  pages["/products"] = { head: s.head.products, listed: listed(all) };
  pages["/guides"] = { listed: s.guides.map((g) => [g.slug, g.title, g.dek, s.guideCopy(g.id)]) };
  pages["/technology"] = { listed: s.technology.map((t) => [t.slug, listing(t), s.technologyCopy(t.id).map(listing)]) };
  pages["/e-liquid"] = { listed: s.flavors.map((f) => [f.slug, f, s.flavorCopy(f.id)]) };
  return pages;
}

export interface PageDate { date: string; fp: string }

/** The ratchet: a page keeps its date while its fingerprint holds; a new or changed page takes `stamp`; gone pages go. */
export function nextPages(previous: Record<string, PageDate>, fingerprints: Record<string, string>, stamp: string): Record<string, PageDate> {
  const out: Record<string, PageDate> = {};
  for (const path of Object.keys(fingerprints).sort()) {
    const was = previous[path];
    out[path] = was && was.fp === fingerprints[path] ? was : { date: stamp, fp: fingerprints[path] };
  }
  return out;
}
