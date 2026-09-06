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
  track2: string;
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
    description: "ค่าส่งเท่าไหร่ ส่งยังไง ตามพัสดุที่ไหน — บอกไว้ตรงนี้หมด ไม่มีค่าใช้จ่ายแอบซ่อน",
    summary: [
      { label: "ค่าส่ง", value: "60 บาท", note: "อัตราเดียวทั่วประเทศ · ฟรีเมื่อ 500 บาทขึ้นไป" },
      { label: "ถึงมือใน", value: "1–3 วัน", note: "โอนก่อน 15:00 ส่งวันเดียวกัน" },
      { label: "ติดตามพัสดุ", value: "มีเลขพัสดุทุกคำสั่งซื้อ", note: "ดูได้ในหน้าสถานะคำสั่งซื้อ" },
    ],
    feeTitle: "ค่าจัดส่ง",
    tableHeadTotal: "ยอดสั่งซื้อ",
    tableHeadFee: "ค่าจัดส่ง",
    rowUnder: "ต่ำกว่า 500 บาท",
    rowUnderFee: "60 บาท",
    rowOver: "500 บาทขึ้นไป",
    rowOverFee: "ฟรี",
    feeNote: "ค่าส่งอัตราเดียวทั่วประเทศ ระบบคิดให้อัตโนมัติในหน้าตะกร้า คุณเห็นยอดรวมทั้งหมดก่อนกดยืนยันเสมอ",
    whenTitle: "ส่งเมื่อไหร่",
    when1: <>เราจะจัดส่งหลังแอดมินตรวจยอดโอนและอนุมัติคำสั่งซื้อแล้ว ก่อนหน้านั้นคำสั่งซื้อจะค้างที่สถานะ “<span className="whitespace-nowrap">รอตรวจสอบโดยแอดมิน</span>”</>,
    when2: <><B>โอนและกดแจ้งชำระเงินก่อน 15:00 เราจัดส่งให้ในวันเดียวกัน</B> หลัง 15:00 ส่งวันทำการถัดไป</>,
    when3: "ส่งจันทร์ถึงเสาร์ หยุดวันอาทิตย์และวันหยุดนักขัตฤกษ์ สั่งวันอาทิตย์ของจะออกวันจันทร์",
    when4: <>ส่งออกแล้ว <B>ถึงมือภายใน 1–3 วัน</B></>,
    trackTitle: "ติดตามพัสดุ",
    track1: "พอคำสั่งซื้อขึ้นสถานะ “จัดส่งแล้ว” คุณจะเห็นเลขพัสดุในหน้าสถานะคำสั่งซื้อ ใช้เลขนี้ตามของได้เอง",
    track2: "ลิงก์หน้าสถานะคือลิงก์เฉพาะของคำสั่งซื้อคุณ เปิดดูได้ทุกเมื่อ ไม่ต้องรอถามแอดมิน",
    track3: <>เราส่งด้วย <B>ไปรษณีย์ไทย (EMS)</B> และ <B>Flash Express</B> เลือกให้ตามพื้นที่ปลายทาง เลขพัสดุที่ได้จะระบุไว้ว่าเป็นของเจ้าไหน ใช้ตามของในเว็บหรือแอปของขนส่งเจ้านั้นได้เลย</>,
    intlTitle: "ส่งต่างประเทศ",
    intl: <><B>ตอนนี้ส่งเฉพาะในประเทศไทย</B> ยังไม่รับส่งต่างประเทศ</>,
    problemTitle: "ของมีปัญหาตอนได้รับ",
    problem: <><B>ถ่ายคลิปตอนแกะกล่องไว้ทุกครั้ง</B> ถ้าสินค้ามีปัญหา เคลมได้ภายใน 7 วันหลังได้รับของ และคลิปแกะกล่องคือหลักฐานที่เราต้องใช้พิจารณา</>,
    readNext: "อ่านต่อ:",
    links: { howToOrder: "วิธีสั่งซื้อ", contact: "ติดต่อเรา", warranty: "นโยบายเคลม" },
  },
  en: {
    eyebrow: "Cost and timing",
    title: "Shipping",
    description: "What shipping costs, how we send it, where to track it — it’s all here, with no hidden charges.",
    summary: [
      { label: "Shipping", value: "฿60", note: "Flat rate nationwide · free on orders ฿500 and over" },
      { label: "Arrives in", value: "1–3 days", note: "Transfer before 15:00 and we ship the same day" },
      { label: "Tracking", value: "A tracking number on every order", note: "Shown on your order status page" },
    ],
    feeTitle: "Shipping cost",
    tableHeadTotal: "Order total",
    tableHeadFee: "Shipping",
    rowUnder: "Under ฿500",
    rowUnderFee: "฿60",
    rowOver: "฿500 and over",
    rowOverFee: "Free",
    feeNote: "One flat rate for the whole country, calculated automatically in your cart. You always see the full total before you place the order.",
    whenTitle: "When we ship",
    when1: <>We ship after an admin has checked your transfer and approved the order. Until then it sits at “Awaiting admin verification”.</>,
    when2: <><B>Transfer and submit your payment before 15:00 and we ship the same day.</B> After 15:00 it goes out the next working day.</>,
    when3: "We ship Monday to Saturday, and not on Sundays or public holidays. Order on a Sunday and it goes out on Monday.",
    when4: <>Once it’s out, it <B>arrives within 1–3 days</B>.</>,
    trackTitle: "Tracking your parcel",
    track1: "As soon as your order reaches “Shipped”, the tracking number appears on your order status page — use it to follow the parcel yourself.",
    track2: "That status link belongs to your order alone. Open it whenever you like — no need to wait for an admin to reply.",
    track3: <>We ship with <B>Thailand Post (EMS)</B> and <B>Flash Express</B>, choosing whichever suits the destination. Your tracking number says which carrier it is, so you can track it on that carrier’s website or app.</>,
    intlTitle: "International shipping",
    intl: <><B>We currently ship within Thailand only.</B> No international shipping yet.</>,
    problemTitle: "If something’s wrong when it arrives",
    problem: <><B>Always film yourself unboxing.</B> If there’s a problem with the product you can claim within 7 days of receiving it, and the unboxing video is the evidence we need in order to consider it.</>,
    readNext: "Read next:",
    links: { howToOrder: "How to order", contact: "Contact", warranty: "Warranty & claims" },
  },
  zh: {
    eyebrow: "运费与时效",
    title: "配送",
    description: "运费多少、怎么发货、在哪查快递 —— 都写在这里，没有隐藏费用。",
    summary: [
      { label: "运费", value: "60 铢", note: "全国统一价 · 满 500 铢免运费" },
      { label: "送达时间", value: "1–3 天", note: "15:00 前转账，当天发货" },
      { label: "快递查询", value: "每笔订单都有快递单号", note: "可在订单状态页查看" },
    ],
    feeTitle: "运费",
    tableHeadTotal: "订单金额",
    tableHeadFee: "运费",
    rowUnder: "低于 500 铢",
    rowUnderFee: "60 铢",
    rowOver: "500 铢及以上",
    rowOverFee: "免运费",
    feeNote: "全国统一运费，购物车会自动计算。您在提交订单前一定能看到完整的总金额。",
    whenTitle: "什么时候发货",
    when1: <>管理员核对转账并批准订单后我们才会发货。在此之前，订单会停留在「等待管理员核实」状态。</>,
    when2: <><B>在 15:00 前完成转账并提交付款，我们当天发货。</B>15:00 之后则顺延至下一个工作日。</>,
    when3: "我们周一至周六发货，周日和法定节假日不发货。周日下单的订单周一寄出。",
    when4: <>寄出后 <B>1–3 天内送达</B>。</>,
    trackTitle: "查询快递",
    track1: "订单进入「已发货」状态后，订单状态页就会显示快递单号，您可以用它自行查询包裹。",
    track2: "这个状态页链接是您订单专属的，随时都能打开，不必等管理员回复。",
    track3: <>我们使用 <B>泰国邮政（EMS）</B> 和 <B>Flash Express</B> 发货，会根据收货地区选择。快递单号会注明是哪家快递，您可以在该快递的网站或 App 上查询。</>,
    intlTitle: "国际配送",
    intl: <><B>目前仅在泰国境内配送。</B>暂不接受国际配送。</>,
    problemTitle: "收到货有问题",
    problem: <><B>每次都请拍下开箱视频。</B>商品如有问题，可在收货后 7 天内申请售后，而开箱视频是我们受理时必须依据的凭证。</>,
    readNext: "继续阅读：",
    links: { howToOrder: "如何下单", contact: "联系我们", warranty: "售后政策" },
  },
};
