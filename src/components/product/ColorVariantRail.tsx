"use client";

import type { ColorVariant } from "@/types/catalog";
import { cn } from "@/lib/utils";

/**
 * Real manufacturer color/finish selector for a Legacy Product Detail hero (owner quality review,
 * 2026-09-02 — "Legacy 28 color/variant coverage"). A row of swatch dots, not a dropdown — the
 * owner explicitly asked for a native, cinematic interaction rather than generic HTML `<select>`.
 * Selecting a color with a verified `image` swaps the hero photo (handled by the parent, which
 * owns `selectedId`); selecting a color with no `image` still updates the name label and the
 * selection ring, it just leaves the hero photo as-is — this is the deliberate "don't pretend a
 * color exists if its exact image is unavailable" rule, made visible rather than hidden.
 *
 * "All Colors" chip (owner mandate, 2026-09-03 — every multi-color family should let a customer
 * move naturally between one lineup view and individual colors). Rendered ONLY when the parent
 * passes `onSelectAll` (i.e. `product.lineupImage` exists — see `ProductHero`) so a family with no
 * real lineup shot never shows a chip that does nothing. Deliberately styled as a small labeled
 * pill, not another color dot — it isn't a color, and shouldn't visually pretend to be one.
 */
export function ColorVariantRail({
  variants,
  selectedId,
  onSelect,
  label,
  allLabel,
  isAllSelected,
  onSelectAll,
}: {
  variants: ColorVariant[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  label: string;
  allLabel?: string;
  isAllSelected?: boolean;
  onSelectAll?: () => void;
}) {
  const selected = variants.find((v) => v.id === selectedId);

  return (
    <div className="flex flex-col gap-2.5">
      <span className="label-mono text-xs text-foreground-dim">
        {label}
        {!isAllSelected && selected && <span className="ml-2 font-sans normal-case text-foreground-muted">{selected.name}</span>}
        {isAllSelected && allLabel && <span className="ml-2 font-sans normal-case text-foreground-muted">{allLabel}</span>}
      </span>
      <div className="flex flex-wrap items-center gap-2.5">
        {onSelectAll && (
          <button
            type="button"
            onClick={onSelectAll}
            aria-pressed={isAllSelected}
            title={allLabel}
            className={cn(
              "flex h-8 shrink-0 items-center rounded-full border px-3 text-xs font-semibold tracking-tight transition-all duration-150",
              isAllSelected
                ? "border-ember bg-ember/10 text-foreground"
                : "border-surface-border text-foreground-muted hover:border-foreground-dim hover:text-foreground"
            )}
          >
            {allLabel}
          </button>
        )}
        {variants.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => onSelect(v.id)}
            aria-label={v.name}
            aria-pressed={!isAllSelected && v.id === selectedId}
            title={v.name}
            className={cn(
              "h-8 w-8 shrink-0 rounded-full ring-2 ring-offset-2 ring-offset-surface-1 transition-all duration-150",
              !isAllSelected && v.id === selectedId
                ? "scale-110 ring-ember"
                : "ring-transparent hover:scale-105 hover:ring-surface-border"
            )}
          >
            <span
              className="block h-full w-full rounded-full border border-black/10 shadow-inner"
              style={{ backgroundColor: v.swatchHex }}
              aria-hidden
            />
          </button>
        ))}
      </div>
    </div>
  );
}
