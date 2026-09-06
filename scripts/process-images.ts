/**
 * OKami24 — process-images: turns staged source media (`_incoming/`, gitignored) into spec-compliant
 * storefront assets under `public/assets/products/<slug>/`, per docs/IMAGE_SPEC.md.
 *
 *   npx tsx scripts/process-images.ts --dry-run                 # report only, writes nothing
 *   npx tsx scripts/process-images.ts                           # apply the map
 *   npx tsx scripts/process-images.ts --only zero-pro           # one slug
 *   npx tsx scripts/process-images.ts --fix-opaque [--dry-run]  # cut flat backgrounds off opaque files already in public/
 *   npx tsx scripts/process-images.ts --map <file>              # default scripts/process-images.map.json
 *
 * Pipeline per map entry (see `MapEntry`): AI-image check → optional erase/crop → background removal
 * (only when the file is opaque AND the background is flat) → trim → measure the product's real long
 * side (must be ≥ MIN_SOURCE_LONG) → scale to the 84% box (upscale capped at +5%, the owner's
 * tolerance) → centre on a transparent square canvas → WebP q82 → size-cap check → write.
 * Idempotent: an existing destination is only replaced when the new product pixels are LARGER than
 * the product pixels in the file it replaces (IMAGE_SPEC §6). Every decision is printed and written
 * to `_incoming/process-images.report.json` so nothing happens silently.
 *
 * Deliberately NOT here: no colour correction, no upscaling beyond +5%, no cropping into the product,
 * no guessing which product a file belongs to — the map is explicit.
 */
import sharp, { type Sharp } from "sharp";
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";

// ---------------------------------------------------------------------------------------------
// Spec constants (docs/IMAGE_SPEC.md)
// ---------------------------------------------------------------------------------------------
const CANVAS = { card: 1000, variant: 1000, detail: 1600 } as const;
const MAX_BYTES = { card: 150 * 1024, variant: 150 * 1024, detail: 400 * 1024 } as const;
const BOX_RATIO = 0.84; // 8% margin each side
const MIN_SOURCE_LONG = 800;
const MAX_UPSCALE = 1.05;
const WEBP_QUALITY = 82;
const WEBP_FALLBACK_QUALITIES = [80, 78, 76, 74, 72, 70];

const ROOT = process.cwd();
const PUBLIC_PRODUCTS = path.join(ROOT, "public", "assets", "products");

type Role = "card" | "variant" | "detail";
interface MapEntry {
  /** path relative to repo root, e.g. "_incoming/salthub/zero-pro/split/flesh-pink.png" */
  source: string;
  slug: string;
  role: Role;
  /** variant id (role "variant") or 1-based gallery index (role "detail") */
  id?: string | number;
  /** currently referenced file this output replaces (public path like "/assets/products/x/card.png") —
   *  used for the "only overwrite if larger" rule when the destination filename differs */
  replaces?: string;
  /** fractions of width/height to erase (paint transparent) BEFORE trimming — e.g. a printed colour name */
  eraseRects?: { x0: number; y0: number; x1: number; y1: number }[];
  /** fractions of width/height to crop TO before anything else */
  crop?: { x0: number; y0: number; x1: number; y1: number };
  /** after background removal keep only the largest connected opaque region — drops detached
   *  decoration (a faint brand mark behind the product, stray specks). Only safe when the product is
   *  ONE connected object; never use it for box+pod composites. */
  keepLargestComponent?: boolean;
  /** drop every pixel whose alpha is below this (0–255) BEFORE trimming — removes baked-in
   *  semi-transparent drop shadows / glows that some official renders ship with (IMAGE_SPEC §3:
   *  no shadows). ~200 keeps the product's own anti-aliased edge; use only on transparent sources. */
  alphaCut?: number;
  /** owner-approved exception to MIN_SOURCE_LONG for this one file (e.g. 796 — "รับขนาด 796–800px", 2026-09-04).
   *  Must be written in the map on purpose; there is no global override. */
  minLong?: number;
  /** smaller output canvas for this file (px, ≤ the role default). Owner rule 2026-09-06: when the
   *  largest real original is below the 800 floor, keep the product at the standard 84% of the
   *  canvas by shrinking the canvas instead of upscaling the pixels (e.g. 722px device → 860 canvas).
   *  The storefront fits images to their box, so the card renders the same size as every other. */
  canvas?: number;
  note?: string;
}

