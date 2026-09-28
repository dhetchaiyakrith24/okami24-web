/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// OKami24 — does an AI remake still show the SAME product? (IMAGE_SPEC §0 item 7 · §7 "ตรวจรูป AI", owner 2026-09-28)
//
//   node scripts/ai-fidelity-sheet.js <reference> <candidate> <out.png> [--json out.json]
//
// <reference> = our real photo of that exact option (same view as the candidate) · <candidate> = the Higgsfield file.
// Both are cut to the product (alpha >= 128, or colour distance from the corner colour on an opaque file), the
// candidate is scaled to the reference product's height and centred on it, then:
//   shape  — IoU of the two silhouettes (1 = identical outline). Catches a changed body, pod, mouthpiece, missing part.
//   colour — mean CIE-Lab colour of an 4 x 8 grid of cells that are inside both products; deltaE (CIE76) per cell.
//            Catches a body colour that drifted from the real flavour colour.
// The sheet shows: reference | candidate | 50% overlay | reference outline (red) drawn over the candidate, all at
// the same scale, for the human pass over logo, every letter, screen/lights, buttons, air slots (the numbers cannot
// read text). The script judges shape and colour only; it never decides "same product" on its own.
// Thresholds are the first proposal (round "image-fix" 28/09), to be tuned on the first owner-reviewed product.
const sharp = require("sharp");
const fs = require("fs");

const [refPath, candPath, outPath] = process.argv.slice(2);
const jsonAt = process.argv.indexOf("--json");
const jsonPath = jsonAt > 0 ? process.argv[jsonAt + 1] : null;
if (!refPath || !candPath || !outPath) { console.error("usage: node scripts/ai-fidelity-sheet.js <reference> <candidate> <out.png> [--json out.json]"); process.exit(2); }
const IOU_MIN = 0.95, DE_MAX = 6, GRID_X = 4, GRID_Y = 8, H = 900, BG = [17, 17, 19];

async function cut(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, Hh = info.height, px = (i) => [data[i * 4], data[i * 4 + 1], data[i * 4 + 2], data[i * 4 + 3]];
  const transparent = data.some((v, i) => i % 4 === 3 && v < 250);
  const corner = px(0);
  const inside = (i) => { const p = px(i); if (transparent) return p[3] >= 128; return Math.hypot(p[0] - corner[0], p[1] - corner[1], p[2] - corner[2]) > 30; };
  let x0 = W, y0 = Hh, x1 = -1, y1 = -1;
  for (let y = 0; y < Hh; y++) for (let x = 0; x < W; x++) if (inside(y * W + x)) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  if (x1 < 0) throw new Error(`no product found in ${file}`);
  const w = x1 - x0 + 1, h = y1 - y0 + 1, rgba = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const s = (y0 + y) * W + x0 + x, d = (y * w + x) * 4, p = px(s);
    rgba[d] = p[0]; rgba[d + 1] = p[1]; rgba[d + 2] = p[2]; rgba[d + 3] = inside(s) ? 255 : 0;
  }
  return { rgba, w, h };
}

// one product on an H-tall panel, product height = 90% of H, centred; width from the reference aspect
async function panel(c, panelW) {
  const ph = Math.round(H * 0.9), pw = Math.max(1, Math.round((c.w * ph) / c.h));
  const img = await sharp(c.rgba, { raw: { width: c.w, height: c.h, channels: 4 } }).resize(pw, ph, { fit: "fill", kernel: "lanczos3" }).raw().toBuffer();
  const out = Buffer.alloc(panelW * H * 4);
  const ox = Math.round((panelW - pw) / 2), oy = Math.round((H - ph) / 2);
  for (let y = 0; y < ph; y++) for (let x = 0; x < pw; x++) {
    const tx = ox + x, ty = oy + y; if (tx < 0 || tx >= panelW) continue;
    const s = (y * pw + x) * 4, d = (ty * panelW + tx) * 4; img.copy(out, d, s, s + 4);
  }
  return out;
}

const toLab = (r, g, b) => {
  const f = (v) => { v /= 255; return v > 0.04045 ? ((v + 0.055) / 1.055) ** 2.4 : v / 12.92; };
  const R = f(r), G = f(g), B = f(b);
  const X = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047, Y = R * 0.2126 + G * 0.7152 + B * 0.0722, Z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883;
  const t = (v) => (v > 0.008856 ? Math.cbrt(v) : 7.787 * v + 16 / 116);
  return [116 * t(Y) - 16, 500 * (t(X) - t(Y)), 200 * (t(Y) - t(Z))];
};

