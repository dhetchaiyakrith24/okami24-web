/**
 * OKami24 — round 30.3: English taglines for ProductMaster (Shipnity-sourced) products.
 *
 * The mirror image of `product-copy-th.ts`. Legacy products are written in English with a Thai
 * overlay; ProductMaster products are written in Thai (`MINIMUM_COPY` in
 * `active-catalog-to-product-master.ts`, built from the product's own Shipnity name) and until this
 * round had no English at all, so the English and Chinese storefront showed the Thai line. This is
 * the presentation-layer overlay for that: keyed by `StorefrontProductView.slug`, read by
 * `PilotProductCard` and `PilotProductDetail` whenever the locale is not Thai, English serving
 * Chinese too (there is no Chinese product copy anywhere on the site). A slug with no entry keeps
 * showing the Thai line — exactly what every visitor saw before this file existed.
 *
 * Wired empty on 2026-09-10 (owner decision) and filled in round 30.3ข (owner-approved table,
 * 2026-09-11): a straight translation of the Thai line only — no new claims, specs or numbers.
 * "จากแบรนด์ X" → "by X" throughout; "หัวพอต" → "pod" (every one of these is a refillable pod, so
 * none qualifies as "cartridge"); a model name that already contains "Pod" is not doubled.
 */

export interface ProductCopyEn {
  tagline: string;
}

import { thaiTypography } from "@/lib/thai-typography";

export const PRODUCT_COPY_EN: Record<string, ProductCopyEn> = {
  "coil-1": { tagline: "Vinci coil by VOOPOO" },
  "coil-38": { tagline: "TPP coil by VOOPOO" },
  "coil-53": { tagline: "Caliburn G coil (1.0Ω) by UWELL, works with Caliburn G2" },
  "coil-55": { tagline: "Caliburn G2 empty pod by UWELL" },
  "coil-56": { tagline: "Voopoo PnP-X pod" },
  "coil-68": { tagline: "ITO-X pod by VOOPOO" },
  "coil-70": { tagline: "Dotmod Aio V2 coil by DOTMOD" },
  "coil-72": { tagline: "Vmate Infinity Edition pod by VOOPOO" },
  "coil-74": { tagline: "Caliburn X empty pod by UWELL" },
  "coil-83": { tagline: "Argus P1 empty pod by VOOPOO" },
  "coil-87": { tagline: "Voopoo TPP Pod (empty pod)" },
  "coil-89": { tagline: "Jellybox V pod by RINCOE" },
  "coil-94": { tagline: "Caliburn G4&G3 Series pod by UWELL" },
  "iqosheet-16": { tagline: "IQOS ILUMA i PRIME heated tobacco device" },
  "iqosheet-17": { tagline: "IQOS ILUMA i ONE all-in-one heated tobacco device" },
  "iqosheet-18": { tagline: "IQOS ILUMA i heated tobacco device" },
  "pod-159": { tagline: "Esko Bar Switch 20K kit by ESKO BAR" },
  "pod-180": { tagline: "nexBar CLEAR 18K disposable" },
  "coil-54": { tagline: "Feelin Mini pod by NEVOKS" },
};

/** The tagline a non-Thai visitor should read for a ProductMaster product: the English overlay
 *  when one exists, otherwise the Thai source line (never blank, never a machine translation). */
export function pilotTagline(slug: string, thaiTagline: string, locale: string): string {
  if (locale === "th") return thaiTypography(thaiTagline);
  return PRODUCT_COPY_EN[slug]?.tagline ?? thaiTagline;
}
