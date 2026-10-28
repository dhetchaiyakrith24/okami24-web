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

/** `listed` = the owner's sold-out list (sold-out.ts); a test passes its own. */
export type ListedCheck = (slug: string, nameOrId: string, id?: string) => boolean;

export function liveState(
  reports: ReadonlyMap<string, LiveReport>,
  slug: string,
  optionId?: string,
  optionName?: string,
  listed: ListedCheck = isListedSoldOut
): LiveState | null {
  if (optionId !== undefined && listed(slug, optionName ?? optionId, optionId)) return "out";
  const code = codeFor(slug, optionId);
  if (!code) return null;
  const r = reports.get(code);
  if (!r) return null;
  const qty = r.quantity ?? (r.stockStatus === "instock" ? 1 : r.stockStatus === "outofstock" ? 0 : null);
  if (qty === null) return null;
  return qty > 0 ? "in" : "out";
}

/**
 * How many of one option the warehouse holds, as Shipnity last reported — the cart's cap (owner 28/10: "Cap it", so a
 * customer cannot order 2 when 1 is left). `null` = no live count (no code, never reported, or a status without a
 * number): the cart keeps its usual cap. Sold out (0) is not decided here — liveState blocks the line before any cap.
 */
export function liveQuantity(reports: ReadonlyMap<string, LiveReport>, slug: string, optionId?: string): number | null {
  const code = codeFor(slug, optionId);
  if (!code) return null;
  const q = reports.get(code)?.quantity;
  return typeof q === "number" ? Math.max(0, Math.floor(q)) : null;
}

/** Looks up one option's live count; `optionId` undefined = a product without options. */
export type LiveQuantityLookup = (slug: string, optionId?: string) => number | null;

export function quantityLookupFrom(reports: ReadonlyMap<string, LiveReport>): LiveQuantityLookup {
  return (slug, optionId) => liveQuantity(reports, slug, optionId);
}

/** Looks up one option's live state; the server builds it from the table, tests from a Map. */
export type LiveLookup = (slug: string, optionId?: string, optionName?: string) => LiveState | null;

export function lookupFrom(reports: ReadonlyMap<string, LiveReport>, listed: ListedCheck = isListedSoldOut): LiveLookup {
  return (slug, optionId, optionName) => liveState(reports, slug, optionId, optionName, listed);
}