(async () => {
  const ref = await cut(refPath), cand = await cut(candPath);
  const PW = Math.round((ref.w * H * 0.9) / ref.h) + 80;
  const A = await panel(ref, PW), B = await panel(cand, PW);
  let inter = 0, uni = 0;
  for (let i = 0; i < PW * H; i++) { const a = A[i * 4 + 3] >= 128, b = B[i * 4 + 3] >= 128; if (a && b) inter++; if (a || b) uni++; }
  const iou = uni ? inter / uni : 0;
  // colour grid over the reference product box
  let bx0 = PW, by0 = H, bx1 = -1, by1 = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < PW; x++) if (A[(y * PW + x) * 4 + 3] >= 128) { if (x < bx0) bx0 = x; if (x > bx1) bx1 = x; if (y < by0) by0 = y; if (y > by1) by1 = y; }
  const cells = [];
  for (let gy = 0; gy < GRID_Y; gy++) for (let gx = 0; gx < GRID_X; gx++) {
    const cx0 = bx0 + Math.floor(((bx1 - bx0) * gx) / GRID_X), cx1 = bx0 + Math.floor(((bx1 - bx0) * (gx + 1)) / GRID_X);
    const cy0 = by0 + Math.floor(((by1 - by0) * gy) / GRID_Y), cy1 = by0 + Math.floor(((by1 - by0) * (gy + 1)) / GRID_Y);
    const sa = [0, 0, 0], sb = [0, 0, 0]; let n = 0, tot = 0;
    for (let y = cy0; y < cy1; y++) for (let x = cx0; x < cx1; x++) {
      tot++; const i = (y * PW + x) * 4; if (A[i + 3] < 128 || B[i + 3] < 128) continue;
      for (let c = 0; c < 3; c++) { sa[c] += A[i + c]; sb[c] += B[i + c]; } n++;
    }
    if (!tot || n / tot < 0.8) continue; // edge cells mix background — skip
    const la = toLab(sa[0] / n, sa[1] / n, sa[2] / n), lb = toLab(sb[0] / n, sb[1] / n, sb[2] / n);
    cells.push({ gx, gy, dE: Math.round(Math.hypot(la[0] - lb[0], la[1] - lb[1], la[2] - lb[2]) * 10) / 10 });
  }
  const dEs = cells.map((c) => c.dE).sort((a, b) => a - b);
  const maxDE = dEs.length ? dEs[dEs.length - 1] : null, medDE = dEs.length ? dEs[Math.floor(dEs.length / 2)] : null;

  // sheet: ref | cand | overlay | outline-over-cand, on the site's dark theme colour
  const flat = (buf) => { const o = Buffer.alloc(PW * H * 3); for (let i = 0; i < PW * H; i++) { const a = buf[i * 4 + 3] / 255; for (let c = 0; c < 3; c++) o[i * 3 + c] = Math.round(buf[i * 4 + c] * a + BG[c] * (1 - a)); } return o; };
  const fa = flat(A), fb = flat(B), ov = Buffer.alloc(PW * H * 3), ol = Buffer.from(fb);
  for (let i = 0; i < PW * H * 3; i++) ov[i] = Math.round((fa[i] + fb[i]) / 2);
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < PW - 1; x++) {
    const i = y * PW + x, m = (j) => A[j * 4 + 3] >= 128;
    if (m(i) && (!m(i - 1) || !m(i + 1) || !m(i - PW) || !m(i + PW))) for (const j of [i, i + 1, i + PW]) { ol[j * 3] = 255; ol[j * 3 + 1] = 40; ol[j * 3 + 2] = 40; }
  }
  const gap = 16, W = PW * 4 + gap * 3;
  const tiles = [fa, fb, ov, ol].map((b, k) => ({ input: b, raw: { width: PW, height: H, channels: 3 }, left: k * (PW + gap), top: 0 }));
  await sharp({ create: { width: W, height: H, channels: 3, background: { r: 60, g: 60, b: 66 } } }).composite(tiles).png().toFile(outPath);

  const pass = iou >= IOU_MIN && maxDE !== null && maxDE <= DE_MAX;
  const result = { reference: refPath, candidate: candPath, sheet: outPath, iou: Math.round(iou * 1000) / 1000, colourCells: cells.length, medianDeltaE: medDE, maxDeltaE: maxDE, thresholds: { IOU_MIN, DE_MAX }, numbers: pass ? "PASS" : "FAIL", humanPass: "logo · every letter · screen/lights · buttons · air slots · pod/mouthpiece colour · nothing added or missing" };
  if (jsonPath) fs.writeFileSync(jsonPath, JSON.stringify({ ...result, cells }, null, 1));
  console.log(`shape IoU ${result.iou} (min ${IOU_MIN}) · colour dE median ${medDE} max ${maxDE} (max ${DE_MAX}) over ${cells.length} cells · sheet ${outPath}`);
  console.log(`numbers ${result.numbers} — then the human pass: ${result.humanPass}`);
  if (!pass) process.exitCode = 1;
})().catch((e) => { console.error(e.message); process.exit(2); });
