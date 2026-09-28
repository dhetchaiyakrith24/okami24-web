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
import { RelatedArticles } from "@/components/product/RelatedArticles";
import type { RelatedArticle } from "@/lib/article-relevance";
import { CompatibleProducts } from "@/components/product/CompatibleProducts";
import { getCompatibleConsumables, getCompatibleDevices } from "@/data/catalog-relationships";
import { SourceNote } from "@/components/product/SourceNote";
import { hideThaiClipTitle, ProductReviewVideo } from "@/components/product/ProductReviewVideo";
import { videoObjectJsonLd } from "@/lib/video-jsonld";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getDictionary } from "@/i18n/dictionaries";
import { pilotTagline } from "@/i18n/product-copy-en";
import { thaiTypographyNode } from "@/lib/thai-typography";
import { pilotAxisLabel } from "./axis-label";
import type { ImageDisplayInfo } from "@/lib/media-quality";
import { ProductBuyAction } from "@/components/commerce/ProductBuyAction";
import { MobileBuyBar } from "@/components/commerce/MobileBuyBar";
import { MobileVariantGallery, MOBILE_SLIDE_SIZES } from "@/components/product/MobileVariantGallery";
import { pilotVariantOptions } from "@/components/product/variant-options";
import { NoOptionPhoto } from "@/components/product/NoOptionPhoto";
import { verifiedRows } from "@/lib/verified-specs";

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
 *
 * Phone layout (mobile round A, MOBILE_SPEC M2 + owner decisions A-ข/D-ข, 2026-09-08 — every
 * `max-lg:` / `lg:hidden` class): below `lg` the left column dissolves (`max-lg:contents`) so its
 * blocks re-order under the page title as: swipe gallery with dots → variant chips → price →
 * specs; the in-page buy button hides because the sticky `MobileBuyBar` carries the same
 * `ProductBuyAction`. Selection state stays here (P1). `lg` and above: unchanged.
 */
