/**
 * OKami24 image QUALITY audit (read-only) — image round 2026-09-28.
 *   npx tsx scripts/image-quality-audit.ts <out-dir>
 * Writes <out-dir>/images.json (one row per image the site uses) · <out-dir>/products.json (one row per
 * product: options, which options have their own photo, hidden status) · <out-dir>/shipnity-unlisted.json
 * (Shipnity parents with stock that no site page maps to) · <out-dir>/sheets/<brand>.png contact sheets
 * (every image on the dark theme colour at card size, with its numbers) for a human to look at.
 *
 * Why a second script next to image-audit.ts: that one measures canvas pixels only, which cannot see
 * what the owner complains about (soft/upscaled photos, jagged or haloed cut-out edges). Numbers here:
 *   productLong  — long side of the product itself (alpha >= 128, or colour distance from the corner
 *                  colour on an opaque image), not the canvas
 *   fillPct      — productLong / canvas long side (IMAGE_SPEC §3 wants 84)
 *   detail50     — mean |L - up(down(L, 50%))| / std(L) inside the product: how much real detail the
 *                  pixels hold at full size. An upscaled or soft photo loses almost nothing when halved,
 *                  so it scores near 0. Scale-free, so a small sharp photo still scores well.
 *   sharpCard    — mean |laplacian| inside the product after resizing it to the card size (840 px long)
 *                  on the dark theme colour: what a customer's eye gets on the card.
 *   hardEdgePct  — share of outline pixels that jump straight from alpha 255 to alpha 0 (staircase /
 *                  "ขอบแตก")
 *   fringePct    — share of outline pixels clearly brighter than the product just inside them (a white
 *                  halo left from a white-background cut-out — shows as a light rim on the dark theme)
 * Thresholds are NOT set here — they are derived from the reference set (UWELL Caliburn G5, owner's
 * pick 28/09) in the round's report. No writes outside <out-dir>.
 */
import path from "node:path";
import fs from "node:fs";
import sharp, { type OverlayOptions } from "sharp";
import { catalogIncludingHidden as legacy } from "../src/data/products/index";
import { getBrand } from "../src/data/brands";
import { getPublishedProducts } from "../src/data/shipnity-seed/storefront-bridge";
import { LEGACY_APPROVED_PRICING } from "../src/data/shipnity-seed/legacy-price-approvals";
import { activeCatalogSeed } from "../src/data/shipnity-seed/build-active-catalog";

sharp.cache(false);
const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const THEME_BG = { r: 17, g: 17, b: 19 }; // dark card surface, close enough for a luminance test
const CARD_LONG = 840;
const PHONE_LONG = 1050; // ~350 CSS px product hero x DPR 3

type Role = "card" | "detail" | "color" | "flavor" | "lineup" | "pm-card" | "pm-variant" | "pm-fallback";
interface ImgRow {
  slug: string;
  brand: string;
  source: "legacy" | "product-master";
  role: Role;
  option: string | null;
  src: string;
  exists: boolean;
  bytes?: number;
  format?: string;
  width?: number;
  height?: number;
  transparent?: boolean;
  transparentPct?: number;
  productW?: number;
  productH?: number;
  productLong?: number;
  fillPct?: number;
  offCentrePct?: number;
  detail50?: number;
  detail70?: number;
  detailPhone?: number;
  edgeDetail?: number;
  sharpCard?: number;
  hardEdgePct?: number;
  fringePct?: number;
  darkFringePct?: number;
  opaqueBg?: string;
}

const lum = (r: number, g: number, b: number) => 0.299 * r + 0.587 * g + 0.114 * b;

async function greyOf(buf: Buffer, w: number, h: number): Promise<Float32Array> {
  const g = new Float32Array(w * h);
  for (let i = 0, p = 0; p < w * h; p++, i += 4) g[p] = lum(buf[i], buf[i + 1], buf[i + 2]);
  return g;
}

/** mean |orig - up(down(orig, f))| / std, over mask pixels, on an RGBA crop flattened on the theme colour */
async function detailAt(flatRgb: Buffer, w: number, h: number, mask: Uint8Array, f: number): Promise<number> {
  const dw = Math.max(1, Math.round(w * f));
  const dh = Math.max(1, Math.round(h * f));
  const down = await sharp(flatRgb, { raw: { width: w, height: h, channels: 3 } }).resize(dw, dh, { kernel: "lanczos3" }).raw().toBuffer();
  const up = await sharp(down, { raw: { width: dw, height: dh, channels: 3 } }).resize(w, h, { kernel: "lanczos3" }).raw().toBuffer();
  let n = 0, sum = 0, sumSq = 0, diff = 0;
  for (let p = 0; p < w * h; p++) {
    if (!mask[p]) continue;
    const i = p * 3;
    const a = lum(flatRgb[i], flatRgb[i + 1], flatRgb[i + 2]);
    const b = lum(up[i], up[i + 1], up[i + 2]);
    n++; sum += a; sumSq += a * a; diff += Math.abs(a - b);
  }
  if (!n) return 0;
  const std = Math.sqrt(Math.max(0, sumSq / n - (sum / n) ** 2));
  return Math.round((diff / n / (std + 1)) * 10000) / 10000;
}

