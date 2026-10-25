import crypto from "node:crypto";

/**
 * ID-token checks for member sign-in (queue Q4). Not `server-only` so the contract test can run it under plain `tsx`;
 * nothing here reads env or the database.
 *
 * Both providers hand the ID token straight back from their token endpoint over TLS, in exchange for the one-time code
 * and our client secret (OpenID Connect Core 3.1.3.7 item 6 allows trusting that channel instead of the signature).
 * LINE's token is HS256-signed with the channel secret, so its signature is checked too; Google's is RS256 and is
 * trusted on the TLS channel. For both: issuer, audience, expiry and the nonce we sent must match.
 */

export interface IdTokenClaims {
  sub: string;
  name: string | null;
}

export type IdTokenCheck = { ok: true; claims: IdTokenClaims } | { ok: false; reason: string };

function b64urlJson(part: string): Record<string, unknown> | null {
  try {
    return JSON.parse(Buffer.from(part, "base64url").toString("utf8")) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export interface IdTokenExpect {
  issuers: readonly string[];
  audience: string;
  nonce: string;
  /** HS256 key (LINE channel secret). Omitted = signature not checked (Google, trusted on the token endpoint's TLS). */
  hmacSecret?: string;
  nowMs?: number;
}

export function checkIdToken(idToken: string, expect: IdTokenExpect): IdTokenCheck {
  const parts = idToken.split(".");
  if (parts.length !== 3) return { ok: false, reason: "shape" };
  const header = b64urlJson(parts[0]);
  const payload = b64urlJson(parts[1]);
  if (!header || !payload) return { ok: false, reason: "decode" };

  if (expect.hmacSecret !== undefined) {
    if (header.alg !== "HS256") return { ok: false, reason: "alg" };
    const want = crypto.createHmac("sha256", expect.hmacSecret).update(`${parts[0]}.${parts[1]}`).digest();
    const got = Buffer.from(parts[2], "base64url");
    if (got.length !== want.length || !crypto.timingSafeEqual(got, want)) return { ok: false, reason: "signature" };
  }

  if (typeof payload.iss !== "string" || !expect.issuers.includes(payload.iss)) return { ok: false, reason: "iss" };
  const aud = payload.aud;
  const audOk = typeof aud === "string" ? aud === expect.audience : Array.isArray(aud) && aud.includes(expect.audience);
  if (!audOk) return { ok: false, reason: "aud" };
  const nowSec = Math.floor((expect.nowMs ?? Date.now()) / 1000);
  if (typeof payload.exp !== "number" || payload.exp + 60 < nowSec) return { ok: false, reason: "exp" };
  if (payload.nonce !== expect.nonce) return { ok: false, reason: "nonce" };
  if (typeof payload.sub !== "string" || payload.sub.length === 0) return { ok: false, reason: "sub" };

  return { ok: true, claims: { sub: payload.sub, name: typeof payload.name === "string" ? payload.name : null } };
}

/** Only same-site paths may be a "back to" target after sign-in — never `//host` or a full URL (open redirect). */
export function safeReturnPath(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return "/account";
  return raw.slice(0, 300);
}
