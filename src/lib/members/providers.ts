import "server-only";
import crypto from "node:crypto";
import { SITE_URL } from "@/lib/seo";
import { checkIdToken, type IdTokenClaims } from "./id-token";

/**
 * LINE Login + Google sign-in for members (queue Q4, owner 26/10: LINE + Google first, no Facebook).
 * Authorization-code flow with PKCE + state + nonce; scopes `openid profile` only — no email, no friends, no messages.
 *
 * Settings, read on the server only (set in the Render dashboard — docs/DEPLOY-RENDER.md; never in git):
 *
 *   OKAMI24_LINE_LOGIN_CHANNEL_ID / OKAMI24_LINE_LOGIN_CHANNEL_SECRET   the "LINE Login" channel (provider OKM24)
 *   OKAMI24_GOOGLE_CLIENT_ID / OKAMI24_GOOGLE_CLIENT_SECRET             the Google Cloud "Web application" client
 *   OKAMI24_AUTH_ORIGIN   optional — the origin the callback URL is built on. Unset = SITE_URL (the live site). Only for a
 *                         local test build, which cannot use SITE_URL=localhost (src/lib/seo.ts refuses it in production).
 *
 * A provider whose two values are missing is simply not offered: its button is hidden and its routes answer 404.
 */
export const MEMBER_PROVIDERS = ["line", "google"] as const;
export type MemberProvider = (typeof MEMBER_PROVIDERS)[number];

export function isMemberProvider(value: string): value is MemberProvider {
  return (MEMBER_PROVIDERS as readonly string[]).includes(value);
}

interface ProviderConfig {
  clientId: string;
  clientSecret: string;
  authorizeUrl: string;
  tokenUrl: string;
  issuers: readonly string[];
  /** LINE signs the ID token with the channel secret (HS256) — checked. Google's RS256 token is trusted on TLS. */
  hmacSigned: boolean;
  extraAuthorizeParams: Record<string, string>;
}

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

function providerConfig(provider: MemberProvider): ProviderConfig | null {
  if (provider === "line") {
    const clientId = env("OKAMI24_LINE_LOGIN_CHANNEL_ID");
    const clientSecret = env("OKAMI24_LINE_LOGIN_CHANNEL_SECRET");
    if (!clientId || !clientSecret) return null;
    return {
      clientId,
      clientSecret,
      authorizeUrl: "https://access.line.me/oauth2/v2.1/authorize",
      tokenUrl: "https://api.line.me/oauth2/v2.1/token",
      issuers: ["https://access.line.me"],
      hmacSigned: true,
      extraAuthorizeParams: {},
    };
  }
  const clientId = env("OKAMI24_GOOGLE_CLIENT_ID");
  const clientSecret = env("OKAMI24_GOOGLE_CLIENT_SECRET");
  if (!clientId || !clientSecret) return null;
  return {
    clientId,
    clientSecret,
    authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    issuers: ["https://accounts.google.com", "accounts.google.com"],
    hmacSigned: false,
    // Lets a visitor with several Google accounts pick one instead of being signed in silently with the last used.
    extraAuthorizeParams: { prompt: "select_account" },
  };
}

/** Which buttons the login page shows. Read at request time (the login page is dynamic). */
export function enabledMemberProviders(): MemberProvider[] {
  return MEMBER_PROVIDERS.filter((p) => providerConfig(p) !== null);
}

/** The public origin sign-in redirects are built on (behind Cloudflare + Render the request URL is the internal host). */
export function authOrigin(): string {
  return (env("OKAMI24_AUTH_ORIGIN") || SITE_URL).replace(/\/$/, "");
}

export function callbackUrl(provider: MemberProvider): string {
  return `${authOrigin()}/api/auth/${provider}/callback`;
}

/** What the start route keeps in a short-lived cookie until the provider sends the visitor back. */
export interface PendingSignIn {
  provider: MemberProvider;
  state: string;
  nonce: string;
  verifier: string;
  returnTo: string;
}

export function beginSignIn(provider: MemberProvider, returnTo: string): { url: string; pending: PendingSignIn } | null {
  const config = providerConfig(provider);
  if (!config) return null;
  const pending: PendingSignIn = {
    provider,
    state: crypto.randomBytes(16).toString("base64url"),
    nonce: crypto.randomBytes(16).toString("base64url"),
    verifier: crypto.randomBytes(32).toString("base64url"),
    returnTo,
  };
  const challenge = crypto.createHash("sha256").update(pending.verifier).digest("base64url");
  const params = new URLSearchParams({
    response_type: "code",
    client_id: config.clientId,
    redirect_uri: callbackUrl(provider),
    scope: "openid profile",
    state: pending.state,
    nonce: pending.nonce,
    code_challenge: challenge,
    code_challenge_method: "S256",
    ...config.extraAuthorizeParams,
  });
  return { url: `${config.authorizeUrl}?${params.toString()}`, pending };
}

export type FinishResult = { ok: true; claims: IdTokenClaims } | { ok: false; reason: string };

/** Trades the one-time code for the ID token (server to provider, with our secret) and checks it. */
export async function finishSignIn(pending: PendingSignIn, code: string): Promise<FinishResult> {
  const config = providerConfig(pending.provider);
  if (!config) return { ok: false, reason: "not-configured" };
  let response: Response;
  try {
    response = await fetch(config.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: callbackUrl(pending.provider),
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code_verifier: pending.verifier,
      }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
  } catch {
    return { ok: false, reason: "token-network" };
  }
  if (!response.ok) return { ok: false, reason: `token-${response.status}` };
  const body = (await response.json().catch(() => null)) as { id_token?: unknown } | null;
  if (!body || typeof body.id_token !== "string") return { ok: false, reason: "no-id-token" };
  return checkIdToken(body.id_token, {
    issuers: config.issuers,
    audience: config.clientId,
    nonce: pending.nonce,
    hmacSecret: config.hmacSigned ? config.clientSecret : undefined,
  });
}
