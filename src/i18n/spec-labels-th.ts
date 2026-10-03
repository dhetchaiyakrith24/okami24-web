/**
 * OKami24 — round 30.4ค batch 1 (owner-approved label by label, 2026-09-15): Thai names for the
 * SpecSheet chip labels of the 35 legacy products.
 *
 * Presentation-layer only, keyed by the ENGLISH label string exactly as it appears in
 * `src/data/products/*.ts` `specifications[].label` — the data files stay the canonical English
 * source and are untouched. Keyed by label rather than by `Specification.key` because the keys
 * repeat across meanings (`output` is both "Output range" and "Max output"; `pod` is "Pod
 * platform", "Pod capacity", "Cartridge capacity" and "Included pod"), while the label is unique
 * per meaning. Read by SpecSheet.tsx (product page) and CompareTool.tsx (/compare spec rows) when
 * the locale is Thai; a label without an entry keeps its English text, and English/Chinese
 * visitors keep the data labels by construction. Not part of the dictionary on purpose: the i18n
 * contract test requires every dictionary key in all three locales, which would mean repeating
 * 41 English labels in en.ts and zh.ts for no reader.
 *
 * Wording rules (docs/THAI_STYLE.md §3 · §5 group ก · §7 "รอบ 30.4ค ก้อน 1"): a label that already
 * exists as a hero stat / compare row keeps that word (แบตเตอรี่ · กำลังไฟ · จำนวนพัฟที่ระบุ · ความจุ ·
 * หน้าจอ · การชาร์จ · ขนาด); "กำลังไฟ" is the locked field name (group ก), so the two output labels
 * are built on it, not on "วัตต์"; labels with one meaning share one Thai word (Battery / Battery
 * capacity · Puffs per pod / per cartridge · Compatible device(s) · Pod / Cartridge capacity ·
 * Control / Control system · Activation / Firing). Values are NOT translated here (batch 2).
 */
export const SPEC_LABELS_TH: Record<string, string> = {
  Battery: "แบตเตอรี่",
  "Battery capacity": "แบตเตอรี่",
  Display: "หน้าจอ",
  "Pod platform": "หัวพอตที่ใช้ได้",
  "Output range": "กำลังไฟ",
  "Max output": "กำลังไฟสูงสุด",
  "Rated puffs": "จำนวนพัฟที่ระบุ",
  Coil: "คอยล์",
  "Resistance range": "ช่วงโอห์ม",
  // Data round 2026-09-24 (M Bar 9K, SALTHUB "Resistance 1.0 Ω"): the locked label word for a single Ω value (THAI_STYLE §3).
  Resistance: "ค่าโอห์ม",
  Charging: "การชาร์จ",
  "E-liquid capacity": "ความจุน้ำยา",
  "Nicotine strength": "นิโคติน",
  "Pod capacity": "ความจุหัวพอต",
  "Cartridge capacity": "ความจุหัวพอต",
  Capacity: "ความจุ",
  Materials: "วัสดุ",
  Airflow: "ช่องลม",
  // Article round 02/10 (Caliburn G5 rows from UWELL's spec sheet).
  Weight: "น้ำหนัก",
  "Battery life": "ระยะเวลาใช้งาน",
  Variant: "รุ่นย่อย",
  "Charge time": "เวลาชาร์จ",
  Chipset: "ชิป",
  Dimensions: "ขนาด",
  // Owner 2026-09-15: "ประเภท", not "แบบพอต" — the value already says พอตซิสเต็ม / พอตใช้แล้วทิ้ง.
  Format: "ประเภท",
  "Output voltage": "แรงดันไฟ",
  "Power modes": "โหมดวัตต์",
  "Draw modes": "โหมดการสูบ",
  "Output modes": "โหมดการทำงาน",
  // Owner 2026-09-15: "ระบบยิง" (pairs with the locked "ปุ่มยิง"), not "การสั่งงาน".
  Activation: "ระบบยิง",
  Firing: "ระบบยิง",
  "Anti-leak system": "ระบบกันรั่ว",
  "Compatible device": "ใช้ได้กับ",
  "Compatible devices": "ใช้ได้กับ",
  Control: "การควบคุม",
  "Control system": "การควบคุม",
  "Fill style": "การเติมน้ำยา",
  "Flavor range": "รสชาติ",
  "Flavor switching": "การสลับรส",
  "Flavor system": "ระบบปรับรสชาติ",
  "Included pod": "หัวพอตในกล่อง",
  "Puffs per cartridge": "พัฟต่อหัวพอต",
  "Puffs per pod": "พัฟต่อหัวพอต",
  "Status indicator": "ไฟบอกสถานะ",
  // Site-wide template round batch 1c (03/10, thai-copy): G4 Pro / G4 Pro KOKO touchscreen rows.
  Touch: "การแตะจอ",
  "Screen themes": "ธีมหน้าจอ",
  Settings: "การตั้งค่า",
};

/** The Thai chip label for an English data label, or the label itself when there is no entry. */
export function specLabelTh(label: string): string {
  return SPEC_LABELS_TH[label] ?? label;
}
