import "server-only";
import crypto from "node:crypto";
import { getDb } from "@/lib/db/client";
import { SITE_URL } from "@/lib/seo";
import { getStaffOrder } from "@/lib/staff/orders";
import { stockIssueStage } from "@/lib/commerce/stock-issue-rules";
import { pushBlock, wooOrderJson, type PushOrder } from "@/lib/woo/order-json";
import { trimLine1 } from "@/lib/commerce/address-line1";
import { orderCreatedTargets } from "@/lib/woo/webhooks";

/**
 * Send one paid order to the warehouse's Shipnity the way a WooCommerce shop does (Shipnity link, owner 28/10): POST the
 * Woo order JSON to every approved "order.created" webhook Shipnity registered, signed like WooCommerce
 * (X-WC-Webhook-Signature = base64 HMAC-SHA256 of the raw body with the webhook secret). Staff press the button on the
 * order page while the link is being tested; LINE alerts and slips are untouched (owner 27/10 — HANDOFF §18).
 * Every attempt is recorded in woo_order_sends; the order then answers on GET /wp-json/wc/v3/orders/<id>.
 */

const TIMEOUT_MS = 15_000;

export function pushOrderFor(orderNumber: string): PushOrder | null {
  const o = getStaffOrder(orderNumber);
  if (!o) return null;
  const refunded = new Set(o.stockIssue?.resolution === "refunded" ? o.stockIssue.outLines.map((l) => l.itemId) : []);
  const lines = o.items
    .map((i, idx) => ({
      itemId: o.itemLines[idx]?.itemId ?? idx + 1,
      productSlug: i.productSlug,
      variantId: i.variantId,
      name: `${i.productName}${i.variantLabel ? ` ${i.variantLabel}` : ""}`,
      sku: o.lines[idx]?.sku ?? null,
      unitPrice: i.unitPrice,
      quantity: i.quantity,
      lineTotal: i.lineTotal,
    }))
    .filter((l) => !refunded.has(l.itemId));
  const a = o.shippingAddress;
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    createdAt: o.createdAt,
    shippingFee: o.shippingFee,
    lines,
    recipientName: a.recipientName,
    phone: a.phone,
    // Owner 29/10 (order C159): line 1 that repeats the boxes below showed twice in Shipnity — send it without the repeat.
    line1: trimLine1(a.line1, a),
    subdistrict: a.subdistrict,
    district: a.district,
    province: a.province,
    postalCode: a.postalCode,
  };
}

export function sign(body: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(body, "utf8").digest("base64");
}

export type PushResult =
  | { ok: true }
  | { ok: false; error: "not-found" | "not-approved" | "already-sent" | "stock-open" | "no-target" | "no-sku" | "failed"; detail?: string };

export async function pushOrder(orderNumber: string): Promise<PushResult> {
  // Checked on the server at the moment of sending, not only by which button the page showed (checker #957: a page left
  // open in a second tab could send an unpaid or cancelled order).
  const detail = getStaffOrder(orderNumber);
  if (!detail) return { ok: false, error: "not-found" };
  const block = pushBlock({
    status: detail.status,
    alreadySent: sendState(detail.id)?.firstSentAt != null,
    stockOpen: detail.stockIssue !== null && stockIssueStage(detail.stockIssue) !== "resolved",
  });
  if (block) return { ok: false, error: block };
  const order = pushOrderFor(orderNumber);
  if (!order) return { ok: false, error: "not-found" };
  if (order.lines.length === 0 || order.lines.some((l) => !l.sku)) return { ok: false, error: "no-sku" };
  const targets = orderCreatedTargets();
  if (targets.length === 0) return { ok: false, error: "no-target" };
  // Claim the order before the network call, so a double click (or two staff at once) sends it once: only a new order
  // or one whose last try failed can be claimed.
  const claimed = getDb()
    .prepare(
      `INSERT INTO woo_order_sends (order_id, status) VALUES (?, 'sending')
       ON CONFLICT(order_id) DO UPDATE SET status = 'sending' WHERE woo_order_sends.status = 'failed'`
    )
    .run(order.id).changes;
  if (claimed !== 1) return { ok: false, error: "already-sent" };

  const body = JSON.stringify(wooOrderJson(order, SITE_URL));
  let delivered = 0;
  let lastStatus: number | null = null;
  let lastError: string | null = null;
  for (const t of targets) {
    try {
      const res = await fetch(t.deliveryUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "WooCommerce/9.9.0 Hookshot (WordPress/6.8)",
          "X-WC-Webhook-Source": `${SITE_URL}/`,
          "X-WC-Webhook-Topic": "order.created",
          "X-WC-Webhook-Resource": "order",
          "X-WC-Webhook-Event": "created",
          "X-WC-Webhook-ID": String(t.id),
          "X-WC-Webhook-Delivery-ID": String(Date.now()),
          "X-WC-Webhook-Signature": sign(body, t.secret),
        },
        body,
        signal: AbortSignal.timeout(TIMEOUT_MS),
        redirect: "error",
      });
      lastStatus = res.status;
      if (res.ok) delivered++;
      else lastError = (await res.text().catch(() => "")).slice(0, 300) || `HTTP ${res.status}`;
    } catch (e) {
      lastError = (e instanceof Error ? e.message : String(e)).slice(0, 300);
    }
  }

  const ok = delivered === targets.length;
  getDb()
    .prepare(
      `INSERT INTO woo_order_sends (order_id, status, attempts, http_status, last_error, first_sent_at, last_attempt_at)
       VALUES (?, ?, 1, ?, ?, CASE WHEN ? THEN strftime('%Y-%m-%dT%H:%M:%fZ','now') END, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
       ON CONFLICT(order_id) DO UPDATE SET status = excluded.status, attempts = attempts + 1, http_status = excluded.http_status,
         last_error = excluded.last_error, first_sent_at = COALESCE(first_sent_at, excluded.first_sent_at),
         last_attempt_at = excluded.last_attempt_at`
    )
    .run(order.id, ok ? "sent" : "failed", lastStatus, ok ? null : lastError, ok ? 1 : 0);
  return ok ? { ok: true } : { ok: false, error: "failed", detail: lastError ?? undefined };
}

export interface SendState {
  status: string;
  attempts: number;
  httpStatus: number | null;
  lastError: string | null;
  firstSentAt: string | null;
  lastAttemptAt: string;
}

export function sendState(orderId: number): SendState | null {
  const r = getDb().prepare("SELECT * FROM woo_order_sends WHERE order_id = ?").get(orderId) as
    | { status: string; attempts: number; http_status: number | null; last_error: string | null; first_sent_at: string | null; last_attempt_at: string }
    | undefined;
  return r
    ? { status: r.status, attempts: r.attempts, httpStatus: r.http_status, lastError: r.last_error, firstSentAt: r.first_sent_at, lastAttemptAt: r.last_attempt_at }
    : null;
}

/** The orders Shipnity may read back on GET /orders: only orders already sent to it. */
export function sentOrders(): PushOrder[] {
  const rows = getDb()
    .prepare("SELECT o.order_number FROM woo_order_sends s JOIN orders o ON o.id = s.order_id WHERE s.first_sent_at IS NOT NULL ORDER BY s.order_id DESC LIMIT 200")
    .all() as { order_number: string }[];
  return rows.map((r) => pushOrderFor(r.order_number)).filter((x): x is PushOrder => x !== null);
}

export function shipnityReady(): boolean {
  return orderCreatedTargets().length > 0;
}
