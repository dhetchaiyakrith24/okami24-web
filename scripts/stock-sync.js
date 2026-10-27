/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper */
// Warehouse stock snapshot → src/data/stock/warehouse-stock.ts (stock round batch 3a, owner 09/10 "2A": read Shipnity Max
// "มีของ / ไม่มีของ" and show "ไม่มีของ" as sold out, re-read every morning until the warehouse API exists).
//
//   node scripts/stock-sync.js <snapshot.txt> <YYYY-MM-DD>
//
// <snapshot.txt> = one line "CODE=1,CODE=0,…" (1 = มีของ, 0 = ไม่มีของ), read in the app browser where the owner is signed
// in to Shipnity Max — never the old shipnity.com (BSOT §4). How to read it (product list only, never the order pages,
// which hold customer data):
//   1. open https://app.shipnitymax.com/product/product?page=1&per_page=1000 (one page holds every product)
//   2. click every "แสดงเพิ่ม N รายการ" until none is left
//   3. run in the page:
//      const L=document.body.innerText.split('\n').map(s=>s.trim()).filter(Boolean),o={};
//      for(let i=0;i<L.length;i++)if(/^[A-Za-z]+-\d+(-\d+)?$/.test(L[i])&&/^[\d,]+\.\d\d$/.test(L[i+2]||'')&&/^(มีของ|ไม่มีของ)$/.test(L[i+3]||''))o[L[i]]=L[i+3]==='มีของ'?1:0;
//      Object.entries(o).map(([k,v])=>k+'='+v).join(',')
//   4. save the result as the snapshot file, run this script, then the SKU-map contract test (every mapped code must be
//      in the snapshot — a code that vanished from the warehouse list fails it).
// Only "ไม่มีของ" codes are written: the snapshot can mark an option sold out, never promote one (apply-sold-out.ts).
//
// CLOSE-ONLY (owner 24/10 "ได้"): the product list page can say มีของ for items that are really out — the true stock shows
// only when an order is keyed (admin team 24/10; first web order cancelled, Pod-171-3). So a code already in the current
// WAREHOUSE_OUT_OF_STOCK stays out even when the read says มีของ; it is printed under "held out" for the owner to confirm.
// Only the owner re-opens a code, by name:   node scripts/stock-sync.js <snapshot.txt> <YYYY-MM-DD> --reopen CODE,CODE
// (never the hourly routine). A re-opened code still stays out when the same read says ไม่มีของ.
//
// ORDER ENTRY (owner 24/10 "ตรงกัน 100 %"): a snapshot from the order-entry picker (scripts/order-entry-stock.js) is the
// true stock, so   node scripts/stock-sync.js <snapshot.txt> <YYYY-MM-DD> --order-entry   writes exactly what it read:
// options it says are in come back on the site by themselves. A code that is out now and missing from the read stays out
// (a vanished code is never a re-open); it is printed under "held out".
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const oi = args.indexOf("--order-entry");
const orderEntry = oi !== -1;
if (orderEntry) args.splice(oi, 1);
const reopen = new Set();
const ri = args.indexOf("--reopen");
if (ri !== -1) {
  for (const c of (args[ri + 1] ?? "").split(",").map((s) => s.trim()).filter(Boolean)) reopen.add(c);
  args.splice(ri, 2);
  if (!reopen.size) { console.error("--reopen needs CODE,CODE"); process.exit(1); }
}
const [file, date] = args;
if (!file || !/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) {
  console.error("usage: node scripts/stock-sync.js <snapshot.txt> <YYYY-MM-DD> [--reopen CODE,CODE]");
  process.exit(1);
}
const pairs = fs.readFileSync(file, "utf8").trim().split(",").map((p) => p.trim()).filter(Boolean);
const all = new Map();
for (const p of pairs) {
  const m = /^([A-Za-z]+-\d+(?:-\d+)?)=([01])$/.exec(p);
  if (!m) { console.error(`bad entry: ${p}`); process.exit(1); }
  all.set(m[1], m[2]);
}
const byCode = (a, b) => a.localeCompare(b, "en", { numeric: true });
const target = path.join(__dirname, "..", "src", "data", "stock", "warehouse-stock.ts");
const prevOut = new Set();
if (fs.existsSync(target)) {
  const m = /WAREHOUSE_OUT_OF_STOCK[^[]*\[([\s\S]*?)\]\);/.exec(fs.readFileSync(target, "utf8"));
  if (!m) { console.error("cannot read WAREHOUSE_OUT_OF_STOCK from the current file"); process.exit(1); }
  for (const c of m[1].matchAll(/"([^"]+)"/g)) prevOut.add(c[1]);
  // Close-only must never switch itself off quietly (checker #801): a file that exists but reads as "nothing out" means
  // its format changed — stop instead of re-opening every code.
  if (prevOut.size === 0) { console.error("current WAREHOUSE_OUT_OF_STOCK reads empty — format changed? refusing to drop close-only"); process.exit(1); }
} else {
  console.error(`missing ${path.relative(process.cwd(), target)} — close-only needs the current list`);
  process.exit(1);
}
const notOut = [...reopen].filter((c) => !prevOut.has(c));
if (notOut.length) { console.error(`--reopen: not out now: ${notOut.join(", ")}`); process.exit(1); }
const outSet = new Set([...all].filter(([, v]) => v === "0").map(([k]) => k));
const held = [...prevOut].filter((c) => !outSet.has(c) && !reopen.has(c) && !(orderEntry && all.get(c) === "1")).sort(byCode);
const backIn = orderEntry ? [...prevOut].filter((c) => all.get(c) === "1").sort(byCode) : [];
for (const c of held) outSet.add(c);
const out = [...outSet].sort(byCode);
const fmt = (list) => {
  const rows = [];
  for (let i = 0; i < list.length; i += 8) rows.push("  " + list.slice(i, i + 8).map((c) => JSON.stringify(c)).join(", ") + ",");
  return rows.join("\n");
};
const how = orderEntry
  ? `every Shipnity Max code the
 * order-entry picker could not add on ${date} (the true stock, owner 24/10), plus codes out before that the read did not
 * list. Generated by scripts/stock-sync.js --order-entry from a read of the order-entry picker (scripts/order-entry-stock.js)`
  : `every Shipnity Max code the warehouse marked
 * "ไม่มีของ" on ${date}, plus codes held out from earlier reads (close-only, owner 24/10 — the product list can say มีของ for
 * items that are really out; only the owner re-opens a code). Generated by scripts/stock-sync.js from a read of the Shipnity
 * Max product list`;
