/**
 * OKami24 — TH/ZH translations of Technology entry name/summary/body (owner quality review,
 * 2026-09-02). Same architecture and rationale as faq-copy.ts — see that file's header comment.
 * English in src/data/technology.ts stays canonical/untouched; this REPLACES it per-locale when a
 * translation exists. Technical terms (mesh, GENE.TT, GENE.AI, MTL, RDL, mAh) kept as-is.
 * Since round 30.2 (docs/THAI_STYLE.md §3–§4, owner 2026-09-09) a resistance written into Thai
 * prose reads "0.4–3.0 โอห์ม", not "0.4–3.0Ω" — Ω stays only inside spec tables.
 * Round SEO ข batch 4 (2026-09-21): every page grew from verified spec rows only; the Thai is
 * written fresh, not translated — source map in _incoming/seo-b/writer-batch4-sources.md.
 */
import type { ArticleFAQItem, GuideSection } from "@/types/catalog";

export interface TechnologyCopy {
  name: string;
  summary: string;
  body: GuideSection[];
  /** Round SEO ข: per-locale Q/A — replaces the English `faq` of the record when present. */
  faq?: ArticleFAQItem[];
}

export const TECHNOLOGY_COPY_TH: Record<string, TechnologyCopy> = {
  "mesh-coil-systems": {
    name: "ระบบคอยล์แบบ Mesh",
    summary: "คอยล์ mesh (แผ่นตาข่าย) เข้ามาแทนคอยล์ลวดกลมแบบเดิม พอตและพอตใช้แล้วทิ้งรุ่นปัจจุบันแทบทุกตัวใช้แบบนี้",
    body: [
      {
        heading: "ทำไมต้อง mesh แทนลวดกลม",
        paragraphs: [
          "คอยล์ mesh คืออะไร ทำไมพอตรุ่นปัจจุบันถึงใช้กันเยอะ ตอบสั้น ๆ คือคอยล์ mesh สัมผัสสำลีได้มากกว่าคอยล์ลวดกลมในขนาดเท่ากัน พอตซิสเต็ม พอตคิท และพอตใช้แล้วทิ้งรุ่นปัจจุบันส่วนใหญ่เลยใช้คอยล์แบบนี้เป็นหลัก",
          "ข้อดีหลักไม่ใช่แรงกว่า แต่คือนิ่งกว่า คอยล์ mesh ให้ความร้อนทั่วผิวคอยล์สม่ำเสมอกว่า จึงไม่ค่อยมีจุดร้อนเกินที่ทำให้ได้รสไหม้เป็นจุด ๆ",
          "ส่วนรสไหม้ที่โผล่มาหลังใช้ไปสักพักเป็นคนละเรื่อง นั่นแปลว่าสำลีในคอยล์หมดสภาพแล้ว ถึงเวลาเปลี่ยน อาการที่ต้องดูอยู่ใน [วิธีดูแลคอยล์และหัวพอต](/guides/coil-and-pod-maintenance)",
        ],
      },
      {
        heading: "ตัวอย่างจริง: คอยล์ mesh ใน M Bar 10K",
        paragraphs: [
          "[M Bar 10K](/products/m-bar-10k) ใช้คอยล์ cotton mesh ตามที่ SALTHUB ระบุ รุ่นนี้สูงสุด 10,000 พัฟ แบต 600mAh ชาร์จซ้ำได้ผ่าน USB-C และมี 3 โหมดวัตต์ Eco / Soft / Boost กดสองครั้งติดกันเพื่อสลับ",
          "รุ่นนี้เป็นพอตใช้แล้วทิ้ง คอยล์เลยไม่ต้องเปลี่ยน ใช้จนน้ำยาหมดก็จบ ถ้าอยากเทียบกับฝั่งที่เปลี่ยนคอยล์เองได้ อ่านที่ [พอตใช้แล้วทิ้ง หรือพอตซิสเต็ม](/guides/open-system-vs-disposable)",
        ],
      },
    ],
  },
  "multi-resistance-cartridges": {
    name: "ระบบหัวพอตหลายโอห์ม",
    summary: "หัวพอตทรงเดียว คอยล์ข้างในมีหลายโอห์ม ดูว่าหัวพอตเติมด้านบนของ ARGUS ทรงเดียวรองรับทั้ง MTL และ RDL ได้ยังไง",
    body: [
      {
        heading: "ทรงเดียว หลายโอห์ม",
        paragraphs: [
          "ระบบหัวพอตหลายโอห์มคืออะไร แทนที่จะทำหัวพอตคนละทรงสำหรับแต่ละแนวการสูบ เครื่องรุ่นปัจจุบันหลายตัว เช่น ตระกูล ARGUS ของ VOOPOO ใช้หัวพอตเติมด้านบนทรงเดียวกันทุกหัว ต่างกันแค่โอห์มของคอยล์ข้างใน",
          "จะเปลี่ยนจากสูบแน่นแบบ MTL ไปสูบโล่งขึ้นแบบ RDL ก็แค่เปลี่ยนหัวพอตเป็นโอห์มอื่น ใส่กับเครื่องเดิมได้เลย",
          "จุดนี้สำคัญเป็นพิเศษกับอุปกรณ์ที่มีช่วงโอห์มกว้าง (เช่น [ARGUS G4](/products/argus-g4) ที่ 0.4–3.0 โอห์ม) เพราะบ่งบอกว่าระบบหัวพอตนี้ออกแบบมาให้รองรับแนวการสูบได้มากกว่าหนึ่งแบบ โดยใช้เครื่องเดิมเครื่องเดียว",
          "แถวหัวพอตที่ใช้ได้ของ ARGUS G4 เขียนไว้ว่าเป็นระบบหัวพอต ARGUS เติมด้านบน มีหลายค่าโอห์ม แต่ช่วงโอห์มกว้างเป็นแค่ครึ่งเดียวของคำตอบ อีกครึ่งคือหัวพอตนั้นหาซื้อได้จริงไหม เรื่องนี้อธิบายไว้ที่ [วิธีอ่านตารางสเปก](/guides/reading-a-spec-sheet)",
        ],
      },
      {
        heading: "ตัวอย่างจริง: ARGUS G3 mini ในกล่องมีหัวพอตค่าเดียว (0.7 โอห์ม)",
        paragraphs: [
          "[ARGUS G3 mini](/products/argus-g3-mini) เป็นพอตคิทระบบออโต้ (auto-draw) ไม่มีปุ่มยิง สเปกบอกว่าเครื่องปรับวัตต์ให้เองตามหัวพอตที่ใส่ สูงสุด 30 วัตต์ แปลว่าระบบรองรับหัวพอตมากกว่าค่าเดียว",
          "แต่ในกล่องมีหัวพอตค่าเดียว คือ ARGUS Top Fill Cartridge V2 0.7 โอห์ม 3mL มีระบบกันรั่ว iCOSM CODE 2.0 ส่วนตัวเครื่องแบตในตัว 1350mAh",
          "VOOPOO ระบุว่า G3 mini ใช้หัวพอต ARGUS แบบเติมด้านบนได้ ในช่วง 0.4 · 0.7 และ 1.0 โอห์ม หน้า [หัวพอต VOOPOO Argus Pod](/products/coil-21) บนเว็บเรามีตัวเลือกหัวเติมด้านบน 0.4 โอห์ม ต่ำกว่าหัวในกล่อง และ 0.7 โอห์ม ค่าเดียวกับหัวในกล่อง ส่วนตัวเลือก 1.2 โอห์มเป็นหัวเติมด้านข้าง อยู่นอกช่วงของ G3 mini",
          "ส่วน MTL กับ RDL ที่พูดถึงข้างบนให้ความรู้สึกต่างกันยังไง อ่านที่ [MTL กับ DTL](/guides/understanding-mtl-vs-dtl)",
        ],
      },
    ],
    faq: [
      {
        question: "ARGUS G3 mini ใช้หัวโอห์มอื่นได้ไหม",
        answer: "ได้ ในกลุ่มหัวพอต ARGUS แบบเติมด้านบน ซึ่ง VOOPOO ระบุช่วงของเครื่องไว้ที่ 0.4 · 0.7 และ 1.0 โอห์ม ในกล่องมีหัว 0.7 โอห์มมาให้ค่าเดียว ส่วนหน้าหัวพอต VOOPOO Argus Pod บนเว็บเรามีตัวเลือกหัวเติมด้านบน 0.4 โอห์ม",
      },
      {
        question: "หัวพอตหลายโอห์มคืออะไร",
        answer: "หัวพอตทรงเดียวกัน ใส่เครื่องเดิมได้ แต่คอยล์ข้างในมีให้เลือกหลายค่าโอห์ม จะเปลี่ยนแนวการสูบก็เปลี่ยนแค่หัวพอต ตัวเครื่องใช้ตัวเดิม",
      },
    ],
  },
  "onboard-touch-displays": {
    name: "จอทัชสกรีนบนพอต",
    summary: "จอทัชสกรีนที่คุมได้ทั้งเครื่อง กำลังย้ายจาก box mod มาอยู่ในพอตตัวเล็ก",
    body: [
      {
        heading: "จากจอบอกสถานะ มาเป็นเมนูครบทั้งเครื่อง",
        paragraphs: [
          "พอตจอทัชต่างจากพอตจอธรรมดาตรงไหน จอพอตยุคแรกส่วนใหญ่โชว์แค่ระดับแบต ส่วนพอตจอทัชรุ่นปัจจุบัน อย่างจอทัช 2.51 นิ้วของ Caliburn G4 Pro หรือจอทัชเต็มจอ 2.01 นิ้วของ ARGUS P3 เข้าเมนูได้ครบ สลับโหมดและปรับวัตต์ได้บนจอโดยตรง",
          "จอกับระบบสัมผัสที่เพิ่มมา กินแบตมากขึ้นและทำให้ตัวเครื่องซับซ้อนกว่าเครื่องไม่มีจอ รุ่นที่เรียบกว่าในตระกูลเดียวกันอย่าง Caliburn G4 Mini จึงมักตัดจอออกไปเลย แลกกับตัวเครื่องที่เล็กและพกง่ายกว่า",
          "จอกับแบตเลยเป็นสองบรรทัดที่ต้องอ่านคู่กัน ตัวเลข mAh ใช้เทียบระหว่างรุ่นได้ แต่ไม่ได้บอกว่าใช้ได้กี่ชั่วโมง วิธีชาร์จและดูแลแบตอยู่ที่ [วิธีดูแลแบต](/guides/battery-care-and-charging)",
        ],
      },
      {
        heading: "ตัวอย่างจริง: จอ 2.51 นิ้วของ Caliburn G4 Pro เทียบกับจอ 2 นิ้วของ G4 Pro KOKO",
        paragraphs: [
          "[Caliburn G4 Pro](/products/caliburn-g4-pro) จอทัช 2.51 นิ้ว แบตในตัว 1800mAh วัตต์สูงสุด 35 วัตต์ ปรับช่องลมได้แบบไม่มีขั้น ใช้หัวพอต UWELL GPP และหัวพอต G3 รุ่นก่อน",
          "[Caliburn G4 Pro KOKO](/products/caliburn-g4-pro-koko) จอทัช 2 นิ้ว แบตในตัว 2000mAh วัตต์สูงสุด 35 วัตต์ เลือกโหมด Storm / Waves / Custom (โหมดแรงลม) ได้บนจอ มีระบบปรับรสชาติ Pro-FOCS 4.0 หัวพอตใช้ GPP และ G3 รุ่นก่อนเหมือนกัน",
          "เทียบจากสเปกที่ยืนยันแล้ว G4 Pro จอใหญ่กว่า (2.51 นิ้ว) KOKO แบตใหญ่กว่า (2000mAh) วัตต์สูงสุดเท่ากัน ใช้หัวพอตชุดเดียวกัน โหมด Storm / Waves / Custom ทำอะไรบ้าง อ่านที่ [MTL กับ DTL](/guides/understanding-mtl-vs-dtl)",
        ],
      },
      {
        heading: "ตัวอย่างจริง: จอทัชเต็มจอ 2.01 นิ้วของ ARGUS P3",
        paragraphs: [
          "[ARGUS P3](/products/argus-p3) เป็นพอตคิทที่ใช้จอทัชเต็มจอ TFT HD 2.01 นิ้ว คุมเมนูและสลับโหมดจากจอ แบตในตัว 1500mAh จ่ายไฟ 5–30 วัตต์",
          "หัวพอตที่ใช้ได้เป็นระบบหัวพอต ARGUS เติมด้านบน เว็บเรามี [หัวพอต VOOPOO Argus Pod](/products/coil-21) ให้เลือก แต่ VOOPOO แนะนำให้เช็คค่าโอห์มกับวัตต์ก่อนใช้ จะเลือกเครื่องเพราะจอ ก็ต้องดูบรรทัดหัวพอตประกอบด้วย วิธีอ่านอยู่ที่ [วิธีอ่านตารางสเปก](/guides/reading-a-spec-sheet)",
        ],
      },
    ],
    faq: [
      {
        question: "G4 Pro กับ G4 Pro KOKO ต่างกันยังไง",
        answer: "ตามสเปกที่ยืนยันแล้ว G4 Pro จอทัช 2.51 นิ้ว แบต 1800mAh ปรับช่องลมได้แบบไม่มีขั้น ส่วน KOKO จอทัช 2 นิ้ว แบต 2000mAh มีโหมด Storm / Waves / Custom และ Pro-FOCS 4.0 ทั้งคู่วัตต์สูงสุด 35 วัตต์ ใช้หัวพอต GPP และ G3 เหมือนกัน",
      },
      {
        question: "พอตจอทัชกินแบตมากกว่าไหม",
        answer: "จอกับระบบสัมผัสกินแบตมากกว่าเครื่องไม่มีจอ แต่จะอยู่ได้กี่ชั่วโมงขึ้นกับวัตต์ที่ตั้ง เปิดจอบ่อยแค่ไหน และสูบถี่แค่ไหน ใช้ mAh เทียบระหว่างรุ่นได้ แต่อย่าคิดเป็นชั่วโมง",
      },
    ],
  },
  "high-output-chip-platforms": {
    name: "ชิปในเครื่องวัตต์สูง",
    summary: "ชิปอย่าง GENE.TT และ GENE.AI คือตัวคุมว่าเครื่องปรับวัตต์ยังไง ป้องกันแบตยังไง และปรับตามโอห์มของคอยล์ที่ใส่ได้เอง",
    body: [
      {
        heading: "ชิปทำหน้าที่อะไรบ้าง",
        paragraphs: [
          "ชิป GENE.TT กับ GENE.AI ต่างกันยังไง ก่อนตอบ ต้องรู้ว่าชิปทำอะไร นอกจากตัวเลขวัตต์ที่เห็น ชิปยังคุมว่าวัตต์ขึ้นเร็วแค่ไหน ป้องกันแบตตอนใช้งานหนักยังไง และชิปรุ่นใหม่ ๆ ยังอ่านโอห์มของคอยล์แล้วปรับค่าให้เองอัตโนมัติ",
          "GENE.TT 3.0 ของ VOOPOO (ใช้ใน DRAG 6 ที่เป็นเครื่องวัตต์สูง) และ GENE.AI (ใช้ใน ARGUS G3 mini ที่เน้นผู้เริ่มต้น) อยู่คนละสุดขั้ว ตัวหนึ่งเน้นดันวัตต์ได้สูงและมีโหมดให้เลือกหลายแบบ อีกตัวเน้นความง่าย วัตต์คงที่และปรับให้เองอัตโนมัติ",
        ],
      },
      {
        heading: "ตัวอย่างจริง: โหมด SMART/RBA/TC-TCR บน GENE.TT 3.0 ของ DRAG 6",
        paragraphs: [
          "[DRAG 6](/products/drag-6) ใช้ชิป GENE.TT 3.0 ให้วัตต์สูงสุด 220 วัตต์ แบตในตัว 4400mAh แบ่งเป็นสองก้อน ก้อนละ 2200mAh และมีโหมด SMART RBA และ TC-TCR ให้เลือก",
          "โหมดเหล่านี้คือส่วนที่ทำให้ชิปตัวนี้อยู่คนละขั้วกับ GENE.AI ปรับวัตต์ได้ด้วยล้อหมุนบนตัวเครื่อง ปุ่มยิงมีเซ็นเซอร์แตะไว้ปลดล็อก และจอ TFT 1.66 นิ้ว แสดงวัตต์ แบต โอห์ม จำนวนพัฟ และโหมด",
          "แถวคอยล์ของ DRAG 6 ยืนยันจากหน้าของ VOOPOO เองแล้วว่า ถังน้ำยา UFORCE-X Tank II ที่มากับชุดใช้คอยล์ PnP X ได้ทุกตัว ส่วนแถวสเปกหนึ่งแถวยืนยันได้อย่างไร อ่านได้ที่ [วิธีอ่านตารางสเปก](/guides/reading-a-spec-sheet)",
        ],
      },
      {
        heading: "ตัวอย่างจริง: ปุ่มยิงหายไปเลย — ARGUS G3 mini กับ GENE.AI",
        paragraphs: [
          "[ARGUS G3 mini](/products/argus-g3-mini) ใช้ชิป GENE.AI เป็นระบบออโต้ (auto-draw) ไม่มีปุ่มยิง สูบแล้วเครื่องทำงานเอง วัตต์ปรับให้เองตามหัวพอตที่ใส่ สูงสุด 30 วัตต์ ไม่มีเมนูให้ตั้ง",
          "แบตในตัว 1350mAh ตัวเครื่อง 95.3 × 25.8 × 13.7 mm หนัก 41 กรัม หัวพอตในกล่องคือ ARGUS Top Fill Cartridge V2 0.7 โอห์ม มีระบบกันรั่ว iCOSM CODE 2.0",
          "ถ้าอยากเปลี่ยนค่าโอห์ม เว็บเรามี [หัวพอต VOOPOO Argus Pod](/products/coil-21) ให้เลือก โดย VOOPOO แนะนำให้เช็คค่าโอห์มกับวัตต์ก่อนใช้",
          "สองเครื่องนี้คือสองขั้วของงานที่ชิปทำ DRAG 6 ยกการตั้งค่าให้คุณคุมเอง ARGUS G3 mini ให้ชิปคุมแทน ถ้ายังไม่แน่ใจว่าอยากคุมวัตต์เองไหม อ่านที่ [เลือกวัตต์และช่องลม](/guides/choosing-wattage-and-airflow)",
        ],
      },
    ],
    faq: [
      {
        question: "DRAG 6 กับ G3 mini ต่างกันยังไง",
        answer: "DRAG 6 ชิป GENE.TT 3.0 สูงสุด 220 วัตต์ แบต 4400mAh มีโหมด SMART/RBA/TC-TCR ปรับวัตต์ด้วยวงล้อ ส่วน ARGUS G3 mini ชิป GENE.AI สูงสุด 30 วัตต์ แบต 1350mAh ไม่มีปุ่มยิง วัตต์ปรับให้เองตามหัวพอต",
      },
      {
        question: "GENE.AI คืออะไร",
        answer: "ชิปของ VOOPOO ที่ใช้ใน ARGUS G3 mini อ่านหัวพอตที่ใส่แล้วปรับวัตต์ให้เอง สูงสุด 30 วัตต์ ไม่ต้องตั้งค่าเอง ไม่มีปุ่มยิง สูบได้เลย",
      },
    ],
  },
  "gesture-and-triple-tap-control": {
    name: "การควบคุมด้วยท่าทางและระบบแตะสามครั้ง",
    summary: "เซ็นเซอร์แตะกำลังมาแทนปุ่มกดบนพอตตัวเล็ก",
    body: [
      {
        heading: "ปุ่มน้อยลง แต่ควบคุมได้เท่าเดิม",
        paragraphs: [
          "Smart Triple-Tap คืออะไร ระบบนี้ UWELL ใส่มาใน Caliburn G5 ใช้เซ็นเซอร์จับการแตะแทนแถวปุ่มกด แตะเพื่อสลับโหมดวัตต์ ตัวเครื่องเลยเรียบขึ้น ชิ้นส่วนที่ขยับแล้วสึกหรอหรือให้ความชื้นเข้าก็น้อยลง",
          "ข้อเสียคือต้องทำความคุ้นเคยนิดหน่อย ไม่เหมือนปุ่มที่มีป้ายบอกชัด ๆ การควบคุมด้วยท่าทางต้องมีจอบนเครื่องไว้ยืนยันว่าตอนนี้อยู่โหมดไหน ระบบนี้จึงมาคู่กับจอ ไม่ใส่มาในเครื่องที่ไม่มีจอเลย",
        ],
      },
      {
        heading: "ตัวอย่างจริง: สเปก Caliburn G5 ที่มาพร้อม Smart Triple-Tap",
        paragraphs: [
          "[Caliburn G5](/products/caliburn-g5) แบตในตัว 1600mAh จ่ายไฟ 5–35 วัตต์ จอสี 0.85 นิ้ว ชาร์จผ่าน USB-C หัวพอตเติมด้านบน ส่วนการควบคุมคือ Smart Triple-Tap Control สลับโหมดด้วยการแตะ",
          "จอสี 0.85 นิ้วคือส่วนที่ทำให้ระบบแตะใช้งานได้จริง แตะแล้วดูบนจอได้เลยว่าอยู่โหมดไหน วัตต์เท่าไหร่ แบตเหลือแค่ไหน",
          "ถ้ายังเลือกเครื่องไม่ถูก อ่านที่ [เลือกพอตเครื่องแรก](/guides/choosing-your-first-pod-system) บทนั้นใช้ G5 เป็นตัวอย่างหลัก",
        ],
        subsections: [
          {
            heading: "หัวพอตที่ใช้กับ Caliburn G5",
            paragraphs: [
              "ใช้หัวพอต GPP ของ UWELL มี 4 ค่าโอห์ม คือ 0.4 / 0.6 / 0.9 / 1.2 โอห์ม ตามหน้า G Pod Platform ของ UWELL เอง ในกล่องมีหัวพอต GPP มาให้แล้ว ส่วนจะใช้กับ Caliburn รุ่นไหนได้อีกและดูแลยังไง อยู่ที่ [วิธีดูแลคอยล์และหัวพอต](/guides/coil-and-pod-maintenance)",
            ],
          },
        ],
      },
    ],
    faq: [
      {
        question: "Smart Triple-Tap ใช้ยังไง",
        answer: "แตะตัวเครื่องสามครั้งติดกันเพื่อสลับโหมดวัตต์ ไม่มีแถวปุ่มกด โหมดที่เลือกจะขึ้นบนจอสี 0.85 นิ้ว ระบบนี้ใช้ใน Caliburn G5",
      },
    ],
  },
};

