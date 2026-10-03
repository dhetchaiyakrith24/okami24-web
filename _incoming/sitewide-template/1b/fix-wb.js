// wordbreak-scan NEW flags (03/10): "ยัง" at a line end reads as "not yet" → "ขณะหัวเสียบอยู่" (no ยัง) everywhere;
// click counts in the spec values split "3 | ครั้ง" → spelled out in words (the story points keep digits, not flagged).
const fs = require("fs");
const f = __dirname + "/th.json";
let s = fs.readFileSync(f, "utf8");
const R = [
  ["หัวรุ่นใหม่เติมน้ำยาได้ทั้งที่ยังเสียบอยู่", "หัวรุ่นใหม่เติมน้ำยาได้ขณะหัวเสียบอยู่"],
  ["เติมน้ำยาได้ทั้งที่หัวยังเสียบอยู่", "เติมน้ำยาได้ขณะหัวเสียบอยู่"],
  ["ปุ่มเดียว: กด 1 ครั้ง เปิดจอ · 2 ครั้ง ล็อก/ปลดล็อกปุ่มยิง · 3 ครั้ง ปรับวัตต์ · 4 ครั้ง เข้าเมนู · 5 ครั้ง เปิด/ปิดเครื่อง",
    "ปุ่มเดียว: กดครั้งเดียว เปิดจอ · กดสองครั้ง ล็อก/ปลดล็อกปุ่มยิง · กดสามครั้ง ปรับวัตต์ · กดสี่ครั้ง เข้าเมนู · กดห้าครั้ง เปิด/ปิดเครื่อง"],
  ["กด 5 ครั้ง เปิด/ปิดเครื่อง · 2 ครั้ง ล็อก/ปลดล็อกปุ่มยิง · 1 ครั้ง ยิง/ดูระดับแบต",
    "กดห้าครั้ง เปิด/ปิดเครื่อง · กดสองครั้ง ล็อก/ปลดล็อกปุ่มยิง · กดครั้งเดียว ยิง/ดูระดับแบต"],
];
for (const [a, b] of R) { const n = s.split(a).length - 1; if (!n) throw new Error("missing: " + a); s = s.split(a).join(b); console.log(n, "×", b.slice(0, 30)); }
fs.writeFileSync(f, s);
