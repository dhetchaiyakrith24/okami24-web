import "server-only";
import crypto from "node:crypto";

/**
 * LINE Messaging API client for the team's alert bot "OKM ORDER" (@691qxpxp — a separate LINE OA, NOT the shop's
 * @okm24; cart round 22/10). Three calls only:
 *   POST /v2/bot/message/push    new-order alert into the "OKM Order" group
 *   POST /v2/bot/message/reply   the slip verdict back into the "OKM Slip" group (reply = free, no quota)
 *   GET  /v2/bot/message/{id}/content (api-data.line.me) — the slip picture a staff member posted
 * The channel secret (`OKAMI24_LINE_CHANNEL_SECRET`, webhook signatures) and the channel access token
 * (`OKAMI24_LINE_CHANNEL_TOKEN`) are set by the owner in the host's secret settings; they are only read here, on the
 * server, and never sent to a browser or written to a log. Unset = the bot stays silent and the webhook answers 404.
 */

/** `OKAMI24_LINE_TEST_BASE` points a DEV server at a local stand-in (both API hosts) so the bot can be exercised
 *  without the real token. Ignored in a production build: the token can only ever go to LINE itself. */
const TEST_BASE = process.env.NODE_ENV !== "production" ? process.env.OKAMI24_LINE_TEST_BASE : undefined;
const API = TEST_BASE ?? "https://api.line.me";
const DATA_API = TEST_BASE ?? "https://api-data.line.me";
const TIMEOUT_MS = 10_000;
/** LINE caps one text message at 5,000 characters. */
const MAX_TEXT = 5000;

function secret(): string | null {
  const v = process.env.OKAMI24_LINE_CHANNEL_SECRET?.trim() ?? "";
  return v.length >= 16 ? v : null;
}

function token(): string | null {
  const v = process.env.OKAMI24_LINE_CHANNEL_TOKEN?.trim() ?? "";
  return v.length >= 16 ? v : null;
}

export function lineConfigured(): boolean {
  return secret() !== null && token() !== null;
}

/** `x-line-signature` = base64(HMAC-SHA256(channel secret, raw request body)). Compared in constant time. */
export function validSignature(rawBody: string, signature: string | null): boolean {
  const key = secret();
  if (!key || !signature) return false;
  const expected = crypto.createHmac("sha256", key).update(rawBody).digest();
  let given: Buffer;
  try {
    given = Buffer.from(signature, "base64");
  } catch {
    return false;
  }
  return given.length === expected.length && crypto.timingSafeEqual(given, expected);
}

export type LineResult = { ok: true } | { ok: false; status: number | null };

async function post(path: string, body: unknown): Promise<LineResult> {
  const t = token();
  if (!t) return { ok: false, status: null };
  try {
    const res = await fetch(`${API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    return res.ok ? { ok: true } : { ok: false, status: res.status };
  } catch {
    return { ok: false, status: null };
  }
}

const textMessage = (text: string) => ({ type: "text", text: text.length > MAX_TEXT ? `${text.slice(0, MAX_TEXT - 1)}…` : text });

export function pushText(to: string, text: string): Promise<LineResult> {
  return post("/v2/bot/message/push", { to, messages: [textMessage(text)] });
}

export function replyText(replyToken: string, text: string): Promise<LineResult> {
  return post("/v2/bot/message/reply", { replyToken, messages: [textMessage(text)] });
}

/** A group's display name (GET /v2/bot/group/{groupId}/summary) — so staff can tell "OKM Order" from "OKM Slip" when
 *  assigning them. Not stored; null on any failure. */
export async function getGroupName(groupId: string): Promise<string | null> {
  const t = token();
  if (!t || !/^C[0-9a-f]{32}$/.test(groupId)) return null;
  try {
    const res = await fetch(`${API}/v2/bot/group/${groupId}/summary`, {
      headers: { Authorization: `Bearer ${t}` },
      signal: AbortSignal.timeout(3_000),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { groupName?: string };
    return typeof body.groupName === "string" ? body.groupName : null;
  } catch {
    return null;
  }
}

/** The bytes of an image a user sent, with its content type. null on any failure (the caller replies with a plain
 *  "could not read the picture"). */
export async function getMessageContent(messageId: string, maxBytes: number): Promise<{ bytes: Buffer; type: string } | null> {
  const t = token();
  if (!t || !/^\d+$/.test(messageId)) return null;
  try {
    const res = await fetch(`${DATA_API}/v2/bot/message/${messageId}/content`, {
      headers: { Authorization: `Bearer ${t}` },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const declared = Number(res.headers.get("content-length") ?? "0");
    if (Number.isFinite(declared) && declared > maxBytes) return null;
    const bytes = Buffer.from(await res.arrayBuffer());
    if (bytes.length === 0 || bytes.length > maxBytes) return null;
    return { bytes, type: (res.headers.get("content-type") ?? "image/jpeg").split(";")[0].trim() };
  } catch {
    return null;
  }
}
