import "server-only";
import crypto from "node:crypto";
import { getDb } from "@/lib/db/client";
import { requireCustomer, getSession } from "./session";
import { getCart, clearCart } from "./cart";
import { computeOrderTotals } from "./pricing";
import { getOwnedAddress } from "./addresses";
import { syncOrderToShipnity } from "@/lib/shipnity/adapter";
import type { OrderStatus } from "./order-status";

export interface OrderSummary {
  id: number;
  orderNumber: string;
  viewToken: string;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  total: number;
  createdAt: string;
}

export interface OrderItemDetail {
  productSlug: string;
  variantId: string | null;
  variantLabel: string | null;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderShippingAddress {
  recipientName: string;
  phone: string;
  line1: string;
  subdistrict: string;
  district: string;
  province: string;
  postalCode: string;
}

export interface OrderDetail extends OrderSummary {
  items: OrderItemDetail[];
  shippingAddress: OrderShippingAddress;
  statusHistory: { status: string; note: string | null; createdAt: string }[];
}

interface OrderRow {
  id: number;
  order_number: string;
  view_token: string;
  customer_id: number;
  status: string;
  subtotal: number;
  shipping_fee: number;
  total: number;
  created_at: string;
}

function toSummary(row: OrderRow): OrderSummary {
  return {
    id: row.id,
    orderNumber: row.order_number,
    viewToken: row.view_token,
    status: row.status as OrderStatus,
    subtotal: row.subtotal,
    shippingFee: row.shipping_fee,
    total: row.total,
    createdAt: row.created_at,
  };
}

function getOrderRowById(id: number): OrderRow | undefined {
  return getDb().prepare("SELECT * FROM orders WHERE id = ?").get(id) as OrderRow | undefined;
}

function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = crypto.randomBytes(3).toString("hex");
  return `OK-${date}-${suffix}`;
}

export type PlaceOrderResult =
  | { ok: true; order: OrderSummary }
  | {
      ok: false;
      error: string;
      code: "empty-cart" | "cart-has-problems" | "address-not-found" | "idempotency-conflict";
    };

/**
 * The one place an order is ever created. Re-resolves cart contents, price, and stock fresh
 * (never trusts anything client-submitted) and is safe to call more than once with the same
 * `idempotencyKey` — a double-submit or a client retry after a dropped response replays into the
 * SAME order instead of creating a duplicate. See migrations/0001_init.sql's comment on
 * `idempotency_keys` for the concurrency argument.
 */
export async function placeOrder(addressId: number, idempotencyKey: string): Promise<PlaceOrderResult> {
  const customer = await requireCustomer();
  const db = getDb();

  const existingKey = db.prepare("SELECT order_id FROM idempotency_keys WHERE key = ?").get(idempotencyKey) as
    | { order_id: number | null }
    | undefined;
  if (existingKey) {
    if (existingKey.order_id === null) {
      return { ok: false, error: "This checkout is already being processed.", code: "idempotency-conflict" };
    }
    const row = getOrderRowById(existingKey.order_id);
    if (row) return { ok: true, order: toSummary(row) };
  }

  const address = await getOwnedAddress(addressId);
  if (!address) return { ok: false, error: "Address not found.", code: "address-not-found" };

  const cart = await getCart();
  const purchasableLines = cart.lines.filter((l) => l.problem === undefined);
  if (purchasableLines.length === 0) {
    return { ok: false, error: "Your cart is empty or has no purchasable items.", code: "empty-cart" };
  }
  if (cart.hasProblems) {
    return {
      ok: false,
      error: "Some items in your cart are no longer available. Remove them to continue.",
      code: "cart-has-problems",
    };
  }

  const totals = computeOrderTotals(purchasableLines);

  let orderId: number;
  try {
    const createOrder = db.transaction(() => {
      // Claiming the key inside the transaction is what makes two concurrent requests with the
      // same key mutually exclusive: the UNIQUE constraint on idempotency_keys.key throws for
      // whichever transaction loses the race, and the catch block below recovers the winner's
      // order instead of erroring out.
      db.prepare("INSERT INTO idempotency_keys (key, order_id) VALUES (?, NULL)").run(idempotencyKey);

      const orderNumber = generateOrderNumber();
      const viewToken = crypto.randomBytes(16).toString("hex");
      const insertOrder = db
        .prepare(
          `INSERT INTO orders (order_number, view_token, customer_id, status, subtotal, shipping_fee, total, payment_method)
           VALUES (?, ?, ?, 'pending_payment', ?, ?, ?, 'bank_transfer')`
        )
        .run(orderNumber, viewToken, customer.id, totals.subtotal, totals.shippingFee, totals.total);
      const newOrderId = Number(insertOrder.lastInsertRowid);

      const insertItem = db.prepare(
        `INSERT INTO order_items (order_id, product_slug, variant_id, variant_label, product_name_snapshot, unit_price, quantity, line_total)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      );
      for (const line of totals.lines) {
        insertItem.run(
          newOrderId,
          line.productSlug,
          line.variantId,
          line.variantLabel,
          line.displayName,
          line.unitPrice,
          line.quantity,
          line.lineTotal
        );
      }

      db.prepare(
        `INSERT INTO order_shipping_addresses (order_id, recipient_name, phone, line1, subdistrict, district, province, postal_code)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        newOrderId,
        address.recipientName,
        address.phone,
        address.line1,
        address.subdistrict,
        address.district,
        address.province,
        address.postalCode
      );

      db.prepare("INSERT INTO order_status_history (order_id, status, note) VALUES (?, 'pending_payment', 'Order created')").run(
        newOrderId
      );
      db.prepare("UPDATE idempotency_keys SET order_id = ? WHERE key = ?").run(newOrderId, idempotencyKey);

      return newOrderId;
    });
    orderId = createOrder();
  } catch {
    const winner = db.prepare("SELECT order_id FROM idempotency_keys WHERE key = ?").get(idempotencyKey) as
      | { order_id: number | null }
      | undefined;
    if (winner?.order_id) {
      const row = getOrderRowById(winner.order_id);
      if (row) return { ok: true, order: toSummary(row) };
    }
    return { ok: false, error: "This checkout is already being processed.", code: "idempotency-conflict" };
  }

  // `cart.cartId` is guaranteed non-null here: `getCart()` only ever returns lines alongside a
  // real cart id, and `purchasableLines.length > 0` was already checked above.
  await clearCart(cart.cartId!);
  const orderRow = getOrderRowById(orderId)!;
  const order = toSummary(orderRow);

  // Shipnity sync is downstream and retryable — a failure here must never undo or fail the order
  // itself, which is already real and already committed.
  syncOrderToShipnity(orderId, {
    orderId,
    orderNumber: order.orderNumber,
    items: totals.lines.map((l) => ({ productSlug: l.productSlug, variantId: l.variantId, quantity: l.quantity })),
    shippingAddress: address,
  }).catch((err) => console.error(`[shipnity:sync] order ${order.orderNumber} threw`, err));

  return { ok: true, order };
}

