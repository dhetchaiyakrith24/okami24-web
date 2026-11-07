-- Owner's section of the back office (back-office round 07/11, batch 3; owner 04/11 + 07/11: cost and profit are the owner's
-- alone, sign in with Google). Same shape as `sessions` and `member_sessions`: only the SHA-256 of the opaque cookie token.
-- No email and no Google id here: who the owner is lives in the host's settings (OKAMI24_OWNER_GOOGLE_EMAIL), and a sign-in
-- that does not match it creates nothing. src/lib/owner/auth.ts.
CREATE TABLE IF NOT EXISTS owner_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token_hash TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  expires_at TEXT NOT NULL,
  revoked_at TEXT
);
