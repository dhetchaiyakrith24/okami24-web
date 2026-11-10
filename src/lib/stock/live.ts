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
// ONE cache per server process, on globalThis: Next bundles a route handler and a page separately, and each bundle got its
// own copy of a module-level `let` — the stock route cleared its copy while the page re-rendered from the other one with
// numbers 1 s old, and that render then stood for 3 hours (T2-05 live-route test, 10/11).
type Cache = { at: number; reports: Map<string, LiveReport> } | null;
const shared = globalThis as typeof globalThis & { __okami24LiveStock?: { cache: Cache } };
const store = (shared.__okami24LiveStock ??= { cache: null });

function reports(): Map<string, LiveReport> {
  // Never touch the database while `next build` prerenders: Render's build has no data disk.
  if (process.env.NEXT_PHASE === "phase-production-build") return new Map();
  const cache = store.cache;
  if (cache && Date.now() - cache.at < TTL_MS) return cache.reports;
  try {
    const rows = getDb().prepare("SELECT sku, quantity, stock_status FROM woo_stock_reports").all() as {
      sku: string;
      quantity: number | null;
      stock_status: string | null;
    }[];
    store.cache = { at: Date.now(), reports: new Map(rows.map((r) => [r.sku, { quantity: r.quantity, stockStatus: r.stock_status }])) };
  } catch (err) {
    console.error(`[stock] live read failed — build-time stock stays: ${err instanceof Error ? err.message : String(err)}`);
    store.cache = { at: Date.now(), reports: cache?.reports ?? new Map() };
  }
  return store.cache!.reports;
}

/** Whether the warehouse has reported at all — false during `next build` (no data disk) and on a fresh data dir. Pages that
 *  SORT or SELECT by stock on the server use the live answer only when this is true: the build's own stock is the git
 *  snapshot (WAREHOUSE_STOCK_READ_ON), which can be weeks old, so a build keeps the editorial order instead and the next
 *  regeneration (ISR) brings the live order (Friday's inventory 10/11, owner "ตามแนะนำ"). */
export function liveStockReady(): boolean {
  return reports().size > 0;
}

/** Drop the cached table, so the next read sees a push that was just saved (the stock route calls this before it marks
 *  pages stale — a page re-rendered inside the 10 s window would otherwise keep the old stock for 3 hours, T2-05). */
export function forgetLiveStock(): void {
  store.cache = null;
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
