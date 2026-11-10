/**
 * OKami24 — the back office's door, as a lock (outside tester Test 2: T2-16 + T2-52). Reads the source, so a new staff page,
 * route or Server Action that forgets the check fails here before it ships.
 *
 *   T2-16  staff rights come from the server session only: the readable `okami24_team` marker cookie (src/lib/staff/
 *          team-marker.ts) only shows the "ทีมงาน" shortcut in the browser — no server file may read it.
 *   T2-52  every page under /staff sends a visitor without a session away (or answers the sign-in form at /staff itself),
 *          every staff API route answers 404 without one, and every exported Server Action checks the session itself as its
 *          first step — a Server Action can be called without opening its page, so the page's check does not cover it.
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */
import fs from "node:fs";
import path from "node:path";

const results: { name: string; ok: boolean; detail?: string }[] = [];
const check = (name: string, ok: boolean, detail?: unknown) => results.push({ name, ok, detail: ok ? undefined : JSON.stringify(detail) });

const ROOT = process.cwd();
const rel = (f: string) => path.relative(ROOT, f).split(path.sep).join("/");
function walk(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(e.name)) out.push(p);
  }
  return out;
}
const src = walk(path.join(ROOT, "src")).filter((f) => !f.endsWith("-contract-test.ts"));
const text = new Map(src.map((f) => [rel(f), fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n")]));

/** The calls that prove who is asking — each reads the server-side session (src/lib/staff/auth.ts · src/lib/owner/auth.ts). */
const GATE = /\b(actorOrBack|guard|currentStaff|isStaff|isOwner|requireOwner|staffOk)\(/;

// --- T2-16: the marker cookie ---
const marker = [...text].filter(([, t]) => /TEAM_MARKER_COOKIE|okami24_team/.test(t)).map(([f]) => f);
const allowed = ["src/lib/staff/team-marker.ts", "src/lib/staff/auth.ts", "src/components/layout/TeamShortcut.tsx"];
check("the team marker cookie appears only where it is set, cleared and shown", marker.every((f) => allowed.includes(f)), marker);
const authSrc = text.get("src/lib/staff/auth.ts") ?? "";
const markerUses = authSrc.split("\n").filter((l) => l.includes("TEAM_MARKER_COOKIE") && !l.includes("import "));
check("the staff sign-in only sets and clears the marker, never reads it", markerUses.length > 0 && markerUses.every((l) => /\.(set|delete)\(/.test(l)), markerUses);
check("TeamShortcut is a browser part that only links to /staff", /^"use client"/.test(text.get("src/components/layout/TeamShortcut.tsx") ?? "") && !/@\/lib\/staff\/(auth|orders|accounts)/.test(text.get("src/components/layout/TeamShortcut.tsx") ?? ""));
check("the staff session is read from okami24_staff only", /const COOKIE = "okami24_staff"/.test(authSrc) && /store\.get\(COOKIE\)/.test(authSrc) && !/store\.get\(TEAM_MARKER_COOKIE\)/.test(authSrc));

// --- T2-52: Server Actions ---
const serverFiles = [...text].filter(([f, t]) => /^\s*["']use server["']/.test(t) && (f.startsWith("src/app/staff/") || /@\/lib\/(staff|owner)\//.test(t)));
check("staff Server Action files are found", serverFiles.length >= 5, serverFiles.map(([f]) => f));
/** Sign-in / sign-out: the door itself, open on purpose (sign-out only ends the caller's own session). */
const OPEN = new Set(["staffLoginAction", "staffLogoutAction", "ownerLogoutAction"]);
const ungated: string[] = [];
let actions = 0;
const seen = new Set<string>();
for (const [f, t] of serverFiles) {
  const re = /^export async function (\w+)\([^]*?\{\n([^]*?)\n\}/gm;
  for (let m = re.exec(t); m; m = re.exec(t)) {
    actions++;
    seen.add(m[1]);
    if (OPEN.has(m[1])) continue;
    // The first statement that is not a comment or blank must ask who is calling.
    const first = m[2].split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("//") && !l.startsWith("/*") && !l.startsWith("*"))[0] ?? "";
    if (!GATE.test(first)) ungated.push(`${f} ${m[1]}: ${first.slice(0, 90)}`);
  }
}
check("Server Actions counted", actions >= 20, actions);
const KNOWN = ["staffOrderAction", "createLineOrderAction", "setSwitchAction", "addAdminAction", "matchRefundAction", "changeAddressAction"];
check("the scanner sees known actions (so the lock cannot pass by finding nothing)", KNOWN.every((n) => seen.has(n)), [...seen]);
check("every staff Server Action checks the session as its first step", ungated.length === 0, ungated);
for (const [f, t] of serverFiles) {
  if (!/\bguard\(/.test(t)) continue;
  check(`${f}: its guard() reads the session`, /async function guard\(\)[^]*?currentStaff\(\)[^]*?redirect\(/.test(t));
}
for (const [f, t] of serverFiles) {
  if (!/\bactorOrBack\(/.test(t)) continue;
  check(`${f}: actorOrBack() reads the session`, /async function actorOrBack\(\)[^]*?currentStaff\(\)[^]*?redirect\(/.test(t) || /import \{[^}]*actorOrBack/.test(t));
}

// --- T2-52: pages and API routes ---
const pages = [...text].filter(([f]) => f.startsWith("src/app/staff/") && f.endsWith("/page.tsx"));
const unguardedPages = pages
  .filter(([f, t]) => {
    if (f === "src/app/staff/page.tsx") return !/if \(!actor\) \{[^]*?StaffLogin/.test(t); // the sign-in form itself
    if (f === "src/app/staff/owner/page.tsx") return !/if \(!\(await isOwner\(\)\)\) \{[^]*?\/api\/auth\/owner/.test(t); // the owner's sign-in
    return !(/if \(!(\(await (isStaff|isOwner)\(\)\)|me|actor)\) (redirect|notFound|return)/.test(t) || /await requireOwner\(\)/.test(t));
  })
  .map(([f]) => f);
check("staff pages are found", pages.length >= 10, pages.length);
check("every staff page turns a visitor without a session away (or shows the sign-in at /staff)", unguardedPages.length === 0, unguardedPages);

const routes = [...text].filter(([f]) => f.startsWith("src/app/staff/") && f.endsWith("/route.ts"));
const unguardedRoutes: string[] = [];
for (const [f, t] of routes) {
  const re = /^export async function (GET|POST|PUT|PATCH|DELETE)\([^]*?\{\n([^]*?)\n\}/gm;
  for (let m = re.exec(t); m; m = re.exec(t)) {
    const head = m[2].split("\n").slice(0, 3).join("\n");
    if (!GATE.test(head) || !/status: 40[34]/.test(m[2])) unguardedRoutes.push(`${f} ${m[1]}`);
  }
}
check("staff API routes are found", routes.length >= 4, routes.length);
check("every staff API route answers 404 without a session, before anything else", unguardedRoutes.length === 0, unguardedRoutes);

for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `\n      ${r.detail}` : ""}`);
const failed = results.filter((r) => !r.ok);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
