"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import { ProductMasterGlyph } from "./ProductMasterGlyph";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { pilotAxisLabel } from "./axis-label";

/**
 * Phase 3.0 — the storefront-native sibling of the isolated preview's `PreviewProductCard`.
 * Same visual language, but links into the real `/products/[slug]` route instead of
 * `/preview/product-master/[slug]`, and swaps the preview's "Draft" wording for "Unpublished" —
 * a small, honest marker (this genuinely is `publicationStatus: "unpublished"` data) rather than
 * a "this page isn't real" banner, since this card now renders inside the real storefront tree.
 * Not reusing the legacy `ProductCard`: it unconditionally reads `product.attributes.puffCount`/
 * `batteryMah`/`wattageMin`/`wattageMax`, none of which exist on a Shipnity-sourced draft.
 */
export function PilotProductCard({ product }: { product: StorefrontProductView }) {
  const { dict } = useLocale();
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface-1 transition-all duration-300 hover:-translate-y-1 hover:border-foreground-dim"
    >
      <div className="relative aspect-[4/5] w-full bg-surface-2/40 p-6">
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge tone="unverified">{dict.pilot.unpublishedBadge}</Badge>
        </div>
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

      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="label-mono text-[0.65rem] text-foreground-dim">{product.brandName}</span>
        <h3 className="font-display text-xl font-semibold leading-tight tracking-tight text-foreground">{product.displayName}</h3>
        <p className="line-clamp-2 text-sm text-foreground-muted">{product.tagline}</p>
        <div className="mt-auto flex items-center gap-3 pt-3 text-xs text-foreground-dim">
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
