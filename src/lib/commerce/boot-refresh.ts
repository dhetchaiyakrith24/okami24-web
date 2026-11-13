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
  fetch: (url: string, init: { cache: "no-store" }) => Promise<{ status: number; headers?: { get(name: string): string | null }; text?: () => Promise<string> }>;
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
  {
    orderingEnabled,
    firstDelayMs = 500,
    retryMs = 1000,
    maxTries = 60,
    // Kill switch without a code change: OKAMI24_BOOT_WARM=off in Render's environment (a restart, not a deploy) turns the
    // warm loop off; the boot refresh itself still runs (visitors then render pages as before this round).
    warm = process.env.OKAMI24_BOOT_WARM !== "off",
  }: { orderingEnabled: boolean; firstDelayMs?: number; retryMs?: number; maxTries?: number; warm?: boolean },
): Promise<number | null> {
  if (!orderingEnabled) return null;
  const url = bootRefreshUrl(deps.port ?? process.env.PORT);
  await deps.wait(firstDelayMs);
  for (let attempt = 1; attempt <= maxTries; attempt++) {
    try {
      const res = await deps.fetch(url, { cache: "no-store" });
      deps.log(`[switches] pages marked for refresh after boot — ${url} answered ${res.status} (try ${attempt})`);
      // Re-render every page now, one by one, so no visitor pays a render and no two renders run at once (first-hit round
      // 14/11). Not awaited by anyone: register() never waits for this.
      const kind = res.headers?.get(BOOT_KIND_HEADER);
      if (warm && (kind === "expire" || kind === "stale")) await warmPages(deps, url.replace(/\/api\/cart\/count$/, ""));
      else if (!warm) deps.log("[switches] boot warm loop off (OKAMI24_BOOT_WARM=off) — pages render on their first visit");
      return res.status;
    } catch {
      if (attempt < maxTries) await deps.wait(retryMs);
    }
  }
  deps.log(`[switches] could not reach ${url} after ${maxTries} tries — pages refresh on the first visitor's request instead`);
  return null;
}

/**
 * How the boot refresh marks the pages (first-hit round, owner 13/11 "กดเปลี่ยนหัวข้อหน่วง"; live 14/11 after a deploy: a product
 * page's first visit took 0.9–3.3 s, every later one 0.3 s). Expiring every page outright made the FIRST visit of EVERY page
 * after EVERY deploy a full render on the 0.5-CPU box — 12–19 deploys a day.
 *
 * The build renders every page with the switches all open (shop-switches.ts: no data disk at build). So:
 * - "expire" — a switch that changes what a page renders is not in its build state (the cart is off: the ordering wording;
 *   a product is hidden: its stock reads "out"; the site is closed): the build copy is WRONG, so it must never be served —
 *   the first visit renders fresh, exactly as before.
 * - "stale" — every switch still stands as the build rendered it: the build copy is right. It is served at once and the
 *   page re-renders in the background (stale-while-revalidate), which still brings the live stock (JSON-LD) in on the
 *   first visit after a deploy, as the expiring refresh did.
 * Either way warmPages() then re-renders every sitemap page right after the boot, one at a time: "expire" is the live state
 * while the owner keeps the cart off (08/11 — /api/cart/count answered paused: true on 14/11), and with "stale" the
 * background renders visitors would set off arrive in a heap on a 0.5-CPU box (measured: a stale page served in 0.06 s,
 * the next page 1.6 s because the first one's re-render held the CPU) — the loop runs them single file instead.
 */
export function bootRefreshKind(switches: { cartOff: boolean; siteClosed: boolean; hidden: readonly string[] }): "expire" | "stale" {
  return switches.cartOff || switches.siteClosed || switches.hidden.length > 0 ? "expire" : "stale";
}

/** /api/cart/count names the kind its boot refresh used (once one ran), so the server's own call knows whether to warm. */
export const BOOT_KIND_HEADER = "x-okami24-boot-refresh";

/** Paths in a sitemap, in its order (home, categories, products … — the order the site lists them). */
export function sitemapPaths(xml: string): string[] {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
    try {
      return new URL(m[1]).pathname;
    } catch {
      return "";
    }
  }).filter((p, i, all) => p.startsWith("/") && all.indexOf(p) === i);
}

/**
 * Re-render every page in the sitemap once, right after the boot refresh marked them: one page at a time, resting after each
 * as long as it took (at least `paceMs`), so a visitor's request always finds the 0.5-CPU box between two renders, never
 * behind a queue of them.
 * An expired page renders on the request itself (MISS). A stale one is answered at once (STALE) and re-renders behind the
 * answer, so the loop asks again every `pollMs` until it reads HIT before moving on — single file in both cases. A page a
 * visitor opens meanwhile behaves as without the loop. Logs one line; never throws.
 */
export async function warmPages(
  deps: BootRefreshDeps,
  base: string,
  { paceMs = 250, pollMs = 300, maxPolls = 40, maxPages = 400 }: { paceMs?: number; pollMs?: number; maxPolls?: number; maxPages?: number } = {},
): Promise<number> {
  const started = Date.now();
  let paths: string[] = [];
  try {
    const res = await deps.fetch(`${base}/sitemap.xml`, { cache: "no-store" });
    paths = res.text ? sitemapPaths(await res.text()).slice(0, maxPages) : [];
  } catch {
    /* no sitemap → nothing to warm; visitors render as before */
  }
  let done = 0;
  for (const p of paths) {
    const pageStarted = Date.now();
    try {
      for (let poll = 0; poll < maxPolls; poll++) {
        const res = await deps.fetch(base + p, { cache: "no-store" });
        if (res.text) await res.text();
        if (res.headers?.get("x-nextjs-cache")?.toUpperCase() !== "STALE") break;
        await deps.wait(pollMs);
      }
      done++;
    } catch {
      /* one page failing does not stop the rest */
    }
    // Rest at least as long as that page took (never under paceMs): the loop holds at most half of the box over any stretch,
    // so a visitor, the LINE slip webhook or Shipnity's stock push always gets the other half. A page that took long because
    // the box was busy (real traffic) makes the next rest longer by the same amount — the loop backs off under load.
    await deps.wait(Math.max(paceMs, Date.now() - pageStarted));
  }
  deps.log(`[switches] warmed ${done}/${paths.length} sitemap pages after the boot refresh in ${Math.round((Date.now() - started) / 1000)} s`);
  return done;
}
