/**
 * OKami24 — quality-aware Product Detail media sizing.
 *
 * WHY THIS EXISTS
 * ----------------
 * Product Detail's hero previously always rendered the product image with `fill` +
 * `object-contain` inside a large (~42vw on desktop, `aspect-[4/5]`) box. That is the right
 * behavior for a genuinely high-resolution source — it fills the space and looks intentional. It
 * is the WRONG behavior for a small/weak source: `fill` stretches the image's real pixels to
 * cover the box regardless of how few pixels it actually has, turning a merely-small photo into
 * an obviously blurry one. Two real catalog assets (coil-56 at 131×205, coil-74 at 320×427) were
 * reported by the owner as looking broken specifically because of this.
 *
 * THE RULE — ASPECT-AWARE, NOT WIDTH-ONLY
 * -----------------------------------------
 * A naive "native width below N px" floor was tried first and rejected: this catalog's real
 * products are mostly tall, narrow shapes (pens, pods, coils), so a genuinely sharp, well-cropped
 * photo of one can have a small native WIDTH purely because the product itself is narrow — the
 * same "width alone can't distinguish a small source from a correctly narrow product" trap
 * `scripts/product-image.ts`'s own card-role audit already documented. A UWELL Caliburn G3 Pro
 * replacement sourced during this pass is a real example: cropped tight, it comes out to roughly
 * 148×546 — narrow, but sharp — and a flat width floor would have wrongly shrunk it.
 *
 * The correct question is not "is the width small" but "would `object-contain` have to enlarge
 * this past a point where enlargement becomes visible" — which depends on BOTH dimensions against
 * the box's actual aspect ratio (4:5), exactly the same math the browser itself uses for
 * `object-contain`. `HERO_BOX_WIDTH`/`HERO_BOX_HEIGHT` below model a representative large-desktop
 * rendering of that box (~700×875, matching `aspect-[4/5]` at a size a big monitor really renders
 * it at); `MAX_ACCEPTABLE_UPSCALE` is a deliberately conservative ceiling — beyond a ~25% enlargement,
 * softening starts being visible even on a non-retina display, and the mission's own guidance
 * ("use a smaller intentional presentation size when that produces a cleaner result") favors
 * erring toward NOT upscaling rather than tolerating borderline enlargement.
 *
 * At or under that ceiling, fill the hero box as before (unchanged behavior for the large majority
 * of assets, which are genuinely large/well-proportioned enough for this). Above it, render the
 * image at its own intrinsic pixel size instead — never upscaled — centered within the same
 * visual hero area so the layout stays balanced. A smaller-but-sharp image reads as an
 * intentional presentation choice; a stretched-blurry one reads as a bug.
 *
 * This is a genuinely reusable rule, not a per-SKU override: nothing here names a product. Any
 * asset that is ever replaced with a sharper/larger source automatically starts filling the hero
 * again (or stops, if a future asset is ever smaller) — the file on disk is the only source of
 * truth, never a value that could go stale.
 *
 * CARD PRESENTATION IS UNCHANGED
 * -------------------------------
 * `ProductCard`/`PilotProductCard` are not touched by this module. The owner explicitly noted
 * card-size presentation is "acceptable enough" even for the weakest sources — the defect is
 * specific to Product Detail's much larger box, so the fix is scoped to Product Detail only.
 *
 * SERVER-ONLY
 * -----------
 * This module reads files from `public/` with `sharp` and must only ever be imported from a
 * server component (an async page/layout, never a `"use client"` file) or another server-only
 * module. The page computes an `ImageDisplayInfo` (or a map of several, when a variant picker can
 * swap the displayed image client-side) and passes the plain data down as props — the client
 * components that actually render `<Image>` never import this module or `sharp` themselves.
 *
 * SOURCING & CLEANUP METHODOLOGY (owner quality-review pass, 2026-09-02)
 * ------------------------------------------------------------------------
 * Three assets (caliburn-g3-pro, argus-g3-mini, coil-74's card) were rejected TWICE — the first
 * correction pass fixed the wrong problem (treated "soft/small" as the defect when the real defect
 * was background contamination, a cut-off crop, or box/packaging context) or claimed a clean crop
 * that, on direct re-inspection, the shipped file didn't actually match. The durable lessons,
 * generalized for every future asset in this catalog:
 *
 * 1. SOURCE PRIORITY, checked in order, every time: (a) the manufacturer's own official site —
 *    but verify it actually has a clean ISOLATED shot, not just marketing banners/spin-sequences
 *    with decorative overlays (myuwell.com and shop.voopoo.com both frequently do NOT); (b) a
 *    major reputable retailer's own studio photography (e.g. Element Vape) — real product photos,
 *    not marketplace/screenshot-style listings; (c) only then, an OKami24-built presentation
 *    asset assembled from verified real media. Never skip straight to (c).
 *
 * 2. RETAILER WATERMARKS ARE A CLEANUP PROBLEM, NOT A REJECTION REASON. A studio photo with a
 *    diamond/wordmark watermark in the corner is still real, exact product media — the fix is to
 *    remove the mark, never to accept a worse (smaller/angled/box-included) photo just because it
 *    happens to lack one. Two concrete techniques, both "truthful repair" (real pixels from the
 *    same real photo, never invented geometry) and both used this pass:
 *      - Pure background overlap: composite a plain fill in the exact background color (sample it
 *        — real product photography is often NOT pure #ffffff) over the watermark pixels.
 *      - Overlap onto the product itself: clone a same-photo, watermark-free patch of the
 *        equivalent surface (directly above/below the mark on a uniform panel, or the mirrored
 *        opposite side for a bilaterally-symmetric device via a horizontal flip) and composite it
 *        with a softly feathered alpha mask (blur an SVG rect mask, `dest-in` blend) so the seam
 *        doesn't read as a hard rectangle at real display size. Verify by re-inspecting the exact
 *        pixels afterward — do not trust that a crop/composite call "worked" without looking.
 *
 * 3. NEVER CROP AWAY PART OF THE PRODUCT TO DODGE A WATERMARK. If the mark overlaps the product
 *    and cannot be cleanly patched, that source is disqualified — go back to step 1, do not ship a
 *    device with its base/mouthpiece/edge trimmed off. "Complete product, watermark patched" beats
 *    "incomplete product, watermark avoided" every time.
 *
 * 4. RE-VERIFY THE SHIPPED FILE, NOT THE INTENDED CROP. A code comment describing what a crop was
 *    "supposed" to show is worthless if the actual bytes on disk don't match it — this exact gap
 *    (comment says clean, file is not) is what let both rejected assets ship the first time. Open
 *    the real file at real display size after every fix, before writing the provenance comment.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";

/** A representative large-desktop rendering of the real `aspect-[4/5]` hero container — see this
 *  file's header for why the fill-vs-intrinsic decision must be aspect-aware, not a flat width
 *  floor. Changing these changes what counts as "would visibly upscale" project-wide. */
