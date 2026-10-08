/**
 * OKami24 image audit (read-only) — produces the data behind docs/IMAGE_AUDIT.md.
 * Run from the project root, in two steps:
 *   npx tsx scripts/image-audit.ts _incoming/image-audit.json
 *   node scripts/image-audit-md.js _incoming/image-audit.json docs/IMAGE_AUDIT.md
 * (or `npm run audit:gaps`, which does both). Counts hidden products too — a hidden product is
 * still a gap to fill.
 * Owner's revised rules (2026-09-04):
 *  - product cut-out images (card / device color): pass if LONG side >= 900px
 *  - homepage/hero images: pass if width >= 1920px
 *  - layer 2 counts DEVICE COLORS only (flavor options never count as missing)
 *  - layer 4 (gallery) is reported as info only, excluded from totals
 */
import path from "node:path";
import fs from "node:fs";
import sharp from "sharp";
// audit the FULL catalog including products hidden from the storefront — a hidden product is still a gap to fill
import { catalogIncludingHidden as allProducts } from "../src/data/products/index";
import { getBrand } from "../src/data/brands";
import { getPublishedProducts } from "../src/data/shipnity-seed/storefront-bridge";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
sharp.cache(false); // never hold decoded files open (Windows: blocks later overwrites)

const MIN_LONG_PRODUCT = 800; // owner lowered from 900 → 800 (2026-09-04, "ขยาย 5% ไม่เห็นความต่าง")
const MIN_WIDTH_HOME = 1920;

type Layer = "card" | "variant" | "home";
interface Row {
  slug: string;
  brandId: string;
  brandName: string;
  source: "legacy" | "product-master" | "site";
  layer: Layer;
  item: string;
  src: string | null;
  exists: boolean;
  width: number | null;
  height: number | null;
  pass: boolean | null; // against the layer's rule
  alpha: "transparent" | "opaque-alpha" | "no-alpha" | null;
  transparentPct: number | null;
  note?: string;
}

