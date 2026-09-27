/* eslint-disable @typescript-eslint/no-require-imports -- plain Node helper, CommonJS on purpose */
// site-paths.js — THE one list of paths that never reach the live site (TEAM_RULES 13.7, round A "pipes" 2026-09-27),
// plus the lists that make a PR "big" under the merge rule of round C (owner 2026-09-27).
//
// Two gates read this list and nothing else, so they can never disagree:
//   scripts/self-merge-check.js  — small or big? (small = Friday merges, then reports · big = tell the owner first)
//   scripts/deploy-decision.js   — does this merge to main need a deploy?  (any file NOT off-site = deploy)
// It is an ALLOW-list on purpose: "not sure it touches the site = it touches" — a path no pattern matches (a new
// top-level folder, package.json, render.yaml, next.config.*, src/, public/, product data …) counts as the site.
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");

// Paths the Render build and the running server never read. Order does not matter.
const OFF_SITE = [
  /^docs\//,
  /^\.claude\//,
  /^\.github\//,
  /^scripts\//, // minus the scripts in buildScripts() below
  /^\.githooks\//,
  /^(CLAUDE|AGENTS|README|ASSET_MANIFEST)\.md$/,
];

// Off-site, but always BIG — Friday tells the owner before merging (round C; before that = Javis-only, rulings
// 2026-09-26 + 27/09). Two kinds:
//   (1) what makes Friday act on her own automatically: .claude/settings* (hooks, tool permissions) · .claude/hooks/ ·
//       .githooks/ (the commit/push gates) · every script those hooks run (hookScripts() below)
//   (2) what makes the site go live by itself: .github/ (the deploy workflow + the required check)
// plus: the central-rules copy and its source pin (sync bot) · the central-rules restore copies · launch.json (the
// owner's dev server) · and the gate files themselves (a PR could widen its own list).
const ALWAYS_BIG = [
  /^\.claude\/settings/,
  /^\.claude\/hooks\//,
  /^\.githooks\//,
  /^\.github\//,
  /^\.claude\/rules\//,
  /^\.claude\/rules-source\.json$/,
  /^\.claude\/launch\.json$/,
  /^docs\/archive\/claude-config-[^/]+\//,
  /^scripts\/self-merge-check\.js$/,
  /^scripts\/deploy-decision\.js$/,
  /^scripts\/lib\/site-paths\.js$/,
];

// Scripts a hook runs by itself (kind (1) above): every scripts/… path named in .claude/settings*.json (Claude Code
// hooks) or in .githooks/* (the git commit/push gates), plus the local modules they require.
function hookScripts() {
  const out = new Set();
  const sources = [".claude/settings.json", ".claude/settings.local.json"];
  try {
    for (const f of fs.readdirSync(path.join(ROOT, ".githooks"))) sources.push(`.githooks/${f}`);
  } catch {
    /* no .githooks folder */
  }
  for (const name of sources) {
    try {
      const t = fs.readFileSync(path.join(ROOT, name), "utf8");
      for (const m of t.matchAll(/scripts\/[\w.\-\/]+/g)) out.add(m[0]);
    } catch {
      /* no such file */
    }
  }
  // …and every local module those scripts require or start, transitively (prepare-clone.js → lib/chrome.js runs too ·
  // session-sync.js starts prepare-clone.js through path.join(__dirname, "prepare-clone.js"), round C)
  const todo = [...out];
  while (todo.length) {
    const f = todo.pop();
    let t = "";
    try {
      t = fs.readFileSync(path.join(ROOT, f), "utf8");
    } catch {
      continue;
    }
    const deps = [
      ...[...t.matchAll(/require\(\s*["'](\.{1,2}\/[^"']+)["']\s*\)/g)].map((m) => m[1]),
      ...[...t.matchAll(/path\.join\(\s*__dirname\s*,\s*["']([^"']+\.js)["']\s*\)/g)].map((m) => `./${m[1]}`),
    ];
    for (const rel of deps) {
      let dep = path.posix.normalize(path.posix.join(path.posix.dirname(f), rel));
      if (!/\.(c|m)?js$/.test(dep)) dep += ".js";
      if (!out.has(dep)) {
        out.add(dep);
        todo.push(dep);
      }
    }
  }
  return out;
}

// On the site AND always BIG, whatever the batch's tier (round C): what money, orders, stock and "what is for sale"
// run on, and what the build and the server are made of — a mistake here sells wrong or takes the site down.
const CORE_SITE = [
  /^render\.yaml$/,
  /^package(-lock)?\.json$/,
  /^(next|postcss)\.config\.[cm]?[jt]s$/,
  /^tsconfig\.json$/,
  /^\.env/,
  /^src\/app\/(api|cart|checkout|orders)\//,
  /^src\/lib\/(backup|commerce|db|otp|shipnity)\//,
  /^src\/lib\/promptpay/,
  /^src\/data\/(products|shipnity-seed|stock)\//,
  /^src\/data\/payment\.ts$/,
];

// Scripts run by hand in the Render Shell against the live database — they count as the site (owner ruling Q3,
// round B "housekeeping" 2026-09-27): a change must reach Render (deploy) before the Shell runs it, and Friday does
// not merge it herself. Named in docs/DEPLOY-RENDER.md; add a line here when a doc tells the owner to run another.
const RENDER_SHELL = ["scripts/line-clicks.js"];

// Scripts under scripts/ that the Render build or the live server runs — they ARE the site.
function buildScripts() {
  const out = new Set(["scripts/native-probe.js", ...RENDER_SHELL]); // native-probe: run by src/lib/db/startup-check.ts at every server start
  try {
    const y = fs.readFileSync(path.join(ROOT, "render.yaml"), "utf8");
    for (const m of y.matchAll(/scripts\/[\w.\-\/]+/g)) out.add(m[0]);
  } catch {
    /* no render.yaml -> nothing extra; render.yaml itself is on-site anyway */
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
    /* unreadable package.json -> package.json is on-site anyway */
  }
  return out;
}

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (/\.(ts|tsx|js|mjs|cjs)$/.test(e.name)) out.push(p);
  }
  return out;
}

// → "" when the file never reaches the site, else the reason it does.
function siteReason(file, build = buildScripts()) {
  if (RENDER_SHELL.includes(file)) return "run by hand in the Render Shell against the live database";
  if (build.has(file)) return "run by the Render build or the live server";
  if (!OFF_SITE.some((re) => re.test(file))) return "not on the off-site list (src/ public/ data package config … or unknown)";
  return "";
}

// → "" when the file alone does not make a PR big, else why it does (a site file not listed here is "site" — big or
// small by the batch's tier, TEAM_RULES 13.7).
function bigReason(file, hooks = hookScripts(), build = buildScripts()) {
  if (hooks.has(file)) return "a script a hook runs by itself";
  if (ALWAYS_BIG.some((re) => re.test(file))) return "runs by itself or decides merges/deploys (settings · hooks · .github/ · rules copy · gate file)";
  if (RENDER_SHELL.includes(file)) return "run by hand in the Render Shell against the live database";
  if (build.has(file)) return "run by the Render build or the live server";
  if (CORE_SITE.some((re) => re.test(file))) return "orders · money · stock · what is for sale · build/server config";
  return "";
}

module.exports = { OFF_SITE, ALWAYS_BIG, CORE_SITE, RENDER_SHELL, buildScripts, hookScripts, siteReason, bigReason, ROOT };
