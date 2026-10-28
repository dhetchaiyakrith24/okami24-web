import type { WooProduct, WooVariation } from "@/lib/woo/catalog";

/**
 * A WooCommerce REST API look-alike, just big enough for the warehouse's Shipnity (Shipnity link step 1, owner 27/10).
 * Shipnity publishes no spec of the calls it makes; its guide only says it reads products by SKU and pushes the stock
 * count to the shop (blog.shipnity.com, WooCommerce connection). So this answers the standard read/write calls of
 * woocommerce.github.io/woocommerce-rest-api-docs for products and variations, under wc/v1, v2 and v3 alike, and every
 * call is logged (src/app/wp-json) so the next step can follow what Shipnity really sends.
 *
 * What a signed caller can do — nothing more:
 *   - read the products / variations list (name, SKU = Shipnity code, stock state; no price, BSOT §5);
 *   - send a stock number or stock state per product / variation → recorded in woo_stock_reports, which the site reads
 *     at runtime for product pages, cart and checkout (src/lib/stock/live.ts, owner 28/10);
 *   - register / read / change / delete webhooks (Shipnity registers order.created/updated/deleted when it connects —
 *     log 28/10); an order goes to one only after staff approve it on /staff/shipnity (order-push.ts);
 *   - read the orders already sent to it (Woo order objects, no slip — owner 27/10); everything else is not listed;
 *   - read the shop's e-mail sender name (Shipnity asks on connect).
 * Every other field in a write is ignored; anything else answers WooCommerce's own "no route" 404.
 * Pure: the route does the database and the log.
 */

export interface StockWrite {
  sku: string;
  quantity: number | null;
  stockStatus: string | null;
}

export interface StockReportView {
  quantity: number | null;
  stockStatus: string | null;
}

export interface WebhookInput {
  name: string;
  topic: string;
  deliveryUrl: string;
  secret: string;
  status: string;
}

export interface WebhookView {
  id: number;
  name: string;
  topic: string;
  deliveryUrl: string;
  status: string;
  createdAt: string;
}

/** Where webhooks live (the database in the route, a Map in the contract test). */
export interface WebhookStore {
  list(): WebhookView[];
  get(id: number): WebhookView | null;
  create(w: WebhookInput): WebhookView;
  update(id: number, patch: Partial<WebhookInput>): WebhookView | null;
  remove(id: number): WebhookView | null;
}

/** The orders already sent to the warehouse, as Woo order objects (src/lib/woo/order-json.ts). */
export interface OrderSource {
  list(): { id: number }[];
}

export interface ApiRequest {
  method: string;
  /** Path segments after /wp-json, e.g. ["wc", "v3", "products", "123"]. */
  segments: string[];
  query: URLSearchParams;
  body: unknown;
  signed: boolean;
  siteUrl: string;
  catalog: WooProduct[];
  reports: Map<string, StockReportView>;
  hooks: WebhookStore;
  orders: OrderSource;
}

export interface ApiResponse {
  status: number;
  json: unknown;
  headers?: Record<string, string>;
  writes: StockWrite[];
  /** Shipnity changed an order it was sent (status, or deleted) — the route records it and alerts staff. */
  orderUpdates?: OrderUpdate[];
}

export interface OrderUpdate {
  orderId: number;
  /** The Woo status Shipnity set ("cancelled", "completed", …), "deleted" for a DELETE, null when the body had none. */
  status: string | null;
}

/** The order status in a write body — only a known Woo status word is taken. */
export function readOrderStatus(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const s = (body as Record<string, unknown>).status;
  return typeof s === "string" && /^(pending|processing|on-hold|completed|cancelled|refunded|failed|trash)$/.test(s) ? s : null;
}

const NAMESPACES = ["wc/v1", "wc/v2", "wc/v3"];
const DATE = "2026-10-27T00:00:00";
const OPTION_LABEL = "ตัวเลือก";

const err = (status: number, code: string, message: string): ApiResponse => ({
  status,
  json: { code, message, data: { status } },
  writes: [],
});
const noRoute = () => err(404, "rest_no_route", "No route was found matching the URL and request method.");
const ok = (json: unknown, headers?: Record<string, string>, writes: StockWrite[] = [], status = 200): ApiResponse => ({
  status,
  json,
  headers,
  writes,
});

