/**
 * OKami24 — the Woo look-alike for the warehouse's Shipnity (Shipnity link step 1, owner 27/10).
 *
 *   1. credentials: Basic auth and the query-string form both parse; anything not ck_/cs_ + 40 hex is refused; the log's
 *      query never keeps a credential;
 *   2. catalog: every listed code is a real code from sku-map.ts, no code twice, every id unique and positive;
 *   3. the API: unsigned calls get 401 (except the two index pages); no price leaves with a product; orders = only what
 *      the order source gives (orders already sent); webhooks are stored, https only, never echo the secret;
 *      a stock write is recorded only for the code it targets and only the stock fields are read; unknown routes 404;
 *   4. the order sent to Shipnity (order-json.ts): Shipnity codes as sku, the real shipping fee on its own line, free
 *      shipping as a discount, total = what the customer paid, nothing but what packing needs; the log hides secrets.
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import { handle, readStockFields, type ApiRequest, type StockReportView, type WebhookInput, type WebhookView } from "./api";
import { wooCatalog } from "./catalog";
import { parseCredentials, redactSecrets, safeQuery } from "./credentials";
import { pushBlock, wooOrderJson, type PushOrder } from "./order-json";
import { FLAT_SHIPPING_FEE_THB } from "@/lib/commerce/pricing";
import { SHIPNITY_SKU_MAP } from "@/data/stock/sku-map";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

// 1. credentials
const ck = `ck_${"a".repeat(40)}`;
const cs = `cs_${"b".repeat(40)}`;
const basic = `Basic ${Buffer.from(`${ck}:${cs}`).toString("base64")}`;
check("Basic auth parses", parseCredentials(basic, new URLSearchParams())?.key === ck);
check("query-string credentials parse", parseCredentials(null, new URLSearchParams({ consumer_key: ck, consumer_secret: cs }))?.secret === cs);
check("a malformed key is refused", parseCredentials(null, new URLSearchParams({ consumer_key: "ck_123", consumer_secret: cs })) === null);
check("no credentials = null", parseCredentials(null, new URLSearchParams()) === null);
const logged = safeQuery(new URLSearchParams({ consumer_key: ck, consumer_secret: cs, oauth_signature: "x", per_page: "100" }));
check("log query keeps no credential", logged === "per_page=100", logged);

// 2. catalog
const catalog = wooCatalog();
const mapped = new Set(
  Object.values(SHIPNITY_SKU_MAP).flatMap((e) => (e.options ? Object.values(e.options) : [e.product])).filter((v): v is string => typeof v === "string" && v !== "check")
);
const listed = catalog.flatMap((p) => (p.variations.length ? p.variations.map((v) => v.sku) : [p.sku]));
check("catalog lists at least one product", catalog.length > 0, String(catalog.length));
const foreign = listed.filter((s) => !mapped.has(s));
check("every listed code comes from sku-map.ts", foreign.length === 0, foreign.join(", "));
check("no code listed twice", new Set(listed).size === listed.length);
const ids = catalog.flatMap((p) => [p.id, ...p.variations.map((v) => v.id)]);
check("every id unique", new Set(ids).size === ids.length);
check("every id a positive 32-bit int", ids.every((i) => Number.isInteger(i) && i > 0 && i < 2 ** 31));

// 3. the API
function memHooks() {
  const m = new Map<number, WebhookView & { secret: string }>();
  let next = 1;
  const strip = (w: WebhookView & { secret: string }): WebhookView => ({ id: w.id, name: w.name, topic: w.topic, deliveryUrl: w.deliveryUrl, status: w.status, createdAt: w.createdAt });
  return {
    secrets: m,
    list: () => [...m.values()].map(strip),
    get: (id: number) => (m.has(id) ? strip(m.get(id)!) : null),
    create: (w: WebhookInput) => {
      const v = { ...w, id: next++, createdAt: "2026-10-28T11:08:00.000Z" };
      m.set(v.id, v);
      return strip(v);
    },
    update: (id: number, patch: Partial<WebhookInput>) => {
      const cur = m.get(id);
      if (!cur) return null;
      const v = { ...cur, ...patch };
      m.set(id, v);
      return strip(v);
    },
    remove: (id: number) => {
      const cur = m.get(id);
      if (!cur) return null;
      m.delete(id);
      return strip(cur);
    },
  };
}
const req = (over: Partial<ApiRequest>): ApiRequest => ({
  method: "GET",
  segments: [],
  query: new URLSearchParams(),
  body: null,
  signed: true,
  siteUrl: "https://okami24.store",
  catalog,
  reports: new Map<string, StockReportView>(),
  hooks: memHooks(),
  orders: { list: () => [] },
  ...over,
});
check("/wp-json index is public", handle(req({ signed: false })).status === 200);
check("/wp-json/wc/v3 index is public", handle(req({ signed: false, segments: ["wc", "v3"] })).status === 200);
check("unsigned product list = 401", handle(req({ signed: false, segments: ["wc", "v3", "products"] })).status === 401);
check("unsigned write = 401", handle(req({ signed: false, method: "PUT", segments: ["wc", "v3", "products", "1"] })).status === 401);

const list = handle(req({ segments: ["wc", "v3", "products"], query: new URLSearchParams({ per_page: "100" }) }));
check("signed product list = 200 with paging headers", list.status === 200 && list.headers?.["X-WP-Total"] === String(catalog.length));
const all: unknown[] = [];
for (let page = 1; page <= Math.ceil(catalog.length / 100); page++) {
  const r = handle(req({ segments: ["wc", "v3", "products"], query: new URLSearchParams({ per_page: "100", page: String(page) }) }));
  all.push(...(r.json as unknown[]));
}
check("paging returns every product", all.length === catalog.length, `${all.length} / ${catalog.length}`);
const priced = JSON.stringify(all).match(/"(price|regular_price|sale_price)":"[^"]+"/);
check("no price leaves the site", priced === null, priced?.[0] ?? "");
check("v2 answers like v3", handle(req({ segments: ["wc", "v2", "products"] })).status === 200);

const variable = catalog.find((p) => p.variations.length > 0);
if (variable) {
  const v = variable.variations[0];
  const vars = handle(req({ segments: ["wc", "v3", "products", String(variable.id), "variations"], query: new URLSearchParams({ per_page: "100" }) }));
  check("variations list = 200", vars.status === 200 && (vars.json as unknown[]).length === variable.variations.length);
  const bySku = handle(req({ segments: ["wc", "v3", "products"], query: new URLSearchParams({ sku: v.sku }) }));
  check("sku filter finds a variation", (bySku.json as { id: number }[]).some((x) => x.id === v.id));

  const reports = new Map<string, StockReportView>();
  const w = handle(
    req({
      method: "PUT",
      segments: ["wc", "v3", "products", String(variable.id), "variations", String(v.id)],
      body: { stock_quantity: "7", manage_stock: true, price: "1", name: "x" },
      reports,
    })
  );
  check("variation stock write recorded for its code only", w.writes.length === 1 && w.writes[0].sku === v.sku && w.writes[0].quantity === 7);
  check("the answer shows the new number", (w.json as { stock_quantity: number }).stock_quantity === 7);
  check("a number > 0 reads in stock", (w.json as { stock_status: string }).stock_status === "instock");
  check("a price in the write is ignored", (w.json as { price: string }).price === "");

  const batch = handle(
    req({
      method: "POST",
      segments: ["wc", "v3", "products", String(variable.id), "variations", "batch"],
      body: { update: [{ id: v.id, stock_status: "outofstock" }, { id: 1, stock_quantity: 3 }] },
    })
  );
  check("variation batch: known id recorded, unknown id refused", batch.writes.length === 1 && batch.writes[0].stockStatus === "outofstock");
}
const simple = catalog.find((p) => p.variations.length === 0);
if (simple) {
  const w = handle(req({ method: "POST", segments: ["wc", "v3", "products", "batch"], body: { update: [{ id: simple.id, stock_quantity: 0 }] } }));
  check("product batch write recorded", w.writes.length === 1 && w.writes[0].sku === simple.sku && w.writes[0].quantity === 0);
}
check("write without stock fields records nothing", readStockFields({ name: "x", price: "9" }) === null);
check("bad stock status ignored", readStockFields({ stock_status: "soon" }) === null);

const orders = handle(req({ segments: ["wc", "v3", "orders"] }));
check("orders list empty when nothing was sent", orders.status === 200 && Array.isArray(orders.json) && (orders.json as unknown[]).length === 0);
const sentOne = handle(req({ segments: ["wc", "v3", "orders", "41"], orders: { list: () => [{ id: 41 }] } }));
check("a sent order reads back by id", sentOne.status === 200 && (sentOne.json as { id: number }).id === 41);
check("an order not sent = 404", handle(req({ segments: ["wc", "v3", "orders", "40"], orders: { list: () => [{ id: 41 }] } })).status === 404);

// webhooks (Shipnity registers order.created/updated/deleted on connect — log 28/10)
const hooks = memHooks();
const hookBody = { name: "Shipnity Order Created Webhook", topic: "order.created", delivery_url: "https://hooks.example/woo/abc", status: "active", secret: "s3cr3t" };
const made = handle(req({ method: "POST", segments: ["wc", "v3", "webhooks"], body: hookBody, hooks }));
check("webhook POST = 201 and stored", made.status === 201 && hooks.list().length === 1);
check("webhook answer never carries the secret", !JSON.stringify(made.json).includes("s3cr3t"));
check("the secret is kept for signing", [...hooks.secrets.values()][0]?.secret === "s3cr3t");
check("http delivery URL refused", handle(req({ method: "POST", segments: ["wc", "v3", "webhooks"], body: { ...hookBody, delivery_url: "http://hooks.example/x" }, hooks })).status === 400);
check("unknown topic refused", handle(req({ method: "POST", segments: ["wc", "v3", "webhooks"], body: { ...hookBody, topic: "action.woocommerce_x" }, hooks })).status === 400);
const hookList = handle(req({ segments: ["wc", "v3", "webhooks"], hooks }));
check("webhook list shows it", (hookList.json as { topic: string }[])[0]?.topic === "order.created");
check("webhook PUT with an http URL = 400", handle(req({ method: "PUT", segments: ["wc", "v3", "webhooks", "1"], body: { delivery_url: "http://x.example/h" }, hooks })).status === 400);
check("webhook DELETE removes it", handle(req({ method: "DELETE", segments: ["wc", "v3", "webhooks", "1"], hooks })).status === 200 && hooks.list().length === 0);
check("unsigned webhook list = 401", handle(req({ signed: false, segments: ["wc", "v3", "webhooks"] })).status === 401);
check("sender-name setting answers", handle(req({ segments: ["wc", "v3", "settings", "email", "woocommerce_email_from_name"] })).status === 200);
const red = redactSecrets(JSON.stringify(hookBody));
check("log body hides the webhook secret", !red.includes("s3cr3t") && red.includes("<hidden>"));

// 4. the order sent to Shipnity
const base: PushOrder = {
  id: 41,
  orderNumber: "OK-20261028-abc123",
  createdAt: "2026-10-28T11:00:00.000Z",
  shippingFee: FLAT_SHIPPING_FEE_THB,
  lines: [{ itemId: 7, productSlug: "muro-salt-nic", variantId: "grape", name: "Muro Salt Nic Grape", sku: "ELQ-4-1", unitPrice: 250, quantity: 1, lineTotal: 250 }],
  recipientName: "ทดสอบ ระบบ",
  phone: "0800000000",
  line1: "1/1 ถนนทดสอบ",
  subdistrict: "ตำบล",
  district: "อำเภอ",
  province: "จังหวัด",
  postalCode: "10000",
};
const paid = wooOrderJson(base, "https://okami24.store");
check("order: sku = Shipnity code", paid.line_items[0].sku === "ELQ-4-1");
check("order: real shipping on its own line", paid.shipping_lines[0].total === FLAT_SHIPPING_FEE_THB.toFixed(2));
check("order: paid shipping = no discount, total = customer total", paid.discount_total === "0.00" && paid.total === (250 + FLAT_SHIPPING_FEE_THB).toFixed(2));
const free = wooOrderJson({ ...base, shippingFee: 0, lines: [{ ...base.lines[0], quantity: 2, lineTotal: 500 }] }, "https://okami24.store");
check(
  "order: free shipping = shop-paid discount, total = customer total",
  free.shipping_total === FLAT_SHIPPING_FEE_THB.toFixed(2) && free.discount_total === FLAT_SHIPPING_FEE_THB.toFixed(2) && free.total === "500.00" && free.coupon_lines.length === 1
);
check("order: address mapped (Thai fields)", paid.shipping.address_2 === "ตำบล" && paid.shipping.city === "อำเภอ" && paid.shipping.state === "จังหวัด" && paid.shipping.country === "TH");
const orderText = JSON.stringify(paid);
check("order: no e-mail, note or slip", paid.billing.email === "" && paid.customer_note === "" && !/slip|สลิป|refund_|promptpay/i.test(orderText));
for (const status of ["pending_payment", "payment_submitted", "awaiting_verification", "processing", "shipped", "completed", "cancelled"]) {
  check(`push refused for ${status}`, pushBlock({ status, alreadySent: false, stockOpen: false }) === "not-approved");
}
check("push allowed for approved, never sent, no stock problem", pushBlock({ status: "approved", alreadySent: false, stockOpen: false }) === null);
check("push refused once sent (no duplicate)", pushBlock({ status: "approved", alreadySent: true, stockOpen: false }) === "already-sent");
check("push refused while an out-of-stock problem is open", pushBlock({ status: "approved", alreadySent: false, stockOpen: true }) === "stock-open");
check("order: marked paid (processing)", paid.status === "processing" && paid.set_paid === true);
check("unknown product id = 404", handle(req({ segments: ["wc", "v3", "products", "5"] })).status === 404);
check("unknown route = 404", handle(req({ segments: ["wc", "v3", "customers"] })).status === 404);
check("unknown namespace = 404", handle(req({ segments: ["wp", "v2", "users"] })).status === 404);

for (const res of results) {
  console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
}
const failed = results.filter((x) => !x.passed);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
