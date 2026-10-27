import type { Locale } from "@/i18n/config";

/**
 * A short note shown under the product name on every screen size (the tagline is hidden on phones). Only the one lookalike
 * has one (owner 27/10, docs/HANDOFF.md §18: "a clear line on the page that it is a เทียบแท้ item, not SALTHUB").
 * Wording = thai-copy 27/10 (Thai "เทียบแท้ ไม่ใช่สินค้าของ SALTHUB"; English "clone, not made by SALTHUB"; Chinese
 * "仿款，非 SALTHUB 出品").
 */
export const PRODUCT_NOTICE: Record<string, Record<Locale, string>> = {
  "marbo-10k-clone": { th: "สินค้าเทียบแท้ ไม่ใช่สินค้าของ SALTHUB", en: "Clone, not made by SALTHUB", zh: "仿款，非 SALTHUB 出品" },
};
