import "server-only";
import { getDb } from "@/lib/db/client";
import { refundedByRef } from "@/lib/staff/refunds";
import { netSatang } from "@/lib/staff/refund-rules";
import { bangkokDate, CONFIRMED_ORDER_STATUSES, dailySales, lastDates, sortSlips, type DaySales, type SalesOrder, type SalesSlip } from "@/lib/staff/daily-sales-rules";

/**
 * Reads what /staff/sales shows. Only reads; the rules of what counts = daily-sales-rules.ts. Reached through staff pages,
 * which check the staff session first. No cost or profit is read here.
 */

const CLAIM_MARGIN_DAYS = 3;
/** Every reader takes the same window: whether a slip fits an order depends on the orders in it, so two windows could disagree on today. */
export const SALES_DAYS = 31;

function readInputs(fromMs: number): { orders: SalesOrder[]; slips: SalesSlip[]; linked: Set<string> } {
  const db = getDb();
  const since = new Date(fromMs - CLAIM_MARGIN_DAYS * 86_400_000).toISOString();
  const statuses = CONFIRMED_ORDER_STATUSES.map((s) => `'${s}'`).join(",");
  const orders = db
    .prepare(
      `SELECT o.order_number, o.run_number, o.total, o.created_at,
              EXISTS (SELECT 1 FROM order_payment_submissions s WHERE s.order_id = o.id AND s.slip_trans_ref IS NOT NULL) AS has_slip_ref
         FROM orders o
        WHERE o.status IN (${statuses}) AND o.created_at >= ?`
    )
    .all(since) as { order_number: string; run_number: number | null; total: number; created_at: string; has_slip_ref: number }[];
  // transferred_at carries the bank's own offset, so it cannot be compared as text; a slip of the window was first checked
  // after the window began, and first_checked_at is always ours (UTC).
  const slips = db
    .prepare("SELECT trans_ref, amount_satang, transferred_at, receiver_status FROM slip_checks WHERE first_checked_at >= ?")
    .all(since) as { trans_ref: string; amount_satang: number; transferred_at: string; receiver_status: string }[];
  const linkedRows = db.prepare("SELECT DISTINCT slip_trans_ref AS ref FROM order_payment_submissions WHERE slip_trans_ref IS NOT NULL").all() as { ref: string }[];

  const salesOrders: SalesOrder[] = orders.map((o) => ({
    orderNumber: o.order_number,
    runNumber: o.run_number,
    total: o.total,
    createdAt: o.created_at,
    hasSlipRef: o.has_slip_ref === 1,
  }));
  const refunded = refundedByRef();
  const salesSlips: SalesSlip[] = slips.map((s) => ({
    transRef: s.trans_ref,
    amountSatang: s.amount_satang,
    transferredAt: s.transferred_at,
    receiverStatus: s.receiver_status,
    refundedSatang: refunded.get(s.trans_ref),
  }));
  return { orders: salesOrders, slips: salesSlips, linked: new Set(linkedRows.map((l) => l.ref)) };
}

function readSales(dates: string[]): DaySales[] {
  const { orders, slips, linked } = readInputs(Date.parse(`${dates[dates.length - 1]}T00:00:00+07:00`));
  return dailySales(dates, orders, slips, linked);
}

/** LINE sales of a stretch of time, for the weekly check: the same sorting as the page, by transfer time, refunds off. */
export function lineSalesBetween(fromIso: string, toIso: string): number {
  const from = Date.parse(fromIso);
  const to = Date.parse(toIso);
  const { orders, slips, linked } = readInputs(from);
  return sortSlips(orders, slips, linked)
    .line.filter((s) => Date.parse(s.transferredAt) >= from && Date.parse(s.transferredAt) < to)
    .reduce((n, s) => n + netSatang(s.amountSatang, s.refundedSatang), 0);
}

/** The last SALES_DAYS days, today first (Bangkok). */
export function salesDays(): DaySales[] {
  return readSales(lastDates(bangkokDate(new Date().toISOString())!, SALES_DAYS));
}

export function salesToday(): DaySales {
  return salesDays()[0];
}
