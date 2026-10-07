-- Slip-check round (owner ruling 2026-10-07, docs/BUSINESS_SOURCE_OF_TRUTH.md §9 "one exception"): the
-- staff-only page at /staff is behind ONE shared staff password (owner pick A). The password itself is
-- never stored — it lives only in the host's secret settings (OKAMI24_STAFF_PASSWORD). These two tables
-- hold the sessions it opens and the failed attempts that slow down guessing. src/lib/staff/auth.ts.
CREATE TABLE IF NOT EXISTS staff_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  -- sha256 of the random cookie token; the token itself is only ever in the staff member's cookie.
  token_hash TEXT NOT NULL UNIQUE,
  -- A short fingerprint of the password the session was opened with. Changing the password in the
  -- host settings (e.g. when someone leaves the team) makes every older session stop working.
  password_tag TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  expires_at TEXT NOT NULL,
  revoked_at TEXT
);

CREATE TABLE IF NOT EXISTS staff_login_failures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  -- sha256 of the client address — enough to count attempts per address, not the address itself.
  client_hash TEXT NOT NULL,
  failed_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS staff_login_failures_at ON staff_login_failures (failed_at);
