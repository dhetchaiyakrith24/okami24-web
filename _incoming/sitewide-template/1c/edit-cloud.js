// docs/CLOUD.md table row "เปิดเว็บจริง okami24.store" — overwritten with the 03/10 cause (same topic, rule 25).
const fs = require("fs");
const f = "docs/CLOUD.md";
const s = fs.readFileSync(f, "utf8");
const a = "| เปิดเว็บจริง okami24.store | ได้ | **ครึ่งเดียว** — curl อ่านได้ 200 (หลัง Javis เพิ่มโดเมน 26/09) · Chromium เปิดไม่ได้ (\"Your connection is not private\" — คลังใบรับรองของเบราว์เซอร์ในเครื่องคลาวด์ว่าง) → ถ่ายภาพเว็บจริง/ตรวจหน้าอังกฤษด้วยคุกกี้ยังไม่ได้ [ลองแล้ว `docs/cloud-results/mobile-round.md` ก้อน 3] | ตรวจเว็บจริงบนคอม หรือรอแก้ใบรับรอง (ชุดคำถามรอบมือถือ) |";
const b = "| เปิดเว็บจริง okami24.store | ได้ | **ครึ่งเดียว** — curl อ่านได้ 200 · Chromium ยังเปิดไม่ได้ (`NET::ERR_CERT_AUTHORITY_INVALID` — ลองใหม่ 03/10) · สาเหตุ [ลองแล้ว 03/10]: Chromium ออกเน็ตตรง ทางนั้นด่านขาออกของคลาวด์เซ็นใบรับรองใหม่ด้วย CA ของตัวเอง ส่วน `scripts/lib/cloud-ca.js` จำ CA ผ่านพร็อกซีซึ่งส่งใบจริงของเว็บมา จึงจำผิดตัว · ทางแก้ 2 ทาง (ให้ Chromium เชื่อ CA ของด่าน · ให้ Chromium วิ่งผ่านพร็อกซี `--proxy-server`) ถูกระบบอนุญาตอัตโนมัติของแชทคลาวด์ปฏิเสธ | ภาพเว็บจริง = บนคอม · หรือเจ้าของเพิ่มกฎ permission ให้คำสั่ง shot.js ในหน้าตั้งค่าของคลาวด์ · ระหว่างนี้ภาพก่อน = build main ขึ้นเครื่องทดสอบ (เครื่องชนิดเดียวกับภาพหลัง) |";
if (s.split(a).length !== 2) throw new Error("row not found once");
fs.writeFileSync(f, s.replace(a, b));
console.log("CLOUD.md row updated");
