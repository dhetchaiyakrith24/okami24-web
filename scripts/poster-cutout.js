#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
/**
 * poster-cutout — cut the product (box + device) out of a manufacturer's flavour POSTER with a hand-traced mask.
 *
 * Why: some makers (SALTHUB / Marbo) publish per-flavour photos only as posters — fruit, splash, logo and caption
 * around a box + device. The owner chose (image-fix round, 2026-09-28, answer 1 "B") to show only box + device.
 * A salient-object model keeps the fruit too, and every poster of one line is built on the SAME template (box and
 * device sit on the same pixels in every flavour — check with a per-pixel variance map across the set), so one
 * hand-traced polygon per template cuts every flavour identically and never guesses.
 *
 *   node scripts/poster-cutout.js <set> <out-dir> <poster> [<poster> …]
 *   node scripts/poster-cutout.js --outline <set> <out.png> <poster>   # draw the mask outline on a poster to check it
 *
 * Masks live in scripts/poster-cutout.masks.json: { "<set>": { "size": [w, h], "polygons": [[[x, y], …], …] } } in the
 * poster's own pixel grid (edges on pixel boundaries). The union of the polygons is rasterised at 4× and scaled down
 * (anti-aliased edge), then written as the poster's alpha channel. Output = PNG with the full poster size, so
 * scripts/process-images.ts trims, measures and places it like any other transparent source.
 * What it never does: recolour, retouch, fill in hidden pixels, or cut anything the polygon does not cover.
 */
const sharp = require("sharp");
const fs = require("node:fs");
const path = require("node:path");

sharp.cache(false);
const masks = JSON.parse(fs.readFileSync(path.join(__dirname, "poster-cutout.masks.json"), "utf8"));

function svgFor(set, scale, style) {
  const m = masks[set];
  if (!m) throw new Error(`unknown set "${set}" — known: ${Object.keys(masks).join(", ")}`);
  const [w, h] = m.size;
  const paths = m.polygons.map((poly) => `<path d="M${poly.map(([x, y]) => `${x * scale},${y * scale}`).join(" L")} Z" ${style}/>`).join("");
  return { w, h, svg: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w * scale}" height="${h * scale}">${paths}</svg>`) };
}

async function cut(set, outDir, file) {
  const meta = await sharp(file).metadata();
  const { w, h, svg } = svgFor(set, 4, 'fill="#fff"');
  if (meta.width !== w || meta.height !== h) throw new Error(`${file}: ${meta.width}x${meta.height}, mask is ${w}x${h}`);
  const alpha = await sharp(await sharp(svg).ensureAlpha().extractChannel(3).resize(w * 4, h * 4, { fit: "fill" }).png().toBuffer())
    .resize(w, h, { kernel: "lanczos3" }).extractChannel(0).raw().toBuffer();
  const rgb = await sharp(fs.readFileSync(file)).removeAlpha().raw().toBuffer();
  const out = path.join(outDir, path.basename(file).replace(/\.\w+$/, ".png"));
  await sharp(rgb, { raw: { width: w, height: h, channels: 3 } }).joinChannel(alpha, { raw: { width: w, height: h, channels: 1 } }).png().toFile(out);
  console.log(`${out}`);
}

async function outline(set, out, file) {
  const scale = 2;
  const { w, h, svg } = svgFor(set, scale, 'fill="none" stroke="#00ff66" stroke-width="1"');
  const base = await sharp(fs.readFileSync(file)).resize(w * scale, h * scale, { kernel: "nearest" }).png().toBuffer();
  await sharp(base).composite([{ input: await sharp(svg).resize(w * scale, h * scale, { fit: "fill" }).png().toBuffer() }]).png().toFile(out);
  console.log(out);
}

(async () => {
  const a = process.argv.slice(2);
  if (a[0] === "--outline") return outline(a[1], a[2], a[3]);
  const [set, outDir, ...files] = a;
  if (!set || !outDir || !files.length) { console.error("usage: node scripts/poster-cutout.js <set> <out-dir> <poster>…"); process.exit(2); }
  fs.mkdirSync(outDir, { recursive: true });
  for (const f of files) await cut(set, outDir, f);
})().catch((e) => { console.error(e.message); process.exit(1); });
