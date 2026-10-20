#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// self-merge-check.js — is this PR small or big? (TEAM_RULES 13.7 — merge rule of round C, owner 2026-09-27: Friday
// merges every PR of this repo · small and big = merge after checker + green checks, then report (big on its own line — owner 30/09) · Javis merges only
// when the owner says so)
//
// Per file (the one list: scripts/lib/site-paths.js, shared with the deploy gate):
//   BIG   runs by itself or decides merges/deploys (settings · hooks · scripts a hook runs · .github/ · rules copy ·
//         gate files) · orders/money/stock/what is for sale · build/server config · Render build/Shell scripts
//   SITE  anything else a visitor gets (src/ public/ …) — small, tier A and tier B alike (owner 28/09: tier B merges,
//         then the before/after shots go to the owner). (The 7 SEO-baseline-page hold, 13.7 item (3), was lifted by
//         the owner 02/10.)
//   ok    off the site (docs · skills · agents · rules text · ordinary scripts)
// Also BIG: a PR that edits 13.7 itself (its merge rule). --pr also reads the PR description: no `Checker: PASS <head sha>`
// / `Checker: SKIP <reason>` line = BLOCKED (TEAM_RULES 13.4, owner 15/10). --pr also BLOCKS until the GitHub checks of
// the PR head are finished and green and the deploy workflow really ran on it (not a draft-time skip — ciProblems).
// "Not sure = big": the off-site list is an ALLOW-list.
//
// Usage:
//   node scripts/self-merge-check.js                 # diff origin/main...HEAD — the PR's files when HEAD = the PR head
//                                                    #   (works anywhere; `git fetch origin main` first)
//   node scripts/self-merge-check.js --pr 68         # the files of GitHub PR #68 via `gh` (computer only) — run it on the
//                                                    #   PR's branch: a local HEAD other than the PR head is BLOCKED
//   node scripts/self-merge-check.js --files a,b     # a given list — gate tests only, NOT a merge verdict (no head pinned)
//   node scripts/self-merge-check.js --base <ref>    # PROOF SIZING, not a merge verdict: every change since <ref>,
//                                                    #   committed or not + untracked; judges "site touched?" only:
//                                                    #   last line PASS (nothing a visitor gets changed, exit 0) or
//                                                    #   SITE-TOUCHED (exit 1) - a sizing answer, never a merge verdict
// Last line (merge verdict): SMALL · SITE · BIG — or BLOCKED when it cannot judge (not this repo · render.yaml would
// deploy on merge · local HEAD is not the PR head · --pr: no valid Checker line · empty diff). Exit 0 for SMALL/SITE/BIG, 1 for BLOCKED.
// Also prints `HEAD <sha>` — merge exactly that commit (pin it in the merge call).
// --files keeps its PASS/BLOCKED lines (list test) · --base prints PASS / SITE-TOUCHED (rule-audit 15/10 row 40:
// BLOCKED meant two things) — skill round-close reads it.
"use strict";
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const { siteReason, bigReason, buildScripts, hookScripts } = require("./lib/site-paths");

// Does the diff origin/main...HEAD change a line inside "### 13.7" of TEAM_RULES? (a PR editing its own merge rule = big)
function edits137(files) {
  if (!files.includes(".claude/TEAM_RULES.md")) return false;
  let text = "";
  let diff = "";
  try {
    text = fs.readFileSync(path.join(ROOT, ".claude", "TEAM_RULES.md"), "utf8");
    diff = git(["diff", "-U0", "origin/main...HEAD", "--", ".claude/TEAM_RULES.md"]);
  } catch {
    return true; // cannot tell = big
  }
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((l) => l.startsWith("### 13.7"));
  const end = lines.findIndex((l, i) => i > start && l.startsWith("### "));
  if (start === -1) return true;
  for (const m of diff.matchAll(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/gm)) {
    const a = Number(m[3]);
    const n = m[4] === undefined ? 1 : Number(m[4]);
    const lo = a;
    const hi = n === 0 ? a : a + n - 1; // n = 0: a pure deletion after line a
    if (hi >= start + 1 && lo <= (end === -1 ? lines.length : end)) return true;
  }
  return false;
}

