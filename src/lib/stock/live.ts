import "server-only";
import { getDb } from "@/lib/db/client";
import { lookupFrom, type LiveLookup, type LiveReport } from "@/lib/stock/live-rules";

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

/** The live lookup for the cart, checkout and the stock API. */
export function liveLookup(): LiveLookup {
  return lookupFrom(reports());
}
