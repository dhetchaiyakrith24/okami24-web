"use client";

import { useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useChipAutoscroll } from "./use-chip-autoscroll";

/**
 * Phone option picker (queue Q5, owner 24/10 — mockups A/B/C in `_incoming/cartpolish-2410/picker/`). Below `lg` the
 * three pickers (ColorVariantRail · FlavorVariantGrid · ProductMasterVariantPicker) render this instead of their
 * sideways chip row; `lg` and above keep their own markup. Owner's picks:
 *   - up to `TILE_LIMIT` options = layout A: every option a photo tile with its name, 4 per row, no sideways scroll;
 *   - more than that = layout C: the big photo stays the main picker (swipe), with a strip of small photos under it;
 *   - the status pill is B's: green "มีของ" so stock reads at a glance, sold out = dimmed tile + "หมด".
 * An option without its own verified photo shows its swatch (or a plain dot) — never another option's photo.
 * Only in/out is known (the order-entry read has no quantities), so there is no "low stock" state.
 */
export const TILE_LIMIT = 12; // Friday's cut of the owner's "8–12" (24/10), reversible

export interface PhoneOption {
  id: string;
  name: string;
  image?: { src: string; alt: string };
  swatchHex?: string;
  out: boolean;
}

export function PhoneOptionTiles({
  options,
  selectedId,
  onSelect,
  label,
  pills = [],
  className,
}: {
  options: PhoneOption[];
  /** null while nothing (or an "all" pill) is picked. */
  selectedId: string | null;
  onSelect: (id: string) => void;
  label: string | null;
  /** "All" lineup pills, shown before the options. */
  pills?: { label: string; selected: boolean; onSelect: () => void }[];
  className?: string;
}) {
  const { dict } = useLocale();
  const t = dict.product;
  const listRef = useRef<HTMLDivElement>(null);
  const strip = options.length > TILE_LIMIT;
  useChipAutoscroll(listRef, strip ? selectedId : null);
  const selected = options.find((o) => o.id === selectedId);
  const inCount = options.filter((o) => !o.out).length;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        {label && <span className="text-foreground-dim">{label}</span>}
        {selected && <span className="font-semibold text-foreground">{selected.name}</span>}
        {selected && <StockPill out={selected.out} />}
        <span className="ml-auto text-xs text-foreground-dim">
          {t.optionStockCount.replace("{in}", String(inCount)).replace("{n}", String(options.length))}
        </span>
      </div>
      {pills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {pills.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={p.onSelect}
              aria-pressed={p.selected}
              className={cn(
                "min-h-11 rounded-full border px-4 text-sm font-semibold tracking-tight transition-colors",
                p.selected ? "border-ember bg-ember/10 text-foreground" : "border-surface-border text-foreground-muted"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
      <div
        ref={listRef}
        className={
          strip
            ? "okami-chip-row -mx-5 flex gap-2 overflow-x-auto overflow-y-hidden px-5 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            : "grid grid-cols-4 gap-x-2 gap-y-3"
        }
      >
        {options.map((o) => {
          const picked = o.id === selectedId;
          const name = o.out ? `${o.name} — ${t.optionOut}` : o.name;
          return (
            <button
              key={o.id}
              type="button"
              data-option-id={o.id}
              onClick={() => onSelect(o.id)}
              aria-pressed={picked}
              aria-label={name}
              title={name}
              className={cn("flex min-w-0 flex-col items-center gap-1.5 text-center", strip && "w-16 shrink-0")}
            >
              <span
                className={cn(
                  "relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border-2 bg-surface-1 transition-colors",
                  picked ? "border-ember" : "border-surface-border",
                  o.out && !picked && "opacity-40"
                )}
              >
                {o.image ? (
                  <Image src={o.image.src} alt="" fill sizes="96px" className="object-contain p-1.5" />
                ) : (
                  <span
                    className="block h-1/2 w-1/2 rounded-full border border-black/10 shadow-inner"
                    style={{ backgroundColor: o.swatchHex ?? "var(--color-surface-border)" }}
                    aria-hidden
                  />
                )}
              </span>
              {!strip && (
                <>
                  <span
                    className={cn(
                      "line-clamp-2 w-full text-xs leading-tight",
                      picked ? "font-semibold text-foreground" : o.out ? "text-foreground-dim" : "text-foreground-muted"
                    )}
                  >
                    {o.name}
                  </span>
                  <StockPill out={o.out} small />
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StockPill({ out, small }: { out: boolean; small?: boolean }) {
  const { dict } = useLocale();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium leading-none",
        small ? "px-1.5 py-0.5 text-[0.65rem]" : "px-2 py-1 text-xs",
        out ? "border-surface-border text-foreground-dim" : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
      )}
    >
      {out ? dict.product.optionOut : dict.product.optionIn}
    </span>
  );
}
