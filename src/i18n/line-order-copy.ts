import type { Locale } from "@/i18n/config";

/**
 * Words of the "order on LINE" dialog (owner 19/10: the customer's pick goes to LINE OA as a ready message; on a computer
 * a QR on the same page, no new tab). Designer spec 19/10; Thai sentences say "ไลน์" (THAI_STYLE), "LINE" only in the
 * mono eyebrow. The message template is what reaches the shop's chat, so it names the product, the option and a code.
 */
export const LINE_ORDER_COPY: Record<
  Locale,
  {
    titleOrder: string;
    titleAsk: string;
    /** the site-wide LINE button on a computer (owner 21/10): a QR of the shop's add-friend link, no message */
    titleContact: string;
    bodyContact: string;
    body: string;
    messageLabel: string;
    copy: string;
    copied: string;
    close: string;
    addFriend: string;
    leadOrder: string;
    leadAsk: string;
    optionLabel: string;
    codeLabel: string;
    touchHint: string;
    mouseHint: string;
  }
> = {
  th: {
    titleOrder: "สแกนเพื่อสั่งทางไลน์",
    titleAsk: "สแกนเพื่อถามทางไลน์",
    titleContact: "สแกนเพื่อแชทกับร้านทางไลน์",
    bodyContact: "เปิดกล้องหรือไลน์บนมือถือแล้วสแกน จะเข้าแชทของร้านทันที",
    body: "เปิดกล้องหรือไลน์บนมือถือแล้วสแกน แชทร้านจะเปิดพร้อมข้อความนี้ กดส่งได้เลย",
    messageLabel: "ข้อความที่จะส่ง",
    copy: "ก็อปข้อความ",
    copied: "ก็อปแล้ว",
    close: "ปิด",
    addFriend: "หรือเพิ่มเพื่อนไลน์",
    leadOrder: "สนใจสั่ง",
    leadAsk: "สอบถาม",
    optionLabel: "ตัวเลือก",
    codeLabel: "รหัส",
    touchHint: "กดแล้วเปิดไลน์ร้านพร้อมข้อความสินค้า กดส่งได้เลย",
    mouseHint: "กดแล้วขึ้น QR ให้สแกนด้วยมือถือ แชทร้านเปิดพร้อมข้อความสินค้า",
  },
  en: {
    titleOrder: "Scan to order on LINE",
    titleAsk: "Scan to ask on LINE",
    titleContact: "Scan to chat with us on LINE",
    bodyContact: "Scan with your phone camera or LINE — our chat opens, ready for your message.",
    body: "Scan with your phone camera or LINE — our chat opens with this message ready to send.",
    messageLabel: "Your message",
    copy: "Copy message",
    copied: "Copied",
    close: "Close",
    addFriend: "Or add us on LINE",
    leadOrder: "I'd like to order",
    leadAsk: "Asking about",
    optionLabel: "Option",
    codeLabel: "Code",
    touchHint: "Opens our LINE chat with this product's message — just tap send.",
    mouseHint: "Shows a QR to scan with your phone — our LINE chat opens with this product's message.",
  },
  zh: {
    titleOrder: "扫码用 LINE 下单",
    titleAsk: "扫码用 LINE 咨询",
    titleContact: "扫码用 LINE 联系我们",
    bodyContact: "用手机相机或 LINE 扫码，即可打开本店聊天。",
    body: "用手机相机或 LINE 扫码，打开本店聊天，消息已填好，直接发送即可。",
    messageLabel: "将发送的消息",
    copy: "复制消息",
    copied: "已复制",
    close: "关闭",
    addFriend: "或添加 LINE 好友",
    leadOrder: "想订购",
    leadAsk: "咨询",
    optionLabel: "选项",
    codeLabel: "编号",
    touchHint: "点击后打开本店 LINE 聊天，商品消息已填好，直接发送即可。",
    mouseHint: "点击后显示二维码，用手机扫码即可打开本店 LINE 聊天，商品消息已填好。",
  },
};
