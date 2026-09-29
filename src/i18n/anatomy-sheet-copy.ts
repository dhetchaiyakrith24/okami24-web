/**
 * "ไล่ดูทีละส่วน" exploded-view sheet — round "M Bar 10K exploded view" (owner 2026-09-30: the anatomy walk-through
 * UWELL pages have, done as a premium exploded view; if it works it becomes the template for other products).
 *
 * One entry per product slug; `ProductMoreDetails` renders `ProductAnatomySheet` only for a slug listed here. The data
 * and its th/en/zh copy live in this module on purpose — not in the dictionaries, the product data file or
 * product-copy-th.ts — so the page files every other product shares (and the sitemap dates tied to them,
 * `src/lib/content-dates.ts`) do not move for a one-product section.
 *
 * Facts: manufacturer only (SALTHUB's M Bar 10K posters MBar10K_01–07 and salthub.com/mbar-10k/ — researcher table
 * `_incoming/mbar10k-anatomy/facts.md`). Nothing about the inside of the device is drawn or said: the maker never
 * shows the tank, coil or battery. A line that states a figure names the spec row that verifies it (`specKey`) and is
 * dropped when that row is not `verified` in the product data. The airflow slot's label rests on poster 01
 * ("ADJUSTABLE AIRFLOW"), the salthub.com alt text of poster 04 ("with airflow control button") and the owner's
 * reading of the slot (2026-09-30) — the product data has no airflow row yet (adding one moves the dates of every
 * SALTHUB page, left for after the 2026-10-05 baseline hold).
 *
 * Images: renders made from the owner-approved M Bar 10K photos (one colour, the card's), parts cut along the seams
 * a front view shows — `_incoming/mbar10k-anatomy/work/export.js`.
 */

export interface SheetText {
  th: string;
  en: string;
  zh: string;
}

export interface SheetImage {
  src: string;
  width: number;
  height: number;
  alt: SheetText;
}

/** A numbered call-out. `code` = the blueprint label (English caps, shown small in every language). */
export interface SheetCallout {
  n: number;
  code: string;
  name: SheetText;
  detail?: SheetText;
  /** the detail is shown only while this spec row is `verified` in the product data */
  specKey?: string;
}

/** One separated part of the exploded column; `callouts[].y` = where the leader meets the part, % of its height. */
export interface SheetPart {
  id: string;
  image: SheetImage;
  callouts: (SheetCallout & { y: number; x?: number })[];
}

export interface AnatomySheet {
  /** section heading — its own text, not dict.product.anatomyTitle, whose en/zh ("from the outside in") promise a
   *  look inside that this sheet never shows (thai-copy 2026-09-30) */
  heading: SheetText;
  sheetTitle: SheetText;
  parts: SheetPart[];
  assembled: SheetImage;
  /** base face call-outs, placed on the drawn bottom view (x/y = % of the drawing) */
  base: (SheetCallout & { x: number; y: number })[];
  zooms: { id: string; code: string; name: SheetText; image: SheetImage; leds?: boolean }[];
  facts: { specKey: string; text: SheetText }[];
  note: SheetText;
}

const A = "/assets/products/m-bar-10k/anatomy";

