/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
/**
 * OKami24 — build-lineup-grid: composes an "all flavours/colours" lineup onto a SQUARE canvas as a
 * grid, for families with more options than a single row can carry legibly.
 *
 *   node scripts/build-lineup-grid.js --src <dir> --out <file> --cols 5 [--canvas 1600] [--ids a,b,c]
 *
 * Why a grid and not the single row used by `_incoming/qc/build-lineup.js`: the product hero frame
 * is a SQUARE (`aspect-square` in ProductHero.tsx) and the catalogue card is 4:5, so a wide strip
 * wastes most of the frame — a 3.85:1 row inside a 286px mobile frame renders each device ~32px
 * wide. Designer direction 2026-09-06: square canvas, at most 3 rows, pick a column count that
 * divides the option count evenly (15 → 5×3, 18 → 6×3), 4% outer margin, 12%/10% gaps.
 *
 * The rule that matters most for how this looks: ONE scale factor is applied to every piece, derived
 * from the largest piece in the set. Scaling each image to fill its own cell would make identically
 * sized products look different sizes, because a tilted product has a different bounding box per
 * shot. Nothing is ever upscaled past +5% (IMAGE_SPEC §2) — if the set is too small for the grid,
 * the pieces stay small and the report says so, rather than the script inventing pixels.
 */
const sharp = require("sharp");
const fs = require("node:fs");
const path = require("node:path");

const MAX_UPSCALE = 1.05;
const WEBP_QUALITY = 82; // floor, never lowered — IMAGE_SPEC §1–§2
const OUTER_MARGIN = 0.04; // designer 2026-09-06: 4%, not the §3 8% used for single-product shots
const GAP_X = 0.12; // of one cell's product width
const GAP_Y = 0.1; // of one cell's product height
const MAX_ROWS = 3; // designer ceiling: a 4th row puts a tall product under ~40px on a 390px phone
const MAX_COLS = 6;

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const srcDir = arg("src");
const outFile = arg("out");
const cols = Number(arg("cols"));
const canvasSize = Number(arg("canvas", "1600"));
const align = arg("align", "center"); // center | bottom
const idsArg = arg("ids");

if (!srcDir || !outFile || !cols) {
  console.error("usage: node scripts/build-lineup-grid.js --src <dir> --out <file> --cols <n> [--canvas 1600] [--align center|bottom] [--ids a,b,c]");
  process.exit(2);
}

