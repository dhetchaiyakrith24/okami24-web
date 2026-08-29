"use client";

import { useFavorites } from "@/lib/favorites";
import { getProduct } from "@/data/products";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Button } from "@/components/ui/Button";

export function FavoritesList() {
  const { favorites } = useFavorites();
  const products = favorites.map((slug) => getProduct(slug)).filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-surface-border py-20 text-center">
        <p className="font-display text-xl font-semibold text-foreground">No favorites yet</p>
        <p className="max-w-sm text-sm text-foreground-muted">
          Tap the heart icon on any product card to save it here. Favorites are stored only in this browser.
        </p>
        <Button href="/products">Browse the catalog</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </div>
  );
}
