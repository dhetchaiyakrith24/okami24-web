/* eslint-disable */
// Recipe kept from _incoming/pilot-mbar10k/recolour.js (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
// Device-only flavour photos for M Bar 10K from ONE master render (out/master-m1.png — upright, clear cap, card colours).
// Every flavour differs only in the colour gradient at the base, so the geometry is copied pixel for pixel and only the
// base colour is moved: per relative height h of the device, the master's strip colour M(h) is moved to the flavour's
// strip colour T(h), measured the same way on the flavour's device in its owner-passed box+device render
// (refs-device/<id>.png) and taken relative to that device's plain body (so the master keeps its own body tone).
// Colour is moved in CIELAB:
//   projection (rows where the master is coloured): f = how much of M's chroma this pixel carries (neutral window ≈ 0,
//   body ≈ 1, shaded edge ≈ 0.5) → pixel += f·(T − M)
//   additive (rows where the master is still black but the flavour already coloured): pixel += w·(T − M), w = body-likeness.
// Output: out/flavour/<id>.png (flat #E9E9EC, 4096²) + fid/<id>.json (ΔE of the result's strip vs T).
// usage (repo root): node _incoming/pilot-mbar10k/recolour.js [id ...]
const sharp = require("sharp"); const fs = require("fs");
const D = "_incoming/pilot-mbar10k";
// master-m1-tone = master-m1 with a 1.15 tone curve on the device (body median 75 → 63, the live card is 65)
const MASTER = `${D}/out/master-m1-tone.png`;
fs.mkdirSync(`${D}/out/flavour`, { recursive: true }); fs.mkdirSync(`${D}/fid`, { recursive: true });

const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const gam = (c) => { const v = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055; return Math.max(0, Math.min(255, Math.round(v * 255))); };
const fL = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
const fi = (t) => (t ** 3 > 216 / 24389 ? t ** 3 : (116 * t - 16) / (24389 / 27));
function lab(r, g, b) {
  const R = lin(r), G = lin(g), B = lin(b);
  const X = (0.4124 * R + 0.3576 * G + 0.1805 * B) / 0.95047, Y = 0.2126 * R + 0.7152 * G + 0.0722 * B, Z = (0.0193 * R + 0.1192 * G + 0.9505 * B) / 1.08883;
  const fx = fL(X), fy = fL(Y), fz = fL(Z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}
function rgb(L, a, b) {
  const fy = (L + 16) / 116, fx = fy + a / 500, fz = fy - b / 200;
  const X = fi(fx) * 0.95047, Y = fi(fy), Z = fi(fz) * 1.08883;
  return [gam(3.2406 * X - 1.5372 * Y - 0.4986 * Z), gam(-0.9689 * X + 1.8758 * Y + 0.0415 * Z), gam(0.0557 * X - 0.204 * Y + 1.057 * Z)];
}
const BG = [0xe9, 0xe9, 0xec];
const isBg = (d, o) => Math.abs(d[o] - BG[0]) + Math.abs(d[o + 1] - BG[1]) + Math.abs(d[o + 2] - BG[2]) < 45;

// device bbox = rows/cols holding non-background pixels (the flat background is uniform)
function bbox(d, W, H, C) {
  let x0 = W, x1 = 0, y0 = H, y1 = 0;
  for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (!isBg(d, (y * W + x) * C)) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  return { x0, x1, y0, y1 };
}
// strip profile: per relative height (N bins over h 0.45..1), median Lab of x 18–28 % of the body width
const N = 220, H0 = 0.45;
function profile(d, W, H, C, bb) {
  const bw = bb.x1 - bb.x0, bh = bb.y1 - bb.y0;
  const xs = Math.round(bb.x0 + bw * 0.18), xe = Math.round(bb.x0 + bw * 0.28);
  const out = [];
  for (let i = 0; i < N; i++) {
    const ya = Math.round(bb.y0 + bh * (H0 + ((1 - H0) * i) / N)), yb = Math.max(ya + 1, Math.round(bb.y0 + bh * (H0 + ((1 - H0) * (i + 1)) / N)));
    const px = [];
    for (let y = ya; y < Math.min(yb, bb.y1 - 2); y++) for (let x = xs; x < xe; x++) { const o = (y * W + x) * C; if (!isBg(d, o)) px.push(lab(d[o], d[o + 1], d[o + 2])); }
    if (!px.length) { out.push(out[out.length - 1] || [20, 0, 0]); continue; }
    px.sort((p, q) => p[0] - q[0]);
    const m = px[px.length >> 1];
    out.push([0, 1, 2].map((c) => px.reduce((s, p) => s + p[c], 0) / px.length * 0 + m[c]));
  }
  // light smoothing
  return out.map((_, i) => { const a = out.slice(Math.max(0, i - 3), i + 4); return [0, 1, 2].map((c) => a.reduce((s, p) => s + p[c], 0) / a.length); });
}
const dE = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);