// Repo-level conditions: the rule is for this web repo only, and a merge must never become a deploy.
function repoProblems() {
  const out = [];
  let origin = "";
  try {
    origin = execFileSync("git", ["remote", "get-url", "origin"], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    /* no origin */
  }
  if (!/[/:]dhetchaiyakrith24\/okami24-web(\.git)?$/.test(origin)) out.push(`not the okami24-web repo (origin = ${origin || "none"}) - smogz-rules and other repos: Javis merges`);
  let y = "";
  try {
    y = fs.readFileSync(path.join(ROOT, "render.yaml"), "utf8");
  } catch {
    /* handled below */
  }
  if (!/^\s*autoDeploy:\s*false\s*$/m.test(y)) out.push("render.yaml has no `autoDeploy: false` - a merge to main would deploy");
  return out;
}

function git(args) {
  // core.quotePath=false: otherwise git prints a Thai file name as "docs/\340\270..." and it fails the allow-list
  return execFileSync("git", ["-c", "core.quotePath=false", ...args], { cwd: ROOT, encoding: "utf8" });
}

// A git C-quoted path ("…" with \ooo octal bytes and \" \\ \t \n escapes) → the real UTF-8 path; anything else as is.
function unquoteGitPath(line) {
  const s = line.trim();
  if (!(s.length >= 2 && s.startsWith('"') && s.endsWith('"'))) return line;
  const bytes = [];
  const body = s.slice(1, -1);
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (c !== "\\") { bytes.push(...Buffer.from(c, "utf8")); continue; }
    const nxt = body[i + 1];
    if (/[0-7]/.test(nxt)) { bytes.push(parseInt(body.slice(i + 1, i + 4), 8)); i += 3; continue; }
    bytes.push(({ n: 10, t: 9, '"': 34, "\\": 92 })[nxt] ?? nxt.charCodeAt(0));
    i += 1;
  }
  return Buffer.from(bytes).toString("utf8");
}

// The PR description must carry the checker's verdict (TEAM_RULES 13.4, owner 15/10): `Checker: PASS <sha>` for the PR
// head it checked (≥ 7 hex chars), or `Checker: SKIP <reason>` for a PR that needs no checker (docs-only 13.7 · a
// polish after PASS, 13.5 #2 (จ)). Returns why the line fails, or "" when it is fine. --pr mode only (needs `gh`).
function checkerLineProblem(body, prHead) {
  const m = body.match(/^\s*Checker:\s*(PASS|SKIP)\b[ \t]*(.*)$/im);
  if (!m) return "no `Checker: PASS <sha>` / `Checker: SKIP <reason>` line in the PR description (TEAM_RULES 13.4)";
  const rest = m[2].trim();
  if (m[1].toUpperCase() === "SKIP") return rest ? "" : "`Checker: SKIP` needs a reason (TEAM_RULES 13.4)";
  const sha = (rest.match(/^[0-9a-f]{7,40}\b/i) || [""])[0].toLowerCase();
  if (!sha) return "`Checker: PASS` needs the checked head sha (TEAM_RULES 13.4)";
  if (!prHead.toLowerCase().startsWith(sha)) return `checker passed ${sha.slice(0, 7)}, the PR head is ${prHead.slice(0, 7)} - check again (TEAM_RULES 13.4)`;
  return "";
}

