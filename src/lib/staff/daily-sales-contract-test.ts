/**
 * Run: npx tsx src/lib/staff/daily-sales-contract-test.ts
 * The rules of the daily sales page (daily-sales-rules.ts): what counts, and that no slip counts twice. Made-up figures.
 */
import { bangkokDate, costedPerOrder, dailySales, lastDates, lineBillSales, type SalesOrder, type SalesSlip } from "./daily-sales-rules";

let failed = 0;
function check(name: string, ok: boolean): void {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failed++;
}

const order = (orderNumber: string, total: number, createdAt: string, hasSlipRef = true): SalesOrder => ({
  orderNumber,
  runNumber: null,
  total,
  createdAt,
  hasSlipRef,
  channel: "web",
  sentByUs: false,
});
/** A LINE-chat order staff keyed on /staff/line-order (migration 0026). */
const lineOrder = (orderNumber: string, total: number, createdAt: string, hasSlipRef = true, sentByUs = false): SalesOrder => ({
  ...order(orderNumber, total, createdAt, hasSlipRef),
  channel: "line",
  sentByUs,
});
const slip = (transRef: string, baht: number, transferredAt: string, receiverStatus = "match"): SalesSlip => ({
  transRef,
  amountSatang: baht * 100,
  transferredAt,
  receiverStatus,
});

check("Bangkok day: 17:30 UTC is the next day", bangkokDate("2026-11-06T17:30:00.000Z") === "2026-11-07");
check("Bangkok day: 16:59 UTC is still today", bangkokDate("2026-11-06T16:59:00.000Z") === "2026-11-06");
check("Bangkok day: a bank time with +07:00", bangkokDate("2026-11-07T00:10:00+07:00") === "2026-11-07");
check("Bangkok day: unreadable = null", bangkokDate("soon") === null);
check("dates run newest first across a month end", lastDates("2026-11-01", 3).join() === "2026-11-01,2026-10-31,2026-10-30");

const dates = ["2026-11-07", "2026-11-06"];
const [today, yesterday] = dailySales(
  dates,
  [
    order("W1", 500, "2026-11-07T03:00:00.000Z"),
    order("W2", 300, "2026-11-06T16:30:00.000Z"),
    order("W3", 777, "2026-11-07T04:00:00.000Z", false),
  ],
  [
    slip("L1", 1000, "2026-11-07T09:00:00+07:00"),
    slip("L2", 250, "2026-11-07T23:59:00+07:00"),
    slip("L3", 400, "2026-11-08T00:01:00+07:00"),
    slip("LINKED", 500, "2026-11-07T10:00:00+07:00"),
    slip("LINKED2", 900, "2026-11-07T11:00:00+07:00"),
    slip("OTHER", 5000, "2026-11-07T12:00:00+07:00", "mismatch"),
    slip("UNSURE", 650, "2026-11-07T13:00:00+07:00", "unclear"),
    slip("HAND", 777, "2026-11-07T11:30:00+07:00"),
    slip("HAND2", 777, "2026-11-07T15:00:00+07:00"),
  ],
  new Set(["LINKED", "LINKED2"])
);

check("web = confirmed orders on the day they were placed", today.webSatang === 127_700 && today.orders.length === 2);
check("an order at 23:30 Bangkok stays on that day", yesterday.webSatang === 30_000 && yesterday.orders[0].orderNumber === "W2");
check("LINE = shop's slips with no order, by transfer day", today.lineSatang === (1000 + 250 + 777) * 100);
check("a slip on an order does not count, even when that order did not", !today.slips.some((s) => s.transRef.startsWith("LINKED")));
check("a slip paid to another account does not count", !today.slips.some((s) => s.transRef === "OTHER") && !today.unclear.some((s) => s.transRef === "OTHER"));
check("an unclear receiver is shown and not counted", today.unclear.length === 1 && today.unclear[0].transRef === "UNSURE");
check("a slip after midnight belongs to the next day", !today.slips.some((s) => s.transRef === "L3") && !yesterday.slips.some((s) => s.transRef === "L3"));
check("an order with no slip claims one slip of its amount, the nearest in time", today.heldAsWeb.length === 1 && today.heldAsWeb[0].transRef === "HAND");
check("the second slip of that amount stays a LINE sale", today.slips.some((s) => s.transRef === "HAND2"));
check("total = web + LINE", today.totalSatang === today.webSatang + today.lineSatang);

