/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper */
// node scripts/card-lines-diff.js <before.json> <after.json> [out.md] — every card whose phone or desktop line changed,
// per page+locale, plus pages that appear on one side only and a per-slug summary.
// Inputs are two outputs of scripts/card-lines.js. Prints the first 30 lines; the full table goes to out.md when given.
const fs = require("fs");
const [a, b, out] = process.argv.slice(2);
const A = JSON.parse(fs.readFileSync(a, "utf8"));
const B = JSON.parse(fs.readFileSync(b, "utf8"));
const lines = [];
const bySlug = {};
let same = 0;
for (const key of [...new Set([...Object.keys(A), ...Object.keys(B)])].sort()) {
  const x = A[key] || [], y = B[key] || [];
  if (!A[key] || !B[key]) { lines.push(`| ${key} | page on one side only | before ${x.length} cards | after ${y.length} cards |`); continue; }
  if (x.map((c) => c.slug).join() !== y.map((c) => c.slug).join()) lines.push(`| ${key} | CARD ORDER/SET CHANGED | ${x.map((c) => c.slug).join(" ")} | ${y.map((c) => c.slug).join(" ")} |`);
  for (let i = 0; i < Math.min(x.length, y.length); i++) {
    const p = x[i], q = y[i];
    if (p.phone === q.phone && p.desktop === q.desktop) { same++; continue; }
    lines.push(`| ${key} | ${q.slug} | 390 «${p.phone}» → «${q.phone}» | 1440 «${p.desktop}» → «${q.desktop}» |`);
    const s = (bySlug[q.slug] ||= new Set());
    s.add(`390 «${p.phone}» → «${q.phone}» · 1440 «${p.desktop}» → «${q.desktop}» [${key.slice(0, 2)}]`);
  }
}
const md = [
  `# Card line diff — ${a} → ${b}`,
  "",
  `unchanged card instances: ${same} · changed: ${lines.length}`,
  "",
  "## Per slug (distinct changes)",
  ...Object.entries(bySlug).map(([k, v]) => `- ${k}: ${[...v].join(" | ")}`),
  "",
  "## Every changed instance",
  "| page | card | phone | desktop |",
  "|---|---|---|---|",
  ...lines,
].join("\n");
if (out) fs.writeFileSync(out, md);
console.log(md.split("\n").slice(0, 30).join("\n"));
