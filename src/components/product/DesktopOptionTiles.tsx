"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import type { PhotoBox } from "@/lib/option-photo-box";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { countKind } from "@/lib/stock/count-rules";
import { OptionBestTag } from "@/components/catalog/SalesBadge";
import type { PhoneOption } from "./PhoneOptionTiles";

/**
 * Desktop colour tiles (owner-approved mock 12/11, designer pass c1 — shared notes look-1211-design-passes.md "A desktop colour
 * tiles"; owner 13/11 "จัดการส่วนที่เหลือต่อเลย" → the default for everyone, the `?preview=tiles` gate removed): at `lg` and
 * above the colour picker is a grid of real-device photo tiles instead of 32px swatch dots (ColorVariantRail).
 *   - portrait tiles, fixed 60×100px (never 1fr): 6 a row at lg · 7 at xl · 8 from 1440. The option photos are slim devices
 *     on square canvases (20–39 % of the width, 84 % of the height), so a square tile showed a ~15px sliver (checker 13/11:
 *     Black / Gray / Brown / Green not tellable apart). The photo now covers the tall tile and is lifted to ~94 % of its
 *     height — the whole device, only empty canvas is trimmed (Owner eye 16: products whole, never a hard crop);
 *   - closed: one row at lg (keeps the buy button on a 1024×900 first screen), two rows from xl; "show all" opens the rest
 *     (open from the start when the picked colour sits past the rows shown);
 *   - picture only — the head row names the picked colour, and the hovered / focused tile's name while the pointer is on it;
 *   - picked = 2px orange frame + a faint orange floor light · sold out = photo at 65 % (its colour still reads) + "หมด"
 *     on a soft fade at the tile's foot · ≤ 3 left = amber "เหลือ N" on the same fade · best seller = the "ขายดี" tag
 *     top-left · no photo = the swatch dot · no green "มีของ" tag on desktop (designer);
 *   - the "all colours" pills stay a pill row above the grid — a lineup is not a colour.
 */
const ROWS_SHOWN = { lg: 1, xl: 2, wide: 2 } as const;
const PER_ROW = { lg: 6, xl: 7, wide: 8 } as const;
/** How many tiles a closed grid shows at each width (globals.css [data-tiles-closed] mirrors these). */
const SHOWN = { lg: PER_ROW.lg * ROWS_SHOWN.lg, xl: PER_ROW.xl * ROWS_SHOWN.xl, wide: PER_ROW.wide * ROWS_SHOWN.wide } as const;

/** The tile's inner box (60×100 minus the 2px border) and how much of it the device may fill. */
const INNER = { w: 56, h: 96 } as const;
const FILL = { h: 0.92, w: 0.86 } as const;

/** Rendered height of the photo's whole canvas: the device (its box in the photo) as tall as the tile allows, never wider
 *  than the tile — the whole device always shows (Owner eye 16), only empty canvas falls outside. No box = the plain
 *  whole-photo view (the canvas fits the tile). */
function canvasHeight(box: PhotoBox | undefined): number {
  if (!box) return Math.min(INNER.h, INNER.w);
  const [top, bottom, left, right, aspect] = box;
  const devH = Math.max(bottom - top, 0.05);
  const devW = Math.max((right - left) * aspect, 0.05);
  return Math.min((FILL.h * INNER.h) / devH, (FILL.w * INNER.w) / devW);
}

function photoWidth(box: PhotoBox | undefined): number {
  return canvasHeight(box) * (box?.[4] ?? 1);
}

/** Absolute box for the photo's canvas inside the tile, so the device's centre lands on the tile's centre. */
function fitPhoto(box: PhotoBox | undefined): CSSProperties {
  const h = canvasHeight(box);
  const w = photoWidth(box);
  const cx = box ? ((box[2] + box[3]) / 2) * w : w / 2;
  const cy = box ? ((box[0] + box[1]) / 2) * h : h / 2;
  return { width: w, height: h, left: INNER.w / 2 - cx, top: INNER.h / 2 - cy };
}

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
  // Open from the start when the picked tile would sit in a hidden row at the narrowest grid (lg).
  const pickedIndex = options.findIndex((o) => o.id === selectedId);
  const isOpen = open || pickedIndex >= SHOWN.lg;
  const n = options.length;
  const showAll = n > SHOWN.lg && pickedIndex < SHOWN.lg;
  // The "show all" button only where something is hidden at that width.
  const buttonClass = cn(n <= SHOWN.xl && "xl:hidden", n <= SHOWN.wide && "min-[90rem]:hidden");

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
      {/* "Show all" sits in the pill row (or alone when there are no pills), not under the grid: a row of its own pushed the
          buy button 10px below a 1440×900 screen's fold (measured 12/11 on Caliburn G3 Pro). */}
      {(pills.length > 0 || showAll) && (
        <div className="flex flex-wrap items-center gap-2">
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
          {showAll && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={isOpen}
            className={cn(
              "ml-auto h-8 rounded-full border border-surface-border px-4 text-xs font-semibold text-foreground-muted transition-colors hover:border-foreground-dim hover:text-foreground",
              buttonClass
            )}
          >
            {isOpen ? t.optionShowLess : t.optionShowAll.replace("{n}", String(n))}
          </button>
          )}
        </div>
      )}
      <div
        className={cn(
          "grid grid-cols-[repeat(6,3.75rem)] gap-2 xl:grid-cols-[repeat(7,3.75rem)] min-[90rem]:grid-cols-[repeat(8,3.75rem)]"
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
                "relative flex h-[6.25rem] w-[3.75rem] items-center justify-center overflow-hidden rounded-xl border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember",
                picked
                  ? "border-ember bg-[radial-gradient(ellipse_at_50%_100%,rgb(var(--ember-rgb)/0.16),transparent_70%)] bg-surface-2"
                  : "border-surface-border bg-surface-1 hover:border-foreground-dim"
              )}
            >
              {o.image ? (
                <span className={cn("absolute", o.out && "opacity-65")} style={fitPhoto(o.box)} aria-hidden>
                  <Image src={o.image.src} alt="" fill sizes={`${Math.ceil(photoWidth(o.box))}px`} className="object-contain" />
                </span>
              ) : (
                <span
                  className={cn("block size-8 rounded-full border border-black/10 shadow-inner", o.out && "opacity-65")}
                  style={{ backgroundColor: o.swatchHex ?? "var(--color-surface-border)" }}
                  aria-hidden
                />
              )}
              {o.best && <OptionBestTag className="absolute left-0.5 top-0.5" />}
              {(o.out || low) && (
                // A soft fade at the tile's foot (Owner eye 16), not a pill on the device.
                <span
                  className={cn(
                    "absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface-0/95 via-surface-0/75 to-transparent pb-1 pt-4 text-center text-[11px] font-semibold leading-none",
                    o.out ? "text-foreground" : "text-low"
                  )}
                  aria-hidden
                >
                  {o.out ? t.optionOut : t.stockLeftShort.replace("{n}", String(o.left))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
