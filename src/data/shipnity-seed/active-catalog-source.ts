/**
 * OKami24 — Phase 2.4: Active Catalog Seed, raw transcription layer.
 *
 * Transcribed directly from Shipnity owner-account screenshots
 * (`shipnity.com/reselled_products?have_stock=true`, pages 1-8, all 8 pages captured by the
 * owner). This is EVIDENCE PRIORITY #1 per the Phase 2.4 brief — Data_31-08-2026.xlsx is used
 * only as a cross-check in `validate-active-catalog.ts`, never as the primary source here.
 *
 * This file is intentionally NOT imported by `src/types/product-master.ts` or any
 * `product-master-*.ts` file, and NOT imported by any frontend/app code. It is a standalone,
 * pre-runtime seed — see `README.md` in this folder for the full separation rationale.
 *
 * Every record here is raw, as-observed. No semantic option type, no cleaned value, no
 * packaging-note split — that derivation happens in `classify.ts`, kept separate so the raw
 * transcription (a factual claim: "the UI showed this text") is never silently mutated by an
 * inference step.
 *
 * IMPORTANT — what "active" means here: the "มีของ" (have_stock=true) filter hides any
 * child SKU that is currently out of stock. A parent's child list below is NOT necessarily
 * contiguous (e.g. Pod-179 shows -1,-2,-4,-5,-6 — no -3) — this is expected, not a transcription
 * gap, and no missing suffix was invented to fill it.
 */

export interface RawActiveChild {
  /** Shipnity's own child/variant code, e.g. "Pod-179-1". Transcribed verbatim. */
  shipnityVariantId: string;
  /** The label text shown in the "ชื่อสินค้า" column for this child row, verbatim. */
  rawLabel: string;
}

export interface RawActiveParent {
  /** Shipnity's own parent/product code, e.g. "Pod-179". Transcribed verbatim. */
  shipnityProductId: string;
  /** Product name shown in the UI, verbatim. */
  name: string;
  /** "ราคาขาย" as shown in the UI — operational selling price, NOT the approved website price. */
  operationalSellingPrice: number;
  /** "ต้นทุน" as shown in the UI — internal business evidence only, never customer-facing. */
  operationalCost: number;
  /** Which "have_stock=true" page(s) this parent was observed on (1-8). */
  sourcePages: number[];
  children: RawActiveChild[];
}

/**
 * Two rows appeared in the "มีของ" view that are not real catalog products and are
 * deliberately EXCLUDED from `rawActiveParents` below:
 *   - "Close" / "ยิงปิด" (price 0.00, cost 0.00) — a livestream/order-closing operational
 *     marker, not a product (already flagged in Phase 2.2's Excel analysis).
 *   - "test" / "test product" (price 1.00, cost 1.00) — a literal test fixture row.
 * Recorded here, not silently dropped, so the exclusion is auditable.
 */
export const excludedNonProductRows = [
  { shipnityProductId: "Close", name: "ยิงปิด", sourcePage: 1, reason: "operational marker, not a product" },
  { shipnityProductId: "test", name: "test product", sourcePage: 8, reason: "literal test fixture row" },
] as const;

