import type { ResolvedLine } from "./catalog-resolver";
import { decideShipping, STANDARD_SHIPPING_FEE_THB, UNKNOWN_VISITOR, type ShippingHistory, type ShippingRule } from "./shipping-rules";

/**
 * Totals math — docs/BUSINESS_SOURCE_OF_TRUTH.md §10. The shipping fee comes from the tiers in shipping-rules.ts (owner
 * 29/10: 50 THB, 35 THB, or 0 by the 800 rule / the members' once-a-month 300 rule). Pure functions, no I/O, so they're cheap to
 * unit-test (see pricing-contract-test.ts) and safe to call from both cart display and checkout submission.
 * Never accept a client-submitted subtotal/shipping/total — only ever compute them here from
 * server-resolved lines.
 */
/** The full rate before any tier — also the shipping price the warehouse push and the JSON-LD quote. */
export const FLAT_SHIPPING_FEE_THB = STANDARD_SHIPPING_FEE_THB;

export interface PricedLine {
  productSlug: string;
  variantId: string | null;
  displayName: string;
  variantLabel: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderTotals {
  lines: PricedLine[];
  subtotal: number;
  shippingFee: number;
  /** Which tier set `shippingFee` — shown to the customer before paying and stored on the order (migration 0022). */
  shippingRule: ShippingRule;
  total: number;
}

export function priceLine(line: ResolvedLine, quantity: number): PricedLine {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error(`Invalid quantity ${quantity} for "${line.productSlug}" — must be a positive integer.`);
  }
  return {
    productSlug: line.productSlug,
    variantId: line.variantId,
    displayName: line.displayName,
    variantLabel: line.variantLabel,
    unitPrice: line.unitPrice,
    quantity,
    lineTotal: line.unitPrice * quantity,
  };
}

/** `history` = what the server knows about the visitor (shipping-rules.ts `loadShippingHistory`). A visitor nobody can
 *  identify yet is priced as a newcomer; the review step prices again once the phone and address are known. */
export function computeOrderTotals(lines: PricedLine[], history: ShippingHistory = UNKNOWN_VISITOR): OrderTotals {
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const { rule, fee } = decideShipping(subtotal, history);
  return { lines, subtotal, shippingFee: fee, shippingRule: rule, total: subtotal + fee };
}
