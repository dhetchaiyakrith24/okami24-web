/**
 * OKami24 — approved selling prices for LEGACY catalog products (`src/data/products/*`).
 *
 * Companion to `publication-approvals.ts`, which does the same job for ProductMaster records.
 * The legacy `Product` type deliberately has no price field (docs/BUSINESS_SOURCE_OF_TRUTH.md §5:
 * the final selling price is the owner's call, never a field silently copied from a supplier
 * record) — so, exactly like the ProductMaster side, a price lives ONLY here, as an explicit,
 * auditable approval. No entry = no price = the product stays browse-only (no cart button), which
 * is what every legacy product was until 2026-09-05.
 *
 * SOURCE (owner instruction, 2026-09-05): the owner's Shipnity export `Data_31-08-2026.xlsx`
 * (988 child-SKU rows, one "ราคาขาย" per parent group) is the price source for this file. The
 * owner's rule for this pass: never guess a price — a legacy product only gets an entry when its
 * Shipnity parent group can be identified with real evidence, cited per entry below. Products the
 * export doesn't cover (or covers only ambiguously) are NOT here; they're listed for the owner in
 * the 2026-09-05 report instead.
 *
 * Every price here equals the export's "ราคาขาย" for that parent group verbatim (all children of a
 * group share one price in the export). `shipnityProductId` is the parent code in that export, and
 * `evidence` says how the legacy product was matched to it:
 *   - "exact-legacy-match": the projection adapter already records this parent as an exact
 *     duplicate of the legacy product (`exactLegacyMatch` in active-catalog-to-product-master.ts).
 *   - "active-parent-name": the parent's own Shipnity name (active-catalog-source.ts) IS the
 *     legacy product's name, and its child option names match the legacy variant list.
 *   - "child-option-match": the parent has no Shipnity name in project data (historical group);
 *     matched because its child option names coincide with the legacy variant list (counts given).
 *     These are the weakest tier and are flagged for the owner's confirmation in the report.
 *
 * `src/lib/catalog-index.ts` reads this to fill `sellingPrice` for legacy items, which is what
 * `resolveProductRef()` (the cart/checkout money boundary) checks — so adding an entry here is the
 * literal act of making a legacy product purchasable. Treat it with the same care as
 * `publication-approvals.ts` and `docs/BUSINESS_SOURCE_OF_TRUTH.md`.
 *
 * PRICES ROUND (owner order, 2026-09-21): every legacy product must show a real price, so the
 * remaining 29 products got an entry. Two bases now exist, tagged per entry by `basis`:
 *   - "shipnity": the price is the "ราคาขาย" of an identified Shipnity parent (the 16 entries of
 *     2026-09-05 plus 9 read by Cowork from the Shipnity back-office screenshots of 2026-09-21).
 *   - "owner-estimate": no Shipnity parent exists yet; the owner set the price on 2026-09-21 from
 *     the rule "disposables: not below vapenow.shop, round numbers · pod systems: vapenow.shop
 *     price when listed there, otherwise market price ±50–100". `shipnityProductId` is null and
 *     `evidence` starts with "owner-estimate 2026-09-21:" followed by the owner's reasoning.
 *     These are placeholders to be overwritten in one place when the stock API arrives.
 * ADMIN PRICE LIST (owner ruling 2026-10-06, HANDOFF §18 "Selling prices"): the admin's current selling prices (17 rows,
 * owner-confirmed 2026-10-01; the list itself stays outside git) replace the site's prices. A third basis:
 *   - "owner-confirmed": the owner's own current selling price. It outranks the Shipnity "ราคาขาย" and is NOT a
 *     placeholder — the stock API must not overwrite it. `shipnityProductId` keeps the matched parent (or null); `evidence`
 *     starts with "owner-confirmed <ISO date>:", names the list row and the old price, then keeps the original match note.
 * `basis` is an internal tag only — no component reads it and no customer ever sees it.
 */

export type LegacyPriceBasis = "shipnity" | "owner-estimate" | "owner-confirmed";

export interface LegacyPriceApproval {
  /** THB, integer. The price a customer pays — verbatim "ราคาขาย" of the matched Shipnity parent, the owner's estimate, or the owner's confirmed price. */
  sellingPrice: number;
  /** ISO date the price was reviewed/approved. */
  lastPriceReview: string;
  /** Shipnity parent code, e.g. "Pod-168". `null` when `basis` is "owner-estimate" (optional for "owner-confirmed"). */
  shipnityProductId: string | null;
  /** Where the number comes from — see the header ("shipnity" | "owner-estimate" | "owner-confirmed"). Internal only. */
  basis: LegacyPriceBasis;
  /** How the legacy product was matched to that parent — see the header for the three tiers. */
  evidence: string;
}

