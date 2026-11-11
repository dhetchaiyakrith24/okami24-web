/**
 * Run: npx tsx src/lib/staff/staff-auth-contract-test.ts
 * The three gaps the checker named on #1360 (per-admin accounts, owner 10/11), against the real sign-in code and a throwaway
 * SQLite in the OS temp folder (never `.data/`). Next's request helpers are stood in for: a cookie jar per "phone", a redirect
 * that throws like Next's, and a Google answer chosen per case — nothing leaves this machine.
 *  1. The owner's switch "ปิดรหัสร่วม": the password stops working, every session it opened ends, and switching it on again
 *     does not bring those sessions back.
 *  2. Every action on /staff/owner/team is the owner's only — no owner session (or only an admin's) = nothing changes.
 *  3. A crafted sign-in cookie (the purpose is unsigned on purpose) never gives the team's or the owner's rights: only who
 *     Google says signed in decides.
 * Made-up addresses and a made-up password only.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const req = createRequire(path.join(process.cwd(), "package.json"));
const stub = (id: string, exports: unknown) => {
  req.cache[req.resolve(id)] = { id, filename: id, loaded: true, exports } as never;
};

// --- Stand-ins for the Next request ---
type Jar = Map<string, string>;
let jar: Jar = new Map();
const store = () => ({
  get: (name: string) => (jar.has(name) ? { name, value: jar.get(name)! } : undefined),
  set: (name: string, value: string) => void jar.set(name, value),
  delete: (o: string | { name: string }) => void jar.delete(typeof o === "string" ? o : o.name),
});
class Redirect extends Error {
  constructor(public to: string) {
    super(`NEXT_REDIRECT ${to}`);
  }
}
stub("server-only", {});
stub("next/headers", { cookies: async () => store(), headers: async () => new Headers({ "x-real-ip": "203.0.113.9" }) });
stub("next/navigation", {
  redirect: (to: string) => {
    throw new Redirect(to);
  },
  notFound: () => {
    throw new Redirect("404");
  },
});
stub("next/cache", { revalidatePath: () => undefined, revalidateTag: () => undefined });

let failed = 0;
function check(name: string, ok: boolean, detail?: unknown): void {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || detail === undefined ? "" : `  ${JSON.stringify(detail)}`}`);
  if (!ok) failed++;
}
const load = (rel: string) => import(pathToFileURL(path.join(process.cwd(), rel)).href);
async function redirected(run: () => Promise<unknown>): Promise<string | null> {
  try {
    await run();
    return null;
  } catch (err) {
    if (err instanceof Redirect) return err.to;
    throw err;
  }
}
const form = (fields: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(fields)) f.set(k, v);
  return f;
};

// --- 2 (static half): every exported action of the owner's team page starts with the owner check ---
{
  const src = fs.readFileSync(path.join(process.cwd(), "src/app/staff/owner/team/actions.ts"), "utf8");
  const actions = [...src.matchAll(/export async function (\w+)\([^)]*\)[^{]*\{\s*\n\s*(.+)/g)];
  check("the team page has its actions", actions.length >= 5, actions.length);
  for (const [, name, firstLine] of actions) {
    check(`${name}: the owner check is its first line`, /^if \(!\(await isOwner\(\)\)\)/.test(firstLine.trim()), firstLine.trim());
  }
}

async function main(): Promise<void> {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "okami24-staff-auth-test-"));
  Object.assign(process.env, {
    OKAMI24_DATA_DIR: dir,
    OKAMI24_STAFF_PASSWORD: "made-up-team-pass",
    OKAMI24_GOOGLE_CLIENT_ID: "test-client",
    OKAMI24_GOOGLE_CLIENT_SECRET: "test-secret",
    OKAMI24_OWNER_GOOGLE_EMAIL: "owner@example.com",
    OKAMI24_AUTH_ORIGIN: "https://shop.example",
  });
  // The Google answer: the real module, with the network step replaced by the claims each case names.
  let google: { sub: string; email: string | null; emailVerified: boolean; name: string | null } | null = null;
  const providersPath = req.resolve(path.join(process.cwd(), "src/lib/members/providers.ts"));
  const realProviders = req(providersPath);
  req.cache[providersPath]!.exports = {
    ...realProviders,
    finishSignIn: async () => (google ? { ok: true, claims: { ...google, nonce: "n" } } : { ok: false, reason: "no answer" }),
  };
  try {
    const { getDb } = await load("src/lib/db/client.ts");
    const auth = await load("src/lib/staff/auth.ts");
    const owner = await load("src/lib/owner/auth.ts");
    const accounts = await load("src/lib/staff/accounts.ts");
    const team = await load("src/app/staff/owner/team/actions.ts");
    const switches = await load("src/lib/commerce/shop-switches.ts");
    const d = getDb();
    const ice = accounts.addAccount("ICE", "admin1@example.com");

    // A phone signed in to the owner's section (the cookie a real Google sign-in leaves).
    const ownerJar: Jar = new Map();
    owner.createOwnerSession({ cookies: { set: (n: string, v: string) => void ownerJar.set(n, v) } });

    // --- 1. The shared password switch ---
    const phoneA: Jar = new Map();
    const phoneB: Jar = new Map();
    jar = phoneA;
    check("the shared password signs a phone in", (await auth.staffLogin("made-up-team-pass")).ok === true && jar.has("okami24_staff"));
    jar = phoneB;
    await auth.staffLogin("made-up-team-pass");
    check("…as รหัสร่วม", (await auth.currentStaff())?.kind === "shared");

    jar = ownerJar;
    check("the owner switches it off", (await redirected(() => team.setSharedPasswordAction(form({ value: "off" })))) === "/staff/owner/team");
    check("the switch is saved", switches.readSwitches().staffPasswordOff === true);
    jar = phoneA;
    check("off: a phone signed in with it is out at once", (await auth.currentStaff()) === null);
    jar = new Map();
    const tried = await auth.staffLogin("made-up-team-pass");
    check("off: the right password no longer signs in", tried.ok === false && !jar.has("okami24_staff"));
    check("off: those sessions are ended in the database", (d.prepare("SELECT COUNT(*) AS n FROM staff_sessions WHERE actor_kind = 'shared' AND revoked_at IS NULL").get() as { n: number }).n === 0);
    const offRow = d.prepare("SELECT actor_kind, actor_name, detail FROM staff_audit WHERE action = 'shared-password-off'").get() as { actor_kind: string; actor_name: string; detail: string } | undefined;
    check("off is recorded under the owner, with how many phones it ended", offRow?.actor_kind === "owner" && offRow.detail === "ออกจากระบบ 2 เครื่อง", offRow);

    jar = ownerJar;
    await redirected(() => team.setSharedPasswordAction(form({ value: "on" })));
    jar = phoneB;
    check("on again: an old session does not come back", (await auth.currentStaff()) === null);
    jar = new Map();
    check("on again: the password signs in afresh", (await auth.staffLogin("made-up-team-pass")).ok === true);

    // --- 1b. T2-14: wrong tries are limited and each one is recorded ---
    jar = new Map();
    const wrongs = [];
    for (let i = 0; i < 5; i++) wrongs.push(await auth.staffLogin("not-the-pass"));
    check("wrong password: refused, no session", wrongs.every((r) => !r.ok && r.reason === "wrong") && !jar.has("okami24_staff"));
    const locked = await auth.staffLogin("made-up-team-pass");
    check("after 5 wrong tries the right password is locked out too", !locked.ok && locked.reason === "locked" && (locked.retryMinutes ?? 0) >= 1);
    const failRows = d.prepare("SELECT actor_kind, actor_name, detail FROM staff_audit WHERE action = 'sign-in-failed' ORDER BY id").all() as { actor_kind: string; actor_name: string; detail: string }[];
    check("each wrong try is in ใครทำอะไร under รหัสร่วม", failRows.length === 5 && failRows.every((r) => r.actor_kind === "shared" && r.actor_name === "รหัสร่วม"), failRows);
    check("…counted per phone", failRows[4]?.detail === "ครั้งที่ 5 จาก 5 ของเครื่องนี้", failRows[4]);
    check("the lock is recorded", (d.prepare("SELECT COUNT(*) AS n FROM staff_audit WHERE action = 'sign-in-locked'").get() as { n: number }).n === 1);
    check("the records keep nothing about the visitor", failRows.every((r) => !/\d+\.\d+\.\d+\.\d+|[0-9a-f]{16}/.test(r.detail)));
    d.prepare("DELETE FROM staff_login_failures").run();

    // --- 2. The owner's actions, tried without the owner ---
    const adminJar: Jar = new Map();
    auth.finishStaffGoogleSignIn({ sub: "g-ice", email: "admin1@example.com", emailVerified: true }, { cookies: { set: (n: string, v: string) => void adminJar.set(n, v) } });
    const before = { list: JSON.stringify(accounts.listAccounts()), sw: JSON.stringify(switches.readSwitches()), sessions: (d.prepare("SELECT COUNT(*) AS n FROM staff_sessions").get() as { n: number }).n };
    for (const [who, phone] of [["no sign-in", new Map()], ["an admin's sign-in", adminJar]] as [string, Jar][]) {
      jar = phone;
      const added = await team.addAdminAction({ error: null }, form({ name: "Mallory", email: "mallory@example.com" }));
      check(`${who}: adding an admin is refused`, added.error !== null && !accounts.accountForSignIn("mallory@example.com"));
      check(`${who}: rename sends to the owner's sign-in`, (await redirected(() => team.renameAdminAction(form({ id: String(ice.id), name: "Hacked" })))) === "/staff/owner");
      check(`${who}: disable sends to the owner's sign-in`, (await redirected(() => team.setAdminActiveAction(form({ id: String(ice.id), value: "off" })))) === "/staff/owner");
      check(`${who}: the shared-password switch sends to the owner's sign-in`, (await redirected(() => team.setSharedPasswordAction(form({ value: "off" })))) === "/staff/owner");
      check(`${who}: "มุมแอดมิน" sends to the owner's sign-in`, (await redirected(() => team.ownerToAdminAction())) === "/staff/owner");
    }
    check("nothing changed: accounts, switches, sessions", JSON.stringify(accounts.listAccounts()) === before.list && JSON.stringify(switches.readSwitches()) === before.sw && (d.prepare("SELECT COUNT(*) AS n FROM staff_sessions").get() as { n: number }).n === before.sessions);
    jar = ownerJar;
    check("the owner's own sign-in can step into the admin view", (await redirected(() => team.ownerToAdminAction())) === "/staff" && (await auth.currentStaff())?.kind === "owner");

    // --- 3. Crafted sign-in cookies ---
    const { GET } = await load("src/app/api/auth/[provider]/callback/route.ts");
    const { NextRequest } = req("next/server") as typeof import("next/server");
    async function callback(provider: string, pending: Record<string, unknown>, state = "s1") {
      const cookie = Buffer.from(JSON.stringify({ provider, state: "s1", nonce: "n", verifier: "v", returnTo: "/account", ...pending })).toString("base64url");
      const request = new NextRequest(`https://shop.example/api/auth/${provider}/callback?code=c&state=${state}`, { headers: { cookie: `okami24_signin=${cookie}` } });
      const res = await GET(request, { params: Promise.resolve({ provider }) });
      const set = res.cookies.getAll().filter((c: { value: string }) => c.value !== "").map((c: { name: string }) => c.name);
      return { to: res.headers.get("location") ?? "", staff: set.includes("okami24_staff"), owner: set.includes("okami24_owner"), member: set.includes("okami24_member") };
    }
    const who = (email: string, emailVerified = true) => ({ sub: `g-${email}`, email, emailVerified, name: null });

    google = who("stranger@example.com");
    let r = await callback("google", { purpose: "staff" });
    check("staff purpose + an address not on the list: refused, no team cookie", r.to.endsWith("/staff?denied=1") && !r.staff && !r.owner);
    google = { ...who("admin1@example.com"), sub: "g-ice" };
    r = await callback("google", { purpose: "staff" });
    check("staff purpose + a listed admin: the team cookie only", r.to.endsWith("/staff") && r.staff && !r.owner);
    google = who("admin1@example.com", false);
    r = await callback("google", { purpose: "staff" });
    check("staff purpose + a listed address Google has not verified: refused", !r.staff && !r.owner);
    google = who("owner@example.com");
    r = await callback("google", { purpose: "staff" });
    check("staff purpose + the owner: both cookies (one sign-in)", r.staff && r.owner);
    google = { ...who("admin1@example.com"), sub: "g-ice" };
    r = await callback("google", { purpose: "owner" });
    check("a crafted owner purpose + an admin: refused, no cookie at all", r.to.endsWith("/staff/owner?denied=1") && !r.staff && !r.owner);
    r = await callback("google", { purpose: "root" });
    check("an unknown purpose reads as a member sign-in: no team or owner cookie", !r.staff && !r.owner && r.member);
    google = who("owner@example.com");
    r = await callback("line", { purpose: "staff" });
    check("staff purpose through LINE: refused (Google only)", r.to.endsWith("/staff?denied=1") && !r.staff && !r.owner);
    r = await callback("google", { purpose: "staff" }, "other-state");
    check("staff purpose with another state: refused", !r.staff && !r.owner);
  } finally {
    try {
      (await load("src/lib/db/client.ts")).getDb().close();
    } catch {
      // already closed or never opened
    }
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

main()
  .catch((err) => {
    console.log(`FAIL  threw: ${err instanceof Error ? err.stack : String(err)}`);
    failed++;
  })
  .finally(() => {
    console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAILED`);
    process.exit(failed === 0 ? 0 : 1);
  });
