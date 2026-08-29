import type { Product } from "@/types/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";

export function ProductRail({ products }: { products: Product[] }) {
  return (
    <div className="rail-scroll -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
      {products.map((product) => (
        <div key={product.id} className="w-[240px] shrink-0 snap-start sm:w-[280px]">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
