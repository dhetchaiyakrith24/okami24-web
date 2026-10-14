/* eslint-disable */
// Recipe kept from _incoming/image-sitewide/infy/recolour.js (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
// INFY 20K device-only flavour photos from ONE master render (gen/infy-master-1-cut.png — upright, flavour Blueberry).
// Every INFY 20K flavour is the same black device; the retailer/maker art tells flavours apart only by the colour of the
// outline of the white "INFY" letters and by the small flavour name printed under them. So the geometry is copied pixel
// for pixel and only those two things change:
//   print region  = the letters + name box (above the battery screen, inside the body, rims excluded)
//   each pixel    = a·(1,1,1) + w·C   (least squares; C = the master's cyan outline colour) → a·(1,1,1) + w·T
//                   (T = the flavour's outline colour, colours.json from sample.js) — the white core (w≈0) stays white,
//                   anti-aliased cyan/white/black mixes keep their mix
//   name          = the Blueberry name box is refilled with the clean body rows just above it, then the flavour name is
//                   printed in T with Montserrat Bold at the master's own cap height and letter spacing (lesson 11: no AI
//                   lettering); two lines when one line would be wider than the master's name
// Output: out/<id>.png (full size RGBA) · final/<id>.png (device pre-sized to the 840-px product box, lanczos3 + sharpen
// sigma 0.5 — the M Bar 10K standard step) · compare.png (source art device | our photo).
// usage (repo root): node _incoming/image-sitewide/infy/recolour.js [id ...]
const sharp = require("sharp");
const fs = require("fs");
const D = "_incoming/image-sitewide/infy";
const SPACING = +(process.env.SPACING || 0);
const FONT = "_incoming/image-sitewide/fonts/Montserrat-700.ttf";
const FL = JSON.parse(fs.readFileSync(`${D}/flavours.json`, "utf8")); // id -> { name, hex }
fs.mkdirSync(`${D}/out`, { recursive: true });
fs.mkdirSync(`${D}/final`, { recursive: true });
const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

// print region (master pixels, measured: letters 1250–2930, name 3099–3150 x 1553–2056, screen from ~3280)
const RX0 = 1440, RX1 = 2150, RY0 = 1150, RY1 = 3215;
const NAME = { x0: 1530, x1: 2080, y0: 3080, y1: 3172, cap: 52, width: 503, cy: 3124.5 };
const FILL_Y0 = 2960, FILL_Y1 = 3070; // clean body rows between the letters and the name

async function textImage(str, cap) {
  // render big, measure the cap height of "H", scale so the caps match the master
  const big = 400;
  const m = await sharp({ text: { text: `<span foreground="white">H</span>`, fontfile: FONT, font: "Montserrat Bold", dpi: 1200, rgba: true } }).png().toBuffer();
  const hImg = await sharp(m).trim({ threshold: 1 }).metadata();
  const scale = cap / hImg.height;
  // letter spacing ≈ the master's (BLUEBERRY: 9 caps over 503 px at cap 52)
  const t = await sharp({ text: { text: `<span foreground="white" letter_spacing="${Math.round(big * SPACING * 1024)}">${str}</span>`, fontfile: FONT, font: "Montserrat Bold", dpi: 1200, rgba: true } }).png().toBuffer();
  const tr = await sharp(t).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
  const w = Math.round(tr.info.width * scale * 1.07), h = Math.round(tr.info.height * scale);
  return sharp(tr.data).resize(w, h, { kernel: "lanczos3" }).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
}

