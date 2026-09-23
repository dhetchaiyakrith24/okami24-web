/**
 * OKami24 — LINE-click counter contract (round 8, 2026-09-23).
 *
 * What the counter promises and what this test holds it to:
 *   1. a click record is a page path + a spot, nothing else — anything extra in the payload is
 *      dropped, a payload that is not a click is rejected, and a per-customer path tail (an order
 *      number) never reaches the table;
 *   2. the migration creates the table with exactly the columns the promise allows — no column
 *      could hold an IP, a user agent or an id even if some future code tried;
 *   3. the read-out groups by Bangkok day and by spot the way the route and the script both use.
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts), so it re-implements the tiny
 * open+migrate sequence like scripts/verify-commerce-db.ts instead of importing the server-only client.
 */

import Database from "better-sqlite3";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { LINE_CLICK_SPOTS, MAX_BODY_BYTES, bangkokDay, bangkokDayWindowStart, normalizePage, parseLineClick } from "./line-click-input";
import { hasLineClicksTable, summarizeLineClicks } from "./line-click-summary";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

// 1. input contract
check("a plain path passes unchanged", normalizePage("/products/pod-159") === "/products/pod-159");
check("query string and hash are stripped", normalizePage("/products?order=line#top") === "/products");
check("trailing slash is dropped, root stays '/'", normalizePage("/faq/") === "/faq" && normalizePage("/") === "/");
check("an order page collapses to /orders/*", normalizePage("/orders/OK-2026-000123?token=abc") === "/orders/*");
check("a preview page collapses to /preview/*", normalizePage("/preview/Pod-159") === "/preview/*");
check("not a path → null", normalizePage("https://evil.example/") === null && normalizePage("products") === null && normalizePage("//x") === null);
check("path traversal → null", normalizePage("/a/../b") === null);
check("over-long path → null", normalizePage("/" + "a".repeat(200)) === null);
check("non-string page → null", normalizePage(42) === null && normalizePage(undefined) === null);

const good = parseLineClick(JSON.stringify({ page: "/products/m-bar-10k", spot: "buy" }));
check("a real payload parses", good?.page === "/products/m-bar-10k" && good?.spot === "buy", JSON.stringify(good));
const extra = parseLineClick(JSON.stringify({ page: "/", spot: "pill", ip: "1.2.3.4", ua: "x", id: "y" }));
check("extra fields are dropped, only page+spot survive", extra !== null && Object.keys(extra).sort().join(",") === "page,spot", JSON.stringify(extra));
check("unknown spot becomes 'other'", parseLineClick(JSON.stringify({ page: "/", spot: "sidebar" }))?.spot === "other");
check("missing spot becomes 'other'", parseLineClick(JSON.stringify({ page: "/" }))?.spot === "other");
check("not JSON → null", parseLineClick("page=/") === null);
check("JSON but not an object → null", parseLineClick('"/"') === null && parseLineClick("[]") !== undefined);
check("empty body → null", parseLineClick("") === null);
check("over-sized body → null", parseLineClick("{" + " ".repeat(MAX_BODY_BYTES) + "}") === null);
check("spot list is the five the migration comment names", LINE_CLICK_SPOTS.join(",") === "pill,buy,buy-note,footer,other");

// Bangkok day: 2026-09-23T20:00Z is already 2026-09-24 in Thailand.
check("bangkokDay rolls over at 17:00 UTC", bangkokDay(new Date("2026-09-23T17:30:00Z")) === "2026-09-24" && bangkokDay(new Date("2026-09-23T16:30:00Z")) === "2026-09-23");
check("window start for 7 days is 6 days back", bangkokDayWindowStart(7, new Date("2026-09-23T05:00:00Z")) === "2026-09-17");

// 2 + 3. migration + read-out on a throwaway database
const MIGRATIONS_DIR = path.join(process.cwd(), "src", "lib", "db", "migrations");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "okami24-line-clicks-"));
const db = new Database(path.join(tmp, "t.db"));
try {
  check("fresh database has no line_clicks table", !hasLineClicksTable(db));
  for (const file of fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql")).sort()) {
    db.exec(fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8"));
  }
  check("migration creates line_clicks", hasLineClicksTable(db));
  const columns = (db.prepare("PRAGMA table_info(line_clicks)").all() as { name: string }[]).map((c) => c.name).sort().join(",");
  check("table holds only id, clicked_at, day_th, page, spot — nowhere to put an IP, agent or id", columns === "clicked_at,day_th,id,page,spot", columns);

  const now = new Date("2026-09-23T05:00:00Z"); // Bangkok 2026-09-23 12:00
  const insert = db.prepare("INSERT INTO line_clicks (day_th, page, spot) VALUES (?, ?, ?)");
  insert.run(bangkokDay(now), "/", "pill");
  insert.run(bangkokDay(now), "/products/m-bar-10k", "buy");
  insert.run(bangkokDay(now), "/products/m-bar-10k", "buy-note");
  insert.run("2026-09-20", "/faq", "footer");
  insert.run("2026-08-01", "/", "other"); // outside a 30-day window

  const s = summarizeLineClicks(db, 30, now);
  check("30-day total counts 4 of 5 rows", s.total === 4, String(s.total));
  check("since = 29 days back", s.since === "2026-08-25", s.since);
  check("byDay newest first", s.byDay.map((r) => `${r.day}:${r.count}`).join(" ") === "2026-09-23:3 2026-09-20:1", JSON.stringify(s.byDay));
  check("byPage sorted by count", s.byPage[0].page === "/products/m-bar-10k" && s.byPage[0].count === 2, JSON.stringify(s.byPage));
  check("bySpot lists every spot seen", s.bySpot.map((r) => r.spot).sort().join(",") === "buy,buy-note,footer,pill", JSON.stringify(s.bySpot));
  check(
    "lastSevenDays folds buy + buy-note into buy",
    s.lastSevenDays.length === 2 && s.lastSevenDays[0].day === "2026-09-23" && s.lastSevenDays[0].buy === 2 && s.lastSevenDays[0].pill === 1 && s.lastSevenDays[0].total === 3,
    JSON.stringify(s.lastSevenDays)
  );
  check("a 1-day window sees only today", summarizeLineClicks(db, 1, now).total === 3);
} finally {
  db.close();
  fs.rmSync(tmp, { recursive: true, force: true });
}

for (const r of results) {
  console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.passed || !r.detail ? "" : `\n      ${r.detail}`}`);
}
const failed = results.filter((r) => !r.passed);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
