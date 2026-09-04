"use client";

import { useState } from "react";
import Image from "next/image";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import { ProductMasterGlyph } from "./ProductMasterGlyph";
import { ProductMasterVariantPicker } from "./ProductMasterVariantPicker";
import { PilotRelatedProducts } from "./PilotRelatedProducts";
import { CompatibleProducts } from "@/components/product/CompatibleProducts";
import { getCompatibleConsumables, getCompatibleDevices } from "@/data/catalog-relationships";
import { SourceNote } from "@/components/product/SourceNote";
import { ProductReviewVideo } from "@/components/product/ProductReviewVideo";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { pilotAxisLabel } from "./axis-label";
import type { ImageDisplayInfo } from "@/lib/media-quality";
import { Button } from "@/components/ui/Button";
import { CONTACT } from "@/data/contact";
import { addToCartAction } from "@/app/cart/actions";

/**
 * Storefront-native product detail body for a ProductMaster product, rendered from the real
 * `/products/[slug]` route. Shared by BOTH ProductMaster pools (see storefront-bridge.ts) — DEV
 * preview and the real, environment-independent published pool — driven entirely by
 * `product.publicationStatus`/`product.sellingPrice`, never by which function fetched it: the
 * "Unpublished" badge and the unapproved-reference-price disclaimer only show for genuinely
 * `publicationStatus: "unpublished"` data; a real published product shows its real, owner-
 * approved price with no disclaimer, same honesty standard as everything else in this pipeline.
 * Deliberately NOT the legacy `ProductHero`/`ProductGallery`/`ProductAnatomy`/`FeatureGrid`/
 * `SpecSheet`/`CompatibilitySection` — every one of those reads `product.attributes`/
 * `.specifications`/`.features`/`.compatibility`, none of which exist on a Shipnity-sourced draft.
 *
 * Variant-specific media (full-catalog mission, second delta pass): selection state now lives
 * here, not inside `ProductMasterVariantPicker`, so selecting a variant can swap the displayed
 * image to that variant's own verified photo (`variant.image`) when one exists. Falls back to the
 * product-level card image (`product.image`) — unchanged behavior — whenever the selected variant
 * has no dedicated photo, which is still the case for most variants on most products; this is
 * strictly additive, never a regression for a product with no variant media at all.
 */
