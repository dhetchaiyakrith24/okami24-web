"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Swipe-to-select product gallery for phones — MOBILE_SPEC M2.2/M2.3, chat A (2026-09-08).
 *
 * One slide per colour/flavour option (or a single slide when the product has no options). The
 * slide that is in view IS the selected option — swiping is a real selection, the same one the
 * chips make, not a preview (spec 2.2). Both directions stay in sync:
 *   - swipe → the parent's `onSelect(id)` fires once the scroll settles on a slide;
 *   - chip tap → `selectedId` changes → the gallery scrolls to that slide.
 * A flag remembers a scroll the gallery started itself, so that scroll does not bounce back as
 * a "user picked this" event; any touch clears the flag because the customer has taken over.
 *
 * Gesture: a native horizontal scroll-snap track, nothing custom. The browser decides from the
 * first movement whether a drag is horizontal (slides) or vertical (page), so the gallery never
 * steals the page scroll (spec: "การปัดต้องไม่แย่งการเลื่อนหน้าจอแนวตั้ง"), and it works in
 * Safari on iOS without JavaScript touch handling. `overscroll-behavior-x: contain` keeps an
 * edge swipe on the first/last slide from turning into browser back/forward.
 *
 * Owner decision A-ข (2026-09-08): an option that is sold out is still a slide — the customer
 * can swipe onto it and see it (catalogue completeness), the page then shows its sold-out
 * state; the chips for such options stay disabled exactly as before. Reduced motion: the
 * programmatic scroll jumps instead of animating. The frame has a fixed aspect ratio, so no
 * layout shift while images load.
 *
 * This component owns no selection state (P1: the state stays in the page, where M5 will read
 * it too). Desktop never renders it — callers wrap it in `lg:hidden`.
 */
export interface GallerySlide {
  id: string;
  node: ReactNode;
}

/**
 * `sizes` for every image inside a gallery slide. The gallery only ever shows below `lg`, but its
 * markup is in the desktop page too (hidden by CSS), and the first slide asks for `priority`
 * loading — so on a 1440px desktop that preload was fetching the *largest* candidate of an image
 * nobody sees, queueing behind it the hero photo desktop customers do see (found 2026-09-08 by
 * the 1440 before/after diff: the hero had not painted by capture time). Telling the browser the
 * slide is 1px wide at `lg` and above makes that request the smallest candidate; on phones it is
 * the real 90vw.
 */
export const MOBILE_SLIDE_SIZES = "(min-width: 1024px) 1px, 90vw";

export function MobileVariantGallery({
  slides,
  selectedId,
  onSelect,
  className,
  overlay,
  ariaLabel,
}: {
  slides: GallerySlide[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** Classes for the outer frame (aspect ratio, background). */
  className?: string;
  /** Absolutely-positioned extras inside the frame (e.g. the favourite button). */
  overlay?: ReactNode;
  /** Accessible name of the track (an existing dictionary string — no new wording). */
  ariaLabel?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const programmatic = useRef<string | null>(null);
  const settleTimer = useRef<number | null>(null);
  const mounted = useRef(false);
  // Only a real gesture (touch, pointer, wheel) may turn a scroll into a selection. Browsers also
  // move scroll containers on their own — a re-layout after a viewport change can reset
  // scrollLeft to 0 — and that must never read as "the customer swiped back to the first
  // option" (seen 2026-09-08). Without a gesture the track is re-aligned to the selection.
  const userGesture = useRef(false);
  const index = Math.max(0, slides.findIndex((s) => s.id === selectedId));

  // Selection (chips, initial state) → scroll the matching slide into view.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const width = el.clientWidth;
    if (!width) return;
    const target = index * width;
    if (Math.abs(el.scrollLeft - target) < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    programmatic.current = slides[index]?.id ?? null;
    el.scrollTo({ left: target, behavior: reduce || !mounted.current ? "auto" : "smooth" });
  }, [index, slides]);

  useEffect(() => {
    mounted.current = true;
  }, []);

  // The selection, not the scroll offset, is the source of truth. When the track's width changes
  // (rotation, the browser chrome collapsing, a viewport resize) browsers may reset or rescale
  // scrollLeft; without this the settle logic would read the reset offset as a swipe back to the
  // first option (seen 2026-09-08 in the screenshot tool, which resizes the viewport after the
  // interaction). Re-align the track to the selected slide instead, without animation.
  useEffect(() => {
    const el = track.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    let lastWidth = el.clientWidth;
    const ro = new ResizeObserver(() => {
      const width = el.clientWidth;
      if (!width || width === lastWidth) return;
      lastWidth = width;
      programmatic.current = slides[index]?.id ?? null;
      el.scrollTo({ left: index * width, behavior: "auto" });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [index, slides]);

  // Scroll → selection, once the track has settled on a slide.
  const settle = () => {
    const el = track.current;
    if (!el) return;
    const width = el.clientWidth;
    if (!width) return;
    const slide = slides[Math.round(el.scrollLeft / width)];
    if (!slide) return;
    if (programmatic.current) {
      if (slide.id === programmatic.current) programmatic.current = null;
      return;
    }
    if (slide.id === selectedId) return;
    if (userGesture.current) {
      userGesture.current = false;
      onSelect(slide.id);
      return;
    }
    // Not the customer: the browser moved the track. Put it back on the selected slide.
    programmatic.current = slides[index]?.id ?? null;
    el.scrollTo({ left: index * width, behavior: "auto" });
  };

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScrollEnd = () => settle();
    el.addEventListener("scrollend", onScrollEnd);
    return () => el.removeEventListener("scrollend", onScrollEnd);
  });

  const onScroll = () => {
    // Fallback for browsers without `scrollend` (Safari): settle shortly after the last scroll event.
    if (settleTimer.current) window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(settle, 120);
  };

  const takeOver = () => {
    programmatic.current = null;
    userGesture.current = true;
  };

  const many = slides.length > 24;

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div
        ref={track}
        onScroll={onScroll}
        onTouchStart={takeOver}
        onPointerDown={takeOver}
        onWheel={takeOver}
        role="group"
        aria-label={ariaLabel}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ overscrollBehaviorX: "contain", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
      >
        {slides.map((s) => (
          <div key={s.id} className="relative h-full w-full shrink-0 snap-center" aria-hidden={s.id !== (slides[index]?.id ?? null) || undefined}>
            {s.node}
          </div>
        ))}
      </div>
      {overlay}
      {slides.length > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5" aria-hidden>
          {slides.map((s, i) => (
            <span
              key={s.id}
              className={cn(
                "rounded-full transition-colors duration-150",
                many ? "h-1 w-1" : "h-1.5 w-1.5",
                i === index ? "bg-ember" : "bg-foreground/30"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
