/**
 * Editorial product pages — round "M Bar 9K redesign" (owner 23/10: a fresh design for one best seller, judged on the
 * live page; draft F picked — the article and the spec lead, flavours compact, no effects). A slug listed here gets
 * ProductEditorialMain + ProductEditorialFaq (src/components/product/ProductEditorial.tsx) in place of the review /
 * more-details / spec / compatibility / FAQ sections; every slug not listed keeps its page exactly as it was.
 *
 * Facts: the maker's only (THAI_STYLE §5 · HANDOFF §18), one fact at most twice on the page outside the spec panel.
 * Numbers in the spec panel and the compare table are read from the products' VERIFIED rows — none is typed here.
 * Marbo / มาโบ: only in the hero line (product-copy-th shortDescription) and FAQ questions (THAI_STYLE line 63 exception 2).
 * Copy: thai-copy 23/10 (th first, en/zh from the same facts).
 */
type Localised = Partial<Record<"th" | "en" | "zh", string>> & { en: string };

/** "devices" = the flavours' device renders · "packs" = their packs from the maker's chart (shown at most at their own
 *  pixel size — 168 x 380, no larger source exists) · "image" = one file (e.g. the composed lineup cover). */
export type EditorialImage =
  | { kind: "devices" | "packs"; ids: string[]; caption: Localised }
  | { kind: "image"; src: string; width: number; height: number; alt: Localised; caption: Localised };

export interface EditorialCopy {
  spec: {
    title: string;
    lede: string;
    /** Big numbers — the first number of the verified row `specKey` (dropped while the row is not verified). */
    stats: { specKey: string; label: string }[];
    /** Rows under the numbers: a verified spec row, or a fixed value that is not a maker number. */
    rows: { label: string; specKey?: string; value?: string }[];
    source: string;
  };
  /** A section with an empty heading continues the one above it (a second image under the same question). */
  article: { title: string; sections: { heading: string; paragraphs: string[]; image?: EditorialImage }[] };
  flavours: { title: string; groups: { label: string; ids: string[] }[]; note: string };
  /** `key` = a spec key of both products, or "flavours" (the option count). */
  /** `numberOnly`: show the row's first number + unit only (the battery row's "rechargeable, USB-C" is said elsewhere). */
  compare: { title: string; rows: { key: string; label: string; numberOnly?: boolean }[]; link: string };
  faq: { title: string; items: { question: string; answer: string }[] };
  /** Heading of the shop clip section (ProductReviewSection) — sentence case instead of the shared ALL-CAPS name. */
  clipTitle?: string;
  /** "In this article" label over the section links. */
  tocLabel?: string;
}

export interface ProductEditorial {
  /** The product compared in the table (same family). */
  siblingSlug?: string;
  copy: Partial<Record<"th" | "en" | "zh", EditorialCopy>> & { th: EditorialCopy };
}

// Flavour groups = the shop's own grouping by the words in the names (said on the page) — the same four as /guides/choosing-a-marbo-flavor.
const MBAR9K_GROUPS = {
  cool: ["blue-ice", "blueberry-mint", "doublemint", "menthol-freeze"],
  grape: ["grape", "grape-aloe", "grape-lychee", "kyoho-grape"],
  fruit: ["apple-aloe", "mixberry", "orange-sour", "peach", "peach-strawberry", "pink-berry", "sparkling-lemon", "strawberry", "strawberry-kiwi", "strawberry-milkshake", "watermelon", "watermelon-bubblegum"],
  other: ["cola", "rainbow-candy", "sour-gummy", "zapple"],
};
const MBAR9K_PACKS = ["grape-aloe", "blue-ice", "peach", "cola"];
const MBAR9K_COVER = {
  kind: "image" as const,
  src: "/assets/products/m-bar-9k/story-lineup.webp",
  width: 1537,
  height: 920,
  alt: {"th":"M Bar 9K 7 กลิ่นวางเรียงกัน ตัวเครื่องสีดำ ลาย BAR9K สีต่างกันตามกลิ่น","en":"Seven M Bar 9K flavours side by side: the same black body, the BAR9K print in each flavour's colour","zh":"七款 M Bar 9K 并排：同样的黑色机身，BAR9K 字样颜色随口味不同"},
  caption: {"th":"Peach · Watermelon · Blue Ice · Grape Aloe · Sparkling Lemon · Strawberry · Mixberry","en":"Peach · Watermelon · Blue Ice · Grape Aloe · Sparkling Lemon · Strawberry · Mixberry","zh":"Peach · Watermelon · Blue Ice · Grape Aloe · Sparkling Lemon · Strawberry · Mixberry"},
};
const CAPTION_PACKS = {"th":"กล่อง M Bar 9K 4 กลิ่น จากตารางกลิ่นของ SALTHUB แต่ละกล่องเป็นสีของกลิ่นนั้นและมีชื่อกลิ่นกำกับ","en":"Four M Bar 9K packs from SALTHUB's flavour chart, each in its flavour's colour and labelled with the flavour name.","zh":"SALTHUB 口味表中的 4 款 M Bar 9K 包装，每款为对应口味的颜色并印有口味名称。"};


