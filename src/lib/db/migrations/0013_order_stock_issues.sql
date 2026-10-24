-- Cart UX batch E (owner 24/10 — "ลูกค้าเลือกเปลี่ยนสินค้า หรือกดรับเงินคืนเข้าพร้อมเพย์"; BSOT §9 owner exception 22/10):
-- an item turns out to be out of stock after the customer paid. Staff mark the lines that are out (src/lib/commerce/stock-issues.ts);
-- the customer's order page then offers a swap to an in-stock item at the SAME unit price, or a refund to PromptPay; staff
-- carry it out by hand and record it here. One row per order (staff can ask again, which clears the choice).
--   out_item_ids      order_items.id of the lines staff marked out, comma-separated
--   staff_note        why, for staff only (never shown to the customer)
--   choice            NULL until the customer chooses · 'swap' · 'refund'
--   swap_json         'swap' only: [{"itemId":n,"productSlug":"…","variantId":"…"|null}] — re-checked by staff before applying
--   refund_promptpay  'refund' only: a 10-digit Thai mobile number registered to PromptPay (the order's own phone by default).
--                     Never a bank account or a citizen ID (owner 24/10: no full bank account numbers stored).
--   resolution        NULL while open · 'swapped' · 'refunded' · refund_ref = the staff member's transfer reference
CREATE TABLE IF NOT EXISTS order_stock_issues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL UNIQUE REFERENCES orders(id),
  out_item_ids TEXT NOT NULL,
  staff_note TEXT,
  opened_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  choice TEXT CHECK (choice IN ('swap', 'refund')),
  swap_json TEXT,
  refund_promptpay TEXT,
  chosen_at TEXT,
  resolution TEXT CHECK (resolution IN ('swapped', 'refunded')),
  refund_ref TEXT,
  resolved_at TEXT
);
