import type { SiteFAQ } from "@/types/catalog";
import { CONTACT } from "@/data/contact";

// Owner review (2026-09-03) — "FAQ must become actionable": each `action` below is added only
// where the question naturally leads somewhere useful (judgment call per item, not a blanket
// CTA). See FAQAction's own doc comment in types/catalog.ts for why labels are keyed, not raw text.
/**
 * The "how do I order" answer while online ordering is OFF (OKAMI24_ORDERING — owner 2026-09-07,
 * approved as one of three wording exceptions to the "do not touch site text" rule). The English
 * answer below stays canonical and untouched; FAQAccordion swaps in this one, per locale, only
 * while the cart is off, so switching ordering back on restores the original with no edit.
 * Shipping figures are the same ones the original answer already states.
 */
export const ORDERING_ON_LINE_FAQ_ANSWER: Record<"en" | "th" | "zh", string> = {
  en: "Right now the easier way to order is LINE @okm24: message us the model, colour or flavour you want, and the admin confirms the total and how to pay in the chat. Once the payment is checked, the order ships with a tracking number. Shipping is 50 baht. Orders of 500 baht and over ship for 0 baht once a month, and a member’s first order (sign in with LINE or Google) ships for 0 baht whatever the total. Want help picking a model? Just ask.",
  th: "ช่วงนี้สั่งผ่านไลน์ @okm24 สะดวกกว่า ทักมาบอกรุ่น สี หรือกลิ่นที่ต้องการ แอดมินสรุปยอดและวิธีโอนให้ในแชท จ่ายแล้วแอดมินตรวจยอดโอนก่อน แล้วจึงจัดส่งพร้อมเลขพัสดุให้ติดตาม ค่าส่งปกติ 50 บาท ยอดครบ 500 บาท ค่าส่ง 0 บาทเดือนละครั้ง และสมาชิกที่เข้าสู่ระบบด้วย LINE หรือ Google ออเดอร์แรกค่าส่ง 0 บาททุกยอดสั่งซื้อ อยากให้ช่วยเลือกรุ่นก็ทักมาได้เลย",
  zh: "这段时间用 LINE @okm24 下单更方便：告诉店主想要的型号、颜色或口味，店主会在聊天里确认总价和付款方式。核对到账后安排出货，并提供物流单号查询。运费 50 泰铢；满 500 泰铢每月可享一次运费 0 泰铢；用 LINE 或 Google 登录的会员，首单不论金额运费 0 泰铢。想让店主帮忙挑型号也可以直接问。",
};
/** The FAQ id whose answer `ORDERING_ON_LINE_FAQ_ANSWER` replaces. */
export const ORDERING_FAQ_ID = "what-is-this-site";

/**
 * Every FAQ answer that reads differently while online ordering is OFF (Q7b, 26/10 — THAI_STYLE "ตะกร้าเปิดแล้ว" line: text that
 * points to the cart must follow the OKAMI24_ORDERING switch). The canonical answers (siteFaqs / FAQ_COPY_TH / FAQ_COPY_ZH) are the
 * cart-on wording; these are swapped in only while the cart is off. "where-to-buy" keeps the LINE wording it had before 24/10.
 */
export const ORDERING_OFF_ANSWERS: Record<string, Record<"en" | "th" | "zh", string>> = {
  [ORDERING_FAQ_ID]: ORDERING_ON_LINE_FAQ_ANSWER,
  "where-to-buy": {
    en: "Right here at OKami24. Browse the models, prices, colours and flavours on this site first, then message us on LINE @okm24 with the one you want — the admin checks stock and confirms the total in the chat. We deliver anywhere in Thailand, and every order comes with a tracking number. LINE is open every day, 24 hours.",
    th: "สั่งออนไลน์กับ OKami24 ได้เลย เลือกดูรุ่น ราคา สี และกลิ่นบนเว็บนี้ได้ก่อน แล้วทักไลน์ @okm24 บอกรุ่นที่ต้องการ แอดมินจะเช็คของและสรุปยอดให้ในแชท เราจัดส่งถึงบ้านทั่วประเทศไทย และทุกคำสั่งซื้อมีเลขพัสดุให้ติดตาม ทักได้ทุกวัน ตลอด 24 ชั่วโมงค่ะ",
    zh: "可以直接在 OKami24 网上购买。先在本站看好型号、价格、颜色和口味，再通过 LINE @okm24 告诉我们想要哪一款，管理员会确认库存并在聊天中报上总价。我们配送泰国全境，每笔订单都附快递单号。LINE 每天 24 小时都可以联系。",
  },
};

