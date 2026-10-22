-- Cart round 22/10 (owner: customers pay at once and attach the slip on the order page). The slip is checked with
-- EasySlip the moment it arrives (src/lib/staff/slip-verify.ts) and the verdict is kept on the payment submission.
-- Same privacy line as 0005: no slip image, no sender/receiver names or account numbers — the bank's transaction
-- reference ties the submission to its slip_checks row. src/lib/commerce/payment-slip.ts.
-- slip_verdict: pass (shop's account, amount = order total, transfer not seen before) · check (a person must look —
-- slip_reasons says why) · unchecked (EasySlip could not be asked; staff check the bank app by hand).
ALTER TABLE order_payment_submissions ADD COLUMN slip_trans_ref TEXT;
ALTER TABLE order_payment_submissions ADD COLUMN slip_amount_satang INTEGER;
ALTER TABLE order_payment_submissions ADD COLUMN slip_verdict TEXT;
ALTER TABLE order_payment_submissions ADD COLUMN slip_reasons TEXT;
CREATE INDEX IF NOT EXISTS idx_order_payment_submissions_trans_ref ON order_payment_submissions(slip_trans_ref);