export const ANATOMY_SHEETS: Record<string, AnatomySheet> = {
  "m-bar-10k": {
    heading: { th: "ไล่ดูทีละส่วน จากบนลงล่าง", en: "Part by part, top to bottom", zh: "逐个部件，自上而下" },
    sheetTitle: { th: "ภาพแยกชิ้น", en: "Exploded view", zh: "分解图" },
    parts: [
      {
        id: "mouthpiece",
        image: { src: `${A}/part-mouthpiece-v1.webp`, width: 410, height: 258, alt: { th: "ปากดูดของ M Bar 10K", en: "M Bar 10K mouthpiece", zh: "M Bar 10K 吸嘴" } },
        callouts: [{ n: 1, code: "MOUTHPIECE", y: 50, name: { th: "ปากดูด", en: "Mouthpiece", zh: "吸嘴" } }],
      },
      {
        id: "collar",
        image: { src: `${A}/part-collar-v1.webp`, width: 434, height: 260, alt: { th: "ปลอกลายร่องของ M Bar 10K", en: "M Bar 10K ribbed collar", zh: "M Bar 10K 纹理套环" } },
        callouts: [{ n: 2, code: "RIBBED COLLAR", y: 40, name: { th: "ปลอกลายร่อง", en: "Ribbed collar", zh: "纹理套环" } }],
      },
      {
        id: "body",
        image: { src: `${A}/part-body-v1.webp`, width: 436, height: 1079, alt: { th: "ตัวเครื่อง M Bar 10K มองจากด้านหน้า", en: "M Bar 10K body, front view", zh: "M Bar 10K 机身正面" } },
        callouts: [
          {
            n: 3,
            code: "BODY",
            y: 30,
            name: { th: "ตัวเครื่อง", en: "Body", zh: "机身" },
            detail: { th: "ทรงขวดน้ำยา", en: "Classic e-liquid bottle shape", zh: "经典烟油瓶造型" },
          },
          {
            n: 4,
            code: "MINI DISPLAY",
            y: 77,
            x: 66,
            name: { th: "ไฟบอกสถานะ", en: "Mini display", zh: "迷你显示屏" },
            detail: {
              th: "ไฟ 4 ดวงบอกแบตที่เหลือ ดวงละ 25% ส่วนไฟ RGB เปลี่ยนสีตามโหมด เขียว Eco น้ำเงิน Soft ชมพูอมม่วง Boost",
              en: "4 LEDs show the remaining battery, 25% each; the RGB light shows the mode: green Eco, blue Soft, magenta Boost",
              zh: "4 颗 LED 显示剩余电量，每颗 25%；RGB 灯显示当前模式：绿色 Eco、蓝色 Soft、粉紫色 Boost",
            },
            specKey: "indicator",
          },
          {
            n: 5,
            code: "GRADIENT BASE",
            y: 93,
            name: { th: "ฐานไล่สี", en: "Gradient base", zh: "渐变底座" },
            detail: { th: "ไล่จากดำเป็นสีประจำของแต่ละกลิ่น", en: "Fades from black into each flavour's own colour", zh: "由黑色渐变为各口味的专属颜色" },
          },
        ],
      },
    ],
    assembled: {
      src: `${A}/assembled-v1.webp`,
      width: 740,
      height: 1600,
      alt: { th: "M Bar 10K ทั้งเครื่อง มุมเฉียง", en: "M Bar 10K assembled, three-quarter view", zh: "M Bar 10K 整机斜角视图" },
    },
    base: [
      {
        n: 6,
        code: "CHARGING PORT",
        x: 80,
        y: 20,
        name: { th: "ช่องชาร์จ USB-C", en: "USB-C charging port", zh: "USB-C 充电口" },
        detail: { th: "แบต 600mAh ชาร์จซ้ำได้", en: "Rechargeable 600mAh battery", zh: "600mAh 电池，可重复充电" },
        specKey: "battery",
      },
      {
        n: 7,
        code: "BOTTOM BUTTON",
        x: 64,
        y: 39,
        name: { th: "ปุ่มก้นพอต", en: "Bottom button", zh: "底部按键" },
        // "Eco/Soft/Boost" without spaces, as poster 04 prints it — one word, so "/ Boost" cannot drop to a line alone
        detail: { th: "กดสองครั้งติดกันเพื่อสลับ 3 โหมด Eco/Soft/Boost", en: "Double-click to switch between 3 modes: Eco/Soft/Boost", zh: "连按两下切换 3 种模式：Eco/Soft/Boost" },
        specKey: "modes",
      },
      {
        n: 8,
        code: "AIRFLOW ADJUSTER",
        x: 74,
        y: 84,
        name: { th: "ช่องปรับลม", en: "Airflow adjuster", zh: "气流调节槽" },
      },
    ],
    zooms: [
      { id: "base", code: "BASE DETAIL", name: { th: "ก้นพอต", en: "Base", zh: "底部" }, image: { src: `${A}/zoom-base-v1.webp`, width: 1200, height: 1200, alt: { th: "ก้นพอต M Bar 10K ระยะใกล้ ช่องชาร์จ ปุ่ม และช่องปรับลม", en: "M Bar 10K base close-up: charging port, button and airflow slot", zh: "M Bar 10K 底部特写：充电口、按键与气流调节槽" } } },
      { id: "display", code: "DISPLAY DETAIL", name: { th: "ไฟบอกสถานะ", en: "Mini display", zh: "迷你显示屏" }, leds: true, image: { src: `${A}/zoom-display-v1.webp`, width: 1200, height: 1200, alt: { th: "ไฟบอกสถานะของ M Bar 10K ระยะใกล้", en: "M Bar 10K mini display close-up", zh: "M Bar 10K 迷你显示屏特写" } } },
      { id: "collar", code: "COLLAR DETAIL", name: { th: "ปลอกลายร่อง", en: "Ribbed collar", zh: "纹理套环" }, image: { src: `${A}/zoom-collar-v1.webp`, width: 1200, height: 1200, alt: { th: "ปลอกลายร่องและปากดูดของ M Bar 10K ระยะใกล้", en: "M Bar 10K ribbed collar and mouthpiece close-up", zh: "M Bar 10K 纹理套环与吸嘴特写" } } },
    ],
    facts: [
      { specKey: "puffs", text: { th: "10,000 พัฟ", en: "10,000 puffs", zh: "10,000 口" } },
      { specKey: "battery", text: { th: "แบต 600mAh", en: "600mAh battery", zh: "600mAh 电池" } },
      { specKey: "coil", text: { th: "คอยล์ cotton mesh", en: "Cotton mesh coil", zh: "Cotton mesh 线圈" } },
      { specKey: "modes", text: { th: "3 โหมด", en: "3 modes", zh: "3 种模式" } },
    ],
    note: {
      th: "ภาพนี้แยกชิ้นให้ดูแต่ละส่วน ไม่ใช่ภาพถอดเครื่องจริง",
      en: "Parts are drawn apart for illustration; this is not a teardown of the device.",
      zh: "分解图仅用于展示各个部分，并非实机拆解。",
    },
  },
};
