"use client";

import Link from "next/link";
import type { Product } from "@/types/catalog";
import { ProductMedia } from "@/components/visual/ProductMedia";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { brandName, formatBattery, formatWattage } from "@/lib/utils";
import { useLocale } from "@/components/i18n/LocaleProvider";

export function Hero({ flagship }: { flagship: Product }) {
  const { dict } = useLocale();
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
            {brandName(flagship.brandId)} {dict.hero.badgeSuffix}
          </span>
          <h1 className="font-display text-[length:var(--text-display)] font-bold leading-[0.92] tracking-tight text-foreground">
            {dict.hero.headingLine1}
            <br />
            {dict.hero.headingLine2}
            <br />
            <span className="text-ember">{dict.hero.headingAccent}</span>
          </h1>
          <p className="max-w-md text-base leading-relaxed text-foreground-muted sm:text-lg">{dict.hero.description}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button href="/products">{dict.hero.ctaPrimary}</Button>
            <Button href="/finder" variant="secondary">
              {dict.hero.ctaSecondary}
            </Button>
          </div>
          <dl className="mt-4 grid max-w-md grid-cols-3 gap-4 border-t border-surface-border-soft pt-6">
            <StatBlock label={dict.hero.statProducts} value="28" />
            <StatBlock label={dict.hero.statBrands} value="3" />
            <StatBlock label={dict.hero.statFamilies} value="8" />
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
            <span className="label-mono text-xs text-ember">{dict.hero.viewProduct}</span>
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
