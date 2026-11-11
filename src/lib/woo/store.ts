import "server-only";
import { getDb } from "@/lib/db/client";

/** The call log and the stock numbers Shipnity reports (tables in migration 0019). */

const BODY_LIMIT = 4096;
/** An order Shipnity writes back can be a whole Woo order; tracking may sit at its end (meta_data), so keep more of it. */
const ORDER_BODY_LIMIT = 32768;
const KEEP_ROWS = 5000;
/** Non-product calls are pruned on their own, so an hourly stock run of 700+ writes cannot push them out (owner 29/10). */
const KEEP_OTHER_ROWS = 2000;
/** Unsigned non-product calls (no Woo key — a scanner, or Shipnity before its key is set) keep a small window of their own. */
const KEEP_UNSIGNED_ROWS = 500;
const PRODUCT_PATH = "/wp-json/wc/v_/products%";

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
      e.body === null ? null : e.body.slice(0, e.path.includes("/orders") ? ORDER_BODY_LIMIT : BODY_LIMIT)
    );
    // Keep the newest rows only, so a stranger hammering the URL cannot fill the disk.
    if (++writes % 100 === 0) {
      const prune = (where: string, keep: number) =>
        db
          .prepare(
            `DELETE FROM woo_api_log WHERE ${where} AND id < COALESCE((SELECT id FROM woo_api_log WHERE ${where} ORDER BY id DESC LIMIT 1 OFFSET ?), 0)`
          )
          .run(PRODUCT_PATH, PRODUCT_PATH, keep - 1);
      prune("path LIKE ?", KEEP_ROWS);
      // Signed and unsigned non-product calls are pruned apart (security pass 09/11): the tracking catch-up and the staff
      // "order writes" download read Shipnity's signed rows, and a stranger's unsigned calls (answered 401, never acted on)
      // must not be able to push those out by sheer number.
      prune("path NOT LIKE ? AND key_id IS NOT NULL", KEEP_OTHER_ROWS);
      prune("path NOT LIKE ? AND key_id IS NULL", KEEP_UNSIGNED_ROWS);
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

/** Every call that is not about products (orders, webhooks, settings, unknown paths) — a stock run of 700+ writes can no
 *  longer push an order cancellation off the page (owner 28/10). */
export function recentOtherCalls(limit = 100): LogRow[] {
  return getDb()
    .prepare("SELECT * FROM woo_api_log WHERE path NOT LIKE ? ORDER BY id DESC LIMIT ?")
    .all(PRODUCT_PATH, limit) as LogRow[];
}

/** Every write Shipnity made to an order (status · note · tracking), newest first — for the staff download (owner 29/10). */
export function recentOrderWrites(limit = 300): LogRow[] {
  return getDb()
    .prepare("SELECT * FROM woo_api_log WHERE method <> 'GET' AND path LIKE '%/orders%' ORDER BY id DESC LIMIT ?")
    .all(limit) as LogRow[];
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
