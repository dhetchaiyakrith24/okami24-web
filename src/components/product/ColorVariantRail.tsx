"use client";

import { useRef } from "react";
import type { ColorVariant } from "@/types/catalog";
import { cn } from "@/lib/utils";
import { useChipAutoscroll } from "./use-chip-autoscroll";

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
 *
 * Sold-out colours (owner instruction, 2026-09-06): a colour whose `availability` is
 * `"out-of-stock"` still renders — catalog truth is never hidden — but dimmed, struck through
 * with a diagonal and labelled in its tooltip. Since stock round batch 2c (owner 08/10) it IS selectable, so the
 * customer can look at that colour's photo; ProductHero then shows the sold-out state (photo badge + buy action) and
 * the cart gates (ProductHero + `resolveProductRef()`) keep it out of the cart. `"unknown"`/absent renders like
 * in-stock, matching the legacy cart gate.
 *
 * Phones (mobile round A, 2026-09-08 — every `max-lg:` class): the row no longer wraps, it
 * scrolls sideways edge to edge, each dot is a 44×44 target, and the selected dot scrolls itself
 * into view when the gallery swipe changes the selection (useChipAutoscroll). At `lg` and above
 * nothing here changed.
 */
export function ColorVariantRail({
  variants,
  selectedId,
  onSelect,
  label,
  allLabel,
  isAllSelected,
  onSelectAll,
  allChips,
  outOfStockLabel,
  className,
}: {
  variants: ColorVariant[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  label: string;
  allLabel?: string;
  isAllSelected?: boolean;
  onSelectAll?: () => void;
  /** More than one "all" image: one pill per image, in order (replaces `allLabel`/`isAllSelected`/`onSelectAll`). */
  allChips?: { label: string; selected: boolean; onSelect: () => void }[];
  outOfStockLabel?: string;
  /** Extra classes on the root (the product page uses it for its phone-only ordering). */
  className?: string;
}) {
  // Several "all" images (lineupImage2 — owner 01/10: Caliburn G3 Pro's 16 colours as two groups of 8): one pill each,
  // labelled by the parent ("ทั้งหมด 1", "ทั้งหมด 2"); `allLabel`/`isAllSelected`/`onSelectAll` stay the single-pill case.
  const pills = allChips ?? (onSelectAll && allLabel ? [{ label: allLabel, selected: !!isAllSelected, onSelect: onSelectAll }] : []);
  const selectedPill = pills.find((p) => p.selected);
  const selected = variants.find((v) => v.id === selectedId);
  const listRef = useRef<HTMLDivElement>(null);
  const anyAll = !!selectedPill;
  useChipAutoscroll(listRef, anyAll ? null : selectedId);

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <span className="label-mono text-xs text-foreground-dim">
        {label}
        {!anyAll && selected && <span className="ml-2 font-sans normal-case text-foreground-muted">{selected.name}</span>}
        {selectedPill && <span className="ml-2 font-sans normal-case text-foreground-muted">{selectedPill.label}</span>}
      </span>
      <div
        ref={listRef}
        className="okami-chip-row flex flex-wrap items-center gap-2.5 max-lg:-mx-5 max-lg:flex-nowrap max-lg:overflow-x-auto max-lg:overflow-y-hidden max-lg:px-5 max-lg:py-1.5 max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden"
      >
        {pills.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={p.onSelect}
            aria-pressed={p.selected}
            title={p.label}
            className={cn(
              "flex h-8 shrink-0 items-center rounded-full border px-3 text-xs font-semibold tracking-tight transition-all duration-150 max-lg:h-11 max-lg:px-4 max-lg:text-sm",
              p.selected
                ? "border-ember bg-ember/10 text-foreground"
                : "border-surface-border text-foreground-muted hover:border-foreground-dim hover:text-foreground"
            )}
          >
            {p.label}
          </button>
        ))}
        {variants.map((v) => {
          const outOfStock = v.availability === "out-of-stock";
          return (
            <button
              key={v.id}
              type="button"
              data-option-id={v.id}
              onClick={() => onSelect(v.id)}
              aria-label={outOfStock && outOfStockLabel ? `${v.name} — ${outOfStockLabel}` : v.name}
              aria-pressed={!anyAll && v.id === selectedId}
              title={outOfStock && outOfStockLabel ? `${v.name} — ${outOfStockLabel}` : v.name}
              className={cn(
                "relative h-8 w-8 shrink-0 rounded-full ring-2 ring-offset-2 ring-offset-surface-1 transition-all duration-150 max-lg:h-11 max-lg:w-11",
                !anyAll && v.id === selectedId
                  ? "scale-110 ring-ember"
                  : "ring-transparent hover:scale-105 hover:ring-surface-border"
              )}
            >
              <span
                className={cn("block h-full w-full rounded-full border border-black/10 shadow-inner", outOfStock && "opacity-35")}
                style={{ backgroundColor: v.swatchHex }}
                aria-hidden
              />
              {outOfStock && (
                <span
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[2px] w-9 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-foreground/80 max-lg:w-12"
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>
      {outOfStockLabel && variants.some((v) => v.availability === "out-of-stock") && (
        <span className="text-xs text-foreground-dim">
          {variants
            .filter((v) => v.availability === "out-of-stock")
            .map((v) => v.name)
            .join(", ")}
          {" — "}
          {outOfStockLabel}
        </span>
      )}
    </div>
  );
}
