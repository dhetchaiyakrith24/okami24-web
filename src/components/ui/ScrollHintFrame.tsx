"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Round 30.4ข batch 1 (owner 2026-09-16, close-list E): on a phone the 500px-minimum table runs
// past the right edge and the third/fourth column was simply cut, with nothing saying it scrolls.
// The border stays on the outer frame (so the corners and the edge stay crisp); the inner box is the
// scroller. While there is still content to the right, a fade in the page colour plus a chevron sit
// over the cut edge and disappear once the last column is fully in view — the same "more to the
// right" cue the colour/flavour chip rows use (`.okami-chip-row`), only measured instead of static,
// because on a tablet the table can fit without any scrolling and a static fade would dim the last
// column for nothing. The table itself is untouched. `frameClassName` replaces the frame's look
// (the disposables table sits on the page with no frame, round "disposable pod" 05/11).
export function ScrollHintFrame({ children, frameClassName = "rounded-xl border border-surface-border-soft" }: { children: ReactNode; frameClassName?: string }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [moreToRight, setMoreToRight] = useState(false);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const update = () => setMoreToRight(el.scrollWidth - el.clientWidth - el.scrollLeft > 1);
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  return (
    <div className={cn("relative overflow-hidden", frameClassName)}>
      <div ref={scroller} className="overflow-x-auto">
        {children}
      </div>
      {moreToRight && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 flex w-16 items-start justify-end bg-gradient-to-l from-surface-0 from-35% to-transparent pt-3 pr-2 text-foreground-muted"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
        </div>
      )}
    </div>
  );
}
