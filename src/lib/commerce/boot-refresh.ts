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
import { categories } from "@/data/categories";
import { OWNER_BEST_SELLERS } from "@/data/sales-badges";

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
      // The pages were just expired: re-render them now, one by one and the most-visited first, so no visitor pays a render
      // and no two renders run at once (first-hit round 14/11). Not awaited by anyone: register() never waits for this.
      if (warm && res.headers?.get(BOOT_KIND_HEADER) === "expire") await warmPages(deps, url.replace(/\/api\/cart\/count$/, ""));
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
 * Why the warm loop (first-hit round, owner 13/11 "กดเปลี่ยนหัวข้อหน่วง"; live 14/11 after a deploy: a product page's first visit
 * took 0.9–3.3 s, every later one 0.3 s): the boot refresh expires every page outright — the build copy must never be served,
 * because the build renders with no live stock and with the switches all open (checker #1467: with the cart ON the build copy
 * still carried InStoreOnly / the LINE-order block on 56 of 131 product pages) — so without the loop the FIRST visit of EVERY
 * page after EVERY deploy (12–19 a day) was a full render. The refresh stays an outright expire; the loop only takes the
 * renders off the visitors. There is deliberately no stale-while-revalidate branch.
 */
/** /api/cart/count says "expire" once its boot refresh ran (whoever triggered it), so the server's own call knows to warm. */
export const BOOT_KIND_HEADER = "x-okami24-boot-refresh";

/**
 * Warm order: the pages most visitors land on first — home, /products, every category, every brand — then the owner's best
 * sellers, then every other product page, then the rest (guides, service pages …). Sitemap order is kept inside each group.
 */
const CATEGORY_PATHS = new Set(categories.map((c) => `/products/${c.slug}`));
export function warmRank(path: string): number {
  if (path === "/") return 0;
  if (path === "/products") return 1;
  if (CATEGORY_PATHS.has(path)) return 2;
  if (path.startsWith("/brands/")) return 3;
  if (path.startsWith("/products/")) return OWNER_BEST_SELLERS.has(path.slice("/products/".length)) ? 4 : 5;
  return 6;
}
export function warmOrder(paths: readonly string[]): string[] {
  return paths.map((p, i) => ({ p, i, r: warmRank(p) })).sort((a, b) => a.r - b.r || a.i - b.i).map((x) => x.p);
}

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
 * Re-render every page in the sitemap once (warmOrder), right after the boot refresh expired them: one page at a time — the
 * request itself renders it (MISS) — resting after each as long as it took (at least `paceMs`), so a visitor's request always
 * finds the box between two renders, never behind a queue of them. A page a visitor opens meanwhile renders on that visit as
 * before. Logs when the first `firstN` are warm and when all are; never throws.
 */
export async function warmPages(
  deps: BootRefreshDeps,
  base: string,
  { paceMs = 250, maxPages = 400, firstN = 30 }: { paceMs?: number; maxPages?: number; firstN?: number } = {},
): Promise<number> {
  const started = Date.now();
  let paths: string[] = [];
  try {
    const res = await deps.fetch(`${base}/sitemap.xml`, { cache: "no-store" });
    paths = res.text ? warmOrder(sitemapPaths(await res.text())).slice(0, maxPages) : [];
  } catch {
    /* no sitemap → nothing to warm; visitors render as before */
  }
  let done = 0;
  for (const p of paths) {
    const pageStarted = Date.now();
    try {
      const res = await deps.fetch(base + p, { cache: "no-store" });
      if (res.text) await res.text();
      done++;
    } catch {
      /* one page failing does not stop the rest */
    }
    // Rest at least as long as that page took (never under paceMs): the loop holds at most half of the box over any stretch,
    // so a visitor, the LINE slip webhook or Shipnity's stock push always gets the other half. A page that took long because
    // the box was busy (real traffic) makes the next rest longer by the same amount — the loop backs off under load.
    await deps.wait(Math.max(paceMs, Date.now() - pageStarted));
    if (done === firstN && paths.length > firstN) deps.log(`[switches] warmed the first ${firstN} pages (home, /products, categories, brands, best sellers …) in ${Math.round((Date.now() - started) / 1000)} s`);
  }
  deps.log(`[switches] warmed ${done}/${paths.length} sitemap pages after the boot refresh in ${Math.round((Date.now() - started) / 1000)} s`);
  return done;
}
