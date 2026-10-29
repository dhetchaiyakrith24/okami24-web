/**
 * Contract test for unboxing-notice.ts (owner 29/10): which orders show the unboxing-video notice, and which version.
 * Run: npx tsx src/lib/commerce/unboxing-notice-contract-test.ts
 */
import { unboxingNoticeFor } from "./unboxing-notice";

let failed = 0;
function check(name: string, ok: boolean, detail?: unknown) {
  if (ok) console.log(`PASS  ${name}`);
  else {
    failed++;
    console.log(`FAIL  ${name}${detail === undefined ? "" : ` — got ${JSON.stringify(detail)}`}`);
  }
}

const now = new Date("2026-10-29T12:00:00.000Z");
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000).toISOString();
const h = (status: string, d: number) => ({ status, createdAt: daysAgo(d) });

check("pending_payment: none", unboxingNoticeFor("pending_payment", [], now) === null);
for (const s of ["payment_submitted", "awaiting_verification", "approved", "processing"]) {
  check(`${s}: waiting`, unboxingNoticeFor(s, [], now) === "waiting");
}
check("cancelled: none", unboxingNoticeFor("cancelled", [h("payment_submitted", 2)], now) === null);
check("shipped 2 days ago: waiting", unboxingNoticeFor("shipped", [h("shipped", 2)], now) === "waiting");
check("shipped exactly 10 days ago: waiting", unboxingNoticeFor("shipped", [h("shipped", 10)], now) === "waiting");
check("shipped 11 days ago: none", unboxingNoticeFor("shipped", [h("shipped", 11)], now) === null);
check("shipped with no history row: waiting", unboxingNoticeFor("shipped", [], now) === "waiting");
check("completed 3 days ago: received", unboxingNoticeFor("completed", [h("shipped", 5), h("completed", 3)], now) === "received");
check("completed exactly 7 days ago: received", unboxingNoticeFor("completed", [h("completed", 7)], now) === "received");
check("completed 8 days ago: none", unboxingNoticeFor("completed", [h("completed", 8)], now) === null);
check("completed with no history row: none", unboxingNoticeFor("completed", [], now) === null);
check("latest shipped row wins", unboxingNoticeFor("shipped", [h("shipped", 20), h("shipped", 1)], now) === "waiting");

if (failed) {
  console.log(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\nunboxing-notice contract: all checks passed");
