#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// asked-before.js — has the owner already settled this? Run BEFORE adding a question to docs/รอพี่ตรวจ.md or asking in chat
// (central §12 item 17; house round 06/11, owner: "เรื่องที่จบแล้ว Friday ไม่ถามซ้ำ"). Until now "search §18 first" was memory only.
//   node scripts/asked-before.js --file q.txt      the text of one question (Thai through a file: HANDOFF §17 "Windows shell")
//   node scripts/asked-before.js "words"           same, on the command line
//   node scripts/asked-before.js --open            every open question in รอพี่ตรวจ against the homes (house-check prints this)
//   node scripts/asked-before.js --self-test
// It searches the homes of settled answers: HANDOFF §18 · BSOT · THAI_STYLE · IMAGE_SPEC · SEO_LANDSCAPE · the parked part of รอพี่ตรวจ.
// A hint, never a verdict: a match means "read that line first", no match does not prove the question is new. Reads only.
// Most rulings are written in English and most questions in Thai, so a short glossary bridges the two; add a pair when a real miss shows up.
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const WAIT = "docs/รอพี่ตรวจ.md";
const HOMES = ["docs/HANDOFF.md", "docs/BUSINESS_SOURCE_OF_TRUTH.md", "docs/THAI_STYLE.md", "docs/IMAGE_SPEC.md", "docs/SEO_LANDSCAPE.md"];
const GLOSSARY = {
  ราคา: ["price", "prices"], ค่าส่ง: ["shipping"], ตะกร้า: ["cart"], สี: ["colour", "colours"], กลิ่น: ["flavour", "flavours"], รูป: ["picture", "pictures", "image", "images", "photo", "photos"],
  ลายน้ำ: ["watermark"], คลัง: ["warehouse"], สมาชิก: ["member", "members"], ส่วนลด: ["discount"], หน้าแรก: ["home", "homepage"], สต็อก: ["stock"], ออเดอร์: ["order", "orders"],
  ลูกค้า: ["customer", "customers"], สลิป: ["slip"], บทความ: ["article", "articles"], แบรนด์: ["brand", "brands"], โลโก้: ["logo"], อีเมล: ["email"], เบอร์: ["phone"], ขนส่ง: ["carrier"],
  ขายดี: ["bestseller", "best"], ป้าย: ["badge", "label"], ซอง: ["pack", "pouch"], กล่อง: ["box"], คลิป: ["clip", "clips", "video"], สำรอง: ["backup"], ลงทะเบียน: ["register", "sign"], สมัคร: ["register", "signup"],
  สากล: ["international"], พอต: ["pod", "pods"], หัวเว็บ: ["header"], ใกล้หมด: ["low-stock"], ส่งฟรี: ["free"],
};
const STOP_TH = new Set(
  "ที่ และ หรือ ไม่ ได้ ให้ ใน ของ มี เป็น จะ แล้ว ก็ กับ ไว้ ไป มา ถ้า แต่ ว่า นี้ นั้น ยัง ยังไม่ ดู เอง พี่ ไหม เรื่อง แบบ ตัว ข้อ หน้า เว็บ บน เมื่อ เพราะ จาก ถึง ตาม ใช้ ทำ เอา ส่ง ลง ออก ขึ้น เข้า ครบ แค่ ซึ่ง อยู่ ต้อง ควร อัน ทุก ส่วน ไหน อะไร ยังไง เขียน แสดง เท่า สินค้า ข้อมูล ทำไม บ้าง แล้วก็".split(" "),
);
const STOP_EN = new Set("the and for with not that this from are was were has have had but its all any can may per one two see owner chat site page pages friday".split(" "));
const seg = new Intl.Segmenter("th", { granularity: "word" });

function words(text) {
  const out = new Set();
  const low = String(text).toLowerCase();
  // the segmenter cuts shop words it does not know (ออเดอร์ = ออ|เด|อร์), so glossary words are found as plain text first
  for (const k of Object.keys(GLOSSARY)) if (low.includes(k)) out.add(k);
  for (const s of seg.segment(low)) {
    if (!s.isWordLike) continue;
    const w = s.segment;
    if (/^[฀-๿]+$/.test(w)) {
      if (w.length >= 3 && !STOP_TH.has(w)) out.add(w);
    } else if (/^[a-z][a-z0-9-]+$/.test(w)) {
      if (w.length >= 3 && !STOP_EN.has(w)) out.add(w);
    } else if (/^\d{3,}$/.test(w.replace(/,/g, ""))) out.add(w.replace(/,/g, ""));
  }
  return out;
}
const concepts = (text) => [...words(text)].map((w) => new Set([w, ...(GLOSSARY[w] || [])]));

