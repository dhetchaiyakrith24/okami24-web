/**
 * The daily order count on /staff (LINE_ORDERS_GAPS.md #13, owner 10/11): once the admins key LINE orders on the web they
 * stop posting "admin dd/mm/yy : time #N" in the OKAMI ORDER LINE group — the web IS the daily count. Pure, so the contract
 * test runs it under plain tsx; order-count.ts reads the orders.
 *
 * WHAT COUNTS: an order of that Bangkok day (by when it was placed or keyed) that is not cancelled and is past "waiting for
 * the customer to pay" — a web order nobody paid is not an order yet (the 24-hour sweep cancels it). LINE = keyed by staff
 * on /staff/line-order (migration 0026), web = the customer ordered on the site. `waiting` = still waiting for staff to
 * confirm the money (it may still be cancelled). Money is not shown here: /staff/sales holds the day's money.
 */
import { bangkokDate } from "./daily-sales-rules";

export interface CountOrder {
  channel: "web" | "line";
  status: string;
  createdAt: string;
}

export interface ChannelCount {
  orders: number;
  waiting: number;
}

export interface DayCount {
  /** Bangkok date, YYYY-MM-DD. */
  date: string;
  line: ChannelCount;
  web: ChannelCount;
}

const WAITING = ["payment_submitted", "awaiting_verification"];

export function counts(order: CountOrder): boolean {
  return order.status !== "cancelled" && order.status !== "pending_payment";
}

/** One row per date in `dates`, in that order. */
export function dailyOrderCounts(dates: string[], orders: CountOrder[]): DayCount[] {
  const days = new Map(dates.map((date) => [date, { date, line: { orders: 0, waiting: 0 }, web: { orders: 0, waiting: 0 } }]));
  for (const o of orders) {
    if (!counts(o)) continue;
    const day = days.get(bangkokDate(o.createdAt) ?? "");
    if (!day) continue;
    const c = o.channel === "line" ? day.line : day.web;
    c.orders += 1;
    if (WAITING.includes(o.status)) c.waiting += 1;
  }
  return dates.map((d) => days.get(d)!);
}
