/**
 * Contract tests for member sign-in ID-token checks and the return-path guard (queue Q4, owner 26/10) — pure, plain `tsx`.
 */
import crypto from "node:crypto";
import { checkIdToken, safeReturnPath } from "./id-token";

function token(payload: Record<string, unknown>, secret: string | null, alg = "HS256"): string {
  const h = Buffer.from(JSON.stringify({ alg, typ: "JWT" })).toString("base64url");
  const p = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = secret === null ? "c2ln" : crypto.createHmac("sha256", secret).update(`${h}.${p}`).digest("base64url");
  return `${h}.${p}.${sig}`;
}

export function runIdTokenContractTests(): { name: string; passed: boolean; detail: string }[] {
  const results: { name: string; passed: boolean; detail: string }[] = [];
  const check = (name: string, condition: boolean, detail = "") => results.push({ name, passed: condition, detail });

  const now = 1_800_000_000_000;
  const good = { iss: "https://access.line.me", aud: "123", sub: "Uabc", name: "ลูกค้า", nonce: "n1", exp: now / 1000 + 600 };
  const line = { issuers: ["https://access.line.me"], audience: "123", nonce: "n1", hmacSecret: "s3cret", nowMs: now };

  const ok = checkIdToken(token(good, "s3cret"), line);
  check("LINE token with the right secret, aud, nonce → sub + name", ok.ok && ok.claims.sub === "Uabc" && ok.claims.name === "ลูกค้า");
  const bad = (t: string, reason: string, label: string, exp = line) => {
    const r = checkIdToken(t, exp);
    check(label, !r.ok && r.reason === reason, JSON.stringify(r));
  };
  bad(token(good, "other"), "signature", "LINE token signed with another secret → refused");
  bad(token(good, "s3cret", "none"), "alg", "alg none → refused");
  bad(token({ ...good, aud: "999" }, "s3cret"), "aud", "another channel's token → refused");
  bad(token({ ...good, nonce: "n2" }, "s3cret"), "nonce", "nonce we did not send → refused");
  bad(token({ ...good, exp: now / 1000 - 3600 }, "s3cret"), "exp", "expired an hour ago → refused");
  bad(token({ ...good, iss: "https://evil.example" }, "s3cret"), "iss", "wrong issuer → refused");
  bad("a.b", "shape", "not three parts → refused");

  const google = { issuers: ["https://accounts.google.com", "accounts.google.com"], audience: "g.apps", nonce: "n1", nowMs: now };
  const g = checkIdToken(token({ ...good, iss: "accounts.google.com", aud: "g.apps", name: undefined }, null, "RS256"), google);
  check("Google token (TLS-trusted, no HMAC) → sub, name null when absent", g.ok && g.claims.sub === "Uabc" && g.claims.name === null);

  check("return path: same-site path kept", safeReturnPath("/orders") === "/orders");
  check(
    "return path: //host, full URL, backslash, empty → /account",
    ["//evil.com", "https://evil.com", "/\\evil.com", "", null].every((v) => safeReturnPath(v) === "/account"),
  );
  return results;
}

if (require.main === module) {
  const results = runIdTokenContractTests();
  const failed = results.filter((r) => !r.passed);
  for (const r of results) console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.detail && !r.passed ? `\n      ${r.detail}` : ""}`);
  if (failed.length > 0) {
    console.error(`\n${failed.length} of ${results.length} checks failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} checks passed.`);
}
