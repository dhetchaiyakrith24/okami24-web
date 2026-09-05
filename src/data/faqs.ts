import type { SiteFAQ } from "@/types/catalog";

// Owner review (2026-09-03) — "FAQ must become actionable": each `action` below is added only
// where the question naturally leads somewhere useful (judgment call per item, not a blanket
// CTA). See FAQAction's own doc comment in types/catalog.ts for why labels are keyed, not raw text.
export const siteFaqs: SiteFAQ[] = [
  {
    id: "what-is-this-site",
    category: "ordering",
    question: "How do I actually order from OKami24?",
    answer:
      "Add what you want to the cart, verify your phone number with the OTP code, enter your delivery address, and confirm the order. Then pay by bank transfer or QR scan — once an admin has checked the payment, the order is approved and shipped with a tracking number. Shipping is 60 baht, free on orders from 500 baht up. If a product isn't buyable on the site yet, or you'd like help picking a model, message us on LINE @okm24.",
    // Owner decision (2026-09-06): the site has a real cart now, so the ordering FAQ sends people
    // to the catalog instead of LINE. LINE stays the fallback inside the answer text itself.
    action: { href: "/products", labelKey: "browseProductsCta" },
  },
  {
    id: "where-specs-come-from",
    category: "devices",
    question: "Where do the product specifications come from?",
    answer:
      "Specifications are sourced from official brand pages and cross-checked against secondary retailer/review listings where the official page wasn't directly accessible. Every spec is labeled verified or unverified — unverified fields are shown rather than guessed.",
  },
  {
    id: "unverified-meaning",
    category: "devices",
    question: "What does an \"unverified\" spec label mean?",
    answer:
      "It means that specific figure could not be independently confirmed against an official or reliable source during research. It's shown as a placeholder for completeness rather than omitted, but should not be treated as confirmed.",
  },
  {
    id: "open-vs-disposable-faq",
    category: "devices",
    question: "What's the real difference between an open-system pod and a disposable?",
    answer:
      "An open-system pod is refilled with e-liquid you buy separately and uses replaceable coil pods; a disposable arrives prefilled and is used until the puff count or e-liquid runs out. See the Open-System vs. Disposable guide for a full breakdown.",
    action: { href: "/guides/open-system-vs-disposable", labelKey: "viewGuideCta" },
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
