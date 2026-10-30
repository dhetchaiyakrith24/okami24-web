/**
 * OKami24 — tracking sync step 2 (owner 29/10): when may a tracking number Shipnity wrote ship the order
 * (tracking-sync-rules.ts). Holds:
 *   1. the real writes (staff download 30/10, digits changed): an EMS order in "รอใส่เลขพัสดุ" ships with the S10 number
 *      as Thailand Post; a DHL order ships with its bare 10-digit number as DHL; approved (sent, step not recorded) too;
 *   2. never: an order not sent to Shipnity · a cancelled / completed / unpaid order · an order that already has a
 *      number (same = nothing to do, other = staff's, left alone) · a bare number on an order sent as EMS · no number;
 *   3. the catch-up reads the log rows the way the live route does (note · PUT · batch · tracking route), and nothing
 *      from GET, DELETE, product paths or a broken body.
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import type { OrderStatus } from "@/lib/commerce/order-status";
import { parseTracking } from "./tracking-parse";
import { decideShip, SKIP_TH, trackingsInLoggedWrite, type SyncOrder } from "./tracking-sync-rules";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });
const show = (v: unknown) => JSON.stringify(v);

const order = (o: Partial<SyncOrder> = {}): SyncOrder => ({ status: "processing", sentToShipnity: true, tracking: null, sentCarrier: "thailand-post", ...o });
const emsNote = parseTracking("note", { note: "Tracking Number: WB400000001TH", customer_note: true });
const dhlNote = parseTracking("note", { note: "Tracking Number: 0900000001", customer_note: true });

// 1. ships
const ems = decideShip(order(), emsNote);
check("EMS order, S10 note → ship as Thailand Post", ems.ship && ems.tracking === "WB400000001TH" && ems.carrier === "thailand-post", show(ems));
const dhl = decideShip(order({ sentCarrier: "dhl" }), dhlNote);
check("DHL order, bare 10-digit note → ship as DHL", dhl.ship && dhl.tracking === "0900000001" && dhl.carrier === "dhl", show(dhl));
const approved = decideShip(order({ status: "approved" }), emsNote);
check("sent but still 'approved' → ship (same steps as the staff button)", approved.ship, show(approved));
const s10OnDhl = decideShip(order({ sentCarrier: "dhl" }), emsNote);
check("S10 number on an order sent as DHL → Thailand Post (the number's own format)", s10OnDhl.ship && s10OnDhl.carrier === "thailand-post", show(s10OnDhl));

// 2. never
const reason = (o: SyncOrder, t = emsNote) => {
  const d = decideShip(o, t);
  return d.ship ? "ship" : d.reason;
};
check("not sent to Shipnity → not-sent", reason(order({ sentToShipnity: false })) === "not-sent");
for (const s of ["cancelled", "completed", "pending_payment", "payment_submitted", "awaiting_verification"] as OrderStatus[]) {
  check(`status ${s} → never moved`, reason(order({ status: s })) === "status");
}
check("already shipped with the same number → same-number (repeat write)", reason(order({ status: "shipped", tracking: "WB400000001TH" })) === "same-number");
check("staff already typed another number → other-number, left alone", reason(order({ status: "shipped", tracking: "EF999999999TH" })) === "other-number");
check("cancelled with a number → still never moved", reason(order({ status: "cancelled", tracking: "EF999999999TH" })) === "other-number");
check("bare number on an order sent as EMS → carrier-unclear", reason(order(), dhlNote) === "carrier-unclear");
check("no number → no-number", reason(order(), null) === "no-number");
check("a provider word wins over the sent carrier", decideShip(order(), parseTracking("tracking-route", { tracking_provider: "DHL", tracking_number: "5000000001" })).ship);
check("every skip has staff words", Object.values(SKIP_TH).every((t) => t.length > 0));

// 3. the catch-up reads the log like the route
const one = trackingsInLoggedWrite("POST", "/wp-json/wc/v3/orders/39/notes", JSON.stringify({ note: "Tracking Number: 0900000001", customer_note: true }));
check("log: real note row → order 39 + number", one.length === 1 && one[0].orderId === 39 && one[0].tracking.number === "0900000001", show(one));
check("log: real status PUT row → nothing", trackingsInLoggedWrite("PUT", "/wp-json/wc/v3/orders/39", '{"status":"completed"}').length === 0);
check(
  "log: PUT with tracking meta → found",
  trackingsInLoggedWrite("PUT", "/wp-json/wc/v3/orders/7", JSON.stringify({ meta_data: [{ key: "_tracking_number", value: "EF123456789TH" }] }))[0]?.orderId === 7
);
const batch = trackingsInLoggedWrite(
  "POST",
  "/wp-json/wc/v3/orders/batch",
  JSON.stringify({ update: [{ id: 5, meta_data: [{ key: "tracking_number", value: "EF123456789TH" }] }, { id: 6, status: "completed" }] })
);
check("log: batch → only the order with a number", batch.length === 1 && batch[0].orderId === 5, show(batch));
check(
  "log: tracking-plugin route",
  trackingsInLoggedWrite("POST", "/wp-json/wc-ast/v3/orders/8/shipment-trackings", JSON.stringify({ tracking_number: "EF123456789TH" }))[0]?.orderId === 8
);
check("log: GET / DELETE → nothing", trackingsInLoggedWrite("GET", "/wp-json/wc/v3/orders/39/notes", '{"note":"Tracking Number: WB400000001TH"}').length === 0 && trackingsInLoggedWrite("DELETE", "/wp-json/wc/v3/orders/39", "{}").length === 0);
check("log: product path → nothing", trackingsInLoggedWrite("PUT", "/wp-json/wc/v3/products/39", '{"meta_data":[{"key":"tracking_number","value":"EF123456789TH"}]}').length === 0);
check("log: cut-short body → nothing", trackingsInLoggedWrite("POST", "/wp-json/wc/v3/orders/39/notes", '{"note":"Tracking Num').length === 0);

for (const res of results) {
  console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
}
const failed = results.filter((x) => !x.passed);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
