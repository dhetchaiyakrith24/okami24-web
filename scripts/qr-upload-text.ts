/**
 * Turns the shop's PromptPay QR into the one block of text that gets pasted into the host's
 * dashboard, so the image reaches the server's disk without a terminal, an upload form, or the
 * file ever entering git.
 *
 *   npx tsx scripts/qr-upload-text.ts
 *
 * Writes `_incoming/qr-upload/promptpay-qr.b64` (gitignored) and prints only the file path and
 * size — never the text itself, which is the payment QR and does not belong in a terminal log or
 * a report. docs/DEPLOY-RENDER.md says where to paste it.
 *
 * Reads whatever QR is currently live (`.data/private/promptpay-qr.png`, or OKAMI24_DATA_DIR),
 * so re-running it after the owner replaces the QR produces the new one.
 */
import fs from "node:fs";
import path from "node:path";
import { promptpayQrPath } from "../src/lib/paths";

const source = promptpayQrPath();
if (!fs.existsSync(source)) {
  console.error(`ไม่พบไฟล์ QR ที่ ${source}`);
  console.error("วางไฟล์ promptpay-qr.png ไว้ที่ตำแหน่งนั้นก่อน แล้วรันใหม่");
  process.exit(1);
}

const png = fs.readFileSync(source);
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!png.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC)) {
  console.error(`ไฟล์ ${source} ไม่ใช่ไฟล์ PNG จริง — หยุดไว้ก่อน ไม่สร้างข้อความ`);
  process.exit(1);
}

const outDir = path.join(process.cwd(), "_incoming", "qr-upload");
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, "promptpay-qr.b64");
fs.writeFileSync(outFile, png.toString("base64"), "utf8");

console.log(`รูป QR   : ${source} (${png.length} bytes)`);
console.log(`ข้อความ  : ${outFile} (${fs.statSync(outFile).size} ตัวอักษร)`);
console.log("");
console.log("ขั้นต่อไป: เปิดไฟล์ข้างบนด้วย Notepad → Ctrl+A → Ctrl+C → วางในช่องที่ docs/DEPLOY-RENDER.md บอก");
console.log("ห้ามส่งไฟล์นี้ให้ใคร และห้ามแนบในรายงาน — เป็นข้อมูลการรับเงินของร้าน");
