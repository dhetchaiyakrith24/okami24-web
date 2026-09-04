import "server-only";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

// Commerce foundation (2026-09-02, corrected 2026-09-03 — see the architecture-review self-audit
// in the final report). SQLite via better-sqlite3, not a claim that this is the final production
// database — docs/BUSINESS_SOURCE_OF_TRUTH.md §19 lists "exact production database/backend" as an
// explicit unknown. This is the smallest real, reversible foundation: zero infra to stand up, and
// genuinely fine for THIS business's actual scale (a two-admin operation, WAL mode already
// enabled below, which allows concurrent readers alongside the one writer — order volume would
// need to be dramatically higher than anything in scope here before write-serialization became a
// real bottleneck).
//
// CORRECTED CLAIM: an earlier version of this comment called a future move to Postgres "a driver
// swap, not a schema rewrite." That was wrong and has been fixed — this schema uses genuinely
// SQLite-specific syntax in more than one place (every migration's `strftime('%Y-%m-%dT...', ...)`
// timestamp default, `INTEGER PRIMARY KEY AUTOINCREMENT`, and better-sqlite3's own synchronous
// `db.transaction()` API used throughout src/lib/commerce/*.ts) that Postgres does not accept
// as-is. A real migration would mean rewriting the SQL, not swapping a driver underneath unchanged
// queries. Recorded honestly here so a future session doesn't repeat the original overclaim.
//
// DEPLOYMENT TOPOLOGY THIS ARCHITECTURE REQUIRES (see the final report's §Deployment for the full
// reasoning): a SINGLE long-running Node.js process with a persistent, writable local filesystem
// for `.data/`. This explicitly does NOT support, and will silently lose data on: serverless
// functions (ephemeral/read-only filesystem — Vercel, Netlify Functions), edge runtime (no Node
// `fs`/native-addon support at all), or more than one horizontally-scaled instance (each process
// would open its OWN separate `.data/okami24.db` file, splitting orders/customers/sessions across
// instances inconsistently, with no shared source of truth). Deploy this as one always-on process
// — a small VPS, or a single-instance container with `.data/` on a persistent volume that survives
// redeploys — never a platform's auto-scaling/serverless product tier. Do not read this file as an
// infra decision the owner didn't get to make — it is a placeholder pending that decision, but the
// deployment CONSTRAINT above is a fact about the code as written, not a preference to revisit
// lightly without also re-architecting the persistence layer.

const DB_DIR = path.join(process.cwd(), ".data");
const DB_PATH = path.join(DB_DIR, "okami24.db");
const MIGRATIONS_DIR = path.join(process.cwd(), "src", "lib", "db", "migrations");

declare global {
  var __okami24Db: Database.Database | undefined;
}

function runMigrations(db: Database.Database): void {
  db.exec(
    `CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    )`
  );
  const applied = new Set(
    (db.prepare("SELECT id FROM schema_migrations").all() as { id: string }[]).map((r) => r.id)
  );
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  const insertApplied = db.prepare("INSERT INTO schema_migrations (id) VALUES (?)");
  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");
    const applyMigration = db.transaction(() => {
      db.exec(sql);
      insertApplied.run(file);
    });
    applyMigration();
  }
}

function createDb(): Database.Database {
  fs.mkdirSync(DB_DIR, { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  runMigrations(db);
  return db;
}

/** Process-wide singleton, cached on `globalThis` so Next.js dev-mode module reloads (HMR) don't
 *  open a new SQLite handle — and therefore re-run migrations — on every edit. */
export function getDb(): Database.Database {
  if (!globalThis.__okami24Db) {
    globalThis.__okami24Db = createDb();
  }
  return globalThis.__okami24Db;
}