function changedFiles(argv) {
  const fl = argv.indexOf("--files"); // dry run on a given list (comma-separated) - for testing the gate itself
  if (fl !== -1) return (argv[fl + 1] || "").split(",").join("\n");
  const pr = argv.indexOf("--pr");
  if (pr !== -1) {
    const n = argv[pr + 1];
    if (!/^\d+$/.test(n || "")) throw new Error("--pr needs a PR number");
    try {
      // `gh pr diff --name-only` prints a Thai (non-ASCII) path git-quoted: "docs/rounds/\340\270\243…txt" — which then
      // fails the allow-list (round B 2026-09-27: 49 Thai-named docs/rounds files BLOCKED PR #74). Unquote it back.
      const out = execFileSync("gh", ["pr", "diff", n, "--name-only"], { cwd: ROOT, encoding: "utf8" });
      return out.split("\n").map(unquoteGitPath).join("\n");
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
      console.log("no `gh` here (the cloud) - check out the PR branch and run without --pr");
      console.log("BLOCKED (could not read the PR's files)");
      process.exit(1);
    }
  }
  const b = argv.indexOf("--base");
  if (b !== -1) {
    // --base <ref> = proof sizing (round-close step 1 item 0): everything since <ref> INCLUDING uncommitted and
    // untracked files, because a batch is checked before it is committed
    const tracked = git(["diff", "--name-only", argv[b + 1]]);
    const untracked = git(["ls-files", "--others", "--exclude-standard"]);
    return tracked + "\n" + untracked;
  }
  return git(["diff", "--name-only", "origin/main...HEAD"]);
}

// --pr: the GitHub checks of the PR head (statusCheckRollup). Since #665 a draft PR skips the deploy workflow,
// and GitHub counts a skipped required check as passed — 21/10 PR #666 sat ready with `checks` SKIPPED (its
// ready_for_review run was cancelled by a later draft-time run). So: the deploy workflow must have run on the
// head (`decide` SUCCESS; `checks` SUCCESS, or SKIPPED only because decide found nothing on the site) and every
// other check must be finished and green. Returns the problems, [] when fine.
function ciProblems(rollup) {
  const all = rollup.filter((c) => c && c.__typename === "CheckRun");
  // the rollup can list an older run of a check next to the newer one: keep only the newest per name
  const when = (c) => Date.parse(c.startedAt || c.completedAt || "") || 0;
  const newest = new Map();
  for (const c of all) if (!newest.has(c.name) || when(c) >= when(newest.get(c.name))) newest.set(c.name, c);
  const runs = [...newest.values()];
  const last = (name) => newest.get(name);
  const out = [];
  const decide = last("decide");
  const checks = last("checks");
  if (!decide) out.push("the deploy workflow has not run on the PR head yet - wait, or `gh pr ready` if it is a draft");
  else if (decide.status !== "COMPLETED") out.push("GitHub checks still running (decide) - wait");
  else if (decide.conclusion === "SKIPPED")
    out.push("the deploy workflow SKIPPED the head (it ran while the PR was a draft) - `gh pr ready --undo` then `gh pr ready`, wait for checks");
  else if (decide.conclusion !== "SUCCESS") out.push(`deploy/decide is ${decide.conclusion}`);
  // decide SUCCESS always leads to a `checks` run (SUCCESS, or SKIPPED when nothing reaches the site) — it shows up a
  // few seconds after decide, so none yet = not started, never "fine" (checker #667 r1)
  // a `checks` that started before this decide is a leftover of an older (draft-time) run (checker #667 r2)
  if (decide && decide.status === "COMPLETED" && decide.conclusion === "SUCCESS" && (!checks || when(checks) < when(decide)))
    out.push("GitHub checks not started yet (checks) - wait");
  else if (checks && checks.status !== "COMPLETED") out.push("GitHub checks still running (checks) - wait");
  else if (checks && !["SUCCESS", "SKIPPED"].includes(checks.conclusion)) out.push(`deploy/checks is ${checks.conclusion}`);
  for (const c of runs) {
    if (c.name === "decide" || c.name === "checks" || c.name === "deploy") continue;
    if (c.status !== "COMPLETED") out.push(`GitHub check ${c.name} still running - wait`);
    else if (!["SUCCESS", "SKIPPED", "NEUTRAL"].includes(c.conclusion)) out.push(`GitHub check ${c.name} is ${c.conclusion}`);
  }
  return out;
}

