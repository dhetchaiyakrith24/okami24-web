/**
 * Contract test for src/lib/backup/data-backup.ts — runs against throwaway files in the OS temp
 * dir, never the real `.data/` or the real backup folder. Discovered by scripts/verify-catalog.ts.
 *
 * Proves: a backup is a sound SQLite copy with the same rows · `.env*` files ride along ·
 * latest.json + backup.log are written · retention deletes only the oldest copies beyond `keep` ·
 * a missing source is reported, not thrown · `OKAMI24_DATA_DIR` moves the DB, the private QR
 * folder and the backups onto a host disk without changing any behaviour when it is unset.
 */
import Database from "better-sqlite3";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { defaultBackupDir, listBackups, runBackup, verifyBackupFile } from "./data-backup";
import { dataDir, dbPath, promptpayQrPath } from "../paths";

interface CheckResult {
  name: string;
  passed: boolean;
  detail: string;
}

async function main(): Promise<void> {
  const results: CheckResult[] = [];
  const check = (name: string, condition: boolean, detail: string) => results.push({ name, passed: condition, detail });

  const root = fs.mkdtempSync(path.join(os.tmpdir(), "okami24-backup-test-"));
  const projectRoot = path.join(root, "project");
  const destDir = path.join(root, "backups");
  fs.mkdirSync(path.join(projectRoot, ".data"), { recursive: true });
  const sourceDb = path.join(projectRoot, ".data", "okami24.db");
  fs.writeFileSync(path.join(projectRoot, ".env.local"), "EXAMPLE_KEY=not-a-real-secret\n", "utf8");

  try {
    // Fixture DB in WAL mode with an `orders` table, like the real one.
    const db = new Database(sourceDb);
    db.pragma("journal_mode = WAL");
    db.exec("CREATE TABLE orders (id INTEGER PRIMARY KEY, order_number TEXT NOT NULL)");
    const ins = db.prepare("INSERT INTO orders (order_number) VALUES (?)");
    for (const n of ["OK-1", "OK-2", "OK-3"]) ins.run(n);
    // keep the connection open during the first backup — that is the real-world case (server running)

    const t1 = new Date(2026, 8, 6, 10, 0, 0);
    const r1 = await runBackup({ projectRoot, destDir, keep: 2, now: t1 });
    check("first backup succeeds while the source connection is open", r1.ok, JSON.stringify(r1));
    if (r1.ok) {
      check("backup file exists and is non-empty", fs.existsSync(r1.file) && r1.bytes > 0, `${r1.file} ${r1.bytes} bytes`);
      check(
        "backup is ONE self-contained file — no -wal/-shm sidecars, journal mode is not WAL",
        !fs.existsSync(`${r1.file}-wal`) && !fs.existsSync(`${r1.file}-shm`) && (() => { const c = new Database(r1.file, { readonly: true }); const m = String(c.pragma("journal_mode", { simple: true })); c.close(); return m.toLowerCase() !== "wal"; })(),
        fs.readdirSync(destDir).join(",")
      );
      check("backup passes integrity_check and carries the 3 orders", r1.integrity === "ok" && r1.orders === 3, `integrity=${r1.integrity} orders=${r1.orders}`);
      const v = verifyBackupFile(r1.file);
      const copy = new Database(r1.file, { readonly: true });
      const nums = (copy.prepare("SELECT order_number FROM orders ORDER BY id").all() as { order_number: string }[]).map((x) => x.order_number);
      copy.close();
      check("rows in the copy equal the source rows", v.integrity === "ok" && nums.join(",") === "OK-1,OK-2,OK-3", nums.join(","));
      check(".env.local was copied alongside", r1.envFiles.includes(".env.local") && fs.existsSync(path.join(destDir, "env", "2026-09-06T10-00-00", ".env.local")), r1.envFiles.join(","));
      check("latest.json and backup.log are written", fs.existsSync(path.join(destDir, "latest.json")) && fs.existsSync(path.join(destDir, "backup.log")), fs.readdirSync(destDir).join(","));
    }
    db.close();

    // Two more backups with keep=2 → the first (oldest) must be pruned, the newest two kept.
    const r2 = await runBackup({ projectRoot, destDir, keep: 2, now: new Date(2026, 8, 6, 11, 0, 0) });
    const r3 = await runBackup({ projectRoot, destDir, keep: 2, now: new Date(2026, 8, 6, 12, 0, 0) });
    const remaining = listBackups(destDir).map((f) => path.basename(f));
    check(
      "retention keeps only the newest `keep` copies and prunes the oldest",
      r2.ok && r3.ok && remaining.length === 2 && remaining[0] === "okami24-2026-09-06T12-00-00.db" && remaining[1] === "okami24-2026-09-06T11-00-00.db",
      `remaining: ${remaining.join(",")} pruned: ${r3.ok ? r3.pruned.join(",") : "n/a"}`
    );
    check(
      "retention also prunes the matching env/<stamp> folder",
      !fs.existsSync(path.join(destDir, "env", "2026-09-06T10-00-00")) && fs.existsSync(path.join(destDir, "env", "2026-09-06T12-00-00")),
      fs.existsSync(path.join(destDir, "env")) ? fs.readdirSync(path.join(destDir, "env")).join(",") : "no env dir"
    );

    // Same-second collision gets a -2 suffix rather than overwriting.
    const r4 = await runBackup({ projectRoot, destDir, keep: 5, now: new Date(2026, 8, 6, 12, 0, 0) });
    check("a second backup in the same second gets a -2 suffix, never overwrites", r4.ok && path.basename(r4.file) === "okami24-2026-09-06T12-00-00-2.db", r4.ok ? r4.file : JSON.stringify(r4));

    // Missing source → reported, not thrown.
    const rMissing = await runBackup({ projectRoot: path.join(root, "nowhere"), destDir: path.join(root, "backups2") });
    check("a missing source DB is reported as ok:false with a reason (no throw)", rMissing.ok === false && /nothing to back up/.test(rMissing.ok ? "" : rMissing.reason), JSON.stringify(rMissing));

    // --- host data folder (2026-09-06, Render deploy): everything the app must keep has to follow
    //     `OKAMI24_DATA_DIR` onto the mounted disk, and the backup folder must never silently fall
    //     back to a throwaway home directory once it does. See src/lib/paths.ts.
    const savedDataDir = process.env.OKAMI24_DATA_DIR;
    const savedBackupDir = process.env.OKAMI24_BACKUP_DIR;
    try {
      delete process.env.OKAMI24_DATA_DIR;
      delete process.env.OKAMI24_BACKUP_DIR;
      check(
        "unset OKAMI24_DATA_DIR keeps the historical <root>/.data layout, byte for byte",
        dataDir(projectRoot) === path.join(projectRoot, ".data") &&
          dbPath(projectRoot) === path.join(projectRoot, ".data", "okami24.db") &&
          promptpayQrPath(projectRoot) === path.join(projectRoot, ".data", "private", "promptpay-qr.png"),
        `${dataDir(projectRoot)} | ${dbPath(projectRoot)} | ${promptpayQrPath(projectRoot)}`
      );
      check(
        "unset OKAMI24_DATA_DIR leaves the backup folder at the local-machine default",
        defaultBackupDir() === path.join(os.homedir(), "OKami24-backups"),
        defaultBackupDir()
      );

      const hostDataDir = path.join(root, "mounted-disk", "app-data");
      fs.mkdirSync(path.join(hostDataDir, "private"), { recursive: true });
      process.env.OKAMI24_DATA_DIR = hostDataDir;
      check(
        "OKAMI24_DATA_DIR moves the DB and the private QR folder onto the disk, ignoring the project root",
        dataDir(projectRoot) === hostDataDir &&
          dbPath(projectRoot) === path.join(hostDataDir, "okami24.db") &&
          promptpayQrPath(projectRoot) === path.join(hostDataDir, "private", "promptpay-qr.png"),
        `${dataDir(projectRoot)} | ${dbPath(projectRoot)}`
      );
      check(
        "with a host data folder and no explicit backup folder, backups land on the same disk — never in the container's home dir",
        defaultBackupDir() === path.join(hostDataDir, "backups"),
        defaultBackupDir()
      );
      process.env.OKAMI24_BACKUP_DIR = path.join(root, "explicit-backups");
      check(
        "an explicit OKAMI24_BACKUP_DIR still wins over the data folder",
        defaultBackupDir() === path.join(root, "explicit-backups"),
        defaultBackupDir()
      );
      delete process.env.OKAMI24_BACKUP_DIR;

      // A real backup run must read the DB from the host folder, not from <projectRoot>/.data.
      const hostDb = new Database(path.join(hostDataDir, "okami24.db"));
      hostDb.exec("CREATE TABLE orders (id INTEGER PRIMARY KEY, order_number TEXT NOT NULL)");
      hostDb.prepare("INSERT INTO orders (order_number) VALUES (?)").run("OK-DISK-1");
      hostDb.close();
      const rHost = await runBackup({ projectRoot, keep: 3, now: new Date(2026, 8, 6, 13, 0, 0) });
      check(
        "runBackup with OKAMI24_DATA_DIR set copies the disk's DB into the disk's backups folder",
        rHost.ok && rHost.orders === 1 && rHost.destDir === path.join(hostDataDir, "backups") && fs.existsSync(rHost.file),
        JSON.stringify(rHost)
      );
    } finally {
      if (savedDataDir === undefined) delete process.env.OKAMI24_DATA_DIR;
      else process.env.OKAMI24_DATA_DIR = savedDataDir;
      if (savedBackupDir === undefined) delete process.env.OKAMI24_BACKUP_DIR;
      else process.env.OKAMI24_BACKUP_DIR = savedBackupDir;
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }

  for (const r of results) {
    console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.passed ? "" : `\n      ${r.detail}`}`);
  }
  const failed = results.filter((r) => !r.passed);
  if (failed.length > 0) {
    console.error(`\n${failed.length} of ${results.length} backup contract checks failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} backup contract checks passed.`);
}

void main();
