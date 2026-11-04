/**
 * OKami24 — the true starting dates for "pages" in src/data/content-dates.json (owner 05/11).
 *
 * scripts/content-dates.ts only moves a date forward from what the JSON holds, so the first JSON needs each page's real
 * last change, not "today" (which would repeat the very lie this fixes). This reads it from history: it evaluates the
 * CURRENT definition of substance (scripts/lib/page-substance.ts) against the catalog as it stood at old commits on main,
 * in a throwaway git worktree, and binary-searches per group of pages for the commit where the fingerprint last moved.
 * One assumption: a page whose text changed and was later put back reads as unchanged since the older commit, which is
 * what a reader sees. A page unchanged back to the oldest commit gets that commit's date.
 *
 *   npx tsx scripts/page-dates-baseline.ts          # writes "pages" (dates from history) into the JSON
 *
 * Only needed once, or to re-check the baseline. Everyday dates are the post-commit hook's job.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { SUBSTANCE_VERSION, type PageDate } from "./lib/page-substance";

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "src", "data", "content-dates.json");
const git = (...args: string[]) => execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();

/** Runs inside the old tree: every module optional, because an old commit may not have it yet. */
const DUMP = String.raw`
import { fingerprint, pageSubstances } from "./page-substance";
const opt = (m: string): any => { try { return require(m); } catch { return {}; } };
const products = opt("@/data/products"), bridge = opt("@/data/shipnity-seed/storefront-bridge");
const cv = opt("@/lib/category-visibility"), bv = opt("@/lib/brand-visibility");
const gd = opt("@/data/guides"), gc = opt("@/i18n/guides-copy"), td = opt("@/data/technology"), tc = opt("@/i18n/technology-copy");
const fd = opt("@/data/flavors"), fc = opt("@/i18n/flavor-copy"), th = opt("@/i18n/product-copy-th"), en = opt("@/i18n/product-copy-en");
const ed = opt("@/data/product-editorial"), dc = opt("@/lib/product-details-copy"), cg = opt("@/i18n/category-guide-copy");
const vids = opt("@/data/collection-videos"), head = opt("@/i18n/search-head-copy");
const pages = pageSubstances({
  legacyProducts: products.allProducts,
  publishedProducts: bridge.getPublishedProducts?.() ?? [],
  productCopy: (slug: string) => ({
    th: th.PRODUCT_COPY_TH?.[slug], en: en.PRODUCT_COPY_EN?.[slug], editorial: ed.PRODUCT_EDITORIAL?.[slug], details: dc.productDetailsCopy?.(slug),
    title: head.PRODUCT_TITLE_HEAD_TH?.[slug], description: head.PRODUCT_DESCRIPTION_HEAD_TH?.[slug],
  }),
  categories: cv.categoriesWithProducts?.() ?? [],
  categoryCopy: (id: string) => ({ guide: cg.CATEGORY_GUIDE_COPY?.[id], title: head.categoryTitleTh?.("", id) }),
  brands: bv.brandsWithProducts?.() ?? [],
  brandCopy: (id: string) => ({ head: head.BRAND_HEAD_TH?.[id]?.(() => null), h1: head.BRAND_H1?.[id] }),
  collectionVideos: vids.COLLECTION_VIDEOS ?? {},
  guides: gd.guides ?? [],
  guideCopy: (id: string) => [gc.GUIDES_COPY_TH?.[id], gc.GUIDES_COPY_ZH?.[id]].map((c) => ({ title: c?.title, dek: c?.dek })),
  technology: td.technologyEntries ?? [],
  technologyCopy: (id: string) => [tc.TECHNOLOGY_COPY_TH?.[id], tc.TECHNOLOGY_COPY_ZH?.[id], head.TECHNOLOGY_DESCRIPTION_HEAD_TH?.[id]],
  flavors: fd.flavorFamilies ?? [],
  flavorCopy: (id: string) => [fc.FLAVOR_COPY_TH?.[id], fc.FLAVOR_COPY_ZH?.[id], head.FLAVOR_TITLE_HEAD_TH?.[id]],
  head: { home: head.HOME_HEAD_TH, about: head.ABOUT_HEAD_TH, contact: head.CONTACT_HEAD_TH, products: head.productsHeadTh?.(0) },
});
console.log("FP" + JSON.stringify(Object.fromEntries(Object.keys(pages).map((p) => [p, fingerprint(pages[p])]))));
`;

