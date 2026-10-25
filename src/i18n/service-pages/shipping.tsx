import type { ReactNode } from "react";
import { B, type ServiceCopy } from "./shared";

export interface ShippingCopy {
  eyebrow: string;
  title: string;
  description: string;
  summary: { label: string; value: string; note: string }[];
  feeTitle: string;
  tableHeadTotal: string;
  tableHeadFee: string;
  rowUnder: string;
  rowUnderFee: string;
  rowOver: string;
  rowOverFee: string;
  feeNote: string;
  whenTitle: string;
  when1: ReactNode;
  when2: ReactNode;
  when3: string;
  when4: ReactNode;
  trackTitle: string;
  track1: string;
  /** ReactNode since 2026-09-10: this is the most load-bearing sentence in the tracking section —
   *  the two numbers a customer gets are different things — and it was the only paragraph there
   *  with no emphasis at all, while the less important carrier note below it had some (designer). */
  track2: ReactNode;
  track3: ReactNode;
  intlTitle: string;
  intl: ReactNode;
  problemTitle: string;
  problem: ReactNode;
  readNext: string;
  links: { howToOrder: string; contact: string; warranty: string };
}

export const SHIPPING: ServiceCopy<ShippingCopy> = {
  th: {
    eyebrow: "ค่าส่งและเวลา",
    title: "การจัดส่ง",
    description: "ค่าส่งเท่าไหร่ กี่วันถึง ตามพัสดุได้ที่ไหน — บอกไว้ตรงนี้หมด ไม่มีค่าใช้จ่ายแอบซ่อนค่ะ",
    summary: [
      { label: "ค่าส่ง", value: "50 บาท", note: "อัตราเดียวทั่วประเทศ · ฟรีเมื่อ 500 บาทขึ้นไป" },
      { label: "ถึงมือใน", value: "1–3 วัน", note: "โอนก่อน 15:00 ส่งวันเดียวกัน" },
      { label: "ติดตามพัสดุ", value: "มีทุกคำสั่งซื้อ", note: "ได้เลขพัสดุเมื่อของออกจากร้าน" },
    ],
    feeTitle: "ค่าจัดส่ง",
    tableHeadTotal: "ยอดสั่งซื้อ",
    tableHeadFee: "ค่าจัดส่ง",
    rowUnder: "ต่ำกว่า 500 บาท",
    rowUnderFee: "50 บาท",
    rowOver: "500 บาทขึ้นไป",
    rowOverFee: "ฟรี",
    feeNote: "ค่าส่งอัตราเดียวทั่วประเทศ และคุณจะเห็นยอดเต็มที่รวมค่าส่งแล้วก่อนโอนเสมอค่ะ",
    whenTitle: "ส่งเมื่อไหร่",
    when1: "โอนแล้วของยังไม่ออกทันที แอดมินต้องเช็คยอดที่เข้าจริงก่อน ตรวจผ่านแล้วถึงแพ็กและส่งออกค่ะ อยากรู้ว่าถึงไหนแล้ว ติดต่อสอบถามเพิ่มเติมได้ที่ @okm24 ค่ะ",
    when2: <>ถ้าต้องการของด่วน <B>โอนและส่งสลิปก่อน 15:00 เราจัดส่งให้วันเดียวกัน</B> หลัง 15:00 จะส่งในวันทำการถัดไปค่ะ</>,
    when3: "ส่งจันทร์ถึงเสาร์ หยุดวันอาทิตย์และวันหยุดนักขัตฤกษ์ สั่งวันอาทิตย์ของจะออกวันจันทร์ค่ะ",
    when4: <>ส่งออกแล้ว <B>ถึงมือภายใน 1–3 วัน</B>ค่ะ</>,
    trackTitle: "ติดตามพัสดุ",
    track1: "ของออกจากร้านเมื่อไหร่ แอดมินส่งเลขพัสดุให้ทางไลน์ ใช้เลขนี้ตามของได้เอง",
    track2: <><B>เลขคำสั่งซื้อกับเลขพัสดุเป็นคนละเลขกัน</B> เลขคำสั่งซื้อได้ตอนสั่ง ไว้อ้างอิงเวลาทักถาม ส่วนเลขพัสดุได้ตอนของออกจากร้าน ไว้ตามพัสดุ เก็บไว้ทั้งคู่นะคะ</>,
    track3: <>เราเลือกขนส่งให้ตามพื้นที่ปลายทาง <B>เลขพัสดุจะบอกไว้ว่าเป็นของขนส่งเจ้าไหน</B> เอาไปเช็คในเว็บหรือแอปของเจ้านั้นได้เลย ไม่แน่ใจว่าเช็คที่ไหน ติดต่อสอบถามเพิ่มเติมได้ที่ @okm24 ค่ะ</>,
    intlTitle: "ส่งต่างประเทศ",
    intl: <><B>เราส่งได้ทั่วประเทศไทย</B> ส่วนการส่งไปต่างประเทศยังไม่เปิดรับค่ะ</>,
    problemTitle: "ของมีปัญหาตอนได้รับ",
    problem: <><B>ถ่ายคลิปตอนแกะกล่องไว้ทุกครั้งนะคะ</B> คลิปช่วยยืนยันว่าพัสดุส่งมาจากร้านเราจริง ถ้าสินค้ามีปัญหา คุณเคลมได้ภายใน 7 วันหลังได้รับของ และคลิปนี้คือหลักฐานที่เราใช้พิจารณาค่ะ</>,
    readNext: "อ่านต่อ:",
    links: { howToOrder: "วิธีสั่งซื้อ", contact: "ติดต่อเรา", warranty: "นโยบายเคลม" },
  },
  en: {
    eyebrow: "Cost and timing",
    title: "Shipping",
    description: "What shipping costs, how long it takes, where to track it — it’s all here, with no hidden charges.",
    summary: [
      { label: "Shipping", value: "฿50", note: "Flat rate nationwide · free on orders ฿500 and over" },
      { label: "Arrives in", value: "1–3 days", note: "Transfer before 15:00 and we ship the same day" },
      { label: "Tracking", value: "On every order", note: "You get it when the parcel leaves the shop" },
    ],
    feeTitle: "Shipping cost",
    tableHeadTotal: "Order total",
    tableHeadFee: "Shipping",
    rowUnder: "Under ฿500",
    rowUnderFee: "฿50",
    rowOver: "฿500 and over",
    rowOverFee: "Free",
    feeNote: "One flat rate for the whole country, and you always see the full amount, shipping included, before you transfer.",
    whenTitle: "When we ship",
    when1: "Transferring doesn’t send your parcel out straight away — an admin checks the money that actually arrived first, then we pack it and ship it. Want to know where your order stands? Just ask us on LINE.",
    when2: <>If you need it soon, <B>transfer and send your slip before 15:00, and we ship the same day.</B> After 15:00 it goes out the next working day.</>,
    when3: "We ship Monday to Saturday, and not on Sundays or public holidays. Order on a Sunday and it goes out on Monday.",
    when4: <>Once it’s out, it <B>arrives within 1–3 days</B>.</>,
    trackTitle: "Tracking your parcel",
    track1: "When your parcel leaves the shop, the admin sends you the tracking number on LINE — use it to follow the parcel yourself.",
    track2: <><B>Your order number and your tracking number are not the same thing.</B> You get the order number when you order — quote it whenever you message us. The tracking number comes later, when the parcel goes out, and that’s the one you follow it with. Keep both.</>,
    track3: <>We choose the carrier that suits the destination. <B>Your tracking number tells you which carrier it is</B>, so you can track it on that carrier’s website or app. If you’re not sure where to check, ask us on LINE.</>,
    intlTitle: "International shipping",
    intl: <><B>We deliver anywhere in Thailand.</B> International shipping isn’t available yet.</>,
    problemTitle: "If something’s wrong when it arrives",
    problem: <><B>Always film yourself unboxing.</B> The video confirms the parcel really came from our shop. If there’s a problem with the product, you can claim within 7 days of receiving it, and the video is the evidence we need to consider your claim.</>,
    readNext: "Read next:",
    links: { howToOrder: "How to order", contact: "Contact", warranty: "Warranty & claims" },
  },
  zh: {
    eyebrow: "运费与时效",
    title: "配送",
    description: "运费多少、几天送到、在哪查快递 —— 都写在这里，没有隐藏费用。",
    summary: [
      { label: "运费", value: "50 铢", note: "全国统一价 · 满 500 铢免运费" },
      { label: "送达时间", value: "1–3 天", note: "15:00 前转账，当天发货" },
      { label: "快递查询", value: "每笔订单都有", note: "包裹寄出时提供" },
    ],
    feeTitle: "运费",
    tableHeadTotal: "订单金额",
    tableHeadFee: "运费",
    rowUnder: "低于 500 铢",
    rowUnderFee: "50 铢",
    rowOver: "500 铢及以上",
    rowOverFee: "免运费",
    feeNote: "全国统一运费，转账前您一定会看到含运费的完整金额。",
    whenTitle: "什么时候发货",
    when1: "转账后不会立刻发货。管理员会先核对实际到账的金额，确认无误后才打包寄出。想知道进度，随时可以在 LINE 上问我们。",
    when2: <>着急用的话，<B>在 15:00 前转账并提交转账凭证，我们当天发货。</B>15:00 之后则顺延至下一个工作日。</>,
    when3: "我们周一至周六发货，周日和法定节假日不发货。周日下单的订单周一寄出。",
    when4: <>寄出后 <B>1–3 天内送达</B>。</>,
    trackTitle: "查询快递",
    track1: "包裹寄出后，管理员会在 LINE 上把快递单号发给您，用它就能自行查询包裹。",
    track2: <><B>订单编号和快递单号不是同一个号码。</B>订单编号在下单时获得，之后联系我们时报这个编号；快递单号是包裹寄出时才有的，用来查询物流。两个都请保存好。</>,
    track3: <>我们会根据收货地区选择快递公司。<B>快递单号会注明是哪家快递</B>，您可以在该快递的网站或 App 上查询。不确定去哪查，可以在 LINE 上问我们。</>,
    intlTitle: "国际配送",
    intl: <><B>泰国全境均可配送。</B>暂不接受国际配送。</>,
    problemTitle: "收到货有问题",
    problem: <><B>每次都请拍下开箱视频。</B>视频能证明包裹确实是从本店寄出的；商品如有问题，可在收货后 7 天内申请售后，而开箱视频是我们受理时必须依据的凭证。</>,
    readNext: "继续阅读：",
    links: { howToOrder: "如何下单", contact: "联系我们", warranty: "售后政策" },
  },
};
