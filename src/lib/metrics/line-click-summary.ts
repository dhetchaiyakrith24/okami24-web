/**
 * LINE-click counter — the read side, shared by the route handler's GET and `scripts/line-clicks.ts`.
 * No `server-only` here for the same reason as line-click-input.ts: the script runs under plain
 * `tsx` with its own read-only database handle, the route passes the app's singleton.
 */
import type Database from "better-sqlite3";
import { bangkokDayWindowStart } from "./line-click-input";

export interface CountRow<K extends string> {
  key: K;
  count: number;
}

export interface LineClickSummary {
  /** First Bangkok day the window covers (inclusive) and the number of days asked for. */
  since: string;
  days: number;
  total: number;
  byDay: { day: string; count: number }[];
  byPage: { page: string; count: number }[];
  bySpot: { spot: string; count: number }[];
  /** Last 7 days × spot, so a reader sees the shape of a week without a second query. */
  lastSevenDays: { day: string; pill: number; buy: number; other: number; total: number }[];
}

/** True when the migration has run on this file — the script may open a database from before round 8. */
export function hasLineClicksTable(db: Database.Database): boolean {
  const row = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'line_clicks'").get();
  return Boolean(row);
}

export function summarizeLineClicks(db: Database.Database, days: number, now: Date = new Date()): LineClickSummary {
  const span = Math.max(1, Math.min(365, Math.floor(days)));
  const since = bangkokDayWindowStart(span, now);
  const total = (db.prepare("SELECT COUNT(*) AS n FROM line_clicks WHERE day_th >= ?").get(since) as { n: number }).n;
  const byDay = db
    .prepare("SELECT day_th AS day, COUNT(*) AS count FROM line_clicks WHERE day_th >= ? GROUP BY day_th ORDER BY day_th DESC")
    .all(since) as { day: string; count: number }[];
  const byPage = db
    .prepare("SELECT page, COUNT(*) AS count FROM line_clicks WHERE day_th >= ? GROUP BY page ORDER BY count DESC, page ASC")
    .all(since) as { page: string; count: number }[];
  const bySpot = db
    .prepare("SELECT spot, COUNT(*) AS count FROM line_clicks WHERE day_th >= ? GROUP BY spot ORDER BY count DESC, spot ASC")
    .all(since) as { spot: string; count: number }[];

  const weekSince = bangkokDayWindowStart(7, now);
  const weekRows = db
    .prepare("SELECT day_th AS day, spot, COUNT(*) AS count FROM line_clicks WHERE day_th >= ? GROUP BY day_th, spot")
    .all(weekSince) as { day: string; spot: string; count: number }[];
  const week = new Map<string, { day: string; pill: number; buy: number; other: number; total: number }>();
  for (const r of weekRows) {
    const row = week.get(r.day) ?? { day: r.day, pill: 0, buy: 0, other: 0, total: 0 };
    if (r.spot === "pill") row.pill += r.count;
    else if (r.spot === "buy" || r.spot === "buy-note") row.buy += r.count;
    else row.other += r.count;
    row.total += r.count;
    week.set(r.day, row);
  }
  const lastSevenDays = [...week.values()].sort((a, b) => (a.day < b.day ? 1 : -1));

  return { since, days: span, total, byDay, byPage, bySpot, lastSevenDays };
}
