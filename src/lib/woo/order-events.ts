import "server-only";
import { getDb } from "@/lib/db/client";
import { lineConfigured, pushText } from "@/lib/line/client";
import { groupForRole } from "@/lib/line/groups";
import { SITE_URL } from "@/lib/seo";
import { formatRunNumber } from "@/lib/commerce/run-number";
import type { OrderUpdate } from "@/lib/woo/api";
import { alertWorthy, formatWarehouseChangeAlert } from "@/lib/woo/order-alert";

/**
 * Changes Shipnity makes to an order it was sent (owner 28/10: "หากมีกรณีสินค้ายกเลิกเพราะหมดกะทันหัน ทาง Shipnity กดยกเลิก
 * มาทาง Web เราต้องรู้และแจ้งตีกลับไปในไลน์"). Each change is recorded (table woo_order_events); a cancel / delete / refund /
 * fail is pushed once into the "OKM Order" LINE group. The order's own status on the site is not touched — the admin calls
 * the customer and the warehouse's admin, then uses the order page as usual. Never throws.
 */

export async function recordOrderUpdates(updates: OrderUpdate[]): Promise<void> {
  for (const u of updates) {
    try {
      const db = getDb();
      db.prepare("INSERT INTO woo_order_events (order_id, shipnity_status) VALUES (?, ?)").run(u.orderId, u.status);
      if (!alertWorthy(u.status)) continue;
      const already = db
        .prepare("SELECT 1 FROM woo_order_events WHERE order_id = ? AND shipnity_status = ? AND notified_at IS NOT NULL LIMIT 1")
        .get(u.orderId, u.status);
      if (already) continue;
      const order = db
        .prepare(
          "SELECT o.order_number, o.run_number, (SELECT group_concat(i.product_name_snapshot || COALESCE(' ' || i.variant_label, '') || ' × ' || i.quantity, ' · ') FROM order_items i WHERE i.order_id = o.id) AS items FROM orders o WHERE o.id = ?"
        )
        .get(u.orderId) as { order_number: string; run_number: number | null; items: string | null } | undefined;
      if (!order) continue;
      if (!lineConfigured()) continue;
      const groupId = groupForRole("order");
      if (!groupId) {
        console.warn(`[shipnity] order ${order.order_number} ${u.status}: no LINE group marked "order" — alert not sent`);
        continue;
      }
      const text = formatWarehouseChangeAlert({
        orderNumber: order.order_number,
        runNumber: formatRunNumber(order.run_number),
        items: order.items ?? "",
        status: u.status!,
        siteUrl: SITE_URL,
      });
      const result = await pushText(groupId, text);
      if (result.ok) {
        db.prepare(
          "UPDATE woo_order_events SET notified_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = (SELECT MAX(id) FROM woo_order_events WHERE order_id = ? AND shipnity_status = ?)"
        ).run(u.orderId, u.status);
      } else console.error(`[shipnity] order ${order.order_number}: LINE push failed (${result.status ?? "network"})`);
    } catch (err) {
      console.error(`[shipnity] order update ${u.orderId}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}

export interface WarehouseChange {
  status: string;
  at: string;
}

/** The latest alert-worthy change Shipnity made to this order (for the red line on the staff order page), or null. */
export function warehouseChange(orderId: number): WarehouseChange | null {
  const rows = getDb()
    .prepare("SELECT shipnity_status AS status, at FROM woo_order_events WHERE order_id = ? ORDER BY id DESC")
    .all(orderId) as { status: string | null; at: string }[];
  const hit = rows.find((r) => alertWorthy(r.status));
  return hit ? { status: hit.status!, at: hit.at } : null;
}

/** Every change Shipnity sent, newest first (for /staff/shipnity). */
export function recentOrderEvents(limit = 50): { orderNumber: string; status: string | null; at: string; notifiedAt: string | null }[] {
  return getDb()
    .prepare(
      "SELECT o.order_number AS orderNumber, e.shipnity_status AS status, e.at, e.notified_at AS notifiedAt FROM woo_order_events e JOIN orders o ON o.id = e.order_id ORDER BY e.id DESC LIMIT ?"
    )
    .all(limit) as { orderNumber: string; status: string | null; at: string; notifiedAt: string | null }[];
}
