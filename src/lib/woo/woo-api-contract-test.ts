/**
 * OKami24 — the Woo look-alike for the warehouse's Shipnity (Shipnity link step 1, owner 27/10).
 *
 *   1. credentials: Basic auth and the query-string form both parse; anything not ck_/cs_ + 40 hex is refused; the log's
 *      query never keeps a credential;
 *   2. catalog: every listed code is a real code from sku-map.ts, no code twice, every id unique and positive;
 *   3. the API: unsigned calls get 401 (except the two index pages); no price ever leaves; orders list is empty;
 *      a stock write is recorded only for the code it targets and only the stock fields are read; unknown routes 404.
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import { handle, readStockFields, type ApiRequest, type StockReportView } from "./api";
import { wooCatalog } from "./catalog";
import { parseCredentials, safeQuery } from "./credentials";
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
const req = (over: Partial<ApiRequest>): ApiRequest => ({
  method: "GET",
  segments: [],
  query: new URLSearchParams(),
  body: null,
  signed: true,
  siteUrl: "https://okami24.store",
  catalog,
  reports: new Map<string, StockReportView>(),
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
check("orders list is empty in step 1", orders.status === 200 && Array.isArray(orders.json) && (orders.json as unknown[]).length === 0);
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
