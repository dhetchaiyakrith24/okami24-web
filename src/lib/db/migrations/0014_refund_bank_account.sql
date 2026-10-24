-- Owner 24/10 (chat, later than the batch E line): the refund box also takes a bank account number — never a citizen ID —
-- and a bank account needs its bank and branch. One refund target per issue: either refund_promptpay (a mobile number) or
-- these three. Shown masked to the customer, in full on the staff page only.
ALTER TABLE order_stock_issues ADD COLUMN refund_account TEXT;
ALTER TABLE order_stock_issues ADD COLUMN refund_bank TEXT;
ALTER TABLE order_stock_issues ADD COLUMN refund_branch TEXT;