/** Edge crispness: on the strongest 10% of edges inside the product (lettering, seams, screen), how much a 50%
 *  down-up round trip changes them, relative to the edge's own gradient. A plain matte body has few edges and
 *  does not drag this down the way it drags `detailAt` down; an upscaled photo has soft edges everywhere. */
async function edgeDetailAt(flatRgb: Buffer, w: number, h: number, mask: Uint8Array): Promise<number> {
  const dw = Math.max(1, Math.round(w * 0.5)), dh = Math.max(1, Math.round(h * 0.5));
  const down = await sharp(flatRgb, { raw: { width: w, height: h, channels: 3 } }).resize(dw, dh, { kernel: "lanczos3" }).raw().toBuffer();
  const up = await sharp(down, { raw: { width: dw, height: dh, channels: 3 } }).resize(w, h, { kernel: "lanczos3" }).raw().toBuffer();
  const L = new Float32Array(w * h), U = new Float32Array(w * h);
  for (let p = 0; p < w * h; p++) { const i = p * 3; L[p] = lum(flatRgb[i], flatRgb[i + 1], flatRgb[i + 2]); U[p] = lum(up[i], up[i + 1], up[i + 2]); }
  const grads: number[] = [];
  const G = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const p = y * w + x;
    if (!mask[p]) continue;
    const g = Math.abs(L[p + 1] - L[p - 1]) + Math.abs(L[p + w] - L[p - w]);
    G[p] = g; grads.push(g);
  }
  if (grads.length < 100) return 0;
  grads.sort((a, b) => a - b);
  const cut = Math.max(20, grads[Math.floor(grads.length * 0.9)]);
  let n = 0, diff = 0, gsum = 0;
  for (let p = 0; p < w * h; p++) if (mask[p] && G[p] >= cut) { n++; diff += Math.abs(L[p] - U[p]); gsum += G[p]; }
  return n ? Math.round((diff / gsum) * 10000) / 10000 : 0;
}

const measured = new Map<string, Promise<Partial<ImgRow>>>();
function measure(src: string): Promise<Partial<ImgRow>> {
  if (!measured.has(src)) measured.set(src, measureFile(src));
  return measured.get(src)!;
}

