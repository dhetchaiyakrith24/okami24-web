import type { ArticleReviewVideo, Guide, StoryImage } from "@/types/catalog";

/**
 * Section clips (owner 05/10: "เรามีคลิป Youtube ถ้ามีใส่คั่นไว้ในแต่ละหัวข้อด้วย"; owner 19/10 "1 เรื่อง 1 บทความ · 1 คลิปหลักต่อหน้า" =
 * a guide shows ONE clip: its reviewVideo, or — for a guide without one — a single section clip). Only the shop's own three channels
 * (@OKMYARZ · @OKM_24 · @PODSYSTEM-OKAMI-II); each clip sits under the one section whose subject is exactly its model.
 * Title / channel / upload date: the four already on product records were confirmed via YouTube oEmbed when they were
 * added (products/*.ts); G4 Pro KOKO read from YouTube's own player data on 2026-10-05 (videoDetails + microformat).
 * Searched 05/10 for Caliburn G5 / G4 / G4 Mini / G5 Lite / G4 Classic / G3 Pro clips on all three channels: none.
 */
export const SECTION_CLIPS = {
  caliburnG4Pro: { videoId: "Hpifl9weNTc", title: "หลังใช้งาน UWELL CALIBURN G4 PRO ตัวจบพร้อมระบบสัมผัส!", channelName: "OKM YARZ", publishedAt: "2026-08-14" },
  argusG4: { videoId: "eUdbZyvV4Y0", title: "หลังใช้งาน VOOPOO ARGUS G4 เปลี่ยนค่าโอห์มได้ในหัวเดียว!", channelName: "OKAMI", publishedAt: "2026-08-15" },
  mSwitch: { videoId: "DaJHk4e6_Y8", title: "30 วันกับ M SWITCH 15K เป็นยังไงบ้าง? (หัวรุ่นแรก)", channelName: "POD SYSTEM OKAMI II", publishedAt: "2026-04-12" },
} satisfies Record<string, ArticleReviewVideo>;

const VOOPOO_SHOP = "https://shop.voopoo.com/products/";

/**
 * Section posters (owner 16/10: "ในหน้าพวกบทความเรามีรูปประกอบหรือวีดีโอใส่ลงไปหน่อยดีมั้ย"). Every file, size, source
 * and credit is the same poster the product page already shows (products/*.ts `features[].image`) — no new renders;
 * each sits under the one section whose subject is exactly what the poster shows. Alt = Thai (Thai-only guides and the TH
 * arrays); the en / zh arrays of translated guides use SECTION_IMAGES_EN / _ZH below.
 */
export const SECTION_IMAGES = {
  drag6Battery: { src: "/assets/products/drag-6/story-battery-v2.webp", alt: "โปสเตอร์ของ VOOPOO: DRAG 6 กับแบตในตัว 4400mAh ที่เห็นผ่านตัวเครื่อง", sourceName: "VOOPOO", sourceUrl: `${VOOPOO_SHOP}drag-6`, width: 1600, height: 1600 },
  dragX3Unlock: { src: "/assets/products/drag-x3/story-unlock-v2.webp", alt: "โปสเตอร์ของ VOOPOO: DRAG X3 ปลดล็อกได้ด้วยการแตะเซนเซอร์ กดปุ่ม หรือตั้งให้ปลดล็อกค้างไว้", sourceName: "VOOPOO", sourceUrl: `${VOOPOO_SHOP}drag-x3`, width: 1600, height: 824 },
  dragS3Coils: { src: "/assets/products/drag-s3/story-coils.webp", alt: "โปสเตอร์ของ VOOPOO: หัวพอต PnP X และคอยล์ของ DRAG S3 ตั้งแต่ 0.15 ถึง 1.0 โอห์ม", sourceName: "VOOPOO", sourceUrl: `${VOOPOO_SHOP}drag-s3`, width: 1024, height: 1385 },
  drag6Airflow: { src: "/assets/products/drag-6/story-tank-v2.webp", alt: "โปสเตอร์ของ VOOPOO: ช่องลม Golden Triangle แหวนปรับลม และการเติมน้ำยาด้านบนของ DRAG 6", sourceName: "VOOPOO", sourceUrl: `${VOOPOO_SHOP}drag-6`, width: 1600, height: 706 },
  argusP3Touch: { src: "/assets/products/argus-p3/story-touch.webp", alt: "โปสเตอร์ของ VOOPOO: จอทัชของ ARGUS P3 แสดงข้อมูลการสูบ หน้าปัด และโหมดต่าง ๆ", sourceName: "VOOPOO", sourceUrl: `${VOOPOO_SHOP}argus-p3`, width: 1024, height: 1193 },
  argusG4Ohm: { src: "/assets/products/argus-g4/story-ohm-v3.webp", alt: "โปสเตอร์ของ VOOPOO: หัว Multi-Ohm ของ ARGUS G4 พลิกหัวเพื่อสลับ 1.0 กับ 0.7 โอห์ม กดปุ่มสองครั้งเพื่อใช้ 0.4 โอห์ม", sourceName: "VOOPOO", sourceUrl: `${VOOPOO_SHOP}argus-g4`, width: 1592, height: 1367 },
  argusG4Battery: { src: "/assets/products/argus-g4/story-battery-v2.webp", alt: "โปสเตอร์ของ VOOPOO: แบต 1650mAh ของ ARGUS G4 ที่เห็นผ่านตัวเครื่อง", sourceName: "VOOPOO", sourceUrl: `${VOOPOO_SHOP}argus-g4`, width: 1590, height: 1098 },
  argusPods: { src: "/assets/products/argus-g4/story-pods.webp", alt: "โปสเตอร์ของ VOOPOO: หัวพอตตระกูล ARGUS ใช้ร่วมกันได้ ทั้งหัว 3.5mL และ 2mL", sourceName: "VOOPOO", sourceUrl: `${VOOPOO_SHOP}argus-g4`, width: 1600, height: 900 },
  nexbar18kScreen: { src: "/assets/products/wotofo-nexbar-18k/story-screen.webp", alt: "ภาพของ WOTOFO: จอ LED ของ nexBAR 18K", sourceName: "WOTOFO", sourceUrl: "https://www.wotofo.com/products/wotofo-nexbar-18k", width: 1600, height: 1600 },
  mBar10kModes: { src: "/assets/products/m-bar-10k/story-modes.webp", alt: "โปสเตอร์ของ SALTHUB: M Bar 10K กดปุ่มด้านล่างสองครั้งเพื่อสลับโหมด Eco · Soft · Boost", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/mbar-10k/", width: 1920, height: 1078 },
  joiwayF4Twin: { src: "/assets/products/joiway-f4/story-twin.webp", alt: "โปสเตอร์ของ JOIWAY: Joiway F4 มีปากดูดสองฝั่ง ฝั่งละหนึ่งกลิ่น", sourceName: "JOIWAY", sourceUrl: "https://thai.myjoiway.com/", width: 1600, height: 809 },
  tfitBattery: { src: "/assets/products/tfit-m-power-20k/story-battery.webp", alt: "โปสเตอร์ของ TFIT: M Power 20K ชาร์จผ่านสาย USB-C ที่ฐานเครื่อง", sourceName: "TFIT", sourceUrl: "https://www.tfitvape.com/", width: 1600, height: 792 },
  relxSmashGoPocket: { src: "/assets/products/relx-smash-go-12k/story-pocket.webp", alt: "ภาพของ RELX: Smash Go 12K ขนาดพอดีกระเป๋า และปากดูดที่ออกแบบให้สูบสบาย", sourceName: "RELX", sourceUrl: "https://relxnow.com/products/relx-smash-go-12k", width: 1224, height: 1224 },
  mBar15kSwap: { src: "/assets/products/m-bar-15k/story-swap.webp", alt: "โปสเตอร์ของ SALTHUB: หัวพอต M Switch Pod แบบใสกำลังเสียบเข้ากับตัวเครื่อง M Switch", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/m-bar-15k/", width: 1600, height: 988 },
  mSwitchScreen: { src: "/assets/products/m-switch-kit/story-screen.webp", alt: "โปสเตอร์ของ SALTHUB: จอของ M Switch บอกระดับแบต สถานะกำลังชาร์จ และชาร์จเต็ม", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/m-switch-kit/", width: 1600, height: 988 },
  zeroProModes: { src: "/assets/products/zero-pro/story-modes.webp", alt: "โปสเตอร์ของ SALTHUB: Zero Pro มี 3 โหมด Low-end · Mid-range · High-end", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/zero-pro/", width: 1600, height: 853 },
  mSwitchLanyard: { src: "/assets/products/m-switch-kit/story-lanyard.webp", alt: "โปสเตอร์ของ SALTHUB: M Switch มาพร้อมสายคล้องคอ", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/m-switch-kit/", width: 1600, height: 988 },
  caliburnG4ProOneTap: { src: "/assets/products/caliburn-g4-pro/story-one-tap.webp", alt: "ภาพจากคลิปของ UWELL: สลับโหมดบนจอทัชของ Caliburn G4 Pro", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-pro", width: 1600, height: 900 },
  caliburnG5Battery: { src: "/assets/products/caliburn-g5/story-battery-v4.webp", alt: "โปสเตอร์ของ UWELL: แบต 1600mAh ของ Caliburn G5", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5", width: 2413, height: 1131, transparent: true },
  caliburnG5TripleTap: { src: "/assets/products/caliburn-g5/story-triple-tap.webp", alt: "ภาพของ UWELL: นิ้วแตะตัวเครื่อง Caliburn G5 ซึ่งเป็นวิธีสลับโหมดของรุ่นนี้", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g5", width: 1050, height: 613 },
  mSwitchCharge: { src: "/assets/products/m-switch-kit/story-charge.webp", alt: "โปสเตอร์ของ SALTHUB: ช่องชาร์จ Type-C และจอบอกระดับแบตของ M Switch", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/m-switch-kit/", width: 1600, height: 988 },
  mSwitchAirflow: { src: "/assets/products/m-switch-kit/story-airflow.webp", alt: "โปสเตอร์ของ SALTHUB: ปุ่มปรับลมของ M Switch", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/m-switch-kit/", width: 1600, height: 988 },
  argusG4Fill: { src: "/assets/products/argus-g4/story-fill-v2.webp", alt: "โปสเตอร์ของ VOOPOO: ARGUS G4 เติมน้ำยาด้านบน และปุ่มเลื่อนปรับลม", sourceName: "VOOPOO", sourceUrl: `${VOOPOO_SHOP}argus-g4`, width: 1591, height: 609 },
  argusG3MiniTiny: { src: "/assets/products/argus-g3-mini/story-tiny.webp", alt: "โปสเตอร์ของ VOOPOO: ARGUS G3 mini แบต 1350mAh หนัก 40.85 กรัม", sourceName: "VOOPOO", sourceUrl: `${VOOPOO_SHOP}argus-g3-mini`, width: 1600, height: 1149 },
  caliburnG4ProKokoModes: { src: "/assets/products/caliburn-g4-pro-koko/story-modes.webp", alt: "ภาพจากคลิปของ UWELL: หน้าจอโหมด Customize ของ Caliburn G4 Pro KOKO ปรับไฟช่วงต้น กลาง และท้ายของการสูบแต่ละครั้ง", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-pro-koko", width: 1200, height: 1013 },
  dragX3Screen: { src: "/assets/products/drag-x3/story-screen-v2.webp", alt: "โปสเตอร์ของ VOOPOO: จอทัช 1.66 นิ้วของ DRAG X3 และหัวพอต PnP X", sourceName: "VOOPOO", sourceUrl: `${VOOPOO_SHOP}drag-x3`, width: 1600, height: 1161 },
  // Guide-media batch 1 (19/10, owner 17/10 "ลงรูป + คลิป ตามบทความที่เราเขียนเพื่อ Seo"): same posters the product pages show.
  caliburnG4AntiLeak: { src: "/assets/products/caliburn-g4/story-anti-leak.webp", alt: "ภาพของ UWELL: ข้างในหัวพอต GPP ที่เชื่อมปิดด้วยคลื่นอัลตราโซนิก และช่องรูปตัว U ที่กันน้ำยารั่ว", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4", width: 2693, height: 955 },
  caliburnG4ClassicRefill: { src: "/assets/products/caliburn-g4-classic/story-pods.webp", alt: "ภาพของ UWELL: เติมน้ำยาเข้าหัวพอตของ Caliburn G4 Classic โดยไม่ต้องถอดหัวพอตออก", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-classic", width: 1162, height: 834 },
  vmateI3Family: { src: "/assets/products/vmate-i3/story-family.webp", alt: "โปสเตอร์ของ VOOPOO: หัวพอตตระกูล VMATE แต่ละค่าโอห์มบอกช่วงวัตต์ และบอกว่าเหมาะกับน้ำยา Freebase หรือ Nic Salt", sourceName: "VOOPOO", sourceUrl: `${VOOPOO_SHOP}vmate-i3`, width: 1024, height: 1065 },
  caliburnG4ProBattery: { src: "/assets/products/caliburn-g4-pro/story-battery.webp", alt: "ภาพจากคลิปของ UWELL: Caliburn G4 Pro แบต 1800mAh ที่ผู้ผลิตระบุว่าใช้ได้สูงสุด 7 วัน", sourceName: "UWELL", sourceUrl: "https://www.myuwell.com/caliburn/caliburn-g4-pro", width: 1800, height: 1333 },
  argusG3MiniCartridge: { src: "/assets/products/argus-g3-mini/story-cartridge.webp", alt: "โปสเตอร์ของ VOOPOO: หัวพอต ARGUS Top Fill Cartridge V2 ขนาด 3mL และ 2mL มี 0.4 · 0.7 และ 1.0 โอห์ม", sourceName: "VOOPOO", sourceUrl: `${VOOPOO_SHOP}argus-g3-mini`, width: 1024, height: 1056 },
  mBar10kNonstop: { src: "/assets/products/m-bar-10k/story-nonstop.webp", alt: "โปสเตอร์ของ SALTHUB: M Bar 10K สูงสุด 10,000 พัฟ", sourceName: "SALTHUB", sourceUrl: "https://www.salthub.com/mbar-10k/", width: 1920, height: 1079 },
  dragX3Battery: { src: "/assets/products/drag-x3/story-battery-v2.webp", alt: "โปสเตอร์ของ VOOPOO: DRAG X3 ใช้ถ่าน 18650 หรือ 21700 และมีเซนเซอร์แตะปลดล็อก", sourceName: "VOOPOO", sourceUrl: `${VOOPOO_SHOP}drag-x3`, width: 1600, height: 1161 },
  // SEO push 27/10 batch 3: the official IQOS photos the ILUMA product pages already show (IQOS (official brand site), see
  // active-catalog-to-product-master.ts variant media) — for the three IQOS guides that had no picture.
  ilumaIOne: { src: "/assets/products/iqosheet-17/variant-midnight-black.webp", alt: "ภาพของ IQOS: ILUMA i ONE สี Midnight Black เครื่องชิ้นเดียวที่สูบได้ในตัว", sourceName: "IQOS", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-one-kit-midnight-black.html", width: 1000, height: 1000, transparent: true },
  ilumaI: { src: "/assets/products/iqosheet-18/variants/IQOSHEET-18-1-v2.webp", alt: "ภาพของ IQOS: ILUMA i สี Midnight Black ที่ชาร์จพกพา Pocket Charger กับ Holder ที่มีจอทัช", sourceName: "IQOS", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-kit-midnight-black.html", width: 1613, height: 1238, transparent: true },
  ilumaIPrime: { src: "/assets/products/iqosheet-16/variants/IQOSHEET-16-1-v2.webp", alt: "ภาพของ IQOS: ILUMA i PRIME สี Midnight Black ที่ชาร์จพกพาหุ้มผ้า กับ Holder ที่มีจอทัช", sourceName: "IQOS", sourceUrl: "https://www.iqos.com/ph/en/shop/iluma-i-prime-kit-midnight-black.html", width: 1772, height: 1173, transparent: true },
} satisfies Record<string, StoryImage>;

type SectionImageKey = keyof typeof SECTION_IMAGES;
/** The same poster with the alt of another locale — a translated guide repeats `image` in each locale's array (GuideSection.image). */
function sectionImagesIn<K extends SectionImageKey>(alts: Record<K, string>): Record<K, StoryImage> {
  return Object.fromEntries((Object.keys(alts) as K[]).map((k) => [k, { ...SECTION_IMAGES[k], alt: alts[k] }])) as Record<K, StoryImage>;
}

/** English alts for the posters in the guides that have en/th/zh arrays (round "SEO all keys", 16/10). Thai = SECTION_IMAGES. */
export const SECTION_IMAGES_EN = sectionImagesIn({
  vmateI3Family: "VOOPOO's VMATE pod chart — each resistance with its wattage range and whether it suits freebase or nic salt",
  caliburnG4ClassicRefill: "UWELL's render — filling the Caliburn G4 Classic pod without taking it out",
  argusG3MiniTiny: "VOOPOO's ARGUS G3 mini poster — a 1350mAh battery and 40.85 g",
  mBar10kModes: "SALTHUB's M Bar 10K poster — double-click the bottom button to switch Eco / Soft / Boost",
  mBar15kSwap: "SALTHUB's poster — a clear M Switch Pod being fitted into the M Switch body",
  caliburnG4ProKokoModes: "Still from UWELL's KOKO film — Customize mode on the Caliburn G4 Pro KOKO, power set for the start, middle and end of a puff",
  dragX3Screen: "VOOPOO's DRAG X3 poster — the 1.66-inch touchscreen and the PnP X cartridge",
  argusG4Battery: "VOOPOO's ARGUS G4 poster — a see-through view of the 1650mAh battery and a 45-minute full charge",
  argusG4Ohm: "VOOPOO's ARGUS G4 poster — the Multi-Ohm cartridge: flip for 1.0Ω or 0.7Ω, press the button twice for 0.4Ω",
  dragX3Battery: "VOOPOO's DRAG X3 poster — 18650 and 21700 cells, and the capacitive unlock sensor",
});

/** Chinese alts, same posters (used by src/i18n/guides-copy.ts GUIDES_COPY_ZH). */
export const SECTION_IMAGES_ZH = sectionImagesIn({
  vmateI3Family: "VOOPOO 的 VMATE 烟弹图表：每种阻值的功率范围，以及适合游离碱烟油还是尼古丁盐烟油",
  caliburnG4ClassicRefill: "UWELL 渲染图：无需取下烟弹，直接给 Caliburn G4 Classic 的烟弹注油",
  argusG3MiniTiny: "VOOPOO 的 ARGUS G3 mini 海报：1350mAh 电池，重 40.85 克",
  mBar10kModes: "SALTHUB 的 M Bar 10K 海报：双击底部按键切换 Eco / Soft / Boost",
  mBar15kSwap: "SALTHUB 海报：透明的 M Switch Pod 烟弹正插入 M Switch 机身",
  caliburnG4ProKokoModes: "UWELL KOKO 影片截图：Caliburn G4 Pro KOKO 的 Customize 模式，分别设定一口的开始、中段和结尾功率",
  dragX3Screen: "VOOPOO 的 DRAG X3 海报：1.66 英寸触摸屏与 PnP X 烟弹",
  argusG4Battery: "VOOPOO 的 ARGUS G4 海报：透视可见的 1650mAh 电池，约 45 分钟充满",
  argusG4Ohm: "VOOPOO 的 ARGUS G4 海报：Multi-Ohm 烟弹，翻转切换 1.0Ω 或 0.7Ω，双击按键使用 0.4Ω",
  dragX3Battery: "VOOPOO 的 DRAG X3 海报：兼容 18650 / 21700 电芯，以及电容式解锁感应",
});

// Round SEO ข batch 4 (2026-09-21): publishedAt = the commit that first added all seven records
// (f29d7fc, 2026-08-29, read from git log — never invented). The modified date is no longer typed
// here — since round search-price batch 3 (2026-09-22) it is the last git commit touching this
// file / guides-copy.ts, read from src/data/content-dates.json (see src/lib/content-dates.ts).

/**
 * Round 10B (2026-09-24): articles that are written and checked but NOT public yet — the owner's
 * ruling D3 holds the UWELL/VOOPOO comparisons until the SEO_BASELINE read of 2026-10-05, because
 * their control pages are being measured. A held id is filtered out of `guides` below, and every
 * reader goes through `guides` / `getGuide` (the route's generateStaticParams, sitemap.ts, /guides,
 * the home teaser grid, article-relevance.ts' "อ่านต่อ" box), so a held article 404s, is not in the
 * sitemap and is linked from nowhere. To publish one: delete its id from this set — the one switch.
 * Guarded by src/lib/held-guides-contract-test.ts.
 */
// 2026-10-02: the owner released both D3-held comparisons (article round, cloud chat: "ได้ ปล่อยขึ้นเว็บเลย") — the set is
// empty, the switch stays for the next held article.
export const HELD_GUIDE_IDS: ReadonlySet<string> = new Set<string>([]);

/** The "can't open the website" DNS help page (round "site unreachable", 11/10) — id = slug; the route renders
 *  DnsGuideContent for it instead of ArticleBody, and the footer / age gate / home card link to it. */
export const DNS_GUIDE_ID = "cant-open-the-website";

const allGuides: Guide[] = [
  {
    id: "choosing-your-first-pod-system",
    slug: "choosing-your-first-pod-system",
    title: "Choosing Your First Pod System",
    dek: "A practical starting point for picking between open-system pods, pod kits, and disposables.",
    category: "getting-started",
    readingTimeMin: 8,
    publishedAt: "2026-08-29",
    body: [
      {
        heading: "Start with format, not features",
        paragraphs: [
          "Before comparing screens, wattage ranges, or battery capacities, decide on format: an open-system pod (pod system) you fill yourself, a higher-output pod kit, or a prefilled disposable. That single decision narrows the catalog more than any spec.",
          "Open-system pods (like the Caliburn line) mean buying e-liquid separately and refilling a small tank yourself, in exchange for lower running cost and more control over resistance and flavor. Disposables and switch-style cartridges trade that control for zero filling and zero coil-swapping.",
          "The two formats are compared in more depth in [Open-system vs. disposable](/guides/open-system-vs-disposable).",
        ],
      },
      {
        heading: "Then narrow by how you actually vape",
        paragraphs: [
          "A tighter, MTL-style draw (closer to a cigarette) generally pairs with a lower-wattage device and a higher-resistance coil. A looser, airier RDL or DTL draw wants more airflow and typically more wattage headroom. How the two actually feel is covered in [MTL vs. DTL](/guides/understanding-mtl-vs-dtl).",
          "If you're not sure yet, a device with adjustable airflow and a wide wattage range — rather than a fixed, single-setting device — leaves room to find your preference without buying a second device. Those two numbers are on every spec sheet; see [How to read a spec sheet](/guides/reading-a-spec-sheet).",
        ],
      },
      // Round SEO ข (2026-09-21): the four sections below and the FAQ were added from verified spec
      // rows, catalog-relationships.ts and the owner's rulings only — source map per paragraph in
      // the round folder (_incoming/seo-b/writer-A-sources.md).
      {
        heading: "UWELL, VOOPOO and Salthub: how they differ",
        paragraphs: [
          "Honest answer from the catalog: this article covers three brands — UWELL, VOOPOO and Salthub — and each makes a different kind of device, so none of them is simply “better”. Which one fits depends on the format you picked above.",
          "UWELL at this shop is the Caliburn family: open-system pods you fill yourself. Current models such as the G5 and G4 Pro top out at 35W, and most of them share the same GPP pod, so one pod type covers several devices.",
          "VOOPOO is the pod-kit side. ARGUS, VINCI and VMATE are the compact range — ARGUS G4 at 5–35W, ARGUS G3 mini up to 30W, VINCI S at 5–40W, VMATE i3 at 5–30W.",
          "DRAG is VOOPOO's high-output family: DRAG S3 at 5–60W, DRAG X3 at 5–80W and DRAG 6 up to 220W.",
          "Salthub is the no-filling side: M Bar are disposables, and M Switch is a switch-style device where you keep the body and swap a prefilled cartridge.",
        ],
      },
      {
        heading: "Real example: an open-system pod like the Caliburn G5",
        paragraphs: [
          "The [Caliburn G5](/products/caliburn-g5) is the current Caliburn flagship: a 1600mAh battery, 5–35W output, a 0.85-inch colour screen and a top-fill pod.",
          "There is no row of buttons for switching modes — a Smart Triple-Tap gesture sensor handles mode switching and status readout instead.",
          "How the tap control works, and why it needs a screen alongside it, is in [Gesture & Triple-Tap Control](/technology/gesture-and-triple-tap-control).",
        ],
        subsections: [
          {
            heading: "Which pods the Caliburn G5 uses",
            paragraphs: [
              "It uses UWELL's GPP pod platform, available in four resistances: 0.4, 0.6, 0.9 and 1.2 ohm. The same GPP pod fits most current Caliburn devices (G5, G4 and G3 series), and each resistance is sold separately. How to look after a pod and when to change it is in [Coil & pod maintenance](/guides/coil-and-pod-maintenance).",
            ],
          },
        ],
      },
      {
        heading: "Real example: an auto-draw pod kit for beginners (ARGUS G3 mini)",
        paragraphs: [
          "The [ARGUS G3 mini](/products/argus-g3-mini) is an auto-draw pod kit: no fire button, the device activates when you inhale, and wattage auto-adjusts to whichever pod is installed, up to 30W.",
          "It carries a 1350mAh battery and weighs 40.85 g. The included pod is the ARGUS Top Fill Cartridge V2 at 0.7 ohm, 3mL, with the iCOSM CODE 2.0 anti-leak system.",
          "VOOPOO says the G3 mini takes ARGUS Top Fill cartridges, rated 0.4, 0.7 and 1.0Ω — check the resistance and output first. When you need more pods, our [VOOPOO Argus Pod cartridges](/products/coil-21) listing includes Top Fill cartridges at 0.4Ω and 0.7Ω; its 1.2Ω option is a side-fill pod, outside the G3 mini's range.",
        ],
        image: SECTION_IMAGES_EN.argusG3MiniTiny,
      },
      {
        heading: "Real example: a disposable with adjustable airflow (M Bar 9K)",
        paragraphs: [
          "The [M Bar 9K](/products/m-bar-9k) is a disposable with adjustable airflow — so you don't have to settle your draw style before buying.",
          "It comes prefilled with 30mg nicotine-salt e-liquid, rated up to 9,000 puffs, with a 600mAh battery that recharges over USB-C. No filling, no coil changes.",
        ],
      },
      {
        heading: "Use the Finder instead of guessing",
        paragraphs: [
          "Rather than cross-referencing every spec by hand, the Product Finder asks a short set of preference questions and matches them against the device data in the catalog, showing why each result matched. If you still can't answer “which pod system is right for me”, let the [Product Finder](/finder) ask.",
        ],
      },
    ],
    relatedProductSlugs: ["caliburn-g5", "argus-g3-mini", "m-bar-9k"],
    faq: [
      {
        question: "What pods does the Caliburn G5 use?",
        answer: "UWELL GPP pods, in four resistances: 0.4, 0.6, 0.9 and 1.2 ohm. The same pod fits most current Caliburn devices.",
      },
      {
        question: "What pods does the ARGUS G3 mini use?",
        answer: "It ships with the ARGUS Top Fill Cartridge V2 at 0.7 ohm. VOOPOO says the G3 mini takes ARGUS Top Fill cartridges, rated 0.4, 0.7 and 1.0 ohm. Our VOOPOO Argus Pod listing includes Top Fill cartridges at 0.4 and 0.7 ohm.",
      },
      {
        question: "What e-liquid does a pod system use?",
        answer: "An open-system pod such as a Caliburn uses bottled e-liquid you buy separately and fill yourself. Disposables like the M Bar 9K and M Switch Pod cartridges come prefilled, so there is nothing to buy or fill.",
      },
      {
        // Owner's genuine-check ruling (2026-09-21, Q2=ก): exactly three parts, no brand beyond the
        // two with a verified official check page, claim wording = BSOT §12 only.
        question: "How do I check a product is genuine?",
        answer: "Salthub products such as the M Bar 9K and M Switch are checked on Salthub's official site at salthub.com/authenticate by photographing the authentication label on the box. Uwell products such as the Caliburn have a scratch-off strip on the box with a QR code and numeric code underneath; check them at myuwell.com/verify. If the product fails the check, send the result and your unboxing video to the shop on LINE within 7 days; the shop will review it and let you know whether it will replace the item or refund you. For any other problem, claim within 7 days with an unboxing video; the shop replaces the same item or swaps to a model of the same price, with no cash refund, and replies within 3 business days.",
      },
    ],
  },
  // Round SEO E "pod" (2026-10-09): the one article that answers "pod system คืออะไร" (SEO_LANDSCAPE §0). Placed second so the
  // pod-systems "อ่านต่อ" box (relatedArticlesForCollection, ties keep this order) offers it. Product facts reuse rows already on
  // the site only (thai-copy 09/10 source map: _incoming/seo-e-pod/article-sources.md); no new numbers.
  {
    id: "what-is-a-pod-system",
    slug: "what-is-a-pod-system",
    title: "What Is a Pod System? Parts and How It Works",
    dek: "A pod system is a refillable device: you fill the pod yourself, swap it when the coil wears out, and choose the resistance. Here's what's inside and how it works.",
    category: "how-it-works",
    readingTimeMin: 4,
    publishedAt: "2026-10-09",
    body: [
      {
        heading: "What is a pod system?",
        paragraphs: [
          "A [pod system](/products/pod-systems) is a vape in two parts: a device body that holds the battery, and a pod that sits on top. You fill the pod with e-liquid yourself, and when its coil wears out you replace only the pod — the device carries on.",
          "UWELL's Caliburn family is one example. Below, part by part: what's inside, how the parts work together, and what a pod's resistance tells you.",
        ],
      },
      {
        heading: "What's inside a pod system",
        paragraphs: [
          "The device body is the part you hold. Inside are the battery and a chip that controls the power going out. Most current pod devices use a sealed, built-in battery charged over USB-C. Some show battery and wattage on a screen; some fire with a button, others have no button and fire when you draw.",
          "The pod sits on top of the device and holds the e-liquid tank, the coil and the mouthpiece in one piece. Pods like UWELL's GPP have the coil built in, so the whole pod is replaced when the coil is spent; some other devices use an empty pod that takes a separate coil.",
          "The air inlet is where air comes in, passes the coil and carries vapor up to the mouthpiece. A wider inlet gives a looser draw, a narrower one a tighter draw, and many devices let you adjust it.",
        ],
      },
      {
        heading: "How a pod system works",
        paragraphs: [
          "The wicking material inside the coil soaks up e-liquid from the tank. When you press the fire button or start to draw, the device sends power from the battery to the coil; the coil heats up and turns the e-liquid in the wick into vapor, and the air coming in through the inlet carries it to the mouthpiece.",
          "How much power goes to the coil is the wattage. Some devices let you set it yourself; others set it automatically for the pod you put in. And because the wick has to be soaked before it works well, a freshly filled pod should sit for several minutes before the first draw.",
        ],
      },
      {
        heading: "What a pod's resistance tells you",
        paragraphs: [
          "Every coil has a resistance, measured in ohms, and it gives a rough idea of the draw the pod is made for. Lower resistance usually means a more open draw at higher wattage; higher resistance suits a tighter MTL draw — vapor into the mouth first, then the lungs — at lower wattage. How the two feel is in [MTL vs. DTL](/guides/understanding-mtl-vs-dtl).",
          "A real example: UWELL's GPP pod comes in four resistances — 0.4, 0.6, 0.9 and 1.2 ohm — and the same pod fits most current Caliburn devices (G5, G4 and G3 series). To change how a Caliburn draws, you change the pod, not the device.",
          "VOOPOO's ARGUS top-fill cartridge follows the same idea: one pod shape, several resistances. More in [Multi-Resistance Cartridges](/technology/multi-resistance-cartridges).",
        ],
        image: SECTION_IMAGES_EN.vmateI3Family,
      },
      {
        heading: "Refill it yourself, or use a prefilled pod",
        paragraphs: [
          "A pod system uses bottled e-liquid you buy separately and fill yourself, so the flavor and nicotine strength are your choice.",
          "If you'd rather not fill anything but still want to keep the device, a [switch pod](/products/switch-pods) takes prefilled pods: when one runs out, you swap in a new pod, as with SALTHUB's M Switch.",
          "[Disposables](/products/disposables) are ready out of the box, with the e-liquid already inside, and most can be recharged until it runs out. What each format gains and gives up is in [Open-system vs. disposable](/guides/open-system-vs-disposable).",
        ],
      },
      {
        heading: "How long a pod lasts, and when to change it",
        paragraphs: [
          "Coils are a consumable part on any open-system device. The wick wears out gradually with use, so a pod has no fixed lifespan in days — it depends on how each person vapes.",
          "The usual signs it's time: a harsh or burnt taste, less vapor, or a gurgling sound on the draw. How to look after a pod is in [Coil & pod maintenance](/guides/coil-and-pod-maintenance), and replacement pods are in [Pods & Cartridges](/products/pods-cartridges) — check the pod matches your device model first.",
        ],
      },
      {
        heading: "Next: choosing your first device",
        paragraphs: [
          "Now that you know how a pod system works, the next step is choosing the format and model that suit what you need and how you'll use it. Start with [Choosing your first pod](/guides/choosing-your-first-pod-system), or see every model on the site in [Pod Systems](/products/pod-systems).",
        ],
      },
    ],
    relatedProductSlugs: ["caliburn-g5", "caliburn-g5-lite", "coil-94"],
    faq: [
      {
        question: "How is a pod system different from a switch pod?",
        answer: "Both let you keep the device; the difference is the pod. With a pod system you fill it with your own e-liquid and choose the resistance, as on the Caliburn family or VOOPOO's ARGUS and DRAG, some of which let you set the wattage. A switch pod takes prefilled pods instead: when one runs out you swap in a new one, with nothing to fill, as on SALTHUB's M Switch or the RELX Infinity 2 Plus.",
      },
      {
        question: "How is a pod system different from a disposable?",
        answer: "A pod system is filled by you and you replace the pod while the device stays. A disposable comes prefilled and is ready out of the box; most recharge until the e-liquid runs out, and then the whole device is discarded.",
      },
      {
        question: "What's the difference between a pod and a coil?",
        answer: "The coil is the part that heats up and turns e-liquid into vapor. The pod is the piece that sits on the device and also holds the tank and mouthpiece. Pods like UWELL's GPP have the coil built in, so you change the whole pod; some devices use an empty pod where only the coil is swapped.",
      },
    ],
  },
  {
    id: "open-system-vs-disposable",
    slug: "open-system-vs-disposable",
    title: "Open-System vs. Disposable: Which Fits How You Vape",
    dek: "Neither format is objectively better — the right one depends on how much control and maintenance you actually want.",
    category: "buying-guide",
    readingTimeMin: 5,
    publishedAt: "2026-08-29",
    body: [
      {
        heading: "What you're actually trading off",
        paragraphs: [
          "An open-system pod (open system, or pod kit) asks you to buy e-liquid separately, refill a small tank, and occasionally replace a coil pod. In exchange you generally get a lower cost per mL of e-liquid and more control over nicotine strength and flavor selection. What that coil-pod upkeep involves is in [Coil & pod maintenance](/guides/coil-and-pod-maintenance).",
          "A disposable or switch-style cartridge device removes filling and coil-swapping entirely — you use it until the puff count or e-liquid runs out — at the cost of less control over exactly what you're vaping and, for fully disposable formats, more waste per device.",
          "An open-system example from the catalog: the [Caliburn G5 Lite](/products/caliburn-g5-lite) keeps the G5's 1600mAh battery and 35W ceiling on the same UWELL GPP pods, with a simpler control layout.",
        ],
      },
      // Round SEO ข (2026-09-21): sections and FAQ below from verified rows only — source map in
      // _incoming/seo-b/writer-A-sources.md.
      {
        heading: "Real example: a rechargeable disposable (M Bar 10K)",
        paragraphs: [
          "The [M Bar 10K](/products/m-bar-10k) is a disposable that recharges over USB-C: a 600mAh battery, rated up to 10,000 puffs, on a cotton mesh coil. When the battery runs down you charge it rather than discarding it with e-liquid still inside.",
          "It has three power modes — Eco, Soft and Boost — cycled with a double-click, and an RGB indicator that changes colour to show which mode is active, plus a battery LED in 25% steps. No menu involved.",
          "The trade-off is the one above: flavor and nicotine strength are whatever came prefilled, and once the e-liquid is gone the whole device is discarded.",
        ],
        image: SECTION_IMAGES_EN.mBar10kModes,
      },
      {
        heading: "A middle ground: switch-style systems",
        paragraphs: [
          "Switch-style systems like M Switch or Zero keep a reusable, rechargeable device body and only replace a prefilled cartridge — closer to a disposable's simplicity, but without discarding the whole device each time.",
        ],
      },
      {
        heading: "Real example: M Switch Kit with prefilled M Switch Pod cartridges",
        paragraphs: [
          "The [M Switch Kit](/products/m-switch-kit) is a device body you keep and recharge over USB-C; the e-liquid comes in prefilled swap-in cartridges rated up to 15,000 puffs each. No bottled e-liquid, no filling.",
          "The cartridge is the [M Switch Pod](/products/m-switch-pod): prefilled, made for the M Switch Kit. When it runs out you swap in a new pod and the body stays.",
          "Compared with an M Bar 10K, where the whole device is discarded, an M Switch discards only the pod — the same simplicity (no filling, no coil changes) with less waste per swap. Still undecided on the format? Start again from [Choosing your first pod](/guides/choosing-your-first-pod-system).",
        ],
        image: SECTION_IMAGES_EN.mBar15kSwap,
        video: SECTION_CLIPS.mSwitch,
      },
    ],
    relatedProductSlugs: ["caliburn-g5-lite", "m-bar-10k", "m-switch-kit"],
    faq: [
      {
        question: "How is the M Bar 10K different from the M Switch?",
        answer: "The M Bar 10K is a whole-device disposable rated up to 10,000 puffs with a 600mAh rechargeable battery. The M Switch Kit keeps its body and only swaps the M Switch Pod cartridge, rated up to 15,000 puffs per pod.",
      },
      {
        question: "What pod does the M Switch Kit use?",
        answer: "The M Switch Pod, a prefilled cartridge that swaps straight in — no filling.",
      },
      {
        question: "How do I check a product is genuine?",
        answer: "Salthub products such as the M Bar and M Switch are checked on Salthub's official site at salthub.com/authenticate by photographing the authentication label on the box. Uwell products such as the Caliburn have a scratch-off strip on the box with a QR code and numeric code underneath; check them at myuwell.com/verify. If the product fails the check, send the result and your unboxing video to the shop on LINE within 7 days; the shop will review it and let you know whether it will replace the item or refund you. For any other problem, claim within 7 days with an unboxing video; the shop replaces the same item or swaps to a model of the same price, with no cash refund, and replies within 3 business days.",
      },
      {
        question: "How is an open-system pod different from Marbo?",
        answer: "An open-system pod is refilled with bottled e-liquid, and you replace the pod or coil yourself while keeping the device. Marbo is the name many shops use for SALTHUB's prefilled range, none of which needs filling: the M Bar 9K and M Bar 10K are disposables that recharge over USB-C until the e-liquid runs out, then the whole device is discarded, while the M Switch keeps its body and swaps only a prefilled pod.",
      },
    ],
  },
  {
    id: "understanding-mtl-vs-dtl",
    slug: "understanding-mtl-vs-dtl",
    title: "MTL vs. DTL: Understanding Draw Style",
    dek: "Mouth-to-lung and direct-to-lung draws feel completely different — here's what actually changes.",
    category: "how-it-works",
    readingTimeMin: 4,
    publishedAt: "2026-08-29",
    body: [
      {
        heading: "Mouth-to-lung (MTL)",
        paragraphs: [
          "What is the difference between MTL and DTL? In short: the path the vapor takes. An MTL (mouth-to-lung) draw pulls vapor into the mouth first, then to the lungs — closer to a cigarette's draw. It's typically paired with a tighter airflow restriction, a higher-resistance coil, and lower wattage.",
        ],
      },
      {
        heading: "Direct-to-lung (DTL) and the RDL middle ground",
        paragraphs: [
          "DTL draws pull vapor straight into the lungs, generally wanting a looser airflow, lower resistance, and more wattage. Many current pod devices target a middle ground often labeled RDL (restricted direct-lung) — looser than MTL but more restricted than a full DTL setup.",
          "How far to move wattage and airflow for each draw style is covered in [Choosing wattage and airflow](/guides/choosing-wattage-and-airflow).",
        ],
      },
      // Round SEO ข (2026-09-21): sections + FAQ below from verified rows only — source map
      // _incoming/seo-b/writer-B-sources.md.
      {
        heading: "A real example: Storm / Waves / Custom modes on the Caliburn G4 Pro KOKO",
        paragraphs: [
          "The [Caliburn G4 Pro KOKO](/products/caliburn-g4-pro-koko) is a pod system with Storm / Waves / Custom (draw modes) selected on a 2\" touchscreen, with no physical buttons involved. Its verified spec lines: a 2000mAh built-in battery, 35W maximum output, and Pro-FOCS 4.0 flavor tuning.",
          "The modes are preset draw characters plus a Custom slot, running from a smooth, mild hit to a stronger, more robust one. It takes UWELL GPP pods and the older G3 pods.",
          "What an onboard touchscreen can do, and what it costs, is in [Onboard Touch Displays](/technology/onboard-touch-displays).",
        ],
        image: SECTION_IMAGES_EN.caliburnG4ProKokoModes,
      },
      {
        heading: "A real example: a high-output device like the DRAG X3",
        paragraphs: [
          "The [DRAG X3](/products/drag-x3) is a pod kit with a 5–80W output range, a 0.1–3.0Ω resistance range, and a 1.66\" touchscreen. It has no built-in battery — it runs on a single 18650 or 21700 cell, which is not included in the box.",
          "The numbers to look at are the 80W ceiling and the 0.1Ω floor. How to read the rest of a spec table is in [How to read a spec sheet](/guides/reading-a-spec-sheet).",
          "The DRAG X3 uses VOOPOO's PnP X coils — VOOPOO's own DRAG X3 page says it takes every one of them.",
          "Know your draw style but not your device yet? Start from [Choosing your first pod](/guides/choosing-your-first-pod-system).",
        ],
        image: SECTION_IMAGES_EN.dragX3Screen,
      },
    ],
    faq: [
      {
        question: "Which coil fits the DRAG X3?",
        answer: "Every PnP X coil, according to VOOPOO's own DRAG X3 page. The shop lists them on its [VOOPOO PnP X coil page](/products/coil-92).",
      },
      {
        question: "What is the difference between MTL and RDL?",
        answer: "MTL pulls vapor into the mouth first, then the lungs, with tight airflow, higher resistance and lower wattage. RDL (restricted direct-lung) pulls straight to the lungs but with some restriction — looser than MTL, tighter than a full DTL setup.",
      },
      {
        question: "Which pod does the Caliburn G4 Pro KOKO use?",
        answer: "UWELL GPP pods, which come in four resistances: 0.4, 0.6, 0.9 and 1.2Ω. It also accepts the older Caliburn G3 pods. Source: UWELL's own G Pod Platform page.",
      },
    ],
    // Round SEO ฉ batch 6b: + ARGUS G4 mini, the flip-pod example of the new "which ohm is MTL or RDL" section (Thai).
    relatedProductSlugs: ["caliburn-g4-pro-koko", "drag-x3", "argus-g4-mini"],
    // Confirmed via YouTube oEmbed (2026-09-21, round SEO ข batch 2): the shop's own explainer on
    // exactly this topic, owned by youtube.com/@OKMYARZ. Owner bound it (Q3, 2026-09-21).
    reviewVideo: { videoId: "_s48AaDCtf4", title: "MTL / RDL / DTL ต่างกันยังไง? แบบไหนเหมาะกับคุณ", channelName: "OKM YARZ", publishedAt: "2026-09-19" },
  },
  {
    id: "reading-a-spec-sheet",
    slug: "reading-a-spec-sheet",
    title: "How to Read a Device Spec Sheet",
    dek: "Battery mAh, wattage range, and resistance range — what each number actually tells you.",
    category: "buying-guide",
    readingTimeMin: 5,
    publishedAt: "2026-08-29",
    body: [
      {
        heading: "Battery capacity (mAh)",
        paragraphs: [
          "How do you read a pod spec sheet? Start with the line everyone asks about first: how long does the battery last. A larger mAh figure generally means longer runtime between charges at a given wattage, but actual runtime depends heavily on wattage, screen use, and how often the device fires — treat mAh as a comparison point between devices, not a fixed hours-of-use number.",
        ],
      },
      {
        heading: "Wattage range and resistance range",
        paragraphs: [
          "The wattage range shows how much output control you have; a wider range generally means more flexibility to tune draw strength. Resistance range (in ohms) tells you which coil pods a device supports — a lower resistance typically produces a more open, airier draw at higher wattage, and a higher resistance suits a tighter MTL draw at lower wattage.",
        ],
      },
      // Round SEO ข (2026-09-21): sections + FAQ below from verified rows only — source map
      // _incoming/seo-b/writer-B-sources.md.
      {
        heading: "A real example: the ARGUS G4 spec sheet, line by line",
        paragraphs: [
          "Take the spec table of the [ARGUS G4](/products/argus-g4) and read it one line at a time. Every number below is a verified line on its product page.",
        ],
        subsections: [
          {
            heading: "Battery and charging",
            paragraphs: [
              "A 1650mAh built-in battery, charged over USB-C at 5V/2A; the sheet says roughly 45 minutes to full. The mAh figure is for comparing with other devices — how many hours you get depends on the wattage you run and how often you fire. How to charge it properly is in [Battery care](/guides/battery-care-and-charging).",
            ],
            image: SECTION_IMAGES_EN.argusG4Battery,
          },
          {
            heading: "Wattage, voltage and resistance",
            paragraphs: [
              "A 5–35W output range, 3.2–4.2V output voltage and a 0.4–3.0Ω resistance range (how resistance and wattage shape the draw is in [MTL vs. DTL](/guides/understanding-mtl-vs-dtl)). Where to set the wattage inside that range is in [Choosing wattage and airflow](/guides/choosing-wattage-and-airflow).",
            ],
          },
          {
            heading: "Screen and pod",
            paragraphs: [
              "A 0.85\" HD screen showing battery, wattage, resistance, lock state and puff count. The body is zinc alloy, leather and aluminum alloy. The pod line reads: ARGUS top-fill cartridge platform, multiple resistances — and that line is the one to keep reading about in the last section.",
              "What one pod shape in several resistances means is in [Multi-Resistance Cartridges](/technology/multi-resistance-cartridges).",
            ],
            image: SECTION_IMAGES_EN.argusG4Ohm,
          },
        ],
      },
      {
        heading: "Rows we mark unverified — how the DRAG 6's coil row moved to verified",
        paragraphs: [
          "When a spec can't be confirmed from the maker's own pages, we mark the row unverified and keep it off the product page.",
          "The [DRAG 6](/products/drag-6) shows how a row can change. Its battery (4400mAh built in, from two 2200mAh cells), 220W maximum output, GENE.TT 3.0 chip, SMART/RBA/TC-TCR modes and 1.66\" TFT screen were confirmed from the start.",
          "What the GENE.TT chip does in a high-output device is in [High-Output Chip Platforms](/technology/high-output-chip-platforms).",
          "For a while the coil row was held back. A retailer's compatibility list named PnP X coils for the DRAG 6, but we only print a spec as official when it comes from the maker.",
          "VOOPOO's own DRAG 6 page now settles it: the UFORCE-X Tank II in the kit takes every PnP X coil, and PnP X 0.15Ω and 0.3Ω coils come in the box. The row is verified and now shows on the product page.",
        ],
      },
      {
        heading: "A wide resistance range does not always mean the pod is for sale",
        paragraphs: [
          "Back to the pod line on the ARGUS G4. The 0.4–3.0Ω range is wide, and the device takes ARGUS pods in several resistances — but the [VOOPOO Argus Pod cartridges](/products/coil-21) on our site come in 0.4, 0.7 and 1.2Ω, not every value in that range. VOOPOO lists the ARGUS G4, ARGUS G4 mini and ARGUS P3 as taking this pod family; the ARGUS G3 mini takes its Top Fill cartridges (0.4–1.0Ω), so the 1.2Ω side-fill pod is outside its range.",
          "The Caliburn side works the same way: the [GPP pod](/products/coil-94) is on the site and states exactly which devices it fits. The resistance range on a spec sheet is only half the answer; the other half is whether the pod you would put in it can actually be bought. Read those two lines together before choosing a device — or, if you have not started choosing yet, start from [Choosing your first pod](/guides/choosing-your-first-pod-system).",
        ],
      },
    ],
    faq: [
      {
        question: "How long does a pod battery last — can I tell from mAh?",
        answer: "Only as a comparison. A higher mAh usually lasts longer at the same wattage, but the hours depend on the wattage you set, screen use and how often you fire.",
      },
      {
        question: "Where can I buy ARGUS pods?",
        answer: "On our site: VOOPOO Argus Pod cartridges, in several resistances. VOOPOO says the ARGUS pod family fits the ARGUS G4, G4 mini and P3 (on the P3, check resistance and output first); the G3 mini takes the Top Fill cartridges, 0.4 to 1.0Ω.",
      },
      {
        question: "What does the resistance range tell me?",
        answer: "Which pod or coil resistances the device supports. Lower resistance usually means an airier draw at higher wattage; higher resistance suits a tight MTL draw at lower wattage. A wide range does not mean every resistance is actually sold.",
      },
    ],
    relatedProductSlugs: ["argus-g4", "drag-6"],
    // Confirmed via YouTube oEmbed (2026-09-21, round SEO ข batch 2): the shop's own clip on reading
    // coil resistance, owned by youtube.com/@OKM_24. Owner bound it (Q3, 2026-09-21).
    reviewVideo: { videoId: "uN9HRRx0R_s", title: "ค่าโอห์มคอยล์ดูยังไง? เลือกผิดฟีลพอตเปลี่ยนทันที", channelName: "OKAMI", publishedAt: "2026-08-23" },
  },
  {
    id: "coil-and-pod-maintenance",
    slug: "coil-and-pod-maintenance",
    title: "Coil & Pod Maintenance Basics",
    dek: "Simple habits that keep flavor consistent and extend coil life on an open-system pod.",
    category: "maintenance",
    readingTimeMin: 7,
    publishedAt: "2026-08-29",
    // Round SEO ฉ batch 5 (owner 12/10): the shop's pod-life clip (@OKM_24 "OKAMI"); f86AJRNHX4U (round "clip", #4 for
    // "คอยล์พอต") moved to fixing-a-burnt-pod, whose subject it is. Title, channel and upload date read from YouTube 12/10.
    reviewVideo: { videoId: "e_r5uqEC2LQ", title: "5 เคล็ดลับยืดอายุหัวพอตให้ใช้ได้นานขึ้น แบบเห็นผล!", channelName: "OKAMI", publishedAt: "2025-11-21" },
    body: [
      {
        heading: "Priming a new pod",
        paragraphs: [
          "How long should a new pod sit before the first draw? There is no fixed number — let a freshly filled pod sit for several minutes before the first draw. That gives the coil's wicking material time to fully saturate, reducing the chance of a dry, burnt-tasting first few hits.",
        ],
        image: SECTION_IMAGES_EN.caliburnG4ClassicRefill,
      },
      {
        heading: "Signs a coil pod needs replacing",
        paragraphs: [
          "A harsher or burnt taste, reduced vapor production, or gurgling sounds are common signs a coil pod's wicking material is worn out and due for replacement — coils are a consumable part on any open-system device.",
        ],
      },
      // Round SEO ข (2026-09-21): sections + FAQ below from verified rows only — source map
      // _incoming/seo-b/writer-B-sources.md.
      {
        heading: "Which devices take the GPP pod",
        paragraphs: [
          "UWELL's GPP (G Pod Platform) pod is the top-fill pod shared across the current Caliburn line. According to UWELL's own pages it fits the Caliburn G5, G5 Lite, G5 Lite SE, G4 Pro, G4 Pro KOKO, G4, G4 Mini, G4 Classic, G3 Pro and G3 Pro KOKO.",
          "On our site that pod is the [GPP pod](/products/coil-94), in four resistances: 0.4, 0.6, 0.9 and 1.2Ω, mesh coils. The product name on the page reads “UWELL Coil Caliburn G4&G3 Series” (written in Thai there), but it fits the G5 line as well.",
          "How a mesh coil differs from round wire is in [Mesh Coil Systems](/technology/mesh-coil-systems).",
          "One caution: the same Caliburn name does not mean the parts interchange. Caliburn G2-generation pods and GPP pods do not fit each other. If your device is a [Caliburn G5](/products/caliburn-g5), [Caliburn G3 Pro](/products/caliburn-g3-pro) or [Caliburn G4 Pro](/products/caliburn-g4-pro), GPP is the pod on the list above.",
        ],
      },
      {
        heading: "Why pods are something you buy again",
        paragraphs: [
          "Coils are a consumable part on any open-system device. The wicking material wears out with use, and once it does, the pod is replaced — that is the whole reason the pod is a repeat purchase.",
          "The box usually only includes some resistances. The Caliburn G3 Pro ships with two pods, a 0.4Ω and a 0.9Ω; other GPP resistances are sold separately.",
          "From our own counter: Caliburn G4 Pro customers come back for pods often. That is shop experience, not a manufacturer spec, but it reflects the real pattern — once you have picked a device, the next thing you spend on is the pod. Before buying a device, check that its pod can actually be bought.",
          "If you would rather have no pod to look after at all, compare the disposable side in [Open-system vs. disposable](/guides/open-system-vs-disposable) — or, with no device yet, start from [Choosing your first pod](/guides/choosing-your-first-pod-system).",
        ],
      },
    ],
    faq: [
      {
        question: "How long should a new pod sit before vaping?",
        answer: "There is no fixed number of minutes. Let it sit for several minutes after filling so the coil's wicking material saturates fully before the first draw, which avoids a burnt taste.",
      },
      {
        question: "When should I replace the coil?",
        answer: "When the taste turns harsh or burnt, vapor drops, or you hear gurgling on the draw. Those three are the usual signs the wicking material is worn out.",
      },
      {
        question: "Which pods come in the Caliburn G3 Pro box?",
        answer: "Two pods: a 0.4Ω pod and a 0.9Ω pod, per the verified spec.",
      },
    ],
    relatedProductSlugs: ["caliburn-g5", "caliburn-g3-pro", "caliburn-g4-pro"],
  },
  {
    id: "battery-care-and-charging",
    slug: "battery-care-and-charging",
    title: "Battery Care & Charging Basics",
    dek: "General care habits for built-in and external vape batteries.",
    category: "maintenance",
    readingTimeMin: 8,
    publishedAt: "2026-08-29",
    // Round SEO ฉ batch 5 topic 4 (12/10): the shop's overnight-charging clip (@OKMYARZ) — it covers charge time, overnight
    // charging, fast chargers and heat, the subjects of the reworked Thai copy. Title, channel and upload date read from
    // YouTube's page data 12/10. en/zh bodies are unchanged (owner 12/10: Thai first, translate later).
    reviewVideo: { videoId: "ANpE7sf-80w", title: "ชาร์จพอตทิ้งไว้ข้ามคืนแบตพังจริงไหม?", channelName: "OKM YARZ", publishedAt: "2026-06-08" },
    body: [
      {
        heading: "Built-in batteries",
        paragraphs: [
          "How should you charge a pod device? Start by knowing what you have: most current pod devices use a sealed, built-in battery charged over USB-C. Using the charging cable and rate the manufacturer specifies, and avoiding leaving a device on charge unattended for extended periods, are standard good-practice habits for any lithium-battery device.",
        ],
      },
      // Round SEO ข (2026-09-21): section + FAQ below from verified rows only — source map
      // _incoming/seo-b/writer-B-sources.md.
      {
        heading: "A real example: a full charge in about 45 minutes on the ARGUS G4",
        paragraphs: [
          "For the [ARGUS G4](/products/argus-g4), “the rate the manufacturer specifies” means USB-C at 5V/2A. Its verified spec says the 1650mAh built-in battery charges to full in about 45 minutes.",
          "That 45 minutes is the spec-sheet figure, not something we timed ourselves. How long a charge lasts afterwards depends on the wattage you set, screen use and how often you fire. How to compare mAh figures between models is in [How to read a spec sheet](/guides/reading-a-spec-sheet).",
        ],
        image: SECTION_IMAGES_EN.argusG4Battery,
      },
      {
        heading: "External cells (18650 / 21700)",
        paragraphs: [
          "Devices that take a swappable external cell, like the [DRAG X3](/products/drag-x3), should be charged with a dedicated external charger when possible, and cells should be inspected for wrapper damage before use.",
          "The DRAG X3's verified spec: no built-in battery, a single 18650 or 21700 cell, and the cell is not included in the box — it is bought separately. The upside is that with a spare cell you swap and keep going while the other one charges.",
        ],
        image: SECTION_IMAGES_EN.dragX3Battery,
      },
    ],
    faq: [
      {
        question: "How long does a pod battery last?",
        answer: "There is no fixed number. A higher mAh usually lasts longer at the same wattage, but real runtime depends on the wattage you set, screen use and how often you fire. Use mAh to compare models, not as hours.",
      },
      {
        question: "Does the DRAG X3 come with an 18650 cell?",
        answer: "No. The DRAG X3 runs on a single 18650 or 21700 cell that is sold separately.",
      },
    ],
    relatedProductSlugs: ["drag-x3", "argus-g4"],
  },
  {
    id: "choosing-wattage-and-airflow",
    slug: "choosing-wattage-and-airflow",
    title: "Choosing Wattage & Airflow",
    dek: "How wattage and airflow interact to shape draw, flavor, and vapor volume.",
    category: "how-it-works",
    readingTimeMin: 5,
    publishedAt: "2026-08-29",
    body: [
      {
        heading: "They're not independent settings",
        paragraphs: [
          "What wattage should I set, and how far should the airflow be open? Those two questions get answered together. Opening the airflow on a device without raising wattage typically produces a cooler, thinner-feeling draw, while raising wattage without adjusting airflow can push a coil past its comfortable range. The two settings are usually tuned together, not in isolation.",
        ],
      },
      {
        heading: "A reasonable starting point",
        paragraphs: [
          "Start at the low end of the wattage range printed for your coil or pod, with the airflow mostly closed for MTL (or mostly open for DTL), then step up a little at a time. Not sure which draw style is yours? Read [MTL vs DTL](/guides/understanding-mtl-vs-dtl) first.",
        ],
        image: SECTION_IMAGES_EN.vmateI3Family,
      },
      // Round SEO ข (2026-09-21): sections + FAQ below from verified rows only — source map
      // _incoming/seo-b/writer-B-sources.md.
      {
        heading: "A real example: the Caliburn G3 Pro ships with two pod resistances",
        paragraphs: [
          "The [Caliburn G3 Pro](/products/caliburn-g3-pro) is a clear example of having both variables to work with: a 5–35W range, fully adjustable airflow, and two pods in the box — a 0.4Ω and a 0.9Ω. The 35W ceiling belongs to one pod only, though: UWELL's manual gives 5–35W for the 0.4Ω pod, 5–25W for the 0.6Ω and 5–15W for the 0.9Ω.",
          "So read the range of the pod you have fitted, not the device's. With the 0.9Ω pod, start low within 5–15W with the airflow nearly closed; with the 0.4Ω pod, start low too but with the airflow further open, then move up in small steps.",
          "The wraparound LCD shows the wattage the whole time, so you always know where you are.",
        ],
      },
      {
        heading: "A real example: the wide wattage range of the VINCI S",
        paragraphs: [
          "The [VINCI S](/products/vinci-s) is a pod kit with a wider 5–40W range, a 0.3–3.0Ω resistance range, a 4.5mL pod filled from the top without removing it, and a 2000mAh built-in battery.",
          "A wide range gives you more room to adjust, but the device's range only says what it can deliver, not what the fitted coil can take. Before setting it, check the wattage range of the coil or pod you have fitted and start at its low end. How to read those lines is in [How to read a spec sheet](/guides/reading-a-spec-sheet).",
        ],
      },
    ],
    faq: [
      {
        question: "What wattage should I start at?",
        answer: "At the low end of the range printed for the coil or pod you have fitted, then step up. There is no one number for every device: on the Caliburn G3 Pro, UWELL's manual gives 5–35W for the 0.4Ω pod, 5–25W for the 0.6Ω and 5–15W for the 0.9Ω.",
      },
      {
        question: "Low resistance vs high resistance — what changes?",
        answer: "Lower resistance usually means an airier draw at higher wattage; higher resistance suits a tight MTL draw at lower wattage. The Caliburn G3 Pro ships with a 0.4Ω and a 0.9Ω pod in the box.",
      },
    ],
    // Round SEO ฉ batch 6b: + coil-38, the coil whose printed range the Thai article uses as its example.
    relatedProductSlugs: ["caliburn-g3-pro", "vinci-s", "coil-38"],
    // Confirmed via YouTube oEmbed (2026-09-21, round SEO ข batch 2): the shop's own clip on how
    // resistance changes the draw, owned by youtube.com/@OKMYARZ. Owner bound it (Q3, 2026-09-21).
    reviewVideo: { videoId: "cPYybXJ4zzA", title: "ค่าโอห์มต่างกัน ฟีลต่างกันยังไง?", channelName: "OKM YARZ", publishedAt: "2026-08-17" },
  },
  {
    // Round 10B T03' — writer draft 1 + thai-copy pass (2026-09-24), source map _incoming/round10b/writer-1-result.md.
    // "NEW" on Zapple + Kyoho Grape: SALTHUB's own M Bar 9K poster https://www.salthub.com/wp-content/uploads/2025/08/m_bar_9k_06.webp
    // (re-checked in a real browser 2026-09-24, owner fix C).
    id: "choosing-a-marbo-flavor",
    slug: "choosing-a-marbo-flavor",
    title: "Marbo กลิ่นไหนดี เลือกกลิ่น M Bar 9K 10K และ M Switch",
    dek: "ไม่มีคำตอบเดียว เริ่มจากสายที่ชอบ เย็น องุ่น ผลไม้ หรือแนวอื่น แล้วดูว่ารุ่นไหนมีกลิ่นนั้น รวมรายชื่อกลิ่น M Bar 9K 10K และ M Switch Pod",
    category: "buying-guide",
    readingTimeMin: 6,
    publishedAt: "2026-09-24",
    thaiOnly: true,
    body: [
      {
        heading: "เลือกสายที่ชอบก่อน แล้วค่อยดูรุ่น",
        paragraphs: [
          "Marbo กลิ่นไหนดี ไม่มีคำตอบเดียว อยู่ที่ว่าชอบแนวไหน เริ่มจากเลือกสายก่อน เย็น องุ่น ผลไม้ หรือแนวอื่น แล้วค่อยดูว่ารุ่นที่ใช้อยู่มีกลิ่นไหนในสายนั้น ที่ร้านเองก็มีหลายกลิ่นที่ลูกค้าชอบ",
          "กลุ่มในบทความนี้แบ่งจากคำในชื่อกลิ่น ชื่อที่มี Ice · Mint · Menthol · Blast หรือ Freeze อยู่สายเย็น ชื่อที่มี Grape อยู่สายองุ่น ชื่อผลไม้อื่น ๆ อยู่สายผลไม้ ที่เหลือเป็นแนวอื่น",
          "Marbo คือชื่อที่หลายร้านในไทยใช้เรียก M Bar กับ M Switch ของ SALTHUB เรื่องชื่อนี้อ่านต่อได้ที่ [Marbo กับ M Bar ต่างกันไหม](/faq) ส่วนบนเว็บเรา [M Bar 9K หรือมาโบ 9K](/products/m-bar-9k) มี 24 กลิ่น [M Bar 10K](/products/m-bar-10k) มี 12 กลิ่น และหัวพอต [M Switch Pod](/products/m-switch-pod) มี 18 กลิ่น",
          "ถ้าใช้ M Switch กลิ่นอยู่ที่หัวพอต ส่วนตัวเครื่อง [M Switch Kit](/products/m-switch-kit) ใช้ตัวเดิม อยากเปลี่ยนกลิ่นก็เปลี่ยนแค่หัว",
        ],
      },
      {
        heading: "สายเย็น: ชื่อที่มี Ice · Mint · Menthol · Blast · Freeze",
        paragraphs: [
          "กลิ่นเย็นเป็นสายที่ลูกค้าที่ร้านถามถึงบ่อย สายนี้รวมทุกชื่อที่มีคำสื่อถึงความเย็น แยกตามรุ่นไว้ข้างล่าง",
          "ชื่อที่มีทั้งผลไม้และคำที่สื่อถึงความเย็น เช่น Watermelon Mint เราจัดไว้สายนี้ ส่วนคนที่มองหากลิ่นเมนทอล มี Menthol Freeze ใน M Bar 9K และ Menthol Blast ใน M Bar 10K",
          "M Bar 9K (4 กลิ่น): Blue Ice · Blueberry Mint · Doublemint · Menthol Freeze",
          "M Bar 10K (4 กลิ่น): Blue Ice · Menthol Blast · Watermelon Mint · Yellow Mint",
          "M Switch Pod (2 กลิ่น): Blue Ice · Doublemint",
        ],
      },
      {
        heading: "สายองุ่น: ชื่อที่มี Grape",
        paragraphs: [
          "องุ่นเป็นอีกกลิ่นที่ลูกค้าที่ร้านถามถึงบ่อย ทั้งสามรุ่นมีกลิ่นองุ่นมากกว่าหนึ่งแบบ ชื่อที่มี Grape คู่กับอย่างอื่น เช่น Grape Aloe ที่คนค้นว่าองุ่นอโล หรือ Grape Lychee ที่เป็นองุ่นคู่กับลิ้นจี่ เราจัดไว้สายนี้ ส่วนคนที่หาองุ่นเคียวโฮ ชื่อในรายการคือ Kyoho Grape ซึ่งมีครบทั้งสามรุ่น",
          "M Bar 9K (4 กลิ่น): Grape · Grape Aloe · Grape Lychee · Kyoho Grape",
          "M Bar 10K (2 กลิ่น): Grape · Kyoho Grape",
          "M Switch Pod (4 กลิ่น): Grape · Grape Aloe · Grape Lychee · Kyoho Grape",
        ],
      },
      {
        heading: "สายผลไม้",
        paragraphs: [
          "ชื่อที่เป็นผลไม้ และไม่มีคำที่สื่อถึงความเย็นหรือ Grape อยู่ในกลุ่มนี้ รวมถึงชื่อที่มีผลไม้คู่กับขนมหรือเครื่องดื่ม อย่าง Watermelon Bubblegum กับ Strawberry Milkshake ใครมองหากลิ่นแตงโม มี Watermelon ครบทั้งสามรุ่น ส่วนกลิ่นพีช มี Peach ใน M Bar 9K และ Peach Strawberry ที่คนค้นว่าพีชสตอ ทั้งใน M Bar 9K และ M Switch Pod",
          "ชื่อไทยที่คนค้นบ่อยในสายนี้ พิ้งเบอร์รี่คือ Pink Berry มีครบทั้งสามรุ่น แอปเปิ้ลอโลคือ Apple Aloe มีใน M Bar 9K กับ M Switch Pod ส่วนกลิ่นมะม่วงมีใน M Switch Pod ชื่อ Mango Passion",
          "M Bar 9K (12 กลิ่น): Apple Aloe · Mixberry · Orange Sour · Peach · Peach Strawberry · Pink Berry · Sparkling Lemon · Strawberry · Strawberry Kiwi · Strawberry Milkshake · Watermelon · Watermelon Bubblegum",
          "M Bar 10K (4 กลิ่น): All Berry · Pink Berry · Strawberry Kiwi · Watermelon",
          "M Switch Pod (10 กลิ่น): Apple Aloe · Black Berry · Mango Passion · Mixberry · Peach Strawberry · Pink Berry · Strawberry · Strawberry Watermelon · Watermelon · Watermelon Bubblegum",
        ],
      },
      {
        heading: "แนวอื่น",
        paragraphs: [
          "ชื่อที่ไม่ได้บอกผลไม้หรือความเย็นตรง ๆ เช่น Cola · Matcha Latte · Rainbow Candy ส่วน Zapple ชื่อไม่ได้บอกว่ารสอะไร เราจึงจัดไว้ตรงนี้ คนที่มองหากลิ่นเรนโบว์หรือกลิ่นกัมมี่ ทั้ง Rainbow Candy และ Sour Gummy มีใน M Bar 9K กลิ่นโคล่าคือ Cola มีครบทั้งสามรุ่น ส่วนกลิ่นมัทฉะคือ Matcha Latte มีใน M Bar 10K",
          "M Bar 9K (4 กลิ่น): Cola · Rainbow Candy · Sour Gummy · Zapple",
          "M Bar 10K (2 กลิ่น): Cola · Matcha Latte",
          "M Switch Pod (1 กลิ่น): Cola",
        ],
      },
      {
        // Keyword line 23/10 (owner's pick): "มาโบ 10K ใช้ยังไง / ปรับยังไง / วิธีใช้" + PAA "Marbo 10k ปรับไฟยังไง". SALTHUB posters only
        // (researcher 23/10): MBar10K_04 double-click bottom button → ECO/SOFT/BOOST · MBar10K_03 mini display mode + battery, 4-LED
        // battery 25/50/75/100%, RGB status indicator · 10,000 puffs / 600mAh / USB-C = the m-bar-10k spec rows. SALTHUB publishes no mode
        // details, blink meanings or charge time → said so. The Thai nickname stays out (THAI_STYLE round-8 lock: Marbo in English only).
        heading: "M Bar 10K ใช้ยังไง ปรับโหมดยังไง ไฟบอกอะไร",
        paragraphs: [
          "M Bar 10K เป็นพอตใช้แล้วทิ้งของ SALTHUB ที่ระบุไว้สูงสุด 10,000 พัฟ แบต 600mAh ชาร์จซ้ำได้ผ่าน USB-C และเลือกโหมดกับปรับลมได้ตามความต้องการ",
          "ที่ก้นเครื่องมีปุ่ม กดสองครั้งติดกันเพื่อสลับ 3 โหมด คือ Eco · Soft และ Boost เท่าที่ร้านเช็ค SALTHUB ยังไม่ได้อธิบายว่าแต่ละโหมดต่างกันแค่ไหน ร้านแนะนำให้ลองสลับดู แล้วเลือกโหมดที่สูบแล้วสบายสำหรับตัวเอง",
          "จอเล็ก ๆ บนตัวเครื่องบอกโหมดที่ใช้อยู่และแบตที่เหลือ ไฟแบตมี 4 ดวง ติด 1 ดวงคือ 25% 2 ดวงคือ 50% 3 ดวงคือ 75% และติดครบ 4 ดวงคือ 100% ส่วนไฟ RGB อีกจุดบอกว่าตอนนี้อยู่โหมดไหน",
          "ไฟ 4 ดวงนี้บอกแบตอย่างเดียว ไม่ได้บอกว่าน้ำยาเหลือเท่าไหร่ ถ้าไฟยังเต็มแต่รสเริ่มจาง อาจเป็นเพราะน้ำยาใกล้หมด วิธีดูอยู่ที่ [พอตใช้แล้วทิ้ง ใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts) ส่วนถ้าแบตหมดก็ชาร์จผ่าน USB-C แล้วใช้ต่อได้",
          "ความหมายของไฟกะพริบและเวลาชาร์จ SALTHUB ยังไม่ได้บอกไว้ ถ้าเจออาการที่ไม่แน่ใจ ทักไลน์ @okm24 ถามร้านได้ ดูรายละเอียดของรุ่นนี้ได้ที่ [M Bar 10K](/products/m-bar-10k)",
        ],
        image: SECTION_IMAGES.mBar10kModes,
      },
      {
        heading: "กลิ่นที่คนค้นหา และกลิ่นใหม่ของ M Bar 9K",
        paragraphs: [
          "เวลาพิมพ์ “marbo กลิ่น” ใน Google คำที่ขึ้นมาให้เลือกมี Zapple · แตงโม (Watermelon) · แอปเปิ้ล (Apple Aloe) · Blue Ice · องุ่น (Grape) และส้ม (Orange Sour) แตงโม Blue Ice และองุ่นมีทั้งสามรุ่น Apple Aloe มีใน M Bar 9K กับ M Switch Pod ส่วน Zapple กับส้มมีเฉพาะ M Bar 9K",
          "Zapple กับ Kyoho Grape เป็นสองกลิ่นที่ SALTHUB ติดป้ายว่าใหม่บนโปสเตอร์ของ M Bar 9K",
          "ยังไม่ได้เลือกว่าจะเอาพอตใช้แล้วทิ้งหรือ M Switch อ่าน [พอตใช้แล้วทิ้ง กับ พอตเปลี่ยนหัว](/guides/disposable-vs-switch-pod) อยากรู้ว่าหนึ่งเครื่องใช้ได้นานแค่ไหน อ่าน [พอตใช้แล้วทิ้ง ใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts) ส่วนรุ่นอื่นของแบรนด์อยู่ที่ [หน้าแบรนด์ SALTHUB](/brands/salthub)",
        ],
      },
    ],
    relatedProductSlugs: ["m-bar-9k", "m-bar-10k", "m-switch-pod"],
    faq: [
      {
        question: "Marbo กลิ่นไหนเย็น",
        answer: "กลิ่นสายเย็นดูได้จากชื่อที่มีคำสื่อถึงความเย็น M Bar 9K มี Blue Ice · Blueberry Mint · Doublemint · Menthol Freeze ส่วน M Bar 10K มี Blue Ice · Menthol Blast · Watermelon Mint · Yellow Mint และ M Switch Pod มี Blue Ice · Doublemint",
      },
      {
        question: "Marbo กลิ่นองุ่นมีแบบไหนบ้าง",
        answer: "M Bar 9K มี Grape · Grape Aloe · Grape Lychee · Kyoho Grape ส่วน M Bar 10K มี Grape · Kyoho Grape และ M Switch Pod มี Grape · Grape Aloe · Grape Lychee · Kyoho Grape",
      },
      {
        question: "Marbo กลิ่นส้มมีไหม",
        answer: "มี Orange Sour ใน M Bar 9K ส่วน M Bar 10K กับ M Switch Pod ไม่มีกลิ่นที่ชื่อเป็นส้ม",
      },
      {
        question: "หัว M Switch กับ M Bar กลิ่นเหมือนกันไหม",
        answer: "ชื่อซ้ำกันหลายกลิ่น เช่น Blue Ice · Cola · Grape · Kyoho Grape · Watermelon แต่เราเทียบได้แค่ชื่อ ไม่ได้เทียบรส บางกลิ่นมีเฉพาะหัว M Switch เช่น Black Berry · Mango Passion · Strawberry Watermelon",
      },
      {
        // THAI_STYLE line 63 exception 2 (owner 23/10): on this guide "มาโบ" may stand in FAQ questions as people type them.
        question: "มาโบ 10K ใช้ยังไง ปรับโหมดยังไง",
        answer: "ที่ก้นเครื่อง M Bar 10K มีปุ่ม กดสองครั้งติดกันเพื่อสลับ 3 โหมด Eco · Soft · Boost จอเล็ก ๆ บนเครื่องบอกว่าตอนนี้อยู่โหมดไหน และไฟ 4 ดวงบอกแบตที่เหลือ ดวงละ 25%",
      },
    ],
    // Round "clip" (2026-09-27, owner: this clip only — it replaces QptFMwIXbJE "M BAR 9K NEW FLAVOR 2" of round 10B):
    // the shop's most-watched clip (54K views, @PODSYSTEM-OKAMI-II), the top 5 M BAR 9K flavors, paired with "marbo
    // กลิ่นไหนดี" (docs/SEO_LANDSCAPE.md §4 item 1). Title and upload date read from YouTube's own video data.
    reviewVideo: { videoId: "-DMIKvoQPw8", title: "TOP 5 กลิ่นยอดนิยม ฮิตที่สุดของ MARBO BAR 9K DISPOSABLE POD", channelName: "POD SYSTEM OKAMI II", publishedAt: "2025-01-31" },
  },
  {
    // Round 10B T18 — writer draft 2 + thai-copy pass (2026-09-24), source map _incoming/round10b/writer-2-result.md.
    // Owner ruling: no number of days anywhere, in any form. The "puffs not reached" complaint sits with the other two
    // complaints, away from the "brands don't publish how puffs are counted" sentence, so it never reads as a cause.
    // Owner fix C (2026-09-24, real browser): M Bar 10K Eco/Soft/Boost + double click = SALTHUB posters
    // https://img.salthub.com/mbar10k/MBar10K_03.webp and MBar10K_04.webp ("DOUBLE CLICK BOTTOM BUTTON, SWITCH 3 MODES
    // (ECO/SOFT/BOOST)"). M Bar 9K airflow: salthub.com home says only "Adjustable Airflow" — the "MTL to DTL" range had
    // no SALTHUB source (reseller pages only) and was cut.
    // Round SEO ฉ batch 6a "green" set 2, topic 6 (owner 12/10): reworked from the shop's clips into "the truths worth knowing"
    // (thai-copy draft 12/10). Clip points + maker checks: _incoming/seo-f/b6/research-6a.md — only rqT2MGZi8Tw has a transcript,
    // the other section clips are cited for their subject only. Lost Mary (a disposable maker the shop does not sell) backs
    // "flavour and vapour thin as the liquid runs low / a worn coil" (lostmary.com blog 2024-05-23) and "extreme heat or cold
    // harms battery and device · chain vaping shortens its life" (2023-10-11), the way the charging guide cites Vaporesso.
    // The screen line = WOTOFO nexBAR 18K page ("battery, e-liquid level and mode") · salthub.com/mbar-10k ("mode & battery
    // status"); how a screen estimates the level is published by no maker → said as the shop's experience. Still no days.
    id: "how-long-a-disposable-lasts",
    slug: "how-long-a-disposable-lasts",
    title: "พอตใช้แล้วทิ้ง ใช้ได้กี่วัน และเรื่องที่ควรรู้",
    dek: "พอตใช้แล้วทิ้งใช้ได้กี่วัน ไม่มีตัวเลขตายตัว เพราะแต่ละคนสูบต่างกัน บทความนี้รวมเรื่องที่ร้านอยากให้รู้ ตั้งแต่วิธีอ่านตัวเลขพัฟบนกล่อง ตัวเลขน้ำยาบนจอเชื่อได้แค่ไหน ทำไมช่วงท้ายกลิ่นจางลง ไปจนถึงวิธีใช้ให้ได้นานขึ้น",
    category: "how-it-works",
    readingTimeMin: 8,
    publishedAt: "2026-09-24",
    thaiOnly: true,
    body: [
      {
        heading: "ใช้ได้กี่วัน ไม่มีตัวเลขตายตัว",
        paragraphs: [
          "พอตใช้แล้วทิ้ง 1 ตัวใช้ได้กี่วัน ตอบตรง ๆ คือไม่มีตัวเลขตายตัว แล้วแต่คน สูบจัดก็หมดไวหน่อย รุ่นเดียวกันแต่คนละคนใช้ ก็หมดไม่พร้อมกัน",
          "ถามว่า “Marbo 9K ใช้ได้กี่วัน” ก็คำตอบเดียวกัน [M Bar 9K หรือมาโบ 9K](/products/m-bar-9k) ระบุไว้สูงสุด 9,000 พัฟ ส่วน [M Bar 10K](/products/m-bar-10k) สูงสุด 10,000 พัฟ ตัวเลขนี้คือจำนวนพัฟ ไม่ใช่จำนวนวัน และเอาไปหารเป็นวันไม่ได้",
        ],
      },
      {
        heading: "ทำไมแต่ละคนหมดไม่เท่ากัน",
        paragraphs: [
          "ตัวแปรหลักคือวิธีสูบของแต่ละคน สูบถี่แค่ไหน และแต่ละพัฟดูดยาวแค่ไหน",
          "อีกเรื่องคือบางรุ่นตั้งค่าได้ M Bar 9K ปรับช่องลมได้ ส่วน M Bar 10K มี 3 โหมด Eco · Soft · Boost กดสองครั้งติดกันเพื่อสลับ",
          "การตั้งค่าเปลี่ยนความรู้สึกตอนสูบ และแต่ละคนก็ตั้งไม่เหมือนกัน",
          "อีกเรื่องที่ร้านสังเกตจากที่ใช้เอง คือคอยล์ เครื่องที่ใช้คอยล์สองตัวให้รสชัดและแน่นกว่า แต่ก็กินน้ำยามากกว่าตามไปด้วย ส่วนเครื่องคอยล์ตัวเดียว รสจะเบากว่านิดหน่อย แต่น้ำยาก็ลดลงช้ากว่า",
        ],
      },
      {
        heading: "พัฟเยอะ ใช้ได้นานกว่าจริงไหม",
        paragraphs: [
          "ตัวเลขบนกล่องคือจำนวนพัฟที่ผู้ผลิตระบุ อย่าง [RELX Smash Go 12K](/products/relx-smash-go-12k) ระบุไว้สูงสุด 12,000 พัฟ ส่วน [Joiway F3](/products/joiway-f3) ระบุไว้ 12,000 พัฟขึ้นไป จะสูบได้ใกล้ตัวเลขนั้นแค่ไหน ขึ้นกับวิธีสูบของแต่ละคนตามหัวข้อข้างบน",
          "จากที่ร้านเห็น ตัวเลขพัฟที่สูงกว่าไม่ได้แปลว่าจะใช้ได้นานขึ้นตามไปทุกครั้ง เพราะแต่ละยี่ห้อมีวิธีระบุตัวเลขพัฟไม่เหมือนกัน ถึงน้ำยาในเครื่องจะพอ ๆ กัน ตัวเลขบนกล่องก็อาจต่างกันได้",
          "ร้านเราจึงดูสองอย่างบนกล่องคู่กันเสมอ คือจำนวนพัฟ และปริมาณน้ำยาที่บอกเป็น mL จำนวนพัฟคือตัวเลขที่ผู้ผลิตระบุ ส่วนปริมาณน้ำยาคือของที่อยู่ในเครื่องจริง ดูแค่ตัวเลข K ตัวโต ๆ หน้ากล่องอย่างเดียว ก็คล้ายเลือกมือถือจากขนาดจออย่างเดียว",
        ],
        image: SECTION_IMAGES.mBar10kNonstop,
      },
      {
        // Keyword line 23/10 (owner's pick): "พอตใช้แล้วทิ้ง ดูยังไงว่าหมด" · "มาโบหมดดูยังไง" · PAA "หัวพอตหมด ดูยังไง". researcher 23/10: no
        // maker we checked publishes an "empty" signal; nexBAR 18K screen = battery + e-liquid (WOTOFO, already below); M Bar 10K LEDs =
        // battery only (SALTHUB MBar10K_03). The rest is the shop's experience already told in this guide.
        heading: "พอตใช้แล้วทิ้งหมดแล้ว ดูยังไง",
        paragraphs: [
          "พอตใช้แล้วทิ้งหมดแล้ว ดูยังไง ตอบสั้น ๆ คือดูจากรสเป็นหลัก เท่าที่ร้านเช็ค ยังไม่มีผู้ผลิตรายไหนบอกสัญญาณว่า “น้ำยาหมดแล้ว” ไว้ จากที่ร้านใช้เอง ถ้ารสจาง ควันบางลง หรือเริ่มมีรสไหม้ปน ก็ถึงเวลาเปลี่ยนตัวใหม่ ถึงจอจะยังเหลือขีดอยู่ก็ตาม",
          "จอหรือไฟบนเครื่องช่วยได้บางส่วน แต่แต่ละรุ่นบอกไม่เหมือนกัน อย่าง WOTOFO nexBAR 18K มีจอบอกทั้งแบตและน้ำยา ส่วนไฟ 4 ดวงของ M Bar 10K บอกแบตอย่างเดียว จึงบอกไม่ได้ว่าน้ำยาหมดหรือยัง ตัวเลขน้ำยาบนจอเชื่อได้แค่ไหน อยู่ในหัวข้อถัดไป",
          "อีกเรื่องที่ควรแยกให้ออก คือแบตหมดกับน้ำยาหมด ถ้าเป็นรุ่นที่ชาร์จซ้ำได้แล้วแบตหมด ชาร์จแล้วก็กลับมาใช้ได้ตามเดิม แต่ถ้าน้ำยาหมด ต่อให้ชาร์จจนเต็ม รสก็ไม่กลับมา อาการช่วงท้ายเล่าไว้ใน “ช่วงท้าย ทำไมกลิ่นจางลง” ส่วนเรื่องชาร์จอยู่ใน “แบตหมด หรือเริ่มไหม้ ทำยังไงต่อ” ด้านล่าง",
          "ถ้าใช้พอตเปลี่ยนหัว วิธีดูว่าหัวพอตถึงเวลาเปลี่ยนหรือยัง อยู่ที่ [หัวพอตใช้ได้กี่วัน เปลี่ยนเมื่อไหร่](/guides/coil-and-pod-maintenance)",
        ],
      },
      {
        heading: "ตัวเลขน้ำยาบนจอ เชื่อได้แค่ไหน",
        paragraphs: [
          "พอตใช้แล้วทิ้งบางรุ่นมีจอบนตัวเครื่อง และแต่ละรุ่นก็บอกข้อมูลไม่เหมือนกัน อย่าง [WOTOFO nexBAR 18K](/products/wotofo-nexbar-18k) WOTOFO ระบุว่าจอบอกทั้งแบต น้ำยาที่เหลือ และโหมดที่ใช้อยู่ ส่วนจอเล็ก ๆ ของ M Bar 10K บอกโหมดกับแบต",
          "จากที่ร้านใช้เอง ตัวเลขหรือขีดน้ำยาบนจอเป็นค่าประมาณ ไม่ใช่ตัววัดที่แม่นทุกหยด แต่ละรุ่นก็แสดงผลคนละแบบ และบางครั้งก็ไม่ตรงกับน้ำยาที่เหลืออยู่จริง",
          "ร้านเราจึงดูจอคู่กับอาการของเครื่องเสมอ ถ้ารสเริ่มจาง ควันบางลง หรือเริ่มมีรสไหม้ปน ก็แปลว่าใกล้ถึงเวลาเปลี่ยนแล้ว ถึงจอจะยังเหลือขีดอยู่ก็ตาม กลับกัน ถ้าจอใกล้หมดแต่รสยังดีอยู่ ก็สูบต่อได้ตามปกติ",
        ],
        image: SECTION_IMAGES.nexbar18kScreen,
      },
      {
        heading: "ช่วงท้าย ทำไมกลิ่นจางลง",
        paragraphs: [
          "รสชาติหาย รสจาง หรือสูบแล้วรู้สึกจืดลงในช่วงท้าย เป็นอาการปกติของพอตใช้แล้วทิ้ง พอน้ำยาในเครื่องเหลือน้อยลง รสกับควันก็จะค่อย ๆ บางลงไปด้วย ผู้ผลิตพอตใช้แล้วทิ้งอีกแบรนด์อย่าง Lost Mary ก็เขียนไว้ในบล็อกของตัวเองแบบเดียวกันว่า รสและควันที่บางลงเป็นสัญญาณว่าน้ำยาใกล้หมด",
          "อีกสาเหตุคือคอยล์ คอยล์ในพอตใช้แล้วทิ้งทำงานมาตั้งแต่พัฟแรก และถอดเปลี่ยนไม่ได้ ใช้ไปนาน ๆ ก็เสื่อมลงตามการใช้งาน ซึ่ง Lost Mary ก็บอกไว้ว่ารสที่จางลงอาจมาจากคอยล์ที่เริ่มหมดสภาพได้ด้วย",
          "จากที่ร้านเจอ การที่น้ำยาส่งเข้าคอยล์ได้ไม่เต็มที่ และความร้อนของเครื่องเวลาสูบต่อเนื่อง ก็ทำให้รสช่วงท้ายไม่ชัดเท่าช่วงแรกได้เหมือนกัน ถ้ารู้สึกว่ารสแบนลงระหว่างสูบติดกัน ลองพักเครื่องสักครู่ แล้วค่อยกลับมาสูบต่อ",
        ],
      },
      {
        heading: "ใช้ไปสักพัก ทำไมไม่เหมือนตอนแกะกล่องใหม่ ๆ",
        paragraphs: [
          "ความรู้สึกที่เปลี่ยนไปมีได้สองฝั่ง ฝั่งแรกคือตัวเครื่อง ทั้งน้ำยาที่ลดลง คอยล์ที่ทำงานมานาน และความร้อน ซึ่งเล่าไว้ในหัวข้อข้างบนแล้ว",
          "อีกฝั่งคือตัวเราเอง จากที่ร้านเจอ พอสูบกลิ่นเดิมไปสักพัก ลิ้นจะเริ่มชินกับรสนั้น จนรู้สึกว่าไม่ชัดเท่าตอนแกะกล่อง ทั้งที่เครื่องอาจยังทำงานปกติดี คล้ายเพลงโปรดที่เปิดวนซ้ำ ฟังรอบที่ร้อยก็ไม่ว้าวเท่ารอบแรก ถ้าอยากเปลี่ยนบรรยากาศ ลองดูกลิ่นอื่นได้ที่ [Marbo กลิ่นไหนดี](/guides/choosing-a-marbo-flavor)",
          "อาการที่ถือว่าปกติ คือรสค่อย ๆ จางลงทีละนิดตามการใช้งาน แต่ถ้าสูบแล้วขม บาดคอ หรือมีกลิ่นไหม้ แบบนี้ไม่ใช่แค่ลิ้นชินแล้ว แต่เป็นอาการไหม้ วิธีรับมืออยู่ในหัวข้อ “แบตหมด หรือเริ่มไหม้” ด้านล่าง",
        ],
      },
      {
        heading: "ทำยังไงให้พอตใช้แล้วทิ้งใช้ได้นาน เริ่มจากวิธีเก็บ",
        paragraphs: [
          "ทำยังไงให้พอตใช้แล้วทิ้งใช้ได้นาน ร้านเราเริ่มจากเรื่องง่าย ๆ ก่อน คือปิดจุกซิลิโคนที่ปากดูดไว้ทุกครั้งที่ไม่ได้สูบ โดยเฉพาะตอนวางเครื่องทิ้งไว้ทั้งคืน ถ้ารุ่นนั้นมีจุกมาให้ อย่าเพิ่งรีบทิ้งตั้งแต่แกะกล่อง จากที่ร้านใช้เอง ปิดไว้แบบนี้ช่วยให้น้ำยาข้างในอยู่ในสภาพดีได้นานขึ้น",
          "เรื่องต่อมาคือที่เก็บ อย่าทิ้งเครื่องไว้ในที่ร้อนจัดหรือเย็นจัด อย่างในรถที่จอดตากแดด Lost Mary ก็เขียนไว้ว่าอุณหภูมิที่ร้อนหรือเย็นจัด ทำให้ทั้งแบตและตัวเครื่องเสียหายได้ เก็บไว้ในอุณหภูมิห้องดีกว่า",
          "อีกข้อคืออย่าทำตกหรือกระแทกแรง ๆ จากที่ร้านใช้เอง แรงกระแทกไม่ดีกับแบตที่อยู่ข้างใน ส่วนวิธีเก็บเครื่องไม่ให้น้ำยารั่ว อ่านต่อได้ที่ [หัวพอตรั่ว แก้ยังไง](/guides/fixing-a-leaking-pod)",
        ],
      },
      {
        heading: "สูบและชาร์จให้ถูก ก็ช่วยให้ใช้ได้นานขึ้น",
        paragraphs: [
          "คอยล์ในพอตใช้แล้วทิ้งเปลี่ยนไม่ได้ ถ้าคอยล์ไหม้ไปก่อน ต่อให้น้ำยายังเหลืออยู่ก็ต้องเปลี่ยนตัวใหม่ ร้านเราเลยดูดครั้งละราว 1–2 วินาที และพักเครื่องบ้างระหว่างพัฟ ให้น้ำยาได้ซึมกลับเข้าสำลีทัน Lost Mary ก็เขียนไว้ว่าการสูบติดกันไม่พัก ทำให้เครื่องอายุสั้นลง ดูดยาว ๆ ไม่ได้ทำให้คุ้มขึ้นหรอก มีแต่จะพาไปถึงพัฟสุดท้ายเร็วกว่าเดิม",
          "ส่วนแบตก็สำคัญไม่แพ้กัน เพราะแบตในพอตใช้แล้วทิ้งก็เปลี่ยนเองไม่ได้เหมือนกัน ร้านเราใช้สายและหัวชาร์จที่เหมาะกับเครื่อง และไม่เสียบทิ้งไว้นานเกินจำเป็น",
        ],
      },
      {
        heading: "แบตหมด หรือเริ่มไหม้ ทำยังไงต่อ",
        paragraphs: [
          "M Bar 9K กับ M Bar 10K ชาร์จซ้ำได้ผ่าน USB-C แบตหมดก็ชาร์จต่อ วิธีชาร์จให้ถูกอยู่ที่ [วิธีดูแลแบตเตอรี่และการชาร์จ](/guides/battery-care-and-charging)",
          "เรื่องที่ลูกค้าบ่นกับร้านบ่อยมีสามเรื่อง แบต ไหม้ไว และได้จำนวนพัฟไม่ถึงที่กำหนด ถ้าเครื่องเริ่มมีกลิ่นไหม้ อ่านสาเหตุและวิธีกันไว้ได้ที่ [พอตไหม้ เกิดจากอะไร](/guides/fixing-a-burnt-pod) ส่วนถ้าดูดไม่ขึ้นหรือไฟกะพริบ ไล่เช็คได้ที่ [พอตดูดไม่ขึ้น ไฟกะพริบ แก้ยังไง](/guides/fixing-no-draw-and-blinking-light)",
        ],
      },
      {
        heading: "จุดเด่นของพอตใช้แล้วทิ้ง",
        paragraphs: [
          "จากที่ร้านเห็น พอตใช้แล้วทิ้งเด่นที่ใช้ง่าย แกะแล้วใช้ได้เลย ไม่ต้องเติมน้ำยา ไม่ต้องเปลี่ยนคอยล์ ดูรุ่นทั้งหมดได้ที่ [พอตใช้แล้วทิ้ง](/products/disposables)",
          "ถ้าอยากเก็บตัวเครื่องไว้ แล้วเปลี่ยนแค่หัวพอต อ่านต่อที่ [พอตใช้แล้วทิ้ง กับ พอตเปลี่ยนหัว](/guides/disposable-vs-switch-pod)",
        ],
      },
    ],
    // Round "SEO ง" batch 6 (2026-10-07): + JOIWAY F4 and INFY 20K, two more disposables (category "disposables") — the
    // keyword map's /products/joiway-f4 and /products/infy-20k had no article linking them.
    relatedProductSlugs: ["m-bar-9k", "joiway-f3", "relx-smash-go-12k", "joiway-f4", "infy-20k"],
    faq: [
      {
        question: "Marbo 9K สูบได้กี่วัน",
        answer: "ไม่มีจำนวนวันตายตัว แล้วแต่คน สูบจัดก็หมดไวหน่อย M Bar 9K (ที่หลายร้านเรียก Marbo 9K) ระบุไว้สูงสุด 9,000 พัฟ ตัวเลขนี้คือพัฟ ไม่ใช่วัน",
      },
      {
        question: "9,000 พัฟ ใช้ได้กี่วัน",
        answer: "คิดเป็นวันไม่ได้ 9,000 พัฟคือจำนวนสูงสุดที่ผู้ผลิตระบุ ส่วนจะหมดในกี่วัน ขึ้นกับว่าแต่ละคนสูบถี่และดูดยาวแค่ไหน",
      },
      {
        // SEO all keys §9.7 (19/10): "พอต 15k คือ · กี่คำ". 15,000 = the nexPOD 15K pod row (wotofo.com), a verified spec of /products/nexpod-15k.
        question: "พอต 15K คืออะไร สูบได้กี่พัฟ", // THAI_STYLE พัฟ row: not "คำ" (checker #590 note), though people search "กี่คำ"
        answer: "K ในชื่อรุ่นย่อมาจากหลักพัน 15K จึงหมายถึง 15,000 พัฟ เป็นจำนวนพัฟสูงสุดที่ผู้ผลิตระบุ อย่าง WOTOFO nexPOD 15K ระบุไว้หัวละ 15,000 พัฟ จะสูบได้ใกล้ตัวเลขนั้นแค่ไหน ขึ้นกับว่าแต่ละคนสูบถี่และดูดยาวแค่ไหน ให้ดูปริมาณน้ำยาที่บอกเป็น mL คู่กันด้วย",
      },
      {
        question: "พอตใช้แล้วทิ้งหมดแล้ว ดูยังไง",
        answer: "ดูจากรสเป็นหลัก ถ้ารสจาง ควันบาง หรือเริ่มมีรสไหม้ ก็ถึงเวลาเปลี่ยน ถึงจอจะยังเหลือขีดก็ตาม ถ้าเป็นรุ่นที่ชาร์จได้แล้วเครื่องไม่ทำงานเลย ลองชาร์จก่อน ถ้าชาร์จแล้วสูบได้แต่รสยังจาง แปลว่าน้ำยาใกล้หมด ไม่ใช่แบต",
      },
      {
        question: "พอตใช้แล้วทิ้งแบตหมด แต่น้ำยายังเหลือ ทำไง",
        answer: "ถ้าเป็นรุ่นที่ชาร์จซ้ำได้อย่าง M Bar 9K กับ M Bar 10K ชาร์จผ่าน USB-C แล้วใช้ต่อได้ ไม่ต้องทิ้งทั้งที่น้ำยายังเหลือ",
      },
      {
        question: "ตัวเลขน้ำยาบนจอพอตใช้แล้วทิ้ง เชื่อได้แค่ไหน",
        answer: "ใช้เป็นค่าประมาณได้ แต่ไม่ควรดูอย่างเดียว จากที่ร้านใช้เอง แต่ละรุ่นแสดงผลต่างกัน และบางครั้งก็ไม่ตรงกับน้ำยาที่เหลือจริง ให้ดูคู่กับอาการของเครื่อง ถ้ารสจาง ควันบาง หรือเริ่มมีรสไหม้ ก็ใกล้ถึงเวลาเปลี่ยนแล้ว",
      },
      {
        question: "พอตใช้แล้วทิ้ง พัฟเยอะ ใช้ได้นานกว่าจริงไหม",
        answer: "ไม่เสมอไป แต่ละยี่ห้อระบุตัวเลขพัฟต่างกัน ร้านเราจึงดูปริมาณน้ำยาที่บอกเป็น mL บนกล่องคู่กันด้วย และจะใช้ได้นานแค่ไหน ก็ยังขึ้นกับวิธีสูบของแต่ละคน",
      },
      {
        question: "พอตใช้แล้วทิ้งใกล้หมด ทำไมกลิ่นจาง",
        answer: "เป็นอาการปกติของช่วงท้าย น้ำยาที่เหลือน้อยลงทำให้รสและควันบางลง และคอยล์ที่ใช้มานานก็เริ่มหมดสภาพ ถ้าแค่จางลงช้า ๆ ถือว่าปกติ แต่ถ้าขม บาดคอ หรือมีกลิ่นไหม้ ควรเปลี่ยนเป็นตัวใหม่",
      },
      {
        question: "พอตใช้แล้วทิ้งยังไม่หมด แต่รสชาติหาย จืดลง ทำไง",
        answer: "จากที่ร้านเจอ ถ้ารสจืดลงระหว่างสูบติดกัน ลองพักเครื่องสักครู่แล้วค่อยกลับมาสูบต่อ และถ้าสูบกลิ่นเดิมมานาน ลิ้นก็อาจชินกับรสนั้นจนรู้สึกว่าไม่ชัดเท่าตอนแกะกล่อง แต่ถ้ารสหายไปพร้อมกับมีรสขม บาดคอ หรือกลิ่นไหม้ ควรเปลี่ยนเป็นตัวใหม่",
      },
      {
        question: "ทำยังไงให้พอตใช้แล้วทิ้งใช้ได้นาน",
        answer: "ปิดจุกซิลิโคนที่ปากดูดเมื่อไม่ได้สูบ เก็บไว้ในอุณหภูมิห้อง อย่าทำตก ดูดครั้งละราว 1–2 วินาทีแล้วพักบ้าง และชาร์จด้วยสายที่เหมาะกับเครื่อง",
      },
    ],
    // Confirmed via YouTube oEmbed 2026-09-24 (_incoming/round10b/clips.md), owner's own channel @OKMYARZ.
    reviewVideo: { videoId: "rqT2MGZi8Tw", title: "พอตใช้แล้วทิ้ง 1 ตัวใช้ได้นานแค่ไหน?", channelName: "OKM YARZ", publishedAt: "2025-03-17" },
  },
  {
    // Round 10B T19 — writer draft 1 + thai-copy pass (2026-09-24), source map _incoming/round10b/writer-1-result.md.
    // Owner fix A (2026-09-24): no M Switch Pod capacity — salthub.com states "E-liquid Capacity: 2.2mL" only under M BAR POD
    // and ZERO CARTRIDGE (_incoming/round10b/salthub-mswitch-check.md). 600mAh: M Bar 9K = salthub.com home "Battery
    // Capacity: 600mAh"; M Bar 10K = SALTHUB poster https://img.salthub.com/mbar10k/MBar10K_01.webp ("600 MAH").
    id: "disposable-vs-switch-pod",
    slug: "disposable-vs-switch-pod",
    title: "พอตใช้แล้วทิ้ง กับ พอตเปลี่ยนหัว เลือกแบบไหนดี",
    dek: "ไม่มีกฎตายตัว แล้วแต่ความชอบ อยากแกะแล้วใช้ได้เลย หมดแล้วทิ้ง หรืออยากเก็บตัวเครื่องไว้ เปลี่ยนแค่หัวพอต เลือกตามวิธีใช้ของคุณ",
    category: "buying-guide",
    readingTimeMin: 6,
    publishedAt: "2026-09-24",
    thaiOnly: true,
    body: [
      {
        heading: "พอตใช้แล้วทิ้ง กับ พอตเปลี่ยนหัว เลือกยังไง",
        paragraphs: [
          "ไม่มีกฎตายตัว แล้วแต่ความชอบ ที่ร้านมีลูกค้าเลือกทั้งสองแบบ ถ้าอยากแกะแล้วใช้ได้เลย หมดแล้วทิ้ง ไปทางพอตใช้แล้วทิ้ง ถ้าอยากเก็บตัวเครื่องไว้ชาร์จใช้ต่อ เปลี่ยนแค่หัวพอต ไปทางพอตเปลี่ยนหัว",
          "พอตเปลี่ยนหัวคือพอตที่เก็บตัวเครื่องไว้ใช้ซ้ำ แล้วเสียบหัวพอตบรรจุสำเร็จ หมดก็ถอดเปลี่ยนหัวใหม่ บนเว็บเราเรียกตัวเครื่องแบบนี้ว่าเครื่องระบบสวิตช์ และรวมไว้ให้ดูในหมวด[พอตเปลี่ยนหัว](/products/switch-pods) ตัวอย่างเช่น [M Switch Kit](/products/m-switch-kit) กับหัวพอต [M Switch Pod](/products/m-switch-pod)",
          "สองแบบนี้ไม่ต้องเติมน้ำยาเองทั้งคู่ ถ้ากำลังชั่งระหว่างพอตใช้แล้วทิ้งกับพอตที่เติมน้ำยาเอง อ่าน [พอตใช้แล้วทิ้ง หรือพอตซิสเต็ม](/guides/open-system-vs-disposable) หรือดูรุ่นที่เติมน้ำยาเองได้ในหมวด [Pod System](/products/pod-systems)",
        ],
      },
      {
        heading: "“คุ้ม” ขึ้นกับอะไร",
        paragraphs: ["ความคุ้มขึ้นกับวิธีใช้ของแต่ละคน ลองดูสี่เรื่องนี้ว่าตรงกับตัวเองแค่ไหน"],
        subsections: [
          {
            heading: "ใช้ต่อเนื่อง หรือแค่อยากลอง",
            paragraphs: ["แค่อยากลอง พอตใช้แล้วทิ้งไม่ต้องมีอะไรก่อน แกะแล้วใช้ได้เลย หมดแล้วทิ้ง ถ้าจะใช้ต่อเนื่อง พอตเปลี่ยนหัวต้องมีตัวเครื่อง M Switch Kit ก่อน จากนั้นใช้แค่หัว M Switch Pod ไปเรื่อย ๆ ตัวเครื่องใช้ตัวเดิม"],
          },
          {
            heading: "เปลี่ยนกลิ่นบ่อยแค่ไหน",
            paragraphs: ["พอตใช้แล้วทิ้งหนึ่งเครื่องคือหนึ่งกลิ่น พอตเปลี่ยนหัวหนึ่งหัวคือหนึ่งกลิ่น เปลี่ยนหัวก็เปลี่ยนกลิ่น ไม่ต้องเปลี่ยนทั้งเครื่อง กลิ่นของแต่ละรุ่นดูได้ที่ [Marbo กลิ่นไหนดี](/guides/choosing-a-marbo-flavor)"],
          },
          {
            heading: "ทิ้งทั้งเครื่อง หรือทิ้งแค่หัว",
            paragraphs: ["พอตใช้แล้วทิ้งอย่าง [M Bar 9K](/products/m-bar-9k) กับ [M Bar 10K](/products/m-bar-10k) พอน้ำยาหมดก็ทิ้งทั้งเครื่อง พอตเปลี่ยนหัวทิ้งแค่หัว ขยะต่อครั้งจึงน้อยกว่า"],
            image: SECTION_IMAGES.mBar15kSwap,
          },
          {
            heading: "แบตหมดไม่ได้แปลว่าต้องทิ้ง",
            paragraphs: ["M Bar 9K กับ M Bar 10K แบต 600mAh ชาร์จซ้ำได้ผ่าน USB-C แบตหมดก็ชาร์จต่อ ไม่ต้องทิ้งทั้งที่น้ำยายังเหลือ เรื่องชาร์จเลยไม่ใช่จุดที่ต่าง จุดที่ต่างคือตอนน้ำยาหมด พอตใช้แล้วทิ้งต้องทิ้งทั้งเครื่อง ส่วนพอตเปลี่ยนหัวเก็บตัวเครื่องไว้ใช้ต่อ"],
          },
        ],
      },
      {
        heading: "เรื่องที่ลูกค้าที่ร้านบ่นบ่อย",
        paragraphs: [
          "มีสามเรื่อง แบต ไหม้ไว และจำนวนพัฟไม่ถึงที่กำหนด",
          "เรื่องแบต ดูก่อนว่าเครื่องชาร์จซ้ำได้ไหม M Bar 9K · M Bar 10K และตัวเครื่อง M Switch ชาร์จผ่าน USB-C ได้ทั้งสามตัว วิธีชาร์จให้ถูกอยู่ที่ [วิธีดูแลแบตเตอรี่และการชาร์จ](/guides/battery-care-and-charging)",
          "เรื่องไหม้ไว ถ้าเริ่มมีกลิ่นไหม้หรือรสไม่มา อ่านสาเหตุและวิธีกันไว้ได้ที่ [พอตไหม้ เกิดจากอะไร](/guides/fixing-a-burnt-pod) ส่วนเรื่องพัฟ อ่านวิธีดูตัวเลขพัฟบนกล่องได้ที่ [พอตใช้แล้วทิ้ง ใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts)",
        ],
      },
      {
        heading: "Marbo M Switch ดีไหม",
        paragraphs: [
          "ดีไหมอยู่ที่ว่าอยากได้อะไรจากพอตเปลี่ยนหัว M Switch เป็นของ SALTHUB ตระกูลเดียวกับ M Bar ที่หลายร้านเรียกรวมกันว่า Marbo ใช้ง่ายเท่าพอตใช้แล้วทิ้ง ไม่ต้องเติมน้ำยา ไม่ต้องเปลี่ยนคอยล์",
          "M Switch Pod หัวละสูงสุด 15,000 พัฟ ส่วน M Bar 10K สูงสุด 10,000 พัฟ และ M Bar 9K สูงสุด 9,000 พัฟต่อเครื่อง",
          "ถ้ากำลังเทียบ M Switch กับเครื่องระบบสวิตช์ยี่ห้ออื่น อ่าน [Esko Bar Switch 20K กับ M Switch](/guides/esko-bar-switch-vs-m-switch) ดูพอตใช้แล้วทิ้งรุ่นอื่นบนเว็บได้ที่ [หมวดพอตใช้แล้วทิ้ง](/products/disposables)",
          "รุ่นทั้งหมดของ SALTHUB ทั้ง M Bar และ M Switch ดูได้ที่ [หน้าแบรนด์ SALTHUB](/brands/salthub)",
        ],
      },
    ],
    relatedProductSlugs: ["m-bar-10k", "m-switch-kit"],
    faq: [
      {
        question: "พอตเปลี่ยนหัว ต้องเติมน้ำยาเองไหม",
        answer: "ไม่ต้อง หัวพอตอย่าง M Switch Pod บรรจุสำเร็จ หมดก็ถอดเปลี่ยนหัวใหม่ ตัวเครื่องใช้ตัวเดิม",
      },
      {
        question: "หัว M Switch ใช้กับเครื่องไหนได้บ้าง",
        answer: "ใช้กับตัวเครื่อง M Switch Kit ของ SALTHUB",
      },
      {
        question: "พอตใช้แล้วทิ้งชาร์จได้ไหม",
        answer: "แล้วแต่รุ่น M Bar 9K กับ M Bar 10K แบต 600mAh ชาร์จซ้ำได้ผ่าน USB-C รุ่นอื่นดูได้ในตารางสเปกของรุ่นนั้น",
      },
      {
        // Keyword line 23/10 (owner's pick): "พอตกับมาโบต่างกันยังไง" · "มาโบกับพอตต่างกันยังไง" (autocomplete both ways). Marbo in English
        // only (THAI_STYLE round-8 lock); says only what brands.ts says — other shops use the name, nothing on who makes what.
        question: "พอตกับ Marbo ต่างกันยังไง",
        answer: "Marbo ไม่ใช่พอตอีกชนิดหนึ่ง แต่เป็นชื่อที่หลายร้านในไทยใช้เรียกพอตของ SALTHUB ส่วนคำว่าพอตเป็นคำเรียกรวมทุกแบบ M Bar ของ SALTHUB คือพอตใช้แล้วทิ้ง ส่วน M Switch คือพอตเปลี่ยนหัวของแบรนด์เดียวกัน ที่เก็บตัวเครื่องไว้แล้วเปลี่ยนแค่หัวพอต",
      },
      {
        question: "พอตเปลี่ยนหัว ใช้ได้นานแค่ไหน",
        answer: "ตัวเครื่องเก็บไว้ชาร์จใช้ต่อได้ ส่วนหัวพอตหนึ่งหัวใช้ได้ตามจำนวนพัฟที่ระบุไว้ อย่าง M Switch Pod หัวละสูงสุด 15,000 พัฟ หัวพอตของ Esko Bar Switch 20K หัวละสูงสุด 20,000 พัฟ nexPOD 15K หัวละ 15,000 พัฟ KS Quikpro 15K หัวละสูงสุด 15,000 พัฟ และ Nexswitch 16K หัวละสูงสุด 16,000 พัฟ ตัวเลขเหล่านี้เป็นจำนวนสูงสุด จะใช้ได้กี่วันขึ้นกับว่าแต่ละคนสูบถี่และดูดยาวแค่ไหน ส่วนตัวเครื่องจะอยู่กับเราได้นานแค่ไหน ร้านเล่าไว้ในบทความพอต 1 ตัวใช้ได้นานแค่ไหน",
      },
    ],
    // Confirmed via YouTube oEmbed 2026-09-24 (_incoming/round10b/clips.md), owner's own channel @OKM_24.
    reviewVideo: { videoId: "8_3DPJM4RFA", title: "M BAR 10K & M SWITCH 15K เล็กฟัดใหญ่!", channelName: "OKAMI", publishedAt: "2026-05-09" },
  },
  {
    // Round 10B T21 — writer draft 2 + thai-copy pass (2026-09-24), source map _incoming/round10b/writer-2-result.md. The
    // UWELL manuals cited are © Shenzhen Uwell, read from copies hosted by retailer thebestvape.com (researcher-B-result.md)
    // — named "คู่มือของ UWELL", never "เว็บทางการ". Caliburn G5 is named without a link: it is an SEO_BASELINE control page
    // until 2026-10-05. "Change it" is the customer replacing the unit/pod — never a claim or warranty (owner, round 10B).
    // Owner fixes B + C (2026-09-24): G4 Mini lights = UWELL manual copy https://manuals.plus/caliburn/kpn025-g4-mini-kit-manual
    // ("During vaping … green … above 60%" / charging: flashing red/blue/green = low/medium/sufficient, green stays on when
    // full). Caliburn G4 Pro icon list cut: its only source was a retailer-hosted PDF, and the manuals.plus manual found is
    // for the G4 Pro KOKO — a separate product on this site, with different screen text.
    // Data round (2026-09-24, real browser — _incoming/round-data/sources-verified.md): G4 facts = manuals.plus
    // /m/50a2d62de82f0d181197e7dbdeac724ade1b398ab848d04aaa7b7cec543ee424 (screen messages, "Over 8s!", 5V/2A) · G5 =
    // /m/5709a095303c89dbb3fe992bd7b3cf31ba928aba1ad3f284fbfdc84d4b5fc06d ("OVER 6S", 5V/2A). Cut: "5V/2A" as a rule for
    // every Caliburn (the G4 Mini manual says 5V/1A) and "8 seconds" for the G4 Mini (its manual copy is garbled there).
    id: "fixing-no-draw-and-blinking-light",
    slug: "fixing-no-draw-and-blinking-light",
    title: "พอตดูดไม่ขึ้น ไฟกะพริบ แก้ยังไง",
    dek: "จากที่ร้านเจอ อาการดูดไม่ขึ้นส่วนใหญ่แก้เองได้ ไล่เช็คตามลำดับนี้ แกะพลาสติกที่ก้นพอต ชาร์จแบต เช็ดขั้วสัมผัส เสียบหัวพอตให้เข้าที่ แล้วค่อยดูว่าไฟหรือข้อความบนจอบอกอะไร",
    category: "maintenance",
    readingTimeMin: 6,
    publishedAt: "2026-09-24",
    thaiOnly: true,
    // Round SEO ฉ batch 5 "green" set 1, topic 3 (12/10): reworked with the shop's clips (thai-copy draft, transcripts
    // _incoming/seo-f/yt/tx/). Every UWELL-manual fact above/below is unchanged. New, maker-checked (researcher 12/10,
    // _incoming/seo-f/b5b/research.md): empty battery → charge first · grime on the charge port / pod contacts, wipe dry
    // (Vaporesso · Innokin · OXVA FAQs) · some devices stop when hot (SMOK · GeekVape) — the clip's "rest 2–3 minutes" is
    // not said (SMOK says 15), so "until it cools down". Clips: channel + upload date read from YouTube's page data 12/10.
    body: [
      {
        heading: "เช็คอย่างแรก: แกะพลาสติกที่ก้นพอตหรือยัง",
        paragraphs: [
          "พอตดูดไม่ขึ้น แก้ยังไง ที่ร้านเราให้เช็คอย่างแรกคือแกะพลาสติกที่ก้นพอตออกหรือยัง ถ้ายังไม่ได้แกะ แกะออกแล้วลองสูบใหม่ ข้อนี้ง่ายจนหลายคนข้ามไป แต่เช็คแค่ไม่กี่วินาที อาจช่วยประหยัดเวลาหาสาเหตุไปได้ทั้งวัน",
          "แกะแล้วยังดูดไม่ขึ้น ไล่ต่อตามหัวข้อถัดไปได้เลย ข้อไหนมาจากคู่มือผู้ผลิต เราบอกไว้ว่ามาจากคู่มือของใคร ส่วนข้อไหนเป็นสิ่งที่ร้านเจอเอง ก็บอกไว้เหมือนกัน",
        ],
      },
      {
        heading: "ไล่เช็คต่อทีละข้อ",
        paragraphs: [],
        subsections: [
          {
            heading: "ชาร์จแบตก่อน",
            paragraphs: [
              "เครื่องที่ไม่มีตัวเลขบอกเปอร์เซ็นต์แบต บางทีแบตหมดไปแล้วโดยไม่รู้ตัว จากที่ร้านเจอ อาการเครื่องเงียบไปเฉย ๆ หลายครั้งจบได้ด้วยการชาร์จ",
              "พอแบตต่ำ Caliburn จะขึ้นเตือนแล้วหยุดจ่ายไฟ ตามคู่มือของ UWELL ให้ชาร์จด้วยสาย USB-C ส่วน [M Bar 9K](/products/m-bar-9k) · [M Bar 10K](/products/m-bar-10k) และ [M Switch Kit](/products/m-switch-kit) ก็ชาร์จผ่าน USB-C เหมือนกัน ถ้าเสียบแล้วชาร์จไม่เข้า ดูวิธีไล่เช็คได้ที่ [ชาร์จพอตกี่นาที ชาร์จข้ามคืนได้ไหม](/guides/battery-care-and-charging)",
            ],
          },
          {
            heading: "เช็ดขั้วสัมผัสให้สะอาด",
            paragraphs: [
              "แบตยังมีแต่เครื่องยังเงียบ ลองดูที่ขั้วสัมผัส จุดที่ร้านเจอบ่อยมีสองที่ ที่แรกคือช่องชาร์จ ฝุ่นที่เข้าไปอุดทำให้ชาร์จไม่เข้าได้ ที่สองคือขั้วสัมผัสใต้หัวพอต ถ้ามีคราบน้ำยาหรือคราบสกปรกเกาะอยู่ ไฟก็เดินได้ยากขึ้น",
              "เช็ดด้วยสำลีก้านหรือทิชชู่แห้ง แล้วรอให้ทุกจุดแห้งสนิทก่อนใส่หัวพอตกลับหรือเสียบชาร์จ คู่มือผู้ผลิตหลายรายก็แนะนำให้เช็ดขั้วสัมผัสให้สะอาดเหมือนกัน ถ้าคราบที่ขั้วมาจากน้ำยารั่ว ดูวิธีจัดการต่อได้ที่ [หัวพอตรั่ว แก้ยังไง](/guides/fixing-a-leaking-pod)",
            ],
          },
          {
            heading: "ถอดหัวพอตแล้วเสียบใหม่ให้เข้าที่",
            paragraphs: ["ตามคู่มือของ UWELL ถ้าเครื่องไม่เจอหัวพอต Caliburn G4 จะขึ้น No Atomizer ส่วน G4 Mini จะกะพริบไฟน้ำเงิน 3 ครั้ง แปลว่าหัวพอตเสียบไม่เข้าที่ ถอดออกแล้วเสียบกลับให้แน่น เครื่องที่ใช้หัวพอต เช่น M Switch ก็ลองแบบเดียวกันได้"],
          },
          {
            heading: "ดูดค้างหรือสูบถี่ ให้เครื่องได้พักก่อน",
            paragraphs: [
              "Caliburn ตัดไฟเองถ้าดูดค้างนานเกินไป คู่มือของ UWELL บอกว่า G4 ตัดเมื่อเกิน 8 วินาที ส่วน G5 เมื่อเกิน 6 วินาที หยุดดูดก่อนแล้วค่อยสูบใหม่",
              "อีกกรณีที่ร้านเจอ คือสูบติดกันถี่ ๆ จนเครื่องอุ่น แล้วเครื่องหยุดทำงานไปเอง เครื่องบางรุ่นมีระบบหยุดทำงานเมื่อตัวเครื่องร้อน วางพักไว้จนเครื่องเย็นลงแล้วค่อยสูบใหม่ ถ้ากลับมาใช้ได้ ก็แค่เครื่องขอพักเบรกเหมือนคนทำงาน",
            ],
          },
          {
            heading: "หัวพอตใหม่ ให้น้ำยาซึมก่อนสูบ",
            paragraphs: ["ถ้าเป็น[พอตซิสเต็ม](/products/pod-systems)ที่เพิ่งเติมน้ำยาลงหัวพอตใหม่ รีบสูบทันทีอาจได้รสไหม้ วิธีเตรียมหัวพอตใหม่อยู่ที่ [หัวพอตใช้ได้กี่วัน เปลี่ยนเมื่อไหร่](/guides/coil-and-pod-maintenance)"],
          },
        ],
      },
      {
        heading: "ไฟกะพริบบน Caliburn แต่ละแบบหมายถึงอะไร",
        paragraphs: ["ไฟหรือข้อความบนจอของแต่ละรุ่นแปลไม่เหมือนกัน ความหมายของตระกูล Caliburn ข้างล่างนี้มาจากคู่มือของ UWELL ทั้งหมด"],
        subsections: [
          {
            heading: "Caliburn G4 Mini ดูจากสีไฟ",
            paragraphs: [
              "[Caliburn G4 Mini](/products/caliburn-g4-mini) ไม่มีจอ บอกสถานะด้วยสีไฟกับจำนวนครั้งที่กะพริบ ไฟแดงกะพริบ 3 ครั้งตอนสูบ คือหัวพอตช็อต ไฟแดงกะพริบ 10 ครั้ง คือแบตต่ำ ไฟเขียวกะพริบ 5 ครั้ง คือดูดค้างนานเกินไป",
              "ไฟน้ำเงินกะพริบ 3 ครั้ง คือวงจรไม่ครบ หัวพอตเสียบไม่เข้าที่ ไฟน้ำเงินกะพริบ 2 ครั้ง คือหัวพอตถูกถอด",
              "ตอนสูบ สีไฟบอกระดับแบต เขียวคือเกิน 60% น้ำเงินคือ 30–60% แดงคือต่ำกว่า 30% ส่วนตอนชาร์จ ไฟจะกะพริบ แดงคือต่ำ น้ำเงินคือกลาง เขียวคือเพียงพอ ชาร์จเต็มแล้วไฟเขียวจะติดค้าง",
            ],
          },
          {
            heading: "Caliburn G4 และ G5 ดูจากจอ",
            paragraphs: [
              "[Caliburn G4](/products/caliburn-g4) ขึ้นเป็นข้อความบนจอ 4 แบบ Atomizer short! (หัวพอตช็อต) · Battery Low! (แบตเตอรี่ต่ำ) · Over 8s! (ดูดค้างเกิน 8 วินาที) · No Atomizer (เครื่องไม่เจอหัวพอต) ขึ้นข้อความพวกนี้เมื่อไหร่ เครื่องจะหยุดจ่ายไฟ",
              "ส่วน Caliburn G5 ขึ้นข้อความ ATOMIZER SHORT · BATTERY LOW · OVER 6S (ดูดค้างเกิน 6 วินาที) · NO ATOMIZER",
            ],
          },
        ],
      },
      {
        heading: "M Switch และพอตใช้แล้วทิ้ง ไล่เช็คตามลำดับเดียวกัน",
        paragraphs: [
          "M Switch ดูดไม่ขึ้น ไฟกะพริบ ไล่เช็คตามลำดับเดียวกันได้เลย แกะพลาสติกที่ก้นพอต ชาร์จแบต เช็ดขั้วสัมผัสใต้หัวพอต ถอด [M Switch Pod](/products/m-switch-pod) แล้วเสียบกลับให้เข้าที่ และเว้นจังหวะระหว่างพัฟบ้าง",
          "พอตใช้แล้วทิ้งก็ไล่แบบเดียวกัน แต่ถ้าใช้มาจนใกล้จำนวนพัฟบนกล่องแล้ว อาการดูดไม่ขึ้นอาจมาจากน้ำยาหรือแบตที่หมดอายุการใช้งาน กรณีนี้เปลี่ยนเป็นตัวใหม่จะตรงกว่า ตัวเลขพัฟบนกล่องหมายถึงอะไร อ่านได้ที่ [พอตใช้แล้วทิ้ง 1 ตัว ใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts)",
        ],
        image: SECTION_IMAGES.mSwitchScreen,
      },
      {
        heading: "Marbo ดูดไม่ขึ้น ไฟกะพริบ เช็คอะไรบ้าง",
        paragraphs: [
          "ตระกูล M Bar และ M Switch ของ SALTHUB ที่หลายร้านเรียกว่า Marbo ไล่เช็คตามลำดับในหัวข้อข้างบนได้เลย ส่วนไฟและจอบนตัวเครื่อง ช่วยบอกเรื่องแบต การชาร์จ และโหมดได้ตามนี้",
          "M Bar 10K มีไฟ LED สี่ดวงบอกแบตทีละ 25% เหลือดวงสุดท้ายก็ใกล้หมดแล้ว และถ้ากดสองครั้งติดกันแล้วไฟ RGB เปลี่ยนสี นั่นคือการสลับโหมด Eco · Soft · Boost ส่วน M Switch Kit มีจอบอกแบตเป็นตัวเลข ระหว่างชาร์จจะมีรูปสายฟ้าขึ้นบนจอ แปลว่าไฟกำลังเข้า ถ้าไฟหรือจอบอกว่าแบตต่ำ ให้ชาร์จก่อนแล้วค่อยลองสูบใหม่",
          "ถ้าเป็นเครื่องระบบสวิตช์อย่าง M Switch แล้วลองครบทุกข้อแต่ยังดูดไม่ขึ้น ร้านแนะนำให้ลองหัวพอตใหม่ก่อน ถ้าใส่หัวใหม่แล้วสูบได้ ตัวเครื่องก็ยังใช้ต่อได้ตามเดิม ถ้ายังไม่แน่ใจว่าเครื่องที่ใช้อยู่เป็นแบบไหน ดูความต่างได้ที่[พอตใช้แล้วทิ้ง กับ พอตเปลี่ยนหัว](/guides/disposable-vs-switch-pod)",
        ],
      },
      {
        heading: "กลิ่นไหม้ รสไม่มา ไม่หอม ถึงเวลาเปลี่ยน",
        paragraphs: [
          "ถ้าดูดขึ้นแล้วแต่มีกลิ่นไหม้ รสไม่มา หรือไม่หอม จากที่ร้านเจอ อาการแบบนี้คือถึงเวลาเปลี่ยนแล้ว พอตใช้แล้วทิ้งก็เปลี่ยนเป็นตัวใหม่ เครื่องที่ใช้หัวพอตก็เปลี่ยนหัวพอตใหม่ ส่วนสาเหตุที่ไหม้และวิธีกันไหม้ไว อ่านต่อที่ [พอตไหม้ เกิดจากอะไร](/guides/fixing-a-burnt-pod)",
          "ถ้าอยากรู้ว่าหัวพอตหนึ่งหัวปกติใช้ได้นานแค่ไหน และสัญญาณไหนบอกว่าถึงรอบเปลี่ยน อ่านต่อที่ [หัวพอตใช้ได้กี่วัน เปลี่ยนเมื่อไหร่](/guides/coil-and-pod-maintenance)",
        ],
      },
    ],
    relatedProductSlugs: ["m-switch-pod", "caliburn-g4-mini", "caliburn-g4"],
    faq: [
      {
        question: "M Switch ดูดไม่ขึ้น ไฟกะพริบ ทำไง",
        answer: "เช็คก่อนว่าแกะพลาสติกที่ก้นพอตออกแล้ว จากนั้นชาร์จผ่าน USB-C เช็ดขั้วสัมผัสใต้หัวพอตให้สะอาด แล้วถอดหัวพอตเสียบกลับให้เข้าที่ ถ้าดูดขึ้นแต่มีกลิ่นไหม้หรือรสไม่มา ก็ถึงเวลาเปลี่ยนหัวพอตใหม่",
      },
      {
        question: "Caliburn ขึ้น No Atomizer แก้ยังไง",
        answer: "ตามคู่มือของ UWELL แปลว่าเครื่องไม่เจอหัวพอต ถอดหัวพอตออกแล้วเสียบกลับให้เข้าที่",
      },
      {
        question: "Caliburn G4 Mini ไฟแดงกะพริบ แปลว่าอะไร",
        answer: "ตามคู่มือของ UWELL ถ้ากะพริบ 3 ครั้งตอนสูบ คือหัวพอตช็อต ถ้ากะพริบ 10 ครั้ง คือแบตต่ำ ให้ชาร์จก่อน",
      },
      {
        question: "พอตใช้แล้วทิ้งดูดไม่ขึ้น ทำยังไง",
        answer: "เช็คก่อนว่าแกะพลาสติกที่ก้นพอตออกแล้ว ถ้าเป็นรุ่นที่ชาร์จได้อย่าง M Bar 9K กับ M Bar 10K ลองชาร์จผ่าน USB-C ก่อน ถ้าใช้มาจนใกล้จำนวนพัฟบนกล่อง หรือดูดขึ้นแต่มีกลิ่นไหม้ ก็ถึงเวลาเปลี่ยนตัวใหม่",
      },
      {
        question: "Marbo ไฟกะพริบ แปลว่าอะไร",
        answer: "ไฟของ M Bar 10K บอกแบตและโหมด ไฟสี่ดวงบอกแบตทีละ 25% และไฟ RGB เปลี่ยนสีเมื่อสลับโหมด ส่วน M Switch Kit จะมีรูปสายฟ้าขึ้นบนจอระหว่างชาร์จ ถ้าเครื่องดูดไม่ขึ้น ให้ไล่เช็คตามลำดับในบทความนี้ก่อน",
      },
      {
        question: "Marbo ดูดไม่ขึ้น ทำยังไง",
        answer: "เช็คก่อนว่าแกะพลาสติกที่ก้นพอตออกแล้ว จากนั้นชาร์จผ่าน USB-C ถ้าเป็น M Switch ให้เช็ดขั้วสัมผัสใต้หัวพอต แล้วเสียบหัวพอตกลับให้เข้าที่ ส่วน M Bar 9K กับ M Bar 10K ที่ใช้มาจนใกล้จำนวนพัฟบนกล่องแล้ว ก็ถึงเวลาเปลี่ยนตัวใหม่",
      },
    ],
    // Confirmed via YouTube oEmbed 2026-09-24 (_incoming/round10b/clips.md), owner's own channel @PODSYSTEM-OKAMI-II.
    reviewVideo: { videoId: "MlQjKTSls-0", title: "รวมปัญหาที่พบบ่อย สำหรับผู้ใช้งานพอต?", channelName: "POD SYSTEM OKAMI II", publishedAt: "2025-03-13" },
  },
  {
    // Round SEO ฉ batch 5 "green" set 1, topic 1 (owner 12/10: knowledge from the shop's own YouTube channels, Thai first).
    // Drafted by thai-copy from the shop's clips (transcripts _incoming/seo-f/yt/tx/), owner OK'd the voice + jokes and the
    // shop's own numbers (1–2 s draw on MTL, 50/50). Maker-checked facts (researcher 12/10, _incoming/seo-f/b5-articles-draft.md
    // "RESEARCH"): sweetener gunks the coil (Aspire · GeekVape · Innokin) · PG wicks faster, high VG wicks slowly → dry hit
    // (GeekVape · Vaporesso) · cold thickens liquid (Vaporesso) · wait minutes before the first puff, makers say 3–15 min.
    // Clips: channel + upload date read from YouTube's own page data 12/10.
    id: "fixing-a-burnt-pod",
    slug: "fixing-a-burnt-pod",
    title: "พอตไหม้ เกิดจากอะไร แก้ยังไง",
    dek: "พอตไหม้คือสำลีในคอยล์แห้ง ความร้อนจึงไปลงที่สำลีแทนน้ำยา รสเลยขมและบาดคอ บทความนี้รวมวิธีดูอาการ สาเหตุที่ร้านเจอบ่อย วิธีแก้ และนิสัยเล็ก ๆ ที่ช่วยไม่ให้ไหม้ไว",
    category: "maintenance",
    readingTimeMin: 6,
    publishedAt: "2026-10-12",
    thaiOnly: true,
    body: [
      {
        heading: "พอตไหม้คืออะไร เป็นยังไง",
        paragraphs: [
          "พอตไหม้คืออาการที่สำลีในคอยล์มีน้ำยาไม่พอ ตอนสูบคอยล์ก็ร้อนตามปกติ แต่ความร้อนไปลงที่สำลีแห้ง ๆ แทนที่จะทำให้น้ำยากลายเป็นไอ รสที่ได้จึงขม ฝาด และบาดคอ เป็นรสที่ใครเจอครั้งแรกแล้วก็จำได้ไปอีกนาน",
          "อาการนี้เกิดได้กับพอตทุกแบบ ทั้งพอตซิสเต็มที่เติมน้ำยาเอง และพอตใช้แล้วทิ้ง จากที่ร้านเจอ ส่วนใหญ่มาจากวิธีใช้ซึ่งปรับได้ ไม่ได้แปลว่าเครื่องเสียเสมอไป",
        ],
      },
      {
        heading: "พอตไหม้ดูยังไง แยกให้ออกจากรสดรอป",
        paragraphs: [
          "ดูจากรสก่อนเลย ถ้าสูบแล้วขม ฝาด บาดคอ หรือมีกลิ่นไหม้ติดปลายลิ้น แบบนี้คือไหม้แล้ว ถ้าเป็นหัวพอตใสหรือคอยล์ที่ถอดออกมาดูได้ จะเห็นสำลีเปลี่ยนจากสีขาวเป็นสีน้ำตาลเข้มหรือดำ และบางครั้งน้ำยาในหัวพอตก็สีเข้มขึ้นด้วย",
          "แต่ถ้ารสแค่ดรอปหรือจางลง ยังไม่นับว่าไหม้ ที่ร้านแยกแบบนี้ ถ้าจางหลังใช้มาหลายวัน มักเป็นคอยล์ที่เริ่มหมดสภาพตามการใช้งาน ถ้าจางตั้งแต่วันแรก อาจเป็นที่ตัวน้ำยาเอง หรือน้ำยาไม่เข้ากับคอยล์ตัวนั้น เปลี่ยนคอยล์แล้วรสยังจางอยู่ ลองเปลี่ยนยี่ห้อน้ำยาดูได้",
        ],
      },
      {
        heading: "พอตไหม้เกิดจากอะไร",
        paragraphs: [
          "ที่ร้านเจอบ่อยคือดูดยาวและสูบรัวเกินกว่าที่เครื่องทำมารองรับ เครื่องเล็กที่สูบแบบ MTL มีคอยล์ตัวเล็ก ดึงน้ำยาเข้าสำลีได้ทีละนิด ถ้าดูดยาว ๆ แบบเครื่อง DTL หรือสูบติดกันหลายพัฟโดยไม่พัก น้ำยาจะซึมกลับเข้าสำลีไม่ทัน แล้วสำลีที่แห้งก็ไหม้",
          "รองลงมาคือรีบสูบหัวพอตใหม่ทันทีหลังเติมน้ำยา สำลียังไม่ทันชุ่ม พัฟแรกก็ไหม้ได้เลย หลายคนเจอแล้วนึกว่าได้ของเสีย ทั้งที่จริงแค่ใจร้อนไปนิดเดียว วิธีเตรียมหัวพอตใหม่อยู่ที่ [วิธีดูแลคอยล์และหัวพอต](/guides/coil-and-pod-maintenance)",
          "อีกสองเรื่องที่เจอได้เหมือนกัน คือปล่อยน้ำยาเหลือน้อยจนสำลีโผล่พ้นน้ำยา และสำหรับเครื่องที่ปรับวัตต์เองได้ คือตั้งวัตต์สูงเกินช่วงที่คอยล์รับได้ วิธีตั้งวัตต์ให้เข้ากับคอยล์อ่านได้ที่ [เลือกวัตต์และช่องลม](/guides/choosing-wattage-and-airflow) ส่วนน้ำยาก็มีส่วนเหมือนกัน ขอแยกเล่าในหัวข้อถัดไป",
        ],
      },
      {
        heading: "น้ำยาหวานจัดหรือข้นเกินไป ก็ทำให้ไหม้ไว",
        paragraphs: [
          "จากที่ร้านใช้เอง น้ำยาที่หวานจัดทำให้สำลีคล้ำเร็วกว่าน้ำยารสอ่อน ๆ เพราะความหวานไปเกาะสำลีจนดูดน้ำยาได้ไม่ดีเหมือนเดิม ไม่ได้แปลว่าห้ามสูบรสหวาน แค่ถ้าชอบสายหวาน ก็เผื่อใจไว้ว่าจะได้เปลี่ยนคอยล์ถี่กว่าเพื่อนสักหน่อย",
          "อีกเรื่องคือความข้นของน้ำยา ข้างขวดมักบอกสัดส่วน PG กับ VG ไว้ VG ข้นกว่าและทำให้ควันดูหนาขึ้น ส่วน PG ใสกว่าและซึมเข้าสำลีได้เร็วกว่า ถ้าใช้น้ำยา VG สูงกับคอยล์ตัวเล็กของเครื่อง MTL น้ำยาอาจซึมไม่ทันจนไหม้ได้ ถ้ายังไม่แน่ใจ ร้านเรามักแนะนำสัดส่วนกลาง ๆ อย่าง 50/50 ไว้ก่อน",
          "และอีกข้อที่ร้านทำเองเสมอ คือคอยล์หนึ่งตัวต่อน้ำยาหนึ่งกลิ่น ถ้าเปลี่ยนกลิ่นกลางทาง กลิ่นเก่าที่ค้างในสำลีจะตีกับกลิ่นใหม่ ใช้กลิ่นเดิมไปจนถึงรอบเปลี่ยนคอยล์ แล้วค่อยเริ่มกลิ่นใหม่กับคอยล์ใหม่",
        ],
      },
      {
        heading: "พอตไหม้แล้ว แก้ยังไง",
        paragraphs: [
          "ตอบตรง ๆ ก่อนว่า ถ้าไหม้จริงแล้ว สำลีที่ไหม้ไม่ฟื้นกลับมา ทางแก้คือเปลี่ยน พอตใช้แล้วทิ้งก็เปลี่ยนเป็นตัวใหม่ เครื่องที่ใช้หัวพอตก็เปลี่ยนหัวพอตใหม่ เครื่องที่ถอดคอยล์ได้ก็เปลี่ยนคอยล์ ของใหม่ดูได้ที่หมวด [หัวพอต](/products/pods-cartridges) และ [คอยล์และอุปกรณ์เสริม](/products/coils-accessories) เช็คให้ตรงรุ่นเครื่องก่อนทุกครั้ง",
          "ก่อนใส่คอยล์ใหม่ ถ้าถังน้ำยาถอดล้างได้ ล้างให้สะอาดแล้วปล่อยให้แห้งสนิทก่อน ถ้ารีบ ใช้เครื่องเป่าผมช่วยได้ เพราะน้ำยาเก่าที่ติดขอบถังจะพากลิ่นไหม้ตามมาหาคอยล์ใหม่ด้วย",
          "ถ้ายังไม่ถึงขั้นไหม้ แค่รสเริ่มดรอปและสำลีเริ่มคล้ำ ร้านมีวิธีที่ใช้เองกับคอยล์แบบถอดได้ ถอดคอยล์ออกมา ใช้ทิชชู่ซับคราบน้ำยาเก่าที่สำลีจนสีอ่อนลง ห้ามเอาไปล้างน้ำ จากนั้นใส่กลับ เติมน้ำยาใหม่ แล้วรอให้น้ำยาซึมก่อนสูบ วิธีนี้ช่วยยืดเวลาได้อีกหน่อย แต่ใช้ได้กับคอยล์ที่ยังไม่ไหม้เท่านั้น",
        ],
        image: SECTION_IMAGES.argusG3MiniCartridge,
      },
      {
        heading: "ทำยังไงไม่ให้พอตไหม้ไว",
        paragraphs: [
          "นิสัยที่ช่วยได้มากคือดูดให้พอดีกับเครื่อง กับเครื่องเล็กที่สูบแบบ MTL ร้านเราดูดครั้งละราว 1–2 วินาทีก็พอ และเว้นจังหวะระหว่างพัฟบ้าง ให้น้ำยาได้ซึมกลับเข้าสำลี ถ้าชอบดูดยาวให้ควันแน่น เครื่องที่ทำมาสำหรับสูบแบบ DTL จะเข้ากับคุณมากกว่า อ่านความต่างได้ที่ [MTL กับ DTL ต่างยังไง](/guides/understanding-mtl-vs-dtl)",
          "อย่าปล่อยให้น้ำยาเหลือน้อยจนสำลีโผล่ และใช้หลักที่ร้านพูดติดปากว่า ใช้มากเติมมาก ใช้น้อยเติมน้อย เพราะน้ำยาที่ค้างในหัวพอตนาน ๆ จะสีเข้มขึ้นและพาคราบเก่ามาเกาะสำลี บางคนจึงเทน้ำยาเก่าออกก่อนเติมใหม่ทุกวันเลยด้วยซ้ำ",
          "สุดท้ายคือที่เก็บ อากาศเย็นจัดอาจทำให้น้ำยาข้นขึ้นและซึมช้าลง เก็บพอตไว้ในอุณหภูมิห้องดีกว่า ส่วนความร้อนกับเรื่องน้ำยารั่ว อ่านต่อได้ที่ [หัวพอตรั่ว เกิดจากอะไร](/guides/fixing-a-leaking-pod)",
        ],
      },
    ],
    // No relatedProductSlugs (12/10): listing coil-94 pushed its specific "multi-resistance" link out of the 3-slot box.
    faq: [
      {
        question: "พอตไหม้แล้ว สูบต่อได้ไหม",
        answer: "สำลีที่ไหม้แล้วไม่ฟื้นกลับมา สูบต่อก็ยังเจอรสไหม้แบบเดิม รสจะกลับมาก็ต่อเมื่อเปลี่ยนหัวพอตหรือคอยล์ใหม่ ส่วนพอตใช้แล้วทิ้งต้องเปลี่ยนเป็นตัวใหม่",
      },
      {
        question: "พอตใช้แล้วทิ้งไหม้ แก้ได้ไหม",
        answer: "แก้ไม่ได้ เพราะคอยล์อยู่ในตัวเครื่องและเปลี่ยนแยกไม่ได้ ต้องเปลี่ยนเป็นตัวใหม่ ถ้าไหม้ทั้งที่ใช้ไปได้ไม่นาน ลองดูวิธีสูบ สูบติดกันหลายพัฟหรือดูดยาวเกินไปทำให้ไหม้ไวได้",
      },
      {
        question: "หัวพอตใหม่ ทำไมไหม้ตั้งแต่พัฟแรก",
        answer: "ส่วนใหญ่คือสูบก่อนที่น้ำยาจะซึมเข้าสำลีทั่ว หลังเติมน้ำยาให้ตั้งหัวพอตทิ้งไว้สักหลายนาทีก่อนสูบครั้งแรก นานแค่ไหนดูคู่มือของรุ่นนั้นได้ ถ้าไหม้ไปแล้ว หัวนั้นต้องเปลี่ยนใหม่",
      },
    ],
    // Owner 12/10: the round-"clip" coil clip (#4 on page 1 for "คอยล์พอต", @OKMYARZ) is this article's own clip now.
    reviewVideo: { videoId: "f86AJRNHX4U", title: "ทำไมคอยล์พอตถึงพังไว? แล้วทำยังไงให้ใช้ได้นาน", channelName: "OKM YARZ", publishedAt: "2025-03-03" },
  },
  {
    // Round SEO ฉ batch 5 "green" set 1, topic 2 — same method as fixing-a-burnt-pod. Owner OK'd the 80–90% fill. Maker-
    // checked (researcher 12/10): hard pulls flood / spit (Innokin · Vaporesso) · overfill leaks, leave air space (Innokin ·
    // Vaporesso · Aspire) · heat and air pressure expand the air and push liquid out (Vaporesso · Innokin · UWELL manual:
    // remove the pod on a plane) — "contracts when cold" not found, so not said · upright storage helps (no "lying down
    // always leaks") · makers say keep the contacts clean (grime), not "liquid kills the device" → shop experience only.
    // Claim window = the shop's own claims page (/warranty: 7 days, unboxing clip, "น้ำยารั่ว ซึม ในสภาพยังไม่ได้ใช้").
    id: "fixing-a-leaking-pod",
    slug: "fixing-a-leaking-pod",
    title: "หัวพอตรั่ว แก้ยังไง เกิดจากอะไร",
    dek: "จากที่ร้านเจอ หัวพอตรั่วส่วนใหญ่ไม่ได้แปลว่าของเสีย แต่มาจากวิธีสูบ วิธีเติม และวิธีเก็บเครื่อง บทความนี้บอกว่าเจอน้ำยารั่วแล้วควรทำอะไรก่อน และนิสัยไหนช่วยไม่ให้รั่วซ้ำ",
    category: "maintenance",
    readingTimeMin: 6,
    publishedAt: "2026-10-12",
    thaiOnly: true,
    body: [
      {
        heading: "หัวพอตรั่วเกิดจากอะไร",
        paragraphs: [
          "หัวพอตรั่วเกิดจากอะไร จากที่ร้านเจอ ส่วนใหญ่ไม่ได้เกิดจากหัวพอตเสีย แต่มาจากสี่เรื่องที่ปรับเองได้ คือดูดแรงเกินไป เติมน้ำยาเต็มเกินไป ไม่ได้เก็บเครื่องแบบตั้งตรง และปล่อยเครื่องไว้ในที่ร้อนจัด ส่วนที่เหลือคือซีลยางเสื่อมตามอายุการใช้งาน กรณีนี้ต้องเปลี่ยนหัวพอต",
          "น้ำยารั่วมีสองแบบที่ควรแยกให้ออก แบบแรกคือน้ำยาซึมลงก้นพอต เห็นเป็นคราบเยิ้ม ๆ ตรงขั้วสัมผัสใต้หัวพอต แบบที่สองคือน้ำยาขึ้นมาทางปากดูด สูบแล้วมีหยดน้ำยาเด้งเข้าปาก สองแบบนี้สาเหตุคล้ายกัน แต่แบบแรกต้องรีบจัดการก่อน เพราะน้ำยาอยู่ใกล้วงจรของเครื่อง",
        ],
        image: SECTION_IMAGES.caliburnG4AntiLeak,
      },
      {
        heading: "น้ำยารั่วแล้ว ทำอะไรก่อน",
        paragraphs: [
          "เห็นน้ำยาเยิ้มเมื่อไหร่ ถอดหัวพอตออกก่อนเลย แล้วเช็ดขั้วสัมผัสบนตัวเครื่องกับก้นหัวพอตให้แห้งด้วยทิชชู่หรือสำลีก้าน ผู้ผลิตเองก็แนะนำให้เช็ดขั้วสัมผัสให้สะอาดอยู่เสมอ และจากที่ร้านเจอ เครื่องที่มีน้ำยาค้างที่ขั้วบ่อย ๆ มักมีปัญหาตามมา",
          "ถ้ารั่วเยอะจนน้ำยาค้างในช่องลม ให้เป่าไล่ออกทางช่องลมเบา ๆ แล้วเช็ดอีกรอบ พักไว้ให้แห้งก่อนใส่หัวพอตกลับ ส่วนพอตใช้แล้วทิ้งที่รั่วออกทางปากดูด ใช้ทิชชู่หรือสำลีก้านซับด้านในปากดูดให้แห้ง แล้วพักเครื่องไว้สักครู่ก่อนสูบต่อ หลังจากนี้เวลาถอดหัวพอต ลองเหลือบดูขั้วสัมผัสสักนิด เห็นคราบก็เช็ดออก จะได้ไม่สะสม",
          "ถ้าแกะกล่องมาแล้วน้ำยาซึมทั้งที่ยังไม่ได้ใช้ กรณีนี้เคลมได้ตาม[นโยบายเคลม](/warranty)ของร้าน แจ้งทางไลน์ @okm24 ภายใน 7 วันนับจากวันที่ได้รับของ พร้อมคลิปตอนแกะกล่องให้ร้านดู",
        ],
      },
      {
        heading: "ดูดแรงและสูบรัว น้ำยาเลยถูกดึงขึ้นมา",
        paragraphs: [
          "สาเหตุที่ร้านเจอบ่อยคือดูดแรงเกินไป ยิ่งดูดแรง น้ำยาในสำลียิ่งถูกดึงขึ้นมาค้างในช่องลมเร็วกว่าที่คอยล์จะทำให้เป็นไอทัน น้ำยาส่วนเกินนี้แหละที่ซึมลงก้นพอต หรือเด้งขึ้นมาทางปากดูด",
          "สูบพอตไม่ต้องออกแรงเหมือนดูดไข่มุกติดหลอด ดูดช้า ๆ สม่ำเสมอก็ได้รสแล้ว และเว้นจังหวะระหว่างพัฟบ้าง โดยเฉพาะพอตใช้แล้วทิ้ง ถ้าสูบติดกันหลายพัฟ น้ำยาเดินไม่ทันแล้วก็มักออกมาทางปากดูด ถ้าชอบดูดยาวและแรง เครื่องที่ทำมาสำหรับสูบแบบ DTL จะรับได้ดีกว่าเครื่องเล็ก",
          "อีกกรณีที่ร้านเจอกับพอตใช้แล้วทิ้งหลายยี่ห้อ คือแบตใกล้หมดแต่ยังสูบถี่ ๆ น้ำยามักเด้งเข้าปาก ลองชาร์จสักพักก่อนแล้วค่อยกลับมาสูบ วิธีชาร์จให้ถูกอยู่ที่ [วิธีดูแลแบตเตอรี่และการชาร์จ](/guides/battery-care-and-charging)",
        ],
      },
      {
        heading: "เติมน้ำยาเต็มเกินไป หรือเติมแล้วสูบทันที",
        paragraphs: [
          "หัวพอตแบบเติมน้ำยาเองต้องเหลือที่ว่างให้อากาศอยู่บ้าง ถ้าเติมจนปริ่มขอบ พอเครื่องอุ่นขึ้นตอนใช้งาน น้ำยาไม่มีที่ให้ขยับ ก็หาทางออกทางช่องลมแทน ร้านเราเติมราว 80–90% ของหัวพอต และไม่เกินขีดบอกระดับ ถ้ารุ่นนั้นมีขีดไว้",
          "อีกจังหวะที่น้ำยาเด้งเข้าปากบ่อย คือเพิ่งเติมเสร็จแล้วสูบทันที ให้พักหัวพอตไว้สักครู่ก่อน ให้น้ำยาซึมเข้าสำลีและนิ่งก่อน ข้อนี้ช่วยทั้งเรื่องรั่วและเรื่องไหม้ไปพร้อมกัน ฝั่งไหม้อ่านต่อได้ที่ [พอตไหม้ เกิดจากอะไร](/guides/fixing-a-burnt-pod)",
        ],
        image: SECTION_IMAGES.caliburnG4ClassicRefill,
      },
      {
        heading: "เก็บเครื่องตั้งตรง และอย่าทิ้งไว้ที่ร้อนจัด",
        paragraphs: [
          "เรื่องที่ร้านเห็นคนมองข้ามบ่อยคือวิธีเก็บเครื่อง น้ำยาไหลตามแรงโน้มถ่วง ซึ่งไม่เคยหยุดงานสักวัน เครื่องที่วางนอนหรือใส่กระเป๋าแบบหัวคว่ำทิ้งไว้นาน ๆ น้ำยาจะไปกองอยู่ด้านเดียว และจากที่ร้านเจอ มักซึมออกทางช่องลม เก็บเครื่องแบบตั้งตรงช่วยลดโอกาสรั่วได้ ใส่กระเป๋าก็ให้ปากดูดอยู่ด้านบน",
          "อีกเรื่องคือความร้อนและความกดอากาศ พอตที่ทิ้งไว้ในรถกลางแดด อากาศในหัวพอตจะขยายตัวจนดันน้ำยาออกมาได้ง่าย ตอนขึ้นเครื่องบินก็เหมือนกัน ความกดอากาศที่เปลี่ยนไปดันน้ำยาออกมาได้ เก็บไว้ในอุณหภูมิห้องดีกว่า ใครกำลังจะบิน วิธีพกพอตขึ้นเครื่องอ่านต่อได้ที่ [พอตขึ้นเครื่องบินได้ไหม](/guides/taking-a-pod-on-a-plane)",
          "ถ้าต้องวางเครื่องทิ้งไว้ทั้งคืน ร้านแนะนำให้ถอดหัวพอตออกจากตัวเครื่อง แล้วตั้งไว้บนทิชชู่ ถ้าจะซึมก็ซึมลงทิชชู่ ไม่ลงขั้วสัมผัสของเครื่อง",
        ],
      },
      {
        heading: "ดูแลดีแล้วยังรั่ว ถึงเวลาเปลี่ยน",
        paragraphs: [
          "ถ้าสูบเบาลงแล้ว เติมพอดีแล้ว เก็บตั้งตรงแล้ว แต่น้ำยายังซึมอยู่เรื่อย ๆ ให้ดูที่ซีลยาง หัวพอตที่ถอดคอยล์ได้จะมีซีลยางกันน้ำยาอยู่รอบคอยล์หรือก้นหัวพอต ใช้ไปนาน ๆ ยางจะเสื่อม ถ้าเห็นว่ายางสึกหรือไม่แนบแล้ว เปลี่ยนเลยดีกว่า ถึงคอยล์จะยังไม่ไหม้ก็ตาม",
          "หัวพอตที่คอยล์อยู่ในตัวจะมองไม่เห็นซีล ถ้ารั่วซ้ำ ๆ ทั้งที่ดูแลดีแล้ว เปลี่ยนหัวพอตใหม่จะจบกว่า พอตใช้แล้วทิ้งที่ซึมไม่หยุดก็เปลี่ยนเป็นตัวใหม่ ของใหม่ดูได้ที่หมวด [หัวพอต](/products/pods-cartridges) และ [คอยล์และอุปกรณ์เสริม](/products/coils-accessories) เช็คให้ตรงรุ่นเครื่องก่อนทุกครั้ง",
          "ที่ไม่ควรฝืนใช้ต่อ เพราะจากที่ร้านเจอ น้ำยาที่ซึมเข้าตัวเครื่องบ่อย ๆ มักพาปัญหาอื่นตามมา เปลี่ยนหัวพอตหนึ่งหัวยังคุ้มกว่าเปลี่ยนเครื่องใหม่ทั้งเครื่อง",
        ],
      },
    ],
    faq: [
      {
        question: "หัวพอตน้ำยารั่ว ยังสูบต่อได้ไหม",
        answer: "ถอดหัวพอตออกแล้วเช็ดขั้วสัมผัสกับก้นหัวพอตให้แห้งก่อน ถ้าเช็ดแล้วไม่ซึมออกมาอีก ก็ใช้ต่อได้ตามปกติ แต่ถ้ายังซึมเรื่อย ๆ ทั้งที่สูบเบาและเก็บตั้งตรงแล้ว แปลว่าซีลยางหรือหัวพอตเริ่มเสื่อม ควรเปลี่ยนหัวพอตใหม่",
      },
      {
        question: "พอตใช้แล้วทิ้งน้ำยารั่ว แก้ยังไง",
        answer: "ใช้ทิชชู่หรือสำลีก้านซับน้ำยาที่ปากดูดให้แห้ง แล้วพักเครื่องไว้สักครู่ก่อนสูบต่อ หลังจากนั้นสูบให้เบาลงและเว้นจังหวะระหว่างพัฟ เก็บเครื่องแบบตั้งตรง ถ้ายังซึมไม่หยุด เปลี่ยนเป็นตัวใหม่",
      },
      {
        question: "น้ำยาลงขั้ว เครื่องไม่ทำงาน ทำยังไง",
        answer: "ถอดหัวพอตออก เช็ดขั้วสัมผัสทั้งบนตัวเครื่องและก้นหัวพอตให้แห้ง แล้วพักเครื่องไว้ให้แห้งสนิทก่อนลองใหม่ ถ้ายังไม่ทำงาน ไล่เช็คต่อตามขั้นในบทความ “พอตดูดไม่ขึ้น ไฟกะพริบ แก้ยังไง”",
      },
    ],
    reviewVideo: { videoId: "KqrsdAvi5qM", title: "ทำไมพอตรั่ว? สาเหตุพร้อมวิธีแก้ไข", channelName: "OKM YARZ", publishedAt: "2025-12-30" },
  },
  {
    // Round 10B T11 — writer draft 1 + thai-copy pass (2026-09-24), source map _incoming/round10b/writer-1-result.md.
    // M Switch battery (600mAh on salthub.com — /m-switch/ now redirects to the home page) is deliberately NOT stated: the m-switch-kit spec row is still
    // unverified. Owner 06/10 pm (HANDOFF §18): a missing fact is left unsaid — never explain the absence.
    // Owner fix A (2026-09-24): M Switch Pod capacity removed too — SALTHUB does not state it (salthub-mswitch-check.md).
    id: "esko-bar-switch-vs-m-switch",
    slug: "esko-bar-switch-vs-m-switch",
    title: "Esko Bar Switch 20K กับ M Switch (Marbo) ต่างกันยังไง",
    dek: "ทั้งคู่เก็บตัวเครื่องไว้ เปลี่ยนแค่หัวพอต ตามสเปกผู้ผลิต Esko Bar Switch 20K หัวละ 20,000 พัฟ ส่วน M Switch หัวละ 15,000 พัฟ ที่เหลือเทียบทีละข้อ",
    category: "buying-guide",
    readingTimeMin: 6,
    publishedAt: "2026-09-24",
    thaiOnly: true,
    body: [
      {
        heading: "Esko Bar Switch 20K กับ M Switch ต่างกันยังไง",
        paragraphs: [
          "ทั้งสองรุ่นเป็นเครื่องระบบสวิตช์ เก็บตัวเครื่องไว้ชาร์จใช้ต่อ เปลี่ยนแค่หัวพอต ที่ต่างคือตัวเลข ตามเว็บผู้ผลิต Esko Bar Switch 20K หัวละ 20,000 พัฟ แบต 850mAh มีโหมด High กับ Low และปรับช่องลมได้ 3 ระดับ ส่วน M Switch หัวละ 15,000 พัฟ",
          "M Switch เป็นของ SALTHUB ตระกูลเดียวกับที่หลายร้านเรียกว่า Marbo ส่วน Esko Bar เป็นอีกแบรนด์หนึ่ง",
          "ตัวเลขในบทความนี้มาจาก [เว็บ Esko Bar](https://eskobarvape.com/product/pod-system/) กับ [เว็บ SALTHUB](https://www.salthub.com/)",
        ],
      },
      {
        heading: "Esko Bar Switch 20K เปลี่ยนหัวได้ไหม",
        paragraphs: [
          "ได้ ผู้ผลิตเขียนไว้ว่าเป็นหัวพอตแบบถอดเปลี่ยนได้ (Replaceable Pod) ตัวแบตกับถังน้ำยาแยกจากกัน เปลี่ยนกลิ่นได้โดยไม่ต้องเปลี่ยนทั้งเครื่อง",
          "หลักเดียวกับ [M Switch Kit](/products/m-switch-kit) ที่ทิ้งแค่หัวพอต [M Switch Pod](/products/m-switch-pod) ตัวเครื่องเก็บไว้ ส่วนหน้าสินค้าของ Esko อยู่ที่ [Esko Bar Switch 20K](/products/pod-159)",
        ],
      },
      {
        heading: "เทียบสเปกทีละข้อ",
        paragraphs: [],
        subsections: [
          { heading: "จำนวนพัฟต่อหัว", paragraphs: ["Esko Bar Switch 20K หัวละ 20,000 พัฟ ส่วน M Switch หัวละ 15,000 พัฟ"] },
          { heading: "ความจุน้ำยา", paragraphs: ["Esko Bar Switch 20K ระบุความจุน้ำยา 18mL"] },
          { heading: "ความเข้มข้นนิโคติน", paragraphs: ["M Switch ระบุไว้ 30mg แบบ salt nic"] },
          { heading: "แบตและการชาร์จ", paragraphs: ["Esko Bar Switch 20K แบต 850mAh ชาร์จที่ 5V 0.85A ส่วนตัวเครื่อง M Switch มีจอบอกระดับแบต ทั้งคู่ชาร์จผ่าน USB-C"], image: SECTION_IMAGES.mSwitchCharge },
          { heading: "คอยล์", paragraphs: ["Esko เขียนว่าเป็นระบบ Dual Coil (คอยล์สองตัว) ส่วน M Switch ใช้คอยล์ cotton mesh 1.0 โอห์ม"] },
          { heading: "โหมดและช่องลม", paragraphs: ["Esko มีโหมด High กับ Low ปรับช่องลมได้ 3 ระดับ ส่วน M Switch มีปุ่มเลื่อนปรับลม"], image: SECTION_IMAGES.mSwitchAirflow },
        ],
      },
      {
        heading: "เลือกตามอะไร",
        paragraphs: [
          "ไม่มีรุ่นไหนชนะขาด ดูว่าอะไรสำคัญกับคุณ อยากได้พัฟต่อหัวที่มากกว่า ตามสเปกผู้ผลิต Esko Bar Switch 20K ตัวเลขสูงกว่า อยากสลับโหมดได้ Esko มีโหมด High กับ Low ส่วนช่องลม ปรับได้ทั้งสองรุ่น",
          "ถ้าใช้ M Bar อยู่แล้ว M Switch ก็เป็นของ SALTHUB เจ้าเดียวกัน",
          "ที่ร้าน ลูกค้าที่ลังเลระหว่างสองรุ่นนี้ สุดท้ายเลือกพอ ๆ กัน แต่เอนไปทาง M Switch เรื่องนี้บอกแค่ว่าคนเลือกอะไร ไม่ได้บอกว่ารุ่นไหนดีกว่า",
          "ยังไม่แน่ใจว่าจะเอาเครื่องระบบสวิตช์หรือพอตใช้แล้วทิ้ง อ่าน [พอตใช้แล้วทิ้ง กับ พอตเปลี่ยนหัว](/guides/disposable-vs-switch-pod) รุ่นอื่นของสองแบรนด์อยู่ที่ [Esko Bar](/brands/esko-bar) กับ [SALTHUB](/brands/salthub)",
        ],
      },
    ],
    relatedProductSlugs: ["pod-159", "m-switch-pod"],
    faq: [
      {
        question: "Esko Bar Switch 20K เปลี่ยนหัวได้ไหม",
        answer: "ได้ ผู้ผลิตระบุว่าเป็นหัวพอตแบบถอดเปลี่ยนได้ ตัวแบตกับถังน้ำยาแยกจากกัน เปลี่ยนกลิ่นได้โดยไม่ต้องเปลี่ยนทั้งเครื่อง",
      },
      {
        question: "Esko Bar กับ Marbo ต่างกันไหม",
        answer: "เป็นคนละแบรนด์ Marbo คือชื่อที่หลายร้านใช้เรียกของ SALTHUB อย่าง M Bar กับ M Switch ถ้าเทียบรุ่นเปลี่ยนหัวด้วยกัน คู่ที่ใกล้กันคือ Esko Bar Switch 20K กับ M Switch",
      },
      {
        question: "Esko Bar Switch 20K ชาร์จยังไง",
        answer: "ชาร์จผ่าน USB-C ผู้ผลิตระบุการชาร์จที่ 5V 0.85A แบตในตัว 850mAh",
      },
    ],
    // Confirmed via YouTube oEmbed 2026-09-24 (_incoming/round10b/clips.md), owner's own channel @OKMYARZ — names the
    // Switch model explicitly (the OKAMI comparison clip only says "ESKO BAR 20K", which may be the non-Switch model).
    reviewVideo: { videoId: "iDoW0BuyWog", title: "ESKO BAR SWITCH 20000 มันจะขนาดนั้นเลยหรอเนี้ยย?", channelName: "OKM YARZ", publishedAt: "2025-12-20" },
  },
  {
    // Round 10B T05' — writer draft 2 + thai-copy pass (2026-09-24), source map _incoming/round10b/writer-2-result.md. Held
    // under owner ruling D3, released 2026-10-02 (owner) — spec-only by the owner's instruction, no shop experience. The
    // pre-release check "G4 fires on a draw" = the G4 spec row `firing` ("Draw or button (auto mode)"), verified on the UWELL
    // manual copy in the data round of 2026-09-24 (uwell.ts).
    id: "comparing-caliburn-models",
    slug: "comparing-caliburn-models",
    title: "Caliburn G5 vs G4 ต่างกันยังไง เทียบ Caliburn 8 รุ่น",
    dek: "G5 แบต 1600mAh สลับโหมดด้วยการแตะ G4 แบต 1300mAh มีปุ่มยิง G4 Pro แบต 1800mAh จอทัช เทียบสเปกทีละคู่",
    category: "buying-guide",
    readingTimeMin: 7,
    publishedAt: "2026-10-02",
    thaiOnly: true,
    body: [
      {
        heading: "สรุปก่อน: ต่างกันตรงไหน",
        paragraphs: [
          "Caliburn G5 กับ G4 ต่างกันยังไง ตอบสั้น ๆ คือ G5 แบตมากกว่า (1600mAh กับ 1300mAh) และสลับโหมดด้วยการแตะ ไม่มีปุ่ม ส่วน G4 มีปุ่มยิง ทั้งคู่ใช้หัวพอต GPP ระบบเดียวกัน",
          "Caliburn 8 รุ่นในบทความนี้ (G5 · G5 Lite · G5 Lite SE · G4 Pro · G4 · G4 Mini · G4 Classic · G3 Pro) ต่างกันอยู่ 4 เรื่อง คือจอกับการควบคุม ขนาดแบต การปรับช่องลม และระบบหัวพอต ส่วนวัตต์สูงสุด ทุกรุ่นอยู่ที่ 35 วัตต์เท่ากัน",
          "ตัวเลขทั้งหมดมาจากตารางสเปกบนหน้าสินค้า ถ้ามาจากคู่มือของ UWELL เราบอกไว้ตรงนั้น",
        ],
      },
      {
        heading: "จัดกลุ่มตามสเปก",
        paragraphs: [],
        subsections: [
          {
            heading: "จอและการควบคุม",
            paragraphs: [
              "[Caliburn G5](/products/caliburn-g5) จอสี 0.85 นิ้ว สลับโหมดด้วยระบบ Smart Triple-Tap Control คือแตะตัวเครื่องสามครั้ง ตามคู่มือของ UWELL ไม่มีปุ่ม ส่วน [Caliburn G4](/products/caliburn-g4) จอสี เลือกโหมดวัตต์บนจอได้ มีปุ่มยิง และตามคู่มือของ UWELL สูบได้เลยโดยไม่ต้องกดปุ่มก็ได้",
              "[Caliburn G4 Pro](/products/caliburn-g4-pro) จอทัช 2.51 นิ้ว · [Caliburn G3 Pro](/products/caliburn-g3-pro) จอ LCD โอบด้านข้างเครื่อง ส่วน [Caliburn G4 Mini](/products/caliburn-g4-mini) ไม่มีจอ ตามคู่มือของ UWELL ใช้ปุ่มกับไฟ LED บอกสถานะ",
              "[Caliburn G4 Classic](/products/caliburn-g4-classic) ก็ไม่มีจอ ใช้ไฟ RGB 14 ดวงบอกระดับแบต และสูบได้ทั้งแบบดูดและกดปุ่ม",
              "[Caliburn G5 Lite](/products/caliburn-g5-lite) กับ G5 Lite SE ตัดจอสีกับระบบแตะของ G5 ออก ใช้ไฟ LED 4 ขีดบอกระดับแบต",
            ],
            image: SECTION_IMAGES.caliburnG4ProOneTap,
          },
          {
            heading: "แบต",
            paragraphs: [
              "G4 Pro 1800mAh · G5 · G5 Lite และ G5 Lite SE 1600mAh · G4 Classic 1400mAh · G4 1300mAh · G4 Mini 1100mAh · G3 Pro 1000mAh ใช้ mAh เทียบกันระหว่างรุ่นได้ แต่อย่าแปลงเป็นชั่วโมง วิธีอ่านอยู่ที่ [วิธีอ่านสเปกพอต](/guides/reading-a-spec-sheet)",
              // Data round (2026-09-24): the charge-time line ("G4 ~30 min, G4 Mini ~58 min at 2A") is cut — neither figure is
              // on a UWELL page or manual (held article, fixed in the file only; it stays held).
            ],
            image: SECTION_IMAGES.caliburnG5Battery,
          },
          {
            heading: "ช่องลม",
            paragraphs: [
              "G4 Pro ปรับช่องลมได้ละเอียดแบบไม่มีขั้น G3 Pro ปรับได้เต็มช่วง G5 ปรับช่องลมด้านข้างแบบไม่มีขั้น ตั้งแต่ MTL ถึง RDL",
              "G5 Lite กับ G5 Lite SE ปรับได้สองทาง คือกลับด้านหัวพอตและปรับแบบไม่มีขั้น G4 Classic ก็ปรับแบบไม่มีขั้นและกลับด้านหัวพอตได้ ส่วน G4 กับ G4 Mini ใช้ปุ่มเลื่อนปรับลมคู่กับการกลับด้านหัวพอต",
            ],
          },
          {
            heading: "ระบบหัวพอต",
            paragraphs: [
              "G5 · G5 Lite · G5 Lite SE · G4 · G4 Mini และ G4 Classic ใช้หัวพอต GPP (G Pod Platform) ของ UWELL ส่วน G4 Pro ใช้ได้ทั้ง GPP และหัวพอต G3 สำหรับ G3 Pro หน้าสินค้าระบุหัวพอต G3 มาในกล่อง 2 หัว คือ 0.4 โอห์ม (3mL) กับ 0.9 โอห์ม (2.5mL)",
              // Round "SEO all keys" 16/10: the old line ("G4 and G4 Mini come with 0.4 + 0.9, 0.6 and 1.2 sold separately") contradicted
              // the verified rows — G4 Mini box = one 0.6Ω, G4 box = 0.4Ω + 0.9Ω (international version, owner 26/10) (uwell.ts "included-pod" / pod-compat rows).
              "หัว GPP ที่มาในกล่องของ G4 กับ G4 Mini ต่างกัน G4 Mini มาพร้อมหัว 0.6 โอห์มหนึ่งหัว ส่วน G4 มาพร้อมหัว 0.4 โอห์มกับ 0.9 โอห์ม เรื่องดูแลหัวพอตอยู่ที่ [วิธีดูแลคอยล์และหัวพอต](/guides/coil-and-pod-maintenance)",
            ],
          },
        ],
      },
      {
        heading: "Caliburn G5 vs G4",
        paragraphs: [
          "G5 แบต 1600mAh มากกว่า G4 ที่ 1300mAh ทั้งคู่มีจอสี G5 จอ 0.85 นิ้ว สลับโหมดด้วยการแตะ ไม่มีปุ่ม ส่วน G4 มีปุ่มยิง เลือกโหมดวัตต์บนจอ",
          "วัตต์ของ G5 อยู่ที่ 5–35 วัตต์ ส่วน G4 อยู่ที่ 35 วัตต์ น้ำหนักตามคู่มือ G5 65 กรัม ส่วน G4 54.7 กรัม หัวพอตเป็น GPP ทั้งคู่ ใช้หัวเดียวกันได้",
          "ชอบแตะสลับโหมดและอยากได้แบตมากกว่า ดู G5 ชอบเครื่องที่มีปุ่มและเบากว่า ดู G4",
        ],
      },
      {
        heading: "Caliburn G5 vs G5 Lite",
        paragraphs: [
          "แบต 1600mAh กับวัตต์สูงสุด 35 วัตต์เท่ากัน ใช้หัวพอต GPP เหมือนกัน ที่ต่างคือ G5 มีจอสี 0.85 นิ้วกับระบบ Smart Triple-Tap Control ส่วน Lite ตัดสองอย่างนี้ออก ใช้ไฟ LED บอกระดับแบตแทน",
          "[Caliburn G5 Lite SE](/products/caliburn-g5-lite-se) แบตกับวัตต์เท่า Lite และชุดสีทั้ง 8 สีเป็นหนัง",
          "อยากได้จอสีกับการแตะสลับโหมด ดู G5 ไม่ต้องการจอสีแต่อยากได้แบตเท่ากัน ดู G5 Lite ถ้าชอบชุดสีหนัง ดู G5 Lite SE",
        ],
      },
      {
        heading: "Caliburn G4 vs G4 Pro",
        paragraphs: [
          "G4 Pro แบต 1800mAh มากกว่า G4 ที่ 1300mAh จอทัช 2.51 นิ้ว ปรับช่องลมได้แบบไม่มีขั้น และใช้หัวพอตได้ทั้ง GPP กับหัวพอต G3 ส่วน G4 ใช้ GPP",
          "ที่ต้องแลกคือน้ำหนัก ตามคู่มือของ UWELL G4 Pro หนัก 78 กรัม G4 หนัก 54.7 กรัม ส่วนวัตต์สูงสุด 35 วัตต์กับหัวพอต 3mL เท่ากันทั้งคู่",
          "อยากได้จอใหญ่ ปรับช่องลมละเอียด และใช้หัวพอตได้สองแบบ ดู G4 Pro อยากได้เครื่องที่เบากว่า ดู G4",
        ],
        video: SECTION_CLIPS.caliburnG4Pro,
      },
      {
        // Round "SEO all keys" 16/10 (SEO_LANDSCAPE §9.4 "เทียบ Caliburn"): verified rows of caliburn-g4 / caliburn-g4-mini in uwell.ts only.
        heading: "Caliburn G4 vs G4 Mini",
        paragraphs: [
          "Caliburn G4 กับ G4 Mini ต่างกันยังไง ตอบสั้น ๆ คือ G4 มีจอสี 0.85 นิ้วและแบต 1300mAh ส่วน [Caliburn G4 Mini](/products/caliburn-g4-mini) ไม่มีจอ แบต 1100mAh และเบากว่า ตามสเปกของ UWELL ตัว G4 หนักราว 54.7 กรัม ส่วน G4 Mini หนักราว 46 กรัม",
          "ที่เหมือนกันคือวัตต์สูงสุด 35 วัตต์ ใช้หัวพอต GPP มีปุ่มเลื่อนปรับลมคู่กับการกลับด้านหัวพอต และเติมน้ำยาได้โดยไม่ต้องถอดหัวพอตออก",
          "วิธีสูบต่างกัน G4 สูบได้ทั้งแบบดูดและกดปุ่ม ส่วน G4 Mini เป็นระบบออโต้ สูบด้วยการดูด หัวพอตที่มาในกล่องก็ต่างกันด้วย G4 Mini มาพร้อมหัว 0.6 โอห์มหนึ่งหัว ส่วน G4 มาพร้อมหัว 0.4 โอห์มกับ 0.9 โอห์ม",
          "อยากเห็นโหมดบนจอ ดู G4 อยากได้เครื่องที่เบากว่าและไม่ต้องมีจอ ดู G4 Mini",
        ],
      },
      {
        heading: "Caliburn G4 vs G3 Pro",
        paragraphs: [
          "G4 แบต 1300mAh มากกว่า G3 Pro ที่ 1000mAh ทั้งคู่มีจอ G4 เป็นจอสี ส่วน G3 Pro เป็นจอ LCD โอบด้านข้าง ปรับได้ 5–35 วัตต์ และปรับช่องลมได้เต็มช่วง ทั้งคู่ชาร์จผ่าน USB-C ที่ 2A",
          "ต่างกันชัดที่หัวพอต G4 ใช้ GPP มาในกล่อง 2 หัว 0.4 โอห์มกับ 0.9 โอห์ม ส่วน G3 Pro ใช้หัวพอต G3 มาในกล่อง 2 หัว 0.4 โอห์ม (3mL) กับ 0.9 โอห์ม (2.5mL) จะซื้อหัวพอตเพิ่ม ดูให้ตรงกับระบบของเครื่อง",
          "อยากได้แบตมากกว่า ดู G4 อยากปรับวัตต์และช่องลมเองได้เต็มช่วง ดู G3 Pro ค่าโอห์มกับช่องลมส่งผลกับแนวการสูบยังไง อ่าน [MTL กับ DTL](/guides/understanding-mtl-vs-dtl) หรือดู Caliburn ทั้งหมดที่ [UWELL](/brands/uwell)",
          "ส่วน [Caliburn G3](/products/caliburn-g3) เป็นคนละรุ่นกับ G3 Pro แบต 900mAh ตั้งได้สูงสุด 25 วัตต์ มีจอ OLED บอกวัตต์และจำนวนพัฟ และใช้หัวพอตของ Caliburn G3 ที่มีคอยล์ในตัว 0.6 · 0.9 · 1.2 โอห์ม",
        ],
      },
    ],
    relatedProductSlugs: ["caliburn-g5", "caliburn-g4", "caliburn-g4-pro"],
    faq: [
      { question: "หัวพอต Caliburn G4 ใส่ G5 ได้ไหม", answer: "ได้ ทั้งสองรุ่นใช้หัวพอต GPP ของ UWELL ระบบเดียวกัน" },
      { question: "Caliburn G5 กับ G5 Lite แบตเท่ากันไหม", answer: "เท่ากัน 1600mAh วัตต์สูงสุด 35 วัตต์เท่ากัน ต่างกันที่จอสีกับระบบแตะสลับโหมดของ G5" },
      { question: "Caliburn G4 Pro ใช้หัว G3 ได้ไหม", answer: "ได้ สเปกที่ยืนยันแล้วระบุว่า G4 Pro ใช้ได้ทั้งหัวพอต GPP และหัวพอต G3" },
      { question: "Caliburn G4 กับ G4 Mini ต่างกันยังไง", answer: "G4 มีจอสี 0.85 นิ้ว แบต 1300mAh และสูบได้ทั้งแบบดูดและกดปุ่ม ส่วน G4 Mini ไม่มีจอ แบต 1100mAh เป็นระบบออโต้ สูบด้วยการดูด และเบากว่า ทั้งสองรุ่นมีวัตต์สูงสุด 35 วัตต์เท่ากัน และใช้หัวพอต GPP เหมือนกัน" },
      { question: "Caliburn รุ่นไหนไม่มีจอ", answer: "ในรุ่นที่เทียบในบทความนี้ G4 Mini · G4 Classic · G5 Lite และ G5 Lite SE ไม่มีจอ ใช้ไฟ LED บอกสถานะหรือระดับแบต" },
    ],
  },
  {
    // Round 10B T07' — writer draft 2 + thai-copy pass (2026-09-24), source map _incoming/round10b/writer-2-result.md. Held
    // under owner ruling D3, released 2026-10-02 (owner). Pair = the only cross-brand model pair with
    // autocomplete evidence ("argus g4 vs caliburn g5", researcher-B-result.md), the one Cowork proposed.
    id: "argus-g4-vs-caliburn-g5",
    slug: "argus-g4-vs-caliburn-g5",
    title: "ARGUS G4 vs Caliburn G5 ต่างกันยังไง",
    dek: "ไม่มีคำตอบที่แน่นอนว่าตัวไหนดีกว่า แบตใกล้กัน วัตต์กับขนาดจอเท่ากัน ที่ต่างชัดคือระบบหัวพอต และ G5 สลับโหมดด้วยการแตะ",
    category: "buying-guide",
    readingTimeMin: 5,
    publishedAt: "2026-10-02",
    thaiOnly: true,
    body: [
      {
        heading: "ตัวไหนดีกว่า: ไม่มีคำตอบที่แน่นอน",
        paragraphs: [
          "ARGUS G4 กับ Caliburn G5 ตัวไหนดีกว่า ไม่มีคำตอบที่แน่นอน ตัวเลขหลักใกล้กันมาก แบต 1650mAh กับ 1600mAh ปรับได้ 5–35 วัตต์เท่ากัน จอ 0.85 นิ้วเท่ากัน ที่ต่างชัดคือระบบหัวพอต และ G5 สลับโหมดด้วยการแตะ",
          "เลยขอเทียบทีละเรื่องแทนการตัดสิน ตัวเลขทั้งหมดมาจากตารางสเปกที่ยืนยันแล้วบนหน้า [ARGUS G4](/products/argus-g4) กับ [Caliburn G5](/products/caliburn-g5) ส่วนที่มาจากคู่มือของ UWELL บอกไว้ตรงนั้น",
        ],
      },
      {
        heading: "จอกับการควบคุม",
        paragraphs: [
          "ARGUS G4 ใช้จอ HD 0.85 นิ้ว โชว์แบต วัตต์ ค่าโอห์ม สถานะล็อก และจำนวนพัฟ ส่วน G5 เป็นจอสี 0.85 นิ้ว",
          "G5 สลับโหมดด้วยระบบ Smart Triple-Tap Control คือแตะตัวเครื่องสามครั้ง ตามคู่มือของ UWELL ไม่มีปุ่ม ส่วน ARGUS G4 มีปุ่มเดียว กดสองครั้งติดกันเพื่อเปลี่ยนค่าโอห์ม กดสามครั้งเพื่อปรับวัตต์ และกดห้าครั้งเพื่อเข้าเมนู",
        ],
        image: SECTION_IMAGES.caliburnG5TripleTap,
      },
      {
        heading: "ระบบหัวพอตและแนวการสูบ",
        paragraphs: [
          "ARGUS G4 ใช้ระบบหัวพอต ARGUS เติมด้านบน มีหลายค่าโอห์ม ตัวเครื่องรับช่วงโอห์ม 0.4–3.0 โอห์ม ส่วน G5 ใช้หัวพอต GPP ของ UWELL ความจุ 3mL เติมด้านบน",
          "หัว GPP มี 0.4 · 0.6 · 0.9 · 1.2 โอห์ม ช่วงที่ ARGUS G4 รับได้กว้างกว่า แต่ช่วงกว้างไม่ได้แปลว่ามีหัวพอตทุกค่าให้ซื้อ อ่านเรื่องนี้ที่ [วิธีอ่านสเปกพอต](/guides/reading-a-spec-sheet) ด้านความจุ หัวพอต ARGUS Multi-Ohm ที่มากับ ARGUS G4 จุ 3.5mL ส่วนหัว GPP ของ G5 จุ 3mL",
          "ค่าโอห์มของหัวพอตที่ใส่มีผลกับแนวการสูบ ถ้ายังไม่แน่ใจว่าตัวเองสูบแนวไหน อ่าน [MTL กับ DTL](/guides/understanding-mtl-vs-dtl) ก่อน",
        ],
        video: SECTION_CLIPS.argusG4,
      },
      {
        heading: "แบตกับการชาร์จ",
        paragraphs: [
          "แบต ARGUS G4 1650mAh ส่วน G5 1600mAh ต่างกัน 50mAh ทั้งคู่ชาร์จผ่าน USB-C โดย ARGUS G4 สเปกระบุ 5V/2A ชาร์จเต็มในราว 45 นาที",
          "ชาร์จหนึ่งครั้งใช้ได้นานแค่ไหน ขึ้นกับวัตต์ที่ตั้งและสูบถี่แค่ไหน",
        ],
        image: SECTION_IMAGES.caliburnG5Battery,
      },
      {
        heading: "เหมาะกับใคร",
        paragraphs: [
          "อยากเห็นวัตต์ ค่าโอห์ม และจำนวนพัฟบนจอ และอยากได้ตัวเครื่องที่รับช่วงโอห์มกว้าง ดู ARGUS G4",
          "อยากสลับโหมดด้วยการแตะแทนการกดปุ่ม และอยากใช้หัวพอต GPP ที่ใช้ร่วมกับ Caliburn รุ่นปัจจุบันหลายรุ่น ดู Caliburn G5 ถ้าจะเทียบ G5 กับ Caliburn รุ่นอื่นต่อ อ่าน [เทียบ Caliburn ทีละคู่](/guides/comparing-caliburn-models) หรือดูทั้งแบรนด์ที่ [VOOPOO](/brands/voopoo) กับ [UWELL](/brands/uwell)",
        ],
      },
    ],
    relatedProductSlugs: ["argus-g4", "caliburn-g5"],
    faq: [
      { question: "ARGUS G4 กับ Caliburn G5 แบตต่างกันเยอะไหม", answer: "ต่างกัน 50mAh คือ ARGUS G4 1650mAh ส่วน Caliburn G5 1600mAh ปรับได้ 5–35 วัตต์เท่ากัน" },
      { question: "หัวพอต Caliburn ใส่ ARGUS G4 ได้ไหม", answer: "สองรุ่นนี้ใช้คนละระบบหัวพอต ARGUS G4 ใช้ระบบหัวพอต ARGUS ส่วน Caliburn G5 ใช้ GPP ของ UWELL จะซื้อหัวพอตเพิ่ม ดูให้ตรงกับระบบของเครื่อง" },
      { question: "VOOPOO กับ Caliburn ต่างกันยังไง", answer: "VOOPOO เป็นแบรนด์ ส่วน Caliburn เป็นตระกูลของ UWELL ถ้าเทียบรุ่นต่อรุ่น ARGUS G4 กับ Caliburn G5 แบตกับวัตต์ใกล้กัน ต่างกันที่ระบบหัวพอต และ G5 สลับโหมดด้วยการแตะ" },
    ],
  },
  {
    // Round "site unreachable" (owner 11/10): a help page, not an article — its body is DnsGuideContent (copy in
    // src/i18n/dns-guide-copy.tsx), so `body` stays empty and the route swaps ArticleBody for it. Last in the array on
    // purpose: the home teaser shows guides.slice(0, 3). No related products and no body links, so it never joins an
    // "อ่านต่อ" box (article-relevance.ts). th/zh title + dek in guides-copy.ts.
    id: DNS_GUIDE_ID,
    slug: DNS_GUIDE_ID,
    title: "Can't open the site? Change your phone's DNS, step by step",
    dek: "One setting on your device works for every site, not just ours. There's a way for iPhone, Android and computers.",
    category: "getting-started",
    readingTimeMin: 5,
    publishedAt: "2026-10-11",
    body: [],
  },
  // Round SEO ฉ batch 6b: placed last on purpose — authored "read next" links follow this array's order, and an earlier
  // slot pushed older articles (e.g. how-long-a-disposable-lasts on m-bar-9k) off product pages.
  {
    // Round SEO ฉ batch 6b "green" set 2, topic 8 (owner 12/10): thai-copy draft 12/10 from the shop's clips (descriptions only —
    // _incoming/seo-f/b6/clips-6b.tsv); facts _incoming/seo-f/b6/research-6b.md. Free-base vs protonated nicotine = Duell/Pankow/
    // Peyton, Chem Res Toxicol 2018 (PMC6008736) · "smoother, less harsh at matched strength" = Leventhal et al., JAMA Netw Open
    // 2021 (sensory results only) · salt ↔ low-power MTL pods, freebase ↔ higher-power sub-ohm = Aspire · RELX UK · Lost Vape ·
    // PG/VG feel + Aspire's coil chart (1.5–2.5Ω 70% PG · 0.5–1.4Ω 50/50 · 0.1–0.4Ω 80% VG) = Aspire 2023 · high PG floods a
    // sub-ohm coil = GeekVape FAQ · product rows = the site's own verified spec rows (relxnow · salthub · VOOPOO ARGUS G4 mini ·
    // MOOOD · WOTOFO). No mg ↔ % conversion anywhere: no maker on the site publishes one. Clip 1uuJrjCzFBE (NEXAS BOOSTER 16K,
    // not sold here) left out. "น้ำยา" is in the dek → head-only meta row in GUIDE_DESCRIPTION_HEAD_TH.
    id: "salt-nic-vs-freebase",
    slug: "salt-nic-vs-freebase",
    title: "นิโคติน salt nic กับ freebase ต่างกันยังไง เหมาะกับใคร",
    dek: "salt nic กับ freebase คือนิโคตินสองชนิด บทความนี้เล่าว่าทั้งคู่ต่างกันยังไง เข้ากับเครื่องแบบใด และตัวเลขอย่าง 3% 5% หรือ 30mg บอกอะไร",
    category: "how-it-works",
    readingTimeMin: 7,
    publishedAt: "2026-10-12",
    thaiOnly: true,
    body: [
      {
        heading: "salt nic กับ freebase คืออะไร",
        paragraphs: [
          "salt nic กับ freebase ต่างกันยังไง ตอบสั้น ๆ คือเป็นนิโคตินคนละแบบ ไม่ใช่ยี่ห้อ และไม่ใช่กลิ่น น้ำยาแต่ละขวดหรือพอตใช้แล้วทิ้งแต่ละรุ่นจะใช้แบบเดียว ซึ่งดูได้จากข้างกล่องหรือสเปกของรุ่นนั้น",
          "freebase คือนิโคตินในรูปเดิม ส่วน salt nic คือนิโคตินที่ผู้ผลิตผสมกรดลงไป กรดทำให้นิโคตินเปลี่ยนไปอยู่อีกรูปหนึ่ง ซึ่งงานวิจัยด้านเคมีวัดแยกได้ชัดว่าต่างจากรูป freebase ความต่างตรงนี้คือเหตุผลที่สูบแล้วรู้สึกไม่เหมือนกัน",
        ],
      },
      {
        heading: "สูบแล้วรู้สึกต่างกันยังไง",
        paragraphs: [
          "ความต่างที่รู้สึกได้ชัดคือความนุ่ม งานวิจัยที่ตีพิมพ์ใน JAMA Network Open เมื่อปี 2021 ได้ทดลองให้คนสูบเทียบกัน แล้วพบว่าที่ความเข้มข้นเท่ากัน salt nic นุ่มกว่าและบาดคอน้อยกว่า freebase",
          "ถึงอย่างนั้น freebase ก็ยังมีคนเลือกอยู่ จากที่ร้านเห็น คนที่เลือก freebase มักชอบความรู้สึกตอนสูบ รสชาติที่ชัด และควันที่ได้จากเครื่องวัตต์สูง ซึ่งเป็นการสูบอีกแนวหนึ่ง ไม่ได้แปลว่าแบบไหนดีกว่ากัน แค่เหมาะกับคนละแนว",
        ],
      },
      {
        heading: "salt nic เข้ากับพอตตัวเล็ก freebase เข้ากับเครื่องวัตต์สูง",
        paragraphs: [
          "แบบไหนเหมาะกับใคร ดูจากเครื่องที่ใช้ก่อนเลย ผู้ผลิตอย่าง Aspire RELX และ Lost Vape แนะนำไปทางเดียวกัน คือ salt nic เข้ากับพอตตัวเล็กที่ใช้วัตต์ต่ำและสูบแน่นแบบ MTL ส่วน freebase เข้ากับเครื่องวัตต์สูงที่ใช้คอยล์โอห์มต่ำ",
          "จากที่ร้านเห็น พอตที่ขายกันทุกวันนี้ส่วนใหญ่ใช้ salt nic อย่าง [M Bar 9K](/products/m-bar-9k) ที่ SALTHUB ระบุว่าเป็น salt nic 30mg และ [RELX Smash Go 12K](/products/relx-smash-go-12k) ที่ RELX ระบุว่าเป็น salt nic มีให้เลือก 3% หรือ 5%",
          "บางเครื่องก็ทำมาให้ใช้ได้ทั้งสองแบบ [ARGUS G4 mini](/products/argus-g4-mini) ใช้หัวพอตที่กลับด้านเพื่อเปลี่ยนโอห์มได้ VOOPOO ระบุว่าด้าน 1.0 โอห์มสูบแบบ MTL ที่แน่น เหมาะกับ salt nic ส่วนด้าน 0.7 โอห์มสูบได้ตั้งแต่ MTL แบบลมโล่งไปจนถึง RDL และเหมาะกับ freebase มากกว่า",
          "ถ้าใช้พอตซิสเต็มที่เติมน้ำยาเอง ให้เลือกแบบที่เข้ากับเครื่องก่อน แล้วค่อยเลือกกลิ่นที่ชอบ กลุ่มรสแต่ละแบบดูได้ที่ [กลุ่มรสชาติของน้ำยาบุหรี่ไฟฟ้า](/e-liquid) ส่วนน้ำยาแบบขวดทั้ง salt nic และ freebase ดูได้ที่หน้า [น้ำยา](/products/e-liquid) ถ้าอยากรู้ว่าเครื่องที่ใช้อยู่เข้ากับแบบไหน ทักไลน์ @okm24 ถามร้านได้",
        ],
        image: SECTION_IMAGES.vmateI3Family,
      },
      {
        heading: "3% กับ 5% และ 30mg บอกอะไร",
        paragraphs: [
          "ตัวเลขอย่าง 3% 5% หรือ 30mg คือความเข้มข้นของนิโคติน ตัวเลขยิ่งสูง นิโคตินยิ่งเข้ม แต่ละแบรนด์เลือกบอกด้วยหน่วยไม่เหมือนกัน อย่าง [MOOOD Monster 14K](/products/mood-monster-14k) กับ RELX Smash Go 12K บอกเป็น % ขณะที่ [WOTOFO nexBAR 18K](/products/wotofo-nexbar-18k) กับ M Bar 9K บอกเป็น mg ซึ่ง WOTOFO มีให้เลือกทั้ง 20mg และ 50mg",
          "บนเว็บเรา เราเทียบในหน่วยเดียวกันเท่านั้น % เทียบกับ % และ mg เทียบกับ mg เพราะผู้ผลิตรุ่นที่อยู่บนเว็บเรายังไม่ได้บอกไว้ว่าสองหน่วยนี้แปลงกันยังไง เราจึงไม่แปลงให้เอง ก็คล้ายเทียบราคาที่เป็นบาทกับเป็นเยน ต้องรู้อัตราแลกก่อนถึงจะเทียบกันได้",
          "3% กับ 5% เลือกแบบไหน แล้วแต่ความชอบของแต่ละคน รุ่นอย่าง RELX Smash Go 12K มีให้เลือกทั้งสองความเข้มข้นในรุ่นเดียว ยังไม่แน่ใจว่าตัวเองชอบแบบไหน ทักไลน์ @okm24 ถามร้านได้",
        ],
      },
      {
        heading: "PG กับ VG ข้างขวดน้ำยา",
        paragraphs: [
          "นอกจากชนิดนิโคติน ข้างขวดน้ำยามักบอกสัดส่วน PG กับ VG ไว้ด้วย Aspire อธิบายว่า PG พารสได้ชัดและให้ความรู้สึกแรงถึงคอ ส่วน VG ให้ควันหนาและนุ่มกว่า",
          "สัดส่วนนี้ควรเลือกให้เข้ากับคอยล์ของเครื่อง และตัวเลขอย่าง 70/30 แต่ละแบรนด์ก็เรียงลำดับต่างกัน วิธีอ่านและวิธีเลือกอ่านต่อได้ที่ [PG VG คืออะไร อ่านสัดส่วนข้างขวดยังไง](/guides/pg-vg-in-e-liquid) ถ้าใช้พอตใช้แล้วทิ้งหรือหัวพอตบรรจุสำเร็จ น้ำยามาในเครื่องแล้วจึงไม่ต้องเลือกเอง และเรื่องโอห์มกับวัตต์ของคอยล์ ดูได้ใน [ตั้งกี่วัตต์ดี](/guides/choosing-wattage-and-airflow)",
        ],
      },
    ],
    relatedProductSlugs: ["relx-smash-go-12k", "m-bar-9k", "argus-g4-mini"],
    faq: [
      {
        question: "salt nic กับ freebase ต่างกันยังไง",
        answer: "เป็นนิโคตินคนละแบบ salt nic คือนิโคตินที่ผู้ผลิตผสมกรดลงไป ส่วน freebase คือนิโคตินในรูปเดิม งานวิจัยพบว่าที่ความเข้มข้นเท่ากัน salt nic ให้ความรู้สึกนุ่มกว่า และผู้ผลิตมักแนะนำ salt nic กับพอตตัวเล็กวัตต์ต่ำ ส่วน freebase กับเครื่องวัตต์สูง",
      },
      {
        question: "freebase ใช้กับพอตตัวเล็กได้ไหม",
        answer: "ผู้ผลิตอย่าง Aspire RELX และ Lost Vape แนะนำ freebase กับเครื่องวัตต์สูงที่ใช้คอยล์โอห์มต่ำ ส่วนพอตตัวเล็กที่สูบแน่นแบบ MTL ผู้ผลิตแนะนำ salt nic บางเครื่องอย่าง ARGUS G4 mini ทำมาให้ใช้ได้ทั้งสองแบบ ดูคำแนะนำของเครื่องที่ใช้อยู่เป็นหลัก",
      },
      {
        question: "นิโคติน 3% กับ 5% ต่างกันยังไง",
        answer: "ต่างกันที่ความเข้มข้น 5% เข้มกว่า 3% รุ่นอย่าง RELX Smash Go 12K มีให้เลือกทั้งสองแบบ เลือกแบบไหนแล้วแต่ความชอบ ถ้ายังไม่แน่ใจ ทักไลน์ @okm24 ถามร้านได้",
      },
      {
        question: "30mg เท่ากับกี่ %",
        answer: "ผู้ผลิตรุ่นที่อยู่บนเว็บเรายังไม่ได้บอกวิธีแปลงระหว่าง mg กับ % ไว้ เราจึงไม่แปลงให้เอง และเทียบความเข้มข้นในหน่วยเดียวกันเท่านั้น ตัวเลขยิ่งสูง นิโคตินยิ่งเข้ม",
      },
      {
        question: "พอตใช้แล้วทิ้งเป็น salt nic ไหม",
        answer: "หลายรุ่นเป็น salt nic เช่น M Bar 9K และ RELX Smash Go 12K แต่บางรุ่นบอกแค่ตัวเลขความเข้มข้น ดูที่สเปกของรุ่นนั้นเป็นหลัก",
      },
    ],
    // The shop's own explainer on exactly this topic (@OKMYARZ); title + upload date as read for the keyword map (SEO_LANDSCAPE §8 row 8).
    reviewVideo: { videoId: "mY4M61mKQjc", title: "Salt Nic กับ Freebase ต่างกันยังไง? แบบไหนเหมาะกับใคร", channelName: "OKM YARZ", publishedAt: "2026-09-08" },
  },
  {
    // Round SEO ฉ batch 6c topic 10 (owner 12/10: airline rules only — no country's law; the reader checks the destination
    // and transit countries). Facts: IATA "Passengers Travelling with Lithium Batteries" guidance rev. 2026 (31/03/2026) ·
    // Vietnam Airlines restricted-baggage page — named in the text. Owner 13/10 (chat): no Thai agency is named on the page,
    // so the rules only Thai sources state (no smoking on board · modified packs · liquids at Thai airports) read as plain
    // rules; their sources are the CAAT dangerous-goods list and the AOT liquids page — all opened 13/10 (_incoming/seo-f/b6c/research.md).
    // The leak paragraphs are the shop's own experience from its clip. No relatedProductSlugs: a flight article has no
    // place in a product page's "read next" box; it links the keyword's owner page (/products/disposables) inline.
    id: "taking-a-pod-on-a-plane",
    slug: "taking-a-pod-on-a-plane",
    title: "พอตขึ้นเครื่องบินได้ไหม ต้องใส่กระเป๋าถือ หรือโหลดใต้เครื่องได้",
    dek: "โดยทั่วไปพอตขึ้นเครื่องบินได้ แต่ต้องใส่กระเป๋าถือหรือพกติดตัวเท่านั้น บทความนี้รวมกติกาการบิน วิธีจัดกระเป๋า และเรื่องที่ร้านอยากให้เช็คก่อนเดินทาง",
    category: "getting-started",
    readingTimeMin: 6,
    publishedAt: "2026-10-13",
    thaiOnly: true,
    body: [
      {
        heading: "พอตขึ้นเครื่องบินได้ไหม",
        paragraphs: [
          "พอตขึ้นเครื่องบินได้ไหม ตอบสั้น ๆ คือโดยทั่วไปขึ้นได้ แต่ต้องอยู่ในกระเป๋าถือหรือพกติดตัวขึ้นไปเท่านั้น โหลดใต้เครื่องไม่ได้ และเมื่อขึ้นไปอยู่บนเครื่องแล้ว จะสูบหรือชาร์จก็ไม่ได้เช่นกัน ทั้งพอตซิสเต็มและ[พอตใช้แล้วทิ้ง](/products/disposables) ใช้กติกาเดียวกันนี้ เพราะมีแบตอยู่ในตัวเครื่องเหมือนกัน",
          "คำตอบนี้มาจากคู่มือแบตลิเธียมสำหรับผู้โดยสาร ฉบับปี 2026 ของ IATA หรือสมาคมขนส่งทางอากาศระหว่างประเทศ ซึ่งอิงตามข้อกำหนดสินค้าอันตรายทางอากาศของ ICAO และ IATA หัวข้อถัดไปเล่าแยกเป็นเรื่อง ๆ ทั้งตัวเครื่อง ถ่านสำรอง พาวเวอร์แบงก์ และน้ำยาขวด",
          "แต่คำว่า “ได้” ตรงนี้คือหลักทั่วไปเท่านั้น เพราะบางสายการบินกำหนดเข้มกว่านั้น ส่วนกฎของประเทศที่จะไปและประเทศที่ต้องแวะเปลี่ยนเครื่อง ก็ควรเช็คเองก่อนบินทุกครั้ง เรื่องนี้อยู่ในสองหัวข้อสุดท้าย",
        ],
      },
      {
        heading: "พอตต้องอยู่ในกระเป๋าถือ โหลดใต้เครื่องไม่ได้",
        paragraphs: [
          "ตาม[คู่มือของ IATA](https://www.iata.org/contentassets/6fea26dd84d24b26a7a1fd5788561d6e/passengers_travelling_with_lithium_batteries.pdf) บุหรี่ไฟฟ้าและพอตที่มีแบตในตัว ต้องอยู่ในกระเป๋าถือเท่านั้น ห้ามใส่กระเป๋าโหลด และไม่ต้องขออนุญาตสายการบินก่อน พูดง่าย ๆ คือพอตต้องนั่งไปกับเราในห้องโดยสารตลอดทาง",
          "จังหวะที่ควรระวังคือตอนที่กระเป๋าถือถูกขอให้ไปโหลดใต้เครื่องแทน ซึ่งเกิดได้ทั้งที่หน้าประตูขึ้นเครื่องและที่ลานจอดข้างเครื่องบิน IATA แนะนำให้หยิบอุปกรณ์และแบตลิเธียมทุกชิ้นออกมาก่อน แล้วถือติดตัวขึ้นไปในห้องโดยสาร",
          "อีกข้อที่ควรรู้ คือแบตแพ็กที่ดัดแปลงหรือประกอบเอง นำขึ้นเครื่องบินไม่ได้เลย",
        ],
      },
      {
        heading: "บนเครื่องห้ามสูบ และห้ามชาร์จ",
        paragraphs: [
          "ถึงพอตจะขึ้นเครื่องไปพร้อมเราได้ แต่ตลอดเที่ยวบินต้องเก็บไว้เฉย ๆ บนเครื่องห้ามสูบ และ IATA ก็ไม่ให้ชาร์จทั้งตัวเครื่องและแบตระหว่างบิน",
          "IATA ยังแนะนำให้เก็บเครื่องแบบที่ไม่ถูกกระแทกจนเสียหาย และไม่ถูกเปิดขึ้นมาเองโดยไม่ตั้งใจ ถ้าเครื่องที่ใช้ล็อกได้ ร้านแนะนำให้ล็อกไว้ก่อนออกจากบ้าน",
          "อีกเรื่องที่ร้านแนะนำเสมอ คือเช็คแบตก่อนเดินทาง ถ้าตัวเครื่องบวม หรือมีอาการแปลกไปจากปกติ อย่าเอาขึ้นเครื่องไปด้วย และถ้าระหว่างทางเครื่องร้อนผิดปกติ มีควันออกมาเองทั้งที่ไม่ได้สูบ หรือเสียหาย IATA แนะนำให้แจ้งพนักงานต้อนรับบนเครื่องทันที ถ้ายังอยู่ที่สนามบินก็แจ้งเจ้าหน้าที่สนามบินได้เลย",
        ],
      },
      {
        heading: "ถ่านสำรองและพาวเวอร์แบงก์ จัดกระเป๋ายังไง",
        paragraphs: [
          "ใครใช้เครื่องที่ใส่ถ่าน แล้วพกถ่านสำรองไปด้วย ถ่านพวกนี้ก็ต้องอยู่ในกระเป๋าถือเหมือนตัวเครื่อง และ IATA ให้กันขั้วไม่ให้ลัดวงจรทีละก้อน จะเก็บในบรรจุภัณฑ์เดิม แปะเทปปิดขั้ว หรือแยกใส่ถุงพลาสติกหรือซองก้อนละใบก็ได้",
          "ใครพกพาวเวอร์แบงก์ไว้ชาร์จพอตระหว่างเที่ยว เรื่องนี้กติกาเข้มขึ้นกว่าเดิม IATA ระบุว่าเป็นข้อจำกัดใหม่ที่สายการบินเริ่มนำมาใช้ล่วงหน้า คือแต่ละคนพกได้สูงสุดสองก้อน ก้อนละไม่เกิน 100Wh ต้องอยู่ในกระเป๋าถือ และห้ามชาร์จพาวเวอร์แบงก์จากไฟของเครื่องบิน และไม่ควรเก็บไว้ในช่องเก็บของเหนือศีรษะ",
          "ตัวเลข Wh คิดจากความจุที่เป็น Ah คูณแรงดันไฟที่เป็น V และแบตลิเธียมไอออนต้องมีค่า Wh พิมพ์ไว้ด้านนอก ถ้าเจ้าหน้าที่ยืนยันค่า Wh ไม่ได้ สายการบินอาจไม่รับแบตหรือเครื่องนั้นขึ้นเครื่อง ก่อนจัดกระเป๋าจึงควรพลิกดูว่าตัวเลขบนพาวเวอร์แบงก์ยังอ่านออกชัด",
        ],
      },
      {
        heading: "น้ำยาขวด นับเป็นของเหลวทั่วไป",
        paragraphs: [
          "ใครใช้พอตซิสเต็มแบบเติมน้ำยาเอง แล้วอยากพกน้ำยาขวดใส่กระเป๋าถือไปด้วย ให้ดูกติกาของเหลวทั่วไปของสนามบิน สนามบินในไทยกำหนดว่าของเหลวในกระเป๋าถือต้องอยู่ในภาชนะขนาดไม่เกิน 100mL ที่ระบุความจุไว้ และรวมกันแล้วไม่เกิน 1,000mL หรือ 1 ลิตรต่อผู้โดยสารหนึ่งคน",
          "กติกานี้ใช้กับของเหลวทุกชนิด ไม่ได้เขียนไว้สำหรับน้ำยาโดยเฉพาะ ขวดน้ำยาจึงนับรวมกับของเหลวอื่นทั้งหมดที่ถือขึ้นเครื่อง ร้านแนะนำให้ปิดฝาให้แน่น แล้วใส่ถุงซิปล็อกแยกไว้อีกชั้น แบบเดียวกับพอตในหัวข้อถัดไป",
        ],
      },
      {
        heading: "กันน้ำยารั่วระหว่างบิน",
        paragraphs: [
          "จากที่ร้านเจอ ตอนอยู่บนเครื่อง ทั้งความกดอากาศและอุณหภูมิจะเปลี่ยนไปจากตอนอยู่บนพื้น น้ำยาในหัวพอตจึงซึมออกมาได้ ครั้งหนึ่งทีมเราเจอน้ำยาหายเกือบครึ่งถัง ไปอยู่ในกระเป๋าแทนที่จะอยู่ในเครื่อง",
          "ร้านเราจึงแนะนำให้ใส่พอตไว้ในถุงซิปล็อก หรือห่อด้วยทิชชู่ให้แน่นก่อนเก็บลงกระเป๋า ถ้าจะซึมก็ซึมอยู่ในถุงหรือในทิชชู่ ไม่เลอะของอื่นในกระเป๋า",
          "เก็บถุงนี้ไว้ในช่องที่หยิบออกมาได้ง่าย เพราะเจ้าหน้าที่อาจขอดูตอนตรวจกระเป๋า ถ้าลงเครื่องแล้วเจอน้ำยาเยิ้ม เช็ดให้แห้งและเช็คเครื่องตามขั้นใน[หัวพอตรั่ว แก้ยังไง](/guides/fixing-a-leaking-pod) ก่อนสูบต่อ",
        ],
        image: SECTION_IMAGES.caliburnG4AntiLeak,
      },
      {
        // Keyword line 23/10: the owner ticked "เอาพอตไปญี่ปุ่น เกาหลี หรือต่างประเทศได้ไหม" on the questions page (Pantip asks it again and
        // again), which lifts the 12/10 "airline rules only" line for these four places. Official pages only, opened 23/10:
        // MHLW Q&A 30/06/2025 (PDF, Q67 read in full by Friday's line) · Korea Customs Service traveller page · ICA (updated 14/04/2026) +
        // HSA 01/08/2024 · info.gov.hk press release 29/04/2026. Traveller facts only — nothing about Thai law (TEAM_RULES legal-status line).
        heading: "เอาพอตไปญี่ปุ่น เกาหลี สิงคโปร์ หรือฮ่องกงได้ไหม",
        paragraphs: [
          "กติกาข้างบนเป็นเรื่องของสายการบิน ส่วนปลายทางแต่ละแห่งมีกฎของตัวเอง และต่างกันมาก ข้างล่างนี้คือสิ่งที่หน่วยงานของสี่ปลายทางนี้เขียนไว้ในหน้าเว็บและเอกสารทางการ",
          "ญี่ปุ่น เอกสารถามตอบเรื่องการนำเข้าของ[กระทรวงสาธารณสุข แรงงานและสวัสดิการของญี่ปุ่น](https://www.mhlw.go.jp/content/001601120.pdf) ฉบับวันที่ 30 มิถุนายน 2025 ระบุว่าหัวพอตและน้ำยาที่มีนิโคตินนับเป็นยา ผ่านศุลกากรได้โดยไม่ต้องขออนุญาตไม่เกินปริมาณใช้หนึ่งเดือน คือหัวพอต 60 หัว หรือน้ำยา 120mL ซึ่งเอกสารเทียบไว้ว่าเท่ากับบุหรี่ 1,200 มวน หรือ 12,000 พัฟ ถ้ามากกว่านั้น ต้องขอเอกสารที่ญี่ปุ่นเรียกว่า 輸入確認証 ไว้ล่วงหน้า",
          "เอกสารฉบับเดียวกันระบุว่าตัวเครื่องนับเป็นเครื่องมือแพทย์ นำเข้าได้ 1 เครื่อง และเครื่องสำรองอีก 1 เครื่อง หัวพอตที่มีคอยล์อยู่ในตัวนับเป็นหัวพอต ไม่ได้นับเป็นตัวเครื่อง ส่วนสินค้าที่ไม่มีนิโคตินไม่อยู่ในกฎนี้",
          "เกาหลีใต้ หน้าสำหรับนักเดินทางของ [Korea Customs Service](https://customs.go.kr/kcs/cm/cntnts/cntntsView.do?mi=2837&cntntsId=829) หรือกรมศุลกากรของเกาหลีใต้ ระบุว่าน้ำยาบุหรี่ไฟฟ้าที่มีนิโคตินไม่ถึง 1% ได้รับยกเว้นภาษีไม่เกิน 20mL และผู้เดินทางที่อายุต่ำกว่า 19 ปีไม่ได้รับสิทธิ์ยกเว้นภาษีสำหรับยาสูบ",
          "สิงคโปร์ [ICA](https://www.ica.gov.sg/enter-transit-depart/entering-singapore/what-you-can-bring/prohibited-controlled-dutiable-goods) หน่วยงานตรวจคนเข้าเมืองและด่านของสิงคโปร์ จัดบุหรี่ไฟฟ้าไว้ในรายการสินค้าต้องห้าม ในหน้าที่ปรับปรุงเมื่อ 14 เมษายน 2026 ส่วน [HSA](https://www.hsa.gov.sg/announcements/update-on-stepped-up-enforcement-against-e-vaporisers-and-education-efforts/) หน่วยงานด้านวิทยาศาสตร์สุขภาพของสิงคโปร์ ระบุเมื่อ 1 สิงหาคม 2024 ว่านักเดินทางนำเข้าไปไม่ได้ ผู้ที่ถูกพบว่ามีติดตัวจะถูกปรับ และชาวต่างชาติที่ถูกตัดสินว่าผิดจะถูกส่งตัวกลับและห้ามเข้าประเทศอีก",
          "ฮ่องกง [ข่าวประชาสัมพันธ์ของรัฐบาลฮ่องกง](https://www.info.gov.hk/gia/general/202604/29/P2026042900589.htm) วันที่ 29 เมษายน 2026 ระบุว่าตั้งแต่ปี 2022 บุหรี่ไฟฟ้านำเข้าฮ่องกงจากต่างประเทศไม่ได้",
          "กฎเหล่านี้เปลี่ยนได้ ก่อนบินให้เปิดหน้าเว็บทางการของปลายทางอีกครั้ง ข้อมูลในหัวข้อนี้คัดมาจากหน้าทางการตามวันที่ที่บอกไว้ และไม่ใช่คำแนะนำทางกฎหมาย",
        ],
      },
      {
        heading: "ก่อนบิน เช็คสายการบินและประเทศปลายทางอีกครั้ง",
        paragraphs: [
          "กติกาทั้งหมดข้างบนเป็นหลักทั่วไป ส่วนสายการบินบางแห่งเข้มกว่านั้น อย่าง Vietnam Airlines ไม่รับพอตและบุหรี่ไฟฟ้าที่มีแบตขึ้นเที่ยวบินของตัวเองในทุกกรณี ทั้งกระเป๋าถือและกระเป๋าโหลด IATA เองก็แนะนำให้เช็คนโยบายของสายการบินที่ใช้ทุกครั้ง เพราะข้อกำหนดอาจต่างกันไปตามกฎของแต่ละท้องที่",
          "กฎของประเทศปลายทางและประเทศที่แวะผ่าน ควรเช็คเองให้ชัดก่อนเดินทางทุกครั้ง โดยเปิดหน้าเว็บของสายการบินที่จองไว้ คู่กับข้อมูลของประเทศที่จะไปและที่แวะผ่าน ใช้เวลาไม่กี่นาที แต่ช่วยให้ไม่ต้องไปลุ้นหน้าเคาน์เตอร์เช็คอิน",
          "IATA ยังแนะนำให้พกเครื่องและแบตเท่าที่ใช้จริง เที่ยวสามวันก็ไม่ต้องยกไปทั้งลิ้นชัก ส่วนจากที่ร้านเจอ ถ้าที่จุดตรวจขอดู ก็หยิบออกมาให้ดูแล้วทำตามที่เจ้าหน้าที่บอกได้เลย",
        ],
      },
    ],
    faq: [
      {
        question: "พอตใช้แล้วทิ้งโหลดใต้เครื่องได้ไหม",
        answer: "ไม่ได้ ตามคู่มือ IATA พอตที่มีแบตในตัวต้องอยู่ในกระเป๋าถือหรือพกติดตัวขึ้นไปในห้องโดยสารเท่านั้น ถ้ากระเป๋าถือถูกขอให้ไปโหลดใต้เครื่องที่หน้าประตูขึ้นเครื่อง ให้หยิบพอตออกมาถือติดตัวไว้ก่อน",
      },
      {
        question: "สูบพอตบนเครื่องบินได้ไหม",
        answer: "ไม่ได้ บนเครื่องห้ามสูบ และ IATA ก็ไม่ให้ชาร์จตัวเครื่องหรือแบตบนเครื่องบิน ระหว่างบินให้เก็บไว้ในกระเป๋าถือหรือติดตัว ในแบบที่ไม่ถูกเปิดขึ้นมาเองโดยไม่ตั้งใจ",
      },
      {
        question: "พาวเวอร์แบงก์ขึ้นเครื่องได้กี่ก้อน",
        answer: "ตามแนวทางของ IATA ที่สายการบินเริ่มนำมาใช้ พกได้ไม่เกิน 2 ก้อน ก้อนละไม่เกิน 100Wh ต้องอยู่ในกระเป๋าถือ และห้ามเสียบชาร์จกับไฟบนเครื่อง บางสายการบินอาจเข้มกว่านี้ จึงควรเช็คกับสายการบินที่ใช้อีกครั้ง",
      },
      {
        question: "พกถ่านสำรองขึ้นเครื่องต้องทำยังไง",
        answer: "ใส่กระเป๋าถือเท่านั้น และกันขั้วไม่ให้ลัดวงจรทีละก้อน IATA แนะนำให้เก็บไว้ในบรรจุภัณฑ์เดิม แปะเทปปิดขั้ว หรือแยกใส่ถุงพลาสติกหรือซองก้อนละใบ",
      },
      {
        question: "น้ำยาขวดพกขึ้นเครื่องได้ไหม",
        answer: "ใช้กติกาของเหลวทั่วไปของสนามบิน สนามบินในไทยกำหนดว่าของเหลวในกระเป๋าถือต้องอยู่ในภาชนะไม่เกิน 100mL ที่ระบุความจุไว้ และรวมกันไม่เกิน 1,000mL ต่อคน ปิดฝาให้แน่นแล้วใส่ถุงซิปล็อกแยกไว้จะอุ่นใจกว่า",
      },
      {
        question: "พอตขึ้นเครื่องบินไปต่างประเทศได้ไหม",
        answer: "ตามแนวทางของ IATA ใช้หลักเดียวกัน คือใส่กระเป๋าถือหรือพกติดตัว โหลดใต้เครื่องไม่ได้ แต่บางสายการบินไม่รับเลย อย่าง Vietnam Airlines ที่ไม่รับบุหรี่ไฟฟ้าที่มีแบตในทุกกรณี และปลายทางแต่ละแห่งก็มีกฎของตัวเอง ญี่ปุ่นให้นำหัวพอตหรือน้ำยาที่มีนิโคตินเข้าได้โดยไม่ต้องขออนุญาตไม่เกินปริมาณใช้หนึ่งเดือน เกาหลีใต้ยกเว้นภาษีน้ำยาที่มีนิโคตินไม่ถึง 1% ได้ไม่เกิน 20mL ส่วนสิงคโปร์กับฮ่องกงห้ามนำเข้า ก่อนบินให้เช็คหน้าเว็บทางการของปลายทางและประเทศที่แวะต่อเครื่องทุกครั้ง",
      },
    ],
    // The shop's own clip on exactly this topic (@PODSYSTEM-OKAMI-II), title/channel/date from YouTube's player data 13/10.
    // The OKM YARZ version (nvyDoYy_1U8) is age-restricted on YouTube, so it cannot play embedded — not used.
    reviewVideo: { videoId: "BhndRb2tfSM", title: "พอตใช้แล้วทิ้งสามารถขึ้นเครื่องบินได้ไหม? REMAKE", channelName: "POD SYSTEM OKAMI II", publishedAt: "2025-04-30" },
  },
  {
    // Round SEO ฉ batch 6c topic 11 (owner 12/10 round-file health ruling + 13/10 answers): neutral, both sides, foreign agencies and
    // a published review only (_incoming/seo-f/b6c/health-quotes.md, opened 13/10). The owner's own story is held until the owner writes it.
    id: "quit-smoking-with-a-pod",
    slug: "quit-smoking-with-a-pod",
    title: "เลิกบุหรี่ด้วยพอตได้ไหม ข้อมูลสองด้านจากหน่วยงานสุขภาพ",
    dek: "พอตช่วยเลิกบุหรี่ได้จริงไหม บทความนี้รวบรวมข้อมูลทั้งสองด้านจากหน่วยงานสาธารณสุขและงานวิจัยของต่างประเทศ ให้คุณใช้ประกอบการตัดสินใจเอง",
    category: "getting-started",
    readingTimeMin: 6,
    publishedAt: "2026-10-13",
    thaiOnly: true,
    body: [
      {
        heading: "บทความนี้เขียนจากอะไร",
        paragraphs: [
          "พอตช่วยเลิกบุหรี่ได้ไหม เป็นคำถามที่ยังไม่มีคำตอบตายตัว หน่วยงานสาธารณสุขแต่ละประเทศเองก็มองต่างกัน บางแห่งเห็นว่าช่วยได้ บางแห่งยังไม่แนะนำ",
          "บทความนี้จึงรวบรวมสิ่งที่หน่วยงานสาธารณสุขของต่างประเทศและรีวิวงานวิจัยที่ตีพิมพ์แล้วบอกไว้ ทั้งฝั่งที่เห็นว่าช่วยได้และฝั่งที่เตือนเรื่องความเสี่ยง ทุกข้อบอกชื่อแหล่งไว้ในประโยค และมีลิงก์ให้เปิดอ่านต้นฉบับได้เอง",
          "หน่วยงานเหล่านี้เรียกพอตว่าบุหรี่ไฟฟ้า ในบทความนี้สองคำนี้จึงหมายถึงสิ่งเดียวกัน ร้านเราไม่ใช่แพทย์ และบทความนี้ไม่ใช่คำแนะนำทางการแพทย์ ถ้าคุณมีโรคประจำตัวหรือกำลังรักษาตัวอยู่ ควรปรึกษาแพทย์ก่อนตัดสินใจ",
        ],
      },
      {
        heading: "ฝั่งที่เห็นว่าพอตช่วยเลิกบุหรี่ได้",
        paragraphs: [
          "รีวิวงานวิจัยของ Cochrane เรื่องบุหรี่ไฟฟ้ากับการเลิกบุหรี่ ฉบับที่ตีพิมพ์เมื่อเดือนสิงหาคม 2026 รวมผลจาก 80 งานวิจัย มีผู้ใหญ่ที่สูบบุหรี่เข้าร่วมรวม 29,861 คน",
          "Cochrane สรุปว่าบุหรี่ไฟฟ้าแบบมีนิโคตินช่วยให้คนเลิกบุหรี่ได้อย่างน้อยหกเดือน ในคนที่ใช้บุหรี่ไฟฟ้าแบบมีนิโคตินทุก 100 คน อาจเลิกได้ 8–10 คน ขณะที่กลุ่มที่ใช้นิโคตินทดแทนเลิกได้ 6 คน และ 5 คนในกลุ่มที่ไม่ใช้ตัวช่วย หรือได้แค่คำปรึกษาเพื่อปรับพฤติกรรม อ่านต้นฉบับได้ที่ [รีวิวของ Cochrane](https://www.cochrane.org/evidence/CD010216_can-electronic-cigarettes-help-people-stop-smoking-and-do-they-have-any-unwanted-effects-when-used)",
          "ในรีวิวเดียวกัน Cochrane บอกด้วยว่า บุหรี่ไฟฟ้าอาจไม่เกี่ยวกับผลข้างเคียงที่ร้ายแรง แต่ผลข้างเคียงแบบไม่ร้ายแรงพบได้บ่อยกว่ากลุ่มที่ไม่ได้ใช้ตัวช่วย และทีมผู้ทำรีวิวยังบอกเองว่าต้องการหลักฐานเพิ่ม โดยเฉพาะเรื่องบุหรี่ไฟฟ้ารุ่นใหม่ ๆ",
          "NHS ระบบสาธารณสุขของสหราชอาณาจักร ระบุในหน้าที่ทบทวนล่าสุด ณ กรกฎาคม 2026 ว่าบุหรี่ไฟฟ้าน่าจะมีอันตรายน้อยกว่าบุหรี่มาก และช่วยเลิกบุหรี่ได้ จากรีวิวปี 2021 ที่ NHS อ้างถึง คนที่ใช้บุหรี่ไฟฟ้าควบคู่กับการพบผู้เชี่ยวชาญแบบตัวต่อตัว มีโอกาสเลิกสำเร็จได้ถึงสองเท่าของคนที่ใช้นิโคตินทดแทนแบบอื่น อ่านต้นฉบับได้ที่ [NHS ของสหราชอาณาจักร](https://www.nhs.uk/live-well/quit-smoking/using-e-cigarettes-to-stop-smoking/)",
          "Health New Zealand หน่วยงานสาธารณสุขของนิวซีแลนด์ ระบุว่าบุหรี่ไฟฟ้าแบบมีนิโคตินเป็นหนึ่งในเครื่องมือช่วยเลิกบุหรี่ที่ได้ผลที่สุดที่มีอยู่ และอาจเป็นทางเลือกสำหรับคนที่ลองวิธีอื่นแล้วยังเลิกไม่ได้ โดยย้ำว่าควรใช้เฉพาะคนที่ต้องการเลิกบุหรี่เท่านั้น อ่านต้นฉบับได้ที่ [Health New Zealand](https://www.healthnz.govt.nz/health-topics/keeping-healthy/smoking-and-vaping/vaping-to-stop-smoking)",
        ],
      },
      {
        heading: "ฝั่งที่ยังระมัดระวัง",
        paragraphs: [
          "องค์การอนามัยโลก (WHO) มองต่างออกไป ในหน้าถามตอบที่เผยแพร่เมื่อมกราคม 2024 WHO ระบุว่าบุหรี่ไฟฟ้าที่วางขายเป็นสินค้าทั่วไป ยังพิสูจน์ไม่ได้ว่าช่วยให้คนเลิกบุหรี่ได้เมื่อมองในภาพรวมของประชากร WHO มองว่าบุหรี่ไฟฟ้าเป็นอันตรายต่อสุขภาพ ทางที่ดีที่สุดคือไม่ใช้ทั้งบุหรี่และบุหรี่ไฟฟ้า และแนะนำวิธีเลิกแบบอื่นอย่างคำแนะนำจากบุคลากรทางการแพทย์หรือนิโคตินทดแทน อ่านต้นฉบับได้ที่ [หน้าถามตอบของ WHO](https://www.who.int/news-room/questions-and-answers/item/tobacco-e-cigarettes)",
          "CDC ศูนย์ควบคุมและป้องกันโรคของสหรัฐอเมริกา ระบุในหน้าที่เผยแพร่เมื่อพฤษภาคม 2024 ว่ายังไม่มีบุหรี่ไฟฟ้ารุ่นใดที่ FDA หน่วยงานด้านอาหารและยาของสหรัฐฯ รับรองให้ใช้ช่วยเลิกบุหรี่ ถึงอย่างนั้น CDC มองว่าบุหรี่ไฟฟ้าอาจเป็นประโยชน์กับผู้ใหญ่ที่สูบบุหรี่และไม่ได้ตั้งครรภ์ ถ้าใช้แทนยาสูบทุกชนิดที่สูบอยู่ทั้งหมด อ่านต้นฉบับได้ที่ [CDC ของสหรัฐฯ](https://www.cdc.gov/tobacco/e-cigarettes/adults.html)",
        ],
      },
      {
        heading: "เรื่องที่หลายหน่วยงานพูดตรงกัน",
        paragraphs: [
          "เรื่องแรก พอตยังมีความเสี่ยงอยู่ NHS บอกว่าการสูบพอตไม่ได้ปราศจากความเสี่ยง และยังไม่รู้แน่ชัดว่าในระยะยาวจะเสี่ยงแค่ไหน Health New Zealand ก็บอกว่าบุหรี่ไฟฟ้ามีมาไม่นานพอที่จะรู้ความเสี่ยงของการใช้ระยะยาว NHS ยังระบุด้วยว่าในน้ำยาและไอมีสารที่อาจเป็นอันตรายบางชนิดแบบเดียวกับในควันบุหรี่ แต่อยู่ในระดับที่ต่ำกว่ามาก",
          "เรื่องที่สองคือจะได้ประโยชน์ก็ต่อเมื่อเลิกบุหรี่ได้ขาด NHS บอกว่าการสูบพอตจะไม่ให้ประโยชน์เต็มที่จนกว่าจะเลิกบุหรี่ได้ทั้งหมด Health New Zealand บอกว่าแม้สูบบุหรี่แค่ 1 หรือ 2 มวนก็ยังเป็นอันตราย ส่วนการสูบพอตไปพร้อมกับบุหรี่ CDC บอกว่าไม่ช่วยปกป้องสุขภาพ",
          "เรื่องที่สามคือพอตไม่ได้มีไว้สำหรับคนไม่สูบบุหรี่ NHS ไม่แนะนำบุหรี่ไฟฟ้าสำหรับคนที่ไม่สูบบุหรี่ และ WHO เตือนว่านิโคตินทำให้ติดได้ง่ายมาก คนที่ไม่สูบบุหรี่แล้วมาใช้บุหรี่ไฟฟ้าอาจติดนิโคตินได้ ส่วนผู้ที่ตั้งครรภ์ NHS แนะนำให้ใช้นิโคตินทดแทนที่ได้รับอนุญาต เช่น แผ่นแปะหรือหมากฝรั่งนิโคติน",
        ],
      },
      {
        heading: "ถ้าจะลองใช้พอตเพื่อเลิกบุหรี่",
        paragraphs: [
          "Health New Zealand แนะนำให้ตั้งเป้าเลิกบุหรี่ให้ได้ทั้งหมดโดยเร็ว และบอกว่ากว่าจะทำได้อาจต้องลองหลายครั้ง ถ้าพลาดกลับไปสูบบุหรี่บ้าง ไม่ได้แปลว่าคุณล้มเหลว",
          "NHS บอกว่าการมีผู้เชี่ยวชาญด้านการเลิกบุหรี่คอยช่วย เป็นทางที่ให้โอกาสเลิกบุหรี่ได้ถาวรมากที่สุด ถ้ามีโอกาสคุยกับแพทย์หรือผู้เชี่ยวชาญ ก็ควรใช้โอกาสนั้น",
          "เรื่องการใช้งาน NHS แนะนำให้ใช้หัวชาร์จที่ถูกต้อง และไม่ชาร์จทิ้งไว้ตอนไม่มีใครอยู่หรือชาร์จข้ามคืน ส่วน Health New Zealand เตือนว่าน้ำยาเป็นพิษถ้ากลืนเข้าไป ควรเก็บพอตและน้ำยาให้พ้นมือเด็ก",
        ],
      },
      {
        heading: "เมื่อเลิกบุหรี่ได้แล้ว ค่อยเลิกพอตเป็นขั้นต่อไป",
        paragraphs: [
          "แม้แต่ฝั่งที่แนะนำพอตก็ไม่ได้ให้ใช้ไปตลอด อย่าง Health New Zealand ตั้งเป้าให้เลิกได้ทั้งบุหรี่และบุหรี่ไฟฟ้า โดยให้เริ่มเลิกพอตหลังเลิกบุหรี่ได้และมั่นใจว่าจะไม่กลับไปสูบอีก NHS ก็แนะนำแบบเดียวกัน",
          "วิธีที่ทั้งสองหน่วยงานแนะนำคล้ายกัน คือค่อย ๆ ลดความเข้มข้นของนิโคตินในน้ำยาลงทีละขั้น และเว้นช่วงสูบให้ห่างขึ้น NHS ยกตัวอย่างว่าถ้าปกติสูบ 20 นาทีครั้ง ก็ลองยืดเป็น 40 นาทีครั้ง แล้วคอยสังเกตความรู้สึกของตัวเอง",
          "NHS ยังแนะนำอีกหลายอย่างที่ทำได้ทุกวัน เช่น กำหนดพื้นที่ที่จะไม่สูบพอต ขอแรงสนับสนุนจากเพื่อนหรือครอบครัว หาอะไรทำให้ไม่ว่าง และให้รางวัลตัวเองเมื่อทำได้ ช่วงที่เลิกอาจมีอาการถอนนิโคติน อย่างอยากสูบมาก หงุดหงิด สมาธิไม่ค่อยดี หิวบ่อยขึ้น หรือนอนหลับยาก อ่านต้นฉบับได้ที่ [วิธีเลิกบุหรี่ไฟฟ้าของ NHS](https://www.nhs.uk/better-health/quit-smoking/ready-to-quit-smoking/vaping-to-quit-smoking/how-to-quit-vaping/)",
          "ถ้ากลับไปสูบพอตอีก NHS บอกว่าการลองหลายครั้งกว่าจะเลิกได้เป็นเรื่องปกติ และสำหรับคนที่ใช้พอตเพื่อเลิกบุหรี่ การกลับไปสูบพอตยังดีกว่าการกลับไปสูบบุหรี่มาก คลิปด้านล่างจากช่องของร้านเล่าขั้นตอนในแนวเดียวกันนี้",
        ],
        video: { videoId: "n7nS4LnEK8g", title: "วิธีเลิกบุหรี่ไฟฟ้า?", channelName: "OKM YARZ", publishedAt: "2025-04-07" },
      },
      {
        heading: "การตัดสินใจเป็นของคุณ",
        paragraphs: [
          "สรุปสั้น ๆ คือ NHS Health New Zealand และรีวิวงานวิจัยของ Cochrane เห็นว่าพอตช่วยเลิกบุหรี่ได้ ขณะที่ WHO ยังไม่แนะนำ ส่วน CDC มองว่าอาจมีประโยชน์กับผู้ใหญ่เฉพาะเมื่อใช้แทนบุหรี่ทั้งหมด และทั้ง NHS Health New Zealand และ WHO ต่างบอกว่าพอตยังมีความเสี่ยง",
          "ร้านเราไม่ได้บอกว่าทางไหนถูก ลองอ่านต้นฉบับจากลิงก์ในบทความ คุยกับแพทย์หรือผู้เชี่ยวชาญถ้าทำได้ แล้วเลือกทางที่เหมาะกับตัวเอง จะใช้พอตหรือวิธีอื่นก็ได้ ขอให้เลิกบุหรี่ได้อย่างที่ตั้งใจ",
        ],
      },
    ],
    faq: [
      { question: "พอตช่วยเลิกบุหรี่ได้จริงไหม", answer: "หน่วยงานยังเห็นต่างกัน รีวิวงานวิจัยของ Cochrane ปี 2026 พบว่าในคนที่ใช้บุหรี่ไฟฟ้าแบบมีนิโคตินทุก 100 คน อาจเลิกบุหรี่ได้ 8–10 คน เทียบกับ 6 คนในกลุ่มที่ใช้นิโคตินทดแทน และ NHS ของสหราชอาณาจักรเห็นว่าช่วยได้ ส่วน WHO ระบุเมื่อปี 2024 ว่ายังไม่ได้รับการพิสูจน์ว่าช่วยเลิกบุหรี่ได้เมื่อมองในภาพรวมของประชากร" },
      { question: "สูบพอตกับบุหรี่ไปพร้อมกันได้ไหม", answer: "หน่วยงานสุขภาพไม่แนะนำ CDC ของสหรัฐฯ บอกว่าการใช้ควบคู่กันไม่ช่วยปกป้องสุขภาพ และ Health New Zealand บอกว่าแม้สูบบุหรี่แค่ 1 หรือ 2 มวนก็ยังเป็นอันตราย จะได้ประโยชน์เต็มที่ก็ต่อเมื่อเลิกบุหรี่ได้ทั้งหมด" },
      { question: "พอตอันตรายน้อยกว่าบุหรี่ไหม", answer: "NHS ของสหราชอาณาจักรบอกว่าพอตน่าจะอันตรายน้อยกว่าบุหรี่มาก และ Health New Zealand บอกว่าอันตรายน้อยกว่าสูบบุหรี่ แต่ทั้งสองแห่งย้ำว่ายังมีความเสี่ยง ขณะที่ WHO มองบุหรี่ไฟฟ้าว่าอันตรายต่อสุขภาพ และทั้งสามแห่งบอกตรงกันว่ายังไม่รู้ผลระยะยาว" },
      { question: "คนท้องใช้พอตช่วยเลิกบุหรี่ได้ไหม", answer: "NHS แนะนำให้คนที่ตั้งครรภ์ใช้นิโคตินทดแทนที่ได้รับอนุญาต เช่น แผ่นแปะหรือหมากฝรั่งนิโคติน และ CDC พูดถึงประโยชน์ที่อาจมีเฉพาะกับผู้ใหญ่ที่ไม่ได้ตั้งครรภ์ ควรปรึกษาแพทย์ก่อน" },
      { question: "เลิกบุหรี่ได้แล้ว ต้องเลิกพอตด้วยไหม", answer: "Health New Zealand ตั้งเป้าให้เลิกได้ทั้งบุหรี่และบุหรี่ไฟฟ้า ส่วน NHS แนะนำให้เลิกพอตเมื่อมั่นใจว่าจะไม่กลับไปสูบบุหรี่ วิธีที่ทั้งสองแห่งแนะนำคือค่อย ๆ ลดความเข้มข้นของนิโคตินในน้ำยา และสูบให้ห่างขึ้น" },
    ],
  },
  {
    // Round "SEO all keys" batch 2 (owner 16/10: "ทุกคีย์ที่ลูกค้าจะหาเราเจอ", SEO_LANDSCAPE §9.2 row 1): "เติมน้ำยาพอตยังไง" had no
    // page — GSC sent "เติมน้ำยายังไง" to /products/m-switch-kit, whose pods are prefilled. Maker facts: UWELL's own FAQ
    // (myuwell.com/faq, opened 16/10: 10-minute coil saturation, refill above MIN, cover the drip tip / plug after refilling,
    // keep cartridge swaps rare, one coil one e-liquid) and product pages (G4 family refills without removing the pod) ·
    // RELX FAQ (relxnow.com/pages/faq: pods not designed to be refilled) · side/top fill per market version = uwell.ts.
    // "80–90%" is the SHOP's rule from fixing-a-leaking-pod, said as such. No shop clip shows refilling → no video.
    // No relatedProductSlugs (LESSONS 35) · appended at the end of allGuides (home slice and read-next order unchanged).
    // Links avoid the pages frozen until the 22/10 GSC read (SEO_LANDSCAPE §9.6). Evidence _incoming/seo-keys/b2-facts.md.
    id: "refilling-a-pod",
    slug: "refilling-a-pod",
    title: "เติมพอตยังไง หัวพอตแบบไหนเติมเองได้ และเติมแค่ไหนดี",
    dek: "เติมน้ำยาพอตไม่ยาก แต่ต้องรู้ก่อนว่าหัวพอตของเราเติมเองได้หรือเปล่า บทความนี้เล่าวิธีเติมทีละขั้น เติมแค่ไหนถึงพอดี และหัวพอตใหม่ควรรอนานแค่ไหนก่อนสูบ",
    category: "maintenance",
    readingTimeMin: 6,
    publishedAt: "2026-10-16",
    thaiOnly: true,
    body: [
      {
        heading: "เติมน้ำยาพอตยังไง เริ่มจากดูว่าหัวพอตเติมได้ไหม",
        paragraphs: [
          "เติมน้ำยาพอตยังไง ก่อนเปิดขวดน้ำยา ให้ดูก่อนว่าหัวพอตที่ใช้อยู่เป็นแบบไหน เพราะหัวพอตมีทั้งแบบที่เติมน้ำยาเองได้ และแบบที่มีน้ำยามาในตัวแล้ว หัวพอตของ[พอตซิสเต็ม](/products/pod-systems)เติมน้ำยาเองได้ ส่วนหัวพอตของเครื่องระบบสวิตช์ และพอตใช้แล้วทิ้ง มีน้ำยามาในตัวแล้ว ไม่ต้องเติม",
          "บทความนี้ไล่ให้ดูตั้งแต่วิธีแยกหัวพอตสองแบบนี้ ขั้นตอนเติมทีละขั้น เติมแค่ไหนถึงพอดี ไปจนถึงหัวพอตใหม่ควรพักนานแค่ไหนก่อนสูบ",
        ],
      },
      {
        heading: "หัวพอตแบบไหนเติมเองได้",
        paragraphs: [
          "หัวพอตที่เติมเองได้คือหัวพอตของพอตซิสเต็ม อย่างหัวพอต GPP ของตระกูล Caliburn จาก UWELL รวมถึงพอตคิทที่ใช้หัวพอตแบบเติม อย่างสาย ARGUS กับ DRAG ดูรุ่นทั้งหมดได้ในหมวดพอตซิสเต็ม",
          "หัวพอตแบบเติมยังแบ่งตามตำแหน่งช่องเติมน้ำยาได้อีกสองแบบ คือเติมด้านบนกับเติมด้านข้าง หัวพอต GPP ของ UWELL มีทั้งสองแบบ ส่วนหัวที่มากับ Caliburn G4 Pro เป็นแบบเติมด้านข้าง ก่อนเติมจึงควรดูให้แน่ใจว่าช่องเติมของหัวที่อยู่ในมืออยู่ตรงไหน",
        ],
        image: SECTION_IMAGES.argusG4Fill,
      },
      {
        heading: "หัวพอตแบบไหนเติมไม่ได้",
        paragraphs: [
          "RELX Creator Pod กับ M Switch Pod ของ SALTHUB เป็นหัวพอตบรรจุสำเร็จ มีน้ำยามาในหัวแล้ว ใช้หมดก็เปลี่ยนหัวใหม่ได้เลย",
          "RELX เขียนไว้ชัดในหน้าคำถามที่พบบ่อยของตัวเองว่า หัวพอตของ RELX ไม่ได้ออกแบบมาให้ใช้ซ้ำหรือเติมน้ำยา และไม่ควรแกะเปิด ส่วนแบรนด์อื่น ถ้าไม่แน่ใจว่าหัวพอตของรุ่นที่ใช้อยู่เติมได้หรือเปล่า ให้ยึดตามคู่มือของรุ่นนั้น หรือทักมาถามร้านทางไลน์ @okm24 ก่อนก็ได้",
          "พอตใช้แล้วทิ้งก็เช่นกัน น้ำยาบรรจุมาในตัวเครื่อง แกะกล่องแล้วสูบได้เลย และใช้จนน้ำยาหมดแล้วก็เปลี่ยนตัวใหม่ ถ้ากำลังชั่งใจระหว่างสองแบบนี้ อ่านต่อได้ที่[พอตใช้แล้วทิ้ง กับ พอตเปลี่ยนหัว](/guides/disposable-vs-switch-pod)",
        ],
      },
      {
        heading: "เติมน้ำยาทีละขั้น",
        paragraphs: [
          "แต่ละรุ่นเปิดช่องเติมต่างกันเล็กน้อย แต่ขั้นหลัก ๆ คล้ายกัน ร้านเราเติมตามลำดับนี้",
          "ขั้นแรก ดูว่ารุ่นที่ใช้ต้องถอดหัวพอตออกก่อนหรือเปล่า ตระกูล Caliburn G4 เติมได้ทั้งที่หัวพอตยังเสียบอยู่กับเครื่อง UWELL ระบุไว้ทั้งรุ่น G4 · G4 Mini · G4 Classic และ G4 Pro และเพื่อกันน้ำยาเด้งเข้าปาก UWELL แนะนำให้ถอดหัวพอตเข้าออกเท่าที่จำเป็น",
          "ขั้นที่สอง เปิดจุกซิลิโคนที่ปิดช่องเติมน้ำยา แล้วค่อย ๆ หยอดน้ำยาลงไป หัวพอตที่มองเห็นน้ำยาได้จะกะระดับได้ง่าย อย่าง Caliburn G3 Pro ที่มีช่องให้มองเห็นว่าน้ำยาเหลืออยู่แค่ไหน",
          "ขั้นที่สาม หยุดเติมตามระดับในหัวข้อถัดไป แล้วปิดจุกซิลิโคนให้สนิท UWELL ก็แนะนำแบบเดียวกันว่า เติมเสร็จแล้วให้ปิดปากดูดหรือปิดจุกซิลิโคนไว้ จากนั้นร้านเราเช็ดน้ำยาที่เลอะรอบหัวพอตและขั้วสัมผัสให้แห้ง แล้วพักหัวพอตไว้สักครู่ก่อนสูบ",
        ],
      },
      {
        heading: "เติมแค่ไหนถึงพอดี",
        paragraphs: [
          "ร้านเราเติมราว 80–90% ของหัวพอต และไม่เกินขีดบอกระดับ ถ้ารุ่นนั้นมีขีดไว้ ตัวเลขนี้เป็นวิธีที่ร้านใช้เอง ไม่ใช่ตัวเลขของผู้ผลิต เหตุผลที่ไม่เติมจนปริ่มขอบ คือต้องเหลือที่ว่างให้อากาศอยู่บ้าง ไม่อย่างนั้นพอเครื่องอุ่นขึ้นตอนใช้งาน น้ำยาไม่มีที่ให้ขยับ ก็จะหาทางออกทางช่องลมแทน",
          "อีกด้านหนึ่งคืออย่าปล่อยให้น้ำยาเหลือน้อยเกินไป UWELL แนะนำให้เติมน้ำยาให้อยู่เหนือขีด MIN และเมื่อน้ำยาลดลงถึงขีด MIN ก็ให้เติมทันที เพื่อไม่ให้คอยล์ไหม้ ร้านเราเองก็เติมให้ระดับน้ำยาสูงกว่าสำลีของคอยล์ไว้เสมอ",
          "UWELL ยังแนะนำไม่ให้ใช้คอยล์ตัวเดียวกับน้ำยาหลายกลิ่น ร้านเราจึงใช้น้ำยากลิ่นเดียวไปจนถึงรอบเปลี่ยนหัวพอต สาเหตุอื่นที่ทำให้หัวพอตไหม้ไว อ่านได้ใน[พอตไหม้ เกิดจากอะไร](/guides/fixing-a-burnt-pod)",
        ],
      },
      {
        heading: "หัวพอตใหม่ ควรพักนานแค่ไหนก่อนสูบ",
        paragraphs: [
          "หัวพอตใหม่ที่เพิ่งเติมครั้งแรก ต้องให้เวลาสำลีในคอยล์ซึมน้ำยาให้ทั่วก่อน สำหรับ Caliburn UWELL แนะนำให้ตั้งเครื่องทิ้งไว้ 10 นาที หลังใส่หัวพอตหรือคอยล์ใหม่ ส่วนรุ่นของแบรนด์อื่น ให้ดูเวลาตามคู่มือของรุ่นนั้น อย่าเพิ่งเหมาว่าต้องรอ 10 นาทีเท่ากันทุกยี่ห้อ",
          "ระหว่างรอ ร้านเราตั้งหัวพอตไว้ในแนวตั้ง พอถึงพัฟแรก ๆ ก็สูบสั้น ๆ เบา ๆ ไปก่อน ได้ทั้งเช็ครสชาติ และได้ค่อย ๆ คุ้นกับหัวใหม่ไปในตัว",
          "ส่วนหัวพอตที่ใช้อยู่แล้วแค่เติมเพิ่ม ร้านเราก็พักไว้สักครู่ก่อนสูบเหมือนกัน เพราะจากที่ร้านเจอ เติมเสร็จแล้วสูบทันทีเป็นจังหวะที่น้ำยาเด้งเข้าปากบ่อย",
        ],
      },
      {
        heading: "เติมแล้วรั่ว หรือเริ่มมีรสไหม้",
        paragraphs: [
          "ถ้าเติมแล้วเห็นน้ำยาเยิ้มที่ก้นพอต ให้ถอดหัวพอตออก แล้วเช็ดขั้วสัมผัสกับก้นหัวพอตให้แห้งก่อน สาเหตุที่ร้านเจอบ่อยและวิธีกันไม่ให้รั่วซ้ำ อ่านต่อได้ที่[หัวพอตรั่ว แก้ยังไง](/guides/fixing-a-leaking-pod)",
          "ถ้าเติมน้ำยาตามขั้นแล้วยังมีรสไหม้ หรือรสจางลงเรื่อย ๆ อาจเป็นเพราะหัวพอตใกล้หมดสภาพแล้ว วิธีดูว่าถึงเวลาเปลี่ยนหรือยัง อยู่ที่[หัวพอตใช้ได้กี่วัน เปลี่ยนเมื่อไหร่](/guides/coil-and-pod-maintenance) ส่วนหัวพอตสำหรับเปลี่ยนดูได้ในหมวด[หัวพอต](/products/pods-cartridges) เช็คให้ตรงรุ่นเครื่องก่อนทุกครั้ง",
        ],
      },
    ],
    faq: [
      { question: "หัวพอตเติมน้ำยาได้ไหม", answer: "ได้ ถ้าเป็นหัวพอตแบบเติมของพอตซิสเต็มหรือพอตคิท อย่างหัวพอต GPP ของ Caliburn ส่วนหัวพอตบรรจุสำเร็จของเครื่องระบบสวิตช์มีน้ำยามาในหัวแล้ว ใช้หมดก็เปลี่ยนหัวใหม่ และ RELX ระบุว่าหัวพอตของ RELX ไม่ได้ออกแบบมาให้เติมน้ำยา และไม่ควรแกะเปิด" },
      { question: "M Switch เติมน้ำยาได้ไหม", answer: "M Switch ใช้หัวพอตบรรจุสำเร็จ M Switch Pod ที่มีน้ำยามาในหัวแล้ว ใช้หมดก็เปลี่ยนหัวใหม่ ไม่ต้องเติมเอง ถ้าอยากเติมน้ำยาเองและเลือกกลิ่นได้ตามใจ ให้ดูพอตซิสเต็มแทน" },
      { question: "Caliburn เติมน้ำยาแล้วต้องรอกี่นาที", answer: "ถ้าเป็นหัวพอตใหม่ UWELL แนะนำให้ตั้งเครื่องทิ้งไว้ 10 นาที ให้สำลีในคอยล์ซึมน้ำยาให้ทั่วก่อนสูบครั้งแรก ส่วนหัวที่ใช้อยู่แล้วแค่เติมเพิ่ม ร้านเราพักไว้สักครู่ก่อนสูบ รุ่นของแบรนด์อื่นให้ดูเวลาตามคู่มือของรุ่นนั้น" },
      { question: "เติมน้ำยาพอตแค่ไหนดี", answer: "ร้านเราเติมราว 80–90% ของหัวพอต และไม่เกินขีดบอกระดับ ให้เหลือที่ว่างให้อากาศไว้บ้าง และไม่ปล่อยให้น้ำยาต่ำกว่าขีด MIN ตามที่ UWELL แนะนำ เพื่อไม่ให้คอยล์ไหม้" },
      { question: "Caliburn G4 ต้องถอดหัวพอตก่อนเติมไหม", answer: "ไม่ต้อง UWELL ระบุว่า Caliburn G4 · G4 Mini · G4 Classic และ G4 Pro เติมน้ำยาได้โดยไม่ต้องถอดหัวพอตออกจากเครื่อง" },
      { question: "เติมน้ำยาแล้วรั่ว ทำยังไง", answer: "ถอดหัวพอตออก เช็ดขั้วสัมผัสกับก้นหัวพอตให้แห้ง แล้วเช็คว่าเติมเกินขีดบอกระดับ หรือเติมแล้วสูบทันทีหรือเปล่า ถ้ายังรั่วซ้ำ ไล่เช็คต่อตามบทความ “หัวพอตรั่ว แก้ยังไง เกิดจากอะไร”" },
    ],
  },
  {
    // Round "SEO all keys" batch 2 (SEO_LANDSCAPE §9.1 — the owner's own key 16/10 "พอต 1 ตัวใช้ได้นานแค่ไหน", refillable device):
    // no page answered it. No maker states a device lifespan or battery charge cycles (researcher 16/10), so the article
    // splits the device into body/battery · pod · coil and keeps to: UWELL's FAQ (light flavour after long use → new coil ·
    // burnt coil → new coil or pod · device not working → check for an e-liquid short circuit and clean it) and its warranty
    // page listing coils / pods / O-rings as consumables · the shop's own experience (clip -JvtKWLx3OY description + the
    // transcripts of XCJi85tGZ1o · sWzhjV-sK1U · xXTw_JsMK3Y, and lines the site already prints). "หัวพอตใช้ได้กี่วัน" stays
    // with coil-and-pod-maintenance (one pointer sentence only). The clip is also a section clip in coil-and-pod-maintenance
    // (allowed across pages — review-video-contract-test); title/channel/date from YouTube's player data 16/10.
    id: "how-long-a-pod-device-lasts",
    slug: "how-long-a-pod-device-lasts",
    title: "พอต 1 ตัวใช้ได้นานแค่ไหน และทำไมบางคนใช้ได้นานกว่าคนอื่น",
    dek: "พอต 1 ตัวใช้ได้นานแค่ไหน ไม่มีตัวเลขตายตัว เพราะตัวเครื่อง หัวพอต และคอยล์ เสื่อมไม่พร้อมกัน บทความนี้แยกให้ดูทีละส่วน พร้อมนิสัยที่ทำให้บางคนใช้ได้นานกว่า",
    category: "maintenance",
    readingTimeMin: 6,
    publishedAt: "2026-10-16",
    thaiOnly: true,
    body: [
      {
        heading: "พอต 1 ตัวใช้ได้นานแค่ไหน",
        paragraphs: [
          "พอต 1 ตัวใช้ได้นานแค่ไหน คำตอบตรง ๆ คือไม่มีตัวเลขตายตัว เพราะ[พอตซิสเต็ม](/products/pod-systems)หนึ่งเครื่องมีสามส่วนที่เสื่อมไม่พร้อมกัน คือตัวเครื่องที่มีแบตอยู่ข้างใน หัวพอต และคอยล์ ซึ่งบางรุ่นอยู่ในหัวพอตเลย บางรุ่นแยกออกมาเปลี่ยนเอง ส่วนหนึ่งหมดสภาพ ไม่ได้แปลว่าต้องเปลี่ยนทั้งเครื่อง",
          "ตัวเลขแบตที่เห็นในสเปก อย่างใช้งานได้สูงสุดกี่วัน คือระยะเวลาต่อการชาร์จหนึ่งครั้ง ไม่ใช่อายุของเครื่อง ข้างล่างนี้จึงแยกให้ดูทีละส่วน ว่าแต่ละส่วนเสื่อมยังไง และอะไรทำให้บางคนใช้ได้นานกว่าคนอื่น",
        ],
        image: SECTION_IMAGES.caliburnG4ProBattery,
      },
      {
        heading: "ตัวเครื่องกับแบต ใช้ต่อได้หลายรอบหัวพอต",
        paragraphs: [
          "ตัวเครื่องคือส่วนที่ทำมาให้ใช้ไปเรื่อย ๆ หัวพอตหมดสภาพก็เปลี่ยนแค่หัว ตัวเครื่องยังใช้ต่อได้ตามเดิม ส่วนที่ค่อย ๆ เสื่อมลงตามเวลาคือแบตในตัว ถ้าใช้มาหลายเดือนแล้วรู้สึกว่าแบตหมดไวขึ้นเรื่อย ๆ ก็เป็นไปตามอายุของมัน และแบตในตัวถอดเปลี่ยนเองไม่ได้",
          "ตัวเลข mAh บอกขนาดแบต ใช้เทียบได้ว่าชาร์จหนึ่งครั้งอยู่ได้นานกว่ารุ่นอื่นแค่ไหน แต่ไม่ได้บอกว่าตัวเครื่องจะใช้ได้กี่เดือน และชาร์จหนึ่งครั้งอยู่ได้จริงเท่าไหร่ ก็ยังขึ้นกับวัตต์ที่ตั้ง การใช้จอ และสูบถี่แค่ไหน",
          "สิ่งที่ช่วยให้แบตอยู่กับเราได้นาน คือนิสัยการชาร์จและที่เก็บเครื่อง ร้านเขียนแยกไว้ละเอียดที่[ชาร์จพอตกี่นาที ชาร์จข้ามคืนได้ไหม](/guides/battery-care-and-charging)",
        ],
      },
      {
        heading: "หัวพอตกับคอยล์ เป็นของที่ต้องเปลี่ยนเป็นรอบ",
        paragraphs: [
          "หัวพอตกับคอยล์ต่างจากตัวเครื่อง เพราะเป็นของสิ้นเปลืองตั้งแต่แรก UWELL เองก็จัดคอยล์ หัวพอต และซีลยาง ไว้ในกลุ่มของสิ้นเปลือง หัวพอต GPP ของ Caliburn มีคอยล์ในตัว พอคอยล์หมดสภาพก็เปลี่ยนทั้งหัว ส่วนเครื่องบางรุ่นใช้หัวพอตเปล่า แล้วเปลี่ยนแค่คอยล์",
          "หัวพอตหนึ่งหัวอยู่ได้ราวกี่วันจากที่ร้านใช้เอง ร้านเล่าไว้ใน[หัวพอตใช้ได้กี่วัน เปลี่ยนเมื่อไหร่](/guides/coil-and-pod-maintenance)",
        ],
        image: SECTION_IMAGES.argusG3MiniCartridge,
      },
      {
        heading: "สัญญาณว่าถึงเวลาเปลี่ยน",
        paragraphs: [
          "ฝั่งคอยล์ UWELL บอกไว้สองแบบ แบบแรกคือรสจางลงเมื่อใช้คอยล์มานาน ถ้าลองเปลี่ยนน้ำยาใหม่แล้วรสก็ยังจางอยู่ ให้เปลี่ยนคอยล์ใหม่ แบบที่สองคือคอยล์ไหม้ ซึ่ง UWELL แนะนำให้เปลี่ยนคอยล์ หรือเปลี่ยนทั้งหัวพอตไปเลย",
          "อีกสัญญาณที่ร้านใช้ดูคือรสบาดคอ ควันน้อยลง หรือมีเสียงน้ำยาดังจ๊อก ๆ ตอนสูบ ถ้าเป็นรสไหม้ชัด ๆ อ่านสาเหตุได้ที่[พอตไหม้ เกิดจากอะไร](/guides/fixing-a-burnt-pod)",
          "ฝั่งตัวเครื่อง สัญญาณแรกคือแบตที่หมดไวขึ้นเรื่อย ๆ ตามหัวข้อข้างบน ส่วนถ้าเครื่องไม่ทำงาน UWELL แนะนำให้ลองเปลี่ยนหัวพอตใหม่ก่อน ถ้าใส่หัวใหม่แล้วยังไม่ทำงาน ปัญหาอาจอยู่ที่ตัวเครื่อง และให้เช็คด้วยว่ามีน้ำยารั่วจนลัดวงจรหรือเปล่า ถ้ามี ให้เช็ดน้ำยาที่หกออกให้สะอาด เรื่องนี้โยงกับหัวข้อถัดไปโดยตรง",
        ],
      },
      {
        heading: "ทำไมบางคนใช้พอตได้นาน แต่บางคนพังเร็ว",
        paragraphs: [
          "ร้านเคยทำคลิปเรื่องนี้ไว้ ข้อสรุปของร้านคือ หลายครั้งปัญหาไม่ได้อยู่ที่ตัวเครื่อง แต่อยู่ที่วิธีใช้ของเราเอง จากที่ร้านเจอ มีสี่เรื่องที่ทำให้ต่างกัน",
          "เรื่องแรกคือน้ำยารั่ว จากที่ร้านเจอ หัวพอตที่รั่วซึมแล้วยังฝืนใช้ต่อ ปล่อยให้น้ำยาไหลลงตัวเครื่องบ่อย ๆ อาจทำให้ตัวเครื่องเสียตามไปด้วย เปลี่ยนหัวพอตหนึ่งหัวยังคุ้มกว่าเปลี่ยนเครื่องใหม่ทั้งเครื่อง วิธีจัดการอยู่ที่[หัวพอตรั่ว แก้ยังไง](/guides/fixing-a-leaking-pod)",
          "เรื่องที่สองคือวิธีสูบ หัวพอตของเครื่องเล็กที่สูบแบบ MTL ทำมาให้ดูดสั้น ๆ ถ้าดูดแรง ดูดยาว หรือสูบติดกันหลายพัฟ น้ำยาซึมกลับเข้าสำลีไม่ทัน หัวพอตก็หมดสภาพเร็วขึ้น ร้านเราดูดครั้งละราว 1–2 วินาที และเว้นจังหวะระหว่างพัฟบ้าง",
          "เรื่องที่สามคือที่เก็บ ร้านเราจำง่าย ๆ ว่า ร้อนกระทบแบต เย็นกระทบน้ำยา จึงไม่ทิ้งเครื่องไว้ในรถกลางแดด เก็บไว้ในที่แห้งและอุณหภูมิห้อง และระวังไม่ให้ตกหรือกระแทกแรง ๆ เพราะจากที่ร้านใช้เอง แรงกระแทกไม่ดีกับแบตที่อยู่ข้างใน",
          "เรื่องที่สี่คือการเริ่มต้น ตั้งแต่วันแรกที่แกะกล่อง ร้านเราเช็คสภาพเครื่องก่อน ชาร์จแบตให้พร้อม แล้วสูบเบา ๆ ไปก่อนในช่วงแรก ให้คอยล์ได้ค่อย ๆ ทำงาน",
        ],
      },
      {
        heading: "เปลี่ยนแค่หัวพอต หรือถึงเวลาเปลี่ยนเครื่อง",
        paragraphs: [
          "ถ้าปัญหาอยู่ที่รส ควัน หรือน้ำยารั่ว ลองเปลี่ยนหัวพอตหรือคอยล์ก่อน ตัวเครื่องยังใช้ต่อได้ หัวพอตสำหรับเปลี่ยนดูได้ในหมวด[หัวพอต](/products/pods-cartridges) และ[คอยล์และอุปกรณ์เสริม](/products/coils-accessories) เช็คให้ตรงรุ่นเครื่องก่อนทุกครั้ง",
          "แต่ถ้าแบตหมดไวขึ้นจนไม่พอกับการใช้งานในแต่ละวัน แบตในตัวเปลี่ยนเองไม่ได้ ถึงจุดนั้นร้านแนะนำให้มองหาเครื่องใหม่ ดูรุ่นทั้งหมดได้ในหมวด[พอตซิสเต็ม](/products/pod-systems) และ[พอตเปลี่ยนหัว](/products/switch-pods)",
          "ถ้ากำลังชั่งใจว่าจะใช้พอตซิสเต็มต่อ หรือเปลี่ยนไปใช้พอตใช้แล้วทิ้ง ข้อดีข้อเสียของแต่ละแบบอยู่ที่[พอตใช้แล้วทิ้ง หรือพอตซิสเต็ม](/guides/open-system-vs-disposable) และพอตใช้แล้วทิ้งใช้ได้นานแค่ไหน อ่านที่[พอตใช้แล้วทิ้ง ใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts)",
        ],
      },
    ],
    faq: [
      { question: "พอต 1 ตัวใช้ได้นานแค่ไหน", answer: "ไม่มีตัวเลขตายตัว ตัวเครื่องใช้ต่อได้หลายรอบหัวพอต แต่แบตในตัวจะค่อย ๆ เสื่อมไปตามการใช้งาน ส่วนหัวพอตและคอยล์เป็นของสิ้นเปลืองที่ต้องเปลี่ยนเป็นรอบ จะอยู่ได้นานแค่ไหนขึ้นกับวิธีสูบ การชาร์จ และการเก็บเครื่องของแต่ละคน" },
      { question: "หัวพอตเสื่อม ต้องเปลี่ยนเครื่องด้วยไหม", answer: "ไม่ต้อง ตัวเครื่องของพอตซิสเต็มใช้ต่อได้ เปลี่ยนแค่หัวพอตหรือคอยล์ให้ตรงรุ่น จะเปลี่ยนเครื่องก็ต่อเมื่อตัวเครื่องมีปัญหาเอง เช่น แบตหมดไวจนไม่พอใช้" },
      { question: "เปลี่ยนน้ำยาแล้วรสยังจาง ต้องเปลี่ยนคอยล์ไหม", answer: "UWELL แนะนำว่า ถ้ารสจางลงหลังใช้คอยล์มานาน และเปลี่ยนน้ำยาแล้วยังไม่ดีขึ้น ให้เปลี่ยนคอยล์ใหม่ ส่วนคอยล์ที่ไหม้แล้ว ให้เปลี่ยนคอยล์หรือเปลี่ยนทั้งหัวพอต" },
      { question: "แบตพอตเสื่อมไหม เปลี่ยนแบตได้ไหม", answer: "แบตในตัวเสื่อมลงไปตามการใช้งานเป็นธรรมดา และถอดเปลี่ยนเองไม่ได้ ถ้าใช้มาหลายเดือนแล้วแบตหมดไวขึ้นจนไม่พอใช้ ร้านแนะนำให้มองหาเครื่องใหม่" },
      { question: "ทำไมพอตของบางคนใช้ได้นานกว่า", answer: "จากที่ร้านเจอ ความต่างมักอยู่ที่วิธีใช้ ทั้งการดูดแรงหรือยาวเกินที่เครื่องทำมาให้ การปล่อยให้น้ำยารั่วลงตัวเครื่องแล้วยังฝืนใช้ต่อ และการทิ้งเครื่องไว้ในที่ร้อน ปรับสามเรื่องนี้ก็ช่วยให้ทั้งตัวเครื่องและหัวพอตอยู่ได้นานขึ้น" },
    ],
    reviewVideo: { videoId: "-JvtKWLx3OY", title: "ทำไมบางคนใช้พอตได้นาน แต่เราใช้แล้วพังเร็ว?", channelName: "OKM YARZ", publishedAt: "2026-05-02" },
  },
  {
    // Round "SEO all keys" batch 4 (SEO_LANDSCAPE §9.2 #6 — autocomplete "drag 6 vs drag s3" · "drag x3 vs drag 6" ·
    // "voopoo drag รุ่นไหนดี"): one article per family, like comparing-caliburn-models. Every number is a verified spec
    // row of drag-6 / drag-s3 / drag-x3 in voopoo.ts (thai-copy 16/10, source map in the round's b4-drag-draft.md).
    // SMART/RBA/ECO meanings = VOOPOO's own words on the DRAG S3 page, said as such. None of the three pages is a
    // SEO_BASELINE watch row, so it lands before the 22/10 read. Appended at the end of allGuides (LESSONS 35).
    id: "comparing-voopoo-drag-models",
    slug: "comparing-voopoo-drag-models",
    title: "DRAG 6 กับ DRAG S3 ต่างกันยังไง เทียบ DRAG X3 ทีละเรื่อง",
    dek: "DRAG 6 แบตในตัว 4400mAh ตั้งได้ถึง 220 วัตต์ DRAG S3 แบตในตัว 3000mAh และตัวเครื่องเล็กกว่า ส่วน DRAG X3 ใช้ถ่านที่ถอดเปลี่ยนได้และมีจอทัช เทียบให้ดูทีละเรื่อง",
    category: "buying-guide",
    readingTimeMin: 6,
    publishedAt: "2026-10-16",
    thaiOnly: true,
    body: [
      {
        heading: "สรุปก่อน: DRAG 6 กับ DRAG S3 ต่างกันตรงไหน",
        paragraphs: [
          "DRAG 6 กับ DRAG S3 ต่างกันยังไง ตอบสั้น ๆ คือ DRAG 6 ตั้งวัตต์ได้ถึง 220 วัตต์ มีแบตในตัว 4400mAh จอ 1.66 นิ้ว และมีล้อหมุนไว้ปรับค่า ส่วน DRAG S3 ตั้งได้ถึง 60 วัตต์ มีแบตในตัว 3000mAh จอ 0.96 นิ้ว และตัวเครื่องเล็กกว่า",
          "ส่วน DRAG X3 ตั้งได้ 5–80 วัตต์ และมีจอทัช 1.66 นิ้ว ที่ต่างจากอีกสองรุ่นชัดเจนคือไม่มีแบตในตัว ต้องใส่ถ่าน 18650 หรือ 21700 หนึ่งก้อน ซึ่งไม่ได้มาในกล่อง",
          "ทั้งสามรุ่นอยู่ในตระกูล DRAG ของ VOOPOO และใช้คอยล์ PnP X ได้เหมือนกัน ตัวเลขทั้งหมดในบทความนี้มาจากตารางสเปกบนหน้าสินค้า ซึ่งเราเช็คกับหน้าของ VOOPOO แล้ว",
        ],
      },
      {
        heading: "จัดกลุ่มตามสเปก",
        paragraphs: [],
        subsections: [
          {
            heading: "แบตและการชาร์จ",
            paragraphs: [
              "[DRAG 6](/products/drag-6) มีแบตในตัว 4400mAh แบ่งเป็นสองก้อน ก้อนละ 2200mAh ชาร์จผ่าน USB-C ที่ 5V/3A และใช้เวลาชาร์จ 2–3 ชั่วโมง ส่วน [DRAG S3](/products/drag-s3) มีแบตในตัว 3000mAh ชาร์จผ่าน USB-C ที่ 5V/2A ทั้งสองรุ่นนี้เมื่อแบตหมด ก็เสียบสายเข้ากับตัวเครื่องได้เลย",
              "[DRAG X3](/products/drag-x3) ไม่มีแบตในตัว ใช้ถ่าน 18650 หรือ 21700 หนึ่งก้อน ซึ่งในกล่องไม่มีมาให้ ต้องซื้อแยก ตัวเครื่องชาร์จผ่าน USB-C ที่ 5V/2A ใช้เวลาชาร์จ 2–3 ชั่วโมง และถ้ามีถ่านสำรองที่ชาร์จไว้อีกก้อน ก็สลับใส่แล้วสูบต่อได้ทันที วิธีชาร์จและดูแลถ่านอ่านได้ที่ [ชาร์จพอตกี่นาทีถึงเต็ม และวิธีดูแลแบต](/guides/battery-care-and-charging)",
              "ตัวเลข mAh ใช้เทียบกันได้ระหว่าง DRAG 6 กับ DRAG S3 ที่มีแบตในตัว ส่วนชาร์จหนึ่งครั้งใช้ได้นานแค่ไหน ขึ้นกับวัตต์ที่ตั้งและสูบถี่แค่ไหน วิธีอ่านตัวเลขเหล่านี้อยู่ที่ [วิธีอ่านสเปกพอต](/guides/reading-a-spec-sheet)",
            ],
            image: SECTION_IMAGES.drag6Battery,
          },
          {
            heading: "วัตต์ ชิป และโหมด",
            paragraphs: [
              "DRAG 6 ตั้งวัตต์ได้ 5–220 วัตต์ ใช้ชิป GENE.TT 3.0 ซึ่ง VOOPOO บอกว่ากดยิงแล้วเครื่องตอบสนองได้ไวขึ้น และจ่ายไฟได้นิ่งตลอดการสูบ มีโหมด SMART · RBA และ TC-TCR ให้เลือก",
              "DRAG X3 ตั้งได้ 5–80 วัตต์ ส่วน DRAG S3 ตั้งได้ 5–60 วัตต์ สองรุ่นนี้ใช้ชิป GENE.TT 2.0 และมีโหมด SMART · RBA และ ECO เหมือนกัน VOOPOO อธิบายไว้ในหน้าของ DRAG S3 ว่า โหมด SMART จะคุมวัตต์ให้อยู่ในช่วงที่เหมาะกับคอยล์ที่ใส่ RBA ให้ตั้งค่าเองได้เต็มที่ ส่วน ECO เน้นประหยัดแบตให้ใช้ได้นานขึ้น",
              "ช่วงโอห์มของ DRAG 6 อยู่ที่ 0.05–3.0 โอห์ม ส่วน DRAG S3 กับ DRAG X3 อยู่ที่ 0.1–3.0 โอห์ม ช่วงวัตต์ของเครื่องบอกแค่ว่าเครื่องจ่ายได้เท่าไหร่ ก่อนตั้งค่าจึงควรดูช่วงวัตต์ของคอยล์ที่ใส่อยู่ด้วย วิธีเลือกวัตต์อ่านต่อได้ที่ [ตั้งกี่วัตต์ดี](/guides/choosing-wattage-and-airflow)",
            ],
          },
          {
            heading: "จอและการปลดล็อก",
            paragraphs: [
              "DRAG 6 ใช้จอ TFT 1.66 นิ้ว แสดงวัตต์ แบต โอห์ม จำนวนพัฟ และโหมด มีธีมหน้าจอให้เลือก 3 แบบ และมีล้อหมุนไว้ปรับค่าได้ละเอียด DRAG X3 ใช้จอทัชขนาด 1.66 นิ้วเท่ากัน มีธีมหน้าจอ 3 แบบ และบอกสถานะล็อกบนจอด้วย ส่วน DRAG S3 ใช้จอ TFT 0.96 นิ้ว และเปลี่ยนธีมหน้าจอได้เช่นกัน",
              "เรื่องการปลดล็อก DRAG 6 กับ DRAG S3 มีเซ็นเซอร์อยู่ที่ปุ่มยิง แตะเพื่อปลดล็อก และพอปล่อยนิ้ว เครื่องจะล็อกกลับให้เอง ส่วน DRAG X3 เลือกได้สามแบบจากเมนู คือแตะเพื่อปลดล็อก กดปุ่มเพื่อปลดล็อก หรือปลดล็อกค้างไว้",
              "ทั้งสามรุ่นกดห้าครั้งเพื่อเปิดหรือปิดเครื่อง และกดสามครั้งเพื่อเข้าเมนูเหมือนกัน ถ้าเปลี่ยนจากรุ่นหนึ่งไปอีกรุ่นก็ใช้งานได้คุ้นมือ",
            ],
            image: SECTION_IMAGES.dragX3Unlock,
          },
          {
            heading: "ถังน้ำยา หัวพอต และคอยล์",
            paragraphs: [
              "DRAG 6 มากับถังน้ำยา UFORCE-X Tank II จุ 5mL เติมด้านบน และในกล่องมีคอยล์ PnP X 0.15 โอห์มกับ 0.3 โอห์มมาให้",
              "DRAG S3 กับ DRAG X3 ใช้หัวพอตแบบเดียวกัน คือ PnP X Cartridge จุ 5mL เติมด้านข้าง ทั้งสองรุ่นมีหัวพอตแบบ DTL มาในชุด และถ้าอยากสูบ MTL ก็เปลี่ยนเป็นหัวพอตแบบ MTL ได้ในเครื่องเดิม สำหรับ DRAG S3 ในกล่องมีคอยล์ PnP X 0.6 โอห์มกับ 0.8 โอห์มด้วย",
              "ทั้งสามรุ่นใช้คอยล์ PnP X ได้ทุกตัว ถ้ามี DRAG มากกว่าหนึ่งเครื่อง ก็ใช้คอยล์ชุดเดียวกันได้ ส่วนวิธีดูแลคอยล์และหัวพอตให้ใช้ได้นาน อ่านได้ที่ [หัวพอตใช้ได้กี่วัน เปลี่ยนเมื่อไหร่](/guides/coil-and-pod-maintenance)",
            ],
            image: SECTION_IMAGES.dragS3Coils,
          },
          {
            heading: "ช่องลมและแนวการสูบ",
            paragraphs: [
              "DRAG 6 ปรับลมด้วยแหวนปรับลมแบบหมุน ใช้ช่องลมแบบ Golden Triangle และสูบได้ทั้ง MTL และ DTL ด้าน DRAG X3 มีช่องลมอยู่ด้านบน และสูบได้ทั้ง DTL และ MTL ตามหัวพอตที่ใส่ ส่วน DRAG S3 มีช่องลมอยู่ด้านบนและปรับได้ด้วยการเลื่อน VOOPOO วางรุ่นนี้ไว้สำหรับสูบ MTL · RDL และ DTL แบบเบา ๆ",
              "ถ้ายังไม่แน่ใจว่าตัวเองสูบแนวไหน MTL คือดูดเข้าปากก่อนแล้วค่อยลงปอด ส่วน DTL คือดูดลงปอดตรง ๆ สองแนวนี้ให้ความรู้สึกต่างกันยังไง อ่านได้ที่ [MTL กับ DTL สูบต่างกันยังไง](/guides/understanding-mtl-vs-dtl)",
            ],
            image: SECTION_IMAGES.drag6Airflow,
          },
          {
            heading: "ขนาดและตัวเครื่อง",
            paragraphs: [
              "DRAG 6 ขนาด 150 × 51.4 × 28.6 mm หนักราว 280 กรัม DRAG X3 ขนาด 133 × 34 × 28 mm และ DRAG S3 ขนาด 124.25 × 33 × 28 mm DRAG S3 จึงตัวเล็กกว่าอีกสองรุ่น",
              "DRAG S3 กับ DRAG X3 ใช้ตัวเครื่องซิงค์อัลลอยหุ้มหนังเหมือนกัน",
            ],
          },
        ],
      },
      {
        heading: "DRAG 6 vs DRAG S3",
        paragraphs: [
          "ทั้งสองรุ่นมีแบตในตัวและชาร์จผ่าน USB-C ได้เลย DRAG 6 แบต 4400mAh และตั้งวัตต์ได้ถึง 220 วัตต์ ส่วน DRAG S3 แบต 3000mAh และตั้งได้ถึง 60 วัตต์",
          "DRAG 6 มีจอ 1.66 นิ้ว มีล้อหมุนไว้ปรับค่า ใช้ชิป GENE.TT 3.0 และถังน้ำยาแบบเติมด้านบน ส่วน DRAG S3 ใช้จอ 0.96 นิ้ว ชิป GENE.TT 2.0 และหัวพอต PnP X Cartridge แบบเติมด้านข้าง ในตัวเครื่องที่เล็กกว่าและหุ้มหนัง",
          "ถ้าอยากได้วัตต์สูงและจอใหญ่ และไม่ติดเรื่องขนาดเครื่อง DRAG 6 จะตรงกว่า ถ้าอยากได้เครื่องที่เล็กลงไว้หยิบใช้ทุกวัน และสูบ MTL หรือ RDL เป็นหลัก DRAG S3 จะเหมาะกว่า",
        ],
      },
      {
        heading: "DRAG X3 vs DRAG 6",
        paragraphs: [
          "จอ 1.66 นิ้วเท่ากัน แต่ของ DRAG X3 เป็นจอทัช ที่ต่างกันชัดคือแบต DRAG 6 มีแบตในตัว 4400mAh ส่วน DRAG X3 ใช้ถ่าน 18650 หรือ 21700 ที่ถอดเปลี่ยนได้และต้องซื้อแยก",
          "DRAG 6 ตั้งได้ถึง 220 วัตต์ ช่วงโอห์ม 0.05–3.0 โอห์ม มีโหมด TC-TCR และล้อหมุนไว้ปรับค่า ส่วน DRAG X3 ตั้งได้ถึง 80 วัตต์ ช่วงโอห์ม 0.1–3.0 โอห์ม และเลือกวิธีปลดล็อกได้สามแบบ ตัวเครื่อง DRAG X3 ขนาด 133 × 34 × 28 mm เล็กกว่า DRAG 6 ที่ 150 × 51.4 × 28.6 mm",
          "ถ้าชอบมีถ่านสำรองไว้สลับใช้ และไม่ได้ต้องการวัตต์สูงถึง 220 วัตต์ DRAG X3 จะตรงกว่า ถ้าอยากได้แบตในตัวที่เสียบชาร์จได้เลยและวัตต์ที่สูงกว่า DRAG 6 จะเหมาะกว่า",
        ],
      },
      {
        heading: "DRAG S3 vs DRAG X3",
        paragraphs: [
          "สองรุ่นนี้เหมือนกันหลายอย่าง ใช้หัวพอตแบบเดียวกันคือ PnP X Cartridge ใช้ชิป GENE.TT 2.0 มีโหมด SMART · RBA · ECO ช่วงโอห์ม 0.1–3.0 โอห์ม และตัวเครื่องเป็นซิงค์อัลลอยหุ้มหนัง",
          "ที่ต่างกันคือ DRAG S3 มีแบตในตัว 3000mAh ตั้งได้ถึง 60 วัตต์ ใช้จอ 0.96 นิ้ว และตัวเล็กกว่าเล็กน้อย ส่วน DRAG X3 ใช้ถ่านที่ถอดเปลี่ยนได้ ตั้งได้ถึง 80 วัตต์ และมีจอทัช 1.66 นิ้ว",
          "ถ้าอยากเสียบสายชาร์จได้เลยโดยไม่ต้องดูแลเรื่องถ่าน DRAG S3 จะเหมาะกว่า ถ้าชอบเลือกถ่านเอง และอยากได้วัตต์กับจอที่ใหญ่ขึ้น DRAG X3 จะตรงกว่า",
        ],
      },
      {
        heading: "VOOPOO DRAG รุ่นไหนดี เลือกตามการใช้งาน",
        paragraphs: [
          "VOOPOO DRAG รุ่นไหนดี ขึ้นอยู่กับว่าคุณอยากได้อะไรจากเครื่อง ร้านเราจึงไม่จัดอันดับ แต่สรุปตามการใช้งานไว้ให้แบบนี้",
          "ถ้าอยากได้วัตต์สูง จอใหญ่ และปรับค่าได้ละเอียดด้วยล้อหมุน ลองดู DRAG 6 ถ้าอยากได้เครื่องตัวเล็กที่มีแบตในตัว และสูบ MTL หรือ RDL เป็นหลัก ลองดู DRAG S3 และถ้าชอบใช้ถ่านที่ถอดเปลี่ยนได้กับจอทัช ลองดู DRAG X3",
          "ถ้าเพิ่งเริ่มใช้พอตเป็นเครื่องแรก และยังไม่แน่ใจว่าต้องการเครื่องวัตต์สูงแบบ DRAG หรือเปล่า อ่าน [Pod System ตัวไหนดี เลือกพอตเครื่องแรก](/guides/choosing-your-first-pod-system) ก่อนได้",
          "ส่วน [DRAG X](/products/drag-x) ใช้ถ่าน 18650 หนึ่งก้อนที่ซื้อแยก ตั้งได้ 5–80 วัตต์ และใช้คอยล์ตระกูล PnP สเปกทั้งหมดอยู่ที่หน้าสินค้าของรุ่นนี้",
          "ราคาของแต่ละรุ่นดูได้ที่หน้าสินค้าของรุ่นนั้น",
        ],
      },
    ],
    faq: [
      { question: "DRAG 6 กับ DRAG S3 ต่างกันยังไง", answer: "DRAG 6 มีแบตในตัว 4400mAh ตั้งได้ถึง 220 วัตต์ จอ 1.66 นิ้ว และใช้ถังน้ำยา UFORCE-X Tank II แบบเติมด้านบน ส่วน DRAG S3 มีแบตในตัว 3000mAh ตั้งได้ถึง 60 วัตต์ จอ 0.96 นิ้ว ตัวเครื่องเล็กกว่า และใช้หัวพอตแบบเติมด้านข้าง ทั้งสองรุ่นใช้คอยล์ PnP X ได้" },
      { question: "DRAG X3 กับ DRAG 6 ต่างกันยังไง", answer: "จอ 1.66 นิ้วเท่ากัน แต่ของ DRAG X3 เป็นจอทัช DRAG X3 ไม่มีแบตในตัว ใช้ถ่าน 18650 หรือ 21700 หนึ่งก้อนที่ต้องซื้อแยก และตั้งได้ถึง 80 วัตต์ ส่วน DRAG 6 มีแบตในตัว 4400mAh และตั้งได้ถึง 220 วัตต์" },
      { question: "VOOPOO DRAG รุ่นไหนดี", answer: "ขึ้นอยู่กับการใช้งาน อยากได้วัตต์สูงและจอใหญ่ ลองดู DRAG 6 อยากได้เครื่องตัวเล็กที่มีแบตในตัว ลองดู DRAG S3 และถ้าชอบใช้ถ่านที่ถอดเปลี่ยนได้กับจอทัช ลองดูรุ่น DRAG X3" },
      { question: "DRAG X3 มีถ่านมาให้ไหม", answer: "ไม่มี ต้องซื้อถ่านแยก DRAG X3 ใช้ถ่าน 18650 หรือ 21700 หนึ่งก้อน และถ้ามีถ่านสำรองที่ชาร์จไว้อีกก้อน ก็สลับใส่แล้วสูบต่อได้ทันที" },
      { question: "คอยล์และหัวพอต DRAG ใช้ข้ามรุ่นได้ไหม", answer: "คอยล์ PnP X ใช้ได้ทั้งสามรุ่น หัวพอต PnP X Cartridge ใช้ร่วมกันได้ระหว่าง DRAG S3 กับ DRAG X3 ส่วน DRAG 6 มากับถังน้ำยา UFORCE-X Tank II" },
    ],
    relatedProductSlugs: ["drag-6", "drag-s3", "drag-x3"],
  },
  {
    // Round "SEO all keys" batch 4 (SEO_LANDSCAPE §9.2 #4 — autocomplete "พอตเปลี่ยนหัว รุ่นไหนดี / ยี่ห้อไหนดี / 20k / 15k"):
    // the switch-system devices on the storefront, grouped by what the buyer wants. "พอตเปลี่ยนหัว" in title/H1 = owner item 65
    // (16/10, THAI_STYLE round 10B line). Numbers = verified spec rows of salthub.ts / relx.ts / Pod-159 (eskobarvape) / flavour
    // lists (thai-copy 16/10, sources in the round's b4-switch-draft.md). Muro Connector puffs left out (retailer source only).
    // Links to m-switch-kit / pod-159 / infy-20k added 20/10 (owner lifted the 22/10 hold).
    id: "choosing-a-switch-pod",
    slug: "choosing-a-switch-pod",
    title: "พอตเปลี่ยนหัว รุ่นไหนดี ยี่ห้อไหนดี ดูจากอะไร",
    dek: "เครื่องระบบสวิตช์ หรือที่หลายคนเรียกว่าพอตเปลี่ยนหัว รุ่นไหนดี ขึ้นอยู่กับว่าคุณอยากได้อะไร ร้านเราแยกรุ่นที่มีบนเว็บให้ดูตามความต้องการ ทั้งพัฟต่อหัว จอ โหมด จำนวนกลิ่น และขนาดเครื่อง",
    category: "buying-guide",
    readingTimeMin: 7,
    publishedAt: "2026-10-16",
    thaiOnly: true,
    body: [
      {
        heading: "เครื่องระบบสวิตช์ รุ่นไหนดี",
        paragraphs: [
          "เครื่องระบบสวิตช์รุ่นไหนดี หรือยี่ห้อไหนดี คำตอบขึ้นอยู่กับว่าคุณอยากได้อะไรจากเครื่อง บางคนอยากได้พัฟต่อหัวเยอะ บางคนอยากมีจอไว้ดูแบต บางคนอยากได้กลิ่นให้เลือกเยอะ หรืออยากได้เครื่องตัวเล็กไว้พกติดตัว ร้านเราจึงไม่จัดอันดับ แต่แยกรุ่นที่มีบนเว็บให้ดูตามความต้องการทีละแบบ",
          "พอตเปลี่ยนหัวคือพอตที่เก็บเครื่องไว้ชาร์จใช้ต่อ แล้วเปลี่ยนแค่หัวพอตบรรจุสำเร็จเมื่อหัวเดิมหมด ไม่ต้องเติมน้ำยาเอง บนเว็บเรารวมเครื่องแบบนี้ไว้ในหมวด[พอตเปลี่ยนหัว](/products/switch-pods) และเรียกตัวเครื่องว่าเครื่องระบบสวิตช์",
          "รุ่นที่มีบนเว็บตอนนี้ ของ SALTHUB มี [M Switch Kit](/products/m-switch-kit) · [Zero Pro](/products/zero-pro) · [Zero Nano](/products/zero-nano) ของ RELX มี [RELX Creator](/products/relx-creator) กับ [RELX Infinity 2 Plus](/products/relx-infinity-2-plus) ของ Esko Bar มี [Esko Bar Switch 20K](/products/pod-159) ของ WOTOFO มี [nexPOD 15K Pro Kit](/products/nexpod-15k) ของ KS มี [KS Quikpro 15K Kit](/products/ks-quikpro-kit) และอีกรุ่นที่ไม่ได้ระบุยี่ห้อคือ [Nexswitch 16K Kit](/products/nexswitch-16k-kit)",
          "ถ้ายังลังเลว่าจะเลือกเครื่องระบบสวิตช์หรือพอตใช้แล้วทิ้ง อ่าน[พอตใช้แล้วทิ้ง กับ พอตเปลี่ยนหัว](/guides/disposable-vs-switch-pod)ก่อนได้ บทความนี้พูดถึงการเลือกรุ่นอย่างเดียว ถ้าตัดสินใจแล้วว่าจะเอาพอตใช้แล้วทิ้ง ไปต่อที่[พอตใช้แล้วทิ้ง ยี่ห้อไหนดี](/guides/choosing-a-disposable)ได้เลย และถ้าเพิ่งเริ่มสูบพอตครั้งแรก อ่าน[สูบพอตยังไงไม่ให้สำลัก](/guides/how-to-vape-without-coughing)ไว้ด้วย",
        ],
      },
      {
        heading: "ก่อนเลือกตัวเครื่อง ดูหัวพอตไปด้วย",
        paragraphs: [
          "ตัวเครื่องซื้อครั้งเดียว แต่หัวพอตต้องซื้อไปเรื่อย ๆ ตลอดที่ใช้ ร้านเราจึงแนะนำให้ดูหัวพอตของรุ่นนั้นไปพร้อมกัน ว่าหัวละกี่พัฟ มีกลิ่นให้เลือกเท่าไหร่ และใส่กับเครื่องรุ่นไหนได้บ้าง",
          "[M Switch Pod](/products/m-switch-pod) ใช้กับตัวเครื่อง [M Switch Kit](/products/m-switch-kit) ส่วน [Zero Cartridge](/products/zero-cartridge) หัวเดียวกันใส่ได้ทั้ง Zero Pro และ Zero Nano ถ้ามีสองเครื่องก็ใช้หัวร่วมกันได้ Esko Bar Switch 20K ใช้หัวพอตของ [Esko Bar Switch](/products/esko-bar-switch-pod) เอง และ RELX Creator ใส่ได้ทั้งหัว RELX Creator Pod กับหัว [Muro Connector](/products/muro-connector-20k) สองรุ่นนี้ร้านยืนยันจากของจริงที่มีอยู่",
          "RELX Infinity 2 Plus ใส่ได้ทั้งหัว RELX Pod · RELX Pod Pro และ RELX Pod Pro 2 ซึ่ง RELX ระบุไว้ว่าเป็นหัวพอตบรรจุสำเร็จขนาด 1.9mL หัวละสูงสุด 600 พัฟ หัว RELX Pod Pro 2 ดูกลิ่นทั้งหมดได้ที่ [RELX Infinity Pro 2 Pod](/products/relx-infinity-pro-2-pod)",
          "สามรุ่นที่เหลือมีหัวพอตมาในกล่องหนึ่งหัว เมื่อหัวหมด ของ KS ใช้หัว [KS Quikpro 15K Cartridge](/products/pod-150) ซึ่ง KS ตอบไว้ว่าถอดเปลี่ยนได้ แต่เติมน้ำยาเองไม่ได้ ของ Nexswitch ใช้หัว [Nexswitch 16K Pod](/products/nexswitch-16k-pod) ส่วน nexPOD 15K มาพร้อมหัวพอตบรรจุสำเร็จ และใส่หัวแบบเติมน้ำยาเองที่ WOTOFO ขายแยกได้ด้วย",
          "ถ้าต้องการหัวพอตที่ยังไม่มีบนเว็บ หรือจะใช้หัวพอตแบบอื่นนอกจากที่บอกไว้ ทักไลน์ @okm24 ถามร้านก่อนได้",
        ],
      },
      {
        heading: "อยากได้พัฟต่อหัวเยอะ ดูรุ่น 20K กับ 15K",
        paragraphs: [
          "ถ้ากำลังหาเครื่องระบบสวิตช์รุ่น 20K บนเว็บเรามี [Esko Bar Switch 20K](/products/pod-159) ที่ผู้ผลิตระบุไว้หัวละสูงสุด 20,000 พัฟ ถัดลงมาคือ Nexswitch 16K Kit ซึ่งข้อมูลที่มากับสินค้าระบุไว้หัวละสูงสุด 16,000 พัฟ",
          "ส่วนรุ่น 15K มีให้ดูสามรุ่น เริ่มจาก M Switch ของ SALTHUB ตระกูลเดียวกับที่หลายร้านเรียกว่า Marbo ใช้หัวพอต M Switch Pod ที่ SALTHUB ระบุไว้หัวละสูงสุด 15,000 พัฟ และร้านเราเรียกชุดนี้ว่า M Bar 15K หรือ Marbo 15K",
          "อีกสองรุ่นคือ nexPOD 15K ของ WOTOFO ใช้หัวบรรจุสำเร็จขนาด 18mL กับ KS Quikpro ที่ใช้หัวขนาด 15mL ผู้ผลิตทั้งสองเจ้าระบุไว้หัวละสูงสุด 15,000 พัฟเท่ากัน",
          "ส่วนตระกูล Zero โปสเตอร์ Zero Pro ของ SALTHUB ระบุไว้ที่ 5,000 พัฟ ตระกูลนี้มีเรื่องอื่นให้เลือกมากกว่า อย่างโหมดและขนาดเครื่อง ตามหัวข้อด้านล่าง",
          "ตัวเลขพัฟเป็นจำนวนสูงสุดที่ระบุไว้ จะสูบได้ใกล้ตัวเลขนั้นแค่ไหน ขึ้นกับวิธีสูบของแต่ละคน ส่วน Esko Bar Switch 20K กับ M Switch ต่างกันตรงไหนอีกบ้าง ร้านเทียบไว้ทีละข้อที่[Esko Bar Switch 20K กับ M Switch](/guides/esko-bar-switch-vs-m-switch)",
        ],
        image: SECTION_IMAGES.mBar15kSwap,
      },
      {
        heading: "อยากมีจอไว้ดูแบต",
        paragraphs: [
          "รุ่นที่ผู้ผลิตเขียนเรื่องจอไว้ชัดมีสามรุ่น RELX Creator มีจอพิกเซลที่โชว์หน้าอีโมจิ กดปุ่มครั้งเดียวก็ดูแบตได้ [M Switch Kit](/products/m-switch-kit) มีจอดิจิทัลบอกระดับแบต แสดงทั้งตอนกำลังชาร์จและเมื่อชาร์จเต็ม ส่วน nexPOD 15K มีจอบอกทั้งระดับแบตและวัตต์ที่ใช้อยู่",
          "ส่วน RELX Infinity 2 Plus ไม่มีจอ แต่ใช้ไฟบอกระดับแบต 4 ขั้นแทน ดูได้ว่าแบตเหลือประมาณเท่าไหร่",
          "RELX Creator ขายเฉพาะตัวเครื่อง หัวพอตซื้อแยก ตัวเครื่องมีแบต 800mAh และกดปุ่มสองครั้งติดกันเพื่อสลับระหว่าง 15 วัตต์ในโหมด Normal กับ 25 วัตต์ในโหมด Boost",
        ],
        image: SECTION_IMAGES.mSwitchScreen,
      },
      {
        heading: "อยากปรับแรงสูบได้",
        paragraphs: [
          "ถ้าอยากสลับระหว่างสูบเบา ๆ กับสูบให้แรงขึ้นบนเครื่องเดียว Zero Pro มี 3 โหมด คือ Low-end · Mid-range · High-end และ RELX Infinity 2 Plus ก็มี 3 โหมดเช่นกัน คือ Eco 6.5 วัตต์ · Smooth 8 วัตต์ · Boost 10 วัตต์",
          "ส่วน Esko Bar Switch 20K มีโหมด High กับ Low และ RELX Creator สลับได้ระหว่าง Normal กับ Boost ตามหัวข้อข้างบน",
          "nexPOD 15K ปรับแรงได้ 2 ระดับ WOTOFO ระบุว่ากดปุ่มหนึ่งครั้งตอนจอติด หัวพอตบรรจุสำเร็จจะสลับจาก 16 เป็น 12 วัตต์ และถ้าใส่หัวแบบเติมน้ำยาเองที่ขายแยก จะสลับจาก 25 เป็น 20 วัตต์ เครื่องอ่านเองว่าใส่หัวแบบไหนอยู่",
          "เรื่องช่องลม M Switch Kit มีปุ่มเลื่อนปรับลม Esko Bar Switch 20K ปรับช่องลมได้ 3 ระดับ ส่วน nexPOD 15K ปรับได้ 2 ระดับ เครื่อง RELX Creator ก็ปรับช่องลมได้ และ Zero Pro ลมเข้าทางด้านข้างของเครื่อง",
        ],
        image: SECTION_IMAGES.zeroProModes,
      },
      {
        heading: "อยากได้กลิ่นให้เลือกเยอะ",
        paragraphs: [
          "นับจากรายชื่อกลิ่นบนหน้าสินค้าของเว็บเรา หัว Zero Cartridge มีให้เลือก 33 กลิ่น หัวพอตของ Esko Bar Switch 20K และ nexPOD 15K มีรุ่นละ 20 กลิ่น Muro Connector 20K มี 33 กลิ่น M Switch Pod มี 17 กลิ่น หัวของ KS Quikpro มี 16 กลิ่น และ Nexswitch 16K Pod มี 10 กลิ่น",
          "กลิ่นไหนของ M Switch Pod เป็นสายเย็นหรือสายองุ่น ร้านแยกไว้ให้ที่[Marbo กลิ่นไหนดี](/guides/choosing-a-marbo-flavor)",
        ],
      },
      {
        heading: "อยากได้เครื่องตัวเล็ก พกง่าย",
        paragraphs: [
          "Zero Nano เป็นเครื่องระบบสวิตช์ตัวเล็กของตระกูล Zero แบต 500mAh และใช้หัว Zero Cartridge เดียวกับ Zero Pro ส่วน Zero Pro เป็นเครื่องทรงเพรียว หน้าตาคล้ายปากกา แบต 380mAh",
          "ถ้าอยากห้อยเครื่องไว้กับตัว M Switch Kit มีสายคล้องคอมาให้ด้วย ตามที่ SALTHUB ระบุ",
        ],
        image: SECTION_IMAGES.mSwitchLanyard,
      },
      {
        heading: "อยากได้แบตอึด",
        paragraphs: [
          "ถ้าดูจากขนาดแบตที่ผู้ผลิตระบุ nexPOD 15K แบต 1200mAh · Esko Bar Switch 20K 850mAh · RELX Creator 800mAh · KS Quikpro 600mAh · Zero Nano 500mAh · RELX Infinity 2 Plus 440mAh และ Zero Pro 380mAh",
          "เรื่องเวลาชาร์จ RELX ระบุว่า RELX Infinity 2 Plus ชาร์จผ่าน USB-C ได้ 80% ใน 15 นาที ส่วนเครื่องของ KS ชาร์จผ่าน USB-C ราว 30 นาที และ nexPOD 15K รองรับการชาร์จเร็ว",
          "ตัวเลข mAh ใช้เทียบได้ว่าชาร์จหนึ่งครั้งอยู่ได้นานกว่ากันแค่ไหน แต่ใช้จริงได้นานเท่าไหร่ยังขึ้นกับวิธีสูบของแต่ละคน ส่วนวิธีชาร์จให้แบตอยู่กับเราได้นาน ร้านเล่าไว้ที่[ชาร์จพอตกี่นาที ชาร์จข้ามคืนได้ไหม](/guides/battery-care-and-charging)",
        ],
      },
      {
        heading: "แล้ว INFY เปลี่ยนหัวได้ไหม",
        paragraphs: [
          "หลายคนถามด้วยว่า INFY เปลี่ยนหัวได้ไหม [INFY 20K](/products/infy-20k) ที่มีบนเว็บเราเป็นพอตใช้แล้วทิ้ง ใช้จนหมดแล้วเปลี่ยนทั้งเครื่อง ร้านยืนยันความจุ 20mL และช่องลมที่ปรับได้ ถ้ากำลังมองหาหัวพอตของ INFY สำหรับเปลี่ยน ทักไลน์ @okm24 ถามร้านก่อนได้",
        ],
      },
      {
        heading: "สรุปสั้น ๆ ก่อนเลือก",
        paragraphs: [
          "ถ้าอยากได้พัฟต่อหัวเยอะ ดู Esko Bar Switch 20K ที่ผู้ผลิตระบุไว้หัวละสูงสุด 20,000 พัฟ หรือ Nexswitch 16K Kit ที่ระบุไว้หัวละสูงสุด 16,000 พัฟ ส่วนรุ่น 15K มีให้เลือกสามรุ่น คือ M Switch · nexPOD 15K และ KS Quikpro",
          "ถ้าอยากมีจอไว้ดูแบต ลองดู RELX Creator · [M Switch Kit](/products/m-switch-kit) หรือ nexPOD 15K Pro Kit ถ้าอยากปรับแรงสูบได้ ดู Zero Pro · RELX Infinity 2 Plus · Esko Bar Switch 20K · nexPOD 15K Pro Kit หรือ RELX Creator",
          "ถ้าเน้นแบตอึด nexPOD 15K Pro Kit มีแบต 1200mAh ตามที่ WOTOFO ระบุ และถ้าอยากชาร์จได้ไว RELX Infinity 2 Plus ชาร์จได้ 80% ใน 15 นาทีตามที่ RELX ระบุ",
          "ถ้าอยากได้เครื่องตัวเล็กไว้พกติดตัว ลองดู Zero Nano หรือ Zero Pro และถ้าใช้ M Bar อยู่แล้ว M Switch ก็เป็นของ SALTHUB เจ้าเดียวกัน",
          "ราคาตัวเครื่องและหัวพอตของแต่ละรุ่นดูได้ที่หน้าสินค้าของรุ่นนั้น หรือดูรวมในหมวดพอตเปลี่ยนหัวกับหัวพอต",
          "ถ้าเครื่องดูดไม่ขึ้นหรือไฟกะพริบ ไล่เช็คได้ที่[พอตดูดไม่ขึ้น ไฟกะพริบ แก้ยังไง](/guides/fixing-no-draw-and-blinking-light)",
        ],
      },
    ],
    faq: [
      { question: "เครื่องระบบสวิตช์ รุ่นไหนดี", answer: "ขึ้นอยู่กับว่าอยากได้อะไร ถ้าอยากได้พัฟต่อหัวเยอะ ดู Esko Bar Switch 20K หรือ Nexswitch 16K Kit ถ้าอยากมีจอ ดู RELX Creator · M Switch Kit หรือ nexPOD 15K Pro Kit ถ้าอยากปรับแรงสูบได้ ดู Zero Pro หรือ RELX Infinity 2 Plus ที่มีรุ่นละ 3 โหมด หรือ nexPOD 15K Pro Kit ที่ปรับได้ 2 ระดับ ถ้าเน้นแบตอึด nexPOD 15K Pro Kit มีแบต 1200mAh และถ้าอยากได้เครื่องตัวเล็ก ดู Zero Nano" },
      { question: "เครื่องระบบสวิตช์ ยี่ห้อไหนดี", answer: "บนเว็บเรามีเครื่องของ SALTHUB คือ M Switch Kit · Zero Pro · Zero Nano ของ RELX คือ RELX Creator กับ RELX Infinity 2 Plus ของ Esko Bar คือ Esko Bar Switch 20K ของ WOTOFO คือ nexPOD 15K Pro Kit ของ KS คือ KS Quikpro 15K Kit และอีกรุ่นคือ Nexswitch 16K Kit ที่ไม่ได้ระบุยี่ห้อ ยี่ห้อไหนดีขึ้นอยู่กับว่ารุ่นไหนตรงกับสิ่งที่คุณอยากได้" },
      { question: "เครื่องระบบสวิตช์ 20K มีรุ่นไหนบ้าง", answer: "บนเว็บเรามี Esko Bar Switch 20K ที่ผู้ผลิตระบุไว้หัวละสูงสุด 20,000 พัฟ ตัวเครื่องแบต 850mAh และปรับช่องลมได้ 3 ระดับ ถ้าดูรุ่นที่ใกล้เคียงกัน Nexswitch 16K Kit ระบุไว้หัวละสูงสุด 16,000 พัฟ" },
      { question: "M Bar 15K กับ M Switch เป็นรุ่นเดียวกันไหม", answer: "ใช่ ร้านเราเรียกชุด M Switch Kit ของ SALTHUB ว่า M Bar 15K หรือ Marbo 15K ใช้หัว M Switch Pod ที่ SALTHUB ระบุไว้หัวละสูงสุด 15,000 พัฟ" },
      { question: "พอตเปลี่ยนหัว 15K มีรุ่นไหนบ้าง", answer: "บนเว็บเรามีสามรุ่น คือ M Switch Kit ของ SALTHUB · nexPOD 15K Pro Kit ของ WOTOFO และ KS Quikpro 15K Kit ทั้งสามรุ่นผู้ผลิตระบุไว้หัวละสูงสุด 15,000 พัฟ ที่ต่างกันคือขนาดน้ำยาต่อหัวและตัวเครื่อง หัวพอตบรรจุสำเร็จของ nexPOD 15K Pro Kit ขนาด 18mL ส่วนหัว KS Quikpro 15K Cartridge ขนาด 15mL" },
      { question: "RELX Infinity 2 Plus ใช้หัวอะไร", answer: "RELX ระบุว่าใส่ได้ทั้งหัว RELX Pod · RELX Pod Pro และ RELX Pod Pro 2 เป็นหัวพอตบรรจุสำเร็จขนาด 1.9mL หัวละสูงสุด 600 พัฟ หัว RELX Pod Pro 2 ดูได้ที่หน้า [RELX Infinity Pro 2 Pod](/products/relx-infinity-pro-2-pod)" },
      { question: "Zero Cartridge ใส่กับเครื่องไหนได้บ้าง", answer: "ใส่ได้ทั้ง Zero Pro และ Zero Nano ของ SALTHUB หัวเดียวกันใช้ได้ทั้งสองเครื่อง" },
      { question: "INFY 20K เปลี่ยนหัวได้ไหม", answer: "INFY 20K ที่มีบนเว็บเราเป็นพอตใช้แล้วทิ้ง ใช้จนหมดแล้วเปลี่ยนทั้งเครื่อง ร้านยืนยันความจุ 20mL ไว้ ถ้ากำลังมองหาหัวพอตของ INFY สำหรับเปลี่ยน ทักไลน์ @okm24 ถามร้านก่อนได้" },
    ],
    relatedProductSlugs: ["m-switch-kit", "pod-159", "relx-creator", "zero-pro", "zero-nano", "m-switch-pod", "zero-cartridge"],
    reviewVideo: { videoId: "d0BYge07CeY", title: "5 พอตใช้แล้วทิ้งเปลี่ยนหัวได้ 2026", channelName: "OKAMI", publishedAt: "2026-07-22" },
  },
  {
    // Round "SEO all keys" batch 4 (SEO_LANDSCAPE §9.2 #5 — "พอตใช้แล้วทิ้ง ยี่ห้อไหนดี / ตัวไหนดี" + Marbo 9K vs 10K + INFY vs Esko):
    // one article over every disposable on the storefront (no X-vs-Y pages — doorway risk). Numbers = verified spec rows and
    // maker-poster feature blocks already on each product page; INFY = shop-confirmed rows (THAI_STYLE §5); Muro numbers unsaid
    // (retailer source). MOOOD = 19 flavours (its 21 options count two nicotine variants). Joiway F4 / INFY 20K / pod-159 links
    // added 20/10 (owner lifted the 22/10 hold).
    id: "choosing-a-disposable",
    slug: "choosing-a-disposable",
    title: "พอตใช้แล้วทิ้ง ยี่ห้อไหนดี ตัวไหนดี ดูจากอะไร",
    dek: "พอตใช้แล้วทิ้งยี่ห้อไหนดี ตัวไหนดี ขึ้นอยู่กับว่าคุณอยากได้อะไร ร้านเราแยกรุ่นที่มีบนเว็บให้ดูตามความต้องการ ทั้งจำนวนพัฟ จอ โหมด สองกลิ่นในเครื่องเดียว จำนวนกลิ่น และแบตที่ชาร์จได้",
    category: "buying-guide",
    readingTimeMin: 7,
    publishedAt: "2026-10-16",
    thaiOnly: true,
    body: [
      {
        heading: "พอตใช้แล้วทิ้ง ยี่ห้อไหนดี ตัวไหนดี",
        paragraphs: [
          "พอตใช้แล้วทิ้งยี่ห้อไหนดี ตัวไหนดี ไม่มีคำตอบเดียวที่ใช้ได้กับทุกคน เพราะแต่ละคนมองหาไม่เหมือนกัน บางคนอยากได้รุ่นที่พัฟเยอะ บางคนอยากมีจอไว้ดูแบต บางคนอยากได้กลิ่นให้เลือกเยอะ หรืออยากได้สองกลิ่นในเครื่องเดียว ร้านเราจึงไม่จัดอันดับ แต่แยกรุ่นที่มีบนเว็บให้ดูตามสิ่งที่คุณอยากได้ทีละแบบ",
          "ตอนนี้บนเว็บเรามีพอตใช้แล้วทิ้งจากหลายยี่ห้อ SALTHUB มี [M Bar 9K หรือมาโบ 9K](/products/m-bar-9k) กับ [M Bar 10K](/products/m-bar-10k) RELX มี [RELX Smash Go 12K](/products/relx-smash-go-12k) JOIWAY มี [Joiway F3](/products/joiway-f3) กับ [Joiway F4](/products/joiway-f4) TFIT มี [TFIT M Power 20K](/products/tfit-m-power-20k) WOTOFO มี [WOTOFO nexBAR 18K](/products/wotofo-nexbar-18k) MOOOD มี [MOOOD Monster 14K Puffs](/products/mood-monster-14k) และ INFY มี [INFY 20K](/products/infy-20k) นอกจากนี้ยังมี [nexBar CLEAR 18K](/products/pod-180) กับ [Muro SC 8000 Puffs](/products/muro-sc-8000) ที่บนเว็บไม่ได้ระบุแบรนด์",
          "ถ้ายังลังเลว่าจะเอาพอตใช้แล้วทิ้ง หรืออยากเก็บตัวเครื่องไว้แล้วเปลี่ยนแค่หัว อ่าน [พอตใช้แล้วทิ้ง กับ พอตเปลี่ยนหัว](/guides/disposable-vs-switch-pod) ก่อนได้ ส่วนถ้ากำลังชั่งกับพอตที่เติมน้ำยาเอง อ่าน [พอตใช้แล้วทิ้ง หรือพอตซิสเต็ม](/guides/open-system-vs-disposable) บทความนี้พูดถึงการเลือกรุ่นอย่างเดียว ถ้าตัดสินใจแล้วว่าอยากเก็บตัวเครื่องไว้ อ่านต่อที่ [พอตเปลี่ยนหัว รุ่นไหนดี](/guides/choosing-a-switch-pod) และถ้าเพิ่งเริ่มสูบพอตครั้งแรก อ่าน [สูบพอตยังไงไม่ให้สำลัก](/guides/how-to-vape-without-coughing) ไว้ด้วย",
        ],
      },
      {
        heading: "อยากได้รุ่นพัฟเยอะ ดูจำนวนพัฟคู่กับความจุ",
        paragraphs: [
          "ถ้าดูจากจำนวนพัฟที่ผู้ผลิตระบุ บนเว็บเรามีรุ่น 20K สองรุ่น คือ TFIT M Power 20K ที่ TFIT ระบุเอาไว้สูงสุด 20,000 พัฟ และ Joiway F4 ที่ JOIWAY ระบุเอาไว้ 20,000 พัฟ แบ่งเป็นฝั่งละ 10,000 พัฟ ถัดมาเป็นรุ่น 18K คือ WOTOFO nexBAR 18K และ nexBar CLEAR 18K ซึ่งระบุไว้สูงสุด 18,000 พัฟทั้งคู่",
          "ส่วน MOOOD Monster 14K Puffs ระบุไว้สูงสุด 14,000 พัฟ RELX Smash Go 12K สูงสุด 12,000 พัฟ Joiway F3 ระบุไว้ 12,000 พัฟขึ้นไป และฝั่ง SALTHUB มี M Bar 10K สูงสุด 10,000 พัฟ กับ M Bar 9K สูงสุด 9,000 พัฟ",
          "แต่ละยี่ห้อมีวิธีระบุตัวเลขพัฟไม่เหมือนกัน ทางร้านเราจึงดูความจุที่บอกเป็น mL ไปด้วยเสมอ รุ่นที่ผู้ผลิตบอกความจุไว้มี WOTOFO nexBAR 18K 21mL และ RELX Smash Go 12K 20mL · Joiway F4 20mL แบ่งเป็นถังละ 10mL · TFIT M Power 20K 18mL · nexBar CLEAR 18K 18mL และ MOOOD Monster 14K Puffs 16mL ส่วน INFY 20K ร้านยืนยันความจุไว้ที่ 20mL",
          "จะสูบได้ใกล้ตัวเลขพัฟแค่ไหน ยังขึ้นกับวิธีสูบของแต่ละคน เรื่องนี้ร้านเล่าไว้ละเอียดที่ [พอตใช้แล้วทิ้ง ใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts)",
        ],
      },
      {
        heading: "อยากมีจอ หรือดูได้ว่าเหลือเท่าไหร่",
        paragraphs: [
          "ถ้าอยากมีจอไว้ดู WOTOFO nexBAR 18K มีจอ LED ที่ WOTOFO ระบุว่าบอกได้ทั้งแบต น้ำยาที่เหลือ และโหมดที่ใช้อยู่ ส่วน Joiway F4 ก็มีจอ LED ตามที่ JOIWAY ระบุไว้เช่นกัน",
          "ถ้าแค่อยากรู้ว่าแบตเหลือเท่าไหร่ M Bar 10K มีไฟ LED สี่ดวงบอกแบตทีละ 25% และมีไฟ RGB บอกว่ากำลังใช้โหมดไหนอยู่",
          "บางรุ่นดูน้ำยาที่เหลือได้จากตัวเครื่องเลย Joiway F3 มีถังน้ำยาใสอยู่ด้านบน ใต้ปากดูด TFIT M Power 20K ถังด้านบนก็ใส มองจากข้างนอกก็รู้ว่าเหลือเท่าไหร่",
        ],
        image: SECTION_IMAGES.nexbar18kScreen,
      },
      {
        heading: "อยากปรับแรงสูบหรือปรับลมได้",
        paragraphs: [
          "หากอยากสลับระหว่างสูบนุ่ม ๆ กับสูบให้แรงขึ้นในเครื่องเดียว M Bar 10K มี 3 โหมด Eco · Soft · Boost กดปุ่มด้านล่างสองครั้งติดกันเพื่อสลับ WOTOFO nexBAR 18K มีโหมด NORM 16 วัตต์ กับ TURBO 19 วัตต์ ส่วน nexBar CLEAR 18K มีโหมด Normal ที่ผู้ผลิตบอกว่าสูบนุ่มและใช้ได้นานขึ้น กับโหมด Turbo ที่ให้รสเต็มและไอหนา",
          "เรื่องช่องลม รุ่นที่ผู้ผลิตระบุว่าปรับได้มี M Bar 9K · M Bar 10K · Joiway F3 · TFIT M Power 20K และ nexBar CLEAR 18K ส่วน WOTOFO nexBAR 18K ปรับได้ 2 ระดับ และ INFY 20K ร้านยืนยันว่าปรับช่องลมได้",
        ],
        image: SECTION_IMAGES.mBar10kModes,
      },
      {
        heading: "อยากได้สองกลิ่นในเครื่องเดียว",
        paragraphs: [
          "Joiway F4 เป็นรุ่น TWINS ของ JOIWAY ข้างในมีถังน้ำยาสองถัง ถังละหนึ่งกลิ่น หมุนปากดูดไปที่ถังไหนก็สูบกลิ่นนั้น และสลับได้ทุกเมื่อที่ต้องการ ข้างในใช้คอยล์ mesh สองชุด แบต 650mAh ชาร์จซ้ำได้ผ่าน USB-C",
          "นับจากรายชื่อกลิ่นบนหน้าสินค้า Joiway F4 มี 16 คู่กลิ่น เหมาะกับคนที่เบื่อกลิ่นเดิมเร็ว ชอบเปลี่ยนกลิ่นระหว่างวัน และอยากเลือกจากคู่ที่จับมาให้แล้วมากกว่าจับคู่เอง",
        ],
        image: SECTION_IMAGES.joiwayF4Twin,
      },
      {
        heading: "อยากได้กลิ่นให้เลือกเยอะ",
        paragraphs: [
          "นับจากรายชื่อกลิ่นบนหน้าสินค้า WOTOFO nexBAR 18K มี 31 กลิ่น Joiway F3 มี 31 กลิ่น RELX Smash Go 12K มี 27 กลิ่น INFY 20K มี 24 กลิ่น M Bar 9K มี 24 กลิ่น MOOOD Monster 14K Puffs มี 23 กลิ่น และ nexBar CLEAR 18K มี 19 กลิ่น",
          "รุ่นที่มี 12 กลิ่น ได้แก่ M Bar 10K และ Muro SC 8000 Puffs รุ่นที่มี 10 กลิ่น คือ TFIT M Power 20K ส่วน Joiway F4 มี 16 คู่กลิ่นตามหัวข้อข้างบน",
        ],
      },
      {
        heading: "อยากได้รุ่นที่ชาร์จได้ และแบตอึด",
        paragraphs: [
          "พอตใช้แล้วทิ้งหลายรุ่นบนเว็บเราชาร์จซ้ำได้ผ่าน USB-C หากแบตหมดก่อนน้ำยา ก็ชาร์จแล้วสูบต่อได้ ไม่ต้องทิ้งทั้งที่น้ำยายังเหลือ รุ่นที่ผู้ผลิตระบุไว้มี M Bar 9K · M Bar 10K · RELX Smash Go 12K · Joiway F3 · Joiway F4 · TFIT M Power 20K · WOTOFO nexBAR 18K และ nexBar CLEAR 18K",
          "ถ้าดูขนาดแบตที่ผู้ผลิตระบุ WOTOFO nexBAR 18K แบต 750mAh Joiway F4 กับ nexBar CLEAR 18K แบตรุ่นละ 650mAh M Bar 9K · M Bar 10K และ TFIT M Power 20K แบตรุ่นละ 600mAh ส่วน RELX Smash Go 12K แบต 400mAh",
          "ตัวเลข mAh บอกขนาดแบตคร่าว ๆ ส่วนชาร์จหนึ่งครั้งใช้ได้นานแค่ไหน ยังขึ้นกับวิธีสูบและโหมดที่ใช้ วิธีชาร์จที่ร้านใช้เองอยู่ที่ [ชาร์จพอตกี่นาที ชาร์จข้ามคืนได้ไหม](/guides/battery-care-and-charging)",
        ],
        image: SECTION_IMAGES.tfitBattery,
      },
      {
        heading: "อยากได้ขนาดที่พกง่าย",
        paragraphs: [
          "RELX ออกแบบ Smash Go 12K ให้ขนาดพอดีกระเป๋า พกไปไหนก็สะดวก และทำปากดูดให้แนบริมฝีปากได้สบาย",
          "ถ้าอยากเทียบเป็นตัวเลข TFIT ระบุขนาด M Power 20K ไว้ที่เส้นผ่านศูนย์กลาง 30mm สูง 98mm หนัก 70 กรัม ส่วน WOTOFO ระบุขนาด nexBAR 18K ไว้ที่ 101 × 44 × 26.7mm",
        ],
        image: SECTION_IMAGES.relxSmashGoPocket,
      },
      {
        heading: "Marbo 9K กับ 10K ต่างกันยังไง",
        paragraphs: [
          "M Bar 9K กับ M Bar 10K เป็นของ SALTHUB ตระกูลเดียวกันที่หลายร้านในไทยเรียกว่า Marbo ทั้งสองรุ่นแบต 600mAh ชาร์จซ้ำได้ผ่าน USB-C และปรับช่องลมได้เหมือนกัน",
          "จุดที่ต่างคือ M Bar 10K ระบุสูงสุด 10,000 พัฟ ใช้คอยล์ cotton mesh มี 3 โหมด Eco · Soft · Boost และมีไฟ LED บอกแบตกับโหมดที่ใช้อยู่ ส่วน M Bar 9K ระบุไว้สูงสุด 9,000 พัฟ และมีกลิ่นให้เลือกมากกว่า นับจากรายชื่อกลิ่นบนหน้าสินค้าของเว็บเรา M Bar 9K มี 24 กลิ่น ส่วน M Bar 10K มี 12 กลิ่น",
          "ถ้าอยากสลับโหมดได้และมีไฟไว้ดูแบต ลองดู M Bar 10K ถ้าอยากได้กลิ่นให้เลือกเยอะกว่า ลองดู M Bar 9K ส่วนกลิ่นไหนอยู่สายไหน ร้านแยกไว้ให้ที่ [Marbo กลิ่นไหนดี](/guides/choosing-a-marbo-flavor)",
        ],
      },
      {
        heading: "INFY กับ Esko Bar ต่างกันยังไง",
        paragraphs: [
          "INFY กับ Esko Bar มีรุ่น 20K บนเว็บเราทั้งคู่ แต่เป็นพอตคนละแบบ INFY 20K เป็นพอตใช้แล้วทิ้ง ใช้จนหมดแล้วเปลี่ยนทั้งเครื่อง ร้านยืนยันความจุไว้ 20mL และปรับช่องลมได้ บนหน้าสินค้ามีให้ดู 24 กลิ่น",
          "ส่วน [Esko Bar Switch 20K](/products/pod-159) เป็นเครื่องระบบสวิตช์ เก็บตัวเครื่องไว้ชาร์จใช้ต่อ แล้วเปลี่ยนแค่หัวพอตบรรจุสำเร็จ Esko Bar ระบุไว้หัวละสูงสุด 20,000 พัฟ หัวพอตจุ 18mL ตัวเครื่องแบต 850mAh มีโหมด High กับ Low และปรับช่องลมได้ 3 ระดับ",
          "ถ้าอยากแกะแล้วใช้ได้เลย หมดแล้วเปลี่ยนใหม่ทั้งเครื่อง INFY 20K ตรงกว่า ถ้าอยากเก็บตัวเครื่องไว้ใช้ต่อ Esko Bar Switch 20K ตรงกว่า สองแบบนี้ต่างกันยังไง อ่านต่อได้ที่ [พอตใช้แล้วทิ้ง กับ พอตเปลี่ยนหัว](/guides/disposable-vs-switch-pod) และถ้ากำลังเทียบ Esko Bar Switch 20K กับ M Switch ร้านเทียบไว้ทีละข้อที่ [Esko Bar Switch 20K กับ M Switch](/guides/esko-bar-switch-vs-m-switch)",
        ],
      },
      {
        heading: "Muro Connector 20K ใช้คู่กับเครื่องไหน",
        paragraphs: [
          "[Muro Connector 20K](/products/muro-connector-20k) เป็นหัวพอตบรรจุสำเร็จที่ผู้ผลิตทำมาให้ใช้กับตัวเครื่อง Creator ของ Muro และทางร้านยืนยันจากของจริงที่มีอยู่ว่าใส่กับตัวเครื่อง Creator ของ RELX ได้ด้วย ถ้าใช้ RELX Creator อยู่แล้ว บนหน้าสินค้าของเว็บเรามีหัว Muro Connector ให้ดู 33 กลิ่น",
        ],
      },
      {
        heading: "สรุปสั้น ๆ ก่อนเลือก",
        paragraphs: [
          "หากอยากได้พัฟเยอะ ลองดู TFIT M Power 20K หรือ Joiway F4 และถ้าอยากมีจอไว้ดู ลองดู WOTOFO nexBAR 18K หรือ Joiway F4",
          "หากอยากปรับแรงสูบได้ ลองดู M Bar 10K · WOTOFO nexBAR 18K หรือ nexBar CLEAR 18K ถ้าอยากได้สองกลิ่นในเครื่องเดียว ดู Joiway F4 และถ้าอยากได้กลิ่นให้เลือกเยอะ ดู WOTOFO nexBAR 18K · Joiway F3 หรือ INFY 20K",
          "ราคาของแต่ละรุ่นดูได้ที่หน้าสินค้า หรือดูรวมทุกรุ่นได้ในหมวด [พอตใช้แล้วทิ้ง](/products/disposables) ถ้ายังเลือกไม่ได้ ทักไลน์ @okm24 มาบอกร้านได้ว่าชอบแนวไหน แล้วร้านช่วยดูให้",
        ],
      },
    ],
    faq: [
      { question: "พอตใช้แล้วทิ้ง ยี่ห้อไหนดี", answer: "ขึ้นอยู่กับว่าอยากได้อะไรจากเครื่อง บนเว็บเรามี SALTHUB · RELX · JOIWAY · TFIT · WOTOFO · MOOOD และ INFY ถ้าอยากได้พัฟเยอะ ดู TFIT M Power 20K หรือ Joiway F4 ถ้าอยากมีจอ ดู WOTOFO nexBAR 18K หรือ Joiway F4 ถ้าอยากปรับแรงสูบได้ ดู M Bar 10K และถ้าอยากได้กลิ่นให้เลือกเยอะ ดู WOTOFO nexBAR 18K หรือ Joiway F3" },
      { question: "พอตใช้แล้วทิ้ง 20K มีรุ่นไหนบ้าง", answer: "บนเว็บเรามี TFIT M Power 20K ที่ TFIT ระบุไว้สูงสุด 20,000 พัฟ และ Joiway F4 ที่ JOIWAY ระบุไว้ 20,000 พัฟ แบ่งเป็นฝั่งละ 10,000 พัฟ ส่วน INFY 20K ร้านยืนยันความจุไว้ 20mL" },
      { question: "Marbo 9K กับ 10K ต่างกันยังไง", answer: "ทั้งสองรุ่นเป็นของ SALTHUB แบต 600mAh ชาร์จซ้ำได้ผ่าน USB-C และปรับช่องลมได้ M Bar 10K ระบุไว้สูงสุด 10,000 พัฟ มี 3 โหมด Eco · Soft · Boost และมีไฟบอกแบต ส่วน M Bar 9K ระบุไว้สูงสุด 9,000 พัฟ และมีกลิ่นให้เลือก 24 กลิ่น มากกว่า M Bar 10K ที่มี 12 กลิ่น" },
      { question: "INFY กับ Esko Bar ต่างกันยังไง", answer: "INFY 20K เป็นพอตใช้แล้วทิ้ง หมดแล้วเปลี่ยนทั้งเครื่อง ร้านยืนยันความจุ 20mL และช่องลมที่ปรับได้ ส่วน Esko Bar Switch 20K เป็นเครื่องระบบสวิตช์ เก็บตัวเครื่องไว้แล้วเปลี่ยนแค่หัวพอต Esko Bar ระบุไว้หัวละสูงสุด 20,000 พัฟ และตัวเครื่องแบต 850mAh" },
      { question: "พอตใช้แล้วทิ้งรุ่นไหนมีจอ", answer: "WOTOFO nexBAR 18K มีจอ LED ที่บอกแบต น้ำยาที่เหลือ และโหมดที่ใช้อยู่ Joiway F4 ก็มีจอ LED เช่นกัน ส่วนถ้าแค่อยากรู้ระดับแบต M Bar 10K มีไฟ LED บอกแบตทีละ 25%" },
      { question: "พอตใช้แล้วทิ้งสองกลิ่นในเครื่องเดียว มีรุ่นไหน", answer: "Joiway F4 ของ JOIWAY มีถังน้ำยาสองถัง ถังละหนึ่งกลิ่น หมุนปากดูดเพื่อสลับกลิ่น บนหน้าสินค้าของเว็บเรามีให้ดู 16 คู่กลิ่น" },
    ],
    // Keyword line 23/10 ("beat page 1"): the shop's own TOP 10 disposables clip already shows in Google's video block for
    // "พอตใช้แล้วทิ้ง ยี่ห้อไหนดี" and "พอตยี่ห้อไหนดี" (SERP 23/10). Channel + title by YouTube oEmbed, upload date from the watch
    // page's uploadDate (2025-02-08T04:01:09-08:00), both read 23/10.
    reviewVideo: { videoId: "p2hWunl1vv0", title: "TOP 10 พอตใช้แล้วทิ้งรุ่นยอดนิยมได้ประจำปี 2024", channelName: "POD SYSTEM OKAMI II", publishedAt: "2025-02-08" },
  },
  {
    // Round "SEO all keys" batch 4 (SEO_LANDSCAPE §9.2 #3 — "พอตกลิ่นไหนดี · มีกลิ่นอะไรบ้าง · ไม่เย็น"): flavour names grouped by
    // the words in the name only (never a taste or popularity claim). Lists = flavorVariants of each product file; Muro + INFY
    // lists come from retailer pages, so the text says "กลิ่นที่หน้าสินค้ารวมไว้". INFY 20K / JOIWAY F3 / F4 links added 20/10.
    id: "choosing-a-pod-flavor",
    slug: "choosing-a-pod-flavor",
    title: "พอตกลิ่นไหนดี เลือกจากสายที่ชอบ ทั้งเย็น ผลไม้ ชา หรือยาสูบ",
    dek: "พอตกลิ่นไหนดี ไม่มีคำตอบเดียว เริ่มจากสายที่ชอบก่อน เย็น องุ่น ผลไม้ ชาและขนม หรือยาสูบ แล้วดูว่ารุ่นไหนมีกลิ่นนั้น พร้อมวิธีดูจากชื่อว่ากลิ่นไหนเย็น",
    category: "buying-guide",
    readingTimeMin: 6,
    publishedAt: "2026-10-16",
    thaiOnly: true,
    body: [
      {
        heading: "พอตกลิ่นไหนดี เริ่มจากสายที่ชอบก่อน",
        paragraphs: [
          "พอตกลิ่นไหนดี ไม่มีคำตอบเดียว เพราะแต่ละคนชอบรสชาติไม่เหมือนกัน กลิ่นที่คนหนึ่งว่าหอม อีกคนอาจรู้สึกว่าหวานไปหรือเย็นไป ร้านเราจึงแนะนำให้เลือกสายที่ชอบก่อน ว่าชอบเย็น ชอบองุ่นหรือผลไม้ ชอบแนวชาและขนม หรือชอบยาสูบ แล้วค่อยดูว่ารุ่นไหนมีกลิ่นในสายนั้น",
          "สายในบทความนี้แบ่งจากคำในชื่อกลิ่น ชื่อกลิ่นเขียนเป็นภาษาอังกฤษตรงกับตัวเลือกบนหน้าสินค้า ชื่อที่มีทั้งผลไม้และคำที่สื่อถึงความเย็น เราจัดไว้สายเย็น ส่วนชื่อที่มีผลไม้คู่กับขนม เราจัดไว้สายผลไม้ และเราเทียบได้จากชื่อเท่านั้น ไม่ได้เทียบรสของแต่ละกลิ่น",
          "ถ้าใช้ Marbo อยู่ กลิ่นของ M Bar 9K · M Bar 10K และหัวพอต M Switch Pod แยกตามสายไว้แล้วใน [Marbo กลิ่นไหนดี](/guides/choosing-a-marbo-flavor) บทความนี้จึงเล่าถึงรุ่นอื่นเป็นหลัก",
        ],
      },
      {
        heading: "สายเย็น: ชื่อที่มี Ice · Mint · Menthol · Blast · Freeze",
        paragraphs: [
          "จากที่ร้านเจอ กลิ่นเย็นเป็นสายที่ลูกค้าถามถึงบ่อย และในสายนี้ยังแยกได้อีกสองแบบ แบบแรกคือชื่อที่มีแค่ Mint หรือ Menthol ไม่มีผลไม้อยู่ในชื่อ อย่าง Double Mint ใน [TFIT M Power 20K](/products/tfit-m-power-20k) และ [RELX Smash Go 12K](/products/relx-smash-go-12k) หรือ Mint ใน [MOOOD Monster 14K](/products/mood-monster-14k) ส่วนคนที่มองหากลิ่นเมนทอล มี Extreme Menthol ใน [Muro SC 8000](/products/muro-sc-8000) และ Menthol Freeze ใน [INFY 20K](/products/infy-20k)",
          "แบบที่สองคือชื่อที่มีผลไม้คู่กับคำที่สื่อถึงความเย็น สองรุ่นที่มีกลิ่นแบบนี้ให้เลือกหลายกลิ่น ได้แก่ [JOIWAY F3](/products/joiway-f3) เช่น Lychee Ice · Green Apple Ice · Hokkaido Melon Ice และ [WOTOFO nexBAR 18K](/products/wotofo-nexbar-18k) เช่น Mango Ice · Peach Ice · Pomegranate Ice",
          "ชื่อที่ควรระวังคือชื่อที่มีคำว่า Ice Cream อย่าง Vanilla Ice Cream ใน [Muro Connector 20K](/products/muro-connector-20k) คำนี้หมายถึงไอศกรีม ไม่ได้บอกความเย็น เราจึงจัดไว้สายชา นม และขนม",
        ],
      },
      {
        heading: "ไม่ชอบเย็น เลือกกลิ่นแบบไหนดี",
        paragraphs: [
          "ถ้าไม่ชอบความเย็น ให้เลี่ยงชื่อที่มี Ice · Mint · Menthol · Blast หรือ Freeze ไว้ก่อน แล้วเลือกจากสายองุ่น ผลไม้ ชาและขนม หรือยาสูบ ที่ชื่อไม่มีคำเหล่านี้ แต่เพราะเราเทียบได้จากชื่อเท่านั้น ถ้าอยากรู้ว่ากลิ่นที่สนใจให้ความรู้สึกเย็นหรือเปล่า ทักถามร้านทางไลน์ @okm24 ก่อนได้",
        ],
      },
      {
        heading: "สายองุ่น: ชื่อที่มี Grape",
        paragraphs: [
          "องุ่นก็เป็นอีกสายที่ลูกค้าของร้านถามถึงบ่อย และหลายรุ่นก็มีองุ่นให้เลือกมากกว่าหนึ่งแบบ คนที่หาองุ่นเคียวโฮ ชื่อในรายการคือ Kyoho Grape ซึ่งมีในรุ่น MOOOD Monster 14K · Muro Connector 20K และ INFY 20K ส่วนองุ่นคู่กับลิ้นจี่ ชื่อในรายการคือ Grape Lychee มีใน RELX Smash Go 12K · MOOOD Monster 14K และ INFY 20K",
          "ชื่อที่มีองุ่นคู่กับอย่างอื่นก็อยู่สายนี้ เช่น Grape Apple กับ Sakura Grape ใน TFIT M Power 20K · Aloe Grape ใน JOIWAY F3 และ Grape Aloe ในหัวพอต [Zero Cartridge](/products/zero-cartridge) ส่วน Grape Ice ซึ่งมีทั้งในรุ่น JOIWAY F3 และ WOTOFO nexBAR 18K เราจัดไว้สายเย็น",
          "อีกชื่อที่ควรรู้คือ Grapefruit ในรุ่น Zero Cartridge ชื่อมีคำว่า Grape ก็จริง แต่ Grapefruit คือเกรปฟรุต ผลไม้ตระกูลส้ม เราจึงจัดไว้สายผลไม้",
        ],
      },
      {
        heading: "สายผลไม้",
        paragraphs: [
          "ชื่อที่เป็นผลไม้ และไม่มีคำที่สื่อถึงความเย็นหรือ Grape อยู่ในสายนี้ ใครมองหากลิ่นแตงโม มี Watermelon ในหลายรุ่น เช่น TFIT M Power 20K · RELX Smash Go 12K · MOOOD Monster 14K และหัวพอต [Muro 3ML](/products/muro-3ml)",
          "กลิ่นพีช มี Peach ใน Zero Cartridge · Hokkaido Peach ใน JOIWAY F3 และ Peach Strawberry ใน RELX Smash Go 12K ส่วนกลิ่นลิ้นจี่ มี Lychee ใน MOOOD Monster 14K และ Zero Cartridge และกลิ่นมะม่วง มี Green Mango ใน RELX Smash Go 12K และ Mango ใน Zero Cartridge",
          "ชื่อที่มีผลไม้คู่กับขนม อย่าง Strawberry Ice Cream ใน INFY 20K หรือ Blueberry Bubblegum ใน Muro 3ML ก็อยู่สายนี้ ถ้าชอบแนวหวานแบบขนม ลองดูหัวข้อถัดไปประกอบกันได้",
        ],
      },
      {
        heading: "สายชา นม และขนม",
        paragraphs: [
          "ชื่อที่บอกเครื่องดื่มหรือขนมเป็นหลักอยู่ในสายนี้ ฝั่งชามี Thai Tea กับ Lemon Tea ใน JOIWAY F3 · Oolong Tea กับ Fruit Tea ใน Zero Cartridge และ Green Tea ใน Muro Connector 20K คนที่หากลิ่นชาไทย ชื่อในรายการคือ Thai Tea",
          "ฝั่งนมมี Thai Ovaltine ในรุ่น JOIWAY F3 และ Yakult ใน Zero Cartridge · Muro SC 8000 กับ Muro Connector 20K ส่วน INFY 20K มี Milk Tea Cha กับ Matcha",
          "ฝั่งขนมมี American Cookies · Hokkaido Ice Cream · Rainbow Candy ใน JOIWAY F3 · Rainbow Candy ใน TFIT M Power 20K และ Vanilla Ice Cream กับ Taro Ice Cream ในรุ่น Muro Connector 20K",
        ],
      },
      {
        heading: "สายยาสูบ",
        paragraphs: [
          "สำหรับคนที่ชอบรสแนวยาสูบมากกว่าผลไม้หรือของหวาน ในรุ่นที่บทความนี้ยกมา ชื่อที่บอกตรง ๆ ว่าเป็นยาสูบมีสามกลิ่น ได้แก่ Virginia Tobacco ในรุ่น JOIWAY F3 และ Caramel Tobacco ในรุ่น WOTOFO nexBAR 18K และ Cigar ในหัวพอต Zero Cartridge",
        ],
      },
      {
        heading: "แนวอื่น",
        paragraphs: [
          "ชื่อที่ไม่ได้บอกผลไม้ ความเย็น ชา หรือยาสูบตรง ๆ อยู่ตรงนี้ อย่าง Cola ที่มีในหลายรุ่น เช่น Zero Cartridge · MOOOD Monster 14K และ RELX Smash Go 12K หรือ Mineral Water ใน Muro 3ML · Muro SC 8000 · Muro Connector 20K และ INFY 20K",
          "JOIWAY F3 ยังมีชื่อที่ฟังเป็นเครื่องดื่มอีก อย่าง Golden Energy กับ Japanese Sake ส่วน Double Shisha ใน Muro 3ML ชื่อไม่ได้บอกว่ารสอะไร เราจึงจัดไว้ตรงนี้",
        ],
      },
      {
        heading: "ยังเลือกไม่ได้ หรืออยากเปลี่ยนกลิ่นบ่อย",
        paragraphs: [
          "ถ้าตัดสินใจไม่ได้ระหว่างสองกลิ่น [JOIWAY F4](/products/joiway-f4) มาเป็นคู่กลิ่นในเครื่องเดียว น้ำยาสองกลิ่นแยกกันอยู่คนละถังน้ำยา หมุนปากดูดเพื่อสลับกลิ่น เช่น Grape Ice + Lychee Ice หรือ Rainbow Candy + Strawberry Ice",
          "ถ้าอยากเปลี่ยนกลิ่นโดยไม่ต้องเปลี่ยนเครื่อง เครื่องที่ใช้หัวพอตบรรจุสำเร็จช่วยได้ กลิ่นอยู่ที่หัวพอต ส่วนตัวเครื่องใช้ตัวเดิม อย่างหัวพอต Zero Cartridge ที่ใช้กับเครื่อง Zero Pro และ Zero Nano ของ SALTHUB ข้อดีข้อเสียเมื่อเทียบกับพอตใช้แล้วทิ้ง อ่านได้ที่ [พอตใช้แล้วทิ้ง กับ พอตเปลี่ยนหัว](/guides/disposable-vs-switch-pod)",
          "ถ้าใช้[พอตซิสเต็ม](/products/pod-systems)ที่เติมน้ำยาเอง กลิ่นไม่ได้ผูกกับเครื่อง เลือกจากน้ำยาได้ตามแนวที่ชอบ ลักษณะของแต่ละแนวดูได้ที่ [ผลไม้](/e-liquid/fruit) · [เมนทอลและความเย็น](/e-liquid/menthol-cooling) · [ของหวาน](/e-liquid/dessert) · [เครื่องดื่ม](/e-liquid/beverage) และ [สไตล์ยาสูบ](/e-liquid/tobacco-style) ก่อนเปลี่ยนไปน้ำยากลิ่นใหม่ ควรรู้ไว้ว่า UWELL แนะนำไม่ให้ใช้คอยล์ตัวเดียวกับน้ำยาหลายกลิ่น วิธีเติมทีละขั้นอยู่ที่ [เติมน้ำยาพอตยังไง](/guides/refilling-a-pod)",
          "อีกเรื่องที่ร้านเจอ คือพอสูบกลิ่นเดิมไปสักพัก ลิ้นจะเริ่มชิน จนรู้สึกว่ารสไม่ชัดเท่าตอนแรก ทั้งที่เครื่องก็ทำงานปกติ ถ้าเป็นแบบนี้ ลองสลับไปกลิ่นในสายอื่นบ้างก็ได้ อ่านเรื่องนี้ต่อได้ที่ [พอตใช้แล้วทิ้ง ใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts)",
          "ถ้าอยากเห็นตัวอย่างก่อนเลือก คลิปของร้านในหน้านี้คัดกลิ่นพอตใช้แล้วทิ้งมาเล่าไว้ 5 กลิ่น ส่วนรุ่นทั้งหมดดูได้ในหมวดพอตใช้แล้วทิ้งและหมวดหัวพอต",
        ],
      },
    ],
    faq: [
      { question: "พอตกลิ่นไหนดี", answer: "แต่ละคนชอบรสชาติไม่เหมือนกัน จึงไม่มีกลิ่นเดียวที่ถูกใจทุกคน ร้านแนะนำให้เลือกสายที่ชอบก่อน ชอบเย็นดูชื่อที่มี Ice · Mint · Menthol ชอบผลไม้ดูชื่อผลไม้ ชอบแนวชาและขนมดูชื่อที่มี Tea · Ice Cream · Cookies ส่วนคนที่ชอบยาสูบดูชื่อที่มี Tobacco หรือ Cigar แล้วค่อยดูว่ารุ่นไหนมีกลิ่นนั้น" },
      { question: "พอตมีกลิ่นอะไรบ้าง", answer: "แต่ละรุ่นมีไม่เท่ากัน เช่น TFIT M Power 20K มี 10 กลิ่น JOIWAY F3 มี 31 กลิ่น และ WOTOFO nexBAR 18K มีถึง 31 กลิ่น กลิ่นทั้งหมดของแต่ละรุ่นดูได้ที่ตัวเลือกบนหน้าสินค้า ถ้าแบ่งเป็นสาย จะมีสายเย็น สายองุ่น สายผลไม้ สายชา นม และขนม สายยาสูบ และแนวอื่น" },
      { question: "พอตกลิ่นไหนไม่เย็น", answer: "ดูจากชื่อก่อน ชื่อที่มี Ice · Mint · Menthol · Blast หรือ Freeze เป็นสายเย็น ถ้าไม่ชอบเย็น ให้เลือกจากชื่อที่ไม่มีคำเหล่านี้ อย่างสายองุ่น ผลไม้ ชา หรือยาสูบ ส่วนชื่อที่มีคำว่า Ice Cream หมายถึงไอศกรีม ไม่ได้บอกความเย็น เราเทียบได้จากชื่อเท่านั้น ถ้าไม่แน่ใจ ทักถามร้านทางไลน์ @okm24 ได้" },
      { question: "พอตกลิ่นยาสูบมีไหม", answer: "มีในบางรุ่น ในรุ่นที่บทความนี้ยกมา ชื่อที่บอกตรง ๆ ว่าเป็นยาสูบคือ Virginia Tobacco ใน JOIWAY F3 · Caramel Tobacco ใน WOTOFO nexBAR 18K และ Cigar ในหัวพอต Zero Cartridge ถ้าใช้พอตซิสเต็มที่เติมน้ำยาเอง เลือกน้ำยาแนวสไตล์ยาสูบได้อีกทาง" },
      { question: "พอตกลิ่นชาไทยมีไหม", answer: "ชื่อในรายการคือ Thai Tea ใน JOIWAY F3 ส่วนแนวชาอื่น มี Lemon Tea ใน JOIWAY F3 และ MOOOD Monster 14K · Oolong Tea กับ Fruit Tea ใน Zero Cartridge และ Green Tea ใน Muro Connector 20K" },
    ],
    reviewVideo: { videoId: "UNPLCyZX0qY", title: "TOP 5 กลิ่นยอดนิยมของพอตใช้แล้วทิ้ง 2026", channelName: "OKAMI", publishedAt: "2026-05-06" },
  },
  {
    // Round "SEO all keys" batch 4 (SEO_LANDSCAPE §9.2 #6 — "argus g4 vs g4 mini · g4 mini vs g3 mini · voopoo argus รุ่นไหนดี"):
    // ARGUS against ARGUS only, like comparing-voopoo-drag-models. Every number = a verified voopoo.ts row (shop.voopoo.com).
    // G4's 1.0Ω route follows the pod row + poster (pod turned 180°). Title A since 20/10 (owner lifted the 22/10 hold; watch row 2 = the bare
    // "argus g4" on /products/argus-g4 — this title leads with the pair, not the bare model; "VOOPOO ARGUS" left the
    // title — it split mid-name on the /guides card at 1440 and the H1 at 390, measured 20/10 — and stays in the slug and body); links to argus-g4 / argus-g4-mini added 20/10.
    id: "comparing-voopoo-argus-models",
    slug: "comparing-voopoo-argus-models",
    title: "ARGUS G4 vs G4 mini ต่างกันยังไง เทียบครบ 4 รุ่น",
    dek: "ARGUS G4 กับ G4 mini แบต 1650mAh เท่ากัน ต่างกันที่จอกับวัตต์สูงสุด ส่วน G3 mini เบาที่สุดในสี่รุ่น และ P3 มีจอทัช 2.01 นิ้ว ร้านเทียบให้ดูทีละคู่",
    category: "buying-guide",
    readingTimeMin: 6,
    publishedAt: "2026-10-16",
    thaiOnly: true,
    body: [
      {
        heading: "สรุปก่อน: ARGUS สี่รุ่นต่างกันตรงไหน",
        paragraphs: [
          "ARGUS G4 กับ G4 mini ต่างกันยังไง ตอบสั้น ๆ คือสองรุ่นนี้แบตเท่ากันที่ 1650mAh และใช้หัวพอต Multi-Ohm เหมือนกัน ที่ต่างคือ G4 มีจอ HD 0.85 นิ้ว ปรับได้ 5–35 วัตต์ และกดปุ่มเพื่อใช้ 0.4 โอห์มได้อีกค่า ส่วน G4 mini ไม่มีจอ วัตต์อยู่ที่ 5–30 วัตต์ และเบากว่าที่ 56 กรัม",
          "บนเว็บเรามี ARGUS ให้เลือกสี่รุ่น คือ [ARGUS G4](/products/argus-g4) · [ARGUS G4 mini](/products/argus-g4-mini) · [ARGUS G3 mini](/products/argus-g3-mini) และ [ARGUS P3](/products/argus-p3) ทั้งสี่รุ่นเป็นเครื่องตระกูล ARGUS และต่างกันอยู่ห้าเรื่อง คือจอกับการควบคุม วิธีเปลี่ยนค่าโอห์ม แบตกับวัตต์ ช่องลม และน้ำหนัก",
          "ตัวเลขทุกตัวในบทความนี้มาจากหน้าเว็บและโปสเตอร์ของ VOOPOO ชุดเดียวกับตารางสเปกบนหน้าสินค้าของแต่ละรุ่น",
        ],
      },
      {
        heading: "จัดกลุ่มตามสเปก",
        paragraphs: [
        ],
        subsections: [
          {
            heading: "จอและการควบคุม",
            paragraphs: [
              "ARGUS G4 มีจอ HD 0.85 นิ้ว ที่แสดงแบต วัตต์ โอห์ม สถานะล็อก และจำนวนพัฟ ทุกอย่างสั่งงานจากปุ่มเดียว กดสามครั้งเพื่อปรับวัตต์ และกดห้าครั้งเพื่อเข้าเมนู ซึ่งมีทั้งปิดเครื่อง เปลี่ยนธีมหน้าจอ รีเซ็ตตัวนับพัฟ และล็อกหรือปลดล็อกเครื่อง",
              "ARGUS P3 ใช้จอทัชเต็มจอ TFT HD 2.01 นิ้ว ที่โค้งลงทั้งสองขอบ คู่กับปุ่มด้านข้าง บนจอเลือกหน้าปัดได้มากกว่า 18 แบบ ตั้งกราฟวัตต์เองได้และบันทึกไว้ได้สูงสุด 3 ชุด และมีโหมด Party · ECO · SOS กับ Child Lock ให้เลือกใช้",
              "ARGUS G4 mini ไม่มีจอ ใช้ไฟ Energy Bar บอกสถานะแทน ไฟสีขาวคือ 0.7 โอห์ม ไฟสีเขียวคือ 1.0 โอห์ม และไฟสี่ขีดบอกระดับแบต ขีดละ 25%",
              "ARGUS G3 mini ไม่มีปุ่ม สูบได้เลย และเครื่องจะปรับวัตต์ให้เองตามหัวพอตที่ใส่ สูงสุด 30 วัตต์ ส่วน G4 mini กับ P3 ก็สูบได้เลยโดยไม่ต้องกดปุ่มเช่นกัน",
            ],
            image: SECTION_IMAGES.argusP3Touch,
          },
          {
            heading: "การเปลี่ยนค่าโอห์ม",
            paragraphs: [
              "G4 กับ G4 mini มากับหัวพอต ARGUS Multi-Ohm สองหัว หัวเดียวใช้ได้มากกว่าหนึ่งค่าโอห์ม ใส่ตามที่มาในกล่องจะได้ 0.7 โอห์ม และกลับด้านหัวพอต 180 องศาจะได้ 1.0 โอห์ม ส่วน G4 เพิ่มค่าที่สามได้ด้วยการกดปุ่มสองครั้งติดกัน เป็น 0.4 โอห์ม",
              "P3 มากับหัวพอต ARGUS Snap Cartridge สองหัว คือ 0.4 โอห์มกับ 0.7 โอห์ม ส่วน G3 mini มากับ ARGUS Top Fill Cartridge V2 0.7 โอห์มหนึ่งหัว และหัวรุ่นเดียวกันนี้มีแบบ 0.4 โอห์มกับ 1.0 โอห์มให้เลือกด้วย",
              "ตามตารางของ VOOPOO สำหรับหัว ARGUS Top Fill Cartridge V2 หัว 0.4 โอห์มใช้สูบแบบ RDL ที่ 18–30 วัตต์ หัว 0.7 โอห์มใช้ที่ 14–18 วัตต์ และหัว 1.0 โอห์มใช้ที่ 10–14 วัตต์ สองค่าหลังนี้เป็นแนว MTL คือดูดเข้าปากก่อน ถ้ายังไม่แน่ใจว่าตัวเองสูบแนวไหน อ่าน[MTL กับ DTL](/guides/understanding-mtl-vs-dtl)ก่อนได้",
            ],
            image: SECTION_IMAGES.argusG4Ohm,
          },
          {
            heading: "แบต วัตต์ และการชาร์จ",
            paragraphs: [
              "G4 กับ G4 mini แบต 1650mAh เท่ากัน P3 แบต 1500mAh และ G3 mini แบต 1350mAh ใช้ mAh เทียบกันระหว่างรุ่นได้ แต่ชาร์จหนึ่งครั้งจะใช้ได้นานแค่ไหน ยังขึ้นกับวัตต์ที่ตั้งและสูบบ่อยแค่ไหน",
              "G4 ปรับได้ 5–35 วัตต์ G4 mini และ P3 อยู่ที่ 5–30 วัตต์ และ G3 mini สูงสุด 30 วัตต์โดยเครื่องปรับให้เอง ช่วงโอห์มของ G4 · G4 mini และ P3 อยู่ที่ 0.4–3.0 โอห์มเท่ากัน ตัวเลขนี้บอกว่าเครื่องรับค่าไหนได้ ไม่ได้แปลว่ามีหัวพอตทุกค่าให้เลือก อ่านเพิ่มได้ที่[วิธีอ่านสเปกพอต](/guides/reading-a-spec-sheet)",
              "ทุกรุ่นชาร์จผ่าน USB-C โดย G4 กับ P3 ชาร์จที่ 5V/2A และ VOOPOO ระบุว่า G4 ชาร์จเต็มในประมาณ 45 นาที ส่วน P3 ประมาณ 40 นาที สำหรับ G4 mini ชาร์จที่ 5V/1.5A และ G3 mini ที่ 5V/1A",
            ],
            image: SECTION_IMAGES.argusG4Battery,
          },
          {
            heading: "ช่องลม",
            paragraphs: [
              "G4 กับ G4 mini มีปุ่มเลื่อนปรับลมแบบไม่มีขั้น ปรับได้ตั้งแต่ MTL ถึง RDL ส่วน P3 ก็มีปุ่มเลื่อนปรับลมแบบไม่มีขั้นเช่นกัน",
              "G3 mini เป็นช่องลมคงที่ ปรับไม่ได้ ถ้าอยากได้การสูบอีกแบบ ให้เลือกหัวพอตค่าโอห์มอื่นแทน",
            ],
          },
          {
            heading: "น้ำหนัก ขนาด และวัสดุ",
            paragraphs: [
              "ถ้าเรียงตามน้ำหนัก G3 mini เบาที่สุดในสี่รุ่นที่ 40.85 กรัม ตามด้วย G4 mini 56 กรัม G4 แบบอะลูมิเนียมอัลลอย 65 กรัม P3 82 กรัม และ G4 แบบซิงค์อัลลอยกับหนัง 85 กรัม",
              "ด้านความยาว G3 mini ยาว 97.9 mm เมื่อใส่หัวพอต 3mL G4 mini ยาว 113 mm และ G4 ยาว 121 mm",
              "G4 · G4 mini และ G3 mini ใช้เครื่องอะลูมิเนียมอัลลอย โดย G4 มีแบบซิงค์อัลลอยกับหนังให้เลือกด้วย และ G3 mini มีลายหมุดบนตัวเครื่อง ส่วน P3 ใช้กรอบซิงค์อัลลอย มีทั้งชุดสีหนังและรุ่น Metal Edition",
            ],
          },
          {
            heading: "ระบบหัวพอต",
            paragraphs: [
              "VOOPOO ระบุว่า G4 · G4 mini และ P3 ใช้หัวพอตตระกูล ARGUS ร่วมกันได้ หัว Multi-Ohm ใช้สลับกันได้ระหว่าง G4 กับ G4 mini หัว Snap ที่มากับ P3 ใส่ได้ทั้ง G4 และ G4 mini ส่วน G3 mini ใช้หัวแบบเติมด้านบนช่วง 0.4–1.0 โอห์ม และหัว Top Fill Cartridge V2 ที่มากับ G3 mini อยู่ในรายการหัวพอตที่ใช้ได้ของทั้งสี่รุ่น",
              "สำหรับ P3 กับ G3 mini ทาง VOOPOO แนะนำให้เช็คค่าโอห์มและวัตต์ของหัวพอตให้ตรงกับเครื่องก่อนใช้",
              "หัวพอตที่มาในกล่องของทั้งสี่รุ่นเป็นแบบเติมด้านบน หัว Multi-Ohm จุ 3.5mL และหัว ARGUS Top Fill Cartridge V2 ที่มากับ G3 mini จุ 3mL ส่วนหัว Snap ของ P3 จุ 2mL เปิดฝาแล้วเติมได้จากด้านบน",
              "ถ้าอยากได้หัวพอต ARGUS เพิ่ม เว็บเรามี [หัวพอต VOOPOO Argus Pod](/products/coil-21) ให้เลือก",
            ],
            image: SECTION_IMAGES.argusPods,
          },
        ],
      },
      {
        heading: "ARGUS G4 vs G4 mini",
        paragraphs: [
          "สองรุ่นนี้แบต 1650mAh เท่ากัน ใช้หัวพอต Multi-Ohm เหมือนกัน และปรับลมได้ตั้งแต่ MTL ถึง RDL ด้วยปุ่มเลื่อนเหมือนกัน ที่ต่างคือ G4 มีจอ HD 0.85 นิ้ว ปรับได้ 5–35 วัตต์ และใช้ได้สามค่าโอห์มจากหัวพอตหัวเดียว ส่วน G4 mini ไม่มีจอ วัตต์อยู่ที่ 5–30 วัตต์ และใช้ได้สองค่า คือ 0.7 โอห์มกับ 1.0 โอห์ม",
          "G4 mini ตัวเล็กและเบากว่า ยาว 113 mm หนัก 56 กรัม ส่วน G4 ยาว 121 mm หนัก 65 กรัมในแบบอะลูมิเนียมอัลลอย หรือ 85 กรัมในแบบซิงค์อัลลอยกับหนัง เรื่องชาร์จ G4 ใช้ 5V/2A และเต็มในประมาณ 45 นาที ส่วน G4 mini ใช้ 5V/1.5A",
          "ถ้าอยากดูวัตต์ ค่าโอห์ม และจำนวนพัฟบนจอ และอยากได้สามค่าโอห์มจากหัวพอตหัวเดียว ลองดู G4 ถ้าดูสถานะจากไฟก็เพียงพอ และอยากได้เครื่องที่เล็กและเบากว่า G4 mini จะเหมาะกว่า",
        ],
        video: SECTION_CLIPS.argusG4,
      },
      {
        heading: "ARGUS G4 mini vs G3 mini",
        paragraphs: [
          "G4 mini แบตใหญ่กว่าที่ 1650mAh ส่วน G3 mini 1350mAh วัตต์สูงสุดอยู่ที่ 30 วัตต์เท่ากัน และทั้งคู่สูบได้เลยโดยไม่ต้องกดปุ่ม",
          "ที่ต่างชัดคือการปรับ G4 mini มีปุ่มเลื่อนปรับลมแบบไม่มีขั้น กลับด้านหัวพอตเพื่อสลับระหว่าง 0.7 โอห์มกับ 1.0 โอห์มได้ และมีไฟบอกค่าโอห์มกับระดับแบต ส่วน G3 mini ช่องลมคงที่ เครื่องปรับวัตต์ให้เองตามหัวพอต และมากับหัว Top Fill Cartridge V2 0.7 โอห์มหนึ่งหัว",
          "G3 mini เล็กและเบากว่า ยาว 97.9 mm เมื่อใส่หัวพอต 3mL หนัก 40.85 กรัม ส่วน G4 mini ยาว 113 mm หนัก 56 กรัม เรื่องชาร์จ G4 mini ใช้ 5V/1.5A ส่วน G3 mini ใช้ 5V/1A",
          "ถ้าอยากปรับลมและสลับค่าโอห์มเองได้ และอยากได้แบตมากกว่า ลองดู G4 mini ถ้าอยากได้เครื่องที่เบาที่สุดในสี่รุ่น หยิบขึ้นมาก็สูบได้เลยโดยไม่ต้องตั้งค่า G3 mini จะเหมาะกว่า",
        ],
      },
      {
        heading: "ARGUS G4 vs P3",
        paragraphs: [
          "สองรุ่นนี้มีจอทั้งคู่ G4 ใช้จอ HD 0.85 นิ้ว สั่งงานด้วยปุ่มเดียว ส่วน P3 ใช้จอทัชเต็มจอ 2.01 นิ้ว คู่กับปุ่มด้านข้าง และตั้งค่าบนจอได้หลายอย่าง ทั้งกราฟวัตต์ที่บันทึกไว้ได้ 3 ชุด โหมด Party และ ECO · SOS · Child Lock และหน้าปัดมากกว่า 18 แบบ",
          "G4 แบต 1650mAh ปรับได้ 5–35 วัตต์ ส่วน P3 แบต 1500mAh ปรับได้ 5–30 วัตต์ ทั้งคู่ชาร์จที่ 5V/2A โดย G4 เต็มในประมาณ 45 นาที และ P3 ประมาณ 40 นาที ด้านน้ำหนัก P3 หนัก 82 กรัม ใกล้กับ G4 แบบซิงค์อัลลอยที่ 85 กรัม ส่วน G4 แบบอะลูมิเนียมอัลลอยหนัก 65 กรัม",
          "หัวพอตที่มาในกล่องก็ต่างกัน G4 มากับหัว Multi-Ohm สองหัว จุ 3.5mL ส่วน P3 มากับหัว Snap 0.4 โอห์มกับ 0.7 โอห์ม จุ 2mL และหัว Snap ใส่ G4 ได้ตามรายการของ VOOPOO",
          "ถ้าอยากได้จอใหญ่ที่แตะสั่งงานได้ และชอบตั้งค่าเครื่องให้ตรงกับแนวการสูบของตัวเอง ลองดู P3 ถ้าอยากได้แบตมากกว่า วัตต์สูงกว่า และเปลี่ยนค่าโอห์มได้จากหัวพอตหัวเดียว G4 จะเหมาะกว่า",
        ],
      },
      {
        heading: "สรุปสั้น ๆ ก่อนเลือก",
        paragraphs: [
          "ถ้าอยากได้จอไว้ดูค่าต่าง ๆ และอยากได้สามค่าโอห์มจากหัวพอตหัวเดียว ลองดู G4 ถ้าอยากได้แบตเท่า G4 ในตัวเครื่องที่เล็กและเบากว่า โดยไม่ต้องมีจอ ลองดู G4 mini",
          "ถ้าอยากได้เครื่องที่เบาที่สุดในสี่รุ่นและใช้ง่าย หยิบขึ้นมาก็สูบได้เลย ลองดู G3 mini และถ้าอยากได้จอทัชเต็มจอกับการตั้งกราฟวัตต์เอง ลองดู P3",
          "ราคาของแต่ละรุ่นดูได้ที่หน้าสินค้าของรุ่นนั้น หรือดูทุกรุ่นของแบรนด์ได้ที่หน้า VOOPOO ถ้ากำลังเทียบ ARGUS G4 กับ Caliburn อยู่ อ่าน [ARGUS G4 vs Caliburn G5](/guides/argus-g4-vs-caliburn-g5) ต่อได้",
        ],
      },
    ],
    faq: [
      { question: "ARGUS G4 กับ G4 mini ต่างกันยังไง", answer: "แบต 1650mAh เท่ากันและใช้หัวพอต Multi-Ohm เหมือนกัน G4 มีจอ HD 0.85 นิ้ว ปรับได้ 5–35 วัตต์ และกดปุ่มเพื่อใช้ 0.4 โอห์มได้อีกค่า ส่วน G4 mini ไม่มีจอ วัตต์อยู่ที่ 5–30 วัตต์ ใช้ได้สองค่าโอห์ม และเบากว่าที่ 56 กรัม" },
      { question: "ARGUS G4 mini กับ G3 mini ต่างกันยังไง", answer: "G4 mini แบต 1650mAh มีปุ่มเลื่อนปรับลม และกลับด้านหัวพอตเพื่อสลับ 0.7 กับ 1.0 โอห์มได้ ส่วน G3 mini แบต 1350mAh ช่องลมคงที่ เครื่องปรับวัตต์ให้เองตามหัวพอต และเบากว่าที่ 40.85 กรัม" },
      { question: "VOOPOO ARGUS รุ่นไหนดี", answer: "ขึ้นอยู่กับว่าอยากได้อะไร ถ้าอยากได้จอกับสามค่าโอห์มจากหัวพอตหัวเดียว ลองดู G4 ถ้าอยากได้แบตเท่ากันในตัวที่เล็กกว่า ลองดู G4 mini ถ้าอยากได้เครื่องที่เบาและใช้ง่าย ลองดู G3 mini และถ้าอยากได้จอทัชเต็มจอ ลองดู P3" },
      { question: "ARGUS P3 กับ G4 ต่างกันยังไง", answer: "P3 มีจอทัชเต็มจอ 2.01 นิ้ว ตั้งกราฟวัตต์เองได้ แบต 1500mAh ปรับได้ 5–30 วัตต์ ส่วน G4 มีจอ HD 0.85 นิ้ว สั่งงานด้วยปุ่มเดียว แบต 1650mAh ปรับได้ 5–35 วัตต์ และเปลี่ยนได้สามค่าโอห์มจากหัว Multi-Ohm หัวเดียว" },
      { question: "ARGUS ใช้หัวพอตร่วมกันได้ไหม", answer: "ได้เกือบทุกรุ่น VOOPOO ระบุว่า G4 · G4 mini และ P3 ใช้หัวพอตตระกูล ARGUS ร่วมกันได้ เช่น หัว Multi-Ohm ใช้ได้ทั้ง G4 และ G4 mini ส่วน G3 mini ใช้หัวแบบเติมด้านบนช่วง 0.4–1.0 โอห์ม และหัว Top Fill Cartridge V2 อยู่ในรายการของทั้งสี่รุ่น สำหรับ P3 กับ G3 mini ให้เช็คค่าโอห์มและวัตต์ของหัวพอตให้ตรงกับเครื่องก่อนใช้" },
    ],
    relatedProductSlugs: ["argus-g4", "argus-g4-mini", "argus-g3-mini", "argus-p3"],
  },
  {
    // Round "SEO all keys" batch 6 (SEO_LANDSCAPE §9.2 #7 — "พอตของแท้ ดูยังไง · เช็คพอตของแท้ · ซื้อพอตออนไลน์ยังไงไม่โดนของปลอม"):
    // each maker's own check page, opened by the researcher / Friday 16/10 (_incoming/seo-keys/authenticity-research.md).
    // A failed check = BSOT §12 "Authenticity" (owner item 67, 16/10): video + result within 7 days, the shop reviews, then
    // replaces or refunds — the only refund case. No relatedProductSlugs (six brands — LESSONS 35). INFY / Esko Bar brand
    // links added 20/10 (owner lifted the 22/10 hold; both brands now carry several products, so the brand page, not one model).
    id: "checking-a-genuine-pod",
    slug: "checking-a-genuine-pod",
    title: "พอตของแท้ ดูยังไง เช็คเองได้ที่เว็บทางการของแบรนด์",
    dek: "พอตของแท้ดูยังไง ร้านแนะนำให้เช็คกับเว็บทางการของแบรนด์นั้นเอง บทความนี้รวมหน้าเช็คของแต่ละแบรนด์ไว้ให้ พร้อมวิธีใช้ และสิ่งที่ควรทำเมื่อซื้อพอตออนไลน์",
    category: "buying-guide",
    readingTimeMin: 5,
    publishedAt: "2026-10-16",
    thaiOnly: true,
    body: [
      {
        heading: "พอตของแท้ ดูยังไง",
        paragraphs: [
          "พอตของแท้ดูยังไง วิธีที่ทางร้านแนะนำคือเช็คกับเว็บทางการของแบรนด์นั้นเอง หลายแบรนด์ใส่รหัสหรือ QR code มากับกล่อง แล้วเปิดหน้าเว็บไว้ให้ลูกค้าเช็คเองได้ บางแบรนด์ใช้วิธีถ่ายรูปฉลากรับรองบนกล่องแทนการกรอกรหัส",
          "ถ้าอยากเช็คพอตของแท้ด้วยตัวเอง บทความนี้รวมวิธีที่แต่ละแบรนด์บอกไว้บนเว็บของตัวเอง ได้แก่ UWELL · RELX · INFY · SALTHUB · Esko Bar และ VOOPOO ทุกลิงก์พาไปที่เว็บของแบรนด์โดยตรง ส่วนยี่ห้ออื่นบนเว็บเรา ทักไลน์ @okm24 ถามร้านได้ว่าเช็คทางไหน",
          "ร้านแนะนำให้เช็คทันทีที่ได้รับของ ก่อนเริ่มใช้ และเก็บกล่องไว้จนเช็คเสร็จ เพราะหลายแบรนด์ติดรหัสหรือฉลากไว้ที่กล่อง",
        ],
      },
      {
        heading: "UWELL เช็คด้วยรหัสหรือ QR code",
        paragraphs: [
          "ถ้าใช้ Caliburn หรือสินค้าอื่นของ UWELL เช็คได้ที่หน้า [myuwell.com/verify](https://www.myuwell.com/verify) ซึ่งเป็นหน้าเช็คของแท้ของ UWELL เอง",
          "หน้านี้เช็คได้สองทาง ทางแรกคือพิมพ์รหัสลงในช่อง โดยพิมพ์ติดกันทั้งชุด ตัดช่องว่างและขีดออก แล้วกด Submit ทางที่สองคือขูดแถบเคลือบออก แล้วสแกน QR code ที่อยู่ข้างใต้ ถ้าเป็นของแท้ หน้าเว็บจะขึ้นข้อความยืนยันว่าเป็นรหัสของแท้",
          "หน้าเช็คของ UWELL บอกแค่วิธีกรอก ส่วนรหัสอยู่ตรงไหนของกล่อง ถ้าหาไม่เจอ ทักไลน์ถามร้านได้",
        ],
      },
      {
        heading: "RELX เช็คด้วยรหัส 14 หลัก หรือสแกน QR code",
        paragraphs: [
          "RELX เปิดหน้าเช็คไว้ที่ [relxnow.com/pages/verify](https://relxnow.com/pages/verify) ที่ข้างกล่องจะมีรหัส 14 หลัก พิมพ์รหัสนี้ลงในช่อง แล้วกด Verify",
          "อีกทางคือสแกน QR code บนพอต โดยสแกนค้างไว้ประมาณ 3–5 วินาที",
        ],
      },
      {
        heading: "INFY ขูดสติกเกอร์ซีเรียลแล้วสแกน QR code",
        paragraphs: [
          "[INFY](/brands/infy) ติดสติกเกอร์ซีเรียลไว้ที่กล่อง ขูดออกแล้วจะเจอ QR code ให้สแกน แล้วกรอกรหัสบนหน้าเช็คของ INFY ที่ [infy.my/authentication](https://www.infy.my/authentication/)",
          "INFY บอกไว้ว่าสินค้าแต่ละชิ้นมีรหัสเฉพาะของตัวเอง รหัสบนกล่องจึงใช้เช็คได้เฉพาะชิ้นนั้น",
        ],
      },
      {
        heading: "SALTHUB และ Esko Bar เช็คด้วยการถ่ายรูป",
        paragraphs: [
          "SALTHUB เจ้าของตระกูล M Bar · M Switch และ Zero แนะนำให้ดูเครื่องหมายกันปลอมและฉลากรับรองบนกล่อง แล้วเช็คต่อที่หน้า [salthub.com/authenticate](https://www.salthub.com/authenticate/)",
          "หน้าเช็คของ SALTHUB ใช้การถ่ายรูปแทนการกรอกรหัส ให้ถ่ายรูปฉลากรับรองให้ชัดและซูมให้พอดี โดยต้องถ่ายจากตัวฉลากจริงบนกล่อง ไม่ใช่ถ่ายจากรูปบนหน้าจอ เมื่อภาพชัดพอ ระบบจะถ่ายให้เอง",
          "[Esko Bar](/brands/esko-bar) ใช้ระบบเช็คแบบถ่ายรูปตัวเดียวกับ SALTHUB อยู่บนหน้าเช็คของแท้ที่ [eskobarvape.com/verify](https://eskobarvape.com/verify) เปิดหน้านี้แล้วทำตามขั้นที่ขึ้นบนหน้าได้เลย",
        ],
      },
      {
        heading: "VOOPOO มีสติกเกอร์รหัสสองแบบ",
        paragraphs: [
          "สินค้าของ VOOPOO มีสติกเกอร์รหัสกันปลอม และ VOOPOO บอกไว้ว่าสติกเกอร์นี้มีสองแบบ ซึ่งเป็นของแท้ทั้งสองแบบ รหัสนี้เช็คได้ที่เว็บของ VOOPOO ตามที่อธิบายไว้ใน[หน้ารหัสกันปลอมของ VOOPOO](https://shop.voopoo.com/pages/security-code)",
        ],
      },
      {
        heading: "ก่อนกรอกรหัส ดูชื่อเว็บให้ตรงก่อน",
        paragraphs: [
          "ก่อนกรอกรหัสหรือถ่ายรูปทุกครั้ง ร้านแนะนำให้ดูชื่อเว็บในแถบด้านบนของเบราว์เซอร์ ว่าตรงกับเว็บของแบรนด์ที่ลิงก์ไว้ในบทความนี้ เพราะบางชื่อเว็บคล้ายกันมาก แต่เป็นของเจ้าอื่น",
          "ตัวอย่างเช่น relx.com เป็นเว็บของบริษัทอื่นที่ชื่อเหมือนกัน เว็บของ RELX ที่ทำพอตคือ relxnow.com และเว็บของ SALTHUB สะกดว่า salthub.com",
          "ถ้าสแกน QR code แล้วเปิดไปเจอเว็บอื่นที่ต่างจากในบทความนี้ ลองเปิดหน้าเช็คจากลิงก์ในบทความนี้ แล้วกรอกรหัสเองแทน",
        ],
      },
      {
        heading: "ซื้อพอตออนไลน์ยังไงไม่โดนของปลอม",
        paragraphs: [
          "ร้านเราขายของแท้ และอยากให้คุณมั่นใจได้ด้วยตัวเอง ได้ของแล้วเช็คกับเว็บของแบรนด์ตามหัวข้อข้างบนได้ทันที ไม่ต้องเชื่อแค่คำของร้าน",
          "ถ่ายคลิปตอนแกะกล่องไว้ทุกครั้ง ตั้งแต่ก่อนแกะจนแกะเสร็จ ให้เห็นกล่องและตัวสินค้าต่อเนื่องในคลิปเดียว คลิปนี้เก็บสภาพกล่อง สติกเกอร์ และฉลาก ตอนที่ของถึงมือคุณไว้ และยังเป็นหลักฐานว่าพัสดุนั้นส่งมาจากร้านเราจริง",
          "ถ้าของที่ได้รับมีปัญหา เช่น ผิดรุ่น ผิดสี ผิดกลิ่น หรือเครื่องเสียตั้งแต่แกะ ร้านใช้คลิปเดียวกันนี้พิจารณาเคลม โดยต้องแจ้งภายใน 7 วันนับจากวันที่ได้รับของ",
          "ถ้าผลเช็คต่างจากที่แบรนด์บอกไว้ ลองกรอกรหัสใหม่ให้ตรงทีละตัว และดูชื่อเว็บอีกครั้ง หากลองแล้วเช็คก็ยังไม่ผ่าน ส่งแคปหน้าจอผลเช็คพร้อมคลิปตอนแกะกล่องมาทางไลน์ @okm24 ภายใน 7 วันนับจากวันที่ได้รับของ ร้านจะตรวจสอบให้ แล้วแจ้งกลับว่าจะเปลี่ยนของใหม่หรือคืนเงินให้ กรณีนี้เป็นกรณีเดียวที่ร้านคืนเงิน เงื่อนไขทั้งหมดอยู่ที่[นโยบายเคลม](/warranty)",
          "ถ้ากำลังจะสั่ง ทักไลน์ถามร้านก่อนได้ว่ารุ่นที่สนใจเช็คของแท้ทางไหน ร้านรับสั่งซื้อทางไลน์ @okm24 ขั้นตอนทั้งหมดอยู่ที่[วิธีสั่งซื้อ](/how-to-order)",
        ],
      },
    ],
    faq: [
      { question: "พอตของแท้ ดูยังไง", answer: "เช็คกับเว็บทางการของแบรนด์นั้นเอง UWELL · RELX และ INFY ให้กรอกรหัสหรือสแกน QR code ที่มากับกล่องหรือตัวสินค้า ส่วน SALTHUB กับ Esko Bar ใช้วิธีถ่ายรูปเช็คแทน ลิงก์หน้าเช็คของแต่ละแบรนด์อยู่ในบทความนี้" },
      { question: "เช็คพอตของแท้ได้ที่ไหน", answer: "ที่เว็บของแต่ละแบรนด์ UWELL อยู่ที่ myuwell.com/verify · RELX อยู่ที่ relxnow.com/pages/verify · INFY อยู่ที่ infy.my/authentication · SALTHUB อยู่ที่ salthub.com/authenticate · Esko Bar อยู่ที่ eskobarvape.com/verify และ VOOPOO เช็ครหัสได้ที่เว็บของ VOOPOO" },
      { question: "Marbo เช็คของแท้ยังไง", answer: "M Bar ที่หลายคนเรียกว่า Marbo เป็นของ SALTHUB เช็คได้ที่ salthub.com/authenticate โดยถ่ายรูปฉลากรับรองตัวจริงบนกล่องให้ชัดและซูมให้พอดี เมื่อภาพชัดพอ ระบบจะถ่ายให้เอง" },
      { question: "RELX เช็คของแท้ยังไง", answer: "พิมพ์รหัส 14 หลักที่ข้างกล่องลงในหน้า relxnow.com/pages/verify แล้วกด Verify หรือสแกน QR บนพอตค้างไว้ประมาณ 3–5 วินาที เว็บของ RELX คือ relxnow.com ส่วน relx.com เป็นเว็บของบริษัทอื่นที่ชื่อเหมือนกัน" },
      { question: "ซื้อพอตออนไลน์ยังไงไม่โดนของปลอม", answer: "ได้ของแล้วเช็คกับเว็บของแบรนด์ทันทีก่อนเริ่มใช้ ดูชื่อเว็บให้ตรงก่อนกรอกรหัส และถ่ายคลิปตอนแกะกล่องไว้ทุกครั้ง ถ้าเช็คแล้วมีข้อสงสัย ทักไลน์ @okm24 พร้อมผลเช็คและคลิปมาให้ร้านดูได้ทุกวัน ตลอด 24 ชั่วโมง" },
      { question: "เช็คของแท้ไม่ผ่าน ต้องทำยังไง", answer: "ลองกรอกรหัสใหม่ให้ตรงทีละตัว และดูว่าเปิดหน้าเช็คจากเว็บของแบรนด์จริง ถ้ายังเช็คไม่ผ่าน ส่งแคปหน้าจอผลเช็คพร้อมคลิปตอนแกะกล่องมาทางไลน์ @okm24 ภายใน 7 วันนับจากวันที่ได้รับของ ร้านจะตรวจสอบให้ แล้วแจ้งกลับว่าจะเปลี่ยนของใหม่หรือคืนเงินให้ ซึ่งเป็นกรณีเดียวที่ร้านคืนเงิน" },
    ],
  },
  {
    // Round "SEO all keys" §9.6 row 9 / §9.7 (AC 16/10: iluma รีเซ็ต 9 · ชาร์จไม่เข้า 6 · ไฟแดง 3 · วิธีใช้ 2). The shop sells ILUMA i
    // (iqosheet-18) and ILUMA i PRIME (iqosheet-16), so the article is about those two. Every fact = an iqos.com support page read
    // 16/10 (_incoming/seo-images/iqos-research.md): reset / battery / charging / how to use = gb "get to know your IQOS ILUMA i";
    // screen symbols = ch ILUMA i FAQ (touch-screen part: i PRIME + i) + me ILUMA i PRIME troubleshooting (also the holder-light
    // steps); Pause = ch ILUMA i FAQ (i + i PRIME, Performance Mode, first 3 min / 8 puffs); the red light = gb "device lights meaning" (original ILUMA). No i PRIME-specific reset page was found → the
    // reset steps are written for ILUMA i only. Official pages disagree on the original ILUMA's temperature range → only the i
    // range (0–40 °C) is written. No health or safety claims. Wording: thai-copy pass 16/10 (locked words USB-C · หัวชาร์จ ·
    // ขั้วสัมผัส · จอทัช · รุ่นก่อน · พัฟ).
    id: "iqos-iluma-i-reset-and-charging",
    slug: "iqos-iluma-i-reset-and-charging",
    title: "IQOS ILUMA i รีเซ็ตยังไง ชาร์จไม่เข้า สัญลักษณ์บนจอหมายถึงอะไร",
    dek: "IQOS ILUMA i รีเซ็ตได้ด้วยการวาง Holder ไว้ใน Pocket Charger แล้วกดปุ่มค้างไว้ 10 วินาที บทความนี้รวมความหมายของสัญลักษณ์บนจอ วิธีชาร์จ สิ่งที่ควรเช็คเมื่อชาร์จไม่เข้า และวิธีใช้ทีละขั้น โดยอ้างอิงจากหน้าช่วยเหลือของ IQOS",
    category: "maintenance",
    readingTimeMin: 5,
    publishedAt: "2026-10-16",
    thaiOnly: true,
    body: [
      {
        heading: "IQOS ILUMA i รีเซ็ตยังไง",
        paragraphs: [
          "IQOS ILUMA i รีเซ็ตด้วยการวาง Holder ไว้ใน Pocket Charger แล้วกดปุ่มของ Pocket Charger ค้างไว้ 10 วินาที เมื่อไฟดับ กะพริบสองครั้ง แล้วติดขึ้นมาใหม่ แปลว่ารีเซ็ตเสร็จ ถ้าเครื่องของคุณเป็น ILUMA i PRIME แนะนำให้ดูวิธีรีเซ็ตในคู่มือที่มากับกล่อง",
          "บทความนี้เขียนสำหรับ [IQOS ILUMA i](/products/iqosheet-18) และ [IQOS ILUMA i PRIME](/products/iqosheet-16) ที่มีบนเว็บเรา ข้อมูลทั้งหมดมาจาก[หน้าช่วยเหลือของ IQOS](https://www.iqos.com/gb/en/support/faq/get-to-know-your-iqos-ilumai.html) ถ้าเครื่องของคุณเป็นรุ่นอื่น แนะนำให้ดูคู่มือของรุ่นนั้นแทน เพราะวิธีกดและความหมายของไฟในแต่ละรุ่นไม่เหมือนกัน ถ้ายังเลือกรุ่นอยู่ อ่านต่อได้ที่ [ILUMA i ONE vs ILUMA i ต่างกันยังไง](/guides/iqos-iluma-i-one-vs-iluma-i)",
        ],
      },
      {
        heading: "สัญลักษณ์บนจอ ILUMA i หมายถึงอะไร",
        paragraphs: [
          "ILUMA i และ ILUMA i PRIME มีจอทัชบนตัว Holder เมื่อเครื่องมีอะไรผิดปกติ จอจะขึ้นสัญลักษณ์ให้เห็น ความหมายของแต่ละแบบตามที่ IQOS อธิบายไว้มีดังนี้",
          "ตัว E กะพริบ 3 ครั้ง แปลว่ามีแม่เหล็กอยู่ใกล้เครื่อง เครื่องทำงานผิดปกติ หรืออัปเดตเฟิร์มแวร์ไม่สำเร็จ วิธีแก้คือรีเซ็ตเครื่อง",
          "เลข 0 กะพริบ 3 ครั้ง แปลว่าแบตของ Holder เหลือน้อย ให้วาง Holder ลงใน Pocket Charger ที่ยังมีแบตเพื่อชาร์จ",
          "เส้นแนวตั้งสองเส้น เส้นหนึ่งอยู่ด้านบน อีกเส้นอยู่ด้านล่าง สลับข้างกันสามครั้ง แปลว่าอุณหภูมิอยู่นอกช่วงที่เครื่องใช้งานได้ คือ 0–40 องศาเซลเซียส",
          "เส้นแนวนอนที่มีวงกลมอยู่ข้างใต้ แปลว่าเครื่องถูกล็อกอยู่ ปลดล็อกได้ในแอป IQOS ส่วนเส้นแนวนอนแบบคลื่นสามเส้น แปลว่า AutoStart ถูกปิดไว้ เปิดได้ในแอปเช่นกัน",
        ],
      },
      {
        heading: "ILUMA ไฟแดงกะพริบ ทำยังไง",
        paragraphs: [
          "ไฟแดงกะพริบที่ Holder เป็นไฟของ ILUMA รุ่นก่อนที่ไม่มีจอ IQOS อธิบายว่าไฟนี้หมายถึงเครื่องมีปัญหาและควรรีเซ็ต และแม่เหล็กที่อยู่ใกล้เครื่องก็ทำให้ขึ้นไฟแดงได้เช่นกัน จึงไม่ควรวาง Holder ไว้ใกล้แม่เหล็กระหว่างใช้",
          "ส่วน ILUMA i และ ILUMA i PRIME ให้ดูสัญลักษณ์บนจอตามหัวข้อก่อนหน้า ถ้ารีเซ็ตแล้วยังขึ้นอยู่ ทักมาที่ไลน์ @okm24 แล้วเล่าอาการให้ร้านฟังได้เลย",
        ],
      },
      {
        heading: "ดูยังไงว่าแบตเหลือเท่าไหร่",
        paragraphs: [
          "กดปุ่มของ Pocket Charger สั้น ๆ แล้วดูว่าไฟติดกี่ดวง ถ้าติด 4 ดวง แบตเหลือมากกว่า 75% ถ้าติดดวงเดียว แบตเหลือน้อยกว่า 25% และถ้าไฟสีส้มกะพริบ 3 ครั้ง แปลว่าแบตหมดแล้ว ต้องชาร์จก่อนใช้",
          "ส่วนแบตของ Holder ดูได้ด้วยการเอียง Holder เข้าหาตัว หรือแตะจอสั้น ๆ",
        ],
      },
      {
        heading: "ชาร์จ ILUMA i ยังไง",
        paragraphs: [
          "IQOS แนะนำให้ชาร์จด้วยหัวชาร์จ 5V 2A แบบ USB-C คู่กับสาย USB-C โดย Pocket Charger ใช้เวลาชาร์จจนเต็มประมาณ 2 ชั่วโมง 15 นาที และจะวาง Holder ไว้ข้างในระหว่างชาร์จหรือไม่ก็ได้",
          "ไม่จำเป็นต้องรอให้เต็มทุกครั้งก่อนใช้ แต่ครั้งแรก IQOS แนะนำให้ชาร์จจนเต็มก่อน",
        ],
        image: SECTION_IMAGES.ilumaI,
      },
      {
        heading: "ILUMA i ชาร์จไม่เข้า เช็คอะไรบ้าง",
        paragraphs: [
          "ถ้าชาร์จช้าหรือชาร์จไม่ขึ้นเลย ให้ใช้หัวชาร์จและสายของ IQOS หรือหัวชาร์จทั่วไปที่จ่ายไฟ 5V 2A และมีเครื่องหมายรับรองความปลอดภัย แล้วดูว่าช่องชาร์จของเครื่องสะอาด ไม่มีฝุ่นหรือเศษอะไรติดอยู่",
          "ถ้าไฟของ Holder ไม่ติด หน้าช่วยเหลือของ i PRIME แนะนำให้ไล่เช็คตามลำดับนี้ ดูก่อนว่ามีไฟสีขาวติดนิ่งบน Pocket Charger อย่างน้อยหนึ่งดวง แล้วเช็ดขั้วสัมผัสให้สะอาด วาง Holder กลับเข้าไปและรอจนไฟสีขาวติดนิ่ง จากนั้นหยิบ Holder ออกมาแล้วกดปุ่มบน Holder สั้น ๆ",
          "ถ้าจอทัชไม่ตอบสนอง ให้ถอดถุงมือออกก่อน เช็ดนิ้วและหน้าจอให้สะอาดและแห้ง แล้วดูว่าจอไม่มีรอยร้าว ถ้าจอยังขึ้นไฟหรือสัญลักษณ์อยู่ ให้รีเซ็ตเครื่อง",
        ],
      },
      {
        heading: "วิธีใช้ ILUMA i ทีละขั้น",
        paragraphs: [
          "เริ่มจากกดปุ่มของ Pocket Charger ค้างไว้ 4 วินาทีเพื่อเปิดเครื่อง จากนั้นวาง Holder ลงไปแล้วปิดฝาเพื่อชาร์จ",
          "เสียบก้าน TEREA เข้าไปใน Holder ให้ลึกถึงเส้นบนก้นกรอง จนรู้สึกว่า Holder สั่น จากนั้นเครื่องจะเริ่มอุ่นเอง หรือจะปัดขึ้นบนจอเพื่อเริ่มก็ได้ การอุ่นใช้เวลาประมาณ 20 วินาที",
          "เมื่อ Holder สั่นอีกครั้งก็เริ่มสูบได้ วงไฟบนจอจะนับถอยหลังให้เห็นเวลาที่เหลือ และ Holder จะสั่นเตือนอีกครั้งเมื่อเหลือ 30 วินาทีสุดท้าย หรือ 2 พัฟสุดท้าย",
          "สูบเสร็จแล้วดึงก้านออกไปทิ้ง แล้ววาง Holder กลับเข้า Pocket Charger เพื่อชาร์จต่อ",
        ],
      },
      {
        heading: "ILUMA i หยุดพักระหว่างสูบได้",
        paragraphs: [
          "ILUMA i และ ILUMA i PRIME มีโหมดหยุดพัก ใช้ได้ในโหมด Performance ซึ่งเป็นค่าเริ่มต้น ในช่วง 3 นาทีแรกหรือ 8 พัฟแรกของการสูบ และพักได้หนึ่งครั้งจากการสูบสองครั้งที่ต่อกัน ปัดลงให้สุดความยาวจอเพื่อหยุดพัก จอจะขึ้นเส้นแนวตั้งสั้นสองเส้นที่ด้านบน เมื่อจะสูบต่อให้ปัดขึ้นให้สุดความยาวจอ เครื่องจะอุ่นใหม่ก่อนแล้วจึงสูบต่อได้ พักได้นานสุด 8 นาที เกินจากนั้นเครื่องจะปิดเอง",
        ],
      },
    ],
    relatedProductSlugs: ["iqosheet-18", "iqosheet-16"],
    faq: [
      { question: "IQOS ILUMA i รีเซ็ตยังไง", answer: "วาง Holder ไว้ใน Pocket Charger แล้วกดปุ่มค้างไว้ 10 วินาที เมื่อไฟดับ กะพริบสองครั้ง แล้วติดขึ้นมาใหม่ แปลว่ารีเซ็ตเสร็จแล้ว" },
      { question: "ILUMA ไฟแดงกะพริบ หมายถึงอะไร", answer: "สำหรับ ILUMA รุ่นก่อนที่ไม่มีจอ ไฟแดงกะพริบที่ Holder หมายถึงเครื่องมีปัญหาและควรรีเซ็ต ส่วน ILUMA i และ ILUMA i PRIME ให้ดูสัญลักษณ์บนจอ เช่น ตัว E ที่กะพริบสามครั้ง ซึ่งแก้ได้ด้วยการรีเซ็ตเช่นกัน" },
      { question: "ILUMA i ชาร์จไม่เข้า ทำยังไง", answer: "เช็คว่าใช้หัวชาร์จและสายของ IQOS หรือหัวชาร์จที่จ่ายไฟ 5V 2A และมีเครื่องหมายรับรองความปลอดภัย และดูว่าช่องชาร์จของเครื่องสะอาด ไม่มีฝุ่นหรือเศษอะไรติดอยู่" },
      { question: "ILUMA i ชาร์จนานแค่ไหน", answer: "IQOS ระบุว่าการชาร์จ Pocket Charger จนเต็มใช้เวลาประมาณ 2 ชั่วโมง 15 นาที เมื่อใช้หัวชาร์จ 5V 2A แบบ USB-C" },
      { question: "เลข 0 กะพริบบนจอ ILUMA i หมายถึงอะไร", answer: "แปลว่าแบตของ Holder เหลือน้อย ให้วาง Holder ลงใน Pocket Charger ที่ยังมีแบตเพื่อชาร์จ" },
    ],
  },
  {
    // Round SEO line 2 (autocomplete 19/10: "terea กลิ่น ไหน ดี" · "terea กลิ่น ไหน หอม" · "terea แต่ละ กลิ่น" ·
    // "terea sienna / sun pearl / oasis pearl กลิ่น" · "terea คืออะไร"). Flavour notes and the four groups (classic tobacco ·
    // menthol · clove · Pearl capsule) = IQOS Indonesia flavour guide
    // https://www.iqos.com/id/en/news/information/find-the-terea-tobacco-stick-flavor-variant-that-suits-for-you.html
    // (names and line-ups differ by country — said once in the text). Only flavours on our TEREA page (iqosheet-15); Emerald
    // Edition left out (official descriptions conflict). Dimensions Yugen sits under menthol because IQOS lists it there.
    // "Black Green = เย็นแรง" is IQOS's own wording, written as theirs, no "ที่สุด" (no numbers). IQOS Egypt strength 7/10
    // (Sienna · Blue) not used: "ความเข้มข้น" is locked to nicotine strength (THAI_STYLE §3). 1 pack = 20 sticks; ILUMA-only =
    // product page row; LAMBDA i8 takes TEREA = LAMBDA's own page (lambdasmoke.com), said as LAMBDA's claim. No price, no
    // stock, no health claims. Wording: thai-copy 19/10.
    id: "choosing-a-terea-flavor",
    slug: "choosing-a-terea-flavor",
    title: "TEREA กลิ่นไหนดี แต่ละกลิ่นต่างกันยังไง",
    dek: "TEREA กลิ่นไหนดี เริ่มจากกลุ่มที่ชอบก่อน IQOS แบ่งกลิ่นไว้สี่กลุ่ม คือ ยาสูบคลาสสิก เมนทอล กานพลู และแคปซูล บทความนี้เล่าว่าแต่ละกลิ่นต่างกันยังไง วิธีบีบแคปซูลของกลิ่น Pearl และ TEREA ใช้กับเครื่องไหนได้บ้าง",
    category: "buying-guide",
    readingTimeMin: 6,
    publishedAt: "2026-10-19",
    thaiOnly: true,
    body: [
      {
        heading: "TEREA กลิ่นไหนดี เริ่มจากกลุ่มที่ชอบก่อน",
        paragraphs: [
          "TEREA กลิ่นไหนดี ไม่มีคำตอบเดียว เพราะแต่ละคนชอบรสไม่เหมือนกัน ร้านเราจึงแนะนำให้เริ่มจากกลุ่มที่ชอบก่อน IQOS แบ่งกลิ่นของ TEREA ไว้สี่กลุ่ม คือ ยาสูบคลาสสิก เมนทอล กานพลู และแคปซูล แล้วค่อยเลือกกลิ่นที่ชอบในนั้นอีกที",
          "คำอธิบายกลิ่นในบทความนี้มาจาก[หน้าแนะนำกลิ่น TEREA ของ IQOS อินโดนีเซีย](https://www.iqos.com/id/en/news/information/find-the-terea-tobacco-stick-flavor-variant-that-suits-for-you.html) ชื่อกลิ่นและไลน์อัพของ TEREA ต่างกันไปตามประเทศ เราจึงยกมาเฉพาะกลิ่นที่อยู่บนหน้าสินค้า [TEREA](/products/iqosheet-15) ของเว็บเรา และเขียนชื่อเป็นภาษาอังกฤษให้ตรงกับตัวเลือกบนหน้าสินค้า",
        ],
      },
      {
        heading: "กลุ่มยาสูบคลาสสิก: Bronze · Sienna · Dimensions Apricity",
        paragraphs: [
          "กลุ่มนี้เหมาะกับคนที่ชอบรสยาสูบเป็นหลัก และไม่ได้มองหาความเย็นของเมนทอล แต่ละกลิ่นต่างกันที่กลิ่นที่ตามมากับรสยาสูบ",
          "Bronze ให้รสยาสูบนุ่ม ๆ มีกลิ่นโกโก้และผลไม้แห้งตามมา Sienna เป็นยาสูบที่มีโทนไม้และกลิ่นชาผสมอยู่ ส่วน Dimensions Apricity เพิ่มกลิ่นผลไม้ โทนไม้ และความนุ่มแบบครีมเข้าไปในรสยาสูบ",
        ],
      },
      {
        heading: "กลุ่มเมนทอล: TEREA สายเย็นแบบไหนดี",
        paragraphs: [
          "กลุ่มนี้มีความเย็นของเมนทอลเป็นหลัก แต่ละกลิ่นต่างกันที่สิ่งที่มาคู่กับความเย็น Blue เป็นเมนทอลเย็นคู่กับเปปเปอร์มินต์ และมีความนุ่มแบบครีม เหมาะกับคนที่อยากได้เย็นแบบมินต์โดยไม่มีผลไม้มาปน",
          "ถ้าชอบเย็นคู่กับผลไม้เขียว Green และ Bright Wave ให้ความเย็นของเมนทอลกับผลไม้เขียวสด ซึ่ง IQOS อธิบายสองกลิ่นนี้ไว้ใกล้กันมาก ส่วน Black Green ที่ IQOS อธิบายว่าเป็นเมนทอลเย็นแรงคู่กับผลไม้เขียว เหมาะกับคนที่อยากได้ความเย็นชัดกว่า",
          "ถ้าชอบเย็นคู่กับผลไม้สีเข้ม Purple Wave เป็นเมนทอลเย็นกับผลไม้ป่าสีเข้ม และ Black Ruby เป็นเมนทอลเย็นกับเรดเบอร์รี่ มีกลิ่นดอกไม้ตามมา ส่วน Dimensions Yugen ให้รสยาสูบกับผลไม้และดอกไม้ที่สดชื่น IQOS จัดไว้ในกลุ่มเมนทอล ถึงคำอธิบายจะไม่ได้พูดถึงความเย็นตรง ๆ",
        ],
      },
      {
        heading: "กลุ่มกานพลู: Golden · Auburn · Berrine · Mulint Edition",
        paragraphs: [
          "ทุกกลิ่นในกลุ่มนี้มีกานพลูอยู่ในรสยาสูบ ต่างกันที่กลิ่นที่มาคู่กัน Golden Edition เป็นยาสูบละมุนกับกานพลูอินโดนีเซีย และมีกลิ่นพลัมหมัก ส่วน Auburn Edition มีกานพลูคู่กับแอปริคอตและวานิลลา",
          "ถ้าอยากได้กานพลูคู่กับความเย็น Berrine Edition มีกานพลูกับเมนทอลเย็น และมีกลิ่นผลไม้กับดอกไม้ ส่วน Mulint Edition มีกานพลูกับเมนทอลเย็นคู่กับเบอร์รี่",
        ],
      },
      {
        heading: "กลุ่มแคปซูล Pearl: บีบก่อนใช้",
        paragraphs: [
          "กลิ่นที่ชื่อลงท้ายด้วย Pearl มีแคปซูลอยู่ในก้นกรอง ก่อนใช้ให้บีบที่ก้นกรองจนแคปซูลแตกและได้ยินเสียงคลิก เพื่อให้กลิ่นในแคปซูลออกมา",
          "Oasis Pearl และ Sun Pearl ให้รสยาสูบ และปลายก้านมีความหวาน Oasis Pearl มีกลิ่นผลไม้เขตร้อน ส่วน Sun Pearl มีกลิ่นผลไม้เขียวรสหวาน",
          "Passion Fruit Pearl มีรสยาสูบกับเมนทอล แคปซูลเป็นกลิ่นเสาวรส และมีกานพลูอยู่เล็กน้อย ส่วน Strawberry Pearl เป็นยาสูบละมุนกับแคปซูลกลิ่นสตรอเบอร์รี่และโหระพา และมีกานพลูเล็กน้อยเช่นกัน",
        ],
      },
      {
        heading: "TEREA ใช้กับเครื่องไหน",
        paragraphs: [
          "TEREA 1 ซองมี 20 ก้าน และ IQOS ระบุว่าใช้กับเครื่องตระกูล ILUMA เท่านั้น บนเว็บเรามี [ILUMA i ONE](/products/iqosheet-17) · [ILUMA i](/products/iqosheet-18) และ [ILUMA i PRIME](/products/iqosheet-16) ราคาของก้านและเครื่องดูได้ที่หน้าสินค้า",
          "ถ้ายังไม่แน่ใจว่าจะเลือกรุ่นไหน ความต่างของสามรุ่นนี้อ่านได้ที่ [ILUMA i ONE vs ILUMA i ต่างกันยังไง](/guides/iqos-iluma-i-one-vs-iluma-i)",
          "อีกทางหนึ่งคือ [LAMBDA i8](/products/iqosheet-14) ซึ่งเป็นเครื่องอุ่นยาสูบของ LAMBDA ไม่ใช่เครื่องของ IQOS ตามข้อมูลบนเว็บของ LAMBDA เครื่องนี้ใช้ก้าน TEREA และ SENTIA ได้",
        ],
      },
    ],
    relatedProductSlugs: ["iqosheet-15", "iqosheet-17", "iqosheet-18", "iqosheet-16"],
    faq: [
      { question: "TEREA คืออะไร", answer: "TEREA คือก้านยาสูบของ IQOS สำหรับเครื่องอุ่นยาสูบตระกูล ILUMA 1 ซองมี 20 ก้าน และมีกลิ่นให้เลือกสี่กลุ่ม คือ ยาสูบคลาสสิก เมนทอล กานพลู และแคปซูล" },
      { question: "TEREA กลิ่นไหนหอม", answer: "ความหอมเป็นเรื่องที่แต่ละคนรู้สึกไม่เหมือนกัน ถ้าชอบกลิ่นดอกไม้ ลองดู Black Ruby หรือ Dimensions Yugen ถ้าชอบหอมหวานแบบผลไม้ ลองดู Sun Pearl หรือ Oasis Pearl และถ้าชอบหอมแบบขนม Bronze มีกลิ่นโกโก้ ส่วน Auburn Edition มีวานิลลา" },
      { question: "TEREA กลิ่นไหนเย็นแรง", answer: "ในคำอธิบายของ IQOS กลิ่นที่บอกว่าเป็นเมนทอลเย็นแรงคือ Black Green ซึ่งมาคู่กับผลไม้เขียว ถ้าอยากได้เย็นแบบมินต์ที่ไม่มีผลไม้ ลองดู Blue ที่เป็นเมนทอลกับเปปเปอร์มินต์" },
      { question: "TEREA Pearl ต้องบีบไหม", answer: "ต้องบีบ กลิ่นที่ชื่อลงท้ายด้วย Pearl มีแคปซูลอยู่ในก้นกรอง ก่อนใช้ให้บีบจนแคปซูลแตกและได้ยินเสียงคลิก เพื่อให้กลิ่นในแคปซูลออกมา" },
      { question: "TEREA Sienna · Sun Pearl · Oasis Pearl กลิ่นเป็นยังไง", answer: "Sienna เป็นยาสูบที่มีโทนไม้และกลิ่นชาผสมอยู่ Sun Pearl เป็นยาสูบที่ปลายก้านหวาน มีกลิ่นผลไม้เขียว และ Oasis Pearl เป็นยาสูบที่ปลายก้านหวาน มีกลิ่นผลไม้เขตร้อน ทั้งสอง Pearl ต้องบีบแคปซูลก่อนใช้" },
    ],
  },
  {
    // Round SEO line 2 (autocomplete 19/10: "iluma i one vs iluma i" · "iluma i one vs iluma i prime" · "iluma i one ใช้ยังไง" ·
    // "iluma i one ราคา" → answered as "ราคาดูที่หน้าสินค้า", no price typed). Model facts = IQOS Tunisia comparison
    // https://www.iqos.com/tn/fr/actualites/iqos-iluma-i/iqos-iluma-i-differences.html (confirmed by IQOS Egypt): i ONE one piece,
    // up to 20 in a row, 1 h 30 min charge, FlexPuff, auto start/stop · i = Holder + Pocket Charger, 3 in a row, 2 h 15 min,
    // touch screen, Pause, FlexPuff, FlexBattery · i PRIME = same system, more premium design, 3 in a row (2 with Pause in
    // Performance), detailed screen, Pause up to 8 min, FlexPuff +4, FlexBattery Performance/Eco in the app. Battery figures,
    // aluminium, "20 sticks per full charge" (i PRIME only) and "USB-C cable in box" (i PRIME only) = our product rows.
    // AutoStop written loosely ("หยุดเองโดยอัตโนมัติ"). i ONE how-to kept to the basics + "see the manual". LAMBDA i8 =
    // lambdasmoke.com, not IQOS, said as LAMBDA's data. "ไอคอส" not used: its one-sentence home is /brands/iqos (THAI_STYLE §2
    // layer 1). Title carries "vs" as people type it (autocomplete). Wording: thai-copy 19/10.
    id: "iqos-iluma-i-one-vs-iluma-i",
    slug: "iqos-iluma-i-one-vs-iluma-i",
    title: "IQOS ILUMA i ONE vs ILUMA i และ i PRIME ต่างไหม",
    dek: "ILUMA i ONE เป็นเครื่องชิ้นเดียว สูบต่อกันได้สูงสุด 20 ก้าน ส่วน ILUMA i และ ILUMA i PRIME มี Holder กับ Pocket Charger รวมถึงจอทัชและโหมดหยุดพัก บทความนี้เทียบสามรุ่นทีละเรื่องจากข้อมูลของ IQOS พร้อมวิธีเลือกให้ตรงกับการใช้งาน",
    category: "buying-guide",
    readingTimeMin: 6,
    publishedAt: "2026-10-19",
    thaiOnly: true,
    body: [
      {
        heading: "ILUMA i ONE กับ ILUMA i ต่างกันยังไง",
        paragraphs: [
          "ILUMA i ONE เป็นเครื่องชิ้นเดียว สูบต่อกันได้สูงสุด 20 ก้าน ส่วน ILUMA i และ ILUMA i PRIME มีสองชิ้น คือ Holder ที่ใช้สูบ กับ Pocket Charger ที่ใช้ชาร์จ Holder สูบต่อกันได้สูงสุด 3 ก้านแล้ววางกลับลงไปชาร์จ และมีจอทัชกับโหมดหยุดพักเพิ่มเข้ามา",
          "ILUMA i PRIME ใช้ระบบเดียวกับ ILUMA i แต่ดีไซน์พรีเมียมกว่า และจอแสดงข้อมูลได้ละเอียดกว่า ข้อมูลในบทความนี้มาจาก[หน้าเทียบรุ่นของ IQOS](https://www.iqos.com/tn/fr/actualites/iqos-iluma-i/iqos-iluma-i-differences.html) และหน้าสินค้าบนเว็บเรา ส่วนราคาของแต่ละรุ่นดูได้ที่หน้าสินค้า",
        ],
      },
      {
        heading: "IQOS ILUMA i ONE: เครื่องชิ้นเดียว",
        paragraphs: [
          "[ILUMA i ONE](/products/iqosheet-17) รวมทุกอย่างไว้ในเครื่องเดียว ไม่มี Holder แยก ตัวเครื่องเป็นอะลูมิเนียม แบต 1728mAh สูบต่อกันได้สูงสุด 20 ก้าน และชาร์จเต็มในประมาณ 1 ชั่วโมง 30 นาที",
          "เสียบก้านแล้วเครื่องจะเริ่มอุ่นให้เอง และหยุดเองโดยอัตโนมัติ นอกจากนี้ยังมี FlexPuff ที่ปรับจำนวนพัฟตามจังหวะการสูบ เพิ่มได้สูงสุด 4 พัฟ",
        ],
        image: SECTION_IMAGES.ilumaIOne,
      },
      {
        heading: "IQOS ILUMA i: สองชิ้น มีจอทัช",
        paragraphs: [
          "[ILUMA i](/products/iqosheet-18) มีสองชิ้น ตัว Holder ใช้สูบ แบต 300mAh ส่วนตัวชาร์จ Pocket Charger แบต 2700mAh ชาร์จ Holder หนึ่งครั้งสูบต่อกันได้สูงสุด 3 ก้าน แล้ววางกลับลงไปชาร์จต่อ ส่วน Pocket Charger ชาร์จเต็มในราว 135 นาที",
          "บน Holder มีจอทัช มีโหมดหยุดพักระหว่างสูบ มี FlexPuff และมี FlexBattery ที่เลือกได้ระหว่างโหมด Performance กับ Eco วิธีชาร์จ รีเซ็ต และความหมายของสัญลักษณ์บนจอ อ่านได้ที่ [IQOS ILUMA i รีเซ็ตยังไง ชาร์จไม่เข้า](/guides/iqos-iluma-i-reset-and-charging)",
        ],
        image: SECTION_IMAGES.ilumaI,
      },
      {
        heading: "IQOS ILUMA i PRIME: ระบบเดียวกับ i ดีไซน์พรีเมียมกว่า",
        paragraphs: [
          "[ILUMA i PRIME](/products/iqosheet-16) ใช้ระบบเดียวกับ ILUMA i คือมี Holder กับ Pocket Charger แบตก็เท่ากัน แบต 2700mAh อยู่ใน Pocket Charger และแบต 300mAh อยู่ใน Holder ชาร์จเต็มหนึ่งครั้งรองรับได้สูงสุด 20 ก้าน สิ่งที่ต่างคือดีไซน์ที่พรีเมียมกว่า และจอทัชที่แสดงข้อมูลได้ละเอียดกว่า",
          "Holder สูบต่อกันได้สูงสุด 3 ก้าน หรือ 2 ก้านถ้าเปิดโหมดหยุดพักในโหมด Performance ซึ่งพักได้นานสุด 8 นาที มี FlexPuff ที่เพิ่มได้สูงสุด 4 พัฟ และ FlexBattery ที่เลือกโหมด Performance หรือ Eco ได้ในแอป IQOS ในกล่องมีสาย USB-C มาให้ด้วย",
        ],
        image: SECTION_IMAGES.ilumaIPrime,
      },
      {
        heading: "สามรุ่นต่างกันตรงไหนบ้าง",
        paragraphs: [
          "เรื่องแรกคือจำนวนชิ้น ILUMA i ONE เป็นเครื่องชิ้นเดียว หยิบแล้วสูบได้เลย ส่วนอีกสองรุ่นต้องใช้ Holder กับ Pocket Charger คู่กัน",
          "เรื่องที่สองคือการสูบต่อเนื่อง ILUMA i ONE สูบต่อกันได้สูงสุด 20 ก้าน ส่วน Holder ของ ILUMA i และ ILUMA i PRIME สูบต่อกันได้สูงสุด 3 ก้านแล้วต้องวางกลับไปชาร์จ ทั้งนี้ตัวชาร์จของ i PRIME เมื่อชาร์จเต็มหนึ่งครั้งรองรับได้สูงสุด 20 ก้าน",
          "เรื่องที่สามคือจอทัชและโหมดหยุดพัก ซึ่งมีเฉพาะสองรุ่นที่มี Holder ส่วน FlexPuff มีครบทั้งสามรุ่น และทั้งสามรุ่นใช้ได้กับก้าน TEREA เท่านั้น เรื่องเวลาชาร์จ ILUMA i ONE ใช้ราว 90 นาที ส่วนอีกสองรุ่นชาร์จ Pocket Charger ราว 135 นาที",
        ],
      },
      {
        heading: "LAMBDA i8: อีกทางที่ไม่ใช่ IQOS",
        paragraphs: [
          "[LAMBDA i8](/products/iqosheet-14) เป็นเครื่องอุ่นยาสูบที่ผลิตโดย LAMBDA ซึ่งเป็นคนละแบรนด์กับ IQOS ตามข้อมูลบนเว็บของ LAMBDA เครื่องนี้ใช้ก้านได้ทั้ง TEREA และ SENTIA แบต 3200mAh ชาร์จหนึ่งครั้งสูบได้ 35–40 ก้าน และชาร์จเต็มในราว 150 นาทีด้วยหัวชาร์จ 5V 2A",
          "จุดที่ต่างจากตระกูล ILUMA คือปรับอุณหภูมิได้ตั้งแต่ 200–300 องศาเซลเซียส เวลาสูบต่อก้านอยู่ที่ 3–6 นาที และมีจอ LED บนตัวเครื่อง",
        ],
      },
      {
        heading: "เลือกรุ่นไหนดี ดูจากการใช้งาน",
        paragraphs: [
          "ถ้าอยากได้เครื่องชิ้นเดียว ไม่ต้องมี Pocket Charger และสูบต่อกันได้หลายก้านโดยไม่ต้องวางชาร์จ ILUMA i ONE ตรงกับการใช้งานแบบนี้",
          "ถ้าอยากเห็นข้อมูลบนจอและหยุดพักระหว่างสูบได้ โดยวาง Holder กลับไปชาร์จทุก 3 ก้านได้สบาย ๆ ตัวเลือกที่ตรงกว่าคือ ILUMA i และถ้าชอบระบบเดียวกันแต่อยากได้ดีไซน์ที่พรีเมียมขึ้นกับจอที่ละเอียดกว่า ลองดู ILUMA i PRIME",
          "ถ้าอยากได้แบตที่สูบได้หลายก้านต่อการชาร์จหนึ่งครั้ง และอยากปรับอุณหภูมิเอง LAMBDA i8 เป็นอีกทางหนึ่ง เลือกเครื่องได้แล้ว ลองดูว่าจะเริ่มจากกลิ่นไหนใน [TEREA กลิ่นไหนดี](/guides/choosing-a-terea-flavor) และถ้าอยากถามก่อนตัดสินใจ ทักร้านทางไลน์ @okm24 ได้",
        ],
      },
    ],
    relatedProductSlugs: ["iqosheet-17", "iqosheet-18", "iqosheet-16", "iqosheet-14"],
    faq: [
      { question: "ILUMA i ONE vs ILUMA i ต่างกันยังไง", answer: "ILUMA i ONE เป็นเครื่องชิ้นเดียว สูบต่อกันได้สูงสุด 20 ก้าน และชาร์จเต็มในประมาณ 1 ชั่วโมง 30 นาที ส่วน ILUMA i แยกเป็น Holder กับ Pocket Charger โดย Holder สูบต่อกันได้สูงสุด 3 ก้านแล้ววางกลับไปชาร์จ และมีจอทัชกับโหมดหยุดพัก" },
      { question: "ILUMA i ONE vs ILUMA i PRIME ต่างกันยังไง", answer: "ILUMA i ONE เป็นเครื่องชิ้นเดียว สูบต่อกันได้สูงสุด 20 ก้าน ส่วน ILUMA i PRIME ใช้ Holder กับ Pocket Charger มีดีไซน์ที่พรีเมียมกว่า มีจอทัชที่แสดงข้อมูลละเอียด และมีโหมดหยุดพักได้นานสุด 8 นาทีในโหมด Performance" },
      { question: "ILUMA i กับ ILUMA i PRIME ต่างกันยังไง", answer: "ทั้งสองรุ่นใช้ระบบ Holder กับ Pocket Charger เหมือนกัน แบตเท่ากัน และมีจอทัช โหมดหยุดพัก FlexPuff และ FlexBattery เหมือนกัน ส่วนที่ต่างคือ ILUMA i PRIME มีดีไซน์ที่พรีเมียมกว่า และจอแสดงข้อมูลได้ละเอียดกว่า" },
      { question: "ILUMA i ONE ใช้ยังไง", answer: "เสียบก้าน TEREA ลงในตัวเครื่อง เครื่องจะเริ่มอุ่นให้เอง เมื่ออุ่นเสร็จก็เริ่มสูบได้ และสูบเสร็จแล้วดึงก้านออก i ONE เป็นเครื่องชิ้นเดียว จึงไม่ต้องย้าย Holder เข้าออกเหมือน ILUMA i ขั้นตอนละเอียดดูได้ในคู่มือที่มากับกล่อง" },
      { question: "IQOS ILUMA ใช้ก้านอะไร", answer: "ILUMA i ONE · ILUMA i และ ILUMA i PRIME ใช้ได้กับก้าน TEREA เท่านั้น 1 ซองมี 20 ก้าน ส่วน LAMBDA i8 ซึ่งไม่ใช่เครื่องของ IQOS ทาง LAMBDA ระบุว่าใช้ได้ทั้งก้าน TEREA และ SENTIA" },
    ],
  },
  {
    // Clip job (owner 19/10 "1 เรื่อง 1 บทความ · 1 คลิปหลักต่อหน้า"): the shop's PG/VG clip left salt-nic-vs-freebase (one clip
    // per guide) and its topic gets its own page — "pg vg คืออะไร" ×10 Google autocomplete suggestions 19/10 (+ "pg vg 50 50",
    // "pg vg 70 30", "pg vg ในน้ำยาบุหรี่ไฟฟ้า คือ", "สาร pg vg คือ"). salt-nic-vs-freebase keeps a short PG/VG note linking here.
    // Facts from makers only, opened 19/10 (researcher): Aspire https://www.aspirecig.com/community/understanding-pgvg-ratios-in-e-liquids-a-comprehensive-guide/
    // ("the two primary components" · PG flavour/throat hit · VG clouds/smooth · 50PG/50VG labels · coil table · no more than 70% PG · >50% PG in
    // 0.5–1Ω may leak / taste burnt) · Vaporesso https://store.vaporesso.com/blogs/news/best-vg-pg-for-vaping (PG thin, VG thick
    // sweet · first number read as VG · pods/MTL need thinner, higher-PG juice) · Innokin https://www.innokin.com/blog/how-to-buy-vape-juice-the-ultimate-guide
    // (VG thicker, sweeter) · GeekVape https://store.geekvape.com/blogs/vaping-guide/6-super-easy-ways-to-stop-your-coil-from-burning
    // (VG wicks slower · ≥70% VG wicking problems) · GeekVape Z tank https://store.geekvape.com/blogs/faq-products/faq-geekvape-z-sub-ohm-tank
    // (70/30 or 80/20 VG for sub-ohm) · GeekVape Sonder Q https://store.geekvape.com/blogs/faq-products/faq-geekvape-sonder-q-pod-system-kit-1000mah
    // (writes both VG/PG and PG/VG · 50/50 or higher PG for salt-nic pods) · Lost Vape https://lostvape.com/2025/09/04/how-to-match-e-liquid-to-your-vape-kits-for-optimal-flavor%EF%BC%9F/
    // (pod kits about 50/50) · RELX https://relxnow.com/blogs/product-information/what-is-in-the-e-liquid-of-a-relx-pod (ingredients,
    // no ratio) · ARGUS G4 Multi-Ohm = VOOPOO (the poster's own text). Wording: thai-copy 19/10; head row without "น้ำยา" in search-head-copy.ts.
    id: "pg-vg-in-e-liquid",
    slug: "pg-vg-in-e-liquid",
    title: "PG VG คืออะไร ต่างกันยังไง อ่านสัดส่วน 50/50 กับ 70/30",
    dek: "PG กับ VG คือส่วนผสมหลักสองตัวของน้ำยาบุหรี่ไฟฟ้า บทความนี้อธิบายว่าสองตัวนี้ต่างกันยังไงตอนสูบ ตัวเลขอย่าง 50/50 หรือ 70/30 ข้างขวดหมายถึงอะไร และควรเลือกสัดส่วนแบบไหนให้เข้ากับคอยล์ของเครื่องที่ใช้อยู่",
    category: "how-it-works",
    readingTimeMin: 6,
    publishedAt: "2026-10-20",
    thaiOnly: true,
    body: [
      {
        heading: "PG VG ในน้ำยาบุหรี่ไฟฟ้าคืออะไร",
        paragraphs: [
          "PG VG คืออะไร ตอบสั้น ๆ คือส่วนผสมหลักสองตัวของน้ำยาบุหรี่ไฟฟ้า ตามที่ Aspire อธิบายไว้ โดย PG มาจากคำว่า Propylene Glycol และ VG มาจากคำว่า Vegetable Glycerin",
          "สาร PG VG สองตัวนี้มีเนื้อไม่เหมือนกัน Vaporesso และ Innokin อธิบายว่า PG ใสและไหลง่าย ส่วน VG ได้มาจากน้ำมันพืช เนื้อข้นกว่าและมีรสหวานกว่า PG",
          "ความต่างของเนื้อน้ำยาตรงนี้เองที่ทำให้สูบแล้วรู้สึกต่างกัน และทำให้น้ำยาแต่ละสัดส่วนเข้ากับคอยล์ต่างกัน สองเรื่องนี้อยู่ในหัวข้อถัดไป",
        ],
      },
      {
        heading: "PG กับ VG ต่างกันยังไงตอนสูบ",
        paragraphs: [
          "Aspire อธิบายว่า PG พารสได้ชัดและให้ความรู้สึกแรงถึงคอ ส่วน VG ให้ควันหนาและสูบได้นุ่มขึ้น",
          "น้ำยาที่ PG สูงจึงเหมาะกับคนที่อยากได้รสชัดและชอบให้มีแรงถึงคอ ส่วนน้ำยาที่ VG สูงเหมาะกับคนที่ชอบควันแน่น สูบนุ่ม และรสออกหวานนิด ๆ ไม่มีแบบไหนดีกว่ากัน เลือกตามความชอบได้เลย",
          "แต่ก่อนเลือก ควรดูคอยล์ของเครื่องที่ใช้อยู่ประกอบด้วย เพราะน้ำยาที่ข้นหรือใสเกินไปสำหรับคอยล์ก็มีอาการให้เห็นได้ เรื่องนี้เล่าไว้ในหัวข้อด้านล่าง",
        ],
      },
      {
        heading: "สัดส่วน PG VG ข้างขวด อ่านยังไง",
        paragraphs: [
          "ตัวเลขอย่าง 50/50 หรือ 70/30 ข้างขวดคือสัดส่วน PG VG เป็นเปอร์เซ็นต์ สองตัวเลขรวมกันได้ 100 เสมอ น้ำยา PG VG 50/50 คือมีสองตัวนี้เท่ากันพอดี จะอ่านจากฝั่งไหนก็ได้ความหมายเดียวกัน",
          "ส่วนตัวเลขที่ไม่เท่ากันอย่าง PG VG 70/30 ต้องดูตัวอักษรที่กำกับไว้ด้วยทุกครั้ง เพราะแต่ละแบรนด์เรียงลำดับต่างกัน Vaporesso อ่านตัวเลขแรกเป็น VG ขณะที่ Aspire เขียน PG ขึ้นก่อนแบบ 50PG/50VG และในหน้าเดียวกันของ GeekVape ก็มีเขียนไว้ทั้งแบบ VG/PG และ PG/VG",
          "70/30 จึงอาจหมายถึง VG 70% หรือ PG 70% ก็ได้ ขึ้นอยู่กับว่าขวดเขียนว่า VG/PG หรือ PG/VG วิธีที่ร้านแนะนำคือมองหาตัวอักษรข้างตัวเลขก่อนทุกครั้ง แล้วค่อยเทียบกับคอยล์ของเครื่องที่ใช้อยู่",
        ],
      },
      {
        heading: "เลือกสัดส่วนให้เข้ากับคอยล์",
        paragraphs: [
          "นอกจากความชอบ คอยล์ของเครื่องก็มีผลกับการเลือกเหมือนกัน GeekVape อธิบายว่า VG ข้นกว่า จึงซึมเข้าสำลีได้ช้ากว่า PG คอยล์ที่โอห์มต่างกันจึงเข้ากับน้ำยาคนละแบบ",
          "Aspire ทำตารางไว้ให้เทียบได้ง่าย ๆ คอยล์ 1.5–2.5 โอห์ม แนะนำน้ำยา PG 70% คอยล์ 0.5–1.4 โอห์ม แนะนำสัดส่วน 50/50 และคอยล์ 0.1–0.4 โอห์ม แนะนำ VG 80% และ Aspire แนะนำว่า PG ไม่ควรเกิน 70% เพราะถ้าเกินกว่านั้น น้ำยาจะใสเกินไปและบาดคอ",
          "ผู้ผลิตรายอื่นก็แนะนำไปทางเดียวกัน Vaporesso บอกว่าพอตและเครื่องที่สูบแบบ MTL ต้องใช้น้ำยาที่ใสกว่า คือ PG สูงกว่า ส่วน GeekVape แนะนำ VG 70% หรือ 80% สำหรับถังน้ำยาที่ใช้คอยล์ต่ำกว่า 1 โอห์ม",
          "ถ้าใช้เครื่องที่เปลี่ยนโอห์มได้ ก็เลือกน้ำยาตามโอห์มที่ใช้อยู่ตอนนั้น อย่าง [ARGUS G4](/products/argus-g4) ใช้หัวพอต Multi-Ohm ที่ VOOPOO ระบุว่ากลับด้านหัวพอตเพื่อสลับระหว่าง 1.0 โอห์มกับ 0.7 โอห์มได้ และถ้ากดปุ่มสองครั้งติดกันจะได้ 0.4 โอห์ม",
        ],
        image: SECTION_IMAGES.argusG4Ohm,
      },
      {
        heading: "ใช้น้ำยาผิดคู่กับคอยล์ จะเกิดอะไรขึ้น",
        paragraphs: [
          "ถ้าน้ำยาข้นเกินไปสำหรับคอยล์ GeekVape เตือนว่าน้ำยาที่ VG ตั้งแต่ 70% ขึ้นไปอาจซึมเข้าสำลีไม่ทัน จนคอยล์เสียและได้รสไหม้ ดูอาการนี้กับวิธีกันได้ใน [พอตไหม้ เกิดจากอะไร](/guides/fixing-a-burnt-pod)",
          "กลับกัน ถ้าน้ำยาใสเกินไปสำหรับคอยล์ Aspire บอกว่าน้ำยาที่ PG เกิน 50% เมื่อใช้กับคอยล์ 0.5–1 โอห์ม อาจรั่วหรือมีรสไหม้ได้ ถ้าพอตรั่วบ่อย สาเหตุอาจไม่ได้มาจากน้ำยาอย่างเดียว อ่านสาเหตุอื่นและวิธีแก้ได้ที่ [พอตรั่ว](/guides/fixing-a-leaking-pod)",
          "หลักที่ร้านใช้จึงง่าย ๆ คือดูโอห์มของคอยล์ก่อน แล้วค่อยเลือกสัดส่วนให้เข้ากัน ส่วนโอห์มกับวัตต์ที่ควรตั้ง อ่านต่อได้ที่ [ตั้งกี่วัตต์ดี](/guides/choosing-wattage-and-airflow)",
        ],
      },
      {
        heading: "salt nic กับพอตใช้แล้วทิ้ง ต้องเลือก PG VG ไหม",
        paragraphs: [
          "พอตตัวเล็กที่ใช้ salt nic มีผู้ผลิตสองรายแนะนำไปทางเดียวกัน GeekVape แนะนำ 50/50 หรือ PG สูงกว่านั้นสำหรับพอต Sonder Q ส่วน Lost Vape แนะนำราว 50/50 สำหรับพอตตัวเล็ก ความต่างของนิโคตินสองแบบนี้อ่านต่อได้ที่ [salt nic กับ freebase ต่างกันยังไง](/guides/salt-nic-vs-freebase)",
          "ส่วนพอตใช้แล้วทิ้งกับหัวพอตบรรจุสำเร็จ มีน้ำยามาในเครื่องแล้ว จึงไม่ต้องเลือกสัดส่วนเอง และบางแบรนด์ก็ไม่ได้บอกตัวเลขไว้ อย่าง RELX ระบุว่าน้ำยาในหัวพอตมี PG กับ glycerol ผสมกับกลิ่นและ salt nic แต่ไม่ได้บอกสัดส่วนไว้",
          "ถ้าใช้พอตซิสเต็มที่เติมน้ำยาเอง ลองดูกลุ่มรสแต่ละแบบในหน้า [กลุ่มรสชาติของน้ำยาบุหรี่ไฟฟ้า](/e-liquid) และดูน้ำยาแบบขวดในร้านได้ที่หน้า [น้ำยา](/products/e-liquid) ถ้ายังไม่แน่ใจว่าเครื่องที่ใช้อยู่เข้ากับสัดส่วนไหน ทักไลน์ @okm24 ถามร้านก่อนได้",
        ],
      },
    ],
    relatedProductSlugs: ["argus-g4"],
    faq: [
      { question: "PG VG คืออะไร", answer: "PG กับ VG คือส่วนผสมหลักสองตัวของน้ำยาบุหรี่ไฟฟ้า ตามที่ Aspire อธิบายไว้ PG ย่อมาจาก Propylene Glycol ส่วน VG ย่อมาจาก Vegetable Glycerin" },
      { question: "PG กับ VG ต่างกันยังไง", answer: "Aspire อธิบายว่า PG พารสได้ชัดและให้ความรู้สึกแรงถึงคอ ส่วน VG ให้ควันหนาและนุ่มกว่า GeekVape อธิบายเพิ่มว่า VG ข้นกว่า จึงซึมเข้าสำลีช้ากว่า PG" },
      { question: "PG VG 70/30 คือ VG 70 หรือ PG 70", answer: "เป็นได้ทั้งสองแบบ เพราะแต่ละแบรนด์เรียงตัวเลขไม่เหมือนกัน Vaporesso อ่านตัวเลขแรกเป็น VG ส่วน Aspire เขียน PG ขึ้นก่อน ให้ดูตัวอักษรบนขวดว่าเขียน VG/PG หรือ PG/VG แล้วอ่านตัวเลขตามลำดับนั้น" },
      { question: "พอตควรใช้ PG VG เท่าไหร่", answer: "ดูโอห์มของคอยล์ก่อน ตารางของ Aspire แนะนำ PG 70% กับคอยล์ 1.5–2.5 โอห์ม 50/50 กับคอยล์ 0.5–1.4 โอห์ม และ VG 80% กับคอยล์ 0.1–0.4 โอห์ม ส่วนพอต Sonder Q ที่ใช้ salt nic นั้น GeekVape แนะนำ 50/50 หรือ PG สูงกว่านั้น" },
      { question: "พอตใช้แล้วทิ้งต้องเลือก PG VG ไหม", answer: "ไม่ต้องเลือก เพราะน้ำยามาในเครื่องแล้ว และบางแบรนด์ก็ไม่ได้บอกสัดส่วนไว้ อย่าง RELX ที่ระบุส่วนผสมไว้แต่ไม่ได้บอกตัวเลข ดูแค่ชนิดนิโคตินกับความเข้มข้นบนกล่องก็พอ" },
    ],
    // The shop's own explainer on exactly this topic (@OKM_24); title / channel / date as salt-nic-vs-freebase carried it until 19/10.
    reviewVideo: { videoId: "i5SPcPp9HAE", title: "น้ำยา PG/VG ต่างกัน ทำไมฟีลพอตถึงไม่เหมือนกัน?", channelName: "OKAMI", publishedAt: "2026-09-18" },
  },
  {
    // Keyword line 23/10 (owner ticked it on the questions page): "สูบพอตยังไงไม่ให้สำลัก" · "ดูดพอตยังไงไม่ให้สำลัก" · "วิธีดูดพอตมือใหม่" ·
    // "พอตใช้ยังไง" (Google autocomplete + related searches 23/10, _incoming/keys-2310/research-2310.md). Maker facts, opened 23/10 (researcher):
    // Vaporesso https://store.vaporesso.com/blogs/news/how-to-vape-correctly-stop-coughing (slow gentle puff · MTL for beginners · short puffs with
    // pauses · 3–12 mg freebase / 20–35 mg salt · fresh coil soaks 5–10 min) · SMOK https://www.smoktech.com/faq/925 (3 min after filling · first
    // puffs a bit harder) · RELX https://relxnow.com/pages/new-to-relx (about pod systems in general, re-read 23/10 in a real browser: "Automatic operation
    // is typical in these systems, so all you have to do is suck in to pull in vapour, but some may offer manual use buttons") · Innokin
    // https://www.innokin.com/blog/sore-throat-from-vaping (nicotine too high · salt smoother · high PG scratchy · coil's wattage range · MTL/DTL
    // device mismatch, airflow). No maker gives a puff length in seconds, so none is written. No shop clip on this topic was found (23/10).
    // Wording: thai-copy 23/10.
    id: "how-to-vape-without-coughing",
    slug: "how-to-vape-without-coughing",
    title: "สูบพอตยังไงไม่ให้สำลัก วิธีดูดพอตสำหรับมือใหม่",
    dek: "สูบพอตไม่ให้สำลัก เริ่มจากดูดช้า ๆ เบา ๆ เข้าปากก่อน บทความนี้รวมวิธีดูดสำหรับมือใหม่ เรื่องที่มักทำให้สูบแล้วไอ และวิธีเริ่มใช้พอตแต่ละแบบ ทั้งพอตใช้แล้วทิ้ง พอตเปลี่ยนหัว และพอตซิสเต็ม",
    category: "getting-started",
    readingTimeMin: 6,
    publishedAt: "2026-10-23",
    thaiOnly: true,
    body: [
      {
        heading: "สูบพอตยังไงไม่ให้สำลัก",
        paragraphs: [
          "สูบพอตยังไงไม่ให้สำลัก หลักแรกคือดูดช้า ๆ และเบา ๆ เข้าปากก่อน Vaporesso แนะนำไว้แบบเดียวกันว่าให้ดูดเข้าปากช้า ๆ อย่างนุ่มนวล เพราะการดูดเร็วและแรงในทีเดียวอาจทำให้คอและปอดรับไม่ทัน",
          "บทความนี้เล่าตั้งแต่วิธีดูดสำหรับมือใหม่ เรื่องที่มักทำให้สูบแล้วไอ ไปจนถึงวิธีเริ่มใช้พอตแต่ละแบบ ทั้งพอตใช้แล้วทิ้ง พอตเปลี่ยนหัว และพอตซิสเต็มที่เติมน้ำยาเอง",
        ],
      },
      {
        heading: "วิธีดูดพอตสำหรับมือใหม่",
        paragraphs: [
          "มือใหม่ส่วนใหญ่เริ่มจากการสูบแบบ MTL คือดูดเข้าปากก่อน แล้วค่อยสูดลงปอด Vaporesso ให้เหตุผลว่าวิธีนี้รู้สึกเป็นธรรมชาติ และไม่หนักเกินไปสำหรับคนที่เพิ่งเริ่ม ความต่างของการสูบสองแบบอ่านต่อได้ที่ [MTL กับ DTL สูบต่างกันยังไง](/guides/understanding-mtl-vs-dtl)",
          "ช่วงแรกให้ดูดสั้น ๆ ก่อน และเว้นจังหวะพักระหว่างพัฟ ไม่ต้องรีบดูดให้ได้ควันเยอะตั้งแต่พัฟแรก ค่อย ๆ ปรับให้คุ้นไปทีละพัฟก็พอ",
          "พอตส่วนใหญ่ทำงานเองเมื่อดูด ไม่ต้องกดปุ่ม RELX อธิบายว่าพอตแบบนี้แค่ดูดก็ได้ควันแล้ว แต่บางรุ่นก็มีปุ่มให้กดด้วย ถ้าดูดแล้วไม่มีอะไรออกมา ไล่เช็คต่อได้ที่ [พอตดูดไม่ขึ้น ไฟกะพริบ แก้ยังไง](/guides/fixing-no-draw-and-blinking-light)",
        ],
      },
      {
        heading: "ดูดพอตแล้วไอ เกิดจากอะไร",
        paragraphs: [
          "ถ้าดูดช้าลงแล้วยังไอ ลองดูที่ความเข้มข้นของนิโคตินก่อน Innokin บอกว่าถ้าความเข้มข้นของนิโคตินสูงเกินไป อาจสูบแทบไม่ได้เลย และน้ำยา salt nic มักให้ความรู้สึกนุ่มกว่า ความต่างของนิโคตินสองแบบอ่านได้ที่ [salt nic กับ freebase ต่างกันยังไง](/guides/salt-nic-vs-freebase)",
          "สำหรับคนที่เพิ่งเริ่ม Vaporesso แนะนำความเข้มข้นราว 3–12mg สำหรับน้ำยา freebase หรือ 20–35mg สำหรับ salt nic แล้วแต่เครื่องที่ใช้",
          "เรื่องต่อมาคือส่วนผสมของน้ำยา Innokin บอกว่าบางคนรู้สึกบาดคอกับน้ำยาที่ PG สูง ถ้าใช้พอตซิสเต็มที่เลือกน้ำยาเองได้ วิธีอ่านสัดส่วนข้างขวดอยู่ที่ [PG VG คืออะไร ต่างกันยังไง](/guides/pg-vg-in-e-liquid)",
          "อีกเรื่องคือเครื่องกับวิธีสูบต้องเข้ากัน Innokin อธิบายว่าเครื่องแต่ละรุ่นออกแบบมาให้สูบแบบ MTL หรือ DTL ถ้าสูบไม่ตรงกับที่เครื่องออกแบบไว้ก็ไอได้ เครื่องที่ปรับลมได้จึงช่วยให้หาจุดที่พอดีได้ง่ายขึ้น",
          "ถ้าเครื่องปรับวัตต์ได้ Innokin แนะนำให้ใช้ในช่วงวัตต์ที่คอยล์ระบุไว้ ส่วนจะตั้งตรงไหนของช่วงนั้น อ่านต่อได้ที่ [ตั้งกี่วัตต์ดี](/guides/choosing-wattage-and-airflow)",
        ],
      },
      {
        heading: "พอตใช้แล้วทิ้งใช้ยังไง",
        paragraphs: [
          "พอตใช้แล้วทิ้งแกะกล่องแล้วดูดได้เลย น้ำยาบรรจุมาในตัวเครื่องแล้ว จึงไม่ต้องเติม ไม่ต้องรอให้น้ำยาซึม และไม่มีอะไรต้องตั้งค่าก่อนสูบ",
          "บางรุ่นเลือกโหมดหรือปรับลมได้ด้วย แต่ไม่ปรับก็สูบได้ตามปกติ ดูรุ่นทั้งหมดได้ในหมวด[พอตใช้แล้วทิ้ง](/products/disposables)",
        ],
      },
      {
        heading: "พอตเปลี่ยนหัวใช้ยังไง",
        paragraphs: [
          "พอตเปลี่ยนหัวใช้คล้ายพอตใช้แล้วทิ้ง ต่างกันที่ต้องเสียบหัวพอตเข้ากับตัวเครื่องก่อน หัวพอตบรรจุสำเร็จมีน้ำยามาในหัวแล้ว ไม่ต้องเติมเอง หมดก็ถอดเปลี่ยนหัวใหม่ ส่วนตัวเครื่องเก็บไว้ชาร์จใช้ต่อ",
          "ดูรุ่นได้ในหมวด[พอตเปลี่ยนหัว](/products/switch-pods) และถ้ายังชั่งใจระหว่างสองแบบนี้ อ่าน [พอตใช้แล้วทิ้ง กับ พอตเปลี่ยนหัว](/guides/disposable-vs-switch-pod)",
        ],
        image: SECTION_IMAGES.mBar15kSwap,
      },
      {
        heading: "พอตซิสเต็มที่เติมน้ำยาเอง ใช้ยังไง",
        paragraphs: [
          "พอตซิสเต็มต้องเติมน้ำยาลงหัวพอตเองก่อนสูบ วิธีเติมทีละขั้นและเติมแค่ไหนถึงพอดี อยู่ที่ [เติมพอตยังไง](/guides/refilling-a-pod)",
          "เรื่องที่มือใหม่มักข้ามไปคือการรอ หัวพอตหรือคอยล์ใหม่ที่เพิ่งเติมน้ำยา ต้องให้เวลาสำลีซึมน้ำยาก่อนพัฟแรก ผู้ผลิตแนะนำให้รอราว 3–10 นาทีแล้วแต่รุ่น SMOK แนะนำ 3 นาที ส่วน Vaporesso แนะนำ 5–10 นาที",
          "SMOK บอกด้วยว่าสองสามพัฟแรกของหัวพอตใหม่อาจต้องดูดแรงกว่าปกตินิดหนึ่ง จากนั้นก็ดูดได้ตามปกติ",
          "ถ้ายังไม่มีเครื่อง ดูวิธีเลือกได้ที่ [Pod System ตัวไหนดี เลือกพอตเครื่องแรก](/guides/choosing-your-first-pod-system) หรือดูรุ่นทั้งหมดในหมวด[พอตซิสเต็ม](/products/pod-systems) ถ้ายังไม่แน่ใจว่าเครื่องหรือความเข้มข้นแบบไหนเหมาะกับตัวเอง ทักไลน์ @okm24 ถามร้านก่อนได้",
        ],
      },
    ],
    faq: [
      { question: "ดูดพอตแล้วไอ ทำไง", answer: "เริ่มจากดูดให้ช้าและเบาลง ดูดสั้น ๆ แล้วพักระหว่างพัฟตามที่ Vaporesso แนะนำ ถ้ายังไอ Innokin แนะนำให้ดูความเข้มข้นของนิโคติน ดูว่าเครื่องออกแบบมาให้สูบแบบ MTL หรือ DTL และลองปรับช่องลม" },
      { question: "วิธีดูดพอตสำหรับมือใหม่ ต้องดูดยังไง", answer: "มือใหม่ส่วนใหญ่เริ่มจากการสูบแบบ MTL คือดูดเข้าปากก่อน แล้วค่อยสูดลงปอด Vaporesso แนะนำให้ดูดช้า ๆ เบา ๆ ดูดสั้น ๆ ก่อน และพักระหว่างพัฟ" },
      { question: "พอตใช้แล้วทิ้งใช้ยังไง", answer: "แกะกล่องแล้วดูดได้เลย น้ำยาบรรจุมาในตัวเครื่องแล้ว ไม่ต้องเติม และไม่ต้องรอให้น้ำยาซึม" },
      { question: "เติมน้ำยาหัวพอตใหม่แล้วสูบได้เลยไหม", answer: "ควรรอให้สำลีซึมน้ำยาก่อน SMOK แนะนำ 3 นาที ส่วน Vaporesso แนะนำ 5–10 นาที แล้วแต่รุ่น" },
      { question: "มือใหม่ควรเริ่มนิโคตินกี่ mg", answer: "Vaporesso แนะนำราว 3–12mg สำหรับน้ำยา freebase หรือ 20–35mg สำหรับ salt nic แล้วแต่เครื่องที่ใช้ ถ้าสูบแล้วไอจนสูบแทบไม่ได้ Innokin บอกว่าอาจเป็นเพราะความเข้มข้นสูงเกินไป" },
    ],
  },
];

/** The public articles — everything outside HELD_GUIDE_IDS. */
export const guides: Guide[] = allGuides.filter((g) => !HELD_GUIDE_IDS.has(g.id));

/** Held articles, for the contract test only — never render or link from this list. */
export const heldGuides: Guide[] = allGuides.filter((g) => HELD_GUIDE_IDS.has(g.id));

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