export const LEGACY_APPROVED_PRICING: Record<string, LegacyPriceApproval> = {
  // ---- Tier 1: exact legacy duplicates already recorded by the projection adapter ------------
  "caliburn-g4-pro": {
    sellingPrice: 1190,
    lastPriceReview: "2026-09-05",
    basis: "shipnity",
    shipnityProductId: "Pod-181",
    evidence: 'exact-legacy-match: Shipnity "Caliburn G4 Pro" (Pod-168, 4 colours, ฿1190) — exactLegacyMatch in active-catalog-to-product-master.ts; re-verified 2026-09-21: price unchanged ฿1,190; parent re-coded Pod-168 → Pod-181',
  },
  "argus-g4": {
    sellingPrice: 1100,
    lastPriceReview: "2026-10-06",
    basis: "owner-confirmed",
    shipnityProductId: "Pod-179",
    evidence: 'owner-confirmed 2026-10-06: admin current-price list row "Argus G4" ฿1090 → ฿1100 · match was — exact-legacy-match: Shipnity "Voopoo Argus G4" (Pod-179, 6 colours, ฿1090); 6 of 6 Excel colour names are in the legacy colour list',
  },
  "vmate-i3": {
    sellingPrice: 800,
    lastPriceReview: "2026-10-06",
    basis: "owner-confirmed",
    shipnityProductId: "Pod-177",
    evidence: 'owner-confirmed 2026-10-06: admin current-price list row "Vmate i3" ฿690 → ฿800 · match was — exact-legacy-match: Shipnity "Vmate i3" (Pod-177, 5 colours, ฿690); 5 of 5 Excel colour names are in the legacy colour list',
  },
  "zero-pro": {
    sellingPrice: 1090,
    lastPriceReview: "2026-10-29",
    basis: "owner-confirmed",
    shipnityProductId: "Pod-178",
    evidence: 'owner-confirmed 2026-10-29: new catalogue image prints ฿1,090 (Max cost ฿990 +10%, owner chose it 28 Oct) ฿990 → ฿1,090 · match was — exact-legacy-match: Shipnity "Marbo Zero Pro" (Pod-178, 8 colours, ฿990) — pre-rebrand name of SALTHUB Zero Pro; 6 of 8 Excel colour names match',
  },
  "zero-cartridge": {
    sellingPrice: 139,
    lastPriceReview: "2026-10-29",
    basis: "owner-confirmed",
    shipnityProductId: "Pod-85",
    evidence: 'owner-confirmed 2026-10-29: new catalogue image prints ฿139 (Max cost ฿129 +8%, owner chose it 28 Oct) ฿150 → ฿139 · earlier: owner-confirmed 2026-10-06: admin current-price list row "หัว Marbo Zero" ฿129 → ฿150 · match was — exact-legacy-match: Shipnity "หัวพอต Marbo Zero" (Pod-85, 31 flavours, ฿129) — the Zero pod head; both legacy flavours are in the Excel list',
  },
  "m-bar-9k": {
    sellingPrice: 350,
    lastPriceReview: "2026-10-06",
    basis: "owner-confirmed",
    shipnityProductId: "Disposable-25",
    evidence: 'owner-confirmed 2026-10-06: admin current-price list row "Marbo 9K" ฿349 → ฿350 · match was — exact-legacy-match: Shipnity "Marbo Bar 9K" (Disposable-25, 23 flavours, ฿349); 21 of 22 legacy flavours are in the Excel list',
  },
  "m-switch-pod": {
    sellingPrice: 400,
    lastPriceReview: "2026-10-06",
    basis: "owner-confirmed",
    shipnityProductId: "Pod-147",
    evidence: 'owner-confirmed 2026-10-06: admin current-price list row "หัว M Bar 15K" ฿349 → ฿400 · match was — exact-legacy-match: Shipnity "M Switch 15k" (Pod-147, 17 flavours, ฿349) — the prefilled cartridge; 16 of 18 legacy flavours are in the Excel list',
  },

  // ---- Tier 2: the Shipnity parent's own name is the legacy product (Unbranded tier) --------
  "mood-monster-14k": {
    sellingPrice: 350,
    lastPriceReview: "2026-09-05",
    basis: "shipnity",
    shipnityProductId: "Disposable-37",
    evidence: 'active-parent-name: Shipnity "MOOOD Monster 14K Puffs" (Disposable-37, 23 flavours, ฿350); 10 of 10 legacy flavours are in the Excel list',
  },
  "muro-space-15k": {
    sellingPrice: 329,
    lastPriceReview: "2026-09-05",
    basis: "shipnity",
    shipnityProductId: "Disposable-38",
    evidence: 'active-parent-name: Shipnity "Muro Space 15k" (Disposable-38, 15 flavours, ฿329); 5 of 5 legacy flavours are in the Excel list',
  },
  "muro-3ml": {
    sellingPrice: 150,
    lastPriceReview: "2026-10-06",
    basis: "owner-confirmed",
    shipnityProductId: "Pod-120",
    evidence: 'owner-confirmed 2026-10-06: admin current-price list row "หัว Muro 3 ml" ฿99 → ฿150 · match was — active-parent-name: Shipnity "Muro 3 ML" (Pod-120, 14 flavours, ฿99); 10 of 10 legacy flavours are in the Excel list; re-verified 2026-09-21 against vapenow.shop (฿99); Shipnity parent Pod-120 not in the 21/09 listing',
  },
  "muro-sc-8000": {
    sellingPrice: 300,
    lastPriceReview: "2026-10-06",
    basis: "owner-confirmed",
    shipnityProductId: "Pod-166",
    evidence: 'owner-confirmed 2026-10-06: admin current-price list row "Muro SC 8000 Puff" ฿259 → ฿300 · match was — active-parent-name: Shipnity "Muro SC 8000 Puffs" (Pod-166, 12 flavours, ฿259); 8 of 8 legacy flavours are in the Excel list',
  },
  "muro-connector-20k": {
    sellingPrice: 300,
    lastPriceReview: "2026-10-06",
    basis: "owner-confirmed",
    shipnityProductId: "Pod-171",
    evidence: 'owner-confirmed 2026-10-06: admin current-price list row "Muro Connector 20K" ฿259 → ฿300 · match was — active-parent-name: Shipnity "Muro Connector 20k" (Pod-171, 33 flavours, ฿259); 20 of 20 legacy flavours are in the Excel list',
  },
  "vazer-one-pod": {
    sellingPrice: 80,
    lastPriceReview: "2026-10-30",
    basis: "owner-confirmed",
    shipnityProductId: "Pod-115",
    evidence: 'owner-confirmed 2026-10-30: chat "Vazer one แก้ราคาเป็นชิ้นละ 80 ครับ" (after Friday reported cost ฿80 vs sale ฿59 from the Shipnity Pro cost file) ฿59 → ฿80 · earlier: shipnity-max: "หัวพอต Vazer One" (Pod-115, ฿59 ราคาขาย, 5 flavours: Grape · Cola · Cola Lemon · Mix Berries · Mango) — Shipnity Max product list read 2026-10-20 (maxlist round); same price as the 2026-09-05 read',
  },
  "reswa-sportcan-12k": {
    sellingPrice: 229,
    lastPriceReview: "2026-09-05",
    basis: "shipnity",
    shipnityProductId: "Pod-142",
    evidence: 'active-parent-name: Shipnity "Reswa Sportcan 12k" (Pod-142, 5 flavours, ฿229); 3 of 3 legacy flavours are in the Excel list',
  },

  // ---- Tier 3: historical parent (no Shipnity name in project data), matched by option names --
  // Flagged for owner confirmation in the 2026-09-05 report; remove the entry to revert the product
  // to browse-only if the match is wrong.
  "joiway-f3": {
    sellingPrice: 350,
    lastPriceReview: "2026-10-06",
    basis: "owner-confirmed",
    shipnityProductId: "Pod-133",
    evidence: 'owner-confirmed 2026-10-06: admin current-price list row "Joiway F3" ฿329 → ฿350 · match was — child-option-match: Pod-133 (20 flavours, ฿329, Excel remaining 0 on 31-08). 15 of the 16 original Joiway F3 flavours are in its list (only "Funta Grape" absent — Excel has "Funta Green", the known Grape/Green naming question); the other Excel-only name is "Vodka" vs legacy "Vodak". No other Excel group overlaps F3 by more than 6 names.',
  },
  "m-bar-10k": {
    sellingPrice: 400,
    lastPriceReview: "2026-10-06",
    basis: "owner-confirmed",
    shipnityProductId: "Pod-172",
    evidence: 'owner-confirmed 2026-10-06: admin current-price list row "Marbo 10K" ฿379 → ฿400 · match was — child-option-match: Pod-172 (12 flavours, ฿379). 11 of 12 Excel flavours are in the legacy M Bar 10K list (Excel-only: "Matcha Late"); the runner-up group (Pod-156, ฿550) overlaps only 6 of 12.',
  },

  // ---- Prices round 2026-09-21, basis "shipnity": 9 parents read by Cowork from the Shipnity ----
  // ---- back-office screenshots of 2026-09-21 (9 pages; owner's instruction file, table ก) -------
  "infy-20k": {
    sellingPrice: 399,
    lastPriceReview: "2026-10-29",
    basis: "owner-confirmed",
    shipnityProductId: "Pod-170",
    evidence: 'owner-confirmed 2026-10-29: new catalogue image prints ฿399 (cost ฿369 +8%, owner chose option A; Javis photo studio product.md) ฿400 → ฿399 · earlier: owner-confirmed 2026-10-06: admin chat "INFY 20K … 400 ฿" (owner rule: an admin-reported price applies) ฿369 → ฿400 · match was — shipnity-backoffice: "Infy 20000" (Pod-170, ฿369) — Shipnity backoffice screenshots 2026-09-21 (Cowork read, 9 pages)',
  },
  "relx-smash-go-12k": {
    sellingPrice: 320,
    lastPriceReview: "2026-10-06",
    basis: "owner-confirmed",
    shipnityProductId: "Disposable-39",
    evidence: 'owner-confirmed 2026-10-06: admin current-price list row "RELX Smash Go 12K" ฿299 → ฿320 · match was — shipnity-backoffice: "RELX Smash GO 12K" (Disposable-39, ฿299) — Shipnity backoffice screenshots 2026-09-21 (Cowork read, 9 pages)',
  },
  "relx-infinity-2-plus": {
    sellingPrice: 990,
    lastPriceReview: "2026-10-16",
    basis: "owner-confirmed",
    shipnityProductId: "Pod-105",
    evidence: 'owner-confirmed 2026-10-16: owner item 69 "ใส่ตามคลัง" — Shipnity Max "RELX Infinity 2 Plus" (Pod-105, ฿990), every option out of stock that day — the page shows the price with the sold-out state',
  },
  "relx-creator": {
    sellingPrice: 250,
    lastPriceReview: "2026-09-21",
    basis: "shipnity",
    shipnityProductId: "Pod-138",
    evidence: 'shipnity-backoffice: "Relx Creator (เครื่อง)" (Pod-138, ฿250) — the device; the legacy record is modelled as the 22K device generation, not the prefilled pod (Pod-137 "Relx Creator Pod 20K" ฿349) — Shipnity backoffice screenshots 2026-09-21 (Cowork read, 9 pages)',
  },
  "m-switch-kit": {
    sellingPrice: 600,
    lastPriceReview: "2026-10-06",
    basis: "owner-confirmed",
    shipnityProductId: "Pod-156",
    evidence: 'owner-confirmed 2026-10-06: admin current-price list row "M Switch Kit" ฿550 → ฿600 · match was — shipnity-backoffice: "ชุดเซ็ท M Switch 15k" (Pod-156, ฿550) — the device + pod set — Shipnity backoffice screenshots 2026-09-21 (Cowork read, 9 pages)',
  },
  "tfit-m-power-20k": {
    sellingPrice: 349,
    lastPriceReview: "2026-10-29",
    basis: "owner-confirmed",
    shipnityProductId: "Disposable-41",
    evidence: 'owner-confirmed 2026-10-29: new catalogue image prints ฿349 (Max cost ฿320 +9%, owner chose option A) ฿350 → ฿349 · earlier: owner-confirmed 2026-10-19: owner in chat "Tfit M power ราคา 350.- ครับ แก้เลยครับ" ฿320 → ฿350 (Max says ฿320 for Disposable-41 and its 11 flavours until the admin updates it) · match was — shipnity-backoffice: "TFIT M Power 20000" (Disposable-41, ฿320) — Shipnity backoffice screenshots 2026-09-21 (Cowork read, 9 pages)',
  },
  "foli-bar-15k": {
    sellingPrice: 349,
    lastPriceReview: "2026-10-21",
    basis: "shipnity",
    shipnityProductId: "Disposable-42",
    evidence: 'shipnity-backoffice: "Foli Bar 15k" (Disposable-42, ฿349) — Shipnity backoffice screenshots 2026-09-21 (Cowork read, 9 pages)',
  },
  "next-pro-2-beyond": {
    sellingPrice: 790,
    lastPriceReview: "2026-09-21",
    basis: "shipnity",
    shipnityProductId: "Pod-173",
    evidence: 'shipnity-backoffice: "Next Pro 2 Beyond" (Pod-173, ฿790) — Shipnity backoffice screenshots 2026-09-21 (Cowork read, 9 pages)',
  },
  "muro-freebase": {
    sellingPrice: 250,
    lastPriceReview: "2026-10-22",
    basis: "owner-confirmed",
    shipnityProductId: "Eliquid-169",
    evidence: 'owner-confirmed 2026-10-22: admin ICE\'s LINE 22/10 15.45 "Muro FREEBASE แก้จาก 220. เป็น 250.-", forwarded by the owner "แก้เรื่องราคาตามแอดมินพี่แจ้งมา" — every flavour; Max says ฿220 until the admin updates it · was — shipnity-max:"Muro Freebase" (Eliquid-169, ฿220 ราคาขาย, every child) — Shipnity Max product list read 2026-10-17 (MAX_SEED in max-seed.ts); was ฿250 in the 2026-09-21 backoffice read',
  },
  "muro-salt-nic": {
    sellingPrice: 250,
    lastPriceReview: "2026-10-20",
    basis: "shipnity",
    shipnityProductId: "ELQ-4",
    evidence: 'shipnity-max: "Muro Salt Nic" (ELQ-4, ฿250 ราคาขาย) — Shipnity Max product list read 2026-10-20 (maxlist round); was eliquid-62 in the 2026-09-21 backoffice read, same price',
  },

  // ---- Prices round 2026-09-21, basis "owner-estimate": 20 products with no Shipnity parent ----
  // ---- yet. Owner ruled the numbers on 2026-09-21 (instruction file, table ข); to be replaced ----
  // ---- by the real price in this one place when the stock API arrives. -----------------------
  "caliburn-g5": {
    sellingPrice: 1190,
    lastPriceReview: "2026-09-21",
    basis: "owner-estimate",
    shipnityProductId: null,
    evidence: "owner-estimate 2026-09-21: not on vapenow · G4 Pro 1,190 (vapenow) · US retail G5 ≈ G4 Pro",
  },
  "caliburn-g5-lite": {
    sellingPrice: 890,
    lastPriceReview: "2026-09-21",
    basis: "owner-estimate",
    shipnityProductId: null,
    evidence: "owner-estimate 2026-09-21: not on vapenow · Lite one step below the full model",
  },
  "caliburn-g5-lite-se": {
    sellingPrice: 790,
    lastPriceReview: "2026-09-21",
    basis: "owner-estimate",
    shipnityProductId: null,
    evidence: "owner-estimate 2026-09-21: not on vapenow · SE one step below Lite",
  },
  "caliburn-g4": {
    sellingPrice: 1090,
    lastPriceReview: "2026-09-21",
    basis: "owner-estimate",
    shipnityProductId: null,
    evidence: "owner-estimate 2026-09-21: not on vapenow · not below G3 1,090 (vapenow) · below G4 Pro",
  },
  "caliburn-g4-mini": {
    sellingPrice: 690,
    lastPriceReview: "2026-09-21",
    basis: "owner-estimate",
    shipnityProductId: null,
    evidence: "owner-estimate 2026-09-21: not on vapenow · US retail ≈ 40% of G4 Pro",
  },
  "caliburn-g4-classic": {
    sellingPrice: 1090,
    lastPriceReview: "2026-09-21",
    basis: "owner-estimate",
    shipnityProductId: null,
    evidence: "owner-estimate 2026-09-21: not on vapenow · in line with G4",
  },
  "caliburn-g4-pro-koko": {
    sellingPrice: 1190,
    lastPriceReview: "2026-09-21",
    basis: "owner-estimate",
    shipnityProductId: null,
    evidence: "owner-estimate 2026-09-21: not on vapenow · = G4 Pro (vapenow 1,190)",
  },
  "caliburn-g3-pro": {
    sellingPrice: 1090,
    lastPriceReview: "2026-09-21",
    basis: "owner-estimate",
    shipnityProductId: null,
    evidence: "owner-estimate 2026-09-21: not on vapenow · not below G3 1,090 (vapenow)",
  },
  "caliburn-g3-pro-koko": {
    sellingPrice: 1090,
    lastPriceReview: "2026-09-21",
    basis: "owner-estimate",
    shipnityProductId: null,
    evidence: "owner-estimate 2026-09-21: not on vapenow · = G3 Pro",
  },
  "argus-g4-mini": {
    sellingPrice: 890,
    lastPriceReview: "2026-09-21",
    basis: "owner-estimate",
    shipnityProductId: null,
    evidence: "owner-estimate 2026-09-21: not on vapenow · Argus G4 1,090 (vapenow) − 200",
  },
  "argus-p3": {
    sellingPrice: 1090,
    lastPriceReview: "2026-09-21",
    basis: "owner-estimate",
    shipnityProductId: null,
    evidence: "owner-estimate 2026-09-21: not on vapenow · Argus P2 990 (vapenow) + 100",
  },
  "argus-g3-mini": {
    sellingPrice: 790,
    lastPriceReview: "2026-09-21",
    basis: "owner-estimate",
    shipnityProductId: null,
    evidence: "owner-estimate 2026-09-21: not on vapenow · one step below G4 mini",
  },
  "drag-6": {
    sellingPrice: 2490,
    lastPriceReview: "2026-09-21",
    basis: "owner-estimate",
    shipnityProductId: null,
    evidence: "owner-estimate 2026-09-21: not on vapenow · market price of a top-tier mod",
  },
  "drag-s3": {
    sellingPrice: 1490,
    lastPriceReview: "2026-09-21",
    basis: "owner-estimate",
    shipnityProductId: null,
    evidence: "owner-estimate 2026-09-21: not on vapenow · market price",
  },
  "drag-x3": {
    sellingPrice: 1590,
    lastPriceReview: "2026-09-21",
    basis: "owner-estimate",
    shipnityProductId: null,
    evidence: "owner-estimate 2026-09-21: not on vapenow · market price · one step above S3",
  },
  "vinci-s": {
    sellingPrice: 1290,
    lastPriceReview: "2026-09-21",
    basis: "owner-estimate",
    shipnityProductId: null,
    evidence: "owner-estimate 2026-09-21: not on vapenow · = Argus Pro 2 1,290 (vapenow), same tier",
  },
  "joiway-f4": {
    sellingPrice: 349,
    lastPriceReview: "2026-09-21",
    basis: "owner-estimate",
    shipnityProductId: null,
    evidence: "owner-estimate 2026-09-21: not on vapenow · F3 329 (vapenow) + 20, round number",
  },
  "m-bar-15k": {
    sellingPrice: 349,
    lastPriceReview: "2026-09-21",
    basis: "owner-estimate",
    shipnityProductId: null,
    evidence: "owner-estimate 2026-09-21: not on vapenow · M Switch 15k 349 (vapenow), same family",
  },
  "m-bar-pod": {
    sellingPrice: 129,
    lastPriceReview: "2026-09-21",
    basis: "owner-estimate",
    shipnityProductId: null,
    evidence: "owner-estimate 2026-09-21: not on vapenow · Marbo Zero pod head 129 / Infy pod head 129 (Shipnity)",
  },
  "zero-nano": {
    sellingPrice: 590,
    lastPriceReview: "2026-09-21",
    basis: "owner-estimate",
    shipnityProductId: null,
    evidence: "owner-estimate 2026-09-21: not on vapenow · below Zero Pro 990 (Shipnity) by size",
  },

  // ---- Image-fix round 2026-09-30: owner in chat — "ทำราคาได้เลย ทำทุกอย่างให้เป็นสินค้าตัวนึงละขึ้นว่าหมด" (set a
  // ---- price, make it a normal product, show it sold out). Every flavour is on the sold-out list, so nothing is orderable.
  "wotofo-nexbar-18k": {
    sellingPrice: 359,
    lastPriceReview: "2026-09-30",
    basis: "owner-estimate",
    shipnityProductId: null,
    evidence: "owner-estimate 2026-09-30: owner delegated the number to Friday · same 18K disposable class as nexBar CLEAR 18K (Pod-180, ฿359 in Shipnity)",
  },
};

/** Convenience accessor — `null` when a legacy product has no approved price (browse-only). */
export function getLegacyApprovedPrice(slug: string): number | null {
  return LEGACY_APPROVED_PRICING[slug]?.sellingPrice ?? null;
}
