/**
 * Run: npx tsx src/lib/staff/order-count-contract-test.ts
 * The daily order count of the staff home (order-count-rules.ts): what counts, which day, LINE vs web. Made-up orders.
 */
import { dailyOrderCounts } from "./order-count-rules";

let failed = 0;
function check(name: string, ok: boolean): void {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failed++;
}

const o = (channel: "web" | "line", status: string, createdAt: string) => ({ channel, status, createdAt });
const [today, yesterday] = dailyOrderCounts(
  ["2026-11-10", "2026-11-09"],
  [
    o("line", "approved", "2026-11-10T02:00:00Z"),
    o("line", "awaiting_verification", "2026-11-10T03:00:00Z"),
    o("line", "cancelled", "2026-11-10T04:00:00Z"),
    o("web", "shipped", "2026-11-10T05:00:00Z"),
    o("web", "pending_payment", "2026-11-10T06:00:00Z"),
    o("web", "payment_submitted", "2026-11-10T07:00:00Z"),
    // 23:30 Bangkok on the 9th = 16:30 UTC on the 9th; 00:30 Bangkok on the 10th = 17:30 UTC on the 9th.
    o("line", "processing", "2026-11-09T16:30:00Z"),
    o("line", "completed", "2026-11-09T17:30:00Z"),
    o("web", "approved", "2026-11-01T05:00:00Z"),
  ]
);
check("today: LINE keyed and not cancelled (incl. the one just after midnight Bangkok)", today.line.orders === 3);
check("today: LINE still waiting for the money", today.line.waiting === 1);
check("today: web = paid or past it; an unpaid web order is not counted", today.web.orders === 2 && today.web.waiting === 1);
check("yesterday: the 23:30 Bangkok order", yesterday.line.orders === 1 && yesterday.web.orders === 0);
check("a day outside the dates is left out", today.web.orders + yesterday.web.orders === 2);

console.log(failed === 0 ? "order-count contract: PASS" : `order-count contract: FAIL (${failed})`);
process.exit(failed === 0 ? 0 : 1);
