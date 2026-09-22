import type { ServiceCopy } from "./service-pages/shared";

/**
 * `/about` in the three site languages — round 6 "about3lang", batch B2 (owner instruction
 * 2026-09-23, item 1: the page gets en/zh so a foreign visitor stops reading a Thai page).
 *
 * Three conditions shape this file:
 *
 * 1. **The Thai is the master text and is moved here unchanged.** Every `th` value below is the
 *    literal that used to sit inside `src/app/about/page.tsx`, with JSX's line joining resolved by
 *    hand (a line break inside JSX text renders as one space, so the strings carry that space).
 *    The proof at the batch close is the page's rendered Thai TEXT, hashed before against after.
 *    The HTML hash is not the proof: the markup legitimately changes shape when literals become
 *    interpolations (the same move B5 made for the age dialog).
 *
 * 2. **The Thai must NOT go through `thaiTypographyDeep`.** `AboutContent` therefore reads
 *    `ABOUT[locale]` directly and does not call `useServiceCopy`. Only the Compliance paragraph is
 *    wrapped in `<ThaiText>` in the component, which is exactly the one paragraph that had the
 *    render-time typography before this batch. Adding it anywhere else changes bytes the owner
 *    has not approved for it (THAI_STYLE §5 group ก, and the typography mechanism's own rule).
 *
 * 3. **No word here is new.** The nav labels below are the values of `nav.about`, `nav.howToOrder`,
 *    `nav.shipping` and `nav.contact` in `src/i18n/dictionaries/*`; the verified/unverified pair is
 *    `verifiedSpecsTitle`'s word and `unverifiedBadge`; the nicotine and 21+ terms are the ones
 *    `footer.ageNotice` and `src/i18n/age-gate-copy.tsx` already use. They are repeated as literals
 *    rather than read from the dictionary on purpose: `LocaleProvider` runs the Thai dictionary
 *    through `thaiTypographyDeep`, so reading them from there would push condition 2's joiners into
 *    this page through the back door. If a label is ever changed in the dictionary it must be
 *    changed here too — the i18n contract test does not cover this file.
 *
 * en/zh were written by the `writer` agent from the Thai on 2026-09-23
 * (`_incoming/about3lang/brief-writer-b2.md`) and add no fact the Thai does not have.
 *
 * The brand ledes under the brand list are NOT here: they stay in `src/data/brands.ts` and follow
 * the rule the brand pages already use (`locale === "th" ? descriptionTh : description`) — owner
 * ruling at round open, 2026-09-23.
 */
export interface AboutCopy {
  eyebrow: string;
  title: string;
  lede: string;
  whoTitle: string;
  who: string;
  selectionTitle: string;
  /** Split around two things the component renders, not the copy: the live brand count, and the
   *  two coloured badge words. `between` carries its own spaces — zh sets no space around 或. */
  selection: {
    beforeCount: string;
    afterCount: string;
    verified: string;
    between: string;
    unverified: string;
    tail: string;
  };
  afterSaleTitle: string;
  afterSale: string;
  contactTitle: string;
  /** Split around the LINE OA link, whose text is `CONTACT.lineId` in every language. */
  contact: { beforeLine: string; afterLine: string };
  readMore: { label: string; howToOrder: string; shipping: string; contact: string };
  photosTitle: string;
  photos: string;
  complianceTitle: string;
  /** THAI_STYLE §5 group ก — the Thai is untouchable and is the one string that goes through
   *  `<ThaiText>`. en/zh start from the age dialog's wording and add the Thai's "where this trade
   *  is legal" clause, which the dialog does not carry. */
  compliance: string;
  brandsLabel: string;
}

