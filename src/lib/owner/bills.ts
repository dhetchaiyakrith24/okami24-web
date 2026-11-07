import "server-only";
import { getDb } from "@/lib/db/client";
import { CONFIRMED_ORDER_STATUSES } from "@/lib/staff/daily-sales-rules";
import { warehouseCode } from "@/lib/staff/orders-export";
import { formatRunNumber } from "@/lib/commerce/run-number";
import type { BillOrder, Diff, RoundTotals, WeekProfit } from "@/lib/owner/bill-rules";

/**
 * Checked warehouse rounds on the server (migration 0025). Reached only from the owner's pages. The bill file itself is not kept,
 * only what the check found. No customer name, phone or address goes in.
 */

const CLAIM_MARGIN_MS = 3 * 86_400_000;
const bangkokMinute = (iso: string) => new Date(Date.parse(iso) + 7 * 3_600_000).toISOString().slice(0, 16).replace("T", " ");

export function webOrdersForBill(sinceIso: string): BillOrder[] {
  const statuses = CONFIRMED_ORDER_STATUSES.map((s) => `'${s}'`).join(",");
  const rows = getDb()
    .prepare(
      `SELECT o.order_number, o.run_number, o.total, o.created_at, i.product_name_snapshot, i.variant_label, i.quantity, i.product_slug, i.variant_id
         FROM orders o JOIN order_items i ON i.order_id = o.id
        WHERE o.status IN (${statuses}) AND o.created_at >= ?
        ORDER BY o.id ASC, i.id ASC`
    )
    .all(new Date(Date.parse(sinceIso) - CLAIM_MARGIN_MS).toISOString()) as {
    order_number: string;
    run_number: number | null;
    total: number;
    created_at: string;
    product_name_snapshot: string;
    variant_label: string | null;
    quantity: number;
    product_slug: string;
    variant_id: string | null;
  }[];
  const orders = new Map<string, BillOrder>();
  for (const r of rows) {
    const order = orders.get(r.order_number) ?? { id: r.order_number, run: formatRunNumber(r.run_number) ?? "", at: bangkokMinute(r.created_at), total: r.total, lines: [] };
    order.lines.push({ name: r.product_name_snapshot, option: r.variant_label ?? "", qty: r.quantity, code: warehouseCode(r.product_slug, r.variant_id) ?? "" });
    orders.set(r.order_number, order);
  }
  return [...orders.values()];
}

export interface StoredOrder {
  run: string;
  no: string | null;
  at: string;
  qty: number;
  paid: number;
  rateTotal: number;
  ship: number | null;
  billed: number | null;
}

export interface StoredRound {
  id: number;
  from: string;
  to: string;
  checkedAt: string;
  totals: RoundTotals;
  week: WeekProfit;
  diffs: Diff[];
  orders: StoredOrder[];
}

/** The same round checked again replaces the last check. */
export function saveRound(round: Omit<StoredRound, "id" | "checkedAt">): number {
  const db = getDb();
  const result = JSON.stringify({ totals: round.totals, week: round.week, diffs: round.diffs, orders: round.orders });
  const row = db
    .prepare(
      `INSERT INTO warehouse_rounds (round_from, round_to, result_json) VALUES (?, ?, ?)
       ON CONFLICT (round_from, round_to) DO UPDATE SET result_json = excluded.result_json, checked_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
       RETURNING id`
    )
    .get(round.from, round.to, result) as { id: number };
  return row.id;
}

interface RoundRow {
  id: number;
  round_from: string;
  round_to: string;
  checked_at: string;
  result_json: string;
}

const toRound = (r: RoundRow): StoredRound => ({ id: r.id, from: r.round_from, to: r.round_to, checkedAt: r.checked_at, ...(JSON.parse(r.result_json) as Pick<StoredRound, "totals" | "week" | "diffs" | "orders">) });

export function listRounds(limit = 26): StoredRound[] {
  return (getDb().prepare("SELECT * FROM warehouse_rounds ORDER BY round_to DESC LIMIT ?").all(limit) as RoundRow[]).map(toRound);
}
