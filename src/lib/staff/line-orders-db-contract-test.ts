/**
 * Run: npx tsx src/lib/staff/line-orders-db-contract-test.ts
 * Keying a LINE order end to end against a throwaway SQLite in the OS temp folder (never `.data/`, never the live disk):
 * the real migrations, the real catalogue prices, the real slip rules (checker 09/11 on #1331). Made-up names and phones.
 *
 * Proves: the price comes from the catalogue, not the form · a slip of the exact total confirms the order at once ·
 * the same slip twice → the second is refused · a refused save leaves no customer row · a keyed LINE order counts once,
 * under LINE, in the day's sales · LINE orders stay out of the web best-seller list · the warehouse push refuses a LINE
 * order while the owner's switch is off.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

// `server-only` throws outside the Next server; this test is a server, so it gets the empty module it would get there.
const req = createRequire(path.join(process.cwd(), "package.json"));
req.cache[req.resolve("server-only")] = { exports: {} } as never;

const results: { name: string; ok: boolean; detail?: string }[] = [];
const check = (name: string, ok: boolean, detail?: unknown) => results.push({ name, ok, detail: ok ? undefined : JSON.stringify(detail) });
const load = (rel: string) => import(pathToFileURL(path.join(process.cwd(), rel)).href);

async function main(): Promise<void> {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "okami24-line-order-test-"));
  process.env.OKAMI24_DATA_DIR = dir;
  try {
    const { getDb } = await load("src/lib/db/client.ts");
    const { allCatalogItems } = await load("src/lib/catalog-index.ts");
    const { resolveProductRef } = await load("src/lib/commerce/catalog-resolver.ts");
    const { createLineOrder } = await load("src/lib/staff/line-orders.ts");
    const { salesDays } = await load("src/lib/staff/daily-sales.ts");
    const { topWebProducts } = await load("src/lib/owner/dashboard.ts");
    const { pushOrder } = await load("src/lib/woo/order-push.ts");
    const db = getDb();

    // The first option the catalogue sells today (build-time stock: no live stock file in the temp folder).
    let pick: { slug: string; variantId: string | null; price: number } | null = null;
    for (const item of allCatalogItems()) {
      if (item.sellingPrice === null) continue;
      const r = resolveProductRef({ origin: item.origin, slug: item.slug, variantId: null }, undefined, item);
      if (r.ok) {
        pick = { slug: item.slug, variantId: null, price: r.line.unitPrice };
        break;
      }
      if (r.reason === "variant-required") {
        const variant = (await load("src/lib/staff/stock-book.ts")).stockBook().find((p: { slug: string }) => p.slug === item.slug)?.options.find((o: { sells: boolean }) => o.sells);
        if (variant) {
          const rv = resolveProductRef({ origin: item.origin, slug: item.slug, variantId: variant.id }, undefined, item);
          if (rv.ok) {
            pick = { slug: item.slug, variantId: variant.id, price: rv.line.unitPrice };
            break;
          }
        }
      }
    }
    check("the catalogue sells at least one option to test with", pick !== null);
    if (!pick) throw new Error("no option to test with");

    const base = {
      recipientName: "ทดสอบ ระบบ",
      line1: "99/1 หมู่ 2",
      subdistrict: "ตลาดใหญ่",
      district: "เมืองภูเก็ต",
      province: "ภูเก็ต",
      postalCode: "83000",
      keyedBy: "แอดมินทดสอบ",
      items: [{ slug: pick.slug, variantId: pick.variantId, quantity: 2 }],
    };

    // 1. No slip: saved, waits for staff; price from the catalogue.
    const a = createLineOrder({ ...base, customerPhone: "0811111111", recipientPhone: "0811111111", slipRef: null });
    check("no slip: saved, not confirmed", a.ok && !a.confirmed, a);
    const aRow = db.prepare("SELECT o.id, o.status, o.channel, o.keyed_by, o.total, o.subtotal FROM orders o WHERE o.order_number = ?").get(a.ok ? a.orderNumber : "") as
      | { id: number; status: string; channel: string; keyed_by: string; total: number; subtotal: number }
      | undefined;
    const aItem = db.prepare("SELECT unit_price, quantity FROM order_items WHERE order_id = ?").get(aRow?.id ?? -1) as { unit_price: number; quantity: number } | undefined;
    check("price = the catalogue's, × quantity", aItem?.unit_price === pick.price && aRow?.subtotal === pick.price * 2, { aItem, aRow, price: pick.price });
    check("marked LINE, keyed by the typed name, waiting for the money", aRow?.channel === "line" && aRow?.keyed_by === "แอดมินทดสอบ" && aRow?.status === "awaiting_verification", aRow);

    // 2. A loose slip of the exact total confirms the order at once.
    const total = aRow!.total;
    const at = new Date(Date.now() - 3_600_000).toISOString();
    db.prepare("INSERT INTO slip_checks (trans_ref, amount_satang, transferred_at, receiver_status, first_checked_at, last_checked_at) VALUES (?,?,?,?,?,?)").run("T-OK", total * 100, at, "match", at, at);
    const b = createLineOrder({ ...base, customerPhone: "0811111111", recipientPhone: "0811111111", slipRef: "T-OK" });
    const bRow = db.prepare("SELECT status, run_number FROM orders WHERE order_number = ?").get(b.ok ? b.orderNumber : "") as { status: string; run_number: number | null } | undefined;
    check("exact slip: confirmed at once with a running number", b.ok && b.confirmed && bRow?.status === "approved" && bRow.run_number !== null, { b, bRow });

    // 3. The same slip twice.
    const c = createLineOrder({ ...base, customerPhone: "0822222222", recipientPhone: "0822222222", slipRef: "T-OK" });
    check("same slip again: refused as taken", !c.ok && c.error === "slip-taken", c);

    // 4. A slip of another amount, new buyer: refused, and no customer row is left behind.
    db.prepare("INSERT INTO slip_checks (trans_ref, amount_satang, transferred_at, receiver_status, first_checked_at, last_checked_at) VALUES (?,?,?,?,?,?)").run("T-WRONG", total * 100 + 100, at, "match", at, at);
    const d = createLineOrder({ ...base, customerPhone: "0833333333", recipientPhone: "0833333333", slipRef: "T-WRONG" });
    const dCustomer = db.prepare("SELECT 1 FROM customers WHERE phone = ?").get("0833333333");
    check("wrong amount: refused", !d.ok && d.error === "slip-amount", d);
    check("refused save leaves no customer row", dCustomer === undefined, dCustomer);
    check("refused saves leave no order", (db.prepare("SELECT COUNT(*) AS n FROM orders").get() as { n: number }).n === 2);

    // 5. Daily sales: the confirmed LINE order counts once, under LINE; its slip is not a loose slip; the waiting one is out.
    const today = salesDays()[0];
    check("sales: confirmed LINE order under LINE, once", today.lineOrders.length === 1 && today.webSatang === 0, today);
    check("sales: its slip is not counted again; the wrong-amount slip stays a loose LINE slip", !today.slips.some((s: { transRef: string }) => s.transRef === "T-OK") && today.slips.some((s: { transRef: string }) => s.transRef === "T-WRONG"), today.slips);
    check("sales: LINE total = order + loose slip", today.lineSatang === total * 100 + (total * 100 + 100), today.lineSatang);

    // 6. Web best sellers ignore LINE orders.
    check("web best sellers leave LINE orders out", topWebProducts(30).length === 0, topWebProducts(30));

    // 7. The warehouse push refuses a LINE order while the owner's switch is off (no switch file = off).
    const pushed = await pushOrder(b.ok ? b.orderNumber : "");
    check("push refuses a LINE order while the switch is off", !pushed.ok && pushed.error === "line-switch-off", pushed);
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
