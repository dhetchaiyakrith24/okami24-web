"use client";

import { useRef } from "react";
import type { FlavorVariant } from "@/types/catalog";
import { cn } from "@/lib/utils";
import { useChipAutoscroll } from "./use-chip-autoscroll";

/**
 * Real manufacturer flavor selector for a Legacy Product Detail hero (owner mandate, 2026-09-03 —
 * "the UX should let customers understand flavors naturally without turning Product Detail into a
 * wall of buttons"). A disposable's real flavor lineup can run into the 20s, so this deliberately
 * does NOT reuse `ColorVariantRail`'s large circular swatch-dot treatment (fine for ~6-8 colors,
 * overwhelming at 20+) — instead a wrapped grid of small labeled pills, each carrying its own
 * name so the list stays scannable without hover/title-only disclosure.
 *
 * Catalog truth vs. stock truth (see `VariantAvailability`'s doc comment) is rendered, not hidden:
 * an `"out-of-stock"` flavor still appears — a verified real flavor is never removed from view
 * just because it isn't currently stocked — but is visually dimmed, its name struck through (owner 08/10), carries the sold-out label,
 * and since stock round batch 2c (owner 08/10) IS selectable, so the customer can look at it; selected, it turns
 * fully opaque with the ember frame and an ember sold-out label. It still never reaches the cart: ProductHero's buy
 * gate shows the sold-out state and `resolveProductRef()`'s legacy branch rejects it server-side. `"unknown"`
 * renders like `"in-stock"` deliberately: we have no live signal either way, and marking it as if
 * confirmed-unavailable would be its own kind of fabrication.
 *
 * Phones (mobile round A, 2026-09-08 — every `max-lg:` class): one sideways-scrolling row edge
 * to edge instead of a wrapped grid, pills at least 44px tall, and the selected pill scrolls
 * itself into view when a gallery swipe selects it (useChipAutoscroll). `lg` and above unchanged.
 */
export function FlavorVariantGrid({
  variants,
  selectedId,
  onSelect,
  label,
  allLabel,
  isAllSelected,
  onSelectAll,
  outOfStockLabel,
  className,
}: {
  variants: FlavorVariant[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  label: string;
  /** "All" chip — same three props as `ColorVariantRail`, added 2026-09-06 when M Bar 15K became
   *  the first FLAVOUR product to carry a `lineupImage`. Until then the lineup view was wired only
   *  to the colour rail, so a flavour product's lineup shot was composed, shipped, and unreachable:
   *  the button that reveals it simply did not exist on this axis. Omit `onSelectAll` and no chip
   *  renders, exactly as before. */
  allLabel?: string;
  isAllSelected?: boolean;
  onSelectAll?: () => void;
  outOfStockLabel: string;
  /** Extra classes on the root (the product page uses it for its phone-only ordering). */
  className?: string;
}) {
  const selected = variants.find((v) => v.id === selectedId);
  const listRef = useRef<HTMLDivElement>(null);
  useChipAutoscroll(listRef, isAllSelected ? null : selectedId);

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <span className="label-mono text-xs text-foreground-dim">
        {label}
        {!isAllSelected && selected && <span className="ml-2 font-sans normal-case text-foreground-muted">{selected.name}</span>}
        {isAllSelected && allLabel && <span className="ml-2 font-sans normal-case text-foreground-muted">{allLabel}</span>}
      </span>
      <div
        ref={listRef}
        className="okami-chip-row flex flex-wrap gap-2 sm:max-h-56 sm:overflow-y-auto sm:pr-1 max-lg:-mx-5 max-lg:max-h-none max-lg:flex-nowrap max-lg:overflow-x-auto max-lg:overflow-y-hidden max-lg:px-5 max-lg:py-0.5 max-lg:pr-5 max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden"
      >
        {onSelectAll && (
          <button
            type="button"
            onClick={onSelectAll}
            aria-pressed={isAllSelected}
            title={allLabel}
            className={cn(
              "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold tracking-tight transition-all duration-150 max-lg:min-h-11 max-lg:shrink-0 max-lg:px-4 max-lg:text-sm",
              isAllSelected
                ? "border-ember bg-ember/10 text-foreground"
                : "border-surface-border text-foreground-muted hover:border-foreground-dim hover:text-foreground"
            )}
          >
            {allLabel}
          </button>
        )}
        {variants.map((v) => {
          const outOfStock = v.availability === "out-of-stock";
          const selected = v.id === selectedId && !isAllSelected;
          return (
            <button
              key={v.id}
              type="button"
              data-option-id={v.id}
              onClick={() => onSelect(v.id)}
              aria-pressed={v.id === selectedId}
              title={outOfStock ? `${v.name} — ${outOfStockLabel}` : v.name}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-150 max-lg:min-h-11 max-lg:shrink-0 max-lg:whitespace-nowrap max-lg:px-4 max-lg:text-sm",
                selected
                  ? "border-ember bg-ember/10 text-foreground"
                  : "border-surface-border text-foreground-muted hover:border-foreground-dim hover:text-foreground",
                // Sold out: dashed + dimmed until picked; picked = full opacity so the ember frame reads as selected.
                outOfStock && !selected && "border-dashed opacity-50 hover:opacity-80",
                outOfStock && selected && "text-foreground-muted"
              )}
            >
              <span
                className="block h-2.5 w-2.5 shrink-0 rounded-full border border-black/10"
                style={{ backgroundColor: v.swatchHex }}
                aria-hidden
              />
              <span className={cn(outOfStock && "line-through decoration-foreground-dim")}>{v.name}</span>
              {outOfStock && <span className={cn("text-[0.6rem] uppercase tracking-wide", selected ? "text-ember" : "text-foreground-dim")}>{outOfStockLabel}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
