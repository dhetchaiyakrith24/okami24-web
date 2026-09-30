/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// Post-commit: refresh src/data/content-dates.json and fold it into the commit just made (owner 30/09, rules item 7B:
// no separate "chore(dates)" commit). Called by .githooks/post-commit; safe to run by hand after a commit.
//   - the dates are AUTHOR dates (%aI, scripts/content-dates.ts): an amend keeps the author date, so the JSON written
//     from the commit stays true after the amend (a committer date would change with the amend itself)
//   - OKAMI24_DATES_AMEND=1 is set for the amend, so the hook does not run again on it
//   - skipped during a rebase / cherry-pick / merge in progress, and when the JSON does not change
//   - never fails the commit (a post-commit hook cannot): on an error it prints the command to run by hand
const { execFileSync, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
const GIT_DIR = execFileSync("git", ["rev-parse", "--git-dir"], { cwd: ROOT, encoding: "utf8" }).trim();
const JSON_PATH = "src/data/content-dates.json";

if (process.env.OKAMI24_DATES_AMEND) process.exit(0);
for (const f of ["rebase-merge", "rebase-apply", "CHERRY_PICK_HEAD", "MERGE_HEAD", "REVERT_HEAD"]) {
  if (fs.existsSync(path.resolve(ROOT, GIT_DIR, f))) process.exit(0);
}
// a JSON the commit left unstaged in the tree would be swept into the amend — leave that case to the person
const dirty = execFileSync("git", ["status", "--porcelain", "--", JSON_PATH], { cwd: ROOT, encoding: "utf8" }).trim();
if (dirty) { console.log(`content-dates-amend: ${JSON_PATH} already has uncommitted changes — skipped`); process.exit(0); }

const run = spawnSync(process.platform === "win32" ? "npx.cmd" : "npx", ["tsx", "scripts/content-dates.ts"], { cwd: ROOT, encoding: "utf8", shell: process.platform === "win32" });
if (run.status !== 0) {
  console.log(`content-dates-amend: content-dates.ts failed — run \`npx tsx scripts/content-dates.ts\` and commit ${JSON_PATH}\n${run.stderr || run.stdout}`);
  process.exit(0);
}
const changed = execFileSync("git", ["status", "--porcelain", "--", JSON_PATH], { cwd: ROOT, encoding: "utf8" }).trim();
if (!changed) process.exit(0);
execFileSync("git", ["add", "--", JSON_PATH], { cwd: ROOT });
const amend = spawnSync("git", ["commit", "--amend", "--no-edit", "-q"], { cwd: ROOT, encoding: "utf8", env: { ...process.env, OKAMI24_DATES_AMEND: "1" } });
if (amend.status !== 0) {
  console.log(`content-dates-amend: the amend failed — ${JSON_PATH} is staged; commit it by hand\n${amend.stderr || amend.stdout}`);
  process.exit(0);
}
console.log(`content-dates-amend: ${JSON_PATH} folded into this commit`);
