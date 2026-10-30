/**
 * OKami24 — the tracking parser, prepared for tracking sync step 2 (owner 29/10). The shapes are guesses until a real
 * Shipnity body is seen (see tracking-parse.ts); this holds what the parser must do with each:
 *   1. the tracking route body, order meta, the tracking plugins' item list, shipping-line meta and a note each give
 *      the number, cleaned (spaces out, upper case);
 *   2. the carrier comes from the provider text (EMS / Thailand Post / ไปรษณีย์ / DHL) or the S10 "..TH" format, else null;
 *   3. a status-only write, a short word, a phone-like text without a tracking label, or a non-object = null.
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import { carrierFromText, parseTracking } from "./tracking-parse";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });
const show = (v: unknown) => JSON.stringify(v);

// 1. each shape
const route = parseTracking("tracking-route", { tracking_provider: "DHL eCommerce", tracking_number: " thbkk 1234 5678 " });
check("tracking route: number + DHL", route?.number === "THBKK12345678" && route.carrier === "dhl" && route.source === "tracking-route", show(route));
const custom = parseTracking("tracking-route", { custom_tracking_provider: "EMS", tracking_number: "EF123456789TH" });
check("tracking route: custom provider EMS", custom?.carrier === "thailand-post", show(custom));
const meta = parseTracking("order", { status: "completed", meta_data: [{ key: "_tracking_number", value: "EF123456789TH" }] });
check("order meta _tracking_number (S10 = EMS)", meta?.number === "EF123456789TH" && meta.carrier === "thailand-post" && meta.source === "meta", show(meta));
const metaProv = parseTracking("order", {
  meta_data: [
    { key: "shipping_carrier", value: "DHL" },
    { key: "tracking_number", value: "5012345678" },
  ],
});
check("order meta with a carrier key", metaProv?.number === "5012345678" && metaProv.carrier === "dhl", show(metaProv));
const items = parseTracking("order", {
  meta_data: [{ key: "_wc_shipment_tracking_items", value: [{ tracking_provider: "thailand-post", tracking_number: "EB987654321TH" }] }],
});
check("tracking plugin item list", items?.number === "EB987654321TH" && items.carrier === "thailand-post", show(items));
const shipMeta = parseTracking("order", { shipping_lines: [{ method_title: "DHL", meta_data: [{ key: "tracking_code", value: "TH1234567890" }] }] });
check("shipping line meta, carrier from the line title", shipMeta?.number === "TH1234567890" && shipMeta.carrier === "dhl" && shipMeta.source === "shipping-meta", show(shipMeta));
const note = parseTracking("note", { note: "จัดส่งแล้ว เลขพัสดุ EF 123 456 789 TH" });
check("note with a spaced S10 number", note?.number === "EF123456789TH" && note.carrier === "thailand-post", show(note));
const noteDhl = parseTracking("note", { note: "Shipped by DHL. Tracking: 5098765432" });
check("note with a labelled number + DHL", noteDhl?.number === "5098765432" && noteDhl.carrier === "dhl", show(noteDhl));

// 1b. the shapes Shipnity really sent 29–30/10 (staff download of the log; digits changed)
const realEms = parseTracking("note", { note: "Tracking Number: WB400000001TH", customer_note: true });
check("real note, EMS order (S10)", realEms?.number === "WB400000001TH" && realEms.carrier === "thailand-post" && realEms.source === "note", show(realEms));
const realDhl = parseTracking("note", { note: "Tracking Number: 0900000001", customer_note: true });
check("real note, DHL order (10 digits, no carrier word)", realDhl?.number === "0900000001" && realDhl.carrier === null, show(realDhl));
check("real empty note 'Tracking Number: ' = null", parseTracking("note", { note: "Tracking Number: ", customer_note: true }) === null);
check("real status write = null", parseTracking("order", { status: "completed" }) === null);

// 2. carrier words
check("carrier words", carrierFromText("ไปรษณีย์ไทย") === "thailand-post" && carrierFromText("Thailand Post") === "thailand-post" && carrierFromText("dhl-ecommerce") === "dhl");
check("unknown provider = null", carrierFromText("OTHER") === null && carrierFromText("Kerry") === null && carrierFromText(3) === null);
const plain = parseTracking("tracking-route", { tracking_provider: "OTHER", tracking_number: "12345678AB" });
check("unknown provider, non-S10 number = carrier null", plain?.number === "12345678AB" && plain.carrier === null, show(plain));

// 3. nothing to take
check("status-only write = null", parseTracking("order", { status: "completed" }) === null);
check("meta with no tracking key = null", parseTracking("order", { meta_data: [{ key: "_shipping_phone", value: "0812345678" }] }) === null);
check("too short = null", parseTracking("tracking-route", { tracking_number: "AB12" }) === null);
check("word without digits = null", parseTracking("order", { meta_data: [{ key: "tracking_number", value: "PENDING-NUMBER" }] }) === null);
check("note without a label or S10 = null", parseTracking("note", { note: "โทรหาลูกค้า 0812345678 แล้ว" }) === null);
check("non-object = null", parseTracking("order", "EF123456789TH") === null && parseTracking("note", null) === null);

for (const res of results) {
  console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
}
const failed = results.filter((x) => !x.passed);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
