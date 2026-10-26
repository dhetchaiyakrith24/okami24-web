-- Orders B2 (owner 26/10, chat — queue B2 (a) + (c)).
--
-- (a) The shop's running order number #0001, #0002 … — given when staff CONFIRM the payment (the order reaches
-- `approved`), never at checkout: an order that is never paid never takes a number, so the numbers count real sales.
-- OK-<date>-<hex> stays the customer's reference (links, LINE, the order page). src/lib/commerce/run-number.ts.
ALTER TABLE orders ADD COLUMN run_number INTEGER;
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_run_number ON orders(run_number);

-- Orders confirmed before this migration get their numbers in the order staff confirmed them (the first `approved`
-- history row), so #0001 is the first payment the shop ever confirmed.
WITH confirmed AS (
  SELECT order_id, MIN(id) AS first_approved FROM order_status_history WHERE status = 'approved' GROUP BY order_id
),
numbered AS (
  SELECT order_id, ROW_NUMBER() OVER (ORDER BY first_approved) AS n FROM confirmed
)
UPDATE orders SET run_number = (SELECT n FROM numbered WHERE numbered.order_id = orders.id)
 WHERE id IN (SELECT order_id FROM numbered);

-- (c) The slip IMAGE the customer attached on the order page is kept 90 days, then deleted automatically; the verdict
-- columns (0008) stay. This replaces 0008's "no slip image" line — owner 26/10 in chat, BSOT §9. The file lives on the
-- data disk under private/slips/ (never under public/); `proof_image_path` (0001, unused until now) holds its file name.
-- `slip_image_token` = the long random path the LINE bot gives LINE to fetch the picture for the "OKM Webside order"
-- group (LINE image messages need an HTTPS URL) — cleared with the file. src/lib/commerce/slip-images.ts.
ALTER TABLE order_payment_submissions ADD COLUMN slip_image_token TEXT;
ALTER TABLE order_payment_submissions ADD COLUMN slip_image_deleted_at TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_order_payment_submissions_image_token ON order_payment_submissions(slip_image_token);
