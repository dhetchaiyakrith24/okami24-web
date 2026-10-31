/**
 * OKami24 — Publication pipeline: the ONLY place a ProductMaster candidate can become
 * genuinely customer-visible in production.
 *
 * This is deliberately the single, small, auditable source of truth for "has this specific
 * product's final selling price been approved for real publication." An entry here is the real,
 * approved price and when it was set. No entry means "not approved" — the only state this file
 * can express is explicit approval, never a partial/pending one (that's what DEV preview via
 * `PREVIEW_SHIPNITY_IDS` in storefront-preview-read-model.ts already is).
 *
 * PRICING RULE (updated 2026-09-01): a normal, unambiguous current price already present in
 * authoritative project/Shipnity data (`operationalSellingPrice` in active-catalog-source.ts) IS
 * a valid final selling price and does not require a separate manual sign-off round — copied here
 * deliberately, with the evidence cited in each entry's comment, not silently defaulted. Price
 * approval is still withheld (left as a genuine blocker, not auto-filled) whenever the data
 * conflicts internally, multiple authoritative prices disagree, the price is missing/ambiguous, or
 * the owner explicitly overrides it — see each entry's comment for which case applies.
 *
 * `active-catalog-to-product-master.ts` reads this to set `publicationStatus`/`pricing` on the
 * real candidate — never the reverse; nothing here ever mutates the seed data. Downstream,
 * `buildPublishedCatalog()` (storefront-preview-read-model.ts) re-validates every "published"
 * candidate against the full readiness rule set (identity, content, media, price — see
 * `validateProductMasterRegistry`) before it can appear anywhere, so an entry here is necessary
 * but not sufficient on its own: a genuinely incomplete product added here would fail loudly
 * (a thrown error, not a silent leak) rather than publish anyway.
 *
 * Adding a real entry here is the actual, literal act of approving a product for publication;
 * treat it with the same care as editing `docs/BUSINESS_SOURCE_OF_TRUTH.md`.
 */

export interface PublicationApproval {
  /** The approved final selling price — either an explicit owner override, or (per the pricing
   *  rule above) copied from a normal, unambiguous `priceReference` when there's no conflict.
   *  This IS the price a customer would pay. */
  sellingPrice: number;
  /** ISO date this price was reviewed/approved. Required alongside the price itself so a stale
   *  approval is at least visible in the data, even though nothing currently expires it. */
  lastPriceReview: string;
}

