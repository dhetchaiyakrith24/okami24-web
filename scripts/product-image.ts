/**
 * OKami24 — reusable product-image processing + quality-audit helper.
 *
 * Built from real, repeated pain points hit during the full-catalog media pass (2026-09-02):
 * every fix here structurally prevents a mistake that was previously caught only by a human
 * re-checking pixel dimensions by eye.
 *
 * WHY THIS EXISTS (read before reaching for raw `sharp` calls in a one-off script again):
 *
 * 1. `sharp(x).extract(region).trim()` — chaining `.extract()` directly into `.trim()` in one
 *    pipeline intermittently throws `Error: extract_area: bad extract area` in this project's
 *    sharp version (0.35.4), even with valid, in-bounds coordinates. Splitting it into two
 *    separate `sharp()` calls (extract → buffer → trim) reliably works. `extractThenTrim()` below
 *    does this for you — never chain them yourself.
 * 2. Every composite/crop step in the mission's first media pass quietly downscaled the final
 *    output well below the real resolution already achieved by upstream crop/trim steps (e.g. a
 *    791px-wide composite canvas resized down to 500px "to keep the file size reasonable" —
 *    caught and fixed in review). `checkQuality()` below makes that mistake visible immediately
 *    instead of requiring a manual re-audit.
 * 3. Several real source photos carried a retailer watermark baked into one corner of the frame.
 *    The correct fix is cropping to the watermark-free region of the SAME real photo — never
 *    discarding a genuine, correctly-identified source, and never generating a replacement.
 *    Nothing here does or enables generative image alteration — every function operates only on
 *    real, already-downloaded source bytes (crop / trim / resize / composite / re-encode).
 *
 * Usage as a library (from an ad hoc processing script):
 *   import { extractThenTrim, trim, compositeGrid, saveWebp, checkQuality } from "../scripts/product-image";
 *
 * Usage as a CLI:
 *   npx tsx scripts/product-image.ts audit [dir]   # quality-audit every image under public/assets/products (default) or [dir]
 *   npx tsx scripts/product-image.ts info <file>    # quality report for one file
 */

