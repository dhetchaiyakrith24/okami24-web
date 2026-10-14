/* eslint-disable */
// Recipe kept from _incoming/coil3/b2/podfill.js (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
// Clear pods on a dark backdrop flood as backdrop -> union the matte with rounded-rect pod silhouettes (render colours),
// zero everything outside a keep box, then trim. node podfill.js <render.png> <matte-notrim.png> <out-trim.png> <keep x0,y0,x1,y1> <pods>
// pods = "l,t,r,b,rTop,rBot;..." (render px; shape inset 2 px — the rim highlights outside it stay from the matte)
const s = require("C:/Users/dhetc/Claude-Web-Lab-v3-checkpoint-3.3.3/node_modules/sharp");
const [rp, mp, out, keep, pods] = process.argv.slice(2);
const K = keep.split(",").map(Number), PODS = pods.split(";").map(p => p.split(",").map(Number));
const inside = (x, y, [l, t, r, b, rt, rb]) => {
  l += 2; t += 2; r -= 2; b -= 2; if (x < l || x > r || y < t || y > b) return false;
  const corner = (cx, cy, R) => (x - cx) ** 2 + (y - cy) ** 2 <= R * R;
  if (y < t + rt) { if (x < l + rt) return corner(l + rt, t + rt, rt); if (x > r - rt) return corner(r - rt, t + rt, rt); }
  if (y > b - rb) { if (x < l + rb) return corner(l + rb, b - rb, rb); if (x > r - rb) return corner(r - rb, b - rb, rb); }
  return true;
};
(async () => {
  const R = await s(rp).removeAlpha().raw().toBuffer({ resolveWithObject: true }), W = R.info.width;
  const M = await s(mp).ensureAlpha().raw().toBuffer();
  for (let y = 0; y < R.info.height; y++) for (let x = 0; x < W; x++) {
    const o = (y * W + x) * 4;
    if (x < K[0] || x > K[2] || y < K[1] || y > K[3]) { M[o + 3] = 0; continue; }
    let n = 0; for (const p of PODS) { if (x < p[0] - 1 || x > p[2] + 1 || y < p[1] - 1 || y > p[3] + 1) continue;
      for (let sy = 0; sy < 4; sy++) for (let sx = 0; sx < 4; sx++) if (inside(x + (sx + 0.5) / 4 - 0.5, y + (sy + 0.5) / 4 - 0.5, p)) n++; }
    const a = Math.min(255, Math.round(n / 16 * 255));
    if (a > M[o + 3]) { // inside a pod silhouette: render colour, not the backdrop-unmixed matte colour
      const i = (y * W + x) * 3; for (let c = 0; c < 3; c++) M[o + c] = R.data[i + c]; M[o + 3] = a; }
  }
  const img = s(M, { raw: { width: W, height: R.info.height, channels: 4 } }); // --notrim: keep the render frame (zoom checks)
  await (process.argv.includes("--notrim") ? img : img.trim({ threshold: 0 })).png().toFile(out);
  console.log(out);
})();
