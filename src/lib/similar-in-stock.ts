import { kindCategoryId } from "@/data/categories";
import { getProduct } from "@/data/products";
import { IN_STOCK_ALTERNATIVES, NEVER_SUGGEST } from "@/data/similar-models";
import { HOME_TYPE_SECTIONS } from "@/data/home-sections";
import { getPublishedProductBySlug } from "@/data/shipnity-seed/storefront-preview-read-model";
import { allCatalogItems, getCatalogItem, type CatalogItem } from "@/lib/catalog-index";
import { inStockEntryKeys } from "@/lib/in-stock";
import type { Product } from "@/types/catalog";
import { taglineThFor } from "@/lib/card-taglines";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";

export interface SimilarItem {
  slug: string;
  legacy: Product | null;
  /** The legacy card's Thai tagline (card-taglines.ts). */
  taglineTh?: string;
  published: StorefrontProductView | null;
}

/** Cards sent to the page. More than it shows (4): the page drops any the live stock says sold out since the build. */
const CANDIDATES = 6;

/** A device the warehouse cannot fill is offered the other kinds of device, nearest first. Parts and sticks fit one family,
 *  so they get only their hand-picked list and their own make. */
const NEXT_KINDS: Record<string, string[]> = {
  "pod-systems": ["pod-systems", "switch-pods", "disposables"],
  "switch-pods": ["switch-pods", "disposables", "pod-systems"],
  disposables: ["disposables", "switch-pods", "pod-systems"],
};

const LEAD = HOME_TYPE_SECTIONS.flatMap((s) => s.first);
const leadRank = (slug: string) => {
  const i = LEAD.indexOf(slug);
  return i < 0 ? Infinity : i;
};
const byLead = (a: CatalogItem, b: CatalogItem) => leadRank(a.slug) - leadRank(b.slug) || a.name.localeCompare(b.name);

function buyableToday(slug: string): boolean {
  const legacy = getProduct(slug);
  if (legacy) return inStockEntryKeys([legacy], []).length > 0;
  const published = getPublishedProductBySlug(slug);
  return published ? inStockEntryKeys([], [published]).length > 0 : false;
}

/** The models to offer on `slug`'s page, closest first, every one with a price and stock at build time. Empty = nothing to
 *  offer, and the page then shows no block. Stock can only be read at build here; the page checks it again live. */
export function similarInStock(slug: string): SimilarItem[] {
  const own = getCatalogItem(slug);
  if (!own) return [];
  const usable = (i: CatalogItem | undefined): i is CatalogItem =>
    i !== undefined && i.slug !== slug && i.sellingPrice !== null && !NEVER_SUGGEST.has(i.slug) && buyableToday(i.slug);

  const catalog = allCatalogItems().filter(usable);
  const kind = kindCategoryId(own);
  const picked = (IN_STOCK_ALTERNATIVES[slug] ?? []).map((s) => catalog.find((i) => i.slug === s)).filter(usable);
  const sameMake = catalog.filter((i) => i.brandId === own.brandId && kindCategoryId(i) === kind).sort(byLead);
  const otherMakes = (NEXT_KINDS[kind] ?? []).flatMap((k) => catalog.filter((i) => kindCategoryId(i) === k).sort(byLead));

  const seen = new Set<string>();
  return [...picked, ...sameMake, ...otherMakes]
    .filter((i) => !seen.has(i.slug) && seen.add(i.slug))
    .slice(0, CANDIDATES)
    .map((i) => ({ slug: i.slug, legacy: getProduct(i.slug) ?? null, taglineTh: taglineThFor(i.slug), published: getPublishedProductBySlug(i.slug) ?? null }));
}
