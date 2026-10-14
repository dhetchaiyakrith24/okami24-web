/* eslint-disable */
// Recipe kept from _incoming/image-sitewide/relx/dehalo.js (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
// GPT Image's transparent cut leaves a faint glow (alpha 1-30) around the device; the real edge jumps to ~236.
// Drop alpha < 60, lift the body's 253 to 255, trim. usage: node relx/dehalo.js <in> <out>
const sharp = require("sharp");
(async () => {
  const [inp, out] = process.argv.slice(2);
  const { data, info } = await sharp(inp).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 3; i < data.length; i += 4) data[i] = data[i] < 60 ? 0 : data[i] >= 250 ? 255 : data[i];
  const b = await sharp(data, { raw: info }).png().toBuffer();
  const t = await sharp(b).trim({ threshold: 1 }).png().toBuffer({ resolveWithObject: true });
  await sharp(t.data).toFile(out);
  console.log(out, t.info.width + "x" + t.info.height);
})();
