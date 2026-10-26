/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// house-check.js — step 1 of skill /เก็บบ้าน (house-clean): measure the house, change nothing (housekeeping round 01/10).
// Numbers are for the owner's report, not a gate (owner 01/10: "no size gate").
//
//   node scripts/house-check.js            prints the report; compares with the previous run in _incoming/house-last.json
//
// Sections: sizes (rules loaded every chat · HANDOFF · §16 · LESSONS) · locks (git hooks on? · do they still bite =
// scripts/pre-checker-gate.js --self-test · a checker note left on) · rules followed (merged PRs,
// last 7 days) · this project's scheduled-task folders · dead pointers (a backticked repo path that does
// not exist · a "13.x" the rules file has no heading for · <FILE> [§N] "heading" whose words are gone) · files nobody references (scripts · docs · agents · skills) ·
// _incoming/ folders nobody references (size, date) · stray git worktrees · branches (merged / unmerged, local + GitHub)
// and tags · loose files/folders at the repo root. claude.ai Artifacts are not measured here (the Artifact tool's list —
// skill house-clean home 8).
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
process.chdir(ROOT);
const rd = (f) => fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
// core.quotepath=off: a Thai file name (docs/rounds/…) comes back as text, not "\340…" — else it is never read
const tracked = execSync("git -c core.quotepath=off ls-files", { encoding: "utf8" }).split("\n").filter(Boolean).filter((f) => fs.existsSync(f));
// docs/seo-audit = an outside author's text kept word for word (its own links are his, not ours)
const LIVE = (f) => !/^(docs\/rounds|docs\/archive|docs\/cloud-results|docs\/seo-audit|public)\//.test(f) && !/THAI_STYLE_LOG|LAUNCH_AUDIT/.test(f);
const text = {};
for (const f of tracked.filter((f) => /\.(md|js|ts|tsx|json|txt|yml|sh)$|^\.githooks\//.test(f))) text[f] = rd(f);

// 1. sizes
const LOADED = ["CLAUDE.md", "AGENTS.md", ".claude/TEAM_RULES.md", ".claude/memory/MEMORY.md", ".claude/rules/central-rules.md"];
const handoff = text["docs/HANDOFF.md"] || "";
const s16 = handoff.slice(handoff.indexOf("## 16."), handoff.indexOf("## 17.") > 0 ? handoff.indexOf("## 17.") : undefined);
const now = {
  loadedEveryChat: LOADED.reduce((n, f) => n + (text[f] || "").length, 0),
  loadedBytes: LOADED.reduce((n, f) => n + Buffer.byteLength(text[f] || ""), 0),
  handoff: handoff.length,
  s16Bytes: Buffer.byteLength(s16),
  s16LongestLine: Math.max(0, ...s16.split("\n").map((l) => Buffer.byteLength(l))),
  lessons: (text[".claude/LESSONS.md"] || "").length,
  lessonsBytes: Buffer.byteLength(text[".claude/LESSONS.md"] || ""),
  agents: tracked.filter((f) => /^\.claude\/agents\/.+\.md$/.test(f)).length,
  skills: tracked.filter((f) => /^\.claude\/skills\/[^/]+\/SKILL\.md$/.test(f)).length,
};
const lastFile = "_incoming/house-last.json";
const last = fs.existsSync(lastFile) ? JSON.parse(fs.readFileSync(lastFile, "utf8")) : null;
console.log("## sizes (characters, line ends not counted · *Bytes and s16LongestLine = UTF-8 bytes, Thai = 3 a letter)" + (last ? ` — previous run ${last.date}` : ""));
for (const [k, v] of Object.entries(now)) {
  const was = last && last.values[k];
  const d = was ? ` (was ${was}, ${v >= was ? "+" : ""}${Math.round(((v - was) / was) * 100)}%)` : "";
  console.log(`  ${k.padEnd(16)} ${String(v).padStart(8)}${d}`);
}

// 1b. shapes the specs set — skill okami24-handoff ขั้น 2 (§16 ≤ 15 KB, no line over 2,000 bytes, finished work deleted, owner
// waits live in รอพี่ตรวจ) · TEAM_RULES head (one home: a LESSONS entry that only points elsewhere = a stub, deleted once its
// citers are repointed). Report only, like the sizes.
console.log("\n## §16 + LESSONS shape");
let shape = 0;
if (now.s16Bytes > 15000) { console.log(`  §16 ${now.s16Bytes} bytes > 15,000`); shape++; }
if (now.s16LongestLine > 2000) { console.log(`  §16 longest line ${now.s16LongestLine} bytes > 2,000`); shape++; }
s16.split("\n").forEach((l, i) => {
  const w = l.match(/\b(CLOSED|BUILT|DONE)\b|not yet said OK/);
  if (w) { console.log(`  §16 line ${i + 1} says "${w[0]}": ${l.trim().slice(0, 90)}`); shape++; }
});
for (const e of (text[".claude/LESSONS.md"] || "").split(/\n(?=## )/).slice(1)) {
  const [head, ...body] = e.split("\n");
  const lines = body.filter((l) => l.trim() && !/^#/.test(l));
  if (lines.length === 1 && /^→ /.test(lines[0].trim())) { console.log(`  LESSONS stub: ${head.slice(3, 70)}`); shape++; }
}
if (!shape) console.log("  none");

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
      // a pointer that records its OWN deletion ("`x` … was deleted" · "deleted `x`" · ลบ `x` แล้ว) is history, not a dead
      // pointer — the word must follow it within 50 characters or precede it within 15: before 15/10 any "deleted" on
      // the line hid every dead pointer on it
      const end = m.index + m[0].length;
      const near = line.slice(Math.max(0, m.index - 15), m.index) + " " + line.slice(end, end + 50);
      if (!fs.existsSync(p) && !/\$|<|\{|\*/.test(m[1]) && !/\b(deleted|removed)\b|ลบแล้ว|ลบไป/i.test(near)) { dead++; console.log(`  ${f}:${i + 1}  missing ${p}`); }
    }
    // a pointer to a HEADING by its words: <FILE> [§N] "heading" — the words must still be in that file (in §N when given).
    // 15/10: house-clean pointed at HANDOFF §18 "Answered 15/10" after the heading was renamed; nothing caught it.
    for (const m of /\.md$/.test(f) ? line.matchAll(/\b([A-Z][A-Z_]{2,}(?:-[a-z]+)?)(?:\.md)?\s*(?:§\s?(\d+)\s*)?["“]([^"”\n]{3,80})["”]/g) : []) {
      const target = [`docs/${m[1]}.md`, `.claude/${m[1]}.md`].find((t) => text[t]);
      if (!target) continue;
      let body = text[target];
      if (m[2]) {
        const at = body.search(new RegExp(`^##+ ${m[2]}\\.`, "m"));
        if (at < 0) continue; // no numbered sections in that file — the "13.x"/path checks cover it
        const next = body.slice(at + 3).search(/^## /m);
        body = body.slice(at, next < 0 ? undefined : at + 3 + next);
      }
      const want = m[3].replace(/\*/g, "").trim().toLowerCase();
      if (!body.replace(/\*/g, "").toLowerCase().includes(want)) { dead++; console.log(`  ${f}:${i + 1}  ${m[1]}${m[2] ? ` §${m[2]}` : ""} has no "${m[3]}"`); }
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

// 5b. branches and tags (owner 15/10 "Git มีอะไรรกมั้ย") — a branch merged into main keeps its commits in main, so
// deleting it loses nothing (skill house-clean home 8) · unmerged = list, someone decides · tags = round checkpoints, kept
console.log("\n## git branches and tags (merged = commits already in origin/main)");
const gitLines = (c) => {
  try {
    return execSync(c, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).split("\n").map((l) => l.replace(/^[*+]?\s+/, "").trim()).filter(Boolean);
  } catch {
    return [];
  }
};
const inWt = new Set(wts.map((w) => (w.match(/\[(.+)\]$/) || [])[1]).filter(Boolean));
const localAll = gitLines("git branch --format=%(refname:short)").filter((b) => b !== "main");
const localMerged = new Set(gitLines("git branch --merged origin/main --format=%(refname:short)"));
const remoteAll = gitLines("git branch -r --format=%(refname:short)").filter((b) => !/^origin(\/(HEAD|main))?$/.test(b));
const remoteMerged = new Set(gitLines("git branch -r --merged origin/main --format=%(refname:short)"));
// a branch cut from main minutes ago also reads "merged" — only ones whose last commit is over 7 days old are offered
const weekAgo = Date.now() / 1000 - 7 * 86400;
const lm = localAll.filter((b) => localMerged.has(b) && !inWt.has(b) && Number(gitLines(`git log -1 --format=%ct ${b}`)[0] || 0) < weekAgo);
const rm = remoteAll.filter((b) => remoteMerged.has(b));
console.log(`  local  ${localAll.length} · merged ${lm.length} (safe to delete${lm.length ? `: ${lm.join(" ")}` : ""})`);
const lastOf = (b) => gitLines(`git log -1 --format=%cs·%s ${b}`)[0] || "";
for (const b of localAll.filter((b) => !localMerged.has(b))) console.log(`    unmerged ${b.padEnd(30)} ${inWt.has(b) ? "(checked out in a worktree) " : ""}${lastOf(b).slice(0, 90)}`);
console.log(`  remote ${remoteAll.length} · merged ${rm.length}${rm.length ? ` (Friday deletes them — TEAM_RULES 13.3 #1, skill house-clean "รายการเดียว" item 1 — except a branch a doc names, an open round's, or a tip under 7 days: ${rm.join(" ")})` : ""}`);
for (const b of remoteAll.filter((b) => !remoteMerged.has(b))) console.log(`    unmerged ${b.padEnd(30)} ${lastOf(b).slice(0, 90)}`);
console.log(`  tags   ${gitLines("git tag").length} (round checkpoints — kept)`);
const pack = gitLines("git count-objects -vH").find((l) => l.startsWith("size-pack"));
if (pack) console.log(`  repo   ${pack.replace("size-pack: ", "")} packed`);

// 5c. loose folders at the repo root (owner 15/10 "อย่าให้กระจัดกระจาย") — anything untracked at the top level that is
// not a tool's own folder, the work folder _incoming/, or the owner's folder
console.log("\n## loose files/folders at the repo root (not in git, not a known tool folder)");
// "Higgs Okm" = the Higgsfield image masters: scripts/process-images.map.json names them as image provenance (stays put)
const KNOWN_ROOT = new Set(["_incoming", "node_modules", ".next", ".data", ".git", ".agents", "next-env.d.ts", "tsconfig.tsbuildinfo", "รายงานจากแอดมิน แชท", "Higgs Okm"]);
const topTracked = new Set(tracked.map((f) => f.split("/")[0]));
const loose = fs.readdirSync(".").filter((n) => !topTracked.has(n) && !KNOWN_ROOT.has(n));
for (const n of loose) {
  const st = fs.statSync(n);
  console.log(`  ${n.padEnd(30)} ${((st.isDirectory() ? size(n) : st.size) / 1048576).toFixed(1).padStart(8)} MB  ${st.mtime.toISOString().slice(0, 10)}  → move under _incoming/ or the owner decides`);
}
if (!loose.length) console.log("  none");

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
// do the locks still bite? one planted example per rule (lock round 15/10 — a lock that rots is silent, like hooksPath "nul")
try {
  const out = execSync("node scripts/pre-checker-gate.js --self-test", { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  console.log(`  pre-checker-gate --self-test: ${out.trim().split("\n").pop()}`);
} catch (e) {
  const out = String(e.stdout || "");
  console.log(`  pre-checker-gate --self-test: FAIL\n${out.split("\n").filter((l) => /FAIL/.test(l)).join("\n")}`);
}
// outside-skill scanner (skill find-skills, owner 16/10): the bait must still trip it, and our own skills stay clean of
// anything a person cannot see or that acts on load
for (const [label, cmd] of [
  ["skill-scan --self-test", "node scripts/skill-scan.js --self-test"],
  ["skill-scan our skills (hidden-only)", "node scripts/skill-scan.js --local .claude/skills --hidden-only"],
]) {
  try {
    const out = execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    console.log(`  ${label}: ${out.trim().split("\n").filter(Boolean).pop()}`);
  } catch (e) {
    console.log(`  ${label}: FAIL\n${String(e.stdout || "").split("\n").filter((l) => /FAIL|\[/.test(l)).join("\n")}`);
  }
}
for (const n of require("./lib/checker-lock").readAll(ROOT)) console.log(`  checker note still on: ${n.sha.slice(0, 8)} (${n.branch}) since ${n.started} — --done if that checker reported`);

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
