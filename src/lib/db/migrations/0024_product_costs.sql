-- Cost table (back-office round 07/11, batch 4; owner 04/11: cost and profit are the owner's alone, on the server, never in
-- git). One line per Max product code per start date, so an old order keeps the cost of its day. Satang, no floating point.
-- Filled only from the owner's upload on /staff/owner/costs. src/lib/owner/costs.ts.
CREATE TABLE IF NOT EXISTS product_costs (
  max_code TEXT NOT NULL,
  cost_satang INTEGER NOT NULL,
  -- Bangkok date, YYYY-MM-DD
  effective_from TEXT NOT NULL,
  source TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  PRIMARY KEY (max_code, effective_from)
);
