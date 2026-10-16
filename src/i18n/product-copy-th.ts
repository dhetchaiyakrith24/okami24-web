/**
 * OKami24 — Phase 3.2.2: Thai translations of legacy product tagline/shortDescription.
 *
 * Presentation-layer only, keyed by `Product.slug` — src/data/products/*.ts stays the canonical
 * English source (untouched). Shown on the product card and the product page when the locale is
 * Thai — since round 30.4 (wiring A, owner 2026-09-12) INSTEAD of the English pair, which used to
 * stay above it; a slug without an entry keeps the English — see ProductHero.tsx. Model/brand/technical
 * terms (mAh, W, mL, GENE.AI, Pro-FOCS, TFT, RGB, Type-C, KOKO, product line names, etc.) are
 * kept as-is, matching how the rest of the site treats brand/model/spec vocabulary; only the
 * descriptive sentence structure is translated. Pure translation of the existing English
 * marketing copy — no new claims, specs, or numbers introduced beyond what the English already
 * states.
 *
 * Not every one of the 28 legacy products necessarily needs an entry forever — this covers all
 * of them as of Phase 3.2.2. If a slug is missing (e.g. a future new legacy product), the Thai
 * block simply doesn't render for it — English still shows, so nothing breaks.
 */

export interface ProductCopyTh {
  tagline: string;
  shortDescription: string;
  /** Round 30.4 batches 5/6 (owner-approved card by card): the "จุดเด่น" feature cards in Thai,
   *  keyed by the feature's `id` in src/data/products/*.ts. A card without an entry keeps its
   *  English text; an entry without `title` keeps the English title (a feature name the brand
   *  itself coined — Smart Triple-Tap Control, Pro-FOCS — stays English by THAI_STYLE layer 1).
   *  Read by FeatureGrid.tsx when the locale is Thai. */
  features?: Record<string, { title?: string; description: string; subline?: string; captions?: string[] }>;
  /** Round 30.4ค batch 2 (owner-approved value by value, 2026-09-15): the SpecSheet chip VALUES in
   *  Thai, keyed by `Specification.key` (unique within one product). Only values that contain
   *  words have an entry — a value that is just a number/unit/model name ("5–35W", "USB-C",
   *  "GENE.TT 3.0") keeps the data string; "—" stands for a value the data records as "Not
   *  independently confirmed" (the chip's "ยังไม่ยืนยัน" badge already says so). Numbers, units
   *  and model names inside a Thai value are the data's, verbatim. Read by SpecSheet.tsx and
   *  CompareTool.tsx when the locale is Thai; the label overlay is spec-labels-th.ts. */
  specifications?: Record<string, string>;
  /** Round 30.4ค batch 4 (owner-approved sentence by sentence, 2026-09-15): the "เหมาะกับใคร"
   *  bullets in Thai, keyed by the bullet's index in `Product.whoIsThisFor` (the data has no id
   *  for them). Written to stand on their own — index 0 is also the note /compare shows under a
   *  product. A comparison the data cannot back ("smallest", "biggest screen in the line") is not
   *  translated into Thai. Read by CompatibilitySection.tsx and CompareTool.tsx when the locale
   *  is Thai; the compatibility block's own labels/notes are in compat-copy-th.ts. */
  whoIsThisFor?: Record<number, string>;
  /** Round 30.4ค batch 5 (owner-approved pair by pair, 2026-09-15): the product page's own FAQ
   *  (Product.faqs) in Thai, keyed by the FAQ item's `id` (unique across the catalog and disjoint
   *  from faq-copy.ts's ids). Questions read the way a customer asks them, answers stay inside
   *  what the spec sheet can back — a claim the data cannot confirm points to LINE instead. Read
   *  by ProductFAQ.tsx when the locale is Thai. */
  faqs?: Record<string, { question: string; answer: string }>;
}

