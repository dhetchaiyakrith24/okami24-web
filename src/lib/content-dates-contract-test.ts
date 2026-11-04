/**
 * OKami24 — content-dates contract tests (round "search-price" batch 3, 2026-09-22).
 *
 * `src/data/content-dates.json` is generated from git by scripts/content-dates.ts and read at
 * build time by sitemap.ts (lastmod) and the article pages (Article dateModified). Nothing at
 * build time can tell whether it is stale — this test can, because it runs where git is
 * (`npm run verify:catalog`, part of every round close): for every path the JSON lists it asks
 * git for the newest commit and demands the same answer. A copy commit without a regenerated JSON
 * therefore fails the close, which is the whole point.
 *
 * Owner 05/11: "pages" in the JSON dates each page by what a reader gets on it (scripts/lib/page-substance.ts). Section 6
 * proves on the real catalog that a picture rename moves no date and a text change moves exactly its own page.
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import contentDates from "@/data/content-dates.json";
import sitemap from "@/app/sitemap";
import { guides, heldGuides } from "@/data/guides";
import { technologyEntries } from "@/data/technology";
import { allContentPaths, CONTENT_SOURCES, contentLastModified, familyLastModified, familyModifiedDate, GUIDE_EXTRA_SOURCES, guideModifiedDate } from "@/lib/content-dates";
import { SITE_URL } from "@/lib/seo";
import { computeGuideDates } from "../../scripts/lib/guide-dates";
import { loadPageSources } from "../../scripts/lib/page-sources";
import { fingerprint, nextPages, pageSubstances, SUBSTANCE_VERSION, type PageDate } from "../../scripts/lib/page-substance";

export interface ContentDatesContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

const ROOT = process.cwd();
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/;

function gitDate(relPath: string): string {
  // Same as scripts/content-dates.ts: the AUTHOR date (kept by the post-commit amend, owner 30/09); newer git prints a
  // UTC date as "…Z", older git as "…+00:00".
  return execFileSync("git", ["log", "-1", "--format=%aI", "--", relPath], { cwd: ROOT, encoding: "utf8" }).trim().replace(/Z$/, "+00:00");
}

/** A copy of `value` with `edit` applied to every string under every key, at any depth. */
function mapStrings(value: unknown, edit: (text: string, key: string) => string, key = ""): unknown {
  if (typeof value === "string") return edit(value, key);
  if (Array.isArray(value)) return value.map((v) => mapStrings(v, edit, key));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, mapStrings(v, edit, k)]));
  return value;
}

