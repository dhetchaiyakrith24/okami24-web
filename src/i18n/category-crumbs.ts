import type { Locale } from "@/i18n/config";

/**
 * Breadcrumb words (owner 12/11 ~03:40, replacing the 09-11 "breadcrumb stays English" ruling): the navigation word and the
 * category name read Thai; brand and model names stay English ("ของบางอย่าง Eng ดีกว่าเช่น ชื่อแบรน รุ่น") — e.g.
 * หน้าแรก / พอตเปลี่ยนหัว / RELX Infinity 2 Plus. The Thai string is also the BreadcrumbList `name` Google reads (the visible
 * trail and the schema say the same thing); en/zh visitors see their language, switched in the browser (CategoryCrumbText).
 * Category names = the Thai half of each category's labelTh, except pod-systems: "พอตไฟฟ้า" (SEO_LANDSCAPE §0.1 4,400/mo; "พอตซิสเต็ม"
 * has no search demand of its own — owner 12/11 "ถ้าเกี่ยว SEO จัดการเลย"). Never derived from shortName/categoryName, which feed
 * Product.category, the compare table, search and the footer (seo-auditor 12/11). Words checked by thai-copy 12/11.
 */
export type Crumb = Record<Locale, string>;

export const ROOT_CRUMB: Crumb = { th: "หน้าแรก", en: "Home", zh: "首页" };

export const CATEGORY_CRUMBS: Record<string, Crumb> = {
  "pod-systems": { th: "พอตไฟฟ้า", en: "Pod Systems", zh: "烟弹系统" },
  "switch-pods": { th: "พอตเปลี่ยนหัว", en: "Switch Pods", zh: "换弹式设备" },
  disposables: { th: "พอตใช้แล้วทิ้ง", en: "Disposables", zh: "一次性电子烟" },
  "pods-cartridges": { th: "หัวพอต", en: "Pods", zh: "烟弹" },
  "coils-accessories": { th: "คอยล์และอุปกรณ์เสริม", en: "Coils & Accessories", zh: "雾化芯与配件" },
  "e-liquid": { th: "น้ำยา", en: "E-Liquid", zh: "烟油" },
  "heated-tobacco-devices": { th: "เครื่องจ่ายความร้อน", en: "HNB Devices", zh: "加热烟草设备" },
  "heated-tobacco-consumables": { th: "บุหรี่ TEREA", en: "HNB Sticks", zh: "TEREA 烟支" },
};

/** The Thai crumb of a category (the schema name and the server HTML); `fallback` only for a category not listed here. */
export function categoryCrumbTh(categoryId: string, fallback: string): string {
  return CATEGORY_CRUMBS[categoryId]?.th ?? fallback;
}
