"use client";

import type { Product } from "@/types/catalog";
import { ProductMedia } from "@/components/visual/ProductMedia";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FavoriteButton } from "@/components/catalog/FavoriteButton";
import { brandName, familyName, formatBattery, formatPuffs, formatWattage } from "@/lib/utils";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { PRODUCT_COPY_TH } from "@/i18n/product-copy-th";

export function ProductHero({ product }: { product: Product }) {
  const { locale, dict } = useLocale();
  // Thai locale adds a translated tagline/description under the English original — never
  // replacing it, and only for the 28 legacy products with a real (human-checked, not machine-
  // guessed) Thai entry. See product-copy-th.ts header for why this stays presentation-only.
  const copyTh = locale === "th" ? PRODUCT_COPY_TH[product.slug] : undefined;
  const stats = [
    { label: dict.product.statBattery, value: formatBattery(product.attributes.batteryMah) },
    { label: dict.product.statOutput, value: formatWattage(product.attributes.wattageMin, product.attributes.wattageMax) },
    product.attributes.puffCount ? { label: dict.product.statRatedPuffs, value: formatPuffs(product.attributes.puffCount) } : null,
    product.attributes.capacityMl ? { label: dict.product.statCapacity, value: `${product.attributes.capacityMl}mL` } : null,
  ].filter((s): s is { label: string; value: string } => Boolean(s) && s!.value !== "—");

  return (
    <section className="relative overflow-hidden border-b border-surface-border-soft bg-surface-1">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background: "radial-gradient(ellipse 55% 45% at 85% 15%, var(--color-ember-soft) 0%, transparent 60%)",
        }}
        aria-hidden
      />
      <Container className="relative grid grid-cols-1 items-center gap-10 py-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:py-20">
        <div className="order-2 flex flex-col gap-5 lg:order-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="steel">{brandName(product.brandId)}</Badge>
            <Badge tone="neutral">{familyName(product.familyId)}</Badge>
            {product.editorialTag && <Badge tone="ember">{product.editorialTag}</Badge>}
          </div>
          <h1 className="font-display text-[length:var(--text-h1)] font-bold leading-[0.95] tracking-tight text-foreground">
            {product.name}
          </h1>
          <div className="flex flex-col gap-1.5">
            <p className="max-w-lg text-lg leading-relaxed text-foreground-muted">{product.tagline}</p>
            {copyTh && <p className="max-w-lg text-lg leading-relaxed text-foreground-muted/75">{copyTh.tagline}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <p className="max-w-lg text-sm leading-relaxed text-foreground-dim">{product.shortDescription}</p>
            {copyTh && <p className="max-w-lg text-sm leading-relaxed text-foreground-dim/75">{copyTh.shortDescription}</p>}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button href={`/compare?slugs=${product.slug}`}>{dict.product.addToComparison}</Button>
            <Button href="#specifications" variant="secondary">
              {dict.product.viewSpecifications}
            </Button>
          </div>

          {stats.length > 0 && (
            <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-surface-border-soft pt-6 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col gap-1">
                  <dt className="label-mono text-[0.6rem] text-foreground-dim">{s.label}</dt>
                  <dd className="font-display text-lg font-semibold text-foreground">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="relative order-1 mx-auto aspect-square w-full max-w-lg lg:order-2 lg:max-w-none">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse 58% 54% at 50% 40%, var(--color-steel-soft) 0%, transparent 72%)" }}
            aria-hidden
          />
          <FavoriteButton slug={product.slug} className="absolute right-2 top-2 z-10" />
          <div className="relative h-full w-full p-8 lg:p-12">
            <ProductMedia product={product} sizes="(min-width: 1024px) 42vw, 85vw" />
          </div>
          <div
            className="pointer-events-none absolute inset-x-16 bottom-6 h-10 rounded-full opacity-70"
            style={{ background: "radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 75%)", filter: "blur(10px)" }}
            aria-hidden
          />
        </div>
      </Container>
    </section>
  );
}