async function measureFile(src: string): Promise<Partial<ImgRow>> {
  const file = path.join(PUBLIC, src.replace(/^\//, ""));
  if (!fs.existsSync(file)) return { exists: false };
  const bytes = fs.statSync(file).size;
  const meta = await sharp(file).metadata();
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H;
  let transparentPx = 0;
  for (let p = 0; p < N; p++) if (data[p * 4 + 3] < 255) transparentPx++;
  const transparent = transparentPx > 0;

  // product mask
  const mask = new Uint8Array(N);
  let opaqueBg: string | undefined;
  if (transparent) {
    for (let p = 0; p < N; p++) mask[p] = data[p * 4 + 3] >= 128 ? 1 : 0;
  } else {
    const c = [0, W - 1, (H - 1) * W, N - 1].map((p) => [data[p * 4], data[p * 4 + 1], data[p * 4 + 2]]);
    const bg = [0, 1, 2].map((k) => Math.round(c.reduce((s, x) => s + x[k], 0) / 4));
    opaqueBg = `rgb(${bg.join(",")})`;
    for (let p = 0; p < N; p++) {
      const i = p * 4;
      const d = Math.abs(data[i] - bg[0]) + Math.abs(data[i + 1] - bg[1]) + Math.abs(data[i + 2] - bg[2]);
      mask[p] = d > 36 ? 1 : 0;
    }
  }
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (mask[y * W + x]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  const base: Partial<ImgRow> = { exists: true, bytes, format: meta.format, width: W, height: H, transparent, transparentPct: Math.round((transparentPx / N) * 1000) / 10, opaqueBg };
  if (x1 < 0) return base;
  const pw = x1 - x0 + 1, ph = y1 - y0 + 1;
  const productLong = Math.max(pw, ph);
  const cx = (x0 + x1) / 2 - (W - 1) / 2, cy = (y0 + y1) / 2 - (H - 1) / 2;

  // edge quality (cut-outs only)
  let boundary = 0, hard = 0, fringe = 0, darkFringe = 0;
  if (transparent) {
    const L = await greyOf(data, W, H);
    const inMask = (x: number, y: number) => x >= 0 && y >= 0 && x < W && y < H && mask[y * W + x] === 1;
    const isBoundary = (x: number, y: number) => inMask(x, y) && (!inMask(x - 1, y) || !inMask(x + 1, y) || !inMask(x, y - 1) || !inMask(x, y + 1));
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      if (!isBoundary(x, y)) continue;
      boundary++;
      const p = y * W + x;
      const a = data[p * 4 + 3];
      const nb = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
      if (a === 255 && nb.some(([nx, ny]) => nx >= 0 && ny >= 0 && nx < W && ny < H && data[(ny * W + nx) * 4 + 3] === 0)) hard++;
      let s = 0, k = 0;
      for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
        const nx = x + dx, ny = y + dy;
        if (Math.abs(dx) + Math.abs(dy) < 2) continue;
        if (inMask(nx, ny) && !isBoundary(nx, ny)) { s += L[ny * W + nx]; k++; }
      }
      if (!k) continue;
      const inner = s / k;
      if (L[p] > 170 && L[p] - inner > 50) fringe++;
      if (L[p] < 45 && inner - L[p] > 60) darkFringe++;
    }
  }

  // crop the product, flatten on the theme colour
  const crop = await sharp(file).extract({ left: x0, top: y0, width: pw, height: ph }).ensureAlpha().raw().toBuffer();
  const flat = Buffer.alloc(pw * ph * 3);
  const cropMask = new Uint8Array(pw * ph);
  for (let p = 0; p < pw * ph; p++) {
    const a = crop[p * 4 + 3] / 255;
    flat[p * 3] = Math.round(crop[p * 4] * a + THEME_BG.r * (1 - a));
    flat[p * 3 + 1] = Math.round(crop[p * 4 + 1] * a + THEME_BG.g * (1 - a));
    flat[p * 3 + 2] = Math.round(crop[p * 4 + 2] * a + THEME_BG.b * (1 - a));
    cropMask[p] = mask[(y0 + Math.floor(p / pw)) * W + x0 + (p % pw)];
  }
  // interior mask = mask eroded by 3 px, so the outline does not dominate the detail numbers
  const interior = new Uint8Array(pw * ph);
  for (let y = 3; y < ph - 3; y++) for (let x = 3; x < pw - 3; x++) {
    let ok = 1;
    for (let d = -3; d <= 3 && ok; d++) if (!cropMask[(y + d) * pw + x] || !cropMask[y * pw + x + d]) ok = 0;
    interior[y * pw + x] = ok;
  }
  const detail50 = await detailAt(flat, pw, ph, interior, 0.5);
  const detail70 = await detailAt(flat, pw, ph, interior, 0.7);
  // detail at phone size: a photo bigger than a phone ever draws it (PHONE_LONG) is judged after the same downscale
  // the browser does — a large but slightly soft file looks crisp there; an upscaled one still scores low
  let detailPhone = detail50;
  let edgeDetail = await edgeDetailAt(flat, pw, ph, interior);
  if (productLong > PHONE_LONG) {
    const s = PHONE_LONG / productLong;
    const sw = Math.max(1, Math.round(pw * s)), sh = Math.max(1, Math.round(ph * s));
    const small = await sharp(flat, { raw: { width: pw, height: ph, channels: 3 } }).resize(sw, sh, { kernel: "lanczos3" }).raw().toBuffer();
    const smallMask = await sharp(Buffer.from(interior.map((v) => v * 255)), { raw: { width: pw, height: ph, channels: 1 } }).resize(sw, sh, { kernel: "nearest" }).raw().toBuffer();
    const sm = Uint8Array.from(smallMask, (v) => (v > 127 ? 1 : 0));
    detailPhone = await detailAt(small, sw, sh, sm, 0.5);
    edgeDetail = await edgeDetailAt(small, sw, sh, sm);
  }

  // sharpness at card size
  const scale = CARD_LONG / productLong;
  const cw = Math.max(1, Math.round(pw * scale)), ch = Math.max(1, Math.round(ph * scale));
  const card = await sharp(flat, { raw: { width: pw, height: ph, channels: 3 } }).resize(cw, ch, { kernel: "lanczos3" }).greyscale().raw().toBuffer();
  const cardMask = await sharp(Buffer.from(interior.map((v) => v * 255)), { raw: { width: pw, height: ph, channels: 1 } }).resize(cw, ch, { kernel: "nearest" }).raw().toBuffer();
  let lap = 0, ln = 0;
  for (let y = 1; y < ch - 1; y++) for (let x = 1; x < cw - 1; x++) {
    const p = y * cw + x;
    if (!cardMask[p]) continue;
    lap += Math.abs(4 * card[p] - card[p - 1] - card[p + 1] - card[p - cw] - card[p + cw]);
    ln++;
  }

  return {
    ...base,
    productW: pw, productH: ph, productLong,
    fillPct: Math.round((productLong / Math.max(W, H)) * 1000) / 10,
    offCentrePct: Math.round((Math.max(Math.abs(cx) / W, Math.abs(cy) / H)) * 1000) / 10,
    detail50, detail70, detailPhone, edgeDetail,
    sharpCard: ln ? Math.round((lap / ln) * 100) / 100 : 0,
    hardEdgePct: boundary ? Math.round((hard / boundary) * 1000) / 10 : undefined,
    fringePct: boundary ? Math.round((fringe / boundary) * 1000) / 10 : undefined,
    darkFringePct: boundary ? Math.round((darkFringe / boundary) * 1000) / 10 : undefined,
  };
}

interface ProductRow {
  slug: string;
  brand: string;
  source: "legacy" | "product-master";
  name: string;
  systemType: string | null;
  hidden: { since: string; reason: string } | null;
  isFlagship: boolean;
  shipnityProductId: string | null;
  card: string | null;
  lineup: string | null;
  details: number;
  colors: { name: string; image: string | null }[];
  flavors: { name: string; image: string | null }[];
  otherOptions: { axis: string; name: string; image: string | null }[];
}

async function sheet(rows: ImgRow[], out: string, title: string) {
  const cell = 260, pad = 8, labelH = 64, cols = 6;
  const list = rows.filter((r) => r.exists);
  if (!list.length) return;
  const rowsN = Math.ceil(list.length / cols);
  const W = cols * cell, H = 40 + rowsN * (cell + labelH);
  const composites: OverlayOptions[] = [];
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><style>text{font-family:Arial,sans-serif;fill:#ddd}</style><text x="8" y="26" font-size="20">${esc(title)}</text>`;
  for (let i = 0; i < list.length; i++) {
    const r = list[i];
    const x = (i % cols) * cell, y = 40 + Math.floor(i / cols) * (cell + labelH);
    const img = await sharp(path.join(PUBLIC, r.src.replace(/^\//, ""))).resize(cell - 2 * pad, cell - 2 * pad, { fit: "contain", background: { ...THEME_BG, alpha: 1 } }).flatten({ background: THEME_BG }).png().toBuffer();
    composites.push({ input: img, left: x + pad, top: y + pad });
    const bad = (r.productLong ?? 0) < 700 || (r.detail50 ?? 1) < 0.05 || (r.fringePct ?? 0) > 5 || !r.transparent;
    svg += `<rect x="${x + 2}" y="${y + 2}" width="${cell - 4}" height="${cell + labelH - 4}" fill="none" stroke="${bad ? "#e5484d" : "#333"}" stroke-width="2"/>`;
    const l1 = `${r.slug} · ${r.role}${r.option ? ` · ${r.option}` : ""}`.slice(0, 40);
    const l2 = `${r.width}×${r.height} prod ${r.productLong} fill ${r.fillPct}% ${r.transparent ? "α" : "OPAQUE"}`;
    const l3 = `d50 ${r.detail50} sharp ${r.sharpCard} hard ${r.hardEdgePct ?? "-"} fr ${r.fringePct ?? "-"}`;
    svg += `<text x="${x + 8}" y="${y + cell + 12}" font-size="12">${esc(l1)}</text><text x="${x + 8}" y="${y + cell + 30}" font-size="12">${esc(l2)}</text><text x="${x + 8}" y="${y + cell + 48}" font-size="12">${esc(l3)}</text>`;
  }
  svg += `</svg>`;
  await sharp({ create: { width: W, height: H, channels: 3, background: { r: 30, g: 30, b: 32 } } })
    .composite([{ input: Buffer.from(svg), left: 0, top: 0 }, ...composites])
    .png()
    .toFile(out);
}

async function main() {
  const outDir = process.argv[2];
  if (!outDir) { console.error("usage: npx tsx scripts/image-quality-audit.ts <out-dir>"); process.exit(1); }
  fs.mkdirSync(path.join(outDir, "sheets"), { recursive: true });
  const images: ImgRow[] = [];
  const products: ProductRow[] = [];
  const add = async (r: Omit<ImgRow, "exists">) => images.push({ ...r, ...(await measure(r.src)), exists: (await measure(r.src)).exists ?? false } as ImgRow);

  for (const p of legacy) {
    const brand = getBrand(p.brandId)?.name ?? p.brandId;
    const card = p.assets.find((a) => a.role === "card");
    const details = p.assets.filter((a) => a.role === "detail");
    if (card) await add({ slug: p.slug, brand, source: "legacy", role: "card", option: null, src: card.src });
    for (const d of details) await add({ slug: p.slug, brand, source: "legacy", role: "detail", option: null, src: d.src });
    for (const v of p.colorVariants ?? []) if (v.image) await add({ slug: p.slug, brand, source: "legacy", role: "color", option: v.name, src: v.image.src });
    for (const v of p.flavorVariants ?? []) if (v.image) await add({ slug: p.slug, brand, source: "legacy", role: "flavor", option: v.name, src: v.image.src });
    if (p.lineupImage) await add({ slug: p.slug, brand, source: "legacy", role: "lineup", option: null, src: p.lineupImage.src });
    const priced = (LEGACY_APPROVED_PRICING as Record<string, { shipnityProductId: string | null }>)[p.slug];
    products.push({
      slug: p.slug, brand, source: "legacy", name: p.name, systemType: p.systemType,
      hidden: (p as { hiddenFromStorefront?: { since: string; reason: string } }).hiddenFromStorefront ?? null,
      isFlagship: p.isFlagship, shipnityProductId: priced?.shipnityProductId ?? null,
      card: card?.src ?? null, lineup: p.lineupImage?.src ?? null, details: details.length,
      colors: (p.colorVariants ?? []).map((v) => ({ name: v.name, image: v.image?.src ?? null })),
      flavors: (p.flavorVariants ?? []).map((v) => ({ name: v.name, image: v.image?.src ?? null })),
      otherOptions: [],
    });
  }

  for (const v of getPublishedProducts()) {
    if (v.image) await add({ slug: v.slug, brand: v.brandName, source: "product-master", role: "pm-card", option: null, src: v.image.src });
    if (v.variantFallbackImage) await add({ slug: v.slug, brand: v.brandName, source: "product-master", role: "pm-fallback", option: null, src: v.variantFallbackImage.src });
    for (const va of v.variants) if (va.image) await add({ slug: v.slug, brand: v.brandName, source: "product-master", role: "pm-variant", option: va.label, src: va.image.src });
    const axis = v.optionAxisCode ?? "none";
    const opts = v.variants.map((va) => ({ name: va.label, image: va.image?.src ?? null }));
    products.push({
      slug: v.slug, brand: v.brandName, source: "product-master", name: v.displayName, systemType: v.systemType,
      hidden: null, isFlagship: v.isFlagship, shipnityProductId: v.shipnityProductId,
      card: v.image?.src ?? null, lineup: null, details: 0,
      colors: axis === "color" ? opts : [], flavors: axis === "flavor" ? opts : [],
      otherOptions: axis !== "color" && axis !== "flavor" ? opts.map((o) => ({ axis, ...o })) : [],
    });
  }

  // Shipnity parents in stock that no site page maps to
  const mapped = new Set(products.map((p) => p.shipnityProductId).filter(Boolean) as string[]);
  const unlisted = activeCatalogSeed
    .filter((r) => !mapped.has(r.shipnityProductId))
    .map((r) => ({ shipnityProductId: r.shipnityProductId, name: r.name, children: r.children.map((c) => c.rawLabel) }));

  fs.writeFileSync(path.join(outDir, "images.json"), JSON.stringify(images, null, 1));
  fs.writeFileSync(path.join(outDir, "products.json"), JSON.stringify(products, null, 1));
  fs.writeFileSync(path.join(outDir, "shipnity-unlisted.json"), JSON.stringify(unlisted, null, 1));

  const byBrand = new Map<string, ImgRow[]>();
  for (const r of images) { const k = r.brand.replace(/[^\w-]+/g, "_"); byBrand.set(k, [...(byBrand.get(k) ?? []), r]); }
  for (const [k, rows] of byBrand) {
    for (let i = 0; i < rows.length; i += 48) await sheet(rows.slice(i, i + 48), path.join(outDir, "sheets", `${k}-${i / 48 + 1}.png`), `${k} ${i + 1}-${Math.min(rows.length, i + 48)} / ${rows.length}`);
  }
  console.log(`images ${images.length} (unique files ${measured.size}) · products ${products.length} · shipnity parents without a page ${unlisted.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
