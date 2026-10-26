#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// pre-checker-gate.js — the one gate Friday runs before ANY PR goes to the checker (TEAM_RULES 13.4 · lock round 15/10).
// Rules that were kept only by memory (rule-audit 14/10 L1–L3, L5–L10 + the 13.4 checker-read lock "พ22") are checked here on the branch,
// or locked at the moment of the act by the existing locks — the gate's --self-test plants an example of each:
//
//   checked here (the branch the checker will read, diff origin/main...HEAD)
//     branch     not main, not detached, contains origin/main                           (L6)
//     tree       nothing uncommitted or untracked — the checker reads git, not the folder
//     pushed     origin/<branch> = HEAD — the `Checker:` line names a sha GitHub has (13.4)
//     hooks      core.hooksPath = .githooks — the commit/push gates are on
//     paths      no junk in the diff (_incoming/ · logs · node_modules · the owner's folder …)   (L5)
//     locked     render.yaml · .env* · ordering-mode.ts · thai-typography.ts only with a 【แตะได้】 line (13.7 · L8)
//     words      added src/ lines carry no forbidden word — THAI_STYLE §3 "ห้ามใช้" column + the grep groups of skill
//                thai-check gates 4–5 (read from those files every run, never copied here)          (L9)
//     full       a PR that reaches the site has a clean `verify:catalog --full` pass of this exact commit (build + leak
//                check — moved from GitHub to the test machine 21/10; run it in the PR's worktree, never the main folder)
//     client     an added import in a "use client" file pulls no whole table into the browser
//                (LESSONS 37 — `import type` is fine)                                                (L10)
//   locked at the act (scripts/guard-tool.js · .githooks/pre-commit · scripts/lib/chrome.js)
//     L1 one Chrome job at a time · L2 no bare build · L3 Git Bash page paths · L5 no blind add · L6 no commit on
//     main · L7 self-merge-check alone · พ22 hands off the tree + 3412 while the checker reads (the note this gate writes)
//
// Usage:
//   node scripts/pre-checker-gate.js            run every check; PASS = last line `GATE PASS <sha>` + the note
//                                               "checker reading <sha>" (guard-tool then guards the tree) — exit 0
//                                               FAIL = `GATE FAIL` + one line per problem, no note — exit 1
//   node scripts/pre-checker-gate.js --done     the checker reported: remove this tree's note
//   node scripts/pre-checker-gate.js --status   the notes that are live now
//   node scripts/pre-checker-gate.js --no-note  check only, write no note
//   node scripts/pre-checker-gate.js --only words,client [--base <ref>]   some checks only (skill thai-check gate 4)
//   node scripts/pre-checker-gate.js --allow "<word>@<file>"   pass a hit you checked by hand (an exception THAI_STYLE
//                                               names) — printed in the output so the checker sees it; repeatable
//   node scripts/pre-checker-gate.js --self-test   plant one example per rule and prove each lock bites; then run the
//                                               content checks on the last merges of origin/main (must raise nothing)
// The checker reads the commit only through git (`git show <sha>:…` / `git diff origin/main...<sha>`) — the note keeps
// the folder still for the reads that do not.
"use strict";
const { execFileSync, spawnSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { lockedName, allowedByRound, openRoundText } = require("./lib/round-file");
const { siteReason } = require("./lib/site-paths");
const checkerLock = require("./lib/checker-lock");

const ROOT = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const opt = (f) => (args.indexOf(f) >= 0 ? args[args.indexOf(f) + 1] : undefined);
const allows = args.flatMap((a, i) => (args[i - 1] === "--allow" ? [a] : []));
const git = (a, opts = {}) => execFileSync("git", ["-c", "core.quotepath=off", ...a], { cwd: opts.cwd || ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 64 << 20 }).replace(/\r\n/g, "\n");
const tryGit = (a, opts) => {
  try {
    return git(a, opts).trim();
  } catch {
    return null;
  }
};
const rd = (f) => fs.readFileSync(path.join(ROOT, f), "utf8").replace(/\r\n/g, "\n");

// ---------------------------------------------------------------- the word list (read every run, never copied here)
// THAI_STYLE §3 table, column "ห้ามใช้": "คาร์ทริดจ์ · ตลับ" → both · "(…)" notes and English forms ("pod kit (ในเนื้อความไทย)" —
// English is fine in en data) dropped · "คำ" dropped (= puff only in a few sentences; คำถาม · คำอธิบาย are everywhere).
// Skill thai-check gates 4–5: every backticked `a|b|c` group of Thai/Chinese words (misspellings · claim words).
function forbiddenWords(style = rd("docs/THAI_STYLE.md"), skill = rd(".claude/skills/thai-check/SKILL.md")) {
  const words = new Set();
  const lines = style.split("\n");
  const head = lines.findIndex((l) => /^\|\s*ใช้คำนี้\s*\|\s*ห้ามใช้\s*\|/.test(l));
  for (let i = head + 2; head >= 0 && i < lines.length && lines[i].startsWith("|"); i++) {
    // notes in brackets go first — "— (ไม่มีคำห้าม · ไม่ใช้ "อีลิควิด")" holds a · of its own; its ไม่ใช้ "…" word still counts
    const cell = lines[i].split("|")[2];
    for (const m of cell.matchAll(/ไม่ใช้\s*["“]([^"”\s]+)["”]/g)) words.add(m[1]);
    for (let w of cell.replace(/\([^)]*\)/g, "").split("·")) {
      w = w.replace(/\*/g, "").split("—")[0].trim();
      if (w && !/[A-Za-z]/.test(w) && w !== "คำ") words.add(w);
    }
  }
  const gates = skill.slice(skill.indexOf("4. **Forbidden words"), skill.indexOf("## Principles"));
  for (const m of gates.matchAll(/`([^`\s]+(?:\|[^`\s]+)+)`/g)) {
    if (/[฀-๿一-鿿]/.test(m[1])) m[1].split("|").forEach((w) => words.add(w));
  }
  return [...words];
}
// "พอด" must not hit "พอดี" (THAI_STYLE §3 first row)
const wordRe = (w) => new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + (w === "พอด" ? "(?!ี)" : ""));
// hidden search terms are not customer-facing text (THAI_STYLE §3 "คำค้นซ่อน")
const WORD_SKIP = [/^src\/data\/search-aliases\.ts$/];

// ---------------------------------------------------------------- whole tables a "use client" file must not import as values
// (LESSONS 37 — the server page passes the page's slice as a prop). Prefixes of repo paths, without the extension.
const WHOLE_TABLES = [
  "src/data/guides", "src/data/products", "src/data/product-articles", "src/data/catalog-relationships", "src/data/shipnity-seed/",
  "src/i18n/story-copy", "src/i18n/guides-copy", "src/i18n/product-copy-th", "src/i18n/search-head-copy", "src/lib/category-visibility",
];
// "src/data" alone = the barrel src/data/index.ts (resolveSpec drops "/index")
const isWholeTable = (p) => p === "src/data" || WHOLE_TABLES.some((t) => (t.endsWith("/") ? p.startsWith(t) : p === t || p.startsWith(t + "/")));

// ---------------------------------------------------------------- junk that never belongs in a PR (L5)
const JUNK = [
  [/^_incoming\//, "_incoming/ is the scratch folder (not in git)"],
  [/(^|\/)node_modules\//, "node_modules"],
  [/^\.next\//, "build output"],
  [/^รายงานจากแอดมิน/, "the owner's own folder — never in git (HANDOFF §16 item 2)"],
  [/\.(log|tmp|bak|orig|rej)$/i, "a log / temp / merge leftover"],
  [/(^|\/)(Thumbs\.db|\.DS_Store|desktop\.ini)$/i, "an OS file"],
];

// ---------------------------------------------------------------- the checks (pure: state in → problems out)
function checkBranch(s) {
  if (!s.branch) return ["detached HEAD — the checker needs a branch (git switch -c <name>)"];
  if (/^(main|master)$/.test(s.branch)) return [`on ${s.branch} — a PR comes from a work branch (TEAM_RULES 13.7)`];
  if (!s.containsMain) return [`${s.branch} does not contain origin/main — merge origin/main first (skill round-open step 2)`];
  return [];
}
const checkTree = (s) => (s.dirty.length ? [`uncommitted or untracked (the checker reads git): ${s.dirty.slice(0, 6).join(" · ")}${s.dirty.length > 6 ? " …" : ""}`] : []);
function checkPushed(s) {
  if (!s.remoteHead) return [`origin/${s.branch} does not exist — push the branch first`];
  return s.remoteHead === s.head ? [] : [`origin/${s.branch} = ${s.remoteHead.slice(0, 8)}, HEAD = ${s.head.slice(0, 8)} — push first`];
}
const checkHooks = (s) => (s.hooksPath === ".githooks" ? [] : [`core.hooksPath = ${s.hooksPath || "(unset)"} — the commit/push gates are off: git config core.hooksPath .githooks`]);
function checkPaths(s) {
  const out = [];
  for (const f of s.files) for (const [re, why] of JUNK) if (re.test(f)) out.push(`${f} — ${why}`);
  return out;
}
function checkLocked(s) {
  return s.files
    .filter((f) => lockedName(f) && !allowedByRound(lockedName(f), s.roundText))
    .map((f) => `${f} is locked — no 【แตะได้】 line of the open round's file names it (TEAM_RULES 13.7)`);
}
function checkFull(s) {
  const site = s.files.filter((f) => siteReason(f));
  if (!site.length || s.fullStamp) return [];
  const some = site.slice(0, 3).join(" · ") + (site.length > 3 ? " …" : "");
  return [
    `${site.length} file(s) reach the site (${some}) and ${String(s.head).slice(0, 8)} has no clean verify:catalog --full pass — ` +
      `run "npx tsx scripts/verify-catalog.ts --full" in the PR's test worktree on this commit (TEAM_RULES 13.5 #2 (ก))`,
  ];
}
function checkWords(s) {
  const words = s.words.map((w) => [w, wordRe(w)]);
  const out = [];
  for (const [file, lines] of Object.entries(s.added)) {
    if (!file.startsWith("src/") || WORD_SKIP.some((re) => re.test(file))) continue;
    for (const { n, text } of lines) {
      if (/^\s*(\/\/|\/?\*)/.test(text)) continue; // a code comment is not site copy
      for (const [w, re] of words) {
        if (!re.test(text)) continue;
        if (s.allows.includes(`${w}@${file}`)) {
          s.notes.push(`allowed by hand: "${w}" in ${file}:${n}`);
          continue;
        }
        out.push(`${file}:${n} "${w}" — THAI_STYLE §3 / skill thai-check gates 4–5 (an exception THAI_STYLE names: --allow "${w}@${file}")`);
      }
    }
  }
  return out;
}
// every import statement of a file with its line range (1-based) and whether it is type-only
function imports(src) {
  const out = [];
  const re = /^import\s+(type\s+)?([\s\S]*?)\s+from\s+["']([^"']+)["'];?/gm;
  for (const m of src.matchAll(re)) {
    const start = src.slice(0, m.index).split("\n").length;
    const end = start + m[0].split("\n").length - 1;
    const names = m[2].replace(/^\{|\}$/g, "").split(",").map((x) => x.trim()).filter(Boolean);
    const typeOnly = Boolean(m[1]) || (/^\{[\s\S]*\}$/.test(m[2].trim()) && names.every((x) => /^type\s/.test(x)));
    out.push({ start, end, spec: m[3], typeOnly });
  }
  return out;
}
const isClient = (src) => /^(?:\s|\/\/[^\n]*\n|\/\*[\s\S]*?\*\/)*["']use client["']/.test(src);
function resolveSpec(file, spec) {
  let p = spec.startsWith("@/") ? "src/" + spec.slice(2) : spec.startsWith(".") ? path.posix.join(path.posix.dirname(file), spec) : null;
  return p && p.replace(/\.(tsx?|jsx?)$/, "").replace(/\/index$/, "");
}
function checkClient(s) {
  const out = [];
  for (const [file, lines] of Object.entries(s.added)) {
    if (!/^src\/.+\.(tsx?|jsx?)$/.test(file) || !s.content[file] || !isClient(s.content[file])) continue;
    const addedNs = new Set(lines.map((l) => l.n));
    for (const im of imports(s.content[file])) {
      if (im.typeOnly) continue;
      const p = resolveSpec(file, im.spec);
      let touched = false;
      for (let n = im.start; n <= im.end; n++) touched = touched || addedNs.has(n);
      if (p && touched && isWholeTable(p)) out.push(`${file}:${im.start} imports ${im.spec} into a "use client" file — the whole table ships to every visitor; pass the page's slice as a prop (LESSONS 37)`);
    }
  }
  return out;
}
const CHECKS = { branch: checkBranch, tree: checkTree, pushed: checkPushed, hooks: checkHooks, paths: checkPaths, locked: checkLocked, full: checkFull, words: checkWords, client: checkClient };

// ---------------------------------------------------------------- read the real state
function addedLines(diff) {
  const out = {};
  let file = null;
  let n = 0;
  for (const line of diff.split("\n")) {
    if (line.startsWith("+++ ")) file = line.startsWith("+++ b/") ? line.slice(6) : null;
    else if (line.startsWith("@@")) n = Number(line.match(/\+(\d+)/)[1]);
    else if (file && line.startsWith("+")) (out[file] = out[file] || []).push({ n: n++, text: line.slice(1) });
    else if (file && line.startsWith(" ")) n++;
  }
  return out;
}
function fullStamped(sha, cwd = ROOT) {
  const common = tryGit(["rev-parse", "--git-common-dir"], { cwd });
  return !!(sha && common && fs.existsSync(path.join(path.resolve(cwd, common), "verify-full", sha)));
}
function realState(base, head = "HEAD", cwd = ROOT) {
  const branch = tryGit(["branch", "--show-current"], { cwd }) || "";
  const files = git(["diff", "--name-only", "--no-renames", `${base}...${head}`], { cwd }).split("\n").filter(Boolean);
  const added = addedLines(git(["diff", "-U0", "--no-color", "--no-renames", `${base}...${head}`, "--", "src/"], { cwd }));
  const content = {};
  for (const f of Object.keys(added)) content[f] = tryGit(["show", `${head}:${f}`], { cwd }) || "";
  return {
    branch,
    head: tryGit(["rev-parse", head], { cwd }),
    containsMain: spawnSync("git", ["merge-base", "--is-ancestor", base, head], { cwd }).status === 0,
    remoteHead: branch ? tryGit(["rev-parse", "--verify", "--quiet", `origin/${branch}`], { cwd }) : null,
    dirty: (tryGit(["status", "--porcelain"], { cwd }) || "").split("\n").filter(Boolean).map((l) => l.slice(3)),
    hooksPath: tryGit(["config", "core.hooksPath"], { cwd }) || "",
    files,
    added,
    content,
    roundText: openRoundText(cwd),
    fullStamp: fullStamped(tryGit(["rev-parse", head], { cwd }), cwd),
    words: forbiddenWords(),
    allows,
    notes: [],
  };
}
function run(state, names) {
  const problems = [];
  for (const name of names) for (const p of CHECKS[name](state)) problems.push(`  ${name.padEnd(7)} ${p}`);
  return problems;
}

// ---------------------------------------------------------------- self-test: one planted example per rule
function selfTest() {
  let bad = 0;
  const ok = (cond, what) => {
    console.log(`  ${cond ? "ok  " : "FAIL"} ${what}`);
    if (!cond) bad++;
  };
  const words = forbiddenWords();
  const clean = {
    branch: "lock-test", head: "a".repeat(40), containsMain: true, remoteHead: "a".repeat(40), dirty: [], hooksPath: ".githooks",
    files: ["scripts/x.js", "src/components/Foo.tsx"],
    added: { "src/components/Foo.tsx": [{ n: 3, text: 'import { brandName } from "@/data/brands";' }, { n: 4, text: 'const label = "พอดี พอตใช้แล้วทิ้ง";' }] },
    content: { "src/components/Foo.tsx": '"use client";\n\nimport { brandName } from "@/data/brands";\nconst label = "พอดี พอตใช้แล้วทิ้ง";\n' },
    roundText: "", fullStamp: true, words, allows: [], notes: [],
  };
  const fails = (name, patch) => run({ ...clean, ...patch, notes: [] }, [name]).length > 0;
  console.log("## gate checks — a clean branch passes, each planted example fails");
  ok(run(clean, Object.keys(CHECKS)).length === 0, "clean example passes every check");
  ok(words.length >= 10 && words.includes("ดิสโพส") && words.includes("คาร์ทริดจ์"), `word list read from THAI_STYLE §3 + skill thai-check (${words.length} words)`);
  ok(words.every((w) => !/[()"'“”\s]/.test(w)), `every word is a bare word (no bracket, quote or space): ${words.join(" ")}`);
  ok(fails("branch", { branch: "main" }), "branch: on main (L6)");
  ok(fails("branch", { branch: "" }), "branch: detached HEAD");
  ok(fails("branch", { containsMain: false }), "branch: behind origin/main");
  ok(fails("tree", { dirty: ["src/a.ts"] }), "tree: uncommitted file");
  ok(fails("pushed", { remoteHead: "b".repeat(40) }), "pushed: HEAD not on GitHub");
  ok(fails("hooks", { hooksPath: "nul" }), "hooks: core.hooksPath off (15/10 incident)");
  ok(fails("paths", { files: ["_incoming/x/report.md"] }), "paths: _incoming/ file in the diff (L5)");
  ok(fails("full", { fullStamp: false }), "full: a site PR without a clean verify:catalog --full pass of its head (21/10)");
  ok(!fails("full", { files: ["docs/x.md"], fullStamp: false }), "full: a docs-only PR needs no --full pass");
  ok(fails("paths", { files: ["scripts/run.log"] }), "paths: a log file in the diff (L5)");
  ok(fails("locked", { files: ["src/lib/thai-typography.ts"] }), "locked: thai-typography.ts without 【แตะได้】 (L8)");
  ok(!fails("locked", { files: ["src/lib/thai-typography.ts"], roundText: "【แตะได้】 src/lib/thai-typography.ts" }), "locked: the same file with a 【แตะได้】 line passes");
  const plantWord = (text) => ({ added: { "src/components/Foo.tsx": [{ n: 4, text }] } });
  ok(fails("words", plantWord('const t = "สินค้าดิสโพสรุ่นใหม่";')), "words: ดิสโพส added in src (L9)");
  ok(fails("words", plantWord('const t = "เปลี่ยนตลับได้";')), "words: ตลับ added in src (L9)");
  ok(fails("words", plantWord('const t = "พอดซิสเต็ม";')), "words: พอด (not พอดี) added in src (L9)");
  ok(!fails("words", plantWord("// พอตใช้แล้วทิ้ง not ดิสโพส")), "words: a code comment passes");
  ok(!fails("words", { ...plantWord('const t = "ดิสโพส";'), allows: ["ดิสโพส@src/components/Foo.tsx"] }), "words: --allow word@file passes");
  const plantImport = (line, type = "") => ({
    added: { "src/components/Foo.tsx": [{ n: 3, text: line }] },
    content: { "src/components/Foo.tsx": `${type}"use client";\n\n${line}\nexport const X = 1;\n` },
  });
  ok(fails("client", plantImport('import { PRODUCT_COPY_TH } from "@/i18n/product-copy-th";')), "client: whole table imported into a client file (L10)");
  ok(fails("client", plantImport('import { guides } from "../data/guides";')), "client: same through a relative path");
  ok(!fails("client", plantImport('import type { Guide } from "@/data/guides";')), "client: `import type` passes");
  ok(!fails("client", { ...plantImport('import { guides } from "@/data/guides";'), content: { "src/components/Foo.tsx": 'import { guides } from "@/data/guides";\n\nimport { x } from "y";\n' } }), "client: a server file passes");

  console.log("\n## locks at the act — scripts/guard-tool.js (hook) on planted commands");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "okami24-gate-"));
  const noNotes = path.join(tmp, "no-notes"); // the real "checker reading" note (if one is on now) must not change the answers
  fs.mkdirSync(noNotes);
  const guard = (input, env = {}) => {
    const r = spawnSync(process.execPath, [path.join(ROOT, "scripts", "guard-tool.js")], { input: JSON.stringify(input), encoding: "utf8", env: { ...process.env, OKAMI24_CHECKER_LOCK_DIR: noNotes, ...env } });
    try {
      return JSON.parse(r.stdout).hookSpecificOutput.permissionDecision;
    } catch {
      return "none";
    }
  };
  const sh = (command, cwd = ROOT) => ({ tool_name: "Bash", tool_input: { command }, cwd });
  const wt = path.join(ROOT, "_incoming", "wt-x");
  ok(guard(sh("npm run build")) === "deny", "L2 bare `npm run build` in the main folder → deny");
  ok(guard(sh("npx next build")) === "deny" && guard(sh("node_modules/.bin/next build")) === "deny", "L2 bare `npx next build` / `.bin/next build` → deny");
  ok(guard(sh("npx next build > _incoming/b.log 2>&1")) === "deny", "L2 a log under _incoming/ does not make it a worktree build → deny");
  ok(guard(sh("cd _incoming/wt-x && npx next build")) === "none", "L2 `cd` into a worktree under _incoming/, then build → allowed");
  ok(guard(sh("npx next build", wt)) === "none", "L2 the shell already sits in the worktree → allowed");
  ok(guard(sh("git add -A")) === "deny" && guard(sh("git add .")) === "deny" && guard(sh("git add ./")) === "deny", "L5 `git add -A` / `.` / `./` → deny");
  ok(guard(sh('git commit -am "x y"')) === "deny", "L5 `git commit -a` → deny");
  ok(guard(sh("git add scripts/a.js docs/b.md")) === "none", "L5 add by name → allowed");
  ok(guard(sh("node scripts/self-merge-check.js --pr 9 && gh pr merge 9 --merge")) === "deny", "L7 self-merge-check + merge in one command → deny");
  ok(guard(sh('git commit -m "self-merge-check then gh pr merge"')) === "none", "L7 the words inside a commit message → allowed");
  ok(guard(sh("git merge-base --is-ancestor a b && node scripts/self-merge-check.js")) === "none", "L7 `git merge-base` is not a merge → allowed");
  if (process.platform === "win32") {
    ok(guard(sh('node scripts/scan.js --pages "/about /faq"')) === "deny", "L3 Git Bash page path without MSYS_NO_PATHCONV=1 → deny");
    ok(guard(sh('node scripts/scan.js --pages "/"')) === "deny", 'L3 the home page "/" alone → deny');
    ok(guard(sh('MSYS_NO_PATHCONV=1 node scripts/scan.js --pages "/about"')) === "none", "L3 with MSYS_NO_PATHCONV=1 → allowed");
    ok(guard(sh("node scripts/x.js /c/Users/a.txt")) === "none", "L3 a /c/… drive path → allowed");
    ok(guard(sh("node scripts/x.js | sed -n '/a/p'")) === "none", "L3 a pipe after the script → allowed");
    ok(guard(sh('git commit -m "ran node scripts/scan.js --pages /about"')) === "none" && guard(sh('gh pr create --title "foo /bar"')) === "none", "L3 a commit message / gh title quoting it → allowed");
    ok(guard(sh("node --max-old-space-size=4096 scripts/scan.js /about")) === "deny", "L3 node's own flag before the script still → deny (gap 15/10)");
    ok(guard(sh('node scripts/x.js --title "a /b"')) === "none", "L3 a quoted argument that does not START with / → allowed (gap 15/10)");
    ok(guard(sh("node scripts/scan.js --pages=/about,/faq")) === "deny", "L3 a --flag=/… value → deny");
  } else console.log("  skip L3 (Git Bash path rewriting exists on Windows only)");
  ok(guard(sh("git push --force")) === "deny", "B force push still → deny (old lock intact)");
  // I (house round 26/10): scan/shot tools never pointed at the live site without OKAMI24_LIVE_OK=1
  ok(guard(sh("node scripts/shot.js a.png https://okami24.store/ --ready")) === "deny" && guard(sh("node scripts/visible-text.js scan --base https://okami24.store --out x /")) === "deny", "I shot / visible-text against okami24.store → deny");
  ok(guard(sh("OKAMI24_LIVE_OK=1 node scripts/shot.js a.png https://okami24.store/")) === "none", "I OKAMI24_LIVE_OK=1 in front → allowed");
  ok(guard(sh("curl -s -o /dev/null -w '%{http_code}' https://okami24.store/")) === "none" && guard(sh("node scripts/shot.js a.png http://localhost:3412/")) === "none", "I curl of the live site / a tool on the test server → allowed");
  ok(guard(sh('git commit -m "ran node scripts/scan.js on okami24.store"')) === "none", "I a commit message quoting it → allowed");
  // J (house round 26/10): a brief the next chat has not picked up is not overwritten
  const brief = path.join(tmp, "_incoming", "next-chat-selftest.md"); // a scratch tree: the guard reads any …/_incoming/next-chat*.md
  fs.mkdirSync(path.dirname(brief), { recursive: true });
  fs.writeFileSync(brief, "status: ready\n\nbrief\n");
  ok(guard({ tool_name: "Write", tool_input: { file_path: brief, content: "a new brief\n" }, cwd: ROOT }) === "deny", "J Write over a `status: ready` brief → deny");
  ok(guard({ tool_name: "Write", tool_input: { file_path: brief, content: "status: started\n\nbrief\n" }, cwd: ROOT }) === "none", "J the new chat writing `status: started` → allowed");
  ok(guard(sh(`echo x > _incoming/${path.basename(brief)}`, tmp)) === "deny", "J a > redirect over a ready brief → deny");
  fs.writeFileSync(brief, "status: started\n\nbrief\n");
  ok(guard({ tool_name: "Write", tool_input: { file_path: brief, content: "a new brief\n" }, cwd: ROOT }) === "none", "J a `status: started` brief may be overwritten → allowed");
  fs.unlinkSync(brief);
  // K (house round 26/10): HANDOFF §16 spec at commit time
  const hs = require("./handoff-size-check");
  ok(hs.check("## 16. x\nshort\n## 17. y\n").length === 0, "K a small §16 → OK");
  ok(hs.check("## 16. x\n" + "ก".repeat(700) + "\n## 17. y\n").some((p) => /line 2 is \d+ bytes/.test(p)), "K a §16 line over 2,000 bytes → flagged");
  ok(hs.check("## 16. x\n" + ("a".repeat(100) + "\n").repeat(160) + "## 17. y\n").some((p) => /§16 is \d+ bytes/.test(p)), "K a §16 over 15,000 bytes → flagged");
  const env = { OKAMI24_CHECKER_LOCK_DIR: tmp };
  ok(guard(sh("git checkout main"), env) === "none", "พ22 no note → git checkout allowed");
  process.env.OKAMI24_CHECKER_LOCK_DIR = tmp;
  checkerLock.write(ROOT, { sha: "c".repeat(40), branch: "lock-test", tree: ROOT });
  delete process.env.OKAMI24_CHECKER_LOCK_DIR;
  ok(guard(sh("git checkout main"), env) === "deny", "พ22 note on → `git checkout` in the read tree → deny");
  ok(guard(sh("node scripts/test-server.js build"), env) === "deny", "พ22 note on → test-server build → deny");
  ok(guard({ tool_name: "Edit", tool_input: { file_path: path.join(ROOT, "docs", "HANDOFF.md") }, cwd: ROOT }, env) === "deny", "พ22 note on → Edit in the read tree → deny");
  ok(guard({ tool_name: "Write", tool_input: { file_path: path.join(ROOT, "_incoming", "next", "plan.md") }, cwd: ROOT }, env) === "none", "พ22 note on → Write under _incoming/ → allowed");
  ok(guard(sh("git -C _incoming/wt-x checkout -b next"), env) === "none", "พ22 note on → git in a worktree under _incoming/ → allowed");
  ok(guard({ tool_name: "Edit", tool_input: { file_path: path.join(ROOT, ".claude", "worktrees", "wt-y", "docs", "a.md") }, cwd: ROOT }, env) === "none" &&
    guard(sh("git -C .claude/worktrees/wt-y commit -m x"), env) === "none", "พ22 note on → an app worktree under .claude/worktrees/ is its own tree → allowed (16/10)");
  ok(guard(sh("git checkout main 2>&1 | tee _incoming/x.log"), env) === "deny", "พ22 note on → a log under _incoming/ does not excuse a checkout → deny");
  ok(guard(sh("git checkout main", wt), env) === "none", "พ22 note on → the shell sits in another worktree → allowed");
  ok(guard(sh("node scripts/pre-checker-gate.js --done"), env) === "none", "พ22 note on → --done → allowed");
  // H+ (house round 26/10): plain shell writes into the read tree
  ok(guard(sh("rm docs/old.md"), env) === "deny", "H+ note on → rm in the read tree → deny");
  ok(guard(sh("sed -i 's/a/b/' docs/HANDOFF.md"), env) === "deny", "H+ note on → sed -i in the read tree → deny");
  ok(guard(sh("echo x > docs/a.md"), env) === "deny" && guard(sh("node scripts/x.js >> docs/a.md"), env) === "deny", "H+ note on → a > / >> redirect into the read tree → deny");
  ok(guard(sh("node scripts/house-check.js > _incoming/h.txt 2>&1"), env) === "none", "H+ note on → a redirect under _incoming/ (and 2>&1) → allowed");
  ok(guard(sh("rm docs/old.md", wt), env) === "none", "H+ note on → rm in another worktree → allowed");

  console.log("\n## locks at the act — .githooks/pre-commit and scripts/lib/chrome.js");
  const repo = path.join(tmp, "repo");
  fs.mkdirSync(repo);
  const g = (a) => spawnSync("git", a, { cwd: repo, encoding: "utf8" });
  g(["init", "-q", "-b", "main"]);
  g(["config", "user.email", "t@t"]);
  g(["config", "user.name", "t"]);
  g(["config", "core.hooksPath", path.join(ROOT, ".githooks").replace(/\\/g, "/")]);
  const c = g(["commit", "-q", "--allow-empty", "-m", "x"]);
  ok(c.status !== 0 && /no commits on main/.test(c.stderr), "L6 a commit on main → refused by pre-commit");
  const lockDir = path.join(tmp, "chrome");
  fs.mkdirSync(lockDir);
  fs.writeFileSync(path.join(lockDir, "okami24-chrome-job.json"), JSON.stringify({ pid: process.pid, script: "self-test", started: new Date().toISOString() }));
  const probe = `require(${JSON.stringify(path.join(ROOT, "scripts", "lib", "chrome.js"))}).CHROME`;
  const childEnv = { ...process.env, OKAMI24_CHROME_LOCK_DIR: lockDir, OKAMI24_CHROME_LOCK_WAIT: "0" };
  delete childEnv.OKAMI24_CHROME_JOB;
  const second = spawnSync(process.execPath, ["-e", probe], { env: childEnv, encoding: "utf8" });
  ok(second.status === 2 && /gave up/.test(second.stderr), "L1 a second Chrome job while one runs → refused (exit 2)");
  const child = spawnSync(process.execPath, ["-e", probe], { env: { ...childEnv, OKAMI24_CHROME_JOB: String(process.pid) }, encoding: "utf8" });
  ok(child.status === 0, "L1 a child of the running job → allowed");
  const findOnly = spawnSync(process.execPath, ["-e", `require(${JSON.stringify(path.join(ROOT, "scripts", "lib", "chrome.js"))}).findChrome()`], { env: childEnv, encoding: "utf8" });
  ok(findOnly.status === 0, "L1 findChrome() alone (prepare-clone) never takes the lock");
  fs.rmSync(tmp, { recursive: true, force: true });

  const N = Number(opt("--merges") || 10);
  // `locked` is left out: it reads TODAY's round file, which never named an older round's 【แตะได้】 file. A hit here is a
  // past slip or a false alarm — read it (15/10, 150 merges: 1 hit, #433 Footer → @/data/guides = the LESSONS 37 slowdown).
  console.log(`\n## real data — paths/words/client on the last ${N} merges of origin/main (a hit = read it; not a self-test failure)`);
  const merges = (tryGit(["rev-list", "--first-parent", "--merges", "-n", String(N), "origin/main"]) || "").split("\n").filter(Boolean);
  let raised = 0;
  for (const m of merges) {
    const s = { ...realState(`${m}^1`, m), allows: [], notes: [] };
    const p = run(s, ["paths", "words", "client"]);
    if (p.length) console.log(`  ${m.slice(0, 8)}:\n${p.join("\n")}`);
    raised += p.length;
  }
  console.log(`  ${merges.length} merges read · ${raised} raised`);
  console.log(bad ? `SELF-TEST FAIL (${bad})` : "SELF-TEST PASS");
  process.exit(bad ? 1 : 0);
}

// ---------------------------------------------------------------- main
const top = tryGit(["rev-parse", "--show-toplevel"], { cwd: process.cwd() }) || ROOT;
if (has("--self-test")) selfTest();
if (has("--status")) {
  const notes = checkerLock.readAll(top);
  for (const n of notes) console.log(`checker reading ${n.sha.slice(0, 8)} (${n.branch}) in ${n.tree} since ${n.started}`);
  if (!notes.length) console.log("no checker note");
  process.exit(0);
}
if (has("--done")) {
  console.log(checkerLock.clear(top, top) ? `note removed for ${top}` : `no note for ${top}`);
  process.exit(0);
}
const base = opt("--base") || "origin/main";
if (!opt("--base")) {
  for (const ref of ["main", tryGit(["branch", "--show-current"], { cwd: top })].filter(Boolean)) tryGit(["fetch", "--quiet", "origin", ref], { cwd: top });
}
const names = opt("--only") ? opt("--only").split(",").map((x) => x.trim()) : Object.keys(CHECKS);
const unknown = names.filter((n) => !CHECKS[n]);
if (unknown.length) {
  console.error(`unknown check: ${unknown.join(", ")} — known: ${Object.keys(CHECKS).join(", ")}`);
  process.exit(2);
}
const state = realState(base, "HEAD", top);
const problems = run(state, names);
console.log(`pre-checker gate · ${state.branch || "(detached)"} @ ${String(state.head).slice(0, 8)} vs ${base} · ${state.files.length} files · checks: ${names.join(" ")}`);
for (const n of state.notes) console.log(`  note    ${n}`);
if (problems.length) {
  console.log(problems.join("\n"));
  console.log(`GATE FAIL (${problems.length})`);
  process.exit(1);
}
if (!opt("--only") && !has("--no-note")) {
  checkerLock.write(top, { sha: state.head, branch: state.branch, tree: top });
  console.log("  note    checker reading — the tree and 3412 stay still until `node scripts/pre-checker-gate.js --done` (guard-tool)");
}
console.log(`GATE PASS ${state.head}`);
