import Image from "next/image";
import type { Product } from "@/types/catalog";
import { DeviceGlyph } from "@/components/visual/DeviceGlyph";
import { cn } from "@/lib/utils";
import type { ImageDisplayInfo } from "@/lib/media-quality";

/**
 * Real-first product media: shows the product's official "card" photo
 * (isolated/transparent shot) when the catalog data has one, falling back
 * to the original parametric DeviceGlyph illustration otherwise. Used
 * everywhere a product's image appears except ProductAnatomy, whose
 * numbered callouts are positioned against DeviceGlyph's specific shape.
 *
 * `qualityAware` (optional) is the storefront quality-correction pass's fill-vs-intrinsic switch
 * — see `src/lib/media-quality.ts` for the full rationale. Only Product Detail's hero passes it;
 * every other caller (cards, pickers, rails) omits it and keeps the original always-`fill`
 * behavior unchanged, since a small source already looks acceptable at those smaller sizes.
 * MUST be the display info for whichever image is actually being shown (`overrideImage` when set,
 * the card otherwise) — see the bug note below.
 *
 * `overrideImage` (optional) — Legacy color/flavor-variant selection (owner quality review,
 * 2026-09-02). When the customer picks a real, photographed color/flavor via
 * `ColorVariantRail`/`FlavorVariantGrid`, the parent passes that variant's own image here instead
 * of mutating `product`; omitted/`null` falls back to the product's own default card photo.
 *
 * BUG FIX (owner-reported, 2026-09-04): this used to unconditionally render `overrideImage` with
 * `fill` regardless of `qualityAware`, on the assumption that variant photos were always "full
 * studio photos" too large to ever need intrinsic sizing. That assumption stopped being true once
 * per-color crops as small as ~140px wide were added (VOOPOO batch) — `fill` stretched them well
 * past their real resolution and they read as broken/blurry, while the SAME product's card image
 * (correctly quality-aware) looked fine, and the lineup composite (a separately-built, larger
 * image) also looked fine — exactly the "composite's OK, one color looks broken" pattern reported.
 * Fix: apply the identical fill-vs-intrinsic check to `overrideImage` too — the caller is
 * responsible for passing the RIGHT `ImageDisplayInfo` for whichever image is current (see
 * `ProductHero`'s `imageDisplayMap` lookup).
 */
export function ProductMedia({
  product,
  className,
  sizes,
  qualityAware,
  overrideImage,
}: {
  product: Product;
  className?: string;
  sizes?: string;
  qualityAware?: ImageDisplayInfo | null;
  overrideImage?: { src: string; alt: string } | null;
}) {
  const cardPhoto = overrideImage ?? product.assets.find((a) => a.role === "card");

  if (cardPhoto) {
    if (qualityAware && !qualityAware.fillHero) {
      return (
        <div className={cn("relative flex h-full w-full items-center justify-center", className)}>
          <Image
            key={cardPhoto.src}
            src={cardPhoto.src}
            alt={cardPhoto.alt}
            width={qualityAware.width}
            height={qualityAware.height}
            sizes={sizes ?? "(min-width: 1024px) 25vw, (min-width: 640px) 40vw, 80vw"}
            className="h-auto max-h-full w-auto max-w-full object-contain"
          />
        </div>
      );
    }
    return (
      <div className={cn("relative h-full w-full", className)}>
        <Image
          key={cardPhoto.src}
          src={cardPhoto.src}
          alt={cardPhoto.alt}
          fill
          sizes={sizes ?? "(min-width: 1024px) 25vw, (min-width: 640px) 40vw, 80vw"}
          className="object-contain"
        />
      </div>
    );
  }

  return <DeviceGlyph product={product} className={className} />;
}
