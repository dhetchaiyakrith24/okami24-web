// Owner answers 03/10 cloud chat (batch 1c report): words locked in THAI_STYLE · template note on layout variety · §16 for the chat move.
const fs = require("fs");
const rep = (f, a, b) => {
  const s = fs.readFileSync(f, "utf8");
  if (s.split(a).length !== 2) throw new Error(`${f}: anchor not found once: ${a.slice(0, 60)}`);
  fs.writeFileSync(f, s.replace(a, b));
};
// THAI_STYLE — new paragraph after the batch 1a line
const a1 = "— ที่มา: หน้า G5 Lite / G5 Lite SE · ใช้ได้ทั้งเว็บ";
rep("docs/THAI_STYLE.md", a1, a1 + "\n\n" +
  "**คำที่ล็อกรอบไล่ทั้งเว็บ ก้อน 1c [เจ้าของเคาะ 2026-10-03 — \"ตบคอ คำเดียวที่ไม่ผ่าน\"]** — ผ่าน: **แอนิเมชัน** (= animation · ไม่ใช้ \"ภาพเคลื่อนไหว\") · **อัปเลเวล** · " +
  "**ทรงกล่อง / ทรงเพรียว** (= box-shaped / slim body — \"แท่ง\" ยังเป็นคำห้าม) · **ธีมหน้าจอแบบสุ่ม · เกมสุ่มการ์ด · สุ่มสะสม** (= blind draw) · **รีเซ็ตตัวนับพัฟ** · " +
  "**โหมดประหยัดแบต** · **เวลาปิดจอ** · **การแตะจอ** (label ตารางสเปก = Touch) · **ไม่ผ่าน: \"ตบคอ\"** (= throat hit — เจ้าของไม่เข้าใจคำนี้ · ใช้ \"แรงถึงคอ\" แทน) — ที่มา: หน้า G4 Pro / G4 Pro KOKO");
// template — owner 03/10 on batch 1b: vary the stage layout between pages
rep("docs/PRODUCT_PAGE_TEMPLATE.md",
  "| `features[]` (poster) + `story-copy.ts` (th/en/zh) · `storyLayout: \"stage\"` |",
  "| `features[]` (poster) + `story-copy.ts` (th/en/zh) · `storyLayout: \"stage\"` · owner 03/10 on batch 1b: \"สลับ ๆ กันบ้างก็ได้ จะได้ไม่เหมือนกันทุกหน้า แม้มีต้นแบบ\" = vary the arrangement between pages (not yet built — a design choice per page/brand, inside the template) |");
console.log("edited");
