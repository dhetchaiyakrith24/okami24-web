/**
 * OKami24 — slip re-ask contract (owner 30/10: "ตรวจสลิปไม่ได้ตอนนี้ (รหัส TIMEOUT)" 2–3 times a day; src/lib/staff/slip-retry.ts).
 *
 * What it holds the slip check to:
 *   1. EasySlip is asked a second time only when it did not answer (TIMEOUT · NETWORK · its 500s) or asked us to wait
 *      a few seconds (429) — never after an answer about the slip itself, and never a third time;
 *   2. the second try after no answer waits a moment and uses the shorter limit, so a LINE reply still goes out inside
 *      its one-minute token (picture fetch 10 s + both tries + the pause);
 *   3. EasySlip's "already verified" after our own unanswered first try is not a slip used twice.
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */

import type { EasySlipResult } from "./easyslip";
import {
  easySlipSeenBefore,
  FIRST_TIMEOUT_MS,
  RETRY_DELAY_MS,
  RETRY_TIMEOUT_MS,
  verifyWithRetry,
} from "./slip-retry";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

type Answer = EasySlipResult<string>;
const OK: Answer = { ok: true, data: "slip" };
const fail = (code: string, retryAfterSeconds?: number): Answer => ({ ok: false, code, retryAfterSeconds });

/** Plays the answers in order and records every try's time limit and every pause. */
async function run(answers: Answer[]) {
  const limits: number[] = [];
  const waits: number[] = [];
  const out = await verifyWithRetry<string>(
    async (timeoutMs) => {
      limits.push(timeoutMs);
      return answers[Math.min(limits.length - 1, answers.length - 1)];
    },
    async (ms) => {
      waits.push(ms);
    }
  );
  return { ...out, limits, waits, detail: JSON.stringify({ out, limits, waits }) };
}

async function main() {
  // 1. who gets a second try
  const first = await run([OK]);
  check("answered at once = one try, no pause", first.limits.length === 1 && first.waits.length === 0 && first.unanswered === null, first.detail);

  for (const code of ["TIMEOUT", "NETWORK", "API_SERVER_ERROR", "INTERNAL_SERVER_ERROR"]) {
    const r = await run([fail(code), OK]);
    check(
      `${code} then an answer = asked again, answer returned, marked unanswered`,
      r.result.ok && r.limits.length === 2 && r.unanswered === code,
      r.detail
    );
  }

  const twice = await run([fail("TIMEOUT"), fail("TIMEOUT"), OK]);
  check("no answer twice = stops after two tries, TIMEOUT returned", !twice.result.ok && twice.result.code === "TIMEOUT" && twice.limits.length === 2, twice.detail);

  const shortWait = await run([fail("RATE_LIMIT_EXCEEDED", 2), OK]);
  check(
    "429 with Retry-After 2 s = waits 2 s, asks again, not marked unanswered",
    shortWait.result.ok && shortWait.waits[0] === 2000 && shortWait.limits.length === 2 && shortWait.unanswered === null,
    shortWait.detail
  );
  const longWait = await run([fail("RATE_LIMIT_EXCEEDED", 10), OK]);
  check("429 with Retry-After 10 s = no second try", !longWait.result.ok && longWait.limits.length === 1, longWait.detail);

  for (const code of ["SLIP_NOT_FOUND", "SLIP_PENDING", "QUOTA_EXCEEDED", "BAD_RESPONSE", "NOT_CONFIGURED", "INVALID_API_KEY"]) {
    const r = await run([fail(code), OK]);
    check(`${code} = EasySlip's answer, returned as it is after one try`, !r.result.ok && r.result.code === code && r.limits.length === 1, r.detail);
  }

  // 2. timing
  const retried = await run([fail("TIMEOUT"), OK]);
  check(
    "second try waits RETRY_DELAY_MS and uses RETRY_TIMEOUT_MS",
    retried.waits.length === 1 && retried.waits[0] === RETRY_DELAY_MS && retried.limits[0] === FIRST_TIMEOUT_MS && retried.limits[1] === RETRY_TIMEOUT_MS,
    retried.detail
  );
  const lineWorst = 10_000 + FIRST_TIMEOUT_MS + RETRY_DELAY_MS + RETRY_TIMEOUT_MS; // picture fetch limit in src/lib/line/client.ts
  check("worst case for a LINE slip stays under 50 s (reply token ~1 minute)", lineWorst <= 50_000, `${lineWorst} ms`);

  // 3. "already verified" after our own unanswered try
  check("isDuplicate after an answered first try = seen before", easySlipSeenBefore(true, null) === true);
  check("isDuplicate after a TIMEOUT first try = not seen before", easySlipSeenBefore(true, "TIMEOUT") === false);
  check("no isDuplicate = not seen before", easySlipSeenBefore(false, null) === false);

  for (const res of results) {
    console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
  }
  const failed = results.filter((x) => !x.passed);
  if (failed.length > 0) {
    console.error(`\n${failed.length} of ${results.length} checks failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} checks passed.`);
}

void main();
