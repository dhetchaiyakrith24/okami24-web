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
 * just because it isn't currently stocked — but is visually dimmed with a small "หมด" mark. Legacy
 * Product Detail has no cart/purchase action at all (informational-only, unlike ProductMaster's
 * real commerce pipeline), so there is no button-disabling to do here — the badge is the entire
 * honesty mechanism. `"unknown"` renders like `"in-stock"` deliberately: we have no live signal
 * either way, and marking it as if confirmed-unavailable would be its own kind of fabrication.
 */
export function FlavorVariantGrid({
  variants,
  selectedId,
  onSelect,
  label,
  outOfStockLabel,
}: {
  variants: FlavorVariant[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  label: string;
  outOfStockLabel: string;
}) {
  const selected = variants.find((v) => v.id === selectedId);

  return (
    <div className="flex flex-col gap-2.5">
      <span className="label-mono text-xs text-foreground-dim">
        {label}
        {selected && <span className="ml-2 font-sans normal-case text-foreground-muted">{selected.name}</span>}
      </span>
      <div className="flex max-h-56 flex-wrap gap-2 overflow-y-auto pr-1">
        {variants.map((v) => {
          const outOfStock = v.availability === "out-of-stock";
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onSelect(v.id)}
              aria-pressed={v.id === selectedId}
              title={outOfStock ? `${v.name} — ${outOfStockLabel}` : v.name}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-150",
                v.id === selectedId
                  ? "border-ember bg-ember/10 text-foreground"
                  : "border-surface-border text-foreground-muted hover:border-foreground-dim hover:text-foreground",
                outOfStock && "opacity-50"
              )}
            >
              <span
                className="block h-2.5 w-2.5 shrink-0 rounded-full border border-black/10"
                style={{ backgroundColor: v.swatchHex }}
                aria-hidden
              />
              {v.name}
              {outOfStock && <span className="text-[0.6rem] uppercase tracking-wide text-foreground-dim">{outOfStockLabel}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
