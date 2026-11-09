import "server-only";
import crypto from "node:crypto";
import { getDb } from "@/lib/db/client";
import { getCatalogItem } from "@/lib/catalog-index";
import { resolveProductRef, type ProductRef } from "@/lib/commerce/catalog-resolver";
import { computeOrderTotals, priceLine, type PricedLine } from "@/lib/commerce/pricing";
import { loadShippingHistory } from "@/lib/commerce/shipping-rules";
import { isPostcodeSubdistrict } from "@/lib/commerce/thai-postcodes";
import { validateAddress } from "@/lib/commerce/addresses";
import { generateOrderNumber } from "@/lib/commerce/orders";
import { liveLookup } from "@/lib/stock/live";
import { applyStaffAction } from "@/lib/staff/orders";
import { looseLineSlips } from "@/lib/staff/daily-sales";
import { DUPLICATE_WINDOW_MS, findDuplicate, pickableSlips, slipFits, specialPrice, type LineOrderInput, type LooseSlip, type RecentOrder } from "@/lib/staff/line-order-rules";

/**
 * Creates a LINE-chat order staff keyed on /staff/line-order (owner list ก11, way 2). Rules = line-order-rules.ts. Reached
 * only through the staff action, which checks the staff session first. Prices, stock and shipping are worked out here the
 * way checkout does it (catalog-resolver.ts, pricing.ts, shipping-rules.ts) — nothing typed by staff is trusted for money.
 * The order is marked channel 'line' + keyed_by (migration 0026), so sales and profit count it once (daily-sales-rules.ts).
 * It does not go to the warehouse here: that is the order page's send button, behind the owner's switch.
 */

export type CreateLineOrderResult =
  | { ok: true; orderNumber: string; confirmed: boolean }
  | { ok: false; error: "address" | "phone" | "postal" | "house" | "item" | "stock" | "slip-taken" | "slip-amount" | "price" }
  | { ok: false; error: "duplicate"; duplicateOf: string };

export function slipsToPick(): LooseSlip[] {
  return pickableSlips(
    looseLineSlips(4).map((s) => ({ transRef: s.transRef, amountSatang: s.amountSatang, transferredAt: s.transferredAt })),
    Date.now()
  );
}

