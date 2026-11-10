/**
 * Changing a keyed LINE order before it goes to the warehouse (LINE_ORDERS_GAPS.md #3, owner 10/11) — pure, so the contract
 * test runs it under plain tsx. line-order-edit.ts does the database.
 *
 * THE CASE: the customer paid, then asks for more in the chat a few minutes later and sends a second slip. Keying a second
 * order would charge shipping twice and make the warehouse pack two parcels, so the admin adds the items to the SAME order:
 * one order, one shipping fee worked out again on the whole order (the web's rule), and the second slip linked to it (an
 * order may carry several slips; each is linked once, so sales count the money once, as the order).
 *
 * WHEN: only while the order is waiting for the money or paid (awaiting_verification / approved), not yet sent to the
 * warehouse, with no out-of-stock problem on it. Later = tell the warehouse admin (the page says so).
 *
 * WHAT MAY CHANGE: once money is in (a linked slip, or the payment confirmed) lines may only be ADDED or RAISED — taking
 * something off would owe the customer money, which is the out-of-stock box's refund path or a cancel. Before any money is
 * in, the admin may fix the list freely (a keying mistake).
 *
 * THE MONEY: a line already on the order keeps the price it was sold at — raising its quantity adds units at that same
 * price (one row carries one price, and the customer agreed to it); a NEW line takes the catalogue price now. Every added
 * unit is still stock-checked by the cart's resolver (sellable / sold out — the same rule as a new LINE order). The
 * difference (new total − old total) is what the customer transfers. A picked slip must be loose and carry exactly that
 * difference — or, when no slip is linked yet, exactly the new total. No slip: an order still waiting stays waiting (staff
 * confirm by hand, as today); a paid order needs the admin to tick that the difference reached the shop's account, the same
 * hand check as pressing "ยืนยันยอดเงินแล้ว" on an unchecked slip.
 */

export type EditableStatus = "awaiting_verification" | "approved";

export const EDITABLE_STATUSES: readonly string[] = ["awaiting_verification", "approved"];

export interface EditState {
  status: string;
  channel: "web" | "line";
  /** Sent to the warehouse (a woo_order_sends row that did not fail) — then Shipnity already has the old list. */
  sentToWarehouse: boolean;
  /** An out-of-stock problem was ever opened on it (its lines are tied to item rows). */
  hasStockIssue: boolean;
}

export type NotEditable = "not-line" | "status" | "sent" | "stock";

/** Can the items of this order still be changed here? null = yes, else why not. */
export function itemsNotEditable(s: EditState): NotEditable | null {
  if (s.channel !== "line") return "not-line";
  if (s.sentToWarehouse) return "sent";
  if (!EDITABLE_STATUSES.includes(s.status)) return "status";
  if (s.hasStockIssue) return "stock";
  return null;
}

export interface QtyLine {
  slug: string;
  variantId: string | null;
  quantity: number;
}

const key = (l: { slug: string; variantId: string | null }) => `${l.slug}|${l.variantId ?? ""}`;

/** Every old line is still there with at least its old quantity (money in = add only). */
export function onlyAdds(oldLines: QtyLine[], newLines: QtyLine[]): boolean {
  const next = new Map(newLines.map((l) => [key(l), l.quantity]));
  return oldLines.every((l) => (next.get(key(l)) ?? 0) >= l.quantity);
}

/** The units added on top of the old list, per line (what needs a stock check and today's price). */
export function addedUnits(oldLines: QtyLine[], newLines: QtyLine[]): QtyLine[] {
  const before = new Map(oldLines.map((l) => [key(l), l.quantity]));
  return newLines
    .map((l) => ({ ...l, quantity: l.quantity - (before.get(key(l)) ?? 0) }))
    .filter((l) => l.quantity > 0);
}

export interface MoneyCheck {
  status: EditableStatus;
  /** Satang of the slips already linked to the order. */
  linkedSatang: number;
  oldTotal: number;
  newTotal: number;
  /** The picked slip's amount, or null for "no slip". */
  slipSatang: number | null;
  /** The admin ticked "the difference reached the shop's account" (paid order, no slip). */
  handConfirmed: boolean;
}

export type MoneyError = "no-change" | "slip-amount" | "hand-confirm";

/** Is the money side of the change right? `confirm` = the slips now cover the new total exactly on an order still waiting
 *  for the money, so the order is confirmed like a keyed order whose slip fitted. */
export function checkMoney(m: MoneyCheck): { ok: true; confirm: boolean } | { ok: false; error: MoneyError } {
  if (m.newTotal === m.oldTotal) return { ok: false, error: "no-change" };
  const diffSatang = (m.newTotal - m.oldTotal) * 100;
  if (m.slipSatang !== null) {
    const fits = (diffSatang > 0 && m.slipSatang === diffSatang) || (m.linkedSatang === 0 && m.slipSatang === m.newTotal * 100);
    if (!fits) return { ok: false, error: "slip-amount" };
  } else if (m.status === "approved" && !m.handConfirmed) {
    return { ok: false, error: "hand-confirm" };
  }
  const paid = m.linkedSatang + (m.slipSatang ?? 0);
  return { ok: true, confirm: m.status === "awaiting_verification" && paid === m.newTotal * 100 };
}
