import { cn } from "@/lib/utils";
import type { PreviewGlyphKind } from "@/data/shipnity-seed/storefront-preview-read-model";

/**
 * DEV-PREVIEW-ONLY fallback illustration — not production-approved media, not an exact
 * hardware likeness. Phase 2.8 replaced the single coil-only glyph after browser review
 * surfaced that 3 of the 5 preview products are actually pods/cartridges, not coils (see the
 * Phase 2.8 report §PRODUCT TYPE CORRECTIONS) — rendering all 5 with a coil silhouette would
 * have been a real, visible misrepresentation of physical product type, not just a labeling
 * nit. Reuses the same visual language (steel-accent, same CSS design tokens) as the approved
 * `DeviceGlyph` component's coil/cartridge variants, redrawn locally: `DeviceGlyph` requires
 * `product.attributes.screenType`, which is `null` on every Shipnity-sourced draft.
 */
export function PreviewProductGlyph({ kind, className }: { kind: PreviewGlyphKind; className?: string }) {
  return (
    <svg viewBox="0 0 240 400" className={cn("h-full w-full", className)} role="img" aria-label={`${kind === "generic" ? "Product" : kind} illustration (placeholder, not the real product photo)`}>
      <defs>
        <linearGradient id="preview-glyph-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-surface-3)" />
          <stop offset="55%" stopColor="var(--color-surface-1)" />
          <stop offset="100%" stopColor="var(--color-surface-0)" />
        </linearGradient>
      </defs>
      {kind === "pod-cartridge" ? (
        <g>
          <rect x="90" y="120" width="60" height="180" rx="16" fill="url(#preview-glyph-body)" stroke="var(--color-surface-border)" strokeWidth="1.5" />
          <rect x="100" y="140" width="40" height="110" rx="8" fill="var(--color-steel-soft)" opacity="0.55" />
          <rect x="100" y="140" width="40" height="30" rx="6" fill="var(--color-steel)" opacity="0.3" />
          <ellipse cx="120" cy="112" rx="16" ry="10" fill="var(--color-surface-3)" />
          <rect x="102" y="270" width="36" height="10" rx="5" fill="var(--color-surface-2)" />
        </g>
      ) : kind === "coil" ? (
        <g>
          <circle cx="120" cy="200" r="90" fill="url(#preview-glyph-body)" stroke="var(--color-surface-border)" strokeWidth="1.5" />
          <circle cx="120" cy="200" r="52" fill="none" stroke="var(--color-steel)" strokeOpacity="0.6" strokeWidth="6" strokeDasharray="10 10" />
          <circle cx="120" cy="200" r="18" fill="var(--color-surface-2)" />
        </g>
      ) : (
        // Generic placeholder — used only if a future preview batch has a systemType this
        // component doesn't have a dedicated shape for yet. Deliberately plain, not a guess.
        <g>
          <rect x="70" y="70" width="100" height="260" rx="20" fill="url(#preview-glyph-body)" stroke="var(--color-surface-border)" strokeWidth="1.5" />
          <circle cx="120" cy="200" r="10" fill="var(--color-steel)" opacity="0.5" />
        </g>
      )}
    </svg>
  );
}