/** trim to the product's own opaque pixels — the bounding box, not the file's canvas */
async function trimToProduct(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let x0 = info.width, y0 = info.height, x1 = -1, y1 = -1, transparent = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const a = data[(y * info.width + x) * 4 + 3];
      if (a < 250) transparent++;
      if (a > 8) {
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) throw new Error(`no opaque pixels in ${file}`);
  // An opaque file has no bounding box to find: the whole canvas reads as "product", which makes it
  // the largest piece and silently shrinks every other piece in the grid to match. Fail loudly.
  if (transparent / (info.width * info.height) < 0.005) {
    throw new Error(`${file} has no transparent background — cut it first (scripts/process-images.ts), or the whole grid scales to this file's canvas`);
  }
  const box = { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
  const buf = await sharp(file).ensureAlpha().extract(box).png().toBuffer();
  return { buf, w: box.width, h: box.height };
}

(async () => {
  const files = idsArg
    ? idsArg.split(",").map((id) => path.join(srcDir, `${id}.webp`))
    : fs.readdirSync(srcDir).filter((f) => /\.(webp|png)$/i.test(f)).sort().map((f) => path.join(srcDir, f));

  if (!files.length) { console.error(`no images in ${srcDir}`); process.exit(2); }
  for (const f of files) if (!fs.existsSync(f)) { console.error(`missing: ${f}`); process.exit(2); }

  const rows = Math.ceil(files.length / cols);
  // Designer ceiling 2026-09-06: past 3 rows a tall product drops under ~40px on a phone and the
  // grid stops saying anything. joiway-f3's 30 flavours is the case this is waiting for.
  if (rows > MAX_ROWS) {
    console.error(`${files.length} pieces in ${cols} columns needs ${rows} rows — over the ${MAX_ROWS}-row ceiling.`);
    console.error(`Each piece would render under ~40px on a 390px phone. Use more columns (max ${MAX_COLS}), or split the set.`);
    process.exit(2);
  }
  if (cols > MAX_COLS) {
    console.error(`${cols} columns exceeds the ${MAX_COLS}-column ceiling — pieces get too narrow to tell apart on a phone.`);
    process.exit(2);
  }
  if (files.length % cols !== 0) {
    console.log(`note: ${files.length} pieces do not fill ${cols} columns — the last row is centred (never stretched) so it does not read as unfinished.`);
  }
  const pieces = [];
  for (const f of files) pieces.push({ file: f, ...(await trimToProduct(f)) });

  // One scale for the whole set, sized off the largest piece, so equal products stay equal.
  const maxW = Math.max(...pieces.map((p) => p.w));
  const maxH = Math.max(...pieces.map((p) => p.h));
  const inner = canvasSize * (1 - OUTER_MARGIN * 2);
  const cellW = inner / (cols + GAP_X * (cols - 1));
  const cellH = inner / (rows + GAP_Y * (rows - 1));
  const scale = Math.min(cellW / maxW, cellH / maxH, MAX_UPSCALE);

  const gapX = cellW * GAP_X, gapY = cellH * GAP_Y;
  const gridW = cols * cellW + (cols - 1) * gapX;
  const gridH = rows * cellH + (rows - 1) * gapY;
  const originX = (canvasSize - gridW) / 2, originY = (canvasSize - gridH) / 2;

  const composite = [];
  for (let i = 0; i < pieces.length; i++) {
    const p = pieces[i];
    const w = Math.max(1, Math.round(p.w * scale)), h = Math.max(1, Math.round(p.h * scale));
    const resized = await sharp(p.buf).resize({ width: w, height: h, fit: "fill", kernel: "lanczos3" }).png().toBuffer();
    const c = i % cols, r = Math.floor(i / cols);
    // A short last row is centred, not left-aligned: a hole on the right reads as "this image is
    // unfinished". Pieces are never enlarged to fill the gap — an odd-sized piece reads as a
    // different product.
    const inThisRow = Math.min(cols, files.length - r * cols);
    const rowIndent = ((cols - inThisRow) * (cellW + gapX)) / 2;
    const cellLeft = originX + rowIndent + c * (cellW + gapX), cellTop = originY + r * (cellH + gapY);
    const top = align === "bottom" ? cellTop + cellH - h : cellTop + (cellH - h) / 2;
    composite.push({ input: resized, left: Math.round(cellLeft + (cellW - w) / 2), top: Math.round(top) });
  }

  const buf = await sharp({ create: { width: canvasSize, height: canvasSize, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(composite)
    .webp({ quality: WEBP_QUALITY, alphaQuality: 100, effort: 6 })
    .toBuffer();

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, buf);

  const kb = Math.round(buf.length / 1024);
  console.log(`${outFile}  ${canvasSize}x${canvasSize}  ${cols}x${rows} (${files.length} pieces)  ${kb}KB q${WEBP_QUALITY}`);
  console.log(`  each piece ~${Math.round(maxW * scale)}x${Math.round(maxH * scale)} px  (scale ${scale.toFixed(3)}${scale >= MAX_UPSCALE ? " — CAPPED at +5%, sources too small for this grid" : ""})`);
  if (kb > 400) console.log(`  !! ${kb}KB over the 400KB gallery cap — reduce --canvas, never the quality (IMAGE_SPEC §1–§2)`);
})().catch((e) => { console.error(e); process.exit(1); });
