"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { countKind } from "@/lib/stock/count-rules";
import { OptionBestTag } from "@/components/catalog/SalesBadge";
import type { PhoneOption } from "./PhoneOptionTiles";

/**
 * Preview "tiles" (owner-approved mock 12/11, designer pass c1 — shared notes look-1211-design-passes.md "A desktop colour
 * tiles"): at `lg` and above the colour picker becomes a grid of real-device photo tiles instead of 32px swatch dots.
 * Rendered ONLY under `?preview=tiles` and only after load (ColorVariantRail → usePreview), so customers and the HTML
 * search engines read keep today's dots. When the owner approves, ColorVariantRail renders this by default and its dot row
 * goes.
 *   - fixed 5rem tiles (never 1fr): 4 a row at lg · 5 at xl · 6 from 1440 — two rows show, "show all" opens the rest
 *     (open from the start when the picked colour sits past the second row);
 *   - picture only — the head row names the picked colour, and the hovered / focused tile's name while the pointer is on it;
 *   - picked = 2px orange frame on surface-2 · sold out = photo at 40% + "หมด" · ≤ 3 left = amber "เหลือ N" ·
 *     best seller = the "ขายดี" tag top-left · no photo = the swatch dot · no green "มีของ" tag on desktop (designer);
 *   - the "all colours" pills stay a pill row above the grid — a lineup is not a colour.
 */
const ROWS_SHOWN = 2;
const PER_ROW = { lg: 4, xl: 5, wide: 6 } as const;

export function DesktopOptionTiles({
  options,
  selectedId,
  onSelect,
  label,
  pills = [],
  className,
}: {
  options: PhoneOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  label: string;
  pills?: { label: string; selected: boolean; onSelect: () => void }[];
  className?: string;
}) {
  const { dict } = useLocale();
  const t = dict.product;
  const [open, setOpen] = useState(false);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const selected = options.find((o) => o.id === selectedId);
  const shown = options.find((o) => o.id === hoverId) ?? selected;
  const selectedPill = pills.find((p) => p.selected);
  const inCount = options.filter((o) => !o.out && !o.ask).length;
  // Open from the start when the picked tile would sit in a hidden row at the narrowest grid (4 a row).
  const pickedIndex = options.findIndex((o) => o.id === selectedId);
  const isOpen = open || pickedIndex >= PER_ROW.lg * ROWS_SHOWN;
  const n = options.length;
  // The "show all" button only where something is hidden at that width.
  const buttonClass = cn(
    n <= PER_ROW.lg * ROWS_SHOWN && "hidden",
    n <= PER_ROW.xl * ROWS_SHOWN && "xl:hidden",
    n <= PER_ROW.wide * ROWS_SHOWN && "min-[90rem]:hidden"
  );

  return (
    <div className={cn("flex flex-col gap-3", className)} data-desktop-tiles="">
      <div className="flex min-h-6 flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <span className="text-foreground-dim">{label}</span>
        {shown && !(selectedPill && !hoverId) && (
          <span className={cn("font-semibold", hoverId && hoverId !== selectedId ? "text-foreground-muted" : "text-foreground")}>{shown.name}</span>
        )}
        {shown?.best && !(selectedPill && !hoverId) && <OptionBestTag className="px-2 py-1 text-xs" />}
        {selectedPill && !hoverId && <span className="font-semibold text-foreground">{selectedPill.label}</span>}
        <span className="ml-auto text-xs text-foreground-dim">
          {t.optionStockCount.replace("{in}", String(inCount)).replace("{n}", String(n))}
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
                "h-8 rounded-full border px-3 text-xs font-semibold tracking-tight transition-colors",
                p.selected ? "border-ember bg-ember/10 text-foreground" : "border-surface-border text-foreground-muted hover:border-foreground-dim hover:text-foreground"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
      <div
        className={cn(
          "grid grid-cols-[repeat(4,5rem)] gap-2.5 xl:grid-cols-[repeat(5,5rem)] min-[90rem]:grid-cols-[repeat(6,5rem)]"
        )}
        // Two rows at each width while closed (globals.css [data-tiles-closed]); the rest wait for "show all".
        data-tiles-closed={isOpen ? undefined : ""}
        onMouseLeave={() => setHoverId(null)}
      >
        {options.map((o) => {
          const picked = o.id === selectedId;
          const low = !o.out && !o.ask && o.left !== undefined && countKind(o.left) === "low";
          const name = o.out ? `${o.name} — ${t.optionOut}` : o.ask ? `${o.name} — ${t.optionAsk}` : o.name;
          return (
            <button
              key={o.id}
              type="button"
              data-option-id={o.id}
              onClick={() => onSelect(o.id)}
              onMouseEnter={() => setHoverId(o.id)}
              onFocus={() => setHoverId(o.id)}
              onBlur={() => setHoverId(null)}
              aria-pressed={picked}
              aria-label={name}
              title={name}
              className={cn(
                "relative flex size-20 items-center justify-center overflow-hidden rounded-xl border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember",
                picked ? "border-ember bg-surface-2" : "border-surface-border bg-surface-1 hover:border-foreground-dim"
              )}
            >
              {o.image ? (
                <Image src={o.image.src} alt="" fill sizes="80px" className={cn("object-contain p-1.5", o.out && "opacity-40")} />
              ) : (
                <span
                  className={cn("block size-8 rounded-full border border-black/10 shadow-inner", o.out && "opacity-40")}
                  style={{ backgroundColor: o.swatchHex ?? "var(--color-surface-border)" }}
                  aria-hidden
                />
              )}
              {o.best && <OptionBestTag className="absolute left-1 top-1" />}
              {o.out && (
                <span className="absolute bottom-1 right-1 rounded-full bg-surface-0/85 px-1.5 py-0.5 text-[10px] font-medium leading-none text-foreground-muted" aria-hidden>
                  {t.optionOut}
                </span>
              )}
              {low && (
                <span className="absolute bottom-1 right-1 rounded-full border border-low/40 bg-low/10 px-1.5 py-0.5 text-[10px] font-medium leading-none text-low" aria-hidden>
                  {t.stockLeftShort.replace("{n}", String(o.left))}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {n > PER_ROW.lg * ROWS_SHOWN && pickedIndex < PER_ROW.lg * ROWS_SHOWN && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={isOpen}
          className={cn(
            "h-9 self-start rounded-full border border-surface-border px-4 text-xs font-semibold text-foreground-muted transition-colors hover:border-foreground-dim hover:text-foreground",
            buttonClass
          )}
        >
          {isOpen ? t.optionShowLess : t.optionShowAll.replace("{n}", String(n))}
        </button>
      )}
    </div>
  );
}
