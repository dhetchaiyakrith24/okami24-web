#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// deploy-decision.js — does this push to main need a deploy? Run by .github/workflows/deploy.yml (round A "pipes",
// 2026-09-27) before any check; the same list as the merge gate (scripts/lib/site-paths.js), so the two never disagree.
//
//   DEPLOY  = at least one changed file reaches the site (src/ public/ data package config render.yaml build scripts,
//             or anything no off-site pattern names — "not sure = it touches").
//   SKIP    = every changed file is off-site (docs · rules · skills · scripts no build runs · .github …).
//   SKIP    = the push changes .github/workflows/ — a merge that edits the deploy pipeline itself never deploys, even
//             when it also touches the site; the pipeline change is proved on a later merge (or deploy by hand in
//             Render, or "Run workflow" with deploy=true). This is what makes the very first run on main a SKIP.
//
// Usage:
//   node scripts/deploy-decision.js --range <before>..<after>   # a push (workflow passes github.event.before/after)
//   node scripts/deploy-decision.js --range <base>...<head>     # a PR (dry run: decides, never deploys)
//   node scripts/deploy-decision.js --files a,b                 # a given list (tests of the gate)
//   node scripts/deploy-decision.js --range … --force           # workflow_dispatch with deploy=true: the path rule is
//                                                               #   waived (the workflow-change rule is not needed: no diff)
// Last line: DEPLOY or SKIP (+ reason). Exit 0 either way (a skip is not an error); exit 2 = could not decide.
// In GitHub Actions it also writes `deploy=true|false` and `reason=…` to $GITHUB_OUTPUT.
"use strict";
const { execFileSync } = require("child_process");
const fs = require("fs");
const { siteReason, buildScripts, ROOT } = require("./lib/site-paths");

let pipelineChanged = false;

function out(decision, reason) {
  console.log(`${decision ? "DEPLOY" : "SKIP"} - ${reason}`);
  if (process.env.GITHUB_OUTPUT) {
    // pipeline=true lets the workflow run its checks on a push/PR that edits the workflow itself (proof it still works)
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `deploy=${decision}\npipeline=${pipelineChanged}\nreason=${reason.replace(/\r?\n/g, " ")}\n`);
  }
  process.exit(0);
}

function files(argv) {
  const fl = argv.indexOf("--files");
  if (fl !== -1) return (argv[fl + 1] || "").split(",");
  const r = argv.indexOf("--range");
  if (r === -1) throw new Error("need --range <before>..<after> or --files a,b");
  const range = argv[r + 1] || "";
  const git = (a) => execFileSync("git", ["-c", "core.quotePath=false", "diff", "--name-only", ...a], { cwd: ROOT, encoding: "utf8" }).split(/\r?\n/);
  if (range.includes("...")) return git([range]); // a PR: base...head = the PR's own changes since it branched
  const [before, after] = range.split("..");
  if (!after) throw new Error(`bad --range "${range}"`);
  // a push: before..after = everything the push brought in; before = 000… on a new branch -> diff against the parent
  return git([/^0+$/.test(before) ? `${after}^` : before, after]);
}

function main() {
  const argv = process.argv.slice(2);
  let list;
  try {
    list = files(argv).map((s) => s.trim()).filter(Boolean);
  } catch (e) {
    console.log(`could not read the changed files: ${e.message}`);
    if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, "deploy=false\nreason=could not read the changed files\n");
    process.exit(2);
  }
  const force = argv.includes("--force");
  const build = buildScripts();
  const site = [];
  for (const f of list) {
    const why = siteReason(f, build);
    if (why) site.push(f);
    console.log(`${why ? "SITE   " : "off    "}  ${f}${why ? `  (${why})` : ""}`);
  }
  console.log(`${list.length} files · ${site.length} reach the site`);
  if (force) out(true, "manual run with deploy=true");
  if (list.length === 0) out(false, "no changed files");
  const pipeline = list.filter((f) => /^\.github\/workflows\//.test(f));
  pipelineChanged = pipeline.length > 0;
  if (pipeline.length) out(false, `this merge changes the deploy pipeline (${pipeline.join(", ")}) - never deploys itself; deploy by hand if the site changed too`);
  if (site.length === 0) out(false, "nothing on the site changed");
  out(true, `${site.length} file(s) reach the site: ${site.slice(0, 5).join(", ")}${site.length > 5 ? " …" : ""}`);
}

main();
