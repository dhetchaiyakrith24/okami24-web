import Link from "next/link";
import type { Product } from "@/types/catalog";
import { ProductMedia } from "@/components/visual/ProductMedia";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { brandName, formatBattery, formatWattage } from "@/lib/utils";

export function Hero({ flagship }: { flagship: Product }) {
  return (
    <section className="relative overflow-hidden border-b border-surface-border-soft bg-surface-0">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 78% 20%, var(--color-ember-soft) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 10% 90%, var(--color-steel-soft) 0%, transparent 55%)",
        }}
        aria-hidden
      />
      <Container className="relative grid grid-cols-1 items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:py-24">
        <div className="flex flex-col gap-7">
          <span className="label-mono inline-flex w-fit items-center gap-2 rounded-full border border-surface-border bg-surface-1 px-3 py-1.5 text-[0.65rem] text-foreground-muted">
            {brandName(flagship.brandId)} · Current Flagship
          </span>
          <h1 className="font-display text-[length:var(--text-display)] font-bold leading-[0.92] tracking-tight text-foreground">
            Vaping,
            <br />
            engineered
            <br />
            <span className="text-ember">for clarity.</span>
          </h1>
          <p className="max-w-md text-base leading-relaxed text-foreground-muted sm:text-lg">
            A complete ecosystem of pod systems, disposables, and e-liquid — organized by real specifications, not
            marketing noise. Every device documented, compared, and matched to how you actually vape.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button href="/products">Explore the catalog</Button>
            <Button href="/finder" variant="secondary">
              Take the Finder
            </Button>
          </div>
          <dl className="mt-4 grid max-w-md grid-cols-3 gap-4 border-t border-surface-border-soft pt-6">
            <StatBlock label="Products" value="28" />
            <StatBlock label="Brands" value="3" />
            <StatBlock label="Families" value="8" />
          </dl>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm">
          <div className="absolute inset-0 rounded-[2rem] border border-surface-border bg-surface-1/60 backdrop-blur-sm" />
          <div className="relative h-full w-full p-10">
            <ProductMedia product={flagship} sizes="(min-width: 1024px) 25vw, 60vw" />
          </div>
          <Link
            href={`/products/${flagship.slug}`}
            className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-xl border border-surface-border bg-surface-0/90 px-4 py-3 backdrop-blur transition-colors hover:border-ember/50"
          >
            <div>
              <p className="font-display text-lg font-semibold leading-tight text-foreground">{flagship.name}</p>
              <p className="label-mono text-[0.65rem] text-foreground-dim">
                {formatBattery(flagship.attributes.batteryMah)} · {formatWattage(flagship.attributes.wattageMin, flagship.attributes.wattageMax)}
              </p>
            </div>
            <span className="label-mono text-xs text-ember">View →</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-display text-2xl font-semibold text-foreground">{value}</span>
      <span className="label-mono text-[0.6rem] text-foreground-dim">{label}</span>
    </div>
  );
}
