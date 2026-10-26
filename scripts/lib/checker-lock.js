/* eslint-disable @typescript-eslint/no-require-imports -- plain Node helper, CommonJS on purpose */
// checker-lock.js — "the checker is reading <sha> in <tree>": written by scripts/pre-checker-gate.js when it passes,
// read by scripts/guard-tool.js, which then refuses to change that working tree or the test server until
// `node scripts/pre-checker-gate.js --done` (TEAM_RULES 13.4 — a branch switch + rebuild while the checker read #283).
// One note per working tree, kept in the git common dir (.git/ of the main folder) so every worktree of this clone
// sees every note. A note older than MAX_AGE_MS is ignored (a chat that died must not lock a folder for ever).
// OKAMI24_CHECKER_LOCK_DIR overrides the folder (the gate's --self-test only).
"use strict";
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const MAX_AGE_MS = 3 * 3600 * 1000;
const PREFIX = "okami24-checker-reading-";

function dir(cwd) {
  if (process.env.OKAMI24_CHECKER_LOCK_DIR) return process.env.OKAMI24_CHECKER_LOCK_DIR;
  try {
    if (fs.statSync(path.join(cwd, ".git")).isDirectory()) return path.join(cwd, ".git"); // the main folder: no git call (the hook runs on every tool call)
  } catch {
    /* a worktree (.git is a file) or not the top folder — ask git */
  }
  try {
    const d = execFileSync("git", ["rev-parse", "--git-common-dir"], { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    return path.resolve(cwd, d);
  } catch {
    return path.join(cwd, ".git");
  }
}
const key = (tree) => crypto.createHash("sha1").update(path.resolve(tree).replace(/\\/g, "/").toLowerCase()).digest("hex").slice(0, 10);
const fileFor = (cwd, tree) => path.join(dir(cwd), `${PREFIX}${key(tree)}.json`);

// every live note of this clone: [{ sha, branch, tree, started }]
function readAll(cwd) {
  const d = dir(cwd);
  let names = [];
  try {
    names = fs.readdirSync(d).filter((n) => n.startsWith(PREFIX) && n.endsWith(".json"));
  } catch {
    return [];
  }
  const notes = [];
  for (const n of names) {
    try {
      const note = JSON.parse(fs.readFileSync(path.join(d, n), "utf8"));
      if (Date.now() - Date.parse(note.started) <= MAX_AGE_MS) notes.push(note);
    } catch {
      /* unreadable = no note */
    }
  }
  return notes;
}
function write(cwd, note) {
  fs.writeFileSync(fileFor(cwd, note.tree), JSON.stringify({ ...note, started: new Date().toISOString() }, null, 1));
}
function clear(cwd, tree) {
  try {
    fs.unlinkSync(fileFor(cwd, tree));
    return true;
  } catch {
    return false;
  }
}

module.exports = { readAll, write, clear, fileFor, MAX_AGE_MS };