export function runContentDatesContractTests(): ContentDatesContractResult[] {
  const results: ContentDatesContractResult[] = [];
  function check(name: string, passed: boolean, detail: string = "") {
    results.push({ name, passed, detail });
  }
  const recorded: Record<string, string> = contentDates.paths;
  const expected = allContentPaths();

  // ---- 1. Every path the mapping names exists on disk and has a recorded date ----
  const missingOnDisk = expected.filter((p) => !existsSync(path.join(ROOT, p)));
  check(`every content source path exists (${expected.length})`, missingOnDisk.length === 0, missingOnDisk.join(", ") || "all exist");
  const notRecorded = expected.filter((p) => !(p in recorded));
  check(`every content source path has a date in content-dates.json`, notRecorded.length === 0, notRecorded.join(", ") || "all recorded");
  const extra = Object.keys(recorded).filter((p) => !expected.includes(p));
  check(`content-dates.json lists no path the mapping no longer names`, extra.length === 0, extra.join(", ") || "none");

  // ---- 2. Every recorded date is a git author date, and it is git's CURRENT answer ----
  const badFormat = Object.entries(recorded).filter(([, d]) => !ISO.test(d)).map(([p]) => p);
  check(`every recorded date is an ISO-8601 author date`, badFormat.length === 0, badFormat.join(", ") || "all well-formed");
  const stale = Object.entries(recorded)
    .map(([p, d]) => ({ p, recorded: d, git: gitDate(p) }))
    .filter((r) => r.git && r.git !== r.recorded);
  check(
    `content-dates.json matches git for every path (run: npx tsx scripts/content-dates.ts)`,
    stale.length === 0,
    stale.map((r) => `${r.p}: json ${r.recorded} ≠ git ${r.git}`).join("; ") || `${Object.keys(recorded).length} paths current`
  );

  // ---- 3. What the pages read from it resolves, and is never "now" ----
  const buildTime = Date.now();
  for (const family of Object.keys(CONTENT_SOURCES) as (keyof typeof CONTENT_SOURCES)[]) {
    let ok = true;
    let detail = "";
    try {
      const d = familyLastModified(family);
      ok = d.getTime() < buildTime - 1000;
      detail = d.toISOString();
    } catch (e) {
      ok = false;
      detail = String(e);
    }
    check(`family "${family}" resolves to a past commit date`, ok, detail);
  }

  // ---- 4. Article dateModified: a calendar date, on or after datePublished, before today+1 ----
  for (const [family, records] of [
    ["guides", guides],
    ["technology", technologyEntries],
  ] as const) {
    const modified = familyModifiedDate(family);
    check(`${family}: dateModified "${modified}" is YYYY-MM-DD`, /^\d{4}-\d{2}-\d{2}$/.test(modified), "");
    const before = records.filter((r) => r.publishedAt && r.publishedAt > modified).map((r) => r.slug);
    check(`${family}: dateModified is not earlier than any datePublished`, before.length === 0, before.join(", ") || `published ≤ ${modified}`);
    const typed = records.filter((r) => "updatedAt" in r);
    check(`${family}: no record still carries a hand-typed updatedAt`, typed.length === 0, typed.map((r) => r.slug).join(", ") || "none");
  }

  // ---- 4b. Per-guide dates (round SEO ฉ batch 4): one date per guide = the newest commit that changed ITS text ----
  const recordedGuides: Record<string, string> = (contentDates as { guides?: Record<string, string> }).guides ?? {};
  const guideIds = [...guides, ...heldGuides].map((g) => g.id);
  const missingGuides = guideIds.filter((id) => !(id in recordedGuides));
  check(`every guide has its own date in content-dates.json "guides"`, missingGuides.length === 0, missingGuides.join(", ") || `${guideIds.length} guides`);
  const extraGuides = Object.keys(recordedGuides).filter((id) => !guideIds.includes(id));
  check(`content-dates.json "guides" lists no guide that no longer exists`, extraGuides.length === 0, extraGuides.join(", ") || "none");
  let gitGuides: Record<string, string> = {};
  let gitError = "";
  try {
    gitGuides = computeGuideDates(ROOT, guideIds, GUIDE_EXTRA_SOURCES);
  } catch (e) {
    gitError = String(e);
  }
  const staleGuides = guideIds.filter((id) => gitGuides[id] !== recordedGuides[id]).map((id) => `${id}: json ${recordedGuides[id]} ≠ git ${gitGuides[id]}`);
  check(`every guide date matches git (run: npx tsx scripts/content-dates.ts)`, !gitError && staleGuides.length === 0, gitError || staleGuides.join("; ") || "all current");
  const earlier = [...guides, ...heldGuides].filter((g) => g.id in recordedGuides && g.publishedAt && guideModifiedDate(g.id, g.publishedAt) < g.publishedAt).map((g) => g.id);
  check(`guide dateModified is never earlier than its datePublished`, earlier.length === 0, earlier.join(", ") || "all ≥ published");
  const guidePageSrc = readFileSync(path.join(ROOT, "src", "app", "guides", "[slug]", "page.tsx"), "utf8");
  check(`the guide page dates each article by its own text (guideModifiedDate), not the guide family`, guidePageSrc.includes("guideModifiedDate(") && !guidePageSrc.includes('familyModifiedDate("guides")'), "");

  // ---- 5. The sitemap module no longer stamps build time ----
  const sitemapSrc = readFileSync(path.join(ROOT, "src", "app", "sitemap.ts"), "utf8");
  check(`sitemap.ts does not use new Date() for lastModified`, !/lastModified:\s*new Date\(\)/.test(sitemapSrc), "");
  check(`sitemap.ts reads content-dates`, sitemapSrc.includes("@/lib/content-dates"), "");
  check(`sitemap.ts dates each guide by its own text (guideLastModified)`, sitemapSrc.includes("guideLastModified(g.id)"), "");
  check(`contentLastModified throws on an unknown path set (never silently "now")`, (() => {
    try {
      contentLastModified(["does/not/exist.ts"]);
      return false;
    } catch {
      return true;
    }
  })(), "");

  // ---- 6. Page dates (owner 05/11): every page dated, the JSON current, and only substance moves a date ----
  const recordedPages = (contentDates as { pages?: Record<string, PageDate> }).pages ?? {};
  const sources = loadPageSources();
  const substances = pageSubstances(sources);
  const fingerprints = Object.fromEntries(Object.keys(substances).map((p) => [p, fingerprint(substances[p])]));
  const entries = sitemap();
  const pathOf = (url: string) => url.slice(SITE_URL.length) || "/";
  const sitemapPaths = entries.map((e) => pathOf(e.url));
  const undated = entries.filter((e) => !e.lastModified).map((e) => pathOf(e.url));
  check(`every sitemap URL has a date (${entries.length})`, undated.length === 0, undated.join(", ") || "all dated");
  const notInSitemap = Object.keys(fingerprints).filter((p) => !sitemapPaths.includes(p));
  check(`every page dated by substance is a sitemap URL`, notInSitemap.length === 0, notInSitemap.join(", ") || "all listed");
  check(`"pages" was written by this definition of substance (version ${SUBSTANCE_VERSION})`, (contentDates as { pagesVersion?: number }).pagesVersion === SUBSTANCE_VERSION, "");
  const stalePages = Object.keys(fingerprints).filter((p) => recordedPages[p]?.fp !== fingerprints[p]);
  const gonePages = Object.keys(recordedPages).filter((p) => !(p in fingerprints));
  check(`"pages" matches the catalog (run: npx tsx scripts/content-dates.ts)`, stalePages.length + gonePages.length === 0, [...stalePages, ...gonePages].join(", ") || `${Object.keys(fingerprints).length} pages current`);
  const commitDates = new Set(execFileSync("git", ["log", "--format=%aI", "HEAD"], { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 26 }).split("\n").map((d) => d.trim().replace(/Z$/, "+00:00")));
  const inventedDates = Object.entries(recordedPages).filter(([, r]) => !commitDates.has(r.date)).map(([p, r]) => `${p} ${r.date}`);
  check(`every page date is the date of a real commit (never typed, never "now")`, inventedDates.length === 0, inventedDates.join(", ") || "all real");

  const moved = (edit: (text: string, key: string) => string) => {
    const edited = mapStrings(JSON.parse(JSON.stringify(substances)), edit) as Record<string, unknown>;
    return Object.keys(edited).filter((p) => fingerprint(edited[p]) !== fingerprints[p]);
  };
  const renamed = moved((text, key) => (key === "alt" ? `${text} new` : text.replace(/\.(webp|png|jpe?g|mp4)\b/g, "-wm9.$1")));
  check(`renaming every picture on the site moves no page date`, renamed.length === 0, renamed.slice(0, 5).join(", ") || `${Object.keys(substances).length} pages held`);
  const sample = sources.legacyProducts[0];
  const pagePath = `/products/${sample.slug}`;
  const reworded = { ...substances, [pagePath]: mapStrings(JSON.parse(JSON.stringify(substances[pagePath])), (text, key) => (key === "tagline" ? `${text} new` : text)) };
  const rewordedPages = Object.keys(reworded).filter((p) => fingerprint(reworded[p]) !== fingerprints[p]);
  check(`rewording one product moves that page only`, rewordedPages.length === 1 && rewordedPages[0] === pagePath, rewordedPages.join(", "));
  const fitted = sources.legacyProducts.find((p) => ((sources.productCopy(p.slug) as { compatible: unknown[] }).compatible ?? []).length > 0);
  const fittedPath = `/products/${fitted?.slug}`;
  const unfitted = JSON.parse(JSON.stringify(substances[fittedPath] ?? {}));
  if (unfitted.copy) unfitted.copy.compatible = [];
  check(`what a product works with counts as substance`, Boolean(fitted) && fingerprint(unfitted) !== fingerprints[fittedPath], fittedPath);
  const carded = JSON.parse(JSON.stringify(substances))[`/products/${sources.categories[0].slug}`];
  carded.listed = mapStrings(carded.listed, (text, key) => text + (key === "" ? " new" : ""));
  check(`a listing page's card text counts as substance`, fingerprint(carded) !== fingerprints[`/products/${sources.categories[0].slug}`], "");
  const priced = JSON.parse(JSON.stringify(substances[pagePath]));
  priced.record.sellingPrice = 1;
  priced.record.availabilityStatus = "out-of-stock";
  check(`a price or stock change moves no page date`, fingerprint(priced) === fingerprints[pagePath], "");
  const was = { "/a": { date: "old", fp: "1" }, "/b": { date: "old", fp: "2" }, "/gone": { date: "old", fp: "3" } };
  const next = nextPages(was, { "/a": "1", "/b": "9", "/new": "4" }, "stamp");
  check(`only a moved or new fingerprint takes the new date, and gone pages leave`, next["/a"].date === "old" && next["/b"].date === "stamp" && next["/new"].date === "stamp" && !("/gone" in next), JSON.stringify(next));

  return results;
}

if (require.main === module) {
  const results = runContentDatesContractTests();
  const failed = results.filter((r) => !r.passed);
  for (const r of results) {
    console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `\n      ${r.detail}` : ""}`);
  }
  if (failed.length > 0) {
    console.error(`\n${failed.length} of ${results.length} checks failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} checks passed.`);
}
