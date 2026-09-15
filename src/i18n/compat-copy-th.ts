/**
 * OKami24 — round 30.4ค batch 3 (owner-approved string by string, 2026-09-15): Thai text for the
 * "ความเข้ากันได้" block on the 35 legacy product pages (`Product.compatibility[]` label + note).
 *
 * Presentation-layer only, keyed by the ENGLISH string exactly as it appears in
 * `src/data/products/*.ts` — the data files stay the canonical English source. Keyed by text rather
 * than by product + index because the data shares a handful of constants across products (the same
 * label/note object is reused by up to 29 products), so 13 unique labels and 12 unique notes cover
 * all 56 entries. Read by CompatibilitySection.tsx when the locale is Thai; a string without an
 * entry keeps its English text (brand part names such as "USB-C", "Zero Cartridge",
 * "ARGUS Top Fill Cartridge V2", "VMATE Top Fill Cartridge", "Zero Pro / Zero Nano" stay English on
 * purpose — THAI_STYLE layer 1). English/Chinese visitors keep the data strings by construction.
 *
 * Rules (docs/THAI_STYLE.md §3 · §7 "รอบ 30.4ค ก้อน 3"): the generic words inside a label become the
 * locked Thai words (หัวพอต · ตัวเครื่อง · เครื่องใช้ซ้ำ · เติมด้านบน · คอยล์), the brand's system
 * name stays; a label names the same thing the same way the spec chips on the page do
 * ("UWELL GPP", "หัวพอตสาย DRAG (เปลี่ยนคอยล์ได้)"). A note does not repeat the word already in
 * its label. An EMPTY string means "show no note" (the DRAG 6 research note "Cartridge naming not
 * independently confirmed." — unverifiable = say nothing).
 */
export const COMPAT_LABELS_TH: Record<string, string> = {
  "UWELL GPP cartridge platform": "หัวพอต UWELL GPP",
  "Caliburn G3 pod": "หัวพอต Caliburn G3",
  "ARGUS top-fill cartridge platform": "หัวพอต ARGUS แบบเติมด้านบน",
  "DRAG-series coil pod": "หัวพอตสาย DRAG (เปลี่ยนคอยล์ได้)",
  "VINCI cartridge platform": "หัวพอต VINCI",
  "M Switch Pod cartridge": "หัวพอต M Switch Pod",
  "M Switch Kit device body": "ตัวเครื่อง M Switch Kit",
  "M Bar-compatible reusable devices": "เครื่องใช้ซ้ำที่รองรับ M Bar",
};

export const COMPAT_NOTES_TH: Record<string, string> = {
  "Shared top-fill pod platform used across most current Caliburn devices; resistance options sold separately.":
    "เติมด้านบน ใช้หัวตัวเดียวกับ Caliburn รุ่นปัจจุบันส่วนใหญ่ โอห์มอื่นซื้อแยก",
  "Legacy G3-series pod, still supported on select current-generation devices.": "หัวรุ่นก่อน เครื่องรุ่นปัจจุบันบางรุ่นยังใช้ได้",
  // Only the three Caliburn devices whose spec sheet carries a 2A charging figure still have this
  // note in the data (owner 2026-09-15: the other seven lost it in every language — unverifiable).
  "5V/2A charging on current-generation devices.": "ชาร์จ 5V/2A",
  "5V/2A charging.": "ชาร์จ 5V/2A",
  "0.4–3.0Ω resistance range.": "ช่วงโอห์ม 0.4–3.0Ω",
  "0.1–3.0Ω resistance range.": "ช่วงโอห์ม 0.1–3.0Ω",
  "0.3–3.0Ω resistance range.": "ช่วงโอห์ม 0.3–3.0Ω",
  "0.7Ω included.": "ในกล่องมีหัว 0.7Ω",
  // ARGUS G3 mini and VINCI S — the 1A figure is the product's own `attributes.chargingType`.
  "Lower-amperage charging on this model.": "ชาร์จด้วยไฟ 1A",
  "Cartridge naming not independently confirmed.": "",
  "V2 pod compatible, 0.4–3.0Ω.": "ใช้หัว V2 ได้ด้วย ช่วงโอห์ม 0.4–3.0Ω",
  "Rechargeable via USB-C.": "ชาร์จซ้ำได้",
};

/** Thai label for a compatibility entry, or the data label when there is no entry. */
export function compatLabelTh(label: string): string {
  return COMPAT_LABELS_TH[label] ?? label;
}

/** Thai note for a compatibility entry: the overlay string (possibly "" = show nothing), or the
 *  data note when there is no entry. */
export function compatNoteTh(note: string | undefined): string | undefined {
  if (note === undefined) return undefined;
  return note in COMPAT_NOTES_TH ? COMPAT_NOTES_TH[note] : note;
}