const HERO_BOX_WIDTH = 700;
const HERO_BOX_HEIGHT = 875;

/** How much `object-contain` enlargement is tolerated before switching to intrinsic sizing.
 *  Deliberately conservative — see this file's header comment. */
const MAX_ACCEPTABLE_UPSCALE = 1.25;

/** A width floor still worth flagging in `scripts/product-image.ts`'s coarse-grained automated
 *  audit regardless of aspect ratio — an asset narrower than this is almost certainly
 *  under-resourced no matter the product's real shape. This is intentionally a much simpler,
 *  separate heuristic from the aspect-aware runtime logic below: the audit tool has no box to
 *  reason about, so it can only sanity-check "is this obviously too small," not "would this
 *  specific box visibly upscale it." */
export const MIN_ABSOLUTE_DETAIL_WIDTH = 400;

export interface ImageDisplayInfo {
  width: number;
  height: number;
  /** True when filling the hero container would not visibly upscale this source (within
   *  `MAX_ACCEPTABLE_UPSCALE`). False means: render at intrinsic size instead. */
  fillHero: boolean;
  /** Long side of the product itself (the alpha bounding box), in file pixels — what OptionScaledCard needs to draw a
   *  card at its option photos' size (owner 22/10). Absent when the file has no alpha box to measure. */
  productLong?: number;
}

const cache = new Map<string, ImageDisplayInfo | null>();

/** Resolves a `/assets/...`-style public path to its real pixel dimensions, reading the actual
 *  file under `public/` — never a value that could go stale relative to the asset itself.
 *  Returns `null` if the file can't be read/decoded (caller should fall back to the previous,
 *  always-fill behavior rather than fail the page). */
export async function getImageDisplayInfo(publicSrc: string): Promise<ImageDisplayInfo | null> {
  if (cache.has(publicSrc)) return cache.get(publicSrc) ?? null;
  try {
    const sharp = (await import("sharp")).default;
    const filePath = path.join(process.cwd(), "public", publicSrc.replace(/^\//, ""));
    const buf = await readFile(filePath);
    const meta = await sharp(buf).metadata();
    if (!meta.width || !meta.height) {
      cache.set(publicSrc, null);
      return null;
    }
    // Same math the browser applies for `object-contain`: the image is constrained by whichever
    // dimension hits the box first. If that implied scale factor is at or under our tolerance,
    // filling is safe; otherwise it would visibly enlarge the source.
    const scaleToFill = Math.min(HERO_BOX_WIDTH / meta.width, HERO_BOX_HEIGHT / meta.height);
    const info: ImageDisplayInfo = { width: meta.width, height: meta.height, fillHero: scaleToFill <= MAX_ACCEPTABLE_UPSCALE };
    if (meta.hasAlpha) {
      // trim() on the alpha channel alone = the product's bounding box (the transparent margin is the same value as the corner).
      const { info: box } = await sharp(buf).extractChannel(3).trim({ threshold: 10 }).toBuffer({ resolveWithObject: true });
      if (box.width < meta.width || box.height < meta.height) info.productLong = Math.max(box.width, box.height);
    }
    cache.set(publicSrc, info);
    return info;
  } catch {
    cache.set(publicSrc, null);
    return null;
  }
}

/** Batch form for a page that can show several different images client-side (a ProductMaster
 *  variant picker swaps `displayImage` without a navigation) — computes every candidate once on
 *  the server and hands the client component a plain lookup map keyed by `src`. Entries that
 *  couldn't be read are simply absent, so a lookup miss is the caller's signal to fall back to
 *  the previous always-fill behavior for that one image. */
export async function buildImageDisplayMap(srcs: (string | undefined)[]): Promise<Record<string, ImageDisplayInfo>> {
  const unique = [...new Set(srcs.filter((s): s is string => Boolean(s)))];
  const entries = await Promise.all(unique.map(async (s) => [s, await getImageDisplayInfo(s)] as const));
  const map: Record<string, ImageDisplayInfo> = {};
  for (const [s, info] of entries) if (info) map[s] = info;
  return map;
}
