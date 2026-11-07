import "server-only";
import { getDb } from "@/lib/db/client";
import { SHIPNITY_SKU_MAP } from "@/data/stock/sku-map";
import { bangkokDate, CONFIRMED_ORDER_STATUSES, lastDates } from "@/lib/staff/daily-sales-rules";
import { warehouseCode } from "@/lib/staff/orders-export";
import { WAREHOUSE_SHIPPING_FEE_THB } from "@/lib/woo/order-json";
import { dailyProfit, productCode, type CostRow, type DatedCost, type DayProfit, type ProfitOrder } from "@/lib/owner/cost-rules";

/** The cost table and web profit on the server (migration 0024). Reached only from the owner's pages. */

export function costHistory(): Map<string, DatedCost[]> {
  const rows = getDb().prepare("SELECT max_code, cost_satang, effective_from FROM product_costs").all() as { max_code: string; cost_satang: number; effective_from: string }[];
  const out = new Map<string, DatedCost[]>();
  for (const r of rows) out.set(r.max_code, [...(out.get(r.max_code) ?? []), { code: r.max_code, satang: r.cost_satang, from: r.effective_from }]);
  return out;
}

/** The cost in force now, per Max product code. */
export function currentCosts(): Map<string, number> {
  const out = new Map<string, number>();
  for (const [code, rows] of costHistory()) out.set(code, [...rows].sort((a, b) => a.from.localeCompare(b.from)).at(-1)!.satang);
  return out;
}

/** Same day twice = the later file wins; another day = a new line, so older orders keep their cost. */
export function saveCosts(rows: CostRow[], source: string): number {
  const today = bangkokDate(new Date().toISOString())!;
  const db = getDb();
  const put = db.prepare(
    `INSERT INTO product_costs (max_code, cost_satang, effective_from, source) VALUES (?, ?, ?, ?)
     ON CONFLICT (max_code, effective_from) DO UPDATE SET cost_satang = excluded.cost_satang, source = excluded.source`
  );
  db.transaction(() => rows.forEach((r) => put.run(r.code, r.satang, today, source.slice(0, 120))))();
  return rows.length;
}

/** Every product the site sells that has a warehouse code and no cost yet. */
export function codesWithoutCost(): string[] {
  const have = currentCosts();
  const codes = new Set<string>();
  for (const entry of Object.values(SHIPNITY_SKU_MAP)) {
    const values = entry.options ? Object.values(entry.options) : [entry.product];
    for (const v of values) if (typeof v === "string" && v !== "check") codes.add(productCode(v));
  }
  return [...codes].filter((c) => !have.has(c)).sort();
}

interface OrderLineRow {
  order_number: string;
  run_number: number | null;
  total: number;
  created_at: string;
  product_slug: string;
  variant_id: string | null;
  quantity: number;
}

function confirmedOrders(sinceIso: string): ProfitOrder[] {
  const statuses = CONFIRMED_ORDER_STATUSES.map((s) => `'${s}'`).join(",");
  const rows = getDb()
    .prepare(
      `SELECT o.order_number, o.run_number, o.total, o.created_at, i.product_slug, i.variant_id, i.quantity
         FROM orders o JOIN order_items i ON i.order_id = o.id
        WHERE o.status IN (${statuses}) AND o.created_at >= ?
        ORDER BY o.id DESC, i.id ASC`
    )
    .all(sinceIso) as OrderLineRow[];
  const orders = new Map<string, ProfitOrder>();
  for (const r of rows) {
    const order = orders.get(r.order_number) ?? {
      orderNumber: r.order_number,
      runNumber: r.run_number,
      total: r.total,
      date: bangkokDate(r.created_at) ?? "",
      lines: [],
    };
    order.lines.push({ code: warehouseCode(r.product_slug, r.variant_id), quantity: r.quantity });
    orders.set(r.order_number, order);
  }
  return [...orders.values()];
}

export function profitDays(count: number): DayProfit[] {
  const dates = lastDates(bangkokDate(new Date().toISOString())!, count);
  const since = new Date(Date.parse(`${dates[dates.length - 1]}T00:00:00+07:00`)).toISOString();
  return dailyProfit(dates, confirmedOrders(since), costHistory(), WAREHOUSE_SHIPPING_FEE_THB);
}
