/**
 * OKami24 — what Shipnity tells the site after an order was sent, and the stock comparison (Shipnity link, owner 28/10).
 *
 *   1. order changes: a status write / DELETE / batch on an order that was sent becomes an update for the route (LINE
 *      alert); an order that was never sent gets 404 and no update; only known Woo status words are taken;
 *   2. the alert: only cancel / delete / refund / fail alert the team; the LINE text has the order and the items, never a
 *      phone number or an address;
 *   3. the stock comparison sorts every code into agree / Shipnity empty but the site sells / Shipnity has but the site
 *      shows out / no number yet.
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import { handle, readOrderStatus, type ApiRequest, type StockReportView } from "./api";
import { alertWorthy, formatWarehouseChangeAlert } from "./order-alert";
import { compareStock } from "./stock-compare";
import type { WooProduct } from "./catalog";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

const noHooks = { list: () => [], get: () => null, create: () => { throw new Error("x"); }, update: () => null, remove: () => null };
const req = (over: Partial<ApiRequest>): ApiRequest => ({
  method: "GET",
  segments: [],
  query: new URLSearchParams(),
  body: null,
  signed: true,
  siteUrl: "https://okami24.store",
  catalog: [],
  reports: new Map<string, StockReportView>(),
  hooks: noHooks,
  orders: { list: () => [{ id: 21 }] },
  ...over,
});

// 1. order changes
const put = handle(req({ method: "PUT", segments: ["wc", "v3", "orders", "21"], body: { status: "cancelled" } }));
check("PUT status on a sent order = 200 + one update", put.status === 200 && put.orderUpdates?.length === 1 && put.orderUpdates[0].status === "cancelled");
const del = handle(req({ method: "DELETE", segments: ["wc", "v3", "orders", "21"] }));
check("DELETE on a sent order = update 'deleted'", del.status === 200 && del.orderUpdates?.[0]?.status === "deleted");
const batch = handle(
  req({ method: "POST", segments: ["wc", "v3", "orders", "batch"], body: { update: [{ id: 21, status: "cancelled" }, { id: 99, status: "cancelled" }], delete: [21] } })
);
check("batch: sent order updated + deleted, unknown order refused", batch.orderUpdates?.length === 2 && batch.orderUpdates.every((u) => u.orderId === 21));
const unknown = handle(req({ method: "PUT", segments: ["wc", "v3", "orders", "5"], body: { status: "cancelled" } }));
check("an order never sent = 404, no update", unknown.status === 404 && !unknown.orderUpdates);
check("unsigned order write = 401, no update", handle(req({ signed: false, method: "PUT", segments: ["wc", "v3", "orders", "21"], body: { status: "cancelled" } })).status === 401);
check("a note-only write = update with no status", handle(req({ method: "PUT", segments: ["wc", "v3", "orders", "21"], body: { customer_note: "x" } })).orderUpdates?.[0]?.status === null);
check("unknown status word ignored", readOrderStatus({ status: "drop table" }) === null && readOrderStatus({ status: "cancelled" }) === "cancelled");

// 2. the alert
for (const s of ["cancelled", "deleted", "refunded", "failed", "trash"]) check(`${s} alerts the team`, alertWorthy(s));
for (const s of ["completed", "processing", "on-hold", null]) check(`${s} does not alert`, !alertWorthy(s));
const text = formatWarehouseChangeAlert({ orderNumber: "OK-20261028-281129", runNumber: "#0021", items: "Muro Salt Nic Grape × 1", status: "cancelled", siteUrl: "https://okami24.store" });
check("alert names the order and the item", text.includes("#0021") && text.includes("Muro Salt Nic Grape") && text.includes("/staff/orders/OK-20261028-281129"));
check("alert says the warehouse cancelled", text.includes("คลังยกเลิก"));
check("alert carries no phone number", !/0\d{8,9}/.test(text));

// 3. stock comparison
const catalog: WooProduct[] = [
  {
    id: 1,
    slug: "p",
    name: "P",
    sku: "P-1",
    inStock: true,
    variations: [
      { id: 2, parentId: 1, sku: "P-1-1", optionName: "a", inStock: true },
      { id: 3, parentId: 1, sku: "P-1-2", optionName: "b", inStock: true },
      { id: 4, parentId: 1, sku: "P-1-3", optionName: "c", inStock: false },
      { id: 5, parentId: 1, sku: "P-1-4", optionName: "d", inStock: false },
      { id: 6, parentId: 1, sku: "P-1-5", optionName: "e", inStock: true },
    ],
  },
  { id: 7, slug: "s", name: "S", sku: "S-1", inStock: true, variations: [] },
];
const reports = new Map<string, StockReportView>([
  ["P-1-1", { quantity: 5, stockStatus: null }],
  ["P-1-2", { quantity: 0, stockStatus: null }],
  ["P-1-3", { quantity: 0, stockStatus: null }],
  ["P-1-4", { quantity: 9, stockStatus: null }],
  ["S-1", { quantity: null, stockStatus: "instock" }],
]);
const cmp = compareStock(catalog, reports);
check("compare counts every code (variations, or the product itself)", cmp.total === 6);
check("agree = both have / both out", cmp.agree === 3);
check("Shipnity 0 but the site sells = flagged", cmp.siteSellsButEmpty.map((r) => r.sku).join() === "P-1-2");
check("Shipnity has but the site shows out = flagged", cmp.siteOutButStocked.map((r) => r.sku).join() === "P-1-4");
check("no number yet = listed", cmp.missing.map((r) => r.sku).join() === "P-1-5");

for (const res of results) {
  console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
}
const failed = results.filter((x) => !x.passed);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
