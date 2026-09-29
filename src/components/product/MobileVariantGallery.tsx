"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Swipe-to-select product gallery for phones — MOBILE_SPEC M2.2/M2.3, chat A (2026-09-08).
 *
 * One slide per colour/flavour option (or a single slide when the product has no options). The
 * slide that is in view IS the selected option — swiping is a real selection, the same one the
 * chips make, not a preview (spec 2.2). Both directions stay in sync:
 *   - swipe → the parent's `onSelect(id)` fires once the scroll settles on a slide;
 *   - chip tap → `selectedId` changes → the gallery jumps to that slide (no animation, 2026-09-30).
 * A scroll only becomes a selection after a real gesture (touch, pointer, wheel); a scroll the
 * gallery or the browser made is lined back up with the selection instead.
 *
 * Gesture: a native horizontal scroll-snap track, nothing custom. The browser decides from the
 * first movement whether a drag is horizontal (slides) or vertical (page), so the gallery never
 * steals the page scroll (spec: "การปัดต้องไม่แย่งการเลื่อนหน้าจอแนวตั้ง"), and it works in
 * Safari on iOS without JavaScript touch handling. `overscroll-behavior-x: contain` keeps an
 * edge swipe on the first/last slide from turning into browser back/forward.
 *
 * Owner decision A-ข (2026-09-08): an option that is sold out is still a slide — the customer
 * can swipe onto it and see it (catalogue completeness), the page then shows its sold-out
 * state; the chips for such options stay disabled exactly as before. A selection from outside
 * the gallery never animates, so reduced motion needs nothing extra. The frame has a fixed aspect ratio, so no
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

// Slide `i`'s exact left edge inside the track (slides can be fractional pixels wide, so never
// `i * clientWidth`, which drifts by the rounding once per slide).
function slideLeft(el: HTMLDivElement, i: number) {
  const child = el.children[i] as HTMLElement | undefined;
  return child ? child.getBoundingClientRect().left - el.getBoundingClientRect().left + el.scrollLeft : 0;
}
function slideOnScreen(el: HTMLDivElement) {
  return el.clientWidth ? Math.round(el.scrollLeft / el.clientWidth) : 0;
}
// Put slide `i` on screen in one step. No smooth scroll (owner's bugs 2026-09-30): an animated scroll from a chip
// tap slid through every flavour in between (Grape Ice, Grape Lychee… on the way to Mint), and it only moves on
// painted frames — in a browser that is not painting it never left the cover photo ("tapped Mint, the photo stayed").
function alignTo(el: HTMLDivElement, i: number) {
  if (slideOnScreen(el) === i) return;
  el.scrollTo({ left: slideLeft(el, i), behavior: "auto" });
}

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
  const settleTimer = useRef<number | null>(null);
  // Only a real gesture (touch, pointer, wheel) may turn a scroll into a selection. Browsers also
  // move scroll containers on their own — a re-layout after a viewport change can reset
  // scrollLeft to 0 — and that must never read as "the customer swiped back to the first
  // option" (seen 2026-09-08). Without a gesture the track is re-aligned to the selection.
  const userGesture = useRef(false);
  // A finger is on the track: never settle mid-drag (the Safari timer path below could fire while a finger rests).
  const touching = useRef(false);
  const index = Math.max(0, slides.findIndex((s) => s.id === selectedId));
  // The settle handlers run from scroll events and timers created during an EARLIER render. Reading
  // `slides`/`selectedId`/`index` from their closures is what made a swipe flash (owner, 2026-09-30):
  // `scrollend` and the 120 ms timer BOTH settled one swipe A→B; the first selected B, the second still
  // believed A was selected, took B for "the browser moved the track" and scrolled back to A — then the
  // selection effect scrolled to B again (A→B→A→B, measured with scripts/gallery-probe.js). They read
  // the latest render through this ref instead, and only one of the two events settles (see below).
  const latest = useRef({ slides, selectedId, onSelect, index });
  useLayoutEffect(() => {
    latest.current = { slides, selectedId, onSelect, index };
  });

  // Selection (chips, initial state) → the matching slide on screen.
  useEffect(() => {
    const el = track.current;
    if (el && el.clientWidth) alignTo(el, index);
  }, [index]);

  // The selection, not the scroll offset, is the source of truth. When the track's width changes
  // (rotation, the browser chrome collapsing, a viewport resize) browsers may reset or rescale
  // scrollLeft; without this the settle logic would read the reset offset as a swipe back to the
  // first option (seen 2026-09-08 in the screenshot tool, which resizes the viewport after the
  // interaction). Re-align the track to the selected slide instead.
  useEffect(() => {
    const el = track.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    let lastWidth = el.clientWidth;
    const ro = new ResizeObserver(() => {
      const width = el.clientWidth;
      if (!width || width === lastWidth) return;
      lastWidth = width;
      el.scrollTo({ left: slideLeft(el, latest.current.index), behavior: "auto" });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Scroll → selection, once the track has come to rest on a slide.
  const settle = () => {
    const el = track.current;
    if (!el || !el.clientWidth || touching.current) return;
    const { slides: now, selectedId: picked, onSelect: select, index: at } = latest.current;
    const slide = now[slideOnScreen(el)];
    if (!slide) return;
    if (slide.id === picked) {
      userGesture.current = false;
      return;
    }
    if (userGesture.current) {
      userGesture.current = false;
      select(slide.id);
      return;
    }
    // Not the customer: the browser moved the track. Put it back on the selected slide.
    alignTo(el, at);
  };

  // One settle signal per scroll: `scrollend` where the browser has it, else a short timer after the last
  // scroll event (Safari before `scrollend`) — never both.
  const hasScrollEnd = typeof window !== "undefined" && "onscrollend" in window;
  useEffect(() => {
    const el = track.current;
    if (!el || !hasScrollEnd) return;
    const onScrollEnd = () => settle();
    el.addEventListener("scrollend", onScrollEnd);
    return () => el.removeEventListener("scrollend", onScrollEnd);
    // `settle` reads everything it needs through refs, so the listener never goes stale.
  }, [hasScrollEnd]);

  const scheduleSettle = () => {
    if (settleTimer.current) window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(settle, 120);
  };
  const onScroll = () => {
    if (!hasScrollEnd) scheduleSettle();
  };

  const takeOver = () => {
    userGesture.current = true;
  };
  const touchStart = () => {
    touching.current = true;
    takeOver();
  };
  const touchEnd = () => {
    touching.current = false;
    // A finger lifted after the scroll already stopped gets no further scroll event on the timer path.
    if (!hasScrollEnd) scheduleSettle();
  };

  const many = slides.length > 24;

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div
        ref={track}
        onScroll={onScroll}
        onTouchStart={touchStart}
        onTouchEnd={touchEnd}
        onTouchCancel={touchEnd}
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
