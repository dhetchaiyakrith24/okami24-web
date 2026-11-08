import type { Locale } from "@/i18n/config";

/** Words of the temporary shipping delay notice (owner 06/11, src/lib/commerce/shipping-delay.ts). No warehouse talk (BSOT §10).
 *  `body` and `question` are lists: Thai breaks only between the pieces, each piece stays on one line (checker #1248 saw จัด|ส่ง at 390). */
export const SHIPPING_DELAY_COPY: Record<Locale, { title: string; body: string[]; question: string[]; line: string; accept: string; back: string }> = {
  th: {
    title: "แจ้งก่อนสั่งซื้อ",
    body: ["ช่วงนี้จัดส่งล่าช้ากว่าปกติ", "ออเดอร์ใหม่จะจัดส่ง", "ระหว่างวันที่ 10–11 พ.ย."],
    question: ["หากมีคำถามเพิ่มเติม", "สามารถติดต่อสอบถามได้ทางไลน์"],
    line: "สอบถามทางไลน์",
    accept: "รับทราบ สั่งซื้อต่อ",
    back: "กลับไปดูตะกร้า",
  },
  en: {
    title: "Before you order",
    body: ["Shipping is slower than usual right now. New orders will ship on 10–11 November."],
    question: ["Any questions? Ask us on LINE."],
    line: "Ask on LINE",
    accept: "Got it, continue",
    back: "Back to cart",
  },
  zh: {
    title: "下单前请留意",
    body: ["目前发货比平时慢，新订单将于 11 月 10–11 日发出。"],
    question: ["如有其他问题，欢迎通过 LINE 咨询。"],
    line: "通过 LINE 咨询",
    accept: "知道了，继续下单",
    back: "返回购物车",
  },
};