export const TECHNOLOGY_COPY_ZH: Record<string, TechnologyCopy> = {
  "mesh-coil-systems": {
    name: "网状雾化芯系统",
    summary: "扁平网状发热体正在取代传统圆形绕线雾化芯，成为目前大多数换弹式和一次性电子烟设备的标配。",
    body: [
      {
        heading: "为什么网状优于圆形绕线",
        paragraphs: [
          "网状雾化芯是什么，为什么现在的换弹设备大多用它？简单说：在相同占用空间下，网状雾化芯比传统圆形绕线雾化芯能接触更多导油棉，这正是它成为目前大多数换弹式、换弹主机和一次性设备默认发热元件的原因。",
          "这里的差别不在于极限性能，而在于稳定性——网状雾化芯的发热面更均匀，能减少局部过热导致的焦糊味。",
          "至于用了一段时间后才出现的焦味，是另一回事——那是导油棉已经耗损的信号，该换了。要看哪些迹象，见 [雾化芯与烟弹保养](/guides/coil-and-pod-maintenance)。",
        ],
      },
      {
        heading: "规格表证实的实例：M Bar 10K 的网状雾化芯",
        paragraphs: [
          "[M Bar 10K](/products/m-bar-10k) 规格表的雾化芯一行写的是「Cotton mesh coil」。一并验证的还有：最多 10,000 口、600mAh USB-C 可充电电池，以及 Eco / Soft / Boost 三种功率模式，双击切换。",
          "这是一次性设备，所以雾化芯不用更换——烟油用完，设备就用完了。想比较可以自己换雾化芯的那一边，见 [开放式换弹 vs. 一次性](/guides/open-system-vs-disposable)。",
        ],
      },
    ],
  },
  "multi-resistance-cartridges": {
    name: "多阻值烟弹平台",
    summary: "同一款烟弹外形，多种雾化芯阻值——了解 ARGUS 的顶部注油烟弹如何用同一个外形同时覆盖 MTL 和 RDL 吸法。",
    body: [
      {
        heading: "同一外形，多种阻值",
        paragraphs: [
          "多阻值烟弹平台是什么意思？现在不少平台——例如 VOOPOO ARGUS 系列的顶部注油烟弹——不再为每种吸法各自设计一款烟弹外形，而是保持同一个外壳，只改变内置雾化芯的阻值。",
          "这意味着从偏紧的 MTL 吸法切换到偏松的 RDL 吸法，只需换上不同阻值的烟弹，而不必更换设备。",
          "这一点对阻值范围较宽的设备（例如 [ARGUS G4](/products/argus-g4) 的 0.4–3.0 欧姆）尤其重要，说明该平台本身就设计为支持多种吸法，而不需要另外购买一台全新设备。",
          "ARGUS G4 的烟弹平台一行写的是：ARGUS 顶部注油烟弹平台，多种阻值。但阻值范围宽只是答案的一半，另一半是这种烟弹到底买不买得到——这一点在 [如何解读规格表](/guides/reading-a-spec-sheet) 里展开。",
        ],
      },
      {
        heading: "实例：ARGUS G3 mini 盒内只附一种阻值的烟弹（0.7 欧姆）",
        paragraphs: [
          "[ARGUS G3 mini](/products/argus-g3-mini) 是一台 auto-draw 换弹主机，没有点火键。规格表写明功率会按所装烟弹自动调节，最高 30W——也就是说平台支持不止一种阻值。",
          "但盒内只有一种：ARGUS Top Fill Cartridge V2，0.7 欧姆、3mL，配 iCOSM CODE 2.0 防漏系统，电池 1350mAh。",
          "按 VOOPOO 的说明，G3 mini 适用 ARGUS Top Fill 烟弹，阻值范围为 0.4、0.7 和 1.0 欧姆。本店的 [VOOPOO Argus Pod 烟弹](/products/coil-21) 有 Top Fill 0.4 欧姆（比盒内的更低）和 0.7 欧姆（与盒内相同）两个选项；其中的 1.2 欧姆选项是侧注式烟弹，不在 G3 mini 的范围内。",
          "上面提到的 MTL 和 RDL 吸法感受有何不同，见 [MTL 与 DTL](/guides/understanding-mtl-vs-dtl)。",
        ],
      },
    ],
    faq: [
      { question: "ARGUS G3 mini 能换其他阻值的烟弹吗？", answer: "可以，限 ARGUS Top Fill 烟弹：VOOPOO 标注的阻值范围是 0.4、0.7 和 1.0 欧姆。盒内只附 0.7 欧姆一种；本店的 VOOPOO Argus Pod 烟弹有 0.4 欧姆的 Top Fill 选项。" },
      { question: "多阻值烟弹是什么？", answer: "同一外形的烟弹，装在同一台设备上，但内置雾化芯有多种阻值可选。想换吸法只需换烟弹，设备照用。" },
    ],
  },
  "onboard-touch-displays": {
    name: "机身触控屏",
    summary: "全触控屏操作正从大功率盒子设备逐步下放到小巧的换弹式设备上。",
    body: [
      {
        heading: "从电量显示到完整菜单",
        paragraphs: [
          "触控屏换弹设备和普通带屏的有什么不同？早期换弹设备的屏幕大多只显示电量。如今配备触控屏的设备——例如 Caliburn G4 Pro 的 2.51 英寸触控屏，或 ARGUS P3 的 2.01 英寸全触控屏——已经能够进行完整的菜单操作，无需实体按键即可切换模式、调整功率。",
          "增加屏幕与触控元件的代价是电池续航效率和机身简洁度有所下降，这也是为什么同系列中更简化的型号（例如 Caliburn G4 Mini）常常直接取消屏幕，换来更小、更便携的机身。",
          "所以屏幕和电池是要一起看的两行。mAh 数字可用于机型之间比较，但不等于小时数。充电与电池保养见 [电池保养](/guides/battery-care-and-charging)。",
        ],
      },
      {
        heading: "实例：Caliburn G4 Pro 的 2.51 英寸屏对比 G4 Pro KOKO 的 2 英寸屏",
        paragraphs: [
          "[Caliburn G4 Pro](/products/caliburn-g4-pro)：2.51 英寸触控屏、1800mAh 内置电池、最高 35W、无级气流调节，使用 UWELL GPP 烟弹和上一代 G3 烟弹。",
          "[Caliburn G4 Pro KOKO](/products/caliburn-g4-pro-koko)：2 英寸触控屏、2000mAh 内置电池、最高 35W，在屏幕上选择 Storm / Waves / Custom（吸阻模式），配 Pro-FOCS 4.0 口感调校，烟弹同样是 GPP 和上一代 G3。",
          "只按已验证规格比较：屏幕更大的是 G4 Pro（2.51 英寸），电池更大的是 KOKO（2000mAh），最高功率相同，烟弹也是同一套。Storm / Waves / Custom 模式的说明见 [MTL 与 DTL](/guides/understanding-mtl-vs-dtl)。",
        ],
      },
      {
        heading: "实例：ARGUS P3 的 2.01 英寸全触控屏",
        paragraphs: [
          "[ARGUS P3](/products/argus-p3) 是一台换弹主机，用 2.01 英寸全触控 TFT HD 屏幕操作菜单和切换模式，1500mAh 内置电池，5–30W 输出。",
          "它的烟弹平台是 ARGUS 顶部注油烟弹。本店有售 [VOOPOO Argus Pod 烟弹](/products/coil-21)，VOOPOO 提醒使用前先对照 P3 核对阻值和功率。按屏幕选设备之前，请把烟弹那一行一起看，读法见 [如何解读规格表](/guides/reading-a-spec-sheet)。",
        ],
      },
    ],
    faq: [
      { question: "G4 Pro 和 G4 Pro KOKO 有什么不同？", answer: "按已验证规格：G4 Pro 是 2.51 英寸触控屏、1800mAh 电池、无级气流调节；KOKO 是 2 英寸触控屏、2000mAh 电池，有 Storm / Waves / Custom 模式和 Pro-FOCS 4.0。两者最高都是 35W，都用 GPP 和 G3 烟弹。" },
      { question: "带触控屏的设备更耗电吗？", answer: "屏幕和触控元件比无屏设备多耗一些电，但能用多少小时取决于设定功率、屏幕使用和抽吸频率。mAh 用来在机型之间比较，不要当作小时数。" },
    ],
  },
  "high-output-chip-platforms": {
    name: "高功率芯片平台",
    summary: "GENE.TT、GENE.AI 等专用芯片决定了设备如何调节输出功率、保护电池，并适配不同的雾化芯阻值。",
    body: [
      {
        heading: "芯片究竟在做什么",
        paragraphs: [
          "GENE.TT 和 GENE.AI 有什么不同？先要知道芯片在做什么。除了看得见的功率数字之外，设备芯片还决定了功率提升的速度、大负载下的电池保护方式；在较新的芯片上，还能自动识别并适配所装雾化芯的阻值，而无需手动设置。",
          "VOOPOO 的 GENE.TT 3.0（用于高功率的 DRAG 6）与 GENE.AI（用于面向新手的 ARGUS G3 mini）正好处于这一光谱的两端——前者追求更高的功率上限并提供多种输出模式，后者则追求自动、固定功率的简单易用。",
        ],
      },
      {
        heading: "实例：DRAG 6 上 GENE.TT 3.0 的 SMART、RBA、TC-TCR 模式",
        paragraphs: [
          "[DRAG 6](/products/drag-6) 搭载 GENE.TT 3.0 芯片：最高 220W，4400mAh 内置电池（两颗 2200mAh 电芯），提供 SMART、RBA、TC-TCR 三种模式可选。",
          "正是这些模式，让这颗芯片与 GENE.AI 处于两端。功率用机身上的调节滚轮设定，点火键带电容感应解锁；1.66 英寸 TFT 屏显示功率、电量、阻值、口数和模式。",
          "DRAG 6 的雾化芯一行已通过 VOOPOO 官方页面验证：套装里的 UFORCE-X Tank II 可使用所有 PnP X 雾化芯。一行规格如何得到验证，见 [如何解读规格表](/guides/reading-a-spec-sheet)。",
        ],
      },
      {
        heading: "实例：点火键干脆消失——ARGUS G3 mini 与 GENE.AI",
        paragraphs: [
          "[ARGUS G3 mini](/products/argus-g3-mini) 搭载 GENE.AI 芯片，是 auto-draw 设计：没有点火键，吸气即启动，功率按所装烟弹自动调节，最高 30W，没有菜单需要设置。",
          "1350mAh 内置电池，机身 95.3 × 25.8 × 13.7 mm、重 41 g。盒内烟弹为 ARGUS Top Fill Cartridge V2，0.7 欧姆，配 iCOSM CODE 2.0 防漏系统。",
          "想换阻值的话，本店有售 [VOOPOO Argus Pod 烟弹](/products/coil-21)；VOOPOO 提醒使用前先核对阻值和功率。",
          "这两台设备是芯片能力的两端：DRAG 6 把设定交给你，ARGUS G3 mini 让芯片替你决定。还不确定自己想不想亲自调功率，见 [如何选择功率与进气量](/guides/choosing-wattage-and-airflow)。",
        ],
      },
    ],
    faq: [
      { question: "DRAG 6 和 ARGUS G3 mini 有什么不同？", answer: "DRAG 6：GENE.TT 3.0 芯片、最高 220W、4400mAh 电池、SMART/RBA/TC-TCR 模式、滚轮调功率。ARGUS G3 mini：GENE.AI 芯片、最高 30W、1350mAh 电池、没有点火键、功率按烟弹自动调节。" },
      { question: "GENE.AI 是什么？", answer: "VOOPOO 用于 ARGUS G3 mini 的芯片：识别所装烟弹并自动设定功率，最高 30W，无需手动设置；没有点火键，吸气即启动。" },
    ],
  },
  "gesture-and-triple-tap-control": {
    name: "手势与三击操控",
    summary: "基于点击手势的传感器正在取代小巧换弹设备上的一排实体按键。",
    body: [
      {
        heading: "按键更少，操控不减",
        paragraphs: [
          "Smart Triple-Tap 是什么？UWELL 在 Caliburn G5 上采用的 Smart Triple-Tap（智能三击）控制，用点击手势传感器取代了一排实体按键来切换输出模式，这让机身设计更简洁，也减少了容易磨损或进水的活动部件。",
          "代价是相比标有明确文字的按键，手势操控需要一点学习成本——手势操作需要依赖机身屏幕来确认当前所处的模式，这也是为什么该功能通常会与屏幕搭配出现，而不会出现在完全无屏的设备上。",
        ],
      },
      {
        heading: "实例：配备 Smart Triple-Tap 的 Caliburn G5 实际数据",
        paragraphs: [
          "[Caliburn G5](/products/caliburn-g5)：1600mAh 内置电池、5–35W 输出、0.85 英寸彩屏、USB-C 充电，烟弹顶部注油；操控方式是 Smart Triple-Tap Control，以点击切换模式。",
          "0.85 英寸彩屏正是让点击操控真正可用的部分：点击之后，当前模式、功率和剩余电量直接显示在屏幕上。",
          "还没选好设备？G5 是 [选择你的第一款设备](/guides/choosing-your-first-pod-system) 里的主要例子。",
        ],
        subsections: [
          {
            heading: "Caliburn G5 使用哪种烟弹",
            paragraphs: [
              "使用 UWELL 的 GPP 烟弹，有 0.4 / 0.6 / 0.9 / 1.2 欧姆四种阻值，数据来自 UWELL 自己的 G Pod Platform 页面；盒内已附 GPP 烟弹。它还适用于哪些 Caliburn 机型、如何保养，见 [雾化芯与烟弹保养](/guides/coil-and-pod-maintenance)。",
            ],
          },
        ],
      },
    ],
    faq: [
      { question: "Smart Triple-Tap 怎么用？", answer: "在机身上连续点击三次即可切换功率模式，没有一排实体按键；所选结果显示在 0.85 英寸彩屏上。用于 Caliburn G5。" },
    ],
  },
};
