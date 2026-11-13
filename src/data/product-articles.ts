import type { ArticleFAQItem, ArticleSubsection } from "@/types/catalog";
import type { Locale } from "@/i18n/config";

/**
 * Article round (owner 30/09 + 02/10: every product page carries an article in its "more details" section, written to
 * answer what a buyer asks — docs/rounds/รอบบทความ-รายละเอียดเพิ่มเติม.txt). One record per product slug, one copy
 * per locale; a locale without a copy falls back to `en`, then shows nothing.
 *
 * - `lede` (optional): one or two sentences under the section heading, before the posters — a reason to scroll, never a
 *   list of the facts the posters tell nor a re-statement of the source line (G5: cut 03/10, back by the owner the same day).
 * - `sections`: the article itself, after the all-options grid — H3 blocks whose headings are buyer questions.
 *   Paragraphs may carry inline links `[text](/path)` (ArticleBody's syntax), at most three per article.
 *
 * Every product fact here must come from the maker (THAI_STYLE §5 "แหล่งอ้างอิง" — maker pages, posters, manuals);
 * the source per sentence lives in the batch's source table (docs/cloud-results/รอบบทความ-รายละเอียดเพิ่มเติม.md).
 * Never repeat a spec-sheet number on its own, never answer a question the product's own `faqs` already answer, and
 * never re-tell a story poster: one fact at most twice on the page outside the spec table (owner 03/10, HANDOFF §18).
 * This text does not reach <title>/meta/JSON-LD (they read head-copy / shortDescription only).
 */
export interface ProductArticleCopy {
  lede?: string;
  sections: ArticleSubsection[];
  /** Warehouse-listed (Shipnity seed) pages only — they have no `Product.faqs`; PilotProductDetail shows these under the
   *  article and the server page builds FAQPage JSON-LD from the Thai copy (the M Bar 9K editorial pattern). */
  faq?: ArticleFAQItem[];
}

export const PRODUCT_ARTICLES: Record<string, Partial<Record<Locale, ProductArticleCopy>>> = {
  // Product-article round 13/11 (owner: best sellers in stock first, the G5 standard upgraded with what page-1 pages do),
  // Marbo Saltnic: no maker site (the Muro e-liquid pattern of 02/11) — facts = the two verified rows (30ml · salt nic), the
  // options as the warehouse lists them (Purple 50mg = the only stated strength) and what the bottle labels print in the
  // warehouse's own ELQ-1 listing photo, recorded in shipnity-seed/active-catalog-to-product-master.ts ("ELIQUID-1" image
  // note: black prints "Ice Blast", purple "Ice Grape"). No flavour guessed for any other colour. Thai = thai-copy 13/11.
  "eliquid-1": {
    th: {
      lede: "ตัวเลือกของ Marbo Saltnic ส่วนใหญ่ใช้ชื่อเป็นสี ดูจากชื่ออย่างเดียวอาจยังไม่รู้ว่าเป็นกลิ่นแนวไหน ด้านล่างร้านเล่าวิธีอ่านชื่อเหล่านี้ไว้ให้ พร้อมความต่างจาก Marbo Freebase",
      sections: [
        {
          heading: "Marbo Saltnic มีกลิ่นอะไรให้เลือกบ้าง",
          paragraphs: [
            "ชื่อตัวเลือกบนหน้านี้มีอยู่สองแบบ แบบแรกบอกแนวกลิ่นไว้เป็นคำเลย มี 3 ชื่อ คือ Tobacco · Ice Strawberry และ Ice Sparkling ชื่อกลุ่มนี้พอบอกได้ว่ากลิ่นไปทางไหน อย่าง Tobacco ก็คือแนวยาสูบ ส่วน Ice Strawberry มีสตรอเบอร์รี่อยู่ในชื่อ",
            "อีก 6 ชื่อเป็นชื่อสี เช่น Purple · Black และ Green ชื่อเหล่านี้คือชื่อที่ร้านใช้เรียกขวดในคลังสินค้า ชื่อสีอย่างเดียวไม่ได้บอกว่าข้างในเป็นรสอะไร ร้านจึงไม่เดารสจากสีให้",
            "แต่มีสองขวดที่ฉลากพิมพ์ชื่อกลิ่นไว้ให้เห็นในรูปขวดจากคลังของร้าน ขวด Purple พิมพ์ว่า Ice Grape ส่วนขวด Black พิมพ์ว่า Ice Blast ขวดสีอื่นที่อยากรู้ก่อนสั่ง ส่งชื่อกลิ่นหรือรูปขวดมาให้ร้านช่วยดูได้ ติดต่อสอบถามเพิ่มเติมได้ที่ @okm24 ค่ะ",
          ],
        },
        {
          heading: "Marbo Saltnic กับ Marbo Freebase ต่างกันยังไง",
          paragraphs: [
            "แม้จะเป็น Marbo เหมือนกัน แต่ Marbo Saltnic กับ [Marbo Freebase](/products/eliquid-109) ใช้นิโคตินคนละชนิด ขวดนี้เป็นแบบ salt nic ส่วนอีกขวดเป็นแบบ freebase เครื่องแต่ละรุ่นเหมาะกับนิโคตินไม่เหมือนกัน ก่อนเลือกขวดจึงควรดูคำแนะนำของผู้ผลิตเครื่องที่ใช้อยู่ ถ้ายังไม่แน่ใจ ความต่างของนิโคตินสองแบบนี้อ่านได้ที่[นิโคติน salt nic กับ freebase](/guides/salt-nic-vs-freebase)",
            "ชื่อ Purple · Gold และ Ice Sparkling มีอยู่ในทั้งสองขวด แต่ชื่อเหมือนกันไม่ได้แปลว่าใช้แทนกันได้ เพราะนิโคตินเป็นคนละแบบ เลือกขวดให้ตรงกับเครื่องก่อน แล้วค่อยเลือกชื่อที่ชอบ",
          ],
        },
      ],
      faq: [
        { question: "Marbo สีดำ คือกลิ่นไหน", answer: "บนหน้านี้คือตัวเลือก Black ค่ะ ฉลากของขวดสีดำพิมพ์ชื่อกลิ่นไว้ว่า Ice Blast ถ้ากำลังหา Marbo Ice Blast อยู่ ก็คือตัวเลือกนี้ค่ะ" },
        { question: "Marbo Saltnic มีแบบ 50mg ไหม", answer: "มีค่ะ ตัวเลือก Purple 50mg คือกลิ่น Purple ในแบบ 50mg ส่วนขวดอื่นบนหน้านี้ยังไม่ได้ระบุความเข้มข้นไว้ ก่อนกดเลือก ลองดูชื่อให้ตรงกับแบบที่ต้องการนะคะ" },
        { question: "Marbo Saltnic เติมกับหัวพอตแบบไหนได้", answer: "เติมได้กับหัวพอตที่เติมน้ำยาเองได้ค่ะ อย่างหัวพอตของพอตซิสเต็ม ส่วนหัวพอตบรรจุสำเร็จกับพอตใช้แล้วทิ้งเป็นแบบที่ใช้จนน้ำยาหมดแล้วเปลี่ยนใหม่ ไม่ได้มีไว้ให้เติม วิธีดูว่าหัวพอตที่ใช้อยู่เติมเองได้ไหม อ่านต่อได้ที่[เติมพอตยังไง](/guides/refilling-a-pod) ค่ะ" },
      ],
    },
    en: {
      lede: "Most Marbo Saltnic options are named after a colour, which doesn't tell you much about the flavour. Below, we explain how to read the names and how this line differs from Marbo Freebase.",
      sections: [
        {
          heading: "Which flavours does Marbo Saltnic come in?",
          paragraphs: [
            "The names on this page come in two kinds. Three describe the flavour in words: Tobacco, Ice Strawberry and Ice Sparkling.",
            "The other six are colours, such as Purple, Black and Green. These are the names we use for the bottles in our warehouse. A colour alone doesn't say what the flavour is, so we don't guess one for you.",
            "Two bottles do print a flavour name on the label, as our warehouse photo of them shows: Purple reads Ice Grape and Black reads Ice Blast. For any other colour, send us the name or a photo of the bottle on LINE @okm24 and we'll check before you order.",
          ],
        },
        {
          heading: "Marbo Saltnic or Marbo Freebase?",
          paragraphs: [
            "Both carry the Marbo name, but the nicotine differs: Marbo Saltnic is salt nic, while [Marbo Freebase](/products/eliquid-109) is freebase. Devices suit one or the other, so check what your device's maker recommends before you choose a bottle.",
            "Purple, Gold and Ice Sparkling appear in both lines. A shared name doesn't make the two bottles interchangeable, though. Pick the line that suits your device first, then the name you like.",
          ],
        },
      ],
      faq: [
        { question: "Which option is the black Marbo?", answer: "On this page it's Black. The black bottle's label prints the flavour name Ice Blast, so if you're looking for Marbo Ice Blast, this is the one." },
        { question: "Does Marbo Saltnic come in 50mg?", answer: "Yes. The Purple 50mg option is Purple in a 50mg version. The other bottles on this page don't state a strength, so check the name before you choose." },
        { question: "What kind of pod can I fill with Marbo Saltnic?", answer: "Any pod you refill yourself, such as the pod of a Pod System. Prefilled pods and disposables are used until the e-liquid runs out and then replaced, so they aren't meant to be refilled." },
      ],
    },
    zh: {
      lede: "Marbo Saltnic 的大部分选项以颜色命名，单看名称不太容易判断口味。下面说明这些名称该怎么看，以及它和 Marbo Freebase 有什么不同。",
      sections: [
        {
          heading: "Marbo Saltnic 有哪些口味？",
          paragraphs: [
            "本页的选项名称分两类。一类直接用文字点明口味方向，共 3 个：Tobacco、Ice Strawberry 和 Ice Sparkling。",
            "另外 6 个是颜色名，例如 Purple、Black、Green。这些是本店仓库对瓶子的叫法，单凭颜色并不能说明口味，所以我们不会凭颜色去猜口味。",
            "不过有两瓶的标签印着口味名称，本店仓库的瓶身照片可以看到：Purple 印着 Ice Grape，Black 印着 Ice Blast。其他颜色想在下单前确认，可以把口味名称或瓶身照片发到 LINE @okm24，我们帮您确认。",
          ],
        },
        {
          heading: "Marbo Saltnic 和 Marbo Freebase 有什么不同？",
          paragraphs: [
            "两款都叫 Marbo，但尼古丁类型不同：Marbo Saltnic 是盐尼古丁，[Marbo Freebase](/products/eliquid-109) 是游离碱尼古丁。不同设备适合的尼古丁类型不同，选瓶之前建议先看设备厂家的推荐。",
            "Purple、Gold 和 Ice Sparkling 两款都有，但名称相同并不代表可以互换。先选适合设备的那一款，再挑喜欢的名称。",
          ],
        },
      ],
      faq: [
        { question: "黑色的 Marbo 是哪个选项？", answer: "本页对应的是 Black。黑色瓶子的标签印着口味名称 Ice Blast，如果您在找 Marbo Ice Blast，就是这一款。" },
        { question: "Marbo Saltnic 有 50mg 的吗？", answer: "有。Purple 50mg 选项就是 50mg 版本的 Purple。本页其他瓶子未标注浓度，选择前请核对名称。" },
        { question: "Marbo Saltnic 可以加到什么样的烟弹里？", answer: "可加注到能自行注油的烟弹，例如 Pod System 的烟弹。预注油烟弹和一次性电子烟是用完烟油后直接更换的，不用于加注。" },
      ],
    },
  },
  // Round SEO full 07/11: FAQ only, the page has no article yet.
  "super-cool-saltnic": {
    th: {
      sections: [],
      faq: [
        { question: "Super Cool เป็นน้ำยา salt nic ไหม", answer: "ใช่ค่ะ Super Cool Salt Nic เป็นน้ำยาที่ใช้นิโคตินแบบ salt nic ความต่างจาก freebase อ่านต่อได้ที่ [salt nic กับ freebase ต่างกันยังไง](/guides/salt-nic-vs-freebase) ค่ะ" },
        { question: "Super Cool มีกลิ่นอะไรบ้าง", answer: "Super Cool Salt Nic มี 10 กลิ่น คือ Grape Blast · Shine Muscat · Yacool · Laimoon · Blueraz Berry · Pinky Blush · King Melon · Strawberry Frost · White Polo และ Black Hexx ค่ะ" },
        { question: "น้ำยา Super Cool ใช้กับเครื่องแบบไหน", answer: "น้ำยา Super Cool เหมาะกับพอตซิสเต็มตัวเล็กที่เติมน้ำยาเองและใช้วัตต์ต่ำค่ะ เพราะผู้ผลิตพอตหลายรายแนะนำ salt nic ไว้สำหรับเครื่องแบบนี้ ถ้าอยากให้ช่วยดูเครื่องที่ใช้อยู่ ติดต่อสอบถามเพิ่มเติมได้ที่ @okm24 ค่ะ" },
      ],
    },
    en: {
      sections: [],
      faq: [
        { question: "Is Super Cool a salt nic e-liquid?", answer: "Yes. Super Cool Salt Nic is an e-liquid with nicotine in salt nic form." },
        { question: "What flavours does Super Cool come in?", answer: "Ten: Grape Blast, Shine Muscat, Yacool, Laimoon, Blueraz Berry, Pinky Blush, King Melon, Strawberry Frost, White Polo and Black Hexx." },
        { question: "What kind of device suits Super Cool e-liquid?", answer: "A small, low-wattage Pod System you fill yourself, the kind several pod makers recommend salt nic for. If you'd like us to check your device, message us on LINE @okm24." },
      ],
    },
    zh: {
      sections: [],
      faq: [
        { question: "Super Cool 是 salt nic 烟油吗？", answer: "是的，Super Cool Salt Nic 是尼古丁类型为 salt nic 的烟油。" },
        { question: "Super Cool 有哪些口味？", answer: "共 10 种口味：Grape Blast、Shine Muscat、Yacool、Laimoon、Blueraz Berry、Pinky Blush、King Melon、Strawberry Frost、White Polo 和 Black Hexx。" },
        { question: "Super Cool 烟油适合什么设备？", answer: "适合自行注油的低功率小型 Pod System，多家烟弹设备厂商都建议这类设备使用 salt nic。想确认手上的设备是否合适，欢迎通过 LINE @okm24 咨询。" },
      ],
    },
  },
  // Round SEO full 07/11: FAQ only, the page has no article yet.
  "mq-bar-22k": {
    th: {
      sections: [],
      faq: [
        { question: "MQ Bar 22K คือพอตแบบไหน", answer: "MQ Bar 22K เป็นพอตใช้แล้วทิ้งค่ะ ชื่อรุ่นระบุ 22K และถ้าเห็นคนเรียก MQ Bar 22000 ก็หมายถึงรุ่นนี้เช่นกันค่ะ" },
        { question: "MQ Bar 22K มีกลิ่นอะไรบ้าง", answer: "รุ่นนี้มี 11 กลิ่นให้เลือกค่ะ สายเย็นมี Blue Ice กับ Double Mint สายองุ่นมี Kyoho Grape กับ Grape Lychee สายผลไม้อย่าง Watermelon · Strawberry และ Mixberry ส่วนแนวอื่นมี Cola กับ Rainbow Candy ค่ะ" },
      ],
    },
    en: {
      sections: [],
      faq: [
        { question: "What is the MQ Bar 22K?", answer: "It's a disposable in the MQ Bar name, with 22K in the model name. If you see it called the MQ Bar 22000, that means this one too." },
        { question: "What flavours does the MQ Bar 22K come in?", answer: "There are 11 to choose from. Blue Ice and Double Mint are the cooler ones, Kyoho Grape and Grape Lychee are the grapes, and the fruit side includes Watermelon, Strawberry and Mixberry. Cola and Rainbow Candy round out the list." },
      ],
    },
    zh: {
      sections: [],
      faq: [
        { question: "MQ Bar 22K 是什么样的产品？", answer: "这是一款一次性电子烟，型号名称标有 22K。如果看到有人叫它 MQ Bar 22000，指的也是这一款。" },
        { question: "MQ Bar 22K 有哪些口味？", answer: "共有 11 种可选。清凉款有 Blue Ice、Double Mint，葡萄味有 Kyoho Grape、Grape Lychee，水果味有 Watermelon、Strawberry、Mixberry 等，另外还有 Cola 和 Rainbow Candy。" },
      ],
    },
  },
  // Round SEO full 07/11: FAQ only, the page has no article yet.
  "iqosheet-15": {
    th: {
      sections: [],
      faq: [
        { question: "TEREA ใช้กับเครื่องอะไรได้บ้าง", answer: "TEREA ใช้กับเครื่องจ่ายความร้อนตระกูล IQOS ILUMA ค่ะ IQOS ระบุว่าออกแบบมาสำหรับเครื่องตระกูลนี้โดยเฉพาะ ส่วน LAMBDA i8 เป็นเครื่องคนละแบรนด์ ซึ่ง LAMBDA ระบุว่าใช้กับ TEREA ได้เช่นกันค่ะ" },
        { question: "TEREA มีกลิ่นอะไรบ้าง", answer: "23 กลิ่นบนหน้านี้แบ่งได้เป็นสี่สายตามที่ IQOS จัดไว้ คือ ยาสูบคลาสสิก เมนทอล กานพลู และแคปซูลค่ะ ถ้าอยากรู้ว่าแต่ละสายต่างกันยังไง อ่านต่อได้ที่ [TEREA กลิ่นไหนดี](/guides/choosing-a-terea-flavor) นะคะ" },
        { question: "TEREA 1 ซองมีกี่มวน", answer: "1 ซองมี 20 มวนค่ะ ตัวเลือกในหน้านี้แยกตามกลิ่น และขายเป็นซองค่ะ" },
        { question: "TEREA ใช้กับเครื่อง IQOS 3 DUO ได้ไหม", answer: "ไม่ได้ค่ะ IQOS ระบุว่า TEREA ใช้กับตระกูล ILUMA เท่านั้น เพราะระบบ SMARTCORE อุ่นยาสูบจากด้านในมวน ก่อนซื้อ ลองเช็คชื่อรุ่นเครื่องที่มีอยู่อีกครั้งนะคะ" },
        { question: "TEREA Japan เหมือนกับ TEREA หน้านี้ไหม", answer: "อาจต่างกันบ้างค่ะ เพราะชื่อกลิ่นและไลน์อัพของ TEREA ต่างกันไปตามประเทศ ถ้ามองหากลิ่นไหนอยู่ ให้เช็คจากชื่อกลิ่นในตัวเลือกของหน้านี้ได้เลยนะคะ" },
      ],
    },
    en: {
      sections: [],
      faq: [
        { question: "Which devices work with TEREA?", answer: "TEREA sticks are for IQOS ILUMA heated tobacco devices, and IQOS says it designed them for that line alone. The LAMBDA i8 comes from a different brand, and LAMBDA says it takes TEREA as well." },
        { question: "What flavours does TEREA come in?", answer: "The 23 flavours on this page fall into the four groups IQOS uses: classic tobacco, menthol, clove and capsule. You can see each one in the options on this page." },
        { question: "How many sticks are in a pack of TEREA?", answer: "Each pack holds 20 sticks. The options on this page are sorted by flavour and sold by the pack." },
        { question: "Does TEREA work with the IQOS 3 DUO?", answer: "No. IQOS says TEREA is for the ILUMA family only, because ILUMA's SMARTCORE system heats the tobacco from inside the stick. Check your device's model name before you buy." },
        { question: "Is TEREA Japan the same as the TEREA on this page?", answer: "Not always, because TEREA's flavour names and line-up change from country to country. If you have a flavour in mind, look for its name in the options on this page." },
      ],
    },
    zh: {
      sections: [],
      faq: [
        { question: "TEREA 可以搭配哪些设备？", answer: "TEREA 烟支用于 IQOS ILUMA 系列加热烟草设备，IQOS 表示它专为该系列设计。LAMBDA i8 是另一品牌的设备，LAMBDA 表示也可使用 TEREA。" },
        { question: "TEREA 有哪些口味？", answer: "本页的 23 种口味可按 IQOS 的分类归为四组：经典烟草、薄荷、丁香和爆珠。每种口味都可以在本页选项中查看。" },
        { question: "一盒 TEREA 有多少支？", answer: "每盒 20 支。本页选项按口味区分，以盒为单位销售。" },
        { question: "TEREA 能用于 IQOS 3 DUO 吗？", answer: "不能。IQOS 表示 TEREA 仅适用于 ILUMA 系列，因为 SMARTCORE 系统是从烟支内部加热烟草。购买前请再核对设备型号。" },
        { question: "日本版 TEREA 和本页的 TEREA 一样吗？", answer: "不一定。TEREA 的口味名称和产品阵容因国家而异。如果您有想要的口味，请在本页选项中查找对应名称。" },
      ],
    },
  },
  // Round SEO full 07/11: FAQ only, the page has no article yet. เลโก้ once, as the name people type (SEO_LANDSCAPE 0.4).
  "relx-creator-pod-20k": {
    th: {
      sections: [],
      faq: [
        { question: "RELX Creator Pod 20K หรือที่หลายคนเรียกว่าหัวพอตเลโก้ ใช้กับเครื่องไหน", answer: "ใช้กับเครื่อง [RELX Creator](/products/relx-creator) ค่ะ ร้านยืนยันจากของจริงที่มีอยู่ ก่อนซื้อ เช็คชื่อรุ่นเครื่องของตัวเองอีกครั้งนะคะ" },
        { question: "หัว RELX Creator มีกลิ่นอะไรบ้าง", answer: "หน้านี้รวมไว้ 31 กลิ่นค่ะ ถ้าแบ่งตามชื่อกลิ่น สายเย็นมีอย่าง Double Mint · Cool Mint และ Spearmint สายผลไม้มีอย่าง Grape · Watermelon · Lychee และ Pink Guava แนวอื่นมีอย่าง Cola · Jasmine Tea และ Rainbow Candy ส่วนการแบ่งสายนี้ร้านจัดเองจากชื่อกลิ่นค่ะ" },
        { question: "หัว RELX Creator 20K มีแบบ 5% ไหม", answer: "ในรายการกลิ่นมี 8 กลิ่นที่ชื่อมี 5% ต่อท้ายค่ะ เช่น Grape 5% · Double Mint 5% และ Classic Tobacco 5% ก่อนกดเลือก ลองดูชื่อให้ตรงกับแบบที่ต้องการนะคะ" },
      ],
    },
    en: {
      sections: [],
      faq: [
        { question: "Which device does the RELX Creator Pod 20K fit?", answer: "The [RELX Creator](/products/relx-creator). We have confirmed this with our own stock. Check your device name before you buy." },
        { question: "Which flavours do RELX Creator pods come in?", answer: "This page lists 31. Going by the names, cool ones include Double Mint, Cool Mint and Spearmint, fruit includes Grape, Watermelon, Lychee and Pink Guava, and others include Cola, Jasmine Tea and Rainbow Candy. The groups are ours, not RELX's." },
        { question: "Do RELX Creator 20K pods come in 5%?", answer: "The list has 8 flavours with 5% at the end of the name, such as Grape 5%, Double Mint 5% and Classic Tobacco 5%. Check the name before you choose." },
      ],
    },
    zh: {
      sections: [],
      faq: [
        { question: "RELX Creator Pod 20K 适配哪款主机？", answer: "适配 [RELX Creator](/products/relx-creator)，已经本店以实物确认。购买前请再核对一次自己的主机型号。" },
        { question: "RELX Creator 烟弹有哪些口味？", answer: "本页共列出 31 种口味。按名称来分，清凉系有 Double Mint、Cool Mint、Spearmint 等，水果系有 Grape、Watermelon、Lychee、Pink Guava 等，其他还有 Cola、Jasmine Tea、Rainbow Candy 等。分类由本店按名称整理，并非 RELX 官方分类。" },
        { question: "RELX Creator 20K 烟弹有 5% 的吗？", answer: "口味列表里有 8 种名称以 5% 结尾的口味，例如 Grape 5%、Double Mint 5%、Classic Tobacco 5%。选择前请再核对一次名称。" },
      ],
    },
  },
  // Pack facts = the owner's pouch photos 03/11 (RELX LUMI 18K Aloe Grape, front + back). Flavours = max-seed "RELX-LUMI-18K",
  // grouped by the shop from the words in each name. No charging, coil, airflow or days-of-use claim: nothing printed or confirmed.
  // The pack's QR and verify code stay out until someone scans one (relxnow.com has no LUMI page). The 5% rows: only the flavour
  // names say so, no 5% pouch seen. en/zh leave out the guide link: /guides/how-long-a-disposable-lasts is thaiOnly. thai-copy 06/11.
  "relx-lumi-18k": {
    th: {
      lede: "ถ้ากำลังเลือก RELX LUMI 18K อยู่ ด้านล่างร้านเล่าให้ฟังว่าตัวเลขและคำบนซองหมายถึงอะไร จัดกลิ่นเป็นสายให้เลือกได้ง่ายขึ้น และเทียบให้ดูกับรุ่นใกล้เคียงด้วย",
      sections: [
        {
          heading: "RELX LUMI 18K สูบได้กี่พัฟ",
          paragraphs: [
            "ด้านหน้าซองพิมพ์ตัวเลขไว้ชัดเจนว่า 18,000 พัฟ ส่วนด้านหลังซองมีหมายเหตุสั้น ๆ ว่า Based on consumption จะสูบได้ใกล้ตัวเลขนี้แค่ไหนจึงขึ้นกับการใช้งานของแต่ละคน",
            "เครื่องหนึ่งใช้ได้กี่วันก็ขึ้นกับว่าสูบบ่อยแค่ไหน ร้านเล่าไว้ละเอียดที่ [พอตใช้แล้วทิ้ง ใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts)",
          ],
        },
        {
          heading: "RELX LUMI 18K กลิ่นไหนดี",
          paragraphs: [
            "กลิ่นไหนดีขึ้นอยู่กับว่าชอบแนวไหน ลองเริ่มจากสายที่ชอบก่อนก็ได้ ร้านจัดสายจากคำในชื่อกลิ่น จึงเป็นการจัดของร้านเอง ไม่ใช่การแบ่งของ RELX",
            "สายเย็นมี Double Mint ส่วนสายองุ่นมี Grape กับ Aloe Grape",
            "สายผลไม้มี 5 กลิ่น คือ Watermelon · Mixberry · Apple Aloe · Pink Guava และ Lychee",
            "แนวอื่นมี Jasmine Green Tea · Gummy · Mineral Water · Sea Salt Lemon Candy และ Cola ชื่อในกลุ่มนี้เป็นชา ขนม และเครื่องดื่ม ส่วน Sea Salt Lemon Candy แม้มีมะนาวในชื่อ ร้านก็จัดตามคำหลักของชื่อ",
            "Double Mint · Watermelon และ Grape มีอีกแบบที่ชื่อมี 5% ต่อท้ายด้วย รวมเป็น 16 กลิ่น ก่อนกดเลือก ลองดูชื่อในรายการอีกครั้งให้ตรงกับแบบที่ต้องการ",
          ],
        },
        {
          heading: "คำบนซอง RELX LUMI 18K หมายถึงอะไร",
          paragraphs: [
            "Clear Tank หมายถึงถังน้ำยาใส รูปเครื่องบนซองก็เห็นส่วนบนเป็นสีใสตามชื่อ ส่วน POCKET SIZE หมายถึงขนาดที่พกใส่กระเป๋าได้ และ Rich & Smooth เป็นคำโปรยของ RELX แปลตรงตัวว่าเข้มและนุ่ม",
            "ด้านหลังซองยังพิมพ์ชื่อ RELX Lumi รหัสรุ่น M01CMA และชื่อบริษัท Shenzhen RELX Technology Co.,Ltd ไว้ด้วย ถ้าอยากดูให้ตรงรุ่น ก็เช็คจากตรงนี้ได้",
          ],
        },
        {
          heading: "RELX LUMI 18K กับ SUP ZERO 22K ต่างกันยังไง",
          paragraphs: [
            "ทั้งสองรุ่นเป็นพอตใช้แล้วทิ้งเหมือนกัน ต่างกันที่ตัวเลขบนซองและแนวกลิ่น [SUP ZERO 22K](/products/sup-zero-22k) พิมพ์จำนวนพัฟไว้สูงกว่าที่ 22,000 พัฟ แบต 850mAh ส่วนรุ่นนี้แบต 670mAh",
            "ปริมาณน้ำยาพิมพ์ไว้เฉพาะบนซอง SUP ZERO 22K ที่ 25mL จึงเทียบกับ LUMI ตรงนี้ไม่ได้ ถ้าชอบแนวชาหรือขนม รุ่นนี้มี Jasmine Green Tea กับ Gummy ส่วนกลิ่นที่ชื่อมีคำว่า Ice จะอยู่ฝั่ง SUP ZERO 22K",
            "ถ้าอยากดู RELX อีกรุ่น [RELX Smash Go 12K](/products/relx-smash-go-12k) ก็เป็นพอตใช้แล้วทิ้งเช่นกัน RELX ระบุไว้สูงสุด 12,000 พัฟ แบต 400mAh",
          ],
        },
      ],
      faq: [
        {
          question: "RELX LUMI 18K นิโคตินกี่ %",
          answer: "ซองกลิ่น Aloe Grape พิมพ์ไว้ 3% ค่ะ และในรายการมีอีก 3 กลิ่นที่ชื่อมี 5% ต่อท้าย ก่อนสั่งลองดูชื่อให้ตรงกับแบบที่ต้องการนะคะ",
        },
        {
          question: "RELX LUMI 18K กลิ่นไหนเย็น",
          answer: "ถ้าดูจากชื่อ กลิ่นที่ร้านจัดไว้ในสายเย็นคือ Double Mint ซึ่งมีแบบ Double Mint 5% ด้วยค่ะ",
        },
        {
          question: "RELX LUMI 18K มีส่วนผสมอะไรบ้าง",
          answer: "ด้านหลังซองระบุ Glycerin · Propylene Glycol · Flavors · Nicotine และ Benzoic Acid ค่ะ",
        },
      ],
    },
    en: {
      lede: "Choosing a RELX LUMI 18K? Below, we explain what the numbers and words on the pouch mean, sort the flavours into groups to make picking easier, and compare it with nearby models.",
      sections: [
        {
          heading: "How many puffs does the RELX LUMI 18K give?",
          paragraphs: [
            "The front of the pouch prints 18000 PUFFS, and a short note on the back reads “Based on consumption”, so how close you get depends on how you vape.",
          ],
        },
        {
          heading: "Which RELX LUMI 18K flavour should I start with?",
          paragraphs: [
            "Start with the kind of flavour you like. The groups below are ours, based on the words in each name, not RELX's own.",
            "Cool is Double Mint, and grape is Grape and Aloe Grape.",
            "Fruit has five: Watermelon, Mixberry, Apple Aloe, Pink Guava and Lychee.",
            "The rest are Jasmine Green Tea, Gummy, Mineral Water, Sea Salt Lemon Candy and Cola, named after a tea, sweets and drinks. Sea Salt Lemon Candy has a fruit in its name, but we group it by the main word.",
            "Double Mint, Watermelon and Grape each have a second version with 5% at the end of the name, which brings the list to 16. Check the name in the list before you choose.",
          ],
        },
        {
          heading: "What do the words on the pouch mean?",
          paragraphs: [
            "Clear Tank means a see-through e-liquid tank, and the device pictured on the pouch does have a clear top section. POCKET SIZE means it's small enough for a pocket, and Rich & Smooth is RELX's own tagline.",
            "The back also prints the name RELX Lumi, the model code M01CMA and the company, Shenzhen RELX Technology Co.,Ltd, so you can check you have the right model.",
          ],
        },
        {
          heading: "RELX LUMI 18K or SUP ZERO 22K?",
          paragraphs: [
            "Both are disposables. They differ in the numbers on the pack and in their flavours. The [SUP ZERO 22K](/products/sup-zero-22k) prints a higher puff figure, 22,000, and an 850mAh battery, against 670mAh here.",
            "It also prints 25mL of e-liquid. The LUMI pouch gives no e-liquid figure, so that can't be compared. For tea or sweets, the LUMI has Jasmine Green Tea and Gummy; for names with Ice in them, look at the SUP ZERO 22K.",
            "For another RELX, the [RELX Smash Go 12K](/products/relx-smash-go-12k) is also a disposable, rated by RELX for up to 12,000 puffs with a 400mAh battery.",
          ],
        },
      ],
      faq: [
        {
          question: "What nicotine strength is the RELX LUMI 18K?",
          answer: "The Aloe Grape pouch prints 3%. Three more flavours in the list have 5% at the end of the name, so check the name before you order.",
        },
        {
          question: "Which RELX LUMI 18K flavour is cool?",
          answer: "Going by the names, Double Mint, which also comes as Double Mint 5%.",
        },
        {
          question: "What are the RELX LUMI 18K's ingredients?",
          answer: "The back of the pouch lists glycerin, propylene glycol, flavors, nicotine and benzoic acid.",
        },
      ],
    },
    zh: {
      lede: "正在考虑 RELX LUMI 18K？下面说明包装上的数字和文字是什么意思，把口味分好组方便挑选，并和相近的型号做个比较。",
      sections: [
        {
          heading: "RELX LUMI 18K 能抽多少口？",
          paragraphs: [
            "包装袋正面印有 18000 PUFFS，背面有一行小字“Based on consumption”，所以实际能抽多少取决于个人使用情况。",
          ],
        },
        {
          heading: "RELX LUMI 18K 哪个口味好？",
          paragraphs: [
            "可以先从喜欢的类型选起。下面的分组是本店按口味名称里的词整理的，并非 RELX 官方分类。",
            "清凉类是 Double Mint，葡萄类有 Grape 和 Aloe Grape。",
            "水果类有 5 款：Watermelon、Mixberry、Apple Aloe、Pink Guava 和 Lychee。",
            "其余是 Jasmine Green Tea、Gummy、Mineral Water、Sea Salt Lemon Candy 和 Cola，名称分别是茶、糖果和饮品。Sea Salt Lemon Candy 的名称里虽然有柠檬，我们按主词归在这一类。",
            "Double Mint、Watermelon 和 Grape 还各有一款名称后带 5% 的版本，一共 16 个选项。下单前请再核对一下列表里的名称。",
          ],
        },
        {
          heading: "包装上的文字是什么意思？",
          paragraphs: [
            "Clear Tank 指透明油仓，包装上的机身图片顶部也是透明的。POCKET SIZE 指大小可以放进口袋，Rich & Smooth 是 RELX 印在包装上的宣传语。",
            "背面还印有名称 RELX Lumi、型号 M01CMA 和公司名 Shenzhen RELX Technology Co.,Ltd，可以据此核对型号。",
          ],
        },
        {
          heading: "RELX LUMI 18K 和 SUP ZERO 22K 怎么选？",
          paragraphs: [
            "两款都是一次性设备，不同在包装上的数字和口味。[SUP ZERO 22K](/products/sup-zero-22k) 标注的口数更高，为 22,000 口，电池 850mAh，这款是 670mAh。",
            "SUP ZERO 22K 还标明烟油 25mL，而 LUMI 的包装没有印这个数字，这一项无法比较。喜欢茶或糖果类，LUMI 有 Jasmine Green Tea 和 Gummy；想找名称里带 Ice 的口味，可以看 SUP ZERO 22K。",
            "还想看 RELX 的其他型号，[RELX Smash Go 12K](/products/relx-smash-go-12k) 同样是一次性设备，RELX 标称最高 12,000 口，电池 400mAh。",
          ],
        },
      ],
      faq: [
        {
          question: "RELX LUMI 18K 尼古丁浓度是多少？",
          answer: "Aloe Grape 的包装印有 3%。列表里另有 3 款名称后带 5%，下单前请核对名称。",
        },
        {
          question: "RELX LUMI 18K 哪个口味清凉？",
          answer: "从名称看是 Double Mint，另有 Double Mint 5% 版本。",
        },
        {
          question: "RELX LUMI 18K 有哪些成分？",
          answer: "包装背面列出的成分是甘油、丙二醇、香料、尼古丁和苯甲酸。",
        },
      ],
    },
  },
  // Pack facts = the owner's pouch photos 03/11 (SUP ZERO 22K Grape Lychee, two sides); there is no back-panel photo. Flavours = max-seed
  // "SUP-ZERO-22K", grouped by the shop. No charging, coil, airflow, days-of-use, maker or ingredient claim. Stock states stay with the
  // cart, so the list names Apple Aloe Vera without saying it is out of stock. en/zh leave out the guide link: /guides/how-long-a-disposable-lasts is thaiOnly. thai-copy 06/11.
  "sup-zero-22k": {
    th: {
      lede: "ก่อนเลือก SUP ZERO 22K ด้านล่างร้านสรุปตัวเลขบนซองให้อ่านง่าย จัดกลิ่นเป็นสายให้เลือกได้สะดวกขึ้น และเทียบให้ดูกับรุ่นใกล้เคียงว่าต่างกันตรงไหน",
      sections: [
        {
          heading: "SUP ZERO 22K สูบได้กี่พัฟ",
          paragraphs: [
            "ตัวเลข 22K ที่เห็นตัวใหญ่บนซองคือจำนวนพัฟ เพราะด้านล่างของซองพิมพ์กำกับไว้ว่า 22,000 พัฟ จะสูบได้ใกล้ตัวเลขนี้แค่ไหนก็ขึ้นกับวิธีสูบของแต่ละคน",
            "เครื่องหนึ่งใช้ได้กี่วันก็ขึ้นกับว่าสูบบ่อยแค่ไหน ร้านเล่าไว้ละเอียดที่ [พอตใช้แล้วทิ้ง ใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts)",
          ],
        },
        {
          heading: "SUP ZERO 22K กลิ่นไหนดี",
          paragraphs: [
            "แต่ละคนชอบรสไม่เหมือนกัน ลองเริ่มจากสายที่ชอบก่อนก็ได้ ร้านจัดสายจากคำในชื่อกลิ่น จึงเป็นการจัดของร้านเอง ไม่ได้มาจากบนซอง",
            "สายเย็นมี 5 กลิ่น ชื่อมีคำว่า Ice หรือ Mint คือ Grape Ice · Strawberry Ice · Blueberry Ice · Lychee Ice และ Double Mint",
            "สายผลไม้มี Grape Lychee · Watermelon · Peach Strawberry · Mixberry และ Apple Aloe Vera ส่วนแนวอื่นมี Cola",
            "ห้ากลิ่นมีอีกแบบที่ชื่อมี 5% ต่อท้าย คือ Grape Ice 5% · Grape Lychee 5% · Mixberry 5% · Watermelon 5% และ Double Mint 5% ก่อนกดเลือก ลองดูชื่อในรายการอีกครั้งให้ตรงกับแบบที่ต้องการ",
          ],
        },
        {
          heading: "SUP ZERO 22K หน้าตาเป็นยังไง",
          paragraphs: [
            "รูปบนซองเป็นตัวเครื่องสีดำทรงกระบอก มีโลโก้ตัว Z กับชื่อ SUP ZERO และมีสัญลักษณ์ไพ่สี่ดอกเรียงอยู่ใต้ชื่อ ส่วนตัวอักษรญี่ปุ่นที่พิมพ์กำกับไว้อ่านว่า Royal Flush ซึ่งเข้ากับลายไพ่บนซองและตัวเครื่อง",
          ],
        },
        {
          heading: "SUP ZERO 22K กับ RELX LUMI 18K ต่างกันยังไง",
          paragraphs: [
            "ทั้งสองรุ่นเป็นพอตใช้แล้วทิ้งเหมือนกัน ต่างกันที่ตัวเลขบนซองและแนวกลิ่น รุ่นนี้พิมพ์แบต 850mAh และน้ำยา 25mL ส่วน [RELX LUMI 18K](/products/relx-lumi-18k) พิมพ์ 18,000 พัฟ แบต 670mAh และไม่ได้บอกปริมาณน้ำยาไว้บนซอง จึงเทียบกันตรงนี้ไม่ได้",
            "ถ้าชอบกลิ่นที่ชื่อมีคำว่า Ice รุ่นนี้มีให้เลือกหลายกลิ่น ส่วนถ้าชอบแนวชาหรือขนม LUMI มี Jasmine Green Tea กับ Gummy",
            "ถ้าอยากเทียบกับอีกแบรนด์ [ESKO BAR 20000](/products/esko-bar-20k) ก็เป็นพอตใช้แล้วทิ้งเหมือนกัน ESKO BAR ระบุไว้สูงสุด 20,000 พัฟ แบต 600mAh และน้ำยา 18mL",
          ],
        },
      ],
      faq: [
        {
          question: "SUP ZERO 22K นิโคตินกี่ %",
          answer: "ซองกลิ่น Grape Lychee พิมพ์ไว้ 3% ค่ะ และในรายการมีอีก 5 กลิ่นที่ชื่อมี 5% ต่อท้าย ก่อนสั่งลองดูชื่อให้ตรงกับแบบที่ต้องการนะคะ",
        },
        {
          question: "SUP ZERO 22K กลิ่นไหนเย็น",
          answer: "ถ้าดูจากชื่อ สายเย็นมี Grape Ice · Strawberry Ice · Blueberry Ice · Lychee Ice และ Double Mint ค่ะ",
        },
        {
          question: "SUP ZERO 22K น้ำยากี่ mL",
          answer: "ซองพิมพ์ไว้ 25mL ค่ะ แต่ละยี่ห้อระบุตัวเลขพัฟต่างกัน เวลาเทียบกับรุ่นอื่นจึงควรดูตัวเลขนี้คู่กันไปด้วยนะคะ",
        },
      ],
    },
    en: {
      lede: "Before you choose a SUP ZERO 22K, here are the numbers on the pouch in plain terms, the flavours sorted into groups, and how it compares with nearby models.",
      sections: [
        {
          heading: "How many puffs does the SUP ZERO 22K give?",
          paragraphs: [
            "The big 22K on the pouch is the puff count: the lower part of the pouch prints 22000 PUFFS. How close you get depends on how you vape.",
          ],
        },
        {
          heading: "Which SUP ZERO 22K flavour should I start with?",
          paragraphs: [
            "Start with the kind of flavour you like. The groups below are ours, based on the words in each name; they aren't printed on the pack.",
            "Cool has five, with Ice or Mint in the name: Grape Ice, Strawberry Ice, Blueberry Ice, Lychee Ice and Double Mint.",
            "Fruit is Grape Lychee, Watermelon, Peach Strawberry, Mixberry and Apple Aloe Vera, and the other flavour is Cola.",
            "Five also come with 5% at the end of the name: Grape Ice 5%, Grape Lychee 5%, Mixberry 5%, Watermelon 5% and Double Mint 5%. Check the name in the list before you choose.",
          ],
        },
        {
          heading: "What does the SUP ZERO 22K look like?",
          paragraphs: [
            "The pouch shows a black cylindrical device with a Z logo and the name SUP ZERO, with the four card suits in a row beneath the name. The Japanese text printed with the name reads Royal Flush, which fits the playing-card theme.",
          ],
        },
        {
          heading: "SUP ZERO 22K or RELX LUMI 18K?",
          paragraphs: [
            "Both are disposables. They differ in the numbers on the pack and in their flavours. This one prints an 850mAh battery and 25mL of e-liquid, while the [RELX LUMI 18K](/products/relx-lumi-18k) prints 18,000 puffs and a 670mAh battery. Its pouch gives no e-liquid figure, so that can't be compared.",
            "For names with Ice in them, this one has several. For tea or sweets, the LUMI has Jasmine Green Tea and Gummy.",
            "To compare another brand, the [ESKO BAR 20000](/products/esko-bar-20k) is also a disposable, rated by ESKO BAR for up to 20,000 puffs with a 600mAh battery and 18mL of e-liquid.",
          ],
        },
      ],
      faq: [
        {
          question: "What nicotine strength is the SUP ZERO 22K?",
          answer: "The Grape Lychee pouch prints 3%. Five more flavours in the list have 5% at the end of the name, so check the name before you order.",
        },
        {
          question: "Which SUP ZERO 22K flavours are cool?",
          answer: "Going by the names: Grape Ice, Strawberry Ice, Blueberry Ice, Lychee Ice and Double Mint.",
        },
        {
          question: "How much e-liquid does the SUP ZERO 22K hold?",
          answer: "The pouch prints 25mL. Brands state puff counts differently, so it helps to compare this figure as well.",
        },
      ],
    },
    zh: {
      lede: "选购 SUP ZERO 22K 之前，下面帮你读懂包装上的数字，把口味分好组，并和相近的型号做个比较。",
      sections: [
        {
          heading: "SUP ZERO 22K 能抽多少口？",
          paragraphs: [
            "包装上的大字 22K 指的是口数，包装下方印有 22000 PUFFS。实际能抽多少，取决于个人的抽法。",
          ],
        },
        {
          heading: "SUP ZERO 22K 哪个口味好？",
          paragraphs: [
            "可以先从喜欢的类型选起。下面的分组是本店按口味名称里的词整理的，包装上并没有这样的分类。",
            "清凉类有 5 款，名称里带 Ice 或 Mint：Grape Ice、Strawberry Ice、Blueberry Ice、Lychee Ice 和 Double Mint。",
            "水果类有 Grape Lychee、Watermelon、Peach Strawberry、Mixberry 和 Apple Aloe Vera，其余一款是 Cola。",
            "另有 5 款名称后带 5%：Grape Ice 5%、Grape Lychee 5%、Mixberry 5%、Watermelon 5% 和 Double Mint 5%。下单前请再核对一下列表里的名称。",
          ],
        },
        {
          heading: "SUP ZERO 22K 长什么样？",
          paragraphs: [
            "包装上的机身是黑色圆柱形，印有 Z 字标志和 SUP ZERO 名称，名称下方排列着四种扑克花色。名称旁的日文读作 Royal Flush，正好呼应扑克牌的设计。",
          ],
        },
        {
          heading: "SUP ZERO 22K 和 RELX LUMI 18K 怎么选？",
          paragraphs: [
            "两款都是一次性设备，不同在包装上的数字和口味。这款印有 850mAh 电池和 25mL 烟油；[RELX LUMI 18K](/products/relx-lumi-18k) 印有 18,000 口和 670mAh 电池，包装上没有烟油容量，这一项无法比较。",
            "想找名称里带 Ice 的口味，这款有好几种；喜欢茶或糖果类，LUMI 有 Jasmine Green Tea 和 Gummy。",
            "想比较其他品牌，[ESKO BAR 20000](/products/esko-bar-20k) 同样是一次性设备，ESKO BAR 标称最高 20,000 口，电池 600mAh，烟油 18mL。",
          ],
        },
      ],
      faq: [
        {
          question: "SUP ZERO 22K 尼古丁浓度是多少？",
          answer: "Grape Lychee 的包装印有 3%。列表里另有 5 款名称后带 5%，下单前请核对名称。",
        },
        {
          question: "SUP ZERO 22K 哪些口味清凉？",
          answer: "从名称看，有 Grape Ice、Strawberry Ice、Blueberry Ice、Lychee Ice 和 Double Mint。",
        },
        {
          question: "SUP ZERO 22K 烟油有多少？",
          answer: "包装印有 25mL。各品牌标注口数的方式不同，比较时建议同时看这个数字。",
        },
      ],
    },
  },
  // Articles queue 0211 batch 5 (02/11): UWELL Caliburn G2 empty pod — every fact = UWELL's Caliburn G2 page
  // (myuwell.com/caliburn/caliburn-g2, in-app browser 02/11; quotes in the batch notes). "หัวพอตเปล่า" = THAI_STYLE §3 ·
  // "ช่องใสให้ดูน้ำยา" = the site's existing term (story-copy). Thai = thai-copy 02/11.
  "coil-55": {
    th: {
      lede: "ด้านล่างเล่าตามข้อมูลของ UWELL ว่าช่องเติมแบบนี้ดียังไง ช่องใสให้ดูน้ำยาช่วยอะไร หัวนี้ใส่คอยล์ค่าไหนได้บ้าง และต่างจากหัวพอตของ Caliburn X ตรงไหน",
      sections: [
        {
          heading: "ทำไมช่องเติมถึงอยู่ด้านบน",
          paragraphs: [
            "UWELL บอกว่าการเติมแบบนี้ทำได้ง่าย ไม่ต้องออกแรงมาก และไม่เสียเวลา จะเติมน้ำยาตอนอยู่นอกบ้านก็สะดวก นอกจากนั้นช่องเติมตรงนี้ยังช่วยให้หัวกันรั่วได้ดีขึ้นด้วย",
          ],
        },
        {
          heading: "ช่องใสให้ดูน้ำยามีไว้ทำอะไร",
          paragraphs: [
            "ตัวเครื่อง Caliburn G2 มีช่องใสให้ดูน้ำยา มองเห็นได้ว่าน้ำยาเหลืออยู่เท่าไร UWELL บอกว่าช่องนี้ช่วยลดโอกาสที่น้ำยาจะหมดก่อนได้เติม",
          ],
        },
        {
          heading: "ใส่คอยล์ค่าไหนได้บ้าง",
          paragraphs: [
            "ในกล่องชุด Caliburn G2 มีคอยล์ mesh มาให้สองตัว ตัว 1.2 โอห์มติดมากับเครื่อง ใช้สูบแบบ MTL ส่วนตัว 0.8 โอห์มเป็นคอยล์ Caliburn G ใช้สูบ DTL แบบลมแน่น นอกจากสองตัวนี้ UWELL บอกว่าเครื่องนี้ใช้คอยล์ Caliburn G 1.0 โอห์มได้ด้วย",
            "คอยล์ทั้งสามค่ามีให้เลือกที่หน้า [คอยล์ Caliburn G](/products/coil-53)",
          ],
        },
        {
          heading: "ต่างจากหัวของ Caliburn X ตรงไหน",
          paragraphs: [
            "หัวของ Caliburn X ใช้คอยล์ตระกูลเดียวกันนี้ได้ ที่ต่างกันคือหัวนั้นจุน้ำยาได้ 3mL มากกว่าหัวนี้ และเป็นหัวพอตของอีกชุดหนึ่ง ถ้าใช้เครื่อง Caliburn X อยู่ หัวที่ตรงรุ่นคือ [หัวพอต Caliburn X](/products/coil-74)",
            "ถ้าอยากรู้ว่าคอยล์ถึงรอบเปลี่ยนเมื่อไหร่ และใส่คอยล์ใหม่แล้วควรรอนานแค่ไหนก่อนสูบ อ่านต่อได้ที่ [วิธีดูแลคอยล์และหัวพอต](/guides/coil-and-pod-maintenance)",
          ],
        },
      ],
    },
    en: {
      lede: "Below, based on UWELL's own information: why the fill port sits where it does, what the check window is for, which coils this pod takes, and how it differs from the Caliburn X pod.",
      sections: [
        {
          heading: "Why is the fill port on top?",
          paragraphs: [
            "UWELL says filling this way is easy, takes less effort and saves time, which makes it well suited to refilling on the go. Placing the port there also makes the pod more leak-resistant.",
          ],
        },
        {
          heading: "What is the liquid check window for?",
          paragraphs: [
            "The Caliburn G2 has an e-liquid check window, so you can see how much e-liquid is left. UWELL says it makes running out before you've refilled less likely.",
          ],
        },
        {
          heading: "Which coils does it take?",
          paragraphs: [
            "The Caliburn G2 kit comes with two mesh coils: the 1.2Ω, fitted, for MTL vaping, and the 0.8Ω, a Caliburn G coil, for a restricted DTL draw. UWELL says the Caliburn G2 also takes the Caliburn G 1.0Ω coil. All three resistances are available on the [Caliburn G coils](/products/coil-53) page.",
          ],
        },
        {
          heading: "How is it different from the Caliburn X pod?",
          paragraphs: [
            "The Caliburn X pod takes the same family of coils. The difference is that it holds 3 mL, more than this pod, and belongs to a different kit. If your device is a Caliburn X, the [Caliburn X pod](/products/coil-74) is the one to choose. To tell when a coil is due for a change, and how to prime a freshly filled pod, see [coil and pod maintenance](/guides/coil-and-pod-maintenance).",
          ],
        },
      ],
    },
    zh: {
      lede: "下面根据 UWELL 的资料，介绍注油口为什么这样设计、观察窗有什么用、这款烟弹能装哪些线圈，以及与 Caliburn X 烟弹的区别。",
      sections: [
        {
          heading: "为什么注油口在顶部？",
          paragraphs: [
            "UWELL 表示，这样注油方便省力、节省时间，在外补油也很合适；注油口设在这个位置，还能让烟弹更防漏。",
          ],
        },
        {
          heading: "观察窗有什么用？",
          paragraphs: [
            "Caliburn G2 机身设有烟油观察窗，可以看到烟油还剩多少。UWELL 表示，它能减少烟油用完却还没来得及补油的情况。",
          ],
        },
        {
          heading: "能装哪些线圈？",
          paragraphs: [
            "Caliburn G2 套装附带两颗网状线圈：出厂装好的 1.2Ω 用于 MTL 口吸，另一颗 0.8Ω 是 Caliburn G 线圈，用于偏紧的 DTL 肺吸。UWELL 表示 Caliburn G2 还能用 Caliburn G 的 1.0Ω 线圈。三款线圈可在[Caliburn G 线圈](/products/coil-53)页面查看。",
          ],
        },
        {
          heading: "和 Caliburn X 烟弹有什么不同？",
          paragraphs: [
            "Caliburn X 烟弹用的是同一系列线圈，区别在于它能装 3 mL 烟油，比这款多，而且属于另一套设备。如果用的是 Caliburn X，请选择 [Caliburn X 烟弹](/products/coil-74)。想知道线圈什么时候该换、新烟弹注油后要静置多久，请看[线圈与烟弹保养](/guides/coil-and-pod-maintenance)。",
          ],
        },
      ],
    },
  },
  // Articles queue 0211 batch 5 (02/11): INFY device — every fact = infy.my (device, 2.5ML + 2ML cartridge and authenticity pages,
  // WebFetch 02/11; quotes in the batch notes). No colour count: INFY's own page gives "3" and "19" designs. Finishes line not
  // used ("go beyond matte, glossy, and gradient" does not say the device comes in those). Magnet = the 2ML page only, said so.
  // INFY Plus → this device is already in the tagline + fit card, so section 3 only adds the 2 mL pod (fact-twice rule). Thai = thai-copy 02/11.
  "infy-pod": {
    th: {
      lede: "ด้านล่างนี้สรุปจากเว็บของ INFY ว่าไฟบนตัวเครื่องบอกอะไร ใส่หัวพอตยังไง ใช้กับหัวพอตแบบไหนได้บ้าง และเช็คของแท้ได้ยังไง",
      sections: [
        {
          heading: "ไฟบนเครื่องบอกอะไร",
          paragraphs: [
            "INFY อธิบายว่าไฟ LED หลายสีบนตัวเครื่องจะบอกสถานะให้รู้ ทั้งตอนชาร์จ ตอนสูบ และตอนที่ใส่หัวพอตใหม่เข้าไป ถ้าเห็นไฟสีแดงกะพริบ แปลว่าแบตเหลือ 30% หรือน้อยกว่า ส่วนไฟสีขาวแปลว่าแบตเหลือมากกว่า 70%",
            "INFY บอกว่าแบต 400mAh ชาร์จผ่าน USB-C และช่วยให้สูบได้ต่อเนื่องโดยไม่ต้องหยุดชาร์จบ่อย",
            "วิธีชาร์จและดูแลแบตให้ใช้ได้นาน อ่านต่อได้ที่ [ชาร์จพอตกี่นาทีถึงเต็ม ชาร์จข้ามคืนได้ไหม และวิธีดูแลแบต](/guides/battery-care-and-charging)",
          ],
        },
        {
          heading: "ใส่หัวพอตยังไง",
          paragraphs: [
            "ก่อนใส่หัวพอต ให้ดึงซีลยางที่ปิดด้านบนและด้านล่างของหัวออก แล้วค่อยเสียบเข้าเครื่อง ในหน้าหัวพอต 2mL ของ INFY บอกไว้ว่าหัวพอตยึดกับตัวเครื่องด้วยแม่เหล็ก ใส่แล้วแน่นและไม่เลอะ",
          ],
        },
        {
          heading: "ใช้กับหัวพอตแบบไหนได้",
          paragraphs: [
            "นอกจากหัว INFY Plus แล้ว หน้าหัวพอต 2mL ของ INFY ก็ระบุว่าหัว 2mL ใส่ในเครื่องนี้ได้เหมือนกัน และใส่ในเครื่อง INFY Cube Box ได้ด้วย ร้านเรามี [หัวพอต INFY PLUS](/products/pod-169) ให้เลือกหลายกลิ่น",
          ],
        },
        {
          heading: "เช็คของแท้ยังไง",
          paragraphs: [
            "สินค้าทุกชิ้นของ INFY มีรหัสไว้เช็คของแท้ ที่กล่องจะมีสติกเกอร์ซีเรียลติดอยู่ ให้ขูดชั้นเคลือบออก แล้วสแกน QR code ที่อยู่ข้างใต้ด้วยกล้องมือถือ จากนั้นนำรหัสที่เห็นไปกรอกในเว็บของ INFY เพื่อตรวจสอบ",
            "วิธีเช็คของแท้ของแบรนด์อื่น ๆ อ่านต่อได้ที่ [พอตของแท้ ดูยังไง เช็คเองได้ที่เว็บทางการของแบรนด์](/guides/checking-a-genuine-pod)",
          ],
        },
      ],
      faq: [
        { question: "เครื่อง INFY ใช้หัว INFY รุ่นไหนได้", answer: "ใช้หัว INFY ขนาด 2.5mL ได้ค่ะ ร้านลงไว้ในชื่อ [หัวพอต INFY PLUS](/products/pod-169) และ INFY ยังระบุว่าหัวขนาดเล็กกว่าของแบรนด์ก็ใส่เครื่องนี้ได้เช่นกันค่ะ" },
        { question: "INFY POD เป็นพอตเปลี่ยนหัวใช่ไหม", answer: "ใช่ค่ะ INFY POD เป็นพอตเปลี่ยนหัว หรือที่เว็บเราเรียกว่าเครื่องระบบสวิตช์ มีแบต 400mAh ชาร์จผ่าน USB-C พอน้ำยาในหัวหมดก็เปลี่ยนเฉพาะหัว แล้วใช้เครื่องเดิมต่อได้ค่ะ" },
        { question: "INFY POD มีหัวพอตมาในกล่องไหม", answer: "ไม่มีค่ะ ในกล่องมีตัวเครื่อง สาย USB-C และคู่มือ ส่วนหัวพอตเลือกกลิ่นที่ชอบแยกต่างหากได้เลยค่ะ" },
        { question: "เครื่อง INFY ไฟสีแดงกะพริบแปลว่าอะไร", answer: "แปลว่าแบตเหลือน้อยแล้วค่ะ เสียบชาร์จผ่าน USB-C ได้เลย ส่วนไฟสีขาวแปลว่าแบตยังเหลือมากค่ะ" },
      ],
    },
    en: {
      lede: "Below, from INFY's own site: what the lights mean, how to fit a pod, which pods it takes, and how to check it is genuine.",
      sections: [
        {
          heading: "What do the lights mean?",
          paragraphs: [
            "INFY says the multi-coloured LEDs on the device show when it is charging, when you are vaping and when a new pod goes in. A flashing red light means 30% battery or less; a white light means more than 70%.",
            "INFY says the 400mAh battery keeps you vaping for longer without stopping to charge often, and it charges over USB-C. For charging and battery care, see [Battery Care & Charging Basics](/guides/battery-care-and-charging).",
          ],
        },
        {
          heading: "How do I fit a pod?",
          paragraphs: [
            "Pull the rubber seals off the top and bottom of the pod, then push it into the device. On its 2 mL pod page, INFY says the pod connects to the device by magnet, for a secure, mess-free fit.",
          ],
        },
        {
          heading: "Which pods does it take?",
          paragraphs: [
            "Besides the INFY Plus, INFY's 2 mL pod page says that pod fits this device too, and the INFY Cube Box as well. We carry the [INFY PLUS pods](/products/pod-169) in a range of flavours.",
          ],
        },
        {
          heading: "How do I check it is genuine?",
          paragraphs: [
            "INFY says every INFY product carries an authenticity code. Find the serial-number sticker on the box, scratch off the coating to reveal a QR code, scan it with your phone camera, then enter the code on INFY's website to verify it.",
          ],
        },
      ],
      faq: [
        { question: "Which INFY pods does the INFY device take?", answer: "It takes the 2.5mL INFY pod, which we list as the [INFY PLUS pod](/products/pod-169). INFY says its smaller pod fits this device too." },
        { question: "Is the INFY POD a device with replaceable pods?", answer: "Yes. The INFY POD is a reusable device with a 400mAh battery and USB-C charging. When a pod runs out, you change only the pod and keep the same device." },
        { question: "Does the INFY POD come with a pod in the box?", answer: "No. The box holds the device, a USB-C cable and a manual, and you choose your pod flavour separately." },
        { question: "What does a flashing red light on the INFY device mean?", answer: "It means the battery is low, so it's time to charge over USB-C. A white light means there's still plenty left." },
      ],
    },
    zh: {
      lede: "以下内容整理自 INFY 官网：机身灯光代表什么、怎么装烟弹、适用哪些烟弹，以及如何验证正品。",
      sections: [
        {
          heading: "灯光代表什么？",
          paragraphs: [
            "INFY 表示，机身的多色 LED 会显示充电、抽吸以及装入新烟弹的状态。红灯闪烁表示电量在 30% 或以下；白灯表示电量高于 70%。",
            "INFY 表示，400mAh 电池可支持较长时间连续使用，无需频繁中断充电；机身通过 USB-C 充电。充电与电池保养方法见[电池保养与充电基础](/guides/battery-care-and-charging)。",
          ],
        },
        {
          heading: "怎么装烟弹？",
          paragraphs: [
            "先取下烟弹顶部和底部的橡胶塞，再插入机身。INFY 在 2 mL 烟弹页面中表示，烟弹与机身以磁吸连接，装得稳、不弄脏。",
          ],
        },
        {
          heading: "适用哪些烟弹？",
          paragraphs: [
            "除了 INFY Plus，INFY 的 2 mL 烟弹页面也写明，这款烟弹同样能装在这台设备上，也适用于 INFY Cube Box。本店有多种口味的 [INFY PLUS 烟弹](/products/pod-169)。",
          ],
        },
        {
          heading: "如何验证正品？",
          paragraphs: [
            "INFY 表示每件 INFY 产品都附有防伪码：在包装上找到序列号贴纸，刮开涂层露出二维码，用手机相机扫描，再到 INFY 官网输入刮开后显示的编码进行验证。",
          ],
        },
      ],
      faq: [
        { question: "INFY 主机能用哪款 INFY 烟弹？", answer: "可以使用 2.5mL 的 INFY 烟弹，本店以 [INFY PLUS 烟弹](/products/pod-169) 的名称上架。INFY 还表示，品牌容量较小的烟弹同样可以装在这台主机上。" },
        { question: "INFY POD 是换弹式主机吗？", answer: "是的。INFY POD 是可重复使用的换弹式主机，电池 400mAh，USB-C 充电。烟弹用完后只需更换烟弹，主机可以继续使用。" },
        { question: "INFY POD 盒内有烟弹吗？", answer: "没有。盒内是主机、USB-C 线和说明书，烟弹可以按喜欢的口味另外选购。" },
        { question: "INFY 主机红灯闪烁是什么意思？", answer: "表示电量较低，可以用 USB-C 充电了。白灯则表示电量还很充足。" },
      ],
    },
  },
  // Articles queue 0211 batch 5 (02/11): INFY PLUS 2.5mL pod — every fact = infy.my (2.5ML + 2ML cartridge, device and
  // authenticity pages, WebFetch 02/11). Flavour count left out (INFY: "7 New Flavors"; the shop lists its own). Magnet line not
  // used: it is on the 2ML page only. Thai = thai-copy 02/11.
  "pod-169": {
    th: {
      lede: "ด้านล่างนี้สรุปจากเว็บของ INFY ว่าหัว INFY Plus ต่างจากหัว 2mL ยังไง ใช้กับเครื่องไหนได้ ใช้ยังไง และเช็คของแท้ได้ยังไง",
      sections: [
        {
          heading: "INFY Plus ต่างจากหัว 2mL ยังไง",
          paragraphs: [
            "INFY บอกว่าหัว INFY Plus จุน้ำยาได้ 2.5mL มากกว่าหัว 2mL ของแบรนด์ หัวหนึ่งจึงสูบได้นานขึ้นก่อนจะต้องเปลี่ยนหัวใหม่",
            "ส่วนตัวหัว INFY Plus เอง INFY ยังบอกด้วยว่าให้รสชาติชัดและคงที่ตั้งแต่พัฟแรกจนถึงพัฟสุดท้าย และใช้คอยล์ที่ออกแบบมาให้ใช้ได้นาน",
          ],
        },
        {
          heading: "ใช้กับเครื่องไหน และใช้ยังไง",
          paragraphs: [
            "INFY ออกแบบหัวนี้มาสำหรับระบบหัวพอตปิดของแบรนด์โดยเฉพาะ ใส่ได้ทั้งในตัวเครื่อง INFY Device และเครื่อง INFY Cube Box เช่นเดียวกับหัว 2mL",
            "ก่อนใช้ ให้ดึงซีลยางที่ปิดด้านบนและด้านล่างของหัวออก แล้วเสียบเข้าเครื่องได้เลย พอใส่หัวใหม่เข้าไป ไฟ LED ของ INFY Device ก็จะบอกให้รู้ว่ามีหัวใหม่ใส่เข้ามาแล้ว ถ้ายังไม่มีเครื่อง ดูได้ที่หน้า [ตัวเครื่อง INFY](/products/infy-pod)",
            "ถ้ายังเลือกกลิ่นไม่ถูก อ่านต่อได้ที่ [พอตกลิ่นไหนดี เลือกจากสายที่ชอบ ทั้งเย็น ผลไม้ ชา หรือยาสูบ](/guides/choosing-a-pod-flavor)",
          ],
        },
        {
          heading: "เช็คของแท้ยังไง",
          paragraphs: [
            "สินค้าทุกชิ้นของ INFY มีรหัสไว้เช็คของแท้ ที่กล่องจะมีสติกเกอร์ซีเรียลติดอยู่ ให้ขูดชั้นเคลือบออก แล้วสแกน QR code ที่อยู่ข้างใต้ด้วยกล้องมือถือ จากนั้นนำรหัสที่เห็นไปกรอกในเว็บของ INFY เพื่อตรวจสอบ",
            "วิธีเช็คของแท้ของแบรนด์อื่น ๆ อ่านต่อได้ที่ [พอตของแท้ ดูยังไง เช็คเองได้ที่เว็บทางการของแบรนด์](/guides/checking-a-genuine-pod)",
          ],
        },
      ],
      faq: [
        { question: "หัวพอต INFY ใส่กับเครื่องไหนได้บ้าง", answer: "หัว INFY Plus ใส่ได้ทั้ง INFY Device และ INFY Cube Box ค่ะ ถ้ากำลังมองหาตัวเครื่องอยู่ ดูได้ที่หน้า [INFY POD](/products/infy-pod) นะคะ" },
        { question: "หัวพอต INFY มีกลิ่นอะไรบ้าง", answer: "หัว INFY Plus มีให้ดู 28 กลิ่นค่ะ สายองุ่นอย่าง Kyoho Grape กับ Grape Jelly สายเย็นอย่าง Mint กับ Lychee Ice และแนวอื่นอย่าง Coke · Sprite กับ Jasmine Tea รายชื่อเต็มอยู่ในตัวเลือกของหน้านี้ค่ะ" },
        { question: "INFY Plus ต่างจากหัว INFY ธรรมดายังไง", answer: "ต่างกันที่ปริมาณน้ำยาค่ะ หัว INFY Plus จุได้ 2.5mL มากกว่าหัวขนาดเล็กของแบรนด์ หัวหนึ่งจึงสูบได้นานขึ้นก่อนต้องเปลี่ยนใหม่ค่ะ" },
        { question: "หัวพอต INFY เติมน้ำยาเองได้ไหม", answer: "ไม่ได้ค่ะ หัว INFY Plus ออกแบบมาเป็นระบบปิด น้ำยา 2.5mL กับคอยล์อยู่ในหัวเดียวกัน ใช้จนน้ำยาหมดแล้วจึงเปลี่ยนหัวใหม่ และใช้ตัวเครื่องเดิมต่อได้ค่ะ" },
        { question: "หัวพอต INFY ของแท้ เช็คยังไง", answer: "ดูที่สติกเกอร์ซีเรียลบนกล่องค่ะ ขูดชั้นเคลือบออกแล้วสแกน QR code ด้วยกล้องมือถือ จากนั้นนำรหัสที่ได้ไปกรอกในเว็บของ INFY เพื่อตรวจสอบนะคะ" },
      ],
    },
    en: {
      lede: "Below, from INFY's own site: how the INFY Plus differs from the 2 mL pod, which devices it fits, how to use it, and how to check it is genuine.",
      sections: [
        {
          heading: "How is the INFY Plus different from the 2 mL pod?",
          paragraphs: [
            "INFY says the INFY Plus holds 2.5 mL, more than its 2 mL pod, so each pod lasts longer before you need a new one. INFY also says the INFY Plus gives full, consistent flavour from the first puff to the last, and uses a coil designed to last.",
          ],
        },
        {
          heading: "Which devices, and how do I use it?",
          paragraphs: [
            "INFY designed it specifically for its closed pod system, and like the 2 mL pod it fits both the INFY Device and the INFY Cube Box. Pull the rubber seals off the top and bottom, then push the pod in; when a new pod goes in, the LEDs on the INFY Device show it. If you don't have a device yet, see the [INFY device](/products/infy-pod).",
          ],
        },
        {
          heading: "How do I check it is genuine?",
          paragraphs: [
            "INFY says every INFY product carries an authenticity code. Find the serial-number sticker on the box, scratch off the coating to reveal a QR code, scan it with your phone camera, then enter the code on INFY's website to verify it.",
          ],
        },
      ],
      faq: [
        { question: "Which devices does the INFY pod fit?", answer: "The INFY Plus fits both the INFY Device and the INFY Cube Box. If you're looking for a device, see the [INFY POD](/products/infy-pod)." },
        { question: "What flavours do INFY pods come in?", answer: "The INFY Plus comes in 28 flavours. Grape fans can look at Kyoho Grape or Grape Jelly, Mint and Lychee Ice are the cooler picks, and Coke, Sprite and Jasmine Tea are among the others. The full list is in the options on this page." },
        { question: "How is the INFY Plus different from a standard INFY pod?", answer: "The main difference is how much it holds. At 2.5mL, the INFY Plus carries more e-liquid than INFY's smaller pod, so each one lasts longer before you need a new one." },
        { question: "Can you refill an INFY pod yourself?", answer: "No. The INFY Plus is a closed pod, with its 2.5mL of e-liquid and its coil in one unit. Use it until the e-liquid runs out, then fit a new pod and keep using the same device." },
        { question: "How do I check an INFY pod is genuine?", answer: "Start with the serial sticker on the box. Scratch off the coating, scan the QR code with your phone camera, then enter the code you get on INFY's website." },
      ],
    },
    zh: {
      lede: "以下内容整理自 INFY 官网：INFY Plus 与 2 mL 烟弹的区别、适用设备和使用方法，以及如何验证正品。",
      sections: [
        {
          heading: "INFY Plus 和 2 mL 烟弹有什么不同？",
          paragraphs: [
            "INFY 表示，INFY Plus 可装 2.5 mL 烟油，比 INFY 的 2 mL 烟弹装得更多，一颗烟弹可以用得更久再换。INFY 还表示，INFY Plus 从第一口到最后一口口味都饱满稳定，并采用经久耐用的线圈设计。",
          ],
        },
        {
          heading: "适用哪些设备？怎么使用？",
          paragraphs: [
            "这款烟弹专为 INFY 封闭式烟弹系统设计，和 2 mL 烟弹一样，可用于 INFY Device 和 INFY Cube Box。先取下顶部和底部的橡胶塞，再把烟弹插入设备；装入新烟弹时，INFY Device 机身上的 LED 会有提示。还没有设备的话，可以看看 [INFY 主机](/products/infy-pod)。",
          ],
        },
        {
          heading: "如何验证正品？",
          paragraphs: [
            "INFY 表示每件 INFY 产品都附有防伪码：在包装上找到序列号贴纸，刮开涂层露出二维码，用手机相机扫描，再到 INFY 官网输入刮开后显示的编码进行验证。",
          ],
        },
      ],
      faq: [
        { question: "INFY 烟弹适用于哪些设备？", answer: "INFY Plus 可用于 INFY Device 和 INFY Cube Box。如果您正在挑选主机，可以看看 [INFY POD](/products/infy-pod)。" },
        { question: "INFY 烟弹有哪些口味？", answer: "INFY Plus 共有 28 种口味。葡萄味有 Kyoho Grape、Grape Jelly，清凉款有 Mint、Lychee Ice，另外还有 Coke、Sprite、Jasmine Tea 等。完整列表见本页选项。" },
        { question: "INFY Plus 和普通 INFY 烟弹有什么不同？", answer: "主要区别在于烟油量。INFY Plus 容量 2.5mL，比品牌容量较小的烟弹装得更多，每颗可以用得更久再换。" },
        { question: "INFY 烟弹可以自己加烟油吗？", answer: "不可以。INFY Plus 采用封闭式设计，2.5mL 烟油和线圈都在同一颗烟弹内。烟油用完后换新烟弹，主机可以继续使用。" },
        { question: "怎么验证 INFY 烟弹是不是正品？", answer: "先看包装上的序列号贴纸。刮开涂层后用手机相机扫描二维码，再把得到的编码输入 INFY 官网核对。" },
      ],
    },
  },
  // Batch 1 (02/10): written from UWELL's G5 page, its spec sheet and the G5 Lite page (sources per sentence:
  // docs/cloud-results/รอบบทความ-รายละเอียดเพิ่มเติม.md §5). Owner format A. G5 template round 03/10: the sections that
  // re-told a story poster (triple tap · 7 colours · airflow) were removed and repeated facts trimmed (thai-copy).
  "caliburn-g5": {
    th: {
      lede: "Caliburn G5 มีจอสี แตะสามครั้งเพื่อสลับโหมด ตัวเครื่องเป็นอะลูมิเนียม และในกล่องมีหัวพอตมาให้สามหัว ด้านล่างคือรายละเอียดทีละข้อจาก UWELL",
      sections: [
        {
          heading: "Caliburn G5 ต่างจาก G5 Lite ยังไง",
          paragraphs: [
            "สองรุ่นนี้ความจุแบตและวัตต์สูงสุดเท่ากัน ที่ต่างคือวิธีดูสถานะเครื่อง G5 มีจอสี บอกแบต วัตต์ และโหมดไว้ในหน้าเดียว ส่วน G5 Lite บอกระดับแบตด้วยไฟ LED บนตัวเครื่อง",
            "อยากเห็นตัวเลขบนจอ เลือก G5 อยากได้เครื่องที่ใช้ง่าย ไม่ต้องดูจอ เลือก [Caliburn G5 Lite](/products/caliburn-g5-lite)",
            "ส่วนใครกำลังเทียบกับ G4 หรือ Caliburn รุ่นอื่น ตารางเทียบสเปกทีละคู่อยู่ที่ [Caliburn G5 vs G4 ต่างกันยังไง](/guides/comparing-caliburn-models)"
          ]
        },
        {
          heading: "GPP Alpha ต่างจากหัว GPP ปกติยังไง",
          paragraphs: [
            "UWELL บอกว่าหัว GPP Alpha ใช้ AlphaCore ทำให้คอยล์ใช้ได้นานขึ้น และรสชาติคงที่ตั้งแต่พัฟแรกถึงพัฟสุดท้าย อีกสองหัวในกล่องเป็นหัว GPP ปกติ เติมน้ำยาด้านข้าง",
            "ส่วนปากดูด UWELL ใส่แบบเดียวกับหัว Alpha ให้หัว GPP ปกติด้วย"
          ]
        }
      ]
    },
    en: {
      lede: "The Caliburn G5 has a colour screen, a triple tap to switch modes, an aluminium body and three pods in the box. Below, each point in detail from UWELL.",
      sections: [
        {
          heading: "How is the Caliburn G5 different from the G5 Lite?",
          paragraphs: [
            "Both have the same battery capacity and maximum wattage. The difference is how you read the device: the G5 has a colour screen showing battery, wattage and mode on one view; the G5 Lite shows battery level with LED lights on the body.",
            "Want numbers on a screen? Pick the G5. Want something simpler with no screen to read? Pick the [Caliburn G5 Lite](/products/caliburn-g5-lite)."
          ]
        },
        {
          heading: "How is GPP Alpha different from a standard GPP pod?",
          paragraphs: [
            "UWELL says the GPP Alpha uses AlphaCore for a longer coil life and steady flavour from the first puff to the last. The other two pods in the box are standard GPP pods, filled from the side.",
            "As for the mouthpiece, UWELL fits the same one as the Alpha's to its standard GPP pods too."
          ]
        }
      ]
    },
    zh: {
      lede: "Caliburn G5 配备彩色屏幕、三击切换模式、铝合金机身，盒内附 3 颗烟弹。下面按 UWELL 资料逐项介绍。",
      sections: [
        {
          heading: "Caliburn G5 和 G5 Lite 有什么不同？",
          paragraphs: [
            "两款的电池容量和最高功率相同。不同在于查看方式：G5 有彩色屏幕，一屏显示电量、功率和模式；G5 Lite 则用机身上的 LED 灯显示电量。",
            "想在屏幕上看到数字，选 G5；想要更简单、不用看屏幕的机器，选 [Caliburn G5 Lite](/products/caliburn-g5-lite)。"
          ]
        },
        {
          heading: "GPP Alpha 和普通 GPP 烟弹有什么不同？",
          paragraphs: [
            "UWELL 表示 GPP Alpha 采用 AlphaCore，线圈寿命更长，从第一口到最后一口口味稳定。盒内另外 2 颗是普通 GPP 烟弹，侧面注油。",
            "烟嘴方面，UWELL 也给普通 GPP 烟弹配了和 Alpha 一样的烟嘴。"
          ]
        }
      ]
    }
  },
  // Site-wide template round batch 1a (03/10): UWELL's G5 Lite / Lite SE page (_incoming/sitewide-template/1a/page.txt); buyer
  // questions the posters and the FAQ do not answer. Thai = thai-copy 03/10.
  "caliburn-g5-lite": {
    th: {
      lede: "Caliburn G5 Lite ตัวเครื่องเบา จับถนัดมือ หยิบแล้วไปได้เลย",
      sections: [
        {
          heading: "G5 Lite กับ G5 Lite SE เลือกตัวไหนดี",
          paragraphs: [
            "แบต วัตต์ และระบบลมของสองรุ่นนี้เหมือนกัน ที่ต่างคือผิวตัวเครื่อง G5 Lite เป็นเปลือกโปร่งแสงหุ้มแกนด้านใน ส่วน [G5 Lite SE](/products/caliburn-g5-lite-se) เป็นหนังคู่กับผิวลายริ้ว",
            "ชอบผิวแบบไหนเลือกตัวนั้น"
          ]
        },
        {
          heading: "ใช้หัวพอตอะไรได้บ้าง",
          paragraphs: [
            "หัวพอต GPP ใส่ได้ทุกหัว ทั้งหัวที่เติมน้ำยาด้านข้างและด้านบน หัวชุดเดียวกันนี้ใช้กับ Caliburn สาย G5 G4 และ G3 ได้ด้วย ใครมีเครื่องสายนี้อยู่แล้ว ใช้หัวสลับกันได้เลย",
            "ดู[หัวพอต GPP ที่ใช้กับ G5 Lite](/products/coil-94)"
          ]
        },
        {
          heading: "ไฟ 4 ขีดแต่ละสีบอกอะไร",
          paragraphs: [
            "ไฟ 4 ขีดบอกว่าแบตเหลือเท่าไหร่ และเปลี่ยนสีตามระดับแบต 4 ขีดสีเขียว แบตเหลือ 75–100% · 3 ขีดสีฟ้า 50–74% · 2 ขีดสีเหลือง 25–49% · 1 ขีดสีแดง 0–24%"
          ]
        }
      ]
    },
    en: {
      lede: "The Caliburn G5 Lite is light, sits well in the hand and is made to grab and go.",
      sections: [
        {
          heading: "G5 Lite or G5 Lite SE — which one?",
          paragraphs: [
            "Battery, power and airflow are the same on both. The difference is the body: the G5 Lite has an inner core under a translucent shell, the [G5 Lite SE](/products/caliburn-g5-lite-se) is leather paired with a striped texture.",
            "Pick the finish you like."
          ]
        },
        {
          heading: "Which pods fit?",
          paragraphs: [
            "Every GPP pod fits, side-refill and top-refill alike — and the same pods work across the Caliburn G5, G4 and G3 series, so if you already own one, you can swap pods between them.",
            "See the [GPP pods for the G5 Lite](/products/coil-94)."
          ]
        },
        {
          heading: "What do the 4-bar light colours mean?",
          paragraphs: [
            "The 4-bar light shows how much battery is left and changes colour with it: 4 green bars 75–100% · 3 blue 50–74% · 2 yellow 25–49% · 1 red 0–24%."
          ]
        }
      ]
    },
    zh: {
      lede: "Caliburn G5 Lite 机身轻巧，握感顺手，拿起就走。",
      sections: [
        {
          heading: "G5 Lite 和 G5 Lite SE 怎么选？",
          paragraphs: [
            "两款的电池、功率和气流系统相同，区别在机身：G5 Lite 是半透明外壳包裹内芯，[G5 Lite SE](/products/caliburn-g5-lite-se) 则是皮革搭配条纹质感。",
            "喜欢哪种质感就选哪款。"
          ]
        },
        {
          heading: "能用哪些烟弹？",
          paragraphs: [
            "所有 GPP 烟弹都能用，侧注油和顶注油都可以；同一批烟弹也适用于 Caliburn G5、G4 和 G3 系列，已有这些机器的话烟弹可以互换。",
            "查看[适用于 G5 Lite 的 GPP 烟弹](/products/coil-94)。"
          ]
        },
        {
          heading: "4 格指示灯的颜色代表什么？",
          paragraphs: [
            "4 格指示灯显示剩余电量，并随电量变色：4 格绿色 75–100% · 3 格蓝色 50–74% · 2 格黄色 25–49% · 1 格红色 0–24%。"
          ]
        }
      ]
    }
  },
  // Site-wide template round batch 1a (03/10): UWELL's G5 Lite / Lite SE page (_incoming/sitewide-template/1a/page.txt); buyer
  // questions the posters and the FAQ do not answer. Thai = thai-copy 03/10.
  "caliburn-g5-lite-se": {
    th: {
      lede: "Caliburn G5 Lite SE ตัวเครื่องเบา จับถนัดมือ หยิบแล้วไปได้เลย",
      sections: [
        {
          heading: "G5 Lite SE ต่างจาก G5 Lite ตรงไหน",
          paragraphs: [
            "ต่างกันที่ผิวตัวเครื่อง G5 Lite SE เป็นหนังคู่กับผิวลายริ้ว ส่วน [G5 Lite](/products/caliburn-g5-lite) เป็นเปลือกโปร่งแสงหุ้มแกนด้านใน แบต วัตต์ และระบบลมเหมือนกัน",
            "ชอบผิวแบบไหนเลือกตัวนั้น"
          ]
        },
        {
          heading: "ใช้หัวพอตอะไรได้บ้าง",
          paragraphs: [
            "หัวพอต GPP ใส่ได้ทุกหัว ทั้งหัวที่เติมน้ำยาด้านข้างและด้านบน หัวชุดเดียวกันนี้ใช้กับ Caliburn สาย G5 G4 และ G3 ได้ด้วย ใครมีเครื่องสายนี้อยู่แล้ว ใช้หัวสลับกันได้เลย",
            "ดู[หัวพอต GPP ที่ใช้กับ G5 Lite SE](/products/coil-94)"
          ]
        },
        {
          heading: "ไฟ 4 ขีดแต่ละสีบอกอะไร",
          paragraphs: [
            "ไฟ 4 ขีดบอกว่าแบตเหลือเท่าไหร่ และเปลี่ยนสีตามระดับแบต 4 ขีดสีเขียว แบตเหลือ 75–100% · 3 ขีดสีฟ้า 50–74% · 2 ขีดสีเหลือง 25–49% · 1 ขีดสีแดง 0–24%"
          ]
        }
      ]
    },
    en: {
      lede: "The Caliburn G5 Lite SE is light, sits well in the hand and is made to grab and go.",
      sections: [
        {
          heading: "G5 Lite SE vs G5 Lite — what's different?",
          paragraphs: [
            "The body: the G5 Lite SE is leather paired with a striped texture, the [G5 Lite](/products/caliburn-g5-lite) an inner core under a translucent shell. Battery, power and airflow are the same.",
            "Pick the finish you like."
          ]
        },
        {
          heading: "Which pods fit?",
          paragraphs: [
            "Every GPP pod fits, side-refill and top-refill alike — and the same pods work across the Caliburn G5, G4 and G3 series, so if you already own one, you can swap pods between them.",
            "See the [GPP pods for the G5 Lite SE](/products/coil-94)."
          ]
        },
        {
          heading: "What do the 4-bar light colours mean?",
          paragraphs: [
            "The 4-bar light shows how much battery is left and changes colour with it: 4 green bars 75–100% · 3 blue 50–74% · 2 yellow 25–49% · 1 red 0–24%."
          ]
        }
      ]
    },
    zh: {
      lede: "Caliburn G5 Lite SE 机身轻巧，握感顺手，拿起就走。",
      sections: [
        {
          heading: "G5 Lite SE 和 G5 Lite 有什么不同？",
          paragraphs: [
            "区别在机身：G5 Lite SE 是皮革搭配条纹质感，[G5 Lite](/products/caliburn-g5-lite) 是半透明外壳包裹内芯。电池、功率和气流系统相同。",
            "喜欢哪种质感就选哪款。"
          ]
        },
        {
          heading: "能用哪些烟弹？",
          paragraphs: [
            "所有 GPP 烟弹都能用，侧注油和顶注油都可以；同一批烟弹也适用于 Caliburn G5、G4 和 G3 系列，已有这些机器的话烟弹可以互换。",
            "查看[适用于 G5 Lite SE 的 GPP 烟弹](/products/coil-94)。"
          ]
        },
        {
          heading: "4 格指示灯的颜色代表什么？",
          paragraphs: [
            "4 格指示灯显示剩余电量，并随电量变色：4 格绿色 75–100% · 3 格蓝色 50–74% · 2 格黄色 25–49% · 1 格红色 0–24%。"
          ]
        }
      ]
    }
  },
  // Site-wide template round batch 1b (03/10): UWELL's G4 / G4 mini / G4 Classic pages; buyer questions the posters do not
  // answer (which one of the family). Thai = thai-copy 03/10.
  "caliburn-g4": {
    th: {
      lede: "Caliburn G4 ตั้งต้นที่รสชาติ แล้วให้เลือกเองว่าจะสูบแรงหรือสูบนุ่ม",
      sections: [
        {
          heading: "G4 กับ G4 mini เลือกตัวไหนดี",
          paragraphs: [
            "G4 มีจอสีและปุ่ม ส่วน [G4 mini](/products/caliburn-g4-mini) ไม่มีจอ",
            "แบต G4 1300mAh ตัว mini 1100mAh แต่ mini เบากว่า ประมาณ 46 กรัม เทียบกับ 54.7 กรัมของ G4"
          ]
        },
        {
          heading: "G4 ต่างจาก G4 Classic ยังไง",
          paragraphs: [
            "[G4 Classic](/products/caliburn-g4-classic) เป็นตัวเครื่องคนละแบบ ทำจากอะลูมิเนียม ไม่มีจอ มีไฟ RGB 14 ดวง และแบต 1400mAh ส่วนหัวพอตใช้ GPP เหมือนกัน"
          ]
        }
      ]
    },
    en: {
      lede: "The Caliburn G4 starts with flavour, then lets you choose a hard hit or a smooth one.",
      sections: [
        {
          heading: "G4 or G4 mini?",
          paragraphs: [
            "The G4 has a colour screen and a button; the [G4 mini](/products/caliburn-g4-mini) has no screen.",
            "The G4 holds 1300mAh, the mini 1100mAh — and the mini weighs about 46 g against the G4's 54.7 g."
          ]
        },
        {
          heading: "How is the G4 different from the G4 Classic?",
          paragraphs: [
            "The [G4 Classic](/products/caliburn-g4-classic) is a different body: aluminium, no screen, 14 RGB LEDs and a 1400mAh battery. Both take GPP pods."
          ]
        }
      ]
    },
    zh: {
      lede: "Caliburn G4 以口味为起点，再让你选择猛烈还是柔和。",
      sections: [
        {
          heading: "G4 还是 G4 mini？",
          paragraphs: [
            "G4 有彩屏和按键；[G4 mini](/products/caliburn-g4-mini) 没有屏幕。",
            "G4 电池 1300mAh，mini 是 1100mAh；mini 约 46 克，G4 约 54.7 克。"
          ]
        },
        {
          heading: "G4 和 G4 Classic 有什么不同？",
          paragraphs: [
            "[G4 Classic](/products/caliburn-g4-classic) 是另一种机身：铝合金、没有屏幕、14 颗 RGB LED，电池 1400mAh。两款都用 GPP 烟弹。"
          ]
        }
      ]
    }
  },
  "caliburn-g4-mini": {
    th: {
      lede: "G4 mini ตัวเล็กกว่า G4 แต่ระบบปรับรสชาติเป็นตัวเดียวกัน",
      sections: [
        {
          heading: "G4 mini กับ G4 เลือกตัวไหนดี",
          paragraphs: [
            "G4 mini ไม่มีจอ สูบได้เลยโดยไม่ต้องกดปุ่ม ส่วน [G4](/products/caliburn-g4) มีจอสีและปุ่ม",
            "แบต mini 1100mAh น้อยกว่า G4 ที่ 1300mAh แต่ตัวเบากว่า ประมาณ 46 กรัม เทียบกับ 54.7 กรัม"
          ]
        },
        {
          heading: "G4 mini ต่างจาก G5 Lite ตรงไหน",
          paragraphs: [
            "สองรุ่นนี้ไม่มีจอทั้งคู่ ต่างกันที่แบต [G5 Lite](/products/caliburn-g5-lite) จุมากกว่าที่ 1600mAh และมีไฟ 4 ขีดบอกระดับแบต"
          ]
        }
      ]
    },
    en: {
      lede: "The G4 mini is smaller than the G4, with the same flavour system.",
      sections: [
        {
          heading: "G4 mini or G4?",
          paragraphs: [
            "The mini has no screen and fires when you draw; the [G4](/products/caliburn-g4) adds a colour screen, two modes and a button.",
            "The mini holds 1100mAh and weighs about 46 g; the G4 holds 1300mAh and weighs 54.7 g."
          ]
        },
        {
          heading: "G4 mini or G5 Lite?",
          paragraphs: [
            "Neither has a screen. The difference is the battery: the [G5 Lite](/products/caliburn-g5-lite) holds more, 1600mAh, with a 4-bar battery light."
          ]
        }
      ]
    },
    zh: {
      lede: "G4 mini 比 G4 更小，口感技术却是同一套。",
      sections: [
        {
          heading: "G4 mini 还是 G4？",
          paragraphs: [
            "mini 没有屏幕，吸一下就出烟；[G4](/products/caliburn-g4) 多了彩屏、两种模式和按键。",
            "mini 电池 1100mAh、约 46 克；G4 电池 1300mAh、约 54.7 克。"
          ]
        },
        {
          heading: "G4 mini 还是 G5 Lite？",
          paragraphs: [
            "两款都没有屏幕，差别在电池：[G5 Lite](/products/caliburn-g5-lite) 电池更大（1600mAh），配 4 格电量灯。"
          ]
        }
      ]
    }
  },
  "caliburn-g4-classic": {
    th: {
      lede: "Caliburn รุ่นฉลองครบ 10 ปีของ UWELL ตัวเครื่องอะลูมิเนียม มีไฟสีเรืองตอนสูบ",
      sections: [
        {
          heading: "G4 Classic กับ G4 เลือกตัวไหนดี",
          paragraphs: [
            "[G4](/products/caliburn-g4) มีจอสีกับสองโหมดให้เลือก ส่วน G4 Classic ไม่มีจอ บอกระดับแบตด้วยสีไฟ",
            "แบต Classic 1400mAh มากกว่า G4 ที่ 1300mAh และใช้หัวพอต GPP เหมือนกัน"
          ]
        },
        {
          heading: "G4 Classic ต่างจาก G5 Lite ตรงไหน",
          paragraphs: [
            "สองรุ่นนี้ไม่มีจอทั้งคู่ [G5 Lite](/products/caliburn-g5-lite) แบต 1600mAh ตัวเครื่องเป็นเปลือกโปร่งแสงหุ้มแกนด้านใน ส่วน G4 Classic มีไฟ RGB 14 ดวงกับเซ็นเซอร์คู่"
          ]
        }
      ]
    },
    en: {
      lede: "UWELL's tenth-anniversary Caliburn: an aluminium body with colour light that glows as you puff.",
      sections: [
        {
          heading: "G4 Classic or G4?",
          paragraphs: [
            "The [G4](/products/caliburn-g4) has a colour screen and two modes; the G4 Classic has no screen and shows the battery in light.",
            "The Classic holds 1400mAh against the G4's 1300mAh, and both take GPP pods."
          ]
        },
        {
          heading: "G4 Classic or G5 Lite?",
          paragraphs: [
            "Neither has a screen. The [G5 Lite](/products/caliburn-g5-lite) has a 1600mAh battery and an inner core under a translucent shell; the G4 Classic has 14 RGB LEDs and twin sensors."
          ]
        }
      ]
    },
    zh: {
      lede: "UWELL 十周年纪念款 Caliburn：铝合金机身，吸烟时灯光随之亮起。",
      sections: [
        {
          heading: "G4 Classic 还是 G4？",
          paragraphs: [
            "[G4](/products/caliburn-g4) 有彩屏和两种模式；G4 Classic 没有屏幕，用灯光颜色显示电量。",
            "Classic 电池 1400mAh，G4 是 1300mAh，两款都用 GPP 烟弹。"
          ]
        },
        {
          heading: "G4 Classic 还是 G5 Lite？",
          paragraphs: [
            "两款都没有屏幕。[G5 Lite](/products/caliburn-g5-lite) 电池 1600mAh，半透明外壳包覆内芯；G4 Classic 有 14 颗 RGB LED 和双传感器。"
          ]
        }
      ]
    }
  },
  // Site-wide template round batch 1c (03/10): from UWELL's G4 Pro / KOKO pages and spec sheets; Thai = thai-copy 03/10.
  "caliburn-g4-pro": {
    th: {
      lede: "Caliburn G4 Pro สั่งงานด้วยจอทัช ด้านล่างไล่ให้ดูทีละอย่างว่าแตะแล้วทำอะไรได้บ้าง",
      sections: [
        {
          heading: "G4 Pro กับ G4 Pro KOKO เลือกตัวไหนดี",
          paragraphs: [
            "สองรุ่นนี้มีจอทัช สูงสุด 35 วัตต์ และใช้หัวพอต GPP เหมือนกัน",
            "G4 Pro ทรงเพรียว จอใหญ่กว่า หนักประมาณ 78 กรัม",
            "[G4 Pro KOKO](/products/caliburn-g4-pro-koko) ทรงกล่อง แบตใหญ่กว่าที่ 2000mAh หนักประมาณ 93 กรัม และมีธีมหน้าจอแบบสุ่ม 5 แบบ",
            "ชอบทรงไหนเลือกตัวนั้น"
          ]
        },
        {
          heading: "G4 Pro ต่างจาก G4 ยังไง",
          paragraphs: [
            "[G4](/products/caliburn-g4) มีจอสี 0.85 นิ้ว ใช้ปุ่มเดียวสั่งงาน และมี 2 โหมด",
            "G4 Pro สั่งงานด้วยจอทัช เพิ่มโหมด Custom และแบตใหญ่กว่า"
          ]
        }
      ]
    },
    en: {
      lede: "The Caliburn G4 Pro runs on a touchscreen. Below, one by one, what a tap can do.",
      sections: [
        {
          heading: "G4 Pro or G4 Pro KOKO?",
          paragraphs: [
            "Both have a touchscreen, up to 35W and GPP pods.",
            "The G4 Pro is the slim one, with the bigger screen, at about 78g.",
            "The [G4 Pro KOKO](/products/caliburn-g4-pro-koko) is the box-shaped one, with a bigger 2000mAh battery, about 93g, and five blind-draw screen themes.",
            "Pick the shape you like."
          ]
        },
        {
          heading: "How is the G4 Pro different from the G4?",
          paragraphs: [
            "The [G4](/products/caliburn-g4) has a 0.85-inch colour screen, one button to run it and two modes.",
            "The G4 Pro runs on a touchscreen, adds the Custom mode and has a bigger battery."
          ]
        }
      ]
    },
    zh: {
      lede: "Caliburn G4 Pro 用触屏操作。下面逐项看看轻点一下能做什么。",
      sections: [
        {
          heading: "G4 Pro 还是 G4 Pro KOKO？",
          paragraphs: [
            "两款都有触屏、最高 35W，都用 GPP 烟弹。",
            "G4 Pro 是纤长款，屏幕更大，约 78g。",
            "[G4 Pro KOKO](/products/caliburn-g4-pro-koko) 是方盒款，电池更大，2000mAh，约 93g，还有 5 款盲抽屏幕主题。",
            "喜欢哪种造型就选哪款。"
          ]
        },
        {
          heading: "G4 Pro 和 G4 有什么不同？",
          paragraphs: [
            "[G4](/products/caliburn-g4) 是 0.85 英寸彩屏，一个按键操作，有两种模式。",
            "G4 Pro 用触屏操作，多了 Custom 模式，电池也更大。"
          ]
        }
      ]
    },
  },
  "caliburn-g4-pro-koko": {
    th: {
      lede: "G4 Pro KOKO ตัวเครื่องทรงกล่อง สั่งงานด้วยจอทัช และมีธีมหน้าจอให้สุ่มสะสม",
      sections: [
        {
          heading: "G4 Pro KOKO กับ G4 Pro เลือกตัวไหนดี",
          paragraphs: [
            "สองรุ่นนี้มีจอทัช สูงสุด 35 วัตต์ และใช้หัวพอต GPP เหมือนกัน",
            "KOKO ทรงกล่อง แบตใหญ่กว่า หนักประมาณ 93 กรัม",
            "[G4 Pro](/products/caliburn-g4-pro) ทรงเพรียว จอ 2.51 นิ้ว แบต 1800mAh หนักประมาณ 78 กรัม",
            "ชอบทรงไหนเลือกตัวนั้น"
          ]
        }
      ]
    },
    en: {
      lede: "The G4 Pro KOKO is a box-shaped device run from a touchscreen, with screen themes to collect.",
      sections: [
        {
          heading: "G4 Pro KOKO or G4 Pro?",
          paragraphs: [
            "Both have a touchscreen, up to 35W and GPP pods.",
            "The KOKO is the box-shaped one, with the bigger battery, at about 93g.",
            "The [G4 Pro](/products/caliburn-g4-pro) is the slim one: a 2.51-inch screen, 1800mAh, about 78g.",
            "Pick the shape you like."
          ]
        }
      ]
    },
    zh: {
      lede: "G4 Pro KOKO 是方盒机身，用触屏操作，还有屏幕主题可以收集。",
      sections: [
        {
          heading: "G4 Pro KOKO 还是 G4 Pro？",
          paragraphs: [
            "两款都有触屏、最高 35W，都用 GPP 烟弹。",
            "KOKO 是方盒款，电池更大，约 93g。",
            "[G4 Pro](/products/caliburn-g4-pro) 是纤长款：2.51 英寸屏，1800mAh，约 78g。",
            "喜欢哪种造型就选哪款。"
          ]
        }
      ]
    },
  },
  // Owner task ก6 (08/11), UWELL: Caliburn G3 Lite — every fact = UWELL's G3 Lite page posters (myuwell.com/caliburn/
  // caliburn-g3-lite; images files.myuwell.com/uwell/product/caliburn-g3-lite/: pc/imgCon/2-20240514.jpg = GPP chart "RDL Freebase or
  // MTL Nic Salts?", "*The cartridges all belong to UWELL CALIBURN G3 series" · pc/imgCon/3.jpg = 3-day "from the UWELL lab test",
  // 20% "compared with other common products in the market" · mo/spe-1..4-new.png = the box per version: INT/FDA 0.6Ω side refill,
  // INT (CRC) 0.6Ω top refill, TPD 0.9Ω top refill, each with the device and the manual · mo/5.jpg = LED colours). Read 08/11.
  // Left out (already on the page, checker 09/11): 1200mAh, auto draw, the 360° window, the three cartridge values listed together, the
  // shared G3 cartridges (hero + feature card + who-is-this-for). Legacy page → no article FAQ.
  "caliburn-g3-lite": {
    th: {
      lede: "ด้านล่างสรุปเรื่อง UWELL Caliburn G3 Lite จากโปสเตอร์บนเว็บของ UWELL ทั้งเรื่องหัวพอตกับน้ำยาที่เข้าคู่กัน และหัวพอตที่ได้ในกล่อง ส่วนท้ายเล่าว่าตัวเลขแบตที่ UWELL บอกไว้มาจากไหน และดูแบตที่เหลือยังไง",
      sections: [
        {
          heading: "หัวพอตแบบไหนเข้าคู่กับน้ำยาแบบไหน",
          paragraphs: [
            "ตารางหัวพอตของ UWELL วางหัวโอห์มต่ำไว้ฝั่งสูบแบบ RDL คู่กับน้ำยา freebase และวางหัวโอห์มสูงไว้ฝั่งสูบแบบ MTL คู่กับน้ำยา salt nic",
            "ถ้ายังไม่แน่ใจว่าน้ำยาสองแบบนี้ต่างกันยังไง อ่านต่อได้ที่ [salt nic กับ freebase ต่างกันยังไง](/guides/salt-nic-vs-freebase) ส่วนหัวพอตสำรองดูได้ที่หน้า [คอยล์ UWELL Caliburn G4 และ G3](/products/coil-94)",
          ],
        },
        {
          heading: "ในกล่องได้หัวพอตแบบไหน",
          paragraphs: [
            "ในกล่องมีตัวเครื่อง หัวพอตหนึ่งหัว และคู่มือ หัวพอตที่ได้ขึ้นกับเวอร์ชันของกล่อง",
            "เวอร์ชัน INT/FDA ได้หัว 0.6 โอห์มแบบเติมน้ำยาด้านข้าง เวอร์ชัน INT (CRC) ได้หัว 0.6 โอห์มแบบเติมด้านบน และเวอร์ชัน TPD ได้หัว 0.9 โอห์มแบบเติมด้านบน",
          ],
        },
        {
          heading: "แบตใช้ได้ 3 วันจริงไหม",
          paragraphs: [
            "UWELL บอกว่าชาร์จหนึ่งครั้งใช้ได้ 3 วัน และเขียนหมายเหตุไว้ว่าตัวเลขนี้มาจากการทดสอบในแล็บของ UWELL เอง ใช้จริงได้นานแค่ไหนจึงขึ้นกับการสูบของแต่ละคน",
            "ส่วนที่บอกว่าแบตใหญ่ขึ้น 20% นั้น UWELL เทียบกับสินค้าทั่วไปในตลาด",
          ],
        },
        {
          heading: "ดูแบตที่เหลือยังไง",
          paragraphs: [
            "ระหว่างใช้ ไฟ LED บนตัวเครื่องจะเปลี่ยนสีเป็นเขียว ฟ้า และแดงตามแบตที่เหลือ",
          ],
        },
      ],
    },
    en: {
      lede: "The UWELL Caliburn G3 Lite, from the posters on UWELL's own page: which pod pairs with which e-liquid, and which pod comes in the box. After that, where UWELL's battery figures come from and how to read the charge left.",
      sections: [
        {
          heading: "Which pod goes with which e-liquid?",
          paragraphs: [
            "UWELL's cartridge chart puts the lower-resistance pod at the RDL end, paired with freebase, and the higher-resistance pod at the MTL end, paired with nic salt.",
            "If the two e-liquids are new to you, see [salt nic vs freebase](/guides/salt-nic-vs-freebase). Spare pods are on the [UWELL Caliburn G4 & G3 coil](/products/coil-94) page.",
          ],
        },
        {
          heading: "Which pod comes in the box?",
          paragraphs: [
            "The box holds the device, one pod and the manual; which pod depends on the version. INT/FDA comes with a 0.6Ω side-refill pod, INT (CRC) with a 0.6Ω top-refill pod, and TPD with a 0.9Ω top-refill pod.",
          ],
        },
        {
          heading: "Does the battery really last 3 days?",
          paragraphs: [
            "UWELL says one charge lasts 3 days and notes that the figure comes from UWELL's own lab test, so real use depends on how you vape. The 20% bigger battery is measured against other common products on the market.",
          ],
        },
        {
          heading: "How do I see the charge left?",
          paragraphs: [
            "As you vape, the LED on the body turns green, blue or red with the charge left.",
          ],
        },
      ],
    },
    zh: {
      lede: "下面根据 UWELL 官网上的海报，介绍 UWELL Caliburn G3 Lite 哪种烟弹配哪种烟油、盒里附带哪种烟弹，再说明 UWELL 的电池数据从何而来，以及怎么看剩余电量。",
      sections: [
        {
          heading: "哪种烟弹配哪种烟油？",
          paragraphs: [
            "UWELL 的烟弹图表把低阻值烟弹放在 RDL 一端，搭配 freebase；把高阻值烟弹放在 MTL 一端，搭配 salt nic。",
            "不清楚两种烟油的区别，可以看 [salt nic 和 freebase 有什么区别](/guides/salt-nic-vs-freebase)。备用烟弹见 [UWELL Caliburn G4 和 G3 线圈](/products/coil-94)。",
          ],
        },
        {
          heading: "盒里附带哪种烟弹？",
          paragraphs: [
            "盒内包含主机、烟弹 1 个和说明书，附带哪种烟弹取决于版本：INT/FDA 版为 0.6Ω 侧注油烟弹，INT (CRC) 版为 0.6Ω 顶部注油烟弹，TPD 版为 0.9Ω 顶部注油烟弹。",
          ],
        },
        {
          heading: "电池真的能用 3 天吗？",
          paragraphs: [
            "UWELL 表示充一次电可用 3 天，并注明这一数据来自 UWELL 自己的实验室测试，实际能用多久取决于个人的使用习惯。所谓电池容量提升 20%，是与市面上的常见产品相比。",
          ],
        },
        {
          heading: "怎么看剩余电量？",
          paragraphs: [
            "使用时，机身上的 LED 灯会随剩余电量显示绿、蓝、红三种颜色。",
          ],
        },
      ],
    },
  },
  // Product-article round (27/10, side chat seo-push-2710): standard Caliburn G3 (not G3 Pro). Facts only from the verified spec
  // rows of `caliburn-g3` and `caliburn-g3-pro` in src/data/products/uwell.ts (UWELL's own pages / manual / pod chart); thai-copy 27/10.
  "caliburn-g3": {
    th: {
      lede: "Caliburn G3 คือรุ่นมาตรฐานของตระกูล G3 ตัวเครื่องเล็กและเบา ด้านล่างรวมเรื่องที่ควรรู้ก่อนเลือก ทั้งความต่างจาก G3 Pro การเลือกโอห์มของหัวพอต และแบบเติมน้ำยา",
      sections: [
        {
          heading: "Caliburn G3 กับ G3 Pro ต่างกันยังไง",
          paragraphs: [
            "G3 ตัวเครื่องเป็นอะลูมิเนียม หนักประมาณ 47 กรัม ส่วน G3 Pro หนักประมาณ 92 กรัม น้ำหนักของ G3 จึงราวครึ่งหนึ่งของ G3 Pro",
            "[G3 Pro](/products/caliburn-g3-pro) แบตใหญ่กว่าที่ 1000mAh ปรับได้สูงสุด 35 วัตต์ มีจอเต็มหน้าเครื่อง และมีวาล์วสำหรับปรับลมแบบละเอียด",
            "G3 Pro ใช้หัวพอต G3 ได้ทุกค่า ทั้ง 0.6 0.9 และ 1.2 โอห์ม วันหนึ่งถ้าเปลี่ยนเครื่อง หัวพอตเดิมก็ยังใช้ต่อได้",
            "G3 เหมาะกับคนที่เน้นเครื่องเบาและพกง่าย ส่วนรุ่น Pro เหมาะกับคนที่อยากเห็นข้อมูลบนจอใหญ่และอยากปรับลมเอง",
          ],
        },
        {
          heading: "เลือกหัวพอตกี่โอห์มดี",
          paragraphs: [
            "หัวพอต G3 มีสามค่า คือ 0.6 0.9 และ 1.2 โอห์ม โอห์มยิ่งต่ำลมยิ่งโล่งและใช้วัตต์สูงขึ้น โอห์มยิ่งสูงลมก็ยิ่งแน่น",
            "ตามตารางหัวพอตของ UWELL ฝั่งโอห์มต่ำเหมาะกับการสูบแบบ RDL ส่วนฝั่งโอห์มสูงเหมาะกับการสูบแบบ MTL คือดูดเข้าปากก่อน",
            "ในกล่องมีหัว 0.6 และ 0.9 โอห์มมาให้ ลองทั้งสองหัวก่อนก็ได้ ถ้ายังรู้สึกว่าลมโล่งไป หัว 1.2 โอห์มจะให้ลมแน่นขึ้นอีก",
          ],
        },
        {
          heading: "เติมด้านข้างกับเติมด้านบนต่างกันยังไง",
          paragraphs: [
            "หัวพอต G3 มีสองแบบ ต่างกันที่ตำแหน่งช่องเติมน้ำยา แบบหนึ่งอยู่ด้านข้าง อีกแบบอยู่ด้านบน",
            "เครื่องแต่ละชุดให้หัวพอตมาแบบเดียว ถ้าจะซื้อหัวพอตเพิ่ม ให้ดูแบบเติมจากหัวที่ได้มาในกล่อง",
          ],
        },
      ],
    },
    en: {
      lede: "The Caliburn G3 is the standard model in the G3 line, small and light. Below: how it differs from the G3 Pro, which pod resistance to pick, and the two ways to fill.",
      sections: [
        {
          heading: "How is the Caliburn G3 different from the G3 Pro?",
          paragraphs: [
            "The G3 has an aluminium body and weighs about 47g; the G3 Pro is about 92g, so the G3 is close to half the weight.",
            "The [G3 Pro](/products/caliburn-g3-pro) has the bigger battery at 1000mAh, goes up to 35W, has a full-front screen and a valve to fine-tune the airflow.",
            "The G3 Pro takes every G3 pod — 0.6Ω, 0.9Ω and 1.2Ω — so your pods carry over if you change devices.",
            "The G3 suits you if light and easy to carry matters most; the G3 Pro suits you if you want a big screen and airflow you tune yourself.",
          ],
        },
        {
          heading: "Which pod resistance?",
          paragraphs: [
            "G3 pods come in 0.6Ω, 0.9Ω and 1.2Ω. The lower the resistance, the looser the draw and the higher the wattage; the higher it is, the tighter the draw.",
            "On UWELL's pod chart, the low end suits an RDL draw and the high end an MTL draw.",
            "The box has a 0.6Ω and a 0.9Ω pod, so try both first. If the draw still feels too loose, a 1.2Ω pod tightens it further.",
          ],
        },
        {
          heading: "Side fill or top fill?",
          paragraphs: [
            "G3 pods come in two versions that differ in where the fill port sits: one on the side, one on the top.",
            "Each kit comes with one type. When you buy more pods, check the fill type of the pod that came in your box.",
          ],
        },
      ],
    },
    zh: {
      lede: "Caliburn G3 是 G3 系列的标准款，机身小巧轻便。下面是选购前值得了解的几点：和 G3 Pro 的区别、烟弹阻值怎么选，以及两种注油方式。",
      sections: [
        {
          heading: "Caliburn G3 和 G3 Pro 有什么不同？",
          paragraphs: [
            "G3 采用铝合金机身，约 47 克；G3 Pro 约 92 克，G3 轻了将近一半。",
            "[G3 Pro](/products/caliburn-g3-pro) 电池更大，1000mAh，最高 35W，正面整块屏幕，还有可微调的进气阀。",
            "0.6Ω、0.9Ω 和 1.2Ω 的 G3 烟弹在 G3 Pro 上也能用，以后换机，烟弹可以继续用。",
            "更看重轻巧好携带，G3 就够了；想在大屏上看清各项数据、自己调气流，就选 G3 Pro。",
          ],
        },
        {
          heading: "烟弹选哪个阻值？",
          paragraphs: [
            "G3 烟弹有 0.6Ω、0.9Ω 和 1.2Ω 三种。阻值越低，吸感越松、功率越高；阻值越高，吸感越紧。",
            "在 UWELL 的烟弹图里，低阻值一端适合 RDL，高阻值一端适合 MTL。",
            "盒内附 0.6Ω 和 0.9Ω 两颗烟弹，可以先都试试。如果还是觉得太松，1.2Ω 会更紧一些。",
          ],
        },
        {
          heading: "侧注油还是顶注油？",
          paragraphs: [
            "G3 烟弹有两种版本，区别在注油口的位置：一种在侧面，一种在顶部。",
            "每套只附其中一种。再买烟弹时，先看看盒里那颗是哪种注油方式。",
          ],
        },
      ],
    },
  },
  // Site-wide template round batch 1d (04/10): from UWELL's G3 Pro / KOKO pages, spec sheet and user manual; Thai = thai-copy 04/10.
  "caliburn-g3-pro": {
    th: {
      lede: "จอ ช่องลม และหัวพอตที่ใช้ได้ ไล่ดูทีละเรื่องด้านล่าง",
      sections: [
        {
          heading: "G3 Pro กับ G3 Pro KOKO เลือกตัวไหนดี",
          paragraphs: [
            "สองรุ่นนี้ใช้หัวพอต G3 เหมือนกัน",
            "G3 Pro ทรงเพรียว แบต 1000mAh หนักประมาณ 92 กรัม",
            "[G3 Pro KOKO](/products/caliburn-g3-pro-koko) ทรงกล่อง จอสี 1.8 นิ้ว เปลี่ยนธีมหน้าจอได้ และแบตใหญ่กว่าที่ 1250mAh"
          ]
        },
        {
          heading: "เลือกหัวพอตแบบไหนดี",
          paragraphs: [
            "ตารางหัวพอตของ UWELL ไล่จาก RDL ที่โอห์มต่ำ ไปถึง MTL (สูบแบบดูดเข้าปากก่อน) ที่โอห์มสูง",
            "หัวโอห์มต่ำลมโล่งกว่าและตั้งวัตต์ได้สูงกว่า ส่วนหัวโอห์มสูงลมแน่น เข้าทางคนสูบแบบ MTL",
            "ในกล่องมีมาให้ทั้งสองหัว ลองดูก่อนแล้วค่อยซื้อหัวที่ชอบเพิ่ม"
          ]
        }
      ]
    },
    en: {
      lede: "Below, one thing at a time: the screen, the airflow and the pods it takes.",
      sections: [
        {
          heading: "G3 Pro or G3 Pro KOKO?",
          paragraphs: [
            "Both take the same G3 pods.",
            "The G3 Pro is the slim one, with a 1000mAh battery, at about 92g.",
            "The [G3 Pro KOKO](/products/caliburn-g3-pro-koko) is the box-shaped one, with a 1.8-inch colour screen, screen themes and a 1250mAh battery."
          ]
        },
        {
          heading: "Which pod?",
          paragraphs: [
            "UWELL's pod chart runs from RDL at the low-ohm end to MTL at the high-ohm end.",
            "A lower-ohm pod gives a looser RDL draw at higher wattage; a higher-ohm pod a tighter MTL draw.",
            "Both come in the box, so you can try each before buying more."
          ]
        }
      ]
    },
    zh: {
      lede: "下面逐项来看：屏幕、气流，以及适用的烟弹。",
      sections: [
        {
          heading: "G3 Pro 还是 G3 Pro KOKO？",
          paragraphs: [
            "两款都用同样的 G3 烟弹。",
            "G3 Pro 是纤长款，1000mAh 电池，约 92 克。",
            "[G3 Pro KOKO](/products/caliburn-g3-pro-koko) 是方盒款，1.8 英寸彩屏，可换屏幕主题，1250mAh 电池。"
          ]
        },
        {
          heading: "选哪种烟弹？",
          paragraphs: [
            "UWELL 的烟弹图从低阻值的 RDL 排到高阻值的 MTL。",
            "低阻值烟弹是较松的 RDL 吸感、功率更高；高阻值烟弹是较紧的 MTL 吸感。",
            "两种都在盒内，可以都试过再决定要买哪种。"
          ]
        }
      ]
    },
  },
  "caliburn-g3-pro-koko": {
    th: {
      lede: "จอ ธีม แบต และหัวพอตที่ใช้ได้ ไล่ดูทีละเรื่องด้านล่าง",
      sections: [
        {
          heading: "G3 Pro KOKO กับ G3 Pro เลือกตัวไหนดี",
          paragraphs: [
            "สองรุ่นนี้ใช้หัวพอต G3 เหมือนกัน",
            "KOKO ทรงกล่อง แบตใหญ่กว่า หนักประมาณ 91 กรัม",
            "[G3 Pro](/products/caliburn-g3-pro) ทรงเพรียว แบต 1000mAh หนักพอ ๆ กันที่ประมาณ 92 กรัม"
          ]
        },
        {
          heading: "G3 Pro KOKO กับ G4 Pro KOKO ต่างกันยังไง",
          paragraphs: [
            "สองรุ่นนี้อยู่ในตระกูล KOKO และมีจอสีเหมือนกัน",
            "G3 Pro KOKO สั่งงานด้วยปุ่ม",
            "[G4 Pro KOKO](/products/caliburn-g4-pro-koko) ใช้จอทัช 2.0 นิ้ว แบต 2000mAh และเลือกได้ 3 โหมด"
          ]
        }
      ]
    },
    en: {
      lede: "Below, one thing at a time: the screen, the themes, the battery and the pods it takes.",
      sections: [
        {
          heading: "G3 Pro KOKO or G3 Pro?",
          paragraphs: [
            "Both take the same G3 pods.",
            "The KOKO is the box-shaped one, with the bigger battery, at about 91g.",
            "The [G3 Pro](/products/caliburn-g3-pro) is the slim one, with a 1000mAh battery, at much the same weight, about 92g."
          ]
        },
        {
          heading: "G3 Pro KOKO or G4 Pro KOKO?",
          paragraphs: [
            "Both are in the KOKO family and both have a colour screen.",
            "The G3 Pro KOKO is run by its button.",
            "The [G4 Pro KOKO](/products/caliburn-g4-pro-koko) has a 2.0-inch touchscreen, a 2000mAh battery and three output modes."
          ]
        }
      ]
    },
    zh: {
      lede: "下面逐项来看：屏幕、主题、电池，以及适用的烟弹。",
      sections: [
        {
          heading: "G3 Pro KOKO 还是 G3 Pro？",
          paragraphs: [
            "两款都用同样的 G3 烟弹。",
            "KOKO 是方盒款，电池更大，约 91 克。",
            "[G3 Pro](/products/caliburn-g3-pro) 是纤长款，1000mAh 电池，重量差不多，约 92 克。"
          ]
        },
        {
          heading: "G3 Pro KOKO 还是 G4 Pro KOKO？",
          paragraphs: [
            "两款都属于 KOKO 系列，都有彩屏。",
            "G3 Pro KOKO 用按键操作。",
            "[G4 Pro KOKO](/products/caliburn-g4-pro-koko) 是 2.0 英寸触屏，2000mAh 电池，三种输出模式。"
          ]
        }
      ]
    },
  },
  // Articles queue 0211 batch 5, VOOPOO (03/11): PnP X coils — facts = VOOPOO's PnP X platform page (voopoo.com/pnpx-platform:
  // draw style, airflow setting and VG per coil, 100 mL + the lab-conditions note, directional insertion, 2/3 fill, 5 min, DTL/MTL
  // cartridges) + its coil guide (PnP X ≠ original PnP, pull straight out) + the VINCI S page (0.3Ω floor); WebFetch 03/11, quotes in
  // articles-0311/voopoo-facts.md. Watts per coil stay in the spec table; the 0.6Ω VG (50–60% vs 50% on the same page) is unsaid.
  "coil-92": {
    th: {
      lede: "คอยล์ VOOPOO PnP X แต่ละค่ามีแนวการสูบ การเปิดช่องลม และน้ำยาที่ VOOPOO แนะนำไว้ต่างกัน ด้านล่างสรุปจากหน้าเว็บของ VOOPOO ให้ดูทีละเรื่อง",
      sections: [
        {
          heading: "ค่าไหนของคอยล์ PnP X เหมาะกับการสูบแบบไหน",
          paragraphs: [
            "VOOPOO แบ่งไว้ว่า 0.15 โอห์มกับ 0.2 โอห์มเป็นคอยล์สำหรับสูบแบบ DTL คือดูดลงปอดตรง ๆ 0.3 โอห์มใช้ได้ทั้ง DTL และ RDL ส่วน 0.45 โอห์มเป็นแบบ RDL",
            "ถัดขึ้นไป 0.6 โอห์มใช้ได้ทั้ง MTL และ RDL ส่วน 0.8 โอห์มกับ 1.0 โอห์มเป็นคอยล์ MTL ถ้ายังไม่แน่ใจว่าชอบสูบแบบไหน อ่านต่อได้ที่ [MTL กับ DTL สูบต่างกันยังไง แล้ว RDL คืออะไร](/guides/understanding-mtl-vs-dtl)",
          ],
        },
        {
          heading: "ควรเปิดช่องลมแค่ไหน",
          paragraphs: [
            "VOOPOO บอกไว้ด้วยว่าคอยล์แต่ละค่าควรเปิดช่องลมเข้าแค่ไหน 0.15 โอห์มให้เปิดเต็มที่ 0.2 โอห์มเปิดสองในสาม ส่วน 0.3 ถึง 0.8 โอห์มเปิดหนึ่งในสาม",
            "ช่องลมด้านบนของหัวพอต PnP X มีขีดบอกระดับไว้ ช่วยให้ปรับลมได้ตรงตามนี้ง่ายขึ้น",
          ],
        },
        {
          heading: "ใช้กับน้ำยาแบบไหน",
          paragraphs: [
            "VOOPOO แนะนำน้ำยา VG 50–70% สำหรับคอยล์ 0.15 ถึง 0.45 โอห์ม ส่วนคอยล์ 0.8 โอห์มกับ 1.0 โอห์มแนะนำน้ำยา VG 50%",
          ],
        },
        {
          heading: "คอยล์หนึ่งตัวใช้ได้นานแค่ไหน",
          paragraphs: [
            "VOOPOO บอกว่าคอยล์ PnP X หนึ่งตัวใช้กับน้ำยาได้ถึง 100mL โดยไม่ไหม้และไม่รั่ว แต่ก็เขียนหมายเหตุไว้ว่าตัวเลขนี้มาจากการทดสอบในสภาพที่ควบคุมไว้ ใช้จริงได้นานแค่ไหนจึงขึ้นกับการใช้งานของแต่ละคน",
            "คู่มือเปลี่ยนคอยล์ของ VOOPOO ให้สังเกตอาการแทนการนับวัน เช่น สูบแล้วมีรสไหม้ รสจางลง ควันน้อยลง หรือน้ำยารั่ว ถ้าเริ่มเป็นแบบนี้ก็ถึงเวลาเปลี่ยนตัวใหม่",
          ],
        },
        {
          heading: "ใส่คอยล์ใหม่ยังไง",
          paragraphs: [
            "VOOPOO ออกแบบคอยล์ PnP X ให้เสียบได้ทางเดียว เวลาเปลี่ยนให้ดึงตัวเก่าออกตรง ๆ แล้วกดตัวใหม่เข้าไปจนก้นคอยล์เสมอกับก้นหัวพอต ไม่มีช่องว่าง",
            "ใส่คอยล์ใหม่แล้ว ให้หยดน้ำยาลงรูสำลีของคอยล์สักสองสามหยด เติมน้ำยาให้ได้สองในสามของหัวพอต ปิดจุกเติม แล้วตั้งทิ้งไว้ 5 นาทีก่อนสูบ",
          ],
        },
        {
          heading: "คอยล์ PnP X ใช้กับเครื่องไหนได้บ้าง",
          paragraphs: [
            "VOOPOO บอกว่าคอยล์ PnP X ใช้กับเครื่องตระกูล DRAG และ VINCI ได้หลายรุ่น และใช้กับหัวพอต PnP X ได้ทั้งรุ่น DTL และ MTL แต่หัวรุ่น MTL ใส่ได้เฉพาะคอยล์ 0.3 โอห์มกับ 0.6 โอห์ม",
            "ก่อนเลือกค่า ควรดูว่าหัวที่ใช้อยู่เป็นรุ่น DTL หรือรุ่น MTL ส่วนหัวพอตเปล่าสำหรับคอยล์นี้ ดูได้ที่หน้า [หัวพอตเปล่า VOOPOO PnP X](/products/coil-56)",
            "ถ้าใช้ VINCI S อยู่ ให้เลือกค่าตั้งแต่ 0.3 โอห์มขึ้นไป เพราะ VOOPOO บอกว่าเครื่องรุ่นนี้ไม่รองรับคอยล์ที่ค่าต่ำกว่านั้น",
            "คอยล์ PnP X ใส่กับเครื่อง VOOPOO รุ่นก่อนที่ใช้คอยล์ PnP แบบเดิมไม่ได้ ถ้าเครื่องของคุณเป็นแบบนั้น ดูคอยล์ได้ที่หน้า [คอยล์ VOOPOO PnP](/products/coil-1)",
          ],
        },
      ],
    },
    en: {
      lede: "Each VOOPOO PnP X coil comes with its own recommended draw style, airflow setting and e-liquid. Below, from VOOPOO's own pages, one topic at a time.",
      sections: [
        {
          heading: "Which PnP X coil suits which draw?",
          paragraphs: [
            "VOOPOO rates the 0.15Ω and 0.2Ω for DTL, the 0.3Ω for DTL and RDL, the 0.45Ω for RDL, the 0.6Ω for MTL and RDL, and the 0.8Ω and 1.0Ω for MTL. Not sure which you like? See [MTL vs. DTL](/guides/understanding-mtl-vs-dtl).",
          ],
        },
        {
          heading: "How far should the airflow be open?",
          paragraphs: [
            "VOOPOO pairs an air-inlet setting with each coil: fully open for the 0.15Ω, two-thirds for the 0.2Ω, and one-third for the 0.3Ω to 0.8Ω. The PnP X pod's top airway carries a scale line to help you set it.",
          ],
        },
        {
          heading: "Which e-liquid?",
          paragraphs: [
            "VOOPOO recommends 50–70% VG for the 0.15Ω to 0.45Ω coils and 50% VG for the 0.8Ω and 1.0Ω.",
          ],
        },
        {
          heading: "How long does one coil last?",
          paragraphs: [
            "VOOPOO says each PnP X coil handles up to 100 mL of e-liquid without burning or leaking, and notes the figure comes from tests under professional conditions — real use varies. Its coil guide says to watch for the signs instead of counting days: a burnt or muted taste, less vapour or leaking.",
          ],
        },
        {
          heading: "How do I fit a new coil?",
          paragraphs: [
            "VOOPOO designs PnP X coils to insert one way only: pull the old one straight out and push the new one in until its base sits flush with the bottom of the pod. Then put a few drops into the wick holes, fill the pod to two-thirds, close the plug and let it sit 5 minutes before vaping.",
          ],
        },
        {
          heading: "Which devices do PnP X coils fit?",
          paragraphs: [
            "VOOPOO says PnP X coils fit many DRAG and VINCI devices and both versions of the PnP X pod, DTL and MTL — though the MTL pod takes only the 0.3Ω and 0.6Ω, so check which one you have before you pick a resistance. Empty pods are on the [VOOPOO PnP X empty pod](/products/coil-56) page. On a VINCI S, pick 0.3Ω or above: VOOPOO says it does not support coils below 0.3Ω. PnP X coils do not fit older VOOPOO devices built on the original PnP coils — for those, see [VOOPOO PnP coils](/products/coil-1).",
          ],
        },
      ],
    },
    zh: {
      lede: "VOOPOO PnP X 线圈的每个阻值，VOOPOO 都分别给出了抽法、气流和烟油建议。下面根据 VOOPOO 官网的资料，一项项说明。",
      sections: [
        {
          heading: "PnP X 线圈哪个阻值适合哪种抽法？",
          paragraphs: [
            "VOOPOO 把 0.15Ω 和 0.2Ω 标为 DTL，0.3Ω 为 DTL 与 RDL，0.45Ω 为 RDL，0.6Ω 为 MTL 与 RDL，0.8Ω 和 1.0Ω 为 MTL。还不确定自己适合哪种抽法，可以看[MTL 与 DTL 的区别](/guides/understanding-mtl-vs-dtl)。",
          ],
        },
        {
          heading: "气流该开多大？",
          paragraphs: [
            "VOOPOO 为每个阻值配了进气建议：0.15Ω 全开，0.2Ω 开三分之二，0.3Ω 到 0.8Ω 开三分之一。PnP X 烟弹顶部气道带刻度线，方便按建议调节。",
          ],
        },
        {
          heading: "配什么烟油？",
          paragraphs: [
            "VOOPOO 建议 0.15Ω 到 0.45Ω 用 50–70% VG 的烟油，0.8Ω 和 1.0Ω 用 50% VG。",
          ],
        },
        {
          heading: "一颗线圈能用多久？",
          paragraphs: [
            "VOOPOO 表示每颗 PnP X 线圈可支撑最多 100 mL 烟油而不烧焦、不漏油，并注明该数据来自专业条件下的测试，实际表现视使用情况而定。它的换线圈指南建议看症状而不是数天数：出现焦味、味道变淡、烟雾变少或漏油时就该换了。",
          ],
        },
        {
          heading: "怎么装新线圈？",
          paragraphs: [
            "VOOPOO 把 PnP X 线圈设计为只能按一个方向插入：把旧线圈直接拔出，新线圈推到底，使线圈底部与烟弹底部齐平、没有缝隙。然后在导油孔滴几滴烟油，注油至三分之二，盖好注油塞，静置 5 分钟再抽。",
          ],
        },
        {
          heading: "PnP X 线圈适用哪些设备？",
          paragraphs: [
            "VOOPOO 表示 PnP X 线圈适用于多款 DRAG 和 VINCI 设备，以及 DTL、MTL 两版 PnP X 烟弹，但 MTL 版只能用 0.3Ω 和 0.6Ω，选阻值前请先确认手上的烟弹是哪一版。空烟弹见 [VOOPOO PnP X 空烟弹](/products/coil-56)。用 VINCI S 的话请选 0.3Ω 及以上，VOOPOO 表示它不支持低于 0.3Ω 的线圈。PnP X 线圈不适用于使用原版 PnP 线圈的旧款 VOOPOO 设备，这类设备请看 [VOOPOO PnP 线圈](/products/coil-1)。",
          ],
        },
      ],
    },
  },
  // Articles queue 0211 batch 5, VOOPOO (03/11): TPP coils — facts = VOOPOO's DRAG X PRO page (TPP-DM1…DM4 table: draw style,
  // ohms, watts, ≤10 mg; "two TPP coils of 0.15 Ω and 0.2 Ω"), its DRAG X Plus page (the patented TPP coil tech) and its TPP
  // platform page (voopoo.com/fr/tpp-platform/tpp-dm3.html: mesh "Dual In One", DM3 & DM4 newly improved, the pod takes every TPP
  // coil — said of the TPP-X pod, not repeated here); rest / first-use = voopoo.com/faq.html; WebFetch 03/11, quotes in articles-0311/voopoo-facts.md. Pack count is not on a VOOPOO page → unsaid.
  "coil-38": {
    th: {
      lede: "คอยล์ VOOPOO TPP มีสี่รุ่น ด้านล่างสรุปจากหน้าเว็บของ VOOPOO ว่าแต่ละรุ่นต่างกันตรงไหน ใช้วัตต์เท่าไร ใช้กับน้ำยาแบบไหน และคอยล์ตระกูลนี้มีอะไรพิเศษ",
      sections: [
        {
          heading: "คอยล์ TPP สี่รุ่นต่างกันยังไง",
          paragraphs: [
            "ตามตารางของ VOOPOO TPP-DM1 กับ TPP-DM3 เป็น 0.15 โอห์มเท่ากัน แต่ใช้วัตต์ต่างกัน DM1 ใช้ 60–80 วัตต์ ส่วน DM3 ใช้ 80–100 วัตต์ ทั้งสองตัวและ TPP-DM2 เป็นคอยล์สำหรับสูบแบบดูดลงปอดตรง ๆ ที่ VOOPOO เรียกว่า DL",
            "ส่วน TPP-DM4 เป็นแบบ Half DL ใช้ 32–40 วัตต์ ซึ่งต่ำกว่าอีกสามรุ่น นอกจากนี้ VOOPOO ระบุว่า DM3 กับ DM4 เป็นสองรุ่นที่ปรับปรุงใหม่",
          ],
        },
        {
          heading: "ใช้กับน้ำยาแบบไหน",
          paragraphs: [
            "VOOPOO แนะนำให้ใช้คอยล์ TPP ทั้งสี่รุ่นกับน้ำยาที่มีความเข้มข้นนิโคตินไม่เกิน 10mg",
          ],
        },
        {
          heading: "คอยล์ TPP มีอะไรพิเศษ",
          paragraphs: [
            "VOOPOO บอกว่าคอยล์ตระกูล TPP ใช้เทคโนโลยีใหม่ที่จดสิทธิบัตรไว้ ช่วยให้พื้นที่ที่ใช้ทำควันข้างในคอยล์กว้างขึ้น และคอยล์ร้อนเร็วขึ้น",
            "ตัวคอยล์เป็นแบบ mesh และใช้เทคโนโลยีที่ VOOPOO เรียกว่า Dual In One",
          ],
        },
        {
          heading: "คอยล์ TPP ใช้กับเครื่องหรือหัวพอตไหน",
          paragraphs: [
            "หัวพอตที่ใช้คู่กับคอยล์ตระกูลนี้คือ TPP Pod ของ VOOPOO ดูหัวพอตเปล่ารุ่นนี้ได้ที่หน้า [หัวพอตเปล่า VOOPOO TPP Pod](/products/coil-87)",
            "ส่วนเครื่อง DRAG X PRO ของ VOOPOO มากับคอยล์ TPP สองตัวในกล่อง คือตัว 0.15 โอห์มกับตัว 0.2 โอห์ม",
            "คอยล์โอห์มต่ำที่ใช้วัตต์สูงแบบนี้ต้องใช้กับเครื่องที่ตั้งวัตต์ได้ถึงช่วงนั้น ก่อนเลือกรุ่นจึงควรเช็ควัตต์สูงสุดของเครื่องที่ใช้อยู่ด้วย",
          ],
        },
        {
          heading: "ใส่คอยล์ใหม่แล้วต้องรอไหม",
          paragraphs: [
            "หน้าคำถามที่พบบ่อยของ VOOPOO แนะนำให้เติมน้ำยาราว 70% ทิ้งไว้ 5 นาทีก่อนสูบ และให้สูบพัฟแรก ๆ ของคอยล์ใหม่ด้วยวัตต์ต่ำ",
            "ถ้าอยากรู้ว่าคอยล์ถึงรอบเปลี่ยนเมื่อไหร่ อ่านต่อได้ที่ [วิธีดูแลคอยล์และหัวพอต](/guides/coil-and-pod-maintenance)",
          ],
        },
      ],
    },
    en: {
      lede: "VOOPOO TPP coils come in four models. Below, from VOOPOO's own pages: how they differ, what wattage each needs, which e-liquid suits them and what's special about the range.",
      sections: [
        {
          heading: "How do the four TPP coils differ?",
          paragraphs: [
            "In VOOPOO's table the TPP-DM1 and TPP-DM3 are both 0.15Ω but run at different wattages — 60–80W for the DM1, 80–100W for the DM3. Those two and the TPP-DM2 are what VOOPOO calls DL coils, for a direct-lung draw. The TPP-DM4 is rated Half DL at 32–40W, lower than the other three. VOOPOO marks the DM3 and DM4 as newly improved.",
          ],
        },
        {
          heading: "Which e-liquid?",
          paragraphs: [
            "VOOPOO recommends e-liquid of up to 10 mg nicotine strength for all four.",
          ],
        },
        {
          heading: "What's special about TPP coils?",
          paragraphs: [
            "VOOPOO says the TPP series uses a new patented technology that enlarges the atomising area inside the coil and speeds up heating. The coils are mesh, built on what VOOPOO calls Dual In One technology.",
          ],
        },
        {
          heading: "Which devices and pods do TPP coils fit?",
          paragraphs: [
            "The TPP Pod is the pod listed for these coils; an empty one is on the [VOOPOO TPP Pod](/products/coil-87) page. VOOPOO's DRAG X PRO comes with two TPP coils, a 0.15Ω and a 0.2Ω. Low-resistance, high-wattage coils need a device that can be set that high, so check your device's maximum first.",
          ],
        },
        {
          heading: "Do I need to wait after fitting a new coil?",
          paragraphs: [
            "VOOPOO's FAQ suggests filling to about 70%, waiting 5 minutes before vaping, and taking the first few puffs on a new coil at low wattage. When to change a coil is covered in [coil and pod maintenance](/guides/coil-and-pod-maintenance).",
          ],
        },
      ],
    },
    zh: {
      lede: "VOOPOO TPP 线圈共有四款。下面根据 VOOPOO 官网的资料，介绍它们的区别、各需多大功率、适合哪种烟油，以及这个系列有什么特别之处。",
      sections: [
        {
          heading: "四款 TPP 线圈有什么区别？",
          paragraphs: [
            "按 VOOPOO 的表格，TPP-DM1 和 TPP-DM3 都是 0.15Ω，但功率不同：DM1 为 60–80W，DM3 为 80–100W。这两款和 TPP-DM2 都属于 VOOPOO 标注的 DL 直肺线圈。TPP-DM4 标为 Half DL，功率 32–40W，低于另外三款。VOOPOO 注明 DM3 和 DM4 是新升级的型号。",
          ],
        },
        {
          heading: "配什么烟油？",
          paragraphs: [
            "VOOPOO 建议四款都搭配尼古丁浓度不超过 10 mg 的烟油。",
          ],
        },
        {
          heading: "TPP 线圈有什么特别？",
          paragraphs: [
            "VOOPOO 表示 TPP 系列采用新的专利技术，扩大了线圈内部的雾化面积，并加快了加热速度。线圈为网状结构，采用 VOOPOO 所说的 Dual In One 技术。",
          ],
        },
        {
          heading: "TPP 线圈适用哪些设备和烟弹？",
          paragraphs: [
            "适用的烟弹是 VOOPOO 的 TPP Pod，空烟弹见 [VOOPOO TPP Pod](/products/coil-87)。VOOPOO 的 DRAG X PRO 盒内附带两颗 TPP 线圈：0.15Ω 和 0.2Ω。低阻值、高功率的线圈需要能设到相应功率的设备，选购前请先确认设备的最大功率。",
          ],
        },
        {
          heading: "装新线圈后要等吗？",
          paragraphs: [
            "VOOPOO 的常见问题建议注油约七成，静置 5 分钟再抽，新线圈的前几口用低功率。什么时候该换线圈，见[线圈与烟弹保养](/guides/coil-and-pod-maintenance)。",
          ],
        },
      ],
    },
  },
  // Articles queue 0211 batch 5, VOOPOO (03/11): TPP Pod (empty) — facts = VOOPOO's DRAG X Plus page ("TPP pod tank with 510
  // interface"; the patented TPP coil tech), its DRAG X PRO page (TPP-DM1…DM4 table) and voopoo.com/faq.html (70% fill, 5 min, low
  // wattage first); WebFetch 03/11. VOOPOO's TPP platform page describes the TPP-X Pod (magnetic, side fill, steel + PCTG, 360°
  // airflow, 3–5 min rest) — a different pod, so none of it is said here (checker #1179 552d2398). The DRAG 3 / DRAG X Plus fit stays
  // in the spec row. Page stays under 1,000 Thai chars: VOOPOO says little about this pod (Friday 03/11).
  "coil-87": {
    th: {
      lede: "หัวพอตเปล่า VOOPOO TPP Pod ต่อกับเครื่องแบบไหน ใส่คอยล์รุ่นไหนได้บ้าง และหลังเติมน้ำยาต้องรอนานแค่ไหน ด้านล่างสรุปจากหน้าเว็บของ VOOPOO ให้ดูทีละเรื่อง",
      sections: [
        {
          heading: "หัวพอต TPP ต่อกับเครื่องยังไง",
          paragraphs: [
            "หน้า DRAG X Plus ของ VOOPOO บอกว่าหัวพอต TPP ต่อกับเครื่องด้วยขั้วต่อแบบ 510",
          ],
        },
        {
          heading: "ใส่คอยล์ TPP รุ่นไหนได้บ้าง",
          paragraphs: [
            "หัวนี้ใช้กับคอยล์ตระกูล TPP",
            "หน้า DRAG X PRO ของ VOOPOO ระบุคอยล์ TPP ไว้สี่รุ่น คือ TPP-DM1 0.15 โอห์มใช้ 60–80 วัตต์ TPP-DM2 0.2 โอห์มใช้ 40–60 วัตต์ TPP-DM3 0.15 โอห์มใช้ 80–100 วัตต์ และ TPP-DM4 0.3 โอห์มใช้ 32–40 วัตต์",
            "คอยล์ทุกรุ่นนี้ VOOPOO แนะนำให้ใช้กับน้ำยาที่มีความเข้มข้นนิโคตินไม่เกิน 10mg ส่วนรายละเอียดของแต่ละรุ่นดูได้ที่หน้า [คอยล์ VOOPOO TPP](/products/coil-38)",
            "VOOPOO บอกด้วยว่าคอยล์ตระกูล TPP ใช้เทคโนโลยีใหม่ที่จดสิทธิบัตรไว้ ซึ่งช่วยให้คอยล์ร้อนได้เร็วขึ้น",
          ],
        },
        {
          heading: "เติมน้ำยาแล้วต้องรอไหม",
          paragraphs: [
            "หน้าคำถามที่พบบ่อยของ VOOPOO แนะนำให้เติมน้ำยาราว 70% แล้วทิ้งไว้ 5 นาทีก่อนสูบ และสูบพัฟแรก ๆ ของคอยล์ใหม่ด้วยวัตต์ต่ำก่อน",
          ],
        },
        {
          heading: "หัวนี้มีคอยล์มาให้ไหม",
          paragraphs: [
            "ต้องใส่คอยล์ TPP เองก่อนใช้ วิธีเลือกคือเช็ควัตต์สูงสุดของเครื่องก่อน แล้วเลือกรุ่นที่ช่วงวัตต์อยู่ในระดับที่เครื่องตั้งได้",
            "ส่วนการดูแลหัวพอตกับคอยล์ให้ใช้ได้นาน อ่านต่อได้ที่ [วิธีดูแลคอยล์และหัวพอต](/guides/coil-and-pod-maintenance)",
          ],
        },
      ],
    },
    en: {
      lede: "The VOOPOO TPP Pod is an empty pod. Below, from VOOPOO's own pages: how it connects, which coils it takes and how long to wait after filling.",
      sections: [
        {
          heading: "How does the TPP Pod connect?",
          paragraphs: [
            "VOOPOO's DRAG X Plus page describes the TPP pod tank as having a 510 interface.",
          ],
        },
        {
          heading: "Which TPP coils fit?",
          paragraphs: [
            "It takes TPP coils; VOOPOO's DRAG X PRO page lists four: TPP-DM1 0.15Ω at 60–80W, TPP-DM2 0.2Ω at 40–60W, TPP-DM3 0.15Ω at 80–100W and TPP-DM4 0.3Ω at 32–40W, all recommended for e-liquid up to 10 mg nicotine strength. Details for each are on the [VOOPOO TPP coils](/products/coil-38) page. VOOPOO also says the TPP series uses a new patented technology that speeds up heating.",
          ],
        },
        {
          heading: "Do I need to wait after filling?",
          paragraphs: [
            "VOOPOO's FAQ suggests filling to about 70%, waiting 5 minutes before vaping and taking the first few puffs on a new coil at low wattage.",
          ],
        },
        {
          heading: "Does it come with a coil?",
          paragraphs: [
            "No coil comes with it — fit a TPP coil first. Check your device's maximum wattage and pick a coil whose range it can reach. Looking after pods and coils is covered in [coil and pod maintenance](/guides/coil-and-pod-maintenance).",
          ],
        },
      ],
    },
    zh: {
      lede: "VOOPOO TPP Pod 是空烟弹。下面根据 VOOPOO 官网的资料，介绍它怎么连接主机、能装哪些线圈，以及注油后要等多久。",
      sections: [
        {
          heading: "TPP 烟弹怎么连接主机？",
          paragraphs: [
            "VOOPOO 的 DRAG X Plus 页面提到 TPP 烟弹带 510 接口。",
          ],
        },
        {
          heading: "能装哪些 TPP 线圈？",
          paragraphs: [
            "这款烟弹使用 TPP 线圈。VOOPOO 的 DRAG X PRO 页面列出四款：TPP-DM1 0.15Ω 为 60–80W，TPP-DM2 0.2Ω 为 40–60W，TPP-DM3 0.15Ω 为 80–100W，TPP-DM4 0.3Ω 为 32–40W，都建议搭配尼古丁浓度不超过 10 mg 的烟油。各款详情见 [VOOPOO TPP 线圈](/products/coil-38)。VOOPOO 还表示 TPP 系列采用新的专利技术，加热更快。",
          ],
        },
        {
          heading: "注油后要等吗？",
          paragraphs: [
            "VOOPOO 的常见问题建议注油约七成，静置 5 分钟再抽，新线圈的前几口用低功率。",
          ],
        },
        {
          heading: "带线圈吗？",
          paragraphs: [
            "不带线圈，使用前需先装 TPP 线圈。请先确认设备的最大功率，再选功率范围在其之内的线圈。烟弹和线圈的保养见[线圈与烟弹保养](/guides/coil-and-pod-maintenance)。",
          ],
        },
      ],
    },
  },
  // Site-wide template round batch 2c (04/10): from VOOPOO's DRAG 6 page and posters; Thai = thai-copy 04/10.
  "drag-6": {
    th: {
      lede: "DRAG 6 คือ DRAG ที่ VOOPOO ออกแบบใหม่ โดยยึดเรื่องการควบคุมเป็นหลัก ด้านล่างไล่ให้ดูทีละเรื่อง",
      sections: [
        {
          heading: "DRAG 6 ต่างจาก DRAG 5 ยังไง",
          paragraphs: [
            "VOOPOO ปรับใหม่เกือบทุกส่วน ทั้งชิป แบต จอ ถังน้ำยา และปุ่มยิง",
            "DRAG 5 ตั้งวัตต์สูงสุดได้น้อยกว่า ใช้ชิป GENE.TT 2.0 และถัง UFORCE-X Tank รุ่นก่อน",
            "แบตของ DRAG 5 เป็นถ่าน 18650 สองก้อนแบบถอดเปลี่ยนได้ จอเล็กกว่า และปุ่มยิงเป็นปุ่มกดธรรมดา"
          ]
        },
        {
          heading: "DRAG 6 กับ X3 และ S3 เลือกตัวไหนดี",
          paragraphs: [
            "[DRAG X3](/products/drag-x3) ไม่มีแบตในตัว ใช้ถ่าน 18650 หรือ 21700 หนึ่งก้อนซึ่งต้องซื้อแยก ตั้งได้ 5–80 วัตต์ และใช้จอทัชขนาดเท่ากับ DRAG 6",
            "[DRAG S3](/products/drag-s3) มีแบตในตัว 3000mAh ตั้งได้ 5–60 วัตต์ และใช้จอ TFT 0.96 นิ้ว",
            "ถ้าชอบเปลี่ยนถ่านเอง DRAG X3 จะตรงกว่า ถ้าอยากได้แบตในตัวโดยไม่ต้องใช้วัตต์สูง DRAG S3 ก็เพียงพอ ส่วนช่วงวัตต์ที่กว้างที่สุดในสามรุ่นนี้อยู่ที่ DRAG 6",
            "ทั้งสามรุ่นในตระกูล DRAG เทียบกันทีละเรื่องไว้ที่ [DRAG 6 กับ DRAG S3 ต่างกันยังไง](/guides/comparing-voopoo-drag-models)"
          ]
        },
        {
          heading: "ในกล่องมีอะไรบ้าง",
          paragraphs: [
            "ในกล่องมีตัวเครื่อง DRAG 6 ถังน้ำยา และคอยล์สองตัว คือ PnP X 0.15 โอห์มกับ 0.3 โอห์ม",
            "นอกจากนั้นยังมี PnP X Platform Card หลอดแก้วสำรอง ชุดยางซิลิโคน สาย USB-C และคู่มือ"
          ]
        }
      ]
    },
    en: {
      lede: "The DRAG 6 is the DRAG that VOOPOO rebuilt with control at its centre. Below, one thing at a time.",
      sections: [
        {
          heading: "What changed from the DRAG 5?",
          paragraphs: [
            "VOOPOO reworked almost every part: the chip, the battery, the screen, the tank and the fire button.",
            "The DRAG 5 had a lower wattage ceiling, the GENE.TT 2.0 chip and the earlier UFORCE-X Tank.",
            "It ran on two removable 18650 cells, with a smaller screen and a plain press button."
          ]
        },
        {
          heading: "DRAG 6, DRAG X3 or DRAG S3?",
          paragraphs: [
            "The [DRAG X3](/products/drag-x3) has no built-in battery: it runs on one 18650 or 21700 cell, sold separately, goes from 5 to 80W, and has a touchscreen the same size as the DRAG 6's.",
            "The [DRAG S3](/products/drag-s3) has a 3000mAh battery built in, runs 5–60W and has a 0.96-inch TFT screen.",
            "If you like swapping cells, the X3 suits you better. If you want a built-in battery and don't need high wattage, the S3 is enough. The widest wattage range of the three is on the DRAG 6."
          ]
        },
        {
          heading: "What's in the box?",
          paragraphs: [
            "The DRAG 6 itself, the tank, and two PnP X coils: 0.15Ω and 0.3Ω.",
            "Plus a PnP X Platform Card, a spare glass tube, a pack of silicone rubber parts, a USB-C cable and the user manual."
          ]
        }
      ]
    },
    zh: {
      lede: "DRAG 6 是 VOOPOO 以操控为核心重新打造的 DRAG。下面逐项来看。",
      sections: [
        {
          heading: "DRAG 6 和 DRAG 5 有什么不同？",
          paragraphs: [
            "VOOPOO 几乎把每个部分都重新做了：芯片、电池、屏幕、烟仓和火键。",
            "DRAG 5 的功率上限更低，用的是 GENE.TT 2.0 芯片，以及上一代 UFORCE-X Tank 烟仓。",
            "它使用两颗可拆换的 18650 电池，屏幕更小，火键是普通按键。"
          ]
        },
        {
          heading: "DRAG 6、DRAG X3 还是 DRAG S3？",
          paragraphs: [
            "[DRAG X3](/products/drag-x3) 没有内置电池，使用一颗需另购的 18650 或 21700 电池，功率 5–80W，触屏尺寸与 DRAG 6 相同。",
            "[DRAG S3](/products/drag-s3) 内置 3000mAh 电池，功率 5–60W，0.96 英寸 TFT 屏。",
            "喜欢自己换电池，选 X3 更合适；想要内置电池又不需要高功率，S3 就够了；三款中功率范围最宽的是 DRAG 6。"
          ]
        },
        {
          heading: "包装内有什么？",
          paragraphs: [
            "DRAG 6 主机、烟仓，以及两颗 PnP X 线圈：0.15Ω 和 0.3Ω。",
            "另有 PnP X Platform Card、备用玻璃管、硅胶配件包、USB-C 数据线和使用说明书。"
          ]
        }
      ]
    },
  },
  // Articles queue 0211 batch 5, VOOPOO (03/11): PnP X empty pod — facts = VOOPOO's PnP X platform page (voopoo.com/pnpx-platform:
  // the DTL and MTL cartridges — ohms, nicotine, 510 drip tip, coils each takes; the layered airway and dual L-shape base; scale
  // line; directional coil; 2/3 fill + plug + 5 min; 100 mL per coil + the lab-conditions note); WebFetch 03/11, quotes in
  // articles-0311/voopoo-facts.md. Which of the two the shop's "Silver" listing is, VOOPOO does not say → both described, none
  // claimed. 5mL · side fill · DRAG S2 / X2 · 2 per pack stay in the tagline + spec rows.
  "coil-56": {
    th: {
      lede: "หัวพอตเปล่า VOOPOO PnP X มีสองรุ่น คือรุ่น DTL กับรุ่น MTL ด้านล่างสรุปจากหน้าเว็บของ VOOPOO ให้ดูทีละเรื่อง ตั้งแต่สองรุ่นต่างกันตรงไหน ไปจนถึงการใส่คอยล์และเติมน้ำยาครั้งแรก",
      sections: [
        {
          heading: "หัวพอต PnP X รุ่น DTL กับ MTL ต่างกันยังไง",
          paragraphs: [
            "หัวพอตรุ่น DTL ใช้กับคอยล์ PnP X ได้ทุกค่า VOOPOO แนะนำให้ใช้กับน้ำยาความเข้มข้นนิโคตินไม่เกิน 10mg",
            "ส่วนรุ่น MTL ใช้ได้เฉพาะคอยล์ PnP X 0.3 โอห์มกับ 0.6 โอห์ม ความเข้มข้นนิโคตินที่แนะนำคือไม่เกิน 35mg และมีปากดูดแบบ 510 ที่ถอดเปลี่ยนได้",
            "VOOPOO แนะนำให้ใช้น้ำยาที่มี VG 50–70% กับหัวพอตทั้งสองรุ่น",
          ],
        },
        {
          heading: "คอยล์ PnP X กันรั่วยังไง",
          paragraphs: [
            "ข้างในคอยล์ PnP X VOOPOO แยกทางลม ส่วนที่ทำความร้อน และช่องอากาศไว้คนละชั้น เพื่อกันไม่ให้น้ำยาไหลซึมลงด้านล่าง",
            "ที่ฐานของคอยล์มีโครงสร้างรูปตัว L สองตัว VOOPOO บอกว่าช่วยให้แรงดันข้างในสมดุล และกันไม่ให้หยดน้ำยาที่ค้างอยู่ซึมออกมา",
          ],
        },
        {
          heading: "เปิดลมแค่ไหนดี",
          paragraphs: [
            "ช่องลมด้านบนของหัวพอตมีขีดบอกระดับ ช่วยให้ปรับลมได้แม่นขึ้น ส่วนระดับที่ควรเปิด VOOPOO ให้ไว้ตามค่าคอยล์ คอยล์ 0.15 โอห์มเปิดสุด คอยล์ 0.2 โอห์มเปิดประมาณสองในสาม และคอยล์ 0.3–0.8 โอห์มเปิดประมาณหนึ่งในสาม",
          ],
        },
        {
          heading: "ใส่คอยล์และเติมน้ำยาครั้งแรกยังไง",
          paragraphs: [
            "คอยล์ PnP X ออกแบบให้เสียบได้ทางเดียว พอกดเข้าไปจนสุด ก้นคอยล์ก็จะเสมอกับก้นหัวพอตพอดี ค่าคอยล์ที่มีให้เลือกดูได้ที่หน้า [คอยล์ VOOPOO PnP X](/products/coil-92)",
            "VOOPOO แนะนำให้เติมน้ำยาสองในสามของหัวพอต ปิดจุกเติมให้สนิท แล้วตั้งทิ้งไว้ 5 นาทีก่อนเริ่มสูบ",
          ],
        },
        {
          heading: "คอยล์หนึ่งตัวใช้ได้นานแค่ไหน",
          paragraphs: [
            "VOOPOO ระบุว่าคอยล์ PnP X หนึ่งตัวใช้กับน้ำยาได้ถึง 100mL โดยไม่ไหม้และไม่รั่ว ตัวเลขนี้มาจากการทดสอบในสภาพที่ควบคุมไว้ ส่วนที่ใช้ได้จริงขึ้นกับการใช้งานของแต่ละคน",
            "ถ้าอยากให้หัวพอตและคอยล์ใช้ได้นานขึ้น อ่านต่อได้ที่ [วิธีดูแลคอยล์และหัวพอต](/guides/coil-and-pod-maintenance)",
          ],
        },
      ],
      faq: [
        {
          question: "หัวพอตเปล่า PnP X มีคอยล์มาให้ไหม",
          answer: "ไม่มีค่ะ ต้องซื้อคอยล์ PnP X แยก โดยเลือกค่าโอห์มให้ตรงกับรุ่นของหัวพอตนะคะ",
        },
      ],
    },
    en: {
      lede: "The VOOPOO PnP X empty pod comes in two versions, DTL and MTL. Below, from VOOPOO's PnP X page: how the two differ, how the coils resist leaks, how the airflow is set and how to fit a coil and fill for the first time.",
      sections: [
        {
          heading: "How do the PnP X DTL and MTL pods differ?",
          paragraphs: [
            "The DTL pod takes every PnP X coil, and VOOPOO recommends e-liquid up to 10 mg nicotine strength for it. The MTL pod takes only the PnP X 0.3Ω and 0.6Ω coils, with up to 35 mg recommended, and has a replaceable 510 drip tip. VOOPOO recommends 50–70% VG for both.",
          ],
        },
        {
          heading: "How does it resist leaks?",
          paragraphs: [
            "VOOPOO builds the PnP X coil with the airway, heating zone and air cavity in separate layers so e-liquid doesn't run down, and a dual L-shape structure at the coil's base keeps the pressure balanced so condensate doesn't leak.",
          ],
        },
        {
          heading: "How is the airflow set?",
          paragraphs: [
            "The pod's top airway carries a scale line for precise setting. VOOPOO pairs a setting with each coil: fully open for the 0.15Ω, about two-thirds for the 0.2Ω, and about one-third for the 0.3Ω to 0.8Ω.",
          ],
        },
        {
          heading: "How do I fit a coil and fill it the first time?",
          paragraphs: [
            "PnP X coils go in one way only — push until the coil's base sits flush with the bottom of the pod. The resistances on offer are on the [VOOPOO PnP X coils](/products/coil-92) page. VOOPOO recommends filling to about two-thirds, closing the plug and letting the pod sit 5 minutes before use.",
          ],
        },
        {
          heading: "How long does one coil last?",
          paragraphs: [
            "VOOPOO says each PnP X coil handles up to 100 mL of e-liquid without burning or leaking, noting the figure comes from tests under professional conditions and real use varies. Looking after pods and coils is covered in [coil and pod maintenance](/guides/coil-and-pod-maintenance).",
          ],
        },
      ],
      faq: [
        {
          question: "Does the PnP X empty pod come with a coil?",
          answer: "No. PnP X coils are sold separately — pick a resistance that matches your pod version.",
        },
      ],
    },
    zh: {
      lede: "VOOPOO PnP X 空烟弹分 DTL 和 MTL 两版。下面根据 VOOPOO 的 PnP X 页面，介绍两版的区别、线圈怎么防漏、气流怎么调，以及第一次装线圈和注油的方法。",
      sections: [
        {
          heading: "PnP X 空烟弹 DTL 版和 MTL 版有什么区别？",
          paragraphs: [
            "DTL 版兼容所有 PnP X 线圈，VOOPOO 建议搭配尼古丁浓度不超过 10 mg 的烟油。MTL 版只能用 PnP X 0.3Ω 和 0.6Ω 线圈，建议尼古丁浓度不超过 35 mg，并配可更换的 510 烟嘴。VOOPOO 建议两版都用 50–70% VG 的烟油。",
          ],
        },
        {
          heading: "怎么防漏？",
          paragraphs: [
            "VOOPOO 在 PnP X 线圈里把气道、加热区和空腔分在不同层，防止烟油往下漏；线圈底部的双 L 形结构保持压力平衡，防止冷凝液渗漏。",
          ],
        },
        {
          heading: "气流怎么调？",
          paragraphs: [
            "烟弹顶部气道带刻度线，方便精准调节。VOOPOO 为每个阻值配了建议：0.15Ω 全开，0.2Ω 约开三分之二，0.3Ω 到 0.8Ω 约开三分之一。",
          ],
        },
        {
          heading: "第一次怎么装线圈、怎么注油？",
          paragraphs: [
            "PnP X 线圈只能按一个方向插入，推到线圈底部与烟弹底部齐平即可。可选阻值见 [VOOPOO PnP X 线圈](/products/coil-92)。VOOPOO 建议注油约三分之二，盖好注油塞，静置 5 分钟再用。",
          ],
        },
        {
          heading: "一颗线圈能用多久？",
          paragraphs: [
            "VOOPOO 表示每颗 PnP X 线圈可支撑最多 100 mL 烟油而不烧焦、不漏油，并注明该数据来自专业条件下的测试，实际视使用情况而定。烟弹和线圈的保养见[线圈与烟弹保养](/guides/coil-and-pod-maintenance)。",
          ],
        },
      ],
      faq: [
        {
          question: "PnP X 空烟弹带线圈吗？",
          answer: "不带，PnP X 线圈需另购，请选择与烟弹版本相符的阻值。",
        },
      ],
    },
  },
  // Site-wide template round batch 2d (04/10): from VOOPOO's DRAG S3 / X3 pages and posters; Thai = thai-copy 04/10.
  "drag-s3": {
    th: {
      lede: "DRAG S3 เป็น DRAG รุ่นที่ VOOPOO ตั้งใจทำให้ใช้ง่าย และหยิบติดตัวไปได้ทุกวัน ด้านล่างไล่ให้ดูทีละเรื่อง",
      sections: [
        {
          heading: "DRAG S3 กับ DRAG X3 เลือกตัวไหนดี",
          paragraphs: [
            "ทั้งสองรุ่นใช้หัวพอตและคอยล์ PnP X ชุดเดียวกัน ที่ต่างกันคือแบต วัตต์ และจอ",
            "[DRAG X3](/products/drag-x3) ไม่มีแบตในตัว ใช้ถ่าน 18650 หรือ 21700 ที่ถอดเปลี่ยนได้ ตั้งได้ถึง 80 วัตต์ และใช้จอทัชขนาด 1.66 นิ้ว",
            "VOOPOO วาง DRAG X3 ไว้สำหรับคนสูบ DTL ที่ชอบปรับแต่งเครื่องเอง ถ้าไม่ได้ต้องการวัตต์สูงขนาดนั้น DRAG S3 ก็เพียงพอ"
          ]
        },
        {
          heading: "DRAG S3 กับ DRAG 6 ต่างกันยังไง",
          paragraphs: [
            "[DRAG 6](/products/drag-6) มีแบตในตัว 4400mAh ตั้งได้ถึง 220 วัตต์ ใช้ชิป GENE.TT 3.0 และตัวเครื่องใหญ่กว่า",
            "ถังน้ำยา UFORCE-X Tank II ของ DRAG 6 ก็ใช้คอยล์ PnP X ได้เหมือนกัน ถ้าเน้นวัตต์สูงเป็นหลัก DRAG 6 จะเหมาะกว่า ส่วนถ้าอยากได้เครื่องที่เล็กกว่า DRAG S3 จะตรงกว่า",
            "ทั้งสามรุ่นในตระกูล DRAG เทียบกันทีละเรื่องไว้ที่ [DRAG 6 กับ DRAG S3 ต่างกันยังไง](/guides/comparing-voopoo-drag-models)"
          ]
        },
        {
          heading: "ในกล่องมีอะไรบ้าง",
          paragraphs: [
            "ในกล่องมีตัวเครื่อง DRAG S3 หัวพอตแบบ DTL และคอยล์ PnP X มาให้สองตัว คือ 0.6 โอห์มกับ 0.8 โอห์ม พร้อมสายชาร์จและคู่มือการใช้งาน"
          ]
        }
      ]
    },
    en: {
      lede: "The DRAG S3 is the DRAG VOOPOO made to be simple and easy to carry every day. Below, one thing at a time.",
      sections: [
        {
          heading: "DRAG S3 or DRAG X3?",
          paragraphs: [
            "Both take the same PnP X cartridges and coils. Where they differ is the battery, the wattage and the screen.",
            "The [DRAG X3](/products/drag-x3) has no built-in battery: it runs on a removable 18650 or 21700 cell, goes up to 80W and has a 1.66-inch touchscreen.",
            "VOOPOO pitches the X3 at DTL vapers who like to tune their device. If you don't need that much wattage, the S3 is enough."
          ]
        },
        {
          heading: "DRAG S3 or DRAG 6?",
          paragraphs: [
            "The [DRAG 6](/products/drag-6) has a 4400mAh built-in battery, goes up to 220W and runs on the GENE.TT 3.0 chip, in a larger body than the S3.",
            "Its UFORCE-X Tank II takes PnP X coils too. If you want high wattage and size doesn't matter, the DRAG 6 fits better; if you want something smaller, the S3 does."
          ]
        },
        {
          heading: "What's in the box?",
          paragraphs: [
            "The DRAG S3, a PnP X Cartridge DTL and two PnP X coils, 0.6Ω and 0.8Ω, plus a charging cable and the user manual."
          ]
        }
      ]
    },
    zh: {
      lede: "DRAG S3 是 VOOPOO 为了简单好用、每天随身而做的 DRAG。下面逐项来看。",
      sections: [
        {
          heading: "DRAG S3 还是 DRAG X3？",
          paragraphs: [
            "两款用的是同一套 PnP X 烟弹和线圈，不同在电池、功率和屏幕。",
            "[DRAG X3](/products/drag-x3) 没有内置电池，使用可拆换的 18650 或 21700 电池，功率最高 80W，配 1.66 英寸触摸屏。",
            "VOOPOO 把 X3 定位给喜欢自己调校的 DTL 用户；如果用不到那么高的功率，S3 就够了。"
          ]
        },
        {
          heading: "DRAG S3 还是 DRAG 6？",
          paragraphs: [
            "[DRAG 6](/products/drag-6) 内置 4400mAh 电池，功率最高 220W，搭载 GENE.TT 3.0 芯片，机身也比 S3 更大。",
            "它的 UFORCE-X Tank II 同样兼容 PnP X 线圈。想要高功率、不在意体积，选 DRAG 6；想要更小巧的，选 S3。"
          ]
        },
        {
          heading: "包装内有什么？",
          paragraphs: [
            "DRAG S3 主机、一个 PnP X Cartridge DTL 烟弹，以及两颗 PnP X 线圈：0.6Ω 和 0.8Ω；另有充电线和使用说明书。"
          ]
        }
      ]
    },
  },
  "drag-x3": {
    th: {
      lede: "DRAG X3 เป็น DRAG รุ่นที่ VOOPOO ทำมาให้คนที่ชอบเลือกและปรับแต่งเครื่องเอง ตั้งแต่ถ่านที่ใส่ไปจนถึงวิธีปลดล็อก ด้านล่างไล่ให้ดูทีละเรื่อง",
      sections: [
        {
          heading: "ใส่ถ่าน 18650 หรือ 21700 ดี",
          paragraphs: [
            "VOOPOO บอกว่าถ่าน 21700 ให้วัตต์สูงสุดได้มากกว่าและใช้ได้นานกว่า ส่วนถ่าน 18650 ทำให้เครื่องเบาลงและพกใส่กระเป๋าได้ง่ายกว่า",
            "จึงขึ้นอยู่กับว่าให้ความสำคัญกับเวลาใช้งานหรือน้ำหนักมากกว่ากัน"
          ]
        },
        {
          heading: "DRAG X3 กับ DRAG S3 เลือกตัวไหนดี",
          paragraphs: [
            "ทั้งสองรุ่นใช้หัวพอตและคอยล์ PnP X ชุดเดียวกัน และใช้ชิป GENE.TT 2.0 เหมือนกัน",
            "[DRAG S3](/products/drag-s3) มีแบต 3000mAh อยู่ในตัว ตั้งได้ถึง 60 วัตต์ และใช้จอ TFT 0.96 นิ้ว ตัวเครื่องเล็กกว่า DRAG X3 เล็กน้อย",
            "ถ้าอยากได้เครื่องที่เสียบสายชาร์จได้เลยโดยไม่ต้องดูแลเรื่องถ่าน DRAG S3 จะเหมาะกว่า ถ้าชอบเลือกถ่านเอง และอยากได้วัตต์ที่สูงกว่ากับจอที่ใหญ่กว่า DRAG X3 จะตรงกว่า",
            "ทั้งสามรุ่นในตระกูล DRAG เทียบกันทีละเรื่องไว้ที่ [DRAG 6 กับ DRAG S3 ต่างกันยังไง](/guides/comparing-voopoo-drag-models)"
          ]
        },
        {
          heading: "ในกล่องมีอะไรบ้าง",
          paragraphs: [
            "ในกล่องมีตัวเครื่อง DRAG X3 หัวพอตแบบ DTL คอยล์ PnP X สองตัว ปากดูดหนึ่งอัน การ์ด PnP X สายชาร์จ และคู่มือการใช้งาน"
          ]
        }
      ]
    },
    en: {
      lede: "The DRAG X3 is the DRAG VOOPOO made for people who like to choose and set things up themselves — from the cell inside to the way it unlocks. Below, one thing at a time.",
      sections: [
        {
          heading: "18650 or 21700?",
          paragraphs: [
            "VOOPOO says a 21700 gives a higher maximum power and a longer runtime, while an 18650 makes the device lighter and easier to pocket.",
            "So it comes down to whether runtime or weight matters more to you."
          ]
        },
        {
          heading: "DRAG X3 or DRAG S3?",
          paragraphs: [
            "Both take the same PnP X cartridges and coils, and both run on the GENE.TT 2.0 chip.",
            "The [DRAG S3](/products/drag-s3) has a 3000mAh battery built in, goes up to 60W and has a 0.96-inch TFT screen, in a slightly smaller body.",
            "If you want to charge by plugging in a cable and never think about cells, the S3 suits you better. If you like choosing your own cell and want more wattage and a bigger screen, go with the X3."
          ]
        },
        {
          heading: "What's in the box?",
          paragraphs: [
            "The DRAG X3, a PnP X Cartridge DTL, two PnP X coils, a drip tip, a PnP X Platform Card, a charging cable and the user manual."
          ]
        }
      ]
    },
    zh: {
      lede: "DRAG X3 是 VOOPOO 为喜欢自己挑选、自己调校的人做的 DRAG——从装哪颗电池，到用哪种方式解锁。下面逐项来看。",
      sections: [
        {
          heading: "18650 还是 21700？",
          paragraphs: [
            "VOOPOO 表示，21700 能提供更高的最大功率和更长的续航；18650 则让机身更轻、更方便放进口袋。",
            "所以就看你更看重续航，还是更看重重量。"
          ]
        },
        {
          heading: "DRAG X3 还是 DRAG S3？",
          paragraphs: [
            "两款用的是同一套 PnP X 烟弹和线圈，芯片也都是 GENE.TT 2.0。",
            "[DRAG S3](/products/drag-s3) 内置 3000mAh 电池，功率最高 60W，配 0.96 英寸 TFT 屏，机身略小一些。",
            "想插线就能充、不用操心电池，选 S3 更合适；喜欢自己挑电池，又想要更高功率和更大屏幕，选 X3。"
          ]
        },
        {
          heading: "包装内有什么？",
          paragraphs: [
            "DRAG X3 主机、一个 PnP X Cartridge DTL 烟弹、两颗 PnP X 线圈、一个烟嘴、PnP X Platform Card、充电线和使用说明书。"
          ]
        }
      ]
    },
  },
  // Site-wide template round batch 2e (04/10): from VOOPOO's ARGUS G4 mini / G3 mini pages and posters; Thai = thai-copy 04/10.
  "argus-g4-mini": {
    th: {
      lede: "ARGUS G4 mini เป็นรุ่นที่ VOOPOO ออกแบบให้หัวพอตหัวเดียวใช้ได้สองค่าโอห์ม ด้านล่างไล่ให้ดูทีละเรื่อง",
      sections: [
        {
          heading: "ARGUS G4 mini กับ ARGUS G4 เลือกตัวไหนดี",
          paragraphs: [
            "[ARGUS G4](/products/argus-g4) มีจอ 0.85 นิ้วที่แสดงแบต วัตต์ โอห์ม สถานะล็อก และจำนวนพัฟ ตั้งวัตต์ได้สูงกว่า และชาร์จผ่าน USB-C 5V/2A ส่วนตัวเครื่องทำจากซิงค์อัลลอย หนัง และอะลูมิเนียมอัลลอย",
            "ถ้าดูสถานะจากไฟก็เพียงพอแล้ว G4 mini จะเหมาะกว่า"
          ]
        },
        {
          heading: "ใช้หัวพอตอะไรได้บ้าง และหาซื้อได้ที่ไหน",
          paragraphs: [
            "VOOPOO ระบุว่าใช้ได้ทั้ง Multi-Ohm Cartridge กับ Snap Cartridge และ Top Fill Cartridge V2 ทั้งขนาด 2mL และ 3mL รวมถึงหัวพอต ARGUS รุ่นอื่น ๆ ซึ่งนับรุ่น CRC ไว้ด้วย",
            "ร้านเรามี [หัวพอต VOOPOO Argus Pod](/products/coil-21) ให้เลือกหลายค่าโอห์ม และใช้กับ ARGUS G4 mini ได้ตามที่ VOOPOO ระบุไว้ข้างต้น"
          ]
        },
        {
          heading: "ในกล่องมีอะไรบ้าง",
          paragraphs: [
            "ในกล่องมีตัวเครื่อง ARGUS G4 mini หัวพอต ARGUS Multi-Ohm Cartridge สองหัว สายชาร์จ USB-C คู่มือการใช้งาน และการ์ดรายชื่อหัวพอตตระกูล ARGUS ที่ใช้ร่วมกันได้"
          ]
        }
      ]
    },
    en: {
      lede: "VOOPOO built the ARGUS G4 mini around one idea: a single cartridge with two resistances. Below, one part at a time.",
      sections: [
        {
          heading: "ARGUS G4 mini or ARGUS G4?",
          paragraphs: [
            "The [ARGUS G4](/products/argus-g4) adds a 0.85-inch screen that shows battery, wattage, resistance, lock state and puff count, a higher power ceiling and 5V/2A charging, in a body of zinc alloy, leather and aluminium alloy.",
            "If the light tells you enough, the G4 mini is the one."
          ]
        },
        {
          heading: "Which pods fit, and where do I get them?",
          paragraphs: [
            "VOOPOO lists the Multi-Ohm Cartridge, the Snap Cartridge, the Top Fill Cartridge V2 (2mL and 3mL) and other ARGUS cartridges, CRC versions included.",
            "We carry [VOOPOO Argus Pod cartridges](/products/coil-21) in several resistances, and VOOPOO's list above covers them for the G4 mini."
          ]
        },
        {
          heading: "What's in the box?",
          paragraphs: [
            "The ARGUS G4 mini, two Multi-Ohm Cartridges, a USB-C cable, the user manual and VOOPOO's ARGUS pod-family compatibility guide."
          ]
        }
      ]
    },
    zh: {
      lede: "VOOPOO 围绕一个想法打造了 ARGUS G4 mini：一颗烟弹，两种阻值。下面逐项来看。",
      sections: [
        {
          heading: "ARGUS G4 mini 还是 ARGUS G4？",
          paragraphs: [
            "[ARGUS G4](/products/argus-g4) 多了一块 0.85 英寸屏幕，显示电量、功率、阻值、锁定状态和口数，功率上限更高，支持 5V/2A 充电，机身用锌合金、皮革和铝合金。",
            "如果看指示灯就够了，就选 G4 mini。"
          ]
        },
        {
          heading: "能用哪些烟弹，去哪里买？",
          paragraphs: [
            "VOOPOO 列出的有 Multi-Ohm Cartridge、Snap Cartridge、Top Fill Cartridge V2（2mL 和 3mL），以及其他 ARGUS 烟弹，包括 CRC 版本。",
            "本店有售 [VOOPOO Argus Pod 烟弹](/products/coil-21)，有多种阻值可选；按上面 VOOPOO 的说明，可用于 ARGUS G4 mini。"
          ]
        },
        {
          heading: "包装里有什么？",
          paragraphs: [
            "ARGUS G4 mini 主机、两颗 Multi-Ohm Cartridge、USB-C 数据线、使用说明书，以及 VOOPOO 的 ARGUS 烟弹家族兼容指南。"
          ]
        }
      ]
    },
  },
  "argus-g3-mini": {
    th: {
      lede: "ARGUS G3 mini เป็นรุ่นที่ VOOPOO ทำมาให้ใช้ง่าย และตัวเล็กจนกำไว้ในมือได้มิด ด้านล่างไล่ให้ดูทีละเรื่อง",
      sections: [
        {
          heading: "ARGUS G3 mini กับ ARGUS G4 mini เลือกตัวไหนดี",
          paragraphs: [
            "[ARGUS G4 mini](/products/argus-g4-mini) มีแบตใหญ่กว่าที่ 1650mAh ใช้หัวพอตที่กลับด้านเพื่อเปลี่ยนโอห์มได้ และมีปุ่มเลื่อนปรับลม",
            "ถ้าเน้นเครื่องที่เบากว่า ใช้ง่ายกว่า และพอใจกับช่องลมแบบคงที่ G3 mini ก็เพียงพอแล้ว"
          ]
        },
        {
          heading: "ใช้หัวพอตอะไรได้บ้าง และหาซื้อได้ที่ไหน",
          paragraphs: [
            "VOOPOO ระบุว่าหัวพอต ARGUS Top Fill Cartridge V2 ใช้ได้กับเครื่องในตระกูล ARGUS ทั้งหมด และแนะนำให้เช็คค่าโอห์มกับวัตต์ของแต่ละเครื่องก่อนใช้",
            "หน้า [หัวพอต VOOPOO Argus Pod](/products/coil-21) มีหัวพอตให้เลือกสองแบบ แบบ Top Fill เติมด้านบน 0.4, 0.7 และ 1.0 โอห์ม คือแบบที่ VOOPOO ระบุว่าใช้กับ G3 mini ได้ ส่วนแบบเติมด้านข้าง 0.7 และ 1.2 โอห์มเป็นหัวอีกรุ่นซึ่ง VOOPOO ไม่ได้ระบุไว้สำหรับรุ่นนี้"
          ]
        },
        {
          heading: "ในกล่องมีอะไรบ้าง",
          paragraphs: [
            "ในกล่องมีตัวเครื่อง ARGUS G3 mini หัวพอต ARGUS Top Fill Cartridge V2 หนึ่งหัว สายชาร์จ USB-C คู่มือการใช้งาน และการ์ดรายชื่อหัวพอตตระกูล ARGUS ที่ใช้ร่วมกันได้"
          ]
        }
      ]
    },
    en: {
      lede: "The ARGUS G3 mini is the small one: simple to use, and small enough to fit in the palm of your hand. Below, one thing at a time.",
      sections: [
        {
          heading: "ARGUS G3 mini or ARGUS G4 mini?",
          paragraphs: [
            "The [ARGUS G4 mini](/products/argus-g4-mini) has a bigger 1650mAh battery, a cartridge you flip to change resistance and an airflow slider.",
            "If you want a lighter, simpler device and are happy with fixed airflow, the G3 mini is enough."
          ]
        },
        {
          heading: "Which pods fit, and where do I get them?",
          paragraphs: [
            "The ARGUS Top Fill Cartridge V2 fits the whole ARGUS pod family; VOOPOO asks you to check the resistance and output against the device.",
            "Our [VOOPOO Argus Pod cartridges](/products/coil-21) page lists the ARGUS Top Fill cartridge at 0.4, 0.7 and 1.0Ω, which VOOPOO names for the G3 mini; the side-fill pod on the same page (0.7 and 1.2Ω) is a different cartridge that VOOPOO does not list for the G3 mini."
          ]
        },
        {
          heading: "What's in the box?",
          paragraphs: [
            "The ARGUS G3 mini, one ARGUS Top Fill Cartridge V2, a USB-C cable, the user manual and VOOPOO's ARGUS pod-family compatibility guide."
          ]
        }
      ]
    },
    zh: {
      lede: "ARGUS G3 mini 是小巧的那一款：用起来简单，握在掌心刚刚好。下面逐项来看。",
      sections: [
        {
          heading: "ARGUS G3 mini 还是 ARGUS G4 mini？",
          paragraphs: [
            "[ARGUS G4 mini](/products/argus-g4-mini) 电池更大（1650mAh），烟弹翻转即可切换阻值，还有进气滑块。",
            "如果你想要更轻、更简单的机器，固定进气也合你意，G3 mini 就够了。"
          ]
        },
        {
          heading: "能用哪些烟弹，去哪里买？",
          paragraphs: [
            "ARGUS Top Fill Cartridge V2 兼容整个 ARGUS 烟弹家族；VOOPOO 提醒按阻值和功率确认是否适配。",
            "本店的 [VOOPOO Argus Pod 烟弹](/products/coil-21) 页面有 0.4、0.7 和 1.0 欧姆的 ARGUS Top Fill 烟弹，VOOPOO 标明可用于 G3 mini；同页的侧注式烟弹（0.7 和 1.2 欧姆）是另一款，VOOPOO 没有列明适用于 G3 mini。"
          ]
        },
        {
          heading: "包装里有什么？",
          paragraphs: [
            "ARGUS G3 mini 主机、一颗 ARGUS Top Fill Cartridge V2、USB-C 数据线、使用说明书，以及 VOOPOO 的 ARGUS 烟弹家族兼容指南。"
          ]
        }
      ]
    },
  },
  // Site-wide template round batch 2f (05/10): from VOOPOO's ARGUS P3 / VMATE i3 pages and posters; Thai = thai-copy 05/10.
  "argus-p3": {
    th: {
      lede: "ARGUS P3 เป็นรุ่นที่ VOOPOO ใส่ความสามารถไว้หลายอย่างในตัวเครื่องเดียว ด้านล่างไล่ให้ดูทีละเรื่อง",
      sections: [
        {
          heading: "ARGUS P3 กับ ARGUS G4 mini เลือกตัวไหนดี",
          paragraphs: [
            "[ARGUS G4 mini](/products/argus-g4-mini) ไม่มีจอ ใช้วิธีกลับด้านหัวพอตเพื่อเปลี่ยนโอห์ม และเบากว่าที่ 56 กรัม",
            "ถ้าอยากมีจอไว้ดูข้อมูลการสูบของตัวเอง P3 จะเหมาะกว่า โดยตัวเครื่องหนัก 82 กรัม"
          ]
        },
        {
          heading: "ใช้หัวพอตอะไรได้บ้าง และหาซื้อได้ที่ไหน",
          paragraphs: [
            "VOOPOO ระบุว่าใช้ได้ทั้ง Snap Cartridge และ Top Fill Cartridge V2 รวมถึง Top Fill Cartridge และหัวพอตรุ่น CRC",
            "ร้านเรามี [หัวพอต VOOPOO Argus Pod](/products/coil-21) ให้เลือกหลายค่าโอห์ม ก่อนสั่ง แนะนำให้เทียบค่าโอห์มกับวัตต์ของ P3 ตามที่ VOOPOO ระบุไว้อีกครั้ง"
          ]
        },
        {
          heading: "ในกล่องมีอะไรบ้าง",
          paragraphs: [
            "ในกล่องมีตัวเครื่อง ARGUS P3 หัวพอต ARGUS Snap Cartridge สองหัว คือ 0.4 โอห์มและ 0.7 โอห์ม สายชาร์จ USB-C คู่มือการใช้งาน คู่มือเริ่มใช้งานฉบับย่อ และการ์ดรายชื่อหัวพอตตระกูล ARGUS ที่ใช้ร่วมกันได้"
          ]
        }
      ]
    },
    en: {
      lede: "The ARGUS P3 is VOOPOO's do-a-lot device in one small body. Below, one part at a time.",
      sections: [
        {
          heading: "ARGUS P3 or ARGUS G4 mini?",
          paragraphs: [
            "The [ARGUS G4 mini](/products/argus-g4-mini) has no screen at all: you flip its cartridge to change resistance, and it is lighter at 56g.",
            "If you want a screen that shows your vaping data, the P3 is the one; it weighs 82g."
          ]
        },
        {
          heading: "Which pods fit, and where do I get them?",
          paragraphs: [
            "VOOPOO lists the Snap Cartridge, the Top Fill Cartridge V2, the Top Fill Cartridge and their CRC versions.",
            "We carry [VOOPOO Argus Pod cartridges](/products/coil-21) in several resistances. Before you order, check the resistance and output against the P3, as VOOPOO advises."
          ]
        },
        {
          heading: "What's in the box?",
          paragraphs: [
            "The ARGUS P3, two ARGUS Snap Cartridges (0.4Ω and 0.7Ω), a USB-C cable, the user manual, a quick start guide and VOOPOO's ARGUS pod-family compatibility guide."
          ]
        }
      ]
    },
    zh: {
      lede: "ARGUS P3 是 VOOPOO 一款功能很多的机型。下面逐项来看。",
      sections: [
        {
          heading: "ARGUS P3 还是 ARGUS G4 mini？",
          paragraphs: [
            "[ARGUS G4 mini](/products/argus-g4-mini) 完全没有屏幕：翻转烟弹即可切换阻值，重量也更轻，只有 56g。",
            "如果想要一块能看抽吸数据的屏幕，就选 P3；它重 82g。"
          ]
        },
        {
          heading: "能用哪些烟弹？去哪里买？",
          paragraphs: [
            "VOOPOO 列出的有 Snap 烟弹、Top Fill Cartridge V2、Top Fill Cartridge 以及它们的 CRC 版本。",
            "本店有售 [VOOPOO Argus Pod 烟弹](/products/coil-21)，有多种阻值可选。下单前请按 VOOPOO 的提示，对照 P3 核对阻值和功率。"
          ]
        },
        {
          heading: "包装里有什么？",
          paragraphs: [
            "ARGUS P3 主机、两颗 ARGUS Snap 烟弹（0.4Ω 和 0.7Ω）、一条 USB-C 数据线、使用说明书、快速入门指南，以及 VOOPOO 的 ARGUS 烟弹兼容指南。"
          ]
        }
      ]
    },
  },
  "vmate-i3": {
    th: {
      lede: "VMATE i3 เป็นรุ่นที่ VOOPOO ทำมาให้หยิบใช้ได้ง่ายในทุกวัน ด้านล่างไล่ให้ดูทีละเรื่อง",
      sections: [
        {
          heading: "VMATE i3 กับ ARGUS G3 mini เลือกตัวไหนดี",
          paragraphs: [
            "ทั้งสองรุ่นไม่มีปุ่ม สูบได้เลยเหมือนกัน ส่วน [ARGUS G3 mini](/products/argus-g3-mini) ตัวเล็กกว่า เบากว่าที่ 40.85 กรัม ใช้แบต 1350mAh และช่องลมเป็นแบบคงที่",
            "ถ้าอยากปรับช่องลมได้เอง VMATE i3 จะเหมาะกว่า โดยเครื่องนี้ใช้หัวพอตตระกูล VMATE แทนหัวพอต ARGUS"
          ]
        },
        {
          heading: "หาซื้อหัวพอต VMATE ได้ที่ไหน",
          paragraphs: [
            "ร้านเรามี [หัวพอต VOOPOO VMATE](/products/coil-72) ขายอยู่ ก่อนสั่ง แนะนำให้เทียบค่าโอห์มกับตารางด้านบนอีกครั้ง"
          ]
        },
        {
          heading: "ในกล่องมีอะไรบ้าง",
          paragraphs: [
            "ในกล่องมีตัวเครื่อง VMATE i3 หัวพอต VMATE Top Fill Cartridge 0.7 โอห์ม หนึ่งหัว สายชาร์จ USB-C คู่มือการใช้งาน และการ์ดรายชื่อหัวพอตตระกูล VMATE ที่ใช้ร่วมกันได้"
          ]
        }
      ]
    },
    en: {
      lede: "The VMATE i3 is VOOPOO's easy, everyday pod kit. Below, one part at a time.",
      sections: [
        {
          heading: "VMATE i3 or ARGUS G3 mini?",
          paragraphs: [
            "Both fire when you draw. The [ARGUS G3 mini](/products/argus-g3-mini) is smaller and lighter at 40.85g, with a 1350mAh battery and fixed airflow.",
            "The VMATE i3 is the one to pick if you want to open or close the airflow yourself, and it takes VMATE pods instead of ARGUS ones."
          ]
        },
        {
          heading: "Where do I get VMATE pods?",
          paragraphs: [
            "We carry [VOOPOO VMATE pods](/products/coil-72). Check the resistance against the table above before you order."
          ]
        },
        {
          heading: "What's in the box?",
          paragraphs: [
            "The VMATE i3, one VMATE Top Fill Cartridge 0.7Ω, a USB-C cable, the user manual and VOOPOO's VMATE pod-family compatibility guide."
          ]
        }
      ]
    },
    zh: {
      lede: "VMATE i3 是 VOOPOO 一款日常用起来很省心的主机。下面逐项来看。",
      sections: [
        {
          heading: "VMATE i3 还是 ARGUS G3 mini？",
          paragraphs: [
            "两款都是吸气启动。[ARGUS G3 mini](/products/argus-g3-mini) 更小更轻，40.85g，电池 1350mAh，进气量固定。",
            "如果你想自己调节进气大小，就选 VMATE i3；它用的是 VMATE 烟弹，而不是 ARGUS 烟弹。"
          ]
        },
        {
          heading: "去哪里买 VMATE 烟弹？",
          paragraphs: [
            "本店有售 [VOOPOO VMATE 烟弹](/products/coil-72)。下单前请对照上面的表格核对阻值。"
          ]
        },
        {
          heading: "包装里有什么？",
          paragraphs: [
            "VMATE i3 主机、一颗 VMATE Top Fill Cartridge 0.7Ω、一条 USB-C 数据线、使用说明书，以及 VOOPOO 的 VMATE 烟弹兼容指南。"
          ]
        }
      ]
    },
  },
  // Articles queue 0211 batch 5 (02/11): VOOPOO Vmate Pro 2 — facts = VOOPOO's Vmate Pro 2 and VMATE Top Fill pages (shop.voopoo.com,
  // in-app browser 02/11 via the details chat: the 0.4Ω pod added "to satisfy both RDL and MTL", the 0.4Ω "requires at least 30 W",
  // Top Fill 0.4/0.7/1.0Ω) + VOOPOO text found by search only (ECO adapts the wattage, side 0.54" OLED, auto-draw, stepless airflow,
  // 0.4Ω RDL 18–30W, 40-minute full charge). 0.7Ω's wattage left out: VOOPOO's pages disagree (15–25W vs 5–25W). Battery, wattage,
  // the in-box list and the 7 colours stay with the tagline, spec rows and option list. Thai = thai-copy 02/11.
  "vmate-pro-2": {
    th: {
      lede: "ด้านล่างเล่าตามข้อมูลของ VOOPOO ว่าหัวพอตสองค่าที่ให้มาใช้ต่างกันยังไง โหมด ECO ช่วยอะไร จอบอกอะไรบ้าง ปรับลมได้แบบไหน และชาร์จนานแค่ไหน",
      sections: [
        {
          heading: "หัวพอตสองค่าที่ให้มาใช้ต่างกันยังไง",
          paragraphs: [
            "VOOPOO บอกว่าเพิ่มหัวพอต 0.4 โอห์มเข้ามาคู่กับหัว 0.7 โอห์ม เพื่อให้เครื่องเดียวสูบได้ทั้งสองแบบ หัว 0.4 โอห์มใช้สูบแบบ RDL ที่ 18–30 วัตต์ ส่วนหัว 0.7 โอห์มใช้สูบแบบ MTL",
            "VOOPOO เตือนไว้ว่าหัว Top Fill 0.4 โอห์มต้องใช้กับเครื่องที่จ่ายไฟได้อย่างน้อย 30 วัตต์ ถ้าจะนำหัวนี้ไปใช้กับเครื่องอื่น ควรเช็คก่อนว่าเครื่องนั้นจ่ายวัตต์ได้สูงสุดเท่าไร",
            "VOOPOO ยังทำหัว Top Fill แบบ 1.0 โอห์มด้วย ส่วนหัวพอตสำรองของรุ่นนี้ดูได้ที่หน้า [หัวพอต VMATE](/products/coil-72) และถ้าอยากรู้ว่าการสูบสองแบบนี้รู้สึกต่างกันแค่ไหน อ่านต่อได้ที่ [MTL กับ DTL สูบต่างกันยังไง แล้ว RDL คืออะไร](/guides/understanding-mtl-vs-dtl)",
          ],
        },
        {
          heading: "โหมด ECO ช่วยอะไร",
          paragraphs: [
            "VOOPOO บอกว่าโหมด ECO จะปรับวัตต์ให้เข้ากับวิธีสูบของแต่ละคน และกดปุ่มครั้งเดียวก็สลับไปโหมด POWER ได้",
          ],
        },
        {
          heading: "จอบอกอะไรบ้าง และปรับลมได้แบบไหน",
          paragraphs: [
            "ด้านข้างเครื่องมีจอ OLED ขนาด 0.54 นิ้ว ไว้บอกแบตที่เหลือ วัตต์ที่ใช้ และค่าโอห์มของหัวพอตที่ใส่อยู่",
            "เครื่องนี้สูบได้เลยโดยไม่ต้องกดปุ่ม และปรับช่องลมได้ละเอียดแบบไม่มีขั้น ตั้งแต่ลมแน่นไปจนถึงลมโล่ง",
          ],
        },
        {
          heading: "ชาร์จนานแค่ไหน",
          paragraphs: [
            "VOOPOO บอกว่าชาร์จจนเต็มใช้เวลาประมาณ 40 นาที ส่วนวิธีชาร์จและดูแลแบตให้ใช้ได้นาน อ่านต่อได้ที่ [ชาร์จข้ามคืนได้ไหม และวิธีดูแลแบต](/guides/battery-care-and-charging)",
          ],
        },
      ],
      faq: [
        { question: "Vmate Pro 2 ใช้หัวพอตรุ่นไหน", answer: "ใช้หัวพอต VMATE Top Fill จุ 3mL ค่ะ ในกล่องมีหัว 0.4 โอห์มกับ 0.7 โอห์มมาให้ และหัวสำรองดูได้ที่หน้า [หัวพอต VMATE](/products/coil-72) ค่ะ" },
        { question: "Vmate Pro 2 แบตเท่าไร ชาร์จแบบไหน", answer: "Vmate Pro 2 มีแบต 1500mAh ในตัวค่ะ ชาร์จผ่าน USB-C ที่ 5V/2A ค่ะ" },
        { question: "Vmate Pro 2 ปรับวัตต์ได้เท่าไร", answer: "ปรับได้ 5–30 วัตต์ค่ะ และมีโหมด ECO กับ POWER ที่กดปุ่มเดียวก็สลับกันได้ค่ะ" },
        { question: "Vmate Pro 2 มีสีอะไรบ้าง", answer: "Vmate Pro 2 มี 7 สี คือ Gilt Black · Space Grey · Navy Blue · Neon · Glacier Silver · Fresh Green และ Lavender ค่ะ" },
        { question: "Vmate Pro 2 ในกล่องมีอะไรบ้าง", answer: "ในกล่องมีตัวเครื่อง หัวพอต Top Fill 0.4 โอห์มกับ 0.7 โอห์ม สาย USB-C สายคล้องคอ คู่มือ และใบแนะนำหัวพอตที่ใช้ร่วมกันได้ค่ะ" },
      ],
    },
    en: {
      lede: "Below, based on VOOPOO's own information: how the two included pods differ, what ECO mode does, what the screen shows and how the airflow adjusts, and how long a charge takes.",
      sections: [
        {
          heading: "How do the two included pods differ?",
          paragraphs: [
            "VOOPOO says it added a 0.4Ω pod alongside the 0.7Ω so one device covers both styles: the 0.4Ω is for RDL at 18–30W, the 0.7Ω for MTL.",
            "VOOPOO notes that the Top Fill 0.4Ω pod needs a device that can put out at least 30W, so check a device's maximum output before moving the pod to it.",
            "VOOPOO also makes the Top Fill in 1.0Ω. Spare pods for this kit are on the [VMATE pods](/products/coil-72) page, and how the two draw styles feel different is covered in [MTL vs. DTL](/guides/understanding-mtl-vs-dtl).",
          ],
        },
        {
          heading: "What does ECO mode do?",
          paragraphs: [
            "VOOPOO says ECO mode adjusts the wattage to the way you vape, and a single press of the button switches to POWER mode.",
          ],
        },
        {
          heading: "What does the screen show, and how does the airflow adjust?",
          paragraphs: [
            "A 0.54-inch OLED on the side shows the battery left, the wattage in use and the resistance of the fitted pod. It fires as you draw, without pressing a button, and the airflow adjusts steplessly from tight to open.",
          ],
        },
        {
          heading: "How long does a charge take?",
          paragraphs: [
            "VOOPOO says a full charge takes about 40 minutes. For keeping the battery healthy, see [battery care and charging](/guides/battery-care-and-charging).",
          ],
        },
      ],
      faq: [
        { question: "Which pods does the Vmate Pro 2 use?", answer: "VMATE Top Fill pods, which hold 3mL. A 0.4Ω and a 0.7Ω pod come in the box, and spares are on the [VMATE pods](/products/coil-72) page." },
        { question: "How big is the Vmate Pro 2's battery, and how does it charge?", answer: "It has a 1500mAh built-in battery and charges over USB-C at 5V/2A." },
        { question: "What wattage does the Vmate Pro 2 run at?", answer: "5–30W, with ECO and POWER modes you switch between with a single button press." },
        { question: "What colours does the Vmate Pro 2 come in?", answer: "Seven: Gilt Black, Space Grey, Navy Blue, Neon, Glacier Silver, Fresh Green and Lavender." },
        { question: "What's in the Vmate Pro 2 box?", answer: "The device, Top Fill pods in 0.4Ω and 0.7Ω, a USB-C cable, a lanyard, the manual and a card listing compatible pods." },
      ],
    },
    zh: {
      lede: "下面根据 VOOPOO 的资料，介绍随附两颗烟弹的区别、ECO 模式的作用、屏幕显示什么与气流如何调节，以及充电需要多久。",
      sections: [
        {
          heading: "随附的两颗烟弹有什么区别？",
          paragraphs: [
            "VOOPOO 表示，在 0.7Ω 之外加入 0.4Ω 烟弹，让一台设备兼顾两种抽法：0.4Ω 用于 RDL，功率 18–30W；0.7Ω 用于 MTL。",
            "VOOPOO 提醒，Top Fill 0.4Ω 烟弹需要输出至少 30W 的设备，换到其他设备使用前，请先确认该设备的最大输出功率。",
            "VOOPOO 的 Top Fill 烟弹还有 1.0Ω 版本。本套装的备用烟弹见[VMATE 烟弹](/products/coil-72)页面；两种抽法的感受有何不同，见[MTL 与 DTL 的区别](/guides/understanding-mtl-vs-dtl)。",
          ],
        },
        {
          heading: "ECO 模式有什么用？",
          paragraphs: [
            "VOOPOO 表示，ECO 模式会根据个人的抽吸习惯调整功率；按一下按键即可切换到 POWER 模式。",
          ],
        },
        {
          heading: "屏幕显示什么？气流怎么调？",
          paragraphs: [
            "机身侧面有一块 0.54 英寸 OLED 屏，显示剩余电量、当前功率和所装烟弹的阻值。吸即可用，无需按键启动；气流支持无级调节，可从紧调到松。",
          ],
        },
        {
          heading: "充电需要多久？",
          paragraphs: [
            "VOOPOO 表示，充满电约需 40 分钟。电池保养方法见[电池保养与充电](/guides/battery-care-and-charging)。",
          ],
        },
      ],
      faq: [
        { question: "Vmate Pro 2 用什么烟弹？", answer: "使用容量 3mL 的 VMATE Top Fill 烟弹。盒内附 0.4Ω 和 0.7Ω 两颗，备用烟弹请看 [VMATE 烟弹](/products/coil-72) 页面。" },
        { question: "Vmate Pro 2 电池多大？怎么充电？", answer: "内置 1500mAh 电池，通过 USB-C 以 5V/2A 充电。" },
        { question: "Vmate Pro 2 功率能调多少？", answer: "功率 5–30W，另有 ECO 和 POWER 两种模式，按一下按键即可切换。" },
        { question: "Vmate Pro 2 有哪些颜色？", answer: "共 7 种颜色：Gilt Black、Space Grey、Navy Blue、Neon、Glacier Silver、Fresh Green 和 Lavender。" },
        { question: "Vmate Pro 2 盒内有什么？", answer: "主机、0.4Ω 和 0.7Ω 的 Top Fill 烟弹各一颗、USB-C 线、挂绳、说明书，以及一张烟弹兼容指南。" },
      ],
    },
  },
  // Articles queue 0211 batch 5 (02/11): VOOPOO VMATE pods — facts = VOOPOO's VMATE Cartridge V2 and VMATE Top Fill pages (in-app
  // browser 02/11 via the details chat: V2 side slot + coil pre-installed, "For Vmate Infinity Edition / Vmate E / V.THRU Pro etc.";
  // Top Fill "Top Filling", 0.4/0.7/1.0Ω, the 0.4Ω "requires at least 30 W"; the Top Fill pair ships with the Vmate Pro 2) + VOOPOO
  // text found by search only (0.4Ω RDL 18–30W, 0.7Ω MTL). Left out: "magnetic" (search only) and 0.7Ω's wattage (VOOPOO's pages
  // disagree). Capacity and PCTG stay with the tagline + spec rows. Thai = thai-copy 02/11.
  "coil-72": {
    th: {
      lede: "หน้านี้มีหัวพอต VMATE ให้เลือกสองแบบ ด้านล่างสรุปตามข้อมูลของ VOOPOO ว่าทั้งสองแบบต่างกันตรงไหน ใช้กับเครื่องรุ่นไหน และค่าโอห์มไหนเหมาะกับการสูบแบบไหน",
      sections: [
        {
          heading: "หัว V2 กับหัว Top Fill ต่างกันตรงไหน",
          paragraphs: [
            "หัว Top Fill ใช้วิธีเติมด้านบน ส่วนหัว V2 เติมน้ำยาทางช่องด้านข้าง และมีคอยล์ติดมาในหัวแล้ว",
            "หัว Top Fill ทำจาก PCTG และหัวทั้งสองแบบจุน้ำยาได้ 3mL เท่ากัน",
          ],
        },
        {
          heading: "เลือกหัวพอตให้ตรงกับเครื่องที่ใช้",
          paragraphs: [
            "หัว V2 ใช้ได้กับ Vmate Infinity Edition, Vmate E, V.THRU Pro เป็นต้น ส่วนหัว Top Fill เป็นหัวที่ [Vmate Pro 2](/products/vmate-pro-2) ให้มาในกล่อง",
            "VOOPOO ระบุว่าหัว Top Fill 0.4 โอห์มต้องใช้กับเครื่องที่จ่ายไฟได้ตั้งแต่ 30 วัตต์ขึ้นไป ก่อนใช้หัวนี้ควรเช็ควัตต์สูงสุดของเครื่องที่ใช้อยู่",
            "ในกล่อง Vmate Pro 2 มีใบแนะนำหัวพอตตระกูล VMATE ที่ใช้ร่วมกันได้มาให้ด้วย ถ้ามีเครื่องนี้อยู่แล้ว ก็เปิดดูจากใบนี้ได้ว่าหัวรุ่นไหนใช้กับเครื่องไหนได้บ้าง",
          ],
        },
        {
          heading: "หัว Top Fill ค่าไหนเหมาะกับการสูบแบบไหน",
          paragraphs: [
            "ตามข้อมูลของ VOOPOO หัว Top Fill 0.4 โอห์มใช้สูบแบบ RDL ที่ 18–30 วัตต์ ส่วนหัว 0.7 โอห์มใช้สูบแบบ MTL นอกจากสองค่านี้ หัว Top Fill ยังมีแบบ 1.0 โอห์มด้วย",
            "ถ้ายังไม่แน่ใจว่าชอบสูบแบบไหน อ่านต่อได้ที่ [MTL กับ DTL สูบต่างกันยังไง แล้ว RDL คืออะไร](/guides/understanding-mtl-vs-dtl) ส่วนวิธีดูแลหัวพอตให้ใช้ได้นาน อ่านได้ที่ [หัวพอตใช้ได้กี่วัน เปลี่ยนเมื่อไหร่](/guides/coil-and-pod-maintenance)",
          ],
        },
      ],
    },
    en: {
      lede: "This page carries two kinds of VMATE pod. Below, based on VOOPOO's own information: how they differ, which devices each one fits, and which resistance suits which draw style.",
      sections: [
        {
          heading: "How do the V2 and Top Fill pods differ?",
          paragraphs: [
            "The VMATE Cartridge V2 fills through a side slot and comes with its coil pre-installed; the VMATE Top Fill fills from the top. Both hold 3 mL, and the Top Fill is made of PCTG.",
          ],
        },
        {
          heading: "Which one fits my device?",
          paragraphs: [
            "VOOPOO makes the V2 for devices such as the Vmate Infinity Edition, Vmate E and V.THRU Pro, while the Top Fill is the pod that comes with the [Vmate Pro 2](/products/vmate-pro-2). VOOPOO states that the Top Fill 0.4Ω needs a device that puts out at least 30W, so check your device's maximum output before fitting it. The Vmate Pro 2 box also includes VOOPOO's VMATE pod-family compatibility guide, which shows which pod fits which device.",
          ],
        },
        {
          heading: "Which Top Fill resistance suits which style?",
          paragraphs: [
            "VOOPOO rates the Top Fill 0.4Ω for RDL at 18–30W and the 0.7Ω for MTL; the Top Fill also comes in 1.0Ω. If you're not sure which style suits you, see [MTL vs. DTL](/guides/understanding-mtl-vs-dtl), and for making a pod last, [coil and pod maintenance](/guides/coil-and-pod-maintenance).",
          ],
        },
      ],
    },
    zh: {
      lede: "本页有两种 VMATE 烟弹可选。下面根据 VOOPOO 的资料，介绍两者的区别、各自适用的设备，以及哪个阻值适合哪种抽法。",
      sections: [
        {
          heading: "V2 和 Top Fill 有什么不同？",
          paragraphs: [
            "VMATE Cartridge V2 从侧面注油口注油，线圈已预装在烟弹内；VMATE Top Fill 则从顶部注油。两款都能装 3 mL 烟油，Top Fill 采用 PCTG 材质。",
          ],
        },
        {
          heading: "怎么选到适合自己设备的烟弹？",
          paragraphs: [
            "VOOPOO 的 V2 适用于 Vmate Infinity Edition、Vmate E、V.THRU Pro 等设备；Top Fill 是 [Vmate Pro 2](/products/vmate-pro-2) 随机附带的烟弹。VOOPOO 提示，Top Fill 0.4Ω 需要输出至少 30W 的设备，使用前请先确认自己设备的最大输出功率。Vmate Pro 2 盒内还附有 VOOPOO 的 VMATE 烟弹兼容指南，可以查看哪款烟弹适用于哪款设备。",
          ],
        },
        {
          heading: "Top Fill 哪个阻值适合哪种抽法？",
          paragraphs: [
            "VOOPOO 标注 Top Fill 0.4Ω 用于 RDL，功率 18–30W；0.7Ω 用于 MTL；Top Fill 另有 1.0Ω 版本。还不确定自己适合哪种抽法，可以看[MTL 与 DTL 的区别](/guides/understanding-mtl-vs-dtl)；延长烟弹寿命的方法见[雾化芯与烟弹保养基础](/guides/coil-and-pod-maintenance)。",
          ],
        },
      ],
    },
  },
  // Articles queue 0211 batch 5, VOOPOO (03/11): ARGUS Pod Cartridge listing — facts = VOOPOO's ARGUS POD SE page (side-fill
  // pod: watts, nicotine, leak-proof, full view, fit), ARGUS P1 page (fill), ARGUS G page (Top Fill watts, the 0.4Ω / 30W line,
  // whole-family fit, ~14 mL per pod) and voopoo.com/faq.html (5–6 refills); WebFetch 03/11, quotes in
  // articles-0311/voopoo-facts.md. VOOPOO's freebase / salt nic labels are not tied to a resistance on any page → unsaid.
  // "Argus mix" is not a VOOPOO name → unsaid. "Side fill + Top Fill" stays at tagline + lede (twice).
  "coil-21": {
    th: {
      lede: "หัวพอต VOOPOO ARGUS Pod ในหน้านี้มีให้เลือกสองแบบ คือแบบ Top Fill กับแบบเติมด้านข้าง เนื้อหาด้านล่างสรุปจากหน้าเว็บของ VOOPOO ว่าแต่ละค่าใช้วัตต์เท่าไร เติมน้ำยายังไง หัวหนึ่งใช้ได้นานแค่ไหน และจะเลือกให้ตรงกับเครื่องยังไง",
      sections: [
        {
          heading: "หัวแบบเติมด้านข้างใช้วัตต์เท่าไร",
          paragraphs: [
            "ARGUS POD Cartridge คือชื่อที่ VOOPOO เรียกหัวแบบเติมด้านข้าง โดยหัว 0.7 โอห์มใช้ที่ 14–18 วัตต์ ส่วนหัว 1.2 โอห์มใช้ที่ 9–12 วัตต์",
            "เรื่องน้ำยา หน้า ARGUS POD SE ของ VOOPOO แนะนำให้ใช้ความเข้มข้นนิโคตินไม่เกิน 50mg",
          ],
        },
        {
          heading: "เติมน้ำยายังไง แล้วดูน้ำยาที่เหลือได้ไหม",
          paragraphs: [
            "หัวแบบเติมด้านข้าง ให้ดึงหัวออกจากเครื่องก่อน แล้วเปิดจุกที่ตัวหัวเพื่อเติมน้ำยา",
            "VOOPOO บอกว่าหัวแบบนี้ใสทั้งหัว จึงดูน้ำยาที่เหลือได้ตลอดเวลาโดยไม่ต้องดึงหัวออกจากเครื่อง",
          ],
        },
        {
          heading: "หัว ARGUS POD กันรั่วยังไง",
          paragraphs: [
            "VOOPOO ออกแบบหัว ARGUS POD ให้มีชั้นกันรั่วหลายชั้น และบอกว่าโครงสร้างแบบสี่รูช่วยเก็บน้ำยาไว้ในหัวได้แน่น",
          ],
        },
        {
          heading: "หัวหนึ่งใช้ได้นานแค่ไหน",
          paragraphs: [
            "หน้า ARGUS G ของ VOOPOO บอกว่าหัวที่มีคอยล์ในตัวหนึ่งหัว ใช้กับน้ำยาได้ราว 14mL",
            "ส่วนหน้าคำถามที่พบบ่อยของ VOOPOO แนะนำให้เปลี่ยนคอยล์หลังเติมน้ำยาไปราว 5–6 ครั้ง",
          ],
        },
        {
          heading: "หัว Top Fill มีค่าไหนบ้าง",
          paragraphs: [
            "ตามหน้า ARGUS G ของ VOOPOO หัว Top Fill มีสามค่า คือ 0.4 โอห์มที่ 18–30 วัตต์ 0.7 โอห์มที่ 14–18 วัตต์ และ 1.0 โอห์มที่ 10–14 วัตต์",
            "VOOPOO ระบุว่าหัว Top Fill 0.4 โอห์มใช้ได้เฉพาะเครื่องในตระกูล ARGUS Pod ที่จ่ายไฟได้ 30 วัตต์ และบอกไว้ในหน้า ARGUS G ว่าค่านี้ไม่ใช่หัวของ ARGUS G",
            "ก่อนเลือกหัว 0.4 โอห์มจึงควรเช็ควัตต์สูงสุดของเครื่องที่ใช้อยู่",
          ],
        },
        {
          heading: "เลือกหัวพอต ARGUS ให้ตรงกับเครื่องยังไง",
          paragraphs: [
            "VOOPOO บอกว่าหัว ARGUS ใช้ได้กับเครื่องในตระกูล ARGUS Pod และระบุชื่อรุ่นของหัวแบบเติมด้านข้างไว้ว่าใช้กับ ARGUS G, ARGUS POD, ARGUS P1 และ ARGUS Z ได้",
            "ถ้าใช้ [ARGUS G3 mini](/products/argus-g3-mini) อยู่ หน้า ARGUS G3 mini ของ VOOPOO ระบุหัว Top Fill ไว้ ส่วนหัวแบบเติมด้านข้างไม่ได้อยู่ในรายการของหน้านั้น",
            "ส่วนใครอยากเปลี่ยนแค่คอยล์แล้วใช้หัวเดิมต่อ VOOPOO มีหัวพอตเปล่า ARGUS POD ที่ใส่คอยล์ ITO ได้ อยู่ที่หน้า [หัวเปล่า Argus P1](/products/coil-83)",
          ],
        },
      ],
      faq: [
        {
          question: "หัวพอต ARGUS ใช้กับ ARGUS G4 ได้ไหม",
          answer: "ได้ค่ะ หน้า ARGUS G4 ของ VOOPOO ระบุว่าเครื่องนี้ใช้ได้กับหัวพอตทุกแบบในตระกูล ARGUS รวมถึงหัว Top Fill",
        },
      ],
    },
    en: {
      lede: "The VOOPOO ARGUS Pod cartridges on this page come in two kinds: side-fill and Top Fill. Below, from VOOPOO's own pages: the wattage for each, how to fill, how long a pod lasts and how to match one to your device.",
      sections: [
        {
          heading: "What wattage do the side-fill pods need?",
          paragraphs: [
            "VOOPOO calls the side-fill pod the ARGUS POD Cartridge and rates the 0.7Ω at 14–18W and the 1.2Ω at 9–12W. VOOPOO's ARGUS POD SE page recommends e-liquid of up to 50 mg nicotine strength.",
          ],
        },
        {
          heading: "How do I fill it, and can I see what's left?",
          paragraphs: [
            "The side-fill pod: pull it out of the device and open the plug to fill. VOOPOO says the full-view pod lets you check the level at any time without pulling it out.",
          ],
        },
        {
          heading: "How does it resist leaks?",
          paragraphs: [
            "VOOPOO builds a multi-layer leak-proof design into the ARGUS POD cartridge and says its four-hole structure locks the e-liquid firmly inside.",
          ],
        },
        {
          heading: "How long does one pod last?",
          paragraphs: [
            "VOOPOO's ARGUS G page says one built-in-coil pod lasts for about 14 mL of e-liquid, and VOOPOO's FAQ suggests a new coil after 5–6 refills.",
          ],
        },
        {
          heading: "Which Top Fill resistances are there?",
          paragraphs: [
            "Per VOOPOO's ARGUS G page, three: 0.4Ω at 18–30W, 0.7Ω at 14–18W and 1.0Ω at 10–14W. VOOPOO says the 0.4Ω Top Fill is only for ARGUS Pod Family devices with 30W output, and that page says it is not for the ARGUS G — so check your device's maximum first.",
          ],
        },
        {
          heading: "How do I match an ARGUS pod to my device?",
          paragraphs: [
            "VOOPOO says ARGUS cartridges fit the ARGUS Pod Family, and names the ARGUS G, ARGUS POD, ARGUS P1 and ARGUS Z for the side-fill pods. On an [ARGUS G3 mini](/products/argus-g3-mini), note that VOOPOO's ARGUS G3 mini page lists the Top Fill pods and does not list the side-fill ARGUS POD Cartridge. To change just the coil and keep the pod, VOOPOO also makes an empty ARGUS POD cartridge that takes ITO coils: see [the ARGUS P1 empty pod](/products/coil-83).",
          ],
        },
      ],
      faq: [
        {
          question: "Do ARGUS pods fit the ARGUS G4?",
          answer: "Yes. VOOPOO's ARGUS G4 page says the device takes every ARGUS pod-family cartridge, Top Fill included.",
        },
      ],
    },
    zh: {
      lede: "本页的 VOOPOO ARGUS Pod 烟弹有两种：侧注油和 Top Fill 顶部注油。下面根据 VOOPOO 官网的资料，介绍各自的功率、注油方法、一颗能用多久，以及怎么选到适合自己设备的款式。",
      sections: [
        {
          heading: "侧注油烟弹需要多大功率？",
          paragraphs: [
            "VOOPOO 把侧注油烟弹称为 ARGUS POD Cartridge，标注 0.7Ω 为 14–18W，1.2Ω 为 9–12W。VOOPOO 的 ARGUS POD SE 页面建议搭配尼古丁浓度不超过 50 mg 的烟油。",
          ],
        },
        {
          heading: "怎么注油？能看到剩余烟油吗？",
          paragraphs: [
            "侧注油烟弹：从主机上拔下，打开注油塞即可注油。VOOPOO 表示这款全透明烟弹无需拔出就能随时查看剩余油量。",
          ],
        },
        {
          heading: "防漏做得怎么样？",
          paragraphs: [
            "VOOPOO 在 ARGUS POD 烟弹里采用多层防漏设计，并表示四孔结构能把烟油牢牢锁在烟弹内。",
          ],
        },
        {
          heading: "一颗烟弹能用多久？",
          paragraphs: [
            "VOOPOO 的 ARGUS G 页面写道，一颗一体式烟弹大约可用 14 mL 烟油；VOOPOO 的常见问题也建议注油 5–6 次后更换新线圈。",
          ],
        },
        {
          heading: "Top Fill 有哪些阻值？",
          paragraphs: [
            "按 VOOPOO 的 ARGUS G 页面，共三种：0.4Ω 为 18–30W，0.7Ω 为 14–18W，1.0Ω 为 10–14W。VOOPOO 注明 0.4Ω Top Fill 只适用于输出可达 30W 的 ARGUS Pod 系列设备，该页面也写明它不适用于 ARGUS G，选购前请先确认设备的最大功率。",
          ],
        },
        {
          heading: "怎么选到适合自己设备的 ARGUS 烟弹？",
          paragraphs: [
            "VOOPOO 表示 ARGUS 烟弹适用于 ARGUS Pod 系列设备，侧注油烟弹则点名适用 ARGUS G、ARGUS POD、ARGUS P1 和 ARGUS Z。用 [ARGUS G3 mini](/products/argus-g3-mini) 的话请注意：VOOPOO 的 ARGUS G3 mini 页面列出了 Top Fill 烟弹，侧注油的 ARGUS POD Cartridge 不在该页列表中。想只换线圈、继续用原烟弹的话，VOOPOO 还有可装 ITO 线圈的 ARGUS POD 空烟弹，见 [Argus P1 空烟弹](/products/coil-83)。",
          ],
        },
      ],
      faq: [
        {
          question: "ARGUS 烟弹能用在 ARGUS G4 上吗？",
          answer: "可以。VOOPOO 的 ARGUS G4 页面写明这台机器适用所有 ARGUS 系列烟弹，包括 Top Fill。",
        },
      ],
    },
  },
  // Articles queue 0211 batch 5, VOOPOO (03/11): ARGUS POD empty cartridge ("Argus P1 empty pod") — facts = VOOPOO's ARGUS P1 page
  // (the two kits' box lists, the ITO-M0…M3 coils, fill), its DRAG Q page (ITO coil table: draw, watts, nicotine, mesh, ~10 fills)
  // and voopoo.com/faq.html (70% fill, 5 min, low wattage first); WebFetch 03/11. Capacity / pack count = the spec rows
  // (a retailer source) → not repeated. Fit with ARGUS POD / P1 / Z / G / A stays in the spec row.
  "coil-83": {
    th: {
      lede: "หัวพอตเปล่า VOOPOO ARGUS P1 มากับเครื่องรุ่นไหน ใส่คอยล์ ITO ค่าไหนได้บ้าง แต่ละค่าเหมาะกับแนวการสูบแบบไหน และควรดูแลคอยล์ยังไง ด้านล่างสรุปจากหน้าเว็บของ VOOPOO ให้ดูทีละเรื่อง",
      sections: [
        {
          heading: "หัวพอตเปล่า ARGUS P1 มากับเครื่องรุ่นไหน",
          paragraphs: [
            "หน้า ARGUS P1 ของ VOOPOO บอกของในกล่องไว้สองชุด ชุด ARGUS POD มากับหัวพอตที่มีคอยล์ในตัว 0.7 และ 1.2 โอห์ม",
            "ส่วนชุด ARGUS P1 มากับหัวพอตเปล่าแบบนี้ 1 หัว และคอยล์ ITO-M1 0.7 โอห์มกับ ITO-M3 1.2 โอห์มอย่างละตัว",
            "ถ้าอยากได้หัวที่มีคอยล์มาในตัวเลย ไม่ต้องเปลี่ยนคอยล์เอง ดูได้ที่หน้า [หัวพอต VOOPOO Argus Pod](/products/coil-21)",
          ],
        },
        {
          heading: "ใส่คอยล์ ITO ค่าไหนได้บ้าง",
          paragraphs: [
            "หน้า ARGUS P1 ของ VOOPOO ระบุคอยล์ ITO ไว้สี่ค่า คือ ITO-M0 0.5 โอห์ม ITO-M1 0.7 โอห์ม ITO-M2 1.0 โอห์ม และ ITO-M3 1.2 โอห์ม ทั้งสี่ตัวเป็นคอยล์ mesh",
            "ตามตารางคอยล์ ITO ของ VOOPOO ตัว ITO-M0 สูบแบบ RDL ใช้ 18–25 วัตต์ ITO-M1 เป็น MTL แบบลมโล่ง ใช้ 14–18 วัตต์ ITO-M2 เป็น MTL ใช้ 10–14 วัตต์ และ ITO-M3 เป็น MTL แบบแน่น ใช้ 8–12 วัตต์",
          ],
        },
        {
          heading: "คอยล์แต่ละค่าเหมาะกับนิโคตินเท่าไร",
          paragraphs: [
            "VOOPOO แนะนำความเข้มข้นนิโคตินแยกตามคอยล์ไว้ด้วย คือ ITO-M0 ไม่เกิน 20mg ITO-M1 อยู่ที่ 20–30mg ITO-M2 อยู่ที่ 30–50mg และ ITO-M3 ไม่เกิน 50mg",
            "ถ้ายังไม่แน่ใจว่าชอบสูบแบบไหน อ่านต่อได้ที่ [MTL กับ DTL สูบต่างกันยังไง แล้ว RDL คืออะไร](/guides/understanding-mtl-vs-dtl)",
          ],
        },
        {
          heading: "เติมน้ำยายังไง คอยล์ใช้ได้กี่ครั้ง",
          paragraphs: [
            "วิธีเติมตามหน้า ARGUS P1 ของ VOOPOO คือดึงหัวออกจากเครื่อง แล้วเปิดจุกที่ตัวหัวเพื่อเติมน้ำยา",
            "ส่วนคอยล์ ITO นั้น VOOPOO ประเมินไว้ในหน้า DRAG Q ว่าหนึ่งตัวเติมน้ำยาใช้ได้ราว 10 ครั้ง",
            "หลังใส่คอยล์ใหม่ หน้าคำถามที่พบบ่อยของ VOOPOO แนะนำให้เติมน้ำยาราว 70% ของหัว ทิ้งไว้ 5 นาทีก่อนสูบ และใช้วัตต์ต่ำในช่วงพัฟแรก ๆ",
          ],
        },
      ],
      faq: [
        {
          question: "หัวพอตเปล่า Argus P1 มีคอยล์มาให้ไหม",
          answer: "ไม่มีค่ะ หัวนี้เป็นหัวพอตเปล่า ต้องซื้อคอยล์ ITO แยกมาใส่ก่อนใช้นะคะ",
        },
      ],
    },
    en: {
      lede: "VOOPOO calls the ARGUS P1 empty pod the ARGUS POD Empty Cartridge. Below, from VOOPOO's own pages: which kit it comes with, which ITO coils fit, which draw each suits and how to look after the coil.",
      sections: [
        {
          heading: "Which kit does the ARGUS P1 empty pod come with?",
          paragraphs: [
            "VOOPOO's ARGUS P1 page lists two kit boxes: the ARGUS POD kit comes with built-in-coil pods (0.7Ω and 1.2Ω), while the ARGUS P1 kit comes with one of these empty pods plus one ITO-M1 0.7Ω and one ITO-M3 1.2Ω coil. If you'd rather not change coils, built-in-coil pods are on the [VOOPOO Argus Pod](/products/coil-21) page.",
          ],
        },
        {
          heading: "Which ITO coils fit?",
          paragraphs: [
            "VOOPOO's ARGUS P1 page lists four ITO coils, all mesh: ITO-M0 0.5Ω, ITO-M1 0.7Ω, ITO-M2 1.0Ω and ITO-M3 1.2Ω. In VOOPOO's ITO table the M0 is RDL at 18–25W, the M1 a loose MTL at 14–18W, the M2 MTL at 10–14W and the M3 a tight MTL at 8–12W.",
          ],
        },
        {
          heading: "Which nicotine strength for each coil?",
          paragraphs: [
            "VOOPOO gives a nicotine strength per coil: up to 20 mg for the M0, 20–30 mg for the M1, 30–50 mg for the M2 and up to 50 mg for the M3. Not sure which draw you like? See [MTL vs. DTL](/guides/understanding-mtl-vs-dtl).",
          ],
        },
        {
          heading: "How do I fill it, and how long does a coil last?",
          paragraphs: [
            "Per VOOPOO's ARGUS P1 page, pull the pod out of the device and open the plug to fill. On its DRAG Q page VOOPOO estimates one ITO coil for about 10 fills. With a new coil, VOOPOO's FAQ suggests filling to about 70%, waiting 5 minutes before vaping and taking the first few puffs at low wattage.",
          ],
        },
      ],
      faq: [
        {
          question: "Does the Argus P1 empty pod come with a coil?",
          answer: "No. It's an empty pod — ITO coils are sold separately and fitted before use.",
        },
      ],
    },
    zh: {
      lede: "VOOPOO 把 ARGUS P1 空烟弹称为 ARGUS POD Empty Cartridge。下面根据 VOOPOO 官网的资料，介绍它随哪款套装附带、能装哪些 ITO 线圈、各自适合哪种抽法，以及线圈怎么保养。",
      sections: [
        {
          heading: "ARGUS P1 空烟弹随哪款套装附带？",
          paragraphs: [
            "VOOPOO 的 ARGUS P1 页面列出两套包装：ARGUS POD 套装附带一体式线圈烟弹（0.7Ω 和 1.2Ω），而 ARGUS P1 套装附带 1 个这种空烟弹，加上 ITO-M1 0.7Ω 和 ITO-M3 1.2Ω 线圈各一颗。不想自己换线圈的话，一体式烟弹见 [VOOPOO Argus Pod 烟弹](/products/coil-21)。",
          ],
        },
        {
          heading: "能装哪些 ITO 线圈？",
          paragraphs: [
            "VOOPOO 的 ARGUS P1 页面列出四款 ITO 线圈，都是网状线圈：ITO-M0 0.5Ω、ITO-M1 0.7Ω、ITO-M2 1.0Ω 和 ITO-M3 1.2Ω。按 VOOPOO 的 ITO 表格，M0 为 RDL，18–25W；M1 为偏松的 MTL，14–18W；M2 为 MTL，10–14W；M3 为紧 MTL，8–12W。",
          ],
        },
        {
          heading: "每颗线圈适合多大尼古丁浓度？",
          paragraphs: [
            "VOOPOO 按线圈给出尼古丁浓度建议：M0 不超过 20 mg，M1 为 20–30 mg，M2 为 30–50 mg，M3 不超过 50 mg。还不确定自己适合哪种抽法，可以看[MTL 与 DTL 的区别](/guides/understanding-mtl-vs-dtl)。",
          ],
        },
        {
          heading: "怎么注油？线圈能用多久？",
          paragraphs: [
            "按 VOOPOO 的 ARGUS P1 页面，把烟弹从主机上拔下，打开注油塞即可注油。VOOPOO 在 DRAG Q 页面估计一颗 ITO 线圈约可注油 10 次。装上新线圈后，VOOPOO 的常见问题建议注油约七成，静置 5 分钟再抽，前几口用低功率。",
          ],
        },
      ],
      faq: [
        {
          question: "Argus P1 空烟弹带线圈吗？",
          answer: "不带。这是空烟弹，ITO 线圈需另购，装好后再使用。",
        },
      ],
    },
  },
  // Articles queue 0211 batch 5, VOOPOO (03/11): ITO-X empty pod — facts = VOOPOO's DRAG Q page (the ITO-X pod: material, size,
  // 3.5 mL "less filling", steel base, directional coil, 4 silicone rings, "all ITO coils", the ITO table, ~10 fills) and its DORIC Q
  // page (ITO-X Pod in the compatible list); WebFetch 03/11. Top fill = the tagline + a spec row VOOPOO's DRAG Q page does not
  // state → not repeated. Worded apart from coil-83 (same ITO coils).
  "coil-68": {
    th: {
      lede: "หัวพอตเปล่า VOOPOO ITO-X เป็นหัวพอตของเครื่อง DRAG Q ด้านล่างสรุปจากหน้าเว็บของ VOOPOO ว่าหัวนี้ทำจากอะไร ยึดกับเครื่องยังไง กันรั่วยังไง ใส่คอยล์ ITO ค่าไหนได้บ้าง และนอกจาก DRAG Q แล้วยังใช้กับเครื่องไหนได้อีก",
      sections: [
        {
          heading: "หัว ITO-X ทำจากอะไร",
          paragraphs: [
            "หัว ITO-X ทำจากสแตนเลสกับ PCTG และมีขนาด 51.45 × 21.5 × 21.5 mm",
            "VOOPOO บอกว่าความจุ 3.5mL ช่วยให้สูบได้นานขึ้นโดยไม่ต้องเติมน้ำยาบ่อย",
            "VOOPOO ทำฐานของหัวเป็นสแตนเลส และออกแบบให้ยึดเข้ากับตัวเครื่องได้แน่น",
          ],
        },
        {
          heading: "หัว ITO-X กันรั่วยังไง",
          paragraphs: [
            "VOOPOO บอกว่าหัว ITO-X มีแหวนซิลิโคน 4 ชั้นที่ช่วยกันรั่ว",
            "ส่วนคอยล์ ITO ออกแบบให้เสียบเข้าหัวในทิศทางเดียว ซึ่ง VOOPOO บอกว่าช่วยให้ลมเดินตรงและรสชาติคงที่",
          ],
        },
        {
          heading: "หัว ITO-X ใช้คอยล์ตัวไหนได้บ้าง",
          paragraphs: [
            "VOOPOO บอกว่า DRAG Q ใช้คอยล์ ITO ได้ทุกตัว และหน้า DRAG Q ระบุคอยล์ mesh ไว้สี่ตัว ตั้งแต่ 0.5 ถึง 1.2 โอห์ม ครอบคลุมการสูบตั้งแต่ RDL ไปจนถึง MTL",
            "ITO-M0 0.5 โอห์มสูบแบบ RDL ที่ 18–25 วัตต์ ส่วน ITO-M1 0.7 โอห์ม ITO-M2 1.0 โอห์ม และ ITO-M3 1.2 โอห์ม เป็น MTL ที่ลมแน่นขึ้นและใช้วัตต์ต่ำลงตามลำดับ โดย ITO-M3 ใช้ที่ 8–12 วัตต์",
            "คอยล์ ITO แต่ละตัว VOOPOO ประเมินว่าใช้ได้ราว 10 รอบการเติมน้ำยา",
            "ถ้ายังไม่แน่ใจว่าชอบสูบแบบไหน อ่านต่อได้ที่ [MTL กับ DTL สูบต่างกันยังไง แล้ว RDL คืออะไร](/guides/understanding-mtl-vs-dtl)",
          ],
        },
        {
          heading: "นอกจาก DRAG Q แล้วใช้กับเครื่องไหนได้อีก",
          paragraphs: [
            "หน้า DORIC Q ของ VOOPOO ใส่ ITO-X Pod ไว้ในรายการหัวที่ใช้ร่วมกันได้ด้วย ถ้าใช้ DORIC Q อยู่ หัวนี้จึงเป็นอีกทางเลือกหนึ่ง",
            "ส่วนเครื่อง ARGUS P1 ก็ใช้คอยล์ ITO ชุดเดียวกันนี้ แต่ใช้หัวพอตเปล่าอีกแบบ ดูได้ที่หน้า [หัวเปล่า Argus P1](/products/coil-83)",
          ],
        },
      ],
      faq: [
        {
          question: "หัวพอตเปล่า ITO-X มีคอยล์มาให้ไหม",
          answer: "ไม่มีค่ะ ITO-X เป็นหัวพอตเปล่า คอยล์ ITO ต้องซื้อแยกแล้วใส่เองก่อนใช้นะคะ",
        },
      ],
    },
    en: {
      lede: "The VOOPOO ITO-X empty pod is VOOPOO's pod for the DRAG Q. Below, from VOOPOO's own pages: what it's made of, how it locks on, how it resists leaks, which ITO coils fit and which devices besides the DRAG Q take it.",
      sections: [
        {
          heading: "What is the ITO-X pod made of?",
          paragraphs: [
            "Stainless steel and PCTG, 51.45 × 21.5 × 21.5 mm. VOOPOO says the 3.5 mL capacity gives longer vaping with less filling, and the stainless-steel base is designed to buckle firmly onto the device.",
          ],
        },
        {
          heading: "How does the ITO-X resist leaks?",
          paragraphs: [
            "VOOPOO says four layers of silicone ring form the leak-proof structure. The ITO coil is inserted in one direction, which VOOPOO says keeps the airflow direct and the taste stable.",
          ],
        },
        {
          heading: "Which coils does the ITO-X take?",
          paragraphs: [
            "VOOPOO says the DRAG Q takes every ITO coil, and its DRAG Q page lists four mesh coils from 0.5Ω to 1.2Ω, covering RDL to MTL. The ITO-M0 0.5Ω is RDL at 18–25W; the ITO-M1 0.7Ω, ITO-M2 1.0Ω and ITO-M3 1.2Ω are MTL, tighter and lower in wattage in that order, the M3 at 8–12W. VOOPOO estimates one ITO coil for about 10 fills. Not sure which draw you like? See [MTL vs. DTL](/guides/understanding-mtl-vs-dtl).",
          ],
        },
        {
          heading: "Which devices besides the DRAG Q take it?",
          paragraphs: [
            "VOOPOO's DORIC Q page lists the ITO-X Pod among its compatible cartridges too. The ARGUS P1 uses the same ITO coils but a different empty pod — see [the ARGUS P1 empty pod](/products/coil-83).",
          ],
        },
      ],
      faq: [
        {
          question: "Does the ITO-X empty pod come with a coil?",
          answer: "No. The ITO-X is an empty pod — buy ITO coils separately and fit one before use.",
        },
      ],
    },
    zh: {
      lede: "VOOPOO ITO-X 空烟弹是 VOOPOO 为 DRAG Q 设计的烟弹。下面根据 VOOPOO 官网的资料，介绍它的材质、怎么固定在主机上、怎么防漏、能装哪些 ITO 线圈，以及除了 DRAG Q 还适用哪些设备。",
      sections: [
        {
          heading: "ITO-X 烟弹是什么材质？",
          paragraphs: [
            "不锈钢加 PCTG，尺寸 51.45 × 21.5 × 21.5 mm。VOOPOO 表示 3.5 mL 的容量让抽得更久、注油次数更少；不锈钢底座则能与主机牢牢扣合。",
          ],
        },
        {
          heading: "ITO-X 怎么防漏？",
          paragraphs: [
            "VOOPOO 表示四层硅胶圈构成有效的防漏结构；ITO 线圈按定向方式插入，官方称这样气流更直接、口感更稳定。",
          ],
        },
        {
          heading: "ITO-X 能装哪些线圈？",
          paragraphs: [
            "VOOPOO 表示 DRAG Q 兼容所有 ITO 线圈，DRAG Q 页面列出四款网状线圈，阻值 0.5Ω 到 1.2Ω，覆盖 RDL 到 MTL。ITO-M0 0.5Ω 为 RDL，18–25W；ITO-M1 0.7Ω、ITO-M2 1.0Ω 和 ITO-M3 1.2Ω 为 MTL，吸感依次更紧、功率更低，M3 为 8–12W。VOOPOO 估计一颗 ITO 线圈约可注油 10 次。还不确定自己适合哪种抽法，可以看[MTL 与 DTL 的区别](/guides/understanding-mtl-vs-dtl)。",
          ],
        },
        {
          heading: "除了 DRAG Q 还适用哪些设备？",
          paragraphs: [
            "VOOPOO 的 DORIC Q 页面也把 ITO-X Pod 列为兼容烟弹。ARGUS P1 用的是同样的 ITO 线圈，但空烟弹是另一款，见 [Argus P1 空烟弹](/products/coil-83)。",
          ],
        },
      ],
      faq: [
        {
          question: "ITO-X 空烟弹带线圈吗？",
          answer: "不带。ITO-X 是空烟弹，ITO 线圈需另购，装好后再使用。",
        },
      ],
    },
  },
  // Site-wide template round batch 2g (05/10): from VOOPOO's ARGUS G4 page and posters; Thai = thai-copy 05/10.
  "argus-g4": {
    th: {
      lede: "ARGUS G4 เป็นรุ่นที่ VOOPOO ใส่จอและปุ่ม ให้ตั้งค่าเครื่องได้เอง ด้านล่างไล่ให้ดูทีละเรื่อง",
      sections: [
        {
          heading: "ARGUS G4 กับ ARGUS G4 mini เลือกตัวไหนดี",
          paragraphs: [
            "ทั้งสองรุ่นใช้หัวพอต Multi-Ohm เหมือนกัน ส่วน [ARGUS G4 mini](/products/argus-g4-mini) ไม่มีจอ เปลี่ยนโอห์มได้สองค่าด้วยการกลับด้านหัวพอต และหนัก 56 กรัม",
            "ถ้าอยากดูสถานะเครื่องบนจอ และอยากได้ค่าโอห์มที่สามจากการกดปุ่ม G4 จะเหมาะกว่า"
          ]
        },
        {
          heading: "ใช้หัวพอตอะไรได้บ้าง และหาซื้อได้ที่ไหน",
          paragraphs: [
            "หัวพอต ARGUS ที่ไล่ไว้ด้านบนใช้กับเครื่องนี้ได้ทุกหัว และร้านเรามี [หัวพอต VOOPOO Argus Pod](/products/coil-21) ให้เลือกหลายค่าโอห์ม"
          ]
        },
        {
          heading: "ในกล่องมีอะไรบ้าง",
          paragraphs: [
            "ในกล่องมีตัวเครื่อง ARGUS G4 หัวพอต ARGUS Multi-Ohm Cartridge สองหัว สายชาร์จ USB-C คู่มือการใช้งาน การ์ดรายชื่อหัวพอตตระกูล ARGUS ที่ใช้ร่วมกันได้ และสายคล้องคอ"
          ]
        }
      ]
    },
    en: {
      lede: "On the ARGUS G4, VOOPOO adds a screen and a button so you can set the device up yourself. Below, one part at a time.",
      sections: [
        {
          heading: "ARGUS G4 or ARGUS G4 mini?",
          paragraphs: [
            "Both take the Multi-Ohm cartridge. The [ARGUS G4 mini](/products/argus-g4-mini) has no screen and switches between two resistances by flipping the pod; it weighs 56g.",
            "If you want to see the device's status on a screen and get a third resistance at the press of the button, the G4 is the one."
          ]
        },
        {
          heading: "Which pods fit, and where do I get them?",
          paragraphs: [
            "Every ARGUS pod in the block above fits, and we carry [VOOPOO Argus Pod cartridges](/products/coil-21) in several resistances."
          ]
        },
        {
          heading: "What's in the box?",
          paragraphs: [
            "The ARGUS G4, two ARGUS Multi-Ohm Cartridges, a USB-C cable, the user manual, VOOPOO's ARGUS pod-family compatibility guide and a lanyard."
          ]
        }
      ]
    },
    zh: {
      lede: "ARGUS G4 是 VOOPOO 加了屏幕和按键、可以自己设置的机型。下面逐项来看。",
      sections: [
        {
          heading: "ARGUS G4 还是 ARGUS G4 mini？",
          paragraphs: [
            "两款都用 Multi-Ohm 烟弹。[ARGUS G4 mini](/products/argus-g4-mini) 没有屏幕，靠翻转烟弹在两种阻值之间切换，重 56g。",
            "想在屏幕上看机器状态，还想按键切出第三种阻值，就选 G4。"
          ]
        },
        {
          heading: "能用哪些烟弹？去哪里买？",
          paragraphs: [
            "上面列出的 ARGUS 烟弹都能用。本店有售 [VOOPOO Argus Pod 烟弹](/products/coil-21)，有多种阻值可选。"
          ]
        },
        {
          heading: "包装里有什么？",
          paragraphs: [
            "ARGUS G4 主机、两颗 ARGUS Multi-Ohm 烟弹、一条 USB-C 数据线、使用说明书、VOOPOO 的 ARGUS 烟弹兼容指南，以及一条挂绳。"
          ]
        }
      ]
    },
  },
  // Site-wide template round batch 3a (05/10): from SALTHUB's Zero Pro page and posters; Thai = thai-copy 05/10.
  "zero-pro": {
    th: {
      lede: "Zero Pro เป็นเครื่องในตระกูล Zero ของ SALTHUB ตัวเครื่องกะทัดรัด ด้านล่างไล่ให้ดูทีละเรื่อง",
      sections: [
        {
          heading: "ใช้กับหัวพอตอะไร",
          paragraphs: [
            "Zero Pro ใช้หัวพอต Zero ซึ่งบนเว็บของ SALTHUB จัดไว้ในหมวดกลิ่นของ Zero Pro ส่วนตัวเลข 5,000 พัฟ มาจากโปสเตอร์ของ Zero Pro ที่ SALTHUB ทำไว้ ดูรายละเอียดหัวพอตได้ที่ [หน้าหัวพอต Zero](/products/zero-cartridge)"
          ]
        },
        {
          heading: "ชื่อสีของ SALTHUB กับชื่อบนเว็บเรา",
          paragraphs: [
            "SALTHUB เรียกชื่อสีบางสีต่างจากเรา ส่วน Red กับ Black ใช้ชื่อเดียวกัน",
            "Flesh Pink คือสี Pink บนเว็บเรา",
            "Black and Red Gradient คือสี Charcoal Red บนเว็บเรา",
            "Blue-Purple Gradient คือสี Blue Purple บนเว็บเรา",
            "Silver-Grey คือสี Gunmetal บนเว็บเรา",
            "Light Blue คือสี Teal บนเว็บเรา",
            "Yellow and Black Gradient คือสี Golden Fade บนเว็บเรา"
          ]
        }
      ]
    },
    en: {
      lede: "The Zero Pro is a compact device in SALTHUB's Zero line. Below, one part at a time.",
      sections: [
        {
          heading: "Which cartridge does it take?",
          paragraphs: [
            "The Zero Pro takes the Zero pods, which SALTHUB's site lists among the Zero Pro's flavours. The 5,000-puff figure is the one SALTHUB prints on its Zero Pro poster. See the pods on our [Zero pod page](/products/zero-cartridge)."
          ]
        },
        {
          heading: "SALTHUB's colour names and ours",
          paragraphs: [
            "SALTHUB names some colours differently from us; Red and Black are the same on both.",
            "Flesh Pink is our Pink.",
            "Black and Red Gradient is our Charcoal Red.",
            "Blue-Purple Gradient is our Blue Purple.",
            "Silver-Grey is our Gunmetal.",
            "Light Blue is our Teal.",
            "Yellow and Black Gradient is our Golden Fade."
          ]
        }
      ]
    },
    zh: {
      lede: "Zero Pro 是 SALTHUB Zero 系列里一款小巧的机型。下面逐项来看。",
      sections: [
        {
          heading: "用哪种烟弹？",
          paragraphs: [
            "Zero Pro 用的是 Zero 烟弹，SALTHUB 官网把它们归在 Zero Pro 的口味里。5,000 口这个数字来自 SALTHUB 的 Zero Pro 海报。烟弹详情见 [Zero 烟弹页面](/products/zero-cartridge)。"
          ]
        },
        {
          heading: "SALTHUB 的颜色名与本站对照",
          paragraphs: [
            "SALTHUB 有几种颜色的叫法和我们不同，Red 和 Black 两边一样。",
            "Flesh Pink 即本站的 Pink。",
            "Black and Red Gradient 即本站的 Charcoal Red。",
            "Blue-Purple Gradient 即本站的 Blue Purple。",
            "Silver-Grey 即本站的 Gunmetal。",
            "Light Blue 即本站的 Teal。",
            "Yellow and Black Gradient 即本站的 Golden Fade。"
          ]
        }
      ]
    },
  },
  // Site-wide template round batch 3b (05/10): from SALTHUB's M Switch Kit page and posters; Thai = thai-copy 05/10.
  "m-switch-kit": {
    th: {
      lede: "ด้านล่างไล่ดู M Switch Kit ทีละส่วนจากโปสเตอร์ของ SALTHUB เอง พร้อมบอกว่าแต่ละส่วนช่วยอะไรในการใช้งาน",
      sections: [
        {
          heading: "เลือกกลิ่นแล้ว ในชุดจะได้อะไรบ้าง",
          paragraphs: [
            "แต่ละกลิ่นมาเป็นชุด มีตัวเครื่องคู่กับหัวพอตกลิ่นนั้นหนึ่งหัว ถ้าอยากได้หัวพอตเพิ่มหรืออยากลองกลิ่นอื่น ดูได้ที่[หน้าหัวพอต](/products/m-switch-pod)"
          ]
        }
      ]
    },
    en: {
      lede: "Below, the M Switch Kit one part at a time, from SALTHUB's own posters.",
      sections: [
        {
          heading: "What comes with each flavour?",
          paragraphs: [
            "Each flavour comes as the device with one pod of that flavour. Spare pods and other flavours are on the [pod page](/products/m-switch-pod)."
          ]
        }
      ]
    },
    zh: {
      lede: "下面根据 SALTHUB 自己的海报，逐项来看 M Switch Kit。",
      sections: [
        {
          heading: "每个口味的套装里有什么？",
          paragraphs: [
            "每个口味都是主机加一颗该口味的烟弹。备用烟弹见[烟弹页面](/products/m-switch-pod)。"
          ]
        }
      ]
    },
  },
  // Round "queue 0211" articles, SALTHUB (02/11): from SALTHUB's M Switch Pod page + posters, its home page ("M Switch Pod"
  // card and "THE BENEFITS — M SWITCH POD") and its FAQ page — source per sentence: _incoming/articles-0211/salthub-draft.md.
  // Flavour groups = the 17 names on SALTHUB's page, sorted by name only (no taste claims).
  "m-switch-pod": {
    th: {
      lede: "M Switch Pod เป็นหัวพอตของ SALTHUB ข้อมูลในส่วนนี้สรุปจากหน้าเว็บและโปสเตอร์ของ SALTHUB ไว้ให้ ว่าหัวนี้ใช้ยังไง สูบได้กี่พัฟ และกลิ่นทั้งหมดแบ่งได้เป็นแนวไหน",
      sections: [
        {
          heading: "M Switch Pod ใช้ยังไง",
          paragraphs: [
            "ตัวเครื่องเก็บไว้ชาร์จแล้วใช้ต่อได้ ส่วนหัวพอตบรรจุน้ำยามาแล้ว ใช้หมดก็เปลี่ยนเป็นหัวใหม่ได้เลย",
            "ถ้าเพิ่งเริ่มใช้ เริ่มจากชุด [M Switch Kit](/products/m-switch-kit) ก็ได้ ในชุดมีตัวเครื่องมาพร้อมหัวพอตหนึ่งหัว",
            "ถ้ากำลังเทียบ M Switch กับเครื่องระบบสวิตช์ยี่ห้ออื่น ร้านเทียบไว้ทีละข้อที่ [Esko Bar Switch 20K กับ M Switch](/guides/esko-bar-switch-vs-m-switch)",
          ],
        },
        {
          heading: "M Switch Pod หัวหนึ่งสูบได้กี่พัฟ",
          paragraphs: [
            "โปสเตอร์ของ SALTHUB ระบุว่าหัวหนึ่งสูบได้สูงสุด 15,000 พัฟ ส่วนที่สูบได้จริงขึ้นกับการสูบของแต่ละคน",
            "ข้างในใช้คอยล์ cotton mesh 1.0 โอห์ม ส่วนน้ำยาเป็น salt nic ความเข้มข้น 30mg ตามข้อมูลบนโปสเตอร์และหน้าแรกของเว็บ SALTHUB",
          ],
        },
        {
          heading: "M Switch Pod มีกลิ่นอะไรบ้าง",
          paragraphs: [
            "บนหน้าเว็บของ SALTHUB หัวพอตรุ่นนี้มีให้เลือก 17 กลิ่น ถ้าแบ่งตามชื่อกลิ่นจะได้ 4 แนว",
            "สายเย็น ชื่อกลิ่นมีคำว่า Ice หรือ Mint ได้แก่ Blue Ice และ Doublemint",
            "สายองุ่น ได้แก่ Kyoho Grape · Grape · Grape Aloe และ Grape Lychee",
            "สายผลไม้อื่น ได้แก่ Apple Aloe · Black Berry · Mango Passion · Mixberry · Peach Strawberry · Pink Berry · Strawberry · Strawberry Watermelon และ Watermelon",
            "แนวอื่นมี Cola กับ Watermelon Bubblegum",
          ],
        },
        {
          heading: "M Switch Pod ดูยังไงว่าหัวไหนเป็นกลิ่นอะไร",
          paragraphs: [
            "หัวพอตทุกกลิ่นเป็นสีดำเหมือนกัน แต่ละกลิ่นจะมีโลโก้ M คนละสี และมีป้ายชื่อกลิ่นอยู่ด้านหน้า ถ้าซื้อไปหลายกลิ่น ก็ดูจากป้ายนี้ได้เลยว่าหัวไหนเป็นกลิ่นอะไร",
          ],
        },
        {
          heading: "M Switch Pod ใช้และเก็บยังไงดี",
          paragraphs: [
            "SALTHUB แนะนำให้เลี่ยงการคว่ำเครื่องเอาหัวลง ทั้งตอนสูบและตอนวางเก็บ เพราะหยดน้ำยาที่เกาะอยู่ภายในอาจไหลเข้าปากได้",
          ],
        },
      ],
    },
    en: {
      lede: "The M Switch Pod is a SALTHUB pod. Below is a summary from SALTHUB's own page and posters of how it is used, how many puffs it gives and how its flavours group.",
      sections: [
        {
          heading: "How do you use the M Switch Pod?",
          paragraphs: [
            "You keep the device and recharge it; each pod comes with its e-liquid built in, so when one runs out you simply put on a new one.",
            "Starting out? The [M Switch Kit](/products/m-switch-kit) comes with the device and one pod.",
          ],
        },
        {
          heading: "How many puffs does one M Switch Pod give?",
          paragraphs: [
            "SALTHUB's poster rates one pod at up to 15,000 puffs; what you actually get depends on how you vape.",
            "Inside is a 1.0Ω cotton mesh coil, and the e-liquid is 30mg nicotine salt, according to SALTHUB's posters and home page.",
          ],
        },
        {
          heading: "Which flavours does the M Switch Pod come in?",
          paragraphs: [
            "SALTHUB's page lists 17 flavours. Grouped by name, they fall into four sets.",
            "Cool, with Ice or Mint in the name: Blue Ice and Doublemint.",
            "Grape: Kyoho Grape, Grape, Grape Aloe and Grape Lychee.",
            "Other fruit: Apple Aloe, Black Berry, Mango Passion, Mixberry, Peach Strawberry, Pink Berry, Strawberry, Strawberry Watermelon and Watermelon.",
            "Others: Cola and Watermelon Bubblegum.",
          ],
        },
        {
          heading: "How do I tell which flavour an M Switch Pod is?",
          paragraphs: [
            "Every pod is the same black. Each flavour has its own colour of M logo and a flavour name tag on the front, so with several flavours at hand you can read which is which.",
          ],
        },
        {
          heading: "How should you use and store the M Switch Pod?",
          paragraphs: [
            "SALTHUB advises against keeping the device upside down, whether you are vaping or not, as e-liquid droplets inside could run into your mouth.",
          ],
        },
      ],
    },
    zh: {
      lede: "M Switch Pod 是 SALTHUB 的烟弹。下面根据 SALTHUB 自己的网页和海报，介绍它的用法、每颗能抽多少口，以及口味如何分类。",
      sections: [
        {
          heading: "M Switch Pod 怎么用？",
          paragraphs: [
            "主机留着充电继续用，烟弹自带烟油，用完直接换一颗新的即可。",
            "第一次用？可以从 [M Switch Kit](/products/m-switch-kit) 开始，套装含主机和一颗烟弹。",
          ],
        },
        {
          heading: "一颗 M Switch Pod 能抽多少口？",
          paragraphs: [
            "SALTHUB 海报标注每颗最多 15,000 口，实际口数取决于个人的抽吸习惯。",
            "内部为 1.0Ω cotton mesh 线圈，烟油为 30mg 盐尼古丁，以上见 SALTHUB 的海报和官网首页。",
          ],
        },
        {
          heading: "M Switch Pod 有哪些口味？",
          paragraphs: [
            "SALTHUB 网页列出 17 种口味，按名称可分为四类。",
            "清凉系，名称带 Ice 或 Mint：Blue Ice 和 Doublemint。",
            "葡萄系：Kyoho Grape、Grape、Grape Aloe、Grape Lychee。",
            "其他水果：Apple Aloe、Black Berry、Mango Passion、Mixberry、Peach Strawberry、Pink Berry、Strawberry、Strawberry Watermelon、Watermelon。",
            "其他：Cola、Watermelon Bubblegum。",
          ],
        },
        {
          heading: "M Switch Pod 怎么分辨是哪种口味？",
          paragraphs: [
            "所有烟弹都是同样的黑色，每种口味的 M 标志颜色不同，正面还贴有口味名称标签，买了多种口味也能一眼认出。",
          ],
        },
        {
          heading: "M Switch Pod 使用和存放要注意什么？",
          paragraphs: [
            "SALTHUB 建议无论抽吸还是存放，都不要把设备倒置，以免内部的烟油液滴流进嘴里。",
          ],
        },
      ],
    },
  },
  // Same round (02/11): from SALTHUB's home page ("ZERO CARTRIDGE" card, the "FLAVORS — ZERO PRO" slider), its Zero Pro
  // posters (modes · side air intake · USB-C) and its FAQ page (e-juice ingredients · upside down). The capacity is left to
  // the spec table: the Zero Pro poster prints 2ML against the home card's 2.2mL (lesson พ18). 22 flavours = the 21 slider
  // packs + the home card's Strawberry pod, as listed on this page.
  "zero-cartridge": {
    th: {
      lede: "Zero Cartridge เป็นหัวพอตในตระกูล Zero ของ SALTHUB ด้านล่างสรุปไว้ให้จากเว็บของ SALTHUB เอง ว่าหัวนี้ใช้ยังไง มีกลิ่นแนวไหนบ้าง และน้ำยาทำจากอะไร",
      sections: [
        {
          heading: "Zero Cartridge ใช้ยังไง",
          paragraphs: [
            "SALTHUB เรียกหัวนี้ว่าหัวที่ถอดเปลี่ยนได้ ใช้หมดหัวหนึ่งก็เปลี่ยนเป็นหัวใหม่ หรือสลับไปลองกลิ่นอื่นได้",
          ],
        },
        {
          heading: "Zero Cartridge มีกลิ่นอะไรบ้าง",
          paragraphs: [
            "บนเว็บของ SALTHUB หัวพอตรุ่นนี้มีให้เลือก 22 กลิ่น ถ้าแบ่งตามชื่อกลิ่นจะได้ 5 แนว ส่วนตัวเลือกที่ลงท้ายด้วย 50mg บนหน้านี้ เป็นแบบนิโคติน 50mg ที่ร้านลงไว้เพิ่ม",
            "สายเย็น ชื่อกลิ่นมีคำว่า Ice หรือ Mint ได้แก่ Ice Sparkling และ Mint",
            "สายผลไม้ ได้แก่ Apple Aloe · Blueberry · Grape · Grape Aloe · Grapefruit · Honey Yuzu · Lychee · Mango · Mixberry · Peach · Peach Strawberry · Pineapple · Strawberry และ Watermelon",
            "สายชา ได้แก่ Fruit Tea และ Oolong Tea",
            "สายเครื่องดื่ม ได้แก่ Cola · Lemonade และ Yakult",
            "แนวอื่นมี Cigar กลิ่นเดียว",
            "ยังไม่แน่ใจว่าจะเริ่มจากแนวไหน อ่านวิธีเลือกกลิ่นได้ที่ [พอตกลิ่นไหนดี](/guides/choosing-a-pod-flavor)",
          ],
        },
        {
          heading: "น้ำยาใน Zero Cartridge ทำจากอะไร",
          paragraphs: [
            "SALTHUB ระบุไว้ในหน้าคำถามที่พบบ่อยว่าน้ำยาของแบรนด์มีส่วนผสมคือ VG · PG · นิโคตินแบบ salt nic และสารแต่งกลิ่นทั้งแบบธรรมชาติและแบบสังเคราะห์",
            "ถ้าอยากรู้จัก PG กับ VG มากขึ้น ร้านเขียนไว้ที่ [PG VG คืออะไร ต่างกันยังไง](/guides/pg-vg-in-e-liquid)",
          ],
        },
        {
          heading: "Zero Cartridge ใช้และเก็บยังไงดี",
          paragraphs: [
            "SALTHUB แนะนำให้เลี่ยงการคว่ำเครื่องเอาหัวลง ทั้งตอนสูบและตอนวางเก็บ เพราะหยดน้ำยาที่เกาะอยู่ภายในอาจไหลเข้าปากได้",
          ],
        },
      ],
    },
    en: {
      lede: "The Zero Cartridge is the pod of SALTHUB's Zero line. Below is a summary from SALTHUB's own site of how it is used, how its flavours group and what the e-liquid inside is made of.",
      sections: [
        {
          heading: "How do you use the Zero Cartridge?",
          paragraphs: [
            "SALTHUB calls it a changeable cartridge: when one runs out, put in a new one or switch to another flavour.",
          ],
        },
        {
          heading: "Which flavours does the Zero Cartridge come in?",
          paragraphs: [
            "SALTHUB's site lists 22 flavours for this pod. Grouped by name, they fall into five sets. The options on this page ending in 50mg are 50mg-nicotine versions the shop lists as well.",
            "Cool, with Ice or Mint in the name: Ice Sparkling and Mint.",
            "Fruit: Apple Aloe, Blueberry, Grape, Grape Aloe, Grapefruit, Honey Yuzu, Lychee, Mango, Mixberry, Peach, Peach Strawberry, Pineapple, Strawberry and Watermelon.",
            "Tea: Fruit Tea and Oolong Tea.",
            "Drinks: Cola, Lemonade and Yakult.",
            "Other: Cigar.",
          ],
        },
        {
          heading: "What is the e-liquid in the Zero Cartridge made of?",
          paragraphs: [
            "SALTHUB's FAQ page states that its e-liquid contains VG, PG, nicotine salt and natural and artificial flavourings.",
          ],
        },
        {
          heading: "How should you use and store the Zero Cartridge?",
          paragraphs: [
            "SALTHUB advises against keeping the device upside down, whether you are vaping or not, as e-liquid droplets inside could run into your mouth.",
          ],
        },
      ],
    },
    zh: {
      lede: "Zero Cartridge 是 SALTHUB Zero 系列的烟弹。下面根据 SALTHUB 官网的资料，介绍它的用法、口味如何分类，以及烟油的成分。",
      sections: [
        {
          heading: "Zero Cartridge 怎么用？",
          paragraphs: [
            "SALTHUB 称它为可更换的烟弹：一颗用完，换一颗新的，或换个口味都可以。",
          ],
        },
        {
          heading: "Zero Cartridge 有哪些口味？",
          paragraphs: [
            "SALTHUB 官网列出这款烟弹的 22 种口味，按名称可分为五类。本页名称以 50mg 结尾的选项，是本店另外上架的 50mg 尼古丁版本。",
            "清凉系，名称带 Ice 或 Mint：Ice Sparkling 和 Mint。",
            "水果系：Apple Aloe、Blueberry、Grape、Grape Aloe、Grapefruit、Honey Yuzu、Lychee、Mango、Mixberry、Peach、Peach Strawberry、Pineapple、Strawberry、Watermelon。",
            "茶系：Fruit Tea、Oolong Tea。",
            "饮品系：Cola、Lemonade、Yakult。",
            "其他：Cigar。",
          ],
        },
        {
          heading: "Zero Cartridge 的烟油是什么成分？",
          paragraphs: [
            "SALTHUB 在常见问题页面说明，其烟油成分为 VG、PG、盐尼古丁，以及天然和人工香料。",
          ],
        },
        {
          heading: "Zero Cartridge 使用和存放要注意什么？",
          paragraphs: [
            "SALTHUB 建议无论抽吸还是存放，都不要把设备倒置，以免内部的烟油液滴流进嘴里。",
          ],
        },
      ],
    },
  },
  // Round "queue 0211" articles, ESKO BAR (02/11): the three published ESKO BAR pages, from the maker's two product pages —
  // E1 eskobarvape.com/product/pod-system/ (device + pod) and E2 eskobarvape.com/product/eskobar ("ESKO BAR 498", the
  // disposable). Source per sentence: _incoming/articles-0211/esko-draft.md. Flavour groups on the pod page only (the kit
  // page links there); the comparison query stays with the guide esko-bar-switch-vs-m-switch. FAQ = PilotProductDetail's.
  "pod-159": {
    th: {
      lede: "Esko Bar Switch 20K เป็นเครื่องระบบสวิตช์ของ ESKO BAR ที่ตัวเครื่องกับหัวพอตแยกจากกัน พอน้ำยาหมดก็เปลี่ยนแค่หัว ด้านล่างเป็นข้อมูลจากหน้าเว็บของ ESKO BAR ว่าเครื่องนี้ปรับอะไรได้ และในกล่องมีอะไรบ้าง",
      sections: [
        {
          heading: "Esko Bar Switch 20K ต่างจากพอตใช้แล้วทิ้งยังไง",
          paragraphs: [
            "ESKO BAR ออกแบบให้แบตเตอรี่กับถังน้ำยาแยกจากกัน เวลาน้ำยาหมดหรืออยากเปลี่ยนกลิ่น ก็เปลี่ยนแค่หัวพอต ส่วนตัวเครื่องเก็บไว้ชาร์จแล้วใช้ต่อได้",
            "หัวพอตของรุ่นนี้มีขายแยกที่หน้า [หัวพอต Esko Bar Switch 20K](/products/esko-bar-switch-pod) ถ้ายังลังเลว่าแบบไหนเหมาะกว่า อ่านต่อได้ที่ [พอตใช้แล้วทิ้ง กับ พอตเปลี่ยนหัว](/guides/disposable-vs-switch-pod)",
          ],
        },
        {
          heading: "Esko Bar Switch 20K ปรับอะไรได้บ้าง",
          paragraphs: [
            "เครื่องมีสองโหมดให้เลือก กดปุ่มเดียวก็สลับได้ ทาง ESKO BAR อธิบายว่าโหมด High ให้รสเข้มกว่า ส่วนโหมด Low สูบแล้วนุ่มกว่า",
            "ที่ก้นตัวเครื่องมีปุ่มหมุนปรับลม 3 ระดับ ตั้งแต่ลมแน่นไปจนถึงลมโล่ง เลือกได้ตามแนวการสูบที่ชอบ",
          ],
        },
        {
          heading: "หน้าจอของ Esko Bar Switch 20K บอกอะไร",
          paragraphs: [
            "หน้าจอดิจิทัลบนตัวเครื่องบอกระดับแบตกับโหมดที่กำลังใช้อยู่ ส่วนที่ก้นตัวเครื่องมีวงไฟประดับอยู่ด้วย",
          ],
        },
        {
          heading: "ในกล่อง Esko Bar Switch 20K มีอะไรบ้าง",
          paragraphs: [
            "ตามรายการที่ ESKO BAR ลงไว้ ในกล่องมีตัวเครื่อง สายคล้องคอ และหัวพอต อย่างละหนึ่งชิ้น",
            "หัวพอตที่ให้มาเป็นแบบคอยล์คู่ ร้อนพร้อมกันทั้งสองตัว ESKO BAR บอกว่าช่วยให้ได้ไอมากขึ้น และรสชาติออกมาคงที่",
          ],
        },
      ],
      faq: [
        {
          question: "Esko Bar Switch 20K ใช้หัวพอตแบบไหน",
          answer: "ใช้หัวพอต Esko Bar Switch 20K ค่ะ ESKO BAR ระบุว่าหัวหนึ่งมีน้ำยา 18mL สูบได้สูงสุด 20,000 พัฟ ส่วนที่สูบได้จริงขึ้นกับการสูบของแต่ละคนนะคะ",
        },
        {
          question: "Esko Bar Switch 20K แบตกี่ mAh",
          answer: "แบตเตอรี่อยู่ในตัวเครื่อง ความจุ 850mAh และชาร์จซ้ำได้ค่ะ",
        },
      ],
    },
    en: {
      lede: "The Esko Bar Switch 20K is ESKO BAR's switch-style device: the body and the pod are separate, so when the e-liquid runs out you change only the pod. Below is a summary from ESKO BAR's own page of what you can adjust and what comes in the box.",
      sections: [
        {
          heading: "How is the Esko Bar Switch 20K different from a disposable?",
          paragraphs: [
            "ESKO BAR keeps the battery and the e-liquid tank separate. When the e-liquid runs out or you want another flavour, you change only the pod and keep the device to recharge and use again.",
            "Its pods are sold separately on the [Esko Bar Switch 20K pod](/products/esko-bar-switch-pod) page.",
          ],
        },
        {
          heading: "What can you adjust on the Esko Bar Switch 20K?",
          paragraphs: [
            "One button switches between High and Low mode. ESKO BAR describes High as the bolder flavour and Low as the smoother draw.",
            "A dial at the base turns the airflow through three settings, from a tight draw to a wide-open one, to suit how you like to vape.",
          ],
        },
        {
          heading: "What does the Esko Bar Switch 20K screen show?",
          paragraphs: [
            "The digital screen shows the battery level and the mode in use, and an ambient light ring circles the base.",
          ],
        },
        {
          heading: "What comes in the Esko Bar Switch 20K box?",
          paragraphs: [
            "According to ESKO BAR's packing list, the box holds one device, one lanyard and one pod.",
            "The pod in the box has two coils that heat at once, which ESKO BAR says gives more vapour and a steady flavour.",
          ],
        },
      ],
      faq: [
        {
          question: "Which pod does the Esko Bar Switch 20K take?",
          answer: "It takes the Esko Bar Switch 20K pod. ESKO BAR states one pod holds 18mL of e-liquid and gives up to 20,000 puffs; what you actually get depends on how you vape.",
        },
        {
          question: "What battery does the Esko Bar Switch 20K have?",
          answer: "The device has a built-in, rechargeable 850mAh battery.",
        },
      ],
    },
    zh: {
      lede: "Esko Bar Switch 20K 是 ESKO BAR 的换弹式主机，主机和烟弹分开，烟油用完只需换烟弹。下面根据 ESKO BAR 自己的网页，介绍这款主机可以调节什么、盒内有什么。",
      sections: [
        {
          heading: "Esko Bar Switch 20K 和一次性电子烟有什么不同？",
          paragraphs: [
            "ESKO BAR 把电池和烟油仓分开设计。烟油用完或想换口味时，只换烟弹，主机留着充电继续用。",
            "这款主机的烟弹另有单独出售，详见 [Esko Bar Switch 20K 烟弹](/products/esko-bar-switch-pod) 页面。",
          ],
        },
        {
          heading: "Esko Bar Switch 20K 可以调节什么？",
          paragraphs: [
            "一个按键即可在 High 和 Low 模式之间切换。ESKO BAR 说明 High 口味更浓，Low 抽起来更柔顺。",
            "机身底部有旋钮，可调三档进气，从紧到松，按自己的抽吸习惯选择。",
          ],
        },
        {
          heading: "Esko Bar Switch 20K 的屏幕显示什么？",
          paragraphs: [
            "主机的数字屏幕会显示电量和当前模式，底部还有一圈氛围灯。",
          ],
        },
        {
          heading: "Esko Bar Switch 20K 盒内有什么？",
          paragraphs: [
            "根据 ESKO BAR 列出的包装清单，盒内有主机、挂绳和烟弹各一件。",
            "盒内附带的烟弹采用双线圈同时加热，ESKO BAR 表示这样烟雾更多，口味更稳定。",
          ],
        },
      ],
      faq: [
        {
          question: "Esko Bar Switch 20K 用哪种烟弹？",
          answer: "使用 Esko Bar Switch 20K 烟弹。ESKO BAR 标明每颗装有 18mL 烟油，最多可抽 20,000 口；实际口数取决于个人的抽吸习惯。",
        },
        {
          question: "Esko Bar Switch 20K 电池容量多大？",
          answer: "主机内置 850mAh 可充电电池。",
        },
      ],
    },
  },
  "esko-bar-switch-pod": {
    th: {
      lede: "หัวพอต Esko Bar Switch 20K ของ ESKO BAR เป็นหัวพอตบรรจุสำเร็จ แต่ละหัวมีน้ำยาของกลิ่นที่เลือกกับคอยล์คู่มาในตัว ด้านล่างสรุปจากหน้าเว็บของ ESKO BAR พร้อมแบ่งกลิ่นเป็นแนวไว้ให้เลือกง่ายขึ้น",
      sections: [
        {
          heading: "หัวพอต Esko Bar Switch 20K สลับกลิ่นยังไง",
          paragraphs: [
            "ESKO BAR ออกแบบให้ถังน้ำยาแยกจากแบตเตอรี่ และเรียกระบบนี้ว่าการเปลี่ยนหัวพอตแบบรวดเร็ว",
            "พอน้ำยาหมดก็ถอดหัวเก่าออกแล้วใส่หัวใหม่ได้เลย ถ้าซื้อไว้หลายกลิ่น ก็สลับกลิ่นกันได้โดยใช้ตัวเครื่องเดิม",
          ],
        },
        {
          heading: "หัวพอต Esko Bar Switch 20K หัวหนึ่งใช้ได้นานแค่ไหน",
          paragraphs: [
            "ถังน้ำยาในหัวหนึ่งจุ 18mL ESKO BAR บอกว่าช่วยให้เปลี่ยนหัวห่างขึ้น ส่วนจะใช้ได้กี่วันนั้น ขึ้นกับการสูบของแต่ละคน",
            "ข้างในเป็นคอยล์คู่ที่ร้อนพร้อมกันทั้งสองตัว ทาง ESKO BAR บอกว่าช่วยให้ได้ไอมากขึ้น และรสชาติออกมาคงที่",
          ],
        },
        {
          heading: "หัวพอต Esko Bar Switch 20K มีกลิ่นอะไรบ้าง",
          paragraphs: [
            "หน้าเว็บของ ESKO BAR ลงหัวพอตรุ่นนี้ไว้ 20 กลิ่น ถ้าแบ่งตามชื่อกลิ่นจะได้ 3 แนว",
            "สายเย็น ชื่อกลิ่นมีคำว่า Mint · Ice หรือ Menthol ได้แก่ Cool Mint · Chocolate Mint · Watermelon Ice และ Extra Menthol",
            "สายผลไม้ ได้แก่ Apple Aloe · Blueberry · Coconut · Grape · Honeydew · Lychee · Mango · Mix Berry · Pineapple · Pink Guava · Strawberry · Strawberry Banana และ Watermelon Lime",
            "แนวอื่นมี Blueberry Jam · Cola และ Yogurt",
            "ยังไม่แน่ใจว่าจะเริ่มจากแนวไหน อ่านวิธีเลือกกลิ่นได้ที่ [พอตกลิ่นไหนดี](/guides/choosing-a-pod-flavor)",
          ],
        },
      ],
      faq: [
        {
          question: "หัวพอต Esko Bar Switch 20K ใส่เครื่องอะไร",
          answer: "ใช้กับเครื่อง [Esko Bar Switch 20K](/products/pod-159) ค่ะ",
        },
        {
          question: "หัวพอต Esko Bar Switch 20K สูบได้กี่พัฟ",
          answer: "ESKO BAR ระบุว่าหัวหนึ่งสูบได้สูงสุด 20,000 พัฟค่ะ ส่วนที่สูบได้จริงขึ้นกับการสูบของแต่ละคนนะคะ",
        },
        {
          question: "หัวพอต Esko Bar Switch 20K ต้องเติมน้ำยาเองไหม",
          answer: "หัวพอตมีน้ำยามาในตัวแล้ว ใช้หมดก็เปลี่ยนเป็นหัวใหม่ได้เลยค่ะ",
        },
      ],
    },
    en: {
      lede: "The Esko Bar Switch 20K pod is ESKO BAR's prefilled pod: each one holds the e-liquid of the flavour you pick, with two coils built in. Below is a summary from ESKO BAR's own page, with the flavours grouped to make choosing easier.",
      sections: [
        {
          heading: "How do you switch flavours with the Esko Bar Switch 20K pod?",
          paragraphs: [
            "ESKO BAR keeps the e-liquid tank separate from the battery and calls this quick pod-swap.",
            "When a pod runs out, take it off and put a new one on. With several flavours at hand, you can move between them on the same device.",
          ],
        },
        {
          heading: "How long does one Esko Bar Switch 20K pod last?",
          paragraphs: [
            "Each pod holds 18mL of e-liquid, which ESKO BAR says means changing pods less often. How many days one lasts depends on how often you vape.",
            "Inside, two coils heat at once, which ESKO BAR says gives more vapour and a steady flavour.",
          ],
        },
        {
          heading: "Which flavours does the Esko Bar Switch 20K pod come in?",
          paragraphs: [
            "ESKO BAR's page lists 20 flavours for this pod. Grouped by name, they fall into three sets.",
            "Cool, with Mint, Ice or Menthol in the name: Cool Mint, Chocolate Mint, Watermelon Ice and Extra Menthol.",
            "Fruit: Apple Aloe, Blueberry, Coconut, Grape, Honeydew, Lychee, Mango, Mix Berry, Pineapple, Pink Guava, Strawberry, Strawberry Banana and Watermelon Lime.",
            "Others: Blueberry Jam, Cola and Yogurt.",
          ],
        },
      ],
      faq: [
        {
          question: "Which device does the Esko Bar Switch 20K pod fit?",
          answer: "It fits the [Esko Bar Switch 20K](/products/pod-159).",
        },
        {
          question: "How many puffs does one Esko Bar Switch 20K pod give?",
          answer: "ESKO BAR states one pod gives up to 20,000 puffs; what you actually get depends on how you vape.",
        },
        {
          question: "Do you refill the Esko Bar Switch 20K pod yourself?",
          answer: "No, it comes filled. When it runs out, put on a new pod.",
        },
      ],
    },
    zh: {
      lede: "Esko Bar Switch 20K 烟弹是 ESKO BAR 的预灌装烟弹，每颗都装有所选口味的烟油，并内置双线圈。下面根据 ESKO BAR 自己的网页整理，并把口味分类，方便挑选。",
      sections: [
        {
          heading: "Esko Bar Switch 20K 烟弹怎么换口味？",
          paragraphs: [
            "ESKO BAR 把烟油仓和电池分开设计，并称之为快速换弹。",
            "烟油用完时，取下旧烟弹、换上新的即可；手边备几种口味，就能用同一台主机轮换着抽。",
          ],
        },
        {
          heading: "一颗 Esko Bar Switch 20K 烟弹能用多久？",
          paragraphs: [
            "每颗烟弹装有 18mL 烟油，ESKO BAR 表示这样可以减少换弹次数。一颗能用几天，取决于抽的频率。",
            "内部双线圈同时加热，ESKO BAR 表示这样烟雾更多，口味更稳定。",
          ],
        },
        {
          heading: "Esko Bar Switch 20K 烟弹有哪些口味？",
          paragraphs: [
            "ESKO BAR 网页列出这款烟弹的 20 种口味，按名称可分为三类。",
            "清凉系（名称带 Mint、Ice 或 Menthol）：Cool Mint、Chocolate Mint、Watermelon Ice、Extra Menthol。",
            "水果系：Apple Aloe、Blueberry、Coconut、Grape、Honeydew、Lychee、Mango、Mix Berry、Pineapple、Pink Guava、Strawberry、Strawberry Banana、Watermelon Lime。",
            "其他：Blueberry Jam、Cola、Yogurt。",
          ],
        },
      ],
      faq: [
        {
          question: "Esko Bar Switch 20K 烟弹适用于哪款主机？",
          answer: "适用于 [Esko Bar Switch 20K](/products/pod-159)。",
        },
        {
          question: "一颗 Esko Bar Switch 20K 烟弹能抽多少口？",
          answer: "ESKO BAR 标明每颗最多可抽 20,000 口；实际口数取决于个人的抽吸习惯。",
        },
        {
          question: "Esko Bar Switch 20K 烟弹需要自己加烟油吗？",
          answer: "不需要，烟弹出厂已装好烟油，用完换一颗新的即可。",
        },
      ],
    },
  },
  "esko-bar-20k": {
    th: {
      lede: "ESKO BAR 20000 เป็นพอตใช้แล้วทิ้งของ ESKO BAR ซึ่งบนเว็บของแบรนด์ใช้ชื่อรุ่นว่า ESKO BAR 498 ด้านล่างสรุปจากหน้าเว็บนั้นไว้ให้ ว่าเครื่องนี้ชาร์จได้ไหมและใช้คอยล์แบบไหน พร้อมแบ่งกลิ่นที่มีให้เลือกบนหน้านี้เป็นแนว",
      sections: [
        {
          heading: "ESKO BAR 20000 ชาร์จได้ไหม",
          paragraphs: [
            "ชาร์จได้ แบตเตอรี่อยู่ในตัวเครื่อง ESKO BAR ระบุว่าเป็นแบตความหนาแน่นสูงที่ชาร์จได้เร็ว ถ้าแบตหมดก่อนน้ำยา ก็เสียบชาร์จแล้วสูบต่อจนน้ำยาหมดได้",
            "เครื่องหนึ่งใช้ได้กี่วันก็ขึ้นกับว่าสูบบ่อยแค่ไหน ร้านเล่าไว้ละเอียดที่ [พอตใช้แล้วทิ้ง ใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts)",
          ],
        },
        {
          heading: "ESKO BAR 20000 ใช้คอยล์แบบไหน",
          paragraphs: [
            "ข้างในเป็นคอยล์ mesh คู่ ค่า 1.0 โอห์ม ESKO BAR บอกว่าคอยล์นี้ช่วยให้รสและกลิ่นของน้ำยาชัดขึ้น และเป็นคอยล์ mesh แบบมีส่วนทำความร้อนในตัว",
            "ตามสเปกที่ ESKO BAR ลงไว้ ตัวเครื่องมีขนาด 126 × 30 × 30 mm และทำจาก PCTG · PC กับสเตนเลส",
          ],
        },
        {
          heading: "ESKO BAR 20000 มีกลิ่นอะไรบ้าง",
          paragraphs: [
            "บนหน้านี้มีให้เลือก 22 กลิ่น ในจำนวนนี้ 15 กลิ่นตรงกับที่ ESKO BAR ลงไว้บนหน้าเว็บของแบรนด์ ถ้าแบ่งตามชื่อกลิ่นจะได้ 4 แนว",
            "สายเย็น ชื่อกลิ่นมีคำว่า Ice · Mint หรือ Menthol ได้แก่ Blueberry Ice · Watermelon Ice · Double Mint และ Extra Menthol 5%",
            "สายองุ่น ได้แก่ Purple Grape · Grape และ Berry Grape",
            "สายผลไม้อื่น ได้แก่ Apple Aloe · E-Melon · Lychee · Mango · Mixberry · Pink Guava · Sour Strawberry · Strawberry Banana · Strawberry Kiwi และ Watermelon Strawberry",
            "แนวอื่นมี Banana Icecream · Bubblegum · Cola · Mineral และ Red Lemon Soda",
            "ยังไม่แน่ใจว่าจะเริ่มจากแนวไหน อ่านวิธีเลือกกลิ่นได้ที่ [พอตกลิ่นไหนดี](/guides/choosing-a-pod-flavor)",
          ],
        },
      ],
      faq: [
        {
          question: "ESKO BAR 20000 นิโคตินกี่ %",
          answer: "ESKO BAR ระบุความเข้มข้นนิโคตินไว้ 3% ค่ะ",
        },
        {
          question: "ESKO BAR 20K เปลี่ยนหัวได้ไหม",
          answer: "รุ่นนี้เปลี่ยนหัวไม่ได้ค่ะ ESKO BAR 20000 เป็นพอตใช้แล้วทิ้ง ใช้จนน้ำยาหมดแล้วเปลี่ยนทั้งเครื่อง ถ้าอยากเก็บตัวเครื่องไว้ใช้ต่อแล้วเปลี่ยนแค่หัว รุ่นที่ทำแบบนั้นได้คือ [Esko Bar Switch 20K](/products/pod-159) ค่ะ",
        },
        {
          question: "ESKO BAR 20K กลิ่นไหนดี",
          answer: "ไม่มีคำตอบเดียวค่ะ ขึ้นอยู่กับว่าชอบแนวไหน ลองเริ่มจากสายที่ชอบก่อน เย็น องุ่น ผลไม้ หรือแนวอื่น รายชื่อแต่ละสายอยู่ในหัวข้อ “ESKO BAR 20000 มีกลิ่นอะไรบ้าง” ด้านบนค่ะ",
        },
        {
          question: "ESKO BAR 20K ต้องเติมน้ำยาไหม",
          answer: "ไม่ต้องเติมค่ะ รุ่นนี้เป็นพอตใช้แล้วทิ้งที่มีน้ำยาบรรจุมาในเครื่องแล้วค่ะ",
        },
      ],
    },
    en: {
      lede: "The ESKO BAR 20000 is ESKO BAR's disposable, listed on the brand's own site as the ESKO BAR 498. Below is a summary from that page of whether it recharges and which coil it uses, followed by the flavours on this page in groups.",
      sections: [
        {
          heading: "Can you recharge the ESKO BAR 20000?",
          paragraphs: [
            "Yes. The battery is built in, and ESKO BAR calls it a high-density battery that charges fast. If the battery runs out before the e-liquid, plug it in and keep vaping until the e-liquid is gone.",
            "How many days one lasts depends on how often you vape.",
          ],
        },
        {
          heading: "Which coil does the ESKO BAR 20000 use?",
          paragraphs: [
            "Inside is a 1.0Ω dual mesh coil, which ESKO BAR says brings out a clearer flavour and aroma; ESKO BAR describes it as a mesh coil with integrated heating.",
            "Per ESKO BAR's spec list, the body measures 126 × 30 × 30 mm and is made of PCTG, PC and stainless steel.",
          ],
        },
        {
          heading: "Which flavours does the ESKO BAR 20000 come in?",
          paragraphs: [
            "This page offers 22 flavours, 15 of which match the ones ESKO BAR lists on its own site. Grouped by name, they fall into four sets.",
            "Cool, with Ice, Mint or Menthol in the name: Blueberry Ice, Watermelon Ice, Double Mint and Extra Menthol 5%.",
            "Grape: Purple Grape, Grape and Berry Grape.",
            "Other fruit: Apple Aloe, E-Melon, Lychee, Mango, Mixberry, Pink Guava, Sour Strawberry, Strawberry Banana, Strawberry Kiwi and Watermelon Strawberry.",
            "Others: Banana Icecream, Bubblegum, Cola, Mineral and Red Lemon Soda.",
          ],
        },
      ],
      faq: [
        {
          question: "What is the nicotine strength of the ESKO BAR 20000?",
          answer: "ESKO BAR lists a nicotine strength of 3%.",
        },
        {
          question: "Can you change the pod on the ESKO BAR 20K?",
          answer: "No. The ESKO BAR 20000 is a disposable: you use it until the e-liquid runs out, then replace the whole device. If you'd rather keep the device and change only the pod, that's the [Esko Bar Switch 20K](/products/pod-159).",
        },
        {
          question: "Which ESKO BAR 20K flavour should I pick?",
          answer: "There's no single answer; it depends on what you enjoy. Start with a group you like, cool, grape, fruit or other, then look through the names under “Which flavours does the ESKO BAR 20000 come in?” above.",
        },
        {
          question: "Do you need to refill the ESKO BAR 20K?",
          answer: "No. It's a disposable that comes filled with e-liquid.",
        },
      ],
    },
    zh: {
      lede: "ESKO BAR 20000 是 ESKO BAR 的一次性电子烟，品牌官网上的型号名为 ESKO BAR 498。下面根据该网页介绍它能否充电、用什么线圈，并把本页的口味分类列出。",
      sections: [
        {
          heading: "ESKO BAR 20000 可以充电吗？",
          paragraphs: [
            "可以。电池内置于机身，ESKO BAR 称之为高密度电池，充电速度快。如果电池比烟油先用完，充上电就能继续抽，直到烟油用完。",
            "一支能用几天，取决于抽的频率。",
          ],
        },
        {
          heading: "ESKO BAR 20000 用什么线圈？",
          paragraphs: [
            "内部是 1.0Ω 的 dual mesh 线圈，ESKO BAR 表示能让口味和香气更清晰，并称之为集成加热的 mesh 线圈。",
            "根据 ESKO BAR 列出的规格，机身尺寸为 126 × 30 × 30 mm，材质为 PCTG、PC 和不锈钢。",
          ],
        },
        {
          heading: "ESKO BAR 20000 有哪些口味？",
          paragraphs: [
            "本页共有 22 种口味，其中 15 种与 ESKO BAR 官网列出的一致，按名称可分为四类。",
            "清凉系（名称带 Ice、Mint 或 Menthol）：Blueberry Ice、Watermelon Ice、Double Mint、Extra Menthol 5%。",
            "葡萄系：Purple Grape、Grape、Berry Grape。",
            "其他水果：Apple Aloe、E-Melon、Lychee、Mango、Mixberry、Pink Guava、Sour Strawberry、Strawberry Banana、Strawberry Kiwi、Watermelon Strawberry。",
            "其他：Banana Icecream、Bubblegum、Cola、Mineral、Red Lemon Soda。",
          ],
        },
      ],
      faq: [
        {
          question: "ESKO BAR 20000 的尼古丁浓度是多少？",
          answer: "ESKO BAR 标注的尼古丁浓度为 3%。",
        },
        {
          question: "ESKO BAR 20K 可以换烟弹吗？",
          answer: "这款不能换烟弹。ESKO BAR 20000 是一次性电子烟，烟油用完后整支更换。如果想保留主机、只换烟弹，可以看 [Esko Bar Switch 20K](/products/pod-159)。",
        },
        {
          question: "ESKO BAR 20K 哪个口味好？",
          answer: "没有标准答案，取决于个人喜好。可以先选喜欢的类别：清凉、葡萄、水果或其他，各类口味见上方“ESKO BAR 20000 有哪些口味？”。",
        },
        {
          question: "ESKO BAR 20K 需要自己加烟油吗？",
          answer: "不需要。这是一款出厂已装好烟油的一次性电子烟。",
        },
      ],
    },
  },
  // Site-wide template round batch 4a (06/10): from JOIWAY's own F3 posters; Thai = thai-copy 06/10.
  "joiway-f3": {
    th: {
      lede: "ด้านล่างไล่ดู JOIWAY F3 ทีละส่วนจากโปสเตอร์ของ JOIWAY เอง พร้อมบอกว่าแต่ละส่วนช่วยอะไรในการใช้งาน",
      sections: [
        {
          heading: "สูบได้กี่พัฟ และมีกลิ่นอะไรให้เลือกบ้าง",
          paragraphs: [
            "ตามโปสเตอร์หลักของ JOIWAY สูบได้ 12,000+ พัฟ ส่วนกลิ่นที่ JOIWAY มีให้เลือก เรารวมไว้ในตารางกลิ่นด้านบนแล้ว"
          ]
        }
      ]
    },
    en: {
      lede: "Below, a look at the JOIWAY F3 one part at a time, taken from JOIWAY's own posters.",
      sections: [
        {
          heading: "How many puffs, and which flavours?",
          paragraphs: [
            "JOIWAY's main poster gives 12,000+ puffs. The flavours JOIWAY offers are in the grid above."
          ]
        }
      ]
    },
    zh: {
      lede: "下面根据 JOIWAY 自己的海报，逐项来看 JOIWAY F3。",
      sections: [
        {
          heading: "多少口？有哪些口味？",
          paragraphs: [
            "JOIWAY 主海报标注 12,000+ 口。JOIWAY 提供的口味都在上方的口味表里。"
          ]
        }
      ]
    },
  },
  // Round "queue 0211" articles, RELX (02/11): the two published RELX pages, from RELX's own pages — R2 relxnow.com/products/
  // essential-device · R7 relxnow.com/products/relx-pod-pro · R6 relxnow.my/products/relx-pod-pro-2-fresh-peach (RELX Malaysia) ·
  // R1 relxnow.com/products/relx-infinity-2-plus-device. RELX's own figures that have no spec row (55 °C · 0.2 s · 6–7.5 mg ·
  // 11 layers · 500 vs 600 puffs) are told without the number; thai-copy 02/11.
  "relx-essential-2": {
    th: {
      lede: "RELX Essential 2 เป็นเครื่องระบบสวิตช์ ใช้คู่กับหัวพอตบรรจุสำเร็จ ด้านล่างเป็นข้อมูลจากเว็บของ RELX ตั้งแต่หัวพอตที่ใช้ได้ไปจนถึงการชาร์จ",
      sections: [
        {
          heading: "RELX Essential 2 ใช้กับหัวพอตรุ่นไหน",
          paragraphs: [
            "RELX ระบุว่าเครื่องนี้ใช้ได้กับหัวพอต RELX Pod และ RELX Pod Pro ซึ่งเป็นหัวพอตทรงสมมาตรทั้งสองรุ่น",
            "หน้าเว็บของ RELX บอกด้วยว่า Pod Pro ใส่เครื่อง [RELX Infinity 2 Plus](/products/relx-infinity-2-plus) ได้เช่นกัน",
          ],
        },
        {
          heading: "RELX Pod กับ RELX Pod Pro ต่างกันตรงไหน",
          paragraphs: [
            "RELX Pod Pro ใช้คอยล์เซรามิก ส่วน RELX Pod ใช้คอยล์สำลี",
            "RELX บอกด้วยว่า Pod Pro ปรับมาให้กันรั่วได้ดีขึ้น",
          ],
        },
        {
          heading: "สูบแล้วเป็นยังไง",
          paragraphs: [
            "เครื่องนี้ใช้ระบบที่ RELX เรียกว่า Super Smooth ซึ่งคุมไอไม่ให้ร้อนเกินไป เพื่อช่วยเลี่ยงรสไหม้",
            "RELX บอกด้วยว่าพอเริ่มสูบ เครื่องก็ทำงานแทบจะทันที และแต่ละพัฟให้ไอแน่น",
          ],
        },
        {
          heading: "ออกแบบให้กันรั่วยังไง",
          paragraphs: [
            "RELX ออกแบบด้านในเป็นโครงสร้างซ้อนกันหลายชั้น เพื่อช่วยกันน้ำยารั่ว และกันไม่ให้หยดน้ำยาไปเกาะค้างอยู่ข้างใน",
          ],
        },
        {
          heading: "ชาร์จยังไง",
          paragraphs: [
            "RELX ระบุแบตเตอรี่ไว้ที่ 380mAh และชาร์จซ้ำได้ผ่านช่อง USB-C",
            "เรื่องชาร์จนานแค่ไหนและดูแลแบตยังไง ร้านเล่าไว้ที่[ชาร์จพอตกี่นาที ชาร์จข้ามคืนได้ไหม](/guides/battery-care-and-charging)",
          ],
        },
      ],
      faq: [
        {
          question: "RELX Essential 2 มีสีอะไรบ้าง",
          answer: "ร้านมีให้เลือก Black · Grey · Orange · Steel Silver และ Nebula Blue ค่ะ",
        },
        {
          question: "RELX Essential 2 ต้องเติมน้ำยาเองไหม",
          answer: "ไม่ต้องเติมค่ะ หัวพอตที่ใช้กับเครื่องนี้มีน้ำยามาในตัวแล้ว ใช้หมดก็เปลี่ยนเป็นหัวใหม่ได้เลยค่ะ",
        },
        {
          question: "RELX Essential 2 ใส่หัว RELX Infinity Pro 2 ได้ไหม",
          answer: "RELX ระบุว่าเครื่องนี้ใช้กับหัวพอต RELX Pod และ RELX Pod Pro ส่วนหัว [RELX Infinity Pro 2](/products/relx-infinity-pro-2-pod) ที่แพ็กพิมพ์ชื่อ RELX Pod Pro 2 ไม่ได้อยู่ในรายชื่อนี้ค่ะ",
        },
      ],
    },
    en: {
      lede: "The RELX Essential 2 is a switch-style device that takes prefilled pods. Below is what RELX's own page says about it, from the pods it takes to how it charges.",
      sections: [
        {
          heading: "Which pods does the RELX Essential 2 take?",
          paragraphs: [
            "RELX lists two pods for it, RELX Pod and RELX Pod Pro, both of a symmetrical design.",
            "RELX's page adds that the RELX Pod Pro also fits the [RELX Infinity 2 Plus](/products/relx-infinity-2-plus).",
          ],
        },
        {
          heading: "RELX Pod or RELX Pod Pro: what's the difference?",
          paragraphs: [
            "They use different coils: the RELX Pod Pro has a ceramic coil and the RELX Pod a cotton one. RELX also says the Pod Pro has improved leak resistance.",
          ],
        },
        {
          heading: "What is it like to vape?",
          paragraphs: [
            "It uses what RELX calls Super Smooth, which keeps the vapour from running too hot to help avoid a burnt taste.",
            "RELX also says it fires almost the instant you draw, with dense vapour in every puff.",
          ],
        },
        {
          heading: "How is it built against leaks?",
          paragraphs: [
            "RELX builds the inside in several layers, to help keep e-liquid from leaking and droplets from collecting inside.",
          ],
        },
        {
          heading: "How do you charge it?",
          paragraphs: [
            "It has a 380mAh battery that recharges over USB-C.",
          ],
        },
      ],
      faq: [
        {
          question: "Which colours does the RELX Essential 2 come in?",
          answer: "The shop lists Black, Steel Silver, Grey, Nebula Blue and Orange.",
        },
        {
          question: "Do I need to fill the RELX Essential 2 with e-liquid?",
          answer: "No. Its pods come filled, so when one runs out you simply put on a new one.",
        },
        {
          question: "Does the RELX Essential 2 take the RELX Infinity Pro 2 pod?",
          answer: "RELX lists two pods for this device, RELX Pod and RELX Pod Pro. RELX Pod Pro 2, the name printed on the [RELX Infinity Pro 2](/products/relx-infinity-pro-2-pod) pack, is not on that list.",
        },
      ],
    },
    zh: {
      lede: "RELX Essential 2 是一款换弹式主机，搭配预灌装烟弹使用。下面根据 RELX 官网的介绍，从适用的烟弹一直讲到充电方式。",
      sections: [
        {
          heading: "RELX Essential 2 适用哪些烟弹？",
          paragraphs: [
            "RELX 标明它适用 RELX Pod 和 RELX Pod Pro 两款烟弹，两款都是对称式设计。",
            "RELX 官网还表示，RELX Pod Pro 也适用于 [RELX Infinity 2 Plus](/products/relx-infinity-2-plus)。",
          ],
        },
        {
          heading: "RELX Pod 和 RELX Pod Pro 有什么不同？",
          paragraphs: [
            "两款的线圈不同：RELX Pod Pro 用陶瓷线圈，RELX Pod 用棉芯线圈。RELX 还表示，Pod Pro 的防漏性能做了优化。",
          ],
        },
        {
          heading: "抽起来怎么样？",
          paragraphs: [
            "它采用 RELX 称为 Super Smooth 的技术，让烟雾温度不会过高，帮助避免焦味。",
            "RELX 还表示，一吸几乎立即启动，每一口烟雾都很饱满。",
          ],
        },
        {
          heading: "防漏是怎么设计的？",
          paragraphs: [
            "RELX 把内部设计成多层结构，帮助防止漏油，也避免油滴凝结在内部。",
          ],
        },
        {
          heading: "怎么充电？",
          paragraphs: [
            "主机配备 380mAh 电池，可通过 USB-C 充电。",
          ],
        },
      ],
      faq: [
        {
          question: "RELX Essential 2 有哪些颜色？",
          answer: "本店列出的颜色有 Black、Steel Silver、Grey、Nebula Blue 和 Orange。",
        },
        {
          question: "RELX Essential 2 需要自己加烟油吗？",
          answer: "不需要。适用的烟弹出厂已装好烟油，用完换一颗新的即可。",
        },
        {
          question: "RELX Essential 2 能用 RELX Infinity Pro 2 烟弹吗？",
          answer: "RELX 官网为这台主机标明的适用烟弹是 RELX Pod 和 RELX Pod Pro 两款。[RELX Infinity Pro 2](/products/relx-infinity-pro-2-pod) 包装上印的名称 RELX Pod Pro 2 不在这份列表里。",
        },
      ],
    },
  },
  "relx-infinity-pro-2-pod": {
    th: {
      lede: "หัวพอต RELX Infinity Pro 2 มีน้ำยามาในตัว แพ็กและหน้าเว็บของ RELX ใช้ชื่อว่า RELX Pod Pro 2 ด้านล่างสรุปว่าหัวนี้ใช้กับโหมดไหนของเครื่อง พร้อมจัดกลิ่นเป็นแนวให้เลือกง่ายขึ้น",
      sections: [
        {
          heading: "ใช้ได้กับโหมดไหนของเครื่องบ้าง",
          paragraphs: [
            "RELX ระบุว่าหัวรุ่นนี้รองรับโหมด Eco · Smooth และ Boost ของเครื่อง",
            "RELX อธิบายว่าโหมด Eco สูบเบาลงและช่วยให้แบตอึดขึ้น โหมด Smooth ให้รสที่นุ่ม ส่วนโหมด Boost ให้รสเข้มขึ้นและไอเยอะขึ้น",
          ],
        },
        {
          heading: "หัวพอต RELX Infinity Pro 2 มีกลิ่นอะไรบ้าง",
          paragraphs: [
            "กลิ่นของรุ่นนี้แยกได้เป็นสองกลุ่ม กลุ่มแรกคือกลิ่นที่ชื่อไม่มีคำว่า 50mg ถ้าจัดตามชื่อกลิ่นจะได้ 4 แนว",
            "สายชา ได้แก่ Hibiscus Ice Tea · Iced Black Tea · Jasmine Green Tea · Lemon Ice Tea · Longjing Ice Tea · Oolong Ice Tea และ Thai Milk Tea",
            "สายผลไม้ ได้แก่ Banana Freeze · Blueberry Splash · Fresh Peach · Green Grape Ice · Honeydew Melon · Lemon Zest · Lime Ice · Lychee Ice · Orange Sparkle · Pink Guava · Smooth Mango · Strawberry Burst · Tangy Grape และ Watermelon Ice",
            "สายยาสูบ ได้แก่ Ice Tobacco และ Lime Tobacco",
            "แนวอื่นมี Dark Sparkle · Ludou Ice และ Taro Scoop",
            "อีกกลุ่มคือกลิ่นที่ชื่อลงท้ายด้วย 50mg เป็นแบบนิโคติน 50mg ถ้าจัดตามชื่อกลิ่นก็ได้ 4 แนวเช่นกัน",
            "สายเย็นแบบ 50mg ได้แก่ Spearmint · Peppermint · Lemon Mint · Mint Freeze · Menthol Xtra และ Raspberry Mint",
            "สายยาสูบแบบ 50mg ได้แก่ Classic Tobacco · Mint Tobacco และ Rich Tobacco",
            "สายผลไม้แบบ 50mg ได้แก่ Citrus · Grape · Green Apple · Strawberry · Triple Berry และ Watermelon Ice",
            "แนวอื่นแบบ 50mg มี Ice Sparking",
            "ยังไม่แน่ใจว่าจะเริ่มจากแนวไหน อ่านวิธีเลือกกลิ่นได้ที่ [พอตกลิ่นไหนดี](/guides/choosing-a-pod-flavor)",
          ],
        },
      ],
      faq: [
        {
          question: "หัวพอต RELX Infinity Pro 2 ใช้กับเครื่องอะไร",
          answer: "RELX ระบุว่าหัวรุ่นนี้ใช้กับเครื่อง RELX Infinity 2 และ [RELX Infinity 2 Plus](/products/relx-infinity-2-plus) ได้ค่ะ",
        },
        {
          question: "หัวพอต RELX Infinity Pro 2 ต้องเติมน้ำยาไหม",
          answer: "ไม่ต้องเติมค่ะ หัวพอตมีน้ำยามาในตัวแล้ว หัวละ 1.9mL พอใช้หมดก็ถอดหัวเก่าออกแล้วเปลี่ยนเป็นหัวใหม่ได้เลยค่ะ",
        },
      ],
    },
    en: {
      lede: "The RELX Infinity Pro 2 pod is a prefilled pod. Its pack prints the name RELX Pod Pro 2, the same name RELX uses on its own pages. Below: which of the device's modes it works with, and the flavours grouped by name to make choosing easier.",
      sections: [
        {
          heading: "Which of the device's modes does it work with?",
          paragraphs: [
            "RELX states the pod supports the device's Eco, Smooth and Boost modes.",
            "In RELX's words, Eco gives a lighter puff and longer battery life, Smooth an ultra-smooth taste, and Boost a richer flavour with bigger clouds.",
          ],
        },
        {
          heading: "Which flavours does the RELX Infinity Pro 2 pod come in?",
          paragraphs: [
            "The flavours come in two groups. The first, with no 50mg in the name, sorts by name into four sets.",
            "Tea: Hibiscus Ice Tea, Iced Black Tea, Jasmine Green Tea, Lemon Ice Tea, Longjing Ice Tea, Oolong Ice Tea and Thai Milk Tea.",
            "Fruit: Banana Freeze, Blueberry Splash, Fresh Peach, Green Grape Ice, Honeydew Melon, Lemon Zest, Lime Ice, Lychee Ice, Orange Sparkle, Pink Guava, Smooth Mango, Strawberry Burst, Tangy Grape and Watermelon Ice.",
            "Tobacco: Ice Tobacco and Lime Tobacco.",
            "Others: Dark Sparkle, Ludou Ice and Taro Scoop.",
            "The second group ends in 50mg: these are the 50mg-nicotine pods, and they also sort into four sets.",
            "Mint and menthol, 50mg: Lemon Mint, Menthol Xtra, Mint Freeze, Peppermint, Raspberry Mint and Spearmint.",
            "Tobacco, 50mg: Classic Tobacco, Mint Tobacco and Rich Tobacco.",
            "Fruit, 50mg: Citrus, Grape, Green Apple, Strawberry, Triple Berry and Watermelon Ice.",
            "Others, 50mg: Ice Sparking.",
          ],
        },
      ],
      faq: [
        {
          question: "Which device does the RELX Infinity Pro 2 pod fit?",
          answer: "RELX states it fits the RELX Infinity 2 and the [RELX Infinity 2 Plus](/products/relx-infinity-2-plus).",
        },
        {
          question: "Do I need to fill the RELX Infinity Pro 2 pod with e-liquid?",
          answer: "No. Each pod comes filled with 1.9mL of e-liquid; when it runs out, put on a new one.",
        },
      ],
    },
    zh: {
      lede: "RELX Infinity Pro 2 烟弹是预灌装烟弹，包装上印的名称是 RELX Pod Pro 2，RELX 官网用的也是这个名称。下面介绍它支持主机的哪些模式，并按名称把口味分好类，方便挑选。",
      sections: [
        {
          heading: "支持主机的哪些模式？",
          paragraphs: [
            "RELX 标明这款烟弹支持主机的 Eco、Smooth 和 Boost 模式。",
            "按 RELX 的介绍，Eco 吸感更轻、更省电；Smooth 口感顺滑；Boost 口味更浓、烟雾更多。",
          ],
        },
        {
          heading: "RELX Infinity Pro 2 烟弹有哪些口味？",
          paragraphs: [
            "口味分为两组。第一组是名称不带 50mg 的口味，按名称可分为四类。",
            "茶系：Hibiscus Ice Tea、Iced Black Tea、Jasmine Green Tea、Lemon Ice Tea、Longjing Ice Tea、Oolong Ice Tea、Thai Milk Tea。",
            "水果系：Banana Freeze、Blueberry Splash、Fresh Peach、Green Grape Ice、Honeydew Melon、Lemon Zest、Lime Ice、Lychee Ice、Orange Sparkle、Pink Guava、Smooth Mango、Strawberry Burst、Tangy Grape、Watermelon Ice。",
            "烟草系：Ice Tobacco、Lime Tobacco。",
            "其他：Dark Sparkle、Ludou Ice、Taro Scoop。",
            "另一组是名称以 50mg 结尾的口味，尼古丁浓度为 50mg，按名称同样可分为四类。",
            "50mg 薄荷系：Lemon Mint、Menthol Xtra、Mint Freeze、Peppermint、Raspberry Mint、Spearmint。",
            "50mg 烟草系：Classic Tobacco、Mint Tobacco、Rich Tobacco。",
            "50mg 水果系：Citrus、Grape、Green Apple、Strawberry、Triple Berry、Watermelon Ice。",
            "50mg 其他：Ice Sparking。",
          ],
        },
      ],
      faq: [
        {
          question: "RELX Infinity Pro 2 烟弹适用于哪款主机？",
          answer: "RELX 标明这款烟弹适用于 RELX Infinity 2 和 [RELX Infinity 2 Plus](/products/relx-infinity-2-plus)。",
        },
        {
          question: "RELX Infinity Pro 2 烟弹需要自己加烟油吗？",
          answer: "不需要，每颗烟弹出厂已装有 1.9mL 烟油，用完换一颗新的即可。",
        },
      ],
    },
  },
  // Site-wide template round batch 4c (06/10): from RELX's own Smash Go 12K page; Thai = thai-copy 06/10.
  "relx-smash-go-12k": {
    th: {
      lede: "ด้านล่างไล่ดู RELX Smash Go 12K ทีละส่วนจากภาพของ RELX เอง",
      sections: [
        {
          heading: "ความเข้มข้นมีให้เลือกสองแบบ",
          paragraphs: [
            "RELX ทำ Smash Go 12K ไว้สองแบบ คือ salt nic 3% และ 5% ในตารางกลิ่นด้านบน กลิ่นที่ชื่อลงท้ายด้วย 5% คือแบบ 5%"
          ]
        },
        {
          heading: "RELX Smash Go 12K มีกลิ่นแนวไหนบ้าง",
          paragraphs: [
            "RELX บอกไว้ว่ากลิ่นของรุ่นนี้มีทั้งผลไม้และมินต์เย็น ถ้าแบ่งกลิ่นแบบ 3% ตามชื่อกลิ่น จะได้ 3 แนว",
            "สายเย็น ได้แก่ Double Mint",
            "สายผลไม้ ได้แก่ Apple · Blueberry · Grape · Grape Aloe · Grape Lychee · Green Mango · Lychee · Mixberry · Passion Fruit · Peach Strawberry · Pineapple · Pink Berry · Pink Guava · Strawberry และ Watermelon",
            "แนวอื่นมี Cola · Oolong Tea และ Watermelon Bubblegum",
            "ส่วนแบบ 5% มี Classic Tobacco · Cola · Cool Mint · Double Mint · Grape · Mixberry · Spearmint และ Watermelon",
            "ยังไม่แน่ใจว่าจะเริ่มจากแนวไหน อ่านวิธีเลือกกลิ่นได้ที่ [พอตกลิ่นไหนดี](/guides/choosing-a-pod-flavor)"
          ]
        },
        {
          heading: "คอยล์ของ Smash Go 12K ช่วยอะไร",
          paragraphs: [
            "RELX อธิบายว่าคอยล์รุ่นนี้ช่วยให้รสนุ่มและคงที่ และทำให้น้ำยากลายเป็นไอได้สม่ำเสมอ",
            "เครื่องหนึ่งใช้ได้กี่วันก็ขึ้นกับว่าสูบบ่อยแค่ไหน ร้านเล่าไว้ละเอียดที่ [พอตใช้แล้วทิ้ง ใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts)"
          ]
        }
      ]
    },
    en: {
      lede: "Below, a look at the RELX Smash Go 12K one part at a time, taken from RELX's own pictures.",
      sections: [
        {
          heading: "Two strengths to choose from",
          paragraphs: [
            "RELX makes the Smash Go 12K in two nicotine salt strengths, 3% and 5%. In the flavour grid above, the names ending in 5% are the 5% version."
          ]
        },
        {
          heading: "Which flavours does the RELX Smash Go 12K come in?",
          paragraphs: [
            "RELX describes the range as fruity blends and cool mint options. Grouped by name, the 3% flavours on this page fall into three sets.",
            "Cool: Double Mint.",
            "Fruit: Apple, Blueberry, Grape, Grape Aloe, Grape Lychee, Green Mango, Lychee, Mixberry, Passion Fruit, Peach Strawberry, Pineapple, Pink Berry, Pink Guava, Strawberry and Watermelon.",
            "Others: Cola, Oolong Tea and Watermelon Bubblegum.",
            "The 5% version comes in Classic Tobacco, Cola, Cool Mint, Double Mint, Grape, Mixberry, Spearmint and Watermelon."
          ]
        },
        {
          heading: "What does the Smash Go 12K's coil do?",
          paragraphs: [
            "RELX says this coil gives a smooth, consistent flavour and vaporises the e-liquid evenly.",
            "How many days one lasts depends on how often you vape."
          ]
        }
      ]
    },
    zh: {
      lede: "下面根据 RELX 自己的图片，逐项来看 RELX Smash Go 12K。",
      sections: [
        {
          heading: "两种浓度可选",
          paragraphs: [
            "RELX 的 Smash Go 12K 有 3% 和 5% 两种盐尼古丁浓度。上方口味表里名称带 5% 的，就是 5% 浓度的版本。"
          ]
        },
        {
          heading: "RELX Smash Go 12K 有哪些口味？",
          paragraphs: [
            "RELX 介绍这款有水果和清凉薄荷两类口味。本页的 3% 口味按名称可分为三类。",
            "清凉系：Double Mint。",
            "水果系：Apple、Blueberry、Grape、Grape Aloe、Grape Lychee、Green Mango、Lychee、Mixberry、Passion Fruit、Peach Strawberry、Pineapple、Pink Berry、Pink Guava、Strawberry、Watermelon。",
            "其他：Cola、Oolong Tea、Watermelon Bubblegum。",
            "5% 版本有 Classic Tobacco、Cola、Cool Mint、Double Mint、Grape、Mixberry、Spearmint、Watermelon。"
          ]
        },
        {
          heading: "RELX Smash Go 12K 的线圈有什么作用？",
          paragraphs: [
            "RELX 表示这款线圈让口味顺滑稳定，烟油雾化更均匀。",
            "一支能用几天，取决于抽的频率。"
          ]
        }
      ]
    },
  },
  // Site-wide template round batch 4d (06/10): from RELX's own Creator Pro Device + Creator Pod pages; Thai = thai-copy 06/10.
  "relx-creator": {
    th: {
      lede: "ด้านล่างไล่ดู RELX Creator ทีละส่วนจากภาพของ RELX เอง",
      sections: [
        {
          heading: "หัวพอตที่ทำมาคู่กัน",
          paragraphs: [
            "หัวพอต RELX Creator Pod มีความจุน้ำยา 2+8mL และใช้คอยล์ Dual Mesh ตามที่ RELX ระบุไว้"
          ]
        },
        {
          heading: "บนจอมีอะไรให้ดูบ้าง",
          paragraphs: [
            "นอกจากแบตกับโหมดที่ใช้อยู่ RELX บอกว่าจอพิกเซลของเครื่องนี้มีหน้าอีโมจิ 100+ แบบ ซึ่งปลดล็อกได้เรื่อย ๆ ระหว่างที่สูบ"
          ]
        }
      ]
    },
    en: {
      lede: "Below, the RELX Creator one part at a time, from RELX's own pictures.",
      sections: [
        {
          heading: "The pod made for it",
          paragraphs: [
            "The RELX Creator Pod holds 2+8mL of e-liquid and uses a Dual Mesh coil, according to RELX."
          ]
        },
        {
          heading: "What's on the screen",
          paragraphs: [
            "Besides the battery and the mode you're in, RELX says the pixel screen has 100+ emoji faces that unlock as you puff."
          ]
        }
      ]
    },
    zh: {
      lede: "下面根据 RELX 自己的图片，逐项来看 RELX Creator。",
      sections: [
        {
          heading: "与它配套的烟弹",
          paragraphs: [
            "据 RELX 标注，RELX Creator Pod 容量为 2+8mL，采用 Dual Mesh 线圈。"
          ]
        },
        {
          heading: "屏幕会显示什么",
          paragraphs: [
            "除了电量和当前模式，RELX 表示像素屏上有 100+ 个表情，会随着抽吸逐步解锁。"
          ]
        }
      ]
    },
  },
  // Site-wide template round batch 5a (06/10): from WOTOFO's own nexBAR 18K pages (20mg + 50mg); Thai = thai-copy 06/10.
  "wotofo-nexbar-18k": {
    th: {
      lede: "ด้านล่างไล่ดู WOTOFO nexBAR 18K ทีละส่วนจากภาพของ WOTOFO เอง",
      sections: [
        {
          heading: "ความเข้มข้นที่มีให้เลือก",
          paragraphs: [
            "WOTOFO ทำ nexBAR 18K ออกมาสองความเข้มข้น คือ 20mg และ 50mg และแต่ละความเข้มข้นก็มีกลิ่นให้เลือกแยกกัน เลื่อนขึ้นไปดูรายชื่อกลิ่นได้"
          ]
        },
        {
          heading: "โหมด NORM กับ TURBO ต่างกันตรงไหน",
          paragraphs: [
            "WOTOFO บอกว่าโหมด NORM ให้วัตต์แบบสมดุล เหมาะกับการสูบในชีวิตประจำวัน ส่วนโหมด TURBO จะเพิ่มวัตต์ขึ้น และลมจะมีแรงต้านมากขึ้น ดูดแน่นขึ้น การสลับโหมดทำได้จากปุ่มเปิด-ปิดที่ก้นพอต ระหว่างที่จอติดอยู่ กดปุ่มหนึ่งครั้งก็สลับระหว่าง NORM กับ TURBO ได้ ส่วนการเปิดหรือปิดเครื่อง ให้กดปุ่มเดียวกันค้างไว้ 3 วินาที"
          ]
        }
      ]
    },
    en: {
      lede: "Below, the WOTOFO nexBAR 18K one part at a time, from WOTOFO's own pictures.",
      sections: [
        {
          heading: "Which strength?",
          paragraphs: [
            "WOTOFO makes the nexBAR 18K in two nicotine strengths, 20mg and 50mg, and each comes with its own set of flavours. The flavour list above shows them."
          ]
        },
        {
          heading: "NORM or TURBO: what's the difference?",
          paragraphs: [
            "WOTOFO describes NORM as balanced power for everyday vaping. TURBO raises the power and adds airflow resistance for a tighter draw. To switch between them, press the power button on the base once while the screen is on. To turn the device on or off, hold the same button for 3 seconds."
          ]
        }
      ]
    },
    zh: {
      lede: "下面根据 WOTOFO 自己的图片，逐项来看 WOTOFO nexBAR 18K。",
      sections: [
        {
          heading: "选哪种浓度？",
          paragraphs: [
            "WOTOFO 的 nexBAR 18K 有 20mg 和 50mg 两种尼古丁浓度，每种都有各自的口味。上方的口味列表都列出来了。"
          ]
        },
        {
          heading: "NORM 和 TURBO 有什么不同？",
          paragraphs: [
            "按照 WOTOFO 的说法，NORM 模式输出均衡，适合日常使用；TURBO 模式会提高功率，同时增加进气阻力，吸感更紧。屏幕亮着时，按一下底部的开关键，就能在 NORM 和 TURBO 之间切换。开关机则是长按同一个按键 3 秒。"
          ]
        }
      ]
    },
  },
  // Articles queue 0211 batch 5 (02/11): nexBar CLEAR 18K, no brand (owner 29/09). No maker site — every product fact = the
  // maker's own posters (owner-supplied overview + the 15 per-flavour posters, also carried on ihavevape.net / pod789.com;
  // copies in _incoming/nexbar-clear/src). Taste lines = each poster's tagline. Kyoho Grape · Pineapple · Mango · Cola Lemon =
  // the warehouse list (Max Disposable-46), not on the posters. Clear tank · modes · puffs · battery stay out: the tagline and
  // short description already say them (one fact at most twice, HANDOFF §18). Thai = thai-copy 02/11.
  "pod-180": {
    th: {
      lede: "nexBar CLEAR 18K มีให้เลือก 19 กลิ่นบนหน้านี้ ด้านล่างร้านจัดกลิ่นเป็นสายตามคำบรรยายบนโปสเตอร์ของผู้ผลิต และบอกว่าดูชื่อกลิ่นบนตัวเครื่องได้จากตรงไหน",
      sections: [
        {
          heading: "nexBar CLEAR 18K กลิ่นไหนดี",
          paragraphs: [
            "ผู้ผลิตทำโปสเตอร์แยกให้ทุกกลิ่นในรายการ 15 กลิ่นของรุ่นนี้ และเขียนคำบรรยายรสสั้น ๆ ไว้ใต้ชื่อกลิ่น ร้านจึงจัดสายตามคำบรรยายนั้น",
            "สายเย็นมี Mint ที่ผู้ผลิตบรรยายว่าเย็นและสดชื่น White Slush ที่บรรยายไว้แบบเดียวกัน และ Blueberry ที่เป็นบลูเบอร์รี่เย็น ๆ กับเมนทอล",
            "ถ้าชอบผลไม้ที่เย็นด้วย ก็มี Grape Ice ที่เป็นองุ่นสดกับน้ำแข็ง และ Watermelon Ice ที่เป็นแตงโมฉ่ำ ๆ เย็นแบบน้ำแข็ง",
            "สายผลไม้มี Lychee ลิ้นจี่หวานฉ่ำ Honeydew Melon เมลอนที่ผู้ผลิตบรรยายว่านุ่ม สด และฉ่ำ Grape Lychee องุ่นฉ่ำคู่กับลิ้นจี่ และ Mixberry เบอร์รี่หลายชนิดรวมกัน รสหวานและสดชื่น",
            "สตรอเบอร์รี่คู่กับผลไม้อีกชนิดมีสี่กลิ่น คือ Strawberry Watermelon คู่กับแตงโม Strawberry Kiwi คู่กับกีวีสด Strawberry Banana คู่กับกล้วยที่บรรยายว่าครีมมี่ และ Peach Strawberry คู่กับพีชหวาน",
            "ถ้าชอบรสหวานแนวขนม ก็มี Strawberry Custard ที่เป็นสตรอเบอร์รี่หวานกับคัสตาร์ดเนื้อครีม และ Watermelon Bubblegum แตงโมหวานกับหมากฝรั่ง",
          ],
        },
        {
          heading: "อีก 4 กลิ่นบนหน้านี้",
          paragraphs: [
            "บนหน้านี้ยังมี Kyoho Grape · Pineapple · Mango และ Cola Lemon ให้เลือกด้วย สี่กลิ่นนี้ร้านลงเพิ่มจากรายการของผู้ผลิต และจัดสายตามชื่อกลิ่น",
            "Kyoho Grape คือองุ่นเคียวโฮ ถ้าชอบองุ่น ก็เลือกดูคู่กับ Grape Ice และ Grape Lychee ได้ Pineapple กับ Mango อยู่สายผลไม้ ส่วน Cola Lemon ชื่อบอกว่าเป็นโคล่ากับมะนาว",
            "ถ้ายังเลือกไม่ได้ว่าจะเริ่มจากสายไหน ก็อ่านวิธีเลือกกลิ่นจากชื่อได้ที่ [พอตกลิ่นไหนดี](/guides/choosing-a-pod-flavor)",
          ],
        },
        {
          heading: "ดูชื่อกลิ่นบนตัวเครื่องได้ตรงไหน",
          paragraphs: [
            "ตัวเครื่องครึ่งล่างเป็นสีดำ พิมพ์คำว่า nexBar CLEAR ชื่อกลิ่น และ 18K ไว้ ถ้าซื้อไปหลายกลิ่น ก็ดูจากตรงนี้ได้ว่าเครื่องไหนเป็นกลิ่นอะไร ส่วนคำที่ผู้ผลิตใช้บนโปสเตอร์คือ “STAY LOW. LIVE HIGH.”",
          ],
        },
      ],
      faq: [
        {
          question: "nexBar CLEAR 18K กับ WOTOFO nexBAR 18K เป็นรุ่นเดียวกันไหม",
          answer: "คนละรุ่นค่ะ แม้ชื่อจะคล้ายกัน แต่รุ่นบนหน้านี้คือ nexBar CLEAR 18K ส่วน [WOTOFO nexBAR 18K](/products/wotofo-nexbar-18k) เป็นรุ่นของ WOTOFO ที่มีหน้าแยกของตัวเองค่ะ",
        },
        {
          question: "nexBar CLEAR 18K กลิ่น Blueberry กับ Blueberry Ice คือกลิ่นเดียวกันไหม",
          answer: "กลิ่นเดียวกันค่ะ รายการกลิ่นของผู้ผลิตเขียนว่า Blueberry ส่วนโปสเตอร์ของกลิ่นนี้และตัวเครื่องพิมพ์ชื่อว่า BLUEBERRY ICE บนหน้านี้จึงใช้ชื่อ Blueberry ตามรายการค่ะ",
        },
      ],
    },
    en: {
      lede: "The nexBar CLEAR 18K comes in 19 flavours on this page. Below, we group them using the maker's own poster descriptions and show where the flavour name is printed on the device.",
      sections: [
        {
          heading: "Which nexBar CLEAR 18K flavour should I pick?",
          paragraphs: [
            "The maker gives each of the 15 flavours on its list a poster of its own, with a short taste line under the flavour name. We grouped them from those lines.",
            "The cool ones are Mint and White Slush, both described as cool and refreshing, and Blueberry, cool blueberry with refreshing menthol. For fruit with a chill, Grape Ice is fresh grape with ice and Watermelon Ice is juicy watermelon with icy coolness.",
            "Fruit: Lychee (sweet and juicy), Honeydew Melon (smooth, fresh and juicy), Grape Lychee (juicy grape with lychee) and Mixberry (a burst of mixed berries, sweet and refreshing). Four pair strawberry with another fruit: Strawberry Watermelon with watermelon, Strawberry Kiwi with fresh kiwi, Strawberry Banana with creamy banana, and Peach Strawberry with sweet peach.",
            "For a dessert-style sweet, Strawberry Custard is sweet strawberry with creamy custard, and Watermelon Bubblegum is sweet watermelon with bubblegum.",
          ],
        },
        {
          heading: "The other 4 flavours on this page",
          paragraphs: [
            "We also list Kyoho Grape, Pineapple, Mango and Cola Lemon on this page, added to the maker's list and grouped by name. Kyoho Grape is the Kyoho variety, so if you like grape, look at it alongside Grape Ice and Grape Lychee. Pineapple and Mango are fruit, and Cola Lemon is cola with lemon.",
          ],
        },
        {
          heading: "Where is the flavour name on the device?",
          paragraphs: [
            "The bottom half of the device is black and printed with nexBar CLEAR, the flavour name and 18K, so if you buy several flavours you can tell them apart at a glance. The line on the maker's posters is “STAY LOW. LIVE HIGH.”",
          ],
        },
      ],
      faq: [
        {
          question: "Is the nexBar CLEAR 18K the same as the WOTOFO nexBAR 18K?",
          answer: "No. The names are alike, but this page is the nexBar CLEAR 18K; the [WOTOFO nexBAR 18K](/products/wotofo-nexbar-18k) is a WOTOFO model with its own page.",
        },
        {
          question: "Are Blueberry and Blueberry Ice the same nexBar CLEAR 18K flavour?",
          answer: "Yes. The maker's flavour list says Blueberry, while this flavour's poster and the device print BLUEBERRY ICE. This page follows the list and uses Blueberry.",
        },
      ],
    },
    zh: {
      lede: "本页的 nexBar CLEAR 18K 共有 19 种口味。下面按厂商海报上的口味描述分组，并说明机身上哪里印着口味名称。",
      sections: [
        {
          heading: "nexBar CLEAR 18K 哪个口味好？",
          paragraphs: [
            "厂商为口味清单上的 15 种口味各做了一张海报，口味名称下方有一句简短的口感描述，我们按这些描述来分组。",
            "清凉类有 Mint 和 White Slush，厂商对两者的描述都是清凉提神，还有 Blueberry（清凉蓝莓配清爽薄荷）。想要带凉感的水果，可以选 Grape Ice（新鲜葡萄加冰）或 Watermelon Ice（多汁西瓜，冰爽清凉）。",
            "水果类：Lychee（香甜多汁）、Honeydew Melon（柔和、新鲜、多汁）、Grape Lychee（多汁葡萄配荔枝）和 Mixberry（多种莓果，香甜清爽）。草莓配另一种水果的有四款：Strawberry Watermelon 配西瓜，Strawberry Kiwi 配新鲜猕猴桃，Strawberry Banana 配奶香香蕉，Peach Strawberry 配香甜蜜桃。",
            "偏甜点、糖果风味的有 Strawberry Custard（香甜草莓配奶香卡仕达）和 Watermelon Bubblegum（香甜西瓜配泡泡糖）。",
          ],
        },
        {
          heading: "本页另外 4 种口味",
          paragraphs: [
            "本页另有 Kyoho Grape、Pineapple、Mango 和 Cola Lemon，这几款是在厂商清单之外加上的，我们按名称来归类：Kyoho Grape 是巨峰葡萄，喜欢葡萄的话可以和 Grape Ice、Grape Lychee 一起比较；Pineapple 和 Mango 归水果类；Cola Lemon 是可乐加柠檬。",
          ],
        },
        {
          heading: "机身哪里印着口味名称？",
          paragraphs: [
            "机身下半部是黑色，印有 nexBar CLEAR、口味名称和 18K，买了多种口味也能一眼分清。厂商海报上的标语是“STAY LOW. LIVE HIGH.”。",
          ],
        },
      ],
      faq: [
        {
          question: "nexBar CLEAR 18K 和 WOTOFO nexBAR 18K 是同一款吗？",
          answer: "不是。两者名称相近，但本页是 nexBar CLEAR 18K，[WOTOFO nexBAR 18K](/products/wotofo-nexbar-18k) 是 WOTOFO 的型号，另有单独页面。",
        },
        {
          question: "nexBar CLEAR 18K 的 Blueberry 和 Blueberry Ice 是同一个口味吗？",
          answer: "是的。厂商的口味清单写作 Blueberry，该口味的海报和机身印的是 BLUEBERRY ICE，本页按清单使用 Blueberry。",
        },
      ],
    },
  },
  // Site-wide template round batch 3c (06/10): from SALTHUB's M Bar 10K posters; Thai = thai-copy 05–06/10.
  // Owner 06/10 pm: its only section ("nicotine — not on the posters, ask LINE") went → lede only, no buyer-question block.
  "m-bar-10k": {
    th: {
      lede: "ด้านล่างไล่ดู M Bar 10K ทีละส่วนจากโปสเตอร์ของ SALTHUB เอง พร้อมบอกว่าแต่ละส่วนช่วยอะไรในการใช้งาน",
      sections: [
        {
          heading: "M Bar 10K คืออะไร เหมาะกับใคร",
          paragraphs: [
            "M Bar 10K เป็นพอตใช้แล้วทิ้งของ SALTHUB ในตระกูล M Bar ที่มีน้ำยามาในเครื่องแล้ว จึงไม่ต้องเติมน้ำยาเอง ใช้ไปจนน้ำยาหมดก็เปลี่ยนเป็นเครื่องใหม่ได้",
            "รุ่นนี้เหมาะกับคนที่อยากได้เครื่องที่ใช้ง่าย ไม่ต้องดูแลคอยล์หรือหัวพอตเอง",
          ],
        },
        {
          heading: "M Bar 10K กลิ่นไหนดี",
          paragraphs: [
            "กลิ่นไหนดีไม่มีคำตอบเดียว ขึ้นอยู่กับว่าชอบแนวไหน ร้านแบ่ง 12 กลิ่นของรุ่นนี้เป็น 4 สาย โดยดูจากคำในชื่อกลิ่น ไม่ได้แบ่งตาม SALTHUB ลองเลือกสายที่ชอบไว้ก่อน แล้วค่อยดูรูปทีละกลิ่นจากรายการกลิ่นบนหน้านี้ก็ได้",
            "สายเย็นมี 4 กลิ่น คือ Blue Ice · Menthol Blast · Watermelon Mint และ Yellow Mint ถ้ากำลังหากลิ่นเมนทอล ชื่อในรายการคือ Menthol Blast",
            "สายองุ่นมี 2 กลิ่น คือ Grape กับ Kyoho Grape ซึ่งก็คือองุ่นเคียวโฮ",
            "สายผลไม้มี 4 กลิ่น คือ All Berry · Pink Berry · Strawberry Kiwi และ Watermelon",
            "ถ้าอยากลองรสอื่นนอกจากผลไม้และความเย็น ก็มี Cola กับ Matcha Latte ให้ดูในแนวอื่น",
            "ถ้าอยากเทียบกลิ่นกับรุ่นอื่นในตระกูล M Bar ด้วย อ่านต่อได้ที่ [Marbo กลิ่นไหนดี](/guides/choosing-a-marbo-flavor)",
          ],
        },
        {
          heading: "เทียบ M Bar 10K กับ M Bar 9K และ M Switch Kit",
          paragraphs: [
            "[M Bar 9K หรือมาโบ 9K](/products/m-bar-9k) เป็นพอตใช้แล้วทิ้งในตระกูลเดียวกัน ต่างจากรุ่นนี้หลัก ๆ ที่โหมด M Bar 10K สลับโหมดได้ ส่วน SALTHUB ไม่ได้ระบุโหมดไว้สำหรับรุ่น 9K ถ้าอยากเลือกความแรงได้ รุ่นนี้ตรงกว่า แต่ถ้าอยากได้กลิ่นหลายแนว M Bar 9K มีตัวเลือกมากกว่า",
            "ถ้าสูบเป็นประจำและไม่อยากเปลี่ยนเครื่องใหม่ทุกครั้งที่น้ำยาหมด อีกทางที่น่าดูคือ [M Switch Kit](/products/m-switch-kit) ซึ่งเก็บตัวเครื่องไว้ใช้ต่อ แล้วเปลี่ยนแค่หัวพอต",
          ],
        },
      ]
    },
    en: {
      lede: "Below, the M Bar 10K one part at a time, from SALTHUB's own posters.",
      sections: [
        {
          heading: "What is the M Bar 10K, and who is it for?",
          paragraphs: [
            "The M Bar 10K is a disposable from SALTHUB's M Bar line that comes filled with e-liquid, so there's nothing to top up. Use it until the liquid runs out, then replace it with a new one.",
            "It suits anyone who wants something simple, with no coil or pod to look after.",
          ],
        },
        {
          heading: "Which M Bar 10K flavour should I pick?",
          paragraphs: [
            "There's no single answer; it depends on what you enjoy. We've sorted this model's 12 flavours into four groups by the words in their names, which is our grouping, not SALTHUB's. Pick a group first, then look through the photos in the flavour list on this page.",
            "Cool (4): Blue Ice, Menthol Blast, Watermelon Mint and Yellow Mint. If you're after menthol, the name on the list is Menthol Blast.",
            "Grape (2): Grape and Kyoho Grape.",
            "Fruit (4): All Berry, Pink Berry, Strawberry Kiwi and Watermelon.",
            "For something other than fruit or cool, there's Cola and Matcha Latte in the other group.",
          ],
        },
        {
          heading: "How does the M Bar 10K differ from the M Bar 9K and the M Switch Kit?",
          paragraphs: [
            "The [M Bar 9K](/products/m-bar-9k) is a disposable from the same line. The main difference is the modes: the M Bar 10K has modes to switch between, while SALTHUB lists none for the 9K. If you want to choose the strength, this model is the closer fit; if you want more flavours to pick from, the M Bar 9K has the wider range.",
            "If you vape regularly and would rather not replace the device each time the liquid runs out, look at the [M Switch Kit](/products/m-switch-kit), a reusable device where you keep the body and change only the pod.",
          ],
        },
      ]
    },
    zh: {
      lede: "下面根据 SALTHUB 自己的海报，逐项来看 M Bar 10K。",
      sections: [
        {
          heading: "M Bar 10K 是什么，适合谁？",
          paragraphs: [
            "M Bar 10K 是 SALTHUB M Bar 系列的一次性电子烟，出厂已装好烟油，不用自己加。烟油用完后，换一支新的就可以。",
            "它适合想要简单省心、不用打理线圈或烟弹的人。",
          ],
        },
        {
          heading: "M Bar 10K 哪个口味好？",
          paragraphs: [
            "没有标准答案，取决于个人喜好。我们按口味名称里的词，把这款的 12 种口味分成四类，这是本店的分类，不是 SALTHUB 的。可以先选一类，再到本页的口味列表里逐一看图。",
            "清凉类 4 种：Blue Ice、Menthol Blast、Watermelon Mint、Yellow Mint。想找薄荷醇口味，列表里的名称是 Menthol Blast。",
            "葡萄类 2 种：Grape 和 Kyoho Grape（巨峰葡萄）。",
            "水果类 4 种：All Berry、Pink Berry、Strawberry Kiwi、Watermelon。",
            "想试水果和清凉以外的味道，还有 Cola 和 Matcha Latte，归在其他类。",
          ],
        },
        {
          heading: "M Bar 10K 和 M Bar 9K、M Switch Kit 有什么不同？",
          paragraphs: [
            "[M Bar 9K](/products/m-bar-9k) 是同系列的一次性电子烟，和这款的主要区别在模式：M Bar 10K 可以切换模式，SALTHUB 则未为 9K 标注模式。想自己选强度，这款更合适；想要更多口味，M Bar 9K 的选择更多。",
            "如果经常使用，又不想每次烟油用完都换整支，可以看看 [M Switch Kit](/products/m-switch-kit)：机身可重复使用，只需更换烟弹。",
          ],
        },
      ]
    },
  },
  // Articles queue 0211 batch 5 (02/11): IQOS ILUMA i — every fact = iqos.com/ph ILUMA i kit page (in-app browser 02/11; quotes in
  // side-session notes articles-0211c/iqos-facts.md). "TEREA only" stays out (tagline + short description say it twice). No health
  // or cigarette comparisons. Thai-only guides are linked from th only. Thai = thai-copy 02/11.
  "iqosheet-18": {
    th: {
      lede: "ข้อมูลด้านล่างสรุปจากหน้าของ IQOS เอง ตั้งแต่ของที่อยู่ในกล่อง ILUMA i จำนวนมวนที่สูบต่อกันได้ และการทำงานของแต่ละความสามารถ ไปจนถึงเรื่องการทำความสะอาดเครื่อง",
      sections: [
        {
          heading: "ในกล่อง ILUMA i มีอะไรบ้าง",
          paragraphs: [
            "ในกล่องมีของสามชิ้น คือตัวสูบ กล่องชาร์จพกพา และสาย USB-C ตัวสูบทำจากอะลูมิเนียม ส่วนกล่องชาร์จเป็นพลาสติกที่ทนทานและทนความร้อน มาในทรงที่คุ้นตาของ IQOS",
            "ก่อนใช้ครั้งแรก IQOS แนะนำให้ชาร์จตัวสูบ 12 นาที ส่วนกล่องชาร์จใช้เวลาชาร์จเต็มประมาณ 2 ชั่วโมง 15 นาที และแบตของกล่องชาร์จเมื่อเต็มแล้วใช้ได้รวมราว 20 มวน",
          ],
        },
        {
          heading: "สูบต่อกันได้กี่มวน",
          paragraphs: [
            "ถ้าใช้โหมด Performance และไม่ได้พักการสูบ ตัวสูบของ ILUMA i จะสูบต่อกันได้สูงสุด 3 มวน ก่อนจะต้องวางกลับลงไปชาร์จในกล่อง",
            "โหมด Performance เป็นค่าเริ่มต้นของเครื่อง ส่วนโหมด Eco เปลี่ยนได้ผ่าน IQOS web app การเลือกระหว่างสองโหมดนี้ IQOS เรียกว่า FlexBattery และระบุว่าถ้าใช้โหมด Eco มาตลอด ตัวสูบจะใช้งานได้นานขึ้น แต่ผลที่ได้จริงจะต่างกันไปตามการใช้งานของแต่ละคน",
          ],
        },
        {
          heading: "จอทัชบอกอะไร พักการสูบได้นานแค่ไหน",
          paragraphs: [
            "จอบนตัวสูบจะบอกว่ากำลังอุ่นเครื่องอยู่หรืออุ่นเสร็จแล้ว บุหรี่ที่สูบอยู่เหลือเวลาอีกเท่าไหร่ และยังสูบต่อได้อีกหนึ่งหรือสองมวน",
            "ระหว่างสูบ พักไว้ได้นานสุด 8 นาทีแล้วกลับมาสูบต่อจากเดิม ถ้าไม่กลับมาภายใน 8 นาที ตัวสูบจะปิดเองและบุหรี่มวนนั้นก็จบไป",
            "การพักใช้ได้เฉพาะในโหมด Performance ช่วง 3 นาทีแรกหรือ 8 พัฟแรกของแต่ละมวน และเมื่อพักไปแล้ว ตัวสูบจะสูบต่อกันได้สูงสุดสองมวน โดยพักได้เพียงมวนเดียวในสองมวนนั้น",
          ],
        },
        {
          heading: "FlexPuff ทำงานตอนไหน",
          paragraphs: [
            "พอใกล้สูบหมดมวน เครื่องจะเช็คเองว่ายาสูบในมวนใช้หมดแล้วหรือยัง ถ้ายังเหลือ เครื่องจะเพิ่มให้อีก 4 พัฟโดยอัตโนมัติ และวงไฟบนจอจะยาวขึ้นทวนเข็มนาฬิกาไปถึงตำแหน่ง 9 นาฬิกา ทั้งหมดนี้เครื่องทำให้เอง",
            "IQOS ระบุว่าการทำงานและจำนวนพัฟที่ได้เพิ่มจะต่างกันไปตามการสูบของแต่ละคน บางมวนจึงอาจไม่ได้พัฟเพิ่ม FlexPuff ทำงานในโหมด Eco ได้ด้วย แต่มวนที่พักการสูบไปแล้วจะไม่มี FlexPuff",
          ],
        },
        {
          heading: "ต้องทำความสะอาดไหม",
          paragraphs: [
            "SMARTCORE INDUCTION SYSTEM ของ ILUMA i อุ่นยาสูบโดยไม่ใช้ใบมีดให้ความร้อน ส่วนเรื่องการทำความสะอาด IQOS ระบุว่าไม่มีเศษยาสูบตกค้าง และไม่ต้องทำความสะอาด",
            "ถ้าชาร์จไม่เข้า อยากรีเซ็ตเครื่อง หรืออยากรู้ว่าสัญลักษณ์บนจอหมายถึงอะไร อ่านต่อได้ที่ [IQOS ILUMA i รีเซ็ตยังไง ชาร์จไม่เข้า](/guides/iqos-iluma-i-reset-and-charging)",
          ],
        },
      ],
    },
    en: {
      lede: "Everything below comes from IQOS's own page: what's in the ILUMA i box, how many sticks you can use in a row, how each feature works, and whether the device needs cleaning.",
      sections: [
        {
          heading: "What's in the ILUMA i box?",
          paragraphs: [
            "Three things: the Holder, the Pocket Charger and a USB-C cable. The Holder is aluminium; the Pocket Charger is durable, heat-resistant plastic in IQOS's familiar shape. IQOS recommends charging the Holder for 12 minutes before first use. The Pocket Charger takes about 2 hours 15 minutes to charge fully, and a full charge covers about 20 sticks in total.",
          ],
        },
        {
          heading: "How many sticks in a row?",
          paragraphs: [
            "With Performance Mode on and no pause used, the ILUMA i Holder gives up to 3 sticks in a row before it goes back in the Pocket Charger. Performance Mode is the default; you can switch to Eco Mode in the IQOS web app. IQOS calls this choice FlexBattery and says that using Eco Mode throughout helps the Holder last longer, though results vary with personal use.",
          ],
        },
        {
          heading: "What does the Touch Screen show, and how long can I pause?",
          paragraphs: [
            "The screen shows the pre-heating status, the time left on the stick in use, and whether one or two more sticks are available.",
            "You can pause for up to 8 minutes and pick up where you left off. If you don't resume within 8 minutes, the Holder switches off and that stick is finished. Pause works only in Performance Mode, during the first 3 minutes or 8 puffs of a stick. Once you pause, the Holder gives up to two sticks in a row, and only one of them can be paused.",
          ],
        },
        {
          heading: "When does FlexPuff kick in?",
          paragraphs: [
            "Near the end of a stick, the device checks whether the tobacco has been fully used. If not, it adds 4 extra puffs automatically, and the light ring on the screen extends counter-clockwise to the 9 o'clock position to show it. You don't need to do anything. IQOS says activation and the number of puffs depend on individual use, so not every stick gets them. FlexPuff also works in Eco Mode, but not on a stick you have paused.",
          ],
        },
        {
          heading: "Does it need cleaning?",
          paragraphs: [
            "The ILUMA i heats tobacco with the SMARTCORE INDUCTION SYSTEM, which uses no heating blade. IQOS says there is no tobacco residue and no cleaning needed.",
          ],
        },
      ],
    },
    zh: {
      lede: "以下内容整理自 IQOS 官方页面：ILUMA i 盒内有什么、可以连续使用几支、各项功能如何运作，以及设备是否需要清洁。",
      sections: [
        {
          heading: "ILUMA i 盒内有什么？",
          paragraphs: [
            "盒内有三样：烟具、便携充电盒和 USB-C 充电线。烟具为铝制，充电盒采用 IQOS 经典外形，由耐用、耐热的塑料制成。IQOS 建议首次使用前先给烟具充电 12 分钟；充电盒充满约需 2 小时 15 分钟，充满后总共可供约 20 支使用。",
          ],
        },
        {
          heading: "可以连续使用几支？",
          paragraphs: [
            "在 Performance 模式下且未使用暂停时，ILUMA i 烟具最多可连续使用 3 支，之后需放回充电盒充电。Performance 是默认模式，也可以在 IQOS web app 中切换为 Eco 模式。IQOS 把这两种模式的选择称为 FlexBattery，并表示一直使用 Eco 模式能延长烟具的使用寿命，实际效果因个人使用情况而异。",
          ],
        },
        {
          heading: "触控屏显示什么？可以暂停多久？",
          paragraphs: [
            "屏幕会显示预热状态、当前这支还剩多少时间，以及还能再用一支还是两支。",
            "抽吸中可暂停最长 8 分钟，再从中断处继续；8 分钟内未恢复，烟具会自动关机，这支即结束。暂停仅在 Performance 模式下、每支的前 3 分钟或前 8 口内可用。使用暂停后，烟具最多可连续使用两支，且只有其中一支能暂停。",
          ],
        },
        {
          heading: "FlexPuff 什么时候起作用？",
          paragraphs: [
            "临近结束时，设备会自动判断这支是否已充分使用；如果还没有，会自动增加 4 口，屏幕上的光环会逆时针延伸到 9 点钟位置，无需任何操作。IQOS 表示是否触发及额外口数因个人使用习惯而异，并非每支都会有。Eco 模式下也可使用 FlexPuff，但暂停过的那一支不会触发。",
          ],
        },
        {
          heading: "需要清洁吗？",
          paragraphs: [
            "ILUMA i 采用 SMARTCORE INDUCTION SYSTEM 加热烟草，无需加热片。IQOS 表示设备不会残留烟草，也无需清洁。",
          ],
        },
      ],
    },
  },
  // Articles queue 0211 batch 5 (02/11): IQOS ILUMA i PRIME — iqos.com/ph ILUMA i PRIME kit page (+ the ILUMA i page for the charger
  // comparison), in-app browser 02/11. The page's "two sticks one after the other" vs "up to 3 consecutive uses" conflict = no number.
  "iqosheet-16": {
    th: {
      lede: "ILUMA i PRIME ใช้ระบบเดียวกับ ILUMA i จุดที่ต่างอยู่ที่วัสดุ ขนาดกล่องชาร์จ และของแต่งกล่องชาร์จ ข้อมูลด้านล่างสรุปจากหน้าของ IQOS ว่าในกล่องมีอะไร สองรุ่นนี้ต่างกันตรงไหน และตัวสูบทำอะไรได้บ้าง",
      sections: [
        {
          heading: "ในกล่องมีอะไรบ้าง",
          paragraphs: [
            "ในกล่องมีตัวสูบ กล่องชาร์จพกพา และสาย USB-C มาให้ ตัวสูบชาร์จเต็มในราว 12 นาที ส่วนกล่องชาร์จใช้เวลาประมาณ 2 ชั่วโมง 15 นาที และเมื่อเต็มแล้วใช้ได้รวมราว 20 มวน",
          ],
        },
        {
          heading: "ILUMA i PRIME ต่างจาก ILUMA i ตรงไหน",
          paragraphs: [
            "ตัวสูบและกล่องชาร์จของ PRIME ใช้อะลูมิเนียมร่วมกับกลไกล็อกที่ทำจากวัสดุหลายชนิด ส่วน ILUMA i มีอะลูมิเนียมเฉพาะที่ตัวสูบ ตัวกล่องชาร์จเป็นพลาสติก",
            "ทั้งสองรุ่นมี Ring Sets ไว้แต่งตัวสูบเหมือนกัน ส่วนกล่องชาร์จของ PRIME มี Wraps ไว้หุ้ม และตัวสูบของ PRIME เป็นสีไล่เฉด",
            "ตัวสูบมีขนาดเท่ากับของ ILUMA i คือเส้นผ่านศูนย์กลาง 14.5mm สูง 101mm หนัก 31 กรัม ส่วนกล่องชาร์จของ PRIME กว้าง 44.7mm สูง 117.2mm และหนัก 134 กรัม เทียบกับกล่องชาร์จของ ILUMA i ที่กว้าง 47mm สูง 121.5mm และหนัก 112 กรัม",
          ],
        },
        {
          heading: "ตัวสูบทำอะไรได้บ้าง",
          paragraphs: [
            "บนตัวสูบมีจอทัชที่บอกสถานะการอุ่นเครื่อง เวลาที่เหลือของบุหรี่ที่สูบอยู่ และจำนวนมวนที่ยังสูบต่อได้ ถ้าต้องหยุดกลางคัน ก็พักไว้ได้นานสุด 8 นาทีแล้วค่อยกลับมาสูบต่อ โดยพักได้ในโหมด Performance ช่วง 3 นาทีแรกหรือ 8 พัฟแรกของแต่ละมวน",
            "เรื่องแบต IQOS มี FlexBattery ให้เลือกระหว่างโหมด Performance ที่ตั้งมาเป็นค่าเริ่มต้น กับโหมด Eco ผ่าน IQOS web app ส่วน FlexPuff จะเพิ่มให้อีก 4 พัฟเองเมื่อเครื่องเช็คแล้วว่ายาสูบในมวนยังใช้ไม่หมด โดยไม่ต้องกดอะไร แต่บางมวนอาจไม่ได้พัฟเพิ่ม เพราะขึ้นกับการสูบของแต่ละคน",
            "ถ้ากำลังชั่งใจระหว่าง PRIME กับ ILUMA i ONE ซึ่งเป็นเครื่องชิ้นเดียว อ่านต่อได้ที่ [IQOS ILUMA i ONE vs ILUMA i และ i PRIME ต่างไหม](/guides/iqos-iluma-i-one-vs-iluma-i)",
          ],
        },
      ],
    },
    en: {
      lede: "The ILUMA i PRIME runs on the same system as the ILUMA i; it differs in materials, charger size and charger accessories. Below, from IQOS's own page: what's in the box, how the two compare, and what the Holder can do.",
      sections: [
        {
          heading: "What's in the box?",
          paragraphs: [
            "The Holder, the Pocket Charger and a USB-C cable. The Holder charges fully in about 12 minutes; the Pocket Charger takes about 2 hours 15 minutes and, once full, covers about 20 sticks.",
          ],
        },
        {
          heading: "How is the ILUMA i PRIME different from the ILUMA i?",
          paragraphs: [
            "The PRIME's Holder and Pocket Charger combine aluminium with a locking mechanism made of various materials; on the ILUMA i, only the Holder is aluminium and the Pocket Charger is plastic. Both take Ring Sets on the Holder; the PRIME's Pocket Charger also takes Wraps, and its Holder has a gradient finish.",
            "The Holder is the same size as the ILUMA i's: 14.5 mm across, 101 mm tall, 31 g. The PRIME's Pocket Charger is 44.7 mm wide, 117.2 mm tall and 134 g, against 47 mm, 121.5 mm and 112 g for the ILUMA i.",
          ],
        },
        {
          heading: "What can the Holder do?",
          paragraphs: [
            "The Holder's Touch Screen shows the pre-heating status, the time left and how many more sticks you can use. If you need to stop midway, you can pause for up to 8 minutes and resume, in Performance Mode during the first 3 minutes or 8 puffs of a stick. FlexBattery lets you choose between Performance Mode, the default, and Eco Mode in the IQOS web app. FlexPuff adds 4 puffs on its own when the device finds the stick not fully used, with nothing to press, though not every stick gets them, as it depends on individual use.",
          ],
        },
      ],
    },
    zh: {
      lede: "ILUMA i PRIME 与 ILUMA i 采用同一套系统，不同之处在于材质、充电盒尺寸和充电盒配件。以下内容整理自 IQOS 官方页面：盒内有什么、两款有何不同，以及烟具有哪些功能。",
      sections: [
        {
          heading: "盒内有什么？",
          paragraphs: [
            "盒内有烟具、便携充电盒和 USB-C 充电线。烟具约 12 分钟充满；充电盒约需 2 小时 15 分钟，充满后总共可供约 20 支使用。",
          ],
        },
        {
          heading: "ILUMA i PRIME 和 ILUMA i 有什么不同？",
          paragraphs: [
            "PRIME 的烟具和充电盒采用铝材，并搭配由多种材质制成的锁扣结构；ILUMA i 只有烟具为铝制，充电盒为塑料。两款的烟具都可搭配 Ring Sets；PRIME 的充电盒还可搭配 Wraps，烟具为渐变色。",
            "烟具尺寸与 ILUMA i 相同：直径 14.5 mm、高 101 mm、重 31 g。PRIME 充电盒宽 44.7 mm、高 117.2 mm、重 134 g；ILUMA i 的充电盒则为宽 47 mm、高 121.5 mm、重 112 g。",
          ],
        },
        {
          heading: "烟具有哪些功能？",
          paragraphs: [
            "烟具上的触控屏会显示预热状态、剩余时间和还能连续使用的支数。中途需要停下时，可暂停最长 8 分钟再继续，限 Performance 模式下每支的前 3 分钟或前 8 口。FlexBattery 可在 IQOS web app 中选择默认的 Performance 模式或 Eco 模式；FlexPuff 在判断这支尚未充分使用时会自动增加 4 口，无需任何操作，但因个人使用习惯不同，并非每支都会有。",
          ],
        },
      ],
    },
  },
  // Articles queue 0211 batch 5 (02/11): IQOS ILUMA i ONE — iqos.com/ph ILUMA i ONE kit page (in-app browser 02/11). One-piece is in
  // the tagline + short description already (not repeated). Autostart is named, not defined, on IQOS's page — said no further.
  // No colour count here or on iqosheet-16: the page's own colour options list every colour, and IQOS's count differs from them.
  "iqosheet-17": {
    th: {
      lede: "ILUMA i ONE มีอะไรมาในกล่อง ชาร์จนานแค่ไหน ปรับแต่งอะไรได้บ้าง และใช้งานต่างจาก ILUMA i และ i PRIME ตรงไหน เราสรุปจากหน้าของ IQOS ไว้ด้านล่างนี้",
      sections: [
        {
          heading: "ในกล่องมีอะไร ชาร์จนานแค่ไหน",
          paragraphs: [
            "ในกล่องมีตัวเครื่อง ILUMA i ONE กับสาย USB-C และ IQOS ระบุว่าชาร์จเต็มใช้เวลาประมาณ 1 ชั่วโมง 30 นาที",
            "ตัวเครื่องสูง 122.4mm หนัก 73.9 กรัม และผิวเป็นอะลูมิเนียมเนียนเรียบ",
          ],
        },
        {
          heading: "ต่างจาก ILUMA i กับ i PRIME ตรงไหน",
          paragraphs: [
            "ILUMA i และ i PRIME ใช้ตัวสูบคู่กับกล่องชาร์จ ตัวสูบของสองรุ่นนั้นสูบต่อกันได้ไม่เกิน 3 มวน แล้วต้องวางกลับลงไปชาร์จในกล่อง ส่วน ILUMA i ONE สูบต่อกันได้ราว 20 มวนโดยไม่ต้องชาร์จคั่น",
            "ในตารางเทียบรุ่นของ IQOS รุ่น ONE ไม่มีจอทัช การพักการสูบ และ FlexBattery แบบที่สองรุ่นนั้นมี ถ้าอยากได้จอที่บอกเวลาที่เหลือ หรืออยากพักการสูบแล้วกลับมาสูบต่อได้ ลองดู [IQOS ILUMA i](/products/iqosheet-18) ส่วนการเทียบสามรุ่นทีละเรื่อง อ่านต่อได้ที่ [IQOS ILUMA i ONE vs ILUMA i และ i PRIME ต่างไหม](/guides/iqos-iluma-i-one-vs-iluma-i)",
          ],
        },
        {
          heading: "FlexPuff ทำงานยังไง",
          paragraphs: [
            "เครื่องนี้มี Autostart / Autostop และ FlexPuff พอใกล้สูบหมดมวน FlexPuff จะเช็คว่ายาสูบยังเหลือไหม ถ้ายังมีก็เพิ่มให้อีกสูงสุด 4 พัฟ แต่จำนวนพัฟที่ได้จะต่างกันในแต่ละคน และบางมวนอาจไม่มีพัฟเพิ่ม",
          ],
        },
        {
          heading: "ปรับแต่งอะไรได้บ้าง",
          paragraphs: [
            "ตั้งค่าไฟและการสั่นของเครื่องได้ตามที่ชอบ และ IQOS ยังมีปลอกสวมที่ช่วยปกป้องตัวเครื่องอีกชั้นด้วย",
          ],
        },
      ],
    },
    en: {
      lede: "What comes in the ILUMA i ONE box, how long it takes to charge, how it differs from the ILUMA i and i PRIME, and what you can personalise, all summarised below from IQOS's own page.",
      sections: [
        {
          heading: "What is in the box, and how long does it charge?",
          paragraphs: [
            "Just the ILUMA i ONE and a USB-C cable. IQOS says a full charge takes about 1 hour 30 minutes. The device is 122.4 mm tall, weighs 73.9 g and has a smooth aluminium finish.",
          ],
        },
        {
          heading: "How is it different from the ILUMA i and i PRIME?",
          paragraphs: [
            "The ILUMA i and i PRIME pair a Holder with a Pocket Charger; the Holder manages up to 3 sticks in a row before it goes back in to charge. The ILUMA i ONE goes for about 20 sticks with no charging in between. In IQOS's comparison table, the ONE does not have the Touch Screen, Pause Mode or FlexBattery of the other two. If you want a screen that shows the time left, or the option to pause and resume, take a look at the [IQOS ILUMA i](/products/iqosheet-18).",
          ],
        },
        {
          heading: "How does FlexPuff work?",
          paragraphs: [
            "The device has Autostart / Autostop and FlexPuff. FlexPuff checks near the end of a stick whether any tobacco is left and, if so, adds up to 4 more puffs. The number varies with individual use, and some sticks may get no extra puffs at all.",
          ],
        },
        {
          heading: "What can I personalise?",
          paragraphs: [
            "You can set the lights and vibration, and IQOS makes sleeves that also add protection.",
          ],
        },
      ],
    },
    zh: {
      lede: "ILUMA i ONE 盒内有什么、充电要多久、与 ILUMA i 和 i PRIME 有何不同、可以怎样个性化，以下根据 IQOS 官方页面整理。",
      sections: [
        {
          heading: "盒内有什么？充电要多久？",
          paragraphs: [
            "盒内只有 ILUMA i ONE 主机和 USB-C 充电线。IQOS 表示充满约需 1 小时 30 分钟。机身高 122.4 mm、重 73.9 g，外壳为顺滑的铝制表面。",
          ],
        },
        {
          heading: "和 ILUMA i、i PRIME 有什么不同？",
          paragraphs: [
            "ILUMA i 和 i PRIME 由烟具和充电盒组成，烟具最多连续使用 3 支后，就要放回充电盒充电；ILUMA i ONE 则可连续使用约 20 支，中途无需充电。在 IQOS 的型号对比表中，ONE 没有另外两款的触控屏、暂停模式和 FlexBattery。如果想要能显示剩余时间的屏幕，或希望可以暂停后继续，可以看看 [IQOS ILUMA i](/products/iqosheet-18)。",
          ],
        },
        {
          heading: "FlexPuff 怎么运作？",
          paragraphs: [
            "设备具备 Autostart / Autostop 和 FlexPuff。FlexPuff 会在临近结束时检查烟草是否还有剩余，如有则最多再增加 4 口。额外口数因个人使用习惯而异，有些烟支可能不会增加。",
          ],
        },
        {
          heading: "可以怎样个性化？",
          paragraphs: [
            "可以设置灯光和振动，IQOS 也推出了保护套，能为机身多加一层保护。",
          ],
        },
      ],
    },
  },
  // Articles queue 0211 batch 5 (02/11): KS (Kardinal) Quikpro kit — every fact = kardinal.com/products/quikpro (overview, spec list,
  // FAQ, in the box; WebFetch 02/11, quotes in the batch notes ks-facts.md). Not used: the FAQ's "smoother nicotine delivery" and
  // "smart alternative" lines, the "lasts significantly longer than disposables and closed-pod systems" line (comparison with no
  // number), and the maker's flavour count (the option list carries the flavours). "1 หัว"/"one pod" stays with the tagline and
  // short description (2 already). Thai = thai-copy 02/11.
  "ks-quikpro-kit": {
    th: {
      lede: "ด้านล่างร้านสรุปจากเว็บของ Kardinal ว่ามีอะไรมาในกล่อง คอยล์ ceraKoil คืออะไร หัวพอตเติมน้ำยาได้ไหม ใช้หัวพอตรุ่นอื่นได้ไหม และชาร์จนานแค่ไหน",
      sections: [
        {
          heading: "ในกล่องมีอะไรบ้าง",
          paragraphs: [
            "Kardinal ใส่เครื่อง Quikpro สาย USB-C และเอกสารประกอบมาในกล่องของตัวเครื่อง ส่วนหัวพอตในชุด เลือกกลิ่นได้จากตัวเลือกด้านบน",
          ],
        },
        {
          heading: "คอยล์ ceraKoil คืออะไร",
          paragraphs: [
            "Quikpro ใช้คอยล์ที่ Kardinal เรียกว่า ceraKoil เป็นคอยล์ที่รวมเซรามิกกับ mesh ไว้ในตัวเดียว Kardinal บอกว่าได้รสชาติที่ชัดแบบคอยล์เซรามิก และร้อนไวแบบคอยล์ mesh ไอที่ได้จึงสม่ำเสมอตั้งแต่ต้นจนจบ",
          ],
        },
        {
          heading: "หัวพอตเติมน้ำยาได้ไหม",
          paragraphs: [
            "หัวพอตของ Quikpro เติมน้ำยาเองไม่ได้ ซึ่ง Kardinal บอกว่าช่วยให้หัวพอตคงคุณภาพและสะอาด แต่ละหัวบรรจุน้ำยา 15ml และสูบได้สูงสุด 15,000 พัฟ แล้วแต่การใช้งานของแต่ละคน",
            "พอน้ำยาหมดก็เปลี่ยนแค่หัวใหม่ ใช้ตัวเครื่องเดิมต่อได้ Kardinal บอกว่าระบบเปลี่ยนหัวแบบนี้ช่วยลดขยะเมื่อเทียบกับพอตใช้แล้วทิ้ง และทำให้ตัวเครื่องใช้ได้นานขึ้นด้วย หัวพอตสำหรับเปลี่ยนดูได้ที่หน้า [หัวพอต Quikpro](/products/pod-150)",
          ],
        },
        {
          heading: "ใช้หัวพอตรุ่นอื่นได้ไหม",
          paragraphs: [
            "ไม่ได้ Kardinal ระบุว่า Quikpro ใช้หัวพอตที่ออกแบบมาสำหรับรุ่นนี้โดยเฉพาะ แม้แต่หัว KSpod ที่ Kardinal ทำให้เครื่อง Lumina ก็ใส่ไม่ได้ และหัวพอตของแบรนด์อื่นก็ใส่ไม่ได้เช่นกัน",
          ],
        },
        {
          heading: "ชาร์จนานแค่ไหน และดูน้ำยายังไง",
          paragraphs: [
            "แบต 600mAh ชาร์จผ่าน USB-C เต็มในราว 30 นาที Kardinal บอกว่าแบตที่ชาร์จซ้ำได้แบบนี้ช่วยให้ใช้น้ำยาในหัวได้จนหมดโดยแบตไม่หมดกลางทาง และ Quikpro ยังมีช่องดูน้ำยาไว้เช็คว่าน้ำยาเหลือเท่าไร",
            "วิธีชาร์จและดูแลแบตให้ใช้ได้นาน อ่านต่อได้ที่ [ชาร์จพอตกี่นาทีถึงเต็ม ชาร์จข้ามคืนได้ไหม และวิธีดูแลแบต](/guides/battery-care-and-charging)",
          ],
        },
      ],
      faq: [
        { question: "KS Quik Pro กับ Quikpro คือรุ่นเดียวกันไหม", answer: "เป็นรุ่นเดียวกันค่ะ Kardinal เจ้าของแบรนด์ KS เขียนชื่อรุ่นติดกันว่า Quikpro ส่วน KS Quik Pro เป็นคำที่หลายคนพิมพ์แยกกันเวลาค้นหาค่ะ" },
        { question: "ชุด KS Quikpro 15K ได้หัวพอตกี่หัว", answer: "ได้หัวพอต 1 หัวคู่กับตัวเครื่องค่ะ เลือกกลิ่นของหัวได้จาก Watermelon · Grape · Cola Lemon และ Extra Menthol ส่วนหัวสำหรับเปลี่ยนดูได้ที่หน้า [หัวพอต Quikpro](/products/pod-150) ค่ะ" },
        { question: "KS Quikpro หัวหนึ่งสูบได้กี่พัฟ", answer: "หัวหนึ่งจุน้ำยา 15ml และ Kardinal ระบุว่าสูบได้สูงสุด 15,000 พัฟค่ะ ตัวเลขจริงแล้วแต่วิธีสูบของแต่ละคนนะคะ" },
        { question: "KS Quikpro ต้องชาร์จไหม", answer: "ต้องชาร์จค่ะ แบต 600mAh อยู่ในตัวเครื่อง เสียบสาย USB-C ราว 30 นาทีก็เต็มค่ะ" },
        { question: "KS Quikpro มีสีอะไรบ้าง", answer: "Kardinal ทำตัวเครื่องไว้ 4 สีค่ะ คือ Black · Blue · Grey และ Red ส่วนตัวเลือกบนหน้านี้เป็นกลิ่นของหัวพอต ถ้าอยากเช็คสีก่อนสั่ง ติดต่อสอบถามเพิ่มเติมได้ที่ @okm24 ค่ะ" },
      ],
    },
    en: {
      lede: "Below is a summary from Kardinal's own site: what's in the box, what the ceraKoil coil is, whether the pods can be refilled, whether other pods fit, and how long a charge takes.",
      sections: [
        {
          heading: "What's in the box?",
          paragraphs: [
            "In the device box, Kardinal includes the Quikpro, a USB-C charging cable and documentation. For the pod in the kit, pick a flavour from the options above.",
          ],
        },
        {
          heading: "What is the ceraKoil coil?",
          paragraphs: [
            "The Quikpro uses a coil Kardinal calls ceraKoil, which combines ceramic and mesh in a single coil. Kardinal says it gives the clear flavour of a ceramic coil and the quick heat-up of a mesh coil, so vapour stays consistent from start to finish.",
          ],
        },
        {
          heading: "Can I refill the pods?",
          paragraphs: [
            "No. Quikpro pods can't be refilled, which Kardinal says keeps the pod intact and hygienic. Each pod holds 15ml and gives up to 15,000 puffs, depending on how you use it.",
            "When the e-liquid runs out, you change just the pod and keep the same device. Kardinal says this replaceable-pod system cuts waste compared with disposables and helps the device last longer. Replacement pods are on the [Quikpro pod](/products/pod-150) page.",
          ],
        },
        {
          heading: "Can I use other pods?",
          paragraphs: [
            "No. Kardinal says the Quikpro uses pods designed specifically for this model. Even the KSpod Kardinal makes for the Lumina won't fit, and neither will pods from other brands.",
          ],
        },
        {
          heading: "How long does it take to charge, and how do I see how much e-liquid is left?",
          paragraphs: [
            "The 600mAh battery charges over USB-C in about 30 minutes. Kardinal says a rechargeable battery like this lets you use each pod to the end without running out of power midway. The Quikpro also has an e-liquid window, so you can see how much is left.",
            "For charging habits that help the battery last, see [Battery Care & Charging Basics](/guides/battery-care-and-charging).",
          ],
        },
      ],
      faq: [
        { question: "Are the KS Quik Pro and the KS Quikpro the same model?", answer: "Yes. Kardinal, the maker of KS, writes the name as one word, Quikpro, and many people simply type it as two words when they search." },
        { question: "How many pods come with the KS Quikpro 15K kit?", answer: "One. The kit is the device with one pod, and you choose its flavour: Watermelon, Grape, Cola Lemon or Extra Menthol. Replacement pods are on the [Quikpro pod](/products/pod-150) page." },
        { question: "How many puffs do you get from one KS Quikpro pod?", answer: "Kardinal rates each pod at up to 15,000 puffs from its 15ml of e-liquid. What you actually get depends on how you vape." },
        { question: "Does the KS Quikpro need charging?", answer: "Yes. The 600mAh battery is in the device, and a full charge over USB-C takes about 30 minutes." },
        { question: "What colours does the KS Quikpro come in?", answer: "Kardinal makes the device in four colours: Black, Blue, Grey and Red. The options on this page are pod flavours, so to check a colour before you order, message us on LINE @okm24." },
      ],
    },
    zh: {
      lede: "以下是本店根据 Kardinal 官网整理的内容：包装里有什么、ceraKoil 线圈是什么、烟弹能否补油、能否换用其他烟弹，以及充电需要多久。",
      sections: [
        {
          heading: "包装里有什么？",
          paragraphs: [
            "Kardinal 在主机包装内放有 Quikpro 主机、USB-C 充电线和说明文件。套装附带的烟弹，可在上方选项中选择口味。",
          ],
        },
        {
          heading: "ceraKoil 线圈是什么？",
          paragraphs: [
            "Quikpro 采用 Kardinal 称为 ceraKoil 的线圈，把陶瓷和网状结构结合在同一个线圈里。Kardinal 表示，它兼具陶瓷线圈清晰的口味和网状线圈升温快的特点，烟雾从头到尾都很稳定。",
          ],
        },
        {
          heading: "烟弹可以补油吗？",
          paragraphs: [
            "不可以。Quikpro 烟弹不能自行补油，Kardinal 表示这样能保持产品的品质与卫生。每颗烟弹容量 15ml，视个人使用情况最多可抽 15,000 口。",
            "烟油用完后只需更换烟弹，主机可以继续使用。Kardinal 表示，与一次性电子烟相比，这种可换烟弹的设计能减少废弃物，也能延长主机的使用寿命。替换烟弹见 [Quikpro 烟弹](/products/pod-150)页面。",
          ],
        },
        {
          heading: "可以用其他烟弹吗？",
          paragraphs: [
            "不可以。Kardinal 表示，Quikpro 使用专为这款机型设计的烟弹，就连 Kardinal 为 Lumina 推出的 KSpod 也装不上，其他品牌的烟弹同样不能用。",
          ],
        },
        {
          heading: "充电要多久？怎么看剩余烟油？",
          paragraphs: [
            "600mAh 电池通过 USB-C 约 30 分钟充满。Kardinal 表示，这样的可充电电池能让每颗烟弹用到最后，不会中途没电。Quikpro 还设有烟油观察窗，可以看到烟油还剩多少。",
            "充电习惯与电池保养方法，详见[电池保养与充电基础](/guides/battery-care-and-charging)。",
          ],
        },
      ],
      faq: [
        { question: "KS Quik Pro 和 KS Quikpro 是同一款吗？", answer: "是同一款。KS 的厂商 Kardinal 把型号写成一个词 Quikpro，很多人搜索时习惯分开写成 Quik Pro。" },
        { question: "KS Quikpro 15K 套装含几颗烟弹？", answer: "一颗。套装是主机加一颗烟弹，口味可选 Watermelon、Grape、Cola Lemon 或 Extra Menthol。替换烟弹请看 [Quikpro 烟弹](/products/pod-150) 页面。" },
        { question: "KS Quikpro 一颗烟弹能抽多少口？", answer: "Kardinal 标注每颗烟弹最多 15,000 口，烟油容量 15ml。实际口数因个人抽吸习惯而异。" },
        { question: "KS Quikpro 需要充电吗？", answer: "需要。600mAh 电池在主机内，通过 USB-C 充电，约 30 分钟充满。" },
        { question: "KS Quikpro 有哪些颜色？", answer: "Kardinal 的主机有 Black、Blue、Grey 和 Red 四种颜色。本页的选项是烟弹口味，下单前想确认颜色，欢迎通过 LINE @okm24 咨询。" },
      ],
    },
  },
  // Articles queue 0211 batch 5 (02/11): KS (Kardinal) Quikpro pod — every fact = kardinal.com/products/quikpro (FAQ, overview;
  // WebFetch 02/11). Capacity, puffs, size and weight stay with the tagline, short description and spec rows. The coil is
  // credited to the Quikpro system (the maker does not say it sits in the pod); charge time stays on the kit page. Thai = thai-copy 02/11.
  "pod-150": {
    th: {
      lede: "ด้านล่างร้านสรุปไว้จากเว็บของ Kardinal ว่า Quikpro ใช้คอยล์แบบไหน หัวพอตเติมน้ำยาเองได้ไหม และใส่กับเครื่องไหนได้บ้าง",
      sections: [
        {
          heading: "Quikpro ใช้คอยล์แบบไหน",
          paragraphs: [
            "ระบบ Quikpro ใช้คอยล์ ceraKoil ของ Kardinal ซึ่งรวมเซรามิกกับ mesh ไว้ด้วยกัน ตามที่ Kardinal อธิบาย เซรามิกให้รสชาติที่ชัด ส่วน mesh ช่วยให้ร้อนไว ไอจึงออกมาสม่ำเสมอตั้งแต่ต้นจนจบ",
          ],
        },
        {
          heading: "หัวพอตเติมน้ำยาเองได้ไหม",
          paragraphs: [
            "หัวนี้เติมน้ำยาเองไม่ได้ ซึ่ง Kardinal บอกว่าช่วยรักษาคุณภาพและความสะอาดของหัวพอตไว้",
            "Kardinal บอกด้วยว่าระบบที่เปลี่ยนแค่หัวแล้วใช้ตัวเครื่องเดิมต่อแบบนี้ ช่วยลดขยะเมื่อเทียบกับพอตใช้แล้วทิ้ง และทำให้ตัวเครื่องใช้ได้นานขึ้น",
          ],
        },
        {
          heading: "หัวหนึ่งใช้ได้นานแค่ไหน",
          paragraphs: [
            "Kardinal บอกว่าหัวหนึ่งสูบได้มากถึง 15,000 พัฟ แล้วแต่การใช้งานของแต่ละคน และระบุว่าหัวของ Quikpro ออกแบบมาให้ใช้ได้นานกว่าพอตใช้แล้วทิ้งทั่วไปและพอตระบบปิด",
            "ระบบ Quikpro มีช่องดูน้ำยา จึงเห็นได้ว่าน้ำยาในหัวเหลืออีกเท่าไรก่อนถึงเวลาเปลี่ยนหัว ส่วนแบตชาร์จซ้ำได้ผ่าน USB-C ในราว 30 นาที ซึ่ง Kardinal บอกว่าช่วยให้ใช้น้ำยาได้จนหมดหัวโดยแบตไม่หมดก่อน",
          ],
        },
        {
          heading: "ใส่กับเครื่องไหนได้",
          paragraphs: [
            "Kardinal ระบุว่าหัวนี้ออกแบบมาสำหรับเครื่อง Quikpro โดยเฉพาะ ส่วนหัว KSpod ที่ Kardinal ทำให้เครื่อง Lumina และหัวพอตของแบรนด์อื่น ใส่กับ Quikpro ไม่ได้ ถ้ายังไม่มีตัวเครื่อง ดูได้ที่หน้า [ชุดเครื่อง Quikpro](/products/ks-quikpro-kit)",
            "ถ้ายังเลือกกลิ่นไม่ถูก อ่านต่อได้ที่ [พอตกลิ่นไหนดี เลือกจากสายที่ชอบ ทั้งเย็น ผลไม้ ชา หรือยาสูบ](/guides/choosing-a-pod-flavor)",
          ],
        },
      ],
    },
    en: {
      lede: "Below is a summary from Kardinal's own site: which coil the Quikpro uses, whether the pod can be refilled, and which device it fits.",
      sections: [
        {
          heading: "Which coil does the Quikpro use?",
          paragraphs: [
            "The Quikpro system uses Kardinal's ceraKoil, a coil that brings ceramic and mesh together. As Kardinal explains it, the ceramic gives clear flavour and the mesh heats up quickly, so vapour comes out consistent from start to finish.",
          ],
        },
        {
          heading: "Can I refill the pod?",
          paragraphs: [
            "No. This pod can't be refilled, which Kardinal says keeps it intact and hygienic.",
            "Kardinal adds that changing just the pod and keeping the same device cuts waste compared with disposables and helps the device last longer.",
          ],
        },
        {
          heading: "How long does a pod last?",
          paragraphs: [
            "Kardinal says each pod gives up to 15,000 puffs, depending on how you use it, and that Quikpro pods are designed to last longer than typical disposables and closed-pod systems. The Quikpro has an e-liquid window, so you can see how much is left before it is time for a new pod, and the device's rechargeable battery charges over USB-C in about 30 minutes, which Kardinal says lets you use each pod to the end without running out of power midway.",
          ],
        },
        {
          heading: "Which device does it fit?",
          paragraphs: [
            "Kardinal says this pod is designed specifically for the Quikpro. The KSpod Kardinal makes for the Lumina and pods from other brands don't fit the Quikpro. If you don't have the device yet, see the [Quikpro kit](/products/ks-quikpro-kit).",
          ],
        },
      ],
    },
    zh: {
      lede: "以下是本店根据 Kardinal 官网整理的内容：Quikpro 用的是哪种线圈、烟弹能否自行补油，以及适用哪款设备。",
      sections: [
        {
          heading: "Quikpro 用的是哪种线圈？",
          paragraphs: [
            "Quikpro 采用 Kardinal 的 ceraKoil 线圈，把陶瓷和网状结构结合在一起。按 Kardinal 的说法，陶瓷带来清晰的口味，网状结构升温快，烟雾因此从头到尾都很稳定。",
          ],
        },
        {
          heading: "烟弹可以自行补油吗？",
          paragraphs: [
            "不可以。这款烟弹不能自行补油，Kardinal 表示这样能保持产品的品质与卫生。",
            "Kardinal 还表示，只换烟弹、继续使用同一台主机，与一次性电子烟相比能减少废弃物，也能延长主机的使用寿命。",
          ],
        },
        {
          heading: "一颗烟弹能用多久？",
          paragraphs: [
            "Kardinal 表示，视个人使用情况，每颗烟弹最多可抽 15,000 口，并称 Quikpro 烟弹的设计比一般一次性电子烟和封闭式烟弹更耐用。Quikpro 设有烟油观察窗，换烟弹前可以看到烟油还剩多少；主机的可充电电池通过 USB-C 约 30 分钟充满，Kardinal 表示这样每颗烟弹都能用到最后，不会中途没电。",
          ],
        },
        {
          heading: "适用哪款设备？",
          paragraphs: [
            "Kardinal 表示，这款烟弹专为 Quikpro 设计。Kardinal 为 Lumina 推出的 KSpod 以及其他品牌的烟弹，都不能用于 Quikpro。还没有主机的话，可以看看 [Quikpro 套装](/products/ks-quikpro-kit)。",
          ],
        },
      ],
    },
  },
  // Site-wide template round batch 4e (06/10): from JOIWAY's own F4 TWINS posters; Thai = thai-copy 06/10.
  "joiway-f4": {
    th: {
      lede: "ด้านล่างไล่ดู F4 TWINS ทีละส่วน จากโปสเตอร์ของ JOIWAY เอง",
      sections: [
        {
          heading: "สูบได้กี่พัฟ",
          paragraphs: [
            "โปสเตอร์หน้าแรกของ JOIWAY ระบุไว้ที่ 20,000 พัฟต่อเครื่อง แบ่งเป็นฝั่งละ 10,000 พัฟ"
          ]
        }
      ]
    },
    en: {
      lede: "Below, the F4 TWINS one part at a time, from JOIWAY's own posters.",
      sections: [
        {
          heading: "How many puffs?",
          paragraphs: [
            "JOIWAY's cover poster gives 20,000 puffs for the device: 10,000 on each side."
          ]
        }
      ]
    },
    zh: {
      lede: "下面根据 JOIWAY 自己的海报，逐项来看 F4 TWINS。",
      sections: [
        {
          heading: "能抽多少口？",
          paragraphs: [
            "JOIWAY 的封面海报写的是整机 20,000 口：每边 10,000 口。"
          ]
        }
      ]
    },
  },
  // Site-wide template round batch 4g (05/10): from TFIT's own M Power 20K posters + site; Thai = thai-copy 05/10.
  "tfit-m-power-20k": {
    th: {
      lede: "ด้านล่างไล่ดู M Power 20K ทีละส่วน จากโปสเตอร์ของ TFIT เอง",
      sections: [
        {
          heading: "สูบได้กี่พัฟ",
          paragraphs: [
            "TFIT ระบุไว้ว่าสูบได้สูงสุด 20,000 พัฟ ส่วนใช้จริงจะได้ใกล้ตัวเลขนี้แค่ไหน ขึ้นอยู่กับว่าสูบบ่อยและดูดแต่ละครั้งนานเท่าไหร่"
          ]
        },
        {
          heading: "มีน้ำยาเท่าไหร่ และนิโคตินเข้มข้นแค่ไหน",
          paragraphs: [
            "ตามสเปกของ TFIT ตัวเครื่องมีน้ำยาบรรจุมาให้แล้ว 18mL และความเข้มข้นของนิโคตินอยู่ที่ 30mg"
          ]
        },
        {
          heading: "รุ่นนี้เป็นของแบรนด์ไหน",
          paragraphs: [
            "M Power 20K เป็นรุ่นของ TFIT แบรนด์บุหรี่ไฟฟ้าในเครือ THINKVAPE ซึ่งก่อตั้งขึ้นในปี 2015 และบนตัวเครื่องก็มีคำว่า DESIGNED BY TFIT พิมพ์ไว้"
          ]
        }
      ]
    },
    en: {
      lede: "Below, the M Power 20K one part at a time, from TFIT's own posters.",
      sections: [
        {
          heading: "How many puffs?",
          paragraphs: [
            "TFIT rates the M Power 20K at up to 20,000 puffs. How close you get depends on how often you draw and for how long."
          ]
        },
        {
          heading: "How much e-liquid, and how strong?",
          paragraphs: [
            "It comes prefilled with 18mL, at 30mg nicotine, per TFIT's spec card."
          ]
        },
        {
          heading: "Who makes it?",
          paragraphs: [
            "TFIT, a vape brand under THINKVAPE, founded in 2015. \"Designed by TFIT\" is printed on the device itself."
          ]
        }
      ]
    },
    zh: {
      lede: "下面根据 TFIT 自己的海报，逐项来看 M Power 20K。",
      sections: [
        {
          heading: "能抽多少口？",
          paragraphs: [
            "TFIT 给出的数字是最多 20,000 口。实际能抽多少，取决于抽的频率和每口的长短。"
          ]
        },
        {
          heading: "烟油有多少？浓度多少？",
          paragraphs: [
            "按 TFIT 的规格卡，出厂预装 18mL，尼古丁 30mg。"
          ]
        },
        {
          heading: "是哪家做的？",
          paragraphs: [
            "TFIT，THINKVAPE 旗下的电子烟品牌，创立于 2015 年。机身上就印着 \"Designed by TFIT\"。"
          ]
        }
      ]
    },
  },
  // Site-wide template round batch 3f (06/10): from SALTHUB's own M Bar 15K + M Switch Kit material; Thai = thai-copy 06/10.
  "m-bar-15k": {
    th: {
      lede: "ด้านล่างไล่ดู M Bar 15K ทีละส่วนจากโปสเตอร์ของ SALTHUB ตั้งแต่การเปลี่ยนหัวพอต คอยล์ หน้าจอ ไปจนถึงการชาร์จและการปรับลม",
      sections: [
        {
          heading: "M Bar 15K ต่างจาก M Switch Kit ตรงไหน",
          paragraphs: [
            "ทั้งสองรุ่นใช้ตัวเครื่อง M Switch แบบเดียวกัน มีหน้าจอ ปุ่มเลื่อนปรับลม และสายคล้องเหมือนกัน ความต่างอยู่ที่หัวพอต M Bar 15K ใช้หัวพอตใสที่มีคอยล์เซรามิก ส่วน [M Switch Kit](/products/m-switch-kit) ใช้หัวพอตสีดำที่มีคอยล์ cotton mesh"
          ]
        },
        {
          heading: "M Bar 15K สูบได้กี่พัฟ",
          paragraphs: [
            "SALTHUB ระบุว่า M Bar 15K สูบได้สูงสุด 15,000 พัฟ ส่วนใช้จริงจะได้ใกล้ตัวเลขนี้มากน้อยเท่าไร ขึ้นอยู่กับว่าสูบบ่อยเพียงใด และดูดแต่ละครั้งนานเท่าไร"
          ]
        }
      ]
    },
    en: {
      lede: "Below, the M Bar 15K one part at a time from SALTHUB's posters: the swap-in cartridge, the coil, the screen, charging and airflow.",
      sections: [
        {
          heading: "M Bar 15K or M Switch Kit?",
          paragraphs: [
            "Both use the same M Switch body, with the screen, the airflow slider and the lanyard. The difference is the cartridge: the M Bar 15K takes SALTHUB's clear M Bar cartridge with a ceramic coil, the [M Switch Kit](/products/m-switch-kit) its black cartridge with a cotton mesh coil."
          ]
        },
        {
          heading: "How many puffs?",
          paragraphs: [
            "SALTHUB rates the M Bar 15K at up to 15,000 puffs. How close you get depends on how often you vape and how long each draw is."
          ]
        }
      ]
    },
    zh: {
      lede: "下面根据 SALTHUB 的海报逐项来看 M Bar 15K：可换烟弹、线圈、屏幕、充电和进气。",
      sections: [
        {
          heading: "M Bar 15K 和 M Switch Kit 怎么选？",
          paragraphs: [
            "两者用的是同一台 M Switch 主机，屏幕、进气滑块和挂绳都一样。区别在烟弹：M Bar 15K 用 SALTHUB 的透明 M Bar 烟弹，陶瓷芯；[M Switch Kit](/products/m-switch-kit) 用黑色烟弹，棉网芯。"
          ]
        },
        {
          heading: "能抽多少口？",
          paragraphs: [
            "SALTHUB 标注 M Bar 15K 最多 15,000 口。实际能抽到多接近这个数字，取决于抽的频率和每口的长短。"
          ]
        }
      ]
    },
  },
  // Round seo-push-2710 (27/10, owner: the "more details" heading of these two pages had nothing under it but the grid).
  // Neither maker publishes a product page (INFY lists no 20K; Muro has no site), so every fact below is one of the page's
  // verified rows or its flavour list; the flavour groups are the shop's own, by the words in each name (thai-copy 27/10).
  // en/zh link only the guides that exist in those languages (the flavour and disposable guides are Thai only).
  "infy-20k": {
    th: {
      lede: "INFY 20K มีให้เลือก 24 กลิ่น ด้านล่างร้านจัดกลิ่นเป็นสายไว้ให้เลือกได้ง่ายขึ้น พร้อมเรื่องการปรับช่องลมและระยะเวลาใช้งานที่ควรรู้ก่อนเลือก",
      sections: [
        {
          heading: "INFY 20K กลิ่นไหนดี",
          paragraphs: [
            "กลิ่นไหนดีไม่มีคำตอบเดียว ขึ้นอยู่กับว่าชอบแนวไหน ลองเลือกจากสายก่อนก็ได้ ร้านจัดสายเองจากคำในชื่อกลิ่น ชื่อที่มี Mint หรือ Menthol อยู่สายเย็น ชื่อที่มี Grape อยู่สายองุ่น ชื่อชาอยู่สายชา และชื่อผลไม้อื่น ๆ อยู่สายผลไม้",
            "สายเย็นมี Mint กับ Menthol Freeze ส่วนสายองุ่นมี 6 กลิ่น คือ Grape Apple · Grape Lychee · Grape Aloe · Grape Bubblegum · Kyoho Grape และ Yoyo Grape มีทั้งองุ่นอย่างเดียว องุ่นคู่กับผลไม้ องุ่นคู่กับอโล และองุ่นคู่กับหมากฝรั่ง",
            "สายผลไม้มี 12 กลิ่น มีทั้งผลไม้อย่างเดียว อย่าง Lychee · Peach · Blueberry และผลไม้สองอย่างคู่กัน อย่าง Strawberry Kiwi กับ Watermelon Lychee ส่วน Strawberry Ice Cream กับ Watermelon Bubblegum ที่มีผลไม้คู่กับขนม ร้านก็จัดไว้ในสายนี้ด้วย",
            "สายชามี Milk Tea Cha กับ Matcha ส่วน Cola กับ Mineral Water ชื่อไม่ได้เป็นผลไม้หรือชา ร้านจึงจัดไว้เป็นแนวอื่น ถ้ายังไม่แน่ใจว่าจะเริ่มจากสายไหน อ่านวิธีเลือกได้ที่[พอตกลิ่นไหนดี](/guides/choosing-a-pod-flavor)",
          ],
        },
        {
          heading: "ปรับช่องลมแล้ว การสูบต่างกันยังไง",
          paragraphs: [
            "ถ้าเปิดช่องลมให้กว้างขึ้น การสูบจะโล่งขึ้น และควันจะเย็นและบางลง ถ้าหรี่ช่องลมให้แคบลง การสูบก็จะแน่นขึ้น ลองเริ่มจากระดับกลาง ๆ ก่อน แล้วค่อยปรับทีละน้อยจนได้แบบที่ชอบ",
            "ช่องลมแบบไหนเข้ากับแนวการสูบแบบไหน ร้านเล่าไว้ละเอียดที่[เลือกวัตต์และช่องลม](/guides/choosing-wattage-and-airflow)",
          ],
        },
        {
          heading: "INFY 20K ใช้ได้นานแค่ไหน",
          paragraphs: [
            "ใช้ได้กี่วันไม่มีตัวเลขตายตัว ขึ้นอยู่กับว่าสูบถี่แค่ไหน และดูดแต่ละครั้งนานเท่าไร ตัวเครื่องมีน้ำยาบรรจุมาให้แล้ว 20mL พอน้ำยาหมดก็เปลี่ยนเป็นเครื่องใหม่ ส่วนถ้าแบตหมดก่อน ก็ชาร์จผ่าน USB-C แล้วใช้ต่อได้",
            "ตัวเลขพัฟที่พอตใช้แล้วทิ้งระบุไว้ควรอ่านยังไง และสูบแบบไหนถึงใช้ได้นานขึ้น ร้านเขียนไว้ที่[พอตใช้แล้วทิ้ง ใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts)",
          ],
        },
      ],
    },
    en: {
      lede: "The INFY 20K comes in 24 flavours. Below, we've sorted them into groups to make choosing easier, with a word on airflow and on how long one lasts.",
      sections: [
        {
          heading: "Which INFY 20K flavour should I start with?",
          paragraphs: [
            "There's no single right answer, so start with the kind of flavour you like. We grouped them by the words in their names, not by INFY's own list: Mint or Menthol means cool, Grape means the grape group, tea names go under tea, and other fruit names under fruit.",
            "The cool group is Mint and Menthol Freeze. The grape group has six: Grape Apple, Grape Lychee, Grape Aloe, Grape Bubblegum, Kyoho Grape and Yoyo Grape.",
            "Fruit has 12, from single fruits such as Lychee, Peach and Blueberry to pairs like Strawberry Kiwi and Watermelon Lychee. Names that pair a fruit with a sweet, like Strawberry Ice Cream and Watermelon Bubblegum, sit here too.",
            "Tea is Milk Tea Cha and Matcha. That leaves Cola and Mineral Water, whose names point to neither fruit nor tea, so we list them as others.",
          ],
        },
        {
          heading: "How does adjusting the airflow change the draw?",
          paragraphs: [
            "Open the airflow wider and the draw gets looser, with cooler, thinner vapour. Close it down and the draw gets tighter. Start in the middle and adjust a little at a time until it feels right.",
            "Which airflow suits which draw style is covered in [Choosing Wattage & Airflow](/guides/choosing-wattage-and-airflow).",
          ],
        },
        {
          heading: "How long does an INFY 20K last?",
          paragraphs: [
            "There's no fixed number of days: it depends on how often you vape and how long each draw is. It comes prefilled with 20mL, and when that runs out it's time for a new one. If the battery runs low first, charge it over USB-C and carry on.",
          ],
        },
      ],
    },
    zh: {
      lede: "INFY 20K 共有 24 种口味。下面我们按类型分好了组，方便挑选，也顺带讲讲进气调节和能用多久。",
      sections: [
        {
          heading: "INFY 20K 哪个口味好？",
          paragraphs: [
            "没有标准答案，可以先从喜欢的类型选起。我们按口味名称里的词来分组，并非 INFY 官方分类：带 Mint 或 Menthol 的归为清凉，带 Grape 的归为葡萄，茶类名称归为茶，其他水果名称归为水果。",
            "清凉类有 Mint 和 Menthol Freeze。葡萄类有 6 款：Grape Apple、Grape Lychee、Grape Aloe、Grape Bubblegum、Kyoho Grape 和 Yoyo Grape。",
            "水果类有 12 款，既有 Lychee、Peach、Blueberry 这样的单一水果，也有 Strawberry Kiwi、Watermelon Lychee 这样的组合。水果搭配甜点的名称，比如 Strawberry Ice Cream 和 Watermelon Bubblegum，也归在这一类。",
            "茶类是 Milk Tea Cha 和 Matcha。剩下的 Cola 和 Mineral Water，名称既不是水果也不是茶，我们归为其他。",
          ],
        },
        {
          heading: "调节进气，吸感有什么不同？",
          paragraphs: [
            "进气开大，吸感更松，烟雾更凉、更薄；进气收小，吸感更紧。可以先从中间开始，再一点点调到自己喜欢的程度。",
            "不同吸法适合怎样的进气，详见[如何选择功率与进气量](/guides/choosing-wattage-and-airflow)。",
          ],
        },
        {
          heading: "INFY 20K 能用多久？",
          paragraphs: [
            "能用几天没有固定数字，取决于抽的频率和每口的长短。机身预装 20mL 烟油，抽完就换新的；如果电池先用完，用 USB-C 充电后可以继续使用。",
          ],
        },
      ],
    },
  },
  // Round "queue 0211" articles, Muro e-liquids (02/11): no maker site exists — facts = the records in src/data/products/unbranded.ts
  // only: the nicotine type (verified, it is in the name) and the flavour names (one set for both). Bottle size and nicotine mg rows
  // are unverified → not stated; salt nic vs freebase itself = the shop guide, linked, not retold. Legacy pages render no article
  // FAQ → none written. Thai = thai-copy 02/11 (worded apart so the sibling pages do not duplicate).
  "muro-salt-nic": {
    th: {
      lede: "ด้านล่างร้านจัดกลิ่นของ Muro Salt Nic เป็นสายให้ดูง่ายขึ้น และเล่าว่าต่างจาก Muro Freebase ตรงไหน",
      sections: [
        {
          heading: "Muro Salt Nic กับ Muro Freebase ต่างกันยังไง",
          paragraphs: [
            "สองรุ่นนี้ใช้ชื่อกลิ่นชุดเดียวกันทุกกลิ่น ที่ต่างกันคือชนิดของนิโคติน Muro Salt Nic ใช้นิโคตินแบบ salt nic ส่วน [Muro Freebase](/products/muro-freebase) ใช้แบบ freebase จะเลือกรุ่นไหน จึงดูจากเครื่องที่ใช้ก่อนได้เลย แล้วค่อยเลือกกลิ่นที่ชอบ",
            "สองแบบนี้เป็นนิโคตินคนละชนิด และเข้ากับเครื่องคนละแบบด้วย ถ้ายังไม่แน่ใจว่าเครื่องที่ใช้อยู่เข้ากับแบบไหน อ่านต่อได้ที่[นิโคติน salt nic กับ freebase](/guides/salt-nic-vs-freebase)",
          ],
        },
        {
          heading: "มีกลิ่นแนวไหนให้เลือกบ้าง",
          paragraphs: [
            "ร้านจัดสายจากคำในชื่อกลิ่น สายเย็นมี Click Mint สายองุ่นมี Grape ส่วนสายผลไม้มี Watermelon · Strawberry Twist และ Peach ที่เหลือคือ Big Cola ชื่อนี้ไม่ได้บอกผลไม้ ร้านจึงจัดไว้แนวอื่น",
            "ถ้าใช้พอตซิสเต็มที่เติมน้ำยาเอง กลิ่นอยู่ที่น้ำยา ไม่ได้ผูกกับตัวเครื่อง อยากลองกลิ่นอื่นก็ไม่ต้องเปลี่ยนเครื่อง วิธีเติมน้ำยาทีละขั้น ร้านเล่าไว้ที่[เติมพอตยังไง](/guides/refilling-a-pod)",
          ],
        },
      ],
    },
    en: {
      lede: "Below, the Muro Salt Nic flavours sorted into groups, and how it differs from Muro Freebase.",
      sections: [
        {
          heading: "Muro Salt Nic or Muro Freebase?",
          paragraphs: [
            "The two share the same set of flavour names. The difference is the nicotine: Muro Salt Nic uses salt nic, while [Muro Freebase](/products/muro-freebase) uses freebase. So let your device decide which one to take first, then pick the flavour you like.",
            "Salt nic and freebase are two different forms of nicotine, and each suits a different kind of device, so it's worth checking what your device's maker recommends.",
          ],
        },
        {
          heading: "Which flavours are there?",
          paragraphs: [
            "We grouped them by the words in their names. Click Mint is the cool one and Grape the grape; fruit has Watermelon, Strawberry Twist and Peach. Big Cola doesn't name a fruit, so it sits on its own.",
            "In a pod system you refill yourself, the flavour is in the e-liquid rather than the device, so trying another flavour doesn't mean changing devices.",
          ],
        },
      ],
    },
    zh: {
      lede: "下面把 Muro Salt Nic 的口味按类型分好组，并说明它和 Muro Freebase 有什么不同。",
      sections: [
        {
          heading: "Muro Salt Nic 和 Muro Freebase 有什么不同？",
          paragraphs: [
            "两款的口味名称完全相同，区别在于尼古丁类型：Muro Salt Nic 采用盐尼古丁，[Muro Freebase](/products/muro-freebase) 则采用游离碱尼古丁。所以可以先按所用设备决定选哪一款，再挑喜欢的口味。",
            "盐尼古丁和游离碱尼古丁是两种不同形式的尼古丁，适合的设备也不同，建议参考设备厂家的推荐。",
          ],
        },
        {
          heading: "有哪些口味可选？",
          paragraphs: [
            "我们按口味名称里的词来分组：清凉类是 Click Mint，葡萄类是 Grape，水果类有 Watermelon、Strawberry Twist 和 Peach。Big Cola 的名称不是水果，单独归为其他。",
            "如果使用可自行注油的开放式设备，口味在烟油里，与主机无关，想换口味不必更换设备。",
          ],
        },
      ],
    },
  },
  "muro-freebase": {
    th: {
      lede: "ด้านล่างร้านเล่าว่า Muro Freebase ต่างจาก Muro Salt Nic ตรงไหน พร้อมจัดกลิ่นเป็นสายไว้ให้เลือกได้ง่ายขึ้น",
      sections: [
        {
          heading: "ต่างจาก Muro Salt Nic ตรงไหน",
          paragraphs: [
            "Muro Freebase กับ [Muro Salt Nic](/products/muro-salt-nic) มีชื่อกลิ่นเหมือนกันทุกกลิ่น สิ่งที่ต่างคือชนิดของนิโคติน รุ่นนี้เป็นแบบ freebase ส่วนอีกรุ่นเป็นแบบ salt nic เวลาเลือกระหว่างสองรุ่นนี้ ให้ดูเครื่องที่ใช้อยู่เป็นหลัก แล้วกลิ่นที่ชอบก็มีให้เลือกในรุ่นนั้นเหมือนกัน",
            "freebase กับ salt nic เป็นนิโคตินคนละชนิด และเข้ากับเครื่องคนละแบบ ความต่างของทั้งสองแบบ รวมถึงวิธีดูว่าเครื่องที่ใช้อยู่เข้ากับแบบไหน ร้านรวมไว้ที่[นิโคติน salt nic กับ freebase](/guides/salt-nic-vs-freebase)",
          ],
        },
        {
          heading: "Muro Freebase กลิ่นไหนดี",
          paragraphs: [
            "เลือกจากแนวที่ชอบก่อนก็ได้ ร้านจัดสายจากคำในชื่อกลิ่น ถ้าชอบความเย็น ชื่อที่มีคำว่า Mint คือ Click Mint ถ้าชอบองุ่นมี Grape และถ้าชอบผลไม้มี Watermelon · Strawberry Twist กับ Peach ส่วน Big Cola เป็นชื่อเครื่องดื่ม ไม่ได้บอกผลไม้ ร้านจัดไว้แนวอื่น",
            "ถ้าใช้เครื่องที่ปรับวัตต์ได้ วิธีตั้งวัตต์และช่องลมให้เข้ากับแนวการสูบ อ่านได้ที่[เลือกวัตต์และช่องลม](/guides/choosing-wattage-and-airflow)",
          ],
        },
      ],
    },
    en: {
      lede: "Below, how Muro Freebase differs from Muro Salt Nic, and its flavours sorted into groups to make choosing easier.",
      sections: [
        {
          heading: "How is it different from Muro Salt Nic?",
          paragraphs: [
            "Muro Freebase and [Muro Salt Nic](/products/muro-salt-nic) share the same flavour names; what differs is the nicotine. This one is freebase, the other is salt nic. Let your device decide which one to take, and the flavour you like is there in either.",
            "Because freebase and salt nic suit different kinds of device, your device maker's recommendation is the best guide.",
          ],
        },
        {
          heading: "Which Muro Freebase flavour should I pick?",
          paragraphs: [
            "Start with what you like. We grouped the flavours by the words in their names: for cool, Click Mint; for grape, Grape; for fruit, Watermelon, Strawberry Twist and Peach. Big Cola is named after a drink rather than a fruit, so we list it separately.",
            "If your device lets you set the wattage, [Choosing Wattage & Airflow](/guides/choosing-wattage-and-airflow) explains how to match wattage and airflow to the way you vape.",
          ],
        },
      ],
    },
    zh: {
      lede: "下面说明 Muro Freebase 和 Muro Salt Nic 的区别，并把口味按类型分好组，方便挑选。",
      sections: [
        {
          heading: "和 Muro Salt Nic 有什么不同？",
          paragraphs: [
            "Muro Freebase 和 [Muro Salt Nic](/products/muro-salt-nic) 的口味名称完全相同，不同的是尼古丁：这款是游离碱尼古丁，另一款是盐尼古丁。先根据设备决定选哪一款，喜欢的口味两款都有。",
            "游离碱尼古丁和盐尼古丁适合的设备类型不同，建议参考设备厂家的推荐。",
          ],
        },
        {
          heading: "Muro Freebase 哪个口味好？",
          paragraphs: [
            "可以先从喜欢的类型选起。我们按口味名称里的词来分组：清凉类是 Click Mint，葡萄类是 Grape，水果类有 Watermelon、Strawberry Twist 和 Peach。Big Cola 是饮品名称而不是水果，单独列出。",
            "如果设备可以调功率，怎样让功率和进气配合自己的吸法，详见[如何选择功率与进气量](/guides/choosing-wattage-and-airflow)。",
          ],
        },
      ],
    },
  },
  "muro-sc-8000": {
    th: {
      lede: "Muro SC 8000 มีให้เลือก 12 กลิ่น ด้านล่างร้านจัดกลิ่นเป็นสายไว้ให้เลือกได้ง่ายขึ้น พร้อมเรื่องการชาร์จ และความต่างจาก Muro รุ่นที่พัฟเยอะกว่า",
      sections: [
        {
          heading: "Muro SC 8000 กลิ่นไหนดี",
          paragraphs: [
            "กลิ่นไหนดีขึ้นอยู่กับว่าชอบแนวไหน ลองเลือกจากสายก่อนก็ได้ ร้านจัดสายจากคำในชื่อกลิ่นที่พิมพ์ไว้บนซองของแต่ละกลิ่น สายเย็นมี Extreme Menthol กับ Double Mint ถ้ากำลังหากลิ่นเมนทอล ชื่อในรายการคือ Extreme Menthol",
            "สายผลไม้มี 7 กลิ่น คือ Strawberry · Banana Strawberry · Mix Berries · Grape · Watermelon · Honey Lemon และ Apple Shisha สองกลิ่นหลังมีผลไม้คู่กับอย่างอื่นในชื่อ ร้านก็จัดไว้ในสายนี้ด้วย",
            "ส่วนแนวอื่นมี Cola · Mineral Water และ Yakult ชื่อในกลุ่มนี้เป็นเครื่องดื่ม ไม่ได้บอกว่าเป็นผลไม้ชนิดไหน วิธีเลือกกลิ่นจากชื่อ อ่านต่อได้ที่[พอตกลิ่นไหนดี](/guides/choosing-a-pod-flavor)",
          ],
        },
        {
          heading: "พอตใช้แล้วทิ้งที่ชาร์จซ้ำได้ ใช้ยังไง",
          paragraphs: [
            "Muro SC 8000 ชาร์จซ้ำได้ผ่านช่องชาร์จ USB-C ถ้าแบตหมดก่อนน้ำยา ก็เสียบสายชาร์จแล้วสูบต่อได้ ไม่ต้องเปลี่ยนเครื่องใหม่ทั้งที่น้ำยายังเหลืออยู่",
            "ชาร์จนานแค่ไหน ชาร์จข้ามคืนได้ไหม และชาร์จยังไงให้แบตใช้ได้นาน ร้านเล่าไว้ที่[ชาร์จพอตกี่นาที ชาร์จข้ามคืนได้ไหม](/guides/battery-care-and-charging)",
          ],
        },
        {
          heading: "Muro SC 8000 กับ Connector 20K ต่างกันยังไง",
          paragraphs: [
            "สองรุ่นนี้ใช้งานต่างกัน Muro SC 8000 เป็นพอตใช้แล้วทิ้ง แกะแล้วสูบได้เลย ส่วน [Muro Connector 20K](/products/muro-connector-20k) เป็นหัวพอตบรรจุสำเร็จ รองรับสูงสุด 20,000 พัฟ ต้องใส่กับตัวเครื่อง Creator ของ Muro หรือของ RELX ถ้ามีตัวเครื่องอยู่แล้วและสูบจัด Connector 20K ก็เป็นอีกรุ่นที่น่าดู",
          ],
        },
      ],
    },
    en: {
      lede: "The Muro SC 8000 comes in 12 flavours. Below, we've sorted them into groups to make choosing easier, with a note on charging and on how it differs from Muro's higher-puff model.",
      sections: [
        {
          heading: "Which Muro SC 8000 flavour should I start with?",
          paragraphs: [
            "Start with the kind of flavour you like. We grouped them by the words in the name printed on each pouch. The cool pair is Extreme Menthol and Double Mint; if you're after menthol, the name to look for is Extreme Menthol.",
            "Fruit has seven: Strawberry, Banana Strawberry, Mix Berries, Grape, Watermelon, Honey Lemon and Apple Shisha. The last two pair a fruit with something else, and we keep them here too.",
            "The rest are Cola, Mineral Water and Yakult, all named after drinks rather than a fruit.",
          ],
        },
        {
          heading: "What does rechargeable mean on a disposable?",
          paragraphs: [
            "The Muro SC 8000 charges through a USB-C port. If the battery runs out before the e-liquid does, charge it and keep going, with no need to replace a device that still has e-liquid left.",
            "How long to charge, whether overnight is fine and how to look after the battery are covered in [Battery care](/guides/battery-care-and-charging).",
          ],
        },
        {
          heading: "Muro SC 8000 or Connector 20K?",
          paragraphs: [
            "They work differently. The Muro SC 8000 is a disposable you open and use straight away, while the [Muro Connector 20K](/products/muro-connector-20k) is a prefilled pod rated for up to 20,000 puffs that fits a Muro Creator or RELX Creator device. If you already have one of those and vape a lot, the Connector 20K is worth a look.",
          ],
        },
      ],
    },
    zh: {
      lede: "Muro SC 8000 共有 12 种口味。下面我们按类型分好了组，方便挑选，也讲讲充电，以及它和 Muro 口数更多的型号有什么不同。",
      sections: [
        {
          heading: "Muro SC 8000 哪个口味好？",
          paragraphs: [
            "可以先从喜欢的类型选起。我们按每个包装袋上印的口味名称来分组。清凉类有 Extreme Menthol 和 Double Mint；想找薄荷醇口味，就选 Extreme Menthol。",
            "水果类有 7 款：Strawberry、Banana Strawberry、Mix Berries、Grape、Watermelon、Honey Lemon 和 Apple Shisha。后两款是水果搭配其他元素，也归在这一类。",
            "其余是 Cola、Mineral Water 和 Yakult，名称都是饮品，而不是某种水果。",
          ],
        },
        {
          heading: "可充电的一次性设备，用起来有什么不同？",
          paragraphs: [
            "Muro SC 8000 通过 USB-C 接口充电。如果电池比烟油先用完，充好电就能继续抽，不必在烟油还有剩余时就换新机。",
            "要充多久、能不能整夜充电、怎样让电池更耐用，详见[电池保养](/guides/battery-care-and-charging)。",
          ],
        },
        {
          heading: "Muro SC 8000 和 Connector 20K 怎么选？",
          paragraphs: [
            "两款的用法不同：Muro SC 8000 是一次性设备，拆开就能抽；[Muro Connector 20K](/products/muro-connector-20k) 则是预装烟油的烟弹，标注最多 20,000 口，需要装在 Muro Creator 或 RELX Creator 主机上使用。如果已经有主机、抽得又多，可以看看 Connector 20K。",
          ],
        },
      ],
    },
  },
  // Round "queue 0211" articles, Muro (02/11): no maker site exists — facts = the records in src/data/products/unbranded.ts only
  // (flavour names, verified rows, what the maker's packs/posters print per the record notes), sorted by name only; spec rows
  // marked unverified (bottle size · nicotine mg) are not stated. The Muro / RELX Creator fit already shows twice on the
  // Connector page (shortDescription + whoIsThisFor), so the article leaves it out. Legacy pages render no article FAQ →
  // none written. Thai = thai-copy 02/11.
  "muro-connector-20k": {
    th: {
      lede: "Muro Connector 20K มีให้เลือก 33 กลิ่น ด้านล่างร้านอธิบายการใช้งานของหัวพอตนี้ จัดกลิ่นเป็นสายให้เลือกง่ายขึ้น และเล่าถึงกลิ่นที่มี 50MG ต่อท้ายชื่อด้วย",
      sections: [
        {
          heading: "หัวพอตแบบ Connector ใช้งานยังไง",
          paragraphs: [
            "โปสเตอร์ของ Muro พิมพ์ว่า CONNECTOR POD คือหัวพอตที่ต้องเสียบกับตัวเครื่องก่อนถึงจะสูบได้",
            "ตัวหัวไม่มีแบต แบตอยู่ที่ตัวเครื่องซึ่งขายแยกจากหัว พอน้ำยาในหัวหมด ก็ถอดหัวเดิมออกแล้วใส่หัวใหม่ ส่วนตัวเครื่องใช้ต่อได้ตามเดิม",
          ],
        },
        {
          heading: "Muro Connector 20K กลิ่นไหนดี",
          paragraphs: [
            "แต่ละคนชอบรสไม่เหมือนกัน ลองเริ่มจากสายที่ชอบก่อนก็ได้ ร้านจัดสายจากคำในชื่อกลิ่น สายเย็นมี 4 กลิ่น คือ Double Mint · Cool Mint · Spear Mint และ Blue Ice ส่วนสายองุ่นมี Grape และ Kyoho Grape สำหรับคนที่หาองุ่นเคียวโฮ",
            "สายผลไม้มี 11 กลิ่น มีทั้งผลไม้ชนิดเดียวอย่าง Watermelon กับ Pineapple ผลไม้สองชนิดคู่กันอย่าง Strawberry Peach กับ Banana Strawberry และยังมี Mix Berries · Pink Berry · Honey Lemon · Lemon Jeez · Apple Baraku กับ Fruit Punch",
            "กลิ่นที่ 11 คือ Strawberry Ice Cream ชื่อมีผลไม้คู่กับไอศกรีม ร้านก็จัดไว้ในสายนี้ด้วย",
            "ถ้าชอบแนวชา นม และขนม ฝั่งชามี Green Tea กับ Peach Tea ฝั่งนมมี Yakult กับ Yakult Orange และฝั่งขนมมี Vanilla Ice Cream · Taro Ice Cream · Butterscotch กับ Chocolate Dubai",
            "คำว่า Ice Cream ในชื่อหมายถึงไอศกรีม ไม่ได้บอกว่าเป็นกลิ่นเย็น ส่วน Peach Tea กับ Yakult Orange แม้มีผลไม้ในชื่อ ร้านก็จัดตามคำหลักของชื่อ",
            "แนวอื่นมี Cola · Mineral Water และ Green Slush สามชื่อนี้ไม่ได้บอกผลไม้หรือขนมตรง ๆ วิธีเลือกกลิ่นจากชื่อแบบละเอียด อ่านต่อได้ที่[พอตกลิ่นไหนดี](/guides/choosing-a-pod-flavor)",
          ],
        },
        {
          heading: "กลิ่นที่มี 50MG ต่อท้ายชื่อคืออะไร",
          paragraphs: [
            "ในรายการมี 5 กลิ่นที่ชื่อมี 50MG ต่อท้าย คือ Grape · Watermelon · Double Mint · Mix Berries และ Yakult ห้ากลิ่นนี้มีให้เลือกสองแบบ คือแบบที่มี 50MG ในชื่อ กับแบบที่ไม่มี ก่อนกดเลือก ลองดูชื่อในรายการอีกครั้งให้ตรงกับแบบที่ต้องการ",
          ],
        },
        {
          heading: "หัวพอตหน้าตาเป็นยังไง",
          paragraphs: [
            "ตัวหัวด้านหนึ่งเป็นลายรังผึ้ง อีกด้านพิมพ์ชื่อกลิ่นไว้ ถ้าซื้อไปหลายกลิ่น ก็ดูจากชื่อบนตัวหัวได้เลยว่าหัวไหนเป็นกลิ่นอะไร คลิปของร้านบนหน้านี้เรียกหัวนี้ว่า LEGO ตามหน้าตาของตัวหัว และคำที่ Muro พิมพ์ไว้บนตัวหัวคือ “AWAKE YOUR NOSE.”",
          ],
        },
      ],
    },
    en: {
      lede: "The Muro Connector 20K comes in 33 flavours. Below, how the pod works, the flavours sorted into groups to make choosing easier, and a note on the flavours with 50MG in the name.",
      sections: [
        {
          heading: "How does a connector pod work?",
          paragraphs: [
            "Muro's poster calls it a CONNECTOR POD: a pod that has to go on a device before you can vape. The pod has no battery of its own; the battery is in the device, which is sold separately. When a pod runs out, take it off, put on a new one and keep using the same device.",
          ],
        },
        {
          heading: "Which Muro Connector 20K flavour should I pick?",
          paragraphs: [
            "Everyone's taste is different, so start with the kind you like. We grouped the flavours by the words in their names. The cool four are Double Mint, Cool Mint, Spear Mint and Blue Ice, and the grapes are Grape and Kyoho Grape.",
            "Fruit has eleven: single fruits such as Watermelon and Pineapple, pairs such as Banana Strawberry and Strawberry Peach, plus Mix Berries, Pink Berry, Honey Lemon, Lemon Jeez, Apple Baraku and Fruit Punch. Strawberry Ice Cream pairs a fruit with ice cream, and we keep it here too.",
            "For tea, milk and dessert there's Green Tea and Peach Tea, Yakult and Yakult Orange, and Vanilla Ice Cream, Taro Ice Cream, Butterscotch and Chocolate Dubai. Ice Cream in a name means ice cream, not a cooling flavour. Peach Tea and Yakult Orange name a fruit too, but we sort by the main word.",
            "The rest are Cola, Mineral Water and Green Slush, none of which names a fruit or a dessert outright.",
          ],
        },
        {
          heading: "What are the flavours with 50MG in the name?",
          paragraphs: [
            "Five flavours have 50MG at the end of the name: Grape, Watermelon, Double Mint, Mix Berries and Yakult. Each of these five comes in two versions, one with 50MG in the name and one without, so check the name in the list before you choose.",
          ],
        },
        {
          heading: "What does the pod look like?",
          paragraphs: [
            "One face of the pod has a honeycomb pattern and the other carries the flavour name, so if you buy several flavours you can tell them apart at a glance. Our shop's video on this page calls it the LEGO pod, after its look, and the line Muro prints on the pod is “AWAKE YOUR NOSE.”",
          ],
        },
      ],
    },
    zh: {
      lede: "Muro Connector 20K 共有 33 种口味。下面介绍这款烟弹怎么用，把口味按类型分好组方便挑选，并说明名称带 50MG 的口味。",
      sections: [
        {
          heading: "Connector 烟弹怎么用？",
          paragraphs: [
            "Muro 的海报上印着 CONNECTOR POD，意思是烟弹要先装在主机上才能抽。烟弹本身没有电池，电池在主机里，主机需另外购买。烟弹里的烟油用完后，取下换上新的即可，主机可以继续使用。",
          ],
        },
        {
          heading: "Muro Connector 20K 哪个口味好？",
          paragraphs: [
            "每个人口味不同，可以先从喜欢的类型选起。我们按口味名称里的词来分组。清凉类有 4 款：Double Mint、Cool Mint、Spear Mint 和 Blue Ice；葡萄类有 Grape 和 Kyoho Grape。",
            "水果类有 11 款：既有 Watermelon、Pineapple 这样的单一水果，也有 Banana Strawberry、Strawberry Peach 这样的组合，另外还有 Mix Berries、Pink Berry、Honey Lemon、Lemon Jeez、Apple Baraku 和 Fruit Punch。Strawberry Ice Cream 是水果搭配冰淇淋，也归在这一类。",
            "茶、奶和甜点类：茶有 Green Tea 和 Peach Tea，奶有 Yakult 和 Yakult Orange，甜点有 Vanilla Ice Cream、Taro Ice Cream、Butterscotch 和 Chocolate Dubai。名称里的 Ice Cream 指冰淇淋，并不代表清凉口味。Peach Tea 和 Yakult Orange 名称里也有水果，我们按名称的主词来归类。",
            "其余是 Cola、Mineral Water 和 Green Slush，名称没有直接写出水果或甜点。",
          ],
        },
        {
          heading: "名称带 50MG 的口味是什么？",
          paragraphs: [
            "有 5 款口味名称后面带 50MG：Grape、Watermelon、Double Mint、Mix Berries 和 Yakult。这 5 款各有两个版本：名称带 50MG 的和不带的，选购前请先核对列表里的名称。",
          ],
        },
        {
          heading: "烟弹长什么样？",
          paragraphs: [
            "烟弹一面是蜂窝纹，另一面印着口味名称，买了多种口味也能一眼分清。本页里我们店的视频把它叫作 LEGO 烟弹，取自它的外观；Muro 印在烟弹上的标语是“AWAKE YOUR NOSE.”。",
          ],
        },
      ],
    },
  },
  "muro-3ml": {
    th: {
      lede: "ด้านล่างร้านจัดกลิ่นของ Muro 3ML เป็นสายไว้ให้เลือกได้ง่ายขึ้น และเล่าถึงคำที่พิมพ์อยู่ข้างกล่องของกลิ่น Muro Grape ไว้ด้วย",
      sections: [
        {
          heading: "Muro 3ML กลิ่นไหนดี",
          paragraphs: [
            "เลือกจากสายที่ชอบก่อนก็ได้ ร้านจัดสายจากคำในชื่อกลิ่นที่พิมพ์ไว้บนกล่องของแต่ละกลิ่น สายเย็นมี Smooth Mint กลิ่นเดียว และเป็นชื่อเดียวในรายการที่มีคำว่า Mint",
            "สายองุ่นมีให้เลือกสองกลิ่น คือ Grape กับ Muro Grape ส่วนสายผลไม้มี Watermelon · Very Strawberry · Mix Berries · Strawberry Peach และ Apple Juice ชื่อที่มีผลไม้คู่กับอย่างอื่น อย่าง Honey Lemon กับ Blueberry Bubblegum ร้านก็จัดไว้ในสายนี้ด้วย",
            "แนวอื่นมี Cola · Mineral Water · Green Slush และ Double Shisha สี่ชื่อนี้ไม่ได้บอกผลไม้ตรง ๆ ร้านจึงแยกไว้อีกกลุ่ม วิธีเลือกกลิ่นจากชื่อแบบละเอียด อ่านต่อได้ที่[พอตกลิ่นไหนดี](/guides/choosing-a-pod-flavor)",
          ],
        },
        {
          heading: "ทำไมกล่อง Muro Grape มี VERY STRAWBERRY",
          paragraphs: [
            "ถ้าดูรูปกล่องของกลิ่น Muro Grape จะเห็นคำว่า VERY STRAWBERRY อยู่ที่ด้านข้างกล่อง คำนี้เป็นลายที่ผู้ผลิตพิมพ์มากับกล่องเอง ร้านจึงคงรูปไว้ตามต้นฉบับ กล่องนี้เป็นของกลิ่น Muro Grape ตามชื่อที่พิมพ์หน้ากล่อง ส่วน Very Strawberry มีกล่องของตัวเองแยกเป็นอีกกลิ่นหนึ่ง",
          ],
        },
        {
          heading: "สูบกลิ่นเดิมจนลิ้นชิน ทำยังไงดี",
          paragraphs: [
            "จากที่ร้านเจอ พอสูบกลิ่นเดิมไปสักพัก ลิ้นจะเริ่มชิน จนรู้สึกว่ารสไม่ชัดเท่าตอนแรก หัวพอตของ Muro 3ML แยกกลิ่นกันหัวละกลิ่น ถ้าเป็นแบบนี้ ลองสลับไปกลิ่นในสายอื่นบ้างก็ได้ แล้วค่อยกลับมากลิ่นเดิมทีหลัง",
          ],
        },
      ],
    },
    en: {
      lede: "Below, the Muro 3ML flavours sorted into groups to make choosing easier, plus a note on the words printed on the side of the Muro Grape box.",
      sections: [
        {
          heading: "Which Muro 3ML flavour should I pick?",
          paragraphs: [
            "Start with the kind of flavour you like. We grouped them by the words in the name printed on each flavour's box. The only cool one is Smooth Mint, the one name in the list with Mint in it.",
            "There are two grapes, Grape and Muro Grape. Fruit has Watermelon, Very Strawberry, Mix Berries, Strawberry Peach and Apple Juice, and we keep Honey Lemon and Blueberry Bubblegum here too, as they pair a fruit with something else.",
            "The rest are Cola, Mineral Water, Green Slush and Double Shisha, none of which names a fruit outright.",
          ],
        },
        {
          heading: "Why does the Muro Grape box say VERY STRAWBERRY?",
          paragraphs: [
            "In the Muro Grape box photo you'll see VERY STRAWBERRY on the side panel. That's part of the maker's own box artwork, so we've kept the image as it is. The name printed on the front says Muro Grape; Very Strawberry has its own box as a separate flavour.",
          ],
        },
        {
          heading: "What if a flavour starts to taste flat?",
          paragraphs: [
            "In our experience, after a while on the same flavour your palate gets used to it and the taste seems less clear than at first. Each Muro 3ML pod is a single flavour, so try one from another group for a while, then come back.",
          ],
        },
      ],
    },
    zh: {
      lede: "下面把 Muro 3ML 的口味按类型分好组，方便挑选，也说明 Muro Grape 包装盒侧面印的字。",
      sections: [
        {
          heading: "Muro 3ML 哪个口味好？",
          paragraphs: [
            "可以先从喜欢的类型选起。我们按每个口味包装盒上印的名称来分组。清凉类只有 Smooth Mint 一款，也是列表里唯一带 Mint 的名称。",
            "葡萄类有两款：Grape 和 Muro Grape。水果类有 Watermelon、Very Strawberry、Mix Berries、Strawberry Peach 和 Apple Juice；Honey Lemon 和 Blueberry Bubblegum 是水果搭配其他元素，也归在这一类。",
            "其余是 Cola、Mineral Water、Green Slush 和 Double Shisha，名称没有直接写出水果。",
          ],
        },
        {
          heading: "为什么 Muro Grape 的包装盒上写着 VERY STRAWBERRY？",
          paragraphs: [
            "在 Muro Grape 的包装盒图片里，可以看到侧面印着 VERY STRAWBERRY。这是厂家包装本身的图案，所以我们保留了原样。盒子正面印的名称就是 Muro Grape；Very Strawberry 另有自己的包装盒，是另一款口味。",
          ],
        },
        {
          heading: "同一个口味抽久了觉得味道变淡，怎么办？",
          paragraphs: [
            "根据我们店的经验，同一个口味抽一段时间后，舌头会慢慢习惯，觉得味道不如一开始明显。Muro 3ML 每个烟弹只有一种口味，可以先换另一类口味抽一阵，再换回来。",
          ],
        },
      ],
    },
  },
  // List-new 30/10 (nexBar Switch 15K, warehouse-listed): no maker site. Facts = nexBar's own posters — the 15-flavour
  // line-up the warehouse keeps (Shipnity Max image 2764487: nexMesh Coil · 15000 puffs · 15ML · Nic 3%) and the
  // 10-flavour poster series a Thai shop carries verbatim (vmaniath.com/en/product/1273962: nexMesh Coil · 15000 puffs ·
  // 15ML; the pod prints the nexBar logo, "SWITCH" and a flavour label — the figure under SWITCH is not legible in any source, so it is not quoted).
  // Fit with SALTHUB M Switch (31/10, owner asked Friday to look it up — "ใช้ Chrome หาข้อมูลได้เลย"): no nexBar page exists;
  // Thai shops (vmaniath · goatvapethai "ทำออกมาให้ใช้กับตัวพอตรุ่น M SWITCH เท่านั้น" · pod789 "สำหรับเครื่อง Marbo M switch" ·
  // thshop24) + two reviewers plugging it into an M Switch on video (ปลัดอู๊ดพลังใบ 13/01/2569 · ชาคริต C9Vapor 15/01/2569) →
  // written plainly, no "official" claim (owner-requested lookup, independent hands-on tests). Link only on this page.
  // SEO (owner 30/10): H1 = the model name · H2 "รายละเอียดเพิ่มเติม" → H3 buyer questions · H2 "คำถามที่พบบ่อย".
  "nexbar-switch-15k-pod": {
    th: {
      lede: "nexBar Switch 15K เป็นหัวพอตบรรจุสำเร็จ แต่ละหัวมีน้ำยาของกลิ่นที่เลือกมาในตัว ด้านล่างสรุปจากโปสเตอร์ของ nexBar ไว้ให้ ว่าในหัวพอตมีอะไรบ้าง และ 15 กลิ่นแบ่งได้เป็นแนวไหน",
      sections: [
        {
          heading: "nexBar Switch 15K คืออะไร",
          paragraphs: [
            "nexBar Switch 15K เป็นหัวพอตบรรจุสำเร็จ หัวหนึ่งมีน้ำยา 15mL กับคอยล์ nexMesh อยู่ในตัว จึงไม่ต้องเติมน้ำยาหรือเปลี่ยนคอยล์เองเหมือนหัวพอตเปล่า",
            "หัวรุ่นนี้ใส่กับเครื่อง [SALTHUB M Switch](/products/m-switch-kit) ได้ ใช้หมดหัวหนึ่งก็ถอดเปลี่ยนเป็นหัวใหม่ได้เลย",
            "เลข 15K ในชื่อรุ่นตรงกับตัวเลขบนโปสเตอร์ของ nexBar ที่ระบุว่าหัวหนึ่งสูบได้สูงสุด 15,000 พัฟ",
          ],
        },
        {
          heading: "nexBar Switch 15K มีกลิ่นอะไรบ้าง",
          paragraphs: [
            "รุ่นนี้มีให้เลือก 15 กลิ่น ถ้าแบ่งตามชื่อกลิ่นจะได้ 3 แนว",
            "สายเย็น ชื่อกลิ่นมีคำว่า Ice หรือ Mint ได้แก่ Blueberry Ice · Grape Ice · Watermelon Ice และ Mint",
            "สายผลไม้ ได้แก่ Grape Lychee · Lychee · Mango Peach · Peach Strawberry · Pink Berry · Mixberry · Pineapple · Strawberry Banana และ Strawberry Watermelon",
            "แนวอื่นมี Cola กับ Strawberry Custard",
          ],
        },
        {
          heading: "nexBar Switch 15K ดูยังไงว่าหัวไหนเป็นกลิ่นอะไร",
          paragraphs: [
            "ด้านหน้าหัวพอตพิมพ์โลโก้ nexBar กับคำว่า SWITCH และมีป้ายบอกชื่อกลิ่นอยู่ด้วย ถ้าซื้อไปหลายกลิ่น ก็ดูจากป้ายนี้ได้เลยว่าหัวไหนเป็นกลิ่นอะไร",
          ],
        },
      ],
      faq: [
        {
          question: "nexBar Switch 15K ใช้กับเครื่องอะไร",
          answer: "ใช้กับเครื่อง [SALTHUB M Switch](/products/m-switch-kit) ได้ค่ะ",
        },
        {
          question: "nexBar Switch 15K หัวหนึ่งสูบได้กี่พัฟ",
          answer: "โปสเตอร์ของ nexBar ระบุว่าหัวหนึ่งสูบได้สูงสุด 15,000 พัฟค่ะ ส่วนที่สูบได้จริงขึ้นกับการสูบของแต่ละคนนะคะ",
        },
        {
          question: "nexBar Switch 15K นิโคตินกี่ %",
          answer: "nexBar ระบุความเข้มข้นนิโคตินไว้ 3% ค่ะ",
        },
      ],
    },
    en: {
      lede: "The nexBar Switch 15K is a prefilled pod: each one comes with the e-liquid of the flavour you choose. Below is a summary from nexBar's own posters of what each pod holds and how the 15 flavours group.",
      sections: [
        {
          heading: "What is the nexBar Switch 15K?",
          paragraphs: [
            "The nexBar Switch 15K is a prefilled pod with 15mL of e-liquid and a built-in nexMesh coil, so there is no e-liquid to add and no coil to change as with an empty pod.",
            "It fits the [SALTHUB M Switch](/products/m-switch-kit): when one pod runs out, take it off and put on a new one.",
            "The 15K in the name matches nexBar's poster, which rates each pod for up to 15,000 puffs.",
          ],
        },
        {
          heading: "Which flavours does the nexBar Switch 15K come in?",
          paragraphs: [
            "There are 15 flavours. Grouped by name, they fall into three sets.",
            "Cool, with Ice or Mint in the name: Blueberry Ice, Grape Ice, Watermelon Ice and Mint.",
            "Fruit: Grape Lychee, Lychee, Mango Peach, Peach Strawberry, Pink Berry, Mixberry, Pineapple, Strawberry Banana and Strawberry Watermelon.",
            "Others: Cola and Strawberry Custard.",
          ],
        },
        {
          heading: "How do I tell which flavour a nexBar Switch 15K pod is?",
          paragraphs: [
            "The front of each pod is printed with the nexBar logo and the word SWITCH, along with a flavour label. If you buy several flavours, the label tells you which pod is which.",
          ],
        },
      ],
      faq: [
        {
          question: "Which device does the nexBar Switch 15K fit?",
          answer: "It fits the [SALTHUB M Switch](/products/m-switch-kit).",
        },
        {
          question: "How many puffs does one nexBar Switch 15K pod give?",
          answer: "nexBar's poster rates each pod for up to 15,000 puffs. That is the maker's maximum; how many you actually get depends on how you vape.",
        },
        {
          question: "What nicotine strength is the nexBar Switch 15K?",
          answer: "nexBar's poster gives a nicotine strength of 3%.",
        },
      ],
    },
    zh: {
      lede: "nexBar Switch 15K 是预装烟油的烟弹：选好口味，烟弹里就装着该口味的烟油。下面根据 nexBar 自己的海报，说明烟弹里有什么，以及 15 种口味怎么分。",
      sections: [
        {
          heading: "nexBar Switch 15K 是什么？",
          paragraphs: [
            "nexBar Switch 15K 是预装烟油的烟弹，每颗装有 15mL 烟油，并内置 nexMesh 线圈，不用像空烟弹那样自己加油、换线圈。",
            "这款烟弹可以装在 [SALTHUB M Switch](/products/m-switch-kit) 主机上使用，一颗用完就取下换一颗新的。",
            "名字里的 15K 与 nexBar 海报上的数字一致：每颗烟弹最多 15,000 口。",
          ],
        },
        {
          heading: "nexBar Switch 15K 有哪些口味？",
          paragraphs: [
            "共 15 种口味，按名称大致分为三类。",
            "清凉系，名称带 Ice 或 Mint：Blueberry Ice、Grape Ice、Watermelon Ice 和 Mint。",
            "水果系：Grape Lychee、Lychee、Mango Peach、Peach Strawberry、Pink Berry、Mixberry、Pineapple、Strawberry Banana 和 Strawberry Watermelon。",
            "其他：Cola 和 Strawberry Custard。",
          ],
        },
        {
          heading: "nexBar Switch 15K 怎么分辨是哪种口味？",
          paragraphs: [
            "烟弹正面印有 nexBar 标志和 SWITCH 字样，并带有口味标签。买了好几种口味，看标签就知道哪颗是什么味道。",
          ],
        },
      ],
      faq: [
        {
          question: "nexBar Switch 15K 适用于哪款主机？",
          answer: "可以装在 [SALTHUB M Switch](/products/m-switch-kit) 主机上使用。",
        },
        {
          question: "nexBar Switch 15K 一颗能抽多少口？",
          answer: "nexBar 海报标注每颗最多 15,000 口。这是厂商给出的最大值，实际能抽多少取决于个人的抽吸习惯。",
        },
        {
          question: "nexBar Switch 15K 的尼古丁浓度是多少？",
          answer: "nexBar 海报标注的尼古丁浓度为 3%。",
        },
      ],
    },
  },
  // Articles queue 0211 batch 5 (02/11): UWELL GPP pod — every fact = UWELL's G Pod Platform page (myuwell.com/g-pod-platform).
  // "Fits G5 · G4 · G3" and what the product is stay out: tagline + short description say them twice already (HANDOFF §18).
  // U² Anti-Leak's "150%" is not repeated (no spec row). UWELL's "new GPP cartridges coming in 2026" is not repeated (stale by
  // 11/2026). "The 4-resistance pods here are the refillable kind" = the shop's reading of UWELL's table (pre-filled = 0.9Ω only).
  "coil-94": {
    th: {
      lede: "ด้านล่างสรุปจากหน้า G Pod Platform ของ UWELL ว่า GPP คืออะไร หัว GPP มีกี่ชนิด และ UWELL ใส่อะไรไว้ในตัวหัวบ้าง",
      sections: [
        {
          heading: "GPP คืออะไร ดูยังไงว่าเป็นหัว GPP",
          paragraphs: [
            "GPP ย่อมาจาก G Pod Platform เป็นชื่อที่ UWELL ใช้เรียกระบบหัวพอตของ Caliburn กลุ่มนี้ทั้งหมด หัวในกลุ่มนี้มีคำว่า GPP พิมพ์ไว้บนกล่อง ถ้าอยากรู้ว่าหัวที่มีอยู่เป็นหัว GPP หรือเปล่า ก็ดูที่กล่องได้เลย",
          ],
        },
        {
          heading: "หัว GPP มีกี่ชนิด",
          paragraphs: [
            "หน้า G Pod Platform ของ UWELL แบ่งหัว GPP ไว้ 3 ชนิด",
            "สองชนิดแรกเป็นหัวที่เติมน้ำยาเอง ต่างกันตรงตำแหน่งช่องเติม ชนิดหนึ่งเติมด้านข้าง มีความจุ 3.0mL กับ 2.5mL อีกชนิดเติมด้านบน มีความจุ 3.0mL กับ 2.0mL และทั้งสองชนิดมีให้เลือก 4 ค่าโอห์ม",
            "ชนิดที่สามเป็นหัวพอตบรรจุสำเร็จ มีค่าเดียวคือ 0.9 โอห์ม หัวบนหน้านี้จึงเป็นชนิดที่เติมน้ำยาเอง เพราะมีให้เลือก 4 ค่าโอห์ม ใครยังไม่เคยเติม มีวิธีเติมทีละขั้นอยู่ที่ [เติมพอตยังไง](/guides/refilling-a-pod)",
          ],
        },
        {
          heading: "UWELL ใส่อะไรไว้ในหัว GPP",
          paragraphs: [
            "เรื่องกันรั่ว UWELL ใช้ระบบที่เรียกว่า U² Anti-Leak ซึ่งมีอยู่สองส่วน ส่วนแรกคือ ultrasonic welding ที่ UWELL บอกว่าช่วยให้หัวกันรั่วได้ดีขึ้น ส่วนที่สองคือช่องลมรูปตัว U ที่ช่วยให้ลมไหลได้ดีขึ้น",
            "อีกส่วนคือ PRO-FOCS ระบบปรับรสชาติที่ UWELL บอกว่าผ่านการทดสอบมาอย่างเข้มงวด ช่วยคงรสเดิมของน้ำยาไว้ และใช้ได้กับน้ำยาหลายความเข้มข้น ทั้งนิโคตินแบบ freebase และแบบ salt nic ถ้าอยากรู้ว่านิโคตินสองแบบต่างกันยังไง อ่านต่อได้ที่ [นิโคติน salt nic กับ freebase](/guides/salt-nic-vs-freebase)",
          ],
        },
      ],
    },
    en: {
      lede: "Below, a summary of UWELL's G Pod Platform page: what GPP is, how many kinds of GPP pod there are, and what UWELL builds into them.",
      sections: [
        {
          heading: "What is GPP, and how do I know a pod is GPP?",
          paragraphs: [
            "GPP stands for G Pod Platform, UWELL's name for this whole family of Caliburn pods. The boxes of these pods are marked GPP, so if you're not sure whether a pod you have is GPP, the box will tell you.",
          ],
        },
        {
          heading: "How many kinds of GPP pod are there?",
          paragraphs: [
            "UWELL's G Pod Platform page lists three kinds. Two are refillable and differ in where you fill them: side refill comes in 3.0 mL and 2.5 mL, top refill in 3.0 mL and 2.0 mL, and both come in four resistances. The third kind is pre-filled, in 0.9Ω only. The pods on this page come in four resistances, so they are the refillable kind.",
          ],
        },
        {
          heading: "What does UWELL build into GPP pods?",
          paragraphs: [
            "For leaks, UWELL uses what it calls U² Anti-Leak, made up of two parts: ultrasonic welding, which UWELL says improves leak protection, and a U-shaped channel that improves airflow. UWELL also builds in PRO-FOCS, a flavour system it describes as rigorously tested, made to keep the e-liquid's original taste and to work with a range of nicotine strengths, in both freebase and nicotine-salt form.",
          ],
        },
      ],
    },
    zh: {
      lede: "下面根据 UWELL 的 G Pod Platform 页面，介绍 GPP 是什么、GPP 烟弹有几种，以及 UWELL 在烟弹里用了哪些设计。",
      sections: [
        {
          heading: "GPP 是什么？怎么确认是 GPP 烟弹？",
          paragraphs: [
            "GPP 是 G Pod Platform 的缩写，是 UWELL 对这一整个 Caliburn 烟弹系列的称呼。这些烟弹的包装盒上都印有 GPP，不确定手上的烟弹是不是 GPP，看一下盒子即可。",
          ],
        },
        {
          heading: "GPP 烟弹有几种？",
          paragraphs: [
            "UWELL 的 G Pod Platform 页面把 GPP 烟弹分为 3 种。前两种是可自行注油的烟弹，区别在注油口位置：侧注油有 3.0 mL 和 2.5 mL，顶注油有 3.0 mL 和 2.0 mL，两种都有 4 种阻值。第三种是预注油烟弹，只有 0.9Ω 一种。本页烟弹有 4 种阻值可选，所以属于可注油的类型。",
          ],
        },
        {
          heading: "UWELL 在 GPP 烟弹里用了什么？",
          paragraphs: [
            "防漏方面，UWELL 采用 U² Anti-Leak 技术，由两部分组成：一是超声波焊接，UWELL 表示能提升防漏表现；二是 U 形气道，让气流更顺畅。UWELL 还在烟弹中加入了 PRO-FOCS 口味优化技术，UWELL 称其经过严格测试，能保留烟油原本的味道，并适用于多种浓度的游离碱尼古丁和尼古丁盐。",
          ],
        },
      ],
    },
  },
  // Articles queue 0211 batch 5 (02/11): UWELL Caliburn G coils — facts = UWELL's Caliburn G2, GK2 and X pages (in-app browser
  // 02/11). The bare 0.8 / 1.0 / 1.2 list stays out (tagline + short description give it). UWELL's G2 page (02/11) also says the G2
  // takes the Caliburn G 1.0Ω coil; details PR #1133 then made the spec row "ใช้ได้กับ" say so, so the article leaves G2 + 1.0Ω
  // to the table under it. 03/11 (articles-0311b): "UN2 Meshed-H" section = UWELL's Caliburn G2 + Caliburn X spec rows (full coil
  // names; the 1.0Ω row carries no such name) + UWELL's Caliburn G page (myuwell.com/caliburn/caliburn-g, curl 03/11: "FeCrAl UN2
  // Meshed-H 0.8 Ω" · "Long lasting · Heat evenly and fully atomize the juice · Present full and original flavor" · "make sure the
  // coil aligns with locating slot on the pod"). No Caliburn G product on the site → no link.
  "coil-53": {
    th: {
      lede: "คอยล์ UWELL Caliburn G2 ในหน้านี้มีให้เลือกสามค่า แต่ UWELL ตั้งชื่อรุ่นของแต่ละค่าไว้ต่างกัน และเครื่องแต่ละรุ่นก็ให้คอยล์มาในกล่องคนละแบบ ด้านล่างสรุปไว้ทีละข้อตามที่ UWELL เขียนไว้บนหน้าเครื่องแต่ละรุ่น",
      sections: [
        {
          heading: "แต่ละค่าเป็นคอยล์รุ่นไหน",
          paragraphs: [
            "UWELL เรียกคอยล์ 1.2 โอห์มว่าคอยล์ Caliburn G2 ส่วนอีกสองค่าเรียกว่าคอยล์ Caliburn G และทั้งสามค่าทำจาก FeCrAl",
            "บนหน้า Caliburn G2 UWELL บอกว่าในกล่องเครื่องมีคอยล์ mesh มาให้สองตัว คือ 1.2 กับ 0.8 โอห์ม ตัว 1.2 โอห์มสำหรับสูบแบบ MTL ส่วนตัว 0.8 โอห์มสำหรับสูบ DTL แบบลมแน่น สองแนวการสูบนี้ต่างกันตรงไหน ร้านอธิบายไว้ที่ [MTL กับ DTL ต่างกันยังไง](/guides/understanding-mtl-vs-dtl)",
          ],
        },
        {
          heading: "UN2 Meshed-H คืออะไร",
          paragraphs: [
            "UWELL เขียนชื่อเต็มของคอยล์ 0.8 กับ 1.2 โอห์มไว้บนหน้า Caliburn G2 และหน้า Caliburn X ว่า UN2 Meshed-H ส่วนคอยล์ 1.0 โอห์มไม่ได้ใช้ชื่อนี้",
            "หน้า Caliburn G ของ UWELL ระบุว่าเครื่องรุ่นนั้นใช้คอยล์ UN2 Meshed-H 0.8 โอห์ม และอธิบายคอยล์ตัวนี้ว่าใช้ได้นาน ร้อนสม่ำเสมอจนน้ำยากลายเป็นไอได้เต็มที่ และให้รสที่เต็มและตรงกับรสเดิมของน้ำยา",
            "หน้าเดียวกันนี้ยังแนะนำว่า เวลาเปลี่ยนคอยล์ ให้วางคอยล์ตรงกับร่องบอกตำแหน่งในหัวพอตก่อนใส่ลงไป",
          ],
        },
        {
          heading: "คอยล์ Caliburn G และ G2 ใช้กับเครื่องรุ่นไหน",
          paragraphs: [
            "Caliburn GK2 ใส่ได้ทั้งสามค่า ในกล่องมี 1.2 โอห์มติดเครื่องมา และมี 0.8 โอห์มเป็นตัวสำรอง ส่วน 1.0 โอห์มต้องซื้อแยก",
            "Caliburn X ก็ใช้คอยล์ตระกูล Caliburn G ในกล่องมี 0.8 โอห์มติดเครื่องมา และมี 1.2 โอห์มเป็นตัวสำรอง ส่วน 1.0 โอห์มต้องซื้อแยกเหมือนกัน",
            "ถ้ากำลังหาหัวพอตเปล่าที่ใช้กับคอยล์เหล่านี้ บนเว็บมี [หัวพอต Caliburn X](/products/coil-74) และ [หัวพอต Caliburn G2](/products/coil-55)",
          ],
        },
      ],
    },
    en: {
      lede: "The UWELL Caliburn G2 coils on this page come in three resistances, each with its own UWELL name, and each device comes with a different set of them in the box. Below, one point at a time, as UWELL states on each device's page.",
      sections: [
        {
          heading: "Which coil is each resistance?",
          paragraphs: [
            "UWELL calls the 1.2Ω coil the Caliburn G2 coil and the other two Caliburn G coils; all three are FeCrAl. On its Caliburn G2 page, UWELL says the kit includes two mesh coils, 1.2Ω and 0.8Ω: the 1.2Ω for MTL vaping and the 0.8Ω for a restricted DTL draw. Not sure how the two draws differ? See [MTL vs DTL](/guides/understanding-mtl-vs-dtl).",
          ],
        },
        {
          heading: "What is UN2 Meshed-H?",
          paragraphs: [
            "On its Caliburn G2 and Caliburn X pages, UWELL gives the full name of the 0.8Ω and 1.2Ω coils as UN2 Meshed-H; the 1.0Ω coil does not carry that name. UWELL's Caliburn G page lists the UN2 Meshed-H 0.8Ω coil for that device and describes it as long-lasting, heating evenly to fully vaporise the e-liquid and bringing out the e-liquid's full, original flavour. The same page says to line the coil up with the locating slot in the pod when you replace it.",
          ],
        },
        {
          heading: "Which devices take Caliburn G and G2 coils?",
          paragraphs: [
            "The Caliburn GK2 takes all three: 1.2Ω fitted, 0.8Ω as a spare, 1.0Ω sold separately. The Caliburn X uses Caliburn G-family coils too: 0.8Ω fitted, 1.2Ω as a spare, 1.0Ω sold separately.",
            "Looking for an empty pod for these coils? The site has the [Caliburn X pod](/products/coil-74) and the [Caliburn G2 pod](/products/coil-55).",
          ],
        },
      ],
    },
    zh: {
      lede: "本页的 UWELL Caliburn G2 线圈有三种阻值，UWELL 给每种阻值的命名各不相同，各款设备盒内附带的组合也不一样。下面根据 UWELL 各设备页面逐项说明。",
      sections: [
        {
          heading: "每种阻值是哪款线圈？",
          paragraphs: [
            "UWELL 把 1.2Ω 线圈称为 Caliburn G2 线圈，另外两种称为 Caliburn G 线圈，三款都是 FeCrAl 材质。UWELL 在 Caliburn G2 页面上说明，套装附带 1.2Ω 和 0.8Ω 两颗网状线圈：1.2Ω 用于 MTL 口吸，0.8Ω 用于偏紧的 DTL 肺吸。两种吸法的区别请看[MTL 与 DTL](/guides/understanding-mtl-vs-dtl)。",
          ],
        },
        {
          heading: "UN2 Meshed-H 是什么？",
          paragraphs: [
            "UWELL 在 Caliburn G2 和 Caliburn X 页面上把 0.8Ω、1.2Ω 线圈的全名写作 UN2 Meshed-H，1.0Ω 线圈则没有用这个名字。UWELL 的 Caliburn G 页面列出该设备使用 UN2 Meshed-H 0.8Ω 线圈，并介绍它耐用、受热均匀、能充分雾化烟油，呈现饱满、原本的口味。同一页面还提醒，更换线圈时要让线圈对准烟弹里的定位槽。",
          ],
        },
        {
          heading: "哪些设备可以用 Caliburn G 和 G2 线圈？",
          paragraphs: [
            "Caliburn GK2 三种都能用：出厂装 1.2Ω，附备用 0.8Ω，1.0Ω 需另购。Caliburn X 同样使用 Caliburn G 系列线圈：出厂装 0.8Ω，附备用 1.2Ω，1.0Ω 需另购。",
            "想找能装这些线圈的空烟弹，本站有 [Caliburn X 烟弹](/products/coil-74) 和 [Caliburn G2 烟弹](/products/coil-55)。",
          ],
        },
      ],
    },
  },
  // Articles queue 0211 batch 5 (02/11): UWELL Caliburn X empty pod — facts = UWELL's Caliburn X page (+ the G2 page / coil-55's
  // spec rows for the comparison paragraph). "หัวพอตเปล่า" = THAI_STYLE §3 (no coil in the box). Thai = thai-copy 02/11.
  "coil-74": {
    th: {
      lede: "ด้านล่างบอกว่าหัวพอตเปล่านี้ใส่คอยล์รุ่นไหนได้ น้ำยาเต็มหัวใช้ได้นานแค่ไหนตามที่ UWELL บอก และต่างจากหัวของ Caliburn G2 ตรงไหน",
      sections: [
        {
          heading: "หัวพอตเปล่าคืออะไร",
          paragraphs: [
            "หัวพอตเปล่าคือหัวพอตที่มาแต่ตัวหัว คอยล์เลือกค่าที่ต้องการแล้วใส่เอง จากนั้นก็เติมน้ำยาที่ชอบได้เลย คอยล์กับหัวเป็นคนละชิ้นกัน พอถึงรอบเปลี่ยนคอยล์ก็เปลี่ยนแค่คอยล์ แล้วใช้หัวเดิมต่อได้",
          ],
        },
        {
          heading: "ใส่คอยล์รุ่นไหนได้",
          paragraphs: [
            "ในกล่องชุด Caliburn X มีคอยล์ Caliburn G 0.8 โอห์มติดมากับเครื่อง และคอยล์ Caliburn G2 1.2 โอห์มเป็นตัวสำรอง ส่วนคอยล์ Caliburn G 1.0 โอห์มขายแยก",
            "คอยล์ทั้งสามค่านี้ดูได้ที่หน้า [คอยล์ Caliburn G](/products/coil-53)",
          ],
        },
        {
          heading: "น้ำยาเต็มหัวใช้ได้นานแค่ไหน",
          paragraphs: [
            "UWELL เขียนไว้บนหน้า Caliburn X ว่าแบต 850mAh ของเครื่องกับน้ำยา 3mL ในหัวนี้ สูบได้นานกว่าหนึ่งวัน ไม่ต้องคอยชาร์จหรือเติมน้ำยาบ่อย ส่วนจะอยู่ได้นานแค่ไหนจริง ๆ ก็ขึ้นอยู่กับว่าสูบถี่แค่ไหน",
          ],
        },
        {
          heading: "ต่างจากหัวของ Caliburn G2 ตรงไหน",
          paragraphs: [
            "หัวของ Caliburn G2 ก็ใช้คอยล์ชุดเดียวกันนี้ได้ ที่ต่างกันชัดคือความจุ หัวนั้นจุน้ำยา 2mL ส่วนหัวนี้จุได้มากกว่า ทั้งสองเป็นหัวพอตของคนละชุด จึงควรเลือกให้ตรงกับเครื่องที่ใช้อยู่ ถ้าใช้ Caliburn G2 ดู [หัวพอต Caliburn G2](/products/coil-55) แทนได้เลย",
            "ส่วนวิธีเติมน้ำยาและการดูแลคอยล์ให้ใช้ได้นานขึ้น อ่านต่อได้ที่ [วิธีดูแลคอยล์และหัวพอต](/guides/coil-and-pod-maintenance)",
          ],
        },
      ],
    },
    en: {
      lede: "Below: which coils this empty pod takes, how long a full pod lasts by UWELL's account, and how it differs from the Caliburn G2 pod.",
      sections: [
        {
          heading: "What is an empty pod?",
          paragraphs: [
            "An empty pod comes as the pod alone: you choose the coil you want, fit it yourself, then fill it with the e-liquid you like. The coil and the pod are separate parts, so when it's time for a new coil you change just the coil and keep the same pod.",
          ],
        },
        {
          heading: "Which coils does it take?",
          paragraphs: [
            "The Caliburn X kit comes with the Caliburn G 0.8Ω coil fitted and the Caliburn G2 1.2Ω coil as a spare; the Caliburn G 1.0Ω coil is sold separately. All three are on the [Caliburn G coils](/products/coil-53) page.",
          ],
        },
        {
          heading: "How long does a full pod last?",
          paragraphs: [
            "UWELL's Caliburn X page says the device's 850mAh battery and the 3 mL in this pod give more than a day of vaping, without frequent charging or refilling. How long it really lasts depends on how often you vape.",
          ],
        },
        {
          heading: "How is it different from the Caliburn G2 pod?",
          paragraphs: [
            "The Caliburn G2 pod takes the same coils. The clear difference is capacity: the G2 pod holds 2 mL and this one holds more. Each is the pod of its own kit, so pick the one that matches your device; on a Caliburn G2, see the [Caliburn G2 pod](/products/coil-55) instead. For refilling and coil care, see [coil and pod maintenance](/guides/coil-and-pod-maintenance).",
          ],
        },
      ],
    },
    zh: {
      lede: "下面介绍这款空烟弹能装哪些线圈、按 UWELL 的说法一仓烟油能用多久，以及与 Caliburn G2 烟弹的区别。",
      sections: [
        {
          heading: "什么是空烟弹？",
          paragraphs: [
            "空烟弹只有烟弹本身，线圈按需要的阻值另选、自己装上，再注入喜欢的烟油即可。线圈和烟弹是分开的部件，到了该换线圈的时候只换线圈，烟弹可以继续用。",
          ],
        },
        {
          heading: "能装哪些线圈？",
          paragraphs: [
            "Caliburn X 套装出厂装 Caliburn G 0.8Ω 线圈，附备用 Caliburn G2 1.2Ω 线圈；Caliburn G 1.0Ω 线圈需另购。三款都在[Caliburn G 线圈](/products/coil-53)页面。",
          ],
        },
        {
          heading: "一仓烟油能用多久？",
          paragraphs: [
            "UWELL 在 Caliburn X 页面上写道，设备的 850mAh 电池加上这款烟弹的 3 mL 烟油，可以用一天以上，不必频繁充电或注油。实际能用多久取决于抽吸频率。",
          ],
        },
        {
          heading: "和 Caliburn G2 烟弹有什么不同？",
          paragraphs: [
            "Caliburn G2 烟弹也能用同样这几款线圈，明显的区别在容量：Caliburn G2 烟弹装 2 mL，这款装得更多。两者分属不同套装，请按自己的设备选择；用 Caliburn G2 的话，请看 [Caliburn G2 烟弹](/products/coil-55)。注油和线圈保养请看[线圈与烟弹保养](/guides/coil-and-pod-maintenance)。",
          ],
        },
      ],
    },
  },
  // Articles queue 0211 batch 5, VOOPOO (03/11): VOOPOO PnP coils ("Coil Vinci") — facts = VOOPOO's PnP coil page
  // (voopoo.com/pnpplatform.html: per-model draw style, watts, nicotine, device list), the VINCI 3 page ("pull and push") and
  // VOOPOO's coil guide (voopoo.com/guides/vape-coil-replacement-guide.html: PnP X ≠ original PnP, signs, priming); WebFetch
  // 03/11, quotes in articles-0311/voopoo-facts.md. The O-ring colours in the option names are not explained by VOOPOO → unsaid;
  // no option is mapped to a model name (the article quotes VOOPOO's own table by model). PnP-C1 (spec row, a retailer source)
  // is not on VOOPOO's page → not repeated. No article FAQ.
  "coil-1": {
    th: {
      lede: "คอยล์ VOOPOO Vinci ในหน้านี้คือคอยล์ PnP รุ่นเดิมที่มีให้เลือกหลายค่า ด้านล่างสรุปจากหน้าเว็บของ VOOPOO ว่าคอยล์ระบบนี้คืออะไร แต่ละค่าเหมาะกับการสูบแบบไหน ใช้กับน้ำยานิโคตินเท่าไร ใส่กับเครื่องรุ่นไหนได้ และควรเปลี่ยนเมื่อไหร่",
      sections: [
        {
          heading: "คอยล์ PnP คืออะไร",
          paragraphs: [
            "PnP คือระบบคอยล์ของ VOOPOO ที่ใช้ขั้วเสียบแบบมาตรฐานเดียวกัน คอยล์ตัวเดียวจึงใช้ได้กับเครื่อง VOOPOO หลายรุ่น เปลี่ยนคอยล์ก็ง่าย แค่ดึงตัวเก่าออกแล้วกดตัวใหม่เข้าไป ซึ่ง VOOPOO บอกว่าใช้เวลาเปลี่ยนแค่หนึ่งวินาทีเท่านั้น",
            "VOOPOO ทำคอยล์ระบบนี้ไว้หลายค่า เพื่อให้สลับได้ตามใจ ว่าวันนี้อยากได้ไอเยอะหรืออยากได้รสชัด",
          ],
        },
        {
          heading: "ค่าโอห์มไหนเหมาะกับการสูบแบบไหน",
          paragraphs: [
            "ตามตารางของ VOOPOO คอยล์ค่าต่ำอย่าง 0.15 โอห์มกับ 0.2 โอห์มเป็นคอยล์สำหรับสูบแบบ DL คือดูดลงปอดตรง ๆ และต้องใช้วัตต์สูง เช่น PnP-TW15 0.15 โอห์มอยู่ที่ 55–70 วัตต์ และ PnP-TW20 0.2 โอห์มอยู่ที่ 40–55 วัตต์ ถัดขึ้นมาคือ PnP-TW30 0.3 โอห์ม ที่ VOOPOO จัดไว้เป็นแบบ DL/RTL ใช้ 28–36 วัตต์",
            "ช่วง 0.45 ถึง 0.6 โอห์ม VOOPOO จัดไว้เป็นแบบ RDL เกือบทุกตัว เช่น PnP-DW60 0.6 โอห์มใช้ 18–23 วัตต์ ส่วนคอยล์ 0.8 ถึง 1.2 โอห์มเป็นคอยล์สำหรับสูบแบบ MTL ที่ลมแน่นกว่าและใช้วัตต์ต่ำ เช่น PnP-R2 1.0 โอห์มใช้ 10–15 วัตต์",
            "ก่อนเลือกค่า ควรเช็ควัตต์สูงสุดของเครื่องที่ใช้อยู่ด้วย เพราะคอยล์ค่าต่ำต้องใช้เครื่องที่จ่ายไฟได้สูง",
          ],
        },
        {
          heading: "ใช้กับน้ำยานิโคตินเท่าไร",
          paragraphs: [
            "VOOPOO แนะนำความเข้มข้นนิโคตินไว้ต่างกันตามรุ่นคอยล์ คอยล์ mesh ค่าต่ำอย่าง PnP-VM6 0.15 โอห์ม PnP-VM5 0.2 โอห์ม และ PnP-VM1 0.3 โอห์ม แนะนำไว้ไม่เกิน 10mg ส่วน PnP-VM3 0.45 โอห์มกับ PnP-VM4 0.6 โอห์มไม่เกิน 25mg และคอยล์ MTL อย่าง PnP-R1 0.8 โอห์มกับ PnP-R2 1.0 โอห์มใช้ได้ถึง 35mg",
          ],
        },
        {
          heading: "คอยล์ VOOPOO PnP ใช้กับเครื่องไหนได้บ้าง",
          paragraphs: [
            "หน้าคอยล์ PnP ของ VOOPOO ระบุว่า PnP-R1 กับ PnP-R2 ใช้ได้กับเครื่องหลายรุ่นในตระกูล VINCI และ DRAG เช่น VINCI X และ [DRAG X](/products/drag-x) รวมถึงหัว PnP 22 กับ PnP 20 ส่วนคอยล์บางรุ่น VOOPOO ระบุเครื่องไว้เฉพาะ เช่น PnP-VM6 ที่ทำมาให้ DRAG X และ PnP-VM5 ที่ระบุไว้กับ VINCI X และ DRAG S",
            "VOOPOO บอกไว้ด้วยว่ารายชื่อนี้มีไว้ใช้อ้างอิง และการสูบจริงอาจต่างกันไปตามเครื่อง",
            "เครื่องรุ่นใหม่อย่าง VINCI S และ DRAG X3 ใช้คอยล์อีกระบบหนึ่งคือ PnP X ซึ่ง VOOPOO บอกว่าใช้กับเครื่อง PnP รุ่นเดิมไม่ได้ เครื่อง PnP รุ่นเดิมจึงต้องใช้คอยล์ PnP อย่างตระกูล VM หรือตระกูล TW",
            "แม้หน้านี้จะใช้ชื่อว่า Coil Vinci แต่ VOOPOO ไม่ได้ใส่คอยล์ PnP รุ่นเดิมไว้ในรายการที่ใช้กับ VINCI S ถ้าใช้เครื่องรุ่นใหม่อยู่ ดูคอยล์ได้ที่หน้า [คอยล์ VOOPOO PnP X](/products/coil-92) และถ้าใช้ VINCI S อยู่ ให้เลือกคอยล์ PnP X ค่า 0.3 โอห์มขึ้นไปเท่านั้น",
          ],
        },
        {
          heading: "เปลี่ยนคอยล์ VOOPOO เมื่อไหร่ ใส่ตัวใหม่แล้วต้องทำอะไร",
          paragraphs: [
            "คู่มือเปลี่ยนคอยล์ของ VOOPOO บอกว่าไม่มีกำหนดตายตัว ให้สังเกตจากอาการ เช่น สูบแล้วมีรสไหม้ รสจางลง ไอน้อยลง น้ำยารั่วหรือมีเสียงน้ำยาดังจ๊อก ๆ หรือน้ำยาในหัวพอตเปลี่ยนเป็นสีเข้ม",
            "พอใส่คอยล์ใหม่ ให้หยดน้ำยาลงรูสำลีของคอยล์สักสองสามหยดก่อน แล้วเติมน้ำยาทิ้งไว้ 5–10 นาทีให้สำลีชุ่ม ระหว่างใช้ก็ตั้งวัตต์ให้อยู่ในช่วงที่ VOOPOO แนะนำ และไม่สูบรัว [คอยล์ก็จะใช้ได้นานขึ้น](/guides/coil-and-pod-maintenance)",
          ],
        },
      ],
    },
    en: {
      lede: "The VOOPOO Vinci coils on this page are VOOPOO's original PnP coils, in many resistances. Below, from VOOPOO's own pages: what the system is, which resistance suits which draw, what nicotine strength each is made for, which devices they fit and when to change one.",
      sections: [
        {
          heading: "What is a PnP coil?",
          paragraphs: [
            "PnP is VOOPOO's coil system with one standard connection, so the same coil fits many VOOPOO devices. Changing one is a pull and a push — VOOPOO says it takes a second — and the range is wide enough to switch between big clouds and stronger flavour whenever you like.",
          ],
        },
        {
          heading: "Which resistance suits which draw?",
          paragraphs: [
            "In VOOPOO's table the low resistances, 0.15Ω and 0.2Ω, are for an open DL draw at high wattage: the PnP-TW15 0.15Ω runs at 55–70W and the PnP-TW20 0.2Ω at 40–55W. The PnP-TW30 0.3Ω, which VOOPOO labels DL/RTL, runs at 28–36W.",
            "From 0.45Ω to 0.6Ω VOOPOO rates almost every coil RDL, such as the PnP-DW60 0.6Ω at 18–23W; from 0.8Ω to 1.2Ω they are tighter MTL coils at low wattage, such as the PnP-R2 1.0Ω at 10–15W. Check your device's maximum output first — the low-resistance coils need a device that can deliver high power.",
          ],
        },
        {
          heading: "What nicotine strength are they for?",
          paragraphs: [
            "VOOPOO gives a ceiling per model: the low-resistance mesh coils — PnP-VM6 0.15Ω, PnP-VM5 0.2Ω and PnP-VM1 0.3Ω — up to 10 mg; the PnP-VM3 0.45Ω and PnP-VM4 0.6Ω up to 25 mg; and MTL coils such as the PnP-R1 0.8Ω and PnP-R2 1.0Ω up to 35 mg.",
          ],
        },
        {
          heading: "Which devices do VOOPOO PnP coils fit?",
          paragraphs: [
            "VOOPOO's PnP coil page lists the PnP-R1 and PnP-R2 for devices such as the VINCI, VINCI R, VINCI X, DRAG S, [DRAG X](/products/drag-x), DRAG Baby, FIND Trio, NAVI and the PnP 22 and PnP 20 tanks; for some coils VOOPOO names specific devices, like the PnP-VM6 made for the DRAG X and the PnP-VM5 listed for the VINCI X and DRAG S. VOOPOO adds that the list is for reference and the experience can vary by device.",
            "Newer devices such as the VINCI S and DRAG X3 use a different system, PnP X, which VOOPOO says does not fit original PnP devices — so original PnP devices need PnP coils such as the VM or TW series. Although this page is named Coil Vinci, VOOPOO does not list original PnP coils for the VINCI S. For a newer device, see [VOOPOO PnP X coils](/products/coil-92); on a VINCI S, pick 0.3Ω or above.",
          ],
        },
        {
          heading: "When should I change a coil, and what do I do with a new one?",
          paragraphs: [
            "VOOPOO's coil guide says there's no fixed schedule — watch for a burnt or muted taste, less vapour, leaking or gurgling, or e-liquid turning dark. Prime a new coil with a few drops of e-liquid into the wick holes, then let the filled pod sit 5–10 minutes. Staying within the recommended wattage and not chain vaping [makes a coil last longer](/guides/coil-and-pod-maintenance).",
          ],
        },
      ],
    },
    zh: {
      lede: "本页的 VOOPOO Vinci 线圈是 VOOPOO 原版 PnP 线圈，有多种阻值可选。下面根据 VOOPOO 官网的资料，介绍这套系统是什么、哪个阻值适合哪种抽法、各自适合多少尼古丁、适用哪些设备，以及什么时候该换。",
      sections: [
        {
          heading: "PnP 线圈是什么？",
          paragraphs: [
            "PnP 是 VOOPOO 采用统一标准接口的线圈系统，同一颗线圈可用于多款 VOOPOO 设备。换线圈只需一拔一推，VOOPOO 表示一秒就能完成；阻值选择很多，想要大烟雾还是浓口感可以随时切换。",
          ],
        },
        {
          heading: "哪个阻值适合哪种抽法？",
          paragraphs: [
            "按 VOOPOO 的表格，0.15Ω、0.2Ω 这类低阻值用于直肺（DL），需要高功率：PnP-TW15 0.15Ω 为 55–70W，PnP-TW20 0.2Ω 为 40–55W；PnP-TW30 0.3Ω 标为 DL/RTL，功率 28–36W。",
            "0.45Ω 到 0.6Ω 的线圈 VOOPOO 几乎都标为 RDL，例如 PnP-DW60 0.6Ω 为 18–23W；0.8Ω 到 1.2Ω 是吸感较紧的 MTL，功率较低，例如 PnP-R2 1.0Ω 为 10–15W。请先确认自己设备的最大输出功率，低阻值线圈需要能输出高功率的设备。",
          ],
        },
        {
          heading: "适合多少尼古丁的烟油？",
          paragraphs: [
            "VOOPOO 按型号给出上限：低阻值网状线圈 PnP-VM6 0.15Ω、PnP-VM5 0.2Ω 和 PnP-VM1 0.3Ω 为 10 mg 以内；PnP-VM3 0.45Ω 和 PnP-VM4 0.6Ω 为 25 mg 以内；PnP-R1 0.8Ω、PnP-R2 1.0Ω 等 MTL 线圈可到 35 mg。",
          ],
        },
        {
          heading: "VOOPOO PnP 线圈适用哪些设备？",
          paragraphs: [
            "VOOPOO 的 PnP 线圈页面列出，PnP-R1 和 PnP-R2 适用于 VINCI、VINCI R、VINCI X、DRAG S、[DRAG X](/products/drag-x)、DRAG Baby、FIND Trio、NAVI 以及 PnP 22 和 PnP 20 雾化器；部分线圈 VOOPOO 标注了特定设备，例如专为 DRAG X 做的 PnP-VM6，以及标注 VINCI X 和 DRAG S 的 PnP-VM5。VOOPOO 也说明该列表仅供参考，实际体验会因设备而异。",
            "VINCI S、DRAG X3 等新款设备用的是另一套 PnP X 系统，VOOPOO 表示它不适用于原版 PnP 设备，因此原版 PnP 设备需要使用 VM、TW 系列等 PnP 线圈。本页虽名为 Coil Vinci，但 VOOPOO 并未把原版 PnP 线圈列为 VINCI S 适用。用新款设备的话，请看 [VOOPOO PnP X 线圈](/products/coil-92)；VINCI S 请选 0.3Ω 及以上。",
          ],
        },
        {
          heading: "什么时候换线圈？新线圈要怎么处理？",
          paragraphs: [
            "VOOPOO 的换线圈指南说没有固定周期，出现焦味、味道变淡、烟雾变少、漏油或咕噜声、烟油颜色变深时就该换了。新线圈先在导油孔滴几滴烟油，注油后静置 5–10 分钟让棉芯充分吸油。功率保持在推荐范围内、避免连续猛抽，[线圈会更耐用](/guides/coil-and-pod-maintenance)。",
          ],
        },
      ],
    },
  },
  // Articles queue 0211 batch 5, VOOPOO (03/11): DRAG X — every fact = VOOPOO's DRAG X page (voopoo.com/drag-series/drag-x.html,
  // WebFetch 03/11) + its PnP coil page (voopoo.com/pnpplatform.html) for the R1/R2 fit; quotes in the side-session notes
  // articles-0311/voopoo-facts.md. Left out (already twice on the page): the 0.001 s chip, the magnetic 4.5mL pod, the
  // 18650 sold apart, 80W, PnP-RBA. Legacy page → no article FAQ.
  "drag-x": {
    th: {
      lede: "ด้านล่างสรุปเรื่อง VOOPOO DRAG X จากหน้าเว็บของแบรนด์ ว่าโหมด SCORE คืออะไร ปรับลมได้แค่ไหน คอยล์สองตัวในกล่องต่างกันตรงไหน ใส่คอยล์ตัวอื่นได้ไหม และในกล่องมีอะไรมาให้บ้าง",
      sections: [
        {
          heading: "โหมด SCORE ของ DRAG X คืออะไร",
          paragraphs: [
            "นอกจากโหมด SMART แล้ว ชิปของ DRAG X ยังมีโหมดอื่นให้ใช้ด้วย คือโหมด PUFF กับโหมด SCORE",
            "โหมด SCORE จะดูขนาดไอของการสูบแต่ละครั้ง แล้วปลดล็อกระดับใหม่ไปเรื่อย ๆ ตั้งแต่ระดับ IRON ไปจนถึงระดับ KING",
          ],
        },
        {
          heading: "DRAG X ปรับลมได้แค่ไหน",
          paragraphs: [
            "Infinite Airflow System คือชื่อระบบลมของ DRAG X [ปรับขนาดช่องลมได้ตามที่ต้องการ](/guides/choosing-wattage-and-airflow) และ VOOPOO บอกว่าจะใส่คอยล์แบบไหนหรือตั้งค่าไว้เท่าไร ก็ปรับลมให้สูบได้สบายเหมือนกัน",
          ],
        },
        {
          heading: "คอยล์สองตัวในกล่องต่างกันยังไง",
          paragraphs: [
            "ในกล่องมีคอยล์ mesh มาให้สองตัว ตัวแรกคือ PnP-VM6 0.15 โอห์ม ที่ VOOPOO พัฒนามาให้ DRAG X โดยเฉพาะ และบอกว่าให้ไอก้อนใหญ่กับรสที่ชัด ส่วนตัวที่สองคือ PnP-VM1 0.3 โอห์ม ที่ใช้วัตต์น้อยกว่า",
            "VOOPOO แนะนำให้ใช้คอยล์ทั้งสองตัวนี้กับน้ำยาความเข้มข้นนิโคตินไม่เกิน 10mg",
          ],
        },
        {
          heading: "DRAG X ใส่คอยล์ตัวอื่นได้ไหม",
          paragraphs: [
            "ได้ เปลี่ยนคอยล์ทำได้ง่าย แค่ดึงตัวเก่าออกแล้วกดตัวใหม่เข้าไป หน้าคอยล์ PnP ของ VOOPOO ยังระบุว่าคอยล์ MTL อย่าง PnP-R1 0.8 โอห์มกับ PnP-R2 1.0 โอห์มใช้กับ DRAG X ได้ด้วย ถ้าชอบสูบแบบ MTL ที่ลมแน่นกว่า ก็เลือกสองตัวนี้ได้",
            "คอยล์ PnP ค่าอื่น ๆ มีให้เลือกที่หน้า [คอยล์ VOOPOO PnP](/products/coil-1) ส่วนคอยล์ PnP X ของเครื่องรุ่นใหม่เป็นอีกระบบหนึ่ง VOOPOO บอกว่าใช้กับเครื่อง PnP รุ่นเดิมไม่ได้",
          ],
        },
        {
          heading: "ในกล่องมีอะไรบ้าง",
          paragraphs: [
            "ในกล่องมีตัวเครื่อง หัวพอตหนึ่งหัว คอยล์สองตัวที่พูดถึงข้างบน สาย USB-C คู่มือ และการ์ดอีกสองใบ คือ Warranty Card กับ Chip Card",
          ],
        },
      ],
    },
    en: {
      lede: "The VOOPOO DRAG X, from VOOPOO's own page: how its SCORE mode and airflow work, how the two coils in the box differ, which other coils fit, and what comes in the box.",
      sections: [
        {
          heading: "What is SCORE mode?",
          paragraphs: [
            "Besides SMART mode, the DRAG X's chip offers other functions such as PUFF and SCORE modes. SCORE mode reads the cloud size of each puff and unlocks new levels as you go, from IRON all the way to KING.",
          ],
        },
        {
          heading: "How far does the airflow adjust?",
          paragraphs: [
            "The DRAG X's airflow is called the Infinite Airflow System: [the airway can be set to any size](/guides/choosing-wattage-and-airflow), and VOOPOO says you can get a comfortable draw whichever coil you fit and whatever settings you use.",
          ],
        },
        {
          heading: "How do the two coils in the box differ?",
          paragraphs: [
            "Both are mesh coils. The PnP-VM6 0.15Ω was developed specially for the DRAG X, and VOOPOO says it gives big clouds with strong flavour; the PnP-VM1 0.3Ω runs at lower wattage. VOOPOO recommends e-liquid of up to 10 mg nicotine strength for both.",
          ],
        },
        {
          heading: "Can the DRAG X take other coils?",
          paragraphs: [
            "Yes — pull the old coil out and push the new one in. VOOPOO's PnP coil page lists MTL coils such as the PnP-R1 0.8Ω and PnP-R2 1.0Ω for the DRAG X too, the ones to pick for a tighter draw. Other PnP coils are on the [VOOPOO PnP coils](/products/coil-1) page. PnP X coils, made for VOOPOO's newer devices, are a different system that VOOPOO says does not fit original PnP devices.",
          ],
        },
        {
          heading: "What's in the box?",
          paragraphs: [
            "The box holds the device, one pod, the two coils above, a USB-C cable, the user manual, a warranty card and a chip card.",
          ],
        },
      ],
    },
    zh: {
      lede: "下面根据 VOOPOO 官网的资料，介绍 VOOPOO DRAG X 的 SCORE 模式和气流怎么用、盒内两颗线圈有什么区别、还能换哪些线圈，以及盒里有什么。",
      sections: [
        {
          heading: "SCORE 模式是什么？",
          paragraphs: [
            "除了 SMART 模式，DRAG X 的芯片还提供 PUFF、SCORE 等功能模式。SCORE 模式会根据每一口的烟雾大小，一级级解锁新等级，从 IRON 一直到 KING。",
          ],
        },
        {
          heading: "气流能调到什么程度？",
          paragraphs: [
            "DRAG X 的气流系统名为 Infinite Airflow System，[气道大小可以随意调节](/guides/choosing-wattage-and-airflow)；VOOPOO 表示无论装哪种线圈、设什么参数，都能获得舒适的吸感。",
          ],
        },
        {
          heading: "盒内两颗线圈有什么区别？",
          paragraphs: [
            "两颗都是网状线圈。PnP-VM6 0.15Ω 是 VOOPOO 专为 DRAG X 开发的，官方表示烟雾大、口感浓郁；PnP-VM1 0.3Ω 所需功率较低。VOOPOO 建议两颗都搭配尼古丁不超过 10 mg 的烟油。",
          ],
        },
        {
          heading: "DRAG X 能换其他线圈吗？",
          paragraphs: [
            "可以，拔出旧线圈、推入新线圈即可。VOOPOO 的 PnP 线圈页面也把 PnP-R1 0.8Ω 和 PnP-R2 1.0Ω 这类 MTL 线圈列为 DRAG X 适用，想要紧一点的吸感可以选它们。其他 PnP 线圈见 [VOOPOO PnP 线圈](/products/coil-1)。新款设备用的 PnP X 线圈是另一套系统，VOOPOO 表示它不适用于原版 PnP 设备。",
          ],
        },
        {
          heading: "盒里有什么？",
          paragraphs: [
            "盒内包含主机、烟弹 1 个、上面提到的两颗线圈、USB-C 数据线、说明书、保修卡和芯片卡。",
          ],
        },
      ],
    },
  },
  // Owner task ก6 (08/11), VOOPOO: DRAG X2 — every fact = VOOPOO's DRAG X2 page (voopoo.com/drag-series/drag-x2, curl 08/11:
  // "Professional 2nd generation" · leather + metal, metal corners reworked · debossed vegan leather · C-frame battery cover · new
  // Menu UI · top airflow controls e-liquid and condensate leaking · PnP X Cartridge DTL side-filling, MTL cartridge in the "fully
  // compatible" set · cartridge spec 50–70% VG, nicotine ≤10 mg · six protections). Left out: 18650, 80W, 5mL and the three modes
  // (already twice on the page), the coil-by-coil wattage/airflow (coil-92's article), the second coil in the box (this page says
  // 0.3Ω, the shop's box list 0.2Ω — the spec row is not this batch's). Legacy page → no article FAQ.
  "drag-x2": {
    th: {
      lede: "ด้านล่างสรุปเรื่อง VOOPOO DRAG X2 จากหน้าเว็บของแบรนด์ ว่าปรับอะไรจากรุ่นก่อน ใช้งานมือเดียวสะดวกตรงไหน ใส่หัวพอตกับคอยล์แบบไหนได้ ควรใช้น้ำยาแบบไหน และชิปมีระบบป้องกันอะไรบ้าง",
      sections: [
        {
          heading: "DRAG X2 ปรับอะไรจากรุ่นก่อน",
          paragraphs: [
            "VOOPOO เรียก DRAG X2 ว่าเป็นรุ่นที่สองของสายนี้ ยังคงดีไซน์หนังคู่กับโลหะแบบเดิม และตัวหนังเป็นหนังวีแกนลายกด",
            "ส่วนที่ปรับคือมุมโลหะของตัวเครื่อง VOOPOO เกลาให้รับกับมือ และบอกว่าหยิบขึ้นมาครั้งแรกก็รู้สึกถึงความต่าง",
          ],
        },
        {
          heading: "ใช้งานด้วยมือเดียวสะดวกตรงไหน",
          paragraphs: [
            "ฝาถ่านเป็นแบบ C-frame ที่ VOOPOO ออกแบบมาให้เปลี่ยนถ่านได้ง่าย",
            "หน้าจอใช้เมนูแบบใหม่ที่เน้นข้อมูลหลักให้อ่านง่าย ตั้งค่าอะไรไว้ก็เห็นบนจอตามนั้น",
          ],
        },
        {
          heading: "ใส่หัวพอตและคอยล์แบบไหนได้",
          paragraphs: [
            "หัวพอตที่มากับเครื่องคือ PnP X Cartridge DTL แบบเติมน้ำยาด้านข้าง หน้าเว็บของ DRAG X2 ยังแสดงหัวพอต PnP X Cartridge MTL ไว้ในกลุ่มของที่ใช้ร่วมกันได้ด้วย ถ้าต้องการหัวพอตเปล่าสำรอง ดูได้ที่หน้า [หัวพอตเปล่า VOOPOO PnP X](/products/coil-56)",
            "VOOPOO บอกว่าการรับลมจากด้านบนของหัวพอตช่วยลดการรั่วของน้ำยาและไอที่ควบแน่น",
            "คอยล์ PnP X มีหลายค่า ตั้งแต่ค่าสำหรับสูบแบบ DTL ไปจนถึง MTL แต่ละค่าเหมาะกับการสูบแบบไหนและควรเปิดลมแค่ไหน สรุปไว้ที่หน้า [คอยล์ VOOPOO PnP X](/products/coil-92)",
          ],
        },
        {
          heading: "ควรใช้น้ำยาแบบไหน",
          paragraphs: [
            "สำหรับหัวพอต PnP X Cartridge DTL ที่ให้มา VOOPOO แนะนำน้ำยา VG 50–70% และนิโคตินสูงสุด 10mg ถ้ายังไม่คุ้นกับตัวเลข VG อ่านต่อได้ที่ [PG VG คืออะไร ต่างกันยังไง](/guides/pg-vg-in-e-liquid)",
          ],
        },
        {
          heading: "ชิปมีระบบป้องกันอะไรบ้าง",
          paragraphs: [
            "ชิป Gene.TT 2.0 มีระบบป้องกัน 6 อย่าง ได้แก่ กดสูบนานเกินกำหนด ไฟลัดวงจร ชาร์จเกิน กระแสไฟออกเกิน แบตเตอรี่ต่ำ และชิปร้อนเกิน",
          ],
        },
      ],
    },
    en: {
      lede: "The VOOPOO DRAG X2, from VOOPOO's own page: what changed from the earlier model, what makes it easy to use one-handed, which pods and coils fit, what e-liquid to use, and which protections the chip has.",
      sections: [
        {
          heading: "What changed from the earlier model?",
          paragraphs: [
            "VOOPOO calls the DRAG X2 the second generation of the line. It keeps the classic pairing of leather and metal, with debossed vegan leather. What changed is the metal corners, reworked to fit your hand; VOOPOO says you notice the difference the moment you pick it up.",
          ],
        },
        {
          heading: "What makes it easy to use one-handed?",
          paragraphs: [
            "The C-frame battery cover is there to make swapping the battery easy, and a new menu puts the main information up front on the screen, so what you set is what you see.",
          ],
        },
        {
          heading: "Which pods and coils fit?",
          paragraphs: [
            "It comes with the PnP X Cartridge DTL, which fills from the side, and the DRAG X2 page also shows the PnP X Cartridge MTL in its set of compatible parts. Spare empty pods are on the [VOOPOO PnP X empty pod](/products/coil-56) page.",
            "VOOPOO says the pod's top airflow helps keep e-liquid and condensate from leaking.",
            "PnP X coils come in several resistances, from DTL to MTL. Which one suits which draw, and how far to open the airflow, is on the [VOOPOO PnP X coil](/products/coil-92) page.",
          ],
        },
        {
          heading: "What e-liquid should I use?",
          paragraphs: [
            "For the PnP X Cartridge DTL in the box, VOOPOO recommends 50–70% VG e-liquid with nicotine up to 10 mg. If VG numbers are new to you, see [PG and VG: what they are and how they differ](/guides/pg-vg-in-e-liquid).",
          ],
        },
        {
          heading: "Which protections does the chip have?",
          paragraphs: [
            "The Gene.TT 2.0 chip has six: overtime, short-circuit, overcharge, output over-current, low battery and chip over-temperature protection.",
          ],
        },
      ],
    },
    zh: {
      lede: "下面根据 VOOPOO 官网的资料，介绍 VOOPOO DRAG X2 比上一代改了什么、单手使用方便在哪里、能装哪些烟弹和线圈、该用什么烟油，以及芯片有哪些保护。",
      sections: [
        {
          heading: "DRAG X2 比上一代改了什么？",
          paragraphs: [
            "VOOPOO 称 DRAG X2 为这一系列的第二代，延续皮革搭配金属的经典设计，皮革为压纹素皮。改动在于机身的金属边角，经过打磨更贴合手型，VOOPOO 表示一拿起来就能感受到差别。",
          ],
        },
        {
          heading: "单手使用方便在哪里？",
          paragraphs: [
            "C 型电池盖让更换电池更方便；全新的菜单界面突出主要信息，设置了什么，屏幕上就显示什么。",
          ],
        },
        {
          heading: "能装哪些烟弹和线圈？",
          paragraphs: [
            "随机附带的是侧注油的 PnP X Cartridge DTL，DRAG X2 页面也把 PnP X Cartridge MTL 列在兼容配件里。备用空烟弹见 [VOOPOO PnP X 空烟弹](/products/coil-56)。",
            "VOOPOO 表示烟弹的顶部进气设计有助于减少烟油和冷凝液渗漏。",
            "PnP X 线圈有多种阻值，从 DTL 到 MTL 都有。每种阻值适合哪种吸法、气流该开多大，见 [VOOPOO PnP X 线圈](/products/coil-92)。",
          ],
        },
        {
          heading: "该用什么烟油？",
          paragraphs: [
            "针对盒内附带的 PnP X Cartridge DTL，VOOPOO 建议使用 VG 50–70%、尼古丁不超过 10 mg 的烟油。不熟悉 VG 数值的话，可以看 [PG 和 VG 是什么、有什么区别](/guides/pg-vg-in-e-liquid)。",
          ],
        },
        {
          heading: "芯片有哪些保护？",
          paragraphs: [
            "Gene.TT 2.0 芯片共有六项保护：防超时、短路保护、过充保护、输出过流保护、低电保护和芯片过温保护。",
          ],
        },
      ],
    },
  },
  // Articles queue 0211 batch 5, VOOPOO (03/11): VINCI S — every fact = VOOPOO's VINCI S page (voopoo.com/vinci-series/vinci-s,
  // WebFetch 03/11; quotes in articles-0311/voopoo-facts.md). Left out (already twice): 2000mAh, 40W, the 4.5mL topside fill.
  // "Seven layers of safety" is not quoted (the page lists six). The VINCI PnP X cartridge is not linked to coil-56: VOOPOO names
  // it apart from the DRAG S2/X2 PnP X pod. Legacy page → no article FAQ.
  "vinci-s": {
    th: {
      lede: "ด้านล่างสรุปเรื่อง VOOPOO VINCI S จากหน้าเว็บของแบรนด์ ว่าแบตใช้ได้นานแค่ไหน ต้องตั้งวัตต์เองไหม ใส่หัวพอตแบบไหนได้บ้าง และหัวพอตที่ให้มาในกล่องดีขึ้นตรงไหน",
      sections: [
        {
          heading: "VINCI S แบตอยู่ได้นานแค่ไหน",
          paragraphs: [
            "VOOPOO บอกว่าแบตของ VINCI S ถ้าสูบจัดจะใช้ได้ 3 วัน ถ้าสูบเบา ๆ อยู่ได้ถึงหนึ่งสัปดาห์ แต่ใช้ได้จริงกี่วันก็ขึ้นกับการสูบของแต่ละคน",
            "VOOPOO ออกแบบ VINCI S ให้เป็นพอตคิทดีไซน์เรียบสำหรับใช้ทุกวัน ตั้งใจให้ใช้ได้นานขึ้น รสชาติดีขึ้น และใช้ง่ายขึ้น ตัวเครื่องทำจากอะลูมิเนียมอัลลอยกับ PC และหนัก 69 กรัม",
          ],
        },
        {
          heading: "ต้องตั้งวัตต์เองไหม",
          paragraphs: [
            "ไม่ต้อง ชิป GENE.TT 2.0 อ่านค่าโอห์มของหัวพอตที่เสียบอยู่ แล้วเลือกวัตต์ที่เหมาะให้เอง ถ้าเปลี่ยนไปใส่หัวพอตอีกแบบก็ไม่ต้องตั้งค่าใหม่ เสียบหัวแล้วสูบต่อได้เลย",
            "ไฟ LED บนตัวเครื่องบอกระดับแบตให้เห็น และ VOOPOO บอกว่า[ปรับช่องลมได้ละเอียดแบบไม่มีขั้น](/guides/choosing-wattage-and-airflow) ตั้งลมได้ตามที่ชอบ",
          ],
        },
        {
          heading: "VINCI S ใส่หัวพอตแบบไหนได้บ้าง",
          paragraphs: [
            "VOOPOO ระบุว่า VINCI S ใช้หัวพอตได้สามแบบ แบบแรกคือหัวพอต VINCI S ที่มีคอยล์ในตัว มีค่า 0.6 โอห์มกับ 0.8 โอห์ม แบบที่สองคือหัวพอตของ VINCI E ซึ่งมีคอยล์ในตัวเหมือนกัน มีค่า 0.3 โอห์ม 0.6 โอห์ม และ 0.8 โอห์ม",
            "แบบที่สามคือหัวพอต VINCI PnP X ที่เปลี่ยนคอยล์ได้ มีทั้งรุ่น DTL และรุ่น MTL แต่ VOOPOO บอกว่าเครื่องนี้ไม่รองรับหัวพอตหรือคอยล์ที่ต่ำกว่า 0.3 โอห์ม คอยล์ PnP X 0.15 โอห์มกับ 0.2 โอห์มจึงใช้กับเครื่องนี้ไม่ได้",
            "คอยล์ PnP X ค่าอื่นมีให้เลือกที่หน้า [คอยล์ VOOPOO PnP X](/products/coil-92) ส่วนคอยล์ PnP รุ่นเดิม รวมถึงคอยล์ที่ร้านลงไว้ในชื่อ Coil Vinci นั้น VOOPOO ไม่ได้ใส่ไว้ในรายการที่ใช้กับเครื่องนี้",
          ],
        },
        {
          heading: "หัวพอตในกล่องดีขึ้นตรงไหน",
          paragraphs: [
            "หัวพอตที่ให้มาในกล่องเป็นหัว VINCI S 0.8 โอห์ม ใช้โครงสร้าง iCOSM CODE 2.0 ที่ VOOPOO บอกว่ากันรั่วได้ดีขึ้น และให้รสที่นุ่มสม่ำเสมอ",
            "ข้างในหัวยังมีอีกสามส่วนที่ VOOPOO ตั้งชื่อไว้ คือ Golden Cotton, Liquid-Seal Shield และ Mega-Core ส่วนตัวเลขความทนของหัวรุ่นนี้ VOOPOO ระบุไว้ที่ 100mL",
          ],
        },
        {
          heading: "ในกล่องมีอะไรบ้าง",
          paragraphs: [
            "รายการในกล่องของ VOOPOO มีตัวเครื่อง หัวพอตหนึ่งหัว และคู่มือ ไม่มีสายชาร์จอยู่ในรายการ จึงควรเตรียมสาย USB-C ไว้เอง",
          ],
        },
      ],
    },
    en: {
      lede: "The VOOPOO VINCI S, from VOOPOO's own page: how long the battery lasts, why there's no wattage to set, which pods it takes, and what's new in the pod in the box.",
      sections: [
        {
          heading: "How long does the battery last?",
          paragraphs: [
            "VOOPOO says the VINCI S battery holds steady for three days of heavy use and lasts up to a week of lighter use; real-world time depends on how you vape. VOOPOO designed it as a minimalist pod kit for every day — longer-lasting, better-tasting and simpler to operate — in aluminium alloy and PC, at 69 g.",
          ],
        },
        {
          heading: "Do I need to set the wattage?",
          paragraphs: [
            "No. The GENE.TT 2.0 chip reads the resistance of the pod you fit and picks the power for you, and there's nothing to reset when you switch to a different pod. An LED shows the battery level, and VOOPOO says [the airflow adjusts steplessly](/guides/choosing-wattage-and-airflow) to your liking.",
          ],
        },
        {
          heading: "Which pods fit the VINCI S?",
          paragraphs: [
            "VOOPOO lists three kinds: the VINCI S cartridge (coil built in, 0.6Ω or 0.8Ω), the VINCI E cartridge (coil built in, 0.3Ω, 0.6Ω or 0.8Ω) and the VINCI PnP X cartridge with replaceable coils, in DTL and MTL versions. VOOPOO also states that the VINCI S does not support cartridges or coils below 0.3Ω, so the 0.15Ω and 0.2Ω PnP X coils are not for this device. The others are on the [VOOPOO PnP X coils](/products/coil-92) page; VOOPOO does not list the original PnP coils — including the ones this shop lists as Coil Vinci — for the VINCI S.",
          ],
        },
        {
          heading: "What's new in the included pod?",
          paragraphs: [
            "The pod in the box is a VINCI S 0.8Ω cartridge built on iCOSM CODE 2.0, which VOOPOO says improves leak resistance and gives smooth, consistent flavour. VOOPOO also names three parts inside — the Liquid-Seal Shield, the Mega-Core and Golden Cotton — and gives the cartridge a 100 mL endurance figure.",
          ],
        },
        {
          heading: "What's in the box?",
          paragraphs: [
            "VOOPOO's box list has the device, one pod and the user manual — no charging cable is listed, so have a USB-C cable ready.",
          ],
        },
      ],
    },
    zh: {
      lede: "下面根据 VOOPOO 官网的资料，介绍 VOOPOO VINCI S 的续航有多久、为什么不用自己调功率、能装哪些烟弹，以及盒内烟弹有哪些改进。",
      sections: [
        {
          heading: "电池能用多久？",
          paragraphs: [
            "VOOPOO 表示，VINCI S 重度使用电量可稳定支撑 3 天，轻度使用最长可用一周，实际时间取决于个人抽吸习惯。VOOPOO 把它设计成日常使用的简约烟弹套装，目标是更耐用、口感更好、操作更简单，机身为铝合金加 PC，重 69 g。",
          ],
        },
        {
          heading: "需要自己调功率吗？",
          paragraphs: [
            "不需要。GENE.TT 2.0 芯片会读取所装烟弹的阻值并自动匹配功率，换用其他烟弹时也无需重新设置。机身的 LED 灯显示电量，VOOPOO 表示[气流可无级调节](/guides/choosing-wattage-and-airflow)，按喜好设定。",
          ],
        },
        {
          heading: "VINCI S 能装哪些烟弹？",
          paragraphs: [
            "VOOPOO 列出三种：VINCI S 烟弹（一体式线圈，0.6Ω 或 0.8Ω）、VINCI E 烟弹（一体式线圈，0.3Ω、0.6Ω 或 0.8Ω），以及可换线圈的 VINCI PnP X 烟弹，分 DTL 和 MTL 两版。VOOPOO 同时注明 VINCI S 不支持低于 0.3Ω 的烟弹或线圈，因此 0.15Ω 和 0.2Ω 的 PnP X 线圈不能用在这台机器上。其他阻值见 [VOOPOO PnP X 线圈](/products/coil-92)；VOOPOO 没有把原版 PnP 线圈（包括本店以 Coil Vinci 为名的线圈）列为 VINCI S 适用。",
          ],
        },
        {
          heading: "盒内烟弹有哪些改进？",
          paragraphs: [
            "盒内附带的是 VINCI S 0.8Ω 烟弹，采用 iCOSM CODE 2.0 结构，VOOPOO 表示防漏性能更好，口感顺滑稳定。VOOPOO 还提到内部三个有名称的部件：Liquid-Seal Shield、Mega-Core 和 Golden Cotton，并给出 100 mL 的耐用数据。",
          ],
        },
        {
          heading: "盒里有什么？",
          paragraphs: [
            "VOOPOO 列出的盒内物品有主机、烟弹 1 个和说明书，清单中没有充电线，请自备 USB-C 线。",
          ],
        },
      ],
    },
  },
  // Articles queue 0211 batch 5, RELX (03/11): Infinity 2 Plus — every fact = RELX's own product page
  // (relxnow.com/products/relx-infinity-2-plus-device, curl 03/11; WebFetch was rate-limited): what each mode is for, Boost "up to
  // 15% more vapor than Smooth mode", the Infinity 2's 5.5 / 6.5 / 8W, the orange button + "Plus" icon, the RELX Pod / Pod Pro /
  // Pod Pro 2 fit, RELX + WAKA flavours. Not said: that one click switches modes (the page has only the heading "3 Power Levels,
  // 1 Simple Click" — checker #1185). Left out (already twice on the page): the Plus's own watts, 440mAh, 15 min → 80%, the
  // 4-level indicator, 1.9mL / 600 puffs. Shop article standard (owner 03/11): main keyword "RELX Infinity 2 Plus". Legacy page → no FAQ.
  "relx-infinity-2-plus": {
    th: {
      lede: "ด้านล่างสรุปจากหน้าเว็บของ RELX ว่าโหมดของ RELX Infinity 2 Plus แต่ละโหมดเหมาะกับการสูบแบบไหน รุ่นนี้ต่างจาก Infinity 2 ตรงไหน และเลือกหัวกับกลิ่นได้จากไหนบ้าง",
      sections: [
        {
          heading: "RELX Infinity 2 Plus แต่ละโหมดต่างกันยังไง",
          paragraphs: [
            "RELX อธิบายไว้ว่าโหมด Eco สูบได้เบา ๆ และช่วยประหยัดแบต โหมด Smooth ให้รสนุ่มแบบที่คุ้นเคย ส่วนโหมด Boost ให้รสเข้มขึ้น และให้ควันมากกว่าโหมด Smooth ได้ถึง 15%",
            "อยากรู้ว่าวัตต์เท่าไรเหมาะกับตัวเอง อ่านต่อได้ที่ [เลือกวัตต์และการปรับลม](/guides/choosing-wattage-and-airflow) ส่วนวิธีดูแลแบตอยู่ที่ [ดูแลแบตและการชาร์จ](/guides/battery-care-and-charging)",
          ],
        },
        {
          heading: "Infinity 2 Plus ต่างจาก Infinity 2 ตรงไหน",
          paragraphs: [
            "RELX เทียบให้ดูทีละโหมดว่า Infinity 2 รุ่นก่อนใช้ 5.5 วัตต์ 6.5 วัตต์ และ 8 วัตต์ตามลำดับ ส่วน Infinity 2 Plus ใช้วัตต์สูงกว่าในทุกโหมด",
            "หน้าตาก็ต่างกันด้วย Infinity 2 Plus มีปุ่มสีส้ม และมีไอคอน Plus อยู่บนตัวเครื่อง ทำให้แยกออกจาก Infinity 2 ได้ทันที",
          ],
        },
        {
          heading: "Infinity 2 Plus ใช้หัวอะไร เลือกกลิ่นได้ที่ไหน",
          paragraphs: [
            "นอกจากหัวพอตสามรุ่นที่บอกไว้ด้านบน RELX ยังบอกว่าเลือกกลิ่นได้ทั้งของ RELX และของ WAKA",
            "หัว RELX Pod Pro 2 ร้านลงไว้ในชื่อ [หัวพอต RELX Infinity Pro 2](/products/relx-infinity-pro-2-pod) ดูกลิ่นที่มีให้เลือกได้ที่หน้านั้น",
          ],
        },
      ],
    },
    en: {
      lede: "Below, from RELX's own page: what each RELX Infinity 2 Plus mode is for, how it differs from the Infinity 2, and where its pods and flavours come from.",
      sections: [
        {
          heading: "How do the RELX Infinity 2 Plus modes differ?",
          paragraphs: [
            "RELX describes Eco as the mode that saves battery with lighter puffs, Smooth as the one for a familiar, smooth flavour, and Boost as the one for a more intense flavour with up to 15% more vapour than Smooth. Not sure which wattage suits you? See [choosing wattage and airflow](/guides/choosing-wattage-and-airflow), and for making the battery last, [battery care and charging](/guides/battery-care-and-charging).",
          ],
        },
        {
          heading: "How is the Infinity 2 Plus different from the Infinity 2?",
          paragraphs: [
            "RELX compares the two mode by mode: the Infinity 2 runs at 5.5W, 6.5W and 8W, and the Infinity 2 Plus runs at a higher wattage in every mode. It also looks different: an orange button and a \"Plus\" icon on the body set it apart.",
          ],
        },
        {
          heading: "Which pods and flavours for the Infinity 2 Plus?",
          paragraphs: [
            "Beyond the three pod types above, RELX says you can choose from both RELX and WAKA flavours. We list the RELX Pod Pro 2 as the [RELX Infinity Pro 2 pod](/products/relx-infinity-pro-2-pod), where you can see every flavour on offer.",
          ],
        },
      ],
    },
    zh: {
      lede: "下面根据 RELX 官网的资料，介绍 RELX Infinity 2 Plus 各模式适合怎样的抽吸、与 Infinity 2 有何不同，以及烟弹和口味从哪里选。",
      sections: [
        {
          heading: "RELX Infinity 2 Plus 各模式有什么区别？",
          paragraphs: [
            "RELX 介绍：Eco 模式抽吸更轻，也更省电；Smooth 模式口感顺滑、熟悉；Boost 模式口味更浓，烟雾量最多比 Smooth 模式多 15%。不确定多大功率适合自己，可以看[功率与气流怎么选](/guides/choosing-wattage-and-airflow)；电池保养见[电池保养与充电](/guides/battery-care-and-charging)。",
          ],
        },
        {
          heading: "Infinity 2 Plus 和 Infinity 2 有什么不同？",
          paragraphs: [
            "RELX 逐个模式做了对比：Infinity 2 分别为 5.5W、6.5W 和 8W，Infinity 2 Plus 每个模式的功率都更高。外观也不同：橙色按键和机身上的“Plus”标识，让它一眼就能和 Infinity 2 区分开。",
          ],
        },
        {
          heading: "Infinity 2 Plus 用什么烟弹？口味从哪里选？",
          paragraphs: [
            "除上面提到的三种烟弹外，RELX 还表示可在 RELX 与 WAKA 的口味中选择。本店的 RELX Pod Pro 2 以 [RELX Infinity Pro 2 烟弹](/products/relx-infinity-pro-2-pod) 的名称上架，可在该页查看全部口味。",
          ],
        },
      ],
    },
  },
  // Articles queue 0211 batch 5 (04/11, articles-0311b): WOTOFO nexPOD 15K Pro Kit — every fact = WOTOFO's own Shopify pages read
  // 04/11 (curl .json): nexpod-15k-pro-kit-20mg ("Click the button 5 times within 2 seconds") · nexpod-15k-pro-device ("side-mounted
  // airflow key … tighter or airier draw", "Choose the Pro Device if you / Choose the Standard Device if you") ·
  // nexpod-15k-prefilled-pod-20mg ("professionally blended by Wotofo flavor experts", "smooth and rich flavor from the first puff
  // until the last drop", "Transparent Pod Design … avoid dry hits", "one-piece sealed shell … zero mess or leaks") ·
  // nexpod-15k-refillable-pod ("Easy Side Fill Design", "Not compatible with the nexPOD 15K Device", "Up to 10ml" / "Up to 30ml", "Dual nexMESH", "0.5Ω",
  // "wait 3 minutes", "Fill the pod fully(10ml) on first use"). Left out (already twice on the page): 1200mAh · aluminium · the
  // 16/12W and 25/20W levels · pod recognition · 18mL / 0.8Ω / 15,000 puffs · "swap the pod, keep the device". No cost or eco
  // claims (WOTOFO's "Cost Savings" / "Eco-Friendly" stay out). Legacy page → no article FAQ. refilling-a-pod is thaiOnly → th only.
  "nexpod-15k": {
    th: {
      lede: "WOTOFO nexPOD 15K Pro Kit เปิดเครื่องและปรับลมยังไง หัวพอตที่ให้มาในกล่องมีจุดเด่นอะไร ใช้กับหัวพอตเติมเองได้ไหม และตัวเครื่อง Pro ต่างจากรุ่นธรรมดาตรงไหน ด้านล่างสรุปให้ทีละเรื่องจากหน้าเว็บของผู้ผลิต",
      sections: [
        {
          heading: "nexPOD 15K เปิดเครื่องและปรับลมยังไง",
          paragraphs: [
            "จะเปิดหรือปิดเครื่อง ให้กดปุ่ม 5 ครั้งภายใน 2 วินาที",
            "ปุ่มปรับลมอยู่ด้านข้างตัวเครื่อง ใช้สลับลมได้สองแบบ คือลมแน่นกับลมโล่ง ถ้ายังไม่แน่ใจว่าแบบไหนเหมาะกับตัวเอง ร้านอธิบายไว้ที่ [เลือกวัตต์และช่องลม](/guides/choosing-wattage-and-airflow)",
          ],
        },
        {
          heading: "หัวพอตที่ให้มาในกล่องมีจุดเด่นอะไร",
          paragraphs: [
            "WOTOFO ให้ทีมผู้เชี่ยวชาญด้านกลิ่นของแบรนด์ผสมน้ำยาแต่ละกลิ่นเอง เพื่อให้รสคงที่ไปจนหมดหัว ส่วนคอยล์ในหัว WOTOFO บอกว่าให้รสนุ่มและเต็มตั้งแต่พัฟแรกไปจนน้ำยาหยดสุดท้าย",
            "หัวพอตเป็นแบบใส มองเห็นน้ำยาที่เหลือได้ตลอด จะได้รู้ก่อนว่าน้ำยาใกล้หมดและไม่สูบจนได้รสไหม้ เปลือกของหัวเป็นชิ้นเดียวและปิดสนิท WOTOFO บอกว่าแบบนี้ช่วยให้หัวสะอาด ไม่เลอะ และไม่รั่ว",
          ],
        },
        {
          heading: "ใช้กับหัวพอตเติมเองได้ไหม",
          paragraphs: [
            "ได้ WOTOFO มีหัวพอต nexPOD 15K แบบเติมเองขายแยก แต่ WOTOFO ระบุไว้ว่าใช้กับตัวเครื่อง nexPOD 15K รุ่นธรรมดาไม่ได้",
            "หัวพอตเติมเองใช้คอยล์ mesh สองตัว 0.5 โอห์ม เติมน้ำยาได้ครั้งละสูงสุด 10mL และ WOTOFO ระบุว่าหัวหนึ่งเติมได้รวมสูงสุด 30mL",
            "หัวนี้เติมน้ำยาทางด้านข้าง วิธีเติมคือเปิดจุกซิลิโคน เติมน้ำยาให้เต็ม ปิดจุก แล้วรอราว 3 นาทีให้น้ำยาซึมเข้าคอยล์ก่อนใส่เข้าตัวเครื่อง WOTOFO แนะนำให้เติมเต็ม 10mL ตั้งแต่ครั้งแรกที่ใช้ เพื่อให้คอยล์ชุ่มน้ำยาทั่วทั้งตัว วิธีเติมทั่วไปดูได้ที่ [เติมน้ำยาพอตยังไง](/guides/refilling-a-pod)",
          ],
        },
        {
          heading: "ตัวเครื่อง Pro ต่างจากรุ่นธรรมดายังไง",
          paragraphs: [
            "WOTOFO แนะนำให้เลือกตัวเครื่อง Pro ถ้าอยากได้ไอมากกว่า อยากสลับระหว่างการสูบแบบนุ่มกับแบบแรง หรือจะใช้หัวพอตเติมเอง",
            "ส่วนตัวเครื่องรุ่นธรรมดา WOTOFO บอกว่าเหมาะกับคนที่อยากได้เครื่องใช้ง่าย ไม่ยุ่งยาก ไว้สูบทุกวัน และชอบการสูบที่นุ่มและสม่ำเสมอ",
          ],
        },
      ],
    },
    en: {
      lede: "Below, from WOTOFO's own pages: how to switch the WOTOFO nexPOD 15K Pro Kit on and set its airflow, what the pod in the box offers, whether it takes a refillable pod, and how the Pro device differs from the standard one.",
      sections: [
        {
          heading: "How do I switch the nexPOD 15K on and set the airflow?",
          paragraphs: [
            "Press the button 5 times within 2 seconds to switch it on or off. A side-mounted airflow key switches between a tighter and an airier draw — see [choosing wattage and airflow](/guides/choosing-wattage-and-airflow) if you're not sure which suits you.",
          ],
        },
        {
          heading: "What does the pod in the box offer?",
          paragraphs: [
            "WOTOFO has its own flavour experts blend each flavour for a consistent taste from start to finish, and says the pod's coil gives smooth, rich flavour from the first puff to the last drop. The pod is transparent, so you can always see how much e-liquid is left and avoid a dry hit. Its one-piece sealed shell, WOTOFO says, keeps the pod clean, with no mess or leaks.",
          ],
        },
        {
          heading: "Does it take a refillable pod?",
          paragraphs: [
            "Yes. WOTOFO sells a nexPOD 15K Refillable Pod separately; WOTOFO says it is not compatible with the standard nexPOD 15K Device. It uses dual mesh coils at 0.5Ω, takes up to 10 mL per fill, and WOTOFO rates each pod for up to 30 mL of refills in total.",
            "It fills from the side: open the silicone stopper, fill the tank, close the stopper and wait about 3 minutes for the coil to saturate before inserting the pod. WOTOFO recommends filling it fully (10 mL) from the very first use so the coil is fully saturated.",
          ],
        },
        {
          heading: "How does the Pro device differ from the standard one?",
          paragraphs: [
            "WOTOFO suggests the Pro device if you prefer stronger vapour, want to switch between smooth and powerful performance, or plan to use the refillable pod; the standard device, it says, suits anyone after a simple everyday device with a smooth, consistent output.",
          ],
        },
      ],
    },
    zh: {
      lede: "下面根据 WOTOFO 官网的资料，介绍 WOTOFO nexPOD 15K Pro Kit 怎么开关机和调气流、盒内烟弹有什么特点、能不能用自注油烟弹，以及 Pro 主机和标准主机有什么区别。",
      sections: [
        {
          heading: "nexPOD 15K 怎么开机、怎么调气流？",
          paragraphs: [
            "2 秒内连按按键 5 次即可开机或关机。机身侧面有气流调节键，可在偏紧和偏松两种吸感之间切换；不确定哪种适合自己，可以看[如何选择功率和气流](/guides/choosing-wattage-and-airflow)。",
          ],
        },
        {
          heading: "盒内的烟弹有什么特点？",
          paragraphs: [
            "WOTOFO 的每款口味都由自家调香师调配，让口味从头到尾保持一致；WOTOFO 还表示，烟弹里的线圈从第一口到最后一滴都能带来顺滑饱满的口感。烟弹为透明设计，随时能看到剩余烟油，避免干烧。外壳为一体式密封设计，WOTOFO 表示能让烟弹保持干净，不脏手、不漏油。",
          ],
        },
        {
          heading: "能用自注油烟弹吗？",
          paragraphs: [
            "可以。WOTOFO 另售 nexPOD 15K 自注油烟弹，WOTOFO 注明它不适用于标准版 nexPOD 15K 主机。它采用 0.5Ω 双网状线圈，每次最多可注 10 mL，WOTOFO 标注每颗累计最多可注 30 mL。",
            "它从侧面注油：打开硅胶塞，注满烟油，盖好塞子，等约 3 分钟让线圈吸饱后再装入主机。WOTOFO 建议从第一次使用起就注满 10 mL，让线圈充分浸润。",
          ],
        },
        {
          heading: "Pro 主机和标准主机有什么区别？",
          paragraphs: [
            "WOTOFO 建议：喜欢更大烟雾、想在顺滑与强劲之间切换，或打算用自注油烟弹的话，选 Pro 主机；标准主机则适合想要简单易用、输出顺滑稳定的日常设备的人。",
          ],
        },
      ],
    },
  },
  // Owner task ก6 (09/11), RELX: Ultra Pod — every fact = RELX's own store page relxnow.com/products/relx-maxgo-ultra-pod, read 09/11:
  // FAQ "improved leak-proof design that utilizes an advanced Air Pressure Balance System … stays securely inside the pod, regardless of
  // everyday movement" · description "multi-layered structural design" · "click perfectly into your RELX MAXGO device for a stable,
  // drop-proof magnetic connection" · "No messy refills or coil changes required. Simply swap out your empty pod" · flavour notes
  // "Watermelon: A crisp, juicy, and sweet summer classic" / "Sunrise Lemon Lime: … citrusy lemon and tangy lime" / "Cherry Cola: A
  // nostalgic, fizzy blend with a bold cherry kick" · image alt "18mg/ml single pod packaging" (one pod a pack). Kit pairing =
  // relxnow.com/products/relx-ultra-kit "It's best used with UltraPod". Pod Pro facts = its own verified rows + RELX's Pod Pro page
  // collections (Fruit · Mint · Tea · Tobacco · Beverage · Dessert). Left out (already on the page): 2mL, 18mg/ml, 5,000 puffs, mesh 10W,
  // the visible e-liquid, the device list. Blueberry Sour Raspberry has no RELX note of its own (the description says "Blue Raspberry").
  // Legacy page → no article FAQ.
  "relx-ultra-pod": {
    th: {
      lede: "ด้านล่างสรุปจากหน้าเว็บของ RELX ว่า Ultra Pod กันน้ำยารั่วเวลาพกติดตัวยังไง ยึดกับตัวเครื่องแบบไหน และ RELX เล่ารสของแต่ละกลิ่นไว้ว่ายังไง",
      sections: [
        {
          heading: "พก RELX Ultra Pod ใส่กระเป๋า น้ำยาจะรั่วไหม",
          paragraphs: [
            "RELX ใช้ระบบที่เรียกว่า Air Pressure Balance System กับโครงสร้างด้านในหลายชั้น เพื่อให้น้ำยาอยู่ในหัวพอตแม้จะพกติดตัวไปไหนมาไหนระหว่างวัน",
          ],
        },
        {
          heading: "RELX Ultra Pod ยึดกับตัวเครื่องยังไง",
          paragraphs: [
            "หัวพอตยึดกับตัวเครื่องด้วยแม่เหล็ก และ RELX บอกว่าออกแบบให้เข้าล็อกได้พอดีและหลุดยาก",
            "เมื่อน้ำยาหมดก็ถอดหัวเดิมออกแล้วใส่หัวใหม่ได้ทันที โดยไม่ต้องเติมน้ำยาหรือเปลี่ยนคอยล์เอง",
          ],
        },
        {
          heading: "RELX Ultra Pod แต่ละกลิ่นรสเป็นยังไง",
          paragraphs: [
            "RELX เล่ารสไว้ 3 กลิ่น คือ Watermelon เป็นแตงโมหวานฉ่ำแบบผลไม้หน้าร้อน Sunrise Lemon Lime เป็นเลมอนกับไลม์ที่เปรี้ยวสดชื่น ส่วน Cherry Cola เป็นโคล่าซ่า ๆ ที่มีรสเชอร์รีเด่นขึ้นมา",
            "หัวรุ่นนี้ขายแพ็กละ 1 หัว อยากลองหลายกลิ่นก็เลือกแยกทีละกลิ่นได้",
          ],
        },
        {
          heading: "อยากได้กลิ่นให้เลือกมากกว่านี้ ดูรุ่นไหนต่อ",
          paragraphs: [
            "หัวพอตอีกรุ่นของ RELX อย่าง [RELX Pod Pro](/products/relx-pod-pro) มีกลิ่นให้เลือกมากกว่า โดย RELX แบ่งไว้เป็นกลุ่มผลไม้ ชา เครื่องดื่ม ของหวาน มินต์ และยาสูบ บางกลิ่นยังมีแบบ 0mg/ml ด้วย แต่ก่อนเลือก ลองเช็คว่าเครื่องที่ใช้อยู่เป็นรุ่นที่ RELX ระบุไว้สำหรับ Pod Pro คือ Infinity 2 Plus · Essential 2 และ Artisan Plus",
            "ส่วนเครื่องที่ RELX แนะนำให้ใช้คู่กับหัวพอตรุ่นนี้คือ [RELX Ultra Kit](/products/relx-ultra-kit)",
          ],
        },
      ],
    },
    en: {
      lede: "What RELX's own page says about the Ultra Pod: how it stays sealed in a pocket, how it attaches to the device, and what each flavour tastes like.",
      sections: [
        {
          heading: "Will the RELX Ultra Pod leak in a pocket or bag?",
          paragraphs: [
            "RELX builds this pod around what it calls an Air Pressure Balance System, with a structure of several layers inside, to keep the e-liquid in the pod as you carry it through the day.",
          ],
        },
        {
          heading: "How does the RELX Ultra Pod attach to the device?",
          paragraphs: [
            "It attaches with magnets, and RELX says it is designed to click firmly into place and stay put.",
            "When it runs out, you take it off and fit a new one. There is no e-liquid to refill and no coil to change.",
          ],
        },
        {
          heading: "What do the RELX Ultra Pod flavours taste like?",
          paragraphs: [
            "RELX describes three of them: Watermelon as a crisp, juicy, sweet summer fruit, Sunrise Lemon Lime as lemon and lime with a zesty edge, and Cherry Cola as a fizzy cola with a bold cherry note.",
            "Each pack holds one pod, so you can try several flavours one at a time.",
          ],
        },
        {
          heading: "Want more flavours to choose from?",
          paragraphs: [
            "RELX's other pod, the [RELX Pod Pro](/products/relx-pod-pro), has a longer list, grouped by RELX into fruit, tea, beverage, dessert, mint and tobacco, and some flavours also come at 0mg/ml. Before choosing it, check that your device is one RELX lists for the Pod Pro: the Infinity 2 Plus, Essential 2 or Artisan Plus.",
            "RELX recommends pairing this pod with the [RELX Ultra Kit](/products/relx-ultra-kit).",
          ],
        },
      ],
    },
    zh: {
      lede: "下面整理 RELX 官网对 Ultra Pod 的介绍：随身携带时如何防漏、怎样与主机连接，以及每个口味的味道。",
      sections: [
        {
          heading: "RELX Ultra Pod 放在口袋或包里会漏油吗？",
          paragraphs: [
            "RELX 为这款烟弹设计了名为 Air Pressure Balance System 的系统，内部采用多层结构，让烟油在日常随身携带时也留在烟弹里。",
          ],
        },
        {
          heading: "RELX Ultra Pod 怎样与主机连接？",
          paragraphs: [
            "烟弹通过磁吸与主机连接，RELX 表示它的设计能稳稳卡入、不易脱落。",
            "烟油用完后取下旧烟弹、装上新的即可，无需注油，也无需更换线圈。",
          ],
        },
        {
          heading: "RELX Ultra Pod 各口味是什么味道？",
          paragraphs: [
            "RELX 介绍了其中 3 款：Watermelon 是清脆多汁、香甜的夏日西瓜；Sunrise Lemon Lime 是柠檬配青柠，酸爽清新；Cherry Cola 是带气泡感的可乐，樱桃味突出。",
            "每盒 1 颗烟弹，想多试几种口味可以逐个挑选。",
          ],
        },
        {
          heading: "想要更多口味可选？",
          paragraphs: [
            "RELX 的另一款烟弹 [RELX Pod Pro](/products/relx-pod-pro) 口味更多，RELX 将其分为水果、茶、饮品、甜点、薄荷和烟草几类，部分口味还有 0mg/ml 版本。选择前请先确认手上的主机是 RELX 为 Pod Pro 标明的型号：Infinity 2 Plus、Essential 2 或 Artisan Plus。",
            "RELX 推荐搭配这款烟弹使用的主机是 [RELX Ultra Kit](/products/relx-ultra-kit)。",
          ],
        },
      ],
    },
  },
  // Owner task ก6 (09/11), RELX: Ultra Kit — RELX's own store page relxnow.com/products/relx-ultra-kit, read 09/11: FAQ 'engineered for an
  // "Ultra Intense" experience … designed to deliver a much stronger hit' · "It's best used with UltraPod" · description "Fully compatible
  // with RELX MAXGO pods … Watermelon, Cherry Cola, Sunrise Lemon Lime, and Blueberry Sour Raspberry". Pod facts = relxnow.com/products/
  // relx-maxgo-ultra-pod: "Compatible with both RELX (Ultra/Artisan/Infinity/Essential series) and WAKA device" · "single pod packaging".
  // The "2X satisfaction" line is left out (no basis given); "works best with" is already in the page's compatibility note. Left out (already on the page): 10W, 380mAh, Type-C 80% in 30 minutes,
  // aluminium alloy, the light near the base, the box list. Not settled by RELX, so not said: whether a pod is in the box (the box list
  // says "RELX Pods are sold separately unless bundled", the short line "1 Essential 2 & 1 Ultra Pod") — PR note. Legacy page → no FAQ.
  "relx-ultra-kit": {
    th: {
      lede: "ด้านล่างเล่าจากหน้าเว็บของ RELX ว่าชุด Ultra Kit ทำมาสำหรับใคร และใช้กับหัวพอตอะไรได้บ้าง",
      sections: [
        {
          heading: "RELX Ultra Kit เหมาะกับใคร",
          paragraphs: [
            "RELX เรียกแนวของชุดนี้ว่า Ultra Intense และบอกว่าออกแบบมาให้สูบแล้วรู้สึกแรงขึ้นอย่างชัดเจน ถ้าชอบสูบแบบแรง ๆ ชุดนี้ก็ทำมาเพื่อแนวนั้นโดยตรง",
          ],
        },
        {
          heading: "RELX Ultra Kit ใช้หัวพอตอะไรได้บ้าง",
          paragraphs: [
            "หัวที่ใช้ได้คือ [RELX Ultra Pod](/products/relx-ultra-pod) ซึ่งมี 4 กลิ่น นอกจาก Watermelon กับ Sunrise Lemon Lime แล้ว ยังมี Blueberry Sour Raspberry และ Cherry Cola ให้เลือกด้วย",
            "หัว Ultra Pod ขายแพ็กละ 1 หัว จึงสลับลองกลิ่นใหม่ได้ทีละหัว",
          ],
        },
        {
          heading: "หัว Ultra Pod ใช้กับเครื่อง RELX รุ่นอื่นได้ไหม",
          paragraphs: [
            "ใช้ได้ โดย RELX ระบุว่าหัว Ultra Pod ใช้กับเครื่องตระกูล Ultra · Artisan · Infinity และ Essential รวมถึงเครื่อง WAKA ด้วย ถ้ามีเครื่อง RELX ตระกูลเหล่านี้อยู่แล้ว ก็ใช้หัวรุ่นเดียวกันสลับกันได้",
          ],
        },
      ],
    },
    en: {
      lede: "From RELX's own page: who the Ultra Kit is made for, and which pods it takes.",
      sections: [
        {
          heading: "Who is the RELX Ultra Kit for?",
          paragraphs: [
            "RELX describes this kit as built for an Ultra Intense experience, with a much stronger hit. If a strong hit is what you're after, this is the kit made for it.",
          ],
        },
        {
          heading: "Which pods does the RELX Ultra Kit take?",
          paragraphs: [
            "The pod it takes is the [RELX Ultra Pod](/products/relx-ultra-pod), which comes in four flavours: Watermelon and Sunrise Lemon Lime, plus Blueberry Sour Raspberry and Cherry Cola.",
            "Ultra Pods come one to a pack, so you can try a new flavour one pod at a time.",
          ],
        },
        {
          heading: "Do Ultra Pods fit other RELX devices?",
          paragraphs: [
            "Yes. RELX lists the Ultra Pod for its Ultra, Artisan, Infinity and Essential devices, and for WAKA devices as well, so if you already own one of those you can share the same pods.",
          ],
        },
      ],
    },
    zh: {
      lede: "根据 RELX 官网的介绍：Ultra Kit 适合什么样的人，以及可以搭配哪些烟弹。",
      sections: [
        {
          heading: "RELX Ultra Kit 适合谁？",
          paragraphs: [
            "RELX 把这套产品定位为 Ultra Intense 体验，表示抽起来力度明显更强。喜欢更有力度的口感，这套就是为此而设计的。",
          ],
        },
        {
          heading: "RELX Ultra Kit 用什么烟弹？",
          paragraphs: [
            "适用的烟弹是 [RELX Ultra Pod](/products/relx-ultra-pod)，共有 4 种口味：除了 Watermelon 和 Sunrise Lemon Lime，还有 Blueberry Sour Raspberry 和 Cherry Cola。",
            "Ultra Pod 每盒 1 颗，可以一颗一颗地尝试新口味。",
          ],
        },
        {
          heading: "Ultra Pod 能用在其他 RELX 主机上吗？",
          paragraphs: [
            "可以。RELX 标明 Ultra Pod 适用于 RELX Ultra、Artisan、Infinity 和 Essential 系列主机，也适用于 WAKA 主机；手上已有这些系列的主机，就可以共用同一款烟弹。",
          ],
        },
      ],
    },
  },
  // Owner task ก6 (09/11), RELX: Pod Pro — RELX's own pages, read 09/11: relxnow.com/products/relx-pod-pro groups 34 flavours under
  // "Collection": Fruit (20: Tangy Grape … Ruby Raspberry) · Mint (Menthol Plus) · Tea (Hibiscus Ice Tea, Iced Jasmine Green Tea, Jasmine
  // Longjing Tea, Oolong Ice Tea, Lemon Ice Tea, Matcha Frappe) · Tobacco (Classic Tobacco) · Beverage (Orange Sparkle, Iced Pocary,
  // Cucumber Lemonade, Dark Sparkle) · Dessert (Ludou Ice, Banana Freeze); same page "#Ruby Raspberry: Sweet and tart, this raspberry
  // flavor is complemented by subtle floral notes and just the right amount of mint" · relxnow.com/products/relx-pod-pro-autoship variants
  // "0mg/ml (1 Pod)" = Watermelon Ice, Mango Orange, Menthol Xtra; "18mg/ml (2 Pods)" for the rest. The other 8 flavours on this page come
  // from RELX's flavour pages (product file comment). Left out (already on the page): 1.9mL, the ceramic coil, the device list, Pod Pro 2.
  // The autoship blurb's "0%, 1.8%, 3% and 5%" is left out: its own variants sell only 0mg/ml and 18mg/ml. Legacy page → no article FAQ.
  "relx-pod-pro": {
    th: {
      lede: "RELX Pod Pro มีกลิ่นให้เลือกเยอะ ด้านล่างจึงแบ่งกลิ่นตามกลุ่มที่ RELX จัดไว้เอง เพื่อให้เลือกได้ง่ายขึ้น",
      sections: [
        {
          heading: "RELX Pod Pro มีกลิ่นแนวไหนบ้าง",
          paragraphs: [
            "หน้าเว็บของ RELX จัด 34 กลิ่นของหัวรุ่นนี้ไว้เป็น 6 กลุ่ม กลุ่มใหญ่ที่สุดคือผลไม้ มีถึง 20 กลิ่น เช่น Tangy Grape · Hokkaido Melon · Paradise Mango · Sea Salt Lychee และ Fresh Peach",
            "กลุ่มชามี 6 กลิ่น คือ Hibiscus Ice Tea · Iced Jasmine Green Tea · Jasmine Longjing Tea · Oolong Ice Tea · Lemon Ice Tea และ Matcha Frappe",
            "กลุ่มเครื่องดื่มมี Orange Sparkle · Iced Pocary · Cucumber Lemonade และ Dark Sparkle กลุ่มของหวานมี Ludou Ice กับ Banana Freeze ส่วนกลุ่มมินต์มี Menthol Plus และกลุ่มยาสูบมี Classic Tobacco",
            "ส่วนอีก 8 กลิ่นบนหน้านี้ ร้านรวบรวมมาจากหน้าอื่นของ RELX จึงอยู่นอก 6 กลุ่มข้างบน ได้แก่ Icy Coconut Water · Lychee Ice · Taro Scoop · Blueberry Splash · Precious Plum · Mango Orange · Menthol Xtra และ Juicy Apple",
          ],
        },
        {
          heading: "RELX Pod Pro แบบ 0mg/ml มีกลิ่นไหนบ้าง",
          paragraphs: [
            "กลิ่นที่ RELX ขายแบบ 0mg/ml บนหน้าเว็บมี 3 กลิ่น คือ Watermelon Ice · Mango Orange และ Menthol Xtra",
          ],
        },
        {
          heading: "RELX เล่ารสของ Ruby Raspberry ไว้ว่ายังไง",
          paragraphs: [
            "RELX บอกว่า Ruby Raspberry เป็นราสป์เบอร์รีรสหวานอมเปรี้ยว มีกลิ่นดอกไม้อ่อน ๆ กับมินต์อีกนิดพอดี ๆ",
          ],
        },
      ],
    },
    en: {
      lede: "The RELX Pod Pro comes in a lot of flavours, so below they are sorted into RELX's own groups to make choosing easier.",
      sections: [
        {
          heading: "What kinds of flavours does the RELX Pod Pro come in?",
          paragraphs: [
            "RELX's page sorts 34 of this pod's flavours into six groups. Fruit is the largest, with 20, such as Tangy Grape, Hokkaido Melon, Paradise Mango, Sea Salt Lychee and Fresh Peach.",
            "Tea has six: Hibiscus Ice Tea, Iced Jasmine Green Tea, Jasmine Longjing Tea, Oolong Ice Tea, Lemon Ice Tea and Matcha Frappe.",
            "Beverage has Orange Sparkle, Iced Pocary, Cucumber Lemonade and Dark Sparkle, Dessert has Ludou Ice and Banana Freeze, Mint has Menthol Plus and Tobacco has Classic Tobacco.",
            "The other eight on this page come from RELX's other listings, so they sit outside those six groups: Icy Coconut Water, Lychee Ice, Taro Scoop, Blueberry Splash, Precious Plum, Mango Orange, Menthol Xtra and Juicy Apple.",
          ],
        },
        {
          heading: "Which RELX Pod Pro flavours come at 0mg/ml?",
          paragraphs: [
            "RELX's page lists three at 0mg/ml: Watermelon Ice, Mango Orange and Menthol Xtra.",
          ],
        },
        {
          heading: "How does RELX describe Ruby Raspberry?",
          paragraphs: [
            "RELX describes Ruby Raspberry as a sweet and tart raspberry, with subtle floral notes and a touch of mint.",
          ],
        },
      ],
    },
    zh: {
      lede: "RELX Pod Pro 口味很多。下面借助 RELX 自己的分类，帮你更快挑选。",
      sections: [
        {
          heading: "RELX Pod Pro 有哪些类型的口味？",
          paragraphs: [
            "RELX 官网把这款烟弹的 34 种口味分成 6 类。水果类最多，有 20 种，例如 Tangy Grape、Hokkaido Melon、Paradise Mango、Sea Salt Lychee 和 Fresh Peach。",
            "茶类有 6 种：Hibiscus Ice Tea、Iced Jasmine Green Tea、Jasmine Longjing Tea、Oolong Ice Tea、Lemon Ice Tea 和 Matcha Frappe。",
            "饮品类有 Orange Sparkle、Iced Pocary、Cucumber Lemonade 和 Dark Sparkle，甜点类有 Ludou Ice 和 Banana Freeze，薄荷类有 Menthol Plus，烟草类有 Classic Tobacco。",
            "本页另外 8 种口味是本店从 RELX 其他页面整理而来，不在上述 6 类之中：Icy Coconut Water、Lychee Ice、Taro Scoop、Blueberry Splash、Precious Plum、Mango Orange、Menthol Xtra 和 Juicy Apple。",
          ],
        },
        {
          heading: "RELX Pod Pro 哪些口味有 0mg/ml？",
          paragraphs: [
            "RELX 官网上有 0mg/ml 版本的口味共 3 种：Watermelon Ice、Mango Orange 和 Menthol Xtra。",
          ],
        },
        {
          heading: "RELX 怎样描述 Ruby Raspberry？",
          paragraphs: [
            "RELX 形容 Ruby Raspberry 是酸甜的覆盆子味，带有淡淡的花香和恰到好处的一点薄荷。",
          ],
        },
      ],
    },
  },
  // Owner task ก6 (09/11), RELX: RELX Pod — RELX's own pages, read 09/11: relxnow.com/products/relx-pod-autoship offers only "(2-packed)
  // 18mg/ml" and has no description · Pod Pro facts = its verified rows (1.9mL) + relxnow.com/products/relx-pod-pro-autoship "0mg/ml (1 Pod)"
  // · relxnow.com/products/relx-pod-pro "Collection: Fruit" lists Watermelon Ice, Pineapple Delight and Strawberry Burst. The flavour groups
  // here are the shop's, from the words in each name. Left out (already on the page): the cotton coil, the swap, the device list. Not said:
  // Infinity (this RELX page's subtitle says "For RELX Infinity", the product file keeps it out — PR note). Legacy page → no article FAQ.
  "relx-pod": {
    th: {
      lede: "ด้านล่างช่วยเทียบ RELX Pod กับ RELX Pod Pro ให้เห็นภาพ และจัดกลิ่นเป็นสายให้เลือกได้ง่ายขึ้น",
      sections: [
        {
          heading: "เลือก RELX Pod หรือ RELX Pod Pro ดี",
          paragraphs: [
            "RELX บอกความจุน้ำยาไว้เฉพาะ [RELX Pod Pro](/products/relx-pod-pro) คือ 1.9mL ส่วนของ RELX Pod หน้าเว็บของ RELX ไม่ได้ระบุไว้",
            "Pod Pro ยังมีกลิ่นให้เลือกมากกว่า และบางกลิ่นมีแบบ 0mg/ml ด้วย ส่วน RELX Pod มีขายบนหน้าเว็บของ RELX แบบ 18mg/ml อย่างเดียว",
          ],
        },
        {
          heading: "RELX Pod กลิ่นไหนดี",
          paragraphs: [
            "ลองเริ่มจากสายที่ชอบก่อน สายด้านล่างร้านจัดเองจากคำในชื่อกลิ่น ไม่ใช่การแบ่งกลุ่มของ RELX",
            "สายมินต์มี Menthol Xtra กับ Lemon Mint ส่วนสายผลไม้มี 7 กลิ่น คือ Watermelon Ice · Pineapple Delight · Strawberry Burst · Blueberry Splash · Juicy Apple · Cherry Lime และ Heisenberry",
            "ในสายผลไม้ Watermelon Ice · Pineapple Delight และ Strawberry Burst เป็น 3 กลิ่นที่ RELX เองก็จัดไว้ในกลุ่มผลไม้บนหน้า RELX Pod Pro ด้วย",
          ],
        },
      ],
    },
    en: {
      lede: "Below, a side-by-side look at RELX Pod and RELX Pod Pro, and the flavours sorted into groups to make choosing easier.",
      sections: [
        {
          heading: "RELX Pod or RELX Pod Pro?",
          paragraphs: [
            "RELX gives an e-liquid capacity only for the [RELX Pod Pro](/products/relx-pod-pro), at 1.9mL. Its pages don't list one for RELX Pod.",
            "The Pod Pro also has more flavours, and some come at 0mg/ml. RELX Pod, on RELX's page, comes at 18mg/ml only.",
          ],
        },
        {
          heading: "Which RELX Pod flavour should I start with?",
          paragraphs: [
            "Start with the kind you like. The groups are ours, from the words in each name, not RELX's own.",
            "Mint has Menthol Xtra and Lemon Mint. Fruit has seven: Watermelon Ice, Pineapple Delight, Strawberry Burst, Blueberry Splash, Juicy Apple, Cherry Lime and Heisenberry.",
            "Of the fruit ones, Watermelon Ice, Pineapple Delight and Strawberry Burst also sit in RELX's own fruit group on its Pod Pro page.",
          ],
        },
      ],
    },
    zh: {
      lede: "下面把 RELX Pod 和 RELX Pod Pro 放在一起比较，并把口味分好组，方便挑选。",
      sections: [
        {
          heading: "选 RELX Pod 还是 RELX Pod Pro？",
          paragraphs: [
            "RELX 只公布了 [RELX Pod Pro](/products/relx-pod-pro) 的烟油容量，为 1.9mL，RELX Pod 则没有标明。",
            "Pod Pro 的口味也更多，部分口味还有 0mg/ml 版本；RELX Pod 在 RELX 官网上只有 18mg/ml。",
          ],
        },
        {
          heading: "RELX Pod 哪个口味好？",
          paragraphs: [
            "可以先从喜欢的类型选起。分组由本店按口味名称里的词整理，并非 RELX 官方分类。",
            "薄荷类有 Menthol Xtra 和 Lemon Mint。水果类有 7 种：Watermelon Ice、Pineapple Delight、Strawberry Burst、Blueberry Splash、Juicy Apple、Cherry Lime 和 Heisenberry。",
            "水果类中的 Watermelon Ice、Pineapple Delight 和 Strawberry Burst，RELX 在 Pod Pro 页面上也归入水果类。",
          ],
        },
      ],
    },
  },
  // Owner task ก6 (09/11), RELX: Artisan Plus — RELX's own store page relxnow.com/products/relx-artisan-plus-device, read 09/11: "The power
  // has been upgraded from 6.5W to 8W, providing stronger vapor production. Additionally, the battery capacity has increased from 380mAh to
  // 440mAh, ensuring longer usage with fewer charges" · "4-Stage Battery Indicator … more intuitive experience than the original's
  // color-change system". Pod facts = the verified rows of relx-pod-pro (ceramic, 1.9mL, 0mg/ml on some, 42 flavours) and relx-pod (cotton, 9 flavours). Left out
  // (already on the page): 8W, 440mAh, the 4 stages, the sculpted body, Type-C, the box list. Legacy page → no article FAQ.
  "relx-artisan-plus": {
    th: {
      lede: "ด้านล่างเทียบ RELX Artisan Plus กับ Artisan รุ่นก่อนจากหน้าเว็บของ RELX และเล่าว่าหัวพอตสองรุ่นที่ใช้ได้ต่างกันตรงไหน",
      sections: [
        {
          heading: "RELX Artisan Plus ได้อะไรเพิ่มจาก Artisan รุ่นก่อน",
          paragraphs: [
            "Artisan รุ่นก่อนใช้ 6.5 วัตต์กับแบต 380mAh ส่วนรุ่นนี้เพิ่มทั้งวัตต์และขนาดแบต RELX บอกว่าไอจึงแน่นขึ้น ใช้ได้นานขึ้น และชาร์จน้อยครั้งลง",
            "เรื่องไฟบอกแบต รุ่นก่อนใช้วิธีเปลี่ยนสีไฟ ส่วนแบบใหม่ของรุ่นนี้ RELX บอกว่าดูได้ง่ายกว่า",
          ],
        },
        {
          heading: "หัว RELX Pod กับ RELX Pod Pro ต่างกันยังไง",
          paragraphs: [
            "[RELX Pod Pro](/products/relx-pod-pro) ใช้คอยล์เซรามิก จุน้ำยาได้ 1.9mL มีกลิ่นให้เลือกมากกว่า และบางกลิ่นยังมีแบบ 0mg/ml ด้วย",
            "ส่วน [RELX Pod](/products/relx-pod) ใช้คอยล์สำลี ถ้ายังเลือกไม่ได้ ลองดูรายชื่อกลิ่นของทั้งสองหน้าก่อนก็ได้",
          ],
        },
      ],
    },
    en: {
      lede: "Below, RELX's own comparison of the Artisan Plus with the original Artisan, and how the two pods it takes differ.",
      sections: [
        {
          heading: "What does the Artisan Plus add over the original?",
          paragraphs: [
            "RELX raised the power from the original's 6.5W and the battery from its 380mAh, which it says gives denser vapour and longer use between charges.",
            "As for the battery light, the original showed the charge by changing colour, and RELX says the new one is easier to read.",
          ],
        },
        {
          heading: "RELX Pod or RELX Pod Pro: what's the difference?",
          paragraphs: [
            "The [RELX Pod Pro](/products/relx-pod-pro) has a ceramic coil, holds 1.9mL and comes in more flavours, some of them at 0mg/ml.",
            "The [RELX Pod](/products/relx-pod) has a cotton coil. If you can't decide, look through the flavour lists on both pages first.",
          ],
        },
      ],
    },
    zh: {
      lede: "下面根据 RELX 官网，比较 RELX Artisan Plus 与初代 Artisan，并说明它适用的两款烟弹有何不同。",
      sections: [
        {
          heading: "RELX Artisan Plus 比初代 Artisan 多了什么？",
          paragraphs: [
            "RELX 在初代 6.5W 的基础上提高了功率，电池也在 380mAh 的基础上加大，并表示烟雾因此更饱满，续航更久，充电次数更少。",
            "至于电量指示，初代靠灯光变色显示电量，RELX 表示这款的新设计更直观易读。",
          ],
        },
        {
          heading: "RELX Pod 和 RELX Pod Pro 有什么不同？",
          paragraphs: [
            "[RELX Pod Pro](/products/relx-pod-pro) 采用陶瓷线圈，容量 1.9mL，口味更多，部分口味有 0mg/ml 版本。",
            "[RELX Pod](/products/relx-pod) 采用棉芯线圈。还拿不定主意的话，可以先看看两个页面上的口味列表。",
          ],
        },
      ],
    },
  },
  // Owner task ก6 (09/11), NEVOKS: Feelin Mini empty pod (coil-54) — NEVOKS's own page nevoks.com/products/nevoks-feelin-mini-pod-kit, read
  // 09/11 in the in-app browser; posters cdn.shopify.com/s/files/1/0670/1865/3983/files/: feelinmini2.jpg "Easy to Fill · Side Fill" ·
  // feelinmini7.jpg "Compatible with SPL 10 Coil Series · MTL: Best for 0.8Ω · Tighten MTL: Suggest for 1.0Ω · Not Recommend for 0.6Ω" /
  // "Mesh Coil SPL-10 · Resistance: 0.8Ω (Included) · Power Range: 13~18W · Recommended E-liquid: Freebase (Best for nicotine≤10mg)" /
  // "Resistance: 1.0Ω · Power Range: 10~13W · Recommended E-liquid: nicotine salt (Best for nicotine≤35mg) · Compatible product: Feelin/Pagee" (printed in both the 0.8Ω and the 1.0Ω block)
  // · feelinmini9.jpg "Cartridge Material TPU+PCTG" · feelinmini10.jpg packing list "Feelin Mini Empty Cartridge(2ml) · SPL-10 Mesh Coil 0.8Ω".
  // "Included" = in the Feelin Mini kit box, not with this pod. en/zh leave out the guide link: /guides/salt-nic-vs-freebase is thaiOnly. Left out: 2mL (spec row). Counted outside the spec table (checker 09/11): SPL10 = FAQ 1 answer + FAQ 2 question only;
  // 0.8Ω / 1.0Ω = section 2 + FAQ 2; "หัวพอตเปล่า" = tagline + shortDescription, so not in the article.
  // Seed page → FAQ allowed.
  "coil-54": {
    th: {
      lede: "ด้านล่างสรุปจากโปสเตอร์ของ NEVOKS ว่าหัวพอต Feelin Mini เติมน้ำยาทางไหน และคอยล์แต่ละค่าเข้าคู่กับน้ำยาแบบไหน",
      sections: [
        {
          heading: "หัวพอต Feelin Mini เติมน้ำยาทางไหน",
          paragraphs: [
            "หัวพอตนี้เติมน้ำยาจากด้านข้าง ตัวหัวทำจาก TPU กับ PCTG ตามที่ NEVOKS ระบุไว้",
          ],
        },
        {
          heading: "คอยล์ค่าไหนเข้าคู่กับน้ำยาแบบไหน",
          paragraphs: [
            "NEVOKS แนะนำคอยล์ 0.8 โอห์มสำหรับการสูบแบบ MTL ใช้ที่ 13–18 วัตต์ และเข้ากับน้ำยา freebase ที่มีนิโคตินไม่เกิน 10mg คอยล์ค่านี้คือตัวที่ใส่มาในกล่องชุด Feelin Mini",
            "ถ้าชอบสูบแบบ MTL แบบแน่น NEVOKS แนะนำคอยล์ 1.0 โอห์ม ใช้ที่ 10–13 วัตต์ และเข้ากับน้ำยา salt nic ที่มีนิโคตินไม่เกิน 35mg ส่วนคอยล์ 0.6 โอห์ม NEVOKS ไม่แนะนำให้ใช้กับ Feelin Mini",
            "ถ้ายังไม่แน่ใจว่าน้ำยาสองแบบนี้ต่างกันยังไง อ่านต่อได้ที่ [salt nic กับ freebase ต่างกันยังไง](/guides/salt-nic-vs-freebase)",
          ],
        },
      ],
      faq: [
        {
          question: "หัวพอต Feelin Mini ใช้กับคอยล์อะไร",
          answer: "ใช้กับคอยล์ตระกูล SPL10 ของ NEVOKS ค่ะ",
        },
        {
          question: "คอยล์ SPL10 ใช้กับเครื่องไหนได้อีกบ้าง",
          answer: "โปสเตอร์ของ NEVOKS ระบุว่าคอยล์ทั้งค่า 0.8 และ 1.0 โอห์มใช้กับ Feelin และ Pagee ได้ด้วยค่ะ",
        },
      ],
    },
    en: {
      lede: "From NEVOKS's own posters: how the Feelin Mini pod fills, and which e-liquid each coil value suits.",
      sections: [
        {
          heading: "How does the Feelin Mini pod fill?",
          paragraphs: [
            "It fills from the side. NEVOKS lists the pod's material as TPU and PCTG.",
          ],
        },
        {
          heading: "Which coil goes with which e-liquid?",
          paragraphs: [
            "NEVOKS recommends the 0.8Ω for MTL vaping at 13–18W, with freebase e-liquid at up to 10mg nicotine. This is the coil that comes in the Feelin Mini kit box.",
            "For a tighter MTL draw, NEVOKS suggests the 1.0Ω at 10–13W, with nic salt at up to 35mg. NEVOKS does not recommend the 0.6Ω for the Feelin Mini.",
          ],
        },
      ],
      faq: [
        {
          question: "Which coils does the Feelin Mini pod take?",
          answer: "It takes NEVOKS's SPL10 coils.",
        },
        {
          question: "Which other devices take SPL10 coils?",
          answer: "NEVOKS's poster lists the Feelin and the Pagee for both the 0.8Ω and the 1.0Ω coil.",
        },
      ],
    },
    zh: {
      lede: "下面根据 NEVOKS 的海报整理：Feelin Mini 烟弹怎么注油，以及线圈各个阻值适合哪种烟油。",
      sections: [
        {
          heading: "Feelin Mini 烟弹怎么注油？",
          paragraphs: [
            "这款烟弹从侧面注油。NEVOKS 标明烟弹材质为 TPU 和 PCTG。",
          ],
        },
        {
          heading: "线圈哪个阻值配哪种烟油？",
          paragraphs: [
            "NEVOKS 推荐 0.8Ω 用于 MTL 抽法，功率 13–18W，搭配尼古丁不超过 10mg 的 freebase 烟油；Feelin Mini 套装盒里附带的就是这一颗。",
            "想要更紧的 MTL 吸阻，NEVOKS 建议用 1.0Ω，功率 10–13W，搭配尼古丁不超过 35mg 的 salt nic。NEVOKS 不推荐 Feelin Mini 使用 0.6Ω。",
          ],
        },
      ],
      faq: [
        {
          question: "Feelin Mini 烟弹用什么线圈？",
          answer: "使用 NEVOKS 的 SPL10 系列线圈。",
        },
        {
          question: "SPL10 线圈还适用于哪些设备？",
          answer: "NEVOKS 的海报标明，0.8Ω 和 1.0Ω 两款线圈也适用于 Feelin 和 Pagee。",
        },
      ],
    },
  },
  // Owner task ก6 (09/11), SMOK: Nord 5 — SMOK's own page www.smoktech.com/product/pod/nord-5, read 09/11 in the in-app browser: text
  // "MAX 1.5A TYPE-C CHARGING: It'll take an hour and 40 minutes at most to recover from the low battery" · "HOW TO FILL WITH E-LIQUID: Do
  // not inhale immediately after filling the pod. Let it stand for several minutes to get the cotton completely saturated" · "the dual-side
  // air inlet layout enables fuller atomization and more balanced heat dissipation, contributing to a smooth and plump taste" · posters
  // res.smoktech.com/www/files/v2/product/: 78JNQrvpZJuZ6EeMKzaETdKYMyL.jpeg "MULTIPLY THE SECURITY: 8 seconds cut-off · pod detection ·
  // low-voltage protection · short circuit protection" · M62N8xvWR9Tbeg8lr2xoIqaRj9j6.jpeg "COIL INTRODUCTION: Perfect for DL vaping · RPM 3
  // Meshed 0.15Ω Coil · Fast ramp-up time · Better flavor and massive vapor · Wattage: 40-80W" / "RPM 3 Meshed 0.23Ω Coil · More even heat
  // surface · Smooth taste and rich flavor · Wattage: 20-45W" · EybDwwK3MeULpod14DbZhdaZNoV.jpeg "WIDE-BORE MOUTHPIECE". The 0.15Ω coil is
  // the one fitted in the pod (spec row). RPM 5 facts = its own verified rows + its SMOK page (top fill: "push the top filling cover to
  // expose the filling hole, without pulling out the pod"). Left out (already on the page): 2000mAh, 5–80W, 5mL, the two ohm values (named
  // here as the fitted coil and the spare), the 0.69-inch OLED, the slider, the short-circuit LED, the pod lock, the box list; the 1.2A / 1.5A
  // split stays in the spec row, and the 1 h 40 min figure is left out (it sits under "MAX 1.5A"; the spec row says 1.2A for the regular
  // series — checker 09/11). Legacy page → no article FAQ.
  "smok-nord-5": {
    th: {
      lede: "ด้านล่างสรุปจากหน้าเว็บและโปสเตอร์ของ SMOK ว่าคอยล์ที่มาในกล่องใช้กี่วัตต์ เติมน้ำยาแล้วควรทำยังไงก่อนสูบ และ Nord 5 ต่างจาก RPM 5 ตรงไหน",
      sections: [
        {
          heading: "คอยล์ที่มาในกล่องใช้กี่วัตต์",
          paragraphs: [
            "SMOK ออกแบบคอยล์ทั้งสองแบบมาสำหรับการสูบแบบ DTL คือดูดลงปอดตรง ๆ ตัวที่ใส่มากับหัวพอตใช้ได้ช่วง 40–80 วัตต์ และ SMOK บอกว่าตัวนี้ร้อนเร็ว ให้รสชัดและไอเยอะ",
            "ส่วนคอยล์สำรองใช้ได้ช่วง 20–45 วัตต์ SMOK บอกว่าผิวคอยล์ร้อนสม่ำเสมอกว่า และให้รสนุ่มและเข้ม อยากรู้ว่าแนวการสูบของตัวเองเป็นแบบไหน อ่านต่อได้ที่ [สูบแบบ MTL กับ DTL ต่างกันยังไง](/guides/understanding-mtl-vs-dtl)",
          ],
        },
        {
          heading: "ลมเข้าสองข้างช่วยอะไร",
          paragraphs: [
            "SMOK บอกว่าการวางช่องลมแบบนี้ช่วยให้น้ำยากลายเป็นไอได้ทั่วถึงขึ้น และระบายความร้อนได้สมดุลกว่า รสที่ได้จึงนุ่มและแน่น ส่วนปากดูดเป็นแบบรูกว้าง",
          ],
        },
        {
          heading: "เติมน้ำยาแล้วสูบได้เลยไหม",
          paragraphs: [
            "หลังเติมน้ำยา SMOK แนะนำให้วางเครื่องทิ้งไว้หลายนาทีก่อน ให้น้ำยาซึมเข้าสำลีในคอยล์จนทั่ว แล้วค่อยเริ่มสูบ",
          ],
        },
        {
          heading: "SMOK Nord 5 มีระบบป้องกันอะไรบ้าง",
          paragraphs: [
            "เครื่องจะหยุดจ่ายไฟเมื่อกดปุ่มยิงค้างครบ 8 วินาที ตรวจได้ว่าใส่หัวพอตแล้วหรือยัง และมีระบบป้องกันแบตต่ำกับไฟช็อต",
          ],
        },
        {
          heading: "SMOK Nord 5 กับ RPM 5 ต่างกันยังไง",
          paragraphs: [
            "ทั้งสองรุ่นใช้คอยล์ตระกูลเดียวกัน",
            "[SMOK RPM 5](/products/smok-rpm-5) จุน้ำยาได้มากกว่า คือ 6.5mL และมีจอ TFT 0.96 นิ้ว ส่วน Nord 5 ตัวเครื่องสั้นกว่า",
          ],
        },
      ],
    },
    en: {
      lede: "From SMOK's own page and posters: what wattage each coil in the box runs at, what to do after filling, and how the Nord 5 differs from the RPM 5.",
      sections: [
        {
          heading: "What wattage do the two coils in the box run at?",
          paragraphs: [
            "SMOK makes both for DTL vaping, drawing straight into the lungs. The coil fitted in the pod runs at 40–80W, and SMOK says it heats up fast with a fuller flavour and plenty of vapour.",
            "The spare runs at 20–45W, and SMOK says its more even heating surface gives a smooth, rich taste. If you're not sure which style you vape, see [MTL vs DTL](/guides/understanding-mtl-vs-dtl).",
          ],
        },
        {
          heading: "What does air from both sides do?",
          paragraphs: [
            "SMOK says this inlet layout turns the e-liquid into vapour more fully and spreads the heat more evenly, for a smooth, full taste. The mouthpiece is wide-bore.",
          ],
        },
        {
          heading: "Can I vape straight after filling?",
          paragraphs: [
            "SMOK advises letting it stand for several minutes after filling, so the e-liquid soaks fully into the cotton in the coil before you start.",
          ],
        },
        {
          heading: "What protections does the SMOK Nord 5 have?",
          paragraphs: [
            "It cuts out after 8 seconds of continuous firing, detects whether a pod is fitted, and protects against low voltage and short circuits.",
          ],
        },
        {
          heading: "SMOK Nord 5 or RPM 5?",
          paragraphs: [
            "Both take the same coil family.",
            "The [SMOK RPM 5](/products/smok-rpm-5) holds more, at 6.5mL, and has a 0.96-inch TFT display; the Nord 5 is the shorter device.",
          ],
        },
      ],
    },
    zh: {
      lede: "下面根据 SMOK 官网和海报整理：盒内两颗线圈各用多少瓦、注油后该怎么做，以及 Nord 5 和 RPM 5 有什么不同。",
      sections: [
        {
          heading: "盒内两颗线圈用多少瓦？",
          paragraphs: [
            "两颗线圈都是 SMOK 为 DTL 抽法设计的，也就是直接吸入肺部。装在烟弹里的那颗适用 40–80W，SMOK 表示它升温快、味道更足、烟雾量大。",
            "备用的那颗适用 20–45W，SMOK 表示它受热面更均匀，口感顺滑浓郁。不确定自己是哪种抽法，可以看 [MTL 和 DTL 的区别](/guides/understanding-mtl-vs-dtl)。",
          ],
        },
        {
          heading: "两侧进气有什么作用？",
          paragraphs: [
            "SMOK 表示这种进气布局能让烟油雾化得更充分、散热更均衡，口感更顺滑饱满。烟嘴为宽口设计。",
          ],
        },
        {
          heading: "注油后可以马上抽吗？",
          paragraphs: [
            "SMOK 建议注油后先静置几分钟，让烟油充分浸透线圈里的棉芯后再开始抽。",
          ],
        },
        {
          heading: "SMOK Nord 5 有哪些保护功能？",
          paragraphs: [
            "连续点火满 8 秒会自动断电，能检测是否装好烟弹，并具备低电压保护和短路保护。",
          ],
        },
        {
          heading: "SMOK Nord 5 和 RPM 5 怎么选？",
          paragraphs: [
            "两款使用同一系列的线圈。",
            "[SMOK RPM 5](/products/smok-rpm-5) 容量更大，为 6.5mL，并配备 0.96 英寸 TFT 屏；Nord 5 机身更短。",
          ],
        },
      ],
    },
  },
  // Owner task ก6 (09/11), SMOK: RPM 5 — SMOK's own page www.smoktech.com/product/pod_mod/rpm-5-and-rpm-5-pro, read 09/11 in the in-app
  // browser: text "Both internal and external battery versions are optional, providing up to 80 watts" · "The 6.5ml RPM 5 Pod comes standard
  // with two RPM 3 meshed coils to satisfy DL vaping enthusiasts" · posters res.smoktech.com/www/files/v2/product/: rqYmg6MA4oI9Qw5ny3gRsKBavYE
  // .jpeg "2000mAh Built-in Battery" (RPM 5) / "External Single 18650 Battery" (RPM 5 Pro) · RNEmoLb3R3T7l0bgQ6zlFROVZYE.jpeg spec sheet, RPM 5
  // Pro "129.4" mm high, "Power Range: 5W-80W" (its 100.7g is left out: the sheet does not say whether the 18650 is in) · K44Eb64L3wfaJ8MjrRaltKZRg6O.jpeg "Hit the Mark Stepwise: … a stepless
  // airflow adjustment mechanism that supports airway regulation of any size, from minimum to maximum and vice versa" ·
  // 9O3X8vql7mTll3Y17eaGS61Xl5d.jpeg "Slide-to-open Top Filling System: Simply push the top filling cover to expose the filling hole, without
  // pulling out the pod" · NlMNnNbwn9sqdb3XRLn7I4low8v.jpeg "INTELLIGENT DETECTION: Pod Detection · Short Circuit Protection · 8 Seconds
  // Cut-off · Low-voltage Warning" · EKay1W6zXnCY5WQQlKVNt1W5qeV.jpeg "COIL INTRODUCTION" (fitted 0.15Ω 40-80W "Fast ramp-up", spare 0.23Ω
  // 20-45W "Smooth taste and rich flavor", both "Perfect for DL vaping"). Nord 5 facts = its verified rows. Left out (already on the page):
  // 2000mAh as a number, 5–80W and the shared 80W top (checker 09/11), 6.5mL, the two ohm values (named here as the fitted coil and the spare), the 0.96-inch TFT and its theme
  // colour, the box list, this kit's size and weight. Legacy page → no article FAQ.
  "smok-rpm-5": {
    th: {
      lede: "ด้านล่างสรุปจากหน้าเว็บและโปสเตอร์ของ SMOK ว่า RPM 5 ต่างจาก RPM 5 Pro ยังไง เติมน้ำยาและปรับลมยังไง และคอยล์ที่มาในกล่องใช้กี่วัตต์",
      sections: [
        {
          heading: "SMOK RPM 5 กับ RPM 5 Pro ต่างกันยังไง",
          paragraphs: [
            "SMOK ทำ RPM 5 ออกมาสองแบบ ชุดที่อยู่ในหน้านี้คือ RPM 5 ที่ใช้แบตในตัว ส่วน RPM 5 Pro ใช้ถ่าน 18650 หนึ่งก้อน",
            "ตามตารางสเปกของ SMOK รุ่น Pro สูง 129.4mm สูงกว่าชุดนี้เล็กน้อย",
          ],
        },
        {
          heading: "SMOK RPM 5 เติมน้ำยายังไง",
          paragraphs: [
            "หัวพอตเป็นแบบเติมด้านบน แค่ดันฝาให้เลื่อนเปิดก็จะเห็นรูเติมน้ำยา และเติมได้ทั้งที่หัวพอตยังติดอยู่กับตัวเครื่อง",
          ],
        },
        {
          heading: "SMOK RPM 5 ปรับลมยังไง",
          paragraphs: [
            "ปรับช่องลมได้ละเอียดแบบไม่มีขั้น ตั้งได้ตั้งแต่ลมน้อยสุดไปจนถึงลมเปิดเต็ม และปรับกลับได้ทุกเมื่อ",
          ],
        },
        {
          heading: "คอยล์ที่มาในกล่องใช้กี่วัตต์",
          paragraphs: [
            "SMOK ออกแบบคอยล์ทั้งสองแบบมาสำหรับการสูบแบบ DTL คือดูดลงปอดตรง ๆ ตัวที่ใส่มากับหัวพอตใช้ได้ช่วง 40–80 วัตต์ และ SMOK บอกว่าร้อนเร็ว ส่วนคอยล์สำรองใช้ได้ช่วง 20–45 วัตต์ และ SMOK บอกว่าให้รสนุ่มและเข้ม",
            "ถ้าอยากรู้ว่าควรตั้งวัตต์และปรับลมแค่ไหน อ่านต่อได้ที่ [เลือกวัตต์และปรับลมยังไง](/guides/choosing-wattage-and-airflow)",
          ],
        },
        {
          heading: "SMOK RPM 5 มีระบบป้องกันอะไรบ้าง",
          paragraphs: [
            "เครื่องตรวจได้ว่าใส่หัวพอตแล้วหรือยัง หยุดจ่ายไฟเมื่อกดปุ่มยิงค้างครบ 8 วินาที เตือนเมื่อแบตต่ำ และมีระบบป้องกันไฟช็อต",
          ],
        },
        {
          heading: "SMOK RPM 5 กับ Nord 5 ต่างกันยังไง",
          paragraphs: [
            "ทั้งสองรุ่นใช้คอยล์ตระกูลเดียวกัน ส่วน [SMOK Nord 5](/products/smok-nord-5) ตัวเครื่องสั้นกว่า หัวพอตจุ 5mL และใช้จอ OLED 0.69 นิ้ว",
          ],
        },
      ],
    },
    en: {
      lede: "From SMOK's own page and posters: how the RPM 5 differs from the RPM 5 Pro, how to fill it and set the airflow, and what wattage each coil in the box runs at.",
      sections: [
        {
          heading: "SMOK RPM 5 or RPM 5 Pro?",
          paragraphs: [
            "SMOK makes the RPM 5 in two versions. The kit on this page is the RPM 5 with a built-in battery; the RPM 5 Pro runs on a single external 18650 battery.",
            "According to SMOK's spec sheet, the Pro stands slightly taller at 129.4mm.",
          ],
        },
        {
          heading: "How do I fill the SMOK RPM 5?",
          paragraphs: [
            "The pod fills from the top: slide the top cover open to reach the filling hole, with no need to take the pod off the device.",
          ],
        },
        {
          heading: "How do I set the airflow on the SMOK RPM 5?",
          paragraphs: [
            "The airflow is stepless, so you can set it anywhere from the tightest to fully open and back again.",
          ],
        },
        {
          heading: "What wattage do the two coils in the box run at?",
          paragraphs: [
            "SMOK makes both for DTL vaping, drawing straight into the lungs. The coil fitted in the pod runs at 40–80W and, SMOK says, heats up fast; the spare runs at 20–45W for what SMOK calls a smooth, rich taste.",
            "Not sure where to set the wattage and airflow? See [choosing wattage and airflow](/guides/choosing-wattage-and-airflow).",
          ],
        },
        {
          heading: "What protections does the SMOK RPM 5 have?",
          paragraphs: [
            "It detects whether a pod is fitted, cuts out after 8 seconds of continuous firing, warns of a low battery and protects against short circuits.",
          ],
        },
        {
          heading: "SMOK RPM 5 or Nord 5?",
          paragraphs: [
            "Both take the same coil family. The [SMOK Nord 5](/products/smok-nord-5) is a shorter device with a 5mL pod and a 0.69-inch OLED display.",
          ],
        },
      ],
    },
    zh: {
      lede: "下面根据 SMOK 官网和海报整理：RPM 5 和 RPM 5 Pro 的区别、怎样注油和调气流，以及盒内两颗线圈各用多少瓦。",
      sections: [
        {
          heading: "SMOK RPM 5 和 RPM 5 Pro 有什么区别？",
          paragraphs: [
            "SMOK 的 RPM 5 有两个版本。本页这套是内置电池的 RPM 5，RPM 5 Pro 则使用一节外置 18650 电池。",
            "根据 SMOK 的规格表，Pro 稍高一些，为 129.4mm。",
          ],
        },
        {
          heading: "SMOK RPM 5 怎么注油？",
          paragraphs: [
            "烟弹从顶部注油：推开顶部的注油盖就能看到注油孔，不用把烟弹从主机上取下来。",
          ],
        },
        {
          heading: "SMOK RPM 5 怎么调气流？",
          paragraphs: [
            "气流可无级调节，从最小到最大任意设定，也能随时调回。",
          ],
        },
        {
          heading: "盒内两颗线圈用多少瓦？",
          paragraphs: [
            "两颗线圈都是 SMOK 为 DTL 抽法设计的，也就是直接吸入肺部。装在烟弹里的那颗适用 40–80W，SMOK 表示它升温快；备用的那颗适用 20–45W，SMOK 表示口感顺滑浓郁。",
            "想了解功率和气流怎么设置，可以看 [怎样选择功率和气流](/guides/choosing-wattage-and-airflow)。",
          ],
        },
        {
          heading: "SMOK RPM 5 有哪些保护功能？",
          paragraphs: [
            "能检测是否装好烟弹，连续点火满 8 秒自动断电，低电量时会提醒，并具备短路保护。",
          ],
        },
        {
          heading: "SMOK RPM 5 和 Nord 5 怎么选？",
          paragraphs: [
            "两款使用同一系列的线圈。[SMOK Nord 5](/products/smok-nord-5) 机身更短，烟弹容量 5mL，配 0.69 英寸 OLED 屏。",
          ],
        },
      ],
    },
  },
  // Owner task ก6 (09/11), DOTMOD: dotCoils (Coil-70) — DOTMOD's own page dotmod.com/products/dotcoils, read 09/11 in the in-app browser:
  // "Made specifically for dotmod atomizers" · "Resistance: 0.15 Ohm | 0.3 Ohm | 0.6 Ohm" · "5 INDIVIDUAL WRAPPED BLISTER PACKS WITH A COIL IN
  // EACH" · "COMPATIBILITY: dotAIO V2 · dotAIO V2 Lite · dotTank 25mm · dotStick Revo (Not compatible with 0.15 Ohm dotCoil) · dotStick Revo
  // V1.5 (Not compatible with 0.15 Ohm dotCoil) · dotPod Max (Not compatible with 0.15 Ohm dotCoil) · dotAIO Tank V3 · dotTank Max · dotAMP ·
  // dotApollo · dotAIO V3". That list belongs to the three values DOTMOD sells now. The 0.7Ω this page sells is on DOTMOD's own box; DOTMOD no
  // longer lists it. The devices for 0.7Ω = the spec row "ใช้ได้กับ" (sourced: DOTMOD's dotCoils page as read 2026-09-02, when 0.7Ω was
  // in the dotAIO V2 line-up 0.3/0.7/0.9Ω — Coil-70 spec comment); the article points to that row and names no device of its own (checker 09/11). Left out (already on the page): 5 a box, brass,
  // single mesh, the 0.7Ω 14–20W. Counted outside the spec table (checker 09/11): the three current values = section 1 +
  // section 2 ("สามค่าข้างบน"); the 0.7Ω = tagline + section 2; no article FAQ (it only repeated sections 1–2).
  "coil-70": {
    th: {
      lede: "คอยล์ตัวนี้ DOTMOD เรียกว่า dotCoils ด้านล่างสรุปจากหน้าเว็บของ DOTMOD ว่าค่าโอห์มที่ขายอยู่ตอนนี้ใช้กับเครื่องไหน และค่าในหน้านี้ควรเช็คอะไรก่อนซื้อ",
      sections: [
        {
          heading: "รายชื่อเครื่องบนเว็บ DOTMOD เป็นของคอยล์ค่าไหน",
          paragraphs: [
            "หน้าเว็บของ DOTMOD ตอนนี้ขาย dotCoils ค่า 0.15 · 0.3 และ 0.6 โอห์ม และรายชื่อเครื่องบนหน้านั้นเป็นของสามค่านี้ ได้แก่ dotAIO V2 · dotAIO V2 Lite · dotTank 25mm · dotStick Revo · dotStick Revo V1.5 · dotPod Max · dotAIO Tank V3 · dotTank Max · dotAMP · dotApollo และ dotAIO V3",
            "DOTMOD ทำคอยล์นี้มาสำหรับเครื่องของตัวเองโดยเฉพาะ ดูรุ่นอื่นของแบรนด์ได้ที่หน้า [DOTMOD](/brands/dotmod)",
          ],
        },
        {
          heading: "ค่า 0.7 โอห์มในหน้านี้ใช้กับเครื่องไหน",
          paragraphs: [
            "ค่า 0.7 โอห์มเป็นค่าที่พิมพ์อยู่บนกล่องของ DOTMOD เอง แต่หน้าเว็บของ DOTMOD ตอนนี้ขายเฉพาะสามค่าข้างบน เครื่องที่ใช้กับค่านี้ดูได้ที่แถว “ใช้ได้กับ” ในตารางสเปกของหน้านี้ ก่อนซื้อจึงควรเช็คชื่อรุ่นเครื่องของตัวเองให้ตรง",
          ],
        },
        {
          heading: "ค่า 0.15 โอห์มใช้ได้ทุกเครื่องไหม",
          paragraphs: [
            "ถ้าใช้ dotStick Revo · dotStick Revo V1.5 หรือ dotPod Max ให้เลี่ยงค่า 0.15 โอห์ม เพราะ DOTMOD ระบุว่าสามรุ่นนี้ไม่รองรับค่านั้น ส่วนเครื่องอื่นในรายชื่อนี้ DOTMOD ไม่ได้เขียนข้อยกเว้นไว้",
          ],
        },
        {
          heading: "เปลี่ยนคอยล์เมื่อไหร่ดี",
          paragraphs: [
            "วิธีดูว่าคอยล์ถึงรอบเปลี่ยนหรือยัง และใส่หัวใหม่แล้วควรรอนานแค่ไหนก่อนสูบ อ่านได้ที่ [วิธีดูแลคอยล์และหัวพอต](/guides/coil-and-pod-maintenance) ส่วนคอยล์ในกล่องนี้แยกซองมาทีละหัว จึงเปิดเฉพาะหัวที่จะเปลี่ยนได้",
          ],
        },
      ],
    },
    en: {
      lede: "This coil is DOTMOD's dotCoils. Below, from DOTMOD's own page: which devices the values it sells now fit, and what to check about the value on this page before you buy.",
      sections: [
        {
          heading: "Which coils is DOTMOD's device list for?",
          paragraphs: [
            "DOTMOD's page currently sells dotCoils at 0.15, 0.3 and 0.6Ω, and the device list there is for those three: the dotAIO V2, dotAIO V2 Lite, dotTank 25mm, dotStick Revo, dotStick Revo V1.5, dotPod Max, dotAIO Tank V3, dotTank Max, dotAMP, dotApollo and dotAIO V3.",
            "DOTMOD makes these coils for its own devices. More from the brand is on the [DOTMOD](/brands/dotmod) page.",
          ],
        },
        {
          heading: "Which device is the 0.7Ω on this page for?",
          paragraphs: [
            "The 0.7Ω value is printed on DOTMOD's own box, but DOTMOD's page now sells only the three values above. For the devices that take it, see this page's spec table, and check your device's model name before you buy.",
          ],
        },
        {
          heading: "Does the 0.15Ω fit every device?",
          paragraphs: [
            "On the dotStick Revo, dotStick Revo V1.5 or dotPod Max, skip the 0.15Ω: DOTMOD says those three don't take it. For the other devices on the list, DOTMOD gives no exception.",
          ],
        },
        {
          heading: "When should I change the coil?",
          paragraphs: [
            "For how to tell when a coil is due and how long to wait before vaping on a new one, see [coil and pod care](/guides/coil-and-pod-maintenance). Each coil in the box is packed on its own, so you only open the one you're fitting.",
          ],
        },
      ],
    },
    zh: {
      lede: "这款雾化芯就是 DOTMOD 的 dotCoils。下面根据 DOTMOD 官网整理：目前在售的阻值适用于哪些设备，以及本页的阻值购买前要核对什么。",
      sections: [
        {
          heading: "DOTMOD 官网的设备列表对应哪些阻值？",
          paragraphs: [
            "DOTMOD 官网目前在售的 dotCoils 为 0.15、0.3 和 0.6Ω，页面上的设备列表对应这三种：dotAIO V2、dotAIO V2 Lite、dotTank 25mm、dotStick Revo、dotStick Revo V1.5、dotPod Max、dotAIO Tank V3、dotTank Max、dotAMP、dotApollo 和 dotAIO V3。",
            "DOTMOD 这款雾化芯专为自家设备设计。更多产品见 [DOTMOD](/brands/dotmod) 品牌页。",
          ],
        },
        {
          heading: "本页的 0.7Ω 适用于哪款设备？",
          paragraphs: [
            "0.7Ω 是 DOTMOD 包装盒上印的阻值，但 DOTMOD 官网目前只销售上面三种阻值。该阻值适用的设备请看本页规格表，购买前请核对自己设备的型号。",
          ],
        },
        {
          heading: "0.15Ω 所有设备都能用吗？",
          paragraphs: [
            "使用 dotStick Revo、dotStick Revo V1.5 或 dotPod Max 的话，请避开 0.15Ω，DOTMOD 标明这三款不支持该阻值。列表中的其他设备，DOTMOD 没有注明例外。",
          ],
        },
        {
          heading: "什么时候该换雾化芯？",
          paragraphs: [
            "怎么判断该换芯、装上新芯后要等多久再抽，可以看 [雾化芯和烟弹保养](/guides/coil-and-pod-maintenance)。盒里每颗雾化芯都是独立包装，换哪颗拆哪颗就行。",
          ],
        },
      ],
    },
  },
  // Owner task ก6 (09/11), RELX disposables with no maker page (THAI_STYLE §5 exception 07/11): Sparta 20K. No new product fact here —
  // the flavour names are this page's own flavour list (3-shop sources in src/data/products/relx.ts) and the groups are the shop's,
  // from the words in each name. Smash Go 12K figures = its verified rows (relxnow.com). Left out on purpose: the display, airflow and
  // modes (tagline + shortDescription + features already say them), and every number for this model (its puff row is unverified).
  // en/zh leave out the guide link: /guides/how-long-a-disposable-lasts is thaiOnly. Legacy page → no article FAQ.
  "relx-sparta-20k": {
    th: {
      lede: "RELX Sparta 20K มีกลิ่นให้เลือกหลายแนว ด้านล่างร้านจัดกลิ่นเป็นสายให้เลือกได้ง่ายขึ้น และเทียบให้ดูกับพอตใช้แล้วทิ้งรุ่นอื่นของ RELX",
      sections: [
        {
          heading: "RELX Sparta 20K กลิ่นไหนดี",
          paragraphs: [
            "ลองเริ่มจากสายที่ชอบก่อนก็ได้ สายด้านล่างนี้เป็นการจัดของร้านเอง โดยดูจากคำในชื่อกลิ่นแต่ละชื่อ",
            "สายมินต์มี Double Mint กับ Raspberry Mint ส่วนสายชามี Oolong Ice Tea",
            "สายผลไม้มี 9 กลิ่น คือ Apple · Blueberry · Grape · Grape Lychee · Mixberry · Peach Strawberry · Pineapple · Strawberry และ Watermelon",
            "แนวขนมและเครื่องดื่มมี Cola · Mineral Water · Rainbow Candy และ Sour Gummy",
          ],
        },
        {
          heading: "RELX Sparta 20K เทียบกับรุ่นอื่นของ RELX",
          paragraphs: [
            "ถ้าอยากได้รุ่นที่ RELX ลงสเปกไว้เอง ลองดู [RELX Smash Go 12K](/products/relx-smash-go-12k) ซึ่งเป็นพอตใช้แล้วทิ้งเหมือนกัน RELX ระบุไว้ว่าสูบได้สูงสุด 12,000 พัฟ และใช้แบต 400mAh",
            "ส่วน [RELX Novo 14K](/products/relx-novo-14k) มีกลิ่นที่ชื่อตรงกับรุ่นนี้หลายกลิ่น เช่น Apple · Blueberry · Double Mint และ Watermelon ถ้าชอบกลิ่นเหล่านี้ ก็มีให้เลือกทั้งสองรุ่น",
            "พอตใช้แล้วทิ้งหนึ่งเครื่องใช้ได้กี่วันขึ้นกับว่าสูบบ่อยแค่ไหน ร้านเล่าไว้ละเอียดที่ [พอตใช้แล้วทิ้ง ใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts)",
          ],
        },
      ],
    },
    en: {
      lede: "The RELX Sparta 20K offers flavours in several styles. Below, we sort them into groups to make choosing easier, and compare it with other RELX disposables.",
      sections: [
        {
          heading: "Which RELX Sparta 20K flavour should I start with?",
          paragraphs: [
            "Start with the kind you like. The groups are ours, from the words in each name, not RELX's own.",
            "Mint has Double Mint and Raspberry Mint, and tea has Oolong Ice Tea.",
            "Fruit has nine: Apple, Blueberry, Grape, Grape Lychee, Mixberry, Peach Strawberry, Pineapple, Strawberry and Watermelon.",
            "Sweets and drinks are Cola, Mineral Water, Rainbow Candy and Sour Gummy.",
          ],
        },
        {
          heading: "How does the RELX Sparta 20K compare with other RELX models?",
          paragraphs: [
            "If you'd prefer a model with specs published by RELX itself, look at the [RELX Smash Go 12K](/products/relx-smash-go-12k): a disposable rated for up to 12,000 puffs, with a 400mAh battery.",
            "The [RELX Novo 14K](/products/relx-novo-14k) shares several flavour names with this one, such as Apple, Blueberry, Double Mint and Watermelon, so if those are your flavours, you'll find them on both.",
          ],
        },
      ],
    },
    zh: {
      lede: "RELX Sparta 20K 口味类型很多。下面由本店把口味分好组方便挑选，并和 RELX 的其他一次性型号做个比较。",
      sections: [
        {
          heading: "RELX Sparta 20K 哪个口味好？",
          paragraphs: [
            "可以先从喜欢的类型选起。分组由本店按口味名称里的词整理，并非 RELX 官方分类。",
            "薄荷类有 Double Mint 和 Raspberry Mint，茶类有 Oolong Ice Tea。",
            "水果类有 9 款：Apple、Blueberry、Grape、Grape Lychee、Mixberry、Peach Strawberry、Pineapple、Strawberry 和 Watermelon。",
            "糖果和饮品类有 Cola、Mineral Water、Rainbow Candy 和 Sour Gummy。",
          ],
        },
        {
          heading: "RELX Sparta 20K 和 RELX 其他型号比怎么样？",
          paragraphs: [
            "想选 RELX 官方公布规格的型号，可以看看 [RELX Smash Go 12K](/products/relx-smash-go-12k)。这款一次性设备 RELX 标称最高 12,000 口，电池 400mAh。",
            "[RELX Novo 14K](/products/relx-novo-14k) 有好几款口味名称和这款相同，例如 Apple、Blueberry、Double Mint 和 Watermelon，喜欢这些口味的话，两款都有。",
          ],
        },
      ],
    },
  },
  // Owner task ก6 (09/11), RELX Novo 14K — same basis as Sparta 20K above (flavour names = this page's list; groups = the shop's; Smash Go
  // figures = its verified rows). Left out: the display and USB-C (tagline + shortDescription + feature) and every number for this model.
  "relx-novo-14k": {
    th: {
      lede: "RELX Novo 14K มีกลิ่นให้เลือกหลายแนว ด้านล่างร้านจัดกลิ่นเป็นสายให้เลือกได้ง่ายขึ้น และเทียบให้ดูกับพอตใช้แล้วทิ้งรุ่นอื่นของ RELX",
      sections: [
        {
          heading: "RELX Novo 14K กลิ่นไหนดี",
          paragraphs: [
            "ลองเริ่มจากสายที่ชอบก่อนก็ได้ สายด้านล่างนี้เป็นการจัดของร้านเอง โดยดูจากคำในชื่อกลิ่นแต่ละชื่อ",
            "สายเย็นมี Double Mint กับ Sour Lime Ice ส่วนสายชามี LongJing Ice Tea",
            "สายผลไม้มี 9 กลิ่น คือ Apple · Blueberry · Grape · Grape Apple · Mixed Berry · Sea Salt Lemon · Sour Berry · Strawberry และ Watermelon",
            "แนวเครื่องดื่มและขนมมี Orange Soda กับ Sour Bubblegum",
          ],
        },
        {
          heading: "RELX Novo 14K เทียบกับรุ่นอื่นของ RELX",
          paragraphs: [
            "ถ้าอยากได้รุ่นที่ RELX ลงสเปกไว้เอง ลองดู [RELX Smash Go 12K](/products/relx-smash-go-12k) ซึ่งเป็นพอตใช้แล้วทิ้งเหมือนกัน RELX ระบุไว้ว่าสูบได้สูงสุด 12,000 พัฟ และใช้แบต 400mAh",
            "ส่วน [RELX Sparta 20K](/products/relx-sparta-20k) มีกลิ่นที่ชื่อตรงกับรุ่นนี้หลายกลิ่น เช่น Apple · Blueberry · Double Mint และ Watermelon แล้วยังมีแนวขนมอย่าง Rainbow Candy กับ Sour Gummy ให้เลือกเพิ่มด้วย",
            "พอตใช้แล้วทิ้งหนึ่งเครื่องใช้ได้กี่วันขึ้นกับว่าสูบบ่อยแค่ไหน ร้านเล่าไว้ละเอียดที่ [พอตใช้แล้วทิ้ง ใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts)",
          ],
        },
      ],
    },
    en: {
      lede: "The RELX Novo 14K offers flavours in several styles. Below, we sort them into groups to make choosing easier, and compare it with other RELX disposables.",
      sections: [
        {
          heading: "Which RELX Novo 14K flavour should I start with?",
          paragraphs: [
            "Start with the kind you like. The groups are ours, from the words in each name, not RELX's own.",
            "Cool flavours are Double Mint and Sour Lime Ice, and tea is LongJing Ice Tea.",
            "Fruit has nine: Apple, Blueberry, Grape, Grape Apple, Mixed Berry, Sea Salt Lemon, Sour Berry, Strawberry and Watermelon.",
            "Drinks and sweets are Orange Soda and Sour Bubblegum.",
          ],
        },
        {
          heading: "How does the RELX Novo 14K compare with other RELX models?",
          paragraphs: [
            "If you'd prefer a model with specs published by RELX itself, look at the [RELX Smash Go 12K](/products/relx-smash-go-12k): a disposable rated for up to 12,000 puffs, with a 400mAh battery.",
            "The [RELX Sparta 20K](/products/relx-sparta-20k) shares several flavour names with this one, such as Apple, Blueberry, Double Mint and Watermelon, and adds sweets such as Rainbow Candy and Sour Gummy.",
          ],
        },
      ],
    },
    zh: {
      lede: "RELX Novo 14K 口味类型很多。下面由本店把口味分好组方便挑选，并和 RELX 的其他一次性型号做个比较。",
      sections: [
        {
          heading: "RELX Novo 14K 哪个口味好？",
          paragraphs: [
            "可以先从喜欢的类型选起。分组由本店按口味名称里的词整理，并非 RELX 官方分类。",
            "清凉类有 Double Mint 和 Sour Lime Ice，茶类有 LongJing Ice Tea。",
            "水果类有 9 款：Apple、Blueberry、Grape、Grape Apple、Mixed Berry、Sea Salt Lemon、Sour Berry、Strawberry 和 Watermelon。",
            "饮品和糖果类有 Orange Soda 和 Sour Bubblegum。",
          ],
        },
        {
          heading: "RELX Novo 14K 和 RELX 其他型号比怎么样？",
          paragraphs: [
            "想选 RELX 官方公布规格的型号，可以看看 [RELX Smash Go 12K](/products/relx-smash-go-12k)。这款一次性设备 RELX 标称最高 12,000 口，电池 400mAh。",
            "[RELX Sparta 20K](/products/relx-sparta-20k) 有好几款口味名称和这款相同，例如 Apple、Blueberry、Double Mint 和 Watermelon，另外还多了 Rainbow Candy、Sour Gummy 这类糖果口味。",
          ],
        },
      ],
    },
  },
  // Owner task ก6 (09/11), RELX Diva 30K — same basis as Sparta 20K above (flavour names = this page's list, incl. the five whose names end in
  // 5%; groups = the shop's; Smash Go figures = its verified rows). Left out: the display and ECO/BOOST (tagline + shortDescription + features)
  // and every number for this model except the 5% printed in flavour names (one paragraph here; the shortDescription names no
  // percentage, only "the stronger version"; thai-copy 09/11).
  "relx-diva-30k": {
    th: {
      lede: "RELX Diva 30K มีกลิ่นให้เลือกหลายแนว ด้านล่างร้านจัดกลิ่นเป็นสายให้เลือกได้ง่ายขึ้น และเทียบให้ดูกับรุ่นอื่นของ RELX",
      sections: [
        {
          heading: "RELX Diva 30K กลิ่นไหนดี",
          paragraphs: [
            "ลองเริ่มจากสายที่ชอบก่อนก็ได้ สายด้านล่างนี้เป็นการจัดของร้านเอง โดยดูจากคำในชื่อกลิ่นแต่ละชื่อ",
            "สายมินต์มี Double Mint กับ Spearmint",
            "สายผลไม้มี 7 กลิ่น คือ Fresh Melon · Grape · Grape Aloe · Mango Passion Fruit · Mix Berry · Orange Splash และ Watermelon",
            "แนวขนมและเครื่องดื่มมี Cola · Mineral Water และ Strawberry Ice Cream",
            "ชื่อที่มี 5% ต่อท้ายมี 5 กลิ่น คือ Cola 5% · Double Mint 5% · Grape 5% · Watermelon 5% และ Copico Coffee 5% ส่วน Copico Coffee มีให้เลือกแบบเดียวคือ Copico Coffee 5% ก่อนกดเลือก ลองดูชื่อในรายการอีกครั้งให้ตรงกับแบบที่ต้องการ",
          ],
        },
        {
          heading: "RELX Diva 30K เทียบกับรุ่นอื่นของ RELX",
          paragraphs: [
            "ถ้าอยากได้รุ่นที่ RELX ลงสเปกไว้เอง ลองดู [RELX Smash Go 12K](/products/relx-smash-go-12k) ซึ่งเป็นพอตใช้แล้วทิ้งเหมือนกัน RELX ระบุไว้ว่าสูบได้สูงสุด 12,000 พัฟ และใช้แบต 400mAh",
            "ถ้าอยากเทียบกลิ่นกับ RELX อีกรุ่น [RELX Sparta 20K](/products/relx-sparta-20k) ก็มีกลิ่นชื่อเดียวกันอย่าง Cola กับ Mineral Water",
            "พอตใช้แล้วทิ้งหนึ่งเครื่องใช้ได้กี่วันขึ้นกับว่าสูบบ่อยแค่ไหน ร้านเล่าไว้ละเอียดที่ [พอตใช้แล้วทิ้ง ใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts)",
          ],
        },
      ],
    },
    en: {
      lede: "The RELX Diva 30K offers flavours in several styles. Below, we sort them into groups to make choosing easier, and compare it with other RELX models.",
      sections: [
        {
          heading: "Which RELX Diva 30K flavour should I start with?",
          paragraphs: [
            "Start with the kind you like. The groups are ours, from the words in each name, not RELX's own.",
            "Mint has Double Mint and Spearmint.",
            "Fruit has seven: Fresh Melon, Grape, Grape Aloe, Mango Passion Fruit, Mix Berry, Orange Splash and Watermelon.",
            "Sweets and drinks are Cola, Mineral Water and Strawberry Ice Cream.",
            "Five names end in 5%: Cola 5%, Double Mint 5%, Grape 5%, Watermelon 5% and Copico Coffee 5%. Copico Coffee comes only as Copico Coffee 5%. Check the name in the list before you choose.",
          ],
        },
        {
          heading: "How does the RELX Diva 30K compare with other RELX models?",
          paragraphs: [
            "If you'd prefer a model with specs published by RELX itself, look at the [RELX Smash Go 12K](/products/relx-smash-go-12k): a disposable rated for up to 12,000 puffs, with a 400mAh battery.",
            "For another RELX with some of the same flavour names, the [RELX Sparta 20K](/products/relx-sparta-20k) also has Cola and Mineral Water.",
          ],
        },
      ],
    },
    zh: {
      lede: "RELX Diva 30K 口味类型很多。下面由本店把口味分好组方便挑选，并和 RELX 其他型号做个比较。",
      sections: [
        {
          heading: "RELX Diva 30K 哪个口味好？",
          paragraphs: [
            "可以先从喜欢的类型选起。分组由本店按口味名称里的词整理，并非 RELX 官方分类。",
            "薄荷类有 Double Mint 和 Spearmint。",
            "水果类有 7 款：Fresh Melon、Grape、Grape Aloe、Mango Passion Fruit、Mix Berry、Orange Splash 和 Watermelon。",
            "糖果和饮品类有 Cola、Mineral Water 和 Strawberry Ice Cream。",
            "名称以 5% 结尾的有 5 款：Cola 5%、Double Mint 5%、Grape 5%、Watermelon 5% 和 Copico Coffee 5%，其中 Copico Coffee 只有 Copico Coffee 5% 一种。选择前请核对列表里的名称。",
          ],
        },
        {
          heading: "RELX Diva 30K 和 RELX 其他型号比怎么样？",
          paragraphs: [
            "想选 RELX 官方公布规格的型号，可以看看 [RELX Smash Go 12K](/products/relx-smash-go-12k)。这款一次性设备 RELX 标称最高 12,000 口，电池 400mAh。",
            "想和 RELX 另一款比较口味，[RELX Sparta 20K](/products/relx-sparta-20k) 也有同名的 Cola 和 Mineral Water。",
          ],
        },
      ],
    },
  },
  // Owner task ก6 (09/11), unbranded disposables with no maker site (NEXAS Booster 16K · Foli Cool Bar 15K · 86 Bar 20K), the #1339 pattern:
  // no new product fact. Flavour names = each page's own list (sources in src/data/products/unbranded.ts); groups = the shop's, from the
  // words in each name. M Bar 9K figures = its verified rows (salthub.com). Left out per page: what its tagline / shortDescription / feature
  // cards already say (NEXAS: lights + 3-step airflow + figures; 86 Bar: mesh + figures; Foli: 15,000 + the flavour count) and every number
  // for these models. en/zh leave out the guide link (/guides/how-long-a-disposable-lasts is thaiOnly). Evidence:
  // _incoming/ก6-gates/unbranded-source/. Legacy pages → no article FAQ.
  "nexas-booster-16k": {
    th: {
      lede: "NEXAS Booster 16K มีกลิ่นให้เลือกหลายแนว ด้านล่างร้านจัดกลิ่นเป็นสายให้เลือกได้ง่ายขึ้น และเทียบให้ดูกับ M Bar 9K",
      sections: [
        {
          heading: "NEXAS Booster 16K กลิ่นไหนดี",
          paragraphs: [
            "ลองเริ่มจากสายที่ชอบก่อนก็ได้ สายด้านล่างนี้เป็นการจัดของร้านเอง โดยดูจากคำในชื่อกลิ่นแต่ละชื่อ",
            "สายมินต์มี Mint Extra ส่วนสายชามี Oolong Tea",
            "สายผลไม้มี 11 กลิ่น คือ Grape Ice · Grape Lychee · Green Apple · Lychee Ice · Mix Berries · Peach Strawberry · Strawberry Banana · Strawberry Ice · Strawberry Watermelon · Watermelon Ice และ Yoyo Grape",
            "แนวเครื่องดื่มมี Cola Ice · Cola Lemon · Green Soda · Mineral Water และ Red Soda",
          ],
        },
        {
          heading: "NEXAS Booster 16K เทียบกับรุ่นอื่น",
          paragraphs: [
            "ถ้าอยากได้รุ่นที่ผู้ผลิตลงสเปกไว้เอง ลองดู [M Bar 9K](/products/m-bar-9k) ของ SALTHUB ซึ่งเป็นพอตใช้แล้วทิ้งเหมือนกัน SALTHUB ระบุไว้ว่าสูบได้สูงสุด 9,000 พัฟ และใช้นิโคตินแบบ salt nic ความเข้มข้น 30mg",
            "M Bar 9K ก็มีกลิ่นชื่อเดียวกับรุ่นนี้ คือ Grape Lychee และ Peach Strawberry ถ้าชอบสองกลิ่นนี้ ก็เลือกได้ทั้งสองรุ่น",
            "พอตใช้แล้วทิ้งหนึ่งเครื่องใช้ได้กี่วันขึ้นกับว่าสูบบ่อยแค่ไหน ร้านเล่าไว้ละเอียดที่ [พอตใช้แล้วทิ้ง ใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts)",
          ],
        },
      ],
    },
    en: {
      lede: "The NEXAS Booster 16K offers flavours in several styles. Below, we sort them into groups to make choosing easier, and compare it with the M Bar 9K.",
      sections: [
        {
          heading: "Which NEXAS Booster 16K flavour should I start with?",
          paragraphs: [
            "Start with the kind you like. The groups are ours, from the words in each name.",
            "Mint has Mint Extra, and tea has Oolong Tea.",
            "Fruit has eleven: Grape Ice, Grape Lychee, Green Apple, Lychee Ice, Mix Berries, Peach Strawberry, Strawberry Banana, Strawberry Ice, Strawberry Watermelon, Watermelon Ice and Yoyo Grape.",
            "Drinks are Cola Ice, Cola Lemon, Green Soda, Mineral Water and Red Soda.",
          ],
        },
        {
          heading: "How does the NEXAS Booster 16K compare with other models?",
          paragraphs: [
            "If you'd prefer a model with specs published by its maker, look at SALTHUB's [M Bar 9K](/products/m-bar-9k), also a disposable. SALTHUB rates it for up to 9,000 puffs, with 30mg salt nic.",
            "The M Bar 9K also shares two flavour names with this one, Grape Lychee and Peach Strawberry, so if those are your flavours, you'll find them on both.",
          ],
        },
      ],
    },
    zh: {
      lede: "NEXAS Booster 16K 口味类型很多。下面由本店把口味分好组方便挑选，并和 M Bar 9K 做个比较。",
      sections: [
        {
          heading: "NEXAS Booster 16K 哪个口味好？",
          paragraphs: [
            "可以先从喜欢的类型选起。分组由本店按口味名称里的词整理。",
            "薄荷类有 Mint Extra，茶类有 Oolong Tea。",
            "水果类有 11 款：Grape Ice、Grape Lychee、Green Apple、Lychee Ice、Mix Berries、Peach Strawberry、Strawberry Banana、Strawberry Ice、Strawberry Watermelon、Watermelon Ice 和 Yoyo Grape。",
            "饮品类有 Cola Ice、Cola Lemon、Green Soda、Mineral Water 和 Red Soda。",
          ],
        },
        {
          heading: "NEXAS Booster 16K 和其他型号比怎么样？",
          paragraphs: [
            "想选厂家公布规格的型号，可以看看 SALTHUB 的 [M Bar 9K](/products/m-bar-9k)，同样是一次性设备。SALTHUB 标称最高 9,000 口，使用 30mg 盐尼古丁。",
            "M Bar 9K 也有和这款同名的 Grape Lychee 和 Peach Strawberry，喜欢这两种口味的话，两个型号都能选。",
          ],
        },
      ],
    },
  },
  "foli-bar-15k": {
    th: {
      lede: "Foli Cool Bar 15K มีกลิ่นให้เลือกหลายแนว ด้านล่างร้านจัดกลิ่นเป็นสายให้เลือกได้ง่ายขึ้น และเทียบให้ดูกับ M Bar 9K",
      sections: [
        {
          heading: "Foli Cool Bar 15K กลิ่นไหนดี",
          paragraphs: [
            "ลองเริ่มจากสายที่ชอบก่อนก็ได้ สายด้านล่างนี้เป็นการจัดของร้านเอง โดยดูจากคำในชื่อกลิ่นแต่ละชื่อ",
            "สายมินต์มีกลิ่น Double Mint",
            "สายผลไม้มี 9 กลิ่น คือ Apple Aloe · Blueberry · Grape · Grape Aloe · Lychee Ice · Mix Berry · Peach · Strawberry Ice และ Watermelon",
            "แนวเครื่องดื่มมี Cola Ice กับ Red Bull Ice",
          ],
        },
        {
          heading: "Foli Cool Bar 15K เทียบกับรุ่นอื่น",
          paragraphs: [
            "ถ้าอยากได้รุ่นที่ผู้ผลิตลงสเปกไว้เอง ลองดู [M Bar 9K](/products/m-bar-9k) ของ SALTHUB ซึ่งเป็นพอตใช้แล้วทิ้งเหมือนกัน SALTHUB ระบุไว้ว่าสูบได้สูงสุด 9,000 พัฟ ใช้แบต 600mAh ที่ชาร์จผ่าน USB-C และปรับลมได้",
            "M Bar 9K ก็มีกลิ่นชื่อเดียวกับรุ่นนี้หลายกลิ่น เช่น Apple Aloe · Grape Aloe · Peach และ Watermelon ถ้าชอบกลิ่นเหล่านี้ ก็เลือกได้ทั้งสองรุ่น",
            "พอตใช้แล้วทิ้งหนึ่งเครื่องใช้ได้กี่วันขึ้นกับว่าสูบบ่อยแค่ไหน ร้านเล่าไว้ละเอียดที่ [พอตใช้แล้วทิ้ง ใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts)",
          ],
        },
      ],
    },
    en: {
      lede: "The Foli Cool Bar 15K offers flavours in several styles. Below, we sort them into groups to make choosing easier, and compare it with the M Bar 9K.",
      sections: [
        {
          heading: "Which Foli Cool Bar 15K flavour should I start with?",
          paragraphs: [
            "Start with the kind you like. The groups are ours, from the words in each name.",
            "For mint, there's Double Mint.",
            "Fruit has nine: Apple Aloe, Blueberry, Grape, Grape Aloe, Lychee Ice, Mix Berry, Peach, Strawberry Ice and Watermelon.",
            "Drinks are Cola Ice and Red Bull Ice.",
          ],
        },
        {
          heading: "How does the Foli Cool Bar 15K compare with other models?",
          paragraphs: [
            "If you'd prefer a model with specs published by its maker, look at SALTHUB's [M Bar 9K](/products/m-bar-9k), also a disposable. SALTHUB rates it for up to 9,000 puffs, with adjustable airflow and a 600mAh battery that charges over USB-C.",
            "The M Bar 9K also shares several flavour names with this one, such as Apple Aloe, Grape Aloe, Peach and Watermelon, so if those are your flavours, you'll find them on both.",
          ],
        },
      ],
    },
    zh: {
      lede: "Foli Cool Bar 15K 口味类型很多。下面由本店把口味分好组方便挑选，并和 M Bar 9K 做个比较。",
      sections: [
        {
          heading: "Foli Cool Bar 15K 哪个口味好？",
          paragraphs: [
            "可以先从喜欢的类型选起。分组由本店按口味名称里的词整理。",
            "薄荷类有 Double Mint。",
            "水果类有 9 款：Apple Aloe、Blueberry、Grape、Grape Aloe、Lychee Ice、Mix Berry、Peach、Strawberry Ice 和 Watermelon。",
            "饮品类有 Cola Ice 和 Red Bull Ice。",
          ],
        },
        {
          heading: "Foli Cool Bar 15K 和其他型号比怎么样？",
          paragraphs: [
            "想选厂家公布规格的型号，可以看看 SALTHUB 的 [M Bar 9K](/products/m-bar-9k)，同样是一次性设备。SALTHUB 标称最高 9,000 口，电池 600mAh，USB-C 充电，气流可调。",
            "M Bar 9K 也有好几款和这款同名的口味，例如 Apple Aloe、Grape Aloe、Peach 和 Watermelon，喜欢这些口味的话，两个型号都能选。",
          ],
        },
      ],
    },
  },
  "86-bar-20k": {
    th: {
      lede: "86 Bar 20K มีกลิ่นให้เลือกหลายแนว ด้านล่างร้านจัดกลิ่นเป็นสายให้เลือกได้ง่ายขึ้น และเทียบให้ดูกับ M Bar 9K",
      sections: [
        {
          heading: "86 Bar 20K กลิ่นไหนดี",
          paragraphs: [
            "ลองเริ่มจากสายที่ชอบก่อนก็ได้ สายด้านล่างนี้เป็นการจัดของร้านเอง โดยดูจากคำในชื่อกลิ่นแต่ละชื่อ",
            "สายมินต์มี Mint Freeze กับ Watermelon Mint ส่วนสายชามี Oishi Green Tea",
            "สายผลไม้มี 8 กลิ่น คือ Coco Pine · Grape · Lychee · Magic Mango · Mixberry · Strawberry Kiwi · Watermelon และ Watermelon Strawberry",
            "แนวเครื่องดื่มมี Lemon Cola ส่วน Blue Ice ชื่อกลิ่นไม่ได้บอกว่าเป็นแนวไหน ร้านจึงแยกไว้ต่างหาก",
          ],
        },
        {
          heading: "86 Bar 20K เทียบกับรุ่นอื่น",
          paragraphs: [
            "ถ้าอยากได้รุ่นที่ผู้ผลิตลงสเปกไว้เอง ลองดู [M Bar 9K](/products/m-bar-9k) ของ SALTHUB ซึ่งเป็นพอตใช้แล้วทิ้งเหมือนกัน SALTHUB ระบุไว้ว่าสูบได้สูงสุด 9,000 พัฟ และปรับลมได้",
            "M Bar 9K ก็มีกลิ่นชื่อเดียวกับรุ่นนี้หลายกลิ่น เช่น Blue Ice · Mixberry · Strawberry Kiwi และ Watermelon ถ้าชอบกลิ่นเหล่านี้ ก็เลือกได้ทั้งสองรุ่น",
            "พอตใช้แล้วทิ้งหนึ่งเครื่องใช้ได้กี่วันขึ้นกับว่าสูบบ่อยแค่ไหน ร้านเล่าไว้ละเอียดที่ [พอตใช้แล้วทิ้ง ใช้ได้กี่วัน](/guides/how-long-a-disposable-lasts)",
          ],
        },
      ],
    },
    en: {
      lede: "The 86 Bar 20K offers flavours in several styles. Below, we sort them into groups to make choosing easier, and compare it with the M Bar 9K.",
      sections: [
        {
          heading: "Which 86 Bar 20K flavour should I start with?",
          paragraphs: [
            "Start with the kind you like. The groups are ours, from the words in each name.",
            "Mint has Mint Freeze and Watermelon Mint, and tea has Oishi Green Tea.",
            "Fruit has eight: Coco Pine, Grape, Lychee, Magic Mango, Mixberry, Strawberry Kiwi, Watermelon and Watermelon Strawberry.",
            "For drinks, there's Lemon Cola. Blue Ice's name doesn't say what style it is, so we've kept it apart.",
          ],
        },
        {
          heading: "How does the 86 Bar 20K compare with other models?",
          paragraphs: [
            "If you'd prefer a model with specs published by its maker, look at SALTHUB's [M Bar 9K](/products/m-bar-9k), also a disposable. SALTHUB rates it for up to 9,000 puffs, with adjustable airflow.",
            "The M Bar 9K also shares several flavour names with this one, such as Blue Ice, Mixberry, Strawberry Kiwi and Watermelon, so if those are your flavours, you'll find them on both.",
          ],
        },
      ],
    },
    zh: {
      lede: "86 Bar 20K 口味类型很多。下面由本店把口味分好组方便挑选，并和 M Bar 9K 做个比较。",
      sections: [
        {
          heading: "86 Bar 20K 哪个口味好？",
          paragraphs: [
            "可以先从喜欢的类型选起。分组由本店按口味名称里的词整理。",
            "薄荷类有 Mint Freeze 和 Watermelon Mint，茶类有 Oishi Green Tea。",
            "水果类有 8 款：Coco Pine、Grape、Lychee、Magic Mango、Mixberry、Strawberry Kiwi、Watermelon 和 Watermelon Strawberry。",
            "饮品类有 Lemon Cola。Blue Ice 的名称看不出口味类型，所以单独列出。",
          ],
        },
        {
          heading: "86 Bar 20K 和其他型号比怎么样？",
          paragraphs: [
            "想选厂家公布规格的型号，可以看看 SALTHUB 的 [M Bar 9K](/products/m-bar-9k)，同样是一次性设备。SALTHUB 标称最高 9,000 口，气流可调。",
            "M Bar 9K 也有好几款和这款同名的口味，例如 Blue Ice、Mixberry、Strawberry Kiwi 和 Watermelon，喜欢这些口味的话，两个型号都能选。",
          ],
        },
      ],
    },
  },
  // Owner task ก6 (09/11), Vazer Reload 15K — no maker page (vazerpod.com does not resolve), so the #1339 pattern: no new product fact.
  // Flavour names = this page's own list (the brand's chart, 3-shop sources in src/data/products/unbranded.ts); groups = the shop's, from the
  // words in each name; Malibu's name gives no style, so it stays ungrouped. M Switch Kit = its verified rows (salthub.com/m-switch-kit/).
  // Left out: the swap head (tagline + shortDescription + "swap" card already say it), mesh/airflow ("air" card) and every number for this
  // model ("figures" card). Evidence: _incoming/ก6-gates/vazer-source/. Legacy page → no article FAQ.
  "vazer-reload-15k": {
    th: {
      lede: "Vazer Reload 15K มีกลิ่นให้เลือกหลายแนว ด้านล่างร้านจัดกลิ่นเป็นสายให้เลือกได้ง่ายขึ้น และเทียบให้ดูกับรุ่นใกล้เคียง",
      sections: [
        {
          heading: "Vazer Reload 15K กลิ่นไหนดี",
          paragraphs: [
            "ลองเริ่มจากสายที่ชอบก่อนก็ได้ สายด้านล่างนี้เป็นการจัดของร้านเอง โดยดูจากคำในชื่อกลิ่นแต่ละชื่อ",
            "สายมินต์มี Cool Mint",
            "สายผลไม้มี 9 กลิ่น คือ Apple Fuji · Blueberry · Grape Lychee · Grape Osaka · Ice Grape · Lychee · Mixberry · Peach Paradise และ Watermelon Slushie",
            "แนวขนมและเครื่องดื่มมี Lemon Soda · Original Cola · Root Beer และ Strawberry Candy",
            "ส่วน Malibu ชื่อกลิ่นไม่ได้บอกว่าเป็นแนวไหน ร้านจึงแยกไว้ต่างหาก",
          ],
        },
        {
          heading: "Vazer Reload 15K เทียบกับรุ่นอื่น",
          paragraphs: [
            "ถ้าอยากได้รุ่นที่ผู้ผลิตลงสเปกไว้เอง ลองดู [M Switch Kit](/products/m-switch-kit) ของ SALTHUB ตามที่ SALTHUB ระบุไว้ ตัวเครื่องใช้ซ้ำได้ และมีจอบอกระดับแบตทั้งตอนกำลังชาร์จและตอนชาร์จเต็ม",
            "M Switch Kit ก็มี Grape Lychee และ Mixberry เหมือนรุ่นนี้ ถ้าชอบสองกลิ่นนี้ ก็เลือกได้ทั้งสองรุ่น",
          ],
        },
      ],
    },
    en: {
      lede: "The Vazer Reload 15K offers flavours in several styles. Below, we sort them into groups to make choosing easier, and compare it with a similar model.",
      sections: [
        {
          heading: "Which Vazer Reload 15K flavour should I start with?",
          paragraphs: [
            "Start with the kind you like. The groups are ours, from the words in each name.",
            "Mint has Cool Mint.",
            "Fruit has nine: Apple Fuji, Blueberry, Grape Lychee, Grape Osaka, Ice Grape, Lychee, Mixberry, Peach Paradise and Watermelon Slushie.",
            "Sweets and drinks are Lemon Soda, Original Cola, Root Beer and Strawberry Candy.",
            "Malibu's name doesn't say what style it is, so we haven't put it in a group.",
          ],
        },
        {
          heading: "How does the Vazer Reload 15K compare with other models?",
          paragraphs: [
            "If you'd prefer a model with specs published by its maker, look at SALTHUB's [M Switch Kit](/products/m-switch-kit). SALTHUB lists a reusable device with a battery display that shows while charging and when fully charged.",
            "The M Switch Kit also shares two flavour names with this one, Grape Lychee and Mixberry, so if those are your flavours, you'll find them on both.",
          ],
        },
      ],
    },
    zh: {
      lede: "Vazer Reload 15K 口味类型很多。下面由本店把口味分好组方便挑选，并和相近的型号做个比较。",
      sections: [
        {
          heading: "Vazer Reload 15K 哪个口味好？",
          paragraphs: [
            "可以先从喜欢的类型选起。分组由本店按口味名称里的词整理。",
            "薄荷类有 Cool Mint。",
            "水果类有 9 款：Apple Fuji、Blueberry、Grape Lychee、Grape Osaka、Ice Grape、Lychee、Mixberry、Peach Paradise 和 Watermelon Slushie。",
            "糖果和饮品类有 Lemon Soda、Original Cola、Root Beer 和 Strawberry Candy。",
            "Malibu 的名称看不出口味类型，所以没有归入任何一组。",
          ],
        },
        {
          heading: "Vazer Reload 15K 和其他型号比怎么样？",
          paragraphs: [
            "想选厂家公布规格的型号，可以看看 SALTHUB 的 [M Switch Kit](/products/m-switch-kit)。SALTHUB 标明主机可重复使用，并有电量显示屏，充电中和充满时都会显示。",
            "M Switch Kit 也有和这款同名的 Grape Lychee 和 Mixberry，喜欢这两种口味的话，两个型号都能选。",
          ],
        },
      ],
    },
  },
  // Owner task ก6 (09/11), Vazer One pod — same basis as Vazer Reload 15K above (flavour names = this page's list, from the maker's posters
  // as sold by maneevp.com; groups = the shop's). "Pod only" = its verified format row. Vazer Reload = a device with a pre-filled head (its
  // own tagline). "Not confirmed to fit the Reload body" = the shop's state of knowledge, no source says either way. Left out: the count of
  // flavours (shortDescription). Evidence: _incoming/ก6-gates/vazer-source/. Legacy page → no article FAQ.
  "vazer-one-pod": {
    th: {
      lede: "หัวพอต Vazer One มีกลิ่นให้เลือกหลายแนว ด้านล่างร้านจัดกลิ่นเป็นสายให้เลือกได้ง่ายขึ้น และเล่าให้ฟังว่าต่างจาก Vazer Reload 15K ตรงไหน",
      sections: [
        {
          heading: "หัวพอต Vazer One กลิ่นไหนดี",
          paragraphs: [
            "ลองเริ่มจากสายที่ชอบก่อนก็ได้ สายด้านล่างนี้เป็นการจัดของร้านเอง โดยดูจากคำในชื่อกลิ่นแต่ละชื่อ",
            "สายมินต์มีกลิ่น Mint",
            "สายผลไม้มี 12 กลิ่น คือ Blueberry · Grape · Grapefruit · Lychee · Mango · Melon · Mix Berries · Peach · Pineapple · Raspberry · Strawberry และ Watermelon",
            "แนวเครื่องดื่มมี Cola · Cola Lemon · Lemon Soda และ Rootbeer",
            "แนวขนมและของหวานมี Gummy Bear · Milk Honey · Strawberry Ice-Cream และ Vanilla Custard",
          ],
        },
        {
          heading: "Vazer One กับ Vazer Reload 15K ต่างกันยังไง",
          paragraphs: [
            "Vazer One ในหน้านี้เป็นหัวพอตอย่างเดียว ไม่มีตัวเครื่องมาด้วย ส่วน [Vazer Reload 15K](/products/vazer-reload-15k) มาเป็นตัวเครื่องพร้อมหัวพอตที่เปลี่ยนได้",
            "ร้านยังไม่มีข้อมูลยืนยันว่าหัวพอต Vazer One ใส่กับตัวเครื่อง Vazer Reload ได้หรือไม่ ก่อนสั่งลองเช็คให้แน่ใจว่าเครื่องที่ใช้อยู่ใส่หัวพอต Vazer One ได้",
            "สองรุ่นนี้ยังมีกลิ่นชื่อเดียวกันด้วย เช่น Blueberry · Lemon Soda และ Lychee",
          ],
        },
      ],
    },
    en: {
      lede: "Vazer One pods come in flavours of several styles. Below, we sort them into groups to make choosing easier, and explain how they differ from the Vazer Reload 15K.",
      sections: [
        {
          heading: "Which Vazer One pod flavour should I start with?",
          paragraphs: [
            "Start with the kind you like. The groups are ours, from the words in each name.",
            "For mint, there's Mint.",
            "Fruit has twelve: Blueberry, Grape, Grapefruit, Lychee, Mango, Melon, Mix Berries, Peach, Pineapple, Raspberry, Strawberry and Watermelon.",
            "Drinks are Cola, Cola Lemon, Lemon Soda and Rootbeer.",
            "Sweets and desserts are Gummy Bear, Milk Honey, Strawberry Ice-Cream and Vanilla Custard.",
          ],
        },
        {
          heading: "How is the Vazer One different from the Vazer Reload 15K?",
          paragraphs: [
            "The Vazer One on this page is the pod only, with no device. The [Vazer Reload 15K](/products/vazer-reload-15k) comes as a device with a pod you can change.",
            "We can't confirm that a Vazer One pod fits the Vazer Reload device, so before you order, check that the device you use takes Vazer One pods.",
            "The two also share some flavour names, such as Blueberry, Lemon Soda and Lychee.",
          ],
        },
      ],
    },
    zh: {
      lede: "Vazer One 烟弹口味类型很多。下面由本店把口味分好组方便挑选，并说明它和 Vazer Reload 15K 有什么区别。",
      sections: [
        {
          heading: "Vazer One 烟弹哪个口味好？",
          paragraphs: [
            "可以先从喜欢的类型选起。分组由本店按口味名称里的词整理。",
            "薄荷类有 Mint。",
            "水果类有 12 款：Blueberry、Grape、Grapefruit、Lychee、Mango、Melon、Mix Berries、Peach、Pineapple、Raspberry、Strawberry 和 Watermelon。",
            "饮品类有 Cola、Cola Lemon、Lemon Soda 和 Rootbeer。",
            "糖果和甜点类有 Gummy Bear、Milk Honey、Strawberry Ice-Cream 和 Vanilla Custard。",
          ],
        },
        {
          heading: "Vazer One 和 Vazer Reload 15K 有什么区别？",
          paragraphs: [
            "本页的 Vazer One 只有烟弹，不含主机；[Vazer Reload 15K](/products/vazer-reload-15k) 则是主机加可更换的烟弹。",
            "本店还无法确认 Vazer One 烟弹能否装在 Vazer Reload 主机上，下单前请先确认您所用的主机能装 Vazer One 烟弹。",
            "两款也有一些同名口味，例如 Blueberry、Lemon Soda 和 Lychee。",
          ],
        },
      ],
    },
  },
};

/** The active locale's article for a product, falling back to English; undefined when the product has none. */
export function productArticle(slug: string, locale: Locale): ProductArticleCopy | undefined {
  const rec = PRODUCT_ARTICLES[slug];
  return rec?.[locale] ?? rec?.en;
}
