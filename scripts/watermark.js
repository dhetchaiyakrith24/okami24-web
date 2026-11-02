/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// OKami24 watermark on product photos (owner 02/11, queue item 1 · round queue-0211 batch 3 · IMAGE_SPEC §3).
//   node scripts/watermark.js [--dry-run] [--keep <dir>] [--zone x0,y0,x1,y1] /assets/products/<slug>/<file> ...
// Spec at a 1080-wide image, scaled by the image width: the white OKAMI helmet centred, 30% wide, at 12%; "OKAMI24.STORE"
// (Barlow Condensed 600, 22 px, letter-spacing 0.22em, -28°, columns 250 / rows 64) at 12% over the picture, 18% on the
// product. Strength = owner 02/11 "12-18 ได้ทั้งคู่เลย" from the 4-level sheet: the first 2/4% vanished once
// /_next/image re-encodes at 750 wide webp q75. Style per file (owner + Javis 02/11, from the two-style sample sheet):
//   transparent photo (card · colour · flavour) = on the product's own pixels only: the transparent margin stays clean and
//     alpha never changes, so the product box src/lib/media-quality.ts measures (alpha trim 10) cannot move;
//   opaque poster = Javis's way, the whole picture at 12% (+ 18% inside --zone when given).
// Writes <name>-wm.webp (q82) beside the original — a new name, Cloudflare keeps an old one 30 days (LESSONS-images พ6) —
// points every reference under src/ at it, then deletes the original from public/ (git history + the --keep copy are the
// way back). A name already ending in -wm is skipped. Photos from Javis's studio carry this mark already: leave them off.
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = process.env.WM_ROOT || path.join(__dirname, "..");
const FONT = path.join(__dirname, "lib/watermark/BarlowCondensed-600.ttf");
const HELMET = path.join(__dirname, "lib/watermark/okami-helmet-white.png");
const TEXT_ALL = 0.12, TEXT_PRODUCT = 0.18, HELMET_OP = 0.12;

