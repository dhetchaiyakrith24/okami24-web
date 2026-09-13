import type { Product } from "@/types/catalog";

const typeC = { type: "charging" as const, label: "USB-C", note: "Rechargeable via USB-C." };

export const tfitProducts: Product[] = [
  {
    id: "tfit-m-power-20k",
    slug: "tfit-m-power-20k",
    hiddenFromStorefront: { since: "2026-09-06", reason: "no card photo (IMAGE_SPEC §4)" },
    brandId: "tfit",
    familyId: "tfit-power",
    categoryId: "disposables",
    systemType: "disposable",
    name: "TFIT M Power 20K",
    displayName: "TFIT M POWER 20K",
    tagline: "Confirmed via OKami24's own review content — specs still need a source check.",
    shortDescription:
      "A 20,000-puff disposable OKami24 has genuinely reviewed on its own YouTube channels (real hands-on 30-day usage content). The brand name is confirmed as \"TFIT\" (not \"TFIF\") from those videos' own on-screen spelling, but the specs below come from a single retailer listing that does not match TFIT's own officially-indexed NOVA/NOVA MAX lineup. Deeper research (2026-09-03) found a real complication: \"M Power\" is not a TFIT-exclusive name — unrelated brands \"Mon\" (Mon M Power) and \"Mazaj\" (Mazaj M-Power 20000 Puffs) sell differently-specced devices under the same name, a known pattern for one Chinese OEM shell relabeled by multiple brands. Thinkvape (TFIT's parent) does manufacture 20K-class OEM disposables per its own B2B listings, so a genuine TFIT-branded regional SKU remains plausible — but the brand attribution on THIS specific unit is not yet independently confirmed.",
    isFlagship: false,
    // Confirmed via YouTube oEmbed (2026-09-03): real video, owned by youtube.com/@OKM_24 — one
    // of OKami24's own three channels. A genuine 14-day hands-on review.
    reviewVideo: { videoId: "eOlSO97e9r0", title: "หลังใช้งาน 14 วัน TFIT M POWER 20K เล็ก แรง ซิ่ง!", channelName: "OKAMI" },
    attributes: {
      batteryMah: 600,
      puffCount: 20000,
      capacityMl: 17,
      screenType: "none",
      drawStyle: "MTL",
      portability: "ultra-compact",
      beginnerFriendly: true,
      chargingType: "USB-C",
    },
    // No card asset — tfitvape.com's own storefront is a JS-rendered SPA not readable by this
    // project's fetch tooling this pass, and no other source was found strong enough to identify
    // the exact "M Power 20K" unit. Falls back to the illustrated glyph.
    assets: [],
    // Flavor names below are the single retailer's listing (vap150ipro.com) — the SAME source
    // flagged as spec-conflicting above, so treat these as provisional/unverified too, not settled
    // catalog truth. Kept swatch-only regardless (no photo of any kind found).
    flavorVariants: [
      { id: "blue-ice", name: "Blue Ice", swatchHex: "#2a6fbd", availability: "unknown" },
      { id: "double-mint", name: "Double Mint", swatchHex: "#3ea88a", availability: "unknown" },
      { id: "grape", name: "Grape", swatchHex: "#6a4c93", availability: "unknown" },
      { id: "grape-apple", name: "Grape Apple", swatchHex: "#7a5aa0", availability: "unknown" },
      { id: "hami-melon", name: "Hami Melon", swatchHex: "#c5c53e", availability: "unknown" },
      { id: "mix-berry", name: "Mix Berry", swatchHex: "#6b3a5e", availability: "unknown" },
      { id: "rainbow-candy", name: "Rainbow Candy", swatchHex: "#d1479c", availability: "unknown" },
      { id: "sakura-grape", name: "Sakura Grape", swatchHex: "#d18ab0", availability: "unknown" },
      { id: "strawberry", name: "Strawberry", swatchHex: "#c23a4e", availability: "unknown" },
      { id: "watermelon", name: "Watermelon", swatchHex: "#d94f6b", availability: "unknown" },
    ],
    specifications: [
      { key: "puffs", label: "Rated puffs", value: "20,000 (per retailer + OKami24's own review; brand's own indexed lineup only lists NOVA/NOVA MAX, so this exact model isn't independently cross-confirmed)", sourceStatus: "unverified" },
      { key: "battery", label: "Battery", value: "600mAh rechargeable, USB-C (retailer-stated)", sourceStatus: "unverified" },
      { key: "capacity", label: "E-liquid capacity", value: "17mL (retailer-stated)", sourceStatus: "unverified" },
      { key: "coil", label: "Coil", value: "Dual mesh coil (retailer-stated)", sourceStatus: "unverified" },
    ],
    features: [],
    compatibility: [typeC],
    whoIsThisFor: ["Customers who saw OKami24's own TFIT M Power 20K review and want a spec/flavor reference on-site."],
    faqs: [
      {
        id: "tfit-m-power-brand-check",
        question: "ทำไม TFIT M Power ยังไม่ยืนยันแบรนด์ 100%?",
        answer:
          "ชื่อ \"M Power\" มีแบรนด์อื่นใช้ชื่อเดียวกันด้วย (Mon, Mazaj) ซึ่งเป็นรูปแบบที่พบได้บ่อยในโรงงาน OEM จีนที่ผลิตพอตทรงเดียวกันแล้วแปะยี่ห้อต่างกัน วิธีตรวจสอบที่แน่นอนที่สุดคือดูข้อความ/โลโก้บนกล่องหรือหน้าจอของเครื่องจริงที่ OKami24 มีในมือว่าระบุ \"TFIT\" หรือไม่ — เป็นสิ่งที่ต้องตรวจจากสินค้าจริง ไม่สามารถยืนยันจากการค้นเว็บเพิ่มได้อีกแล้ว",
      },
    ],
    relatedProductSlugs: [],
    sourceUrls: ["https://www.tfitvape.com/"],
  },
];
