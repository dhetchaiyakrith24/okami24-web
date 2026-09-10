"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import { ProductMasterGlyph } from "./ProductMasterGlyph";
import { FavoriteButton } from "@/components/catalog/FavoriteButton";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { pilotTagline } from "@/i18n/product-copy-en";
import { pilotAxisLabel } from "./axis-label";

/**
 * Phase 3.0 — the storefront-native sibling of the isolated preview's `PreviewProductCard`.
 * Same visual language, but links into the real `/products/[slug]` route instead of
 * `/preview/product-master/[slug]`. Shared by BOTH ProductMaster pools (see storefront-bridge.ts):
 * the DEV-only preview and the real, environment-independent published pool — driven entirely by
 * `product.publicationStatus`, never by which function fetched it. The "Unpublished" badge only
 * shows for genuinely `publicationStatus: "unpublished"` data — a real, published product renders
 * with no such marker, same as a legacy product would. Not reusing the legacy `ProductCard`: it
 * unconditionally reads `product.attributes.puffCount`/`batteryMah`/`wattageMin`/`wattageMax`,
 * none of which exist on a Shipnity-sourced draft.
 *
 * Phone layout (mobile round A, M3 — MOBILE_SPEC 3.1/3.5, owner decisions E-ก and F-ก,
 * 2026-09-08; every `max-lg:` / `hidden max-lg:block` class): same slim card as `ProductCard` —
 * photo → brand → two-line name at a fixed height → price. The price is the product's own
 * owner-approved `sellingPrice` (only a published product has one); otherwise an empty line of
 * the same height. Tagline and the category/variant row are hidden by CSS below `lg`.
 */
export function PilotProductCard({ product }: { product: StorefrontProductView }) {
  const { dict, locale } = useLocale();
  const sellingPrice = product.publicationStatus === "published" ? product.sellingPrice : null;
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface-1 transition-all duration-300 hover:-translate-y-1 hover:border-foreground-dim"
    >
      <div className="relative aspect-[4/5] w-full bg-surface-2/40 p-6 max-lg:p-3">
        {product.publicationStatus === "unpublished" && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 max-lg:left-2 max-lg:top-2 max-lg:z-10">
            <Badge tone="unverified">{dict.pilot.unpublishedBadge}</Badge>
          </div>
        )}
        <FavoriteButton slug={product.slug} className="absolute right-3 top-3 max-lg:right-2 max-lg:top-2" />
        <div className="relative h-full w-full transition-transform duration-500 group-hover:scale-105">
          {product.image ? (
            <Image
              src={product.image.src}
              alt={product.image.alt}
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
              className="object-contain p-2"
            />
          ) : (
            <ProductMasterGlyph kind={product.glyphKind} />
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5 max-lg:gap-1 max-lg:p-3">
        <span className="label-mono text-[0.65rem] text-foreground-dim max-lg:text-[0.6rem]">{product.brandName}</span>
        <h3 className="font-display text-xl font-semibold leading-tight tracking-tight text-foreground max-lg:line-clamp-2 max-lg:min-h-[2.5em] max-lg:text-sm max-lg:leading-[1.25]">{product.displayName}</h3>
        {/* Round 30.3: ProductMaster copy is written in Thai, so the English/Chinese storefront used to
            show the Thai line here — pilotTagline() reads the English overlay when there is one. */}
        <p className="line-clamp-2 text-sm text-foreground-muted max-lg:hidden">{pilotTagline(product.slug, product.tagline, locale)}</p>
        <p className="hidden min-h-[1.25rem] font-display text-[15px] font-bold leading-tight text-foreground max-lg:block">
          {sellingPrice !== null && sellingPrice !== undefined ? `฿${sellingPrice.toLocaleString("th-TH")}` : ""}
        </p>
        <div className="mt-auto flex items-center gap-3 pt-3 text-xs text-foreground-dim max-lg:hidden">
          <span className="label-mono">{product.categoryName}</span>
          {product.variants.length > 0 && (
            <>
              <span aria-hidden>·</span>
              <span className="label-mono">
                {product.variants.length} {pilotAxisLabel(dict, product) ?? dict.pilot.variantFallback}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
