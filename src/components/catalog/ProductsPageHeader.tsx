"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { pluralCount } from "@/i18n/dictionaries";

/** Same pattern as CategoryPageHeader.tsx (which already correctly localizes category
 *  subpages) — the top-level `/products` all-products page simply never got the same treatment.
 *  Reuses `catalog.eyebrow`/`nav.allProducts` rather than duplicating those words. */
export function ProductsPageHeader({ totalCount }: { totalCount: number }) {
  const { dict } = useLocale();
  return (
    <PageHeader
      bare
      eyebrow={dict.catalog.eyebrow}
      title={dict.nav.allProducts}
      description={`${totalCount} ${pluralCount(totalCount, dict.products.pageDescriptionOne, dict.products.pageDescriptionOther)}`}
    />
  );
}
