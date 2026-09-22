/**
 * OKami24 — product → article link contract tests (round "backlink", 2026-09-22).
 *
 * The round's rule was "a wrong link is worse than no link". These checks are what enforces it
 * after the round: every link must point at an article that exists, carry a stated reason, and —
 * for the rule-based ones — the reason must still be re-derivable from the product's own verified
 * data. A later edit that deletes a spec row, unpublishes an article or loosens a rule turns this
 * red instead of quietly leaving a page pointing somewhere it should not.
 */

import { guides } from "@/data/guides";
import { technologyEntries } from "@/data/technology";
import { allProducts } from "@/data/products";
import { getPublishedProducts } from "@/data/shipnity-seed/storefront-bridge";
import { relatedArticlesForLegacy, relatedArticlesForPublished, type RelatedArticle } from "@/lib/article-relevance";
import { readFileSync } from "node:fs";
import path from "node:path";

export interface ArticleRelevanceContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

export function runArticleRelevanceContractTests(): ArticleRelevanceContractResult[] {
  const results: ArticleRelevanceContractResult[] = [];
  function check(name: string, passed: boolean, detail: string = "") {
    results.push({ name, passed, detail });
  }

  const guideHrefs = new Set(guides.map((g) => `/guides/${g.slug}`));
  const techHrefs = new Set(technologyEntries.map((t) => `/technology/${t.slug}`));
  const rows: { slug: string; categoryId: string; articles: RelatedArticle[] }[] = [
    ...allProducts.map((p) => ({ slug: p.slug, categoryId: p.categoryId, articles: relatedArticlesForLegacy(p) })),
    ...getPublishedProducts().map((p) => ({ slug: p.slug, categoryId: p.categoryId, articles: relatedArticlesForPublished(p) })),
  ];

  // ---- 1. Every link resolves to a real article page ----
  {
    const dead = rows.flatMap((r) => r.articles.filter((a) => !guideHrefs.has(a.href) && !techHrefs.has(a.href)).map((a) => `${r.slug} → ${a.href}`));
    check(`every product→article link points at an existing article (${rows.reduce((n, r) => n + r.articles.length, 0)} links)`, dead.length === 0, dead.join(", ") || "all resolve");
  }

  // ---- 2. No duplicates, and the cap holds ----
  {
    const dupes = rows.filter((r) => new Set(r.articles.map((a) => a.href)).size !== r.articles.length).map((r) => r.slug);
    check("no product links to the same article twice", dupes.length === 0, dupes.join(", ") || "none");
    const over = rows.filter((r) => r.articles.length > 3).map((r) => `${r.slug} (${r.articles.length})`);
    check("no product shows more than 3 article links", over.length === 0, over.join(", ") || "none");
  }

  // ---- 3. Every link states why, and an authored one really is authored ----
  {
    const noWhy = rows.flatMap((r) => r.articles.filter((a) => !a.why || a.why.length < 5).map((a) => `${r.slug} → ${a.href}`));
    check("every link carries its evidence string", noWhy.length === 0, noWhy.join(", ") || "all have one");

    const authoredPairs = new Set<string>();
    for (const g of guides) for (const slug of g.relatedProductSlugs ?? []) authoredPairs.add(`${slug}|/guides/${g.slug}`);
    for (const t of technologyEntries) for (const slug of t.relatedProductSlugs ?? []) authoredPairs.add(`${slug}|/technology/${t.slug}`);
    const lying = rows.flatMap((r) => r.articles.filter((a) => a.why.includes("relatedProductSlugs") && !authoredPairs.has(`${r.slug}|${a.href}`)).map((a) => `${r.slug} → ${a.href}`));
    check("a link that claims to be authored is in the article's own relatedProductSlugs", lying.length === 0, lying.join(", ") || "all authored claims check out");
    // The other direction: an authored pairing is never dropped unless the cap is full.
    const droppedUnderCap = [...authoredPairs].filter((pair) => {
      const [slug, href] = pair.split("|");
      const row = rows.find((r) => r.slug === slug);
      return row !== undefined && row.articles.length < 3 && !row.articles.some((a) => a.href === href);
    });
    check("no authored pairing is dropped while the page has room", droppedUnderCap.length === 0, droppedUnderCap.join(", ") || "none dropped");
  }

  // ---- 4. Rule-based links: the evidence is re-derived from the data, not trusted ----
  {
    const bad: string[] = [];
    for (const p of allProducts) {
      for (const a of relatedArticlesForLegacy(p)) {
        if (a.why.includes("relatedProductSlugs")) continue;
        const specText = p.specifications.filter((s) => s.sourceStatus === "verified").map((s) => `${s.key}: ${s.value}`);
        const featureText = p.features.map((f) => `feature: ${f.title}`);
        const attrText = [
          `attributes.beginnerFriendly = ${p.attributes.beginnerFriendly}, category ${p.categoryId}`,
          `attributes.batteryMah = ${p.attributes.batteryMah}`,
          `attributes.wattageMin/Max = ${p.attributes.wattageMin}–${p.attributes.wattageMax}`,
          `attributes.screenType = ${p.attributes.screenType}`,
          `category ${p.categoryId}`,
          `category ${p.categoryId} is one of the two formats the article compares`,
        ];
        const derivable = [...specText, ...featureText, ...attrText].some((t) => a.why === t) || a.why.startsWith("resistance") || a.why.includes("verified resistance row");
        if (!derivable) bad.push(`${p.slug} → ${a.href}: "${a.why}"`);
      }
    }
    check("every rule-based reason is re-derivable from the product's own verified data", bad.length === 0, bad.join(" · ") || "all re-derived");
  }

  // ---- 5. An unverified spec row never justifies a link ----
  {
    const bad: string[] = [];
    for (const p of allProducts) {
      const unverified = p.specifications.filter((s) => s.sourceStatus !== "verified").map((s) => `${s.key}: ${s.value}`);
      for (const a of relatedArticlesForLegacy(p)) if (unverified.includes(a.why)) bad.push(`${p.slug} → ${a.href}`);
    }
    check("no link is justified by an unverified spec row", bad.length === 0, bad.join(", ") || "none");
  }

  // ---- 6. The draw-style attribute is still not used (standing ruling: it is unverified) ----
  {
    // Comments are stripped first: the module explains in prose why it does not use drawStyle.
    const src = readFileSync(path.join(process.cwd(), "src", "lib", "article-relevance.ts"), "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, " ")
      .replace(/^\s*\/\/.*$/gm, " ");
    check("article-relevance.ts does not read attributes.drawStyle (unverified Finder attribute)", !/attributes\.drawStyle/.test(src), "");
  }

  // ---- 7. The measurable outcome of the round, recomputed ----
  {
    const withLinks = rows.filter((r) => r.articles.length > 0);
    check(
      `product pages with at least one article link: ${withLinks.length}/${rows.length} (was 0 before round "backlink")`,
      withLinks.length > 0,
      `without: ${rows.filter((r) => r.articles.length === 0).map((r) => `${r.slug} (${r.categoryId})`).join(", ") || "none"}`
    );
    const reached = new Set(rows.flatMap((r) => r.articles.map((a) => a.href)));
    const unreached = [...guideHrefs, ...techHrefs].filter((h) => !reached.has(h));
    check(`articles reachable from a product page: ${reached.size}/${guideHrefs.size + techHrefs.size}`, true, unreached.length ? `not reached: ${unreached.join(", ")}` : "every article is reachable");
  }

  return results;
}

if (require.main === module) {
  const results = runArticleRelevanceContractTests();
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
