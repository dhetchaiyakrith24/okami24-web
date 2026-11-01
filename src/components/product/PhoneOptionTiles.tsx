"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useChipAutoscroll } from "./use-chip-autoscroll";
import { countKind } from "@/lib/stock/count-rules";

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
 * The warehouse count (owner 30/10, live after load): the picked option's count words sit on their own line under the
 * header (`countLine`, from the product page — the header row keeps its width, so "พร้อมส่ง x/y" never wraps when the
 * answer lands: checker #1063 round 1); a small tile only swaps "มีของ" for the short amber "เหลือ N" at ≤ 3 (`left`) —
 * a tile is ~80 px wide (designer 30/10), same pill height, nothing jumps.
 */
export const TILE_LIMIT = 12; // Friday's cut of the owner's "8–12" (24/10), reversible

export interface PhoneOption {
  id: string;
  name: string;
  image?: { src: string; alt: string };
  swatchHex?: string;
  out: boolean;
  /** Live warehouse count (/api/stock, capped there); undefined until it arrives or when there is none. */
  left?: number;
}

export function PhoneOptionTiles({
  options,
  selectedId,
  onSelect,
  label,
  pills = [],
  className,
  outDisabled = false,
  countLine,
}: {
  options: PhoneOption[];
  /** null while nothing (or an "all" pill) is picked. */
  selectedId: string | null;
  onSelect: (id: string) => void;
  label: string | null;
  /** "All" lineup pills, shown before the options. */
  pills?: { label: string; selected: boolean; onSelect: () => void }[];
  className?: string;
  /** Sold-out tiles cannot be picked (the cart's quick add). The product page keeps them pickable to show the photo. */
  outDisabled?: boolean;
  /** The picked option's count line (product page), right under the header row. */
  countLine?: ReactNode;
}) {
  const { dict } = useLocale();
  const t = dict.product;
  const listRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const many = options.length > TILE_LIMIT;
  const [open, setOpen] = useState(false);
  const strip = many && !open;
  useChipAutoscroll(listRef, strip ? selectedId : null);
  const selected = options.find((o) => o.id === selectedId);
  const inCount = options.filter((o) => !o.out).length;

  return (
    <div ref={rootRef} className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        {label && <span className="text-foreground-dim">{label}</span>}
        {selected && <span className="font-semibold text-foreground">{selected.name}</span>}
        {selected && <StockPill out={selected.out} />}
        {/* Opens unpicked (photo-rule pages): say what to do instead of a bare axis label (designer note 24/10). */}
        {!selected && !pills.some((p) => p.selected) && <span className="text-foreground-muted">{t.optionPickPrompt}</span>}
        <span className="ml-auto text-xs text-foreground-dim">
          {t.optionStockCount.replace("{in}", String(inCount)).replace("{n}", String(options.length))}
        </span>
      </div>
      {countLine}
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
              disabled={outDisabled && o.out}
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
              <StockPill out={o.out} left={o.left} small />
            </button>
          );
        })}
      </div>
      {many && (
        <button
          type="button"
          onClick={() => {
            setOpen((v) => !v);
            // Closing shrinks the grid above the reader, who would land far down the page (owner 24/10): bring the
            // picker back on screen once the strip has replaced the grid.
            if (open) requestAnimationFrame(() => rootRef.current?.scrollIntoView({ block: "center", behavior: "auto" }));
          }}
          aria-expanded={open}
          className="min-h-11 w-full rounded-full border border-surface-border text-sm font-semibold text-foreground-muted transition-colors active:border-ember active:text-foreground"
        >
          {open ? t.optionShowLess : t.optionShowAll.replace("{n}", String(options.length))}
        </button>
      )}
    </div>
  );
}

function StockPill({ out, small, left }: { out: boolean; small?: boolean; left?: number }) {
  const { dict } = useLocale();
  const t = dict.product;
  // Only a small tile at ≤ 3 changes words (short amber "เหลือ N"); every other pill stays "มีของ" / "หมด".
  const low = !out && left !== undefined && countKind(left) === "low";
  return (
    <span
      className={cn(
        "inline-flex items-center self-start rounded-full font-medium leading-none",
        small ? "px-2 py-1 text-xs" : "px-2.5 py-1 text-xs",
        // Only "in stock" gets the green frame, so the eye finds what can be bought; sold out is plain dim text (B).
        out ? "text-foreground-dim" : low ? "border border-low/40 bg-low/10 text-low" : "border border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
      )}
    >
      {out ? t.optionOut : low ? t.stockLeftShort.replace("{n}", String(left)) : t.optionIn}
    </span>
  );
}
