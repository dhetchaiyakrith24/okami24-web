"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { searchProducts } from "@/data/products";
import { ProductCard } from "@/components/catalog/ProductCard";

export function SearchTool({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const results = useMemo(() => searchProducts(query), [query]);

  return (
    <div className="flex flex-col gap-10">
      <div className="relative mx-auto w-full max-w-xl">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground-dim" aria-hidden />
        <input
          autoFocus
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, brands, families, features…"
          className="w-full rounded-full border border-surface-border bg-surface-1 py-3.5 pl-12 pr-4 text-base text-foreground placeholder:text-foreground-dim focus-visible:outline-2 focus-visible:outline-ember"
        />
      </div>

      {query.trim() === "" ? (
        <p className="text-center text-sm text-foreground-dim">Start typing to search the catalog.</p>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <p className="font-display text-xl font-semibold text-foreground">No results for &ldquo;{query}&rdquo;</p>
          <p className="max-w-sm text-sm text-foreground-muted">
            Try a brand name (UWELL, VOOPOO, SALTHUB), a family (Caliburn, ARGUS, M Bar), or a feature like
            &ldquo;touchscreen&rdquo;.
          </p>
        </div>
      ) : (
        <>
          <p className="label-mono text-center text-xs text-foreground-dim">
            {results.length} result{results.length === 1 ? "" : "s"}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
