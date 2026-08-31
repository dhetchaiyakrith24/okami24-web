"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { Product } from "@/types/catalog";
import { allProducts } from "@/data/products";
import { ProductMedia } from "@/components/visual/ProductMedia";
import { brandName } from "@/lib/utils";
import { useLocale } from "@/components/i18n/LocaleProvider";

export function ProductPicker({
  selected,
  onAdd,
  onRemove,
  max = 4,
}: {
  selected: Product[];
  onAdd: (slug: string) => void;
  onRemove: (slug: string) => void;
  max?: number;
}) {
  const { dict } = useLocale();
  const [query, setQuery] = useState("");
  const selectedSlugs = new Set(selected.map((p) => p.slug));

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return allProducts.filter((p) => !selectedSlugs.has(p.slug) && `${p.name} ${p.brandId}`.toLowerCase().includes(q)).slice(0, 8);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, selected]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {selected.map((product) => (
          <div key={product.slug} className="relative rounded-xl border border-surface-border bg-surface-1 p-3">
            <button
              onClick={() => onRemove(product.slug)}
              aria-label={`${dict.compare.removeAriaPrefix} ${product.name}`}
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border border-surface-border bg-surface-0 text-foreground-muted hover:text-foreground"
            >
              <X size={12} aria-hidden />
            </button>
            <div className="h-16 w-full">
              <ProductMedia product={product} sizes="10vw" />
            </div>
            <p className="mt-2 text-xs font-semibold text-foreground">{product.name}</p>
            <p className="label-mono text-[0.6rem] text-foreground-dim">{brandName(product.brandId)}</p>
          </div>
        ))}
        {selected.length < max &&
          Array.from({ length: max - selected.length }).map((_, i) => (
            <div key={i} className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-surface-border text-foreground-dim">
              <span className="text-2xl">+</span>
            </div>
          ))}
      </div>

      {selected.length < max && (
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-dim" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`${dict.compare.addPlaceholder} (${selected.length}/${max})…`}
            className="w-full rounded-lg border border-surface-border bg-surface-1 py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-foreground-dim focus-visible:outline-2 focus-visible:outline-ember"
          />
          {results.length > 0 && (
            <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-lg border border-surface-border bg-surface-1 shadow-2xl">
              {results.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => {
                    onAdd(p.slug);
                    setQuery("");
                  }}
                  className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-foreground hover:bg-surface-2"
                >
                  <span>{p.name}</span>
                  <span className="label-mono text-[0.6rem] text-foreground-dim">{brandName(p.brandId)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
