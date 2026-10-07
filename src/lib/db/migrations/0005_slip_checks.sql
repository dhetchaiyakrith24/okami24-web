-- Slip-check round (owner ruling 2026-10-07, BSOT §9): what the staff page remembers about a checked slip.
-- Deliberately NOT stored: the slip image, and the sender's / receiver's names and account numbers — those
-- are customer data (round file 【ห้ามแตะ】). Kept: only what is needed to warn "this slip was already
-- checked" and to show a log — the bank's transaction reference, amount, transfer time and when we checked.
-- src/lib/staff/slip-checks.ts.
CREATE TABLE IF NOT EXISTS slip_checks (
  -- the bank's transaction reference (EasySlip rawSlip.transRef) — one row per real transfer
  trans_ref TEXT PRIMARY KEY,
  -- satang, so 1,500.50 THB is 150050 — no floating point in money
  amount_satang INTEGER NOT NULL,
  -- the transfer time as the bank reports it (ISO 8601, +07:00)
  transferred_at TEXT NOT NULL,
  -- match · mismatch · unclear — our own receiver check (src/lib/staff/receiver-match.ts), not a name
  receiver_status TEXT NOT NULL,
  first_checked_at TEXT NOT NULL,
  last_checked_at TEXT NOT NULL,
  check_count INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS slip_checks_last ON slip_checks (last_checked_at);

-- sha256 of an uploaded image file → the slip it was. The same file uploaded again is answered from here
-- without calling EasySlip at all (round file: "ไม่เรียก API ซ้ำกับรูปเดิม"). A hash, not the image.
CREATE TABLE IF NOT EXISTS slip_check_images (
  image_sha256 TEXT PRIMARY KEY,
  trans_ref TEXT NOT NULL REFERENCES slip_checks (trans_ref),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
