-- Shipnity link (owner 28/10): when the warehouse changes an order it was sent — above all cancels it because the item ran
-- out — the site must know and tell the team on LINE, so an admin calls the customer and talks to the warehouse's admin.
-- One row per change Shipnity sent; the site's own order status is never changed by it (staff decide). New table only.
CREATE TABLE woo_order_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  -- the Woo status Shipnity set ("cancelled", "completed", …), "deleted", or NULL when the write carried no status
  shipnity_status TEXT,
  at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  -- set once the LINE alert for this order + status went out (one alert per order and status)
  notified_at TEXT
);
CREATE INDEX woo_order_events_order ON woo_order_events(order_id);
