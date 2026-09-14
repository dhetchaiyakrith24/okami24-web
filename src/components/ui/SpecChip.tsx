import type { Specification } from "@/types/catalog";
import { cn } from "@/lib/utils";

// Round 30.4 batch 1: the badge word and its hover text come from the caller's dictionary
// (SpecSheet passes `dict.product.unverifiedBadge` / `unverifiedTooltip`) — they were hardcoded
// English here and showed on Thai pages. The English defaults keep any other caller unchanged.
//
// Round 30.4ค batch 1 (owner 2026-09-15): the caller may pass the label to DISPLAY (`label` — the
// Thai overlay from spec-labels-th.ts; the data label is the fallback) and, when that label is Thai,
// `thaiLabel` — the label row then drops `.label-mono`'s mono face, 0.08em tracking and uppercase
// (Thai does not letter-space, and the mono face has no Thai glyphs; same fix as
// OptionCountBadge.tsx) and takes weight 500 + `text-foreground-muted` — designer option A, owner
// 2026-09-15: without uppercase/tracking/mono the 0.65rem Thai label lost the mass the English one
// had and read fainter than its value; the size stays so the row height (16px) and every layout
// measurement stay exactly as before. The `!` matters: `.label-mono` lives in globals.css after
// `@import "tailwindcss"`, so a plain `tracking-normal` would lose on source order. English and
// Chinese visitors never set either prop, so nothing changes for them.
//
// Round 30.4ค batch 2 (owner 2026-09-15): same for the VALUE — `value` is the string to display
// (the Thai overlay in product-copy-th.ts `specifications[key]`); the data value is the fallback.
export function SpecChip({
  spec,
  label,
  value,
  thaiLabel = false,
  className,
  unverifiedLabel = "unverified",
  unverifiedTitle = "Not independently confirmed against an official source",
}: {
  spec: Specification;
  label?: string;
  value?: string;
  thaiLabel?: boolean;
  className?: string;
  unverifiedLabel?: string;
  unverifiedTitle?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 border-l-2 py-1.5 pl-3",
        spec.sourceStatus === "verified" ? "border-surface-border" : "border-unverified/50",
        className
      )}
    >
      <div className={cn("label-mono flex items-center gap-2 text-[0.65rem] text-foreground-dim", thaiLabel && "font-sans! font-medium tracking-normal! normal-case! text-foreground-muted")}>
        <span>{label ?? spec.label}</span>
        {spec.sourceStatus === "unverified" && (
          <span className="text-unverified" title={unverifiedTitle}>
            {unverifiedLabel}
          </span>
        )}
      </div>
      <div className="font-body text-sm text-foreground">{value ?? spec.value}</div>
    </div>
  );
}
