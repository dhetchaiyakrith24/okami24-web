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
  "coil-53": { tagline: "UWELL Caliburn G-series coil, 0.8 / 1.0 / 1.2Ω" },
  "coil-92": { tagline: "VOOPOO PnP X replacement coil" },
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
  "iqosheet-14": { tagline: "LAMBDA i8 induction heat-not-burn device" },
  "iqosheet-15": { tagline: "TEREA sticks for IQOS ILUMA, priced per pack of 20" },
  "iqosheet-16": { tagline: "IQOS ILUMA i PRIME heated tobacco device" },
  "iqosheet-17": { tagline: "IQOS ILUMA i ONE all-in-one heated tobacco device" },
  "iqosheet-18": { tagline: "IQOS ILUMA i heated tobacco device" },
  "pod-150": { tagline: "KS Quikpro replacement cartridge, 15ml" },
  "ks-quikpro-kit": { tagline: "KS Quikpro device with one 15ml cartridge" },
  "pod-149": { tagline: "SKE Crystal B20000 disposable" },
  "eliquid-1": { tagline: "Marbo Saltnic e-liquid, 30ml bottle" },
  "eliquid-109": { tagline: "Marbo Freebase e-liquid, tall bottle" },
  "eliquid-72": { tagline: "Pepo salt nic e-liquid" },
  "eliquid-73": { tagline: "Dundu salt nic e-liquid" },
  "pod-154": { tagline: "Pop Up 10K refill pod" },
  "pod-142": { tagline: "Reswa Sportcan 12K disposable" },
  "nexswitch-16k-kit": { tagline: "Nexswitch kit with one pod" },
  "nexswitch-16k-pod": { tagline: "Nexswitch 16K refill pod" },
  "relx-lumi-18k": { tagline: "RELX LUMI 18K disposable" },
  "esko-bar-20k": { tagline: "ESKO BAR 20000-puff disposable, 600mAh, 18ml" },
  "pod-169": { tagline: "INFY PLUS prefilled pod cartridge, 2.5ml" },
  "pod-159": { tagline: "Esko Bar Switch 20K kit by ESKO BAR" },
  "esko-bar-switch-pod": { tagline: "ESKO BAR SWITCH 20K refill pod" },
  "graple-freebase": { tagline: "Graple freebase e-liquid" },
  "super-cool-saltnic": { tagline: "Super Cool salt nic e-liquid" },
  "infy-pod": { tagline: "INFY POD device body" },
  "pod-180": { tagline: "nexBar CLEAR 18K disposable" },
  "coil-54": { tagline: "Feelin Mini pod by NEVOKS" },
};

/** The tagline a non-Thai visitor should read for a ProductMaster product: the English overlay
 *  when one exists, otherwise the Thai source line (never blank, never a machine translation). */
export function pilotTagline(slug: string, thaiTagline: string, locale: string): string {
  if (locale === "th") return thaiTypography(thaiTagline);
  return PRODUCT_COPY_EN[slug]?.tagline ?? thaiTagline;
}
