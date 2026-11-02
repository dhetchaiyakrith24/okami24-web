import { LABEL_PRICES } from "@/data/label-prices";

/**
 * The struck-through "label" price + "−N%" badge (owner 02/11 + 03/11, BSOT §5 "2026-11-02 — struck-through label price"):
 * a higher label 10–20 % above the selling price, shown above the real price on cards and product pages, as a sales tactic —
 * not a real discount. The money never changes: the cart, order totals, LINE/emails and the JSON-LD Offer read the selling
 * price only and never import this file or label-prices.ts (src/data/label-prices-contract-test.ts holds that line).
 *
 * SALE_LABEL_ON is the one switch for the whole site: false = no label and no badge anywhere, nothing else changes.
 */
export const SALE_LABEL_ON = true;

export interface SaleLabel {
  /** The struck-through price. */
  label: number;
  /** The badge number: how far the selling price sits below the label, rounded DOWN so the badge never says more than the
   *  two printed prices show (฿1,090 under ฿1,290 = 15.5 % → "−15%"). */
  pct: number;
}

/**
 * The label for one product, or null. Null when the switch is off, the product is not on the approved table, its selling
 * price is no longer the price the label was approved against (a later price change hides the label until the table is
 * redone — a label is never shown against a price the owner did not see), or every option is sold out (a sale badge on
 * something nobody can buy is noise — same rule as "มาใหม่", src/data/sales-badges.ts).
 */
export function saleLabel(slug: string, sellingPrice: number | null | undefined, soldOut = false): SaleLabel | null {
  if (!SALE_LABEL_ON || soldOut || sellingPrice == null) return null;
  const row = LABEL_PRICES[slug];
  if (!row || row.price !== sellingPrice || row.label <= sellingPrice) return null;
  return { label: row.label, pct: Math.floor(((row.label - sellingPrice) / row.label) * 100) };
}
