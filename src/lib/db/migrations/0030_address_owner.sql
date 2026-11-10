-- Saved addresses belong to a signed-in member, not to a phone number (T2-03 + T2-15; owner approved the plan 11/11: "อนุมัติ").
--
-- Before: an address row belonged to `customers` (the phone), and the checkout phone step opens that phone's session with no
-- code (owner 23/10), so typing someone's number listed their saved addresses. Now:
--   member_id  = the LINE / Google member who may see, pick, edit and delete it again. NULL = nobody lists it.
--   session_id = the checkout phone session that typed it: that session may use it for its own order, never list it.
-- Nothing is removed: customer_id stays (the order still records the phone), and every old row is kept.
-- Rules = src/lib/commerce/address-owner.ts · contract test = src/lib/commerce/address-owner-contract-test.ts.
ALTER TABLE addresses ADD COLUMN member_id INTEGER REFERENCES members(id);
ALTER TABLE addresses ADD COLUMN session_id INTEGER REFERENCES sessions(id);
CREATE INDEX IF NOT EXISTS idx_addresses_member ON addresses(member_id);
CREATE INDEX IF NOT EXISTS idx_addresses_session ON addresses(session_id);

-- Backfill: an old address goes to a member only when it is exactly the shipping address of an order the same phone placed
-- while that member was signed in, and exactly one member matches. Every other old row stays NULL — hidden, not deleted
-- (deleting customer data is the owner's call, TEAM_RULES 13.3 #1).
UPDATE addresses
SET member_id = (
  SELECT MIN(o.member_id)
  FROM orders o JOIN order_shipping_addresses s ON s.order_id = o.id
  WHERE o.member_id IS NOT NULL AND o.customer_id = addresses.customer_id
    AND s.recipient_name = addresses.recipient_name AND s.phone = addresses.phone AND s.line1 = addresses.line1
    AND s.subdistrict = addresses.subdistrict AND s.district = addresses.district AND s.province = addresses.province
    AND s.postal_code = addresses.postal_code
)
WHERE (
  SELECT COUNT(DISTINCT o.member_id)
  FROM orders o JOIN order_shipping_addresses s ON s.order_id = o.id
  WHERE o.member_id IS NOT NULL AND o.customer_id = addresses.customer_id
    AND s.recipient_name = addresses.recipient_name AND s.phone = addresses.phone AND s.line1 = addresses.line1
    AND s.subdistrict = addresses.subdistrict AND s.district = addresses.district AND s.province = addresses.province
    AND s.postal_code = addresses.postal_code
) = 1;