const cache = new Map<string, Promise<Partial<Row>>>();
async function measure(src: string | null, layer: Layer): Promise<Partial<Row>> {
  if (!src) return { exists: false, width: null, height: null, pass: null, alpha: null, transparentPct: null };
  const key = `${layer}:${src}`;
  if (!cache.has(key)) {
    cache.set(
      key,
      (async () => {
        const file = path.join(PUBLIC, src.replace(/^\//, ""));
        if (!fs.existsSync(file)) return { exists: false, width: null, height: null, pass: null, alpha: null, transparentPct: null, note: "ไฟล์ไม่มีบนดิสก์ (โค้ดอ้างถึงแต่หาย)" };
        const meta = await sharp(file).metadata();
        const w = meta.width ?? 0;
        const h = meta.height ?? 0;
        let alpha: Row["alpha"] = "no-alpha";
        let transparentPct: number | null = null;
        if (meta.hasAlpha) {
          const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
          const ch = info.channels;
          let transparent = 0;
          for (let i = ch - 1; i < data.length; i += ch) if (data[i] < 255) transparent++;
          transparentPct = Math.round((transparent / (info.width * info.height)) * 1000) / 10;
          alpha = transparent > 0 ? "transparent" : "opaque-alpha";
        }
        const pass = layer === "home" ? w >= MIN_WIDTH_HOME : Math.max(w, h) >= MIN_LONG_PRODUCT;
        return { exists: true, width: w, height: h, pass, alpha, transparentPct };
      })()
    );
  }
  return cache.get(key)!;
}

async function main() {
  const out = process.argv[2];
  const rows: Row[] = [];
  const push = async (base: Omit<Row, "exists" | "width" | "height" | "pass" | "alpha" | "transparentPct">) => {
    const m = await measure(base.src, base.layer);
    rows.push({ ...base, ...(m as Row) });
  };
  const brandOf = (id: string) => ({ brandId: id, brandName: getBrand(id)?.name ?? id });

  // info-only counters
  const info = { flavorTotal: 0, flavorWithPhoto: 0, lineupTotal: 0, lineupWithPhoto: 0, pmFlavorTotal: 0, pmFlavorWithPhoto: 0, pmNonColorAxes: {} as Record<string, number>, galleryLegacy: [] as { slug: string; count: number }[], singleColorSkipped: [] as string[] };

  // ---------- LEGACY ----------
  for (const p of allProducts) {
    const b = brandOf(p.brandId);
    const card = p.assets.find((a) => a.role === "card");
    const hidden = (p as { hiddenFromStorefront?: { since: string } }).hiddenFromStorefront;
    await push({ slug: p.slug, ...b, source: "legacy", layer: "card", item: (card ? `card (${card.kind})` : "card") + (hidden ? " — ซ่อนจากหน้าร้านอยู่" : ""), src: card?.src ?? null, note: card ? undefined : hidden ? `ไม่มีรูปการ์ด → ซ่อนจากหน้าร้านตั้งแต่ ${hidden.since} (IMAGE_SPEC §4)` : "ไม่มีรูปการ์ด → เว็บใช้ภาพวาด DeviceGlyph แทน" });

    const colors = p.colorVariants ?? [];
    if (colors.length >= 2) {
      for (const v of colors) await push({ slug: p.slug, ...b, source: "legacy", layer: "variant", item: `สี: ${v.name}`, src: v.image?.src ?? null, note: v.image ? undefined : "ไม่มีรูปสีนี้ → แสดงแค่จุดสี (swatch)" });
    } else if (colors.length === 1) info.singleColorSkipped.push(p.slug);
    const flavors = p.flavorVariants ?? [];
    info.flavorTotal += flavors.length;
    info.flavorWithPhoto += flavors.filter((f) => f.image).length;
    if (colors.length + flavors.length >= 2) { info.lineupTotal++; if (p.lineupImage) info.lineupWithPhoto++; }
    const details = p.assets.filter((a) => a.role === "detail" && a.kind === "official-photo");
    if (details.length) info.galleryLegacy.push({ slug: p.slug, count: details.length });
  }

  // ---------- PRODUCT MASTER (published only) ----------
  for (const v of getPublishedProducts()) {
    const b = { brandId: v.brandId ?? "", brandName: v.brandName ?? "" };
    await push({ slug: v.slug, ...b, source: "product-master", layer: "card", item: "card", src: v.image?.src ?? null, note: v.image ? undefined : "ไม่มีรูปการ์ด" });
    const axis = v.optionAxisCode;
    const variants = v.variants ?? [];
    if (axis === "color") {
      if (variants.length >= 2) {
        for (const va of variants) await push({ slug: v.slug, ...b, source: "product-master", layer: "variant", item: `สี: ${va.label}`, src: va.image?.src ?? null, note: va.image ? undefined : "ไม่มีรูปสีนี้ → ใช้รูปการ์ดแทน" });
      } else if (variants.length === 1) info.singleColorSkipped.push(v.slug);
    } else if (axis) {
      info.pmNonColorAxes[axis] = (info.pmNonColorAxes[axis] ?? 0) + variants.length;
      if (axis === "flavor") { info.pmFlavorTotal += variants.length; info.pmFlavorWithPhoto += variants.filter((x) => x.image).length; }
    }
  }

  // ---------- HOMEPAGE / SITE ----------
  const site: { item: string; src: string }[] = [
    { item: "cinematic Scene2 (UWELL) — Caliburn G5", src: "/assets/products/caliburn-g5/card.png" },
    { item: "cinematic Scene2 (UWELL) — Caliburn G4 Pro KOKO", src: "/assets/products/caliburn-g4-pro-koko/card.png" },
    { item: "cinematic Scene3 (VOOPOO) — ARGUS G4", src: "/assets/products/argus-g4/card.webp" },
    { item: "cinematic Scene3 (VOOPOO) — DRAG 6", src: "/assets/products/drag-6/card.png" },
    { item: "cinematic Scene4 (Hero) — M Bar 10K", src: "/assets/products/m-bar-10k/card.webp" },
    { item: "cinematic Scene4 (Hero) — M Switch Kit", src: "/assets/products/m-switch-kit/hero-scene4.webp" },
    { item: "โลโก้ (Header/Footer/Intro/Finale)", src: "/brand/okami-logo-red.png" },
  ];
  for (const s of site) await push({ slug: "(หน้าหลัก)", brandId: "-", brandName: "-", source: "site", layer: "home", item: s.item, src: s.src });
  for (const p of allProducts.filter((x) => x.isFlagship)) {
    const card = p.assets.find((a) => a.role === "card");
    await push({ slug: p.slug, ...brandOf(p.brandId), source: "site", layer: "home", item: "flagship rail/hero (ใช้รูปการ์ดชั้น 1)", src: card?.src ?? null, note: card ? undefined : "flagship ไม่มีรูปการ์ด → หน้าหลักโชว์ DeviceGlyph" });
  }

  const published = getPublishedProducts();
  fs.writeFileSync(out, JSON.stringify({ generatedAt: new Date().toISOString(), minLongProduct: MIN_LONG_PRODUCT, minWidthHome: MIN_WIDTH_HOME, legacyCount: allProducts.length, publishedCount: published.length, info, rows }, null, 2));
  console.log(`rows: ${rows.length} · legacy ${allProducts.length} · published ${published.length} · info ${JSON.stringify(info)}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
