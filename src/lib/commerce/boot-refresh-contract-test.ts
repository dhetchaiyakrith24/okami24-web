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
import { BOOT_KIND_HEADER, bootRefreshKind, bootRefreshUrl, refreshPagesAfterBoot, sitemapPaths, type BootRefreshDeps } from "./boot-refresh";

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

  // 5. first-hit round 14/11: expire only when the build copy is wrong, otherwise stale-while-revalidate on the same tag
  const open = { cartOff: false, siteClosed: false, hidden: [] as string[] };
  check("5a. all switches as built → stale (build copy served at once, re-rendered behind it)", bootRefreshKind(open) === "stale");
  check(
    "5b. cart off / site closed / a product hidden → expire (the build copy must not be served)",
    bootRefreshKind({ ...open, cartOff: true }) === "expire" &&
      bootRefreshKind({ ...open, siteClosed: true }) === "expire" &&
      bootRefreshKind({ ...open, hidden: ["m-bar-10k"] }) === "expire",
  );
  check(
    '5c. the route uses bootRefreshKind and revalidatePath("/", "layout")\'s own tag with the "max" profile',
    route.includes("boot.__okami24BootKind = bootRefreshKind(readSwitches());") && route.includes('boot.__okami24BootKind === "stale"') && route.includes('revalidateTag(`${NEXT_CACHE_IMPLICIT_TAG_ID}/layout`, "max")'),
  );
  // 6. expired pages are warmed by the server itself, one at a time, in sitemap order; a stale refresh warms nothing
  const sitemap = "<urlset><url><loc>https://okami24.store/</loc></url><url><loc>https://okami24.store/products</loc></url><url><loc>https://okami24.store/products/m-bar-10k</loc></url><url><loc>https://okami24.store/products</loc></url></urlset>";
  check("6a. sitemapPaths keeps order, drops the host and repeats", JSON.stringify(sitemapPaths(sitemap)) === JSON.stringify(["/", "/products", "/products/m-bar-10k"]));
  // `staleTimes` = how many answers a page gives as STALE before HIT (its background re-render still running)
  const warmed = (kind: string | null, staleTimes = 0) => {
    const calls: string[] = [];
    const waits: number[] = [];
    const seen = new Map<string, number>();
    const deps: BootRefreshDeps = {
      fetch: async (url) => {
        calls.push(url);
        const n = seen.get(url) ?? 0;
        seen.set(url, n + 1);
        const cache = kind === "stale" ? (n < staleTimes ? "STALE" : "HIT") : "MISS";
        return {
          status: 200,
          headers: { get: (h: string) => (h === BOOT_KIND_HEADER ? kind : h === "x-nextjs-cache" && !url.includes("/api/") && !url.endsWith(".xml") ? cache : null) },
          text: async () => (url.endsWith("/sitemap.xml") ? sitemap : ""),
        };
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
    "6b. expire → the sitemap, then each page once, in order, paced",
    JSON.stringify(ex.calls) === JSON.stringify(["http://127.0.0.1:3999/api/cart/count", "http://127.0.0.1:3999/sitemap.xml", "http://127.0.0.1:3999/", "http://127.0.0.1:3999/products", "http://127.0.0.1:3999/products/m-bar-10k"]) &&
      ex.waits.filter((w) => w === 250).length === 3,
    ex.calls.join(" "),
  );
  const st = warmed("stale", 2);
  await refreshPagesAfterBoot(st.deps, { orderingEnabled: true, firstDelayMs: 0 });
  const perPage = ["/", "/products", "/products/m-bar-10k"].map((p) => st.calls.filter((c) => c === `http://127.0.0.1:3999${p}`).length);
  check(
    "6c. stale → each page is asked again until it reads HIT (its re-render done) before the next one starts",
    JSON.stringify(perPage) === "[3,3,3]" && st.waits.filter((w) => w === 300).length === 6 && st.calls.indexOf("http://127.0.0.1:3999/products") > st.calls.lastIndexOf("http://127.0.0.1:3999/"),
    `${perPage.join(",")} · ${st.calls.join(" ")}`,
  );
  const none = warmed(null);
  await refreshPagesAfterBoot(none.deps, { orderingEnabled: true, firstDelayMs: 0 });
  check("6e. no kind in the answer (no boot refresh ran) → no warming", none.calls.length === 1, none.calls.join(" "));
  check("6d. the route names its kind in the boot-kind header", route.includes("[BOOT_KIND_HEADER]: boot.__okami24BootKind"));

  // If a Next upgrade renamed the implicit tag, the stale refresh would quietly mark nothing — this says so.
  const nextConstants = read("node_modules/next/dist/lib/constants.js");
  const nextRevalidate = read("node_modules/next/dist/server/web/spec-extension/revalidate.js");
  check(
    "5d. Next's implicit tag is still _N_T_ and revalidatePath still builds <id><path>/<type>",
    nextConstants.includes("NEXT_CACHE_IMPLICIT_TAG_ID = '_N_T_'") && nextRevalidate.includes("normalizedPath += `${normalizedPath.endsWith('/') ? '' : '/'}${type}`"),
  );
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
