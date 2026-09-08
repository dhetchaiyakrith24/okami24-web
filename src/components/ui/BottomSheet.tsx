"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shared phone bottom sheet — mobile round B (owner 2026-09-08, MOBILE_SPEC M4). Built as the one
 * sheet the site will have: the catalog filter sheet uses it now, and the M5 cart sheet (Shopee
 * style, MOBILE_SPEC M5) is meant to reuse it unchanged — it only has to pass `children` (the
 * option grid, quantity) and `footer` (its confirm button).
 *
 * What it does on its own, so no caller re-implements it:
 * - slides up from the bottom edge; closes on the X button, a tap on the backdrop, Escape, or a
 *   swipe down on the grab handle / title row (the body must stay free to scroll, so a drag that
 *   starts inside the content never fights the vertical scroll — MOBILE_SPEC technical rules);
 * - locks the page behind it while open and restores exactly what was there before (the header's
 *   own drawer sets `body.style.overflow` too, so the value is remembered, not cleared);
 * - moves focus in on open, keeps Tab inside, and gives focus back to whatever opened it;
 * - respects the device's home-indicator inset under the footer and `prefers-reduced-motion`
 *   (globals.css cuts every transition to 0.001ms, so the sheet simply appears);
 * - is not in the DOM at all while closed — nothing to hydrate, nothing that can shift layout, and
 *   nothing a keyboard user can Tab into by accident. It renders through a portal onto `body`
 *   so a transformed ancestor can never turn `position: fixed` into a local box.
 *
 * Phone/tablet only by use: callers only render the trigger below `lg`, and the sheet closes
 * itself if the viewport grows past that while it is open. Desktop layout is never touched.
 */
export function BottomSheet({
  open,
  onClose,
  title,
  closeLabel,
  children,
  footer,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** Accessible name of the X button — a dictionary word, never hardcoded here. */
  closeLabel: string;
  children: ReactNode;
  /** Pinned under the scrolling body — the sheet's action buttons. */
  footer?: ReactNode;
  className?: string;
}) {
  // `mounted` keeps the sheet in the DOM for the close transition; `shown` drives the transform.
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragging = useRef<{ startY: number; pointerId: number } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  // Prop → state adjustments happen during render (React's documented pattern), not in effects:
  // `open` mounts the sheet at once, and closing drops the slide-in state at once.
  if (open && !mounted) setMounted(true);
  if (!open && shown) setShown(false);
  if (!open && dragY !== 0) setDragY(0);

  // Slide in one frame after mounting, so the transition actually runs from translateY(100%).
  useEffect(() => {
    if (!open || !mounted) return;
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const raf = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(raf);
  }, [open, mounted]);

  // Unmount after the slide-out; transitionend is unreliable when the duration is ~0 (reduced
  // motion) or the tab is hidden, so a timer is the fallback.
  useEffect(() => {
    if (open || !mounted) return;
    const t = setTimeout(() => setMounted(false), 320);
    return () => clearTimeout(t);
  }, [open, mounted]);

  // Scroll lock — remember and restore, never clear (the header drawer owns the same property).
  useEffect(() => {
    if (!mounted) return;
    const body = document.body;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = previous;
    };
  }, [mounted]);

  // Focus in on open; back to the opener on close.
  useEffect(() => {
    if (!shown) return;
    closeButtonRef.current?.focus({ preventScroll: true });
    return () => {
      openerRef.current?.focus({ preventScroll: true });
    };
  }, [shown]);

  // Escape closes; the sheet closes itself if the viewport grows to desktop width while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onMedia = (e: MediaQueryListEvent) => {
      if (e.matches) onClose();
    };
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onMedia);
    return () => {
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onMedia);
    };
  }, [open, onClose]);

  // Tab stays inside the panel.
  const onPanelKeyDown = useCallback((e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusable = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
    ).filter((el) => el.offsetParent !== null);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  // Swipe down on the handle / title row. Pointer events so mouse, pen and touch all work; the
  // header has `touch-action: none` so the browser never starts a scroll from there.
  const onHandlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    dragging.current = { startY: e.clientY, pointerId: e.pointerId };
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onHandlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current || dragging.current.pointerId !== e.pointerId) return;
    setDragY(Math.max(0, e.clientY - dragging.current.startY));
  };
  const onHandlePointerEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current || dragging.current.pointerId !== e.pointerId) return;
    const dy = Math.max(0, e.clientY - dragging.current.startY);
    dragging.current = null;
    setIsDragging(false);
    const panelHeight = panelRef.current?.offsetHeight ?? 0;
    if (dy > 72 || (panelHeight > 0 && dy > panelHeight * 0.25)) onClose();
    else setDragY(0);
  };

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] lg:hidden" role="presentation">
      {/* backdrop — a tap here closes */}
      <div
        className={cn("absolute inset-0 bg-surface-0/70 transition-opacity duration-200 ease-out", shown ? "opacity-100" : "opacity-0")}
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={onPanelKeyDown}
        className={cn(
          "absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-2xl border-t border-surface-border bg-surface-1 shadow-2xl",
          "transition-transform duration-300 ease-out",
          !shown && "translate-y-full",
          className
        )}
        style={{
          transform: shown ? `translateY(${dragY}px)` : undefined,
          transitionDuration: isDragging ? "0ms" : undefined,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div
          className="flex shrink-0 select-none items-center gap-3 px-5 pt-2 pb-3 [touch-action:none]"
          onPointerDown={onHandlePointerDown}
          onPointerMove={onHandlePointerMove}
          onPointerUp={onHandlePointerEnd}
          onPointerCancel={onHandlePointerEnd}
        >
          <span className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-surface-3" aria-hidden />
          <h2 id={titleId} className="mt-3 min-w-0 flex-1 truncate font-display text-xl font-semibold text-foreground">
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="mt-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <X size={22} aria-hidden />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4">{children}</div>
        {footer && <div className="shrink-0 border-t border-surface-border-soft bg-surface-1 px-5 py-3">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
