/**
 * OKami24 — alert bot messages contract (cart round 22/10).
 *
 *   1. the new-order alert carries what staff act on (order number, every item with its option and quantity, total,
 *      slip verdict, link to the staff page) and, since owner 24/10 night (Q3), the full delivery block — recipient,
 *      phone, address with postal code — for admin to copy to the warehouse; never the view token;
 *   2. each slip verdict reads differently: pass / check (with the reason in Thai) / unchecked;
 *   3. the slip-group reply flags a slip seen before and says which web order it is attached to;
 *   4. times are Bangkok time.
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import type { OrderDetail } from "../commerce/orders";
import type { SlipCheckResponse } from "../staff/slip-check-types";
import { bangkokTime, formatOrderAlert, formatSlipReply } from "./messages";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

const ORDER: OrderDetail = {
  id: 7,
  orderNumber: "OK-20261022-a1b2c3",
  viewToken: "0123456789abcdef0123456789abcdef",
  status: "payment_submitted",
  runNumber: null,
  subtotal: 500,
  shippingFee: 50,
  shippingRule: null,
  total: 550,
  createdAt: "2026-10-22T07:00:00.000Z",
  items: [
    { productSlug: "m-bar-10k", variantId: "grape", variantLabel: "Grape Ice", productName: "M Bar 10K", unitPrice: 250, quantity: 2, lineTotal: 500 },
  ],
  shippingAddress: {
    recipientName: "สมชาย ใจดี",
    phone: "0812345678",
    line1: "99/1 ซอยสุขุมวิท 11",
    subdistrict: "คลองเตยเหนือ",
    district: "วัฒนา",
    province: "กรุงเทพมหานคร",
    postalCode: "10110",
  },
  statusHistory: [],
  trackingNumber: null,
  carrier: null,
};

const SITE = "https://okami24.store";

// 1. order alert content
const pass = formatOrderAlert(ORDER, "pass", [], SITE);
check("alert has the order number", pass.includes("OK-20261022-a1b2c3"), pass);
check("alert lists item, option and quantity", pass.includes("M Bar 10K (Grape Ice) ×2"), pass);
check("alert has the total and the shipping fee", pass.includes("฿550") && pass.includes("฿50"), pass);
check("alert links the staff order page", pass.includes(`${SITE}/staff/orders/OK-20261022-a1b2c3`), pass);
check("alert has recipient name + province", pass.includes("สมชาย ใจดี") && pass.includes("กรุงเทพมหานคร"), pass);
// Owner 24/10 night (Q3): the full delivery block goes to the team group so admin can copy it to the warehouse.
check("alert carries the phone", pass.includes("0812345678"), pass);
check("alert carries the full address with postal code", pass.includes("99/1 ซอยสุขุมวิท 11 ต.คลองเตยเหนือ อ.วัฒนา จ.กรุงเทพมหานคร 10110"), pass);
check("alert never carries the view token", !pass.includes(ORDER.viewToken), pass);

// 2. verdict lines
check("pass verdict reads ✅", pass.includes("✅"), pass);
const checkMsg = formatOrderAlert(ORDER, "check", ["amount-mismatch", "seen-before"], SITE);
check("check verdict reads ⚠️ with both reasons in Thai", checkMsg.includes("⚠️") && checkMsg.includes("ยอดในสลิปไม่ตรงยอดออเดอร์") && checkMsg.includes("สลิปนี้เคยตรวจแล้ว"), checkMsg);
const unchecked = formatOrderAlert(ORDER, "unchecked", [], SITE);
check("unchecked verdict tells staff to check the bank app", unchecked.includes("⏳") && unchecked.includes("แอปธนาคาร"), unchecked);

// 3. slip group replies
const slip = (over: Partial<Extract<SlipCheckResponse, { ok: true }>> = {}): SlipCheckResponse => ({
  ok: true,
  source: "api",
  slip: { transRef: "015296101112ABC12345", amount: 550, transferredAt: "2026-10-22T14:03:00+07:00", receiverStatus: "match", receiver: null, sender: null },
  duplicate: null,
  amountCheck: null,
  quota: null,
  ...over,
});
const fresh = formatSlipReply(slip(), null);
check("slip reply: shop account + amount", fresh.includes("✅") && fresh.includes("฿550"), fresh);
check("slip reply: Bangkok transfer time", fresh.includes("22/10 14:03"), fresh);
const dup = formatSlipReply(slip({ duplicate: { by: "log", firstCheckedAt: "2026-10-22T07:05:00.000Z", previousChecks: 1 } }), "OK-20261022-a1b2c3");
check("slip reply: seen before is flagged", dup.includes("❗") && dup.includes("22/10 14:05"), dup);
check("slip reply: names the web order it is attached to", dup.includes("OK-20261022-a1b2c3"), dup);
const other = formatSlipReply(slip({ slip: { ...(slip() as Extract<SlipCheckResponse, { ok: true }>).slip, receiverStatus: "mismatch" } }), null);
check("slip reply: another account reads ❌", other.includes("❌"), other);
const notSlip = formatSlipReply({ ok: false, error: "SLIP_NOT_FOUND" }, null);
check("slip reply: not a slip is said plainly", notSlip.includes("อ่านสลิปจากรูปนี้ไม่ได้"), notSlip);

// 4. time zone
check("bangkokTime converts UTC to +07:00", bangkokTime("2026-10-22T17:30:00.000Z") === "23/10 00:30", bangkokTime("2026-10-22T17:30:00.000Z"));

for (const res of results) {
  console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
}
const failed = results.filter((x) => !x.passed);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
