/**
 * OKami24 — storefront search contract tests (round "search-price", 2026-09-22).
 *
 * Same lightweight convention as the other `*-contract-test.ts` scripts (no framework, a plain
 * result array, auto-discovered by `scripts/verify-catalog.ts`). This is the guard the round
 * asked for: before it, the words the site itself teaches a visitor ("พอตซิสเต็ม",
 * "พอตใช้แล้วทิ้ง", "หัวพอต") found 0 / 1 / 10 products on /search while the catalog held
 * 10 / 10 / 13, and nothing would have noticed if a later edit had made it worse.
 *
 * Every expectation is derived from the data (categories, brands, families, the products
 * themselves), never from a remembered count — the catalog grows and the test must grow with it.
 */

import { brands } from "@/data/brands";
import { categories } from "@/data/categories";
import { families } from "@/data/families";
import { allProducts, hiddenProducts, legacySearchText, searchProducts } from "@/data/products";
import { DORMANT_ALIAS_TERMS, TERM_SEARCH_ALIASES } from "@/data/search-aliases";
import { getPublishedProducts, publishedSearchText, searchPublishedProducts } from "@/data/shipnity-seed/storefront-bridge";
import { normalizeQuery, phraseMatches, queryScore, rankByQuery } from "@/lib/catalog-search";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

export interface CatalogSearchContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

interface Hit {
  slug: string;
  categoryId: string;
  brandId: string | null;
  familyId: string | null;
  name: string;
}

/** Every storefront product as one flat list with the search text /search ranks by. */
function storefront(): { hit: Hit; text: ReturnType<typeof legacySearchText> }[] {
  return [
    ...allProducts.map((p) => ({ hit: { slug: p.slug, categoryId: p.categoryId, brandId: p.brandId, familyId: p.familyId, name: p.displayName }, text: legacySearchText(p) })),
    ...getPublishedProducts().map((p) => ({ hit: { slug: p.slug, categoryId: p.categoryId, brandId: p.brandId, familyId: null, name: p.displayName }, text: publishedSearchText(p) })),
  ];
}

/** Slugs /search would list for `query`, best match first (both catalogs ranked together, the
 *  way SearchTool.tsx does it). */
function search(query: string): string[] {
  return rankByQuery(query, storefront(), (e) => e.text).map((e) => e.hit.slug);
}

function sameSet(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((x) => b.includes(x));
}

function missing(expected: string[], got: string[]): string[] {
  return expected.filter((s) => !got.includes(s));
}

