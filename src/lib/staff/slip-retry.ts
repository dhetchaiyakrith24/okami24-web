import type { EasySlipResult } from "@/lib/staff/easyslip";

/**
 * When a slip check asks EasySlip a second time (owner 30/10: the LINE bot answered "ตรวจสลิปไม่ได้ตอนนี้ (รหัส TIMEOUT)"
 * 2–3 times in one day, and the same slip checked a few minutes later went through). Pure — the contract test
 * (slip-retry-contract-test.ts) runs it with stand-in answers; slip-verify.ts passes the real EasySlip call.
 *
 * At most ONE extra call per check:
 *   - 429 with a short Retry-After → wait that long, ask again (unchanged from the slip-check round 07/10);
 *   - EasySlip did not answer (our timeout, a network error, its own 500) → wait a moment, ask again with a shorter
 *     limit. Every other code is EasySlip's answer about the slip itself and is returned as it is.
 * Time budget: the LINE reply token is only good for about a minute after the webhook (developers.line.biz Messaging
 * API reference, "Reply tokens must be used within one minute") and fetching the picture may take 10 s
 * (src/lib/line/client.ts) — 10 + 20 + 1.5 + 15 s stays under it.
 *
 * `unanswered` matters to the verdict: EasySlip may have finished the first try after we stopped waiting, and then
 * answers the second with `isDuplicate: true` (same branch, already verified — cached, no quota; /en/v2/verify/bank/
 * "Duplicate Handling"). That "seen before" is our own first try, not a slip used twice, so the caller must not
 * flag it.
 */

export const FIRST_TIMEOUT_MS = 20_000;
export const RETRY_TIMEOUT_MS = 15_000;
export const RETRY_DELAY_MS = 1_500;

/** Our codes for "no answer" (easyslip.ts) + EasySlip's 500 codes (/en/reference/error-codes). */
export const UNANSWERED_CODES: ReadonlySet<string> = new Set(["TIMEOUT", "NETWORK", "API_SERVER_ERROR", "INTERNAL_SERVER_ERROR"]);

export interface RetriedResult<T> {
  result: EasySlipResult<T>;
  /** The code of a first try that got no answer (null = the first answer is the one returned, or a 429 retry). */
  unanswered: string | null;
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function verifyWithRetry<T>(
  attempt: (timeoutMs: number) => Promise<EasySlipResult<T>>,
  wait: (ms: number) => Promise<void> = sleep
): Promise<RetriedResult<T>> {
  const first = await attempt(FIRST_TIMEOUT_MS);
  if (first.ok) return { result: first, unanswered: null };
  if (first.code === "RATE_LIMIT_EXCEEDED" && (first.retryAfterSeconds ?? 99) <= 3) {
    await wait((first.retryAfterSeconds ?? 1) * 1000);
    return { result: await attempt(FIRST_TIMEOUT_MS), unanswered: null };
  }
  if (UNANSWERED_CODES.has(first.code)) {
    await wait(RETRY_DELAY_MS);
    return { result: await attempt(RETRY_TIMEOUT_MS), unanswered: first.code };
  }
  return { result: first, unanswered: null };
}

/** EasySlip's own "this slip was verified before" counts only when our first try was answered (see the head). */
export function easySlipSeenBefore(isDuplicate: boolean, unanswered: string | null): boolean {
  return isDuplicate && unanswered === null;
}
