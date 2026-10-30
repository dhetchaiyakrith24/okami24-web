"use client";

import type { ColorVariant } from "@/types/catalog";
import { cn } from "@/lib/utils";
import { PhoneOptionTiles } from "./PhoneOptionTiles";
import { LowStockDot, useLowStockTitle } from "./StockCount";

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
 * Phones (queue Q5, owner 24/10): below `lg` the dot row is replaced by PhoneOptionTiles (photo tiles with
 * an in-stock / sold-out pill; a photo strip past 12 options). At `lg` and above the dots are unchanged.
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
  counts,
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
  /** Live warehouse count per option id (/api/stock — owner 30/10); empty until it arrives. */
  counts?: Record<string, number>;
  /** Extra classes on the root (the product page uses it for its phone-only ordering). */
  className?: string;
}) {
  // Several "all" images (lineupImage2 — owner 01/10: Caliburn G3 Pro's 16 colours as two groups of 8): one pill each,
  // labelled by the parent ("ทั้งหมด 1", "ทั้งหมด 2"); `allLabel`/`isAllSelected`/`onSelectAll` stay the single-pill case.
  const pills = allChips ?? (onSelectAll && allLabel ? [{ label: allLabel, selected: !!isAllSelected, onSelect: onSelectAll }] : []);
  const selectedPill = pills.find((p) => p.selected);
  const selected = variants.find((v) => v.id === selectedId);
  const anyAll = !!selectedPill;
  const lowTitle = useLowStockTitle();

  return (
    <div data-option-picker className={cn("flex flex-col gap-2.5", className)}>
      <PhoneOptionTiles
        className="lg:hidden"
        options={variants.map((v) => ({ id: v.id, name: v.name, image: v.image, swatchHex: v.swatchHex, out: v.availability === "out-of-stock", left: counts?.[v.id] }))}
        selectedId={anyAll ? null : selectedId}
        onSelect={onSelect}
        label={label}
        pills={pills}
      />
      <span className="label-mono text-xs text-foreground-dim max-lg:hidden">
        {label}
        {!anyAll && selected && <span className="ml-2 font-sans normal-case text-foreground-muted">{selected.name}</span>}
        {selectedPill && <span className="ml-2 font-sans normal-case text-foreground-muted">{selectedPill.label}</span>}
      </span>
      <div className="flex flex-wrap items-center gap-2.5 max-lg:hidden">
        {pills.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={p.onSelect}
            aria-pressed={p.selected}
            title={p.label}
            className={cn(
              "flex h-8 shrink-0 items-center rounded-full border px-3 text-xs font-semibold tracking-tight transition-all duration-150",
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
          const name = outOfStock && outOfStockLabel ? `${v.name} — ${outOfStockLabel}` : lowTitle(v.name, counts?.[v.id]) ?? v.name;
          return (
            <button
              key={v.id}
              type="button"
              data-option-id={v.id}
              onClick={() => onSelect(v.id)}
              aria-label={name}
              aria-pressed={!anyAll && v.id === selectedId}
              title={name}
              className={cn(
                "relative h-8 w-8 shrink-0 rounded-full ring-2 ring-offset-2 ring-offset-surface-1 transition-all duration-150",
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
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[2px] w-9 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-foreground/80"
                  aria-hidden
                />
              )}
              {!outOfStock && <LowStockDot left={counts?.[v.id]} />}
            </button>
          );
        })}
      </div>
      {outOfStockLabel && variants.some((v) => v.availability === "out-of-stock") && (
        <span className="text-xs text-foreground-dim max-lg:hidden">
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
