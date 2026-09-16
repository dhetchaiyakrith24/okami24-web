/**
 * OKami24 — TH/ZH translations of flavor family name/description/characterNotes (owner quality
 * review, 2026-09-02). Same architecture and rationale as faq-copy.ts — see that file's header
 * comment. English in src/data/flavors.ts stays canonical/untouched; this REPLACES it per-locale
 * when a translation exists.
 */

export interface FlavorFamilyCopy {
  name: string;
  description: string;
  characterNotes: string[];
}

export const FLAVOR_COPY_TH: Record<string, FlavorFamilyCopy> = {
  fruit: {
    name: "ผลไม้",
    description:
      "มีตั้งแต่ผลไม้เดี่ยว ๆ ไปจนถึงผลไม้ผสมหลายชนิด และรสที่มีผลไม้เป็นตัวนำ เหมาะกับการสูบประจำวัน ทั้งพอตซิสเต็มและพอตใช้แล้วทิ้ง",
    // Round 30.4 batch 0 (owner, 2026-09-11 — option ข): the old first note translated "top note"
    // into the Thai word for onion, on the homepage flavor card and /e-liquid/fruit. Shop voice now.
    characterNotes: ["รสสดใส ได้รสผลไม้ชัด", "มักผสมผลไม้ตั้งแต่สองชนิดขึ้นไป", "มีรสให้เลือกเยอะ"],
  },
  "menthol-cooling": {
    name: "เมนทอลและความเย็น",
    description:
      "มีตั้งแต่เมนทอลล้วน ๆ ไปจนถึงรสที่เน้นความเย็น ทั้งเมนทอลเดี่ยว ๆ แบบสะอาด และผลไม้ผสมน้ำแข็งที่ได้รสผลไม้ก่อน แล้วปิดท้ายด้วยความเย็น",
    characterNotes: ["รู้สึกเย็นตอนปล่อยควัน", "มีตั้งแต่เมนทอลล้วนไปจนถึงผลไม้ผสมน้ำแข็ง", "มักเป็นตัวเลือกที่ให้ความรู้สึกสะอาดกว่า"],
  },
  dessert: {
    name: "ของหวาน",
    description: "รสเบเกอรี่ คัสตาร์ด ขนมหวาน เข้มและหวานกว่า สดใสน้อยลง แต่ได้รสที่ลึกกว่า",
    characterNotes: ["รสเข้ม หนักกว่าผลไม้", "กลิ่นเบเกอรี่ คัสตาร์ด และขนมหวาน", "มักสูบที่วัตต์ต่ำกว่า จะได้นุ่มคอกว่า"],
  },
  beverage: {
    name: "เครื่องดื่ม",
    description: "รสแนวเครื่องดื่ม อย่างโซดา ชาเย็น กาแฟ ส่วนใหญ่ชูรสเครื่องดื่มนั้นเป็นหลัก ไม่ได้ตั้งต้นจากผลไม้หรือเบเกอรี่",
    characterNotes: ["รสเครื่องดื่มชัด อย่างโซดา ชา กาแฟ", "มักมีผลไม้หรือความเย็นแต่งเสริม", "คนละแนวกับรสผลไม้หรือของหวานล้วน ๆ"],
  },
  "tobacco-style": {
    name: "สไตล์ยาสูบ",
    description:
      "รสแนวยาสูบ สำหรับคนที่ชอบโทนนี้มากกว่าผลไม้หรือของหวาน",
    characterNotes: ["รสหลักออกทางยาสูบ", "มีตั้งแต่แบบธรรมดาไปจนถึงผสมคาราเมลหรือกลิ่นเมนทอล"],
  },
};

export const FLAVOR_COPY_ZH: Record<string, FlavorFamilyCopy> = {
  fruit: {
    name: "水果",
    description: "最大、口味最丰富的风味家族——从单一水果到多种水果混合，再到以水果为主的风味调性，适合开放式换弹或一次性设备的日常使用。",
    characterNotes: ["明亮、突出的前调风味", "常由两种或以上水果混合调配", "所有家族中口味数量最多"],
  },
  "menthol-cooling": {
    name: "薄荷与清凉",
    description: "从纯粹薄荷到主打清凉感的调配，涵盖从干净利落的单一薄荷，到清凉尾韵搭配水果前调的水果冰调配。",
    characterNotes: ["呼气时的清凉感", "从纯薄荷到水果冰调配都有", "常被视为口感更清爽的选择"],
  },
  dessert: {
    name: "甜品",
    description: "烘焙、奶油和甜点风格的调性——以更浓郁、更甜的风味结构，换取比水果类更有层次的口感深度。",
    characterNotes: ["更浓郁厚重的风味结构", "带有烘焙、奶油、甜点风味", "通常在较低功率下使用，口感更顺滑"],
  },
  beverage: {
    name: "饮品",
    description: "以汽水、冰茶、咖啡等饮品为灵感的风味，通常以鲜明的饮品前调为核心，而非水果或烘焙基底。",
    characterNotes: ["以饮品为灵感的前调（汽水、茶、咖啡）", "常叠加水果或清凉尾韵", "与纯水果或甜品风味明显不同"],
  },
  "tobacco-style": {
    name: "烟草风格",
    description: "以烟草为灵感的风味，适合偏好烟草基调而非水果、甜品口味的用户。",
    characterNotes: ["以烟草为基调", "从纯烟草到搭配焦糖或薄荷尾韵都有"],
  },
};
