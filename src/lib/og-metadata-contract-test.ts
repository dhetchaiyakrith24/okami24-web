/**
 * OKami24 — share-card (Open Graph) contract tests (round "share-deadend", 2026-09-22).
 *
 * `scripts/og-gate.js` is the real gate: it reads the rendered HTML of all 105 pages and checks
 * that every share card matches its page. It needs a running server, so it runs at a round
 * close. This file is the part that can run on every `npm run verify:catalog`, without a
 * server — it guards the two source-level mistakes that produced the bug and that would
 * produce it again:
 *
 *   1. The root layout naming `title`/`description` inside `openGraph`. Next.js inherits that
 *      object into every page that does not set its own, so those two strings became the share
 *      card of 52 of the 105 pages (live measurement, `_incoming/share-deadend/
 *      og-gate-before-live.log`). With them absent, Next fills each page's og:title/
 *      og:description from that page's own title/description.
 *   2. A page setting `openGraph` by hand instead of through `openGraphWithImage()`. Setting
 *      the object replaces the parent's wholesale, so a hand-written one silently drops the
 *      default share image (src/app/opengraph-image.tsx) — the reason the old code chose to
 *      leave openGraph unset rather than fill it in.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

export interface OgMetadataContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

const ROOT = process.cwd();

function appFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...appFiles(full));
    else if (/\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

/** The `openGraph: {` block that starts at `from`, up to its matching brace. */
function openGraphBlock(src: string, from: number): string {
  let depth = 0;
  for (let i = from; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") {
      depth--;
      if (depth === 0) return src.slice(from, i + 1);
    }
  }
  return src.slice(from);
}

export function runOgMetadataContractTests(): OgMetadataContractResult[] {
  const results: OgMetadataContractResult[] = [];
  function check(name: string, passed: boolean, detail: string = "") {
    results.push({ name, passed, detail });
  }

  // ---- 1. The root layout's openGraph carries no title/description ----
  {
    const layout = readFileSync(path.join(ROOT, "src", "app", "layout.tsx"), "utf8");
    const i = layout.indexOf("openGraph: {");
    check("src/app/layout.tsx has an openGraph block", i >= 0, "");
    if (i >= 0) {
      const block = openGraphBlock(layout, layout.indexOf("{", i));
      check(
        "the root openGraph names no title (it would become 52 pages' share card)",
        !/(^|\s)title:/.test(block),
        block.replace(/\s+/g, " ").slice(0, 200)
      );
      check("the root openGraph names no description (same reason)", !/(^|\s)description:/.test(block), "");
      check("the root openGraph still names siteName and type (every page shares those)", /siteName:/.test(block) && /type:/.test(block), "");
    }
  }

  // ---- 2. No page sets openGraph by hand — only through openGraphWithImage() ----
  {
    const offenders: string[] = [];
    for (const file of appFiles(path.join(ROOT, "src", "app"))) {
      const rel = path.relative(ROOT, file).split(path.sep).join("/");
      if (rel === "src/app/layout.tsx") continue;
      const src = readFileSync(file, "utf8");
      // A page may mention openGraph in a comment or call the helper; what it must not do is
      // open its own object literal.
      for (const m of src.matchAll(/openGraph:\s*\{/g)) offenders.push(`${rel}:${src.slice(0, m.index).split("\n").length}`);
    }
    check(
      "no page under src/app builds its own openGraph object (use openGraphWithImage so the default image survives)",
      offenders.length === 0,
      offenders.join(", ") || "none"
    );
  }

  // ---- 3. openGraphWithImage repeats what the replaced parent object carried ----
  {
    const seo = readFileSync(path.join(ROOT, "src", "lib", "seo.ts"), "utf8");
    const i = seo.indexOf("export function openGraphWithImage");
    check("src/lib/seo.ts exports openGraphWithImage", i >= 0, "");
    if (i >= 0) {
      const fn = seo.slice(i, seo.indexOf("\n}\n", i));
      check("openGraphWithImage sets an image (its whole reason to exist)", /images:\s*\[/.test(fn), "");
      check("openGraphWithImage repeats siteName and type (setting openGraph drops the parent's)", /siteName:/.test(fn) && /type:/.test(fn), "");
    }
  }

  // ---- 4. The default share image the root relies on is still there ----
  {
    const ogImage = path.join(ROOT, "src", "app", "opengraph-image.tsx");
    let exists = true;
    try {
      statSync(ogImage);
    } catch {
      exists = false;
    }
    check("src/app/opengraph-image.tsx exists (the file-convention default card image)", exists, "");
  }

  return results;
}

if (require.main === module) {
  const results = runOgMetadataContractTests();
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
