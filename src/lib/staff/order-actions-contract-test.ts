/**
 * OKami24 — staff order buttons contract (cart round 22/10, round batch 2).
 *
 *   1. every button only ever writes legal BSOT §9 transitions (order-status.ts), walking intermediate steps;
 *   2. which buttons show at each status — nothing can be confirmed before a slip, nothing shipped before payment is
 *      confirmed, nothing cancelled once shipped;
 *   3. tracking numbers are cleaned or refused;
 *   4. the warehouse text carries every item's code and quantity and says so out loud when a code is missing;
 *   5. when a cancel or a hand-over by hand needs the admin's tick about Shipnity (LINE_ORDERS_GAPS.md #1 / #4).
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import { canTransition, ORDER_STATUSES, type OrderStatus } from "../commerce/order-status";
import { availableActions, cancelOwesRefund, cleanTracking, handoverNeedsTick, refundCancelNote, REFUND_TICK_NOTE, stepsFor, warehouseMayHaveIt, warehouseText, type StaffAction } from "./order-actions";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

// 1. every path is legal
for (const from of ORDER_STATUSES) {
  for (const action of ["confirm", "to-warehouse", "ship", "complete", "cancel"] as StaffAction[]) {
    const steps = stepsFor(action, from);
    if (!steps) continue;
    let cur: OrderStatus = from;
    let legal = true;
    for (const s of steps) {
      if (!canTransition(cur, s)) legal = false;
      cur = s;
    }
    check(`${action} from ${from} writes only legal steps`, legal, steps.join(" → "));
  }
}
check("confirm walks payment_submitted → awaiting_verification → approved", stepsFor("confirm", "payment_submitted")?.join(",") === "awaiting_verification,approved");
check("ship from approved walks processing → shipped", stepsFor("ship", "approved")?.join(",") === "processing,shipped");
check("ship from processing writes only shipped", stepsFor("ship", "processing")?.join(",") === "shipped");

// 2. buttons per status
const show = (s: OrderStatus) => availableActions(s).join(",");
check("unpaid order: only cancel", show("pending_payment") === "cancel", show("pending_payment"));
check("slip in: confirm or cancel", show("payment_submitted") === "confirm,cancel", show("payment_submitted"));
check("approved: to warehouse, ship, cancel", show("approved") === "to-warehouse,ship,cancel", show("approved"));
check("processing: ship or cancel", show("processing") === "ship,cancel", show("processing"));
check("shipped: complete only (no cancel)", show("shipped") === "complete", show("shipped"));
check("completed / cancelled: nothing", show("completed") === "" && show("cancelled") === "");

// 3. tracking
check("tracking: spaces removed, upper-cased", cleanTracking(" th 1234 5678 9 ") === "TH123456789");
check("tracking: too short refused", cleanTracking("12345") === null);
check("tracking: odd characters refused", cleanTracking("TH12345<script>") === null);

// 4. warehouse text
const text = warehouseText({
  orderNumber: "OK-20261022-a1b2c3",
  lines: [
    { sku: "Disposable-25-3", name: "M Bar 10K All Berry", quantity: 2 },
    { sku: null, name: "Caliburn G5 Black", quantity: 1 },
  ],
  recipientName: "สมชาย ใจดี",
  phone: "0812345678",
  address: "99/1 ต.คลองเตยเหนือ อ.วัฒนา จ.กรุงเทพมหานคร 10110",
});
check("warehouse text: code × quantity per line", text.includes("Disposable-25-3 × 2"), text);
check("warehouse text: a missing code is said out loud", text.includes("[ไม่มีรหัสคลัง] × 1"), text);
check("warehouse text: recipient, phone and address", text.includes("สมชาย ใจดี 0812345678") && text.includes("10110"), text);
check("warehouse text: no carrier line unless given", !text.includes("ขนส่ง"), text);
const withCarrier = warehouseText({ orderNumber: "OK-1", lines: [], recipientName: "ก", phone: "0800000000", address: "x 83150", carrier: "DHL" });
check("warehouse text: carrier as the last line", withCarrier.split("\n").at(-1) === "ขนส่ง DHL", withCarrier);
check("warehouse text: a web order heads 'ออเดอร์เว็บ'", text.startsWith("ออเดอร์เว็บ OK-"), text);
const lineText = warehouseText({ orderNumber: "OK-2", lines: [], recipientName: "ก", phone: "0800000000", address: "x", channel: "line" });
check("warehouse text: a keyed LINE order heads 'ออเดอร์ LINE'", lineText.startsWith("ออเดอร์ LINE OK-2"), lineText);

// 5. LINE_ORDERS_GAPS.md #1 / #4: when a cancel or a hand-over needs the admin's tick about Shipnity.
const may = (status: OrderStatus, channel: "web" | "line", sentToWarehouse = false) => warehouseMayHaveIt({ status, channel, sentToWarehouse });
check("tick on cancel: sent by the button", may("approved", "web", true));
check("tick on cancel: handed over by hand", may("processing", "web"));
check("tick on cancel: a paid LINE order (keyed into Shipnity by hand while the switch is off)", may("approved", "line"));
check("no tick: a paid web order not sent", !may("approved", "web"));
check("no tick: waiting for the money", !may("awaiting_verification", "line"));
check("no tick: shipped or done (cannot be cancelled anyway)", !may("shipped", "line", true) && !may("completed", "web", true));
check("hand-over tick: LINE order while the switch is on", handoverNeedsTick({ channel: "line", lineSwitchOn: true, shipnityReady: true }));
check("no hand-over tick: switch off, or a web order", !handoverNeedsTick({ channel: "line", lineSwitchOn: false, shipnityReady: true }) && !handoverNeedsTick({ channel: "web", lineSwitchOn: true, shipnityReady: true }));
check("hand-over tick: every order while the auto-push switch is on", handoverNeedsTick({ channel: "web", lineSwitchOn: false, autoOn: true, shipnityReady: true }) && handoverNeedsTick({ channel: "line", lineSwitchOn: false, autoOn: true, shipnityReady: true }));
check("no hand-over tick without a Shipnity link — nothing can send by itself, so hand-over by hand must stay open", !handoverNeedsTick({ channel: "line", lineSwitchOn: true, autoOn: true, shipnityReady: false }));

// Owner 12/11: cancelling an order whose payment staff confirmed owes a refund (the cancel form asks for a tick).
check("refund tick: approved and processing (payment confirmed)", cancelOwesRefund("approved") && cancelOwesRefund("processing"));
check("no refund tick: unpaid, slip not confirmed yet (owner 29/10), shipped, done, cancelled", (["pending_payment", "payment_submitted", "awaiting_verification", "shipped", "completed", "cancelled"] as OrderStatus[]).every((st) => !cancelOwesRefund(st)));
// Checker 12/11: the reason lost every "s" (a regex missing its backslash) and a long reason pushed the mark past the 300 cut.
const fromMessage = refundCancelNote("", "Out of  stock\nsorry, ส่งไม่ได้ค่ะ");
check("refund note: the customer reason keeps every letter (only whitespace runs become one space)", fromMessage === `${REFUND_TICK_NOTE} — Out of stock sorry, ส่งไม่ได้ค่ะ`, fromMessage);
check("refund note: the staff note wins over the reason", refundCancelNote("  staff says s  ", "ignored") === `${REFUND_TICK_NOTE} — staff says s`);
check("refund note: the mark survives the 300 cut whatever the reason's length", refundCancelNote("", "s".repeat(400)).slice(0, 300).startsWith(REFUND_TICK_NOTE));
const both = refundCancelNote("warehouse: cancelled in Shipnity / told (ticked) — stock gone", "x");
check("refund note: a warehouse-ticked note stays whole after the mark", both === `${REFUND_TICK_NOTE} — warehouse: cancelled in Shipnity / told (ticked) — stock gone`, both);
check("refund note: no reason at all = the mark alone", refundCancelNote(" ", " ") === REFUND_TICK_NOTE);

for (const res of results) {
  console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
}
const failed = results.filter((x) => !x.passed);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
