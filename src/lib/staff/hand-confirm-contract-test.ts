/**
 * Run: npx tsx src/lib/staff/hand-confirm-contract-test.ts
 * T2-01 (owner 10/11): "ยืนยันยอดเงินแล้ว" is never blocked, but an order confirmed without a slip that passed the check is marked
 * with who pressed it. Proves the rule, that the history notes it reads are the ones the code writes, that it only reads,
 * and — against a throwaway SQLite in the OS temp folder, never `.data/` — each kind on real rows. Made-up names only.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { CONFIRM_NOTE_PREFIX, DIFFERENCE_BY_HAND_NOTE, handConfirmKind, handConfirmLabel, pressedBy } from "./hand-confirm-rules";
import { STAFF_ACTIONS } from "./order-actions";

const req = createRequire(path.join(process.cwd(), "package.json"));
req.cache[req.resolve("server-only")] = { exports: {} } as never;

let failed = 0;
function check(name: string, ok: boolean, detail?: unknown): void {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || detail === undefined ? "" : `  ${JSON.stringify(detail)}`}`);
  if (!ok) failed++;
}
const load = (rel: string) => import(pathToFileURL(path.join(process.cwd(), rel)).href);
const read = (rel: string) => fs.readFileSync(path.join(process.cwd(), rel), "utf8");

// --- The rule ---
const slip = (verdict: string | null, hasSlip = true) => ({ verdict, hasSlip });
check("a passed slip = no mark", handConfirmKind({ staffConfirmed: true, submissions: [slip("check"), slip("pass")], differenceByHand: false }) === null);
check("confirmed on a slip that did not pass", handConfirmKind({ staffConfirmed: true, submissions: [slip("check")], differenceByHand: false }) === "slip-check");
check("confirmed while EasySlip could not check", handConfirmKind({ staffConfirmed: true, submissions: [slip("unchecked")], differenceByHand: false }) === "slip-unchecked");
check("confirmed with no slip at all", handConfirmKind({ staffConfirmed: true, submissions: [], differenceByHand: false }) === "no-slip" && handConfirmKind({ staffConfirmed: true, submissions: [slip("unchecked", false)], differenceByHand: false }) === "no-slip");
check("not confirmed by staff = no mark", handConfirmKind({ staffConfirmed: false, submissions: [slip("check")], differenceByHand: false }) === null);
check("a difference confirmed by hand is marked even after a passed slip", handConfirmKind({ staffConfirmed: true, submissions: [slip("pass")], differenceByHand: true }) === "difference-by-hand");
check("labels are Thai and name the reason", handConfirmLabel("slip-check") === "ยืนยันเงินเอง · สลิปไม่ผ่านการตรวจ" && pressedBy("ICE") === "กดโดย ICE" && pressedBy(null).startsWith("ไม่รู้ว่าใครกด"));

// --- The notes it reads are the ones the code writes; it never writes ---
check("the confirm button still writes \"Staff: confirm\" on the approved row", read("src/lib/staff/orders.ts").includes("`${who}: ${action}`") && "confirm" in STAFF_ACTIONS && CONFIRM_NOTE_PREFIX === "Staff: confirm");
check("the LINE item edit still writes the hand-confirm words", read("src/lib/staff/line-order-edit.ts").includes(`"${DIFFERENCE_BY_HAND_NOTE}"`));
check("the confirm button is not locked", !/disabled/.test(read("src/lib/staff/order-actions.ts").split("\n").find((l) => l.includes("confirm:")) ?? "x"));
check("the mark only reads (no INSERT / UPDATE / DELETE)", !/\b(INSERT|UPDATE|DELETE)\b/.test(read("src/lib/staff/hand-confirm.ts")));

// --- Database ---
async function db(): Promise<void> {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "okami24-hand-confirm-test-"));
  process.env.OKAMI24_DATA_DIR = dir;
  try {
    const { getDb } = await load("src/lib/db/client.ts");
    const { applyStaffAction } = await load("src/lib/staff/orders.ts");
    const { recordStaffAction } = await load("src/lib/staff/audit.ts");
    const { handConfirmForOrder, handConfirmedSince } = await load("src/lib/staff/hand-confirm.ts");
    const d = getDb();
    d.prepare("INSERT INTO customers (phone, display_name) VALUES ('0800000000', 'ทดสอบ')").run();
    const order = (n: string, channel = "web") =>
      d.prepare(
        "INSERT INTO orders (order_number, view_token, customer_id, status, subtotal, shipping_fee, total, payment_method, channel) VALUES (?, ?, 1, 'awaiting_verification', 500, 0, 500, 'promptpay', ?)"
      ).run(n, `v-${n}`, channel).lastInsertRowid as number;
    const submit = (id: number, verdict: string, ref: string | null) =>
      d.prepare("INSERT INTO order_payment_submissions (order_id, method, slip_trans_ref, slip_verdict) VALUES (?, 'bank_transfer', ?, ?)").run(id, ref, verdict);
    const ice = { kind: "account", accountId: null, name: "ICE" };
    const confirm = (n: string, by: typeof ice | null) => {
      const r = applyStaffAction(n, "confirm", {});
      if (by) recordStaffAction(by, "order-confirm", { orderNumber: n });
      return r.ok;
    };

    submit(order("OK-CHECK"), "check", "T1");
    check("confirm is not blocked on a slip that did not pass", confirm("OK-CHECK", ice));
    const a = handConfirmForOrder("OK-CHECK");
    check("…and the order is marked, with who pressed it", a?.kind === "slip-check" && a.by === "ICE", a);

    submit(order("OK-PASS"), "pass", "T2");
    confirm("OK-PASS", ice);
    check("a passed slip leaves no mark", handConfirmForOrder("OK-PASS") === null);

    submit(order("OK-LINE", "line"), "unchecked", null);
    confirm("OK-LINE", { kind: "shared", accountId: null, name: "รหัสร่วม" });
    const b = handConfirmForOrder("OK-LINE");
    check("a LINE order with no slip confirmed by the shared password", b?.kind === "no-slip" && b.by === "รหัสร่วม", b);

    submit(order("OK-OLD"), "unchecked", "T3");
    confirm("OK-OLD", null);
    const c = handConfirmForOrder("OK-OLD");
    check("before accounts: marked, the person unknown", c?.kind === "slip-unchecked" && c.by === null, c);

    order("OK-WAIT");
    check("an order still waiting is not marked", handConfirmForOrder("OK-WAIT") === null);

    const diffId = order("OK-DIFF", "line");
    submit(diffId, "pass", "T4");
    confirm("OK-DIFF", ice);
    d.prepare("INSERT INTO order_status_history (order_id, status, note) VALUES (?, 'approved', ?)").run(diffId, `Staff (ICE): items changed 500 → 650 THB — ${DIFFERENCE_BY_HAND_NOTE}`);
    recordStaffAction({ kind: "account", accountId: null, name: "Prang" }, "order-items", { orderNumber: "OK-DIFF" });
    const e = handConfirmForOrder("OK-DIFF");
    check("a difference confirmed by hand names who changed the items", e?.kind === "difference-by-hand" && e.by === "Prang", e);

    const totalBefore = (d.prepare("SELECT SUM(total) AS t FROM orders").get() as { t: number }).t;
    const list = handConfirmedSince("2000-01-01T00:00:00.000Z");
    check("the owner's list: the marked paid orders, newest first", JSON.stringify(list.map((o: { orderNumber: string }) => o.orderNumber)) === JSON.stringify(["OK-DIFF", "OK-OLD", "OK-LINE", "OK-CHECK"]), list.map((o: { orderNumber: string }) => o.orderNumber));
    check("reading the marks changes no total", (d.prepare("SELECT SUM(total) AS t FROM orders").get() as { t: number }).t === totalBefore);
    check("the list respects its window", handConfirmedSince("2999-01-01T00:00:00.000Z").length === 0);
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
