"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import { PilotProductCard } from "./PilotProductCard";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { pluralCount } from "@/i18n/dictionaries";

/**
 * DEV-preview-only section, appended below `CatalogBrowser` on a category/brand page — genuinely
 * published ProductMaster products are no longer rendered here; they're merged directly into
 * `CatalogBrowser`'s own grid (see that component's doc comment), the same real-catalog treatment
 * a legacy product gets. This section is now exclusively for the still-unpublished DEV-preview
 * pool (`getPilotProducts*`), which is entirely absent from a production build regardless — kept
 * as its own small, clearly-labeled block since it's explicitly not customer-facing data and
 * doesn't need `CatalogBrowser`'s search/filter/sort machinery for a handful of review items.
 */
export function PilotProductSection({ products }: { products: StorefrontProductView[] }) {
  const { dict } = useLocale();
  if (products.length === 0) return null;
  const eyebrow = dict.pilot.sectionEyebrow;
  const title = dict.pilot.sectionTitle;

  return (
    <div className="flex flex-col gap-6 pt-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border-soft pb-4">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <p className="label-mono text-xs text-foreground-dim">
          {products.length} {pluralCount(products.length, dict.catalog.productCountOne, dict.catalog.productCountOther)}
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
