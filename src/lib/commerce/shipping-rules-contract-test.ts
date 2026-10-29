/**
 * OKami24 — shipping-fee tiers (owner 29/10, BSOT §10), held to every rule and boundary the owner named:
 *
 *   1. the amounts: 499 / 500 / 799 / 800, for a newcomer and for someone who already used the month's one;
 *   2. a member's first order is 0 at any amount, once; a cancelled first order gives the benefit back; anti-reuse by
 *      phone or address (house no. + sub-district + postcode, owner 29/10), never by name;
 *   3. the second 500+ order in a month pays 35; the month rolls over at midnight Bangkok time; a cancelled order never
 *      uses the month up; it is counted per checkout phone, recipient phone (as typed, dashes and all) and member;
 *   4. only `monthly_free` orders count — 800+, first-order and pre-tier (NULL) orders use nothing up;
 *   5. both open settings (Q1 members only · Q2 rolling 30 days) behave as their names say;
 *   6. the cart's "add ฿n more" step and the note keys.
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
  loadShippingHistory,
  monthlyWindowStart,
  nextShippingStep,
  shippingNoteKey,
  SHIPPING_SETTINGS,
  UNKNOWN_VISITOR,
  type ShippingHistory,
  type ShippingSettings,
} from "./shipping-rules";
import { computeOrderTotals, priceLine } from "./pricing";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

const USED: ShippingHistory = { isMember: false, firstOrderUsed: false, monthlyFreeUsed: true };
const NEW_MEMBER: ShippingHistory = { isMember: true, firstOrderUsed: false, monthlyFreeUsed: false };
const OLD_MEMBER: ShippingHistory = { isMember: true, firstOrderUsed: true, monthlyFreeUsed: false };
const MEMBERS_ONLY: ShippingSettings = { ...SHIPPING_SETTINGS, monthlyFreeFor: "members" };
const ROLLING: ShippingSettings = { ...SHIPPING_SETTINGS, monthlyWindow: "rolling-30-days" };
const show = (d: { rule: string; fee: number }) => `${d.rule} ${d.fee}`;

// 0. The settings ship with the recommended defaults until the owner answers Q1 / Q2.
check("Q1 default = everyone, Q2 default = calendar month in Bangkok", SHIPPING_SETTINGS.monthlyFreeFor === "everyone" && SHIPPING_SETTINGS.monthlyWindow === "calendar-month-bangkok", JSON.stringify(SHIPPING_SETTINGS));

// 1. Amount boundaries.
for (const [subtotal, history, rule, fee, label] of [
  [499, UNKNOWN_VISITOR, "standard", 50, "newcomer 499"],
  [500, UNKNOWN_VISITOR, "monthly_free", 0, "newcomer 500"],
  [799, UNKNOWN_VISITOR, "monthly_free", 0, "newcomer 799"],
  [800, UNKNOWN_VISITOR, "over_800", 0, "newcomer 800 (does not spend the month's one)"],
  [499, USED, "standard", 50, "month used, 499"],
  [500, USED, "monthly_used", 35, "month used, 500"],
  [799, USED, "monthly_used", 35, "month used, 799"],
  [800, USED, "over_800", 0, "month used, 800"],
  [1, NEW_MEMBER, "first_member_order", 0, "new member, 1 baht"],
  [499, NEW_MEMBER, "first_member_order", 0, "new member, 499"],
  [900, NEW_MEMBER, "first_member_order", 0, "new member, 900 (first order is the first order)"],
  [499, OLD_MEMBER, "standard", 50, "member with an order, 499"],
  [500, OLD_MEMBER, "monthly_free", 0, "member with an order, 500"],
] as const) {
  const d = decideShipping(subtotal, history);
  check(`${label} → ${rule} ${fee}`, d.rule === rule && d.fee === fee, show(d));
}

// 5. Q1 = members only: a guest at 500 pays 35 and is told why; a member still gets the month's one.
check("Q1 members-only: guest 500 → monthly_used 35", show(decideShipping(500, UNKNOWN_VISITOR, MEMBERS_ONLY)) === "monthly_used 35");
check("Q1 members-only: member 500 → monthly_free 0", show(decideShipping(500, OLD_MEMBER, MEMBERS_ONLY)) === "monthly_free 0");
check("Q1 members-only: guest 800 → over_800 0", show(decideShipping(800, UNKNOWN_VISITOR, MEMBERS_ONLY)) === "over_800 0");
check("Q1 members-only: the guest's note says members get it", shippingNoteKey("monthly_used", UNKNOWN_VISITOR, MEMBERS_ONLY) === "monthlyMembersOnly");

// 3. Month boundaries in Bangkok time (UTC+7, no daylight saving).
const lastSecondOfOct = new Date("2026-10-31T16:59:59.000Z"); // 31/10 23:59:59 Bangkok
const firstSecondOfNov = new Date("2026-10-31T17:00:00.000Z"); // 1/11 00:00:00 Bangkok
check("31/10 23:59:59 Bangkok → window starts 1/10 00:00 Bangkok", monthlyWindowStart(lastSecondOfOct) === "2026-09-30T17:00:00.000Z", monthlyWindowStart(lastSecondOfOct));
check("1/11 00:00 Bangkok → window starts 1/11 00:00 Bangkok", monthlyWindowStart(firstSecondOfNov) === "2026-10-31T17:00:00.000Z", monthlyWindowStart(firstSecondOfNov));
check("1/1 Bangkok rolls the year", monthlyWindowStart(new Date("2026-12-31T18:00:00.000Z")) === "2026-12-31T17:00:00.000Z", monthlyWindowStart(new Date("2026-12-31T18:00:00.000Z")));
check("Q2 rolling: window = 30 days back", monthlyWindowStart(firstSecondOfNov, "rolling-30-days") === "2026-10-01T17:00:00.000Z", monthlyWindowStart(firstSecondOfNov, "rolling-30-days"));

// 6. The cart's next step and note keys.
check("newcomer 300 → add 200 for 0", JSON.stringify(nextShippingStep(300, UNKNOWN_VISITOR)) === JSON.stringify({ addMore: 200, fee: 0 }), JSON.stringify(nextShippingStep(300, UNKNOWN_VISITOR)));
check("month used 300 → add 200 for 35", JSON.stringify(nextShippingStep(300, USED)) === JSON.stringify({ addMore: 200, fee: 35 }), JSON.stringify(nextShippingStep(300, USED)));
check("month used 600 → add 200 for 0", JSON.stringify(nextShippingStep(600, USED)) === JSON.stringify({ addMore: 200, fee: 0 }), JSON.stringify(nextShippingStep(600, USED)));
check("already 0 → no next step", nextShippingStep(500, UNKNOWN_VISITOR) === null && nextShippingStep(100, NEW_MEMBER) === null);
check("Q2 rolling: month notes switch to the 30-day wording", shippingNoteKey("monthly_free", UNKNOWN_VISITOR, ROLLING) === "monthlyFreeRolling" && shippingNoteKey("monthly_used", USED, ROLLING) === "monthlyUsedRolling");
check("calendar month: month notes", shippingNoteKey("monthly_free", UNKNOWN_VISITOR) === "monthlyFree" && shippingNoteKey("monthly_used", USED) === "monthlyUsed");

// Totals carry the rule (what placeOrder stores in orders.shipping_rule).
const pricedLine = (unitPrice: number) =>
  priceLine({ ref: { origin: "product-master", slug: "t", variantId: null }, productSlug: "t", variantId: null, displayName: "T", variantLabel: null, unitPrice }, 1);
const usedTotals = computeOrderTotals([pricedLine(520)], USED);
check("totals: 520 with the month used → 35, total 555, rule monthly_used", usedTotals.shippingFee === 35 && usedTotals.total === 555 && usedTotals.shippingRule === "monthly_used", JSON.stringify({ ...usedTotals, lines: undefined }));

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
db.prepare("INSERT INTO members (id) VALUES (1), (2), (3), (4), (5)").run();
let nextId = 1;
function addOrder(o: { customer: number; member?: number; rule: string | null; status?: string; at: string; recipientPhone?: string; addr?: [string, string, string] }): number {
  const id = nextId++;
  db.prepare(
    "INSERT INTO orders (id, order_number, view_token, customer_id, member_id, status, subtotal, shipping_fee, shipping_rule, total, created_at) VALUES (?, ?, 'tok', ?, ?, ?, 600, 0, ?, 600, ?)"
  ).run(id, `OK-T-${id}`, o.customer, o.member ?? null, o.status ?? "pending_payment", o.rule, o.at);
  db.prepare(
    "INSERT INTO order_shipping_addresses (order_id, recipient_name, phone, line1, subdistrict, district, province, postal_code) VALUES (?, 'ก', ?, ?, ?, 'อ', 'จ', ?)"
  ).run(id, o.recipientPhone ?? "0899999999", ...(o.addr ?? ["1", "ต", "10110"]));
  return id;
}
const cancel = (id: number) => db.prepare("UPDATE orders SET status = 'cancelled' WHERE id = ?").run(id);
const mid = new Date("2026-10-20T05:00:00.000Z"); // 20/10 noon Bangkok
const used = (phones: string[], memberId: number | null = null, now = mid, settings = SHIPPING_SETTINGS) =>
  loadShippingHistory(db, { memberId, phones }, now, settings).monthlyFreeUsed;

check("nobody has used anything yet", used(["0811111111"]) === false);
const a = addOrder({ customer: 1, rule: "monthly_free", at: "2026-10-05T03:00:00.000Z" });
check("a monthly_free order this month (still unpaid) uses the month up for that checkout phone", used(["0811111111"]) === true);
check("…so that phone's second 500+ order this month pays 35", show(decideShipping(500, loadShippingHistory(db, { memberId: null, phones: ["0811111111"] }, mid))) === "monthly_used 35");
check("…and a different phone is not affected", used(["0855555555"]) === false);
check("…the same phone given as the recipient is matched too", used(["0855555555", "0899999999"]) === true);
check("month rollover: on 1/11 00:00 Bangkok the October order no longer counts", used(["0811111111"], null, firstSecondOfNov) === false);
check("…but at 31/10 23:59:59 Bangkok it still does", used(["0811111111"], null, lastSecondOfOct) === true);
cancel(a);
check("cancelling that order gives the month's one back", used(["0811111111"]) === false && used(["0899999999"]) === false);

addOrder({ customer: 2, rule: "monthly_free", at: "2026-10-06T03:00:00.000Z", recipientPhone: "082-333-4444" });
check("a recipient phone typed with dashes still matches", used(["0823334444"]) === true);
check("a recipient phone matches an earlier order's checkout phone", used(["0822222222"]) === true);

addOrder({ customer: 3, rule: "over_800", at: "2026-10-07T03:00:00.000Z", recipientPhone: "0833333333" });
addOrder({ customer: 3, rule: null, at: "2026-10-08T03:00:00.000Z", recipientPhone: "0833333333" });
check("800+ and pre-tier (NULL) orders use nothing up", used(["0833333333"]) === false);

const firstOrder = addOrder({ customer: 4, member: 1, rule: "first_member_order", at: "2026-10-09T03:00:00.000Z", recipientPhone: "0844444444" });
const m1 = loadShippingHistory(db, { memberId: 1, phones: ["0844444444"] }, mid);
check("a member's first order is recorded: no second first-order benefit", m1.isMember && m1.firstOrderUsed === true, JSON.stringify(m1));
check("…and it does not use up the month's one", m1.monthlyFreeUsed === false && show(decideShipping(600, m1)) === "monthly_free 0", JSON.stringify(m1));
cancel(firstOrder);
const m1After = loadShippingHistory(db, { memberId: 1, phones: [] }, mid);
check("cancelling the first order gives the first-order benefit back", m1After.firstOrderUsed === false && decideShipping(100, m1After).rule === "first_member_order", JSON.stringify(m1After));

addOrder({ customer: 4, member: 2, rule: "monthly_free", at: "2026-10-10T03:00:00.000Z", recipientPhone: "0866666666" });
check("the month's one is counted per member, whatever phone the member types next", used(["0877777777"], 2) === true);
check("a guest (no member) with an unrelated phone is not affected", used(["0877777777"]) === false);
const newMember = loadShippingHistory(db, { memberId: 3, phones: ["0877777777"] }, mid);
check("a member with no orders at all → first order 0", decideShipping(2000, newMember).rule === "first_member_order", JSON.stringify(newMember));

// Anti-reuse (owner 29/10, BSOT §10): phone OR address (house no. + sub-district + postcode); the name never blocks.
const histFor = (memberId: number | null, phones: string[], address: { line1: string; subdistrict: string; postalCode: string } | null) =>
  loadShippingHistory(db, { memberId, phones, address }, mid);
addOrder({ customer: 5, member: 4, rule: "first_member_order", at: "2026-10-12T03:00:00.000Z", recipientPhone: "0861111111", addr: ["12/3 หมู่ 4", "บางรัก", "10500"] });
check("first-order benefit: a second LINE / Google account with the same recipient phone gets none", histFor(5, ["0862222222", "0861111111"], null).firstOrderUsed === true);
check(
  "first-order benefit: same house no. + sub-district + postcode, other phone, other name → none (ต./แขวง and the street ignored)",
  histFor(5, ["0862222222"], { line1: "12/3 ซอยอื่น", subdistrict: "แขวงบางรัก", postalCode: "10500" }).firstOrderUsed === true
);
check("first-order benefit: next-door house no. 12/4 → still given", histFor(5, ["0862222222"], { line1: "12/4 หมู่ 4", subdistrict: "บางรัก", postalCode: "10500" }).firstOrderUsed === false);
check("first-order benefit: same house no., other postcode → still given", histFor(5, ["0862222222"], { line1: "12/3 หมู่ 4", subdistrict: "บางรัก", postalCode: "10330" }).firstOrderUsed === false);
addOrder({ customer: 6, rule: "monthly_free", at: "2026-10-11T03:00:00.000Z", recipientPhone: "0863333333", addr: ["88 ถนนสุขุมวิท", "คลองตัน", "10110"] });
check("month's one: same address, other phones → 35", decideShipping(500, histFor(null, ["0864444444"], { line1: "88 ซอย 5", subdistrict: "ต.คลองตัน", postalCode: "10110" })).fee === 35);
check("month's one: the house no. in Thai digits matches too", histFor(null, ["0864444444"], { line1: "๘๘ ซอย 5", subdistrict: "คลองตัน", postalCode: "10110" }).monthlyFreeUsed === true);
check("month's one: house 89 at the same sub-district + postcode → still free", histFor(null, ["0864444444"], { line1: "89 ถนนสุขุมวิท", subdistrict: "คลองตัน", postalCode: "10110" }).monthlyFreeUsed === false);
check("houseNumber: '99/1 ถนน…' → '99/1' · 'เลขที่ 7-2 …' → '7-2'", houseNumber("99/1 ถนนทดสอบ") === "99/1" && houseNumber("เลขที่ 7-2 ซอย 1") === "7-2", `${houseNumber("99/1 ถนนทดสอบ")} ${houseNumber("เลขที่ 7-2 ซอย 1")}`);

addOrder({ customer: 1, rule: "monthly_free", at: "2026-09-21T05:00:00.000Z", recipientPhone: "0812121212" });
check("Q2 rolling: an order 29 days back counts", used(["0812121212"], null, mid, ROLLING) === true);
check("Q2 calendar: the same September order does not count in October", used(["0812121212"], null, mid) === false);
check("Q2 rolling: 31 days back does not count", used(["0812121212"], null, new Date("2026-10-22T05:00:00.000Z"), ROLLING) === false);
check("no phone and no member → nothing to look up", JSON.stringify(loadShippingHistory(db, { memberId: null, phones: ["", ""] }, mid)) === JSON.stringify(UNKNOWN_VISITOR));

const failed = results.filter((r) => !r.passed);
for (const r of results) console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.detail && !r.passed ? `\n      ${r.detail}` : ""}`);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
