/* eslint-disable */
// Recipe kept from _incoming/image-sitewide/b-uwell/recolour-g4k.js (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
// G4 Pro KOKO colour set from ONE master (lessons 14 / 20): the night "official" Cosmic Gray front render is a mirror
// image of the real device (G4 logo top-right; UWELL's own front photo has it top-left) -> flop it, mirror the screen UI
// back so its text reads, then move the frame colour to each UWELL colour. Frame colour (Lab median + L spread) is read
// from UWELL's own colour banner files.myuwell.com/uwell/product/caliburn-g4-pro-koko/pc/color-N.webp (same layout
// for all 9 -> same sample patches). Screen and clear pod are never recoloured.
// node recolour-g4k.js <master.png> <outDir> [only-colour-id]
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { masks } = require("./uwell-masks");

const COLOURS = [ // banner index -> site colour id (order printed on the banners)
  [1, "coral-pink"], [2, "light-green"], [3, "glass-blue"], [4, "cosmic-gray"], [5, "crystal-white"],
  [6, "mirror-silver"], [7, "waves-black"], [8, "desert-gold"], [9, "golden-carbon"],
];
const PATCHES = [[1010, 430], [1030, 520], [990, 340]]; // on the front device's frame face, 24x24 each
// polished gold: the front face mirrors the dark screen, so its median reads brown -> use the lit rim of the back device
const RIM = [[2100, 790], [2040, 690]];
const USE_RIM = new Set(["desert-gold", "golden-carbon"]);

