-- Where an order came from (owner list ก11, 09/11: LINE orders keyed into the back office). 'web' = the customer ordered on
-- the site (every order before this migration); 'line' = staff keyed a LINE-chat order on /staff/line-order. keyed_by = the
-- name the staff member typed on that form (the team shares one password, so there is no staff account to point at).
-- Readers sort sales and profit by it so a LINE order and its slip count once: src/lib/staff/daily-sales-rules.ts.
ALTER TABLE orders ADD COLUMN channel TEXT NOT NULL DEFAULT 'web' CHECK (channel IN ('web', 'line'));
ALTER TABLE orders ADD COLUMN keyed_by TEXT;
CREATE INDEX IF NOT EXISTS idx_orders_channel ON orders(channel);
