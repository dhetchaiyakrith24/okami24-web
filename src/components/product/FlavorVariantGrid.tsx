"use client";

import type { FlavorVariant } from "@/types/catalog";
import { cn } from "@/lib/utils";

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
 * just because it isn't currently stocked — but is visually dimmed, carries the sold-out label,
 * and (since 2026-09-06, owner instruction) is NOT selectable: `disabled`, no click handler, so it
 * can never become the flavour that goes into the cart. Priced legacy products now DO have a real
 * cart action (see `ProductHero` / `resolveProductRef()`'s legacy branch), and the server-side gate
 * rejects an out-of-stock option anyway — this is the matching client-side half. `"unknown"`
 * renders like `"in-stock"` deliberately: we have no live signal either way, and marking it as if
 * confirmed-unavailable would be its own kind of fabrication.
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
}) {
  const selected = variants.find((v) => v.id === selectedId);

  return (
    <div className="flex flex-col gap-2.5">
      <span className="label-mono text-xs text-foreground-dim">
        {label}
        {!isAllSelected && selected && <span className="ml-2 font-sans normal-case text-foreground-muted">{selected.name}</span>}
        {isAllSelected && allLabel && <span className="ml-2 font-sans normal-case text-foreground-muted">{allLabel}</span>}
      </span>
      <div className="flex flex-wrap gap-2 sm:max-h-56 sm:overflow-y-auto sm:pr-1">
        {onSelectAll && (
          <button
            type="button"
            onClick={onSelectAll}
            aria-pressed={isAllSelected}
            title={allLabel}
            className={cn(
              "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold tracking-tight transition-all duration-150",
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
          return (
            <button
              key={v.id}
              type="button"
              onClick={outOfStock ? undefined : () => onSelect(v.id)}
              disabled={outOfStock}
              aria-disabled={outOfStock || undefined}
              aria-pressed={v.id === selectedId}
              title={outOfStock ? `${v.name} — ${outOfStockLabel}` : v.name}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-150",
                v.id === selectedId && !isAllSelected
                  ? "border-ember bg-ember/10 text-foreground"
                  : "border-surface-border text-foreground-muted hover:border-foreground-dim hover:text-foreground",
                outOfStock && "cursor-not-allowed border-dashed opacity-50 hover:border-surface-border hover:text-foreground-muted"
              )}
            >
              <span
                className="block h-2.5 w-2.5 shrink-0 rounded-full border border-black/10"
                style={{ backgroundColor: v.swatchHex }}
                aria-hidden
              />
              <span>{v.name}</span>
              {outOfStock && <span className="text-[0.6rem] uppercase tracking-wide text-foreground-dim">{outOfStockLabel}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
