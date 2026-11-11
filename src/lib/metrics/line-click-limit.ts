/**
 * How many LINE clicks the counter accepts (security pass 09/11). `POST /api/metrics/line-click` needs no sign-in by
 * design — a visitor's browser sends it — so without a ceiling a script could insert rows without end, filling the disk
 * and making the owner's LINE-click numbers meaningless.
 *
 * Per visitor address: MAX_PER_CLIENT clicks per WINDOW_MS (a person taps LINE a few times at most); plus a shop-wide
 * MAX_TOTAL per window so even many addresses together cannot flood the table. A refused click still answers 204 (the
 * visitor's LINE tab is already open; nothing here may slow or show anything) — it is just not counted.
 *
 * In memory on purpose, like phone-rate-limit.ts: one server process, and a deploy resetting the counts is harmless.
 * Pure (no server-only import) so the contract test can run it under plain tsx.
 */
export const WINDOW_MS = 10 * 60_000;
export const MAX_PER_CLIENT = 20;
export const MAX_TOTAL = 600;

export type ClickLedger = Map<string, number[]>;

/** Records one click for `client` at `now` and says whether it may be counted. */
export function allowLineClick(ledger: ClickLedger, client: string, now: number): boolean {
  const since = now - WINDOW_MS;
  let total = 0;
  for (const [key, times] of ledger) {
    const fresh = times.filter((t) => t > since);
    if (fresh.length === 0) ledger.delete(key);
    else {
      if (fresh.length !== times.length) ledger.set(key, fresh);
      total += fresh.length;
    }
  }
  const mine = ledger.get(client) ?? [];
  if (mine.length >= MAX_PER_CLIENT || total >= MAX_TOTAL) return false;
  mine.push(now);
  ledger.set(client, mine);
  return true;
}
