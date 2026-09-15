/**
 * OKami24 — round 30.4ค batch 6 (owner-approved 2026-09-15): Thai text for the anatomy block's
 * "charging port" detail, which shows the product's `attributes.chargingType` as-is.
 *
 * Presentation-layer only, keyed by the ENGLISH data string; the data files stay the canonical
 * English source. Only the values the four flagship products carry have entries (the block renders
 * for `isFlagship` products only); a value without an entry keeps its English text. Wording matches
 * the spec chip values approved in batch 2 (docs/THAI_STYLE.md §7 "รอบ 30.4ค ก้อน 6").
 */
export const CHARGING_TYPE_TH: Record<string, string> = {
  "USB-C, 5V/2A": "USB-C 5V/2A",
  "USB-C, 5V/2A (~45 min full charge)": "USB-C 5V/2A ชาร์จเต็มประมาณ 45 นาที",
};

/** Thai for a charging-type data string, or the string itself when there is no entry. */
export function chargingTypeTh(value: string): string {
  return CHARGING_TYPE_TH[value] ?? value;
}
