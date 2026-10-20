/**
 * OKami24 — round 30.3ข (owner, 2026-09-11): the Thai <title> templates for the generated pages.
 *
 * Why Thai, and why one string: the site renders Thai for every first visit (DEFAULT_LOCALE), and
 * a crawler sends no language cookie, so the server-side <title>/meta IS what Google shows. The
 * owner ruled the title stays a single server string (no per-language tab title — considered and
 * rejected, see docs/THAI_STYLE.md §6) — so these templates produce Thai, and the model/brand name
 * inside stays English (THAI_STYLE §2 layer 1).
 *
 * The layout appends " — OKami24" to every title (src/app/layout.tsx `title.template`); the
 * ceilings the owner set (~55–60 characters for a title) are measured INCLUDING that suffix —
 * the longest product title this produces is 54 (checked over all 53 storefront products).
 */

/** The locked Thai word for each category (THAI_STYLE §3) — the word a customer would type. */
const CATEGORY_WORD_TH: Record<string, string> = {
  "pod-systems": "พอตซิสเต็ม",
  "switch-pods": "พอตเปลี่ยนหัว",
  disposables: "พอตใช้แล้วทิ้ง",
  "pods-cartridges": "หัวพอต",
  "coils-accessories": "คอยล์",
  "e-liquid": "น้ำยา",
  // Heated-tobacco products carry "IQOS" in the model name already — no category word is added,
  // "IQOS iluma Prime เครื่อง IQOS" would repeat itself.
};

/**
 * "{model name} {category word} ของแท้" — the model name leads because that is what people type
 * into Google, and Google truncates the end of a title, not the start.
 * The category word is skipped when the name already says what the thing is: any Thai letters
 * (Shipnity names such as "หัวเปล่า Voopoo PnP-X"), or an English "Coil"/"Pod" in the name —
 * otherwise "VOOPOO Coil Vinci คอยล์".
 * SEO all keys (20/10, owner lifted the 22/10 hold): the retired "พอตคิท" no longer overrides the category word — VOOPOO
 * refill devices read "พอตซิสเต็ม", switch devices "พอตเปลี่ยนหัว" (owner 19/10 category restructure).
 */
export function productTitleTh(displayName: string, categoryId: string): string {
  const word = CATEGORY_WORD_TH[categoryId];
  const nameSaysWhatItIs = /[฀-๿]/.test(displayName) || /\b(coil|pod)s?\b/i.test(displayName);
  return word && !nameSaysWhatItIs ? `${displayName} ${word} ของแท้` : `${displayName} ของแท้`;
}

/** "{BRAND} ของแท้ทุกรุ่นที่ร้านมี" — "ที่ร้านมี" because several brands have a single product
 *  on the storefront; a bare "ทุกรุ่น" would promise more than the page shows. */
export function brandTitleTh(brandName: string): string {
  return `${brandName} ของแท้ทุกรุ่นที่ร้านมี`;
}
