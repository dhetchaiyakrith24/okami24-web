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
import { bootRefreshUrl, refreshPagesAfterBoot, type BootRefreshDeps } from "./boot-refresh";

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
