import { SectionHeading } from "@/components/ui/SectionHeading";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import { PilotProductCard } from "./PilotProductCard";

/**
 * Appended to a category/brand page below the existing `CatalogBrowser` grid — never fed into
 * it. `CatalogBrowser` filters on legacy-only fields (`attributes.screenType`, `.portability`,
 * `.beginnerFriendly`), so mixing pilot products into that array would mean fabricating those
 * fields. This is a second, independent grid instead — same card size/spacing as
 * `CatalogBrowser`'s, no search/filter/sort controls (5 products doesn't need them yet).
 */
export function PilotProductSection({ products }: { products: StorefrontProductView[] }) {
  if (products.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 pt-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border-soft pb-4">
        <SectionHeading eyebrow="Shipnity" title="Also in stock right now" />
        <p className="label-mono text-xs text-foreground-dim">
          {products.length} product{products.length === 1 ? "" : "s"}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => (
          <PilotProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
