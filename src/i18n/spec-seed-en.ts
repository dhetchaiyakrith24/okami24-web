/**
 * OKami24 — English text for the Thai spec rows of the warehouse-listed products (line-1 side chat, 21/10).
 *
 * The products built from the Shipnity seed (`src/data/shipnity-seed/active-catalog-to-product-master.ts`)
 * store their `specifications` label and value in Thai, while every other product stores English and lets
 * spec-labels-th.ts / product-copy-th.ts overlay Thai. English and Chinese visitors therefore saw Thai chips
 * ("ชนิดนิโคติน", "สูงสุด 20,000" — locale-hydration-scan FAIL on eliquid-64 / eliquid-1 / pod-149 …).
 * This is the mirror overlay: keyed by the exact Thai data string, read by SpecSheet.tsx and CompareTool.tsx
 * when the locale is NOT Thai. Chinese visitors get the English text, as they already do for every English
 * data label (spec-labels-th.ts header). Thai visitors are untouched. Labels reuse the English words of
 * spec-labels-th.ts where one exists, so one field keeps one name across products.
 * Values: a faithful translation of the Thai string — no fact added or dropped; a string without Thai
 * needs no entry.
 */
const LABELS_EN: Record<string, string> = {
  "จำนวนพัฟที่ระบุ": "Rated puffs",
  "ความจุ": "Capacity",
  "ความจุน้ำยา": "E-liquid capacity",
  "ความจุหัวพอต": "Pod capacity",
  "ขนาดขวด": "Bottle size",
  "ใช้ได้กับ": "Compatible devices",
  "ใช้ได้กับอุปกรณ์": "Compatible devices",
  "ใช้ได้กับก้าน": "Compatible sticks",
  "แบตเตอรี่": "Battery",
  "แบตเตอรี่ตัวสูบ (Holder)": "Holder battery",
  "แบตเตอรี่กล่องชาร์จ (Pocket Charger)": "Pocket Charger battery",
  "ชนิดนิโคติน": "Nicotine type",
  "นิโคติน": "Nicotine strength",
  "การชาร์จ": "Charging",
  "คอยล์": "Coil",
  "รุ่นคอยล์": "Coil models",
  "คอยล์ในกล่อง": "Coil included",
  "การติดตั้งคอยล์": "Coil fitting",
  "จำนวนก้านต่อการชาร์จ 1 ครั้ง": "Sticks per charge",
  "เวลาต่อก้าน": "Time per stick",
  "ค่าโอห์ม": "Resistance",
  "โหมดการทำงาน": "Output modes",
  "วัสดุ": "Materials",
  "ช่องลม": "Airflow",
  "จำนวนต่อกล่อง": "Pack size",
  "ขายเป็น": "Sold as",
  "ขนาด": "Dimensions",
  "ขนาดหัว": "Pod dimensions",
  "ไฟสถานะ": "Status indicator",
  "โครงสร้าง": "Construction",
  "อุณหภูมิ": "Temperature",
  "สีตัวเครื่อง": "Device colours",
  "ระบบอุ่น": "Heating system",
  "ฟีเจอร์": "Features",
  "น้ำหนัก": "Weight",
  "น้ำหนักหัว": "Pod weight",
  "ตัวเครื่อง": "Device",
  "ชนิดหัวพอต": "Pod type",
  "การใช้งาน": "Use",
  "กำลังไฟที่แนะนำ": "Recommended wattage",
};

