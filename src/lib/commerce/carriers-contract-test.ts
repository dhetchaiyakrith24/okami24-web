/**
 * OKami24 — carriers contract (owner 23/10: the shipped order page names the carrier and links to its tracking page).
 *
 *   1. exactly the two BSOT §10 carriers, each with a name in all three languages;
 *   2. every tracking link is https on the carrier's own domain (no third-party tracker);
 *   3. a carrier id from a form or the database is accepted only when it is one of the two — anything else is null,
 *      so the page never shows a button for a carrier staff did not pick.
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import { CARRIER_IDS, CARRIERS, toCarrierId } from "./carriers";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

// 1. the two carriers, named in three languages
check("two carriers: Thailand Post + Flash Express", CARRIER_IDS.join(",") === "thailand-post,flash", CARRIER_IDS.join(","));
for (const id of CARRIER_IDS) {
  const n = CARRIERS[id].name;
  check(`${id}: named in th/en/zh`, [n.th, n.en, n.zh].every((s) => s.trim().length > 0), JSON.stringify(n));
}

// 2. official https pages only
const OWN_HOST: Record<string, string> = { "thailand-post": "track.thailandpost.co.th", flash: "www.flashexpress.co.th" };
for (const id of CARRIER_IDS) {
  const url = new URL(CARRIERS[id].trackUrl);
  check(`${id}: tracking link is https on its own domain`, url.protocol === "https:" && url.host === OWN_HOST[id], CARRIERS[id].trackUrl);
}

// 3. ids are accepted, not guessed
check("known ids pass", toCarrierId("thailand-post") === "thailand-post" && toCarrierId("flash") === "flash");
for (const bad of ["", "EMS", "kerry", "Flash", " flash", null, undefined, 1]) {
  check(`unknown id ${JSON.stringify(bad)} → null`, toCarrierId(bad) === null);
}

for (const res of results) {
  console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
}
const failed = results.filter((x) => !x.passed);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
