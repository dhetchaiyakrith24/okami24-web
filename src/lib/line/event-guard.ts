/**
 * Keeps the slip bot safe across website restarts (03/11 — on 02/11 slips posted while a deploy restarted the site got
 * no answer). Two pieces, both in memory only (no table — a schema change is the owner's call):
 *
 *   1. `firstSighting(webhookEventId)` — LINE may send one event twice: "Webhook redelivery" (re-sent after a non-2xx
 *      answer, e.g. while the site is down) and plain network duplicates. A redelivered copy is identical except for
 *      `deliveryContext.isRedelivery`, and LINE says to dedupe on `webhookEventId`
 *      (developers.line.biz/en/docs/messaging-api/receiving-messages/, read 03/11). An id already seen by this
 *      instance is skipped, so one slip never gets two verdicts. A redelivery reaching a NEW instance is new to it —
 *      which is right: LINE only redelivers what no instance answered with 2xx.
 *   2. `track(work)` — counts slip checks still running, so a shutdown can say in the log how many it waits for.
 *      `next start` itself waits for pending `after()` work on SIGTERM (node_modules/next/dist/server/lib/
 *      start-server.js `cleanup` → `nextServer.close()` awaits the after() awaiter). But Render kills the old instance
 *      30 s after SIGTERM, and that delay cannot be raised on a service with a persistent disk (render.com/docs/deploys,
 *      read 03/11), while one slip check may take ~60 s (LINE download + EasySlip with its retry, slip-retry.ts).
 *   3. `raceShutdown(work)` — so such a check does not end in silence: once `beginShutdown()` was called (SIGTERM) and
 *      SHUTDOWN_REPLY_AFTER_MS passed, it resolves null and the caller uses the reply token for a "send it again" line
 *      while the process is still alive to send it.
 *
 * No `server-only` import so the contract test can run it under plain `tsx`.
 */

/** Ids remembered. LINE groups send a handful of events per minute here; 1,000 covers hours of redelivery window. */
export const MAX_REMEMBERED = 1000;
/** After SIGTERM, how long a slip check may still run before the bot answers "send it again" instead. Render kills at
 *  30 s; a reply is one short HTTPS call (normally < 1 s, capped at 10 s in client.ts). */
export const SHUTDOWN_REPLY_AFTER_MS = 18_000;

export interface EventGuard {
  firstSighting(webhookEventId: string | undefined): boolean;
  track<T>(work: Promise<T>): Promise<T>;
  inFlight(): number;
  beginShutdown(): void;
  raceShutdown<T>(work: Promise<T>): Promise<T | null>;
}

export function createEventGuard(maxRemembered = MAX_REMEMBERED, shutdownReplyAfterMs = SHUTDOWN_REPLY_AFTER_MS): EventGuard {
  const seen = new Set<string>();
  let running = 0;
  let deadlinePassed = false;
  const waiters = new Set<() => void>();
  return {
    beginShutdown() {
      setTimeout(() => {
        deadlinePassed = true;
        for (const wake of waiters) wake();
        waiters.clear();
      }, shutdownReplyAfterMs).unref();
    },
    raceShutdown(work) {
      if (deadlinePassed) return Promise.resolve(null);
      let wake: () => void = () => {};
      const deadline = new Promise<null>((res) => {
        wake = () => res(null);
        waiters.add(wake);
      });
      return Promise.race([work, deadline]).finally(() => waiters.delete(wake));
    },
    firstSighting(webhookEventId) {
      // An event without an id (very old payloads, hand-made tests) cannot be deduped — handle it.
      if (!webhookEventId) return true;
      if (seen.has(webhookEventId)) return false;
      seen.add(webhookEventId);
      // A Set iterates in insertion order, so the first key is the oldest.
      if (seen.size > maxRemembered) seen.delete(seen.values().next().value as string);
      return true;
    },
    async track(work) {
      running += 1;
      try {
        return await work;
      } finally {
        running -= 1;
      }
    },
    inFlight: () => running,
  };
}
