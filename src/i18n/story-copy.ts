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
  // Site-wide template round batch 1c (03/10): UWELL's own G4 Pro / G4 Pro KOKO pages, posters and page films only
  // (_incoming/sitewide-template/1c/copy-en.md lists the source of each line); Thai = thai-copy 03/10.
  "caliburn-g4-pro": {
    "one-tap": {
      title: { th: "แตะครั้งเดียวก็ปรับได้", en: "One tap does it", zh: "轻点即可调节" },
      subline: { th: "เครื่องจอทัชรุ่นแรกของ UWELL", en: "UWELL's first smart touchscreen.", zh: "UWELL 首款智能触屏。" },
      body: {
        th: "คำสั่งหลักอยู่บนจอให้เห็นเลย ไม่ต้องจำวิธีกด",
        en: "The core functions sit on the screen itself, so there are no instructions to memorise.",
        zh: "核心功能都在屏幕上，不用再记操作说明。",
      },
      captions: [
        { th: "ปรับวัตต์", en: "Adjust wattage", zh: "调节功率" },
        { th: "สลับโหมด", en: "Switch output modes", zh: "切换输出模式" },
        { th: "รีเซ็ตตัวนับพัฟ", en: "Reset puff counter", zh: "口数清零" },
      ],
      points: [
        { text: { th: "แตะแม่นยำมากกว่า 99.99% (ตัวเลขจากแล็บของ UWELL)", en: "Touch accuracy above 99.99% (UWELL LAB)", zh: "触控准确率 99.99% 以上（UWELL 实验室数据）" }, specKey: "touch" },
        { text: { th: "ตอบสนองภายใน 0.2 วินาที (ตัวเลขจากแล็บของ UWELL)", en: "Responds in under 0.2s (UWELL LAB)", zh: "响应时间不到 0.2 秒（UWELL 实验室数据）" }, specKey: "touch" },
      ],
      link: { href: "/technology/onboard-touch-displays", label: { th: "อ่านเรื่องพอตจอทัช", en: "How touchscreen pods work", zh: "了解触屏烟具" } },
    },
    "themes": {
      title: { th: "ธีมหน้าจอ 6 แบบ", en: "Six screen themes", zh: "六款屏幕主题" },
      subline: { th: "ใช้ได้เลยครึ่งหนึ่ง อีกครึ่งต้องปลดล็อก", en: "Half ready to use, half to unlock.", zh: "一半直接可用，一半等你解锁。" },
      body: {
        th: "UWELL อยากให้การสูบพอตเหมือนเล่นเกมอัปเลเวล ใช้ไปเรื่อย ๆ จอก็มีของใหม่ให้เปิด",
        en: "UWELL wants vaping to feel like levelling up: keep using it and the screen has something new to open.",
        zh: "UWELL 想让抽烟像打怪升级：一直用下去，屏幕就有新内容可解锁。",
      },
      points: [
        { text: { th: "3 ธีมพร้อมใช้ แต่ละธีมมีแอนิเมชันตอนสูบเข้าชุดกัน", en: "3 themes from day one, each with its own vaping animation", zh: "3 款主题开箱即用，各配专属抽吸动画" }, specKey: "themes" },
        { text: { th: "อีก 3 ธีมซ่อนอยู่ ปลดล็อกเมื่อครบ 5,000 10,000 และ 20,000 พัฟ", en: "3 hidden themes open at 5,000, 10,000 and 20,000 puffs", zh: "3 款隐藏主题在 5,000、10,000、20,000 口时解锁" }, specKey: "themes" },
      ],
    },
    "settings": {
      title: { th: "เมนูตั้งค่า", en: "Settings menu", zh: "设置菜单" },
      subline: { th: "ปัดจอลงก็เจอ", en: "Swipe down the screen.", zh: "下滑屏幕即可。" },
      body: {
        th: "UWELL รวมการตั้งค่าที่เหลือไว้ในเมนูนี้ที่เดียว",
        en: "UWELL keeps the rest of the settings in this one menu.",
        zh: "UWELL 把其余设置都放在这一个菜单里。",
      },
      points: [
        { text: { th: "เลือกได้ 8 ภาษา (ไม่มีภาษาไทย)", en: "8 languages (no Thai)", zh: "8 种语言（不含泰语）" }, specKey: "settings" },
        { text: { th: "ตั้งชื่อเครื่องเองผ่าน Clean UI", en: "Rename the device with Clean UI", zh: "开启 Clean UI 可为设备改名" }, specKey: "settings" },
        { text: { th: "ปรับความสว่าง เวลาปิดจอ เปิด/ปิดแอนิเมชัน และโหมดประหยัดแบต", en: "Brightness, screen timeout, animations, battery saver", zh: "亮度、息屏时间、动画、省电模式" }, specKey: "settings" },
      ],
    },
    "custom-mode": {
      title: { th: "โหมด Custom", en: "Custom mode", zh: "自定义模式" },
      subline: { th: "Storm กับ Waves ก็ยังมี", en: "Storm and Waves are still there.", zh: "Storm 和 Waves 依然都在。" },
      body: {
        th: "Storm แรงถึงคอทันที Waves รสนุ่มลื่น ส่วนโหมดนี้ให้ตั้งเองว่าชอบแบบไหน",
        en: "Storm gives an instant throat hit, Waves a smooth flavour. This one you tune yourself.",
        zh: "Storm 带来即时击喉感，Waves 口感顺滑，这个模式由你自己调。",
      },
      points: [
        { text: { th: "ตั้งวัตต์แยกกันได้ ช่วงต้น กลาง และท้ายของแต่ละพัฟ", en: "Set the power at the start, middle and end of each puff", zh: "每一口的开头、中段、结尾都能设定功率" }, specKey: "modes" },
      ],
    },
    "battery": {
      title: { th: "ไม่ต้องชาร์จบ่อย", en: "Charge less often", zh: "少充几次电" },
      subline: { th: "แบตใหญ่กว่า G4 รุ่นมาตรฐาน", en: "A bigger battery than the standard G4.", zh: "电池比标准版 G4 更大。" },
      body: {
        th: "ใช้จริงได้กี่วันขึ้นอยู่กับว่าสูบบ่อยแค่ไหนและตั้งกี่วัตต์",
        en: "How long yours lasts depends on how often you vape and the wattage you set.",
        zh: "实际能用几天，取决于抽吸频率和设定的功率。",
      },
      points: [
        { text: { th: "แบต 1800mAh ในตัว", en: "1800mAh built-in battery", zh: "内置 1800mAh 电池" }, specKey: "battery" },
        { text: { th: "ใช้ได้สูงสุด 7 วัน (ตัวเลขของ UWELL)", en: "Up to 7 days of use (UWELL's figure)", zh: "最长使用 7 天（UWELL 数据）" }, specKey: "battery-life" },
        { text: { th: "ชาร์จผ่าน USB-C 5V/2.5A", en: "USB-C, 5V/2.5A charging", zh: "USB-C 充电，5V/2.5A" }, specKey: "charge-time" },
      ],
    },
    "pods": {
      title: { th: "ใช้หัว GPP ได้ทุกหัว", en: "Takes every GPP pod", zh: "兼容所有 GPP 烟弹" },
      subline: { th: "ทั้งหัวรุ่นก่อนและหัวรุ่นใหม่", en: "Previous and upgraded.", zh: "旧款与升级款都能用。" },
      body: {
        th: "หัวรุ่นใหม่ใส่กับ Caliburn สาย G3 ได้ด้วย และเติมน้ำยาได้โดยไม่ต้องถอดหัวออก",
        en: "The upgraded pods fit the G3 series too, and you refill without taking the pod out.",
        zh: "升级款烟弹也适用于 G3 系列，注油无需取下烟弹。",
      },
      points: [
        { text: { th: "หัวเติมด้านบนและด้านข้าง 0.4–1.2 โอห์ม", en: "Top- and side-refill pods from 0.4Ω to 1.2Ω", zh: "顶部与侧边注油烟弹，0.4Ω 至 1.2Ω" }, specKey: "pod-compat" },
        { text: { th: "ระบบกันรั่ว U²", en: "U² anti-leak", zh: "U² 防漏" }, specKey: "anti-leak" },
        { text: { th: "ปากดูดโค้งรับริมฝีปาก", en: "Contoured mouthpiece", zh: "贴合唇形的烟嘴" } },
      ],
      link: { href: "/products/coil-94", label: { th: "ดูหัวพอต GPP ที่ใช้กับ G4 Pro", en: "See the GPP pods for the G4 Pro", zh: "查看 GPP 烟弹" } },
    },
  },
  "caliburn-g4-pro-koko": {
    "blind-draw": {
      title: { th: "ธีมหน้าจอแบบสุ่ม", en: "Blind-draw themes", zh: "盲抽主题" },
      subline: { th: "ไม่รู้ว่าจะได้ธีมไหน จนกว่าจะเปิด", en: "You don't know which one you get until it opens.", zh: "打开之前，不知道会抽到哪款。" },
      body: {
        th: "ธีมได้มาจากเกมสุ่มการ์ดของ UWELL เก็บสะสมไปเรื่อย ๆ ก็สนุกอีกแบบ",
        en: "The themes come from UWELL's blind-draw card game — collecting them is fun of its own.",
        zh: "主题来自 UWELL 的盲抽卡牌游戏，收集本身就是一种乐趣。",
      },
      points: [
        { text: { th: "ธีมหน้าจอ 5 แบบ", en: "5 screen themes", zh: "5 款屏幕主题" }, specKey: "themes" },
      ],
    },
    "one-tap": {
      title: { th: "คำสั่งหลักอยู่ในแตะเดียว", en: "Core features in one tap", zh: "核心功能，一触即达" },
      subline: { th: "KOKO รุ่นแรกที่มีจอทัช", en: "The first KOKO with a touchscreen.", zh: "首款带触屏的 KOKO。" },
      body: {
        th: "UWELL ออกแบบจอนี้ให้คนสูบพอตโดยเฉพาะ หน้าจอโล่งสะอาดตา ใช้งานง่าย",
        en: "UWELL built this screen for vapers: uncluttered and intuitive.",
        zh: "UWELL 专为烟友打造这块屏幕：界面简洁，操作直观。",
      },
      points: [
        { text: { th: "แตะแม่นยำมากกว่า 99.99% (ตัวเลขจากแล็บของ UWELL)", en: "Touch accuracy above 99.99% (UWELL LAB)", zh: "触控准确率 99.99% 以上（UWELL 实验室数据）" }, specKey: "touch" },
        { text: { th: "ตอบสนองภายใน 0.2 วินาที (ตัวเลขจากแล็บของ UWELL)", en: "Responds in under 0.2s (UWELL LAB)", zh: "响应时间不到 0.2 秒（UWELL 实验室数据）" }, specKey: "touch" },
      ],
      link: { href: "/technology/onboard-touch-displays", label: { th: "อ่านเรื่องพอตจอทัช", en: "How touchscreen pods work", zh: "了解触屏烟具" } },
    },
    "screen": {
      title: { th: "จอทัช 2.0 นิ้ว", en: "2.0-inch touchscreen", zh: "2.0 英寸触屏" },
      subline: { th: "จับแล้วถนัดมือ", en: "Comfortable in the hand.", zh: "握感舒适。" },
      body: {
        th: "ขอบจอบาง ตัวเครื่องโค้งรับมือ ถือแล้วกระชับ",
        en: "Minimal bezels and an ergonomic curve that sits snugly in the hand.",
        zh: "窄边框加人体工学曲线，握在手里很贴合。",
      },
      points: [
        { text: { th: "ประมาณ 93 กรัม", en: "Approx. 93g", zh: "约 93g" }, specKey: "weight" },
      ],
    },
    "battery": {
      title: { th: "แบตอึด", en: "Long battery life", zh: "续航持久" },
      subline: { th: "ความจุ 2000mAh", en: "2000mAh.", zh: "2000mAh。" },
      body: {
        th: "ชาร์จเต็มครั้งเดียว ใช้ได้สูงสุด 10 วัน (ตัวเลขจากแล็บของ UWELL)",
        en: "One full charge lasts up to 10 days (UWELL lab tests).",
        zh: "充满一次最长可用 10 天（UWELL 实验室数据）。",
      },
      points: [
        { text: { th: "ชาร์จผ่าน USB-C 5V/2.5A", en: "USB-C, 5V/2.5A charging", zh: "USB-C 充电，5V/2.5A" }, specKey: "charge-time" },
      ],
    },
    "naming": {
      title: { th: "ตั้งชื่อให้เครื่อง", en: "Name your device", zh: "给设备起名" },
      subline: { th: "มุกวงในหรือชื่อเท่ ๆ ก็ตั้งได้", en: "From inside jokes to iconic names.", zh: "从小梗到经典名字都行。" },
      body: {
        th: "เปิด Clean UI แล้วพิมพ์ชื่อบนจอได้เลย การตั้งค่าอื่นอยู่ในเมนูเดียวกัน",
        en: "Switch on Clean UI and type the name on the screen; the other settings sit in the same menu.",
        zh: "开启 Clean UI，直接在屏幕上输入名字；其他设置也在同一菜单里。",
      },
      points: [
        { text: { th: "เลือกได้ 8 ภาษา (ไม่มีภาษาไทย)", en: "8 languages (no Thai)", zh: "8 种语言（不含泰语）" }, specKey: "settings" },
        { text: { th: "ปรับความสว่างและเวลาปิดจอ", en: "Brightness and screen timeout", zh: "亮度与息屏时间" }, specKey: "settings" },
        { text: { th: "เปิด/ปิดแอนิเมชัน โหมดประหยัดแบต และรีเซ็ตเครื่อง", en: "Animation, battery saver and system reset", zh: "动画、省电模式与系统重置" }, specKey: "settings" },
      ],
    },
    "modes": {
      title: { th: "เลือกได้ 3 โหมด", en: "Three modes", zh: "三种模式" },
      subline: { th: "Storm, Waves และ Customize", en: "Storm, Waves and Customize.", zh: "Storm、Waves 与 Customize。" },
      body: {
        th: "Storm แรงถึงคอทันที Waves รสนุ่มและนิ่ง ส่วน Customize ตั้งเองตามที่ชอบ",
        en: "Storm for an instant throat hit, Waves for a smooth, steady taste, Customize set the way you like.",
        zh: "Storm 即时击喉，Waves 口感顺滑稳定，Customize 按你喜欢的来设定。",
      },
      points: [
        { text: { th: "ตั้งวัตต์แยกกันได้ ช่วงต้น กลาง และท้ายของแต่ละพัฟ", en: "Set the power at the start, middle and end of each puff", zh: "每一口的开头、中段、结尾都能设定功率" }, specKey: "modes" },
      ],
    },
    "pods": {
      title: { th: "ใช้หัว GPP ได้ทุกหัว", en: "Takes every GPP pod", zh: "兼容所有 GPP 烟弹" },
      subline: { th: "ทั้งหัวรุ่นก่อนและหัวรุ่นใหม่", en: "Previous and upgraded.", zh: "旧款与升级款都能用。" },
      body: {
        th: "หัวรุ่นใหม่ใส่กับ Caliburn สาย G3 ได้ด้วย และเติมน้ำยาได้โดยไม่ต้องถอดหัวออก",
        en: "The upgraded pods fit the G3 series too, and you refill without taking the pod out.",
        zh: "升级款烟弹也适用于 G3 系列，注油无需取下烟弹。",
      },
      points: [
        { text: { th: "หัวเติมด้านบนและด้านข้าง 0.4–1.2 โอห์ม", en: "Top- and side-refill pods from 0.4Ω to 1.2Ω", zh: "顶部与侧边注油烟弹，0.4Ω 至 1.2Ω" }, specKey: "pod-compat" },
        { text: { th: "ระบบกันรั่ว U²", en: "U² anti-leak", zh: "U² 防漏" }, specKey: "anti-leak" },
        { text: { th: "ปากดูดโค้งรับริมฝีปาก", en: "Contoured mouthpiece", zh: "贴合唇形的烟嘴" } },
      ],
      link: { href: "/products/coil-94", label: { th: "ดูหัวพอต GPP ที่ใช้กับ G4 Pro KOKO", en: "See the GPP pods for the KOKO", zh: "查看 GPP 烟弹" } },
    },
  },
  // Site-wide template round batch 1d (04/10): UWELL's own G3 Pro / G3 Pro KOKO pages, posters, spec sheet and user manual
  // (_incoming/sitewide-template/1d/facts-uwell.md lists the source of each line); Thai = thai-copy 04/10.
  "caliburn-g3-pro": {
    "full-screen": {
      title: { th: "จอเต็มหน้าเครื่อง", en: "The whole front is a screen", zh: "整个正面都是屏幕" },
      subline: { th: "UWELL บอกว่าเป็นพอตรุ่นแรกที่ทำแบบนี้", en: "UWELL calls it the first full-screen pod.", zh: "UWELL 称它为首款全屏烟具。" },
      body: {
        th: "เหลือบมองทีเดียวก็รู้ทั้งวัตต์ แบต และจำนวนพัฟ",
        en: "Wattage, battery and your puff count are there at a glance, no window to squint at.",
        zh: "功率、电量和口数一眼就能看到，不用凑近小窗口。",
      },
      points: [
        { text: { th: "แบตแสดงเป็น 4 ขีด", en: "Battery shown in 4 bars", zh: "电量以 4 格显示" }, specKey: "screen" },
        { text: { th: "นับพัฟได้ถึง 999 แล้วเริ่มนับใหม่", en: "Puff counter up to 999, then it starts again", zh: "口数最多记到 999，之后重新计数" }, specKey: "screen" },
      ],
    },
    "power": {
      title: { th: "ตั้งวัตต์ตามหัวพอต", en: "Power to suit the pod", zh: "按烟弹设定功率" },
      subline: { th: "หัวแต่ละโอห์มตั้งได้คนละช่วง", en: "Each pod has its own range.", zh: "每种烟弹的范围不同。" },
      body: {
        th: "กดปุ่ม 3 ครั้งแล้วเลือกวัตต์",
        en: "Press the button three times, then pick the wattage.",
        zh: "连按三下按键即可选择功率。",
      },
      points: [
        { text: { th: "หัว 0.4 โอห์ม ตั้งได้ 5–35 วัตต์", en: "0.4Ω pod: 5–35W", zh: "0.4Ω 烟弹：5–35W" }, specKey: "output" },
        { text: { th: "หัว 0.6 โอห์ม ตั้งได้ 5–25 วัตต์", en: "0.6Ω pod: 5–25W", zh: "0.6Ω 烟弹：5–25W" }, specKey: "output" },
        { text: { th: "หัว 0.9 โอห์ม ตั้งได้ 5–15 วัตต์", en: "0.9Ω pod: 5–15W", zh: "0.9Ω 烟弹：5–15W" }, specKey: "output" },
      ],
    },
    "airflow": {
      title: { th: "ปรับลมได้ละเอียด", en: "Fine-tune the airflow", zh: "气流可微调" },
      subline: { th: "ครั้งแรกในตระกูล Caliburn", en: "A first for the Caliburn line.", zh: "Caliburn 系列首次加入。" },
      body: {
        th: "ค่อย ๆ ปรับวาล์วทีละนิด จนได้ความแน่นที่ชอบ",
        en: "Turn the valve a little at a time until the draw feels right to you.",
        zh: "一点点转动气流阀，直到吸感合适为止。",
      },
      points: [
        { text: { th: "วาล์วปรับลมอยู่ด้านข้าง", en: "Airflow adjustment valve on the side", zh: "侧面气流调节阀" }, specKey: "airflow" },
      ],
    },
    "modes": {
      title: { th: "สูบหรือกดก็ได้", en: "Draw or press", zh: "吸或按都能用" },
      subline: { th: "ยิงได้ 2 แบบ", en: "Two ways to fire.", zh: "两种启动方式。" },
      body: {
        th: "แกะกล่องมาใช้ได้ทั้งสองแบบ ถ้าล็อกปุ่ม เครื่องจะยิงตอนสูบอย่างเดียว",
        en: "Out of the box it fires when you draw or when you press. Lock the button and it fires on the draw only.",
        zh: "出厂时吸气或按键都能启动；锁定按键后只靠吸气启动。",
      },
      points: [
        { text: { th: "กดสองครั้งติดกัน ล็อกหรือปลดล็อกปุ่ม", en: "Press twice: lock or unlock the button", zh: "按两下：锁定或解锁按键" }, specKey: "firing" },
        { text: { th: "กด 5 ครั้ง เปิดหรือปิดเครื่อง", en: "Press five times: on or off", zh: "按五下：开机或关机" }, specKey: "firing" },
      ],
    },
    "pods": {
      title: { th: "ใช้หัวพอต G3 ได้ทุกหัว", en: "Takes every G3 pod", zh: "兼容所有 G3 烟弹" },
      subline: { th: "0.4–1.2 โอห์ม", en: "From 0.4Ω to 1.2Ω.", zh: "从 0.4Ω 到 1.2Ω。" },
      body: {
        th: "มีทั้งหัวเติมด้านบนและเติมด้านข้าง ใช้ได้ทั้งน้ำยา freebase และ salt nic",
        en: "Any Caliburn G3 pod fits, for freebase or nic salt, in top-refill or side-refill versions.",
        zh: "所有 Caliburn G3 烟弹都能用，自由基或盐都可以，有顶注油和侧注油两种。",
      },
      points: [
        { text: { th: "ในกล่องมีหัว 0.4 และ 0.9 โอห์ม คอยล์ mesh เติมด้านข้าง", en: "In the box: 0.4Ω and 0.9Ω meshed pods, side refill", zh: "盒内附 0.4Ω 和 0.9Ω 网状烟弹，侧注油" }, specKey: "included-pod" },
        { text: { th: "ระบบปรับรสชาติ Pro-FOCS", en: "Pro-FOCS flavour coil", zh: "Pro-FOCS 风味线圈" }, specKey: "flavor-tech" },
      ],
      link: { href: "/products/coil-94", label: { th: "ดูหัวพอตที่ใช้กับ G3 Pro", en: "See the G3 pods", zh: "查看 G3 烟弹" } },
    },
    "body": {
      title: { th: "ตัวเครื่องซิงค์อัลลอย", en: "Zinc alloy body", zh: "锌合金机身" },
      subline: { th: "มีช่องใสให้ดูน้ำยา", en: "With a clear e-liquid window.", zh: "带透明油窗。" },
      body: {
        th: "เหลือบมองช่องก็รู้ว่าน้ำยาเหลือแค่ไหน ถึงเวลาเติมหรือยัง",
        en: "A glance at the window tells you how much e-liquid is left and when to refill.",
        zh: "看一眼油窗就知道还剩多少烟油、该不该加油。",
      },
      points: [
        { text: { th: "ประมาณ 92 กรัม", en: "About 92g", zh: "约 92 克" }, specKey: "weight" },
        { text: { th: "123.5 × 27.8 × 16.8 mm", en: "123.5 × 27.8 × 16.8 mm", zh: "123.5 × 27.8 × 16.8 毫米" }, specKey: "dimensions" },
      ],
    },
  },
  "caliburn-g3-pro-koko": {
    "screen": {
      title: { th: "จอสีเต็มหน้าเครื่อง", en: "A full colour screen", zh: "整块彩色屏幕" },
      subline: { th: "KOKO รุ่นแรกที่ได้จอแบบนี้", en: "UWELL's first full-screen KOKO.", zh: "UWELL 首款全屏 KOKO。" },
      body: {
        th: "ทุกอย่างที่ต้องดูตอนสูบอยู่บนจอ และมีแอนิเมชันขึ้นระหว่างสูบ",
        en: "Every vaping detail is on the screen, with animations while you vape.",
        zh: "抽吸信息都在屏幕上，抽吸时还有动画。",
      },
      points: [
        { text: { th: "จอสี TFT 1.8 นิ้ว", en: "1.8-inch TFT colour screen", zh: "1.8 英寸 TFT 彩屏" }, specKey: "screen" },
      ],
    },
    "themes": {
      title: { th: "ธีมหน้าจอ", en: "Screen themes", zh: "屏幕主题" },
      subline: { th: "เลือกหน้าตาจอที่ชอบ", en: "Pick the look you like.", zh: "选你喜欢的样式。" },
      body: {
        th: "กด 4 ครั้งเพื่อเปิดเมนู แล้วเลือกจากในนั้น",
        en: "Press the button four times to open the menu, then change the theme there.",
        zh: "连按四下按键打开菜单，在里面更换主题。",
      },
      points: [
        { text: { th: "มีให้เลือก เช่น Planet, Twilight และ KOKO", en: "Themes include Planet, Twilight and KOKO", zh: "主题包括 Planet、Twilight 和 KOKO" }, specKey: "themes" },
      ],
    },
    "day-night": {
      title: { th: "DAY กับ NIGHT", en: "Day and night", zh: "日间与夜间" },
      subline: { th: "กลางวันจอสด กลางคืนแสงนุ่ม", en: "Bright by day, softer at night.", zh: "白天明亮，夜晚柔和。" },
      body: {
        th: "สลับได้ในเมนูเดียวกัน เลือกให้เข้ากับแสงรอบตัว",
        en: "DAY mode keeps the screen vivid; NIGHT mode dims the glow. Both are in the same menu.",
        zh: "DAY 模式屏幕鲜亮，NIGHT 模式亮度更柔和，都在同一个菜单里。",
      },
    },
    "battery": {
      title: { th: "ไม่ต้องชาร์จบ่อย", en: "Charge less often", zh: "不用常充电" },
      subline: { th: "แบตใหญ่กว่า G3 Pro", en: "A bigger battery than the G3 Pro.", zh: "电池比 G3 Pro 更大。" },
      body: {
        th: "ใช้จริงได้กี่วันขึ้นอยู่กับว่าสูบบ่อยแค่ไหนและตั้งกี่วัตต์",
        en: "How long yours lasts depends on how often you vape and the wattage you set.",
        zh: "实际续航取决于抽吸频率和设定的功率。",
      },
      points: [
        { text: { th: "แบต 1250mAh ในตัว", en: "1250mAh built-in", zh: "内置 1250mAh 电池" }, specKey: "battery" },
        { text: { th: "ชาร์จครั้งเดียวใช้ได้สูงสุด 4 วัน (ตัวเลขของ UWELL)", en: "Up to 4 days per charge (UWELL's figure)", zh: "一次充电最多用 4 天（UWELL 数据）" }, specKey: "battery-life" },
        { text: { th: "ชาร์จ 5V/2A 20 นาที ได้ 80% (ตัวเลขของ UWELL)", en: "80% in 20 minutes at 5V/2A (UWELL's figure)", zh: "5V/2A 下 20 分钟充到 80%（UWELL 数据）" }, specKey: "charge-time" },
      ],
    },
    "power": {
      title: { th: "ตั้งวัตต์และปรับลมได้เอง", en: "Wattage and airflow, yours to set", zh: "功率和气流都由你调" },
      subline: { th: "สูงสุด 35 วัตต์", en: "Up to 35W.", zh: "最高 35W。" },
      body: {
        th: "กด 3 ครั้งเพื่อตั้งวัตต์ ส่วนลมจะเอานุ่ม แรง หรือกลาง ๆ ก็ปรับได้",
        en: "Press three times to set the wattage, and slide the airflow from smooth to strong.",
        zh: "连按三下设定功率，气流从顺滑到强劲随手调。",
      },
      points: [
        { text: { th: "5–35 วัตต์", en: "5–35W", zh: "5–35W" }, specKey: "output" },
      ],
    },
    "anti-leak": {
      title: { th: "ออกแบบมากันรั่ว", en: "Built not to leak", zh: "防漏设计" },
      subline: { th: "ระบบ U² ของ UWELL", en: "UWELL's U² anti-leak.", zh: "UWELL U² 防漏。" },
      body: {
        th: "ตัวหัวเชื่อมด้วยคลื่นอัลตราโซนิก ส่วนร่องรูปตัว U คอยเก็บหยดน้ำยาที่ควบแน่น",
        en: "The pod is sealed by ultrasonic welding, and a U-shaped channel holds the condensate.",
        zh: "烟弹采用超声波焊接密封，U 形通道收集冷凝液。",
      },
    },
    "pods": {
      title: { th: "ใช้หัวพอต G3 ได้ทุกหัว", en: "Takes every G3 pod", zh: "兼容所有 G3 烟弹" },
      subline: { th: "0.4–1.2 โอห์ม", en: "From 0.4Ω to 1.2Ω.", zh: "从 0.4Ω 到 1.2Ω。" },
      body: {
        th: "มีทั้งหัวเติมด้านบนและเติมด้านข้าง ใช้ได้ทั้งน้ำยา freebase และ salt nic",
        en: "Any Caliburn G3 pod fits, for freebase or nic salt, in top-refill or side-refill versions.",
        zh: "所有 Caliburn G3 烟弹都能用，自由基或盐都可以，有顶注油和侧注油两种。",
      },
      points: [
        { text: { th: "ในกล่องมีหัว 0.4 โอห์ม (3mL) และ 0.9 โอห์ม (2.5mL) เติมด้านข้าง", en: "In the box: 0.4Ω (3ml) and 0.9Ω (2.5ml) pods, side refill", zh: "盒内附 0.4Ω（3ml）和 0.9Ω（2.5ml）烟弹，侧注油" }, specKey: "included-pod" },
        { text: { th: "ระบบปรับรสชาติ Pro-FOCS 3.0", en: "Pro-FOCS 3.0 flavour coil", zh: "Pro-FOCS 3.0 风味线圈" }, specKey: "flavor-tech" },
      ],
      link: { href: "/products/coil-94", label: { th: "ดูหัวพอตที่ใช้กับ G3 Pro KOKO", en: "See the G3 pods", zh: "查看 G3 烟弹" } },
    },
  },
};
