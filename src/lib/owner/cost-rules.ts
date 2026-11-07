import { findColumns, parseAmount, type Sheet } from "./xlsx-read";

/**
 * Cost and web profit (back-office round 07/11, batch 4). Pure. The owner's alone: only src/app/staff/owner reads this
 * (owner-contract-test.ts holds that line). No figure is written in this file; the figures live on the server's disk.
 *
 * Costs match by the Max code ONLY, column รหัสคลัง Shipnity. Never รหัสใน Shipnity Pro: Pro codes were reused for other
 * products (LESSONS พ71). A product with no cost is shown as missing and its order is left out of profit: nothing is guessed.
 * Profit of an order = what the customer paid − cost × quantity − the warehouse's flat shipping.
 */

export interface CostRow {
  code: string;
  satang: number;
}

export interface DatedCost extends CostRow {
  /** Bangkok date this cost starts from. */
  from: string;
}

export interface CostFile {
  rows: CostRow[];
  /** Codes whose cost cell holds no number. */
  noNumber: string[];
}

export const CODE_PATTERN = /^[A-Za-z][\w-]{0,39}$/;

/** "Pod-171-33" → "Pod-171": costs are per product, the warehouse code is per flavour. */
export const productCode = (code: string) => code.replace(/-\d+$/, "");

export function readCostFile(sheets: Sheet[]): CostFile {
  for (const sheet of sheets) {
    const header = sheet.rows[0] ?? {};
    if (!Object.values(header).some((v) => String(v).startsWith("รหัสคลัง Shipnity"))) continue;
    const cols = findColumns(header, { code: "รหัสคลัง Shipnity", cost: "ราคาทุนที่ใช้" }, "ไฟล์ทุน");
    const seen = new Set<string>();
    const out: CostFile = { rows: [], noNumber: [] };
    for (const r of sheet.rows.slice(1)) {
      for (const code of String(r[cols.code] ?? "").split(/[·,/ ]+/).filter((c) => c && c !== "—")) {
        if (seen.has(code) || !CODE_PATTERN.test(code)) continue;
        seen.add(code);
        const baht = parseAmount(r[cols.cost]);
        if (Number.isFinite(baht) && baht > 0) out.rows.push({ code, satang: Math.round(baht * 100) });
        else out.noNumber.push(code);
      }
    }
    return out;
  }
  throw new Error("ไฟล์ทุน: ไม่พบชีตที่มีคอลัมน์รหัสคลัง Shipnity");
}

export interface CostChange {
  code: string;
  fromSatang: number | null;
  toSatang: number;
}

/** What saving a file would change. A code absent from the file keeps its cost. */
export function costChanges(current: ReadonlyMap<string, number>, rows: CostRow[]): CostChange[] {
  return rows.flatMap((r) => {
    const from = current.get(r.code) ?? null;
    return from === r.satang ? [] : [{ code: r.code, fromSatang: from, toSatang: r.satang }];
  });
}

/** The cost in force on a date: the latest that started by then, or the first ever for an order older than the table. */
export function costOn(history: readonly DatedCost[], date: string): number | null {
  if (history.length === 0) return null;
  const sorted = [...history].sort((a, b) => a.from.localeCompare(b.from));
  return ([...sorted].reverse().find((c) => c.from <= date) ?? sorted[0]).satang;
}

export interface ProfitOrder {
  orderNumber: string;
  runNumber: number | null;
  total: number;
  date: string;
  lines: { code: string | null; quantity: number }[];
}

export interface OrderProfit {
  costSatang: number;
  profitSatang: number | null;
  /** Lines with no cost, by code ("ไม่มีรหัสคลัง" lines as null). The order then has no profit figure. */
  missing: (string | null)[];
}

export function orderProfit(order: ProfitOrder, history: ReadonlyMap<string, DatedCost[]>, shippingBaht: number): OrderProfit {
  let costSatang = 0;
  const missing: (string | null)[] = [];
  for (const line of order.lines) {
    const cost = line.code ? costOn(history.get(productCode(line.code)) ?? [], order.date) : null;
    if (cost === null) missing.push(line.code);
    else costSatang += cost * line.quantity;
  }
  return { costSatang, missing, profitSatang: missing.length > 0 ? null : order.total * 100 - costSatang - shippingBaht * 100 };
}

export interface DayProfit {
  date: string;
  salesSatang: number;
  costSatang: number;
  shippingSatang: number;
  profitSatang: number;
  orders: (ProfitOrder & OrderProfit)[];
  /** Orders of the day left out of the figures above for want of a cost. */
  unpriced: number;
}

export function dailyProfit(dates: string[], orders: ProfitOrder[], history: ReadonlyMap<string, DatedCost[]>, shippingBaht: number): DayProfit[] {
  const days = new Map<string, DayProfit>(dates.map((date) => [date, { date, salesSatang: 0, costSatang: 0, shippingSatang: 0, profitSatang: 0, orders: [], unpriced: 0 }]));
  for (const order of orders) {
    const day = days.get(order.date);
    if (!day) continue;
    const priced = orderProfit(order, history, shippingBaht);
    day.orders.push({ ...order, ...priced });
    if (priced.profitSatang === null) {
      day.unpriced++;
      continue;
    }
    day.salesSatang += order.total * 100;
    day.costSatang += priced.costSatang;
    day.shippingSatang += shippingBaht * 100;
    day.profitSatang += priced.profitSatang;
  }
  return dates.map((d) => days.get(d)!);
}
