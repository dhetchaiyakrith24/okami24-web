import type { Specification } from "@/types/catalog";
import { cn } from "@/lib/utils";

// Round 30.4 batch 1: the badge word and its hover text come from the caller's dictionary
// (SpecSheet passes `dict.product.unverifiedBadge` / `unverifiedTooltip`) — they were hardcoded
// English here and showed on Thai pages. The English defaults keep any other caller unchanged.
//
// Round 30.4ค batch 1 (owner 2026-09-15): the caller may pass the label to DISPLAY (`label` — the
// Thai overlay from spec-labels-th.ts; the data label is the fallback). English and Chinese
// visitors never set it, so nothing changes for them.
export function SpecChip({
  spec,
  label,
  className,
  unverifiedLabel = "unverified",
  unverifiedTitle = "Not independently confirmed against an official source",
}: {
  spec: Specification;
  label?: string;
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
      <div className="label-mono flex items-center gap-2 text-[0.65rem] text-foreground-dim">
        <span>{label ?? spec.label}</span>
        {spec.sourceStatus === "unverified" && (
          <span className="text-unverified" title={unverifiedTitle}>
            {unverifiedLabel}
          </span>
        )}
      </div>
      <div className="font-body text-sm text-foreground">{spec.value}</div>
    </div>
  );
}
