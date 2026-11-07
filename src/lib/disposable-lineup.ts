import { brands } from "@/data/brands";
import { getLegacyApprovedPrice } from "@/data/shipnity-seed/legacy-price-approvals";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import { isBestSeller } from "@/data/sales-badges";
import { byPuffsThenPrice, spread } from "@/lib/disposable-chooser";
import { legacyCardStock, publishedCardStock } from "@/lib/stock/card-stock";
import { verifiedRows } from "@/lib/verified-specs";
import type { Product, Specification } from "@/types/catalog";

/**
 * Round "disposable pod" (05/11): one row per disposable on the page, built on the server so only this page's rows reach
 * the browser (LESSONS 37). Every number is read from the product's VERIFIED spec rows and every price from the catalog,
 * never typed; a model with no verified row for a figure leaves it null and the page shows it empty.
 */
export interface LineupRow {
  slug: string;
  name: string;
  /** A brand with its own page; null for a model the catalog lists under no brand. */
  brand: { name: string; slug: string } | null;
  price: number | null;
  /** The top figure of the verified puffs row. */
  puffs: number | null;
  /** The row reads "12,000+", not "up to". */
  puffsPlus: boolean;
  /** E-liquid in mL, the first figure of the row (a two-tank model's row states the total first). */
  capacityMl: number | null;
  batteryMah: number | null;
  bestSeller: boolean;
  /** Listed on the page, kept out of every pick (the lookalike, HANDOFF §18). */
  listOnly: boolean;
  /** A visitor can buy it, by the build's stock. The chooser lays the live answer over this. */
  inStock: boolean;
}

const LIST_ONLY: ReadonlySet<string> = new Set(["marbo-10k-clone"]);

function firstNumber(value: string | undefined, re: RegExp): number | null {
  const m = value ? re.exec(value) : null;
  return m ? Number(m[1].replace(/,/g, "")) : null;
}

const PUFFS = /(\d{1,3}(?:,\d{3})+|\d{4,})/;
const CAPACITY = /(\d+(?:\.\d+)?)\s*mL/i;
const BATTERY = /([\d,]+)\s*mAh/i;

function row(
  slug: string,
  name: string,
  brandId: string | null | undefined,
  price: number | null | undefined,
  specifications: readonly Pick<Specification, "key" | "value" | "sourceStatus">[],
  inStock: boolean,
): LineupRow {
  const rows = verifiedRows(specifications);
  const v = (key: string) => rows.find((r) => r.key === key)?.value;
  const brand = brandId ? brands.find((b) => b.id === brandId) : undefined;
  return {
    slug,
    name,
    brand: brand ? { name: brand.name, slug: brand.slug } : null,
    price: price ?? null,
    puffs: firstNumber(v("puffs"), PUFFS),
    puffsPlus: /\+\s*$/.test(v("puffs") ?? ""),
    capacityMl: firstNumber(v("capacity"), CAPACITY),
    batteryMah: firstNumber(v("battery"), BATTERY),
    bestSeller: isBestSeller(slug),
    listOnly: LIST_ONLY.has(slug),
    inStock,
  };
}

/** "MOOOD Monster 14K Puffs" beside a puffs figure says it twice; the catalog name itself stays as it is. */
const shortName = (name: string) => name.replace(/ +Puffs$/i, "");

export function disposableLineup(products: readonly Product[], published: readonly StorefrontProductView[]): LineupRow[] {
  return [
    ...products.map((p) => row(p.slug, shortName(p.displayName), p.brandId, getLegacyApprovedPrice(p.slug), p.specifications, legacyCardStock(p).inStock)),
    ...published.map((p) => row(p.slug, shortName(p.displayName), p.brandId, p.sellingPrice, p.specifications, publishedCardStock(p).inStock)),
  ];
}

/** The table of every model: puffs high to low, then price; no verified puffs after them by price; the lookalike last, so
 *  a low price never lifts it into a place that reads as a pick. */
export function disposableCompareRows(lineup: readonly LineupRow[]): LineupRow[] {
  return [...lineup].sort((x, y) => Number(x.listOnly) - Number(y.listOnly) || byPuffsThenPrice(x, y));
}

/** One row per brand that has a brand page, A–Z so position never reads as a ranking. */
export interface BrandRow {
  name: string;
  slug: string;
  models: number;
  fromPrice: number | null;
  topPuffs: number | null;
  topPuffsPlus: boolean;
  bestSeller: boolean;
}

export function disposableBrands(lineup: readonly LineupRow[]): BrandRow[] {
  const groups = new Map<string, { brand: NonNullable<LineupRow["brand"]>; rows: LineupRow[] }>();
  for (const r of lineup) {
    if (!r.brand || r.listOnly) continue;
    const g = groups.get(r.brand.slug) ?? { brand: r.brand, rows: [] };
    g.rows.push(r);
    groups.set(r.brand.slug, g);
  }
  return [...groups.values()]
    .map(({ brand, rows }) => {
      const topPuffs = spread(rows.map((r) => r.puffs)).hi;
      return {
        name: brand.name,
        slug: brand.slug,
        models: rows.length,
        fromPrice: spread(rows.map((r) => r.price)).lo,
        topPuffs,
        topPuffsPlus: rows.some((r) => r.puffs === topPuffs && r.puffsPlus),
        bestSeller: rows.some((r) => r.bestSeller),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, "en"));
}
