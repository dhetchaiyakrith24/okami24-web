/**
 * The two carriers the warehouse ships with (BSOT §10 "Carriers": Thailand Post EMS and Flash Express) and where a
 * customer checks a parcel on the carrier's own site. Owner 23/10 (reverses the 07/09 "no carrier names" rule for the
 * order page only): once an order is shipped, the order page names the carrier and links to its tracking page.
 *
 * Staff pick the carrier when they enter the tracking number on /staff — it is never guessed from the number.
 * The links open each carrier's official tracking page without the number filled in (neither site documents a
 * prefill parameter), so the order page shows a 3-step how-to: copy the number, open the page, paste and search.
 * Pure, no I/O — the client order page imports it.
 */
export const CARRIER_IDS = ["thailand-post", "flash"] as const;
export type CarrierId = (typeof CARRIER_IDS)[number];

export const CARRIERS: Record<CarrierId, { name: { th: string; en: string; zh: string }; trackUrl: string }> = {
  "thailand-post": {
    name: { th: "ไปรษณีย์ไทย (EMS)", en: "Thailand Post (EMS)", zh: "泰国邮政 (EMS)" },
    trackUrl: "https://track.thailandpost.co.th/",
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
