import type { ResolvedLine } from "./catalog-resolver";

/**
 * Shipping/totals math — verbatim from docs/BUSINESS_SOURCE_OF_TRUTH.md §10: flat 60 THB, free at
 * a 500 THB subtotal. Pure functions, no I/O, so they're cheap to unit-test (see
 * pricing-contract-test.ts) and safe to call from both cart display and checkout submission.
 * Never accept a client-submitted subtotal/shipping/total — only ever compute them here from
 * server-resolved lines.
 */
export const FLAT_SHIPPING_FEE_THB = 60;
export const FREE_SHIPPING_THRESHOLD_THB = 500;

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

export function computeOrderTotals(lines: PricedLine[]): OrderTotals {
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD_THB ? 0 : FLAT_SHIPPING_FEE_THB;
  return { lines, subtotal, shippingFee, total: subtotal + shippingFee };
}
