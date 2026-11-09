/**
 * Run: npx tsx src/lib/staff/line-order-contract-test.ts
 * Keying a LINE order (line-order-rules.ts): what the form accepts, and which slip may pay it. Made-up figures and names.
 */
import { findDuplicate, specialPrice, localMobile, parseItems, parseLineOrderForm, pickableSlips, slipFits } from "./line-order-rules";

let failed = 0;
function check(name: string, ok: boolean): void {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failed++;
}

check("mobile with dashes reads as local", localMobile("081-234-5678") === "0812345678");
check("+66 form reads as local", localMobile("+66 81 234 5678") === "0812345678");
check("a landline is not a customer key", localMobile("021234567") === null);
check("one digit short is refused", localMobile("081234567") === null);

check("items: same option twice = one line", JSON.stringify(parseItems('[{"slug":"a-b","variantId":"x","quantity":2},{"slug":"a-b","variantId":"x","quantity":1}]')) === JSON.stringify([{ slug: "a-b", variantId: "x", quantity: 3 }]));
check("items: empty list refused", parseItems("[]") === null);
check("items: zero or fractional quantity refused", parseItems('[{"slug":"a","quantity":0}]') === null && parseItems('[{"slug":"a","quantity":1.5}]') === null);
check("items: a slug that is not a slug refused", parseItems('[{"slug":"../x","quantity":1}]') === null);
check("items: not JSON refused", parseItems("a,b") === null);
check("items: no variant = null", parseItems('[{"slug":"pod","quantity":1}]')?.[0].variantId === null);

const form = (over: Record<string, string>) => {
  const base: Record<string, string> = {
    customerPhone: "0812345678",
    recipientName: "ทดสอบ ระบบ",
    recipientPhone: "",
    line1: "99/1 หมู่ 2",
    subdistrict: "ตลาดใหญ่",
    district: "เมืองภูเก็ต",
    province: "ภูเก็ต",
    postalCode: "83000",
    keyedBy: "แอดมิน",
    items: '[{"slug":"pod","variantId":null,"quantity":1}]',
    slipRef: "none",
    ...over,
  };
  return parseLineOrderForm((n) => base[n]);
};
const ok = form({});
check("a full form passes", ok.ok);
check("empty ship-to phone = the customer's phone", ok.ok && ok.input.recipientPhone === "0812345678");
check("'none' = no slip", ok.ok && ok.input.slipRef === null);
check("a picked slip is kept", (() => {
  const r = form({ slipRef: "REF123" });
  return r.ok && r.input.slipRef === "REF123";
})());
check("no keyed-by name refused", (() => {
  const r = form({ keyedBy: "  " });
  return !r.ok && r.error === "keyed-by";
})());
check("bad customer phone refused", (() => {
  const r = form({ customerPhone: "12345" });
  return !r.ok && r.error === "phone";
})());
check("missing address refused", (() => {
  const r = form({ line1: "" });
  return !r.ok && r.error === "missing";
})());

const now = Date.parse("2026-11-09T12:00:00+07:00");
const s = (transRef: string, baht: number, at: string) => ({ transRef, amountSatang: baht * 100, transferredAt: at });
const list = pickableSlips([s("OLD", 500, "2026-11-05T09:00:00+07:00"), s("A", 590, "2026-11-09T10:00:00+07:00"), s("B", 300, "2026-11-08T10:00:00+07:00")], now);
check("pickable: last 3 days only, newest first", list.map((x) => x.transRef).join(",") === "A,B");
check("slip fits: exact total", slipFits(list[0], 590) === "ok");
check("slip fits: other amount refused", slipFits(list[0], 600) === "amount");
check("slip fits: gone from the list = taken", slipFits(undefined, 590) === "not-loose");

const o = (orderNumber: string, total: number, createdAt: string, status = "approved") => ({ orderNumber, total, createdAt, status });
check("duplicate: same total 2 h ago is named", findDuplicate([o("A", 590, "2026-11-09T10:00:00+07:00")], 590, now)?.orderNumber === "A");
check("duplicate: the newest of two is named", findDuplicate([o("A", 590, "2026-11-09T08:00:00+07:00"), o("B", 590, "2026-11-09T11:00:00+07:00")], 590, now)?.orderNumber === "B");
check("duplicate: another total is not", findDuplicate([o("A", 600, "2026-11-09T10:00:00+07:00")], 590, now) === null);
check("duplicate: older than 24 h is not", findDuplicate([o("A", 590, "2026-11-08T11:00:00+07:00")], 590, now) === null);
check("duplicate: a cancelled order is not", findDuplicate([o("A", 590, "2026-11-09T10:00:00+07:00", "cancelled")], 590, now) === null);
check("form: the tick reads as notDuplicate", (() => { const r = parseLineOrderForm((n) => ({ customerPhone: "0812345678", keyedBy: "x", items: JSON.stringify([{ slug: "a", quantity: 1 }]), recipientName: "x", line1: "1", province: "x", postalCode: "10110", notDuplicate: "1" } as Record<string, string>)[n]); return r.ok && r.input.notDuplicate === true; })());

check("special price: lower than the web total = the difference as discount", JSON.stringify(specialPrice(590, 500)) === JSON.stringify({ ok: true, discount: 90 }));
check("special price: none, or equal to the web total = no discount", JSON.stringify(specialPrice(590, null)) === JSON.stringify({ ok: true, discount: null }) && JSON.stringify(specialPrice(590, 590)) === JSON.stringify({ ok: true, discount: null }));
check("special price: above the web total or zero refused", !specialPrice(590, 600).ok && !specialPrice(590, 0).ok);
const priced = (agreedTotal: string) => parseLineOrderForm((n) => ({ customerPhone: "0812345678", keyedBy: "x", items: JSON.stringify([{ slug: "a", quantity: 1 }]), recipientName: "x", line1: "1", province: "x", postalCode: "10110", agreedTotal, priceReason: " ลูกค้าประจำ " } as Record<string, string>)[n]);
check("form: agreed total read (commas ok) with the reason", (() => { const r = priced("1,200"); return r.ok && r.input.agreedTotal === 1200 && r.input.priceReason === "ลูกค้าประจำ"; })());
check("form: an agreed total that is not baht digits is refused", (() => { const r = priced("12.5"); return !r.ok && r.error === "price"; })());
check("form: empty agreed total = web price", (() => { const r = priced(""); return r.ok && r.input.agreedTotal === null; })());

console.log(failed === 0 ? "line-order contract: PASS" : `line-order contract: FAIL (${failed})`);
process.exit(failed === 0 ? 0 : 1);
