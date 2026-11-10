/**
 * OKami24 — admin home contract (owner 10/11 dashboard, design v2 passed 11/11): the order of work is money → warehouse →
 * parcels with the longest wait first, a step's wait counts from when the order entered it, a day or more is late, the
 * buttons on the home land back on the home, and the notice only names codes the order page knows.
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import { greeting, homeDate, homeNotice, landing, LATE_MS, oldestPerStep, priorityQueue, stepAge, waitAge } from "./admin-home-rules";
import type { OrderStatus } from "../commerce/order-status";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

const NOW = Date.parse("2026-11-11T05:00:00.000Z");
const ago = (ms: number) => new Date(NOW - ms).toISOString();
const H = 3_600_000;
const row = (id: string, status: OrderStatus, createdAgo: number, sinceAgo: number | null) => ({
  id,
  status,
  createdAt: ago(createdAgo),
  since: sinceAgo === null ? null : ago(sinceAgo),
});

const rows = [
  row("track-new", "processing", 50 * H, 2 * H),
  row("track-old", "processing", 30 * H, 26 * H),
  row("wh", "approved", 3 * H, 1 * H),
  row("slip-b", "payment_submitted", 1 * H, 0.2 * H),
  row("slip-a", "awaiting_verification", 2 * H, null),
  row("unpaid", "pending_payment", 1 * H, 1 * H),
  row("done", "shipped", 1 * H, 1 * H),
];
const queue = priorityQueue(rows).map((r) => r.id);
check("queue: money → warehouse → parcels, longest wait first", queue.join(",") === "slip-a,slip-b,wh,track-old,track-new", queue.join(","));
check("queue: only the three to-do steps", !queue.includes("unpaid") && !queue.includes("done"));
check("queue: a parcel waiting longer in its step goes first even if ordered later", queue.indexOf("track-old") < queue.indexOf("track-new"));

check("age: minutes", waitAge(ago(20 * 60_000), NOW).text === "20 นาที" && !waitAge(ago(20 * 60_000), NOW).late);
check("age: under a minute shows 1 นาที", waitAge(ago(5_000), NOW).text === "1 นาที");
check("age: hours", waitAge(ago(3 * H), NOW).text === "3 ชม.");
check("age: days and late", waitAge(ago(3 * 24 * H), NOW).text === "3 วัน" && waitAge(ago(3 * 24 * H), NOW).late);
check("age: late from one day exactly", waitAge(ago(LATE_MS), NOW).late && !waitAge(ago(LATE_MS - 60_000), NOW).late);
check("age: a future time is not negative", waitAge(ago(-H), NOW).text === "1 นาที");
check("step age counts from the step, not the order", stepAge(rows[0], NOW).text === "2 ชม." && !stepAge(rows[0], NOW).late);
check("step age falls back to the order's time", stepAge(rows[4], NOW).text === "2 ชม.");

const oldest = oldestPerStep(rows);
check("oldest per step", oldest.slip?.id === "slip-a" && oldest.warehouse?.id === "wh" && oldest.tracking?.id === "track-old");
check("oldest per step: none outside the to-do steps", oldest.unpaid === null && oldest.done === null && oldest.cancelled === null);
check("oldest per step: empty list", Object.values(oldestPerStep([])).every((v) => v === null));

const isList = (v: string) => v === "slip" || v === "all";
check("landing: home", landing("OK-1 2", "home", isList) === "/staff?order=OK-1%202&");
check("landing: a list", landing("OK-1", "slip", isList) === "/staff/orders/OK-1?from=slip&");
check("landing: unknown from = the order page alone", landing("OK-1", "x", isList) === "/staff/orders/OK-1?");

const DONE = { confirm: "ยืนยันแล้ว" };
const ERR = { tracking: "เลขผิด" };
check("notice: done", homeNotice({ order: "OK-1", done: "confirm" }, DONE, ERR)?.tone === "ok");
check("notice: error wins", homeNotice({ order: "OK-1", done: "confirm", error: "tracking" }, DONE, ERR)?.text === "เลขผิด");
check("notice: unknown code = none", homeNotice({ order: "OK-1", done: "<script>" }, DONE, ERR) === null);
check("notice: no order named = none", homeNotice({ done: "confirm" }, DONE, ERR) === null);

check("greeting: a person by name", greeting({ kind: "account", name: "ICE" }) === "สวัสดีค่ะ ICE");
check("greeting: shared password and owner without a name", greeting({ kind: "shared", name: "รหัสร่วม" }) === "สวัสดีค่ะ" && greeting({ kind: "owner", name: "เจ้าของ" }) === "สวัสดีค่ะ");
check("date line", homeDate("2026-11-10") === "วันอังคารที่ 10 พ.ย.", homeDate("2026-11-10"));

for (const res of results) {
  console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
}
const failed = results.filter((x) => !x.passed);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
