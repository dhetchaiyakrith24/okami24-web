/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// LINE-click counter read-out (round 8) — prints how many times the site's LINE links were clicked,
// per day / spot / page, straight from the SQLite file.
//
// Plain JavaScript on purpose (round 8 close, owner 2026-09-23): Cowork reads the numbers in the
// Render Web Shell, where only production dependencies are installed — no `tsx` — so this runs
// with bare `node` and `better-sqlite3` (already a production dependency). Read-only handle: it
// never writes, and it works on a backup copy of the database as well as the live one.
//
//   node scripts/line-clicks.js                 last 30 days · database = $OKAMI24_DATA_DIR/okami24.db, else ./.data/okami24.db
//   node scripts/line-clicks.js --days 7
//   node scripts/line-clicks.js --db <path>     e.g. a file restored from a backup
//   node scripts/line-clicks.js --json
//
// Days are Bangkok calendar days (the `day_th` column the server writes, UTC+7).
// The table is created by src/lib/db/migrations/0003_line_clicks.sql the first time the server
// opens the database after the deploy — before that this prints "0 clicks".
const Database = require("better-sqlite3");
const fs = require("node:fs");
const path = require("node:path");

const arg = (name) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
};
const dataDir = process.env.OKAMI24_DATA_DIR && process.env.OKAMI24_DATA_DIR.trim()
  ? path.resolve(process.env.OKAMI24_DATA_DIR.trim())
  : path.join(process.cwd(), ".data");
const file = arg("--db") || path.join(dataDir, "okami24.db");
const days = Math.max(1, Math.min(365, Math.floor(Number(arg("--days") || 30)) || 30));
const asJson = process.argv.includes("--json");

if (!fs.existsSync(file)) {
  console.error(`no database at ${file} — point --db at the right file`);
  process.exit(1);
}

// First Bangkok day of a `days`-wide window ending today (same arithmetic as line-click-input.ts).
const since = new Date(Date.now() + 7 * 3600e3 - (days - 1) * 86400e3).toISOString().slice(0, 10);

const db = new Database(file, { readonly: true, fileMustExist: true });
try {
  const hasTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='line_clicks'").get();
  if (!hasTable) {
    console.log(`${file}: no line_clicks table yet (the server has not opened this database since the deploy) — 0 clicks`);
    process.exit(0);
  }
  const q = (sql) => db.prepare(sql).all(since);
  const out = {
    since,
    days,
    total: db.prepare("SELECT COUNT(*) AS n FROM line_clicks WHERE day_th >= ?").get(since).n,
    byDay: q("SELECT day_th AS day, COUNT(*) AS count FROM line_clicks WHERE day_th >= ? GROUP BY day_th ORDER BY day_th DESC"),
    bySpot: q("SELECT spot, COUNT(*) AS count FROM line_clicks WHERE day_th >= ? GROUP BY spot ORDER BY count DESC, spot"),
    byPage: q("SELECT page, COUNT(*) AS count FROM line_clicks WHERE day_th >= ? GROUP BY page ORDER BY count DESC, page"),
  };
  if (asJson) {
    console.log(JSON.stringify(out, null, 2));
  } else {
    console.log(`LINE clicks — last ${days} days (since ${since}, Bangkok days) — ${file}`);
    console.log(`total: ${out.total}`);
    const table = (title, rows, key) => {
      console.log(`\n${title}`);
      if (rows.length === 0) return console.log("  (none)");
      const w = Math.max(...rows.map((r) => String(r[key]).length));
      for (const r of rows) console.log(`  ${String(r[key]).padEnd(w)}  ${String(r.count).padStart(6)}`);
    };
    table("by day", out.byDay, "day");
    table("by spot (pill = floating button · buy = order button · buy-note · footer · other)", out.bySpot, "spot");
    table("by page", out.byPage, "page");
  }
} finally {
  db.close();
}
