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
  features?: Record<string, { title?: string; description: string }>;
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
        question: "แบตใช้ได้นานแค่ไหน",
        answer: "แบต 1600mAh เป็นตัวเลขที่ UWELL ระบุ ส่วนจะใช้ได้กี่วันขึ้นอยู่กับว่าสูบกี่วัตต์ ช่องลมเปิดแค่ไหน และเปิดจอบ่อยแค่ไหน เลยบอกเป็นตัวเลขตายตัวไม่ได้",
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
    features: {
      "three-pods": {
        title: "ในกล่องมีหัวพอต 3 หัว",
        description: "หนึ่งในสามหัวคือ GPP Alpha หัวรุ่นใหม่ของ UWELL ที่เหลือเป็นหัว GPP ปกติ เปิดกล่องมาก็มีหัวสำรองไว้เปลี่ยน",
      },
      "gpp-alpha": {
        title: "หัวพอต GPP Alpha",
        description: "หัวพอตรุ่นใหม่ของ UWELL ออกแบบให้คอยล์ใช้ได้นานขึ้น รสชาติคงที่ตั้งแต่พัฟแรกถึงพัฟสุดท้าย กันรั่วซึม และปากดูดเป็น TPU นุ่มปาก",
      },
      "triple-tap": {
        description: "ใช้เซ็นเซอร์จับการแตะแทนแถวปุ่มกด แตะเพื่อสลับโหมดวัตต์และเช็คสถานะเครื่อง ตัวเครื่องจึงเรียบ ไม่มีชิ้นส่วนเกิน",
      },
      "display-x-ui": {
        title: "จอสีเข้าชุดกับตัวเครื่อง",
        description: "จอสี 0.85 นิ้ว ธีมหน้าจอเข้ากับสีของตัวเครื่อง มองแวบเดียวก็เห็นแบต วัตต์ และโหมดที่ใช้อยู่",
      },
      "long-run-battery": {
        title: "แบต 1600mAh",
        description: "แบตในตัว ชาร์จครั้งเดียวใช้งานทั่วไปได้สูงสุด 6 วัน ตามตัวเลขของ UWELL ชาร์จผ่าน USB-C",
      },
      "aluminium-airflow": {
        title: "ตัวเครื่องอะลูมิเนียม ปรับลมได้ละเอียด",
        description: "ตัวเครื่องอะลูมิเนียมผิวด้าน ไม่ค่อยติดรอยนิ้วมือ ด้านข้างมีตัวปรับลมแบบไม่มีขั้น ปรับได้ตั้งแต่สูบแน่นแบบ MTL (ดูดเข้าปากก่อน) ไปจนถึงโล่งขึ้นแบบ RDL",
      },
    },
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
    },
    tagline: "G5 แบบเรียบง่าย แบตอึด พกใช้ทุกวัน",
    shortDescription:
      "รุ่นที่ตัดทอนความซับซ้อนลงจาก G5 ยังคงแบตเตอรี่ 1600mAh และสูงสุด 35 วัตต์เท่าเดิม แต่ปรับระบบควบคุมให้เรียบง่ายขึ้น",
    features: {
      "long-run-battery": {
        title: "แบตเตอรี่ 1600mAh เท่า G5",
        description: "ยกแบตเตอรี่ก้อนเต็มของ G5 มาใส่ในเครื่องที่เรียบง่ายกว่า ชาร์จครั้งเดียวใช้ได้นาน",
      },
    },
  },
  "caliburn-g5-lite-se": {
    whoIsThisFor: {
      0: "ชอบ G5 Lite อยู่แล้ว แค่อยากได้ชุดสีที่ต่างจากรุ่นมาตรฐาน",
    },
    specifications: {
      battery: "1600mAh",
    },
    tagline: "G5 Lite ตัวเครื่องเดิม ในชุดสีรุ่นพิเศษ",
    shortDescription: "ใช้แบตเตอรี่ 1600mAh และสูงสุด 35 วัตต์เท่ากับ G5 Lite ต่างกันที่ชุดสีรุ่นพิเศษ",
    features: {
      "se-finish": {
        title: "ชุดสีรุ่นพิเศษ",
        description: "ตัวเครื่องเดียวกับ G5 Lite ไม่ได้เปลี่ยนสเปกข้างใน ต่างกันแค่ชุดสีรุ่นพิเศษ มี 8 สี",
      },
    },
  },
  "caliburn-g4-pro-koko": {
    faqs: {
      "g4-pro-koko-pods": {
        question: "ใช้หัวพอต Caliburn รุ่นก่อนได้ไหม",
        answer: "ได้ รุ่นนี้ใส่ได้ทั้งหัวพอต GPP รุ่นปัจจุบัน และหัวพอต Caliburn G3 ที่เป็นหัวรุ่นก่อน",
      },
    },
    whoIsThisFor: {
      0: "อยากได้ Caliburn ที่มีจอทัชและโหมดการสูบให้เลือก โดยไม่ต้องไปถึงพอตคิท",
      1: "บางวันสูบแน่นแบบ MTL บางวันอยากโล่งแบบ RDL รุ่นนี้เลือกโหมดจากจอได้เลย ไม่ต้องตั้งใหม่ทุกครั้ง",
    },
    specifications: {
      battery: "2000mAh ในตัว",
      screen: "จอทัชสกรีน 2 นิ้ว",
      "pod-compat": "UWELL GPP และ Caliburn G3",
    },
    tagline: "จอทัชสกรีนรุ่นแรกในสาย KOKO",
    shortDescription:
      "พอตแบตเตอรี่ 2000mAh 35 วัตต์ จอทัชสกรีน 2 นิ้ว ระบบปรับรสชาติ Pro-FOCS 4.0 สลับโหมดการสูบได้ทั้ง Storm / Waves / Custom",
    features: {
      touchscreen: {
        title: "จอทัชสกรีน 2 นิ้ว",
        description: "ทัชสกรีนตัวแรกของสาย KOKO สลับโหมดและปรับวัตต์บนจอได้เลย ไม่ต้องใช้ปุ่มกด",
      },
      "pro-focs": {
        description: "ระบบปรับรสชาติและปริมาณไอรุ่นปัจจุบันของ UWELL ใช้กับหัวพอต GPP",
      },
      modes: {
        title: "โหมด Storm / Waves / Custom",
        description: "มีโหมดที่ตั้งค่ามาให้ บวกโหมด Custom ที่ตั้งเอง ไล่ตั้งแต่สูบนุ่มเบาไปจนถึงแน่นและแรงขึ้น",
      },
    },
  },
  "caliburn-g4-pro": {
    whoIsThisFor: {
      0: "ชอบจอทัชใหญ่ ๆ กดปรับอะไรบนจอก็ง่าย ไม่ต้องเพ่ง",
      1: "ละเอียดเรื่องช่องลม อยากหมุนหาจุดที่ใช่ของตัวเอง มากกว่าจะเลือกได้แค่ตามขั้นที่เครื่องกำหนด",
    },
    specifications: {
      battery: "1800mAh ในตัว",
      screen: "จอทัชสกรีน 2.51 นิ้ว",
      pod: "3mL",
      airflow: "ปรับได้แบบไม่มีขั้น",
      "pod-compat": "UWELL GPP และ Caliburn G3",
    },
    tagline: "จอทัชสกรีน 2.51 นิ้ว บนตัวเครื่องสาย G4",
    shortDescription:
      "พอตแบตเตอรี่ 1800mAh 35 วัตต์ จอทัชสกรีน 2.51 นิ้ว ปรับช่องลมได้แบบไม่มีขั้น",
    features: {
      shatterproof: {
        title: "จอทัชสกรีน 2.51 นิ้ว",
        description: "แตะปรับตั้งค่าบนจอได้เลย",
      },
      "stepless-airflow": {
        title: "ปรับช่องลมแบบไม่มีขั้น",
        description: "แหวนปรับลมหมุนได้ต่อเนื่อง ไม่ล็อกเป็นขั้น ๆ จะเอาแน่นหรือโล่งแค่ไหนก็ปรับได้ละเอียด",
      },
    },
  },
  "caliburn-g4": {
    whoIsThisFor: {
      0: "อยากได้จอไว้เลือกโหมดวัตต์ แต่ไม่ได้ต้องการถึงจอทัชแบบรุ่น Pro",
    },
    specifications: {
      battery: "1300mAh ในตัว",
      "charge-time": "USB-C ชาร์จเร็ว 5V/2A",
      screen: "จอสี 0.85 นิ้ว มีโหมด Storm กับ Waves",
      firing: "สูบได้เลย หรือกดปุ่มก็ได้",
      "pod-compat": "UWELL GPP (ในกล่องมีหัว mesh 0.4Ω กับ 0.9Ω)",
      output: "35W",
    },
    tagline: "จอสีพร้อมปุ่มยิง บนตัวเครื่อง G4 มาตรฐาน",
    shortDescription:
      "G4 รุ่นมาตรฐาน: เครื่องแบตเตอรี่ 1300mAh พร้อมจอสี เลือกโหมดวัตต์ได้ และใช้ปุ่มยิง — จุดกึ่งกลางระหว่างรุ่น Mini ที่ไม่มีจอ กับรุ่น Pro ที่เป็นทัชสกรีน",
    features: {
      "power-modes": {
        title: "เลือกโหมดวัตต์ได้",
        description: "มีจอสีให้เลือกโหมดวัตต์ได้หลายระดับ ปรับได้มากกว่ารุ่น Mini ที่ไม่มีจอ",
      },
    },
  },
  "caliburn-g4-mini": {
    whoIsThisFor: {
      0: "อยากได้เครื่องเล็ก ๆ ไม่ซับซ้อน แต่หัวพอต GPP ยังใช้ร่วมกับ G4 และ G5 ได้",
      1: "ไม่ชอบมีจอหรือเมนูให้ต้องคอยดู ขอแค่เครื่องที่หยิบมาใช้ได้ตรง ๆ",
    },
    specifications: {
      battery: "1100mAh ในตัว",
      screen: "ไม่มีจอ",
      "pod-compat": "UWELL GPP (ในกล่องมีหัว mesh 0.6Ω)",
    },
    tagline: "G4 เวอร์ชันย่อส่วน พกพาง่าย",
    shortDescription:
      "G4 รุ่นเล็ก เบากว่า ไม่มีจอ เน้นพกง่าย ใช้หัวพอต GPP ตัวเดียวกับ G4 แบตเตอรี่เล็กลงเป็น 1100mAh",
    features: {
      pocketable: {
        title: "เล็ก เบา พกง่าย",
        description: "ตัดจอและความสามารถอื่นของ G4 ออก เหลือตัวเครื่องที่เล็กและเบากว่า G4",
      },
    },
  },
  "caliburn-g4-classic": {
    whoIsThisFor: {
      0: "ถูกใจการใช้งานของ G4 อยู่แล้ว แต่อยากได้ตัวเครื่องในชุดสีรุ่น Classic",
    },
    tagline: "G4 ตัวเครื่องเดิม ในชุดสีรุ่น Classic",
    shortDescription:
      "Caliburn G4 รุ่น Classic ตัวเครื่องเดียวกับ G4 รุ่นมาตรฐาน มี 4 สี ใช้หัวพอต GPP เหมือนกัน",
    features: {
      "classic-finish": {
        title: "ชุดสีรุ่น Classic",
        description: "ชุดสีอีกแบบบนตัวเครื่อง G4 เดิม ไม่ใช่รุ่นที่เปลี่ยนสเปกข้างใน มี 4 สี",
      },
    },
  },
  "caliburn-g3-pro": {
    whoIsThisFor: {
      0: "อยากได้พอตซิสเต็มที่มีจอให้ดู ไม่ใช่แค่ไฟ LED กะพริบบอกสถานะ",
      1: "ยังไม่รู้ว่าชอบสูบแน่นแบบ MTL หรือโล่งแบบ RDL ในกล่องมีหัวพอตให้ลองทั้งสองแบบโดยไม่ต้องซื้อเพิ่ม",
    },
    specifications: {
      battery: "1000mAh ชาร์จ USB-C 2A",
      screen: "จอ LCD โอบรอบด้านข้าง",
      pod: "3mL (หัว 0.4Ω) / 2.5mL (หัว 0.9Ω) มีให้ทั้งสองหัวในกล่อง",
      airflow: "ปรับได้ทุกระดับ",
    },
    tagline: "Caliburn รุ่นแรกที่จอ LCD โอบรอบด้านข้าง",
    shortDescription:
      "พอตแบตเตอรี่ 1000mAh สูงสุด 35 วัตต์ พร้อมจอ LCD ที่โอบรอบด้านข้างตัวเครื่อง ปรับช่องลมได้ทุกระดับ และในกล่องมีหัวพอตให้ 2 ตัว คนละโอห์ม",
    features: {
      "wraparound-screen": {
        title: "จอ LCD โอบรอบด้านข้าง",
        description: "จอตัวแรกในตระกูล Caliburn ที่โอบไปทั้งด้านข้างของเครื่อง ไม่ใช่จอเล็ก ๆ ในช่องเดียว",
      },
      "dual-pod": {
        title: "หัวพอต 2 ตัว คนละโอห์ม",
        description: "ในกล่องมีหัวพอต 0.4 โอห์มสำหรับสูบโล่งแบบ RDL และ 0.9 โอห์มสำหรับสูบแน่นแบบ MTL แกะกล่องแล้วลองได้ทั้งสองแบบเลย",
      },
    },
  },
  "caliburn-g3-pro-koko": {
    whoIsThisFor: {
      0: "ชอบสเปกของ G3 Pro แต่อยากได้ในชุดสีรุ่น KOKO",
    },
    tagline: "G3 Pro ตัวเครื่องเดิม ในชุดสีรุ่น KOKO",
    shortDescription:
      "Caliburn G3 Pro รุ่น KOKO ตัวเครื่องเดียวกับ G3 Pro รุ่นมาตรฐาน มี 8 สี ใช้หัวพอต Caliburn G3 เหมือนกัน",
    features: {
      "koko-finish": {
        title: "ชุดสีรุ่น KOKO",
        description: "ชุดสี KOKO บนตัวเครื่อง G3 Pro เดิม ไม่ใช่รุ่นที่เปลี่ยนสเปกข้างใน มี 8 สี",
      },
    },
  },
  "argus-g4": {
    faqs: {
      "argus-g4-life": {
        question: "แบตอยู่ได้กี่วัน",
        answer: "VOOPOO ระบุว่าประมาณ 5 วันเมื่อใช้งานปกติ ของจริงขึ้นอยู่กับว่าสูบกี่วัตต์ เปิดจอบ่อยแค่ไหน และสูบถี่แค่ไหน",
      },
      "argus-g4-pods": {
        question: "สลับหัวพอตคนละโอห์มได้ไหม",
        answer: "ได้ หัวพอต ARGUS แบบเติมด้านบนเป็นทรงเดียวกันทุกหัว ต่างกันแค่โอห์มในช่วง 0.4–3.0 โอห์ม ใส่สลับกันบนเครื่องเดิมได้เลย",
      },
    },
    whoIsThisFor: {
      0: "ชอบเช็คสถานะเครื่องจากจอ ไม่ต้องเดาเอาเองว่าแบตใกล้หมดหรือยัง",
      1: "เน้นชาร์จเร็วและแบตอยู่ได้หลายวัน มากกว่าจะเอาวัตต์สูง ๆ",
      2: "ย้ายมาจากเครื่องที่ไม่มีจอ อยากได้เครื่องที่บอกอะไรมากขึ้น แต่ยังไม่ถึงขั้นต้องไป box mod",
    },
    specifications: {
      battery: "1650mAh ในตัว",
      screen: "จอ HD 0.85 นิ้ว แสดงแบต วัตต์ โอห์ม สถานะล็อก และจำนวนพัฟ",
      charging: "USB-C 5V/2A ชาร์จเต็มประมาณ 45 นาที",
      materials: "ซิงค์อัลลอย หนัง อะลูมิเนียมอัลลอย",
      pod: "ARGUS แบบเติมด้านบน มีหลายโอห์มให้เลือก",
    },
    tagline: "พอตคิทแบตอึดใช้ได้ 5 วัน พร้อมจอสถานะ HD 0.85 นิ้ว",
    shortDescription:
      "รุ่นเรือธงสายหลักของ ARGUS: แบตเตอรี่ 1650mAh 5–35 วัตต์ จอ HD 0.85 นิ้วแสดงระดับแบต วัตต์ โอห์ม สถานะล็อก และจำนวนพัฟ ชาร์จเร็วผ่าน USB-C เต็มใน 45 นาที",
    features: {
      "hd-screen": {
        title: "จอสถานะ HD 0.85 นิ้ว",
        description: "แบตเหลือเท่าไหร่ วัตต์เท่าไหร่ คอยล์กี่โอห์ม ล็อกอยู่ไหม สูบไปกี่พัฟ เหลือบดูจอทีเดียวรู้หมด",
      },
      "fast-charge": {
        title: "ชาร์จเต็มใน 45 นาที",
        description: "ชาร์จผ่าน USB-C 5V/2A จากแบตหมดจนเต็มใช้เวลาประมาณ 45 นาที",
      },
      "multi-resistance-pod": {
        title: "หัวพอตทรงเดียว รองรับหลายโอห์ม",
        description: "หัวพอตเติมด้านบนทรงเดียวกัน มีหลายโอห์มให้เลือก อยากเปลี่ยนแนวการสูบก็เปลี่ยนแค่หัวพอต ไม่ต้องเปลี่ยนเครื่อง",
      },
    },
  },
  "argus-g4-mini": {
    whoIsThisFor: {
      0: "ปกติสูบไม่ถึง 35 วัตต์อยู่แล้ว อยากได้ ARGUS G4 ที่ตัวเล็กกว่า รุ่น Mini ก็พอ",
    },
    specifications: {
      battery: "1650mAh ในตัว",
      pod: "ARGUS แบบเติมด้านบน",
    },
    tagline: "แบตเตอรี่เท่า G4 ในตัวเครื่องที่เล็กลง วัตต์ลดเหลือ 30 วัตต์",
    shortDescription: "ARGUS G4 ในตัวเครื่องที่เล็กลง แบตเตอรี่ 1650mAh เท่าเดิม วัตต์สูงสุดลดจาก 35 วัตต์ เหลือ 30 วัตต์",
    features: {
      "same-battery-smaller-shell": {
        title: "แบตก้อนเต็ม ในตัวเครื่องที่เล็กกว่า",
        description: "ใส่แบตเตอรี่ 1650mAh ก้อนเดียวกับ ARGUS G4 ในตัวเครื่องที่เล็กกว่า แลกกับวัตต์สูงสุดที่ลดลงเหลือ 30 วัตต์",
      },
    },
  },
  "argus-p3": {
    whoIsThisFor: {
      0: "อยากได้พอตคิทสาย ARGUS ที่เข้าเมนูและตั้งค่าทุกอย่างจากจอทัชได้เลย",
    },
    specifications: {
      battery: "1500mAh ในตัว",
      screen: "จอทัชเต็มจอ TFT HD 2.01 นิ้ว",
      pod: "ARGUS แบบเติมด้านบน",
    },
    tagline: "จอทัชเต็มจอ TFT HD 2.01 นิ้ว บนพอตคิทสาย ARGUS ของ VOOPOO",
    shortDescription: "พอตคิทแบตเตอรี่ 1500mAh 5–30 วัตต์ จอทัช TFT HD 2.01 นิ้ว กดเลือกเมนูและโหมดบนจอได้เลย",
    features: {
      "full-touch": {
        title: "จอทัชเต็มจอ TFT HD",
        description: "จอทัช 2.01 นิ้ว กดเข้าเมนูได้ครบ ไม่ใช่แค่จอโชว์สถานะ",
      },
    },
  },
  "argus-g3-mini": {
    whoIsThisFor: {
      0: "เพิ่งเริ่มสูบพอต ไม่อยากยุ่งกับปุ่มหรือเมนูอะไรทั้งนั้น หยิบขึ้นมาดูดได้เลย",
      1: "อยากได้เครื่องเบา ๆ แค่ 41 กรัม พกไว้ในกระเป๋ากางเกงแล้วแทบไม่รู้สึก",
    },
    specifications: {
      battery: "1350mAh ในตัว",
      output: "30W (เครื่องเลือกวัตต์ให้ตามหัวพอต ตั้งเองไม่ได้)",
      pod: "ARGUS Top Fill Cartridge V2 0.7Ω 3mL (2mL ตามมาตรฐาน TPD)",
      firing: "ไม่มีปุ่ม สูบได้เลย",
    },
    tagline: "ไม่มีปุ่ม ไม่ต้องตั้งค่า ชิป GENE.AI ปรับวัตต์ให้เองตามหัวพอต",
    shortDescription:
      "พอตคิทเหมาะมือใหม่ แบตเตอรี่ 1350mAh สูงสุด 30 วัตต์ ปรับวัตต์อัตโนมัติตามหัวพอตที่ใส่ ทำงานด้วยชิป GENE.AI ของ VOOPOO และหัวพอตกันรั่ว iCOSM CODE 2.0",
    features: {
      "auto-draw": {
        title: "ไม่มีปุ่ม สูบได้เลย",
        description: "ไม่มีปุ่มยิง แค่ดูดเครื่องก็ทำงาน วัตต์ปรับให้เองตามโอห์มของหัวพอตที่ใส่",
      },
      icosm: {
        title: "กันรั่ว iCOSM CODE 2.0",
        description: "ซีลของหัวพอตรุ่น V2 ออกแบบใหม่ ให้น้ำยารั่วซึมน้อยลงทั้งตอนพกและตอนเติม",
      },
    },
  },
  "drag-6": {
    faqs: {
      "drag6-rebuildable": {
        question: "DRAG 6 ใช้คอยล์พันเองได้ไหม",
        answer: "ตามสเปกมีโหมด RBA (โหมดสำหรับคอยล์พันเอง) ให้เลือก คู่กับโหมด SMART และ TC-TCR ส่วนจะใช้กับหัวพอตพันคอยล์ตัวไหนได้ ทักไลน์ @okm24 ถามได้",
      },
    },
    whoIsThisFor: {
      0: "คนที่สูบวัตต์สูงและใช้ box mod มาก่อน อยากได้แบตในตัวก้อนใหญ่ มากกว่าเครื่องที่ต้องถอดเปลี่ยนถ่าน",
      1: "อยากมีโหมด RBA และ TC-TCR ติดเครื่องไว้ด้วย มากกว่าแค่ปรับวัตต์อย่างเดียว",
    },
    specifications: {
      battery: "4400mAh ในตัว (ถ่าน 2200mAh สองก้อน)",
      screen: "จอ TFT 1.66 นิ้ว แสดงวัตต์ แบต โอห์ม จำนวนพัฟ และโหมด",
      modes: "SMART / RBA / TC-TCR",
      control: "ล้อปรับวัตต์ละเอียด และเซ็นเซอร์แตะที่ปุ่มยิงไว้ปลดล็อก",
    },
    tagline: "220 วัตต์ ชิป GENE.TT 3.0 ปรับวัตต์ละเอียดด้วยล้อหมุน",
    shortDescription:
      "รุ่นเรือธงล่าสุดของสาย DRAG: แบตเตอรี่ในตัว 4400mAh (ถ่าน 2200mAh สองก้อน) สูงสุด 220 วัตต์ จอ TFT ขนาด 1.66 นิ้ว และปุ่มยิงมีเซ็นเซอร์แตะไว้ปลดล็อกเครื่อง",
    features: {
      "adjustment-wheel": {
        title: "ล้อปรับวัตต์",
        description: "ล้อหมุนบนตัวเครื่อง ปรับวัตต์ได้ละเอียด ส่วนปุ่มยิงมีเซ็นเซอร์แตะไว้ปลดล็อกเครื่อง",
      },
      "gene-tt-3": {
        title: "ชิป GENE.TT 3.0",
        description: "ชิปของ VOOPOO สำหรับเครื่องวัตต์สูง มีโหมด SMART RBA และ TC-TCR ให้เลือก",
      },
    },
  },
  "drag-s3": {
    whoIsThisFor: {
      0: "อยากได้วัตต์แบบสาย DRAG แต่ไม่อยากยุ่งกับถ่าน 18650/21700",
    },
    specifications: {
      battery: "3000mAh ในตัว",
      screen: "จอ TFT 0.96 นิ้ว",
      materials: "ซิงค์อัลลอย หนัง",
      charging: "USB-C 5V/2A",
    },
    tagline: "แบตเตอรี่ในตัว 3000mAh สูงสุด 60 วัตต์",
    shortDescription: "DRAG รุ่นแบตเตอรี่ในตัว: 3000mAh 5–60 วัตต์ จอ TFT ขนาด 0.96 นิ้ว และชาร์จผ่าน USB-C",
    features: {
      "built-in-3000": {
        title: "แบตในตัว ไม่ต้องซื้อถ่านแยก",
        description: "แบตเตอรี่ 3000mAh อยู่ในตัวเครื่อง ชาร์จผ่าน USB-C ตัดเรื่องถอดเปลี่ยนถ่านไปเลย",
      },
    },
  },
  "drag-x3": {
    faqs: {
      "dragx3-battery": {
        question: "ในกล่องมีถ่านมาให้ไหม",
        answer: "ไม่มี DRAG X3 ใช้ถ่าน 18650 หรือ 21700 หนึ่งก้อน ต้องซื้อถ่านแยก",
      },
    },
    whoIsThisFor: {
      0: "ถนัดใช้ถ่านถอดเปลี่ยนมากกว่าแบตในตัว ถ่านเสื่อมก็เปลี่ยนก้อนใหม่ ไม่ต้องเปลี่ยนเครื่อง",
      1: "อยากคุมทุกอย่างจากจอทัช ในเครื่องที่ไปถึง 80 วัตต์",
    },
    specifications: {
      battery: "ถ่าน 18650 หรือ 21700 ก้อนเดียว (ไม่รวมในกล่อง)",
      screen: "จอทัชสกรีน 1.66 นิ้ว",
      materials: "ซิงค์อัลลอย หนัง",
    },
    tagline: "80 วัตต์ บนถ่านถอดเปลี่ยนได้ 18650/21700",
    shortDescription: "DRAG รุ่นใช้ถ่านก้อนเดียว (18650 หรือ 21700 ซื้อแยก) สูงสุด 80 วัตต์ พร้อมจอทัชสกรีน 1.66 นิ้ว",
    features: {
      "external-cell": {
        title: "ถอดเปลี่ยนถ่าน 18650/21700 ได้",
        description: "ใช้ถ่าน 18650 หรือ 21700 ก้อนเดียว (ไม่รวมในกล่อง) แทนแบตในตัว มีถ่านสำรองก็สลับใส่ใช้ต่อได้เลย ไม่ต้องรอชาร์จ",
      },
      "touchscreen-166": {
        title: "จอทัชสกรีน 1.66 นิ้ว",
        description: "จอทัช 1.66 นิ้ว เข้าเมนูและสลับโหมดได้จากจอโดยตรง",
      },
    },
  },
  "vinci-s": {
    whoIsThisFor: {
      0: "อยากได้พอตคิทวัตต์กลาง ๆ 5–40 วัตต์ แบตเตอรี่ 2000mAh ในตัว ที่ใส่หัวพอตได้หลายโอห์ม",
      1: "เบื่อดึงหัวพอตออกมาเติมน้ำยาแล้วต้องเสียบกลับทุกที",
    },
    specifications: {
      battery: "2000mAh ในตัว",
      pod: "4.5mL (2mL ตามมาตรฐาน TPD)",
      fill: "เติมด้านบน",
      materials: "อะลูมิเนียมอัลลอยและ PC",
    },
    tagline: "40 วัตต์ หัวพอตเติมด้านบน",
    shortDescription: "พอตคิทแบตเตอรี่ 2000mAh 5–40 วัตต์ หัวพอตเติมด้านบนความจุ 4.5mL (2mL ตามมาตรฐาน TPD) ช่วง 0.3–3.0 โอห์ม",
    features: {
      "topside-fill": {
        title: "หัวพอตเติมด้านบน",
        description: "หัวพอตเสียบคาเครื่องอยู่ก็เติมน้ำยาจากด้านบนได้เลย",
      },
    },
  },
  "vmate-i3": {
    whoIsThisFor: {
      0: "พกพอตติดตัวทั้งวัน อยากได้เครื่องบาง ๆ ที่หยิบเข้าหยิบออกกระเป๋าได้คล่อง",
    },
    specifications: {
      battery: "1500mAh ในตัว",
      pod: "3mL VMATE Top Fill Cartridge (ใช้หัว V2 ได้ด้วย)",
      charging: "USB-C 2A ชาร์จเร็ว",
    },
    tagline: "พอตคิทตัวบาง ยาว 103mm",
    shortDescription: "พอตคิทสาย VMATE ของ VOOPOO: เครื่องอะลูมิเนียมอัลลอยบาง 15.1mm แบตเตอรี่ 1500mAh 5–30 วัตต์ หัวพอตเติมด้านบน 3mL",
    features: {
      "slim-body": {
        title: "ตัวเครื่องอะลูมิเนียมอัลลอย บาง 15.1mm",
        description: "15.1mm คือความหนาของตัวเครื่อง พกใส่กระเป๋ากางเกงได้สบาย",
      },
    },
  },
  "m-bar-10k": {
    faqs: {
      "m-bar-10k-modes": {
        question: "สลับโหมดวัตต์ยังไง",
        answer: "กดสองครั้งติดกัน โหมดจะวนสลับระหว่าง Eco Soft และ Boost ส่วนไฟ RGB จะเปลี่ยนสีบอกว่าตอนนี้อยู่โหมดไหน",
      },
      "m-bar-10k-recharge": {
        question: "ชาร์จได้ไหม",
        answer: "ได้ ชาร์จผ่าน USB-C แบตหมดก็ชาร์จแล้วใช้ต่อได้ ไม่ใช่แบบแบตหมดแล้วจบ",
      },
    },
    whoIsThisFor: {
      0: "ยังสูบพอตใช้แล้วทิ้งอยู่ แต่อยากสลับโหมดวัตต์ได้ด้วย (Eco / Soft / Boost)",
      1: "คนที่อยากได้พอตใช้แล้วทิ้งแบบชาร์จซ้ำได้ ไม่ใช่แบบแบตหมดแล้วจบ",
    },
    specifications: {
      puffs: "สูงสุด 10,000",
      battery: "600mAh ชาร์จซ้ำได้ผ่าน USB-C",
      coil: "cotton mesh",
      modes: "Eco / Soft / Boost กดสองครั้งเพื่อสลับ",
      indicator: "LED บอกระดับแบตเป็นขั้นละ 25% ส่วน RGB บอกโหมดที่ใช้อยู่",
    },
    tagline: "3 โหมดวัตต์ วงแหวน RGB แสดงสถานะ รองรับ 10,000 พัฟ",
    // Round 8 B2: "Marbo" sentence — many shops use that name for M Bar (researcher-1 row 3a). No maker claim.
    shortDescription: "พอตใช้แล้วทิ้งชาร์จซ้ำได้ รองรับสูงสุด 10,000 พัฟ ใช้คอยล์ cotton mesh มี 3 โหมดวัตต์ให้สลับ พร้อมไฟ RGB แสดงโหมดที่ใช้งานอยู่ หลายร้านเรียก M Bar ว่า Marbo เป็นรุ่นเดียวกันนี้แหละ",
    features: {
      // 2026-09-30 "more details" story blocks (writer): posters 02 and 05.
      "bottle-shape": {
        title: "ทรงขวดน้ำยา ฐานไล่สี",
        description: "ทรงเหมือนขวดน้ำยา ตรงฐานไล่สีต่างกันไปตามกลิ่น",
      },
      "ten-k-puffs": {
        title: "สูงสุด 10,000 พัฟ",
        description: "รองรับสูงสุด 10,000 พัฟ แบต 600mAh หมดก็ชาร์จผ่าน USB-C แล้วสูบต่อได้",
      },
      "three-modes": {
        title: "สลับได้ 3 โหมดวัตต์",
        description: "Eco Soft และ Boost กดสองครั้งติดกันก็สลับโหมดได้เลย ความแรงเปลี่ยนทันที",
      },
      "rgb-indicator": {
        title: "ไฟ RGB บอกโหมด",
        description: "ไฟ LED เปลี่ยนสีตามโหมดที่ใช้อยู่ เหลือบดูก็รู้ว่าตอนนี้เป็น Eco Soft หรือ Boost",
      },
      "mesh-coil": {
        title: "คอยล์ cotton mesh",
        description: "คอยล์แบบ mesh ออกแบบมาให้รสคงที่ตั้งแต่พัฟแรกไปจนครบจำนวนพัฟที่ระบุ",
      },
    },
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
    whoIsThisFor: {
      0: "ถ้าดูจำนวนพัฟก่อนอย่างอื่น รุ่นนี้คือตัวที่พัฟเยอะที่สุดในตระกูล M Bar",
    },
    specifications: {
      puffs: "สูงสุด 15,000",
      coil: "cotton mesh",
      charging: "USB-C ชาร์จเร็ว",
    },
    tagline: "M Bar รุ่นพัฟเยอะสุดของตระกูล ชาร์จซ้ำได้ผ่าน USB-C",
    shortDescription:
      "พอตใช้แล้วทิ้งชาร์จซ้ำได้ รองรับสูงสุด 15,000 พัฟ คอยล์ cotton mesh ชาร์จเร็วผ่าน USB-C มี 15 รส",
    features: {
      "highest-puff": {
        title: "15,000 พัฟ มากที่สุดในตระกูล M Bar",
        description: "อยู่เหนือ M Bar 9K และ 10K ในสายเดียวกัน ตามจำนวนพัฟที่ SALTHUB ระบุไว้",
      },
    },
  },
  "m-switch-kit": {
    faqs: {
      "m-switch-vs-disposable": {
        question: "ต่างจาก M Bar แบบใช้แล้วทิ้งตรงไหน",
        answer: "M Bar ใช้จนหมดแล้วทิ้งทั้งเครื่อง ส่วน M Switch Kit ทิ้งแค่หัวพอต M Switch Pod ที่หมด ตัวเครื่องชาร์จซ้ำได้ เก็บไว้ใช้ต่อ",
      },
    },
    whoIsThisFor: {
      0: "ใช้พอตใช้แล้วทิ้งอยู่ แต่เสียดายที่ต้องทิ้งทั้งเครื่องทุกครั้ง อยากได้ตัวเครื่องที่ใช้ซ้ำได้",
    },
    specifications: {
      "puffs-per-pod": "สูงสุด 15,000",
      format: "ตัวเครื่องใช้ซ้ำได้ เปลี่ยนแค่หัวพอตบรรจุสำเร็จ",
    },
    tagline: "ตัวเครื่องใช้ซ้ำได้ หัวพอตบรรจุสำเร็จ",
    shortDescription:
      "ตัวเครื่องใช้ซ้ำได้ จับคู่กับหัวพอต M Switch Pod บรรจุสำเร็จ รองรับสูงสุด 15,000 พัฟต่อหัวพอต เก็บตัวเครื่องไว้ชาร์จใช้ต่อ แล้วเปลี่ยนแค่หัวพอต ไม่ต้องเติมน้ำยา",
    features: {
      "keep-the-body": {
        title: "เก็บเครื่องไว้ เปลี่ยนแค่หัวพอต",
        description: "น้ำยาหมดก็ทิ้งแค่หัวพอต M Switch Pod ใส่หัวใหม่แล้วใช้ต่อได้เลย ตัวเครื่องเก็บไว้ชาร์จใช้ซ้ำ",
      },
    },
  },
  "m-switch-pod": {
    whoIsThisFor: {
      0: "คนที่มีเครื่อง M Switch Kit อยู่แล้ว มาซื้อหัวพอตเพิ่มหรือเปลี่ยนรส",
    },
    specifications: {
      battery: "600mAh",
    },
    tagline: "หัวพอตบรรจุสำเร็จสำหรับ M Switch Kit",
    shortDescription: "หัวพอตสำหรับเปลี่ยน บรรจุน้ำยาสำเร็จ ใช้กับตัวเครื่อง M Switch Kit",
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
      0: "อยากได้เครื่องระบบสวิตช์ที่เลือกโหมดวัตต์ได้เอง แทนแบบที่ล็อกวัตต์ไว้ค่าเดียว",
    },
    specifications: {
      "puffs-per-pod": "สูงสุด 5,000",
      modes: "3 โหมด",
    },
    tagline: "3 โหมด ในตัวเครื่องระบบสวิตช์ใช้ซ้ำได้",
    shortDescription: "เครื่องระบบสวิตช์ใช้ซ้ำได้ มี 3 โหมดวัตต์ ใช้หัวพอต Zero Cartridge รองรับสูงสุด 5,000 พัฟต่อหัวพอต",
    features: {
      "3-mode": {
        title: "3 โหมดวัตต์",
        description: "เลือกวัตต์ได้ 3 โหมดจากตัวเครื่องที่ใช้ซ้ำได้ เปลี่ยนแค่ Zero Cartridge ซึ่งเป็นหัวเดียวกับที่ Zero Nano ใช้",
      },
    },
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
      0: "อยากได้พอตใช้แล้วทิ้งจากแบรนด์ที่รุ่นและรสทั้งหมดเช็คได้บนเว็บทางการ",
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
    features: {
      "official-lineup": {
        title: "อยู่ในไลน์อัพทางการของ RELX",
        description: "ตัวรุ่น สเปก และรายชื่อรสทั้ง 10 รส เช็คตรงจากเว็บทางการของ RELX ไม่ได้อ้างจากร้านค้าอื่น",
      },
    },
  },
  // Round "image-sitewide" 2026-09-30 (writer draft A): re-published as a device + prefilled pods, not a disposable.
  "relx-creator": {
    whoIsThisFor: {
      0: "อยากได้ตัวเครื่องที่ใช้ซ้ำได้ แต่ไม่อยากเติมน้ำยาเอง",
    },
    faqs: {
      "relx-creator-pods": {
        question: "RELX Creator ใช้กับหัวพอตรุ่นไหนได้บ้าง",
        answer: "ใส่ได้ทั้งหัวพอต RELX Creator 20K และหัวพอต Muro Connector สองรุ่นนี้ร้านยืนยันจากของจริงที่มีอยู่ ถ้าจะใช้กับหัวพอตรุ่นอื่น ทักไลน์ @okm24 ถามก่อนได้เลย",
      },
    },
    specifications: {
      format: "ตัวเครื่องอย่างเดียว หัวพอตบรรจุสำเร็จขายแยก",
      battery: "800mAh ชาร์จซ้ำได้ผ่าน USB-C",
      modes: "15W Normal / 25W Boost กดสองครั้งสลับโหมด",
      screen: "จอพิกเซล โชว์หน้าอีโมจิ กดปุ่มครั้งเดียวดูแบต",
      airflow: "ปรับได้",
      compat: "RELX Creator 20K และ Muro Connector (ร้านยืนยันจากของจริง)",
    },
    tagline: "เครื่องใช้ซ้ำของ RELX ใส่หัวพอตบรรจุสำเร็จ หมดก็เปลี่ยนแค่หัว",
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
      0: "ลูกค้าที่ถามหา Joiway อยู่แล้ว รุ่นนี้เป็นตัวรสเดียว ส่วนแบบ 2 รสในเครื่องเดียวคือ F4",
    },
    tagline: "พอตใช้แล้วทิ้งจาก Joiway รุ่นรสเดียว",
    shortDescription:
      "พอตใช้แล้วทิ้งจาก Joiway รุ่นรสเดียว ถ้าอยากได้ 2 รสในเครื่องเดียว ดูรุ่น F4",
  },
  "joiway-f4": {
    whoIsThisFor: {
      0: "คนที่เบื่อรสเดียวเร็ว อยากได้ 2 รสในเครื่องเดียว สลับไปมาได้โดยไม่ต้องพกสองเครื่อง",
    },
    tagline: "พอตใช้แล้วทิ้ง 2 รสในเครื่องเดียว",
    shortDescription:
      "พอตใช้แล้วทิ้งจาก Joiway 2 โหมด 2 รสในเครื่องเดียว OKami24 รีวิวใช้จริง 30 วันไว้บน YouTube",
    features: {
      "dual-flavor": {
        title: "สลับได้ 2 รส",
        description: "น้ำยา 2 รสอยู่ในเครื่องเดียว สลับใช้ได้ทั้งสองรส เบื่อรสไหนก็สลับไปอีกรสได้ทันที",
      },
    },
  },
  "tfit-m-power-20k": {
    tagline: "พอตใช้แล้วทิ้งของ TFIT ที่ OKami24 รีวิวใช้จริงบน YouTube",
    shortDescription:
      "พอตใช้แล้วทิ้งสายพัฟเยอะของ TFIT ที่ขายในตลาดไทย OKami24 รีวิวใช้จริงบน YouTube ทักไลน์ @okm24 ถามรุ่นและรสที่มีตอนนี้ได้",
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
      0: "อยากได้พอตใช้แล้วทิ้งสายพัฟเยอะ ที่มีรสให้เลือกหลายรส",
    },
    specifications: {
      puffs: "สูงสุด 14,000",
    },
    tagline: "พอตใช้แล้วทิ้ง รองรับสูงสุด 14,000 พัฟ",
    shortDescription: "พอตใช้แล้วทิ้งจาก MOOOD ซีรีส์ “Monster” รองรับสูงสุด 14,000 พัฟ ตอนนี้มีให้เลือก 10 รส",
  },
  "muro-3ml": {
    whoIsThisFor: {
      0: "มีเครื่องที่ใส่หัวพอต Muro 3ML ได้อยู่แล้ว ส่วนเครื่องตัวเองใช้ได้ไหม ถามก่อนได้ทางไลน์ @okm24",
    },
    tagline: "หัวพอตบรรจุน้ำยาสำเร็จ 3mL",
    shortDescription: "หัวพอตสำหรับเปลี่ยน บรรจุน้ำยาสำเร็จ 3mL ของ Muro ตอนนี้มีให้เลือก 10 รส",
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
      0: "อยากได้พอตใช้แล้วทิ้งสายพัฟเยอะ และรสก็มีให้เลือกเยอะ",
    },
    specifications: {
      puffs: "สูงสุด 20,000",
    },
    tagline: "พอตใช้แล้วทิ้ง รองรับสูงสุด 20,000 พัฟ",
    shortDescription: "พอตใช้แล้วทิ้งจาก Muro สาย “Connector” รองรับสูงสุด 20,000 พัฟ ตอนนี้มีให้เลือก 20 รส",
  },
};
