import { isListedSoldOut } from "@/data/stock/apply-sold-out";
import { SHIPNITY_SKU_MAP } from "@/data/stock/sku-map";

/**
 * Live stock from the warehouse's Shipnity (Shipnity link step 4, owner 28/10 "ทำงานหลักก่อน"). Shipnity pushes a number per
 * warehouse code into woo_stock_reports (src/lib/woo); this decides what that number means for one option on the site.
 * Pure — the server reads the table (src/lib/stock/live.ts) and passes it in; the contract test holds the rules.
 *
 *   - the owner's sold-out list always wins and only ever marks sold out (sold-out.ts — BSOT §6);
 *   - an option with no warehouse code (sku-map `null`) or a code still to check ("check") gets no live answer — it keeps
 *     what the build says (null = "สินค้าหมด", as before);
 *   - a code Shipnity reported: number > 0 = sells · 0 or less = "สินค้าหมด" (BSOT §6 "stock > 0: available");
 *   - a code Shipnity never reported: no live answer — the build-time warehouse read stays the fallback.
 * `optionId` undefined = a product without options (its own code).
 */

export type LiveState = "in" | "out";

export interface LiveReport {
  quantity: number | null;
  stockStatus: string | null;
}

export function codeFor(slug: string, optionId?: string): string | null {
  const entry = SHIPNITY_SKU_MAP[slug];
  if (!entry) return null;
  const v = optionId === undefined ? entry.product : entry.options?.[optionId];
  return typeof v === "string" && v !== "check" ? v : null;
}

export function liveState(
  reports: ReadonlyMap<string, LiveReport>,
  slug: string,
  optionId?: string,
  optionName?: string
): LiveState | null {
  if (optionId !== undefined && isListedSoldOut(slug, optionName ?? optionId, optionId)) return "out";
  const code = codeFor(slug, optionId);
  if (!code) return null;
  const r = reports.get(code);
  if (!r) return null;
  const qty = r.quantity ?? (r.stockStatus === "instock" ? 1 : r.stockStatus === "outofstock" ? 0 : null);
  if (qty === null) return null;
  return qty > 0 ? "in" : "out";
}

/** Looks up one option's live state; the server builds it from the table, tests from a Map. */
export type LiveLookup = (slug: string, optionId?: string, optionName?: string) => LiveState | null;

export function lookupFrom(reports: ReadonlyMap<string, LiveReport>): LiveLookup {
  return (slug, optionId, optionName) => liveState(reports, slug, optionId, optionName);
}