function main() {
  const commits = git("log", "--first-parent", "--format=%H %aI", "HEAD", "--", "src/data", "src/i18n", "src/lib")
    .split("\n")
    .map((l) => ({ sha: l.split(" ")[0], date: l.split(" ")[1].replace(/Z$/, "+00:00") }));
  // Inside the repo folder (ignored by git): the tree then finds node_modules by walking up, with no link to clean away.
  const tree = path.join(ROOT, "_incoming", "page-dates-tree");
  git("worktree", "add", "--detach", "-q", tree, commits[0].sha);
  mkdirSync(path.join(tree, "_dump"));
  copyFileSync(path.join(ROOT, "scripts", "lib", "page-substance.ts"), path.join(tree, "_dump", "page-substance.ts"));
  writeFileSync(path.join(tree, "_dump", "dump.ts"), DUMP);

  const cache = new Map<number, Record<string, string> | null>();
  /** The fingerprints at commit i; a tree that does not load counts as "unknown" and the next older one answers. */
  function at(i: number): Record<string, string> | null {
    if (i >= commits.length) return null;
    if (cache.has(i)) return cache.get(i)!;
    execFileSync("git", ["checkout", "-q", "--detach", commits[i].sha], { cwd: tree });
    // Windows: npx is a .cmd — through cmd.exe, like scripts/content-dates-amend.js.
    const command = "npx tsx --tsconfig tsconfig.json _dump/dump.ts";
    const run = process.platform === "win32"
      ? spawnSync("cmd.exe", ["/d", "/s", "/c", command], { cwd: tree, encoding: "utf8", maxBuffer: 1 << 26 })
      : spawnSync("sh", ["-c", command], { cwd: tree, encoding: "utf8", maxBuffer: 1 << 26 });
    const line = (run.stdout || "").split("\n").find((l) => l.startsWith("FP"));
    const fps = line ? (JSON.parse(line.slice(2)) as Record<string, string>) : null;
    console.log(`baseline: #${i}/${commits.length} ${commits[i].date.slice(0, 16)} ${fps ? Object.keys(fps).length + " pages" : "did not load: " + (run.stderr || "").split("\n")[0].slice(0, 90)}`);
    cache.set(i, fps);
    return fps;
  }

  const head = at(0);
  if (!head) throw new Error("baseline: the current tree did not load");
  const dates: Record<string, string> = {};
  // Invariant: every page in `group` has HEAD's fingerprint at `same` and not at `differs`.
  function search(group: string[], same: number, differs: number) {
    if (group.length === 0) return;
    if (differs - same <= 1) {
      for (const p of group) dates[p] = commits[same].date;
      return;
    }
    const mid = Math.floor((same + differs) / 2);
    const fps = at(mid);
    if (!fps) {
      commits.splice(mid, 1); // no answer here: drop the commit and search the same span, one shorter
      for (const k of [...cache.keys()].filter((k) => k >= mid)) cache.delete(k);
      search(group, same, differs - 1);
      return;
    }
    const held = group.filter((p) => fps[p] === head![p]);
    const moved = group.filter((p) => fps[p] !== head![p]);
    search(moved, same, mid);
    search(held, mid, differs);
  }
  search(Object.keys(head), 0, commits.length);

  execFileSync("git", ["worktree", "remove", "--force", tree], { cwd: ROOT });

  const json = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
  const pages: Record<string, PageDate> = {};
  for (const p of Object.keys(head).sort()) pages[p] = { date: dates[p], fp: head[p] };
  writeFileSync(OUT, JSON.stringify({ ...json, pagesVersion: SUBSTANCE_VERSION, pages }, null, 2) + "\n");
  console.log(`baseline: ${Object.keys(pages).length} pages dated from history (${cache.size} commits read)`);
}

main();