export function PilotProductDetail({
  product,
  related,
  imageDisplayMap,
}: {
  product: StorefrontProductView;
  related: StorefrontProductView[];
  /** Storefront quality-correction pass — server-computed fill-vs-intrinsic sizing info, keyed by
   *  image src, for every image the variant picker could swap to. A missing entry (e.g. computed
   *  on a code path that didn't build the map) falls back to the original always-fill behavior.
   *  See `src/lib/media-quality.ts`. */
  imageDisplayMap?: Record<string, ImageDisplayInfo>;
}) {
  const { dict } = useLocale();
  const axisLabel = pilotAxisLabel(dict, product);
  const isPublished = product.publicationStatus === "published";
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id ?? null);
  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  // A selected variant with no photo of its own prefers the neutral fallback (when the product
  // has one — see `variantFallbackImage`'s own doc comment) over the generic product-level card,
  // so an unrelated named variant's photo never reads as "this is what you picked." Products
  // without a neutral fallback fall through to `product.image` exactly as before — unchanged.
  const displayImage = selectedVariant?.image ?? product.variantFallbackImage ?? product.image;
  const displayImageInfo = displayImage ? imageDisplayMap?.[displayImage.src] : undefined;
  const fillHero = displayImageInfo ? displayImageInfo.fillHero : true;

  return (
    <>
      <PageHeader
        eyebrow={product.categoryName}
        title={product.displayName}
        description={product.tagline}
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="steel">{product.brandName}</Badge>
            {!isPublished && <Badge tone="unverified">{dict.pilot.unpublishedBadge}</Badge>}
          </div>
        }
      />
      <Container className="grid gap-10 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:py-16">
        <div className="order-2 flex flex-col gap-6 lg:order-1">
          {isPublished && product.sellingPrice !== null ? (
            <div>
              <span className="label-mono text-xs text-foreground-dim">{dict.pilot.priceLabel}</span>
              <p className="font-display text-3xl font-bold text-foreground">฿{product.sellingPrice.toLocaleString("th-TH")}</p>
            </div>
          ) : (
            <div>
              <span className="label-mono text-xs text-foreground-dim">{dict.pilot.priceReferenceLabel}</span>
              <p className="font-display text-3xl font-bold text-foreground">
                {product.priceReferenceValue !== null ? `฿${product.priceReferenceValue.toLocaleString("th-TH")}` : dict.pilot.priceUnavailable}
              </p>
              <p className="text-xs text-foreground-muted">
                {dict.pilot.priceSourcePrefix} {product.priceReferenceSource ?? "—"} {dict.pilot.priceDisclaimer}
              </p>
            </div>
          )}

          <ProductMasterVariantPicker
            optionAxisLabel={axisLabel}
            variants={product.variants}
            selectedId={selectedVariantId}
            onSelect={setSelectedVariantId}
            outOfStockLabel={dict.productActions.outOfStockLabel}
          />

          {isPublished && product.sellingPrice !== null && (
            <div>
              {/* Catalog-truth-vs-stock-truth mandate (owner, 2026-09-03): a verified real flavor
                  with no live Shipnity stock signal ("unknown") must be exactly as non-purchasable
                  as one explicitly confirmed empty ("out-of-stock") — only a confirmed "in-stock"
                  signal may show the real Add to Cart action. */}
              {(selectedVariant?.availabilityStatus ?? product.availabilityStatus) !== "in-stock" ? (
                <div className="flex flex-col items-start gap-2">
                  <span className="label-mono text-xs text-ember">{dict.productActions.outOfStockLabel}</span>
                  <a
                    href={CONTACT.lineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-surface-border px-6 py-3 text-sm font-semibold tracking-tight text-foreground transition-colors duration-200 hover:border-foreground-dim hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-ember"
                  >
                    {dict.productActions.outOfStockCta}
                  </a>
                </div>
              ) : (
                <form action={addToCartAction}>
                  <input type="hidden" name="slug" value={product.slug} />
                  {selectedVariantId && <input type="hidden" name="variantId" value={selectedVariantId} />}
                  <input type="hidden" name="quantity" value={1} />
                  <Button type="submit">{dict.productActions.addToCartCta}</Button>
                </form>
              )}
            </div>
          )}

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
          {displayImage ? (
            <>
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(ellipse 58% 54% at 50% 40%, var(--color-steel-soft) 0%, transparent 72%)" }}
                aria-hidden
              />
              <div className={fillHero ? "relative h-full w-full p-8 lg:p-12" : "relative flex h-full w-full items-center justify-center p-8 lg:p-12"}>
                {fillHero ? (
                  <Image key={displayImage.src} src={displayImage.src} alt={displayImage.alt} fill sizes="(min-width: 1024px) 42vw, 90vw" className="object-contain" priority />
                ) : (
                  // Storefront quality-correction pass — a source too small for the hero box would
                  // visibly blur if stretched to fill it (see media-quality.ts). Rendering at its
                  // own intrinsic size instead, centered in the same visual area, keeps it sharp
                  // and reads as an intentional smaller presentation rather than a broken asset.
                  <Image
                    key={displayImage.src}
                    src={displayImage.src}
                    alt={displayImage.alt}
                    width={displayImageInfo!.width}
                    height={displayImageInfo!.height}
                    sizes="(min-width: 1024px) 42vw, 90vw"
                    className="h-auto max-h-full w-auto max-w-full object-contain"
                    priority
                  />
                )}
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

      {product.reviewVideo && (
        <Container className="flex flex-col gap-8 border-b border-surface-border-soft py-14 lg:py-20">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "VideoObject",
                name: product.reviewVideo.title,
                description: `${product.reviewVideo.channelName} — ${dict.product.reviewVideoEyebrow}: ${product.displayName}`,
                thumbnailUrl: [`https://i.ytimg.com/vi/${product.reviewVideo.videoId}/hqdefault.jpg`],
                embedUrl: `https://www.youtube-nocookie.com/embed/${product.reviewVideo.videoId}`,
              }),
            }}
          />
          <span className="label-mono text-xs text-foreground-dim">{dict.product.reviewVideoEyebrow}</span>
          <div className="max-w-2xl">
            <ProductReviewVideo video={product.reviewVideo} eyebrow={dict.product.reviewVideoEyebrow} watchOnYoutubeLabel={dict.product.watchOnYoutube} />
          </div>
        </Container>
      )}
      {/* Structured, clickable compatibility — same component and same evidence-backed edge
          table the legacy product page uses, so a published ProductMaster part can link to the
          legacy device it fits and vice versa. Renders nothing when there are no verified links. */}
      <CompatibleProducts direction="works-with" items={getCompatibleConsumables(product.slug)} />
      <CompatibleProducts direction="fits-devices" items={getCompatibleDevices(product.slug)} />
      <PilotRelatedProducts products={related} />
      {product.sourceUrls.length > 0 && <SourceNote product={product} />}
    </>
  );
}
