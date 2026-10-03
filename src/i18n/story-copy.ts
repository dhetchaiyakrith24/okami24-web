/**
 * The "more details" story text beside each maker poster, in all three languages — round "G5 template" batch 2
 * (owner 02/10: "ข้อความต่อ 1 รูปตอนนี้น้อยไป" · short and sharp like Apple · th/en/zh · facts from the maker only).
 *
 * One entry per product slug, keyed by the `features[].id` whose poster the text sits beside. `ProductMoreDetails`
 * (stage layout) reads it before the product's own `features` text; a slug or block without an entry renders as
 * before. Kept out of the brand data file and product-copy-th.ts on purpose, like anatomy-sheet-copy.ts: a
 * one-product story does not move the sitemap dates of every product that shares those files.
 *
 * Facts: UWELL's own G5 page and spec sheet (researcher notes `_incoming/g5-template/uwell-g5-source.md`); Thai =
 * thai-copy 02/10 (`b2-copy-th.md`). A point that states a figure names the spec row that verifies it (`specKey`)
 * and is dropped while that row is not `verified` in the product data.
 */
import type { SheetText } from "@/i18n/anatomy-sheet-copy";

export interface StoryPoint {
  text: SheetText;
  /** shown only while this spec row is `verified` in the product data */
  specKey?: string;
}

export interface StoryBlockCopy {
  title: SheetText;
  subline?: SheetText;
  body: SheetText;
  points?: StoryPoint[];
  captions?: SheetText[];
  /** where the poster (and a text link under the text) goes — round G5 template batch 3; no link = not clickable */
  link?: { href: string; label: SheetText };
}

