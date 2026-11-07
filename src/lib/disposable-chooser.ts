import type { LineupRow } from "@/lib/disposable-lineup";
import type { CardStockChanges } from "@/lib/stock/card-stock";

/** The chooser's grouping: no data import, safe in client components (LESSONS 37). Rows come from disposable-lineup.ts. */

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

export function spread(values: readonly (number | null)[]): { lo: number | null; hi: number | null } {
  const v = values.filter((n): n is number => n !== null);
  return v.length ? { lo: Math.min(...v), hi: Math.max(...v) } : { lo: null, hi: null };
}

export const byPuffsThenPrice = (x: LineupRow, y: LineupRow) => (y.puffs ?? -1) - (x.puffs ?? -1) || (x.price ?? 0) - (y.price ?? 0);
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

/** The chooser picks only what a visitor can buy (owner 07/11, the rule of the cart's suggestions): the build's stock, with the /api/stock answer over it. The table of every model keeps them all. */
export function buyableRows(rows: readonly LineupRow[], changes: CardStockChanges | null): LineupRow[] {
  return rows.filter((r) => changes?.[r.slug]?.s ?? r.inStock);
}
