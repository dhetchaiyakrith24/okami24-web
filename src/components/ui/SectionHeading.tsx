import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { labelLang } from "@/lib/label-lang";

// Round 30.4ค batch 8 (LAUNCH_AUDIT 36): an eyebrow with no Thai in it is one of the deliberately
// English section labels (THAI_STYLE §5 group ก — "Flagship Devices", "Guides & Learn", brand
// rails). `labelLang` marks it lang="en" so it keeps the mono/tracked/uppercase look under the Thai
// rule in globals.css (`html:lang(th) .label-mono:not(:lang(en))`); a Thai eyebrow gets the Thai treatment.

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  titleClassName,
}: {
  eyebrow?: string;
  title: ReactNode;
  /** ReactNode since round 30.3ข — the homepage passes <HomeText> here. */
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4", align === "center" && "items-center text-center", className)}>
      {eyebrow && (
        <span className="label-mono text-xs text-ember" lang={labelLang(eyebrow)}>
          {eyebrow}
        </span>
      )}
      <h2 className={cn("font-display text-[length:var(--text-h2)] leading-[0.95] font-semibold tracking-tight text-foreground", titleClassName)}>
        {title}
      </h2>
      {description && <p className={cn("max-w-2xl text-base text-foreground-muted", align === "center" && "mx-auto")}>{description}</p>}
    </div>
  );
}
