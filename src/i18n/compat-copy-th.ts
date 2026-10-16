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
import { thaiTypography } from "@/lib/thai-typography";

export const COMPAT_LABELS_TH: Record<string, string> = {
  "UWELL GPP cartridge platform": "หัวพอต UWELL GPP",
  "Caliburn G3 pod": "หัวพอต Caliburn G3",
  "ARGUS top-fill cartridge platform": "หัวพอต ARGUS แบบเติมด้านบน",
  // Batch 2d (04/10): DRAG S3 / X3 cartridge, from VOOPOO's own pages (thai-copy).
  "PnP X Cartridge (PnP X coils)": "หัวพอต PnP X Cartridge ใช้คอยล์ PnP X",
  "DRAG-series coil pod": "หัวพอตสาย DRAG (เปลี่ยนคอยล์ได้)",
  "UFORCE-X Tank II (PnP X coils)": "ถังน้ำยา UFORCE-X Tank II ใช้คอยล์ PnP X",
  // Batch 2e (04/10): ARGUS G4 mini, from VOOPOO's own page (thai-copy).
  "ARGUS Multi-Ohm Cartridge": "หัวพอต ARGUS Multi-Ohm Cartridge",
  "VINCI cartridge platform": "หัวพอต VINCI",
  "M Switch Pod cartridge": "หัวพอต M Switch Pod",
  "M Switch Kit device body": "ตัวเครื่อง M Switch Kit",
  "M Bar-compatible reusable devices": "เครื่องใช้ซ้ำที่รองรับ M Bar",
  "RELX Creator Pod": "หัวพอต RELX Creator Pod",
  "Muro Connector pod": "หัวพอต Muro Connector",
};

export const COMPAT_NOTES_TH: Record<string, string> = {
  // Batch 2d (04/10): DRAG S3 / X3 cartridge note (thai-copy).
  "PnP X Cartridge DTL (5mL) in the kit; takes every PnP X coil.": "ในกล่องมีหัวพอต PnP X Cartridge DTL 5mL ใช้คอยล์ PnP X ได้ทุกตัว",
  "Shared top-fill pod platform used across most current Caliburn devices; resistance options sold separately.":
    "เติมด้านบน ใช้หัวตัวเดียวกับ Caliburn รุ่นปัจจุบันส่วนใหญ่ โอห์มอื่นซื้อแยก",
  "Every GPP cartridge fits, side-refill or top-refill (UWELL); resistance options sold separately.":
    "ใส่หัว GPP ได้ทุกหัว ทั้งเติมด้านข้างและเติมด้านบน (UWELL) โอห์มอื่นซื้อแยก",
  "Legacy G3-series pod, still supported on select current-generation devices.": "หัวรุ่นก่อน เครื่องรุ่นปัจจุบันบางรุ่นยังใช้ได้",
  // Only the three Caliburn devices whose spec sheet carries a 2A charging figure still have this
  // note in the data (owner 2026-09-15: the other seven lost it in every language — unverifiable).
  "5V/2A charging on current-generation devices.": "ชาร์จ 5V/2A",
  "5V/2A charging.": "ชาร์จ 5V/2A",
  "5V/3A charging.": "ชาร์จ 5V/3A",
  // Round p63 (16/10): Caliburn G3 — UWELL's page says "2A Fast Charging", no voltage.
  "2A fast charging.": "ชาร์จเร็ว 2A",
  "Caliburn G3 integrated coil cartridges.": "หัวพอต Caliburn G3 ที่มีคอยล์ในตัว",
  "Takes every PnP X coil; PnP X 0.15Ω and 0.3Ω come in the kit.": "ใช้คอยล์ PnP X ได้ทุกตัว ในกล่องมี 0.15Ω และ 0.3Ω",
  "0.4–3.0Ω resistance range.": "ช่วงโอห์ม 0.4–3.0Ω",
  "0.1–3.0Ω resistance range.": "ช่วงโอห์ม 0.1–3.0Ω",
  "0.3–3.0Ω resistance range.": "ช่วงโอห์ม 0.3–3.0Ω",
  "0.7Ω included.": "ในกล่องมีหัว 0.7Ω",
  // ARGUS G3 mini and VINCI S — the 1A figure is the product's own `attributes.chargingType`.
  "Lower-amperage charging on this model.": "ชาร์จด้วยไฟ 1A",
  "Cartridge naming not independently confirmed.": "",
  // Batch 2e (04/10): ARGUS G4 mini, from VOOPOO's own page (thai-copy).
  "Two in the kit.": "ในกล่องมีมาให้สองหัว",
  // Batch 2e (04/10): ARGUS G4 mini, from VOOPOO's own page (thai-copy).
  "5V/1.5A charging.": "ชาร์จ 5V/1.5A",
  // Batch 2f (05/10): ARGUS P3 / VMATE i3, from VOOPOO's own pages (thai-copy).
  "ARGUS Snap Cartridge": "หัวพอต ARGUS Snap Cartridge",
  "0.4Ω and 0.7Ω in the kit.": "ในกล่องมีมาให้ทั้ง 0.4 โอห์มและ 0.7 โอห์ม",
  "VMATE Top Fill Cartridge": "หัวพอต VMATE Top Fill Cartridge",
  "0.7Ω in the kit; VMATE Cartridge V2 fits too.": "ในกล่องมีหัว 0.7 โอห์มมาให้ และใช้ VMATE Cartridge V2 ได้ด้วย",
  "Rechargeable via USB-C.": "ชาร์จซ้ำได้",
};

