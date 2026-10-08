import type { ReactNode } from "react";
import { CONTACT } from "@/data/contact";
import { LineLink, type Step } from "@/components/content/ServicePage";
import { B, E, type ServiceCopy } from "./shared";

export interface HowToOrderCopy {
  eyebrow: string;
  title: string;
  description: string;
  /** Replaces `description` while online ordering is off (OKAMI24_ORDERING — owner 2026-09-07,
   *  approved as one of three wording exceptions to the "do not touch site text" rule). The steps
   *  below it still describe the site flow; this sentence is the only one that must not claim
   *  "order on the site" while the cart is off. */
  descriptionWhileOrderingOnLine: string;
  /** Sits above the summary cards while ordering is off. The sentence under the page title already
   *  says ordering happens on LINE, but the steps below it name real buttons ("Add to cart",
   *  "Go to checkout") and are a screen further down — a visitor who scrolls past that sentence
   *  has nothing telling them those buttons are not there right now (designer, 2026-09-10).
   *  Split in two so the first clause can be bold: at 14px in a thin ember-bordered box the notice
   *  read as "a box", not as a warning, and this page's one ember-bold slot is already spent on
   *  "transfers cannot be undone" (designer, 2026-09-10). */
  stepsPausedLead: string;
  stepsPausedNotice: string;
  browseCta: string;
  askLineCta: string;
  summary: { label: string; value: string; note: string }[];
  stepsTitle: string;
  phase1: string;
  phase2: string;
  phase3: string;
  orderSteps: Step[];
  paySteps: Step[];
  receiveBody: string;
  afterTitle: string;
  afterIntro: string;
  statuses: ReactNode[];
  cancelStatus: string;
  cancelBefore: ReactNode;
  noRefund: ReactNode;
  checkTitle: string;
  checks: ReactNode[];
  stuckTitle: string;
  stuck1: ReactNode;
  stuck2: ReactNode;
  stuck3: ReactNode;
  readNext: string;
  links: { shipping: string; contact: string; faq: string };
}

const line = CONTACT.lineId;

