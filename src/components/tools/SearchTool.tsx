"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import type { Product } from "@/types/catalog";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import { allProducts, legacySearchText } from "@/data/products";
import { getPublishedProducts, publishedSearchText, searchPilotProducts } from "@/data/shipnity-seed/storefront-bridge";
import { rankByQuery, type SearchText } from "@/lib/catalog-search";
import { ProductCard } from "@/components/catalog/ProductCard";
import { PilotProductCard } from "@/components/catalog-bridge/PilotProductCard";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { pluralCount } from "@/i18n/dictionaries";

/**
 * One flat result grid mixing legacy `Product[]` and ProductMaster `StorefrontProductView[]`
 * (both published and DEV-preview), each rendered by its own card component (`ProductCard`
 * requires legacy `attributes.*`, `PilotProductCard` doesn't have it — see storefront-bridge.ts).
 * Order (round "search-price", 2026-09-22): legacy and real PUBLISHED ProductMaster results are
 * ranked TOGETHER by src/lib/catalog-search.ts — a product matched by what it is (name, brand,
 * category, "หัวพอต") comes before one matched only by a spec line that mentions the word — and
 * ties keep the catalog order (legacy first, then published, as before). DEV-preview-only results
 * stay last (`searchPilotProducts` — never present in production). No deduplication — none of
 * the pilot products has a known `exactLegacyMatch`, so there is nothing to merge.
 */
type SearchHit = { kind: "legacy"; product: Product } | { kind: "published"; product: StorefrontProductView };

function storefrontSearchEntries(): { hit: SearchHit; text: SearchText }[] {
  return [
    ...allProducts.map((product) => ({ hit: { kind: "legacy" as const, product }, text: legacySearchText(product) })),
    ...getPublishedProducts().map((product) => ({ hit: { kind: "published" as const, product }, text: publishedSearchText(product) })),
  ];
}
export function SearchTool({ initialQuery = "" }: { initialQuery?: string }) {
  const { dict } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const entries = useMemo(() => storefrontSearchEntries(), []);
  const results = useMemo(() => rankByQuery(query, entries, (e) => e.text).map((e) => e.hit), [query, entries]);
  const pilotResults = useMemo(() => searchPilotProducts(query), [query]);
  const totalCount = results.length + pilotResults.length;

  useEffect(() => {
    const trimmed = query.trim();
    // Skip when the URL already matches: on mount (including right after back-navigation) the
    // URL is already in sync, and re-issuing router.replace() here — even a same-URL, scroll:false
    // one — retriggers a router transition that stomps the browser's native scroll restoration
    // for that back-navigation (see Phase 3.2 verification). Only sync when the user's typing has
    // actually diverged the query from the URL.
    if (trimmed === (searchParams.get("q") ?? "")) return;
    const url = trimmed === "" ? pathname : `${pathname}?q=${encodeURIComponent(trimmed)}`;
    router.replace(url, { scroll: false });
  }, [query, pathname, router, searchParams]);

  useEffect(() => {
    // `autoFocus` calls `element.focus()` with the browser default of scrolling the element into
    // view, which fights the scroll position the browser is restoring on back-navigation into this
    // page (see Phase 3.2 verification). `preventScroll` keeps the same focus-on-mount UX without
    // that side effect.
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <div className="relative mx-auto w-full max-w-xl">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground-dim" aria-hidden />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={dict.search.placeholder}
          className="w-full rounded-full border border-surface-border bg-surface-1 py-3.5 pl-12 pr-4 text-base text-foreground placeholder:text-foreground-dim focus-visible:outline-2 focus-visible:outline-ember"
        />
      </div>

      {query.trim() === "" ? (
        <p className="text-center text-sm text-foreground-dim">{dict.search.prompt}</p>
      ) : totalCount === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <p className="font-display text-xl font-semibold text-foreground">
            {dict.search.noResultsTitle} &ldquo;{query}&rdquo;
          </p>
          <p className="max-w-sm text-sm text-foreground-muted">{dict.search.noResultsHint}</p>
        </div>
      ) : (
        <>
          <p className="label-mono text-center text-xs text-foreground-dim">
            {totalCount} {pluralCount(totalCount, dict.search.resultCountOne, dict.search.resultCountOther)}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4">
            {results.map((r) =>
              r.kind === "legacy" ? <ProductCard key={r.product.slug} product={r.product} /> : <PilotProductCard key={r.product.slug} product={r.product} />
            )}
            {pilotResults.map((p) => (
              <PilotProductCard key={p.slug} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
