/**
 * OKami24 — carriers contract (owner 23/10: the shipped order page names the carrier and links to its tracking page).
 *
 *   1. the BSOT §10 carriers (EMS + DHL since 29/10; Flash kept readable for old orders), each named in all three
 *      languages; staff can pick only EMS and DHL;
 *   2. every tracking link is https on the carrier's own domain (no third-party tracker);
 *   3. a carrier id from a form or the database is accepted only when it is a known one — anything else is null,
 *      so the page never shows a button for a carrier staff did not pick;
 *   4. the carrier pick (owner 30/10): Phuket 83xxx + Bangkok 10220 / 10250 = DHL, every other postcode = EMS; the name
 *      sent to Shipnity is one of its own (EMS / DHL / OTHER).
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import { CARRIER_IDS, CARRIERS, pickCarrier, SHIPNITY_CARRIER_NAME, STAFF_CARRIER_IDS, toCarrierId, toStaffCarrierId } from "./carriers";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

// 1. the two carriers, named in three languages
check("carriers: Thailand Post, DHL, Flash (old orders)", CARRIER_IDS.join(",") === "thailand-post,dhl,flash", CARRIER_IDS.join(","));
check("staff pick only EMS + DHL", STAFF_CARRIER_IDS.join(",") === "thailand-post,dhl" && toStaffCarrierId("flash") === null && toStaffCarrierId("dhl") === "dhl");
for (const id of CARRIER_IDS) {
  const n = CARRIERS[id].name;
  check(`${id}: named in th/en/zh`, [n.th, n.en, n.zh].every((s) => s.trim().length > 0), JSON.stringify(n));
}

// 2. official https pages only
const OWN_HOST: Record<string, string> = { "thailand-post": "track.thailandpost.co.th", dhl: "ecommerceportal.dhl.com", flash: "www.flashexpress.co.th" };
for (const id of CARRIER_IDS) {
  const url = new URL(CARRIERS[id].trackUrl);
  check(`${id}: tracking link is https on its own domain`, url.protocol === "https:" && url.host === OWN_HOST[id], CARRIERS[id].trackUrl);
}

// 3. ids are accepted, not guessed
check("known ids pass", toCarrierId("thailand-post") === "thailand-post" && toCarrierId("dhl") === "dhl" && toCarrierId("flash") === "flash");
for (const bad of ["", "EMS", "DHL", "kerry", "Flash", " flash", null, undefined, 1]) {
  check(`unknown id ${JSON.stringify(bad)} → null`, toCarrierId(bad) === null);
}

// 4. the carrier pick (owner 30/10)
for (const pc of ["83000", "83110", "83150", "83999", "10220", "10250", " 83100 "]) check(`${JSON.stringify(pc)} → DHL`, pickCarrier(pc) === "dhl");
for (const pc of ["10200", "10230", "10251", "82000", "84000", "8300", "830000", "50200", "", "abcde"]) {
  check(`${JSON.stringify(pc)} → EMS`, pickCarrier(pc) === "thailand-post");
}
check("Shipnity names: EMS / DHL / OTHER", SHIPNITY_CARRIER_NAME["thailand-post"] === "EMS" && SHIPNITY_CARRIER_NAME.dhl === "DHL" && SHIPNITY_CARRIER_NAME.flash === "OTHER");

for (const res of results) {
  console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
}
const failed = results.filter((x) => !x.passed);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
