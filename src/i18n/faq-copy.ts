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
      "กดเพิ่มสินค้าลงตะกร้า กรอกเบอร์มือถือ กรอกที่อยู่จัดส่ง แล้วยืนยันคำสั่งซื้อ จากนั้นโอนเงินหรือสแกน QR ตามยอดที่แจ้ง แล้วแนบสลิปในหน้าคำสั่งซื้อ แอดมินตรวจยอดโอนก่อน แล้วจึงอนุมัติและจัดส่ง พร้อมเลขพัสดุให้ติดตาม ค่าส่งปกติ 50 บาท และสมาชิกที่เข้าสู่ระบบด้วย LINE หรือ Google ยอดครบ 300 บาท ค่าส่ง 0 บาทเดือนละครั้งค่ะ ถ้าสินค้าตัวไหนยังไม่เปิดให้กดซื้อ หรืออยากให้ช่วยเลือกรุ่น ติดต่อสอบถามเพิ่มเติมได้ที่ @okm24 ค่ะ",
  },
  // Round 8 B2 — wholesale (owner's own phrase "ติดต่อหลังไมค์ทางไลน์"; the rest is the round-7 draft the owner approved).
  "wholesale-orders": {
    question: "ซื้อยกลังหรือซื้อจำนวนมาก ทำยังไง",
    answer:
      "ติดต่อหลังไมค์ทางไลน์ @okm24 บอกรุ่นกับจำนวนที่ต้องการ แอดมินเช็คของให้แล้วตอบกลับในแชท ทักได้ทุกวัน ตลอด 24 ชั่วโมงค่ะ",
  },
  "where-to-buy": {
    question: "ซื้อพอตที่ไหน สั่งออนไลน์ให้ส่งถึงบ้านได้ไหม",
    answer:
      "สั่งออนไลน์กับ OKami24 ได้เลยค่ะ เลือกรุ่น สี หรือกลิ่นบนเว็บนี้ แล้วกดเพิ่มลงตะกร้าและสั่งซื้อบนเว็บได้ทันที ไม่ต้องทักแชทก่อน เราจัดส่งถึงบ้านทั่วประเทศไทย และทุกคำสั่งซื้อมีเลขพัสดุให้ติดตามค่ะ ถ้าอยากให้ช่วยเลือกรุ่น ติดต่อสอบถามเพิ่มเติมได้ที่ @okm24 ทักมาได้ทุกวัน ตลอด 24 ชั่วโมงค่ะ",
  },
  "shipping-time": {
    question: "ส่งกี่วันถึง",
    answer:
      "โอนและส่งสลิปก่อน 12:30 เราจัดส่งให้วันเดียวกัน ถ้าหลัง 12:30 จะส่งในวันทำการถัดไปค่ะ เราส่งวันจันทร์ถึงเสาร์ หยุดวันอาทิตย์และวันหยุดนักขัตฤกษ์ ของออกจากร้านแล้วถึงมือภายใน 1–3 วัน พร้อมเลขพัสดุให้ติดตามค่ะ",
  },
  "problem-on-arrival": {
    question: "ได้ของแล้วมีปัญหา ร้านรับผิดชอบไหม",
    answer:
      "เคลมกับร้านได้ภายใน 7 วันนับจากวันที่ได้รับของ และต้องมีคลิปตอนแกะกล่องเป็นหลักฐานนะคะ เคลมผ่านแล้วเราส่งของใหม่ตัวเดิมให้ ถ้าตัวนั้นหมดพอดีก็เลือกตัวอื่นราคาเท่ากันได้ ร้านไม่คืนเป็นเงินสด ยกเว้นกรณีเดียว คือเช็คของแท้ที่เว็บทางการของแบรนด์แล้วไม่ผ่าน กรณีนี้ส่งผลเช็คพร้อมคลิปตอนแกะกล่องมาทางไลน์ได้เลย เราจะตรวจสอบให้ แล้วแจ้งว่าจะเปลี่ยนของใหม่หรือคืนเงินให้ อาการไหนเคลมได้หรือไม่ได้ อ่านเงื่อนไขทั้งหมดได้ที่หน้านโยบายเคลมค่ะ",
  },
  "where-specs-come-from": {
    question: "ข้อมูลสเปกสินค้ามาจากไหน",
    answer:
      "สเปกบนหน้าสินค้ามาจากข้อมูลของผู้ผลิตเป็นหลัก ทั้งเว็บทางการ โปสเตอร์ และคู่มือ ทุกแถวเช็คที่มาก่อนขึ้นหน้าเว็บค่ะ",
  },
  "open-vs-disposable-faq": {
    question: "พอตซิสเต็มกับพอตใช้แล้วทิ้ง ต่างกันตรงไหน",
    answer:
      "พอตซิสเต็มคือพอตที่เติมน้ำยาเองและเปลี่ยนหัวคอยล์ได้ ขณะที่พอตใช้แล้วทิ้งคือเครื่องที่มาพร้อมน้ำยาในตัว ใช้จนหมดจำนวนพัฟหรือน้ำยาหมดแล้วทิ้ง ดูรายละเอียดเพิ่มเติมได้ในคู่มือ “พอตซิสเต็มกับพอตใช้แล้วทิ้ง”",
  },
  // Round 8 B2 — Marbo / M Bar: two traceable facts only (researcher-1 rows 1, 2, 3a); no maker claim.
  "marbo-vs-m-bar": {
    question: "Marbo กับ M Bar ต่างกันไหม",
    answer:
      "เป็นของตระกูลเดียวกัน หลายร้านในไทยเรียก M Bar · M Switch และ Zero ว่า Marbo เว็บทางการ salthub.com เองก็มีโลโก้ Marbo อยู่ที่ท้ายเว็บ",
  },
  "nicotine-strength-meaning": {
    question: "นิโคติน “30mg” หมายถึงอะไร",
    answer:
      "คือความเข้มข้นของนิโคตินในน้ำยา มักบอกเป็นมิลลิกรัมต่อมิลลิลิตร ตัวเลขยิ่งสูง นิโคตินต่อพัฟยิ่งแรง แต่ละสินค้าใช้ระดับนิโคตินไม่เท่ากัน เราใส่ตัวเลขไว้เฉพาะที่ยืนยันได้ ดูได้ที่หน้าสินค้า หรือติดต่อสอบถามเพิ่มเติมได้ที่ @okm24 ค่ะ",
  },
  "flavor-family-meaning": {
    question: "กลุ่มรสชาติในหน้า E-Liquid คืออะไร",
    answer:
      "เป็นกลุ่มที่เราแบ่งเองเพื่อบอกว่าน้ำยาแต่ละแนวให้รสแบบไหน มี 5 กลุ่ม ผลไม้ เมนทอลและความเย็น ของหวาน เครื่องดื่ม และสไตล์ยาสูบ ไม่ใช่รายการน้ำยาแบบขวดของแบรนด์ไหนค่ะ",
  },
  "age-gate-why": {
    question: "ทำไมต้องยืนยันอายุก่อนเข้าเว็บ",
    answer:
      "ผลิตภัณฑ์นิโคตินและบุหรี่ไฟฟ้าจำกัดอายุผู้ใช้งาน การยืนยันว่าคุณอายุ 21 ปีขึ้นไปก่อนเข้าชมเนื้อหาเป็นแนวปฏิบัติมาตรฐานที่รับผิดชอบสำหรับสินค้าประเภทนี้",
  },
  "health-claims": {
    question: "เว็บไซต์นี้กล่าวอ้างเรื่องความปลอดภัยหรือสุขภาพเกี่ยวกับการสูบไอหรือไม่",
    answer:
      "ไม่ เว็บไซต์นี้ไม่กล่าวอ้างว่าการสูบไอปลอดภัย ไม่เป็นอันตราย หรือเป็นวิธีเลิกบุหรี่ และไม่เปรียบเทียบด้านสุขภาพกับการสูบบุหรี่ทั่วไป เนื้อหานำเสนอเฉพาะอุปกรณ์ สเปก และคำแนะนำในการเลือกซื้อเท่านั้น",
  },
  "compare-winner": {
    question: "หน้าเปรียบเทียบบอกไหมว่ารุ่นไหนชนะ",
    answer:
      "ไม่ตัดสิน หน้าเปรียบเทียบโชว์ว่ารุ่นที่คุณเลือกต่างกันตรงไหน และบอกว่าแต่ละรุ่นเหมาะกับคนแบบไหนมากกว่า ส่วนรุ่นไหนดีกว่า ให้คุณเลือกเองตามการใช้งานค่ะ",
  },
  "favorites-account": {
    question: "ใช้รายการโปรดต้องสมัครสมาชิกไหม",
    answer:
      "ไม่ต้อง รายการโปรดเก็บไว้ในเบราว์เซอร์เครื่องที่กดเท่านั้น ข้อมูลอยู่ในเครื่องของคุณเอง ไม่ได้ส่งขึ้นเซิร์ฟเวอร์ของร้าน และไม่ต้องสมัครสมาชิกค่ะ",
  },
};

