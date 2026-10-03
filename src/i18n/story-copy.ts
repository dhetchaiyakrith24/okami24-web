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
        th: "ไม่ต้องชาร์จทุกวัน ใช้จริงได้กี่วันขึ้นอยู่กับการใช้งาน",
        en: "No need to charge every day; how long yours lasts depends on how you use it.",
        zh: "不用每天充电；实际能用几天取决于使用习惯。",
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
        th: "UWELL บอกว่าระบบปรับรสชาติ Pro-FOCS 4.0 คุมให้ทุกพัฟรสสมดุล",
        en: "UWELL says Pro-FOCS 4.0 keeps every puff balanced.",
        zh: "UWELL 表示，Pro-FOCS 4.0 让每一口都口感均衡。",
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
        th: "ไม่ต้องชาร์จทุกวัน ใช้จริงได้กี่วันขึ้นอยู่กับการใช้งาน",
        en: "No need to charge every day; how long yours lasts depends on how you use it.",
        zh: "不用每天充电；实际能用几天取决于使用习惯。",
      },
      points: [
        { text: { th: "ไฟ LED 4 ขีดบอกระดับแบต", en: "4-bar LED shows the battery level", zh: "4 格 LED 显示电量" }, specKey: "screen" },
      ],
    },
    "dual-tone": {
      title: { th: "ผิวทูโทน", en: "Dual-tone finish", zh: "双色拼接" },
      subline: { th: "หนังคู่กับผิวลายริ้ว", en: "Leather paired with a striped texture.", zh: "皮革搭配条纹质感。" },
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
        th: "UWELL บอกว่าระบบปรับรสชาติ Pro-FOCS 4.0 คุมให้ทุกพัฟรสสมดุล",
        en: "UWELL says Pro-FOCS 4.0 keeps every puff balanced.",
        zh: "UWELL 表示，Pro-FOCS 4.0 让每一口都口感均衡。",
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
  // Site-wide template round batch 1b (03/10): UWELL's own G4 / G4 mini / G4 Classic pages only
  // (_incoming/sitewide-template/1b/caliburn-g4*.txt + the spec images); Thai = thai-copy 03/10.
  "caliburn-g4": {
    "taste": {
      title: { th: "รสชาติมาก่อน", en: "Taste above everything", zh: "口味至上" },
      subline: { th: "หัวพอต GPP รุ่นใหม่ คู่กับ Pro-FOCS 4.0", en: "Upgraded GPP pods on PRO-FOCS 4.0.", zh: "升级版 GPP 烟弹，搭配 PRO-FOCS 4.0。" },
      body: {
        th: "UWELL บอกว่าหัวรุ่นใหม่ช่วยให้หัวพอตใช้ได้นานขึ้น ส่วนระบบปรับรสชาติช่วยให้ได้รสน้ำยาตรงตัว",
        en: "UWELL says the upgraded pods last longer and the flavour tech keeps the e-liquid's taste true.",
        zh: "UWELL 表示，升级烟弹更耐用，口感技术保留烟油原味。",
      },
      points: [
        { text: { th: "หัวพอตใช้ได้นานขึ้นสูงสุด 35% (ตัวเลขจากแล็บของ UWELL)", en: "Cartridge life up to 35% longer (UWELL lab tests)", zh: "烟弹寿命最高提升 35%（UWELL 实验室数据）" }, specKey: "flavor-tech" },
        { text: { th: "ความพอใจในรสชาติเพิ่มขึ้นสูงสุด 35% (ตัวเลขจากแล็บของ UWELL)", en: "Flavour satisfaction up to 35% higher (UWELL lab tests)", zh: "口感满意度最高提升 35%（UWELL 实验室数据）" }, specKey: "flavor-tech" },
        { text: { th: "สูงสุด 35 วัตต์", en: "Up to 35W", zh: "最高 35W" }, specKey: "output" },
      ],
    },
    "modes": {
      title: { th: "Storm หรือ Waves", en: "Storm or Waves", zh: "Storm 还是 Waves" },
      subline: { th: "สองโหมด สองแนวการสูบ", en: "Two modes, two ways to vape.", zh: "两种模式，两种抽吸风格。" },
      body: {
        th: "UWELL เปรียบว่า Storm ได้ไอเร็วทันใจเหมือนนั่งรถไฟเหาะ ส่วน Waves นุ่ม นิ่ง สม่ำเสมอ เหมือนนั่งชิงช้าสวรรค์ London Eye",
        en: "UWELL compares Storm to a roller coaster — a fast hit — and Waves to the London Eye: smooth and steady.",
        zh: "UWELL 把 Storm 比作过山车，来得快；把 Waves 比作伦敦眼，平稳顺滑。",
      },
      points: [
        { text: { th: "จอสี HD 0.85 นิ้ว", en: "0.85-inch HD colour screen", zh: "0.85 英寸高清彩屏" }, specKey: "screen" },
        { text: { th: "ธีมหน้าจอตอนเปิด-ปิด สลับโหมด สูบ ชาร์จ และกลางวัน/กลางคืน", en: "Themed screen UI: on/off, mode, puffs, day/night, charging", zh: "主题界面：开关机、模式、口数、日/夜、充电" }, specKey: "screen" },
      ],
    },
    "button": {
      title: { th: "ปุ่มเดียวคุมทั้งเครื่อง", en: "One button for everything", zh: "一键搞定" },
      subline: { th: "กด 1 ถึง 5 ครั้ง", en: "Count the clicks.", zh: "按几下，做什么。" },
      body: {
        th: "ทุกคำสั่งอยู่บนปุ่มเดียว จำแค่ว่ากดกี่ครั้ง",
        en: "Every command lives on one button — just remember how many clicks.",
        zh: "所有操作都在一个按键上，记住按几下就行。",
      },
      points: [
        { text: { th: "กด 1 ครั้ง: เปิดจอ", en: "1 click: light up the screen", zh: "按 1 下：亮屏" }, specKey: "control" },
        { text: { th: "กด 2 ครั้ง: ล็อก/ปลดล็อกปุ่มยิง", en: "2 clicks: lock/unlock button firing", zh: "按 2 下：锁定/解锁按键点火" }, specKey: "control" },
        { text: { th: "กด 3 ครั้ง: ปรับวัตต์", en: "3 clicks: adjust wattage", zh: "按 3 下：调节功率" }, specKey: "control" },
        { text: { th: "กด 4 ครั้ง: เข้าเมนู", en: "4 clicks: menu", zh: "按 4 下：进入菜单" }, specKey: "control" },
        { text: { th: "กด 5 ครั้ง: เปิด/ปิดเครื่อง", en: "5 clicks: on/off", zh: "按 5 下：开关机" }, specKey: "control" },
      ],
    },
    "airflow": {
      title: { th: "ปรับลมแบบที่ชอบ", en: "Airflow your way", zh: "气流随你调" },
      subline: { th: "ปรับได้สามแบบ", en: "Three ways to set the draw.", zh: "三种方式调节吸阻。" },
      body: {
        th: "ชอบสูบแน่นหรืออยากโล่งขึ้นหน่อย ใช้ทีละอย่างหรือใช้สองอย่างพร้อมกันก็ได้",
        en: "Like it tight or a little more open? Use one way at a time, or both together.",
        zh: "喜欢紧一点还是松一点？可单独使用，也可两者结合。",
      },
      points: [
        { text: { th: "ปุ่มเลื่อนปรับลม", en: "Airflow slider", zh: "气流滑块" }, specKey: "airflow" },
        { text: { th: "กลับด้านหัวพอตเพื่อปรับลม", en: "Reversible pod", zh: "烟弹可反向安装" }, specKey: "airflow" },
      ],
      link: { href: "/guides/understanding-mtl-vs-dtl", label: { th: "อ่านเรื่อง MTL กับ DTL", en: "Read: MTL vs. DTL", zh: "了解 MTL 与 DTL 的区别" } },
    },
    "pods": {
      title: { th: "ใช้หัว GPP ได้ทุกหัว", en: "Takes every GPP pod", zh: "兼容所有 GPP 烟弹" },
      subline: { th: "ทั้งหัวรุ่นก่อนและหัวรุ่นใหม่", en: "Old GPP pods and the upgraded ones.", zh: "旧款与升级款 GPP 烟弹都能用。" },
      body: {
        th: "หัวรุ่นใหม่ใส่กับ Caliburn สาย G3 ได้ด้วย และปากดูดปรับทรงใหม่ให้รับกับริมฝีปาก",
        en: "The upgraded pods also fit the G3 series, and their mouthpiece is reshaped to sit better on the lips.",
        zh: "升级款烟弹也适用于 G3 系列，烟嘴重新设计，含着更贴合。",
      },
      points: [
        { text: { th: "หัวรุ่นใหม่เติมน้ำยาได้ขณะหัวเสียบอยู่", en: "Upgraded pods refill while still in place", zh: "升级款烟弹无需取下即可注油" }, specKey: "pod-compat" },
      ],
      link: { href: "/products/coil-94", label: { th: "ดูหัวพอต GPP ที่ใช้กับ G4", en: "See the GPP pods for the G4", zh: "查看 GPP 烟弹" } },
    },
    "anti-leak": {
      title: { th: "ระบบกันรั่ว U²", en: "U² anti-leak", zh: "U² 防漏" },
      subline: { th: "สองเทคนิคบนหัวพอต GPP", en: "Two techniques on the GPP pod.", zh: "GPP 烟弹上的两项工艺。" },
      body: {
        th: "ตัวหัวเชื่อมด้วยคลื่นอัลตราโซนิกให้รั่วซึมยากขึ้น ส่วนร่องรูปตัว U ช่วยให้ลมเดินดีขึ้น",
        en: "The pod is ultrasonically welded so it leaks less, and a U-shaped channel helps the air flow.",
        zh: "烟弹采用超声波焊接，更不易渗漏；U 形通道让气流更顺。",
      },
      points: [
        { text: { th: "เชื่อมด้วยคลื่นอัลตราโซนิก", en: "Ultrasonic welding", zh: "超声波焊接" }, specKey: "anti-leak" },
        { text: { th: "ร่องรูปตัว U", en: "U-shaped channel", zh: "U 形通道" }, specKey: "anti-leak" },
      ],
    },
  },
  "caliburn-g4-mini": {
    "minimal": {
      title: { th: "ดีไซน์เรียบ", en: "Minimal design", zh: "极简设计" },
      subline: { th: "หยิบแล้วไปได้เลย", en: "Grab it. Own it.", zh: "拿起就走。" },
      body: {
        th: "ตัวเครื่องทรงเพรียว เส้นสายเรียบ ถือแล้วพอดีมือ",
        en: "A slim body with clean lines that sits well in the hand.",
        zh: "机身纤细，线条简洁，握感贴合。",
      },
      points: [
        { text: { th: "ประมาณ 46 กรัม", en: "Approx. 46 g", zh: "约 46 克" }, specKey: "weight" },
      ],
    },
    "taste": {
      title: { th: "รสชาติดี", en: "Awesome taste", zh: "口感出众" },
      subline: { th: "ค่อย ๆ ละเลียดทุกพัฟ", en: "Savour every puff.", zh: "细品每一口。" },
      body: {
        th: "UWELL บอกว่าระบบปรับรสชาติ Pro-FOCS 4.0 เก็บรสของน้ำยาไว้ได้ตรงตัว",
        en: "UWELL says PRO-FOCS 4.0 keeps your e-liquid's taste true.",
        zh: "UWELL 表示 PRO-FOCS 4.0 能保留烟油原本的味道。",
      },
      points: [
        { text: { th: "ความพอใจในรสชาติเพิ่มขึ้นสูงสุด 35% (ตัวเลขจากแล็บของ UWELL)", en: "Flavour satisfaction up to 35% higher (UWELL lab tests)", zh: "口感满意度最高提升 35%（UWELL 实验室数据）" }, specKey: "flavor-tech" },
        { text: { th: "หัวพอตใช้ได้นานขึ้นสูงสุด 35% (ตัวเลขจากแล็บของ UWELL)", en: "Cartridge life up to 35% longer (UWELL lab tests)", zh: "烟弹寿命最高提升 35%（UWELL 实验室数据）" }, specKey: "flavor-tech" },
        { text: { th: "สูงสุด 35 วัตต์", en: "Up to 35W", zh: "最高 35W" }, specKey: "output" },
        { text: { th: "สูบได้เลยโดยไม่ต้องกดปุ่ม", en: "Auto draw", zh: "吸气自动启动" }, specKey: "firing" },
      ],
    },
    "airflow": {
      title: { th: "ปรับลมแบบที่ชอบ", en: "Airflow your way", zh: "气流随你调" },
      subline: { th: "ปรับได้สามแบบ", en: "Three ways to set the draw.", zh: "三种方式调节吸阻。" },
      body: {
        th: "ชอบสูบแน่นหรืออยากโล่งขึ้นหน่อย ใช้ทีละอย่างหรือใช้สองอย่างพร้อมกันก็ได้",
        en: "Like it tight or a little more open? Use one way at a time, or both together.",
        zh: "喜欢紧一点还是松一点？可单独使用，也可两者结合。",
      },
      points: [
        { text: { th: "ปุ่มเลื่อนปรับลม", en: "Airflow slider", zh: "气流滑块" }, specKey: "airflow" },
        { text: { th: "กลับด้านหัวพอตเพื่อปรับลม", en: "Reversible pod", zh: "烟弹可反向安装" }, specKey: "airflow" },
      ],
      link: { href: "/guides/understanding-mtl-vs-dtl", label: { th: "อ่านเรื่อง MTL กับ DTL", en: "Read: MTL vs. DTL", zh: "了解 MTL 与 DTL 的区别" } },
    },
    "pods": {
      title: { th: "ใช้หัว GPP ได้ทุกหัว", en: "Takes every GPP pod", zh: "兼容所有 GPP 烟弹" },
      subline: { th: "ทั้งหัวรุ่นก่อนและหัวรุ่นใหม่", en: "Old GPP pods and the upgraded ones.", zh: "旧款与升级款 GPP 烟弹都能用。" },
      body: {
        th: "หัวรุ่นใหม่ใส่กับ Caliburn สาย G3 ได้ด้วย และปากดูดปรับทรงใหม่ให้รับกับริมฝีปาก",
        en: "The upgraded pods also fit the G3 series, and their mouthpiece is reshaped to sit better on the lips.",
        zh: "升级款烟弹也适用于 G3 系列，烟嘴重新设计，含着更贴合。",
      },
      points: [
        { text: { th: "หัวรุ่นใหม่เติมน้ำยาได้ขณะหัวเสียบอยู่", en: "Upgraded pods refill while still in place", zh: "升级款烟弹无需取下即可注油" }, specKey: "pod-compat" },
      ],
      link: { href: "/products/coil-94", label: { th: "ดูหัวพอต GPP ที่ใช้กับ G4 mini", en: "See the GPP pods for the G4 mini", zh: "查看 GPP 烟弹" } },
    },
    "anti-leak": {
      title: { th: "ระบบกันรั่ว U²", en: "U² anti-leak", zh: "U² 防漏" },
      subline: { th: "สองเทคนิคบนหัวพอต GPP", en: "Two techniques on the GPP pod.", zh: "GPP 烟弹上的两项工艺。" },
      body: {
        th: "ตัวหัวเชื่อมด้วยคลื่นอัลตราโซนิกให้รั่วซึมยากขึ้น ส่วนร่องรูปตัว U ช่วยให้ลมเดินดีขึ้น",
        en: "The pod is ultrasonically welded so it leaks less, and a U-shaped channel helps the air flow.",
        zh: "烟弹采用超声波焊接，更不易渗漏；U 形通道让气流更顺。",
      },
      points: [
        { text: { th: "เชื่อมด้วยคลื่นอัลตราโซนิก", en: "Ultrasonic welding", zh: "超声波焊接" }, specKey: "anti-leak" },
        { text: { th: "ร่องรูปตัว U", en: "U-shaped channel", zh: "U 形通道" }, specKey: "anti-leak" },
      ],
    },
  },
  "caliburn-g4-classic": {
    "craft": {
      title: { th: "เก็บงานแบบคลาสสิก", en: "Crafted the classic way", zh: "经典工艺" },
      subline: { th: "ฝีมือที่ UWELL สั่งสมมา 10 ปี", en: "A decade of UWELL craftsmanship.", zh: "UWELL 十年匠心。" },
      body: {
        th: "เก็บงานด้วย CNC ละเอียดหลายขั้นจนผิวเรียบแบบเซอร์โคเนีย ตัวเครื่องชิ้นเดียวทรงโค้ง จับแล้วเนียนมือ",
        en: "Finished in many fine CNC steps to a zirconia-smooth surface; the one-piece curved body feels smooth in the hand.",
        zh: "多道精细 CNC 工序打磨出锆石般顺滑的表面，一体式弧形机身，手感细腻。",
      },
    },
    "twin-sensor": {
      title: { th: "เซ็นเซอร์คู่", en: "Twin sensors", zh: "双传感器" },
      subline: { th: "ตัวหลักกับตัวสำรอง ทำงานพร้อมกัน", en: "A main sensor and a backup, in sync.", zh: "主传感器与备用传感器同步工作。" },
      body: {
        th: "สองตัวช่วยกันจับจังหวะที่ดูด UWELL บอกว่าจับได้ทุกพัฟ",
        en: "The two work together to catch the draw — UWELL says every puff.",
        zh: "两个传感器协同捕捉吸气，UWELL 表示每一口都能捕捉到。",
      },
      points: [
        { text: { th: "อายุการใช้งานระบบสูบได้เลย 300%+ (ตัวเลขจากแล็บของ UWELL)", en: "Auto-draw lifespan 300%+ (UWELL lab tests)", zh: "自动吸气寿命 300%+（UWELL 实验室数据）" }, specKey: "firing" },
        { text: { th: "ความแม่นยำในการยิง 99.999%+ (ตัวเลขจากแล็บของ UWELL)", en: "Trigger accuracy 99.999%+ (UWELL lab tests)", zh: "触发准确率 99.999%+（UWELL 实验室数据）" }, specKey: "firing" },
      ],
    },
    "rgb-light": {
      title: { th: "ไฟไล่สีตามจังหวะสูบ", en: "Light that follows your puff", zh: "随吸气流动的灯光" },
      subline: { th: "ไฟ RGB เล็ก ๆ 14 ดวง", en: "14 mini RGB LEDs.", zh: "14 颗迷你 RGB LED。" },
      body: {
        th: "แสงไล่สีที่ฐานเครื่องชวนนึกถึงไฟของบุหรี่ไฟฟ้ายุคคลาสสิก แต่ดูทันสมัยขึ้น",
        en: "The base glows in shifting colours as you puff — the glow of classic e-cigarettes, with a modern twist.",
        zh: "吸烟时底部灯光渐变流动，重现经典电子烟的光芒，并加入现代感。",
      },
      points: [
        { text: { th: "ไฟบอกแบต: เขียว เหลือมาก · ฟ้า ปานกลาง · แดง เหลือน้อย", en: "Green: battery high · Blue: medium · Red: low", zh: "绿色：电量高 · 蓝色：中 · 红色：低" }, specKey: "screen" },
        { text: { th: "กด 5 ครั้ง: เปิด/ปิดเครื่อง", en: "5 clicks: on/off", zh: "按 5 下：开关机" }, specKey: "control" },
        { text: { th: "กด 2 ครั้ง: ล็อก/ปลดล็อกปุ่มยิง", en: "2 clicks: lock/unlock the button", zh: "按 2 下：锁定/解锁按键" }, specKey: "control" },
        { text: { th: "กด 1 ครั้ง: ยิง / ดูระดับแบต", en: "1 click: fire / show the battery", zh: "按 1 下：启动 / 显示电量" }, specKey: "control" },
      ],
    },
    "dual-control": {
      title: { th: "ปรับลมสองแบบ ยิงสองแบบ", en: "Two ways for air, two ways to fire", zh: "双气流、双启动" },
      subline: { th: "ตั้งให้เข้ากับแนวการสูบของตัวเอง", en: "Set it the way you vape.", zh: "按你的习惯来设置。" },
      body: {
        th: "จะสูบแน่นหรือโล่ง จะกดปุ่มหรือแค่ดูด เลือกได้ตามที่ถนัด",
        en: "Tight or open, button or just a draw — set it the way you like.",
        zh: "紧或松，按键或直接吸，按你的习惯来。",
      },
      points: [
        { text: { th: "ปรับช่องลมได้ละเอียดแบบไม่มีขั้น", en: "Stepless airflow control", zh: "无级气流调节" }, specKey: "airflow" },
        { text: { th: "กลับด้านหัวพอตเพื่อปรับลม", en: "Reversible pod", zh: "烟弹可反向安装" }, specKey: "airflow" },
        { text: { th: "กดปุ่มเบา ๆ ก็ยิง (แรงกดประมาณ 255gf)", en: "A light press fires it (approx. 255gf)", zh: "轻按即可启动（压力约 255gf）" }, specKey: "firing" },
        { text: { th: "หรือสูบได้เลยโดยไม่ต้องกดปุ่ม", en: "Or just draw", zh: "也可吸气启动" }, specKey: "firing" },
      ],
      link: { href: "/guides/understanding-mtl-vs-dtl", label: { th: "อ่านเรื่อง MTL กับ DTL", en: "Read: MTL vs. DTL", zh: "了解 MTL 与 DTL 的区别" } },
    },
    "pods": {
      title: { th: "ใช้หัวพอต GPP", en: "Takes GPP pods", zh: "兼容 GPP 烟弹" },
      subline: { th: "เติมน้ำยาได้ขณะหัวเสียบอยู่", en: "Refill without taking the pod out.", zh: "无需取下烟弹即可注油。" },
      body: {
        th: "มีช่องใสให้เห็นน้ำยาที่เหลือ จะได้เติมทันก่อนหมด",
        en: "A clear window shows the e-liquid left, so you refill in time.",
        zh: "透明视窗显示余量，及时补充。",
      },
      link: { href: "/products/coil-94", label: { th: "ดูหัวพอต GPP ที่ใช้กับ G4 Classic", en: "See the GPP pods for the G4 Classic", zh: "查看 GPP 烟弹" } },
    },
    "pro-focs": {
      title: { th: "Pro-FOCS 4.0", en: "PRO-FOCS 4.0", zh: "PRO-FOCS 4.0" },
      subline: { th: "ระบบปรับรสชาติของ UWELL", en: "UWELL's flavour technology.", zh: "UWELL 口感技术。" },
      body: {
        th: "ใช้คู่กับระบบกันรั่ว U² ตัวหนึ่งดูแลเรื่องรส อีกตัวช่วยให้น้ำยารั่วซึมยากขึ้น",
        en: "Paired with U² anti-leak — one looks after the taste, the other makes leaks less likely.",
        zh: "搭配 U² 防漏：一个负责口味，一个让烟油更不易渗漏。",
      },
      points: [
        { text: { th: "ระบบกันรั่ว U²", en: "U² anti-leak", zh: "U² 防漏" }, specKey: "anti-leak" },
      ],
    },
  },
};
