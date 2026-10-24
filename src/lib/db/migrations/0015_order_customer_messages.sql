-- Owner 24/10 ("กล่องข้อความแจ้งรายละเอียดจากแอดมิน"): staff can write to the customer on the order page — why an order was
-- cancelled, why an item ran out, anything the customer should know. Separate from every staff-only note (cancel reasons in
-- order_status_history, order_stock_issues.staff_note), which never reach the customer. Shown newest first on /orders/<n>
-- (src/lib/commerce/order-messages.ts); never sent anywhere else.
CREATE TABLE IF NOT EXISTS order_customer_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_order_customer_messages_order ON order_customer_messages(order_id);
