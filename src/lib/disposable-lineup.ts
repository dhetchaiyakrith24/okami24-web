import { brands } from "@/data/brands";
import { getLegacyApprovedPrice } from "@/data/shipnity-seed/legacy-price-approvals";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import { isBestSeller } from "@/data/sales-badges";
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
  };
}

/** "MOOOD Monster 14K Puffs" beside a puffs figure says it twice; the catalog name itself stays as it is. */
const shortName = (name: string) => name.replace(/ +Puffs$/i, "");

export function disposableLineup(products: readonly Product[], published: readonly StorefrontProductView[]): LineupRow[] {
  return [
    ...products.map((p) => row(p.slug, shortName(p.displayName), p.brandId, getLegacyApprovedPrice(p.slug), p.specifications)),
    ...published.map((p) => row(p.slug, shortName(p.displayName), p.brandId, p.sellingPrice, p.specifications)),
  ];
}

/** The table of every model: puffs high to low, then price; no verified puffs after them by price; the lookalike last, so
 *  a low price never lifts it into a place that reads as a pick. */
export function disposableCompareRows(lineup: readonly LineupRow[]): LineupRow[] {
  return [...lineup].sort((x, y) => Number(x.listOnly) - Number(y.listOnly) || byPuffsThenPrice(x, y));
}

/** A chooser group. `kind` + `a`/`b` pick the label template. Band edges are constants; who sits in a band and every figure
 *  shown are read from the rows, so a price change moves the model and an empty band disappears. */
export interface ChooserGroup {
  key: string;
  kind: "upFrom" | "range" | "upTo" | "exact";
  a: number;
  b: number;
  rows: LineupRow[];
  /** The other number of the group, for its closed line: prices under a puff group, puffs under a budget group. */
  lo: number | null;
  hi: number | null;
}

const PUFF_EDGES = { top: 20_000, mid: 15_000, low: 12_000 };
const PRICE_EDGES = { low: 300, mid: 350 };

function spread(values: readonly (number | null)[]): { lo: number | null; hi: number | null } {
  const v = values.filter((n): n is number => n !== null);
  return v.length ? { lo: Math.min(...v), hi: Math.max(...v) } : { lo: null, hi: null };
}

const byPuffsThenPrice = (x: LineupRow, y: LineupRow) => (y.puffs ?? -1) - (x.puffs ?? -1) || (x.price ?? 0) - (y.price ?? 0);
const byPriceThenPuffs = (x: LineupRow, y: LineupRow) => (x.price ?? 0) - (y.price ?? 0) || (y.puffs ?? -1) - (x.puffs ?? -1);

function puffGroup(key: string, rows: LineupRow[], kind: "upFrom" | "range" | "upTo"): ChooserGroup {
  const puffs = spread(rows.map((r) => r.puffs));
  const lo = puffs.lo ?? 0;
  const hi = puffs.hi ?? 0;
  const label = kind === "upFrom" ? { kind, a: PUFF_EDGES.top, b: PUFF_EDGES.top } : kind === "upTo" ? { kind, a: hi, b: hi } : { kind: lo === hi ? ("exact" as const) : kind, a: lo, b: hi };
  return { key, ...label, rows: [...rows].sort(byPuffsThenPrice), ...spread(rows.map((r) => r.price)) };
}

function priceGroup(key: string, rows: LineupRow[], kind: "upFrom" | "range" | "upTo", a: number, b: number): ChooserGroup {
  return { key, kind, a, b, rows: [...rows].sort(byPriceThenPuffs), ...spread(rows.map((r) => r.puffs)) };
}

export interface DisposableChooserData {
  minPrice: number | null;
  puffGroups: ChooserGroup[];
  budgetGroups: ChooserGroup[];
}

export function disposableChooser(lineup: readonly LineupRow[]): DisposableChooserData {
  const rows = lineup.filter((r) => !r.listOnly && r.price !== null);
  const puffed = rows.filter((r) => r.puffs !== null) as (LineupRow & { puffs: number })[];
  const price = (r: LineupRow) => r.price as number;
  const puffGroups = [
    puffGroup("puffs-top", puffed.filter((r) => r.puffs >= PUFF_EDGES.top), "upFrom"),
    puffGroup("puffs-mid", puffed.filter((r) => r.puffs >= PUFF_EDGES.mid && r.puffs < PUFF_EDGES.top), "range"),
    puffGroup("puffs-low", puffed.filter((r) => r.puffs >= PUFF_EDGES.low && r.puffs < PUFF_EDGES.mid), "range"),
    puffGroup("puffs-small", puffed.filter((r) => r.puffs < PUFF_EDGES.low), "upTo"),
  ].filter((g) => g.rows.length > 0);
  const budgetGroups = [
    priceGroup("price-low", rows.filter((r) => price(r) <= PRICE_EDGES.low), "upTo", PRICE_EDGES.low, PRICE_EDGES.low),
    priceGroup("price-mid", rows.filter((r) => price(r) > PRICE_EDGES.low && price(r) <= PRICE_EDGES.mid), "range", PRICE_EDGES.low + 1, PRICE_EDGES.mid),
    priceGroup("price-high", rows.filter((r) => price(r) > PRICE_EDGES.mid), "upFrom", PRICE_EDGES.mid + 1, PRICE_EDGES.mid + 1),
  ].filter((g) => g.rows.length > 0);
  return { minPrice: spread(rows.map((r) => r.price)).lo, puffGroups, budgetGroups };
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
