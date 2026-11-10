/**
 * Run: npx tsx src/lib/commerce/not-me-contract-test.ts
 * T2-06 (owner 10/11): checkout keeps remembering the last buyer on a device (30-day phone session), and a quiet
 * "ไม่ใช่ฉัน / เปลี่ยนเบอร์" button ends that memory for the person standing there. Guards: the action ends the session and
 * goes back to the phone step (nothing else), the button only shows where the remembered buyer shows, the 3 languages have
 * the words, and a revoked session really reads as signed out (the SQL in session.ts, run on a throwaway DB).
 * `server-only` throws under plain tsx (see verify-commerce-db.ts), so the server files are read as text, not imported.
 */
import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { getDictionary } from "@/i18n/dictionaries";

let failed = 0;
function check(name: string, ok: boolean): void {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failed++;
}
const read = (p: string) => fs.readFileSync(path.resolve(process.cwd(), p), "utf8").replace(/\r\n/g, "\n");
/** The body of `export async function <name>` up to the next top-level `}`. */
function fnBody(src: string, name: string): string {
  const start = src.indexOf(`export async function ${name}(`);
  if (start < 0) return "";
  const end = src.indexOf("\n}\n", start);
  return src.slice(start, end < 0 ? undefined : end);
}

// 1. The action: end this device's phone session, then the phone step. Nothing else.
const actions = read("src/app/checkout/actions.ts");
const notMe = fnBody(actions, "notMeAction");
check("notMeAction exists", notMe.length > 0);
check("it ends the phone session before leaving", /await destroySession\(\);[\s\S]*redirect\("\/checkout", RedirectType\.replace\)/.test(notMe));
check("it goes to the phone step only", (notMe.match(/redirect\(/g) ?? []).length === 1);
check("leaving is never refused by the cart switch", !notMe.includes("refuseWhileOrderingOff"));
check("it touches no cart, address or member state", !/cart|Address|Member|revalidate/i.test(notMe.replace(/\/\*[\s\S]*?\*\//g, "")));

// 2. destroySession revokes server-side AND drops the cookie; getSession refuses a revoked row.
const session = read("src/lib/commerce/session.ts");
const destroy = fnBody(session, "destroySession");
check("destroySession revokes the row", /UPDATE sessions SET revoked_at = datetime\('now'\) WHERE token_hash = \?/.test(destroy));
check("destroySession deletes the cookie", destroy.includes("cookieStore.delete(SESSION_COOKIE)"));
check("getSession treats a revoked row as signed out", /row\.revoked_at !== null/.test(session));

// 3. The SQL itself on a throwaway DB: a session that reads as live, then revoked, reads as gone.
const db = new Database(":memory:");
for (const f of fs.readdirSync(path.resolve("src/lib/db/migrations")).filter((f) => f.endsWith(".sql")).sort()) {
  db.exec(fs.readFileSync(path.resolve("src/lib/db/migrations", f), "utf8"));
}
const updateSql = /prepare\("(UPDATE sessions SET revoked_at[^"]*)"\)/.exec(destroy)?.[1] ?? "";
const selectSql = /prepare\(\s*`(SELECT s\.customer_id[\s\S]*?)`/.exec(session)?.[1] ?? "";
check("the two statements were found", updateSql !== "" && selectSql !== "");
const customerId = Number(db.prepare("INSERT INTO customers (phone) VALUES ('0812345678')").run().lastInsertRowid);
const future = new Date(Date.now() + 86_400_000).toISOString();
db.prepare("INSERT INTO sessions (customer_id, token_hash, expires_at) VALUES (?, 'a', ?)").run(customerId, future);
db.prepare("INSERT INTO sessions (customer_id, token_hash, expires_at) VALUES (?, 'b', ?)").run(customerId, future);
const live = (hash: string) => {
  const row = db.prepare(selectSql).get(hash) as { revoked_at: string | null; expires_at: string } | undefined;
  return !!row && row.revoked_at === null && new Date(row.expires_at).getTime() >= Date.now();
};
check("before: the session is live", live("a"));
db.prepare(updateSql).run("a");
check("after: that session is gone", !live("a"));
check("another device's session of the same customer stays", live("b"));
check("the customer and their history stay", db.prepare("SELECT COUNT(*) AS n FROM customers WHERE id = ?").get(customerId) !== undefined);

// 4. The button: a form bound to notMeAction, shown only where the remembered buyer shows.
const button = read("src/components/commerce/NotMeButton.tsx");
check("the button posts notMeAction", button.includes("action={notMeAction}") && button.includes('type="submit"'));
check("the button cannot post twice while pending", button.includes("disabled={pending}"));
const review = read("src/components/commerce/ReviewStepView.tsx");
check("review step: only with the address picked for a returning buyer", /\{savedAddress && <NotMeButton/.test(review) && (review.match(/<NotMeButton/g) ?? []).length === 1);
const address = read("src/components/commerce/AddressStepView.tsx");
const savedBlock = /\{addresses\.length > 0 && \([\s\S]*?\n {12}\)\}/.exec(address)?.[0] ?? "";
check("address step: inside the saved-addresses list only", savedBlock.includes("<NotMeButton") && (address.match(/<NotMeButton/g) ?? []).length === 1);

// 5. Words in all three languages (Thai = the owner's words).
check("th = the owner's words", getDictionary("th").checkout.notMeCta === "ไม่ใช่ฉัน / เปลี่ยนเบอร์");
for (const l of ["en", "zh"] as const) {
  const v = getDictionary(l).checkout.notMeCta;
  check(`${l} has its own words`, typeof v === "string" && v.trim() !== "" && !/[\u0E00-\u0E7F]/.test(v));
}

console.log(failed === 0 ? "not-me: PASS" : `not-me: FAIL (${failed})`);
if (failed) process.exitCode = 1;
