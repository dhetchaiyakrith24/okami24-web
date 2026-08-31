import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import { PilotProductCard } from "./PilotProductCard";

/** Pilot-only sibling of the legacy `ProductRail` — kept separate because `ProductRail` renders
 *  `ProductCard`, which requires legacy `Product.attributes.*`. */
export function PilotProductRail({ products }: { products: StorefrontProductView[] }) {
  return (
    <div className="rail-scroll -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
      {products.map((product) => (
        <div key={product.slug} className="w-[240px] shrink-0 snap-start sm:w-[280px]">
          <PilotProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
