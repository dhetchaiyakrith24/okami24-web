-- Orders B4 (owner 26/10 evening, chat): after staff transfer a refund in the bank app they attach the bank's transfer
-- slip to the order; the customer's order page then shows "คืนเงินแล้ว" with that slip, so the customer can check it.
-- Same keeping rule as the customer's payment slip (0017, BSOT §9): the picture stays 90 days, then it is deleted
-- automatically; the refund reference (refund_ref) stays on the issue. The file lives on the data disk under
-- private/slips/ as `r<order id>-<16 hex>.jpg` (never under public/). src/lib/commerce/slip-images.ts.
ALTER TABLE order_stock_issues ADD COLUMN refund_slip_path TEXT;
ALTER TABLE order_stock_issues ADD COLUMN refund_slip_at TEXT;
ALTER TABLE order_stock_issues ADD COLUMN refund_slip_deleted_at TEXT;