function sourceFilesUnder(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...sourceFilesUnder(full));
    else if (/\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

export function runCatalogSearchContractTests(): CatalogSearchContractResult[] {
  const results: CatalogSearchContractResult[] = [];
  function check(name: string, passed: boolean, detail: string = "") {
    results.push({ name, passed, detail });
  }

  const all = storefront();
  const byCategory = (categoryId: string) => all.filter((e) => e.hit.categoryId === categoryId).map((e) => e.hit.slug);
  const byBrand = (brandId: string) => all.filter((e) => e.hit.brandId === brandId).map((e) => e.hit.slug);
  const byFamily = (familyId: string) => all.filter((e) => e.hit.familyId === familyId).map((e) => e.hit.slug);

  // ---- 1. The Thai and English category labels the site shows find every product of that
  //         category — the exact failure the round was opened for, generalised to every category.
  for (const c of categories) {
    const expected = byCategory(c.id);
    if (expected.length === 0) continue; // an empty category has nothing to find (e-liquid, TEREA sticks today)
    const thai = c.labelTh.split("/").pop()?.trim() ?? "";
    for (const label of [thai, c.shortName]) {
      const got = search(label);
      check(
        `"${label}" finds every product of category ${c.id} (${expected.length})`,
        missing(expected, got).length === 0,
        missing(expected, got).length ? `missing: ${missing(expected, got).join(", ")}` : `found ${got.length}`
      );
    }
  }

  // ---- 2. The round's own pass list (owner-approved spellings), each against the data ----
  const passList: { query: string; expected: string[]; what: string }[] = [
    { query: "marbo", expected: byBrand("salthub"), what: "every SALTHUB product (the line is marketed as Marbo)" },
    { query: "คาลิเบิร์น", expected: byFamily("caliburn"), what: "every Caliburn" },
    { query: "ดราก", expected: byFamily("drag"), what: "every DRAG" },
    { query: "อาร์กัส", expected: byFamily("argus"), what: "every ARGUS" },
  ];
  for (const { query, expected, what } of passList) {
    const got = search(query);
    check(`"${query}" finds ${what} (${expected.length})`, expected.length > 0 && missing(expected, got).length === 0, missing(expected, got).length ? `missing: ${missing(expected, got).join(", ")}` : `found ${got.length}`);
  }
  // "น้ำยา" must not return a device: the shop lists no e-liquid, and a device whose copy says
  // "no e-liquid to fill" is not an answer to "e-liquid" (the reason description paragraphs are
  // kept out of the search text). Prefilled pods and coils may answer.
  {
    const devices = new Set(["pod-systems", "switch-pods", "disposables", "heated-tobacco-devices"]);
    const got = all.filter((e) => queryScore("น้ำยา", e.text) > 0).map((e) => e.hit);
    const wrong = got.filter((h) => devices.has(h.categoryId)).map((h) => h.slug);
    check(`"น้ำยา" returns no device (pod system / switch pod / disposable / HNB device)`, wrong.length === 0, wrong.length ? `devices returned: ${wrong.join(", ")}` : `returned ${got.length}: ${got.map((h) => h.slug).join(", ") || "nothing"}`);
  }

  // ---- 3. Every alias finds exactly what its English term finds as a phrase ("m bar" as one
  //         unit, not m AND bar), and finds something ----
  for (const [alias, terms] of Object.entries(TERM_SEARCH_ALIASES)) {
    const viaAlias = search(alias);
    const viaTerms = all.filter((e) => terms.some((t) => phraseMatches(t, e.text))).map((e) => e.hit.slug);
    // Round "leftovers" (2026-09-22): an alias whose every term is declared dormant is held to
    // the opposite bargain — see DORMANT_ALIAS_TERMS in search-aliases.ts for why, and for what
    // has to happen on the day the brand's photo lands.
    if (terms.every((t) => DORMANT_ALIAS_TERMS.includes(t))) {
      const waiting = hiddenProducts.filter((p) => terms.includes(p.brandId));
      const ok = viaTerms.length === 0 && viaAlias.length === 0 && waiting.length > 0;
      check(
        `dormant alias "${alias}" = ${terms.join(" | ")} — waiting for a storefront product`,
        ok,
        waiting.length === 0
          ? `no hidden product has brandId ${terms.join("/")} — the term is misspelled, or the row in DORMANT_ALIAS_TERMS outlived its product`
          : viaTerms.length > 0
            ? `${terms.join("/")} now finds ${viaTerms.join(", ")} — the wait is over: delete "${terms.join('", "')}" from DORMANT_ALIAS_TERMS so this alias is checked like every other`
            : `dormant, waiting on ${waiting.map((p) => `${p.slug} (${p.hiddenFromStorefront?.reason ?? "hidden"})`).join("; ")}`
      );
    } else {
      check(`alias "${alias}" = ${terms.join(" | ")} (${viaTerms.length})`, viaTerms.length > 0 && sameSet(viaAlias, viaTerms), viaTerms.length === 0 ? "the English term itself finds nothing — dead alias" : sameSet(viaAlias, viaTerms) ? "same set" : `alias: ${viaAlias.join(",")} · term: ${viaTerms.join(",")}`);
    }
    check(`alias key "${alias}" is stored normalised`, normalizeQuery(alias) === alias, "");
  }
  // A term may not sit in the dormant list without an alias that uses it — otherwise the list
  // becomes a place where a deleted alias's excuse lives on.
  {
    const used = new Set(Object.values(TERM_SEARCH_ALIASES).flat());
    const orphans = DORMANT_ALIAS_TERMS.filter((t) => !used.has(t));
    check(`every dormant term is still used by an alias (${DORMANT_ALIAS_TERMS.length})`, orphans.length === 0, orphans.join(", ") || DORMANT_ALIAS_TERMS.join(", "));
  }

  // ---- 3b. Every brand with a product on the storefront has at least one Thai alias (owner,
  //          2026-09-22: a new brand admitted without one must turn this red) ----
  {
    const thai = /[\u0E00-\u0E7F]/;
    const aliasTargets = new Set(
      Object.entries(TERM_SEARCH_ALIASES)
        .filter(([alias]) => thai.test(alias))
        .flatMap(([, terms]) => terms.map((t) => normalizeQuery(t)))
    );
    const brandIdsWithProducts = new Set(all.map((e) => e.hit.brandId));
    for (const b of brands) {
      if (!brandIdsWithProducts.has(b.id)) continue;
      const covered = aliasTargets.has(b.id.toLowerCase()) || aliasTargets.has(normalizeQuery(b.name));
      check(`brand ${b.name} (${byBrand(b.id).length} products) has a Thai search alias`, covered, covered ? "" : `add a Thai spelling → "${b.name.toLowerCase()}" in src/data/search-aliases.ts`);
    }
  }
  check(`no alias is rendered: PRODUCT/TERM aliases are imported only by the search matcher and this test`, (() => {
    const users = sourceFilesUnder(path.join(process.cwd(), "src")).filter((f) => /from "@\/data\/search-aliases"/.test(readFileSync(f, "utf8")));
    return users.every((f) => /catalog-search(-contract-test)?\.ts$/.test(f));
  })(), "");

  // ---- 4. Spellings without spaces (what Search Console records) ----
  check(`"drag6" finds drag-6`, search("drag6").includes("drag-6"), search("drag6").join(","));
  check(`"caliburng5" = "caliburn g5"`, sameSet(search("caliburng5"), search("caliburn g5")), `${search("caliburng5").join(",")} vs ${search("caliburn g5").join(",")}`);
  {
    const mBar = all.filter((e) => /\bm bar\b/i.test(e.hit.name)).map((e) => e.hit.slug);
    check(`"mbar" finds every "M Bar" product (${mBar.length})`, mBar.length > 0 && missing(mBar, search("mbar")).length === 0, `missing: ${missing(mBar, search("mbar")).join(",") || "none"}`);
  }

  // ---- 5. Every token must match (AND), and a word order is not required ----
  check(`"argus g4 mini" narrows to argus-g4-mini`, sameSet(search("argus g4 mini"), ["argus-g4-mini"]), search("argus g4 mini").join(","));
  check(`"mini argus" = "argus mini"`, sameSet(search("mini argus"), search("argus mini")), "");

  // ---- 6. Invisible characters a visitor pastes from the site never change the answer ----
  const WJ = String.fromCharCode(0x2060);
  const NBSP = String.fromCharCode(0x00a0);
  check(`WORD JOINER inside "พอตใช้แล้วทิ้ง" is ignored`, sameSet(search(`พอตใช้${WJ}แล้${WJ}ว${WJ}ทิ้${WJ}ง`), search("พอตใช้แล้วทิ้ง")), "");
  check(`NBSP in "caliburn${NBSP}g5" reads as a space`, sameSet(search(`caliburn${NBSP}g5`), search("caliburn g5")), "");
  check(`upper case "CALIBURN G5" = lower case`, sameSet(search("CALIBURN G5"), search("caliburn g5")), "");

  // ---- 7. Every storefront product can be found by its own name ----
  {
    const unreachable = all.filter((e) => !search(e.hit.name).includes(e.hit.slug)).map((e) => `${e.hit.slug} ("${e.hit.name}")`);
    check(`every storefront product is found by its own display name (${all.length})`, unreachable.length === 0, unreachable.join("; ") || "all reachable");
  }

  // ---- 8. Ranking: a product matched by what it IS comes before one matched by a spec line ----
  {
    const got = search("หัวพอต");
    const pods = byCategory("pods-cartridges");
    const head = got.slice(0, pods.filter((s) => got.includes(s)).length);
    const notPod = head.filter((s) => !pods.includes(s));
    check(`"หัวพอต" lists the pods (${pods.length}) before the devices whose spec names a pod`, notPod.length === 0, notPod.length ? `ahead of a pod: ${notPod.join(", ")}` : `first ${head.length} are pods, ${got.length} total`);
  }

  // ---- 9. Nothing matches nothing ----
  check(`"xyznonexistentquery123" finds nothing`, search("xyznonexistentquery123").length === 0, "");
  check(`an empty / whitespace-only query finds nothing`, search("").length === 0 && search("   ").length === 0 && search(WJ).length === 0, "");
  check(`the per-catalog entry points agree with the ranked list`, sameSet([...searchProducts("พอต").map((p) => p.slug), ...searchPublishedProducts("พอต").map((p) => p.slug)], search("พอต")), "");

  // ---- 10. Every catalog grid receives the server-built search texts (a page that forgets the
  //          prop would silently search nothing — CatalogBrowser falls back to empty text) ----
  {
    const appDir = path.join(process.cwd(), "src", "app");
    const usages = sourceFilesUnder(appDir).flatMap((file) => {
      const src = readFileSync(file, "utf8");
      const tags = src.match(/<CatalogBrowser\b[^>]*>/g) ?? [];
      return tags.map((tag) => ({ file: path.relative(process.cwd(), file), ok: /searchTexts=\{catalogSearchTexts\(/.test(tag) }));
    });
    const bad = usages.filter((u) => !u.ok).map((u) => u.file);
    check(`every <CatalogBrowser> in src/app passes searchTexts={catalogSearchTexts(...)} (${usages.length} usages)`, usages.length > 0 && bad.length === 0, bad.join(", ") || "all pass it");
  }

  // ---- 11. No family name the data knows is unreachable by its own spelling ----
  for (const f of families) {
    const expected = byFamily(f.id);
    if (expected.length === 0) continue;
    const got = search(f.name);
    check(`family "${f.name}" finds all its products (${expected.length})`, missing(expected, got).length === 0, missing(expected, got).join(",") || "all found");
  }

  return results;
}

if (require.main === module) {
  const results = runCatalogSearchContractTests();
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
