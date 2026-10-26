/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper */
// Order-entry stock read → the "CODE=1,CODE=0,…" snapshot that scripts/stock-sync.js takes (owner 24/10: the TRUE stock is
// what Shipnity Max's order-entry screen lets you add — the product list page can say มีของ for items that are out).
//
//   node scripts/order-entry-stock.js <compact.txt> <snapshot-out.txt> [--compare <product-list-snapshot.txt>]
//
// How to read (owner OK 24/10: READ ONLY — never pick a customer, never add an item, never press บันทึก):
//   1. open https://app.shipnitymax.com/order/create in a tab of its own (the owner's Chrome, signed in)
//   2. click "เพิ่มสินค้า" (under ข้อมูลสินค้า) — the "เลือกสินค้า" picker opens
//   3. run scripts/order-entry-stock.browser.js in the page (javascript tool, prefix it with `await `). It pages through
//      the picker with its own pager only and returns {pages, products, options, problems, disagree, compactLength};
//      problems or disagree not empty = stop and report. The result string stays in window.__oeCompact.
//   4. copy window.__oeCompact out in slices of 900 characters (the tool cuts output near 1,000), join them exactly, save
//      as <compact.txt>, check its byte count = compactLength
//      B5 step 1 (owner 26/10, 7-day log): copy window.__oeCounts the same way (check countsLength), save it beside the read and
//      run `node scripts/stock-count-log.js <counts.txt> <snapshot-out.txt>` after this script — log only, never a stop reason
//   5. close the picker with its own "ยกเลิก", then close the tab — never the page's "บันทึก"
//
// Each option's state is the picker button itself (blue "เพิ่ม <option>" = 1, grey pointer-events-none/disabled = 0) — what
// the admin sees when keying an order; the browser script also checks it against the option's `available` number and
// lists every disagreement. A product code that is not one of its own options = 1 when any option is 1. Codes that are not
// warehouse codes ("test", "Close", "Product 1176446", "Set-Coil-1-14") are skipped and listed. The same code read twice
// with different states = 0 (out) and listed.
const fs = require("fs");

const args = process.argv.slice(2);
let compare = null;
const ci = args.indexOf("--compare");
if (ci !== -1) { compare = args[ci + 1]; args.splice(ci, 2); }
const [inFile, outFile] = args;
if (!inFile || !outFile) {
  console.error("usage: node scripts/order-entry-stock.js <compact.txt> <snapshot-out.txt> [--compare <product-list-snapshot.txt>]");
  process.exit(1);
}
const CODE = /^[A-Za-z]+-\d+(?:-\d+)?$/;
const state = new Map(), skipped = new Set(), conflicts = new Set();
const put = (code, v) => {
  if (!CODE.test(code)) { skipped.add(code); return; }
  if (state.has(code) && state.get(code) !== v) { conflicts.add(code); v = 0; }
  state.set(code, state.has(code) ? Math.min(state.get(code), v) : v);
};
const parents = [], foreign = [];
// Entries are "SKU:bits" or "SKU:bits@CODE|CODE"; the SKU ends at the ":" before the bits ("Product 1176446" is fine).
const entries = fs.readFileSync(inFile, "utf8").trim().split(",").map((entry) => {
  const m = /^(.+?):([01]+)(?:@(.+))?$/.exec(entry.trim());
  if (!m) { console.error(`bad entry: ${entry}`); process.exit(1); }
  const [, sku, bits, list] = m;
  const codes = list ? list.split("|") : [...bits].map((_, i) => `${sku}-${i + 1}`);
  if (codes.length !== bits.length) { console.error(`${sku}: ${codes.length} codes for ${bits.length} states`); process.exit(1); }
  return { sku, bits, codes };
});
const productCodes = new Set(entries.map((e) => e.sku));
for (const { sku, bits, codes } of entries) {
  codes.forEach((c, i) => {
    // An option carrying ANOTHER product's code (Pod-156's 14th option is coded "Pod-147" in Shipnity Max) is a data slip in
    // the warehouse, not that product's stock — list it, never let it decide the other product.
    if (c !== sku && productCodes.has(c)) { foreign.push(`${sku} option ${i + 1} = ${c} (${bits[i]})`); return; }
    put(c, Number(bits[i]));
  });
  if (!codes.includes(sku)) parents.push([sku, bits.includes("1") ? 1 : 0]);
}
// Parents after options, so an option read of the same code wins the conflict check either way.
for (const [sku, v] of parents) put(sku, v);
const byCode = (a, b) => a.localeCompare(b, "en", { numeric: true });
const codes = [...state.keys()].sort(byCode);
fs.writeFileSync(outFile, codes.map((c) => `${c}=${state.get(c)}`).join(","));
const out = codes.filter((c) => state.get(c) === 0);
console.log(`order-entry: ${codes.length} codes · ${out.length} out of stock → ${outFile}`);
if (skipped.size) console.log(`skipped (not warehouse codes): ${[...skipped].sort(byCode).join(", ")}`);
if (foreign.length) console.log(`option coded as another product (skipped): ${foreign.join(" · ")}`);
console.log(conflicts.size ?`CONFLICT (read twice, set out): ${[...conflicts].sort(byCode).join(", ")}` : "conflicts: none");
if (compare) {
  const list = new Map(fs.readFileSync(compare, "utf8").trim().split(",").map((p) => p.trim().split("=")).map(([k, v]) => [k, Number(v)]));
  const listSaysIn = codes.filter((c) => list.get(c) === 1 && state.get(c) === 0);
  const listSaysOut = codes.filter((c) => list.get(c) === 0 && state.get(c) === 1);
  const onlyHere = codes.filter((c) => !list.has(c));
  const onlyList = [...list.keys()].filter((c) => !state.has(c)).sort(byCode);
  console.log(`compare with ${compare}: ${list.size} codes in the product-list read`);
  console.log(`  product list มีของ, order entry OUT (${listSaysIn.length}): ${listSaysIn.join(", ") || "-"}`);
  console.log(`  product list ไม่มีของ, order entry IN (${listSaysOut.length}): ${listSaysOut.join(", ") || "-"}`);
  console.log(`  only in order entry (${onlyHere.length}): ${onlyHere.join(", ") || "-"}`);
  console.log(`  only in product list (${onlyList.length}): ${onlyList.join(", ") || "-"}`);
}
