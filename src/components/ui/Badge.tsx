import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { labelLang } from "@/lib/label-lang";

type BadgeTone = "ember" | "steel" | "neutral" | "verified" | "unverified";

const toneClasses: Record<BadgeTone, string> = {
  ember: "text-ember border-ember/40 bg-ember-soft/30",
  steel: "text-steel border-steel/40 bg-steel-soft/40",
  neutral: "text-foreground-muted border-surface-border bg-surface-2",
  verified: "text-verified border-verified/30 bg-verified/10",
  unverified: "text-unverified border-unverified/30 bg-unverified/10",
};

export function Badge({ children, tone = "neutral", className }: { children: ReactNode; tone?: BadgeTone; className?: string }) {
  // Round 30.4ค batch 8 (LAUNCH_AUDIT 36): a badge whose text is Latin-only (brand / family name
  // on the product hero) keeps the mono look under the Thai `.label-mono` rule — see label-lang.ts.
  return (
    <span
      className={cn(
        "label-mono inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.65rem] leading-none",
        toneClasses[tone],
        className
      )}
      lang={typeof children === "string" ? labelLang(children) : undefined}
    >
      {children}
    </span>
  );
}
