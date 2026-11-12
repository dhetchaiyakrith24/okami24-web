"use client";

import { useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { CatalogItem } from "@/lib/catalog-index";
import { CatalogItemMedia } from "@/components/visual/CatalogItemMedia";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { labelLang } from "@/lib/label-lang";

/**
 * Searches the UNIFIED customer-visible catalog (legacy + published ProductMaster), not just the
 * legacy half — a published ProductMaster product is a real, purchasable catalog product and was
 * previously unreachable from Compare purely because this picker read `allProducts` directly.
 * `allCatalogItems()` is the single visibility gate (see lib/catalog-index.ts); nothing
 * unpublished or DEV-preview-only can surface here.
 */
export function ProductPicker({
  selected,
  onAdd,
  onRemove,
  catalog,
  max = 4,
}: {
  selected: CatalogItem[];
  /** the storefront catalog (allCatalogItems, from the server page — a client import of catalog-index bundled the raw
   *  product files, T2-50) */
  catalog: readonly CatalogItem[];
  onAdd: (slug: string) => void;
  onRemove: (slug: string) => void;
  max?: number;
}) {
  const { dict } = useLocale();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const full = selected.length >= max;
  const selectedSlugs = new Set(selected.map((p) => p.slug));

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return catalog
      .filter((p) => !selectedSlugs.has(p.slug) && `${p.name} ${p.brandName ?? ""} ${p.brandId ?? ""}`.toLowerCase().includes(q))
      .slice(0, 8);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, selected]);

  return (
    <div className="flex flex-col gap-4">
      {/* Live fix 12/11 (visitor agent): the search box comes FIRST. Below the four empty boxes it sat off screen on a
          phone while the hint under it says "ช่องค้นหาด้านบน"; an empty box now also puts the cursor in the search. */}
      {!full && (
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-dim" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`${dict.compare.addPlaceholder} (${selected.length}/${max})…`}
            className="w-full rounded-lg border border-surface-border bg-surface-1 py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-foreground-dim focus-visible:outline-2 focus-visible:outline-ember"
          />
          {results.length > 0 && (
            <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-surface-border bg-surface-1 shadow-2xl">
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
                  <span className="label-mono text-[0.6rem] text-foreground-dim" lang={labelLang(p.brandName)}>{p.brandName}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {selected.map((product) => (
          <div key={product.slug} className="relative flex flex-col rounded-xl border border-surface-border bg-surface-1 p-3">
            {/* z-10: the picture box below is `relative` (07/11 fill-the-card fix) and comes later in the DOM, so
                without it the picture painted over this button and swallowed every click (owner 12/11). Guarded by
                compare-remove-contract-test.ts. */}
            <button
              type="button"
              onClick={() => onRemove(product.slug)}
              aria-label={`${dict.compare.removeAriaPrefix} ${product.name}`}
              className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-surface-border bg-surface-0 text-foreground-muted hover:text-foreground"
            >
              <X size={12} aria-hidden />
            </button>
            <div className="relative aspect-[4/5] w-full">
              <CatalogItemMedia item={product} sizes="(min-width: 640px) 25vw, 50vw" />
            </div>
            <p className="mt-2 text-xs font-semibold text-foreground">{product.name}</p>
            <p className="label-mono text-[0.6rem] text-foreground-dim" lang={labelLang(product.brandName)}>{product.brandName}</p>
          </div>
        ))}
        {selected.length < max &&
          Array.from({ length: max - selected.length }).map((_, i) => (
            <button
              key={i}
              type="button"
              tabIndex={-1}
              aria-hidden
              onClick={() => inputRef.current?.focus()}
              className="flex aspect-[4/5] h-full w-full items-center justify-center rounded-xl border border-dashed border-surface-border text-foreground-dim transition-colors hover:border-foreground-dim hover:text-foreground-muted"
            >
              <span className="text-2xl">+</span>
            </button>
          ))}
      </div>

    </div>
  );
}