/** Thai label for a compatibility entry, or the data label when there is no entry. */
export function compatLabelTh(label: string): string {
  return thaiTypography(COMPAT_LABELS_TH[label] ?? label);
}

/** Thai note for a compatibility entry: the overlay string (possibly "" = show nothing), or the
 *  data note when there is no entry. */
export function compatNoteTh(note: string | undefined): string | undefined {
  if (note === undefined) return undefined;
  return thaiTypography(note in COMPAT_NOTES_TH ? COMPAT_NOTES_TH[note] : note);
}

/**
 * Round 30.4ค batch 7 (owner-approved 2026-09-15): the cited fact under each card in the
 * "ใช้ร่วมกับเครื่องนี้ได้" / "ใช้ได้กับเครื่องเหล่านี้" block (`DeviceConsumableEdge.evidence` in
 * src/data/catalog-relationships.ts). Keyed by the full English evidence string; read by
 * CompatibleProducts.tsx when the locale is Thai. The same string serves both directions of an
 * edge, so each Thai note reads correctly on the device page and on the consumable page. The
 * evidence tier stays as stated ("หน้าร้านค้าปลีก" is never promoted to "ทางการ"); numbers, brand
 * system names and quoted alt text are kept character for character. Edges whose other endpoint
 * is not yet published (IQOS / LAMBDA / PnP X / G2-generation pods) have no entry yet — they are
 * not visible on the storefront.
 */
const GPP_MATCH_TH = "ตัวเลือกโอห์มของหัวพอตรุ่นนี้ที่ OKami24 ลงไว้ (0.4/0.6/0.9/1.2Ω mesh) ตรงกับที่ UWELL ระบุครบทั้ง 4 ค่า";
const GPP_MATCH_EN = " The cartridge's four resistances (0.4/0.6/0.9/1.2Ω meshed) match this record's active options exactly.";

