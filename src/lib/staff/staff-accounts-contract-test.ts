/**
 * Run: npx tsx src/lib/staff/staff-accounts-contract-test.ts
 * Per-admin accounts (owner 10/11): who a Google sign-in on /staff lets in, what the owner's "เพิ่มแอดมิน" form accepts, the
 * shared-password switch, and the database side against a throwaway SQLite in the OS temp folder (never `.data/`): the real
 * migrations, accounts added / renamed / disabled, a disabled account's sessions ended, the audit row naming its person.
 * Made-up addresses only.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { decideStaffSignIn, OWNER_NAME, parseNewAccount, type AccountForSignIn } from "./account-rules";
import { AUDIT_ACTIONS } from "./audit-rules";
import { ALL_OPEN, parseSwitches } from "../commerce/shop-switches-rules";

// `server-only` throws outside the Next server; this test is a server, so it gets the empty module it would get there.
const req = createRequire(path.join(process.cwd(), "package.json"));
req.cache[req.resolve("server-only")] = { exports: {} } as never;

let failed = 0;
function check(name: string, ok: boolean, detail?: unknown): void {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || detail === undefined ? "" : `  ${JSON.stringify(detail)}`}`);
  if (!ok) failed++;
}
const load = (rel: string) => import(pathToFileURL(path.join(process.cwd(), rel)).href);

// --- Sign-in decisions (pure) ---
const ownerAddr = (e: string) => e.trim().toLowerCase() === "owner@example.com";
const ice: AccountForSignIn = { id: 7, name: "ICE", active: true, googleSub: null };
const claims = (email: string | null, emailVerified = true, sub = "g-1") => ({ sub, email, emailVerified });

const first = decideStaffSignIn(claims("admin1@example.com"), ownerAddr, ice);
check("a listed, active admin gets in under their own name", first.ok && first.actor.kind === "account" && first.actor.accountId === 7 && first.actor.name === "ICE");
check("the first sign-in pins Google's id", first.ok && first.pinSub);
const pinned = { ...ice, googleSub: "g-1" };
const again = decideStaffSignIn(claims("admin1@example.com"), ownerAddr, pinned);
check("the same person again: in, nothing re-pinned", again.ok && !again.pinSub);
const swapped = decideStaffSignIn(claims("admin1@example.com", true, "g-other"), ownerAddr, pinned);
check("same address, another Google id: refused", !swapped.ok && swapped.reason === "other-google-id");
check("an unverified address: refused", !decideStaffSignIn(claims("admin1@example.com", false), ownerAddr, ice).ok);
check("no address from Google: refused", !decideStaffSignIn(claims(null), ownerAddr, ice).ok);
const stranger = decideStaffSignIn(claims("someone@example.com"), ownerAddr, null);
check("an address not on the list: refused", !stranger.ok && stranger.reason === "not-listed");
const off = decideStaffSignIn(claims("admin1@example.com"), ownerAddr, { ...ice, active: false });
check("a disabled account: refused", !off.ok && off.reason === "disabled");
const owner = decideStaffSignIn(claims("Owner@Example.com"), ownerAddr, null);
check("the owner's verified address: in as เจ้าของ", owner.ok && owner.actor.kind === "owner" && owner.actor.name === OWNER_NAME && owner.actor.accountId === null);
check("the owner's address unverified: refused", !decideStaffSignIn(claims("owner@example.com", false), ownerAddr, null).ok);

// --- The owner's form ---
const added = parseNewAccount("  ICE  ", " Admin1@Example.COM ");
check("name and address are trimmed, the address lower-cased", added.ok && added.name === "ICE" && added.email === "admin1@example.com");
check("an empty name is refused", !parseNewAccount("  ", "a@example.com").ok);
check("a name over 30 characters is refused", !parseNewAccount("x".repeat(31), "a@example.com").ok);
check("the owner's own label cannot be taken", !parseNewAccount(OWNER_NAME, "a@example.com").ok);
check("an address without a domain is refused", !parseNewAccount("ICE", "admin1@").ok);
check("an address with a space is refused", !parseNewAccount("ICE", "ad min@example.com").ok);

// --- The switch ---
check("no file: the shared password still works", ALL_OPEN.staffPasswordOff === false && parseSwitches(null).staffPasswordOff === false);
check("the switch reads back", parseSwitches(JSON.stringify({ staffPasswordOff: true })).staffPasswordOff === true);
check("anything but true reads as still open", parseSwitches(JSON.stringify({ staffPasswordOff: "yes" })).staffPasswordOff === false);
check("older switch files keep their other switches", parseSwitches(JSON.stringify({ cartOff: true })).cartOff === true);

// --- Audit words: every action the code records has one ---
const SRC = path.resolve(process.cwd(), "src");
const walk = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : /\.tsx?$/.test(e.name) ? [p] : [];
  });
const recorded = new Set<string>();
for (const file of walk(SRC)) {
  for (const m of fs.readFileSync(file, "utf8").matchAll(/recordStaffAction\([^,]+,\s*(?:[^"]*\?\s*)?"([a-z-]+)"(?:\s*:\s*"([a-z-]+)")?/g)) {
    recorded.add(m[1]);
    if (m[2]) recorded.add(m[2]);
  }
}
const missing = [...recorded].filter((a) => !(a in AUDIT_ACTIONS));
check(`every recorded action has its Thai words (${recorded.size} found)`, recorded.size > 0 && missing.length === 0, missing);

// --- Database side ---
async function db(): Promise<void> {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "okami24-staff-accounts-test-"));
  process.env.OKAMI24_DATA_DIR = dir;
  try {
    const { getDb } = await load("src/lib/db/client.ts");
    const accounts = await load("src/lib/staff/accounts.ts");
    const { recordStaffAction } = await load("src/lib/staff/audit.ts");
    const d = getDb();

    const a = accounts.addAccount("ICE", "Admin1@Example.com");
    check("an admin is added", a.ok);
    check("the same address twice is refused", accounts.addAccount("ICE 2", "admin1@example.com").error === "taken");
    const b = accounts.addAccount("Maprang", "admin2@example.com");
    check("a second admin is added", b.ok && accounts.listAccounts().length === 2);
    check("sign-in finds the account by any case of the address", accounts.accountForSignIn("ADMIN1@example.com")?.id === a.id);

    accounts.markSignedIn(a.id, "g-1", true);
    accounts.markSignedIn(a.id, "g-2", true);
    check("Google's id is pinned once and never overwritten", accounts.accountForSignIn("admin1@example.com")?.googleSub === "g-1");

    d.prepare("INSERT INTO staff_sessions (token_hash, password_tag, expires_at, actor_kind, account_id) VALUES ('t1', 'google', '2999-01-01T00:00:00Z', 'account', ?)").run(a.id);
    d.prepare("INSERT INTO staff_sessions (token_hash, password_tag, expires_at) VALUES ('t2', 'abc', '2999-01-01T00:00:00Z')").run();
    check("a session from before 0028 reads as the shared password", (d.prepare("SELECT actor_kind FROM staff_sessions WHERE token_hash = 't2'").get() as { actor_kind: string }).actor_kind === "shared");
    accounts.setAccountActive(a.id, false);
    const revoked = d.prepare("SELECT revoked_at FROM staff_sessions WHERE token_hash = 't1'").get() as { revoked_at: string | null };
    check("disabling an admin ends their open session", revoked.revoked_at !== null);
    check("disabling leaves other sessions alone", (d.prepare("SELECT revoked_at FROM staff_sessions WHERE token_hash = 't2'").get() as { revoked_at: string | null }).revoked_at === null);
    check("a disabled account is kept (history keeps the name)", accounts.listAccounts().some((x: { id: number; active: boolean }) => x.id === a.id && !x.active));
    accounts.renameAccount(b.id, "Prang");
    check("rename", accounts.accountForSignIn("admin2@example.com")?.name === "Prang");

    recordStaffAction({ kind: "account", accountId: b.id, name: "Prang" }, "sign-in", { detail: "Google" });
    const row = d.prepare("SELECT actor_kind, account_id, actor_name, action FROM staff_audit").get() as Record<string, unknown>;
    check("the audit row names its person and keeps the name of that moment", row.actor_kind === "account" && row.account_id === b.id && row.actor_name === "Prang" && row.action === "sign-in");
    let refused = false;
    try {
      d.prepare("INSERT INTO staff_audit (actor_kind, actor_name, action) VALUES ('nobody', 'x', 'y')").run();
    } catch {
      refused = true;
    }
    check("the audit table refuses an unknown kind of person", refused);
    check("orders can name the account that keyed them", (d.prepare("PRAGMA table_info(orders)").all() as { name: string }[]).some((c) => c.name === "keyed_by_account_id"));
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
