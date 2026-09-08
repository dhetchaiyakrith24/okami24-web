"use client";

import { useCallback, useMemo, useState } from "react";
import type { Product, ScreenType, Portability } from "@/types/catalog";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import { ProductCard } from "@/components/catalog/ProductCard";
import { PilotProductCard } from "@/components/catalog-bridge/PilotProductCard";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { brands } from "@/data/brands";
import { familyName } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { pluralCount } from "@/i18n/dictionaries";

type SortMode = "featured" | "alphabetical" | "family";

/**
 * Full-catalog-mission discovery fix: a real, genuinely PUBLISHED ProductMaster product is a real
 * catalog product — it belongs in the SAME grid/filter/sort experience as a legacy product, not a
 * visually separate "Now Available" block underneath. Customers never need to know a product came
 * from the legacy hand-authored catalog vs. the Shipnity-sourced ProductMaster pipeline; that's an
 * implementation detail, not a storefront boundary.
 *
 * This normalizes both pools into one internal `CatalogEntry` shape for filtering/sorting only —
 * rendering still dispatches to each pool's own card component (`ProductCard`/`PilotProductCard`),
 * exactly like `SearchTool.tsx` already does successfully. Legacy-only facets (screen type,
 * portability, beginner-friendly) simply don't apply to a published entry — when such a filter is
 * active, a published entry with no known value for it is correctly excluded (we don't know its
 * screen type, so it can't honestly claim to match one), not fabricated to "pass."
 *
 * Still-unpublished DEV-preview products are NEVER passed here — they stay in the separate,
 * clearly-labeled `PilotProductSection` below, which is the correct place for genuinely
 * not-customer-facing data (and is entirely absent from a production build regardless).
 *
 * Phones and tablets (mobile round B, owner 2026-09-08, MOBILE_SPEC M4): below `lg` the sidebar
 * is hidden and the same filters live in a bottom sheet behind one "filters (n)" button on the
 * results bar, so the first product is on the first screen. The sidebar's markup is untouched —
 * it only gained `max-lg:hidden` — and the phone-only pieces are display:none at `lg`, so the
 * desktop page is exactly what it was. One state feeds both the sidebar and the sheet.
 */
interface CatalogEntry {
  kind: "legacy" | "published";
  key: string;
  name: string;
  tagline: string;
  searchText: string;
  brandId: string;
  categoryId: string;
  isFlagship: boolean;
  hasEditorialTag: boolean;
  familyId: string | null;
  screenType: ScreenType | null;
  portability: Portability | null;
  beginnerFriendly: boolean | null;
  legacyProduct?: Product;
  publishedProduct?: StorefrontProductView;
}

function toEntries(products: Product[], publishedProducts: StorefrontProductView[]): CatalogEntry[] {
  const legacyEntries: CatalogEntry[] = products.map((p) => ({
    kind: "legacy",
    key: `legacy:${p.slug}`,
    name: p.name,
    tagline: p.tagline,
    searchText: `${p.name} ${p.tagline} ${p.shortDescription}`.toLowerCase(),
    brandId: p.brandId,
    categoryId: p.categoryId,
    isFlagship: p.isFlagship,
    hasEditorialTag: Boolean(p.editorialTag),
    familyId: p.familyId,
    screenType: p.attributes.screenType ?? null,
    portability: p.attributes.portability ?? null,
    beginnerFriendly: p.attributes.beginnerFriendly,
    legacyProduct: p,
  }));
  const publishedEntries: CatalogEntry[] = publishedProducts.map((p) => ({
    kind: "published",
    key: `published:${p.slug}`,
    name: p.displayName,
    tagline: p.tagline,
    searchText: `${p.displayName} ${p.tagline} ${p.brandName}`.toLowerCase(),
    brandId: p.brandId,
    categoryId: p.categoryId,
    isFlagship: p.isFlagship,
    hasEditorialTag: false,
    familyId: null,
    screenType: null,
    portability: null,
    beginnerFriendly: null,
    publishedProduct: p,
  }));
  return [...legacyEntries, ...publishedEntries];
}

