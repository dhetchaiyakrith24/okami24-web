"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useChipAutoscroll } from "./use-chip-autoscroll";

/**
 * Phone option picker (queue Q5, owner 24/10 — mockups A/B/C in `_incoming/cartpolish-2410/picker/`). Below `lg` the
 * three pickers (ColorVariantRail · FlavorVariantGrid · ProductMasterVariantPicker) render this instead of their
 * sideways chip row; `lg` and above keep their own markup. Owner's picks:
 *   - up to `TILE_LIMIT` options = layout A: every option a photo tile with its name, 4 per row, no sideways scroll;
 *   - more than that = layout C: the big photo stays the main picker (swipe), with a strip of small photos under it
 *     (names + pills kept under each: flavour photos often look alike, the name is what tells them apart);
 *   - past TILE_LIMIT a "show all" button opens the strip into the A grid and closes it again (owner 24/10: "กดแล้วโชว์การ์ด
 *     เล็กๆเพิ่ม … ถ้าลูกค้าไม่กดก็เลื่อนไปทางซ้ายได้เหมือนกัน");
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
  const many = options.length > TILE_LIMIT;
  const [open, setOpen] = useState(false);
  const strip = many && !open;
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
      {/* Each option spans 3 subgrid rows (photo · name · pill): the name row is as tall as the longest name of that
          row, so the pills line up without padding one-line names (designer pass 24/10). */}
      <div
        ref={listRef}
        className={
          strip
            ? "okami-chip-row -mx-5 grid auto-cols-[4.5rem] grid-flow-col grid-rows-[auto_auto_auto] gap-x-2 gap-y-1.5 overflow-x-auto overflow-y-hidden px-5 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            : "grid grid-cols-4 gap-x-2 gap-y-1.5"
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
              className={cn("row-span-3 grid min-w-0 grid-rows-subgrid justify-items-center text-center", !strip && "mb-2")}
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
              <span
                className={cn(
                  "w-full self-start text-xs leading-tight",
                  // Strip photos are often plain swatches, so the name carries the choice: one more line there.
                  strip ? "line-clamp-3" : "line-clamp-2",
                  picked ? "font-semibold text-foreground" : o.out ? "text-foreground-dim" : "text-foreground-muted"
                )}
              >
                {o.name}
              </span>
              <StockPill out={o.out} small />
            </button>
          );
        })}
      </div>
      {many && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="min-h-11 w-full rounded-full border border-surface-border text-sm font-semibold text-foreground-muted transition-colors active:border-ember active:text-foreground"
        >
          {open ? t.optionShowLess : t.optionShowAll.replace("{n}", String(options.length))}
        </button>
      )}
    </div>
  );
}

function StockPill({ out, small }: { out: boolean; small?: boolean }) {
  const { dict } = useLocale();
  return (
    <span
      className={cn(
        "inline-flex items-center self-start rounded-full font-medium leading-none",
        small ? "px-2 py-1 text-xs" : "px-2.5 py-1 text-xs",
        // Only "in stock" gets the green frame, so the eye finds what can be bought; sold out is plain dim text (B).
        out ? "text-foreground-dim" : "border border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
      )}
    >
      {out ? dict.product.optionOut : dict.product.optionIn}
    </span>
  );
}
