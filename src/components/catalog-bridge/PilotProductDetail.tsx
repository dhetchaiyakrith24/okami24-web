"use client";

import Image from "next/image";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import { ProductMasterGlyph } from "./ProductMasterGlyph";
import { ProductMasterVariantPicker } from "./ProductMasterVariantPicker";
import { PilotRelatedProducts } from "./PilotRelatedProducts";
import { SourceNote } from "@/components/product/SourceNote";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { pilotAxisLabel } from "./axis-label";

/**
 * Phase 3.0 — storefront-native product detail body for a ProductMaster pilot product, rendered
 * from the real `/products/[slug]` route (see that page's third branch). Deliberately NOT the
 * legacy `ProductHero`/`ProductGallery`/`ProductAnatomy`/`FeatureGrid`/`SpecSheet`/
 * `CompatibilitySection` — every one of those reads `product.attributes`/`.specifications`/
 * `.features`/`.compatibility`, none of which exist on a Shipnity-sourced draft (see the
 * Phase 3.0 report §LEGACY CONSUMER FRICTION). Structure carried over from the Phase 2.8/2.9
 * isolated preview's detail page, minus the "internal preview" framing — this now IS the real
 * page for these 5 products, just gated to non-production by `storefront-bridge.ts`.
 */
export function PilotProductDetail({ product, related }: { product: StorefrontProductView; related: StorefrontProductView[] }) {
  const { dict } = useLocale();
  const axisLabel = pilotAxisLabel(dict, product);

  return (
    <>
      <PageHeader
        eyebrow={product.categoryName}
        title={product.displayName}
        description={product.tagline}
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="steel">{product.brandName}</Badge>
            <Badge tone="unverified">{dict.pilot.unpublishedBadge}</Badge>
          </div>
        }
      />
      <Container className="grid gap-10 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:py-16">
        <div className="order-2 flex flex-col gap-6 lg:order-1">
          <div>
            <span className="label-mono text-xs text-foreground-dim">{dict.pilot.priceReferenceLabel}</span>
            <p className="font-display text-3xl font-bold text-foreground">
              {product.priceReferenceValue !== null ? `฿${product.priceReferenceValue.toLocaleString("th-TH")}` : dict.pilot.priceUnavailable}
            </p>
            <p className="text-xs text-foreground-muted">
              {dict.pilot.priceSourcePrefix} {product.priceReferenceSource ?? "—"} {dict.pilot.priceDisclaimer}
            </p>
          </div>

          <ProductMasterVariantPicker optionAxisLabel={axisLabel} variants={product.variants} />

          {product.specifications.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="label-mono text-xs text-foreground-dim">{dict.pilot.specificationsTitle}</span>
              <dl className="flex flex-col divide-y divide-surface-border-soft rounded-xl border border-surface-border-soft bg-surface-1">
                {product.specifications.map((spec) => (
                  <div key={spec.key} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                    <dt className="text-foreground-muted">{spec.label}</dt>
                    <dd className="text-right font-medium text-foreground">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        <div className="relative order-1 aspect-[4/5] w-full lg:order-2">
          {product.image ? (
            <>
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(ellipse 58% 54% at 50% 40%, var(--color-steel-soft) 0%, transparent 72%)" }}
                aria-hidden
              />
              <div className="relative h-full w-full p-8 lg:p-12">
                <Image src={product.image.src} alt={product.image.alt} fill sizes="(min-width: 1024px) 42vw, 90vw" className="object-contain" priority />
              </div>
              <div
                className="pointer-events-none absolute inset-x-16 bottom-6 h-10 rounded-full opacity-70"
                style={{ background: "radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 75%)", filter: "blur(10px)" }}
                aria-hidden
              />
            </>
          ) : (
            <div className="h-full w-full rounded-2xl border border-surface-border bg-surface-1 p-10">
              <ProductMasterGlyph kind={product.glyphKind} />
            </div>
          )}
        </div>
      </Container>

      <PilotRelatedProducts products={related} />
      {product.sourceUrls.length > 0 && <SourceNote product={product} />}
    </>
  );
}
