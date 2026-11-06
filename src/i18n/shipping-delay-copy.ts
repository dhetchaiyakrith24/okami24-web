import type { Locale } from "@/i18n/config";

/** Words of the temporary shipping delay notice (owner 06/11, src/lib/commerce/shipping-delay.ts). No warehouse talk (BSOT §10). */
export const SHIPPING_DELAY_COPY: Record<Locale, { title: string; body: string; accept: string; back: string }> = {
  th: {
    title: "แจ้งก่อนสั่งซื้อ",
    body: "ช่วงนี้จัดส่งล่าช้ากว่าปกติ ออเดอร์ที่สั่งตอนนี้จะจัดส่งภายในวันจันทร์ที่ 9 พ.ย.",
    accept: "รับทราบ สั่งซื้อต่อ",
    back: "กลับไปดูตะกร้า",
  },
  en: {
    title: "Before you order",
    body: "Shipping is slower than usual right now. Orders placed now will ship by Monday 9 November.",
    accept: "Got it, continue",
    back: "Back to cart",
  },
  zh: {
    title: "下单前请留意",
    body: "目前发货比平时慢，现在下单的订单将于 11 月 9 日（周一）前发出。",
    accept: "知道了，继续下单",
    back: "返回购物车",
  },
};
