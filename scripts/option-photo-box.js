/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// option-photo-box.js — where the device sits inside each option photo, for the desktop colour tiles (owner 13/11, checker
// #1446: in a tile the slim device on its square canvas read as a ~15px sliver). Writes src/data/option-photo-box.json:
// { "<image src>": [top, bottom, left, right, aspect] } — the box of pixels with alpha > 16 as shares of the canvas (0–1,
// 3 decimals) + the canvas's width / height. The product page reads the boxes of ITS colours on the server and the tile scales each photo so the whole
// device fills the tile (src/components/product/DesktopOptionTiles.tsx); a photo missing here falls back to the plain
// whole-photo view, so a stale file is never wrong, only less zoomed.
//
//   node scripts/option-photo-box.js          rebuild the file from every `image: { src: "/…" }` in src/data/products/*.ts
//   node scripts/option-photo-box.js --check  exit 1 when a listed photo has no box (run after adding option photos)
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = path.join(__dirname, "..");
const out = path.join(root, "src", "data", "option-photo-box.json");
const dataDir = path.join(root, "src", "data", "products");

function listedPhotos() {
  const srcs = new Set();
  for (const f of fs.readdirSync(dataDir).filter((x) => x.endsWith(".ts"))) {
    const text = fs.readFileSync(path.join(dataDir, f), "utf8");
    for (const m of text.matchAll(/image: \{ src: "(\/[^"]+)"/g)) srcs.add(m[1]);
  }
  return [...srcs].sort();
}

async function box(file) {
  // A 200px copy is plenty for a box in shares of the canvas (±0.5 %).
  const { data, info } = await sharp(file).resize(200, 200, { fit: "fill" }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let t = info.height, b = -1, l = info.width, r = -1;
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++)
      if (data[(y * info.width + x) * 4 + 3] > 16) {
        if (y < t) t = y;
        if (y > b) b = y;
        if (x < l) l = x;
        if (x > r) r = x;
      }
  if (b < 0) return null;
  const f = (v) => Math.round(v * 1000) / 1000;
  const meta = await sharp(file).metadata();
  return [f(t / info.height), f((b + 1) / info.height), f(l / info.width), f((r + 1) / info.width), f(meta.width / meta.height)];
}

(async () => {
  const photos = listedPhotos();
  if (process.argv.includes("--check")) {
    const have = fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, "utf8")) : {};
    const missing = photos.filter((s) => !have[s] && fs.existsSync(path.join(root, "public", s)));
    console.log(missing.length ? `option-photo-box: ${missing.length} photo(s) without a box — run node scripts/option-photo-box.js\n  ${missing.slice(0, 10).join("\n  ")}` : `option-photo-box: OK (${photos.length} photos)`);
    process.exit(missing.length ? 1 : 0);
  }
  const result = {};
  let skipped = 0;
  for (const src of photos) {
    const file = path.join(root, "public", src);
    if (!fs.existsSync(file)) { skipped++; continue; }
    const b = await box(file);
    if (b) result[src] = b;
  }
  // CRLF like every file in this repo (the eol-check commit hook — HANDOFF §17 "CRLF").
  fs.writeFileSync(out, JSON.stringify(result, null, 0).replace(/\],"/g, '],\r\n"') + "\r\n");
  console.log(`option-photo-box: ${Object.keys(result).length} boxes written · ${skipped} listed photo(s) not on disk`);
})();