export const rawActiveParents: RawActiveParent[] = [
  // ---- Page 1 ----
  {
    shipnityProductId: "Coil-1",
    name: "Coil Vinci",
    operationalSellingPrice: 130.0,
    operationalCost: 60.0,
    sourcePages: [1],
    children: [
      { shipnityVariantId: "Coil-1-1", rawLabel: "0.15Ω / ตัว" },
      { shipnityVariantId: "Coil-1-11", rawLabel: "1.2Ω ยางขาว / ตัว" },
      { shipnityVariantId: "Coil-1-12", rawLabel: "1.2Ω ยางฟ้า / ตัว" },
      { shipnityVariantId: "Coil-1-14", rawLabel: "DW60 0.6Ω / ตัว" },
    ],
  },
  {
    shipnityProductId: "Coil-21",
    name: "คอยล์ Argus Pod",
    operationalSellingPrice: 450.0,
    operationalCost: 300.0,
    sourcePages: [1],
    children: [{ shipnityVariantId: "Coil-21-1", rawLabel: "Argus mix (coil เวอร์ชั่นใหม่)" }],
  },
  {
    shipnityProductId: "Coil-38",
    name: "Coil TPP",
    operationalSellingPrice: 450.0,
    operationalCost: 290.0,
    sourcePages: [1],
    children: [
      { shipnityVariantId: "Coil-38-2", rawLabel: "TPP-DM2 (0.2Ω) / กล่อง" },
      { shipnityVariantId: "Coil-38-4", rawLabel: "TPP-DM4 (0.3Ω) / กล่อง" },
    ],
  },
  {
    shipnityProductId: "Coil-53",
    name: "Coil Caliburn G2",
    operationalSellingPrice: 550.0,
    operationalCost: 320.0,
    sourcePages: [1],
    children: [{ shipnityVariantId: "Coil-53-2", rawLabel: "1.0Ω" }],
  },
  {
    shipnityProductId: "Coil-55",
    name: "หัวแทงค์ Caliburn G2",
    operationalSellingPrice: 299.0,
    operationalCost: 150.0,
    sourcePages: [1],
    children: [{ shipnityVariantId: "Coil-55-1", rawLabel: "1 กล่อง / มี 2ตัว" }],
  },
  {
    shipnityProductId: "Coil-56",
    name: "หัวเปล่า Voopoo PnP-X",
    operationalSellingPrice: 300.0,
    operationalCost: 250.0,
    sourcePages: [1],
    children: [{ shipnityVariantId: "Coil-56-3", rawLabel: "Silver / ยกกล่อง" }],
  },
  {
    shipnityProductId: "Coil-63",
    name: "Coil Jelly Nano",
    operationalSellingPrice: 350.0,
    operationalCost: 250.0,
    sourcePages: [1],
    children: [{ shipnityVariantId: "Coil-63-1", rawLabel: "0.5Ω / 1 กล่อง" }],
  },

  // ---- Page 2 ----
  {
    shipnityProductId: "Coil-68",
    name: "หัวเปล่า ITO-X",
    operationalSellingPrice: 300.0,
    operationalCost: 200.0,
    sourcePages: [2],
    children: [{ shipnityVariantId: "Coil-68-1", rawLabel: "Black" }],
  },
  {
    shipnityProductId: "Coil-70",
    name: "คอยล์ Dotmod Aio V2",
    operationalSellingPrice: 390.0,
    operationalCost: 350.0,
    sourcePages: [2],
    children: [{ shipnityVariantId: "Coil-70-2", rawLabel: "0.7Ω / กล่อง" }],
  },
  {
    shipnityProductId: "Coil-72",
    name: "คอยล์ Vmate Infinity Edition",
    operationalSellingPrice: 350.0,
    operationalCost: 220.0,
    sourcePages: [2],
    children: [
      { shipnityVariantId: "Coil-72-1", rawLabel: "0.7 Ω" },
      { shipnityVariantId: "Coil-72-2", rawLabel: "1.2 Ω" },
      { shipnityVariantId: "Coil-72-3", rawLabel: "0.4 Ω Top Fill เติมบน" },
      { shipnityVariantId: "Coil-72-4", rawLabel: "0.7 Ω Top Fill เติมบน" },
    ],
  },
  {
    shipnityProductId: "Coil-74",
    name: "หัวเปล่า Caliburn X",
    operationalSellingPrice: 250.0,
    operationalCost: 150.0,
    sourcePages: [2],
    children: [{ shipnityVariantId: "Coil-74-1", rawLabel: "3ml. / 1 กล่อง 2 หัว" }],
  },
  {
    shipnityProductId: "Coil-83",
    name: "หัวเปล่า Argus P1",
    operationalSellingPrice: 250.0,
    operationalCost: 180.0,
    sourcePages: [2],
    children: [{ shipnityVariantId: "Coil-83-1", rawLabel: "1 กล่อง2 หัว / ขายยกกล่อง" }],
  },
  {
    shipnityProductId: "Coil-87",
    name: "Voopoo TPP Pod",
    operationalSellingPrice: 250.0,
    operationalCost: 100.0,
    sourcePages: [2],
    children: [{ shipnityVariantId: "Coil-87-1", rawLabel: "Black / 1 หัว" }],
  },
  {
    shipnityProductId: "Coil-89",
    name: "Coil Jellybox V",
    operationalSellingPrice: 350.0,
    operationalCost: 250.0,
    sourcePages: [2],
    children: [
      { shipnityVariantId: "Coil-89-1", rawLabel: "0.8Ω / ยกกล่อง" },
      { shipnityVariantId: "Coil-89-2", rawLabel: "1.0Ω / ยกกล่อง" },
    ],
  },
  {
    shipnityProductId: "Coil-92",
    name: "คอยล์ Voopoo PnP X",
    operationalSellingPrice: 130.0,
    operationalCost: 65.0,
    sourcePages: [2],
    children: [{ shipnityVariantId: "Coil-92-1", rawLabel: "0.15Ω / ต่อตัว" }],
  },

  // ---- Page 3 ----
  {
    shipnityProductId: "Coil-94",
    name: "คอยล์ Caliburn G4&G3 Series",
    operationalSellingPrice: 450.0,
    operationalCost: 350.0,
    sourcePages: [3],
    children: [
      { shipnityVariantId: "Coil-94-1", rawLabel: "0.4Ω / ยกกล่อง" },
      { shipnityVariantId: "Coil-94-2", rawLabel: "0.6Ω / ยกกล่อง" },
      { shipnityVariantId: "Coil-94-3", rawLabel: "0.9Ω / ยกกล่อง" },
      { shipnityVariantId: "Coil-94-4", rawLabel: "1.2Ω / ยกกล่อง" },
    ],
  },
  {
    shipnityProductId: "Disposable-25",
    name: "Marbo Bar 9K",
    operationalSellingPrice: 349.0,
    operationalCost: 240.0,
    sourcePages: [3],
    children: [
      { shipnityVariantId: "Disposable-25-1", rawLabel: "Grape" },
      { shipnityVariantId: "Disposable-25-4", rawLabel: "Watermelon" },
      { shipnityVariantId: "Disposable-25-5", rawLabel: "Apple Aloe" },
      { shipnityVariantId: "Disposable-25-6", rawLabel: "Rainbow Candy" },
      { shipnityVariantId: "Disposable-25-12", rawLabel: "Sparkling Lemon" },
      { shipnityVariantId: "Disposable-25-13", rawLabel: "Peach" },
      { shipnityVariantId: "Disposable-25-14", rawLabel: "Sour Gummy" },
      { shipnityVariantId: "Disposable-25-15", rawLabel: "Orange Sour" },
      { shipnityVariantId: "Disposable-25-17", rawLabel: "Pink Berry" },
      { shipnityVariantId: "Disposable-25-18", rawLabel: "Watermelon Bubblegum" },
      { shipnityVariantId: "Disposable-25-21", rawLabel: "Kyoho Grape" },
      { shipnityVariantId: "Disposable-25-22", rawLabel: "Zapple" },
    ],
  },
  {
    shipnityProductId: "Disposable-34",
    name: "Insta Bar PX 15000 Puffs",
    operationalSellingPrice: 329.0,
    operationalCost: 220.0,
    sourcePages: [3],
    children: [
      { shipnityVariantId: "Disposable-34-6", rawLabel: "Yummy Bear" },
      { shipnityVariantId: "Disposable-34-12", rawLabel: "Watermelon Strawberry Mango Jelly" },
    ],
  },
  {
    shipnityProductId: "Disposable-37",
    name: "MOOOD Monster 14K Puffs",
    operationalSellingPrice: 350.0,
    operationalCost: 250.0,
    sourcePages: [3],
    children: [
      { shipnityVariantId: "Disposable-37-1", rawLabel: "Grape" },
      { shipnityVariantId: "Disposable-37-3", rawLabel: "Watermelon" },
      { shipnityVariantId: "Disposable-37-7", rawLabel: "Blueberry" },
      { shipnityVariantId: "Disposable-37-9", rawLabel: "Lemon Tea" },
      { shipnityVariantId: "Disposable-37-17", rawLabel: "Sugus Apple" },
      { shipnityVariantId: "Disposable-37-18", rawLabel: "Fanta" },
      { shipnityVariantId: "Disposable-37-19", rawLabel: "Mango Peach" },
      { shipnityVariantId: "Disposable-37-20", rawLabel: "Kyoho Grape" },
      { shipnityVariantId: "Disposable-37-21", rawLabel: "Grape N5%" },
      { shipnityVariantId: "Disposable-37-23", rawLabel: "Blueberry N5%" },
    ],
  },
  {
    shipnityProductId: "Disposable-38",
    name: "Muro Space 15k",
    operationalSellingPrice: 329.0,
    operationalCost: 220.0,
    sourcePages: [3],
    children: [
      { shipnityVariantId: "Disposable-38-2", rawLabel: "Extreme Menthol" },
      { shipnityVariantId: "Disposable-38-3", rawLabel: "Double Mint" },
      { shipnityVariantId: "Disposable-38-4", rawLabel: "Watermelon" },
      { shipnityVariantId: "Disposable-38-9", rawLabel: "Very Strawberry" },
      { shipnityVariantId: "Disposable-38-13", rawLabel: "Milk Cream" },
    ],
  },
  {
    shipnityProductId: "Disposable-42",
    name: "Foli Bar 15k",
    operationalSellingPrice: 349.0,
    operationalCost: 220.0,
    sourcePages: [3],
    children: [
      { shipnityVariantId: "Disposable-42-1", rawLabel: "Apple Aloe" },
      { shipnityVariantId: "Disposable-42-2", rawLabel: "Grape" },
      { shipnityVariantId: "Disposable-42-3", rawLabel: "Grape Aloe" },
      { shipnityVariantId: "Disposable-42-4", rawLabel: "Blueberry" },
      { shipnityVariantId: "Disposable-42-5", rawLabel: "Cola Ice" },
      { shipnityVariantId: "Disposable-42-6", rawLabel: "Lychee Ice" },
      { shipnityVariantId: "Disposable-42-8", rawLabel: "Mix Berry" },
      { shipnityVariantId: "Disposable-42-9", rawLabel: "Strawberry Ice" },
      { shipnityVariantId: "Disposable-42-10", rawLabel: "Red Bull Ice" },
    ],
  },
  {
    shipnityProductId: "ELIQUID-1",
    name: "MARBORO SALT NIC 30 ML",
    operationalSellingPrice: 269.0,
    operationalCost: 200.0,
    sourcePages: [3],
    children: [
      { shipnityVariantId: "ELIQUID-1-3", rawLabel: "มาโบโร่ แดง" },
      { shipnityVariantId: "ELIQUID-1-4", rawLabel: "มาโบโร่ ทอง" },
      { shipnityVariantId: "ELIQUID-1-5", rawLabel: "มาโบโร่ เงิน" },
      { shipnityVariantId: "ELIQUID-1-7", rawLabel: "มาโบโร่ น้ำเงิน" },
      { shipnityVariantId: "ELIQUID-1-8", rawLabel: "มาโบโร่ ชมพู" },
    ],
  },
  {
    shipnityProductId: "Eliquid-109",
    name: "Marboro Freebase ขวดยาว",
    operationalSellingPrice: 159.0,
    operationalCost: 130.0,
    sourcePages: [3],
    children: [{ shipnityVariantId: "Eliquid-109-4", rawLabel: "Ice Sparking" }],
  },

  // ---- Page 4 ----
  {
    shipnityProductId: "Eliquid-169",
    name: "Muro Freebase",
    operationalSellingPrice: 250.0,
    operationalCost: 170.0,
    sourcePages: [4],
    children: [
      { shipnityVariantId: "Eliquid-169-2", rawLabel: "Watermelon" },
      { shipnityVariantId: "Eliquid-169-5", rawLabel: "Peach" },
      { shipnityVariantId: "Eliquid-169-6", rawLabel: "Big Cola" },
    ],
  },
  {
    shipnityProductId: "Eliquid-44",
    name: "Dooze Salt Nic",
    operationalSellingPrice: 219.0,
    operationalCost: 170.0,
    sourcePages: [4],
    children: [
      { shipnityVariantId: "Eliquid-44-4", rawLabel: "Fizzy Orange" },
      { shipnityVariantId: "Eliquid-44-5", rawLabel: "Pineapple" },
    ],
  },
  {
    shipnityProductId: "Eliquid-64",
    name: "Double Mint Salt Nic",
    operationalSellingPrice: 300.0,
    operationalCost: 180.0,
    sourcePages: [4],
    children: [
      { shipnityVariantId: "Eliquid-64-3", rawLabel: "Watermelon" },
      { shipnityVariantId: "Eliquid-64-5", rawLabel: "Peach" },
    ],
  },
  {
    shipnityProductId: "Eliquid-66",
    name: "BAAM Salt Nic",
    operationalSellingPrice: 300.0,
    operationalCost: 180.0,
    sourcePages: [4],
    children: [{ shipnityVariantId: "Eliquid-66-2", rawLabel: "Yakull" }],
  },
  {
    shipnityProductId: "Eliquid-72",
    name: "Pepo Salt Nic",
    operationalSellingPrice: 300.0,
    operationalCost: 160.0,
    sourcePages: [4],
    children: [
      { shipnityVariantId: "Eliquid-72-1", rawLabel: "Grape" },
      { shipnityVariantId: "Eliquid-72-3", rawLabel: "Mixed Berry" },
      { shipnityVariantId: "Eliquid-72-4", rawLabel: "Pineapple" },
      { shipnityVariantId: "Eliquid-72-5", rawLabel: "Peach" },
    ],
  },
  {
    shipnityProductId: "Eliquid-73",
    name: "Dundu Salt Nic",
    operationalSellingPrice: 250.0,
    operationalCost: 160.0,
    sourcePages: [4],
    children: [{ shipnityVariantId: "Eliquid-73-1", rawLabel: "Grape" }],
  },
  {
    shipnityProductId: "IQOSHEET-14",
    name: "Lambda i8",
    operationalSellingPrice: 2390.0,
    operationalCost: 1600.0,
    sourcePages: [4],
    children: [
      { shipnityVariantId: "IQOSHEET-14-4", rawLabel: "Red" },
      { shipnityVariantId: "IQOSHEET-14-6", rawLabel: "Gold" },
    ],
  },
  {
    shipnityProductId: "IQOSHEET-15",
    name: "IQOS TEREA",
    operationalSellingPrice: 220.0,
    operationalCost: 170.0,
    sourcePages: [4],
    children: [
      { shipnityVariantId: "IQOSHEET-15-1", rawLabel: "Black Green เขียวเข้ม / 1 ซอง" },
      { shipnityVariantId: "IQOSHEET-15-2", rawLabel: "Green เขียว / 1 ซอง" },
      { shipnityVariantId: "IQOSHEET-15-3", rawLabel: "Blue ฟ้า / 1 ซอง" },
      { shipnityVariantId: "IQOSHEET-15-4", rawLabel: "Sienna แดง / 1 ซอง" },
      { shipnityVariantId: "IQOSHEET-15-5", rawLabel: "Purple Wave ม่วง / 1 ซอง" },
      { shipnityVariantId: "IQOSHEET-15-6", rawLabel: "Bronze น้ำตาล / 1 ซอง" },
      { shipnityVariantId: "IQOSHEET-15-7", rawLabel: "Bright Wave เขียว-ฟ้า / 1 ซอง" },
      { shipnityVariantId: "IQOSHEET-15-8", rawLabel: "Dimension Apricity / 1 ซอง" },
      { shipnityVariantId: "IQOSHEET-15-9", rawLabel: "Dimension Yugen / 1 ซอง" },
      { shipnityVariantId: "IQOSHEET-15-10", rawLabel: "Emerald Edition / 1 ซอง" },
      { shipnityVariantId: "IQOSHEET-15-11", rawLabel: "Golden Edition / 1 ซอง" },
      { shipnityVariantId: "IQOSHEET-15-13", rawLabel: "Berrine Edition / 1 ซอง" },
      { shipnityVariantId: "IQOSHEET-15-14", rawLabel: "Mulint Edition / 1 ซอง" },
      { shipnityVariantId: "IQOSHEET-15-15", rawLabel: "Oasis Pearl" },
      { shipnityVariantId: "IQOSHEET-15-16", rawLabel: "Sun Pearl" },
      { shipnityVariantId: "IQOSHEET-15-17", rawLabel: "Black Ruby" },
    ],
  },

  // ---- Page 5 ----
  {
    shipnityProductId: "IQOSHEET-16",
    name: "IQOS iluma Prime",
    operationalSellingPrice: 4900.0,
    operationalCost: 3900.0,
    sourcePages: [5],
    children: [
      { shipnityVariantId: "IQOSHEET-16-1", rawLabel: "Midnight Black" },
      { shipnityVariantId: "IQOSHEET-16-2", rawLabel: "Breeze Blue" },
      { shipnityVariantId: "IQOSHEET-16-3", rawLabel: "Aspen Green" },
    ],
  },
  {
    shipnityProductId: "IQOSHEET-17",
    name: "Iqos iluma one",
    operationalSellingPrice: 2900.0,
    operationalCost: 2300.0,
    sourcePages: [5],
    children: [
      { shipnityVariantId: "IQOSHEET-17-1", rawLabel: "Pebble Grey" },
      { shipnityVariantId: "IQOSHEET-17-3", rawLabel: "Breeze Blue" },
    ],
  },
  {
    shipnityProductId: "IQOSHEET-18",
    name: "Iqos iluma Standard",
    operationalSellingPrice: 3900.0,
    operationalCost: 3000.0,
    sourcePages: [5],
    children: [
      { shipnityVariantId: "IQOSHEET-18-1", rawLabel: "Midnight Black" },
      { shipnityVariantId: "IQOSHEET-18-3", rawLabel: "Breeze Blue" },
    ],
  },
  {
    shipnityProductId: "Pod-115",
    name: "หัวพอต Vazer One",
    operationalSellingPrice: 59.0,
    operationalCost: 80.0,
    sourcePages: [5],
    children: [
      { shipnityVariantId: "Pod-115-2", rawLabel: "Cola" },
      { shipnityVariantId: "Pod-115-3", rawLabel: "Cola Lemon" },
      { shipnityVariantId: "Pod-115-5", rawLabel: "Mango" },
    ],
  },
  {
    shipnityProductId: "Pod-120",
    name: "Muro 3 ML",
    operationalSellingPrice: 99.0,
    operationalCost: 70.0,
    sourcePages: [5],
    children: [
      { shipnityVariantId: "Pod-120-1", rawLabel: "Grape" },
      { shipnityVariantId: "Pod-120-2", rawLabel: "Watermelon" },
      { shipnityVariantId: "Pod-120-3", rawLabel: "Smooth Mint" },
      { shipnityVariantId: "Pod-120-4", rawLabel: "Green Slush" },
      { shipnityVariantId: "Pod-120-5", rawLabel: "Mix Berries" },
      { shipnityVariantId: "Pod-120-9", rawLabel: "Blueberry Bubblegum" },
      { shipnityVariantId: "Pod-120-10", rawLabel: "Muro Grape" },
      { shipnityVariantId: "Pod-120-11", rawLabel: "Honey Lemon" },
      { shipnityVariantId: "Pod-120-12", rawLabel: "Very Strawberry" },
      { shipnityVariantId: "Pod-120-13", rawLabel: "Double Shisha" },
    ],
  },
  {
    shipnityProductId: "Pod-142",
    name: "Reswa Sportcan 12k",
    operationalSellingPrice: 229.0,
    operationalCost: 220.0,
    sourcePages: [5],
    children: [
      { shipnityVariantId: "Pod-142-2", rawLabel: "Green Tea" },
      { shipnityVariantId: "Pod-142-3", rawLabel: "Oolong Tea" },
      { shipnityVariantId: "Pod-142-4", rawLabel: "Ice Cola" },
    ],
  },
  {
    shipnityProductId: "Pod-147",
    name: "M Switch 15k",
    operationalSellingPrice: 349.0,
    operationalCost: 240.0,
    sourcePages: [5],
    children: [
      { shipnityVariantId: "Pod-147-2", rawLabel: "Grape Aloe" },
      { shipnityVariantId: "Pod-147-9", rawLabel: "Strawberry Watermelon" },
      { shipnityVariantId: "Pod-147-16", rawLabel: "Apple Aloe" },
    ],
  },
  {
    shipnityProductId: "Pod-149",
    name: "SKE Crystal B20K Puffs",
    operationalSellingPrice: 329.0,
    operationalCost: 240.0,
    sourcePages: [5],
    children: [{ shipnityVariantId: "Pod-149-6", rawLabel: "Thai Milk Green Tea" }],
  },

  // ---- Page 6 ----
  {
    shipnityProductId: "Pod-150",
    name: "KS Quikpro 15K หัวพอต",
    operationalSellingPrice: 299.0,
    operationalCost: 240.0,
    sourcePages: [6],
    children: [
      { shipnityVariantId: "Pod-150-4", rawLabel: "Watermelon" },
      { shipnityVariantId: "Pod-150-6", rawLabel: "Grape" },
      { shipnityVariantId: "Pod-150-9", rawLabel: "Lychee" },
    ],
  },
  {
    shipnityProductId: "Pod-154",
    name: "Pop Up 10K หัวเติม",
    operationalSellingPrice: 199.0,
    operationalCost: 160.0,
    sourcePages: [6],
    children: [
      { shipnityVariantId: "Pod-154-3", rawLabel: "Coke" },
      { shipnityVariantId: "Pod-154-5", rawLabel: "Hales Blue Boy" },
      { shipnityVariantId: "Pod-154-6", rawLabel: "Strawberry" },
      { shipnityVariantId: "Pod-154-7", rawLabel: "Mixberry" },
      { shipnityVariantId: "Pod-154-8", rawLabel: "Mangosteen" },
      { shipnityVariantId: "Pod-154-11", rawLabel: "Sgus Pineapple" },
      { shipnityVariantId: "Pod-154-12", rawLabel: "Sugus Raspberry" },
      { shipnityVariantId: "Pod-154-13", rawLabel: "Orange Soda" },
      { shipnityVariantId: "Pod-154-14", rawLabel: "Blueberry" },
      { shipnityVariantId: "Pod-154-15", rawLabel: "Lime Soda" },
      { shipnityVariantId: "Pod-154-16", rawLabel: "Guava Kiwi" },
      { shipnityVariantId: "Pod-154-17", rawLabel: "Jele Lychee" },
      { shipnityVariantId: "Pod-154-18", rawLabel: "Jelly Bear" },
      { shipnityVariantId: "Pod-154-19", rawLabel: "ฐานแบตเตอรี่" },
    ],
  },
  {
    shipnityProductId: "Pod-159",
    name: "เครื่อง Esko Bar Switch 20k",
    operationalSellingPrice: 549.0,
    operationalCost: 350.0,
    sourcePages: [6],
    children: [
      { shipnityVariantId: "Pod-159-2", rawLabel: "Cool Mint" },
      { shipnityVariantId: "Pod-159-4", rawLabel: "Cola" },
    ],
  },
  {
    shipnityProductId: "Pod-166",
    name: "Muro SC 8000 Puffs",
    operationalSellingPrice: 259.0,
    operationalCost: 170.0,
    sourcePages: [6],
    children: [
      { shipnityVariantId: "Pod-166-4", rawLabel: "Extreme Menthol" },
      { shipnityVariantId: "Pod-166-5", rawLabel: "Cola" },
      { shipnityVariantId: "Pod-166-7", rawLabel: "Strawberry" },
      { shipnityVariantId: "Pod-166-8", rawLabel: "Honey Lemon" },
      { shipnityVariantId: "Pod-166-9", rawLabel: "Apple Shisha" },
      { shipnityVariantId: "Pod-166-10", rawLabel: "Mineral Water" },
      { shipnityVariantId: "Pod-166-11", rawLabel: "Yakult" },
      { shipnityVariantId: "Pod-166-12", rawLabel: "Banana Strawberry" },
    ],
  },
  {
    shipnityProductId: "Pod-168",
    name: "Caliburn G4 Pro",
    operationalSellingPrice: 1190.0,
    operationalCost: 850.0,
    sourcePages: [6],
    children: [{ shipnityVariantId: "Pod-168-2", rawLabel: "Stripe Black" }],
  },
  {
    shipnityProductId: "Pod-169",
    name: "หัว infy 2.5 ml",
    operationalSellingPrice: 129.0,
    operationalCost: 85.0,
    sourcePages: [6],
    children: [
      { shipnityVariantId: "Pod-169-1", rawLabel: "Grape Jelly" },
      { shipnityVariantId: "Pod-169-3", rawLabel: "Grape Gummies" },
      { shipnityVariantId: "Pod-169-4", rawLabel: "Grape Bubblegum" },
      { shipnityVariantId: "Pod-169-5", rawLabel: "Grape Apple" },
      { shipnityVariantId: "Pod-169-11", rawLabel: "Strawberry" },
      { shipnityVariantId: "Pod-169-13", rawLabel: "Strawberry Grape" },
      { shipnityVariantId: "Pod-169-15", rawLabel: "Tropical Mix Fruit" },
      { shipnityVariantId: "Pod-169-22", rawLabel: "Blueberry" },
      { shipnityVariantId: "Pod-169-27", rawLabel: "Lychee Raspberry" },
    ],
  },
  {
    shipnityProductId: "Pod-171",
    name: "Muro Connector 20k",
    operationalSellingPrice: 259.0,
    operationalCost: 150.0,
    sourcePages: [6],
    children: [
      { shipnityVariantId: "Pod-171-1", rawLabel: "Grape" },
      { shipnityVariantId: "Pod-171-2", rawLabel: "Watermelon" },
      { shipnityVariantId: "Pod-171-3", rawLabel: "Double Mint" },
      { shipnityVariantId: "Pod-171-4", rawLabel: "Cola" },
      { shipnityVariantId: "Pod-171-5", rawLabel: "Mix Berries" },
      { shipnityVariantId: "Pod-171-6", rawLabel: "Pineapple" },
      { shipnityVariantId: "Pod-171-7", rawLabel: "Honey Lemon" },
      { shipnityVariantId: "Pod-171-8", rawLabel: "Apple Baraku" },
      { shipnityVariantId: "Pod-171-9", rawLabel: "Mineral Water" },
      { shipnityVariantId: "Pod-171-10", rawLabel: "Yakult" },
      { shipnityVariantId: "Pod-171-11", rawLabel: "Banana Strawberry" },
      { shipnityVariantId: "Pod-171-12", rawLabel: "Kyoho Grape" },
      { shipnityVariantId: "Pod-171-13", rawLabel: "Pink Berry" },
      { shipnityVariantId: "Pod-171-14", rawLabel: "Lemon Jeez" },
      { shipnityVariantId: "Pod-171-15", rawLabel: "Cool Mint" },
      { shipnityVariantId: "Pod-171-16", rawLabel: "Blue Ice" },
      { shipnityVariantId: "Pod-171-17", rawLabel: "Green Tea" },
      { shipnityVariantId: "Pod-171-18", rawLabel: "Strawberry Peach" },
      { shipnityVariantId: "Pod-171-19", rawLabel: "Vanilla Ice Cream" },
      { shipnityVariantId: "Pod-171-20", rawLabel: "Taro Ice Cream" },
    ],
  },
  {
    shipnityProductId: "Pod-173",
    name: "Next Pro 2 Beyond",
    operationalSellingPrice: 790.0,
    operationalCost: 450.0,
    sourcePages: [6],
    children: [
      { shipnityVariantId: "Pod-173-1", rawLabel: "Razer Black" },
      { shipnityVariantId: "Pod-173-2", rawLabel: "Supreme Red" },
      { shipnityVariantId: "Pod-173-3", rawLabel: "White Lava" },
      { shipnityVariantId: "Pod-173-4", rawLabel: "Aurora" },
      { shipnityVariantId: "Pod-173-5", rawLabel: "Lemon Mint" },
      { shipnityVariantId: "Pod-173-6", rawLabel: "Twilight Sky" },
    ],
  },

  // ---- Page 7 ----
  {
    shipnityProductId: "Pod-177",
    name: "Vmate i3",
    operationalSellingPrice: 690.0,
    operationalCost: 450.0,
    sourcePages: [7],
    children: [
      { shipnityVariantId: "Pod-177-3", rawLabel: "Red" },
      { shipnityVariantId: "Pod-177-4", rawLabel: "Cyan Blue" },
      { shipnityVariantId: "Pod-177-5", rawLabel: "Neon" },
    ],
  },
  {
    shipnityProductId: "Pod-178",
    name: "Marbo Zero Pro",
    operationalSellingPrice: 990.0,
    operationalCost: 600.0,
    sourcePages: [7],
    children: [
      { shipnityVariantId: "Pod-178-2", rawLabel: "Gunmetal" },
      { shipnityVariantId: "Pod-178-3", rawLabel: "Copper" },
      { shipnityVariantId: "Pod-178-4", rawLabel: "Charcoal Red" },
      { shipnityVariantId: "Pod-178-5", rawLabel: "Blue Purple" },
      { shipnityVariantId: "Pod-178-6", rawLabel: "Champagne" },
      { shipnityVariantId: "Pod-178-7", rawLabel: "Teal" },
      { shipnityVariantId: "Pod-178-8", rawLabel: "Red" },
    ],
  },
  {
    shipnityProductId: "Pod-179",
    name: "Voopoo Argus G4",
    operationalSellingPrice: 1090.0,
    operationalCost: 800.0,
    sourcePages: [7],
    children: [
      { shipnityVariantId: "Pod-179-1", rawLabel: "Black" },
      { shipnityVariantId: "Pod-179-2", rawLabel: "Gray" },
      { shipnityVariantId: "Pod-179-4", rawLabel: "Brown" },
      { shipnityVariantId: "Pod-179-5", rawLabel: "Blue" },
      { shipnityVariantId: "Pod-179-6", rawLabel: "Orange" },
    ],
  },
  {
    shipnityProductId: "Pod-180",
    name: "Nexbar Clear 18k",
    operationalSellingPrice: 359.0,
    operationalCost: 250.0,
    sourcePages: [7],
    children: [
      { shipnityVariantId: "Pod-180-1", rawLabel: "Grape Ice" },
      { shipnityVariantId: "Pod-180-2", rawLabel: "Grape Lychee" },
      { shipnityVariantId: "Pod-180-3", rawLabel: "Mint" },
      { shipnityVariantId: "Pod-180-4", rawLabel: "Watermelon Ice" },
      { shipnityVariantId: "Pod-180-5", rawLabel: "Mixberry" },
      { shipnityVariantId: "Pod-180-7", rawLabel: "Strawberry Watermelon" },
      { shipnityVariantId: "Pod-180-8", rawLabel: "Strawberry Custard" },
      { shipnityVariantId: "Pod-180-11", rawLabel: "Watermelon Bubblegum" },
      { shipnityVariantId: "Pod-180-12", rawLabel: "White Slush" },
      { shipnityVariantId: "Pod-180-13", rawLabel: "Strawberry Kiwi" },
    ],
  },
  {
    shipnityProductId: "Pod-85",
    name: "หัวพอต Marbo Zero",
    operationalSellingPrice: 129.0,
    operationalCost: 85.0,
    sourcePages: [7],
    children: [
      { shipnityVariantId: "Pod-85-15", rawLabel: "Apple Aloe" },
      { shipnityVariantId: "Pod-85-17", rawLabel: "Fruit Tea" },
    ],
  },
  {
    shipnityProductId: "coil-54",
    name: "หัวเปล่า Feelin Mini",
    operationalSellingPrice: 250.0,
    operationalCost: 150.0,
    sourcePages: [7],
    children: [{ shipnityVariantId: "coil-54-1", rawLabel: "ขายยกกล่อง 1 กล่อง 2 หัว" }],
  },
  {
    shipnityProductId: "coil-62",
    name: "หัวเปล่า Feelin C1",
    operationalSellingPrice: 250.0,
    operationalCost: 150.0,
    sourcePages: [7],
    children: [{ shipnityVariantId: "coil-62-4", rawLabel: "Matcha Clear" }],
  },
  {
    shipnityProductId: "eliquid-133",
    name: "Yogurt Salt Hub",
    operationalSellingPrice: 250.0,
    operationalCost: 180.0,
    sourcePages: [7],
    children: [{ shipnityVariantId: "eliquid-133-1", rawLabel: "30 ml" }],
  },

  // ---- Page 8 ----
  {
    shipnityProductId: "eliquid-62",
    name: "Muro Salt Nic",
    operationalSellingPrice: 250.0,
    operationalCost: 160.0,
    sourcePages: [8],
    children: [
      { shipnityVariantId: "eliquid-62-1", rawLabel: "Grape" },
      { shipnityVariantId: "eliquid-62-2", rawLabel: "Watermelon" },
      { shipnityVariantId: "eliquid-62-3", rawLabel: "Click Mint" },
      { shipnityVariantId: "eliquid-62-4", rawLabel: "Strawberry Twist" },
      { shipnityVariantId: "eliquid-62-5", rawLabel: "Big Cola" },
      { shipnityVariantId: "eliquid-62-6", rawLabel: "Peach" },
    ],
  },
];
