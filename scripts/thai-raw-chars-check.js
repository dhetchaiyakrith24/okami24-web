/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// Gate (round 30.4ค closing, owner 2026-09-16): the NO-BREAK SPACE (U+00A0) and WORD JOINER
// (U+2060) may appear on the rendered Thai page only — inserted by src/lib/thai-typography.ts at
// render time — and never as raw characters in the repo's source, copy, data or docs. This scan
// reports every raw occurrence under src/, docs/ and scripts/ (thai-typography.ts builds the two
// characters from code points, so even it holds none). Exit 1 when any is found.
//   node scripts/thai-raw-chars-check.js
const fs = require("fs");
const path = require("path");
const ROOTS = ["src", "docs", "scripts"];
const NBSP = String.fromCharCode(0x00a0);
const WJ = String.fromCharCode(0x2060);
const hits = [];
function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) { if (ent.name !== "node_modules") walk(p); continue; }
    if (!/\.(ts|tsx|js|mjs|md|json|css)$/.test(ent.name)) continue;
    const lines = fs.readFileSync(p, "utf8").split(/\r?\n/);
    lines.forEach((line, i) => {
      const n = (line.match(new RegExp(NBSP, "g")) || []).length + (line.match(new RegExp(WJ, "g")) || []).length;
      if (n) hits.push(`${p.replace(/\\/g, "/")}:${i + 1}  ${n}× raw U+00A0/U+2060  …${line.trim().slice(0, 60)}`);
    });
  }
}
for (const r of ROOTS) if (fs.existsSync(r)) walk(r);
if (hits.length) { console.log(hits.join("\n")); console.log(`\nraw NBSP/U+2060 in source: ${hits.length} — must be 0`); process.exit(1); }
console.log("raw NBSP/U+2060 in source: 0");
