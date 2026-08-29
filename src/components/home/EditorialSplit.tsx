import type { Product } from "@/types/catalog";
import { DeviceGlyph } from "@/components/visual/DeviceGlyph";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function EditorialSplit({
  eyebrow,
  title,
  paragraphs,
  ctaHref,
  ctaLabel,
  product,
  reverse = false,
  tone = "surface-0",
}: {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  ctaHref: string;
  ctaLabel: string;
  product: Product;
  reverse?: boolean;
  tone?: "surface-0" | "surface-1";
}) {
  return (
    <section className={cn(tone === "surface-1" ? "bg-surface-1" : "bg-surface-0", "border-b border-surface-border-soft")}>
      <Container className="grid grid-cols-1 items-center gap-10 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div className={cn("flex flex-col gap-5", reverse && "lg:order-2")}>
          <span className="label-mono text-xs text-steel">{eyebrow}</span>
          <h2 className="font-display text-[length:var(--text-h2)] font-semibold leading-[0.95] tracking-tight text-foreground">
            {title}
          </h2>
          {paragraphs.map((p, i) => (
            <p key={i} className="max-w-lg text-base leading-relaxed text-foreground-muted">
              {p}
            </p>
          ))}
          <div className="pt-2">
            <Button href={ctaHref} variant="secondary">
              {ctaLabel}
            </Button>
          </div>
        </div>
        <div className={cn("relative mx-auto aspect-square w-full max-w-sm p-8", reverse && "lg:order-1")}>
          <div className="absolute inset-0 rounded-[2rem] border border-surface-border-soft bg-surface-2/30" />
          <div className="relative h-full w-full p-6">
            <DeviceGlyph product={product} />
          </div>
        </div>
      </Container>
    </section>
  );
}
