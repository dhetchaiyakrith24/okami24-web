/**
 * The customer card of the back office (owner list ก11, asked twice: one customer's orders, totals, contact and last order)
 * — pure, so the contract test runs it under plain tsx. customer-cards.ts reads the database and passes the rows in.
 *
 * ONE CUSTOMER = one checkout phone (the `customers` row), the same key a customer uses to find their own orders (HANDOFF §18
 * "a customer finds their orders by PHONE NUMBER ONLY"). The recipient on an order may differ; it is shown, never merged on.
 * PAID = the statuses daily sales counts (staff confirmed the money, not cancelled) — so the card and /staff/sales agree.
 * WAITING = the customer has not paid or staff have not checked the slip yet. Neither is money received.
 * LINE orders join the card once staff can key them into the web (ก11 step 3–4); until then every order here is a web order.
 * Reads only. No cost and no profit (owner 04/11: those are the owner's alone; admins open this card too).
 */
import type { OrderStatus } from "@/lib/commerce/order-status";
import { CONFIRMED_ORDER_STATUSES } from "@/lib/staff/daily-sales-rules";

export interface CardOrder {
  orderNumber: string;
  runNumber: number | null;
  status: OrderStatus;
  /** Whole baht, as stored on the order. */
  total: number;
  createdAt: string;
  itemCount: number;
  recipientName: string;
  recipientPhone: string;
  /** One line, as the warehouse text writes it. */
  address: string;
  province: string;
  trackingNumber: string | null;
}

export interface CustomerCard {
  phone: string;
  /** Newest first. */
  orders: CardOrder[];
  paidCount: number;
  /** Whole baht. */
  paidTotal: number;
  waitingCount: number;
  cancelledCount: number;
  firstOrderAt: string | null;
  lastOrder: CardOrder | null;
  /** The recipient of the newest PAID order, else of the newest order: where this customer last had a parcel sent. */
  contact: { name: string; phone: string; address: string } | null;
  /** Display names of the LINE / Google sign-ins seen on this customer's orders (BSOT §11 keeps no more than that). */
  members: { provider: string; name: string | null }[];
}

const PAID: readonly string[] = CONFIRMED_ORDER_STATUSES;
const WAITING: readonly string[] = ["pending_payment", "payment_submitted", "awaiting_verification"];

export function isPaid(status: OrderStatus): boolean {
  return PAID.includes(status);
}

export function customerCard(phone: string, orders: CardOrder[], members: { provider: string; name: string | null }[]): CustomerCard {
  const sorted = [...orders].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  const paid = sorted.filter((o) => isPaid(o.status));
  const contactFrom = paid[0] ?? sorted[0] ?? null;
  const seen = new Set<string>();
  return {
    phone,
    orders: sorted,
    paidCount: paid.length,
    paidTotal: paid.reduce((n, o) => n + o.total, 0),
    waitingCount: sorted.filter((o) => WAITING.includes(o.status)).length,
    cancelledCount: sorted.filter((o) => o.status === "cancelled").length,
    firstOrderAt: sorted.length > 0 ? sorted[sorted.length - 1].createdAt : null,
    lastOrder: sorted[0] ?? null,
    contact: contactFrom ? { name: contactFrom.recipientName, phone: contactFrom.recipientPhone, address: contactFrom.address } : null,
    members: members.filter((m) => {
      const key = `${m.provider}:${m.name ?? ""}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }),
  };
}

/** The search box of the list: digits match anywhere in the phone (a customer reads "081-234-5678" with dashes), anything
 *  else matches the name, ignoring case and spaces. Empty = everyone. */
export function matchesSearch(query: string, phone: string, names: readonly string[]): boolean {
  const q = query.trim().toLowerCase();
  if (q === "") return true;
  const digits = q.replace(/[\s-]/g, "");
  if (/^\d+$/.test(digits)) return phone.replace(/\D/g, "").includes(digits);
  const flat = q.replace(/\s+/g, "");
  return names.some((n) => n.toLowerCase().replace(/\s+/g, "").includes(flat));
}