export function PilotProductDetail({
  product,
  related,
  relatedArticles,
  relatedArticlesOtherLocales,
  imageDisplayMap,
  orderingEnabled = true,
}: {
  product: StorefrontProductView;
  related: StorefrontProductView[];
  /** Round "backlink" (2026-09-22): articles this product's data ties it to — built by the
   *  server page with `relatedArticlesForPublished`. Empty means the block does not render. */
  relatedArticles?: RelatedArticle[];
  /** Round 10B: the same list without Thai-only guides, shown on en/zh (`skipThaiOnly`). */
  relatedArticlesOtherLocales?: RelatedArticle[];
  /** From the server page (src/lib/commerce/ordering-mode.ts — owner 2026-09-07). False = the
   *  cart form is replaced by OrderViaLineButton; the out-of-stock branch is unchanged.
   *  Defaults to true so every other caller renders exactly as before. */
  orderingEnabled?: boolean;
  /** Storefront quality-correction pass — server-computed fill-vs-intrinsic sizing info, keyed by
   *  image src, for every image the variant picker could swap to. A missing entry (e.g. computed
   *  on a code path that didn't build the map) falls back to the original always-fill behavior.
   *  See `src/lib/media-quality.ts`. */
  imageDisplayMap?: Record<string, ImageDisplayInfo>;
}) {
  const { dict, locale } = useLocale();
  const axisLabel = pilotAxisLabel(dict, product);
  const isPublished = product.publicationStatus === "published";
  // Image-fix round 2026-09-28 (owner: a colour/flavour without its own photo must never show another option's
  // photo): on a colour/flavour axis with 2+ options and no neutral fallback, an option without a photo gets the
  // NoOptionPhoto panel instead of the product card, and the page opens on an option that has a photo — or, when
  // none has one, on the product photo with nothing pre-selected. Every other product renders exactly as before.
  const photoRule = product.variants.length >= 2 && !product.variantFallbackImage && (product.optionAxisCode === "color" || product.optionAxisCode === "flavor");
  const lacksOwnPhoto = (v: { image?: unknown } | undefined) => photoRule && !!v && !v.image;
  const initialVariantId = photoRule ? (product.variants.find((v) => v.image)?.id ?? null) : (product.variants[0]?.id ?? null);
  const noPhotoNote = product.optionAxisCode === "color" ? dict.product.noPhotoColor : dict.product.noPhotoFlavor;
  const [selectedVariantId, setSelectedVariantId] = useState(initialVariantId);
  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  // A selected variant with no photo of its own prefers the neutral fallback (when the product
  // has one — see `variantFallbackImage`'s own doc comment) over the generic product-level card,
  // so an unrelated named variant's photo never reads as "this is what you picked." Products
  // without a neutral fallback fall through to `product.image` exactly as before — unchanged.
  const displayImage = selectedVariant?.image ?? product.variantFallbackImage ?? product.image;
  const showNoPhoto = lacksOwnPhoto(selectedVariant);
  const displayImageInfo = displayImage ? imageDisplayMap?.[displayImage.src] : undefined;
  const fillHero = displayImageInfo ? displayImageInfo.fillHero : true;

  const available = (selectedVariant?.availabilityStatus ?? product.availabilityStatus) === "in-stock";
  const showBuy = isPublished && product.sellingPrice !== null;

  // Phone gallery slides — same photo rule per option as `displayImage` above (own photo →
  // neutral fallback → product card), so an option without its own photo shows the same image
  // with only the name changing (M2.3) until a real photo is added to the data.
  // `isCurrent` = this is the slide on screen, so it is the page's largest paint and must load
  // eagerly. It used to be called `priority` and was passed straight to `<Image priority>`, which
  // Next 16 deprecated into a no-op (measured 2026-09-08: the rendered <img> still said
  // `loading="auto"`, `fetchpriority="auto"`). Renamed because the old name now points at an
  // attribute that no longer exists.
  const renderImage = (img: typeof displayImage, isCurrent: boolean) => {
    if (!img) {
      return (
        <div className="h-full w-full rounded-2xl border border-surface-border bg-surface-1 p-6">
          <ProductMasterGlyph kind={product.glyphKind} />
        </div>
      );
    }
    const info = imageDisplayMap?.[img.src];
    const fill = info ? info.fillHero : true;
    return fill ? (
      <div className="relative h-full w-full p-2">
        <Image key={img.src} src={img.src} alt={img.alt} fill sizes={MOBILE_SLIDE_SIZES} className="object-contain" loading={isCurrent ? "eager" : "lazy"} fetchPriority={isCurrent ? "high" : "auto"} />
      </div>
    ) : (
      <div className="relative flex h-full w-full items-center justify-center p-2">
        <Image key={img.src} src={img.src} alt={img.alt} width={info!.width} height={info!.height} sizes={MOBILE_SLIDE_SIZES} className="h-auto max-h-full w-auto max-w-full object-contain" loading={isCurrent ? "eager" : "lazy"} fetchPriority={isCurrent ? "high" : "auto"} />
      </div>
    );
  };
  const options = pilotVariantOptions(product);
  const slides =
    options.length > 0
      ? [
          ...(photoRule && initialVariantId === null ? [{ id: "default", node: renderImage(product.image, true) }] : []),
          ...options.map((o) => ({
            id: o.id,
            node: lacksOwnPhoto(product.variants.find((v) => v.id === o.id))
              ? <div className="h-full w-full p-2"><NoOptionPhoto name={o.name} note={noPhotoNote} /></div>
              : renderImage(o.image ?? product.variantFallbackImage ?? product.image, o.id === selectedVariantId),
          })),
        ]
      : [{ id: "default", node: renderImage(product.image, true) }];

  return (
    <>
      <PageHeader
        eyebrow={product.categoryName}
        title={product.displayName}
        // Round 30.3: same English-overlay lookup as PilotProductCard (Thai is the source line).
        description={locale === "th" ? thaiTypographyNode(pilotTagline(product.slug, product.tagline, locale)) : pilotTagline(product.slug, product.tagline, locale)}
        // M3 (2026-09-08): on phones the tagline sits below the fold anyway; hiding it here (CSS
        // only, still in the HTML) is what brings the chips and the price into the first screen
        // above the sticky bar — the M2 leftover on ProductMaster pages.
        descriptionClassName="max-lg:hidden"
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="steel">{product.brandName}</Badge>
            {!isPublished && <Badge tone="unverified">{dict.pilot.unpublishedBadge}</Badge>}
          </div>
        }
      />
      {/* max-lg:grid-cols-1 = minmax(0,1fr): without it the single implicit column is `auto` and
          grows to the swipe track's max-content width (all slides side by side), which made the
          phone page 546px wide on a 390px screen (designer, 2026-09-08). lg keeps its own template. */}
      <Container className="grid gap-10 py-12 max-lg:grid-cols-1 max-lg:gap-3 max-lg:pb-6 max-lg:pt-3 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:py-16">
        <div className="order-2 flex flex-col gap-6 max-lg:contents lg:order-1">
          {isPublished && product.sellingPrice !== null ? (
            <div className="max-lg:order-3">
              <span className="label-mono text-xs text-foreground-dim">{dict.pilot.priceLabel}</span>
              <p className="font-display text-3xl font-bold text-foreground max-lg:text-2xl">฿{product.sellingPrice.toLocaleString("th-TH")}</p>
            </div>
          ) : (
            <div className="max-lg:order-3">
              <span className="label-mono text-xs text-foreground-dim">{dict.pilot.priceReferenceLabel}</span>
              <p className="font-display text-3xl font-bold text-foreground max-lg:text-2xl">
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
            className="max-lg:order-2"
          />

          {showBuy && (
            <div className="max-lg:hidden">
              {/* Catalog-truth-vs-stock-truth mandate (owner, 2026-09-03): a verified real flavor
                  with no live Shipnity stock signal ("unknown") must be exactly as non-purchasable
                  as one explicitly confirmed empty ("out-of-stock") — only a confirmed "in-stock"
                  signal may show the real Add to Cart action. */}
              {/* One shared buy action for every product page and the mobile bar — see
                  ProductBuyAction.tsx (mobile round, 2026-09-08). Its defaults are this file's
                  original form/note classes, so nothing renders differently. */}
              <ProductBuyAction
                available={available}
                orderingEnabled={orderingEnabled}
                slug={product.slug}
                variantId={selectedVariantId}
                productName={product.displayName}
                variantLabel={selectedVariant?.label ?? null}
              />
            </div>
          )}

          {/* Data round (owner 2026-09-24): verified rows only — every published row is verified today, this keeps it so. */}
          {verifiedRows(product.specifications).length > 0 && (
            <div className="flex flex-col gap-2 max-lg:order-4">
              <span className="label-mono text-xs text-foreground-dim">{dict.pilot.specificationsTitle}</span>
              <dl className="flex flex-col divide-y divide-surface-border-soft rounded-xl border border-surface-border-soft bg-surface-1">
                {verifiedRows(product.specifications).map((spec) => (
                  <div key={spec.key} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                    <dt className="text-foreground-muted">{spec.label}</dt>
                    <dd className="text-right font-medium text-foreground">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        {/* Phone gallery — hidden at lg+, where the desktop image box below is the hero. 4:3 rather
            than the legacy pages' square (D-ข): ProductMaster photos are mostly landscape boxes
            (coils, pods) that filled a 350px square only ~220px high; the shorter frame shows the
            same photo at the same size and lifts the chips and price into the first screen. */}
        <div className="relative aspect-[4/3] w-full max-lg:order-1 lg:hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse 58% 54% at 50% 40%, var(--color-steel-soft) 0%, transparent 72%)" }}
            aria-hidden
          />
          <MobileVariantGallery slides={slides} selectedId={selectedVariantId ?? "default"} onSelect={(id) => setSelectedVariantId(id === "default" ? null : id)} className="h-full" ariaLabel={axisLabel ?? undefined} />
        </div>

        <div className="relative order-1 aspect-[4/5] w-full max-lg:hidden lg:order-2">
          {showNoPhoto && selectedVariant ? (
            <div className="h-full w-full p-8 lg:p-12">
              <NoOptionPhoto name={selectedVariant.label} note={noPhotoNote} />
            </div>
          ) : displayImage ? (
            <>
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(ellipse 58% 54% at 50% 40%, var(--color-steel-soft) 0%, transparent 72%)" }}
                aria-hidden
              />
              <div className={fillHero ? "relative h-full w-full p-8 lg:p-12" : "relative flex h-full w-full items-center justify-center p-8 lg:p-12"}>
                {fillHero ? (
                  // `loading`/`fetchPriority` rather than `priority`: same no-op story as the
                  // phone slides above — this is the desktop hero, the page's largest paint.
                  <Image key={displayImage.src} src={displayImage.src} alt={displayImage.alt} fill sizes="(min-width: 1024px) 42vw, 90vw" className="object-contain" loading="eager" fetchPriority="high" />
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
                    loading="eager"
                    fetchPriority="high"
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
              // JSON-LD stays plain: read the untransformed dictionary, not the context copy
              // that carries the render-time Thai typography (thai-typography.ts). Round "clip":
              // the shared builder — this block had no uploadDate at all (GSC "invalid video item").
              __html: JSON.stringify(
                videoObjectJsonLd(product.reviewVideo, `${product.reviewVideo.channelName} — ${getDictionary(locale).product.reviewVideoEyebrow}: ${product.displayName}`)
              ),
            }}
          />
          <span className="label-mono text-xs text-foreground-dim">{dict.product.reviewVideoEyebrow}</span>
          <div className="max-w-2xl">
            <ProductReviewVideo video={product.reviewVideo} eyebrow={dict.product.reviewVideoEyebrow} watchOnYoutubeLabel={dict.product.watchOnYoutube} hiddenTitleLabel={dict.product.reviewVideoHiddenTitle} hideTitle={hideThaiClipTitle(locale, product.reviewVideo.title)} contextName={product.displayName} />
          </div>
        </Container>
      )}
      {/* Structured, clickable compatibility — same component and same evidence-backed edge
          table the legacy product page uses, so a published ProductMaster part can link to the
          legacy device it fits and vice versa. Renders nothing when there are no verified links. */}
      <CompatibleProducts direction="works-with" items={getCompatibleConsumables(product.slug)} />
      <CompatibleProducts direction="fits-devices" items={getCompatibleDevices(product.slug)} />
      <PilotRelatedProducts products={related} />
      <RelatedArticles articles={relatedArticles ?? []} otherLocaleArticles={relatedArticlesOtherLocales} />
      {product.sourceUrls.length > 0 && <SourceNote product={product} />}
      {showBuy && (
        <MobileBuyBar priceText={`฿${product.sellingPrice!.toLocaleString("th-TH")}`} optionLabel={selectedVariant?.label ?? null}>
          <ProductBuyAction available={available} orderingEnabled={orderingEnabled} slug={product.slug} variantId={selectedVariantId} productName={product.displayName} variantLabel={selectedVariant?.label ?? null} compact />
        </MobileBuyBar>
      )}
    </>
  );
}
