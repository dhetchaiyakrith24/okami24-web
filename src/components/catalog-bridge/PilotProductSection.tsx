"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import { PilotProductCard } from "./PilotProductCard";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { pluralCount } from "@/i18n/dictionaries";

/**
 * Appended to a category/brand page below the existing `CatalogBrowser` grid — never fed into
 * it. `CatalogBrowser` filters on legacy-only fields (`attributes.screenType`, `.portability`,
 * `.beginnerFriendly`), so mixing ProductMaster products into that array would mean fabricating
 * those fields. This is a second, independent grid instead — same card size/spacing as
 * `CatalogBrowser`'s, no search/filter/sort controls (this few products doesn't need them yet).
 *
 * `variant` picks the heading: "preview" (default) uses the DEV-preview wording ("Shipnity / Also
 * in stock right now"); "published" uses honest, real-catalog wording — pass this for the real,
 * published-products call (see products/[slug]/page.tsx and brands/[brand]/page.tsx). A plain
 * variant flag rather than literal override strings so the heading stays correctly locale-aware
 * (resolved here via `useLocale()`, same as everything else in this component) even though the
 * page that renders this is a Server Component with no locale of its own.
 */
export function PilotProductSection({
  products,
  variant = "preview",
}: {
  products: StorefrontProductView[];
  variant?: "preview" | "published";
}) {
  const { dict } = useLocale();
  if (products.length === 0) return null;
  const eyebrow = variant === "published" ? dict.pilot.publishedSectionEyebrow : dict.pilot.sectionEyebrow;
  const title = variant === "published" ? dict.pilot.publishedSectionTitle : dict.pilot.sectionTitle;

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
