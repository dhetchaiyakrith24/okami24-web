/**
 * Run: npx tsx src/lib/staff/line-order-edit-db-contract-test.ts
 * "เพิ่มสินค้าในออเดอร์" end to end against a throwaway SQLite in the OS temp folder (never `.data/`, never the live disk):
 * the real migrations, the real catalogue prices, the real slip and sales rules. Made-up names and phones.
 *
 * Proves: a paid order + a second slip of exactly the difference → one order, one shipping fee, both slips linked, still
 * paid · sales count the new total once, under LINE, and the 2nd slip is not a loose slip any more · old lines keep their
 * sold price · a paid order cannot lose items · a paid order with no slip needs the hand tick · a waiting order + one slip
 * of the whole new total is confirmed · an order sent to the warehouse, or a web order, cannot be changed.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const req = createRequire(path.join(process.cwd(), "package.json"));
req.cache[req.resolve("server-only")] = { exports: {} } as never;

const results: { name: string; ok: boolean; detail?: string }[] = [];
const check = (name: string, ok: boolean, detail?: unknown) => results.push({ name, ok, detail: ok ? undefined : JSON.stringify(detail) });
const load = (rel: string) => import(pathToFileURL(path.join(process.cwd(), rel)).href);

async function main(): Promise<void> {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "okami24-line-edit-test-"));
  process.env.OKAMI24_DATA_DIR = dir;
  try {
    const { getDb } = await load("src/lib/db/client.ts");
    const { stockBook } = await load("src/lib/staff/stock-book.ts");
    const { createLineOrder } = await load("src/lib/staff/line-orders.ts");
    const { changeLineOrderItems } = await load("src/lib/staff/line-order-edit.ts");
    const { salesDays } = await load("src/lib/staff/daily-sales.ts");
    const { decideShipping, UNKNOWN_VISITOR } = await load("src/lib/commerce/shipping-rules.ts");
    const db = getDb();

    // Two options the catalogue sells today (build-time stock: no live stock file in the temp folder).
    const picks: { slug: string; variantId: string | null }[] = [];
    for (const p of stockBook() as { slug: string; options: { id: string | null; sells: boolean }[] }[]) {
      const o = p.options.find((x) => x.sells);
      if (o) picks.push({ slug: p.slug, variantId: o.id });
      if (picks.length === 2) break;
    }
    check("the catalogue sells two options to test with", picks.length === 2, picks);
    if (picks.length < 2) throw new Error("not enough options to test with");
    const [one, two] = picks;

    const at = new Date(Date.now() - 1_800_000).toISOString();
    const slip = (ref: string, satang: number) =>
      db.prepare("INSERT INTO slip_checks (trans_ref, amount_satang, transferred_at, receiver_status, first_checked_at, last_checked_at) VALUES (?,?,?,?,?,?)").run(ref, satang, at, "match", at, at);
    const orderRow = (n: string) =>
      db.prepare("SELECT id, status, total, subtotal, shipping_fee FROM orders WHERE order_number = ?").get(n) as { id: number; status: string; total: number; subtotal: number; shipping_fee: number };
    const base = {
      customerPhone: "0811111111",
      recipientName: "ทดสอบ ระบบ",
      recipientPhone: "0811111111",
      line1: "99/1 หมู่ 2",
      subdistrict: "ตลาดใหญ่",
      district: "เมืองภูเก็ต",
      province: "ภูเก็ต",
      postalCode: "83000",
      keyedBy: "แอดมินทดสอบ",
      items: [{ ...one, quantity: 1 }],
    };

    // A. Keyed and paid by its slip (find the total first with a no-slip order, then key the real one).
    const probe = createLineOrder({ ...base, slipRef: null });
    const total1 = orderRow(probe.orderNumber).total;
    db.prepare("UPDATE orders SET status = 'cancelled' WHERE order_number = ?").run(probe.orderNumber);
    slip("T-1", total1 * 100);
    const a = createLineOrder({ ...base, slipRef: "T-1" });
    check("A: keyed and confirmed by its slip", a.ok && a.confirmed, a);
    const before = orderRow(a.orderNumber);
    const unit1 = (db.prepare("SELECT unit_price FROM order_items WHERE order_id = ?").get(before.id) as { unit_price: number }).unit_price;
    // Price drift: the catalogue price changes after the sale — the old line must keep its sold price.
    db.prepare("UPDATE order_items SET unit_price = unit_price - 1, line_total = line_total - 1 WHERE order_id = ?").run(before.id);
    db.prepare("UPDATE orders SET subtotal = subtotal - 1, total = total - 1 WHERE id = ?").run(before.id);
    const paidTotal = orderRow(a.orderNumber).total;
    db.prepare("UPDATE order_payment_submissions SET slip_amount_satang = ? WHERE order_id = ?").run(paidTotal * 100, before.id);

    // B. The customer adds one of another option and sends a 2nd slip of exactly the difference.
    const twoRef = createLineOrder({ ...base, customerPhone: "0899999999", recipientPhone: "0899999999", items: [{ ...two, quantity: 1 }], slipRef: null });
    const unit2 = (db.prepare("SELECT unit_price FROM order_items WHERE order_id = ?").get(orderRow(twoRef.orderNumber).id) as { unit_price: number }).unit_price;
    db.prepare("UPDATE orders SET status = 'cancelled' WHERE order_number = ?").run(twoRef.orderNumber);
    const sub = unit1 - 1 + unit2;
    const expected = sub + decideShipping(sub, UNKNOWN_VISITOR).fee;
    slip("T-2", (expected - paidTotal) * 100);
    const items = [{ ...one, quantity: 1 }, { ...two, quantity: 1 }];
    const b = changeLineOrderItems({ orderNumber: a.orderNumber, items, slipRef: "T-2", handConfirmed: false, by: "แอดมินทดสอบ" });
    const after = orderRow(a.orderNumber);
    check("B: saved, still paid, one order", b.ok && after.status === "approved", { b, after });
    check("B: old line kept its sold price, new line at today's price", after.subtotal === sub, { after, sub });
    check("B: shipping worked out once on the whole order", after.total === expected && after.shipping_fee === decideShipping(sub, UNKNOWN_VISITOR).fee, { after, expected });
    const pays = db.prepare("SELECT slip_trans_ref FROM order_payment_submissions WHERE order_id = ? ORDER BY id").all(after.id) as { slip_trans_ref: string }[];
    check("B: both slips linked to the order", pays.map((p) => p.slip_trans_ref).join(",") === "T-1,T-2", pays);
    const hist = db.prepare("SELECT note FROM order_status_history WHERE order_id = ? ORDER BY id DESC LIMIT 1").get(after.id) as { note: string };
    check("B: history says who changed it and the totals", hist.note === `Staff (แอดมินทดสอบ): items changed ${paidTotal} → ${expected} THB — slip from the slip check`, hist);

    const today = salesDays()[0];
    check("B: sales count the new total once, under LINE", today.lineOrders.length === 1 && today.lineSatang === expected * 100 && today.webSatang === 0, {
      lineOrders: today.lineOrders.length,
      lineSatang: today.lineSatang,
      expected,
    });
    check("B: the 2nd slip is not a loose LINE slip any more", !today.slips.some((s: { transRef: string }) => s.transRef === "T-2"), today.slips);

    // C. Money is in: taking something off is refused, the same slip cannot be used again, no slip needs the tick.
    const c1 = changeLineOrderItems({ orderNumber: a.orderNumber, items: [{ ...one, quantity: 1 }], slipRef: null, handConfirmed: true, by: "x" });
    check("C: a paid order cannot lose a line", !c1.ok && c1.error === "only-add", c1);
    const more = [{ ...one, quantity: 2 }, { ...two, quantity: 1 }];
    const c2 = changeLineOrderItems({ orderNumber: a.orderNumber, items: more, slipRef: "T-2", handConfirmed: false, by: "x" });
    check("C: a slip already linked is refused", !c2.ok && c2.error === "slip-taken", c2);
    const c3 = changeLineOrderItems({ orderNumber: a.orderNumber, items: more, slipRef: null, handConfirmed: false, by: "x" });
    check("C: paid order, no slip, no tick → refused", !c3.ok && c3.error === "hand-confirm", c3);
    check("C: refused changes left the order as it was", orderRow(a.orderNumber).total === expected);

    // D. Waiting for the money (no slip), then one slip of the whole new total → confirmed.
    const d = createLineOrder({ ...base, customerPhone: "0822222222", recipientPhone: "0822222222", slipRef: null });
    const dSub = unit1 * 2;
    const dTotal = dSub + decideShipping(dSub, UNKNOWN_VISITOR).fee;
    slip("T-3", dTotal * 100);
    const d1 = changeLineOrderItems({ orderNumber: d.orderNumber, items: [{ ...one, quantity: 2 }], slipRef: "T-3", handConfirmed: false, by: "x" });
    const dRun = (db.prepare("SELECT run_number FROM orders WHERE order_number = ?").get(d.orderNumber) as { run_number: number | null }).run_number;
    check("D: waiting + slip of the new total → confirmed with a running number", d1.ok && d1.confirmed && orderRow(d.orderNumber).status === "approved" && dRun !== null, { d1, row: orderRow(d.orderNumber), dRun });

    // E. Sent to the warehouse, or a web order: no change.
    db.prepare("INSERT INTO woo_order_sends (order_id, status, attempts, first_sent_at) VALUES (?, 'sent', 1, ?)").run(orderRow(d.orderNumber).id, at);
    const e1 = changeLineOrderItems({ orderNumber: d.orderNumber, items: [{ ...one, quantity: 3 }], slipRef: null, handConfirmed: true, by: "x" });
    check("E: sent to the warehouse → refused", !e1.ok && e1.error === "sent", e1);
    db.prepare("UPDATE orders SET channel = 'web' WHERE order_number = ?").run(a.orderNumber);
    const e2 = changeLineOrderItems({ orderNumber: a.orderNumber, items: more, slipRef: null, handConfirmed: true, by: "x" });
    check("E: a web order → refused", !e2.ok && e2.error === "not-line", e2);
  } finally {
    try {
      (await load("src/lib/db/client.ts")).getDb().close();
    } catch {
      // already closed or never opened
    }
    fs.rmSync(dir, { recursive: true, force: true });
  }

  for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `\n      ${r.detail}` : ""}`);
  const failed = results.filter((r) => !r.ok).length;
  console.log(failed === 0 ? `All ${results.length} checks passed.` : `${failed} check(s) failed.`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
