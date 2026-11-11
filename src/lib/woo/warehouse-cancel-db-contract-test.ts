/**
 * Run: npx tsx src/lib/woo/warehouse-cancel-db-contract-test.ts
 * Shipnity cancels an order → the web order cancels itself (T2-10 / T2-11, owner 11/11 "ยกเลิกบนเว็บอัตโนมัติ";
 * src/lib/woo/warehouse-cancel.ts via order-events.ts recordOrderUpdates) against a throwaway SQLite in the OS temp folder
 * (never `.data/`): the real migrations. Made-up names, phones and addresses. No LINE env = no push is attempted.
 *
 * Proves: a paid (approved) order turns "cancelled" with the warehouse note, leaves the day's sales and the "รอใส่เลขพัสดุ"
 * list, and gets a whole-order refund choice · the customer can pick a refund on the cancelled order and staff can record
 * it (the order stays cancelled) · a swap is refused on it · a second "cancelled" changes nothing · "deleted" / "failed"
 * only record the event · a shipped order is left alone · an order with a slip never confirmed cancels with no refund box ·
 * the event row is still written every time.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const req = createRequire(path.join(process.cwd(), "package.json"));
const stub = (id: string, exports: unknown) => {
  req.cache[req.resolve(id)] = { id, filename: id, loaded: true, exports } as never;
};
stub("server-only", {});
// No customer session in this test — the order page's own view token is the access (getOrderDetailForViewer).
stub("next/headers", { cookies: async () => ({ get: () => undefined, set: () => undefined, delete: () => undefined }), headers: async () => new Headers() });

const results: { name: string; ok: boolean; detail?: string }[] = [];
const check = (name: string, ok: boolean, detail?: unknown) => results.push({ name, ok, detail: ok ? undefined : JSON.stringify(detail) });
const load = (rel: string) => import(pathToFileURL(path.join(process.cwd(), rel)).href);

async function main(): Promise<void> {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "okami24-warehouse-cancel-test-"));
  process.env.OKAMI24_DATA_DIR = dir;
  delete process.env.LINE_CHANNEL_ACCESS_TOKEN;
  try {
    const { getDb } = await load("src/lib/db/client.ts");
    const { stockBook } = await load("src/lib/staff/stock-book.ts");
    const { createLineOrder } = await load("src/lib/staff/line-orders.ts");
    const { recordOrderUpdates } = await load("src/lib/woo/order-events.ts");
    const { getStockIssue, stockIssueViewFor, chooseRefund, chooseSwap, markRefunded } = await load("src/lib/commerce/stock-issues.ts");
    const { salesToday } = await load("src/lib/staff/daily-sales.ts");
    const { jobOf } = await load("src/lib/staff/jobs.ts");
    const db = getDb();

    const p = (stockBook() as { slug: string; options: { id: string | null; sells: boolean }[] }[]).find((x) => x.options.some((o) => o.sells));
    if (!p) throw new Error("no option to test with");
    const item = { slug: p.slug, variantId: p.options.find((o) => o.sells)!.id, quantity: 1 };
    let phone = 811111110;
    const make = (status: string, history: string[]) => {
      phone += 1;
      const o = createLineOrder({
        customerPhone: `0${phone}`,
        recipientName: "ทดสอบ ระบบ",
        recipientPhone: `0${phone}`,
        line1: "99/1 หมู่ 2",
        subdistrict: "ตลาดใหญ่",
        district: "เมืองภูเก็ต",
        province: "ภูเก็ต",
        postalCode: "83000",
        keyedBy: "แอดมินทดสอบ",
        items: [item],
        slipRef: null,
      });
      const row = db.prepare("SELECT id, view_token FROM orders WHERE order_number = ?").get(o.orderNumber) as { id: number; view_token: string };
      for (const h of history) db.prepare("INSERT INTO order_status_history (order_id, status, note) VALUES (?, ?, 'test')").run(row.id, h);
      db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, row.id);
      return { number: o.orderNumber as string, id: row.id, token: row.view_token };
    };
    const statusOf = (id: number) => (db.prepare("SELECT status FROM orders WHERE id = ?").get(id) as { status: string }).status;
    const events = (id: number) => (db.prepare("SELECT COUNT(*) AS n FROM woo_order_events WHERE order_id = ?").get(id) as { n: number }).n;
    const inSales = (n: string) => salesToday().lineOrders.some((o: { orderNumber: string }) => o.orderNumber === n);

    // 1 — paid, handed to the warehouse (processing): the warehouse cancels.
    const paid = make("processing", ["payment_submitted", "awaiting_verification", "approved", "processing"]);
    check("before: the paid order counts in today's sales", inSales(paid.number), salesToday().lineOrders);
    check("before: it sits in the tracking job", jobOf("processing") === "tracking");
    await recordOrderUpdates([{ orderId: paid.id, status: "cancelled" }]);
    check("Shipnity cancelled → web order cancelled", statusOf(paid.id) === "cancelled", statusOf(paid.id));
    const last = db.prepare("SELECT status, note FROM order_status_history WHERE order_id = ? ORDER BY id DESC LIMIT 1").get(paid.id) as { status: string; note: string };
    check("history row: cancelled, by the warehouse", last.status === "cancelled" && last.note === "Shipnity: cancel — warehouse cancelled", last);
    check("after: out of today's sales", !inSales(paid.number), salesToday().lineOrders);
    check("after: the cancelled job, not the tracking one", jobOf("cancelled") === "cancelled");
    check("the event is still recorded", events(paid.id) === 1, events(paid.id));
    const issue = getStockIssue(paid.id);
    check("a whole-order refund choice is open", issue !== null && issue.refund.wholeOrder && issue.resolution === null && issue.choice === null, issue);
    const view = stockIssueViewFor(paid.id);
    check("customer view: refund only (afterCancel, no swap options)", view?.afterCancel === true && Object.keys(view.swapGroups).length === 0 && view.stage === "waiting-choice", view);

    const swap = await chooseSwap(paid.number, paid.token, new Map());
    check("a swap is refused on the cancelled order", !swap.ok && swap.error === "closed", swap);
    const wrongToken = await chooseRefund(paid.number, "nope", { mode: "own" });
    check("a refund choice needs the order's own link", !wrongToken.ok && wrongToken.error === "not-found", wrongToken);
    const refund = await chooseRefund(paid.number, paid.token, { mode: "other", promptPay: "0899999999" });
    check("the customer picks a refund on the cancelled order", refund.ok && refund.choice === "refund", refund);
    const done = markRefunded(paid.number, "TESTREF1234");
    check("staff record the refund", done.ok, done);
    check("the order stays cancelled", statusOf(paid.id) === "cancelled");
    const rows = db.prepare("SELECT status, note FROM order_status_history WHERE order_id = ? AND status = 'cancelled' ORDER BY id").all(paid.id) as { status: string; note: string }[];
    check("the FIRST cancelled row is still the warehouse cancel (its reason is kept)", rows[0]?.note === "Shipnity: cancel — warehouse cancelled" && rows.some((r) => r.note === "Stock: refunded — ref TESTREF1234"), rows);

    // 2 — the same cancel again: nothing changes, the event is still written.
    const before = (db.prepare("SELECT COUNT(*) AS n FROM order_status_history WHERE order_id = ?").get(paid.id) as { n: number }).n;
    await recordOrderUpdates([{ orderId: paid.id, status: "cancelled" }]);
    const after = (db.prepare("SELECT COUNT(*) AS n FROM order_status_history WHERE order_id = ?").get(paid.id) as { n: number }).n;
    check("a second cancel adds no history row", before === after, { before, after });
    check("…but records the event", events(paid.id) === 2, events(paid.id));

    // 3 — refunded from Shipnity = a cancel too.
    const approved = make("approved", ["payment_submitted", "awaiting_verification", "approved"]);
    await recordOrderUpdates([{ orderId: approved.id, status: "refunded" }]);
    check("Shipnity refunded → web order cancelled + refund choice", statusOf(approved.id) === "cancelled" && getStockIssue(approved.id)?.refund.wholeOrder === true);

    // 4 — delete / failed / a plain status: recorded, never cancelled (a cancel cannot be undone).
    for (const s of ["deleted", "trash", "failed", "completed", null]) {
      const o = make("processing", ["payment_submitted", "awaiting_verification", "approved", "processing"]);
      await recordOrderUpdates([{ orderId: o.id, status: s }]);
      check(`Shipnity ${s ?? "(no status)"} → order untouched, event recorded`, statusOf(o.id) === "processing" && getStockIssue(o.id) === null && events(o.id) === 1, { status: statusOf(o.id) });
    }

    // 5 — shipped: past the point of cancelling.
    const shipped = make("shipped", ["payment_submitted", "awaiting_verification", "approved", "processing", "shipped"]);
    await recordOrderUpdates([{ orderId: shipped.id, status: "cancelled" }]);
    check("a shipped order is left alone", statusOf(shipped.id) === "shipped" && events(shipped.id) === 1);

    // 6 — a slip sent but never confirmed: cancelled, no refund box (owner 29/10: an unconfirmed slip promises no refund).
    const slip = make("payment_submitted", ["payment_submitted"]);
    await recordOrderUpdates([{ orderId: slip.id, status: "cancelled" }]);
    check("unconfirmed slip → cancelled, no refund box", statusOf(slip.id) === "cancelled" && getStockIssue(slip.id) === null);

    // 7 — an order that never was: nothing breaks.
    let threw = false;
    try {
      await recordOrderUpdates([{ orderId: 999999, status: "cancelled" }]);
    } catch {
      threw = true;
    }
    check("an unknown order id does not throw", !threw);
  } finally {
    try {
      (await load("src/lib/db/client.ts")).getDb().close();
    } catch {
      /* best effort */
    }
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

main()
  .then(() => {
    for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `  — ${r.detail}` : ""}`);
    const failed = results.filter((r) => !r.ok).length;
    console.log(`\n${results.length - failed}/${results.length} passed`);
    process.exit(failed ? 1 : 0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