export const ABOUT: ServiceCopy<AboutCopy> = {
  th: {
    eyebrow: "เกี่ยวกับเรา",
    title: "ของแท้ ราคาตรง บริการจริง",
    lede: "การบริการที่ดี คือสิ่งที่ OKami24 มีให้คุณ — ร้านพอตซิสเต็ม พอตใช้แล้วทิ้ง และน้ำยาของแท้ จากคนขายที่รู้จักสินค้าจริง",
    whoTitle: "OKami24 คือใคร",
    who: "OKami24 (ย่อว่า OKM) ขายพอตซิสเต็ม พอตใช้แล้วทิ้ง และน้ำยาของแท้จากแบรนด์ที่เรามั่นใจ ตั้งราคาตรง ๆ ไม่ปั่นราคา ทักมาแล้วแอดมินตอบเอง ไม่ใช่บอท",
    selectionTitle: "สินค้าที่เราคัดสรร",
    selection: {
      beforeCount: "เว็บนี้รวมพอตซิสเต็ม พอตคิท พอตใช้แล้วทิ้ง หัวพอต คอยล์ และ IQOS จาก ",
      afterCount:
        " แบรนด์ที่เราคัดมา เช่น UWELL VOOPOO SALTHUB มีหน้าเปรียบเทียบและตัวช่วยเลือกสินค้าไว้ช่วยหารุ่นที่เหมาะกับคุณ สเปกอ้างอิงจากเว็บทางการของแบรนด์เป็นหลัก รุ่นไหนเข้าหน้าทางการไม่ได้ ก็เช็คไขว้กับร้านค้าและรีวิวแทน ทุกค่าติดป้ายว่า ",
      verified: "ยืนยันแล้ว",
      between: " หรือ ",
      unverified: "ยังไม่ยืนยัน",
      tail: " กำกับไว้ ค่าที่ยืนยันไม่ได้เราบอกตรง ๆ ไม่เดา",
    },
    afterSaleTitle: "บริการหลังการขาย",
    afterSale:
      "ของมีปัญหาเคลมได้ภายใน 7 วันนับจากวันที่ได้รับของ ต้องมีคลิปตอนแกะกล่อง ไม่มีคลิป พิจารณาให้ไม่ได้ เงื่อนไขทั้งหมดอยู่ที่หน้านโยบายเคลม",
    contactTitle: "ติดต่อเรา",
    contact: {
      beforeLine:
        "ดูสินค้าและราคาได้ครบทั้งเว็บ ส่วนการสั่งซื้อ ตอนนี้สั่งทางไลน์ทางเดียว ทักมาบอกรุ่น สี หรือกลิ่นที่อยากได้ แอดมินสรุปยอดรวมค่าส่งและวิธีโอนให้ในแชท โอนแล้วแอดมินตรวจยอดก่อนจัดส่ง พร้อมเลขพัสดุให้ติดตาม ทักไลน์ OA ",
      afterLine: " ได้เลย แอดมินช่วยเช็คสต๊อกและแนะนำสินค้าที่เหมาะกับคุณ",
    },
    readMore: { label: "อ่านต่อ: ", howToOrder: "วิธีสั่งซื้อ", shipping: "การจัดส่ง", contact: "ติดต่อเรา" },
    photosTitle: "รูปสินค้า",
    photos: "รูปสินค้าในเว็บนี้เป็นรูปจริงของรุ่นนั้น รุ่นเรือธงบางรุ่นมีแกลเลอรีภาพจากแบรนด์เพิ่ม พร้อมระบุแหล่งที่มาไว้ใต้ภาพ",
    complianceTitle: "Compliance",
    compliance:
      "เว็บไซต์นี้จัดทำขึ้นสำหรับผู้มีอายุครบ 21 ปีบริบูรณ์ขึ้นไปในเขตพื้นที่ที่การซื้อขายถูกกฎหมาย ไม่มีการกล่าวอ้างด้านสุขภาพ ความปลอดภัย หรือการเลิกบุหรี่ใดๆ นิโคตินเป็นสารเสพติด",
    brandsLabel: "แบรนด์ที่เราจำหน่าย",
  },
  en: {
    eyebrow: "About",
    title: "Genuine products, honest prices, real service",
    lede: "Good service is what OKami24 gives you — genuine pod systems, disposables and e-liquid, from a seller who actually knows the products.",
    whoTitle: "Who is OKami24?",
    who: "OKami24 (OKM for short) sells genuine pod systems, disposables and e-liquid from brands we trust. The price you see is the price we charge — no games. Message us and the admin replies, not a bot.",
    selectionTitle: "The products we’ve selected",
    selection: {
      beforeCount: "This site brings together pod systems, pod kits, disposables, replacement pods, coils and IQOS from ",
      afterCount:
        " brands we’ve picked — UWELL, VOOPOO and SALTHUB among them. A compare page and the Finder help you land on the model that fits you. Specs come mainly from the brands’ own official sites; where a model has no official page, we cross-check retailers and reviews instead. Every value is tagged ",
      verified: "verified",
      between: " or ",
      unverified: "unverified",
      tail: ". Specs we can’t confirm, we tell you — no guessing.",
    },
    afterSaleTitle: "After-sales service",
    afterSale:
      "If there’s a problem with the product you can claim within 7 days of receiving it. An unboxing video is required — without it we can’t consider the claim. All the conditions are on the Warranty & claims page.",
    contactTitle: "Contact",
    contact: {
      beforeLine:
        "You can see every product and price across the site. Ordering, though, goes through LINE only right now. Message us the model, the colour or flavour you want, and the admin sends you the total including shipping, and how to transfer, in the chat. Once you’ve transferred, the admin checks the amount before shipping, with a tracking number you can follow. Message the LINE OA ",
      afterLine: " any time — the admin can check stock and suggest what fits you.",
    },
    readMore: { label: "Read next: ", howToOrder: "How to Order", shipping: "Shipping", contact: "Contact" },
    photosTitle: "Product photos",
    photos:
      "The product photos on this site are real photos of that model. Some flagship models also have a gallery of brand imagery, with the source credited under the photo.",
    complianceTitle: "Compliance",
    compliance:
      "This site is intended for people aged 21 and over, in areas where this trade is legal. It makes no health, safety or quit-smoking claims. Nicotine is addictive.",
    brandsLabel: "Brands we carry",
  },
  zh: {
    eyebrow: "关于我们",
    title: "正品，价格透明，服务实在",
    lede: "好的服务，就是 OKami24 给你的 —— 正品烟弹系统、一次性烟具与烟油，来自真正懂产品的卖家。",
    whoTitle: "OKami24 是谁",
    who: "OKami24（简称 OKM）销售正品烟弹系统、一次性烟具与烟油，品牌都是我们信得过的。页面标价就是售价，不炒价。你来消息，真人回复，不是机器人。",
    selectionTitle: "我们精选的产品",
    selection: {
      beforeCount: "本站汇集了来自我们精选的 ",
      afterCount:
        " 个品牌的烟弹系统、烟弹套装、一次性烟具、更换烟弹、芯和 IQOS，例如 UWELL、VOOPOO、SALTHUB。站内有对比页和选购助手，帮你找到适合自己的型号。参数主要以品牌官网为准；官网查不到的型号，就与零售商和评测交叉核对。每一项参数都标注了",
      verified: "已验证",
      between: "或",
      unverified: "未核实",
      tail: "。无法确认的参数，我们直说，不乱猜。",
    },
    afterSaleTitle: "售后服务",
    afterSale: "商品如有问题，可在收货后 7 天内申请售后。必须提供开箱视频，没有视频我们无法受理。全部条件见售后政策页面。",
    contactTitle: "联系我们",
    contact: {
      beforeLine:
        "全站的商品与价格都可以查看。下单目前只走 LINE。告诉我们想要的型号、颜色或口味，管理员会在聊天里发给你含运费的总金额和转账方式。转账后管理员先核对金额再发货，并附带可查询的快递单号。欢迎联系 LINE OA ",
      afterLine: "，管理员可以帮你查库存、推荐适合你的产品。",
    },
    readMore: { label: "继续阅读：", howToOrder: "购买流程", shipping: "配送说明", contact: "联系我们" },
    photosTitle: "商品图片",
    photos: "本站的商品图片都是该型号的真实照片。部分旗舰型号另有品牌图集，图片下方注明来源。",
    complianceTitle: "Compliance",
    compliance: "本网站面向买卖合法地区内年满21岁及以上人士。本网站不做出任何健康、安全或戒烟方面的声明。尼古丁为成瘾性物质。",
    brandsLabel: "我们销售的品牌",
  },
};
