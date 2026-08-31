/**
 * OKami24 — Phase 3.2.2: Thai translations of legacy product tagline/shortDescription.
 *
 * Presentation-layer only, keyed by `Product.slug` — src/data/products/*.ts stays the canonical
 * English source (untouched). Shown ADDITIONALLY under the English text on the product detail
 * page when locale is Thai (never replacing it) — see ProductHero.tsx. Model/brand/technical
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
}

export const PRODUCT_COPY_TH: Record<string, ProductCopyTh> = {
  "caliburn-g5": {
    tagline: "ระบบ Smart Triple-Tap Control ปรับแต่งเพื่อทุกจังหวะการสูบ",
    shortDescription:
      "รุ่นเรือธงล่าสุดของตระกูล Caliburn: พอดระบบเปิดแบตเตอรี่ 1600mAh พร้อมจอสี 0.85 นิ้ว และระบบสั่งงานด้วยการแตะสามครั้งสำหรับสลับโหมดโดยไม่ต้องใช้ปุ่ม",
  },
  "caliburn-g5-lite": {
    tagline: "แพลตฟอร์ม G5 ที่ปรับให้เรียบง่ายลง เหมาะกับการใช้งานประจำวันระยะยาว",
    shortDescription:
      "รุ่นที่ตัดทอนความซับซ้อนลงจาก G5 ยังคงแบตเตอรี่ 1600mAh และกำลังไฟสูงสุด 35W เดิม แต่ปรับระบบควบคุมให้เรียบง่ายขึ้นในราคาที่ย่อมเยากว่า",
  },
  "caliburn-g5-lite-se": {
    tagline: "ฟินิชรุ่นพิเศษบนแพลตฟอร์ม G5 Lite",
    shortDescription: "ใช้แบตเตอรี่ 1600mAh และกำลังไฟสูงสุด 35W เดียวกับ G5 Lite มาในชุดสี/ฟินิชรุ่นพิเศษ",
  },
  "caliburn-g4-pro-koko": {
    tagline: "จอทัชสกรีนรุ่นแรกในสาย KOKO",
    shortDescription:
      "พอดแบตเตอรี่ 2000mAh กำลังไฟ 35W พร้อมจอทัชสกรีนสมาร์ท 2 นิ้ว และระบบปรับรสชาติ Pro-FOCS 4.0 สลับโหมดการสูบได้ระหว่าง Storm, Waves และ Custom",
  },
  "caliburn-g4-pro": {
    tagline: "จอทัชสกรีนกันกระแทก 2.51 นิ้ว บนแพลตฟอร์ม G4",
    shortDescription:
      "พอดแบตเตอรี่ 1800mAh กำลังไฟ 35W พร้อมจอทัชสกรีนกันกระแทกขนาดใหญ่ ระบบเชื่อมต่อพอดแบบแม่เหล็ก และปรับช่องลมได้แบบไม่มีขั้น",
  },
  "caliburn-g4": {
    tagline: "จอสีพร้อมปุ่มกดยิงไอ บนตัวเครื่อง G4 มาตรฐาน",
    shortDescription:
      "G4 รุ่นมาตรฐาน: เครื่องแบตเตอรี่ 1300mAh พร้อมจอสี เลือกโหมดกำลังไฟได้ และยิงไอด้วยปุ่มกด — จุดกึ่งกลางระหว่างรุ่น Mini ที่ไม่มีจอ กับรุ่น Pro ที่เป็นทัชสกรีน",
  },
  "caliburn-g4-mini": {
    tagline: "G4 เวอร์ชันย่อส่วน พกพาง่าย",
    shortDescription:
      "เวอร์ชันเล็กลง เบาลง และไม่มีจอของ G4 เน้นความพกพาสะดวกล้วนๆ ใช้พอด GPP ร่วมกันได้เหมือนเดิม แต่แบตเตอรี่เล็กลงเหลือ 1100mAh",
  },
  "caliburn-g4-classic": {
    tagline: "ฟินิชรุ่นคลาสสิกบนฮาร์ดแวร์ G4 มาตรฐาน",
    shortDescription:
      "วางตำแหน่งเป็นรุ่นฟินิช/เอดิชันของ G4 มาตรฐาน โดยฮาร์ดแวร์หลักถือว่าเทียบเท่า G4 จนกว่าจะมีการยืนยันความแตกต่างของสเปกโดยอิสระ",
  },
  "caliburn-g3-pro": {
    tagline: "จอแบบ full-wraparound รุ่นแรกในตระกูล Caliburn",
    shortDescription:
      "พอดแบตเตอรี่ 1000mAh กำลังไฟสูงสุด 35W พร้อมจอ LCD ที่โอบรอบด้านข้างตัวเครื่อง ปรับช่องลมได้เต็มรูปแบบ และมาพร้อมพอดสองความต้านทานในกล่อง",
  },
  "caliburn-g3-pro-koko": {
    tagline: "ฟินิชรุ่น KOKO บนแพลตฟอร์ม G3 Pro",
    shortDescription:
      "วางตำแหน่งเป็นเอดิชัน KOKO ของ G3 Pro โดยฮาร์ดแวร์หลักถือว่าเทียบเท่า G3 Pro จนกว่าจะมีการยืนยันความแตกต่างของสเปกโดยอิสระ",
  },
  "argus-g4": {
    tagline: "พอดคิทแบตอึดใช้ได้ 5 วัน พร้อมจอสถานะ HD เต็มรูปแบบ",
    shortDescription:
      "รุ่นเรือธงสายหลักของ ARGUS ในปัจจุบัน: แบตเตอรี่ 1650mAh กำลังไฟ 5–35W จอ HD ขนาด 0.85 นิ้วแสดงระดับแบต กำลังไฟ ค่าความต้านทาน สถานะล็อก และจำนวนคำ พร้อมชาร์จเร็วผ่าน Type-C เต็มใน 45 นาที",
  },
  "argus-g4-mini": {
    tagline: "แบตเตอรี่เท่า G4 กำลังไฟลดลง ตัวเครื่องเล็กลง",
    shortDescription: "ใช้แบตเตอรี่ 1650mAh เดียวกับ ARGUS G4 แต่ในตัวเครื่องที่เล็กลง และปรับกำลังไฟสูงสุดลงเหลือ 30W จากเดิม 35W",
  },
  "argus-p3": {
    tagline: "จอทัช HD เต็มรูปแบบขนาด 2.01 นิ้ว บนแพลตฟอร์ม ARGUS",
    shortDescription: "พอดคิทแบตเตอรี่ 1500mAh กำลังไฟ 5–30W ออกแบบรอบจอทัช TFT HD ขนาด 2.01 นิ้วสำหรับควบคุมเมนูและโหมดการใช้งาน",
  },
  "argus-g3-mini": {
    tagline: "ความเรียบง่ายที่ขับเคลื่อนด้วย GENE.AI ปรับกำลังไฟอัตโนมัติ",
    shortDescription:
      "พอดคิทเหมาะมือใหม่ แบตเตอรี่ 1350mAh กำลังไฟสูงสุด 30W ปรับกำลังไฟอัตโนมัติตามพอดที่ใส่ ทำงานด้วยชิป GENE.AI ของ VOOPOO และพอดกันรั่ว iCOSM CODE 2.0",
  },
  "drag-6": {
    tagline: "220W, GENE.TT 3.0 พร้อมล้อปรับกำลังไฟแบบละเอียด",
    shortDescription:
      "รุ่นเรือธงล่าสุดของสาย DRAG: แบตเตอรี่ในตัว 4400mAh (เซลล์ 2200mAh สองก้อน) กำลังไฟสูงสุด 220W จอ TFT ขนาด 1.66 นิ้ว และปุ่มยิงไอแบบปลดล็อกด้วยการสัมผัส",
  },
  "drag-s3": {
    tagline: "แบตเตอรี่ในตัว 3000mAh กำลังไฟสูงสุด 60W",
    shortDescription: "DRAG รุ่นแบตเตอรี่ในตัว: 3000mAh กำลังไฟ 5–60W จอ TFT ขนาด 0.96 นิ้ว และชาร์จเร็วผ่าน Type-C",
  },
  "drag-x3": {
    tagline: "กำลังไฟ 80W บนเซลล์แบตถอดเปลี่ยนได้ 18650/21700",
    shortDescription: "DRAG รุ่นใช้แบตเตอรี่ภายนอกก้อนเดียว (18650 หรือ 21700 ไม่รวมในกล่อง) กำลังไฟสูงสุด 80W พร้อมจอทัชสกรีน 1.66 นิ้ว",
  },
  "vinci-s": {
    tagline: "40W เติมน้ำยาด้านบน ออกแบบมาเพื่อคนตามหารสชาติ",
    shortDescription: "พอดคิทแบตเตอรี่ 2000mAh กำลังไฟ 5–40W คาร์ทริดจ์เติมด้านบนความจุ 4.5mL (2mL ตามมาตรฐาน TPD) ช่วงความต้านทาน 0.3–3.0Ω",
  },
  "vmate-i3": {
    tagline: "พอดคิทน้ำหนักเบาพิเศษ ยาวเพียง 103mm",
    shortDescription: "พอดคิทที่เบาที่สุดในกลุ่มของ VOOPOO ขณะนี้: เครื่องอะลูมิเนียมอัลลอยบางเฉียบ แบตเตอรี่ 1500mAh กำลังไฟ 5–30W คาร์ทริดจ์เติมด้านบน 3mL",
  },
  "m-bar-10k": {
    tagline: "3 โหมดกำลังไฟ วงแหวน RGB แสดงสถานะ รองรับ 10,000 คำ",
    shortDescription: "ดิสโพสชาร์จซ้ำได้ รองรับสูงสุด 10,000 คำ ใช้คอยล์คอตตอนเมช มี 3 โหมดกำลังไฟให้สลับ พร้อมไฟ RGB แสดงโหมดที่ใช้งานอยู่",
  },
  "m-bar-9k": {
    tagline: "ปรับช่องลมได้ตั้งแต่ MTL ถึง DTL รองรับ 9,000 คำ",
    shortDescription: "ดิสโพสชาร์จซ้ำได้ บรรจุน้ำยาสำเร็จ 14mL ปรับช่องลมได้ตั้งแต่แบบ MTL แน่นๆ ไปจนถึง DTL โปร่งๆ ใช้คอยล์เมชรองรับสูงสุด 9,000 คำ",
  },
  "m-bar-15k": {
    tagline: "จำนวนคำที่ระบุสูงที่สุดในตระกูล M Bar",
    shortDescription:
      "M Bar รุ่นใหม่ล่าสุดและความจุสูงสุด รองรับสูงสุด 15,000 คำ ด้วยคอยล์คอตตอนเมช ชาร์จเร็วผ่าน Type-C ส่วนความจุแบตเตอรี่และน้ำยายังไม่มีการยืนยันโดยอิสระ",
  },
  "m-switch-kit": {
    tagline: "ตัวเครื่องใช้ซ้ำได้ คาร์ทริดจ์บรรจุสำเร็จ ไม่ต้องเติมเอง",
    shortDescription:
      "ตัวเครื่องใช้ซ้ำได้ จับคู่กับคาร์ทริดจ์ M Switch Pod บรรจุสำเร็จ รองรับสูงสุด 15,000 คำต่อพอด — เก็บตัวเครื่องไว้ชาร์จใช้ต่อ แล้วเปลี่ยนเฉพาะคาร์ทริดจ์แทนการเติมน้ำยาเอง",
  },
  "m-switch-pod": {
    tagline: "คาร์ทริดจ์บรรจุสำเร็จสำหรับ M Switch Kit",
    shortDescription: "คาร์ทริดจ์ทดแทนบรรจุน้ำยาสำเร็จ 2.2mL สำหรับตัวเครื่อง M Switch Kit",
  },
  "m-bar-pod": {
    tagline: "15+ รสชาติ ใช้คาร์ทริดจ์ตระกูลเดียวกัน",
    shortDescription: "สายพอดทดแทนที่ใช้ร่วมกันได้กับอุปกรณ์ใช้ซ้ำที่รองรับ M Bar ของ SALTHUB มีให้เลือกกว่า 15 รสชาติ",
  },
  "zero-pro": {
    tagline: "3 โหมด ในตัวเครื่องระบบสวิตช์ใช้ซ้ำได้",
    shortDescription: "อุปกรณ์ระบบสวิตช์ใช้ซ้ำได้ 3 โหมด รองรับสูงสุด 5,000 คำต่อ Zero Cartridge หนึ่งอัน",
  },
  "zero-nano": {
    tagline: "เครื่องที่เล็กที่สุดในแพลตฟอร์ม Zero",
    shortDescription: "อุปกรณ์ใช้ซ้ำได้ขนาดกะทัดรัดพิเศษ แบตเตอรี่ 500mAh ใช้ระบบคาร์ทริดจ์ Zero เดียวกัน",
  },
  "zero-cartridge": {
    tagline: "คาร์ทริดจ์เปลี่ยนได้ ใช้ร่วมกับ Zero Pro และ Zero Nano",
    shortDescription: "คาร์ทริดจ์เปลี่ยนได้ความจุ 2.2mL ใช้ร่วมกันได้ทั้งกับตัวเครื่อง Zero Pro และ Zero Nano",
  },
};
