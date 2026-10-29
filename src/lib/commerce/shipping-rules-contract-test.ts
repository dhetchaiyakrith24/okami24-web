/**
 * OKami24 — shipping-fee tiers (owner 29/10 ~23:20, BSOT §10), held to every rule and boundary the owner named:
 *
 *   1. the amounts: 299 / 300 / 499 / 500 / 799 / 800, for a guest, a member with the month's benefit open, and a member
 *      who already used it;
 *   2. the member benefit is once per calendar month (Bangkok): the second order of the month pays 35 / 50, the month
 *      rolls over at midnight Bangkok time, a cancelled order gives it back; 800+ orders never use it up;
 *   3. it is counted per member, checkout phone, recipient phone (as typed, dashes and all) and address (house no. +
 *      sub-district + postcode, owner 29/10) — never by name; guests never get it, but their phone / address is still
 *      looked up so the cart's sign-in line can stop promising it;
 *   4. pre-tier (NULL) orders count for nothing; first-version (29/10 evening) orders count only when a member got 0
 *      below 800 (`first_member_order`, or `monthly_free` placed signed in);
 *   5. the cart's "add ฿n more" step and the note keys.
 *
 * The history part runs on a real SQLite database built in memory from every migration in src/lib/db/migrations/ — the
 * same files the live server applies. Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import {
  decideShipping,
  houseNumber,
  isShippingRule,
  loadShippingHistory,
  monthlyWindowStart,
  nextShippingStep,
  shippingNoteKey,
  SHIPPING_RULE_STAFF_LABEL,
  UNKNOWN_VISITOR,
  type ShippingHistory,
} from "./shipping-rules";
import { computeOrderTotals, priceLine } from "./pricing";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

const GUEST = UNKNOWN_VISITOR;
const MEMBER: ShippingHistory = { isMember: true, benefitUsed: false };
const MEMBER_USED: ShippingHistory = { isMember: true, benefitUsed: true };
const show = (d: { rule: string; fee: number }) => `${d.rule} ${d.fee}`;

// 1. Amount boundaries.
for (const [subtotal, history, rule, fee, label] of [
  [299, GUEST, "standard", 50, "guest 299"],
  [300, GUEST, "standard", 50, "guest 300 (the 300 benefit is members only)"],
  [499, GUEST, "standard", 50, "guest 499"],
  [500, GUEST, "over_500", 35, "guest 500"],
  [799, GUEST, "over_500", 35, "guest 799"],
  [800, GUEST, "over_800", 0, "guest 800"],
  [1, MEMBER, "standard", 50, "member 1 baht"],
  [299, MEMBER, "standard", 50, "member 299"],
  [300, MEMBER, "member_monthly", 0, "member 300 (>=, not >)"],
  [499, MEMBER, "member_monthly", 0, "member 499"],
  [500, MEMBER, "member_monthly", 0, "member 500"],
  [799, MEMBER, "member_monthly", 0, "member 799"],
  [800, MEMBER, "over_800", 0, "member 800 (keeps the month's benefit)"],
  [299, MEMBER_USED, "standard", 50, "member, benefit used, 299"],
  [300, MEMBER_USED, "standard", 50, "member, benefit used, 300"],
  [499, MEMBER_USED, "standard", 50, "member, benefit used, 499"],
  [500, MEMBER_USED, "over_500", 35, "member, benefit used, 500"],
  [799, MEMBER_USED, "over_500", 35, "member, benefit used, 799"],
  [800, MEMBER_USED, "over_800", 0, "member, benefit used, 800"],
  [300, { isMember: false, benefitUsed: true }, "standard", 50, "guest whose phone used a benefit, 300"],
] as const) {
  const d = decideShipping(subtotal, history);
  check(`${label} → ${rule} ${fee}`, d.rule === rule && d.fee === fee, show(d));
}

// 2. Month boundaries in Bangkok time (UTC+7, no daylight saving).
const lastSecondOfOct = new Date("2026-10-31T16:59:59.000Z"); // 31/10 23:59:59 Bangkok
const firstSecondOfNov = new Date("2026-10-31T17:00:00.000Z"); // 1/11 00:00:00 Bangkok
check("31/10 23:59:59 Bangkok → window starts 1/10 00:00 Bangkok", monthlyWindowStart(lastSecondOfOct) === "2026-09-30T17:00:00.000Z", monthlyWindowStart(lastSecondOfOct));
check("1/11 00:00 Bangkok → window starts 1/11 00:00 Bangkok", monthlyWindowStart(firstSecondOfNov) === "2026-10-31T17:00:00.000Z", monthlyWindowStart(firstSecondOfNov));
check("1/1 Bangkok rolls the year", monthlyWindowStart(new Date("2026-12-31T18:00:00.000Z")) === "2026-12-31T17:00:00.000Z", monthlyWindowStart(new Date("2026-12-31T18:00:00.000Z")));

// 5. The cart's next step and note keys.
const step = (s: number, h: ShippingHistory) => JSON.stringify(nextShippingStep(s, h));
check("member 120 → add 180 for 0", step(120, MEMBER) === JSON.stringify({ addMore: 180, fee: 0 }), step(120, MEMBER));
check("guest 300 → add 200 for 35", step(300, GUEST) === JSON.stringify({ addMore: 200, fee: 35 }), step(300, GUEST));
check("guest 600 → add 200 for 0", step(600, GUEST) === JSON.stringify({ addMore: 200, fee: 0 }), step(600, GUEST));
check("member, used, 450 → add 50 for 35", step(450, MEMBER_USED) === JSON.stringify({ addMore: 50, fee: 35 }), step(450, MEMBER_USED));
check("member, used, 520 → add 280 for 0", step(520, MEMBER_USED) === JSON.stringify({ addMore: 280, fee: 0 }), step(520, MEMBER_USED));
check("already 0 → no next step", nextShippingStep(300, MEMBER) === null && nextShippingStep(900, GUEST) === null);
check(
  "note keys: member benefit · member below 300 · guest · used",
  shippingNoteKey("member_monthly", MEMBER) === "memberMonthly" &&
    shippingNoteKey("standard", MEMBER) === "memberUnder300" &&
    shippingNoteKey("standard", GUEST) === "standard" &&
    shippingNoteKey("over_500", GUEST) === "over500" &&
    shippingNoteKey("over_500", MEMBER_USED) === "over500Used" &&
    shippingNoteKey("standard", MEMBER_USED) === "standardUsed" &&
    shippingNoteKey("over_800", MEMBER_USED) === "over800"
);
check(
  "stored rules: the first version's names still read (staff label), unknown text does not",
  isShippingRule("first_member_order") && isShippingRule("monthly_used") && isShippingRule("member_monthly") && !isShippingRule("free") &&
    SHIPPING_RULE_STAFF_LABEL.monthly_free.includes("29/10")
);

// Totals carry the rule (what placeOrder stores in orders.shipping_rule).
const pricedLine = (unitPrice: number) =>
  priceLine({ ref: { origin: "product-master", slug: "t", variantId: null }, productSlug: "t", variantId: null, displayName: "T", variantLabel: null, unitPrice }, 1);
const usedTotals = computeOrderTotals([pricedLine(520)], MEMBER_USED);
check("totals: 520 with the benefit used → 35, total 555, rule over_500", usedTotals.shippingFee === 35 && usedTotals.total === 555 && usedTotals.shippingRule === "over_500", JSON.stringify({ ...usedTotals, lines: undefined }));
const memberTotals = computeOrderTotals([pricedLine(300)], MEMBER);
check("totals: member 300 → 0, rule member_monthly", memberTotals.shippingFee === 0 && memberTotals.total === 300 && memberTotals.shippingRule === "member_monthly");

// 2–4. History, on the real schema.
const MIGRATIONS = path.join(process.cwd(), "src", "lib", "db", "migrations");
const files = fs
  .readdirSync(MIGRATIONS)
  .filter((f) => f.endsWith(".sql"))
  .sort();
check("migration 0022 (orders.shipping_rule) exists", files.includes("0022_order_shipping_rule.sql"), files.slice(-3).join(", "));
const db = new Database(":memory:");
db.pragma("foreign_keys = ON");
for (const f of files) db.exec(fs.readFileSync(path.join(MIGRATIONS, f), "utf8"));

db.prepare("INSERT INTO customers (id, phone) VALUES (1, '0811111111'), (2, '0822222222'), (3, '0833333333'), (4, '0844444444'), (5, '0855500000'), (6, '0866600000')").run();
db.prepare("INSERT INTO members (id) VALUES (1), (2), (3), (4), (5), (6)").run();
let nextId = 1;
function addOrder(o: { customer: number; member?: number; rule: string | null; status?: string; at: string; recipientPhone?: string; addr?: [string, string, string] }): number {
  const id = nextId++;
  db.prepare(
    "INSERT INTO orders (id, order_number, view_token, customer_id, member_id, status, subtotal, shipping_fee, shipping_rule, total, created_at) VALUES (?, ?, 'tok', ?, ?, ?, 400, 0, ?, 400, ?)"
  ).run(id, `OK-T-${id}`, o.customer, o.member ?? null, o.status ?? "pending_payment", o.rule, o.at);
  db.prepare(
    "INSERT INTO order_shipping_addresses (order_id, recipient_name, phone, line1, subdistrict, district, province, postal_code) VALUES (?, 'ก', ?, ?, ?, 'อ', 'จ', ?)"
  ).run(id, o.recipientPhone ?? "0899999999", ...(o.addr ?? ["1", "ต", "10110"]));
  return id;
}
const cancel = (id: number) => db.prepare("UPDATE orders SET status = 'cancelled' WHERE id = ?").run(id);
const mid = new Date("2026-10-20T05:00:00.000Z"); // 20/10 noon Bangkok
const hist = (memberId: number | null, phones: string[], address: { line1: string; subdistrict: string; postalCode: string } | null = null, now = mid) =>
  loadShippingHistory(db, { memberId, phones, address }, now);
const used = (memberId: number | null, phones: string[], now = mid) => hist(memberId, phones, null, now).benefitUsed;

check("nobody has used anything yet", used(1, ["0811111111"]) === false);
const a = addOrder({ customer: 1, member: 1, rule: "member_monthly", at: "2026-10-05T03:00:00.000Z" });
check("a member_monthly order this month (still unpaid) uses the benefit up", used(1, ["0811111111"]) === true);
check("…so the member's second order this month at 500 pays 35", show(decideShipping(500, hist(1, ["0811111111"]))) === "over_500 35");
check("…and at 300 pays 50 (the owner's 'ไม่มีสิทธิ' case)", show(decideShipping(300, hist(1, ["0811111111"]))) === "standard 50");
check("…at 800 still 0", show(decideShipping(800, hist(1, ["0811111111"]))) === "over_800 0");
check("…counted per member, whatever phone the member types next", used(1, ["0877777777"]) === true);
check("…another member with an unrelated phone is not affected", used(2, ["0855555555"]) === false);
check("…the same phone given as the recipient is matched too", used(2, ["0855555555", "0899999999"]) === true);
check("month rollover: on 1/11 00:00 Bangkok the October order no longer counts", used(1, ["0811111111"], firstSecondOfNov) === false);
check("…so the member gets the benefit again in November", show(decideShipping(300, hist(1, ["0811111111"], null, firstSecondOfNov))) === "member_monthly 0");
check("…but at 31/10 23:59:59 Bangkok it still counts", used(1, ["0811111111"], lastSecondOfOct) === true);
cancel(a);
check("cancelling that order gives the benefit back", used(1, ["0811111111"]) === false && used(2, ["0899999999"]) === false);

addOrder({ customer: 2, member: 2, rule: "member_monthly", at: "2026-10-06T03:00:00.000Z", recipientPhone: "082-333-4444" });
check("a recipient phone typed with dashes still matches", used(3, ["0823334444"]) === true);
check("a recipient phone matches an earlier order's checkout phone", used(3, ["0822222222"]) === true);
const guestThere = hist(null, ["0822222222"]);
check("a guest at that phone: benefitUsed is known (the sign-in line then promises nothing), the fee is the guest fee", guestThere.benefitUsed && !guestThere.isMember && show(decideShipping(300, guestThere)) === "standard 50", JSON.stringify(guestThere));

addOrder({ customer: 3, member: 3, rule: "over_800", at: "2026-10-07T03:00:00.000Z", recipientPhone: "0833333333" });
addOrder({ customer: 3, member: 3, rule: null, at: "2026-10-08T03:00:00.000Z", recipientPhone: "0833333333" });
addOrder({ customer: 3, member: 3, rule: "over_500", at: "2026-10-08T04:00:00.000Z", recipientPhone: "0833333333" });
addOrder({ customer: 3, member: 3, rule: "standard", at: "2026-10-08T05:00:00.000Z", recipientPhone: "0833333333" });
check("800+, 35, 50 and pre-tier (NULL) orders use nothing up", used(3, ["0833333333"]) === false);

// First version (29/10 evening) orders.
addOrder({ customer: 4, member: 4, rule: "first_member_order", at: "2026-10-09T03:00:00.000Z", recipientPhone: "0844444444" });
check("first version: a member's first_member_order (0 below 800) counts as this month's benefit", used(4, ["0844444444"]) === true);
addOrder({ customer: 5, member: 5, rule: "monthly_free", at: "2026-10-09T04:00:00.000Z", recipientPhone: "0855500000" });
check("first version: monthly_free placed signed in counts", used(5, ["0855500000"]) === true);
addOrder({ customer: 6, rule: "monthly_free", at: "2026-10-09T05:00:00.000Z", recipientPhone: "0866600000" });
check("first version: monthly_free placed as a guest does not count", used(6, ["0866600000"]) === false);
addOrder({ customer: 6, member: 6, rule: "monthly_used", at: "2026-10-09T06:00:00.000Z", recipientPhone: "0866600000" });
check("first version: monthly_used (paid 35) does not count", used(6, ["0866600000"]) === false);

// Anti-reuse (owner 29/10, BSOT §10): phone OR address (house no. + sub-district + postcode); the name never blocks.
db.prepare("INSERT INTO members (id) VALUES (7), (8)").run();
db.prepare("INSERT INTO customers (id, phone) VALUES (7, '0861111111')").run();
addOrder({ customer: 7, member: 7, rule: "member_monthly", at: "2026-10-12T03:00:00.000Z", recipientPhone: "0861111111", addr: ["12/3 หมู่ 4", "บางรัก", "10500"] });
check("a second LINE / Google account with the same recipient phone gets none", hist(8, ["0862222222", "0861111111"]).benefitUsed === true);
check(
  "same house no. + sub-district + postcode, other phone, other name → none (ต./แขวง and the street ignored)",
  hist(8, ["0862222222"], { line1: "12/3 ซอยอื่น", subdistrict: "แขวงบางรัก", postalCode: "10500" }).benefitUsed === true
);
check("…the house no. in Thai digits matches too", hist(8, ["0862222222"], { line1: "๑๒/๓ ซอยอื่น", subdistrict: "บางรัก", postalCode: "10500" }).benefitUsed === true);
check("next-door house no. 12/4 → still given", hist(8, ["0862222222"], { line1: "12/4 หมู่ 4", subdistrict: "บางรัก", postalCode: "10500" }).benefitUsed === false);
check("same house no., other postcode → still given", hist(8, ["0862222222"], { line1: "12/3 หมู่ 4", subdistrict: "บางรัก", postalCode: "10330" }).benefitUsed === false);
check(
  "same house no. + postcode, other sub-district → still given",
  hist(8, ["0862222222"], { line1: "12/3 หมู่ 4", subdistrict: "สีลม", postalCode: "10500" }).benefitUsed === false
);
check("houseNumber: '99/1 ถนน…' → '99/1' · 'เลขที่ 7-2 …' → '7-2'", houseNumber("99/1 ถนนทดสอบ") === "99/1" && houseNumber("เลขที่ 7-2 ซอย 1") === "7-2", `${houseNumber("99/1 ถนนทดสอบ")} ${houseNumber("เลขที่ 7-2 ซอย 1")}`);

addOrder({ customer: 1, member: 1, rule: "member_monthly", at: "2026-09-21T05:00:00.000Z", recipientPhone: "0812121212" });
check("a September benefit order does not count in October", used(null, ["0812121212"]) === false);
check("no phone and no member → nothing to look up", JSON.stringify(loadShippingHistory(db, { memberId: null, phones: ["", ""] }, mid)) === JSON.stringify(UNKNOWN_VISITOR));

const failed = results.filter((r) => !r.passed);
for (const r of results) console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.detail && !r.passed ? `\n      ${r.detail}` : ""}`);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
