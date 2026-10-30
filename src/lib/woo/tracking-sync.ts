import "server-only";
import { getDb } from "@/lib/db/client";
import { pickCarrier, toStaffCarrierId } from "@/lib/commerce/carriers";
import { formatRunNumber } from "@/lib/commerce/run-number";
import type { OrderStatus } from "@/lib/commerce/order-status";
import { applyStaffAction } from "@/lib/staff/orders";
import type { OrderTracking } from "@/lib/woo/api";
import { decideShip, trackingsInLoggedWrite, type ShipDecision } from "@/lib/woo/tracking-sync-rules";

/**
 * Tracking sync step 2 (owner 29/10 "ระบบดึงเลขพัสดุทำเลยครับ"): a tracking number Shipnity writes to an order the site sent
 * puts that number on the order and moves it to "shipped" — the same `ship` step as the staff button, with the history
 * line "Shipnity: ship — tracking … — carrier …" (staff read it as "คลัง (Shipnity): ส่งของ"). The rules are in
 * tracking-sync-rules.ts. Never throws — the warehouse's call is answered whatever happens here.
 *
 * `catchUpFromLog` re-reads the numbers already in the call log (woo_api_log) for orders still waiting — dry run by
 * default; staff run it from /staff/api/shipnity-tracking-sync.
 */

interface OrderRow {
  id: number;
  order_number: string;
  run_number: number | null;
  status: OrderStatus;
  tracking_number: string | null;
  carrier: string | null;
  postal_code: string;
  first_sent_at: string | null;
}

export interface SyncResult {
  orderNumber: string;
  runNumber: string | null;
  status: OrderStatus;
  tracking: string;
  decision: ShipDecision;
  applied: boolean;
}

function orderRow(orderId: number): OrderRow | undefined {
  return getDb()
    .prepare(
      `SELECT o.id, o.order_number, o.run_number, o.status, o.tracking_number, o.carrier, a.postal_code,
              (SELECT first_sent_at FROM woo_order_sends s WHERE s.order_id = o.id) AS first_sent_at
         FROM orders o JOIN order_shipping_addresses a ON a.order_id = o.id WHERE o.id = ?`
    )
    .get(orderId) as OrderRow | undefined;
}

function syncOne(t: OrderTracking, apply: boolean): SyncResult | null {
  const row = orderRow(t.orderId);
  if (!row) return null;
  const decision = decideShip(
    {
      status: row.status,
      sentToShipnity: row.first_sent_at !== null,
      tracking: row.tracking_number,
      sentCarrier: toStaffCarrierId(row.carrier) ?? pickCarrier(row.postal_code),
    },
    t.tracking
  );
  let applied = false;
  if (apply && decision.ship) {
    // The staff step re-reads the status inside its own transaction, so a repeat or a race is refused there too.
    applied = applyStaffAction(row.order_number, "ship", { tracking: decision.tracking, carrier: decision.carrier, by: "shipnity" }).ok;
  }
  return {
    orderNumber: row.order_number,
    runNumber: formatRunNumber(row.run_number),
    status: row.status,
    tracking: t.tracking.number,
    decision,
    applied,
  };
}

/** The live path: called by /wp-json after answering Shipnity. */
export function applyShipnityTrackings(list: OrderTracking[]): void {
  for (const t of list) {
    try {
      const r = syncOne(t, true);
      if (!r) continue;
      if (r.applied) console.log(`[shipnity] order ${r.orderNumber}: shipped, tracking ${r.tracking} (${r.decision.ship ? r.decision.carrier : ""})`);
      else if (!r.decision.ship && r.decision.reason !== "same-number")
        console.warn(`[shipnity] order ${r.orderNumber}: tracking ${r.tracking} not applied (${r.decision.reason})`);
    } catch (err) {
      console.error(`[shipnity] tracking for order ${t.orderId}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}

/** Every order with a tracking number in the call log — the newest number per order — and what the sync does with it.
 *  `apply` = actually ship the ones it may (after the owner's OK); otherwise a dry run that changes nothing. */
export function catchUpFromLog(apply: boolean): SyncResult[] {
  const rows = getDb()
    .prepare(
      `SELECT method, path, body FROM woo_api_log
        WHERE key_id IS NOT NULL AND method <> 'GET' AND status BETWEEN 200 AND 299 AND path LIKE '%/orders/%' ORDER BY id`
    )
    .all() as { method: string; path: string; body: string | null }[];
  const latest = new Map<number, OrderTracking>();
  for (const r of rows) for (const t of trackingsInLoggedWrite(r.method, r.path, r.body)) latest.set(t.orderId, t);
  const out: SyncResult[] = [];
  for (const t of latest.values()) {
    const r = syncOne(t, apply);
    if (r) out.push(r);
  }
  return out;
}
