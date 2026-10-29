import type { CarrierId } from "@/lib/commerce/carriers";

/**
 * Tracking sync step 2, prepared (owner 29/10 "ระบบดึงเลขพัสดุทำเลยครับ"): find a tracking number — and the carrier when
 * the body says — in a write Shipnity makes to an order the site sent. NOT WIRED to any order yet: no real body has been
 * seen (step 1, PR #1014, logs them for staff to download). Every shape below is a GUESS from how WooCommerce shops
 * commonly receive tracking, until a real Shipnity body confirms one:
 *   1. POST /orders/<id>/shipment-trackings (Woo "Shipment Tracking" / "Advanced Shipment Tracking" plugins):
 *      { tracking_provider | custom_tracking_provider, tracking_number }
 *   2. PUT /orders/<id> (or a batch update) with `meta_data` entries whose key names a tracking number
 *      (_tracking_number · tracking_number · _aftership_tracking_number · …), or the plugins' list
 *      `_wc_shipment_tracking_items` = [{ tracking_provider, tracking_number }]; the same inside `shipping_lines[].meta_data`
 *   3. POST /orders/<id>/notes with a note such as "เลขพัสดุ EF123456789TH" / "Tracking: …"
 * Pure — tracking-parse-contract-test.ts holds it. Returns null when nothing looks like a tracking number.
 */

export interface ParsedTracking {
  number: string;
  /** From the provider text or the number's own format; null = the body does not say (staff pick stays). */
  carrier: CarrierId | null;
  /** Which shape it came from — kept for the log, so the guess can be checked against the real body. */
  source: "tracking-route" | "meta" | "shipping-meta" | "note";
}

/** Letters, digits and dashes, 8–40 long, with at least 4 digits — what a parcel number looks like (not a status word). */
const NUMBER = /^[A-Z0-9-]{8,40}$/;
/** Thailand Post / EMS numbers use the UPU S10 format: 2 letters, 9 digits, "TH". */
const THAI_POST = /^[A-Z]{2}\d{9}TH$/;
const TRACKING_KEY = /^_?(?:[a-z]+_)*tracking_(?:number|no|code|id)$|^_?track(?:ing)?(?:_?number)?$/i;

function cleanNumber(raw: unknown): string | null {
  if (typeof raw !== "string" && typeof raw !== "number") return null;
  const t = String(raw).trim().toUpperCase().replace(/\s+/g, "");
  return NUMBER.test(t) && (t.match(/\d/g)?.length ?? 0) >= 4 ? t : null;
}

/** The carrier a provider text names (EMS / Thailand Post / ไปรษณีย์ → EMS; DHL → DHL), else null. */
export function carrierFromText(raw: unknown): CarrierId | null {
  if (typeof raw !== "string") return null;
  const s = raw.toLowerCase();
  if (/dhl/.test(s)) return "dhl";
  if (/\bems\b|thai(?:land)?[\s_-]*post|ไปรษณีย์/.test(s)) return "thailand-post";
  return null;
}

function carrierFor(number: string, providerText: unknown): CarrierId | null {
  return carrierFromText(providerText) ?? (THAI_POST.test(number) ? "thailand-post" : null);
}

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => !!v && typeof v === "object" && !Array.isArray(v);

function fromMeta(meta: unknown, source: ParsedTracking["source"], providerHint: unknown): ParsedTracking | null {
  if (!Array.isArray(meta)) return null;
  for (const m of meta) {
    if (!isObj(m) || typeof m.key !== "string") continue;
    if (m.key === "_wc_shipment_tracking_items" && Array.isArray(m.value)) {
      for (const item of m.value) {
        if (!isObj(item)) continue;
        const number = cleanNumber(item.tracking_number);
        if (number) return { number, carrier: carrierFor(number, item.tracking_provider ?? item.custom_tracking_provider), source };
      }
    }
    if (TRACKING_KEY.test(m.key)) {
      const number = cleanNumber(m.value);
      if (number) {
        const provider = meta.find((x) => isObj(x) && typeof x.key === "string" && /provider|carrier|courier/i.test(x.key)) as Obj | undefined;
        return { number, carrier: carrierFor(number, provider?.value ?? providerHint), source };
      }
    }
  }
  return null;
}

/** A number written in a note, next to a tracking word or in the Thailand Post format. */
function fromNote(note: unknown): ParsedTracking | null {
  if (typeof note !== "string") return null;
  const text = note.toUpperCase();
  const s10 = text.match(/\b[A-Z]{2}\s?\d{3}\s?\d{3}\s?\d{3}\s?TH\b/);
  if (s10) {
    const number = s10[0].replace(/\s+/g, "");
    return { number, carrier: carrierFor(number, note), source: "note" };
  }
  const labelled = note.match(/(?:tracking(?:\s*(?:no\.?|number|#))?|เลขพัสดุ|เลขแทร็ก|track)\s*[:：#-]?\s*([A-Za-z0-9-]{8,40})/i);
  const number = labelled ? cleanNumber(labelled[1]) : null;
  return number ? { number, carrier: carrierFor(number, note), source: "note" } : null;
}

/** The tracking in one Shipnity write. `kind` = which route it came to (the route knows it from the path). */
export function parseTracking(kind: "order" | "note" | "tracking-route", body: unknown): ParsedTracking | null {
  if (!isObj(body)) return null;
  if (kind === "tracking-route") {
    const number = cleanNumber(body.tracking_number);
    return number ? { number, carrier: carrierFor(number, body.tracking_provider || body.custom_tracking_provider), source: "tracking-route" } : null;
  }
  if (kind === "note") return fromNote(body.note);
  const lines = Array.isArray(body.shipping_lines) ? body.shipping_lines.filter(isObj) : [];
  const hint = lines[0]?.method_title;
  const own = fromMeta(body.meta_data, "meta", hint);
  if (own) return own;
  for (const l of lines) {
    const hit = fromMeta(l.meta_data, "shipping-meta", l.method_title);
    if (hit) return hit;
  }
  return null;
}
