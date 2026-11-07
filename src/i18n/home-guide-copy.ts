/**
 * Round SEO full batch 2 (07/11): the closing note at the foot of the home page, in the shape and through the component of the
 * category pages (CategoryGuide). The home page owns พอต and ร้านพอต (SEO_LANDSCAPE section 0) and carried no answer text and no
 * FAQ. It talks about ordering on the site, so the page shows it only while the cart is on. Delivery line = the pod-systems FAQ
 * line, word for word. "เมื่อดูด" stays that way: "พอดูด" holds the banned string. Wording: thai-copy 07/11.
 */
import type { CategoryGuideCopy } from "@/i18n/category-guide-copy";

export const HOME_GUIDE_COPY: Partial<Record<"th" | "en" | "zh", CategoryGuideCopy>> = {
  th: {
    heading: "OKami24 ร้านพอตออนไลน์ สั่งบนเว็บได้เลย และเราส่งให้ไว",
    intro:
      "OKami24 เป็นร้านขายพอตออนไลน์ เลือกรุ่นที่ต้องการแล้วสั่งซื้อบนเว็บนี้ได้เลย และเราจัดส่งถึงบ้านทั่วประเทศไทยค่ะ\n\nพอตคือบุหรี่ไฟฟ้าแบบหนึ่ง เมื่อดูด คอยล์ในเครื่องจะร้อนขึ้นและเปลี่ยนน้ำยาให้กลายเป็นไอ ร้านเรามีพอตสามแบบ ต่างกันที่วิธีใส่น้ำยาและสิ่งที่ต้องดูแล อ่านละเอียดได้ที่ [พอตมีกี่แบบ](/guides/types-of-pods)",
    families: [
      {
        heading: "พอตซิสเต็ม",
        body:
          "เก็บตัวเครื่องไว้ใช้ต่อ แล้วเติมน้ำยาที่ชอบได้เอง พอคอยล์เสื่อมก็เปลี่ยนแค่หัวพอตหรือคอยล์ ดูรุ่นได้ในหมวด[พอตซิสเต็ม](/products/pod-systems)",
      },
      {
        heading: "พอตเปลี่ยนหัว",
        body:
          "เก็บตัวเครื่องไว้ชาร์จใช้ต่อ ส่วนหัวพอตบรรจุสำเร็จมีน้ำยามาให้แล้ว ใช้จนหมดก็เปลี่ยนหัวใหม่ อยากเปลี่ยนกลิ่นก็เปลี่ยนแค่หัว ดูรุ่นได้ในหมวด[พอตเปลี่ยนหัว](/products/switch-pods)",
      },
      {
        heading: "พอตใช้แล้วทิ้ง",
        body:
          "มีน้ำยามาในเครื่องแล้ว แกะกล่องก็สูบได้เลย ใช้จนน้ำยาหมดแล้วก็เปลี่ยนเครื่องใหม่ ดูรุ่นได้ในหมวด[พอตใช้แล้วทิ้ง](/products/disposables)",
      },
    ],
    faqHeading: "คำถามที่พบบ่อย",
    faq: [
      {
        question: "OKami24 เป็นร้านพอตแบบไหน",
        answer:
          "OKami24 หรือที่เรียกสั้น ๆ ว่า OKM ขายออนไลน์มาก่อนจะมีเว็บขายพอตของตัวเองค่ะ เจ้าของร้านเป็นคนคัดสินค้าและตั้งราคาเอง บนเว็บมีพอตทั้งสามแบบ พร้อมหัวพอต คอยล์ น้ำยา และ IQOS อ่านต่อได้ที่ [เกี่ยวกับเรา](/about) ค่ะ",
      },
      {
        question: "สั่งพอตบนเว็บนี้ ทำยังไงบ้าง",
        answer:
          "เลือกรุ่น สี หรือกลิ่นที่ต้องการ กด “เพิ่มลงตะกร้า” แล้วกรอกเบอร์มือถือกับที่อยู่จัดส่ง และกด “ยืนยันคำสั่งซื้อ” ได้เลยค่ะ จากนั้นโอนธนาคารหรือสแกน QR ตามยอดในหน้าสถานะคำสั่งซื้อ แล้วแนบสลิปไว้ในหน้านั้น แอดมินจะตรวจยอดก่อนจัดส่งนะคะ ดูทีละขั้นได้ที่ [วิธีสั่งซื้อ](/how-to-order) ติดต่อสอบถามเพิ่มเติมได้ที่ @okm24 ค่ะ",
      },
      {
        question: "สั่งพอตออนไลน์กับร้าน ส่งไวแค่ไหน",
        answer:
          "โอนและส่งสลิปก่อน 12:30 เราจัดส่งให้วันเดียวกัน ถ้าหลัง 12:30 จะส่งในวันทำการถัดไปค่ะ เราส่งวันจันทร์ถึงเสาร์ หยุดวันอาทิตย์และวันหยุดนักขัตฤกษ์ ของออกจากร้านแล้วถึงมือภายใน 1–3 วัน พร้อมเลขพัสดุให้ติดตามค่ะ",
      },
      {
        question: "พอตราคาเท่าไหร่",
        answer:
          "ราคาต่างกันไปตามรุ่นค่ะ ดูได้ที่หน้าสินค้าของแต่ละรุ่น และทุกออเดอร์คิดตามราคาขายที่แสดงบนเว็บค่ะ",
      },
      {
        question: "พอตของแท้ เช็คได้ที่ไหน",
        answer:
          "เช็คได้ที่เว็บทางการของแบรนด์นั้นเองค่ะ หลายแบรนด์ใส่รหัสหรือ QR code มากับกล่องให้เช็คได้ บทความ [พอตของแท้ ดูยังไง](/guides/checking-a-genuine-pod) รวมหน้าเช็คของแบรนด์เหล่านี้ไว้ให้แล้วค่ะ",
      },
    ],
  },
  en: {
    heading: "OKami24, an online pod shop. Order on the site and we ship fast.",
    intro:
      "OKami24 is an online pod shop in Thailand. Choose the model you want, order right here on the site, and we deliver to your door anywhere in the country.\n\nA pod is a type of e-cigarette: when you draw, the coil inside heats up and turns e-liquid into vapor. We carry three kinds, and they differ in how the e-liquid goes in and what they need from you over time. [What a Pod System is](/guides/what-is-a-pod-system) covers the basics.",
    families: [
      {
        heading: "Pod Systems",
        body:
          "You keep the device and fill it yourself with the e-liquid you like. When the coil wears, you replace only the pod or coil. See the models under [Pod Systems](/products/pod-systems).",
      },
      {
        heading: "Switch pods",
        body:
          "You keep the device and recharge it. The pods come pre-filled, and when one runs out you fit a new one, so changing flavor just means changing pod. See the models under [Switch Pods](/products/switch-pods).",
      },
      {
        heading: "Disposables",
        body:
          "These come filled and ready, so you can start as soon as the box is open. When the e-liquid runs out, you replace the whole device. See the models under [Disposables](/products/disposables).",
      },
    ],
    faqHeading: "Common questions",
    faq: [
      {
        question: "What kind of pod shop is OKami24?",
        answer:
          "OKami24 (OKM for short) sold online before it had this site. The owner chooses the products and sets the prices. Alongside all three kinds of pod, you'll find replacement pods, coils, e-liquid and IQOS here. There's more on our [About](/about) page.",
      },
      {
        question: "How does ordering on the site work?",
        answer:
          "Pick the model, color or flavor you want and tap “Add to cart”. Enter your mobile number and shipping address, then tap “Place order”. After that, pay by bank transfer or QR for the amount on your order status page, and attach your slip there. An admin checks the payment before we ship. [How to order](/how-to-order) goes through it step by step. For anything else, message us on LINE @okm24.",
      },
      {
        question: "How quickly do you ship an online order?",
        answer:
          "Transfer and send your slip before 12:30 and we ship the same day; after 12:30 it goes out the next working day. We ship Monday to Saturday, not on Sundays or public holidays. Once it's out, it arrives within 1–3 days, with a tracking number you can follow.",
      },
      {
        question: "How much do pods cost?",
        answer:
          "Prices vary by model. You'll find the price on each product page, and every order is charged at the selling price shown on the site.",
      },
      {
        question: "How can I check that a pod is genuine?",
        answer:
          "Check on the brand's own website. Many brands put a code or QR code on the box for you to check there. The [UWELL](/brands/uwell), [RELX](/brands/relx), [VOOPOO](/brands/voopoo) and [SALTHUB](/brands/salthub) pages tell you how.",
      },
    ],
  },
  zh: {
    heading: "OKami24 线上电子烟店，网站直接下单，发货快",
    intro:
      "OKami24 是一家泰国的线上电子烟店。选好想要的型号，直接在网站下单，我们配送泰国全境，送货上门。\n\nPod 是电子烟的一种：吸的时候，设备里的雾化芯发热，把烟油变成雾气。本店的 Pod 分为三类，区别在于烟油的加注方式和日后需要打理的地方。想了解更多，可看 [什么是 Pod System](/guides/what-is-a-pod-system)。",
    families: [
      {
        heading: "烟弹系统",
        body:
          "主机留着继续用，喜欢的烟油自己加。雾化芯用旧了，只换烟弹或雾化芯。型号见 [烟弹系统](/products/pod-systems)。",
      },
      {
        heading: "换弹式设备",
        body:
          "主机留着充电继续用，烟弹出厂已注好烟油，用完换一颗新的。想换口味，换一颗烟弹就行。型号见 [换弹式设备](/products/switch-pods)。",
      },
      {
        heading: "一次性电子烟",
        body:
          "出厂已注好烟油，开盒即可使用，烟油用完就换一支新的。型号见 [一次性电子烟](/products/disposables)。",
      },
    ],
    faqHeading: "常见问题",
    faq: [
      {
        question: "OKami24 是一家什么样的店？",
        answer:
          "OKami24（简称 OKM）在有这个网站之前就已经在网上销售。店主亲自选品并制定价格。除了三类 Pod，这里还有烟弹、雾化芯、烟油和 IQOS。更多介绍见 [关于我们](/about)。",
      },
      {
        question: "在网站上下单，怎么操作？",
        answer:
          "选好型号、颜色或口味，点击「加入购物车」，填写手机号码和收货地址，再点击「提交订单」。之后按订单状态页显示的金额银行转账或扫码付款，并在该页上传转账凭证。管理员核对款项后发货。详细步骤见 [如何下单](/how-to-order)。如有其他问题，欢迎通过 LINE @okm24 咨询。",
      },
      {
        question: "网上下单，发货快吗？",
        answer:
          "12:30 前转账并提交转账凭证，当天发货；12:30 之后则在下一个工作日发货。我们周一至周六发货，周日和法定节假日不发货。寄出后 1–3 天内送达，并附快递单号供查询。",
      },
      {
        question: "电子烟多少钱？",
        answer: "价格因型号而异，可在各商品页查看。每笔订单都按网站标示的售价结算。",
      },
      {
        question: "怎么查验是不是正品？",
        answer:
          "到品牌官网查验即可。不少品牌在包装盒上附有代码或二维码，可在官网核对。[UWELL](/brands/uwell)、[RELX](/brands/relx)、[VOOPOO](/brands/voopoo) 和 [SALTHUB](/brands/salthub) 的品牌页写明了查验方式。",
      },
    ],
  },
};