/** The sheet's collapsible groups, keyed so the open/closed state survives re-renders. */
type SheetGroupId = "brand" | "screen" | "portability" | "level";

export function CatalogBrowser({
  products,
  publishedProducts = [],
  isEmptyCategory,
}: {
  products: Product[];
  publishedProducts?: StorefrontProductView[];
  isEmptyCategory?: boolean;
}) {
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

  // Phone sheet (M4). Groups start with only the brand list open — it is the facet a shopper
  // reaches for first — and any group that already has a tick opens itself when the sheet does.
  const [sheetOpen, setSheetOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Set<SheetGroupId>>(() => new Set<SheetGroupId>(["brand"]));

  const entries = useMemo(() => toEntries(products, publishedProducts), [products, publishedProducts]);

  const availableBrands = useMemo(() => {
    const ids = new Set(entries.map((e) => e.brandId));
    return brands.filter((b) => ids.has(b.id));
  }, [entries]);

  // Screen-type/portability facets only ever come from legacy data (published records don't carry
  // `attributes` — see product-master-schema.ts) — computing these from `products`, not `entries`,
  // is intentional, not an oversight.
  const availableScreens = useMemo(() => {
    const set = new Set(products.map((p) => p.attributes.screenType).filter((s): s is ScreenType => s !== undefined));
    return Array.from(set);
  }, [products]);

  const availablePortability = useMemo(() => {
    const set = new Set(products.map((p) => p.attributes.portability).filter((p): p is Portability => p !== undefined));
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(() => {
    let list = entries;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((e) => e.searchText.includes(q));
    }
    if (brandFilter.size > 0) list = list.filter((e) => brandFilter.has(e.brandId));
    if (screenFilter.size > 0) list = list.filter((e) => e.screenType !== null && screenFilter.has(e.screenType));
    if (portabilityFilter.size > 0) list = list.filter((e) => e.portability !== null && portabilityFilter.has(e.portability));
    if (beginnerOnly) list = list.filter((e) => e.beginnerFriendly === true);

    const sorted = [...list];
    if (sort === "alphabetical") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "family") {
      const familyLabel = (e: CatalogEntry) => (e.familyId ? familyName(e.familyId) : "");
      sorted.sort((a, b) => familyLabel(a).localeCompare(familyLabel(b)) || a.name.localeCompare(b.name));
    } else {
      sorted.sort((a, b) => Number(b.isFlagship) - Number(a.isFlagship) || Number(b.hasEditorialTag) - Number(a.hasEditorialTag));
    }
    return sorted;
  }, [entries, query, brandFilter, screenFilter, portabilityFilter, beginnerOnly, sort]);

  function toggle<T>(set: Set<T>, value: T, setter: (s: Set<T>) => void) {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  }

  const activeFilterCount = brandFilter.size + screenFilter.size + portabilityFilter.size + (beginnerOnly ? 1 : 0);
  // The phone button counts the search text too — the sheet is the only place it can be typed
  // there, so a button reading "filters" with no number while a search narrows the grid would lie.
  const mobileActiveCount = activeFilterCount + (query.trim() ? 1 : 0);

  const clearFacets = () => {
    setBrandFilter(new Set());
    setScreenFilter(new Set());
    setPortabilityFilter(new Set());
    setBeginnerOnly(false);
  };

  const openSheet = () => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (brandFilter.size > 0) next.add("brand");
      if (screenFilter.size > 0) next.add("screen");
      if (portabilityFilter.size > 0) next.add("portability");
      if (beginnerOnly) next.add("level");
      return next;
    });
    setSheetOpen(true);
  };
  const closeSheet = useCallback(() => setSheetOpen(false), []);
  const toggleGroup = (id: SheetGroupId) => toggle(openGroups, id, setOpenGroups);

  const countText = `${filtered.length} ${pluralCount(filtered.length, dict.catalog.productCountOne, dict.catalog.productCountOther)}`;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
      <aside className="flex flex-col gap-8 max-lg:hidden">
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

        {/* Storefront quality-correction pass (2026-09-02) — the Category checkbox filter that
            used to live here was removed at the owner's request: this component only ever shows
            it on `/products` (a category-scoped subpage's list has exactly one categoryId, so it
            was already hidden there), and `/products` sits directly under primary navigation's
            own category submenu — a customer can already reach any single category in one click
            from the header, making an in-page checkbox for the exact same thing pure duplication.
            Brand and the other real per-product facets below are unaffected; this removes only
            the one genuinely redundant control. */}

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

        {products.length > 0 && (
          <FilterGroup title={dict.catalog.filterExperienceLevel}>
            <FilterCheckbox label={dict.catalog.filterBeginnerOnly} checked={beginnerOnly} onChange={() => setBeginnerOnly((v) => !v)} />
          </FilterGroup>
        )}

        {activeFilterCount > 0 && (
          <button
            onClick={clearFacets}
            className="label-mono flex items-center gap-1.5 text-xs text-ember hover:underline"
          >
            <X size={12} aria-hidden /> {dict.catalog.clearFilters} ({activeFilterCount})
          </button>
        )}
      </aside>

      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border-soft pb-4">
          {/* Phone/tablet only (M4): the one button that replaces the sidebar. */}
          <button
            type="button"
            onClick={openSheet}
            aria-haspopup="dialog"
            aria-expanded={sheetOpen}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-surface-border bg-surface-1 px-4 text-sm font-semibold tracking-tight text-foreground transition-colors hover:border-foreground-dim hover:bg-surface-2 lg:hidden"
          >
            <SlidersHorizontal size={16} aria-hidden />
            {dict.catalog.filtersButton}
            {mobileActiveCount > 0 && ` (${mobileActiveCount})`}
          </button>
          {/* Left exactly as it was — three JSX children, not one joined string. Joining them
              merges three DOM text nodes into one, which re-shapes the line and moved a handful of
              antialiased pixels at 1440 (proved by the masked compare). The joined `countText`
              above is only for the sheet's button label. */}
          <p className="label-mono text-xs text-foreground-dim max-lg:ml-auto">
            {filtered.length} {pluralCount(filtered.length, dict.catalog.productCountOne, dict.catalog.productCountOther)}
          </p>
          <div className="flex items-center gap-2">
            {/* On phones the word "sort by" is read out but not drawn: the button, the count and
                the select only fit on one bar (the owner asked for one bar) without it, and the
                select shows the chosen order in full. Unchanged from `lg` up. */}
            <label htmlFor="catalog-sort" className="label-mono text-xs text-foreground-dim max-lg:sr-only">
              {dict.catalog.sortLabel}
            </label>
            <select
              id="catalog-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              className="rounded-lg border border-surface-border bg-surface-1 px-2 py-1.5 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ember max-lg:min-h-11"
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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4">
            {filtered.map((entry) =>
              entry.kind === "legacy" ? (
                <ProductCard key={entry.key} product={entry.legacyProduct!} />
              ) : (
                <PilotProductCard key={entry.key} product={entry.publishedProduct!} />
              )
            )}
          </div>
        )}
      </div>

      {/* Phone/tablet filter sheet (M4) — the same state as the sidebar, in a BottomSheet that is
          only in the DOM while open. The grid behind it filters live, so the confirm button can
          say how many products are waiting. */}
      <BottomSheet
        open={sheetOpen}
        onClose={closeSheet}
        title={dict.catalog.filtersButton}
        closeLabel={dict.nav.closeMenu}
        footer={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                clearFacets();
                setQuery("");
              }}
              disabled={mobileActiveCount === 0}
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-surface-border px-4 text-sm font-semibold tracking-tight text-foreground transition-colors hover:border-foreground-dim hover:bg-surface-2 disabled:opacity-40"
            >
              <X size={14} aria-hidden />
              {dict.catalog.clearFilters}
            </button>
            <button
              type="button"
              onClick={closeSheet}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-ember px-4 text-sm font-semibold tracking-tight text-[#181008] transition-colors hover:bg-ember-strong"
            >
              {dict.catalog.filtersApply.replace("{count}", countText)}
            </button>
          </div>
        }
      >
        <div className="flex flex-col">
          <div className="py-3">
            <label htmlFor="catalog-search-sheet" className="label-mono mb-2 block text-xs text-foreground-dim">
              {dict.catalog.searchLabel}
            </label>
            <input
              id="catalog-search-sheet"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={dict.catalog.searchPlaceholder}
              className="min-h-11 w-full rounded-lg border border-surface-border bg-surface-0 px-3 text-base text-foreground placeholder:text-foreground-dim focus-visible:outline-2 focus-visible:outline-ember"
            />
          </div>

          {availableBrands.length > 1 && (
            <SheetGroup id="brand" title={dict.catalog.filterBrand} activeCount={brandFilter.size} open={openGroups.has("brand")} onToggle={toggleGroup}>
              {availableBrands.map((b) => (
                <SheetCheckbox key={b.id} label={b.name} checked={brandFilter.has(b.id)} onChange={() => toggle(brandFilter, b.id, setBrandFilter)} />
              ))}
            </SheetGroup>
          )}
          {availableScreens.length > 1 && (
            <SheetGroup id="screen" title={dict.catalog.filterScreen} activeCount={screenFilter.size} open={openGroups.has("screen")} onToggle={toggleGroup}>
              {availableScreens.map((s) => (
                <SheetCheckbox key={s} label={SCREEN_LABELS[s]} checked={screenFilter.has(s)} onChange={() => toggle(screenFilter, s, setScreenFilter)} />
              ))}
            </SheetGroup>
          )}
          {availablePortability.length > 1 && (
            <SheetGroup
              id="portability"
              title={dict.catalog.filterPortability}
              activeCount={portabilityFilter.size}
              open={openGroups.has("portability")}
              onToggle={toggleGroup}
            >
              {availablePortability.map((p) => (
                <SheetCheckbox
                  key={p}
                  label={PORTABILITY_LABELS[p]}
                  checked={portabilityFilter.has(p)}
                  onChange={() => toggle(portabilityFilter, p, setPortabilityFilter)}
                />
              ))}
            </SheetGroup>
          )}
          {products.length > 0 && (
            <SheetGroup id="level" title={dict.catalog.filterExperienceLevel} activeCount={beginnerOnly ? 1 : 0} open={openGroups.has("level")} onToggle={toggleGroup}>
              <SheetCheckbox label={dict.catalog.filterBeginnerOnly} checked={beginnerOnly} onChange={() => setBeginnerOnly((v) => !v)} />
            </SheetGroup>
          )}
        </div>
      </BottomSheet>
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

