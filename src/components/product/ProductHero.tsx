import type { Product } from "@/types/catalog";
import { DeviceGlyph } from "@/components/visual/DeviceGlyph";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FavoriteButton } from "@/components/catalog/FavoriteButton";
import { brandName, familyName, formatBattery, formatPuffs, formatWattage } from "@/lib/utils";

export function ProductHero({ product }: { product: Product }) {
  const stats = [
    { label: "Battery", value: formatBattery(product.attributes.batteryMah) },
    { label: "Output", value: formatWattage(product.attributes.wattageMin, product.attributes.wattageMax) },
    product.attributes.puffCount ? { label: "Rated puffs", value: formatPuffs(product.attributes.puffCount) } : null,
    product.attributes.capacityMl ? { label: "Capacity", value: `${product.attributes.capacityMl}mL` } : null,
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
      <Container className="relative grid grid-cols-1 items-center gap-10 py-14 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:py-20">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="steel">{brandName(product.brandId)}</Badge>
            <Badge tone="neutral">{familyName(product.familyId)}</Badge>
            {product.editorialTag && <Badge tone="ember">{product.editorialTag}</Badge>}
          </div>
          <h1 className="font-display text-[length:var(--text-h1)] font-bold leading-[0.95] tracking-tight text-foreground">
            {product.name}
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-foreground-muted">{product.tagline}</p>
          <p className="max-w-lg text-sm leading-relaxed text-foreground-dim">{product.shortDescription}</p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button href={`/compare?slugs=${product.slug}`}>Add to comparison</Button>
            <Button href="#specifications" variant="secondary">
              View specifications
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

        <div className="relative mx-auto aspect-square w-full max-w-sm">
          <div className="absolute inset-0 rounded-[2rem] border border-surface-border bg-surface-0/60" />
          <FavoriteButton slug={product.slug} className="absolute right-4 top-4" />
          <div className="relative h-full w-full p-10">
            <DeviceGlyph product={product} />
          </div>
        </div>
      </Container>
    </section>
  );
}
