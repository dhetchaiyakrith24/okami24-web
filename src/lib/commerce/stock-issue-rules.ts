/**
 * Out of stock after payment (cart UX batch E, owner 24/10; BSOT §9 owner exception 22/10) — the pure rules, no I/O, so
 * stock-issue-contract-test.ts can pin them. The DB side is stock-issues.ts.
 *
 * Flow: staff mark the order's lines that are out → the customer's order page offers (a) a swap to an in-stock item at
 * the SAME unit price (BSOT §9: "another item at the same price") or (b) a refund to PromptPay → staff carry it out by
 * hand and record it (swap applied to the order lines, or refunded + the transfer reference → the order is cancelled).
 */
import type { OrderStatus } from "./order-status";
import { normalizePhone } from "./phone";

/** Paid but not shipped — the only statuses where "out of stock after payment" applies. An unpaid order that turns out
 *  to be out is simply cancelled (no money moved); a shipped one is past this point. */
export const STOCK_ISSUE_STATUSES: readonly OrderStatus[] = ["payment_submitted", "awaiting_verification", "approved", "processing"];

export function canOpenStockIssue(status: OrderStatus): boolean {
  return STOCK_ISSUE_STATUSES.includes(status);
}

export type StockIssueChoice = "swap" | "refund";
export type StockIssueResolution = "swapped" | "refunded";

/** Where an issue stands, from the customer's side. */
export type StockIssueStage = "waiting-choice" | "chosen" | "resolved";

export function stockIssueStage(issue: { choice: StockIssueChoice | null; resolution: StockIssueResolution | null }): StockIssueStage {
  if (issue.resolution) return "resolved";
  return issue.choice ? "chosen" : "waiting-choice";
}

/**
 * The PromptPay number a refund goes to: a Thai mobile number only (10 digits, 06/08/09). Owner 24/10: no full bank
 * account numbers stored — and a citizen ID (the other PromptPay key) is not accepted either, so the site never holds one.
 */
export function cleanPromptPayPhone(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  return normalizePhone(raw.slice(0, 40));
}

/** "0812345678" → "xxx-xxx-5678" — how the order page names the number it will refund to (the full number stays on the
 *  staff page). */
export function maskPhone(phone: string): string {
  return `xxx-xxx-${phone.slice(-4)}`;
}

/** The transfer reference staff type when the refund is done: letters, digits, dashes and spaces, 4–60 long. */
export function cleanRefundRef(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const t = raw.trim().replace(/\s+/g, " ");
  return /^[A-Za-z0-9 -]{4,60}$/.test(t) ? t : null;
}

export interface SwapPick {
  itemId: number;
  productSlug: string;
  variantId: string | null;
}

/** "slug" or "slug::variantId" — the value of one option in the swap picker. */
export function encodeSwapValue(productSlug: string, variantId: string | null): string {
  return variantId === null ? productSlug : `${productSlug}::${variantId}`;
}

export function decodeSwapValue(raw: unknown): { productSlug: string; variantId: string | null } | null {
  if (typeof raw !== "string" || raw.length === 0 || raw.length > 200) return null;
  const [productSlug, variantId, extra] = raw.split("::");
  if (!productSlug || extra !== undefined || !/^[a-z0-9-]+$/.test(productSlug)) return null;
  return { productSlug, variantId: variantId === undefined || variantId === "" ? null : variantId };
}

/** Parse the stored swap list, dropping anything malformed (a bad row must never apply a half-read swap). */
export function parseSwapJson(raw: string | null): SwapPick[] | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return null;
    const picks: SwapPick[] = [];
    for (const v of value) {
      if (!v || typeof v !== "object") return null;
      const { itemId, productSlug, variantId } = v as Record<string, unknown>;
      if (typeof itemId !== "number" || typeof productSlug !== "string" || !(variantId === null || typeof variantId === "string")) return null;
      picks.push({ itemId, productSlug, variantId });
    }
    return picks;
  } catch {
    return null;
  }
}

/**
 * What a refund returns: the lines that are out (unit price × quantity). The rest of the order still ships, and the shipping
 * fee is kept — unless every line is out, then nothing ships and the whole paid total goes back (the order is cancelled).
 * Friday 24/10 (reversible): BSOT §9 offers "a refund" for the item that is out, not for the items the shop can send.
 */
export function refundAmount(
  outLines: { lineTotal: number }[],
  order: { total: number; lineCount: number }
): { amount: number; wholeOrder: boolean } {
  const wholeOrder = outLines.length >= order.lineCount;
  return { amount: wholeOrder ? order.total : outLines.reduce((s, l) => s + l.lineTotal, 0), wholeOrder };
}

/** One product in the swap picker: its in-stock options at the same unit price (value = encodeSwapValue). */
export interface SwapGroup {
  productSlug: string;
  productName: string;
  options: { value: string; label: string }[];
}

/** What the customer's order page gets (no full phone numbers, no staff note). */
export interface StockIssueView {
  stage: StockIssueStage;
  choice: StockIssueChoice | null;
  resolution: StockIssueResolution | null;
  outLines: { itemId: number; name: string; variantLabel: string | null; quantity: number }[];
  refundAmount: number;
  wholeOrder: boolean;
  /** The phone the order was placed with, masked — the one-tap refund target. */
  ownPhoneMasked: string | null;
  /** The number the customer chose for the refund, masked. */
  refundPhoneMasked: string | null;
  /** Only while the customer still has to choose: the swap options for each out line, by order-line id. */
  swapGroups: Record<number, SwapGroup[]>;
}

/** "12,15" ↔ [12, 15] — the order lines staff marked out. */
export function parseItemIds(raw: string): number[] {
  return raw
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isInteger(n) && n > 0);
}
