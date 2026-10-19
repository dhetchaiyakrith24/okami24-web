import Link from "next/link";
import { getBrand } from "@/data/brands";

/**
 * The slow brand strip under the hero (mobile round C; the owner loved its motion — LESSONS ช5).
 *
 * Owner 19/10: every name now links to its brand page, the big brands we sell were added, and the strip got a calmer,
 * more premium look; it shows at every width (it used to be phone/tablet only). Designer 19/10, option A:
 * wordmarks, not logos — 3 of the 8 brands (RELX, IQOS, ESKO BAR) have no logo file and a mixed row looks uneven.
 * Picked by products on the site + what people search (GSC): WOTOFO, KS and the one-product brands stay out so the
 * strip does not get busy.
 *
 * The first 8 names are real links inside a <nav>; the loop copies are aria-hidden and out of the tab order, so a
 * screen reader hears 8 links once. Hover / focus pauses the strip; reduced motion turns it into a still row that
 * scrolls by hand (globals.css).
 */
const STRIP_BRAND_IDS = ["voopoo", "uwell", "salthub", "relx", "iqos", "joiway", "esko-bar", "infy"] as const;

export function BrandMarquee() {
  const items = STRIP_BRAND_IDS.map((id) => getBrand(id)).filter((b): b is NonNullable<typeof b> => Boolean(b));
  // Two identical halves (the track travels exactly -50%); each half holds the list twice so even 1440 never shows a gap.
  const half = [...items, ...items];
  const track = [...half, ...half];

  return (
    <nav aria-label="Brands" className="okami-brand-strip relative overflow-hidden border-y border-surface-border-soft bg-surface-1/40">
      <div className="okami-brand-strip-track flex w-max items-center gap-8 px-4 lg:gap-14">
        {track.map((b, i) => {
          const clone = i >= items.length;
          return (
            <span key={`${b.id}-${i}`} className="flex items-center gap-8 lg:gap-14" aria-hidden={clone || undefined} data-clone={clone || undefined}>
              <Link
                href={`/brands/${b.slug}`}
                tabIndex={clone ? -1 : undefined}
                lang="en"
                className="inline-flex min-h-11 items-center px-2 font-sans text-[15px] font-semibold uppercase tracking-[0.18em] text-foreground-dim transition-colors duration-200 hover:text-foreground focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember lg:text-lg"
              >
                {b.name}
              </Link>
              <span aria-hidden className="size-1 rounded-full bg-ember/70" />
            </span>
          );
        })}
      </div>
    </nav>
  );
}
