/* eslint-disable @typescript-eslint/no-require-imports -- QC helper, CommonJS on purpose */
// Round 30.4ค closing — diff two word-break scans (before = wb/ at 98d8f5a, after = wb-typo/ at the
// typography build) page by page and width by width. Prints, per issue type, what disappeared
// (fixed) and what appeared (new), plus the totals — so the designer only looks at crops of those.
//   node scripts/wb-diff.js <beforeDir> <afterDir> > <out.md>
// Moved from _incoming/30.4c/ (deleted 2026-09-17 on the owner's order) to scripts/ so the
// wordbreak-scan before/after workflow in HANDOFF §16 keeps working; both dirs must be given.
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..", "_incoming");
const BEFORE = process.argv[2] || path.join(ROOT, "wb");
const AFTER = process.argv[3] || path.join(ROOT, "wb-typo");
// before-scan names (wb-all.sh) → after-scan names (scripts/wordbreak-scan.js)
const MAP = {
  home: "home", about: "about", faq: "faq", eliquid: "e-liquid", guides: "guides", favorites: "favorites",
  "guide-first": "guides_choosing-your-first-pod-system", "guide-battery": "guides_battery-care-and-charging",
  "guide-mtl": "guides_understanding-mtl-vs-dtl", "guide-switch": "guides_open-system-vs-disposable",
  "guide-watt": "guides_choosing-wattage-and-airflow", "tech-touch": "technology_onboard-touch-displays",
  "tech-chip": "technology_high-output-chip-platforms", tech: "technology",
};
const afterName = (p) => (p.startsWith("pdp-") ? `products_${p.slice(4)}` : MAP[p] ?? p); // same-style names pass through
// normalise the invisible characters the after-build renders, so the same sentence keys equal
const plain = (s) => (s || "").split(String.fromCharCode(0xa0)).join(" ").split(String.fromCharCode(0x2060)).join("");
const key = (e, i) => `${i.type}|${plain(e.text).slice(0, 40)}|${plain(i.word || i.lineEnd || "")}`;
const load = (dir, name) => { try { return JSON.parse(fs.readFileSync(path.join(dir, `${name}.json`), "utf8")); } catch { return null; } };
const files = fs.readdirSync(BEFORE).filter((f) => f.endsWith(".json")).sort();
const fixed = {}, added = {}; let pairs = 0, skipped = [], totB = 0, totA = 0;
for (const f of files) {
  const m = f.match(/^(.*)-(390|1440)\.json$/); if (!m) continue;
  const an = afterName(m[1]); if (!an) { skipped.push(f); continue; }
  const b = load(BEFORE, `${m[1]}-${m[2]}`), a = load(AFTER, `${an}-${m[2]}`);
  if (!b || !a) { skipped.push(f); continue; }
  pairs++;
  const bk = new Map(), ak = new Map();
  for (const e of b) for (const i of e.issues) bk.set(key(e, i), { e, i });
  for (const e of a) for (const i of e.issues) ak.set(key(e, i), { e, i });
  totB += bk.size; totA += ak.size;
  const where = `${an}@${m[2]}`;
  for (const [k, v] of bk) if (!ak.has(k)) (fixed[v.i.type] ??= new Map()).set(k, { ...(fixed[v.i.type].get(k) ?? { pages: [], ...v }), pages: [...(fixed[v.i.type].get(k)?.pages ?? []), where] });
  for (const [k, v] of ak) if (!bk.has(k)) (added[v.i.type] ??= new Map()).set(k, { ...(added[v.i.type].get(k) ?? { pages: [], ...v }), pages: [...(added[v.i.type].get(k)?.pages ?? []), where] });
}
const detail = (r) => (r.i.word ? `«${r.i.word}»` : `…${r.i.lineEnd} | ${r.i.nextStart}…`).replace(/\|/g, "\\|");
const table = (title, obj) => {
  const n = Object.values(obj).reduce((s, m) => s + m.size, 0);
  console.log(`## ${title} — ${n} distinct\n`);
  for (const [type, map] of Object.entries(obj).sort((x, y) => y[1].size - x[1].size)) {
    console.log(`### ${type} — ${map.size}\n\n| n | page@width | element | text | detail |\n|---|---|---|---|---|`);
    for (const r of [...map.values()].sort((x, y) => y.pages.length - x.pages.length)) {
      const where = r.pages.length > 4 ? `${r.pages.length} pages (e.g. ${r.pages.slice(0, 3).join(" · ")})` : r.pages.join(" · ");
      console.log(`| ${r.pages.length} | ${where} | ${r.e.tag} y=${r.e.y} | ${r.e.text.slice(0, 70).replace(/\|/g, "\\|")} | ${detail(r)} |`);
    }
    console.log("");
  }
};
console.log(`# word-break diff — before ${path.basename(BEFORE)} vs after ${path.basename(AFTER)} · ${pairs} page/width pairs compared · skipped ${skipped.length} (${skipped.join(", ") || "-"})\n`);
console.log(`issue instances (per page/width, summed): before ${totB} → after ${totA}\n`);
table("FIXED (in before, gone in after)", fixed);
table("NEW (not in before, present in after)", added);
