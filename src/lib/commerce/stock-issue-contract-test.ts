/**
 * Contract tests for "out of stock after payment" (cart UX batch E, owner 24/10) — pure, plain `tsx`.
 */
import {
  canOpenStockIssue,
  cleanBankAccount,
  cleanBankText,
  cleanPromptPayPhone,
  cleanRefundRef,
  decodeSwapValue,
  encodeSwapValue,
  maskAccount,
  maskPhone,
  parseItemIds,
  parseSwapJson,
  refundAmount,
  stockIssueStage,
} from "./stock-issue-rules";

export function runStockIssueContractTests(): { name: string; passed: boolean; detail: string }[] {
  const results: { name: string; passed: boolean; detail: string }[] = [];
  const check = (name: string, condition: boolean, detail = "") => results.push({ name, passed: condition, detail });

  check(
    "issue only on paid, not-yet-shipped orders",
    canOpenStockIssue("payment_submitted") &&
      canOpenStockIssue("awaiting_verification") &&
      canOpenStockIssue("approved") &&
      canOpenStockIssue("processing") &&
      !canOpenStockIssue("pending_payment") &&
      !canOpenStockIssue("shipped") &&
      !canOpenStockIssue("completed") &&
      !canOpenStockIssue("cancelled")
  );
  check(
    "stage follows choice then resolution",
    stockIssueStage({ choice: null, resolution: null }) === "waiting-choice" &&
      stockIssueStage({ choice: "refund", resolution: null }) === "chosen" &&
      stockIssueStage({ choice: "refund", resolution: "refunded" }) === "resolved" &&
      stockIssueStage({ choice: null, resolution: "refunded" }) === "resolved"
  );
  check("PromptPay: Thai mobile kept, dashes/spaces dropped", cleanPromptPayPhone("081-234 5678") === "0812345678");
  check("PromptPay: +66 form folded to 0", cleanPromptPayPhone("+66812345678") === "0812345678");
  check(
    "PromptPay: citizen ID, bank account, landline, junk rejected",
    cleanPromptPayPhone("1101700203451") === null &&
      cleanPromptPayPhone("153-8-29240-7") === null &&
      cleanPromptPayPhone("021234567") === null &&
      cleanPromptPayPhone("hello") === null &&
      cleanPromptPayPhone(undefined) === null
  );
  check(
    "bank account: 10–15 digits kept, dashes dropped; citizen ID (13), short, letters refused",
    cleanBankAccount("153-8-29240-7") === "1538292407" &&
      cleanBankAccount("123456789012") === "123456789012" &&
      cleanBankAccount("1101700203451") === null &&
      cleanBankAccount("12345") === null &&
      cleanBankAccount("12345abc90") === null &&
      cleanBankAccount(undefined) === null
  );
  check(
    "bank / branch text: 2–60 characters, markup refused",
    cleanBankText(" กสิกรไทย ") === "กสิกรไทย" && cleanBankText("ก") === null && cleanBankText("<b>x</b>") === null && cleanBankText("") === null && cleanBankText(3) === null
  );
  check(
    "bank / branch text: invisible characters dropped, C1 controls refused",
    cleanBankText("\u200bกสิกร\u2060ไทย\ufeff") === "กสิกรไทย" && cleanBankText("\u202eกสิกรไทย") === "กสิกรไทย" && cleanBankText("\u200b\u200bก") === null && cleanBankText("กสิกร\u0085ไทย") === null
  );
  check("bank account mask shows the last 4 digits only", maskAccount("1538292407") === "xxx-x-xxx2407");
  check("mask shows the last 4 digits only", maskPhone("0812345678") === "xxx-xxx-5678");
  check("refund ref: bank reference kept", cleanRefundRef("  2026102414x5AbC ") === "2026102414x5AbC");
  check("refund ref: too short / odd characters rejected", cleanRefundRef("ab") === null && cleanRefundRef("<script>") === null && cleanRefundRef(5) === null);
  check(
    "swap value round-trips with and without an option",
    JSON.stringify(decodeSwapValue(encodeSwapValue("muro-connector-20k", "yakult"))) === JSON.stringify({ productSlug: "muro-connector-20k", variantId: "yakult" }) &&
      JSON.stringify(decodeSwapValue(encodeSwapValue("coil-55", null))) === JSON.stringify({ productSlug: "coil-55", variantId: null })
  );
  check("swap value: junk rejected", decodeSwapValue("") === null && decodeSwapValue("A::b") === null && decodeSwapValue("a::b::c") === null && decodeSwapValue(7) === null);
  check(
    "swap json: good list parsed, bad list refused whole",
    parseSwapJson('[{"itemId":3,"productSlug":"x","variantId":null}]')?.length === 1 &&
      parseSwapJson('[{"itemId":3,"productSlug":"x","variantId":null},{"itemId":"4"}]') === null &&
      parseSwapJson("not json") === null &&
      parseSwapJson(null) === null
  );
  check("item ids parsed, junk dropped", JSON.stringify(parseItemIds("12, 15,x,0,-3")) === "[12,15]");
  const L = (itemId: number, lineTotal: number) => ({ itemId, lineTotal });
  const partial = refundAmount([L(1, 350)], { total: 750, shippingFee: 0, lines: [L(1, 350), L(2, 400)] });
  check("refund: one of two lines out, no discount → that line's own total, order goes on", partial.amount === 350 && !partial.wholeOrder, JSON.stringify(partial));
  const keptFee = refundAmount([L(1, 350)], { total: 750, shippingFee: 50, lines: [L(1, 350), L(2, 350)] });
  check("refund: no discount, shipping kept → the line's own total", keptFee.amount === 350 && !keptFee.wholeOrder, JSON.stringify(keptFee));
  const whole = refundAmount([L(1, 350)], { total: 400, shippingFee: 50, lines: [L(1, 350)] });
  check("refund: every line out → the whole paid total incl. shipping", whole.amount === 400 && whole.wholeOrder, JSON.stringify(whole));
  // Bug sweep 12/11: a LINE special price (orders.discount) — 2 × ฿500, free shipping, ฿600 off → ฿400 paid.
  const special = refundAmount([L(1, 500)], { total: 400, shippingFee: 0, lines: [L(1, 500), L(2, 500)] });
  check("refund: special price, one of two equal lines out → half of what was paid (฿200, not ฿500)", special.amount === 200 && !special.wholeOrder, JSON.stringify(special));
  const specialAll = refundAmount([L(1, 500), L(2, 500)], { total: 400, shippingFee: 0, lines: [L(1, 500), L(2, 500)] });
  check("refund: special price, every line out → order.total", specialAll.amount === 400 && specialAll.wholeOrder, JSON.stringify(specialAll));
  // ฿300 + ฿700 goods, ฿50 shipping kept, ฿250 off → ฿800 paid, ฿750 of it for goods; the ฿300 line's share = ฿225.
  const withFee = refundAmount([L(1, 300)], { total: 800, shippingFee: 50, lines: [L(1, 300), L(2, 700)] });
  check("refund: special price with a shipping fee → the line's share of the goods paid, fee kept", withFee.amount === 225, JSON.stringify(withFee));
  // ฿100 × 3, ฿100 off, no shipping → ฿200 paid; one line's share = ฿66.67 → ฿67 to the customer, never above paid − what ships.
  const third = refundAmount([L(1, 100)], { total: 200, shippingFee: 0, lines: [L(1, 100), L(2, 100), L(3, 100)] });
  check("refund: a fraction of a baht rounds once, never past paid − what still ships", (third.amount === 67 || third.amount === 66) && third.amount <= 200 - 133, JSON.stringify(third));
  const twoOfThree = refundAmount([L(1, 100), L(2, 100)], { total: 200, shippingFee: 0, lines: [L(1, 100), L(2, 100), L(3, 100)] });
  check("refund: one line + the rest never add up to more than was paid", twoOfThree.amount + Math.floor(200 / 3) <= 200 && twoOfThree.amount >= 133, JSON.stringify(twoOfThree));
  const feeEaten = refundAmount([L(1, 500)], { total: 30, shippingFee: 50, lines: [L(1, 500), L(2, 500)] });
  check("refund: a discount that ate into the kept fee → nothing paid for goods, ฿0, never negative", feeEaten.amount === 0, JSON.stringify(feeEaten));
  for (const [outs, lines, total, fee] of [
    [[L(1, 990)], [L(1, 990), L(2, 10)], 1, 0],
    [[L(2, 10)], [L(1, 990), L(2, 10)], 999, 0],
    [[L(1, 333)], [L(1, 333), L(2, 333), L(3, 334)], 977, 77],
  ] as const) {
    const r = refundAmount([...outs], { total, shippingFee: fee, lines: [...lines] });
    check(`refund: never above what was paid (total ${total})`, Number.isInteger(r.amount) && r.amount >= 0 && r.amount <= total - fee, JSON.stringify(r));
  }
  return results;
}

if (require.main === module) {
  const results = runStockIssueContractTests();
  const failed = results.filter((r) => !r.passed);
  for (const r of results) console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `\n      ${r.detail}` : ""}`);
  if (failed.length > 0) {
    console.error(`\n${failed.length} of ${results.length} checks failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} checks passed.`);
}
