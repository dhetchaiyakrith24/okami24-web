/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// Product-page text length + repeated facts (round "sitewide template" batch 1, 03/10 — the gate of
// docs/PRODUCT_PAGE_TEMPLATE.md §3 / HANDOFF §18 "Text length per product page": 1,000–3,500 unique Thai characters of main
// content, spec table not counted, one fact at most twice outside the spec table).
//
//   node scripts/page-text-length.js <visible-text scan dir> [--facts <json>] [--width 1440]
//   reads the th JSON files a `scripts/visible-text.js scan` wrote (one per page × locale × width) — measure the build you
//   are judging (test server or live), never the source files.
//   --facts: JSON { "<slug>": ["1600mAh", "6 วัน", …] } — each string is counted once per text block it appears in.
//
// Main content = blocks under <main>, minus the breadcrumb (main/nav), the hero price/buttons/stat row, the spec-table
// section, the related-products section and everything after it. Unique = identical block texts counted once.
// Prints one row per page and PASS/LOW/HIGH against the band; a fact over 2 = REPEAT. Report only — the batch decides.
const fs = require("fs");
const path = require("path");
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const dir = args.find((a, i) => !a.startsWith("--") && !(args[i - 1] || "").startsWith("--"));
if (!dir) { console.error("usage: node scripts/page-text-length.js <scan dir> [--facts <json>] [--width 1440]"); process.exit(2); }
const width = opt("--width", "1440");
const facts = opt("--facts") ? JSON.parse(fs.readFileSync(opt("--facts"), "utf8")) : {};
const LOW = 1000, HIGH = 3500;
const SPEC_H2 = ["ข้อมูลที่ยืนยันได้จริง"];
const STOP_H2 = ["สินค้าใกล้เคียง"]; // related products and everything after it
const thai = (s) => (s.match(/[฀-๿]/g) || []).length;
const section = (p) => (p.match(/^main:\d+\/section:\d+/) || [""])[0];

let worst = 0;
const rows = [];
for (const f of fs.readdirSync(dir).filter((n) => n.endsWith(`~th~${width}.json`)).sort()) {
  const j = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  const blocks = j.blocks.filter((b) => b.path.startsWith("main:") && !/^main:\d+\/nav:/.test(b.path));
  const specSec = new Set(blocks.filter((b) => SPEC_H2.includes(b.text)).map((b) => section(b.path)));
  const stopAt = blocks.findIndex((b) => STOP_H2.includes(b.text));
  const main = (stopAt >= 0 ? blocks.slice(0, stopAt) : blocks)
    .filter((b) => !specSec.has(section(b.path)))
    .filter((b) => !/\/(dl|button|a):\d+/.test(b.path) || /\/(p|h\d|li):\d+$/.test(b.path))
    .filter((b) => !/^฿/.test(b.text));
  const all = main.reduce((n, b) => n + thai(b.text), 0);
  const uniq = [...new Set(main.map((b) => b.text))].reduce((n, t) => n + thai(t), 0);
  const slug = j.page.replace(/^\/products\//, "");
  const reps = (facts[slug] || []).map((fact) => [fact, main.filter((b) => b.text.includes(fact)).length]);
  const band = uniq < LOW ? "LOW" : uniq > HIGH ? "HIGH" : "PASS";
  const over = reps.filter(([, n]) => n > 2);
  if (band !== "PASS" || over.length) worst = 1;
  rows.push(`| ${j.page} | ${all} | ${uniq} | ${band} | ${reps.map(([t, n]) => `${t} ×${n}${n > 2 ? " REPEAT" : ""}`).join(" · ") || "—"} |`);
}
console.log(`# page text length — ${dir} · th @${width} · band ${LOW}–${HIGH} unique Thai chars (spec table + related not counted)\n`);
console.log("| page | main Thai chars | unique Thai chars | band | facts outside the spec table |\n|---|---|---|---|---|");
console.log(rows.join("\n"));
console.log(worst ? "\nFLAGS — see LOW/HIGH/REPEAT above" : "\nPASS");
