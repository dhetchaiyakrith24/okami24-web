/* eslint-disable */
// Recipe kept from _incoming/sitewide-template/2/2dfix/composite.js (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
// Letter gate fallback (LESSONS พ12): where the AI upscale changed letters, put VOOPOO's own pixels back (Lanczos to the
// same size) inside a feathered box; everywhere else keep the AI file. Boxes = fractions of the image, read off pv/cmp-*.png.
// checker #259: the AI also redrew non-letter surface detail (DRAG 6 tank glass engraving, S3 body emboss) → those
// areas get VOOPOO's pixels too (owner eye: real detail, not invented).
// usage (from this folder): node composite.js  → up/<name>-fix.png
const sharp = require("sharp");
const PUB = "../../../../public/assets/products";
const PV = "..";
const JOBS = {
  "x3-cover": { orig: `${PV}/posters/drag-x3/26-dragx3.webp`, boxes: [[0.14, 0.45, 0.09, 0.33], [0.64, 0.24, 0.14, 0.47]] },
  "s3-cover": { orig: `${PUB}/drag-s3/story-cover.webp`, boxes: [[0.38, 0.885, 0.245, 0.09], [0.4, 0.44, 0.21, 0.37], [0.54, 0.43, 0.09, 0.17]] },
  "s3-battery": { orig: `${PUB}/drag-s3/story-battery.webp`, boxes: [[0.68, 0.14, 0.18, 0.68]] },
  "d6-battery": { orig: `${PV}/posters/drag-6/32-4400.webp`, boxes: [[0.66, 0.22, 0.14, 0.73]] },
  "d6-screen": { orig: `${PUB}/drag-6/story-screen.webp`, boxes: [[0.055, 0.12, 0.39, 0.64], [0.615, 0.28, 0.24, 0.2]] },
  "d6-control": { orig: `${PV}/posters/drag-6/38-onepage-2.webp`, boxes: [[0.55, 0.19, 0.055, 0.56], [0.765, 0.54, 0.09, 0.32]] },
  "d6-tank": { orig: `${PV}/posters/drag-6/36-onepage-3.webp`, boxes: [[0.455, 0.34, 0.14, 0.1], [0.14, 0.4, 0.13, 0.25], [0.46, 0.4, 0.13, 0.25], [0.765, 0.42, 0.125, 0.23]] },
};
(async () => {
  for (const [name, { orig, boxes }] of Object.entries(JOBS)) {
    const ai = `up/${name}.png`;
    const { width: W, height: H } = await sharp(ai).metadata();
    const base = await sharp(orig).resize(W, H, { fit: "fill", kernel: "lanczos3" }).removeAlpha().raw().toBuffer();
    const F = Math.round(Math.min(W, H) * 0.012); // feather
    const rects = boxes.map(([x, y, w, h]) => `<rect x="${Math.round(x * W)}" y="${Math.round(y * H)}" width="${Math.round(w * W)}" height="${Math.round(h * H)}" fill="white"/>`).join("");
    const mask = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="100%" height="100%" fill="black"/>${rects}</svg>`))
      .blur(F).extractChannel(0).raw().toBuffer();
    const a = await sharp(ai).removeAlpha().raw().toBuffer();
    const out = Buffer.alloc(W * H * 3);
    for (let i = 0; i < W * H; i++) { const t = mask[i] / 255; for (let c = 0; c < 3; c++) out[i * 3 + c] = Math.round(a[i * 3 + c] * (1 - t) + base[i * 3 + c] * t); }
    await sharp(out, { raw: { width: W, height: H, channels: 3 } }).png().toFile(`up/${name}-fix.png`);
    console.log(`up/${name}-fix.png`, `${W}x${H}`, boxes.length, "box(es)");
  }
})();
