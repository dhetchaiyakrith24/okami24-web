/**
 * OKami24 — staff order buttons contract (cart round 22/10, round batch 2).
 *
 *   1. every button only ever writes legal BSOT §9 transitions (order-status.ts), walking intermediate steps;
 *   2. which buttons show at each status — nothing can be confirmed before a slip, nothing shipped before payment is
 *      confirmed, nothing cancelled once shipped;
 *   3. tracking numbers are cleaned or refused;
 *   4. the warehouse text carries every item's code and quantity and says so out loud when a code is missing.
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import { canTransition, ORDER_STATUSES, type OrderStatus } from "../commerce/order-status";
import { availableActions, cleanTracking, stepsFor, warehouseText, type StaffAction } from "./order-actions";

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

for (const res of results) {
  console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
}
const failed = results.filter((x) => !x.passed);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
