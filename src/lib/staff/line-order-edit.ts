import "server-only";
import { getDb } from "@/lib/db/client";
import { getCatalogItem } from "@/lib/catalog-index";
import { resolveProductRef } from "@/lib/commerce/catalog-resolver";
import { decideShipping, loadShippingHistory } from "@/lib/commerce/shipping-rules";
import { isPostcodeSubdistrict } from "@/lib/commerce/thai-postcodes";
import { liveLookup } from "@/lib/stock/live";
import { applyStaffAction } from "@/lib/staff/orders";
import { slipsToPick } from "@/lib/staff/line-orders";
import type { LineOrderItem } from "@/lib/staff/line-order-rules";
import { addedUnits, checkMoney, itemsNotEditable, onlyAdds, type EditableStatus, type MoneyError, type NotEditable, type QtyLine } from "@/lib/staff/line-order-edit-rules";

/**
 * Add items to a keyed LINE order before it goes to the warehouse (LINE_ORDERS_GAPS.md #3) — the rules and why are in
 * line-order-edit-rules.ts. Reached only through the staff action, which checks the staff session first. Lines already on
 * the order keep their sold price (rows updated in place, never deleted while money is in); added units are priced and
 * stock-checked by the same resolver as the cart; shipping is worked out again on the whole order by the web's rule.
 */

/** Where an order stands for "แก้รายการสินค้า": every reader asks the same question (the page and the save). */
export function editStateOf(orderId: number): { status: string; channel: "web" | "line"; sentToWarehouse: boolean; hasStockIssue: boolean } {
  const row = getDb()
    .prepare(
      `SELECT o.status, o.channel,
              EXISTS (SELECT 1 FROM woo_order_sends s WHERE s.order_id = o.id AND s.status <> 'failed') AS sent,
              EXISTS (SELECT 1 FROM order_stock_issues i WHERE i.order_id = o.id) AS stock
         FROM orders o WHERE o.id = ?`
    )
    .get(orderId) as { status: string; channel: string; sent: number; stock: number };
  return { status: row.status, channel: row.channel === "line" ? "line" : "web", sentToWarehouse: row.sent === 1, hasStockIssue: row.stock === 1 };
}

/** The slips linked to an order: how many, and their satang together (a bank reference is linked to one order only). */
export function linkedSlips(orderId: number): { count: number; satang: number } {
  return getDb()
    .prepare("SELECT COUNT(*) AS count, COALESCE(SUM(slip_amount_satang), 0) AS satang FROM order_payment_submissions WHERE order_id = ? AND slip_trans_ref IS NOT NULL")
    .get(orderId) as { count: number; satang: number };
}

export type ChangeItemsResult =
  | { ok: true; confirmed: boolean; oldTotal: number; newTotal: number }
  | { ok: false; error: NotEditable | MoneyError | "not-found" | "only-add" | "item" | "stock" | "slip-taken" };

