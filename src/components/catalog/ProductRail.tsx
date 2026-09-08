import type { Product } from "@/types/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";

/**
 * Home-page product rail. Desktop: the sideways-scrolling strip of 280px cards it always was.
 * Phones/tablets (mobile round A, M3 — owner 2026-09-08, "the home page too"): the same cards as a
 * grid instead — two per row on a phone, four on a tablet — so the customer sees ~4 products per
 * screen without hunting for a horizontal scroll. Only `max-lg:` / `max-sm:` classes were added;
 * at `lg` and above every original class still applies unchanged.
 */
export function ProductRail({ products }: { products: Product[] }) {
  return (
    <div className="rail-scroll -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 max-lg:mx-0 max-lg:grid max-lg:grid-cols-4 max-lg:gap-3 max-lg:overflow-visible max-lg:px-0 max-lg:pb-0 max-sm:grid-cols-2 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
      {products.map((product) => (
        <div key={product.id} className="w-[240px] shrink-0 snap-start max-lg:w-auto sm:w-[280px]">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
