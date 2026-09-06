/**
 * OKami24 — local backup of the data that is NOT in git (LAUNCH_AUDIT item 29).
 *
 * What is backed up
 *   - the SQLite store — orders, customers, OTP, sessions, carts. `.data/okami24.db` locally,
 *     `<OKAMI24_DATA_DIR>/okami24.db` on a host (src/lib/paths.ts). Copied with SQLite's own
 *     online-backup API from a read-only connection, so the copy is a consistent snapshot even
 *     while the server is writing (WAL mode) — never a raw file copy of a live DB.
 *   - `.env*` files in the project root, when they exist (none exist yet as of 2026-09-06). They
 *     hold server secrets, so they go to the same local backup folder and nowhere else.
 *
 * Where it goes
 *   `OKAMI24_BACKUP_DIR` if set, else `<OKAMI24_DATA_DIR>/backups` on a host, else
 *   `<home>/OKami24-backups` (see defaultBackupDir) — deliberately OUTSIDE the
 *   project folder (the main project folder vanished on 2026-09-06 02:55, cause unknown) and
 *   never inside git. Backups are never attached to reports: they contain customer data.
 *
 * Every backup is verified right after it is written (`PRAGMA integrity_check` on the copy plus
 * an orders row count) and recorded in `latest.json` + `backup.log` in the backup folder.
 * Retention keeps the newest `keep` copies (default 60) and deletes older ones — only files this
 * module itself created (matching `okami24-<stamp>.db` / `env/<stamp>/`), nothing else.
 *
 * This module intentionally does NOT import `server-only` or `src/lib/db/client.ts`: it must run
 * both inside the Next.js server (via src/instrumentation.ts) and from plain `tsx` scripts
 * (`npm run backup:data`, `npm run backup:restore-test`, the contract test).
 */
import Database from "better-sqlite3";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { dataDir, dbPath } from "../paths";

export const BACKUP_FILE_PREFIX = "okami24-";
export const BACKUP_FILE_RE = /^okami24-(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2})(?:-\d+)?\.db$/;
export const DEFAULT_KEEP = 60;

/** `.env` variants Next.js reads, in the order they would be looked for. */
export const ENV_FILE_NAMES = [
  ".env",
  ".env.local",
  ".env.development",
  ".env.development.local",
  ".env.production",
  ".env.production.local",
] as const;

export interface BackupOptions {
  /** Defaults to `dbPath(projectRoot)` — `<projectRoot>/.data/okami24.db`, or `OKAMI24_DATA_DIR`. */
  sourceDbPath?: string;
  /** Defaults to `process.cwd()`. Used to find `.data/` and `.env*`. */
  projectRoot?: string;
  /** Defaults to `defaultBackupDir()`. */
  destDir?: string;
  /** How many DB copies to keep (newest first). Default 60. */
  keep?: number;
  /** Injectable clock for tests. */
  now?: Date;
}

export type BackupResult =
  | {
      ok: true;
      at: string;
      destDir: string;
      file: string;
      bytes: number;
      integrity: string;
      orders: number | null;
      envFiles: string[];
      pruned: string[];
    }
  | { ok: false; reason: string; destDir: string };

/**
 * Where the copies go, in order of preference:
 *   1. `OKAMI24_BACKUP_DIR` — an explicit choice always wins.
 *   2. `<OKAMI24_DATA_DIR>/backups` — when a host has pointed the data folder at a mounted disk
 *      (see src/lib/paths.ts) but nobody set a backup folder. Without this fallback the copies
 *      would land in the container's throwaway home directory and vanish on the next deploy,
 *      silently, while every log line still said the backup succeeded. Same-disk copies protect
 *      against a corrupted or deleted file, not against losing the disk — the host's own disk
 *      snapshots are the second layer (docs/DEPLOY-RENDER.md).
 *   3. `<home>/OKami24-backups` — the historical local-machine default, unchanged.
 */
export function defaultBackupDir(): string {
  const fromEnv = process.env.OKAMI24_BACKUP_DIR?.trim();
  if (fromEnv && fromEnv.length > 0) return fromEnv;
  const hostDataDir = process.env.OKAMI24_DATA_DIR?.trim();
  if (hostDataDir && hostDataDir.length > 0) return path.join(dataDir(), "backups");
  return path.join(os.homedir(), "OKami24-backups");
}

