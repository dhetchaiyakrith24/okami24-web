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
  en: "Right now the easier way to order is LINE @okm24: message us the model, colour or flavour you want, and the admin confirms the total and how to pay in the chat. Once the payment is checked, the order ships with a tracking number. Shipping is 50 baht, free on orders from 500 baht up. Want help picking a model? Just ask.",
  th: "ช่วงนี้สั่งผ่านไลน์ @okm24 สะดวกกว่า ทักมาบอกรุ่น สี หรือกลิ่นที่ต้องการ แอดมินสรุปยอดและวิธีโอนให้ในแชท จ่ายแล้วแอดมินตรวจยอดโอนก่อน แล้วจึงจัดส่งพร้อมเลขพัสดุให้ติดตาม ค่าส่ง 50 บาท ยอด 500 บาทขึ้นไปส่งฟรี อยากให้ช่วยเลือกรุ่นก็ทักมาได้เลย",
  zh: "这段时间用 LINE @okm24 下单更方便：告诉店主想要的型号、颜色或口味，店主会在聊天里确认总价和付款方式。核对到账后安排出货，并提供物流单号查询。运费 50 泰铢，满 500 泰铢免运费。想让店主帮忙挑型号也可以直接问。",
};
/** The FAQ id whose answer `ORDERING_ON_LINE_FAQ_ANSWER` replaces. */
export const ORDERING_FAQ_ID = "what-is-this-site";

export const siteFaqs: SiteFAQ[] = [
  {
    id: "what-is-this-site",
    category: "ordering",
    question: "How do I actually order from OKami24?",
    answer:
      "Add what you want to the cart, verify your phone number with the OTP code, enter your delivery address, and confirm the order. Then pay by bank transfer or QR scan — once an admin has checked the payment, the order is approved and shipped with a tracking number. Shipping is 50 baht, free on orders from 500 baht up. If a product isn't buyable on the site yet, or you'd like help picking a model, message us on LINE @okm24.",
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
      "They are two names for one line: many Thai shops list the M Bar, M Switch and Zero devices under the name Marbo. Salthub's own site carries the Marbo logo in its footer. For what is in stock right now, ask on LINE @okm24.",
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
