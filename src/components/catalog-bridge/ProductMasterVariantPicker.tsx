"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { StorefrontVariantView } from "@/data/shipnity-seed/storefront-preview-read-model";
import { useChipAutoscroll } from "@/components/product/use-chip-autoscroll";

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
 *
 * Phones (mobile round A, 2026-09-08 — every `max-lg:` class): one sideways-scrolling row edge
 * to edge, pills at least 44px tall, selected pill scrolls itself into view after a gallery
 * swipe (useChipAutoscroll). `lg` and above unchanged.
 */
export function ProductMasterVariantPicker({
  optionAxisLabel,
  variants,
  selectedId: controlledSelectedId,
  onSelect,
  outOfStockLabel,
  className,
}: {
  optionAxisLabel: string | null;
  variants: StorefrontVariantView[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  outOfStockLabel?: string;
  /** Extra classes on the root (the product page uses it for its phone-only ordering). */
  className?: string;
}) {
  const [internalSelectedId, setInternalSelectedId] = useState(variants[0]?.id ?? null);
  const selectedId = controlledSelectedId !== undefined ? controlledSelectedId : internalSelectedId;
  const handleSelect = (id: string) => {
    if (onSelect) onSelect(id);
    else setInternalSelectedId(id);
  };
  const listRef = useRef<HTMLDivElement>(null);
  useChipAutoscroll(listRef, selectedId);

  if (variants.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {optionAxisLabel && <span className="label-mono text-xs text-foreground-dim">{optionAxisLabel}</span>}
      <div
        ref={listRef}
        className="okami-chip-row flex flex-wrap gap-2 max-lg:-mx-5 max-lg:flex-nowrap max-lg:overflow-x-auto max-lg:overflow-y-hidden max-lg:px-5 max-lg:py-0.5 max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden"
      >
        {variants.map((v) => {
          const outOfStock = v.availabilityStatus !== "in-stock";
          return (
            <button
              key={v.id}
              type="button"
              data-option-id={v.id}
              onClick={() => handleSelect(v.id)}
              aria-pressed={selectedId === v.id}
              title={outOfStock && outOfStockLabel ? `${v.label} — ${outOfStockLabel}` : v.label}
              className={cn(
                "label-mono inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors max-lg:min-h-11 max-lg:shrink-0 max-lg:whitespace-nowrap max-lg:px-4 max-lg:text-sm",
                selectedId === v.id
                  ? "border-ember bg-ember-soft/30 text-ember"
                  : "border-surface-border bg-surface-1 text-foreground-muted hover:border-foreground-dim",
                outOfStock && "opacity-50"
              )}
            >
              <span className={cn(outOfStock && "line-through decoration-foreground-dim")}>{v.label}</span>
              {outOfStock && outOfStockLabel && <span className="text-[0.6rem] uppercase tracking-wide">{outOfStockLabel}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
