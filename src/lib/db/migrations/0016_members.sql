-- Member sign-in (queue Q4, owner 26/10: LINE + Google first, no Facebook, no member perks yet, staff keep their password).
--
-- Kept apart from `customers` / `sessions` on purpose: those rows are created by the phone step at checkout with no code
-- (owner 23/10), so whoever types a number gets that number's session. A member row is only ever created by a LINE or
-- Google sign-in, so a member session proves the visitor owns that LINE / Google account — the two must not be merged.
--
-- What is stored (BSOT §11 "do not collect unnecessary personal information"): the provider's stable user id and the
-- display name it returns. No email, no picture, no access or refresh token — the sign-in only needs to know who came back.
CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  display_name TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  last_sign_in_at TEXT
);

-- One row per (provider, provider user id). `subject` = LINE `sub` / Google `sub` from the ID token.
CREATE TABLE IF NOT EXISTS member_identities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL REFERENCES members(id),
  provider TEXT NOT NULL CHECK (provider IN ('line', 'google')),
  subject TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE(provider, subject)
);
CREATE INDEX IF NOT EXISTS idx_member_identities_member ON member_identities(member_id);

-- Same shape as `sessions`: only the SHA-256 of the opaque cookie token is kept.
CREATE TABLE IF NOT EXISTS member_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL REFERENCES members(id),
  provider TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  expires_at TEXT NOT NULL,
  revoked_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_member_sessions_member ON member_sessions(member_id);

-- An order placed while signed in as a member belongs to that member (shown on /account). Null = a guest order, as before.
ALTER TABLE orders ADD COLUMN member_id INTEGER REFERENCES members(id);
CREATE INDEX IF NOT EXISTS idx_orders_member ON orders(member_id);
