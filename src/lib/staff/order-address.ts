import "server-only";
import { getDb } from "@/lib/db/client";
import { validateAddress, type AddressInput } from "@/lib/commerce/addresses";
import { editStateOf } from "@/lib/staff/line-order-edit";

/**
 * "แก้ที่อยู่จัดส่ง" on /staff/orders/<n> (LINE_ORDERS_GAPS.md #7): the admin typed the address wrong, or the customer gave a
 * new one, BEFORE the order goes to the warehouse. Any channel (a web customer may ask in the chat too). Checked by the web's
 * own address rule (addresses.ts validateAddress: phone, house number, real postcode for the province). The old address is
 * kept in the order's history (staff-only, like every history note), with who changed it. The shipping fee is not worked out
 * again: it hangs on the amount (and a member's monthly benefit), not on the address. After the order is sent, Shipnity holds
 * the address and we never send it an update — the page then tells the admin to fix it there.
 */

/** Statuses an address may still change in: from keyed / placed up to paid, never once handed to the warehouse. */
const EDITABLE = ["pending_payment", "payment_submitted", "awaiting_verification", "approved"];

export function addressEditable(s: { status: string; sentToWarehouse: boolean }): boolean {
  return EDITABLE.includes(s.status) && !s.sentToWarehouse;
}

export type AddressChangeResult = { ok: true } | { ok: false; error: "not-found" | "locked" | "same" | "missing" | "phone" | "houseNumber" | "postal" };

export function changeShippingAddress(orderNumber: string, raw: AddressInput, by: string): AddressChangeResult {
  const checked = validateAddress(raw);
  if ("error" in checked) return { ok: false, error: checked.error };
  const a = checked.input;
  const db = getDb();
  return db.transaction((): AddressChangeResult => {
    const order = db.prepare("SELECT id, status FROM orders WHERE order_number = ?").get(orderNumber) as { id: number; status: string } | undefined;
    if (!order) return { ok: false, error: "not-found" };
    if (!addressEditable({ status: order.status, sentToWarehouse: editStateOf(order.id).sentToWarehouse })) return { ok: false, error: "locked" };
    const old = db
      .prepare("SELECT recipient_name, phone, line1, subdistrict, district, province, postal_code FROM order_shipping_addresses WHERE order_id = ?")
      .get(order.id) as { recipient_name: string; phone: string; line1: string; subdistrict: string; district: string; province: string; postal_code: string };
    const before = `${old.recipient_name} ${old.phone} ${old.line1} ต.${old.subdistrict} อ.${old.district} จ.${old.province} ${old.postal_code}`;
    const after = `${a.recipientName} ${a.phone} ${a.line1} ต.${a.subdistrict} อ.${a.district} จ.${a.province} ${a.postalCode}`;
    if (before === after) return { ok: false, error: "same" };
    db.prepare(
      `UPDATE order_shipping_addresses SET recipient_name = ?, phone = ?, line1 = ?, subdistrict = ?, district = ?, province = ?, postal_code = ? WHERE order_id = ?`
    ).run(a.recipientName, a.phone, a.line1, a.subdistrict, a.district, a.province, a.postalCode, order.id);
    db.prepare("UPDATE orders SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?").run(order.id);
    db.prepare("INSERT INTO order_status_history (order_id, status, note) VALUES (?, ?, ?)").run(
      order.id,
      order.status,
      `Staff (${by}): address changed — was: ${before}`.slice(0, 500)
    );
    return { ok: true };
  })();
}
