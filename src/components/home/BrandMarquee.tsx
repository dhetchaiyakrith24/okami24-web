import Link from "next/link";
import { getBrand } from "@/data/brands";

/**
 * The slow brand strip under the hero (mobile round C; the owner loved its motion — LESSONS ช5).
 *
 * Owner 19/10: every name links to its brand page, the big brands we sell are in, a calmer premium look at every width.
 * Owner 20/10: "ให้ใช้ฟอนต์หรือ Logo ของแบรนด์นั้นๆ เลย" → designer option A, owner "Logo แบบ A": each brand's OFFICIAL logo,
 * all white at one opacity, sized to equal optical weight by one rule; hover / focus = full white + a short ember line.
 * Picked by products on the site + what people search (GSC): WOTOFO, KS and the one-product brands stay out.
 *
 * Files (public/assets/brands/, white on transparent, trimmed to their ink, nothing redrawn — sources):
 * VOOPOO / SALTHUB / INFY = the product-page logos (sources in src/lib/brand-logos.ts) · UWELL = myuwell.com header SVG ·
 * RELX = relxnow.com header inline SVG · IQOS = iqos.com header SVG, letters only (the scroll pictogram left out) ·
 * JOIWAY = myjoiway.id header file (2000 px), the word cut out from between its two green bars (owner 20/10) ·
 * ESKO BAR = eskobar.com logo file. SVG paths are unchanged, only the fill set to white (read 20/10/2026).
 *
 * The first 8 logos are real links inside a <nav> (alt = brand name = the link's name); the loop copies are aria-hidden,
 * alt="" and out of the tab order. Hover / focus pauses the strip; reduced motion = a still row scrolled by hand (globals.css).
 */
const STRIP_LOGOS = [
  { id: "voopoo", src: "/assets/brands/voopoo-logo.png", ratio: 728 / 120 },
  { id: "uwell", src: "/assets/brands/uwell-logo.svg", ratio: 144 / 30 },
  { id: "salthub", src: "/assets/brands/salthub-logo.png", ratio: 370 / 120 },
  { id: "relx", src: "/assets/brands/relx-logo.svg", ratio: 120 / 24 },
  { id: "iqos", src: "/assets/brands/iqos-logo.svg", ratio: 80.04 / 21.19 },
  { id: "joiway", src: "/assets/brands/joiway-wordmark.png", ratio: 584 / 120 },
  { id: "esko-bar", src: "/assets/brands/esko-bar-logo.png", ratio: 761 / 120 },
  { id: "infy", src: "/assets/brands/infy-logo.png", ratio: 386 / 120 },
] as const;

/** Equal optical weight (designer 20/10): same ink AREA for every logo, then a height floor/cap and a width cap. */
function fit(ratio: number, area: number, hMin: number, hCap: number, wCap: number) {
  let h = Math.min(hCap, Math.max(hMin, Math.sqrt(area / ratio)));
  let w = h * ratio;
  if (w > wCap) {
    w = wCap;
    h = w / ratio;
  }
  return { w: Math.round(w), h: Math.round(h * 10) / 10 };
}

export function BrandMarquee() {
  const items = STRIP_LOGOS.flatMap((logo) => {
    const brand = getBrand(logo.id);
    if (!brand) return [];
    const m = fit(logo.ratio, 1600, 14, 26, 104);
    const d = fit(logo.ratio, 3600, 18, 36, 150);
    return [{ ...logo, brand, m, d }];
  });
  // Two identical halves (the track travels exactly -50%); each half holds the list twice so even 1440 never shows a gap.
  const half = [...items, ...items];
  const track = [...half, ...half];

  return (
    <nav aria-label="Brands" className="okami-brand-strip relative overflow-hidden border-y border-surface-border-soft bg-surface-1/40">
      <div className="okami-brand-strip-track flex w-max items-center gap-10 px-5 lg:gap-20 lg:px-10">
        {track.map((item, i) => {
          const clone = i >= items.length;
          return (
            <Link
              key={`${item.id}-${i}`}
              href={`/brands/${item.brand.slug}`}
              tabIndex={clone ? -1 : undefined}
              aria-hidden={clone || undefined}
              data-clone={clone || undefined}
              className="okami-brand-logo relative inline-flex min-h-11 min-w-11 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
              style={{ "--mw": `${item.m.w}px`, "--mh": `${item.m.h}px`, "--dw": `${item.d.w}px`, "--dh": `${item.d.h}px` } as React.CSSProperties}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- tiny white logo files (SVG / PNG) with explicit sizes; nothing for the optimizer to do */}
              <img src={item.src} alt={clone ? "" : item.brand.name} width={item.m.w} height={item.m.h} loading={clone ? "lazy" : "eager"} decoding="async" draggable={false} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