const VALUES_EN: Record<string, string> = {
  "สูงสุด 12,000": "Up to 12,000",
  "สูงสุด 18,000": "Up to 18,000",
  "สูงสุด 20,000": "Up to 20,000",
  "หัวละสูงสุด 10,000": "Up to 10,000 per pod",
  "หัวละสูงสุด 15,000": "Up to 15,000 per pod",
  "หัวละสูงสุด 16,000": "Up to 16,000 per pod",
  "หัวละสูงสุด 20,000": "Up to 20,000 per pod",
  "ปรับได้": "Adjustable",
  "ปรับได้ 3 ระดับ หมุนที่ก้นพอต": "3 levels, turned at the base of the pod",
  "600mAh ชาร์จได้": "600mAh, rechargeable",
  "2700mAh ชาร์จเต็มประมาณ 135 นาที": "2700mAh, full charge in about 135 minutes",
  "3.0mL เติมด้านข้าง": "3.0mL, side fill",
  "3.5mL (รุ่นมาตรฐาน) เติมด้านบน": "3.5mL (standard version), top fill",
  "3mL (เติมน้ำยาได้)": "3mL (refillable)",
  "2.0–3.0 mL แล้วแต่ชนิดหัว GPP (เติมข้าง/เติมบน · RDL/MTL)": "2.0–3.0 mL depending on the GPP pod type (side/top fill · RDL/MTL)",
  "5V / 2A ชาร์จเต็มประมาณ 2.5 ชั่วโมง": "5V / 2A, full charge in about 2.5 hours",
  "USB-C ราว 30 นาที": "USB-C, about 30 minutes",
  "ชาร์จซ้ำได้ผ่าน USB-C": "Rechargeable via USB-C",
  "ผ่านสาย USB-C (มีในกล่อง)": "USB-C cable (in the box)",
  "Dual Nex Mesh (mesh สองตัว)": "Dual Nex Mesh (two mesh coils)",
  "คอยล์คู่ ทำงานพร้อมกัน": "Dual coils working together",
  "แบบกดล็อก (press-fit) รองรับคอยล์ตระกูล TPP": "Press-fit, takes the TPP coil family",
  "หัวพอตเปล่า ต้องซื้อคอยล์ ITO แยก": "Empty pod, ITO coils sold separately",
  "หัวพอตเปล่า ใช้กับคอยล์ ITO": "Empty pod, takes ITO coils",
  "หัวพอตเปล่า ใช้กับคอยล์ SPL10": "Empty pod, takes SPL10 coils",
  "หัวพอตเปล่า ใช้กับคอยล์ TPP": "Empty pod, takes TPP coils",
  "เปลี่ยนคอยล์แยกได้": "Replaceable coil",
  "DRAG 3 Kit, DRAG X Plus Kit (ใช้ร่วมกับคอยล์ตระกูล TPP)": "DRAG 3 Kit, DRAG X Plus Kit (with the TPP coil family)",
  "GK2 (ทุกค่า) · G2 (0.8/1.2Ω)": "GK2 (all values) · G2 (0.8/1.2Ω)",
  "เครื่อง KS Quikpro": "KS Quikpro device",
  "IQOS ILUMA (ทุกรุ่น) เท่านั้น — ใช้กับรุ่นก่อนหน้า ILUMA ไม่ได้": "IQOS ILUMA (every model) only — not earlier models",
  "TEREA เท่านั้น": "TEREA only",
  "ตัวเรือนทองเหลือง คอยล์ mesh เดี่ยว": "Brass housing, single mesh coil",
  "ชิ้นเดียว พกใส่กระเป๋าได้ ผิวอะลูมิเนียม": "One piece, pocket-sized, aluminium finish",
  "สูง 76.7 mm · หนา 24.4 mm": "76.7 mm tall · 24.4 mm thick",
  "Autostart / Autostop · FlexPuff (ได้พัฟเพิ่มสูงสุด 4 ครั้งเมื่อก้านยังไม่หมด)": "Autostart / Autostop · FlexPuff (up to 4 extra puffs when the stick is not finished)",
  "Smart Induction · จอ LED": "Smart Induction · LED display",
  "LED หลายสี": "Multi-colour LED",
  "อะลูมิเนียมอัลลอย + PPSU + PEEK": "Aluminium alloy + PPSU + PEEK",
  "High กับ Low กดปุ่มเดียวสลับได้": "High and Low, switched with one button",
  "Normal สูบนุ่ม ใช้ได้นานขึ้น / Turbo รสเต็ม ไอหนา": "Normal: smooth draw, lasts longer / Turbo: full flavour, dense vapour",
  "1 ซอง (20 ก้าน)": "1 pack (20 sticks)",
  "2 หัว": "2 pods",
  "5 หัว (บรรจุแยกซองละหัว)": "5 pods (each sealed separately)",
  "หัวพอตบรรจุสำเร็จ คอยล์ในตัว (ระบบปิด ใช้หมดแล้วเปลี่ยนหัวใหม่)": "Prefilled pod, built-in coil (closed system: replace the pod when empty)",
  "ใช้จนหมดแล้วเปลี่ยนหัวใหม่": "Use until empty, then replace the pod",
  "ปรับได้ 3–6 นาที": "Adjustable, 3–6 minutes",
  "35–40 ก้าน": "35–40 sticks",
  "สูงสุด 20 ก้าน": "Up to 20 sticks",
  "สูงสุด 20 ก้านติดกัน": "Up to 20 sticks in a row",
  "ปรับได้ 200–300°C": "Adjustable, 200–300°C",
  "10-16W (เครื่องปรับให้เองตามโอห์ม)": "10-16W (set by the device from the coil resistance)",
  "83 กรัม": "83 g",
};

/** The English label for a Thai seed label ("กำลังไฟที่แนะนำ (0.8Ω)" keeps its bracket), or the label itself. */
export function specLabelEn(label: string): string {
  const exact = LABELS_EN[label];
  if (exact) return exact;
  const m = /^(.+?) (\(.+\))$/.exec(label);
  if (m && LABELS_EN[m[1]]) return `${LABELS_EN[m[1]]} ${m[2]}`;
  return label;
}

/** The English value for a Thai seed value, or the value itself. */
export function specValueEn(value: string): string {
  return VALUES_EN[value] ?? value;
}