interface Decision {
  source: string; slug: string; role: Role; id?: string | number; dest: string;
  action: "written" | "would-write" | "skipped" | "kept-existing";
  reason?: string;
  sourceLong?: number; existingLong?: number; scale?: number; bytes?: number; quality?: number; canvas?: number;
  bgRemoved?: boolean;
}

const args = process.argv.slice(2);
const DRY = args.includes("--dry-run");
const FIX_OPAQUE = args.includes("--fix-opaque");
/** `--force`: skip the "only overwrite if larger" rule. For RE-PROCESSING the same source with new
 *  settings (e.g. after adding alphaCut) — never for pushing a smaller/worse photo over a better one. */
const FORCE = args.includes("--force");
const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;
const mapFile = args.includes("--map") ? args[args.indexOf("--map") + 1] : path.join(ROOT, "scripts", "process-images.map.json");

// ---------------------------------------------------------------------------------------------
// Pixel helpers (RGBA raw buffers)
// ---------------------------------------------------------------------------------------------
interface Raw { data: Buffer; width: number; height: number }

// libvips keeps a file it decoded open in its operation cache; on Windows that blocks overwriting the same
// file later in this process (EPERM/UNKNOWN). Always hand sharp a Buffer, never a path, and disable the cache.
sharp.cache(false);
async function toRaw(input: string | Buffer): Promise<Raw> {
  const src = typeof input === "string" ? readFileSync(input) : input;
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}
function fromRaw(r: Raw) { return sharp(r.data, { raw: { width: r.width, height: r.height, channels: 4 } }); }

function dist(d: Buffer, i: number, c: number[]) { const dr = d[i] - c[0], dg = d[i + 1] - c[1], db = d[i + 2] - c[2]; return Math.sqrt(dr * dr + dg * dg + db * db); }

/** alpha stats: share of fully transparent pixels */
function transparentShare(r: Raw): number { let t = 0; for (let i = 3; i < r.data.length; i += 4) if (r.data[i] === 0) t++; return t / (r.width * r.height); }

/** Is the border a single flat colour? Returns the colour when ≥95% of border pixels sit within `tol` of the median. */
function flatBorderColor(r: Raw, tol = 14): number[] | null {
  const px: number[][] = [];
  const push = (x: number, y: number) => { const i = (y * r.width + x) * 4; px.push([r.data[i], r.data[i + 1], r.data[i + 2]]); };
  for (let x = 0; x < r.width; x += 2) { push(x, 0); push(x, r.height - 1); }
  for (let y = 0; y < r.height; y += 2) { push(0, y); push(r.width - 1, y); }
  const med = [0, 1, 2].map((k) => { const v = px.map((p) => p[k]).sort((a, b) => a - b); return v[Math.floor(v.length / 2)]; });
  const ok = px.filter((p) => Math.hypot(p[0] - med[0], p[1] - med[1], p[2] - med[2]) <= tol).length / px.length;
  return ok >= 0.95 ? med : null;
}

/** Flood-fill transparency from every border pixel through near-`color` pixels, then peel `peel` px of blend edge. */
function removeFlatBackground(r: Raw, color: number[], tol = 40, peel = 1): Raw {
  const { data, width: w, height: h } = r; const keep = new Uint8Array(w * h).fill(1); const seen = new Uint8Array(w * h);
  const stack: number[] = [];
  for (let x = 0; x < w; x++) { stack.push(x, (h - 1) * w + x); } for (let y = 0; y < h; y++) { stack.push(y * w, y * w + w - 1); }
  while (stack.length) { const p = stack.pop()!; if (seen[p]) continue; seen[p] = 1; if (data[p * 4 + 3] === 0) { keep[p] = 0; } else if (dist(data, p * 4, color) > tol) continue; keep[p] = 0;
    const x = p % w, y = (p / w) | 0; if (x > 0) stack.push(p - 1); if (x < w - 1) stack.push(p + 1); if (y > 0) stack.push(p - w); if (y < h - 1) stack.push(p + w); }
  for (let it = 0; it < peel; it++) { const cand: number[] = []; for (let p = 0; p < w * h; p++) { if (!keep[p]) continue; const x = p % w, y = (p / w) | 0; let touches = false;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue; if (!keep[ny * w + nx]) { touches = true; break; } }
      if (touches && dist(data, p * 4, color) < tol * 2.5) cand.push(p); } for (const p of cand) keep[p] = 0; }
  const out = Buffer.from(data); for (let p = 0; p < w * h; p++) if (!keep[p]) out[p * 4 + 3] = 0;
  return { data: out, width: w, height: h };
}

