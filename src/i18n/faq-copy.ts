/**
 * OKami24 — TH/ZH translations of the FAQ questions/answers (owner quality review, 2026-09-02).
 *
 * Root-cause fix for a real gap the earlier i18n pass missed: that pass localized page CHROME
 * (headers, eyebrows, category labels) but left the actual question/answer CONTENT in English —
 * exactly the "header goes Thai, the part you actually read stays English" complaint. Same
 * architecture pattern as `product-copy-th.ts` (a presentation-layer overlay keyed by id, English
 * in `src/data/faqs.ts` stays canonical/untouched) but REPLACES the English text when a
 * translation exists, rather than showing both — full-paragraph Q&A content is too heavy to
 * duplicate in two languages on screen at once; a short product tagline is not. See
 * FAQAccordion.tsx for the selection logic and its fallback-to-English behavior when a locale or
 * a specific id has no entry yet — never a blank or a fabricated placeholder translation.
 *
 * Translation notes: natural modern Thai/Chinese phrasing, not literal word-for-word conversion.
 * Brand/product/tool proper nouns (OKami24, Finder, Compare, Favorites, LINE, mAh, MTL, DTL, RDL)
 * are kept as-is, matching how the rest of the site treats this vocabulary.
 */

export interface FAQCopy {
  question: string;
  answer: string;
}

export const FAQ_COPY_TH: Record<string, FAQCopy> = {
  "what-is-this-site": {
    question: "จะสั่งซื้อสินค้าจาก OKami24 ได้อย่างไร",
    answer:
      "กดเพิ่มสินค้าลงตะกร้า ยืนยันเบอร์โทรด้วยรหัส OTP กรอกที่อยู่จัดส่ง แล้วยืนยันคำสั่งซื้อ จากนั้นโอนเงินหรือสแกน QR ตามยอดที่แจ้ง แอดมินตรวจยอดโอนก่อน แล้วจึงอนุมัติและจัดส่ง พร้อมเลขพัสดุให้ติดตาม ค่าส่ง 60 บาท ยอด 500 บาทขึ้นไปส่งฟรี ถ้าสินค้าตัวไหนยังไม่เปิดให้กดซื้อ หรืออยากให้ช่วยเลือกรุ่น ทักไลน์ @okm24 ได้เลย",
  },
  "where-specs-come-from": {
    question: "ข้อมูลสเปกสินค้ามาจากไหน",
    answer:
      "สเปกอ้างอิงจากเว็บทางการของแบรนด์เป็นหลัก รุ่นไหนเข้าหน้าทางการไม่ได้ ก็เช็คไขว้กับร้านค้าและรีวิวแทน ทุกค่าติดป้ายว่ายืนยันแล้วหรือยังไม่ยืนยัน ค่าที่ยังยืนยันไม่ได้เราโชว์ไว้พร้อมป้าย ไม่เดาตัวเลขให้",
  },
  "unverified-meaning": {
    question: "ป้าย “ยังไม่ยืนยัน” บนสเปกหมายความว่าอะไร",
    answer:
      "แปลว่าตัวเลขนั้นเรายังเช็คกับเว็บทางการหรือแหล่งที่เชื่อถือได้ไม่ได้ เราใส่ไว้ให้ข้อมูลครบ ไม่ได้ตัดทิ้ง แต่อย่าเพิ่งถือว่าเป็นค่าที่ยืนยันแล้ว",
  },
  "open-vs-disposable-faq": {
    question: "พอตซิสเต็มกับพอตใช้แล้วทิ้ง ต่างกันตรงไหน",
    answer:
      "พอตซิสเต็มคือพอตที่เติมน้ำยาเองและเปลี่ยนหัวคอยล์ได้ ส่วนพอตใช้แล้วทิ้งคือเครื่องที่มาพร้อมน้ำยาในตัว ใช้จนหมดจำนวนพัฟหรือน้ำยาหมดแล้วทิ้ง ดูรายละเอียดเพิ่มเติมได้ในคู่มือ “พอตซิสเต็มกับพอตใช้แล้วทิ้ง”",
  },
  "nicotine-strength-meaning": {
    question: "นิโคติน “30mg” หมายถึงอะไร",
    answer:
      "คือความเข้มข้นของนิโคตินในน้ำยา มักบอกเป็นมิลลิกรัมต่อมิลลิลิตร ตัวเลขยิ่งสูง นิโคตินต่อพัฟยิ่งแรง แต่ละสินค้าความเข้มข้นไม่เท่ากัน เราใส่ตัวเลขไว้เฉพาะที่ยืนยันได้ ดูที่หน้าสินค้าหรือทักไลน์ถามได้",
  },
  "flavor-family-meaning": {
    question: "กลุ่มรสชาติในหน้า E-Liquid คืออะไร",
    answer:
      "เป็นกลุ่มที่เราแบ่งเองเพื่อบอกว่าน้ำยาแต่ละแนวให้รสแบบไหน มี 5 กลุ่ม ผลไม้ เมนทอลและความเย็น ของหวาน เครื่องดื่ม และสไตล์ยาสูบ ไม่ใช่รายการน้ำยาแบบขวดของแบรนด์ไหน",
  },
  "age-gate-why": {
    question: "ทำไมเว็บนี้ถึงมีการยืนยันอายุก่อนเข้าชม",
    answer:
      "ผลิตภัณฑ์นิโคตินและบุหรี่ไฟฟ้าจำกัดอายุผู้ใช้งาน การยืนยันว่าคุณอายุ 21 ปีขึ้นไปก่อนเข้าชมเนื้อหาเป็นแนวปฏิบัติมาตรฐานที่รับผิดชอบสำหรับสินค้าประเภทนี้",
  },
  "health-claims": {
    question: "เว็บไซต์นี้กล่าวอ้างเรื่องความปลอดภัยหรือสุขภาพเกี่ยวกับการสูบไอหรือไม่",
    answer:
      "ไม่ เว็บไซต์นี้ไม่กล่าวอ้างว่าการสูบไอปลอดภัย ไม่เป็นอันตราย หรือเป็นวิธีเลิกบุหรี่ และไม่เปรียบเทียบด้านสุขภาพกับการสูบบุหรี่ทั่วไป เนื้อหานำเสนอเฉพาะอุปกรณ์ สเปก และคำแนะนำในการเลือกซื้อเท่านั้น",
  },
  "compare-winner": {
    question: "หน้าเปรียบเทียบตัดสินไหมว่ารุ่นไหน “ดีที่สุด”",
    answer:
      "ไม่ตัดสิน หน้าเปรียบเทียบโชว์ว่ารุ่นที่คุณเลือกต่างกันตรงไหน และบอกว่าแต่ละรุ่นเหมาะกับคนแบบไหนมากกว่า ตั้งใจไม่ฟันธงว่ารุ่นไหนชนะ",
  },
  "favorites-account": {
    question: "ใช้รายการโปรดต้องสมัครสมาชิกไหม",
    answer:
      "ไม่ต้อง รายการโปรดเก็บไว้ในเบราว์เซอร์เครื่องที่กดเท่านั้น ไม่ส่งขึ้นเซิร์ฟเวอร์ ไม่ต้องสมัครสมาชิก",
  },
};

