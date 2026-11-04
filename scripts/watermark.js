/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// OKami24 watermark on product photos (owner 02/11, queue item 1 · round queue-0211 batch 3 · IMAGE_SPEC §3).
//   node scripts/watermark.js [--gen 3|4] [--dry-run] [--keep <dir>] [--originals <dir>] [--template-refs] /assets/products/<slug>/<file> ...
// Generation 4 (default, owner 05/11 "แปะแค่ลายน้ำ 2 พอครับ หมวกไม่ต้องใส่หลังจากนี้") = the text rows only, no helmet, -wm4. Its strength is the
// one pair GENERATIONS[4].text below: change it and re-run from the originals. --gen 3 = the helmet set already on the site.
// Spec at a 1080-wide image, scaled by the image width: the white OKAMI helmet centred, 30% wide, at 18%; "OKAMI24.STORE"
// (Barlow Condensed 600, 22 px, letter-spacing 0.22em, -28°, columns 289 / rows 74), the rows alternating 20% / 18%.
// Generation 3 = owner 04/11, sample sheet _incoming/img-0211b/wm3-sample4 version A ("ล่าสุดคือ 390 ใช่ไหม ถ้าใช่ ตามนั้นเลยครับ"):
// "ความเข้ม 18-20% สลับไปมา" = every other text row 18%, the rest 20% · "ความถี่เอาแบบที่ปรับมาใหม่ 7-8" = ~7–8 repeats where
// generation 2 had 10 (spacing ×1.155 both ways) · "ให้เหลืออยู่แค่ในตัวสินค้าเหมือนเดิม แค่ให้หลุดเลยตัวสินค้ามาได้นิดหน่อยพอ" =
// on a cut-out the mark stays on the product with only a thin soft spill past its edge (1.2% of the width, ~12 px at 1000 px,
// fading to 0). Samples 1–3 (wider spill zones) were rejected. (Generation 2 = 03/11 22/18, -wm2; generation 1 = 02/11, -wm.)
// Style per file:
//   transparent photo (card · colour · flavour) = on the product's own pixels (alpha kept) + the thin spill, white text written
//     into fully transparent pixels only — no pixel the original had (alpha > 0) changes its alpha. The spill still widens the
//     alpha box a little, so the unmarked original's box is written to src/data/product-boxes.json and src/lib/media-quality.ts
//     uses it: every card keeps the product at exactly today's size ("ทุกอย่างต้องเหมือนเดิมแค่มีลายน้ำเพิ่มเข้าไป", owner 04/11);
//   opaque poster (no transparent pixel, alpha channel or not) = Javis's way, the whole picture with the same alternating rows.
// Writes <name>-wm3.webp (q82) — a new name, Cloudflare keeps an old one 30 days (LESSONS-images พ6) — points every reference
// under src/ at it, then deletes the file it replaces from public/ (git history + the --keep copy are the way back).
// The pixels always come from the UNMARKED original, never from an earlier mark: a path that is still the original is read
// as it is; an earlier generation's path (<name>-wm.webp / <name>-wm2.webp) is read from <--originals dir>/assets/products/…
// (the --keep folder of the first pass) or, failing that, from the last git commit that still had public/<name>.<ext>.
// A file no src/ line names literally is refused: its path is built by a template (e.g. `variant-${id}.webp`) that this tool
// cannot rewrite — fix the template by hand in the same commit and pass --template-refs.
// A name already ending in -wm3 is skipped. Skip files that already carry the mark (check the file — a Javis studio photo is not marked just by being one, owner 03/11).
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { execFileSync } = require("child_process");

const ROOT = process.env.WM_ROOT || path.join(__dirname, "..");
const FONT = path.join(__dirname, "lib/watermark/BarlowCondensed-600.ttf");
const HELMET = path.join(__dirname, "lib/watermark/okami-helmet-white.png");
const GENERATIONS = { 3: { text: [0.20, 0.18], helmet: 0.18 }, 4: { text: [0.20, 0.18], helmet: 0 } };
const GEN = (() => { const i = process.argv.indexOf("--gen"); return i >= 0 ? Number(process.argv[i + 1]) : 4; })();
if (!GENERATIONS[GEN]) { console.error(`unknown --gen ${GEN}`); process.exit(2); }
const [TEXT_A, TEXT_B] = GENERATIONS[GEN].text, HELMET_OP = GENERATIONS[GEN].helmet, SPACING = 1.155; // text rows alternate A / B
const FEATHER = 0.012; // the spill past a cut-out's edge: 1.2% of the width, fading to 0
const SUFFIX = `-wm${GEN}`, EARLIER = GEN === 4 ? /-wm[23]?$/ : /-wm2?$/; // this generation's name tag · the tags earlier generations left
const BOXES = path.join(ROOT, "src/data/product-boxes.json"); // unmarked product box per marked file, read by media-quality.ts

