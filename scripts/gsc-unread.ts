/**
 * OKami24 — which pages has Google not read since they changed? (owner 05/11)
 *
 * Compares inspection.json on branch gsc-data (when Google last read each page: scripts/gsc-export.js, daily) with the
 * lastmod of each URL on the live sitemap. Prints the pages to request first: never read, then best sellers, then the
 * rest; newest change first inside each group, most clicks breaking a tie. Read only; needs no key.
 *
 *   git fetch origin gsc-data
 *   npx tsx scripts/gsc-unread.ts              # the list
 *   npx tsx scripts/gsc-unread.ts --limit 10   # the first 10
 *   npx tsx scripts/gsc-unread.ts --self-test  # the ordering, on made-up rows
 *
 * A page asked for in Search Console stays unread until Google comes, and asking again does not help, so pages listed in
 * <main checkout>/_incoming/seo-requests.log ("YYYY-MM-DD <url>", one a line, computer only) within ASKED_DAYS are held back.
 * How the list is used = skill seo-after-publish.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { isBestSeller } from "@/data/sales-badges";

const SITEMAP_URL = process.env.GSC_SITEMAP_URL || "https://okami24.store/sitemap.xml";
const STALE_DAYS = 2;
const ASKED_DAYS = 14;

export interface SitemapRow { url: string; lastmod: string | null }
export interface InspectionRow { url: string; lastCrawl: string | null; verdict?: string | null; error?: string }
export interface UnreadRow { url: string; lastmod: string | null; lastCrawl: string | null; tag: "never" | "best" | "" ; clicks: number }

const slugOf = (url: string) => new URL(url).pathname.split("/").pop() ?? "";

export function unreadPages(
  sitemap: SitemapRow[],
  inspection: InspectionRow[],
  clicks: Record<string, number>,
  best: (slug: string) => boolean = isBestSeller,
): UnreadRow[] {
  const byUrl = new Map(inspection.map((r) => [r.url, r]));
  const rows: UnreadRow[] = [];
  for (const { url, lastmod } of sitemap) {
    const seen = byUrl.get(url);
    if (seen?.error) continue; // unknown, not unread: the footer counts these
    const lastCrawl = seen?.lastCrawl ?? null;
    const unread = !lastCrawl || (lastmod !== null && Date.parse(lastCrawl) < Date.parse(lastmod));
    if (unread) rows.push({ url, lastmod, lastCrawl, tag: !lastCrawl ? "never" : best(slugOf(url)) ? "best" : "", clicks: clicks[url] ?? 0 });
  }
  const tier = (r: UnreadRow) => (r.tag === "never" ? 0 : r.tag === "best" ? 1 : 2);
  const time = (r: UnreadRow) => (r.lastmod ? Date.parse(r.lastmod) : 0);
  return rows.sort((a, b) => tier(a) - tier(b) || time(b) - time(a) || b.clicks - a.clicks || (a.url < b.url ? -1 : 1));
}

function fromGscData(file: string): unknown {
  try {
    return JSON.parse(execFileSync("git", ["show", `origin/gsc-data:gsc/latest/${file}`], { encoding: "utf8", maxBuffer: 1 << 26, stdio: ["ignore", "pipe", "ignore"] }));
  } catch {
    return null;
  }
}

/** URLs asked for within ASKED_DAYS. The log sits in the main checkout, which every worktree of this repo shares. */
function askedRecently(now: number): Set<string> {
  const commonDir = execFileSync("git", ["rev-parse", "--path-format=absolute", "--git-common-dir"], { encoding: "utf8" }).trim();
  const log = path.join(path.dirname(commonDir), "_incoming", "seo-requests.log");
  if (!existsSync(log)) return new Set();
  const lines = readFileSync(log, "utf8").split(/\r?\n/).map((l) => l.trim().split(/\s+/));
  return new Set(lines.filter(([day, url]) => url && now - Date.parse(day) < ASKED_DAYS * 86400000).map(([, url]) => url));
}

