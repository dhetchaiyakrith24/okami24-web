/**
 * Commerce DB migration smoke test — runs OUTSIDE the Next.js/server-only boundary on purpose
 * (see src/lib/commerce/catalog-resolver.ts's comment on why `server-only`'s Node entry throws
 * under plain `tsx`), so it re-implements the tiny open+migrate sequence from src/lib/db/client.ts
 * standalone rather than importing that module. If the two ever drift, this script and a real
 * `next dev` boot will disagree — that mismatch is itself worth catching.
 *
 * Checks: migrations apply cleanly to a throwaway DB file, every expected table exists, and the
 * schema_migrations bookkeeping table records exactly the migration files on disk.
 *
 * Usage: npx tsx scripts/verify-commerce-db.ts   (or `npm run verify:commerce`)
 */
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const MIGRATIONS_DIR = path.join(process.cwd(), "src", "lib", "db", "migrations");

const EXPECTED_TABLES = [
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

function runMigrations(db: Database.Database): string[] {
  db.exec(
    `CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    )`
  );
  const applied = new Set((db.prepare("SELECT id FROM schema_migrations").all() as { id: string }[]).map((r) => r.id));
  const files = fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql")).sort();
  const insert = db.prepare("INSERT INTO schema_migrations (id) VALUES (?)");
  const newlyApplied: string[] = [];
  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");
    db.transaction(() => {
      db.exec(sql);
      insert.run(file);
    })();
    newlyApplied.push(file);
  }
  return newlyApplied;
}

interface CheckResult {
  name: string;
  passed: boolean;
  detail: string;
}

function main(): void {
  const results: CheckResult[] = [];
  const check = (name: string, condition: boolean, detail: string) => results.push({ name, passed: condition, detail });

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "okami24-commerce-db-verify-"));
  const dbPath = path.join(tmpDir, "test.db");

  try {
    const db = new Database(dbPath);
    db.pragma("foreign_keys = ON");

    let migrationError: string | null = null;
    let appliedFiles: string[] = [];
    try {
      appliedFiles = runMigrations(db);
    } catch (err) {
      migrationError = err instanceof Error ? err.message : String(err);
    }
    check("migrations apply without throwing", migrationError === null, migrationError ?? "n/a");

    const actualTables = new Set(
      (db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all() as { name: string }[]).map((r) => r.name)
    );
    for (const table of EXPECTED_TABLES) {
      check(`table "${table}" exists after migration`, actualTables.has(table), `known tables: ${[...actualTables].sort().join(", ")}`);
    }

    const recorded = (db.prepare("SELECT id FROM schema_migrations ORDER BY id").all() as { id: string }[]).map((r) => r.id);
    check(
      "schema_migrations records exactly the migration files that were applied",
      JSON.stringify(recorded) === JSON.stringify(appliedFiles),
      `recorded=${JSON.stringify(recorded)} applied=${JSON.stringify(appliedFiles)}`
    );

    // Re-opening and re-running migrations against the SAME file must be a no-op (idempotency —
    // this is exactly what happens every time `next dev` restarts against the real .data/ DB).
    let rerunError: string | null = null;
    try {
      runMigrations(db);
    } catch (err) {
      rerunError = err instanceof Error ? err.message : String(err);
    }
    check("re-running migrations against an already-migrated DB is a safe no-op", rerunError === null, rerunError ?? "n/a");

    db.close();

    for (const r of results) {
      console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.passed ? "" : `\n      ${r.detail}`}`);
    }
    const failed = results.filter((r) => !r.passed);
    if (failed.length > 0) {
      console.error(`\n${failed.length} of ${results.length} checks failed.`);
      process.exit(1);
    }
    console.log(`\nAll ${results.length} checks passed.`);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

main();
