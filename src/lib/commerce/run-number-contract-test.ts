/**
 * OKami24 — orders B2 contract (owner 26/10, queue B2), run against a real SQLite database built in memory from every
 * migration in src/lib/db/migrations/ — the same files the live server applies:
 *
 *   1. migration 0017 numbers the orders confirmed before it in the order staff confirmed them, and leaves the rest empty;
 *   2. confirming takes the next number, never twice for one order, and an unpaid order never gets one;
 *   3. the staff lists' filter hides exactly the orders the unpaid sweep cancelled (owner "ซ่อน" — still in the table);
 *   4. #0001 formatting; the slip-picture rules (90 days, file-name and token shapes that keep paths out).
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { ASSIGN_RUN_NUMBER_SQL, formatRunNumber } from "./run-number";
import { AUTO_CANCELLED_SQL } from "./unpaid-rules";
import { isRefundSlipFileName, isSlipFileName, isSlipImageToken, isSweepableSlipFile, previewFileName, slipImageCutoff } from "./slip-image-rules";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

const MIGRATIONS = path.join(process.cwd(), "src", "lib", "db", "migrations");
const files = fs
  .readdirSync(MIGRATIONS)
  .filter((f) => f.endsWith(".sql"))
  .sort();
const B2 = "0017_order_run_number_slip_image.sql";
check("migration 0017 exists", files.includes(B2), files.join(", "));

const db = new Database(":memory:");
db.pragma("foreign_keys = ON");
const apply = (f: string) => db.exec(fs.readFileSync(path.join(MIGRATIONS, f), "utf8"));
for (const f of files.filter((f) => f < B2)) apply(f);

// Five orders before 0017: #3 confirmed first, then #1; #2 paid but not confirmed; #4 auto-cancelled unpaid; #5 cancelled
// by staff before paying.
db.prepare("INSERT INTO customers (id, phone) VALUES (1, '0812345678')").run();
const addOrder = db.prepare(
  "INSERT INTO orders (id, order_number, view_token, customer_id, status, subtotal, shipping_fee, total) VALUES (?, ?, 'tok', 1, ?, 100, 0, 100)"
);
const addAddress = db.prepare(
  "INSERT INTO order_shipping_addresses (order_id, recipient_name, phone, line1, subdistrict, district, province, postal_code) VALUES (?, 'ก', '0812345678', '1', 'ต', 'อ', 'จ', '10110')"
);
const history = db.prepare("INSERT INTO order_status_history (order_id, status, note) VALUES (?, ?, ?)");
for (const [id, status] of [
  [1, "processing"],
  [2, "payment_submitted"],
  [3, "shipped"],
  [4, "cancelled"],
  [5, "cancelled"],
] as const) {
  addOrder.run(id, `OK-20261026-00000${id}`, status);
  addAddress.run(id);
}
history.run(3, "approved", "Staff: confirm");
history.run(1, "approved", "Staff: confirm");
history.run(2, "payment_submitted", "Slip attached");
history.run(4, "cancelled", "System: unpaid 24 h — auto-cancel");
history.run(5, "cancelled", "Staff: cancel — ลูกค้าขอยกเลิก");

apply(B2);
const runOf = (id: number) => (db.prepare("SELECT run_number FROM orders WHERE id = ?").get(id) as { run_number: number | null }).run_number;
check("1. backfill: first confirmed = #1", runOf(3) === 1, String(runOf(3)));
check("1. backfill: second confirmed = #2", runOf(1) === 2, String(runOf(1)));
check(
  "1. backfill: never-confirmed orders stay empty",
  [2, 4, 5].every((id) => runOf(id) === null),
  [2, 4, 5].map(runOf).join(",")
);

// 2. confirm order 2, then confirm it "again" (a double submit) — one number only.
db.prepare(ASSIGN_RUN_NUMBER_SQL).run(2);
db.prepare(ASSIGN_RUN_NUMBER_SQL).run(2);
check("2. confirming takes the next number", runOf(2) === 3, String(runOf(2)));
let duplicateRefused = false;
try {
  db.prepare("UPDATE orders SET run_number = 1 WHERE id = 5").run();
} catch {
  duplicateRefused = true;
}
check("2. the database refuses a number twice", duplicateRefused);
check("2. later rows: the slip-picture columns exist", (() => {
  const cols = (db.prepare("PRAGMA table_info(order_payment_submissions)").all() as { name: string }[]).map((c) => c.name);
  return ["proof_image_path", "slip_image_token", "slip_image_deleted_at"].every((c) => cols.includes(c));
})());

// 3. staff list filter
const listed = (db.prepare(`SELECT o.id FROM orders o WHERE NOT ${AUTO_CANCELLED_SQL} ORDER BY o.id`).all() as { id: number }[]).map((r) => r.id);
check("3. the auto-cancelled unpaid order is hidden", !listed.includes(4), listed.join(","));
check("3. a staff cancellation stays listed", listed.includes(5), listed.join(","));
check("3. every other order stays listed", [1, 2, 3].every((id) => listed.includes(id)), listed.join(","));
check("3. hidden, not deleted", db.prepare("SELECT 1 FROM orders WHERE id = 4").get() !== undefined);
// A paid order that somehow also carries the sweep's note (seen in a hand-edited test database) stays listed.
history.run(1, "payment_submitted", "Slip attached");
db.prepare("UPDATE orders SET status = 'cancelled' WHERE id = 1").run();
history.run(1, "cancelled", "System: unpaid 24 h — auto-cancel");
check(
  "3. an order that was ever paid is never hidden",
  (db.prepare(`SELECT COUNT(*) AS n FROM orders o WHERE o.id = 1 AND ${AUTO_CANCELLED_SQL}`).get() as { n: number }).n === 0
);

// 4. pure rules
check("4. #0001", formatRunNumber(1) === "#0001", String(formatRunNumber(1)));
check("4. #0042", formatRunNumber(42) === "#0042");
check("4. grows past 9999", formatRunNumber(12345) === "#12345");
check("4. no number = null", formatRunNumber(null) === null && formatRunNumber(0) === null && formatRunNumber(1.5) === null);
check(
  "4. 90 days",
  slipImageCutoff(new Date("2026-10-26T00:00:00.000Z")) === "2026-07-28T00:00:00.000Z",
  slipImageCutoff(new Date("2026-10-26T00:00:00.000Z"))
);
check("4. slip file name shape", isSlipFileName("12-0123456789abcdef.jpg") && previewFileName("12-0123456789abcdef.jpg") === "12-0123456789abcdef-p.jpg");
check(
  "4. paths and other names are refused",
  ["../okami24.db", "12-0123456789abcdef.png", "12-0123456789abcdef.jpg/..", "/etc/passwd", "12-0123456789ABCDEF.jpg"].every((n) => !isSlipFileName(n))
);
check("4. token shape", isSlipImageToken("A".repeat(32)) && !isSlipImageToken("A".repeat(31)) && !isSlipImageToken(`${"A".repeat(30)}/.`));
// B4 (owner 26/10 evening): the refund slip shares the folder — its own name shape, never mistaken for a payment slip.
check(
  "4. refund slip name shape",
  isRefundSlipFileName("r12-0123456789abcdef.jpg") &&
    !isSlipFileName("r12-0123456789abcdef.jpg") &&
    !isRefundSlipFileName("12-0123456789abcdef.jpg") &&
    ["r../x.jpg", "r12-0123456789abcdef-p.jpg", "R12-0123456789abcdef.jpg", "r12-0123456789abcdef.jpg/.."].every((n) => !isRefundSlipFileName(n))
);
check(
  "4. the age sweep takes payment slips, previews and refund slips only",
  ["12-0123456789abcdef.jpg", "12-0123456789abcdef-p.jpg", "r12-0123456789abcdef.jpg"].every(isSweepableSlipFile) &&
    ["promptpay-qr.png", "okami24.db", "x12-0123456789abcdef.jpg"].every((n) => !isSweepableSlipFile(n))
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
