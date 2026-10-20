# Shipnity Max × site — what Max has and the site lacks (round maxlist-2010, chunk 1)

Read: Max product list, live, 20/10 22:50 (783 rows = 66 parent codes, all "แสดงเพิ่ม" expanded; product list only, no order pages).
Match rule: a Max parent counts as "on the site" when any of its codes is in `src/data/stock/sku-map.ts` AND the product is not
`hiddenFromStorefront`. Price = Max "ราคาขาย" (owner decision, item 41). Nothing here edits Max or the site.

## A. Max has it, site has no live page (10 rows)

| # | Max code | Max name | ราคาขาย | Max kids (in stock) | Site state | Blocker / next step | Order |
|---|---|---|---|---|---|---|---|
| 1 | Disposable-42 | Foli Bar 15k | 349 | 12 (12) | `foli-bar-15k` exists in code, **hidden** (no card photo, 9-flavour SKU; Max now has 12 flavours) | unhide needs card image (IMAGE_SPEC §4) + 12 flavours matched | 1 |
| 2 | ELQ-4 | Muro Salt Nic | 250 | 6 (6) | `muro-salt-nic` in code, **hidden** (no card photo) | card image (Muro brand shots exist for Muro line) | 2 |
| 3 | Eliquid-169 | Muro Freebase | 220 | 6 (3) | `muro-freebase` in code, **hidden** (no card photo) | card image | 3 |
| 4 | Pod-115 | หัวพอต Vazer One | 59 | 5 (1) | `vazer-one-pod` in code, **hidden** (card showed another site's URL) | clean photo from maker vazerpod.com | 4 |
| 5 | Pod-142 | Reswa Sportcan 12000 | 229 | 5 (1) | `reswa-sportcan-12k` in code, **hidden** (banner crop) | clean card image | 5 |
| 6 | Pod-157 | Relx Essential 2 | 490 | 4 (3) | no product in code | new page; maker = RELX official (tier 1) | 6 |
| 7 | Pod-137 | Relx Creator Pod 20K | 349 | 31 (0) | no product in code (RELX Creator device page exists, pods only as accessory text) | new page; all 31 flavours sold out = "สินค้าหมด" | 7 |
| 8 | Pod-27 | หัวพอต RELX Infinity Pro 2 | 149 | 42 (18) | no product in code (Infinity 2 Plus is a different device) | new page; 42 flavours incl. 50 mg | 8 |
| 9 | Coil-21 | คอยล์ Argus Pod | 450 | 4 (1) | no product in code | new page; VOOPOO Argus Pod coils | 9 |
| 10 | ELQ-64 | Double Mint Salt Nic | 300 | 6 (2) | no product in code | new page; Thai-market brand, no maker site → identity check first | 10 |

## A2. Status 21/10 (after the listing PRs)

| Row | State |
|---|---|
| ELQ-4 Muro Salt Nic | **LIVE** (PR #660, 6 flavours, ฿250) |
| Pod-157 Relx Essential 2 | **LIVE** (PR #664, 4 Max colours + the shop's Orange, ฿490) |
| Pod-27 RELX Infinity Pro 2 pods | **LIVE** (PR #664, 42 flavours, ฿149, card = Watermelon Ice pack, 41 flavours no-photo panel) |
| Coil-21 VOOPOO Argus Pod | **LIVE** (PR #666, 4 options, ฿450) |
| Pod-115 Vazer One | PR in review (legacy page unhidden; 21 flavours = Max 5 with new studio photos + the maker's other 16 as sold-out, no-photo; ฿59; card = Mango) |
| Pod-142 Reswa Sportcan 12K | **already LIVE** as /products/pod-142 since list19 (card + 4 of 5 flavours; Red Bull has no photo on purpose — Friday 18/10, third-party trademark). The hidden legacy copy `reswa-sportcan-12k` in unbranded.ts is a duplicate and is not shown. Section A's row 5 ("hidden, needs a card image") was wrong. |
| Eliquid-169 Muro Freebase | blocked: no bottle photo found (owner photo wanted) · price to use = Max ฿220 (the legacy approval's 250 is old) |
| ELQ-64 Double Mint Salt Nic | **held**: the bottle prints "RIGLEY'S DOUBLEMINT CHEWING GUM" in Wrigley's trade dress — a confirmed counterfeit; the code (active-catalog-to-product-master.ts, 2/9) says never admit it without an explicit owner decision. Asked Friday 21/10; no render made |
| Disposable-42 Foli Bar 15k | blocked: identity + image — two Foli lines are sold ("Foli Bar 15000" on pod789 = Max's name, smoky tapered device; "Foli Cool Bar 15000" on ihavevape, short black device); the only "Foli Bar" artwork is a 600 px poster with ~45 px devices → owner photo of the real stock needed |
| Pod-137 Relx Creator Pod 20K | skipped: identity not confirmed — shops sell "Creator Boost 20000" / "Creator Pod Clear 18K", none names a 31-flavour "Creator Pod 20K" |

## B. Max parents that ARE on the site (checked in sku-map, not hidden) — 54 parents, no action
Includes everything list19 listed (Disposable-43, Pod-176, eliquid-78, Pod-173, ELQ-6) and the Nexswitch, Esko, Infy, M Switch,
Marbo, Muro Connector/SC, IQOS, Lambda i8, Joiway F3, Caliburn/Vinci/TPP coils lines. Full parent list with prices =
`_incoming/maxlist-2010/max-parents-2010-live.txt` (not in git).

## C. Earlier-list (16/10, 21 items) rows that are NOT in Max any more or are done
- Done/listed since: Pod-149 · Pod-150 · Pod-154 · Pod-169 · ELQ-1 (Marbo) · ELQ-5 (Pepo) · ELQ-3 (Marbo Freebase tall) · IQOSHEET-14/15/17 · Eliquid-73.
- **Not in the live Max list on 20/10:** Coil-63 (Jellybox Nano), Coil-62 (Feelin C1), Eliquid-44 (Dooze), Eliquid-66 (BAAM),
  eliquid-133 (Yogurt Salt Hub), Disposable-34 (Insta Bar PX 15000) → cannot take a Max price → **blocked: not in Max now**
  (ask owner only if he wants them anyway; otherwise dropped).
- Pod-168 Caliburn G4 Pro = already on the site (void).
- Test rows in Max (`test`, `Close` ยิงปิด) = not products, ignored.

## D. Order and blockers
1. Foli Bar 15K → Muro Salt Nic → Muro Freebase (one Muro PR: two products of one brand) → Vazer One → Reswa Sportcan.
2. New pages: Relx Essential 2 → Relx Infinity Pro 2 pods → Relx Creator Pod 20K (RELX PR, 2–3 products) → Argus Pod coils → Double Mint.
3. Blockers: card images for 1–5 (the 19 masters in `_incoming/img-1610/masters` do not include these; new renders = tell Friday count + credits first).
   Higgsfield MCP generate is denied → renders only via Chrome tab. SEO-locked links: none of these rows link into the locked pages.
