/* eslint-disable */
// Recipe kept from _incoming/muro-big/bbox.js (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
// bbox of the non-backdrop area (colour distance from the corner colour > T)
const s = require("C:/Users/dhetc/Claude-Web-Lab-v3-checkpoint-3.3.3/node_modules/sharp");
module.exports = async (f, T = 40) => {
  const { data, info } = await s(f).flatten({ background: "#2b2e33" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, c = [0, 1, 2].map((k) => data[k]);
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = (y * W + x) * 3; const d = Math.abs(data[i] - c[0]) + Math.abs(data[i + 1] - c[1]) + Math.abs(data[i + 2] - c[2]); if (d > T) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } }
  return { x0, y0, x1, y1, W, H };
};
if (require.main === module) module.exports(process.argv[2]).then((b) => console.log(process.argv[2], JSON.stringify(b)));
