/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// Thai explanations in parentheses after a term, across the site source (owner 04/10, item (48): "which other ones have a
// bracket?"). Finds "<Latin term or number> (<text with Thai letters>)" inside string literals of src/, one row per hit.
//   node scripts/paren-terms.js [--md out.md]   → table on stdout (file:line · term · bracket · the sentence around it)
// Thai letters are matched by code point (U+0E00–U+0E7F), not by a byte range (Git Bash grep pitfall, thai-check gate 4).
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..", "src");
const THAI = /[฀-๿]/;
const RE = /([A-Za-z][A-Za-z0-9.+\-/²]*(?:\s[A-Z][A-Za-z0-9.+\-]*)?)\s?\(([^()]{1,80})\)/g;
const rows = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(ts|tsx|json)$/.test(e.name)) scan(p);
  }
}
function scan(file) {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    const t = line.trim();
    if (t.startsWith("//") || t.startsWith("*") || t.startsWith("/*")) return; // comments
    for (const m of line.matchAll(RE)) {
      if (!THAI.test(m[2])) continue; // only Thai explanations
      const s = Math.max(0, m.index - 40), ctx = line.slice(s, m.index + m[0].length + 30).trim();
      rows.push({ file: path.relative(path.join(__dirname, ".."), file).replace(/\\/g, "/"), line: i + 1, term: m[1], paren: m[2], ctx });
    }
  });
}
walk(ROOT);
const out = ["| # | file:line | term | in brackets | around it |", "|---|---|---|---|---|",
  ...rows.map((r, k) => `| ${k + 1} | ${r.file}:${r.line} | ${r.term} | ${r.paren} | ${r.ctx.replace(/\|/g, "\\|")} |`)];
const i = process.argv.indexOf("--md");
if (i > 0) fs.writeFileSync(process.argv[i + 1], out.join("\n") + "\n");
console.log(out.join("\n"));
console.log(`\n${rows.length} hit(s)`);
