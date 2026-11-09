/**
 * Run: npx tsx src/lib/woo/auto-push-db-contract-test.ts
 * Sending a paid order to the warehouse by itself (auto-push-rules.ts, auto-push.ts) end to end: a throwaway SQLite in the
 * OS temp folder (never `.data/`), the real migrations and switches file, and a throwaway HTTP endpoint on 127.0.0.1 standing
 * in for Shipnity (no request leaves this computer). Made-up names and phones.
 *
 * Proves: nothing goes while the owner's switch is off · a LINE order waits for its own switch too · switch on → one send,
 * the order moves to "sent to the warehouse" with its history row and the send log · a second confirm never sends it again ·
 * a refused send leaves the order paid, logged as failed, for the button · the pure rule's order of reasons.
 */
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import type { AddressInfo } from "node:net";

const req = createRequire(path.join(process.cwd(), "package.json"));
req.cache[req.resolve("server-only")] = { exports: {} } as never;

const results: { name: string; ok: boolean; detail?: string }[] = [];
const check = (name: string, ok: boolean, detail?: unknown) => results.push({ name, ok, detail: ok ? undefined : JSON.stringify(detail) });
const load = (rel: string) => import(pathToFileURL(path.join(process.cwd(), rel)).href);

async function main(): Promise<void> {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "okami24-auto-push-test-"));
  process.env.OKAMI24_DATA_DIR = dir;
  let answer = 201;
  const hits: string[] = [];
  const server = http.createServer((rq, rs) => {
    let body = "";
    rq.on("data", (c) => (body += c));
    rq.on("end", () => {
      hits.push(body);
      // "Connection: close": no keep-alive socket left open for the exit to trip over (libuv on Windows).
      rs.writeHead(answer, { "Content-Type": "application/json", Connection: "close" });
      rs.end("{}");
    });
  });
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", () => r()));
  const port = (server.address() as AddressInfo).port;
  try {
    const { getDb } = await load("src/lib/db/client.ts");
    const { stockBook } = await load("src/lib/staff/stock-book.ts");
    const { warehouseCode } = await load("src/lib/staff/orders-export.ts");
    const { createLineOrder } = await load("src/lib/staff/line-orders.ts");
    const { applyStaffAction } = await load("src/lib/staff/orders.ts");
    const { writeSwitches } = await load("src/lib/commerce/shop-switches.ts");
    const { ALL_OPEN } = await load("src/lib/commerce/shop-switches-rules.ts");
    const { autoPushAfterConfirm } = await load("src/lib/woo/auto-push.ts");
    const { autoPushSkip } = await load("src/lib/woo/auto-push-rules.ts");
    const db = getDb();

    // An option the catalogue sells today that has a warehouse code (a send needs every line's code).
    let item: { slug: string; variantId: string | null } | null = null;
    for (const p of stockBook() as { slug: string; options: { id: string | null; sells: boolean }[] }[]) {
      const o = p.options.find((x) => x.sells && warehouseCode(p.slug, x.id));
      if (o) {
        item = { slug: p.slug, variantId: o.id };
        break;
      }
    }
    check("the catalogue has a sellable option with a warehouse code", item !== null);
    if (!item) throw new Error("no option to test with");

    db.prepare("INSERT INTO woo_webhooks (topic, delivery_url, secret, status, approved_at) VALUES ('order.created', ?, 'test-secret', 'active', ?)").run(
      `http://127.0.0.1:${port}/hook`,
      new Date().toISOString()
    );
    let n = 0;
    const paidOrder = () => {
      n += 1;
      const phone = `08${String(10000000 + n).padStart(8, "0")}`;
      const o = createLineOrder({
        customerPhone: phone,
        recipientName: "ทดสอบ ระบบ",
        recipientPhone: phone,
        line1: "99/1 หมู่ 2",
        subdistrict: "ตลาดใหญ่",
        district: "เมืองภูเก็ต",
        province: "ภูเก็ต",
        postalCode: "83000",
        keyedBy: "แอดมินทดสอบ",
        items: [{ ...item!, quantity: 1 }],
        slipRef: null,
      });
      applyStaffAction(o.orderNumber, "confirm", { note: "test" });
      return o.orderNumber as string;
    };
    const status = (num: string) => (db.prepare("SELECT status FROM orders WHERE order_number = ?").get(num) as { status: string }).status;
    const sendRow = (num: string) =>
      db.prepare("SELECT s.status FROM woo_order_sends s JOIN orders o ON o.id = s.order_id WHERE o.order_number = ?").get(num) as { status: string } | undefined;

    // 1. No switches file = all off: nothing goes.
    const a = paidOrder();
    const a1 = await autoPushAfterConfirm(a);
    check("switch off: skipped, nothing sent, still paid", JSON.stringify(a1) === JSON.stringify({ sent: false, skip: "switch-off" }) && hits.length === 0 && status(a) === "approved", { a1, hits: hits.length });

    // 2. Auto on, LINE switch off: a LINE order still waits.
    writeSwitches({ ...ALL_OPEN, autoToWarehouse: true });
    const a2 = await autoPushAfterConfirm(a);
    check("auto on, LINE switch off: a LINE order is not sent", JSON.stringify(a2) === JSON.stringify({ sent: false, skip: "line-switch-off" }) && hits.length === 0, a2);

    // 3. Both on: one send, the step recorded, the log says sent.
    writeSwitches({ ...ALL_OPEN, autoToWarehouse: true, lineToWarehouse: true });
    const a3 = await autoPushAfterConfirm(a);
    const note = db.prepare("SELECT h.note FROM order_status_history h JOIN orders o ON o.id = h.order_id WHERE o.order_number = ? ORDER BY h.id DESC LIMIT 1").get(a) as { note: string };
    check("both on: sent once, order handed to the warehouse", a3.sent === true && hits.length === 1 && status(a) === "processing" && sendRow(a)?.status === "sent", { a3, hits: hits.length, st: status(a) });
    check("both on: history names the system's send", note.note.includes("ส่งเข้า Shipnity อัตโนมัติหลังยืนยันยอด"), note);
    check("the body sent is this order", JSON.parse(hits[0]).number === a || hits[0].includes(a), hits[0]?.slice(0, 120));

    // 4. Asked again (a second confirm, a retry): never a second send.
    const a4 = await autoPushAfterConfirm(a);
    check("asked again: not sent a second time", a4.sent === false && hits.length === 1, { a4, hits: hits.length });

    // 5. Shipnity refuses: the order stays paid for the button, the log says failed.
    answer = 500;
    const b = paidOrder();
    const b1 = await autoPushAfterConfirm(b);
    check("refused: not sent, still paid, logged as failed", JSON.stringify(b1) === JSON.stringify({ sent: false, error: "failed" }) && status(b) === "approved" && sendRow(b)?.status === "failed", { b1, st: status(b), row: sendRow(b) });

    // 6. The pure rule: switch first, then Shipnity, then the LINE switch.
    check("rule: switch off wins", autoPushSkip({ autoOn: false, shipnityReady: false, channel: "line", lineSwitchOn: false }) === "switch-off");
    check("rule: no Shipnity link", autoPushSkip({ autoOn: true, shipnityReady: false, channel: "web", lineSwitchOn: true }) === "no-shipnity");
    check("rule: a web order needs only the auto switch", autoPushSkip({ autoOn: true, shipnityReady: true, channel: "web", lineSwitchOn: false }) === null);
  } finally {
    // Close every keep-alive socket first, then wait for the server: closing it under an open socket trips libuv on Windows.
    server.closeAllConnections();
    await new Promise<void>((r) => server.close(() => r()));
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
  // exitCode, not exit(): fetch's pooled sockets close on their own; exit() under them trips libuv on Windows.
  process.exitCode = failed === 0 ? 0 : 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