export function changeLineOrderItems(input: { orderNumber: string; items: LineOrderItem[]; slipRef: string | null; handConfirmed: boolean; by: string }): ChangeItemsResult {
  const db = getDb();
  const live = liveLookup();
  const result = db.transaction((): ChangeItemsResult & { confirm?: boolean } => {
    const order = db
      .prepare(
        `SELECT o.id, o.total, a.phone, a.line1, a.subdistrict, a.postal_code, c.phone AS cphone
           FROM orders o JOIN order_shipping_addresses a ON a.order_id = o.id JOIN customers c ON c.id = o.customer_id
          WHERE o.order_number = ?`
      )
      .get(input.orderNumber) as { id: number; total: number; phone: string; line1: string; subdistrict: string; postal_code: string; cphone: string } | undefined;
    if (!order) return { ok: false, error: "not-found" };
    const state = editStateOf(order.id);
    const blocked = itemsNotEditable(state);
    if (blocked) return { ok: false, error: blocked };

    const rows = db
      .prepare("SELECT id, product_slug, variant_id, unit_price, quantity FROM order_items WHERE order_id = ? ORDER BY id")
      .all(order.id) as { id: number; product_slug: string; variant_id: string | null; unit_price: number; quantity: number }[];
    const oldLines: QtyLine[] = rows.map((r) => ({ slug: r.product_slug, variantId: r.variant_id, quantity: r.quantity }));
    const linkedSatang = linkedSlips(order.id).satang;
    const moneyIn = state.status === "approved" || linkedSatang > 0;
    if (moneyIn && !onlyAdds(oldLines, input.items)) return { ok: false, error: "only-add" };

    // Price: an old line keeps its sold price; a new line takes today's catalogue price. Added units must sell now.
    const priced: { slug: string; variantId: string | null; quantity: number; unitPrice: number; name: string; label: string | null; rowId: number | null }[] = [];
    const added = new Map(addedUnits(oldLines, input.items).map((l) => [`${l.slug}|${l.variantId ?? ""}`, l.quantity]));
    for (const item of input.items) {
      const old = rows.find((r) => r.product_slug === item.slug && r.variant_id === item.variantId);
      if (old && !added.has(`${item.slug}|${item.variantId ?? ""}`)) {
        priced.push({ ...item, unitPrice: old.unit_price, name: "", label: null, rowId: old.id });
        continue;
      }
      const catalog = getCatalogItem(item.slug);
      if (!catalog) return { ok: false, error: "item" };
      const resolved = resolveProductRef({ origin: catalog.origin, slug: item.slug, variantId: item.variantId }, live);
      if (!resolved.ok) return { ok: false, error: resolved.reason === "out-of-stock" ? "stock" : "item" };
      priced.push({
        ...item,
        unitPrice: old ? old.unit_price : resolved.line.unitPrice,
        name: resolved.line.displayName,
        label: resolved.line.variantLabel,
        rowId: old?.id ?? null,
      });
    }

    const subtotal = priced.reduce((n, l) => n + l.unitPrice * l.quantity, 0);
    const history = loadShippingHistory(db, { memberId: null, phones: [order.cphone, order.phone], address: { line1: order.line1, subdistrict: order.subdistrict, postalCode: order.postal_code } }, new Date(), isPostcodeSubdistrict);
    const shipping = decideShipping(subtotal, history);
    const newTotal = subtotal + shipping.fee;

    let slip: { transRef: string; amountSatang: number } | undefined;
    if (input.slipRef) {
      const linked = db.prepare("SELECT 1 FROM order_payment_submissions WHERE slip_trans_ref = ?").get(input.slipRef);
      slip = linked ? undefined : slipsToPick().find((s) => s.transRef === input.slipRef);
      if (!slip) return { ok: false, error: "slip-taken" };
    }
    const money = checkMoney({
      status: state.status as EditableStatus,
      linkedSatang,
      oldTotal: order.total,
      newTotal,
      slipSatang: slip?.amountSatang ?? null,
      handConfirmed: input.handConfirmed,
    });
    if (!money.ok) return { ok: false, error: money.error };

    // Write: old rows updated in place (an old line the admin took off before any money came in is deleted), new rows added.
    const keep = new Set(priced.map((l) => l.rowId).filter((id): id is number => id !== null));
    for (const r of rows) if (!keep.has(r.id)) db.prepare("DELETE FROM order_items WHERE id = ?").run(r.id);
    const update = db.prepare("UPDATE order_items SET quantity = ?, line_total = ? WHERE id = ?");
    const insert = db.prepare(
      `INSERT INTO order_items (order_id, product_slug, variant_id, variant_label, product_name_snapshot, unit_price, quantity, line_total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );
    for (const l of priced) {
      if (l.rowId !== null) update.run(l.quantity, l.unitPrice * l.quantity, l.rowId);
      else insert.run(order.id, l.slug, l.variantId, l.label, l.name, l.unitPrice, l.quantity, l.unitPrice * l.quantity);
    }
    db.prepare(
      `UPDATE orders SET subtotal = ?, shipping_fee = ?, shipping_rule = ?, total = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?`
    ).run(subtotal, shipping.fee, shipping.rule, newTotal, order.id);
    if (slip) {
      db.prepare(
        `INSERT INTO order_payment_submissions (order_id, method, reference_note, slip_trans_ref, slip_amount_satang, slip_verdict, slip_reasons)
         VALUES (?, 'bank_transfer', ?, ?, ?, 'pass', NULL)`
      ).run(order.id, "LINE order — added items (staff)", slip.transRef, slip.amountSatang);
    }
    const how = slip ? "slip from the slip check" : input.handConfirmed ? "difference confirmed by hand" : "money to confirm by hand";
    db.prepare("INSERT INTO order_status_history (order_id, status, note) VALUES (?, ?, ?)").run(
      order.id,
      state.status,
      `Staff (${input.by}): items changed ${order.total} → ${newTotal} THB — ${how}`
    );
    return { ok: true, confirmed: false, oldTotal: order.total, newTotal, confirm: money.confirm };
  })();

  if (!result.ok) return result;
  const confirmed = result.confirm ? applyStaffAction(input.orderNumber, "confirm", { note: "LINE order — slips cover the new total" }).ok : false;
  return { ok: true, confirmed, oldTotal: result.oldTotal, newTotal: result.newTotal };
}