/** Local-time stamp safe for file names: 2026-09-06T21-05-33 */
export function fileStamp(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}-${p(d.getMinutes())}-${p(d.getSeconds())}`;
}

/** Backup DB files in `destDir`, newest first (by name — the stamp sorts lexically). */
export function listBackups(destDir: string): string[] {
  if (!fs.existsSync(destDir)) return [];
  return fs
    .readdirSync(destDir)
    .filter((f) => BACKUP_FILE_RE.test(f))
    .sort()
    .reverse()
    .map((f) => path.join(destDir, f));
}

interface Verification {
  integrity: string;
  orders: number | null;
}

/** Open the copy read-only and prove it is a sound SQLite file with readable rows. */
export function verifyBackupFile(file: string): Verification {
  const db = new Database(file, { readonly: true, fileMustExist: true });
  try {
    const integrity = String(db.pragma("integrity_check", { simple: true }));
    let orders: number | null = null;
    try {
      const row = db.prepare("SELECT COUNT(*) AS n FROM orders").get() as { n: number } | undefined;
      orders = row ? Number(row.n) : null;
    } catch {
      orders = null; // a DB without an orders table (e.g. a test fixture) is still a valid backup
    }
    return { integrity, orders };
  } finally {
    db.close();
  }
}

function uniqueTarget(destDir: string, stamp: string): string {
  let candidate = path.join(destDir, `${BACKUP_FILE_PREFIX}${stamp}.db`);
  let n = 2;
  while (fs.existsSync(candidate)) {
    candidate = path.join(destDir, `${BACKUP_FILE_PREFIX}${stamp}-${n}.db`);
    n += 1;
  }
  return candidate;
}

function copyEnvFiles(projectRoot: string, destDir: string, stamp: string): string[] {
  const copied: string[] = [];
  for (const name of ENV_FILE_NAMES) {
    const src = path.join(projectRoot, name);
    if (!fs.existsSync(src)) continue;
    const dir = path.join(destDir, "env", stamp);
    fs.mkdirSync(dir, { recursive: true });
    fs.copyFileSync(src, path.join(dir, name));
    copied.push(name);
  }
  return copied;
}

/** Remove SQLite `-wal` / `-shm` sidecars of a backup copy, if any were left behind. */
function removeSidecars(dbFile: string): void {
  for (const suffix of ["-wal", "-shm", "-journal"]) {
    const side = `${dbFile}${suffix}`;
    if (fs.existsSync(side)) fs.rmSync(side, { force: true });
  }
}

/** Delete the oldest copies beyond `keep`. Returns the file names removed. */
function prune(destDir: string, keep: number): string[] {
  const removed: string[] = [];
  const dbs = listBackups(destDir);
  for (const file of dbs.slice(keep)) {
    fs.rmSync(file, { force: true });
    removeSidecars(file);
    removed.push(path.basename(file));
  }
  const envRoot = path.join(destDir, "env");
  if (fs.existsSync(envRoot)) {
    const stamps = fs
      .readdirSync(envRoot)
      .filter((d) => /^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}$/.test(d))
      .sort()
      .reverse();
    for (const stamp of stamps.slice(keep)) {
      fs.rmSync(path.join(envRoot, stamp), { recursive: true, force: true });
      removed.push(`env/${stamp}`);
    }
  }
  return removed;
}

export async function runBackup(opts: BackupOptions = {}): Promise<BackupResult> {
  const projectRoot = opts.projectRoot ?? process.cwd();
  const source = opts.sourceDbPath ?? dbPath(projectRoot);
  const destDir = opts.destDir ?? defaultBackupDir();
  const keep = Math.max(1, opts.keep ?? DEFAULT_KEEP);
  const now = opts.now ?? new Date();

  if (!fs.existsSync(source)) {
    return { ok: false, reason: `no database file at ${source} — nothing to back up yet`, destDir };
  }

  fs.mkdirSync(destDir, { recursive: true });
  const stamp = fileStamp(now);
  const target = uniqueTarget(destDir, stamp);

  const src = new Database(source, { readonly: true, fileMustExist: true });
  try {
    await src.backup(target);
  } finally {
    src.close();
  }

  // The copy inherits the source's WAL journal mode, which would make every later open create
  // `-wal`/`-shm` sidecar files next to it. Switch the copy to the classic rollback journal so a
  // backup is exactly ONE self-contained file — the thing a restore copies back.
  const copy = new Database(target, { fileMustExist: true });
  try {
    copy.pragma("journal_mode = DELETE");
  } finally {
    copy.close();
  }
  removeSidecars(target);

  const { integrity, orders } = verifyBackupFile(target);
  if (integrity !== "ok") {
    fs.rmSync(target, { force: true });
    return { ok: false, reason: `backup copy failed integrity_check (${integrity}) and was discarded`, destDir };
  }

  const envFiles = copyEnvFiles(projectRoot, destDir, stamp);
  const pruned = prune(destDir, keep);
  const bytes = fs.statSync(target).size;
  const at = now.toISOString();
  const atLocal = `${stamp.slice(0, 10)} ${stamp.slice(11).replace(/-/g, ":")}`; // same clock as the file name

  const result: BackupResult = { ok: true, at, destDir, file: target, bytes, integrity, orders, envFiles, pruned };
  fs.writeFileSync(path.join(destDir, "latest.json"), JSON.stringify({ ...result, atLocal }, null, 2) + "\n", "utf8");
  fs.appendFileSync(
    path.join(destDir, "backup.log"),
    `${atLocal} (local)\t${path.basename(target)}\t${bytes} bytes\tintegrity=${integrity}\torders=${orders ?? "n/a"}\tenv=${envFiles.join(",") || "-"}\tpruned=${pruned.length}\n`,
    "utf8"
  );
  return result;
}
