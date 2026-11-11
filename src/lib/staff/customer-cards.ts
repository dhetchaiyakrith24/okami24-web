import "server-only";
import { getDb } from "@/lib/db/client";
import { AUTO_CANCELLED_SQL } from "@/lib/commerce/unpaid-rules";
import { trimLine1 } from "@/lib/commerce/address-line1";
import { toCarrierId } from "@/lib/commerce/carriers";
import type { OrderStatus } from "@/lib/commerce/order-status";
import { customerCard, type CardOrder, type CustomerCard } from "@/lib/staff/customer-card-rules";
import { parcelRows, type ParcelOrder, type ParcelRow } from "@/lib/staff/tracking-check-rules";
import { CONFIRMED_ORDER_STATUSES } from "@/lib/staff/daily-sales-rules";

/**
 * Reads for the customer card (/staff/customers) and the parcel check (/staff/tracking) — owner list ก11. Reads only; the
 * rules = customer-card-rules.ts and tracking-check-rules.ts. Reached through staff pages, which check the staff session
 * first. Orders the unpaid sweep cancelled are left out, as on every staff list (owner 26/10 "ซ่อน"). No cost, no profit.
 */

const LIST_LIMIT = 500;
/** The list's total = the card's "paid" = what daily sales counts. */
const PAID_SQL = CONFIRMED_ORDER_STATUSES.map((s) => `'${s}'`).join(",");

export interface CustomerListRow {
  id: number;
  phone: string;
  /** Recipient names on this customer's orders, the buyer's own (recipient phone = checkout phone) first, then newest
   *  first — what staff search by; the first is the row's name, as on the card. */
  names: string[];
  orderCount: number;
  paidTotal: number;
  lastOrderAt: string;
}

export function listCustomers(): CustomerListRow[] {
  const rows = getDb()
    .prepare(
      `SELECT c.id, c.phone, COUNT(o.id) AS order_count, MAX(o.created_at) AS last_at,
              COALESCE(SUM(CASE WHEN o.status IN (${PAID_SQL}) THEN o.total END), 0) AS paid_total,
              (SELECT GROUP_CONCAT(name, char(31)) FROM (
                 SELECT DISTINCT a.recipient_name AS name FROM orders o2 JOIN order_shipping_addresses a ON a.order_id = o2.id
                  WHERE o2.customer_id = c.id ORDER BY (a.phone = c.phone) DESC, o2.id DESC)) AS names
         FROM customers c JOIN orders o ON o.customer_id = c.id
        WHERE NOT ${AUTO_CANCELLED_SQL}
        GROUP BY c.id
        ORDER BY last_at DESC
        LIMIT ${LIST_LIMIT}`
    )
    .all() as { id: number; phone: string; order_count: number; last_at: string; paid_total: number; names: string | null }[];
  return rows.map((r) => ({
    id: r.id,
    phone: r.phone,
    names: r.names ? r.names.split("\u001f") : [],
    orderCount: r.order_count,
    paidTotal: r.paid_total,
    lastOrderAt: r.last_at,
  }));
}

export function getCustomerCard(customerId: number): CustomerCard | null {
  const db = getDb();
  const customer = db.prepare("SELECT phone FROM customers WHERE id = ?").get(customerId) as { phone: string } | undefined;
  if (!customer) return null;
  const rows = db
    .prepare(
      `SELECT o.order_number, o.run_number, o.status, o.total, o.created_at, o.tracking_number, o.channel,
              a.recipient_name, a.phone AS recipient_phone, a.line1, a.subdistrict, a.district, a.province, a.postal_code,
              (SELECT COALESCE(SUM(quantity), 0) FROM order_items i WHERE i.order_id = o.id) AS item_count
         FROM orders o JOIN order_shipping_addresses a ON a.order_id = o.id
        WHERE o.customer_id = ? AND NOT ${AUTO_CANCELLED_SQL}`
    )
    .all(customerId) as {
    order_number: string;
    run_number: number | null;
    status: OrderStatus;
    total: number;
    created_at: string;
    tracking_number: string | null;
    channel: string;
    recipient_name: string;
    recipient_phone: string;
    line1: string;
    subdistrict: string;
    district: string;
    province: string;
    postal_code: string;
    item_count: number;
  }[];
  if (rows.length === 0) return null;
  const orders: CardOrder[] = rows.map((r) => ({
    orderNumber: r.order_number,
    runNumber: r.run_number,
    status: r.status,
    total: r.total,
    createdAt: r.created_at,
    itemCount: r.item_count,
    recipientName: r.recipient_name,
    recipientPhone: r.recipient_phone,
    address: `${trimLine1(r.line1, { subdistrict: r.subdistrict, district: r.district, province: r.province, postalCode: r.postal_code })} ต.${r.subdistrict} อ.${r.district} จ.${r.province} ${r.postal_code}`,
    province: r.province,
    trackingNumber: r.tracking_number,
    channel: r.channel === "line" ? "line" : "web",
  }));
  const members = db
    .prepare(
      `SELECT DISTINCT mi.provider, m.display_name FROM orders o JOIN members m ON m.id = o.member_id
         JOIN member_identities mi ON mi.member_id = m.id WHERE o.customer_id = ?`
    )
    .all(customerId) as { provider: string; display_name: string | null }[];
  return customerCard(customer.phone, orders, members.map((m) => ({ provider: m.provider, name: m.display_name })));
}

/** The customer id of an order — the order page's link to its card. */
export function customerIdOf(orderNumber: string): number | null {
  const row = getDb().prepare("SELECT customer_id FROM orders WHERE order_number = ?").get(orderNumber) as { customer_id: number } | undefined;
  return row?.customer_id ?? null;
}

/** The parcel check page's rows, as of now. */
export function parcelsNow(): ParcelRow[] {
  return parcelRows(listParcels(), Date.now());
}

/** Orders with a tracking number that are shipped, or received in the last weeks (parcelRows filters by day). */
function listParcels(): ParcelOrder[] {
  const rows = getDb()
    .prepare(
      `SELECT o.order_number, o.run_number, o.status, o.tracking_number, o.carrier, a.recipient_name, a.province,
              (SELECT MIN(h.created_at) FROM order_status_history h WHERE h.order_id = o.id AND h.status = 'shipped') AS shipped_at
         FROM orders o JOIN order_shipping_addresses a ON a.order_id = o.id
        WHERE o.status IN ('shipped','completed') AND o.tracking_number IS NOT NULL AND o.tracking_number <> ''
        ORDER BY o.id DESC
        LIMIT ${LIST_LIMIT}`
    )
    .all() as {
    order_number: string;
    run_number: number | null;
    status: OrderStatus;
    tracking_number: string;
    carrier: string | null;
    recipient_name: string;
    province: string;
    shipped_at: string | null;
  }[];
  return rows.map((r) => ({
    orderNumber: r.order_number,
    runNumber: r.run_number,
    status: r.status,
    recipientName: r.recipient_name,
    province: r.province,
    trackingNumber: r.tracking_number,
    carrier: toCarrierId(r.carrier),
    shippedAt: r.shipped_at,
  }));
}
