/**
 * Run: npx tsx src/lib/commerce/address-owner-contract-test.ts
 * T2-03 + T2-15 (owner approved the plan 11/11: "อนุมัติ"): saved addresses belong to a signed-in member, not to a phone.
 * Against throwaway SQLite files in the OS temp folder (never `.data/`), with the real migrations. Made-up names and phones.
 *
 * Proves: migration 0030 attaches an old address only on a unique member match (same phone, exact shipping address of an order
 * placed while signed in) and hides the rest without deleting them · a phone-only session lists nothing, even when the phone
 * has a member's addresses · a phone-only session may use only what it typed itself · a member lists, uses and edits only
 * their own · no foreign id passes any scope (T2-15).
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { editScope, listScope, newRowOwner, orderScope, type AddressViewer, type Scope } from "./address-owner";

const req = createRequire(path.join(process.cwd(), "package.json"));
const Database = req("better-sqlite3") as new (file: string) => {
  exec(sql: string): void;
  prepare(sql: string): { run(...a: unknown[]): { lastInsertRowid: number | bigint }; get(...a: unknown[]): unknown; all(...a: unknown[]): unknown[] };
  close(): void;
};

const results: { name: string; ok: boolean; detail?: string }[] = [];
const check = (name: string, ok: boolean, detail?: unknown) => results.push({ name, ok, detail: ok ? undefined : JSON.stringify(detail) });

const MIGRATIONS = path.join(process.cwd(), "src", "lib", "db", "migrations");
const files = fs.readdirSync(MIGRATIONS).filter((f) => f.endsWith(".sql")).sort();
const OWNER_FILE = "0030_address_owner.sql";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "okami24-address-owner-test-"));
try {
  const db = new Database(path.join(dir, "t.db"));
  db.exec("PRAGMA foreign_keys = ON");
  // Every migration before 0030, then old-style rows, then 0030 itself — the backfill on data that existed before it.
  for (const f of files.filter((f) => f < OWNER_FILE)) db.exec(fs.readFileSync(path.join(MIGRATIONS, f), "utf8"));

  const id = (r: { lastInsertRowid: number | bigint }) => Number(r.lastInsertRowid);
  const customer = (phone: string) => id(db.prepare("INSERT INTO customers (phone) VALUES (?)").run(phone));
  const member = () => id(db.prepare("INSERT INTO members (display_name) VALUES ('ทดสอบ')").run());
  const A = { name: "สมชาย ทดสอบ", phone: "0811111111", line1: "1/1", sub: "ตลาดใหญ่", dist: "เมืองภูเก็ต", prov: "ภูเก็ต", post: "83000" };
  const B = { ...A, line1: "2/2" };
  const C = { ...A, line1: "3/3" };
  const address = (cust: number, a: typeof A) =>
    id(
      db
        .prepare("INSERT INTO addresses (customer_id, recipient_name, phone, line1, subdistrict, district, province, postal_code) VALUES (?,?,?,?,?,?,?,?)")
        .run(cust, a.name, a.phone, a.line1, a.sub, a.dist, a.prov, a.post)
    );
  let n = 0;
  const order = (cust: number, memberId: number | null, a: typeof A) => {
    n++;
    const o = id(
      db
        .prepare("INSERT INTO orders (order_number, view_token, customer_id, member_id, status, subtotal, shipping_fee, total) VALUES (?, ?, ?, ?, 'pending_payment', 100, 0, 100)")
        .run(`OK-T-${n}`, `tok-${n}`, cust, memberId)
    );
    db.prepare("INSERT INTO order_shipping_addresses VALUES (?,?,?,?,?,?,?,?)").run(o, a.name, a.phone, a.line1, a.sub, a.dist, a.prov, a.post);
  };

  const phone1 = customer("0811111111");
  const phone2 = customer("0822222222");
  const m1 = member();
  const m2 = member();
  const unique = address(phone1, A); // ordered by m1 only → m1
  const shared = address(phone1, B); // ordered by m1 AND m2 → hidden
  const noOrder = address(phone1, C); // never ordered while signed in → hidden
  const otherPhone = address(phone2, A); // m1's order was on phone1, not phone2 → hidden
  order(phone1, m1, A);
  order(phone1, m1, A);
  order(phone1, m1, B);
  order(phone1, m2, B);
  order(phone1, null, C); // a guest order never attaches
  order(phone2, null, A);

  db.exec(fs.readFileSync(path.join(MIGRATIONS, OWNER_FILE), "utf8"));
  const ownerOf = (a: number) => (db.prepare("SELECT member_id FROM addresses WHERE id = ?").get(a) as { member_id: number | null }).member_id;
  check("backfill: one member's exact order address → that member", ownerOf(unique) === m1, ownerOf(unique));
  check("backfill: two members on the same address → hidden", ownerOf(shared) === null, ownerOf(shared));
  check("backfill: no signed-in order → hidden", ownerOf(noOrder) === null, ownerOf(noOrder));
  check("backfill: another phone's row is not attached by this phone's order", ownerOf(otherPhone) === null, ownerOf(otherPhone));
  check("backfill: nothing deleted", (db.prepare("SELECT COUNT(*) AS n FROM addresses").get() as { n: number }).n === 4);

  // The scopes, run as the real WHERE clauses.
  const ids = (scope: Scope | null) =>
    scope ? (db.prepare(`SELECT id FROM addresses WHERE ${scope.sql} ORDER BY id`).all(...scope.args) as { id: number }[]).map((r) => r.id) : [];
  const can = (scope: Scope | null, addressId: number) =>
    scope !== null && db.prepare(`SELECT 1 FROM addresses WHERE id = ? AND ${scope.sql}`).get(addressId, ...scope.args) !== undefined;
  const session = (cust: number) =>
    id(db.prepare("INSERT INTO sessions (customer_id, token_hash, expires_at) VALUES (?, ?, '2099-01-01')").run(cust, `h-${Math.random()}`));

  // Someone types phone1 at checkout (no sign-in): a new phone session on the customer that has m1's address.
  const stranger: AddressViewer = { sessionId: session(phone1), memberId: null };
  check("phone-only: lists nothing, even on a phone with a member's address", listScope(stranger) === null && ids(listScope(stranger)).length === 0);
  check("phone-only: cannot use the member's address by id (T2-15)", !can(orderScope(stranger), unique));
  check("phone-only: cannot use a hidden old row by id", !can(orderScope(stranger), noOrder) && !can(orderScope(stranger), shared));
  check("phone-only: cannot edit or delete anything", editScope(stranger) === null);

  // What that session types itself: usable for its own order, by that session only.
  const own = newRowOwner(stranger);
  const typed = id(
    db
      .prepare("INSERT INTO addresses (customer_id, member_id, session_id, recipient_name, phone, line1, subdistrict, district, province, postal_code) VALUES (?,?,?,?,?,?,?,?,?,?)")
      .run(phone1, own.memberId, own.sessionId, A.name, A.phone, "9/9", A.sub, A.dist, A.prov, A.post)
  );
  check("phone-only: the row it typed has no member", ownerOf(typed) === null);
  check("phone-only: may use what it typed", can(orderScope(stranger), typed));
  check("phone-only: still lists nothing after typing", ids(listScope(stranger)).length === 0);
  const nextVisitor: AddressViewer = { sessionId: session(phone1), memberId: null };
  check("another phone session on the same number cannot use it", !can(orderScope(nextVisitor), typed));
  const m2Visitor: AddressViewer = { sessionId: session(phone1), memberId: m2 };
  check("a member who signs in later on another session does not get it", !can(orderScope(m2Visitor), typed) && !ids(listScope(m2Visitor)).includes(typed));

  // The member, signed in (any phone session).
  const owner: AddressViewer = { sessionId: session(phone2), memberId: m1 };
  check("member: lists their own only", JSON.stringify(ids(listScope(owner))) === JSON.stringify([unique]), ids(listScope(owner)));
  check("member: uses and edits their own", can(orderScope(owner), unique) && can(editScope(owner), unique));
  check("member: cannot use or edit another member's or a hidden row (T2-15)", ![shared, noOrder, otherPhone, typed].some((a) => can(orderScope(owner), a) || can(editScope(owner), a)));
  check("member: a row typed now is theirs", newRowOwner(owner).memberId === m1);
  const sameSession: AddressViewer = { sessionId: stranger.sessionId, memberId: m1 };
  check("member signed in on the session that typed a row may still use it for that order (not list it)", can(orderScope(sameSession), typed) && !ids(listScope(sameSession)).includes(typed));
  check("member m2 (other) lists nothing of m1's", !ids(listScope(m2Visitor)).includes(unique));
  check("a bad id matches nothing", !can(orderScope(owner), 999999) && !can(orderScope(stranger), -1));
  db.close();
} finally {
  fs.rmSync(dir, { recursive: true, force: true });
}

for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `\n      ${r.detail}` : ""}`);
const failed = results.filter((r) => !r.ok);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