export const FAQ_COPY_ZH: Record<string, FAQCopy> = {
  "what-is-this-site": {
    question: "如何在 OKami24 下单购买？",
    answer:
      "把想要的商品加入购物车，用 OTP 验证码验证手机号码，填写收货地址后确认订单。付款方式为银行转账或扫描 QR 码，客服核对到账后才会安排出货，并提供物流单号查询。运费 60 泰铢，满 500 泰铢免运费。若某件商品暂时无法在网站上直接下单，或想让客服帮忙挑选型号，欢迎联系 LINE @okm24。",
  },
  "where-specs-come-from": {
    question: "产品规格数据来自哪里？",
    answer:
      "所有规格均来自品牌官方页面，并与其他零售商/评测来源交叉核对；若无法直接取得官方页面，会以此作为补充依据。每一项规格都会标注「已验证」或「未验证」——未验证的数值仍会显示以求信息完整，而非凭空猜测，但不应视为已确认的数据。",
  },
  "unverified-meaning": {
    question: "「未验证」标签是什么意思？",
    answer:
      "表示该数值在调查过程中无法从官方或可靠来源独立确认。显示出来是为了信息完整性，而不是省略不提，但不应被当作已确认的数据。",
  },
  "open-vs-disposable-faq": {
    question: "开放式换弹烟弹和一次性电子烟到底有什么区别？",
    answer:
      "开放式换弹烟弹需要自行购买烟油填充，并更换烟弹芯；一次性电子烟则出厂已预填烟油，用到抽吸次数用尽或烟油耗尽即丢弃。完整对比请参见《开放式 vs. 一次性：如何选择》指南。",
  },
  "nicotine-strength-meaning": {
    question: "「30mg」这样的尼古丁浓度代表什么？",
    answer:
      "指烟油中尼古丁的浓度，通常以毫克/毫升表示。数值越高，每口吸入的尼古丁感越强。本站不销售含/不含尼古丁的产品，仅在能够确认的范围内提供标示信息。",
  },
  "flavor-family-meaning": {
    question: "E-Liquid 页面中的「风味家族」是什么？",
    answer:
      "这是编辑团队为了整理风味特征而做的分类（水果、薄荷与清凉、甜品、饮品、烟草风格），并非某个品牌的具体烟油产品目录。",
  },
  "age-gate-why": {
    question: "为什么本网站设有年龄验证？",
    answer:
      "尼古丁与电子烟产品有年龄限制。在浏览内容前确认您已年满 21 岁，是这类产品负责任呈现的标准做法。",
  },
  "health-claims": {
    question: "本网站是否对电子烟的健康或安全性做出任何声明？",
    answer:
      "没有。本网站不声称电子烟安全、无害，或可作为戒烟方法，也不会与吸烟做健康层面的比较。网站内容仅提供设备信息、规格与选购建议。",
  },
  "compare-winner": {
    question: "Compare 比较工具会判定哪款产品「最好」吗？",
    answer:
      "不会。Compare 只呈现您所选商品之间的差异，并说明每款产品更适合哪一类用户，刻意不做出统一的「最佳」结论。",
  },
  "favorites-account": {
    question: "使用 Favorites 收藏功能需要注册账号吗？",
    answer:
      "不需要。Favorites 仅保存在您当前使用的浏览器中，只存在于该设备上，目前尚未与任何账号或服务器端资料绑定。",
  },
};