export function createLineOrder(input: LineOrderInput): CreateLineOrderResult {
  const checked = validateAddress({
    recipientName: input.recipientName,
    phone: input.recipientPhone,
    line1: input.line1,
    subdistrict: input.subdistrict,
    district: input.district,
    province: input.province,
    postalCode: input.postalCode,
  });
  if ("error" in checked) {
    const map = { missing: "address", phone: "phone", houseNumber: "house", postal: "postal" } as const;
    return { ok: false, error: map[checked.error] };
  }
  const address = checked.input;

  const live = liveLookup();
  const lines: PricedLine[] = [];
  for (const item of input.items) {
    const catalog = getCatalogItem(item.slug);
    if (!catalog) return { ok: false, error: "item" };
    const ref: ProductRef = { origin: catalog.origin, slug: item.slug, variantId: item.variantId };
    const resolved = resolveProductRef(ref, live);
    if (!resolved.ok) return { ok: false, error: resolved.reason === "out-of-stock" ? "stock" : "item" };
    lines.push(priceLine(resolved.line, item.quantity));
  }

  const db = getDb();
  const result = db.transaction((): CreateLineOrderResult & { slipChecked?: boolean } => {
    const history = loadShippingHistory(db, { memberId: null, phones: [input.customerPhone, address.phone], address }, new Date(), isPostcodeSubdistrict);
    const totals = computeOrderTotals(lines, history);
    // A special price (line-order-rules.ts specialPrice): items and shipping stay at catalogue prices, the order carries the
    // discount; every money check below reads the total the customer actually pays.
    const special = specialPrice(totals.total, input.agreedTotal);
    if (!special.ok) return { ok: false, error: "price" };
    const total = totals.total - (special.discount ?? 0);

    // The same order keyed twice (line-order-rules.ts findDuplicate) — asked before anything else is checked or written.
    if (!input.notDuplicate) {
      const phones = [...new Set([input.customerPhone, address.phone.replace(/[^0-9]/g, "")])];
      const list = phones.map(() => "?").join(", ");
      const recent = db
        .prepare(
          `SELECT o.order_number AS orderNumber, o.total, o.created_at AS createdAt, o.status
             FROM orders o JOIN customers c ON c.id = o.customer_id LEFT JOIN order_shipping_addresses a ON a.order_id = o.id
            WHERE o.created_at >= ? AND (c.phone IN (${list}) OR REPLACE(REPLACE(a.phone, '-', ''), ' ', '') IN (${list}))`
        )
        .all(new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString(), ...phones, ...phones) as RecentOrder[];
      const twin = findDuplicate(recent, total, Date.now());
      if (twin) return { ok: false, error: "duplicate", duplicateOf: twin.orderNumber };
    }

    let slip: LooseSlip | undefined;
    if (input.slipRef) {
      // Read again inside the write: another tab may have used this slip a moment ago.
      const linked = db.prepare("SELECT 1 FROM order_payment_submissions WHERE slip_trans_ref = ?").get(input.slipRef);
      slip = linked ? undefined : slipsToPick().find((s) => s.transRef === input.slipRef);
      const fits = slipFits(slip, total);
      if (fits === "not-loose") return { ok: false, error: "slip-taken" };
      if (fits === "amount") return { ok: false, error: "slip-amount" };
    }

    // Only now, with every check passed: a refused save must leave no customer row behind (a return does not roll back).
    db.prepare("INSERT OR IGNORE INTO customers (phone) VALUES (?)").run(input.customerPhone);
    const customer = db.prepare("SELECT id FROM customers WHERE phone = ?").get(input.customerPhone) as { id: number };

    const orderNumber = generateOrderNumber();
    const orderId = Number(
      db
        .prepare(
          `INSERT INTO orders (order_number, view_token, customer_id, member_id, status, subtotal, shipping_fee, shipping_rule, total, payment_method, channel, keyed_by, discount, discount_by, discount_reason)
           VALUES (?, ?, ?, NULL, 'payment_submitted', ?, ?, ?, ?, 'bank_transfer', 'line', ?, ?, ?, ?)`
        )
        .run(orderNumber, crypto.randomBytes(16).toString("hex"), customer.id, totals.subtotal, totals.shippingFee, totals.shippingRule, total, input.keyedBy, special.discount, special.discount ? input.keyedBy : null, special.discount ? input.priceReason || null : null)
        .lastInsertRowid
    );
    const insertItem = db.prepare(
      `INSERT INTO order_items (order_id, product_slug, variant_id, variant_label, product_name_snapshot, unit_price, quantity, line_total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );
    for (const l of totals.lines) insertItem.run(orderId, l.productSlug, l.variantId, l.variantLabel, l.displayName, l.unitPrice, l.quantity, l.lineTotal);
    db.prepare(
      `INSERT INTO order_shipping_addresses (order_id, recipient_name, phone, line1, subdistrict, district, province, postal_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(orderId, address.recipientName, address.phone, address.line1, address.subdistrict, address.district, address.province, address.postalCode);
    const history_ = db.prepare("INSERT INTO order_status_history (order_id, status, note) VALUES (?, ?, ?)");
    history_.run(orderId, "pending_payment", `Staff: LINE order keyed by ${input.keyedBy}${input.notDuplicate ? " — ticked: not a duplicate" : ""}`);
    if (special.discount) history_.run(orderId, "pending_payment", `Staff (${input.keyedBy}): special price ${totals.total} → ${total} THB${input.priceReason ? ` — ${input.priceReason}` : ""}`);
    history_.run(orderId, "payment_submitted", slip ? "Staff: slip picked from the slip check" : "Staff: no slip in the slip check — confirm the money by hand");
    db.prepare(
      `INSERT INTO order_payment_submissions (order_id, method, reference_note, slip_trans_ref, slip_amount_satang, slip_verdict, slip_reasons)
       VALUES (?, 'bank_transfer', ?, ?, ?, ?, NULL)`
    ).run(orderId, "LINE order (staff)", slip?.transRef ?? null, slip?.amountSatang ?? null, slip ? "pass" : "unchecked");
    // Waiting for the money, like a web order whose slip came in: the next step (confirm) is the slip's, below or by hand.
    db.prepare("UPDATE orders SET status = 'awaiting_verification' WHERE id = ?").run(orderId);
    history_.run(orderId, "awaiting_verification", null);
    return { ok: true, orderNumber, confirmed: false, slipChecked: slip !== undefined };
  })();

  if (!result.ok) return result;
  // The slip check already saw this slip reach the shop's account with the exact total = the money is confirmed, the same
  // step staff press on a web order (it assigns the running number and its history row).
  const confirmed = result.slipChecked ? applyStaffAction(result.orderNumber, "confirm", { note: "LINE order — slip from the slip check" }).ok : false;
  return { ok: true, orderNumber: result.orderNumber, confirmed };
}
