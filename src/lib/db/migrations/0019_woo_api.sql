-- Shipnity link, step 1 (owner 27/10 "ได้"): the warehouse's Shipnity connects to a shop through WooCommerce's REST API —
-- the shop makes a key pair, the warehouse types "Url · cs · ck" into Shipnity. This site is not WooCommerce, so it answers
-- the same calls itself (src/app/wp-json/, src/lib/woo/). Three new tables; no existing table is touched.

-- One row per key pair made on /staff/shipnity. Only hashes are stored: the secret is shown once when it is made and never
-- again. `key_hash` = sha256 of the whole ck_… string (looked up per request), `secret_hash` = sha256 of cs_… .
CREATE TABLE woo_api_keys (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  key_last7 TEXT NOT NULL,
  secret_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  last_used_at TEXT,
  revoked_at TEXT
);

-- Every call to /wp-json, signed or not, so staff can see exactly what Shipnity asks for (Shipnity publishes no spec).
-- Credentials are stripped from `query` before it is written; `body` is kept only for signed calls, cut to 4 KB.
CREATE TABLE woo_api_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  method TEXT NOT NULL,
  path TEXT NOT NULL,
  query TEXT NOT NULL DEFAULT '',
  status INTEGER NOT NULL,
  key_id INTEGER REFERENCES woo_api_keys(id),
  ip TEXT,
  user_agent TEXT,
  body TEXT
);
CREATE INDEX woo_api_log_at ON woo_api_log(at);

-- The latest stock number Shipnity sent per warehouse code. Step 1 only records it (the site does not read it yet);
-- step 3 compares it with the hourly order-entry read before the site switches over.
CREATE TABLE woo_stock_reports (
  sku TEXT PRIMARY KEY,
  quantity INTEGER,
  stock_status TEXT,
  reported_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
