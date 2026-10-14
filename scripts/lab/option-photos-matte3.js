/* eslint-disable */
// Recipe kept from _incoming/option-photos/b4/matte3.js (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
// Known-backdrop matte for an AI studio render (pilot 07/10).
// usage: node matte.js <render.png> <baseY> <out.png>
//  - backdrop colour per row = median of the side strips (handles the floor gradient)
//  - device = everything NOT flood-reached from the borders through backdrop-like pixels (above baseY) → opaque, interior holes filled
//  - device edge pixels reached by the flood: alpha from the colour distance, colour un-mixed from the backdrop
//  - below baseY: darker than the floor = shadow (black, alpha = relative darkness) · brighter = reflection (un-mixed)
//  - output canvas 1000x1000: device height 839 px, top at 80, reflection fades out before the bottom edge
const sharp = require("sharp");
const [src, baseArg, out] = process.argv.slice(2);
const baseY = Number(baseArg);
const FI = process.argv.indexOf("--ft"), FT = FI > 0 ? Number(process.argv[FI + 1]) : 26; // flood threshold (b4 coils: low-contrast smoky pods)
const FLOOR_FADE = process.argv.includes("--floorFade");
// --protect x0,y0,x1,y1[;...]: boxes the backdrop flood may not enter (dark device parts the flood leaked into — Drag S3 pink S5 bezel 07/10)
// --bg x0,y0,x1,y1[;...]: boxes forced to backdrop (dark floor beside the foot the flood could not reach — pink S5 07/10)
const GI = process.argv.indexOf("--bg"), BGB = GI > 0 ? process.argv[GI + 1].split(";").map(b => b.split(",").map(Number)) : [];
const PI = process.argv.indexOf("--protect"), PROT = PI > 0 ? process.argv[PI + 1].split(";").map(b => b.split(",").map(Number)) : [];
(async () => {
  const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const at = (x, y, c) => data[(y * W + x) * 3 + c];
  // --fblur S (b4 coils): flood decisions read a blurred copy, so a grainy paper backdrop (Caliburn G2 render) floods as one surface
  const FBI = process.argv.indexOf("--fblur"), fdata = FBI > 0 ? await sharp(src).removeAlpha().blur(Number(process.argv[FBI + 1])).raw().toBuffer() : data;
  const fat = (x, y, c) => fdata[(y * W + x) * 3 + c];
  // per-row backdrop
  const rowBg = [];
  for (let y = 0; y < H; y++) {
    const v = [[], [], []];
    for (const [a, b] of [[20, 220], [W - 220, W - 20]]) for (let x = a; x < b; x += 2) for (let c = 0; c < 3; c++) v[c].push(fat(x, y, c));
    rowBg.push(v.map(arr => arr.sort((p, q) => p - q)[arr.length >> 1]));
  }
  const bg = [];
  for (let y = 0; y < H; y++) { const s = [0, 0, 0]; let n = 0; for (let k = -15; k <= 15; k++) { const yy = Math.min(H - 1, Math.max(0, y + k)); for (let c = 0; c < 3; c++) s[c] += rowBg[yy][c]; n++; } bg.push(s.map(t => t / n)); }
  const dist = new Float32Array(W * H), lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const B = bg[y]; let s = 0; for (let c = 0; c < 3; c++) { const d = fat(x, y, c) - B[c]; s += d * d; } dist[y * W + x] = Math.sqrt(s); }
  // flood the backdrop from the borders (above the floor line)
  const reach = new Uint8Array(W * H), q = new Int32Array(W * H); let qh = 0, qt = 0;
  // --grow G (b4 coils): a pixel next to a reached one also joins when its colour is within G of that neighbour (and within 48
  // of the row backdrop) — follows a smooth backdrop gradient/vignette that the side-strip median cannot see.
  const GRI = process.argv.indexOf("--grow"), GR = GRI > 0 ? Number(process.argv[GRI + 1]) : 0; let from = -1;
  const near = (i, j) => { let m = 0; for (let c = 0; c < 3; c++) m = Math.max(m, Math.abs(fdata[i * 3 + c] - fdata[j * 3 + c])); return m; };
  const push = (x, y) => { const i = y * W + x; if (reach[i]) return; if (dist[i] > FT && !(GR && from >= 0 && dist[i] < 48 && near(i, from) <= GR)) return; if (PROT.some(([a, b, c, d]) => x >= a && x <= c && y >= b && y <= d)) return; reach[i] = 1; q[qt++] = i; };
  for (let x = 0; x < W; x++) push(x, 0);
  for (const [a, b, c, d] of BGB) for (let y = b; y <= d; y++) for (let x = a; x <= c; x++) { const i = y * W + x; if (!reach[i]) { reach[i] = 1; q[qt++] = i; } }
  for (let y = 0; y < baseY; y++) { push(0, y); push(W - 1, y); }
  while (qh < qt) { const i = q[qh++], x = i % W, y = (i / W) | 0; from = i; if (x > 0) push(x - 1, y); if (x < W - 1) push(x + 1, y); if (y > 0) push(x, y - 1); if (y < baseY - 1) push(x, y + 1); }
  // pass 2: real backdrop map — reached pixels are backdrop; the device span of each row is filled by interpolating the
  // backdrop just left and right of it (handles vignettes / spotlights the side strips cannot see), then blurred
  let bx0 = W, bx1 = 0; for (let y = 0; y < baseY; y++) for (let x = 0; x < W; x++) if (!reach[y * W + x]) { if (x < bx0) bx0 = x; if (x > bx1) bx1 = x; }
  const bgm = new Float32Array(W * H * 3);
  for (let y = 0; y < H; y++) {
    const isBg = (x) => y < baseY ? reach[y * W + x] === 1 : (x < bx0 - 40 || x > bx1 + 40);
    let last = -1;
    for (let x = 0; x <= W; x++) {
      if (x < W && !isBg(x)) continue;
      if (x > last + 1) { // fill gap (last, x)
        for (let g = last + 1; g < x; g++) for (let c = 0; c < 3; c++) {
          const L = last >= 0 ? at(last, y, c) : (x < W ? at(x, y, c) : bg[y][c]);
          const R = x < W ? at(x, y, c) : L; const t = (g - last) / (x - last);
          bgm[(y * W + g) * 3 + c] = L + (R - L) * t;
        }
      }
      if (x < W) for (let c = 0; c < 3; c++) bgm[(y * W + x) * 3 + c] = at(x, y, c);
      last = x;
    }
  }
  const blurred = await sharp(Buffer.from(bgm.map(v => Math.max(0, Math.min(255, v)))), { raw: { width: W, height: H, channels: 3 } }).blur(24).raw().toBuffer();
  for (let y = 0; y < H; y++) { const r = [0, 0, 0]; }
  const BG = (x, y) => [blurred[(y * W + x) * 3], blurred[(y * W + x) * 3 + 1], blurred[(y * W + x) * 3 + 2]];
  const soft = await sharp(src).removeAlpha().blur(1.6).raw().toBuffer();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const B = BG(x, y); let s2 = 0; for (let c = 0; c < 3; c++) { const d = soft[(y * W + x) * 3 + c] - B[c]; s2 += d * d; } dist[y * W + x] = Math.sqrt(s2); }
  // device bbox
  // (columns/rows with a real run of device pixels — a dark unflooded strip at a border of an uneven backdrop, KOKO
  // mirror-silver 07/10, once read as x0 = 5 and pushed the device off centre)
  const colN = new Int32Array(W), rowN = new Int32Array(H);
  for (let y = 0; y < baseY; y++) for (let x = 0; x < W; x++) if (!reach[y * W + x]) { colN[x]++; rowN[y]++; }
  let x0 = W, x1 = 0, y0 = H;
  for (let x = 0; x < W; x++) if (colN[x] > 150 && x > 2 && x < W - 3) { if (x < x0) x0 = x; x1 = x; }
  for (let y = 0; y < baseY; y++) if (rowN[y] > 20 && y > 2) { y0 = y; break; }
  const rgba = Buffer.alloc(W * H * 4);
  const smooth = (e0, e1, v) => { const t = Math.min(1, Math.max(0, (v - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x, o = i * 4, B = BG(x, y), C = [at(x, y, 0), at(x, y, 1), at(x, y, 2)];
    let a, F;
    // unflooded pixels far outside the device columns = a dark border strip of an uneven backdrop, not device
    if (y < baseY && !reach[i] && (x < x0 - 30 || x > x1 + 30)) { a = 0; F = C; }
    else if (y < baseY && !reach[i]) { a = 1; F = C; }
    else if (y < baseY) { a = smooth(12, 44, dist[i]); F = a > 0 ? C.map((v, c) => (v - (1 - a) * B[c]) / a) : C; }
    else {
      const lc = lum(...C), lb = lum(...B);
      const near = x >= bx0 - 120 && x <= bx1 + 120;
      if (!near || dist[i] < 10) { a = 0; F = C; }
      else if (lc < lb) { a = Math.min(1, Math.max(0, (lb - lc) / lb * 1.4)); F = [0, 0, 0]; }
      else { a = smooth(10, 60, dist[i]); F = a > 0 ? C.map((v, c) => (v - (1 - a) * B[c]) / a) : C; }
      // --floorFade (uneven backdrop, e.g. KOKO mirror-silver 07/10): the floor estimate between the side strips is off,
      // which left a wide hard-edged band — keep floor shadow/reflection only under the device, fading out 90 px past it
      if (FLOOR_FADE && a > 0) { const out = Math.max(0, x0 - x, x - x1); a *= 1 - smooth(0, 90, out); }
    }
    for (let c = 0; c < 3; c++) rgba[o + c] = Math.max(0, Math.min(255, Math.round(F[c])));
    rgba[o + 3] = Math.round(a * 255);
  }
  // --device (look-batch/card-tilt.js): the device alone at full render size — floor shadow + reflection dropped at the foot line
  if (process.argv.includes("--device")) {
    for (let y = baseY - 4; y < H; y++) for (let x = 0; x < W; x++) { const o = (y * W + x) * 4 + 3; rgba[o] = y >= baseY ? 0 : Math.round(rgba[o] * (baseY - y) / 5); }
    await sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).trim({ threshold: 0 }).png().toFile(out);
    return console.log(out, { device: { x0, x1, y0, baseY }, full: true });
  }
  // place on the site canvas: device height 839, top 80, centred on the device
  const devH = baseY - y0, s = 839 / devH, cx = (x0 + x1) / 2;
  const full = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).resize({ width: Math.round(W * s) }).raw().toBuffer({ resolveWithObject: true });
  const SW = full.info.width, SH = full.info.height;
  const left = Math.round(500 - cx * s), top = Math.round(80 - y0 * s);
  const canvas = Buffer.alloc(1000 * 1000 * 4);
  const baseOut = Math.round(80 + 839);
  for (let y = 0; y < 1000; y++) for (let x = 0; x < 1000; x++) {
    const sx = x - left, sy = y - top; if (sx < 0 || sy < 0 || sx >= SW || sy >= SH) continue;
    const si = (sy * SW + sx) * 4, o = (y * 1000 + x) * 4;
    let a = full.data[si + 3];
    if (y > baseOut) a = Math.round(a * Math.max(0, 1 - (y - baseOut) / (995 - baseOut)));
    canvas[o] = full.data[si]; canvas[o + 1] = full.data[si + 1]; canvas[o + 2] = full.data[si + 2]; canvas[o + 3] = a;
  }
  await sharp(canvas, { raw: { width: 1000, height: 1000, channels: 4 } }).png().toFile(out);
  console.log(out, { device: { x0, x1, y0, baseY }, scale: s.toFixed(3) });
})();
