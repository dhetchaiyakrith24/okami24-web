import fs from "node:fs";
import path from "node:path";
import { dataDir } from "@/lib/paths";
import { ALL_OPEN, parseSwitches, type ShopSwitches } from "@/lib/commerce/shop-switches-rules";

/**
 * The owner's switches on the data disk: a small file, like the stock watch's, so a deploy or restart keeps them and no table
 * is added. No `server-only` marker: src/proxy.ts reads this too. Every page request reaches here, so the file is read at most
 * once every couple of seconds. Never throws: a failed read keeps the last answer, and the first answer is "all open".
 */

const FILE = "shop-switches.json";
const TTL_MS = 2_000;
// On globalThis, not a module `let`: Next bundles routes and pages separately, each with its own copy of a module — the owner's
// action updated its copy while a page re-rendered from another, up to 2 s old, and that render stood (T2-04, as live.ts T2-05).
type Cache = { at: number; value: ShopSwitches } | null;
const shared = globalThis as typeof globalThis & { __okami24Switches?: { cache: Cache } };
const store = (shared.__okami24Switches ??= { cache: null });

const filePath = () => path.join(dataDir(), FILE);

export function readSwitches(): ShopSwitches {
  // `next build` prerenders on a machine with no data disk.
  if (process.env.NEXT_PHASE === "phase-production-build") return ALL_OPEN;
  const cache = store.cache;
  if (cache && Date.now() - cache.at < TTL_MS) return cache.value;
  let value = cache?.value ?? ALL_OPEN;
  try {
    value = parseSwitches(fs.existsSync(filePath()) ? fs.readFileSync(filePath(), "utf8") : null);
  } catch (err) {
    console.error(`[switches] read failed — keeping the last answer: ${err instanceof Error ? err.message : String(err)}`);
  }
  store.cache = { at: Date.now(), value };
  return value;
}

/** Written whole through a temporary file, so a reader never meets half a file. */
export function writeSwitches(next: ShopSwitches): void {
  fs.mkdirSync(dataDir(), { recursive: true });
  const temp = `${filePath()}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(next));
  fs.renameSync(temp, filePath());
  store.cache = { at: Date.now(), value: next };
}
