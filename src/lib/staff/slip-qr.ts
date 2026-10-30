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
 * picture as it is, then 2× and 3×. jsQR runs on the server's main thread and its memory grows with the pixel
 * count (checker #1059: a 1200×1200 picture with no QR = ~2 s and +200 MB with both colour passes, on a 512 MB
 * server), so: every try is at most MAX_PIXELS (a bigger picture is shrunk to fit; a scale past it is skipped),
 * one colour pass (slips are dark on light), and one read at a time across the server.
 * The picture stays in memory, as everywhere else in the slip check.
 */

const SCALES = [1, 2, 3] as const;
/** A full phone screenshot (1290×2796 = 3.6 MP) still reads unshrunk. Measured 30/10 on a no-QR noise picture, one
 *  pass: 2.96 MP = 1.7 s · 3.61 MP = 2.2 s, rss ≤ +120 MB (`_incoming/slip-retry-3010/qr-bench.ts`). */
const MAX_PIXELS = 3_700_000;

let queue: Promise<unknown> = Promise.resolve();

/** One read at a time; a caller waits for the one before it. */
export function readSlipQr(bytes: Buffer): Promise<string | null> {
  const run = queue.then(() => read(bytes));
  queue = run.catch(() => null);
  return run;
}

async function read(bytes: Buffer): Promise<string | null> {
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
    let w = width * scale;
    let h = height * scale;
    if (w * h > MAX_PIXELS) {
      if (scale > 1) break;
      const shrink = Math.sqrt(MAX_PIXELS / (w * h));
      w = Math.floor(w * shrink);
      h = Math.floor(h * shrink);
    }
    try {
      // No EXIF auto-rotate: a QR reads the same at any quarter turn, and metadata width/height are pre-rotation.
      const { data, info } = await sharp(bytes)
        .resize(w, h, { fit: "fill", kernel: scale === 1 ? "lanczos3" : "nearest" })
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const found = jsQR(new Uint8ClampedArray(data.buffer, data.byteOffset, data.length), info.width, info.height, {
        inversionAttempts: "dontInvert",
      });
      const text = found?.data?.trim();
      if (text && text.length <= 128) return text;
    } catch {
      return null;
    }
  }
  return null;
}
