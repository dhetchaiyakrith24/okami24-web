import "server-only";
import { getDb } from "@/lib/db/client";
import { AUTO_CANCELLED_SQL } from "@/lib/commerce/unpaid-rules";
import { hasLineClicksTable, summarizeLineClicks } from "@/lib/metrics/line-click-summary";
import { CONFIRMED_ORDER_STATUSES } from "@/lib/staff/daily-sales-rules";
import { STAFF_JOBS, TODO_JOBS, type StaffJob } from "@/lib/staff/jobs";

/** What the owner dashboard reads besides sales and profit (owner 08/11). Only reads, and only counts: no customer detail. */

/** When the oldest order of each to-do job was placed, null for an empty job. */
export function oldestOrders(): Partial<Record<StaffJob, string | null>> {
  const db = getDb();
  const out: Partial<Record<StaffJob, string | null>> = {};
  for (const job of TODO_JOBS) {
    const statuses = STAFF_JOBS[job].statuses.map((s) => `'${s}'`).join(",");
    const row = db.prepare(`SELECT MIN(o.created_at) AS at FROM orders o WHERE o.status IN (${statuses}) AND NOT ${AUTO_CANCELLED_SQL}`).get() as { at: string | null };
    out[job] = row.at;
  }
  return out;
}

/** Clicks on the LINE button over `days` days; null when the table is not there yet. */
export function lineClicks(days: number): number | null {
  const db = getDb();
  return hasLineClicksTable(db) ? summarizeLineClicks(db, days).total : null;
}

/** Carts touched in the last `days` days that still hold something: checkout empties a cart, so these never became an order. */
export function cartsNotOrdered(days: number): number {
  const since = new Date(Date.now() - days * 86_400_000).toISOString();
  const row = getDb()
    .prepare("SELECT COUNT(DISTINCT c.id) AS n FROM carts c JOIN cart_items i ON i.cart_id = c.id WHERE datetime(c.updated_at) >= datetime(?)")
    .get(since) as { n: number };
  return row.n;
}

export interface TopProduct {
  name: string;
  pieces: number;
}

/** Best sellers on the web only: a LINE slip says nothing about what was bought. */
export function topWebProducts(days: number, limit = 5): TopProduct[] {
  const since = new Date(Date.now() - days * 86_400_000).toISOString();
  const statuses = CONFIRMED_ORDER_STATUSES.map((s) => `'${s}'`).join(",");
  const rows = getDb()
    .prepare(
      `SELECT MAX(i.product_name_snapshot) AS name, SUM(i.quantity) AS pieces
         FROM order_items i JOIN orders o ON o.id = i.order_id
        WHERE o.status IN (${statuses}) AND o.created_at >= ?
        GROUP BY i.product_slug
        ORDER BY pieces DESC, name ASC
        LIMIT ?`
    )
    .all(since, limit) as { name: string; pieces: number }[];
  return rows;
}
