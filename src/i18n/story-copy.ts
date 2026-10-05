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
        th: "หัวพอตเชื่อมปิดด้วยคลื่นอัลตราโซนิก และมีร่องตัว U คอยรับหยดน้ำยาไว้ข้างใน",
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
  // Site-wide template round batch 2c (04/10): VOOPOO's own DRAG 6 page + posters
  // (_incoming/sitewide-template/2/facts-drag6.md lists the source of each line); Thai = thai-copy 04/10.
  "drag-6": {
    "gene-tt-3": {
      title: { th: "GENE.TT 3.0", en: "GENE.TT 3.0", zh: "GENE.TT 3.0" },
      subline: { th: "ชิปรุ่นใหม่ของ VOOPOO", en: "VOOPOO's new chip.", zh: "VOOPOO 新一代芯片。" },
      body: {
        th: "พอกดยิง เครื่องตอบสนองได้ไวขึ้น และจ่ายไฟได้นิ่งตลอดการสูบ",
        en: "Press fire and it responds faster, then holds the power steady through the whole draw.",
        zh: "按下火键响应更快，整口抽吸功率输出都很稳定。",
      },
      points: [
        { text: { th: "มีโหมด SMART RBA และ TC-TCR ให้เลือก", en: "SMART, RBA and TC-TCR modes", zh: "SMART、RBA、TC-TCR 三种模式可选" }, specKey: "modes" },
        { text: { th: "ใช้คอยล์ได้ตั้งแต่ 0.05 ถึง 3.0 โอห์ม", en: "Works with coils from 0.05 to 3.0Ω", zh: "适用 0.05–3.0Ω 线圈" }, specKey: "resistance" },
      ],
      link: { href: "/technology/high-output-chip-platforms", label: { th: "อ่านเรื่องชิปในเครื่องวัตต์สูง", en: "How high-output chips work", zh: "了解高功率芯片" } },
    },
    "battery": {
      title: { th: "แบต 4400mAh", en: "4400mAh battery", zh: "4400mAh 电池" },
      subline: { th: "แบ่งเป็นสองก้อน ก้อนละ 2200mAh", en: "Split across two 2200mAh cells.", zh: "由两颗 2200mAh 电芯组成。" },
      body: {
        th: "เวลาชาร์จ แค่เสียบสายเข้ากับตัวเครื่องได้เลย ไม่ต้องถอดถ่านออกมาชาร์จแยก",
        en: "To charge, just plug the cable into the device — no cells to take out.",
        zh: "充电时把线直接插在机身上就行，不用把电芯拆下来单独充。",
      },
      points: [
        { text: { th: "ชาร์จผ่าน USB-C 5V/3A", en: "USB-C, 5V/3A charging", zh: "USB-C 充电，5V/3A" }, specKey: "charging" },
        { text: { th: "ใช้เวลาชาร์จ 2–3 ชั่วโมง", en: "Charges in 2–3 hours", zh: "充电约需 2–3 小时" }, specKey: "charge-time" },
      ],
    },
    "screen": {
      title: { th: "จอ TFT 1.66 นิ้ว", en: "1.66-inch TFT screen", zh: "1.66 英寸 TFT 屏幕" },
      subline: { th: "เลือกหน้าตาจอได้ตามที่ชอบ", en: "Choose the look you like.", zh: "屏幕样式可按喜好选择。" },
      body: {
        th: "จอความละเอียดสูงอ่านได้ชัด เหลือบมองครั้งเดียวก็รู้ว่าตอนนี้ตั้งค่าไว้อย่างไร",
        en: "The high-resolution display reads clearly — one glance tells you how it is set.",
        zh: "高分辨率屏幕清晰易读，扫一眼就知道当前的设定。",
      },
      points: [
        { text: { th: "ธีมหน้าจอ 3 แบบ", en: "Three interface themes", zh: "3 款界面主题" }, specKey: "screen" },
        { text: { th: "แสดงวัตต์ แบต โอห์ม จำนวนพัฟ และโหมด", en: "Shows wattage, battery, resistance, puff count and mode", zh: "显示功率、电量、阻值、口数和模式" }, specKey: "screen" },
      ],
    },
    "control": {
      title: { th: "ควบคุมได้ละเอียด", en: "Precise control", zh: "精准掌控" },
      subline: { th: "ปรับค่าด้วยล้อหมุน และปลดล็อกได้เพียงแตะที่ปุ่มยิง", en: "A wheel for fine adjustment, and a fire button that unlocks at a touch.", zh: "用拨轮细调，轻触火键即可解锁。" },
      body: {
        th: "พอปล่อยมือ เครื่องก็ล็อกกลับให้เอง จึงไม่ต้องคอยจำว่าล็อกไว้แล้วหรือยัง",
        en: "Let go and it locks itself again, so you never have to remember whether it is locked.",
        zh: "松开手指就会自动重新上锁，不用再记着有没有锁好。",
      },
      points: [
        { text: { th: "กด 5 ครั้งเพื่อเปิดหรือปิดเครื่อง", en: "Press 5 times to turn it on or off", zh: "按 5 下开关机" }, specKey: "control" },
        { text: { th: "กด 3 ครั้งเพื่อเข้าเมนู", en: "Press 3 times for the menu", zh: "按 3 下进入菜单" }, specKey: "control" },
      ],
    },
    "tank": {
      title: { th: "UFORCE-X Tank II", en: "UFORCE-X Tank II", zh: "UFORCE-X Tank II" },
      subline: { th: "ถังน้ำยาที่มากับชุด สูบได้ทั้งแบบ MTL และ DTL", en: "The tank in the kit, for MTL and DTL alike.", zh: "套装附带的烟仓，MTL 和 DTL 都能抽。" },
      body: {
        th: "เวลาเติมน้ำยา แค่หมุนเปิดฝาด้านบนก็เติมได้เลย ส่วนแหวนปรับลมใช้หมุนให้สูบแน่นขึ้นหรือโล่งขึ้นตามที่ชอบ",
        en: "To refill, twist the top cap open and fill straight in; turn the airflow dial for a tighter or a more open draw.",
        zh: "注油时拧开顶盖就能直接加；转动调气环，可以让吸感更紧或更松。",
      },
      captions: [
        { th: "ช่องลม Golden Triangle", en: "Golden Triangle airflow", zh: "Golden Triangle 气流结构" },
        { th: "แหวนปรับลมแบบหมุน", en: "Rotary airflow dial", zh: "旋转调气环" },
        { th: "เติมด้านบน", en: "Top fill", zh: "顶部注油" },
      ],
      points: [
        { text: { th: "จุน้ำยา 5mL (2mL ในเวอร์ชัน TPD)", en: "Holds 5mL (2mL in the TPD version)", zh: "容量 5mL（TPD 版 2mL）" }, specKey: "tank" },
        { text: { th: "ใช้คอยล์ PnP X ได้ทุกตัว", en: "Takes every PnP X coil", zh: "兼容全部 PnP X 线圈" }, specKey: "coil" },
      ],
      link: { href: "/guides/choosing-wattage-and-airflow", label: { th: "อ่านวิธีเลือกวัตต์และช่องลม", en: "Read: choosing wattage and airflow", zh: "如何选择功率与进气量" } },
    },
  },
  // Site-wide template round batch 2d (04/10): VOOPOO's own DRAG S3 / DRAG X3 pages + posters
  // (_incoming/sitewide-template/2/2d/facts-drag-s3.md + facts-drag-x3.md list the source of each line); Thai = thai-copy 04/10.
  "drag-s3": {
    "battery": {
      title: { th: "แบตก้อนใหญ่ ตัวเครื่องเล็ก", en: "Big battery, compact body", zh: "大电池，小机身" },
      subline: { th: "ตัวเรือนเป็นซิงค์อัลลอยหุ้มด้วยหนัง", en: "Zinc alloy, wrapped in leather.", zh: "锌合金机身，外覆皮革。" },
      body: {
        th: "เมื่อแบตหมด แค่เสียบสายเข้ากับตัวเครื่องก็ชาร์จได้เลย ไม่ต้องมีถ่านสำรองหรือที่ชาร์จถ่านแยก",
        en: "When it runs low, plug the cable straight into the device — no spare cells, no separate charger.",
        zh: "没电时，把线直接插在机身上就能充，不用备用电池，也不用另配充电器。",
      },
      points: [
        { text: { th: "ชาร์จผ่าน USB-C 5V/2A", en: "USB-C, 5V/2A charging", zh: "USB-C 充电，5V/2A" }, specKey: "charging" },
        { text: { th: "ตัวเครื่องสูง 124.25 mm", en: "124.25mm tall", zh: "机身高 124.25mm" }, specKey: "dimensions" },
      ],
    },
    "screen": {
      title: { th: "จอ TFT 0.96 นิ้ว", en: "0.96-inch TFT screen", zh: "0.96 英寸 TFT 屏幕" },
      subline: { th: "เปลี่ยนธีมหน้าจอได้ตามที่ชอบ", en: "Change the screen theme to suit you.", zh: "屏幕主题可按喜好更换。" },
      body: {
        th: "เลือกได้สามโหมด SMART จะคุมวัตต์ให้อยู่ในช่วงที่เหมาะกับคอยล์ที่ใส่ RBA ให้ตั้งวัตต์เองได้เต็มที่ ส่วน ECO เน้นประหยัดแบตให้ใช้ได้นานขึ้น",
        en: "Three modes: SMART keeps the wattage within the right range for your coil, RBA leaves every setting to you, and ECO saves battery so it lasts longer.",
        zh: "三种模式：SMART 自动把功率控制在适合所装线圈的范围内，RBA 完全由你手动设定，ECO 更省电、用得更久。",
      },
      points: [
        { text: { th: "แสดงวัตต์ โหมด โอห์ม แบต และจำนวนพัฟ", en: "Shows wattage, mode, resistance, battery and puff count", zh: "显示功率、模式、阻值、电量和口数" }, specKey: "screen" },
        { text: { th: "ชิป GENE.TT 2.0", en: "GENE.TT 2.0 chip", zh: "GENE.TT 2.0 芯片" }, specKey: "chip" },
        { text: { th: "แตะปุ่มยิงเพื่อปลดล็อก ปล่อยนิ้วแล้วเครื่องล็อกกลับเอง", en: "Touch the fire button to unlock; it locks again when you let go", zh: "轻触火键解锁，松手后自动上锁" }, specKey: "control" },
      ],
    },
    "coils": {
      title: { th: "หัวพอต PnP X", en: "The PnP X cartridge", zh: "PnP X 烟弹" },
      subline: { th: "เปลี่ยนคอยล์และปรับลมได้ตามที่ชอบสูบ", en: "Change the coil and the airflow to suit how you vape.", zh: "线圈和气流，都能按你的抽法调整。" },
      body: {
        th: "ช่องลมอยู่ด้านบนและปรับได้ด้วยการเลื่อน เลื่อนปิดเมื่ออยากสูบ MTL แบบแน่น ๆ หรือเลื่อนเปิดเมื่ออยากได้ลมโล่งขึ้น",
        en: "The airflow sits on top and slides: close it down for a tight MTL draw, open it up for a looser one.",
        zh: "进气口在顶部，滑动调节：关小是紧致的 MTL，开大吸感就更松。",
      },
      points: [
        { text: { th: "ใส่ได้ทั้งหัวพอต PnP X Cartridge DTL และ MTL", en: "Takes the PnP X Cartridge DTL or MTL", zh: "可用 PnP X Cartridge DTL 或 MTL 烟弹" }, specKey: "pod-compat" },
        { text: { th: "จุน้ำยา 5mL (2mL ในเวอร์ชัน TPD) เติมด้านข้าง", en: "Holds 5mL (2mL in the TPD version), filled from the side", zh: "容量 5mL（TPD 版 2mL），侧注油" }, specKey: "pod-compat" },
        { text: { th: "ใช้คอยล์ PnP X ได้ทุกตัว ตั้งแต่ 0.15 ถึง 1.0 โอห์ม", en: "Takes every PnP X coil, from 0.15 to 1.0Ω", zh: "兼容全部 PnP X 线圈，0.15–1.0Ω" }, specKey: "coil" },
        { text: { th: "สูบได้ทั้ง MTL RDL และ DTL แบบเบา ๆ", en: "MTL, RDL and light DTL", zh: "适合 MTL、RDL 和轻度 DTL" }, specKey: "vaping-style" },
      ],
      link: { href: "/guides/choosing-wattage-and-airflow", label: { th: "อ่านวิธีเลือกวัตต์และช่องลม", en: "Read: choosing wattage and airflow", zh: "如何选择功率与进气量" } },
    },
  },
  "drag-x3": {
    "battery": {
      title: { th: "ใส่ถ่านที่เลือกเองได้", en: "Bring your own cell", zh: "电池由你来选" },
      subline: { th: "เลือกก้อนที่เหมาะกับการใช้งานได้เอง", en: "Choose the cell that suits how you vape.", zh: "按你的使用习惯选择电池。" },
      body: {
        th: "เครื่องรุ่นนี้ไม่มีแบตในตัว เมื่อถ่านหมด ก็เปลี่ยนเป็นก้อนสำรองที่ชาร์จไว้แล้วสูบต่อได้เลย",
        en: "There's no built-in battery: when the cell runs down, swap in a charged spare and carry on.",
        zh: "机身没有内置电池：电池没电时，换上一颗充好电的备用电池就能接着抽。",
      },
      points: [
        { text: { th: "ชาร์จผ่าน USB-C 5V/2A", en: "USB-C, 5V/2A charging", zh: "USB-C 充电，5V/2A" }, specKey: "charging" },
        { text: { th: "ใช้เวลาชาร์จ 2–3 ชั่วโมง", en: "Charges in 2–3 hours", zh: "充电约需 2–3 小时" }, specKey: "charge-time" },
      ],
    },
    "unlock": {
      title: { th: "ปลดล็อกได้สามแบบ", en: "Three ways to unlock", zh: "三种解锁方式" },
      subline: { th: "เลือกแบบที่ถนัดได้จากเมนู", en: "Pick the one you prefer in the menu.", zh: "在菜单里选你习惯的方式。" },
      body: {
        th: "เซ็นเซอร์แบบแตะตอบสนองต่อนิ้วเท่านั้น กุญแจหรือผ้าในกระเป๋าจึงปลดล็อกเครื่องไม่ได้",
        en: "The touch sensor responds only to a finger, not to keys or fabric in your pocket.",
        zh: "触摸感应只对手指有反应，口袋里的钥匙或布料都不会触发。",
      },
      captions: [
        { th: "แตะเพื่อปลดล็อก", en: "Touch to unlock", zh: "触摸解锁" },
        { th: "กดปุ่มเพื่อปลดล็อก", en: "Button unlock", zh: "按键解锁" },
        { th: "ปลดล็อกค้างไว้", en: "Stay unlocked", zh: "保持解锁" },
      ],
      points: [
        { text: { th: "กด 5 ครั้งเพื่อเปิดหรือปิดเครื่อง", en: "Press 5 times to turn it on or off", zh: "按 5 下开关机" }, specKey: "control" },
        { text: { th: "กด 3 ครั้งเพื่อเข้าเมนู", en: "Press 3 times for the menu", zh: "按 3 下进入菜单" }, specKey: "control" },
      ],
    },
    "screen": {
      title: { th: "จอทัชสกรีน 1.66 นิ้ว", en: "1.66-inch touchscreen", zh: "1.66 英寸触摸屏" },
      subline: { th: "เลือกธีมหน้าจอได้สามแบบ", en: "Three screen themes to choose from.", zh: "3 款屏幕主题可选。" },
      body: {
        th: "บนจอบอกแบต วัตต์ โหมด โอห์ม จำนวนพัฟ และสถานะล็อก จึงรู้ได้ทันทีว่าเครื่องตั้งไว้อย่างไร",
        en: "It shows battery, wattage, mode, resistance, puff count and lock status, so you can see how it's set at once.",
        zh: "屏幕显示电量、功率、模式、阻值、口数和锁定状态，当前设定一眼就清楚。",
      },
      points: [
        { text: { th: "ชิป GENE.TT 2.0", en: "GENE.TT 2.0 chip", zh: "GENE.TT 2.0 芯片" }, specKey: "chip" },
        { text: { th: "มีโหมด SMART RBA และ ECO ให้เลือก", en: "SMART, RBA and ECO modes", zh: "SMART、RBA、ECO 三种模式可选" }, specKey: "modes" },
      ],
    },
    "pnpx": {
      title: { th: "หัวพอต PnP X", en: "The PnP X cartridge", zh: "PnP X 烟弹" },
      subline: { th: "ช่องน้ำยาออกแบบมาเพื่อกันรั่ว", en: "A chamber designed to keep the e-liquid in.", zh: "防漏腔体设计，让烟油待在该在的地方。" },
      body: {
        th: "หัวพอตที่มากับชุดเป็นแบบ DTL ถ้าอยากสูบ MTL ก็เปลี่ยนเป็นหัวพอต PnP X Cartridge MTL ได้ในเครื่องเดิม หัวแบบ MTL นี้ VOOPOO ขายแยกต่างหาก",
        en: "The kit comes with the DTL cartridge. For MTL, switch to the PnP X Cartridge MTL on the same device — VOOPOO sells it separately.",
        zh: "套装附带的是 DTL 烟弹；想抽 MTL，在同一台机器上换成 PnP X Cartridge MTL 即可，VOOPOO 单独出售。",
      },
      points: [
        { text: { th: "จุน้ำยา 5mL (2mL ในเวอร์ชัน TPD) เติมด้านข้าง", en: "Holds 5mL (2mL in the TPD version), filled from the side", zh: "容量 5mL（TPD 版 2mL），侧注油" }, specKey: "pod-compat" },
        { text: { th: "ใช้คอยล์ PnP X ได้ทุกตัว", en: "Takes every PnP X coil", zh: "兼容全部 PnP X 线圈" }, specKey: "coil" },
        { text: { th: "ช่องลมอยู่ด้านบน", en: "Top airflow", zh: "顶部进气" }, specKey: "airflow" },
      ],
      link: { href: "/guides/choosing-wattage-and-airflow", label: { th: "อ่านวิธีเลือกวัตต์และช่องลม", en: "Read: choosing wattage and airflow", zh: "如何选择功率与进气量" } },
    },
  },
  // Site-wide template round batch 2e (04/10): VOOPOO's own ARGUS G4 mini / G3 mini pages + posters
  // (_incoming/sitewide-template/2/2e/facts-argus-g4-mini.md + facts-argus-g3-mini.md list the source of each line); Thai = thai-copy 04/10.
  "argus-g4-mini": {
    "flip": {
      title: { th: "กลับด้านหัวพอต ก็เปลี่ยนโอห์มได้", en: "Flip the pod, switch the resistance", zh: "翻转烟弹，切换阻值" },
      subline: { th: "สองค่าโอห์มอยู่ในหัวพอตหัวเดียว", en: "Two resistances in one cartridge.", zh: "一颗烟弹，两种阻值。" },
      body: {
        th: "ใส่หัวพอตตามปกติเมื่ออยากได้ไอที่อุ่นและลมที่โล่งขึ้น หรือหมุนหัวพอต 180 องศาแล้วใส่กลับเข้าไปเมื่ออยากสูบแบบแน่น ตัวเครื่องจะรู้เองทันทีว่าหัวพอตใส่อยู่ด้านไหน",
        en: "Put the pod in as it comes for a warmer, looser draw, or turn it 180° for a tight one. The device reads which way it sits by itself.",
        zh: "按原样插入，吸感更暖更松；转 180° 插入，吸感就变紧。机身会自动识别烟弹的方向。",
      },
      points: [
        { text: { th: "0.7 โอห์ม เหมาะกับ RDL และ MTL แบบลมโล่ง", en: "0.7Ω: RDL and loose MTL", zh: "0.7Ω：RDL 和松一些的 MTL" }, specKey: "pod" },
        { text: { th: "1.0 โอห์ม เหมาะกับ MTL แบบแน่นและน้ำยา salt nic", en: "1.0Ω: a tight MTL draw that suits nic salts", zh: "1.0Ω：紧致的 MTL，适合盐尼古丁" }, specKey: "pod" },
        { text: { th: "ไฟสีขาวคือ 0.7 โอห์ม ไฟสีเขียวคือ 1.0 โอห์ม", en: "White light for 0.7Ω, green light for 1.0Ω", zh: "白灯为 0.7Ω，绿灯为 1.0Ω" }, specKey: "indicator" },
        { text: { th: "ปุ่มเลื่อนปรับลมแบบไม่มีขั้น ปรับได้ตั้งแต่ MTL ถึง RDL", en: "Stepless airflow slider, from MTL to RDL", zh: "无级进气滑块，从 MTL 到 RDL" }, specKey: "airflow" },
      ],
      link: { href: "/guides/choosing-wattage-and-airflow", label: { th: "อ่านวิธีเลือกวัตต์และช่องลม", en: "How to choose wattage and airflow", zh: "如何选择功率与进气量" } },
    },
    "battery": {
      title: { th: "แบตก้อนใหญ่ในตัว", en: "A big built-in battery", zh: "大容量内置电池" },
      subline: { th: "เป็นแบตเตอรี่แบบความหนาแน่นสูง", en: "A high-density cell.", zh: "高密度电芯。" },
      body: {
        th: "ไฟสีขาวสี่ขีดด้านหน้าเครื่องบอกแบตที่เหลืออยู่ ขีดละ 25% จึงรู้ได้ง่าย ๆ ว่าถึงเวลาชาร์จหรือยัง",
        en: "Four white bars on the front show what's left, a quarter each, so you know when to plug it in.",
        zh: "机身正面的四格白灯显示剩余电量，每格 25%，什么时候该充电一看就知道。",
      },
      points: [
        { text: { th: "แบต 1650mAh ในตัว", en: "1650mAh built-in battery", zh: "内置 1650mAh 电池" }, specKey: "battery" },
        { text: { th: "ชาร์จผ่าน USB-C 5V/1.5A", en: "USB-C, 5V/1.5A charging", zh: "USB-C 充电，5V/1.5A" }, specKey: "charging" },
      ],
    },
    "pod": {
      title: { th: "หัวพอต Multi-Ohm", en: "The Multi-Ohm cartridge", zh: "Multi-Ohm 烟弹" },
      subline: { th: "ใช้เทคโนโลยี Multi-Core Electrode ร่วมกับ iCOSM CODE 2.0 ของ VOOPOO", en: "Multi-core electrodes, with VOOPOO's iCOSM CODE 2.0.", zh: "多芯电极，搭配 VOOPOO 的 iCOSM CODE 2.0。" },
      body: {
        th: "เติมน้ำยาได้โดยไม่ต้องถอดหัวพอตออกจากเครื่อง ตัวหัวเป็น PCTG แบบใสที่ทนต่อการแตก",
        en: "Fill it from the top without taking it out. The shell is clear, shatter-resistant PCTG.",
        zh: "不用取下烟弹，从顶部就能注油。外壳是透明、抗摔的 PCTG。",
      },
      points: [
        { text: { th: "จุน้ำยา 3.5mL (2mL ในเวอร์ชัน TPD) เติมด้านบน", en: "3.5mL (2mL in the TPD version), top fill", zh: "容量 3.5mL（TPD 版 2mL），顶部注油" }, specKey: "pod" },
        { text: { th: "ตัวเครื่องใส่หัวพอตตระกูล ARGUS ได้ทุกหัว", en: "Takes every ARGUS pod-family cartridge", zh: "兼容整个 ARGUS 烟弹家族" }, specKey: "pod-compat" },
      ],
    },
    "design": {
      title: { th: "ตัวเครื่องโลหะ ดีไซน์เรียบ", en: "A minimal metal body", zh: "简约金属机身" },
      subline: { th: "ไม่มีจอ และไม่มีเมนูให้ต้องตั้งค่า", en: "No screen, no menus.", zh: "没有屏幕，也没有菜单。" },
      body: {
        th: "สิ่งที่ต้องรู้ดูได้จากไฟด้านหน้าเครื่อง ส่วนตัวเรือนเป็นอะลูมิเนียมอัลลอยที่ทนต่อรอยขีดข่วน",
        en: "The light on the front tells you what you need to know, and the aluminium alloy shell is scratch-resistant.",
        zh: "需要知道的，看正面的指示灯就行；铝合金外壳耐刮。",
      },
      points: [
        { text: { th: "สูบได้เลยโดยไม่ต้องกดปุ่ม", en: "Draw-activated", zh: "吸气即启动" }, specKey: "firing" },
        { text: { th: "หนัก 56 กรัม", en: "56g", zh: "重 56g" }, specKey: "dimensions" },
        { text: { th: "ขนาด 113 × 27.6 × 14.6 mm", en: "113 × 27.6 × 14.6 mm", zh: "113 × 27.6 × 14.6 mm" }, specKey: "dimensions" },
      ],
    },
  },
  "argus-g3-mini": {
    "light": {
      title: { th: "ถือแล้วเบามือ", en: "Light in the hand", zh: "握在手里很轻" },
      subline: { th: "หนักเพียง 40.85 กรัม", en: "Just 40.85g.", zh: "只有 40.85g。" },
      body: {
        th: "VOOPOO ทำให้รุ่นนี้เบากว่ารุ่นก่อนหน้าเกือบ 20% และตกแต่งตัวเครื่องด้วยลายหมุดเล็ก ๆ แบบ Clous de Paris",
        en: "VOOPOO made it nearly 20% lighter than the generation before, and gave it a Clous de Paris stud pattern.",
        zh: "VOOPOO 让它比上一代轻了将近 20%，还加了巴黎钉纹。",
      },
      points: [
        { text: { th: "อะลูมิเนียมอัลลอย", en: "Aluminium alloy", zh: "铝合金" }, specKey: "materials" },
        { text: { th: "สูง 97.9 mm เมื่อใส่หัวพอต 3mL", en: "97.9mm tall with the 3mL cartridge", zh: "装上 3mL 烟弹高 97.9mm" }, specKey: "dimensions" },
      ],
    },
    "icosm": {
      title: { th: "คอยล์ที่ใหญ่ขึ้น", en: "A bigger coil", zh: "更大的线圈" },
      subline: { th: "ครั้งแรกที่ VOOPOO นำ iCOSM CODE 2.0 มาใช้กับหัวพอตตระกูล ARGUS", en: "iCOSM CODE 2.0, now in ARGUS cartridges.", zh: "iCOSM CODE 2.0，首次用在 ARGUS 烟弹上。" },
      body: {
        th: "ในหัวพอตมีซีลที่ช่วยเก็บน้ำยาไว้ไม่ให้ซึมออกมา แกนคอยล์ขนาดใหญ่ และสำลี Golden Cotton ทำงานร่วมกัน เป็นเทคโนโลยีคอยล์แบบเดียวกับที่ใช้ใน ARGUS G3",
        en: "A seal that keeps the liquid where it belongs, a larger core and golden cotton work together. It's the same coil technology as the ARGUS G3.",
        zh: "锁住烟油的密封结构、更大的芯和金色棉一起配合。和 ARGUS G3 用的是同一套线圈技术。",
      },
      captions: [
        { th: "Liquid-Seal Shield", en: "Liquid-Seal Shield", zh: "Liquid-Seal Shield" },
        { th: "Mega-Core", en: "Mega-Core", zh: "Mega-Core" },
        { th: "Golden Cotton", en: "Golden Cotton", zh: "Golden Cotton" },
      ],
    },
    "cartridge": {
      title: { th: "หัวพอต Top Fill Cartridge V2", en: "ARGUS Top Fill Cartridge V2", zh: "ARGUS Top Fill Cartridge V2" },
      subline: { th: "มีให้เลือกสามค่าโอห์ม แต่ละค่าให้แนวการสูบต่างกัน", en: "Three resistances, each with its own draw.", zh: "三种阻值，各有各的吸感。" },
      body: {
        th: "หัวพอตเติมน้ำยาจากด้านบน ในกล่องมีหัว 0.7 โอห์มมาให้ ถ้าอยากได้แนวการสูบแบบอื่น ก็เลือกหัวที่โอห์มต่างออกไปได้",
        en: "It fills from the top, and the kit comes with the 0.7Ω; for a different draw, pick another resistance.",
        zh: "顶部注油，套装附 0.7Ω；想要别的吸感，就换其他阻值。",
      },
      points: [
        { text: { th: "0.4 โอห์ม สำหรับ RDL ที่ 18–30 วัตต์", en: "0.4Ω: RDL, 18–30W", zh: "0.4Ω：RDL，18–30W" }, specKey: "pod-compat" },
        { text: { th: "0.7 โอห์ม สำหรับ MTL ที่ 14–18 วัตต์", en: "0.7Ω: MTL, 14–18W", zh: "0.7Ω：MTL，14–18W" }, specKey: "pod-compat" },
        { text: { th: "1.0 โอห์ม สำหรับ MTL ที่ 10–14 วัตต์", en: "1.0Ω: MTL, 10–14W", zh: "1.0Ω：MTL，10–14W" }, specKey: "pod-compat" },
        { text: { th: "จุน้ำยา 3mL (2mL ในเวอร์ชัน TPD)", en: "3mL (2mL in the TPD version)", zh: "容量 3mL（TPD 版 2mL）" }, specKey: "pod" },
      ],
      link: { href: "/guides/choosing-wattage-and-airflow", label: { th: "อ่านวิธีเลือกวัตต์และช่องลม", en: "How to choose wattage and airflow", zh: "如何选择功率与进气量" } },
    },
    "tiny": {
      title: { th: "ตัวเล็ก แต่แบตก้อนใหญ่", en: "Small, with a big battery", zh: "机身小，电池大" },
      subline: { th: "แบต 1350mAh อยู่ในตัวเครื่อง", en: "1350mAh, built in.", zh: "内置 1350mAh。" },
      body: {
        th: "ไม่ต้องตั้งค่าอะไรก่อน หยิบขึ้นมาก็พร้อมใช้งานทันที",
        en: "Nothing to set up first: pick it up and it's ready.",
        zh: "无需任何设置，拿起来就能用。",
      },
      points: [
        { text: { th: "ไม่มีปุ่ม สูบได้เลย", en: "No fire button, draw-activated", zh: "没有点火键，吸气即启动" }, specKey: "firing" },
        { text: { th: "ชาร์จผ่าน USB-C 5V/1A", en: "USB-C, 5V/1A charging", zh: "USB-C 充电，5V/1A" }, specKey: "charging" },
        { text: { th: "ช่องลมตั้งมาแบบคงที่ ปรับไม่ได้", en: "Fixed airflow", zh: "进气量固定" }, specKey: "airflow" },
      ],
    },
  },
  // Site-wide template round batch 2f (05/10): VOOPOO's own ARGUS P3 / VMATE i3 pages + posters
  // (_incoming/sitewide-template/2/2f/facts-argus-p3.md + facts-vmate-i3.md list the source of each line); Thai = thai-copy 05/10.
  "argus-p3": {
    "touchfree": {
      title: { th: "เลือกได้ทั้งหนังและโลหะ", en: "Leather or metal", zh: "皮革或金属" },
      subline: { th: "ชุดสีหนังมีให้เลือกหลายสี และยังมีรุ่น Metal Edition", en: "Leather finishes, or the Metal Edition.", zh: "皮革款，或金属版。" },
      body: {
        th: "รุ่น Metal Edition มีลายเฟืองกับโลโก้ EVEREST LAB อยู่ที่ด้านหลัง ส่วนชุดสีหนังบางสี อย่าง Blue Leather ก็มีลายตัวอักษร ARGUS ตัวใหญ่พาดไว้เต็มแผ่น",
        en: "The Metal Edition carries a gear pattern and the EVEREST LAB logo on the back; leather colours such as Blue Leather have a large ARGUS script across theirs.",
        zh: "金属版背面是齿轮纹和 EVEREST LAB 标志；Blue Leather 等皮革配色则印着满版的 ARGUS 大字。",
      },
      points: [
        { text: { th: "กรอบเครื่องเป็นซิงค์อัลลอย", en: "Zinc alloy frame", zh: "锌合金边框" }, specKey: "materials" },
        { text: { th: "หัวพอตใช้ iCOSM CODE 2.0", en: "iCOSM CODE 2.0 in the cartridge", zh: "烟弹采用 iCOSM CODE 2.0" }, specKey: "coil" },
      ],
    },
    "minibox": {
      title: { th: "ถือได้ในมือเดียว", en: "Small enough for one hand", zh: "一只手就能握住" },
      subline: { th: "Mini BOX แบบจอทัชเต็มจอรุ่นแรกของ VOOPOO", en: "VOOPOO's first full-touch Mini BOX.", zh: "VOOPOO 首款全触控 Mini BOX。" },
      body: {
        th: "ถึงด้านหน้าจะเป็นจอทั้งหน้า ตัวเครื่องก็หนักเพียง 82 กรัม",
        en: "The whole front is screen, yet it weighs just 82g.",
        zh: "整个正面都是屏幕，机身却只有 82g。",
      },
      points: [
        { text: { th: "จอโค้งลงไปทั้งสองขอบ", en: "Screen curves over both edges", zh: "屏幕两侧弯曲包边" }, specKey: "screen" },
        { text: { th: "แบต 1500mAh ในตัว", en: "1500mAh built-in battery", zh: "内置 1500mAh 电池" }, specKey: "battery" },
        { text: { th: "ปุ่มด้านข้างปุ่มเดียว ใช้สั่งงานได้หลายอย่าง", en: "One side button for several functions", zh: "侧面一个按键，可操作多项功能" }, specKey: "control" },
        { text: { th: "ปุ่มเลื่อนปรับลมแบบไม่มีขั้น", en: "Stepless airflow slider", zh: "无级进气调节" }, specKey: "airflow" },
      ],
    },
    "touch": {
      title: { th: "สิ่งที่อยู่บนจอ", en: "What's on the screen", zh: "屏幕上有什么" },
      subline: { th: "แตะครั้งเดียวก็ปรับวัตต์ได้ และยังตั้งค่าอื่น ๆ ได้อีกหลายอย่าง", en: "Wattage in one tap, and plenty more to set.", zh: "一触即可调功率，还有更多设置可调。" },
      body: {
        th: "เครื่องจะเก็บจำนวนพัฟและเวลาที่สูบไว้ให้ ดูย้อนหลังได้ทั้งรายวันและรายเดือน ส่วนหน้าปัด ยิ่งใช้เครื่องนานก็จะปลดล็อกให้เลือกได้มากขึ้น",
        en: "It keeps your puffs and vaping time by day and over months, and more watch faces unlock the longer you use it.",
        zh: "它会按天、按月记录口数和抽吸时长；用得越久，解锁的表盘越多。",
      },
      points: [
        { text: { th: "โหมด DIY ตั้งกราฟวัตต์เองได้ บันทึกไว้ได้สูงสุด 3 ชุด", en: "DIY power curve, up to three saved sets", zh: "DIY 功率曲线，最多保存三组" }, specKey: "modes" },
        { text: { th: "โหมด Party ECO SOS และ Child Lock", en: "Party, ECO, SOS and Child Lock modes", zh: "派对、ECO、SOS 和童锁模式" }, specKey: "modes" },
        { text: { th: "หน้าปัดมากกว่า 18 แบบ", en: "18+ watch faces", zh: "18 款以上表盘" }, specKey: "screen" },
      ],
      link: { href: "/technology/onboard-touch-displays", label: { th: "อ่านเรื่องพอตจอทัช", en: "How touchscreen pods work", zh: "了解触屏烟具" } },
    },
    "family": {
      title: { th: "หัวพอตตระกูล ARGUS", en: "The ARGUS pod family", zh: "ARGUS 烟弹家族" },
      subline: { th: "รวมถึง Snap Cartridge รุ่นใหม่ ที่เปิดฝาด้านบนแล้วเติมน้ำยาได้เลย", en: "Including the new Snap Cartridge, with a cap that snaps open.", zh: "包括全新的 Snap 烟弹，翻盖一掀即开。" },
      body: {
        th: "ใส่กับเครื่องนี้ได้ทุกหัว ค่าด้านล่างมาจากตารางของ VOOPOO ซึ่งแนะนำให้เช็คค่าโอห์มและวัตต์ก่อนใช้",
        en: "They all fit this device. The figures below are VOOPOO's table, and VOOPOO asks you to check the resistance and output first.",
        zh: "这些烟弹都能装在这台主机上。下面的数据来自 VOOPOO 的表格，VOOPOO 建议先核对阻值和功率。",
      },
      points: [
        { text: { th: "0.4 โอห์ม สำหรับ RDL ที่ 18–30 วัตต์", en: "0.4Ω: RDL, 18–30W", zh: "0.4Ω：RDL，18–30W" }, specKey: "pod-compat" },
        { text: { th: "0.7 โอห์ม สำหรับ MTL ที่ 14–18 วัตต์", en: "0.7Ω: MTL, 14–18W", zh: "0.7Ω：MTL，14–18W" }, specKey: "pod-compat" },
        { text: { th: "1.0 โอห์ม สำหรับ MTL ที่ 10–14 วัตต์", en: "1.0Ω: MTL, 10–14W", zh: "1.0Ω：MTL，10–14W" }, specKey: "pod-compat" },
        { text: { th: "Snap Cartridge จุน้ำยา 2mL ตัวหัวเป็น PCTG", en: "Snap Cartridge: 2mL, PCTG", zh: "Snap 烟弹：2mL，PCTG 材质" }, specKey: "pod" },
      ],
      link: { href: "/guides/understanding-mtl-vs-dtl", label: { th: "อ่านเรื่อง MTL กับ DTL", en: "Read: MTL vs. DTL", zh: "了解 MTL 与 DTL 的区别" } },
    },
  },
  "vmate-i3": {
    "pocket": {
      title: { th: "ทำมาให้พกติดตัว", en: "Made for the pocket", zh: "为口袋而生" },
      subline: { th: "เครื่องที่หยิบติดมือออกจากบ้านได้ทุกวัน", en: "One to take with you every day.", zh: "每天都能随手带出门。" },
      body: {
        th: "ตัวเครื่องหนาเพียง 15.1mm ใส่กระเป๋ากางเกงได้สบาย",
        en: "At 15.1mm thick, it slips into a trouser pocket.",
        zh: "机身厚 15.1mm，放进裤袋刚好。",
      },
      points: [
        { text: { th: "ไม่มีปุ่ม สูบได้เลย", en: "Draw-activated, no buttons", zh: "吸气启动，没有按键" }, specKey: "firing" },
        { text: { th: "ตัวเครื่องอะลูมิเนียมอัลลอย", en: "Aluminium alloy body", zh: "铝合金机身" }, specKey: "materials" },
      ],
    },
    "power": {
      title: { th: "ตัวเครื่องเบา แต่แบตอึด", en: "Light, with a battery that lasts", zh: "很轻，电池却很耐用" },
      subline: { th: "หนัก 49.8 กรัม พอ ๆ กับไข่หนึ่งฟอง", en: "49.8g, about as much as an egg.", zh: "49.8g，和一颗鸡蛋差不多。" },
      body: {
        th: "ผิวตัวเครื่องมีให้เลือกหลายลาย ส่วนแถบไฟด้านข้างจะเปลี่ยนสีตามแบตที่เหลือ ดูแล้วรู้ได้เลยว่าควรชาร์จเมื่อไหร่",
        en: "VOOPOO finishes it in several different textures, and a light strip on the side tells you how much battery is left.",
        zh: "VOOPOO 给它做了多种不同的纹理，侧面的灯带会告诉你还剩多少电。",
      },
      points: [
        { text: { th: "แบต 1500mAh ในตัว", en: "1500mAh built-in battery", zh: "内置 1500mAh 电池" }, specKey: "battery" },
        { text: { th: "ไฟสีแดงเมื่อแบตเหลือไม่เกิน 30% สีน้ำเงินที่ 30–70% และสีเขียวตั้งแต่ 70% ขึ้นไป", en: "Red up to 30%, blue 30–70%, green from 70%", zh: "30% 以下红色，30–70% 蓝色，70% 及以上绿色" }, specKey: "indicator" },
        { text: { th: "ชาร์จเร็วผ่าน USB-C 5V/2A", en: "USB-C, 5V/2A fast charging", zh: "USB-C 快充，5V/2A" }, specKey: "charging" },
        { text: { th: "ปุ่มเลื่อนปรับลม ปรับได้ตั้งแต่ MTL แบบแน่นจนถึง RDL ที่ลมโล่ง", en: "Airflow slider, from a tight MTL to an airy RDL", zh: "进气滑块，从偏紧的 MTL 到通畅的 RDL" }, specKey: "airflow" },
      ],
      link: { href: "/guides/choosing-wattage-and-airflow", label: { th: "อ่านวิธีเลือกวัตต์และช่องลม", en: "How to choose wattage and airflow", zh: "如何选择功率与进气量" } },
    },
    "cartridge": {
      title: { th: "หัวพอตที่ใช้ได้นานขึ้น", en: "A longer-lasting cartridge", zh: "更耐用的烟弹" },
      subline: { th: "VMATE Top Fill Cartridge ใช้เทคโนโลยี iCOSM CODE ของ VOOPOO", en: "The VMATE Top Fill Cartridge, built on iCOSM CODE.", zh: "VMATE Top Fill Cartridge，采用 iCOSM CODE。" },
      body: {
        th: "เติมน้ำยาจากด้านบนได้โดยไม่ต้องถอดหัวพอตออกจากเครื่อง ส่วนตัวเลขสองข้อด้านล่างมาจากผลทดสอบในห้องแล็บของ VOOPOO เอง",
        en: "You fill it from the top without taking it out. The two figures below are from VOOPOO's own lab tests.",
        zh: "不用取下烟弹，从顶部就能注油。下面两个数字来自 VOOPOO 自己的实验室测试。",
      },
      points: [
        { text: { th: "คอยล์ใช้ได้กับน้ำยา 90mL", en: "Coil life: 90mL of liquid", zh: "线圈寿命：90mL 烟油" }, specKey: "coil" },
        { text: { th: "ตั้งทิ้งไว้ 30 วันโดยน้ำยาไม่รั่วซึม", en: "No leaks after 30 days standing", zh: "静置 30 天不漏油" }, specKey: "coil" },
        { text: { th: "จุน้ำยา 3mL (2mL ในเวอร์ชัน TPD)", en: "3mL (2mL in the TPD version)", zh: "容量 3mL（TPD 版 2mL）" }, specKey: "pod" },
      ],
    },
    "family": {
      title: { th: "ใส่หัวพอต VMATE ได้ทุกหัว", en: "Every VMATE cartridge fits", zh: "VMATE 烟弹全都能用" },
      subline: { th: "มีหัวพอตสองรุ่น รวมห้าแบบให้เลือก", en: "Two cartridge lines, five options.", zh: "两个烟弹系列，共五款可选。" },
      body: {
        th: "ถ้าอยากเปลี่ยนแนวการสูบ ก็เปลี่ยนไปใช้หัวที่โอห์มต่างออกไปได้ โดย VOOPOO แนะนำให้เช็คค่าโอห์มและวัตต์ก่อนใช้",
        en: "To change the draw, pick another resistance; VOOPOO asks you to check the resistance and output first.",
        zh: "想换吸感就换别的阻值；VOOPOO 建议先核对阻值和功率。",
      },
      points: [
        { text: { th: "Top Fill 0.4 โอห์ม สำหรับ RDL หน้าเว็บ VOOPOO ระบุว่าต้องใช้ 30 วัตต์ขึ้นไป", en: "Top Fill 0.4Ω: RDL; VOOPOO's site says it needs 30W or more", zh: "Top Fill 0.4Ω：RDL；VOOPOO 官网注明需 30W 以上" }, specKey: "pod-compat" },
        { text: { th: "Top Fill 0.7 โอห์ม ที่ 15–25 วัตต์", en: "Top Fill 0.7Ω: 15–25W", zh: "Top Fill 0.7Ω：15–25W" }, specKey: "pod-compat" },
        { text: { th: "Top Fill 1.0 โอห์ม สำหรับ MTL ที่ 12–18 วัตต์", en: "Top Fill 1.0Ω: MTL, 12–18W", zh: "Top Fill 1.0Ω：MTL，12–18W" }, specKey: "pod-compat" },
        { text: { th: "Cartridge V2 0.7 หรือ 1.2 โอห์ม สำหรับ MTL", en: "Cartridge V2 0.7Ω or 1.2Ω: MTL", zh: "Cartridge V2 0.7Ω 或 1.2Ω：MTL" }, specKey: "pod-compat" },
      ],
      link: { href: "/products/coil-72", label: { th: "ดูหัวพอต VMATE ที่ใช้กับ VMATE i3", en: "See the VMATE pods for the i3", zh: "查看适用于 VMATE i3 的 VMATE 烟弹" } },
    },
  },
  // Site-wide template round batch 2g (05/10): VOOPOO's own ARGUS G4 page + posters (_incoming/sitewide-template/2/2g/
  // facts-argus-g4.md lists the source of each line); Thai = thai-copy 05/10.
  "argus-g4": {
    "ohm": {
      title: { th: "กลับด้านหัวพอต หรือกดปุ่ม ก็เปลี่ยนโอห์มได้", en: "Flip it or press the button", zh: "翻转或按键，即可切换阻值" },
      subline: { th: "หัวพอต Multi-Ohm หัวเดียว ใช้ได้สามค่าโอห์ม", en: "Three resistances from one Multi-Ohm cartridge.", zh: "一颗 Multi-Ohm 烟弹，三种阻值。" },
      body: {
        th: "พอเปลี่ยนแล้ว ตัวเครื่องจะรู้ค่าโอห์มใหม่เองทันที จึงไม่ต้องพกหัวพอตหัวที่สองติดตัว และไม่ต้องเข้าเมนูเพื่อตั้งค่า",
        en: "The device reads the new resistance by itself the moment you switch, so there is no second pod to carry and no menu to dig through.",
        zh: "一切换，机身就会自己识别新的阻值，不用多带一颗烟弹，也不用进菜单。",
      },
      points: [
        { text: { th: "0.7 โอห์ม เมื่อใส่หัวพอตตามปกติ เหมาะกับ MTL แบบลมโล่งและ RDL", en: "0.7Ω: insert it as it comes — loose MTL or RDL", zh: "0.7Ω：按原样插入 — 松一些的 MTL 或 RDL" }, specKey: "pod" },
        { text: { th: "1.0 โอห์ม เมื่อหมุนหัวพอต 180 องศา เหมาะกับ MTL แบบแน่นและน้ำยา salt nic", en: "1.0Ω: turn it 180° — a tight MTL that suits nic salts", zh: "1.0Ω：转 180° 插入 — 紧致的 MTL，适合盐尼古丁" }, specKey: "pod" },
        { text: { th: "0.4 โอห์ม เมื่อกดปุ่มสองครั้งติดกัน เหมาะกับ RDL ที่ลมโล่ง", en: "0.4Ω: press the button twice — an airy RDL", zh: "0.4Ω：按两下按键 — 通透的 RDL" }, specKey: "pod" },
      ],
      link: { href: "/technology/multi-resistance-cartridges", label: { th: "อ่านเรื่องระบบหัวพอตหลายโอห์ม", en: "Read: multi-resistance cartridges", zh: "了解多阻值烟弹" } },
    },
    "battery": {
      title: { th: "แบตก้อนใหญ่ และชาร์จเต็มได้เร็ว", en: "A big battery, a quick charge", zh: "大电池，充电快" },
      subline: { th: "เป็นแบตเตอรี่แบบความหนาแน่นสูง", en: "A high-density cell.", zh: "高密度电芯。" },
      body: {
        th: "VOOPOO ทำมาสำหรับคนที่สูบจัดและคนที่เดินทางบ่อย จะได้ไม่ต้องคอยหาที่เสียบชาร์จระหว่างวัน ตัวเลข 10% บนโปสเตอร์ VOOPOO เทียบกับ ARGUS G3 ส่วนหน้าเว็บของ VOOPOO ระบุว่าแบตใช้ได้นานกว่ารุ่นก่อน 22%",
        en: "VOOPOO built it for heavy vapers and travellers, so less of the day goes on looking for a socket. The 10% on the poster is against the ARGUS G3; VOOPOO's own page says 22% longer than the previous generation.",
        zh: "VOOPOO 是为重度用户和常出门的人设计的，少花时间找插座。海报上的 10% 是与 ARGUS G3 相比；VOOPOO 官网页面则写比上一代长 22%。",
      },
      points: [
        { text: { th: "แบต 1650mAh ในตัว", en: "1650mAh built-in battery", zh: "内置 1650mAh 电池" }, specKey: "battery" },
        { text: { th: "ชาร์จผ่าน USB-C เต็มในประมาณ 45 นาที", en: "Full in about 45 minutes over USB-C", zh: "USB-C 充电，约 45 分钟充满" }, specKey: "charging" },
      ],
    },
    "tech": {
      title: { th: "เทคโนโลยี Multi-Core", en: "Multi-core electrodes", zh: "多芯电极" },
      subline: { th: "ขั้วสัมผัสเรียงเป็นบวก ลบ บวก ซึ่ง VOOPOO ระบุว่าเป็นครั้งแรกในวงการ", en: "Positive, negative, positive pins in the pod seat — VOOPOO calls it an industry first.", zh: "烟弹座上是正、负、正三根针脚 — VOOPOO 称之为业内首创。" },
      body: {
        th: "หัวพอตใช้ iCOSM CODE 2.0 ของ VOOPOO ซึ่ง VOOPOO ระบุว่าช่วยให้รสชาติไม่ดรอปตั้งแต่พัฟแรกจนถึงพัฟสุดท้าย และใช้ได้ทั้งน้ำยา freebase และ salt nic",
        en: "With VOOPOO's iCOSM CODE 2.0 in the cartridge, VOOPOO says the taste holds from the first draw to the last, with freebase or nic salts.",
        zh: "烟弹搭配 VOOPOO 的 iCOSM CODE 2.0，VOOPOO 表示从第一口到最后一口味道都不会衰减，游离碱烟油和盐尼古丁烟油都适用。",
      },
      points: [
        { text: { th: "ปรับวัตต์ได้สูงสุด 35 วัตต์", en: "Up to 35W", zh: "最高 35W" }, specKey: "output" },
      ],
    },
    "design": {
      title: { th: "ตัวเครื่องเป็นโลหะทั้งตัว", en: "A full-metal body", zh: "全金属机身" },
      subline: { th: "มีให้เลือกสองแบบ คืออะลูมิเนียมอัลลอย และซิงค์อัลลอยกับหนัง", en: "Two builds: aluminium alloy, or zinc alloy with leather.", zh: "两种版本：铝合金款，或锌合金皮革款。" },
      body: {
        th: "บางสีใช้งานผิวแบบ Zircon Sand ซึ่ง VOOPOO ระบุว่าเป็นครั้งแรกที่นำมาใช้",
        en: "Some colours get a Zircon Sand finish, which VOOPOO says it is using for the first time.",
        zh: "部分配色采用锆砂工艺，VOOPOO 称这是首次使用。",
      },
      points: [
        { text: { th: "แบบอะลูมิเนียมอัลลอย หนัก 65 กรัม ขนาด 121 × 27.6 × 15.8 mm", en: "Aluminium alloy: 65g, 121 × 27.6 × 15.8 mm", zh: "铝合金款：65g，121 × 27.6 × 15.8 mm" }, specKey: "dimensions" },
        { text: { th: "แบบซิงค์อัลลอยกับหนัง หนัก 85 กรัม ขนาด 121 × 27.6 × 16.6 mm", en: "Zinc alloy and leather: 85g, 121 × 27.6 × 16.6 mm", zh: "锌合金皮革款：85g，121 × 27.6 × 16.6 mm" }, specKey: "dimensions" },
      ],
    },
    "menu": {
      title: { th: "ปุ่มเดียว สั่งงานได้หลายอย่าง", en: "One button, several settings", zh: "一个按键，多项设置" },
      subline: { th: "กดปุ่มกี่ครั้ง ก็จะเข้าการตั้งค่าคนละอย่างกัน", en: "A count of presses opens each setting.", zh: "按几下，就打开对应的设置。" },
      body: {
        th: "ปุ่มนี้เป็นปุ่มเดียวกับที่ใช้กดสลับโอห์ม จึงไม่ต้องจำว่าปุ่มไหนทำหน้าที่อะไร",
        en: "It's the same button you press to switch resistance, so there's only one to remember.",
        zh: "和切换阻值用的是同一个按键，只需记住这一个。",
      },
      points: [
        { text: { th: "กดปุ่มสามครั้ง เพื่อปรับวัตต์", en: "Press 3 times: set the wattage", zh: "按 3 下：调功率" }, specKey: "control" },
        { text: { th: "กดปุ่มห้าครั้งเพื่อเข้าเมนู ซึ่งมีปิดเครื่อง เปลี่ยนธีมหน้าจอ รีเซ็ตตัวนับพัฟ และล็อกหรือปลดล็อก", en: "Press 5 times: power off, theme, puff clear, lock", zh: "按 5 下：关机、主题、清除口数、锁定" }, specKey: "control" },
        { text: { th: "กดปุ่มค้างไว้ เพื่อเปิดหน้าจอคำแนะนำ", en: "Long press: the tips screen", zh: "长按：提示界面" }, specKey: "control" },
      ],
    },
    "fill": {
      title: { th: "เติมจากด้านบน และปรับลมได้เอง", en: "Fill from the top, set the airflow", zh: "顶部注油，调节进气" },
      subline: { th: "เติมน้ำยาได้โดยไม่ต้องถอดหัวพอตออกจากเครื่อง", en: "Refill without taking the pod out.", zh: "不用取下烟弹就能注油。" },
      body: {
        th: "เลื่อนปิดช่องลมจนสุดแล้วใช้คู่กับ 1.0 โอห์ม จะได้ MTL แบบแน่น เปิดไว้ครึ่งทางจะได้ MTL ที่สมดุล ส่วนเปิดจนสุดแล้วใช้คู่กับ 0.4 โอห์ม จะได้ RDL ที่ลมโล่ง",
        en: "Close the slider for a tight MTL draw with the 1.0Ω, leave it half open for a balanced MTL, or open it all the way for an airy RDL with the 0.4Ω.",
        zh: "关上滑块，配 1.0Ω 是紧致的 MTL；开一半是均衡的 MTL；全开配 0.4Ω 就是通透的 RDL。",
      },
      points: [
        { text: { th: "เติมด้านบน มีจุกซิลิโคนปิดช่องเติม", en: "Top fill under a silicone plug", zh: "顶部注油，配硅胶塞" }, specKey: "pod" },
        { text: { th: "ปุ่มเลื่อนปรับลมแบบไม่มีขั้น ปรับได้ตั้งแต่ MTL ถึง RDL", en: "Stepless airflow slider, MTL to RDL", zh: "无级进气滑块，从 MTL 到 RDL" }, specKey: "airflow" },
      ],
      link: { href: "/guides/choosing-wattage-and-airflow", label: { th: "อ่านวิธีเลือกวัตต์และช่องลม", en: "How to choose wattage and airflow", zh: "如何选择功率与进气量" } },
    },
    "pods": {
      title: { th: "ใส่หัวพอตตระกูล ARGUS ได้ทุกหัว", en: "The whole ARGUS pod family fits", zh: "整个 ARGUS 烟弹家族都能用" },
      subline: { th: "หัวพอต ARGUS ที่มีอยู่แล้ว ก็นำมาใช้กับเครื่องนี้ต่อได้", en: "ARGUS pods you already own carry over.", zh: "手上已有的 ARGUS 烟弹照样能用。" },
      body: {
        th: "หัวพอต Multi-Ohm ที่ให้มาในกล่อง ตัวหัวเป็น PCTG แบบใสที่ทนต่อการแตก",
        en: "The Multi-Ohm cartridge in the box is clear, shatter-resistant PCTG.",
        zh: "随附的 Multi-Ohm 烟弹采用透明、抗摔的 PCTG。",
      },
      points: [
        { text: { th: "หัวพอต Multi-Ohm จุน้ำยา 3.5mL (2mL ในเวอร์ชัน TPD)", en: "Multi-Ohm cartridge: 3.5mL (2mL in the TPD version)", zh: "Multi-Ohm 烟弹：3.5mL（TPD 版 2mL）" }, specKey: "pod" },
        { text: { th: "ใส่ Snap Cartridge และ Top Fill Cartridge V2 ทั้งขนาด 2mL และ 3mL ได้ด้วย รวมถึงหัวพอตรุ่น CRC", en: "Also fits: Snap Cartridge, Top Fill Cartridge V2 (2mL and 3mL), CRC versions", zh: "也能用：Snap 烟弹、Top Fill Cartridge V2（2mL 和 3mL）、CRC 版本" }, specKey: "pod-compat" },
      ],
    },
  },
  // Site-wide template round batch 3a (05/10): SALTHUB's own Zero Pro page + posters (_incoming/sitewide-template/3/
  // facts-zero-pro.md lists the source of each line); Thai = thai-copy 05/10.
  "zero-pro": {
    "intro": {
      title: { th: "ทำความรู้จัก Zero Pro", en: "The Zero Pro at a glance", zh: "Zero Pro 一览" },
      subline: { th: "SALTHUB เรียกเครื่องนี้ว่ากะทัดรัดและดูเรียบหรู", en: "SALTHUB calls it compact and elegant.", zh: "SALTHUB 称它小巧、优雅。" },
      body: {
        th: "เครื่องสองสีที่เห็นในโปสเตอร์ของ SALTHUB คือสี Silver-Grey และสี Blue-Purple Gradient",
        en: "The two on SALTHUB's poster are the Silver-Grey and the Blue-Purple Gradient.",
        zh: "SALTHUB 海报上的两支分别是 Silver-Grey 和 Blue-Purple Gradient。",
      },
    },
    "modes": {
      title: { th: "เลือกโหมดให้เข้ากับอารมณ์ในตอนนั้น", en: "Pick the mode you feel like", zh: "每种心情都有对应模式" },
      subline: { th: "SALTHUB เรียกระบบนี้ว่าการปรับวัตต์แบบอัจฉริยะ", en: "SALTHUB calls it intelligent power regulation.", zh: "SALTHUB 称之为智能功率调节。" },
      body: {
        th: "วันไหนอยากสูบเบา ๆ หรืออยากให้แรงขึ้นอีกหน่อย ก็สลับโหมดได้จากเครื่องเดียวกัน",
        en: "Change between a softer and a stronger draw on the same device.",
        zh: "同一台机器，就能在柔和与浓烈之间切换。",
      },
      points: [
        { text: { th: "โหมด Low-end · Mid-range · High-end", en: "Low-end · Mid-range · High-end", zh: "Low-end · Mid-range · High-end" }, specKey: "modes" },
      ],
    },
    "airflow": {
      title: { th: "ทางเดินของลม", en: "The path the air takes", zh: "进气路径" },
      subline: { th: "รับลมจากด้านข้าง ทางที่ลมต้องผ่านจึงสั้นลง", en: "Air comes in from the side, so it has less far to travel.", zh: "从侧面进气，气流路径更短。" },
      body: {
        th: "SALTHUB ระบุว่าแบบนี้ช่วยให้น้ำยากลายเป็นไอได้เต็มที่",
        en: "SALTHUB says that helps the liquid vaporise completely.",
        zh: "SALTHUB 表示这有助于烟油完全雾化。",
      },
      points: [
        { text: { th: "ช่องลมเข้าอยู่ด้านข้างตัวเครื่อง", en: "Side air intake", zh: "侧面进气口" }, specKey: "airflow" },
      ],
    },
    "battery": {
      title: { th: "แบตเตอรี่อยู่ในตัวเครื่อง", en: "A built-in battery", zh: "内置电池" },
      subline: { th: "ความจุ 380mAh", en: "380mAh.", zh: "容量 380mAh。" },
      body: {
        th: "SALTHUB ระบุว่าเครื่องนี้ชาร์จได้เร็ว เวลาแบตหมดจึงไม่ต้องรอนานก่อนจะกลับมาใช้ต่อ",
        en: "SALTHUB says it charges fast, so a flat battery shouldn't keep you waiting long.",
        zh: "SALTHUB 表示充电很快，没电时不用等太久就能接着用。",
      },
      points: [
        { text: { th: "ชาร์จผ่าน USB-C", en: "Charges over USB-C", zh: "USB-C 充电" }, specKey: "charging" },
      ],
    },
  },
  // Site-wide template round batch 3b (05/10): SALTHUB's own M Switch Kit page + posters (_incoming/sitewide-template/3/
  // facts-m-switch-kit.md lists the source of each line); Thai = thai-copy 05/10.
  "m-switch-kit": {
    "coil": {
      title: { th: "คอยล์ cotton mesh", en: "A cotton mesh coil", zh: "棉网线圈" },
      subline: { th: "คอยล์แบบนี้ใช้กับ M Switch", en: "This is the coil on the M Switch.", zh: "M Switch 用的就是这种线圈。" },
      body: {
        th: "SALTHUB ระบุว่าคอยล์แบบนี้ให้รสที่นุ่มมากและเต็มอิ่ม",
        en: "SALTHUB says it gives an incredibly smooth, satisfying taste.",
        zh: "SALTHUB 表示它能带来非常顺滑、满足的口感。",
      },
      points: [
        { text: { th: "หัวละสูงสุด 15,000 พัฟ", en: "Up to 15,000 puffs per pod", zh: "每颗烟弹最多 15,000 口" }, specKey: "puffs-per-pod" },
      ],
      link: { href: "/products/m-switch-pod", label: { th: "ดูกลิ่นของหัวพอตที่ใช้กับเครื่องนี้", en: "See the pod flavours", zh: "查看烟弹口味" } },
    },
    "charge": {
      title: { th: "แบตเตอรี่และการชาร์จ", en: "Battery and charging", zh: "电池与充电" },
      subline: { th: "SALTHUB ระบุว่าแบตใช้งานได้นานขึ้น", en: "SALTHUB says the battery lasts longer.", zh: "SALTHUB 表示续航更久。" },
      body: {
        th: "ระหว่างชาร์จ รูปสายฟ้าบนหน้าจอจะกะพริบ จึงเห็นได้ทันทีว่าไฟกำลังเข้า",
        en: "While it charges, a lightning mark flashes on the screen, so you can see it is charging.",
        zh: "充电时，屏幕上的闪电标志会闪烁，一看就知道正在充电。",
      },
      points: [
        { text: { th: "ช่องชาร์จ USB-C", en: "USB-C charging port", zh: "USB-C 充电口" }, specKey: "charging" },
      ],
    },
    "airflow": {
      title: { th: "ปรับช่องลมได้เอง", en: "Set the airflow", zh: "调节进气" },
      subline: { th: "เลื่อนปุ่มปรับลมได้ตามต้องการ", en: "Slide the valve to adjust the airflow.", zh: "推动阀门调节进气。" },
      body: {
        th: "SALTHUB ระบุว่าปุ่มนี้ปรับลมได้อย่างแม่นยำ จึงตั้งลมให้พอดีกับความชอบของตัวเองได้",
        en: "SALTHUB says the slider lets you set the airflow precisely.",
        zh: "SALTHUB 表示这个滑块可以精确调节进气量。",
      },
      points: [
        { text: { th: "ปุ่มเลื่อนปรับลมข้างตัวเครื่อง", en: "Airflow adjust valve", zh: "进气调节阀" }, specKey: "airflow" },
      ],
      link: { href: "/guides/choosing-wattage-and-airflow", label: { th: "อ่านวิธีเลือกวัตต์และช่องลม", en: "How to choose wattage and airflow", zh: "如何选择功率与进气量" } },
    },
    "screen": {
      title: { th: "หน้าจอดิจิทัล", en: "A digital screen", zh: "数字屏幕" },
      subline: { th: "บอกแบตที่เหลือไว้ให้ดูตลอดเวลา", en: "It always shows what's left.", zh: "随时显示剩余电量。" },
      body: {
        th: "เมื่อชาร์จเต็ม หน้าจอจะขึ้น 100% แล้วดับไปหลังจากนั้น 1 วินาที",
        en: "At a full charge it shows 100% and switches off a second later.",
        zh: "充满时显示 100%，一秒后熄灭。",
      },
      points: [
        { text: { th: "แสดงแบตเป็นตัวเลขเปอร์เซ็นต์", en: "Battery shown as a percentage", zh: "电量以百分比显示" }, specKey: "screen" },
      ],
    },
    "lanyard": {
      title: { th: "มีสายคล้องคอมาให้", en: "Comes with a lanyard", zh: "附挂绳" },
      subline: { th: "คล้องคอไว้ พกติดตัวไปไหนก็สะดวก", en: "Wear it round your neck and it's always to hand.", zh: "挂在脖子上，随身携带很方便。" },
      body: {
        th: "SALTHUB ระบุว่าคล้องไว้เป็นเครื่องประดับที่ดูทันสมัยได้ด้วย",
        en: "SALTHUB suggests wearing it as an accessory.",
        zh: "SALTHUB 建议把它当作配饰佩戴。",
      },
    },
  },
  // Site-wide template round batch 4a (06/10): JOIWAY's own F3 posters (_incoming/sitewide-template/4/facts-joiway-f3.md lists
  // the source of each line); Thai = thai-copy 06/10.
  "joiway-f3": {
    "airflow": {
      title: { th: "ตั้งลมได้ตามที่ชอบ", en: "Set the airflow to suit you", zh: "按自己的喜好调节进气" },
      subline: { th: "ช่องลมอยู่ที่ฐานเครื่อง", en: "The airflow sits at the base of the device.", zh: "进气口位于机身底部。" },
      body: {
        th: "เปิดช่องลมให้กว้าง ลมจะโล่งและดูดได้เบาขึ้น ถ้าปรับให้แคบลง ลมจะแน่นขึ้น",
        en: "Open it for a looser draw, close it down for a tighter one.",
        zh: "开大吸感更松，关小吸感更紧。",
      },
    },
    "charging": {
      title: { th: "ชาร์จแบตได้", en: "Charge it when it runs low", zh: "没电可以再充" },
      subline: { th: "แบตหมดก่อนน้ำยา ก็ไม่ต้องทิ้งทั้งเครื่อง", en: "If the battery runs out before the liquid, you don't have to throw the device away.", zh: "电池比烟油先用完，也不必整支丢掉。" },
      body: {
        th: "เสียบสายชาร์จไว้สักพัก แล้วก็สูบน้ำยาที่ยังเหลืออยู่ต่อได้",
        en: "Plug it in for a while, then keep going with the liquid that's left.",
        zh: "插上线充一会儿，剩下的烟油就能继续用。",
      },
      points: [
        { text: { th: "ช่องชาร์จ USB-C", en: "USB-C charging", zh: "USB-C 充电" }, specKey: "charging" },
      ],
    },
    "tank": {
      title: { th: "ดูน้ำยาได้ทุกเมื่อ", en: "See what's left", zh: "余量一目了然" },
      subline: { th: "ถังน้ำยาอยู่ส่วนบนของเครื่อง ใต้ปากดูด", en: "The tank sits at the top, just below the mouthpiece.", zh: "油仓在机身上部，烟嘴下方。" },
      body: {
        th: "น้ำยาเหลือเท่าไหร่ก็เห็นได้ด้วยตา ไม่ต้องเดา และรู้ก่อนว่าใกล้ถึงเวลาเปลี่ยนเครื่องใหม่",
        en: "You can see how much liquid is left without guessing, and know ahead of time when you'll need a new one.",
        zh: "还剩多少一眼就能看到，不用猜，也能提前知道快要换新的了。",
      },
      points: [
        { text: { th: "ถังน้ำยาโปร่งใส มองเห็นได้รอบ 360°", en: "Transparent tank, 360° view", zh: "透明油仓，360° 可视" } },
      ],
    },
    "coil": {
      title: { th: "นาโนคอยล์", en: "A nano coil", zh: "纳米线圈" },
      subline: { th: "JOIWAY ระบุว่าเป็นคอยล์ที่อัปเดตมาเป็นเทคโนโลยีแบบใหม่", en: "JOIWAY describes it as updated, new technology.", zh: "JOIWAY 称之为升级的新技术。" },
      body: {
        th: "คอยล์ติดมากับตัวเครื่องตั้งแต่แรก จึงไม่ต้องซื้อหรือเปลี่ยนคอยล์เองตลอดการใช้งาน",
        en: "It comes built in, so there is no coil to buy or change for as long as you use it.",
        zh: "线圈出厂就装在机身里，用到最后都不用自己买或换线圈。",
      },
    },
    "lights": {
      title: { th: "ไฟหลากสี", en: "Colourful lights", zh: "多彩灯光" },
      subline: { th: "JOIWAY ระบุว่าไฟจะกะพริบระหว่างใช้งาน", en: "JOIWAY says the lights flash while it's in use.", zh: "JOIWAY 表示使用时灯会闪烁。" },
      body: {
        th: "ในภาพ แสงเรืองขึ้นรอบถังน้ำยา ทำให้เครื่องดูมีสีสันขึ้นเวลาสูบ",
        en: "In the picture the glow comes up around the tank, which gives the device a splash of colour as you vape.",
        zh: "图中光从油仓一圈透出来，抽的时候机身更有色彩。",
      },
    },
  },
  // Site-wide template round batch 4c (06/10): RELX's own Smash Go 12K page + pictures (_incoming/sitewide-template/4/
  // facts-relx-smash-go-12k.md); Thai = thai-copy 06/10.
  "relx-smash-go-12k": {
    "inside": {
      title: { th: "สิ่งที่อยู่ข้างในเครื่อง", en: "What's inside", zh: "内部配置" },
      subline: { th: "ภาพจาก RELX ให้เห็นคอยล์ที่อยู่ข้างในแบบใกล้ ๆ", en: "RELX shows its coil up close.", zh: "RELX 展示了线圈的特写。" },
      body: {
        th: "เครื่องนี้สูบได้สูงสุด 12,000 พัฟ และแบตเตอรี่ 400mAh ชาร์จซ้ำได้",
        en: "Up to 12,000 puffs, on a 400mAh battery you can recharge.",
        zh: "最多 12,000 口，400mAh 电池可以充电。",
      },
      points: [
        { text: { th: "บรรจุน้ำยา 20mL", en: "20mL e-liquid", zh: "20mL 烟油" }, specKey: "capacity" },
      ],
    },
    "pocket": {
      title: { th: "สูบสบายปาก พกไปได้ทุกที่", en: "Comfortable to vape, easy to carry", zh: "吸着舒服，带着方便" },
      subline: { th: "RELX ออกแบบปากดูดมาให้สูบได้สบายปาก", en: "RELX designed the mouthpiece to be comfortable on the lips.", zh: "RELX 把吸嘴设计得抽起来很舒服。" },
      body: {
        th: "ตัวเครื่องมีขนาดพอดีกระเป๋ากางเกง จะออกไปไหนก็หยิบติดตัวไปได้สะดวก",
        en: "It's pocket-sized, so it comes along wherever you go.",
        zh: "机身只有口袋大小，去哪儿都能随手带上。",
      },
    },
  },
  // Site-wide template round batch 4d (06/10): RELX's own Creator Pro Device page + pictures (_incoming/sitewide-template/4/
  // facts-relx-creator.md); Thai = thai-copy 06/10.
  "relx-creator": {
    "button": {
      title: { th: "กดปุ่มดูแบตได้ทุกเมื่อ", en: "Check the battery any time", zh: "随时查看电量" },
      subline: { th: "RELX ให้กดปุ่มครั้งเดียว เพื่อดูแบตที่เหลืออยู่บนจอ", en: "RELX set it up so one click shows the battery level on the screen.", zh: "RELX 的设计是按一下按键，屏幕就显示剩余电量。" },
      body: {
        th: "ก่อนออกจากบ้านกดดูสักครั้ง ก็รู้ได้ว่าแบตยังเหลืออยู่มากหรือใกล้หมดแล้ว ไม่ต้องเดาเอาเอง",
        en: "Check before you head out and you'll know whether there's plenty left or it's nearly flat, without guessing.",
        zh: "出门前按一下，就知道电量还很足还是快用完了，不用靠猜。",
      },
      points: [
        { text: { th: "แบตเตอรี่ 800mAh", en: "800mAh battery", zh: "800mAh 电池" }, specKey: "battery" },
      ],
    },
    "modes": {
      title: { th: "โหมด Normal และ Boost", en: "Normal or Boost, your choice", zh: "Normal 与 Boost 任你选" },
      subline: { th: "RELX ให้กดปุ่มสองครั้งติดกัน เพื่อสลับไปมาระหว่างสองโหมดนี้", en: "RELX set it up so a double click on the button switches between the two.", zh: "RELX 的设计是连按两下按键，在两种模式之间切换。" },
      body: {
        th: "แต่ละโหมดจะขึ้นภาพบนจอไม่เหมือนกัน เห็นแล้วก็รู้ทันทีว่าตอนนี้เครื่องใช้โหมดไหนอยู่",
        en: "Each mode puts a different picture on the screen, so a quick glance tells you which one is on.",
        zh: "每个模式在屏幕上显示的图案不同，看一眼就知道现在用的是哪一档。",
      },
      points: [
        { text: { th: "Normal 15 วัตต์ / Boost 25 วัตต์", en: "15W Normal / 25W Boost", zh: "15W Normal / 25W Boost" }, specKey: "modes" },
      ],
    },
    "airflow": {
      title: { th: "ปรับลมได้เองตามที่ชอบ", en: "Set your airflow", zh: "进气按自己的喜好调" },
      subline: { th: "RELX ให้ปรับช่องลมได้ ตั้งแต่เปิดเต็มที่ไปจนถึงแคบมาก", en: "RELX lets you set the airflow anywhere from fully open to its tightest.", zh: "RELX 的进气可以从全开一直调到最紧。" },
      body: {
        th: "ชอบดูดเบา ๆ ก็เปิดไว้กว้าง ชอบลมแน่นก็ปรับให้แคบ ตั้งไว้ตรงที่สูบแล้วสบายได้เลย",
        en: "Open it up for a light, easy draw, or narrow it for a tighter one, and leave it where it feels right.",
        zh: "想吸得轻松就开大，喜欢紧一点就调小，停在自己舒服的位置就好。",
      },
    },
  },
  // Site-wide template round batch 5a (06/10): WOTOFO's own nexBAR 18K page + pictures (_incoming/sitewide-template/5/
  // facts-wotofo-nexbar-18k.md); Thai = thai-copy 06/10.
  "wotofo-nexbar-18k": {
    "screen": {
      title: { th: "จอบอกสถานะของเครื่อง", en: "What the screen tells you", zh: "屏幕告诉你什么" },
      subline: { th: "WOTOFO ให้จอ LED บอกแบตเตอรี่ น้ำยาที่เหลือ และโหมดที่ใช้อยู่", en: "WOTOFO's LED screen shows the battery, the e-liquid left and the mode you're in.", zh: "WOTOFO 的 LED 屏幕会显示电量、剩余烟油和当前模式。" },
      body: {
        th: "แบตหรือน้ำยาใกล้หมดเมื่อไหร่ จอก็บอกให้รู้ก่อน",
        en: "When the battery or the e-liquid is getting low, the screen tells you first.",
        zh: "电量或烟油快用完时，屏幕会先告诉你。",
      },
      points: [
        { text: { th: "NORM 16 วัตต์ / TURBO 19 วัตต์", en: "NORM 16W / TURBO 19W", zh: "NORM 16W / TURBO 19W" }, specKey: "modes" },
        { text: { th: "แบตเตอรี่แสดงเป็นเปอร์เซ็นต์", en: "Battery shown as a percentage", zh: "电量以百分比显示" } },
      ],
    },
    "mouthpiece": {
      title: { th: "ปากดูดที่รับกับริมฝีปาก", en: "Shaped for your lips", zh: "贴合嘴唇的吸嘴" },
      subline: { th: "WOTOFO เลือกใช้ซิลิโคนทำปากดูดของรุ่นนี้", en: "WOTOFO made this model's mouthpiece from silicone.", zh: "WOTOFO 这款的吸嘴采用硅胶。" },
      body: {
        th: "เวลาสูบจึงรู้สึกสบายปาก",
        en: "It feels comfortable on the lips when you vape.",
        zh: "抽的时候，含在嘴里很舒服。",
      },
    },
    "airflow": {
      title: { th: "ตั้งลมได้ตามที่ชอบ", en: "Set the airflow the way you like", zh: "进气松紧自己选" },
      subline: { th: "WOTOFO ทำปุ่มเลื่อนปรับลมมาให้ตัวใหญ่ หาเจอง่ายและปรับได้สะดวก", en: "WOTOFO made the airflow slider large, so it's easy to find and adjust.", zh: "WOTOFO 把进气滑块做得比较大，好找也好调。" },
      body: {
        th: "ชอบดูดเบา ๆ ให้ลมโล่ง หรือชอบให้ลมแน่นขึ้นอีกนิด ก็เลือกแบบที่สูบแล้วสบายได้เลย",
        en: "Prefer a loose, easy draw, or something a little tighter? Pick whichever feels comfortable.",
        zh: "喜欢松一点、吸着轻的，还是想再紧一点，选自己抽着舒服的那一档就好。",
      },
      points: [
        { text: { th: "ปุ่มยาวมีร่อง อยู่ที่ก้นพอต", en: "Long, grooved slider on the base", zh: "带凹槽的长滑块，位于底部" } },
      ],
    },
  },
  // Site-wide template round batch 3c (06/10): SALTHUB's own M Bar 10K posters (_incoming/sitewide-template/3/
  // facts-m-bar-10k.md lists the source of each line); Thai = thai-copy 05–06/10.
  "m-bar-10k": {
    "elegance": {
      title: { th: "ดีไซน์เรียบหรู", en: "A refined, understated design", zh: "简约精致的设计" },
      subline: { th: "SALTHUB ระบุว่าทำรุ่นนี้มาเพื่อคนที่มีรสนิยม", en: "SALTHUB made it \"for those who know elegance\".", zh: "SALTHUB 说它是\"为懂得优雅的人而做\"。" },
      body: {
        th: "นอกจากหน้าตาแล้ว ยังปรับลมให้แน่นหรือโล่งได้เอง ตามความชอบและการใช้งานของแต่ละคน",
        en: "Beyond the looks, you can set the draw as tight or as open as you like, to suit the way you vape.",
        zh: "除了外观，吸阻松紧也可以自己调，按个人习惯和用法来定。",
      },
    },
    "bottle": {
      title: { th: "ทรงขวดน้ำยา ฐานไล่สี", en: "An e-liquid bottle shape", zh: "烟油瓶造型" },
      subline: { th: "SALTHUB เรียกดีไซน์นี้ว่าความหรูที่ไม่ต้องโชว์", en: "SALTHUB calls it understated luxury.", zh: "SALTHUB 称之为低调的奢华。" },
      body: {
        th: "เวลาพกไว้หลายกลิ่น แค่ดูสีที่ฐาน ก็พอแยกได้ว่าเครื่องไหนกลิ่นอะไร",
        en: "Carry a few flavours and the colour at the base is enough to tell which is which.",
        zh: "同时带着几种口味时，看一眼底部的颜色，大致就能分出哪支是什么口味。",
      },
    },
    "display": {
      title: { th: "ไฟบอกระดับแบต", en: "Battery level lights", zh: "电量指示灯" },
      subline: { th: "ดูได้ทันทีว่าแบตยังเหลืออยู่เท่าไหร่", en: "See how much battery is left at a glance.", zh: "剩余电量一眼就能看到。" },
      body: {
        th: "ไฟ LED สี่ดวงบอกแบตทีละ 25% เหลือดวงสุดท้ายเมื่อไหร่ ก็รู้ว่าแบตใกล้หมดแล้ว",
        en: "Four LEDs show the battery a quarter at a time, so when only one is lit, you know it is running low.",
        zh: "四颗 LED 按每格 25% 显示电量，只剩一颗亮时，就说明电量快用完了。",
      },
    },
    "modes": {
      title: { th: "เลือกความแรงได้เอง", en: "Your tempo, your call", zh: "节奏由你" },
      subline: { th: "แค่กดปุ่มด้านล่างตัวเครื่องสองครั้งติดกัน ก็สลับโหมดได้", en: "Double-click the button at the bottom.", zh: "双击底部按键。" },
      body: {
        th: "สลับโหมดไปมากี่ครั้งก็ได้ อยากให้เบาลงหรือแรงขึ้นตอนไหน ก็เปลี่ยนได้ทันทีตามความต้องการ",
        en: "Switch back and forth as often as you like, so the draw can be gentler or stronger whenever you want.",
        zh: "模式可以随时来回切换，想轻一点或强一点，随时都能换。",
      },
      points: [
        { text: { th: "โหมด Eco · Soft · Boost", en: "Eco · Soft · Boost", zh: "Eco · Soft · Boost" }, specKey: "modes" },
      ],
    },
    "nonstop": {
      title: { th: "สูบได้ต่อเนื่อง", en: "Built to keep going", zh: "持续发挥" },
      subline: { th: "SALTHUB ระบุว่ารุ่นนี้สูบได้สม่ำเสมอ ตั้งแต่พัฟแรกไปจนถึงพัฟสุดท้าย", en: "SALTHUB says it performs the same from the first draw to the last.", zh: "SALTHUB 表示从第一口到最后一口表现一致。" },
      body: {
        th: "จำนวนพัฟเป็นตัวเลขที่ผู้ผลิตให้ไว้ ใช้จริงจะได้เท่าไหร่ ขึ้นอยู่กับว่าแต่ละคนสูบถี่และสูบยาวแค่ไหน",
        en: "The puff count is the maker's figure; how many you actually get depends on how often and how long each person draws.",
        zh: "口数是厂家给出的数字，实际能抽多少，要看每个人抽得多频繁、每口多长。",
      },
    },
  },
};