import sharp from "sharp";
import { readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";

// ===================================================================================
// Processing helpers
// ===================================================================================

export interface Region {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Plain trim is safe to call directly — the bug is specifically about chaining `.extract()`
 *  straight into `.trim()`. Kept here mainly so callers never need to import `sharp` directly. */
export async function trim(input: string | Buffer, opts: { threshold?: number } = {}): Promise<Buffer> {
  return sharp(input)
    .trim({ threshold: opts.threshold ?? 12 })
    .toBuffer();
}

/** The safe two-step replacement for `sharp(input).extract(region).trim()`. Use this any time you
 *  need to crop a sub-region (e.g. removing a watermark corner or isolating one panel of a
 *  multi-item source photo) AND trim residual whitespace — never chain `.extract().trim()`
 *  yourself, see the file header. */
export async function extractThenTrim(input: string | Buffer, region: Region, opts: { threshold?: number } = {}): Promise<Buffer> {
  const cropped = await sharp(input).extract(region).toBuffer();
  return sharp(cropped).trim({ threshold: opts.threshold ?? 12 }).toBuffer();
}

/** Resize that can only ever constrain, never distort or upscale, unless the caller explicitly
 *  opts in. `fit: "fill"` (the one sharp mode that stretches the aspect ratio) requires
 *  `allowDistortion: true` — a deliberate, visible opt-in rather than an easy-to-miss default. */
export async function resizeSafe(
  input: string | Buffer,
  opts: { width?: number; height?: number; fit?: "inside" | "fill"; allowDistortion?: boolean; allowUpscale?: boolean }
): Promise<Buffer> {
  const fit = opts.fit ?? "inside";
  if (fit === "fill" && !opts.allowDistortion) {
    throw new Error('resizeSafe: fit:"fill" stretches the aspect ratio — pass allowDistortion:true if this is really wanted, otherwise use fit:"inside"');
  }
  return sharp(input)
    .resize({ width: opts.width, height: opts.height, fit, withoutEnlargement: !opts.allowUpscale })
    .toBuffer();
}

export interface GridCell {
  input: string | Buffer;
  /** Optional caption/id, used only for error messages. */
  label?: string;
}

/** Lays out real, already-verified per-variant/per-panel photos into one grid image — the
 *  established, owner-approved way to represent a multi-variant product honestly when the
 *  storefront's Product Detail can't (or shouldn't, e.g. no confident per-variant evidence) show
 *  a variant-specific image. Every cell is placed at its own native size (never upscaled) and
 *  centered within its grid cell — this function never resizes a panel UP, only fits it down if
 *  it's larger than the cell. */
export async function compositeGrid(
  cells: GridCell[],
  opts: { columns: number; cellWidth: number; cellHeight: number; gap?: number; background?: { r: number; g: number; b: number; alpha?: number } }
): Promise<Buffer> {
  const gap = opts.gap ?? 12;
  const columns = opts.columns;
  const rows = Math.ceil(cells.length / columns);
  const canvasW = opts.cellWidth * columns + gap * (columns + 1);
  const canvasH = opts.cellHeight * rows + gap * (rows + 1);
  const background = opts.background ?? { r: 255, g: 255, b: 255, alpha: 1 };

  const composites = await Promise.all(
    cells.map(async (cell, i) => {
      const col = i % columns;
      const row = Math.floor(i / columns);
      const resized = await sharp(cell.input)
        .resize({ width: opts.cellWidth, height: opts.cellHeight, fit: "inside", withoutEnlargement: true })
        .toBuffer();
      const meta = await sharp(resized).metadata();
      if (!meta.width || !meta.height) {
        throw new Error(`compositeGrid: panel ${cell.label ?? i} failed to decode`);
      }
      const left = gap * (col + 1) + opts.cellWidth * col + Math.round((opts.cellWidth - meta.width) / 2);
      const top = gap * (row + 1) + opts.cellHeight * row + Math.round((opts.cellHeight - meta.height) / 2);
      return { input: resized, left, top };
    })
  );

  return sharp({ create: { width: canvasW, height: canvasH, channels: 4, background } })
    .composite(composites)
    .png()
    .toBuffer();
}

// ===================================================================================
// Quality checking — objective, dimension/format-based only. Deliberately NOT a subjective
// "does this look good" scorer (unreliable, not worth building) — every flag here is a plain
// measurement: pixel dimensions, aspect ratio, decodability, byte size.
// ===================================================================================

export type ProductImageRole = "card" | "detail" | "variant" | "og";

/** Minimum useful pixel width per role, based on this storefront's real rendered sizes
 *  (`PilotProductCard` renders up to 20vw, `PilotProductDetail`'s hero up to 42vw, OG/share
 *  images want to survive being embedded at social-card size). Deliberately a floor, not a
 *  target — plenty of real assets are larger. */
const MIN_WIDTH_BY_ROLE: Record<ProductImageRole, number> = {
  card: 400,
  detail: 300,
  variant: 300,
  og: 600,
};

export interface QualityFlag {
  level: "error" | "warn";
  message: string;
}

export interface QualityReport {
  ok: boolean;
  width: number;
  height: number;
  aspectRatio: number | null;
  sizeBytes: number;
  format: string | undefined;
  flags: QualityFlag[];
}

export interface QualityOptions {
  role?: ProductImageRole;
  /** The native/source resolution this asset was produced from, if known — lets checkQuality
   *  flag an output that's meaningfully smaller than what was actually available, the exact
   *  mistake this helper exists to catch. */
  nativeWidth?: number;
  nativeHeight?: number;
  /** Set true when a smaller-than-native output was a deliberate choice (e.g. a genuine
   *  low-resolution-only source, already documented) — suppresses the downscale warning. */
  intentionalResize?: boolean;
}

export async function checkQuality(input: string | Buffer, opts: QualityOptions = {}): Promise<QualityReport> {
  const flags: QualityFlag[] = [];
  let meta: Awaited<ReturnType<ReturnType<typeof sharp>["metadata"]>>;
  try {
    meta = await sharp(input).metadata();
  } catch (e) {
    return {
      ok: false,
      width: 0,
      height: 0,
      aspectRatio: null,
      sizeBytes: 0,
      format: undefined,
      flags: [{ level: "error", message: `could not decode image: ${(e as Error).message}` }],
    };
  }

  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  if (!width || !height) {
    flags.push({ level: "error", message: "decoded with zero width/height — broken/invalid image" });
  }

  const aspectRatio = width && height ? width / height : null;

  if (opts.role && width) {
    const min = MIN_WIDTH_BY_ROLE[opts.role];
    if (width < min) {
      flags.push({ level: "warn", message: `${width}px wide is under the ${min}px floor for role "${opts.role}" — likely undersized for its storefront use` });
    }
  }

  if (opts.nativeWidth && opts.nativeHeight && width && height && !opts.intentionalResize) {
    const nativeAspect = opts.nativeWidth / opts.nativeHeight;
    if (width < opts.nativeWidth * 0.9 && height < opts.nativeHeight * 0.9) {
      flags.push({
        level: "warn",
        message: `output (${width}x${height}) is smaller than the native source (${opts.nativeWidth}x${opts.nativeHeight}) with no intentionalResize flag — check the final resize step isn't discarding real resolution`,
      });
    }
    if (aspectRatio && Math.abs(aspectRatio - nativeAspect) / nativeAspect > 0.02) {
      flags.push({
        level: "warn",
        message: `aspect ratio ${aspectRatio.toFixed(3)} differs from the native source's ${nativeAspect.toFixed(3)} by more than 2% — confirm this is an intentional crop, not accidental distortion`,
      });
    }
  }

  const sizeBytes = Buffer.isBuffer(input) ? input.length : statSync(input).size;
  if (sizeBytes < 2000 && width > 50) {
    flags.push({ level: "warn", message: `only ${sizeBytes} bytes for a ${width}x${height} image — suspiciously small, verify it isn't corrupt or over-compressed` });
  }

  return {
    ok: !flags.some((f) => f.level === "error"),
    width,
    height,
    aspectRatio,
    sizeBytes,
    format: meta.format,
    flags,
  };
}

/** Writes a buffer as webp and immediately re-reads it back through `checkQuality` — catches a
 *  truncated/corrupt write instead of trusting that `toFile()` not throwing means the output is
 *  actually valid. */
export async function saveWebp(buffer: Buffer, destPath: string, opts: { quality?: number } & QualityOptions = {}): Promise<QualityReport> {
  await sharp(buffer)
    .webp({ quality: opts.quality ?? 90 })
    .toFile(destPath);
  return checkQuality(destPath, opts);
}

// ===================================================================================
// Catalog-wide audit — walks every image under a directory (default: public/assets/products)
// and reports quality flags per file, so a future catalog session can find weak assets
// systematically instead of by eye. Role is inferred from the path convention this project
// already uses: files under a `variants/` folder are "variant", `card.webp` is "card", anything
// else defaults to "detail".
// ===================================================================================

export interface AuditRow {
  file: string;
  role: ProductImageRole;
  report: QualityReport;
}

const IMAGE_EXTENSIONS = new Set([".webp", ".jpg", ".jpeg", ".png"]);

function inferRole(filePath: string): ProductImageRole {
  const parts = filePath.split(path.sep);
  if (parts.includes("variants")) return "variant";
  if (path.basename(filePath).startsWith("card.")) return "card";
  return "detail";
}

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) out.push(...walk(full));
    else if (IMAGE_EXTENSIONS.has(path.extname(entry).toLowerCase())) out.push(full);
  }
  return out;
}

