-- Cart UX batch C (owner 24/10): an optional note from the customer to the shop, written on the review step (max 200 characters,
-- cleaned by cleanCustomerNote in src/lib/commerce/orders.ts). Shown on the staff order page only — not in the LINE alert, not to
-- the customer afterwards. NULL = no note.
ALTER TABLE orders ADD COLUMN customer_note TEXT;
