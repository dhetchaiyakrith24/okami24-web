/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// node flatcut.js in.png out.png [t0=6] [t1=42]
// Cut a product off a FLAT studio background (the Higgsfield renders use #E9E9EC): background = pixels connected to
// the image border whose colour is within t1 of the border colour; alpha ramps from 0 (<= t0) to 255 (>= t1), and edge
// colours are un-mixed from the background so no grey rim shows on the dark site theme. Interior pixels that happen to
// be grey (highlights on a clear shell) are never touched — only the border-connected region is keyed.
const sharp = require("sharp");
(async () => {
  const [inp, out, a0, a1] = process.argv.slice(2);
  const t0 = +(a0 || 6), t1 = +(a1 || 42);
  const { data, info } = await sharp(inp).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H;
  // border colour = median of the outer ring
  const ring = [];
  for (let x = 0; x < W; x++) { ring.push(x, (H - 1) * W + x); }
  for (let y = 0; y < H; y++) { ring.push(y * W, y * W + W - 1); }
  const med = [0, 1, 2].map((c) => { const v = ring.map((p) => data[p * 3 + c]).sort((a, b) => a - b); return v[v.length >> 1]; });
  const dist = new Float32Array(N);
  for (let p = 0; p < N; p++) dist[p] = Math.hypot(data[p * 3] - med[0], data[p * 3 + 1] - med[1], data[p * 3 + 2] - med[2]);
  const bg = new Uint8Array(N), stack = [];
  for (const p of ring) if (!bg[p] && dist[p] < t1) { bg[p] = 1; stack.push(p); }
  while (stack.length) {
    const p = stack.pop(), x = p % W, y = (p - x) / W;
    for (const q of [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, y > 0 ? p - W : -1, y < H - 1 ? p + W : -1]) {
      if (q >= 0 && !bg[q] && dist[q] < t1) { bg[q] = 1; stack.push(q); }
    }
  }
  const outBuf = Buffer.alloc(N * 4);
  for (let p = 0; p < N; p++) {
    let a = 255;
    if (bg[p]) a = dist[p] <= t0 ? 0 : Math.round(((dist[p] - t0) / (t1 - t0)) * 255);
    const af = a / 255;
    for (let c = 0; c < 3; c++) {
      const v = af > 0 && af < 1 ? (data[p * 3 + c] - (1 - af) * med[c]) / af : data[p * 3 + c];
      outBuf[p * 4 + c] = Math.max(0, Math.min(255, Math.round(v)));
    }
    outBuf[p * 4 + 3] = a;
  }
  // 2026-09-29 despeckle: faint background noise left isolated pixels at alpha 1–31 near the frame edge; the image
  // script trims to the outermost non-transparent pixel, so those specks shrank the product 17–35% on the page
  // (M Bar 10K Pink Berry 697 px instead of 840). Keep only what is connected to the product (the un-keyed pixels).
  const keep = new Uint8Array(N), st = [];
  for (let p = 0; p < N; p++) if (!bg[p]) { keep[p] = 1; st.push(p); }
  while (st.length) {
    const p = st.pop(), x = p % W, y = (p - x) / W;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const q = ny * W + nx; if (!keep[q] && outBuf[q * 4 + 3] > 0) { keep[q] = 1; st.push(q); }
    }
  }
  let dropped = 0;
  for (let p = 0; p < N; p++) if (!keep[p] && outBuf[p * 4 + 3] > 0) { outBuf[p * 4 + 3] = 0; dropped++; }
  if (dropped) console.log("despeckle: dropped", dropped, "isolated px");
  await sharp(outBuf, { raw: { width: W, height: H, channels: 4 } }).png().toFile(out);
  console.log("cut", out, "bg", med.join(","), "keyed", bg.reduce((s, v) => s + v, 0), "of", N);
})();
