import Link from "next/link";
import type { Product } from "@/types/catalog";
import { DeviceGlyph } from "@/components/visual/DeviceGlyph";
import { FavoriteButton } from "@/components/catalog/FavoriteButton";
import { Badge } from "@/components/ui/Badge";
import { brandName, formatBattery, formatPuffs, formatWattage } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const primaryStat = product.attributes.puffCount
    ? formatPuffs(product.attributes.puffCount)
    : formatBattery(product.attributes.batteryMah);
  const secondaryStat = formatWattage(product.attributes.wattageMin, product.attributes.wattageMax);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface-1 transition-all duration-300 hover:-translate-y-1 hover:border-foreground-dim"
    >
      <div className="relative aspect-[4/5] w-full bg-surface-2/40 p-6">
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.editorialTag && <Badge tone="ember">{product.editorialTag}</Badge>}
        </div>
        <FavoriteButton slug={product.slug} className="absolute right-3 top-3" />
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
          <DeviceGlyph product={product} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="label-mono text-[0.65rem] text-foreground-dim">
          {brandName(product.brandId)}
        </span>
        <h3 className="font-display text-xl font-semibold leading-tight tracking-tight text-foreground">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-sm text-foreground-muted">{product.tagline}</p>
        <div className="mt-auto flex items-center gap-3 pt-3 text-xs text-foreground-dim">
          <span className="label-mono">{primaryStat}</span>
          {secondaryStat !== "—" && (
            <>
              <span aria-hidden>·</span>
              <span className="label-mono">{secondaryStat}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