// sRGB <-> CIELAB (D65)
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const gam = (c) => { const v = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055; return Math.max(0, Math.min(255, Math.round(v * 255))); };
const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
const fi = (t) => (t ** 3 > 216 / 24389 ? t ** 3 : (116 * t - 16) / (24389 / 27));
function toLab(r, g, b) {
  const R = lin(r), G = lin(g), B = lin(b);
  const X = (0.4124 * R + 0.3576 * G + 0.1805 * B) / 0.95047, Y = 0.2126 * R + 0.7152 * G + 0.0722 * B, Z = (0.0193 * R + 0.1192 * G + 0.9505 * B) / 1.08883;
  const fx = f(X), fy = f(Y), fz = f(Z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}
function toRgb(L, a, b) {
  const fy = (L + 16) / 116, fx = fy + a / 500, fz = fy - b / 200;
  const X = fi(fx) * 0.95047, Y = fi(fy), Z = fi(fz) * 1.08883;
  return [gam(3.2406 * X - 1.5372 * Y - 0.4986 * Z), gam(-0.9689 * X + 1.8758 * Y + 0.0415 * Z), gam(0.0557 * X - 0.204 * Y + 1.057 * Z)];
}
const median = (v) => { const s = [...v].sort((a, b) => a - b); return s[s.length >> 1]; };
const pct = (v, q) => { const s = [...v].sort((a, b) => a - b); return s[Math.floor(q * (s.length - 1))]; };

function boxBlur(src, w, h, r, passes = 3) {
  let a = Float32Array.from(src), b = new Float32Array(w * h);
  for (let k = 0; k < passes; k++) {
    for (let y = 0; y < h; y++) { let s = 0, n = 0;
      for (let x = -r; x < w + r; x++) {
        if (x + r < w && x + r >= 0) { s += a[y * w + x + r]; n++; }
        if (x - r - 1 >= 0 && x - r - 1 < w) { s -= a[y * w + x - r - 1]; n--; }
        if (x >= 0 && x < w) b[y * w + x] = s / n; } }
    for (let x = 0; x < w; x++) { let s = 0, n = 0;
      for (let y = -r; y < h + r; y++) {
        if (y + r < h && y + r >= 0) { s += b[(y + r) * w + x]; n++; }
        if (y - r - 1 >= 0 && y - r - 1 < h) { s -= b[(y - r - 1) * w + x]; n--; }
        if (y >= 0 && y < h) a[y * w + x] = s / n; } }
  }
  return a;
}
// logo box as fractions of the master (measured on the 1200 px copy: x 262-428, y 495-565 of 1200x1607)
const LOGO = { x0: 0.2183, x1: 0.3567, y0: 0.308, y1: 0.3516 };
function fixLogo(buf, W, H) {
  const m = Math.round(0.02 * W);
  const X0 = Math.round(LOGO.x0 * W) - m, X1 = Math.round(LOGO.x1 * W) + m, Y0 = Math.round(LOGO.y0 * H) - m, Y1 = Math.round(LOGO.y1 * H) + m;
  const w = X1 - X0, h = Y1 - Y0, r = Math.max(2, Math.round(0.006 * W));
  const lum = new Float32Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = ((Y0 + y) * W + X0 + x) * 3; lum[y * w + x] = 0.2126 * buf[i] + 0.7152 * buf[i + 1] + 0.0722 * buf[i + 2]; }
  // smooth frame = cubic surface fitted to the non-logo pixels (the frame shades strongly left -> right)
  const terms = (x, y) => { const u = (2 * x) / w - 1, v = (2 * y) / h - 1; return [1, u, v, u * u, u * v, v * v, u * u * u, u * u * v, u * v * v, v * v * v]; };
  const T = terms(0, 0).length;
  const fit = (vals, keep) => {
    const A = Array.from({ length: T }, () => new Float64Array(T + 1));
    for (let y = 0; y < h; y += 1) for (let x = 0; x < w; x += 1) {
      const p = y * w + x; if (!keep[p]) continue;
      const t = terms(x, y);
      for (let i = 0; i < T; i++) { for (let j = 0; j < T; j++) A[i][j] += t[i] * t[j]; A[i][T] += t[i] * vals[p]; }
    }
    for (let i = 0; i < T; i++) { // Gauss-Jordan
      let piv = i; for (let k = i + 1; k < T; k++) if (Math.abs(A[k][i]) > Math.abs(A[piv][i])) piv = k;
      [A[i], A[piv]] = [A[piv], A[i]];
      for (let k = 0; k < T; k++) if (k !== i) { const f = A[k][i] / A[i][i]; for (let j = i; j <= T; j++) A[k][j] -= f * A[i][j]; }
    }
    const co = A.map((row, i) => row[T] / row[i]);
    const out = new Float32Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const t = terms(x, y); let s = 0; for (let i = 0; i < T; i++) s += co[i] * t[i]; out[y * w + x] = s; }
    return out;
  };
  // logo strokes = darker than a local blur (clean on this frame); grown by r so the engraving's bright rim goes too
  const bl = boxBlur(lum, w, h, r * 2);
  const mask = new Float32Array(w * h);
  for (let y = m; y < h - m; y++) for (let x = m; x < w - m; x++) { const p = y * w + x; if (lum[p] < bl[p] - 4) mask[p] = 1; }
  const grown = boxBlur(mask, w, h, Math.max(1, Math.round(r * 0.6)), 1);
  for (let p = 0; p < w * h; p++) grown[p] = grown[p] > 0.01 ? 1 : 0;
  const wide = boxBlur(grown, w, h, r, 1);
  const keep = new Uint8Array(w * h); for (let p = 0; p < w * h; p++) keep[p] = wide[p] > 0.001 ? 0 : 1;
  let lx0 = w, lx1 = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (mask[y * w + x]) { if (x < lx0) lx0 = x; if (x > lx1) lx1 = x; }
  const smooth = [0, 1, 2].map((c) => {
    const v = new Float32Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) v[y * w + x] = buf[((Y0 + y) * W + X0 + x) * 3 + c];
    return fit(v, keep);
  });
  const orig = [0, 1, 2].map((c) => { const v = new Float32Array(w * h); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) v[y * w + x] = buf[((Y0 + y) * W + X0 + x) * 3 + c]; return v; });
  const cx2 = lx0 + lx1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const p = y * w + x, xm = cx2 - x, q = y * w + xm;
    const inOld = grown[p], inNew = xm >= 0 && xm < w ? grown[q] : 0;
    if (!inOld && !inNew) continue;
    for (let c = 0; c < 3; c++) {
      let v = smooth[c][p];
      if (inNew) v += orig[c][q] - smooth[c][q];
      buf[((Y0 + y) * W + X0 + x) * 3 + c] = Math.max(0, Math.min(255, Math.round(v)));
    }
  }
  console.log("logo box", X0, Y0, w, h, "logo x", lx0, lx1);
  if (process.env.LOGO_DEBUG) require("fs").writeFileSync(process.env.LOGO_DEBUG, JSON.stringify({ w, h, mask: Array.from(mask), grown: Array.from(grown) }));
}

