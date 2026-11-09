/**
 * Run: npx tsx src/lib/staff/line-order-price-db-contract-test.ts
 * A special price on a keyed LINE order (migration 0028, line-order-rules.ts specialPrice) end to end against a throwaway
 * SQLite in the OS temp folder (never `.data/`): the real migrations, catalogue prices, slip, sales and warehouse rules.
 * Made-up names and phones.
 *
 * Proves: the agreed total is what the order charges, a slip of it confirms the order, the items and shipping keep the
 * catalogue prices and the discount + who + why are stored · sales count the agreed total · above the web price is refused,
 * equal to it is no special price · adding items keeps the discount · the warehouse JSON's total = the agreed total.
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
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "okami24-line-price-test-"));
  process.env.OKAMI24_DATA_DIR = dir;
  try {
    const { getDb } = await load("src/lib/db/client.ts");
    const { stockBook } = await load("src/lib/staff/stock-book.ts");
    const { createLineOrder } = await load("src/lib/staff/line-orders.ts");
    const { changeLineOrderItems } = await load("src/lib/staff/line-order-edit.ts");
    const { salesDays } = await load("src/lib/staff/daily-sales.ts");
    const { pushOrderFor } = await load("src/lib/woo/order-push.ts");
    const { wooOrderJson } = await load("src/lib/woo/order-json.ts");
    const { decideShipping, UNKNOWN_VISITOR } = await load("src/lib/commerce/shipping-rules.ts");
    const db = getDb();

    const p = (stockBook() as { slug: string; price: number; options: { id: string | null; sells: boolean }[] }[]).find((x) => x.options.some((o) => o.sells));
    if (!p) throw new Error("no option to test with");
    const item = { slug: p.slug, variantId: p.options.find((o) => o.sells)!.id };
    const web = (qty: number) => p.price * qty + decideShipping(p.price * qty, UNKNOWN_VISITOR).fee;
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
      items: [{ ...item, quantity: 2 }],
    };
    const agreed = web(2) - 37;
    const at = new Date(Date.now() - 1_800_000).toISOString();
    db.prepare("INSERT INTO slip_checks (trans_ref, amount_satang, transferred_at, receiver_status, first_checked_at, last_checked_at) VALUES (?,?,?,?,?,?)").run("T-SP", agreed * 100, at, "match", at, at);

    const a = createLineOrder({ ...base, slipRef: "T-SP", agreedTotal: agreed, priceReason: "ลูกค้าประจำ" });
    const row = db.prepare("SELECT id, status, subtotal, shipping_fee, total, discount, discount_by, discount_reason FROM orders WHERE order_number = ?").get(a.ok ? a.orderNumber : "") as Record<string, number | string | null>;
    check("special price: the slip of the agreed total confirms the order", a.ok && a.confirmed && row.status === "approved", { a, row });
    check("special price: total = agreed; items + shipping stay at catalogue prices", row.total === agreed && Number(row.subtotal) + Number(row.shipping_fee) === web(2), { row, agreed, web: web(2) });
    check("special price: discount, who and why stored", row.discount === 37 && row.discount_by === "แอดมินทดสอบ" && row.discount_reason === "ลูกค้าประจำ", row);
    const note = db.prepare("SELECT note FROM order_status_history WHERE order_id = ? AND note LIKE '%special price%'").get(row.id) as { note: string } | undefined;
    check("special price: history row with the web and agreed totals", note?.note === `Staff (แอดมินทดสอบ): special price ${web(2)} → ${agreed} THB — ลูกค้าประจำ`, note);
    const today = salesDays()[0];
    check("sales: the agreed total counts, once, under LINE", today.lineSatang === agreed * 100 && today.lineOrders.length === 1, { lineSatang: today.lineSatang, agreed });

    const json = wooOrderJson(pushOrderFor(a.ok ? a.orderNumber : "")!, "https://okami24.store");
    check("warehouse JSON: total = the agreed total, a special-price discount line", json.total === agreed.toFixed(2) && json.coupon_lines.some((c: { code: string }) => c.code === "special-price"), {
      total: json.total,
      coupons: json.coupon_lines,
    });

    const above = createLineOrder({ ...base, customerPhone: "0822222222", recipientPhone: "0822222222", slipRef: null, agreedTotal: web(2) + 1 });
    check("above the web price: refused", !above.ok && above.error === "price", above);
    const same = createLineOrder({ ...base, customerPhone: "0833333333", recipientPhone: "0833333333", slipRef: null, agreedTotal: web(2) });
    const sameRow = db.prepare("SELECT discount FROM orders WHERE order_number = ?").get(same.ok ? same.orderNumber : "") as { discount: number | null } | undefined;
    check("equal to the web price: saved with no special price", same.ok && sameRow?.discount === null, { same, sameRow });

    // Adding one more unit keeps the discount: new total = new catalogue total − 37; the 2nd slip pays the difference.
    const newTotal = web(3) - 37;
    db.prepare("INSERT INTO slip_checks (trans_ref, amount_satang, transferred_at, receiver_status, first_checked_at, last_checked_at) VALUES (?,?,?,?,?,?)").run("T-SP2", (newTotal - agreed) * 100, at, "match", at, at);
    const add = changeLineOrderItems({ orderNumber: a.ok ? a.orderNumber : "", items: [{ ...item, quantity: 3 }], slipRef: "T-SP2", handConfirmed: false, by: "แอดมินทดสอบ" });
    const after = db.prepare("SELECT total, discount FROM orders WHERE id = ?").get(row.id) as { total: number; discount: number };
    check("add items: the discount stays, new total = new catalogue total − discount", add.ok && after.total === newTotal && after.discount === 37, { add, after, newTotal });
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
