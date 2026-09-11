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
      "รุ่นเรือธงล่าสุดของตระกูล Caliburn: พอตซิสเต็มแบตเตอรี่ 1600mAh พร้อมจอสี 0.85 นิ้ว และระบบสั่งงานด้วยการแตะสามครั้งสำหรับสลับโหมดโดยไม่ต้องใช้ปุ่ม",
  },
  "caliburn-g5-lite": {
    tagline: "แพลตฟอร์ม G5 ที่ปรับให้เรียบง่ายลง เหมาะกับการใช้งานประจำวันระยะยาว",
    shortDescription:
      "รุ่นที่ตัดทอนความซับซ้อนลงจาก G5 ยังคงแบตเตอรี่ 1600mAh และสูงสุด 35 วัตต์เท่าเดิม แต่ปรับระบบควบคุมให้เรียบง่ายขึ้นในราคาที่ย่อมเยากว่า",
  },
  "caliburn-g5-lite-se": {
    tagline: "G5 Lite ตัวเครื่องเดิม ในชุดสีรุ่นพิเศษ",
    shortDescription: "ใช้แบตเตอรี่ 1600mAh และสูงสุด 35 วัตต์เท่ากับ G5 Lite ต่างกันที่ชุดสีรุ่นพิเศษ",
  },
  "caliburn-g4-pro-koko": {
    tagline: "จอทัชสกรีนรุ่นแรกในสาย KOKO",
    shortDescription:
      "พอตแบตเตอรี่ 2000mAh 35 วัตต์ พร้อมจอทัชสกรีนสมาร์ท 2 นิ้ว และระบบปรับรสชาติ Pro-FOCS 4.0 สลับโหมดการสูบได้ระหว่าง Storm, Waves และ Custom",
  },
  "caliburn-g4-pro": {
    tagline: "จอทัชสกรีนกันกระแทก 2.51 นิ้ว บนแพลตฟอร์ม G4",
    shortDescription:
      "พอตแบตเตอรี่ 1800mAh 35 วัตต์ พร้อมจอทัชสกรีนกันกระแทกขนาดใหญ่ ระบบเชื่อมต่อพอตแบบแม่เหล็ก และปรับช่องลมได้แบบไม่มีขั้น",
  },
  "caliburn-g4": {
    tagline: "จอสีพร้อมปุ่มกดยิงไอ บนตัวเครื่อง G4 มาตรฐาน",
    shortDescription:
      "G4 รุ่นมาตรฐาน: เครื่องแบตเตอรี่ 1300mAh พร้อมจอสี เลือกโหมดวัตต์ได้ และยิงไอด้วยปุ่มกด — จุดกึ่งกลางระหว่างรุ่น Mini ที่ไม่มีจอ กับรุ่น Pro ที่เป็นทัชสกรีน",
  },
  "caliburn-g4-mini": {
    tagline: "G4 เวอร์ชันย่อส่วน พกพาง่าย",
    shortDescription:
      "G4 รุ่นเล็ก เบากว่า ไม่มีจอ เน้นพกง่าย ใช้หัวพอต GPP ตัวเดียวกับ G4 แบตเตอรี่เล็กลงเป็น 1100mAh",
  },
  "caliburn-g4-classic": {
    tagline: "G4 ตัวเครื่องเดิม ในชุดสีรุ่น Classic",
    shortDescription:
      "Caliburn G4 รุ่น Classic ตัวเครื่องเดียวกับ G4 รุ่นมาตรฐาน มี 4 สี ใช้หัวพอต GPP เหมือนกัน",
  },
  "caliburn-g3-pro": {
    tagline: "จอแบบ full-wraparound รุ่นแรกในตระกูล Caliburn",
    shortDescription:
      "พอตแบตเตอรี่ 1000mAh สูงสุด 35 วัตต์ พร้อมจอ LCD ที่โอบรอบด้านข้างตัวเครื่อง ปรับช่องลมได้เต็มรูปแบบ และในกล่องมีพอตให้ 2 ตัว คนละโอห์ม",
  },
  "caliburn-g3-pro-koko": {
    tagline: "G3 Pro ตัวเครื่องเดิม ในชุดสีรุ่น KOKO",
    shortDescription:
      "Caliburn G3 Pro รุ่น KOKO ตัวเครื่องเดียวกับ G3 Pro รุ่นมาตรฐาน มี 8 สี ใช้หัวพอต Caliburn G3 เหมือนกัน",
  },
  "argus-g4": {
    tagline: "พอตคิทแบตอึดใช้ได้ 5 วัน พร้อมจอสถานะ HD เต็มรูปแบบ",
    shortDescription:
      "รุ่นเรือธงสายหลักของ ARGUS: แบตเตอรี่ 1650mAh 5–35 วัตต์ จอ HD 0.85 นิ้วแสดงระดับแบต วัตต์ โอห์ม สถานะล็อก และจำนวนพัฟ ชาร์จเร็วผ่าน Type-C เต็มใน 45 นาที",
  },
  "argus-g4-mini": {
    tagline: "แบตเตอรี่เท่า G4 วัตต์ลดลง ตัวเครื่องเล็กลง",
    shortDescription: "ใช้แบตเตอรี่ 1650mAh เดียวกับ ARGUS G4 แต่ในตัวเครื่องที่เล็กลง และปรับวัตต์สูงสุดลงเหลือ 30 วัตต์ จากเดิม 35 วัตต์",
  },
  "argus-p3": {
    tagline: "จอทัช HD เต็มรูปแบบขนาด 2.01 นิ้ว บนแพลตฟอร์ม ARGUS",
    shortDescription: "พอตคิทแบตเตอรี่ 1500mAh 5–30 วัตต์ จอทัช TFT HD 2.01 นิ้ว กดเลือกเมนูและโหมดบนจอได้เลย",
  },
  "argus-g3-mini": {
    tagline: "ไม่มีปุ่ม ไม่ต้องตั้งค่า ชิป GENE.AI ปรับวัตต์ให้เองตามหัวพอต",
    shortDescription:
      "พอตคิทเหมาะมือใหม่ แบตเตอรี่ 1350mAh สูงสุด 30 วัตต์ ปรับวัตต์อัตโนมัติตามพอตที่ใส่ ทำงานด้วยชิป GENE.AI ของ VOOPOO และพอตกันรั่ว iCOSM CODE 2.0",
  },
  "drag-6": {
    tagline: "220 วัตต์, GENE.TT 3.0 พร้อมล้อปรับวัตต์แบบละเอียด",
    shortDescription:
      "รุ่นเรือธงล่าสุดของสาย DRAG: แบตเตอรี่ในตัว 4400mAh (เซลล์ 2200mAh สองก้อน) สูงสุด 220 วัตต์ จอ TFT ขนาด 1.66 นิ้ว และปุ่มยิงไอแบบปลดล็อกด้วยการสัมผัส",
  },
  "drag-s3": {
    tagline: "แบตเตอรี่ในตัว 3000mAh สูงสุด 60 วัตต์",
    shortDescription: "DRAG รุ่นแบตเตอรี่ในตัว: 3000mAh 5–60 วัตต์ จอ TFT ขนาด 0.96 นิ้ว และชาร์จเร็วผ่าน Type-C",
  },
  "drag-x3": {
    tagline: "80 วัตต์ บนเซลล์แบตถอดเปลี่ยนได้ 18650/21700",
    shortDescription: "DRAG รุ่นใช้แบตเตอรี่ภายนอกก้อนเดียว (18650 หรือ 21700 ไม่รวมในกล่อง) สูงสุด 80 วัตต์ พร้อมจอทัชสกรีน 1.66 นิ้ว",
  },
  "vinci-s": {
    tagline: "40 วัตต์ เติมน้ำยาด้านบนได้โดยไม่ต้องถอดหัวพอต",
    shortDescription: "พอตคิทแบตเตอรี่ 2000mAh 5–40 วัตต์ หัวพอตเติมด้านบนความจุ 4.5mL (2mL ตามมาตรฐาน TPD) ช่วง 0.3–3.0 โอห์ม",
  },
  "vmate-i3": {
    tagline: "พอตคิทน้ำหนักเบาพิเศษ ยาวเพียง 103mm",
    shortDescription: "พอตคิทที่เบาที่สุดในกลุ่มของ VOOPOO ขณะนี้: เครื่องอะลูมิเนียมอัลลอยบางเฉียบ แบตเตอรี่ 1500mAh 5–30 วัตต์ หัวพอตเติมด้านบน 3mL",
  },
  "m-bar-10k": {
    tagline: "3 โหมดวัตต์ วงแหวน RGB แสดงสถานะ รองรับ 10,000 พัฟ",
    shortDescription: "พอตใช้แล้วทิ้งชาร์จซ้ำได้ รองรับสูงสุด 10,000 พัฟ ใช้คอยล์ cotton mesh มี 3 โหมดวัตต์ให้สลับ พร้อมไฟ RGB แสดงโหมดที่ใช้งานอยู่",
  },
  "m-bar-9k": {
    tagline: "ปรับช่องลมได้ตั้งแต่ MTL ถึง DTL รองรับ 9,000 พัฟ",
    shortDescription: "พอตใช้แล้วทิ้งชาร์จซ้ำได้ บรรจุน้ำยาสำเร็จ 14mL ปรับช่องลมได้ตั้งแต่แบบ MTL แน่น ๆ ไปจนถึง DTL โปร่ง ๆ ใช้คอยล์ mesh รองรับสูงสุด 9,000 พัฟ",
  },
  "m-bar-15k": {
    tagline: "จำนวนพัฟที่ระบุสูงที่สุดในตระกูล M Bar",
    shortDescription:
      "พอตใช้แล้วทิ้งชาร์จซ้ำได้ รองรับสูงสุด 15,000 พัฟ คอยล์ cotton mesh ชาร์จเร็วผ่าน Type-C มี 15 รส",
  },
  "m-switch-kit": {
    tagline: "ตัวเครื่องใช้ซ้ำได้ หัวพอตบรรจุสำเร็จ ไม่ต้องเติมเอง",
    shortDescription:
      "ตัวเครื่องใช้ซ้ำได้ จับคู่กับหัวพอต M Switch Pod บรรจุสำเร็จ รองรับสูงสุด 15,000 พัฟต่อพอต เก็บตัวเครื่องไว้ชาร์จใช้ต่อ แล้วเปลี่ยนแค่หัวพอต ไม่ต้องเติมน้ำยา",
  },
  "m-switch-pod": {
    tagline: "หัวพอตบรรจุสำเร็จสำหรับ M Switch Kit",
    shortDescription: "หัวพอตสำหรับเปลี่ยน บรรจุน้ำยาสำเร็จ 2.2mL ใช้กับตัวเครื่อง M Switch Kit",
  },
  "m-bar-pod": {
    tagline: "15+ รสชาติ ใช้หัวพอตตระกูลเดียวกัน",
    shortDescription: "หัวพอตสำหรับเปลี่ยน ใช้ได้กับเครื่องใช้ซ้ำของ SALTHUB ที่รองรับ M Bar มีให้เลือกกว่า 15 รส",
  },
  "zero-pro": {
    tagline: "3 โหมด ในตัวเครื่องระบบสวิตช์ใช้ซ้ำได้",
    shortDescription: "อุปกรณ์ระบบสวิตช์ใช้ซ้ำได้ 3 โหมด รองรับสูงสุด 5,000 พัฟต่อ Zero Cartridge หนึ่งอัน",
  },
  "zero-nano": {
    tagline: "เครื่องที่เล็กที่สุดในแพลตฟอร์ม Zero",
    shortDescription: "อุปกรณ์ใช้ซ้ำได้ขนาดกะทัดรัดพิเศษ แบตเตอรี่ 500mAh ใช้ระบบหัวพอต Zero เดียวกัน",
  },
  "zero-cartridge": {
    tagline: "หัวพอตเปลี่ยนได้ ใช้ร่วมกับ Zero Pro และ Zero Nano",
    shortDescription: "หัวพอตเปลี่ยนได้ความจุ 2.2mL ใช้ร่วมกันได้ทั้งกับตัวเครื่อง Zero Pro และ Zero Nano",
  },
  // Tier-1 disposable growth mission (2026-09-03) — same translation-only rule as above: honesty
  // caveats (unverified specs, naming ambiguity) are real facts and must carry over untranslated
  // in meaning, never smoothed into a more confident-sounding Thai sentence than the English.
  "relx-smash-go-12k": {
    tagline: "พอตใช้แล้วทิ้งรุ่นทางการของ RELX คอยล์ MEGA MESH",
    shortDescription:
      "พอตใช้แล้วทิ้งชาร์จซ้ำได้จากไลน์อัพทางการของ RELX รองรับสูงสุด 12,000 พัฟ แบตเตอรี่ 400mAh คอยล์ MEGA MESH 1.0 โอห์ม มี 10 รส ยืนยันตรงจาก relxnow.com",
  },
  "relx-creator": {
    tagline: "พอตใช้แล้วทิ้งของ RELX ที่มีขายในตลาดไทย",
    shortDescription:
      "พอตใช้แล้วทิ้งสายพัฟเยอะของ RELX ที่ขายในตลาดไทย มีหลายรุ่นย่อย ทักไลน์ @okm24 ถามรุ่นปัจจุบันได้",
  },
  "joiway-f3": {
    tagline: "พอตใช้แล้วทิ้ง Joiway รุ่นจริง ยืนยันจากร้านค้าอิสระ",
    shortDescription:
      "พอตใช้แล้วทิ้งชาร์จซ้ำได้จาก Joiway รองรับสูงสุด 12,000 พัฟ สเปกตรงกันจากร้านค้าอิสระกว่า 10 ร้าน แต่ยังไม่ได้ยืนยันจากเว็บทางการของ Joiway เอง",
  },
  "joiway-f4": {
    tagline: "พอตใช้แล้วทิ้ง 2 รสในเครื่องเดียว",
    shortDescription:
      "พอตใช้แล้วทิ้ง 2 โหมด 2 รสในเครื่องเดียว โหมด NOS ประมาณ 15,000 พัฟ โหมด TURBO ประมาณ 30,000 พัฟ แบตเตอรี่ 650mAh OKami24 รีวิวใช้จริง 30 วันบน YouTube",
  },
  "tfit-m-power-20k": {
    tagline: "พอตใช้แล้วทิ้งของ TFIT ที่ OKami24 รีวิวใช้จริงบน YouTube",
    shortDescription:
      "พอตใช้แล้วทิ้งสายพัฟเยอะของ TFIT ที่ขายในตลาดไทย OKami24 รีวิวใช้จริงบน YouTube ทักไลน์ @okm24 ถามรุ่นและรสที่มีตอนนี้ได้",
  },
  "infy-20k": {
    tagline: "พอตใช้แล้วทิ้งของ INFY ที่มีขายในตลาดไทย",
    shortDescription:
      "พอตใช้แล้วทิ้งสายพัฟเยอะของ INFY ที่ขายในตลาดไทย ทักไลน์ @okm24 ถามรุ่นและรสที่มีตอนนี้ได้",
  },
  // Round 30.3 (2026-09-10) — MOOOD / Muro entries, same translation-only rule as above; these four
  // products had no Thai line, so their cards fell back to English once ProductCard started reading
  // this file. Taglines shortened by the owner ("รองรับสูงสุด N พัฟ" says everything the English does).
  "mood-monster-14k": {
    tagline: "พอตใช้แล้วทิ้ง รองรับสูงสุด 14,000 พัฟ",
    shortDescription: "พอตใช้แล้วทิ้งจาก MOOOD ซีรีส์ “Monster” รองรับสูงสุด 14,000 พัฟ ตอนนี้มีให้เลือก 10 รส",
  },
  "muro-3ml": {
    tagline: "หัวพอตบรรจุน้ำยาสำเร็จ 3mL",
    shortDescription: "หัวพอตสำหรับเปลี่ยน บรรจุน้ำยาสำเร็จ 3mL ของ Muro ตอนนี้มีให้เลือก 10 รส",
  },
  "muro-sc-8000": {
    tagline: "พอตใช้แล้วทิ้งชาร์จซ้ำได้ รองรับสูงสุด 8,000 พัฟ",
    shortDescription: "พอตใช้แล้วทิ้งชาร์จซ้ำได้จาก Muro สาย “SC” แบตเตอรี่ 600mAh ชาร์จผ่าน USB-C รองรับสูงสุด 8,000 พัฟ ตอนนี้มีให้เลือก 8 รส",
  },
  "muro-connector-20k": {
    tagline: "พอตใช้แล้วทิ้ง รองรับสูงสุด 20,000 พัฟ",
    shortDescription: "พอตใช้แล้วทิ้งจาก Muro สาย “Connector” รองรับสูงสุด 20,000 พัฟ ตอนนี้มีให้เลือก 20 รส — มากที่สุดในบรรดา Muro ทุกรุ่น",
  },
};
