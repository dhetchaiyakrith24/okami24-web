import type { Metadata } from "next";
import { assertPreviewAllowedInThisEnvironment } from "@/app/preview/product-master/_components/preview-guard";
import { ClaimsPolicyContent } from "@/components/content/service-pages/ClaimsPolicyContent";

/**
 * CLAIMS POLICY — DRAFT, NOT PUBLISHED (owner instruction 2026-09-06; BSOT §12 says the exact
 * wording must be reviewed before it goes live). Lives under /preview/ on purpose: production
 * build → notFound(), robots disallow /preview/, no link from any navigation, not in the sitemap.
 *
 * 2026-09-06 evening: answers 13–17 are in (outcome, shipping, return, 3 working days, no factory
 * warranty). The only open item is 12 — which symptoms are accepted / rejected — which the owner
 * ticks from the list on this page. When that lands the page moves to /warranty (owner wording),
 * the sitemap and the footer help column, and `draft` is dropped.
 * Body rendered in th/en/zh by ClaimsPolicyContent from src/i18n/service-pages/claims-policy.tsx.
 */
export const metadata: Metadata = {
  title: "นโยบายเคลม (ร่าง)",
  description: "ร่างนโยบายเคลมสินค้า OKami24 — ยังไม่เผยแพร่ รอเจ้าของอนุมัติ",
  robots: { index: false, follow: false },
};

export default function ClaimsPolicyDraftPage() {
  assertPreviewAllowedInThisEnvironment();
  return <ClaimsPolicyContent draft />;
}
