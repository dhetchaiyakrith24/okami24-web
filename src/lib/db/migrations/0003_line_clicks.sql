-- Round 8 (owner ruling 2026-09-23, option ก of _incoming/seo-c/b4-plan.md §5): count clicks on the
-- site's LINE links in-site. A row is "one click, on this page, from this spot, at this time" and
-- nothing else — no cookie is set, and no IP address, user agent, session or identifier of any kind
-- is stored, so the table holds counts, never people. Read-out: scripts/line-clicks.js (plain node) against the
-- database file, or the token-gated GET on /api/metrics/line-click (see that route's comment).
CREATE TABLE IF NOT EXISTS line_clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  clicked_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  -- The calendar day in Thailand (UTC+7), computed by the server at insert time, so the read-out
  -- groups clicks by the day the shop actually lives in rather than by UTC.
  day_th TEXT NOT NULL,
  -- Path only (no query string, no hash), normalised by src/lib/metrics/line-click-input.ts.
  page TEXT NOT NULL,
  -- Which LINE link: pill (floating button) · buy (product page order button) · buy-note ·
  -- footer · other. Same module owns the list.
  spot TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS line_clicks_day_th ON line_clicks (day_th);
