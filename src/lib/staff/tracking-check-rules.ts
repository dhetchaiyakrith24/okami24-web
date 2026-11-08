/**
 * The parcel check page of the back office (owner list ก11: "หน้าเช็คพัสดุ EMS/DHL") — pure, so the contract test runs it
 * under plain tsx. tracking-check.ts reads the orders and passes them in.
 *
 * The page reads the tracking numbers already stored on orders; it does not ask the carriers (a live status needs a Thailand
 * Post / DHL developer account — a question for the owner, 13.3 #2). Each row opens the carrier's own tracking page
 * (carriers.ts — no page takes the number in its address, so staff copy it first).
 *
 * LATE = still "shipped" (nobody marked it received) LATE_DAYS or more after it was marked shipped. EMS and DHL inside
 * Thailand normally arrive in 1–3 days [เชื่อว่า], so a parcel past that is worth a look before the customer asks.
 * Friday's call, kept in one place to tune.
 */
import type { CarrierId } from "@/lib/commerce/carriers";
import type { OrderStatus } from "@/lib/commerce/order-status";

export const LATE_DAYS = 5;
/** Delivered orders stay on the page this long, so staff can still answer "did it arrive?". */
export const KEEP_DONE_DAYS = 14;

const DAY_MS = 86_400_000;

export interface ParcelOrder {
  orderNumber: string;
  runNumber: number | null;
  status: OrderStatus;
  recipientName: string;
  province: string;
  trackingNumber: string;
  carrier: CarrierId | null;
  /** When staff (or the Shipnity sync) first marked it shipped; null for an order shipped without that history row. */
  shippedAt: string | null;
}

export interface ParcelRow extends ParcelOrder {
  /** Whole days since shipped, or null when the day is unknown. */
  days: number | null;
  late: boolean;
}

export function parcelRows(orders: ParcelOrder[], nowMs: number): ParcelRow[] {
  return orders
    .map((o) => {
      const at = o.shippedAt ? Date.parse(o.shippedAt) : Number.NaN;
      const days = Number.isNaN(at) ? null : Math.max(0, Math.floor((nowMs - at) / DAY_MS));
      return { ...o, days, late: o.status === "shipped" && days !== null && days >= LATE_DAYS };
    })
    .filter((o) => o.status === "shipped" || (o.status === "completed" && o.days !== null && o.days <= KEEP_DONE_DAYS))
    // Late first, the longest wait on top; then the rest, newest parcel first; an unknown day last.
    .sort((a, b) => Number(b.late) - Number(a.late) || (a.late ? (b.days ?? 0) - (a.days ?? 0) : (a.days ?? Infinity) - (b.days ?? Infinity)));
}
