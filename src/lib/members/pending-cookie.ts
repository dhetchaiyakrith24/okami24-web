import "server-only";
import type { NextResponse } from "next/server";
import { isMemberProvider, type PendingSignIn } from "./providers";

/**
 * The sign-in round trip's state (state, nonce, PKCE verifier, where to go back) rides in one httpOnly cookie, scoped to
 * /api/auth and alive 10 minutes. No server table and no signing key: the callback only accepts a `state` equal to the one
 * in this browser's own cookie, which is what stops a forged callback (CSRF); the verifier never leaves this browser and
 * our server.
 */
export const PENDING_COOKIE = "okami24_signin";
const PENDING_TTL_S = 10 * 60;

export function setPendingCookie(response: NextResponse, pending: PendingSignIn): void {
  response.cookies.set(PENDING_COOKIE, Buffer.from(JSON.stringify(pending)).toString("base64url"), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: PENDING_TTL_S,
    path: "/api/auth",
  });
}

export function clearPendingCookie(response: NextResponse): void {
  response.cookies.set(PENDING_COOKIE, "", { path: "/api/auth", maxAge: 0 });
}

export function readPendingCookie(raw: string | undefined): PendingSignIn | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as Partial<PendingSignIn>;
    if (
      typeof v.provider !== "string" ||
      !isMemberProvider(v.provider) ||
      typeof v.state !== "string" ||
      typeof v.nonce !== "string" ||
      typeof v.verifier !== "string" ||
      typeof v.returnTo !== "string"
    ) {
      return null;
    }
    return { provider: v.provider, state: v.state, nonce: v.nonce, verifier: v.verifier, returnTo: v.returnTo };
  } catch {
    return null;
  }
}
