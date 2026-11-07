/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// Weekly numbers of the SEO round (round SEO full 07/11, batch 7) — read-only, two modes:
//
//   node scripts/seo-weekly-numbers.js            Search Console, from the branch origin/gsc-data (run `git fetch origin gsc-data` first).
//                                                 Last 7 days with data vs the 7 before, the recovery levels of GSC-AUDIT 07/11 section 8,
//                                                 pages in Google, the four watch queries.
//   node scripts/seo-weekly-numbers.js --shop     Carts, orders, repeat buyers and LINE clicks from the site database. Runs in the Render
//                                                 Web Shell (bare node + better-sqlite3, like scripts/line-clicks.js) or on a restored copy.
//        --db <path>  --days <n, default 7>  --json
//
// --shop prints COUNTS ONLY: never a phone, a name, an address or an order number. The handle is read-only.
// What the numbers are:
//   carts = carts touched in the window (`carts.updated_at` moves on add and on quantity change), one per visitor cookie. Items are
//           deleted at checkout, so `cart_items` alone would undercount; the cart row stays.
//   orders = site orders not cancelled. LINE and warehouse orders are not in this database, so repeat buyers = site orders only.
//   repeat = customers with an order in the window who also have an older order, by customer id.
// Search Console limit: the gsc-data export has web search only, no image search; read that one in the Search Console screen.
"use strict";
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const arg = (name) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
};
const days = Math.max(1, Math.min(90, Math.floor(Number(arg("--days") || 7)) || 7));
const asJson = process.argv.includes("--json");

