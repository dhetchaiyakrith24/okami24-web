-- Shipnity link, step "orders" (owner 28/10 "ทำเลยระหว่างรอ"): on connecting (28/10 18:08) Shipnity registered three
-- WooCommerce webhooks with this site — order.created / order.updated / order.deleted, each with a delivery URL and a signing
-- secret. A Woo shop stores them and POSTs every new order there; this site does the same (src/lib/woo/order-push.ts),
-- only to a webhook staff have approved on /staff/shipnity. New tables only; the log table of 0019 is cleaned (below).

CREATE TABLE woo_webhooks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key_id INTEGER REFERENCES woo_api_keys(id),
  name TEXT NOT NULL DEFAULT '',
  topic TEXT NOT NULL,
  delivery_url TEXT NOT NULL,
  -- Shipnity's signing secret (X-WC-Webhook-Signature = base64 HMAC-SHA256 of the body). Needed in the clear to sign.
  secret TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  -- Set when staff press "อนุญาต" on /staff/shipnity — no order (customer name, address, phone) is sent before that.
  approved_at TEXT,
  deleted_at TEXT
);

-- One row per order sent to the warehouse: the order id Shipnity sees is orders.id.
CREATE TABLE woo_order_sends (
  order_id INTEGER PRIMARY KEY REFERENCES orders(id),
  status TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  http_status INTEGER,
  last_error TEXT,
  first_sent_at TEXT,
  last_attempt_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- The three webhooks Shipnity registered before this table existed are in the call log of 0019 (the old door answered
-- "created" but kept nothing). Recover them from there, then drop every logged webhook body so the secret lives in one
-- place only (from now on the route strips "secret" before logging).
INSERT INTO woo_webhooks (key_id, name, topic, delivery_url, secret, created_at)
SELECT key_id,
       COALESCE(json_extract(body, '$.name'), ''),
       json_extract(body, '$.topic'),
       json_extract(body, '$.delivery_url'),
       COALESCE(json_extract(body, '$.secret'), ''),
       at
FROM woo_api_log
WHERE method = 'POST' AND path LIKE '/wp-json/wc/v_/webhooks' AND status = 201 AND key_id IS NOT NULL
  AND json_valid(body) AND json_extract(body, '$.topic') IS NOT NULL AND json_extract(body, '$.delivery_url') IS NOT NULL
ORDER BY id;

UPDATE woo_api_log SET body = NULL WHERE path LIKE '%/webhooks%';
