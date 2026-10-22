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
export interface EditorialImage {
  /** "devices" = the flavours' device renders · "packs" = their packs from the maker's chart. */
  kind: "devices" | "packs";
  ids: string[];
  caption: Partial<Record<"th" | "en" | "zh", string>> & { en: string };
}

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
  flavours: { title: string; groups: { label: string; ids: string[] }[]; note: string; more: string };
  /** `key` = a spec key of both products, or "flavours" (the option count). */
  /** `numberOnly`: show the row's first number + unit only (the battery row's "rechargeable, USB-C" is said elsewhere). */
  compare: { title: string; rows: { key: string; label: string; numberOnly?: boolean }[]; link: string };
  faq: { title: string; items: { question: string; answer: string }[] };
}

export interface ProductEditorial {
  /** The product compared in the table (same family). */
  siblingSlug?: string;
  copy: Partial<Record<"th" | "en" | "zh", EditorialCopy>> & { th: EditorialCopy };
}

// Flavour groups = the shop's own grouping from the names (said on the page), not the maker's.
const MBAR9K_GROUPS = {
  fruit: ["grape-aloe", "watermelon", "strawberry", "peach", "grape-lychee", "apple-aloe", "mixberry", "grape", "orange-sour", "sparkling-lemon", "pink-berry", "peach-strawberry", "kyoho-grape", "zapple", "strawberry-kiwi"],
  cool: ["doublemint", "blue-ice", "menthol-freeze", "blueberry-mint"],
  sweet: ["rainbow-candy", "cola", "sour-gummy", "watermelon-bubblegum", "strawberry-milkshake"],
};
const MBAR9K_DEVICES = ["grape-aloe", "blue-ice", "peach"];
const MBAR9K_PACKS = ["grape-aloe", "blue-ice", "peach", "cola"];
const CAPTION_DEVICES = {"th":"M Bar 9K ตัวเครื่องสีดำ ตัวอักษร BAR9K และโลโก้ M พิมพ์เป็นสีของกลิ่น","en":"M Bar 9K: a black body, with the BAR9K lettering and M logo printed in the flavour's colour.","zh":"M Bar 9K 黑色机身，BAR9K 字样与 M 标志以口味对应颜色印制。"};
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
        article: {
          title: "รายละเอียดเพิ่มเติม",
          sections: [
            {
              heading: "ทุกกลิ่นตัวเครื่องสีดำ แล้วจะรู้ได้ยังไงว่าเป็นกลิ่นไหน",
              paragraphs: ["M Bar 9K ทุกกลิ่นใช้ตัวเครื่องสีดำแบบเดียวกัน สิ่งที่บอกว่าเป็นกลิ่นไหนคือสีของตัวอักษร BAR9K และโลโก้ M ที่พิมพ์อยู่บนตัวเครื่อง แต่ละกลิ่นพิมพ์ด้วยสีของตัวเอง"],
              image: { kind: "devices", ids: MBAR9K_DEVICES, caption: CAPTION_DEVICES },
            },
            {
              heading: "",
              paragraphs: ["ส่วนกล่องก็แยกได้ง่ายเช่นกัน แต่ละกลิ่นมีกล่องเป็นสีของกลิ่นนั้นและมีชื่อกลิ่นพิมพ์ไว้ ถ้าเก็บไว้หลายกลิ่นพร้อมกัน ดูที่กล่องก็รู้ได้ทันทีว่าเครื่องไหนเป็นกลิ่นอะไร"],
              image: { kind: "packs", ids: MBAR9K_PACKS, caption: CAPTION_PACKS },
            },
            {
              heading: "ยังไม่แน่ใจว่าจะเริ่มจากกลิ่นไหน",
              paragraphs: ["ลองเริ่มจากสายที่ชอบก่อนก็ได้ ด้านล่างร้านแบ่งกลิ่นไว้เป็นสามสาย คือ สายผลไม้ สายเย็น กับสายขนมและเครื่องดื่ม เลือกสายที่สนใจแล้วค่อยเปิดดูรูปทีละกลิ่นได้", "รายชื่อในหน้านี้รวมทุกกลิ่นในตารางกลิ่นของ SALTHUB และอีกสองกลิ่น คือ Blueberry Mint กับ Strawberry Kiwi ถ้าอยากรู้ว่ากลิ่นไหนยังมีของ ทักไลน์ @okm24 ถามร้านได้เลย"],
            },
          ],
        },
        flavours: {
          title: "M Bar 9K มีกลิ่นอะไรบ้าง",
          groups: [
            { label: "สายผลไม้", ids: MBAR9K_GROUPS.fruit },
            { label: "สายเย็น", ids: MBAR9K_GROUPS.cool },
            { label: "สายขนมและเครื่องดื่ม", ids: MBAR9K_GROUPS.sweet },
          ],
          note: "การแบ่งสายนี้ร้านจัดเองจากชื่อกลิ่น ไม่ได้มาจาก SALTHUB",
          more: "ดูรูปทุกกลิ่น",
        },
        compare: {
          title: "M Bar 9K กับ M Bar 10K ต่างกันตรงไหน",
          rows: [
            { key: "puffs", label: "พัฟสูงสุด" },
            { key: "flavours", label: "จำนวนกลิ่น" },
            { key: "modes", label: "โหมดวัตต์" },
            { key: "indicator", label: "ไฟบอกสถานะ" },
            { key: "airflow", label: "ช่องลม" },
            { key: "battery", label: "แบต", numberOnly: true },
          ],
          link: "ดูรายละเอียด M Bar 10K",
        },
        faq: {
          title: "คำถามที่พบบ่อย",
          items: [
            { question: "มาโบ 9K กับ 10K ต่างกันยังไง", answer: "ต่างกันหลัก ๆ ที่ M Bar 10K สลับได้ 3 โหมด คือ Eco · Soft และ Boost พร้อมไฟ RGB ที่บอกว่าตอนนี้อยู่โหมดไหน ส่วนเรื่องอื่นร้านเทียบไว้ทีละข้อในตารางด้านบนแล้ว" },
            { question: "Marbo 9K กลิ่นไหนดี", answer: "ไม่มีคำตอบเดียว ขึ้นอยู่กับว่าชอบแนวไหน ลองเลือกจากสายก่อน แล้วค่อยดูรูปของกลิ่นในสายนั้น ร้านแยกกลิ่นของทั้งตระกูล M Bar ไว้ตามสายใน[บทความเลือกกลิ่น](/guides/choosing-a-marbo-flavor)" },
            { question: "มาโบ 9K ใช้ได้กี่วัน", answer: "ไม่มีจำนวนวันที่ตายตัว SALTHUB ระบุไว้เป็นจำนวนพัฟ ไม่ได้ระบุเป็นวัน ส่วนจะใช้ได้กี่วันขึ้นกับว่าแต่ละคนสูบถี่แค่ไหน วิธีอ่านตัวเลขพัฟบนกล่องและวิธีใช้ให้ได้นานขึ้น ร้านเขียนไว้ที่[พอตใช้แล้วทิ้ง ใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts)" },
            { question: "มาโบ 9K ชาร์จได้ไหม", answer: "ได้ ชาร์จผ่าน USB-C ระหว่างใช้ถ้าแบตอ่อนลงก็เสียบชาร์จแล้วสูบต่อได้ เครื่องจะใช้ไปได้จนกว่าน้ำยาจะหมด แล้วจึงเปลี่ยนเป็นเครื่องใหม่ทั้งเครื่อง วิธีชาร์จให้แบตอยู่กับเราได้นาน ร้านเล่าไว้ที่[ชาร์จพอตกี่นาที ชาร์จข้ามคืนได้ไหม](/guides/battery-care-and-charging)" },
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
        article: {
          title: "More details",
          sections: [
            {
              heading: "Every flavour has the same black body. So how do you tell them apart?",
              paragraphs: ["Every M Bar 9K shares the same black body. What sets each flavour apart is the colour of the BAR9K lettering and the M logo printed on it, and each flavour has its own."],
              image: { kind: "devices", ids: MBAR9K_DEVICES, caption: CAPTION_DEVICES },
            },
            {
              heading: "",
              paragraphs: ["The packs make it easier still. Each flavour comes in its own pack, printed in its colour with the flavour name, so if you keep a few on hand you can tell them apart at a glance."],
              image: { kind: "packs", ids: MBAR9K_PACKS, caption: CAPTION_PACKS },
            },
            {
              heading: "Not sure where to start?",
              paragraphs: ["Start with the kind of flavour you like. Below, we've sorted them into three groups: fruity, cool, and sweets & drinks. Pick one, then browse the photos flavour by flavour.", "The list here covers every flavour on SALTHUB's chart, plus two more: Blueberry Mint and Strawberry Kiwi. To check which are in stock right now, message us on LINE @okm24."],
            },
          ],
        },
        flavours: {
          title: "M Bar 9K flavours",
          groups: [
            { label: "Fruity", ids: MBAR9K_GROUPS.fruit },
            { label: "Cool", ids: MBAR9K_GROUPS.cool },
            { label: "Sweets & drinks", ids: MBAR9K_GROUPS.sweet },
          ],
          note: "We grouped these ourselves by flavour name; it isn't SALTHUB's grouping.",
          more: "See every flavour",
        },
        compare: {
          title: "M Bar 9K vs M Bar 10K",
          rows: [
            { key: "puffs", label: "Max puffs" },
            { key: "flavours", label: "Flavours" },
            { key: "modes", label: "Power modes" },
            { key: "indicator", label: "Status light" },
            { key: "airflow", label: "Airflow" },
            { key: "battery", label: "Battery", numberOnly: true },
          ],
          link: "See the M Bar 10K",
        },
        faq: {
          title: "Frequently asked questions",
          items: [
            { question: "Marbo 9K vs 10K: what's the difference?", answer: "The main difference is that the M Bar 10K switches between three modes, Eco, Soft and Boost, and has an RGB light that shows which one you're in. Everything else is compared point by point in the table above." },
            { question: "Which Marbo 9K flavour is best?", answer: "There's no single answer; it depends on what you enjoy. Start with a group above, fruity, cool, or sweets & drinks, then look through the photos of each flavour in it." },
            { question: "How many days does a Marbo 9K last?", answer: "There's no fixed number of days. SALTHUB rates it in puffs, not days, so how long it lasts depends on how often you use it." },
            { question: "Can you recharge the Marbo 9K?", answer: "Yes. It charges over USB-C, so when the battery runs low you simply plug it in and carry on. It lasts until the liquid inside runs out, and then the whole device is replaced. For good charging habits, see [Battery Care & Charging Basics](/guides/battery-care-and-charging)." },
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
        article: {
          title: "更多信息",
          sections: [
            {
              heading: "所有口味都是黑色机身，怎么区分？",
              paragraphs: ["M Bar 9K 每个口味都采用同样的黑色机身，区别在于机身上 BAR9K 字样和 M 标志的印刷颜色，每个口味各有专属颜色。"],
              image: { kind: "devices", ids: MBAR9K_DEVICES, caption: CAPTION_DEVICES },
            },
            {
              heading: "",
              paragraphs: ["包装盒也很好认：每个口味都有对应颜色的包装，并印有口味名称。同时备着几种口味时，看包装就能一眼分清。"],
              image: { kind: "packs", ids: MBAR9K_PACKS, caption: CAPTION_PACKS },
            },
            {
              heading: "不知道从哪个口味开始？",
              paragraphs: ["可以先从喜欢的类型入手。下方按水果系、清凉系、甜品饮品系三类整理好了，选定一类后再逐一查看口味图片。", "这里列出了 SALTHUB 口味表上的全部口味，以及另外两款：Blueberry Mint 和 Strawberry Kiwi。想知道哪些口味目前有货，请通过 LINE @okm24 咨询。"],
            },
          ],
        },
        flavours: {
          title: "M Bar 9K 有哪些口味",
          groups: [
            { label: "水果系", ids: MBAR9K_GROUPS.fruit },
            { label: "清凉系", ids: MBAR9K_GROUPS.cool },
            { label: "甜品饮品系", ids: MBAR9K_GROUPS.sweet },
          ],
          note: "以上分类由本店根据口味名称整理，并非 SALTHUB 官方分类。",
          more: "查看全部口味图片",
        },
        compare: {
          title: "M Bar 9K 与 M Bar 10K 有何不同",
          rows: [
            { key: "puffs", label: "最高口数" },
            { key: "flavours", label: "口味数量" },
            { key: "modes", label: "功率模式" },
            { key: "indicator", label: "状态灯" },
            { key: "airflow", label: "气流" },
            { key: "battery", label: "电池", numberOnly: true },
          ],
          link: "查看 M Bar 10K",
        },
        faq: {
          title: "常见问题",
          items: [
            { question: "Marbo 9K 和 10K 有什么区别？", answer: "主要区别在于 M Bar 10K 可在 Eco、Soft、Boost 三种模式间切换，并有 RGB 灯显示当前模式。其余各项已在上方表格中逐一对比。" },
            { question: "Marbo 9K 哪个口味好？", answer: "没有标准答案，取决于个人喜好。可以先从上方的水果系、清凉系或甜品饮品系中选一类，再逐一查看该类口味的图片。" },
            { question: "Marbo 9K 能用几天？", answer: "没有固定天数。SALTHUB 标注的是口数而不是天数，实际能用多久取决于个人的使用频率。" },
            { question: "Marbo 9K 可以充电吗？", answer: "可以。通过 USB-C 充电，电量不足时插上充电即可继续使用。机身会一直用到烟油耗尽，届时整支更换。正确的充电方法请参阅[电池保养与充电](/guides/battery-care-and-charging)。" },
          ],
        },
      },
    },
  },
};
