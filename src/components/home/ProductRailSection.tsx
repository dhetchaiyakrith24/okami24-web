import Link from "next/link";
import type { ReactNode } from "react";
import type { Product } from "@/types/catalog";
import { Container } from "@/components/ui/Container";
import { ProductRail } from "@/components/catalog/ProductRail";
import { HomeText } from "@/components/home/HomeCopy";
import { labelLang } from "@/lib/label-lang";

export function ProductRailSection({
  eyebrow,
  title,
  description,
  viewAllHref,
  products,
}: {
  eyebrow: string;
  /** ReactNode since round 30.3ข so the page can pass <HomeText> (the visitor's language). */
  title: ReactNode;
  description?: ReactNode;
  viewAllHref: string;
  products: Product[];
}) {
  return (
    <section className="border-b border-surface-border-soft bg-surface-0 py-14 lg:py-20">
      <Container>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <span className="label-mono text-xs text-ember" lang={typeof eyebrow === "string" ? labelLang(eyebrow) : undefined}>{eyebrow}</span>
            <h2 className="font-display text-[length:var(--text-h2)] font-semibold leading-[0.95] tracking-tight text-foreground">
              {title}
            </h2>
            {description && <p className="max-w-xl text-base text-foreground-muted">{description}</p>}
          </div>
          <Link href={viewAllHref} className="label-mono shrink-0 text-xs text-foreground-muted hover:text-ember">
            <HomeText k="viewAll" />
          </Link>
        </div>
      </Container>
      <Container>
        <ProductRail products={products} />
      </Container>
    </section>
  );
}