function main() {
  const argv = process.argv.slice(2);
  const sizing = argv.includes("--base");
  const files = changedFiles(argv)
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (files.length === 0) {
    console.log("no changed files");
    console.log("BLOCKED (empty diff - nothing to merge; check the base)");
    process.exit(1);
  }
  const build = buildScripts();
  const hooks = hookScripts();
  const list = argv.includes("--files");
  const verdictMode = !sizing && !list; // a real PR: SMALL / SITE / BIG
  let blocked = 0; // --base / --files: files on the site · verdict mode: repo problems only
  let big = 0;
  let site = 0;
  if (!sizing) {
    for (const p of repoProblems()) {
      blocked++;
      console.log(`BLOCKED  (repo) ${p}`);
    }
  }
  for (const f of files) {
    if (sizing) {
      const why = siteReason(f, build);
      if (why) blocked++;
      console.log(`${why ? "site   " : "ok     "}  ${f}${why ? `  (${why})` : ""}`);
      continue;
    }
    const bigWhy = bigReason(f, hooks, build);
    const siteWhy = bigWhy ? "" : siteReason(f, build);
    if (bigWhy) big++;
    else if (siteWhy) site++;
    if (list && (bigWhy || siteWhy)) blocked++;
    const tag = bigWhy ? "BIG    " : siteWhy ? "SITE   " : "ok     ";
    console.log(`${tag}  ${f}${bigWhy || siteWhy ? `  (${bigWhy || siteWhy})` : ""}`);
  }
  if (verdictMode && edits137(files)) {
    big++;
    console.log("BIG      .claude/TEAM_RULES.md  (edits 13.7 — the merge rule itself)");
  }
  console.log(sizing ? `${files.length} files · ${blocked} on the site` : `${files.length} files · ${big} big · ${site} site`);
  if (!argv.includes("--files")) {
    let head = "";
    try {
      head = git(["rev-parse", "HEAD"]).trim();
    } catch {
      /* not a git checkout */
    }
    const pr = argv.indexOf("--pr");
    if (pr !== -1 && !sizing) {
      // the build/hook lists are read from the local tree, and the pin must be the PR's own head
      const view = JSON.parse(
        execFileSync("gh", ["pr", "view", argv[pr + 1], "--json", "headRefOid,body,statusCheckRollup"], { cwd: ROOT, encoding: "utf8" }),
      );
      const prHead = view.headRefOid;
      if (prHead !== head) {
        blocked++;
        console.log(`BLOCKED  (repo) local HEAD ${head.slice(0, 7)} is not the PR head ${prHead.slice(0, 7)} - check out the PR branch first`);
      }
      const why = checkerLineProblem(view.body || "", prHead);
      if (why) {
        blocked++;
        console.log(`BLOCKED  (repo) ${why}`);
      } else console.log("checker line ok");
      const ciWhy = ciProblems(view.statusCheckRollup || []);
      for (const p of ciWhy) {
        blocked++;
        console.log(`BLOCKED  (repo) ${p}`);
      }
      if (!ciWhy.length) console.log("GitHub checks ok (the deploy workflow ran on the head)");
    }
    if (head) console.log(`HEAD ${head}`);
  }
  if (sizing) console.log(blocked ? `SITE-TOUCHED - ${blocked} file(s) a visitor gets changed since the base (proof sizing only - not a merge verdict)` : "PASS - nothing on the site changed since the base (proof sizing only - not a merge verdict)");
  else if (list) console.log(blocked ? `BLOCKED - list check: ${big} big · ${site} site (gate test, not a merge verdict)` : "PASS - list check: all off the site, none big (gate test, not a merge verdict: no head commit pinned)");
  else if (blocked) console.log("BLOCKED - cannot judge this PR (see the (repo) lines) - do not merge");
  else if (big) console.log("BIG - merge after checker + green checks, then report it on its own line (TEAM_RULES 13.7, owner 30/09)");
  else if (site) console.log("SITE - small (tier A or B; tier B = before/after shots in the report) (TEAM_RULES 13.7)");
  else console.log("SMALL - merge after checker PASS + all GitHub checks green, then report (TEAM_RULES 13.7)");
  process.exit(blocked ? 1 : 0);
}

main();
