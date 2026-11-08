/**
 * Keying a LINE-chat order into the back office (owner list ก11, way 2, owner 09/11: "คีย์ลงในเว็บเราก็ทำปุ่มส่งไปหาคลังได้")
 * — pure, so the contract test runs it under plain tsx. line-orders.ts does the database.
 *
 * What staff type: the buyer's phone (the customer key, as on the web), the ship-to name / phone / address, the items, their
 * own name (the team shares one password, so the order says who keyed it), and the slip from the slip check's list. Prices
 * and shipping are never typed: they come from the live catalogue and the web's shipping rules (HANDOFF §18 "LINE orders
 * are charged the same price as the web"). Customer data kept = what a web order keeps (BSOT §11), no LINE id or name.
 *
 * THE SLIP: staff pick one of the slips the slip check saw that belongs to no order yet (a loose LINE slip) and whose amount
 * is the order total. That links it (rule 1 of daily-sales-rules.ts), so the money counts once, as this order. "No slip in
 * the list" is allowed (the check was down, or the customer paid in cash): the order then waits for staff to confirm the
 * money on its page, like a web order whose slip was checked by hand.
 */

export const MAX_LINES = 20;
export const MAX_QTY = 50;
const SLIP_WINDOW_DAYS = 3;
const DAY_MS = 86_400_000;

export interface LineOrderItem {
  slug: string;
  variantId: string | null;
  quantity: number;
}

export interface LineOrderInput {
  customerPhone: string;
  recipientName: string;
  recipientPhone: string;
  line1: string;
  subdistrict: string;
  district: string;
  province: string;
  postalCode: string;
  keyedBy: string;
  items: LineOrderItem[];
  /** The picked slip's bank reference, or null for "no slip in the list". */
  slipRef: string | null;
}

export type LineOrderError = "phone" | "keyed-by" | "items" | "missing";

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "");
const SLUG = /^[a-z0-9][a-z0-9-]{0,119}$/;

/** A mobile number in local form (0 + 9 digits), or null. Same narrow rule as the web's checkout phone (phone.ts). */
export function localMobile(raw: string): string | null {
  const digits = raw.replace(/[^0-9]/g, "");
  const local = digits.startsWith("66") && digits.length === 11 ? `0${digits.slice(2)}` : digits;
  return /^0[689][0-9]{8}$/.test(local) ? local : null;
}

/** The items field: JSON [{slug, variantId, quantity}] from the form's picker. Same option twice = one line, quantities added. */
export function parseItems(raw: unknown): LineOrderItem[] | null {
  let data: unknown;
  try {
    data = JSON.parse(typeof raw === "string" ? raw : "");
  } catch {
    return null;
  }
  if (!Array.isArray(data) || data.length === 0 || data.length > MAX_LINES) return null;
  const merged = new Map<string, LineOrderItem>();
  for (const row of data) {
    const r = row as { slug?: unknown; variantId?: unknown; quantity?: unknown };
    const slug = typeof r.slug === "string" ? r.slug : "";
    const variantId = typeof r.variantId === "string" && r.variantId.length > 0 && r.variantId.length <= 120 ? r.variantId : null;
    const quantity = Number(r.quantity);
    if (!SLUG.test(slug) || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QTY) return null;
    const key = `${slug}|${variantId ?? ""}`;
    const prev = merged.get(key);
    if (prev && prev.quantity + quantity > MAX_QTY) return null;
    merged.set(key, { slug, variantId, quantity: (prev?.quantity ?? 0) + quantity });
  }
  return [...merged.values()];
}

/** The form, read and checked. The address itself is checked by the web's own rule afterwards (addresses.ts validateAddress). */
export function parseLineOrderForm(get: (name: string) => unknown): { ok: true; input: LineOrderInput } | { ok: false; error: LineOrderError } {
  const customerPhone = localMobile(text(get("customerPhone"), 20));
  if (!customerPhone) return { ok: false, error: "phone" };
  const keyedBy = text(get("keyedBy"), 40);
  if (!keyedBy) return { ok: false, error: "keyed-by" };
  const items = parseItems(get("items"));
  if (!items) return { ok: false, error: "items" };
  const input: LineOrderInput = {
    customerPhone,
    recipientName: text(get("recipientName"), 80),
    recipientPhone: text(get("recipientPhone"), 20) || customerPhone,
    line1: text(get("line1"), 200),
    subdistrict: text(get("subdistrict"), 80),
    district: text(get("district"), 80),
    province: text(get("province"), 80),
    postalCode: text(get("postalCode"), 5),
    keyedBy,
    items,
    slipRef: (() => {
      const ref = text(get("slipRef"), 80);
      return ref && ref !== "none" ? ref : null;
    })(),
  };
  if (!input.recipientName || !input.line1 || !input.province || !input.postalCode) return { ok: false, error: "missing" };
  return { ok: true, input };
}

export interface LooseSlip {
  transRef: string;
  amountSatang: number;
  transferredAt: string;
}

/** The slips staff may pick: loose LINE slips of the last few days, newest first. */
export function pickableSlips(slips: LooseSlip[], nowMs: number): LooseSlip[] {
  return slips
    .filter((s) => {
      const at = Date.parse(s.transferredAt);
      return !Number.isNaN(at) && nowMs - at <= SLIP_WINDOW_DAYS * DAY_MS && at - nowMs <= DAY_MS;
    })
    .sort((a, b) => Date.parse(b.transferredAt) - Date.parse(a.transferredAt));
}

/** Can this slip pay this order? It must still be loose and carry exactly the order total. */
export function slipFits(slip: LooseSlip | undefined, totalBaht: number): "ok" | "not-loose" | "amount" {
  if (!slip) return "not-loose";
  return slip.amountSatang === totalBaht * 100 ? "ok" : "amount";
}