/** keep only the largest 4-connected region of pixels with alpha > 8 */
function largestComponentOnly(r: Raw): Raw {
  const { width: w, height: h } = r; const lab = new Int32Array(w * h).fill(-1); let best = -1, bestN = 0, id = 0;
  const opaque = (p: number) => r.data[p * 4 + 3] > 8;
  for (let p = 0; p < w * h; p++) { if (!opaque(p) || lab[p] >= 0) continue; let n = 0; const st = [p]; lab[p] = id;
    while (st.length) { const q = st.pop()!; n++; const x = q % w, y = (q / w) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue; const t = ny * w + nx; if (opaque(t) && lab[t] < 0) { lab[t] = id; st.push(t); } } }
    if (n > bestN) { bestN = n; best = id; } id++; }
  const out = Buffer.from(r.data); for (let p = 0; p < w * h; p++) if (opaque(p) && lab[p] !== best) out[p * 4 + 3] = 0;
  return { data: out, width: w, height: h };
}

function eraseRects(r: Raw, rects: NonNullable<MapEntry["eraseRects"]>): Raw {
  const out = Buffer.from(r.data);
  for (const rc of rects) { const x0 = Math.floor(rc.x0 * r.width), x1 = Math.ceil(rc.x1 * r.width), y0 = Math.floor(rc.y0 * r.height), y1 = Math.ceil(rc.y1 * r.height);
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) out[(y * r.width + x) * 4 + 3] = 0; }
  return { data: out, width: r.width, height: r.height };
}

/** bounding box of pixels with alpha > threshold */
function alphaBox(r: Raw, threshold = 8) { let x0 = r.width, y0 = r.height, x1 = -1, y1 = -1;
  for (let y = 0; y < r.height; y++) for (let x = 0; x < r.width; x++) if (r.data[(y * r.width + x) * 4 + 3] > threshold) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  return x1 < 0 ? null : { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 }; }

/** long side of the product pixels inside an existing file (transparent-aware; opaque files count whole) */
async function productLongSide(file: string): Promise<number | null> {
  try { const r = await toRaw(file); const b = transparentShare(r) > 0.005 ? alphaBox(r) : { width: r.width, height: r.height }; return b ? Math.max(b.width, b.height) : null; } catch { return null; }
}

function isAiGenerated(file: string): boolean { const buf = readFileSync(file); return buf.includes("AIGC") || buf.includes("aigc_inpaint"); }

async function encodeWithin(canvas: Sharp, maxBytes: number): Promise<{ buf: Buffer; quality: number }> {
  const base = await canvas.png().toBuffer();
  for (const q of [WEBP_QUALITY, ...WEBP_FALLBACK_QUALITIES]) { const buf = await sharp(base).webp({ quality: q, alphaQuality: 100, effort: 5 }).toBuffer(); if (buf.length <= maxBytes) return { buf, quality: q }; }
  const buf = await sharp(base).webp({ quality: 70, alphaQuality: 100, effort: 6 }).toBuffer(); return { buf, quality: 70 };
}

function destFor(e: MapEntry): string {
  const name = e.role === "card" ? "card.webp" : e.role === "variant" ? `variant-${e.id}.webp` : `detail-${e.id}.webp`;
  return path.join(PUBLIC_PRODUCTS, e.slug, name);
}
const rel = (p: string) => path.relative(ROOT, p).replace(/\\/g, "/");

