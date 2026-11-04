/**
 * OKami24 — write src/data/content-dates.json: the last git commit date of every content source
 * path named in src/lib/content-dates.ts (round "search-price" batch 3, 2026-09-22).
 *
 *   npx tsx scripts/content-dates.ts          # rewrite the JSON
 *   npx tsx scripts/content-dates.ts --check  # exit 1 if the JSON differs from git (what the
 *                                             # contract test does; use it in a pre-push habit)
 *
 * Run it before every round close (skill round-close) — verify:catalog fails while it is stale.
 * Dates are the AUTHOR date (%aI) of the newest commit touching the path — an amend keeps it, so the post-commit
 * hook (scripts/content-dates-amend.js, owner 30/09: no separate dates commit) can fold the JSON into the very
 * commit it describes; before 30/09 this was the committer date (%cI). A path with no
 * commit yet (a file created and not committed) keeps the previous JSON value, so a work-in-
 * progress tree never writes a fake date.
 *
 * Round SEO ฉ batch 4 (2026-10-12): the JSON also holds "guides" — one date per guide, the newest commit that changed
 * THAT guide's own text (scripts/lib/guide-dates.ts), read by the guide page (Article dateModified + the visible
 * "updated" line) and sitemap.ts. Before, every guide carried the date of the newest commit to any guide file.
 *
 * Owner 05/11: the JSON also holds "pages" — per sitemap page, a fingerprint of what a reader gets on it + the date that
 * fingerprint last moved (scripts/lib/page-substance.ts). A page whose fingerprint differs from the JSON takes the author
 * date of HEAD: the post-commit hook runs right after the commit that changed it. Run by hand on an uncommitted change it
 * takes the last commit's date, so let the hook do it.
 *   npx tsx scripts/content-dates.ts --rekey  # after a SUBSTANCE_VERSION bump: new fingerprints, every date kept
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { allContentPaths, GUIDE_EXTRA_SOURCES } from "../src/lib/content-dates";
import { guides, heldGuides } from "../src/data/guides";
import { computeGuideDates } from "./lib/guide-dates";
import { loadPageSources } from "./lib/page-sources";
import { fingerprint, nextPages, pageSubstances, SUBSTANCE_VERSION, type PageDate } from "./lib/page-substance";

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "src", "data", "content-dates.json");
const CHECK = process.argv.includes("--check");
const REKEY = process.argv.includes("--rekey");

/** One fingerprint per page dated by substance. */
function currentFingerprints(): Record<string, string> {
  const pages = pageSubstances(loadPageSources());
  return Object.fromEntries(Object.keys(pages).map((p) => [p, fingerprint(pages[p])]));
}

function headDate(): string {
  return execFileSync("git", ["log", "-1", "--format=%aI"], { cwd: ROOT, encoding: "utf8" }).trim().replace(/Z$/, "+00:00");
}

export function gitLastCommitDate(relPath: string): string | null {
  const out = execFileSync("git", ["log", "-1", "--format=%aI", "--", relPath], { cwd: ROOT, encoding: "utf8" }).trim();
  // Newer git (2.55 on the GitHub runner) prints a UTC date as "…Z", older git (2.43 in the cloud chat) as
  // "…+00:00" — one spelling, so the JSON and the contract test agree on every machine (round "clip", PR #87).
  return out ? out.replace(/Z$/, "+00:00") : null;
}

export function collectContentDates(previous: Record<string, string>): Record<string, string> {
  const paths: Record<string, string> = {};
  for (const p of allContentPaths()) {
    if (!existsSync(path.join(ROOT, p))) throw new Error(`content-dates: "${p}" does not exist — fix CONTENT_SOURCES in src/lib/content-dates.ts`);
    const date = gitLastCommitDate(p) ?? previous[p];
    if (!date) throw new Error(`content-dates: "${p}" has no commit yet and no previous date — commit it first`);
    paths[p] = date;
  }
  return paths;
}

function main() {
  const old = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
  const previous: Record<string, string> = old.paths ?? {};
  const previousGuides: Record<string, string> = old.guides ?? {};
  const previousPages: Record<string, PageDate> = old.pages ?? {};
  if (!REKEY && old.pagesVersion !== SUBSTANCE_VERSION) {
    throw new Error(`content-dates: "pages" was written by substance version ${old.pagesVersion}, the code is ${SUBSTANCE_VERSION} — run --rekey (keeps the dates)`);
  }
  const paths = collectContentDates(previous);
  const found = computeGuideDates(ROOT, [...guides, ...heldGuides].map((g) => g.id), GUIDE_EXTRA_SOURCES);
  const guideDates = Object.fromEntries(Object.keys(found).sort().map((id) => [id, found[id]])); // stable order = small diffs
  const fingerprints = currentFingerprints();
  const stamp = headDate();
  const pages = REKEY
    ? Object.fromEntries(Object.keys(fingerprints).sort().map((p) => [p, { date: previousPages[p]?.date ?? stamp, fp: fingerprints[p] }]))
    : nextPages(previousPages, fingerprints, stamp);
  const movedPages = Object.keys(pages).filter((p) => previousPages[p]?.fp !== pages[p].fp);
  const json = JSON.stringify({ note: "Generated by scripts/content-dates.ts — do not edit by hand.", paths, guides: guideDates, pagesVersion: SUBSTANCE_VERSION, pages }, null, 2) + "\n";
  const current = existsSync(OUT) ? readFileSync(OUT, "utf8") : "";
  const changed = [
    ...Object.keys(paths).filter((p) => previous[p] !== paths[p]),
    ...Object.keys(guideDates).filter((id) => previousGuides[id] !== guideDates[id]).map((id) => `guide ${id}`),
    ...movedPages,
  ];
  // A code change that touches every record (a new internal field) looks like a real edit of every page: say so loudly.
  if (!CHECK && !REKEY && movedPages.length > 30) console.log(`content-dates: WARNING ${movedPages.length} pages moved at once — if no reader sees a change, add the field to NOT_SUBSTANCE in scripts/lib/page-substance.ts, bump SUBSTANCE_VERSION and --rekey`);
  if (CHECK) {
    if (current.replace(/\r\n/g, "\n") === json) {
      console.log(`content-dates.json is current (${Object.keys(paths).length} paths)`);
      return;
    }
    console.error(`content-dates.json is stale — ${changed.length} path(s) differ from git: ${changed.join(", ") || "(formatting only)"}\nrun: npx tsx scripts/content-dates.ts`);
    process.exit(1);
  }
  writeFileSync(OUT, json);
  console.log(`wrote ${path.relative(ROOT, OUT)} — ${Object.keys(paths).length} paths, ${changed.length} changed${changed.length ? ": " + changed.join(", ") : ""}`);
}

if (require.main === module) main();
