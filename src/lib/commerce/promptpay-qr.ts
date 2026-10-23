import "server-only";
import { readFile, stat } from "node:fs/promises";
import jsQR from "jsqr";
import qrcode from "qrcode-generator";
import sharp from "sharp";
import { promptpayQrPath } from "@/lib/paths";
import { withAmount } from "./promptpay-amount";

/**
 * The order page's PromptPay QR with the order total filled in (owner 23/10, BSOT §9). The shop's PromptPay target is
 * never typed into code, git or env: it is read from the owner's own QR file in the private data folder (the same file
 * the page served before), decoded here, and only the amount + checksum change (promptpay-amount.ts).
 *
 * Anything that goes wrong — no file, a file that does not decode, a payload that is not a valid PromptPay QR —
 * returns null, and the route falls back to serving the owner's file as it did before (the customer then types the
 * amount, as the page note says in that case). Nothing here logs the payload.
 */

let cache: { mtimeMs: number; payload: string | null } | null = null;

/** The shop QR's payload string, decoded once per file version. null = no usable QR. */
export async function shopPromptPayPayload(): Promise<string | null> {
  const file = promptpayQrPath();
  let mtimeMs: number;
  try {
    mtimeMs = (await stat(file)).mtimeMs;
  } catch {
    return null;
  }
  if (cache && cache.mtimeMs === mtimeMs) return cache.payload;
  let payload: string | null = null;
  try {
    const { data, info } = await sharp(await readFile(file)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const found = jsQR(new Uint8ClampedArray(data.buffer, data.byteOffset, data.length), info.width, info.height);
    // withAmount() is the validity check: it refuses anything that is not a well-formed PromptPay payload.
    payload = found && withAmount(found.data, 1) ? found.data : null;
  } catch {
    payload = null;
  }
  cache = { mtimeMs, payload };
  return payload;
}

/** True when the order page can show a QR with the amount filled in. */
export async function amountQrAvailable(): Promise<boolean> {
  return (await shopPromptPayPayload()) !== null;
}

/** A PNG of the shop's PromptPay QR carrying `amountBaht`, or null (fall back to the owner's file). Black on white with
 *  a 4-module quiet zone, 10 px per module — bank apps scan it from the screen or from a saved screenshot. */
export async function amountQrPng(amountBaht: number): Promise<Buffer | null> {
  const payload = await shopPromptPayPayload();
  const text = payload ? withAmount(payload, amountBaht) : null;
  if (!text) return null;
  const code = qrcode(0, "M");
  code.addData(text, "Byte");
  code.make();
  const n = code.getModuleCount();
  const size = n + 8;
  let d = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (code.isDark(r, c)) d += `M${c + 4} ${r + 4}h1v1h-1z`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size * 10}" height="${size * 10}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}
