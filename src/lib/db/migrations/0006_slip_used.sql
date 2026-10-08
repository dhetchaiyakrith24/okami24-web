-- Slip-check fix (2026-10-08, real case from staff): "checked again" and "already used for an order" must read
-- differently. A staff member marks a slip as used once its order is confirmed; NULL = nobody marked it.
-- Still no names, accounts or images (0005) — only the time of that mark. src/lib/staff/slip-checks.ts.
ALTER TABLE slip_checks ADD COLUMN used_at TEXT;