export const FAQ_COPY_ZH: Record<string, FAQCopy> = {
  "what-is-this-site": {
    question: "如何在 OKami24 下单购买？",
    answer:
      "把想要的商品加入购物车，填写手机号码和收货地址后确认订单。付款方式为银行转账或扫描 QR 码，付款后在订单页上传转账凭证，客服核对到账后才会安排出货，并提供物流单号查询。运费 50 泰铢；用 LINE 或 Google 登录的会员，每月一单满 300 泰铢运费 0 泰铢。若某件商品暂时无法在网站上直接下单，或想让客服帮忙挑选型号，欢迎联系 LINE @okm24。",
  },
  "wholesale-orders": {
    question: "想整箱或大量订购，要怎么做？",
    answer: "请直接用 LINE @okm24 私讯，告诉店主想要的型号和数量，店主查好货后会在聊天里回复。每天 24 小时都可以私讯。",
  },
  "where-to-buy": {
    question: "在哪里网购？可以送货上门吗？",
    answer:
      "可以直接在 OKami24 网上购买。在本站选好型号、颜色或口味，加入购物车即可直接下单，不用先联系我们。我们配送泰国全境，每笔订单都附快递单号。想让我们帮忙挑选，欢迎通过 LINE @okm24 咨询，每天 24 小时都可以联系。",
  },
  "shipping-time": {
    question: "下单后几天能收到？",
    answer:
      "12:30 前转账并提交转账凭证，当天发货；12:30 之后则在下一个工作日发货。我们周一至周六发货，周日和法定节假日不发货。寄出后 1–3 天内送达，并附快递单号供查询。",
  },
  "problem-on-arrival": {
    question: "收到的商品有问题，店家负责吗？",
    answer:
      "收货后 7 天内可向我们申请售后，须提供开箱视频作为凭证。审核通过后，我们会寄出同款新品；如该款刚好缺货，可改选同价位的其他商品。我们不退现金，唯一的例外是商品在品牌官网验证正品未通过：这种情况请通过 LINE 发来验证结果和开箱视频，我们核实后会告知您换新还是退款。哪些问题可以受理、哪些不行，请看售后政策页面的完整说明。",
  },
  "where-specs-come-from": {
    question: "产品规格数据来自哪里？",
    answer:
      "产品页上的参数主要来自厂商自己的资料，包括官网、海报和说明书；每一行上架前都核对过来源。",
  },
  "open-vs-disposable-faq": {
    question: "开放式换弹烟弹和一次性电子烟到底有什么区别？",
    answer:
      "开放式换弹烟弹需要自行购买烟油填充，并更换烟弹芯；一次性电子烟则出厂已预填烟油，用到抽吸次数用尽或烟油耗尽即丢弃。完整对比请参见《开放式 vs. 一次性：如何选择》指南。",
  },
  "marbo-vs-m-bar": {
    question: "Marbo 和 M Bar 是同一个东西吗？",
    answer: "是同一个产品线的两种叫法：泰国不少店家把 M Bar、M Switch 和 Zero 直接标成 Marbo。Salthub 官网 salthub.com 页脚也放着 Marbo 的标志。",
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
  // Round SEO full 07/11: product FAQ, Thai in product-copy-th.ts, English in the product data.
  "m-switch-pod-name": {
    question: "Marbo 15K 烟弹和 M Switch 15K 烟弹是同一款吗？",
    answer: "在本店是同一款，都是 M Switch Pod，SALTHUB 的黑色烟弹，搭配 M Switch Kit 主机使用。这款主机本店也称作 M Bar 15K。",
  },
  "m-switch-pod-device": {
    question: "还没有主机，可以只买烟弹吗？",
    answer: "烟弹要装在 M Switch Kit 主机上才能用。刚开始的话，买套装更方便，M Switch Kit 含主机和一颗烟弹。",
  },
  "m-switch-pod-days": {
    question: "一颗 M Switch Pod 能用几天？",
    answer: "没有固定的天数，因人而异，抽得多自然用得快。SALTHUB 标注的是每颗最多 15,000 口，能用几天要看抽吸的频率和每口的长短。",
  },
  "m-switch-pod-flavours": {
    question: "Marbo 15K 烟弹有哪些口味？",
    answer: "SALTHUB 网页列出 17 种口味，有 Blue Ice 这样的清凉系、Kyoho Grape 这样的葡萄系、Mango Passion 这样的其他水果，以及 Cola 等其他口味。口味名称可以看本页的列表。",
  },
  "m-switch-pod-strength": {
    question: "M Switch Pod 的尼古丁浓度是多少？",
    answer: "SALTHUB 标注为 30mg，烟弹里的烟油是盐尼古丁。",
  },
  "joiway-f4-double-flavor": {
    question: "JOIWAY F4 是双口味款吗？",
    answer: "是的。F4 是一机双味的一次性电子烟，两种口味已经配好，挑喜欢的组合就行。JOIWAY 给这款起的名字是 F4 TWINS。",
  },
  "joiway-f4-switch": {
    question: "JOIWAY F4 怎么切换口味？",
    answer: "把吸嘴转到另一边就行。两种口味分装在两个烟油仓里，吸嘴转到哪个烟油仓上方，下一口就是哪种口味。JOIWAY 表示随时都能切换。",
  },
  "joiway-f4-capacity": {
    question: "JOIWAY F4 每种口味有多少烟油？",
    answer: "每个烟油仓预装 10mL，整机共 20mL。",
  },
  "joiway-f4-charge": {
    question: "JOIWAY F4 可以充电吗？",
    answer: "可以。650mAh 电池通过 USB-C 充电，电量低了插上线就能继续用。机身的 LED 屏幕以百分比显示数字。",
  },
  "tfit-m-power-20k-review": {
    question: "M Power 20K 有评测吗？",
    answer: "有。OKami24 在 YouTube 上发布了实际使用的评测，视频就在本页。",
  },
  "tfit-m-power-20k-charge": {
    question: "TFIT 20K 可以充电吗？",
    answer: "可以。600mAh 电池通过 USB-C 充电，充电口在机身底部。电池比烟油先用完时，充上电就能继续抽。",
  },
  "tfit-m-power-20k-airflow": {
    question: "TFIT M Power 可以调气流吗？",
    answer: "可以。TFIT 表示气流可以从紧调到松，按自己的抽法来设定就好。",
  },
  "tfit-m-power-20k-days": {
    question: "M Power 20K 能用几天？",
    answer: "没有固定的天数，因人而异，抽得多自然用得快。TFIT 标注的是最多 20,000 口。烟油仓是透明的，还剩多少从外面就能看到。",
  },
  "caliburn-g4-pro-pods": {
    question: "Caliburn G4 Pro 能用哪些烟弹？",
    answer: "可以用 UWELL GPP 烟弹，旧款和升级款都行，G3 烟弹也能用。阻值范围 0.4Ω 至 1.2Ω，顶部注油和侧边注油都支持。",
  },
  "caliburn-g4-pro-included-pods": {
    question: "Caliburn G4 Pro 附带哪些烟弹？",
    answer: "附带 0.4Ω 和 0.6Ω 的 FeCrAl 网状线圈烟弹，都是侧边注油，烟弹容量 3mL。",
  },
  "caliburn-g4-pro-thai-menu": {
    question: "Caliburn G4 Pro 的菜单有泰语吗？",
    answer: "没有。设置菜单提供 8 种语言，不含泰语。下滑屏幕即可打开菜单。",
  },
  "caliburn-g4-pro-battery": {
    question: "Caliburn G4 Pro 电池能用几天？",
    answer: "UWELL 标注 1800mAh 电池最长可用 7 天，实际能用几天取决于抽吸频率和设定的功率。",
  },
  "caliburn-g4-pro-themes": {
    question: "Caliburn G4 Pro 的屏幕主题怎么解锁？",
    answer: "靠抽吸口数解锁。主题共 6 款，3 款开箱即用，另外 3 款在 5,000、10,000、20,000 口时解锁。",
  },
  "caliburn-g4-mini-pods": {
    question: "Caliburn G4 mini 用哪款烟弹？",
    answer: "可以用 UWELL GPP 烟弹，旧款和升级款都行。盒内附带的是 0.6Ω FeCrAl 网状线圈烟弹。",
  },
  "caliburn-g4-mini-refill": {
    question: "Caliburn G4 mini 注油要取下烟弹吗？",
    answer: "升级款 GPP 烟弹无需取下即可注油，烟弹容量 3mL。",
  },
  "caliburn-g4-mini-airflow": {
    question: "Caliburn G4 mini 可以调气流吗？",
    answer: "可以。可以用气流滑块，也可以把烟弹反向安装，两者也能一起用。",
  },
  "caliburn-g4-mini-upgraded-pods": {
    question: "Caliburn G4 mini 用升级款 GPP 烟弹有什么不同？",
    answer: "根据 UWELL 实验室数据，升级款烟弹搭配 Pro-FOCS 4.0，口感满意度最高提升 35%，烟弹寿命最高提升 35%。",
  },
  "argus-g4-mini-resistance": {
    question: "ARGUS G4 mini 怎么在 0.7Ω 和 1.0Ω 之间切换？",
    answer: "把 Multi-Ohm 烟弹转 180° 再插回去。按原样插入是 0.7Ω，转过来就是 1.0Ω，机身会自动识别烟弹的方向。",
  },
  "argus-g4-mini-lights": {
    question: "ARGUS G4 mini 的指示灯代表什么？",
    answer: "白灯是 0.7Ω，绿灯是 1.0Ω。四格灯显示电量，每格 25%。",
  },
  "argus-g4-mini-refill": {
    question: "ARGUS G4 mini 怎么注油？",
    answer: "烟弹留在机身上，从顶部注油就行。Multi-Ohm 烟弹容量 3.5mL。",
  },
  "argus-g4-mini-draw": {
    question: "ARGUS G4 mini 需要按键吗？",
    answer: "不需要，吸气即启动。进气用无级滑块调节，从 MTL 到 RDL。",
  },
  "vmate-i3-cartridge-choice": {
    question: "VMATE i3 选哪种阻值的烟弹？",
    answer: "按自己的抽吸方式来选。喜欢偏紧的 MTL，可选 Top Fill 1.0Ω（12–18W）或 Cartridge V2 1.2Ω（8–15W）；喜欢通畅的 RDL，可选 Top Fill 0.4Ω，VOOPOO 注明需 30W 以上。VOOPOO 建议使用前先核对阻值和功率。",
  },
  "vmate-i3-light": {
    question: "VMATE i3 的灯带颜色代表什么？",
    answer: "灯带显示剩余电量：70% 及以上为绿色，30–70% 为蓝色，30% 以下为红色。",
  },
  "vmate-i3-coil-life": {
    question: "VMATE i3 的烟弹能用多久？",
    answer: "根据 VOOPOO 自己的实验室测试，iCOSM CODE 线圈寿命为 90mL 烟油。能用多少天因人而异，抽得多自然用得快。",
  },
  "vmate-i3-charge": {
    question: "VMATE i3 支持快充吗？",
    answer: "支持，通过 USB-C 以 5V/2A 快充，内置 1500mAh 电池。",
  },
  "caliburn-g3-pro-koko-pods": {
    question: "Caliburn G3 Pro KOKO 能用哪些烟弹？",
    answer: "所有 Caliburn G3（GPP）烟弹都能用，阻值 0.4Ω 至 1.2Ω，顶部注油和侧边注油都行。附带的烟弹是 0.4Ω（3mL）和 0.9Ω（2.5mL），都是侧边注油。",
  },
  "caliburn-g3-pro-koko-button": {
    question: "Caliburn G3 Pro KOKO 的按键怎么用？",
    answer: "连按两下锁定按键，连按 3 下设定功率，连按 4 下打开亮度与主题菜单，连按 5 下开关机。",
  },
  "caliburn-g3-pro-koko-charging": {
    question: "Caliburn G3 Pro KOKO 充电要多久？",
    answer: "UWELL 标注通过 USB-C 以 5V/2A 充电，20 分钟可充到 80%，一次充电最多用 4 天。实际续航取决于抽吸频率和设定的功率。",
  },
  "caliburn-g3-pro-koko-themes": {
    question: "Caliburn G3 Pro KOKO 怎么换屏幕主题？",
    answer: "连按 4 下按键打开菜单，在里面选择主题，例如 Planet、Twilight、KOKO。DAY 和 NIGHT 亮度模式也在同一个菜单里。",
  },
  "wotofo-nexbar-18k-screen": {
    question: "nexBAR 18K 的屏幕显示什么？",
    answer: "LED 屏幕显示电量百分比、剩余烟油和当前模式。",
  },
  "wotofo-nexbar-18k-airflow": {
    question: "nexBAR 18K 怎么调进气？",
    answer: "用底部的进气滑块，有 2 档可调，选自己抽着舒服的那一档就好。",
  },
  "wotofo-nexbar-18k-charge": {
    question: "nexBAR 18K 可以充电吗？",
    answer: "可以。750mAh 电池通过 USB-C 充电，电量低了插上线就能继续用。",
  },
  "wotofo-nexbar-18k-days": {
    question: "nexBAR 18K 能用几天？",
    answer: "没有固定的天数，因人而异，抽得多自然用得快。WOTOFO 标注的是最多 18,000 口，烟油 21mL。",
  },
  "relx-smash-go-12k-what": {
    question: "RELX Smash Go 12K 是什么类型的产品？",
    answer: "这是 RELX 的可充电一次性电子烟，最多 12,000 口，采用 MEGA MESH 线圈，机身只有口袋大小。",
  },
  "relx-smash-go-12k-charge": {
    question: "RELX 12K 可以充电吗？",
    answer: "可以。400mAh 电池通过 USB-C 充电，电量用完后充上电就能继续用。",
  },
  "relx-smash-go-12k-days": {
    question: "RELX Smash Go 12,000 口能用几天？",
    answer: "没有固定的天数，因人而异，抽得多自然用得快。12,000 口是 RELX 标注的最高口数，能用几天要看抽吸的频率和每口的长短。",
  },
  "relx-smash-go-12k-strength": {
    question: "RELX Smash Go 12K 的尼古丁浓度是多少？",
    answer: "有 3% 和 5% 两种盐尼古丁。5% 的口味名称以 5% 结尾，选择前请再核对一次名称。",
  },
  "relx-smash-go-12k-review": {
    question: "RELX Smash Go 12K 有评测吗？",
    answer: "有。OKami24 在 YouTube 上发布了这款的评测视频，在本页就能观看。",
  },
  "caliburn-g4-pods": {
    question: "Caliburn G4 用哪款烟弹？",
    answer: "可以用 UWELL GPP 烟弹，旧款和升级款都行。附带的是 0.4Ω 和 0.9Ω 的 FeCrAl 网状线圈烟弹，都是侧边注油。",
  },
  "caliburn-g4-firing": {
    question: "Caliburn G4 抽的时候要按键吗？",
    answer: "都可以，直接吸或按键点火都行，看个人习惯。",
  },
  "caliburn-g4-button": {
    question: "Caliburn G4 的按键怎么用？",
    answer: "按 1 下亮屏，按 2 下锁定或解锁按键点火，按 3 下调节功率，按 4 下进入菜单，按 5 下开关机。",
  },
  "caliburn-g4-modes": {
    question: "Caliburn G4 的 Storm 和 Waves 有什么不同？",
    answer: "按 UWELL 的说法，Storm 来得快，Waves 平稳顺滑，按自己的需要选择就好。",
  },
  "caliburn-g4-charge": {
    question: "Caliburn G4 支持快充吗？",
    answer: "支持，通过 USB-C 以 5V/2A 快充，内置 1300mAh 电池。",
  },
};
