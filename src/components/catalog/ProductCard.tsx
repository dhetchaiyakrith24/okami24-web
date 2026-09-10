import Link from "next/link";
import type { Product } from "@/types/catalog";
import { ProductMedia } from "@/components/visual/ProductMedia";
import { FavoriteButton } from "@/components/catalog/FavoriteButton";
import { OptionCountBadge } from "@/components/catalog/OptionCountBadge";
import { Badge } from "@/components/ui/Badge";
import { PuffCount } from "@/components/catalog/PuffCount";
import { brandName, formatBattery, formatWattage } from "@/lib/utils";
import { getLegacyApprovedPrice } from "@/data/shipnity-seed/legacy-price-approvals";

/**
 * Phone layout (mobile round A, M3 — MOBILE_SPEC 3.1/3.5, owner decisions E-ก and F-ก, 2026-09-08;
 * every `max-lg:` / `hidden max-lg:block` class): cards sit two to a row, so below `lg` the card
 * slims down to photo (4:5, tighter padding) → brand → name clamped to two lines at a fixed
 * height → price. The tagline and the stats row are hidden by CSS (not removed — desktop keeps
 * them). The price is the owner-approved legacy selling price already used on the product page
 * (F-ก: a number from existing data, never typed here); a product with no approved price keeps an
 * empty line of the same height so every card in a row ends at the same edge (3.5).
 * At `lg` and above every class that was here before is still here, untouched.
 */
export function ProductCard({ product }: { product: Product }) {
  // A puff count carries a translated unit, so it renders through the client-side <PuffCount>;
  // battery is "1600mAh" in every language and stays a plain string (round 30.2).
  const primaryStat = product.attributes.puffCount
    ? <PuffCount count={product.attributes.puffCount} />
    : formatBattery(product.attributes.batteryMah);
  const secondaryStat = formatWattage(product.attributes.wattageMin, product.attributes.wattageMax);
  const sellingPrice = getLegacyApprovedPrice(product.slug);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface-1 transition-all duration-300 hover:-translate-y-1 hover:border-foreground-dim"
    >
      <div className="relative aspect-[4/5] w-full bg-surface-2/40 p-6 max-lg:p-3">
        {/* max-lg:z-10 — with the tighter phone padding the absolutely-positioned photo (next/image
            fill) painted over the option-count badge (designer, 2026-09-08); the heart already had z-10. */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 max-lg:left-2 max-lg:top-2 max-lg:z-10">
          {/* On a 169px phone card the editorial tag, the option count and the heart could not share
              the top edge (designer, 2026-09-08: "FLAGSHIP" / "RETAILER-CONFIRMED" clipped mid-word).
              The tag hides below lg — CSS only, wording untouched; the option count stays. */}
          {product.editorialTag && (
            <Badge tone="ember" className="max-lg:hidden">
              {product.editorialTag}
            </Badge>
          )}
          <OptionCountBadge product={product} />
        </div>
        <FavoriteButton slug={product.slug} className="absolute right-3 top-3 max-lg:right-2 max-lg:top-2" />
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
          <ProductMedia product={product} sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5 max-lg:gap-1 max-lg:p-3">
        <span className="label-mono text-[0.65rem] text-foreground-dim max-lg:text-[0.6rem]">
          {brandName(product.brandId)}
        </span>
        <h3 className="font-display text-xl font-semibold leading-tight tracking-tight text-foreground max-lg:line-clamp-2 max-lg:min-h-[2.5em] max-lg:text-sm max-lg:leading-[1.25]">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-sm text-foreground-muted max-lg:hidden">{product.tagline}</p>
        <p className="hidden min-h-[1.25rem] font-display text-[15px] font-bold leading-tight text-foreground max-lg:block">
          {sellingPrice !== null ? `฿${sellingPrice.toLocaleString("th-TH")}` : ""}
        </p>
        <div className="mt-auto flex items-center gap-3 pt-3 text-xs text-foreground-dim max-lg:hidden">
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
