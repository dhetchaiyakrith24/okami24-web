import path from "node:path";

/**
 * OKami24 — where the data that is NOT in git lives (2026-09-06, hosting decision: Render
 * Singapore, one always-on instance with a persistent disk attached).
 *
 * Everything the app writes and must keep — the SQLite store, the shop's PromptPay QR, the
 * automatic backups — resolves through this one module so a host can point all of it at a mounted
 * disk with a single environment variable instead of each call site guessing a path.
 *
 *   OKAMI24_DATA_DIR   absolute path to the folder that holds `okami24.db` and `private/`.
 *                      Unset (every local dev run, and every existing script) → `<cwd>/.data`,
 *                      byte-for-byte the same path the project used before this module existed.
 *
 * Deliberately NOT `server-only`: `scripts/backup-data.ts`, `scripts/restore-test.ts` and the
 * backup contract test run this under plain `tsx`, outside the Next.js server, for the same
 * reason src/lib/backup/data-backup.ts avoids that import.
 *
 * Path only — no `mkdirSync` here. Creating the folder stays with the module that owns the file
 * (db/client.ts creates the data dir; data-backup.ts creates the backup dir), so importing this
 * never has a side effect on disk.
 */

/** The folder holding the SQLite database and `private/`. `OKAMI24_DATA_DIR`, else `<root>/.data`. */
export function dataDir(projectRoot: string = process.cwd()): string {
  const fromEnv = process.env.OKAMI24_DATA_DIR?.trim();
  return fromEnv && fromEnv.length > 0 ? path.resolve(fromEnv) : path.join(projectRoot, ".data");
}

/** The SQLite store — orders, customers, sessions, carts. */
export function dbPath(projectRoot?: string): string {
  return path.join(dataDir(projectRoot), "okami24.db");
}

/** Files that must never be reachable by URL (the PromptPay QR). Never under `public/`. */
export function privateDataDir(projectRoot?: string): string {
  return path.join(dataDir(projectRoot), "private");
}

/** The shop's PromptPay QR, served only by the order page's access-checked route handler. */
export function promptpayQrPath(projectRoot?: string): string {
  return path.join(privateDataDir(projectRoot), "promptpay-qr.png");
}
