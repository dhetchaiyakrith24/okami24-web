/**
 * OKami24 — staff slip-check contract (round "ตรวจสลิป หน้าทีมงาน", 2026-10-07).
 *
 * What the slip-check page promises and what this test holds it to:
 *   1. the receiver check says "match" only when the bank is KBank AND a real piece of the shop's account
 *      (≥3 visible digits in place, or the owner's first name) is confirmed; any contradiction = "mismatch";
 *      nothing confirmed = "unclear". Cases use the masked shapes in the EasySlip docs
 *      (document.easyslip.com /en/v2/verify/bank/: `xxx-x-x5678-x`, `08xxxxxxxx89`).
 *   2. the migrations give the log NO column that could hold a slip image, a name or an account number
 *      (customer data — round file 【ห้ามแตะ】), and the staff tables hold no password.
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import Database from "better-sqlite3";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { matchReceiver, type ShopAccount, type SlipParty } from "./receiver-match";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

// Same values the route derives from src/data/payment.ts (BSOT §9). Kept literal here on purpose: if the
// shop account ever changes, this test should be read again, not silently follow.
const SHOP: ShopAccount = { bankId: "004", bankShort: "KBANK", digits: "1538292407", firstNameTh: "จีระศักดิ์" };

const kbank = { id: "004", name: "กสิกรไทย", short: "KBANK" };
const scb = { id: "014", name: "ไทยพาณิชย์", short: "SCB" };
const party = (bank: SlipParty["bank"], account: SlipParty["account"]): SlipParty => ({ bank, account });

// 1. receiver check
const r = (p: SlipParty | undefined) => matchReceiver(p, SHOP);
check("KBank + masked digits in place + name → match", r(party(kbank, { name: { th: "นาย จีระศักดิ์ เ" }, bank: { type: "BANKAC", account: "xxx-x-x9240-x" } })) === "match");
check("KBank + digits only (no name) → match", r(party(kbank, { bank: { type: "BANKAC", account: "xxx-x-x9240-x" } })) === "match");
check("KBank + full name only → match", r(party(kbank, { name: { th: "นาย จีระศักดิ์ เกษมสวัสดิ์" } })) === "match");
check("name without title, no space → match", r(party(kbank, { name: { th: "จีระศักดิ์เกษมสวัสดิ์" } })) === "match");
check("another bank → mismatch", r(party(scb, { name: { th: "นาย จีระศักดิ์ เ" } })) === "mismatch");
check("bank given only as short code → still compared", r(party({ short: "kbank" }, { name: { th: "นาย จีระศักดิ์" } })) === "match");
check("a visible digit that differs → mismatch", r(party(kbank, { name: { th: "นาย จีระศักดิ์ เ" }, bank: { account: "xxx-x-x9241-x" } })) === "mismatch");
check("another person's name → mismatch", r(party(kbank, { name: { th: "นาง สมหญิง ใจดี" }, bank: { account: "xxx-x-x9240-x" } })) === "mismatch");
check("name cut inside the first name but agreeing → not a mismatch", r(party(kbank, { name: { th: "นาย จีระศั" } })) !== "mismatch");
check("PromptPay phone only, no name → unclear", r(party(kbank, { proxy: { type: "MSISDN", account: "08xxxxxxxx89" } })) === "unclear");
check("only two visible digits, no name → unclear (could be chance)", r(party(kbank, { bank: { account: "xxx-x-xxx40-x" } })) === "unclear");
check("masked account of a different length → ignored, not a match by itself", r(party(kbank, { bank: { account: "xxx-x-xx924" } })) === "unclear");
check("no bank at all + name → unclear (bank unconfirmed)", r(party(undefined, { name: { th: "นาย จีระศักดิ์" } })) === "unclear");
check("no receiver → unclear", r(undefined) === "unclear");
check("English name only → unclear (shop's English spelling is not on record)", r(party(kbank, { name: { en: "MR. JEERASAK K" } })) === "unclear");

// 2. schema promise
const MIGRATIONS_DIR = path.join(process.cwd(), "src", "lib", "db", "migrations");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "okami24-slip-"));
const db = new Database(path.join(tmp, "t.db"));
try {
  for (const file of fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql")).sort()) {
    db.exec(fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8"));
  }
  const cols = (table: string) => (db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[]).map((c) => c.name).sort();
  const slipCols = cols("slip_checks");
  check(
    "slip_checks holds ref / amount / time / receiver verdict / check times only",
    slipCols.join(",") ===
      ["amount_satang", "check_count", "first_checked_at", "last_checked_at", "receiver_status", "trans_ref", "transferred_at"].sort().join(","),
    slipCols.join(",")
  );
  const imgCols = cols("slip_check_images");
  check("slip_check_images holds a hash, not an image", imgCols.join(",") === "created_at,image_sha256,trans_ref", imgCols.join(","));
  const forbidden = /name|account|sender|receiver_name|image_data|blob|password|phone/i;
  for (const t of ["slip_checks", "slip_check_images", "staff_sessions", "staff_login_failures"]) {
    const bad = cols(t).filter((c) => forbidden.test(c) && c !== "password_tag");
    check(`${t}: no column for names, accounts, images or passwords`, bad.length === 0, bad.join(","));
  }
  const staffCols = cols("staff_sessions");
  check("staff_sessions keeps a token hash, never the token", staffCols.includes("token_hash") && !staffCols.includes("token"), staffCols.join(","));
} finally {
  db.close();
  fs.rmSync(tmp, { recursive: true, force: true });
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
