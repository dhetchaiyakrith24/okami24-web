"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { AGE_GATE } from "@/i18n/age-gate-copy";

const STORAGE_KEY = "okami24-age-verified";
const EVENT = "okami24-age-gate-change";

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

// Assume verified during SSR/first paint so the gate never server-renders —
// the client corrects this on mount via useSyncExternalStore.
function getServerSnapshot() {
  return true;
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function AgeGate({ orderingEnabled = true }: { orderingEnabled?: boolean } = {}) {
  // Round 6 "about3lang" (owner 2026-09-23): the dialog reads the visitor's locale like the rest of
  // the site. The copy comes from src/i18n/age-gate-copy.tsx WITHOUT the render-time Thai
  // typography the dictionaries get — the Thai here is THAI_STYLE §5 group ก and must render byte
  // for byte as it did before; that module's header carries the full reason.
  const { locale } = useLocale();
  const copy = AGE_GATE[locale];
  const verified = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const open = !verified;
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      confirmRef.current?.focus();
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "Tab" || !dialogRef.current) return;
    const focusable = dialogRef.current.querySelectorAll<HTMLElement>("button");
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
  }

  function confirm() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "true");
      window.dispatchEvent(new Event(EVENT));
    } catch {
      // localStorage unavailable — the gate will simply reappear next load
    }
  }

  function decline() {
    window.location.href = "https://www.google.com";
  }

  if (!open) return null;

  return (
    <div
      // overflow-y-auto + py-8 + the card's my-auto (batch B5, designer 2026-09-23): the overlay
      // centred the card in a fixed, unscrollable box, so on a short viewport — a phone held
      // sideways is ~360px tall against this card's ~477px in Thai — the top and bottom were cut
      // off with no way to scroll to them, and `document.body.style.overflow = "hidden"` meant the
      // page behind could not be scrolled either: the visitor could not reach either button, on
      // every page of the site. Auto margins centre the card while it fits and let it scroll when
      // it does not (plain `items-center` clips the top of an overflowing flex child instead).
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-surface-0/95 px-5 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      aria-describedby="age-gate-desc"
      ref={dialogRef}
      onKeyDown={handleKeyDown}
    >
      <div className="my-auto w-full max-w-md rounded-2xl border border-surface-border bg-surface-1 p-8 shadow-2xl">
        <span className="label-mono text-xs text-ember">{copy.eyebrow}</span>
        <h2 id="age-gate-title" className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground">
          {copy.title}
        </h2>
        <p id="age-gate-desc" className="mt-4 text-sm leading-relaxed text-foreground-muted">
          {orderingEnabled ? copy.body : copy.bodyWhileOrderingOff}
        </p>
        <p className="mt-3 text-xs leading-relaxed text-foreground-dim">
          {copy.nicotine}
        </p>
        {/* Round 6 "about3lang" batch B5 (owner 2026-09-23, after the designer's close finding):
            the two buttons used to sit side by side from 640px up, and there they are never wider
            than ~218px each — the card is a fixed max-w-md (448px) at EVERY screen width, so a
            wider window does not give the row more room and no breakpoint can. The Thai
            "ไม่ใช่ ฉันอายุต่ำกว่า 21 ปี" does not fit that, wrapped to two lines, and left the two
            buttons at different heights while en/zh stayed on one line. The Thai wording is group ก
            and cannot be shortened, so the row is gone: both buttons are full width at every width,
            which is what a phone already showed and what keeps them the same height in all three
            languages. Reverting this one commit restores the old row without touching batch B1. */}
        <div className="mt-7 flex flex-col gap-3">
          <button
            ref={confirmRef}
            onClick={confirm}
            // border-transparent: the decline button below carries a 1px border, so without a
            // border of its own this one measured 44px against its 46px (batch B5, 2026-09-23).
            // Stacked, nothing stretches them to a common height any more, so the box has to match.
            className="rounded-full border border-transparent bg-ember px-6 py-3 text-sm font-semibold text-[#181008] transition-colors hover:bg-ember-strong focus-visible:outline-2 focus-visible:outline-ember"
          >
            {copy.confirm}
          </button>
          <button
            onClick={decline}
            className="rounded-full border border-surface-border px-6 py-3 text-sm font-semibold text-foreground-muted transition-colors hover:border-foreground-dim hover:text-foreground focus-visible:outline-2 focus-visible:outline-ember"
          >
            {copy.decline}
          </button>
        </div>
        {/* Round "site unreachable" (owner 11/10, choice A): one line under the buttons, so the decision stays first. */}
        <p className="mt-5 text-center text-xs leading-relaxed text-foreground-dim">{copy.siteHelp}</p>
      </div>
    </div>
  );
}