async function bannerTarget(n, patches = PATCHES) {
  const file = path.join(__dirname, "official", `caliburn-g4-pro-koko-color-${n}.webp`);
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const L = [], A = [], B = [];
  for (const [cx, cy] of patches)
    for (let y = cy - 12; y < cy + 12; y++)
      for (let x = cx - 12; x < cx + 12; x++) {
        const i = (y * info.width + x) * 3; const [l, a, b] = toLab(data[i], data[i + 1], data[i + 2]);
        L.push(l); A.push(a); B.push(b);
      }
  return { L: median(L), a: median(A), b: median(B), lo: pct(L, 0.1), hi: pct(L, 0.9) };
}

module.exports = { toLab, toRgb, median, pct, boxBlur };
if (require.main === module) (async () => {
  const [masterPath, outDir, only] = process.argv.slice(2);
  fs.mkdirSync(outDir, { recursive: true });
  const flopped = await sharp(masterPath).removeAlpha().flop().png().toBuffer();
  const tmp = path.join(outDir, "_flop.png"); fs.writeFileSync(tmp, flopped);
  const m = await masks(tmp);
  const { W, H, data, screen, frame, box } = m;
  // 1. screen UI back to reading order: mirror inside the screen box where the mirrored source is also screen
  const base = Buffer.from(data);
  const cx2 = box.sx0 + box.sx1;
  for (let y = box.sy0; y <= box.sy1; y++)
    for (let x = box.sx0; x <= box.sx1; x++) {
      const p = y * W + x, q = y * W + (cx2 - x);
      if (screen[p] && screen[q]) for (let c = 0; c < 3; c++) base[p * 3 + c] = data[q * 3 + c];
    }
  // 1b. the engraved "G4 PRO" logo on the frame is mirrored too: split it from the smooth frame (normalised blur
  // inpaint), then add its detail back mirrored about the logo's own centre
  fixLogo(base, W, H);
  // 2. master frame statistics
  const fl = [], fa = [], fb = [];
  const labs = new Float32Array(W * H * 3);
  for (let p = 0; p < W * H; p++) if (frame[p]) {
    const [l, a, b] = toLab(base[p * 3], base[p * 3 + 1], base[p * 3 + 2]);
    labs[p * 3] = l; labs[p * 3 + 1] = a; labs[p * 3 + 2] = b;
    if (l > 25) { fl.push(l); fa.push(a); fb.push(b); }
  }
  const M = { L: median(fl), a: median(fa), b: median(fb), lo: pct(fl, 0.1), hi: pct(fl, 0.9) };
  console.log("master frame", JSON.stringify(M), "screen box", JSON.stringify(box));
  await sharp(base, { raw: { width: W, height: H, channels: 3 } }).png().toFile(path.join(outDir, "master-fixed.png"));
  for (const [n, id] of COLOURS) {
    if (only && only !== id) continue;
    const T = await bannerTarget(n, USE_RIM.has(id) ? RIM : PATCHES);
    // contrast: keep the master's metal shading, scaled toward the target's own spread, never flatter than 0.45
    const s = Math.max(0.45, Math.min(1, Math.min(T.L, 100 - T.L) / Math.min(M.L, 100 - M.L)));
    const out = Buffer.from(base);
    for (let p = 0; p < W * H; p++) if (frame[p]) {
      const l = labs[p * 3], a = labs[p * 3 + 1], b = labs[p * 3 + 2];
      const w = Math.min(1, Math.max(0, (l - 6) / 20)); // darkest edge lines keep their own depth
      const L2 = Math.max(0, Math.min(100, T.L + (l - M.L) * s));
      const k = Math.max(0, Math.min(1.2, L2 / Math.max(1, T.L))); // chroma follows shading
      const rgb = toRgb(L2 * w + l * (1 - w), (T.a * k + (a - M.a)) * w + a * (1 - w), (T.b * k + (b - M.b)) * w + b * (1 - w));
      out[p * 3] = rgb[0]; out[p * 3 + 1] = rgb[1]; out[p * 3 + 2] = rgb[2];
    }
    const file = path.join(outDir, `g4k-${id}.png`);
    await sharp(out, { raw: { width: W, height: H, channels: 3 } }).png().toFile(file);
    console.log(id, "target", JSON.stringify(T), "s", s.toFixed(2), "->", file);
  }
  fs.unlinkSync(tmp);
})();
