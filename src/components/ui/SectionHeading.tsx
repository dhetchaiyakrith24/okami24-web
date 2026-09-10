import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
      {eyebrow && <span className="label-mono text-xs text-ember">{eyebrow}</span>}
      <h2 className={cn("font-display text-[length:var(--text-h2)] leading-[0.95] font-semibold tracking-tight text-foreground", titleClassName)}>
        {title}
      </h2>
      {description && <p className={cn("max-w-2xl text-base text-foreground-muted", align === "center" && "mx-auto")}>{description}</p>}
    </div>
  );
}
