/**
 * LINE-click counter read-out (round 8) — prints how many times the site's LINE links were clicked,
 * per day / page / spot, straight from the SQLite file. Runs OUTSIDE the Next.js server on purpose
 * (plain `tsx`, its own read-only handle, no `server-only` import — same reason as
 * scripts/verify-commerce-db.ts), so it works on a backup copy of the database as well as the live one.
 *
 * Usage:
 *   npx tsx scripts/line-clicks.ts                 last 30 days, database from OKAMI24_DATA_DIR or ./.data
 *   npx tsx scripts/line-clicks.ts --days 7
 *   npx tsx scripts/line-clicks.ts --db <path>     e.g. a file restored from a backup
 *   npx tsx scripts/line-clicks.ts --json          machine-readable (same shape as the GET endpoint)
 *
 * The live site's numbers without shell access to the Render disk: GET /api/metrics/line-click with
 * the token — see src/app/api/metrics/line-click/route.ts.
 */
import Database from "better-sqlite3";
import fs from "node:fs";
import { dbPath } from "../src/lib/paths";
import { hasLineClicksTable, summarizeLineClicks } from "../src/lib/metrics/line-click-summary";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const file = arg("--db") ?? dbPath();
const days = Math.max(1, Math.min(365, Number(arg("--days") ?? "30") || 30));
const asJson = process.argv.includes("--json");

if (!fs.existsSync(file)) {
  console.error(`no database at ${file} — nothing has been recorded yet, or point --db at the right file`);
  process.exit(1);
}

const db = new Database(file, { readonly: true, fileMustExist: true });
try {
  if (!hasLineClicksTable(db)) {
    console.log(`${file}: the line_clicks table does not exist yet (the server has not run migration 0003 on this file) — 0 clicks`);
    process.exit(0);
  }
  const summary = summarizeLineClicks(db, days);
  if (asJson) {
    console.log(JSON.stringify(summary, null, 2));
    process.exit(0);
  }
  console.log(`LINE clicks — last ${summary.days} days (since ${summary.since}, Bangkok days) — ${file}`);
  console.log(`total: ${summary.total}`);
  const table = (title: string, rows: { key: string; count: number }[]) => {
    console.log(`\n${title}`);
    if (rows.length === 0) {
      console.log("  (none)");
      return;
    }
    const width = Math.max(...rows.map((r) => r.key.length));
    for (const r of rows) console.log(`  ${r.key.padEnd(width)}  ${String(r.count).padStart(6)}`);
  };
  table("by day", summary.byDay.map((r) => ({ key: r.day, count: r.count })));
  table("by spot", summary.bySpot.map((r) => ({ key: r.spot, count: r.count })));
  table("by page", summary.byPage.map((r) => ({ key: r.page, count: r.count })));
} finally {
  db.close();
}