(async () => {
  const m = await sharp(MASTER).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = m.info.width, H = m.info.height, C = 3;
  const mbb = bbox(m.data, W, H, C);
  const M = profile(m.data, W, H, C, mbb);
  const ids = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(`${D}/refs-device`).map((f) => f.replace(".png", ""));
  for (const id of ids) {
    const r = await sharp(`${D}/refs-device/${id}.png`).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const rbb = bbox(r.data, r.info.width, r.info.height, 3);
    const T0 = profile(r.data, r.info.width, r.info.height, 3, rbb);
    // Only the colour of the gradient RELATIVE to the plain body moves across: the reference renders are lit brighter
    // than the master, so their body is lighter — matching it absolutely paints a light band on the master's body.
    const avg = (P) => [0, 1, 2].map((c) => P.slice(0, 20).reduce((s, p) => s + p[c], 0) / 20);
    const mb = avg(M), tb = avg(T0);
    const T = T0.map((t) => [0, 1, 2].map((c) => mb[c] + t[c] - tb[c]));
    const out = Buffer.from(m.data);
    const bh = mbb.y1 - mbb.y0;
    for (let y = Math.round(mbb.y0 + bh * H0); y <= mbb.y1; y++) {
      const h = (y - mbb.y0) / bh; const i = Math.min(N - 1, Math.max(0, Math.floor(((h - H0) / (1 - H0)) * N)));
      // fade the effect in over the first bins so nothing happens abruptly at h = H0
      const ramp = Math.min(1, i / 12);
      const Mi = M[i], Ti = T[i]; const cm = Math.hypot(Mi[1], Mi[2]);
      const alpha = Math.max(0, Math.min(1, (cm - 2) / 4));
      for (let x = mbb.x0; x <= mbb.x1; x++) {
        const o = (y * W + x) * C; if (isBg(m.data, o)) continue;
        const p = lab(m.data[o], m.data[o + 1], m.data[o + 2]);
        let f = 0;
        if (cm > 0.5) f = Math.max(0, Math.min(1.3, (p[1] * Mi[1] + p[2] * Mi[2]) / (cm * cm)));
        const w = Math.max(0, 1 - Math.abs(p[0] - Mi[0]) / 18);
        const k = ramp * (alpha * f + (1 - alpha) * w);
        const q = rgb(p[0] + k * (Ti[0] - Mi[0]), p[1] + k * (Ti[1] - Mi[1]), p[2] + k * (Ti[2] - Mi[2]));
        out[o] = q[0]; out[o + 1] = q[1]; out[o + 2] = q[2];
      }
    }
    const file = `${D}/out/flavour/${id}.png`;
    await sharp(out, { raw: { width: W, height: H, channels: C } }).png().toFile(file);
    // fidelity: re-measure the result's strip and compare with the flavour's own device relative to its body (h ≥ 0.6)
    const R = profile(out, W, H, C, mbb);
    let max = 0, sum = 0, n = 0;
    for (let i = 0; i < N; i++) { const h = H0 + ((1 - H0) * i) / N; if (h < 0.6 || h > 0.97) continue; const e = dE(R[i], T[i]); max = Math.max(max, e); sum += e; n++; }
    const res = { id, master: MASTER, colourRef: `${D}/refs-device/${id}.png`, deltaE_strip_h60_97: { max: +max.toFixed(1), mean: +(sum / n).toFixed(1) }, bottom_T: T[N - 8].map((v) => +v.toFixed(1)), bottom_result: R[N - 8].map((v) => +v.toFixed(1)) };
    fs.writeFileSync(`${D}/fid/${id}.json`, JSON.stringify(res, null, 1));
    console.log(id, "ΔE max", res.deltaE_strip_h60_97.max, "mean", res.deltaE_strip_h60_97.mean);
  }
})();