async function liveSitemap(): Promise<SitemapRow[]> {
  const res = await fetch(SITEMAP_URL);
  if (!res.ok) throw new Error(`sitemap HTTP ${res.status}`);
  return [...(await res.text()).matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
    url: /<loc>\s*([^<\s]+)/.exec(m[1])?.[1] ?? "",
    lastmod: /<lastmod>\s*([^<\s]+)/.exec(m[1])?.[1] ?? null,
  }));
}

function selfTest() {
  const site = "https://x.test/products/";
  const map: SitemapRow[] = [
    { url: `${site}old-read`, lastmod: "2026-11-01T00:00:00Z" },
    { url: `${site}plain-new`, lastmod: "2026-11-03T00:00:00Z" },
    { url: `${site}plain-old`, lastmod: "2026-11-02T00:00:00Z" },
    { url: `${site}seller`, lastmod: "2026-10-30T00:00:00Z" },
    { url: `${site}never`, lastmod: "2026-09-01T00:00:00Z" },
    { url: `${site}broken`, lastmod: "2026-11-04T00:00:00Z" },
  ];
  const crawl = "2026-10-01T00:00:00Z";
  const rows: InspectionRow[] = [
    { url: `${site}old-read`, lastCrawl: "2026-11-02T00:00:00Z" },
    { url: `${site}plain-new`, lastCrawl: crawl },
    { url: `${site}plain-old`, lastCrawl: crawl },
    { url: `${site}seller`, lastCrawl: crawl },
    { url: `${site}never`, lastCrawl: null },
    { url: `${site}broken`, lastCrawl: null, error: "HTTP 500" },
  ];
  const got = unreadPages(map, rows, {}, (s) => s === "seller").map((r) => slugOf(r.url)).join(" ");
  const want = "never seller plain-new plain-old";
  console.log(got === want ? "gsc-unread self-test PASS" : `gsc-unread self-test FAIL: got "${got}", want "${want}"`);
  process.exit(got === want ? 0 : 1);
}

async function main() {
  if (process.argv.includes("--self-test")) selfTest();
  const at = process.argv.indexOf("--limit");
  const limit = at >= 0 ? Number(process.argv[at + 1]) : Infinity;
  const inspection = fromGscData("inspection.json") as { ranAt: string; rows: InspectionRow[] } | null;
  if (!inspection) {
    console.log("gsc-unread: no inspection.json on gsc-data yet. Run: git fetch origin gsc-data · or the gsc-export workflow on main has not run since this tool landed.");
    process.exit(1);
  }
  const pageRows = (fromGscData("last28-page.json") as { rows: { keys: string[]; clicks: number }[] } | null)?.rows ?? [];
  const clicks = Object.fromEntries(pageRows.map((r) => [r.keys[0], r.clicks]));
  const sitemap = await liveSitemap();
  const asked = askedRecently(Date.now());
  const all = unreadPages(sitemap, inspection.rows, clicks);
  const unread = all.filter((r) => !asked.has(r.url));
  const inSitemap = new Set(sitemap.map((r) => r.url));
  const failed = inspection.rows.filter((r) => r.error && inSitemap.has(r.url)).length;
  const ageDays = (Date.now() - Date.parse(inspection.ranAt)) / 86400000;
  console.log(`gsc-unread: Google read checked ${inspection.ranAt.slice(0, 16)}Z · sitemap ${sitemap.length} · not read since they changed ${unread.length} (never read ${unread.filter((r) => r.tag === "never").length} · best sellers ${unread.filter((r) => r.tag === "best").length})${failed ? ` · ${failed} could not be checked` : ""}${all.length > unread.length ? ` · ${all.length - unread.length} already asked for, held back` : ""}`);
  if (ageDays > STALE_DAYS) console.log(`gsc-unread: WARNING that check is ${Math.floor(ageDays)} days old: read the list with care, or run the gsc-export workflow`);
  unread.slice(0, limit).forEach((r, i) => {
    console.log(`${String(i + 1).padStart(3)}  changed ${(r.lastmod ?? "-").slice(0, 10).padEnd(10)}  read ${(r.lastCrawl ?? "never").slice(0, 10).padEnd(10)}  ${r.tag.padEnd(5)}  ${r.url}`);
  });
}

if (require.main === module) {
  main().catch((e) => {
    console.log(`gsc-unread: FAIL ${e.message}`);
    process.exit(1);
  });
}
