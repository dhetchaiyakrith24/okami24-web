/**
 * Run: npx tsx src/lib/commerce/cancel-reason-contract-test.ts
 * Why an order was cancelled (cancel-reason.ts, T2-11 / T2-19) and when a refund stays open on a cancelled order
 * (stock-issue-rules.ts canRefundStockIssue, T2-10) — pure rules, no DB.
 */
import { cancelMessageIndex, isWarehouseCancelNote, warehouseCancelNote, warehouseCancels } from "./cancel-reason";
import { canOpenStockIssue, canRefundStockIssue } from "./stock-issue-rules";
import { ORDER_STATUSES } from "./order-status";

const results: { name: string; ok: boolean }[] = [];
const check = (name: string, ok: boolean) => results.push({ name, ok });

check("cancelled and refunded from Shipnity cancel the web order", warehouseCancels("cancelled") && warehouseCancels("refunded"));
check("delete / trash / failed / others / none only alert", ["deleted", "trash", "failed", "completed", "processing", "on-hold", "pending"].every((s) => !warehouseCancels(s)) && !warehouseCancels(null));
check("the warehouse note is recognised", isWarehouseCancelNote(warehouseCancelNote("cancelled")) && isWarehouseCancelNote(warehouseCancelNote("refunded")));
check("a staff cancel note is not the warehouse's", !isWarehouseCancelNote("Staff: cancel — ลูกค้าขอยกเลิก") && !isWarehouseCancelNote("Shipnity: ship — tracking X") && !isWarehouseCancelNote(null));

const at = "2026-11-11T13:00:00.000Z";
// newest first, as customerMessagesFor returns them
const msgs = [
  { createdAt: "2026-11-11T14:00:00.000Z" }, // written after the cancel
  { createdAt: "2026-11-11T13:00:00.004Z" }, // written with the cancel
  { createdAt: "2026-11-10T09:00:00.000Z" }, // written before
];
check("the cancel's message = the oldest one at or after the cancel", cancelMessageIndex(at, msgs) === 1);
check("a message in the same millisecond counts", cancelMessageIndex(at, [{ createdAt: at }]) === 0);
check("only older messages = no reason", cancelMessageIndex(at, [{ createdAt: "2026-11-10T09:00:00.000Z" }]) === -1);
check("no messages = no reason", cancelMessageIndex(at, []) === -1);

check("a refund stays open on a cancelled order only for the whole order", canRefundStockIssue("cancelled", true) && !canRefundStockIssue("cancelled", false));
check("everywhere else the refund follows canOpenStockIssue", ORDER_STATUSES.filter((s) => s !== "cancelled").every((s) => canRefundStockIssue(s, true) === canOpenStockIssue(s) && canRefundStockIssue(s, false) === canOpenStockIssue(s)));

for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}`);
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
