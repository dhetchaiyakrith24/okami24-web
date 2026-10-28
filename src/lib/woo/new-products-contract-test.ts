/**
 * OKami24 — new warehouse products (owner 28/10, option A: LINE + the staff page list).
 *
 *   1. the data file (src/data/stock/warehouse-new.ts): every entry has a Shipnity-style code, a name, a YYYY-MM-DD day,
 *      "listed" entries point at a page that exists in the catalog, "waiting" ones say why; no code twice;
 *   2. LINE: only entries not announced yet; a product that waited and later went up is told again once as listed;
 *      the text names the products and the staff page, never a price.
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import { WAREHOUSE_NEW, type WarehouseNewProduct } from "@/data/stock/warehouse-new";
import { getCatalogItem } from "@/lib/catalog-index";
import { alertKey, formatNewProductsAlert, unannounced } from "./new-products-rules";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

// 1. the data file
const bad = WAREHOUSE_NEW.filter(
  (e) =>
    !/^[A-Za-z]+-\d+$/.test(e.code) ||
    !e.name.trim() ||
    !/^\d{4}-\d{2}-\d{2}$/.test(e.seenOn) ||
    (e.status === "listed" && !(e.href && e.href.startsWith("/products/") && getCatalogItem(e.href.slice("/products/".length)))) ||
    (e.status === "waiting" && !e.note?.trim())
);
check(`warehouse-new.ts: ${WAREHOUSE_NEW.length} entries well formed`, bad.length === 0, JSON.stringify(bad));
const codes = WAREHOUSE_NEW.map((e) => e.code);
check("warehouse-new.ts: no code twice", new Set(codes).size === codes.length, codes.join(","));

// 2. LINE
const waiting: WarehouseNewProduct = { code: "Pod-999", name: "Test Pod", seenOn: "2026-10-29", status: "waiting", note: "ยังไม่มีรูป" };
const listed: WarehouseNewProduct = { ...waiting, status: "listed", href: "/products/test-pod", note: undefined };
check("nothing announced → the entry is new", unannounced([waiting], new Set()).length === 1);
check("announced as waiting → silent", unannounced([waiting], new Set([alertKey(waiting)])).length === 0);
check("waiting announced, now listed → told once more", unannounced([listed], new Set([alertKey(waiting)])).length === 1);
const text = formatNewProductsAlert([listed, { ...waiting, code: "Pod-998", name: "Other" }], "https://okami24.store");
check(
  "text: count, listed link, waiting reason, staff page, no price",
  text.includes("2 รายการ") && text.includes("https://okami24.store/products/test-pod") && text.includes("ยังไม่มีรูป") && text.includes("/staff/dev") && !/฿|บาท/.test(text),
  text
);

for (const res of results) {
  console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
}
const failed = results.filter((x) => !x.passed);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
