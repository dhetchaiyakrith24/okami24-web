import type { WooProduct } from "@/lib/woo/catalog";
import type { StockReportView } from "@/lib/woo/api";

/**
 * Shipnity's stock numbers vs what the site sells today (Shipnity link step 3, owner 28/10 "ตรวจทีว่าตรงไหม"). The site's
 * state is the catalog's own (the hourly order-entry read + the owner's sold-out list, applied at build); Shipnity's is the
 * last number it pushed. Pure — /staff/shipnity shows the result, the contract test holds the rules.
 */

export interface StockRow {
  sku: string;
  name: string;
  siteInStock: boolean;
  shipnity: number | null;
}

export interface StockCompare {
  total: number;
  reported: number;
  agree: number;
  /** Shipnity has none (0 or less) but the site still sells it — the dangerous side. */
  siteSellsButEmpty: StockRow[];
  /** Shipnity has some but the site shows sold out (maybe the owner's own sold-out list). */
  siteOutButStocked: StockRow[];
  /** Codes Shipnity never sent a number for. */
  missing: StockRow[];
}

export function compareStock(catalog: WooProduct[], reports: Map<string, StockReportView>): StockCompare {
  const rows: StockRow[] = catalog.flatMap((p) =>
    p.variations.length > 0
      ? p.variations.map((v) => ({ sku: v.sku, name: `${p.name} · ${v.optionName}`, siteInStock: v.inStock, shipnity: null as number | null }))
      : [{ sku: p.sku, name: p.name, siteInStock: p.inStock, shipnity: null as number | null }]
  );
  const out: StockCompare = { total: rows.length, reported: 0, agree: 0, siteSellsButEmpty: [], siteOutButStocked: [], missing: [] };
  for (const r of rows) {
    const rep = reports.get(r.sku);
    const qty = rep?.quantity ?? (rep?.stockStatus === "outofstock" ? 0 : rep?.stockStatus === "instock" ? 1 : null);
    if (rep === undefined || qty === null) {
      out.missing.push(r);
      continue;
    }
    out.reported++;
    const row = { ...r, shipnity: qty };
    const shipHas = qty > 0;
    if (shipHas === r.siteInStock) out.agree++;
    else if (r.siteInStock) out.siteSellsButEmpty.push(row);
    else out.siteOutButStocked.push(row);
  }
  return out;
}
