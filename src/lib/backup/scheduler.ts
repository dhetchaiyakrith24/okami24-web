/**
 * Automatic backup schedule — started once per Node.js server process from src/instrumentation.ts.
 *
 * Runs `runBackup()` shortly after the server starts and then every `OKAMI24_BACKUP_INTERVAL_MINUTES`
 * (default 360 = every 6 hours) for as long as the server is running. Tied to the app process on
 * purpose: it needs no Windows Task Scheduler / cron entry (nothing outside the project is
 * configured), it travels with the app to whatever host is chosen later, and when the server is
 * not running no orders can arrive either. Set `OKAMI24_BACKUP_DISABLED=1` to turn it off.
 *
 * A failed backup is logged and never affects the server — the timers are `unref()`ed so they
 * also never keep a shutting-down process alive.
 */
import { runBackup } from "./data-backup";

declare global {
  var __okami24BackupTimer: NodeJS.Timeout | undefined;
}

const DEFAULT_INTERVAL_MINUTES = 360;
const STARTUP_DELAY_MS = 15_000;

function intervalMs(): number {
  const raw = Number(process.env.OKAMI24_BACKUP_INTERVAL_MINUTES);
  const minutes = Number.isFinite(raw) && raw >= 1 ? raw : DEFAULT_INTERVAL_MINUTES;
  return minutes * 60_000;
}

async function backupOnce(reason: string): Promise<void> {
  try {
    const r = await runBackup();
    if (r.ok) {
      console.log(`[backup] ${reason}: ${r.file} (${r.bytes} bytes, orders=${r.orders ?? "n/a"}, env=${r.envFiles.join(",") || "-"}, pruned=${r.pruned.length})`);
    } else {
      console.log(`[backup] ${reason}: skipped — ${r.reason}`);
    }
  } catch (err) {
    console.error(`[backup] ${reason}: FAILED — ${err instanceof Error ? err.message : String(err)}`);
  }
}

export function startBackupScheduler(): void {
  if (globalThis.__okami24BackupTimer) return; // already running in this process (dev HMR re-entry)
  if (process.env.OKAMI24_BACKUP_DISABLED === "1") {
    console.log("[backup] disabled by OKAMI24_BACKUP_DISABLED=1");
    return;
  }
  const first = setTimeout(() => void backupOnce("startup"), STARTUP_DELAY_MS);
  first.unref();
  const every = intervalMs();
  const timer = setInterval(() => void backupOnce("interval"), every);
  timer.unref();
  globalThis.__okami24BackupTimer = timer;
  console.log(`[backup] scheduled: first in ${STARTUP_DELAY_MS / 1000}s, then every ${every / 60_000} min`);
}
