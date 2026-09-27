/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// Large-file gate for every commit (round B "housekeeping" 2026-09-27, owner ruling Q7 ③ — taken from the cartoon
// side's cloud rule "never git add media"): a file that enters git stays in its history for good, and removing it
// needs a force push (banned). So a commit is refused when a staged file is video/audio, or bigger than the cap.
//   node scripts/large-file-check.js --staged        (run by .githooks/pre-commit)
// Cap: 2 MB — the largest file in git on 2026-09-27 is 0.4 MB (docs/THAI_STYLE_LOG.md; product photos ≤ 0.3 MB).
// A file that truly must go in anyway: ask the owner, then commit with the hook skipped for that one commit is NOT
// allowed (no --no-verify) — raise the cap here in its own PR instead (Javis merges: a script a hook runs).
"use strict";
const { execFileSync } = require("child_process");

const CAP_BYTES = 2 * 1024 * 1024;
const MEDIA = /\.(mp4|mov|m4v|webm|mkv|avi|mp3|wav|m4a|aac|flac|ogg)$/i;

const git = (args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 1 << 26 });
// added/copied/modified/renamed files only (a deletion is always fine)
const files = git(["diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z"]).split("\0").filter(Boolean);

const bad = [];
for (const f of files) {
  if (MEDIA.test(f)) {
    bad.push(`${f} — video/audio never goes into git`);
    continue;
  }
  const size = Number(git(["cat-file", "-s", `:${f}`]).trim());
  if (size > CAP_BYTES) bad.push(`${f} — ${(size / 1048576).toFixed(1)} MB, cap ${CAP_BYTES / 1048576} MB`);
}

if (bad.length) {
  console.error("large-file-check: REFUSED — these staged files would stay in git history for good:");
  for (const b of bad) console.error(`  ${b}`);
  console.error("Unstage them (git restore --staged <file>). Big originals belong in _incoming/ (not in git).");
  process.exit(1);
}
console.log(`large-file-check: OK (${files.length} staged file(s), none media, none over ${CAP_BYTES / 1048576} MB)`);
