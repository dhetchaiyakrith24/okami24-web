import type { Category } from "@/types/catalog";

export const categories: Category[] = [
  {
    id: "pod-systems",
    slug: "pod-systems",
    name: "Open-System Pod Devices",
    shortName: "Pod Systems",
    labelTh: "Pod System / พอตซิสเต็ม",
    description:
      "Refillable pods: choose your own e-liquid, swap the pod, pick the ohms. Right now that's the UWELL Caliburn family, every model with real specs to compare.",
    descriptionTh:
      "พอตซิสเต็มคือพอตที่เติมน้ำยาเอง เปลี่ยนหัวพอตได้ เลือกโอห์มได้ ตอนนี้มีตระกูล Caliburn ของ UWELL ทุกรุ่นดูสเปกจริงและเทียบกันได้ เหมาะกับคนที่อยากเลือกน้ำยาเอง",
    systemTypes: ["open-pod"],
  },
  {
    id: "pod-kits",
    slug: "pod-kits",
    name: "Pod Kits & Pod Mods",
    shortName: "Pod Kits",
    labelTh: "Pod Kit / พอตคิท",
    description:
      "Reusable pods: you only swap the pod or coil. ARGUS and DRAG let you set the wattage; switch-style devices like M Switch keep it simple with prefilled pods.",
    descriptionTh:
      // Round SEO E "pod" (09/10): opens on its own name instead of "พอตคิทคือพอตที่…" — GSC moved the bare query "pod" from
      // pod-systems (owner page, SEO_LANDSCAPE §0) to this page on 02–03/10; the generic "…คือพอต" definition is the one we drop.
      "Pod Kit หรือพอตคิท เครื่องที่ใช้ซ้ำได้ เปลี่ยนแค่หัวพอตหรือคอยล์ อยากปรับวัตต์เองก็มีสาย ARGUS กับ DRAG อยากง่ายก็มี M Switch ระบบสวิตช์ที่ใช้หัวพอตบรรจุสำเร็จ",
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
    description:
      "UWELL, VOOPOO and SALTHUB replacement pods, refillable, or prefilled for switch-style devices. Each fits its own device only; check the model before ordering.",
    descriptionTh:
      "หัวพอตสำหรับเปลี่ยน มีของ UWELL VOOPOO และ SALTHUB ทั้งแบบเติมเอง และแบบบรรจุสำเร็จของเครื่องระบบสวิตช์ แต่ละหัวใช้ได้เฉพาะเครื่องของมัน เช็คให้ตรงรุ่นก่อนสั่ง",
    systemTypes: ["pod-cartridge"],
  },
  {
    id: "coils-accessories",
    slug: "coils-accessories",
    name: "Coils & Accessories",
    shortName: "Coils & Accessories",
    labelTh: "Coils & Accessories / คอยล์และอุปกรณ์เสริม",
    description:
      "Genuine replacement coils from UWELL, VOOPOO, RINCOE and DOTMOD. Match your device model, then pick ohms by how you vape: lower is airier, higher is tighter.",
    descriptionTh:
      "คอยล์แท้สำหรับเปลี่ยน ตอนนี้มีของ UWELL VOOPOO RINCOE และ DOTMOD เลือกให้ตรงรุ่นเครื่องก่อน แล้วค่อยเลือกโอห์มตามแนวการสูบ โอห์มต่ำสูบโล่ง โอห์มสูงสูบแน่น",
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