export const siteFaqs: SiteFAQ[] = [
  {
    id: "what-is-this-site",
    category: "ordering",
    question: "How do I actually order from OKami24?",
    answer:
      "Add what you want to the cart, enter your mobile number and delivery address, and confirm the order. Then pay by bank transfer or QR scan and attach the slip on your order page — once an admin has checked the payment, the order is approved and shipped with a tracking number. Shipping is 50 baht. Orders of 500 baht and over ship for 0 baht once a month, and a member’s first order (sign in with LINE or Google) ships for 0 baht whatever the total. If a product isn't buyable on the site yet, or you'd like help picking a model, message us on LINE @okm24.",
    // Owner decision (2026-09-06): the site has a real cart now, so the ordering FAQ sends people
    // to the catalog instead of LINE. LINE stays the fallback inside the answer text itself.
    action: { href: "/products", labelKey: "browseProductsCta" },
  },
  // Round 8 B2 (owner ruling 2026-09-23, round-7 close item 5): wholesale = "contact us on LINE",
  // no minimum, no discount, no price — the business source of truth has no wholesale section.
  {
    id: "wholesale-orders",
    category: "ordering",
    question: "How do I order a case or a large quantity?",
    answer:
      "Message @okm24 on LINE and tell us the model and the quantity you want — the admin checks stock and replies in the chat. The line is open every day, 24 hours.",
    action: { href: CONTACT.lineUrl, labelKey: "contactLineCta" },
  },
  // Round "SEO all keys" batch 6 (16/10, SEO_LANDSCAPE §9.4): "ซื้อพอตที่ไหน" + the two questions BSOT §16 lists as asked
  // most ("ส่งกี่วัน" · "ถ้าสินค้ามีปัญหารับผิดชอบไหม"). Facts: BSOT §3 (LINE every day, 24 h) · §8 · §10 · §12 — the claim
  // answer points at /warranty instead of listing symptoms, so no "not covered" line is softened.
  {
    id: "where-to-buy",
    category: "ordering",
    question: "Where can I buy a pod online and have it delivered?",
    answer:
      "Right here at OKami24. Pick the model, colour or flavour you want on this site, add it to the cart and place the order straight away — no need to message us first. We deliver anywhere in Thailand, and every order comes with a tracking number. If you’d like help choosing, message us on LINE @okm24 — any day, 24 hours.",
    action: { href: "/how-to-order", labelKey: "howToOrder" },
  },
  {
    id: "shipping-time",
    category: "ordering",
    question: "How long does delivery take?",
    answer:
      "Transfer and send your slip before 12:30 and we ship the same day; after 12:30 it goes out the next working day. We ship Monday to Saturday, not on Sundays or public holidays. Once it’s out, it arrives within 1–3 days, with a tracking number you can follow.",
    action: { href: "/shipping", labelKey: "shipping" },
  },
  {
    id: "problem-on-arrival",
    category: "ordering",
    question: "What if something’s wrong with my order when it arrives?",
    answer:
      "You can claim with us within 7 days of receiving it, and an unboxing video is required as evidence. If the claim is approved we send you a new one of the same item — or, if that’s out of stock, another item at the same price. There’s no cash refund, with one exception: an item that fails the authenticity check on the brand’s official website. In that case, send us the result and your unboxing video on LINE; once we’ve looked into it, we’ll let you know whether we replace it or refund you. The claims page lists exactly which problems are covered.",
    action: { href: "/warranty", labelKey: "warranty" },
  },
  {
    id: "where-specs-come-from",
    category: "devices",
    question: "Where do the product specifications come from?",
    answer:
      // Owner 05/10 + HANDOFF §18 06/10 pm / "Product facts": maker sources only, unverified rows hidden — the old answer
      // (retailer cross-checks, unverified rows shown) and the "unverified-meaning" entry described the retired process.
      "The specs on a product page come mainly from the maker's own material — its official site, posters and manuals. Every row's source is checked before it goes on the page.",
  },
  {
    id: "open-vs-disposable-faq",
    category: "devices",
    question: "What's the real difference between an open-system pod and a disposable?",
    answer:
      "An open-system pod is refilled with e-liquid you buy separately and uses replaceable coil pods; a disposable arrives prefilled and is used until the puff count or e-liquid runs out. See the Open-System vs. Disposable guide for a full breakdown.",
    action: { href: "/guides/open-system-vs-disposable", labelKey: "viewGuideCta" },
  },
  // Round 8 B2 (owner ruling 2026-09-23 "both Marbo and M Bar must rank"): only the two facts a
  // source supports — other shops use the name Marbo for this line, and salthub.com's own footer
  // shows the Marbo logo (_incoming/round8/researcher-1-result.md rows 1, 2, 3a). Who makes or
  // distributes what is NOT stated: no source found (row 3c).
  {
    id: "marbo-vs-m-bar",
    category: "devices",
    question: "Is Marbo the same thing as M Bar?",
    answer:
      "They are two names for one line: many Thai shops list the M Bar, M Switch and Zero devices under the name Marbo. Salthub's own site carries the Marbo logo in its footer.",
    action: { href: CONTACT.lineUrl, labelKey: "contactLineCta" },
  },
  {
    id: "nicotine-strength-meaning",
    category: "e-liquid",
    question: "What does a nicotine strength like \"30mg\" mean?",
    answer:
      "It refers to the concentration of nicotine in the e-liquid, typically expressed in milligrams per millilitre. Higher numbers mean a stronger nicotine hit per puff — this site does not offer nicotine-free versus nicotine-containing purchasing, only informational labeling where confirmed.",
  },
  {
    id: "flavor-family-meaning",
    category: "e-liquid",
    question: "What are the flavor families on the E-Liquid pages?",
    answer:
      "They're editorial groupings (Fruit, Menthol & Cooling, Dessert, Beverage, Tobacco-Style) used to organize flavor character, not a catalog of specific branded e-liquid products.",
    action: { href: "/e-liquid", labelKey: "eliquid" },
  },
  {
    id: "age-gate-why",
    category: "safety",
    question: "Why is there an age gate on this site?",
    answer:
      "Nicotine and vaping products are age-restricted. Confirming you're 21+ before browsing is a standard, responsible-presentation practice for this category.",
  },
  {
    id: "health-claims",
    category: "safety",
    question: "Does this site make any health or safety claims about vaping?",
    answer:
      "No. This site does not claim vaping is safe, harmless, or a cessation method, and does not make comparative health claims against smoking. It presents devices, specifications, and buying guidance only.",
  },
  {
    id: "compare-winner",
    category: "devices",
    question: "Does the Compare tool declare a \"best\" product?",
    answer:
      "No. Compare highlights differences between the products you select and notes which type of user each one tends to fit better — it deliberately avoids declaring a universal winner.",
    action: { href: "/compare", labelKey: "compare" },
  },
  {
    id: "favorites-account",
    category: "account",
    question: "Do I need an account to use Favorites?",
    answer:
      "No. Favorites is stored locally in your browser — it's saved only on your device and isn't tied to any account or server-side profile yet.",
    action: { href: "/favorites", labelKey: "favorites" },
  },
];

export function faqsByCategory(category: SiteFAQ["category"]): SiteFAQ[] {
  return siteFaqs.filter((f) => f.category === category);
}