function stockOf(sku: string, inStock: boolean, reports: Map<string, StockReportView>) {
  const r = sku ? reports.get(sku) : undefined;
  // With manage_stock on, WooCommerce derives the status from the number; a status alone is kept as sent.
  const fromNumber = r?.quantity == null ? null : r.quantity > 0 ? "instock" : "outofstock";
  return {
    manage_stock: true,
    stock_quantity: r?.quantity ?? null,
    stock_status: fromNumber ?? r?.stockStatus ?? (inStock ? "instock" : "outofstock"),
  };
}

function productJson(p: WooProduct, req: ApiRequest) {
  const variable = p.variations.length > 0;
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    permalink: `${req.siteUrl}/products/${p.slug}`,
    date_created: DATE,
    date_created_gmt: DATE,
    date_modified: DATE,
    date_modified_gmt: DATE,
    type: variable ? "variable" : "simple",
    status: "publish",
    featured: false,
    catalog_visibility: "visible",
    description: "",
    short_description: "",
    sku: p.sku,
    price: "",
    regular_price: "",
    sale_price: "",
    on_sale: false,
    purchasable: true,
    virtual: false,
    downloadable: false,
    ...stockOf(p.sku, p.inStock, req.reports),
    backorders: "no",
    backorders_allowed: false,
    sold_individually: false,
    parent_id: 0,
    categories: [],
    tags: [],
    images: [],
    attributes: variable
      ? [{ id: 0, name: OPTION_LABEL, position: 0, visible: true, variation: true, options: p.variations.map((v) => v.optionName) }]
      : [],
    default_attributes: [],
    variations: p.variations.map((v) => v.id),
    meta_data: [],
  };
}

function variationJson(v: WooVariation, p: WooProduct, req: ApiRequest) {
  return {
    id: v.id,
    parent_id: p.id,
    date_created: DATE,
    date_modified: DATE,
    permalink: `${req.siteUrl}/products/${p.slug}`,
    sku: v.sku,
    price: "",
    regular_price: "",
    sale_price: "",
    on_sale: false,
    status: "publish",
    purchasable: true,
    virtual: false,
    downloadable: false,
    ...stockOf(v.sku, v.inStock, req.reports),
    backorders: "no",
    backorders_allowed: false,
    image: null,
    attributes: [{ id: 0, name: OPTION_LABEL, option: v.optionName }],
    meta_data: [],
  };
}

/** A variation asked for through /products/<id> (WooCommerce allows it) — shaped as a product of type "variation". */
function variationAsProduct(v: WooVariation, p: WooProduct, req: ApiRequest) {
  return { ...variationJson(v, p, req), name: `${p.name} - ${v.optionName}`, slug: `${p.slug}-${v.id}`, type: "variation" };
}

function page<T>(items: T[], query: URLSearchParams): { items: T[]; headers: Record<string, string> } {
  const perPage = Math.min(100, Math.max(1, Number(query.get("per_page")) || 10));
  const pageNo = Math.max(1, Number(query.get("page")) || 1);
  const total = items.length;
  return {
    items: items.slice((pageNo - 1) * perPage, pageNo * perPage),
    headers: { "X-WP-Total": String(total), "X-WP-TotalPages": String(Math.max(1, Math.ceil(total / perPage))) },
  };
}

/** A Woo webhook object — never with the secret (WooCommerce does not echo it either). */
function webhookJson(w: WebhookView) {
  const [resource, event] = w.topic.split(".");
  return {
    id: w.id,
    name: w.name,
    status: w.status,
    topic: w.topic,
    resource: resource ?? "",
    event: event ?? "",
    hooks: [`woocommerce_new_${resource ?? ""}`],
    delivery_url: w.deliveryUrl,
    date_created: w.createdAt.replace(/\.\d+Z$/, ""),
    date_modified: w.createdAt.replace(/\.\d+Z$/, ""),
  };
}