// ---------------------------------------------------------------------------------------------
// Main: map mode
// ---------------------------------------------------------------------------------------------
async function processEntry(e: MapEntry): Promise<Decision> {
  const dest = destFor(e); const d: Decision = { source: e.source, slug: e.slug, role: e.role, id: e.id, dest: rel(dest), action: "skipped", canvas: CANVAS[e.role] };
  const src = path.join(ROOT, e.source);
  if (!existsSync(src)) return { ...d, reason: "source file not found" };
  if (isAiGenerated(src)) return { ...d, reason: "REJECTED: AI-generated marker (AIGC) found in file" };

  let raw = await toRaw(src);
  if (e.crop) { const c = e.crop; raw = await toRaw(await fromRaw(raw).extract({ left: Math.floor(c.x0 * raw.width), top: Math.floor(c.y0 * raw.height), width: Math.ceil((c.x1 - c.x0) * raw.width), height: Math.ceil((c.y1 - c.y0) * raw.height) }).png().toBuffer()); }
  if (e.eraseRects) raw = eraseRects(raw, e.eraseRects);

  let bgRemoved = false;
  if (transparentShare(raw) < 0.005) {
    const flat = flatBorderColor(raw);
    if (!flat) return { ...d, reason: "opaque source with a non-flat background — not cut automatically (IMAGE_SPEC §6)" };
    raw = removeFlatBackground(raw, flat); bgRemoved = true;
    if (transparentShare(raw) < 0.05) return { ...d, reason: "background removal produced almost no transparency — source probably not a clean product shot" };
  }
  if (e.alphaCut) { const out = Buffer.from(raw.data); for (let i = 3; i < out.length; i += 4) if (out[i] < e.alphaCut) out[i] = 0; raw = { ...raw, data: out }; }
  if (e.keepLargestComponent) raw = largestComponentOnly(raw);
  const box = alphaBox(raw); if (!box) return { ...d, reason: "no opaque pixels after processing" };
  // sanity: a real product fills a good share of its own bounding box; a wordmark/logo/outline does not
  { let opaque = 0; for (let y = box.top; y < box.top + box.height; y++) for (let x = box.left; x < box.left + box.width; x++) if (raw.data[(y * raw.width + x) * 4 + 3] > 8) opaque++;
    const fill = opaque / (box.width * box.height); if (fill < 0.2) return { ...d, reason: `content fills only ${Math.round(fill * 100)}% of its bounding box — looks like a logo/text/outline, not a product shot` }; }
  const sourceLong = Math.max(box.width, box.height); d.sourceLong = sourceLong; d.bgRemoved = bgRemoved;
  const minLong = e.minLong ?? MIN_SOURCE_LONG;
  if (sourceLong < minLong) return { ...d, reason: `product long side ${sourceLong}px < ${minLong} (IMAGE_SPEC §2)` };
  if (sourceLong < MIN_SOURCE_LONG) d.reason = `owner exception: ${sourceLong}px accepted (map minLong ${minLong})`;

  // overwrite rule
  const compareFile = e.replaces ? path.join(ROOT, "public", e.replaces.replace(/^\//, "")) : dest;
  if (existsSync(compareFile)) { const existingLong = await productLongSide(compareFile); d.existingLong = existingLong ?? undefined;
    if (!FORCE && existingLong !== null && sourceLong <= existingLong) return { ...d, action: "kept-existing", reason: `existing ${rel(compareFile)} has product long side ${existingLong}px ≥ new ${sourceLong}px` };
    if (FORCE && existingLong !== null && sourceLong <= existingLong) d.reason = `--force: re-processed over existing ${existingLong}px`; }

  const canvasSize = e.canvas ? Math.min(e.canvas, CANVAS[e.role]) : CANVAS[e.role]; d.canvas = canvasSize; const boxPx = Math.round(canvasSize * BOX_RATIO);
  const scale = Math.min(boxPx / sourceLong, MAX_UPSCALE); d.scale = Math.round(scale * 1000) / 1000;
  const cropped = await fromRaw(raw).extract(box).png().toBuffer();
  const w = Math.max(1, Math.round(box.width * scale)), h = Math.max(1, Math.round(box.height * scale));
  const resized = await sharp(cropped).resize({ width: w, height: h, fit: "fill", kernel: "lanczos3" }).png().toBuffer();
  const canvas = sharp({ create: { width: canvasSize, height: canvasSize, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: resized, left: Math.round((canvasSize - w) / 2), top: Math.round((canvasSize - h) / 2) }]);
  const { buf, quality } = await encodeWithin(canvas, MAX_BYTES[e.role]); d.bytes = buf.length; d.quality = quality;
  if (buf.length > MAX_BYTES[e.role]) d.reason = `WARNING: ${Math.round(buf.length / 1024)}KB exceeds cap even at q70`;
  if (DRY) return { ...d, action: "would-write" };
  mkdirSync(path.dirname(dest), { recursive: true }); await writeWithRetry(dest, buf); return { ...d, action: "written" };
}

/** Windows can refuse to open a file the dev server / an image viewer is holding (EBUSY / errno -4094).
 *  Write via a temp file and rename, retrying a few times, rather than dying mid-batch. */
async function writeWithRetry(dest: string, buf: Buffer): Promise<void> {
  const tmp = `${dest}.tmp-${process.pid}`;
  let lastErr: unknown;
  for (let attempt = 1; attempt <= 5; attempt++) {
    try { writeFileSync(tmp, buf); renameSync(tmp, dest); return; }
    catch (err) { lastErr = err; try { if (existsSync(tmp)) unlinkSync(tmp); } catch {} await new Promise((r) => setTimeout(r, 400 * attempt)); }
  }
  throw lastErr;
}

// ---------------------------------------------------------------------------------------------
// --fix-opaque: cut flat backgrounds off opaque files already shipped in public/ (in place, same name)
// ---------------------------------------------------------------------------------------------
async function fixOpaque(): Promise<Decision[]> {
  const out: Decision[] = [];
  const walk = (dir: string): string[] => readdirSync(dir).flatMap((f) => { const p = path.join(dir, f); return statSync(p).isDirectory() ? walk(p) : /\.(webp|png|jpe?g)$/i.test(f) ? [p] : []; });
  for (const file of walk(PUBLIC_PRODUCTS)) {
    const slug = path.basename(path.dirname(file)); if (only && slug !== only && path.basename(path.dirname(path.dirname(file))) !== only) continue;
    const raw = await toRaw(file); if (transparentShare(raw) >= 0.005) continue; // already transparent
    const d: Decision = { source: rel(file), slug, role: "card", dest: rel(file), action: "skipped" };
    const flat = flatBorderColor(raw); if (!flat) { out.push({ ...d, reason: "opaque, non-flat background — left as is (report to owner)" }); continue; }
    const cut = removeFlatBackground(raw, flat); const share = transparentShare(cut);
    if (share < 0.05) { out.push({ ...d, reason: `flat border but removal freed only ${Math.round(share * 100)}% — left as is` }); continue; }
    const box = alphaBox(cut); d.sourceLong = box ? Math.max(box.width, box.height) : undefined; d.bgRemoved = true;
    if (DRY) { out.push({ ...d, action: "would-write", reason: `flat bg ${flat.join(",")} → ${Math.round(share * 100)}% transparent` }); continue; }
    const ext = path.extname(file).toLowerCase(); const img = fromRaw(cut);
    const buf = ext === ".png" ? await img.png().toBuffer() : (await encodeWithin(img, 10 * 1024 * 1024)).buf; // keep format; webp for jpg/webp
    const target = ext === ".png" ? file : file.replace(/\.(jpe?g)$/i, ".webp"); await writeWithRetry(target, buf);
    out.push({ ...d, dest: rel(target), action: "written", bytes: buf.length, reason: `flat bg ${flat.join(",")} → ${Math.round(share * 100)}% transparent${target !== file ? " (jpg re-saved as webp; update the data reference)" : ""}` });
  }
  return out;
}

(async () => {
  let decisions: Decision[];
  if (FIX_OPAQUE) { decisions = await fixOpaque(); }
  else {
    if (!existsSync(mapFile)) { console.error(`map not found: ${mapFile}`); process.exit(2); }
    const map: MapEntry[] = JSON.parse(readFileSync(mapFile, "utf8"));
    decisions = []; for (const e of map) { if (only && e.slug !== only) continue; const d = await processEntry(e); decisions.push(d); }
  }
  for (const d of decisions) console.log(`${d.action.padEnd(14)} ${d.slug.padEnd(22)} ${(d.role + (d.id != null ? ":" + d.id : "")).padEnd(24)} ${d.sourceLong ? `${d.sourceLong}px` : ""}${d.existingLong ? ` (have ${d.existingLong}px)` : ""}${d.scale ? ` ×${d.scale}` : ""}${d.bytes ? ` ${Math.round(d.bytes / 1024)}KB q${d.quality}` : ""}${d.bgRemoved ? " bg-cut" : ""}  ${d.reason ?? ""}  ← ${d.source}`);
  const sum = decisions.reduce((a, d) => ((a[d.action] = (a[d.action] ?? 0) + 1), a), {} as Record<string, number>);
  console.log(`\n${DRY ? "[dry-run] " : ""}${JSON.stringify(sum)}`);
  const reportPath = path.join(ROOT, "_incoming", `process-images${FIX_OPAQUE ? ".fix-opaque" : ""}${DRY ? ".dry-run" : ""}.report.json`);
  mkdirSync(path.dirname(reportPath), { recursive: true }); writeFileSync(reportPath, JSON.stringify({ generatedAt: new Date().toISOString(), dryRun: DRY, decisions }, null, 1));
  console.log(`report: ${rel(reportPath)}`);
})().catch((e) => { console.error(e); process.exit(1); });
