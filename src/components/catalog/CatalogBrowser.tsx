"use client";

import { useMemo, useState } from "react";
import type { Product, ScreenType, Portability } from "@/types/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";
import { brands } from "@/data/brands";
import { familyName } from "@/lib/utils";
import { X } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { pluralCount } from "@/i18n/dictionaries";

type SortMode = "featured" | "alphabetical" | "family";

export function CatalogBrowser({ products, isEmptyCategory }: { products: Product[]; isEmptyCategory?: boolean }) {
  const { dict } = useLocale();

  const SCREEN_LABELS: Record<ScreenType, string> = {
    none: dict.catalog.screenNone,
    "led-indicator": dict.catalog.screenLed,
    "color-display": dict.catalog.screenColor,
    touchscreen: dict.catalog.screenTouch,
  };

  const PORTABILITY_LABELS: Record<Portability, string> = {
    "ultra-compact": dict.catalog.portabilityUltraCompact,
    compact: dict.catalog.portabilityCompact,
    standard: dict.catalog.portabilityStandard,
  };
  const [query, setQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState<Set<string>>(new Set());
  const [screenFilter, setScreenFilter] = useState<Set<ScreenType>>(new Set());
  const [portabilityFilter, setPortabilityFilter] = useState<Set<Portability>>(new Set());
  const [beginnerOnly, setBeginnerOnly] = useState(false);
  const [sort, setSort] = useState<SortMode>("featured");

  const availableBrands = useMemo(() => {
    const ids = new Set(products.map((p) => p.brandId));
    return brands.filter((b) => ids.has(b.id));
  }, [products]);

  const availableScreens = useMemo(() => {
    const set = new Set(products.map((p) => p.attributes.screenType));
    return Array.from(set);
  }, [products]);

  const availablePortability = useMemo(() => {
    const set = new Set(products.map((p) => p.attributes.portability));
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(() => {
    let list = products;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => `${p.name} ${p.tagline} ${p.shortDescription}`.toLowerCase().includes(q));
    }
    if (brandFilter.size > 0) list = list.filter((p) => brandFilter.has(p.brandId));
    if (screenFilter.size > 0) list = list.filter((p) => screenFilter.has(p.attributes.screenType));
    if (portabilityFilter.size > 0) list = list.filter((p) => portabilityFilter.has(p.attributes.portability));
    if (beginnerOnly) list = list.filter((p) => p.attributes.beginnerFriendly);

    const sorted = [...list];
    if (sort === "alphabetical") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "family") {
      sorted.sort((a, b) => familyName(a.familyId).localeCompare(familyName(b.familyId)) || a.name.localeCompare(b.name));
    } else {
      sorted.sort((a, b) => Number(b.isFlagship) - Number(a.isFlagship) || Number(Boolean(b.editorialTag)) - Number(Boolean(a.editorialTag)));
    }
    return sorted;
  }, [products, query, brandFilter, screenFilter, portabilityFilter, beginnerOnly, sort]);

  function toggle<T>(set: Set<T>, value: T, setter: (s: Set<T>) => void) {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  }

  const activeFilterCount = brandFilter.size + screenFilter.size + portabilityFilter.size + (beginnerOnly ? 1 : 0);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
      <aside className="flex flex-col gap-8">
        <div>
          <label htmlFor="catalog-search" className="label-mono mb-2 block text-xs text-foreground-dim">
            {dict.catalog.searchLabel}
          </label>
          <input
            id="catalog-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={dict.catalog.searchPlaceholder}
            className="w-full rounded-lg border border-surface-border bg-surface-1 px-3 py-2 text-sm text-foreground placeholder:text-foreground-dim focus-visible:outline-2 focus-visible:outline-ember"
          />
        </div>

        {availableBrands.length > 1 && (
          <FilterGroup title={dict.catalog.filterBrand}>
            {availableBrands.map((b) => (
              <FilterCheckbox key={b.id} label={b.name} checked={brandFilter.has(b.id)} onChange={() => toggle(brandFilter, b.id, setBrandFilter)} />
            ))}
          </FilterGroup>
        )}

        {availableScreens.length > 1 && (
          <FilterGroup title={dict.catalog.filterScreen}>
            {availableScreens.map((s) => (
              <FilterCheckbox key={s} label={SCREEN_LABELS[s]} checked={screenFilter.has(s)} onChange={() => toggle(screenFilter, s, setScreenFilter)} />
            ))}
          </FilterGroup>
        )}

        {availablePortability.length > 1 && (
          <FilterGroup title={dict.catalog.filterPortability}>
            {availablePortability.map((p) => (
              <FilterCheckbox
                key={p}
                label={PORTABILITY_LABELS[p]}
                checked={portabilityFilter.has(p)}
                onChange={() => toggle(portabilityFilter, p, setPortabilityFilter)}
              />
            ))}
          </FilterGroup>
        )}

        <FilterGroup title={dict.catalog.filterExperienceLevel}>
          <FilterCheckbox label={dict.catalog.filterBeginnerOnly} checked={beginnerOnly} onChange={() => setBeginnerOnly((v) => !v)} />
        </FilterGroup>

        {activeFilterCount > 0 && (
          <button
            onClick={() => {
              setBrandFilter(new Set());
              setScreenFilter(new Set());
              setPortabilityFilter(new Set());
              setBeginnerOnly(false);
            }}
            className="label-mono flex items-center gap-1.5 text-xs text-ember hover:underline"
          >
            <X size={12} aria-hidden /> {dict.catalog.clearFilters} ({activeFilterCount})
          </button>
        )}
      </aside>

      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border-soft pb-4">
          <p className="label-mono text-xs text-foreground-dim">
            {filtered.length} {pluralCount(filtered.length, dict.catalog.productCountOne, dict.catalog.productCountOther)}
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="catalog-sort" className="label-mono text-xs text-foreground-dim">
              {dict.catalog.sortLabel}
            </label>
            <select
              id="catalog-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              className="rounded-lg border border-surface-border bg-surface-1 px-2 py-1.5 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ember"
            >
              <option value="featured">{dict.catalog.sortFeatured}</option>
              <option value="alphabetical">{dict.catalog.sortAlphabetical}</option>
              <option value="family">{dict.catalog.sortFamily}</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-surface-border py-20 text-center">
            <p className="font-display text-xl font-semibold text-foreground">{dict.catalog.noMatchTitle}</p>
            <p className="max-w-sm text-sm text-foreground-muted">{isEmptyCategory ? dict.catalog.emptyStateNote : dict.catalog.noMatchHint}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="label-mono mb-2 text-xs text-foreground-dim">{title}</legend>
      <div className="flex flex-col gap-2">{children}</div>
    </fieldset>
  );
}

function FilterCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground-muted hover:text-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-surface-border bg-surface-1 text-ember accent-ember focus-visible:outline-2 focus-visible:outline-ember"
      />
      {label}
    </label>
  );
}
