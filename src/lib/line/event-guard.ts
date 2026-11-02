/**
 * Keeps a slip check from ending in silence when the website restarts for a deploy (03/11 — on 02/11 slips posted
 * while deploys restarted the site got no answer). In memory only:
 *
 *   1. `track(work)` — counts slip checks still running, so a shutdown can say in the log how many it waits for.
 *      `next start` itself waits for pending `after()` work on SIGTERM (node_modules/next/dist/server/lib/
 *      start-server.js `cleanup` → `nextServer.close()` awaits the after() awaiter). But Render kills the old instance
 *      30 s after SIGTERM, and that delay cannot be raised on a service with a persistent disk (render.com/docs/deploys,
 *      read 03/11), while one slip check may take ~60 s (LINE download + EasySlip with its retry, slip-retry.ts).
 *   2. `raceShutdown(work)` — so such a check does not end in silence: once `beginShutdown()` was called (SIGTERM) and
 *      SHUTDOWN_REPLY_AFTER_MS passed, it resolves null and the caller uses the reply token for a "send it again" line
 *      while the process is still alive to send it.
 *
 * No `server-only` import so the contract test can run it under plain `tsx`.
 */

/** After SIGTERM, how long a slip check may still run before the bot answers "send it again" instead. Render kills at
 *  30 s; a reply is one short HTTPS call (normally < 1 s, capped at 10 s in client.ts). */
export const SHUTDOWN_REPLY_AFTER_MS = 18_000;

export interface EventGuard {
  track<T>(work: Promise<T>): Promise<T>;
  inFlight(): number;
  beginShutdown(): void;
  raceShutdown<T>(work: Promise<T>): Promise<T | null>;
}

export function createEventGuard(shutdownReplyAfterMs = SHUTDOWN_REPLY_AFTER_MS): EventGuard {
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
