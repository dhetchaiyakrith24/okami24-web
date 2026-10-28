/**
 * How a WooCommerce REST client signs a call over HTTPS (woocommerce.github.io/woocommerce-rest-api-docs, "Authentication
 * over HTTPS"): HTTP Basic with ck as user and cs as password, or `consumer_key` / `consumer_secret` in the query string.
 * Pure functions — no database — so the contract test can run them.
 */

const KEY = /^ck_[0-9a-f]{40}$/;
const SECRET = /^cs_[0-9a-f]{40}$/;

export function parseCredentials(authorization: string | null, query: URLSearchParams): { key: string; secret: string } | null {
  let key = "";
  let secret = "";
  if (authorization?.toLowerCase().startsWith("basic ")) {
    const decoded = Buffer.from(authorization.slice(6).trim(), "base64").toString("utf8");
    const i = decoded.indexOf(":");
    if (i > 0) {
      key = decoded.slice(0, i);
      secret = decoded.slice(i + 1);
    }
  }
  if (!key) {
    key = query.get("consumer_key") ?? "";
    secret = query.get("consumer_secret") ?? "";
  }
  key = key.trim();
  secret = secret.trim();
  return KEY.test(key) && SECRET.test(secret) ? { key, secret } : null;
}

/** Query string with every credential-looking parameter removed — what the call log stores. */
export function safeQuery(query: URLSearchParams): string {
  const out = new URLSearchParams();
  for (const [k, v] of query) {
    if (/^(consumer_|oauth_)/i.test(k)) continue;
    out.append(k, v);
  }
  return out.toString();
}

/** The webhook secret Shipnity sends must never reach the call log (it signs every order sent to Shipnity). */
export function redactSecrets(raw: string): string {
  return raw.replace(/("secret"\s*:\s*)"(?:[^"\\]|\\.)*"/g, '$1"<hidden>"');
}