export const STORY_COPY: Record<string, Record<string, StoryBlockCopy>> = {
  "caliburn-g5": {
    "three-pods": {
      title: { th: "ในกล่องมีหัวพอต 3 หัว", en: "Three pods in every kit", zh: "每套配 3 个烟弹" },
      subline: { th: "หนึ่งในนั้นคือหัว GPP Alpha รุ่นใหม่", en: "One of them is the new GPP Alpha.", zh: "其中一个是全新 GPP Alpha。" },
      body: {
        th: "เปิดกล่องมาก็มีหัวสำรองไว้เปลี่ยน ลองสลับสองแบบดูได้เลยว่าชอบหัวไหน",
        en: "Open the box and the spares are already there. Swap between the two and see which you like.",
        zh: "开箱就有备用烟弹，两种换着用，看看更喜欢哪一种。",
      },
      points: [
        { text: { th: "GPP ปกติ 2 หัว", en: "2 regular GPP pods", zh: "2 个普通 GPP 烟弹" }, specKey: "included-pod" },
        { text: { th: "GPP Alpha 0.6 โอห์ม 1 หัว", en: "1 GPP Alpha, 0.6Ω", zh: "1 个 0.6Ω GPP Alpha 烟弹" }, specKey: "included-pod" },
        { text: { th: "แบบหัวต่างกันตามเวอร์ชัน", en: "Pod types vary by market version", zh: "烟弹类型因销售版本而异" }, specKey: "included-pod" },
      ],
      // the GPP cartridges the shop sells (catalog-relationships.ts: every GPP cartridge fits the G5)
      link: { href: "/products/coil-94", label: { th: "ดูหัวพอต GPP ที่ใช้กับ G5", en: "See the GPP pods that fit the G5", zh: "查看适用于 G5 的 GPP 烟弹" } },
    },
    "gpp-alpha": {
      title: { th: "หัวพอต GPP Alpha", en: "GPP Alpha cartridge", zh: "GPP Alpha 烟弹" },
      subline: { th: "คอยล์ใช้ได้นานขึ้น รสชาติไม่ดรอป", en: "Built to last. No flavour drop.", zh: "更耐用，口感不衰减。" },
      body: {
        th: "หัวนี้ใช้ AlphaCore ของ UWELL เปลี่ยนหัวน้อยลง",
        en: "It runs on UWELL's AlphaCore — keep vaping and there's no rush to change the pod.",
        zh: "采用 UWELL 的 AlphaCore 技术，一直抽下去也不用急着换烟弹。",
      },
      points: [
        { text: { th: "ออกแบบให้รั่วซึมยาก", en: "Leak-resistant design", zh: "防漏设计" } },
        { text: { th: "ปากดูด TPU นุ่มปาก", en: "Soft-touch TPU mouthpiece", zh: "柔软 TPU 吸嘴" } },
      ],
    },
    "triple-tap": {
      title: { th: "Smart Triple-Tap Control", en: "Smart Triple-Tap Control", zh: "Smart Triple-Tap Control" },
      subline: { th: "แตะสามครั้ง ตรงไหนของตัวเครื่องก็ได้", en: "Three taps, anywhere on the body.", zh: "机身任意位置，轻敲三下即可。" },
      body: {
        // owner 03/10: thai-copy's line replaces the approved one (the old one claimed a status check UWELL never mentions)
        th: "ตัวเครื่องมีเซ็นเซอร์จับการแตะ แตะสามครั้งแทนการกดปุ่ม ตอนอยู่ในที่มืดหรือกลางแดดจ้าจนมองจอลำบาก ก็แตะสลับได้ทันที",
        en: "A built-in tap sensor saves you fiddling with buttons. In the dark or in bright sun, when the screen is hard to read, a triple tap still switches instantly.",
        zh: "内置敲击传感器，省去繁琐按键。黑暗中或强光下看不清屏幕时，轻敲三下也能马上切换。",
      },
      points: [
        { text: { th: "สลับโหมด", en: "Switch mode", zh: "切换模式" } },
        { text: { th: "เปลี่ยนธีมหน้าจอ", en: "Change the UI theme", zh: "更换 UI 主题" } },
        { text: { th: "ปรับความสว่างจอ", en: "Adjust brightness", zh: "调节屏幕亮度" } },
      ],
      link: { href: "/technology/gesture-and-triple-tap-control", label: { th: "อ่านเรื่องระบบแตะสามครั้ง", en: "How triple-tap control works", zh: "了解三击控制" } },
      captions: [
        { th: "ในที่มืด", en: "In the dark", zh: "黑暗中" },
        { th: "กลางแดดจ้า", en: "Under bright sunlight", zh: "强光下" },
        { th: "ระหว่างเดินทาง", en: "On the go", zh: "在路上" },
        { th: "ตอนกำลังเพลิน", en: "In the moment", zh: "尽兴时刻" },
      ],
    },
    "display-x-ui": {
      title: { th: "จอสีเข้าชุดกับตัวเครื่อง", en: "A screen dressed to match", zh: "屏幕主题与机身配色呼应" },
      subline: { th: "เลือกสีไหน ได้ธีมหน้าจอของสีนั้นมาด้วย", en: "Pick a colour, and its screen theme comes with it.", zh: "选哪种颜色，就配哪套专属屏幕主题。" },
      body: {
        // owner 03/10: thai-copy's line replaces the approved one
        th: "จอสี 0.85 นิ้ว มองแวบเดียวก็เห็นแบต วัตต์ และโหมดที่ใช้อยู่ อยากเปลี่ยนธีมหน้าจอ ก็แตะสามครั้ง",
        en: "The 0.85\" colour screen shows battery, wattage and mode at a glance. Want a different theme? Triple-tap.",
        zh: "0.85 英寸彩色屏，电量、功率和模式一目了然。想换主题？轻敲三下就行。",
      },
      points: [
        { text: { th: "ตัวเครื่อง 7 สี", en: "7 body colours", zh: "机身 7 种颜色" } },
      ],
    },
    "long-run-battery": {
      title: { th: "แบต 1600mAh", en: "1600mAh battery", zh: "1600mAh 电池" },
      subline: {
        th: "ชาร์จครั้งเดียว ใช้งานทั่วไปได้สูงสุด 6 วัน (ตัวเลขของ UWELL)",
        en: "UWELL rates it at up to 6 days of typical use per charge.",
        zh: "充一次电，日常使用最长可达 6 天（UWELL 数据）。",
      },
      body: {
        // G5 template round 03/10: the "6 days is UWELL's figure" half went — the subline right above says it
        th: "ใช้จริงได้กี่วันขึ้นอยู่กับว่าสูบบ่อยแค่ไหน ตั้งกี่วัตต์ และเปิดช่องลมแค่ไหน",
        en: "How long yours lasts depends on how often you vape, the wattage and the airflow.",
        zh: "实际能用多久，要看抽吸频率、功率设置和气流大小。",
      },
      points: [
        { text: { th: "ชาร์จผ่าน USB-C", en: "USB-C charging", zh: "USB-C 充电" }, specKey: "charging" },
      ],
    },
    "aluminium-airflow": {
      title: { th: "ตัวเครื่องอะลูมิเนียม ปรับลมได้ละเอียด", en: "Aluminium body, stepless airflow", zh: "铝合金机身，无级调气" },
      subline: { th: "ถือแล้วดูดี สูบแล้วลื่น", en: "Premium in hand. Smooth on the draw.", zh: "握感高级，吸感顺滑。" },
      body: {
        th: "จับถนัดมือ รอยนิ้วมือกับคราบติดยาก ลมก็เลื่อนหาจุดที่ชอบได้เอง",
        en: "Comfortable in the hand, hard to smudge, and the airflow finds the draw that suits you.",
        zh: "握感舒适，不易留指纹和污渍，气流也能调到适合自己的吸感。",
      },
      points: [
        { text: { th: "อะลูมิเนียมอัลลอยผิวด้าน", en: "Matte aluminium alloy", zh: "哑光铝合金" }, specKey: "materials" },
        { text: { th: "หนัก 65 กรัม", en: "65g", zh: "重 65g" }, specKey: "weight" },
        { text: { th: "ปรับลม MTL ถึง RDL", en: "Airflow from MTL to RDL", zh: "无级调气，MTL 到 RDL" }, specKey: "airflow" },
      ],
      // checker #221: the MTL/DTL guide belongs to the airflow block, not to the "G5 vs G5 Lite" answer
      link: { href: "/guides/understanding-mtl-vs-dtl", label: { th: "อ่านเรื่อง MTL กับ DTL", en: "Read: MTL vs. DTL", zh: "了解 MTL 与 DTL 的区别" } },
    },
  },
  // Site-wide template round batch 1a (03/10): UWELL's G5 Lite / Lite SE page only (_incoming/sitewide-template/1a/page.txt);
  // Thai = thai-copy 03/10. Facts the hero already says (1600mAh, 35W) are not repeated as points.
  "caliburn-g5-lite": {
    "long-run-battery": {
      title: { th: "แบต 1600mAh", en: "1600mAh battery", zh: "1600mAh 电池" },
      subline: { th: "ชาร์จครั้งเดียว ใช้ได้สูงสุด 6 วัน (ตัวเลขของ UWELL)", en: "Up to 6 days on a single charge (UWELL's figure).", zh: "充一次电最长可用 6 天（UWELL 数据）。" },
      body: {
        th: "ใช้จริงได้กี่วันขึ้นอยู่กับว่าสูบบ่อยแค่ไหน และเปิดลมแค่ไหน",
        en: "How long yours lasts depends on how often you vape and how open the airflow is.",
        zh: "实际能用几天，取决于抽吸频率和气流开多大。",
      },
      points: [
        { text: { th: "ไฟ LED 4 ขีดบอกระดับแบต", en: "4-bar LED shows the battery level", zh: "4 格 LED 显示电量" }, specKey: "screen" },
      ],
    },
    "dual-layer": {
      title: { th: "ผิวสองชั้น", en: "Two-layer shell", zh: "双层设计" },
      subline: { th: "แกนด้านใน หุ้มด้วยเปลือกโปร่งแสง", en: "An inner core under a translucent shell.", zh: "内芯外覆半透明外壳。" },
      body: {
        th: "ตัวเครื่องเบา ทรงจับถนัดมือ เลือกสีที่เข้ากับตัวเองได้เลย",
        en: "Light and shaped to sit well in the hand — pick the colour that suits you.",
        zh: "机身轻巧，握感顺手，选一个适合你的颜色。",
      },
      points: [
        { text: { th: "ตัวเครื่อง 8 สี", en: "8 colours", zh: "8 种颜色" } },
      ],
    },
    "power-35w": {
      title: { th: "35 วัตต์ รสชาติเข้ม", en: "35W, full flavour", zh: "35W，风味浓郁" },
      subline: { th: "รสกลมกล่อม มีหลายชั้น", en: "Rich and layered.", zh: "口感醇厚，层次丰富。" },
      body: {
        th: "ระบบปรับรสชาติ Pro-FOCS 4.0 คุมให้ทุกพัฟรสสมดุล ตามผลทดสอบของ UWELL LAB",
        en: "Pro-FOCS 4.0 keeps every puff balanced (UWELL LAB tests).",
        zh: "Pro-FOCS 4.0 让每一口都口感均衡（UWELL LAB 测试）。",
      },
      points: [
        { text: { th: "หัวพอต 0.4 โอห์ม", en: "0.4Ω pod", zh: "0.4Ω 烟弹" }, specKey: "pod-resistance" },
      ],
    },
    "airflow": {
      title: { th: "ปรับลมได้สองแบบ", en: "Airflow, two ways", zh: "两种气流调节" },
      subline: { th: "ตั้งแต่ MTL ถึง RDL สูบลื่นทุกระดับ", en: "From MTL to RDL, always smooth.", zh: "从 MTL 到 RDL，始终顺滑。" },
      body: {
        th: "ชอบสูบแน่นหรืออยากโล่งขึ้นหน่อย ก็ตั้งลมให้ตรงกับที่ชอบได้เอง",
        en: "Like it tight or a little more open? Set the airflow to match.",
        zh: "喜欢紧一点还是松一点？气流按你的喜好来调。",
      },
      points: [
        { text: { th: "กลับด้านหัวพอตเพื่อปรับลม", en: "Reverse the pod to change the airflow", zh: "烟弹可反转调节气流" }, specKey: "airflow" },
        { text: { th: "ปรับช่องลมได้ละเอียดแบบไม่มีขั้น", en: "Stepless airflow control", zh: "无级气流调节" }, specKey: "airflow" },
      ],
      link: { href: "/guides/understanding-mtl-vs-dtl", label: { th: "อ่านเรื่อง MTL กับ DTL", en: "Read: MTL vs. DTL", zh: "了解 MTL 与 DTL 的区别" } },
    },
  },
  // Site-wide template round batch 1a (03/10): UWELL's G5 Lite / Lite SE page only (_incoming/sitewide-template/1a/page.txt);
  // Thai = thai-copy 03/10. Facts the hero already says (1600mAh, 35W) are not repeated as points.
  "caliburn-g5-lite-se": {
    "long-run-battery": {
      title: { th: "แบต 1600mAh", en: "1600mAh battery", zh: "1600mAh 电池" },
      subline: { th: "ชาร์จครั้งเดียว ใช้ได้สูงสุด 6 วัน (ตัวเลขของ UWELL)", en: "Up to 6 days on a single charge (UWELL's figure).", zh: "充一次电最长可用 6 天（UWELL 数据）。" },
      body: {
        th: "ใช้จริงได้กี่วันขึ้นอยู่กับว่าสูบบ่อยแค่ไหน และเปิดลมแค่ไหน",
        en: "How long yours lasts depends on how often you vape and how open the airflow is.",
        zh: "实际能用几天，取决于抽吸频率和气流开多大。",
      },
      points: [
        { text: { th: "ไฟ LED 4 ขีดบอกระดับแบต", en: "4-bar LED shows the battery level", zh: "4 格 LED 显示电量" }, specKey: "screen" },
      ],
    },
    "dual-tone": {
      title: { th: "ผิวทูโทน", en: "Dual-tone finish", zh: "双色拼接" },
      subline: { th: "หนังคู่กับผิวลายริ้ว", en: "Leather paired with a striped texture.", zh: "皮革搭配条纹质感。" },
      body: {
        th: "ตัวเครื่องเบา ทรงจับถนัดมือ เลือกสีหนังที่เข้ากับตัวเองได้เลย",
        en: "Light and shaped to sit well in the hand — pick the leather colour that suits you.",
        zh: "机身轻巧，握感顺手，选一个适合你的皮革颜色。",
      },
      points: [
        { text: { th: "ตัวเครื่อง 8 สี", en: "8 colours", zh: "8 种颜色" } },
      ],
    },
    "power-35w": {
      title: { th: "35 วัตต์ รสชาติเข้ม", en: "35W, full flavour", zh: "35W，风味浓郁" },
      subline: { th: "รสกลมกล่อม มีหลายชั้น", en: "Rich and layered.", zh: "口感醇厚，层次丰富。" },
      body: {
        th: "ระบบปรับรสชาติ Pro-FOCS 4.0 คุมให้ทุกพัฟรสสมดุล ตามผลทดสอบของ UWELL LAB",
        en: "Pro-FOCS 4.0 keeps every puff balanced (UWELL LAB tests).",
        zh: "Pro-FOCS 4.0 让每一口都口感均衡（UWELL LAB 测试）。",
      },
      points: [
        { text: { th: "หัวพอต 0.4 โอห์ม", en: "0.4Ω pod", zh: "0.4Ω 烟弹" }, specKey: "pod-resistance" },
      ],
    },
    "airflow": {
      title: { th: "ปรับลมได้สองแบบ", en: "Airflow, two ways", zh: "两种气流调节" },
      subline: { th: "ตั้งแต่ MTL ถึง RDL สูบลื่นทุกระดับ", en: "From MTL to RDL, always smooth.", zh: "从 MTL 到 RDL，始终顺滑。" },
      body: {
        th: "ชอบสูบแน่นหรืออยากโล่งขึ้นหน่อย ก็ตั้งลมให้ตรงกับที่ชอบได้เอง",
        en: "Like it tight or a little more open? Set the airflow to match.",
        zh: "喜欢紧一点还是松一点？气流按你的喜好来调。",
      },
      points: [
        { text: { th: "กลับด้านหัวพอตเพื่อปรับลม", en: "Reverse the pod to change the airflow", zh: "烟弹可反转调节气流" }, specKey: "airflow" },
        { text: { th: "ปรับช่องลมได้ละเอียดแบบไม่มีขั้น", en: "Stepless airflow control", zh: "无级气流调节" }, specKey: "airflow" },
      ],
      link: { href: "/guides/understanding-mtl-vs-dtl", label: { th: "อ่านเรื่อง MTL กับ DTL", en: "Read: MTL vs. DTL", zh: "了解 MTL 与 DTL 的区别" } },
    },
  },
};
