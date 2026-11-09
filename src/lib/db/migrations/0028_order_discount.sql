-- A special price on a LINE order keyed on /staff/line-order (owner 10/11, LINE_ORDERS_GAPS.md #5: "the admin may give
-- discounts, no cap; record who gave it and the catalogue price"). The order's items and shipping keep the web's catalogue
-- prices (subtotal + shipping_fee = the catalogue total, the "price beside it"); discount = how much less the customer pays,
-- so total = subtotal + shipping_fee - discount. NULL = no special price (every order before this migration, every web
-- order). discount_by = the name the admin typed; discount_reason = their short reason. Rules: src/lib/staff/line-order-rules.ts.
ALTER TABLE orders ADD COLUMN discount INTEGER CHECK (discount IS NULL OR discount > 0);
ALTER TABLE orders ADD COLUMN discount_by TEXT;
ALTER TABLE orders ADD COLUMN discount_reason TEXT;
