import "server-only";
import { getDb } from "@/lib/db/client";
import { readSwitches } from "@/lib/commerce/shop-switches";
import { lookupFrom, quantityLookupFrom, type LiveLookup, type LiveQuantityLookup, type LiveReport } from "@/lib/stock/live-rules";

/**
 * The server side of live stock (live-rules.ts): Shipnity's last number per code, read from woo_stock_reports and kept in
 * memory for a few seconds so a busy product page or cart does not read the table on every request. Never throws — a
 * failed read means "no live answer", and the build-time stock stays in force.
 */

const TTL_MS = 10_000;
let cache: { at: number; reports: Map<string, LiveReport> } | null = null;

function reports(): Map<string, LiveReport> {
  // Never touch the database while `next build` prerenders: Render's build has no data disk.
  if (process.env.NEXT_PHASE === "phase-production-build") return new Map();
  if (cache && Date.now() - cache.at < TTL_MS) return cache.reports;
  try {
    const rows = getDb().prepare("SELECT sku, quantity, stock_status FROM woo_stock_reports").all() as {
      sku: string;
      quantity: number | null;
      stock_status: string | null;
    }[];
    cache = { at: Date.now(), reports: new Map(rows.map((r) => [r.sku, { quantity: r.quantity, stockStatus: r.stock_status }])) };
  } catch (err) {
    console.error(`[stock] live read failed — build-time stock stays: ${err instanceof Error ? err.message : String(err)}`);
    cache = { at: Date.now(), reports: cache?.reports ?? new Map() };
  }
  return cache.reports;
}

/** Whether the warehouse has reported at all — false during `next build` (no data disk) and on a fresh data dir. Pages that
 *  SORT or SELECT by stock on the server use the live answer only when this is true: the build's own stock is the git
 *  snapshot (WAREHOUSE_STOCK_READ_ON), which can be weeks old, so a build keeps the editorial order instead and the next
 *  regeneration (ISR) brings the live order (Friday's inventory 10/11, owner "ตามแนะนำ"). */
export function liveStockReady(): boolean {
  return reports().size > 0;
}

/** The live lookup for the cart, checkout and the stock API. */
export function liveLookup(): LiveLookup {
  const base = lookupFrom(reports());
  const { hidden } = readSwitches();
  // A hidden product (the owner's switch) cannot be bought from an open tab either: to the cart it is simply out of stock.
  if (hidden.length === 0) return base;
  return (slug, optionId, optionName) => (hidden.includes(slug) ? "out" : base(slug, optionId, optionName));
}

/** The live count per option for the cart's cap (owner 28/10 "Cap it") — same cached read as liveLookup. */
export function liveQuantityLookup(): LiveQuantityLookup {
  return quantityLookupFrom(reports());
}
