/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// house-check.js — step 1 of skill /เก็บบ้าน (house-clean): measure the house, change nothing (housekeeping round 01/10).
// Numbers are for the owner's report, not a gate (owner 01/10: "no size gate").
//
//   node scripts/house-check.js            prints the report; compares with the previous run in _incoming/house-last.json
//
// Sections: sizes (rules loaded every chat · HANDOFF · §16 · LESSONS) · locks (git hooks on?) · rules followed (merged PRs,
// last 7 days) · this project's scheduled-task folders · dead pointers (a backticked repo path that does
// not exist · a "13.x" the rules file has no heading for) · files nobody references (scripts · docs · agents · skills) ·
// _incoming/ folders nobody references (size, date) · stray git worktrees.
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
process.chdir(ROOT);
const rd = (f) => fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
// core.quotepath=off: a Thai file name (docs/rounds/…) comes back as text, not "\340…" — else it is never read
const tracked = execSync("git -c core.quotepath=off ls-files", { encoding: "utf8" }).split("\n").filter(Boolean).filter((f) => fs.existsSync(f));
const LIVE = (f) => !/^(docs\/rounds|docs\/archive|docs\/cloud-results|public)\//.test(f) && !/THAI_STYLE_LOG|LAUNCH_AUDIT/.test(f);
const text = {};
for (const f of tracked.filter((f) => /\.(md|js|ts|tsx|json|txt|yml|sh)$|^\.githooks\//.test(f))) text[f] = rd(f);

// 1. sizes
const LOADED = ["CLAUDE.md", "AGENTS.md", ".claude/TEAM_RULES.md", ".claude/memory/MEMORY.md", ".claude/rules/central-rules.md"];
const handoff = text["docs/HANDOFF.md"] || "";
const s16 = handoff.slice(handoff.indexOf("## 16."), handoff.indexOf("## 17.") > 0 ? handoff.indexOf("## 17.") : undefined);
const now = {
  loadedEveryChat: LOADED.reduce((n, f) => n + (text[f] || "").length, 0),
  handoff: handoff.length,
  s16Bytes: Buffer.byteLength(s16),
  lessons: (text[".claude/LESSONS.md"] || "").length,
  agents: tracked.filter((f) => /^\.claude\/agents\/.+\.md$/.test(f)).length,
  skills: tracked.filter((f) => /^\.claude\/skills\/[^/]+\/SKILL\.md$/.test(f)).length,
};
const lastFile = "_incoming/house-last.json";
const last = fs.existsSync(lastFile) ? JSON.parse(fs.readFileSync(lastFile, "utf8")) : null;
console.log("## sizes (characters, line ends not counted)" + (last ? ` — previous run ${last.date}` : ""));
for (const [k, v] of Object.entries(now)) {
  const was = last && last.values[k];
  const d = was ? ` (was ${was}, ${v >= was ? "+" : ""}${Math.round(((v - was) / was) * 100)}%)` : "";
  console.log(`  ${k.padEnd(16)} ${String(v).padStart(8)}${d}`);
}

// 2. dead pointers
console.log("\n## dead pointers in live files");
const rules = text[".claude/TEAM_RULES.md"] || "";
const heads = new Set([...rules.matchAll(/^### (13\.\d+)/gm)].map((m) => m[1]));
let dead = 0;
for (const [f, t] of Object.entries(text)) {
  if (!LIVE(f) || f.startsWith("src/") || /\.json$/.test(f)) continue;
  t.split("\n").forEach((line, i) => {
    for (const m of line.matchAll(/`((?:docs|scripts|\.claude|src|\.github|\.githooks)\/[^`\s*<>{}]+?)`/g)) {
      const p = m[1].replace(/[:#].*$/, "").replace(/\/$/, "");
      // a line that records the deletion on purpose ("was deleted" · ลบแล้ว) is history, not a dead pointer
      if (!fs.existsSync(p) && !/\$|<|\{|\*/.test(m[1]) && !/\b(deleted|removed)\b|ลบแล้ว|ลบไป/i.test(line)) { dead++; console.log(`  ${f}:${i + 1}  missing ${p}`); }
    }
    if (/\.md$/.test(f) && f !== "docs/THAI_STYLE.md") {
      for (const m of line.matchAll(/(?<![\d.§])13\.(\d{1,2})(?![\d.]\d)/g)) {
        if (!heads.has(`13.${m[1]}`)) { dead++; console.log(`  ${f}:${i + 1}  no heading 13.${m[1]} in TEAM_RULES`); }
      }
    }
  });
}
if (!dead) console.log("  none");

// 3. files nobody references — by file name, or by its name without the extension as a whole word (LESSONS writes
// `page-text-length` · src writes "MOBILE_SPEC 3.6"). Only history mentions it (rounds · cloud-results · archive) = marked:
// a tool a closed round used, kept unless the owner retires it (15/10: 5 of 5 "nobody" flags were wrong).
console.log("\n## files nobody references (live files only)");
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const hit = (t, needle) =>
  t.includes(needle) || (/\.\w+$/.test(needle) && new RegExp(`(^|[^\\w-])${esc(needle.replace(/\.\w+$/, ""))}(?![\\w-])`).test(t));
const refd = (needle, self, live = true) => Object.entries(text).some(([f, t]) => f !== self && (!live || LIVE(f)) && hit(t, needle));
const cands = [
  ...tracked.filter((f) => /^scripts\/[^/]+\.(js|mjs|cjs|ts)$/.test(f)).map((f) => [f, path.basename(f)]),
  ...tracked.filter((f) => /^docs\/[^/]+\.md$/.test(f)).map((f) => [f, path.basename(f)]),
  ...tracked.filter((f) => /^\.claude\/agents\/.+\.md$/.test(f)).map((f) => [f, path.basename(f, ".md")]),
  ...tracked.filter((f) => /^\.claude\/skills\/[^/]+\/SKILL\.md$/.test(f)).map((f) => [f, f.split("/")[2]]),
];
const orphans = cands.filter(([f, n]) => !refd(n, f));
for (const [f, n] of orphans) console.log(`  ${f}${refd(n, f, false) ? "  (only history mentions it)" : ""}`);
if (!orphans.length) console.log("  none");

// 4. _incoming folders nobody references
console.log("\n## _incoming/ folders nobody references (not in git — deleting them needs the owner, 13.3 #1)");
const size = (d) => {
  let n = 0;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isSymbolicLink()) continue; // never follow a junction
    n += e.isDirectory() ? size(p) : fs.statSync(p).size;
  }
  return n;
};
if (fs.existsSync("_incoming")) {
  for (const e of fs.readdirSync("_incoming", { withFileTypes: true })) {
    // a dot-folder is a tool's own working copy (the test server build) — not a round leftover
    if (!e.isDirectory() || e.name.startsWith(".") || refd(`_incoming/${e.name}`, "")) continue;
    const p = path.join("_incoming", e.name);
    console.log(`  ${e.name.padEnd(30)} ${(size(p) / 1048576).toFixed(1).padStart(8)} MB  ${fs.statSync(p).mtime.toISOString().slice(0, 10)}`);
  }
}

// 5. worktrees
const wts = execSync("git worktree list", { encoding: "utf8" }).trim().split("\n");
console.log(`\n## git worktrees (${wts.length})`);
for (const w of wts) console.log(`  ${w}`);

// 6. locks — the commit/push gates run only when core.hooksPath = .githooks (15/10: found "nul", gates off for days)
console.log("\n## locks");
let hooksPath = "";
try {
  hooksPath = execSync("git config core.hooksPath", { encoding: "utf8" }).trim();
} catch {
  /* unset */
}
console.log(`  core.hooksPath = ${hooksPath || "(unset)"}  ${hooksPath === ".githooks" ? "ok" : "OFF — run: git config core.hooksPath .githooks"}`);
let settings = {};
try {
  settings = JSON.parse(rd(".claude/settings.json"));
} catch {
  /* none */
}
const hookCmds = JSON.stringify(settings.hooks || {});
for (const s of ["guard-tool.js", "session-sync.js"]) console.log(`  ${s.padEnd(16)} ${hookCmds.includes(s) ? "wired in .claude/settings.json" : "NOT wired"}`);

// 7. rules followed — PRs merged in the last 7 days (needs `gh` = the computer) · TEAM_RULES 13.4 / 13.7
console.log("\n## rules followed — PRs merged in the last 7 days");
try {
  const since = new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10);
  const prs = JSON.parse(
    execSync(`gh pr list --state merged --limit 200 --search "merged:>=${since}" --json number,body,mergeCommit,files`, { encoding: "utf8" }),
  );
  const docsOnly = (p) => p.files.every((f) => /^(docs\/|\.claude\/LESSONS(-images)?\.md$|\.claude\/memory\/)/.test(f.path));
  let mergeCommits = 0;
  let withLine = 0;
  let needLine = 0;
  for (const p of prs) {
    try {
      if (execSync(`git rev-list --parents -n 1 ${p.mergeCommit.oid}`, { encoding: "utf8" }).trim().split(" ").length === 3) mergeCommits++;
    } catch {
      /* not fetched */
    }
    if (!docsOnly(p)) {
      needLine++;
      if (/^\s*Checker:\s*(PASS|SKIP)\b/im.test(p.body || "")) withLine++;
    }
  }
  const pct = (a, b) => (b ? `${a}/${b} (${Math.round((a / b) * 100)}%)` : "0/0");
  console.log(`  merged ${prs.length} · merge commit, not squash ${pct(mergeCommits, prs.length)} · Checker line in non-docs PRs ${pct(withLine, needLine)}`);
  console.log("  (Checker line = rule since 15/10 — older PRs count as missing)");
} catch (e) {
  console.log(`  not measured here (${String(e.message).split("\n")[0].slice(0, 80)})`);
}

// 8. this project's scheduled-task folders — names okami24-* / friday-* only (other projects' tasks are not read, central §12 item 32)
console.log("\n## scheduled-task folders of this project (~/.claude/scheduled-tasks)");
const st = path.join(require("os").homedir(), ".claude", "scheduled-tasks");
const mine = fs.existsSync(st) ? fs.readdirSync(st).filter((n) => /^(okami24|friday)-/.test(n)) : [];
for (const n of mine) {
  const f = path.join(st, n, "SKILL.md");
  console.log(`  ${n.padEnd(34)} ${fs.existsSync(f) ? `prompt saved ${fs.statSync(f).mtime.toISOString().slice(0, 10)}` : "(no SKILL.md)"}`);
}
if (!mine.length) console.log("  none");
console.log("  (enabled or not = the app's list_scheduled_tasks — a folder whose task is gone from the app is a leftover)");

fs.mkdirSync("_incoming", { recursive: true });
fs.writeFileSync(lastFile, JSON.stringify({ date: new Date().toLocaleDateString("sv-SE"), values: now }, null, 1));
