/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// pending-check.js — no push and no merge pack while a checker result is still a placeholder (round "cloud",
// 2026-09-26). At a close, doc-keeper may start together with the checker and writes [CHECKER-PENDING] where the
// checker's verdict goes (.claude/agents/doc-keeper.md); the main agent replaces it when the checker returns.
//
//   node scripts/pending-check.js            scans the docs that carry checker results (committed HEAD + working tree)
//   node scripts/pending-check.js <file>...  scans the given files (merge-pack passes its owner-table)
// Exit 0 = no token · exit 1 = token found (each file:line printed). Run by .githooks/pre-push.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const TOKEN = "[CHECKER-PENDING]";
const ROOT = path.resolve(__dirname, "..");
// every file doc-keeper writes (.claude/agents/doc-keeper.md "What you update")
const DEFAULT = ["docs/HANDOFF.md", "docs/THAI_STYLE_LOG.md", "docs/ROUND_COST.md", "docs/LAUNCH_AUDIT.md"];

const files = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT;
const hits = [];
for (const f of files) {
  const abs = path.isAbsolute(f) ? f : path.join(ROOT, f);
  const sources = [];
  if (fs.existsSync(abs)) sources.push(["working tree", fs.readFileSync(abs, "utf8")]);
  if (!path.isAbsolute(f)) {
    // what a push sends is the committed file, which can differ from the working tree
    try {
      sources.push(["HEAD", execFileSync("git", ["show", `HEAD:${f}`], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 64 * 1024 * 1024 })]);
    } catch {
      /* not in git */
    }
  }
  for (const [where, text] of sources) {
    text.split(/\r?\n/).forEach((line, i) => {
      if (line.includes(TOKEN)) hits.push(`${f}:${i + 1} (${where}) ${line.trim().slice(0, 120)}`);
    });
  }
}
if (hits.length) {
  console.log(`pending-check: ${hits.length} checker slot(s) still ${TOKEN} — fill them with the checker's result first:`);
  for (const h of hits) console.log(`  ${h}`);
  process.exit(1);
}
console.log(`pending-check: OK (${files.length} file(s), no ${TOKEN})`);