export const OWNER_APPROVED_PUBLICATION: Record<string, PublicationApproval> = {
  // First real publication approval (2026-09-01). Owner approved Coil-56-1/56-2/56-3 at ฿300
  // each; the current active (have_stock=true) seed has only ONE in-stock child, Coil-56-3
  // (Silver) — see active-catalog-source.ts. Pricing is a product-level field here (variants only
  // carry an OPTIONAL pricingOverride), so this single entry correctly represents the owner's
  // approval regardless of how many of the three named children are currently in stock. Coil-56-1
  // and Coil-56-2 are NOT fabricated as variants — they simply are not in the current evidence;
  // see the publication-pipeline memory / final mission report for the flagged discrepancy.
  "Coil-56": { sellingPrice: 300, lastPriceReview: "2026-09-01" },
  // Published under the updated pricing rule (2026-09-01): a single, unambiguous
  // operationalSellingPrice in active-catalog-source.ts, no conflicting price found anywhere else
  // in the project. Media/spec/identity/content readiness already verified — see the
  // publication-pipeline memory and TAXONOMY_MATCHES/VERIFIED_MEDIA/VERIFIED_SPECIFICATIONS
  // entries in active-catalog-to-product-master.ts.
  "Coil-74": { sellingPrice: 250, lastPriceReview: "2026-09-01" },
  "Coil-89": { sellingPrice: 350, lastPriceReview: "2026-09-01" },
  // Same pricing rule, same-session second wave: real tier-2 media closed the last gap (see
  // VERIFIED_MEDIA["Coil-38"]). Single unambiguous operationalSellingPrice, applies uniformly to
  // both real children (DM2 0.2Ω, DM4 0.3Ω) — Shipnity gives one price per parent, not per
  // variant, same as every other published product here.
  "Coil-38": { sellingPrice: 450, lastPriceReview: "2026-09-01" },
  // Same pricing rule, third wave: real tier-2 media closed the gap (see VERIFIED_MEDIA["Coil-92"]
  // — the resistance/wattage is etched directly on the photographed coil, no variant ambiguity).
  // Single unambiguous operationalSellingPrice.
  "Coil-92": { sellingPrice: 150, lastPriceReview: "2026-10-24" }, // owner override 2026-10-24 (from the admin, in chat): "coil voopoo pnp x จาก 130 เป็น 150 บาท" (was ฿130 = Max ราคาขาย per coil, round list19 19/10, back with a new card — see below; the ฿400 box of 5 is not an option)
  //   ^ WITHDRAWN 2026-09-06 (owner decision, LAUNCH_AUDIT item 11): the only card image has
  //     warped lettering on the coil (looks AI-generated) — not fit to sell from. Entry removed
  //     = the literal unpublish action (same mechanism as IQOSHEET-15 below); all Coil-92 data,
  //     media and copy stay in place. Re-add this line to republish once a real photo exists.
  // Same pricing rule, fourth wave: real tier-2 media closed the gap (see
  // VERIFIED_MEDIA["Coil-55"] — the retail box explicitly reads "CALIBURN G2 Empty Cartridge" /
  // "2 PCS", matching this record's real identity and child count exactly). Single unambiguous
  // operationalSellingPrice.
  "Coil-55": { sellingPrice: 250, lastPriceReview: "2026-10-06" }, // owner override 2026-10-06: admin list row "Tang Caliburn G2" (was ฿299)
  // Same pricing rule, fifth wave: real tier-2 media closed the gap AND resolved the resistance-
  // identity conflict in the same source (see VERIFIED_MEDIA["Coil-53"] / TAXONOMY_MATCHES["Coil-53"]
  // — the retail box explicitly reads "1 Ω", and myuwell.com's own Caliburn G2 page confirms 1.0Ω
  // as a real, G2-compatible UWELL coil resistance). Single unambiguous operationalSellingPrice.
  "Coil-53": { sellingPrice: 450, lastPriceReview: "2026-10-19" }, // owner override 2026-10-06: admin list row "Coil Caliburn G" + owner in chat "450 เหมือนกัน" (was ฿550) · owner re-confirmed ฿450 on 2026-10-19 (chat "1 450"; Max lists ฿550)
  // Full-catalog mission (2026-09-02): second media wave closed the gap for 7 more taxonomy-
  // resolved candidates (see VERIFIED_MEDIA entries in active-catalog-to-product-master.ts).
  // Same pricing rule throughout: single, unambiguous operationalSellingPrice, no conflicting
  // price found anywhere else in the project.
  "Coil-68": { sellingPrice: 300, lastPriceReview: "2026-09-02" },
  // "Coil-63": { sellingPrice: 350, lastPriceReview: "2026-09-02" },
  //   ^ WITHDRAWN 2026-09-06 (owner decision, LAUNCH_AUDIT item 11): card image carries another
  //     shop's text baked into the picture. Entry removed = unpublished; data/media/copy kept.
  //     Re-add this line to republish once a clean photo exists.
  "Coil-1": { sellingPrice: 150, lastPriceReview: "2026-10-06" }, // owner override 2026-10-06: admin list row "Coil Voopoo Vinci" (was ฿130)
  "Coil-72": { sellingPrice: 300, lastPriceReview: "2026-10-06" }, // owner override 2026-10-06: admin list row "Coil Vmate" (was ฿350)
  "Coil-94": { sellingPrice: 450, lastPriceReview: "2026-09-02" },
  "Pod-159": { sellingPrice: 550, lastPriceReview: "2026-10-16" }, // admin ICE on LINE 2026-10-16, forwarded by the owner: "ปรับราคาเป็น 550" (was ฿450; owner rule 06/10: an admin-reported price applies at once)
  "coil-54": { sellingPrice: 250, lastPriceReview: "2026-09-02" },
  // Heated-tobacco wave — same pricing rule, same full readiness (identity/brand/category/media/
  // price all real and cited — see TAXONOMY_MATCHES/VERIFIED_MEDIA/VERIFIED_SPECIFICATIONS
  // entries). IQOSHEET-17 ("Iqos iluma one") is DELIBERATELY EXCLUDED from this table — not a
  // business-scope hesitation (that question is settled), but a genuine, specific data conflict:
  // its 2 active children (Pebble Grey / Breeze Blue) are two different real hardware generations
  // with different real specs, incorrectly conflated under one Shipnity parent. Publishing it would
  // mean shipping one card image/spec sheet that is factually wrong for whichever child a customer
  // didn't get — the same "never misrepresent a variant" rule this whole file already enforces
  // everywhere else. Needs either a Shipnity-side split into two real parents, or owner
  // clarification on which generation is actually stocked, before this can honestly publish.
  //
  // Catalog-intelligence mission (2026-09-02) re-confirmed the block with much stronger evidence
  // (see TAXONOMY_MATCHES["IQOSHEET-17"]'s comment: distinct PMI SKU codes, negative-control 404s
  // across 5 markets, visibly different chassis) and ALSO found the PRICING RULE ITSELF cannot
  // responsibly apply here, independent of the identity conflict: this file's rule auto-approves
  // "a normal, unambiguous current price" — but a single ฿2900 covering what real-world evidence
  // shows are TWO DIFFERENTLY-PRICED products (ILUMA i ONE retails above the original ILUMA ONE at
  // every market checked) is not an unambiguous price for either one specifically; approving ฿2900
  // for whichever generation turns out to be correct would be a guess dressed as a citation. This
  // is exactly the "ambiguous ... price" carve-out in this file's own header comment, not an
  // oversight. Splitting this into two real ProductMaster records would also require the
  // projection pipeline (`active-catalog-to-product-master.ts`) to support one Shipnity parent
  // producing more than one candidate, which it deliberately does not today (see that file's
  // 1-parent-to-1-candidate `projectParent`) — building that capability for one blocked SKU would
  // be disproportionate engineering for a record that is blocked on genuine business/physical-
  // stock facts anyway, not on missing code.
  //
  // OWNER DECISION NEEDED, precisely: (1) confirm which physical generation is actually in stock
  // for "Pebble Grey" and "Breeze Blue" — note "Pebble Grey" itself is ambiguous between the
  // original ILUMA ONE (SKU G0000592) and a later "ILUMA ONE Refreshed" (SKU G0001811), both sold
  // in that color; (2) provide the real, separate selling price for whichever generation(s) are
  // actually stocked — Shipnity's single ฿2900 cannot be trusted to apply to either specifically.
  // No official IQOS Thailand storefront exists to resolve this independently (th.iqos.com does
  // not resolve; iqos.com/th/* 404s) — this is not resolvable by further web research.
  //
  // RESOLVED round list19 (2026-10-17) — the block above is history. Friday ruled the record = IQOS ILUMA i ONE (the in-stock
  // "Breeze Blue" child); the original-ILUMA-ONE child is kept off it (OTHER_MODEL_CHILDREN, active-catalog-to-product-master.ts).
  // Price = Shipnity MAX "ราคาขาย" for the parent and for the Breeze Blue child (IQOSHEET-17-3): ฿2,900 in the Max product
  // list read 2026-10-08 (_incoming/stock-api/shipnity-max-products-2026-10-08.json) and again on 2026-10-17 (the warehouse-
  // listing chat). Owner rule for the warehouse products: price = the warehouse "ราคาขาย" (owner list item 41, BSOT §4
  // "ใส่ตามคลัง"). The other Max children (Oasis Limited ฿3,200 · Bright) are not mapped to this record — no IQOS evidence yet.
  "IQOSHEET-17": { sellingPrice: 2900, lastPriceReview: "2026-10-17" },
  // Catalog-intelligence mission (2026-09-02) — fourth media wave. Same pricing rule throughout:
  // a single, unambiguous `operationalSellingPrice` in active-catalog-source.ts with no conflicting
  // price anywhere else in the project. What changed for each of these is MEDIA plus, in three
  // cases, a real identity/taxonomy correction — see the TAXONOMY_MATCHES / VERIFIED_MEDIA /
  // VERIFIED_SPECIFICATIONS comments for the citation trail:
  //   Coil-70  — dotmod dotCoil 0.7Ω; confirmed a genuine BARE COIL (5 blister-packed brass heads
  //              visible), resistance + wattage printed on the box in frame.
  //   Coil-83  — reclassified coil -> EMPTY POD CARTRIDGE; box reads "ARGUS POD / Empty Cartridge /
  //              2pcs / 2.0mL", an exact match to the "1 box of 2 heads" child.
  //   Coil-87  — the long-standing Black-vs-Gunmetal ambiguity resolved: both are real VOOPOO
  //              colorways, and "BLACK" is printed on VOOPOO's own box in the sourced photo.
  //   Pod-169  — INFY Plus 2.5ml; first-party brand media and a first-party capacity spec, closing
  //              a blocker that two earlier sessions had recorded as a dead end.
  "Coil-70": { sellingPrice: 390, lastPriceReview: "2026-09-02" },
  "Coil-83": { sellingPrice: 250, lastPriceReview: "2026-09-02" },
  "Coil-87": { sellingPrice: 250, lastPriceReview: "2026-09-02" },
  // REPUBLISHED round list19 (2026-10-18, owner "list everything", through Friday — also lifts the 22/10 GSC hold on /brands/infy):
  // an OKami24 re-shoot of one clear INFY PLUS pod (Grape Jelly, a flavour sold here) replaces the withdrawn box line-up.
  // Price ฿150 for Pod-169 and every child — OWNER OVERRIDE 2026-10-30: the owner forwarded admin ICE's request in chat
  // ("แอดมินฝากงานแก้ราคามาครับ" · ICE: "พี่ครับเป็น150.- ให้หน่อยครับ", screenshot of this page at ฿129). Was Shipnity MAX ราคาขาย ฿129 (17/10 read).
  "Pod-169": { sellingPrice: 150, lastPriceReview: "2026-10-30" },
  // History — the 2026-09-02 approval below was withdrawn 2026-09-06:
  // "Pod-169": { sellingPrice: 129, lastPriceReview: "2026-09-02" },
  //   ^ WITHDRAWN 2026-09-06 (owner decision, LAUNCH_AUDIT item 11): the card shows an INFY PLUS
  //     device with a flavour set that is not the one sold here — wrong-variant imagery.
  //     Entry removed = unpublished; data/media/copy kept. Re-add to republish with a correct photo.
  // REPUBLISHED round list19 (2026-10-17): LAMBDA's own per-colour store photos replace the withdrawn crop (all 6 colours).
  // Price = Shipnity MAX "ราคาขาย" ฿2,390 for IQOSHEET-14 and every child (Max list 2026-10-08 + re-read 2026-10-17);
  // owner rule for warehouse products = the warehouse price (owner list item 41).
  "IQOSHEET-14": { sellingPrice: 2390, lastPriceReview: "2026-10-17" },
  // History — the 2026-09-02 approval below was withdrawn 2026-09-06:
  // "IQOSHEET-14": { sellingPrice: 2390, lastPriceReview: "2026-09-02" },
  //   ^ WITHDRAWN 2026-09-06 (owner decision, LAUNCH_AUDIT item 11): LAMBDA card is a blurry crop
  //     from a lifestyle photo — not acceptable for a ฿2,390 device. Entry removed = unpublished;
  //     data/media/copy kept. Re-add to republish once an isolated product photo exists.
  // IQOSHEET-15 (IQOS TEREA) — WITHDRAWN from publication (owner quality review, 2026-09-03,
  // Sections 6/7). Was approved above at ฿220 as of 2026-09-02; the owner's screenshot-based
  // review does not approve the current TEREA presentation and asked for it to come down "for
  // now, until a future review approves it again." Re-evaluating against the new visual/truth
  // standard (Section 7) confirms real coherence gaps behind that call: only 11 of this parent's
  // 16 real active flavor children have an exact official photo (the other 5 fall back to a
  // neutral placeholder), so the published flavor family is not yet uniformly backed by real
  // per-flavor media — an inconsistent set, not a complete one, even though every flavor name
  // itself is a verified real TEREA flavor. Removing this entry (rather than deleting any TEREA
  // data) is the actual, literal unpublish action per this file's own contract — every other
  // TEREA data/media/copy asset is left in place so a future pass can re-approve without
  // rebuilding. See docs/BUSINESS_SOURCE_OF_TRUTH.md if this withdrawal should also be reflected
  // there.
  // REPUBLISHED round p63 (2026-10-18): every iqos.com/id flavour now carries the maker's own pack render (#544).
  // Price = ฿220 per pack of 20 sticks (owner list item 69, 16/10 — BSOT §4; Shipnity MAX "ราคาขาย" is ฿220 too).
  "IQOSHEET-15": { sellingPrice: 220, lastPriceReview: "2026-10-18" },
  "IQOSHEET-16": { sellingPrice: 4900, lastPriceReview: "2026-09-02" },
  "IQOSHEET-18": { sellingPrice: 3900, lastPriceReview: "2026-09-02" },
  // Tier-1 disposable growth mission (2026-09-03): Pod-180 (nexBar CLEAR 18K — no brand since 2026-09-30) was the last
  // media-blocked candidate from a real Shipnity price+flavor set — see VERIFIED_MEDIA["Pod-180"]
  // for the sourcing. Same pricing rule as every entry above: single, unambiguous
  // operationalSellingPrice, no conflicting price found anywhere else in the project.
  "Pod-180": { sellingPrice: 359, lastPriceReview: "2026-09-03" },
  // Round list19 (18/10): KS Quikpro 15K cartridge — price = Shipnity MAX "ราคาขาย" ฿299 for the parent and every child
  // (Max product list read 2026-10-17, _incoming/img-1610/list19/max/shipnity-max-products-2026-10-17.json; owner rule for the
  // warehouse products: price = the warehouse "ราคาขาย", owner list item 41 / BSOT §4).
  "Pod-150": { sellingPrice: 299, lastPriceReview: "2026-10-18" },
  // Round list19 (18/10): KS Quikpro kit (Max-only, "Product 780") — Max "ราคาขาย" ฿389 for the parent and its 4 kit options (same read).
  "KS-QUIKPRO-KIT": { sellingPrice: 389, lastPriceReview: "2026-10-18" },
  // Round list19 (18/10): Pop Up 10K pod — Max "ราคาขาย" ฿199 for the parent and every flavour (same 17/10 read).
  "Pod-154": { sellingPrice: 199, lastPriceReview: "2026-10-18" },
  // Round list19 (19/10): Reswa Sportcan 12000 (Max "Product 1129596") — Max ราคาขาย ฿229 for the parent and its 5 flavours (read 2026-10-17).
  "Pod-142": { sellingPrice: 229, lastPriceReview: "2026-10-19" },
  // Round list19 (19/10): Nexswitch 16000 (Max "Product 1176446") — Max ราคาขาย ฿419 for the kit options Pod-161-* and ฿269 for the
  // refill-pod options Pod-162-* (Max list read 2026-10-17).
  "NEXSWITCH-16K-KIT": { sellingPrice: 419, lastPriceReview: "2026-10-19" },
  "NEXSWITCH-16K-POD": { sellingPrice: 269, lastPriceReview: "2026-10-19" },
  // List-new (30/10): nexBar Switch 15K pod (Max-only "Pod-181") — Max ราคาขาย ฿299 for the parent and its 15 flavours (read 30/10
  // ~22:40); BSOT §4 owner 16/10 "ใส่ตามคลัง" + owner 30/10 "ลงไปก่อนได้เลย".
  // owner 31/10 "เคาะแล้วนะครับ nexBar Switch 15K 329 Javis กำลังทำรูป" — ฿329 = Max ราคาขาย ฿299 +10% (BSOT §5 31/10); was ฿299.
  "NEXBAR-SWITCH-15K-POD": { sellingPrice: 329, lastPriceReview: "2026-10-31" },
  // List-new (31/10): dude pod 3 ml (Max "Pod-180", re-used code) — Max ราคาขาย ฿129 for the parent and its 10 flavours (read 31/10 ~18:25).
  // BSOT §5 (owner 31/10): Max ราคาขาย + 6–12%; +8% rounded up to a 9 = ฿149 (+15.5%, over the 12% cap) → ฿139 (+7.8%), the 9-ending inside the band.
  "DUDE-POD-3ML": { sellingPrice: 139, lastPriceReview: "2026-10-31" },
  // Round list19 (19/10): RELX LUMI 18K (Max-only "Disposable-44") — Max ราคาขาย ฿349 for the parent and its 16 flavours (read 2026-10-17).
  // owner-confirmed 2026-10-19: owner in chat "Relax lumi 18k ราคา 399 ครับ แก้เลยครับ" — owner override (was ฿349). Max says ฿349 until the admin updates it.
  // owner-confirmed 2026-10-29: new LUMI catalogue image prints ฿379 (Max cost ฿349 +8.6%; owner kept it 29 Oct 04:41) — was ฿399.
  "RELX-LUMI-18K": { sellingPrice: 379, lastPriceReview: "2026-10-29" },
  // Round p63 (19/10): ESKO BAR 20000 (Max-only "Pod-130") — owner list item 69 "ใส่ตามคลัง": Max ราคาขาย ฿389 for the parent and its 22 flavours (read 2026-10-17).
  "ESKO-BAR-20K": { sellingPrice: 389, lastPriceReview: "2026-10-19" },
  // Round list19 (19/10): ESKO BAR SWITCH 20K refill pod (Max-only "Pod-160") — Max ราคาขาย ฿349 for the parent and its 18 flavours (read 2026-10-17).
  // owner-confirmed 2026-10-22: admin ICE's LINE 22/10 15.00 "หัวน้ำยา Esko. ปรับเป็นราคา 400.-", forwarded by the owner "แก้เรื่องราคาตามแอดมิน
  // พี่แจ้งมา" — owner override (was ฿349). Max says ฿349 until the admin updates it.
  "ESKO-BAR-SWITCH-POD": { sellingPrice: 400, lastPriceReview: "2026-10-22" },
  // Round list19 (18/10, owner ruling "list it, warehouse data only"): SKE Crystal B20000 — Max "ราคาขาย" ฿329 (parent "Product 1141360"
  // and its 8 children Pod-149-*, 17/10 read).
  "Pod-149": { sellingPrice: 329, lastPriceReview: "2026-10-18" },
  // Round list19 (18/10, owner "list everything"): Marbo Saltnic — Max "ราคาขาย" ฿269 for parent ELQ-1 and its 10 flavours (17/10 read;
  // the ฿807 child ELIQUID-1-1 is a bundle, not an option).
  // owner-confirmed 2026-10-19: owner in chat "ปรับราคา mar saltnic ครับ 290" + "ครับทำเลย" to the plan "all 10 flavours ฿290" — owner override
  // (was ฿269). Max still lists ฿269 for ELQ-1 and its flavours; the site price is the owner's and differs from Max until the admin updates Max.
  "ELIQUID-1": { sellingPrice: 290, lastPriceReview: "2026-10-19" },
  // Round list19 (19/10): Pepo Salt Nic (Max ELQ-5) and Dundu Salt Nic (Max Eliquid-73) — Max ราคาขาย ฿300 each (read 2026-10-17).
  // maxlist (21/10): Double Mint Salt Nic (Max ELQ-64) — Max ราคาขาย ฿300 for the parent and its 6 flavours (read 2026-10-20); owner 21/10 "ลงคลังปกติ".
  "Eliquid-64": { sellingPrice: 300, lastPriceReview: "2026-10-21" },
  "Eliquid-72": { sellingPrice: 300, lastPriceReview: "2026-10-19" },
  "Eliquid-73": { sellingPrice: 300, lastPriceReview: "2026-10-19" },
  // Round list19 (19/10): Marbo Freebase (Max ELQ-3, old seed Eliquid-109) — Max ราคาขาย ฿159 for the parent and its 4 flavours (read 2026-10-17).
  "Eliquid-109": { sellingPrice: 159, lastPriceReview: "2026-10-19" },
  // Round list19 (19/10): Super Cool Salt Nic (Max ELQ-6) — Max ราคาขาย ฿269 for the parent and its 10 flavours (read 2026-10-17).
  // owner-confirmed 2026-10-22: admin ICE's LINE 22/10 15.00 "SUPERCOOL SALTNIC ปรับเป็นขวดละ 280.-", forwarded by the owner "แก้เรื่องราคา
  // ตามแอดมินพี่แจ้งมา" — owner override (was ฿269), every flavour. Max says ฿269 until the admin updates it.
  "SUPER-COOL-SALTNIC": { sellingPrice: 280, lastPriceReview: "2026-10-22" },
  // Round list19 (19/10): prepared, held until a card photo exists (IMAGE_SPEC §4) — Max ราคาขาย read 2026-10-17:
  "PUNTA-ICE": { sellingPrice: 150, lastPriceReview: "2026-10-19" },
  "INFY-POD": { sellingPrice: 690, lastPriceReview: "2026-10-19" },
  // maxlist (20/10): RELX Essential 2 (Max-only "Pod-157") — Max ราคาขาย ฿490 for the parent and its 4 colours (read 2026-10-20).
  "RELX-ESSENTIAL-2": { sellingPrice: 490, lastPriceReview: "2026-10-20" },
  // maxlist (20/10): RELX Infinity Pro 2 pods (Max-only "Pod-27") — Max ราคาขาย ฿149 for the parent and its 42 flavours (read 2026-10-20).
  "RELX-INFINITY-PRO-2-POD": { sellingPrice: 149, lastPriceReview: "2026-10-20" },
  // line 2 max-sync (22/10): RELX Creator Pod 20K (Max-only "Pod-137") — Max ราคาขาย ฿349 for each of the 31 pods (read 2026-10-22; the ฿199 parent row is the empty device).
  // Card added by line 1 (23/10, VERIFIED_MEDIA["RELX-CREATOR-POD-20K"]).
  "RELX-CREATOR-POD-20K": { sellingPrice: 349, lastPriceReview: "2026-10-22" },
  // maxlist (21/10): VOOPOO Argus Pod cartridge (Max Coil-21) — Max ราคาขาย ฿450 for the parent and its 4 options (read 2026-10-20).
  "Coil-21": { sellingPrice: 450, lastPriceReview: "2026-10-21" },
  "VMATE-PRO-2": { sellingPrice: 890, lastPriceReview: "2026-10-19" },
  // owner-confirmed 2026-10-19: "ราคา Graple Freebase: ฿160.-" — one price for the parent and its option (Max says ฿795 parent / ฿159 child
  // until the admin updates it). Held until a card photo exists.
  "GRAPLE-FREEBASE": { sellingPrice: 160, lastPriceReview: "2026-10-19" },
  // owner-confirmed 2026-10-19: "ราคา MQ Bar 22K: ฿390.-" — one price for the parent and all 11 flavours (Max says ฿369 parent / ฿359
  // flavours until the admin updates it). Held until a card photo exists.
  "MQ-BAR-22K": { sellingPrice: 389, lastPriceReview: "2026-10-31" }, // owner 31/10 "389 ตามภาพ": the image prints 389; Max ราคาขาย 369 parent / 359 flavours read 31/10 = +5.4% / +8.4%
  // Owner brief 26/10: SUP Zero 22K (Max-only "Disposable-45") — Max ราคาขาย ฿329 for the parent and its 15 flavours (read 2026-10-26 17:30).
  // owner-confirmed 2026-10-29: owner in chat "SUP ZERO 22K ราคาในรูปพิมพ์ ตามรูป" — the catalogue image prints ฿350 (Max cost ฿329 +6.4%) — was ฿329.
  "SUP-ZERO-22K": { sellingPrice: 350, lastPriceReview: "2026-10-29" },
  // List-new (27/10): Marbo 10K (เทียบแท้) (Max-only "Disposable-47") — Max ราคาขาย ฿299 for the parent and its 12 flavours (read 2026-10-27);
  // owner 27/10 "ราคา ฿299". Card = the site's M Bar 10K photo (owner 27/10 "ใช้รูป M Bar 10K ที่เว็บมีอยู่ได้เลย", HANDOFF §18).
  "MARBO-10K-CLONE": { sellingPrice: 299, lastPriceReview: "2026-10-27" },
};

export function getPublicationApproval(shipnityProductId: string): PublicationApproval | undefined {
  return OWNER_APPROVED_PUBLICATION[shipnityProductId];
}
