/**
 * T2-04 follow-up: the prerendered pages follow the owner's cart switch from the first visit after a boot.
 *
 * `next build` reads the switches as open (shop-switches.ts: no data disk at build), and pages re-rendered before a restart
 * can stay on disk with the switch as it was then. /api/cart/count marks every page stale once per process (its GET, #1401),
 * but only when someone asks it — and every page asks only AFTER it has loaded, so the first visitor after a boot (and any
 * crawler that runs no script) got the old copy. Here the server asks it itself, as soon as it answers: by the time a visitor
 * arrives the pages are already marked, and `revalidatePath` without a profile expires them outright (no stale-while-
 * revalidate), so that first visit renders fresh.
 *
 * Called from src/instrumentation.ts register() — never awaited (register must not wait for the server it runs in), never
 * throws, and gives up quietly after `maxTries` (the visitors' own requests still refresh the pages, as before). It imports
 * nothing server-only, so its contract test runs under plain tsx; register() passes ORDERING_ENABLED in.
 */
export interface BootRefreshDeps {
  /** The port this server listens on. Default: process.env.PORT, read when the refresh starts — `next start` sets it once
   *  it listens, before register() runs. */
  port?: string;
  fetch: (url: string, init: { cache: "no-store" }) => Promise<{ status: number }>;
  wait: (ms: number) => Promise<void>;
  log: (line: string) => void;
}

const DEFAULT_DEPS: BootRefreshDeps = {
  fetch: (url, init) => fetch(url, init),
  wait: (ms) => new Promise((r) => setTimeout(r, ms)),
  log: (line) => console.log(line),
};

/** The URL the server asks itself: the same route every page asks after load (src/app/api/cart/count/route.ts). */
export function bootRefreshUrl(port: string | undefined): string {
  return `http://127.0.0.1:${port || "3000"}/api/cart/count`;
}

/**
 * Ask /api/cart/count once the server answers: the first try after `firstDelayMs`, then every `retryMs`, at most `maxTries`.
 * Resolves to the HTTP status that answered, or null when it gave up or ordering is off by build (nothing to refresh: the
 * route only refreshes when ORDERING_ENABLED, and a build with ordering off already says "order on LINE" everywhere).
 */
export async function refreshPagesAfterBoot(
  deps: BootRefreshDeps = DEFAULT_DEPS,
  { orderingEnabled, firstDelayMs = 500, retryMs = 1000, maxTries = 60 }: { orderingEnabled: boolean; firstDelayMs?: number; retryMs?: number; maxTries?: number },
): Promise<number | null> {
  if (!orderingEnabled) return null;
  const url = bootRefreshUrl(deps.port ?? process.env.PORT);
  await deps.wait(firstDelayMs);
  for (let attempt = 1; attempt <= maxTries; attempt++) {
    try {
      const res = await deps.fetch(url, { cache: "no-store" });
      deps.log(`[switches] pages marked for refresh after boot — ${url} answered ${res.status} (try ${attempt})`);
      return res.status;
    } catch {
      if (attempt < maxTries) await deps.wait(retryMs);
    }
  }
  deps.log(`[switches] could not reach ${url} after ${maxTries} tries — pages refresh on the first visitor's request instead`);
  return null;
}
