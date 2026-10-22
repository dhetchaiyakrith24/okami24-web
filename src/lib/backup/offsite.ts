/**
 * OKami24 — off-site copy of the database (LAUNCH_AUDIT item 42 "ทาง 2", owner 2026-09-07: before the cart reopens;
 * cart round 22/10 picked Cloudflare R2). Every successful local backup (data-backup.ts) is also uploaded to a private
 * R2 bucket, so a dead Render disk no longer takes the orders with it.
 *
 * Only the database copy goes out — never the `.env*` files the local backup also keeps (they hold secrets).
 * R2 speaks the S3 API; the request is signed here with AWS Signature V4 (node:crypto only, no SDK), following the
 * AWS "Signature Version 4" spec. `offsite-contract-test.ts` checks the signer against AWS's published example.
 *
 * Settings (all four set by the owner in Render → Environment; unset = off-site copy skipped, local backup unchanged):
 *   OKAMI24_OFFSITE_ENDPOINT  https://<account-id>.r2.cloudflarestorage.com
 *   OKAMI24_OFFSITE_BUCKET    the bucket name
 *   OKAMI24_OFFSITE_KEY_ID    R2 API token "Access Key ID"
 *   OKAMI24_OFFSITE_SECRET    R2 API token "Secret Access Key"  (never logged)
 * Retention is the bucket's own lifecycle rule (owner sets "delete after N days" in the R2 dashboard).
 *
 * Like data-backup.ts this module does not import `server-only`: it runs inside the server (scheduler) and from tsx.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export interface OffsiteConfig {
  endpoint: string;
  bucket: string;
  keyId: string;
  secret: string;
  region: string;
}

export function offsiteConfig(env: Record<string, string | undefined> = process.env): OffsiteConfig | null {
  const endpoint = env.OKAMI24_OFFSITE_ENDPOINT?.trim().replace(/\/+$/, "") ?? "";
  const bucket = env.OKAMI24_OFFSITE_BUCKET?.trim() ?? "";
  const keyId = env.OKAMI24_OFFSITE_KEY_ID?.trim() ?? "";
  const secret = env.OKAMI24_OFFSITE_SECRET?.trim() ?? "";
  if (!/^https:\/\/[^/\s]+$/.test(endpoint) || !/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(bucket) || keyId.length < 8 || secret.length < 16) return null;
  // R2's region is always "auto" (developers.cloudflare.com/r2/api/s3/api/).
  return { endpoint, bucket, keyId, secret, region: "auto" };
}

const sha256hex = (data: string | Buffer) => crypto.createHash("sha256").update(data).digest("hex");
const hmac = (key: Buffer | string, data: string) => crypto.createHmac("sha256", key).update(data).digest();

/** S3 URI-encoding of one path segment (RFC 3986 unreserved characters stay). */
const encodeSegment = (s: string) => encodeURIComponent(s).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);

/**
 * AWS Signature V4 `Authorization` header for one request. `headers` must already include `host` and
 * `x-amz-content-sha256` and `x-amz-date`; every header passed is signed.
 */
export function signV4(input: {
  method: string;
  path: string; // already URI-encoded, e.g. /bucket/key
  query?: string; // canonical query string ("" when none)
  headers: Record<string, string>;
  payloadHash: string;
  amzDate: string; // YYYYMMDDTHHMMSSZ
  region: string;
  service: string;
  keyId: string;
  secret: string;
}): string {
  const names = Object.keys(input.headers).map((h) => h.toLowerCase()).sort();
  const lower: Record<string, string> = {};
  for (const [k, v] of Object.entries(input.headers)) lower[k.toLowerCase()] = v.trim().replace(/\s+/g, " ");
  const canonicalHeaders = names.map((n) => `${n}:${lower[n]}\n`).join("");
  const signedHeaders = names.join(";");
  const canonicalRequest = [input.method, input.path, input.query ?? "", canonicalHeaders, signedHeaders, input.payloadHash].join("\n");
  const day = input.amzDate.slice(0, 8);
  const scope = `${day}/${input.region}/${input.service}/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", input.amzDate, scope, sha256hex(canonicalRequest)].join("\n");
  const kDate = hmac(`AWS4${input.secret}`, day);
  const kRegion = hmac(kDate, input.region);
  const kService = hmac(kRegion, input.service);
  const kSigning = hmac(kService, "aws4_request");
  const signature = crypto.createHmac("sha256", kSigning).update(stringToSign).digest("hex");
  return `AWS4-HMAC-SHA256 Credential=${input.keyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
}

export type OffsiteResult = { ok: true; key: string; bytes: number } | { ok: false; reason: string };

/** Upload one local backup file as `db/<file name>`. Never throws. */
export async function uploadBackup(file: string, config: OffsiteConfig | null = offsiteConfig(), now = new Date()): Promise<OffsiteResult> {
  if (!config) return { ok: false, reason: "not configured" };
  try {
    const body = fs.readFileSync(file);
    const key = `db/${path.basename(file)}`;
    const url = new URL(`${config.endpoint}/${encodeSegment(config.bucket)}/${key.split("/").map(encodeSegment).join("/")}`);
    const amzDate = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const payloadHash = sha256hex(body);
    const headers: Record<string, string> = {
      host: url.host,
      "content-type": "application/octet-stream",
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
    };
    const authorization = signV4({
      method: "PUT",
      path: url.pathname,
      headers,
      payloadHash,
      amzDate,
      region: config.region,
      service: "s3",
      keyId: config.keyId,
      secret: config.secret,
    });
    const { host: _host, ...sendHeaders } = headers; // fetch sets Host itself
    void _host;
    const res = await fetch(url, {
      method: "PUT",
      headers: { ...sendHeaders, authorization },
      body: new Uint8Array(body),
      signal: AbortSignal.timeout(120_000),
    });
    if (!res.ok) return { ok: false, reason: `HTTP ${res.status}` };
    return { ok: true, key, bytes: body.length };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.name : "error" };
  }
}
