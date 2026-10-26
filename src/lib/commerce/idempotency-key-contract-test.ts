/**
 * Contract tests for the checkout's double-submit key (N6 26/10, checker note: an empty key was not refused) — pure, plain `tsx`.
 */
import crypto from "node:crypto";
import { isIdempotencyKey } from "./idempotency-key";

export function runIdempotencyKeyContractTests(): { name: string; passed: boolean; detail: string }[] {
  const results: { name: string; passed: boolean; detail: string }[] = [];
  const check = (name: string, condition: boolean, detail = "") => results.push({ name, passed: condition, detail });

  check("a minted randomUUID is accepted", isIdempotencyKey(crypto.randomUUID()));
  check("empty / missing is refused", !isIdempotencyKey("") && !isIdempotencyKey(undefined) && !isIdempotencyKey(null));
  check("short guessable keys are refused", !isIdempotencyKey("1") && !isIdempotencyKey("abc") && !isIdempotencyKey("123456789012345"));
  check("spaces, quotes and other characters are refused", !isIdempotencyKey(" ".repeat(20)) && !isIdempotencyKey("a'b\"c;d e<f>g/h\i=j"));
  check("over 128 characters is refused", !isIdempotencyKey("a".repeat(129)) && isIdempotencyKey("a".repeat(128)));
  return results;
}

if (require.main === module) {
  const results = runIdempotencyKeyContractTests();
  const failed = results.filter((r) => !r.passed);
  for (const r of results) console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `\n      ${r.detail}` : ""}`);
  if (failed.length > 0) {
    console.error(`\n${failed.length} of ${results.length} checks failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} checks passed.`);
}
