import type { Specification } from "@/types/catalog";
import { cn } from "@/lib/utils";

export function SpecChip({ spec, className }: { spec: Specification; className?: string }) {
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
          <span className="text-unverified" title="Not independently confirmed against an official source">
            unverified
          </span>
        )}
      </div>
      <div className="font-body text-sm text-foreground">{spec.value}</div>
    </div>
  );
}
