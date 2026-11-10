"use client";

import { useFavorites } from "@/lib/favorites";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Product } from "@/types/catalog";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import { ProductCard } from "@/components/catalog/ProductCard";
import { PilotProductCard } from "@/components/catalog-bridge/PilotProductCard";
import { Button } from "@/components/ui/Button";

/**
 * A favorited slug can belong to either the legacy catalog or a genuinely published ProductMaster
 * product — favoriting only worked for legacy before `PilotProductCard` gained its own
 * `FavoriteButton` (full-catalog-discovery-mission fix). Look up both, same "flat, mixed grid,
 * each item rendered by its own card component" pattern already used in `SearchTool.tsx`.
 *
 * Round 30.4 wiring ข3 (owner ruling 2026-09-12): the empty state reads `dict.favorites.*` — it was
 * hardcoded English in every language.
 */
/** `taglinesTh` = legacy cards' Thai taglines by slug, from the server page (src/lib/card-taglines.ts). `products` /
 *  `published` = the storefront lists from the server page (card-only records) — importing the catalog modules here
 *  bundled the raw product files, the team's picture notes included, into the browser (T2-50, 10/11). */
export function FavoritesList({
  products,
  published,
  taglinesTh = {},
}: {
  products: readonly Product[];
  published: readonly StorefrontProductView[];
  taglinesTh?: Record<string, string>;
}) {
  const { favorites } = useFavorites();
  const { dict } = useLocale();
  const legacyProducts = favorites.map((slug) => products.find((p) => p.slug === slug)).filter((p): p is Product => Boolean(p));
  const publishedProducts = favorites.map((slug) => published.find((p) => p.slug === slug)).filter((p): p is StorefrontProductView => Boolean(p));
  const totalCount = legacyProducts.length + publishedProducts.length;

  if (totalCount === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-surface-border py-20 text-center">
        <p className="font-display text-xl font-semibold text-foreground">{dict.favorites.emptyTitle}</p>
        <p className="max-w-sm text-sm text-foreground-muted">{dict.favorites.emptyBody}</p>
        <Button href="/products">{dict.favorites.emptyCta}</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4">
      {legacyProducts.map((p) => (
        <ProductCard key={p.slug} product={p} taglineTh={taglinesTh[p.slug]} />
      ))}
      {publishedProducts.map((p) => (
        <PilotProductCard key={p.slug} product={p} />
      ))}
    </div>
  );
}
