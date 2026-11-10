/**
 * Run: npx tsx src/lib/staff/staff-audit-contract-test.ts
 * "ใครทำอะไร" (owner 10/11): every staff action names its person. Proves the filters and day bounds (Bangkok days), the detail
 * lines carry no customer data, every order-page button has a record, and — against a throwaway SQLite in the OS temp folder,
 * never `.data/` — that rows land on the right day and person, an order lists its own rows, and a keyed LINE order points at
 * its account. Made-up names only.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { AUDIT_ACTIONS, dayRange, ORDER_STEP_AUDIT, orderStepDetail, parseDay, parseWho, refTail, shiftDay, slipCheckDetail, switchDetail, whoParam, withTypedName } from "./audit-rules";
import { STAFF_ACTIONS } from "./order-actions";
import { nameOf, signedInName } from "./account-rules";

const req = createRequire(path.join(process.cwd(), "package.json"));
req.cache[req.resolve("server-only")] = { exports: {} } as never;

let failed = 0;
function check(name: string, ok: boolean, detail?: unknown): void {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || detail === undefined ? "" : `  ${JSON.stringify(detail)}`}`);
  if (!ok) failed++;
}
const load = (rel: string) => import(pathToFileURL(path.join(process.cwd(), rel)).href);

// --- Pure ---
check("every order-page button has a record with Thai words", Object.keys(STAFF_ACTIONS).every((a) => (ORDER_STEP_AUDIT as Record<string, string>)[a] in AUDIT_ACTIONS));
check("ship detail = carrier + number, cleaned", orderStepDetail("ship", { carrier: "EMS", tracking: " th12 34 " }) === "EMS · TH1234");
check("cancel detail = only that the customer was told, never the text", orderStepDetail("cancel", { message: "คุณสมชาย 0812345678\nขอยกเลิก" }) === "แจ้งเหตุผลลูกค้าแล้ว");
check("a cancel without a message carries no detail", orderStepDetail("cancel", { message: "  " }) === null);
check("a refund reference keeps its last 6 only", refTail(" 0123 4567 89AB ") === "สลิปลงท้าย 6789AB" && refTail("  ") === null);
check("shared password: the typed name joins the record", withTypedName("shared", "  Prang ", "ลด ฿50") === "ชื่อที่พิมพ์ Prang · ลด ฿50" && withTypedName("shared", "Prang", null) === "ชื่อที่พิมพ์ Prang");
check("an own account or the owner: nothing added", withTypedName("account", "Mallory", "x") === "x" && withTypedName("owner", "x", null) === null && withTypedName("shared", "", "x") === "x");
check("every owner switch has its words", ["cart", "site", "line", "auto"].every((k) => switchDetail(k, true) && switchDetail(k, false) && switchDetail(k, true) !== switchDetail(k, false)) && switchDetail("x", true) === null);
check("a confirm carries no detail", orderStepDetail("confirm", { note: "x" } as never) === null);
check("slip detail: amount + verdict, nothing else", slipCheckDetail({ amount: 1250, receiverStatus: "match" }, false, null) === "฿1,250 · เข้าบัญชีร้าน");
check("slip detail flags a repeat and a wrong amount", slipCheckDetail({ amount: 99.5, receiverStatus: "mismatch" }, true, false) === "฿99.5 · ไม่ใช่บัญชีร้าน · สลิปเคยตรวจแล้ว · ยอดไม่ตรงออเดอร์");
check("who: account id", JSON.stringify(parseWho("7")) === JSON.stringify({ kind: "account", id: 7 }));
check("who: owner / shared", parseWho("owner").kind === "owner" && parseWho("shared").kind === "shared");
check("who: junk = everyone", parseWho("1; DROP").kind === "all" && parseWho("-3").kind === "all" && parseWho(undefined).kind === "all");
check("who round-trips through the address", whoParam(parseWho("7")) === "7" && whoParam(parseWho(undefined)) === null);
const now = Date.parse("2026-11-10T20:30:00Z"); // 03:30 on the 11th in Bangkok
check("today is the Bangkok day", parseDay(undefined, now) === "2026-11-11");
check("a future day reads as today", parseDay("2026-12-01", now) === "2026-11-11");
check("junk reads as today", parseDay("11/10/2026", now) === "2026-11-11");
check("a past day stays", parseDay("2026-11-01", now) === "2026-11-01");
const r = dayRange("2026-11-11");
check("a Bangkok day starts 17:00 UTC the day before", r.from === "2026-11-10T17:00:00.000Z" && r.to === "2026-11-11T17:00:00.000Z");
check("day arrows", shiftDay("2026-11-01", -1) === "2026-10-31" && shiftDay("2026-10-31", 1) === "2026-11-01");

// --- Who a team form names (LINE order, items, address) ---
const iceA = { kind: "account" as const, accountId: 3, name: "ICE" };
const sharedA = { kind: "shared" as const, accountId: null, name: "รหัสร่วม" };
const ownerA = { kind: "owner" as const, accountId: null, name: "เจ้าของ" };
check("an own account names itself; a typed name is ignored", nameOf(iceA, "Mallory") === "ICE" && nameOf(ownerA, "x") === "เจ้าของ");
check("the shared password keeps the typed name", nameOf(sharedA, "Prang") === "Prang" && nameOf(sharedA, "") === "");
check("the name field hides only for a known person", signedInName(iceA) === "ICE" && signedInName(ownerA) === "เจ้าของ" && signedInName(sharedA) === null && signedInName(null) === null);
for (const [file, hits] of [["src/app/staff/line-order/actions.ts", ["line-order", "order-discount", "order-items"]], ["src/app/staff/orders/[orderNumber]/address-actions.ts", ["order-address"]]] as const) {
  const src = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  check(`${file}: records ${hits.join(", ")}`, hits.every((h) => src.includes(`recordStaffAction(actor, "${h}"`)));
  // Every save action starts by naming its person (currentStaff), never the bare yes/no isStaff().
  const saves = [...src.matchAll(/export async function ((?:create|change)\w*)\(/g)].map((m) => ({ name: m[1], head: src.slice(m.index, m.index + 400) }));
  check(`${file}: has its save actions`, saves.length > 0, saves.length);
  for (const s of saves) check(`${file} ${s.name}: names its person first`, /\{\s*const actor = (?:await actorOrBack\(\)|staffAreaEnabled\(\) \? await currentStaff\(\) : null);/.test(s.head) && !s.head.includes("isStaff()"), s.head.slice(0, 160));
}
// Every form that asks a name keeps the typed name in its records (shared password) — line order, items, address, auto-send.
{
  const read = (f: string) => fs.readFileSync(path.join(process.cwd(), f), "utf8");
  const line = read("src/app/staff/line-order/actions.ts");
  const addr = read("src/app/staff/orders/[orderNumber]/address-actions.ts");
  const count = (s: string, needle: string) => s.split(needle).length - 1;
  check("LINE order, discount and items records carry the typed name", count(line, "withTypedName(actor.kind, ") === 3 && line.includes("autoPushed(actor, result.orderNumber, typed)") && line.includes("autoPushed(actor, orderNumber, by)"));
  check("the address record carries the typed name", addr.includes(`recordStaffAction(actor, "order-address", { orderNumber, detail: withTypedName(actor.kind, by, null) })`));
  check("the automatic send passes the typed name on", read("src/lib/staff/auto-push-audit.ts").includes("withTypedName(actor.kind, typedName, "));
  const forms = ["src/app/staff/line-order/LineOrderForm.tsx", "src/app/staff/orders/[orderNumber]/AddressEdit.tsx", "src/app/staff/orders/[orderNumber]/LineItemsEdit.tsx"];
  const asking = fs.readdirSync(path.join(process.cwd(), "src/app/staff"), { recursive: true }).map(String).filter((f) => /\.tsx$/.test(f) && read(path.join("src/app/staff", f)).includes("useStaffName()"));
  check("the forms that ask a name are the three wired here", asking.length === forms.length, asking);
  const owner = read("src/app/staff/owner/actions.ts");
  check("the owner's switches, hidden products, costs and bill check are recorded", ["\"shop-switch\"", "\"product-hide\"", "\"product-show\"", "\"costs-save\"", "\"bill-check\""].every((a) => owner.includes(a)) && count(owner, "recordStaffAction(OWNER, ") === 4);
  check("the cost record holds no money", /recordStaffAction\(OWNER, "costs-save", \{ detail: `\$\{count\} รุ่น` \}\)/.test(owner));
}
check("a keyed LINE order passes its account to the special price", fs.readFileSync(path.join(process.cwd(), "src/app/staff/line-order/actions.ts"), "utf8").includes("keyedByStaffId: actor.accountId"));

for (const file of ["src/app/staff/actions.ts", "src/app/staff/line-order/actions.ts"]) {
  const src = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  check(`${file}: the automatic send to Shipnity goes through autoPushed (recorded)`, src.includes("autoPushed(actor, ") && !src.includes("autoPushAfterConfirm("));
}
check("autoPushed records only a send that happened", /if \(outcome\.sent\) recordStaffAction\(actor, "order-shipnity"/.test(fs.readFileSync(path.join(process.cwd(), "src/lib/staff/auto-push-audit.ts"), "utf8")));

// --- Database ---
async function db(): Promise<void> {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "okami24-staff-audit-test-"));
  process.env.OKAMI24_DATA_DIR = dir;
  try {
    const { getDb } = await load("src/lib/db/client.ts");
    const { addAccount } = await load("src/lib/staff/accounts.ts");
    const audit = await load("src/lib/staff/audit.ts");
    const d = getDb();
    const ice = addAccount("ICE", "admin1@example.com");
    const prang = addAccount("Prang", "admin2@example.com");
    const iceActor = { kind: "account", accountId: ice.id, name: "ICE" };
    const ownerActor = { kind: "owner", accountId: null, name: "เจ้าของ" };
    const put = (at: string, actor: { kind: string; accountId: number | null; name: string }, action: string, order: string | null = null) =>
      d.prepare("INSERT INTO staff_audit (at, actor_kind, staff_id, actor_name, action, order_number) VALUES (?, ?, ?, ?, ?, ?)").run(at, actor.kind, actor.accountId, actor.name, action, order);

    put("2026-11-10T16:59:00.000Z", iceActor, "order-confirm", "OK-1"); // 23:59 on the 10th, Bangkok
    put("2026-11-10T17:00:00.000Z", iceActor, "order-ship", "OK-1"); // 00:00 on the 11th
    put("2026-11-11T02:00:00.000Z", ownerActor, "order-confirm", "OK-2");
    put("2026-11-11T03:00:00.000Z", iceActor, "sign-in");
    const day11 = audit.auditForDay("2026-11-11", { kind: "all" });
    check("a row lands on its Bangkok day (midnight edge)", day11.length === 3 && !day11.some((x: { action: string; orderNumber: string | null }) => x.action === "order-confirm" && x.orderNumber === "OK-1"));
    check("newest first", day11[0].action === "sign-in");
    check("filter by account", audit.auditForDay("2026-11-11", { kind: "account", id: ice.id }).length === 2);
    check("filter by the owner", audit.auditForDay("2026-11-11", { kind: "owner" }).length === 1);
    check("another admin's filter is empty", audit.auditForDay("2026-11-11", { kind: "account", id: prang.id }).length === 0);
    const counts = audit.auditCounts("2026-11-11");
    check("counts leave sign-ins out", counts.find((c: { kind: string }) => c.kind === "account")?.n === 1 && counts.find((c: { kind: string }) => c.kind === "owner")?.n === 1);
    const forOrder = audit.auditForOrder("OK-1");
    check("an order lists its own rows, oldest first", forOrder.length === 2 && forOrder[0].action === "order-confirm");
    const mine = audit.myCountsToday(iceActor, "2026-11-11");
    check("my counts today", mine["order-ship"] === 1 && mine["order-confirm"] === undefined);

    d.prepare("INSERT INTO customers (phone, display_name) VALUES ('0800000000', 'ทดสอบ')").run();
    d.prepare(
      "INSERT INTO orders (order_number, view_token, customer_id, status, subtotal, shipping_fee, total, payment_method, channel, keyed_by) VALUES ('OK-L1', 'v', 1, 'pending_payment', 100, 0, 100, 'promptpay', 'line', 'ICE')"
    ).run();
    audit.markKeyedBy("OK-L1", iceActor);
    audit.markKeyedBy("OK-L1", { kind: "shared", accountId: null, name: "รหัสร่วม" });
    check("a keyed LINE order points at its account; the shared password leaves it", (d.prepare("SELECT keyed_by_staff_id AS a FROM orders WHERE order_number = 'OK-L1'").get() as { a: number }).a === ice.id);

    let updated = false;
    try {
      audit.recordStaffAction(iceActor, "order-confirm", { orderNumber: "OK-9", detail: "x".repeat(400) });
      updated = (d.prepare("SELECT length(detail) AS n FROM staff_audit WHERE order_number = 'OK-9'").get() as { n: number }).n === 300;
    } catch {
      updated = false;
    }
    check("a long detail is cut at 300 characters", updated);
  } finally {
    try {
      (await load("src/lib/db/client.ts")).getDb().close();
    } catch {
      // already closed or never opened
    }
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

db()
  .catch((err) => {
    console.log(`FAIL  database part threw: ${err instanceof Error ? err.stack : String(err)}`);
    failed++;
  })
  .finally(() => {
    console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAILED`);
    process.exit(failed === 0 ? 0 : 1);
  });
