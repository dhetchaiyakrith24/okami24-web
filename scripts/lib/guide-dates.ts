/**
 * OKami24 — per-guide modified dates from git (round SEO ฉ batch 4, 2026-10-12).
 *
 * Before this, every guide's Article `dateModified` (and its sitemap lastmod) was the newest commit touching ANY of
 * guides.ts / guides-copy.ts / search-head-copy.ts — editing one article re-dated all of them (fake freshness for
 * Google, and the reason the visible "updated" date could not be shown). Here each guide gets the AUTHOR date of the
 * newest commit that changed ITS OWN text: its record in guides.ts, its TH and ZH blocks in guides-copy.ts and its
 * head-only description row in search-head-copy.ts (+ any extra file a guide owns, e.g. the DNS guide's copy file).
 *
 * "Its own text" is read from the file TEXT at each commit (git cat-file, one process), not by importing old module
 * versions: the block is cut by the files' fixed layout (records at 2-space indent), full-line comments are dropped
 * and whitespace is collapsed, so a comment or re-indent alone never re-dates an article.
 *
 * Used by scripts/content-dates.ts (writes src/data/content-dates.json "guides") and by
 * src/lib/content-dates-contract-test.ts (demands the JSON equals this answer).
 */
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";

export const GUIDE_TEXT_FILES = ["src/data/guides.ts", "src/i18n/guides-copy.ts", "src/i18n/search-head-copy.ts"] as const;

type Texts = Record<(typeof GUIDE_TEXT_FILES)[number], string>;

function normalise(block: string): string {
  return block
    .replace(/\r/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .filter((l) => !l.trim().startsWith("//"))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** The record object in guides.ts: from the "  {" line before `id: "<id>"` to the next "  }," line. */
function recordBlock(text: string, id: string): string {
  const t = text.replace(/\r/g, "");
  const m = new RegExp(`\\n {4}id: "${escapeRe(id)}",`).exec(t);
  if (!m) return "";
  const start = t.lastIndexOf("\n  {", m.index);
  const end = t.indexOf("\n  },", m.index);
  return start < 0 || end < 0 ? "" : t.slice(start, end);
}

/** `  "<id>": { … }` in one locale map of guides-copy.ts. */
function copyBlock(half: string, id: string): string {
  const m = new RegExp(`\\n {2}"${escapeRe(id)}": \\{`).exec(half);
  if (!m) return "";
  const end = half.indexOf("\n  },", m.index);
  return end < 0 ? "" : half.slice(m.index, end);
}

/** The head-only description row of GUIDE_DESCRIPTION_HEAD_TH. */
function headRow(text: string, id: string): string {
  const t = text.replace(/\r/g, "");
  const start = t.indexOf("GUIDE_DESCRIPTION_HEAD_TH");
  if (start < 0) return "";
  const end = t.indexOf("\n};", start);
  const map = t.slice(start, end < 0 ? undefined : end);
  const m = new RegExp(`"${escapeRe(id)}":\\s*"((?:[^"\\\\]|\\\\.)*)"`).exec(map);
  return m ? m[1] : "";
}

export function guideFingerprint(texts: Texts, id: string): string {
  const copy = texts["src/i18n/guides-copy.ts"].replace(/\r/g, "");
  const zhAt = copy.indexOf("GUIDES_COPY_ZH");
  const th = zhAt < 0 ? copy : copy.slice(0, zhAt);
  const zh = zhAt < 0 ? "" : copy.slice(zhAt);
  const parts = [recordBlock(texts["src/data/guides.ts"], id), copyBlock(th, id), copyBlock(zh, id), headRow(texts["src/i18n/search-head-copy.ts"], id)];
  return createHash("sha1").update(parts.map(normalise).join("\u0000")).digest("hex");
}

/** Read many `<rev>:<path>` blobs in one `git cat-file --batch` process ("" for a path missing at that rev). */
function readBlobs(root: string, names: string[]): Map<string, string> {
  const out = new Map<string, string>();
  if (names.length === 0) return out;
  const res = spawnSync("git", ["cat-file", "--batch"], { cwd: root, input: names.join("\n") + "\n", maxBuffer: 1 << 30 });
  if (res.status !== 0) throw new Error(`git cat-file failed: ${res.stderr}`);
  const buf: Buffer = res.stdout;
  let pos = 0;
  for (const name of names) {
    const nl = buf.indexOf(10, pos);
    const header = buf.subarray(pos, nl).toString("utf8");
    pos = nl + 1;
    if (header.endsWith(" missing") || header.endsWith(" ambiguous")) {
      out.set(name, "");
      continue;
    }
    const size = Number(header.split(" ")[2]);
    out.set(name, buf.subarray(pos, pos + size).toString("utf8"));
    pos += size + 1;
  }
  return out;
}

function texts(blobs: Map<string, string>, rev: string | null): Texts {
  const t = {} as Texts;
  for (const f of GUIDE_TEXT_FILES) t[f] = rev ? (blobs.get(`${rev}:${f}`) ?? "") : "";
  return t;
}

function gitLastCommitDate(root: string, relPath: string): string | null {
  const out = execFileSync("git", ["log", "-1", "--format=%aI", "--", relPath], { cwd: root, encoding: "utf8" }).trim();
  return out ? out.replace(/Z$/, "+00:00") : null;
}

/**
 * Author date (ISO, "+00:00" spelling like scripts/content-dates.ts) of the newest commit that changed each guide's
 * own text. `extraFiles[id]` = further files whose newest commit also dates that guide (the later date wins).
 * A guide whose text never differs from an empty tree in history (cannot happen once committed) throws.
 */
export function computeGuideDates(root: string, ids: readonly string[], extraFiles: Record<string, readonly string[]> = {}): Record<string, string> {
  const log = execFileSync("git", ["log", "--format=%H %P|%aI", "--", ...GUIDE_TEXT_FILES], { cwd: root, encoding: "utf8" }).trim();
  const commits = log
    ? log.split("\n").map((line) => {
        const [shas, date] = line.split("|");
        const [sha, parent] = shas.trim().split(" ");
        return { sha, parent: parent || null, date: date.trim().replace(/Z$/, "+00:00") };
      })
    : [];
  const names: string[] = [];
  for (const c of commits) for (const rev of [c.sha, c.parent]) if (rev) for (const f of GUIDE_TEXT_FILES) names.push(`${rev}:${f}`);
  const blobs = readBlobs(root, [...new Set(names)]);

  const dates: Record<string, string> = {};
  const pending = new Set(ids);
  for (const c of commits) {
    if (pending.size === 0) break;
    const now = texts(blobs, c.sha);
    const before = texts(blobs, c.parent);
    for (const id of [...pending]) {
      if (guideFingerprint(now, id) !== guideFingerprint(before, id)) {
        dates[id] = c.date;
        pending.delete(id);
      }
    }
  }
  if (pending.size > 0) throw new Error(`guide-dates: no commit changed the text of ${[...pending].join(", ")} — is it committed?`);
  for (const [id, files] of Object.entries(extraFiles)) {
    for (const f of files) {
      const d = gitLastCommitDate(root, f);
      if (d && dates[id] && Date.parse(d) > Date.parse(dates[id])) dates[id] = d;
    }
  }
  return dates;
}
