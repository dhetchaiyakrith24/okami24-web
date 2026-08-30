"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { StorefrontVariantView } from "@/data/shipnity-seed/storefront-preview-read-model";

/**
 * Exercises real selected/default variant behavior (Phase 2.8 VARIANTS requirement) — defaults
 * to the first variant, click switches selection. Every option rendered here is already
 * guaranteed by the projection to be `childRole: "variant"` — no accessory/sell-unit/unresolved
 * child can reach this component (see `buildVariantStructure` in the projection adapter).
 */
export function PreviewVariantPicker({ optionAxisLabel, variants }: { optionAxisLabel: string | null; variants: StorefrontVariantView[] }) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? null);

  if (variants.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {optionAxisLabel && <span className="label-mono text-xs text-foreground-dim">{optionAxisLabel}</span>}
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setSelectedId(v.id)}
            aria-pressed={selectedId === v.id}
            className={cn(
              "label-mono rounded-full border px-3 py-1.5 text-xs transition-colors",
              selectedId === v.id
                ? "border-ember bg-ember-soft/30 text-ember"
                : "border-surface-border bg-surface-1 text-foreground-muted hover:border-foreground-dim"
            )}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}
