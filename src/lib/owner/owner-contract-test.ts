/**
 * Run: npx tsx src/lib/owner/owner-contract-test.ts
 * Who opens the owner's section, and that cost and profit stay inside it. Made-up addresses.
 */
import fs from "node:fs";
import path from "node:path";
import { checkIdToken } from "../members/id-token";
import { isOwnerIdentity } from "./identity";

let failed = 0;
function check(name: string, ok: boolean): void {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failed++;
}

const owner = "owner@example.com";
check("the owner's verified address passes", isOwnerIdentity({ email: owner, emailVerified: true }, owner));
check("case and spaces do not matter", isOwnerIdentity({ email: " Owner@Example.com", emailVerified: true }, "owner@example.COM "));
check("an unverified address fails", !isOwnerIdentity({ email: owner, emailVerified: false }, owner));
check("another address fails", !isOwnerIdentity({ email: "admin@example.com", emailVerified: true }, owner));
check("no address from Google fails", !isOwnerIdentity({ email: null, emailVerified: true }, owner));
check("no setting on the host fails, whoever signs in", !isOwnerIdentity({ email: owner, emailVerified: true }, null));

const b64 = (v: unknown) => Buffer.from(JSON.stringify(v)).toString("base64url");
const token = (payload: Record<string, unknown>) => `${b64({ alg: "RS256" })}.${b64(payload)}.sig`;
const base = { iss: "https://accounts.google.com", aud: "client", exp: 2_000_000_000, nonce: "n", sub: "s" };
const expect = { issuers: ["https://accounts.google.com"], audience: "client", nonce: "n", nowMs: 1_000_000_000_000 };
const withEmail = checkIdToken(token({ ...base, email: owner, email_verified: true }), expect);
check("an ID token with an address hands it on", withEmail.ok && withEmail.claims.email === owner && withEmail.claims.emailVerified);
const stringFlag = checkIdToken(token({ ...base, email: owner, email_verified: "true" }), expect);
check("a verified flag that is not literally true does not count", stringFlag.ok && !stringFlag.claims.emailVerified);
const member = checkIdToken(token(base), expect);
check("a member's token carries no address", member.ok && member.claims.email === null && !member.claims.emailVerified);

// The line between the team's side and the owner's: nothing under src/ outside the owner's own files may read cost.
const SRC = path.resolve(process.cwd(), "src");
const owned = (f: string) => f.includes(`${path.sep}owner${path.sep}`);
const walk = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : /\.tsx?$/.test(e.name) ? [p] : [];
  });
const leaks = walk(SRC).filter((f) => !owned(f) && /@\/lib\/owner\/(?!auth|identity)/.test(fs.readFileSync(f, "utf8")));
check("only the owner's files import cost and profit code", leaks.length === 0);
if (leaks.length) console.log(leaks.join("\n"));

console.log(failed === 0 ? "owner contract: PASS" : `owner contract: FAIL (${failed})`);
process.exit(failed === 0 ? 0 : 1);