const [far] = dailySales(
  ["2026-11-07"],
  [order("W4", 100, "2026-11-01T03:00:00.000Z", false)],
  [slip("LATE", 100, "2026-11-07T09:00:00+07:00")],
  new Set()
);
check("a slip days after an order of the same amount stays a LINE sale", far.lineSatang === 10_000 && far.heldAsWeb.length === 0);

const [early] = dailySales(
  ["2026-11-07"],
  [order("W5", 100, "2026-11-06T03:00:00.000Z", false)],
  [slip("NEXT", 100, "2026-11-07T09:00:00+07:00")],
  new Set()
);
check("an order before the first date still claims its slip", early.lineSatang === 0 && early.heldAsWeb.length === 1 && early.webSatang === 0);

// LINE orders keyed on the web (owner list ก11, 09/11): one order + its slip = counted once, under LINE.
{
  const keyedSlip = slip("K1", 590, "2026-11-07T10:05:00+07:00");
  const before = dailySales(["2026-11-07"], [], [keyedSlip], new Set())[0];
  const [after] = dailySales(["2026-11-07"], [lineOrder("L1", 590, "2026-11-07T03:10:00.000Z")], [keyedSlip], new Set(["K1"]));
  check("keyed LINE order with its slip: LINE once, web untouched", after.lineSatang === 59_000 && after.webSatang === 0 && after.slips.length === 0 && after.lineOrders.length === 1);
  check("keying a LINE order does not change the day's total (the slip was already LINE money)", after.totalSatang === before.totalSatang);
  const [noRef] = dailySales(["2026-11-07"], [lineOrder("L2", 590, "2026-11-07T03:10:00.000Z", false)], [keyedSlip], new Set());
  check("keyed LINE order whose slip was not picked: rule 2 still holds the slip, counted once", noRef.lineSatang === 59_000 && noRef.heldAsWeb.length === 1 && noRef.slips.length === 0);
  const from = Date.parse("2026-11-07T00:00:00+07:00");
  const to = Date.parse("2026-11-08T00:00:00+07:00");
  const loose = slip("LOOSE", 300, "2026-11-07T12:00:00+07:00");
  const weekBefore = lineBillSales([], [keyedSlip, loose], new Set(), from, to);
  const weekKeyed = lineBillSales([lineOrder("L1", 590, "2026-11-07T03:10:00.000Z")], [keyedSlip, loose], new Set(["K1"]), from, to);
  check("weekly LINE (vs Okami rows): keying an order the admin also put in Shipnity changes nothing", weekBefore === 89_000 && weekKeyed === 89_000);
  const weekSent = lineBillSales([lineOrder("L1", 590, "2026-11-07T03:10:00.000Z", true, true)], [keyedSlip, loose], new Set(["K1"]), from, to);
  check("weekly LINE: an order our site sent to the warehouse leaves the Okami side (costed per order)", weekSent === 30_000);
  check("per-order cost covers web orders and sent LINE orders only", costedPerOrder({ channel: "web", sentByUs: false }) && costedPerOrder({ channel: "line", sentByUs: true }) && !costedPerOrder({ channel: "line", sentByUs: false }));
}

const [empty] = dailySales(["2026-11-07"], [], [], new Set());
check("a day with nothing is a row of zeros", empty.totalSatang === 0 && empty.orders.length === 0);

console.log(failed === 0 ? "daily-sales contract: PASS" : `daily-sales contract: FAIL (${failed})`);
process.exit(failed === 0 ? 0 : 1);
