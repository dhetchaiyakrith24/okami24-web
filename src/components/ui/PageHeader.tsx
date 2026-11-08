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
  bare,
  desktopBare,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  /** Extra classes on the description line — added 2026-09-08 (mobile round, M3) so a caller can
   *  hide it below `lg` with CSS while the text stays in the HTML. Omitted = unchanged. */
  descriptionClassName?: string;
  /** No panel and no rule under it — the header sits on whatever is behind it (/products: the samurai backdrop,
   *  owner 29/10 "not boxed in the header"). Omitted = the usual surface panel. */
  bare?: boolean;
  /** Desktop (lg+) only: no panel, no rule, a smaller title and no bottom padding — the header sits on the picture
   *  behind it (the paid order page, owner list ก10 "ใช้พื้นที่กว้างให้ดีขึ้น"). Phones keep the usual panel.
   *  Omitted = unchanged. */
  desktopBare?: boolean;
}) {
  return (
    <section className={bare ? undefined : cn("border-b border-surface-border-soft bg-surface-1", desktopBare && "lg:relative lg:z-10 lg:border-b-0 lg:bg-transparent")}>
      <Container className={cn("flex flex-col gap-4 py-12 lg:py-16", desktopBare && "lg:gap-3 lg:pb-0 lg:pt-10")}>
        {eyebrow && <span className="label-mono text-xs text-ember" lang={typeof eyebrow === "string" ? labelLang(eyebrow) : undefined}>{eyebrow}</span>}
        <h1 className={cn("font-display text-[length:var(--text-h1)] font-bold leading-[0.95] tracking-tight text-foreground", desktopBare && "lg:text-[2rem] lg:leading-[1.2]")}>
          {title}
        </h1>
        {description && <p className={cn("max-w-2xl text-base leading-relaxed text-foreground-muted", descriptionClassName)}>{description}</p>}
        {meta}
      </Container>
    </section>
  );
}
