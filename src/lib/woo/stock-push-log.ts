import fs from "node:fs";
import path from "node:path";
import { dataDir } from "@/lib/paths";

/**
 * A short history of Shipnity's stock pushes (owner 08/11, HANDOFF "stock light's red rule"). woo_stock_reports keeps only
 * the latest number per code, so it cannot say how often the warehouse pushes or how long after an order a code moves —
 * which is what the stock light's red rule (watch-rules.ts DOWN_AFTER_ORDER_MIN) has to be tuned on. One JSON line per
 * request that wrote stock, into a file per Thai day on the data disk: `{"t":"<ISO>","w":[["<code>",<qty|null>],…]}`.
 * Files older than KEEP_DAYS are deleted when a new day's file starts. Never throws: a full or missing disk must not cost
 * Shipnity its answer.
 */

export const KEEP_DAYS = 35;
const DIR = "stock-pushes";
const TH_OFFSET_MS = 7 * 3_600_000;

export function logDir(root: string = dataDir()): string {
  return path.join(root, DIR);
}

/** "2026-11-08" for a time, in Thai time. */
export function thaiDay(ms: number): string {
  return new Date(ms + TH_OFFSET_MS).toISOString().slice(0, 10);
}

/** The day files to delete: older than `keep` days before `today` (both "YYYY-MM-DD"). Pure. */
export function expiredFiles(names: readonly string[], today: string, keep: number = KEEP_DAYS): string[] {
  const cutoff = new Date(Date.parse(`${today}T00:00:00Z`) - keep * 86_400_000).toISOString().slice(0, 10);
  return names.filter((n) => /^\d{4}-\d{2}-\d{2}\.jsonl$/.test(n) && n.slice(0, 10) < cutoff);
}

export function logStockPush(writes: readonly { sku: string; quantity: number | null }[], now: number = Date.now(), root: string = dataDir()): void {
  if (writes.length === 0) return;
  try {
    const dir = logDir(root);
    const file = path.join(dir, `${thaiDay(now)}.jsonl`);
    const fresh = !fs.existsSync(file);
    fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(file, `${JSON.stringify({ t: new Date(now).toISOString(), w: writes.map((w) => [w.sku, w.quantity]) })}\n`);
    if (fresh) for (const old of expiredFiles(fs.readdirSync(dir), thaiDay(now))) fs.rmSync(path.join(dir, old), { force: true });
  } catch (err) {
    console.error(`[stock-log] push not logged: ${err instanceof Error ? err.message : String(err)}`);
  }
}
