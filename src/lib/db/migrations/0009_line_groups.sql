-- Cart round 22/10: the LINE groups the alert bot "OKM ORDER" has been invited into. A row is written when LINE sends
-- the "join" event and removed on "leave"; a staff member then marks ONE group as the order group ("OKM Order") and ONE
-- as the slip group ("OKM Slip") on /staff. So no group ID ever has to be copied into the host's settings.
-- Only LINE's own group ID and our role for it — no member names, no messages. src/lib/line/groups.ts.
CREATE TABLE IF NOT EXISTS line_groups (
  group_id TEXT PRIMARY KEY,
  -- 'order' · 'slip' · NULL (joined, not assigned yet). At most one group per role (index below).
  role TEXT,
  joined_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS line_groups_role ON line_groups (role) WHERE role IS NOT NULL;
