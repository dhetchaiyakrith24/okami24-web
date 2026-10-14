/* eslint-disable */
// Recipe kept from _incoming/image-sitewide/b-uwell/masks.js (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
// Masks for the G4 Pro KOKO front master: background (border-connected flat grey), screen (largest dark component,
// row spans filled), frame (foreground below the pod line, not screen). node masks.js <in.png> <outPrefix> [darkMax=75]
// Writes <outPrefix>-mask.png (R = frame, G = screen, B = background) and prints the screen box + body top.
const sharp = require("sharp");
async function masks(inp, darkMax = 75, edgeGuard = 0, rowFrac = 0) {
  const { data, info } = await sharp(inp).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H;
  const lum = new Float32Array(N), mx = new Uint8Array(N);
  for (let p = 0; p < N; p++) {
    const r = data[p * 3], g = data[p * 3 + 1], b = data[p * 3 + 2];
    lum[p] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    mx[p] = Math.max(r, g, b);
  }
  // background: border-connected, close to the border median
  const ring = [];
  for (let x = 0; x < W; x++) ring.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) ring.push(y * W, y * W + W - 1);
  const med = [0, 1, 2].map((c) => { const v = ring.map((p) => data[p * 3 + c]).sort((a, b) => a - b); return v[v.length >> 1]; });
  const bg = new Uint8Array(N); let st = [];
  const near = (p) => Math.hypot(data[p * 3] - med[0], data[p * 3 + 1] - med[1], data[p * 3 + 2] - med[2]) < 30;
  for (const p of ring) if (!bg[p] && near(p)) { bg[p] = 1; st.push(p); }
  while (st.length) { const p = st.pop(), x = p % W, y = (p - x) / W;
    for (const q of [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, y > 0 ? p - W : -1, y < H - 1 ? p + W : -1])
      if (q >= 0 && !bg[q] && near(q)) { bg[q] = 1; st.push(q); } }
  // screen: largest dark component seeded from the image centre band
  // edgeGuard (fraction of W): dark pixels this close to the background are the silhouette's shading, not screen —
  // without it a dark outline joins the screen to the whole device (G3 Pro KOKO)
  const near2 = new Uint8Array(N);
  if (edgeGuard > 0) {
    const g = Math.max(1, Math.round(edgeGuard * W));
    const rowD = new Uint8Array(N);
    for (let y = 0; y < H; y++) { let last = -1e9; for (let x = 0; x < W; x++) { if (bg[y * W + x]) last = x; if (x - last <= g) rowD[y * W + x] = 1; }
      last = 1e9; for (let x = W - 1; x >= 0; x--) { if (bg[y * W + x]) last = x; if (last - x <= g) rowD[y * W + x] = 1; } }
    for (let x = 0; x < W; x++) { let last = -1e9; for (let y = 0; y < H; y++) { if (bg[y * W + x]) last = y; if (y - last <= g) near2[y * W + x] = 1; }
      last = 1e9; for (let y = H - 1; y >= 0; y--) { if (bg[y * W + x]) last = y; if (last - y <= g) near2[y * W + x] = 1; } }
    for (let p = 0; p < N; p++) near2[p] |= rowD[p];
  }
  const dark = new Uint8Array(N); for (let p = 0; p < N; p++) dark[p] = mx[p] <= darkMax && !bg[p] && !near2[p] ? 1 : 0;
  const comp = new Int32Array(N).fill(-1); let best = -1, bestN = 0, id = 0;
  for (let s = 0; s < N; s++) {
    if (!dark[s] || comp[s] >= 0) continue;
    let n = 0; st = [s]; comp[s] = id;
    while (st.length) { const p = st.pop(); n++; const x = p % W, y = (p - x) / W;
      for (const q of [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, y > 0 ? p - W : -1, y < H - 1 ? p + W : -1])
        if (q >= 0 && dark[q] && comp[q] < 0) { comp[q] = id; st.push(q); } }
    if (n > bestN) { bestN = n; best = id; } id++;
  }
  // rowFrac > 0: drop rows where the dark component is only a thin strip (an outline or a logo row), so a square
  // screen under a metal band (G3 Pro KOKO) does not swallow the band
  if (rowFrac > 0) {
    const cnt = new Int32Array(H); let mxc = 0;
    for (let y = 0; y < H; y++) { for (let x = 0; x < W; x++) if (comp[y * W + x] === best) cnt[y]++; if (cnt[y] > mxc) mxc = cnt[y]; }
    for (let y = 0; y < H; y++) if (cnt[y] < rowFrac * mxc) for (let x = 0; x < W; x++) if (comp[y * W + x] === best) comp[y * W + x] = -2;
  }
  const screen = new Uint8Array(N);
  let sx0 = W, sx1 = 0, sy0 = H, sy1 = 0;
  for (let y = 0; y < H; y++) {
    let a = -1, b = -1;
    for (let x = 0; x < W; x++) if (comp[y * W + x] === best) { if (a < 0) a = x; b = x; }
    if (a < 0) continue;
    for (let x = a; x <= b; x++) screen[y * W + x] = 1;
    if (a < sx0) sx0 = a; if (b > sx1) sx1 = b; if (y < sy0) sy0 = y; sy1 = y;
  }
  // also fill columns (the UI art can cut a row span short at the top/bottom curve)
  for (let x = sx0; x <= sx1; x++) {
    let a = -1, b = -1;
    for (let y = sy0; y <= sy1; y++) if (screen[y * W + x]) { if (a < 0) a = y; b = y; }
    if (a >= 0) for (let y = a; y <= b; y++) screen[y * W + x] = 1;
  }
  // body top = first row where the foreground is wider than 70% of the screen width
  // body top = first row wider than 75% of the screen width (takes the device's top face); the clear pod's foot
  // (rows above the 90% line, inside the pod's columns) stays untouched
  const rowW = (y) => { let n = 0; for (let x = 0; x < W; x++) if (!bg[y * W + x]) n++; return n; };
  let bodyTop = 0, body90 = 0;
  for (let y = 0; y < H; y++) if (rowW(y) > 0.75 * (sx1 - sx0)) { bodyTop = y; break; }
  for (let y = bodyTop; y < H; y++) if (rowW(y) > 0.9 * (sx1 - sx0)) { body90 = y; break; }
  let px0 = W, px1 = 0;
  for (let y = Math.max(0, bodyTop - Math.round(0.06 * H)); y < bodyTop - Math.round(0.04 * H); y++) for (let x = 0; x < W; x++) if (!bg[y * W + x]) { if (x < px0) px0 = x; if (x > px1) px1 = x; }
  const frame = new Uint8Array(N);
  for (let p = 0; p < N; p++) { const x = p % W, y = (p - x) / W;
    frame[p] = !bg[p] && !screen[p] && y >= bodyTop ? 1 : 0; } // the clear pod shows the top face through it, so its foot takes the colour too
  return { W, H, data, bg, screen, frame, box: { sx0, sx1, sy0, sy1 }, bodyTop };
}
module.exports = { masks };
if (require.main === module) (async () => {
  const [inp, pre, dm] = process.argv.slice(2);
  const m = await masks(inp, dm ? +dm : 75, process.argv[5] ? +process.argv[5] : 0, process.argv[6] ? +process.argv[6] : 0);
  const out = Buffer.alloc(m.W * m.H * 3);
  for (let p = 0; p < m.W * m.H; p++) { out[p * 3] = m.frame[p] * 255; out[p * 3 + 1] = m.screen[p] * 255; out[p * 3 + 2] = m.bg[p] * 255; }
  await sharp(out, { raw: { width: m.W, height: m.H, channels: 3 } }).png().toFile(pre + "-mask.png");
  console.log(JSON.stringify(m.box), "bodyTop", m.bodyTop);
})();
