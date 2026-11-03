/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// OKami24 watermark on product photos (owner 02/11, queue item 1 · round queue-0211 batch 3 · IMAGE_SPEC §3).
//   node scripts/watermark.js [--dry-run] [--keep <dir>] [--originals <dir>] [--zone x0,y0,x1,y1] [--template-refs] /assets/products/<slug>/<file> ...
// Spec at a 1080-wide image, scaled by the image width: the white OKAMI helmet centred, 30% wide, at 18%; "OKAMI24.STORE"
// (Barlow Condensed 600, 22 px, letter-spacing 0.22em, -28°, columns 289 / rows 74) at 18% over a poster, 20% on the product.
// Generation 3 = owner 04/11 (sample sheets wm3-sample 1–3): "จาก 22 เหลือ 20" on the product · ~25% fewer repeats ("10 ลาย …
// เหลือ 7.5") = spacing ×1.155 both ways · and on a cut-out the text spills past the product edge: "20 คือพื้นที่ … ความเข้มให้เริ่ม
// 20 หลุดออกจากตัวเครื่อง … นับถอยหลังจนสุดปลายขอบ … เหลือแค่ 3%" = a band 20% of the product's width wide, 20% opacity at
// the edge falling to 3% at its end, nothing past it. (Generation 2 = 03/11 22/18, names -wm2; generation 1 = 02/11, -wm.)
// Style per file:
//   transparent photo (card · colour · flavour) = on the product's own pixels (alpha kept) + the spill band, white text on the
//     fully transparent margin only — no pixel the original had (alpha > 0) changes its alpha. The spill widens the alpha box,
//     so the unmarked original's box is written to src/data/product-boxes.json and src/lib/media-quality.ts uses it: every
//     card keeps the product at exactly today's size ("ทุกอย่างต้องเหมือนเดิมแค่มีลายน้ำเพิ่มเข้าไป", owner 04/11);
//   opaque poster (no transparent pixel, alpha channel or not) = Javis's way, the whole picture at 18% (+ 20% inside --zone when given).
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
const TEXT_ALL = 0.18, TEXT_PRODUCT = 0.20, HELMET_OP = 0.18, SPACING = 1.155;
const SPILL_REACH = 0.2, SPILL_START = 0.2, SPILL_END = 0.03; // band = 20% of the product width · opacity 20% at the edge → 3% at its end
const SUFFIX = "-wm3", EARLIER = /-wm2?$/; // this generation's name tag · the tags earlier generations left
const BOXES = path.join(ROOT, "src/data/product-boxes.json"); // unmarked product box per marked file, read by media-quality.ts

async function textMask(W, H) {
  const k = W / 1080, px = 22 * k;
  const { data: tile, info: ti } = await sharp({
    text: { text: `<span foreground="white" letter_spacing="${Math.round(0.22 * px * 1024)}">OKAMI24.STORE</span>`,
      fontfile: FONT, font: `Barlow Condensed SemiBold ${px.toFixed(2)}`, dpi: 72, rgba: true },
  }).png().toBuffer({ resolveWithObject: true });
  const D = Math.ceil(Math.hypot(W, H)) + Math.ceil(600 * k), comps = [];
  for (let y = 0; y < D; y += 64 * SPACING * k) for (let x = 0; x < D; x += 250 * SPACING * k) comps.push({ input: tile, left: Math.round(x), top: Math.round(y) });
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

/** Opacity of the spill band per pixel (0 inside the product and past the band): two-pass chamfer distance from the
 *  product's opaque pixels, the band SPILL_REACH × the product width wide, SPILL_START at the edge falling to SPILL_END. */
function spillBand(data, W, H) {
  const INF = 1e9, d = new Float32Array(W * H); let x0 = W, x1 = -1;
  for (let p = 0; p < W * H; p++) { const on = data[p * 4 + 3] > 128; d[p] = on ? 0 : INF; if (on) { const x = p % W; if (x < x0) x0 = x; if (x > x1) x1 = x; } }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const p = y * W + x; let v = d[p]; if (x > 0) v = Math.min(v, d[p - 1] + 3); if (y > 0) { v = Math.min(v, d[p - W] + 3); if (x > 0) v = Math.min(v, d[p - W - 1] + 4); if (x < W - 1) v = Math.min(v, d[p - W + 1] + 4); } d[p] = v; }
  for (let y = H - 1; y >= 0; y--) for (let x = W - 1; x >= 0; x--) { const p = y * W + x; let v = d[p]; if (x < W - 1) v = Math.min(v, d[p + 1] + 3); if (y < H - 1) { v = Math.min(v, d[p + W] + 3); if (x < W - 1) v = Math.min(v, d[p + W + 1] + 4); if (x > 0) v = Math.min(v, d[p + W - 1] + 4); } d[p] = v; }
  const R = SPILL_REACH * Math.max(1, x1 - x0 + 1), op = new Float32Array(W * H);
  for (let p = 0; p < W * H; p++) { const r = d[p] / 3 / R; op[p] = d[p] === 0 || r >= 1 ? 0 : SPILL_END + (SPILL_START - SPILL_END) * Math.pow(1 - r, 1.3); }
  return op;
}

async function mark(file, zone) {
  const meta = await sharp(file).metadata();
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, t = await textMask(W, H), h = await helmetMask(W, H);
  // a cut-out has transparent pixels; an alpha channel alone does not make one (story banners carry alpha, all 255)
  let cutout = false;
  if (meta.hasAlpha) for (let i = 3; i < data.length; i += 4) if (data[i] === 0) { cutout = true; break; }
  const band = cutout ? spillBand(data, W, H) : null;
  for (let p = 0, i = 0; p < W * H; p++, i += 4) {
    let op;
    if (cutout) {
      if (data[i + 3] === 0) { // the transparent margin: white text only (no helmet) inside the spill band
        const sa = (t[p] / 255) * band[p];
        if (sa > 0) { data[i] = data[i + 1] = data[i + 2] = 255; data[i + 3] = Math.round(sa * 255); }
        continue;
      }
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
  const dry = args.includes("--dry-run"), templateRefs = args.includes("--template-refs"), keep = opt("--keep"), originals = opt("--originals"), zone = opt("--zone") && opt("--zone").split(",").map(Number);
  // Git Bash rewrites a leading "/assets/…" into a Windows path, so take anything that holds assets/products/
  const list = args.filter((a) => /assets[\\/]products[\\/]/.test(a)).map((a) => "/" + a.slice(a.search(/assets[\\/]products[\\/]/)).replace(/\\/g, "/"));
  if (!list.length) {
    console.error("usage: node scripts/watermark.js [--dry-run] [--keep <dir>] [--originals <dir>] [--zone x0,y0,x1,y1] [--template-refs] /assets/products/<slug>/<file> ...");
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
    const { buf, hasAlpha } = await mark(before, zone);
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