const TOPIC = /^(order|product|customer|coupon)\.(created|updated|deleted|restored)$/;

/** The webhook fields of a POST/PUT body. A delivery URL must be https; a new webhook needs topic + URL. */
export function readWebhook(body: unknown, partial = false): Partial<WebhookInput> | null {
  if (!body || typeof body !== "object") return partial ? {} : null;
  const b = body as Record<string, unknown>;
  const str = (k: string, max: number) => (typeof b[k] === "string" ? (b[k] as string).trim().slice(0, max) : undefined);
  const topic = str("topic", 40);
  const url = str("delivery_url", 500);
  const out: Partial<WebhookInput> = {};
  if (topic !== undefined) {
    if (!TOPIC.test(topic)) return null;
    out.topic = topic;
  }
  if (url !== undefined) {
    try {
      if (new URL(url).protocol !== "https:") return null;
    } catch {
      return null;
    }
    out.deliveryUrl = url;
  }
  const name = str("name", 120);
  if (name !== undefined) out.name = name;
  const secret = str("secret", 200);
  if (secret !== undefined) out.secret = secret;
  const status = str("status", 20);
  if (status !== undefined) out.status = /^(active|paused|disabled)$/.test(status) ? status : "active";
  if (partial) return out;
  if (!out.topic || !out.deliveryUrl) return null;
  return { name: out.name ?? "", topic: out.topic, deliveryUrl: out.deliveryUrl, secret: out.secret ?? "", status: out.status ?? "active" };
}

/** The stock fields of one write body (everything else is ignored). */
export function readStockFields(body: unknown): { quantity: number | null; stockStatus: string | null } | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const raw = b.stock_quantity;
  const n = typeof raw === "number" ? raw : typeof raw === "string" && raw.trim() !== "" ? Number(raw) : NaN;
  const quantity = Number.isFinite(n) ? Math.trunc(n) : null;
  const status = typeof b.stock_status === "string" && /^(instock|outofstock|onbackorder)$/.test(b.stock_status) ? b.stock_status : null;
  return quantity === null && status === null ? null : { quantity, stockStatus: status };
}

