-- OKami24 commerce foundation — initial schema (Production + Commerce Architecture pass, 2026-09-02).
--
-- Scope: customer identity (phone-first), sessions, addresses, cart, orders + snapshots,
-- Shipnity sync boundary, checkout idempotency. See docs/BUSINESS_SOURCE_OF_TRUTH.md for the
-- business rules this schema encodes (shipping/payment/stock/order-status policy).
--
-- Money columns are integer THB (satang not used — the business only ever quotes whole-baht
-- prices; see ProductMaster.pricing.sellingPrice, which is already a plain number of THB).

CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone TEXT NOT NULL UNIQUE,
  display_name TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- OTP challenges are the phone-verification mechanism for phone-first identity (see
-- docs/BUSINESS_SOURCE_OF_TRUTH.md §11). `code_hash` only — never store a code in the clear.
-- Real SMS delivery is TBD (§19); src/lib/otp/sender.ts documents the current stub.
CREATE TABLE IF NOT EXISTS otp_challenges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  consumed_at TEXT,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_otp_challenges_phone ON otp_challenges(phone);

-- Database sessions (not JWT) — see src/lib/commerce/session.ts. Only `token_hash` (SHA-256 of
-- the opaque cookie value) is ever persisted; the raw token exists only in the httpOnly cookie.
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  token_hash TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  expires_at TEXT NOT NULL,
  revoked_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_sessions_customer ON sessions(customer_id);

CREATE TABLE IF NOT EXISTS addresses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  recipient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  line1 TEXT NOT NULL,
  subdistrict TEXT NOT NULL,
  district TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  is_default INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_addresses_customer ON addresses(customer_id);

-- Cart id is an opaque random string (not an autoincrement int) so the guest-cart cookie value
-- can't be used to enumerate other shoppers' carts. customer_id is nullable: a cart starts as a
-- guest cart and is claimed (customer_id set) once the shopper verifies their phone at checkout.
CREATE TABLE IF NOT EXISTS carts (
  id TEXT PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_carts_customer ON carts(customer_id);

-- No price column here on purpose — a cart line is a *request* (product + variant + qty), never
-- a priced fact. Price is resolved fresh from the published catalog every time it's displayed and
-- again, authoritatively, at checkout submission. See src/lib/commerce/pricing.ts.
CREATE TABLE IF NOT EXISTS cart_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cart_id TEXT NOT NULL REFERENCES carts(id),
  product_slug TEXT NOT NULL,
  variant_id TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  added_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE(cart_id, product_slug, variant_id)
);

-- order_number is a human-facing reference (safe to say out loud over LINE); view_token is a
-- separate, longer opaque secret required to view order status without being logged in as the
-- owning customer (guest-checkout order lookup) — this is the anti-enumeration control: knowing
-- the order_number alone is never enough. `status` values match
-- docs/BUSINESS_SOURCE_OF_TRUTH.md §9 exactly — see src/lib/commerce/order-status.ts.
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number TEXT NOT NULL UNIQUE,
  view_token TEXT NOT NULL,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  status TEXT NOT NULL DEFAULT 'pending_payment',
  subtotal INTEGER NOT NULL,
  shipping_fee INTEGER NOT NULL,
  total INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'THB',
  payment_method TEXT NOT NULL DEFAULT 'bank_transfer',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);

-- Snapshot table — deliberately duplicates name/price/variant-label off the catalog at the
-- moment of purchase. The catalog is free to change slug/price/name later without corrupting the
-- historical record of what was actually bought.
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_slug TEXT NOT NULL,
  variant_id TEXT,
  variant_label TEXT,
  product_name_snapshot TEXT NOT NULL,
  unit_price INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  line_total INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- Snapshot, not a live FK to `addresses` — the customer's saved address may change or be deleted
-- after the order ships; the order must keep recording where it was actually sent.
CREATE TABLE IF NOT EXISTS order_shipping_addresses (
  order_id INTEGER PRIMARY KEY REFERENCES orders(id),
  recipient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  line1 TEXT NOT NULL,
  subdistrict TEXT NOT NULL,
  district TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS order_status_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  status TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order ON order_status_history(order_id);

-- A customer-submitted claim ("I paid, here's my reference"), never automated proof of payment —
-- docs/BUSINESS_SOURCE_OF_TRUTH.md §9 is explicit that payment is not confirmed just because the
-- customer says so. `proof_image_path` is nullable and unused by the current UI (no upload flow
-- yet, and no admin review panel exists to look at it) — kept so the schema doesn't need a
-- breaking migration the day image evidence is built; see the final report's follow-up list.
CREATE TABLE IF NOT EXISTS order_payment_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  method TEXT NOT NULL,
  reference_note TEXT,
  proof_image_path TEXT,
  submitted_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_order_payment_submissions_order ON order_payment_submissions(order_id);

-- The Shipnity integration boundary. No real Shipnity API exists yet (mechanism is TBD — see
-- docs/BUSINESS_SOURCE_OF_TRUTH.md §19), so `status` starts and typically stays 'pending_manual':
-- a durable, retryable record an admin can act on, not a real push. See src/lib/shipnity/adapter.ts.
CREATE TABLE IF NOT EXISTS shipnity_sync_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL UNIQUE REFERENCES orders(id),
  status TEXT NOT NULL DEFAULT 'pending_manual',
  attempt_count INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  last_attempted_at TEXT,
  external_reference TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- Checkout submission idempotency — the client generates one key per checkout attempt (kept in a
-- hidden field across a retry/resubmit) so a double-click or a network-retry replays into the same
-- order instead of creating a duplicate. See placeOrder() in src/lib/commerce/orders.ts.
CREATE TABLE IF NOT EXISTS idempotency_keys (
  key TEXT PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
