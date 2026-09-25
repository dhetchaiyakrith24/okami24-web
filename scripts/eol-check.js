/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper */
// Line-ending gate (rule: docs/HANDOFF.md §17, line "CRLF").
//   node scripts/eol-check.js            every tracked file: no CR stored inside git (index i/crlf or i/mixed) — exit 1 if any
//   node scripts/eol-check.js --staged   what is about to be committed (run by .githooks/pre-commit):
//     1. no staged text file may carry a CR inside git (i/crlf · i/mixed) — any machine, any agent
//     2. on a checkout with core.autocrlf=true (the Windows machine), a NEWLY ADDED text file must be CRLF in the
//        working tree (the §17 convention: files written by the Write tool are LF → unix2dos before git add)
// Files already in git are never rewritten or judged by rule 2 — only what the commit adds. Files that .gitattributes
// pins to eol=lf (git hooks, which sh cannot run with CR) are exempt from rule 2.
// Setup after a fresh clone: git config core.hooksPath .githooks (docs/RECOVERY.md).
const { execFileSync } = require("child_process");

const git = (args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

// `git ls-files --eol` row: "i/<index> w/<worktree> attr/<attrs>\t<path>"
function eolRows(paths) {
  const out = git(["ls-files", "--eol", "-z", "--", ...paths]);
  return out
    .split("\0")
    .filter(Boolean)
    .map((row) => {
      const [info, file] = row.split("\t");
      const [i, w, ...attr] = info.trim().split(/\s+/);
      return { file, index: i.slice(2), work: w.slice(2), lfOnDisk: attr.join(" ").includes("eol=lf") };
    });
}

const badIndex = (r) => r.index === "crlf" || r.index === "mixed";
const problems = [];

if (process.argv.includes("--staged")) {
  const staged = git(["diff", "--cached", "--name-status", "-z", "--diff-filter=ACMR"]).split("\0").filter(Boolean);
  const added = new Set();
  const paths = [];
  for (let k = 0; k < staged.length; ) {
    const status = staged[k];
    const hasTwo = status.startsWith("R") || status.startsWith("C");
    const file = hasTwo ? staged[k + 2] : staged[k + 1];
    if (status === "A") added.add(file);
    paths.push(file);
    k += hasTwo ? 3 : 2;
  }
  if (paths.length) {
    let autocrlf = "";
    try {
      autocrlf = git(["config", "core.autocrlf"]).trim();
    } catch {
      autocrlf = "";
    }
    for (const r of eolRows(paths)) {
      if (badIndex(r)) problems.push(`${r.file}: stored in git with ${r.index.toUpperCase()} line endings (must be LF inside git)`);
      else if (autocrlf === "true" && added.has(r.file) && !r.lfOnDisk && r.index === "lf" && (r.work === "lf" || r.work === "mixed"))
        problems.push(`${r.file}: new file is ${r.work.toUpperCase()} on disk — run: unix2dos "${r.file}" && git add "${r.file}"`);
    }
  }
} else {
  for (const r of eolRows([])) if (badIndex(r)) problems.push(`${r.file}: stored in git with ${r.index.toUpperCase()} line endings`);
}

if (problems.length) {
  console.error(`eol-check: ${problems.length} file(s) break the line-ending rule (docs/HANDOFF.md §17 "CRLF"):`);
  for (const p of problems) console.error("  " + p);
  process.exit(1);
}
console.log("eol-check: OK");
