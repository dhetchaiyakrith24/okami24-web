/**
 * Run: npx tsx src/lib/staff/line-order-paste-contract-test.ts
 * Paste → prefill for /staff/line-order (line-order-paste-rules.ts). Made-up names, phones and addresses.
 */
import { parsePastedOrder, type PasteProduct } from "./line-order-paste-rules";

let failed = 0;
function check(name: string, ok: boolean, detail?: unknown): void {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : `\n      ${JSON.stringify(detail)}`}`);
  if (!ok) failed++;
}

const products: PasteProduct[] = [
  { slug: "m-bar-10k", name: "M Bar 10K", options: [{ id: "mb-berry", name: "All Berry" }, { id: "mb-mint", name: "Cool Mint" }] },
  { slug: "caliburn-g3", name: "Caliburn G3", options: [{ id: "g3-black", name: "Black" }, { id: "g3-blue", name: "Blue" }] },
  { slug: "coil-g2", name: "Coil Caliburn G2", options: [{ id: null, name: "Coil Caliburn G2" }] },
];
const places = (code: string) =>
  code === "83000"
    ? [
        { subdistrict: "ตลาดใหญ่", district: "เมืองภูเก็ต", province: "ภูเก็ต" },
        { subdistrict: "ตลาดเหนือ", district: "เมืองภูเก็ต", province: "ภูเก็ต" },
      ]
    : code === "50200"
      ? [{ subdistrict: "ศรีภูมิ", district: "เมืองเชียงใหม่", province: "เชียงใหม่" }]
      : [];

// Shape 1: name / address / phone / items, one per line.
const a = parsePastedOrder(
  ["ทดสอบ ระบบ", "99/1 หมู่ 2 ต.ตลาดใหญ่ อ.เมืองภูเก็ต จ.ภูเก็ต 83000", "081-234-5678", "M Bar 10K All Berry x2", "Caliburn G3 สี Blue 1 ชิ้น"].join("\n"),
  products,
  places
);
check("phone with dashes", a.customerPhone === "0812345678", a);
check("postcode, not a piece of the phone", a.postalCode === "83000", a);
check("place: the sub-district the text names among the postcode's places", a.subdistrict === "ตลาดใหญ่" && a.district === "เมืองภูเก็ต" && a.province === "ภูเก็ต", a);
check("house line keeps the house part only", a.line1 === "99/1 หมู่ 2", a);
check("name line", a.recipientName === "ทดสอบ ระบบ", a);
check("items: product + option + quantity", JSON.stringify(a.items) === JSON.stringify([{ slug: "m-bar-10k", variantId: "mb-berry", quantity: 2 }, { slug: "caliburn-g3", variantId: "g3-blue", quantity: 1 }]), a.items);
check("nothing unmatched", a.unmatched.length === 0, a.unmatched);

// Shape 2: labelled fields, +66 phone, a postcode with one place, a product with no options, an unknown item.
const b = parsePastedOrder(
  ["ชื่อผู้รับ: มานี ทดสอบ", "ที่อยู่: 12 ถนนทดสอบ", "50200", "เบอร์ +66 89 876 5432", "Coil Caliburn G2 จำนวน 3", "Pod ยี่ห้ออื่น x1"].join("\n"),
  products,
  places
);
check("labelled name", b.recipientName === "มานี ทดสอบ", b);
check("+66 phone to local form", b.customerPhone === "0898765432", b);
check("one-place postcode fills the place", b.subdistrict === "ศรีภูมิ" && b.province === "เชียงใหม่", b);
check("labelled address", b.line1 === "12 ถนนทดสอบ", b);
check("product without options", JSON.stringify(b.items) === JSON.stringify([{ slug: "coil-g2", variantId: null, quantity: 3 }]), b.items);
check("unknown item handed back, not guessed", b.unmatched.includes("Pod ยี่ห้ออื่น x1"), b.unmatched);

// An option not named: handed back, never the first option.
const c = parsePastedOrder("M Bar 10K x2", products, places);
check("product with options but none named: unmatched", c.items.length === 0 && c.unmatched[0] === "M Bar 10K x2", c);
// Longest name wins: "Coil Caliburn G2" is not read as "Caliburn G3".
const d = parsePastedOrder("Coil Caliburn G2 1 ชิ้น", products, places);
check("the longest product name wins", d.items[0]?.slug === "coil-g2", d);
// Postcode with two places and no sub-district named: district + province, sub-district left to the admin.
const e = parsePastedOrder("5/5 ซอยทดสอบ 83000", products, places);
check("two places, none named: sub-district left empty", e.subdistrict === null && e.district === "เมืองภูเก็ต" && e.province === "ภูเก็ต", e);
check("empty paste = empty result", JSON.stringify(parsePastedOrder("   ", products, places).items) === "[]");

// Checker 10/11 on #1357: money is not a postcode · a second phone is handed back · zero-width characters are dropped.
const money = parsePastedOrder("ทดสอบ ระบบ\n99/1 หมู่ 2 ตลาดใหญ่ 83000\n081-234-5678\nยอด 12000 บาท", products, places);
check("money (ยอด … บาท) is not taken as the postcode", money.postalCode === "83000", money);
const amount = parsePastedOrder("ทดสอบ ระบบ\nโอน 50200\n99/1 หมู่ 2\n12000 บาท\n0812345678", products, places);
check("a 5-digit amount before บาท and after โอน is skipped; nothing else = no postcode", amount.postalCode === null, amount);
const twoPhones = parsePastedOrder("ทดสอบ ระบบ\n0812345678\nผู้รับ 089-876-5432\n99/1 หมู่ 2 83000", products, places);
check("second phone handed back for the admin to check", twoPhones.customerPhone === "0812345678" && JSON.stringify(twoPhones.otherPhones) === JSON.stringify(["0898765432"]), twoPhones);
check("one phone = no other phones", a.otherPhones.length === 0, a.otherPhones);
const hidden = parsePastedOrder("ทดสอบ\u200B ระบบ\n08\u200D1234\uFEFF5678", products, places);
check("zero-width characters dropped before reading", hidden.customerPhone === "0812345678" && hidden.recipientName === "ทดสอบ ระบบ", hidden);

console.log(failed === 0 ? "line-order paste contract: PASS" : `line-order paste contract: FAIL (${failed})`);
process.exit(failed === 0 ? 0 : 1);
