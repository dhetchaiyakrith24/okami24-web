-- LINE refunds (owner 10/11 "ทาง 1"): money the shop sent back to a LINE customer, tied to the customer's own slip in
-- slip_checks. Each "แจ้งยอดโอนคืน" post the admin writes in the refund group is one row; the bot fills it from the post's
-- amount and the slip picture posted right after it. Staff can also add one, match one or undo one on /staff/slip.
-- Sales and the LINE round profit subtract the matched amount from that slip (src/lib/staff/refund-rules.ts).
-- Same privacy line as 0005: the post's text, the customer's name, bank and account are never kept — only the amount, the
-- time the post gave, and a hash of the poster's LINE id (to pair a post with the poster's next picture).
-- Additive only: a revert of the code leaves this table unread.
CREATE TABLE IF NOT EXISTS slip_refunds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  -- 'line' = read from the refund group · 'staff' = entered on /staff/slip
  source TEXT NOT NULL,
  -- LINE's id of the text post: the same event sent twice is one row
  line_message_id TEXT UNIQUE,
  group_id TEXT,
  -- first 16 hex of sha256(LINE userId); null when LINE gave none
  poster_hash TEXT,
  -- satang; null = the post holds no single readable amount (shown to staff, never guessed)
  amount_satang INTEGER,
  -- the order time the post names ("MP 05/11/26 : 13.05"), ISO with +07:00; null when it names none
  hint_at TEXT,
  posted_at TEXT NOT NULL,
  -- waiting (for its slip picture) · matched · unmatched · duplicate · undone
  status TEXT NOT NULL,
  -- why unmatched: no-amount · no-picture · slip-unreadable · not-shop-slip · over-slip · ambiguous · no-slip
  reason TEXT,
  -- the customer's slip this refund belongs to (slip_checks.trans_ref)
  trans_ref TEXT,
  -- ref (read from the picture) · amount-time (unreadable picture, one slip of that amount near the post's time) · staff
  matched_by TEXT,
  matched_at TEXT
);
CREATE INDEX IF NOT EXISTS slip_refunds_ref ON slip_refunds (trans_ref) WHERE status = 'matched';
CREATE INDEX IF NOT EXISTS slip_refunds_posted ON slip_refunds (posted_at);