/** Two masks of the text tiling: the even rows (TEXT_A) and the odd rows (TEXT_B). */
async function textMasks(W, H) {
  const k = W / 1080, px = 22 * k;
  const { data: tile, info: ti } = await sharp({
    text: { text: `<span foreground="white" letter_spacing="${Math.round(0.22 * px * 1024)}">OKAMI24.STORE</span>`,
      fontfile: FONT, font: `Barlow Condensed SemiBold ${px.toFixed(2)}`, dpi: 72, rgba: true },
  }).png().toBuffer({ resolveWithObject: true });
  const D = Math.ceil(Math.hypot(W, H)) + Math.ceil(600 * k), rows = [[], []];
  let row = 0;
  for (let y = 0; y < D; y += 64 * SPACING * k, row++) for (let x = 0; x < D; x += 250 * SPACING * k) rows[row % 2].push({ input: tile, left: Math.round(x), top: Math.round(y) });
  const one = async (comps) => {
    const plane = await sharp({ create: { width: D + ti.width, height: D + ti.height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite(comps).png().toBuffer();
    const rot = await sharp(plane).rotate(-28, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer({ resolveWithObject: true });
    return sharp(rot.data).extract({ left: Math.round((rot.info.width - W) / 2), top: Math.round((rot.info.height - H) / 2), width: W, height: H })
      .extractChannel(3).raw().toBuffer();
  };
  return [await one(rows[0]), await one(rows[1])];
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

/** The product box the way src/lib/media-quality.ts measures it (alpha trim, threshold 10) — of the UNMARKED original:
 *  its long side is what media-quality.ts would have measured before the spill, so it is stored as the card's productLong. */
async function productBox(buf) {
  const meta = await sharp(buf).metadata();
  const { info } = await sharp(buf).extractChannel(3).trim({ threshold: 10 }).toBuffer({ resolveWithObject: true });
  const long = info.width < meta.width || info.height < meta.height ? Math.max(info.width, info.height) : null;
  return { label: `${-info.trimOffsetLeft},${-info.trimOffsetTop} ${info.width}x${info.height}`, long };
}

/** Pixels whose alpha the mark changed among those the original already had (alpha > 0) — must be 0: the spill only
 *  writes into the fully transparent margin, so the product's shape and the body box (alpha > 245) cannot move. */
async function alphaChanged(before, after) {
  const a = await sharp(before).ensureAlpha().extractChannel(3).raw().toBuffer(), b = await sharp(after).ensureAlpha().extractChannel(3).raw().toBuffer();
  let n = 0; for (let i = 0; i < a.length; i++) if (a[i] > 0 && a[i] !== b[i]) n++;
  return n;
}

/** Weight (0..1) of the thin spill outside a cut-out: two-pass chamfer distance from the product's opaque pixels, 1 at the
 *  edge falling to 0 at FEATHER × the width. 0 inside the product. */
function featherBand(data, W, H) {
  const INF = 1e9, d = new Float32Array(W * H);
  for (let p = 0; p < W * H; p++) d[p] = data[p * 4 + 3] > 128 ? 0 : INF;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const p = y * W + x; let v = d[p]; if (x > 0) v = Math.min(v, d[p - 1] + 3); if (y > 0) { v = Math.min(v, d[p - W] + 3); if (x > 0) v = Math.min(v, d[p - W - 1] + 4); if (x < W - 1) v = Math.min(v, d[p - W + 1] + 4); } d[p] = v; }
  for (let y = H - 1; y >= 0; y--) for (let x = W - 1; x >= 0; x--) { const p = y * W + x; let v = d[p]; if (x < W - 1) v = Math.min(v, d[p + 1] + 3); if (y < H - 1) { v = Math.min(v, d[p + W] + 3); if (x < W - 1) v = Math.min(v, d[p + W + 1] + 4); if (x > 0) v = Math.min(v, d[p + W - 1] + 4); } d[p] = v; }
  const R = FEATHER * W, w = new Float32Array(W * H);
  for (let p = 0; p < W * H; p++) { const r = d[p] / 3 / R; w[p] = d[p] === 0 || r >= 1 ? 0 : Math.pow(1 - r, 1.5); }
  return w;
}

async function mark(file) {
  const meta = await sharp(file).metadata();
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, [tA, tB] = await textMasks(W, H), h = HELMET_OP ? await helmetMask(W, H) : null;
  // a cut-out has transparent pixels; an alpha channel alone does not make one (story banners carry alpha, all 255)
  let cutout = false;
  if (meta.hasAlpha) for (let i = 3; i < data.length; i += 4) if (data[i] === 0) { cutout = true; break; }
  const band = cutout ? featherBand(data, W, H) : null;
  for (let p = 0, i = 0; p < W * H; p++, i += 4) {
    const text = (tA[p] / 255) * TEXT_A + (tB[p] / 255) * TEXT_B;
    if (cutout && data[i + 3] === 0) { // the transparent margin: white text only (no helmet) inside the thin spill
      const sa = text * band[p];
      if (sa > 0) { data[i] = data[i + 1] = data[i + 2] = 255; data[i + 3] = Math.round(sa * 255); }
      continue;
    }
    const a = Math.min(1, text + (h ? (h[p] / 255) * HELMET_OP : 0));
    for (let c = 0; c < 3; c++) data[i + c] = Math.round(data[i + c] * (1 - a) + 255 * a);
  }
  let img = sharp(data, { raw: { width: W, height: H, channels: 4 } });
  if (!meta.hasAlpha) img = img.removeAlpha();
  return { buf: await img.webp({ quality: 82 }).toBuffer(), hasAlpha: cutout };
}

/** The unmarked original behind a public path: itself, or (for an earlier generation's -wm name) the --originals copy or
 *  the last git commit that still held it. Returns { buf, from } or null. */
function originalOf(pub, originals) {
  const stem = pub.replace(/\.\w+$/, "");
  if (!EARLIER.test(stem)) { const file = path.join(ROOT, "public", pub); return fs.existsSync(file) ? { buf: fs.readFileSync(file), from: "public" } : null; }
  const base = stem.replace(EARLIER, "");
  for (const ext of [".webp", ".png", ".jpg"]) {
    const kept = originals && path.join(originals, base + ext);
    if (kept && fs.existsSync(kept)) return { buf: fs.readFileSync(kept), from: "originals" };
  }
  for (const ext of [".webp", ".png", ".jpg"]) {
    const rel = "public" + base + ext;
    try {
      const gone = execFileSync("git", ["log", "-1", "--format=%H", "--diff-filter=D", "--", rel], { cwd: ROOT }).toString().trim();
      if (gone) return { buf: execFileSync("git", ["show", `${gone}^:${rel}`], { cwd: ROOT, maxBuffer: 64 << 20 }), from: `git ${gone.slice(0, 8)}^` };
    } catch { /* not a git checkout, or never there */ }
  }
  return null;
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
  const dry = args.includes("--dry-run"), templateRefs = args.includes("--template-refs"), keep = opt("--keep"), originals = opt("--originals");
  // Git Bash rewrites a leading "/assets/…" into a Windows path, so take anything that holds assets/products/
  const list = args.filter((a) => /assets[\\/]products[\\/]/.test(a)).map((a) => "/" + a.slice(a.search(/assets[\\/]products[\\/]/)).replace(/\\/g, "/"));
  if (!list.length) {
    console.error("usage: node scripts/watermark.js [--gen 3|4] [--dry-run] [--keep <dir>] [--originals <dir>] [--template-refs] /assets/products/<slug>/<file> ...");
    process.exit(2);
  }
  const sources = sourceFiles(path.join(ROOT, "src"));
  let refused = 0;
  for (const pub of list) {
    const file = path.join(ROOT, "public", pub);
    const next = pub.replace(/\.\w+$/, "").replace(EARLIER, "") + SUFFIX + ".webp";
    if (new RegExp(SUFFIX + "\\.\\w+$").test(pub)) { console.log(`skip   ${pub}  already marked`); continue; }
    if (!fs.existsSync(file)) { console.log(`FAIL   ${pub}  not in public/`); refused++; continue; }
    const orig = originalOf(pub, originals);
    if (!orig) { console.log(`FAIL   ${pub}  no unmarked original (--originals or git history)`); refused++; continue; }
    const before = orig.buf;
    const { buf, hasAlpha } = await mark(before);
    const box = hasAlpha ? await productBox(before) : null, moved = hasAlpha ? await alphaChanged(before, buf) : 0;
    if (moved) { console.log(`FAIL   ${pub}  the mark changed the alpha of ${moved} product pixel(s)`); refused++; continue; }
    const refs = sources.filter((f) => fs.readFileSync(f, "utf8").includes(pub));
    if (!refs.length && !templateRefs) { console.log(`FAIL   ${pub}  no src/ file names it — template-built path? fix the template, then --template-refs`); refused++; continue; }
    console.log(`${dry ? "would " : "marked"} ${pub} → ${path.basename(next)} · ${hasAlpha ? "product only" : "whole picture"} · ` +
      `${(before.length / 1024).toFixed(0)} → ${(buf.length / 1024).toFixed(0)} KB · ${box ? `box ${box.label}` : "opaque"} · ${refs.length} ref file(s) · from ${orig.from}`);
    if (dry) continue;
    if (keep && orig.from === "public") { fs.mkdirSync(path.dirname(path.join(keep, pub)), { recursive: true }); fs.copyFileSync(file, path.join(keep, pub)); }
    fs.writeFileSync(path.join(ROOT, "public", next), buf);
    for (const f of refs) fs.writeFileSync(f, fs.readFileSync(f, "utf8").split(pub).join(next));
    fs.unlinkSync(file);
    if (box && box.long) { // the card keeps today's product size: media-quality.ts reads this instead of the spilled alpha box
      const boxes = fs.existsSync(BOXES) ? JSON.parse(fs.readFileSync(BOXES, "utf8")) : {};
      delete boxes[pub]; boxes[next] = box.long;
      const sorted = Object.fromEntries(Object.entries(boxes).sort(([a], [b]) => (a < b ? -1 : 1)));
      fs.writeFileSync(BOXES, JSON.stringify(sorted, null, 2) + "\n");
    }
  }
  if (refused) { console.log(`${refused} file(s) refused`); process.exit(1); }
})();