const src = `/**
 * Warehouse stock snapshot (stock round batch 3a, owner 09/10 "2A"): ${how} — do not edit by hand; re-run the script with a fresh read. Read by apply-sold-out.ts: an option or
 * product whose SKU (sku-map.ts) is listed here shows "สินค้าหมด" (BSOT §6). Replaced by the warehouse API when it arrives.
 */
export const WAREHOUSE_STOCK_READ_ON = ${JSON.stringify(date)};
export const WAREHOUSE_OUT_OF_STOCK: ReadonlySet<string> = new Set([
${fmt(out)}
]);
/** Every code in the read, in stock or not — sku-map-contract-test.ts checks each mapped code is still listed. */
export const WAREHOUSE_ALL_CODES: ReadonlySet<string> = new Set([
${fmt([...all.keys()].sort(byCode))}
]);
`;
fs.writeFileSync(target, src.replace(/\n/g, "\r\n"));
console.log(`stock-sync: ${all.size} codes read on ${date} · ${out.length} out of stock (${orderEntry ? "order entry" : "close-only"}) → ${path.relative(process.cwd(), target)}`);
if (orderEntry) console.log(backIn.length ? `back in (order entry can add it again): ${backIn.join(", ")}` : "back in: none");
if (reopen.size) console.log(`re-opened by the owner: ${[...reopen].filter((c) => !outSet.has(c)).join(", ") || "(none — the read still says ไม่มีของ)"}`);
console.log(held.length ? `held out (${orderEntry ? "not in the read" : "read says มีของ or not listed — owner to confirm"}): ${held.join(", ")}` : "held out: none");
// The routine decides "PR or no PR" from this output (27/10: the 16:04 run read "back in: none · held out: none" as "no
// change" while 8 codes had just sold out — the new closures were never printed). So list them and end on one verdict line.
const newlyOut = out.filter((c) => !prevOut.has(c));
const reopened = [...prevOut].filter((c) => !outSet.has(c)).sort(byCode);
console.log(newlyOut.length ? `newly out: ${newlyOut.join(", ")}` : "newly out: none");
console.log(newlyOut.length || reopened.length
  ? `RESULT: CHANGED — ${newlyOut.length} newly out, ${reopened.length} back in vs the current file (open a PR)`
  : "RESULT: NO CHANGE — the out-of-stock set equals the current file (no PR)");
