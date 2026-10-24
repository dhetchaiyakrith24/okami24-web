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
  const partial = refundAmount([{ lineTotal: 350 }], { total: 750, lineCount: 2 });
  check("refund: one of two lines out → that line only, order goes on", partial.amount === 350 && !partial.wholeOrder, JSON.stringify(partial));
  const whole = refundAmount([{ lineTotal: 350 }], { total: 400, lineCount: 1 });
  check("refund: every line out → the whole paid total incl. shipping", whole.amount === 400 && whole.wholeOrder, JSON.stringify(whole));
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
