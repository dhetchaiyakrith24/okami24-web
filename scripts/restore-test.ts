/**
 * Restore drill — proves a backup can actually be brought back, in a SEPARATE folder, without
 * touching the live database (`.data/` locally, `OKAMI24_DATA_DIR` on a host).
 *
 *   npm run backup:restore-test                 → uses the newest backup in the backup folder
 *   npm run backup:restore-test -- <file.db>    → uses that backup file
 *
 * Steps: copy the backup into `_incoming/restore-test/<stamp>/okami24.db` (gitignored) → open it
 * → PRAGMA integrity_check → count rows in every commerce table → count the same tables in the
 * live DB (read-only) → print both side by side → write report.json next to the restored file.
 * PASS = the restored copy opens, integrity is "ok", and every expected table is readable.
 * Counts that differ from the live DB are shown (they legitimately differ if orders arrived after
 * the backup) but do not fail the drill.
 */
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { defaultBackupDir, fileStamp, listBackups } from "../src/lib/backup/data-backup";
import { dbPath } from "../src/lib/paths";

const TABLES = [
  "customers",
  "otp_challenges",
  "sessions",
  "addresses",
  "carts",
  "cart_items",
  "orders",
  "order_items",
  "order_shipping_addresses",
  "order_status_history",
  "order_payment_submissions",
  "shipnity_sync_log",
  "idempotency_keys",
];

function countAll(file: string): Record<string, number | "missing"> {
  const db = new Database(file, { readonly: true, fileMustExist: true });
  const out: Record<string, number | "missing"> = {};
  try {
    for (const t of TABLES) {
      try {
        out[t] = Number((db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get() as { n: number }).n);
      } catch {
        out[t] = "missing";
      }
    }
  } finally {
    db.close();
  }
  return out;
}

function main(): void {
  const arg = process.argv[2];
  const backupFile = arg ? path.resolve(arg) : listBackups(defaultBackupDir())[0];
  if (!backupFile || !fs.existsSync(backupFile)) {
    console.error(`FAIL  no backup file to restore (looked in ${defaultBackupDir()}) — run \`npm run backup:data\` first`);
    process.exit(1);
  }

  const stamp = fileStamp(new Date());
  const restoreDir = path.join(process.cwd(), "_incoming", "restore-test", stamp);
  fs.mkdirSync(restoreDir, { recursive: true });
  const restored = path.join(restoreDir, "okami24.db");
  fs.copyFileSync(backupFile, restored);

  const db = new Database(restored, { readonly: true, fileMustExist: true });
  const integrity = String(db.pragma("integrity_check", { simple: true }));
  db.close();

  const restoredCounts = countAll(restored);
  const livePath = dbPath();
  const liveCounts = fs.existsSync(livePath) ? countAll(livePath) : null;

  const missing = TABLES.filter((t) => restoredCounts[t] === "missing");
  const pass = integrity === "ok" && missing.length === 0;

  console.log(`backup   : ${backupFile}`);
  console.log(`restored : ${restored}`);
  console.log(`integrity: ${integrity}`);
  console.log(`\n${"table".padEnd(28)} ${"restored".padStart(9)} ${"live".padStart(9)}`);
  let differences = 0;
  for (const t of TABLES) {
    const r = restoredCounts[t];
    const l = liveCounts ? liveCounts[t] : "n/a";
    const same = liveCounts ? r === l : true;
    if (!same) differences += 1;
    console.log(`${t.padEnd(28)} ${String(r).padStart(9)} ${String(l).padStart(9)}${same ? "" : "   <- differs"}`);
  }
  const report = { at: new Date().toISOString(), backupFile, restored, integrity, pass, missingTables: missing, restoredCounts, liveCounts, differences };
  fs.writeFileSync(path.join(restoreDir, "report.json"), JSON.stringify(report, null, 2) + "\n", "utf8");

  console.log(`\n${pass ? "PASS" : "FAIL"}  restore drill ${pass ? "succeeded" : "failed"} — ${missing.length ? `missing tables: ${missing.join(", ")}` : "all 13 tables readable"}${liveCounts ? `, ${differences === 0 ? "row counts match the live DB exactly" : `${differences} table(s) differ from the live DB (expected if data changed since the backup)`}` : ""}`);
  console.log(`      report: ${path.join(restoreDir, "report.json")}`);
  process.exit(pass ? 0 : 1);
}

main();
