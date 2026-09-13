"use client";

import { useFavorites } from "@/lib/favorites";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getProduct } from "@/data/products";
import { getPublishedProduct } from "@/data/shipnity-seed/storefront-bridge";
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
export function FavoritesList() {
  const { favorites } = useFavorites();
  const { dict } = useLocale();
  const legacyProducts = favorites.map((slug) => getProduct(slug)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const publishedProducts = favorites.map((slug) => getPublishedProduct(slug)).filter((p): p is NonNullable<typeof p> => Boolean(p));
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
        <ProductCard key={p.slug} product={p} />
      ))}
      {publishedProducts.map((p) => (
        <PilotProductCard key={p.slug} product={p} />
      ))}
    </div>
  );
}
