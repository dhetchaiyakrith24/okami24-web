-- Shipping-fee tiers (owner 29/10, BSOT §10): which rule set this order's shipping fee — one of SHIPPING_RULES in
-- src/lib/commerce/shipping-rules.ts. The once-a-month rule counts earlier `monthly_free` orders, and /staff shows the rule.
-- Additive and nullable: orders placed before this migration keep NULL (= the old single rule) and never count as a use.
ALTER TABLE orders ADD COLUMN shipping_rule TEXT;
CREATE INDEX IF NOT EXISTS idx_orders_shipping_rule ON orders(shipping_rule, created_at);