export const COMPAT_EVIDENCE_TH: Record<string, string> = {
  ["UWELL: its own official page states all G Pod Platform cartridges are compatible with CALIBURN GPP series devices, and the GPP cartridge ships in the kit." + GPP_MATCH_EN]:
    "UWELL ระบุในหน้าเว็บทางการของ Caliburn G5 ว่าหัวพอต G Pod Platform ทุกตัวใช้กับเครื่องสาย CALIBURN GPP ได้ และในกล่องมีหัวพอต GPP มาให้ " + GPP_MATCH_TH,
  ["UWELL: UWELL states all GPP cartridges are compatible with CALIBURN G5, G4 and G3 series devices." + GPP_MATCH_EN]:
    "UWELL ระบุว่าหัวพอต GPP ทุกตัวใช้กับเครื่อง CALIBURN สาย G5 G4 และ G3 ได้ " + GPP_MATCH_TH,
  ["UWELL: listed by name in UWELL's own G Pod Platform device enumeration." + GPP_MATCH_EN]:
    "UWELL ระบุชื่อเครื่องรุ่นนี้ไว้ในรายชื่อเครื่องที่ใช้ G Pod Platform บนหน้าเว็บทางการ " + GPP_MATCH_TH,
  ["UWELL: its own official page states the device is fully compatible with both the previous and upgraded CALIBURN GPP cartridges." + GPP_MATCH_EN]:
    "UWELL ระบุในหน้าเว็บทางการของเครื่องรุ่นนี้ว่าใช้ได้ทั้งหัวพอต CALIBURN GPP รุ่นก่อนและรุ่นใหม่ " + GPP_MATCH_TH,
  ["UWELL: listed by name in UWELL's own G Pod Platform device enumeration; UWELL states the upgraded cartridges are also compatible with the CALIBURN G3 series." + GPP_MATCH_EN]:
    "UWELL ระบุชื่อเครื่องรุ่นนี้ไว้ในรายชื่อเครื่องที่ใช้ G Pod Platform บนหน้าเว็บทางการ และระบุว่าหัวพอตรุ่นใหม่ใช้กับเครื่อง CALIBURN สาย G3 ได้ด้วย " + GPP_MATCH_TH,
  "Retailer listings state the VMATE i3 takes both the VMATE Top Fill cartridge (0.4/0.7/1.0Ω, 3ml) and the VMATE Cartridge V2, and the kit ships with a Top Fill 0.7Ω. An EU retailer states the Vmate V3 Top Fill 3ml is compatible with all kits in the Vmate and V.THRU range.":
    "หน้าร้านค้าปลีกระบุว่า VMATE i3 ใส่ได้ทั้งหัวพอต VMATE Top Fill (0.4/0.7/1.0Ω 3ml) และ VMATE Cartridge V2 โดยในกล่องมีหัว Top Fill 0.7Ω มาให้ ร้านค้าปลีกในยุโรปรายหนึ่งระบุว่า Vmate V3 Top Fill 3ml ใช้ได้กับทุกรุ่นในสาย Vmate และ V.THRU",
  'SALTHUB\'s own M Switch Kit page presents the M Switch Pod as its cartridge (product-image alt text: "M Switch Kit compatible cartridge"), and the two pages list an identical 16-flavour set.':
    "หน้า M Switch Kit บนเว็บทางการของ SALTHUB แสดง M Switch Pod เป็นหัวพอตของเครื่องรุ่นนี้ (ข้อความกำกับรูปสินค้าเขียนว่า “M Switch Kit compatible cartridge”) และรายชื่อรส 16 รสของทั้งสองหน้าตรงกัน",
  // Round 30.4ข close (owner, 2026-09-17): the two G/G2-generation pod ↔ coil edges (coil-55 · coil-74
  // ↔ coil-53) are published, so the coil and both pod pages showed these notes in English on the
  // Thai site — the accessories pages sat outside the "53 product pages" scope of earlier rounds.
  // Owner-supplied Thai; vocabulary checked by thai-copy against THAI_STYLE §3.
  "The Caliburn G2 replacement pod is designed for UWELL's Caliburn G and G2 coils, which is the line this 1.0Ω coil belongs to. Note this generation is NOT interchangeable with the later GPP platform used by the G3/G4/G5 devices.":
    // "ใช้กับระบบหัวพอต GPP ของเครื่อง…" (not the owner's first "ใช้ข้ามกับ…ที่อยู่ในเครื่อง"): at 390px
    // the card's text-xs column broke the locked word "หัวพอต" in two ("ระบบหัว | พอต GPP"); this
    // wording breaks before "GPP" instead (measured, _incoming/30.4b/k7-variants.json A3).
    "หัวพอต Caliburn G2 ออกแบบมาสำหรับคอยล์ตระกูล Caliburn G และ G2 ซึ่งเป็นตระกูลเดียวกับคอยล์ 1.0 โอห์มตัวนี้ รุ่นนี้ใช้กับระบบหัวพอต GPP ของเครื่อง G3/G4/G5 ไม่ได้",
  "The Caliburn X pod is stated to take Caliburn G or G2 coils (0.8/1.0/1.2Ω), which is the line this 1.0Ω coil belongs to. It is explicitly not for the A or original Caliburn series.":
    // "หน้าร้านค้าปลีก", not "แบรนด์": the source is a retailer listing (tier "retailer") — the
    // evidence tier is never promoted in translation (file header; thai-copy 2026-09-17).
    "หน้าร้านค้าปลีกระบุว่าหัวพอต Caliburn X ใช้คอยล์ตระกูล Caliburn G หรือ G2 ได้ (0.8/1.0/1.2Ω) ซึ่งเป็นตระกูลเดียวกับคอยล์ 1.0 โอห์มตัวนี้ และระบุชัดว่าใช้กับตระกูล A หรือ Caliburn รุ่นแรกไม่ได้",
};

/** Thai evidence note for a compatibility card, or the data string when there is no entry. */
export function compatEvidenceTh(evidence: string): string {
  return thaiTypography(COMPAT_EVIDENCE_TH[evidence] ?? evidence);
}
