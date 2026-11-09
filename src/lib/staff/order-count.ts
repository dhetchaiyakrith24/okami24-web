import "server-only";
import { getDb } from "@/lib/db/client";
import { bangkokDate, lastDates } from "@/lib/staff/daily-sales-rules";
import { dailyOrderCounts, type CountOrder, type DayCount } from "@/lib/staff/order-count-rules";

/** The daily order count of the staff home, today first (rules = order-count-rules.ts). Only reads; reached through the
 *  staff home, which checks the staff session first. */
export function orderCountDays(days: number): DayCount[] {
  const dates = lastDates(bangkokDate(new Date().toISOString())!, days);
  // From the start of the oldest Bangkok day, as the UTC text orders.created_at holds (so it compares as text).
  const since = new Date(Date.parse(`${dates[dates.length - 1]}T00:00:00+07:00`)).toISOString();
  const rows = getDb().prepare("SELECT channel, status, created_at FROM orders WHERE created_at >= ?").all(since) as {
    channel: string;
    status: string;
    created_at: string;
  }[];
  const orders: CountOrder[] = rows.map((r) => ({ channel: r.channel === "line" ? "line" : "web", status: r.status, createdAt: r.created_at }));
  return dailyOrderCounts(dates, orders);
}
