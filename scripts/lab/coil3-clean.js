/* eslint-disable */
// Recipe kept from _incoming/coil3/fix/clean.js (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
// Drop faint stray alpha (matte noise) outside the product's solid box (alpha >= 128, dilated 4 px). process-images trims on
// alpha > 8, so these specks shrank (coil-72-2: 768 px instead of 838) or off-centred (coil-1-14) the product. node clean.js <png>...
const s = require("C:/Users/dhetc/Claude-Web-Lab-v3-checkpoint-3.3.3/node_modules/sharp");
(async () => { for (const f of process.argv.slice(2)) {
  const { data, info } = await s(f).ensureAlpha().raw().toBuffer({ resolveWithObject: true }); const W = info.width, H = info.height;
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (data[(y * W + x) * 4 + 3] >= 128) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  x0 -= 4; y0 -= 4; x1 += 4; y1 += 4; let n = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (x < x0 || x > x1 || y < y0 || y > y1) { const p = (y * W + x) * 4 + 3; if (data[p]) { data[p] = 0; n++; } }
  await s(data, { raw: { width: W, height: H, channels: 4 } }).png().toFile(f + ".tmp.png");
  require("fs").renameSync(f + ".tmp.png", f); console.log(f, "cleared", n);
} })();
