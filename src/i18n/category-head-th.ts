import type { Category } from "@/types/catalog";

/**
 * A category page's Thai H1 + lede where the shop's search key is not its menu label (owner 12/11 ~03:40 "พอตซิสเต็ม
 * เปลี่ยนได้ถ้าคนค้นหาน้อยกว่า พอตไฟฟ้า … ถ้าเกี่ยว SEO จัดการเลย"; SEO_LANDSCAPE §0.1 พอตไฟฟ้า 4,400/mo, "พอตซิสเต็ม" no search
 * demand; every page-1 competitor's category H1 says "พอตไฟฟ้า"). seo-auditor 12/11: `labelTh` itself stays — it feeds the
 * menu, the home category table and on-site search ("พอตซิสเต็ม" must keep finding these devices) — so only this page's
 * H1, lede/meta, CollectionPage name and its BreadcrumbList crumb read the override. "Pod System" stays first in the H1
 * (owner 08/10: the shop's biggest key). The lede keeps the facts of `descriptionTh` (same models), led by the key.
 * Small and table-free on purpose: CategoryPageHeader (client) imports it.
 */
const OVERRIDE: Record<string, { label: string; lede: string }> = {
  "pod-systems": {
    label: "Pod System / พอตไฟฟ้า",
    lede: "พอตไฟฟ้าแบบเติมน้ำยาเอง เปลี่ยนหัวพอตหรือคอยล์ได้ มีตระกูล Caliburn ของ UWELL กับ ARGUS DRAG VINCI และ VMATE ของ VOOPOO บางรุ่นตั้งวัตต์เองได้ด้วย",
  },
};

/** The Thai H1 (and schema name) of a category page. */
export function categoryPageLabelTh(category: Pick<Category, "id" | "labelTh">): string {
  return OVERRIDE[category.id]?.label ?? category.labelTh;
}

/** The Thai lede (also the meta description and the CollectionPage description) of a category page. */
export function categoryPageLedeTh(category: Pick<Category, "id" | "descriptionTh">): string {
  return OVERRIDE[category.id]?.lede ?? category.descriptionTh;
}
