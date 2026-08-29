import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  meta?: ReactNode;
}) {
  return (
    <section className="border-b border-surface-border-soft bg-surface-1">
      <Container className="flex flex-col gap-4 py-12 lg:py-16">
        {eyebrow && <span className="label-mono text-xs text-ember">{eyebrow}</span>}
        <h1 className="font-display text-[length:var(--text-h1)] font-bold leading-[0.95] tracking-tight text-foreground">
          {title}
        </h1>
        {description && <p className="max-w-2xl text-base leading-relaxed text-foreground-muted">{description}</p>}
        {meta}
      </Container>
    </section>
  );
}
