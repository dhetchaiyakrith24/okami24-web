/* eslint-disable */
// Recipe kept from _incoming/muro-big/align.js (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
// Fit an AI re-render onto the original cut: map the AI box's bbox onto the input's bbox (per-axis scale), output the
// 680x980 frame with the ORIGINAL alpha (cut hexagon, Lanczos 2x). Prints the rim count (pixels inside the alpha that
// look like backdrop = misalignment). usage: node align.js <flavour> <ai.png> <out.png>
const s = require("C:/Users/dhetc/Claude-Web-Lab-v3-checkpoint-3.3.3/node_modules/sharp");
const bbox = require("./muro-bbox.js");
const [fl, ai, out] = process.argv.slice(2);
const W = 694, H = 1000, K = W / 1020; // 2.04x of the 340x490 cut: long side 1000 = the sharpness-gate canvas floor
(async () => {
  const bi = await bbox(require("fs").existsSync(`in/${fl}.png`) ? `in/${fl}.png` : `in/${fl}.jpg`), ba = await bbox(ai);
  const tx0 = bi.x0 * K, ty0 = bi.y0 * K, tw = (bi.x1 - bi.x0 + 1) * K, th = (bi.y1 - bi.y0 + 1) * K;
  const sx = tw / (ba.x1 - ba.x0 + 1), sy = th / (ba.y1 - ba.y0 + 1);
  const RW = Math.round(ba.W * sx), RH = Math.round(ba.H * sy);
  const big = await s(ai).resize(RW, RH, { kernel: "lanczos3", fit: "fill" }).removeAlpha().png().toBuffer();
  const ox = Math.round(ba.x0 * sx - tx0), oy = Math.round(ba.y0 * sy - ty0);
  // place on a 680x980 backdrop canvas at -ox,-oy
  const ext = { left: Math.max(0, ox), top: Math.max(0, oy) };
  const crop = await s(big).extract({ left: ext.left, top: ext.top, width: Math.min(W, RW - ext.left), height: Math.min(H, RH - ext.top) }).png().toBuffer();
  const rgb = await s({ create: { width: W, height: H, channels: 3, background: "#2b2e33" } }).composite([{ input: crop, left: Math.max(0, -ox), top: Math.max(0, -oy) }]).png().toBuffer().then((b) => s(b).removeAlpha().raw().toBuffer());
  const a = await s(`../../public/assets/products/muro-3ml/variants/${fl}-cut.webp`).resize(W, H, { kernel: "lanczos3" }).ensureAlpha().raw().toBuffer();
  const o = Buffer.alloc(W * H * 4); let rim = 0;
  for (let i = 0; i < W * H; i++) {
    const r = rgb[i * 3], g = rgb[i * 3 + 1], b = rgb[i * 3 + 2];
    o[i * 4] = r; o[i * 4 + 1] = g; o[i * 4 + 2] = b; o[i * 4 + 3] = a[i * 4 + 3];
    if (a[i * 4 + 3] > 200 && Math.abs(r - 43) + Math.abs(g - 46) + Math.abs(b - 51) < 25) rim++;
  }
  await s(o, { raw: { width: W, height: H, channels: 4 } }).png().toFile(out);
  console.log(out, `scale ${sx.toFixed(4)} ${sy.toFixed(4)} off ${ox},${oy} rim ${rim}`);
})();