export const HOW_TO_ORDER: ServiceCopy<HowToOrderCopy> = {
  th: {
    eyebrow: "เริ่มต้นที่นี่",
    title: "วิธีสั่งซื้อ",
    description: "สั่งบนเว็บได้เลย ไม่ต้องทักแชทก่อน ใช้เวลาไม่กี่นาที — ด้านล่างคือทุกขั้นตอนตั้งแต่กดใส่ตะกร้าจนของถึงมือ",
    descriptionWhileOrderingOnLine: "ช่วงนี้สั่งผ่านไลน์ @okm24 สะดวกกว่า ทักมาบอกรุ่นที่อยากได้ แอดมินจัดให้ — ด้านล่างคือขั้นตอนการสั่งบนเว็บ เก็บไว้ดูเป็นแนวทาง",
    stepsPausedLead: "ตะกร้ายังปิดอยู่",
    stepsPausedNotice: "ขั้นตอนกับชื่อปุ่มด้านล่างยังกดใช้จริงไม่ได้ ตอนนี้สั่งทางไลน์อย่างเดียว",
    browseCta: "เลือกดูสินค้า",
    askLineCta: `ถามก่อนทางไลน์ ${line}`,
    summary: [
      { label: "1 · สั่ง", value: "ใส่ตะกร้า ยืนยันเบอร์ กรอกที่อยู่", note: "ได้เลขคำสั่งซื้อทันที" },
      { label: "2 · จ่าย", value: "โอนธนาคาร หรือสแกน QR", note: "ไม่รับบัตร ไม่มีเก็บเงินปลายทาง" },
      { label: "3 · รับของ", value: "แอดมินตรวจยอด แล้วส่งพร้อมเลขพัสดุ", note: "ค่าส่ง 50 บาท · ฟรีเมื่อ 500 บาทขึ้นไป" },
    ],
    stepsTitle: "สั่งซื้อทีละขั้น",
    phase1: "01 · สั่ง",
    phase2: "02 · จ่าย",
    phase3: "03 · รับของ",
    orderSteps: [
      { title: "เลือกสินค้าใส่ตะกร้า", body: "เลือกรุ่น สี หรือกลิ่นที่ต้องการ แล้วกด “เพิ่มลงตะกร้า” จะซื้อกี่ชิ้นก็ได้ ปรับจำนวนในตะกร้าได้ตลอด" },
      { title: "กด “ดำเนินการชำระเงิน”", body: "หน้าตะกร้าจะสรุปยอดสินค้าและค่าส่งให้ดูก่อน ถ้ายอดถึงเกณฑ์ส่งฟรี ระบบจะตัดค่าส่งให้เองตรงนี้" },
      { title: "กรอกเบอร์มือถือ", body: "กรอกเบอร์มือถือแล้วกดไปต่อ ตอนนี้ยังไม่ต้องกรอกรหัสยืนยัน เราใช้เบอร์นี้ติดต่อเรื่องคำสั่งซื้อ และให้คุณกลับมาดูสถานะคำสั่งซื้อได้ทีหลัง" },
      { title: "กรอกที่อยู่จัดส่ง", body: "ใส่ชื่อผู้รับ เบอร์ติดต่อ ที่อยู่ ตำบล อำเภอ จังหวัด และรหัสไปรษณีย์ ที่อยู่นี้จะถูกบันทึกไว้ ครั้งหน้าสั่งซ้ำกดเลือกได้เลยไม่ต้องพิมพ์ใหม่" },
      { title: "ตรวจรายการอีกรอบ แล้วกด “ยืนยันคำสั่งซื้อ”", body: "หน้านี้จะโชว์สินค้า ที่อยู่ และยอดรวมทั้งหมด ดูให้ครบก่อนกด ถ้าจะแก้ที่อยู่ยังกดย้อนกลับได้" },
      {
        title: "ได้เลขคำสั่งซื้อ",
        body: (
          <>
            ระบบจะพาไปหน้าสถานะคำสั่งซื้อของคุณโดยเฉพาะ <B>เก็บลิงก์หน้านี้ไว้</B> ใช้ดูความคืบหน้าและใช้อ้างอิงเวลาทักถาม
          </>
        ),
      },
    ],
    paySteps: [
      {
        title: "โอนเงิน",
        body: (
          <>
            รายละเอียดบัญชีและ QR อยู่ในหน้าสถานะคำสั่งซื้อของคุณ กดเข้าไปดูได้เลยหลังกดยืนยันคำสั่งซื้อ ยอดที่ต้องโอนขึ้นให้ครบแล้ว รวมค่าส่ง
            <br />
            เรารับโอนธนาคารและสแกน QR เท่านั้น — <B>ไม่รับบัตรเครดิต และไม่มีเก็บเงินปลายทาง</B>
            <br />
            <B>โอนแล้วยกเลิกไม่ได้</B> ตรวจรายการและยอดให้ครบก่อนโอน
          </>
        ),
      },
      {
        title: "กด “แจ้งชำระเงินแล้ว”",
        body: (
          <>
            หลังโอนเสร็จ กลับมาที่หน้าสถานะคำสั่งซื้อแล้วกดปุ่มนี้ ใส่หมายเหตุการโอนได้ถ้ามี ตอนนี้เว็บยังแนบรูปสลิปไม่ได้ ให้ส่งสลิปทางไลน์ <LineLink /> พร้อมเลขคำสั่งซื้อ
          </>
        ),
      },
    ],
    receiveBody: "แอดมินตรวจยอดเงินที่เข้าจริงก่อน แล้วจึงอนุมัติ แพ็กของ และจัดส่ง — ดูสถานะทีละขั้นได้ด้านล่าง",
    afterTitle: "หลังสั่งแล้วเกิดอะไรขึ้น",
    afterIntro: "สถานะในหน้าคำสั่งซื้อจะไล่ตามนี้ ดูได้ตลอดว่าถึงขั้นไหนแล้ว",
    statuses: [
      <><B>รอชำระเงิน</B> — คำสั่งซื้อเข้าระบบแล้ว รอคุณโอน</>,
      <><B>แจ้งชำระเงินแล้ว</B> — คุณกดแจ้งเข้ามาแล้ว</>,
      <><B><span className="whitespace-nowrap">รอตรวจสอบโดยแอดมิน</span></B> — แอดมินกำลังเช็คยอดเงินที่เข้าจริง การกดแจ้งว่าจ่ายแล้วยังไม่ใช่การยืนยันอัตโนมัติ ต้องมีคนตรวจก่อนเสมอ</>,
      <><B>อนุมัติแล้ว</B> — ยอดตรง คำสั่งซื้อผ่าน</>,
      <><B>กำลังเตรียมจัดส่ง</B> — แพ็กของอยู่</>,
      <><B>จัดส่งแล้ว</B> — ส่งออกแล้ว พร้อมเลขพัสดุให้กดติดตาม</>,
      <><B>สำเร็จ</B> — ของถึงมือคุณแล้ว</>,
    ],
    cancelStatus: "ถ้ามีเหตุต้องยกเลิก คำสั่งซื้อจะขึ้นสถานะ “ยกเลิก”",
    cancelBefore: <>ยกเลิกได้ตราบใดที่ยังไม่ได้โอน ทักไลน์ <LineLink /> พร้อมเลขคำสั่งซื้อ บอกว่าจะยกเลิก แอดมินจัดการให้</>,
    noRefund: <><E>โอนแล้วยกเลิกไม่ได้ และไม่มีการคืนเงิน</E> เพราะฉะนั้นเช็ครายการ สี กลิ่น และจำนวนให้ครบก่อนโอนทุกครั้ง</>,
    checkTitle: "ก่อนโอน เช็ค 2 อย่าง",
    checks: [
      <><B>โอนเข้าบัญชีที่แอดมินส่งให้ในไลน์ {line} เท่านั้น</B> — ถ้ามีคนส่งเลขบัญชีอื่นมาให้ อย่าโอน</>,
      <><B>ไลน์ทางการมีชื่อเดียวคือ {line}</B> — เช็คได้จากปุ่มไลน์ท้ายเว็บนี้ทุกหน้า</>,
    ],
    stuckTitle: "ถ้าติดตรงไหน",
    stuck1: <>ทักไลน์ <LineLink /> ได้เลย บอกเลขคำสั่งซื้อมาด้วยจะเร็วที่สุด แอดมินตอบเอง ไม่ใช่บอท ช่วยเช็คสต๊อก ช่วยเลือกรุ่น ตามคำสั่งซื้อ ส่งสลิป — เรื่องพวกนี้คุยทางไลน์ได้หมด</>,
    stuck2: <><B>ยังไม่แน่ใจว่าจะเอาตัวไหน ดูจากบนเว็บก่อนได้</B> ทุกรุ่นมีสเปก ราคา สี กลิ่น ครบ อยากเทียบหลายตัวก็มีหน้าเปรียบเทียบให้ เลือกได้แล้วค่อยทักมาบอกชื่อรุ่น คุยจบเร็วกว่าเยอะ</>,
    stuck3: <>ตอนนี้สั่งซื้อทำผ่านไลน์ <LineLink /> อย่างเดียว ทักมาบอกรุ่น สี หรือกลิ่นที่อยากได้ แอดมินเช็คของให้ แล้วสรุปยอดกับวิธีโอนกลับไป พร้อมเลขคำสั่งซื้อในแชท เก็บไว้ใช้อ้างอิงตอนทักถามทีหลัง</>,
    readNext: "อ่านต่อ:",
    links: { shipping: "การจัดส่ง", contact: "ติดต่อเรา", faq: "คำถามที่พบบ่อย" },
  },
  en: {
    eyebrow: "Start here",
    title: "How to order",
    description: "Order right here on the site — no need to message us first, and it only takes a few minutes. Below is every step, from adding to cart to the parcel in your hands.",
    descriptionWhileOrderingOnLine: "Right now the easier way to order is LINE @okm24 — message us the model you want and the admin sorts it out. The steps below describe ordering on the site, kept here for reference.",
    stepsPausedLead: "The cart is switched off right now.",
    stepsPausedNotice: "The steps and button names below aren’t live yet — orders go through LINE instead.",
    browseCta: "Browse products",
    askLineCta: `Ask on LINE ${line}`,
    summary: [
      { label: "1 · Order", value: "Add to cart, verify your phone, enter your address", note: "You get an order number straight away" },
      { label: "2 · Pay", value: "Bank transfer or scan the QR", note: "No card payment, no COD" },
      { label: "3 · Get it", value: "An admin checks the amount, then ships with a tracking number", note: "Shipping ฿50 · free on orders ฿500 and over" },
    ],
    stepsTitle: "Ordering, step by step",
    phase1: "01 · Order",
    phase2: "02 · Pay",
    phase3: "03 · Get it",
    orderSteps: [
      { title: "Add what you want to the cart", body: "Pick the model, colour or flavour you want, then tap “Add to cart”. Buy as many as you like — you can change the quantity in the cart at any time." },
      { title: "Tap “Proceed to checkout”", body: "The cart shows your item total and shipping before you go any further. If your order reaches the free-shipping threshold, the fee is removed automatically right here." },
      { title: "Enter your mobile number", body: "Enter your mobile number and continue — no verification code is needed right now. We use it to contact you about your order and to let you check its status later." },
      { title: "Enter your shipping address", body: "Fill in the recipient’s name and phone number, the address, subdistrict, district, province and postal code. We save the address, so next time you can just select it instead of typing it again." },
      { title: "Check everything, then tap “Place order”", body: "This page shows your items, your address and the full total. Look it over before you tap — you can still go back and change the address." },
      {
        title: "You get your order number",
        body: (
          <>
            You’ll be taken to the order status page for your order. <B>Save this link</B> — use it to follow progress, and to refer to when you message us.
          </>
        ),
      },
    ],
    paySteps: [
      {
        title: "Transfer the payment",
        body: (
          <>
            The bank details and QR code are on your order status page — open it right after you place the order. The amount shown is the full total, shipping included.
            <br />
            We only accept bank transfers and QR payments — <B>no credit cards, and no cash on delivery</B>.
            <br />
            <B>Transfers cannot be cancelled.</B> Check your items and the total before you transfer.
          </>
        ),
      },
      {
        title: "Tap “I’ve paid — submit for review”",
        body: (
          <>
            Once you’ve transferred, go back to your order status page and tap this button. You can add a transfer note if you have one. The site can’t take a slip photo yet, so send the slip on LINE <LineLink /> with your order number.
          </>
        ),
      },
    ],
    receiveBody: "An admin checks the money that actually came in, then approves, packs and ships your order — the statuses below show you where it is.",
    afterTitle: "What happens after you order",
    afterIntro: "Your order page moves through these statuses, so you can always see where things stand.",
    statuses: [
      <><B>Pending payment</B> — the order is in our system, waiting for your transfer</>,
      <><B>Payment submitted</B> — you’ve submitted your payment</>,
      <><B>Awaiting admin verification</B> — an admin is checking the money that actually arrived. Submitting a payment is not automatic confirmation; a person always checks first.</>,
      <><B>Approved</B> — the amount matches, your order is through</>,
      <><B>Processing</B> — we’re packing it</>,
      <><B>Shipped</B> — it’s on its way, with a tracking number you can follow</>,
      <><B>Completed</B> — it’s reached you</>,
    ],
    cancelStatus: "If an order has to be cancelled, there’s a Cancelled status for that.",
    cancelBefore: <>You can cancel any time before you transfer. Message us on LINE <LineLink /> with your order number and say you’d like to cancel — an admin will take care of it.</>,
    noRefund: <><E>Once you’ve transferred, the order can’t be cancelled and the money isn’t refundable.</E> So check your items, colours, flavours and quantities every time before you transfer.</>,
    checkTitle: "Two things to check before you transfer",
    checks: [
      <><B>Only transfer to the account an admin sends you on LINE {line}</B> — if anyone sends you a different account number, do not transfer.</>,
      <><B>Our only official LINE account is {line}</B> — you can check it from the LINE button in the footer of every page.</>,
    ],
    stuckTitle: "If you get stuck",
    stuck1: <>Just message us on LINE <LineLink /> — include your order number and it’ll be quickest. You’re talking to an admin, not a bot. Stock checks, help choosing a model, order updates, sending a slip — all of that works over LINE.</>,
    stuck2: <><B>Not sure which one you want? Check it here first.</B> Every model has its specs, price, colours and flavours, and the compare page lines a few up side by side. Pick one, then message us — much quicker that way.</>,
    stuck3: <>Right now ordering happens on LINE <LineLink /> only. Message us the model, the colour or flavour you want — an admin checks stock, then sends back the total, how to pay, and your order number. Keep that number and quote it when you message us later.</>,
    readNext: "Read next:",
    links: { shipping: "Shipping", contact: "Contact", faq: "FAQ" },
  },
  zh: {
    eyebrow: "从这里开始",
    title: "如何下单",
    description: "直接在网站下单，不用先联系我们，几分钟就能完成。下面是从加入购物车到收到货的每一步。",
    descriptionWhileOrderingOnLine: "这段时间用 LINE @okm24 下单更方便，告诉店主想要的型号，帮你备好。下面是网站下单的步骤，仅供参考。",
    stepsPausedLead: "目前购物车是关闭的。",
    stepsPausedNotice: "下面的步骤和按钮名称还不能实际使用，下单请走 LINE。",
    browseCta: "浏览商品",
    askLineCta: `先在 LINE 咨询 ${line}`,
    summary: [
      { label: "1 · 下单", value: "加入购物车、验证手机号、填写地址", note: "立即获得订单编号" },
      { label: "2 · 付款", value: "银行转账或扫二维码", note: "不支持刷卡，无货到付款" },
      { label: "3 · 收货", value: "管理员核对金额后发货，并提供快递单号", note: "运费 50 铢 · 满 500 铢免运费" },
    ],
    stepsTitle: "下单步骤",
    phase1: "01 · 下单",
    phase2: "02 · 付款",
    phase3: "03 · 收货",
    orderSteps: [
      { title: "选择商品加入购物车", body: "选好型号、颜色或口味，点击「加入购物车」。想买几件都可以，购物车里随时可以改数量。" },
      { title: "点击「前往结算」", body: "购物车会先列出商品金额和运费。如果订单金额达到免运费门槛，系统会在这里自动减去运费。" },
      { title: "填写手机号码", body: "填写手机号码后即可继续，目前无需输入验证码。我们用这个号码与您联系订单事宜，也方便您之后回来查看订单状态。" },
      { title: "填写收货地址", body: "填写收件人姓名、联系电话、详细地址、分区、区/县、府和邮政编码。地址会被保存，下次下单直接选用，不必重新输入。" },
      { title: "再核对一遍，然后点击「提交订单」", body: "此页面会显示商品、收货地址和总金额。点击前请看清楚，还可以返回修改地址。" },
      {
        title: "获得订单编号",
        body: (
          <>
            系统会带您进入专属的订单状态页。<B>请保存这个链接</B>，用它查看进度，联系我们时也用它作为参考。
          </>
        ),
      },
    ],
    paySteps: [
      {
        title: "转账付款",
        body: (
          <>
            银行账户信息和二维码就在您的订单状态页，提交订单后即可打开查看。页面显示的金额已是含运费的总额。
            <br />
            我们只接受银行转账和扫码付款 —— <B>不支持信用卡，也没有货到付款</B>。
            <br />
            <B>转账后不可取消。</B>请在转账前核对商品和金额。
          </>
        ),
      },
      {
        title: "点击「已付款，提交审核」",
        body: (
          <>
            转账完成后，回到订单状态页点击这个按钮，有转账备注可以一并填写。目前网站还不能上传转账凭证，请通过 LINE <LineLink /> 发送凭证并附上订单编号。
          </>
        ),
      },
    ],
    receiveBody: "管理员会先核对实际到账金额，然后批准订单、打包、发货 —— 下面列出了每个状态。",
    afterTitle: "下单之后会发生什么",
    afterIntro: "订单页面会按以下状态推进，您随时可以看到进行到哪一步。",
    statuses: [
      <><B>待付款</B> —— 订单已进入系统，等待您转账</>,
      <><B>已提交付款</B> —— 您已提交付款信息</>,
      <><B>等待管理员核实</B> —— 管理员正在核对实际到账金额。提交付款并不等于自动确认，始终需要人工核实。</>,
      <><B>已批准</B> —— 金额无误，订单通过</>,
      <><B>备货中</B> —— 正在打包</>,
      <><B>已发货</B> —— 已寄出，附带可查询的快递单号</>,
      <><B>已完成</B> —— 您已收到货</>,
    ],
    cancelStatus: "如果需要取消订单，系统也有「已取消」这个状态。",
    cancelBefore: <>只要还没转账，都可以取消。通过 LINE <LineLink /> 联系我们，附上订单编号说明要取消，管理员会为您处理。</>,
    noRefund: <><E>转账后订单不可取消，也不退款。</E>所以每次转账前，请务必核对商品、颜色、口味和数量。</>,
    checkTitle: "转账前请核对两件事",
    checks: [
      <><B>只能转账到管理员在 LINE {line} 上发给您的账号</B> —— 若有人发来其他账号，请勿转账。</>,
      <><B>我们唯一的官方 LINE 账号是 {line}</B> —— 每个页面底部的 LINE 按钮都可以核对。</>,
    ],
    stuckTitle: "遇到问题怎么办",
    stuck1: <>直接通过 LINE <LineLink /> 联系我们，附上订单编号最快。回复您的是管理员，不是机器人。查库存、帮您选型号、跟进订单、发送转账凭证 —— 这些都可以在 LINE 上处理。</>,
    stuck2: <><B>还没想好要哪一款，可以先在网站看。</B>每款的参数、价格、颜色和口味都写清楚了，还有对比页可以把几款并排看。选好再来找我们，会快很多。</>,
    stuck3: <>目前只能通过 LINE <LineLink /> 下单。告诉我们想要的型号、颜色或口味，管理员确认有货后，会把总金额、付款方式和订单编号一起发给您。请保存这个编号，之后联系我们时报给管理员。</>,
    readNext: "继续阅读：",
    links: { shipping: "配送", contact: "联系我们", faq: "常见问题" },
  },
};
