/**
 * Contract tests for the refresh after a boot (T2-04 follow-up, src/lib/commerce/boot-refresh.ts) — plain `tsx`, no server.
 * Run: npx tsx src/lib/commerce/boot-refresh-contract-test.ts (discovered by scripts/verify-catalog.ts)
 *
 * Proves:
 *   1. it asks the same route every page asks (/api/cart/count) on this server's own port, on 127.0.0.1;
 *   2. it keeps asking while the server does not answer yet, stops at the first answer, and gives up after maxTries
 *      without throwing;
 *   3. a build with ordering off asks nothing;
 *   4. the wiring: register() starts it without awaiting it, and the route still marks every page stale on its first call.
 */
import fs from "node:fs";
import path from "node:path";
import { BOOT_KIND_HEADER, bootRefreshUrl, refreshPagesAfterBoot, sitemapPaths, warmOrder, warmPages, warmRank, type BootRefreshDeps } from "./boot-refresh";

type Result = { name: string; passed: boolean; detail: string };

function fakeDeps(failFirst: number, port = "4321") {
  const calls: string[] = [];
  const waits: number[] = [];
  const logs: string[] = [];
  const deps: BootRefreshDeps = {
    port,
    fetch: async (url) => {
      calls.push(url);
      if (calls.length <= failFirst) throw new Error("ECONNREFUSED");
      return { status: 200 };
    },
    wait: async (ms) => {
      waits.push(ms);
    },
    log: (line) => logs.push(line),
  };
  return { deps, calls, waits, logs };
}

