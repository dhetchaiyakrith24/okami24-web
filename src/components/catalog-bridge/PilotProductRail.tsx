import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import { PilotProductCard } from "./PilotProductCard";

/** Pilot-only sibling of the legacy `ProductRail` — kept separate because `ProductRail` renders
 *  `ProductCard`, which requires legacy `Product.attributes.*`. Same phone/tablet grid treatment
 *  as `ProductRail` (mobile round A, M3, 2026-09-08): two per row on a phone, four on a tablet;
 *  desktop rail unchanged. */
export function PilotProductRail({ products }: { products: StorefrontProductView[] }) {
  return (
    <div className="rail-scroll -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 max-lg:mx-0 max-lg:grid max-lg:grid-cols-4 max-lg:gap-3 max-lg:overflow-visible max-lg:px-0 max-lg:pb-0 max-sm:grid-cols-2 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
      {products.map((product) => (
        <div key={product.slug} className="w-[240px] shrink-0 snap-start max-lg:w-auto sm:w-[280px]">
          <PilotProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
