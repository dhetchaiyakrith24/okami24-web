import "server-only";
import jsQR from "jsqr";
import sharp from "sharp";

/**
 * Our own read of a slip's QR, for when EasySlip cannot find it in the picture (owner 30/10: a staff member posted a
 * photo of a LINE chat with the customer's slip shown small inside it; the bot answered "อ่านสลิปจากรูปนี้ไม่ได้" although
 * the money had arrived). EasySlip also verifies a slip from the QR text alone (`payload`, 1–128 characters —
 * document.easyslip.com /en/v2/verify/bank/), so slip-verify.ts sends what we read here when the picture failed.
 *
 * jsQR needs a few pixels per QR module; a QR shown small is read after enlarging the picture, so we try the
 * picture as it is, then 2× and 3× — never past MAX_SIDE, so one large photo cannot hold the server for long.
 * The picture stays in memory, as everywhere else in the slip check.
 */

const SCALES = [1, 2, 3] as const;
const MAX_SIDE = 3600;

export async function readSlipQr(bytes: Buffer): Promise<string | null> {
  let width: number;
  let height: number;
  try {
    const meta = await sharp(bytes).metadata();
    width = meta.width ?? 0;
    height = meta.height ?? 0;
  } catch {
    return null;
  }
  if (!width || !height) return null;
  for (const scale of SCALES) {
    if (Math.max(width, height) * scale > MAX_SIDE) break;
    try {
      // No EXIF auto-rotate: a QR reads the same at any quarter turn, and metadata width/height are pre-rotation.
      const { data, info } = await sharp(bytes)
        .resize(width * scale, height * scale, { kernel: scale === 1 ? "lanczos3" : "nearest" })
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const found = jsQR(new Uint8ClampedArray(data.buffer, data.byteOffset, data.length), info.width, info.height);
      const text = found?.data?.trim();
      if (text && text.length <= 128) return text;
    } catch {
      return null;
    }
  }
  return null;
}
