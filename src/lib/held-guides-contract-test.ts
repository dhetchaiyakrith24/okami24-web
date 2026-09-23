/**
 * OKami24 — a held article stays invisible (round 10B, 2026-09-24).
 *
 * Round 10B writes articles that the owner holds back until the SEO_BASELINE read of 2026-10-05
 * (ruling D3). The instruction set the bar for "held": the URL 404s, it is not in sitemap.xml, it
 * never shows in a product page's "อ่านต่อ" box, and no public article links to it — and publishing
 * it later must be a one-line change. src/data/guides.ts implements that with HELD_GUIDE_IDS; this
 * test proves each of the four points from the data rather than trusting the filter, so a second
 * list of guides or a hand-written `/guides/...` link added next month fails here on the day it is
 * written.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { getGuide, guides, heldGuides, HELD_GUIDE_IDS } from "@/data/guides";
import { GUIDES_COPY_TH, GUIDES_COPY_ZH } from "@/i18n/guides-copy";
import { technologyEntries } from "@/data/technology";
import { allProducts } from "@/data/products";
import { getPublishedProducts } from "@/data/shipnity-seed/storefront-bridge";
import { relatedArticlesForLegacy, relatedArticlesForPublished } from "@/lib/article-relevance";
import sitemap from "@/app/sitemap";

export interface HeldGuidesContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src");
/** The two files that hold the held records themselves; their live records are checked field by field below. */
const RECORD_FILES = new Set([path.join(SRC_DIR, "data", "guides.ts"), path.join(SRC_DIR, "i18n", "guides-copy.ts")]);

function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) sourceFiles(full, out);
    else if (/\.(ts|tsx|json)$/.test(entry)) out.push(full);
  }
  return out;
}

/** Every string a public article shows (English record + Thai/Chinese copy, body + FAQ). */
function publicArticleText(): { where: string; text: string }[] {
  const out: { where: string; text: string }[] = [];
  const push = (where: string, text: string) => out.push({ where, text });
  for (const g of guides) {
    const copies = [
      { lang: "en", body: g.body, faq: g.faq, title: g.title, dek: g.dek },
      { lang: "th", ...GUIDES_COPY_TH[g.id] },
      { lang: "zh", ...GUIDES_COPY_ZH[g.id] },
    ];
    for (const c of copies) {
      if (!c.body) continue;
      push(`${g.id} (${c.lang}) title/dek`, `${c.title ?? ""} ${c.dek ?? ""}`);
      for (const s of c.body) {
        push(`${g.id} (${c.lang}) "${s.heading}"`, [s.heading, ...s.paragraphs, ...(s.subsections ?? []).flatMap((x) => [x.heading, ...x.paragraphs])].join("\n"));
      }
      for (const f of c.faq ?? []) push(`${g.id} (${c.lang}) FAQ`, `${f.question}\n${f.answer}`);
    }
  }
  for (const t of technologyEntries) push(`technology ${t.id}`, JSON.stringify(t));
  return out;
}

export function runHeldGuidesContractTests(): HeldGuidesContractResult[] {
  const results: HeldGuidesContractResult[] = [];
  const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

  // ---- 1. Every held id names a real record (a typo would silently publish nothing and hold nothing) ----
  const heldIds = [...HELD_GUIDE_IDS];
  const unknown = heldIds.filter((id) => !heldGuides.some((g) => g.id === id));
  check(`every HELD_GUIDE_IDS entry is a real article (${heldIds.length})`, unknown.length === 0, unknown.length ? `no record with id: ${unknown.join(", ")}` : heldIds.join(", ") || "no article is held");

  // ---- 2. A held article is not a page: out of `guides`, getGuide misses, not in the sitemap ----
  const heldSlugs = heldGuides.map((g) => g.slug);
  const inGuides = heldSlugs.filter((s) => guides.some((g) => g.slug === s));
  const resolvable = heldSlugs.filter((s) => getGuide(s) !== undefined);
  check(`no held article is in \`guides\` or resolvable by getGuide (so its URL 404s)`, inGuides.length === 0 && resolvable.length === 0, [...inGuides, ...resolvable].join(", ") || `${heldSlugs.length} held, ${guides.length} public`);
  const sitemapUrls = sitemap().map((e) => e.url);
  const listed = heldSlugs.filter((s) => sitemapUrls.some((u) => u.endsWith(`/guides/${s}`)));
  check(`no held article is in sitemap.xml`, listed.length === 0, listed.join(", ") || `${sitemapUrls.length} URL(s) checked`);

  // ---- 3. No "อ่านต่อ" box on any product page offers a held article ----
  const boxes = [
    ...allProducts.map((p) => ({ slug: p.slug, hrefs: relatedArticlesForLegacy(p).map((a) => a.href) })),
    ...getPublishedProducts().map((p) => ({ slug: p.slug, hrefs: relatedArticlesForPublished(p).map((a) => a.href) })),
  ];
  const boxHits = boxes.flatMap((b) => b.hrefs.filter((h) => heldSlugs.some((s) => h === `/guides/${s}`)).map((h) => `${b.slug} → ${h}`));
  check(`no product page's "อ่านต่อ" box links a held article (${boxes.length} product pages)`, boxHits.length === 0, boxHits.join(", ") || "none");

  // ---- 4. Nothing public links to a held article ----
  const textHits = publicArticleText().flatMap(({ where, text }) => heldSlugs.filter((s) => text.includes(`/guides/${s}`)).map((s) => `${where} → /guides/${s}`));
  check(`no public article or technology page links a held article`, textHits.length === 0, textHits.join("; ") || "none");
  const fileHits: string[] = [];
  for (const file of sourceFiles(SRC_DIR)) {
    if (RECORD_FILES.has(file) || file.endsWith("held-guides-contract-test.ts")) continue;
    const src = readFileSync(file, "utf8");
    for (const s of heldSlugs) if (src.includes(`/guides/${s}`) || src.includes(`"${s}"`)) fileHits.push(`${path.relative(ROOT, file)} names ${s}`);
  }
  check(`no other source file names a held article`, fileHits.length === 0, fileHits.join("; ") || "none");

  return results;
}

if (require.main === module) {
  const results = runHeldGuidesContractTests();
  const failed = results.filter((r) => !r.passed);
  for (const r of results) console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `\n      ${r.detail}` : ""}`);
  if (failed.length > 0) {
    console.error(`\n${failed.length} of ${results.length} checks failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} checks passed.`);
}