async function textMask(W, H) {
  const k = W / 1080, px = 22 * k;
  const { data: tile, info: ti } = await sharp({
    text: { text: `<span foreground="white" letter_spacing="${Math.round(0.22 * px * 1024)}">OKAMI24.STORE</span>`,
      fontfile: FONT, font: `Barlow Condensed SemiBold ${px.toFixed(2)}`, dpi: 72, rgba: true },
  }).png().toBuffer({ resolveWithObject: true });
  const D = Math.ceil(Math.hypot(W, H)) + Math.ceil(500 * k), comps = [];
  for (let y = 0; y < D; y += 64 * k) for (let x = 0; x < D; x += 250 * k) comps.push({ input: tile, left: Math.round(x), top: Math.round(y) });
  const plane = await sharp({ create: { width: D + ti.width, height: D + ti.height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(comps).png().toBuffer();
  const rot = await sharp(plane).rotate(-28, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer({ resolveWithObject: true });
  return sharp(rot.data).extract({ left: Math.round((rot.info.width - W) / 2), top: Math.round((rot.info.height - H) / 2), width: W, height: H })
    .extractChannel(3).raw().toBuffer();
}

async function helmetMask(W, H) {
  const { data, info } = await sharp(HELMET).resize({ width: Math.round(W * 0.3) }).extractChannel(3).raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(W * H), ox = Math.round((W - info.width) / 2), oy = Math.round((H - info.height) / 2);
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const X = x + ox, Y = y + oy;
    if (X >= 0 && Y >= 0 && X < W && Y < H) out[Y * W + X] = data[y * info.width + x];
  }
  return out;
}

/** The product box the way src/lib/media-quality.ts measures it (alpha trim, threshold 10). */
async function productBox(buf) {
  const { info } = await sharp(buf).extractChannel(3).trim({ threshold: 10 }).toBuffer({ resolveWithObject: true });
  return `${-info.trimOffsetLeft},${-info.trimOffsetTop} ${info.width}x${info.height}`;
}

async function mark(file, zone) {
  const meta = await sharp(file).metadata();
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, t = await textMask(W, H), h = await helmetMask(W, H);
  for (let p = 0, i = 0; p < W * H; p++, i += 4) {
    let op;
    if (meta.hasAlpha) {
      if (data[i + 3] === 0) continue;
      op = TEXT_PRODUCT;
    } else {
      const x = p % W, y = (p / W) | 0;
      op = zone && x >= zone[0] && x < zone[2] && y >= zone[1] && y < zone[3] ? TEXT_PRODUCT : TEXT_ALL;
    }
    const a = Math.min(1, (t[p] / 255) * op + (h[p] / 255) * HELMET_OP);
    for (let c = 0; c < 3; c++) data[i + c] = Math.round(data[i + c] * (1 - a) + 255 * a);
  }
  let img = sharp(data, { raw: { width: W, height: H, channels: 4 } });
  if (!meta.hasAlpha) img = img.removeAlpha();
  return { buf: await img.webp({ quality: 82 }).toBuffer(), hasAlpha: meta.hasAlpha };
}

function sourceFiles(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) sourceFiles(p, out);
    else if (/\.(ts|tsx|js|json|md)$/.test(e.name)) out.push(p);
  }
  return out;
}

(async () => {
  const args = process.argv.slice(2);
  const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
  const dry = args.includes("--dry-run"), keep = opt("--keep"), zone = opt("--zone") && opt("--zone").split(",").map(Number);
  // Git Bash rewrites a leading "/assets/…" into a Windows path, so take anything that holds assets/products/
  const list = args.filter((a) => /assets[\\/]products[\\/]/.test(a)).map((a) => "/" + a.slice(a.search(/assets[\\/]products[\\/]/)).replace(/\\/g, "/"));
  if (!list.length) {
    console.error("usage: node scripts/watermark.js [--dry-run] [--keep <dir>] [--zone x0,y0,x1,y1] /assets/products/<slug>/<file> ...");
    process.exit(2);
  }
  const sources = sourceFiles(path.join(ROOT, "src"));
  let refused = 0;
  for (const pub of list) {
    const file = path.join(ROOT, "public", pub);
    const next = pub.replace(/\.\w+$/, "") + "-wm.webp";
    if (/-wm\.\w+$/.test(pub)) { console.log(`skip   ${pub}  already marked`); continue; }
    if (!fs.existsSync(file)) { console.log(`FAIL   ${pub}  not in public/`); refused++; continue; }
    const before = fs.readFileSync(file);
    const { buf, hasAlpha } = await mark(file, zone);
    const boxes = hasAlpha ? [await productBox(before), await productBox(buf)] : null;
    if (boxes && boxes[0] !== boxes[1]) { console.log(`FAIL   ${pub}  product box moved ${boxes[0]} → ${boxes[1]}`); refused++; continue; }
    const refs = sources.filter((f) => fs.readFileSync(f, "utf8").includes(pub));
    console.log(`${dry ? "would " : "marked"} ${pub} → ${path.basename(next)} · ${hasAlpha ? "product only" : "whole picture"} · ` +
      `${(before.length / 1024).toFixed(0)} → ${(buf.length / 1024).toFixed(0)} KB · ${boxes ? `box ${boxes[1]}` : "opaque"} · ${refs.length} ref file(s)`);
    if (dry) continue;
    if (keep) { fs.mkdirSync(path.dirname(path.join(keep, pub)), { recursive: true }); fs.copyFileSync(file, path.join(keep, pub)); }
    fs.writeFileSync(path.join(ROOT, "public", next), buf);
    for (const f of refs) fs.writeFileSync(f, fs.readFileSync(f, "utf8").split(pub).join(next));
    fs.unlinkSync(file);
  }
  if (refused) { console.log(`${refused} file(s) refused`); process.exit(1); }
})();