/** A collapsible group inside the phone sheet: a 44px header row (title · ticked count · chevron)
 *  and the same checkboxes as the sidebar, at finger size. */
function SheetGroup({
  id,
  title,
  activeCount,
  open,
  onToggle,
  children,
}: {
  id: SheetGroupId;
  title: string;
  activeCount: number;
  open: boolean;
  onToggle: (id: SheetGroupId) => void;
  children: React.ReactNode;
}) {
  const panelId = `catalog-sheet-group-${id}`;
  return (
    <div className="border-t border-surface-border-soft">
      <button
        type="button"
        onClick={() => onToggle(id)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex min-h-12 w-full items-center gap-3 py-2 text-left"
      >
        <span className="label-mono flex-1 text-xs text-foreground">{title}</span>
        {activeCount > 0 && (
          <span className="rounded-full bg-ember/15 px-2 py-0.5 text-xs font-semibold text-ember" aria-hidden>
            {activeCount}
          </span>
        )}
        <ChevronDown size={18} aria-hidden className={cn("text-foreground-dim transition-transform duration-200", open && "rotate-180")} />
      </button>
      <div id={panelId} hidden={!open} className="flex flex-col pb-2">
        {children}
      </div>
    </div>
  );
}

function SheetCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 text-base text-foreground-muted">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 shrink-0 rounded border-surface-border bg-surface-1 text-ember accent-ember focus-visible:outline-2 focus-visible:outline-ember"
      />
      {label}
    </label>
  );
}
