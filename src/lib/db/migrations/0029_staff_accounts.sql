-- One account per admin (owner 10/11 chat: "admin แต่ละคนมีบัญชีของตัวเอง … พี่เห็นว่าใครคีย์ออเดอร์ไหน ใครให้ส่วนลดอะไร ใครกดรับ
-- ออเดอร์เว็บ"). The admins sign in to /staff with their own Google account; the owner adds and disables them on
-- /staff/owner?view=team. src/lib/staff/accounts.ts. The address is kept here, on the data disk — never in git, env or logs.
CREATE TABLE IF NOT EXISTS staff_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  -- What the owner calls this person on every page and in "ใครทำอะไร".
  name TEXT NOT NULL,
  -- Lower-case Google address; a sign-in must carry it with Google's verified flag.
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin')),
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  -- Google's own id for the person, pinned at the first sign-in: a later sign-in with the same address but another id is refused.
  google_sub TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  last_sign_in_at TEXT
);

-- Who a staff session belongs to. 'shared' = the team password of 0004 (every session before this migration);
-- 'account' = an admin's Google sign-in (account_id set); 'owner' = the owner's Google sign-in, acting in the admin view.
ALTER TABLE staff_sessions ADD COLUMN actor_kind TEXT NOT NULL DEFAULT 'shared' CHECK (actor_kind IN ('shared', 'account', 'owner'));
ALTER TABLE staff_sessions ADD COLUMN account_id INTEGER REFERENCES staff_accounts(id);

-- Who keyed a LINE order, as an account (keyed_by of 0026 stays: the name as it read that day).
ALTER TABLE orders ADD COLUMN keyed_by_account_id INTEGER REFERENCES staff_accounts(id);

-- "ใครทำอะไร": one row per thing a person did in the back office. Append-only — nothing in the code updates or deletes a row.
-- actor_name is the name at that moment, so renaming or disabling an account never rewrites history.
CREATE TABLE IF NOT EXISTS staff_audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  actor_kind TEXT NOT NULL CHECK (actor_kind IN ('shared', 'account', 'owner')),
  account_id INTEGER REFERENCES staff_accounts(id),
  actor_name TEXT NOT NULL,
  action TEXT NOT NULL,
  order_number TEXT,
  detail TEXT
);
CREATE INDEX IF NOT EXISTS idx_staff_audit_at ON staff_audit(at);
CREATE INDEX IF NOT EXISTS idx_staff_audit_account ON staff_audit(account_id, at);
