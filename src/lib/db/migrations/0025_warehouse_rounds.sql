-- Checked warehouse rounds (back-office round 07/11, batch 5). One row per round: what the check found, as JSON, so an old
-- week reads the same after a code change. The bill file itself is not kept; no customer name, phone or address goes in.
-- Owner's pages only. src/lib/owner/bills.ts.
CREATE TABLE IF NOT EXISTS warehouse_rounds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  -- Bangkok time, YYYY-MM-DDTHH:mm
  round_from TEXT NOT NULL,
  round_to TEXT NOT NULL,
  result_json TEXT NOT NULL,
  checked_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE (round_from, round_to)
);
