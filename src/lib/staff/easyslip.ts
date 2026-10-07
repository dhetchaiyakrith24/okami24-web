import "server-only";
import type { SlipParty } from "@/lib/staff/receiver-match";

/**
 * EasySlip API v2 client — the two calls the staff slip-check page makes. Every shape and code here is
 * from the official docs (document.easyslip.com, read 2026-10-07; summary with page references in
 * _incoming/slip-check/easyslip-api.md):
 *   POST /v2/verify/bank  multipart `image` (+ checkDuplicate, matchAccount)   /en/v2/verify/bank/image
 *   GET  /v2/info         quota used / max / remaining — does NOT consume quota  /en/v2/info
 * The key is `OKAMI24_EASYSLIP_API_KEY`, set by the owner in the host's secret settings; it is only ever
 * read here, on the server, and never sent to a browser or written to a log.
 */

/** `OKAMI24_EASYSLIP_TEST_BASE` points a DEV server (`next dev`) at a local stand-in that answers with the
 *  documented shapes (_incoming/slip-check/mock-easyslip.js) — so the page can be exercised without the
 *  real key or a real slip. Ignored in a production build: the key can only ever go to EasySlip itself. */
const BASE =
  process.env.NODE_ENV !== "production" && process.env.OKAMI24_EASYSLIP_TEST_BASE
    ? process.env.OKAMI24_EASYSLIP_TEST_BASE
    : "https://api.easyslip.com/v2";
const TIMEOUT_MS = 20_000;
/** /en/v2/verify/bank/image "Image Requirements": 4 MB (4,194,304 bytes); JPEG, PNG, GIF, WebP. */
export const MAX_IMAGE_BYTES = 4_194_304;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"] as const;

function apiKey(): string | null {
  const key = process.env.OKAMI24_EASYSLIP_API_KEY?.trim() ?? "";
  return key.length >= 16 ? key : null;
}

export function easySlipConfigured(): boolean {
  return apiKey() !== null;
}

export interface RawSlip {
  transRef: string;
  date: string;
  amount: { amount: number; local?: { amount?: number; currency?: string } };
  sender?: SlipParty;
  receiver?: SlipParty & { merchantId?: string | null };
}

export interface VerifyData {
  isDuplicate: boolean;
  amountInSlip: number;
  matchedAccount: { bankNumber?: string; bank?: { code?: string; shortCode?: string } } | null;
  rawSlip: RawSlip;
}

/** `code` is EasySlip's error.code (match on code, never on message — /en/reference/error-codes), or one
 *  of ours: NOT_CONFIGURED · TIMEOUT · NETWORK · BAD_RESPONSE. */
export type EasySlipResult<T> = { ok: true; data: T } | { ok: false; code: string; retryAfterSeconds?: number };

async function call<T>(path: string, init: RequestInit, timeoutMs = TIMEOUT_MS): Promise<EasySlipResult<T>> {
  const key = apiKey();
  if (!key) return { ok: false, code: "NOT_CONFIGURED" };
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: { ...(init.headers ?? {}), Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(timeoutMs),
      cache: "no-store",
    });
  } catch (err) {
    const name = (err as { name?: string } | null)?.name;
    return { ok: false, code: name === "TimeoutError" || name === "AbortError" ? "TIMEOUT" : "NETWORK" };
  }
  let body: unknown;
  try {
    body = await res.json();
  } catch {
    return { ok: false, code: res.status >= 500 ? "API_SERVER_ERROR" : "BAD_RESPONSE" };
  }
  const envelope = body as { success?: boolean; data?: T; error?: { code?: string } };
  if (envelope.success === true && envelope.data) return { ok: true, data: envelope.data };
  const retryAfter = Number(res.headers.get("retry-after"));
  return {
    ok: false,
    code: envelope.error?.code ?? (res.status >= 500 ? "API_SERVER_ERROR" : "BAD_RESPONSE"),
    retryAfterSeconds: Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : undefined,
  };
}

export async function verifySlipImage(image: Blob, fileName: string): Promise<EasySlipResult<VerifyData>> {
  const form = new FormData();
  form.append("image", image, fileName);
  // Same branch + already verified = cached answer, isDuplicate: true, quota NOT consumed
  // (/en/v2/verify/bank/ "Duplicate Handling").
  form.append("checkDuplicate", "true");
  // Only matches accounts the owner registered in the EasySlip portal; null otherwise. Our own receiver
  // check (receiver-match.ts) does not depend on it.
  form.append("matchAccount", "true");
  const result = await call<VerifyData>("/verify/bank", { method: "POST", body: form });
  if (!result.ok || !isVerifyData(result.data)) {
    return result.ok ? { ok: false, code: "BAD_RESPONSE" } : result;
  }
  return result;
}

function isVerifyData(d: unknown): d is VerifyData {
  const v = d as VerifyData | null;
  return Boolean(
    v &&
      v.rawSlip &&
      typeof v.rawSlip.transRef === "string" &&
      v.rawSlip.transRef.length > 0 &&
      typeof v.rawSlip.date === "string" &&
      typeof v.rawSlip.amount?.amount === "number"
  );
}

export interface QuotaInfo {
  used: number;
  max: number | null;
  remaining: number | null;
  planName: string | null;
  expiresAt: string | null;
}

interface InfoData {
  application?: { quota?: { used?: number; max?: number | null; remaining?: number | null }; autoRenew?: { expiresAt?: string } };
  product?: { name?: string };
}

let quotaCache: { at: number; value: EasySlipResult<QuotaInfo> } | null = null;
const QUOTA_CACHE_MS = 60_000;
const QUOTA_TIMEOUT_MS = 3_000;

/** Free to call (/en/v2/info "This endpoint does not consume quota"); still cached a minute so a page
 *  that several staff keep open does not hammer it. `fresh` skips the cache right after a check. */
export async function getQuota(fresh = false): Promise<EasySlipResult<QuotaInfo>> {
  if (!fresh && quotaCache && Date.now() - quotaCache.at < QUOTA_CACHE_MS) return quotaCache.value;
  // Short timeout: the staff page awaits this while rendering, and the quota box is optional — a slow
  // EasySlip must not hold the page on a blank screen (checker #347). Verify keeps the long timeout.
  const result = await call<InfoData>("/info", { method: "GET" }, QUOTA_TIMEOUT_MS);
  const value: EasySlipResult<QuotaInfo> = result.ok
    ? {
        ok: true,
        data: {
          used: result.data.application?.quota?.used ?? 0,
          max: result.data.application?.quota?.max ?? null,
          remaining: result.data.application?.quota?.remaining ?? null,
          planName: result.data.product?.name ?? null,
          expiresAt: result.data.application?.autoRenew?.expiresAt ?? null,
        },
      }
    : result;
  quotaCache = { at: Date.now(), value };
  return value;
}