export const PRODUCT_EDITORIAL: Record<string, ProductEditorial> = {
  "m-bar-9k": {
    siblingSlug: "m-bar-10k",
    copy: {
      th: {
        spec: {
          title: "สเปกของ M Bar 9K",
          lede: "ข้อมูลหลักของรุ่นนี้ รวมไว้ให้ดูได้ในที่เดียวก่อนเลือกกลิ่น",
          stats: [
            { specKey: "puffs", label: "พัฟสูงสุด" },
            { specKey: "battery", label: "แบต ชาร์จซ้ำได้" },
            { specKey: "nicotine", label: "salt nic" },
            { specKey: "resistance", label: "ค่าโอห์ม" },
          ],
          rows: [
            { label: "ช่องลม", specKey: "airflow" },
            { label: "ช่องชาร์จ", value: "USB-C" },
          ],
          source: "ทุกค่าตรงกับที่ SALTHUB ระบุไว้",
        },
        tocLabel: "ในบทความนี้",
        article: {
          title: "รู้จัก M Bar 9K",
          sections: [
            {
              heading: "M Bar 9K คืออะไร เหมาะกับใคร",
              paragraphs: [
                "M Bar 9K เป็นพอตใช้แล้วทิ้งของ SALTHUB ที่บรรจุน้ำยามาในเครื่องเรียบร้อยแล้ว จึงไม่ต้องเติมน้ำยาเอง ใช้ไปจนน้ำยาหมดแล้วก็เปลี่ยนเป็นเครื่องใหม่ได้เลย",
                "รุ่นนี้ปรับช่องลมได้เอง ใครชอบลมแน่นหรือชอบลมโปร่งก็ปรับให้เข้ากับแนวการสูบของตัวเองได้ ไม่ต้องสูบแบบเดียวตามที่เครื่องตั้งมา",
                "ถ้าชอบมีกลิ่นให้เลือกหลายแนว และอยากลองหลายกลิ่นสลับกันไป M Bar 9K ก็เป็นอีกรุ่นที่น่าดู กลิ่นทั้งหมดร้านจัดเป็นสายไว้ให้ด้านล่าง",
              ],
              image: MBAR9K_COVER,
            },
            {
              heading: "M Bar 9K ใช้ยังไง",
              paragraphs: [
                "ข้อแนะนำในหัวข้อนี้เป็นคำแนะนำทั่วไปที่ SALTHUB ให้ไว้กับเครื่องของแบรนด์ ไม่ได้เขียนแยกไว้สำหรับรุ่น 9K โดยเฉพาะ ร้านจึงยกมาไว้ให้อ่านก่อนเริ่มใช้ สำหรับการใช้ครั้งแรก SALTHUB แนะนำให้ใช้จนแบตหมดก่อน แล้วจึงชาร์จให้เต็ม",
                "ช่องชาร์จเป็น USB-C พอแบตอ่อนลงก็เสียบสายชาร์จได้ตามปกติ ส่วนไฟที่บอกว่าชาร์จเต็มแล้ว M Bar แต่ละรุ่นแสดงไม่เหมือนกัน ถ้าไฟไม่ติดเลย ทักไลน์ @okm24 ให้ร้านช่วยดูได้",
                "อีกข้อที่ SALTHUB แนะนำไว้คือไม่ควรคว่ำเครื่องไว้ ทั้งตอนสูบและตอนเก็บ เวลาใส่กระเป๋าหรือวางบนโต๊ะ ตั้งเครื่องขึ้นไว้จะดีกว่า ส่วนเรื่องชาร์จยังไงให้แบตใช้ได้นาน ร้านเล่าไว้ที่[ดูแลแบตและการชาร์จ](/guides/battery-care-and-charging)",
              ],
            },
            {
              heading: "M Bar 9K ใช้ได้นานแค่ไหน",
              paragraphs: [
                "SALTHUB ระบุไว้ว่า M Bar 9K สูบได้สูงสุด 9,000 พัฟ ตัวเลขนี้นับเป็นพัฟ ไม่ได้นับเป็นวัน ถ้าสูบเป็นพัก ๆ ระหว่างวัน เครื่องก็จะอยู่ได้นานกว่าการสูบถี่หรือสูบต่อเนื่องนาน ๆ จำนวนวันจึงต่างกันไปตามการใช้ของแต่ละคน",
                "ตัวเลขพัฟบนกล่องควรอ่านยังไง และสูบแบบไหนถึงใช้ได้นานขึ้น ร้านเขียนไว้แล้วที่[พอตใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts)",
              ],
            },
            {
              heading: "ทุกกลิ่นตัวเครื่องสีดำ แล้วจะรู้ได้ยังไงว่าเป็นกลิ่นไหน",
              paragraphs: [
                "M Bar 9K ทุกกลิ่นใช้ตัวเครื่องสีดำแบบเดียวกัน ดูกลิ่นได้จากสีของตัวอักษร BAR9K กับโลโก้ M บนตัวเครื่อง แต่ละกลิ่นพิมพ์ด้วยสีของตัวเอง",
              ],
            },
            {
              heading: "",
              paragraphs: [
                "ส่วนกล่องก็แยกได้ง่ายเช่นกัน แต่ละกลิ่นมีกล่องเป็นสีของกลิ่นนั้นและมีชื่อกลิ่นพิมพ์ไว้ ถ้าเก็บไว้หลายกลิ่นพร้อมกัน ดูที่กล่องก็รู้ได้ทันทีว่าเครื่องไหนเป็นกลิ่นอะไร",
              ],
              image: { kind: "packs", ids: MBAR9K_PACKS, caption: CAPTION_PACKS },
            },
            {
              heading: "M Bar 9K มีกลิ่นอะไรบ้าง",
              paragraphs: [
                "ร้านแบ่งกลิ่นของ M Bar 9K ไว้เป็นสี่สาย โดยดูจากคำในชื่อกลิ่น ไม่ได้แบ่งตาม SALTHUB ชื่อที่มี Ice · Mint · Menthol หรือ Freeze อยู่สายเย็น ชื่อที่มี Grape อยู่สายองุ่น ชื่อผลไม้อื่น ๆ อยู่สายผลไม้ และที่เหลืออยู่แนวอื่น เลือกสายที่ชอบไว้ก่อน แล้วค่อยเปิดดูรูปทีละกลิ่นด้านล่างได้",
                "สายเย็นมี 4 กลิ่น คือ Blue Ice · Blueberry Mint · Doublemint และ Menthol Freeze ถ้ากำลังหากลิ่นเมนทอล ชื่อในรายการคือ Menthol Freeze",
                "สายองุ่นมี 4 กลิ่น คือ Grape · Grape Aloe · Grape Lychee และ Kyoho Grape มีทั้งองุ่นอย่างเดียว องุ่นคู่กับอโล และองุ่นคู่กับลิ้นจี่ ส่วนองุ่นเคียวโฮ ชื่อในรายการคือ Kyoho Grape",
                "สายผลไม้มี 12 กลิ่น คือ Apple Aloe · Mixberry · Orange Sour · Peach · Peach Strawberry · Pink Berry · Sparkling Lemon · Strawberry · Strawberry Kiwi · Strawberry Milkshake · Watermelon และ Watermelon Bubblegum ชื่อที่มีผลไม้คู่กับขนมหรือเครื่องดื่ม อย่าง Strawberry Milkshake กับ Watermelon Bubblegum ร้านก็จัดไว้ในสายนี้ด้วย",
                "แนวอื่นมี 4 กลิ่น คือ Cola · Rainbow Candy · Sour Gummy และ Zapple เป็นชื่อที่ไม่ได้บอกผลไม้ชนิดใดชนิดหนึ่งไว้ตรง ๆ",
                "ในตารางกลิ่นของ SALTHUB มีสองกลิ่นที่ติดป้าย NEW คือ Kyoho Grape กับ Zapple และแบรนด์บอกไว้ด้วยว่าจะมีกลิ่นใหม่ตามมาอีก รายชื่อในหน้านี้รวมทุกกลิ่นจากตารางนั้น กับอีกสองกลิ่นที่ร้านลงไว้ คือ Blueberry Mint และ Strawberry Kiwi ถ้าอยากเทียบกลิ่นกับรุ่นอื่นในตระกูล M Bar ด้วย อ่านต่อได้ที่[บทความเลือกกลิ่น](/guides/choosing-a-marbo-flavor)",
              ],
            },
            {
              heading: "ดูยังไงว่าเป็นของแท้",
              paragraphs: [
                "SALTHUB มีหน้าสำหรับเช็คของแท้อยู่บนเว็บของแบรนด์ที่ [salthub.com/authenticate](https://www.salthub.com/authenticate/) แบรนด์แนะนำให้ดูเครื่องหมายกันปลอมบนสินค้า และซื้อจากช่องทางที่ได้รับอนุญาตให้ขายสินค้าของแบรนด์",
                "ถ้าเช็คบนหน้าทางการของแบรนด์แล้วผลไม่ผ่าน ทักไลน์ร้านได้เลย สิ่งที่ต้องเตรียมและขั้นตอนทั้งหมดอยู่ที่[เงื่อนไขการเคลม](/warranty)",
              ],
            },
            {
              heading: "M Bar 9K กับ 10K ต่างกันยังไง",
              paragraphs: [
                "M Bar 10K เป็นรุ่นในตระกูลเดียวกัน สูบได้สูงสุด 10,000 พัฟ และมีให้เลือก 12 กลิ่น ส่วนที่ต่างจาก 9K หลัก ๆ คือเรื่องโหมด รุ่น 10K กดสองครั้งติดกันเพื่อสลับโหมด Eco · Soft และ Boost ได้ มีไฟ RGB บอกว่าตอนนี้อยู่โหมดไหน และมีไฟ LED บอกระดับแบตทีละ 25% ขณะที่ SALTHUB ไม่ได้ระบุโหมดไว้สำหรับรุ่น 9K",
                "แบตของทั้งสองรุ่นมีขนาดเท่ากัน ตัวเลขแต่ละข้อร้านวางเทียบไว้ในตารางแล้ว ถ้าอยากได้กลิ่นให้เลือกหลายแนว M Bar 9K มีตัวเลือกมากกว่า แต่ถ้าอยากปรับความแรงได้ตามจังหวะการสูบ M Bar 10K ก็น่าดูกว่า",
                "ถ้าสูบพอตใช้แล้วทิ้งเป็นประจำ และไม่อยากเปลี่ยนเครื่องใหม่ทุกครั้งที่น้ำยาหมด อีกทางที่น่าดูคือ [M Switch Kit](/products/m-switch-kit) เครื่องระบบสวิตช์ที่ใช้ตัวเครื่องเดิมต่อไปได้ แล้วเปลี่ยนแค่หัวพอตบรรจุสำเร็จ [M Switch Pod](/products/m-switch-pod) เมื่อหัวเดิมหมดหรืออยากเปลี่ยนกลิ่น สองแบบนี้ต่างกันยังไง อ่านต่อได้ที่[เทียบกับพอตเปลี่ยนหัว](/guides/disposable-vs-switch-pod)",
              ],
            },
          ],
        },
        flavours: {
          title: "เลือกดูรูปทีละกลิ่น",
          groups: [
            { label: "สายเย็น", ids: MBAR9K_GROUPS.cool },
            { label: "สายองุ่น", ids: MBAR9K_GROUPS.grape },
            { label: "สายผลไม้", ids: MBAR9K_GROUPS.fruit },
            { label: "แนวอื่น", ids: MBAR9K_GROUPS.other },
          ],
          note: "กลิ่นไหนมีของตอนนี้ ทักถามร้านทางไลน์ @okm24 ได้",
        },
        compare: {
          title: "เทียบสเปกกับ M Bar 10K",
          rows: [
            { key: "puffs", label: "พัฟสูงสุด", numberOnly: true },
            { key: "flavours", label: "จำนวนกลิ่น" },
            { key: "modes", label: "โหมดวัตต์" },
            { key: "indicator", label: "ไฟบอกสถานะ" },
            { key: "airflow", label: "ช่องลม" },
            { key: "battery", label: "แบต", numberOnly: true },
          ],
          link: "ดูรายละเอียด M Bar 10K",
        },
        clipTitle: "คลิปรีวิว M Bar 9K จากร้าน",
        faq: {
          title: "คำถามที่พบบ่อย",
          items: [
            { question: "มาโบ 9K กับ 10K ต่างกันยังไง", answer: "ต่างกันหลัก ๆ ที่โหมด M Bar 10K กดสองครั้งติดกันเพื่อสลับ Eco · Soft และ Boost ได้ และมีไฟ RGB บอกโหมดที่ใช้อยู่ ส่วน SALTHUB ไม่ได้ระบุโหมดไว้สำหรับ 9K เรื่องจำนวนพัฟและจำนวนกลิ่น ร้านวางเทียบไว้ในตารางแล้ว" },
            { question: "Marbo 9K กลิ่นไหนดี", answer: "ไม่มีคำตอบเดียว ขึ้นอยู่กับว่าชอบแนวไหน ลองเลือกจากสายก่อน เย็น องุ่น ผลไม้ หรือแนวอื่น แล้วค่อยดูรูปของกลิ่นในสายนั้น ถ้าอยากเทียบกับรุ่นอื่นในตระกูล M Bar ด้วย ร้านรวบรวมไว้ที่[บทความเลือกกลิ่น](/guides/choosing-a-marbo-flavor)" },
            { question: "มาโบ 9K ใช้ได้กี่วัน", answer: "ไม่มีจำนวนวันที่ตายตัว SALTHUB ระบุไว้เป็นจำนวนพัฟ ไม่ได้ระบุเป็นวัน จะใช้ได้กี่วันจึงขึ้นอยู่กับว่าสูบถี่แค่ไหน" },
            { question: "มาโบ 9K ชาร์จได้ไหม", answer: "ได้ ชาร์จผ่านช่อง USB-C พอแบตอ่อนก็เสียบชาร์จแล้วใช้ต่อได้จนน้ำยาหมด สำหรับการใช้ครั้งแรก SALTHUB แนะนำให้ใช้จนแบตหมดก่อน แล้วจึงชาร์จให้เต็ม" },
            { question: "Marbo 9K มีกี่กลิ่น", answer: "บนเว็บเรามี 24 กลิ่น เป็นกลิ่นจากตารางกลิ่นของ SALTHUB 22 กลิ่น กับอีก 2 กลิ่นที่ร้านลงไว้ คือ Blueberry Mint และ Strawberry Kiwi" },
            { question: "Marbo 9K กลิ่นไหนเย็น", answer: "ถ้าดูจากชื่อกลิ่น สายเย็นของ M Bar 9K มี 4 กลิ่น คือ Blue Ice · Blueberry Mint · Doublemint และ Menthol Freeze ส่วนแต่ละกลิ่นเย็นมากน้อยแค่ไหน SALTHUB ไม่ได้ระบุไว้" },
            { question: "มาโบ 9K มีนิโคตินเท่าไหร่", answer: "M Bar 9K ใช้น้ำยา salt nic ความเข้มข้น 30mg ตามที่ SALTHUB ระบุไว้" },
            { question: "มาโบ 9K มีกลิ่นใหม่ไหม", answer: "ในตารางกลิ่นของ SALTHUB มี Kyoho Grape กับ Zapple ที่ติดป้าย NEW และแบรนด์บอกไว้ว่าจะมีกลิ่นใหม่ตามมาอีก" },
            { question: "Marbo 9K ของแท้ดูยังไง", answer: "เช็คได้ที่หน้า Authenticate บนเว็บของ SALTHUB แบรนด์แนะนำให้ดูเครื่องหมายกันปลอม และซื้อจากช่องทางที่ได้รับอนุญาต ถ้าเช็คแล้วผลไม่ผ่าน ดูขั้นตอนต่อได้ที่[เงื่อนไขการเคลม](/warranty)" },
            { question: "มาโบ 9K ต่างจาก M Switch ยังไง", answer: "M Bar 9K ใช้จนน้ำยาหมดแล้วเปลี่ยนทั้งเครื่อง ส่วน M Switch Kit เป็นเครื่องระบบสวิตช์ที่ใช้ตัวเครื่องเดิม แล้วเปลี่ยนเฉพาะหัวพอต M Switch Pod ได้ทั้งตอนหัวเดิมหมดและตอนอยากเปลี่ยนกลิ่น" },
          ],
        },
      },
      en: {
        spec: {
          title: "M Bar 9K specs",
          lede: "The essentials, all in one place before you pick a flavour.",
          stats: [
            { specKey: "puffs", label: "Max puffs" },
            { specKey: "battery", label: "Battery, rechargeable" },
            { specKey: "nicotine", label: "Salt nic" },
            { specKey: "resistance", label: "Resistance" },
          ],
          rows: [
            { label: "Airflow", specKey: "airflow" },
            { label: "Charging port", value: "USB-C" },
          ],
          source: "Every figure matches what SALTHUB publishes.",
        },
        tocLabel: "In this article",
        article: {
          title: "Getting to know the M Bar 9K",
          sections: [
            {
              heading: "What is the M Bar 9K, and who is it for?",
              paragraphs: [
                "The M Bar 9K is a disposable from SALTHUB that comes filled and ready, so there's no e-liquid to top up. You use it until the liquid runs out, then replace it with a new one.",
                "Its airflow is adjustable, so whether you like a tighter or a more open draw, you can set it to suit the way you vape instead of living with one fixed setting.",
                "If you like having a wide choice of flavours and switching between them, it's well worth a look. Every flavour is sorted into groups further down.",
              ],
              image: MBAR9K_COVER,
            },
            {
              heading: "How to use the M Bar 9K",
              paragraphs: [
                "The advice in this section is SALTHUB's general guidance for its devices, not an instruction written for the 9K alone, and we've included it here to read before you start. For first use, SALTHUB recommends running the battery down, then charging it to full.",
                "It charges over USB-C, so when the battery runs low you simply plug it in. Different M Bar models show a full charge in different ways. If the light doesn't come on at all, message us on LINE @okm24 and we'll take a look.",
                "SALTHUB also advises against keeping the device upside down, whether you're vaping or it's put away. In a bag or on a table, it's better kept upright. For charging habits that help the battery, see [Battery Care & Charging Basics](/guides/battery-care-and-charging).",
              ],
            },
            {
              heading: "How long does the M Bar 9K last?",
              paragraphs: [
                "SALTHUB rates the M Bar 9K at up to 9,000 puffs. That's a count of puffs, not days: vaping now and then through the day makes it last longer than vaping often or in long sessions, so the number of days varies from person to person.",
              ],
            },
            {
              heading: "Every flavour has the same black body. So how do you tell them apart?",
              paragraphs: [
                "Every M Bar 9K shares the same black body. What sets each flavour apart is the colour of the BAR9K lettering and the M logo printed on it, and each flavour has its own.",
              ],
            },
            {
              heading: "",
              paragraphs: [
                "The packs make it easier still. Each flavour comes in its own pack, printed in its colour with the flavour name, so if you keep a few on hand you can tell them apart at a glance.",
              ],
              image: { kind: "packs", ids: MBAR9K_PACKS, caption: CAPTION_PACKS },
            },
            {
              heading: "What flavours does the M Bar 9K come in?",
              paragraphs: [
                "We've sorted the M Bar 9K flavours into four groups by the words in their names; the grouping is ours, not SALTHUB's. Names with Ice, Mint, Menthol or Freeze are Cool, names with Grape are Grape, other fruit names are Fruity, and the rest are Other. Pick a group, then browse the photos below.",
                "Cool has four: Blue Ice, Blueberry Mint, Doublemint and Menthol Freeze. If you're after menthol, look for Menthol Freeze.",
                "Grape has four: Grape, Grape Aloe, Grape Lychee and Kyoho Grape. That's grape on its own, grape with aloe, grape with lychee, and the Kyoho variety.",
                "Fruity has twelve: Apple Aloe, Mixberry, Orange Sour, Peach, Peach Strawberry, Pink Berry, Sparkling Lemon, Strawberry, Strawberry Kiwi, Strawberry Milkshake, Watermelon and Watermelon Bubblegum. Names that pair a fruit with a sweet or a drink, like Strawberry Milkshake and Watermelon Bubblegum, sit here too.",
                "Other has four: Cola, Rainbow Candy, Sour Gummy and Zapple, names that don't point to one particular fruit.",
                "SALTHUB's chart marks Kyoho Grape and Zapple as NEW and says more flavours are on the way. The list here covers every flavour on that chart, plus two more we list: Blueberry Mint and Strawberry Kiwi.",
              ],
            },
            {
              heading: "How to tell a genuine M Bar 9K",
              paragraphs: [
                "SALTHUB has an authentication page on its website at [salthub.com/authenticate](https://www.salthub.com/authenticate/). The brand advises checking the anti-counterfeiting marks on the product and buying through authorised channels.",
                "If a check on the brand's page doesn't pass, message us on LINE. What to send and the steps that follow are on our [claims policy](/warranty) page.",
              ],
            },
            {
              heading: "M Bar 9K vs 10K: what's the difference?",
              paragraphs: [
                "The M Bar 10K is from the same family, rated at up to 10,000 puffs, in 12 flavours. The main difference is modes: on the 10K, a double-click switches between Eco, Soft and Boost, an RGB light shows which mode you're in, and an LED shows the battery in 25% steps. SALTHUB lists no modes for the 9K.",
                "Both have the same battery size, and the table sets each figure side by side. If you want more flavours to choose from, the 9K has the wider range; if you'd like to change the strength as you vape, the 10K is the one to look at.",
                "If you vape disposables regularly and would rather not replace the whole device each time, the [M Switch Kit](/products/m-switch-kit) is another route: a reusable device where you keep the body and swap a prefilled M Switch Pod when it runs out or when you want a different flavour. See [disposable vs switch pod](/guides/disposable-vs-switch-pod) for how the two compare.",
              ],
            },
          ],
        },
        flavours: {
          title: "Browse every flavour",
          groups: [
            { label: "Cool", ids: MBAR9K_GROUPS.cool },
            { label: "Grape", ids: MBAR9K_GROUPS.grape },
            { label: "Fruity", ids: MBAR9K_GROUPS.fruit },
            { label: "Other", ids: MBAR9K_GROUPS.other },
          ],
          note: "To check what's in stock now, message us on LINE @okm24.",
        },
        compare: {
          title: "Side by side with the M Bar 10K",
          rows: [
            { key: "puffs", label: "Max puffs", numberOnly: true },
            { key: "flavours", label: "Flavours" },
            { key: "modes", label: "Power modes" },
            { key: "indicator", label: "Status light" },
            { key: "airflow", label: "Airflow" },
            { key: "battery", label: "Battery", numberOnly: true },
          ],
          link: "See the M Bar 10K",
        },
        clipTitle: "M Bar 9K video review",
        faq: {
          title: "Frequently asked questions",
          items: [
            { question: "Marbo 9K vs 10K: what's the difference?", answer: "Mainly the modes. On the M Bar 10K, a double-click switches between Eco, Soft and Boost, and an RGB light shows the mode you're in; SALTHUB lists no modes for the 9K. Puffs and flavour counts are side by side in the table." },
            { question: "Which Marbo 9K flavour is best?", answer: "There's no single answer; it depends on what you enjoy. Start with a group, cool, grape, fruity or other, then look through the photos of each flavour in it." },
            { question: "How many days does a Marbo 9K last?", answer: "There's no fixed number. SALTHUB rates it in puffs, not days, so it depends on how often you vape." },
            { question: "Can you recharge the Marbo 9K?", answer: "Yes, over USB-C. When the battery runs low, plug it in and keep using it until the liquid runs out. For first use, SALTHUB recommends running the battery down, then charging to full." },
            { question: "How many flavours does the Marbo 9K come in?", answer: "We list 24: the 22 on SALTHUB's flavour chart, plus Blueberry Mint and Strawberry Kiwi." },
            { question: "Which Marbo 9K flavours are cool?", answer: "Going by the names, four: Blue Ice, Blueberry Mint, Doublemint and Menthol Freeze. SALTHUB doesn't say how cool each one is." },
            { question: "How much nicotine is in the Marbo 9K?", answer: "It uses 30mg salt nic, as stated by SALTHUB." },
            { question: "Are there new Marbo 9K flavours?", answer: "SALTHUB's chart marks Kyoho Grape and Zapple as NEW, and the brand says more flavours are coming." },
            { question: "How do I check a Marbo 9K is genuine?", answer: "Use the Authenticate page on SALTHUB's website. The brand advises checking the anti-counterfeiting marks and buying through authorised channels. If the check doesn't pass, see our [claims policy](/warranty)." },
            { question: "How is the Marbo 9K different from M Switch?", answer: "The M Bar 9K is used until the liquid runs out, then replaced whole. The M Switch Kit is a reusable device: you keep the body and swap only the M Switch Pod, when it runs out or when you want another flavour." },
          ],
        },
      },
      zh: {
        spec: {
          title: "M Bar 9K 参数",
          lede: "选口味之前，先看看这款的核心参数。",
          stats: [
            { specKey: "puffs", label: "最高口数" },
            { specKey: "battery", label: "可充电电池" },
            { specKey: "nicotine", label: "尼古丁盐" },
            { specKey: "resistance", label: "阻值" },
          ],
          rows: [
            { label: "气流", specKey: "airflow" },
            { label: "充电接口", value: "USB-C" },
          ],
          source: "以上数值均与 SALTHUB 官方公布一致。",
        },
        tocLabel: "本文内容",
        article: {
          title: "认识 M Bar 9K",
          sections: [
            {
              heading: "M Bar 9K 是什么？适合谁？",
              paragraphs: [
                "M Bar 9K 是 SALTHUB 推出的一次性电子烟，烟油已预先灌装，无需自行添加。用到烟油耗尽后，换一支新的即可。",
                "这款支持调节气流，无论喜欢偏紧还是偏松的吸感，都可以按自己的习惯调整，不必迁就固定的一种。",
                "如果你喜欢口味选择多、经常换着抽，这款值得一看。下方已将全部口味分类整理。",
              ],
              image: MBAR9K_COVER,
            },
            {
              heading: "M Bar 9K 怎么用？",
              paragraphs: [
                "本节内容是 SALTHUB 针对旗下设备给出的通用建议，并非专为 9K 撰写，我们整理在这里，供使用前参考。首次使用时，SALTHUB 建议先把电量用完，再充满电。",
                "充电接口为 USB-C，电量偏低时插上充电即可。不同型号的 M Bar 显示“已充满”的方式各不相同。如果指示灯完全不亮，请通过 LINE @okm24 联系我们协助查看。",
                "SALTHUB 还建议，无论是使用中还是放置时，都不要将设备倒置。放进包里或放在桌上时，竖直摆放更好。更多充电与电池保养建议，请参阅[电池保养与充电](/guides/battery-care-and-charging)。",
              ],
            },
            {
              heading: "M Bar 9K 能用多久？",
              paragraphs: [
                "SALTHUB 标注 M Bar 9K 最高可达 9,000 口。这个数字按口数计算，而非天数：平时间歇着抽，会比频繁抽或长时间连续抽用得更久，所以能用几天因人而异。",
              ],
            },
            {
              heading: "所有口味都是黑色机身，怎么区分？",
              paragraphs: [
                "M Bar 9K 每个口味都采用同样的黑色机身，区别在于机身上 BAR9K 字样和 M 标志的印刷颜色，每个口味各有专属颜色。",
              ],
            },
            {
              heading: "",
              paragraphs: [
                "包装盒也很好认：每个口味都有对应颜色的包装，并印有口味名称。同时备着几种口味时，看包装就能一眼分清。",
              ],
              image: { kind: "packs", ids: MBAR9K_PACKS, caption: CAPTION_PACKS },
            },
            {
              heading: "M Bar 9K 有哪些口味？",
              paragraphs: [
                "我们按口味名称中的关键词，把 M Bar 9K 分成四类，这是本店自己的分法，并非 SALTHUB 的分类。名称带 Ice、Mint、Menthol 或 Freeze 的归入清凉系，带 Grape 的归入葡萄系，其他水果名称归入水果系，其余归入其他。先选一类，再往下逐一查看口味图片。",
                "清凉系共 4 款：Blue Ice、Blueberry Mint、Doublemint、Menthol Freeze。想找薄荷醇口味，可以看 Menthol Freeze。",
                "葡萄系共 4 款：Grape、Grape Aloe、Grape Lychee、Kyoho Grape，既有纯葡萄，也有搭配芦荟或荔枝的组合，Kyoho Grape 即巨峰葡萄。",
                "水果系共 12 款：Apple Aloe、Mixberry、Orange Sour、Peach、Peach Strawberry、Pink Berry、Sparkling Lemon、Strawberry、Strawberry Kiwi、Strawberry Milkshake、Watermelon、Watermelon Bubblegum。像 Strawberry Milkshake、Watermelon Bubblegum 这类水果搭配甜品或饮品的名称，也归在这一类。",
                "其他共 4 款：Cola、Rainbow Candy、Sour Gummy、Zapple，名称并不指向某一种具体水果。",
                "SALTHUB 口味表将 Kyoho Grape 和 Zapple 标为 NEW，并表示还会推出更多新口味。本页列出了该口味表上的全部口味，另加本店上架的 Blueberry Mint 和 Strawberry Kiwi 两款。",
              ],
            },
            {
              heading: "如何辨别正品？",
              paragraphs: [
                "SALTHUB 官网设有正品验证页面：[salthub.com/authenticate](https://www.salthub.com/authenticate/)。品牌建议查看产品上的防伪标识，并通过正规授权渠道购买。",
                "如果在品牌官方页面验证未通过，请通过 LINE 联系我们，需要准备的资料和处理流程见[售后说明](/warranty)。",
              ],
            },
            {
              heading: "M Bar 9K 和 10K 有什么区别？",
              paragraphs: [
                "M Bar 10K 属于同一系列，最高 10,000 口，共 12 种口味。两者的主要区别在于模式：10K 双击即可在 Eco、Soft、Boost 之间切换，RGB 灯显示当前模式，LED 以 25% 为一档显示电量；SALTHUB 未为 9K 标注模式。",
                "两款电池容量相同，具体数值可在对比表中逐项查看。想要更多口味可选，9K 的选择更多；想边抽边切换力度，可以看看 10K。",
                "如果你经常使用一次性电子烟，又不想每次整支更换，[M Switch Kit](/products/m-switch-kit) 是另一种选择：机身可重复使用，烟弹用完或想换口味时，只需更换预灌装的 M Switch Pod。两种方式的区别见[一次性与换弹式对比](/guides/disposable-vs-switch-pod)。",
              ],
            },
          ],
        },
        flavours: {
          title: "逐一查看口味图片",
          groups: [
            { label: "清凉系", ids: MBAR9K_GROUPS.cool },
            { label: "葡萄系", ids: MBAR9K_GROUPS.grape },
            { label: "水果系", ids: MBAR9K_GROUPS.fruit },
            { label: "其他", ids: MBAR9K_GROUPS.other },
          ],
          note: "想知道哪些口味目前有货，请通过 LINE @okm24 咨询。",
        },
        compare: {
          title: "与 M Bar 10K 参数对比",
          rows: [
            { key: "puffs", label: "最高口数", numberOnly: true },
            { key: "flavours", label: "口味数量" },
            { key: "modes", label: "功率模式" },
            { key: "indicator", label: "状态灯" },
            { key: "airflow", label: "气流" },
            { key: "battery", label: "电池", numberOnly: true },
          ],
          link: "查看 M Bar 10K",
        },
        clipTitle: "M Bar 9K 视频评测",
        faq: {
          title: "常见问题",
          items: [
            { question: "Marbo 9K 和 10K 有什么区别？", answer: "主要区别在模式：M Bar 10K 双击可切换 Eco、Soft、Boost，并有 RGB 灯显示当前模式；SALTHUB 未为 9K 标注模式。口数和口味数量见对比表。" },
            { question: "Marbo 9K 哪个口味好？", answer: "没有标准答案，取决于个人喜好。可以先从清凉、葡萄、水果或其他中选一类，再逐一查看该类口味的图片。" },
            { question: "Marbo 9K 能用几天？", answer: "没有固定天数。SALTHUB 以口数而非天数标注，能用多久取决于使用频率。" },
            { question: "Marbo 9K 可以充电吗？", answer: "可以，通过 USB-C 充电。电量偏低时充上电即可继续使用，直到烟油用完。首次使用时，SALTHUB 建议先把电量用完再充满。" },
            { question: "Marbo 9K 有几种口味？", answer: "本店共列出 24 种：SALTHUB 口味表上的 22 种，另加 Blueberry Mint 和 Strawberry Kiwi。" },
            { question: "Marbo 9K 哪些口味是凉的？", answer: "从名称看共 4 款：Blue Ice、Blueberry Mint、Doublemint、Menthol Freeze。各款凉感程度，SALTHUB 未作说明。" },
            { question: "Marbo 9K 尼古丁含量是多少？", answer: "根据 SALTHUB 标注，采用 30mg 尼古丁盐。" },
            { question: "Marbo 9K 有新口味吗？", answer: "SALTHUB 口味表将 Kyoho Grape 和 Zapple 标为 NEW，品牌也表示还会推出更多新口味。" },
            { question: "Marbo 9K 怎么辨别正品？", answer: "可在 SALTHUB 官网的 Authenticate 页面验证。品牌建议查看防伪标识，并通过授权渠道购买。验证未通过时，请参阅[售后说明](/warranty)。" },
            { question: "Marbo 9K 和 M Switch 有什么不同？", answer: "M Bar 9K 用到烟油耗尽后整支更换；M Switch Kit 是可重复使用的机身，烟弹用完或想换口味时，只需更换 M Switch Pod。" },
          ],
        },
      },
    },
  },
};
