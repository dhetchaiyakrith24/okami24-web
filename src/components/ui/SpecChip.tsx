import type { Specification } from "@/types/catalog";
import { cn } from "@/lib/utils";

// Round 30.4 batch 1: the badge word and its hover text come from the caller's dictionary
// (SpecSheet passes `dict.product.unverifiedBadge` / `unverifiedTooltip`) — they were hardcoded
// English here and showed on Thai pages. The English defaults keep any other caller unchanged.
export function SpecChip({
  spec,
  className,
  unverifiedLabel = "unverified",
  unverifiedTitle = "Not independently confirmed against an official source",
}: {
  spec: Specification;
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
        <span>{spec.label}</span>
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
