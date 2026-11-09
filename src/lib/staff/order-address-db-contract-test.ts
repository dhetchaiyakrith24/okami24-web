/**
 * Run: npx tsx src/lib/staff/order-address-db-contract-test.ts
 * "แก้ที่อยู่จัดส่ง" (order-address.ts) against a throwaway SQLite in the OS temp folder (never `.data/`): the real migrations
 * and the web's address rule. Made-up names, phones and addresses.
 *
 * Proves: a paid order not yet sent takes the new address and keeps the old one in its history, with who changed it ·
 * the web's address rule refuses a bad phone / no house number / a postcode of another province · the same address is
 * "nothing to change" · an order sent to the warehouse, handed over by hand, or cancelled is locked.
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
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "okami24-address-test-"));
  process.env.OKAMI24_DATA_DIR = dir;
  try {
    const { getDb } = await load("src/lib/db/client.ts");
    const { stockBook } = await load("src/lib/staff/stock-book.ts");
    const { createLineOrder } = await load("src/lib/staff/line-orders.ts");
    const { changeShippingAddress, addressEditable } = await load("src/lib/staff/order-address.ts");
    const db = getDb();

    const p = (stockBook() as { slug: string; options: { id: string | null; sells: boolean }[] }[]).find((x) => x.options.some((o) => o.sells));
    if (!p) throw new Error("no option to test with");
    const item = { slug: p.slug, variantId: p.options.find((o) => o.sells)!.id, quantity: 1 };
    const order = createLineOrder({
      customerPhone: "0811111111",
      recipientName: "ทดสอบ ระบบ",
      recipientPhone: "0811111111",
      line1: "99/1 หมู่ 2",
      subdistrict: "ตลาดใหญ่",
      district: "เมืองภูเก็ต",
      province: "ภูเก็ต",
      postalCode: "83000",
      keyedBy: "แอดมินทดสอบ",
      items: [item],
      slipRef: null,
    });
    const id = (db.prepare("SELECT id FROM orders WHERE order_number = ?").get(order.orderNumber) as { id: number }).id;
    db.prepare("UPDATE orders SET status = 'approved' WHERE id = ?").run(id);

    const good = { recipientName: "ทดสอบ ใหม่", phone: "0822222222", line1: "12/3 ซอยทดสอบ", subdistrict: "คลองเตยเหนือ", district: "วัฒนา", province: "กรุงเทพมหานคร", postalCode: "10110" };
    const r1 = changeShippingAddress(order.orderNumber, good, "แอดมินทดสอบ");
    const row = db.prepare("SELECT recipient_name, phone, line1, postal_code FROM order_shipping_addresses WHERE order_id = ?").get(id) as Record<string, string>;
    check("paid, not sent: new address saved", r1.ok && row.recipient_name === "ทดสอบ ใหม่" && row.postal_code === "10110" && row.phone === "0822222222", { r1, row });
    const hist = db.prepare("SELECT status, note FROM order_status_history WHERE order_id = ? ORDER BY id DESC LIMIT 1").get(id) as { status: string; note: string };
    check("history keeps the old address and who changed it, status unchanged", hist.status === "approved" && hist.note.startsWith("Staff (แอดมินทดสอบ): address changed — was: ทดสอบ ระบบ 0811111111 99/1 หมู่ 2") && hist.note.includes("83000"), hist);
    check("order still approved", (db.prepare("SELECT status FROM orders WHERE id = ?").get(id) as { status: string }).status === "approved");

    check("same address again: nothing to change", JSON.stringify(changeShippingAddress(order.orderNumber, good, "x")) === JSON.stringify({ ok: false, error: "same" }));
    check("bad phone refused", JSON.stringify(changeShippingAddress(order.orderNumber, { ...good, phone: "081234567" }, "x")) === JSON.stringify({ ok: false, error: "phone" }));
    check("no house number refused", JSON.stringify(changeShippingAddress(order.orderNumber, { ...good, line1: "ซอยทดสอบ" }, "x")) === JSON.stringify({ ok: false, error: "houseNumber" }));
    check("postcode of another province refused", JSON.stringify(changeShippingAddress(order.orderNumber, { ...good, postalCode: "83000" }, "x")) === JSON.stringify({ ok: false, error: "postal" }));

    check("rule: processing is locked", !addressEditable({ status: "processing", sentToWarehouse: false }));
    check("rule: sent by the button is locked", !addressEditable({ status: "approved", sentToWarehouse: true }));
    check("rule: waiting for the money is open", addressEditable({ status: "awaiting_verification", sentToWarehouse: false }));

    db.prepare("INSERT INTO woo_order_sends (order_id, status, attempts, first_sent_at) VALUES (?, 'sent', 1, ?)").run(id, new Date().toISOString());
    check("sent to the warehouse: locked", JSON.stringify(changeShippingAddress(order.orderNumber, { ...good, line1: "15 ซอยทดสอบ" }, "x")) === JSON.stringify({ ok: false, error: "locked" }));
    db.prepare("DELETE FROM woo_order_sends WHERE order_id = ?").run(id);
    db.prepare("UPDATE orders SET status = 'cancelled' WHERE id = ?").run(id);
    check("cancelled: locked", JSON.stringify(changeShippingAddress(order.orderNumber, { ...good, line1: "15 ซอยทดสอบ" }, "x")) === JSON.stringify({ ok: false, error: "locked" }));
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
