import type { Category } from "@/types/catalog";

export const categories: Category[] = [
  {
    id: "pod-systems",
    slug: "pod-systems",
    name: "Open-System Pod Devices",
    shortName: "Pod Systems",
    labelTh: "Pod System / พอตซิสเต็ม",
    description:
      "Refillable pod devices built around interchangeable coil pods — fill your own e-liquid, swap resistances, and control airflow by hand.",
    descriptionTh:
      "พอตซิสเต็มคือพอตที่เติมน้ำยาเอง เปลี่ยนหัวพอตได้ เลือกโอห์มได้ ตอนนี้มีตระกูล Caliburn ของ UWELL ตั้งแต่ G3 Pro ถึง G5 ทุกรุ่นดูสเปกจริงและเทียบกันได้",
    systemTypes: ["open-pod"],
  },
  {
    id: "pod-kits",
    slug: "pod-kits",
    name: "Pod Kits & Pod Mods",
    shortName: "Pod Kits",
    labelTh: "Pod Kit / พอตคิท",
    description:
      "Higher-output pod devices with chip-driven firmware, adjustable wattage, and swappable resistance pod platforms — the step up from a simple open pod.",
    descriptionTh:
      "พอตคิทคือพอตที่ตัวเครื่องใช้ซ้ำได้ เปลี่ยนแค่หัวพอตหรือคอยล์ มีทั้งสายปรับวัตต์อย่าง ARGUS กับ DRAG และเครื่องระบบสวิตช์อย่าง M Switch ที่ใช้หัวพอตบรรจุสำเร็จ",
    systemTypes: ["pod-kit"],
  },
  {
    id: "disposables",
    slug: "disposables",
    name: "Disposable / Prefilled",
    shortName: "Disposables",
    labelTh: "Disposable / พอตใช้แล้วทิ้ง",
    description:
      "Prefilled, rechargeable, single-use-cartridge devices designed to run until the e-liquid is gone — no coils to swap, no e-liquid to fill. Models mainly differ by rated puff count and battery capacity, so the right pick usually comes down to how long you want one device to last between replacements.",
    descriptionTh:
      "พอตใช้แล้วทิ้ง แกะกล่องใช้ได้เลย ไม่ต้องเติมน้ำยา ไม่ต้องเปลี่ยนคอยล์ ส่วนใหญ่ชาร์จซ้ำได้จนน้ำยาหมด แต่ละรุ่นต่างกันหลัก ๆ ที่จำนวนพัฟกับขนาดแบต",
    systemTypes: ["disposable"],
  },
  {
    id: "pods-cartridges",
    slug: "pods-cartridges",
    name: "Pods & Cartridges",
    shortName: "Pods",
    labelTh: "Pods & Cartridges / หัวพอต",
    description:
      "Replacement pods and cartridges for open-system and switch-style devices — the consumable side of the ecosystem.",
    descriptionTh:
      "หัวพอตสำหรับเปลี่ยน ทั้งแบบเปล่าให้เติมน้ำยาเอง และแบบบรรจุน้ำยาสำเร็จของเครื่องระบบสวิตช์ แต่ละหัวใช้ได้เฉพาะเครื่องของมัน เช็คให้ตรงรุ่นก่อนสั่ง",
    systemTypes: ["pod-cartridge"],
  },
  {
    id: "coils-accessories",
    slug: "coils-accessories",
    name: "Coils & Accessories",
    shortName: "Coils & Accessories",
    labelTh: "Coils & Accessories / คอยล์และอุปกรณ์เสริม",
    description:
      "Replacement coil heads and the accessories that keep a device running — chargers, cases, drip tips, and cleaning kits.",
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
    description: "Heat-not-burn devices that heat tobacco sticks without combustion — official IQOS ILUMA devices and compatible third-party heaters.",
    descriptionTh:
      "เครื่อง IQOS ILUMA ของแท้ ให้ความร้อนกับยาสูบโดยไม่เผาไหม้ ใช้ได้กับแท่งยาสูบ TEREA เท่านั้น ตอนนี้มี ILUMA i และ ILUMA i PRIME",
    systemTypes: [],
  },
  {
    id: "heated-tobacco-consumables",
    slug: "heated-tobacco-consumables",
    name: "Heated Tobacco Sticks",
    shortName: "HNB Sticks",
    labelTh: "Heated Tobacco Sticks",
    description: "Tobacco sticks for heat-not-burn devices — the consumable side of the heated-tobacco ecosystem.",
    descriptionTh:
      "แท่งยาสูบ TEREA สำหรับเครื่อง IQOS ILUMA ใส่กับ IQOS รุ่นก่อน ILUMA ไม่ได้ ไม่แน่ใจว่าเครื่องคุณใช้ได้ไหม ทักไลน์ @okm24 ถามก่อนได้",
    systemTypes: [],
  },
];

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id || c.slug === id);
}
