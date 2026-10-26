/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// handoff-size-check.js — the HANDOFF §16 spec at the act (skill okami24-handoff ขั้น 2: §16 ≤ 15 KB, no line over
// 2,000 bytes — Thai is 3 bytes a letter). house-check measured it once a week; §16 still grew to 39 KB (LESSONS พ48,
// house round 26/10), so a commit that breaks the spec is refused here.
//
//   node scripts/handoff-size-check.js --staged    the staged docs/HANDOFF.md (.githooks/pre-commit) — no HANDOFF staged = OK
//   node scripts/handoff-size-check.js [file]      a file on disk (default docs/HANDOFF.md)
const { execFileSync } = require("child_process");
const fs = require("fs");

const MAX_BYTES = 15000;
const MAX_LINE = 2000;

// §16 = from "## 16." to "## 17." (or the end) — the same slice house-check.js and stale-work.js read
function check(text) {
  const t = String(text).replace(/\r\n/g, "\n");
  const at = t.indexOf("## 16.");
  if (at < 0) return [];
  const end = t.indexOf("## 17.", at);
  const s16 = t.slice(at, end > 0 ? end : undefined);
  const problems = [];
  const bytes = Buffer.byteLength(s16);
  if (bytes > MAX_BYTES) problems.push(`§16 is ${bytes} bytes (spec ≤ ${MAX_BYTES}) — overwrite finished items, move owner waits to docs/รอพี่ตรวจ.md`);
  s16.split("\n").forEach((l, i) => {
    const b = Buffer.byteLength(l);
    if (b > MAX_LINE) problems.push(`§16 line ${i + 1} is ${b} bytes (spec ≤ ${MAX_LINE}) — split it`);
  });
  return problems;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  let text;
  if (args.includes("--staged")) {
    const staged = execFileSync("git", ["diff", "--cached", "--name-only"], { encoding: "utf8" }).split("\n");
    if (!staged.includes("docs/HANDOFF.md")) process.exit(0);
    text = execFileSync("git", ["show", ":docs/HANDOFF.md"], { encoding: "utf8", maxBuffer: 1 << 26 });
  } else text = fs.readFileSync(args[0] || "docs/HANDOFF.md", "utf8");
  const problems = check(text);
  if (problems.length) {
    for (const p of problems) console.error(`handoff-size-check: ${p}`);
    console.error("handoff-size-check: FAIL (skill okami24-handoff ขั้น 2)");
    process.exit(1);
  }
  console.log("handoff-size-check: OK");
}

module.exports = { check, MAX_BYTES, MAX_LINE };
