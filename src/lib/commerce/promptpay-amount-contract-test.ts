/**
 * OKami24 — PromptPay QR with the order amount (owner 23/10, BSOT §9).
 *
 *   1. the checksum is CRC-16/CCITT-FALSE (standard check value) and a payload's own CRC is verified;
 *   2. withAmount() turns a static shop QR into a one-payment QR: tag 01 = 12, tag 54 = the total with 2 decimals,
 *      a valid new CRC — and the receiver field (tag 29) is copied byte for byte, so the slip names the same receiver;
 *   3. it refuses what it must not touch: a bad CRC, a non-PromptPay payload, a zero/negative/absurd amount;
 *   4. a QR drawn the way promptpay-qr.ts draws it decodes back (jsQR) to exactly that payload.
 * Synthetic receiver IDs only — the shop's real QR is never read here.
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import jsQR from "jsqr";
import qrcode from "qrcode-generator";
import sharp from "sharp";
import { crc16, isPromptPayPayload, parseTlv, withAmount } from "./promptpay-amount";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

const tlv = (id: string, v: string) => `${id}${String(v.length).padStart(2, "0")}${v}`;
const seal = (body: string) => `${body}6304${crc16(`${body}6304`)}`;
// A static e-wallet QR shaped like the shop's (tag 29 · AID + sub-tag 03 15-digit ID), with a made-up ID.
const RECEIVER = tlv("29", tlv("00", "A000000677010111") + tlv("03", "000000000000123"));
const STATIC = seal(tlv("00", "01") + tlv("01", "11") + RECEIVER + tlv("53", "764") + tlv("58", "TH"));

(async () => {
  // 1. checksum
  check("CRC-16/CCITT-FALSE check value of '123456789' is 29B1", crc16("123456789") === "29B1", crc16("123456789"));
  check("synthetic static QR is a valid PromptPay payload", isPromptPayPayload(STATIC), STATIC);
  check("a payload with a wrong CRC is refused", !isPromptPayPayload(STATIC.slice(0, -4) + "0000"));

  // 2. amount in, receiver kept
  const dyn = withAmount(STATIC, 450);
  const f = dyn ? parseTlv(dyn) : null;
  const get = (id: string) => f?.find((x) => x.id === id)?.value;
  check("withAmount gives a valid payload", !!dyn && isPromptPayPayload(dyn), String(dyn));
  check("tag 01 becomes 12 (one payment)", get("01") === "12", String(get("01")));
  check("tag 54 = 450.00", get("54") === "450.00", String(get("54")));
  check("tag 54 sits right after tag 53", !!f && f.findIndex((x) => x.id === "54") === f.findIndex((x) => x.id === "53") + 1);
  check("receiver (tag 29) copied byte for byte", !!dyn && dyn.includes(RECEIVER));
  check("country, currency, format kept", get("58") === "TH" && get("53") === "764" && get("00") === "01");
  check("CRC is the last field", f?.[f.length - 1]?.id === "63");
  check("decimals: 1290.5 → 1290.50", get("54") !== undefined && parseTlv(withAmount(STATIC, 1290.5)!)!.find((x) => x.id === "54")?.value === "1290.50");
  check("an amount already in the QR is replaced, not doubled", (withAmount(dyn!, 99)!.match(/5406/g) ?? []).length <= 1 && parseTlv(withAmount(dyn!, 99)!)!.filter((x) => x.id === "54").length === 1);

  // 3. refusals
  for (const bad of [0, -5, Number.NaN, Number.POSITIVE_INFINITY, 1e13]) check(`amount ${bad} refused`, withAmount(STATIC, bad) === null);
  check("non-PromptPay text refused", withAmount("https://okami24.store", 450) === null);
  const noReceiver = seal(tlv("00", "01") + tlv("01", "11") + tlv("53", "764") + tlv("58", "TH"));
  check("a QR without a PromptPay receiver refused", withAmount(noReceiver, 450) === null);

  // 4. drawn and read back
  const code = qrcode(0, "M");
  code.addData(dyn!, "Byte");
  code.make();
  const n = code.getModuleCount();
  const size = n + 8;
  let d = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (code.isDark(r, c)) d += `M${c + 4} ${r + 4}h1v1h-1z`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size * 10}" height="${size * 10}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const read = jsQR(new Uint8ClampedArray(data.buffer, data.byteOffset, data.length), info.width, info.height);
  check("drawn QR decodes back to the same payload", read?.data === dyn, String(read?.data));

  for (const res of results) {
    console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
  }
  const failed = results.filter((x) => !x.passed);
  if (failed.length > 0) {
    console.error(`\n${failed.length} of ${results.length} checks failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} checks passed.`);
})();