function assembleDetail(row: OrderRow): OrderDetail {
  const db = getDb();
  const items = db
    .prepare(
      "SELECT product_slug, variant_id, variant_label, product_name_snapshot, unit_price, quantity, line_total FROM order_items WHERE order_id = ? ORDER BY id"
    )
    .all(row.id) as {
    product_slug: string;
    variant_id: string | null;
    variant_label: string | null;
    product_name_snapshot: string;
    unit_price: number;
    quantity: number;
    line_total: number;
  }[];
  const address = db
    .prepare("SELECT * FROM order_shipping_addresses WHERE order_id = ?")
    .get(row.id) as {
    recipient_name: string;
    phone: string;
    line1: string;
    subdistrict: string;
    district: string;
    province: string;
    postal_code: string;
  };
  const history = db
    .prepare("SELECT status, note, created_at FROM order_status_history WHERE order_id = ? ORDER BY id")
    .all(row.id) as { status: string; note: string | null; created_at: string }[];

  return {
    ...toSummary(row),
    items: items.map((i) => ({
      productSlug: i.product_slug,
      variantId: i.variant_id,
      variantLabel: i.variant_label,
      productName: i.product_name_snapshot,
      unitPrice: i.unit_price,
      quantity: i.quantity,
      lineTotal: i.line_total,
    })),
    shippingAddress: {
      recipientName: address.recipient_name,
      phone: address.phone,
      line1: address.line1,
      subdistrict: address.subdistrict,
      district: address.district,
      province: address.province,
      postalCode: address.postal_code,
    },
    statusHistory: history.map((h) => ({ status: h.status, note: h.note, createdAt: h.created_at })),
  };
}

/**
 * Anti-enumeration order lookup: an order's full detail is only ever returned to (a) the
 * authenticated owning customer, or (b) a caller presenting the exact `viewToken` minted at order
 * creation (the guest-checkout path — see the order-number vs. view-token comment in
 * migrations/0001_init.sql). Knowing `orderNumber` alone is never sufficient.
 */
export async function getOrderDetailForViewer(orderNumber: string, viewToken: string | null): Promise<OrderDetail | null> {
  const row = getDb().prepare("SELECT * FROM orders WHERE order_number = ?").get(orderNumber) as OrderRow | undefined;
  if (!row) return null;

  const session = await getSession();
  const isOwner = session !== null && session.id === row.customer_id;
  const hasValidToken = viewToken !== null && viewToken.length > 0 && viewToken === row.view_token;
  if (!isOwner && !hasValidToken) return null;

  return assembleDetail(row);
}

// The customer's "I have paid" claim lives in payment-slip.ts since the cart round 22/10 (slip upload +
// EasySlip check); the old note-only claim was removed so there is one way to mark an order paid.

export async function listOrdersForCustomer(): Promise<OrderSummary[]> {
  const customer = await requireCustomer();
  const rows = getDb()
    .prepare("SELECT * FROM orders WHERE customer_id = ? ORDER BY id DESC")
    .all(customer.id) as OrderRow[];
  return rows.map(toSummary);
}
