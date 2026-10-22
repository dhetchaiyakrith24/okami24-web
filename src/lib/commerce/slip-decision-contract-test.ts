/**
 * OKami24 — order slip contract (cart round 22/10, "pay at once").
 *
 * What the order page promises and what this test holds it to (src/lib/commerce/slip-decision.ts):
 *   1. "pass" only when the money went to the shop's account, the amount equals the order total and the transfer was
 *      never seen before — anything less is "check" with the reason, never a silent pass;
 *   2. a picture the bank cannot read (or Bangkok Bank's 5-minute wait, or too many tries) is sent back to the
 *      customer, nothing saved; EasySlip being unavailable is saved as "unchecked" so the order is not lost;
 *   3. a transfer already attached to ANOTHER order is refused; the same order sending its own slip again is not
 *      flagged as "seen before";
 *   4. migration 0008 gives the submissions table no column that could hold a slip image, a name or an account number.
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import fs from "node:fs";
import path from "node:path";
import type { SlipCheckResponse } from "../staff/slip-check-types";
import { decideSlip } from "./slip-decision";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

function okSlip(over: {
  receiverStatus?: "match" | "mismatch" | "unclear";
  amount?: number;
  expected?: number | null;
  duplicate?: boolean;
}): SlipCheckResponse {
  const amount = over.amount ?? 550;
  const expected = over.expected === undefined ? 550 : over.expected;
  return {
    ok: true,
    source: "api",
    slip: {
      transRef: "015296101112ABC12345",
      amount,
      transferredAt: "2026-10-22T14:03:00+07:00",
      receiverStatus: over.receiverStatus ?? "match",
      receiver: null,
      sender: null,
    },
    duplicate: over.duplicate ? { by: "log", firstCheckedAt: "2026-10-22T07:00:00.000Z", previousChecks: 1 } : null,
    amountCheck: expected === null ? null : { expected, matches: Math.round(expected * 100) === Math.round(amount * 100) },
    quota: null,
  };
}

const ORDER = 7;
const describe = (d: ReturnType<typeof decideSlip>) => JSON.stringify(d);

// 1. verdicts
const pass = decideSlip(okSlip({}), ORDER, null);
check("shop account + exact amount + new transfer = pass", pass.kind === "save" && pass.verdict === "pass" && pass.reasons.length === 0, describe(pass));
check("pass keeps the transfer reference and amount in satang", pass.kind === "save" && pass.transRef === "015296101112ABC12345" && pass.amountSatang === 55000, describe(pass));
const short = decideSlip(okSlip({ amount: 500 }), ORDER, null);
check("amount below the total = check (amount-mismatch)", short.kind === "save" && short.verdict === "check" && short.reasons.includes("amount-mismatch"), describe(short));
const satang = decideSlip(okSlip({ amount: 550.01 }), ORDER, null);
check("one satang off = check", satang.kind === "save" && satang.verdict === "check", describe(satang));
const other = decideSlip(okSlip({ receiverStatus: "mismatch" }), ORDER, null);
check("another account = check (receiver-mismatch)", other.kind === "save" && other.verdict === "check" && other.reasons.includes("receiver-mismatch"), describe(other));
const unclear = decideSlip(okSlip({ receiverStatus: "unclear" }), ORDER, null);
check("receiver unclear = check, never pass", unclear.kind === "save" && unclear.verdict === "check" && unclear.reasons.includes("receiver-unclear"), describe(unclear));
const seen = decideSlip(okSlip({ duplicate: true }), ORDER, null);
check("transfer seen before (not on an order) = check (seen-before)", seen.kind === "save" && seen.verdict === "check" && seen.reasons.includes("seen-before"), describe(seen));
const noTotal = decideSlip(okSlip({ expected: null }), ORDER, null);
check("no amount comparison = check, never pass", noTotal.kind === "save" && noTotal.verdict === "check", describe(noTotal));

// 2. retry vs. unchecked
for (const code of ["SLIP_NOT_FOUND", "SLIP_PENDING", "INVALID_IMAGE_FORMAT", "IMAGE_SIZE_TOO_LARGE", "RATE_LIMIT_EXCEEDED"]) {
  const d = decideSlip({ ok: false, error: code }, ORDER, null);
  check(`${code} = ask the customer again, nothing saved`, d.kind === "retry" && d.code === code, describe(d));
}
for (const code of ["NOT_CONFIGURED", "QUOTA_EXCEEDED", "TIMEOUT", "NETWORK", "API_SERVER_ERROR", "INVALID_API_KEY"]) {
  const d = decideSlip({ ok: false, error: code }, ORDER, null);
  check(`${code} = saved as unchecked`, d.kind === "save" && d.verdict === "unchecked" && d.transRef === null, describe(d));
}

// 3. one transfer, one order
const used = decideSlip(okSlip({ duplicate: true }), ORDER, ORDER + 1);
check("transfer already on another order = refused (SLIP_USED)", used.kind === "retry" && used.code === "SLIP_USED", describe(used));
const again = decideSlip(okSlip({ duplicate: true }), ORDER, ORDER);
check("same order re-sending its own slip = pass, not seen-before", again.kind === "save" && again.verdict === "pass", describe(again));

// 4. no customer data columns in 0008
const sql = fs.readFileSync(path.join(__dirname, "..", "db", "migrations", "0008_order_slips.sql"), "utf8");
const added = [...sql.matchAll(/ADD COLUMN\s+(\w+)/g)].map((m) => m[1]);
check("0008 adds the four slip columns", added.join(",") === "slip_trans_ref,slip_amount_satang,slip_verdict,slip_reasons", added.join(","));
check("0008 adds no image / name / account column", !added.some((c) => /image|photo|name|account|sender|receiver/i.test(c)), added.join(","));

for (const res of results) {
  console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
}
const failed = results.filter((x) => !x.passed);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
