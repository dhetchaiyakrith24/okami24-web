#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// self-merge-check.js — may Friday (the main agent) merge this PR herself? (TEAM_RULES 13.7, owner ruling 2026-09-26)
//
// Rule: a PR that touches nothing a customer can see (no src/, no public/, no product data, nothing the
// Render build runs) may be merged by Friday once the checker passed and every GitHub check is green.
// Anything else = Javis merges + deploys. "Not sure it touches = it touches" -> this is an ALLOW-list:
// a path that matches no allowed pattern is BLOCKED, so a new top-level folder is blocked until listed here.
//
// Usage:
//   node scripts/self-merge-check.js                 # diff origin/main...HEAD (local branch)
//   node scripts/self-merge-check.js --pr 68         # the files of GitHub PR #68 (needs gh)
//   node scripts/self-merge-check.js --base <ref>    # diff <ref>...HEAD
//   node scripts/self-merge-check.js --files a,b     # dry run on a list (tests of the gate)
// Last line: PASS (Friday may merge after checker + green checks) or BLOCKED (Javis merges). Exit 0 / 1.
"use strict";
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

// Allowed = docs, rules, skills, agents, helper scripts, repo notes. Order does not matter.
const ALLOW = [
  /^docs\//,
  /^\.claude\/(?!rules\/|rules-source\.json$|settings|launch\.json$|GLOBAL_RULES_MIRROR\.md$)/, // rules copy = sync bot + Javis only; settings can change tool permissions; launch.json = the owner's dev server
  /^scripts\//,
  /^\.githooks\//,
  /^(CLAUDE|AGENTS|README|ASSET_MANIFEST)\.md$/,
];

// Allowed by the patterns above but still blocked: this gate itself (a PR could widen its own allow-list),
// and the restore copies of the central rules (touching them = touching the central rules).
const DENY = [/^scripts\/self-merge-check\.js$/, /^docs\/archive\/claude-config-[^/]+\//];

// Scripts the Render build or the live server runs are customer-facing even though they live under scripts/.
function buildScripts() {
  const out = new Set(["scripts/native-probe.js"]); // run by src/lib/db/startup-check.ts at every server start
  try {
    const y = fs.readFileSync(path.join(ROOT, "render.yaml"), "utf8");
    for (const m of y.matchAll(/scripts\/[\w.\-\/]+/g)) out.add(m[0]);
  } catch {
    /* no render.yaml -> nothing extra blocked */
  }
  // path.join(..., "scripts", "<file>") in server code = a script the running site executes
  for (const f of walk(path.join(ROOT, "src"))) {
    const t = fs.readFileSync(f, "utf8");
    for (const m of t.matchAll(/["']scripts["']\s*,\s*["']([\w.\-]+)["']/g)) out.add(`scripts/${m[1]}`);
  }
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
    for (const k of ["build", "prebuild", "postbuild", "start", "prestart", "postinstall", "preinstall", "install"]) {
      const v = (pkg.scripts || {})[k] || "";
      for (const m of v.matchAll(/scripts\/[\w.\-\/]+/g)) out.add(m[0]);
    }
  } catch {
    /* unreadable package.json -> caught by the allow-list anyway (package.json is not allowed) */
  }
  return out;
}

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (/\.(ts|tsx|js|mjs|cjs)$/.test(e.name)) out.push(p);
  }
  return out;
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
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" });
}

function changedFiles(argv) {
  const fl = argv.indexOf("--files"); // dry run on a given list (comma-separated) - for testing the gate itself
  if (fl !== -1) return (argv[fl + 1] || "").split(",").join("\n");
  const pr = argv.indexOf("--pr");
  if (pr !== -1) {
    const n = argv[pr + 1];
    if (!/^\d+$/.test(n || "")) throw new Error("--pr needs a PR number");
    return execFileSync("gh", ["pr", "diff", n, "--name-only"], { cwd: ROOT, encoding: "utf8" });
  }
  const b = argv.indexOf("--base");
  const base = b !== -1 ? argv[b + 1] : "origin/main";
  return git(["diff", "--name-only", `${base}...HEAD`]);
}

function main() {
  const files = changedFiles(process.argv.slice(2))
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (files.length === 0) {
    console.log("no changed files");
    console.log("BLOCKED (empty diff - nothing to merge; check the base)");
    process.exit(1);
  }
  const build = buildScripts();
  let blocked = 0;
  for (const p of repoProblems()) {
    blocked++;
    console.log(`BLOCKED  (repo) ${p}`);
  }
  for (const f of files) {
    let why = "";
    if (build.has(f)) why = "run by the Render build or the live server";
    else if (DENY.some((re) => re.test(f))) why = "gate itself / central-rules restore copy";
    else if (!ALLOW.some((re) => re.test(f))) why = "not on the allow-list";
    if (why) blocked++;
    console.log(`${why ? "BLOCKED" : "ok     "}  ${f}${why ? `  (${why})` : ""}`);
  }
  console.log(`${files.length} files · ${blocked} blocked`);
  console.log(blocked ? "BLOCKED - Javis merges this PR (TEAM_RULES 13.7)" : "PASS - Friday may merge after checker PASS + all GitHub checks green");
  process.exit(blocked ? 1 : 0);
}

main();
