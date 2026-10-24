/**
 * Contract tests for the shop's message to the customer on the order page (owner 24/10) — pure, plain `tsx`.
 */
import { cleanOrderMessage, ORDER_MESSAGE_MAX } from "./order-message-rules";

export function runOrderMessageContractTests(): { name: string; passed: boolean; detail: string }[] {
  const results: { name: string; passed: boolean; detail: string }[] = [];
  const check = (name: string, condition: boolean, detail = "") => results.push({ name, passed: condition, detail });

  check("not a string → null", cleanOrderMessage(undefined) === null && cleanOrderMessage(7) === null);
  check("too short → null", cleanOrderMessage("") === null && cleanOrderMessage("  ok \n ") === null);
  check("Thai message kept as typed", cleanOrderMessage("สินค้าหมดจากคลังค่ะ") === "สินค้าหมดจากคลังค่ะ");
  check("lines trimmed, spaces folded, paragraphs kept", cleanOrderMessage("  บรรทัดแรก   ค่ะ \r\n\r\n\r\n\n บรรทัดสอง ") === "บรรทัดแรก ค่ะ\n\nบรรทัดสอง");
  const b = String.fromCharCode;
  check("control + invisible characters removed", cleanOrderMessage(`ab${b(0)}c${b(0x200b)}d${b(0xfeff)}e`) === "ab c d e");
  const cut = cleanOrderMessage("ก".repeat(ORDER_MESSAGE_MAX + 40));
  check(`cut at ${ORDER_MESSAGE_MAX} characters`, cut !== null && Array.from(cut).length === ORDER_MESSAGE_MAX, `got ${cut ? Array.from(cut).length : "null"}`);
  return results;
}

if (require.main === module) {
  const results = runOrderMessageContractTests();
  const failed = results.filter((r) => !r.passed);
  for (const r of results) console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `\n      ${r.detail}` : ""}`);
  if (failed.length > 0) {
    console.error(`\n${failed.length} of ${results.length} checks failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} checks passed.`);
}