function readFile(root, rel) {
  try {
    return fs.readFileSync(path.join(root, rel), "utf8").replace(/\r\n/g, "\n");
  } catch {
    return "";
  }
}
// One chunk = one ruling or close to it: §18 and THAI_STYLE keep many on a line, split by " · ".
function chunks(root) {
  const out = [];
  for (const rel of HOMES) {
    let body = readFile(root, rel);
    let from = 0;
    if (rel === "docs/HANDOFF.md") {
      const at = body.indexOf("\n## 18.");
      from = body.slice(0, at).split("\n").length;
      body = body.slice(at + 1);
    }
    body.split("\n").forEach((line, i) => {
      for (const part of line.split(" · ")) if (part.trim().length > 15) out.push({ file: rel, line: from + i + 1, text: part.trim() });
    });
  }
  let parked = false;
  readFile(root, WAIT)
    .split("\n")
    .forEach((l, i) => {
      if (l.startsWith("## ")) parked = l.includes("พี่พักไว้");
      else if (parked && /^\d+\. /.test(l)) out.push({ file: WAIT, line: i + 1, text: l });
    });
  for (const c of out) c.words = words(c.text);
  return out;
}
function search(text, all, { min = 0.34, minHits = 2, top = 5 } = {}) {
  const cs = concepts(text);
  const has = (x, c) => [...c].some((w) => x.words.has(w));
  const weight = cs.map((c) => Math.log((all.length + 1) / (1 + all.reduce((n, x) => n + (has(x, c) ? 1 : 0), 0))));
  const total = weight.reduce((a, b) => a + b, 0) || 1;
  return all
    .map((x) => {
      const hit = cs.map((c, i) => (has(x, c) ? i : -1)).filter((i) => i >= 0);
      return { ...x, score: hit.reduce((a, i) => a + weight[i], 0) / total, hits: hit.map((i) => [...cs[i]][0]) };
    })
    .filter((x) => x.hits.length >= minHits && x.score >= min)
    .sort((a, b) => b.score - a.score)
    .slice(0, top);
}
const show = (m) => `${m.score.toFixed(2)} ${m.file}:${m.line}  ${m.text.slice(0, 110)}  [${m.hits.slice(0, 6).join(" ")}]`;

// Open questions of รอพี่ตรวจ that a home may already answer: { item, what, matches }[]
function openChecks(root = ROOT) {
  const all = chunks(root);
  const res = [];
  let live = false;
  for (const l of readFile(root, WAIT).split("\n")) {
    if (l.startsWith("## ")) live = /รอพี่ตัดสิน|งานที่พี่ต้องทำเอง/.test(l);
    const m = l.match(/^(\d+)\. (.+)/);
    if (!live || !m) continue;
    const matches = search(m[2], all, { min: 0.55, minHits: 3, top: 2 });
    if (matches.length) res.push({ item: m[1], what: m[2].slice(0, 70), matches });
  }
  return res;
}

function selfTest() {
  const fake = (text, line) => ({ file: "docs/HANDOFF.md", line, text, words: words(text) });
  const all = [
    fake("LINE orders are charged the same price as the web (owner 04/11)", 1),
    fake("Red for no on every box or line", 2),
    fake("Header logo keeps the helmet mark under sm", 3),
    fake("Pods state the international version only", 4),
    fake("Sources named in articles: no Thai agency", 5),
  ];
  let bad = 0;
  const ok = (c, name) => {
    console.log(`${c ? "ok  " : "FAIL"} ${name}`);
    if (!c) bad++;
  };
  ok(search("ออเดอร์ LINE ใช้ราคาเว็บไหม", all, { min: 0.2 })[0]?.line === 1, "A1 a Thai question finds the English ruling through the glossary");
  ok(search("พรุ่งนี้ฝนตกไหม", all).length === 0, "A2 an unrelated question finds nothing");
  ok(!words("ราคา 35 บาท").has("35"), "A3 a two-digit number is not a search word");
  console.log(bad ? "SELF-TEST FAIL" : "SELF-TEST PASS");
  process.exit(bad ? 1 : 0);
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) selfTest();
  if (args.includes("--open")) {
    const rows = openChecks();
    for (const r of rows) {
      console.log(`  item ${r.item}: ${r.what}`);
      for (const m of r.matches) console.log(`    ${show(m)}`);
    }
    if (!rows.length) console.log("  none");
    process.exit(0);
  }
  const at = args.indexOf("--file");
  const q = at >= 0 ? fs.readFileSync(args[at + 1], "utf8") : args.join(" ");
  if (!q.trim()) {
    console.log('usage: asked-before.js --file q.txt | "words" | --open | --self-test');
    process.exit(2);
  }
  const hits = search(q, chunks(ROOT));
  console.log(hits.length ? hits.map(show).join("\n") : "no settled answer found (a hint, not a proof)");
}
module.exports = { openChecks };
