import "server-only";
import { getDb } from "@/lib/db/client";
import { bangkokDay, type LineClick } from "./line-click-input";
import { summarizeLineClicks, type LineClickSummary } from "./line-click-summary";

/**
 * LINE-click counter — the write side (round 8, owner ruling 2026-09-23 "option ก").
 *
 * One row per click: Bangkok day, page path, spot. Nothing about the person — no cookie is set,
 * the request's cookies are never read, and no IP, user agent or id is stored (the table in
 * src/lib/db/migrations/0003_line_clicks.sql has no column for any of them). The store is the
 * same SQLite file as the orders, so the existing backup covers it (src/lib/backup/data-backup.ts).
 */

/** A per-process ceiling on how many rows a minute may add. Real traffic is a handful of clicks a
 *  day; this only bounds what a script hammering the endpoint could write. Not per visitor on
 *  purpose — keying it by IP would mean handling the one thing this feature promises not to. */
const MAX_ROWS_PER_MINUTE = 120;
let windowMinute = -1;
let windowRows = 0;

/** Insert the click. Returns false when the minute's ceiling dropped it. Throws only if the
 *  database itself fails — the route handler swallows that so a counter can never break a click. */
export function recordLineClick(click: LineClick, now: Date = new Date()): boolean {
  const minute = Math.floor(now.getTime() / 60_000);
  if (minute !== windowMinute) {
    windowMinute = minute;
    windowRows = 0;
  }
  if (windowRows >= MAX_ROWS_PER_MINUTE) return false;
  windowRows += 1;
  getDb().prepare("INSERT INTO line_clicks (day_th, page, spot) VALUES (?, ?, ?)").run(bangkokDay(now), click.page, click.spot);
  return true;
}

export function lineClickSummary(days: number): LineClickSummary {
  return summarizeLineClicks(getDb(), days);
}
