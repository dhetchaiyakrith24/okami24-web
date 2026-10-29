/**
 * A logged order write from Shipnity with the customer taken out (tracking sync step 1, owner 29/10): what staff download
 * from /staff/shipnity to hand on, so whoever builds the tracking sync sees where Shipnity puts the tracking number
 * (meta_data · shipping_lines · a note · a tracking route) without the customer's name, phone or address.
 * Pure, so the contract test can hold it.
 */

const PERSONAL = new Set(["first_name", "last_name", "company", "address_1", "address_2", "city", "state", "phone", "email", "customer_note"]);
const HIDDEN = "<hidden>";

function strip(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(strip);
  if (!value || typeof value !== "object") return value;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    out[k] = PERSONAL.has(k) && typeof v === "string" && v !== "" ? HIDDEN : strip(v);
  }
  return out;
}

/** The body as JSON with personal fields hidden; a body cut short in the log (not valid JSON) is masked as text. */
export function minimiseOrderBody(raw: string | null): unknown {
  if (raw === null || raw === "") return null;
  try {
    return strip(JSON.parse(raw));
  } catch {
    return raw.replace(/("(?:first_name|last_name|company|address_1|address_2|city|state|phone|email|customer_note)"\s*:\s*)"(?:[^"\\]|\\.)*"/g, `$1"${HIDDEN}"`);
  }
}
