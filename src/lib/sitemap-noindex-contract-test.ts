/**
 * OKami24 — the sitemap and `robots` must say the same thing (round "leftovers", 2026-09-22).
 *
 * A page that sets `robots: { index: false }` and is also listed in sitemap.xml sends a crawler
 * two opposite instructions about the same URL; Search Console files the result under "Submitted
 * URL marked noindex". The project already applies that rule by hand in two places — an empty
 * category and an empty brand page are noindexed AND left out of the sitemap — but nothing
 * enforced it, so /compare /finder /search /favorites sat in the sitemap while noindex for
 * months. Round "leftovers" dropped them; this test is what stops the pair drifting apart again,
 * for any page, without anyone having to remember the rule.
 *
 * It reads the page files rather than a list: a new noindex page added tomorrow is covered on the
 * day it is written. Only STATIC routes are checked — a dynamic segment's `robots` depends on the
 * params (an empty category, a brand with no product), and those two cases are already decided at
 * the source by `categoriesWithProducts()` / `brandsWithProducts()`, which is the mechanism this
 * test deliberately does not duplicate.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { SITE_URL } from "@/lib/seo";

export interface SitemapNoindexContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, "src", "app");

/** The four tool pages this round removed — kept only so the DETECTOR cannot rot unnoticed: if a
 *  refactor stops recognising `NOINDEX_FOLLOW`, this list still proves the check has teeth. */
const KNOWN_NOINDEX_ROUTES = ["/compare", "/finder", "/search", "/favorites"];

/** Every `page.tsx` under src/app whose route has no dynamic segment, as "/route" → source. */
function staticPageSources(): Map<string, string> {
  const out = new Map<string, string>();
  function walk(dir: string) {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
      } else if (entry === "page.tsx") {
        const rel = path.relative(APP_DIR, path.dirname(full)).split(path.sep).filter(Boolean);
        // A dynamic segment ([slug]) or a route group ((group)) is not a literal URL.
        if (rel.some((seg) => seg.startsWith("[") || seg.startsWith("("))) continue;
        out.set("/" + rel.join("/"), readFileSync(full, "utf8"));
      }
    }
  }
  walk(APP_DIR);
  return out;
}

/**
 * True when the page is noindex for EVERY visit — a bare `...NOINDEX_FOLLOW,` or an explicit
 * `robots: { index: false`. A conditional spread (`...(isEmpty ? NOINDEX_FOLLOW : {})`) is not
 * counted: that page is noindex only for some params, which is the dynamic case above.
 */
function isAlwaysNoindex(source: string): boolean {
  if (/robots:\s*\{\s*index:\s*false/.test(source)) return true;
  return /(^|[^(])\.\.\.NOINDEX_FOLLOW\s*,/m.test(source);
}

export function runSitemapNoindexContractTests(): SitemapNoindexContractResult[] {
  const results: SitemapNoindexContractResult[] = [];
  function check(name: string, passed: boolean, detail: string = "") {
    results.push({ name, passed, detail });
  }

  const entries = sitemap();
  const listed = new Set(entries.map((e) => e.url.replace(SITE_URL, "") || "/"));
  const pages = staticPageSources();
  const noindexRoutes = [...pages.entries()].filter(([, src]) => isAlwaysNoindex(src)).map(([route]) => route);

  // ---- 1. The detector still recognises the pages we know are noindex ----
  const undetected = KNOWN_NOINDEX_ROUTES.filter((r) => !noindexRoutes.includes(r));
  check(
    `the noindex detector still sees the known tool pages (${KNOWN_NOINDEX_ROUTES.length})`,
    undetected.length === 0,
    undetected.length > 0 ? `not detected as noindex any more: ${undetected.join(", ")} — the detector, not the pages, is what to look at` : noindexRoutes.join(", ")
  );

  // ---- 2. No always-noindex static page is offered to a crawler ----
  const contradictions = noindexRoutes.filter((r) => listed.has(r === "/" ? "/" : r));
  check(
    `no noindex page is listed in the sitemap (${noindexRoutes.length} noindex static page(s) checked)`,
    contradictions.length === 0,
    contradictions.length > 0
      ? `both noindex and in sitemap.xml: ${contradictions.join(", ")} — remove it from STATIC_ROUTES in src/app/sitemap.ts, or drop its NOINDEX_FOLLOW`
      : "sitemap and robots agree"
  );

  // ---- 3. The sitemap still has real content (a test that passes on an empty sitemap is no test) ----
  check(`sitemap is not empty`, entries.length > 0, `${entries.length} URL(s)`);
  check(
    `every sitemap URL is absolute under SITE_URL`,
    entries.every((e) => e.url.startsWith(SITE_URL)),
    entries.filter((e) => !e.url.startsWith(SITE_URL)).map((e) => e.url).join(", ") || `${entries.length} URL(s) under ${SITE_URL}`
  );
  const duplicates = [...listed].length !== entries.length;
  check(`no URL appears twice`, !duplicates, duplicates ? `${entries.length} entries, ${listed.size} distinct` : `${entries.length} distinct`);

  return results;
}

if (require.main === module) {
  const results = runSitemapNoindexContractTests();
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
