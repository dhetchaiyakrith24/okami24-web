"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { StorefrontVariantView } from "@/data/shipnity-seed/storefront-preview-read-model";

/**
 * Shared between the isolated `/preview/product-master` route (Phase 2.8) and the main
 * storefront pilot (Phase 3.0) — moved out of the preview route's private `_components/` folder
 * so main-app code doesn't reach across route segments.
 *
 * Exercises real selected/default variant behavior — defaults to the first variant, click
 * switches selection. Every option rendered here is already guaranteed by the projection to be
 * `childRole: "variant"` — no accessory/sell-unit/unresolved child can reach this component (see
 * `buildVariantStructure` in the projection adapter).
 *
 * Supports both controlled and uncontrolled use. Pass `selectedId`/`onSelect` (as
 * `PilotProductDetail` does, so it can swap the displayed image on selection) to make the parent
 * own selection state; omit both (as the isolated `/preview/product-master` route still does) and
 * the picker manages its own internal state exactly as before — a purely additive change, no
 * existing caller needed to update.
 *
 * Non-"in-stock" dimming (owner mandate, 2026-09-03 — catalog truth vs. stock truth): a variant
 * whose `availabilityStatus` isn't a confirmed `"in-stock"` Shipnity signal (i.e. `"out-of-stock"`
 * or `"unknown"` — see `VerifiedAdditionalOptionValue`'s doc comment in
 * `active-catalog-to-product-master.ts`) renders dimmed with a small out-of-stock mark. It stays
 * fully selectable — a customer can still see it exists and inspect it — `PilotProductDetail`'s own
 * add-to-cart gate is what actually blocks the purchase, this is only the visual signal.
 */
export function ProductMasterVariantPicker({
  optionAxisLabel,
  variants,
  selectedId: controlledSelectedId,
  onSelect,
  outOfStockLabel,
}: {
  optionAxisLabel: string | null;
  variants: StorefrontVariantView[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  outOfStockLabel?: string;
}) {
  const [internalSelectedId, setInternalSelectedId] = useState(variants[0]?.id ?? null);
  const selectedId = controlledSelectedId !== undefined ? controlledSelectedId : internalSelectedId;
  const handleSelect = (id: string) => {
    if (onSelect) onSelect(id);
    else setInternalSelectedId(id);
  };

  if (variants.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {optionAxisLabel && <span className="label-mono text-xs text-foreground-dim">{optionAxisLabel}</span>}
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => {
          const outOfStock = v.availabilityStatus !== "in-stock";
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => handleSelect(v.id)}
              aria-pressed={selectedId === v.id}
              title={outOfStock && outOfStockLabel ? `${v.label} — ${outOfStockLabel}` : v.label}
              className={cn(
                "label-mono inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
                selectedId === v.id
                  ? "border-ember bg-ember-soft/30 text-ember"
                  : "border-surface-border bg-surface-1 text-foreground-muted hover:border-foreground-dim",
                outOfStock && "opacity-50"
              )}
            >
              {v.label}
              {outOfStock && outOfStockLabel && <span className="text-[0.6rem] uppercase tracking-wide">{outOfStockLabel}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
