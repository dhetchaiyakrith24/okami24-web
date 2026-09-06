/**
 * Turns the shop's PromptPay QR into the one block of text that gets pasted into the host's
 * dashboard, so the image reaches the server's disk without a terminal, an upload form, or the
 * file ever entering git.
 *
 *   npx tsx scripts/qr-upload-text.ts        (npm run qr:upload-text)
 *
 * Reads whatever QR is currently live (`.data/private/promptpay-qr.png`, or OKAMI24_DATA_DIR) and
 * NEVER modifies it. Writes two gitignored files under `_incoming/qr-upload/`:
 *
 *   promptpay-qr-compact.png   the same QR, re-encoded small. A QR is black and white, so the
 *                              modules are stored as 2 colours; the coloured PromptPay logo in the
 *                              centre is cut from the original and put back untouched, because a
 *                              customer recognises that logo and a black-and-white blob in its
 *                              place looked wrong (designer, 2026-09-07). On 2026-09-07 that took
 *                              49,730 bytes to 2,405 — a 66,000-character paste became 3,200,
 *                              which a dashboard text field takes without complaint.
 *   promptpay-qr.b64           that compact PNG as base64 text — THE VALUE TO PASTE.
 *
 * The shrink is only accepted if every pixel OUTSIDE the logo box equals the original after the
 * same black/white threshold — same modules, same scan. If anything differs (it should not), the
 * original bytes are used instead and the script says so. (Decoding original and compact with a
 * QR reader on 2026-09-07 gave the identical 76-character PromptPay payload — done outside the
 * project; no decoder is bundled.)
 *
 * Prints only paths and sizes — never the text itself, which is the payment QR and does not belong
 * in a terminal log or a report. docs/DEPLOY-RENDER.md §5 says where to paste it.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { promptpayQrPath } from "../src/lib/paths";

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/** Pixels whose channels disagree by more than this are "coloured" (the logo); black, white and
 *  grey anti-aliasing all fall below it. */
const COLOUR_SPREAD = 40;
/** Extra pixels kept around the logo so its anti-aliased edge comes along. */
const LOGO_PAD = 3;

type Box = { left: number; top: number; width: number; height: number };

/** Bounding box of the coloured pixels — the PromptPay logo — or null if the image has none. */
async function findLogoBox(png: Buffer): Promise<Box | null> {
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  let x0 = width, y0 = height, x1 = -1, y1 = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (Math.max(r, g, b) - Math.min(r, g, b) > COLOUR_SPREAD) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) return null;
  const left = Math.max(0, x0 - LOGO_PAD);
  const top = Math.max(0, y0 - LOGO_PAD);
  return { left, top, width: Math.min(width, x1 + LOGO_PAD + 1) - left, height: Math.min(height, y1 + LOGO_PAD + 1) - top };
}

async function main(): Promise<void> {
  const source = promptpayQrPath();
  if (!fs.existsSync(source)) {
    console.error(`ไม่พบไฟล์ QR ที่ ${source}`);
    console.error("วางไฟล์ promptpay-qr.png ไว้ที่ตำแหน่งนั้นก่อน แล้วรันใหม่");
    process.exit(1);
  }

  const original = fs.readFileSync(source);
  if (!original.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC)) {
    console.error(`ไฟล์ ${source} ไม่ใช่ไฟล์ PNG จริง — หยุดไว้ก่อน ไม่สร้างข้อความ`);
    process.exit(1);
  }

  // 1. The modules as pure black/white. 2. The logo, cut from the original, put back on top.
  const modules = await sharp(original).greyscale().threshold(128).png().toBuffer();
  const logoBox = await findLogoBox(original);
  const layered = logoBox
    ? await sharp(modules)
        .composite([{ input: await sharp(original).extract(logoBox).png().toBuffer(), left: logoBox.left, top: logoBox.top }])
        .png()
        .toBuffer()
    : modules;
  const compact = await sharp(layered).png({ palette: true, colours: 16, compressionLevel: 9, effort: 10, dither: 0 }).toBuffer();

  // Same threshold on both sides, so "equal" means "every module the same colour". The logo box
  // is excluded: it is the one place the two files are allowed to differ.
  const asModules = (png: Buffer) => sharp(png).greyscale().threshold(128).raw().toBuffer({ resolveWithObject: true });
  const [a, b] = await Promise.all([asModules(original), asModules(compact)]);
  let differing = 0;
  if (a.info.width === b.info.width && a.info.height === b.info.height) {
    const w = a.info.width;
    for (let i = 0; i < a.data.length; i++) {
      if (a.data[i] === b.data[i]) continue;
      const x = i % w, y = Math.floor(i / w);
      const inLogo = logoBox && x >= logoBox.left && x < logoBox.left + logoBox.width && y >= logoBox.top && y < logoBox.top + logoBox.height;
      if (!inLogo) differing++;
    }
  } else {
    differing = -1;
  }
  const identical = differing === 0;
  const chosen = identical ? compact : original;

  const outDir = path.join(process.cwd(), "_incoming", "qr-upload");
  fs.mkdirSync(outDir, { recursive: true });
  const compactFile = path.join(outDir, "promptpay-qr-compact.png");
  const outFile = path.join(outDir, "promptpay-qr.b64");
  fs.writeFileSync(compactFile, chosen);
  const text = chosen.toString("base64");
  fs.writeFileSync(outFile, text, "utf8");

  const meta = await sharp(original).metadata();
  const total = a.data.length;
  console.log(`รูป QR ต้นฉบับ : ${source} (${original.length.toLocaleString()} bytes · ${meta.width}×${meta.height} · ไม่ได้แตะ)`);
  if (identical) {
    const logoNote = logoBox ? `โลโก้สีตรงกลาง ${logoBox.width}×${logoBox.height} px คงจากต้นฉบับ` : "ไม่พบโลโก้สี";
    console.log(`ฉบับบีบ        : ${compactFile} (${compact.length.toLocaleString()} bytes · ลาย QR ตรงต้นฉบับทุกจุด ${(total).toLocaleString()}/${total.toLocaleString()} นอกกรอบโลโก้ · ${logoNote})`);
  } else {
    console.log(`ฉบับบีบ        : ไม่ใช้ — ลาย QR ไม่ตรงต้นฉบับ (${differing} จุด) จึงใช้ไฟล์ต้นฉบับแทน (${compactFile})`);
  }
  console.log(`ข้อความให้วาง  : ${outFile} (${text.length.toLocaleString()} ตัวอักษร)`);
  console.log("");
  console.log("ขั้นต่อไป: เปิดไฟล์ข้างบนด้วย Notepad → Ctrl+A → Ctrl+C → วางในช่องที่ docs/DEPLOY-RENDER.md ข้อ 5 บอก");
  console.log("ห้ามส่งไฟล์นี้ให้ใคร และห้ามแนบในรายงาน — เป็นข้อมูลการรับเงินของร้าน");
}

main().catch((err) => {
  console.error(`สร้างข้อความไม่สำเร็จ — ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
