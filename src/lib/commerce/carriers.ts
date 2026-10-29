/**
 * The carriers the warehouse ships with (BSOT §10 "Carriers": Thailand Post EMS and DHL since owner 29/10; Flash Express
 * before that) and where a customer checks a parcel on the carrier's own site. Owner 23/10 (reverses the 07/09 "no
 * carrier names" rule for the order page only): once an order is shipped, the order page names the carrier and links to
 * its tracking page.
 *
 * Which carrier takes an order (owner 30/10, admin confirmed): ship-to postcode in Phuket (83xxx) or Bangkok 10220 /
 * 10250 = DHL, every other address = EMS — `pickCarrier`. Staff may change the pick on /staff before the order goes to
 * the warehouse, and still confirm the carrier with the tracking number when it ships — never guessed from the number.
 * The links open each carrier's official tracking page without the number filled in (none documents a prefill
 * parameter), so the order page shows a 3-step how-to: copy the number, open the page, paste and search.
 * Pure, no I/O — the client order page imports it.
 */
export const CARRIER_IDS = ["thailand-post", "dhl", "flash"] as const;
export type CarrierId = (typeof CARRIER_IDS)[number];

/** The carriers staff can pick today (BSOT §10, owner 29/10). Flash stays in CARRIER_IDS only so old orders still read. */
export const STAFF_CARRIER_IDS = ["thailand-post", "dhl"] as const satisfies readonly CarrierId[];

export const CARRIERS: Record<CarrierId, { name: { th: string; en: string; zh: string }; trackUrl: string }> = {
  "thailand-post": {
    name: { th: "ไปรษณีย์ไทย (EMS)", en: "Thailand Post (EMS)", zh: "泰国邮政 (EMS)" },
    trackUrl: "https://track.thailandpost.co.th/",
  },
  dhl: {
    name: { th: "DHL", en: "DHL", zh: "DHL" },
    trackUrl: "https://ecommerceportal.dhl.com/track/",
  },
  flash: {
    name: { th: "Flash Express", en: "Flash Express", zh: "Flash Express" },
    trackUrl: "https://www.flashexpress.co.th/fle/tracking",
  },
};

/** A carrier id as it comes from a form or the database — anything else is null (an order shipped before 23/10). */
export function toCarrierId(raw: unknown): CarrierId | null {
  return typeof raw === "string" && (CARRIER_IDS as readonly string[]).includes(raw) ? (raw as CarrierId) : null;
}

/** A carrier staff may pick now (EMS or DHL) — Flash and anything else = null. */
export function toStaffCarrierId(raw: unknown): (typeof STAFF_CARRIER_IDS)[number] | null {
  return typeof raw === "string" && (STAFF_CARRIER_IDS as readonly string[]).includes(raw) ? (raw as (typeof STAFF_CARRIER_IDS)[number]) : null;
}

/** DHL postcodes (owner 30/10): all of Phuket province (83xxx) plus Bangkok 10220 and 10250. */
const DHL_POSTCODE = /^(83\d{3}|10220|10250)$/;

/** The carrier for a ship-to postcode: DHL for the DHL areas, EMS (Thailand Post) for every other address. */
export function pickCarrier(postcode: string): "dhl" | "thailand-post" {
  return DHL_POSTCODE.test(postcode.trim()) ? "dhl" : "thailand-post";
}

/** The carrier name Shipnity lists (OTHER / DHL / EMS — admin 29/10), sent as the order's shipping method. */
export const SHIPNITY_CARRIER_NAME: Record<CarrierId, string> = { "thailand-post": "EMS", dhl: "DHL", flash: "OTHER" };
