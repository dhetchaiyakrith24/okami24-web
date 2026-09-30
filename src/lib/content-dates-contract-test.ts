/**
 * OKami24 — content-dates contract tests (round "search-price" batch 3, 2026-09-22).
 *
 * `src/data/content-dates.json` is generated from git by scripts/content-dates.ts and read at
 * build time by sitemap.ts (lastmod) and the article pages (Article dateModified). Nothing at
 * build time can tell whether it is stale — this test can, because it runs where git is
 * (`npm run verify:catalog`, part of every round close): for every path the JSON lists it asks
 * git for the newest commit and demands the same answer. A copy commit without a regenerated JSON
 * therefore fails the close, which is the whole point.
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import contentDates from "@/data/content-dates.json";
import { allProducts } from "@/data/products";
import { guides } from "@/data/guides";
import { technologyEntries } from "@/data/technology";
import { allContentPaths, CONTENT_SOURCES, contentLastModified, familyLastModified, familyModifiedDate, legacyProductSource } from "@/lib/content-dates";

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
  for (const p of allProducts) {
    const file = legacyProductSource(p.brandId)[0];
    const src = readFileSync(path.join(ROOT, file), "utf8");
    check(`legacy product ${p.slug} is dated by the file that defines it (${path.basename(file)})`, src.includes(`slug: "${p.slug}"`), src.includes(`slug: "${p.slug}"`) ? "" : `slug not found in ${file}`);
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

  // ---- 5. The sitemap module no longer stamps build time ----
  const sitemapSrc = readFileSync(path.join(ROOT, "src", "app", "sitemap.ts"), "utf8");
  check(`sitemap.ts does not use new Date() for lastModified`, !/lastModified:\s*new Date\(\)/.test(sitemapSrc), "");
  check(`sitemap.ts reads content-dates`, sitemapSrc.includes("@/lib/content-dates"), "");
  check(`contentLastModified throws on an unknown path set (never silently "now")`, (() => {
    try {
      contentLastModified(["does/not/exist.ts"]);
      return false;
    } catch {
      return true;
    }
  })(), "");

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
