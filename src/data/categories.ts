import type { Category } from "@/types/catalog";

export const categories: Category[] = [
  {
    id: "pod-systems",
    slug: "pod-systems",
    name: "Open-System Pod Devices",
    shortName: "Pod Systems",
    labelTh: "Pod System / พอตซิสเต็ม",
    description:
      "Fill your own e-liquid, swap the pod or coil, pick the ohms: the UWELL Caliburn family plus VOOPOO ARGUS, DRAG, VINCI and VMATE, some with settable wattage.",
    descriptionTh:
      "พอตซิสเต็มคือพอตที่เติมน้ำยาเอง และเปลี่ยนหัวพอตหรือคอยล์ได้ มีตระกูล Caliburn ของ UWELL กับ ARGUS DRAG VINCI และ VMATE ของ VOOPOO บางรุ่นตั้งวัตต์เองได้ด้วย",
    systemTypes: ["open-pod", "pod-kit"],
  },
  // Owner 19/10 ("พอตคิทรวม pod system" + "เพิ่มหัวข้อ พอตเปลี่ยนหัว"): the old "pod-kits" category is retired. Its
  // refillable devices (VOOPOO ARGUS · DRAG · VINCI · VMATE) joined pod-systems above, and /products/pod-kits redirects
  // there (next.config.ts) — GSC split the bare query "pod" between the two pages. This one holds the devices you keep
  // while swapping PREFILLED pods, never filling (maker pages checked 19/10: M Switch · Zero · RELX Infinity 2 Plus ·
  // RELX Creator · nexPOD 15K · ESKO BAR SWITCH · KS Quikpro; Nexswitch 16K has no maker page — warehouse facts). Their
  // pods stay in pods-cartridges.
  {
    id: "switch-pods",
    slug: "switch-pods",
    name: "Switch Pod Devices",
    shortName: "Switch Pods",
    labelTh: "Switch Pod / พอตเปลี่ยนหัว",
    description: "Keep the device, swap the pod. Each pod comes prefilled, so there's nothing to fill and no device to throw away. From SALTHUB, RELX, ESKO BAR, WOTOFO and KS.",
    descriptionTh: "พอตเปลี่ยนหัว เก็บตัวเครื่องไว้ใช้ต่อ แล้วเปลี่ยนแค่หัวพอตบรรจุสำเร็จ ไม่ต้องเติมน้ำยาเอง และไม่ต้องทิ้งทั้งเครื่อง มีทั้ง SALTHUB RELX ESKO BAR WOTOFO และ KS",
    systemTypes: ["pod-kit"],
  },
  {
    id: "disposables",
    slug: "disposables",
    name: "Disposable / Prefilled",
    shortName: "Disposables",
    labelTh: "Disposable / พอตใช้แล้วทิ้ง",
    description:
      "Ready out of the box, nothing to fill; most can be recharged until the e-liquid runs out. M Bar, RELX and JOIWAY differ mainly in puff count and battery size.",
    descriptionTh:
      "พอตใช้แล้วทิ้ง แกะกล่องใช้ได้เลย ไม่ต้องเติมน้ำยา ส่วนใหญ่ชาร์จซ้ำได้จนน้ำยาหมด ตอนนี้มีทั้ง M Bar RELX และ JOIWAY ต่างกันหลัก ๆ ที่จำนวนพัฟกับขนาดแบต",
    systemTypes: ["disposable"],
  },
  {
    id: "pods-cartridges",
    slug: "pods-cartridges",
    name: "Pods & Cartridges",
    shortName: "Pods",
    labelTh: "Pods & Cartridges / หัวพอต",
    // Round SEO ฉ batch 3 (12/10): this lede is also the meta — it now names "หัวพอตเปล่า" (people type it; the page sat at
    // pos 5.2 with 0/112 clicks) and every brand the page lists (NEVOKS coil-54, RINCOE coil-89). thai-copy + seo-auditor 12/10.
    // Order of the three kinds re-cut after the checker (12/10): the first cut broke "คอยล์ใน|ตัว" at 1440 — this one was
    // measured at the lede's 350 px (390) and 672 px (1440) widths with no break inside a word.
    description:
      "Replacement pods from UWELL, VOOPOO, SALTHUB, NEVOKS and RINCOE: empty, with a built-in coil, or prefilled for switch-style devices. Check the model before ordering.",
    descriptionTh:
      "หัวพอตของ UWELL VOOPOO SALTHUB NEVOKS และ RINCOE มีทั้งหัวพอตเปล่า แบบที่มีคอยล์ในตัว และแบบบรรจุสำเร็จของเครื่องระบบสวิตช์ เช็คให้ตรงรุ่นเครื่องก่อนสั่ง",
    systemTypes: ["pod-cartridge"],
  },
  {
    id: "coils-accessories",
    slug: "coils-accessories",
    name: "Coils & Accessories",
    shortName: "Coils & Accessories",
    labelTh: "Coils & Accessories / คอยล์และอุปกรณ์เสริม",
    // Round SEO ฉ batch 3 (12/10): opens with "คอยล์พอต" (in no head before; the shop's clip ranks #4 for it). RINCOE left:
    // no RINCOE coil is on this page (Coil-63 withdrawn 06/09, Coil-89 moved to pods-cartridges).
    description:
      "Genuine replacement pod coils from UWELL, VOOPOO and DOTMOD. Match your device model first, then pick ohms by how you vape: lower is airier, higher is tighter.",
    descriptionTh:
      "คอยล์พอตของแท้สำหรับเปลี่ยน มีให้เลือกทั้ง UWELL VOOPOO และ DOTMOD เลือกให้ตรงรุ่นเครื่องก่อน แล้วค่อยเลือกโอห์มตามแนวการสูบ โอห์มต่ำสูบโล่ง โอห์มสูงสูบแน่น",
    systemTypes: ["coil", "accessory"],
  },
  // Phase 3.5 (E-liquid) — deliberately `systemTypes: []`, not a guess at a device value. `SystemType`
  // is a closed enum designed for vape hardware (open-pod/pod-kit/disposable/pod-cartridge/coil/
  // accessory); no value describes a bottled e-liquid correctly, so every e-liquid ProductMaster
  // record keeps `systemType: null` (already a fully supported, non-blocking state — see
  // `validateProductMasterRegistry`'s own comment on why systemType/attributes are excluded from
  // publication readiness). `systemTypes` on `Category` itself is declared but never actually read
  // anywhere in the app (verified by search before adding this) — an empty array is safe.
  {
    id: "e-liquid",
    slug: "e-liquid",
    name: "E-Liquid",
    shortName: "E-Liquid",
    labelTh: "E-Liquid / น้ำยา",
    description: "Bottled e-liquid for refillable devices — flavor, nicotine formulation, and bottle size, sourced from real operational stock.",
    descriptionTh:
      "น้ำยาสำหรับพอตที่เติมเองได้ แบ่งเป็น salt nic กับ freebase เหมาะกับเครื่องคนละแบบ นิโคตินและขนาดขวดดูในหน้าสินค้า ไม่แน่ใจว่าเครื่องคุณใช้แบบไหน ถามทางไลน์ได้",
    systemTypes: [],
  },
  // Full-catalog mission — heated tobacco is a physically different product category from vapor
  // hardware (heats tobacco leaf without combustion, not vaporized e-liquid), so it gets its own
  // two categories rather than being forced into an existing vape-shaped one — same reasoning as
  // the e-liquid category above: `systemTypes: []` deliberately, since `SystemType` has no correct
  // heated-tobacco value.
  {
    id: "heated-tobacco-devices",
    slug: "heated-tobacco-devices",
    name: "Heated Tobacco Devices",
    shortName: "HNB Devices",
    labelTh: "Heated Tobacco Devices / เครื่องอุ่นยาสูบ",
    description: "Genuine IQOS ILUMA devices that heat tobacco sticks and use no e-liquid. They take TEREA sticks only. Right now that's ILUMA i and ILUMA i PRIME.",
    descriptionTh:
      "เครื่อง IQOS ILUMA ของแท้ อุ่นยาสูบด้วยความร้อน ไม่ใช้น้ำยา ใช้ได้กับก้าน TEREA เท่านั้น ตอนนี้มี ILUMA i และ ILUMA i PRIME",
    systemTypes: [],
  },
  {
    id: "heated-tobacco-consumables",
    slug: "heated-tobacco-consumables",
    name: "Heated Tobacco Sticks",
    shortName: "HNB Sticks",
    labelTh: "Heated Tobacco Sticks / ก้าน TEREA",
    description: "Tobacco sticks for heat-not-burn devices — the consumable side of the heated-tobacco ecosystem.",
    descriptionTh:
      "ก้าน TEREA สำหรับเครื่อง IQOS ILUMA ใส่กับ IQOS รุ่นก่อน ILUMA ไม่ได้ ไม่แน่ใจว่าเครื่องคุณใช้ได้ไหม ทักไลน์ @okm24 ถามก่อนได้",
    systemTypes: [],
  },
];

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id || c.slug === id);
}
