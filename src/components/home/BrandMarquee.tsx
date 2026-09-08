import { brandName } from "@/lib/utils";

/**
 * Mobile round C — MOBILE_SPEC [M1], last bullet: on desktop the cinematic intro gives UWELL,
 * VOOPOO and SALTHUB a full screen each, one after another. The owner's instruction for phones is
 * to keep the three names but demote them to "a slowly scrolling logo strip under the hero"
 * instead of three full screens the visitor has to sit through.
 *
 * Wordmarks, not image logos, on purpose: `public/brand/` holds exactly one file
 * (`okami-logo-red.png`, OKami24's own mark) — there is no licensed UWELL/VOOPOO/SALTHUB logo art
 * in the repo, and inventing or scraping one is not this round's call to make. The three names are
 * read from `src/data/brands.ts` through `brandName()`, so this file introduces no new copy.
 *
 * Phone/tablet only (`lg:hidden`), which is the same 64rem cut-off M2–M4 use: at `lg` the strip is
 * `display: none` and the desktop intro still tells the same story full-screen.
 *
 * The strip is `aria-hidden`: it is decoration that repeats each name four times, and every brand
 * is already reachable as a real link from the header and the brand pages. A screen reader gains
 * nothing from "UWELL VOOPOO SALTHUB" read four times over.
 */
const MARQUEE_BRAND_IDS = ["uwell", "voopoo", "salthub"] as const;

export function BrandMarquee() {
  const names = MARQUEE_BRAND_IDS.map((id) => brandName(id));
  // Two identical halves: the track scrolls exactly -50%, so the second half lands where the first
  // started and the loop has no seam. Each half repeats the three names twice so a 390px-wide
  // phone is never looking at a gap.
  const half = [...names, ...names];

  return (
    <div
      aria-hidden
      className="okami-brand-marquee relative overflow-hidden border-b border-surface-border-soft bg-surface-1/40 py-4 lg:hidden"
    >
      <div className="okami-brand-marquee-track flex w-max items-center gap-10 pl-10">
        {[...half, ...half].map((name, i) => (
          <span key={`${name}-${i}`} className="label-mono text-sm text-foreground-dim">
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