export function handle(req: ApiRequest): ApiResponse {
  const [s0, s1, ...rest] = req.segments;
  const method = req.method.toUpperCase();

  if (req.segments.length === 0) {
    if (method !== "GET") return noRoute();
    return ok({ name: "OKami24", description: "", url: req.siteUrl, home: req.siteUrl, namespaces: NAMESPACES, authentication: {}, routes: {} });
  }
  const ns = `${s0}/${s1}`;
  if (!NAMESPACES.includes(ns)) return noRoute();
  if (rest.length === 0) return method === "GET" ? ok({ namespace: ns, routes: {} }) : noRoute();
  if (!req.signed) {
    return method === "GET"
      ? err(401, "woocommerce_rest_cannot_view", "Sorry, you cannot list resources.")
      : err(401, "woocommerce_rest_cannot_edit", "Sorry, you are not allowed to edit this resource.");
  }

  const products = req.catalog;
  const byId = new Map(products.map((p) => [p.id, p]));
  const variationById = new Map(products.flatMap((p) => p.variations.map((v) => [v.id, { v, p }] as const)));
  const write = method === "PUT" || method === "POST" || method === "PATCH";
  const writes: StockWrite[] = [];
  const record = (sku: string, body: unknown) => {
    const f = readStockFields(body);
    if (!f || !sku) return;
    writes.push({ sku, ...f });
    const prev = req.reports.get(sku);
    req.reports.set(sku, { quantity: f.quantity ?? prev?.quantity ?? null, stockStatus: f.stockStatus ?? prev?.stockStatus ?? null });
  };

  const [r0, r1, r2, r3] = rest;

  if (r0 === "system_status" && rest.length === 1 && method === "GET") {
    return ok({
      environment: { home_url: req.siteUrl, site_url: req.siteUrl, version: "9.9.0", wp_version: "6.8", language: "th" },
      settings: { currency: "THB", currency_symbol: "฿" },
      active_plugins: [],
    });
  }

  if (r0 === "products") {
    // /products
    if (rest.length === 1 && method === "GET") {
      let list = products;
      const skus = req.query.get("sku");
      if (skus) {
        const want = new Set(skus.split(",").map((s) => s.trim()).filter(Boolean));
        // WooCommerce's `sku` filter finds variations too (returned as products of type "variation").
        const found = [
          ...products.filter((p) => want.has(p.sku)).map((p) => productJson(p, req)),
          ...products.flatMap((p) => p.variations.filter((v) => want.has(v.sku)).map((v) => variationAsProduct(v, p, req))),
        ];
        const { items, headers } = page(found, req.query);
        return ok(items, headers);
      }
      const include = req.query.get("include");
      if (include) {
        const ids = new Set(include.split(",").map(Number));
        list = list.filter((p) => ids.has(p.id));
      }
      const search = req.query.get("search")?.trim().toLowerCase();
      if (search) list = list.filter((p) => p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search));
      const type = req.query.get("type");
      if (type) list = list.filter((p) => (p.variations.length > 0 ? "variable" : "simple") === type);
      const { items, headers } = page(list, req.query);
      return ok(items.map((p) => productJson(p, req)), headers);
    }
    // /products/batch
    if (r1 === "batch" && rest.length === 2 && method === "POST") {
      const update = Array.isArray((req.body as { update?: unknown })?.update) ? ((req.body as { update: unknown[] }).update) : [];
      const results = update.map((u) => {
        const id = Number((u as { id?: unknown })?.id);
        const p = byId.get(id);
        if (p) {
          record(p.sku, u);
          return productJson(p, req);
        }
        const hit = variationById.get(id);
        if (hit) {
          record(hit.v.sku, u);
          return variationAsProduct(hit.v, hit.p, req);
        }
        return { id, error: { code: "woocommerce_rest_product_invalid_id", message: "Invalid ID.", data: { status: 400 } } };
      });
      return ok({ create: [], update: results, delete: [] }, undefined, writes);
    }
    const id = Number(r1);
    const p = byId.get(id);
    const hit = p ? undefined : variationById.get(id);
    // /products/<id>
    if (rest.length === 2) {
      if (!p && !hit) return err(404, "woocommerce_rest_product_invalid_id", "Invalid ID.");
      if (method === "GET") return ok(p ? productJson(p, req) : variationAsProduct(hit!.v, hit!.p, req));
      if (write) {
        if (p) record(p.sku, req.body);
        else record(hit!.v.sku, req.body);
        return ok(p ? productJson(p, req) : variationAsProduct(hit!.v, hit!.p, req), undefined, writes);
      }
      return noRoute();
    }
    if (r2 === "variations") {
      if (!p) return err(404, "woocommerce_rest_product_invalid_id", "Invalid ID.");
      // /products/<id>/variations
      if (rest.length === 3 && method === "GET") {
        const { items, headers } = page(p.variations, req.query);
        return ok(items.map((v) => variationJson(v, p, req)), headers);
      }
      // /products/<id>/variations/batch
      if (r3 === "batch" && rest.length === 4 && method === "POST") {
        const update = Array.isArray((req.body as { update?: unknown })?.update) ? ((req.body as { update: unknown[] }).update) : [];
        const results = update.map((u) => {
          const vid = Number((u as { id?: unknown })?.id);
          const v = p.variations.find((x) => x.id === vid);
          if (!v) return { id: vid, error: { code: "woocommerce_rest_product_variation_invalid_id", message: "Invalid ID.", data: { status: 400 } } };
          record(v.sku, u);
          return variationJson(v, p, req);
        });
        return ok({ create: [], update: results, delete: [] }, undefined, writes);
      }
      // /products/<id>/variations/<vid>
      if (rest.length === 4) {
        const v = p.variations.find((x) => x.id === Number(r3));
        if (!v) return err(404, "woocommerce_rest_product_variation_invalid_id", "Invalid ID.");
        if (method === "GET") return ok(variationJson(v, p, req));
        if (write) {
          record(v.sku, req.body);
          return ok(variationJson(v, p, req), undefined, writes);
        }
      }
    }
    return noRoute();
  }

  // Orders: only those staff already sent to the warehouse (order-push.ts) — never the rest of the shop's orders.
  // A write from Shipnity (status / tracking) is answered with the order unchanged; the log keeps what it sent.
  if (r0 === "orders") {
    const all = req.orders.list();
    if (rest.length === 1 && method === "GET") {
      const { items, headers } = page(all, req.query);
      return ok(items, headers);
    }
    // Shipnity's changes to an order it was sent (e.g. cancelled — out of stock at the warehouse, owner 28/10): answered
    // with the order unchanged, and handed to the route as an update so staff hear about it on LINE. The site's own
    // order status is never changed from here — staff decide with the customer.
    if (rest.length === 2 && r1 === "batch" && method === "POST") {
      const b = (req.body ?? {}) as { update?: unknown[]; delete?: unknown[] };
      const updates: OrderUpdate[] = [];
      const answer = (id: number) => all.find((x) => x.id === id);
      const upd = (Array.isArray(b.update) ? b.update : []).map((u) => {
        const id = Number((u as { id?: unknown })?.id);
        const o = answer(id);
        if (!o) return { id, error: { code: "woocommerce_rest_shop_order_invalid_id", message: "Invalid ID.", data: { status: 400 } } };
        updates.push({ orderId: id, status: readOrderStatus(u) });
        return o;
      });
      const del = (Array.isArray(b.delete) ? b.delete : []).map((d) => {
        const id = Number(d);
        const o = answer(id);
        if (!o) return { id, error: { code: "woocommerce_rest_shop_order_invalid_id", message: "Invalid ID.", data: { status: 400 } } };
        updates.push({ orderId: id, status: "deleted" });
        return o;
      });
      return { ...ok({ create: [], update: upd, delete: del }), orderUpdates: updates };
    }
    if (rest.length === 2) {
      const o = all.find((x) => x.id === Number(r1));
      if (!o) return err(404, "woocommerce_rest_shop_order_invalid_id", "Invalid ID.");
      if (method === "GET") return ok(o);
      if (write) return { ...ok(o), orderUpdates: [{ orderId: o.id, status: readOrderStatus(req.body) }] };
      if (method === "DELETE") return { ...ok(o), orderUpdates: [{ orderId: o.id, status: "deleted" }] };
    }
    return noRoute();
  }

  if (r0 === "webhooks") {
    if (rest.length === 1 && method === "GET") {
      const { items, headers } = page(req.hooks.list(), req.query);
      return ok(items.map(webhookJson), headers);
    }
    if (rest.length === 1 && method === "POST") {
      const input = readWebhook(req.body);
      if (!input) return err(400, "rest_invalid_param", "Invalid parameter(s): topic, delivery_url");
      return ok(webhookJson(req.hooks.create(input as WebhookInput)), undefined, [], 201);
    }
    if (rest.length === 2) {
      const id = Number(r1);
      if (method === "GET") {
        const w = req.hooks.get(id);
        return w ? ok(webhookJson(w)) : err(404, "woocommerce_rest_webhook_invalid_id", "Invalid ID.");
      }
      if (write) {
        const patch = readWebhook(req.body, true);
        if (!patch) return err(400, "rest_invalid_param", "Invalid parameter(s): topic, delivery_url");
        const w = req.hooks.update(id, patch);
        return w ? ok(webhookJson(w)) : err(404, "woocommerce_rest_webhook_invalid_id", "Invalid ID.");
      }
      if (method === "DELETE") {
        const w = req.hooks.remove(id);
        return w ? ok(webhookJson(w)) : err(404, "woocommerce_rest_webhook_invalid_id", "Invalid ID.");
      }
    }
    return noRoute();
  }

  // Shipnity reads the shop's sender name when it connects (log 28/10 18:06).
  if (r0 === "settings" && r1 === "email" && r2 === "woocommerce_email_from_name" && rest.length === 3 && method === "GET") {
    return ok({ id: "woocommerce_email_from_name", label: '"From" name', description: "", type: "text", default: "", tip: "", value: "OKami24" });
  }

  return noRoute();
}
