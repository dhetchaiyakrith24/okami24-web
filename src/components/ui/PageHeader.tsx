import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { labelLang } from "@/lib/label-lang";

export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
  descriptionClassName,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  meta?: ReactNode;
  /** Extra classes on the description line — added 2026-09-08 (mobile round, M3) so a caller can
   *  hide it below `lg` with CSS while the text stays in the HTML. Omitted = unchanged. */
  descriptionClassName?: string;
}) {
  return (
    <section className="border-b border-surface-border-soft bg-surface-1">
      <Container className="flex flex-col gap-4 py-12 lg:py-16">
        {eyebrow && <span className="label-mono text-xs text-ember" lang={typeof eyebrow === "string" ? labelLang(eyebrow) : undefined}>{eyebrow}</span>}
        <h1 className="font-display text-[length:var(--text-h1)] font-bold leading-[0.95] tracking-tight text-foreground">
          {title}
        </h1>
        {description && <p className={cn("max-w-2xl text-base leading-relaxed text-foreground-muted", descriptionClassName)}>{description}</p>}
        {meta}
      </Container>
    </section>
  );
}
