import Image from "next/image";
import type { Product } from "@/types/catalog";
import { DeviceGlyph } from "@/components/visual/DeviceGlyph";
import { cn } from "@/lib/utils";

/**
 * Real-first product media: shows the product's official "card" photo
 * (isolated/transparent shot) when the catalog data has one, falling back
 * to the original parametric DeviceGlyph illustration otherwise. Used
 * everywhere a product's image appears except ProductAnatomy, whose
 * numbered callouts are positioned against DeviceGlyph's specific shape.
 */
export function ProductMedia({ product, className, sizes }: { product: Product; className?: string; sizes?: string }) {
  const cardPhoto = product.assets.find((a) => a.role === "card");

  if (cardPhoto) {
    return (
      <div className={cn("relative h-full w-full", className)}>
        <Image
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