export async function auditCatalogAssets(rootDir: string): Promise<AuditRow[]> {
  if (!existsSync(rootDir)) throw new Error(`auditCatalogAssets: directory not found: ${rootDir}`);
  const files = walk(rootDir);
  const rows: AuditRow[] = [];
  for (const file of files) {
    const role = inferRole(file);
    const report = await checkQuality(file, { role });
    rows.push({ file, role, report });
  }
  return rows;
}

// ===================================================================================
// CLI
// ===================================================================================

async function printAudit(dir: string) {
  const rows = await auditCatalogAssets(dir);
  let flaggedCount = 0;
  for (const row of rows) {
    if (row.report.flags.length === 0) continue;
    flaggedCount++;
    const rel = path.relative(process.cwd(), row.file);
    console.log(`\n${rel}  (${row.role}, ${row.report.width}x${row.report.height}, ${Math.round(row.report.sizeBytes / 1024)}KB)`);
    for (const flag of row.report.flags) {
      console.log(`  [${flag.level.toUpperCase()}] ${flag.message}`);
    }
  }
  console.log(`\n${rows.length} images scanned under ${dir}, ${flaggedCount} flagged, ${rows.length - flaggedCount} clean.`);
  if (flaggedCount > 0) {
    // Real finding from the storefront mission (2026-09-02): the width-floor WARN below fires
    // on plenty of genuinely excellent narrow/tall device photography (an Argus/Vinci-shaped pod
    // is legitimately ~150-300px wide even at good resolution) — width alone cannot tell "small
    // canvas" apart from "narrow product." Treat every WARN as "go look at it," never as an
    // automatic replace-this-file signal — see the Media Quality Standard in
    // shipnity-seed/README.md.
    console.log(`(WARN-level flags are visual-review candidates, not automatic replacements — see the Media Quality Standard in shipnity-seed/README.md.)`);
  }
  const errorCount = rows.filter((r) => r.report.flags.some((f) => f.level === "error")).length;
  if (errorCount > 0) {
    console.error(`${errorCount} image(s) have ERROR-level flags (broken/undecodable).`);
    process.exitCode = 1;
  }
}

async function printInfo(file: string) {
  const role = inferRole(file);
  const report = await checkQuality(file, { role });
  console.log(JSON.stringify({ file, role, ...report }, null, 2));
  if (!report.ok) process.exitCode = 1;
}

async function main() {
  const [cmd, arg] = process.argv.slice(2);
  if (cmd === "audit") {
    await printAudit(arg ?? path.join("public", "assets", "products"));
  } else if (cmd === "info" && arg) {
    await printInfo(arg);
  } else {
    console.log(
      [
        "Usage:",
        "  npx tsx scripts/product-image.ts audit [dir]   # quality-audit every image under [dir] (default public/assets/products)",
        "  npx tsx scripts/product-image.ts info <file>    # quality report for one file",
      ].join("\n")
    );
    process.exitCode = cmd ? 1 : 0;
  }
}

// Cross-platform "was this file run directly" check — Windows `file://C:/...` URL vs.
// `import.meta.url` comparison is fragile with drive-letter/slash differences, so just match on
// the script's own basename instead.
const isMainModule = process.argv[1]?.replace(/\\/g, "/").endsWith("scripts/product-image.ts");
if (isMainModule) {
  main();
}
