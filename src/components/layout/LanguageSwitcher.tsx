"use client";

import { useEffect, useRef, useState } from "react";
import { Globe } from "lucide-react";
import { LOCALES, LOCALE_LABELS } from "@/i18n/config";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

/** A small icon + code button that opens a dropdown of the 3 supported locales — visible at
 *  every width (mobile through desktop) so it doesn't need a separate mobile-menu variant.
 *  Click-toggle only (no hover-open/close): a hover-leave handler here would close the menu the
 *  moment the pointer drifts off the small button after clicking, before a selection can be
 *  made — closes instead on an outside click/tap, the standard accessible pattern.
 *
 *  Drawn as a bordered chip in the ember accent rather than a bare grey icon like the search /
 *  favourites / cart buttons beside it (designer review, 2026-09-06). Since the site now serves
 *  Thai to everyone and never guesses (BSOT §20), this button is the ONLY way a foreign visitor
 *  reaches their language — as a fourth grey glyph it read as one more icon and was missable.
 *  The chip keeps the same footprint, so the mobile header does not get tighter. */
export function LanguageSwitcher() {
  const { locale, dict, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={dict.languageSwitcher.label}
        className="flex items-center gap-1 rounded-full border border-ember/40 bg-ember-soft/40 py-1.5 pl-2 pr-2.5 text-ember transition-colors hover:border-ember/70 hover:bg-ember-soft hover:text-ember-strong"
      >
        <Globe size={17} aria-hidden />
        <span className="label-mono text-[0.7rem] font-semibold">{locale.toUpperCase()}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full w-36 rounded-xl border border-surface-border bg-surface-1 p-1.5 shadow-2xl">
          {LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => {
                setLocale(l);
                setOpen(false);
              }}
              aria-pressed={locale === l}
              className={cn(
                "block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                locale === l ? "bg-surface-2 text-foreground" : "text-foreground-muted hover:bg-surface-2 hover:text-foreground"
              )}
            >
              {LOCALE_LABELS[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
