import "server-only";
import { getDb } from "@/lib/db/client";
import { cleanOrderMessage } from "./order-message-rules";

/**
 * The shop's messages to the customer on /orders/<n> (owner 24/10: "กล่องข้อความแจ้งรายละเอียดจากแอดมิน" — the customer sees
 * why an order was cancelled or an item ran out, and what happens next). Staff write them on /staff/orders/<n>, also as part
 * of a cancel or an out-of-stock notice. Staff-only notes live elsewhere and never reach this table (migration 0015).
 */

export interface OrderMessage {
  body: string;
  createdAt: string;
}

/** Newest first. */
export function customerMessagesFor(orderId: number): OrderMessage[] {
  return (
    getDb()
      .prepare("SELECT body, created_at FROM order_customer_messages WHERE order_id = ? ORDER BY id DESC")
      .all(orderId) as { body: string; created_at: string }[]
  ).map((r) => ({ body: r.body, createdAt: r.created_at }));
}

/** Store an already-cleaned message (callers inside a transaction use this). */
export function insertCustomerMessage(orderId: number, body: string): void {
  getDb().prepare("INSERT INTO order_customer_messages (order_id, body) VALUES (?, ?)").run(orderId, body);
}

export type AddMessageResult = { ok: true } | { ok: false; error: "not-found" | "message" };

/** Staff write to the customer from the order page. */
export function addCustomerMessage(orderNumber: string, raw: unknown): AddMessageResult {
  const body = cleanOrderMessage(raw);
  if (!body) return { ok: false, error: "message" };
  const row = getDb().prepare("SELECT id FROM orders WHERE order_number = ?").get(orderNumber) as { id: number } | undefined;
  if (!row) return { ok: false, error: "not-found" };
  insertCustomerMessage(row.id, body);
  return { ok: true };
}
