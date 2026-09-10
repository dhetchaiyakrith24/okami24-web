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
      "รุ่นเรือธงล่าสุดของตระกูล Caliburn: พอตระบบเปิดแบตเตอรี่ 1600mAh พร้อมจอสี 0.85 นิ้ว และระบบสั่งงานด้วยการแตะสามครั้งสำหรับสลับโหมดโดยไม่ต้องใช้ปุ่ม",
  },
  "caliburn-g5-lite": {
    tagline: "แพลตฟอร์ม G5 ที่ปรับให้เรียบง่ายลง เหมาะกับการใช้งานประจำวันระยะยาว",
    shortDescription:
      "รุ่นที่ตัดทอนความซับซ้อนลงจาก G5 ยังคงแบตเตอรี่ 1600mAh และสูงสุด 35 วัตต์เดิม แต่ปรับระบบควบคุมให้เรียบง่ายขึ้นในราคาที่ย่อมเยากว่า",
  },
  "caliburn-g5-lite-se": {
    tagline: "ฟินิชรุ่นพิเศษบนแพลตฟอร์ม G5 Lite",
    shortDescription: "ใช้แบตเตอรี่ 1600mAh และสูงสุด 35 วัตต์เดียวกับ G5 Lite มาในชุดสี/ฟินิชรุ่นพิเศษ",
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
      "เวอร์ชันเล็กลง เบาลง และไม่มีจอของ G4 เน้นความพกพาสะดวกล้วนๆ ใช้พอต GPP ร่วมกันได้เหมือนเดิม แต่แบตเตอรี่เล็กลงเหลือ 1100mAh",
  },
  "caliburn-g4-classic": {
    tagline: "ฟินิชรุ่นคลาสสิกบนฮาร์ดแวร์ G4 มาตรฐาน",
    shortDescription:
      "วางตำแหน่งเป็นรุ่นฟินิช/เอดิชันของ G4 มาตรฐาน โดยฮาร์ดแวร์หลักถือว่าเทียบเท่า G4 จนกว่าจะมีการยืนยันความแตกต่างของสเปกโดยอิสระ",
  },
  "caliburn-g3-pro": {
    tagline: "จอแบบ full-wraparound รุ่นแรกในตระกูล Caliburn",
    shortDescription:
      "พอตแบตเตอรี่ 1000mAh สูงสุด 35 วัตต์ พร้อมจอ LCD ที่โอบรอบด้านข้างตัวเครื่อง ปรับช่องลมได้เต็มรูปแบบ และมาพร้อมพอตสองความต้านทานในกล่อง",
  },
  "caliburn-g3-pro-koko": {
    tagline: "ฟินิชรุ่น KOKO บนแพลตฟอร์ม G3 Pro",
    shortDescription:
      "วางตำแหน่งเป็นเอดิชัน KOKO ของ G3 Pro โดยฮาร์ดแวร์หลักถือว่าเทียบเท่า G3 Pro จนกว่าจะมีการยืนยันความแตกต่างของสเปกโดยอิสระ",
  },
  "argus-g4": {
    tagline: "พอตคิทแบตอึดใช้ได้ 5 วัน พร้อมจอสถานะ HD เต็มรูปแบบ",
    shortDescription:
      "รุ่นเรือธงสายหลักของ ARGUS ในปัจจุบัน: แบตเตอรี่ 1650mAh 5–35 วัตต์ จอ HD ขนาด 0.85 นิ้วแสดงระดับแบต วัตต์ โอห์ม สถานะล็อก และจำนวนพัฟ พร้อมชาร์จเร็วผ่าน Type-C เต็มใน 45 นาที",
  },
  "argus-g4-mini": {
    tagline: "แบตเตอรี่เท่า G4 วัตต์ลดลง ตัวเครื่องเล็กลง",
    shortDescription: "ใช้แบตเตอรี่ 1650mAh เดียวกับ ARGUS G4 แต่ในตัวเครื่องที่เล็กลง และปรับวัตต์สูงสุดลงเหลือ 30 วัตต์ จากเดิม 35 วัตต์",
  },
  "argus-p3": {
    tagline: "จอทัช HD เต็มรูปแบบขนาด 2.01 นิ้ว บนแพลตฟอร์ม ARGUS",
    shortDescription: "พอตคิทแบตเตอรี่ 1500mAh 5–30 วัตต์ ออกแบบรอบจอทัช TFT HD ขนาด 2.01 นิ้วสำหรับควบคุมเมนูและโหมดการใช้งาน",
  },
  "argus-g3-mini": {
    tagline: "ความเรียบง่ายที่ขับเคลื่อนด้วย GENE.AI ปรับวัตต์อัตโนมัติ",
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
    tagline: "40 วัตต์ เติมน้ำยาด้านบน ออกแบบมาเพื่อคนตามหารสชาติ",
    shortDescription: "พอตคิทแบตเตอรี่ 2000mAh 5–40 วัตต์ คาร์ทริดจ์เติมด้านบนความจุ 4.5mL (2mL ตามมาตรฐาน TPD) ช่วง 0.3–3.0 โอห์ม",
  },
  "vmate-i3": {
    tagline: "พอตคิทน้ำหนักเบาพิเศษ ยาวเพียง 103mm",
    shortDescription: "พอตคิทที่เบาที่สุดในกลุ่มของ VOOPOO ขณะนี้: เครื่องอะลูมิเนียมอัลลอยบางเฉียบ แบตเตอรี่ 1500mAh 5–30 วัตต์ คาร์ทริดจ์เติมด้านบน 3mL",
  },
  "m-bar-10k": {
    tagline: "3 โหมดวัตต์ วงแหวน RGB แสดงสถานะ รองรับ 10,000 พัฟ",
    shortDescription: "พอตใช้แล้วทิ้งชาร์จซ้ำได้ รองรับสูงสุด 10,000 พัฟ ใช้คอยล์คอตตอนเมช มี 3 โหมดวัตต์ให้สลับ พร้อมไฟ RGB แสดงโหมดที่ใช้งานอยู่",
  },
  "m-bar-9k": {
    tagline: "ปรับช่องลมได้ตั้งแต่ MTL ถึง DTL รองรับ 9,000 พัฟ",
    shortDescription: "พอตใช้แล้วทิ้งชาร์จซ้ำได้ บรรจุน้ำยาสำเร็จ 14mL ปรับช่องลมได้ตั้งแต่แบบ MTL แน่นๆ ไปจนถึง DTL โปร่งๆ ใช้คอยล์เมชรองรับสูงสุด 9,000 พัฟ",
  },
  "m-bar-15k": {
    tagline: "จำนวนพัฟที่ระบุสูงที่สุดในตระกูล M Bar",
    shortDescription:
      "M Bar รุ่นใหม่ล่าสุดและความจุสูงสุด รองรับสูงสุด 15,000 พัฟ ด้วยคอยล์คอตตอนเมช ชาร์จเร็วผ่าน Type-C ส่วนความจุแบตเตอรี่และน้ำยายังไม่มีการยืนยันโดยอิสระ",
  },
  "m-switch-kit": {
    tagline: "ตัวเครื่องใช้ซ้ำได้ คาร์ทริดจ์บรรจุสำเร็จ ไม่ต้องเติมเอง",
    shortDescription:
      "ตัวเครื่องใช้ซ้ำได้ จับคู่กับคาร์ทริดจ์ M Switch Pod บรรจุสำเร็จ รองรับสูงสุด 15,000 พัฟต่อพอต — เก็บตัวเครื่องไว้ชาร์จใช้ต่อ แล้วเปลี่ยนเฉพาะคาร์ทริดจ์แทนการเติมน้ำยาเอง",
  },
  "m-switch-pod": {
    tagline: "คาร์ทริดจ์บรรจุสำเร็จสำหรับ M Switch Kit",
    shortDescription: "คาร์ทริดจ์ทดแทนบรรจุน้ำยาสำเร็จ 2.2mL สำหรับตัวเครื่อง M Switch Kit",
  },
  "m-bar-pod": {
    tagline: "15+ รสชาติ ใช้คาร์ทริดจ์ตระกูลเดียวกัน",
    shortDescription: "สายพอตทดแทนที่ใช้ร่วมกันได้กับอุปกรณ์ใช้ซ้ำที่รองรับ M Bar ของ SALTHUB มีให้เลือกกว่า 15 รสชาติ",
  },
  "zero-pro": {
    tagline: "3 โหมด ในตัวเครื่องระบบสวิตช์ใช้ซ้ำได้",
    shortDescription: "อุปกรณ์ระบบสวิตช์ใช้ซ้ำได้ 3 โหมด รองรับสูงสุด 5,000 พัฟต่อ Zero Cartridge หนึ่งอัน",
  },
  "zero-nano": {
    tagline: "เครื่องที่เล็กที่สุดในแพลตฟอร์ม Zero",
    shortDescription: "อุปกรณ์ใช้ซ้ำได้ขนาดกะทัดรัดพิเศษ แบตเตอรี่ 500mAh ใช้ระบบคาร์ทริดจ์ Zero เดียวกัน",
  },
  "zero-cartridge": {
    tagline: "คาร์ทริดจ์เปลี่ยนได้ ใช้ร่วมกับ Zero Pro และ Zero Nano",
    shortDescription: "คาร์ทริดจ์เปลี่ยนได้ความจุ 2.2mL ใช้ร่วมกันได้ทั้งกับตัวเครื่อง Zero Pro และ Zero Nano",
  },
  // Tier-1 disposable growth mission (2026-09-03) — same translation-only rule as above: honesty
  // caveats (unverified specs, naming ambiguity) are real facts and must carry over untranslated
  // in meaning, never smoothed into a more confident-sounding Thai sentence than the English.
  "relx-smash-go-12k": {
    tagline: "พอตใช้แล้วทิ้งรุ่นทางการของ RELX คอยล์ MEGA MESH",
    shortDescription:
      "พอตใช้แล้วทิ้งชาร์จซ้ำได้จากไลน์อัพทางการของ RELX เอง รองรับสูงสุด 12,000 พัฟ แบตเตอรี่ 400mAh คอยล์ MEGA MESH 1.0 โอห์ม และมีรสชาติครบ 10 รสตามที่ยืนยันตรงจาก relxnow.com",
  },
  "relx-creator": {
    tagline: "พอตใช้แล้วทิ้ง RELX สายรุ่นจริง — รอยืนยันสต็อกปัจจุบันจากพี่",
    shortDescription:
      "พอตใช้แล้วทิ้งวัตต์สูงของ RELX ที่ขายจริงในตลาดไทย/ภูมิภาค — คนละรุ่นกับ \"RELX Creator\" บนเว็บทางการนานาชาติ (ระบบพอตเปลี่ยนหัว ~5,000 พัฟ/หัว) ค้นเพิ่มพบว่าเป็นสาย generation จริง 18K → Clear Pod 18K → Boost 20K → 22K ไม่ใช่ความสับสนชื่อ แสดงเป็นรุ่น 22K ซึ่งเป็นรุ่นล่าสุดตามคลิปรีวิวของ OKami24 เอง",
  },
  "joiway-f3": {
    tagline: "พอตใช้แล้วทิ้ง Joiway รุ่นจริง ยืนยันจากร้านค้าอิสระ",
    shortDescription:
      "พอตใช้แล้วทิ้งชาร์จซ้ำได้จาก Joiway (myjoiway.com) แบรนด์ผู้ผลิตจริง รองรับสูงสุด 12,000 พัฟ สเปกยืนยันตรงกันจากร้านค้าอิสระในไทย/เอเชียตะวันออกเฉียงใต้กว่า 10 ร้าน แต่เว็บทางการของ Joiway เองยังเข้าตรวจสอบไม่ได้ในรอบนี้ (ระบบเว็บบล็อกการเข้าถึงอัตโนมัติ ไม่ใช่หลักฐานว่าไม่มีจริง)",
  },
  "joiway-f4": {
    tagline: "Joiway รุ่นใหม่กว่า สลับ 2 รสในเครื่องเดียว ตรงกับรีวิวจริงของ OKami24",
    shortDescription:
      "พอตใช้แล้วทิ้ง 2 โหมด 2 รสในเครื่องเดียว (หมุนปากดูดเพื่อสลับรส) โหมด NOS ประมาณ 15,000 พัฟ โหมด TURBO ประมาณ 30,000 พัฟ แบตเตอรี่ 650mAh นี่คือรุ่นที่ OKami24 มีรีวิวใช้งานจริง 30 วันบนช่อง YouTube ของตัวเอง",
  },
  "tfit-m-power-20k": {
    tagline: "ยืนยันแล้วว่ามีรีวิวจริงจาก OKami24 — สเปกยังต้องตรวจสอบ",
    shortDescription:
      "พอตใช้แล้วทิ้งรองรับ 20,000 พัฟ ที่ OKami24 มีรีวิวใช้งานจริง 30 วันบนช่อง YouTube ของตัวเอง ชื่อแบรนด์ยืนยันเป็น \"TFIT\" (ไม่ใช่ \"TFIF\") จากตัวสะกดในคลิป แต่สเปกด้านล่างมาจากร้านค้าเพียงร้านเดียวซึ่งไม่ตรงกับไลน์อัพทางการของ TFIT (NOVA/NOVA MAX) — พบว่าชื่อ \"M Power\" มีแบรนด์อื่นใช้ซ้ำด้วย (Mon, Mazaj) จึงยังต้องตรวจสอบกับสินค้าจริงก่อนยืนยัน",
  },
  "infy-20k": {
    tagline: "พอตใช้แล้วทิ้ง INFY รุ่นจริง ยืนยันจากร้านค้าอิสระ",
    shortDescription:
      "พอตใช้แล้วทิ้งชาร์จซ้ำได้จาก INFY (infy.my) รองรับสูงสุด 20,000 พัฟ เป็นสินค้าจริงที่ขายอยู่ (มีรีวิวใช้งานจริงและโพสต์สินค้าเข้าใหม่จากร้านค้า) แต่ไม่อยู่ในไลน์อัพพอตใช้แล้วทิ้งที่เว็บทางการของ INFY ระบุไว้ (สูงสุดที่ระบุคือ 12K) ตัวเลขแบตเตอรี่/ความจุยังมีความคลาดเคลื่อนเล็กน้อยระหว่างร้านค้า (600mAh/18mL กับ 650mAh/20mL) ยังไม่ได้ตรวจกับสินค้าจริง",
  },
};