export const PRODUCT_COPY_TH: Record<string, ProductCopyTh> = {
  "caliburn-g5": {
    faqs: {
      "g5-pods": {
        question: "Caliburn G5 ใช้หัวพอตรุ่นไหน",
        answer: "หัวพอต UWELL GPP ใส่ได้ทุกหัว ทั้งแบบเติมด้านข้างและเติมด้านบน หัว GPP มีหลายโอห์ม",
      },
      "g5-battery-life": {
        question: "Caliburn G5 ชาร์จครั้งเดียวใช้ได้กี่วัน",
        answer: "UWELL ระบุว่าแบต 1600mAh ในตัว ชาร์จครั้งเดียวใช้งานทั่วไปได้สูงสุด 6 วัน ใช้จริงได้กี่วันขึ้นอยู่กับว่าสูบบ่อยแค่ไหน ตั้งกี่วัตต์ ช่องลมเปิดแค่ไหน และเปิดจอบ่อยแค่ไหน",
      },
    },
    whoIsThisFor: {
      0: "อยากได้ Caliburn รุ่นปัจจุบัน แต่ยังไม่อยากขยับไปพอตคิทที่วัตต์สูงกว่านี้",
      1: "เคยใช้พอตที่มีแต่ปุ่ม อยากขยับมาเครื่องที่มีจอและสลับโหมดด้วยการแตะ",
      2: "ปกติสูบแน่นแบบ MTL แต่บางวันอยากโล่งขึ้นหน่อย เปลี่ยนแค่หัวพอต GPP คนละโอห์มก็ได้",
    },
    specifications: {
      battery: "1600mAh ในตัว",
      screen: "จอสี 0.85 นิ้ว",
      pod: "3mL (2mL ในเวอร์ชัน TPD และ CRC) เติมด้านข้างหรือด้านบน แล้วแต่เวอร์ชันที่วางขาย",
      "included-pod": "3 หัว หนึ่งในนั้นคือ GPP Alpha 0.6 โอห์ม (แบบหัวต่างกันตามเวอร์ชันที่วางขาย)",
      "battery-life": "ใช้งานทั่วไปได้สูงสุด 6 วัน (ตัวเลขของ UWELL)",
      airflow: "ด้านข้างเครื่อง ปรับได้ละเอียดแบบไม่มีขั้น ตั้งแต่ MTL ถึง RDL",
      materials: "PCTG และอะลูมิเนียมอัลลอยผิวด้าน",
      weight: "65 กรัม",
      control: "Smart Triple-Tap Control (แตะเพื่อสลับโหมด)",
      "pod-compat": "UWELL GPP",
    },
    tagline: "Smart Triple-Tap Control แตะสามครั้งสลับโหมดวัตต์ ไม่ต้องกดปุ่ม",
    shortDescription:
      "รุ่นเรือธงล่าสุดของตระกูล Caliburn: พอตซิสเต็มแบตเตอรี่ 1600mAh พร้อมจอสี 0.85 นิ้ว และระบบสั่งงานด้วยการแตะสามครั้งสำหรับสลับโหมดโดยไม่ต้องใช้ปุ่ม",
  },
  "caliburn-g5-lite": {
    faqs: {
      "g5-lite-diff": {
        question: "G5 Lite ต่างจาก G5 ตรงไหน",
        answer: "แบตเตอรี่และวัตต์สูงสุดเท่า G5 ที่ต่างคือ Lite ไม่มีจอสีและระบบแตะสามครั้ง (Smart Triple-Tap Control) การใช้งานเลยง่ายกว่า",
      },
    },
    whoIsThisFor: {
      0: "อยากได้แบตอึดเท่า G5 แต่ไม่ได้ใช้จอสีกับระบบแตะ เลยไม่อยากจ่ายส่วนนั้น",
      1: "เพิ่งเริ่มใช้พอตซิสเต็ม อยากได้เครื่องแบบง่าย ๆ ไม่มีอะไรให้ตั้งค่าเยอะ",
    },
    specifications: {
      battery: "1600mAh",
      "pod-compat": "UWELL GPP",
      "battery-life": "ชาร์จครั้งเดียวใช้ได้สูงสุด 6 วัน (ตัวเลขของ UWELL)",
      "pod-resistance": "หัวพอต 0.4 โอห์ม",
      "airflow": "ปรับได้ 2 แบบ กลับด้านหัวพอต และปรับละเอียดแบบไม่มีขั้น ตั้งแต่ MTL ถึง RDL",
      "screen": "ไฟ LED 4 ขีด เปลี่ยนสีตามระดับแบต",
    },
    tagline: "G5 แบบเรียบง่าย แบตอึด พกใช้ทุกวัน",
    shortDescription:
      "รุ่นที่ตัดทอนความซับซ้อนลงจาก G5 ยังคงแบตเตอรี่ 1600mAh และสูงสุด 35 วัตต์เท่าเดิม แต่ปรับระบบควบคุมให้เรียบง่ายขึ้น",
  },
  "caliburn-g5-lite-se": {
    whoIsThisFor: {
      0: "ชอบ G5 Lite อยู่แล้ว แค่อยากได้ชุดสีที่ต่างจากรุ่นมาตรฐาน",
    },
    specifications: {
      battery: "1600mAh",
      "battery-life": "ชาร์จครั้งเดียวใช้ได้สูงสุด 6 วัน (ตัวเลขของ UWELL)",
      "pod-resistance": "หัวพอต 0.4 โอห์ม",
      "airflow": "ปรับได้ 2 แบบ กลับด้านหัวพอต และปรับละเอียดแบบไม่มีขั้น ตั้งแต่ MTL ถึง RDL",
      "screen": "ไฟ LED 4 ขีด เปลี่ยนสีตามระดับแบต",
      "variant": "ทูโทน หนังคู่กับผิวลายริ้ว",
    },
    tagline: "G5 Lite ตัวเครื่องเดิม ในชุดสีรุ่นพิเศษ",
    shortDescription: "ใช้แบตเตอรี่ 1600mAh และสูงสุด 35 วัตต์เท่ากับ G5 Lite ต่างกันที่ชุดสีรุ่นพิเศษ",
  },
  "caliburn-g4-pro-koko": {
    faqs: {
      "g4-pro-koko-pods": {
        question: "ใช้หัวพอต Caliburn รุ่นก่อนได้ไหม",
        answer: "ได้ รุ่นนี้ใส่ได้ทั้งหัวพอต GPP รุ่นปัจจุบัน และหัวพอต Caliburn G3 ที่เป็นหัวรุ่นก่อน",
      },
    },
    whoIsThisFor: {
      0: "อยากได้ Caliburn ที่มีจอทัชและมีโหมดให้เลือก โดยไม่ต้องไปถึงพอตคิท",
      1: "ชอบเครื่องทรงกล่อง และอยากแต่งให้เป็นของตัวเอง ทั้งสุ่มเก็บธีมหน้าจอและตั้งชื่อเครื่องเอง",
    },
    specifications: {
      battery: "2000mAh ในตัว",
      "battery-life": "ใช้ได้สูงสุด 10 วัน (ตัวเลขจากแล็บของ UWELL)",
      "charge-time": "USB-C 5V/2.5A",
      output: "35W",
      screen: "จอทัชสกรีน 2.0 นิ้ว",
      touch: "แตะแม่นยำมากกว่า 99.99% ตอบสนองภายใน 0.2 วินาที (ตัวเลขจากแล็บของ UWELL)",
      modes: "Storm / Waves / Customize (โหมด Customize ตั้งวัตต์ช่วงต้น กลาง และท้ายพัฟได้เอง)",
      themes: "ธีมหน้าจอแบบสุ่ม 5 แบบ",
      settings: "8 ภาษา (ไม่มีภาษาไทย) · ตั้งชื่อเครื่องผ่าน Clean UI · ความสว่าง เวลาปิดจอ แอนิเมชัน โหมดประหยัดแบต รีเซ็ตเครื่อง",
      airflow: "ปรับช่องลมได้ละเอียดแบบไม่มีขั้น",
      "flavor-tech": "Pro-FOCS 4.0",
      pod: "3mL (2mL ในเวอร์ชัน TPD และ CRC)",
      "included-pod": "คอยล์ mesh FeCrAl แล้วแต่เวอร์ชัน · INT และ FDA 0.4Ω + 0.6Ω เติมด้านข้าง · TPD 0.4Ω + 0.9Ω เติมด้านบน · CRC 0.4Ω + 0.6Ω เติมด้านบน",
      "pod-compat": "UWELL GPP 0.4Ω–1.2Ω เติมด้านบนหรือด้านข้าง ทั้งหัวรุ่นก่อนและรุ่นใหม่ (หัว G3 ก็ใช้ได้) · เติมได้ขณะหัวเสียบอยู่",
      "anti-leak": "ระบบกันรั่ว U²",
      materials: "อะลูมิเนียม ABS IML และ PCTG",
      dimensions: "85.8 × 50 × 23 mm (82.7 mm ในเวอร์ชัน TPD และ CRC)",
      weight: "ประมาณ 93 กรัม",
    },
    tagline: "จอทัชสกรีนรุ่นแรกในสาย KOKO",
    shortDescription:
      "พอตแบตเตอรี่ 2000mAh 35 วัตต์ จอทัชสกรีน 2 นิ้ว ระบบปรับรสชาติ Pro-FOCS 4.0 สลับโหมดการสูบได้ทั้ง Storm / Waves / Custom",
  },
  "caliburn-g4-pro": {
    whoIsThisFor: {
      0: "ชอบจอทัชใหญ่ ๆ กดปรับอะไรบนจอก็ง่าย ไม่ต้องเพ่ง",
      1: "ละเอียดเรื่องลม อยากปรับช่องลมทีละนิดจนได้จุดที่ชอบ",
    },
    specifications: {
      battery: "1800mAh ในตัว",
      "battery-life": "ใช้ได้สูงสุด 7 วัน (ตัวเลขของ UWELL)",
      "charge-time": "USB-C 5V/2.5A",
      output: "35W",
      screen: "จอทัชสกรีน 2.51 นิ้ว",
      touch: "แตะแม่นยำมากกว่า 99.99% ตอบสนองภายใน 0.2 วินาที (ตัวเลขจากแล็บของ UWELL)",
      modes: "Storm / Waves / Custom (โหมด Custom ตั้งวัตต์ช่วงต้น กลาง และท้ายพัฟได้เอง)",
      themes: "ธีมหน้าจอ 6 แบบ: พร้อมใช้ 3 แบบ อีก 3 แบบปลดล็อกเมื่อครบ 5,000 / 10,000 / 20,000 พัฟ",
      settings: "8 ภาษา (ไม่มีภาษาไทย) · ตั้งชื่อเครื่องผ่าน Clean UI · ความสว่าง เวลาปิดจอ แอนิเมชัน โหมดประหยัดแบต",
      airflow: "ปรับช่องลมได้ละเอียดแบบไม่มีขั้น",
      "flavor-tech": "Pro-FOCS 4.0",
      pod: "3mL (2mL ในเวอร์ชัน TPD และ CRC)",
      "included-pod": "คอยล์ mesh FeCrAl แล้วแต่เวอร์ชัน · INT และ FDA 0.4Ω + 0.6Ω เติมด้านข้าง · TPD 0.4Ω + 0.9Ω เติมด้านบน · CRC 0.4Ω + 0.6Ω เติมด้านบน",
      "pod-compat": "UWELL GPP 0.4Ω–1.2Ω เติมด้านบนหรือด้านข้าง ทั้งหัวรุ่นก่อนและรุ่นใหม่ (หัว G3 ก็ใช้ได้) · เติมได้ขณะหัวเสียบอยู่",
      "anti-leak": "ระบบกันรั่ว U²",
      materials: "อะลูมิเนียม ABS IML และ PCTG",
      dimensions: "30 × 18.5 × 120.7 mm (117.5 mm ในเวอร์ชัน TPD และ CRC)",
      weight: "ประมาณ 78 กรัม",
    },
    tagline: "จอทัชสกรีน 2.51 นิ้ว บนตัวเครื่องสาย G4",
    shortDescription:
      "พอตแบตเตอรี่ 1800mAh 35 วัตต์ จอทัชสกรีน 2.51 นิ้ว ปรับช่องลมได้แบบไม่มีขั้น",
  },
  "caliburn-g4": {
    whoIsThisFor: {
      0: "อยากได้เครื่องที่มีจอ และเลือกได้ว่าวันนี้จะสูบแรงหรือสูบนุ่ม",
    },
    specifications: {
      "flavor-tech": "Pro-FOCS 4.0 หัวพอตใช้ได้นานขึ้นสูงสุด 35% และความพอใจในรสชาติเพิ่มขึ้นสูงสุด 35% (ตัวเลขจากแล็บของ UWELL)",
      airflow: "ปุ่มเลื่อนปรับลม + กลับด้านหัวพอต ใช้พร้อมกันได้",
      control: "ปุ่มเดียว: กดครั้งเดียว เปิดจอ · กดสองครั้ง ล็อก/ปลดล็อกปุ่มยิง · กดสามครั้ง ปรับวัตต์ · กดสี่ครั้ง เข้าเมนู · กดห้าครั้ง เปิด/ปิดเครื่อง",
      "anti-leak": "U²: เชื่อมด้วยคลื่นอัลตราโซนิก + ร่องรูปตัว U",
      pod: "3mL (2mL ในเวอร์ชัน TPD และ CRC)",
      materials: "PCTG ABS และอะลูมิเนียมอัลลอย ADC12",
      dimensions: "26 × 15.65 × 114.98 mm (111.98 mm ในเวอร์ชัน TPD และ CRC)",
      weight: "ประมาณ 54.7 กรัม",
      "pod-compat": "UWELL GPP ทั้งหัวรุ่นก่อนและรุ่นใหม่ · หัวรุ่นใหม่เติมได้ขณะหัวเสียบอยู่",
      "included-pod": "แล้วแต่เวอร์ชัน: INT 0.4Ω + 0.9Ω · FDA 0.6Ω + 0.9Ω เติมด้านข้าง · TPD และ CRC 0.4Ω + 0.6Ω เติมด้านบน (คอยล์ mesh FeCrAl)",
      battery: "1300mAh ในตัว",
      "charge-time": "USB-C ชาร์จเร็ว 5V/2A",
      screen: "จอสี 0.85 นิ้ว มีโหมด Storm กับ Waves",
      firing: "สูบได้เลย หรือกดปุ่มก็ได้",
      output: "35W",
    },
    tagline: "Caliburn จอสี เลือกโหมดได้ตามความต้องการและการใช้งาน",
    shortDescription:
      "แบต 1300mAh สูงสุด 35 วัตต์ จอ 0.85 นิ้ว ปรับลมด้วยปุ่มเลื่อน หรือกลับด้านหัวพอตก็ได้",
  },
  "caliburn-g4-mini": {
    whoIsThisFor: {
      0: "ชอบเครื่องเล็ก ๆ ไม่ต้องดูจอ หยิบมาก็สูบได้เลย",
      1: "ไม่ชอบมีจอหรือเมนูให้ต้องคอยดู ขอแค่เครื่องที่หยิบมาใช้ได้ตรง ๆ",
    },
    specifications: {
      battery: "1100mAh ในตัว",
      screen: "ไม่มีจอ",
      firing: "สูบได้เลยโดยไม่ต้องกดปุ่ม",
      "flavor-tech": "Pro-FOCS 4.0 หัวพอตใช้ได้นานขึ้นสูงสุด 35% และความพอใจในรสชาติเพิ่มขึ้นสูงสุด 35% (ตัวเลขจากแล็บของ UWELL)",
      airflow: "ปุ่มเลื่อนปรับลม + กลับด้านหัวพอต ใช้พร้อมกันได้",
      "anti-leak": "U²: เชื่อมด้วยคลื่นอัลตราโซนิก + ร่องรูปตัว U",
      pod: "3mL (2mL ในเวอร์ชัน TPD และ CRC)",
      materials: "PCTG และ PC",
      dimensions: "24.1 × 14 × 112.7 mm (109.7 mm ในเวอร์ชัน TPD และ CRC)",
      weight: "ประมาณ 46 กรัม",
      "pod-compat": "UWELL GPP ทั้งหัวรุ่นก่อนและรุ่นใหม่ (ในกล่องมีหัว mesh 0.6Ω) · หัวรุ่นใหม่เติมได้ขณะหัวเสียบอยู่",
    },
    tagline: "G4 เวอร์ชันย่อส่วน พกพาง่าย",
    shortDescription:
      "G4 รุ่นเล็ก เบากว่า ไม่มีจอ เน้นพกง่าย ใช้หัวพอต GPP ตัวเดียวกับ G4 แบตเตอรี่เล็กลงเป็น 1100mAh",
  },
  "caliburn-g4-classic": {
    whoIsThisFor: {
      0: "อยากได้ตัวเครื่องอะลูมิเนียมงานละเอียด",
    },
    specifications: {
      battery: "1400mAh ในตัว",
      pod: "3mL (2mL ในเวอร์ชัน TPD และ CRC)",
      "included-pod": "2 หัว แล้วแต่เวอร์ชัน: INT และ FDA 0.4Ω + 0.6Ω เติมด้านข้าง · TPD 0.4Ω + 0.9Ω เติมด้านบน · CRC 0.4Ω + 0.6Ω เติมด้านบน (คอยล์ mesh FeCrAl)",
      materials: "PC อะลูมิเนียมอัลลอย และ PCTG",
      dimensions: "29 × 16.6 × 115.9 mm (112.8 mm ในเวอร์ชัน TPD และ CRC)",
      screen: "ไม่มีจอ ใช้ไฟ RGB 14 ดวง · เขียว แบตเหลือมาก · ฟ้า ปานกลาง · แดง เหลือน้อย",
      firing: "สูบได้เลยด้วยเซ็นเซอร์คู่ หรือกดปุ่ม (แรงกดประมาณ 255gf) · ตัวเลขจากแล็บของ UWELL: อายุการใช้งานระบบสูบได้เลย 300%+ ความแม่นยำในการยิง 99.999%+",
      airflow: "ปรับช่องลมได้ละเอียดแบบไม่มีขั้น + กลับด้านหัวพอต",
      control: "กดห้าครั้ง เปิด/ปิดเครื่อง · กดสองครั้ง ล็อก/ปลดล็อกปุ่มยิง · กดครั้งเดียว ยิง/ดูระดับแบต",
      "pod-compat": "UWELL GPP · เติมได้ขณะหัวเสียบอยู่ · มีช่องใสดูระดับในหัวพอต",
    },
    tagline: "Caliburn ที่บอกแบตด้วยสีไฟ",
    shortDescription:
      "แบต 1400mAh สูงสุด 35 วัตต์ สูบได้ทั้งแบบดูดและกดปุ่ม",
  },
  "caliburn-g3-pro": {
    whoIsThisFor: {
      0: "อยากได้ Caliburn จอใหญ่ ไว้ดูวัตต์ แบต และจำนวนพัฟ",
      1: "ยังหาความแน่นของลมที่ชอบไม่เจอ อยากปรับเองทีละนิด",
    },
    specifications: {
      battery: "1000mAh ในตัว",
      "charge-time": "USB-C 2A",
      output: "5–35W (หัว 0.4Ω) · 5–25W (0.6Ω) · 5–15W (0.9Ω)",
      screen: "จอ LCD เต็มหน้าเครื่อง แสดงวัตต์ แบต 4 ขีด และจำนวนพัฟถึง 999",
      firing: "สูบหรือกดปุ่มก็ยิง · กดสองครั้ง ล็อกปุ่ม (ยิงตอนสูบอย่างเดียว) · กดสามครั้ง ตั้งวัตต์ · กดห้าครั้ง เปิด/ปิดเครื่อง",
      airflow: "วาล์วปรับลม ปรับได้ละเอียด",
      pod: "เวอร์ชัน INT และ FDA: 3mL (หัว 0.4Ω) / 2.5mL · เวอร์ชัน CRC และ TPD: 2mL",
      "included-pod": "คอยล์ mesh FeCrAl 0.4Ω + 0.9Ω เติมด้านข้าง",
      "pod-compat": "หัวพอต Caliburn G3 (GPP) ทุกหัว ทั้งเติมด้านบนและด้านข้าง 0.4Ω–1.2Ω",
      "flavor-tech": "Pro-FOCS",
      materials: "ซิงค์อัลลอยและ PCTG",
      dimensions: "123.5 × 27.8 × 16.8 mm",
      weight: "ประมาณ 92 กรัม",
    },
    tagline: "Caliburn ทรงเพรียว จอเต็มหน้าเครื่อง",
    shortDescription:
      "แบต 1000mAh สูงสุด 35 วัตต์ ปรับลมได้ละเอียด มีหัวพอต 0.4 และ 0.9 โอห์มมาในกล่อง",
  },

  "caliburn-g3-pro-koko": {
    whoIsThisFor: {
      0: "อยากให้หน้าจอมีสีสันมากกว่าแค่ตัวเลข",
      1: "ไม่อยากชาร์จบ่อย อยากได้แบตที่อยู่ได้หลายวัน",
    },
    specifications: {
      battery: "1250mAh ในตัว",
      "battery-life": "ชาร์จครั้งเดียวใช้ได้สูงสุด 4 วัน (ตัวเลขของ UWELL)",
      "charge-time": "USB-C · 80% ใน 20 นาที ที่ 5V/2A (ตัวเลขของ UWELL)",
      output: "5–35W",
      screen: "จอสี TFT 1.8 นิ้ว",
      themes: "ธีมหน้าจอมีแอนิเมชัน (เช่น Planet, Twilight, KOKO) · โหมดความสว่าง DAY / NIGHT",
      firing: "กดสองครั้ง ล็อกปุ่ม · สามครั้ง ตั้งวัตต์ · สี่ครั้ง เมนูความสว่างและธีม · ห้าครั้ง เปิด/ปิดเครื่อง",
      airflow: "วาล์วปรับลม",
      pod: "3mL (2mL ในเวอร์ชัน TPD และ CRC)",
      "included-pod": "แล้วแต่เวอร์ชัน · INT และ FDA 0.4Ω (3mL) + 0.9Ω (2.5mL) เติมด้านข้าง · TPD และ CRC เติมด้านบน หัวละ 2mL",
      "pod-compat": "หัวพอต Caliburn G3 (GPP) ทุกหัว ทั้งเติมด้านบนและด้านข้าง 0.4Ω–1.2Ω",
      "anti-leak": "ระบบกันรั่ว U² (เชื่อมด้วยคลื่นอัลตราโซนิก + ร่องรูปตัว U)",
      "flavor-tech": "Pro-FOCS 3.0",
      materials: "ซิงค์อัลลอยและ PCTG",
      dimensions: "85.15 × 49.5 × 19.5 mm (79.15 mm ในเวอร์ชัน TPD และ CRC)",
      weight: "ประมาณ 91 กรัม",
    },
    tagline: "Caliburn ทรงกล่อง จอสี 1.8 นิ้ว",
    shortDescription:
      "แบต 1250mAh เปลี่ยนธีมหน้าจอได้ และใช้หัวพอต G3 ได้ทุกหัว",
  },

  "argus-g4": {
    faqs: {
      "argus-g4-life": {
        question: "แบตอยู่ได้กี่วัน",
        answer: "VOOPOO ระบุว่าใช้งานปกติได้สูงสุด 5 วันต่อการชาร์จหนึ่งครั้ง ส่วนจะอยู่ได้จริงกี่วัน ขึ้นอยู่กับวัตต์ที่ตั้งไว้และสูบบ่อยแค่ไหน",
      },
    },
    whoIsThisFor: {
      0: "สูบสลับไปมาระหว่าง MTL แบบแน่นกับ RDL ที่ลมโล่ง และอยากได้ทั้งสองแนวจากหัวพอตหัวเดียว",
      1: "อยากดูค่าต่าง ๆ และตั้งค่าเครื่องเองบนจอ แต่ยังไม่อยากขยับไปใช้ box mod",
    },
    specifications: {
      battery: "1650mAh ในตัว",
      output: "5–35W",
      voltage: "3.2–4.2V",
      resistance: "0.4–3.0Ω",
      screen: "จอ HD 0.85 นิ้ว แสดงแบต วัตต์ โอห์ม สถานะล็อก และจำนวนพัฟ",
      control: "ปุ่มเดียว: กดสองครั้ง สลับโอห์ม 0.7 → 1.0 → 0.4Ω · กดสามครั้ง ปรับวัตต์ · กดห้าครั้ง เข้าเมนู ปิดเครื่อง ธีมหน้าจอ รีเซ็ตตัวนับพัฟ ล็อก/ปลดล็อก · กดค้าง เปิดหน้าจอคำแนะนำ",
      pod: "ARGUS Multi-Ohm Cartridge 2 หัว · ใส่ตามปกติเป็น 0.7Ω กลับด้าน 180° เป็น 1.0Ω กดปุ่มสองครั้งเป็น 0.4Ω · 3.5mL (2mL ในเวอร์ชัน TPD) · เติมด้านบน มีจุกซิลิโคน · PCTG",
      "pod-compat": "หัวพอตตระกูล ARGUS ได้ทุกหัว · Multi-Ohm · Snap · Top Fill Cartridge V2 (2mL และ 3mL) · หัวพอต ARGUS รุ่นอื่นรวมถึงรุ่น CRC",
      coil: "เทคโนโลยี Multi-Core Electrode · iCOSM CODE 2.0",
      airflow: "ปุ่มเลื่อนปรับลมแบบไม่มีขั้น ตั้งแต่ MTL ถึง RDL",
      materials: "อะลูมิเนียมอัลลอย หรือซิงค์อัลลอยกับหนัง · บางสีใช้งานผิว Zircon Sand",
      charging: "USB-C 5V/2A · ชาร์จเต็มในประมาณ 45 นาที",
      dimensions: "แบบอะลูมิเนียมอัลลอย 121 × 27.6 × 15.8 mm · 65 กรัม / แบบซิงค์อัลลอย 121 × 27.6 × 16.6 mm · 85 กรัม",
    },
    tagline: "พอตคิทแบตอึดใช้ได้ 5 วัน พร้อมจอสถานะ HD 0.85 นิ้ว",
    shortDescription:
      "รุ่นเรือธงสายหลักของ ARGUS: แบตเตอรี่ 1650mAh 5–35 วัตต์ จอ HD 0.85 นิ้วแสดงระดับแบต วัตต์ โอห์ม สถานะล็อก และจำนวนพัฟ ชาร์จเร็วผ่าน USB-C เต็มใน 45 นาที",
  },
  "argus-g4-mini": {
    whoIsThisFor: {
      0: "สูบสลับไปมาระหว่าง MTL แบบแน่นกับ RDL ที่ลมโล่งกว่าเป็นประจำ",
      1: "อยากได้เครื่องตัวเล็กที่ไม่มีจอ แต่แบตยังเป็นก้อนใหญ่",
    },
    specifications: {
      battery: "1650mAh ในตัว",
      output: "5–30W",
      voltage: "3.2–4.2V",
      resistance: "0.4–3.0Ω",
      pod: "ARGUS Multi-Ohm Cartridge 2 หัว · ใส่ตามปกติเป็น 0.7Ω กลับด้าน 180° เป็น 1.0Ω · 3.5mL (2mL ในเวอร์ชัน TPD) · เติมด้านบน · PCTG",
      "pod-compat": "หัวพอตตระกูล ARGUS ได้ทุกหัว · Multi-Ohm · Snap · Top Fill Cartridge V2 (2mL และ 3mL) · หัวพอต ARGUS รุ่นอื่นรวมถึงรุ่น CRC",
      coil: "เทคโนโลยี Multi-Core Electrode · iCOSM CODE 2.0",
      airflow: "ปุ่มเลื่อนปรับลมแบบไม่มีขั้น ตั้งแต่ MTL ถึง RDL",
      firing: "สูบได้เลยโดยไม่ต้องกดปุ่ม",
      indicator: "ไฟ Energy Bar ไม่มีจอ · ไฟสีขาวคือ 0.7Ω ไฟสีเขียวคือ 1.0Ω · ไฟสี่ขีดบอกแบต ขีดละ 25%",
      materials: "ตัวเครื่องอะลูมิเนียมอัลลอย · หัวพอต PCTG",
      charging: "USB-C 5V/1.5A",
      dimensions: "113 × 27.6 × 14.6 mm · 56 กรัม",
    },
    tagline: "แบตเตอรี่เท่า G4 ในตัวเครื่องที่เล็กลง วัตต์ลดเหลือ 30 วัตต์",
    shortDescription: "ARGUS G4 ในตัวเครื่องที่เล็กลง แบตเตอรี่ 1650mAh เท่าเดิม วัตต์สูงสุดลดจาก 35 วัตต์ เหลือ 30 วัตต์",
  },

  "argus-p3": {
    whoIsThisFor: {
      0: "ชอบตั้งค่าเครื่องเอง ให้ตรงกับแนวการสูบของตัวเอง",
      1: "ชอบเครื่องทรงกล่อง แต่อยากได้ตัวที่เล็กลงมา",
    },
    specifications: {
      battery: "1500mAh ในตัว",
      output: "5–30W",
      voltage: "3.2–4.2V",
      resistance: "0.4–3.0Ω",
      screen: "จอทัชเต็มจอ TFT HD 2.01 นิ้ว · โค้งลงทั้งสองขอบ · หน้าปัดมากกว่า 18 แบบ",
      modes: "DIY ตั้งกราฟวัตต์เองได้ บันทึกได้สูงสุด 3 ชุด · Party · ECO · SOS · Child Lock",
      control: "จอทัช และปุ่มด้านข้าง",
      firing: "สูบได้เลยโดยไม่ต้องกดปุ่ม",
      pod: "ARGUS Snap Cartridge 2 หัว · 0.4Ω และ 0.7Ω · 2mL · PCTG · เปิดฝาแล้วเติมจากด้านบน",
      "pod-compat": "หัวพอตตระกูล ARGUS ได้ทุกหัว ทั้ง Snap · Top Fill Cartridge · รุ่น CRC และ Top Fill Cartridge V2 ที่มี 0.4Ω RDL 18–30W · 0.7Ω MTL 14–18W · 1.0Ω MTL 10–14W · เช็คค่าโอห์มและวัตต์ให้ตรงกับเครื่องก่อนใช้",
      coil: "iCOSM CODE 2.0 · Liquid-Seal Shield · Mega-Core · Golden Cotton",
      airflow: "ปุ่มเลื่อนปรับลมแบบไม่มีขั้น",
      materials: "กรอบซิงค์อัลลอย · ชุดสีหนัง หรือรุ่น Metal Edition",
      charging: "USB-C 5V/2A · ชาร์จเต็มในประมาณ 40 นาที",
      weight: "82 กรัม",
    },
    tagline: "จอทัชเต็มจอ TFT HD 2.01 นิ้ว บนพอตคิทสาย ARGUS ของ VOOPOO",
    shortDescription: "พอตคิทแบตเตอรี่ 1500mAh 5–30 วัตต์ จอทัช TFT HD 2.01 นิ้ว กดเลือกเมนูและโหมดบนจอได้เลย",
  },

  "argus-g3-mini": {
    whoIsThisFor: {
      0: "เพิ่งเริ่มสูบพอต และอยากได้เครื่องที่ใช้ง่าย หยิบขึ้นมาก็สูบได้เลย",
      1: "อยากได้เครื่องเบา ๆ ตัวเล็กจนกำไว้ในมือได้มิด",
    },
    specifications: {
      battery: "1350mAh ในตัว",
      output: "สูงสุด 30W · เครื่องปรับวัตต์ให้เองตามหัวพอตที่ใส่",
      pod: "ARGUS Top Fill Cartridge V2 0.7Ω · 3mL (2mL ในเวอร์ชัน TPD) · เติมด้านบน",
      "pod-compat": "ARGUS Top Fill Cartridge V2 · 0.4Ω RDL 18–30W · 0.7Ω MTL 14–18W · 1.0Ω MTL 10–14W · ใช้หัวพอตได้ทั้งตระกูล ARGUS โดยเช็คค่าโอห์มและวัตต์ให้ตรงกับเครื่อง",
      coil: "iCOSM CODE 2.0 · Liquid-Seal Shield · Mega-Core · Golden Cotton",
      airflow: "ช่องลมคงที่ ปรับไม่ได้",
      firing: "ไม่มีปุ่ม สูบได้เลย",
      materials: "อะลูมิเนียมอัลลอย · ลาย Clous de Paris",
      charging: "USB-C 5V/1A",
      dimensions: "97.9 × 25.8 × 13.7 mm เมื่อใส่หัวพอต 3mL · 95.4 × 25.8 × 13.7 mm เมื่อใส่หัวพอต 2mL · 40.85 กรัม",
    },
    tagline: "ไม่มีปุ่ม ไม่ต้องตั้งค่า ชิป GENE.AI ปรับวัตต์ให้เองตามหัวพอต",
    shortDescription:
      "พอตคิทเหมาะมือใหม่ แบตเตอรี่ 1350mAh สูงสุด 30 วัตต์ ปรับวัตต์อัตโนมัติตามหัวพอตที่ใส่ ทำงานด้วยชิป GENE.AI ของ VOOPOO และหัวพอตกันรั่ว iCOSM CODE 2.0",
  },

  "drag-6": {
    faqs: {
      "drag6-coils": {
        question: "DRAG 6 ใช้คอยล์อะไรได้บ้าง",
        answer: "ถังน้ำยา UFORCE-X Tank II ที่มากับชุดใช้คอยล์ PnP X ได้ทุกตัว และในกล่องมีคอยล์ PnP X 0.15 โอห์ม กับ 0.3 โอห์มมาให้ด้วย",
      },
    },
    whoIsThisFor: {
      0: "ชอบตั้งวัตต์เอง และอยากได้แบตก้อนใหญ่ในตัว มากกว่าต้องคอยเปลี่ยนถ่าน",
      1: "สูบทั้งแบบ MTL และ DTL และอยากได้ถังเดียวที่ใช้ได้ทั้งสองแบบ",
    },
    specifications: {
      battery: "4400mAh ในตัว แบ่งเป็นสองก้อน ก้อนละ 2200mAh",
      screen: "จอ TFT 1.66 นิ้ว แสดงวัตต์ แบต โอห์ม จำนวนพัฟ และโหมด · ธีมหน้าจอ 3 แบบ",
      "vaping-style": "DTL และ MTL",
      modes: "SMART / RBA / TC-TCR",
      control: "ล้อปรับวัตต์ละเอียด และเซ็นเซอร์แตะที่ปุ่มยิงไว้ปลดล็อก ปล่อยนิ้วแล้วล็อกกลับเอง · กดห้าครั้ง เปิด/ปิดเครื่อง · กดสามครั้ง เข้าเมนู",
      tank: "เติมด้านบน · 5mL (2mL ในเวอร์ชัน TPD) · UFORCE-X Tank II",
      coil: "ใช้คอยล์ PnP X ได้ทุกตัว · ในกล่องมี 0.15Ω และ 0.3Ω",
      airflow: "แหวนปรับลมแบบหมุน · ช่องลม Golden Triangle",
      "charge-time": "2–3 ชั่วโมง",
      weight: "ประมาณ 280 กรัม (294 กรัมในเวอร์ชัน TPD)",
    },
    tagline: "220 วัตต์ ชิป GENE.TT 3.0 ปรับวัตต์ละเอียดด้วยล้อหมุน",
    shortDescription:
      "รุ่นเรือธงล่าสุดของสาย DRAG: แบตเตอรี่ในตัว 4400mAh (ถ่าน 2200mAh สองก้อน) สูงสุด 220 วัตต์ จอ TFT ขนาด 1.66 นิ้ว และปุ่มยิงมีเซ็นเซอร์แตะไว้ปลดล็อกเครื่อง",
  },
  "drag-s3": {
    whoIsThisFor: {
      0: "อยากได้เครื่องสาย DRAG ขนาดเล็ก ไว้หยิบใช้ได้ทุกวัน",
      1: "สูบ MTL เป็นหลัก และอยากเปลี่ยนคอยล์ไปสูบ RDL หรือ DTL แบบเบา ๆ บ้างในบางวัน",
    },
    specifications: {
      battery: "3000mAh ในตัว",
      screen: "จอ TFT 0.96 นิ้ว แสดงวัตต์ โหมด โอห์ม แบต และจำนวนพัฟ · เปลี่ยนธีมหน้าจอได้",
      chip: "GENE.TT 2.0",
      modes: "SMART / RBA / ECO",
      control: "เซ็นเซอร์แตะที่ปุ่มยิงไว้ปลดล็อก ปล่อยนิ้วแล้วล็อกกลับเอง · กดห้าครั้ง เปิด/ปิดเครื่อง · กดสามครั้ง เข้าเมนู",
      "pod-compat": "หัวพอต PnP X Cartridge DTL / MTL · 5mL (2mL ในเวอร์ชัน TPD) · เติมด้านข้าง",
      coil: "ใช้คอยล์ PnP X ได้ทุกตัว ตั้งแต่ 0.15Ω ถึง 1.0Ω · ในกล่องมี 0.6Ω และ 0.8Ω",
      airflow: "ช่องลมด้านบน ปรับแบบเลื่อน",
      materials: "ซิงค์อัลลอย หนัง",
      voltage: "3.2–4.35V",
      dimensions: "124.25 × 33 × 28 mm",
      "vaping-style": "MTL RDL และ DTL แบบเบา ๆ",
      charging: "USB-C 5V/2A",
    },
    tagline: "แบตเตอรี่ในตัว 3000mAh สูงสุด 60 วัตต์",
    shortDescription: "DRAG รุ่นแบตเตอรี่ในตัว: 3000mAh 5–60 วัตต์ จอ TFT ขนาด 0.96 นิ้ว และชาร์จผ่าน USB-C",
  },
  "drag-x": {
    whoIsThisFor: {
      0: "กำลังหา DRAG X ตัวนี้ ไม่ใช่ DRAG X3 และอยากดูสเปกทั้งหมดที่ VOOPOO ระบุไว้",
    },
    specifications: {
      battery: "ถ่าน 18650 ก้อนเดียว (ไม่รวมในกล่อง)",
      charging: "USB-C ชาร์จเร็ว",
      pod: "4.5mL · PCTG · ยึดด้วยแม่เหล็ก",
      coils: "คอยล์ PnP รวมถึง PnP-RBA · ในกล่องมี PnP-VM1 0.3Ω (32–40W) และ PnP-VM6 0.15Ω (60–80W)",
      materials: "อัลลอยและหนัง",
      chip: "GENE.TT มีโหมด SMART และโหมด SCORE",
    },
    features: {
      chip: { title: "ชิป GENE.TT ยิงได้ใน 0.001 วินาที", description: "VOOPOO ระบุว่าชิป GENE.TT ยิงได้เร็วภายใน 0.001 วินาที" },
      smart: { title: "โหมด SMART ช่วยแนะนำวัตต์", description: "ใส่คอยล์แล้ว เครื่องจะอ่านค่าคอยล์ แล้วแนะนำวัตต์ที่เหมาะให้ และจำวัตต์ที่ตั้งไว้ครั้งล่าสุด" },
      airflow: { title: "หัวพอตยึดด้วยแม่เหล็ก", description: "หัวพอต PCTG 4.5mL ใช้แม่เหล็กยึดกับตัวเครื่อง VOOPOO บอกว่าเติมน้ำยาได้ง่ายและสะอาด" },
      battery: { title: "ใช้ถ่าน 18650 ก้อนเดียว", description: "DRAG X ใช้ถ่าน 18650 หนึ่งก้อน ชาร์จในตัวเครื่องผ่าน USB-C ได้เร็ว ส่วนตัวถ่านต้องซื้อแยก" },
    },
    tagline: "DRAG X ของ VOOPOO ใช้ถ่าน 18650 ก้อนเดียว ปรับได้ถึง 80 วัตต์",
    shortDescription:
      "DRAG X ของ VOOPOO ใช้ถ่าน 18650 หนึ่งก้อนที่ต้องซื้อแยก ปรับได้ 5–80 วัตต์ ใช้คอยล์ PnP ได้รวมถึง PnP-RBA และมีหัวพอต 4.5mL ที่ยึดกับตัวเครื่องด้วยแม่เหล็ก",
  },
  "drag-x3": {
    faqs: {
      "dragx3-battery": {
        question: "ในกล่องมีถ่านมาให้ไหม",
        answer: "ไม่มี DRAG X3 ใช้ถ่าน 18650 หรือ 21700 หนึ่งก้อน ต้องซื้อถ่านแยก",
      },
    },
    whoIsThisFor: {
      0: "ชอบใช้ถ่านถอดเปลี่ยนมากกว่าแบตในตัว และอยากเลือกก้อนเองตามการใช้งาน",
      1: "สูบ DTL เป็นหลัก แต่อยากเปลี่ยนหัวพอตไปสูบ MTL ได้ในเครื่องเดียวกัน",
    },
    specifications: {
      battery: "ถ่าน 18650 หรือ 21700 ก้อนเดียว (ไม่รวมในกล่อง)",
      screen: "จอทัชสกรีน TFT 1.66 นิ้ว แสดงแบต วัตต์ โหมด โอห์ม จำนวนพัฟ และสถานะล็อก · ธีมหน้าจอ 3 แบบ",
      chip: "GENE.TT 2.0",
      modes: "SMART / RBA / ECO",
      control: "ปลดล็อกได้สามแบบ แตะเซ็นเซอร์ กดปุ่ม หรือปลดล็อกค้างไว้ · กดห้าครั้ง เปิด/ปิดเครื่อง · กดสามครั้ง เข้าเมนู",
      "pod-compat": "หัวพอต PnP X Cartridge DTL ที่มากับชุด และแบบ MTL · 5mL (2mL ในเวอร์ชัน TPD) · เติมด้านข้าง",
      coil: "ใช้คอยล์ PnP X ได้ทุกตัว",
      airflow: "ช่องลมด้านบน",
      materials: "ซิงค์อัลลอย หนัง",
      voltage: "3.2–4.2V",
      dimensions: "133 × 34 × 28 mm",
      "vaping-style": "DTL และ MTL",
      charging: "USB-C 5V/2A",
      "charge-time": "2–3 ชั่วโมง",
      weight: "130 กรัม",
    },
    tagline: "80 วัตต์ บนถ่านถอดเปลี่ยนได้ 18650/21700",
    shortDescription: "DRAG รุ่นใช้ถ่านก้อนเดียว (18650 หรือ 21700 ซื้อแยก) สูงสุด 80 วัตต์ พร้อมจอทัชสกรีน 1.66 นิ้ว",
  },
  "vinci-s": {
    whoIsThisFor: {
      0: "อยากได้พอตคิทวัตต์กลาง ๆ 5–40 วัตต์ แบตเตอรี่ 2000mAh ในตัว ที่ใส่หัวพอตได้หลายโอห์ม",
      1: "เบื่อดึงหัวพอตออกมาเติมน้ำยาแล้วต้องเสียบกลับทุกที",
    },
    specifications: {
      battery: "2000mAh ในตัว",
      pod: "4.5mL (2mL ในเวอร์ชัน TPD)",
      fill: "เติมด้านบน",
      materials: "อะลูมิเนียมอัลลอยและ PC",
    },
    tagline: "40 วัตต์ หัวพอตเติมด้านบน",
    shortDescription: "พอตคิทแบตเตอรี่ 2000mAh 5–40 วัตต์ หัวพอตเติมด้านบนความจุ 4.5mL (2mL ในเวอร์ชัน TPD) ช่วง 0.3–3.0 โอห์ม",
    features: {
      "topside-fill": {
        title: "หัวพอตเติมด้านบน",
        description: "หัวพอตเสียบคาเครื่องอยู่ก็เติมน้ำยาจากด้านบนได้เลย",
      },
    },
  },
  "vmate-i3": {
    whoIsThisFor: {
      0: "อยากได้เครื่องที่ใช้ง่าย สำหรับสูบเป็นประจำทุกวัน",
      1: "สูบทั้ง MTL และ RDL และอยากใช้เครื่องเดียวให้ได้ทั้งสองแนว",
    },
    specifications: {
      battery: "1500mAh ในตัว",
      output: "5–30W",
      voltage: "3.2–4.2V",
      resistance: "0.4–3.0Ω",
      pod: "VMATE Top Fill Cartridge 0.7Ω · 3mL (2mL ในเวอร์ชัน TPD) · เติมด้านบนได้โดยไม่ต้องถอดหัวพอต",
      "pod-compat": "หัวพอต VMATE ได้ทุกหัว · Top Fill Cartridge 0.4Ω RDL ใช้ 30W ขึ้นไป · 0.7Ω 15–25W · 1.0Ω MTL 12–18W · Cartridge V2 0.7Ω MTL 15–25W · 1.2Ω MTL 8–15W · เช็คค่าโอห์มและวัตต์ให้ตรงกับเครื่องก่อนใช้",
      coil: "iCOSM CODE · อายุคอยล์ 90mL · ตั้งทิ้งไว้ 30 วันไม่รั่วซึม · ตัวเลขจากผลทดสอบในห้องแล็บของ VOOPOO",
      airflow: "ปุ่มเลื่อนปรับลม ตั้งแต่ MTL แบบแน่นถึง RDL ที่ลมโล่ง",
      firing: "ไม่มีปุ่ม สูบได้เลย",
      indicator: "แถบไฟ Neon Light Strip ด้านข้าง · สีแดงเมื่อแบตเหลือไม่เกิน 30% · สีน้ำเงินที่ 30–70% · สีเขียวตั้งแต่ 70% ขึ้นไป",
      materials: "อะลูมิเนียมอัลลอย",
      charging: "USB-C 5V/2A ชาร์จเร็ว",
      dimensions: "103 × 28.5 × 15.1 mm · 49.8 กรัม",
    },
    tagline: "พอตคิทตัวบาง ยาว 103mm",
    shortDescription: "พอตคิทสาย VMATE ของ VOOPOO: เครื่องอะลูมิเนียมอัลลอยบาง 15.1mm แบตเตอรี่ 1500mAh 5–30 วัตต์ หัวพอตเติมด้านบน 3mL",
  },

  "m-bar-10k": {
    faqs: {
      "m-bar-10k-recharge": {
        question: "ชาร์จได้ไหม",
        answer: "ได้ ชาร์จผ่าน USB-C แบตหมดก็ชาร์จแล้วใช้ต่อได้ ไม่ใช่แบบแบตหมดแล้วจบ",
      },
    },
    whoIsThisFor: {
      0: "ชอบเปลี่ยนกลิ่นบ่อย อยากได้รุ่นที่มีให้เลือกทั้งสายเย็น สายผลไม้ ไปจนถึง Cola และ Matcha Latte",
    },
    specifications: {
      puffs: "สูงสุด 10,000",
      battery: "600mAh ชาร์จซ้ำได้ผ่าน USB-C",
      coil: "cotton mesh",
      modes: "Eco / Soft / Boost กดสองครั้งเพื่อสลับ",
      indicator: "LED บอกระดับแบตเป็นขั้นละ 25% ส่วน RGB บอกโหมดที่ใช้อยู่",
      airflow: "ปรับได้",
    },
    tagline: "3 โหมดวัตต์ วงแหวน RGB แสดงสถานะ รองรับ 10,000 พัฟ",
    // Round 8 B2: "Marbo" sentence — many shops use that name for M Bar (researcher-1 row 3a). No maker claim.
    shortDescription: "พอตใช้แล้วทิ้งชาร์จซ้ำได้ รองรับสูงสุด 10,000 พัฟ ใช้คอยล์ cotton mesh มี 3 โหมดวัตต์ให้สลับ พร้อมไฟ RGB แสดงโหมดที่ใช้งานอยู่ หลายร้านเรียก M Bar ว่า Marbo เป็นรุ่นเดียวกันนี้แหละ",
  },
  "m-bar-9k": {
    whoIsThisFor: {
      0: "อยากได้พอตใช้แล้วทิ้งที่ปรับช่องลมเองได้ ไม่ใช่ล็อกมาให้สูบได้แบบเดียว",
    },
    specifications: {
      puffs: "สูงสุด 9,000",
      battery: "600mAh ชาร์จซ้ำได้ผ่าน USB-C",
      nicotine: "30mg salt nic",
      airflow: "ปรับได้",
      resistance: "1.0Ω",
    },
    tagline: "ปรับช่องลมได้ รองรับ 9,000 พัฟ",
    shortDescription: "พอตใช้แล้วทิ้งชาร์จซ้ำได้ ปรับช่องลมได้ รองรับสูงสุด 9,000 พัฟ หลายร้านเรียก M Bar ว่า Marbo เป็นรุ่นเดียวกันนี้แหละ",
    features: {
      "adjustable-airflow": {
        title: "ปรับช่องลมได้",
        description: "ปรับช่องลมได้ที่ตัวเครื่องเอง",
      },
    },
  },
  "m-bar-15k": {
    // Batch 3f (06/10): stage page (story text in story-copy.ts) · shortDescription = the 4 wrong facts fixed (owner §18 06/10:
    // disposable · cotton mesh · fast charging · 15 flavours) · tagline kept (nothing wrong in it). Thai = thai-copy 06/10.
    whoIsThisFor: {
      0: "ชอบตัวเครื่องแบบ M Switch แต่อยากได้หัวพอตของ M Bar",
      1: "อยากเห็นแบตที่เหลือเป็นตัวเลขบนหน้าจอ แทนการกะเอาเอง",
    },
    specifications: {
      puffs: "สูงสุด 15,000",
      coil: "เซรามิก",
      charging: "USB-C",
      battery: "600mAh",
      airflow: "ปุ่มเลื่อนปรับลม",
      format: "ตัวเครื่องใช้ซ้ำได้ คู่กับหัวพอตใสที่ถอดเปลี่ยนได้",
      screen: "จอดิจิทัลบอกระดับแบต แสดงทั้งตอนกำลังชาร์จและเมื่อชาร์จเต็ม",
    },
    tagline: "M Bar รุ่นพัฟเยอะสุดของตระกูล ชาร์จซ้ำได้ผ่าน USB-C",
    shortDescription:
      "ตัวเครื่อง M Switch ที่เก็บไว้ใช้ต่อได้ คู่กับหัวพอตใสของ M Bar ที่ถอดเปลี่ยนได้ รองรับสูงสุด 15,000 พัฟ",
  },
  "m-switch-kit": {
    whoIsThisFor: {
      0: "ใช้พอตใช้แล้วทิ้งอยู่ และเสียดายทุกครั้งที่หมดแล้วต้องทิ้งไปทั้งเครื่อง",
    },
    specifications: {
      "puffs-per-pod": "สูงสุด 15,000",
      format: "ตัวเครื่องใช้ซ้ำได้ เปลี่ยนแค่หัวพอตบรรจุสำเร็จ",
      coil: "cotton mesh",
      airflow: "ปุ่มเลื่อนปรับลม",
      screen: "จอดิจิทัลบอกระดับแบต แสดงทั้งตอนกำลังชาร์จและเมื่อชาร์จเต็ม",
      charging: "USB-C ชาร์จเร็วตามที่ SALTHUB ระบุ",
      battery: "—",
    },
    tagline: "ตัวเครื่องใช้ซ้ำได้ หัวพอตบรรจุสำเร็จ",
    shortDescription:
      "ตัวเครื่องใช้ซ้ำได้ จับคู่กับหัวพอต M Switch Pod บรรจุสำเร็จ รองรับสูงสุด 15,000 พัฟต่อหัวพอต เก็บตัวเครื่องไว้ชาร์จใช้ต่อ แล้วเปลี่ยนแค่หัวพอต ไม่ต้องเติมน้ำยา ร้านเราเรียกชุดนี้ว่า M Bar 15K หรือ Marbo 15K",
  },
  "m-switch-pod": {
    whoIsThisFor: {
      0: "คนที่มีเครื่อง M Switch Kit อยู่แล้ว มาซื้อหัวพอตเพิ่มหรือเปลี่ยนรส",
    },
    specifications: {
      battery: "600mAh",
    },
    tagline: "หัวพอตบรรจุสำเร็จสำหรับ M Switch Kit",
    shortDescription: "หัวพอตสำหรับเปลี่ยน บรรจุน้ำยาสำเร็จ ใช้กับตัวเครื่อง M Switch Kit ซึ่งร้านเราเรียกว่า M Bar 15K",
  },
  "m-bar-pod": {
    whoIsThisFor: {
      0: "คนที่มีเครื่องใช้ซ้ำที่รองรับ M Bar อยู่แล้ว มาซื้อหัวพอตเพิ่มหรือเปลี่ยนรส",
    },
    specifications: {
      flavors: "กว่า 15 รส",
    },
    tagline: "กว่า 15 รส หัวพอตทรงเดียวกันทั้งตระกูล M Bar",
    shortDescription: "หัวพอตสำหรับเปลี่ยน ใช้ได้กับเครื่องใช้ซ้ำของ SALTHUB ที่รองรับ M Bar มีให้เลือกกว่า 15 รส หลายร้านเรียกตระกูล M Bar ว่า Marbo เป็นของเดียวกัน",
  },
  "zero-pro": {
    whoIsThisFor: {
      0: "อยากสลับระหว่างสูบเบา ๆ กับสูบให้แรงขึ้น โดยใช้เครื่องตัวเล็กเพียงเครื่องเดียว",
      1: "ชอบเครื่องทรงเพรียว หน้าตาคล้ายปากกา",
    },
    specifications: {
      puffs: "5,000 · ตามโปสเตอร์ Zero Pro ของ SALTHUB",
      modes: "3 โหมด คือ Low-end · Mid-range · High-end",
      battery: "380mAh ในตัว",
      resistance: "0.5–2Ω",
      airflow: "ช่องลมเข้าด้านข้าง",
      charging: "USB-C · SALTHUB ระบุว่าชาร์จเร็ว",
    },
    tagline: "3 โหมด ในตัวเครื่องระบบสวิตช์ใช้ซ้ำได้",
    shortDescription: "เครื่องระบบสวิตช์ใช้ซ้ำได้ มี 3 โหมดวัตต์ ใช้หัวพอต Zero Cartridge รองรับสูงสุด 5,000 พัฟต่อหัวพอต",
  },
  "zero-nano": {
    whoIsThisFor: {
      0: "อยากได้เครื่องระบบสวิตช์สาย Zero ตัวเล็ก ๆ ไว้พกติดตัว",
    },
    specifications: {
      format: "ตัวเครื่องใช้ซ้ำได้ขนาดเล็ก ใช้ Zero Cartridge",
    },
    tagline: "เครื่องระบบสวิตช์สาย Zero ตัวเล็ก แบตเตอรี่ 500mAh ในตัว",
    shortDescription: "อุปกรณ์ใช้ซ้ำได้ตัวเล็ก แบตเตอรี่ 500mAh ใช้ระบบหัวพอต Zero เดียวกับ Zero Pro",
    features: {
      "smallest-zero": {
        title: "Zero รุ่นเล็ก",
        description: "ตัวเครื่องใช้ซ้ำได้ขนาดเล็ก แบตเตอรี่ 500mAh ใช้ Zero Cartridge หัวเดียวกับ Zero Pro",
      },
    },
  },
  "zero-cartridge": {
    whoIsThisFor: {
      0: "ใช้ Zero Pro หรือ Zero Nano อยู่ แล้วหัวพอตหมดหรืออยากเปลี่ยนรส",
    },
    tagline: "หัวพอตสำหรับเปลี่ยน ใช้ได้ทั้ง Zero Pro และ Zero Nano",
    shortDescription: "หัวพอตสำหรับเปลี่ยน ความจุ 2.2mL หัวเดียวกันใส่ได้ทั้ง Zero Pro และ Zero Nano",
  },
  // Tier-1 disposable growth mission (2026-09-03) — same translation-only rule as above: honesty
  // caveats (unverified specs, naming ambiguity) are real facts and must carry over untranslated
  // in meaning, never smoothed into a more confident-sounding Thai sentence than the English.
  "relx-smash-go-12k": {
    whoIsThisFor: {
      0: "อยากได้พอตใช้แล้วทิ้งที่พกง่าย ใส่กระเป๋ากางเกงแล้วติดตัวไปได้ทั้งวัน",
    },
    specifications: {
      puffs: "สูงสุด 12,000",
      battery: "400mAh ชาร์จซ้ำได้ผ่าน USB-C",
      coil: "MEGA MESH",
      nicotine: "3% หรือ 5% salt nic",
      capacity: "20mL",
    },
    tagline: "พอตใช้แล้วทิ้งของ RELX มีอยู่ในเว็บทางการ คอยล์ MEGA MESH",
    shortDescription:
      "พอตใช้แล้วทิ้งชาร์จซ้ำได้จากไลน์อัพทางการของ RELX รองรับสูงสุด 12,000 พัฟ แบตเตอรี่ 400mAh คอยล์ MEGA MESH มี 10 รส ยืนยันตรงจาก relxnow.com",
  },
  // Round "image-sitewide" 2026-09-30 (writer draft A): re-published as a device + prefilled pods, not a disposable.
  "relx-creator": {
    whoIsThisFor: {
      0: "อยากได้ตัวเครื่องที่ใช้ซ้ำได้ แต่ไม่อยากเติมน้ำยาเอง",
    },
    faqs: {
      "relx-creator-pods": {
        question: "RELX Creator ใช้กับหัวพอตรุ่นไหนได้บ้าง",
        answer: "ใส่ได้ทั้งหัวพอต RELX Creator Pod และหัวพอต Muro Connector สองรุ่นนี้ร้านยืนยันจากของจริงที่มีอยู่ ถ้าจะใช้กับหัวพอตรุ่นอื่น ทักไลน์ @okm24 ถามก่อนได้เลย",
      },
    },
    specifications: {
      format: "ตัวเครื่องอย่างเดียว หัวพอตบรรจุสำเร็จขายแยก",
      battery: "800mAh ชาร์จซ้ำได้ผ่าน USB-C",
      modes: "15W Normal / 25W Boost กดสองครั้งสลับโหมด",
      screen: "จอพิกเซล โชว์หน้าอีโมจิ กดปุ่มครั้งเดียวดูแบต",
      airflow: "ปรับได้",
      compat: "RELX Creator Pod และ Muro Connector (ร้านยืนยันจากของจริง)",
    },
    tagline: "เครื่องระบบสวิตช์ของ RELX หัวพอตหมดก็เปลี่ยนแค่หัว",
    shortDescription:
      "ขายเฉพาะตัวเครื่อง หัวพอตบรรจุสำเร็จซื้อแยก หัวหมดก็เปลี่ยนแค่หัว ตัวเครื่องชาร์จแล้วใช้ต่อได้ มีจอพิกเซลโชว์หน้าอีโมจิ กดสองครั้งติดกันสลับ 15 กับ 25 วัตต์",
  },
  // Image-fix round 2026-09-30 (writer draft, owner approved 2026-09-30). The shop has no stock of this model — every
  // flavour is sold out; the shop sells nexBar CLEAR 18K (Pod-180).
  "wotofo-nexbar-18k": {
    whoIsThisFor: {
      0: "คนที่ดูคลิปรีวิว WOTOFO nexBAR 18K ของ OKami24 แล้ว อยากดูสเปกเต็มกับรายชื่อกลิ่นจากผู้ผลิต",
    },
    specifications: {
      puffs: "สูงสุด 18,000",
      battery: "750mAh ชาร์จซ้ำได้ผ่าน USB-C",
      capacity: "21mL",
      coil: "nexMESH สองตัว ตัวละ 1.2Ω",
      modes: "NORM 16W / TURBO 19W",
      airflow: "ปรับได้ 2 ระดับ",
      // Spec values are search text: "น้ำยา" here made this device answer a search for e-liquid (catalog-search test).
      screen: "จอ LED แสดงแบตกับโหมด",
      nicotine: "20mg หรือ 50mg",
      size: "101 × 44 × 26.7 mm",
    },
    tagline: "พอตใช้แล้วทิ้ง 18,000 พัฟของ WOTOFO คอยล์ nexMESH สองตัว มีจอ LED",
    shortDescription:
      "พอตใช้แล้วทิ้งของ WOTOFO สูงสุด 18,000 พัฟ น้ำยา 21mL แบตเตอรี่ 750mAh ชาร์จผ่าน USB-C คอยล์ nexMESH สองตัว มี 2 โหมด NORM 16 วัตต์ กับ TURBO 19 วัตต์ ปรับลมได้ 2 ระดับ สเปกและรายชื่อกลิ่นเช็คตรงจาก wotofo.com",
  },
  "joiway-f3": {
    whoIsThisFor: {
      0: "สูบพอตใช้แล้วทิ้งเป็นประจำ และอยากได้เครื่องที่ใช้ได้นานก่อนต้องเปลี่ยนใหม่",
      1: "ชอบให้เครื่องมีสีสัน มีไฟหลากสีขึ้นมาระหว่างสูบ",
    },
    specifications: {
      puffs: "12,000+",
      airflow: "ปรับได้",
      charging: "USB-C",
      coil: "นาโนคอยล์",
    },
    tagline: "พอตใช้แล้วทิ้งจาก Joiway รุ่นรสเดียว",
    shortDescription:
      "พอตใช้แล้วทิ้งจาก Joiway รุ่นรสเดียว ถ้าอยากได้ 2 รสในเครื่องเดียว ดูรุ่น F4",
  },
  "joiway-f4": {
    whoIsThisFor: {
      0: "สูบกลิ่นเดียวแล้วเบื่อเร็ว ชอบเปลี่ยนกลิ่นไปมาระหว่างวัน",
      1: "ชอบให้กลิ่นมาเป็นคู่ที่จับไว้ให้แล้ว แค่เลือกคู่ที่ถูกใจ",
    },
    specifications: {
      puffs: "สูงสุด 20,000 (ฝั่งละ 10,000)",
      capacity: "20mL บรรจุสำเร็จ ถังละ 10mL",
      battery: "650mAh ชาร์จซ้ำได้ผ่าน USB-C",
      coil: "คอยล์ mesh 2 ชุด",
      "flavor-modes": "แยกสองถัง หมุนปากดูดเพื่อสลับ",
      display: "จอ LED",
    },
    tagline: "พอตใช้แล้วทิ้ง 2 รสในเครื่องเดียว",
    shortDescription:
      "พอตใช้แล้วทิ้งจาก Joiway 2 รสในเครื่องเดียว OKami24 รีวิวใช้จริง 30 วันไว้บน YouTube",
  },
  "tfit-m-power-20k": {
    whoIsThisFor: {
      0: "ชอบสูบรสผลไม้หรือรสเย็น ๆ และอยากมีให้เลือกหลายกลิ่น",
      1: "ชอบปรับลมเอง ให้ดูดแน่นหรือโล่งตามที่ถนัด",
    },
    specifications: {
      puffs: "สูงสุด 20,000",
      battery: "600mAh ชาร์จซ้ำได้",
      charging: "USB-C",
      capacity: "18mL บรรจุสำเร็จ",
      coil: "คอยล์ mesh สองตัว 0.8Ω",
      nicotine: "30mg",
      airflow: "ปรับได้",
      size: "Φ30 × 98 mm · 70 กรัม",
    },
    tagline: "พอตใช้แล้วทิ้งของ TFIT ที่ OKami24 รีวิวใช้จริงบน YouTube",
    shortDescription:
      "พอตใช้แล้วทิ้งของ TFIT รองรับสูงสุด 20,000 พัฟ ใช้คอยล์ mesh สองตัว แบต 600mAh ชาร์จผ่าน USB-C และปรับช่องลมได้ตามที่ชอบ",
  },
  "infy-20k": {
    // 2026-09-30: the page went live — the who-for line and the FAQ (Thai text moved here from infy.ts, unchanged).
    whoIsThisFor: {
      0: "คนที่ตั้งใจมาหา INFY รุ่นพัฟเยอะ",
    },
    faqs: {
      "infy-20k-spec-variance": {
        question: "สเปกในหน้านี้มาจากไหน",
        answer:
          "INFY ยังไม่ลงรุ่น 20K ในเว็บของตัวเอง สเปกที่ร้านเรายืนยันแล้วคือน้ำยา 20mL กับช่องลมปรับได้ ตัวเลขอื่นที่ร้านอื่นในไทยบอกกันมา เราไม่ได้ใส่ไว้ อยากให้เช็คจากตัวจริง ทักไลน์ @okm24 ได้เลย",
      },
    },
    specifications: {
      capacity: "20mL",
      airflow: "ปรับได้",
    },
    tagline: "พอตใช้แล้วทิ้งรุ่นพัฟเยอะของ INFY",
    shortDescription:
      "พอตใช้แล้วทิ้งพัฟเยอะจาก INFY ตัวที่ขายกันในไทย ตอนนี้มีกลิ่นไหนบ้าง ทักไลน์ @okm24 ถามได้เลย",
  },
  // Round 30.3 (2026-09-10) — MOOOD / Muro entries, same translation-only rule as above; these four
  // products had no Thai line, so their cards fell back to English once ProductCard started reading
  // this file. Taglines shortened by the owner ("รองรับสูงสุด N พัฟ" says everything the English does).
  "mood-monster-14k": {
    whoIsThisFor: {
      0: "อยากได้พอตใช้แล้วทิ้งสายพัฟเยอะ มีให้เลือกหลายกลิ่น",
    },
    specifications: {
      puffs: "สูงสุด 14,000",
      // Batch 5f (06/10): rows from MOOOD's own files (moood.ts).
      coil: "DUO MESH",
      capacity: "16mL บรรจุสำเร็จ",
      nicotine: "3%",
    },
    tagline: "พอตใช้แล้วทิ้ง รองรับสูงสุด 14,000 พัฟ",
    shortDescription: "พอตใช้แล้วทิ้งจาก MOOOD ซีรีส์ “Monster” รองรับสูงสุด 14,000 พัฟ และมีให้เลือกหลายกลิ่น",
  },
  "muro-3ml": {
    whoIsThisFor: {
      0: "มีเครื่องที่ใส่หัวพอต Muro 3ML ได้อยู่แล้ว ส่วนเครื่องตัวเองใช้ได้ไหม ถามก่อนได้ทางไลน์ @okm24",
    },
    tagline: "หัวพอตบรรจุน้ำยาสำเร็จ 3mL",
    shortDescription: "หัวพอตสำหรับเปลี่ยน บรรจุน้ำยาสำเร็จ 3mL ของ Muro มีให้เลือก 14 รส",
  },
  "muro-sc-8000": {
    whoIsThisFor: {
      0: "คนที่อยากได้พอตใช้แล้วทิ้งแบบชาร์จซ้ำได้ ไม่ใช่แบบแบตหมดแล้วจบ",
    },
    specifications: {
      puffs: "สูงสุด 8,000",
      battery: "600mAh ชาร์จซ้ำได้ผ่าน USB-C",
    },
    tagline: "พอตใช้แล้วทิ้งชาร์จซ้ำได้ รองรับสูงสุด 8,000 พัฟ",
    shortDescription: "พอตใช้แล้วทิ้งชาร์จซ้ำได้จาก Muro สาย “SC” แบตเตอรี่ 600mAh ชาร์จผ่าน USB-C รองรับสูงสุด 8,000 พัฟ ตอนนี้มีให้เลือก 12 รส",
  },
  "muro-connector-20k": {
    whoIsThisFor: {
      0: "อยากได้พอตใช้แล้วทิ้งสายพัฟเยอะ มีให้เลือกหลายกลิ่น",
    },
    specifications: {
      puffs: "สูงสุด 20,000",
    },
    tagline: "พอตใช้แล้วทิ้ง รองรับสูงสุด 20,000 พัฟ",
    shortDescription: "พอตใช้แล้วทิ้งจาก Muro สาย “Connector” รองรับสูงสุด 20,000 พัฟ ตอนนี้มีให้เลือก 20 รส",
  },
};
