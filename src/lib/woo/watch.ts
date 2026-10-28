import "server-only";
import fs from "node:fs";
import path from "node:path";
import { getDb } from "@/lib/db/client";
import { dataDir } from "@/lib/paths";
import { lineConfigured, pushText } from "@/lib/line/client";
import { groupForRole } from "@/lib/line/groups";
import { SITE_URL } from "@/lib/seo";
import { listKeys } from "./keys";
import { alertFor, formatFeedAlert, formatFeedRecovered, judgeFeed, LOOKBACK_HOURS, type FeedHealth, type FeedState } from "./watch-rules";

/**
 * The stock watch (owner 28/10, watch-rules.ts): the light Okami dev shows, and a sweep every 10 minutes that tells the
 * "OKM Order" LINE group once when the light turns red and once when it comes back. The last light is kept in a small
 * file on the data disk (not the database), so a deploy or restart never repeats an alert. Never throws.
 */

const SWEEP_MS = 10 * 60_000;
const STATE_FILE = "woo-watch.json";

/** Never throws — every staff page calls it (the Okami dev box): a failed read is itself a red light, not a broken page. */
export function feedHealth(now = Date.now()): FeedHealth {
  try {
    return readFeed(now);
  } catch (err) {
    console.error(`[stock-watch] read failed — ${err instanceof Error ? err.message : String(err)}`);
    return { state: "down", lastPushAt: null, reportedCodes: 0, reason: "อ่านสถานะสต็อกไม่ได้ — แจ้งทีมเว็บ" };
  }
}

function readFeed(now: number): FeedHealth {
  const db = getDb();
  const push = db.prepare("SELECT MAX(reported_at) AS last, COUNT(*) AS n FROM woo_stock_reports").get() as { last: string | null; n: number };
  const since = new Date(now - LOOKBACK_HOURS * 3_600_000).toISOString();
  const sends = db
    .prepare(
      `SELECT o.order_number AS orderNumber, s.first_sent_at AS sentAt FROM woo_order_sends s JOIN orders o ON o.id = s.order_id
        WHERE s.first_sent_at IS NOT NULL AND s.first_sent_at >= ? ORDER BY s.first_sent_at DESC`
    )
    .all(since) as { orderNumber: string; sentAt: string }[];
  return judgeFeed({
    now,
    activeKeys: listKeys().filter((k) => !k.revoked_at).length,
    lastPushAt: push.last,
    reportedCodes: push.n,
    sends,
  });
}

function statePath(): string {
  return path.join(dataDir(), STATE_FILE);
}

function readLastState(): FeedState | null {
  try {
    const s = JSON.parse(fs.readFileSync(statePath(), "utf8")) as { state?: unknown };
    return s.state === "ok" || s.state === "quiet" || s.state === "down" ? s.state : null;
  } catch {
    return null;
  }
}

async function sweep(reason: string): Promise<void> {
  try {
    const health = feedHealth();
    const prev = readLastState();
    const alert = alertFor(prev, health.state);
    if (alert) {
      console.log(`[stock-watch] ${reason}: ${prev ?? "none"} → ${health.state}${health.reason ? ` — ${health.reason}` : ""}`);
      const groupId = lineConfigured() ? groupForRole("order") : null;
      if (groupId) {
        const text = alert === "down" ? formatFeedAlert(health, SITE_URL) : formatFeedRecovered(health);
        const result = await pushText(groupId, text);
        // Keep the old light on a failed push, so the next sweep (10 min) tries again instead of losing the alert.
        if (!result.ok) return console.error(`[stock-watch] LINE push failed (${result.status ?? "network"}) — retry next sweep`);
      }
    }
    if (prev !== health.state) fs.writeFileSync(statePath(), JSON.stringify({ state: health.state, at: new Date().toISOString() }));
  } catch (err) {
    console.error(`[stock-watch] ${reason}: FAILED — ${err instanceof Error ? err.message : String(err)}`);
  }
}

declare global {
  var __okami24StockWatchTimer: NodeJS.Timeout | undefined;
}

/** Started once per server process from src/instrumentation.ts: a sweep a minute after boot, then every 10 minutes. */
export function startStockWatch(): void {
  if (globalThis.__okami24StockWatchTimer) return;
  const first = setTimeout(() => void sweep("startup"), 60_000);
  first.unref();
  const timer = setInterval(() => void sweep("interval"), SWEEP_MS);
  timer.unref();
  globalThis.__okami24StockWatchTimer = timer;
  console.log(`[stock-watch] scheduled: Shipnity stock light checked every ${SWEEP_MS / 60_000} min`);
}
