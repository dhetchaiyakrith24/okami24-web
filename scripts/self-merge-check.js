#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// self-merge-check.js — may Friday (the main agent) merge this PR herself? (TEAM_RULES 13.7 — owner rulings 2026-09-26,
// widened to the cloud in round A "pipes" 2026-09-27, with the owner's two exceptions of 27/09)
//
// Rule: a PR whose files all stay off the live site (the one list: scripts/lib/site-paths.js, shared with the deploy
// gate) and touch nothing Javis-only (what runs by itself: .claude/settings* · hooks · .githooks/ · scripts a hook runs ·
// .github/ · plus the central-rules copies and the gate files) may be merged by Friday — on the computer or in the
// cloud — once the checker passed and every GitHub check is green. Skills · agents · web rules in .claude/ = hers.
// Anything else = Javis merges. "Not sure it touches = it touches": the list is an ALLOW-list.
//
// Usage:
//   node scripts/self-merge-check.js                 # diff origin/main...HEAD — the PR's files when HEAD = the PR head
//                                                    #   (works anywhere; `git fetch origin main` first)
//   node scripts/self-merge-check.js --pr 68         # the files of GitHub PR #68 via `gh` (computer only) — run it on the
//                                                    #   PR's branch: a local HEAD other than the PR head is BLOCKED
//   node scripts/self-merge-check.js --files a,b     # a given list — gate tests only, NOT a merge verdict (no head pinned)
//   node scripts/self-merge-check.js --base <ref>    # PROOF SIZING, not a merge verdict: every change since <ref>,
//                                                    #   committed or not + untracked; judges "site touched?" only
// Last line: PASS or BLOCKED. Exit 0 / 1. Also prints `HEAD <sha>` — merge exactly that commit (pin it in the merge call).
// PASS is necessary, not sufficient: 13.7's other conditions (checker PASS · GitHub checks · no extras.md · not a PR
// that edits 13.7's own merge line) are Friday's to check and report.
"use strict";
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const { siteReason, javisOnly, buildScripts, hookScripts } = require("./lib/site-paths");

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

function changedFiles(argv) {
  const fl = argv.indexOf("--files"); // dry run on a given list (comma-separated) - for testing the gate itself
  if (fl !== -1) return (argv[fl + 1] || "").split(",").join("\n");
  const pr = argv.indexOf("--pr");
  if (pr !== -1) {
    const n = argv[pr + 1];
    if (!/^\d+$/.test(n || "")) throw new Error("--pr needs a PR number");
    try {
      return execFileSync("gh", ["pr", "diff", n, "--name-only"], { cwd: ROOT, encoding: "utf8" });
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
  let blocked = 0;
  if (!sizing) {
    for (const p of repoProblems()) {
      blocked++;
      console.log(`BLOCKED  (repo) ${p}`);
    }
  }
  for (const f of files) {
    let why = siteReason(f, build);
    if (!why && !sizing && javisOnly(f, hooks)) why = "Javis-only: runs by itself (settings · hooks · a script a hook runs) · .github/ · central-rules copy · gate file";
    if (why) blocked++;
    console.log(`${why ? "BLOCKED" : "ok     "}  ${f}${why ? `  (${why})` : ""}`);
  }
  console.log(`${files.length} files · ${blocked} blocked`);
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
      const prHead = execFileSync("gh", ["pr", "view", argv[pr + 1], "--json", "headRefOid", "-q", ".headRefOid"], { cwd: ROOT, encoding: "utf8" }).trim();
      if (prHead !== head) {
        blocked++;
        console.log(`BLOCKED  (repo) local HEAD ${head.slice(0, 7)} is not the PR head ${prHead.slice(0, 7)} - check out the PR branch first`);
      }
    }
    if (head) console.log(`HEAD ${head}`);
  }
  if (sizing) console.log(blocked ? "BLOCKED - something on the site changed since the base" : "PASS - nothing on the site changed since the base (proof sizing only - not a merge verdict)");
  else if (argv.includes("--files")) console.log(blocked ? "BLOCKED - list check (gate test, not a merge verdict)" : "PASS - list check (gate test, not a merge verdict: no head commit pinned)");
  else console.log(blocked ? "BLOCKED - Javis merges this PR (TEAM_RULES 13.7)" : "PASS - Friday may merge after checker PASS + all GitHub checks green");
  process.exit(blocked ? 1 : 0);
}

main();