function gscFile(name) {
  const raw = execFileSync("git", ["show", `origin/gsc-data:gsc/latest/${name}`], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  return JSON.parse(raw);
}

const WATCH = ["pod system", "relx lumi 18k", "voopoo drag 6", "joiway"]; // GSC-AUDIT 07/11 section 8, first signal

function searchConsole() {
  const meta = gscFile("meta.json");
  const dated = gscFile("last90-date.json").rows.map((r) => ({ day: r.keys[0], clicks: r.clicks, impressions: r.impressions, position: r.position })).sort((a, b) => a.day.localeCompare(b.day));
  const last = dated.slice(-days);
  const prev = dated.slice(-2 * days, -days);
  const sum = (rows) => {
    const impressions = rows.reduce((n, r) => n + r.impressions, 0);
    return {
      from: rows[0]?.day,
      to: rows[rows.length - 1]?.day,
      clicks: rows.reduce((n, r) => n + r.clicks, 0),
      impressions,
      perDay: rows.length ? +(impressions / rows.length).toFixed(1) : 0,
      clicksPerDay: rows.length ? +(rows.reduce((n, r) => n + r.clicks, 0) / rows.length).toFixed(1) : 0,
      position: impressions ? +(rows.reduce((n, r) => n + r.position * r.impressions, 0) / impressions).toFixed(1) : null,
    };
  };
  const days7 = dated.slice(-7);
  const held = (test) => days7.length === 7 && days7.every(test);
  const queries = gscFile("last28-query.json").rows;
  const watch = WATCH.map((q) => {
    const row = queries.find((r) => r.keys[0] === q);
    return { query: q, impressions28: row?.impressions ?? 0, clicks28: row?.clicks ?? 0, position: row ? +row.position.toFixed(1) : null };
  });
  const inspection = gscFile("inspection.json");
  const rows = Array.isArray(inspection) ? inspection : (inspection.rows ?? inspection.urls ?? []);
  const indexed = rows.filter((r) => /indexed/i.test(String(r.coverage ?? "")) && !/not indexed/i.test(String(r.coverage ?? ""))).length;
  return {
    exportRanAt: meta.ranAt,
    last: sum(last),
    previous: sum(prev),
    recovery: {
      halfway: `${days7.filter((r) => r.impressions >= 100).length}/7 days at 100+ impressions`,
      halfwayMet: held((r) => r.impressions >= 100),
      full: `${days7.filter((r) => r.impressions >= 180 && r.clicks >= 20).length}/7 days at 180+ impressions and 20+ clicks`,
      fullMet: held((r) => r.impressions >= 180 && r.clicks >= 20),
    },
    watch,
    pages: { inspected: rows.length, indexed, floor: 177 },
    notInThisExport: "image search impressions, read them in the Search Console screen",
  };
}

function shop() {
  const Database = require("better-sqlite3");
  const dataDir = process.env.OKAMI24_DATA_DIR && process.env.OKAMI24_DATA_DIR.trim() ? path.resolve(process.env.OKAMI24_DATA_DIR.trim()) : path.join(process.cwd(), ".data");
  const file = arg("--db") || path.join(dataDir, "okami24.db");
  if (!fs.existsSync(file)) {
    console.error(`no database at ${file} — point --db at the right file`);
    process.exit(1);
  }
  const iso = (d) => new Date(Date.now() - d * 86400e3).toISOString();
  const since = iso(days);
  const before = iso(2 * days);
  const db = new Database(file, { readonly: true, fileMustExist: true });
  try {
    // carts.updated_at is written two ways: strftime ISO on insert, datetime('now') with a space on update. Compare on the same shape.
    const count = (sql, ...p) => db.prepare(sql).get(...p).n;
    const carts = (from, to) => count("SELECT COUNT(*) AS n FROM carts WHERE replace(updated_at, ' ', 'T') >= ? AND replace(updated_at, ' ', 'T') < ?", from, to);
    const orders = (from, to) => count("SELECT COUNT(*) AS n FROM orders WHERE status != 'cancelled' AND created_at >= ? AND created_at < ?", from, to);
    const buyers = (from, to) => count("SELECT COUNT(DISTINCT customer_id) AS n FROM orders WHERE status != 'cancelled' AND created_at >= ? AND created_at < ?", from, to);
    const repeat = (from, to) => count(
      `SELECT COUNT(DISTINCT o.customer_id) AS n FROM orders o
       WHERE o.status != 'cancelled' AND o.created_at >= ? AND o.created_at < ?
         AND EXISTS (SELECT 1 FROM orders p WHERE p.customer_id = o.customer_id AND p.status != 'cancelled' AND p.created_at < ?)`,
      from, to, from,
    );
    const now = new Date(Date.now() + 1000).toISOString();
    const lineSince = new Date(Date.now() + 7 * 3600e3 - (days - 1) * 86400e3).toISOString().slice(0, 10);
    const lineBefore = new Date(Date.now() + 7 * 3600e3 - (2 * days - 1) * 86400e3).toISOString().slice(0, 10);
    const hasLine = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='line_clicks'").get();
    return {
      days,
      last: {
        carts: carts(since, now),
        orders: orders(since, now),
        buyers: buyers(since, now),
        repeatBuyers: repeat(since, now),
        lineClicks: hasLine ? count("SELECT COUNT(*) AS n FROM line_clicks WHERE day_th >= ?", lineSince) : null,
      },
      previous: {
        carts: carts(before, since),
        orders: orders(before, since),
        buyers: buyers(before, since),
        repeatBuyers: repeat(before, since),
        lineClicks: hasLine ? count("SELECT COUNT(*) AS n FROM line_clicks WHERE day_th >= ? AND day_th < ?", lineBefore, lineSince) : null,
      },
    };
  } finally {
    db.close();
  }
}

const result = process.argv.includes("--shop") ? shop() : searchConsole();
if (asJson) {
  console.log(JSON.stringify(result, null, 2));
} else {
  const flat = (o, pre = "") => Object.entries(o).forEach(([k, v]) => {
    if (v && typeof v === "object" && !Array.isArray(v)) flat(v, `${pre}${k}.`);
    else console.log(`${pre}${k}: ${Array.isArray(v) ? JSON.stringify(v) : v}`);
  });
  flat(result);
}
