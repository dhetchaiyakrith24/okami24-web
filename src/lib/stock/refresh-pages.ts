import { getBrand } from "@/data/brands";
import { getCategory } from "@/data/categories";
import { getProduct } from "@/data/products";
import { getPublishedProductBySlug } from "@/data/shipnity-seed/storefront-preview-read-model";
import { SHIPNITY_SKU_MAP } from "@/data/stock/sku-map";
import type { LiveReport } from "@/lib/stock/live-rules";

/**
 * Which prerendered pages a warehouse stock push makes stale (outside test T2-05, 10/11). The home page, /products, the
 * brand pages and the product pages are ISR with a 3-hour window (`revalidate = 10800`), so a model that sold out or came
 * back kept its old card order, its "พร้อมส่ง" place and its first paint for up to 3 hours. The stock route
 * (src/app/wp-json) asks this after Shipnity's writes and marks only these paths stale; each one re-renders on its next visit.
 *
 * Only a FLIP counts: a code that goes from selling to sold out, from sold out to selling, or reports for the first time.
 * "7 left → 6 left" changes no prerendered page (the counts on a product page come from the live stock API after load),
 * so a busy day of pushes does not keep re-rendering the whole shop on a 0.5-CPU box.
 * Same reading of a report as live-rules.ts: the number, else the Woo stock status; no answer = no state.
 */

export interface StockWrite {
  sku: string;
  quantity: number | null;
  stockStatus: string | null;
}

type State = "in" | "out" | null;

const stateOf = (r: LiveReport | undefined): State => {
  if (!r) return null;
  const qty = r.quantity ?? (r.stockStatus === "instock" ? 1 : r.stockStatus === "outofstock" ? 0 : null);
  return qty === null ? null : qty > 0 ? "in" : "out";
};

/** Warehouse code → the product slugs that read it (a product's own code and every option's code). */
let slugsByCode: Map<string, string[]> | null = null;
function slugsFor(code: string): string[] {
  if (!slugsByCode) {
    slugsByCode = new Map();
    for (const [slug, entry] of Object.entries(SHIPNITY_SKU_MAP)) {
      const codes = [entry.product, ...Object.values(entry.options ?? {})].filter((c): c is string => typeof c === "string" && c !== "check");
      for (const c of new Set(codes)) slugsByCode.set(c, [...(slugsByCode.get(c) ?? []), slug]);
    }
  }
  return slugsByCode.get(code) ?? [];
}

/** The product slugs whose stock state the writes flip, given the table as it was before them. Writes merge the way
 *  saveStockReport does (a missing number or status keeps the old one). */
export function flippedSlugs(before: ReadonlyMap<string, LiveReport>, writes: readonly StockWrite[]): string[] {
  const now = new Map(before);
  for (const w of writes) {
    const old = now.get(w.sku);
    now.set(w.sku, { quantity: w.quantity ?? old?.quantity ?? null, stockStatus: w.stockStatus ?? old?.stockStatus ?? null });
  }
  const out = new Set<string>();
  for (const sku of new Set(writes.map((w) => w.sku))) {
    if (stateOf(before.get(sku)) === stateOf(now.get(sku))) continue;
    for (const slug of slugsFor(sku)) out.add(slug);
  }
  return [...out].sort();
}

/** The site paths to mark stale for those slugs: each product page, its category and brand pages, the home page and
 *  /products. Empty = nothing flipped (no path at all). A slug the storefront no longer shows still marks the shared pages. */
export function pagesToRefresh(slugs: readonly string[]): string[] {
  if (slugs.length === 0) return [];
  const paths = new Set<string>(["/", "/products"]);
  for (const slug of slugs) {
    const legacy = getProduct(slug);
    const published = legacy ? undefined : getPublishedProductBySlug(slug);
    const p = legacy ?? published;
    if (!p) continue;
    paths.add(`/products/${slug}`);
    const category = getCategory(p.categoryId);
    if (category) paths.add(`/products/${category.slug}`);
    const brand = p.brandId ? getBrand(p.brandId) : undefined;
    if (brand) paths.add(`/brands/${brand.slug}`);
  }
  return [...paths].sort();
}
