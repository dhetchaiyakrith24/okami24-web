import "server-only";
import { getDb } from "@/lib/db/client";

/** The call log and the stock numbers Shipnity reports (tables in migration 0019). */

const BODY_LIMIT = 4096;
const KEEP_ROWS = 5000;

export interface LogEntry {
  method: string;
  path: string;
  query: string;
  status: number;
  keyId: number | null;
  ip: string | null;
  userAgent: string | null;
  body: string | null;
}

let writes = 0;

export function logCall(e: LogEntry): void {
  try {
    const db = getDb();
    db.prepare(
      "INSERT INTO woo_api_log (method, path, query, status, key_id, ip, user_agent, body) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(
      e.method,
      e.path.slice(0, 300),
      e.query.slice(0, 1000),
      e.status,
      e.keyId,
      e.ip?.slice(0, 64) ?? null,
      e.userAgent?.slice(0, 200) ?? null,
      e.body === null ? null : e.body.slice(0, BODY_LIMIT)
    );
    // Keep the newest rows only, so a stranger hammering the URL cannot fill the disk.
    if (++writes % 100 === 0) {
      db.prepare("DELETE FROM woo_api_log WHERE id <= (SELECT MAX(id) FROM woo_api_log) - ?").run(KEEP_ROWS);
    }
  } catch {
    // the log must never be the reason a call fails
  }
}

export interface LogRow {
  id: number;
  at: string;
  method: string;
  path: string;
  query: string;
  status: number;
  key_id: number | null;
  ip: string | null;
  user_agent: string | null;
  body: string | null;
}

export function recentCalls(limit = 100): LogRow[] {
  return getDb().prepare("SELECT * FROM woo_api_log ORDER BY id DESC LIMIT ?").all(limit) as LogRow[];
}

export interface StockReport {
  quantity: number | null;
  stockStatus: string | null;
  reportedAt: string;
}

export function stockReports(): Map<string, StockReport> {
  const rows = getDb().prepare("SELECT sku, quantity, stock_status, reported_at FROM woo_stock_reports").all() as {
    sku: string;
    quantity: number | null;
    stock_status: string | null;
    reported_at: string;
  }[];
  return new Map(rows.map((r) => [r.sku, { quantity: r.quantity, stockStatus: r.stock_status, reportedAt: r.reported_at }]));
}

export function saveStockReport(sku: string, quantity: number | null, stockStatus: string | null): void {
  getDb()
    .prepare(
      `INSERT INTO woo_stock_reports (sku, quantity, stock_status) VALUES (?, ?, ?)
       ON CONFLICT(sku) DO UPDATE SET quantity = COALESCE(excluded.quantity, quantity),
         stock_status = COALESCE(excluded.stock_status, stock_status), reported_at = excluded.reported_at`
    )
    .run(sku, quantity, stockStatus);
}

export function stockReportCount(): number {
  return (getDb().prepare("SELECT COUNT(*) AS n FROM woo_stock_reports").get() as { n: number }).n;
}