export async function runBootRefreshContractTests(): Promise<Result[]> {
  const results: Result[] = [];
  const check = (name: string, condition: boolean, detail = "") => results.push({ name, passed: condition, detail });

  // 1. the URL
  check("1a. the URL is this server's own /api/cart/count", bootRefreshUrl("10000") === "http://127.0.0.1:10000/api/cart/count");
  check("1b. no port known → Next's default 3000", bootRefreshUrl(undefined) === "http://127.0.0.1:3000/api/cart/count");

  // 2. retries
  const ok = fakeDeps(3);
  const status = await refreshPagesAfterBoot(ok.deps, { orderingEnabled: true, firstDelayMs: 500, retryMs: 1000, maxTries: 60 });
  check("2a. answered on the 4th try → status 200", status === 200, `status ${status}, calls ${ok.calls.length}`);
  check("2b. asked exactly until it answered (4 calls), all to the same URL", ok.calls.length === 4 && ok.calls.every((u) => u === "http://127.0.0.1:4321/api/cart/count"), ok.calls.join(" "));
  check("2c. waited the first delay, then once per failed try", JSON.stringify(ok.waits) === JSON.stringify([500, 1000, 1000, 1000]), JSON.stringify(ok.waits));
  check("2d. one log line naming the answer", ok.logs.length === 1 && /answered 200 \(try 4\)/.test(ok.logs[0]), ok.logs.join(" | "));
  const never = fakeDeps(Infinity);
  let threw = false;
  let gaveUp: number | null = 0;
  try {
    gaveUp = await refreshPagesAfterBoot(never.deps, { orderingEnabled: true, firstDelayMs: 0, retryMs: 0, maxTries: 5 });
  } catch {
    threw = true;
  }
  check("2e. never answers → null after maxTries, no throw", !threw && gaveUp === null && never.calls.length === 5, `calls ${never.calls.length}`);
  check("2f. … and says so once", never.logs.length === 1 && /could not reach/.test(never.logs[0]), never.logs.join(" | "));

  // 3. ordering off by build
  const off = fakeDeps(0);
  const offStatus = await refreshPagesAfterBoot(off.deps, { orderingEnabled: false });
  check("3. ordering off by build → asks nothing", offStatus === null && off.calls.length === 0 && off.waits.length === 0);

  // 4. wiring (source reads: register() and the route need a running server, the product page a full render)
  const root = path.resolve(__dirname, "../../..");
  const read = (p: string) => fs.readFileSync(path.join(root, p), "utf8");
  const instr = read("src/instrumentation.ts");
  check(
    "4a. register() starts refreshPagesAfterBoot without awaiting it",
    /import\("\.\/lib\/commerce\/boot-refresh"\)[^;]*refreshPagesAfterBoot\(undefined, \{ orderingEnabled: ORDERING_ENABLED \}\)/.test(instr) &&
      !/await\s+(import\("\.\/lib\/commerce\/boot-refresh"\)|refreshPagesAfterBoot)/.test(instr),
  );
  const route = read("src/app/api/cart/count/route.ts");
  check("4b. /api/cart/count still marks every page stale once per process", /revalidatePath\("\/", "layout"\)/.test(route) && /__okami24CopyRefreshed/.test(route));

  // 5. first-hit round 14/11 (checker #1467): the boot refresh only ever EXPIRES — the build copy is never served after a start
  //    (no live stock, switches read as open). No stale-while-revalidate branch may come back.
  const bootSrc = read("src/lib/commerce/boot-refresh.ts");
  check(
    "5a. no stale kind: the route expires with revalidatePath only (no revalidateTag, no \"max\" profile, no bootRefreshKind)",
    route.includes('revalidatePath("/", "layout");') && !/revalidateTag|"max"|bootRefreshKind|STALE/.test(route) && !/bootRefreshKind|"stale"|STALE/.test(bootSrc),
  );
  check("5b. the route says \"expire\" in the boot-kind header once its refresh ran", route.includes('[BOOT_KIND_HEADER]: "expire"') && route.includes("boot.__okami24BootExpired = true;"));

  // 6. expired pages are warmed by the server itself, one at a time, most-visited first
  check(
    "6a. warm order: home, /products, categories, brands, best sellers, other products, the rest (sitemap order inside each)",
    JSON.stringify(warmOrder(["/guides/x", "/products/zzz-not-a-product", "/brands/uwell", "/products/caliburn-g5", "/products/pod-systems", "/products", "/"])) ===
      JSON.stringify(["/", "/products", "/products/pod-systems", "/brands/uwell", ...(warmRank("/products/caliburn-g5") === 4 ? ["/products/caliburn-g5", "/products/zzz-not-a-product"] : ["/products/zzz-not-a-product", "/products/caliburn-g5"]), "/guides/x"]) &&
      warmRank("/products/m-bar-10k") <= 5 && warmRank("/faq") === 6,
  );
  const sitemap = "<urlset><url><loc>https://okami24.store/products/m-bar-10k</loc></url><url><loc>https://okami24.store/</loc></url><url><loc>https://okami24.store/products</loc></url><url><loc>https://okami24.store/products</loc></url></urlset>";
  check("6b. sitemapPaths keeps order, drops the host and repeats", JSON.stringify(sitemapPaths(sitemap)) === JSON.stringify(["/products/m-bar-10k", "/", "/products"]));
  const warmed = (kind: string | null) => {
    const calls: string[] = [];
    const waits: number[] = [];
    const deps: BootRefreshDeps = {
      fetch: async (url) => {
        calls.push(url);
        return { status: 200, headers: { get: (h: string) => (h === BOOT_KIND_HEADER ? kind : null) }, text: async () => (url.endsWith("/sitemap.xml") ? sitemap : "") };
      },
      wait: async (ms) => void waits.push(ms),
      log: () => {},
      port: "3999",
    };
    return { deps, calls, waits };
  };
  const ex = warmed("expire");
  await refreshPagesAfterBoot(ex.deps, { orderingEnabled: true, firstDelayMs: 0 });
  check(
    "6c. expire → the sitemap, then each page once, in warm order, paced",
    JSON.stringify(ex.calls) === JSON.stringify(["http://127.0.0.1:3999/api/cart/count", "http://127.0.0.1:3999/sitemap.xml", "http://127.0.0.1:3999/", "http://127.0.0.1:3999/products", "http://127.0.0.1:3999/products/m-bar-10k"]) &&
      ex.waits.filter((w) => w === 250).length === 3,
    ex.calls.join(" "),
  );
  const none = warmed(null);
  await refreshPagesAfterBoot(none.deps, { orderingEnabled: true, firstDelayMs: 0 });
  check("6d. no kind in the answer (no boot refresh ran) → no warming", none.calls.length === 1, none.calls.join(" "));
  const other = warmed("stale");
  await refreshPagesAfterBoot(other.deps, { orderingEnabled: true, firstDelayMs: 0 });
  check("6e. any kind but \"expire\" → no warming", other.calls.length === 1, other.calls.join(" "));
  const killed = warmed("expire");
  await refreshPagesAfterBoot(killed.deps, { orderingEnabled: true, firstDelayMs: 0, warm: false });
  check("6f. kill switch (warm: false = OKAMI24_BOOT_WARM=off) → the refresh runs, no page is warmed", killed.calls.length === 1, killed.calls.join(" "));
  check("6g. the kill switch reads OKAMI24_BOOT_WARM", bootSrc.includes('warm = process.env.OKAMI24_BOOT_WARM !== "off"'));
  // A page that takes 400 ms is followed by a 400 ms rest (≥ paceMs 250): the loop never holds more than half the box.
  const slowWaits: number[] = [];
  let clock = 0;
  const realNow = Date.now;
  Date.now = () => clock;
  try {
    await warmPages(
      {
        fetch: async (url) => {
          if (!url.endsWith(".xml")) clock += 400;
          return { status: 200, headers: { get: () => null }, text: async () => (url.endsWith(".xml") ? sitemap : "") };
        },
        wait: async (ms) => void slowWaits.push(ms),
        log: () => {},
      },
      "http://127.0.0.1:3999",
    );
  } finally {
    Date.now = realNow;
  }
  check("6h. rests as long as each page took (back-off under load)", JSON.stringify(slowWaits) === "[400,400,400]", slowWaits.join(","));
  return results;
}

if (require.main === module) {
  runBootRefreshContractTests().then((results) => {
    const failed = results.filter((r) => !r.passed);
    for (const r of results) console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `\n      ${r.detail}` : ""}`);
    if (failed.length > 0) {
      console.error(`\n${failed.length} of ${results.length} checks failed.`);
      process.exit(1);
    }
    console.log(`\nAll ${results.length} checks passed.`);
  });
}
