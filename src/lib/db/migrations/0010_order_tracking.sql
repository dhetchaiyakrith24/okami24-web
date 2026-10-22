-- Cart round 22/10 (batch "staff orders"): the parcel tracking number staff type in when an order ships. Shown to the
-- customer on their order page once the order is "shipped" (BSOT §10: tracking provided; no carrier name shown).
-- src/lib/staff/orders.ts.
ALTER TABLE orders ADD COLUMN tracking_number TEXT;
