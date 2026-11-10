import Image from "next/image";
import type { CatalogItem } from "@/lib/catalog-index";
import { ProductMasterGlyph } from "@/components/catalog-bridge/ProductMasterGlyph";
import { cn } from "@/lib/utils";

/**
 * Media for a unified `CatalogItem`, i.e. a product that may come from either catalog half.
 *
 * `ProductMedia` cannot do this job: it takes a legacy `Product` and falls back to `DeviceGlyph`,
 * which reads `product.attributes.*` — genuinely `null` on every ProductMaster record. This picks
 * the correct fallback per origin instead of forcing one shape onto both:
 *
 * 1. A real card photo whenever the item has one (both halves; every published ProductMaster
 *    record has one, since media is part of its publication-readiness gate).
 * 2. `ProductMasterGlyph` otherwise — the systemType-derived shape used by PilotProductCard. (A legacy item without a photo
 *    used to re-fetch its record for `DeviceGlyph`; that import put the raw catalog into the /compare browser chunk —
 *    T2-50, 10/11 — and no storefront item lacks a photo: every hidden product is one without, IMAGE_SPEC §4.)
 *
 * Never renders a placeholder image standing in for a real one; an absent photo shows an
 * illustration that is honestly an illustration.
 */
export function CatalogItemMedia({ item, className, sizes }: { item: CatalogItem; className?: string; sizes?: string }) {
  if (item.image) {
    return (
      <div className={cn("relative h-full w-full", className)}>
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes={sizes ?? "(min-width: 1024px) 25vw, (min-width: 640px) 40vw, 80vw"}
          className="object-contain"
        />
      </div>
    );
  }

  return <ProductMasterGlyph kind={item.systemType === "coil" ? "coil" : item.systemType === "pod-cartridge" ? "pod-cartridge" : "generic"} className={className} />;
}
