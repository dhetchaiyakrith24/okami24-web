/* eslint-disable */
// Recipe kept from _incoming/image-sitewide/b-voopoo/recolour-g3m.js (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
// VOOPOO ARGUS G3 mini colour set from ONE master (the KOKO / G4 Classic method): the night 01/10 Sky Blue render
// (Higgs Okm/2026-10-01 night - colours/colour-argus-g3-mini-sky-blue.png — same orientation as VOOPOO's own photos:
// ARGUS reads bottom-up on the left, knurled right edge, USB-C slot right), cut by scripts/flatcut.js, then the body
// colour moved (CIELAB) to each colour. Targets = median body colour of the shop's current photo of that colour
// (VOOPOO's own per-colour photos from shop.voopoo.com, 250x500 — right colour, too small for the site). The logo and
// the ring band are tinted versions of the body on VOOPOO's photos, so they move with it; only the white LED slit
// (near-neutral, very bright) is kept. Clear pod and the dark side buttons above the body are untouched.
// node recolour-g3m.js <master-cut.png> <outDir> [id ...]
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { toLab, toRgb, median, pct } = require("./uwell-recolour-g4k");

const SITE = path.resolve(__dirname, "../../../public/assets/products/argus-g3-mini/variants");
const IDS = ["sky-blue", "grass-green", "midnight-black", "space-gray", "moonlight-silver", "scarlet-red", "rose-gold", "lilac-purple", "hot-pink"];

// body sample on a 250x500 VOOPOO photo: right of the logo, below the band, left of the knurl
async function target(id) {
  const { data, info } = await sharp(path.join(SITE, `${id}.webp`)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const L = [], A = [], B = [];
  for (let y = Math.floor(info.height * 0.62); y < info.height * 0.85; y++)
    for (let x = Math.floor(info.width * 0.46); x < info.width * 0.66; x++) {
      const i = (y * info.width + x) * 4; if (data[i + 3] < 250) continue;
      const [l, a, b] = toLab(data[i], data[i + 1], data[i + 2]); L.push(l); A.push(a); B.push(b);
    }
  return { L: median(L), a: median(A), b: median(B) };
}

(async () => {
  const [masterPath, outDir, ...only] = process.argv.slice(2);
  fs.mkdirSync(outDir, { recursive: true });
  const { data, info } = await sharp(masterPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const labs = new Float32Array(W * H * 3);
  for (let p = 0; p < W * H; p++) {
    const [l, a, b] = toLab(data[p * 4], data[p * 4 + 1], data[p * 4 + 2]);
    labs[p * 3] = l; labs[p * 3 + 1] = a; labs[p * 3 + 2] = b;
  }
  // body top = first row (from the top) where most opaque pixels are clearly blue
  let top = 0;
  for (let y = 0; y < H; y++) {
    let n = 0, blue = 0;
    for (let x = 0; x < W; x++) { const p = y * W + x; if (data[p * 4 + 3] < 250) continue; n++; if (labs[p * 3 + 2] < -12) blue++; }
    if (n > 50 && blue / n > 0.6) { top = y; break; }
  }
  const body = new Uint8Array(W * H);
  const fl = [], fa = [], fb = [];
  let kept = 0;
  for (let p = 0; p < W * H; p++) {
    const y = Math.floor(p / W);
    if (data[p * 4 + 3] < 10 || y < top - 0.03 * H) continue;
    const l = labs[p * 3], a = labs[p * 3 + 1], b = labs[p * 3 + 2];
    if (y < top) { if (b < -2) body[p] = 2; continue; } // just above the body: the blue rim glow under the clear pod
    if (y > top + 0.1 * H && l > 90 && Math.hypot(a, b) < 9) { kept++; continue; } // white LED slit (mid-body only)
    body[p] = 1;
    if (l > 25 && b < -12) { fl.push(l); fa.push(a); fb.push(b); }
  }
  const M = { L: median(fl), a: median(fa), b: median(fb), lo: pct(fl, 0.1), hi: pct(fl, 0.9) };
  console.log("master body", JSON.stringify(M), "bodyTop", top, "of", H, "kept bright px", kept);
  for (const id of IDS) {
    if (only.length && !only.includes(id)) continue;
    const T = await target(id);
    const s = Math.max(0.45, Math.min(1, Math.min(T.L, 100 - T.L) / Math.min(M.L, 100 - M.L)));
    // the master's hue wobble (a/b around its blue) is scaled by the target's chroma, so black / grey / silver come
    // out neutral instead of picking up a brown or violet cast; dark pixels (USB-C slot, shadow edge) lose the blue too
    const cf = Math.max(0.1, Math.min(1, Math.hypot(T.a, T.b) / Math.hypot(M.a, M.b)));
    const out = Buffer.from(data);
    const CT = Math.hypot(T.a, T.b);
    if (id !== "sky-blue" || process.env.G3M_RECOLOUR_MASTER) for (let p = 0; p < W * H; p++) if (body[p]) {
      const l = labs[p * 3], a = labs[p * 3 + 1], b = labs[p * 3 + 2];
      if (body[p] === 2) { // glow: keep its lightness, turn its hue to the target's, chroma scaled like the body
        const c = Math.hypot(a, b) * cf, rgb = CT < 1 ? toRgb(l, 0, 0) : toRgb(l, (T.a / CT) * c, (T.b / CT) * c);
        out[p * 4] = rgb[0]; out[p * 4 + 1] = rgb[1]; out[p * 4 + 2] = rgb[2]; continue;
      }
      const w = Math.min(1, Math.max(0, (l - 6) / 20));
      const L2 = Math.max(0, Math.min(100, T.L + (l - M.L) * s));
      const k = Math.max(0, Math.min(1.2, L2 / Math.max(1, T.L)));
      // dark pixels (USB-C slot, shadow edge) keep their chroma but turn to the target's hue — VOOPOO's photos show the
      // slot as a dark shade of the body colour, not the master's navy (checker PR #170)
      const dc = Math.hypot(a, b) * cf, da = CT < 1 ? 0 : (T.a / CT) * dc, db = CT < 1 ? 0 : (T.b / CT) * dc;
      const rgb = toRgb(L2 * w + l * (1 - w), (T.a * k + (a - M.a) * cf) * w + da * (1 - w), (T.b * k + (b - M.b) * cf) * w + db * (1 - w));
      out[p * 4] = rgb[0]; out[p * 4 + 1] = rgb[1]; out[p * 4 + 2] = rgb[2];
    }
    const f = path.join(outDir, `g3m-${id}.png`);
    await sharp(out, { raw: { width: W, height: H, channels: 4 } }).png().toFile(f);
    console.log(id, "target", JSON.stringify(T), "s", s.toFixed(2), "->", f);
  }
})();
