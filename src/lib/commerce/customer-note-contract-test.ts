/**
 * Contract tests for the customer's note to the shop (cart UX batch C, owner 24/10) — pure, plain `tsx`.
 */
import { cleanCustomerNote, CUSTOMER_NOTE_MAX } from "./customer-note";

export function runCustomerNoteContractTests(): { name: string; passed: boolean; detail: string }[] {
  const results: { name: string; passed: boolean; detail: string }[] = [];
  const check = (name: string, condition: boolean, detail = "") => results.push({ name, passed: condition, detail });

  check("not a string → null", cleanCustomerNote(undefined) === null && cleanCustomerNote(42) === null);
  check("empty / spaces only → null", cleanCustomerNote("") === null && cleanCustomerNote("   \n\t ") === null);
  check("Thai note kept as typed", cleanCustomerNote("ฝากวางหน้าบ้านนะครับ") === "ฝากวางหน้าบ้านนะครับ");
  check("trimmed, new lines and runs of spaces folded", cleanCustomerNote("  ส่งช่วงเย็น\r\n\n  ได้ไหม  ") === "ส่งช่วงเย็น ได้ไหม");
  check("control + invisible characters removed", cleanCustomerNote("a\u0000b\u200bc\u2060d\ufeff") === "a b c d");
  const long = "ก".repeat(CUSTOMER_NOTE_MAX + 50);
  const cut = cleanCustomerNote(long);
  check(`cut at ${CUSTOMER_NOTE_MAX} characters`, cut !== null && Array.from(cut).length === CUSTOMER_NOTE_MAX, `got ${cut ? Array.from(cut).length : "null"}`);
  return results;
}

if (require.main === module) {
  const results = runCustomerNoteContractTests();
  const failed = results.filter((r) => !r.passed);
  for (const r of results) console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `\n      ${r.detail}` : ""}`);
  if (failed.length > 0) {
    console.error(`\n${failed.length} of ${results.length} checks failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} checks passed.`);
}