(async () => {
  const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(FL);
  const { data, info } = await sharp(`${D}/../gen/infy-master-1-cut.png`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const at = (x, y) => (y * W + x) * 4;
  const chroma = (o) => Math.max(data[o], data[o + 1], data[o + 2]) - Math.min(data[o], data[o + 1], data[o + 2]);
  // C = median of strongly saturated letter pixels
  const cv = [];
  for (let y = 1300; y < 2900; y += 3) for (let x = RX0; x < RX1; x += 3) { const o = at(x, y); if (chroma(o) > 120) cv.push([data[o], data[o + 1], data[o + 2]]); }
  const C = [0, 1, 2].map((k) => { const v = cv.map((c) => c[k]).sort((a, b) => a - b); return v[v.length >> 1]; });
  console.log("master outline C", C.join(","), "n", cv.length);
  const uu = 3, uC = C[0] + C[1] + C[2], CC = C[0] ** 2 + C[1] ** 2 + C[2] ** 2, det = uu * CC - uC * uC;
  // name box refilled with clean body: for each x, copy rows FILL_Y0..FILL_Y1 cyclically (the body gradient runs across x)
  const base = Buffer.from(data);
  for (let y = NAME.y0; y <= NAME.y1; y++) for (let x = NAME.x0; x <= NAME.x1; x++) {
    const sy = FILL_Y0 + ((y - NAME.y0) % (FILL_Y1 - FILL_Y0)); const s = at(x, sy), o = at(x, y);
    for (let k = 0; k < 4; k++) base[o + k] = data[s + k];
  }
  const done = [];
  for (const id of ids) {
    const T = FL[id].hex === "MASTER" ? C : hexRgb(FL[id].hex);
    const out = Buffer.from(base);
    for (let y = RY0; y <= RY1; y++) for (let x = RX0; x <= RX1; x++) {
      const o = at(x, y); if (out[o + 3] < 255) continue;
      const p = [out[o], out[o + 1], out[o + 2]];
      const up = p[0] + p[1] + p[2], Cp = C[0] * p[0] + C[1] * p[1] + C[2] * p[2];
      let w = (uu * Cp - uC * up) / det; let a = (CC * up - uC * Cp) / det;
      if (w <= 0.03) continue;
      w = Math.min(1, w); a = Math.max(0, a);
      for (let k = 0; k < 3; k++) out[o + k] = Math.max(0, Math.min(255, Math.round(a + w * T[k])));
    }
    // flavour name — printed in T, lifted toward white when T is dark (checker 30/09: dark blue/purple names on the black
    // body were unreadable at phone size); the outline keeps T
    const lum = 0.299 * T[0] + 0.587 * T[1] + 0.114 * T[2];
    const lift = lum < 120 ? Math.min(0.55, (120 - lum) / 120 + 0.25) : 0;
    const NT = T.map((v) => Math.round(v + (255 - v) * lift));
    const name = FL[id].name.toUpperCase();
    let lines = [name];
    const one = await textImage(name, NAME.cap);
    if (one.info.width > NAME.width * 1.08 && name.includes(" ")) {
      const words = name.split(" "); let best = null;
      for (let i = 1; i < words.length; i++) { const l = [words.slice(0, i).join(" "), words.slice(i).join(" ")]; const d = Math.abs(l[0].length - l[1].length); if (!best || d < best.d) best = { l, d }; }
      lines = best.l;
    }
    const imgs = lines.length === 1 ? [one] : await Promise.all(lines.map((l) => textImage(l, NAME.cap)));
    const gap = Math.round(NAME.cap * 0.55);
    const totalH = imgs.reduce((s2, im) => s2 + NAME.cap, 0) + gap * (imgs.length - 1);
    let top = Math.round(NAME.cy - totalH / 2);
    const cx = (NAME.x0 + NAME.x1) / 2 - 2;
    for (const im of imgs) {
      const tw = im.info.width, th = im.info.height, left = Math.round(cx - tw / 2);
      const baseTop = top + NAME.cap - th; // glyphs without descenders: bottom-align to the cap line
      for (let y = 0; y < th; y++) for (let x = 0; x < tw; x++) {
        const al = im.data[(y * tw + x) * 4 + 3] / 255; if (al <= 0) continue;
        const o = at(left + x, baseTop + y);
        for (let k = 0; k < 3; k++) out[o + k] = Math.round(out[o + k] * (1 - al) + NT[k] * al);
      }
      top += NAME.cap + gap;
    }
    await sharp(out, { raw: { width: W, height: H, channels: 4 } }).png().toFile(`${D}/out/${id}.png`);
    const trimmed = await sharp(out, { raw: { width: W, height: H, channels: 4 } }).trim({ threshold: 1 }).png().toBuffer();
    await sharp(trimmed).resize({ height: 840, kernel: "lanczos3" }).sharpen({ sigma: 0.5 }).png().toFile(`${D}/final/${id}.png`);
    done.push(id);
    console.log(id, FL[id].hex, lines.join(" / "));
  }
})();
